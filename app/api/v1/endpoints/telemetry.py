from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_api_key
from app.db.session import get_db_session
from app.services.audit_service import AuditService

router = APIRouter(prefix="/telemetry", dependencies=[Depends(require_api_key)])


class TelemetryEventIn(BaseModel):
    eventType: str = Field(min_length=2, max_length=120)
    actor: str = Field(default="system", min_length=1, max_length=120)
    message: str = Field(min_length=2, max_length=4000)


class TelemetryEventOut(BaseModel):
    ok: bool
    id: str


@router.post("/events", response_model=TelemetryEventOut)
async def create_event(payload: TelemetryEventIn, db: AsyncSession = Depends(get_db_session)) -> TelemetryEventOut:
    service = AuditService(db)
    log = await service.repo.create(
        event_type=payload.eventType,
        actor=payload.actor,
        message=payload.message,
    )
    return TelemetryEventOut(ok=True, id=log.id)
