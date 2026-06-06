from pydantic import BaseModel, Field


class TenantSettingsIn(BaseModel):
    exchange: str = Field(default="pionex", min_length=2, max_length=40)
    exchangeApiKey: str | None = Field(default=None, max_length=512)
    exchangeApiSecret: str | None = Field(default=None, max_length=512)
    riskProfile: str = Field(default="moderate", min_length=3, max_length=40)
    maxCapPct: float = Field(default=90.0, ge=0, le=100)
    maxLeverage: int = Field(default=10, ge=1, le=125)
    refreshInterval: int = Field(default=30, ge=5, le=3600)
    theme: str = Field(default="dark", min_length=3, max_length=24)


class TenantSettingsOut(BaseModel):
    ok: bool
    exchange: str
    riskProfile: str
    maxCapPct: float
    maxLeverage: int
    refreshInterval: int
    theme: str
    hasExchangeApiKey: bool
    hasExchangeApiSecret: bool
    exchangeApiKeyMasked: str | None = None
    updatedAt: str | None = None


class TenantSettingsSaveOut(TenantSettingsOut):
    saved: bool


class TenantSettingsValidationIn(BaseModel):
    exchange: str = Field(default="pionex", min_length=2, max_length=40)
    exchangeApiKey: str | None = Field(default=None, max_length=512)
    exchangeApiSecret: str | None = Field(default=None, max_length=512)


class TenantSettingsValidationOut(BaseModel):
    ok: bool
    valid: bool
    reason: str | None = None
