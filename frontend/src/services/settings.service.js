import { apiFetch } from './api-client.js';
import { persistence } from '../utils/persistence.js';

const SETTINGS_KEY = 'capintel_settings';

function syncLocalCache(settings) {
  const current = persistence.load(SETTINGS_KEY) || {};
  persistence.save(SETTINGS_KEY, {
    ...current,
    exchange: settings.exchange,
    exchangeApiKey: current.exchangeApiKey || '',
    exchangeApiSecret: current.exchangeApiSecret || '',
    riskProfile: settings.riskProfile,
    maxCapPct: settings.maxCapPct,
    maxLeverage: settings.maxLeverage,
    refreshInterval: settings.refreshInterval,
    theme: settings.theme,
    hasExchangeApiKey: settings.hasExchangeApiKey,
    hasExchangeApiSecret: settings.hasExchangeApiSecret,
    exchangeApiKeyMasked: settings.exchangeApiKeyMasked || null,
    updatedAt: settings.updatedAt || null,
  });
}

export const settingsService = {
  async getSettings() {
    const data = await apiFetch('/settings');
    syncLocalCache(data);
    return data;
  },

  async saveSettings(settings) {
    const data = await apiFetch('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
    syncLocalCache(data);
    return data;
  },

  async validateApiKey({ exchange, exchangeApiKey, exchangeApiSecret }) {
    return apiFetch('/settings/validate-api-key', {
      method: 'POST',
      body: JSON.stringify({ exchange, exchangeApiKey, exchangeApiSecret }),
    });
  },

  async getAuditLog({ limit = 50, domain } = {}) {
    const { store } = await import('../state/store.js');
    return { data: store.getAuditEvents({ limit, domain }), ok: true };
  },
};
