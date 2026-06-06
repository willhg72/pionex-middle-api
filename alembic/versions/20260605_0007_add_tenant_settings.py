"""add tenant settings

Revision ID: 20260605_0007
Revises: 20260605_0006
Create Date: 2026-06-05 00:00:02
"""

from alembic import op
import sqlalchemy as sa


revision = "20260605_0007"
down_revision = "20260605_0006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "tenant_settings",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=36), nullable=False),
        sa.Column("exchange", sa.String(length=40), nullable=False),
        sa.Column("exchange_api_key_encrypted", sa.Text(), nullable=True),
        sa.Column("exchange_api_secret_encrypted", sa.Text(), nullable=True),
        sa.Column("risk_profile", sa.String(length=40), nullable=False),
        sa.Column("max_cap_pct", sa.Float(), nullable=False),
        sa.Column("max_leverage", sa.Integer(), nullable=False),
        sa.Column("refresh_interval", sa.Integer(), nullable=False),
        sa.Column("theme", sa.String(length=24), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_tenant_settings_tenant_id", "tenant_settings", ["tenant_id"], unique=True)


def downgrade() -> None:
    op.drop_table("tenant_settings")
