import base64
import hashlib
import hmac
import json
import re
import secrets
import time
from typing import Any

from fastapi import HTTPException, status

from app.core.settings import get_settings
from app.db.models.auth import AppUser, Tenant, TenantMember
from app.repositories.auth_repository import AuthRepository


class AuthService:
    @staticmethod
    def _normalize_email(email: str) -> str:
        return email.strip().lower()

    @staticmethod
    def _slugify(value: str) -> str:
        slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")
        return slug or "tenant"

    @staticmethod
    def hash_password(password: str) -> str:
        salt = secrets.token_bytes(16)
        derived = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1, dklen=32)
        return f"scrypt${base64.urlsafe_b64encode(salt).decode('utf-8')}${base64.urlsafe_b64encode(derived).decode('utf-8')}"

    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        try:
            scheme, salt_b64, derived_b64 = password_hash.split("$", 2)
            if scheme != "scrypt":
                return False
            salt = base64.urlsafe_b64decode(salt_b64.encode("utf-8"))
            expected = base64.urlsafe_b64decode(derived_b64.encode("utf-8"))
            computed = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1, dklen=len(expected))
            return hmac.compare_digest(expected, computed)
        except Exception:
            return False

    @staticmethod
    def _sign_payload(payload: dict[str, Any], secret: str) -> str:
        body = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
        signature = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest().encode("utf-8")
        return base64.urlsafe_b64encode(body + b"." + signature).decode("utf-8")

    @staticmethod
    def _unsign_payload(token: str, secret: str) -> dict[str, Any]:
        raw = base64.urlsafe_b64decode(token.encode("utf-8"))
        body, signature = raw.rsplit(b".", 1)
        expected = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest().encode("utf-8")
        if not hmac.compare_digest(signature, expected):
            raise ValueError("invalid signature")
        return json.loads(body.decode("utf-8"))

    def generate_tenant_api_key(self, tenant_id: str) -> str:
        secret = get_settings().auth_session_secret
        digest = hmac.new(secret.encode("utf-8"), tenant_id.encode("utf-8"), hashlib.sha256).hexdigest()[:24]
        return f"tenant.{tenant_id}.{digest}"

    def verify_tenant_api_key(self, api_key: str) -> str | None:
        parts = api_key.split(".")
        if len(parts) != 3 or parts[0] != "tenant":
            return None
        tenant_id = parts[1].strip()
        if not tenant_id:
            return None
        expected = self.generate_tenant_api_key(tenant_id)
        if hmac.compare_digest(api_key, expected):
            return tenant_id
        return None

    def issue_session_token(self, *, user: AppUser, tenant: Tenant, role: str) -> tuple[str, int]:
        settings = get_settings()
        expires_at = int(time.time()) + int(settings.auth_session_ttl_seconds)
        token = self._sign_payload(
            {
                "sub": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "tenant_id": tenant.id,
                "tenant_slug": tenant.slug,
                "role": role,
                "exp": expires_at,
            },
            settings.auth_session_secret,
        )
        return token, expires_at

    def issue_password_reset_token(self, *, user: AppUser) -> tuple[str, int]:
        settings = get_settings()
        expires_at = int(time.time()) + int(settings.auth_reset_password_ttl_seconds)
        token = self._sign_payload(
            {
                "kind": "password_reset",
                "sub": user.id,
                "email": user.email,
                "exp": expires_at,
            },
            settings.auth_session_secret,
        )
        return token, expires_at

    def verify_session_token(self, token: str) -> dict[str, Any]:
        settings = get_settings()
        try:
            payload = self._unsign_payload(token, settings.auth_session_secret)
        except Exception as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid session token: {exc}") from exc
        if int(payload.get("exp") or 0) < int(time.time()):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")
        return payload

    async def _pick_membership(
        self, repo: AuthRepository, user_id: str, tenant_slug: str | None = None
    ) -> tuple[TenantMember, Tenant]:
        memberships = await repo.list_memberships_for_user(user_id)
        if not memberships:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User has no tenant access")
        if tenant_slug:
            for membership, tenant in memberships:
                if tenant.slug == tenant_slug:
                    return membership, tenant
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant membership not found")
        return memberships[0]

    async def _generate_unique_slug(self, repo: AuthRepository, tenant_name: str) -> str:
        base_slug = self._slugify(tenant_name)
        candidate = base_slug
        counter = 2
        while await repo.get_tenant_by_slug(candidate):
            candidate = f"{base_slug}-{counter}"
            counter += 1
        return candidate

    async def sign_up(self, repo: AuthRepository, *, full_name: str, email: str, password: str, tenant_name: str) -> dict[str, Any]:
        normalized_email = self._normalize_email(email)
        if await repo.get_user_by_email(normalized_email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")

        tenant_slug = await self._generate_unique_slug(repo, tenant_name)
        password_hash = self.hash_password(password)
        user = await repo.create_user(email=normalized_email, full_name=full_name.strip(), password_hash=password_hash)
        tenant = await repo.create_tenant(name=tenant_name.strip(), slug=tenant_slug)
        membership = await repo.create_membership(tenant_id=tenant.id, user_id=user.id, role="owner")
        await repo.touch_user_login(user)
        await repo.commit()
        token, expires_at = self.issue_session_token(user=user, tenant=tenant, role=membership.role)
        return {
            "token": token,
            "expiresAt": expires_at,
            "tenantApiKey": self.generate_tenant_api_key(tenant.id),
            "user": {"id": user.id, "email": user.email, "fullName": user.full_name},
            "tenant": {"id": tenant.id, "name": tenant.name, "slug": tenant.slug, "role": membership.role},
        }

    async def sign_in(self, repo: AuthRepository, *, email: str, password: str, tenant_slug: str | None = None) -> dict[str, Any]:
        normalized_email = self._normalize_email(email)
        user = await repo.get_user_by_email(normalized_email)
        if not user or not self.verify_password(password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")

        membership, tenant = await self._pick_membership(repo, user.id, tenant_slug=tenant_slug)
        await repo.touch_user_login(user)
        await repo.commit()
        token, expires_at = self.issue_session_token(user=user, tenant=tenant, role=membership.role)
        return {
            "token": token,
            "expiresAt": expires_at,
            "tenantApiKey": self.generate_tenant_api_key(tenant.id),
            "user": {"id": user.id, "email": user.email, "fullName": user.full_name},
            "tenant": {"id": tenant.id, "name": tenant.name, "slug": tenant.slug, "role": membership.role},
        }

    async def get_me(self, repo: AuthRepository, *, token: str) -> dict[str, Any]:
        payload = self.verify_session_token(token)
        user = await repo.get_user_by_email(self._normalize_email(str(payload.get("email") or "")))
        if not user or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session user is no longer active")

        tenant_id = str(payload.get("tenant_id") or "")
        tenant = await repo.get_tenant(tenant_id)
        membership = await repo.get_membership(user_id=user.id, tenant_id=tenant_id)
        if not tenant or not membership:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session tenant access is no longer valid")

        return {
            "expiresAt": int(payload["exp"]),
            "tenantApiKey": self.generate_tenant_api_key(tenant.id),
            "user": {"id": user.id, "email": user.email, "fullName": user.full_name},
            "tenant": {"id": tenant.id, "name": tenant.name, "slug": tenant.slug, "role": membership.role},
        }

    async def request_password_reset(self, repo: AuthRepository, *, email: str) -> dict[str, Any]:
        user = await repo.get_user_by_email(self._normalize_email(email))
        message = "If the account exists, a recovery workflow has been prepared."
        if not user or not user.is_active:
            return {"message": message, "resetToken": None, "resetUrl": None}
        token, _ = self.issue_password_reset_token(user=user)
        return {
            "message": message,
            "resetToken": token,
            "resetUrl": f"/dashboard/#/reset-password?token={token}",
        }

    async def reset_password(self, repo: AuthRepository, *, reset_token: str, new_password: str) -> dict[str, Any]:
        payload = self.verify_session_token(reset_token)
        if payload.get("kind") != "password_reset":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid password reset token")
        user = await repo.get_user_by_email(self._normalize_email(str(payload.get("email") or "")))
        if not user or not user.is_active or str(user.id) != str(payload.get("sub") or ""):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recovery account is no longer available")
        user.password_hash = self.hash_password(new_password)
        await repo.touch_user_login(user)
        await repo.commit()
        return {"message": "Password updated successfully. You can sign in now."}


auth_service = AuthService()
