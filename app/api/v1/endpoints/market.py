from fastapi import APIRouter, HTTPException, Query

from app.schemas.market.responses import MarketOhlcResponse, MarketTicker24hResponse
from app.services.market_data_service import market_data_service

router = APIRouter(prefix="/market")


@router.get("/ohlc", response_model=MarketOhlcResponse)
async def market_ohlc(
    ticker: str = Query(..., min_length=2),
    timeframe: str = Query("1h"),
    days: int | None = Query(None, ge=1, le=365),
) -> MarketOhlcResponse:
    symbol, coin_id = await market_data_service.resolve_ticker_inputs(ticker)

    tf = str(timeframe or "1h").strip().lower()
    if tf not in {"1h", "4h", "1d"}:
        raise HTTPException(status_code=400, detail="Unsupported timeframe. Use 1h, 4h or 1d")

    default_days = 7 if tf == "1h" else (30 if tf == "4h" else 90)
    requested_days = int(days) if days is not None else default_days
    supported_days = [1, 7, 14, 30, 90, 180, 365]
    effective_days = next((d for d in supported_days if requested_days <= d), 365)
    agg_hours = 1 if tf == "1h" else (4 if tf == "4h" else 24)

    rows = await market_data_service._coingecko_get_json(
        path=f"/coins/{coin_id}/ohlc",
        params={"vs_currency": "usd", "days": effective_days},
        cache_key=f"ohlc:{coin_id}:{tf}:{effective_days}d",
        ttl_seconds=60,
    )

    ohlc = market_data_service.aggregate_ohlc_by_hours(rows, agg_hours)
    return MarketOhlcResponse(ticker=symbol, coin_id=coin_id, timeframe=tf, ohlc=ohlc)


@router.get("/ticker24h", response_model=MarketTicker24hResponse)
async def market_ticker24h(ticker: str = Query(..., min_length=2)) -> MarketTicker24hResponse:
    symbol, coin_id = await market_data_service.resolve_ticker_inputs(ticker)

    payload = await market_data_service._coingecko_get_json(
        path="/coins/markets",
        params={"vs_currency": "usd", "ids": coin_id, "sparkline": "false"},
        cache_key=f"ticker24h:{coin_id}",
        ttl_seconds=30,
    )

    if not isinstance(payload, list) or not payload:
        raise HTTPException(status_code=502, detail="CoinGecko returned empty market payload")

    row = payload[0]
    current = float(row.get("current_price") or 0.0)
    high = float(row.get("high_24h") or current)
    low = float(row.get("low_24h") or current)
    change_pct = float(row.get("price_change_percentage_24h") or 0.0)
    change = current * (change_pct / 100)
    volume = float(row.get("total_volume") or 0.0)

    return MarketTicker24hResponse(
        symbol=f"{symbol}USDT",
        lastPrice=f"{current:.8f}",
        openPrice=f"{(current - change):.8f}",
        highPrice=f"{high:.8f}",
        lowPrice=f"{low:.8f}",
        volume=f"{volume:.8f}",
        quoteVolume=f"{volume:.8f}",
        priceChange=f"{change:.8f}",
        priceChangePercent=f"{change_pct:.8f}",
    )
