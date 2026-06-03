from fastapi import APIRouter, Body, Depends, HTTPException, Query
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_api_key, tenant_id_from_api_key
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
    MinerBackfillClosedOut,
    MinerRegridExecuteIn,
    MinerRegridExecuteOut,
    MinerRegridPreviewIn,
    MinerRegridPreviewOut,
    MinerStabilizationCheckIn,
    MinerStabilizationCheckOut,
    MinersResponse,
)
from app.services.miners_service import miners_service
from app.integrations.pionex_client import PionexClient

router = APIRouter(prefix="/dashboard/miners", dependencies=[Depends(require_api_key)])
workers_router = APIRouter(prefix="/dashboard/workers", dependencies=[Depends(require_api_key)])


def _is_upstream_429(exc: HTTPException) -> bool:
    detail = str(exc.detail or "")
    return exc.status_code == 502 and "429" in detail


def _parse_month_window(month: str) -> tuple[datetime, datetime]:
    try:
        start = datetime.strptime(month, "%Y-%m").replace(tzinfo=timezone.utc)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="month must be YYYY-MM") from exc
    if start.month == 12:
        end = start.replace(year=start.year + 1, month=1)
    else:
        end = start.replace(month=start.month + 1)
    return start, end


def _to_dt_utc(value: object) -> datetime | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.astimezone(timezone.utc)
    text = str(value).strip()
    if not text:
        return None
    try:
        raw = float(text)
        if raw > 1_000_000_000_000:
            return datetime.fromtimestamp(raw / 1000.0, tz=timezone.utc)
        if raw > 1_000_000_000:
            return datetime.fromtimestamp(raw, tz=timezone.utc)
    except ValueError:
        pass
    try:
        return datetime.fromisoformat(text.replace("Z", "+00:00")).astimezone(timezone.utc)
    except ValueError:
        return None


def _allow_owner_fallback(x_api_key: str) -> tuple[bool, object]:
    settings = get_settings()
    allow = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    return allow, settings


def _build_regrid_token_payload(analysis: dict, mode: str) -> dict:
    live = analysis["liveMiner"]
    candidate = analysis["regridCandidate"] or {}
    return {
        "kind": "miner_regrid",
        "mode": mode,
        "buOrderId": live.get("buOrderId"),
        "symbol": live.get("symbol"),
        "suggestion": analysis.get("regridSuggestion"),
        "candidate": candidate,
        "rangeBreakState": analysis.get("rangeBreakState"),
        "stabilizationState": analysis.get("stabilizationState"),
    }


async def _run_stabilization(payload: MinerStabilizationCheckIn, x_api_key: str) -> dict:
    allow_owner_fallback, settings = _allow_owner_fallback(x_api_key)
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, _ = miners_service.require_credentials(
        cred_payload, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )
    return await miners_service.analyze_miner_regrid(
        api_key=api_key,
        api_secret=api_secret,
        bu_order_id=payload.buOrderId,
        target_daily_usdt=payload.targetDailyUsdt,
        mode=payload.mode,
    )


async def _run_regrid_preview(payload: MinerRegridPreviewIn, x_api_key: str) -> tuple[dict, str | None, int | None]:
    allow_owner_fallback, settings = _allow_owner_fallback(x_api_key)
    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, _ = miners_service.require_credentials(
        cred_payload, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )
    analysis = await miners_service.analyze_miner_regrid(
        api_key=api_key,
        api_secret=api_secret,
        bu_order_id=payload.buOrderId,
        target_daily_usdt=payload.targetDailyUsdt,
        mode=payload.mode,
    )
    if analysis.get("regridSuggestion") not in {"MIGRATE_UP", "MIGRATE_DOWN"} or not analysis.get("regridCandidate"):
        return analysis, None, None
    token = miners_service.sign_close_token(
        _build_regrid_token_payload(analysis, payload.mode),
        secret=settings.miner_confirmation_secret,
        ttl_seconds=300,
    )
    token_payload = miners_service.verify_close_token(token, settings.miner_confirmation_secret)
    return analysis, token, int(token_payload["exp"])


