from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_api_key, tenant_id_from_api_key
from app.core.settings import get_settings
from app.db.session import get_db_session
from app.repositories.btc_core_repository import BtcCoreRepository
from app.repositories.btc_ladder_repository import BtcLadderRepository
from app.schemas.btc_ladder.responses import (
    BtcLadderCancelAllIn,
    BtcLadderCancelAllOut,
    BtcLadderFillConfirmIn,
    BtcLadderFillConfirmOut,
    BtcLadderLimitExecuteIn,
    BtcLadderLimitExecuteOut,
    BtcLadderLimitPreviewIn,
    BtcLadderLimitPreviewOut,
    BtcLadderPlaceAllIn,
    BtcLadderPlaceAllOut,
    BtcLadderPriceResponse,
    BtcLadderResponse,
)
from app.services.btc_ladder_service import btc_ladder_service
from app.services.miners_service import miners_service

router = APIRouter(prefix="/dashboard/btc-ladder", dependencies=[Depends(require_api_key)])


@router.get("", response_model=BtcLadderResponse)
async def dashboard_btc_ladder(x_api_key: str = Depends(require_api_key), db: AsyncSession = Depends(get_db_session)) -> BtcLadderResponse:
    payload = await btc_ladder_service.dashboard(
        tenant_id=tenant_id_from_api_key(x_api_key),
        ladder_repo=BtcLadderRepository(db),
        core_repo=BtcCoreRepository(db),
    )
    return BtcLadderResponse(**payload)


@router.get("/price", response_model=BtcLadderPriceResponse)
async def dashboard_btc_ladder_price() -> BtcLadderPriceResponse:
    return BtcLadderPriceResponse(**(await btc_ladder_service.price()))


@router.post("/place-all", response_model=BtcLadderPlaceAllOut)
async def dashboard_btc_ladder_place_all(payload: BtcLadderPlaceAllIn, x_api_key: str = Depends(require_api_key), db: AsyncSession = Depends(get_db_session)) -> BtcLadderPlaceAllOut:
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, source = miners_service.resolve_credentials(cred_payload, settings.pionex_api_key, settings.pionex_api_secret)
    result = await btc_ladder_service.place_all(
        capital_usdt=payload.capitalUsdt,
        levels=payload.levels,
        max_dip_pct=payload.maxDipPct,
        api_key=api_key,
        api_secret=api_secret,
        credentials_source=source,
        tenant_id=tenant_id_from_api_key(x_api_key),
        ladder_repo=BtcLadderRepository(db),
    )
    return BtcLadderPlaceAllOut(**result)


@router.post("/cancel-all", response_model=BtcLadderCancelAllOut)
async def dashboard_btc_ladder_cancel_all(payload: BtcLadderCancelAllIn) -> BtcLadderCancelAllOut:
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, source = miners_service.resolve_credentials(cred_payload, settings.pionex_api_key, settings.pionex_api_secret)
    result = await btc_ladder_service.cancel_all(api_key=api_key, api_secret=api_secret, credentials_source=source)
    return BtcLadderCancelAllOut(**result)


@router.post("/limit-preview", response_model=BtcLadderLimitPreviewOut)
async def dashboard_btc_ladder_limit_preview(payload: BtcLadderLimitPreviewIn) -> BtcLadderLimitPreviewOut:
    settings = get_settings()
    result = btc_ladder_service.limit_preview(
        usdt_amount=payload.usdtAmount,
        limit_price=payload.limitPrice,
        secret=settings.miner_confirmation_secret,
    )
    return BtcLadderLimitPreviewOut(**result)


@router.post("/limit-execute", response_model=BtcLadderLimitExecuteOut)
async def dashboard_btc_ladder_limit_execute(payload: BtcLadderLimitExecuteIn, x_api_key: str = Depends(require_api_key), db: AsyncSession = Depends(get_db_session)) -> BtcLadderLimitExecuteOut:
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, source = miners_service.resolve_credentials(cred_payload, settings.pionex_api_key, settings.pionex_api_secret)
    result = await btc_ladder_service.limit_execute(
        token=payload.confirmationToken,
        api_key=api_key,
        api_secret=api_secret,
        credentials_source=source,
        secret=settings.miner_confirmation_secret,
        tenant_id=tenant_id_from_api_key(x_api_key),
        ladder_repo=BtcLadderRepository(db),
    )
    return BtcLadderLimitExecuteOut(**result)


@router.post("/fill-confirm", response_model=BtcLadderFillConfirmOut)
async def dashboard_btc_ladder_fill_confirm(payload: BtcLadderFillConfirmIn, x_api_key: str = Depends(require_api_key), db: AsyncSession = Depends(get_db_session)) -> BtcLadderFillConfirmOut:
    result = await btc_ladder_service.fill_confirm(
        btc_amount=payload.btcAmount,
        usdt_amount=payload.usdtAmount,
        price=payload.price,
        note=payload.note,
        tenant_id=tenant_id_from_api_key(x_api_key),
        core_repo=BtcCoreRepository(db),
    )
    return BtcLadderFillConfirmOut(**result)
