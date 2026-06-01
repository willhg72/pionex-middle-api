from pydantic import BaseModel, ConfigDict, Field


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
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "source": "pionex",
                "miners": [
                    {
                        "buOrderId": "BU123456",
                        "symbol": "BTC_USDT_PERP",
                        "status": "running",
                        "minerType": "robust_worker",
                        "gridProfit": 1.27,
                    }
                ],
                "count": 1,
            }
        }
    )
    ok: bool
    source: str
    miners: list[MinerItem]
    count: int


class MinerClosePreviewIn(BaseModel):
    model_config = ConfigDict(json_schema_extra={"example": {"buOrderId": "BU123456", "symbol": "BTC_USDT_PERP"}})
    buOrderId: str = Field(min_length=6)
    symbol: str | None = None


class MinerClosePreviewOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "buOrderId": "BU123456",
                "symbol": "BTC_USDT_PERP",
                "expiresAt": 1780200600,
                "confirmationToken": "close_tok_xxx",
            }
        }
    )
    ok: bool
    buOrderId: str
    symbol: str | None
    expiresAt: int
    confirmationToken: str


class MinerCloseExecuteIn(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {"confirmationToken": "close_tok_xxx", "closeReason": "Range break and risk budget protection"}
        }
    )
    confirmationToken: str
    closeReason: str = Field(min_length=8, max_length=400)
    api_key: str | None = None
    api_secret: str | None = None


class MinerCloseExecuteOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "buOrderId": "BU123456",
                "symbol": "BTC_USDT_PERP",
                "pionexResult": {"result": "success"},
            }
        }
    )
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


class MinerBackfillClosedOut(BaseModel):
    ok: bool
    month: str
    window: dict
    summary: dict
    rows: list[dict]
    errors: list[dict]
