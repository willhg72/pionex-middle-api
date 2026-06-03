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


class MinerStabilizationCheckIn(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {"buOrderId": "BU123456", "mode": "auto", "targetDailyUsdt": 1.0}
        }
    )
    buOrderId: str = Field(min_length=6)
    mode: str = Field(default="auto", pattern="^(auto|up|down)$")
    targetDailyUsdt: float = Field(default=1.0, gt=0)
    api_key: str | None = None
    api_secret: str | None = None


class MinerStabilizationCheckOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "buOrderId": "BU123456",
                "symbol": "BTC_USDT_PERP",
                "rangeBreakState": "BREAK_UP",
                "stabilizationState": "CONFIRMED",
                "regridSuggestion": "MIGRATE_UP",
                "stabilizationEvidence": {"hoursObserved": 6.0, "passed": True},
                "regridCandidate": {"bottom": 65000.0, "top": 72000.0, "row": 80},
            }
        }
    )
    ok: bool
    buOrderId: str
    symbol: str | None = None
    mode: str
    rangeBreakState: str
    stabilizationState: str
    regridSuggestion: str
    decisionReason: str
    stabilizationEvidence: dict
    regridCandidate: dict | None = None
    blockers: list[str] = Field(default_factory=list)
    liveMiner: dict | None = None


class MinerRegridPreviewIn(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {"buOrderId": "BU123456", "mode": "auto", "targetDailyUsdt": 1.0}
        }
    )
    buOrderId: str = Field(min_length=6)
    mode: str = Field(default="auto", pattern="^(auto|up|down)$")
    targetDailyUsdt: float = Field(default=1.0, gt=0)
    api_key: str | None = None
    api_secret: str | None = None


class MinerRegridPreviewOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "buOrderId": "BU123456",
                "symbol": "BTC_USDT_PERP",
                "mode": "auto",
                "rangeBreakState": "BREAK_UP",
                "stabilizationState": "CONFIRMED",
                "regridSuggestion": "MIGRATE_UP",
                "regridPayload": {"buOrderId": "BU123456", "bottom": 65000.0, "top": 72000.0, "row": 80},
                "confirmationToken": "regrid_tok_xxx",
                "confirmationRequired": True,
            }
        }
    )
    ok: bool
    buOrderId: str
    symbol: str | None = None
    mode: str
    rangeBreakState: str
    stabilizationState: str
    regridSuggestion: str
    decisionReason: str
    stabilizationEvidence: dict
    regridCandidate: dict | None = None
    regridPayload: dict | None = None
    blockers: list[str] = Field(default_factory=list)
    confirmationRequired: bool
    expiresAt: int | None = None
    confirmationToken: str | None = None


class MinerRegridExecuteIn(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {"confirmationToken": "regrid_tok_xxx", "reason": "Breakout confirmed and range migrated upward"}
        }
    )
    confirmationToken: str
    reason: str = Field(min_length=8, max_length=400)
    api_key: str | None = None
    api_secret: str | None = None


class MinerRegridExecuteOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "buOrderId": "BU123456",
                "symbol": "BTC_USDT_PERP",
                "regridSuggestion": "MIGRATE_UP",
                "pionexResult": {"result": True, "actionId": "ACT123"},
            }
        }
    )
    ok: bool
    buOrderId: str
    symbol: str | None = None
    regridSuggestion: str
    appliedRange: dict
    pionexResult: dict
