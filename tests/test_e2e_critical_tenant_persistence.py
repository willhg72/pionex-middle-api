import asyncio

from fastapi.testclient import TestClient
from sqlalchemy import select

from app.core.security import tenant_id_from_api_key
from app.db.models.btc_core import BtcCoreBuy
from app.db.models.btc_ladder import BtcLadderOrder
from app.db.models.miners import MinerEvent, MinerSnapshot
from app.db.models.scalping import ScalpingMonitor
from app.db.session import SessionLocal
from app.integrations.pionex_client import SpotOrderResult
from app.main import app
from app.services.analyzer_service import Kline, analyzer_service
from app.services.miners_service import miners_service
from app.services.scalping_service import scalping_service


AUTH = {"X-API-Key": "test-key"}
TENANT_ID = tenant_id_from_api_key("test-key")


def _run(coro):
    return asyncio.run(coro)


async def _count_rows(model, **filters):
    async with SessionLocal() as session:
        stmt = select(model)
        for field, value in filters.items():
            stmt = stmt.where(getattr(model, field) == value)
        rows = (await session.execute(stmt)).scalars().all()
        return len(rows), rows


def test_e2e_miners_read_and_close_persists_by_tenant(monkeypatch):
    async def fake_list_miners(**kwargs):
        return [{"buOrderId": "BUE2E123", "symbol": "BTCUSDT", "status": "open", "minerType": "robust_worker", "gridProfit": 1.0}]

    async def fake_close_miner(**kwargs):
        return {"ok": True, "result": True}

    monkeypatch.setattr(miners_service, "list_miners", fake_list_miners)
    monkeypatch.setattr(miners_service, "close_miner", fake_close_miner)

    with TestClient(app) as client:
        res_miners = client.get("/api/v1/dashboard/miners", headers=AUTH)
        assert res_miners.status_code == 200
        prev = client.post("/api/v1/dashboard/miners/close-preview", headers=AUTH, json={"buOrderId": "BUE2E123", "symbol": "BTCUSDT"})
        assert prev.status_code == 200
        token = prev.json()["confirmationToken"]
        exe = client.post(
            "/api/v1/dashboard/miners/close",
            headers=AUTH,
            json={"confirmationToken": token, "closeReason": "Close e2e flow for tenant persistence check"},
        )
        assert exe.status_code == 200

    snap_count, snap_rows = _run(_count_rows(MinerSnapshot, tenant_id=TENANT_ID, bu_order_id="BUE2E123"))
    event_count, event_rows = _run(_count_rows(MinerEvent, tenant_id=TENANT_ID, bu_order_id="BUE2E123"))
    assert snap_count >= 1
    assert event_count >= 1
    assert all(row.tenant_id == TENANT_ID for row in snap_rows)
    assert all(row.tenant_id == TENANT_ID for row in event_rows)


def test_e2e_btc_core_preview_execute_persists_by_tenant(monkeypatch):
    async def fake_fetch_klines(**kwargs):
        rows = [
            Kline(
                timestamp=1,
                open=70000.0,
                high=70100.0,
                low=69900.0,
                close=70000.0,
                volume=1.0,
                quote_volume=70000.0,
                trades=1,
                taker_buy_base_volume=0.5,
                taker_buy_quote_volume=35000.0,
                closed=True,
            )
            for _ in range(10)
        ]
        return "pionex", rows

    async def fake_create_spot_order(self, body):
        return SpotOrderResult(
            success=True,
            order_id="ord-e2e-btc-core",
            client_order_id=str(body.get("clientOrderId") or "cid-e2e-btc-core"),
            raw_response={"result": True},
        )

    monkeypatch.setattr(analyzer_service, "fetch_klines", fake_fetch_klines)
    monkeypatch.setattr("app.integrations.pionex_client.PionexClient.create_spot_order", fake_create_spot_order)

    with TestClient(app) as client:
        preview = client.post("/api/v1/dashboard/btc-core/buy-preview", headers=AUTH, json={"usdtAmount": 40})
        assert preview.status_code == 200
        token = preview.json()["confirmationToken"]
        execute = client.post("/api/v1/dashboard/btc-core/buy-execute", headers=AUTH, json={"confirmationToken": token})
        assert execute.status_code == 200

    count, rows = _run(_count_rows(BtcCoreBuy, tenant_id=TENANT_ID, order_id="ord-e2e-btc-core"))
    assert count >= 1
    assert all(row.tenant_id == TENANT_ID for row in rows)


