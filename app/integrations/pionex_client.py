import hashlib
import hmac
import json
import time
from dataclasses import dataclass
from typing import Any

import httpx


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


class PionexClient:
    def __init__(self, api_key: str, api_secret: str) -> None:
        self.api_key = api_key.strip()
        self.api_secret = api_secret.strip()
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
        query, signature = self._generate_signature("POST", path, body)
        headers = {"PIONEX-KEY": self.api_key, "PIONEX-SIGNATURE": signature}
        response = await self.client.post(f"{path}?{query}", headers=headers, json=body)
        return self._safe_json(response)

    async def _signed_get(self, path: str, query_params: dict[str, Any] | None = None) -> dict[str, Any]:
        query, signature = self._generate_signature("GET", path, {}, extra_query=query_params)
        headers = {"PIONEX-KEY": self.api_key, "PIONEX-SIGNATURE": signature}
        response = await self.client.get(f"{path}?{query}", headers=headers)
        return self._safe_json(response)

    async def get_bot_orders(self) -> dict[str, Any]:
        return await self._signed_get("/api/v1/bot/orders")

    async def get_account_balances(self) -> dict[str, Any]:
        return await self._signed_get("/api/v1/account/balances")

    async def cancel_bot_order(self, *, bu_order_id: str) -> dict[str, Any]:
        return await self._signed_post("/api/v1/bot/order/cancel", {"buOrderId": bu_order_id})

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
        try:
            payload = response.json()
            if isinstance(payload, dict):
                return payload
            return {"result": False, "message": "Unexpected JSON payload", "raw": payload}
        except Exception:
            return {"result": False, "message": "Non-JSON response", "rawText": response.text[:500]}

    async def close(self) -> None:
        await self.client.aclose()
