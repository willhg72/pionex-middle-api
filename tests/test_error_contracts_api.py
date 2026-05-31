from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.main import app
from app.services.opportunities_service import opportunities_service
from app.services.scalping_service import scalping_service


def test_unauthorized_error_shape():
    client = TestClient(app)
    res = client.get("/api/v1/scalping/signals")
    assert res.status_code == 401
    body = res.json()
    assert body["ok"] is False
    assert body["errorCode"] == "HTTP_401"
    assert "requestId" in body
    assert res.headers.get("X-Request-ID")


def test_not_found_error_shape():
    client = TestClient(app)
    res = client.get("/api/v1/scalping/real-monitor/not-found", headers={"X-API-Key": "test-key"})
    assert res.status_code == 404
    body = res.json()
    assert body["ok"] is False
    assert body["errorCode"] == "HTTP_404"
    assert "requestId" in body


def test_upstream_http_error_shape(monkeypatch):
    async def fake_list_opportunities(**kwargs):
        raise HTTPException(status_code=502, detail="Upstream exchange error")

    monkeypatch.setattr(opportunities_service, "list_opportunities", fake_list_opportunities)

    client = TestClient(app)
    res = client.get("/api/v1/dashboard/opportunities", headers={"X-API-Key": "test-key"})
    assert res.status_code == 502
    body = res.json()
    assert body["ok"] is False
    assert body["errorCode"] == "HTTP_502"
    assert body["detail"] == "Upstream exchange error"
    assert "requestId" in body


def test_internal_error_shape(monkeypatch):
    async def fake_signals(**kwargs):
        raise RuntimeError("boom")

    monkeypatch.setattr(scalping_service, "signals", fake_signals)

    client = TestClient(app, raise_server_exceptions=False)
    res = client.get("/api/v1/scalping/signals", headers={"X-API-Key": "test-key"})
    assert res.status_code == 500
    body = res.json()
    assert body["ok"] is False
    assert body["errorCode"] == "INTERNAL_ERROR"
    assert body["detail"] == "boom"
    assert "requestId" in body
