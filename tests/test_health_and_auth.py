from fastapi.testclient import TestClient

from app.main import app


def test_health_endpoint():
    client = TestClient(app)
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert "service" in body


def test_protected_endpoint_without_api_key():
    client = TestClient(app)
    res = client.get("/api/v1/dashboard/miners")
    assert res.status_code in (401, 503)
