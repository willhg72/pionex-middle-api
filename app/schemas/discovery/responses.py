from pydantic import BaseModel, ConfigDict


class DiscoveryResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "summary": {"evaluated": 120, "passed": 9, "source": "pionex"},
                "candidates": [
                    {
                        "symbol": "BTC_USDT_PERP",
                        "score": 0.84,
                        "volume24h": 128000000.0,
                        "spreadBps": 4.2,
                    }
                ],
                "errors": [],
            }
        }
    )
    ok: bool
    summary: dict
    candidates: list[dict]
    errors: list[dict]
