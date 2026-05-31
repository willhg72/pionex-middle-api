from pydantic import BaseModel, Field


class ScalpingSignalsResponse(BaseModel):
    ok: bool
    summary: dict
    signals: list[dict]
    errors: list[dict]


class ScalpingRealPreviewIn(BaseModel):
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
    confirmationToken: str
    api_key: str | None = None
    api_secret: str | None = None


class ScalpingRealExecuteOut(BaseModel):
    ok: bool
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
