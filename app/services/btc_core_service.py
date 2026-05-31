import base64
import hashlib
import hmac
import json
import time
from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException

from app.integrations.pionex_client import PionexClient
from app.repositories.btc_core_repository import BtcCoreRepository
from app.services.analyzer_service import analyzer_service
from app.services.miners_utils import validate_api_keys


class BtcCoreService:
    @staticmethod
    def _safe_num(value: Any, default: float = 0.0) -> float:
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    def summarize_buys(self, rows: list[dict[str, Any]]) -> dict[str, Any]:
        total_btc = sum(self._safe_num(r.get("btcAmount"), 0.0) for r in rows)
        total_usdt = sum(self._safe_num(r.get("usdtAmount"), 0.0) for r in rows)
        average_price = (total_usdt / total_btc) if total_btc > 0 else None
        return {"totalBtc": total_btc, "totalUsdt": total_usdt, "averagePrice": average_price, "buys": rows}

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

    @staticmethod
    def _extract_execution(raw_response: dict[str, Any], fallback_usdt: float, fallback_price: float) -> dict[str, Any]:
        data = raw_response.get("data") if isinstance(raw_response.get("data"), dict) else {}
        btc_amount = float(data.get("filledSize") or data.get("executedSize") or 0.0)
        usdt_amount = float(data.get("filledAmount") or data.get("executedAmount") or fallback_usdt)
        estimated = False
        if btc_amount <= 0 and fallback_price > 0:
            btc_amount = fallback_usdt / fallback_price
            estimated = True
        price = float(data.get("avgPrice") or 0.0) or (usdt_amount / btc_amount if btc_amount > 0 else fallback_price)
        return {"btcAmount": btc_amount, "usdtAmount": usdt_amount, "price": price, "estimated": estimated}

    async def dashboard(
        self, *, monthly_budget_usdt: float, current_btc: float, target_btc: float, source: str, repo: BtcCoreRepository
    ) -> dict[str, Any]:
        _, klines = await analyzer_service.fetch_klines(
            symbol="BTCUSDT", interval="1d", limit=180, source=source, start_time=None, end_time=None
        )
        closes = [k.close for k in klines]
        current_price = closes[-1]
        avg_30 = sum(closes[-30:]) / max(1, min(30, len(closes)))
        momentum_30d = (current_price / avg_30 - 1.0) if avg_30 > 0 else 0.0

        buys = await repo.list_buys(limit=1000)
        ledger = self.summarize_buys(buys)
        effective_btc = ledger["totalBtc"] if ledger["totalBtc"] > 0 else current_btc
        gap = max(0.0, target_btc - effective_btc)
        monthly_btc_plan = monthly_budget_usdt / current_price if current_price > 0 else 0.0
        months_to_target = (gap / monthly_btc_plan) if monthly_btc_plan > 0 else None
        regime = "accumulate" if momentum_30d <= 0.04 else "be_selective"
        weekly_dca = monthly_budget_usdt * (0.5 if regime == "accumulate" else 0.35) / 4.0

        now = datetime.now(timezone.utc)
        recommendation_id = f"btc-core-dca-{now.isocalendar().year}-w{now.isocalendar().week:02d}"
        return {
            "ok": True,
            "recommendationId": recommendation_id,
            "signals": {"currentPrice": current_price, "avg30d": avg_30, "momentum30d": momentum_30d, "regime": regime},
            "plan": {
                "monthlyBudgetUsdt": monthly_budget_usdt,
                "weeklyDcaUsdt": weekly_dca,
                "currentBtc": effective_btc,
                "targetBtc": target_btc,
                "targetGapBtc": gap,
                "monthsToTarget": months_to_target,
            },
            "buyLedger": ledger,
            "source": source,
        }

    async def register_manual_buy(
        self, *, btc_amount: float, usdt_amount: float, price: float | None, note: str | None, repo: BtcCoreRepository
    ) -> dict[str, Any]:
        if btc_amount <= 0 and usdt_amount <= 0:
            raise HTTPException(status_code=400, detail="btcAmount or usdtAmount is required")
        if btc_amount <= 0 and usdt_amount > 0 and price and price > 0:
            btc_amount = usdt_amount / price
        if usdt_amount <= 0 and btc_amount > 0 and price and price > 0:
            usdt_amount = btc_amount * price
        if price is None and btc_amount > 0 and usdt_amount > 0:
            price = usdt_amount / btc_amount
        buy_id = f"btc-core-buy-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}"
        row = {"buyId": buy_id, "boughtAt": datetime.now(timezone.utc).isoformat(), "btcAmount": btc_amount, "usdtAmount": usdt_amount, "price": price, "note": note}
        await repo.create_buy(
            buy_id=buy_id,
            source="manual",
            btc_amount=btc_amount,
            usdt_amount=usdt_amount,
            price=price,
            note=note,
            order_id=None,
            client_order_id=None,
            payload=row,
        )
        await repo.commit()
        return {"ok": True, "buy": row}

    async def buy_preview(self, *, usdt_amount: float, reference_price: float | None, repo: BtcCoreRepository, secret: str) -> dict[str, Any]:
        if usdt_amount <= 0 or usdt_amount > 1000:
            raise HTTPException(status_code=400, detail="usdtAmount must be > 0 and <= 1000")
        if not reference_price or reference_price <= 0:
            _, klines = await analyzer_service.fetch_klines(symbol="BTCUSDT", interval="1d", limit=5, source="pionex", start_time=None, end_time=None)
            reference_price = klines[-1].close
        buys = await repo.list_buys(limit=1000)
        summary = self.summarize_buys(buys)
        avg_price = summary.get("averagePrice")
        delta_pct = (reference_price / avg_price - 1.0) if avg_price and avg_price > 0 else None
        comparison = "no_history" if delta_pct is None else "above" if delta_pct > 0.001 else "below" if delta_pct < -0.001 else "near"

        clean_amount = round(usdt_amount, 2)
        client_order_id = f"btc-core-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}"
        request_body = {"symbol": "BTC_USDT", "side": "BUY", "type": "MARKET", "amount": f"{clean_amount:.2f}", "clientOrderId": client_order_id}
        expires_at = int(time.time()) + 300
        token_payload = {
            "action": "btc_core_spot_market_buy",
            "symbol": "BTC_USDT",
            "usdtAmount": clean_amount,
            "estimatedBtc": clean_amount / reference_price,
            "referencePrice": reference_price,
            "requestBody": request_body,
            "expiresAt": expires_at,
        }
        return {
            "ok": True,
            "canBuy": True,
            "confirmationToken": self._sign(token_payload, secret),
            "expiresAt": expires_at,
            "symbol": "BTC_USDT",
            "usdtAmount": clean_amount,
            "estimatedBtc": clean_amount / reference_price,
            "referencePrice": reference_price,
            "averageBuy": {"averagePrice": avg_price, "deltaPct": delta_pct, "comparison": comparison, "totalBtc": summary.get("totalBtc"), "totalUsdt": summary.get("totalUsdt"), "buyCount": len(summary.get("buys") or [])},
            "requestBody": request_body,
            "warning": "This will place a real Pionex spot MARKET buy using USDT from your account.",
        }

    async def buy_execute(
        self, *, token: str, api_key: str, api_secret: str, credentials_source: str, secret: str, repo: BtcCoreRepository
    ) -> dict[str, Any]:
        token_payload = self._verify(token, secret)
        if token_payload.get("action") != "btc_core_spot_market_buy":
            raise HTTPException(status_code=400, detail="Invalid confirmation token action")
        request_body = token_payload.get("requestBody") if isinstance(token_payload.get("requestBody"), dict) else {}
        keys_ok, key_error = validate_api_keys(api_key, api_secret)
        if not keys_ok:
            raise HTTPException(status_code=400, detail=key_error)
        client = PionexClient(api_key, api_secret)
        try:
            result = await client.create_spot_order(request_body)
        finally:
            await client.close()
        if not result.success:
            return {
                "ok": False,
                "pionex_ordered": False,
                "credentials_source": credentials_source,
                "error_code": result.error_code,
                "error_message": result.error_message,
                "request_body": request_body,
            }
        executed = self._extract_execution(result.raw_response or {}, fallback_usdt=self._safe_num(request_body.get("amount"), 0.0), fallback_price=self._safe_num(token_payload.get("referencePrice"), 0.0))
        buy_id = f"btc-core-live-buy-{result.client_order_id or datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}"
        ledger = {
            "buyId": buy_id,
            "boughtAt": datetime.now(timezone.utc).isoformat(),
            "btcAmount": executed["btcAmount"],
            "usdtAmount": executed["usdtAmount"],
            "price": executed["price"],
            "note": "dashboard live Pionex spot market buy",
            "source": "pionex_spot_market_buy",
            "orderId": result.order_id,
            "clientOrderId": result.client_order_id,
            "requestBody": request_body,
        }
        await repo.create_buy(
            buy_id=buy_id,
            source="live",
            btc_amount=ledger["btcAmount"],
            usdt_amount=ledger["usdtAmount"],
            price=ledger["price"],
            note=ledger["note"],
            order_id=result.order_id,
            client_order_id=result.client_order_id,
            payload=ledger,
        )
        await repo.commit()
        return {"ok": True, "pionex_ordered": True, "credentials_source": credentials_source, "buy": ledger}


btc_core_service = BtcCoreService()
