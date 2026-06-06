from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import tenant_id_from_api_key
from app.core.settings import get_settings
from app.repositories.tenant_settings_repository import TenantSettingsRepository
from app.services.miners_service import miners_service
from app.services.tenant_settings_service import tenant_settings_service


async def resolve_exchange_credentials(
    *,
    x_api_key: str,
    payload: dict,
    db: AsyncSession,
) -> tuple[str, str, str]:
    settings = get_settings()
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    tenant_id = tenant_id_from_api_key(x_api_key)
    repo = TenantSettingsRepository(db)
    stored_key, stored_secret = await tenant_settings_service.resolve_exchange_credentials(repo, tenant_id)
    return miners_service.require_credentials(
        payload,
        settings.pionex_api_key,
        settings.pionex_api_secret,
        stored_key=stored_key,
        stored_secret=stored_secret,
        allow_env_fallback=allow_owner_fallback,
    )
