import json
from typing import Any

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.miners import MinerEvent, MinerSnapshot


class MinerOpsRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def save_snapshot(self, row: dict[str, Any]) -> None:
        model = MinerSnapshot(
            bu_order_id=str(row.get("buOrderId") or ""),
            symbol=str(row.get("symbol") or ""),
            status=row.get("status"),
            close_profit=row.get("closeProfit"),
            grid_profit=row.get("gridProfit"),
            trend_pnl=row.get("trendPnl"),
            inventory_ratio=row.get("inventoryRatio"),
            range_health=row.get("rangeHealth"),
            payload_json=json.dumps(row, ensure_ascii=False),
        )
        self.session.add(model)

    async def save_event(self, *, bu_order_id: str, symbol: str | None, event_type: str, reason: str | None, payload: dict[str, Any]) -> None:
        model = MinerEvent(
            bu_order_id=bu_order_id,
            symbol=symbol,
            event_type=event_type,
            reason=reason,
            payload_json=json.dumps(payload, ensure_ascii=False),
        )
        self.session.add(model)

    async def list_snapshots(self, *, symbol: str | None, limit: int) -> list[dict[str, Any]]:
        stmt = select(MinerSnapshot).order_by(desc(MinerSnapshot.created_at)).limit(limit)
        if symbol:
            stmt = stmt.where(MinerSnapshot.symbol == symbol.upper())
        rows = (await self.session.execute(stmt)).scalars().all()
        return [
            {
                "id": row.id,
                "buOrderId": row.bu_order_id,
                "symbol": row.symbol,
                "status": row.status,
                "closeProfit": row.close_profit,
                "gridProfit": row.grid_profit,
                "trendPnl": row.trend_pnl,
                "inventoryRatio": row.inventory_ratio,
                "rangeHealth": row.range_health,
                "createdAt": row.created_at.isoformat() if row.created_at else None,
            }
            for row in rows
        ]

    async def list_events(self, *, symbol: str | None, limit: int) -> list[dict[str, Any]]:
        stmt = select(MinerEvent).order_by(desc(MinerEvent.created_at)).limit(limit)
        if symbol:
            stmt = stmt.where(MinerEvent.symbol == symbol.upper())
        rows = (await self.session.execute(stmt)).scalars().all()
        return [
            {
                "id": row.id,
                "buOrderId": row.bu_order_id,
                "symbol": row.symbol,
                "eventType": row.event_type,
                "reason": row.reason,
                "createdAt": row.created_at.isoformat() if row.created_at else None,
            }
            for row in rows
        ]

    async def commit(self) -> None:
        await self.session.commit()
