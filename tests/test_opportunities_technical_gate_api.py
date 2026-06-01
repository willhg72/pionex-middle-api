from fastapi.testclient import TestClient

from app.main import app
from app.services.opportunities_service import opportunities_service


def test_technical_gate_contract_and_alias(monkeypatch):
    async def fake_gate(**kwargs):
        return {
            "ok": True,
            "symbol": "DOGEUSDT",
            "configKey": "robust_5x",
            "workerType": "robust",
            "workerTypeLabel": "Robust 5x",
            "recommendation": "WAIT",
            "score": 68.4,
            "summary": "Setup is promising but timing/context needs confirmation.",
            "checks": [{"name": "Range residency 30d/90d", "status": "warn", "value": 0.5, "detail": "mixed"}],
            "reasons": [],
            "metrics": {"residency30d": 0.5},
            "candidateSnapshot": {"symbol": "DOGEUSDT"},
            "advisoryOnly": True,
            "generatedAt": 1717280000000,
        }

    monkeypatch.setattr(opportunities_service, "build_technical_gate", fake_gate)

    payload = {
        "symbol": "DOGEUSDT",
        "configKey": "robust_5x",
        "source": "pionex",
        "capital": 175,
        "targetDailyUsdt": 1,
    }
    with TestClient(app) as client:
        h = {"X-API-Key": "test-key"}
        r1 = client.post("/api/v1/dashboard/opportunities/technical-gate", headers=h, json=payload)
        r2 = client.post("/api/dashboard/opportunities/technical-gate", headers=h, json=payload)
    assert r1.status_code == 200
    assert r2.status_code == 200
    body = r1.json()
    assert body["recommendation"] in {"GO", "WAIT", "REJECT"}
    assert isinstance(body["score"], float)
    assert body["advisoryOnly"] is True


def test_technical_gate_logic_wait_or_reject_for_bad_snapshot(monkeypatch):
    async def fake_list_opps(**kwargs):
        return {
            "ok": True,
            "summary": {},
            "opportunities": [
                {
                    "symbol": "DOGEUSDT",
                    "configKey": "robust_5x",
                    "workerType": "robust",
                    "workerTypeLabel": "Robust 5x",
                    "metrics": {"expectedClosePnlAfter1PctAdverse": -0.5},
                }
            ],
            "errors": [],
        }

    class K:
        def __init__(self, c):
            self.close = c
            self.high = c * 1.02
            self.low = c * 0.98

    async def fake_klines(**kwargs):
        series = [K(100 + i * 0.05) for i in range(180)]
        return "pionex", series

    monkeypatch.setattr(opportunities_service, "list_opportunities", fake_list_opps)
    monkeypatch.setattr("app.services.analyzer_service.analyzer_service.fetch_klines", fake_klines)

    out = __import__("asyncio").run(
        opportunities_service.build_technical_gate(
            symbol="DOGEUSDT",
            config_key="robust_5x",
            source="pionex",
            capital=175,
            target_daily_usdt=1,
        )
    )
    assert out["ok"] is True
    assert out["recommendation"] in {"WAIT", "REJECT"}
    assert out["advisoryOnly"] is True
