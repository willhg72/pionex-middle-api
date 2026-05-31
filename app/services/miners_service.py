import base64
import hashlib
import hmac
import json
import time
from typing import Any

from fastapi import HTTPException

from app.integrations.pionex_client import PionexClient
from app.services.miners_metrics import enrich_miner_metrics, normalize_account_balance
from app.services.miners_utils import normalize_miner_symbol, validate_api_keys


class MinersService:
    @staticmethod
    def resolve_credentials(payload: dict[str, Any], env_key: str | None, env_secret: str | None) -> tuple[str, str, str]:
        env_k = str(env_key or "").strip()
        env_s = str(env_secret or "").strip()
        if env_k and env_s:
            return env_k, env_s, "env"

        req_k = str(payload.get("api_key") or "").strip()
        req_s = str(payload.get("api_secret") or "").strip()
        if req_k and req_s:
            return req_k, req_s, "request"

        return "", "", "none"

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

            miner = {
                "buOrderId": str(row.get("buOrderId") or data.get("buOrderId") or ""),
                "symbol": normalize_miner_symbol(row),
                "status": row.get("status") or data.get("status"),
                "minerType": row.get("buOrderType"),
                "gridProfit": float(data.get("gridProfit") or 0.0),
                "totalProfit": total_profit_f,
                "closeProfit": total_profit_f,
                "quoteInvestment": float(data.get("quoteInvestment") or 0.0),
                "leverage": float(data.get("leverage") or 0.0),
                "position": float(data.get("position") or 0.0),
                "currentPrice": float(current_price) if current_price not in (None, "") else None,
                "bottom": float(data.get("bottom")) if data.get("bottom") not in (None, "") else None,
                "top": float(data.get("top")) if data.get("top") not in (None, "") else None,
            }
            miners.append(enrich_miner_metrics(miner, target_daily_usdt=target_daily_usdt))
        return miners

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

    async def close_miner(self, *, api_key: str, api_secret: str, bu_order_id: str) -> dict[str, Any]:
        keys_ok, key_error = validate_api_keys(api_key, api_secret)
        if not keys_ok:
            raise HTTPException(status_code=400, detail=key_error)

        client = PionexClient(api_key, api_secret)
        try:
            payload = await client.cancel_bot_order(bu_order_id=bu_order_id)
        finally:
            await client.close()

        if not payload.get("result"):
            raise HTTPException(status_code=502, detail=payload.get("message") or "Failed to close miner")

        return payload


miners_service = MinersService()
