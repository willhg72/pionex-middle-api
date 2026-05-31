from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class BtcLadderOrder(Base):
    __tablename__ = "btc_ladder_orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    order_id: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    symbol: Mapped[str] = mapped_column(String(32), default="BTC_USDT", index=True)
    source_type: Mapped[str] = mapped_column(String(20), default="LADDER", index=True)
    price: Mapped[float] = mapped_column(Float)
    usdt_amount: Mapped[float] = mapped_column(Float)
    btc_amount: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(30), default="placed", index=True)
    pionex_order_id: Mapped[str | None] = mapped_column(String(120), nullable=True)
    client_order_id: Mapped[str | None] = mapped_column(String(120), nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    payload_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
