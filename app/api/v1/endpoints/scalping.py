import hashlib

from fastapi import APIRouter, Depends, Query

from app.core.security import require_api_key
from app.core.settings import get_settings
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
) -> ScalpingSignalsResponse:
    payload = await scalping_service.signals(universe=universe, source=source, risk_usdt=riskUsdt, leverage=leverage)
    return ScalpingSignalsResponse(**payload)


@router.get("/futures-capabilities", response_model=ScalpingCapabilitiesResponse)
async def scalping_futures_capabilities(
    symbol: str = Query("BTCUSDT"),
    api_key: str | None = Query(None),
    api_secret: str | None = Query(None),
) -> ScalpingCapabilitiesResponse:
    settings = get_settings()
    cred_payload = {"api_key": api_key or "", "api_secret": api_secret or ""}
    resolved_key, resolved_secret, source = miners_service.resolve_credentials(cred_payload, settings.pionex_api_key, settings.pionex_api_secret)
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
async def scalping_real_preview(payload: ScalpingRealPreviewIn) -> ScalpingRealPreviewOut:
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, _ = miners_service.resolve_credentials(cred_payload, settings.pionex_api_key, settings.pionex_api_secret)
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
async def scalping_real_execute(payload: ScalpingRealExecuteIn, x_api_key: str = Depends(require_api_key)) -> ScalpingRealExecuteOut:
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, _ = miners_service.resolve_credentials(cred_payload, settings.pionex_api_key, settings.pionex_api_secret)
    result = await scalping_service.real_execute(
        token=payload.confirmationToken,
        api_key=api_key,
        api_secret=api_secret,
        secret=settings.miner_confirmation_secret,
        tenant_id=_tenant_id_from_key(x_api_key),
    )
    return ScalpingRealExecuteOut(**result)


@router.get("/real-monitor/{monitor_id}", response_model=ScalpingMonitorResponse)
async def scalping_real_monitor(monitor_id: str, x_api_key: str = Depends(require_api_key)) -> ScalpingMonitorResponse:
    return ScalpingMonitorResponse(**(await scalping_service.monitor_status(monitor_id, _tenant_id_from_key(x_api_key))))


@router.get("/real-monitors", response_model=ScalpingMonitorsResponse)
async def scalping_real_monitors(limit: int = Query(20, ge=1, le=200), x_api_key: str = Depends(require_api_key)) -> ScalpingMonitorsResponse:
    return ScalpingMonitorsResponse(**(await scalping_service.monitors(limit, _tenant_id_from_key(x_api_key))))


@router.post("/spot-preview", response_model=ScalpingSpotPreviewOut)
async def scalping_spot_preview(payload: ScalpingSpotPreviewIn) -> ScalpingSpotPreviewOut:
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, source = miners_service.resolve_credentials(cred_payload, settings.pionex_api_key, settings.pionex_api_secret)
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
async def scalping_spot_execute(payload: ScalpingSpotExecuteIn, x_api_key: str = Depends(require_api_key)) -> ScalpingSpotExecuteOut:
    settings = get_settings()
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, source = miners_service.resolve_credentials(cred_payload, settings.pionex_api_key, settings.pionex_api_secret)
    result = await scalping_service.spot_execute(
        token=payload.confirmationToken,
        api_key=api_key,
        api_secret=api_secret,
        secret=settings.miner_confirmation_secret,
        credentials_source=source,
        tenant_id=_tenant_id_from_key(x_api_key),
    )
    return ScalpingSpotExecuteOut(**result)

