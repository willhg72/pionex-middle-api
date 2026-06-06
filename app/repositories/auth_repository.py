from datetime import datetime, timezone

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.auth import AppUser, Tenant, TenantMember


class AuthRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_user_by_email(self, email: str) -> AppUser | None:
        stmt: Select[tuple[AppUser]] = select(AppUser).where(AppUser.email == email)
        return await self.session.scalar(stmt)

    async def get_tenant_by_slug(self, slug: str) -> Tenant | None:
        stmt: Select[tuple[Tenant]] = select(Tenant).where(Tenant.slug == slug)
        return await self.session.scalar(stmt)

    async def get_tenant(self, tenant_id: str) -> Tenant | None:
        stmt: Select[tuple[Tenant]] = select(Tenant).where(Tenant.id == tenant_id)
        return await self.session.scalar(stmt)

    async def get_membership(self, *, user_id: str, tenant_id: str) -> TenantMember | None:
        stmt: Select[tuple[TenantMember]] = select(TenantMember).where(
            TenantMember.user_id == user_id,
            TenantMember.tenant_id == tenant_id,
        )
        return await self.session.scalar(stmt)

    async def list_memberships_for_user(self, user_id: str) -> list[tuple[TenantMember, Tenant]]:
        stmt = (
            select(TenantMember, Tenant)
            .join(Tenant, Tenant.id == TenantMember.tenant_id)
            .where(TenantMember.user_id == user_id)
            .order_by(Tenant.created_at.asc())
        )
        result = await self.session.execute(stmt)
        return list(result.all())

    async def create_user(self, *, email: str, full_name: str, password_hash: str) -> AppUser:
        user = AppUser(email=email, full_name=full_name, password_hash=password_hash)
        self.session.add(user)
        await self.session.flush()
        return user

    async def create_tenant(self, *, name: str, slug: str) -> Tenant:
        tenant = Tenant(name=name, slug=slug)
        self.session.add(tenant)
        await self.session.flush()
        return tenant

    async def create_membership(self, *, tenant_id: str, user_id: str, role: str) -> TenantMember:
        membership = TenantMember(tenant_id=tenant_id, user_id=user_id, role=role)
        self.session.add(membership)
        await self.session.flush()
        return membership

    async def touch_user_login(self, user: AppUser) -> None:
        user.last_login_at = datetime.now(timezone.utc)
        await self.session.flush()

    async def commit(self) -> None:
        await self.session.commit()
