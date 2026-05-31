from fastapi.testclient import TestClient

from app.main import app
from app.services.scalping_service import scalping_service


def test_scalping_signals_contract(monkeypatch):
    async def fake_signals(**kwargs):
        return {
            "ok": True,
            "summary": {"candidateCount": 1, "noTradeCount": 0, "source": "pionex", "universeCount": 1},
            "signals": [{"symbol": "BTCUSDT", "status": "paper_candidate", "score": 80, "direction": "long", "setup": "ema_trend_pullback_abc", "reason": "ok"}],
            "errors": [],
        }

    monkeypatch.setattr(scalping_service, "signals", fake_signals)

    client = TestClient(app)
    res = client.get("/api/v1/scalping/signals", headers={"X-API-Key": "test-key"})
    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert len(body["signals"]) == 1


def test_scalping_monitor_not_found():
    client = TestClient(app)
    res = client.get("/api/v1/scalping/real-monitor/does-not-exist", headers={"X-API-Key": "test-key"})
    assert res.status_code == 404


def test_scalping_spot_preview_contract(monkeypatch):
    async def fake_spot_preview(**kwargs):
        return {
            "ok": True,
            "mode": "spot_long_only",
            "canExecute": True,
            "blockers": [],
            "confirmationToken": "abc",
            "expiresAt": 9999999999,
            "signal": {"symbol": "BTCUSDT"},
            "order": {"symbol": "BTCUSDT", "type": "MARKET"},
            "credentialsSource": "env",
            "apiKeyFingerprint": "tes***key",
            "volumeGate": {"requiredRatio": 1.0, "currentRatio": 1.2},
            "warning": "ok",
        }

    monkeypatch.setattr(scalping_service, "spot_preview", fake_spot_preview)

    client = TestClient(app)
    res = client.post("/api/v1/scalping/spot-preview", headers={"X-API-Key": "test-key"}, json={"symbol": "BTCUSDT", "riskUsdt": 2.0})
    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert body["mode"] == "spot_long_only"


def test_scalping_spot_execute_contract(monkeypatch):
    async def fake_spot_execute(**kwargs):
        return {
            "ok": True,
            "mode": "spot_long_only",
            "orderId": "123",
            "clientOrderId": "cid-1",
            "monitorId": "m-1",
            "status": "monitor_started",
        }

    monkeypatch.setattr(scalping_service, "spot_execute", fake_spot_execute)

    client = TestClient(app)
    res = client.post("/api/v1/scalping/spot-execute", headers={"X-API-Key": "test-key"}, json={"confirmationToken": "abc"})
    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert body["monitorId"] == "m-1"
