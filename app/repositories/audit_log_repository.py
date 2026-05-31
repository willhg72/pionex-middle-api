from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.audit_log import AuditLog


class AuditLogRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, *, event_type: str, actor: str, message: str) -> AuditLog:
        log = AuditLog(event_type=event_type, actor=actor, message=message)
        self.session.add(log)
        await self.session.commit()
        await self.session.refresh(log)
        return log
