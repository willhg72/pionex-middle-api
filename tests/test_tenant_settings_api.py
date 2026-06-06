from fastapi.testclient import TestClient

from app.main import app
from app.services.miners_service import miners_service
from app.services.tenant_settings_service import tenant_settings_service


def _sign_up(client: TestClient, email: str = "settings@example.com", tenant_name: str = "Settings Ops") -> dict:
    res = client.post(
        "/api/v1/auth/sign-up",
        json={
            "fullName": "Settings Owner",
            "email": email,
            "password": "StrongPass123",
            "tenantName": tenant_name,
        },
    )
    assert res.status_code == 200
    return res.json()


def test_tenant_settings_round_trip(monkeypatch):
    async def fake_validate(*args, **kwargs):
        return {"ok": True, "valid": True, "reason": None}

    monkeypatch.setattr(tenant_settings_service, "validate_settings_credentials", fake_validate)

    with TestClient(app) as client:
        auth = _sign_up(client)
        headers = {"X-API-Key": auth["tenantApiKey"]}

        save_res = client.post(
            "/api/v1/settings",
            headers=headers,
            json={
                "exchange": "pionex",
                "exchangeApiKey": "12345678901234567890KEY",
                "exchangeApiSecret": "12345678901234567890SECRET",
                "riskProfile": "moderate",
                "maxCapPct": 88,
                "maxLeverage": 9,
                "refreshInterval": 45,
                "theme": "dark",
            },
        )
        assert save_res.status_code == 200
        saved = save_res.json()
        assert saved["saved"] is True
        assert saved["hasExchangeApiKey"] is True
        assert saved["exchangeApiKeyMasked"]

        get_res = client.get("/api/v1/settings", headers=headers)
        assert get_res.status_code == 200
        current = get_res.json()
        assert current["riskProfile"] == "moderate"
        assert current["maxCapPct"] == 88
        assert current["maxLeverage"] == 9
        assert current["refreshInterval"] == 45
        assert current["hasExchangeApiKey"] is True


def test_tenant_settings_credentials_feed_live_endpoint(monkeypatch):
    async def fake_validate(*args, **kwargs):
        return {"ok": True, "valid": True, "reason": None}

    async def fake_list_miners(**kwargs):
        assert kwargs["api_key"] == "12345678901234567890KEY"
        assert kwargs["api_secret"] == "12345678901234567890SECRET"
        return [{"buOrderId": "1", "symbol": "BTC_USDT", "status": "open", "minerType": "futures"}]

    monkeypatch.setattr(tenant_settings_service, "validate_settings_credentials", fake_validate)
    monkeypatch.setattr(miners_service, "list_miners", fake_list_miners)

    with TestClient(app) as client:
        auth = _sign_up(client, email="tenant-cred@example.com", tenant_name="Tenant Creds")
        headers = {"X-API-Key": auth["tenantApiKey"]}
        save_res = client.post(
            "/api/v1/settings",
            headers=headers,
            json={
                "exchange": "pionex",
                "exchangeApiKey": "12345678901234567890KEY",
                "exchangeApiSecret": "12345678901234567890SECRET",
                "riskProfile": "moderate",
                "maxCapPct": 90,
                "maxLeverage": 10,
                "refreshInterval": 30,
                "theme": "dark",
            },
        )
        assert save_res.status_code == 200

        miners_res = client.get("/api/v1/dashboard/miners", headers=headers)

    assert miners_res.status_code == 200
    assert miners_res.json()["count"] == 1


def test_tenant_settings_reject_invalid_exchange_credentials(monkeypatch):
    async def fake_validate(*args, **kwargs):
        return {"ok": True, "valid": False, "reason": "Invalid Pionex API key or secret"}

    monkeypatch.setattr(tenant_settings_service, "validate_settings_credentials", fake_validate)

    with TestClient(app) as client:
        auth = _sign_up(client, email="invalid-cred@example.com", tenant_name="Invalid Creds")
        headers = {"X-API-Key": auth["tenantApiKey"]}
        save_res = client.post(
            "/api/v1/settings",
            headers=headers,
            json={
                "exchange": "pionex",
                "exchangeApiKey": "12345678901234567890KEY",
                "exchangeApiSecret": "12345678901234567890SECRET",
                "riskProfile": "moderate",
                "maxCapPct": 90,
                "maxLeverage": 10,
                "refreshInterval": 30,
                "theme": "dark",
            },
        )

    assert save_res.status_code == 400
    assert save_res.json()["detail"] == "Invalid Pionex API key or secret"
