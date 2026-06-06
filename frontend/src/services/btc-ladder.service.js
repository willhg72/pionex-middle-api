import { apiFetch, getStoredCredentialsPayload } from './api-client.js';

export const btcLadderService = {
  async getDashboard() {
    return apiFetch('/dashboard/btc-ladder');
  },

  async getPrice() {
    return apiFetch('/dashboard/btc-ladder/price');
  },

  async placeAll({ capitalUsdt, levels, maxDipPct }) {
    return apiFetch('/dashboard/btc-ladder/place-all', {
      method: 'POST',
      body: JSON.stringify({
        capitalUsdt,
        levels,
        maxDipPct,
        ...getStoredCredentialsPayload(),
      }),
    });
  },

  async cancelAll() {
    return apiFetch('/dashboard/btc-ladder/cancel-all', {
      method: 'POST',
      body: JSON.stringify(getStoredCredentialsPayload()),
    });
  },

  async previewLimit({ usdtAmount, limitPrice }) {
    return apiFetch('/dashboard/btc-ladder/limit-preview', {
      method: 'POST',
      body: JSON.stringify({ usdtAmount, limitPrice }),
    });
  },

  async executeLimit({ confirmationToken }) {
    return apiFetch('/dashboard/btc-ladder/limit-execute', {
      method: 'POST',
      headers: { 'Idempotency-Key': `ladder-${Date.now()}` },
      body: JSON.stringify({
        confirmationToken,
        ...getStoredCredentialsPayload(),
      }),
    });
  },

  async confirmFill({ btcAmount, usdtAmount, price, note }) {
    return apiFetch('/dashboard/btc-ladder/fill-confirm', {
      method: 'POST',
      body: JSON.stringify({ btcAmount, usdtAmount, price, note }),
    });
  },

  async reconcile({ autoLedger = false } = {}) {
    return apiFetch('/dashboard/btc-ladder/reconcile', {
      method: 'POST',
      body: JSON.stringify({
        autoLedger,
        ...getStoredCredentialsPayload(),
      }),
    });
  },
};
