from pydantic import BaseModel, ConfigDict


class CapitalDashboardOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ok": True,
                "source": "tenant_settings",
                "asOf": "2026-06-06T12:00:00Z",
                "summary": {"totalCapitalVisible": 18250.4, "capitalMining": 7300.0},
                "buckets": [{"label": "Active Miners", "value": 7300.0, "pct": 40.0, "productive": True, "risk": "medium"}],
                "byTicker": [{"ticker": "BTC", "value": 5200.0, "pct": 28.5}],
                "byRisk": [{"label": "Low Risk", "value": 8400.0, "pct": 46.0}],
                "history": [{"isoDate": "2026-06-06T12:00:00Z", "date": "Jun 6", "total": 18250.4, "pnl": 145.3}],
                "monthlyHistory": [{"month": "2026-06", "totalMoney": 18250.4, "monthRevenue": 145.3}],
                "recentCloseEvents": [],
                "accountBreakdown": {"estimatedEquity": 9100.0, "otherAssetsValue": 1200.0},
                "portfolioAssets": [{"coin": "USDT", "quantity": 584.17, "usdValue": 584.17, "proportionPct": 73.12}],
                "btcDca": {"currentMonth": "2026-06", "currentUsdt": 100.0, "currentAvg": 65000.0, "dcaEdge": 2.5},
                "notes": {"history": "History starts building from persisted fleet snapshots."},
            }
        }
    )

    ok: bool
    source: str
    asOf: str | None = None
    summary: dict
    buckets: list[dict]
    byTicker: list[dict]
    byRisk: list[dict]
    history: list[dict]
    monthlyHistory: list[dict]
    recentCloseEvents: list[dict]
    accountBreakdown: dict
    portfolioAssets: list[dict]
    btcDca: dict
    notes: dict
