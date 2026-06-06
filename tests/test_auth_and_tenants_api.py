from fastapi.testclient import TestClient

from app.main import app
from app.services.miners_service import miners_service


def test_sign_up_sign_in_and_me_flow():
    with TestClient(app) as client:
        sign_up = client.post(
            "/api/v1/auth/sign-up",
            json={
                "fullName": "William Herrera",
                "email": "william@example.com",
                "password": "StrongPass123",
                "tenantName": "Singular Alpha",
            },
        )

        assert sign_up.status_code == 200
        created = sign_up.json()
        assert created["ok"] is True
        assert created["tenant"]["slug"] == "singular-alpha"
        assert created["tenantApiKey"].startswith("tenant.")
        assert created["token"]

        me = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {created['token']}"},
        )
        assert me.status_code == 200
        me_body = me.json()
        assert me_body["authenticated"] is True
        assert me_body["tenant"]["slug"] == "singular-alpha"
        assert me_body["tenantApiKey"] == created["tenantApiKey"]

        sign_in = client.post(
            "/api/v1/auth/sign-in",
            json={
                "email": "william@example.com",
                "password": "StrongPass123",
            },
        )
        assert sign_in.status_code == 200
        signed = sign_in.json()
        assert signed["tenant"]["id"] == created["tenant"]["id"]
        assert signed["tenantApiKey"] == created["tenantApiKey"]


def test_tenant_api_key_can_access_protected_dashboard_endpoint(monkeypatch):
    async def fake_list_miners(**kwargs):
        return [{"buOrderId": "tenant-1", "symbol": "BTC_USDT", "status": "open", "minerType": "futures"}]

    monkeypatch.setattr(miners_service, "list_miners", fake_list_miners)

    with TestClient(app) as client:
        sign_up = client.post(
            "/api/v1/auth/sign-up",
            json={
                "fullName": "Tenant Owner",
                "email": "owner@example.com",
                "password": "AnotherStrong123",
                "tenantName": "Worker Ops",
            },
        )
        auth = sign_up.json()

        res = client.post(
            "/api/v1/dashboard/miners",
            headers={"X-API-Key": auth["tenantApiKey"]},
            json={"api_key": "demo-key", "api_secret": "demo-secret"},
        )

    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert body["count"] == 1


def test_forgot_password_and_reset_flow():
    with TestClient(app) as client:
        sign_up = client.post(
            "/api/v1/auth/sign-up",
            json={
                "fullName": "Recovery Owner",
                "email": "recovery@example.com",
                "password": "OriginalPass123",
                "tenantName": "Recovery Ops",
            },
        )
        assert sign_up.status_code == 200

        forgot = client.post("/api/v1/auth/forgot-password", json={"email": "recovery@example.com"})
        assert forgot.status_code == 200
        forgot_body = forgot.json()
        assert forgot_body["ok"] is True
        assert forgot_body["resetToken"]

        reset = client.post(
            "/api/v1/auth/reset-password",
            json={"resetToken": forgot_body["resetToken"], "newPassword": "UpdatedPass123"},
        )
        assert reset.status_code == 200
        assert reset.json()["ok"] is True

        sign_in = client.post(
            "/api/v1/auth/sign-in",
            json={"email": "recovery@example.com", "password": "UpdatedPass123"},
        )
        assert sign_in.status_code == 200
