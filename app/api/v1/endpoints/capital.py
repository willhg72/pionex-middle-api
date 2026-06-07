from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_api_key, tenant_id_from_api_key
from app.db.session import get_db_session
from app.repositories.btc_core_repository import BtcCoreRepository
from app.repositories.capital_reconciliation_repository import CapitalReconciliationRepository
from app.repositories.financial_history_repository import FinancialHistoryRepository
from app.repositories.tenant_settings_repository import TenantSettingsRepository
from app.schemas.capital import CapitalDashboardOut
from app.services.capital_dashboard_service import capital_dashboard_service
from app.services.tenant_settings_service import tenant_settings_service
from app.services.tenant_credentials import resolve_exchange_credentials


router = APIRouter(prefix="/dashboard/capital", dependencies=[Depends(require_api_key)])


@router.get("", response_model=CapitalDashboardOut)
async def dashboard_capital(
    targetDailyUsdt: float = Query(1.0, gt=0),
    fixedIncomeAnnualPct: float | None = Query(None, ge=0, le=1000),
    x_api_key: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db_session),
) -> CapitalDashboardOut:
    api_key, api_secret, source = await resolve_exchange_credentials(x_api_key=x_api_key, payload={}, db=db)
    tenant_id = tenant_id_from_api_key(x_api_key)
    settings_repo = TenantSettingsRepository(db)
    if fixedIncomeAnnualPct is None:
        settings_row = await settings_repo.get_by_tenant_id(tenant_id)
        fixedIncomeAnnualPct = (
            float(getattr(settings_row, "fixed_income_annual_pct", tenant_settings_service.DEFAULT_FIXED_INCOME_ANNUAL_PCT))
            if settings_row is not None
            else tenant_settings_service.DEFAULT_FIXED_INCOME_ANNUAL_PCT
        )
    payload = await capital_dashboard_service.build_dashboard(
        api_key=api_key,
        api_secret=api_secret,
        source=source,
        target_daily_usdt=targetDailyUsdt,
        fixed_income_annual_pct=fixedIncomeAnnualPct,
        tenant_id=tenant_id,
        capital_repo=CapitalReconciliationRepository(db),
        btc_core_repo=BtcCoreRepository(db),
        financial_history_repo=FinancialHistoryRepository(db),
    )
    return CapitalDashboardOut(**payload)
