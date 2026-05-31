import json
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.idempotency import IdempotencyKey


class IdempotencyRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get(self, *, tenant_id: str, scope: str, idem_key: str) -> tuple[int, dict[str, Any]] | None:
        row = (
            await self.session.execute(
                select(IdempotencyKey).where(
                    IdempotencyKey.tenant_id == tenant_id,
                    IdempotencyKey.scope == scope,
                    IdempotencyKey.idem_key == idem_key,
                )
            )
        ).scalar_one_or_none()
        if not row:
            return None
        try:
            payload = json.loads(row.response_json or "{}")
        except Exception:
            payload = {}
        return row.status_code, payload if isinstance(payload, dict) else {}

    async def save(self, *, tenant_id: str, scope: str, idem_key: str, status_code: int, response: dict[str, Any]) -> None:
        existing = await self.get(tenant_id=tenant_id, scope=scope, idem_key=idem_key)
        if existing:
            return
        self.session.add(
            IdempotencyKey(
                tenant_id=tenant_id,
                scope=scope,
                idem_key=idem_key,
                status_code=status_code,
                response_json=json.dumps(response, ensure_ascii=False),
            )
        )

    async def commit(self) -> None:
        await self.session.commit()
