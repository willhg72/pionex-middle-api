"""add capital reconciliation tables

Revision ID: 20260603_0005
Revises: 20260531_0004
Create Date: 2026-06-03 00:00:01
"""

from alembic import op
import sqlalchemy as sa


revision = "20260603_0005"
down_revision = "20260531_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "fleet_snapshots",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=80), nullable=False),
        sa.Column("captured_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("free_usdt", sa.Float(), nullable=True),
        sa.Column("frozen_usdt", sa.Float(), nullable=True),
        sa.Column("active_bot_count", sa.Integer(), nullable=False),
        sa.Column("active_bu_order_ids_json", sa.Text(), nullable=False),
        sa.Column("active_capital_usdt", sa.Float(), nullable=True),
        sa.Column("active_closeable_pnl", sa.Float(), nullable=True),
        sa.Column("account_total_usdt_estimate", sa.Float(), nullable=True),
        sa.Column("source", sa.String(length=80), nullable=True),
        sa.Column("payload_json", sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_fleet_snapshots_tenant_id", "fleet_snapshots", ["tenant_id"])
    op.create_index("ix_fleet_snapshots_captured_at", "fleet_snapshots", ["captured_at"])

    op.create_table(
        "miner_close_events",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=80), nullable=False),
        sa.Column("detected_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("bu_order_id", sa.String(length=120), nullable=False),
        sa.Column("symbol", sa.String(length=32), nullable=True),
        sa.Column("closed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("close_reason", sa.Text(), nullable=True),
        sa.Column("capital_before_close", sa.Float(), nullable=True),
        sa.Column("realized_pnl_usdt", sa.Float(), nullable=True),
        sa.Column("released_usdt_estimate", sa.Float(), nullable=True),
        sa.Column("wallet_delta_usdt", sa.Float(), nullable=True),
        sa.Column("redeployed_within_window", sa.Boolean(), nullable=False),
        sa.Column("replacement_bu_order_id", sa.String(length=120), nullable=True),
        sa.Column("confidence", sa.Float(), nullable=True),
        sa.Column("source", sa.String(length=80), nullable=True),
        sa.Column("payload_json", sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_miner_close_events_tenant_id", "miner_close_events", ["tenant_id"])
    op.create_index("ix_miner_close_events_detected_at", "miner_close_events", ["detected_at"])
    op.create_index("ix_miner_close_events_bu_order_id", "miner_close_events", ["bu_order_id"])
    op.create_index("ix_miner_close_events_symbol", "miner_close_events", ["symbol"])


def downgrade() -> None:
    op.drop_table("miner_close_events")
    op.drop_table("fleet_snapshots")
