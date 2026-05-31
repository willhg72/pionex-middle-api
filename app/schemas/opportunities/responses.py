from pydantic import BaseModel, ConfigDict, Field


class OpportunitiesResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "summary": {"count": 3, "source": "pionex"},
                "opportunities": [
                    {
                        "symbol": "ETH_USDT_PERP",
                        "configKey": "robust_worker",
                        "targetDailyUsdt": 1.0,
                        "score": 0.78,
                    }
                ],
                "errors": [],
            }
        }
    )
    ok: bool
    summary: dict
    opportunities: list[dict]
    errors: list[dict]


class OpportunityCreatePreviewIn(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "symbol": "BTC_USDT_PERP",
                "configKey": "robust_worker",
                "capital": 120.0,
                "targetDailyUsdt": 1.0,
                "source": "pionex",
            }
        }
    )
    symbol: str
    configKey: str
    capital: float = Field(gt=0)
    targetDailyUsdt: float = Field(gt=0)
    source: str = "pionex"


class OpportunityCreatePreviewOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "canCreate": True,
                "blockers": [],
                "confirmationToken": "opp_prev_tok_xxx",
                "expiresAt": 1780200400,
                "fingerprint": "fp_abc123",
                "opportunity": {"symbol": "BTC_USDT_PERP", "score": 0.91},
                "requestBody": {"symbol": "BTC_USDT_PERP", "capital": 120.0},
            }
        }
    )
    ok: bool
    canCreate: bool
    blockers: list[str]
    confirmationToken: str | None = None
    expiresAt: int | None = None
    fingerprint: str
    opportunity: dict
    requestBody: dict


class OpportunityCreateIn(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "confirmationToken": "opp_prev_tok_xxx",
                "symbol": "BTC_USDT_PERP",
                "configKey": "robust_worker",
                "capital": 120.0,
                "targetDailyUsdt": 1.0,
                "source": "pionex",
            }
        }
    )
    confirmationToken: str
    symbol: str
    configKey: str
    capital: float = Field(gt=0)
    targetDailyUsdt: float = Field(gt=0)
    source: str = "pionex"
    api_key: str | None = None
    api_secret: str | None = None


class OpportunityCreateOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "pionex_created": True,
                "bu_order_id": "BU123456789",
                "error_code": None,
                "error_message": None,
                "request_body": {"symbol": "BTC_USDT_PERP"},
            }
        }
    )
    ok: bool
    pionex_created: bool
    bu_order_id: str | None = None
    error_code: str | None = None
    error_message: str | None = None
    request_body: dict
