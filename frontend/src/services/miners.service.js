import { apiFetch, getStoredCredentialsPayload } from './api-client.js';

function safeNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function firstText(...values) {
  for (const value of values) {
    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value);
    }
  }
  return '';
}

function classifyRisk(row) {
  const rangeHealth = String(row.rangeHealth || '').toLowerCase();
  const inventoryRatio = safeNum(row.inventoryRatio);
  if (rangeHealth.includes('break') || inventoryRatio >= 0.65) return 'danger';
  if (rangeHealth.includes('warn') || inventoryRatio >= 0.4) return 'warning';
  return 'ok';
}

function toMinerCard(row) {
  const quoteInvestment = safeNum(row.quoteInvestment);
  const gridProfit = safeNum(row.gridProfit);
  const totalProfit = safeNum(row.totalProfit, gridProfit);
  const closeProfit = safeNum(row.closeProfit, totalProfit);
  const trendPnl = safeNum(row.trendPnl);
  const risk = classifyRisk(row);
  const symbol = firstText(row.symbol, row.baseSymbol, row.market);
  const shortSymbol = symbol.replace(/_PERP$/i, '').replace(/_USDT$/i, '').replace(/_/g, '');
  const rangePosition = safeNum(row.rangePosition, 0.5);
  const low = Math.max(0, rangePosition - 0.2);
  const high = Math.min(1, rangePosition + 0.2);
  const current = Math.min(1, Math.max(0, rangePosition));
  const referencePrice = Math.max(1, safeNum(row.referencePrice, safeNum(row.currentPrice, 0)));
  return {
    buOrderId: firstText(row.buOrderId),
    symbol,
    ticker: shortSymbol,
    status: firstText(row.status, 'unknown'),
    type: firstText(row.minerType, 'grid_worker').replaceAll('_', ' '),
    leverage: safeNum(row.leverage, 1),
    capital: quoteInvestment,
    openPnl: closeProfit,
    dailyPnl: gridProfit,
    totalProfit,
    gridProfit,
    closeProfit,
    trendPnl,
    fillRate: Math.round(Math.max(0, Math.min(100, safeNum(row.executionEfficiencyReal, 0.5) * 100))),
    gridGap: Math.max(0.5, safeNum(row.perVolume, 0) * 1000),
    levels: Math.max(1, Math.round(safeNum(row.expectedGridLevels, 12))),
    currentPrice: referencePrice * current,
    gridLow: Math.max(1, referencePrice * low),
    gridHigh: Math.max(referencePrice * low + 1, referencePrice * high),
    rangePosition: current,
    rangeHealth: firstText(row.rangeHealth, 'unknown'),
    inventoryRatio: safeNum(row.inventoryRatio),
    targetDailyUsdt: safeNum(row.targetDailyUsdt, 1),
    warning: risk === 'danger'
      ? 'Range or inventory risk is elevated. Review close PnL and regrid evidence.'
      : risk === 'warning'
        ? 'This miner needs a closer look before scaling.'
        : '',
    risk,
    inventoryGate: row.inventoryGate || null,
    promoHealth: row.promoHealth || null,
    harvestPolicy: row.harvestPolicy || null,
    raw: row,
  };
}

function summarizeMiners(miners) {
  const totalCapital = miners.reduce((sum, item) => sum + safeNum(item.capital), 0);
  const openPnl = miners.reduce((sum, item) => sum + safeNum(item.openPnl), 0);
  const dailyPnl = miners.reduce((sum, item) => sum + safeNum(item.dailyPnl), 0);
  const warnings = miners.filter((item) => item.risk !== 'ok').length;
  const avgGridGap = miners.length ? miners.reduce((sum, item) => sum + safeNum(item.gridGap), 0) / miners.length : 0;
  return {
    active: miners.length,
    totalCapital,
    openPnl,
    dailyPnl,
    warnings,
    avgGridGap: avgGridGap.toFixed(2),
  };
}

export const minersService = {
  async getMiners({ targetDailyUsdt = 1 } = {}) {
    const response = await apiFetch(`/dashboard/miners?targetDailyUsdt=${encodeURIComponent(targetDailyUsdt)}`);
    const miners = Array.isArray(response?.miners) ? response.miners.map(toMinerCard) : [];
    return {
      ok: Boolean(response?.ok),
      source: response?.source || 'api',
      miners,
      summary: summarizeMiners(miners),
      count: miners.length,
    };
  },

  async getBalance() {
    return apiFetch('/dashboard/miners/account-balance');
  },

  async getHistory({ symbol, limit = 24 } = {}) {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (symbol) qs.set('symbol', symbol);
    return apiFetch(`/dashboard/miners/history?${qs.toString()}`);
  },

  async getEvents({ symbol, limit = 24 } = {}) {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (symbol) qs.set('symbol', symbol);
    return apiFetch(`/dashboard/miners/events?${qs.toString()}`);
  },

  async previewClose(miner) {
    return apiFetch('/dashboard/miners/close-preview', {
      method: 'POST',
      body: JSON.stringify({ buOrderId: miner.buOrderId, symbol: miner.symbol }),
    });
  },

  async executeClose({ confirmationToken, closeReason }) {
    return apiFetch('/dashboard/miners/close', {
      method: 'POST',
      body: JSON.stringify({
        confirmationToken,
        closeReason,
        ...getStoredCredentialsPayload(),
      }),
    });
  },

  async checkStabilization(miner, { mode = 'auto', targetDailyUsdt = 1 } = {}) {
    return apiFetch('/dashboard/miners/stabilization-check', {
      method: 'POST',
      body: JSON.stringify({
        buOrderId: miner.buOrderId,
        mode,
        targetDailyUsdt,
        ...getStoredCredentialsPayload(),
      }),
    });
  },

  async previewRegrid(miner, { mode = 'auto', targetDailyUsdt = 1 } = {}) {
    return apiFetch('/dashboard/miners/regrid-preview', {
      method: 'POST',
      body: JSON.stringify({
        buOrderId: miner.buOrderId,
        mode,
        targetDailyUsdt,
        ...getStoredCredentialsPayload(),
      }),
    });
  },

  async executeRegrid({ confirmationToken, reason }) {
    return apiFetch('/dashboard/miners/regrid', {
      method: 'POST',
      body: JSON.stringify({
        confirmationToken,
        reason,
        ...getStoredCredentialsPayload(),
      }),
    });
  },
};
