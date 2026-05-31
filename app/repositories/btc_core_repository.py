import json
from typing import Any

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.btc_core import BtcCoreBuy


class BtcCoreRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create_buy(
        self,
        *,
        buy_id: str,
        source: str,
        btc_amount: float,
        usdt_amount: float,
        price: float | None,
        note: str | None,
        order_id: str | None,
        client_order_id: str | None,
        payload: dict[str, Any] | None,
    ) -> None:
        self.session.add(
            BtcCoreBuy(
                buy_id=buy_id,
                source=source,
                btc_amount=btc_amount,
                usdt_amount=usdt_amount,
                price=price,
                note=note,
                order_id=order_id,
                client_order_id=client_order_id,
                payload_json=json.dumps(payload, ensure_ascii=False) if payload else None,
            )
        )

    async def list_buys(self, limit: int = 500) -> list[dict[str, Any]]:
        rows = (await self.session.execute(select(BtcCoreBuy).order_by(desc(BtcCoreBuy.created_at)).limit(limit))).scalars().all()
        return [
            {
                "buyId": row.buy_id,
                "source": row.source,
                "btcAmount": row.btc_amount,
                "usdtAmount": row.usdt_amount,
                "price": row.price,
                "note": row.note,
                "orderId": row.order_id,
                "clientOrderId": row.client_order_id,
                "createdAt": row.created_at.isoformat() if row.created_at else None,
            }
            for row in rows
        ]

    async def commit(self) -> None:
        await self.session.commit()
