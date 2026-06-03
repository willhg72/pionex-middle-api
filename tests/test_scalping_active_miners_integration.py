import asyncio

from app.services.scalping_service import scalping_service


class _Kline:
    def __init__(self, close: float, volume: float = 10.0) -> None:
        self.close = close
        self.volume = volume


def test_scalping_signals_merges_requested_symbols_with_active_miners(monkeypatch):
    observed: list[str] = []

    async def fake_fetch_klines(**kwargs):
        observed.append(kwargs["symbol"])
        rows = [_Kline(100 + i * 0.1) for i in range(140)]
        return "pionex", rows

    monkeypatch.setattr("app.services.analyzer_service.analyzer_service.fetch_klines", fake_fetch_klines)

    payload = asyncio.run(
        scalping_service.signals(
            universe="BTCUSDT",
            source="pionex",
            risk_usdt=2.0,
            leverage=5.0,
            active_miners=[{"symbol": "DOGEUSDT"}, {"symbol": "BTCUSDT"}],
        )
    )
    assert payload["ok"] is True
    assert "BTCUSDT" in observed
    assert "DOGEUSDT" in observed


def test_edge_active_miner_allows_continuation_with_reduced_risk():
    signal = {
        "symbol": "BTCUSDT",
        "setup": "ema_trend_pullback_abc",
        "direction": "long",
        "score": 80.0,
        "status": "paper_candidate",
        "reason": "trend aligned",
        "riskUsdt": 2.0,
        "notional": 400.0,
        "margin": 80.0,
    }
    miner_context = {"status": "edge", "rangeHealth": "near_high_edge"}
    out = scalping_service._apply_active_miner_context(signal, miner_context)
    assert out["activeMiner"]["status"] == "edge"
    assert out["activeMiner"]["continuationAllowed"] is True
    assert out["riskUsdt"] < signal["riskUsdt"]
    assert out["notional"] < signal["notional"]
