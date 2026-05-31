from fastapi import Header, HTTPException, status

from app.core.settings import get_settings


def require_api_key(x_api_key: str | None = Header(default=None)) -> str:
    settings = get_settings()
    configured_keys = [k.strip() for k in settings.api_keys if str(k).strip()]

    if not configured_keys:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="API key auth is enabled but no API keys are configured.",
        )

    if not x_api_key or x_api_key not in configured_keys:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")

    return x_api_key
