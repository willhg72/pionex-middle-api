from fastapi.testclient import TestClient

from app.main import app
from app.services.btc_ladder_service import btc_ladder_service


def test_btc_ladder_reconcile_contract(monkeypatch):
    async def fake_reconcile_orders(**kwargs):
        return {
            "ok": True,
            "credentialsSource": "owner_env_fallback",
            "checkedCount": 2,
            "updatedCount": 1,
            "ledgerUpdates": 0,
            "statusCounts": {"open": 1, "partial_filled": 0, "filled": 0, "closed_unknown": 1, "cancelled": 0, "placed": 0},
            "orders": [
                {"orderId": "ord-1", "status": "open", "btcAmount": 0.001, "filledBtcAmount": 0.0},
                {"orderId": "ord-2", "status": "closed_unknown", "btcAmount": 0.0015, "filledBtcAmount": 0.0},
            ],
        }

    monkeypatch.setattr(btc_ladder_service, "reconcile_orders", fake_reconcile_orders)

    with TestClient(app) as client:
        res = client.post("/api/v1/dashboard/btc-ladder/reconcile", headers={"X-API-Key": "test-key"}, json={"autoLedger": False})

    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert body["checkedCount"] == 2
    assert body["statusCounts"]["closed_unknown"] == 1
