import { apiFetch } from './api-client.js';
import { persistence } from '../utils/persistence.js';
import { applyLocalePreferences } from './i18n.js';

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
    fixedIncomeAnnualPct: settings.fixedIncomeAnnualPct,
    planTier: settings.planTier || current.planTier || 'free',
    theme: settings.theme,
    language: settings.language,
    timezone: settings.timezone,
    hasExchangeApiKey: settings.hasExchangeApiKey,
    hasExchangeApiSecret: settings.hasExchangeApiSecret,
    exchangeApiKeyMasked: settings.exchangeApiKeyMasked || null,
    updatedAt: settings.updatedAt || null,
  });
  applyLocalePreferences({
    language: settings.language,
    timezone: settings.timezone,
  });
}

export const settingsService = {
  getCachedSettings() {
    return persistence.load(SETTINGS_KEY) || {};
  },

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
