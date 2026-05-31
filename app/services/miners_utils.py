from typing import Any


def validate_api_keys(api_key: str, api_secret: str) -> tuple[bool, str | None]:
    key = str(api_key or "").strip()
    secret = str(api_secret or "").strip()

    if not key:
        return False, "API key is required"
    if not secret:
        return False, "API secret is required"
    if len(key) < 20:
        return False, "API key appears incomplete"
    if len(secret) < 20:
        return False, "API secret appears incomplete"
    return True, None


def normalize_miner_symbol(order: dict[str, Any]) -> str:
    base = str(order.get("base") or "").upper().replace(".PERP", "")
    quote = str(order.get("quote") or "USDT").upper()
    if not base:
        return ""
    return base if base.endswith(quote) else f"{base}{quote}"
