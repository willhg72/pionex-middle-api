from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class FleetSnapshot(Base):
    __tablename__ = "fleet_snapshots"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    tenant_id: Mapped[str] = mapped_column(String(80), index=True, default="legacy")
    captured_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    free_usdt: Mapped[float | None] = mapped_column(Float, nullable=True)
    frozen_usdt: Mapped[float | None] = mapped_column(Float, nullable=True)
    active_bot_count: Mapped[int] = mapped_column(Integer, default=0)
    active_bu_order_ids_json: Mapped[str] = mapped_column(Text)
    active_capital_usdt: Mapped[float | None] = mapped_column(Float, nullable=True)
    active_closeable_pnl: Mapped[float | None] = mapped_column(Float, nullable=True)
    account_total_usdt_estimate: Mapped[float | None] = mapped_column(Float, nullable=True)
    source: Mapped[str | None] = mapped_column(String(80), nullable=True)
    payload_json: Mapped[str] = mapped_column(Text)


class MinerCloseEvent(Base):
    __tablename__ = "miner_close_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    tenant_id: Mapped[str] = mapped_column(String(80), index=True, default="legacy")
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    bu_order_id: Mapped[str] = mapped_column(String(120), index=True)
    symbol: Mapped[str | None] = mapped_column(String(32), nullable=True, index=True)
    closed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    close_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    capital_before_close: Mapped[float | None] = mapped_column(Float, nullable=True)
    realized_pnl_usdt: Mapped[float | None] = mapped_column(Float, nullable=True)
    released_usdt_estimate: Mapped[float | None] = mapped_column(Float, nullable=True)
    wallet_delta_usdt: Mapped[float | None] = mapped_column(Float, nullable=True)
    redeployed_within_window: Mapped[bool] = mapped_column(Boolean, default=False)
    replacement_bu_order_id: Mapped[str | None] = mapped_column(String(120), nullable=True)
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    source: Mapped[str | None] = mapped_column(String(80), nullable=True)
    payload_json: Mapped[str] = mapped_column(Text)
