import asyncio
import time
from collections.abc import Sequence

import httpx
from fastapi import HTTPException

COINGECKO_BASE = "https://api.coingecko.com/api/v3"

COINGECKO_IDS = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
    "BNB": "binancecoin",
    "XRP": "ripple",
    "ADA": "cardano",
    "DOGE": "dogecoin",
    "AVAX": "avalanche-2",
    "LINK": "chainlink",
    "TON": "the-open-network",
    "TRX": "tron",
    "DOT": "polkadot",
    "BCH": "bitcoin-cash",
    "LTC": "litecoin",
    "UNI": "uniswap",
    "AAVE": "aave",
    "NEAR": "near",
    "ATOM": "cosmos",
    "ETC": "ethereum-classic",
    "FIL": "filecoin",
    "OP": "optimism",
    "ARB": "arbitrum",
    "INJ": "injective-protocol",
    "SUI": "sui",
    "APT": "aptos",
    "SEI": "sei-network",
    "TIA": "celestia",
    "HBAR": "hedera-hashgraph",
    "XLM": "stellar",
    "LDO": "lido-dao",
    "MATIC": "matic-network",
    "ZEC": "zcash",
}


class MarketDataService:
    def __init__(self) -> None:
        self._cache: dict[str, tuple[float, object]] = {}

    async def _coingecko_get_json(self, path: str, params: dict, cache_key: str, ttl_seconds: int = 45) -> object:
        now = time.time()
        cached = self._cache.get(cache_key)
        if cached and now - cached[0] < ttl_seconds:
            return cached[1]

        url = f"{COINGECKO_BASE}{path}"
        last_error: Exception | None = None
        for attempt in range(1, 4):
            try:
                async with httpx.AsyncClient(timeout=20.0) as client:
                    response = await client.get(url, params=params)
                if response.status_code == 429:
                    await asyncio.sleep(attempt * 2)
                    continue
                response.raise_for_status()
                payload = response.json()
                self._cache[cache_key] = (time.time(), payload)
                return payload
            except Exception as exc:  # noqa: BLE001
                last_error = exc
        raise HTTPException(status_code=502, detail=f"CoinGecko error: {last_error}")

    def _normalize_base_symbol(self, ticker: str) -> str:
        value = str(ticker or "").upper().replace("/", "").replace("_", "").replace("-", "")
        for suffix in ("USDT", "USDC", "USD", "PERP"):
            if value.endswith(suffix) and len(value) > len(suffix):
                return value[: -len(suffix)]
        return value

    async def resolve_ticker_inputs(self, ticker: str) -> tuple[str, str]:
        base_symbol = self._normalize_base_symbol(ticker)
        if not base_symbol:
            raise HTTPException(status_code=400, detail="ticker is required")

        coin_id = COINGECKO_IDS.get(base_symbol)
        if not coin_id:
            raise HTTPException(status_code=404, detail=f"Unsupported ticker: {ticker}")

        return base_symbol, coin_id

    async def get_spot_prices_usd(self, symbols: Sequence[str]) -> dict[str, float]:
        normalized: list[tuple[str, str]] = []
        for symbol in symbols:
            base_symbol = self._normalize_base_symbol(symbol)
            coin_id = COINGECKO_IDS.get(base_symbol)
            if coin_id:
                normalized.append((base_symbol, coin_id))
        if not normalized:
            return {}

        ids = ",".join(sorted({coin_id for _, coin_id in normalized}))
        payload = await self._coingecko_get_json(
            path="/coins/markets",
            params={"vs_currency": "usd", "ids": ids, "sparkline": "false"},
            cache_key=f"spot-prices:{ids}",
            ttl_seconds=45,
        )
        rows = payload if isinstance(payload, list) else []
        by_id = {
            str(row.get("id") or ""): float(row.get("current_price") or 0.0)
            for row in rows
            if isinstance(row, dict) and row.get("id") and row.get("current_price") is not None
        }
        return {symbol: by_id.get(coin_id, 0.0) for symbol, coin_id in normalized if by_id.get(coin_id, 0.0) > 0}

    @staticmethod
    def aggregate_ohlc_by_hours(rows: Sequence[Sequence[float]], agg_hours: int) -> list[dict]:
        if agg_hours <= 1:
            return [
                {
                    "timestamp": int(r[0]),
                    "open": float(r[1]),
                    "high": float(r[2]),
                    "low": float(r[3]),
                    "close": float(r[4]),
                }
                for r in rows
            ]

        bucket_ms = agg_hours * 60 * 60 * 1000
        buckets: dict[int, dict] = {}
        for row in rows:
            ts = int(row[0])
            bucket = (ts // bucket_ms) * bucket_ms
            o, h, l, c = map(float, row[1:5])
            if bucket not in buckets:
                buckets[bucket] = {"timestamp": bucket, "open": o, "high": h, "low": l, "close": c}
            else:
                b = buckets[bucket]
                b["high"] = max(b["high"], h)
                b["low"] = min(b["low"], l)
                b["close"] = c

        return [buckets[k] for k in sorted(buckets.keys())]


market_data_service = MarketDataService()
