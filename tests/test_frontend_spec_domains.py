from fastapi.testclient import TestClient

from app.main import app
from app.services.btc_core_service import btc_core_service
from app.services.btc_ladder_service import btc_ladder_service
from app.services.discovery_service import discovery_service
from app.services.miners_service import miners_service
from app.services.opportunities_service import opportunities_service
from app.services.scalping_service import scalping_service


AUTH = {"X-API-Key": "test-key"}


def test_discovery_tab_contract_from_frontend_spec(monkeypatch):
    async def fake_discovery(**kwargs):
        return {"ok": True, "summary": {"evaluated": 20, "passed": 3}, "candidates": [{"symbol": "BTC_USDT_PERP"}], "errors": []}

    monkeypatch.setattr(discovery_service, "list_discovery", fake_discovery)

    with TestClient(app) as client:
        res = client.get("/api/dashboard/discovery?limit=30&minQuoteVolume=50000&minTrades=10000", headers=AUTH)
    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert isinstance(body["candidates"], list)


def test_opportunities_tab_preview_execute_flow_from_frontend_spec(monkeypatch):
    async def fake_list(**kwargs):
        return {
            "ok": True,
            "summary": {"source": "pionex"},
            "opportunities": [{"symbol": "BTCUSDT", "configKey": "robust_worker", "score": 0.9}],
            "errors": [],
        }

    def fake_preview(row, secret):
        return {
            "ok": True,
            "canCreate": True,
            "blockers": [],
            "confirmationToken": "opp-tok",
            "expiresAt": 1999999999,
            "fingerprint": "fp1",
            "opportunity": row,
            "requestBody": {"symbol": row["symbol"]},
        }

    async def fake_execute_create(**kwargs):
        return {"ok": True, "pionex_created": True, "bu_order_id": "BU1", "error_code": None, "error_message": None, "request_body": {"x": 1}}

    monkeypatch.setattr(opportunities_service, "list_opportunities", fake_list)
    monkeypatch.setattr(opportunities_service, "build_preview", fake_preview)
    monkeypatch.setattr(opportunities_service, "execute_create", fake_execute_create)

    with TestClient(app) as client:
        preview = client.post(
            "/api/v1/dashboard/opportunities/create-preview",
            headers=AUTH,
            json={"symbol": "BTCUSDT", "configKey": "robust_worker", "capital": 100, "targetDailyUsdt": 1},
        )
        execute = client.post(
            "/api/v1/dashboard/opportunities/create",
            headers=AUTH,
            json={"symbol": "BTCUSDT", "configKey": "robust_worker", "capital": 100, "targetDailyUsdt": 1, "confirmationToken": "opp-tok"},
        )

    assert preview.status_code == 200
    assert execute.status_code == 200
    assert execute.json()["pionex_created"] is True


def test_active_miners_tab_core_endpoints_from_frontend_spec(monkeypatch):
    async def fake_list_miners(**kwargs):
        return [{"buOrderId": "1", "symbol": "BTCUSDT", "status": "open", "minerType": "robust", "gridProfit": 1.0}]

    async def fake_balance(**kwargs):
        return {"ok": True, "timestamp": 1, "usdt": {"free": 100}, "assets": [], "nonUsdtAssets": [], "assetsCount": 0, "estimatedTotalUsd": 100}

    def fake_sign(payload, secret, ttl_seconds=300):
        return "close-tok"

    def fake_verify(token, secret):
        return {"buOrderId": "1", "symbol": "BTCUSDT", "exp": 1999999999}

    async def fake_close(**kwargs):
        return {"result": True}

    monkeypatch.setattr(miners_service, "list_miners", fake_list_miners)
    monkeypatch.setattr(miners_service, "get_account_balance", fake_balance)
    monkeypatch.setattr(miners_service, "sign_close_token", fake_sign)
    monkeypatch.setattr(miners_service, "verify_close_token", fake_verify)
    monkeypatch.setattr(miners_service, "close_miner", fake_close)

    with TestClient(app) as client:
            get_workers = client.get("/api/v1/dashboard/miners", headers=AUTH)
            post_workers = client.post("/api/v1/dashboard/miners", headers=AUTH, json={"api_key": "k123456", "api_secret": "s123456"})
            get_bal = client.get("/api/v1/dashboard/miners/account-balance", headers=AUTH)
            prev_close = client.post("/api/v1/dashboard/miners/close-preview", headers=AUTH, json={"buOrderId": "BU123456", "symbol": "BTCUSDT"})
            exe_close = client.post("/api/v1/dashboard/miners/close", headers=AUTH, json={"confirmationToken": "close-tok", "closeReason": "Close requested for risk control"})

    assert get_workers.status_code == 200
    assert post_workers.status_code == 200
    assert get_bal.status_code == 200
    assert prev_close.status_code == 200
    assert exe_close.status_code == 200


