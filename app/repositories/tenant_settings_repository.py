from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.tenant_settings import TenantSettings


class TenantSettingsRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_tenant_id(self, tenant_id: str) -> TenantSettings | None:
        stmt: Select[tuple[TenantSettings]] = select(TenantSettings).where(TenantSettings.tenant_id == tenant_id)
        return await self.session.scalar(stmt)

    async def upsert(
        self,
        *,
        tenant_id: str,
        exchange: str,
        exchange_api_key_encrypted: str | None,
        exchange_api_secret_encrypted: str | None,
        risk_profile: str,
        max_cap_pct: float,
        max_leverage: int,
        refresh_interval: int,
        theme: str,
    ) -> TenantSettings:
        row = await self.get_by_tenant_id(tenant_id)
        if row is None:
            row = TenantSettings(
                tenant_id=tenant_id,
                exchange=exchange,
                exchange_api_key_encrypted=exchange_api_key_encrypted,
                exchange_api_secret_encrypted=exchange_api_secret_encrypted,
                risk_profile=risk_profile,
                max_cap_pct=max_cap_pct,
                max_leverage=max_leverage,
                refresh_interval=refresh_interval,
                theme=theme,
            )
            self.session.add(row)
        else:
            row.exchange = exchange
            row.exchange_api_key_encrypted = exchange_api_key_encrypted
            row.exchange_api_secret_encrypted = exchange_api_secret_encrypted
            row.risk_profile = risk_profile
            row.max_cap_pct = max_cap_pct
            row.max_leverage = max_leverage
            row.refresh_interval = refresh_interval
            row.theme = theme
        await self.session.flush()
        return row

    async def commit(self) -> None:
        await self.session.commit()
