from fastapi import Header, HTTPException, status
import hashlib

from app.core.settings import get_settings
from app.services.auth_service import auth_service


def require_api_key(x_api_key: str | None = Header(default=None)) -> str:
    settings = get_settings()
    configured_keys = [k.strip() for k in settings.api_keys if str(k).strip()]
    is_known_configured = bool(x_api_key and x_api_key in configured_keys)
    tenant_id = auth_service.verify_tenant_api_key(x_api_key or "")

    if not configured_keys and not tenant_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="API key auth is enabled but no API keys are configured.",
        )

    if not x_api_key or (not is_known_configured and not tenant_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")

    return x_api_key


def tenant_id_from_api_key(api_key: str) -> str:
    tenant_id = auth_service.verify_tenant_api_key(api_key)
    if tenant_id:
        return tenant_id
    digest = hashlib.sha256(api_key.encode("utf-8")).hexdigest()
    return f"tenant_{digest[:24]}"


def require_bearer_token(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    token = authorization[7:].strip()
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    return token
