import hashlib

from fastapi import APIRouter, Depends, Header, Query

from app.core.security import require_api_key
from app.core.settings import get_settings
from app.db.session import SessionLocal
from app.repositories.idempotency_repository import IdempotencyRepository
from app.schemas.scalping.responses import (
    ScalpingCapabilitiesResponse,
    ScalpingMonitorResponse,
    ScalpingMonitorsResponse,
    ScalpingRealExecuteIn,
    ScalpingRealExecuteOut,
    ScalpingRealPreviewIn,
    ScalpingRealPreviewOut,
    ScalpingSpotExecuteIn,
    ScalpingSpotExecuteOut,
    ScalpingSpotPreviewIn,
    ScalpingSpotPreviewOut,
    ScalpingSignalsResponse,
)
from app.services.miners_service import miners_service
from app.services.scalping_service import scalping_service

router = APIRouter(prefix="/scalping", dependencies=[Depends(require_api_key)])


def _tenant_id_from_key(api_key: str) -> str:
    digest = hashlib.sha256(api_key.encode("utf-8")).hexdigest()
    return f"tenant_{digest[:24]}"


@router.get("/signals", response_model=ScalpingSignalsResponse)
async def scalping_signals(
    universe: str = Query("BTCUSDT,ETHUSDT,DOGEUSDT,LINKUSDT,SOLUSDT"),
    source: str = Query("pionex"),
    riskUsdt: float = Query(2.0, gt=0, le=20),
    leverage: float = Query(5.0, gt=0, le=20),
    x_api_key: str = Depends(require_api_key),
) -> ScalpingSignalsResponse:
    settings = get_settings()
    active_miners: list[dict] = []
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    try:
        api_key, api_secret, _ = miners_service.require_credentials(
            {}, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
        )
        active_miners = await miners_service.list_miners(api_key=api_key, api_secret=api_secret, target_daily_usdt=1.0)
    except Exception:
        active_miners = []

    payload = await scalping_service.signals(
        universe=universe,
        source=source,
        risk_usdt=riskUsdt,
        leverage=leverage,
        active_miners=active_miners,
    )
    return ScalpingSignalsResponse(**payload)


@router.get("/futures-capabilities", response_model=ScalpingCapabilitiesResponse)
async def scalping_futures_capabilities(
    symbol: str = Query("BTCUSDT"),
    api_key: str | None = Query(None),
    api_secret: str | None = Query(None),
    x_api_key: str = Depends(require_api_key),
) -> ScalpingCapabilitiesResponse:
    settings = get_settings()
    cred_payload = {"api_key": api_key or "", "api_secret": api_secret or ""}
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    resolved_key, resolved_secret, source = miners_service.resolve_credentials(
        cred_payload, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )
    keys_ok = bool(str(resolved_key).strip() and str(resolved_secret).strip())
    if not keys_ok:
        return ScalpingCapabilitiesResponse(
            symbol=f"{scalping_service.normalize_symbol(symbol).removesuffix('USDT')}_USDT_PERP",
            credentialsSource=source,
            credentialsValidFormat=False,
            api={"error": "Missing credentials"},
            docs={"entryOrderEndpoint": "POST /uapi/v1/trade/order", "entryOrderType": "MARKET_QTY", "reduceOnly": True, "nativeApiTpSlConfirmed": False},
        )
    result = await scalping_service.futures_capabilities(
        symbol=scalping_service.normalize_symbol(symbol),
        api_key=resolved_key,
        api_secret=resolved_secret,
        credentials_source=source,
    )
    return ScalpingCapabilitiesResponse(**result)


@router.post("/real-preview", response_model=ScalpingRealPreviewOut)
async def scalping_real_preview(payload: ScalpingRealPreviewIn, x_api_key: str = Depends(require_api_key)) -> ScalpingRealPreviewOut:
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    api_key, api_secret, _ = miners_service.require_credentials(
        cred_payload, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )
    result = await scalping_service.real_preview(
        symbol=scalping_service.normalize_symbol(payload.symbol),
        source=payload.source,
        risk_usdt=payload.riskUsdt,
        leverage=payload.leverage,
        api_key=api_key,
        api_secret=api_secret,
        secret=settings.miner_confirmation_secret,
    )
    return ScalpingRealPreviewOut(**result)