def test_e2e_btc_ladder_preview_execute_persists_by_tenant(monkeypatch):
    async def fake_create_spot_order(self, body):
        return SpotOrderResult(
            success=True,
            order_id="ord-e2e-btc-ladder",
            client_order_id=str(body.get("clientOrderId") or "cid-e2e-btc-ladder"),
            raw_response={"result": True},
        )

    monkeypatch.setattr("app.integrations.pionex_client.PionexClient.create_spot_order", fake_create_spot_order)

    with TestClient(app) as client:
        preview = client.post("/api/v1/dashboard/btc-ladder/limit-preview", headers=AUTH, json={"usdtAmount": 50, "limitPrice": 65000})
        assert preview.status_code == 200
        token = preview.json()["confirmationToken"]
        execute = client.post("/api/v1/dashboard/btc-ladder/limit-execute", headers=AUTH, json={"confirmationToken": token})
        assert execute.status_code == 200

    count, rows = _run(_count_rows(BtcLadderOrder, tenant_id=TENANT_ID, pionex_order_id="ord-e2e-btc-ladder"))
    assert count >= 1
    assert all(row.tenant_id == TENANT_ID for row in rows)


def test_e2e_scalping_spot_preview_execute_persists_monitor_by_tenant(monkeypatch):
    async def fake_fetch_klines(**kwargs):
        rows = [
            Kline(
                timestamp=1,
                open=100.0,
                high=101.0,
                low=99.0,
                close=100.0,
                volume=10.0,
                quote_volume=1000.0,
                trades=10,
                taker_buy_base_volume=5.0,
                taker_buy_quote_volume=500.0,
                closed=True,
            )
            for _ in range(140)
        ]
        return "pionex", rows

    async def fake_create_spot_order(self, body):
        return SpotOrderResult(
            success=True,
            order_id="ord-e2e-scalp-spot",
            client_order_id=str(body.get("clientOrderId") or "cid-e2e-scalp-spot"),
            raw_response={"result": True},
        )

    def fake_signal(*args, **kwargs):
        return {
            "symbol": "BTCUSDT",
            "setup": "ema_trend_pullback_abc",
            "direction": "long",
            "score": 82.0,
            "status": "paper_candidate",
            "reason": "e2e test signal",
            "entry": 100.0,
            "stopLoss": 99.5,
            "takeProfit1": 100.75,
            "riskUsdt": 2.0,
            "notional": 400.0,
            "margin": 400.0,
            "leverage": 1.0,
            "rr": 1.5,
            "market": {"volumeRatio": 1.3, "emaFilter": {"structure": "aligned"}},
        }

    monkeypatch.setattr(analyzer_service, "fetch_klines", fake_fetch_klines)
    monkeypatch.setattr("app.integrations.pionex_client.PionexClient.create_spot_order", fake_create_spot_order)
    monkeypatch.setattr(scalping_service, "_signal_from_klines", fake_signal)

    with TestClient(app) as client:
        preview = client.post("/api/v1/scalping/spot-preview", headers=AUTH, json={"symbol": "BTCUSDT", "riskUsdt": 2})
        assert preview.status_code == 200
        assert preview.json()["canExecute"] is True
        token = preview.json()["confirmationToken"]
        execute = client.post("/api/v1/scalping/spot-execute", headers=AUTH, json={"confirmationToken": token})
        assert execute.status_code == 200
        monitor_id = execute.json()["monitorId"]

    count, rows = _run(_count_rows(ScalpingMonitor, tenant_id=TENANT_ID, monitor_id=monitor_id))
    assert count == 1
    assert rows[0].tenant_id == TENANT_ID
