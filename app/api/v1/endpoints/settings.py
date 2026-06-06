from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_api_key, tenant_id_from_api_key
from app.db.session import get_db_session
from app.repositories.tenant_settings_repository import TenantSettingsRepository
from app.schemas.settings import (
    TenantSettingsIn,
    TenantSettingsOut,
    TenantSettingsSaveOut,
    TenantSettingsValidationIn,
    TenantSettingsValidationOut,
)
from app.services.tenant_settings_service import tenant_settings_service

router = APIRouter(prefix="/settings", dependencies=[Depends(require_api_key)])


@router.get("", response_model=TenantSettingsOut)
async def get_tenant_settings(
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> TenantSettingsOut:
    repo = TenantSettingsRepository(db)
    payload = await tenant_settings_service.get_settings(repo, tenant_id_from_api_key(x_api_key))
    return TenantSettingsOut(**payload)


@router.post("", response_model=TenantSettingsSaveOut)
async def save_tenant_settings(
    payload: TenantSettingsIn,
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> TenantSettingsSaveOut:
    repo = TenantSettingsRepository(db)
    incoming = payload.model_dump()
    if incoming.get("exchangeApiKey") or incoming.get("exchangeApiSecret"):
        validation = await tenant_settings_service.validate_settings_credentials(
            repo,
            tenant_id_from_api_key(x_api_key),
            incoming,
        )
        if not validation["valid"]:
            raise HTTPException(status_code=400, detail=validation["reason"] or "Invalid exchange credentials")
    saved = await tenant_settings_service.save_settings(repo, tenant_id_from_api_key(x_api_key), incoming)
    return TenantSettingsSaveOut(**saved)


@router.post("/validate-api-key", response_model=TenantSettingsValidationOut)
async def validate_tenant_settings_credentials(
    payload: TenantSettingsValidationIn,
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> TenantSettingsValidationOut:
    repo = TenantSettingsRepository(db)
    result = await tenant_settings_service.validate_settings_credentials(
        repo,
        tenant_id_from_api_key(x_api_key),
        payload.model_dump(),
    )
    return TenantSettingsValidationOut(**result)
