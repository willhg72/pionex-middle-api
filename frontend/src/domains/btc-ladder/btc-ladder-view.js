import { LitElement, html, css } from 'lit';
import { fmt } from '../../utils/format.js';
import { domainState } from '../../utils/domain-state.js';
import { buttonStyles } from '../../styles/shared-styles.js';
import { btcLadderService } from '../../services/btc-ladder.service.js';

const DOMAIN = 'btc-ladder';

function safeNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

class BtcLadderView extends LitElement {
  static properties = {
    _data: { type: Object, state: true },
    _price: { type: Number, state: true },
    _loading: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _capitalUsdt: { type: Number, state: true },
    _levels: { type: Number, state: true },
    _maxDipPct: { type: Number, state: true },
    _limitUsdt: { type: Number, state: true },
    _limitPrice: { type: Number, state: true },
    _placeCtx: { type: Object, state: true },
    _cancelCtx: { type: Boolean, state: true },
    _limitCtx: { type: Object, state: true },
    _fillCtx: { type: Object, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .toolbar { display: flex; gap: var(--space-3); flex-wrap: wrap; }
    .hero { display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-4); }
    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }
    .chart-frame { width: 100%; height: 380px; border: none; border-radius: var(--radius-md); background: var(--color-bg-elevated); }
    .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
    .summary-box { padding: 12px; border-radius: var(--radius-md); background: var(--color-bg-elevated); }
    .summary-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 4px; }
    .summary-value { font-family: var(--font-mono); font-size: var(--text-md); }
    .kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--space-3); }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label { font-size: var(--text-xs); color: var(--color-text-muted); letter-spacing: 0.08em; text-transform: uppercase; }
    .field input { width: 100%; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px 12px; font-size: var(--text-sm); text-align: left; border-bottom: 1px solid var(--color-border-subtle); }
    th { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    td.mono { font-family: var(--font-mono); }
    .status { display: inline-flex; align-items: center; padding: 4px 8px; border-radius: 999px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }
    .status.open, .status.placed { background: var(--color-idle-dim); color: var(--color-text-secondary); }
    .status.partial_filled { background: var(--color-warning-dim); color: var(--color-warning); }
    .status.filled { background: var(--color-positive-dim); color: var(--color-positive); }
    .status.closed_unknown { background: var(--color-negative-dim); color: var(--color-negative); }
    .plan-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-2); }
    .plan-card { padding: 10px; border-radius: var(--radius-md); background: var(--color-bg-elevated); }
    .plan-title { font-size: 10px; color: var(--color-text-muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
    .plan-main { font-family: var(--font-mono); font-size: var(--text-sm); }
    .hint { font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.5; }
    .inline-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    @media (max-width: 900px) {
      .hero { grid-template-columns: 1fr; }
      .form-grid { grid-template-columns: 1fr; }
      .plan-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `];

  constructor() {
    super();
    const saved = domainState.load(DOMAIN);
    this._data = { inventory: {}, ladderOrders: [], reconciliation: { statusCounts: {} } };
    this._price = 0;
    this._loading = true;
    this._error = '';
    this._capitalUsdt = saved.capitalUsdt || 120;
    this._levels = saved.levels || 6;
    this._maxDipPct = saved.maxDipPct || 18;
    this._limitUsdt = saved.limitUsdt || 30;
    this._limitPrice = saved.limitPrice || 0;
    this._placeCtx = null;
    this._cancelCtx = false;
    this._limitCtx = null;
    this._fillCtx = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  _persistDraft() {
    domainState.save(DOMAIN, {
      capitalUsdt: this._capitalUsdt,
      levels: this._levels,
      maxDipPct: this._maxDipPct,
      limitUsdt: this._limitUsdt,
      limitPrice: this._limitPrice,
    });
  }

  async _load() {
    this._loading = true;
    this._error = '';
    try {
      const [dashboard, spot] = await Promise.all([
        btcLadderService.getDashboard(),
        btcLadderService.getPrice().catch(() => null),
      ]);
      this._data = dashboard || this._data;
      this._price = Number(spot?.price || this._price || 0);
      if (!this._limitPrice && this._price > 0) this._limitPrice = this._price * 0.96;
      this._persistDraft();
    } catch (error) {
      this._error = error?.data?.detail || error?.message || 'Could not load BTC ladder.';
    } finally {
      this._loading = false;
    }
  }

  _buildPlanRows() {
    const price = safeNum(this._price);
    const capital = safeNum(this._capitalUsdt);
    const levels = Math.max(2, Math.min(12, Number(this._levels || 6)));
    const maxDip = Math.max(2, Math.min(40, Number(this._maxDipPct || 18)));
    if (!price || !capital) return [];
    const weights = Array.from({ length: levels }, (_, idx) => idx + 1);
    const totalWeight = weights.reduce((sum, value) => sum + value, 0);
    const step = maxDip / levels;
    return weights.map((weight, index) => {
      const discountPct = step * (index + 1);
      const levelPrice = price * (1 - discountPct / 100);
      const usdt = capital * (weight / totalWeight);
      const btc = usdt / levelPrice;
      return { idx: index + 1, discountPct, levelPrice, usdt, btc };
    });
  }

  async _refreshStatuses(autoLedger = false) {
    try {
      const result = await btcLadderService.reconcile({ autoLedger });
      this._data = {
        ...this._data,
        ladderOrders: result.orders || this._data.ladderOrders,
        reconciliation: { statusCounts: result.statusCounts || {} },
      };
      if (autoLedger) await this._load();
      window.toast?.(`Checked ${result.checkedCount} ladder orders.`, { type: 'info' });
    } catch (error) {
      window.toast?.(error?.data?.detail || error?.message || 'Could not reconcile ladder orders.', { type: 'error' });
    }
  }

  async _openLimitPreview() {
    try {
      const preview = await btcLadderService.previewLimit({ usdtAmount: this._limitUsdt, limitPrice: this._limitPrice });
      this._limitCtx = preview;
    } catch (error) {
      window.toast?.(error?.data?.detail || error?.message || 'Could not preview limit order.', { type: 'error' });
    }
  }

  async _executePlaceAll() {
    const result = await btcLadderService.placeAll({
      capitalUsdt: this._capitalUsdt,
      levels: this._levels,
      maxDipPct: this._maxDipPct,
    });
    await this._load();
    return { success: Boolean(result?.ok), message: `${result?.placedCount || 0} ladder orders placed on Pionex.` };
  }

  async _executeCancelAll() {
    const result = await btcLadderService.cancelAll();
    await this._refreshStatuses(false);
    return { success: Boolean(result?.ok), message: `${result?.cancelledCount || 0} open ladder orders cancelled.` };
  }

  async _executeLimit() {
    const result = await btcLadderService.executeLimit({ confirmationToken: this._limitCtx?.confirmationToken });
    await this._load();
    return { success: Boolean(result?.ok), message: result?.ok ? 'BTC ladder limit order placed on Pionex.' : (result?.error_message || 'Order failed.') };
  }

  async _confirmFill() {
    const row = this._fillCtx;
    const result = await btcLadderService.confirmFill({
      btcAmount: Number(row?.filledBtcAmount || row?.btcAmount || 0),
      usdtAmount: Number(row?.filledUsdtAmount || row?.usdtAmount || 0),
      price: Number(row?.price || 0),
      note: `manual ledger confirmation from new dashboard for ${row?.orderId || 'ladder-order'}`,
    });
    await this._refreshStatuses(false);
    return { success: Boolean(result?.ok), message: 'BTC fill added to ledger.' };
  }

  _renderChart() {
    const symbol = encodeURIComponent('BINANCE:BTCUSDT');
    const tvUrl = `https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=240&theme=dark&style=1&locale=en&hide_top_toolbar=0&hide_side_toolbar=0&allow_symbol_change=0&drawings_access=all&save_image=1`;
    return html`<iframe class="chart-frame" src="${tvUrl}"></iframe>`;
  }

  _renderSummary() {
    const inventory = this._data?.inventory || {};
    const counts = this._data?.reconciliation?.statusCounts || {};
    return html`
      <div class="panel">
        <div class="panel-title">Ladder Reconciliation</div>
        <div class="summary-grid">
          <div class="summary-box"><div class="summary-label">Total BTC Ledger</div><div class="summary-value">${fmt.btc(safeNum(inventory.totalBtc), 8)}</div></div>
          <div class="summary-box"><div class="summary-label">Average Cost</div><div class="summary-value">${inventory.averagePrice ? fmt.usd(safeNum(inventory.averagePrice), 2) : '—'}</div></div>
          <div class="summary-box"><div class="summary-label">Pending USDT</div><div class="summary-value">${fmt.usd(safeNum(inventory.pendingUsdt), 2)}</div></div>
          <div class="summary-box"><div class="summary-label">Orders</div><div class="summary-value">O ${counts.open || 0} · P ${counts.partial_filled || 0} · F ${counts.filled || 0}</div></div>
        </div>
        <div class="hint" style="margin-top:12px">
          Los estados open y partial_filled salen de las open orders de Pionex. Si una orden desaparece de open orders pero no hay fill confirmado suficiente, queda en closed_unknown para evitar contaminar el ledger.
        </div>
      </div>
    `;
  }

  _renderPlan() {
    const rows = this._buildPlanRows();
    return html`
      <div class="panel">
        <div class="panel-title">Ladder Plan</div>
        <div class="form-grid">
          <div class="field">
            <label>Capital USDT</label>
            <input type="number" .value=${String(this._capitalUsdt)} @input=${(event) => { this._capitalUsdt = Number(event.target.value); this._persistDraft(); }} />
          </div>
          <div class="field">
            <label>Levels</label>
            <input type="number" min="2" max="12" .value=${String(this._levels)} @input=${(event) => { this._levels = Number(event.target.value); this._persistDraft(); }} />
          </div>
          <div class="field">
            <label>Max Dip %</label>
            <input type="number" min="2" max="40" .value=${String(this._maxDipPct)} @input=${(event) => { this._maxDipPct = Number(event.target.value); this._persistDraft(); }} />
          </div>
          <div class="field">
            <label>Spot Price</label>
            <input type="number" .value=${String(Number(this._price || 0).toFixed(2))} @input=${(event) => { this._price = Number(event.target.value); this._persistDraft(); }} />
          </div>
        </div>
        <div class="inline-actions" style="margin-top:12px">
          <button class="btn btn-primary" @click=${() => { this._placeCtx = { rows }; }}>Place Full Ladder</button>
          <button class="btn btn-danger" @click=${() => { this._cancelCtx = true; }}>Cancel Open Orders</button>
          <button class="btn btn-ghost" @click=${() => this._refreshStatuses(false)}>Refresh Statuses</button>
          <button class="btn btn-warning" @click=${() => this._refreshStatuses(true)}>Refresh + Auto Ledger</button>
        </div>
        <div class="plan-grid" style="margin-top:12px">
          ${rows.map((row) => html`
            <div class="plan-card">
              <div class="plan-title">L${row.idx} · -${row.discountPct.toFixed(1)}%</div>
              <div class="plan-main">${fmt.usd(row.levelPrice, 2)}</div>
              <div class="hint">${fmt.usd(row.usdt, 2)} · ${fmt.btc(row.btc, 6)}</div>
            </div>
          `)}
          ${!rows.length ? html`<div class="hint">Load a price and valid capital to compute a ladder plan.</div>` : ''}
        </div>
      </div>
    `;
  }

  _renderManualLimit() {
    return html`
      <div class="panel">
        <div class="panel-title">Single Ladder Limit</div>
        <div class="form-grid">
          <div class="field">
            <label>USDT Amount</label>
            <input type="number" .value=${String(this._limitUsdt)} @input=${(event) => { this._limitUsdt = Number(event.target.value); this._persistDraft(); }} />
          </div>
          <div class="field">
            <label>Limit Price</label>
            <input type="number" .value=${String(Number(this._limitPrice || 0).toFixed(2))} @input=${(event) => { this._limitPrice = Number(event.target.value); this._persistDraft(); }} />
          </div>
        </div>
        <div class="inline-actions" style="margin-top:12px">
          <button class="btn btn-primary" @click=${() => this._openLimitPreview()}>Preview Real Limit Order</button>
        </div>
      </div>
    `;
  }

  _renderOrders() {
    const rows = Array.isArray(this._data?.ladderOrders) ? this._data.ladderOrders : [];
    return html`
      <div class="panel">
        <div class="panel-title">Latest Ladder Orders</div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Price</th>
                <th>USDT</th>
                <th>BTC</th>
                <th>Filled</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => html`
                <tr>
                  <td class="mono">${row.orderId}</td>
                  <td class="mono">${fmt.usd(safeNum(row.price), 2)}</td>
                  <td class="mono">${fmt.usd(safeNum(row.usdtAmount), 2)}</td>
                  <td class="mono">${fmt.btc(safeNum(row.btcAmount), 8)}</td>
                  <td class="mono">${fmt.btc(safeNum(row.filledBtcAmount || 0), 8)}</td>
                  <td><span class="status ${row.status || 'placed'}">${row.status || 'placed'}</span></td>
                  <td>
                    ${(row.status === 'closed_unknown' || row.status === 'partial_filled') ? html`
                      <button class="btn btn-ghost btn-sm" @click=${() => { this._fillCtx = row; }}>Confirm Fill</button>
                    ` : html`<span class="hint">${row.reconciled ? 'ledger ok' : '—'}</span>`}
                  </td>
                </tr>
              `)}
              ${!rows.length ? html`<tr><td colspan="7" class="hint">No ladder orders yet. Place the ladder from the plan above.</td></tr>` : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  render() {
    if (this._loading) return html`<loading-view label="Loading BTC ladder"></loading-view>`;
    if (this._error) return html`<error-view label="BTC ladder unavailable" .sub=${this._error}></error-view>`;

    const inventory = this._data?.inventory || {};
    return html`
      <div class="page">
        <div class="toolbar">
          <button class="btn btn-ghost" @click=${() => this._load()}>Refresh Dashboard</button>
        </div>

        <div class="hero">
          <div class="panel">
            <div class="panel-title">BTC Ladder Chart</div>
            ${this._renderChart()}
          </div>
          ${this._renderSummary()}
        </div>

        <div class="kpi-row">
          <stat-card label="BTC Ledger" value="${fmt.btc(safeNum(inventory.totalBtc), 8)}" accent="accent"></stat-card>
          <stat-card label="USDT Invested" value="${fmt.usd(safeNum(inventory.totalUsdt), 2)}" accent="neutral" mono></stat-card>
          <stat-card label="DCA Source" value="${fmt.btc(safeNum(inventory.dcaBtc), 8)}" accent="warning"></stat-card>
          <stat-card label="Ladder Source" value="${fmt.btc(safeNum(inventory.ladderBtc), 8)}" accent="positive"></stat-card>
        </div>

        ${this._renderPlan()}
        ${this._renderManualLimit()}
        ${this._renderOrders()}
      </div>

      ${this._placeCtx ? html`
        <preview-execute-modal
          title="Place Full Ladder"
          subtitle="${this._levels} live BTC spot limit orders on Pionex"
          domain="btc-ladder"
          .payload=${[
            { label: 'Capital', value: fmt.usd(this._capitalUsdt, 2) },
            { label: 'Levels', value: this._levels },
            { label: 'Max Dip', value: `${this._maxDipPct}%` },
            { label: 'Reference Price', value: fmt.usd(this._price, 2) },
          ]}
          .warnings=${['This sends real spot LIMIT buy orders to Pionex.', 'Capital will remain locked until orders fill or are cancelled.']}
          dangerLevel="warning"
          confirmText="Place Ladder"
          .executeFn=${() => this._executePlaceAll()}
          @closed=${() => { this._placeCtx = null; }}
          @executed=${() => { this._placeCtx = null; }}
        ></preview-execute-modal>
      ` : ''}

      ${this._cancelCtx ? html`
        <preview-execute-modal
          title="Cancel All Ladder Orders"
          subtitle="Cancel current open BTC ladder spot orders"
          domain="btc-ladder"
          .payload=${[
            { label: 'Pending USDT', value: fmt.usd(safeNum(this._data?.inventory?.pendingUsdt), 2) },
            { label: 'Open Orders', value: this._data?.reconciliation?.statusCounts?.open || 0 },
          ]}
          .warnings=${['Only currently open spot orders will be cancelled.', 'Filled orders stay in the ledger and are not reversed.']}
          dangerLevel="danger"
          confirmText="Cancel Orders"
          .executeFn=${() => this._executeCancelAll()}
          @closed=${() => { this._cancelCtx = false; }}
          @executed=${() => { this._cancelCtx = false; }}
        ></preview-execute-modal>
      ` : ''}

      ${this._limitCtx ? html`
        <preview-execute-modal
          title="Create Ladder Limit Order"
          subtitle="Single live BTC spot limit buy on Pionex"
          domain="btc-ladder"
          .payload=${[
            { label: 'USDT', value: fmt.usd(Number(this._limitCtx.usdtAmount || 0), 2) },
            { label: 'Limit Price', value: fmt.usd(Number(this._limitCtx.limitPrice || 0), 2) },
            { label: 'BTC Size', value: fmt.btc(Number(this._limitCtx.btcAmount || 0), 8) },
          ]}
          .warnings=${[this._limitCtx.warning || 'This will place a real BTC spot limit order.']}
          dangerLevel="warning"
          confirmText="Place Limit"
          .executeFn=${() => this._executeLimit()}
          @closed=${() => { this._limitCtx = null; }}
          @executed=${() => { this._limitCtx = null; }}
        ></preview-execute-modal>
      ` : ''}

      ${this._fillCtx ? html`
        <preview-execute-modal
          title="Confirm Ladder Fill Into Ledger"
          subtitle="${this._fillCtx.orderId}"
          domain="btc-ladder"
          .payload=${[
            { label: 'Order Status', value: this._fillCtx.status || 'unknown' },
            { label: 'BTC', value: fmt.btc(Number(this._fillCtx.filledBtcAmount || this._fillCtx.btcAmount || 0), 8) },
            { label: 'USDT', value: fmt.usd(Number(this._fillCtx.filledUsdtAmount || this._fillCtx.usdtAmount || 0), 2) },
            { label: 'Price', value: fmt.usd(Number(this._fillCtx.price || 0), 2) },
          ]}
          .warnings=${['Use this when Pionex no longer reports the order as open and you want to move the buy into the BTC ledger.', 'If the order was cancelled rather than filled, do not confirm it here.']}
          dangerLevel="warning"
          confirmText="Update Ledger"
          .executeFn=${() => this._confirmFill()}
          @closed=${() => { this._fillCtx = null; }}
          @executed=${() => { this._fillCtx = null; }}
        ></preview-execute-modal>
      ` : ''}
    `;
  }
}

customElements.define('btc-ladder-view', BtcLadderView);
