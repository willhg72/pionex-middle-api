from pydantic import BaseModel


class OhlcPoint(BaseModel):
    timestamp: int
    open: float
    high: float
    low: float
    close: float


class MarketOhlcResponse(BaseModel):
    ticker: str
    coin_id: str
    timeframe: str
    ohlc: list[OhlcPoint]


class MarketTicker24hResponse(BaseModel):
    symbol: str
    lastPrice: str
    openPrice: str
    highPrice: str
    lowPrice: str
    volume: str
    quoteVolume: str
    priceChange: str
    priceChangePercent: str