@router.post("/real-execute", response_model=ScalpingRealExecuteOut)
async def scalping_real_execute(
    payload: ScalpingRealExecuteIn,
    x_api_key: str = Depends(require_api_key),
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> ScalpingRealExecuteOut:
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    api_key, api_secret, _ = miners_service.require_credentials(
        cred_payload, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )
    tenant_id = _tenant_id_from_key(x_api_key)
    if idempotency_key:
        async with SessionLocal() as session:
            idem_repo = IdempotencyRepository(session)
            cached = await idem_repo.get(tenant_id=tenant_id, scope="scalping_real_execute", idem_key=idempotency_key)
            if cached:
                _, cached_payload = cached
                return ScalpingRealExecuteOut(**cached_payload)
    result = await scalping_service.real_execute(
        token=payload.confirmationToken,
        api_key=api_key,
        api_secret=api_secret,
        secret=settings.miner_confirmation_secret,
        tenant_id=tenant_id,
    )
    if idempotency_key:
        async with SessionLocal() as session:
            idem_repo = IdempotencyRepository(session)
            await idem_repo.save(tenant_id=tenant_id, scope="scalping_real_execute", idem_key=idempotency_key, status_code=200, response=result)
            await idem_repo.commit()
    return ScalpingRealExecuteOut(**result)


@router.get("/real-monitor/{monitor_id}", response_model=ScalpingMonitorResponse)
async def scalping_real_monitor(monitor_id: str, x_api_key: str = Depends(require_api_key)) -> ScalpingMonitorResponse:
    return ScalpingMonitorResponse(**(await scalping_service.monitor_status(monitor_id, _tenant_id_from_key(x_api_key))))


@router.get("/real-monitors", response_model=ScalpingMonitorsResponse)
async def scalping_real_monitors(limit: int = Query(20, ge=1, le=200), x_api_key: str = Depends(require_api_key)) -> ScalpingMonitorsResponse:
    return ScalpingMonitorsResponse(**(await scalping_service.monitors(limit, _tenant_id_from_key(x_api_key))))


@router.post("/spot-preview", response_model=ScalpingSpotPreviewOut)
async def scalping_spot_preview(payload: ScalpingSpotPreviewIn, x_api_key: str = Depends(require_api_key)) -> ScalpingSpotPreviewOut:
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    api_key, api_secret, source = miners_service.require_credentials(
        cred_payload, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )
    result = await scalping_service.spot_preview(
        symbol=scalping_service.normalize_symbol(payload.symbol),
        source=payload.source,
        risk_usdt=payload.riskUsdt,
        api_key=api_key,
        api_secret=api_secret,
        secret=settings.miner_confirmation_secret,
        credentials_source=source,
    )
    return ScalpingSpotPreviewOut(**result)


@router.post("/spot-execute", response_model=ScalpingSpotExecuteOut)
async def scalping_spot_execute(
    payload: ScalpingSpotExecuteIn,
    x_api_key: str = Depends(require_api_key),
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> ScalpingSpotExecuteOut:
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    api_key, api_secret, source = miners_service.require_credentials(
        cred_payload, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )
    tenant_id = _tenant_id_from_key(x_api_key)
    if idempotency_key:
        async with SessionLocal() as session:
            idem_repo = IdempotencyRepository(session)
            cached = await idem_repo.get(tenant_id=tenant_id, scope="scalping_spot_execute", idem_key=idempotency_key)
            if cached:
                _, cached_payload = cached
                return ScalpingSpotExecuteOut(**cached_payload)

    result = await scalping_service.spot_execute(
        token=payload.confirmationToken,
        api_key=api_key,
        api_secret=api_secret,
        secret=settings.miner_confirmation_secret,
        credentials_source=source,
        tenant_id=tenant_id,
    )
    if idempotency_key:
        async with SessionLocal() as session:
            idem_repo = IdempotencyRepository(session)
            await idem_repo.save(tenant_id=tenant_id, scope="scalping_spot_execute", idem_key=idempotency_key, status_code=200, response=result)
            await idem_repo.commit()
    return ScalpingSpotExecuteOut(**result)

