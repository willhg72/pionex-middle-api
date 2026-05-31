import asyncio
import base64
import hashlib
import hmac
import json
import time
from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException

from app.integrations.pionex_client import PionexClient
from app.services.analyzer_service import analyzer_service
from app.services.miners_utils import validate_api_keys

DEFAULT_SCALPING_UNIVERSE = ["BTCUSDT", "ETHUSDT", "DOGEUSDT", "LINKUSDT", "SOLUSDT"]
_SCALPING_MONITORS: dict[str, dict[str, Any]] = {}


class ScalpingService:
    @staticmethod
    def normalize_symbol(symbol: str) -> str:
        text = str(symbol or "").upper()
        for token in ("/", "_", "-", ".PERP", "PERP"):
            text = text.replace(token, "")
        return text if text.endswith("USDT") else f"{text}USDT"

    @staticmethod
    def _ema(values: list[float], period: int) -> float | None:
        if len(values) < period:
            return None
        alpha = 2 / (period + 1)
        cur = sum(values[:period]) / period
        for value in values[period:]:
            cur = value * alpha + cur * (1 - alpha)
        return cur

    @staticmethod
    def _ema_series(values: list[float], period: int) -> list[float | None]:
        if len(values) < period:
            return [None for _ in values]
        alpha = 2 / (period + 1)
        series: list[float | None] = [None for _ in values]
        cur = sum(values[:period]) / period
        series[period - 1] = cur
        for i in range(period, len(values)):
            cur = values[i] * alpha + cur * (1 - alpha)
            series[i] = cur
        return series

    def _ema_structure_context(self, closes: list[float]) -> dict[str, Any]:
        e20 = self._ema_series(closes, 20)
        e50 = self._ema_series(closes, 50)
        e100 = self._ema_series(closes, 100)
        ema20 = e20[-1] if e20 else None
        ema50 = e50[-1] if e50 else None
        ema100 = e100[-1] if e100 else None
        current = closes[-1] if closes else 0.0

        if ema20 is None or ema50 is None or ema100 is None or current <= 0:
            return {"structure": "insufficient_data", "trendDirection": "unknown", "crossCount": 0, "compressionPct": None}

        if ema20 > ema50 > ema100 and current > ema20:
            trend = "long"
        elif ema20 < ema50 < ema100 and current < ema20:
            trend = "short"
        else:
            trend = "range"

        order_history: list[str] = []
        for a, b, c in zip(e20[-36:], e50[-36:], e100[-36:]):
            if a is None or b is None or c is None:
                continue
            if a > b > c:
                order_history.append("long")
            elif a < b < c:
                order_history.append("short")
            else:
                order_history.append("mixed")
        cross_count = sum(1 for p, n in zip(order_history, order_history[1:]) if p != n)
        compression = abs(ema20 - ema100) / current if current > 0 else None
        structure = "aligned" if trend in {"long", "short"} else "mixed"
        if compression is not None and compression < 0.0015:
            structure = "compressed"
        if cross_count >= 2:
            structure = "whipsaw"
        return {"structure": structure, "trendDirection": trend, "crossCount": cross_count, "compressionPct": compression}

    def _signal_from_klines(self, symbol: str, k5: list[Any], k15: list[Any], risk_usdt: float, leverage: float) -> dict[str, Any]:
        closes_5 = [k.close for k in k5]
        closes_15 = [k.close for k in k15]
        vols_5 = [k.volume for k in k5]
        current = closes_5[-1]

        ema9 = self._ema(closes_5, 9)
        ema21 = self._ema(closes_5, 21)
        ema50 = self._ema(closes_5, 50)
        ema15_21 = self._ema(closes_15, 21)
        ema_filter = self._ema_structure_context(closes_5)

        direction = "none"
        score = 45.0
        setup = "no_trade"
        reason = "No clean tactical setup"

        if ema9 and ema21 and ema50 and ema15_21:
            if ema9 > ema21 > ema50 and current > ema15_21:
                direction, setup, score, reason = "long", "ema_trend_pullback_abc", 78.0, "5m/15m trend aligned up"
            elif ema9 < ema21 < ema50 and current < ema15_21:
                direction, setup, score, reason = "short", "ema_trend_pullback_abc", 78.0, "5m/15m trend aligned down"

        if ema_filter["structure"] == "aligned":
            score += 8
        elif ema_filter["structure"] in {"compressed", "whipsaw"}:
            score -= 15
            reason = f"{reason}. EMA structure {ema_filter['structure']}"

        avg_vol = sum(vols_5[-30:]) / max(1, min(30, len(vols_5)))
        volume_ratio = (vols_5[-1] / avg_vol) if avg_vol > 0 else None
        if volume_ratio is not None and volume_ratio >= 1.10:
            score += 5

        stop_dist = max(current * 0.0025, 0.0000001)
        if direction == "long":
            stop_loss = current - stop_dist
            tp1 = current + stop_dist * 1.5
        elif direction == "short":
            stop_loss = current + stop_dist
            tp1 = current - stop_dist * 1.5
        else:
            stop_loss = current
            tp1 = current

        risk_per_unit = abs(current - stop_loss)
        qty = (risk_usdt / risk_per_unit) if risk_per_unit > 0 else 0.0
        notional = qty * current
        margin = notional / leverage if leverage > 0 else notional
        rr = abs((tp1 - current) / (current - stop_loss)) if current != stop_loss else 0.0

        status = "paper_candidate" if direction in {"long", "short"} and score >= 70 else "no_trade"
        return {
            "symbol": symbol,
            "setup": setup,
            "direction": direction,
            "score": round(max(0.0, min(100.0, score)), 1),
            "status": status,
            "reason": reason,
            "entry": current,
            "stopLoss": stop_loss,
            "takeProfit1": tp1,
            "riskUsdt": risk_usdt,
            "notional": notional,
            "margin": margin,
            "leverage": leverage,
            "rr": rr,
            "market": {"volumeRatio": volume_ratio, "emaFilter": ema_filter},
        }

    def _adaptive_volume_threshold(self, signal: dict[str, Any]) -> dict[str, Any]:
        setup = str(signal.get("setup") or "")
        market = signal.get("market") if isinstance(signal.get("market"), dict) else {}
        structure = str((market.get("emaFilter") or {}).get("structure") or "")
        threshold = 1.05 if setup == "breakout_retest" else 0.85
        reasons = [f"base {threshold:.2f}x ({setup or 'generic'})"]
        if structure in {"compressed", "whipsaw"}:
            threshold += 0.12
            reasons.append("+0.12 compressed/whipsaw")
        elif structure == "aligned":
            threshold -= 0.03
            reasons.append("-0.03 aligned")

        rows = [r for r in _SCALPING_MONITORS.values() if str(r.get("status") or "") == "closed" and str((r.get("entrySignalSnapshot") or {}).get("setup") or "") == setup]
        rows = rows[-30:]
        if len(rows) >= 5:
            wins = sum(1 for r in rows if str(r.get("triggeredBy") or "") == "take_profit")
            win_rate = wins / max(1, len(rows))
            if win_rate < 0.45:
                threshold += 0.12
                reasons.append(f"+0.12 low win rate {win_rate:.2f}")
            elif win_rate > 0.62:
                threshold -= 0.05
                reasons.append(f"-0.05 strong win rate {win_rate:.2f}")

        threshold = max(0.80, min(1.40, threshold))
        return {"requiredRatio": threshold, "currentRatio": market.get("volumeRatio"), "reasons": reasons, "samples": len(rows)}

    def _volume_quality_blocker(self, signal: dict[str, Any]) -> tuple[str | None, dict[str, Any]]:
        gate = self._adaptive_volume_threshold(signal)
        vr = gate.get("currentRatio")
        if vr is None:
            return "Volume quality gate: missing volume ratio", gate
        if float(vr) < float(gate["requiredRatio"]):
            return f"Volume quality gate failed: {vr:.2f}x < {gate['requiredRatio']:.2f}x", gate
        return None, gate

    @staticmethod
    def _mask_api_key_fingerprint(api_key: str) -> str:
        text = str(api_key or "").strip()
        if not text:
            return ""
        return f"{text[:3]}***{text[-3:]}"

    async def futures_capabilities(self, *, symbol: str, api_key: str, api_secret: str, credentials_source: str) -> dict[str, Any]:
        normalized = self.normalize_symbol(symbol)
        pionex_symbol = f"{normalized.removesuffix('USDT')}_USDT_PERP"
        checks: dict[str, Any] = {
            "symbol": pionex_symbol,
            "credentialsSource": credentials_source,
            "credentialsValidFormat": True,
            "api": {},
            "docs": {
                "entryOrderEndpoint": "POST /uapi/v1/trade/order",
                "entryOrderType": "MARKET_QTY",
                "reduceOnly": True,
                "nativeApiTpSlConfirmed": False,
            },
        }

        client = PionexClient(api_key, api_secret)
        try:
            mode = await client.get_futures_position_mode()
            open_orders = await client.get_futures_open_orders(pionex_symbol)
            positions = await client.get_futures_positions(pionex_symbol)
        finally:
            await client.close()

        mode_payload = mode.get("data") if isinstance(mode.get("data"), dict) else {}
        position_mode = mode_payload.get("positionMode")
        checks["api"] = {
            "positionMode": position_mode,
            "oneWayReduceOnlyUsable": position_mode == "BUYSELL",
            "readEndpointsOk": bool(mode.get("result")) and bool(open_orders.get("result")) and bool(positions.get("result")),
            "positionModeResponse": mode,
            "openOrdersResponse": open_orders,
            "positionsResponse": positions,
        }
        return checks

    async def signals(self, *, universe: str | None, source: str, risk_usdt: float, leverage: float) -> dict[str, Any]:
        symbols = [self.normalize_symbol(x.strip()) for x in (universe or ",".join(DEFAULT_SCALPING_UNIVERSE)).split(",") if x.strip()]
        if not symbols:
            symbols = list(DEFAULT_SCALPING_UNIVERSE)
        symbols = symbols[:12]

        rows: list[dict[str, Any]] = []
        errors: list[dict[str, str]] = []
        for symbol in symbols:
            try:
                _, k5 = await analyzer_service.fetch_klines(symbol=symbol, interval="5m", limit=140, source=source, start_time=None, end_time=None)
                _, k15 = await analyzer_service.fetch_klines(symbol=symbol, interval="15m", limit=140, source=source, start_time=None, end_time=None)
                rows.append(self._signal_from_klines(symbol, k5, k15, risk_usdt, leverage))
            except Exception as exc:  # noqa: BLE001
                errors.append({"symbol": symbol, "message": str(exc)})
                rows.append({"symbol": symbol, "setup": "no_data", "direction": "none", "score": 0, "status": "no_data", "reason": str(exc)})

        rows.sort(key=lambda r: float(r.get("score") or 0), reverse=True)
        return {
            "ok": True,
            "summary": {
                "candidateCount": sum(1 for r in rows if r.get("status") == "paper_candidate"),
                "noTradeCount": sum(1 for r in rows if r.get("status") != "paper_candidate"),
                "source": source,
                "universeCount": len(symbols),
            },
            "signals": rows,
            "errors": errors,
        }

    @staticmethod
    def _sign(payload: dict[str, Any], secret: str) -> str:
        body = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
        b64 = base64.urlsafe_b64encode(body).decode("ascii").rstrip("=")
        sig = hmac.new(secret.encode("utf-8"), b64.encode("ascii"), hashlib.sha256).hexdigest()
        return f"{b64}.{sig}"

    @staticmethod
    def _verify(token: str, secret: str) -> dict[str, Any]:
        try:
            payload_b64, signature = token.split(".", 1)
            expected = hmac.new(secret.encode("utf-8"), payload_b64.encode("ascii"), hashlib.sha256).hexdigest()
            if not hmac.compare_digest(signature, expected):
                raise ValueError("invalid signature")
            padded = payload_b64 + "=" * (-len(payload_b64) % 4)
            payload = json.loads(base64.urlsafe_b64decode(padded.encode("ascii")).decode("utf-8"))
            if int(payload.get("expiresAt") or 0) <= int(time.time()):
                raise ValueError("expired")
            return payload
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Invalid confirmation token: {exc}") from exc

    async def real_preview(self, *, symbol: str, source: str, risk_usdt: float, leverage: float, api_key: str, api_secret: str, secret: str) -> dict[str, Any]:
        keys_ok, key_error = validate_api_keys(api_key, api_secret)
        blockers: list[str] = []
        if not keys_ok:
            blockers.append(key_error or "invalid credentials")

        _, k5 = await analyzer_service.fetch_klines(symbol=symbol, interval="5m", limit=140, source=source, start_time=None, end_time=None)
        _, k15 = await analyzer_service.fetch_klines(symbol=symbol, interval="15m", limit=140, source=source, start_time=None, end_time=None)
        signal = self._signal_from_klines(symbol, k5, k15, risk_usdt, leverage)

        if signal.get("status") != "paper_candidate":
            blockers.append("Signal is not paper_candidate")

        volume_blocker, volume_gate = self._volume_quality_blocker(signal)
        if volume_blocker:
            blockers.append(volume_blocker)

        capabilities = {"credentialsValidFormat": bool(keys_ok), "api": {}}
        if keys_ok:
            capabilities = await self.futures_capabilities(symbol=symbol, api_key=api_key, api_secret=api_secret, credentials_source="env_or_request")
            if not (capabilities.get("api") or {}).get("oneWayReduceOnlyUsable"):
                blockers.append("Position mode must be BUYSELL for reduceOnly exits")
            if not (capabilities.get("api") or {}).get("readEndpointsOk"):
                blockers.append("Futures read endpoints failed")

        direction = str(signal.get("direction") or "none")
        side = "BUY" if direction == "long" else "SELL" if direction == "short" else ""
        close_side = "SELL" if direction == "long" else "BUY" if direction == "short" else ""
        entry = float(signal.get("entry") or 0.0)
        qty = (float(signal.get("notional") or 0.0) / entry) if entry > 0 else 0.0
        client_order_id = f"scalp-{symbol.lower()}-{int(time.time())}"

        order = {
            "symbol": symbol,
            "pionexSymbol": f"{symbol.removesuffix('USDT')}_USDT_PERP",
            "side": side,
            "closeSide": close_side,
            "direction": direction,
            "type": "MARKET_QTY",
            "requestBody": {
                "symbol": f"{symbol.removesuffix('USDT')}_USDT_PERP",
                "positionSide": "BOTH",
                "side": side,
                "type": "MARKET_QTY",
                "size": f"{qty:.8f}",
                "clientOrderId": client_order_id,
            },
        }

        expires = int(time.time()) + 180
        can_execute = len(blockers) == 0
        payload = {
            "action": "scalping_real_preview",
            "symbol": symbol,
            "source": source,
            "riskUsdt": risk_usdt,
            "leverage": leverage,
            "signal": signal,
            "order": order,
            "canExecute": can_execute,
            "blockers": blockers,
            "expiresAt": expires,
            "volumeGate": volume_gate,
        }
        return {
            "ok": True,
            "canExecute": can_execute,
            "blockers": blockers,
            "confirmationToken": self._sign(payload, secret),
            "expiresAt": expires,
            "signal": signal,
            "order": order,
            "volumeGate": volume_gate,
            "capabilities": capabilities,
        }

    async def real_execute(self, *, token: str, api_key: str, api_secret: str, secret: str) -> dict[str, Any]:
        payload = self._verify(token, secret)
        if payload.get("action") != "scalping_real_preview":
            raise HTTPException(status_code=400, detail="Invalid token action")
        if not payload.get("canExecute"):
            raise HTTPException(status_code=409, detail="Execution blocked by preview checks")

        order = payload.get("order") if isinstance(payload.get("order"), dict) else {}
        request_body = order.get("requestBody") if isinstance(order.get("requestBody"), dict) else {}
        signal = payload.get("signal") if isinstance(payload.get("signal"), dict) else {}
        symbol = str(payload.get("symbol") or "")
        source = str(payload.get("source") or "pionex")

        client = PionexClient(api_key, api_secret)
        try:
            entry_result = await client.create_futures_order(request_body)
        finally:
            await client.close()

        if not entry_result.success:
            raise HTTPException(status_code=502, detail=entry_result.error_message or "Entry order failed")

        monitor_id = f"scalp-monitor-{int(time.time())}"
        _SCALPING_MONITORS[monitor_id] = {
            "monitorId": monitor_id,
            "status": "active",
            "symbol": symbol,
            "source": source,
            "direction": signal.get("direction"),
            "entrySignalSnapshot": signal,
            "entryOrder": {
                "orderId": entry_result.order_id,
                "clientOrderId": entry_result.client_order_id,
                "requestBody": request_body,
                "response": entry_result.raw_response,
            },
            "stopLoss": signal.get("stopLoss"),
            "takeProfit": signal.get("takeProfit1"),
            "createdAt": datetime.now(timezone.utc).isoformat(),
        }

        async def monitor_loop() -> None:
            for _ in range(120):
                await asyncio.sleep(2)
                rec = _SCALPING_MONITORS.get(monitor_id)
                if not rec or rec.get("status") != "active":
                    return
                try:
                    _, one = await analyzer_service.fetch_klines(symbol=symbol, interval="1m", limit=1, source=source, start_time=None, end_time=None)
                    px = one[-1].close
                    rec["lastPrice"] = px
                    direction = str(rec.get("direction") or "")
                    sl = float(rec.get("stopLoss") or 0.0)
                    tp = float(rec.get("takeProfit") or 0.0)
                    hit_sl = px <= sl if direction == "long" else px >= sl
                    hit_tp = px >= tp if direction == "long" else px <= tp
                    if hit_sl or hit_tp:
                        rec["status"] = "closed"
                        rec["triggeredBy"] = "take_profit" if hit_tp else "stop_loss"
                        rec["endedAt"] = datetime.now(timezone.utc).isoformat()
                        return
                except Exception as exc:  # noqa: BLE001
                    rec["status"] = "failed"
                    rec["error"] = str(exc)
                    rec["endedAt"] = datetime.now(timezone.utc).isoformat()
                    return
            rec = _SCALPING_MONITORS.get(monitor_id)
            if rec and rec.get("status") == "active":
                rec["status"] = "timeout"
                rec["endedAt"] = datetime.now(timezone.utc).isoformat()

        asyncio.create_task(monitor_loop())

        return {
            "ok": True,
            "orderId": entry_result.order_id,
            "clientOrderId": entry_result.client_order_id,
            "monitorId": monitor_id,
            "status": "monitor_started",
        }

    async def spot_preview(self, *, symbol: str, source: str, risk_usdt: float, api_key: str, api_secret: str, secret: str, credentials_source: str) -> dict[str, Any]:
        keys_ok, key_error = validate_api_keys(api_key, api_secret)
        blockers: list[str] = []
        if not keys_ok:
            blockers.append(key_error or "invalid credentials")

        _, k5 = await analyzer_service.fetch_klines(symbol=symbol, interval="5m", limit=140, source=source, start_time=None, end_time=None)
        _, k15 = await analyzer_service.fetch_klines(symbol=symbol, interval="15m", limit=140, source=source, start_time=None, end_time=None)
        signal = self._signal_from_klines(symbol, k5, k15, risk_usdt, 1.0)

        if signal.get("status") != "paper_candidate":
            blockers.append("Signal is not paper_candidate")
        if signal.get("direction") != "long":
            blockers.append("Spot scalp supports long-only entries")

        volume_blocker, volume_gate = self._volume_quality_blocker(signal)
        if volume_blocker:
            blockers.append(volume_blocker)

        entry = float(signal.get("entry") or 0.0)
        stop_loss = float(signal.get("stopLoss") or 0.0)
        take_profit = float(signal.get("takeProfit1") or 0.0)
        loss_per_unit = max(entry - stop_loss, 0.0)
        qty = (risk_usdt / loss_per_unit) if loss_per_unit > 0 else 0.0
        usdt_amount = qty * entry if entry > 0 else 0.0
        if usdt_amount <= 0:
            blockers.append("Could not derive a valid spot amount from risk and stop distance")

        client_order_id = f"scalp-spot-{symbol.lower()}-{int(time.time())}"
        request_body = {
            "symbol": f"{symbol.removesuffix('USDT')}_USDT",
            "side": "BUY",
            "type": "MARKET",
            "amount": f"{usdt_amount:.2f}",
            "clientOrderId": client_order_id,
        }

        expires = int(time.time()) + 180
        can_execute = len(blockers) == 0
        order = {
            "symbol": symbol,
            "pionexSymbol": request_body["symbol"],
            "side": "BUY",
            "type": "MARKET",
            "entryReference": entry,
            "stopLoss": stop_loss,
            "takeProfit1": take_profit,
            "riskUsdt": risk_usdt,
            "baseQtyEstimate": qty,
            "quoteAmountUsdt": usdt_amount,
            "requestBody": request_body,
        }
        payload = {
            "action": "scalping_spot_preview",
            "symbol": symbol,
            "source": source,
            "riskUsdt": risk_usdt,
            "signal": signal,
            "order": order,
            "canExecute": can_execute,
            "blockers": blockers,
            "credentialsSource": credentials_source,
            "apiKeyFingerprint": self._mask_api_key_fingerprint(api_key if keys_ok else ""),
            "volumeGate": volume_gate,
            "expiresAt": expires,
        }
        return {
            "ok": True,
            "mode": "spot_long_only",
            "canExecute": can_execute,
            "blockers": blockers,
            "confirmationToken": self._sign(payload, secret),
            "expiresAt": expires,
            "signal": signal,
            "order": order,
            "credentialsSource": credentials_source,
            "apiKeyFingerprint": self._mask_api_key_fingerprint(api_key if keys_ok else ""),
            "volumeGate": volume_gate,
            "warning": "Spot long-only POC ready. Exit is handled by backend monitor." if can_execute else "Spot real execution is blocked until all checks pass.",
        }

    async def spot_execute(self, *, token: str, api_key: str, api_secret: str, secret: str, credentials_source: str) -> dict[str, Any]:
        payload = self._verify(token, secret)
        if payload.get("action") != "scalping_spot_preview":
            raise HTTPException(status_code=400, detail="Invalid token action")
        if not payload.get("canExecute"):
            raise HTTPException(status_code=409, detail="Spot scalping execution is blocked by preview checks")

        order = payload.get("order") if isinstance(payload.get("order"), dict) else {}
        request_body = order.get("requestBody") if isinstance(order.get("requestBody"), dict) else {}
        signal = payload.get("signal") if isinstance(payload.get("signal"), dict) else {}
        symbol = str(payload.get("symbol") or "")
        source = str(payload.get("source") or "pionex")

        client = PionexClient(api_key, api_secret)
        try:
            entry_result = await client.create_spot_order(request_body)
        finally:
            await client.close()
        if not entry_result.success:
            raise HTTPException(status_code=502, detail=entry_result.error_message or "Spot entry order failed")

        monitor_id = f"spot-scalp-monitor-{int(time.time())}"
        _SCALPING_MONITORS[monitor_id] = {
            "monitorId": monitor_id,
            "status": "active",
            "mode": "spot_long_only",
            "symbol": symbol,
            "source": source,
            "direction": "long",
            "entrySignalSnapshot": signal,
            "entryOrder": {
                "orderId": entry_result.order_id,
                "clientOrderId": entry_result.client_order_id,
                "requestBody": request_body,
                "response": entry_result.raw_response,
            },
            "stopLoss": order.get("stopLoss"),
            "takeProfit": order.get("takeProfit1"),
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "credentialsSource": credentials_source,
        }

        async def monitor_loop() -> None:
            for _ in range(120):
                await asyncio.sleep(2)
                rec = _SCALPING_MONITORS.get(monitor_id)
                if not rec or rec.get("status") != "active":
                    return
                try:
                    _, one = await analyzer_service.fetch_klines(symbol=symbol, interval="1m", limit=1, source=source, start_time=None, end_time=None)
                    px = one[-1].close
                    rec["lastPrice"] = px
                    sl = float(rec.get("stopLoss") or 0.0)
                    tp = float(rec.get("takeProfit") or 0.0)
                    hit_sl = px <= sl
                    hit_tp = px >= tp
                    if hit_sl or hit_tp:
                        rec["status"] = "closed"
                        rec["triggeredBy"] = "take_profit" if hit_tp else "stop_loss"
                        rec["endedAt"] = datetime.now(timezone.utc).isoformat()
                        return
                except Exception as exc:  # noqa: BLE001
                    rec["status"] = "failed"
                    rec["error"] = str(exc)
                    rec["endedAt"] = datetime.now(timezone.utc).isoformat()
                    return
            rec = _SCALPING_MONITORS.get(monitor_id)
            if rec and rec.get("status") == "active":
                rec["status"] = "timeout"
                rec["endedAt"] = datetime.now(timezone.utc).isoformat()

        asyncio.create_task(monitor_loop())
        return {
            "ok": True,
            "mode": "spot_long_only",
            "orderId": entry_result.order_id,
            "clientOrderId": entry_result.client_order_id,
            "monitorId": monitor_id,
            "status": "monitor_started",
        }

    def monitor_status(self, monitor_id: str) -> dict[str, Any]:
        row = _SCALPING_MONITORS.get(monitor_id)
        if not row:
            raise HTTPException(status_code=404, detail="Monitor not found")
        return {"ok": True, "monitor": row}

    def monitors(self, limit: int) -> dict[str, Any]:
        rows = list(_SCALPING_MONITORS.values())
        rows.sort(key=lambda r: str(r.get("createdAt") or ""), reverse=True)
        return {"ok": True, "count": len(rows), "monitors": rows[:limit]}


scalping_service = ScalpingService()
