from fastapi.testclient import TestClient

from app.main import app
from app.services.btc_core_service import btc_core_service


def test_btc_core_dashboard_contract(monkeypatch):
    async def fake_dashboard(**kwargs):
        return {
            "ok": True,
            "recommendationId": "btc-core-dca-2026-w22",
            "signals": {"regime": "accumulate"},
            "plan": {"monthlyBudgetUsdt": 100},
            "buyLedger": {"totalBtc": 0.01, "totalUsdt": 800},
            "source": "pionex",
        }

    monkeypatch.setattr(btc_core_service, "dashboard", fake_dashboard)

    with TestClient(app) as client:
        res = client.get("/api/v1/dashboard/btc-core", headers={"X-API-Key": "test-key"})
    assert res.status_code == 200
    assert res.json()["ok"] is True


def test_btc_core_buy_preview_contract(monkeypatch):
    async def fake_buy_preview(**kwargs):
        return {
            "ok": True,
            "canBuy": True,
            "confirmationToken": "abc",
            "expiresAt": 9999999999,
            "symbol": "BTC_USDT",
            "usdtAmount": 100.0,
            "estimatedBtc": 0.001,
            "referencePrice": 100000.0,
            "averageBuy": {"comparison": "near"},
            "requestBody": {"symbol": "BTC_USDT", "side": "BUY", "type": "MARKET", "amount": "100.00"},
            "warning": "warn",
        }

    monkeypatch.setattr(btc_core_service, "buy_preview", fake_buy_preview)

    with TestClient(app) as client:
        res = client.post("/api/v1/dashboard/btc-core/buy-preview", headers={"X-API-Key": "test-key"}, json={"usdtAmount": 100})
    assert res.status_code == 200
    assert res.json()["canBuy"] is True


def test_btc_core_buy_execute_contract(monkeypatch):
    async def fake_buy_execute(**kwargs):
        return {
            "ok": True,
            "pionex_ordered": True,
            "credentials_source": "env",
            "buy": {"buyId": "btc-core-live-buy-x"},
        }

    monkeypatch.setattr(btc_core_service, "buy_execute", fake_buy_execute)

    with TestClient(app) as client:
        res = client.post(
            "/api/v1/dashboard/btc-core/buy-execute",
            headers={"X-API-Key": "test-key"},
            json={"confirmationToken": "abc"},
        )
    assert res.status_code == 200
    assert res.json()["ok"] is True
