from fastapi import APIRouter

from app.api.v1.endpoints import analyzer, health, market, telemetry

router = APIRouter()
router.include_router(health.router, tags=["health"])
router.include_router(market.router, tags=["market"])
router.include_router(analyzer.router, tags=["analyzer"])
router.include_router(telemetry.router, tags=["telemetry"])
