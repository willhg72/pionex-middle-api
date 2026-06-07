"""add fixed income annual pct to tenant settings

Revision ID: 20260606_0010
Revises: 20260606_0009
Create Date: 2026-06-06 18:05:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260606_0010"
down_revision = "20260606_0009"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "tenant_settings",
        sa.Column("fixed_income_annual_pct", sa.Float(), nullable=False, server_default="3.48"),
    )


def downgrade() -> None:
    op.drop_column("tenant_settings", "fixed_income_annual_pct")
