from typing import Any


def safe_float(value: Any, default: float | None = None) -> float | None:
    try:
        if value is None or value == "":
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def compute_range_health(range_position: float | None) -> str:
    if range_position is None:
        return "unknown"
    if range_position < 0 or range_position > 1:
        return "outside"
    if range_position <= 0.15:
        return "near_low_edge"
    if range_position >= 0.85:
        return "near_high_edge"
    return "healthy"


def _inventory_gate(inventory_ratio: float | None) -> dict[str, Any]:
    if inventory_ratio is None:
        return {"status": "warn", "label": "Unknown"}
    if inventory_ratio < 0.05:
        return {"status": "pass", "label": "Clean"}
    if inventory_ratio < 0.10:
        return {"status": "warn", "label": "Watch"}
    return {"status": "fail", "label": "Heavy"}


def _promo_health(close_profit: float | None, trend_pnl: float | None, inventory_ratio: float | None, range_health: str) -> dict[str, Any]:
    score = 0.0
    score += 35.0 if (close_profit or 0.0) > 0 else 0.0
    score += 25.0 if (trend_pnl is not None and trend_pnl >= 0) else 10.0
    score += 25.0 if (inventory_ratio is not None and inventory_ratio < 0.08) else 8.0
    score += 15.0 if range_health == "healthy" else 5.0
    label = "Promo healthy" if score >= 80 else "Watchable" if score >= 65 else "Not promo"
    return {"score": round(score, 1), "label": label}


def _harvest_policy(close_profit: float | None, target_daily: float, trend_pnl: float | None, inventory_ratio: float | None, range_health: str) -> dict[str, Any]:
    cp = close_profit or 0.0
    buffer = max(0.20, target_daily * 0.25)
    available = max(0.0, cp - buffer)

    blockers: list[str] = []
    if cp < target_daily:
        blockers.append("closeable PnL below target")
    if trend_pnl is not None and trend_pnl < 0:
        blockers.append("negative trend PnL")
    if inventory_ratio is not None and inventory_ratio >= 0.10:
        blockers.append("inventory too heavy")
    if range_health != "healthy":
        blockers.append("price not centered in range")

    if not blockers and available >= target_daily:
        action = "Release daily target"
        amount = min(target_daily, available)
        status = "pass"
    elif not blockers and available > 0:
        action = "Release partial"
        amount = available
        status = "warn"
    else:
        action = "Hold"
        amount = 0.0
        status = "warn"

    return {
        "status": status,
        "action": action,
        "suggestedAmountUsdt": round(amount, 3),
        "bufferUsdt": round(buffer, 3),
        "availableAfterBufferUsdt": round(available, 3),
        "blockers": blockers,
    }


def enrich_miner_metrics(miner: dict[str, Any], *, target_daily_usdt: float = 1.0) -> dict[str, Any]:
    row = dict(miner)
    quote_investment = safe_float(row.get("quoteInvestment"), 0.0) or 0.0
    total_profit = safe_float(row.get("totalProfit"), None)
    grid_profit = safe_float(row.get("gridProfit"), 0.0) or 0.0
    close_profit = safe_float(row.get("closeProfit"), total_profit if total_profit is not None else 0.0)
    trend_pnl = close_profit - grid_profit if close_profit is not None else None

    position = safe_float(row.get("position"), 0.0) or 0.0
    current_price = safe_float(row.get("currentPrice"), None)
    position_notional = abs(position) * current_price if current_price is not None else 0.0
    inventory_ratio = (position_notional / quote_investment) if quote_investment > 0 else None

    bottom = safe_float(row.get("bottom"), None)
    top = safe_float(row.get("top"), None)
    if current_price is not None and bottom is not None and top is not None and top > bottom:
        range_position = (current_price - bottom) / (top - bottom)
    else:
        range_position = None

    range_health = compute_range_health(range_position)
    inventory_gate = _inventory_gate(inventory_ratio)
    promo_health = _promo_health(close_profit, trend_pnl, inventory_ratio, range_health)
    harvest = _harvest_policy(close_profit, target_daily_usdt, trend_pnl, inventory_ratio, range_health)

    row["trendPnl"] = trend_pnl
    row["inventoryRatio"] = inventory_ratio
    row["rangePosition"] = range_position
    row["rangeHealth"] = range_health
    row["closeProfit"] = close_profit
    row["targetDailyUsdt"] = target_daily_usdt
    row["inventoryGate"] = inventory_gate
    row["promoHealth"] = promo_health
    row["harvestPolicy"] = harvest
    return row


def normalize_account_balance(payload: dict[str, Any]) -> dict[str, Any]:
    data = payload.get("data") if isinstance(payload.get("data"), dict) else {}
    balances = data.get("balances") if isinstance(data.get("balances"), list) else []

    assets: list[dict] = []
    estimated_total_usd = 0.0
    for item in balances:
        if not isinstance(item, dict):
            continue
        coin = str(item.get("coin") or item.get("asset") or "").upper()
        free = safe_float(item.get("free"), 0.0) or 0.0
        frozen = safe_float(item.get("frozen"), 0.0) or 0.0
        total = free + frozen
        if not coin or total <= 0:
            continue
        usd_value = (
            safe_float(item.get("usdValue"), None)
            or safe_float(item.get("totalValue"), None)
            or safe_float(item.get("value"), None)
            or safe_float(item.get("amountUsd"), None)
        )
        if usd_value is not None and usd_value > 0:
            estimated_total_usd += usd_value
        assets.append({"coin": coin, "free": free, "frozen": frozen, "total": total, "usdValue": usd_value})

    usdt = next((asset for asset in assets if asset["coin"] == "USDT"), None)
    non_usdt = [asset for asset in assets if asset["coin"] != "USDT"]

    return {
        "ok": bool(payload.get("result")),
        "timestamp": payload.get("timestamp"),
        "usdt": usdt or {"coin": "USDT", "free": 0.0, "frozen": 0.0, "total": 0.0},
        "assets": assets,
        "nonUsdtAssets": non_usdt,
        "assetsCount": len(assets),
        "estimatedTotalUsd": estimated_total_usd if estimated_total_usd > 0 else None,
    }
