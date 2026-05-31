from fastapi import APIRouter

from app.api.v1.endpoints import analyzer, discovery, health, market, miners, opportunities, scalping, telemetry

router = APIRouter()
router.include_router(health.router, tags=["health"])
router.include_router(market.router, tags=["market"])
router.include_router(analyzer.router, tags=["analyzer"])
router.include_router(miners.router, tags=["miners"])
router.include_router(discovery.router, tags=["discovery"])
router.include_router(opportunities.router, tags=["opportunities"])
router.include_router(scalping.router, tags=["scalping"])
router.include_router(telemetry.router, tags=["telemetry"])
