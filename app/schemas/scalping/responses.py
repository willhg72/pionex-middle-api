from pydantic import BaseModel, ConfigDict, Field


class ScalpingSignalsResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "summary": {"evaluated": 40, "qualified": 2},
                "signals": [{"symbol": "SOL_USDT_PERP", "side": "BUY", "confidence": 0.73}],
                "errors": [],
            }
        }
    )
    ok: bool
    summary: dict
    signals: list[dict]
    errors: list[dict]


class ScalpingRealPreviewIn(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {"symbol": "SOL_USDT_PERP", "source": "pionex", "riskUsdt": 8.0, "leverage": 5.0}
        }
    )
    symbol: str
    source: str = "pionex"
    riskUsdt: float = Field(gt=0, le=10)
    leverage: float = Field(gt=0, le=20)
    api_key: str | None = None
    api_secret: str | None = None


class ScalpingRealPreviewOut(BaseModel):
    ok: bool
    canExecute: bool
    blockers: list[str]
    confirmationToken: str
    expiresAt: int
    signal: dict
    order: dict
    volumeGate: dict | None = None
    capabilities: dict | None = None


class ScalpingRealExecuteIn(BaseModel):
    model_config = ConfigDict(json_schema_extra={"example": {"confirmationToken": "scalp_real_prev_xxx"}})
    confirmationToken: str
    api_key: str | None = None
    api_secret: str | None = None


class ScalpingRealExecuteOut(BaseModel):
    ok: bool
    orderId: str | None = None
    clientOrderId: str | None = None
    monitorId: str
    status: str


class ScalpingSpotPreviewIn(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {"symbol": "BTC_USDT", "source": "pionex", "riskUsdt": 15.0, "leverage": None}
        }
    )
    symbol: str
    source: str = "pionex"
    riskUsdt: float = Field(gt=0, le=25)
    leverage: float | None = None
    api_key: str | None = None
    api_secret: str | None = None


class ScalpingSpotPreviewOut(BaseModel):
    ok: bool
    mode: str
    canExecute: bool
    blockers: list[str]
    confirmationToken: str
    expiresAt: int
    signal: dict
    order: dict
    credentialsSource: str
    apiKeyFingerprint: str
    volumeGate: dict | None = None
    warning: str | None = None


class ScalpingSpotExecuteIn(BaseModel):
    model_config = ConfigDict(json_schema_extra={"example": {"confirmationToken": "scalp_spot_prev_xxx"}})
    confirmationToken: str
    api_key: str | None = None
    api_secret: str | None = None


class ScalpingSpotExecuteOut(BaseModel):
    ok: bool
    mode: str
    orderId: str | None = None
    clientOrderId: str | None = None
    monitorId: str
    status: str


class ScalpingMonitorResponse(BaseModel):
    ok: bool
    monitor: dict


class ScalpingMonitorsResponse(BaseModel):
    ok: bool
    count: int
    monitors: list[dict]


class ScalpingCapabilitiesResponse(BaseModel):
    symbol: str
    credentialsSource: str
    credentialsValidFormat: bool
    api: dict
    docs: dict
