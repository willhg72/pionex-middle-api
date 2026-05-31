from fastapi.testclient import TestClient

from app.main import app
from app.services.discovery_service import discovery_service


def test_discovery_contract(monkeypatch):
    async def fake_list_discovery(**kwargs):
        return {
            "ok": True,
            "summary": {"bestSymbol": "BTCUSDT", "promoteCount": 1},
            "candidates": [{"symbol": "BTCUSDT", "discoveryStatus": "Promote", "discoveryScore": 81.2}],
            "errors": [],
        }

    monkeypatch.setattr(discovery_service, "list_discovery", fake_list_discovery)

    client = TestClient(app)
    res = client.get("/api/v1/dashboard/discovery", headers={"X-API-Key": "test-key"})
    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert isinstance(body["candidates"], list)
