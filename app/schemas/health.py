from pydantic import BaseModel


class HealthResponse(BaseModel):
    ok: bool
    service: str
    version: str
    environment: str
