from pydantic import BaseModel, ConfigDict, Field


class CapitalReconciliationIn(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {"targetDailyUsdt": 1.0, "api_key": "tenant-pionex-key", "api_secret": "tenant-pionex-secret"}
        }
    )
    targetDailyUsdt: float = Field(default=1.0, gt=0)
    api_key: str | None = None
    api_secret: str | None = None


class CapitalReconciliationOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "source": "request",
                "snapshot": {"activeBotCount": 2, "freeUsdt": 170.2},
                "summary": {"closedMinersToday": 1, "realizedPnlToday": -4.8, "releasedCapitalToday": 170.2},
                "recentCloseEvents": [],
            }
        }
    )
    ok: bool
    source: str
    snapshot: dict
    previousSnapshot: dict | None = None
    summary: dict
    recentCloseEvents: list[dict]
