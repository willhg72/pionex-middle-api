import { LitElement, html, css } from 'lit';
import { scalpingMock } from '../../mocks/scalping.mock.js';
import { fmt } from '../../utils/format.js';
import { domainState } from '../../utils/domain-state.js';
import { buttonStyles } from '../../styles/shared-styles.js';

const DOMAIN = 'scalping';

class ScalpingView extends LitElement {
  static properties = {
    _data:    { type: Object, state: true },
    _mode:    { type: String, state: true },
    _tab:     { type: String, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-5); }
    .top-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--space-3); }
    .two-col { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-4); }
    @media (max-width: 1000px) { .two-col { grid-template-columns: 1fr; } }

    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-4); display: flex; align-items: center; justify-content: space-between; }

    .signal-card {
      display: flex; align-items: center; gap: var(--space-4);
      padding: var(--space-3); background: var(--color-bg-elevated);
      border-radius: var(--radius-md); margin-bottom: var(--space-2);
      border-left: 3px solid transparent;
    }
    .signal-card.strong { border-left-color: var(--color-positive); }
    .signal-card.medium { border-left-color: var(--color-warning); }
    .signal-card.weak   { border-left-color: var(--color-idle); }

    .sig-dir { font-size: var(--text-xs); font-weight: var(--weight-bold); padding: 3px 8px; border-radius: var(--radius-sm); letter-spacing: 0.08em; }
    .sig-dir.long  { background: var(--color-positive-dim); color: var(--color-positive); }
    .sig-dir.short { background: var(--color-negative-dim); color: var(--color-negative); }

    .sig-ticker { font-size: var(--text-md); font-weight: var(--weight-semibold); font-family: var(--font-mono); }
    .sig-meta   { font-size: var(--text-xs); color: var(--color-text-muted); }

    .sig-levels { display: flex; gap: var(--space-4); margin-left: auto; font-size: var(--text-xs); font-family: var(--font-mono); }
    .sig-level-item { display: flex; flex-direction: column; gap: 2px; align-items: flex-end; }
    .sig-level-label { color: var(--color-text-muted); }
    .sig-rr { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-accent); min-width: 40px; text-align: right; }
    .sig-confidence { font-size: var(--text-xs); color: var(--color-text-muted); min-width: 50px; text-align: right; }

    .config-fields { display: flex; flex-direction: column; gap: var(--space-3); }
    .field-row { display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border-subtle); }
    .field-row:last-child { border-bottom: none; }
    .field-label { font-size: var(--text-sm); color: var(--color-text-secondary); }
    .field-val { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }

    .monitor-row { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3); background: var(--color-bg-elevated); border-radius: var(--radius-md); margin-bottom: var(--space-2); }
    .mon-ticker { font-family: var(--font-mono); font-weight: var(--weight-semibold); width: 80px; }
    .mon-pnl { font-family: var(--font-mono); font-weight: var(--weight-semibold); }
    .mon-actions { margin-left: auto; display: flex; gap: var(--space-2); }

    .journal-row { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-3); border-bottom: 1px solid var(--color-border-subtle); }
    .journal-row:last-child { border-bottom: none; }
    .jour-date { font-size: var(--text-xs); color: var(--color-text-muted); min-width: 70px; }
    .jour-body { flex: 1; font-size: var(--text-sm); }
    .jour-pnl { font-family: var(--font-mono); font-weight: var(--weight-semibold); min-width: 80px; text-align: right; }

    .daily-progress { padding: var(--space-3); background: var(--color-bg-elevated); border-radius: var(--radius-md); margin-bottom: var(--space-4); }
    .dp-header { display: flex; justify-content: space-between; margin-bottom: var(--space-2); font-size: var(--text-sm); }
    .dp-range { font-size: var(--text-xs); color: var(--color-text-muted); }

    .scan-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--color-border-subtle); margin-bottom: var(--space-3); }
    .scan-tab { padding: var(--space-2) var(--space-3); font-size: var(--text-xs); font-weight: var(--weight-medium); color: var(--color-text-muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all var(--transition-fast); }
    .scan-tab.active { color: var(--color-accent); border-bottom-color: var(--color-accent); }
    .scan-tab:hover { color: var(--color-text-secondary); }
  `];

  constructor() {
    super();
    this._data = scalpingMock;
    const saved = domainState.load(DOMAIN);
    this._mode = saved.mode || 'futures';
    this._tab  = saved.tab  || 'signals';
  }

  _setMode(v) {
    this._mode = v;
    domainState.save(DOMAIN, { mode: v, tab: this._tab });
  }

  _setTab(v) {
    this._tab = v;
    domainState.save(DOMAIN, { mode: this._mode, tab: v });
  }

  _renderSignals() {
    return html`
      <div class="panel">
        <div class="panel-title">
          Scan Signals
          <segmented-control
            .options=${[{value:'futures',label:'Futures'},{value:'spot',label:'Spot'}]}
            value=${this._mode}
            @change=${e => this._setMode(e.detail)}
          ></segmented-control>
        </div>
        <div class="scan-tabs">
          <div class="scan-tab ${this._tab === 'signals' ? 'active' : ''}" @click=${() => this._setTab('signals')}>Live Signals</div>
          <div class="scan-tab ${this._tab === 'monitors' ? 'active' : ''}" @click=${() => this._setTab('monitors')}>Active Monitors</div>
          <div class="scan-tab ${this._tab === 'journal' ? 'active' : ''}" @click=${() => this._setTab('journal')}>Trade Journal</div>
        </div>

        ${this._tab === 'signals' ? this._data.signals.map(s => html`
          <div class="signal-card ${s.strength}">
            <span class="sig-dir ${s.direction.toLowerCase()}">${s.direction}</span>
            <div>
              <div class="sig-ticker">${s.ticker}</div>
              <div class="sig-meta">${s.timeframe} · ${new Date(s.ts).toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit',hour12:false})}</div>
            </div>
            <div class="sig-levels">
              <div class="sig-level-item"><span class="sig-level-label">Entry</span><span>${s.entry.toLocaleString()}</span></div>
              <div class="sig-level-item"><span class="sig-level-label">SL</span><span style="color:var(--color-negative)">${s.sl.toLocaleString()}</span></div>
              <div class="sig-level-item"><span class="sig-level-label">TP</span><span style="color:var(--color-positive)">${s.tp.toLocaleString()}</span></div>
            </div>
            <div><div class="sig-rr">R:R ${s.rr}</div><div class="sig-confidence">${s.confidence}% conf</div></div>
          </div>
        `) : ''}

        ${this._tab === 'monitors' ? this._data.monitors.map(m => html`
          <div class="monitor-row">
            <span class="mon-ticker">${m.ticker}</span>
            <span class="mon-pnl" style="color:${m.pnl >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'}">${fmt.pnl(m.pnl)}</span>
            <div class="mon-actions">
              <button class="btn btn-ghost btn-sm">Close TP</button>
              <button class="btn btn-danger btn-sm">Stop</button>
            </div>
          </div>
        `) : ''}

        ${this._tab === 'journal' ? this._data.journal.map(j => html`
          <div class="journal-row">
            <span class="jour-date">${j.date}</span>
            <div class="jour-body">
              <div style="font-size:var(--text-xs);font-weight:var(--weight-semibold);margin-bottom:2px">${j.ticker} · ${j.direction}</div>
              <div style="font-size:var(--text-xs);color:var(--color-text-muted)">${j.notes}</div>
            </div>
            <span class="jour-pnl" style="color:${j.pnl >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'}">${fmt.pnl(j.pnl)}</span>
          </div>
        `) : ''}
      </div>
    `;
  }

  render() {
    const s = this._data.stats;
    const c = this._data.config;

    return html`
      <div class="page">
        <div class="top-row">
          <stat-card label="Today PnL"    value="${fmt.pnl(s.todayPnl)}"         accent="positive" mono></stat-card>
          <stat-card label="Today Trades" value="${s.todayTrades}"                accent="neutral"></stat-card>
          <stat-card label="Win Rate"     value="${s.winRate.toFixed(1)}%"        accent="${s.winRate > 55 ? 'positive' : 'warning'}" mono></stat-card>
          <stat-card label="Weekly PnL"   value="${fmt.pnl(s.weeklyPnl)}"         accent="positive" mono></stat-card>
          <stat-card label="Sharpe"       value="${s.sharpeRatio.toFixed(2)}"     accent="accent" mono></stat-card>
          <stat-card label="Avg Win"      value="${fmt.pnl(s.avgWin)}"            accent="positive" mono></stat-card>
        </div>

        <div class="daily-progress">
          <div class="dp-header">
            <span style="font-size:var(--text-sm);font-weight:var(--weight-semibold)">Daily Target Progress</span>
            <span style="font-family:var(--font-mono);color:var(--color-positive)">${fmt.pnl(s.todayPnl)}</span>
          </div>
          <progress-bar value=${s.dailyProgress} color="var(--color-positive)" height="8" showPct></progress-bar>
          <div class="dp-range">Target range: ${fmt.usd(c.dailyTargetMin)} – ${fmt.usd(c.dailyTargetMax)}</div>
        </div>

        <div class="two-col">
          ${this._renderSignals()}

          <div class="panel">
            <div class="panel-title">Configuration</div>
            <div class="config-fields">
              <div class="field-row"><span class="field-label">Mode</span><span class="field-val">${c.mode.toUpperCase()}</span></div>
              <div class="field-row"><span class="field-label">Risk / Trade</span><span class="field-val">${c.riskPerTrade}%</span></div>
              <div class="field-row"><span class="field-label">Leverage</span><span class="field-val">${fmt.leverage(c.leverage)}</span></div>
              <div class="field-row"><span class="field-label">Capital</span><span class="field-val">${fmt.usd(c.capitalAllocated)}</span></div>
              <div class="field-row"><span class="field-label">Daily Target</span><span class="field-val">${fmt.usd(c.dailyTargetMin)} – ${fmt.usd(c.dailyTargetMax)}</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('scalping-view', ScalpingView);
