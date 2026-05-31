from fastapi.testclient import TestClient

from app.integrations.pionex_client import SpotOrderResult
from app.main import app
from app.services.analyzer_service import Kline, analyzer_service


def test_e2e_btc_core_preview_execute_with_exchange_mock(monkeypatch):
    async def fake_fetch_klines(**kwargs):
        rows = [
            Kline(
                timestamp=1,
                open=100000.0,
                high=101000.0,
                low=99000.0,
                close=100000.0,
                volume=1.0,
                quote_volume=100000.0,
                trades=1,
                taker_buy_base_volume=0.5,
                taker_buy_quote_volume=50000.0,
                closed=True,
            )
            for _ in range(10)
        ]
        return "pionex", rows

    async def fake_create_spot_order(self, body):
        return SpotOrderResult(
            success=True,
            order_id="ord-btc-core-1",
            client_order_id=str(body.get("clientOrderId") or "cid-btc-core-1"),
            raw_response={"result": True, "data": {"orderId": "ord-btc-core-1", "clientOrderId": body.get("clientOrderId"), "filledSize": "0.001", "filledAmount": "100.0", "avgPrice": "100000.0"}},
        )

    monkeypatch.setattr(analyzer_service, "fetch_klines", fake_fetch_klines)
    monkeypatch.setattr("app.integrations.pionex_client.PionexClient.create_spot_order", fake_create_spot_order)

    with TestClient(app) as client:
        headers = {"X-API-Key": "test-key"}
        preview = client.post("/api/v1/dashboard/btc-core/buy-preview", headers=headers, json={"usdtAmount": 100})
        assert preview.status_code == 200
        token = preview.json()["confirmationToken"]
        execute = client.post("/api/v1/dashboard/btc-core/buy-execute", headers=headers, json={"confirmationToken": token})
        assert execute.status_code == 200
        body = execute.json()
        assert body["ok"] is True
        assert body["pionex_ordered"] is True
        assert body["buy"]["orderId"] == "ord-btc-core-1"


def test_e2e_btc_ladder_preview_execute_with_exchange_mock(monkeypatch):
    async def fake_create_spot_order(self, body):
        return SpotOrderResult(
            success=True,
            order_id="ord-btc-ladder-1",
            client_order_id=str(body.get("clientOrderId") or "cid-btc-ladder-1"),
            raw_response={"result": True, "data": {"orderId": "ord-btc-ladder-1", "clientOrderId": body.get("clientOrderId")}},
        )

    monkeypatch.setattr("app.integrations.pionex_client.PionexClient.create_spot_order", fake_create_spot_order)

    with TestClient(app) as client:
        headers = {"X-API-Key": "test-key"}
        preview = client.post(
            "/api/v1/dashboard/btc-ladder/limit-preview",
            headers=headers,
            json={"usdtAmount": 100, "limitPrice": 90000},
        )
        assert preview.status_code == 200
        token = preview.json()["confirmationToken"]
        execute = client.post("/api/v1/dashboard/btc-ladder/limit-execute", headers=headers, json={"confirmationToken": token})
        assert execute.status_code == 200
        body = execute.json()
        assert body["ok"] is True
        assert body["pionex_ordered"] is True
        assert body["order"]["pionexOrderId"] == "ord-btc-ladder-1"