def test_btc_core_tab_flows_from_frontend_spec(monkeypatch):
    async def fake_dashboard(**kwargs):
        return {"ok": True, "recommendationId": "r1", "signals": {}, "plan": {}, "buyLedger": {}, "source": "pionex"}

    async def fake_manual(**kwargs):
        return {"ok": True, "buy": {"buyId": "b1"}}

    async def fake_preview(**kwargs):
        return {
            "ok": True,
            "canBuy": True,
            "confirmationToken": "btc-tok",
            "expiresAt": 1999999999,
            "symbol": "BTC_USDT",
            "usdtAmount": 30,
            "estimatedBtc": 0.0004,
            "referencePrice": 70000,
            "averageBuy": {},
            "requestBody": {},
            "warning": "",
        }

    async def fake_execute(**kwargs):
        return {"ok": True, "pionex_ordered": True, "credentials_source": "owner_env_fallback", "buy": {"buyId": "b2"}}

    monkeypatch.setattr(btc_core_service, "dashboard", fake_dashboard)
    monkeypatch.setattr(btc_core_service, "register_manual_buy", fake_manual)
    monkeypatch.setattr(btc_core_service, "buy_preview", fake_preview)
    monkeypatch.setattr(btc_core_service, "buy_execute", fake_execute)

    with TestClient(app) as client:
        a = client.get("/api/dashboard/btc-core?monthlyBudgetUsdt=100&currentBtc=0&targetBtc=0.1", headers=AUTH)
        b = client.post("/api/dashboard/btc-core/buy", headers=AUTH, json={"usdtAmount": 10, "btcAmount": 0.0001})
        c = client.post("/api/dashboard/btc-core/buy-preview", headers=AUTH, json={"usdtAmount": 30})
        d = client.post("/api/dashboard/btc-core/buy-execute", headers=AUTH, json={"confirmationToken": "btc-tok"})

    assert all(x.status_code == 200 for x in [a, b, c, d])


def test_btc_ladder_tab_flows_from_frontend_spec(monkeypatch):
    async def fake_dashboard(**kwargs):
        return {"ok": True, "generatedAt": 1, "inventory": {}, "ladderOrders": [], "errors": []}

    async def fake_price():
        return {"ok": True, "symbol": "BTC_USDT", "price": 70000, "source": "pionex"}

    async def fake_place_all(**kwargs):
        return {"ok": True, "credentialsSource": "owner_env_fallback", "priceNow": 70000, "levelsRequested": 5, "placedCount": 1, "failedCount": 0, "placed": [], "failed": []}

    async def fake_cancel_all(**kwargs):
        return {"ok": True, "credentialsSource": "owner_env_fallback", "cancelledCount": 1, "failedCount": 0, "cancelled": ["1"], "failed": []}

    def fake_limit_preview(**kwargs):
        return {"ok": True, "canPlace": True, "confirmationToken": "lad-tok", "expiresAt": 1, "symbol": "BTC_USDT", "usdtAmount": 20, "limitPrice": 65000, "btcAmount": 0.0003, "requestBody": {}, "warning": ""}

    async def fake_limit_execute(**kwargs):
        return {"ok": True, "pionex_ordered": True, "credentials_source": "owner_env_fallback", "order": {"orderId": "1"}}

    async def fake_fill_confirm(**kwargs):
        return {"ok": True, "fill": {"id": "f1"}}

    monkeypatch.setattr(btc_ladder_service, "dashboard", fake_dashboard)
    monkeypatch.setattr(btc_ladder_service, "price", fake_price)
    monkeypatch.setattr(btc_ladder_service, "place_all", fake_place_all)
    monkeypatch.setattr(btc_ladder_service, "cancel_all", fake_cancel_all)
    monkeypatch.setattr(btc_ladder_service, "limit_preview", fake_limit_preview)
    monkeypatch.setattr(btc_ladder_service, "limit_execute", fake_limit_execute)
    monkeypatch.setattr(btc_ladder_service, "fill_confirm", fake_fill_confirm)

    with TestClient(app) as client:
        calls = [
            client.get("/api/dashboard/btc-ladder", headers=AUTH),
            client.get("/api/dashboard/btc-ladder/price", headers=AUTH),
            client.post("/api/dashboard/btc-ladder/place-all", headers=AUTH, json={"capitalUsdt": 100, "levels": 5, "maxDipPct": 20}),
            client.post("/api/dashboard/btc-ladder/cancel-all", headers=AUTH, json={}),
            client.post("/api/dashboard/btc-ladder/limit-preview", headers=AUTH, json={"usdtAmount": 20, "limitPrice": 65000}),
            client.post("/api/dashboard/btc-ladder/limit-execute", headers=AUTH, json={"confirmationToken": "lad-tok"}),
            client.post("/api/dashboard/btc-ladder/fill-confirm", headers=AUTH, json={"usdtAmount": 20, "btcAmount": 0.0003, "price": 65000}),
        ]
    assert all(x.status_code == 200 for x in calls)


