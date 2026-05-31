from fastapi import APIRouter

from app.core.settings import get_settings
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def healthcheck() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        ok=True,
        service=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
    )
