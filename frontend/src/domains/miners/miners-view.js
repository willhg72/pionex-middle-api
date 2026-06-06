import { LitElement, html, css } from 'lit';
import { fmt } from '../../utils/format.js';
import { domainState } from '../../utils/domain-state.js';
import { buttonStyles } from '../../styles/shared-styles.js';
import { minersService } from '../../services/miners.service.js';

const DOMAIN = 'miners';

class MinersView extends LitElement {
  static properties = {
    _data: { type: Object, state: true },
    _balance: { type: Object, state: true },
    _loading: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _filter: { type: String, state: true },
    _expandedId: { type: String, state: true },
    _details: { type: Object, state: true },
    _closeCtx: { type: Object, state: true },
    _regridCtx: { type: Object, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .toolbar { display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center; }
    .hero { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-4); }
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
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 9px; border-radius: 999px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
    .badge.ok { background: var(--color-positive-dim); color: var(--color-positive); }
    .badge.warning { background: var(--color-warning-dim); color: var(--color-warning); }
    .badge.danger { background: var(--color-negative-dim); color: var(--color-negative); }
    .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); }
    .metric { display: flex; flex-direction: column; gap: 2px; }
    .metric-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    .metric-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .metric-value.pos { color: var(--color-positive); }
    .metric-value.neg { color: var(--color-negative); }
    .warning-banner { padding: 8px 10px; border-radius: var(--radius-md); background: var(--color-warning-dim); color: var(--color-warning); font-size: var(--text-xs); }
    .actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
    .actions .btn { flex: 1; min-width: 0; }
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
      .metrics { grid-template-columns: repeat(2, 1fr); }
      .detail-grid { grid-template-columns: 1fr; }
      .chart-modal { flex-direction: column; height: 94dvh; }
      .chart-left { min-height: 280px; border-right: 0; border-bottom: 1px solid var(--color-border-subtle); }
      .chart-right { width: 100%; }
    }
  `];

  constructor() {
    super();
    this._data = { miners: [], summary: { active: 0, totalCapital: 0, openPnl: 0, dailyPnl: 0, warnings: 0, avgGridGap: '0.00' } };
    this._balance = null;
    this._loading = true;
    this._error = '';
    this._filter = domainState.load(DOMAIN).filter || 'all';
    this._expandedId = '';
    this._details = {};
    this._closeCtx = null;
    this._regridCtx = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  async _load() {
    this._loading = true;
    this._error = '';
    try {
      const [data, balance] = await Promise.all([
        minersService.getMiners(),
        minersService.getBalance().catch(() => null),
      ]);
      this._data = data;
      this._balance = balance;
    } catch (error) {
      this._error = error?.data?.detail || error?.message || 'Could not load active miners.';
    } finally {
      this._loading = false;
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
          error: error?.data?.detail || error?.message || 'Could not load miner detail.',
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
      window.toast?.(error?.data?.detail || error?.message || 'Could not prepare close preview.', { type: 'error' });
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
    return { success: Boolean(result?.ok), message: result?.ok ? `${miner?.ticker} closed on Pionex.` : 'Close failed.' };
  }

  async _checkStabilization(miner) {
    try {
      const result = await minersService.checkStabilization(miner);
      const existing = this._details[miner.buOrderId] || {};
      this._details = { ...this._details, [miner.buOrderId]: { ...existing, stabilization: result } };
      window.toast?.(result?.decisionReason || 'Stabilization check completed.', { type: 'info' });
      if (this._expandedId !== miner.buOrderId) await this._toggleExpanded(miner);
    } catch (error) {
      window.toast?.(error?.data?.detail || error?.message || 'Stabilization check failed.', { type: 'error' });
    }
  }

  async _openRegrid(miner) {
    this._regridCtx = { miner, loading: true, preview: null, result: null };
    try {
      const preview = await minersService.previewRegrid(miner);
      this._regridCtx = { miner, loading: false, preview, result: null };
    } catch (error) {
      this._regridCtx = { miner, loading: false, preview: null, error: error?.data?.detail || error?.message || 'Could not build regrid preview.' };
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
      return html`<div class="panel"><div class="panel-title">Account Balance</div><div class="hint">Balance not available right now.</div></div>`;
    }
    return html`
      <div class="panel">
        <div class="panel-title">Account Balance</div>
        <div class="detail-grid">
          <div class="detail"><div class="detail-title">USDT Free</div><div class="detail-value">${fmt.usd(Number(balance?.usdt?.free || 0), 2)}</div></div>
          <div class="detail"><div class="detail-title">USDT Total</div><div class="detail-value">${fmt.usd(Number(balance?.usdt?.total || 0), 2)}</div></div>
          <div class="detail"><div class="detail-title">Estimated Total</div><div class="detail-value">${fmt.usd(Number(balance?.estimatedTotalUsd || 0), 2)}</div></div>
          <div class="detail"><div class="detail-title">Assets</div><div class="detail-value">${Number(balance?.assetsCount || 0)}</div></div>
        </div>
      </div>
    `;
  }

  _renderExpanded(miner) {
    const detail = this._details[miner.buOrderId] || {};
    const stabilization = detail.stabilization;
    return html`
      <div class="expanded">
        <div class="detail-grid">
          <div class="detail"><div class="detail-title">BU Order</div><div class="detail-value">${miner.buOrderId}</div></div>
          <div class="detail"><div class="detail-title">Range Health</div><div class="detail-value">${miner.rangeHealth || '—'}</div></div>
          <div class="detail"><div class="detail-title">Inventory Ratio</div><div class="detail-value">${fmt.pctPlain(Number(miner.inventoryRatio || 0) * 100, 1)}</div></div>
          <div class="detail"><div class="detail-title">Target Daily</div><div class="detail-value">${fmt.usd(Number(miner.targetDailyUsdt || 0), 2)}</div></div>
          <div class="detail"><div class="detail-title">Trend PnL</div><div class="detail-value">${fmt.pnl(Number(miner.trendPnl || 0), 2)}</div></div>
          <div class="detail"><div class="detail-title">Grid Profit</div><div class="detail-value">${fmt.pnl(Number(miner.gridProfit || 0), 2)}</div></div>
        </div>

        ${miner.inventoryGate ? html`
          <div class="section">
            <div class="section-title">Inventory Gate</div>
            <div class="mini-item"><strong>${miner.inventoryGate.label || 'Gate'}</strong><br />${miner.inventoryGate.detail || 'No extra detail.'}</div>
          </div>
        ` : ''}

        ${miner.harvestPolicy ? html`
          <div class="section">
            <div class="section-title">Harvest Policy</div>
            <div class="mini-item"><strong>${miner.harvestPolicy.action || 'Policy'}</strong><br />${miner.harvestPolicy.detail || 'No extra detail.'}</div>
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
            <span class="badge ${riskClass}">${riskClass === 'ok' ? 'healthy' : riskClass}</span>
          </div>

          ${miner.warning ? html`<div class="warning-banner">${miner.warning}</div>` : ''}

          <div class="metrics">
            <div class="metric"><span class="metric-label">Close PnL</span><span class="metric-value ${Number(miner.openPnl || 0) >= 0 ? 'pos' : 'neg'}">${fmt.pnl(Number(miner.openPnl || 0), 2)}</span></div>
            <div class="metric"><span class="metric-label">Grid PnL</span><span class="metric-value ${Number(miner.dailyPnl || 0) >= 0 ? 'pos' : 'neg'}">${fmt.pnl(Number(miner.dailyPnl || 0), 2)}</span></div>
            <div class="metric"><span class="metric-label">Capital</span><span class="metric-value">${fmt.usd(Number(miner.capital || 0), 2)}</span></div>
            <div class="metric"><span class="metric-label">Range Position</span><span class="metric-value">${fmt.pctPlain(Number(miner.rangePosition || 0) * 100, 1)}</span></div>
            <div class="metric"><span class="metric-label">Inventory</span><span class="metric-value">${fmt.pctPlain(Number(miner.inventoryRatio || 0) * 100, 1)}</span></div>
            <div class="metric"><span class="metric-label">Target / Day</span><span class="metric-value">${fmt.usd(Number(miner.targetDailyUsdt || 0), 2)}</span></div>
          </div>

          <div class="actions" @click=${(event) => event.stopPropagation()}>
            <button class="btn btn-ghost btn-sm" @click=${() => this._checkStabilization(miner)}>Check Stabilization</button>
            <button class="btn btn-warning btn-sm" @click=${() => this._openRegrid(miner)}>Preview Regrid</button>
            <button class="btn btn-danger btn-sm" @click=${() => this._openClose(miner)}>Close</button>
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

  render() {
    if (this._loading) return html`<loading-view label="Loading active miners"></loading-view>`;
    if (this._error) return html`<error-view label="Active miners unavailable" .sub=${this._error}></error-view>`;

    const summary = this._data?.summary || {};
    const miners = this._filteredMiners();

    return html`
      <div class="page">
        <div class="toolbar">
          <segmented-control
            .options=${[
              { value: 'all', label: `All (${this._data?.miners?.length || 0})` },
              { value: 'warnings', label: `Warnings (${summary.warnings || 0})` },
              { value: 'danger', label: 'Critical' },
            ]}
            value=${this._filter}
            @change=${(event) => this._setFilter(event.detail)}
          ></segmented-control>
          <button class="btn btn-ghost" @click=${() => this._load()}>Refresh</button>
        </div>

        <div class="hero">
          <div class="panel">
            <div class="panel-title">Miner KPIs</div>
            <div class="kpi-row">
              <stat-card label="Active Miners" value="${summary.active || 0}" accent="accent"></stat-card>
              <stat-card label="Capital" value="${fmt.usd(Number(summary.totalCapital || 0), 2)}" accent="neutral" mono></stat-card>
              <stat-card label="Close PnL" value="${fmt.pnl(Number(summary.openPnl || 0), 2)}" accent="${Number(summary.openPnl || 0) >= 0 ? 'positive' : 'negative'}" mono></stat-card>
              <stat-card label="Grid PnL" value="${fmt.pnl(Number(summary.dailyPnl || 0), 2)}" accent="${Number(summary.dailyPnl || 0) >= 0 ? 'positive' : 'negative'}" mono></stat-card>
              <stat-card label="Warnings" value="${summary.warnings || 0}" accent="${summary.warnings ? 'negative' : 'positive'}"></stat-card>
              <stat-card label="Avg Gap" value="${summary.avgGridGap || '0.00'}%" accent="neutral" mono></stat-card>
            </div>
          </div>
          ${this._renderBalancePanel()}
        </div>

        <div class="miners-grid">
          ${miners.map((miner) => this._renderMinerCard(miner))}
          ${!miners.length ? html`<empty-view label="No miners match this filter"></empty-view>` : ''}
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
