from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class MinerSnapshot(Base):
    __tablename__ = "miner_snapshots"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    tenant_id: Mapped[str] = mapped_column(String(80), index=True, default="legacy")
    bu_order_id: Mapped[str] = mapped_column(String(120), index=True)
    symbol: Mapped[str] = mapped_column(String(32), index=True)
    status: Mapped[str | None] = mapped_column(String(40), nullable=True)
    close_profit: Mapped[float | None] = mapped_column(Float, nullable=True)
    grid_profit: Mapped[float | None] = mapped_column(Float, nullable=True)
    trend_pnl: Mapped[float | None] = mapped_column(Float, nullable=True)
    inventory_ratio: Mapped[float | None] = mapped_column(Float, nullable=True)
    range_health: Mapped[str | None] = mapped_column(String(40), nullable=True)
    payload_json: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)


class MinerEvent(Base):
    __tablename__ = "miner_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    tenant_id: Mapped[str] = mapped_column(String(80), index=True, default="legacy")
    bu_order_id: Mapped[str] = mapped_column(String(120), index=True)
    symbol: Mapped[str | None] = mapped_column(String(32), nullable=True, index=True)
    event_type: Mapped[str] = mapped_column(String(80), index=True)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    payload_json: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
