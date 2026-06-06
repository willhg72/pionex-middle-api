const AUTH_KEY = 'capintel_auth';
const SETTINGS_KEY = 'capintel_settings';

function readJson(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? '{}');
  } catch {
    return {};
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getAuthSession() {
  const session = readJson(AUTH_KEY);
  return session?.token ? session : null;
}

export function saveAuthSession(session) {
  const nextSession = {
    token: session.token,
    expiresAt: session.expiresAt,
    tenantApiKey: session.tenantApiKey,
    user: session.user,
    tenant: session.tenant,
  };
  writeJson(AUTH_KEY, nextSession);

  const settings = readJson(SETTINGS_KEY);
  writeJson(SETTINGS_KEY, {
    ...settings,
    tenantApiKey: session.tenantApiKey,
  });
}

export function clearAuthSession() {
  const session = getAuthSession();
  const settings = readJson(SETTINGS_KEY);
  if (settings.tenantApiKey && settings.tenantApiKey === session?.tenantApiKey) {
    const { tenantApiKey, ...rest } = settings;
    writeJson(SETTINGS_KEY, rest);
  }
  window.localStorage.removeItem(AUTH_KEY);
}

export function isSessionActive(session = getAuthSession()) {
  if (!session?.token || !session?.expiresAt) {
    return false;
  }
  return Number(session.expiresAt) * 1000 > Date.now();
}
