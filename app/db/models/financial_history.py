from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class FinancialHistoryEntry(Base):
    __tablename__ = "financial_history_entries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    tenant_id: Mapped[str] = mapped_column(String(80), index=True)
    t: Mapped[int] = mapped_column(index=True)
    month: Mapped[str | None] = mapped_column(String(16), nullable=True, index=True)
    total_money: Mapped[float | None] = mapped_column(Float, nullable=True)
    active_revenue: Mapped[float | None] = mapped_column(Float, nullable=True)
    promo_revenue: Mapped[float | None] = mapped_column(Float, nullable=True)
    all_active_revenue: Mapped[float | None] = mapped_column(Float, nullable=True)
    close_profit_now: Mapped[float | None] = mapped_column(Float, nullable=True)
    useful_profit_24h: Mapped[float | None] = mapped_column(Float, nullable=True)
    usdt_wallet: Mapped[float | None] = mapped_column(Float, nullable=True)
    bot_margin: Mapped[float | None] = mapped_column(Float, nullable=True)
    btc_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    btc_wallet: Mapped[float | None] = mapped_column(Float, nullable=True)
    promo_margin: Mapped[float | None] = mapped_column(Float, nullable=True)
    own_miner_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    payload_json: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)


class MinerHistoryAggregate(Base):
    __tablename__ = "miner_history_aggregate"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    tenant_id: Mapped[str] = mapped_column(String(80), index=True)
    miner_ref: Mapped[str] = mapped_column(String(120), index=True)
    snapshot_count: Mapped[int] = mapped_column(Integer, default=0)
    first_t: Mapped[int | None] = mapped_column(nullable=True)
    last_t: Mapped[int | None] = mapped_column(nullable=True, index=True)
    history_json: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
