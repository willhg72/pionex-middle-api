/**
 * Core API client - wraps fetch with base URL, auth headers, and error handling.
 * All domain services use this as the base.
 */

const BASE_URL = "/api/v1";
const MOCK_DELAY = 300;
const SETTINGS_KEY = "capintel_settings";
const AUTH_KEY = "capintel_auth";

class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function mockCall(data, delay = MOCK_DELAY) {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return { data, ok: true };
}

function readSavedSettings() {
  try {
    return JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function readSavedAuth() {
  try {
    return JSON.parse(window.localStorage.getItem(AUTH_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function getStoredApiKey() {
  const authSession = readSavedAuth();
  const settings = readSavedSettings();
  return authSession.tenantApiKey?.trim() || settings.tenantApiKey?.trim() || "";
}

export function getStoredApiSecret() {
  const settings = readSavedSettings();
  return settings.exchangeApiSecret?.trim() || settings.apiSecret?.trim() || "";
}

export function getStoredCredentialsPayload() {
  const settings = readSavedSettings();
  const api_key = settings.exchangeApiKey?.trim() || "";
  const api_secret = getStoredApiSecret();
  return {
    ...(api_key ? { api_key } : {}),
    ...(api_secret ? { api_secret } : {}),
  };
}

export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const apiKey = getStoredApiKey();
  const token = readSavedAuth().token?.trim() || "";
  const headers = {
    "Content-Type": "application/json",
    ...(apiKey ? { "X-API-Key": apiKey } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new ApiError(res.status, res.statusText, errorData);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export { ApiError };
