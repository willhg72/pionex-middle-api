from __future__ import annotations

import asyncio
import csv
import io
from datetime import UTC, datetime

import httpx
from fastapi import HTTPException

from app.services.market_data_service import market_data_service

STOOQ_DAILY_URL = "https://stooq.com/q/d/l/"
AI_BASKET_TICKERS = ["NVDA.US", "MSFT.US", "AVGO.US", "AMD.US", "PLTR.US", "SMCI.US"]
PROXY_TICKERS = {
    "gold": "GLD.US",
    "silver": "SLV.US",
    "oil": "USO.US",
}
AI_MARKET_CAP_WEIGHTS = {
    "NVDA.US": 0.34,
    "MSFT.US": 0.28,
    "AVGO.US": 0.14,
    "AMD.US": 0.08,
    "PLTR.US": 0.08,
    "SMCI.US": 0.08,
}


class OverviewMacroService:
    async def _fetch_stooq_daily(self, symbol: str) -> list[dict]:
        cache_key = f"stooq:{symbol.lower()}"
        cached = market_data_service._cache.get(cache_key)
        now = datetime.now(tz=UTC).timestamp()
        if cached and now - cached[0] < 60 * 30:
            return cached[1]

        async with httpx.AsyncClient(timeout=20.0, follow_redirects=True) as client:
            response = await client.get(STOOQ_DAILY_URL, params={"s": symbol.lower(), "i": "d"})
        response.raise_for_status()
        rows = list(csv.DictReader(io.StringIO(response.text)))
        data: list[dict] = []
        for row in rows:
            if not row.get("Date") or row.get("Close") in {"", "0", "0.0", "null", "None"}:
                continue
            try:
                data.append(
                    {
                        "date": row["Date"],
                        "close": float(row["Close"]),
                        "volume": float(row["Volume"] or 0.0),
                    }
                )
            except Exception:  # noqa: BLE001
                continue
        if not data:
            raise HTTPException(status_code=502, detail=f"Stooq returned no rows for {symbol}")

        sliced = data[-365:]
        market_data_service._cache[cache_key] = (now, sliced)
        return sliced

    @staticmethod
    def _normalize(values: list[float]) -> list[float]:
        base = next((value for value in values if value and value > 0), 1.0)
        return [round((value / base) * 100, 3) if base else 0.0 for value in values]

    @staticmethod
    def _align_on_dates(series_map: dict[str, list[dict]]) -> tuple[list[str], dict[str, list[dict]]]:
        common_dates: set[str] | None = None
        indexed: dict[str, dict[str, dict]] = {}
        for key, rows in series_map.items():
            as_map = {row["date"]: row for row in rows}
            indexed[key] = as_map
            row_dates = set(as_map.keys())
            common_dates = row_dates if common_dates is None else common_dates & row_dates
        if not common_dates:
            raise HTTPException(status_code=502, detail="Unable to align market series")
        dates = sorted(common_dates)[-260:]
        aligned = {key: [indexed[key][date] for date in dates] for key in indexed}
        return dates, aligned

    async def get_macro_basket(self) -> dict:
        btc_market = await market_data_service._coingecko_get_json(
            path="/coins/bitcoin/market_chart",
            params={"vs_currency": "usd", "days": 365, "interval": "daily"},
            cache_key="overview:btc:365d",
            ttl_seconds=60 * 30,
        )

        btc_rows = []
        prices = btc_market.get("prices", [])
        volumes = btc_market.get("total_volumes", [])
        market_caps = btc_market.get("market_caps", [])
        for index, row in enumerate(prices):
            dt = datetime.fromtimestamp(row[0] / 1000, tz=UTC)
            btc_rows.append(
                {
                    "date": dt.date().isoformat(),
                    "close": float(row[1]),
                    "volume": float(volumes[index][1]) if index < len(volumes) else 0.0,
                    "market_cap": float(market_caps[index][1]) if index < len(market_caps) else 0.0,
                }
            )
        btc_rows = btc_rows[-365:]

        gld_rows, slv_rows, uso_rows, *ai_rows = await asyncio.gather(
            self._fetch_stooq_daily(PROXY_TICKERS["gold"]),
            self._fetch_stooq_daily(PROXY_TICKERS["silver"]),
            self._fetch_stooq_daily(PROXY_TICKERS["oil"]),
            *(self._fetch_stooq_daily(ticker) for ticker in AI_BASKET_TICKERS),
        )

        aligned_dates, aligned = self._align_on_dates(
            {
                "gold": gld_rows,
                "silver": slv_rows,
                "oil": uso_rows,
                **{ticker: rows for ticker, rows in zip(AI_BASKET_TICKERS, ai_rows, strict=True)},
            }
        )

        ai_price_index: list[float] = []
        ai_volume_index: list[float] = []
        ai_market_cap_proxy: list[float] = []
        for idx, _date in enumerate(aligned_dates):
            basket_price_parts = []
            basket_volume = 0.0
            basket_cap_proxy = 0.0
            for ticker in AI_BASKET_TICKERS:
                row = aligned[ticker][idx]
                basket_price_parts.append(row["close"])
                basket_volume += row["volume"]
                basket_cap_proxy += row["close"] * AI_MARKET_CAP_WEIGHTS[ticker]
            ai_price_index.append(sum(basket_price_parts) / len(basket_price_parts))
            ai_volume_index.append(basket_volume)
            ai_market_cap_proxy.append(basket_cap_proxy)

        gold_market_cap_proxy = [row["close"] for row in aligned["gold"]]
        silver_market_cap_proxy = [row["close"] for row in aligned["silver"]]
        oil_market_cap_proxy = [row["close"] for row in aligned["oil"]]

        start_date = aligned_dates[0]
        end_date = aligned_dates[-1]

        return {
            "window": "1Y",
            "startDate": start_date,
            "dates": aligned_dates,
            "metrics": {
                "price": {
                    "btc": self._normalize([row["close"] for row in btc_rows[-len(aligned_dates) :]]),
                    "gold": self._normalize([row["close"] for row in aligned["gold"]]),
                    "silver": self._normalize([row["close"] for row in aligned["silver"]]),
                    "oil": self._normalize([row["close"] for row in aligned["oil"]]),
                    "ai": self._normalize(ai_price_index),
                },
                "volume": {
                    "btc": self._normalize([row["volume"] for row in btc_rows[-len(aligned_dates) :]]),
                    "gold": self._normalize([row["volume"] for row in aligned["gold"]]),
                    "silver": self._normalize([row["volume"] for row in aligned["silver"]]),
                    "oil": self._normalize([row["volume"] for row in aligned["oil"]]),
                    "ai": self._normalize(ai_volume_index),
                },
                "marketCap": {
                    "btc": self._normalize([row["market_cap"] for row in btc_rows[-len(aligned_dates) :]]),
                    "gold": self._normalize(gold_market_cap_proxy),
                    "silver": self._normalize(silver_market_cap_proxy),
                    "oil": self._normalize(oil_market_cap_proxy),
                    "ai": self._normalize(ai_market_cap_proxy),
                },
            },
            "latest": {
                "btc": round(float(btc_rows[-1]["close"]), 2),
                "gold": round(float(aligned["gold"][-1]["close"]), 2),
                "silver": round(float(aligned["silver"][-1]["close"]), 2),
                "oil": round(float(aligned["oil"][-1]["close"]), 2),
            },
            "insight": f"Live macro basket using BTC spot plus ETF and AI-stock proxies from {start_date} to {end_date}. Market cap uses a proxy for non-BTC assets.",
        }


overview_macro_service = OverviewMacroService()
