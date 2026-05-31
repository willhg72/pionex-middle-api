from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_api_key, tenant_id_from_api_key
from app.core.settings import get_settings
from app.db.session import get_db_session
from app.repositories.btc_core_repository import BtcCoreRepository
from app.repositories.idempotency_repository import IdempotencyRepository
from app.schemas.btc_core.responses import (
    BtcCoreBuyExecuteIn,
    BtcCoreBuyExecuteOut,
    BtcCoreBuyIn,
    BtcCoreBuyOut,
    BtcCoreBuyPreviewIn,
    BtcCoreBuyPreviewOut,
    BtcCoreResponse,
)
from app.services.btc_core_service import btc_core_service
from app.services.miners_service import miners_service

router = APIRouter(prefix="/dashboard/btc-core", dependencies=[Depends(require_api_key)])


@router.get("", response_model=BtcCoreResponse)
async def dashboard_btc_core(
    monthlyBudgetUsdt: float = Query(100.0, gt=0),
    currentBtc: float = Query(0.0, ge=0),
    targetBtc: float = Query(0.1, gt=0),
    source: str = Query("pionex"),
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> BtcCoreResponse:
    repo = BtcCoreRepository(db)
    payload = await btc_core_service.dashboard(
        monthly_budget_usdt=monthlyBudgetUsdt,
        current_btc=currentBtc,
        target_btc=targetBtc,
        source=source,
        tenant_id=tenant_id_from_api_key(x_api_key),
        repo=repo,
    )
    return BtcCoreResponse(**payload)


@router.post("/buy", response_model=BtcCoreBuyOut)
async def dashboard_btc_core_buy(payload: BtcCoreBuyIn, x_api_key: str = Depends(require_api_key), db: AsyncSession = Depends(get_db_session)) -> BtcCoreBuyOut:
    repo = BtcCoreRepository(db)
    result = await btc_core_service.register_manual_buy(
        btc_amount=payload.btcAmount,
        usdt_amount=payload.usdtAmount,
        price=payload.price,
        note=payload.note,
        tenant_id=tenant_id_from_api_key(x_api_key),
        repo=repo,
    )
    return BtcCoreBuyOut(**result)


@router.post("/buy-preview", response_model=BtcCoreBuyPreviewOut)
async def dashboard_btc_core_buy_preview(payload: BtcCoreBuyPreviewIn, x_api_key: str = Depends(require_api_key), db: AsyncSession = Depends(get_db_session)) -> BtcCoreBuyPreviewOut:
    settings = get_settings()
    repo = BtcCoreRepository(db)
    result = await btc_core_service.buy_preview(
        usdt_amount=payload.usdtAmount,
        reference_price=payload.referencePrice,
        tenant_id=tenant_id_from_api_key(x_api_key),
        repo=repo,
        secret=settings.miner_confirmation_secret,
    )
    return BtcCoreBuyPreviewOut(**result)


@router.post("/buy-execute", response_model=BtcCoreBuyExecuteOut)
async def dashboard_btc_core_buy_execute(
    payload: BtcCoreBuyExecuteIn,
    x_api_key: str = Depends(require_api_key),
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
    db: AsyncSession = Depends(get_db_session),
) -> BtcCoreBuyExecuteOut:
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, source = miners_service.resolve_credentials(cred_payload, settings.pionex_api_key, settings.pionex_api_secret)
    repo = BtcCoreRepository(db)
    tenant_id = tenant_id_from_api_key(x_api_key)
    idem_repo = IdempotencyRepository(db)
    if idempotency_key:
        cached = await idem_repo.get(tenant_id=tenant_id, scope="btc_core_buy_execute", idem_key=idempotency_key)
        if cached:
            _, cached_payload = cached
            return BtcCoreBuyExecuteOut(**cached_payload)

    result = await btc_core_service.buy_execute(
        token=payload.confirmationToken,
        api_key=api_key,
        api_secret=api_secret,
        credentials_source=source,
        secret=settings.miner_confirmation_secret,
        tenant_id=tenant_id,
        repo=repo,
    )
    if idempotency_key:
        await idem_repo.save(tenant_id=tenant_id, scope="btc_core_buy_execute", idem_key=idempotency_key, status_code=200, response=result)
        await idem_repo.commit()
    return BtcCoreBuyExecuteOut(**result)
