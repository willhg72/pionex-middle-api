from fastapi import APIRouter, Body, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_api_key
from app.core.settings import get_settings
from app.db.session import get_db_session
from app.repositories.miner_ops_repository import MinerOpsRepository
from app.schemas.miners.responses import (
    AccountBalanceResponse,
    MinerCloseExecuteIn,
    MinerCloseExecuteOut,
    MinerClosePreviewIn,
    MinerClosePreviewOut,
    MinerEventsResponse,
    MinerHistoryResponse,
    MinersResponse,
)
from app.services.miners_service import miners_service

router = APIRouter(prefix="/dashboard/miners", dependencies=[Depends(require_api_key)])


def _is_upstream_429(exc: HTTPException) -> bool:
    detail = str(exc.detail or "")
    return exc.status_code == 502 and "429" in detail


@router.get("", response_model=MinersResponse)
async def dashboard_miners(
    targetDailyUsdt: float = Query(1.0, gt=0),
    db: AsyncSession = Depends(get_db_session),
) -> MinersResponse:
    settings = get_settings()
    api_key, api_secret, source = miners_service.resolve_credentials({}, settings.pionex_api_key, settings.pionex_api_secret)
    repo = MinerOpsRepository(db)
    try:
        miners = await miners_service.list_miners(api_key=api_key, api_secret=api_secret, target_daily_usdt=targetDailyUsdt)
        for row in miners:
            await repo.save_snapshot(row)
        await repo.commit()
    except HTTPException as exc:
        if not _is_upstream_429(exc):
            raise
        cached = await repo.list_latest_snapshot_payloads(limit=400)
        if not cached:
            raise
        return MinersResponse(ok=True, source=f"{source}:cache_fallback", miners=cached, count=len(cached))

    return MinersResponse(ok=True, source=source, miners=miners, count=len(miners))


@router.post("", response_model=MinersResponse)
async def dashboard_miners_with_credentials(
    payload: dict = Body(default_factory=dict),
    targetDailyUsdt: float = Query(1.0, gt=0),
    db: AsyncSession = Depends(get_db_session),
) -> MinersResponse:
    settings = get_settings()
    api_key, api_secret, source = miners_service.resolve_credentials(payload, settings.pionex_api_key, settings.pionex_api_secret)
    repo = MinerOpsRepository(db)
    try:
        miners = await miners_service.list_miners(api_key=api_key, api_secret=api_secret, target_daily_usdt=targetDailyUsdt)
        for row in miners:
            await repo.save_snapshot(row)
        await repo.commit()
    except HTTPException as exc:
        if not _is_upstream_429(exc):
            raise
        cached = await repo.list_latest_snapshot_payloads(limit=400)
        if not cached:
            raise
        return MinersResponse(ok=True, source=f"{source}:cache_fallback", miners=cached, count=len(cached))

    return MinersResponse(ok=True, source=source, miners=miners, count=len(miners))


@router.get("/history", response_model=MinerHistoryResponse)
async def dashboard_miners_history(
    symbol: str | None = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db_session),
) -> MinerHistoryResponse:
    repo = MinerOpsRepository(db)
    snapshots = await repo.list_snapshots(symbol=symbol, limit=limit)
    return MinerHistoryResponse(ok=True, count=len(snapshots), snapshots=snapshots)


@router.get("/events", response_model=MinerEventsResponse)
async def dashboard_miners_events(
    symbol: str | None = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db_session),
) -> MinerEventsResponse:
    repo = MinerOpsRepository(db)
    events = await repo.list_events(symbol=symbol, limit=limit)
    return MinerEventsResponse(ok=True, count=len(events), events=events)


@router.post("/close-preview", response_model=MinerClosePreviewOut)
async def dashboard_miner_close_preview(payload: MinerClosePreviewIn) -> MinerClosePreviewOut:
    settings = get_settings()
    token = miners_service.sign_close_token(
        {"buOrderId": payload.buOrderId, "symbol": payload.symbol},
        secret=settings.miner_confirmation_secret,
        ttl_seconds=300,
    )
    payload_data = miners_service.verify_close_token(token, settings.miner_confirmation_secret)
    return MinerClosePreviewOut(
        ok=True,
        buOrderId=payload.buOrderId,
        symbol=payload.symbol,
        expiresAt=int(payload_data["exp"]),
        confirmationToken=token,
    )


@router.post("/close", response_model=MinerCloseExecuteOut)
async def dashboard_miner_close_execute(payload: MinerCloseExecuteIn, db: AsyncSession = Depends(get_db_session)) -> MinerCloseExecuteOut:
    settings = get_settings()
    token_payload = miners_service.verify_close_token(payload.confirmationToken, settings.miner_confirmation_secret)

    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, _ = miners_service.resolve_credentials(cred_payload, settings.pionex_api_key, settings.pionex_api_secret)

    bu_order_id = str(token_payload.get("buOrderId") or "")
    symbol = token_payload.get("symbol")
    result = await miners_service.close_miner(
        api_key=api_key,
        api_secret=api_secret,
        bu_order_id=bu_order_id,
    )

    repo = MinerOpsRepository(db)
    await repo.save_event(
        bu_order_id=bu_order_id,
        symbol=symbol,
        event_type="miner_closed",
        reason=payload.closeReason,
        payload=result,
    )
    await repo.commit()

    return MinerCloseExecuteOut(
        ok=True,
        buOrderId=bu_order_id,
        symbol=symbol,
        pionexResult=result,
    )


@router.get("/account-balance", response_model=AccountBalanceResponse)
async def dashboard_account_balance() -> AccountBalanceResponse:
    settings = get_settings()
    api_key, api_secret, source = miners_service.resolve_credentials({}, settings.pionex_api_key, settings.pionex_api_secret)
    payload = await miners_service.get_account_balance(api_key=api_key, api_secret=api_secret)
    payload["credentialsSource"] = source
    return AccountBalanceResponse(**payload)


@router.post("/account-balance", response_model=AccountBalanceResponse)
async def dashboard_account_balance_with_credentials(payload: dict = Body(default_factory=dict)) -> AccountBalanceResponse:
    settings = get_settings()
    api_key, api_secret, source = miners_service.resolve_credentials(payload, settings.pionex_api_key, settings.pionex_api_secret)
    response = await miners_service.get_account_balance(api_key=api_key, api_secret=api_secret)
    response["credentialsSource"] = source
    return AccountBalanceResponse(**response)
