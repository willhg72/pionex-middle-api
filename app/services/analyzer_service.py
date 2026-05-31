from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import HTTPException


ALLOWED_SOURCES = {"pionex"}
ALLOWED_INTERVALS = {"1m", "5m", "15m", "30m", "1h", "4h", "1d"}


@dataclass
class Kline:
    timestamp: int
    open: float
    high: float
    low: float
    close: float
    volume: float
    quote_volume: float
    trades: int
    taker_buy_base_volume: float
    taker_buy_quote_volume: float
    closed: bool = True


def asset_profile_for_symbol(symbol: str) -> str:
    s = symbol.upper()
    if any(token in s for token in ("PEPE", "DOGE", "SHIB", "FLOKI")):
        return "meme/high_volatility"
    if "BTC" in s or "ETH" in s:
        return "large_cap"
    return "mid_cap"


def default_execution_efficiency(symbol: str) -> float:
    profile = asset_profile_for_symbol(symbol)
    if profile == "meme/high_volatility":
        return 0.12
    if profile == "large_cap":
        return 0.18
    return 0.15


class AnalyzerService:
    async def fetch_klines(
        self,
        *,
        symbol: str,
        interval: str,
        limit: int,
        source: str | None,
        start_time: int | None,
        end_time: int | None,
    ) -> tuple[str, list[Kline]]:
        interval_norm = str(interval or "").strip().lower()
        if interval_norm not in ALLOWED_INTERVALS:
            raise HTTPException(status_code=400, detail=f"params invalid: interval must be one of {sorted(ALLOWED_INTERVALS)}")

        source_norm = (source or "pionex").strip().lower()
        if source_norm not in ALLOWED_SOURCES:
            raise HTTPException(status_code=400, detail="params invalid: source must be 'pionex'")

        # Temporary market data backend while we wire native Pionex klines module from the monolith logic.
        resolved_source = "pionex"

        params = {
            "symbol": symbol.upper(),
            "interval": interval_norm,
            "limit": max(1, min(int(limit), 2000)),
        }
        if start_time is not None:
            params["startTime"] = int(start_time)
        if end_time is not None:
            params["endTime"] = int(end_time)

        url = "https://api.binance.com/api/v3/klines"
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.get(url, params=params)
            response.raise_for_status()
            rows = response.json()
        except Exception as exc:  # noqa: BLE001
            raise HTTPException(status_code=502, detail=f"external provider failed: {exc}") from exc

        klines = [
            Kline(
                timestamp=int(row[0]),
                open=float(row[1]),
                high=float(row[2]),
                low=float(row[3]),
                close=float(row[4]),
                volume=float(row[5]),
                quote_volume=float(row[7]),
                trades=int(row[8]),
                taker_buy_base_volume=float(row[9]),
                taker_buy_quote_volume=float(row[10]),
                closed=True,
            )
            for row in rows
        ]

        if not klines:
            raise HTTPException(status_code=404, detail="ticker not supported or no data")

        return resolved_source, klines

    async def fetch_klines_for_lookback(
        self,
        *,
        symbol: str,
        interval: str,
        lookback_hours: int,
        source: str | None,
    ) -> tuple[str, list[Kline]]:
        interval_to_minutes = {
            "1m": 1,
            "5m": 5,
            "15m": 15,
            "30m": 30,
            "1h": 60,
            "4h": 240,
            "1d": 1440,
        }
        minutes = interval_to_minutes[interval]
        limit = max(100, min(2000, int((lookback_hours * 60) / minutes) + 5))
        end = datetime.now(timezone.utc)
        start = end - timedelta(hours=lookback_hours)

        return await self.fetch_klines(
            symbol=symbol,
            interval=interval,
            limit=limit,
            source=source,
            start_time=int(start.timestamp() * 1000),
            end_time=int(end.timestamp() * 1000),
        )


analyzer_service = AnalyzerService()
