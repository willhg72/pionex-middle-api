import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { fmt } from '../../utils/format.js';
import { domainState } from '../../utils/domain-state.js';
import { buttonStyles } from '../../styles/shared-styles.js';
import { minersService } from '../../services/miners.service.js';
import { getLanguage } from '../../services/i18n.js';
import { settingsService } from '../../services/settings.service.js';
import { store } from '../../state/store.js';

const DOMAIN = 'miners';
const MINERS_REFRESH_POLICY = {
  free: { autoMs: 15_000, manual: false, maxManual: 0, windowMs: 30_000 },
  pro: { autoMs: 10_000, manual: false, maxManual: 0, windowMs: 30_000 },
  premium: { autoMs: 5_000, manual: true, maxManual: 2, windowMs: 30_000 },
};
let minersViewCache = {
  data: null,
  balance: null,
  loaded: false,
};

class MinersView extends LitElement {
  static properties = {
    _data: { type: Object, state: true },
    _balance: { type: Object, state: true },
    _loading: { type: Boolean, state: true },
    _refreshing: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _filter: { type: String, state: true },
    _expandedId: { type: String, state: true },
    _details: { type: Object, state: true },
    _closeCtx: { type: Object, state: true },
    _regridCtx: { type: Object, state: true },
    _lang: { type: String, state: true },
    _planTier: { type: String, state: true },
    _nextAutoRefreshAt: { type: Number, state: true },
    _hasLoadedOnce: { type: Boolean, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .toolbar { display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center; justify-content: space-between; }
    .toolbar-left, .toolbar-right { display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center; }
    .toolbar-note { font-size: var(--text-xs); color: var(--color-text-muted); }
    .toolbar-status { font-size: var(--text-xs); color: var(--color-accent); }
    .hero { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-4); }
    .hero-main { display: flex; flex-direction: column; gap: var(--space-4); }
    .hero-summary { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-3); }
    .hero-glance {
      background: linear-gradient(140deg, rgba(91,141,239,.08) 0%, rgba(34,211,160,.04) 100%);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-lg);
      padding: 18px 20px;
    }
    .hero-eyebrow { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 6px; }
    .hero-value { font-family: var(--font-mono); font-size: 30px; line-height: 1; font-weight: var(--weight-bold); font-variant-numeric: tabular-nums slashed-zero; font-feature-settings: "tnum" 1, "zero" 1; }
    .hero-sub { margin-top: 6px; font-size: var(--text-sm); color: var(--color-text-secondary); }
    .hero-pills { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: var(--space-3); }
    .hero-pill {
      display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 999px;
      font-size: var(--text-xs); font-weight: var(--weight-semibold); font-family: var(--font-mono);
    }
    .hero-pill.ok { background: var(--color-positive-dim); color: var(--color-positive); }
    .hero-pill.warn { background: var(--color-warning-dim); color: var(--color-warning); }
    .hero-pill.danger { background: var(--color-negative-dim); color: var(--color-negative); }
    .hero-lanes { display: grid; gap: var(--space-2); }
    .lane {
      display: grid; grid-template-columns: 76px 1fr auto; gap: var(--space-3); align-items: center;
      padding: 10px 12px; border-radius: var(--radius-md); background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle);
    }
    .lane-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    .lane-bar { height: 8px; border-radius: 999px; background: var(--color-bg-panel); overflow: hidden; }
    .lane-fill { height: 100%; border-radius: 999px; }
    .lane-value { font-family: var(--font-mono); font-size: var(--text-xs); min-width: 42px; text-align: right; font-variant-numeric: tabular-nums slashed-zero; font-feature-settings: "tnum" 1, "zero" 1; }
    .kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--space-3); }
    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }
    .miners-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: var(--space-4); }
    .miner-card { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); overflow: hidden; }
    .miner-card.warning { border-left: 3px solid var(--color-warning); }
    .miner-card.danger { border-left: 3px solid var(--color-negative); }
    .miner-head { padding: var(--card-padding); cursor: pointer; display: flex; flex-direction: column; gap: var(--space-3); }
    .miner-head:hover { background: rgba(255,255,255,0.02); }
    .topline { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3); }
    .ticker { font-size: var(--text-lg); font-weight: var(--weight-bold); }
    .meta { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 3px; }
    .head-summary { display:flex; align-items:center; gap: var(--space-2); flex-wrap: wrap; justify-content: flex-end; }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 9px; border-radius: 999px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
    .badge.ok { background: var(--color-positive-dim); color: var(--color-positive); }
    .badge.warning { background: var(--color-warning-dim); color: var(--color-warning); }
    .badge.danger { background: var(--color-negative-dim); color: var(--color-negative); }
    .signal-badge { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); font-variant-numeric: tabular-nums slashed-zero; font-feature-settings: "tnum" 1, "zero" 1; }
    .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); }
    .metric { display: flex; flex-direction: column; gap: 2px; }
    .metric-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    .metric-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); font-variant-numeric: tabular-nums slashed-zero; font-feature-settings: "tnum" 1, "zero" 1; }
    .metric-value.pos { color: var(--color-positive); }
    .metric-value.neg { color: var(--color-negative); }
    .summary-strip { display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-2); }
    .summary-chip { padding: 10px; border-radius: var(--radius-md); background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle); }
    .summary-chip-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 4px; }
    .summary-chip-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums slashed-zero; font-feature-settings: "tnum" 1, "zero" 1; }
    .summary-chip-note { margin-top: 3px; font-size: var(--text-xs); color: var(--color-text-secondary); }
    .warning-banner { padding: 8px 10px; border-radius: var(--radius-md); background: var(--color-warning-dim); color: var(--color-warning); font-size: var(--text-xs); }
    .actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
    .actions .btn { flex: 1; min-width: 0; }
    .signal-row { display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-2); }
    .signal { padding: 10px; border-radius: var(--radius-md); background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle); }
    .signal.pass { border-color: rgba(34,211,160,0.28); background: rgba(34,211,160,0.08); }
    .signal.warn { border-color: rgba(245,166,35,0.28); background: rgba(245,166,35,0.08); }
    .signal.fail { border-color: rgba(240,74,94,0.28); background: rgba(240,74,94,0.08); }
    .signal-code { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-primary); }
    .signal-name { margin-top: 3px; font-size: 10px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .signal-value { margin-top: 6px; font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .signal-detail { margin-top: 4px; font-size: var(--text-xs); color: var(--color-text-secondary); }
    .range-track { display:flex; flex-direction:column; gap: 8px; }
    .range-track-top { display:flex; justify-content:space-between; gap:12px; font-size: var(--text-xs); color: var(--color-text-muted); }
    .range-bar { position: relative; height: 12px; border-radius: 999px; background: linear-gradient(90deg, rgba(240,74,94,0.18) 0%, rgba(245,166,35,0.18) 15%, rgba(34,211,160,0.2) 50%, rgba(245,166,35,0.18) 85%, rgba(240,74,94,0.18) 100%); overflow:hidden; border: 1px solid var(--color-border-subtle); }
    .range-marker { position:absolute; top:-2px; width: 2px; height: 16px; background: #e8eaf2; box-shadow: 0 0 0 2px rgba(255,255,255,0.12); }
    .range-marker::after { content:''; position:absolute; top:-3px; left:-4px; width:10px; height:10px; border-radius:50%; background:#e8eaf2; }
    .range-caption { font-size: var(--text-xs); color: var(--color-text-secondary); }
    .expanded { border-top: 1px solid var(--color-border-subtle); padding: var(--card-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-2); }
    .detail { padding: 10px; border-radius: var(--radius-md); background: var(--color-bg-elevated); }
    .detail-title { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 4px; }
    .detail-value { font-family: var(--font-mono); font-size: var(--text-sm); }
    .section { display: flex; flex-direction: column; gap: var(--space-2); }
    .section-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .mini-list { display: flex; flex-direction: column; gap: 8px; }
    .mini-item { padding: 10px; border-radius: var(--radius-md); background: var(--color-bg-elevated); font-size: var(--text-xs); color: var(--color-text-secondary); }
    .mini-item strong { color: var(--color-text-primary); }
    .chart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.86); display: flex; align-items: center; justify-content: center; z-index: 210; padding: 16px; }
    .chart-modal { display: flex; width: 96vw; max-width: 1420px; height: 88vh; background: var(--color-bg-panel); border: 1px solid var(--color-border-default); border-radius: var(--radius-xl); overflow: hidden; }
    .chart-left { flex: 1; display: flex; flex-direction: column; border-right: 1px solid var(--color-border-subtle); }
    .chart-right { width: 380px; display: flex; flex-direction: column; }
    .chart-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--color-border-subtle); background: var(--color-bg-card); }
    .tv-frame { flex: 1; border: none; width: 100%; }
    .exec-body { padding: 18px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
    .exec-row { display: flex; justify-content: space-between; gap: 12px; font-size: var(--text-sm); padding-bottom: 8px; border-bottom: 1px solid var(--color-border-subtle); }
    .exec-row span:last-child { font-family: var(--font-mono); text-align: right; }
    .exec-actions { margin-top: auto; display: flex; gap: 8px; padding: 14px 18px; border-top: 1px solid var(--color-border-subtle); }
    .exec-actions .btn { flex: 1; }
    .hint { font-size: var(--text-xs); color: var(--color-text-muted); }
    @media (max-width: 900px) {
      .hero { grid-template-columns: 1fr; }
      .hero-summary { grid-template-columns: 1fr; }
      .metrics { grid-template-columns: repeat(2, 1fr); }
      .summary-strip { grid-template-columns: 1fr; }
      .signal-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .detail-grid { grid-template-columns: 1fr; }
      .chart-modal { flex-direction: column; height: 94dvh; }
      .chart-left { min-height: 280px; border-right: 0; border-bottom: 1px solid var(--color-border-subtle); }
      .chart-right { width: 100%; }
    }
  `];

  constructor() {
    super();
    this._data = minersViewCache.data || { miners: [], summary: { active: 0, totalCapital: 0, openPnl: 0, dailyPnl: 0, warnings: 0, avgGridGap: '0.00' } };
    this._balance = minersViewCache.balance || null;
    this._loading = !minersViewCache.loaded;
    this._refreshing = false;
    this._error = '';
    this._filter = domainState.load(DOMAIN).filter || 'all';
    this._expandedId = '';
    this._details = {};
    this._closeCtx = null;
    this._regridCtx = null;
    this._lang = getLanguage();
    this._planTier = 'free';
    this._nextAutoRefreshAt = 0;
    this._manualRefreshHits = [];
    this._refreshTimer = null;
    this._hasLoadedOnce = Boolean(minersViewCache.loaded);
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
    return MINERS_REFRESH_POLICY[this._planTier] || MINERS_REFRESH_POLICY.free;
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
    const miners = Array.isArray(this._data?.miners) ? this._data.miners : [];
    const warningCount = miners.filter((item) => item.risk !== 'ok').length;
    const riskScore = miners.length
      ? Math.round((miners.filter((item) => item.risk === 'danger').length * 100 + miners.filter((item) => item.risk === 'warning').length * 55) / miners.length)
      : 0;
    store.setState({
      activeMinersCount: miners.length,
      minerWarnings: warningCount,
    });
    this.dispatchEvent(new CustomEvent('capintel-shell-metrics', {
      bubbles: true,
      composed: true,
      detail: {
        route: 'miners',
        metrics: {
          totalCapital: Number(summary.totalCapital || 0),
          freeUsdt: Number(this._balance?.usdt?.free || 0),
          openPnl: Number(summary.openPnl || 0),
          monthlyPnl: Number(summary.dailyPnl || 0),
          riskScore,
        },
      },
    }));
  }

  async _load({ auto = false, manual = false } = {}) {
    const hasData = this._hasLoadedOnce;
    if (manual) {
      const policy = this._getRefreshPolicy();
      if (!policy.manual) return;
      const remaining = this._manualRefreshRemaining();
      if (remaining <= 0) {
        window.toast?.(this._t('Limite manual alcanzado: maximo 2 refresh en 30 segundos.', 'Manual limit reached: max 2 refreshes in 30 seconds.'), { type: 'warning' });
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
      const [data, balance] = await Promise.all([
        minersService.getMiners(),
        minersService.getBalance().catch(() => null),
      ]);
      this._data = data;
      this._balance = balance;
      minersViewCache = {
        data,
        balance,
        loaded: true,
      };
      this._hasLoadedOnce = true;
      this._emitShellMetrics();
    } catch (error) {
      const message = error?.data?.detail || error?.message || this._t('No se pudieron cargar los mineros activos.', 'Could not load active miners.');
      if (hasData) {
        window.toast?.(message, { type: auto ? 'warning' : 'error' });
      } else {
        this._error = message;
      }
    } finally {
      this._loading = false;
      this._refreshing = false;
      this._scheduleRefresh();
    }
  }

  _setFilter(value) {
    this._filter = value;
    domainState.save(DOMAIN, { filter: value });
  }

  _filteredMiners() {
    const miners = Array.isArray(this._data?.miners) ? this._data.miners : [];
    if (this._filter === 'warnings') return miners.filter((item) => item.risk !== 'ok');
    if (this._filter === 'danger') return miners.filter((item) => item.risk === 'danger');
    return miners;
  }

  _filterCounts() {
    const miners = Array.isArray(this._data?.miners) ? this._data.miners : [];
    return {
      all: miners.length,
      warnings: miners.filter((item) => item.risk !== 'ok').length,
      danger: miners.filter((item) => item.risk === 'danger').length,
    };
  }

  _heroSummary() {
    const miners = Array.isArray(this._data?.miners) ? this._data.miners : [];
    const counts = this._filterCounts();
    const totalTarget = miners.reduce((sum, miner) => sum + Number(miner.targetDailyUsdt || 0), 0);
    const avgInventory = miners.length
      ? miners.reduce((sum, miner) => sum + Number(miner.inventoryRatio || 0), 0) / miners.length
      : 0;
    const avgRange = miners.length
      ? miners.reduce((sum, miner) => sum + Number(miner.rangePosition || 0), 0) / miners.length
      : 0;
    return {
      counts,
      totalTarget,
      avgInventory,
      avgRange,
      healthy: Math.max(0, counts.all - counts.warnings),
    };
  }

  _renderHeroLanes() {
    const hero = this._heroSummary();
    const counts = hero.counts;
    const total = Math.max(1, counts.all);
    const lanes = [
      { label: this._t('Salud', 'Health'), value: `${hero.healthy}/${counts.all}`, pct: (hero.healthy / total) * 100, color: 'var(--color-positive)' },
      { label: this._t('Alertas', 'Warnings'), value: `${counts.warnings}/${counts.all}`, pct: (counts.warnings / total) * 100, color: 'var(--color-warning)' },
      { label: this._t('Criticos', 'Critical'), value: `${counts.danger}/${counts.all}`, pct: (counts.danger / total) * 100, color: 'var(--color-negative)' },
    ];
    return html`
      <div class="hero-lanes">
        ${lanes.map((lane) => html`
          <div class="lane">
            <div class="lane-label">${lane.label}</div>
            <div class="lane-bar"><div class="lane-fill" style="width:${lane.pct}%;background:${lane.color}"></div></div>
            <div class="lane-value">${lane.value}</div>
          </div>
        `)}
      </div>
    `;
  }

  _signalSet(miner) {
    const rangePosition = Number(miner.rangePosition);
    const inventoryRatio = Number(miner.inventoryRatio);
    const closePnl = Number(miner.openPnl || 0);
    const gridPnl = Number(miner.dailyPnl || 0);
    const targetDaily = Number(miner.targetDailyUsdt || 0);
    const coverageRatio = gridPnl > 0 ? closePnl / Math.max(gridPnl, 0.0001) : null;
    const rangeStatus = !Number.isFinite(rangePosition)
      ? { code: 'R', name: this._t('Rango', 'Range'), status: 'warn', value: '—', detail: this._t('Posición de rango no disponible.', 'Range position not available.') }
      : rangePosition >= 0.15 && rangePosition <= 0.85
        ? { code: 'R', name: this._t('Rango', 'Range'), status: 'pass', value: fmt.pctPlain(rangePosition * 100, 1), detail: this._t('Precio bien ubicado dentro del rango.', 'Price is well positioned inside the range.') }
        : rangePosition >= 0 && rangePosition <= 1
          ? { code: 'R', name: this._t('Rango', 'Range'), status: 'warn', value: fmt.pctPlain(rangePosition * 100, 1), detail: this._t('Precio cerca de un borde del rango.', 'Price is near a range edge.') }
          : { code: 'R', name: this._t('Rango', 'Range'), status: 'fail', value: fmt.pctPlain(rangePosition * 100, 1), detail: this._t('Precio fuera del rango del minero.', 'Price is outside the miner range.') };
    const coverageStatus = !Number.isFinite(coverageRatio)
      ? { code: 'C', name: this._t('Cobertura', 'Coverage'), status: 'warn', value: '—', detail: this._t('No hay suficiente información de grid para estimar cobertura.', 'Not enough grid information to estimate coverage.') }
      : coverageRatio >= 2
        ? { code: 'C', name: this._t('Cobertura', 'Coverage'), status: 'pass', value: `${coverageRatio.toFixed(2)}x`, detail: this._t('La ganancia de cierre tiene colchón sobre el grid.', 'Closeable gain has room over the grid profit.') }
        : coverageRatio >= 1
          ? { code: 'C', name: this._t('Cobertura', 'Coverage'), status: 'warn', value: `${coverageRatio.toFixed(2)}x`, detail: this._t('La cobertura existe, pero es delgada.', 'Coverage exists, but it is thin.') }
          : { code: 'C', name: this._t('Cobertura', 'Coverage'), status: 'fail', value: `${coverageRatio.toFixed(2)}x`, detail: this._t('La cobertura es débil frente al riesgo abierto.', 'Coverage is weak versus open risk.') };
    const inventoryStatus = !Number.isFinite(inventoryRatio)
      ? { code: 'I', name: this._t('Inventario', 'Inventory'), status: 'warn', value: '—', detail: this._t('Inventario no disponible.', 'Inventory not available.') }
      : inventoryRatio <= 0.05
        ? { code: 'I', name: this._t('Inventario', 'Inventory'), status: 'pass', value: fmt.pctPlain(inventoryRatio * 100, 1), detail: this._t('Inventario limpio.', 'Inventory is clean.') }
        : inventoryRatio <= 0.10
          ? { code: 'I', name: this._t('Inventario', 'Inventory'), status: 'warn', value: fmt.pctPlain(inventoryRatio * 100, 1), detail: this._t('Inventario elevado, necesita vigilancia.', 'Inventory is elevated and needs monitoring.') }
          : { code: 'I', name: this._t('Inventario', 'Inventory'), status: 'fail', value: fmt.pctPlain(inventoryRatio * 100, 1), detail: this._t('Inventario pesado para este capital.', 'Inventory is heavy for this capital.') };
    const stressValue = closePnl - Math.max(0, targetDaily);
    const stressStatus = stressValue > 0
      ? { code: 'S', name: this._t('Stress', 'Stress'), status: 'pass', value: fmt.pnl(stressValue, 2), detail: this._t('El minero conserva colchón sobre su meta diaria.', 'The miner still has a buffer over its daily target.') }
      : stressValue > -1
        ? { code: 'S', name: this._t('Stress', 'Stress'), status: 'warn', value: fmt.pnl(stressValue, 2), detail: this._t('El colchón es pequeño; conviene vigilarlo.', 'The buffer is small and should be monitored.') }
        : { code: 'S', name: this._t('Stress', 'Stress'), status: 'fail', value: fmt.pnl(stressValue, 2), detail: this._t('El cierre ya no cubre cómodamente el objetivo diario.', 'The closeable PnL no longer comfortably covers the daily target.') };
    return [rangeStatus, coverageStatus, inventoryStatus, stressStatus];
  }

  _renderSignalSet(miner) {
    return html`
      <div class="signal-row">
        ${this._signalSet(miner).map((signal) => html`
          <div class="signal ${signal.status}">
            <div class="signal-code">${signal.code}</div>
            <div class="signal-name">${signal.name}</div>
            <div class="signal-value">${signal.value}</div>
            <div class="signal-detail">${signal.detail}</div>
          </div>
        `)}
      </div>
    `;
  }

  _renderRangeTrack(miner) {
    const position = Number(miner.rangePosition);
    const left = Number.isFinite(position) ? Math.max(0, Math.min(100, position * 100)) : 0;
    return html`
      <div class="range-track">
        <div class="range-track-top">
          <span>${this._t('Bajo', 'Low')} ${fmt.usd(Number(miner.gridLow || 0), 2)}</span>
          <span>${this._t('Actual', 'Current')} ${fmt.usd(Number(miner.currentPrice || 0), 2)}</span>
          <span>${this._t('Alto', 'High')} ${fmt.usd(Number(miner.gridHigh || 0), 2)}</span>
        </div>
        <div class="range-bar">
          <div class="range-marker" style="left: calc(${left}% - 1px)"></div>
        </div>
        <div class="range-caption">
          ${Number.isFinite(position)
            ? this._t(`Precio al ${left.toFixed(1)}% del rango. ${miner.rangeHealth || ''}`, `Price at ${left.toFixed(1)}% of range. ${miner.rangeHealth || ''}`)
            : this._t('No hay posición de rango disponible.', 'No range position is available.')}
        </div>
      </div>
    `;
  }

  _renderCollapsedSummary(miner) {
    const signals = this._signalSet(miner);
    const range = signals.find((item) => item.code === 'R');
    const coverage = signals.find((item) => item.code === 'C');
    const inventory = signals.find((item) => item.code === 'I');
    return html`
      <div class="summary-strip">
        <div class="summary-chip">
          <div class="summary-chip-label">${this._t('Rango y cierre', 'Range and close')}</div>
          <div class="summary-chip-value">${range?.value || '-'} · ${fmt.pnl(Number(miner.openPnl || 0), 2)}</div>
          <div class="summary-chip-note">${miner.rangeHealth || this._t('sin lectura', 'no reading')}</div>
        </div>
        <div class="summary-chip">
          <div class="summary-chip-label">${this._t('Cobertura real', 'Real coverage')}</div>
          <div class="summary-chip-value">${coverage?.value || '-'} · ${fmt.pnl(Number(miner.dailyPnl || 0), 2)}</div>
          <div class="summary-chip-note">${this._t('grid del dia y colchon de salida', 'daily grid and close buffer')}</div>
        </div>
        <div class="summary-chip">
          <div class="summary-chip-label">${this._t('Inventario y cosecha', 'Inventory and harvest')}</div>
          <div class="summary-chip-value">${inventory?.value || '-'} · ${fmt.usd(Number(miner.harvestPolicy?.suggestedAmountUsdt || 0), 2)}</div>
          <div class="summary-chip-note">${miner.harvestPolicy?.action || this._t('sin accion recomendada', 'no suggested action')}</div>
        </div>
      </div>
    `;
  }

  async _toggleExpanded(miner) {
    if (this._expandedId === miner.buOrderId) {
      this._expandedId = '';
      return;
    }
    this._expandedId = miner.buOrderId;
    if (this._details[miner.buOrderId]) return;
    this._details = { ...this._details, [miner.buOrderId]: { loading: true, history: [], events: [] } };
    try {
      const [history, events] = await Promise.all([
        minersService.getHistory({ symbol: miner.symbol, limit: 12 }),
        minersService.getEvents({ symbol: miner.symbol, limit: 12 }),
      ]);
      this._details = {
        ...this._details,
        [miner.buOrderId]: {
          loading: false,
          history: Array.isArray(history?.snapshots) ? history.snapshots : [],
          events: Array.isArray(events?.events) ? events.events : [],
        },
      };
    } catch (error) {
      this._details = {
        ...this._details,
        [miner.buOrderId]: {
          loading: false,
          error: error?.data?.detail || error?.message || this._t('No se pudo cargar el detalle del minero.', 'Could not load miner detail.'),
          history: [],
          events: [],
        },
      };
    }
  }

  async _openClose(miner) {
    try {
      const preview = await minersService.previewClose(miner);
      this._closeCtx = { miner, preview };
    } catch (error) {
      window.toast?.(error?.data?.detail || error?.message || this._t('No se pudo preparar el cierre.', 'Could not prepare close preview.'), { type: 'error' });
    }
  }

  async _executeClose() {
    const miner = this._closeCtx?.miner;
    const token = this._closeCtx?.preview?.confirmationToken;
    const result = await minersService.executeClose({
      confirmationToken: token,
      closeReason: `Risk-control close requested from new dashboard for ${miner?.symbol || 'miner'}`,
    });
    await this._load();
    return { success: Boolean(result?.ok), message: result?.ok ? this._t(`${miner?.ticker} cerrado en Pionex.`, `${miner?.ticker} closed on Pionex.`) : this._t('El cierre falló.', 'Close failed.') };
  }

  async _checkStabilization(miner) {
    try {
      const result = await minersService.checkStabilization(miner);
      const existing = this._details[miner.buOrderId] || {};
      this._details = { ...this._details, [miner.buOrderId]: { ...existing, stabilization: result } };
      window.toast?.(result?.decisionReason || this._t('Chequeo de estabilización completado.', 'Stabilization check completed.'), { type: 'info' });
      if (this._expandedId !== miner.buOrderId) await this._toggleExpanded(miner);
    } catch (error) {
      window.toast?.(error?.data?.detail || error?.message || this._t('Falló el chequeo de estabilización.', 'Stabilization check failed.'), { type: 'error' });
    }
  }

  async _openRegrid(miner) {
    this._regridCtx = { miner, loading: true, preview: null, result: null };
    try {
      const preview = await minersService.previewRegrid(miner);
      this._regridCtx = { miner, loading: false, preview, result: null };
    } catch (error) {
      this._regridCtx = { miner, loading: false, preview: null, error: error?.data?.detail || error?.message || this._t('No se pudo construir el preview de regrid.', 'Could not build regrid preview.') };
    }
  }

  async _executeRegrid() {
    const miner = this._regridCtx?.miner;
    const token = this._regridCtx?.preview?.confirmationToken;
    const result = await minersService.executeRegrid({
      confirmationToken: token,
      reason: `Range migration executed from new dashboard for ${miner?.symbol || 'miner'}`,
    });
    this._regridCtx = { ...this._regridCtx, result };
    await this._load();
    return result;
  }

  _renderBalancePanel() {
    const balance = this._balance;
    if (!balance?.ok) {
      return html`<div class="panel"><div class="panel-title">${this._t('Balance de cuenta', 'Account Balance')}</div><div class="hint">${this._t('El balance no está disponible por ahora.', 'Balance not available right now.')}</div></div>`;
    }
    return html`
      <div class="panel">
        <div class="panel-title">${this._t('Balance de cuenta', 'Account Balance')}</div>
        <div class="detail-grid">
          <div class="detail"><div class="detail-title">${this._t('USDT libre', 'USDT Free')}</div><div class="detail-value">${fmt.usd(Number(balance?.usdt?.free || 0), 2)}</div></div>
          <div class="detail"><div class="detail-title">${this._t('USDT total', 'USDT Total')}</div><div class="detail-value">${fmt.usd(Number(balance?.usdt?.total || 0), 2)}</div></div>
          <div class="detail"><div class="detail-title">${this._t('Total estimado', 'Estimated Total')}</div><div class="detail-value">${fmt.usd(Number(balance?.estimatedTotalUsd || 0), 2)}</div></div>
          <div class="detail"><div class="detail-title">${this._t('Activos', 'Assets')}</div><div class="detail-value">${Number(balance?.assetsCount || 0)}</div></div>
        </div>
      </div>
    `;
  }

  _renderExpanded(miner) {
    const detail = this._details[miner.buOrderId] || {};
    const stabilization = detail.stabilization;
    return html`
      <div class="expanded">
        ${this._renderSignalSet(miner)}
        ${this._renderRangeTrack(miner)}
        <div class="detail-grid">
          <div class="detail"><div class="detail-title">BU Order</div><div class="detail-value">${miner.buOrderId}</div></div>
          <div class="detail"><div class="detail-title">Range Health</div><div class="detail-value">${miner.rangeHealth || '—'}</div></div>
          <div class="detail"><div class="detail-title">Inventory Ratio</div><div class="detail-value">${fmt.pctPlain(Number(miner.inventoryRatio || 0) * 100, 1)}</div></div>
          <div class="detail"><div class="detail-title">Target Daily</div><div class="detail-value">${fmt.usd(Number(miner.targetDailyUsdt || 0), 2)}</div></div>
          <div class="detail"><div class="detail-title">Trend PnL</div><div class="detail-value">${fmt.pnl(Number(miner.trendPnl || 0), 2)}</div></div>
          <div class="detail"><div class="detail-title">Grid Profit</div><div class="detail-value">${fmt.pnl(Number(miner.gridProfit || 0), 2)}</div></div>
          <div class="detail"><div class="detail-title">Fill Rate</div><div class="detail-value">${fmt.pctPlain(Number(miner.fillRate || 0), 0)}</div></div>
        </div>

        ${miner.inventoryGate ? html`
          <div class="section">
            <div class="section-title">Inventory Gate</div>
            <div class="mini-item"><strong>${miner.inventoryGate.label || 'Gate'}</strong><br />${miner.inventoryGate.detail || 'No extra detail.'}</div>
          </div>
        ` : ''}

        ${miner.promoHealth ? html`
          <div class="section">
            <div class="section-title">Promo Health</div>
            <div class="mini-item"><strong>${miner.promoHealth.label || 'Promo'}</strong><br />Score ${fmt.number(Number(miner.promoHealth.score || 0), 1)}</div>
          </div>
        ` : ''}

        ${miner.harvestPolicy ? html`
          <div class="section">
            <div class="section-title">Harvest Policy</div>
            <div class="mini-item">
              <strong>${miner.harvestPolicy.action || 'Policy'}</strong><br />
              Suggested ${fmt.usd(Number(miner.harvestPolicy.suggestedAmountUsdt || 0), 2)}<br />
              ${(miner.harvestPolicy.blockers || []).length ? `Blockers: ${(miner.harvestPolicy.blockers || []).join(' · ')}` : 'No active blockers.'}
            </div>
          </div>
        ` : ''}

        ${stabilization ? html`
          <div class="section">
            <div class="section-title">Latest Stabilization Check</div>
            <div class="mini-item">
              <strong>${stabilization.regridSuggestion || 'NO_ACTION'}</strong><br />
              ${stabilization.decisionReason || 'No reason returned.'}
            </div>
          </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Recent Events</div>
          ${detail.loading ? html`<loading-view label="Loading events and history"></loading-view>` : ''}
          ${detail.error ? html`<error-view label="Detail unavailable" .sub=${detail.error}></error-view>` : ''}
          ${!detail.loading && !detail.error ? html`
            <div class="mini-list">
              ${(detail.events || []).slice(0, 4).map((event) => html`
                <div class="mini-item">
                  <strong>${event.eventType || event.event_type || 'event'}</strong><br />
                  ${(event.reason || 'No reason').toString()}
                </div>
              `)}
              ${!(detail.events || []).length ? html`<div class="mini-item">No backend events persisted yet for this symbol.</div>` : ''}
            </div>
          ` : ''}
        </div>

        <div class="section">
          <div class="section-title">Snapshot History</div>
          ${!detail.loading && !detail.error ? html`
            <div class="mini-list">
              ${(detail.history || []).slice(0, 4).map((row) => html`
                <div class="mini-item">
                  <strong>${row.createdAt ? new Date(row.createdAt).toLocaleString() : 'Snapshot'}</strong><br />
                  close ${fmt.pnl(Number(row.payload?.closeProfit || row.closeProfit || 0), 2)} · grid ${fmt.pnl(Number(row.payload?.gridProfit || row.gridProfit || 0), 2)}
                </div>
              `)}
              ${!(detail.history || []).length ? html`<div class="mini-item">No stored snapshots yet for this symbol.</div>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  _renderMinerCard(miner) {
    const expanded = this._expandedId === miner.buOrderId;
    const riskClass = miner.risk === 'danger' ? 'danger' : miner.risk === 'warning' ? 'warning' : 'ok';
    return html`
      <article class="miner-card ${riskClass}">
        <div class="miner-head" @click=${() => this._toggleExpanded(miner)}>
          <div class="topline">
            <div>
              <div class="ticker">${miner.ticker}</div>
              <div class="meta">${miner.type} · ${fmt.leverage(miner.leverage)} · ${miner.status}</div>
            </div>
            <span class="badge ${riskClass}">${riskClass === 'ok' ? this._t('saludable', 'healthy') : (riskClass === 'danger' ? this._t('crítico', 'danger') : this._t('alerta', 'warning'))}</span>
          </div>

          ${miner.warning ? html`<div class="warning-banner">${miner.warning}</div>` : ''}

          <div class="metrics">
            <div class="metric"><span class="metric-label">${this._t('PnL cierre', 'Close PnL')}</span><span class="metric-value ${Number(miner.openPnl || 0) >= 0 ? 'pos' : 'neg'}">${fmt.pnl(Number(miner.openPnl || 0), 2)}</span></div>
            <div class="metric"><span class="metric-label">${this._t('PnL grid', 'Grid PnL')}</span><span class="metric-value ${Number(miner.dailyPnl || 0) >= 0 ? 'pos' : 'neg'}">${fmt.pnl(Number(miner.dailyPnl || 0), 2)}</span></div>
            <div class="metric"><span class="metric-label">${this._t('Capital', 'Capital')}</span><span class="metric-value">${fmt.usd(Number(miner.capital || 0), 2)}</span></div>
            <div class="metric"><span class="metric-label">${this._t('Posición en rango', 'Range Position')}</span><span class="metric-value">${fmt.pctPlain(Number(miner.rangePosition || 0) * 100, 1)}</span></div>
            <div class="metric"><span class="metric-label">${this._t('Inventario', 'Inventory')}</span><span class="metric-value">${fmt.pctPlain(Number(miner.inventoryRatio || 0) * 100, 1)}</span></div>
            <div class="metric"><span class="metric-label">${this._t('Objetivo / día', 'Target / Day')}</span><span class="metric-value">${fmt.usd(Number(miner.targetDailyUsdt || 0), 2)}</span></div>
          </div>

          <div class="actions" @click=${(event) => event.stopPropagation()}>
            <button class="btn btn-ghost btn-sm" @click=${() => this._checkStabilization(miner)}>${this._t('Revisar estabilización', 'Check Stabilization')}</button>
            <button class="btn btn-warning btn-sm" @click=${() => this._openRegrid(miner)}>${this._t('Preview regrid', 'Preview Regrid')}</button>
            <button class="btn btn-danger btn-sm" @click=${() => this._openClose(miner)}>${this._t('Cerrar', 'Close')}</button>
          </div>
        </div>
        ${expanded ? this._renderExpanded(miner) : ''}
      </article>
    `;
  }

  _renderMinerCardEnhanced(miner) {
    const expanded = this._expandedId === miner.buOrderId;
    const riskClass = miner.risk === 'danger' ? 'danger' : miner.risk === 'warning' ? 'warning' : 'ok';
    const signals = this._signalSet(miner);
    const passCount = signals.filter((item) => item.status === 'pass').length;
    const warnCount = signals.filter((item) => item.status === 'warn').length;
    const failCount = signals.filter((item) => item.status === 'fail').length;
    return html`
      <article class="miner-card ${riskClass}">
        <div class="miner-head" @click=${() => this._toggleExpanded(miner)}>
          <div class="topline">
            <div>
              <div class="ticker">${miner.ticker}</div>
              <div class="meta">${miner.type} · ${fmt.leverage(miner.leverage)} · ${miner.status}</div>
            </div>
            <div class="head-summary">
              <span class="badge ${riskClass}">${riskClass === 'ok' ? this._t('saludable', 'healthy') : (riskClass === 'danger' ? this._t('critico', 'danger') : this._t('alerta', 'warning'))}</span>
              <span class="signal-badge">R ${passCount} · W ${warnCount} · C ${failCount}</span>
            </div>
          </div>

          ${miner.warning ? html`<div class="warning-banner">${miner.warning}</div>` : ''}

          <div class="metrics">
            <div class="metric"><span class="metric-label">${this._t('PnL cierre', 'Close PnL')}</span><span class="metric-value ${Number(miner.openPnl || 0) >= 0 ? 'pos' : 'neg'}">${fmt.pnl(Number(miner.openPnl || 0), 2)}</span></div>
            <div class="metric"><span class="metric-label">${this._t('PnL grid', 'Grid PnL')}</span><span class="metric-value ${Number(miner.dailyPnl || 0) >= 0 ? 'pos' : 'neg'}">${fmt.pnl(Number(miner.dailyPnl || 0), 2)}</span></div>
            <div class="metric"><span class="metric-label">${this._t('Capital', 'Capital')}</span><span class="metric-value">${fmt.usd(Number(miner.capital || 0), 2)}</span></div>
            <div class="metric"><span class="metric-label">${this._t('Posicion en rango', 'Range Position')}</span><span class="metric-value">${fmt.pctPlain(Number(miner.rangePosition || 0) * 100, 1)}</span></div>
            <div class="metric"><span class="metric-label">${this._t('Inventario', 'Inventory')}</span><span class="metric-value">${fmt.pctPlain(Number(miner.inventoryRatio || 0) * 100, 1)}</span></div>
            <div class="metric"><span class="metric-label">${this._t('Objetivo / dia', 'Target / Day')}</span><span class="metric-value">${fmt.usd(Number(miner.targetDailyUsdt || 0), 2)}</span></div>
          </div>

          ${this._renderCollapsedSummary(miner)}

          <div class="actions" @click=${(event) => event.stopPropagation()}>
            <button class="btn btn-ghost btn-sm" @click=${() => this._checkStabilization(miner)}>${this._t('Revisar estabilizacion', 'Check Stabilization')}</button>
            <button class="btn btn-warning btn-sm" @click=${() => this._openRegrid(miner)}>${this._t('Preview regrid', 'Preview Regrid')}</button>
            <button class="btn btn-danger btn-sm" @click=${() => this._openClose(miner)}>${this._t('Cerrar', 'Close')}</button>
          </div>
        </div>
        ${expanded ? this._renderExpanded(miner) : ''}
      </article>
    `;
  }

  _renderRegridModal() {
    const ctx = this._regridCtx;
    if (!ctx?.miner) return '';
    const symbol = encodeURIComponent(`BYBIT:${ctx.miner.ticker}`);
    const tvUrl = `https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=240&theme=dark&style=1&locale=en&hide_top_toolbar=0&hide_side_toolbar=0&allow_symbol_change=1&drawings_access=all&save_image=1`;
    const preview = ctx.preview || {};
    return html`
      <div class="chart-overlay" @click=${(event) => { if (event.target === event.currentTarget) this._regridCtx = null; }}>
        <div class="chart-modal">
          <div class="chart-left">
            <div class="chart-header">
              <div>
                <div class="ticker">${ctx.miner.ticker}</div>
                <div class="hint">4H · TradingView · validate the new range before regridding</div>
              </div>
              <button class="btn btn-ghost btn-sm" @click=${() => this._regridCtx = null}>Close</button>
            </div>
            <iframe class="tv-frame" src="${tvUrl}"></iframe>
          </div>
          <div class="chart-right">
            <div class="exec-body">
              ${ctx.loading ? html`<loading-view label="Building regrid preview"></loading-view>` : ''}
              ${ctx.error ? html`<error-view label="Regrid preview unavailable" .sub=${ctx.error}></error-view>` : ''}
              ${!ctx.loading && !ctx.error ? html`
                <div class="exec-row"><span>Suggestion</span><span>${preview.regridSuggestion || '—'}</span></div>
                <div class="exec-row"><span>Stabilization</span><span>${preview.stabilizationState || '—'}</span></div>
                <div class="exec-row"><span>Range Break</span><span>${preview.rangeBreakState || '—'}</span></div>
                <div class="exec-row"><span>Bottom</span><span>${preview.regridCandidate?.bottom ? fmt.usd(Number(preview.regridCandidate.bottom), 2) : '—'}</span></div>
                <div class="exec-row"><span>Top</span><span>${preview.regridCandidate?.top ? fmt.usd(Number(preview.regridCandidate.top), 2) : '—'}</span></div>
                <div class="exec-row"><span>Rows</span><span>${preview.regridCandidate?.row || '—'}</span></div>
                <div class="mini-item"><strong>Reason</strong><br />${preview.decisionReason || 'No reason returned.'}</div>
                ${(preview.blockers || []).length ? html`
                  <div class="mini-item"><strong>Blockers</strong><br />${preview.blockers.join(' · ')}</div>
                ` : ''}
                ${ctx.result?.ok ? html`<div class="mini-item"><strong>Executed</strong><br />Regrid request sent to Pionex successfully.</div>` : ''}
              ` : ''}
            </div>
            <div class="exec-actions">
              <button class="btn btn-ghost" @click=${() => this._regridCtx = null}>Cancel</button>
              <button class="btn btn-warning" ?disabled=${!preview.confirmationToken || ctx.loading || ctx.result?.ok} @click=${() => this._executeRegrid()}>Apply Regrid</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _renderLegacy() {
    if (this._loading) return html`<loading-view label="${this._t('Cargando mineros activos', 'Loading active miners')}"></loading-view>`;
    if (this._error) return html`<error-view label="${this._t('Mineros activos no disponibles', 'Active miners unavailable')}" .sub=${this._error}></error-view>`;

    const summary = this._data?.summary || {};
    const miners = this._filteredMiners();

    return html`
      <div class="page">
        <div class="toolbar">
          <segmented-control
            .options=${[
              { value: 'all', label: `${this._t('Todos', 'All')} (${this._data?.miners?.length || 0})` },
              { value: 'warnings', label: `${this._t('Alertas', 'Warnings')} (${summary.warnings || 0})` },
              { value: 'danger', label: this._t('Críticos', 'Critical') },
            ]}
            value=${this._filter}
            @change=${(event) => this._setFilter(event.detail)}
          ></segmented-control>
          <button class="btn btn-ghost" @click=${() => this._load()}>${this._t('Actualizar', 'Refresh')}</button>
        </div>

        <div class="hero">
          <div class="panel">
            <div class="panel-title">${this._t('KPIs de mineros', 'Miner KPIs')}</div>
            <div class="kpi-row">
              <stat-card label="${this._t('Mineros activos', 'Active Miners')}" value="${summary.active || 0}" accent="accent"></stat-card>
              <stat-card label="${this._t('Capital', 'Capital')}" value="${fmt.usd(Number(summary.totalCapital || 0), 2)}" accent="neutral" mono></stat-card>
              <stat-card label="${this._t('PnL cierre', 'Close PnL')}" value="${fmt.pnl(Number(summary.openPnl || 0), 2)}" accent="${Number(summary.openPnl || 0) >= 0 ? 'positive' : 'negative'}" mono></stat-card>
              <stat-card label="${this._t('PnL grid', 'Grid PnL')}" value="${fmt.pnl(Number(summary.dailyPnl || 0), 2)}" accent="${Number(summary.dailyPnl || 0) >= 0 ? 'positive' : 'negative'}" mono></stat-card>
              <stat-card label="${this._t('Alertas', 'Warnings')}" value="${summary.warnings || 0}" accent="${summary.warnings ? 'negative' : 'positive'}"></stat-card>
              <stat-card label="${this._t('Gap promedio', 'Avg Gap')}" value="${summary.avgGridGap || '0.00'}%" accent="neutral" mono></stat-card>
            </div>
          </div>
          ${this._renderBalancePanel()}
        </div>

        <div class="miners-grid">
          ${miners.map((miner) => this._renderMinerCard(miner))}
          ${!miners.length ? html`<empty-view label="${this._t('No hay mineros para este filtro', 'No miners match this filter')}"></empty-view>` : ''}
        </div>
      </div>

      ${this._closeCtx ? html`
        <preview-execute-modal
          title="Close Miner"
          subtitle="${this._closeCtx.miner.ticker} · live Pionex close"
          domain="miners"
          .payload=${[
            { label: 'Ticker', value: this._closeCtx.miner.ticker },
            { label: 'BU Order', value: this._closeCtx.miner.buOrderId },
            { label: 'Close PnL', value: fmt.pnl(Number(this._closeCtx.miner.openPnl || 0), 2), highlight: Number(this._closeCtx.miner.openPnl || 0) < 0 ? 'danger' : 'pos' },
            { label: 'Capital', value: fmt.usd(Number(this._closeCtx.miner.capital || 0), 2) },
          ]}
          .warnings=${['This sends a real close instruction to Pionex.', 'The current close PnL will be realized immediately.']}
          dangerLevel="danger"
          confirmText="Close Position"
          .executeFn=${() => this._executeClose()}
          @closed=${() => { this._closeCtx = null; }}
          @executed=${() => { this._closeCtx = null; }}
        ></preview-execute-modal>
      ` : ''}

      ${this._renderRegridModal()}
    `;
  }

  render() {
    const hasData = this._hasLoadedOnce;
    if (this._loading && !hasData) return html`<loading-view label="${this._t('Cargando mineros activos', 'Loading active miners')}"></loading-view>`;
    if (this._error && !hasData) return html`<error-view label="${this._t('Mineros activos no disponibles', 'Active miners unavailable')}" .sub=${this._error}></error-view>`;

    const summary = this._data?.summary || {};
    const miners = this._filteredMiners();
    const counts = this._filterCounts();
    const hero = this._heroSummary();
    const policy = this._getRefreshPolicy();
    const autoSeconds = Math.round(policy.autoMs / 1000);
    const manualRefreshLeft = this._manualRefreshRemaining();

    return html`
      <div class="page">
        <div class="toolbar">
          <div class="toolbar-left">
            <segmented-control
              .options=${[
                { value: 'all', label: `${this._t('Todos', 'All')} (${counts.all})` },
                { value: 'warnings', label: `${this._t('Alertas', 'Warnings')} (${counts.warnings})` },
                { value: 'danger', label: `${this._t('Criticos', 'Critical')} (${counts.danger})` },
              ]}
              value=${this._filter}
              @change=${(event) => this._setFilter(event.detail)}
            ></segmented-control>
            <div class="toolbar-note">
              ${this._t('Plan', 'Plan')}: ${this._planTier.toUpperCase()} · ${this._t('Auto refresh', 'Auto refresh')}: ${autoSeconds}s
              ${policy.manual ? ` · ${this._t('Manuales', 'Manuals')}: ${manualRefreshLeft}/${policy.maxManual}` : ''}
            </div>
          </div>
          <div class="toolbar-right">
            ${this._refreshing ? html`<div class="toolbar-status">${this._t('Sincronizando en segundo plano', 'Syncing in background')}</div>` : ''}
            ${this._error && hasData ? html`<div class="toolbar-note" style="color:var(--color-warning)">${this._error}</div>` : ''}
            ${policy.manual ? html`<button class="btn btn-ghost" @click=${() => this._load({ manual: true })}>${this._t('Actualizar', 'Refresh')}</button>` : ''}
          </div>
        </div>

        <div class="hero">
          <div class="hero-main">
            <div class="hero-summary">
              <div class="hero-glance">
                <div class="hero-eyebrow">${this._t('Fleet status', 'Fleet status')}</div>
                <div class="hero-value">${summary.active || 0}</div>
                <div class="hero-sub">${this._t('mineros activos con capital desplegado', 'active miners with deployed capital')}</div>
                <div class="hero-pills">
                  <span class="hero-pill ok">${hero.healthy} ${this._t('saludables', 'healthy')}</span>
                  <span class="hero-pill warn">${counts.warnings} ${this._t('alertas', 'warnings')}</span>
                  <span class="hero-pill danger">${counts.danger} ${this._t('criticos', 'critical')}</span>
                </div>
              </div>
              ${this._renderHeroLanes()}
            </div>

            <div class="panel">
              <div class="panel-title">${this._t('KPIs de mineros', 'Miner KPIs')}</div>
              <div class="kpi-row">
                <stat-card label="${this._t('Mineros activos', 'Active Miners')}" value="${summary.active || 0}" accent="accent"></stat-card>
                <stat-card label="${this._t('Capital desplegado', 'Deployed capital')}" value="${fmt.usd(Number(summary.totalCapital || 0), 2)}" accent="neutral" mono></stat-card>
                <stat-card label="${this._t('PnL cierre', 'Close PnL')}" value="${fmt.pnl(Number(summary.openPnl || 0), 2)}" accent="${Number(summary.openPnl || 0) >= 0 ? 'positive' : 'negative'}" mono></stat-card>
                <stat-card label="${this._t('Produccion grid', 'Grid production')}" value="${fmt.pnl(Number(summary.dailyPnl || 0), 2)}" accent="${Number(summary.dailyPnl || 0) >= 0 ? 'positive' : 'negative'}" mono></stat-card>
                <stat-card label="${this._t('Objetivo diario', 'Daily target')}" value="${fmt.usd(Number(hero.totalTarget || 0), 2)}" accent="accent" mono></stat-card>
                <stat-card label="${this._t('Inventario medio', 'Avg inventory')}" value="${fmt.pct(Number(hero.avgInventory || 0), 2)}" accent="${hero.avgInventory > 0.10 ? 'negative' : hero.avgInventory > 0.05 ? 'warning' : 'positive'}"></stat-card>
                <stat-card label="${this._t('Posicion media', 'Avg range pos')}" value="${fmt.pct(Number(hero.avgRange || 0), 2)}" accent="neutral"></stat-card>
                <stat-card label="${this._t('Gap promedio', 'Avg gap')}" value="${summary.avgGridGap || '0.00'}%" accent="neutral" mono></stat-card>
              </div>
            </div>
          </div>

          ${this._renderBalancePanel()}
        </div>

        <div class="miners-grid">
          ${repeat(miners, (miner) => miner.buOrderId || miner.symbol || miner.ticker, (miner) => this._renderMinerCardEnhanced(miner))}
          ${!miners.length ? html`<empty-view label="${this._t('No hay mineros para este filtro', 'No miners match this filter')}"></empty-view>` : ''}
        </div>
      </div>

      ${this._closeCtx ? html`
        <preview-execute-modal
          title="Close Miner"
          subtitle="${this._closeCtx.miner.ticker} · live Pionex close"
          domain="miners"
          .payload=${[
            { label: 'Ticker', value: this._closeCtx.miner.ticker },
            { label: 'BU Order', value: this._closeCtx.miner.buOrderId },
            { label: 'Close PnL', value: fmt.pnl(Number(this._closeCtx.miner.openPnl || 0), 2), highlight: Number(this._closeCtx.miner.openPnl || 0) < 0 ? 'danger' : 'pos' },
            { label: 'Capital', value: fmt.usd(Number(this._closeCtx.miner.capital || 0), 2) },
          ]}
          .warnings=${['This sends a real close instruction to Pionex.', 'The current close PnL will be realized immediately.']}
          dangerLevel="danger"
          confirmText="Close Position"
          .executeFn=${() => this._executeClose()}
          @closed=${() => { this._closeCtx = null; }}
          @executed=${() => { this._closeCtx = null; }}
        ></preview-execute-modal>
      ` : ''}

      ${this._renderRegridModal()}
    `;
  }
}

customElements.define('miners-view', MinersView);
