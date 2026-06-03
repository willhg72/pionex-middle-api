import json
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.capital_reconciliation import FleetSnapshot, MinerCloseEvent


def _parse_json(text: str | None) -> dict[str, Any]:
    try:
        data = json.loads(text or "{}")
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


class CapitalReconciliationRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def save_fleet_snapshot(self, *, tenant_id: str, snapshot: dict[str, Any]) -> FleetSnapshot:
        model = FleetSnapshot(
            tenant_id=tenant_id,
            free_usdt=snapshot.get("freeUsdt"),
            frozen_usdt=snapshot.get("frozenUsdt"),
            active_bot_count=int(snapshot.get("activeBotCount") or 0),
            active_bu_order_ids_json=json.dumps(snapshot.get("activeBuOrderIds") or [], ensure_ascii=False),
            active_capital_usdt=snapshot.get("activeCapitalUsdt"),
            active_closeable_pnl=snapshot.get("activeCloseablePnl"),
            account_total_usdt_estimate=snapshot.get("accountTotalUsdtEstimate"),
            source=snapshot.get("source"),
            payload_json=json.dumps(snapshot, ensure_ascii=False),
        )
        self.session.add(model)
        await self.session.flush()
        return model

    async def get_latest_snapshot(self, *, tenant_id: str) -> dict[str, Any] | None:
        stmt = (
            select(FleetSnapshot)
            .where(FleetSnapshot.tenant_id == tenant_id)
            .order_by(desc(FleetSnapshot.captured_at))
            .limit(1)
        )
        row = (await self.session.execute(stmt)).scalars().first()
        if not row:
            return None
        payload = _parse_json(row.payload_json)
        payload.setdefault("snapshotId", row.id)
        payload.setdefault("capturedAt", row.captured_at.isoformat() if row.captured_at else None)
        return payload

    async def list_recent_close_events(self, *, tenant_id: str, limit: int = 50) -> list[dict[str, Any]]:
        stmt = (
            select(MinerCloseEvent)
            .where(MinerCloseEvent.tenant_id == tenant_id)
            .order_by(desc(MinerCloseEvent.detected_at))
            .limit(limit)
        )
        rows = (await self.session.execute(stmt)).scalars().all()
        out: list[dict[str, Any]] = []
        for row in rows:
            payload = _parse_json(row.payload_json)
            out.append(
                {
                    "eventId": row.id,
                    "detectedAt": row.detected_at.isoformat() if row.detected_at else None,
                    "buOrderId": row.bu_order_id,
                    "symbol": row.symbol,
                    "closedAt": row.closed_at.isoformat() if row.closed_at else None,
                    "closeReason": row.close_reason,
                    "capitalBeforeClose": row.capital_before_close,
                    "realizedPnlUsdt": row.realized_pnl_usdt,
                    "releasedUsdtEstimate": row.released_usdt_estimate,
                    "walletDeltaUsdt": row.wallet_delta_usdt,
                    "redeployedWithinWindow": row.redeployed_within_window,
                    "replacementBuOrderId": row.replacement_bu_order_id,
                    "confidence": row.confidence,
                    "source": row.source,
                    "capitalReusedEstimate": payload.get("capitalReusedEstimate"),
                    "freeCashImpact": payload.get("freeCashImpact"),
                    "payload": payload,
                }
            )
        return out

    async def find_close_event(self, *, tenant_id: str, bu_order_id: str) -> dict[str, Any] | None:
        stmt = (
            select(MinerCloseEvent)
            .where(MinerCloseEvent.tenant_id == tenant_id, MinerCloseEvent.bu_order_id == bu_order_id)
            .order_by(desc(MinerCloseEvent.detected_at))
            .limit(1)
        )
        row = (await self.session.execute(stmt)).scalars().first()
        if not row:
            return None
        return {
            "eventId": row.id,
            "detectedAt": row.detected_at.isoformat() if row.detected_at else None,
            "buOrderId": row.bu_order_id,
        }

    async def save_close_event(self, *, tenant_id: str, event: dict[str, Any]) -> MinerCloseEvent:
        closed_at = None
        closed_text = str(event.get("closedAt") or "").strip()
        if closed_text:
            try:
                closed_at = datetime.fromisoformat(closed_text.replace("Z", "+00:00")).astimezone(timezone.utc)
            except ValueError:
                closed_at = None
        model = MinerCloseEvent(
            tenant_id=tenant_id,
            bu_order_id=str(event.get("buOrderId") or ""),
            symbol=event.get("symbol"),
            closed_at=closed_at,
            close_reason=event.get("closeReason"),
            capital_before_close=event.get("capitalBeforeClose"),
            realized_pnl_usdt=event.get("realizedPnlUsdt"),
            released_usdt_estimate=event.get("releasedUsdtEstimate"),
            wallet_delta_usdt=event.get("walletDeltaUsdt"),
            redeployed_within_window=bool(event.get("redeployedWithinWindow")),
            replacement_bu_order_id=event.get("replacementBuOrderId"),
            confidence=event.get("confidence"),
            source=event.get("source"),
            payload_json=json.dumps(event, ensure_ascii=False),
        )
        self.session.add(model)
        await self.session.flush()
        return model

    async def commit(self) -> None:
        await self.session.commit()
