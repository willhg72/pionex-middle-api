from fastapi.testclient import TestClient

from app.main import app
from app.services.miners_service import miners_service


def _analysis_payload():
    return {
        "liveMiner": {
            "buOrderId": "BU999999",
            "symbol": "BTC_USDT_PERP",
            "minerType": "futures_grid",
            "bottom": 62000.0,
            "top": 68000.0,
            "row": 80,
            "currentPrice": 68950.0,
            "rangePosition": 1.15,
            "closeProfit": 12.5,
            "quoteInvestment": 300.0,
        },
        "rangeBreakState": "BREAK_UP",
        "stabilizationState": "CONFIRMED",
        "stabilizationEvidence": {"hoursObserved": 6.0, "passed": True, "insideRangePct": 0.25},
        "regridCandidate": {
            "bottom": 65000.0,
            "top": 71000.0,
            "row": 80,
            "expectedDailyProfit": 1.0,
            "rangeScore": 82.5,
            "inRangeEfficiency": 0.91,
            "reason": "Breakout remains above the original ceiling with acceptable stabilization evidence.",
            "suggestion": "MIGRATE_UP",
            "oldBottom": 62000.0,
            "oldTop": 68000.0,
            "oldRow": 80,
        },
        "regridSuggestion": "MIGRATE_UP",
        "decisionReason": "Breakout remains above the original ceiling with acceptable stabilization evidence.",
        "blockers": [],
    }


def test_miners_stabilization_check_and_legacy_alias(monkeypatch):
    async def fake_analyze(**kwargs):
        return _analysis_payload()

    monkeypatch.setattr(miners_service, "analyze_miner_regrid", fake_analyze)

    with TestClient(app) as client:
        headers = {"X-API-Key": "test-key"}
        res = client.post(
            "/api/dashboard/workers/stabilization-check",
            headers=headers,
            json={"buOrderId": "BU999999", "mode": "auto", "api_key": "k", "api_secret": "s"},
        )
        assert res.status_code == 200
        body = res.json()
        assert body["ok"] is True
        assert body["rangeBreakState"] == "BREAK_UP"
        assert body["regridSuggestion"] == "MIGRATE_UP"

        events = client.get("/api/v1/dashboard/miners/events", headers=headers)
        assert events.status_code == 200
        event_types = [item["eventType"] for item in events.json()["events"]]
        assert "stabilization_check" in event_types


def test_miners_regrid_preview_and_execute(monkeypatch):
    async def fake_analyze(**kwargs):
        return _analysis_payload()

    async def fake_get_live(**kwargs):
        return _analysis_payload()["liveMiner"]

    async def fake_execute(**kwargs):
        return {"result": True, "buOrderId": "BU999999", "actionId": "ACT-1", "raw": {"result": True}}

    monkeypatch.setattr(miners_service, "analyze_miner_regrid", fake_analyze)
    monkeypatch.setattr(miners_service, "get_live_miner", fake_get_live)
    monkeypatch.setattr(miners_service, "execute_regrid", fake_execute)

    with TestClient(app) as client:
        headers = {"X-API-Key": "test-key"}
        preview = client.post(
            "/api/v1/dashboard/miners/regrid-preview",
            headers=headers,
            json={"buOrderId": "BU999999", "mode": "auto", "api_key": "k", "api_secret": "s"},
        )
        assert preview.status_code == 200
        preview_body = preview.json()
        assert preview_body["confirmationRequired"] is True
        assert preview_body["confirmationToken"]

        execute = client.post(
            "/api/dashboard/workers/regrid",
            headers=headers,
            json={
                "confirmationToken": preview_body["confirmationToken"],
                "reason": "Breakout confirmed and range migrated upward",
                "api_key": "k",
                "api_secret": "s",
            },
        )
        assert execute.status_code == 200
        execute_body = execute.json()
        assert execute_body["ok"] is True
        assert execute_body["regridSuggestion"] == "MIGRATE_UP"
        assert execute_body["appliedRange"]["bottom"] == 65000.0

        events = client.get("/api/v1/dashboard/miners/events", headers=headers)
        assert events.status_code == 200
        event_types = [item["eventType"] for item in events.json()["events"]]
        assert "regrid_preview" in event_types
        assert "regrid_execute" in event_types
