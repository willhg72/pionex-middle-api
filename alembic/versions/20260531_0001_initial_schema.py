"""initial schema

Revision ID: 20260531_0001
Revises: None
Create Date: 2026-05-31 00:00:01
"""

from alembic import op
import sqlalchemy as sa


revision = "20260531_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=80), nullable=False),
        sa.Column("event_type", sa.String(length=120), nullable=False),
        sa.Column("actor", sa.String(length=120), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_audit_logs_tenant_id", "audit_logs", ["tenant_id"])
    op.create_index("ix_audit_logs_event_type", "audit_logs", ["event_type"])
    op.create_index("ix_audit_logs_actor", "audit_logs", ["actor"])
    op.create_index("ix_audit_logs_created_at", "audit_logs", ["created_at"])

    op.create_table(
        "miner_snapshots",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=80), nullable=False),
        sa.Column("bu_order_id", sa.String(length=120), nullable=False),
        sa.Column("symbol", sa.String(length=32), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=True),
        sa.Column("close_profit", sa.Float(), nullable=True),
        sa.Column("grid_profit", sa.Float(), nullable=True),
        sa.Column("trend_pnl", sa.Float(), nullable=True),
        sa.Column("inventory_ratio", sa.Float(), nullable=True),
        sa.Column("range_health", sa.String(length=40), nullable=True),
        sa.Column("payload_json", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_miner_snapshots_tenant_id", "miner_snapshots", ["tenant_id"])
    op.create_index("ix_miner_snapshots_bu_order_id", "miner_snapshots", ["bu_order_id"])
    op.create_index("ix_miner_snapshots_symbol", "miner_snapshots", ["symbol"])
    op.create_index("ix_miner_snapshots_created_at", "miner_snapshots", ["created_at"])

    op.create_table(
        "miner_events",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=80), nullable=False),
        sa.Column("bu_order_id", sa.String(length=120), nullable=False),
        sa.Column("symbol", sa.String(length=32), nullable=True),
        sa.Column("event_type", sa.String(length=80), nullable=False),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("payload_json", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_miner_events_tenant_id", "miner_events", ["tenant_id"])
    op.create_index("ix_miner_events_bu_order_id", "miner_events", ["bu_order_id"])
    op.create_index("ix_miner_events_symbol", "miner_events", ["symbol"])
    op.create_index("ix_miner_events_event_type", "miner_events", ["event_type"])
    op.create_index("ix_miner_events_created_at", "miner_events", ["created_at"])

    op.create_table(
        "btc_core_buys",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=80), nullable=False),
        sa.Column("buy_id", sa.String(length=120), nullable=False),
        sa.Column("source", sa.String(length=40), nullable=False),
        sa.Column("btc_amount", sa.Float(), nullable=False),
        sa.Column("usdt_amount", sa.Float(), nullable=False),
        sa.Column("price", sa.Float(), nullable=True),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("order_id", sa.String(length=120), nullable=True),
        sa.Column("client_order_id", sa.String(length=120), nullable=True),
        sa.Column("payload_json", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_btc_core_buys_tenant_id", "btc_core_buys", ["tenant_id"])
    op.create_index("ix_btc_core_buys_buy_id", "btc_core_buys", ["buy_id"], unique=True)
    op.create_index("ix_btc_core_buys_source", "btc_core_buys", ["source"])
    op.create_index("ix_btc_core_buys_created_at", "btc_core_buys", ["created_at"])

    op.create_table(
        "btc_ladder_orders",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=80), nullable=False),
        sa.Column("order_id", sa.String(length=120), nullable=False),
        sa.Column("symbol", sa.String(length=32), nullable=False),
        sa.Column("source_type", sa.String(length=20), nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("usdt_amount", sa.Float(), nullable=False),
        sa.Column("btc_amount", sa.Float(), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("pionex_order_id", sa.String(length=120), nullable=True),
        sa.Column("client_order_id", sa.String(length=120), nullable=True),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("payload_json", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_btc_ladder_orders_tenant_id", "btc_ladder_orders", ["tenant_id"])
    op.create_index("ix_btc_ladder_orders_order_id", "btc_ladder_orders", ["order_id"], unique=True)
    op.create_index("ix_btc_ladder_orders_symbol", "btc_ladder_orders", ["symbol"])
    op.create_index("ix_btc_ladder_orders_source_type", "btc_ladder_orders", ["source_type"])
    op.create_index("ix_btc_ladder_orders_status", "btc_ladder_orders", ["status"])
    op.create_index("ix_btc_ladder_orders_created_at", "btc_ladder_orders", ["created_at"])

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
    op.drop_table("scalping_monitors")
    op.drop_table("btc_ladder_orders")
    op.drop_table("btc_core_buys")
    op.drop_table("miner_events")
    op.drop_table("miner_snapshots")
    op.drop_table("audit_logs")
