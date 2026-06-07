import json
from typing import Any

from sqlalchemy import asc, desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.financial_history import FinancialHistoryEntry


def _parse_json(text: str | None) -> dict[str, Any]:
    try:
        data = json.loads(text or "{}")
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


class FinancialHistoryRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_recent_entries(self, *, tenant_id: str, limit: int = 24) -> list[dict[str, Any]]:
        stmt = (
            select(FinancialHistoryEntry)
            .where(FinancialHistoryEntry.tenant_id == tenant_id)
            .order_by(desc(FinancialHistoryEntry.t), desc(FinancialHistoryEntry.created_at))
            .limit(limit)
        )
        rows = (await self.session.execute(stmt)).scalars().all()
        return [self._to_payload(row) for row in reversed(rows)]

    async def list_monthly_entries(self, *, tenant_id: str) -> list[dict[str, Any]]:
        stmt = (
            select(FinancialHistoryEntry)
            .where(FinancialHistoryEntry.tenant_id == tenant_id)
            .order_by(asc(FinancialHistoryEntry.t), asc(FinancialHistoryEntry.created_at))
        )
        rows = (await self.session.execute(stmt)).scalars().all()
        latest_by_month: dict[str, dict[str, Any]] = {}
        for row in rows:
            payload = self._to_payload(row)
            month = str(payload.get("month") or "")
            if not month:
                continue
            latest_by_month[month] = payload
        return list(latest_by_month.values())

    def _to_payload(self, row: FinancialHistoryEntry) -> dict[str, Any]:
        payload = _parse_json(row.payload_json)
        payload.setdefault("t", row.t)
        payload.setdefault("month", row.month)
        payload.setdefault("totalMoney", row.total_money)
        payload.setdefault("activeRevenue", row.active_revenue)
        payload.setdefault("promoRevenue", row.promo_revenue)
        payload.setdefault("allActiveRevenue", row.all_active_revenue)
        payload.setdefault("closeProfitNow", row.close_profit_now)
        payload.setdefault("usefulProfit24h", row.useful_profit_24h)
        payload.setdefault("usdtWallet", row.usdt_wallet)
        payload.setdefault("botMargin", row.bot_margin)
        payload.setdefault("btcValue", row.btc_value)
        payload.setdefault("btcWallet", row.btc_wallet)
        payload.setdefault("promoMargin", row.promo_margin)
        payload.setdefault("ownWorkerCount", row.own_miner_count)
        payload.setdefault("createdAt", row.created_at.isoformat() if row.created_at else None)
        return payload
