from pydantic import BaseModel


class RangeMetrics(BaseModel):
    bottom: float
    top: float
    grids: int
    gridStep: float
    currentPrice: float
    currentPriceOutOfRange: bool


class MarketMetrics(BaseModel):
    rawCrossings: int
    rawCrossingsPerDay: float
    inRangeEfficiency: float
    reversalEfficiency: float
    executionEfficiency: float
    cyclesPerDayRaw: float
    cyclesPerDay: float


class EconomicsMetrics(BaseModel):
    requiresPerVolume: bool
    estimatedDailyProfit: float | None
    netProfitPerCycle: float | None


class ScoreMetrics(BaseModel):
    decision: str
    confidence: float


class RangeVelocityResponse(BaseModel):
    symbol: str
    interval: str
    source: str
    assetProfile: str
    range: RangeMetrics
    market: MarketMetrics
    economics: EconomicsMetrics
    score: ScoreMetrics
