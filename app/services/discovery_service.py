from __future__ import annotations

from typing import Any

import httpx

from app.services.opportunities_service import DEFAULT_CONFIGS, opportunities_service


def _safe_num(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _normalize_perp_symbol(symbol: str) -> str:
    raw = str(symbol or "").upper().strip()
    return raw.replace("_USDT_PERP", "USDT").replace("_", "").replace("/", "")


def _score_discovery(candidate: dict[str, Any], market_row: dict[str, Any]) -> dict[str, Any]:
    metrics = candidate.get("metrics") if isinstance(candidate.get("metrics"), dict) else {}
    status = str(candidate.get("status") or "No Data")
    grid_daily = _safe_num(metrics.get("gridDailyProfit"), 0.0)
    close_1 = _safe_num(metrics.get("expectedClosePnlAfter1PctAdverse"), 0.0)
    coverage = _safe_num(metrics.get("coverage1Pct"), 0.0)
    min_coverage = _safe_num(candidate.get("minCoverage"), 2.0) or 2.0
    inventory = _safe_num(metrics.get("estimatedInventoryRatioAfter1Pct"), 1.0)
    pos30 = metrics.get("rangePosition30D")
    pos30_val = float(pos30) if isinstance(pos30, (int, float)) else None
    volume = _safe_num(market_row.get("quoteVolume24h"), 0.0)
    trades = _safe_num(market_row.get("trades24h"), 0.0)

    liquidity_score = min(100.0, (volume / 1_000_000.0) * 55.0 + (trades / 100_000.0) * 45.0)
    pnl_score = min(35.0, max(0.0, grid_daily) * 35.0) + (35.0 if close_1 > 0 else 0.0) + min(30.0, (coverage / max(1.0, min_coverage)) * 30.0)
    inventory_score = max(0.0, min(100.0, (0.12 - inventory) / 0.12 * 100.0))
    range_score = 100.0 if pos30_val is not None and 0.25 <= pos30_val <= 0.75 else 55.0 if pos30_val is not None and 0.15 <= pos30_val <= 0.85 else 15.0
    discovery_score = liquidity_score * 0.2 + pnl_score * 0.45 + inventory_score * 0.2 + range_score * 0.15

    if status == "Candidate" and discovery_score >= 70:
        discovery_status = "Promote"
    elif status in {"Candidate", "Watch"} and discovery_score >= 55:
        discovery_status = "Watch"
    elif status == "No Data":
        discovery_status = "No Data"
    else:
        discovery_status = "Reject"

    return {
        "discoveryStatus": discovery_status,
        "discoveryScore": round(discovery_score, 1),
        "scores": {
            "liquidity": round(liquidity_score, 1),
            "pnlStress": round(pnl_score, 1),
            "inventory": round(inventory_score, 1),
            "range": round(range_score, 1),
        },
    }


class DiscoveryService:
    async def _fetch_pionex_universe(self, *, min_quote_volume: float, min_trades: int, limit: int) -> list[dict[str, Any]]:
        symbols_url = "https://api.pionex.com/api/v1/common/symbols"
        tickers_url = "https://api.pionex.com/api/v1/market/tickers"
        async with httpx.AsyncClient(timeout=20.0) as client:
            symbols_res = await client.get(symbols_url)
            tickers_res = await client.get(tickers_url)
        symbols_res.raise_for_status()
        tickers_res.raise_for_status()
        symbols_payload = symbols_res.json() if isinstance(symbols_res.json(), dict) else {}
        tickers_payload = tickers_res.json() if isinstance(tickers_res.json(), dict) else {}

        data = symbols_payload.get("data") if isinstance(symbols_payload.get("data"), dict) else {}
        raw_symbols = data.get("symbols") if isinstance(data.get("symbols"), list) else []
        tradeable: dict[str, dict[str, Any]] = {}
        for item in raw_symbols:
            if not isinstance(item, dict):
                continue
            symbol = str(item.get("symbol") or "").upper()
            if item.get("type") != "PERP" or item.get("quoteCurrency") != "USDT":
                continue
            if not symbol.endswith("_USDT_PERP"):
                continue
            normalized = _normalize_perp_symbol(symbol)
            if not normalized.isascii() or not normalized.endswith("USDT"):
                continue
            tradeable[normalized] = {"symbol": normalized, "pionexSymbol": symbol}

        ticker_data = tickers_payload.get("data") if isinstance(tickers_payload.get("data"), dict) else {}
        raw_tickers = ticker_data.get("tickers") if isinstance(ticker_data.get("tickers"), list) else []
        for item in raw_tickers:
            if not isinstance(item, dict):
                continue
            normalized = _normalize_perp_symbol(str(item.get("symbol") or ""))
            if normalized not in tradeable:
                continue
            tradeable[normalized]["quoteVolume24h"] = _safe_num(item.get("amount"), 0.0)
            tradeable[normalized]["trades24h"] = int(_safe_num(item.get("count"), 0.0) or 0)
            tradeable[normalized]["change24h"] = _safe_num(item.get("close"), 0.0) - _safe_num(item.get("open"), 0.0)

        rows = [r for r in tradeable.values() if (r.get("quoteVolume24h") or 0) >= min_quote_volume and (r.get("trades24h") or 0) >= min_trades]
        rows.sort(key=lambda r: (r.get("quoteVolume24h") or 0, r.get("trades24h") or 0), reverse=True)
        return rows[: max(1, limit)]

    async def list_discovery(self, *, limit: int, capital: float, min_quote_volume: float, min_trades: int, source: str) -> dict[str, Any]:
        errors: list[dict[str, str]] = []
        try:
            universe = await self._fetch_pionex_universe(min_quote_volume=min_quote_volume, min_trades=min_trades, limit=limit)
        except Exception as exc:  # noqa: BLE001
            errors.append({"scope": "universe", "message": str(exc)})
            fallback_symbols = opportunities_service.parse_universe(None)[:limit]
            universe = [{"symbol": s, "quoteVolume24h": 0.0, "trades24h": 0} for s in fallback_symbols]

        rows: list[dict[str, Any]] = []
        cfg = DEFAULT_CONFIGS[0]
        for row in universe:
            symbol = str(row.get("symbol") or "")
            try:
                candidate = await opportunities_service._build_candidate(  # noqa: SLF001
                    symbol=symbol,
                    config=cfg,
                    capital=capital,
                    target_daily_usdt=1.0,
                    source=source,
                )
                scored = _score_discovery(candidate, row)
                rows.append({**candidate, **scored, "market": row})
            except Exception as exc:  # noqa: BLE001
                errors.append({"symbol": symbol, "message": str(exc)})
                rows.append({"symbol": symbol, "status": "No Data", "discoveryStatus": "No Data", "discoveryScore": 0.0, "decisionReason": str(exc), "market": row})

        order = {"Promote": 0, "Watch": 1, "Reject": 2, "No Data": 3}
        rows.sort(key=lambda r: (order.get(r.get("discoveryStatus"), 9), -(float(r.get("discoveryScore") or 0.0))))
        best = next((r for r in rows if r.get("discoveryStatus") == "Promote"), None) or next((r for r in rows if r.get("discoveryStatus") == "Watch"), None)

        return {
            "ok": True,
            "summary": {
                "scannedSymbols": len(universe),
                "evaluatedRows": len(rows),
                "limit": limit,
                "minQuoteVolume": min_quote_volume,
                "minTrades": min_trades,
                "promoteCount": sum(1 for r in rows if r.get("discoveryStatus") == "Promote"),
                "watchCount": sum(1 for r in rows if r.get("discoveryStatus") == "Watch"),
                "rejectedCount": sum(1 for r in rows if r.get("discoveryStatus") == "Reject"),
                "noDataCount": sum(1 for r in rows if r.get("discoveryStatus") == "No Data"),
                "bestSymbol": best.get("symbol") if best else None,
                "source": source,
            },
            "candidates": rows,
            "errors": errors,
        }


discovery_service = DiscoveryService()
