import base64
import hashlib
import hmac
import json
import time
from datetime import datetime, timezone
from typing import Any

import httpx
from fastapi import HTTPException

from app.integrations.pionex_client import PionexClient
from app.repositories.btc_core_repository import BtcCoreRepository
from app.repositories.btc_ladder_repository import BtcLadderRepository
from app.services.miners_utils import validate_api_keys


class BtcLadderService:
    @staticmethod
    def _safe_num(value: Any, default: float = 0.0) -> float:
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

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

    async def price(self) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=20.0) as client:
            res = await client.get("https://api.pionex.com/api/v1/market/tickers", params={"type": "SPOT"})
            res.raise_for_status()
            payload = res.json()
        data = payload.get("data") if isinstance(payload.get("data"), dict) else {}
        tickers = data.get("tickers") if isinstance(data.get("tickers"), list) else []
        for row in tickers:
            if str(row.get("symbol") or "").upper() == "BTC_USDT":
                px = self._safe_num(row.get("close"), 0.0) or self._safe_num(row.get("price"), 0.0)
                if px > 0:
                    return {"ok": True, "symbol": "BTC_USDT", "price": px, "source": "pionex_spot_tickers"}
        raise HTTPException(status_code=502, detail="BTC ladder price unavailable")

    @staticmethod
    def _build_rows(*, price_now: float, capital_usdt: float, levels: int, max_dip_pct: float) -> list[dict[str, Any]]:
        weights = [i for i in range(1, levels + 1)]
        weight_sum = sum(weights) or 1
        step = max_dip_pct / levels
        rows: list[dict[str, Any]] = []
        for i in range(1, levels + 1):
            discount_pct = step * i
            level_price = price_now * (1 - discount_pct / 100.0)
            usdt_alloc = capital_usdt * (weights[i - 1] / weight_sum)
            btc_size = usdt_alloc / level_price if level_price > 0 else 0.0
            rows.append({"level": i, "discountPct": discount_pct, "price": level_price, "usdtAmount": usdt_alloc, "btcAmount": btc_size})
        return rows

    async def dashboard(self, *, tenant_id: str, ladder_repo: BtcLadderRepository, core_repo: BtcCoreRepository) -> dict[str, Any]:
        buys = await core_repo.list_buys(tenant_id=tenant_id, limit=1000)
        total_btc = sum(self._safe_num(r.get("btcAmount"), 0.0) for r in buys)
        total_usdt = sum(self._safe_num(r.get("usdtAmount"), 0.0) for r in buys)
        avg_price = total_usdt / total_btc if total_btc > 0 else None
        dca_btc = sum(self._safe_num(r.get("btcAmount"), 0.0) for r in buys if str(r.get("source")) in {"manual", "live"})
        dca_usdt = sum(self._safe_num(r.get("usdtAmount"), 0.0) for r in buys if str(r.get("source")) in {"manual", "live"})
        ladder_btc = sum(self._safe_num(r.get("btcAmount"), 0.0) for r in buys if str(r.get("source")) in {"ladder_fill", "ladder_live"})
        ladder_usdt = sum(self._safe_num(r.get("usdtAmount"), 0.0) for r in buys if str(r.get("source")) in {"ladder_fill", "ladder_live"})
        orders = await ladder_repo.list_orders(tenant_id=tenant_id, limit=50)
        return {
            "ok": True,
            "generatedAt": int(time.time() * 1000),
            "inventory": {"totalBtc": total_btc, "totalUsdt": total_usdt, "averagePrice": avg_price, "dcaBtc": dca_btc, "dcaUsdt": dca_usdt, "ladderBtc": ladder_btc, "ladderUsdt": ladder_usdt},
            "ladderOrders": orders,
            "errors": [],
        }

    async def place_all(
        self, *, capital_usdt: float, levels: int, max_dip_pct: float, api_key: str, api_secret: str, credentials_source: str, tenant_id: str, ladder_repo: BtcLadderRepository
    ) -> dict[str, Any]:
        keys_ok, key_error = validate_api_keys(api_key, api_secret)
        if not keys_ok:
            raise HTTPException(status_code=400, detail=key_error)
        px = await self.price()
        price_now = self._safe_num(px.get("price"), 0.0)
        rows = self._build_rows(price_now=price_now, capital_usdt=capital_usdt, levels=levels, max_dip_pct=max_dip_pct)
        client = PionexClient(api_key, api_secret)
        placed: list[dict[str, Any]] = []
        failed: list[dict[str, Any]] = []
        now = datetime.now(timezone.utc)
        try:
            for row in rows:
                request_body = {
                    "symbol": "BTC_USDT",
                    "side": "BUY",
                    "type": "LIMIT",
                    "price": f"{row['price']:.2f}",
                    "size": f"{row['btcAmount']:.8f}",
                    "clientOrderId": f"btc-ladder-L{row['level']}-{now.strftime('%Y%m%d-%H%M%S')}",
                }
                result = await client.create_spot_order(request_body)
                if result.success:
                    order_id = f"btc-ladder-order-{result.client_order_id or int(time.time())}"
                    placed_row = {**row, "status": "placed", "pionexOrderId": result.order_id, "clientOrderId": result.client_order_id, "requestBody": request_body, "orderId": order_id}
                    placed.append(placed_row)
                    await ladder_repo.create_order(
                        tenant_id=tenant_id,
                        order_id=order_id,
                        price=row["price"],
                        usdt_amount=row["usdtAmount"],
                        btc_amount=row["btcAmount"],
                        status="placed",
                        pionex_order_id=result.order_id,
                        client_order_id=result.client_order_id,
                        payload=placed_row,
                    )
                else:
                    failed.append({**row, "status": "failed", "errorCode": result.error_code, "errorMessage": result.error_message})
        finally:
            await client.close()
        await ladder_repo.commit()
        return {"ok": len(placed) > 0, "credentialsSource": credentials_source, "priceNow": price_now, "levelsRequested": levels, "placedCount": len(placed), "failedCount": len(failed), "placed": placed, "failed": failed}

    async def cancel_all(self, *, api_key: str, api_secret: str, credentials_source: str) -> dict[str, Any]:
        keys_ok, key_error = validate_api_keys(api_key, api_secret)
        if not keys_ok:
            raise HTTPException(status_code=400, detail=key_error)
        client = PionexClient(api_key, api_secret)
        try:
            open_payload = await client.get_spot_open_orders("BTC_USDT")
            data = open_payload.get("data") if isinstance(open_payload.get("data"), dict) else {}
            orders = data.get("orders") if isinstance(data.get("orders"), list) else data.get("openOrders")
            orders = orders if isinstance(orders, list) else []
            targets = [str((r.get("orderId") or r.get("id") or "")) for r in orders if isinstance(r, dict) and str(r.get("side") or "").upper() == "BUY" and (r.get("orderId") or r.get("id"))]
            cancelled: list[str] = []
            failed: list[dict[str, Any]] = []
            for order_id in targets:
                res = await client.cancel_spot_order(order_id)
                if res.success:
                    cancelled.append(order_id)
                else:
                    failed.append({"orderId": order_id, "errorCode": res.error_code, "errorMessage": res.error_message})
        finally:
            await client.close()
        return {"ok": len(failed) == 0, "credentialsSource": credentials_source, "cancelledCount": len(cancelled), "failedCount": len(failed), "cancelled": cancelled, "failed": failed}

    def limit_preview(self, *, usdt_amount: float, limit_price: float, secret: str) -> dict[str, Any]:
        btc_size = usdt_amount / limit_price
        client_order_id = f"btc-ladder-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}"
        request_body = {"symbol": "BTC_USDT", "side": "BUY", "type": "LIMIT", "price": f"{limit_price:.2f}", "size": f"{btc_size:.8f}", "clientOrderId": client_order_id}
        expires_at = int(time.time()) + 300
        token_payload = {"action": "btc_ladder_spot_limit_buy", "symbol": "BTC_USDT", "usdtAmount": round(usdt_amount, 2), "limitPrice": limit_price, "btcAmount": btc_size, "requestBody": request_body, "expiresAt": expires_at}
        return {"ok": True, "canPlace": True, "confirmationToken": self._sign(token_payload, secret), "expiresAt": expires_at, "symbol": "BTC_USDT", "usdtAmount": round(usdt_amount, 2), "limitPrice": limit_price, "btcAmount": btc_size, "requestBody": request_body, "warning": "This will place a real Pionex spot LIMIT buy."}

    async def limit_execute(
        self, *, token: str, api_key: str, api_secret: str, credentials_source: str, secret: str, tenant_id: str, ladder_repo: BtcLadderRepository
    ) -> dict[str, Any]:
        token_payload = self._verify(token, secret)
        if token_payload.get("action") != "btc_ladder_spot_limit_buy":
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
            return {"ok": False, "pionex_ordered": False, "credentials_source": credentials_source, "error_code": result.error_code, "error_message": result.error_message, "request_body": request_body}
        now = datetime.now(timezone.utc)
        order_id = f"btc-ladder-order-{result.client_order_id or now.strftime('%Y%m%d-%H%M%S')}"
        order_row = {"orderId": order_id, "createdAt": now.isoformat(), "sourceType": "LADDER", "symbol": "BTC_USDT", "price": self._safe_num(token_payload.get("limitPrice"), 0.0), "usdtAmount": self._safe_num(token_payload.get("usdtAmount"), 0.0), "btcAmount": self._safe_num(token_payload.get("btcAmount"), 0.0), "status": "placed", "pionexOrderId": result.order_id, "clientOrderId": result.client_order_id, "requestBody": request_body}
        await ladder_repo.create_order(
            tenant_id=tenant_id,
            order_id=order_id,
            price=order_row["price"],
            usdt_amount=order_row["usdtAmount"],
            btc_amount=order_row["btcAmount"],
            status="placed",
            pionex_order_id=result.order_id,
            client_order_id=result.client_order_id,
            payload=order_row,
        )
        await ladder_repo.commit()
        return {"ok": True, "pionex_ordered": True, "credentials_source": credentials_source, "order": order_row}

    async def fill_confirm(
        self, *, btc_amount: float, usdt_amount: float, price: float | None, note: str | None, tenant_id: str, core_repo: BtcCoreRepository
    ) -> dict[str, Any]:
        if btc_amount <= 0 and usdt_amount <= 0:
            raise HTTPException(status_code=400, detail="btcAmount or usdtAmount is required")
        if btc_amount <= 0 and usdt_amount > 0 and price and price > 0:
            btc_amount = usdt_amount / price
        if usdt_amount <= 0 and btc_amount > 0 and price and price > 0:
            usdt_amount = btc_amount * price
        fill_id = f"btc-ladder-fill-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}-{time.time_ns() % 1000000}"
        fill = {"fillId": fill_id, "boughtAt": datetime.now(timezone.utc).isoformat(), "sourceType": "LADDER", "btcAmount": btc_amount, "usdtAmount": usdt_amount, "price": price, "note": note}
        await core_repo.create_buy(
            tenant_id=tenant_id,
            buy_id=fill_id,
            source="ladder_fill",
            btc_amount=btc_amount,
            usdt_amount=usdt_amount,
            price=price,
            note=note,
            order_id=None,
            client_order_id=None,
            payload=fill,
        )
        await core_repo.commit()
        return {"ok": True, "fill": fill}


btc_ladder_service = BtcLadderService()
