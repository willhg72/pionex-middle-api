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

    async def list_orders(self, *, tenant_id: str, limit: int = 200) -> list[dict[str, Any]]:
        rows = (
            await self.session.execute(
                select(BtcLadderOrder).where(BtcLadderOrder.tenant_id == tenant_id).order_by(desc(BtcLadderOrder.created_at)).limit(limit)
            )
        ).scalars().all()
        return [
            {
                "id": row.id,
                "orderId": row.order_id,
                "createdAt": row.created_at.isoformat() if row.created_at else None,
                "price": row.price,
                "usdtAmount": row.usdt_amount,
                "btcAmount": row.btc_amount,
                "status": row.status,
                "pionexOrderId": row.pionex_order_id,
                "clientOrderId": row.client_order_id,
            }
            for row in rows
        ]

    async def commit(self) -> None:
        await self.session.commit()
