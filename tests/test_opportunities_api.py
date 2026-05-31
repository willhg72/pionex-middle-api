from fastapi.testclient import TestClient

from app.main import app
from app.services.opportunities_service import opportunities_service


def test_opportunities_list_contract(monkeypatch):
    async def fake_list_opportunities(**kwargs):
        return {
            "ok": True,
            "summary": {"bestSymbol": "BTCUSDT"},
            "opportunities": [{"symbol": "BTCUSDT", "configKey": "robust_5x", "status": "Candidate"}],
            "errors": [],
        }

    monkeypatch.setattr(opportunities_service, "list_opportunities", fake_list_opportunities)

    client = TestClient(app)
    res = client.get("/api/v1/dashboard/opportunities", headers={"X-API-Key": "test-key"})
    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert isinstance(body["opportunities"], list)
