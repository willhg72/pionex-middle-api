import { LitElement, html, css } from 'lit';
import { opportunitiesMock } from '../../mocks/opportunities.mock.js';
import { fmt } from '../../utils/format.js';
import { sleep } from '../../utils/polling.js';
import { domainState } from '../../utils/domain-state.js';
import { buttonStyles } from '../../styles/shared-styles.js';

const DOMAIN = 'opportunities';

class OpportunitiesView extends LitElement {
  static properties = {
    _candidates:     { type: Array,  state: true },
    _segment:        { type: String, state: true },
    _dragSrc:        { type: Number, state: true },
    _dragOver:       { type: Number, state: true },
    _chartCandidate: { type: Object, state: true },
    _execStep:       { type: String, state: true },
    _execResult:     { type: Object, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-5); }
    .candidates { display: flex; flex-direction: column; gap: var(--space-3); }
    .toolbar { display: flex; gap: var(--space-3); flex-wrap: wrap; }

    /* === Cards === */
    .opp-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
      transition: border-color 0.15s, box-shadow 0.15s, opacity 0.15s, transform 0.15s;
      cursor: grab;
      user-select: none;
    }
    .opp-card:hover { border-color: var(--color-border-default); }
    .opp-card.new { border-left: 3px solid var(--color-accent); }
    .opp-card.rejected { opacity: 0.5; }
    .opp-card.dragging { opacity: 0.3; transform: scale(0.98); cursor: grabbing; }
    .opp-card.drag-over {
      border-color: var(--color-accent);
      box-shadow: 0 -3px 0 0 var(--color-accent) inset, 0 4px 20px rgba(91,141,239,0.15);
    }

    .opp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); }
    .opp-title { display: flex; align-items: center; gap: var(--space-3); }
    .opp-ticker { font-size: var(--text-lg); font-weight: var(--weight-bold); }
    .opp-type   { font-size: var(--text-xs); color: var(--color-text-muted); }

    .score-badge { display: flex; flex-direction: column; align-items: center; min-width: 56px; }
    .score-value { font-size: var(--text-2xl); font-weight: var(--weight-bold); font-family: var(--font-mono); }
    .score-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-muted); }

    .opp-metrics {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: var(--space-3); margin-bottom: var(--space-3);
    }
    @media (max-width: 480px) { .opp-metrics { grid-template-columns: 1fr 1fr; } }
    .met { display: flex; flex-direction: column; gap: 2px; }
    .met-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    .met-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .met-value.pos { color: var(--color-positive); }
    .met-value.neg { color: var(--color-negative); }

    .tech-gate {
      display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap;
      padding: var(--space-3); background: var(--color-bg-elevated);
      border-radius: var(--radius-md); margin-bottom: var(--space-3); font-size: var(--text-xs);
    }
    .gate-item { display: flex; align-items: center; gap: var(--space-1); }
    .gate-label { color: var(--color-text-muted); }
    .gate-value { font-family: var(--font-mono); color: var(--color-text-secondary); }
    .trend-bull { color: var(--color-positive); }
    .trend-bear { color: var(--color-negative); }
    .trend-neu  { color: var(--color-text-muted); }

    .opp-notes { font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-3); line-height: 1.5; }
    .opp-actions { display: flex; gap: var(--space-2); }
    .opp-actions .btn { flex: 1; }
    @media (max-width: 480px) { .opp-actions { flex-direction: column; } }

    /* === Chart + Exec modal === */
    .chart-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.88);
      display: flex; align-items: center; justify-content: center;
      z-index: 200;
      padding: 16px;
      backdrop-filter: blur(6px);
    }
    .chart-modal {
      display: flex;
      width: 96vw; max-width: 1440px;
      height: 88vh; max-height: 920px;
      background: var(--color-bg-panel);
      border-radius: var(--radius-xl);
      overflow: hidden;
      border: 1px solid var(--color-border-default);
      box-shadow: 0 24px 80px rgba(0,0,0,0.75);
    }
    @media (max-width: 900px) {
      .chart-modal { flex-direction: column; height: 95dvh; max-height: none; }
      .chart-left { flex: 1; min-height: 280px; border-right: none; border-bottom: 1px solid var(--color-border-subtle); }
      .chart-right { height: auto; }
    }
    @media (max-width: 600px) {
      .chart-overlay { padding: 0; }
      .chart-modal { width: 100%; height: 100dvh; border-radius: 0; }
      .chart-left { display: none; }
      .chart-right { flex: 1; }
    }

    .chart-left {
      flex: 1; display: flex; flex-direction: column;
      border-right: 1px solid var(--color-border-subtle); min-width: 0;
    }
    .chart-header-bar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 16px;
      background: var(--color-bg-card);
      border-bottom: 1px solid var(--color-border-subtle);
      flex-shrink: 0;
    }
    .chart-ticker-label { font-size: var(--text-md); font-weight: var(--weight-bold); font-family: var(--font-mono); }
    .chart-meta-label   { font-size: var(--text-xs); color: var(--color-text-muted); }
    .tv-frame { flex: 1; width: 100%; border: none; display: block; min-height: 0; }

    .chart-right {
      width: 380px; min-width: 320px;
      display: flex; flex-direction: column;
      overflow-y: auto;
      background: var(--color-bg-panel);
    }
    @media (max-width: 900px) { .chart-right { width: 100%; min-width: 0; } }

    /* Exec panel pieces */
    .exec-header {
      padding: 20px 20px 16px;
      border-bottom: 1px solid var(--color-border-subtle);
      flex-shrink: 0;
    }
    .exec-title { font-size: var(--text-lg); font-weight: var(--weight-bold); }
    .exec-sub   { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 3px; }

    .exec-body { flex: 1; padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }

    .pay-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 0; border-bottom: 1px solid var(--color-border-subtle);
      font-size: var(--text-sm);
    }
    .pay-row:last-child { border-bottom: none; }
    .pay-label { color: var(--color-text-muted); }
    .pay-value { font-family: var(--font-mono); font-weight: var(--weight-semibold); }
    .pay-value.pos { color: var(--color-positive); }

    .exec-warn-list { display: flex; flex-direction: column; gap: 6px; }
    .exec-warn-item {
      display: flex; align-items: flex-start; gap: 6px;
      padding: 8px 10px;
      background: var(--color-warning-dim);
      border-radius: var(--radius-md);
      font-size: var(--text-xs); color: var(--color-warning); line-height: 1.5;
    }

    .confirm-prompt {
      padding: 14px 16px;
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
      font-size: var(--text-sm); color: var(--color-text-secondary);
      line-height: 1.65;
    }
    .confirm-prompt strong { color: var(--color-text-primary); }
    .confirm-prompt p + p { margin-top: 10px; }

    .exec-actions {
      padding: 14px 20px;
      border-top: 1px solid var(--color-border-subtle);
      display: flex; gap: 8px;
      flex-shrink: 0;
    }
    .exec-actions .btn { flex: 1; }

    .exec-pending {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 16px; color: var(--color-text-muted); font-size: var(--text-sm);
    }
    .exec-spinner {
      width: 34px; height: 34px; border-radius: 50%;
      border: 3px solid var(--color-border-default);
      border-top-color: var(--color-accent);
      animation: spin 0.75s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .exec-done {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 14px; padding: 32px;
    }
    .exec-done-icon {
      width: 56px; height: 56px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: bold;
    }
    .exec-done.success .exec-done-icon { background: var(--color-positive-dim); color: var(--color-positive); }
    .exec-done.fail    .exec-done-icon { background: var(--color-negative-dim); color: var(--color-negative); }
    .exec-done-msg {
      text-align: center; font-size: var(--text-sm);
      color: var(--color-text-secondary); line-height: 1.5;
    }

    .chart-close-btn {
      background: none; border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md); color: var(--color-text-muted);
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 13px; transition: all 0.15s; flex-shrink: 0;
    }
    .chart-close-btn:hover { background: var(--color-bg-elevated); color: var(--color-text-primary); }

    .mobile-chart-hint { display: none; font-size: 11px; color: var(--color-text-muted); }
    @media (max-width: 600px) { .mobile-chart-hint { display: block; } }
    .mobile-chart-hint a { color: var(--color-accent); }
  `];

  constructor() {
    super();
    this._candidates = [...opportunitiesMock.candidates];
    this._segment    = 'all';
    this._dragSrc    = -1;
    this._dragOver   = -1;
    this._chartCandidate = null;
    this._execStep   = 'preview';
    this._execResult = null;
    const saved = domainState.load(DOMAIN);
    if (saved.segment) this._segment = saved.segment;
  }

  _setSegment(v) {
    this._segment = v;
    domainState.save(DOMAIN, { segment: v });
  }

  _filtered() {
    if (this._segment === 'all') return this._candidates;
    return this._candidates.filter(c => c.status === this._segment);
  }

  _scoreColor(score) {
    if (score >= 80) return 'var(--color-positive)';
    if (score >= 60) return 'var(--color-accent)';
    if (score >= 40) return 'var(--color-warning)';
    return 'var(--color-negative)';
  }

  /* ── Drag and drop ─────────────────────────────── */
  _idx(c) { return this._candidates.indexOf(c); }

  _onDragStart(e, c) {
    this._dragSrc = this._idx(c);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(this._dragSrc));
  }
  _onDragOver(e, c) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const i = this._idx(c);
    if (this._dragOver !== i) this._dragOver = i;
  }
  _onDrop(e, c) {
    e.preventDefault();
    const dst = this._idx(c);
    if (this._dragSrc < 0 || this._dragSrc === dst) { this._dragSrc = -1; this._dragOver = -1; return; }
    const arr = [...this._candidates];
    const [moved] = arr.splice(this._dragSrc, 1);
    arr.splice(dst, 0, moved);
    this._candidates = arr;
    this._dragSrc = -1; this._dragOver = -1;
  }
  _onDragEnd() { this._dragSrc = -1; this._dragOver = -1; }

  /* ── Chart modal ───────────────────────────────── */
  _openChart(c) {
    this._chartCandidate = c;
    this._execStep = 'preview';
    this._execResult = null;
  }
  _closeChart() {
    this._chartCandidate = null;
    this._execStep = 'preview';
    this._execResult = null;
  }
  async _doExecute() {
    this._execStep = 'executing';
    await sleep(1500);
    this._execResult = { success: true, message: `${this._chartCandidate.ticker} grid miner deployed successfully. Capital locked in position.` };
    this._execStep = 'done';
    window.toast?.(`${this._chartCandidate.ticker} miner created`, { type: 'success' });
  }

  _renderChartModal() {
    const c = this._chartCandidate;
    if (!c) return '';
    const sym = encodeURIComponent(`BYBIT:${c.ticker}`);
    const tvUrl = `https://s.tradingview.com/widgetembed/?symbol=${sym}&interval=240&theme=dark&style=1&locale=en&hide_top_toolbar=0&hide_side_toolbar=0&allow_symbol_change=1&drawings_access=all&save_image=1`;
    return html`
      <div class="chart-overlay" @click=${(e) => { if (e.target === e.currentTarget) this._closeChart(); }}>
        <div class="chart-modal">
          <!-- Left: TradingView chart -->
          <div class="chart-left">
            <div class="chart-header-bar">
              <div>
                <div class="chart-ticker-label">${c.ticker}</div>
                <div class="chart-meta-label">4H · Bybit Perpetual · Technical Analysis</div>
              </div>
              <button class="chart-close-btn" @click=${this._closeChart} title="Close">✕</button>
            </div>
            <iframe src="${tvUrl}" class="tv-frame" frameborder="0" allowtransparency="true" scrolling="no"></iframe>
          </div>
          <!-- Right: Execute panel -->
          <div class="chart-right">
            ${this._renderExecPanel(c)}
          </div>
        </div>
      </div>
    `;
  }

  _renderExecPanel(c) {
    if (this._execStep === 'preview') return html`
      <div class="exec-header">
        <div class="exec-title">Create Grid Miner</div>
        <div class="exec-sub">${c.ticker} · ${c.type}</div>
      </div>
      <div class="exec-body">
        <div>
          ${[
            { label: 'Ticker',       value: c.ticker },
            { label: 'Strategy',     value: c.type },
            { label: 'Capital',      value: fmt.usd(c.capitalRequired) },
            { label: 'Leverage',     value: fmt.leverage(c.leverage) },
            { label: 'Est. Monthly', value: fmt.pnl(c.estimatedMonthly), cls: 'pos' },
            { label: 'Score',        value: `${c.score} / 100` },
          ].map(row => html`
            <div class="pay-row">
              <span class="pay-label">${row.label}</span>
              <span class="pay-value ${row.cls || ''}">${row.value}</span>
            </div>
          `)}
        </div>
        <div class="exec-warn-list">
          <div class="exec-warn-item">⚠ ${fmt.usd(c.capitalRequired)} will be locked in this grid.</div>
          <div class="exec-warn-item">⚠ Perpetual futures carry liquidation risk if price exits the grid.</div>
        </div>
        <p class="mobile-chart-hint">
          Chart hidden on small screens —
          <a href="https://www.tradingview.com/chart/?symbol=BYBIT:${c.ticker}" target="_blank">open in TradingView ↗</a>
        </p>
      </div>
      <div class="exec-actions">
        <button class="btn btn-ghost" @click=${this._closeChart}>Cancel</button>
        <button class="btn btn-primary" @click=${() => this._execStep = 'confirm'}>Review & Confirm →</button>
      </div>
    `;

    if (this._execStep === 'confirm') return html`
      <div class="exec-header">
        <div class="exec-title">Confirm Deployment</div>
        <div class="exec-sub">Verify chart range before committing capital</div>
      </div>
      <div class="exec-body">
        <div class="confirm-prompt">
          <p>You are about to deploy <strong>${fmt.usd(c.capitalRequired)}</strong> into a
          <strong>${c.type}</strong> grid strategy on <strong>${c.ticker}</strong>.</p>
          <p>Verify on the chart that the current price sits inside a viable range.
          RSI: <strong>${c.technicalGate.rsi}</strong> ·
          Support: <strong>${c.technicalGate.support}</strong> ·
          Resistance: <strong>${c.technicalGate.resistance}</strong>.</p>
        </div>
      </div>
      <div class="exec-actions">
        <button class="btn btn-ghost" @click=${() => this._execStep = 'preview'}>← Back</button>
        <button class="btn btn-positive" @click=${() => this._doExecute()}>Deploy Capital ✓</button>
      </div>
    `;

    if (this._execStep === 'executing') return html`
      <div class="exec-pending">
        <div class="exec-spinner"></div>
        <span>Deploying ${c.ticker} grid miner…</span>
      </div>
    `;

    const ok = this._execResult?.success;
    return html`
      <div class="exec-done ${ok ? 'success' : 'fail'}">
        <div class="exec-done-icon">${ok ? '✓' : '✕'}</div>
        <div class="exec-done-msg">${this._execResult?.message || 'An error occurred.'}</div>
        <button class="btn btn-ghost" style="width:100%;margin-top:8px" @click=${this._closeChart}>Close</button>
      </div>
    `;
  }

  _renderCandidate(c) {
    const trendClass = { bullish: 'trend-bull', bearish: 'trend-bear', neutral: 'trend-neu' }[c.technicalGate?.trend] || '';
    const idx = this._idx(c);
    return html`
      <div
        class="opp-card ${c.status} ${this._dragSrc === idx ? 'dragging' : ''} ${this._dragOver === idx ? 'drag-over' : ''}"
        draggable="true"
        @dragstart=${(e) => this._onDragStart(e, c)}
        @dragover=${(e) => this._onDragOver(e, c)}
        @drop=${(e) => this._onDrop(e, c)}
        @dragend=${() => this._onDragEnd()}
      >
        <div class="opp-header">
          <div class="opp-title">
            <div>
              <div class="opp-ticker">${c.ticker}</div>
              <div class="opp-type">${c.type} · ${fmt.leverage(c.leverage)}</div>
            </div>
            <span class="tag ${c.status === 'new' ? 'tag-accent' : c.status === 'watching' ? 'tag-warning' : 'tag-muted'}">${c.status}</span>
          </div>
          <div class="score-badge">
            <span class="score-value" style="color:${this._scoreColor(c.score)}">${c.score}</span>
            <span class="score-label">Score</span>
          </div>
        </div>

        <div class="opp-metrics">
          <div class="met"><span class="met-label">Capital Needed</span><span class="met-value">${fmt.usd(c.capitalRequired)}</span></div>
          <div class="met"><span class="met-label">Est. Monthly</span><span class="met-value pos">${fmt.pnl(c.estimatedMonthly)}</span></div>
          <div class="met"><span class="met-label">Volatility 30d</span><span class="met-value">${c.volatility30d}%</span></div>
          <div class="met"><span class="met-label">Funding Rate</span><span class="met-value ${c.fundingRate < 0 ? 'pos' : 'neg'}">${(c.fundingRate * 100).toFixed(3)}%</span></div>
          <div class="met"><span class="met-label">Volume 24h</span><span class="met-value">${fmt.compact(c.volume24h)}</span></div>
          <div class="met"><span class="met-label">Annual Yield</span><span class="met-value pos">${fmt.pnl(c.estimatedAnnual)}</span></div>
        </div>

        <div class="tech-gate">
          <div class="gate-item"><span class="gate-label">Trend:</span><span class="gate-value ${trendClass}">${c.technicalGate?.trend}</span></div>
          <div class="gate-item"><span class="gate-label">RSI:</span><span class="gate-value">${c.technicalGate?.rsi}</span></div>
          <div class="gate-item"><span class="gate-label">Support:</span><span class="gate-value">${c.technicalGate?.support}</span></div>
          <div class="gate-item"><span class="gate-label">Resistance:</span><span class="gate-value">${c.technicalGate?.resistance}</span></div>
        </div>

        <div class="opp-notes">${c.notes}</div>

        ${c.status !== 'rejected' ? html`
          <div class="opp-actions">
            <button class="btn btn-ghost btn-sm" @click=${(e) => e.stopPropagation()}>Simulate Capital</button>
            <button class="btn btn-primary btn-sm" @click=${(e) => { e.stopPropagation(); this._openChart(c); }}>📈 Create Miner →</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  render() {
    const candidates = this._filtered();
    const counts = { new: 0, watching: 0, rejected: 0 };
    this._candidates.forEach(x => { counts[x.status] = (counts[x.status] || 0) + 1; });

    return html`
      <div class="page">
        <div class="toolbar">
          <segmented-control
            .options=${[
              { value: 'all',      label: `All (${this._candidates.length})` },
              { value: 'new',      label: `New (${counts.new || 0})` },
              { value: 'watching', label: `Watching (${counts.watching || 0})` },
              { value: 'rejected', label: `Rejected (${counts.rejected || 0})` },
            ]}
            value=${this._segment}
            @change=${e => this._setSegment(e.detail)}
          ></segmented-control>
        </div>

        <div class="candidates">
          ${candidates.map(c => this._renderCandidate(c))}
          ${candidates.length === 0 ? html`<empty-view label="No opportunities in this category"></empty-view>` : ''}
        </div>
      </div>

      ${this._renderChartModal()}
    `;
  }
}

customElements.define('opportunities-view', OpportunitiesView);