def test_scalping_tab_flows_from_frontend_spec(monkeypatch):
    async def fake_signals(**kwargs):
        return {"ok": True, "summary": {"evaluated": 5}, "signals": [{"symbol": "BTCUSDT"}], "errors": []}

    async def fake_real_preview(**kwargs):
        return {
            "ok": True,
            "canExecute": True,
            "blockers": [],
            "confirmationToken": "s-real",
            "expiresAt": 1,
            "signal": {},
            "order": {},
            "volumeGate": {},
            "capabilities": {},
        }

    async def fake_real_execute(**kwargs):
        return {"ok": True, "orderId": "o1", "clientOrderId": "c1", "monitorId": "m1", "status": "monitor_started"}

    async def fake_spot_preview(**kwargs):
        return {
            "ok": True,
            "mode": "spot_long_only",
            "canExecute": True,
            "blockers": [],
            "confirmationToken": "s-spot",
            "expiresAt": 1,
            "signal": {},
            "order": {},
            "credentialsSource": "owner_env_fallback",
            "apiKeyFingerprint": "tes***key",
        }

    async def fake_spot_execute(**kwargs):
        return {"ok": True, "mode": "spot_long_only", "orderId": "o2", "clientOrderId": "c2", "monitorId": "m2", "status": "monitor_started"}

    async def fake_monitors(limit, tenant_id):
        return {"ok": True, "count": 1, "monitors": [{"monitorId": "m1"}]}

    monkeypatch.setattr(scalping_service, "signals", fake_signals)
    monkeypatch.setattr(scalping_service, "real_preview", fake_real_preview)
    monkeypatch.setattr(scalping_service, "real_execute", fake_real_execute)
    monkeypatch.setattr(scalping_service, "spot_preview", fake_spot_preview)
    monkeypatch.setattr(scalping_service, "spot_execute", fake_spot_execute)
    monkeypatch.setattr(scalping_service, "monitors", fake_monitors)

    with TestClient(app) as client:
        calls = [
            client.get("/api/scalping/signals?universe=BTCUSDT,ETHUSDT&riskUsdt=2&leverage=5", headers=AUTH),
            client.post("/api/scalping/real-preview", headers=AUTH, json={"symbol": "BTCUSDT", "riskUsdt": 2, "leverage": 5}),
            client.post("/api/scalping/real-execute", headers=AUTH, json={"confirmationToken": "s-real"}),
            client.get("/api/scalping/real-monitors", headers=AUTH),
            client.post("/api/scalping/spot-preview", headers=AUTH, json={"symbol": "BTCUSDT", "riskUsdt": 2}),
            client.post("/api/scalping/spot-execute", headers=AUTH, json={"confirmationToken": "s-spot"}),
        ]
    assert all(x.status_code == 200 for x in calls)
