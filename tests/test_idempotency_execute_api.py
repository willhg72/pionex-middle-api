from fastapi.testclient import TestClient

from app.main import app
from app.services.btc_core_service import btc_core_service
from app.services.btc_ladder_service import btc_ladder_service
from app.services.scalping_service import scalping_service


def test_idempotency_btc_core_buy_execute(monkeypatch):
    calls = {"n": 0}

    async def fake_buy_execute(**kwargs):
        calls["n"] += 1
        return {"ok": True, "pionex_ordered": True, "credentials_source": "env", "buy": {"buyId": "b1"}}

    monkeypatch.setattr(btc_core_service, "buy_execute", fake_buy_execute)

    with TestClient(app) as client:
        headers = {"X-API-Key": "test-key", "Idempotency-Key": "idem-btc-core-1"}
        p = {"confirmationToken": "abc"}
        r1 = client.post("/api/v1/dashboard/btc-core/buy-execute", headers=headers, json=p)
        r2 = client.post("/api/v1/dashboard/btc-core/buy-execute", headers=headers, json=p)
    assert r1.status_code == 200 and r2.status_code == 200
    assert calls["n"] == 1


def test_idempotency_btc_ladder_limit_execute(monkeypatch):
    calls = {"n": 0}

    async def fake_limit_execute(**kwargs):
        calls["n"] += 1
        return {"ok": True, "pionex_ordered": True, "credentials_source": "env", "order": {"orderId": "o1"}}

    monkeypatch.setattr(btc_ladder_service, "limit_execute", fake_limit_execute)

    with TestClient(app) as client:
        headers = {"X-API-Key": "test-key", "Idempotency-Key": "idem-btc-ladder-1"}
        p = {"confirmationToken": "abc"}
        r1 = client.post("/api/v1/dashboard/btc-ladder/limit-execute", headers=headers, json=p)
        r2 = client.post("/api/v1/dashboard/btc-ladder/limit-execute", headers=headers, json=p)
    assert r1.status_code == 200 and r2.status_code == 200
    assert calls["n"] == 1


def test_idempotency_scalping_real_execute(monkeypatch):
    calls = {"n": 0}

    async def fake_real_execute(**kwargs):
        calls["n"] += 1
        return {"ok": True, "orderId": "o1", "clientOrderId": "c1", "monitorId": "m1", "status": "monitor_started"}

    monkeypatch.setattr(scalping_service, "real_execute", fake_real_execute)

    with TestClient(app) as client:
        headers = {"X-API-Key": "test-key", "Idempotency-Key": "idem-scalp-real-1"}
        p = {"confirmationToken": "abc"}
        r1 = client.post("/api/v1/scalping/real-execute", headers=headers, json=p)
        r2 = client.post("/api/v1/scalping/real-execute", headers=headers, json=p)
    assert r1.status_code == 200 and r2.status_code == 200
    assert calls["n"] == 1
