"""ensure scalping_monitors table exists

Revision ID: 20260531_0004
Revises: 20260531_0003
Create Date: 2026-05-31 10:05:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260531_0004"
down_revision = "20260531_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = set(inspector.get_table_names())

    if "scalping_monitors" not in tables:
        op.create_table(
            "scalping_monitors",
            sa.Column("id", sa.String(length=36), nullable=False),
            sa.Column("tenant_id", sa.String(length=80), nullable=False),
            sa.Column("monitor_id", sa.String(length=120), nullable=False),
            sa.Column("mode", sa.String(length=40), nullable=False),
            sa.Column("status", sa.String(length=40), nullable=False),
            sa.Column("symbol", sa.String(length=32), nullable=False),
            sa.Column("source", sa.String(length=30), nullable=True),
            sa.Column("direction", sa.String(length=20), nullable=True),
            sa.Column("stop_loss", sa.Float(), nullable=True),
            sa.Column("take_profit", sa.Float(), nullable=True),
            sa.Column("last_price", sa.Float(), nullable=True),
            sa.Column("triggered_by", sa.String(length=40), nullable=True),
            sa.Column("error", sa.Text(), nullable=True),
            sa.Column("payload_json", sa.Text(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
            sa.Column("ended_at", sa.DateTime(timezone=True), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_scalping_monitors_tenant_id", "scalping_monitors", ["tenant_id"])
        op.create_index("ix_scalping_monitors_monitor_id", "scalping_monitors", ["monitor_id"], unique=True)
        op.create_index("ix_scalping_monitors_mode", "scalping_monitors", ["mode"])
        op.create_index("ix_scalping_monitors_status", "scalping_monitors", ["status"])
        op.create_index("ix_scalping_monitors_symbol", "scalping_monitors", ["symbol"])
        op.create_index("ix_scalping_monitors_created_at", "scalping_monitors", ["created_at"])


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = set(inspector.get_table_names())
    if "scalping_monitors" in tables:
        op.drop_table("scalping_monitors")
