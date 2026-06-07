import { LitElement, html, css, svg } from 'lit';
import { init, use } from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { overviewMock } from '../../mocks/overview.mock.js';
import { router } from '../../app/router.js';
import { overviewService } from '../../services/overview.service.js';
import { fmt } from '../../utils/format.js';
import { Poller } from '../../utils/polling.js';

use([LineChart, BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

class OverviewView extends LitElement {
  static properties = {
    _data: { type: Object, state: true },
    _advisorTab: { type: String, state: true },
    _macroTab: { type: String, state: true },
    _macroVisibility: { type: Object, state: true },
    _macroMetricVisibility: { type: Object, state: true },
  };

  static styles = css`
    :host { display: block; }
    .page {
      padding: var(--content-padding);
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-3);
    }

    .row-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    .row-3col {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: var(--space-4);
    }

    .panel {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
    }

    .panel-title {
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-4);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .panel-title-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .panel-kicker {
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }

    .macro-shell {
      overflow: hidden;
      position: relative;
      background:
        radial-gradient(circle at top right, rgba(91, 141, 239, 0.14), transparent 34%),
        radial-gradient(circle at bottom left, rgba(245, 166, 35, 0.08), transparent 28%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0)),
        var(--color-bg-card);
    }

    .macro-topbar {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
    }

    .macro-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .macro-tab {
      border: 1px solid var(--color-border-default);
      background: rgba(255, 255, 255, 0.02);
      color: var(--color-text-secondary);
      padding: 8px 12px;
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .macro-tab:hover { color: var(--color-text-primary); border-color: var(--color-border-strong); }

    .macro-tab.active {
      color: var(--color-text-primary);
      background: var(--color-accent-dim);
      border-color: rgba(91, 141, 239, 0.38);
      box-shadow: var(--shadow-glow-accent);
    }

    .macro-main {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
      flex-wrap: wrap;
    }

    .macro-value {
      font-size: var(--text-3xl);
      font-weight: var(--weight-bold);
      letter-spacing: var(--tracking-tight);
      line-height: 1;
    }

    .macro-sub {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      margin-top: 6px;
    }

    .macro-delta {
      padding: 5px 9px;
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      background: var(--color-accent-dim);
      color: var(--color-accent);
      white-space: nowrap;
    }

    .macro-delta.pos { background: var(--color-positive-dim); color: var(--color-positive); }
    .macro-delta.neg { background: var(--color-negative-dim); color: var(--color-negative); }

    .macro-meta {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .macro-meta-card {
      padding: 10px;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--color-border-subtle);
    }

    .macro-meta-label {
      font-size: 10px;
      color: var(--color-text-muted);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .macro-meta-value {
      font-size: var(--text-lg);
      font-family: var(--font-mono);
      color: var(--color-text-primary);
    }

    .macro-chart-card {
      position: relative;
      border-radius: var(--radius-md);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0));
      border: 1px solid var(--color-border-subtle);
      padding: var(--space-2);
      overflow: hidden;
    }

    .macro-chart-wide {
      margin-top: var(--space-2);
      margin-bottom: var(--space-3);
    }

    .macro-toggle-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: var(--space-2);
      margin-bottom: var(--space-3);
    }

    .macro-toggle-row.metrics {
      margin-top: 0;
      margin-bottom: var(--space-2);
    }

    .macro-toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 10px;
      border-radius: var(--radius-full);
      border: 1px solid var(--color-border-default);
      background: rgba(255, 255, 255, 0.03);
      color: var(--color-text-secondary);
      font-size: var(--text-xs);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .macro-toggle.active {
      color: var(--color-text-primary);
      border-color: rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.08);
    }

    .macro-toggle-swatch {
      width: 9px;
      height: 9px;
      border-radius: var(--radius-full);
      flex-shrink: 0;
    }

    .macro-echart {
      width: 100%;
      height: 280px;
    }

    .macro-echart.compact {
      height: 248px;
    }

    .gauge-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--space-3);
      margin-top: var(--space-2);
      margin-bottom: var(--space-3);
    }

    .gauge-card {
      padding: 10px;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--color-border-subtle);
    }

    .gauge-svg {
      width: 100%;
      height: 170px;
      display: block;
    }

    .gauge-track {
      fill: none;
      stroke: var(--color-bg-elevated);
      stroke-width: 14;
      stroke-linecap: round;
    }

    .gauge-hot {
      fill: none;
      stroke-width: 14;
      stroke-linecap: round;
      filter: drop-shadow(0 0 10px rgba(91, 141, 239, 0.18));
    }

    .gauge-needle {
      stroke: var(--color-text-primary);
      stroke-width: 3;
      stroke-linecap: round;
    }

    .gauge-hub { fill: var(--color-text-primary); }

    .gauge-center {
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: var(--weight-semibold);
      fill: var(--color-text-primary);
      text-anchor: middle;
    }

    .gauge-sub {
      font-size: 9px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      fill: var(--color-text-muted);
      text-anchor: middle;
    }

    .macro-axis {
      display: flex;
      justify-content: space-between;
      gap: var(--space-3);
      margin-top: var(--space-3);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      flex-wrap: wrap;
    }

    .macro-legend {
      margin-top: var(--space-3);
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .macro-legend-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: var(--text-xs);
      color: var(--color-text-secondary);
    }

    .macro-legend-swatch {
      width: 10px;
      height: 10px;
      border-radius: var(--radius-full);
    }

    .macro-insight {
      margin-top: var(--space-3);
      font-size: var(--text-sm);
      line-height: 1.6;
      color: var(--color-text-secondary);
    }

    .liquidity-bar-wrap { margin-top: var(--space-3); }
    .liq-header {
      display: flex;
      justify-content: space-between;
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      margin-bottom: var(--space-2);
    }
    .liq-track {
      height: 12px;
      background: var(--color-bg-elevated);
      border-radius: var(--radius-full);
      overflow: hidden;
      display: flex;
    }
    .liq-fill {
      height: 100%;
      background: var(--color-accent);
      border-radius: var(--radius-full) 0 0 var(--radius-full);
      transition: width 0.5s ease;
    }
    .liq-free {
      height: 100%;
      background: var(--color-positive-dim);
      flex: 1;
    }
    .liq-legend {
      display: flex;
      gap: var(--space-4);
      margin-top: var(--space-3);
      font-size: var(--text-xs);
    }
    .liq-legend-item { display: flex; align-items: center; gap: var(--space-1); }
    .liq-dot { width: 8px; height: 8px; border-radius: 2px; }

    .alert-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      padding: var(--space-3);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-2);
      font-size: var(--text-sm);
      cursor: pointer;
      transition: filter var(--transition-fast);
    }
    .alert-item:hover { filter: brightness(1.1); }
    .alert-item:last-child { margin-bottom: 0; }
    .alert-danger { background: var(--color-negative-dim); border-left: 3px solid var(--color-negative); }
    .alert-warning { background: var(--color-warning-dim); border-left: 3px solid var(--color-warning); }
    .alert-info { background: var(--color-accent-dim); border-left: 3px solid var(--color-accent); }
    .alert-icon { flex-shrink: 0; font-size: 14px; margin-top: 1px; }
    .alert-text { flex: 1; color: var(--color-text-primary); line-height: 1.4; }
    .alert-time { font-size: var(--text-xs); color: var(--color-text-muted); white-space: nowrap; }

    .advisor-panel {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-lg);
    }
    .advisor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--card-padding);
      border-bottom: 1px solid var(--color-border-subtle);
    }
    .advisor-title {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-md);
      font-weight: var(--weight-semibold);
    }
    .advisor-chip {
      font-size: 10px;
      font-weight: var(--weight-semibold);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 2px 7px;
      background: var(--color-accent-dim);
      color: var(--color-accent);
      border-radius: var(--radius-sm);
    }
    .advisor-timestamp {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }
    .advisor-tabs {
      display: flex;
      gap: 0;
      padding: 0 var(--card-padding);
      border-bottom: 1px solid var(--color-border-subtle);
      overflow-x: auto;
    }
    .advisor-tab {
      padding: var(--space-3) var(--space-4);
      font-size: var(--text-xs);
      font-weight: var(--weight-medium);
      color: var(--color-text-muted);
      cursor: pointer;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      transition: all var(--transition-fast);
    }
    .advisor-tab:hover { color: var(--color-text-secondary); }
    .advisor-tab.active {
      color: var(--color-accent);
      border-bottom-color: var(--color-accent);
    }
    .advisor-content { padding: var(--card-padding); }
    .advisor-summary {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      line-height: 1.7;
    }

    .rec-card {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-3);
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-3);
      border-left: 3px solid var(--color-accent);
    }
    .rec-card:last-child { margin-bottom: 0; }
    .rec-priority {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--color-accent-dim);
      color: var(--color-accent);
      font-size: var(--text-xs);
      font-weight: var(--weight-bold);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .rec-body { flex: 1; }
    .rec-category { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 3px; }
    .rec-action { font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text-primary); margin-bottom: 4px; }
    .rec-rationale { font-size: var(--text-xs); color: var(--color-text-muted); }
    .rec-impact {
      margin-top: var(--space-2);
      font-size: var(--text-xs);
      color: var(--color-positive);
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .risk-sug {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
      padding: var(--space-3);
      background: var(--color-warning-dim);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      color: var(--color-warning);
      margin-bottom: var(--space-2);
    }

    .tip-card {
      padding: var(--space-3);
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-2);
    }
    .tip-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-2); }
    .tip-body { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.6; }

    .warning-item-advisor {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      margin-bottom: var(--space-2);
    }
    .warning-item-advisor.high { background: var(--color-negative-dim); color: var(--color-negative); }
    .warning-item-advisor.medium { background: var(--color-warning-dim); color: var(--color-warning); }

    .whatif-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-10);
      border: 2px dashed var(--color-border-default);
      border-radius: var(--radius-lg);
      gap: var(--space-3);
      text-align: center;
    }
    .whatif-icon { font-size: 32px; opacity: 0.3; }
    .whatif-label { font-size: var(--text-sm); color: var(--color-text-muted); }
    .whatif-sub { font-size: var(--text-xs); color: var(--color-text-disabled); }

    .action-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3);
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-2);
      cursor: pointer;
      transition: background var(--transition-fast);
    }
    .action-item:hover { background: var(--color-bg-hover); }
    .action-item:last-child { margin-bottom: 0; }
    .action-left { display: flex; align-items: center; gap: var(--space-3); }
    .urgency-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .urgency-high { background: var(--color-negative); box-shadow: 0 0 6px var(--color-negative); }
    .urgency-medium { background: var(--color-warning); }
    .urgency-low { background: var(--color-idle); }
    .action-label { font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text-primary); }
    .action-arrow { color: var(--color-text-muted); font-size: 14px; }

    .goal-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: var(--space-3);
    }
    .goal-amount { font-family: var(--font-mono); font-size: var(--text-2xl); font-weight: var(--weight-semibold); color: var(--color-positive); }
    .goal-target { font-size: var(--text-xs); color: var(--color-text-muted); }

    @media (max-width: 1100px) {
      .row-2col { grid-template-columns: 1fr; }
      .row-3col { grid-template-columns: 1fr 1fr; }
      .macro-meta { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }

    @media (max-width: 900px) {
      .macro-meta,
      .gauge-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 800px) {
      .row-3col { grid-template-columns: 1fr; }
    }
  `;

  constructor() {
    super();
    this._data = overviewMock;
    this._advisorTab = 'summary';
    this._macroTab = 'btc-dominance';
    this._macroVisibility = { btc: true, gold: true, silver: true, oil: true, ai: true };
    this._macroMetricVisibility = { price: true, volume: false, marketCap: false };
    this._macroCharts = new Map();
    this._handleMacroResize = () => this._macroCharts.forEach((chart) => chart.resize());
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._handleMacroResize);
    this._loadMacroBasket();
    // Poll macro data every 60s — updates ECharts directly, no Lit re-render
    this._poller = new Poller(() => this._refreshMacro(), { interval: 60_000, immediate: false });
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this._handleMacroResize);
    this._macroCharts.forEach((chart) => chart.dispose());
    this._macroCharts.clear();
    this._poller?.stop();
    super.disconnectedCallback();
  }

  async _loadMacroBasket() {
    try {
      const macro = await overviewService.getMacroBasket();
      this._data = {
        ...this._data,
        btcVsMetals: {
          ...this._data.btcVsMetals,
          ...macro,
          insight: macro.insight || this._data.btcVsMetals.insight,
        },
      };
    } catch {
      // Keep mock fallback when the backend feed is unavailable.
    }
  }

  // Refresh macro data without triggering a Lit re-render.
  // Updates ECharts instances directly via setOption({ notMerge: false }).
  async _refreshMacro() {
    try {
      const macro = await overviewService.getMacroBasket();
      // Mutate in place so Lit does NOT schedule a re-render
      Object.assign(this._data.btcVsMetals, macro);
      if (macro.insight) this._data.btcVsMetals.insight = macro.insight;
      // Push updated options to each live ECharts instance
      this._macroCharts.forEach((chart, key) => {
        const opt = this._getMacroChartOption(key);
        if (opt) chart.setOption(opt, { notMerge: false, lazyUpdate: true });
      });
    } catch {
      // Silently keep previous data on network failure
    }
  }

  firstUpdated() {
    this._syncMacroCharts();
  }

  updated(changedProperties) {
    if (
      changedProperties.has('_macroTab')
      || changedProperties.has('_macroVisibility')
      || changedProperties.has('_macroMetricVisibility')
      || changedProperties.has('_data')
    ) {
      this._syncMacroCharts();
    }
  }

  _pointX(index, total, width = 720) {
    return index * (width / Math.max(1, total - 1));
  }

  _getMacroTabs() {
    const d = this._data;
    return [
      {
        id: 'btc-dominance',
        label: 'BTC Dominance',
        title: 'Bitcoin Dominance',
        kicker: '1D candles · Market structure',
        startDate: d.btcDominance.startDate,
        dates: d.btcDominance.dates,
        series: [
          { id: 'dominance', label: 'BTC Dominance', values: d.btcDominance.trend, color: '#22d3a0', format: 'pct' },
        ],
        value: `${d.btcDominance.current.toFixed(1)}%`,
        subtitle: 'Share of total crypto market cap',
        delta: `+${d.btcDominance.weeklyChange.toFixed(1)}%`,
        deltaTone: 'pos',
        meta: [
          { label: 'BTC share', value: `${d.btcDominance.current.toFixed(1)}%` },
          { label: 'Alt share', value: `${d.btcDominance.altStrength.toFixed(1)}%` },
          { label: 'Bias', value: 'Bitcoin leadership' },
        ],
        insight: 'BTC is reclaiming share of the tape. That usually favors selective deployment rather than broad alt expansion.',
      },
      {
        id: 'fear-greed',
        label: 'Fear & Greed',
        title: 'Fear & Greed Index',
        kicker: '1D candles · Sentiment pulse',
        startDate: d.fearGreed.startDate,
        dates: d.fearGreed.dates,
        series: [
          { id: 'fear', label: 'Fear & Greed', values: d.fearGreed.history, color: '#f04a5e', format: 'plain' },
        ],
        value: `${d.fearGreed.value}`,
        subtitle: d.fearGreed.label,
        delta: `${d.fearGreed.value - d.fearGreed.previous >= 0 ? '+' : ''}${(d.fearGreed.value - d.fearGreed.previous).toFixed(0)} vs prior`,
        deltaTone: d.fearGreed.value >= d.fearGreed.previous ? 'pos' : 'neg',
        meta: [
          { label: 'Current', value: d.fearGreed.label },
          { label: 'Previous', value: `${d.fearGreed.previous}` },
          { label: 'Regime', value: d.fearGreed.value >= 70 ? 'Risk-on' : 'Balanced' },
        ],
        insight: 'Sentiment is heating up. That can help momentum continuation, but it also raises the odds of sharp shakeouts.',
      },
      {
        id: 'ai-vs-btc',
        label: 'AI vs BTC',
        title: 'AI Equities vs Bitcoin',
        kicker: `${d.aiVsBitcoin.window} · 1D candles`,
        startDate: d.aiVsBitcoin.startDate,
        dates: d.aiVsBitcoin.dates,
        series: [
          { id: 'ai', label: 'AI Basket', values: d.aiVsBitcoin.series.ai, color: '#7c93ff', format: 'index' },
          { id: 'btc', label: 'BTC', values: d.aiVsBitcoin.series.btc, color: '#f5a623', format: 'index' },
        ],
        value: `+${(d.aiVsBitcoin.series.ai.at(-1) - 100).toFixed(1)}%`,
        subtitle: 'AI basket relative performance',
        delta: d.aiVsBitcoin.series.ai.at(-1) >= d.aiVsBitcoin.series.btc.at(-1) ? 'AI leads' : 'BTC leads',
        deltaTone: d.aiVsBitcoin.series.ai.at(-1) >= d.aiVsBitcoin.series.btc.at(-1) ? 'pos' : 'neg',
        meta: [
          { label: 'AI basket', value: `+${(d.aiVsBitcoin.series.ai.at(-1) - 100).toFixed(1)}%` },
          { label: 'Bitcoin', value: `+${(d.aiVsBitcoin.series.btc.at(-1) - 100).toFixed(1)}%` },
          { label: 'Window', value: d.aiVsBitcoin.window },
        ],
        insight: 'AI beta still outruns BTC in this 90-day view, but the spread is narrow enough that rotation can flip quickly.',
      },
      {
        id: 'btc-price-liquidations',
        label: 'BTC vs Liquidations',
        title: 'BTC Price vs Liquidation Volume',
        kicker: `${d.btcPriceLiquidations.window} · 1D candles`,
        startDate: d.btcPriceLiquidations.startDate,
        dates: d.btcPriceLiquidations.dates,
        series: [
          { id: 'btc', label: 'BTC Price', values: d.btcPriceLiquidations.price.index, color: '#f5a623', format: 'index' },
          { id: 'liq', label: 'Liquidations', values: d.btcPriceLiquidations.liquidations.total, color: '#f04a5e', format: 'billions' },
        ],
        value: fmt.usd(d.btcPriceLiquidations.price.spot, 0),
        subtitle: 'Spot price against forced-liquidation pressure',
        delta: `${(((d.btcPriceLiquidations.price.spot - d.btcPriceLiquidations.price.previous) / d.btcPriceLiquidations.price.previous) * 100).toFixed(1)}% vs prior`,
        deltaTone: d.btcPriceLiquidations.price.spot >= d.btcPriceLiquidations.price.previous ? 'pos' : 'neg',
        meta: [
          { label: 'BTC spot', value: fmt.usd(d.btcPriceLiquidations.price.spot, 0) },
          { label: 'Liq spike', value: `${d.btcPriceLiquidations.liquidations.latest.toFixed(1)}B` },
          { label: 'Dominant side', value: d.btcPriceLiquidations.liquidations.longShare >= d.btcPriceLiquidations.liquidations.shortShare ? 'Long flush' : 'Short squeeze' },
        ],
        insight: d.btcPriceLiquidations.insight,
      },
      {
        id: 'btc-vs-metals',
        label: 'BTC vs Macro Basket',
        title: 'BTC vs Gold, Silver, Oil & AI',
        kicker: `${d.btcVsMetals.window} · 1D candles`,
        startDate: d.btcVsMetals.startDate,
        dates: d.btcVsMetals.dates,
        metrics: d.btcVsMetals.metrics,
        series: [
          { id: 'btc', label: 'BTC', values: d.btcVsMetals.metrics.price.btc, color: '#f5a623', format: 'index' },
          { id: 'gold', label: 'Gold', values: d.btcVsMetals.metrics.price.gold, color: '#eab308', format: 'index' },
          { id: 'silver', label: 'Silver', values: d.btcVsMetals.metrics.price.silver, color: '#cbd5e1', format: 'index' },
          { id: 'oil', label: 'Oil', values: d.btcVsMetals.metrics.price.oil, color: '#fb7185', format: 'index' },
          { id: 'ai', label: 'AI Index', values: d.btcVsMetals.metrics.price.ai, color: '#7c93ff', format: 'index' },
        ],
        value: `+${(d.btcVsMetals.metrics.price.btc.at(-1) - 100).toFixed(1)}%`,
        subtitle: 'One-year relative performance basket',
        delta: d.btcVsMetals.metrics.price.ai.at(-1) >= d.btcVsMetals.metrics.price.btc.at(-1) ? 'AI leads' : 'BTC leads',
        deltaTone: 'pos',
        meta: [
          { label: 'BTC', value: `+${(d.btcVsMetals.metrics.price.btc.at(-1) - 100).toFixed(1)}%` },
          { label: 'AI Index', value: `+${(d.btcVsMetals.metrics.price.ai.at(-1) - 100).toFixed(1)}%` },
          { label: 'Oil', value: `+${(d.btcVsMetals.metrics.price.oil.at(-1) - 100).toFixed(1)}%` },
        ],
        insight: d.btcVsMetals.insight,
      },
    ];
  }

  _getActiveMacro() {
    return this._getMacroTabs().find((item) => item.id === this._macroTab) || this._getMacroTabs()[0];
  }

  _getGaugeValue(series) {
    const current = series.values.at(-1) ?? 0;
    return series.format === 'index' ? current - 100 : current;
  }

  _getGaugeDisplay(series) {
    const current = this._getGaugeValue(series);
    if (series.format === 'pct') return `${current.toFixed(1)}%`;
    if (series.format === 'index') return `${current >= 0 ? '+' : ''}${current.toFixed(1)}%`;
    if (series.format === 'billions') return `${current.toFixed(1)}B`;
    return `${current.toFixed(0)}`;
  }

  _getGaugeRatio(series, active) {
    if (series.format === 'pct' || series.format === 'plain') {
      return Math.max(0, Math.min(1, this._getGaugeValue(series) / 100));
    }
    if (series.format === 'billions') {
      const max = Math.max(1, ...active.series.map((item) => Number(item.values.at(-1) ?? 0)));
      return Math.max(0, Math.min(1, this._getGaugeValue(series) / max));
    }
    const all = active.series.map((item) => Math.abs(this._getGaugeValue(item)));
    const max = Math.max(1, ...all);
    return Math.max(0, Math.min(1, Math.abs(this._getGaugeValue(series)) / max));
  }

  _renderGauge(series, active) {
    const ratio = this._getGaugeRatio(series, active);
    const angle = -180 + ratio * 180;
    const radians = (angle * Math.PI) / 180;
    const cx = 110;
    const cy = 92;
    const radius = 72;
    const needleX = cx + Math.cos(radians) * radius;
    const needleY = cy + Math.sin(radians) * radius;

    return html`
      <div class="gauge-card">
        <div class="macro-meta-label" style="margin-bottom:10px">${series.label}</div>
        <svg class="gauge-svg" viewBox="0 0 220 170" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="gauge-${series.id}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="rgba(240,74,94,0.9)"></stop>
              <stop offset="55%" stop-color="${series.color}"></stop>
              <stop offset="100%" stop-color="rgba(34,211,160,0.9)"></stop>
            </linearGradient>
          </defs>
          <path class="gauge-track" d="M 38 92 A 72 72 0 0 1 182 92"></path>
          <path class="gauge-hot" d="M 38 92 A 72 72 0 0 1 182 92" stroke="url(#gauge-${series.id})"></path>
          <line class="gauge-needle" x1="${cx}" y1="${cy}" x2="${needleX}" y2="${needleY}"></line>
          <circle class="gauge-hub" cx="${cx}" cy="${cy}" r="5"></circle>
          <text class="gauge-center" x="${cx}" y="68">${this._getGaugeDisplay(series)}</text>
          <text class="gauge-sub" x="${cx}" y="118">${series.format === 'index' ? 'RETURN' : 'VALUE'}</text>
        </svg>
      </div>
    `;
  }

  _toggleMacroSeries(seriesId) {
    const next = { ...this._macroVisibility, [seriesId]: !this._macroVisibility[seriesId] };
    if (Object.values(next).every((value) => !value)) {
      next[seriesId] = true;
    }
    this._macroVisibility = next;
  }

  _toggleMacroMetric(metricId) {
    const next = { ...this._macroMetricVisibility, [metricId]: !this._macroMetricVisibility[metricId] };
    if (Object.values(next).every((value) => !value)) {
      next[metricId] = true;
    }
    this._macroMetricVisibility = next;
  }

  _buildChartBase() {
    return {
      backgroundColor: 'transparent',
      animationDuration: 250,
      legend: { show: false },
      textStyle: {
        color: '#d9dce8',
        fontFamily: 'Inter, sans-serif',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', snap: true },
        backgroundColor: 'rgba(10,11,15,0.96)',
        borderColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        textStyle: { color: '#f4f6fb', fontSize: 11 },
      },
    };
  }

  _buildLiquidationsOption(active) {
    const dates = active.dates.map((date) => fmt.date(date));
    return {
      ...this._buildChartBase(),
      grid: { left: 42, right: 46, top: 20, bottom: 34 },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: true,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
        axisTick: { show: false },
        axisLabel: { color: '#7b819a', fontSize: 10 },
      },
      yAxis: [
        {
          type: 'value',
          name: 'BTC Index',
          splitNumber: 3,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#7b819a', fontSize: 10, formatter: (value) => value.toFixed(0) },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
        },
        {
          type: 'value',
          name: 'Liq (B)',
          position: 'right',
          splitNumber: 3,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#7b819a', fontSize: 10, formatter: (value) => `${value.toFixed(1)}B` },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'BTC Price',
          type: 'line',
          smooth: true,
          symbol: 'none',
          yAxisIndex: 0,
          lineStyle: { width: 3, color: '#f5a623' },
          itemStyle: { color: '#f5a623' },
          data: active.series.find((series) => series.id === 'btc')?.values || [],
        },
        {
          name: 'Liquidations',
          type: 'bar',
          yAxisIndex: 1,
          barWidth: '42%',
          itemStyle: {
            color: 'rgba(240,74,94,0.78)',
            borderRadius: [4, 4, 0, 0],
          },
          data: active.series.find((series) => series.id === 'liq')?.values || [],
        },
      ],
    };
  }

  _buildMacroMetricOption(active, metricId) {
    const visibleSeries = active.series.filter((series) => this._macroVisibility[series.id] ?? true);
    const fallbackSeries = visibleSeries.length ? visibleSeries : [active.series[0]];
    const valuesBySeries = active.metrics?.[metricId] || {};
    return {
      ...this._buildChartBase(),
      grid: { left: 42, right: 18, top: 20, bottom: 34 },
      xAxis: {
        type: 'category',
        data: active.dates.map((date) => fmt.date(date)),
        boundaryGap: false,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
        axisTick: { show: false },
        axisLabel: { color: '#7b819a', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        splitNumber: 3,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#7b819a', fontSize: 10, formatter: (value) => value.toFixed(0) },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      },
      tooltip: {
        ...this._buildChartBase().tooltip,
        formatter: (params) => {
          const title = params?.[0]?.axisValueLabel || '';
          const rows = params.map((item) => {
            const value = Number(item.value).toFixed(1);
            return `<div style="display:flex;justify-content:space-between;gap:16px;"><span>${item.marker}${item.seriesName}</span><strong>${value}</strong></div>`;
          }).join('');
          return `<div style="font-size:10px;color:#8e94aa;margin-bottom:6px;">${title}</div>${rows}`;
        },
      },
      series: fallbackSeries.map((series) => ({
        name: series.label,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2.6, color: series.color },
        itemStyle: { color: series.color },
        data: valuesBySeries[series.id] || series.values,
      })),
    };
  }

  _getMacroChartOption(key) {
    const active = this._getActiveMacro();
    if (!active) return null;
    if (key === 'liquidations' && active.id === 'btc-price-liquidations') {
      return this._buildLiquidationsOption(active);
    }
    if (active.id === 'btc-vs-metals' && ['price', 'volume', 'marketCap'].includes(key)) {
      return this._buildMacroMetricOption(active, key);
    }
    return null;
  }

  _syncMacroCharts() {
    if (!this.renderRoot) return;
    const hosts = [...this.renderRoot.querySelectorAll('[data-echart-key]')];
    const present = new Set();

    hosts.forEach((host) => {
      const key = host.dataset.echartKey;
      const option = this._getMacroChartOption(key);
      if (!key || !option) return;
      present.add(key);
      let chart = this._macroCharts.get(key);
      if (!chart) {
        chart = init(host, null, { renderer: 'canvas' });
        this._macroCharts.set(key, chart);
      }
      chart.setOption(option, true);
      chart.resize();
    });

    [...this._macroCharts.keys()].forEach((key) => {
      if (!present.has(key)) {
        this._macroCharts.get(key)?.dispose();
        this._macroCharts.delete(key);
      }
    });
  }

  _renderMacroComparison(active) {
    const metricConfigs = [
      { id: 'price', label: 'Price', description: 'Relative price performance' },
      { id: 'volume', label: 'Volume', description: 'Relative trading volume' },
      { id: 'marketCap', label: 'Market Cap', description: 'Relative market capitalization' },
    ];
    const visibleMetrics = metricConfigs.filter((metric) => this._macroMetricVisibility[metric.id]);

    return html`
      <div class="macro-toggle-row metrics">
        ${metricConfigs.map((metric) => html`
          <button class="macro-toggle ${this._macroMetricVisibility[metric.id] ? 'active' : ''}" @click=${() => this._toggleMacroMetric(metric.id)}>
            <span>${metric.label}</span>
          </button>
        `)}
      </div>

      <div class="macro-toggle-row">
        ${active.series.map((series) => html`
          <button class="macro-toggle ${(this._macroVisibility[series.id] ?? true) ? 'active' : ''}" @click=${() => this._toggleMacroSeries(series.id)}>
            <span class="macro-toggle-swatch" style="background:${series.color}"></span>
            <span>${series.label}</span>
          </button>
        `)}
      </div>

      ${visibleMetrics.map((metric) => html`
        <div class="macro-chart-card macro-chart-wide">
          <div class="macro-meta-label" style="margin-bottom:10px">${metric.label} · ${metric.description} · base 100</div>
          <div class="macro-echart compact" data-echart-key="${metric.id}"></div>
        </div>
      `)}
    `;
  }

  _renderLiquidationChart() {
    return html`
      <div class="macro-chart-card macro-chart-wide">
        <div class="macro-meta-label" style="margin-bottom:10px">BTC price crossed with liquidation pressure</div>
        <div class="macro-echart compact" data-echart-key="liquidations"></div>
      </div>
    `;
  }

  _renderMacroSignals() {
    const tabs = this._getMacroTabs();
    const active = this._getActiveMacro();

    return html`
      <div class="panel macro-shell">
        <div class="macro-topbar">
          <div>
            <div class="panel-title" style="margin-bottom:8px">
              <span class="panel-title-label">${active.title}</span>
              <span class="panel-kicker">${active.kicker}</span>
            </div>
            <div class="macro-main">
              <div>
                <div class="macro-value">${active.value}</div>
                <div class="macro-sub">${active.subtitle}</div>
              </div>
              <div class="macro-delta ${active.deltaTone || ''}">${active.delta}</div>
            </div>
          </div>
          <div class="macro-tabs">
            ${tabs.map((tab) => html`
              <button class="macro-tab ${this._macroTab === tab.id ? 'active' : ''}" @click=${() => { this._macroTab = tab.id; }}>
                ${tab.label}
              </button>
            `)}
          </div>
        </div>

        <div class="macro-meta">
          ${active.meta.map((item) => html`
            <div class="macro-meta-card">
              <div class="macro-meta-label">${item.label}</div>
              <div class="macro-meta-value">${item.value}</div>
            </div>
          `)}
        </div>

        ${active.id === 'btc-vs-metals' ? this._renderMacroComparison(active) : active.id === 'btc-price-liquidations' ? this._renderLiquidationChart() : html`
          <div class="gauge-grid">
            ${active.series.map((series) => this._renderGauge(series, active))}
          </div>
        `}

        <div class="macro-axis">
          <span>Range: ${fmt.date(active.startDate)} - ${fmt.date(active.dates.at(-1))}</span>
          <span>Resolution: 1D candles</span>
          <span>Latest: ${fmt.date(active.dates.at(-1))}</span>
        </div>

        <div class="macro-legend">
          ${active.series.map((series) => html`
            <div class="macro-legend-item">
              <span class="macro-legend-swatch" style="background:${series.color}"></span>
              <span>${series.label}</span>
            </div>
          `)}
        </div>

        <div class="macro-insight">${active.insight}</div>
      </div>
    `;
  }

  _renderKpiGrid() {
    const d = this._data;
    const kpis = [
      { label: 'Total Capital', value: fmt.usd(d.totalCapital), accent: 'neutral', mono: true },
      { label: 'Free USDT', value: fmt.usd(d.freeUsdt), accent: 'accent', mono: true, sub: `${((d.freeUsdt / d.totalCapital) * 100).toFixed(1)}% of total` },
      { label: 'Open PnL', value: fmt.pnl(d.openPnl), accent: d.openPnl >= 0 ? 'positive' : 'negative', mono: true },
      { label: 'Monthly PnL', value: fmt.pnl(d.monthlyPnl), accent: d.monthlyPnl >= 0 ? 'positive' : 'negative', mono: true },
      { label: 'Risk Score', value: `${d.riskScore}/100`, accent: d.riskScore < 50 ? 'positive' : d.riskScore < 70 ? 'warning' : 'negative', sub: fmt.riskLabel(d.riskScore) },
      { label: 'Active Miners', value: '$38,000', accent: 'accent', mono: true, sub: '7 positions' },
      { label: 'Scalping', value: fmt.usd(d.capitalScalp), accent: 'neutral', mono: true, sub: 'futures mode' },
      { label: 'BTC Core', value: fmt.usd(d.capitalBtcCore), accent: 'neutral', mono: true, sub: '0.418 BTC' },
      { label: 'BTC Ladder', value: fmt.usd(d.capitalLadder), accent: 'neutral', mono: true, sub: '3/12 filled' },
    ];

    return html`
      <div class="kpi-grid">
        ${kpis.map((kpi) => html`
          <stat-card label=${kpi.label} value=${kpi.value} accent=${kpi.accent} .sub=${kpi.sub || ''} ?mono=${kpi.mono || false}></stat-card>
        `)}
      </div>
    `;
  }

  _renderAllocationAndLiquidity() {
    const d = this._data;
    return html`
      <div class="row-2col">
        <div class="panel">
          <div class="panel-title">
            <span class="panel-title-label">Capital Allocation</span>
            <span style="font-size:var(--text-xs);color:var(--color-text-muted)">Total: ${fmt.usd(d.totalCapital)}</span>
          </div>
          <allocation-chart .items=${d.capitalAllocation}></allocation-chart>
        </div>

        <div class="panel">
          <div class="panel-title">Liquidity vs Exposure</div>
          <div class="liquidity-bar-wrap">
            <div class="liq-header">
              <span>Deployed: ${fmt.usd(d.liquidity.exposure)} (${d.liquidity.exposurePct.toFixed(1)}%)</span>
              <span>Free: ${fmt.usd(d.liquidity.free)}</span>
            </div>
            <div class="liq-track">
              <div class="liq-fill" style="width:${d.liquidity.exposurePct}%"></div>
              <div class="liq-free"></div>
            </div>
            <div class="liq-legend">
              <div class="liq-legend-item">
                <div class="liq-dot" style="background:var(--color-accent)"></div>
                <span style="font-size:var(--text-xs);color:var(--color-text-muted)">Deployed capital</span>
              </div>
              <div class="liq-legend-item">
                <div class="liq-dot" style="background:var(--color-positive-dim)"></div>
                <span style="font-size:var(--text-xs);color:var(--color-text-muted)">Available liquidity</span>
              </div>
            </div>
          </div>

          <div style="margin-top:var(--space-5);padding-top:var(--space-4);border-top:1px solid var(--color-border-subtle)">
            <div class="panel-title" style="margin-bottom:var(--space-3)">Monthly Goal Progress</div>
            <div class="goal-header">
              <span class="goal-amount">${fmt.usd(d.monthlyPnl)}</span>
              <span class="goal-target">Target: ${fmt.usd(d.monthlyGoal)}</span>
            </div>
            <progress-bar value=${d.monthlyGoalProgress} color="var(--color-positive)" height="8" showPct sublabel="On track - ${(100 - d.monthlyGoalProgress).toFixed(1)}% remaining this month"></progress-bar>
          </div>
        </div>
      </div>
    `;
  }

  _renderAlerts() {
    const icons = { danger: '!', warning: '!', info: 'i' };
    return html`
      <div class="panel">
        <div class="panel-title">
          <span class="panel-title-label">
            Priority Alerts
            <span style="font-size:var(--text-xs);background:var(--color-negative-dim);color:var(--color-negative);padding:1px 6px;border-radius:var(--radius-sm);font-weight:600">${this._data.alerts.filter((alert) => alert.level === 'danger').length}</span>
          </span>
        </div>
        ${this._data.alerts.map((alert) => html`
          <div class="alert-item alert-${alert.level}">
            <span class="alert-icon">${icons[alert.level]}</span>
            <span class="alert-text">${alert.message}</span>
            <span class="alert-time">${alert.time}</span>
          </div>
        `)}
      </div>
    `;
  }

  _renderAdvisorContent() {
    const adv = this._data.advisor;
    switch (this._advisorTab) {
      case 'summary':
        return html`<p class="advisor-summary">${adv.executiveSummary}</p>`;
      case 'recommendations':
        return html`${adv.recommendations.map((rec) => html`
          <div class="rec-card">
            <div class="rec-priority">${rec.priority}</div>
            <div class="rec-body">
              <div class="rec-category">${rec.category}</div>
              <div class="rec-action">${rec.action}</div>
              <div class="rec-rationale">${rec.rationale}</div>
              <div class="rec-impact">Up ${rec.impact} · Risk: ${rec.risk}</div>
            </div>
          </div>
        `)}`;
      case 'risk':
        return html`${adv.riskSuggestions.map((item) => html`<div class="risk-sug"><span>!</span>${item}</div>`)}`;
      case 'tips':
        return html`${adv.educationalTips.map((tip) => html`
          <div class="tip-card">
            <div class="tip-title">${tip.title}</div>
            <div class="tip-body">${tip.body}</div>
          </div>
        `)}`;
      case 'warnings':
        return html`${adv.warnings.map((warning) => html`
          <div class="warning-item-advisor ${warning.level}"><span>!</span>${warning.text}</div>
        `)}`;
      case 'whatif':
        return html`
          <div class="whatif-placeholder">
            <div class="whatif-icon">?</div>
            <div class="whatif-label">What-If Simulation Engine</div>
            <div class="whatif-sub">AI-powered scenario modeling - coming in a future release.<br>Will support capital reallocation scenarios, drawdown simulations, and strategy stress tests.</div>
          </div>
        `;
      default:
        return '';
    }
  }

  _renderAdvisor() {
    const adv = this._data.advisor;
    const tabs = [
      { id: 'summary', label: 'Executive Summary' },
      { id: 'recommendations', label: 'Recommendations' },
      { id: 'risk', label: 'Risk Suggestions' },
      { id: 'tips', label: 'Educational Tips' },
      { id: 'warnings', label: `Warnings (${adv.warnings.length})` },
      { id: 'whatif', label: 'What-If (Soon)' },
    ];

    return html`
      <div class="advisor-panel">
        <div class="advisor-header">
          <div class="advisor-title">
            <span>Portfolio Advisor</span>
            <span class="advisor-chip">AI Copilot</span>
          </div>
          <span class="advisor-timestamp">Updated ${Math.round((Date.now() - adv.generatedAt) / 60000)}m ago · Mock data</span>
        </div>
        <div class="advisor-tabs">
          ${tabs.map((tab) => html`
            <div class="advisor-tab ${this._advisorTab === tab.id ? 'active' : ''}" @click=${() => { this._advisorTab = tab.id; }}>
              ${tab.label}
            </div>
          `)}
        </div>
        <div class="advisor-content">${this._renderAdvisorContent()}</div>
      </div>
    `;
  }

  _renderRecommendedActions() {
    return html`
      <div class="panel">
        <div class="panel-title">Recommended Next Actions</div>
        ${this._data.recommendedActions.map((action) => html`
          <div class="action-item" @click=${() => router.navigate(action.route)}>
            <div class="action-left">
              <div class="urgency-dot urgency-${action.urgency}"></div>
              <span class="action-label">${action.label}</span>
            </div>
            <span class="action-arrow">></span>
          </div>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      <div class="page">
        ${this._renderKpiGrid()}
        ${this._renderMacroSignals()}
        ${this._renderAllocationAndLiquidity()}
        <div class="row-2col">
          ${this._renderAlerts()}
          ${this._renderRecommendedActions()}
        </div>
        ${this._renderAdvisor()}
      </div>
    `;
  }
}

customElements.define('overview-view', OverviewView);
