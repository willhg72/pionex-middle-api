import { apiFetch } from './api-client.js';

function safeNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function statusToSegment(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'candidate') return 'new';
  if (normalized === 'watch') return 'watching';
  if (normalized === 'reject' || normalized === 'no data') return 'rejected';
  return 'watching';
}

function scoreFromRow(row) {
  const raw = row?.score;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  return n <= 1 ? Math.round(n * 100) : Math.round(n);
}

function technicalGateFromMetrics(metrics = {}) {
  const change14d = safeNum(metrics.change14dPct, 0);
  const trend = String(metrics.regime || '').toLowerCase();
  return {
    trend: trend === 'bull' ? 'bullish' : trend === 'bear' ? 'bearish' : 'neutral',
    rsi: safeNum(metrics.residency30d, 0) * 100,
    support: safeNum(metrics.atlDistancePct, 0),
    resistance: safeNum(metrics.athDistancePct, 0),
    change14d,
  };
}

function normalizeOpportunity(row, index) {
  const metrics = row?.metrics || {};
  const symbol = String(row?.symbol || '').toUpperCase();
  const ticker = symbol.includes('_') ? symbol : `${symbol.replace(/USDT$/, '')}USDT`;
  return {
    id: `${symbol}-${row?.configKey || index}`,
    symbol,
    ticker,
    configKey: row?.configKey || '',
    type: row?.workerTypeLabel || row?.workerType || 'Worker',
    workerType: row?.workerType || '',
    status: statusToSegment(row?.status),
    rawStatus: row?.status || 'Watch',
    score: scoreFromRow(row),
    capitalRequired: safeNum(row?.capital, 0),
    leverage: safeNum(row?.leverage, 1),
    estimatedMonthly: safeNum(metrics.gridDailyProfit, 0) * 30,
    estimatedAnnual: safeNum(metrics.gridDailyProfit, 0) * 365,
    volatility30d: Math.abs(safeNum(metrics.change30dPct, 0)),
    fundingRate: 0,
    volume24h: safeNum(row?.activeNotional, 0),
    technicalGate: technicalGateFromMetrics(metrics),
    notes: row?.decisionReason || 'No decision note returned.',
    createdAt: Date.now() - index * 1000,
    metrics,
    minCoverage: safeNum(row?.minCoverage, 0),
    targetDailyUsdt: safeNum(row?.targetDailyUsdt, 1),
    orderParameters: row?.orderParameters || {},
  };
}

export const opportunitiesService = {
  async getCandidates({ capital = 175, universe = '', source = 'pionex', targetDailyUsdt = 1 } = {}) {
    const qs = new URLSearchParams({
      capital: String(capital),
      source,
      targetDailyUsdt: String(targetDailyUsdt),
    });
    if (universe) qs.set('universe', universe);
    const response = await apiFetch(`/dashboard/opportunities?${qs.toString()}`);
    const rows = Array.isArray(response?.opportunities) ? response.opportunities : [];
    return {
      ok: Boolean(response?.ok),
      summary: response?.summary || {},
      errors: Array.isArray(response?.errors) ? response.errors : [],
      candidates: rows.map((row, index) => normalizeOpportunity(row, index)),
    };
  },

  async previewCreate({ symbol, configKey, capital, targetDailyUsdt = 1, source = 'pionex' }) {
    return apiFetch('/dashboard/opportunities/create-preview', {
      method: 'POST',
      body: JSON.stringify({ symbol, configKey, capital, targetDailyUsdt, source }),
    });
  },

  async executeCreate({ confirmationToken, symbol, configKey, capital, targetDailyUsdt = 1, source = 'pionex' }) {
    return apiFetch('/dashboard/opportunities/create', {
      method: 'POST',
      body: JSON.stringify({ confirmationToken, symbol, configKey, capital, targetDailyUsdt, source }),
    });
  },

  async getTechnicalGate({ symbol, configKey, capital, targetDailyUsdt = 1, source = 'pionex' }) {
    return apiFetch('/dashboard/opportunities/technical-gate', {
      method: 'POST',
      body: JSON.stringify({ symbol, configKey, capital, targetDailyUsdt, source }),
    });
  },
};
