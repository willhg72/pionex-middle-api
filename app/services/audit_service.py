from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.audit_log_repository import AuditLogRepository


class AuditService:
    def __init__(self, session: AsyncSession) -> None:
        self.repo = AuditLogRepository(session)

    async def register_event(self, *, event_type: str, actor: str, message: str) -> None:
        await self.repo.create(event_type=event_type, actor=actor, message=message)
