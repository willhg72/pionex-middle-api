from fastapi.testclient import TestClient
from fastapi import HTTPException

from app.main import app
from app.services.miners_service import miners_service


def test_miners_history_contract(monkeypatch):
    async def fake_list_miners(**kwargs):
        return [{"buOrderId": "1", "symbol": "BTCUSDT", "status": "open", "minerType": "futures_grid", "gridProfit": 1.0, "totalProfit": 1.0, "closeProfit": 1.0, "trendPnl": 0.0, "inventoryRatio": 0.02, "rangePosition": 0.5, "rangeHealth": "healthy", "quoteInvestment": 100, "leverage": 5}]

    monkeypatch.setattr(miners_service, "list_miners", fake_list_miners)

    with TestClient(app) as client:
        res = client.get("/api/v1/dashboard/miners", headers={"X-API-Key": "test-key"})
    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert body["count"] == 1


def test_miners_429_fallback_uses_cached_snapshot(monkeypatch):
    call_counter = {"n": 0}

    async def fake_list_miners(**kwargs):
        call_counter["n"] += 1
        if call_counter["n"] == 1:
            return [{"buOrderId": "1", "symbol": "BTCUSDT", "status": "open", "minerType": "futures_grid", "gridProfit": 1.0, "totalProfit": 1.0, "closeProfit": 1.0, "trendPnl": 0.0, "inventoryRatio": 0.02, "rangePosition": 0.5, "rangeHealth": "healthy", "quoteInvestment": 100, "leverage": 5}]
        raise HTTPException(status_code=502, detail="Upstream rate limit (429)")

    monkeypatch.setattr(miners_service, "list_miners", fake_list_miners)

    with TestClient(app) as client:
        headers = {"X-API-Key": "test-key"}
        first = client.get("/api/v1/dashboard/miners", headers=headers)
        assert first.status_code == 200
        second = client.get("/api/v1/dashboard/miners", headers=headers)
        assert second.status_code == 200
        body = second.json()
        assert body["ok"] is True
        assert body["count"] >= 1
        assert "cache_fallback" in body["source"]


def test_miner_close_passes_close_reason_to_exchange(monkeypatch):
    def fake_verify(token, secret):
        return {"buOrderId": "BU123456", "symbol": "BTCUSDT", "exp": 1999999999}

    observed: dict = {}

    async def fake_close_miner(**kwargs):
        observed.update(kwargs)
        return {"result": True}

    monkeypatch.setattr(miners_service, "verify_close_token", fake_verify)
    monkeypatch.setattr(miners_service, "close_miner", fake_close_miner)

    with TestClient(app) as client:
        res = client.post(
            "/api/v1/dashboard/miners/close",
            headers={"X-API-Key": "test-key"},
            json={"confirmationToken": "tok", "closeReason": "Close reason propagated to exchange"},
        )
    assert res.status_code == 200
    assert observed["close_reason"] == "Close reason propagated to exchange"
