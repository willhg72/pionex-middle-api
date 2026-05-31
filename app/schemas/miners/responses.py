from pydantic import BaseModel, Field


class MinerItem(BaseModel):
    buOrderId: str
    symbol: str
    status: str | None = None
    minerType: str | None = None
    gridProfit: float = 0.0
    totalProfit: float | None = None
    closeProfit: float | None = None
    trendPnl: float | None = None
    inventoryRatio: float | None = None
    rangePosition: float | None = None
    rangeHealth: str | None = None
    quoteInvestment: float | None = None
    leverage: float | None = None
    targetDailyUsdt: float | None = None
    inventoryGate: dict | None = None
    promoHealth: dict | None = None
    harvestPolicy: dict | None = None


class MinersResponse(BaseModel):
    ok: bool
    source: str
    miners: list[MinerItem]
    count: int


class MinerClosePreviewIn(BaseModel):
    buOrderId: str = Field(min_length=6)
    symbol: str | None = None


class MinerClosePreviewOut(BaseModel):
    ok: bool
    buOrderId: str
    symbol: str | None
    expiresAt: int
    confirmationToken: str


class MinerCloseExecuteIn(BaseModel):
    confirmationToken: str
    closeReason: str = Field(min_length=8, max_length=400)
    api_key: str | None = None
    api_secret: str | None = None


class MinerCloseExecuteOut(BaseModel):
    ok: bool
    buOrderId: str
    symbol: str | None
    pionexResult: dict


class AccountBalanceResponse(BaseModel):
    ok: bool
    timestamp: int | None = None
    usdt: dict
    assets: list[dict]
    nonUsdtAssets: list[dict]
    assetsCount: int
    estimatedTotalUsd: float | None = None
    credentialsSource: str | None = None


class MinerHistoryResponse(BaseModel):
    ok: bool
    count: int
    snapshots: list[dict]


class MinerEventsResponse(BaseModel):
    ok: bool
    count: int
    events: list[dict]
