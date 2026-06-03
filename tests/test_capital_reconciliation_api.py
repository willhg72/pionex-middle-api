from fastapi.testclient import TestClient

from app.main import app
from app.services.capital_reconciliation_service import capital_reconciliation_service
from app.services.miners_service import miners_service


def test_capital_reconciliation_detects_close_and_redeploy(monkeypatch):
    call_state = {"n": 0}

    snapshots = [
        [
            {
                "buOrderId": "BU1",
                "symbol": "DOGE_USDT_PERP",
                "quoteInvestment": 175.0,
                "closeProfit": -4.8,
                "gridProfit": 1.2,
                "trendPnl": -6.0,
                "status": "running",
            },
            {
                "buOrderId": "BU2",
                "symbol": "ETH_USDT_PERP",
                "quoteInvestment": 175.0,
                "closeProfit": 2.5,
                "gridProfit": 1.0,
                "trendPnl": 1.5,
                "status": "running",
            },
        ],
        [
            {
                "buOrderId": "BU2",
                "symbol": "ETH_USDT_PERP",
                "quoteInvestment": 175.0,
                "closeProfit": 3.0,
                "gridProfit": 1.2,
                "trendPnl": 1.8,
                "status": "running",
            },
            {
                "buOrderId": "BU3",
                "symbol": "ONDO_USDT_PERP",
                "quoteInvestment": 170.2,
                "closeProfit": 0.0,
                "gridProfit": 0.0,
                "trendPnl": 0.0,
                "status": "running",
            },
        ],
    ]
    balances = [
        {"ok": True, "usdt": {"free": 40.0, "frozen": 5.0}, "estimatedTotalUsd": 395.0},
        {"ok": True, "usdt": {"free": 35.0, "frozen": 5.0}, "estimatedTotalUsd": 385.2},
    ]

    async def fake_list_miners(**kwargs):
        idx = min(call_state["n"], 1)
        return snapshots[idx]

    async def fake_balance(**kwargs):
        idx = min(call_state["n"], 1)
        payload = balances[idx]
        call_state["n"] += 1
        return payload

    async def fake_query_status(api_key, api_secret, bu_order_id):
        if bu_order_id != "BU1":
            return {}
        return {
            "buOrderData": {
                "reasonBy": "loss_stop",
                "totalRealizedProfit": "-4.8",
            }
        }

    monkeypatch.setattr(miners_service, "list_miners", fake_list_miners)
    monkeypatch.setattr(miners_service, "get_account_balance", fake_balance)
    monkeypatch.setattr(capital_reconciliation_service, "_query_closed_status", fake_query_status)

    with TestClient(app) as client:
        headers = {"X-API-Key": "test-key"}
        first = client.post(
            "/api/v1/dashboard/capital-reconciliation",
            headers=headers,
            json={"api_key": "tenant-key", "api_secret": "tenant-secret"},
        )
        assert first.status_code == 200
        first_body = first.json()
        assert first_body["summary"]["closedMinersToday"] == 0

        second = client.post(
            "/api/dashboard/capital-reconciliation",
            headers=headers,
            json={"api_key": "tenant-key", "api_secret": "tenant-secret"},
        )
        assert second.status_code == 200
        body = second.json()
        assert body["summary"]["closedMinersToday"] == 1
        assert body["summary"]["realizedPnlToday"] == -4.8
        assert round(body["summary"]["releasedCapitalToday"], 1) == 170.2
        assert round(body["summary"]["redeployedCapitalToday"], 1) == 170.2
        assert len(body["recentCloseEvents"]) == 1
        event = body["recentCloseEvents"][0]
        assert event["buOrderId"] == "BU1"
        assert event["closeReason"] == "loss_stop"
        assert round(event["releasedUsdtEstimate"], 1) == 170.2
        assert event["redeployedWithinWindow"] is True
        assert event["replacementBuOrderId"] == "BU3"
