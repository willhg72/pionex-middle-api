import base64
import hashlib
import hmac
import secrets
from typing import Any

from app.core.settings import get_settings
from app.db.models.tenant_settings import TenantSettings
from app.integrations.pionex_client import PionexClient
from app.repositories.tenant_settings_repository import TenantSettingsRepository
from app.services.miners_utils import validate_api_keys


class TenantSettingsService:
    def _derive_block(self, *, secret: str, nonce: bytes, counter: int) -> bytes:
        payload = nonce + counter.to_bytes(4, "big")
        return hmac.new(secret.encode("utf-8"), payload, hashlib.sha256).digest()

    def encrypt_secret(self, plaintext: str) -> str:
        raw = plaintext.encode("utf-8")
        nonce = secrets.token_bytes(16)
        secret = get_settings().auth_session_secret
        stream = bytearray()
        counter = 0
        while len(stream) < len(raw):
            stream.extend(self._derive_block(secret=secret, nonce=nonce, counter=counter))
            counter += 1
        cipher = bytes(a ^ b for a, b in zip(raw, stream))
        tag = hmac.new(secret.encode("utf-8"), nonce + cipher, hashlib.sha256).hexdigest()
        return f"enc2.{base64.urlsafe_b64encode(nonce).decode('utf-8')}.{base64.urlsafe_b64encode(cipher).decode('utf-8')}.{tag}"

    def decrypt_secret(self, ciphertext: str | None) -> str | None:
        if not ciphertext:
            return None
        try:
            parts = ciphertext.split(".")
            if len(parts) == 4 and parts[0] == "enc2":
                _, nonce_b64, cipher_b64, tag = parts
            elif len(parts) == 3 and parts[0] == "enc1":
                _, nonce_b64, cipher_b64 = parts
                tag = None
            else:
                return None
            nonce = base64.urlsafe_b64decode(nonce_b64.encode("utf-8"))
            cipher = base64.urlsafe_b64decode(cipher_b64.encode("utf-8"))
            secret = get_settings().auth_session_secret
            if tag is not None:
                expected_tag = hmac.new(secret.encode("utf-8"), nonce + cipher, hashlib.sha256).hexdigest()
                if not hmac.compare_digest(tag, expected_tag):
                    return None
            stream = bytearray()
            counter = 0
            while len(stream) < len(cipher):
                stream.extend(self._derive_block(secret=secret, nonce=nonce, counter=counter))
                counter += 1
            raw = bytes(a ^ b for a, b in zip(cipher, stream))
            return raw.decode("utf-8")
        except Exception:
            return None

    @staticmethod
    def mask_secret(value: str | None) -> str | None:
        text = str(value or "").strip()
        if not text:
            return None
        if len(text) <= 8:
            return "*" * len(text)
        return f"{text[:4]}{'*' * max(4, len(text) - 8)}{text[-4:]}"

    def build_response(self, row: TenantSettings | None) -> dict[str, Any]:
        if row is None:
            return {
                "ok": True,
                "exchange": "pionex",
                "riskProfile": "moderate",
                "maxCapPct": 90.0,
                "maxLeverage": 10,
                "refreshInterval": 30,
                "theme": "dark",
                "hasExchangeApiKey": False,
                "hasExchangeApiSecret": False,
                "exchangeApiKeyMasked": None,
                "updatedAt": None,
            }
        decrypted_key = self.decrypt_secret(row.exchange_api_key_encrypted)
        decrypted_secret = self.decrypt_secret(row.exchange_api_secret_encrypted)
        return {
            "ok": True,
            "exchange": row.exchange,
            "riskProfile": row.risk_profile,
            "maxCapPct": row.max_cap_pct,
            "maxLeverage": row.max_leverage,
            "refreshInterval": row.refresh_interval,
            "theme": row.theme,
            "hasExchangeApiKey": bool(decrypted_key),
            "hasExchangeApiSecret": bool(decrypted_secret),
            "exchangeApiKeyMasked": self.mask_secret(decrypted_key),
            "updatedAt": row.updated_at.isoformat() if row.updated_at else None,
        }

    async def get_settings(self, repo: TenantSettingsRepository, tenant_id: str) -> dict[str, Any]:
        row = await repo.get_by_tenant_id(tenant_id)
        return self.build_response(row)

    async def save_settings(self, repo: TenantSettingsRepository, tenant_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        current = await repo.get_by_tenant_id(tenant_id)
        next_key = payload.get("exchangeApiKey")
        next_secret = payload.get("exchangeApiSecret")
        keep_existing = next_key in (None, "") and next_secret in (None, "")
        encrypted_key = current.exchange_api_key_encrypted if current and keep_existing else self.encrypt_secret(str(next_key or "")) if next_key else None
        encrypted_secret = current.exchange_api_secret_encrypted if current and keep_existing else self.encrypt_secret(str(next_secret or "")) if next_secret else None

        row = await repo.upsert(
            tenant_id=tenant_id,
            exchange=str(payload.get("exchange") or "pionex").strip().lower(),
            exchange_api_key_encrypted=encrypted_key,
            exchange_api_secret_encrypted=encrypted_secret,
            risk_profile=str(payload.get("riskProfile") or "moderate").strip().lower(),
            max_cap_pct=float(payload.get("maxCapPct") or 90.0),
            max_leverage=int(payload.get("maxLeverage") or 10),
            refresh_interval=int(payload.get("refreshInterval") or 30),
            theme=str(payload.get("theme") or "dark").strip().lower(),
        )
        await repo.commit()
        return {"saved": True, **self.build_response(row)}

    async def resolve_exchange_credentials(self, repo: TenantSettingsRepository, tenant_id: str) -> tuple[str | None, str | None]:
        row = await repo.get_by_tenant_id(tenant_id)
        if row is None:
            return None, None
        return self.decrypt_secret(row.exchange_api_key_encrypted), self.decrypt_secret(row.exchange_api_secret_encrypted)

    async def validate_settings_credentials(self, repo: TenantSettingsRepository, tenant_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        api_key = str(payload.get("exchangeApiKey") or "").strip()
        api_secret = str(payload.get("exchangeApiSecret") or "").strip()
        if not api_key and not api_secret:
            api_key, api_secret = await self.resolve_exchange_credentials(repo, tenant_id)
            api_key = str(api_key or "")
            api_secret = str(api_secret or "")
        valid, reason = validate_api_keys(api_key, api_secret)
        if not valid:
            return {"ok": True, "valid": False, "reason": reason}

        client = PionexClient(api_key, api_secret)
        try:
            payload = await client.get_account_balances()
        finally:
            await client.close()

        if not payload.get("result"):
            return {
                "ok": True,
                "valid": False,
                "reason": str(payload.get("message") or payload.get("code") or "Pionex validation failed"),
            }
        return {"ok": True, "valid": True, "reason": None}


tenant_settings_service = TenantSettingsService()
