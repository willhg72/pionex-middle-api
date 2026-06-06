import json
from typing import Any

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.btc_ladder import BtcLadderOrder


class BtcLadderRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create_order(
        self,
        *,
        tenant_id: str,
        order_id: str,
        price: float,
        usdt_amount: float,
        btc_amount: float,
        status: str,
        pionex_order_id: str | None,
        client_order_id: str | None,
        note: str | None = None,
        payload: dict[str, Any] | None = None,
    ) -> None:
        self.session.add(
            BtcLadderOrder(
                tenant_id=tenant_id,
                order_id=order_id,
                price=price,
                usdt_amount=usdt_amount,
                btc_amount=btc_amount,
                status=status,
                pionex_order_id=pionex_order_id,
                client_order_id=client_order_id,
                note=note,
                payload_json=json.dumps(payload, ensure_ascii=False) if payload else None,
            )
        )

    @staticmethod
    def _decode_payload(row: BtcLadderOrder) -> dict[str, Any]:
        if not row.payload_json:
            return {}
        try:
            payload = json.loads(row.payload_json)
            return payload if isinstance(payload, dict) else {}
        except Exception:
            return {}

    @classmethod
    def _serialize_row(cls, row: BtcLadderOrder) -> dict[str, Any]:
        payload = cls._decode_payload(row)
        return {
            "id": row.id,
            "orderId": row.order_id,
            "createdAt": row.created_at.isoformat() if row.created_at else None,
            "symbol": row.symbol,
            "sourceType": row.source_type,
            "price": row.price,
            "usdtAmount": row.usdt_amount,
            "btcAmount": row.btc_amount,
            "status": row.status,
            "pionexOrderId": row.pionex_order_id,
            "clientOrderId": row.client_order_id,
            "note": row.note,
            "filledBtcAmount": payload.get("filledBtcAmount", 0.0),
            "filledUsdtAmount": payload.get("filledUsdtAmount", 0.0),
            "reconciled": bool(payload.get("reconciled", False)),
            "statusReason": payload.get("statusReason"),
            "lastCheckedAt": payload.get("lastCheckedAt"),
        }

    async def list_orders(self, *, tenant_id: str, limit: int = 200) -> list[dict[str, Any]]:
        rows = (
            await self.session.execute(
                select(BtcLadderOrder).where(BtcLadderOrder.tenant_id == tenant_id).order_by(desc(BtcLadderOrder.created_at)).limit(limit)
            )
        ).scalars().all()
        return [self._serialize_row(row) for row in rows]

    async def list_order_models(self, *, tenant_id: str, limit: int = 200) -> list[BtcLadderOrder]:
        return (
            await self.session.execute(
                select(BtcLadderOrder).where(BtcLadderOrder.tenant_id == tenant_id).order_by(desc(BtcLadderOrder.created_at)).limit(limit)
            )
        ).scalars().all()

    async def update_order_state(
        self,
        *,
        row: BtcLadderOrder,
        status: str | None = None,
        note: str | None = None,
        payload_patch: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        payload = self._decode_payload(row)
        if payload_patch:
            payload.update(payload_patch)
        if status is not None:
            row.status = status
        if note is not None:
            row.note = note
        row.payload_json = json.dumps(payload, ensure_ascii=False) if payload else None
        await self.session.flush()
        return self._serialize_row(row)

    async def commit(self) -> None:
        await self.session.commit()
