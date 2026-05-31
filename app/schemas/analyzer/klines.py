from pydantic import BaseModel


class KlineOut(BaseModel):
    timestamp: int
    open: float
    high: float
    low: float
    close: float
    volume: float
    quoteVolume: float
    trades: int
    takerBuyBaseVolume: float
    takerBuyQuoteVolume: float
    closed: bool


class KlinesResponse(BaseModel):
    symbol: str
    interval: str
    source: str
    startTime: int | None
    endTime: int | None
    count: int
    klines: list[KlineOut]
