from pydantic import BaseModel, ConfigDict, Field


class BtcLadderResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "generatedAt": 1780200800,
                "inventory": {"btc": 0.0123, "usdt": 410.0},
                "ladderOrders": [{"level": 1, "price": 62000.0, "usdtAmount": 20.0}],
                "errors": [],
            }
        }
    )
    ok: bool
    generatedAt: int
    inventory: dict
    ladderOrders: list[dict]
    errors: list[str]


class BtcLadderPriceResponse(BaseModel):
    ok: bool
    symbol: str
    price: float
    source: str


class BtcLadderPlaceAllIn(BaseModel):
    model_config = ConfigDict(json_schema_extra={"example": {"capitalUsdt": 120.0, "levels": 6, "maxDipPct": 18.0}})
    capitalUsdt: float = Field(gt=0)
    levels: int = Field(default=5, ge=2, le=12)
    maxDipPct: float = Field(default=20.0, ge=2.0, le=40.0)
    api_key: str | None = None
    api_secret: str | None = None


class BtcLadderPlaceAllOut(BaseModel):
    ok: bool
    credentialsSource: str
    priceNow: float
    levelsRequested: int
    placedCount: int
    failedCount: int
    placed: list[dict]
    failed: list[dict]


class BtcLadderCancelAllIn(BaseModel):
    api_key: str | None = None
    api_secret: str | None = None


class BtcLadderCancelAllOut(BaseModel):
    ok: bool
    credentialsSource: str
    cancelledCount: int
    failedCount: int
    cancelled: list[str]
    failed: list[dict]


class BtcLadderLimitPreviewIn(BaseModel):
    model_config = ConfigDict(json_schema_extra={"example": {"usdtAmount": 30.0, "limitPrice": 61000.0}})
    usdtAmount: float = Field(gt=0, le=5000)
    limitPrice: float = Field(gt=0)


class BtcLadderLimitPreviewOut(BaseModel):
    ok: bool
    canPlace: bool
    confirmationToken: str
    expiresAt: int
    symbol: str
    usdtAmount: float
    limitPrice: float
    btcAmount: float
    requestBody: dict
    warning: str


class BtcLadderLimitExecuteIn(BaseModel):
    model_config = ConfigDict(json_schema_extra={"example": {"confirmationToken": "btc_ladder_prev_xxx"}})
    confirmationToken: str
    api_key: str | None = None
    api_secret: str | None = None


class BtcLadderLimitExecuteOut(BaseModel):
    ok: bool
    pionex_ordered: bool
    credentials_source: str
    order: dict | None = None
    error_code: str | None = None
    error_message: str | None = None
    request_body: dict | None = None


class BtcLadderFillConfirmIn(BaseModel):
    btcAmount: float = Field(default=0.0, ge=0)
    usdtAmount: float = Field(default=0.0, ge=0)
    price: float | None = Field(default=None, gt=0)
    note: str | None = None


class BtcLadderFillConfirmOut(BaseModel):
    ok: bool
    fill: dict
