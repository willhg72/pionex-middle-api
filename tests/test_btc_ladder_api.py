from fastapi.testclient import TestClient

from app.main import app
from app.services.btc_ladder_service import btc_ladder_service


def test_btc_ladder_dashboard_contract(monkeypatch):
    async def fake_dashboard(**kwargs):
        return {
            "ok": True,
            "generatedAt": 1,
            "inventory": {"totalBtc": 0.1},
            "ladderOrders": [],
            "errors": [],
        }

    monkeypatch.setattr(btc_ladder_service, "dashboard", fake_dashboard)

    with TestClient(app) as client:
        res = client.get("/api/v1/dashboard/btc-ladder", headers={"X-API-Key": "test-key"})
    assert res.status_code == 200
    assert res.json()["ok"] is True


def test_btc_ladder_price_contract(monkeypatch):
    async def fake_price():
        return {"ok": True, "symbol": "BTC_USDT", "price": 100000.0, "source": "pionex_spot_tickers"}

    monkeypatch.setattr(btc_ladder_service, "price", fake_price)

    with TestClient(app) as client:
        res = client.get("/api/v1/dashboard/btc-ladder/price", headers={"X-API-Key": "test-key"})
    assert res.status_code == 200
    assert res.json()["symbol"] == "BTC_USDT"


def test_btc_ladder_limit_preview_contract(monkeypatch):
    def fake_limit_preview(**kwargs):
        return {
            "ok": True,
            "canPlace": True,
            "confirmationToken": "abc",
            "expiresAt": 999999,
            "symbol": "BTC_USDT",
            "usdtAmount": 100.0,
            "limitPrice": 90000.0,
            "btcAmount": 0.00111111,
            "requestBody": {},
            "warning": "warn",
        }

    monkeypatch.setattr(btc_ladder_service, "limit_preview", fake_limit_preview)

    with TestClient(app) as client:
        res = client.post(
            "/api/v1/dashboard/btc-ladder/limit-preview",
            headers={"X-API-Key": "test-key"},
            json={"usdtAmount": 100, "limitPrice": 90000},
        )
    assert res.status_code == 200
    assert res.json()["canPlace"] is True
