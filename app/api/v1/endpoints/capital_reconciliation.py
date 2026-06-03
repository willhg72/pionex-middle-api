from fastapi import APIRouter, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_api_key, tenant_id_from_api_key
from app.core.settings import get_settings
from app.db.session import get_db_session
from app.repositories.capital_reconciliation_repository import CapitalReconciliationRepository
from app.schemas.capital_reconciliation import CapitalReconciliationIn, CapitalReconciliationOut
from app.services.capital_reconciliation_service import capital_reconciliation_service
from app.services.miners_service import miners_service


router = APIRouter(prefix="/dashboard/capital-reconciliation", dependencies=[Depends(require_api_key)])


@router.post("", response_model=CapitalReconciliationOut)
async def dashboard_capital_reconciliation(
    payload: CapitalReconciliationIn = Body(default_factory=CapitalReconciliationIn),
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> CapitalReconciliationOut:
    settings = get_settings()
    allow_owner_fallback = bool(settings.owner_api_key and x_api_key == settings.owner_api_key)
    api_key, api_secret, source = miners_service.require_credentials(
        {"api_key": payload.api_key or "", "api_secret": payload.api_secret or ""},
        settings.pionex_api_key,
        settings.pionex_api_secret,
        allow_env_fallback=allow_owner_fallback,
    )

    tenant_id = tenant_id_from_api_key(x_api_key)
    repo = CapitalReconciliationRepository(db)
    previous_snapshot = await repo.get_latest_snapshot(tenant_id=tenant_id)
    current_snapshot, new_events = await capital_reconciliation_service.reconcile(
        api_key=api_key,
        api_secret=api_secret,
        target_daily_usdt=payload.targetDailyUsdt,
        source=source,
        previous_snapshot=previous_snapshot,
    )
    await repo.save_fleet_snapshot(tenant_id=tenant_id, snapshot=current_snapshot)

    for event in new_events:
        existing = await repo.find_close_event(tenant_id=tenant_id, bu_order_id=str(event.get("buOrderId") or ""))
        if existing:
            continue
        await repo.save_close_event(tenant_id=tenant_id, event=event)
    await repo.commit()

    recent_events = await repo.list_recent_close_events(tenant_id=tenant_id, limit=30)
    summary = capital_reconciliation_service.summarize(current_snapshot=current_snapshot, recent_events=recent_events)
    return CapitalReconciliationOut(
        ok=True,
        source=source,
        snapshot=current_snapshot,
        previousSnapshot=previous_snapshot,
        summary=summary,
        recentCloseEvents=recent_events,
    )
