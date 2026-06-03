import hashlib
import hmac
import json
import time
import asyncio
from dataclasses import dataclass
from typing import Any

import httpx
from app.integrations.pionex_rate_limiter import PionexRateLimiter


@dataclass
class BotCreationResult:
    success: bool
    bu_order_id: str | None = None
    error_code: str | None = None
    error_message: str | None = None
    raw_response: dict[str, Any] | None = None


@dataclass
class FuturesOrderResult:
    success: bool
    order_id: str | None = None
    client_order_id: str | None = None
    error_code: str | None = None
    error_message: str | None = None
    raw_response: dict[str, Any] | None = None


@dataclass
class SpotOrderResult:
    success: bool
    order_id: str | None = None
    client_order_id: str | None = None
    error_code: str | None = None
    error_message: str | None = None
    raw_response: dict[str, Any] | None = None


@dataclass
class SpotCancelResult:
    success: bool
    order_id: str | None = None
    error_code: str | None = None
    error_message: str | None = None
    raw_response: dict[str, Any] | None = None


@dataclass
class BotStatusResult:
    success: bool
    status: str | None = None
    pnl: float | None = None
    last_update: str | None = None
    error_code: str | None = None
    error_message: str | None = None
    raw_response: dict[str, Any] | None = None


class PionexClient:
    _rate_limiter = PionexRateLimiter(rate_per_sec=10.0, burst=10.0)
    _weights = {
        "/api/v1/trade/order": 1,
        "/uapi/v1/trade/order": 1,
        "/api/v1/trade/openOrders": 5,
        "/uapi/v1/trade/openOrders": 5,
    }

    def __init__(self, api_key: str, api_secret: str) -> None:
        self.api_key = api_key.strip()
        self.api_secret = api_secret.strip()
        self._account_id = hashlib.sha256(self.api_key.encode("utf-8")).hexdigest()[:24] if self.api_key else "unknown"
        self.client = httpx.AsyncClient(
            base_url="https://api.pionex.com",
            timeout=30.0,
            headers={"Content-Type": "application/json"},
        )

    def _generate_signature(self, method: str, path: str, body: dict[str, Any] | None = None, extra_query: dict[str, Any] | None = None) -> tuple[str, str]:
        timestamp = int(time.time() * 1000)
        query_params: dict[str, Any] = {"timestamp": timestamp}
        if extra_query:
            query_params.update({k: v for k, v in extra_query.items() if v is not None})
        query = "&".join(f"{k}={query_params[k]}" for k in sorted(query_params.keys()))
        path_url = f"{path}?{query}"
        body_str = json.dumps(body or {}, separators=(",", ":")) if method != "GET" else ""
        message = f"{method}{path_url}{body_str}"
        signature = hmac.new(self.api_secret.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).hexdigest()
        return query, signature

    async def _signed_post(self, path: str, body: dict[str, Any]) -> dict[str, Any]:
        weight = int(self._weights.get(path, 1))
        attempts = 3
        for idx in range(attempts):
            await self._rate_limiter.acquire(self._account_id, weight)
            query, signature = self._generate_signature("POST", path, body)
            headers = {"PIONEX-KEY": self.api_key, "PIONEX-SIGNATURE": signature}
            try:
                response = await self.client.post(f"{path}?{query}", headers=headers, json=body)
            except httpx.HTTPError as exc:
                if idx == attempts - 1:
                    return {"result": False, "code": "HTTP_ERROR", "message": str(exc)}
                await asyncio.sleep(0.6 * (idx + 1))
                continue

            if response.status_code == 429 and idx < attempts - 1:
                await self._rate_limiter.mark_429(self._account_id, cooldown_s=60.0)
                await asyncio.sleep(0.8 * (idx + 1))
                continue
            if response.status_code >= 500 and idx < attempts - 1:
                await asyncio.sleep(0.6 * (idx + 1))
                continue
            return self._safe_json(response)
        return {"result": False, "code": "429", "message": "Upstream rate limit (429)"}

    async def _signed_get(self, path: str, query_params: dict[str, Any] | None = None) -> dict[str, Any]:
        weight = int(self._weights.get(path, 1))
        attempts = 3
        for idx in range(attempts):
            await self._rate_limiter.acquire(self._account_id, weight)
            query, signature = self._generate_signature("GET", path, {}, extra_query=query_params)
            headers = {"PIONEX-KEY": self.api_key, "PIONEX-SIGNATURE": signature}
            try:
                response = await self.client.get(f"{path}?{query}", headers=headers)
            except httpx.HTTPError as exc:
                if idx == attempts - 1:
                    return {"result": False, "code": "HTTP_ERROR", "message": str(exc)}
                await asyncio.sleep(0.6 * (idx + 1))
                continue

            if response.status_code == 429 and idx < attempts - 1:
                await self._rate_limiter.mark_429(self._account_id, cooldown_s=60.0)
                await asyncio.sleep(0.8 * (idx + 1))
                continue
            if response.status_code >= 500 and idx < attempts - 1:
                await asyncio.sleep(0.6 * (idx + 1))
                continue
            return self._safe_json(response)
        return {"result": False, "code": "429", "message": "Upstream rate limit (429)"}

    async def get_bot_orders(self) -> dict[str, Any]:
        return await self._signed_get("/api/v1/bot/orders")

    async def get_account_balances(self) -> dict[str, Any]:
        return await self._signed_get("/api/v1/account/balances")

    async def cancel_bot_order(
        self,
        *,
        bu_order_id: str,
        close_note: str | None = None,
        close_sell_model: str = "TO_USDT",
        immediate: bool = True,
        close_slippage: str = "0.01",
    ) -> dict[str, Any]:
        canonical_body = {
            "buOrderId": str(bu_order_id),
            "closeNote": close_note,
            "closeSellModel": close_sell_model,
            "immediate": immediate,
            "closeSlippage": close_slippage,
        }
        body = {k: v for k, v in canonical_body.items() if v is not None}
        return await self._signed_post("/api/v1/bot/order/cancel", body)

    async def get_bot_status(self, bu_order_id: str) -> BotStatusResult:
        oid = str(bu_order_id or "").strip()
        if not oid:
            return BotStatusResult(success=False, error_message="bu_order_id is required")

        endpoints = [
            "/api/v1/bot/orders/futuresGrid/order",
            "/api/v1/bot/orders/spotGrid/order",
            "/api/v1/bot/orders/smartCopy/order",
        ]
        last_data: dict[str, Any] | None = None
        for path in endpoints:
            data = await self._signed_get(path, {"buOrderId": oid})
            last_data = data
            if data.get("result"):
                payload = data.get("data") if isinstance(data.get("data"), dict) else {}
                bu_data = payload.get("buOrderData") if isinstance(payload.get("buOrderData"), dict) else {}
                status = str(
                    bu_data.get("status")
                    or payload.get("status")
                    or payload.get("state")
                    or payload.get("botStatus")
                    or ""
                ).lower() or None

                def _num(v: Any) -> float | None:
                    try:
                        return float(v)
                    except (TypeError, ValueError):
                        return None

                pnl = next(
                    (
                        x
                        for x in (
                            _num(bu_data.get("totalProfit")),
                            _num(bu_data.get("realizedProfit")),
                            _num(bu_data.get("gridProfit")),
                            _num(payload.get("totalProfit")),
                            _num(payload.get("profit")),
                        )
                        if x is not None
                    ),
                    None,
                )
                updated = (
                    bu_data.get("updateTime")
                    or payload.get("updateTime")
                    or payload.get("closeTime")
                    or bu_data.get("createTime")
                    or payload.get("createTime")
                )
                return BotStatusResult(
                    success=True,
                    status=status,
                    pnl=pnl,
                    last_update=str(updated) if updated is not None else None,
                    raw_response=data,
                )
            msg = str(data.get("message") or "").lower()
            if "not found" in msg or "invalid" in msg:
                continue

        return BotStatusResult(
            success=False,
            error_code=str((last_data or {}).get("code") or ""),
            error_message=str((last_data or {}).get("message") or "Unable to query bot status"),
            raw_response=last_data,
        )

    async def get_futures_position_mode(self) -> dict[str, Any]:
        return await self._signed_get("/uapi/v1/account/positionMode")

    async def get_futures_open_orders(self, symbol: str | None = None) -> dict[str, Any]:
        params = {"symbol": symbol} if symbol else None
        return await self._signed_get("/uapi/v1/trade/openOrders", params)

    async def get_futures_positions(self, symbol: str | None = None) -> dict[str, Any]:
        params = {"symbol": symbol} if symbol else None
        return await self._signed_get("/uapi/v1/account/positions", params)

    async def create_futures_order(self, body: dict[str, Any]) -> FuturesOrderResult:
        data = await self._signed_post("/uapi/v1/trade/order", body)
        payload = data.get("data") if isinstance(data.get("data"), dict) else {}
        if data.get("result"):
            return FuturesOrderResult(
                success=True,
                order_id=str(payload.get("orderId") or ""),
                client_order_id=str(payload.get("clientOrderId") or body.get("clientOrderId") or ""),
                raw_response=data,
            )
        return FuturesOrderResult(
            success=False,
            error_code=str(data.get("code") or ""),
            error_message=str(data.get("message") or "Unknown error"),
            raw_response=data,
        )

    async def create_spot_order(self, body: dict[str, Any]) -> SpotOrderResult:
        data = await self._signed_post("/api/v1/trade/order", body)
        payload = data.get("data") if isinstance(data.get("data"), dict) else {}
        if data.get("result"):
            return SpotOrderResult(
                success=True,
                order_id=str(payload.get("orderId") or ""),
                client_order_id=str(payload.get("clientOrderId") or body.get("clientOrderId") or ""),
                raw_response=data,
            )
        return SpotOrderResult(
            success=False,
            error_code=str(data.get("code") or ""),
            error_message=str(data.get("message") or "Unknown error"),
            raw_response=data,
        )

    async def get_spot_open_orders(self, symbol: str | None = None) -> dict[str, Any]:
        params = {"symbol": symbol} if symbol else None
        return await self._signed_get("/api/v1/trade/openOrders", params)

    async def cancel_spot_order(self, order_id: str) -> SpotCancelResult:
        data = await self._signed_post("/api/v1/trade/cancel", {"orderId": str(order_id)})
        if data.get("result"):
            return SpotCancelResult(
                success=True,
                order_id=str(order_id),
                raw_response=data,
            )
        return SpotCancelResult(
            success=False,
            order_id=str(order_id),
            error_code=str(data.get("code") or ""),
            error_message=str(data.get("message") or "Unknown error"),
            raw_response=data,
        )

    async def create_futures_grid_bot_from_body_strict(self, body: dict[str, Any]) -> BotCreationResult:
        path = "/api/v1/bot/order"
        data = await self._signed_post(path, body)
        if data.get("result"):
            return BotCreationResult(
                success=True,
                bu_order_id=str((data.get("data") or {}).get("buOrderId") or ""),
                raw_response=data,
            )
        return BotCreationResult(
            success=False,
            error_code=str(data.get("code") or ""),
            error_message=str(data.get("message") or "Unknown error"),
            raw_response=data,
        )

    @staticmethod
    def _safe_json(response: httpx.Response) -> dict[str, Any]:
        if response.status_code == 429:
            return {"result": False, "code": "429", "message": "Upstream rate limit (429)"}
        try:
            payload = response.json()
            if isinstance(payload, dict):
                return payload
            return {"result": False, "message": "Unexpected JSON payload", "raw": payload}
        except Exception:
            return {"result": False, "message": "Non-JSON response", "rawText": response.text[:500]}

    async def close(self) -> None:
        await self.client.aclose()
