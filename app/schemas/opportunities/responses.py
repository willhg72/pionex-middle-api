from pydantic import BaseModel, Field


class OpportunitiesResponse(BaseModel):
    ok: bool
    summary: dict
    opportunities: list[dict]
    errors: list[dict]


class OpportunityCreatePreviewIn(BaseModel):
    symbol: str
    configKey: str
    capital: float = Field(gt=0)
    targetDailyUsdt: float = Field(gt=0)
    source: str = "pionex"


class OpportunityCreatePreviewOut(BaseModel):
    ok: bool
    canCreate: bool
    blockers: list[str]
    confirmationToken: str | None = None
    expiresAt: int | None = None
    fingerprint: str
    opportunity: dict
    requestBody: dict


class OpportunityCreateIn(BaseModel):
    confirmationToken: str
    symbol: str
    configKey: str
    capital: float = Field(gt=0)
    targetDailyUsdt: float = Field(gt=0)
    source: str = "pionex"
    api_key: str | None = None
    api_secret: str | None = None


class OpportunityCreateOut(BaseModel):
    ok: bool
    pionex_created: bool
    bu_order_id: str | None = None
    error_code: str | None = None
    error_message: str | None = None
    request_body: dict
