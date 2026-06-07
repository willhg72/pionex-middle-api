from fastapi import APIRouter

from app.api.v1.endpoints import analyzer, auth, btc_core, btc_ladder, capital, capital_reconciliation, discovery, health, market, miners, opportunities, overview, scalping, settings, telemetry

router = APIRouter()
router.include_router(health.router, tags=["health"])
router.include_router(auth.router, tags=["auth"])
router.include_router(market.router, tags=["market"])
router.include_router(overview.router, tags=["overview"])
router.include_router(analyzer.router, tags=["analyzer"])
router.include_router(miners.router, tags=["miners"])
router.include_router(capital.router, tags=["capital"])
router.include_router(capital_reconciliation.router, tags=["capital-reconciliation"])
router.include_router(discovery.router, tags=["discovery"])
router.include_router(btc_core.router, tags=["btc-core"])
router.include_router(btc_ladder.router, tags=["btc-ladder"])
router.include_router(opportunities.router, tags=["opportunities"])
router.include_router(scalping.router, tags=["scalping"])
router.include_router(settings.router, tags=["settings"])
router.include_router(telemetry.router, tags=["telemetry"])
