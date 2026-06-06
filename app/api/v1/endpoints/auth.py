from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_bearer_token
from app.db.session import get_db_session
from app.repositories.auth_repository import AuthRepository
from app.schemas.auth import (
    AuthForgotPasswordIn,
    AuthForgotPasswordOut,
    AuthMeResponse,
    AuthResetPasswordIn,
    AuthResetPasswordOut,
    AuthSessionResponse,
    AuthSignInIn,
    AuthSignUpIn,
)
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth")


@router.post("/sign-up", response_model=AuthSessionResponse)
async def auth_sign_up(payload: AuthSignUpIn, db: AsyncSession = Depends(get_db_session)) -> AuthSessionResponse:
    repo = AuthRepository(db)
    session = await auth_service.sign_up(
        repo,
        full_name=payload.fullName,
        email=payload.email,
        password=payload.password,
        tenant_name=payload.tenantName,
    )
    return AuthSessionResponse(ok=True, **session)


@router.post("/sign-in", response_model=AuthSessionResponse)
async def auth_sign_in(payload: AuthSignInIn, db: AsyncSession = Depends(get_db_session)) -> AuthSessionResponse:
    repo = AuthRepository(db)
    session = await auth_service.sign_in(
        repo,
        email=payload.email,
        password=payload.password,
        tenant_slug=payload.tenantSlug,
    )
    return AuthSessionResponse(ok=True, **session)


@router.post("/forgot-password", response_model=AuthForgotPasswordOut)
async def auth_forgot_password(payload: AuthForgotPasswordIn, db: AsyncSession = Depends(get_db_session)) -> AuthForgotPasswordOut:
    repo = AuthRepository(db)
    result = await auth_service.request_password_reset(repo, email=payload.email)
    return AuthForgotPasswordOut(ok=True, **result)


@router.post("/reset-password", response_model=AuthResetPasswordOut)
async def auth_reset_password(payload: AuthResetPasswordIn, db: AsyncSession = Depends(get_db_session)) -> AuthResetPasswordOut:
    repo = AuthRepository(db)
    result = await auth_service.reset_password(repo, reset_token=payload.resetToken, new_password=payload.newPassword)
    return AuthResetPasswordOut(ok=True, **result)


@router.get("/me", response_model=AuthMeResponse)
async def auth_me(
    bearer_token: str = Depends(require_bearer_token),
    db: AsyncSession = Depends(get_db_session),
) -> AuthMeResponse:
    repo = AuthRepository(db)
    session = await auth_service.get_me(repo, token=bearer_token)
    return AuthMeResponse(ok=True, authenticated=True, **session)
