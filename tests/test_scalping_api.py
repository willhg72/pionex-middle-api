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
