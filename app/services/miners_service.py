import base64
import hashlib
import hmac
import json
import time
from typing import Any

from fastapi import HTTPException

from app.integrations.pionex_client import PionexClient
from app.services.analyzer_service import Kline, analyzer_service
from app.services.miners_metrics import enrich_miner_metrics, normalize_account_balance, safe_float
from app.services.miners_utils import normalize_miner_symbol, validate_api_keys


class MinersService:
    @staticmethod
    def _round_or_none(value: float | None, digits: int = 6) -> float | None:
        return round(value, digits) if value is not None else None

    @staticmethod
    def _is_futures_miner(miner: dict[str, Any]) -> bool:
        symbol = str(miner.get("symbol") or "").upper()
        miner_type = str(miner.get("minerType") or "").lower()
        return symbol.endswith("_PERP") or "future" in miner_type

    @staticmethod
    def _range_width(miner: dict[str, Any]) -> float | None:
        bottom = safe_float(miner.get("bottom"), None)
        top = safe_float(miner.get("top"), None)
        if bottom is None or top is None or top <= bottom:
            return None
        return top - bottom

    @staticmethod
    def _closes(klines: list[Kline]) -> list[float]:
        return [float(k.close) for k in klines if k.close is not None]

    @staticmethod
    def _lows(klines: list[Kline]) -> list[float]:
        return [float(k.low) for k in klines if k.low is not None]

    @staticmethod
    def _ema(values: list[float], period: int) -> float | None:
        if len(values) < period:
            return None
        alpha = 2 / (period + 1)
        ema = sum(values[:period]) / period
        for value in values[period:]:
            ema = (value * alpha) + (ema * (1 - alpha))
        return ema

    @staticmethod
    def _rsi(values: list[float], period: int = 14) -> float | None:
        if len(values) <= period:
            return None
        gains: list[float] = []
        losses: list[float] = []
        for prev, curr in zip(values[:-1], values[1:]):
            delta = curr - prev
            gains.append(max(delta, 0.0))
            losses.append(abs(min(delta, 0.0)))
        avg_gain = sum(gains[:period]) / period
        avg_loss = sum(losses[:period]) / period
        for idx in range(period, len(gains)):
            avg_gain = ((avg_gain * (period - 1)) + gains[idx]) / period
            avg_loss = ((avg_loss * (period - 1)) + losses[idx]) / period
        if avg_loss == 0:
            return 100.0
        rs = avg_gain / avg_loss
        return 100 - (100 / (1 + rs))

    @staticmethod
    def _inside_range_pct(klines: list[Kline], bottom: float, top: float) -> float:
        if not klines:
            return 0.0
        inside = sum(1 for candle in klines if bottom <= float(candle.close) <= top)
        return inside / len(klines)

    @staticmethod
    def _compute_velocity(klines: list[Kline]) -> float | None:
        closes = MinersService._closes(klines)
        if len(closes) < 2 or closes[0] == 0:
            return None
        return (closes[-1] - closes[0]) / closes[0]

    @staticmethod
    def _normalize_quote_investment(data: dict[str, Any]) -> tuple[float, bool]:
        raw = float(data.get("quoteInvestment") or 0.0)
        leverage = float(data.get("leverage") or 0.0)
        usdt_investment = data.get("usdtInvestment")
        try:
            capital_ref = float(usdt_investment) if usdt_investment not in (None, "") else None
        except (TypeError, ValueError):
            capital_ref = None

        if raw > 0 and leverage > 1 and capital_ref and capital_ref > 0:
            implied = capital_ref * leverage
            drift = abs(raw - implied) / max(implied, 1e-9)
            # Strong match: quoteInvestment is actually notional (capital * leverage).
            if drift <= 0.15:
                return capital_ref, True
        return raw, False

    @staticmethod
    def resolve_credentials(
        payload: dict[str, Any],
        env_key: str | None,
        env_secret: str | None,
        *,
        stored_key: str | None = None,
        stored_secret: str | None = None,
        allow_env_fallback: bool = False,
    ) -> tuple[str, str, str]:
        req_k = str(payload.get("api_key") or "").strip()
        req_s = str(payload.get("api_secret") or "").strip()
        if req_k and req_s:
            return req_k, req_s, "request"

        saved_k = str(stored_key or "").strip()
        saved_s = str(stored_secret or "").strip()
        if saved_k and saved_s:
            return saved_k, saved_s, "tenant_settings"

        env_k = str(env_key or "").strip()
        env_s = str(env_secret or "").strip()
        if allow_env_fallback and env_k and env_s:
            return env_k, env_s, "owner_env_fallback"

        return "", "", "none"

    @staticmethod
    def require_credentials(
        payload: dict[str, Any],
        env_key: str | None,
        env_secret: str | None,
        *,
        stored_key: str | None = None,
        stored_secret: str | None = None,
        allow_env_fallback: bool = False,
    ) -> tuple[str, str, str]:
        api_key, api_secret, source = MinersService.resolve_credentials(
            payload,
            env_key,
            env_secret,
            stored_key=stored_key,
            stored_secret=stored_secret,
            allow_env_fallback=allow_env_fallback,
        )
        if not api_key or not api_secret:
            raise HTTPException(
                status_code=400,
                detail="Missing tenant exchange credentials. Send api_key/api_secret or configure tenant credentials.",
            )
        return api_key, api_secret, source

    async def list_miners(self, *, api_key: str, api_secret: str, target_daily_usdt: float = 1.0) -> list[dict[str, Any]]:
        keys_ok, key_error = validate_api_keys(api_key, api_secret)
        if not keys_ok:
            raise HTTPException(status_code=400, detail=key_error)

        client = PionexClient(api_key, api_secret)
        try:
            payload = await client.get_bot_orders()
        finally:
            await client.close()

        if not payload.get("result"):
            raise HTTPException(status_code=502, detail=payload.get("message") or "Failed to read Pionex bot orders")

        raw_rows = ((payload.get("data") or {}).get("orders") or [])
        miners: list[dict[str, Any]] = []
        for row in raw_rows:
            data = row.get("buOrderData") if isinstance(row.get("buOrderData"), dict) else {}
            total_profit = data.get("totalProfit")
            total_profit_f = float(total_profit) if total_profit not in (None, "") else None
            current_price = data.get("latestPrice") or data.get("initPrice") or data.get("positionOpenPrice")
            quote_investment, was_normalized = self._normalize_quote_investment(data)

            miner = {
                "buOrderId": str(row.get("buOrderId") or data.get("buOrderId") or ""),
                "symbol": normalize_miner_symbol(row),
                "status": row.get("status") or data.get("status"),
                "minerType": row.get("buOrderType"),
                "gridProfit": float(data.get("gridProfit") or 0.0),
                "totalProfit": total_profit_f,
                "closeProfit": total_profit_f,
                "quoteInvestment": quote_investment,
                "quoteInvestmentRaw": float(data.get("quoteInvestment") or 0.0),
                "quoteInvestmentNormalized": was_normalized,
                "leverage": float(data.get("leverage") or 0.0),
                "position": float(data.get("position") or 0.0),
                "currentPrice": float(current_price) if current_price not in (None, "") else None,
                "bottom": float(data.get("bottom")) if data.get("bottom") not in (None, "") else None,
                "top": float(data.get("top")) if data.get("top") not in (None, "") else None,
                "row": int(float(data.get("row"))) if data.get("row") not in (None, "") else None,
                "gridType": data.get("gridType"),
                "usdtInvestment": float(data.get("usdtInvestment")) if data.get("usdtInvestment") not in (None, "") else None,
                "extraMargin": float(data.get("extraMargin")) if data.get("extraMargin") not in (None, "") else None,
            }
            miners.append(enrich_miner_metrics(miner, target_daily_usdt=target_daily_usdt))
        return miners

    async def get_live_miner(self, *, api_key: str, api_secret: str, bu_order_id: str, target_daily_usdt: float = 1.0) -> dict[str, Any]:
        miners = await self.list_miners(api_key=api_key, api_secret=api_secret, target_daily_usdt=target_daily_usdt)
        for miner in miners:
            if str(miner.get("buOrderId") or "") == str(bu_order_id):
                return miner
        raise HTTPException(status_code=404, detail="Miner not found in active Pionex bot orders")

    async def get_account_balance(self, *, api_key: str, api_secret: str) -> dict[str, Any]:
        keys_ok, key_error = validate_api_keys(api_key, api_secret)
        if not keys_ok:
            raise HTTPException(status_code=400, detail=key_error)

        client = PionexClient(api_key, api_secret)
        try:
            payload = await client.get_account_balances()
        finally:
            await client.close()

        if not payload.get("result"):
            raise HTTPException(status_code=502, detail=payload.get("message") or "Failed to read account balances")

        return normalize_account_balance(payload)

    @staticmethod
    def sign_close_token(payload: dict[str, Any], secret: str, ttl_seconds: int = 300) -> str:
        data = dict(payload)
        data["exp"] = int(time.time()) + ttl_seconds
        body = json.dumps(data, separators=(",", ":")).encode("utf-8")
        sig = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest().encode("utf-8")
        return base64.urlsafe_b64encode(body + b"." + sig).decode("utf-8")

    @staticmethod
    def verify_close_token(token: str, secret: str) -> dict[str, Any]:
        try:
            raw = base64.urlsafe_b64decode(token.encode("utf-8"))
            body, sig = raw.rsplit(b".", 1)
            expected = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest().encode("utf-8")
            if not hmac.compare_digest(sig, expected):
                raise ValueError("Invalid signature")
            payload = json.loads(body.decode("utf-8"))
            if int(payload.get("exp") or 0) < int(time.time()):
                raise ValueError("Token expired")
            return payload
        except Exception as exc:  # noqa: BLE001
            raise HTTPException(status_code=400, detail=f"Invalid confirmation token: {exc}") from exc

    def classify_range_break_state(self, live: dict[str, Any]) -> str:
        range_position = safe_float(live.get("rangePosition"), None)
        if range_position is None:
            current = safe_float(live.get("currentPrice"), None)
            bottom = safe_float(live.get("bottom"), None)
            top = safe_float(live.get("top"), None)
            if current is None or bottom is None or top is None:
                return "UNKNOWN"
            if bottom <= current <= top:
                return "IN_RANGE"
            return "BREAK_UP" if current > top else "BREAK_DOWN"
        if 0 <= range_position <= 1:
            return "IN_RANGE"
        return "BREAK_UP" if range_position > 1 else "BREAK_DOWN"

    def build_stabilization_snapshot(
        self,
        live: dict[str, Any],
        *,
        klines_5m: list[Kline],
        klines_4h: list[Kline],
        klines_1d: list[Kline],
    ) -> dict[str, Any]:
        current = safe_float(live.get("currentPrice"), None)
        bottom = safe_float(live.get("bottom"), None)
        top = safe_float(live.get("top"), None)
        range_break_state = self.classify_range_break_state(live)
        velocity = self._compute_velocity(klines_5m)
        closes_5m = self._closes(klines_5m)
        closes_4h = self._closes(klines_4h)
        closes_1d = self._closes(klines_1d)
        rsi = self._rsi(closes_5m, 14)
        ema20_4h = self._ema(closes_4h, 20)
        ema50_4h = self._ema(closes_4h, 50)
        inside_range_pct = self._inside_range_pct(klines_5m[-24:], bottom, top) if bottom is not None and top is not None else 0.0
        recent_lows = self._lows(klines_5m[-12:])
        prev_lows = self._lows(klines_5m[-24:-12])
        recent_lows_stable = bool(recent_lows) and (
            not prev_lows or min(recent_lows) >= (min(prev_lows) * 0.995)
        )
        returns_recent = [abs((closes_5m[idx] - closes_5m[idx - 1]) / closes_5m[idx - 1]) for idx in range(1, len(closes_5m))]
        cooling_ratio = None
        adx_cooling = None
        if len(returns_recent) >= 12:
            recent_vol = sum(returns_recent[-6:]) / max(1, len(returns_recent[-6:]))
            prior_vol = sum(returns_recent[-12:-6]) / max(1, len(returns_recent[-12:-6]))
            cooling_ratio = (recent_vol / prior_vol) if prior_vol > 0 else 0.0
            adx_cooling = cooling_ratio <= 1.15

        distance_to_edge_pct = None
        if current is not None and bottom is not None and top is not None and current > 0:
            if range_break_state == "BREAK_UP":
                distance_to_edge_pct = max(0.0, (current - top) / current)
            elif range_break_state == "BREAK_DOWN":
                distance_to_edge_pct = max(0.0, (bottom - current) / current)
            else:
                distance_to_edge_pct = 0.0

        breakout_bias = bool(
            ema20_4h is not None
            and ema50_4h is not None
            and current is not None
            and current >= ema20_4h >= ema50_4h
        )
        bounce_bias = bool(
            rsi is not None
            and current is not None
            and bottom is not None
            and current >= (bottom * 0.985)
            and rsi >= 40
        )

        if range_break_state == "IN_RANGE":
            stabilization_state = "NOT_NEEDED"
            passed = True
        elif range_break_state == "BREAK_UP":
            passed = bool(recent_lows_stable and breakout_bias and (rsi is None or rsi >= 52) and (adx_cooling is not False))
            if passed:
                stabilization_state = "CONFIRMED"
            elif distance_to_edge_pct is not None and distance_to_edge_pct >= 0.05:
                stabilization_state = "REJECTED"
            else:
                stabilization_state = "WAITING"
        else:
            passed = bool(bounce_bias and (adx_cooling is not False) and (distance_to_edge_pct or 0.0) <= 0.03)
            if passed:
                stabilization_state = "CONFIRMED"
            elif distance_to_edge_pct is not None and distance_to_edge_pct >= 0.05:
                stabilization_state = "REJECTED"
            else:
                stabilization_state = "INVESTIGATING"

        return {
            "rangeBreakState": range_break_state,
            "stabilizationState": stabilization_state,
            "stabilizationEvidence": {
                "hoursObserved": round((len(klines_5m) * 5) / 60.0, 2),
                "recentLowsStable": recent_lows_stable,
                "insideRangePct": round(inside_range_pct, 4),
                "rsiRecovery": self._round_or_none(rsi, 2),
                "adxCooling": adx_cooling,
                "breakoutBias": breakout_bias,
                "bounceBias": bounce_bias,
                "velocity5m": self._round_or_none(velocity, 6),
                "distanceToEdgePct": self._round_or_none(distance_to_edge_pct, 6),
                "ema20_4h": self._round_or_none(ema20_4h, 6),
                "ema50_4h": self._round_or_none(ema50_4h, 6),
                "dailyTrendPct": self._round_or_none(((closes_1d[-1] - closes_1d[0]) / closes_1d[0]) if len(closes_1d) >= 2 and closes_1d[0] else None, 6),
                "passed": passed,
            },
        }

    def build_regrid_candidate(self, live: dict[str, Any], stabilization: dict[str, Any], *, mode: str = "auto") -> dict[str, Any] | None:
        range_break_state = stabilization.get("rangeBreakState")
        stabilization_state = stabilization.get("stabilizationState")
        current = safe_float(live.get("currentPrice"), None)
        bottom = safe_float(live.get("bottom"), None)
        top = safe_float(live.get("top"), None)
        width = self._range_width(live)
        row = int(live.get("row") or 0) or 100
        if current is None or bottom is None or top is None or width is None or width <= 0:
            return None

        explicit_mode = str(mode or "auto").lower()
        direction = range_break_state
        if explicit_mode == "up":
            direction = "BREAK_UP"
        elif explicit_mode == "down":
            direction = "BREAK_DOWN"

        if direction == "IN_RANGE":
            return None

        new_bottom: float
        new_top: float
        if direction == "BREAK_UP":
            new_bottom = max(top * 1.001, current - (width * 0.42))
            new_top = new_bottom + width
            suggestion = "MIGRATE_UP"
            reason = "Breakout remains above the original ceiling with acceptable stabilization evidence."
        else:
            new_top = min(bottom * 0.999, current + (width * 0.42))
            new_bottom = new_top - width
            suggestion = "MIGRATE_DOWN"
            reason = "Price is holding below the original floor and a lower operating range is being considered."

        range_score = 40.0
        if stabilization_state == "CONFIRMED":
            range_score += 35.0
        elif stabilization_state == "NOT_NEEDED":
            range_score += 15.0
        elif stabilization_state == "INVESTIGATING":
            range_score += 8.0

        evidence = stabilization.get("stabilizationEvidence") or {}
        inside_range_pct = safe_float(evidence.get("insideRangePct"), 0.0) or 0.0
        distance_to_edge_pct = safe_float(evidence.get("distanceToEdgePct"), 0.0) or 0.0
        range_score += max(0.0, 15.0 - (distance_to_edge_pct * 100))
        range_score += inside_range_pct * 10.0
        range_score = max(0.0, min(100.0, range_score))

        target_daily = safe_float(live.get("targetDailyUsdt"), 1.0) or 1.0
        quote_investment = safe_float(live.get("quoteInvestment"), 0.0) or 0.0
        expected_daily_profit = max(target_daily, quote_investment * 0.0012)

        return {
            "bottom": round(new_bottom, 8),
            "top": round(new_top, 8),
            "row": row,
            "expectedDailyProfit": round(expected_daily_profit, 4),
            "rangeScore": round(range_score, 1),
            "inRangeEfficiency": round(max(0.0, 1.0 - min(1.0, distance_to_edge_pct * 6)), 4),
            "reason": reason,
            "suggestion": suggestion,
            "oldBottom": bottom,
            "oldTop": top,
            "oldRow": row,
        }

    def build_regrid_decision(self, live: dict[str, Any], stabilization: dict[str, Any], candidate: dict[str, Any] | None) -> dict[str, Any]:
        range_break_state = stabilization.get("rangeBreakState")
        stabilization_state = stabilization.get("stabilizationState")
        blockers: list[str] = []
        suggestion = "NONE"
        reason = "Miner is still operating within its designed range."

        if range_break_state == "IN_RANGE":
            pass
        elif safe_float(live.get("closeProfit"), 0.0) is not None and (safe_float(live.get("closeProfit"), 0.0) or 0.0) < -abs((safe_float(live.get("quoteInvestment"), 0.0) or 0.0) * 0.15):
            suggestion = "EXIT_REVIEW"
            reason = "Closeable PnL is materially adverse; review exit or manual intervention before migrating."
            blockers.append("drawdown too deep for automatic regrid")
        elif stabilization_state != "CONFIRMED":
            suggestion = "WAIT"
            reason = "Regrid is not ready yet because stabilization evidence is still incomplete."
            blockers.append("stabilization not confirmed")
            if range_break_state == "BREAK_DOWN":
                blockers.append("price is below the designed range; do not regrid down until stabilization confirms")
        elif candidate:
            suggestion = str(candidate.get("suggestion") or "WAIT")
            reason = str(candidate.get("reason") or "Regrid candidate prepared.")
        else:
            suggestion = "WAIT"
            reason = "No valid regrid candidate could be built from the current live miner state."
            blockers.append("candidate could not be computed")

        return {"regridSuggestion": suggestion, "decisionReason": reason, "blockers": blockers}

    async def analyze_miner_regrid(
        self,
        *,
        api_key: str,
        api_secret: str,
        bu_order_id: str,
        target_daily_usdt: float = 1.0,
        mode: str = "auto",
    ) -> dict[str, Any]:
        live = await self.get_live_miner(
            api_key=api_key,
            api_secret=api_secret,
            bu_order_id=bu_order_id,
            target_daily_usdt=target_daily_usdt,
        )
        symbol = str(live.get("symbol") or "")
        _, klines_5m = await analyzer_service.fetch_klines_for_lookback(symbol=symbol, interval="5m", lookback_hours=6, source="pionex")
        _, klines_4h = await analyzer_service.fetch_klines_for_lookback(symbol=symbol, interval="4h", lookback_hours=14 * 24, source="pionex")
        _, klines_1d = await analyzer_service.fetch_klines_for_lookback(symbol=symbol, interval="1d", lookback_hours=120 * 24, source="pionex")
        stabilization = self.build_stabilization_snapshot(live, klines_5m=klines_5m, klines_4h=klines_4h, klines_1d=klines_1d)
        candidate = self.build_regrid_candidate(live, stabilization, mode=mode)
        decision = self.build_regrid_decision(live, stabilization, candidate)
        return {
            "liveMiner": live,
            **stabilization,
            "regridCandidate": candidate,
            **decision,
        }

    async def execute_regrid(
        self,
        *,
        api_key: str,
        api_secret: str,
        live: dict[str, Any],
        candidate: dict[str, Any],
    ) -> dict[str, Any]:
        keys_ok, key_error = validate_api_keys(api_key, api_secret)
        if not keys_ok:
            raise HTTPException(status_code=400, detail=key_error)

        client = PionexClient(api_key, api_secret)
        try:
            if self._is_futures_miner(live):
                result = await client.adjust_futures_grid_params(
                    bu_order_id=str(live.get("buOrderId") or ""),
                    bottom=str(candidate.get("bottom")),
                    top=str(candidate.get("top")),
                    row=int(candidate.get("row") or 0) or None,
                )
            else:
                result = await client.adjust_spot_grid_params(
                    bu_order_id=str(live.get("buOrderId") or ""),
                    bottom=str(candidate.get("bottom")),
                    top=str(candidate.get("top")),
                    row=int(candidate.get("row") or 0) or None,
                )
        finally:
            await client.close()

        if not result.success:
            raise HTTPException(status_code=502, detail=result.error_message or "Failed to execute regrid in Pionex")
        return {
            "result": True,
            "buOrderId": result.bu_order_id,
            "actionId": result.action_id,
            "raw": result.raw_response,
        }

    async def close_miner(self, *, api_key: str, api_secret: str, bu_order_id: str, close_reason: str | None = None) -> dict[str, Any]:
        keys_ok, key_error = validate_api_keys(api_key, api_secret)
        if not keys_ok:
            raise HTTPException(status_code=400, detail=key_error)

        client = PionexClient(api_key, api_secret)
        try:
            payload = await client.cancel_bot_order(
                bu_order_id=bu_order_id,
                close_note=close_reason,
                close_sell_model="TO_USDT",
                immediate=True,
                close_slippage="0.01",
            )
        finally:
            await client.close()

        if not payload.get("result"):
            raise HTTPException(status_code=502, detail=payload.get("message") or "Failed to close miner")

        return payload


miners_service = MinersService()
