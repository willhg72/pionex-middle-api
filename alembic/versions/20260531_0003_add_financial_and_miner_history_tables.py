"""add financial and miner history aggregate tables

Revision ID: 20260531_0003
Revises: 20260531_0002
Create Date: 2026-05-31 09:15:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260531_0003"
down_revision = "20260531_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "financial_history_entries",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=80), nullable=False),
        sa.Column("t", sa.BigInteger(), nullable=False),
        sa.Column("month", sa.String(length=16), nullable=True),
        sa.Column("total_money", sa.Float(), nullable=True),
        sa.Column("active_revenue", sa.Float(), nullable=True),
        sa.Column("promo_revenue", sa.Float(), nullable=True),
        sa.Column("all_active_revenue", sa.Float(), nullable=True),
        sa.Column("close_profit_now", sa.Float(), nullable=True),
        sa.Column("useful_profit_24h", sa.Float(), nullable=True),
        sa.Column("usdt_wallet", sa.Float(), nullable=True),
        sa.Column("bot_margin", sa.Float(), nullable=True),
        sa.Column("btc_value", sa.Float(), nullable=True),
        sa.Column("btc_wallet", sa.Float(), nullable=True),
        sa.Column("promo_margin", sa.Float(), nullable=True),
        sa.Column("own_miner_count", sa.Integer(), nullable=True),
        sa.Column("payload_json", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_financial_history_entries_tenant_id", "financial_history_entries", ["tenant_id"])
    op.create_index("ix_financial_history_entries_t", "financial_history_entries", ["t"])
    op.create_index("ix_financial_history_entries_month", "financial_history_entries", ["month"])
    op.create_index("ix_financial_history_entries_created_at", "financial_history_entries", ["created_at"])

    op.create_table(
        "miner_history_aggregate",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=80), nullable=False),
        sa.Column("miner_ref", sa.String(length=120), nullable=False),
        sa.Column("snapshot_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("first_t", sa.BigInteger(), nullable=True),
        sa.Column("last_t", sa.BigInteger(), nullable=True),
        sa.Column("history_json", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_miner_history_aggregate_tenant_id", "miner_history_aggregate", ["tenant_id"])
    op.create_index("ix_miner_history_aggregate_miner_ref", "miner_history_aggregate", ["miner_ref"])
    op.create_index("ix_miner_history_aggregate_last_t", "miner_history_aggregate", ["last_t"])
    op.create_index("ix_miner_history_aggregate_created_at", "miner_history_aggregate", ["created_at"])


def downgrade() -> None:
    op.drop_table("miner_history_aggregate")
    op.drop_table("financial_history_entries")
