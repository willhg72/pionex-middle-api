from fastapi import APIRouter, Depends, Query

from app.core.security import require_api_key
from app.schemas.discovery.responses import DiscoveryResponse
from app.services.discovery_service import discovery_service

router = APIRouter(prefix="/dashboard/discovery", dependencies=[Depends(require_api_key)])


@router.get("", response_model=DiscoveryResponse)
async def dashboard_discovery(
    limit: int = Query(20, ge=1, le=60),
    capital: float = Query(175.0, gt=0),
    minQuoteVolume: float = Query(50000.0, ge=0),
    minTrades: int = Query(10000, ge=0),
    source: str = Query("pionex"),
) -> DiscoveryResponse:
    result = await discovery_service.list_discovery(
        limit=limit,
        capital=capital,
        min_quote_volume=minQuoteVolume,
        min_trades=minTrades,
        source=source,
    )
    return DiscoveryResponse(**result)