async def _run_regrid_execute(payload: MinerRegridExecuteIn, x_api_key: str) -> tuple[dict, dict]:
    allow_owner_fallback, settings = _allow_owner_fallback(x_api_key)
    token_payload = miners_service.verify_close_token(payload.confirmationToken, settings.miner_confirmation_secret)
    if token_payload.get("kind") != "miner_regrid":
        raise HTTPException(status_code=400, detail="Invalid confirmation token kind")

    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    api_key, api_secret, _ = miners_service.require_credentials(
        cred_payload, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )
    live = await miners_service.get_live_miner(
        api_key=api_key,
        api_secret=api_secret,
        bu_order_id=str(token_payload.get("buOrderId") or ""),
    )
    candidate = token_payload.get("candidate")
    if not isinstance(candidate, dict) or not candidate:
        raise HTTPException(status_code=400, detail="Confirmation token does not contain a valid regrid candidate")
    result = await miners_service.execute_regrid(api_key=api_key, api_secret=api_secret, live=live, candidate=candidate)
    return token_payload, {"live": live, "candidate": candidate, "result": result, "reason": payload.reason}


@router.get("", response_model=MinersResponse)
async def dashboard_miners(
    targetDailyUsdt: float = Query(1.0, gt=0),
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> MinersResponse:
    settings = get_settings()
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    api_key, api_secret, source = miners_service.require_credentials(
        {}, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )
    repo = MinerOpsRepository(db)
    tenant_id = tenant_id_from_api_key(x_api_key)
    try:
        miners = await miners_service.list_miners(api_key=api_key, api_secret=api_secret, target_daily_usdt=targetDailyUsdt)
        for row in miners:
            await repo.save_snapshot(row, tenant_id=tenant_id)
        await repo.commit()
    except HTTPException as exc:
        if not _is_upstream_429(exc):
            raise
        cached = await repo.list_latest_snapshot_payloads(tenant_id=tenant_id, limit=400)
        if not cached:
            raise
        return MinersResponse(ok=True, source=f"{source}:cache_fallback", miners=cached, count=len(cached))

    return MinersResponse(ok=True, source=source, miners=miners, count=len(miners))


@router.post("", response_model=MinersResponse)
async def dashboard_miners_with_credentials(
    payload: dict = Body(default_factory=dict),
    targetDailyUsdt: float = Query(1.0, gt=0),
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> MinersResponse:
    settings = get_settings()
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    api_key, api_secret, source = miners_service.require_credentials(
        payload, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )
    repo = MinerOpsRepository(db)
    tenant_id = tenant_id_from_api_key(x_api_key)
    try:
        miners = await miners_service.list_miners(api_key=api_key, api_secret=api_secret, target_daily_usdt=targetDailyUsdt)
        for row in miners:
            await repo.save_snapshot(row, tenant_id=tenant_id)
        await repo.commit()
    except HTTPException as exc:
        if not _is_upstream_429(exc):
            raise
        cached = await repo.list_latest_snapshot_payloads(tenant_id=tenant_id, limit=400)
        if not cached:
            raise
        return MinersResponse(ok=True, source=f"{source}:cache_fallback", miners=cached, count=len(cached))

    return MinersResponse(ok=True, source=source, miners=miners, count=len(miners))


@router.get("/history", response_model=MinerHistoryResponse)
async def dashboard_miners_history(
    symbol: str | None = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> MinerHistoryResponse:
    repo = MinerOpsRepository(db)
    snapshots = await repo.list_snapshots(tenant_id=tenant_id_from_api_key(x_api_key), symbol=symbol, limit=limit)
    return MinerHistoryResponse(ok=True, count=len(snapshots), snapshots=snapshots)


@router.get("/events", response_model=MinerEventsResponse)
async def dashboard_miners_events(
    symbol: str | None = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> MinerEventsResponse:
    repo = MinerOpsRepository(db)
    events = await repo.list_events(tenant_id=tenant_id_from_api_key(x_api_key), symbol=symbol, limit=limit)
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
async def dashboard_miner_close_execute(payload: MinerCloseExecuteIn, x_api_key: str = Depends(require_api_key), db: AsyncSession = Depends(get_db_session)) -> MinerCloseExecuteOut:
    settings = get_settings()
    token_payload = miners_service.verify_close_token(payload.confirmationToken, settings.miner_confirmation_secret)

    cred_payload = {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""}
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    api_key, api_secret, _ = miners_service.require_credentials(
        cred_payload, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )

    bu_order_id = str(token_payload.get("buOrderId") or "")
    symbol = token_payload.get("symbol")
    result = await miners_service.close_miner(
        api_key=api_key,
        api_secret=api_secret,
        bu_order_id=bu_order_id,
        close_reason=payload.closeReason,
    )

    repo = MinerOpsRepository(db)
    await repo.save_event(
        tenant_id=tenant_id_from_api_key(x_api_key),
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
async def dashboard_account_balance(x_api_key: str = Depends(require_api_key)) -> AccountBalanceResponse:
    settings = get_settings()
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    api_key, api_secret, source = miners_service.require_credentials(
        {}, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )
    payload = await miners_service.get_account_balance(api_key=api_key, api_secret=api_secret)
    payload["credentialsSource"] = source
    return AccountBalanceResponse(**payload)


@router.post("/account-balance", response_model=AccountBalanceResponse)
async def dashboard_account_balance_with_credentials(payload: dict = Body(default_factory=dict), x_api_key: str = Depends(require_api_key)) -> AccountBalanceResponse:
    settings = get_settings()
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    api_key, api_secret, source = miners_service.require_credentials(
        payload, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )
    response = await miners_service.get_account_balance(api_key=api_key, api_secret=api_secret)
    response["credentialsSource"] = source
    return AccountBalanceResponse(**response)


@router.post("/backfill-closed", response_model=MinerBackfillClosedOut)
async def dashboard_miners_backfill_closed(
    month: str = Query(..., description="Month window in YYYY-MM format"),
    maxRecords: int = Query(500, ge=1, le=2000),
    persist: bool = Query(False),
    apiKey: str | None = Query(None),
    apiSecret: str | None = Query(None),
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> MinerBackfillClosedOut:
    start_utc, end_utc = _parse_month_window(month)
    start_ms = int(start_utc.timestamp() * 1000)
    end_ms = int(end_utc.timestamp() * 1000)
    tenant_id = tenant_id_from_api_key(x_api_key)

    repo = MinerOpsRepository(db)
    bu_order_ids = await repo.list_distinct_bu_order_ids(tenant_id=tenant_id, limit=maxRecords)
    if not bu_order_ids:
        return MinerBackfillClosedOut(
            ok=True,
            month=month,
            window={"start": start_utc.isoformat(), "end": end_utc.isoformat()},
            summary={"tenantBuOrderIds": 0, "checked": 0, "closedInMonth": 0, "withPnl": 0, "persisted": 0, "coveragePct": 0.0},
            rows=[],
            errors=[],
        )

    settings = get_settings()
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    cred_payload = {"api_key": apiKey or "", "api_secret": apiSecret or ""}
    api_key, api_secret, _ = miners_service.require_credentials(
        cred_payload, settings.pionex_api_key, settings.pionex_api_secret, allow_env_fallback=allow_owner_fallback
    )

    pionex = PionexClient(api_key, api_secret)
    rows: list[dict] = []
    errors: list[dict] = []
    persisted = 0
    try:
        for bu_order_id in bu_order_ids:
            try:
                status_result = await pionex.get_bot_status(bu_order_id)
                payload = status_result.raw_response.get("data") if isinstance(status_result.raw_response, dict) else {}
                payload = payload if isinstance(payload, dict) else {}
                close_dt = _to_dt_utc(
                    payload.get("closeTime")
                    or payload.get("closedAt")
                    or payload.get("finishTime")
                    or payload.get("updateTime")
                    or status_result.last_update
                )
                close_ms = int(close_dt.timestamp() * 1000) if close_dt else None
                in_month = bool(close_ms and start_ms <= close_ms < end_ms)
                pnl_value = status_result.pnl
                if pnl_value is None:
                    for key in ("totalProfit", "profit", "totalRealizedProfit", "marginCloseProfit"):
                        try:
                            v = payload.get(key)
                            if v is None or v == "":
                                continue
                            pnl_value = float(v)
                            break
                        except (TypeError, ValueError):
                            continue
                row = {
                    "buOrderId": bu_order_id,
                    "status": str(status_result.status or payload.get("status") or "unknown"),
                    "closedAt": close_dt.isoformat() if close_dt else None,
                    "closedAtMs": close_ms,
                    "inMonth": in_month,
                    "realizedPnlUsdt": pnl_value,
                    "hasPnl": pnl_value is not None,
                    "apiSuccess": bool(status_result.success),
                }
                rows.append(row)
                if persist and in_month:
                    await repo.save_event(
                        tenant_id=tenant_id,
                        bu_order_id=bu_order_id,
                        symbol=None,
                        event_type="miner_backfill_closed",
                        reason=f"month={month}",
                        payload=row,
                    )
                    persisted += 1
            except Exception as exc:  # noqa: BLE001
                errors.append({"buOrderId": bu_order_id, "message": str(exc)})
    finally:
        await pionex.close()

    if persist and persisted:
        await repo.commit()

    in_month_rows = [r for r in rows if r.get("inMonth")]
    with_pnl_rows = [r for r in in_month_rows if r.get("hasPnl")]
    coverage = round((len(with_pnl_rows) / max(1, len(in_month_rows))) * 100, 2) if in_month_rows else 0.0
    return MinerBackfillClosedOut(
        ok=True,
        month=month,
        window={"start": start_utc.isoformat(), "end": end_utc.isoformat()},
        summary={
            "tenantBuOrderIds": len(bu_order_ids),
            "checked": len(rows),
            "closedInMonth": len(in_month_rows),
            "withPnl": len(with_pnl_rows),
            "persisted": persisted,
            "coveragePct": coverage,
        },
        rows=in_month_rows,
        errors=errors[:50],
    )


@router.post("/stabilization-check", response_model=MinerStabilizationCheckOut)
async def dashboard_miners_stabilization_check(
    payload: MinerStabilizationCheckIn,
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> MinerStabilizationCheckOut:
    analysis = await _run_stabilization(payload, x_api_key)
    repo = MinerOpsRepository(db)
    await repo.save_event(
        tenant_id=tenant_id_from_api_key(x_api_key),
        bu_order_id=str(analysis["liveMiner"].get("buOrderId") or ""),
        symbol=analysis["liveMiner"].get("symbol"),
        event_type="stabilization_check",
        reason=analysis.get("decisionReason"),
        payload=analysis,
    )
    await repo.commit()
    return MinerStabilizationCheckOut(
        ok=True,
        buOrderId=str(analysis["liveMiner"].get("buOrderId") or ""),
        symbol=analysis["liveMiner"].get("symbol"),
        mode=payload.mode,
        rangeBreakState=str(analysis["rangeBreakState"]),
        stabilizationState=str(analysis["stabilizationState"]),
        regridSuggestion=str(analysis["regridSuggestion"]),
        decisionReason=str(analysis["decisionReason"]),
        stabilizationEvidence=dict(analysis["stabilizationEvidence"]),
        regridCandidate=analysis.get("regridCandidate"),
        blockers=list(analysis.get("blockers") or []),
        liveMiner=analysis.get("liveMiner"),
    )


@router.post("/regrid-preview", response_model=MinerRegridPreviewOut)
async def dashboard_miners_regrid_preview(
    payload: MinerRegridPreviewIn,
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> MinerRegridPreviewOut:
    analysis, token, expires_at = await _run_regrid_preview(payload, x_api_key)
    event_payload = dict(analysis)
    event_payload["confirmationRequired"] = bool(token)
    repo = MinerOpsRepository(db)
    await repo.save_event(
        tenant_id=tenant_id_from_api_key(x_api_key),
        bu_order_id=str(analysis["liveMiner"].get("buOrderId") or ""),
        symbol=analysis["liveMiner"].get("symbol"),
        event_type="regrid_preview",
        reason=analysis.get("decisionReason"),
        payload=event_payload,
    )
    await repo.commit()
    return MinerRegridPreviewOut(
        ok=True,
        buOrderId=str(analysis["liveMiner"].get("buOrderId") or ""),
        symbol=analysis["liveMiner"].get("symbol"),
        mode=payload.mode,
        rangeBreakState=str(analysis["rangeBreakState"]),
        stabilizationState=str(analysis["stabilizationState"]),
        regridSuggestion=str(analysis["regridSuggestion"]),
        decisionReason=str(analysis["decisionReason"]),
        stabilizationEvidence=dict(analysis["stabilizationEvidence"]),
        regridCandidate=analysis.get("regridCandidate"),
        regridPayload=analysis.get("regridCandidate"),
        blockers=list(analysis.get("blockers") or []),
        confirmationRequired=bool(token),
        expiresAt=expires_at,
        confirmationToken=token,
    )


@router.post("/regrid", response_model=MinerRegridExecuteOut)
async def dashboard_miners_regrid_execute(
    payload: MinerRegridExecuteIn,
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> MinerRegridExecuteOut:
    token_payload, execution = await _run_regrid_execute(payload, x_api_key)
    live = execution["live"]
    candidate = execution["candidate"]
    result = execution["result"]
    repo = MinerOpsRepository(db)
    await repo.save_event(
        tenant_id=tenant_id_from_api_key(x_api_key),
        bu_order_id=str(live.get("buOrderId") or ""),
        symbol=live.get("symbol"),
        event_type="regrid_execute",
        reason=payload.reason,
        payload={
            "tokenPayload": token_payload,
            "candidate": candidate,
            "pionexResult": result,
        },
    )
    await repo.commit()
    return MinerRegridExecuteOut(
        ok=True,
        buOrderId=str(live.get("buOrderId") or ""),
        symbol=live.get("symbol"),
        regridSuggestion=str(token_payload.get("suggestion") or ""),
        appliedRange={"bottom": candidate.get("bottom"), "top": candidate.get("top"), "row": candidate.get("row")},
        pionexResult=result,
    )


@workers_router.post("/stabilization-check", response_model=MinerStabilizationCheckOut)
async def dashboard_workers_stabilization_check(
    payload: MinerStabilizationCheckIn,
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> MinerStabilizationCheckOut:
    return await dashboard_miners_stabilization_check(payload=payload, x_api_key=x_api_key, db=db)


@workers_router.post("/regrid-preview", response_model=MinerRegridPreviewOut)
async def dashboard_workers_regrid_preview(
    payload: MinerRegridPreviewIn,
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> MinerRegridPreviewOut:
    return await dashboard_miners_regrid_preview(payload=payload, x_api_key=x_api_key, db=db)


@workers_router.post("/regrid", response_model=MinerRegridExecuteOut)
async def dashboard_workers_regrid_execute(
    payload: MinerRegridExecuteIn,
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> MinerRegridExecuteOut:
    return await dashboard_miners_regrid_execute(payload=payload, x_api_key=x_api_key, db=db)
