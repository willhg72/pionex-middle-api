from fastapi.testclient import TestClient

from app.integrations.pionex_client import BotStatusResult
from app.main import app


def test_backfill_closed_contract_canonical_and_legacy_alias(monkeypatch):
    async def fake_ids(self, *, tenant_id: str, limit: int):
        return ["BU1", "BU2"]

    async def fake_status(self, bu_order_id: str):
        if bu_order_id == "BU1":
            return BotStatusResult(success=True, status="closed", pnl=1.25, last_update="1748736000000", raw_response={"data": {}})
        return BotStatusResult(success=True, status="running", pnl=None, last_update="1746057600000", raw_response={"data": {}})

    monkeypatch.setattr("app.repositories.miner_ops_repository.MinerOpsRepository.list_distinct_bu_order_ids", fake_ids)
    monkeypatch.setattr("app.integrations.pionex_client.PionexClient.get_bot_status", fake_status)

    with TestClient(app) as client:
        h = {"X-API-Key": "test-key"}
        q = "month=2025-06&maxRecords=100&persist=false"
        r1 = client.post(f"/api/v1/dashboard/miners/backfill-closed?{q}", headers=h)
        r2 = client.post(f"/api/dashboard/miners/backfill-closed?{q}", headers=h)

    assert r1.status_code == 200
    assert r2.status_code == 200
    body = r1.json()
    assert body["ok"] is True
    assert body["month"] == "2025-06"
    assert "summary" in body and "rows" in body and "errors" in body


def test_backfill_closed_invalid_month():
    with TestClient(app) as client:
        h = {"X-API-Key": "test-key"}
        res = client.post("/api/v1/dashboard/miners/backfill-closed?month=06-2025", headers=h)
    assert res.status_code == 400
