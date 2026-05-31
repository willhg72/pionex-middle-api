import json
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.scalping import ScalpingMonitor


class ScalpingMonitorRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, *, tenant_id: str, monitor: dict[str, Any]) -> None:
        self.session.add(
            ScalpingMonitor(
                tenant_id=tenant_id,
                monitor_id=str(monitor.get("monitorId") or ""),
                mode=str(monitor.get("mode") or "futures"),
                status=str(monitor.get("status") or "active"),
                symbol=str(monitor.get("symbol") or ""),
                source=monitor.get("source"),
                direction=monitor.get("direction"),
                stop_loss=monitor.get("stopLoss"),
                take_profit=monitor.get("takeProfit"),
                last_price=monitor.get("lastPrice"),
                triggered_by=monitor.get("triggeredBy"),
                error=monitor.get("error"),
                payload_json=json.dumps(monitor, ensure_ascii=False),
            )
        )

    async def update_from_payload(self, *, tenant_id: str, monitor_id: str, payload: dict[str, Any]) -> None:
        row = (await self.session.execute(select(ScalpingMonitor).where(ScalpingMonitor.tenant_id == tenant_id, ScalpingMonitor.monitor_id == monitor_id))).scalar_one_or_none()
        if not row:
            return
        row.status = str(payload.get("status") or row.status)
        row.last_price = payload.get("lastPrice")
        row.triggered_by = payload.get("triggeredBy")
        row.error = payload.get("error")
        row.stop_loss = payload.get("stopLoss")
        row.take_profit = payload.get("takeProfit")
        row.payload_json = json.dumps(payload, ensure_ascii=False)
        if row.status in {"closed", "failed", "timeout"} and row.ended_at is None:
            row.ended_at = datetime.now(timezone.utc)

    async def get(self, *, tenant_id: str, monitor_id: str) -> dict[str, Any] | None:
        row = (await self.session.execute(select(ScalpingMonitor).where(ScalpingMonitor.tenant_id == tenant_id, ScalpingMonitor.monitor_id == monitor_id))).scalar_one_or_none()
        if not row:
            return None
        try:
            payload = json.loads(row.payload_json or "{}")
        except Exception:
            payload = {}
        return payload if isinstance(payload, dict) else None

    async def list_recent(self, *, tenant_id: str, limit: int) -> list[dict[str, Any]]:
        rows = (
            await self.session.execute(
                select(ScalpingMonitor)
                .where(ScalpingMonitor.tenant_id == tenant_id)
                .order_by(desc(ScalpingMonitor.created_at))
                .limit(limit)
            )
        ).scalars().all()
        out: list[dict[str, Any]] = []
        for row in rows:
            try:
                payload = json.loads(row.payload_json or "{}")
            except Exception:
                payload = {}
            if isinstance(payload, dict):
                out.append(payload)
        return out

    async def commit(self) -> None:
        await self.session.commit()
