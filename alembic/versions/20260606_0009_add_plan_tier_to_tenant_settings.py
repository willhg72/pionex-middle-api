"""add plan tier to tenant settings

Revision ID: 20260606_0009
Revises: 20260605_0008
Create Date: 2026-06-06 16:40:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260606_0009"
down_revision = "20260605_0008"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "tenant_settings",
        sa.Column("plan_tier", sa.String(length=24), nullable=False, server_default="free"),
    )


def downgrade() -> None:
    op.drop_column("tenant_settings", "plan_tier")
