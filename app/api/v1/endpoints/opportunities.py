from fastapi import APIRouter, Body, Depends, HTTPException, Query

from app.core.security import require_api_key
from app.core.settings import get_settings
from app.schemas.opportunities.responses import (
    OpportunitiesResponse,
    OpportunityCreateIn,
    OpportunityCreateOut,
    OpportunityCreatePreviewIn,
    OpportunityCreatePreviewOut,
)
from app.services.miners_service import miners_service
from app.services.opportunities_service import opportunities_service

router = APIRouter(prefix="/dashboard/opportunities", dependencies=[Depends(require_api_key)])


@router.get("", response_model=OpportunitiesResponse)
async def dashboard_opportunities(
    universe: str | None = Query(None),
    capital: float = Query(175.0, gt=0),
    source: str = Query("pionex"),
    targetDailyUsdt: float = Query(1.0, gt=0),
) -> OpportunitiesResponse:
    result = await opportunities_service.list_opportunities(
        universe=universe,
        capital=capital,
        source=source,
        target_daily_usdt=targetDailyUsdt,
    )
    return OpportunitiesResponse(**result)


@router.post("/create-preview", response_model=OpportunityCreatePreviewOut)
async def dashboard_opportunity_create_preview(payload: OpportunityCreatePreviewIn) -> OpportunityCreatePreviewOut:
    settings = get_settings()
    rows = await opportunities_service.list_opportunities(
        universe=payload.symbol,
        capital=payload.capital,
        source=payload.source,
        target_daily_usdt=payload.targetDailyUsdt,
    )
    row = next(
        (
            x
            for x in rows.get("opportunities", [])
            if x.get("symbol") == payload.symbol.upper() and x.get("configKey") == payload.configKey
        ),
        None,
    )
    if not row:
        raise HTTPException(status_code=404, detail="Opportunity row not found")

    preview = opportunities_service.build_preview(row, secret=settings.miner_confirmation_secret)
    return OpportunityCreatePreviewOut(**preview)


@router.post("/create", response_model=OpportunityCreateOut)
async def dashboard_opportunity_create(payload: OpportunityCreateIn) -> OpportunityCreateOut:
    settings = get_settings()
    rows = await opportunities_service.list_opportunities(
        universe=payload.symbol,
        capital=payload.capital,
        source=payload.source,
        target_daily_usdt=payload.targetDailyUsdt,
    )
    row = next(
        (
            x
            for x in rows.get("opportunities", [])
            if x.get("symbol") == payload.symbol.upper() and x.get("configKey") == payload.configKey
        ),
        None,
    )
    if not row:
        raise HTTPException(status_code=404, detail="Opportunity row not found")

    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, _ = miners_service.resolve_credentials(cred_payload, settings.pionex_api_key, settings.pionex_api_secret)

    result = await opportunities_service.execute_create(
        token=payload.confirmationToken,
        row=row,
        api_key=api_key,
        api_secret=api_secret,
        secret=settings.miner_confirmation_secret,
    )
    return OpportunityCreateOut(**result)

