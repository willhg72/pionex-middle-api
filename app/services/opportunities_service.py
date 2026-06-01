import base64
import hashlib
import hmac
import json
import time
from dataclasses import dataclass
from typing import Any

from fastapi import HTTPException

from app.integrations.pionex_client import PionexClient
from app.services.analyzer_service import analyzer_service
from app.services.miners_utils import validate_api_keys


@dataclass(frozen=True)
class OpportunityConfig:
    key: str
    label: str
    worker_type: str
    leverage: float
    half_range_pct: float
    grids: int
    min_coverage: float


DEFAULT_UNIVERSE = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT", "AVAXUSDT", "LINKUSDT"]
DEFAULT_CONFIGS = [
    OpportunityConfig("robust_5x", "Robust 5x", "robust", 5.0, 0.10, 70, 2.0),
    OpportunityConfig("tactical_5x", "Tactical 5x", "scalper", 5.0, 0.055, 70, 1.5),
    OpportunityConfig("promo_like_8x", "Promo-like 8x", "robust", 8.0, 0.10, 90, 2.0),
]


class OpportunitiesService:
    def __init__(self) -> None:
        self._config_by_key = {cfg.key: cfg for cfg in DEFAULT_CONFIGS}

    @staticmethod
    def _safe_num(value: Any, default: float = 0.0) -> float:
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    def parse_universe(self, universe: str | None) -> list[str]:
        if not universe:
            return list(DEFAULT_UNIVERSE)
        rows = [x.strip().upper() for x in str(universe).split(",") if x.strip()]
        deduped: list[str] = []
        seen: set[str] = set()
        for s in rows:
            if s not in seen:
                deduped.append(s)
                seen.add(s)
        return deduped[:20] if deduped else list(DEFAULT_UNIVERSE)

    async def _build_candidate(self, *, symbol: str, config: OpportunityConfig, capital: float, target_daily_usdt: float, source: str) -> dict[str, Any]:
        resolved_source, klines = await analyzer_service.fetch_klines(
            symbol=symbol,
            interval="5m",
            limit=320,
            source=source,
            start_time=None,
            end_time=None,
        )
        closes = [k.close for k in klines]
        highs = [k.high for k in klines]
        lows = [k.low for k in klines]
        if not closes:
            raise HTTPException(status_code=502, detail=f"No market data for {symbol}")

        current = closes[-1]
        bottom = current * (1 - config.half_range_pct)
        top = current * (1 + config.half_range_pct)
        active_notional = capital * config.leverage
        per_volume = active_notional / current / config.grids
        grid_step = (top - bottom) / config.grids

        recent_high = max(highs[-288:]) if len(highs) >= 288 else max(highs)
        recent_low = min(lows[-288:]) if len(lows) >= 288 else min(lows)
        range_position_30d = (current - recent_low) / (recent_high - recent_low) if recent_high > recent_low else None

        grid_daily_profit = max(0.0, per_volume * grid_step * 18)
        inventory_ratio_1 = min(1.0, (0.01 / max(config.half_range_pct, 0.001)) * 0.5)
        trend_drag_1 = -(active_notional * inventory_ratio_1 * 0.01)
        close_1 = grid_daily_profit + trend_drag_1
        coverage_1 = grid_daily_profit / abs(trend_drag_1) if trend_drag_1 else None

        status = "Candidate"
        reasons: list[str] = []
        if grid_daily_profit < target_daily_usdt:
            status = "Watch"
            reasons.append("grid daily below target")
        if close_1 <= 0:
            status = "Reject"
            reasons.append("1% adverse close PnL is negative")
        if coverage_1 is not None and coverage_1 < config.min_coverage:
            status = "Watch" if status != "Reject" else status
            reasons.append("coverage below threshold")
        if range_position_30d is None or not 0.15 <= range_position_30d <= 0.85:
            status = "Reject"
            reasons.append("price too near range edge")

        order_parameters = {
            "pair": f"{symbol.replace('USDT', '')}/USDT Perp",
            "gridType": "Arithmetic",
            "leverage": config.leverage,
            "investmentUsdt": capital,
            "priceRange": {"bottom": bottom, "top": top},
            "grids": config.grids,
            "perVolume": per_volume,
            "currentReferencePrice": current,
            "stopLoss": {
                "low": bottom * 0.97,
                "high": top * 1.03,
                "delaySeconds": 5,
            },
            "takeProfit": {
                "enabled": config.worker_type == "scalper",
                "mode": "PnL" if config.worker_type == "scalper" else "Off",
                "valueUsdt": 1.2 if config.worker_type == "scalper" else None,
            },
        }

        return {
            "symbol": symbol,
            "configKey": config.key,
            "workerType": config.worker_type,
            "workerTypeLabel": config.label,
            "status": status,
            "decisionReason": "; ".join(reasons) if reasons else "passes gates",
            "capital": capital,
            "targetDailyUsdt": target_daily_usdt,
            "leverage": config.leverage,
            "perVolume": per_volume,
            "activeNotional": active_notional,
            "minCoverage": config.min_coverage,
            "metrics": {
                "gridDailyProfit": grid_daily_profit,
                "expectedClosePnlAfter1PctAdverse": close_1,
                "coverage1Pct": coverage_1,
                "rangePosition30D": range_position_30d,
                "estimatedInventoryRatioAfter1Pct": inventory_ratio_1,
            },
            "orderParameters": order_parameters,
            "source": resolved_source,
        }

    async def list_opportunities(self, *, universe: str | None, capital: float, source: str, target_daily_usdt: float) -> dict[str, Any]:
        symbols = self.parse_universe(universe)
        rows: list[dict[str, Any]] = []
        errors: list[dict[str, str]] = []
        for symbol in symbols:
            for cfg in DEFAULT_CONFIGS:
                try:
                    rows.append(await self._build_candidate(symbol=symbol, config=cfg, capital=capital, target_daily_usdt=target_daily_usdt, source=source))
                except Exception as exc:  # noqa: BLE001
                    errors.append({"symbol": symbol, "configKey": cfg.key, "message": str(exc)})
                    rows.append({
                        "symbol": symbol,
                        "configKey": cfg.key,
                        "workerType": cfg.worker_type,
                        "workerTypeLabel": cfg.label,
                        "status": "No Data",
                        "decisionReason": str(exc),
                    })
        order = {"Candidate": 0, "Watch": 1, "Reject": 2, "No Data": 3}
        rows.sort(key=lambda r: order.get(r.get("status"), 9))
        best = next((r for r in rows if r.get("status") == "Candidate"), None)
        return {
            "ok": True,
            "summary": {
                "bestSymbol": best.get("symbol") if best else None,
                "bestWorkerType": best.get("workerTypeLabel") if best else None,
                "candidatesCount": sum(1 for r in rows if r.get("status") == "Candidate"),
                "watchCount": sum(1 for r in rows if r.get("status") == "Watch"),
                "rejectedCount": sum(1 for r in rows if r.get("status") == "Reject"),
                "noDataCount": sum(1 for r in rows if r.get("status") == "No Data"),
                "capitalAssumed": capital,
                "targetDailyUsdt": target_daily_usdt,
                "source": source,
                "universeCount": len(symbols),
            },
            "opportunities": rows,
            "errors": errors,
        }

    def build_create_request_body(self, row: dict[str, Any]) -> dict[str, Any]:
        params = row.get("orderParameters") or {}
        pr = params.get("priceRange") or {}
        tp = params.get("takeProfit") or {}
        sl = params.get("stopLoss") or {}
        symbol = str(row.get("symbol") or "")
        base = symbol.removesuffix("USDT")

        bu_data: dict[str, Any] = {
            "top": str(pr.get("top")),
            "bottom": str(pr.get("bottom")),
            "row": int(params.get("grids")),
            "grid_type": "arithmetic",
            "trend": "no_trend",
            "leverage": int(float(params.get("leverage"))),
            "quoteInvestment": str(params.get("investmentUsdt")),
            "slippage": "0.001",
            "lossStopType": "price",
            "lossStop": str(sl.get("low")),
            "lossStopHigh": str(sl.get("high")),
            "lossStopDelay": int(sl.get("delaySeconds") or 5),
        }
        if tp.get("enabled"):
            bu_data["profitStopType"] = "profit_amount"
            bu_data["profitStop"] = str(tp.get("valueUsdt"))
            bu_data["profitStopDelay"] = 0

        return {
            "base": f"{base}.PERP",
            "quote": "USDT",
            "symbol": f"{base}_USDT_PERP",
            "buOrderData": bu_data,
        }

    def _sign_token(self, payload: dict[str, Any], secret: str) -> str:
        body = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
        b64 = base64.urlsafe_b64encode(body).decode("ascii").rstrip("=")
        sig = hmac.new(secret.encode("utf-8"), b64.encode("ascii"), hashlib.sha256).hexdigest()
        return f"{b64}.{sig}"

    def _verify_token(self, token: str, secret: str) -> dict[str, Any]:
        try:
            payload_b64, signature = token.split(".", 1)
            expected = hmac.new(secret.encode("utf-8"), payload_b64.encode("ascii"), hashlib.sha256).hexdigest()
            if not hmac.compare_digest(signature, expected):
                raise ValueError("invalid signature")
            padded = payload_b64 + "=" * (-len(payload_b64) % 4)
            payload = json.loads(base64.urlsafe_b64decode(padded.encode("ascii")).decode("utf-8"))
            if int(payload.get("expiresAt") or 0) <= int(time.time()):
                raise ValueError("expired")
            return payload
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Invalid confirmation token: {exc}") from exc

    def build_preview(self, row: dict[str, Any], *, secret: str) -> dict[str, Any]:
        can_create = row.get("status") == "Candidate"
        blockers = [] if can_create else ["Only Candidate opportunities can be created"]
        request_body = self.build_create_request_body(row)
        fingerprint = hashlib.sha256(json.dumps({"row": row, "requestBody": request_body}, sort_keys=True, default=str).encode("utf-8")).hexdigest()
        expires_at = int(time.time()) + 300
        token_payload = {
            "symbol": row.get("symbol"),
            "configKey": row.get("configKey"),
            "capital": row.get("capital"),
            "targetDailyUsdt": row.get("targetDailyUsdt"),
            "fingerprint": fingerprint,
            "approvedRequestBody": request_body,
            "expiresAt": expires_at,
        }
        return {
            "ok": can_create,
            "canCreate": can_create,
            "blockers": blockers,
            "confirmationToken": self._sign_token(token_payload, secret) if can_create else None,
            "expiresAt": expires_at if can_create else None,
            "fingerprint": fingerprint,
            "opportunity": row,
            "requestBody": request_body,
        }

    async def execute_create(self, *, token: str, row: dict[str, Any], api_key: str, api_secret: str, secret: str) -> dict[str, Any]:
        token_payload = self._verify_token(token, secret)
        preview = self.build_preview(row, secret=secret)
        if not preview.get("canCreate"):
            return {
                "ok": False,
                "pionex_created": False,
                "error_code": "opportunity_no_longer_createable",
                "error_message": "Opportunity no longer createable.",
                "request_body": preview.get("requestBody") or {},
            }

        if preview.get("fingerprint") != token_payload.get("fingerprint"):
            return {
                "ok": False,
                "pionex_created": False,
                "error_code": "opportunity_changed",
                "error_message": "Opportunity changed since preview; generate new preview.",
                "request_body": preview.get("requestBody") or {},
            }

        keys_ok, key_error = validate_api_keys(api_key, api_secret)
        if not keys_ok:
            raise HTTPException(status_code=400, detail=key_error)

        client = PionexClient(api_key, api_secret)
        try:
            result = await client.create_futures_grid_bot_from_body_strict(preview["requestBody"])
        finally:
            await client.close()

        return {
            "ok": bool(result.success),
            "pionex_created": bool(result.success),
            "bu_order_id": result.bu_order_id,
            "error_code": result.error_code,
            "error_message": result.error_message,
            "request_body": preview["requestBody"],
        }

    async def build_technical_gate(
        self, *, symbol: str, config_key: str, source: str, capital: float, target_daily_usdt: float
    ) -> dict[str, Any]:
        rows = await self.list_opportunities(
            universe=symbol,
            capital=capital,
            source=source,
            target_daily_usdt=target_daily_usdt,
        )
        candidate = next(
            (
                x
                for x in rows.get("opportunities", [])
                if str(x.get("symbol") or "").upper() == symbol.upper() and str(x.get("configKey") or "") == config_key
            ),
            None,
        )
        if not candidate:
            raise HTTPException(status_code=404, detail="Opportunity row not found")

        resolved_source, d1 = await analyzer_service.fetch_klines(
            symbol=symbol.upper(),
            interval="1d",
            limit=180,
            source=source,
            start_time=None,
            end_time=None,
        )
        closes = [k.close for k in d1]
        highs = [k.high for k in d1]
        lows = [k.low for k in d1]
        if len(closes) < 30:
            raise HTTPException(status_code=502, detail="Insufficient daily klines for technical gate")

        px = float(closes[-1])
        hi_30, lo_30 = max(highs[-30:]), min(lows[-30:])
        hi_90, lo_90 = max(highs[-90:]), min(lows[-90:])
        hi_180, lo_180 = max(highs), min(lows)
        rp_30 = (px - lo_30) / (hi_30 - lo_30) if hi_30 > lo_30 else 0.5
        rp_90 = (px - lo_90) / (hi_90 - lo_90) if hi_90 > lo_90 else 0.5
        edge_distance = min(rp_30, 1 - rp_30)
        chg_3 = (px / closes[-4] - 1) * 100 if len(closes) >= 4 and closes[-4] else 0.0
        chg_7 = (px / closes[-8] - 1) * 100 if len(closes) >= 8 and closes[-8] else 0.0
        chg_14 = (px / closes[-15] - 1) * 100 if len(closes) >= 15 and closes[-15] else 0.0
        chg_30 = (px / closes[-31] - 1) * 100 if len(closes) >= 31 and closes[-31] else 0.0
        ath_distance = (hi_180 / px - 1) * 100 if px > 0 else 0.0
        atl_distance = (px / lo_180 - 1) * 100 if lo_180 > 0 else 0.0

        def _ema(values: list[float], period: int) -> float | None:
            if len(values) < period:
                return None
            alpha = 2 / (period + 1)
            cur = sum(values[:period]) / period
            for value in values[period:]:
                cur = value * alpha + cur * (1 - alpha)
            return cur

        ema20 = _ema(closes, 20)
        ema50 = _ema(closes, 50)
        regime = "neutral"
        if ema20 and ema50:
            if px > ema20 > ema50:
                regime = "bull"
            elif px < ema20 < ema50:
                regime = "bear"
            else:
                regime = "mixed"

        checks: list[dict[str, Any]] = []
        reasons: list[str] = []
        score = 50.0
        critical_fails = 0

        def add_check(name: str, status: str, value: Any, detail: str, score_delta: float = 0.0, critical: bool = False) -> None:
            nonlocal score, critical_fails
            checks.append({"name": name, "status": status, "value": value, "detail": detail})
            score += score_delta
            if status == "fail":
                reasons.append(f"{name}: {detail}")
                if critical:
                    critical_fails += 1

        residency_ok = 0.2 <= rp_30 <= 0.8 and 0.2 <= rp_90 <= 0.8
        add_check(
            "Range residency 30d/90d",
            "pass" if residency_ok else ("warn" if 0.1 <= rp_30 <= 0.9 else "fail"),
            {"30d": round(rp_30, 4), "90d": round(rp_90, 4)},
            "Healthy mid-range positioning." if residency_ok else "Price is drifting too near range edge.",
            12 if residency_ok else (-6 if 0.1 <= rp_30 <= 0.9 else -14),
            critical=not residency_ok and not (0.1 <= rp_30 <= 0.9),
        )

        edge_ok = edge_distance >= 0.12
        add_check(
            "Range edge risk",
            "pass" if edge_ok else ("warn" if edge_distance >= 0.08 else "fail"),
            round(edge_distance, 4),
            "Enough room to absorb noise." if edge_ok else "Entry is too close to range boundary.",
            10 if edge_ok else (-4 if edge_distance >= 0.08 else -12),
            critical=edge_distance < 0.08,
        )

        recoil_ok = abs(chg_14) <= 14
        add_check(
            "Recent move 14d",
            "pass" if recoil_ok else "warn",
            round(chg_14, 3),
            "Recent move is not overheated." if recoil_ok else "Recent move is extended; timing risk is higher.",
            8 if recoil_ok else -5,
        )

        midpoint = (hi_180 + lo_180) / 2 if hi_180 > lo_180 else px
        midpoint_dist = ((px / midpoint) - 1) * 100 if midpoint else 0.0
        midpoint_ok = abs(midpoint_dist) <= 20
        add_check(
            "Midpoint vs ATH/ATL 180d",
            "pass" if midpoint_ok else "warn",
            round(midpoint_dist, 3),
            "Price is reasonably centered in long-term structure." if midpoint_ok else "Price is displaced from long-term midpoint.",
            7 if midpoint_ok else -4,
        )

        close_1 = float(((candidate.get("metrics") or {}).get("expectedClosePnlAfter1PctAdverse")) or 0.0)
        pnl_consistent = close_1 > 0
        add_check(
            "Closeable PnL after 1% adverse",
            "pass" if pnl_consistent else "fail",
            round(close_1, 6),
            "Closeable stress remains positive." if pnl_consistent else "Stress closeable PnL is negative.",
            14 if pnl_consistent else -16,
            critical=not pnl_consistent,
        )

        regime_status = "pass" if regime == "bull" else ("warn" if regime == "mixed" else "fail")
        add_check(
            "EMA20/EMA50 regime",
            regime_status,
            regime,
            "Trend regime supports continuation." if regime == "bull" else ("Regime is mixed; wait for confirmation." if regime == "mixed" else "Bear regime increases downside risk."),
            9 if regime == "bull" else (-2 if regime == "mixed" else -10),
            critical=regime == "bear" and str(candidate.get("workerType") or "") == "scalper",
        )

        score = max(0.0, min(100.0, score))
        if critical_fails > 0 or score < 52:
            recommendation = "REJECT"
            summary = "Technical context is weak for now; avoid new miner creation."
        elif score >= 74:
            recommendation = "GO"
            summary = "Setup is technically aligned; execution window is acceptable."
        else:
            recommendation = "WAIT"
            summary = "Setup is promising but timing/context needs confirmation."

        return {
            "ok": True,
            "symbol": symbol.upper(),
            "configKey": config_key,
            "workerType": candidate.get("workerType"),
            "workerTypeLabel": candidate.get("workerTypeLabel"),
            "recommendation": recommendation,
            "score": round(score, 2),
            "summary": summary,
            "checks": checks,
            "reasons": reasons,
            "metrics": {
                "residency30d": rp_30,
                "residency90d": rp_90,
                "edgeDistance": edge_distance,
                "change3dPct": chg_3,
                "change7dPct": chg_7,
                "change14dPct": chg_14,
                "change30dPct": chg_30,
                "athDistancePct": ath_distance,
                "atlDistancePct": atl_distance,
                "midpointDistancePct": midpoint_dist,
                "ema20": ema20,
                "ema50": ema50,
                "regime": regime,
                "source": resolved_source,
            },
            "candidateSnapshot": candidate,
            "advisoryOnly": True,
            "generatedAt": int(time.time() * 1000),
        }


opportunities_service = OpportunitiesService()
