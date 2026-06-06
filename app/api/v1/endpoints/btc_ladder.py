from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_api_key, tenant_id_from_api_key
from app.db.session import get_db_session
from app.repositories.btc_core_repository import BtcCoreRepository
from app.repositories.btc_ladder_repository import BtcLadderRepository
from app.repositories.idempotency_repository import IdempotencyRepository
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
    BtcLadderReconcileIn,
    BtcLadderReconcileOut,
    BtcLadderResponse,
)
from app.services.btc_ladder_service import btc_ladder_service
from app.services.tenant_credentials import resolve_exchange_credentials

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
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, source = await resolve_exchange_credentials(x_api_key=x_api_key, payload=cred_payload, db=db)
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
async def dashboard_btc_ladder_cancel_all(payload: BtcLadderCancelAllIn, x_api_key: str = Depends(require_api_key), db: AsyncSession = Depends(get_db_session)) -> BtcLadderCancelAllOut:
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, source = await resolve_exchange_credentials(x_api_key=x_api_key, payload=cred_payload, db=db)
    result = await btc_ladder_service.cancel_all(api_key=api_key, api_secret=api_secret, credentials_source=source)
    return BtcLadderCancelAllOut(**result)


@router.post("/limit-preview", response_model=BtcLadderLimitPreviewOut)
async def dashboard_btc_ladder_limit_preview(payload: BtcLadderLimitPreviewIn) -> BtcLadderLimitPreviewOut:
    from app.core.settings import get_settings
    settings = get_settings()
    result = btc_ladder_service.limit_preview(
        usdt_amount=payload.usdtAmount,
        limit_price=payload.limitPrice,
        secret=settings.miner_confirmation_secret,
    )
    return BtcLadderLimitPreviewOut(**result)


@router.post("/limit-execute", response_model=BtcLadderLimitExecuteOut)
async def dashboard_btc_ladder_limit_execute(
    payload: BtcLadderLimitExecuteIn,
    x_api_key: str = Depends(require_api_key),
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
    db: AsyncSession = Depends(get_db_session),
) -> BtcLadderLimitExecuteOut:
    from app.core.settings import get_settings
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, source = await resolve_exchange_credentials(x_api_key=x_api_key, payload=cred_payload, db=db)
    tenant_id = tenant_id_from_api_key(x_api_key)
    idem_repo = IdempotencyRepository(db)
    if idempotency_key:
        cached = await idem_repo.get(tenant_id=tenant_id, scope="btc_ladder_limit_execute", idem_key=idempotency_key)
        if cached:
            _, cached_payload = cached
            return BtcLadderLimitExecuteOut(**cached_payload)

    result = await btc_ladder_service.limit_execute(
        token=payload.confirmationToken,
        api_key=api_key,
        api_secret=api_secret,
        credentials_source=source,
        secret=settings.miner_confirmation_secret,
        tenant_id=tenant_id,
        ladder_repo=BtcLadderRepository(db),
    )
    if idempotency_key:
        await idem_repo.save(tenant_id=tenant_id, scope="btc_ladder_limit_execute", idem_key=idempotency_key, status_code=200, response=result)
        await idem_repo.commit()
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


@router.post("/reconcile", response_model=BtcLadderReconcileOut)
async def dashboard_btc_ladder_reconcile(payload: BtcLadderReconcileIn, x_api_key: str = Depends(require_api_key), db: AsyncSession = Depends(get_db_session)) -> BtcLadderReconcileOut:
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, source = await resolve_exchange_credentials(x_api_key=x_api_key, payload=cred_payload, db=db)
    result = await btc_ladder_service.reconcile_orders(
        api_key=api_key,
        api_secret=api_secret,
        credentials_source=source,
        tenant_id=tenant_id_from_api_key(x_api_key),
        auto_ledger=payload.autoLedger,
        ladder_repo=BtcLadderRepository(db),
        core_repo=BtcCoreRepository(db),
    )
    return BtcLadderReconcileOut(**result)
