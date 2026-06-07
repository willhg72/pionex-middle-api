import { LitElement, html, svg, css } from 'lit';
import { fmt } from '../../utils/format.js';
import { buttonStyles } from '../../styles/shared-styles.js';
import { capitalService } from '../../services/capital.service.js';
import { getLanguage } from '../../services/i18n.js';
import { settingsService } from '../../services/settings.service.js';

const STRATEGY_COLORS = ['#5b8def', '#f5a623', '#22d3a0', '#a855f7', '#2a2d3e'];
const PLAN_REFRESH_POLICY = {
  free: { autoMs: 60_000, manual: false, maxManual: 0, windowMs: 30_000 },
  pro: { autoMs: 30_000, manual: false, maxManual: 0, windowMs: 30_000 },
  premium: { autoMs: 30_000, manual: true, maxManual: 3, windowMs: 30_000 },
};

class CapitalView extends LitElement {
  static properties = {
    _data: { type: Object, state: true },
    _loading: { type: Boolean, state: true },
    _refreshing: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _range: { type: String, state: true },
    _monthlyScale: { type: String, state: true },
    _capitalHoverIndex: { type: Number, state: true },
    _monthlyHoverIndex: { type: Number, state: true },
    _lang: { type: String, state: true },
    _planTier: { type: String, state: true },
    _nextAutoRefreshAt: { type: Number, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); flex-wrap: wrap; }
    .toolbar-note { font-size: var(--text-xs); color: var(--color-text-muted); }
    .toolbar-status { font-size: var(--text-xs); color: var(--color-accent); }
    .kpi-strip { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: var(--space-3); }
    .main-row { display: grid; grid-template-columns: 1fr 340px; gap: var(--space-4); }
    @media (max-width: 1100px) { .main-row { grid-template-columns: 1fr; } }
    .bottom-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
    @media (max-width: 900px) { .bottom-row { grid-template-columns: 1fr; } }
    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel :is(
      .toolbar-note, .toolbar-status, .portfolio-total, .money-amount, .chart-legend-value, .chart-legend-pnl,
      .legend-pct, .legend-val, .rank-num, .rank-label, .rank-pct, .rank-val, .split-val, .snapshot-value,
      .portfolio-coin, .portfolio-value, .portfolio-qty, .portfolio-freeze, .portfolio-pct, .monthly-month,
      .monthly-metric-value, .event-symbol, .mdb-period, .mdb-value, .portfolio-summary-value, .portfolio-summary-sub
    ) {
      font-variant-numeric: tabular-nums slashed-zero;
      font-feature-settings: "tnum" 1, "zero" 1;
    }
    .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4); gap: var(--space-3); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .panel-sub { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }
    .chart-wrap { position: relative; height: 130px; overflow: visible; }
    .chart-wrap svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .chart-tooltip {
      position: absolute;
      top: 8px;
      transform: translateX(-50%);
      min-width: 118px;
      max-width: 150px;
      padding: 8px 10px;
      border-radius: var(--radius-md);
      background: rgba(10, 11, 15, 0.96);
      border: 1px solid var(--color-border-default);
      box-shadow: var(--shadow-lg);
      pointer-events: none;
      z-index: 2;
    }
    .chart-tooltip-date { font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 4px; }
    .chart-tooltip-value { font-family: var(--font-mono); font-size: 12px; font-weight: var(--weight-semibold); color: var(--color-text-primary); }
    .chart-tooltip-pnl { margin-top: 3px; font-size: 10px; color: var(--color-text-secondary); }
    .range-tabs { display: flex; gap: 2px; background: var(--color-bg-elevated); border-radius: 6px; padding: 3px; }
    .range-tab {
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 10.5px;
      font-weight: 500;
      cursor: pointer;
      color: var(--color-text-muted);
      letter-spacing: 0.04em;
      transition: all 120ms ease;
    }
    .range-tab.active { background: var(--color-bg-hover); color: var(--color-text-primary); }
    .donut-section { display: flex; align-items: center; gap: var(--space-5); }
    .donut-wrap { flex-shrink: 0; }
    .donut-legend { flex: 1; display: flex; flex-direction: column; gap: var(--space-2); }
    .legend-row { display: grid; grid-template-columns: 8px 1fr auto auto; align-items: center; gap: var(--space-2); }
    .legend-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
    .legend-label { flex: 1; font-size: var(--text-xs); color: var(--color-text-secondary); }
    .legend-pct { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); min-width: 42px; text-align: right; }
    .legend-val { font-family: var(--font-mono); font-size: 11px; font-weight: var(--weight-medium); min-width: 58px; text-align: right; }
    .ranked-list { display: flex; flex-direction: column; gap: 0; }
    .ranked-row { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border-subtle); }
    .ranked-row:last-child { border-bottom: none; }
    .rank-num { font-size: var(--text-xs); color: var(--color-text-disabled); font-family: var(--font-mono); min-width: 14px; text-align: center; }
    .rank-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .rank-label { flex: 1; font-size: var(--text-sm); font-family: var(--font-mono); font-weight: var(--weight-medium); }
    .rank-bar-wrap { flex: 1; max-width: 100px; }
    .rank-bar-bg { height: 3px; background: var(--color-bg-elevated); border-radius: 2px; overflow: hidden; }
    .rank-bar-fill { height: 100%; border-radius: 2px; transition: width 500ms ease; }
    .rank-pct { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); min-width: 36px; text-align: right; }
    .rank-val { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-medium); min-width: 76px; text-align: right; }
    .split-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-4); }
    .split-card { padding: var(--space-3); border-radius: var(--radius-md); text-align: center; }
    .split-card.prod { background: var(--color-positive-dim); border: 1px solid rgba(34,211,160,0.15); }
    .split-card.idle { background: var(--color-idle-dim); border: 1px solid rgba(90,95,117,0.15); }
    .split-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: var(--space-1); }
    .split-val { font-family: var(--font-mono); font-size: var(--text-xl); font-weight: var(--weight-semibold); }
    .split-card.prod .split-val { color: var(--color-positive); }
    .split-card.idle .split-val { color: var(--color-idle); }
    .split-sub { font-size: 10px; color: var(--color-text-muted); margin-top: 2px; }
    .risk-row { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border-subtle); }
    .risk-row:last-child { border-bottom: none; }
    .risk-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .risk-label { flex: 1; font-size: var(--text-sm); }
    .risk-bar-wrap { width: 80px; }
    .snapshot-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-3); }
    @media (max-width: 900px) { .snapshot-grid { grid-template-columns: 1fr; } }
    .snapshot-card { border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); background: var(--color-bg-elevated); padding: var(--space-3); }
    .snapshot-label { color: var(--color-text-muted); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
    .snapshot-value { font-family: var(--font-mono); font-size: var(--text-lg); font-weight: var(--weight-semibold); }
    .snapshot-note { margin-top: 4px; color: var(--color-text-muted); font-size: var(--text-xs); }
    .portfolio-grid { display:grid; grid-template-columns: 320px 1fr; gap: var(--space-4); }
    @media (max-width: 1000px) { .portfolio-grid { grid-template-columns: 1fr; } }
    .portfolio-summary-grid { display:grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin: var(--space-4) 0; }
    .portfolio-summary-card { padding: var(--space-3); border-radius: var(--radius-md); background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle); }
    .portfolio-summary-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 6px; }
    .portfolio-summary-value { font-family: var(--font-mono); font-size: var(--text-lg); font-weight: var(--weight-semibold); }
    .portfolio-summary-sub { margin-top: 4px; color: var(--color-text-muted); font-size: var(--text-xs); }
    .portfolio-table { display:flex; flex-direction:column; gap:0; }
    .portfolio-head, .portfolio-row {
      display:grid;
      grid-template-columns: 120px 1fr 1fr 1fr 1fr;
      gap: var(--space-3);
      align-items:center;
    }
    .portfolio-head {
      padding: 0 0 10px;
      border-bottom: 1px solid var(--color-border-subtle);
      color: var(--color-text-muted);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .portfolio-row {
      padding: 12px 0;
      border-bottom: 1px solid var(--color-border-subtle);
    }
    .portfolio-coin { display:flex; align-items:center; gap:10px; font-family:var(--font-mono); font-size:var(--text-md); font-weight:var(--weight-semibold); }
    .coin-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
    .portfolio-value, .portfolio-qty, .portfolio-freeze, .portfolio-pct { font-family:var(--font-mono); font-size:var(--text-md); font-weight: var(--weight-medium); }
    .portfolio-pct { display:flex; align-items:center; gap:10px; }
    .portfolio-pct-bar { flex:1; height:6px; border-radius:999px; background:var(--color-bg-elevated); overflow:hidden; }
    .portfolio-pct-fill { height:100%; border-radius:999px; }
    .monthly-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: var(--space-4); }
    @media (max-width: 1000px) { .monthly-grid { grid-template-columns: 1fr; } }
    .monthly-chart-wrap { position: relative; height: 220px; margin-bottom: var(--space-4); }
    .monthly-chart-wrap svg { width: 100%; height: 100%; }
    .monthly-chart-note { display:flex; align-items:center; justify-content:space-between; gap:var(--space-3); margin-top:var(--space-2); color:var(--color-text-muted); font-size:var(--text-xs); }
    .monthly-chart-tooltip {
      position: absolute;
      top: 10px;
      transform: translateX(-50%);
      min-width: 132px;
      max-width: 164px;
      padding: 8px 10px;
      border-radius: var(--radius-md);
      background: rgba(10, 11, 15, 0.96);
      border: 1px solid var(--color-border-default);
      box-shadow: var(--shadow-lg);
      pointer-events: none;
      z-index: 2;
    }
    .monthly-list { display: flex; flex-direction: column; gap: 0; }
    .monthly-row { display: grid; grid-template-columns: 88px 1fr 1fr 1fr; gap: var(--space-3); align-items: center; padding: 10px 0; border-bottom: 1px solid var(--color-border-subtle); }
    .monthly-row:last-child { border-bottom: none; }
    .monthly-month { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-secondary); }
    .monthly-metric-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); margin-bottom: 2px; }
    .monthly-metric-value { font-family: var(--font-mono); font-size: var(--text-md); font-weight: var(--weight-medium); }
    .event-list { display: flex; flex-direction: column; gap: 10px; }
    .event-item { border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); background: var(--color-bg-elevated); padding: 12px; }
    .event-top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); margin-bottom: 6px; }
    .event-symbol { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .event-time { color: var(--color-text-muted); font-size: var(--text-xs); }
    .event-meta { display: flex; flex-wrap: wrap; gap: 10px; color: var(--color-text-secondary); font-size: var(--text-xs); }
    .benchmark-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-3); }
    @media (max-width: 900px) { .benchmark-grid { grid-template-columns: 1fr; } }
    .dca-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: var(--space-3); }
    @media (max-width: 1200px) { .dca-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 700px) { .dca-grid { grid-template-columns: 1fr; } }
    .scale-tabs { display:flex; gap:2px; background:var(--color-bg-elevated); border-radius:6px; padding:3px; }

    /* ── Portfolio hero (non-trader view) ── */
    .portfolio-hero {
      background: linear-gradient(140deg, rgba(91,141,239,.07) 0%, rgba(34,211,160,.04) 100%);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-lg); padding: 20px 24px; margin-bottom: 4px;
    }
    .portfolio-eyebrow { font-size: var(--text-xs); font-weight: var(--weight-semibold); letter-spacing: .12em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 4px; }
    .portfolio-total { font-family: var(--font-mono); font-size: var(--text-4xl); font-weight: var(--weight-bold); letter-spacing: -.03em; line-height: 1.1; }
    .portfolio-meta { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 4px; }
    .portfolio-pills { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: var(--space-3); }
    .pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: var(--radius-full); font-size: var(--text-sm); font-weight: var(--weight-semibold); font-family: var(--font-mono); }
    .pill-pos { background: var(--color-positive-dim); color: var(--color-positive); }
    .pill-neg { background: var(--color-negative-dim); color: var(--color-negative); }
    .pill-acc { background: var(--color-accent-dim);   color: var(--color-accent); }

    /* ── Money map ── */
    .money-map { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-1); }
    .money-row {
      display: flex; align-items: center; gap: var(--space-3);
      padding: 10px 14px; border-radius: var(--radius-md);
      background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle);
      cursor: pointer; transition: border-color var(--transition-fast), background var(--transition-fast);
    }
    .money-row:hover { border-color: var(--color-border-strong); background: var(--color-bg-hover); }
    .money-icon { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
    .money-label-wrap { flex: 1; min-width: 0; }
    .money-name  { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .money-desc  { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 1px; }
    .money-right { margin-left: auto; text-align: right; flex-shrink: 0; }
    .money-amount{ font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .money-pct   { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 1px; }

    /* ── Chart legend — lives in panel-header, never overlaps the chart ── */
    .chart-legend {
      display: flex; flex-direction: column; align-items: flex-end; gap: 2px;
      min-width: 130px; opacity: 0; transition: opacity 150ms ease;
    }
    .chart-legend.active { opacity: 1; }
    .chart-legend-hint  { font-size: var(--text-xs); color: var(--color-text-disabled); }
    .chart-legend-date  { font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--color-text-muted); }
    .chart-legend-value { font-family: var(--font-mono); font-size: var(--text-lg); font-weight: var(--weight-semibold); letter-spacing: -.02em; }
    .chart-legend-pnl   { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-medium); }
    .chart-legend-pnl.pos { color: var(--color-positive); }
    .chart-legend-pnl.neg { color: var(--color-negative); }

    /* ── Monthly data bar (replaces floating tooltip on bar chart) ── */
    .monthly-data-bar {
      display: flex; align-items: center; gap: var(--space-5); flex-wrap: wrap;
      padding: var(--space-2) 0 var(--space-3);
      border-bottom: 1px solid var(--color-border-subtle); margin-bottom: var(--space-3);
    }
    .mdb-period { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-semibold); min-width: 60px; }
    .mdb-group  { display: flex; flex-direction: column; gap: 1px; }
    .mdb-label  { font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--color-text-muted); }
    .mdb-value  { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .mdb-value.pos { color: var(--color-positive); }
    .mdb-value.neg { color: var(--color-negative); }

    /* ── KPI delta flash animations ── */
    @keyframes kpiFlashPos {
      0%, 8%  { box-shadow: 0 0 0 2px rgba(34,211,160,.45), 0 0 14px rgba(34,211,160,.12); }
      100%    { box-shadow: none; }
    }
    @keyframes kpiFlashNeg {
      0%, 8%  { box-shadow: 0 0 0 2px rgba(240,74,94,.45), 0 0 14px rgba(240,74,94,.1); }
      100%    { box-shadow: none; }
    }
    .kpi-flash-pos { animation: kpiFlashPos 1.5s ease forwards; border-radius: var(--radius-lg); }
    .kpi-flash-neg { animation: kpiFlashNeg 1.5s ease forwards; border-radius: var(--radius-lg); }
  `];

  constructor() {
    super();
    this._data = { summary: {}, buckets: [], byTicker: [], byRisk: [], history: [], monthlyHistory: [], recentCloseEvents: [], accountBreakdown: {}, portfolioAssets: [], notes: {} };
    this._loading = true;
    this._refreshing = false;
    this._error = '';
    this._range = '30d';
    this._monthlyScale = 'annual';
    this._capitalHoverIndex = -1;
    this._monthlyHoverIndex = -1;
    this._lang = getLanguage();
    this._planTier = 'free';
    this._nextAutoRefreshAt = 0;
    this._manualRefreshHits = [];
    this._refreshTimer = null;
    this._prevSummary = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._localeListener = () => {
      this._lang = getLanguage();
      this.requestUpdate();
    };
    window.addEventListener('capintel-locale-changed', this._localeListener);
    this._bootstrap();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('capintel-locale-changed', this._localeListener);
    clearTimeout(this._refreshTimer);
  }

  _t(es, en) {
    return this._lang === 'en' ? en : es;
  }

  _getRefreshPolicy() {
    return PLAN_REFRESH_POLICY[this._planTier] || PLAN_REFRESH_POLICY.free;
  }

  _manualRefreshRemaining() {
    const policy = this._getRefreshPolicy();
    const now = Date.now();
    this._manualRefreshHits = this._manualRefreshHits.filter((ts) => now - ts < policy.windowMs);
    return Math.max(0, policy.maxManual - this._manualRefreshHits.length);
  }

  _scheduleRefresh() {
    clearTimeout(this._refreshTimer);
    const policy = this._getRefreshPolicy();
    this._nextAutoRefreshAt = Date.now() + policy.autoMs;
    this._refreshTimer = window.setTimeout(() => {
      this._load({ auto: true });
    }, policy.autoMs);
  }

  async _bootstrap() {
    try {
      const cached = settingsService.getCachedSettings();
      this._planTier = cached.planTier || 'free';
      const remote = await settingsService.getSettings().catch(() => null);
      if (remote?.planTier) this._planTier = remote.planTier;
    } finally {
      this._scheduleRefresh();
      await this._load();
    }
  }

  _emitShellMetrics() {
    const summary = this._data?.summary || {};
    const byRisk = Array.isArray(this._data?.byRisk) ? this._data.byRisk : [];
    const weights = { 'No Risk': 5, 'Low Risk': 20, 'Medium Risk': 55, 'High Risk': 85 };
    const totalRiskBase = byRisk.reduce((sum, item) => sum + Number(item.value || 0), 0) || 0;
    const weightedRisk = totalRiskBase > 0
      ? Math.round(byRisk.reduce((sum, item) => sum + ((weights[item.label] || 50) * Number(item.value || 0)), 0) / totalRiskBase)
      : 42;

    this.dispatchEvent(new CustomEvent('capintel-shell-metrics', {
      bubbles: true,
      composed: true,
      detail: {
        route: 'capital',
        metrics: {
          totalCapital: Number(summary.totalCapitalVisible || 0),
          freeUsdt: Number(summary.freeUsdt || 0),
          openPnl: Number(summary.allMinerGain || 0),
          monthlyPnl: Number(summary.monthlyCloseablePnlChange || 0),
          riskScore: weightedRisk,
        },
      },
    }));
  }

  // Lit lifecycle — runs after every re-render, detects changed KPIs and flashes them
  updated(changedProperties) {
    if (!changedProperties.has('_data') || !this._prevSummary) return;
    const curr = this._data?.summary || {};
    const prev = this._prevSummary;
    const KPI_MAP = [
      ['totalCapitalVisible',        'kpi-total'],
      ['capitalMining',              'kpi-mining'],
      ['capitalNotMining',           'kpi-idle'],
      ['allMinerGain',               'kpi-gain'],
      ['minerCapitalRoiPct',         'kpi-roi'],
      ['fixedEquivalentMinerCapital','kpi-fixed'],
      ['monthlyCloseablePnlChange',  'kpi-monthly'],
      ['revenueAccumulated',         'kpi-revenue'],
    ];
    KPI_MAP.forEach(([field, kpiId]) => {
      if (prev[field] === undefined || curr[field] === prev[field]) return;
      const el = this.renderRoot?.querySelector(`[data-kpi="${kpiId}"]`);
      if (!el) return;
      const up = Number(curr[field]) > Number(prev[field]);
      el.classList.remove('kpi-flash-pos', 'kpi-flash-neg');
      void el.offsetWidth; // force reflow to restart animation
      el.classList.add(up ? 'kpi-flash-pos' : 'kpi-flash-neg');
      setTimeout(() => el.classList.remove('kpi-flash-pos', 'kpi-flash-neg'), 1600);
    });
  }

  // ── Non-trader helpers ───────────────────────────────────────────────

  _getBucketIcon(label) {
    const ICONS = {
      'Active Miners': '⬡', 'BTC Core': '₿', 'BTC Ladder': '≡',
      Scalping: '⚡', 'Free USDT': '◎',
    };
    return ICONS[label] || '◆';
  }

  _getFriendlyLabel(label) {
    const MAP = {
      'Active Miners': { es: 'Mineros activos',  en: 'Active Miners'   },
      'BTC Core':      { es: 'Bitcoin Stack',     en: 'Bitcoin Stack'   },
      'BTC Ladder':    { es: 'BTC Escalera',      en: 'BTC Ladder'      },
      Scalping:        { es: 'Scalping Lab',      en: 'Scalping Lab'    },
      'Free USDT':     { es: 'Disponible (USDT)', en: 'Available (USDT)'},
      'Wallet USDT':   { es: 'Wallet USDT',       en: 'Wallet USDT'     },
    };
    return MAP[label]?.[this._lang] || label;
  }

  _getBucketDesc(label) {
    const MAP = {
      'Active Miners': { es: 'Capturando spreads en el mercado',   en: 'Capturing market spreads'     },
      'BTC Core':      { es: 'Posición de largo plazo en Bitcoin', en: 'Long-term Bitcoin position'   },
      'BTC Ladder':    { es: 'Acumulación gradual, bajo riesgo',   en: 'Gradual accumulation, low risk'},
      Scalping:        { es: 'Estrategia de capturas rápidas',     en: 'Short-term capture strategy'  },
      'Free USDT':     { es: 'Listo para desplegar o retirar',     en: 'Ready to deploy or withdraw'  },
      'Wallet USDT':   { es: 'Saldo spot total reportado por Pionex', en: 'Total spot wallet reported by Pionex' },
    };
    return MAP[label]?.[this._lang] || '';
  }

  _renderPortfolioHero() {
    const summary = this._data?.summary || {};
    const buckets = Array.isArray(this._data?.buckets) ? this._data.buckets : [];
    if (!buckets.length) return html``;
    const total         = Number(summary.totalCapitalVisible || 0);
    const monthlyChange = Number(summary.monthlyCloseablePnlChange || 0);
    const available     = Number(summary.freeUsdt || summary.capitalNotMining || 0);
    const activeBuckets = buckets.filter((b) => b.productive);

    return html`
      <div class="portfolio-hero">
        <div class="portfolio-eyebrow">${this._t('Tu portafolio', 'Your portfolio')}</div>
        <div class="portfolio-total">${fmt.usd(total, 0)}</div>
        <div class="portfolio-meta">${activeBuckets.length} ${this._t('estrategias activas', 'active strategies')}</div>
        <div class="portfolio-pills">
          <span class="pill ${monthlyChange >= 0 ? 'pill-pos' : 'pill-neg'}">
            ${monthlyChange >= 0 ? '▲' : '▼'} ${fmt.usd(Math.abs(monthlyChange), 0)} ${this._t('este mes', 'this month')}
          </span>
          <span class="pill pill-acc">${fmt.usd(available, 0)} ${this._t('disponibles', 'available')}</span>
        </div>
      </div>
      <div class="money-map">
        ${buckets.map((bucket, i) => html`
          <div class="money-row">
            <div class="money-icon" style="background:${STRATEGY_COLORS[i % STRATEGY_COLORS.length]}22;color:${STRATEGY_COLORS[i % STRATEGY_COLORS.length]}">
              ${this._getBucketIcon(bucket.label)}
            </div>
            <div class="money-label-wrap">
              <div class="money-name">${this._getFriendlyLabel(bucket.label)}</div>
              <div class="money-desc">${this._getBucketDesc(bucket.label)}</div>
            </div>
            <div class="money-right">
              <div class="money-amount" style="color:${STRATEGY_COLORS[i % STRATEGY_COLORS.length]}">${fmt.usd(Number(bucket.value || 0), 0)}</div>
              <div class="money-pct">${Number(bucket.pct || 0).toFixed(1)}%</div>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  async _load({ auto = false, manual = false } = {}) {
    const hasData = Boolean(
      (this._data?.history && this._data.history.length)
      || Object.keys(this._data?.summary || {}).length
      || (this._data?.portfolioAssets && this._data.portfolioAssets.length)
    );
    if (manual) {
      const policy = this._getRefreshPolicy();
      if (!policy.manual) return;
      const remaining = this._manualRefreshRemaining();
      if (remaining <= 0) {
        window.toast?.(this._t('Límite manual alcanzado: máximo 3 refresh en 30 segundos.', 'Manual limit reached: max 3 refreshes in 30 seconds.'), { type: 'warning' });
        return;
      }
      this._manualRefreshHits.push(Date.now());
    }
    this._error = '';
    if (hasData) {
      this._refreshing = true;
    } else {
      this._loading = true;
    }
    try {
      this._prevSummary = { ...(this._data?.summary || {}) };
      this._data = await capitalService.getDashboard();
      this._emitShellMetrics();
    } catch (error) {
      const message = error?.data?.detail || error?.message || this._t('No se pudo cargar el panel de capital.', 'Could not load capital dashboard.');
      if (hasData) {
        window.toast?.(message, { type: auto ? 'warning' : 'error' });
      } else {
        this._error = message;
        if (!auto) window.toast?.(this._error, { type: 'error' });
      }
    } finally {
      this._loading = false;
      this._refreshing = false;
      this._scheduleRefresh();
    }
  }

  _getHistory() {
    const history = Array.isArray(this._data?.history) ? this._data.history : [];
    const total = history.length;
    const days = Number.parseInt(this._range, 10);
    if (!Number.isFinite(days) || days >= total) return history;
    return history.slice(total - days);
  }

  _getMonthlyRows() {
    const rows = Array.isArray(this._data?.monthlyHistory) ? this._data.monthlyHistory : [];
    const size = this._monthlyScale === 'quarter' ? 3 : this._monthlyScale === 'semester' ? 6 : 12;
    return rows.slice(-size);
  }

  _formatDateRange(hist) {
    if (!hist.length) return '';
    return `${fmt.date(hist[0].isoDate)} - ${fmt.date(hist.at(-1).isoDate)}`;
  }

  _formatShortDate(ts) {
    return new Intl.DateTimeFormat(fmt.locale(), {
      timeZone: fmt.timezone(),
      month: 'short',
      day: 'numeric',
    }).format(new Date(ts));
  }

  _historySnapshotLabel(hist) {
    const unique = new Set((hist || []).map((item) => String(item.isoDate || '')));
    const count = Array.from(unique).filter(Boolean).length;
    if (count <= 1) {
      return this._t('1 snapshot guardado', '1 saved snapshot');
    }
    return this._t(`${count} snapshots guardados`, `${count} saved snapshots`);
  }

  _setCapitalHover(event) {
    const hist = this._getHistory();
    if (!hist.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    this._capitalHoverIndex = Math.round(ratio * (hist.length - 1));
  }

  _setMonthlyHover(event) {
    const rows = Array.isArray(this._data?.monthlyHistory) ? this._data.monthlyHistory : [];
    if (!rows.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    this._monthlyHoverIndex = Math.round(ratio * (rows.length - 1));
  }

  _renderAreaChart() {
    const hist = this._getHistory();
    if (!hist.length) return html``;

    const W = 600;
    const H = 130;
    const PAD = { top: 16, right: 12, bottom: 22, left: 4 };
    const cW = W - PAD.left - PAD.right;
    const cH = H - PAD.top - PAD.bottom;
    const vals = hist.map((item) => Number(item.total || 0));
    const minV = Math.min(...vals);
    const maxV = Math.max(...vals);
    const flat = Math.abs(maxV - minV) < 0.000001;
    const chartMin = flat ? (minV * 0.96) : minV;
    const chartMax = flat ? (maxV * 1.04 || 1) : maxV;
    const range = chartMax - chartMin || 1;
    const pts = hist.map((item, index) => ({
      x: PAD.left + (index / Math.max(1, hist.length - 1)) * cW,
      y: PAD.top + cH - (((Number(item.total || 0) - chartMin) / range) * cH),
      item,
    }));
    const line = pts.map((point, index) => {
      if (index === 0) return `M ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      const prev = pts[index - 1];
      const cpX = ((prev.x + point.x) / 2).toFixed(1);
      return `C ${cpX} ${prev.y.toFixed(1)}, ${cpX} ${point.y.toFixed(1)}, ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    }).join(' ');
    const area = `${line} L ${pts.at(-1).x.toFixed(1)} ${H - PAD.bottom} L ${pts[0].x.toFixed(1)} ${H - PAD.bottom} Z`;
    const yLevels = [chartMin, chartMin + range * 0.5, chartMax];
    const uniqueTimestamps = new Set(hist.map((item) => String(item.isoDate || '')));
    const dateIdxs = uniqueTimestamps.size <= 1
      ? [hist.length - 1]
      : Array.from(new Set([0, Math.floor(hist.length / 2), hist.length - 1]));
    const hoverIndex = this._capitalHoverIndex >= 0 ? Math.min(this._capitalHoverIndex, pts.length - 1) : pts.length - 1;
    const hoverPoint = pts[hoverIndex];

    return html`
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="overflow:visible">
        <defs>
          <linearGradient id="cap-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#22d3a0" stop-opacity="0.28"></stop>
            <stop offset="60%" stop-color="#22d3a0" stop-opacity="0.06"></stop>
            <stop offset="100%" stop-color="#22d3a0" stop-opacity="0"></stop>
          </linearGradient>
          <filter id="cap-glow" x="-5%" y="-40%" width="110%" height="180%">
            <feGaussianBlur stdDeviation="2" result="b"></feGaussianBlur>
            <feMerge><feMergeNode in="b"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge>
          </filter>
        </defs>
        ${yLevels.map((value, index) => {
          const y = (PAD.top + cH - (((value - chartMin) / range) * cH)).toFixed(1);
          return svg`
            <line x1="${PAD.left}" y1="${y}" x2="${W - PAD.right}" y2="${y}" stroke="#1f2130" stroke-width="1" stroke-dasharray="${index === 0 ? 'none' : '3 4'}"></line>
            <text x="${W - PAD.right + 5}" y="${(Number(y) + 3.5).toFixed(1)}" fill="#42475e" font-size="8.5" font-family="JetBrains Mono, monospace" text-anchor="start">
              ${fmt.usd(value, 0)}
            </text>
          `;
        })}
        ${svg`<path d="${area}" fill="url(#cap-area-grad)"></path>`}
        ${svg`<path d="${line}" fill="none" stroke="#22d3a0" stroke-width="1.8" filter="url(#cap-glow)" stroke-linejoin="round" stroke-linecap="round"></path>`}
        ${svg`<line x1="${hoverPoint.x.toFixed(1)}" y1="${PAD.top}" x2="${hoverPoint.x.toFixed(1)}" y2="${H - PAD.bottom}" stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-dasharray="4 4"></line>`}
        ${svg`<circle cx="${hoverPoint.x.toFixed(1)}" cy="${hoverPoint.y.toFixed(1)}" r="4.2" fill="#22d3a0" stroke="#10131c" stroke-width="2"></circle>`}
        ${svg`<circle cx="${pts.at(-1).x.toFixed(1)}" cy="${pts.at(-1).y.toFixed(1)}" r="3" fill="#22d3a0" filter="url(#cap-glow)"></circle>`}
        ${dateIdxs.map((index, rank) => svg`
          <text x="${pts[index].x.toFixed(1)}" y="${H}" fill="#42475e" font-size="8.5" font-family="Inter, sans-serif" text-anchor="${rank === 0 ? 'start' : rank === dateIdxs.length - 1 ? 'end' : 'middle'}">
            ${this._formatShortDate(hist[index].isoDate)}
          </text>
        `)}
      </svg>
    `;
  }

  _renderDonut() {
    const buckets = Array.isArray(this._data?.buckets) ? this._data.buckets : [];
    const total = buckets.reduce((sum, item) => sum + Number(item.value || 0), 0) || 1;
    const productive = buckets.filter((item) => item.productive).reduce((sum, item) => sum + Number(item.value || 0), 0);
    const productivePct = ((productive / total) * 100).toFixed(1);
    const CX = 80;
    const CY = 80;
    const R = 62;
    const SW = 14;
    const GAP = 0.04;
    const arc = (startAngle, endAngle) => {
      const a1 = startAngle + GAP / 2;
      const a2 = endAngle - GAP / 2;
      if (a2 - a1 < 0.01) return null;
      const x1 = CX + R * Math.sin(a1);
      const y1 = CY - R * Math.cos(a1);
      const x2 = CX + R * Math.sin(a2);
      const y2 = CY - R * Math.cos(a2);
      const large = (a2 - a1) > Math.PI ? 1 : 0;
      return `M ${x1.toFixed(3)} ${y1.toFixed(3)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`;
    };
    let cumulative = 0;
    const segments = buckets.map((bucket, index) => {
      const angle = ((Number(bucket.value || 0) / total) * (2 * Math.PI));
      const segment = { bucket, startAngle: cumulative, endAngle: cumulative + angle, color: STRATEGY_COLORS[index % STRATEGY_COLORS.length] };
      cumulative += angle;
      return segment;
    });

    return html`
      <div class="donut-section">
        <div class="donut-wrap">
          <svg viewBox="0 0 160 160" width="160" height="160">
            <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#141620" stroke-width="${SW}"></circle>
            ${segments.map((segment) => {
              const path = arc(segment.startAngle, segment.endAngle);
              if (!path) return '';
              return svg`<path d="${path}" fill="none" stroke="${segment.color}" stroke-width="${SW}" stroke-linecap="round"></path>`;
            })}
            <text x="${CX}" y="${CY - 8}" text-anchor="middle" fill="#e8eaf2" font-family="JetBrains Mono, monospace" font-size="15" font-weight="700">${productivePct}%</text>
            <text x="${CX}" y="${CY + 7}" text-anchor="middle" fill="#565a6e" font-family="Inter, sans-serif" font-size="9" letter-spacing="0.1em">${this._t('PRODUCTIVO', 'PRODUCTIVE')}</text>
            <text x="${CX}" y="${CY + 20}" text-anchor="middle" fill="#9195a8" font-family="JetBrains Mono, monospace" font-size="9">${fmt.usd(productive)}</text>
          </svg>
        </div>
        <div class="donut-legend">
          ${buckets.map((bucket, index) => html`
            <div class="legend-row">
              <div class="legend-dot" style="background:${STRATEGY_COLORS[index % STRATEGY_COLORS.length]}"></div>
              <span class="legend-label">${bucket.label}</span>
              <span class="legend-pct">${Number(bucket.pct || 0).toFixed(1)}%</span>
              <span class="legend-val">${fmt.usd(Number(bucket.value || 0))}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  _renderTickerRanked() {
    const tickers = Array.isArray(this._data?.byTicker) ? this._data.byTicker : [];
    const maxPct = Math.max(1, ...tickers.map((item) => Number(item.pct || 0)));
    return html`
      <div class="ranked-list">
        ${tickers.map((ticker, index) => html`
          <div class="ranked-row">
            <span class="rank-num">${index + 1}</span>
            <div class="rank-dot" style="background:${index === 0 ? '#f5a623' : index === 1 ? '#5b8def' : '#22d3a0'}"></div>
            <span class="rank-label">${ticker.ticker}</span>
            <div class="rank-bar-wrap"><div class="rank-bar-bg"><div class="rank-bar-fill" style="width:${((Number(ticker.pct || 0) / maxPct) * 100).toFixed(1)}%;background:${index === 0 ? '#f5a623' : '#5b8def'}"></div></div></div>
            <span class="rank-pct">${Number(ticker.pct || 0).toFixed(1)}%</span>
            <span class="rank-val">${fmt.usd(Number(ticker.value || 0))}</span>
          </div>
        `)}
      </div>
    `;
  }

  _renderRisk() {
    const riskColors = { 'Low Risk': '#22d3a0', 'Medium Risk': '#f5a623', 'High Risk': '#f04a5e', 'No Risk': '#5a5f75' };
    const rows = Array.isArray(this._data?.byRisk) ? this._data.byRisk : [];
    const maxVal = Math.max(1, ...rows.map((item) => Number(item.value || 0)));
    return html`
      ${rows.map((risk) => html`
        <div class="risk-row">
          <div class="risk-dot" style="background:${riskColors[risk.label] || '#5a5f75'}"></div>
          <span class="risk-label">${risk.label}</span>
          <div class="risk-bar-wrap"><div class="rank-bar-bg"><div class="rank-bar-fill" style="width:${((Number(risk.value || 0) / maxVal) * 100).toFixed(1)}%;background:${riskColors[risk.label] || '#5a5f75'}"></div></div></div>
          <span class="rank-pct">${Number(risk.pct || 0).toFixed(1)}%</span>
          <span class="rank-val">${fmt.usd(Number(risk.value || 0))}</span>
        </div>
      `)}
    `;
  }

  _renderMonthlyHistory() {
    const rows = this._getMonthlyRows();
    return html`
      <div class="monthly-list">
        ${rows.map((row) => html`
          <div class="monthly-row">
            <div class="monthly-month">${row.label || row.month || '—'}</div>
            <div>
              <div class="monthly-metric-label">${this._t('Capital', 'Capital')}</div>
              <div class="monthly-metric-value">${fmt.usd(Number(row.totalMoney || 0), 0)}</div>
            </div>
            <div>
              <div class="monthly-metric-label">${this._t('Revenue acum.', 'Revenue acc.')}</div>
              <div class="monthly-metric-value">${fmt.pnl(Number(row.revenueAccumulated || 0), 2)}</div>
            </div>
            <div>
              <div class="monthly-metric-label">${this._t('Cambio mensual', 'Monthly change')}</div>
              <div class="monthly-metric-value">${fmt.pnl(Number(row.monthRevenue || 0), 2)} · ${fmt.pct(Number(row.monthRoiPct || 0), 2)}</div>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  _renderMonthlyChart() {
    const rows = this._getMonthlyRows();
    if (!rows.length) return '';
    const W = 640;
    const H = 220;
    const PAD = { top: 20, right: 16, bottom: 36, left: 34 };
    const cW = W - PAD.left - PAD.right;
    const cH = H - PAD.top - PAD.bottom;
    const totals = rows.map((row) => Number(row.totalMoney || 0));
    const maxY = Math.max(1, ...totals);
    const yFor = (value) => PAD.top + cH - ((value / maxY) * cH);
    const xFor = (index) => PAD.left + ((index + 0.5) * (cW / Math.max(1, rows.length)));
    const barW = Math.max(28, Math.min(46, cW / Math.max(1, rows.length * 1.85)));
    const hoverIndex = this._monthlyHoverIndex >= 0 ? Math.min(this._monthlyHoverIndex, rows.length - 1) : rows.length - 1;
    const hoverRow = rows[hoverIndex];
    const hoverX = xFor(hoverIndex);
    const tooltipLeft = `${(hoverIndex / Math.max(1, rows.length - 1)) * 100}%`;

    return html`
      <div class="monthly-data-bar">
        <div class="mdb-period">${hoverRow?.label || hoverRow?.month || '—'}</div>
        <div class="mdb-group">
          <span class="mdb-label">${this._t('Capital', 'Capital')}</span>
          <span class="mdb-value">${fmt.usd(Number(hoverRow?.totalMoney || 0), 0)}</span>
        </div>
        <div class="mdb-group">
          <span class="mdb-label">${this._t('Rev. acum.', 'Rev. acc.')}</span>
          <span class="mdb-value ${Number(hoverRow?.revenueAccumulated || 0) >= 0 ? 'pos' : 'neg'}">${fmt.pnl(Number(hoverRow?.revenueAccumulated || 0), 2)}</span>
        </div>
        <div class="mdb-group">
          <span class="mdb-label">${this._t('Cambio', 'Change')}</span>
          <span class="mdb-value ${Number(hoverRow?.monthRevenue || 0) >= 0 ? 'pos' : 'neg'}">${fmt.pnl(Number(hoverRow?.monthRevenue || 0), 2)} · ${fmt.pct(Number(hoverRow?.monthRoiPct || 0), 2)}</span>
        </div>
      </div>
      <div class="monthly-chart-wrap" @mousemove=${this._setMonthlyHover} @mouseleave=${() => { this._monthlyHoverIndex = -1; }}>
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
          ${svg`<line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${H - PAD.bottom}" stroke="#2b3044" stroke-width="1.15"></line>`}
          ${svg`<line x1="${PAD.left}" y1="${H - PAD.bottom}" x2="${W - PAD.right}" y2="${H - PAD.bottom}" stroke="#2b3044" stroke-width="1.15"></line>`}
          ${[0.25, 0.5, 0.75, 1].map((ratio) => svg`
            <line x1="${PAD.left}" y1="${(PAD.top + cH - (cH * ratio)).toFixed(1)}" x2="${W - PAD.right}" y2="${(PAD.top + cH - (cH * ratio)).toFixed(1)}" stroke="#1f2130" stroke-width="1" stroke-dasharray="3 4"></line>
          `)}
          ${[0, 0.5, 1].map((ratio) => {
            const value = maxY * ratio;
            const y = PAD.top + cH - (cH * ratio);
            return svg`
              <text x="${(PAD.left - 8).toFixed(1)}" y="${(y + 3).toFixed(1)}" fill="#6d7287" font-size="8.5" font-family="JetBrains Mono, monospace" text-anchor="end">
                ${fmt.usd(value, 0)}
              </text>
            `;
          })}
          ${totals.map((value, index) => {
            const x = xFor(index) - (barW / 2);
            const y = yFor(value);
            const h = Math.max(4, (PAD.top + cH) - y);
            const active = index === hoverIndex;
            return svg`
              <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="6" fill="${active ? '#6f82ff' : 'rgba(111,130,255,0.82)'}"></rect>
              <text x="${xFor(index).toFixed(1)}" y="${(y - 8).toFixed(1)}" fill="${active ? '#e8eaf2' : '#9195a8'}" font-size="9" font-family="JetBrains Mono, monospace" text-anchor="middle">
                ${fmt.usd(value, 0)}
              </text>
            `;
          })}
          ${svg`<line x1="${hoverX.toFixed(1)}" y1="${PAD.top}" x2="${hoverX.toFixed(1)}" y2="${H - PAD.bottom}" stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-dasharray="4 4"></line>`}
          ${rows.map((row, index) => svg`
            <text x="${xFor(index).toFixed(1)}" y="${(H - 8).toFixed(1)}" fill="#6d7287" font-size="9" font-family="Inter, sans-serif" text-anchor="middle">${row.label || row.month || index + 1}</text>
          `)}
        </svg>
      </div>
      <div class="monthly-chart-note">
        <span>${this._t('Escala mensual del capital total por cierre', 'Monthly total-capital close scale')}</span>
        <span>${this._t('Monto sobre cada barra', 'Value on top of each bar')}</span>
      </div>
    `;
  }

  _renderBenchmarks() {
    const rows = Array.isArray(this._data?.monthlyHistory) ? this._data.monthlyHistory : [];
    const current = rows.at(-1) || {};
    const minersRoiPct = Number(current.minersRoiPct || 0);
    const fixedMonthlyPct = Number(this._data?.summary?.fixedIncomeMonthlyPct || 0);
    const totalMoney = Number(current.totalMoney || this._data?.summary?.totalCapitalVisible || 0);
    const minerGain = Number(current.revenueAccumulated || this._data?.summary?.revenueAccumulated || 0);
    const fixedEquivalent = Number(current.fixedEquivalent || this._data?.summary?.fixedEquivalentTotalCapital || 0);
    const spreadPct = minersRoiPct - fixedMonthlyPct;
    const spreadUsdt = minerGain - fixedEquivalent;

    const cards = [
      {
        label: this._t('Green bar: miners to date', 'Green bar: miners to date'),
        value: `${fmt.pnl(minerGain, 2)} · ${fmt.pct(minersRoiPct, 2)}`,
        note: `${this._t('closeable miner gain sobre', 'closeable miner gain over')} ${fmt.usd(totalMoney, 0)}`,
      },
      {
        label: this._t('Fixed income equivalent', 'Fixed income equivalent'),
        value: `${fmt.usd(fixedEquivalent, 2)} · ${fmt.pct(fixedMonthlyPct, 2)}`,
        note: `${Number(this._data?.summary?.fixedIncomeAnnualPct || 0).toFixed(1)}% APR ${this._t('llevado a tasa mensual', 'converted to monthly rate')}`,
      },
      {
        label: this._t('Miners vs fixed', 'Miners vs fixed'),
        value: fmt.pct(spreadPct, 2),
        note: `${spreadUsdt >= 0 ? this._t('adelante por', 'ahead by') : this._t('atrás por', 'behind by')} ${fmt.usd(Math.abs(spreadUsdt), 2)}`,
      },
    ];

    return html`
      <div class="benchmark-grid">
        ${cards.map((card) => html`
          <div class="snapshot-card">
            <div class="snapshot-label">${card.label}</div>
            <div class="snapshot-value">${card.value}</div>
            <div class="snapshot-note">${card.note}</div>
          </div>
        `)}
      </div>
    `;
  }

  _renderBtcDca() {
    const dca = this._data?.btcDca || {};
    const cards = [
      {
        label: this._t('BTC bought this month', 'BTC bought this month'),
        value: fmt.usd(Number(dca.currentUsdt || 0), 2),
        note: `${fmt.number(Number(dca.currentBtc || 0), 8)} BTC · ${Number(dca.currentCount || 0)} ${this._t('compras', 'buys')}`,
      },
      {
        label: this._t('BTC buy remaining', 'BTC buy remaining'),
        value: fmt.usd(Number(dca.remainingUsdt || 0), 2),
        note: `${fmt.usd(Number(dca.budget || 0), 2)} ${this._t('presupuesto mensual', 'monthly budget')}`,
      },
      {
        label: this._t('BTC month average', 'BTC month average'),
        value: dca.currentAvg ? fmt.usd(Number(dca.currentAvg || 0), 2) : '—',
        note: `${this._t('mes', 'month')} ${dca.currentMonth || '—'}`,
      },
      {
        label: this._t('Monthly DCA edge', 'Monthly DCA edge'),
        value: dca.dcaEdge === null || dca.dcaEdge === undefined ? '—' : fmt.pct(Number(dca.dcaEdge || 0), 2),
        note: dca.previousAvg ? `${this._t('vs promedio previo', 'vs prior avg')} ${fmt.usd(Number(dca.previousAvg || 0), 2)}` : this._t('sin promedio previo', 'no prior average'),
      },
      {
        label: this._t('3M DCA edge', '3M DCA edge'),
        value: dca.dcaEdge3m === null || dca.dcaEdge3m === undefined ? '—' : fmt.pct(Number(dca.dcaEdge3m || 0), 2),
        note: dca.previous3Avg ? `${this._t('vs 3M avg', 'vs 3M avg')} ${fmt.usd(Number(dca.previous3Avg || 0), 2)} · ${Number(dca.previous3Count || 0)} ${this._t('compras', 'buys')}` : this._t('sin 3M previos', 'no previous 3M buys'),
      },
    ];

    return html`
      <div class="dca-grid">
        ${cards.map((card) => html`
          <div class="snapshot-card">
            <div class="snapshot-label">${card.label}</div>
            <div class="snapshot-value">${card.value}</div>
            <div class="snapshot-note">${card.note}</div>
          </div>
        `)}
      </div>
    `;
  }

  _renderAccountBreakdown() {
    const breakdown = this._data?.accountBreakdown || {};
    const cards = [
      {
        label: this._t('Estimated equity', 'Estimated equity'),
        value: fmt.usd(Number(breakdown.estimatedEquity || 0), 2),
        note: this._t('wallet + user-funded miner margin', 'wallet + user-funded miner margin'),
      },
      {
        label: this._t('Other assets', 'Other assets'),
        value: fmt.usd(Number(breakdown.otherAssetsValue || 0), 2),
        note: this._t('spot assets fuera de USDT/BTC', 'spot assets outside USDT/BTC'),
      },
      {
        label: this._t('BTC Core value', 'BTC Core value'),
        value: fmt.usd(Number(breakdown.btcCoreValue || 0), 2),
        note: this._t('ledger BTC o wallet BTC, el mayor', 'max of BTC ledger and BTC wallet'),
      },
      {
        label: this._t('USDT wallet', 'USDT wallet'),
        value: fmt.usd(Number(breakdown.walletUsdtTotal || breakdown.freeUsdt || 0), 2),
        note: `${this._t('libre', 'free')} ${fmt.usd(Number(breakdown.freeUsdt || 0), 2)}`,
      },
      {
        label: this._t('Miner margin', 'Miner margin'),
        value: fmt.usd(Number(breakdown.minerMargin || 0), 2),
        note: this._t('capital propio desplegado en mineros', 'user-funded capital deployed in miners'),
      },
      {
        label: this._t('Promo margin', 'Promo margin'),
        value: fmt.usd(Number(breakdown.promoMargin || 0), 2),
        note: this._t('monitorizado pero fuera de capital propio', 'monitored but excluded from own capital'),
      },
    ];
    return html`
      <div class="snapshot-grid">
        ${cards.map((card) => html`
          <div class="snapshot-card">
            <div class="snapshot-label">${card.label}</div>
            <div class="snapshot-value">${card.value}</div>
            <div class="snapshot-note">${card.note}</div>
          </div>
        `)}
      </div>
    `;
  }

  _renderPortfolioAssets() {
    const assets = Array.isArray(this._data?.portfolioAssets) ? this._data.portfolioAssets : [];
    if (!assets.length) {
      return html`<empty-view label="${this._t('Todavía no hay activos spot visibles en Pionex', 'No visible spot assets from Pionex yet')}"></empty-view>`;
    }
    const donutAssets = assets.slice(0, 6);
    const totalUsd = assets.reduce((sum, item) => sum + Number(item.usdValue || 0), 0) || 1;
    const topAsset = assets[0];
    const allocationItems = donutAssets.map((asset, index) => ({
      label: asset.coin,
      value: Number(asset.usdValue || 0),
      pct: Number(asset.proportionPct || 0),
      color: STRATEGY_COLORS[index % STRATEGY_COLORS.length],
    }));

    return html`
      <div class="portfolio-grid">
        <div class="panel" style="padding:var(--space-4)">
          <div class="panel-title">${this._t('Distribución spot en Pionex', 'Pionex spot distribution')}</div>
          <div class="panel-sub">${fmt.usd(Number(this._data?.summary?.reportedBalanceUsd || totalUsd), 2)} ${this._t('reportados por balance', 'reported by account balance')}</div>
          <div class="portfolio-summary-grid">
            <div class="portfolio-summary-card">
              <div class="portfolio-summary-label">${this._t('Activos detectados', 'Detected assets')}</div>
              <div class="portfolio-summary-value">${assets.length}</div>
              <div class="portfolio-summary-sub">${this._t('monedas con valor visible en la cuenta', 'coins with visible value in the account')}</div>
            </div>
            <div class="portfolio-summary-card">
              <div class="portfolio-summary-label">${this._t('Mayor posición', 'Largest position')}</div>
              <div class="portfolio-summary-value">${topAsset?.coin || '—'}</div>
              <div class="portfolio-summary-sub">${topAsset ? `${fmt.pctPlain(Number(topAsset.proportionPct || 0), 2)} · ${fmt.usd(Number(topAsset.usdValue || 0), 2)}` : '—'}</div>
            </div>
          </div>
          <allocation-chart .items=${allocationItems} .height=${22}></allocation-chart>
        </div>
        <div class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">${this._t('Portafolio de monedas', 'Coin portfolio')}</div>
              <div class="panel-sub">${this._t('monedas reales detectadas en el balance de Pionex', 'real coins detected from the Pionex balance')}</div>
            </div>
          </div>
          <div class="portfolio-table">
            <div class="portfolio-head">
              <div>${this._t('Coin', 'Coin')}</div>
              <div>${this._t('Cantidad', 'Quantity')}</div>
              <div>${this._t('Valor USD', 'USD value')}</div>
              <div>${this._t('Libre / congelado', 'Free / frozen')}</div>
              <div>${this._t('Proporción', 'Proportion')}</div>
            </div>
            ${assets.map((asset, index) => html`
              <div class="portfolio-row">
                <div class="portfolio-coin">
                  <span class="coin-dot" style="background:${STRATEGY_COLORS[index % STRATEGY_COLORS.length]}"></span>
                  <span>${asset.coin}</span>
                </div>
                <div class="portfolio-qty">${fmt.number(Number(asset.quantity || 0), 8)}</div>
                <div class="portfolio-value">${fmt.usd(Number(asset.usdValue || 0), 2)}</div>
                <div class="portfolio-freeze">${fmt.number(Number(asset.free || 0), 8)} / ${fmt.number(Number(asset.frozen || 0), 8)}</div>
                <div class="portfolio-pct">
                  <span>${fmt.pctPlain(Number(asset.proportionPct || 0), 2)}</span>
                  <span class="portfolio-pct-bar"><span class="portfolio-pct-fill" style="width:${Math.max(0, Math.min(100, Number(asset.proportionPct || 0)))}%;background:${STRATEGY_COLORS[index % STRATEGY_COLORS.length]}"></span></span>
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  _renderRecentEvents() {
    const events = Array.isArray(this._data?.recentCloseEvents) ? this._data.recentCloseEvents : [];
    if (!events.length) {
      return html`<empty-view label="${this._t('Todavía no hay eventos recientes de capital', 'No recent capital events yet')}"></empty-view>`;
    }
    return html`
      <div class="event-list">
        ${events.map((event) => html`
          <div class="event-item">
            <div class="event-top">
              <div class="event-symbol">${event.symbol || event.buOrderId || 'Event'}</div>
              <div class="event-time">${event.detectedAt ? fmt.datetime(event.detectedAt) : '—'}</div>
            </div>
            <div class="event-meta">
              <span>${this._t('Reason', 'Reason')}: ${event.closeReason || '—'}</span>
              <span>${this._t('Released', 'Released')}: ${fmt.usd(Number(event.releasedUsdtEstimate || 0), 2)}</span>
              <span>${this._t('PnL', 'PnL')}: ${fmt.pnl(Number(event.realizedPnlUsdt || 0), 2)}</span>
              <span>${this._t('Redeployed', 'Redeployed')}: ${event.redeployedWithinWindow ? this._t('sí', 'yes') : this._t('no', 'no')}</span>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  render() {
    const hasData = Boolean(
      (this._data?.history && this._data.history.length)
      || Object.keys(this._data?.summary || {}).length
      || (this._data?.portfolioAssets && this._data.portfolioAssets.length)
    );
    if (this._loading && !hasData) return html`<loading-view label="${this._t('Cargando capital', 'Loading capital')}"></loading-view>`;
    if (this._error && !hasData) return html`<error-view label="${this._t('Capital no disponible', 'Capital unavailable')}" .sub=${this._error}></error-view>`;

    const summary = this._data?.summary || {};
    const history = this._getHistory();
    const hoverIndex = this._capitalHoverIndex >= 0 ? Math.min(this._capitalHoverIndex, history.length - 1) : history.length - 1;
    const hoverPoint = history[hoverIndex];
    const totalCapital = Number(summary.totalCapitalVisible || 0);
    const productive = Number(summary.capitalMining || 0);
    const idle = Number(summary.capitalNotMining || 0);
    const policy = this._getRefreshPolicy();
    const autoSeconds = Math.round(policy.autoMs / 1000);
    const manualRefreshLeft = this._manualRefreshRemaining();

    return html`
      <div class="page">
        <div class="toolbar">
          <div class="toolbar-note">
            ${this._t('Corte:', 'As of:')} ${this._data?.asOf ? fmt.datetime(this._data.asOf) : '—'}
            · ${this._t('Plan', 'Plan')}: ${this._planTier.toUpperCase()}
            · ${this._t('Auto refresh', 'Auto refresh')}: ${autoSeconds}s
            ${policy.manual ? `· ${this._t('Manuales disponibles', 'Manuals available')}: ${manualRefreshLeft}/${policy.maxManual}` : ''}
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap">
            ${this._refreshing ? html`<div class="toolbar-status">${this._t('Sincronizando en segundo plano', 'Syncing in background')}</div>` : ''}
            ${this._error && hasData ? html`<div class="toolbar-note" style="color:var(--color-warning)">${this._error}</div>` : ''}
            ${policy.manual ? html`
              <button class="btn btn-ghost" @click=${() => this._load({ manual: true })}>${this._t('Actualizar', 'Refresh')}</button>
            ` : ''}
          </div>
        </div>

        ${this._renderPortfolioHero()}

        <div class="kpi-strip">
          <stat-card data-kpi="kpi-total" label="${this._t('Capital visible', 'Visible capital')}" value="${fmt.usd(totalCapital, 2)}" accent="neutral" mono></stat-card>
          <stat-card data-kpi="kpi-mining" label="${this._t('Capital mining', 'Capital mining')}" value="${fmt.usd(productive, 2)}" accent="positive" mono></stat-card>
          <stat-card data-kpi="kpi-idle" label="${this._t('Capital no mining', 'Capital not mining')}" value="${fmt.usd(idle, 2)}" accent="warning" mono></stat-card>
          <stat-card data-kpi="kpi-gain" label="${this._t('All miner gain', 'All miner gain')}" value="${fmt.pnl(Number(summary.allMinerGain || 0), 2)}" accent="${Number(summary.allMinerGain || 0) >= 0 ? 'positive' : 'negative'}" mono></stat-card>
          <stat-card data-kpi="kpi-roi" label="${this._t('Miner capital ROI', 'Miner capital ROI')}" value="${fmt.pct(Number(summary.minerCapitalRoiPct || 0), 2)}" accent="accent"></stat-card>
          <stat-card data-kpi="kpi-fixed" label="${this._t('Fixed equivalent', 'Fixed equivalent')}" value="${fmt.usd(Number(summary.fixedEquivalentMinerCapital || 0), 2)}" accent="neutral" mono></stat-card>
          <stat-card data-kpi="kpi-monthly" label="${this._t('Monthly closeable change', 'Monthly closeable change')}" value="${fmt.pnl(Number(summary.monthlyCloseablePnlChange || 0), 2)}" accent="${Number(summary.monthlyCloseablePnlChange || 0) >= 0 ? 'positive' : 'negative'}" mono></stat-card>
          <stat-card data-kpi="kpi-revenue" label="${this._t('Revenue accumulated', 'Revenue accumulated')}" value="${fmt.pnl(Number(summary.revenueAccumulated || 0), 2)}" accent="${Number(summary.revenueAccumulated || 0) >= 0 ? 'positive' : 'negative'}" mono></stat-card>
        </div>

        <div class="main-row">
          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">${this._t('Capital visible en el tiempo', 'Visible capital over time')}</div>
                <div class="panel-sub">${this._formatDateRange(history)} · ${this._historySnapshotLabel(history)} · ${this._range.toUpperCase()}</div>
              </div>
              <div class="chart-legend ${hoverPoint ? 'active' : ''}">
                ${hoverPoint ? html`
                  <div class="chart-legend-date">${fmt.date(hoverPoint.isoDate)}</div>
                  <div class="chart-legend-value">${fmt.usd(Number(hoverPoint.total || 0), 0)}</div>
                  <div class="chart-legend-pnl ${Number(hoverPoint.pnl || 0) >= 0 ? 'pos' : 'neg'}">${fmt.pnl(Number(hoverPoint.pnl || 0), 2)}</div>
                ` : html`<div class="chart-legend-hint">${this._t('↑ mueve el cursor sobre el gráfico', '↑ hover the chart')}</div>`}
              </div>
              <div class="range-tabs">
                ${['7d', '14d', '30d'].map((range) => html`
                  <div class="range-tab ${this._range === range ? 'active' : ''}" @click=${() => { this._range = range; this._capitalHoverIndex = -1; }}>${range}</div>
                `)}
              </div>
            </div>
            <div class="chart-wrap" @mousemove=${this._setCapitalHover} @mouseleave=${() => { this._capitalHoverIndex = -1; }}>
              ${this._renderAreaChart()}
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">${this._t('Por ticker', 'By ticker')}</div>
                <div class="panel-sub">${this._t('Capital visible por activo', 'Visible capital by asset')}</div>
              </div>
            </div>
            ${this._renderTickerRanked()}
          </div>
        </div>

        <div class="bottom-row">
          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">${this._t('Asignación de capital', 'Capital allocation')}</div>
                <div class="panel-sub">${this._t('Productivo vs no minando', 'Productive vs not mining')}</div>
              </div>
            </div>
            <div class="split-row">
              <div class="split-card prod">
                <div class="split-label">${this._t('Capital mining', 'Capital mining')}</div>
                <div class="split-val">${fmt.usd(productive, 0)}</div>
                <div class="split-sub">${totalCapital > 0 ? ((productive / totalCapital) * 100).toFixed(1) : '0.0'}% ${this._t('del total', 'of total')}</div>
              </div>
              <div class="split-card idle">
                <div class="split-label">${this._t('No mining', 'Not mining')}</div>
                <div class="split-val">${fmt.usd(idle, 0)}</div>
                <div class="split-sub">${totalCapital > 0 ? ((idle / totalCapital) * 100).toFixed(1) : '0.0'}% ${this._t('del total', 'of total')}</div>
              </div>
            </div>
            ${this._renderDonut()}
          </div>

          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">${this._t('Por nivel de riesgo', 'By risk level')}</div>
                <div class="panel-sub">${this._t('Exposición viva por bucket', 'Live exposure by bucket')}</div>
              </div>
            </div>
            ${this._renderRisk()}
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">${this._t('Capital and revenue snapshot', 'Capital and revenue snapshot')}</div>
              <div class="panel-sub">${this._t('equity, wallet, BTC core y otros activos', 'equity, wallet, BTC core, and other assets')}</div>
            </div>
          </div>
          ${this._renderAccountBreakdown()}
        </div>

        ${this._renderPortfolioAssets()}

        <div class="monthly-grid">
          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">${this._t('Capital mensual e ingresos', 'Monthly capital and revenue')}</div>
                <div class="panel-sub">${this._t('barras mensuales del capital con histórico importado si existe', 'monthly capital bars using imported history when available')}</div>
              </div>
              <div class="scale-tabs">
                ${[
                  { id: 'quarter', es: '3M', en: '3M' },
                  { id: 'semester', es: '6M', en: '6M' },
                  { id: 'annual', es: '12M', en: '12M' },
                ].map((scale) => html`
                  <div class="range-tab ${this._monthlyScale === scale.id ? 'active' : ''}" @click=${() => { this._monthlyScale = scale.id; this._monthlyHoverIndex = -1; }}>
                    ${this._lang === 'en' ? scale.en : scale.es}
                  </div>
                `)}
              </div>
            </div>
            ${this._renderMonthlyChart()}
            ${this._renderMonthlyHistory()}
          </div>

          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">${this._t('Recent capital events', 'Recent capital events')}</div>
                <div class="panel-sub">${this._t('cierres detectados y redeploy cercano', 'detected closes and nearby redeploy')}</div>
              </div>
            </div>
            ${this._renderRecentEvents()}
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">${this._t('Miners monthly ROI vs fixed income', 'Miners monthly ROI vs fixed income')}</div>
              <div class="panel-sub">${this._t('siguiente bloque funcional heredado del monolito', 'next functional block brought from the monolith')}</div>
            </div>
          </div>
          ${this._renderBenchmarks()}
        </div>

        <div class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">${this._t('BTC Core DCA', 'BTC Core DCA')}</div>
              <div class="panel-sub">${this._t('lectura de acumulación conectada a capital', 'accumulation readout connected into capital')}</div>
            </div>
          </div>
          ${this._renderBtcDca()}
        </div>
      </div>
    `;
  }
}

customElements.define('capital-view', CapitalView);
