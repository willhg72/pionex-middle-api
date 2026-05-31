from pydantic import BaseModel, ConfigDict, Field


class BtcCoreResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "recommendationId": "btc_core_20260531_001",
                "signals": {"drawdownPct": -4.2, "regime": "accumulate"},
                "plan": {"nextBuyUsdt": 25.0},
                "buyLedger": {"count": 37, "avgPrice": 62100.5},
                "source": "pionex",
            }
        }
    )
    ok: bool
    recommendationId: str
    signals: dict
    plan: dict
    buyLedger: dict
    source: str


class BtcCoreBuyIn(BaseModel):
    btcAmount: float = Field(default=0.0, ge=0)
    usdtAmount: float = Field(default=0.0, ge=0)
    price: float | None = Field(default=None, gt=0)
    note: str | None = None


class BtcCoreBuyOut(BaseModel):
    ok: bool
    buy: dict


class BtcCoreBuyPreviewIn(BaseModel):
    model_config = ConfigDict(json_schema_extra={"example": {"usdtAmount": 30.0, "referencePrice": 64000.0}})
    usdtAmount: float = Field(gt=0, le=1000)
    referencePrice: float | None = Field(default=None, gt=0)


class BtcCoreBuyPreviewOut(BaseModel):
    ok: bool
    canBuy: bool
    confirmationToken: str
    expiresAt: int
    symbol: str
    usdtAmount: float
    estimatedBtc: float
    referencePrice: float
    averageBuy: dict
    requestBody: dict
    warning: str


class BtcCoreBuyExecuteIn(BaseModel):
    model_config = ConfigDict(json_schema_extra={"example": {"confirmationToken": "btc_core_buy_prev_xxx"}})
    confirmationToken: str
    api_key: str | None = None
    api_secret: str | None = None


class BtcCoreBuyExecuteOut(BaseModel):
    ok: bool
    pionex_ordered: bool
    credentials_source: str
    buy: dict | None = None
    error_code: str | None = None
    error_message: str | None = None
    request_body: dict | None = None
