from pydantic import BaseModel


class DiscoveryResponse(BaseModel):
    ok: bool
    summary: dict
    candidates: list[dict]
    errors: list[dict]
