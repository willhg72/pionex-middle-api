"""add language and timezone to tenant settings

Revision ID: 20260605_0008
Revises: 20260605_0007
Create Date: 2026-06-05 19:30:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "20260605_0008"
down_revision = "20260605_0007"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("tenant_settings", sa.Column("language", sa.String(length=8), nullable=False, server_default="es"))
    op.add_column(
        "tenant_settings",
        sa.Column("timezone", sa.String(length=80), nullable=False, server_default="America/Bogota"),
    )
    op.alter_column("tenant_settings", "language", server_default=None)
    op.alter_column("tenant_settings", "timezone", server_default=None)


def downgrade() -> None:
    op.drop_column("tenant_settings", "timezone")
    op.drop_column("tenant_settings", "language")
