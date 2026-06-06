from pydantic import BaseModel, Field


class AuthSignUpIn(BaseModel):
    fullName: str = Field(min_length=2, max_length=160)
    email: str = Field(min_length=5, max_length=320)
    password: str = Field(min_length=8, max_length=128)
    tenantName: str = Field(min_length=2, max_length=160)


class AuthSignInIn(BaseModel):
    email: str = Field(min_length=5, max_length=320)
    password: str = Field(min_length=8, max_length=128)
    tenantSlug: str | None = Field(default=None, min_length=2, max_length=160)


class AuthForgotPasswordIn(BaseModel):
    email: str = Field(min_length=5, max_length=320)


class AuthForgotPasswordOut(BaseModel):
    ok: bool
    message: str
    resetToken: str | None = None
    resetUrl: str | None = None


class AuthResetPasswordIn(BaseModel):
    resetToken: str = Field(min_length=20)
    newPassword: str = Field(min_length=8, max_length=128)


class AuthResetPasswordOut(BaseModel):
    ok: bool
    message: str


class TenantSummary(BaseModel):
    id: str
    name: str
    slug: str
    role: str


class UserSummary(BaseModel):
    id: str
    email: str
    fullName: str


class AuthSessionResponse(BaseModel):
    ok: bool
    token: str
    expiresAt: int
    tenantApiKey: str
    user: UserSummary
    tenant: TenantSummary


class AuthMeResponse(BaseModel):
    ok: bool
    authenticated: bool
    expiresAt: int
    tenantApiKey: str
    user: UserSummary
    tenant: TenantSummary
