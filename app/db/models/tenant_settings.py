from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class TenantSettings(Base):
    __tablename__ = "tenant_settings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    exchange: Mapped[str] = mapped_column(String(40), nullable=False, default="pionex")
    exchange_api_key_encrypted: Mapped[str | None] = mapped_column(Text, nullable=True)
    exchange_api_secret_encrypted: Mapped[str | None] = mapped_column(Text, nullable=True)
    risk_profile: Mapped[str] = mapped_column(String(40), nullable=False, default="moderate")
    max_cap_pct: Mapped[float] = mapped_column(Float, nullable=False, default=90.0)
    max_leverage: Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    refresh_interval: Mapped[int] = mapped_column(Integer, nullable=False, default=30)
    fixed_income_annual_pct: Mapped[float] = mapped_column(Float, nullable=False, default=3.48)
    plan_tier: Mapped[str] = mapped_column(String(24), nullable=False, default="free")
    theme: Mapped[str] = mapped_column(String(24), nullable=False, default="dark")
    language: Mapped[str] = mapped_column(String(8), nullable=False, default="es")
    timezone: Mapped[str] = mapped_column(String(80), nullable=False, default="America/Bogota")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
