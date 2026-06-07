from fastapi.testclient import TestClient

from app.main import app
from app.services.analyzer_service import analyzer_service
from app.services.market_data_service import market_data_service
from app.services.miners_service import miners_service


def test_capital_dashboard_live_snapshot(monkeypatch):
    miners = [
        {
            "buOrderId": "BU1",
            "symbol": "ETH_USDT_PERP",
            "quoteInvestment": 300.0,
            "closeProfit": 12.0,
            "gridProfit": 4.0,
            "trendPnl": 8.0,
            "currentPrice": 2500.0,
            "bottom": 2200.0,
            "top": 2800.0,
            "position": 0.02,
            "leverage": 3,
            "status": "running",
        },
        {
            "buOrderId": "BU2",
            "symbol": "SOL_USDT_PERP",
            "quoteInvestment": 200.0,
            "closeProfit": -5.0,
            "gridProfit": 2.0,
            "trendPnl": -7.0,
            "currentPrice": 160.0,
            "bottom": 130.0,
            "top": 180.0,
            "position": 0.5,
            "leverage": 2,
            "status": "running",
        },
    ]
    balance = {
        "ok": True,
        "timestamp": 1,
        "usdt": {"free": 150.0, "frozen": 10.0, "total": 160.0},
        "assets": [
            {"coin": "USDT", "free": 150.0, "frozen": 10.0, "total": 160.0, "usdValue": 160.0},
            {"coin": "BTC", "free": 0.01, "frozen": 0.0, "total": 0.01, "usdValue": 700.0},
            {"coin": "ZEC", "free": 0.05733, "frozen": 0.0, "total": 0.05733, "usdValue": 0.0},
        ],
        "nonUsdtAssets": [
            {"coin": "BTC", "free": 0.01, "frozen": 0.0, "total": 0.01, "usdValue": 700.0},
            {"coin": "ZEC", "free": 0.05733, "frozen": 0.0, "total": 0.05733, "usdValue": 0.0},
        ],
        "assetsCount": 2,
        "estimatedTotalUsd": 1360.0,
    }

    async def fake_list_miners(**kwargs):
        return miners

    async def fake_balance(**kwargs):
        return balance

    async def fake_klines(**kwargs):
        candle = type("Candle", (), {"close": 70000.0})
        return ("pionex", [candle, candle])

    async def fake_spot_prices(symbols):
        assert "ZEC" in symbols
        return {"ZEC": 355.5}

    monkeypatch.setattr(miners_service, "list_miners", fake_list_miners)
    monkeypatch.setattr(miners_service, "get_account_balance", fake_balance)
    monkeypatch.setattr(analyzer_service, "fetch_klines", fake_klines)
    monkeypatch.setattr(market_data_service, "get_spot_prices_usd", fake_spot_prices)

    async def fake_credentials_async(**kwargs):
        return ("tenant-key", "tenant-secret", "tenant_settings")

    monkeypatch.setattr("app.api.v1.endpoints.capital.resolve_exchange_credentials", fake_credentials_async)

    with TestClient(app) as client:
        res = client.get("/api/v1/dashboard/capital", headers={"X-API-Key": "test-key"})

    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert round(body["summary"]["capitalMining"], 1) == 500.0
    assert round(body["summary"]["freeUsdt"], 1) == 150.0
    assert round(body["summary"]["walletUsdtTotal"], 1) == 160.0
    assert round(body["summary"]["totalCapitalVisible"], 2) == 1380.38
    assert round(body["summary"]["btcCoreValue"], 1) == 700.0
    assert "accountBreakdown" in body
    assert "monthlyHistory" in body
    assert "btcDca" in body
    assert len(body["portfolioAssets"]) >= 2
    zec = next(item for item in body["portfolioAssets"] if item["coin"] == "ZEC")
    assert zec["usdValue"] > 0
    assert any(item["ticker"] == "BTC" for item in body["byTicker"])
    assert len(body["history"]) >= 1
