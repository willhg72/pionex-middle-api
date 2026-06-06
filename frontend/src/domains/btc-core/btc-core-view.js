import { LitElement, html, css } from 'lit';
import { btcCoreMock } from '../../mocks/btc-core.mock.js';
import { fmt } from '../../utils/format.js';
import { sleep } from '../../utils/polling.js';
import { buttonStyles } from '../../styles/shared-styles.js';

class BtcCoreView extends LitElement {
  static properties = {
    _data:      { type: Object, state: true },
    _modal:     { type: String, state: true },
    _buyAmount: { type: Number, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-5); }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }

    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-4); }

    .btc-progress-display { text-align: center; padding: var(--space-6) 0; }
    .btc-main { font-size: var(--text-4xl); font-weight: var(--weight-bold); font-family: var(--font-mono); letter-spacing: var(--tracking-tighter); color: var(--color-warning); margin-bottom: var(--space-1); }
    .btc-target { font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-5); }
    .btc-sub { font-size: var(--text-lg); color: var(--color-text-secondary); font-family: var(--font-mono); margin-top: var(--space-2); }

    .config-field { display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border-subtle); }
    .config-field:last-child { border-bottom: none; }
    .cf-label { font-size: var(--text-sm); color: var(--color-text-secondary); }
    .cf-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }

    .purchase-row { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border-subtle); font-size: var(--text-sm); }
    .purchase-row:last-child { border-bottom: none; }
    .pr-date { color: var(--color-text-muted); font-size: var(--text-xs); min-width: 80px; }
    .pr-amount { font-family: var(--font-mono); font-weight: var(--weight-semibold); color: var(--color-warning); min-width: 100px; }
    .pr-price { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 90px; }
    .pr-usd { font-family: var(--font-mono); color: var(--color-text-secondary); margin-left: auto; }

    .buy-section { padding: var(--space-4); background: var(--color-bg-elevated); border-radius: var(--radius-md); display: flex; align-items: flex-end; gap: var(--space-3); }
  `];

  constructor() {
    super();
    this._data = btcCoreMock;
    this._modal = null;
    this._buyAmount = 500;
  }

  async _executeBuy() {
    await sleep(1500);
    const btcAcquired = (this._buyAmount / this._data.config.btcPrice).toFixed(5);
    return { success: true, message: `Purchased ${btcAcquired} BTC at $${this._data.config.btcPrice.toLocaleString()}. Total: ${fmt.usd(this._buyAmount, 2)}.` };
  }

  render() {
    const d = this._data;

    return html`
      <div class="page">
        <div class="two-col">
          <div class="panel">
            <div class="panel-title">BTC Accumulation Progress</div>
            <div class="btc-progress-display">
              <div class="btc-main">${fmt.btc(d.config.currentBtc)}</div>
              <div class="btc-target">of ${fmt.btc(d.config.targetBtc)} target · ${d.progress.pctToTarget.toFixed(1)}% complete</div>
              <progress-bar value=${d.progress.pctToTarget} color="var(--color-warning)" height="10" showPct></progress-bar>
              <div class="btc-sub">≈ ${fmt.usd(d.progress.usdValue)}</div>
            </div>

            <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--color-border-subtle)">
              <div class="config-field"><span class="cf-label">Remaining</span><span class="cf-value" style="color:var(--color-text-muted)">${fmt.btc(d.progress.remaining)}</span></div>
              <div class="config-field"><span class="cf-label">Remaining (USD)</span><span class="cf-value">${fmt.usd(d.progress.remainingUsd)}</span></div>
              <div class="config-field"><span class="cf-label">Current BTC Price</span><span class="cf-value">${fmt.usd(d.config.btcPrice)}</span></div>
              <div class="config-field"><span class="cf-label">Monthly Budget</span><span class="cf-value">${fmt.usd(d.config.monthlyBudget)}</span></div>
              <div class="config-field"><span class="cf-label">Months to Target</span><span class="cf-value">${(d.progress.remainingUsd / d.config.monthlyBudget).toFixed(1)}</span></div>
            </div>
          </div>

          <div>
            <div class="panel" style="margin-bottom:var(--space-4)">
              <div class="panel-title">Purchase History</div>
              ${d.purchases.map(p => html`
                <div class="purchase-row">
                  <span class="pr-date">${p.date}</span>
                  <span class="pr-amount">${fmt.btc(p.amount)}</span>
                  <span class="pr-price">@ ${fmt.usd(p.price)}</span>
                  <span class="pr-usd">${fmt.usd(p.usd, 2)}</span>
                </div>
                <div style="padding:0 0 var(--space-2) 0;font-size:var(--text-xs);color:var(--color-text-disabled);border-bottom:1px solid var(--color-border-subtle)">${p.note}</div>
              `)}
            </div>

            <div class="panel">
              <div class="panel-title">Manual Buy</div>
              <div class="buy-section">
                <numeric-input
                  label="USDT Amount"
                  .value=${this._buyAmount}
                  min="10" max="50000" step="100"
                  prefix="$"
                  @change=${e => this._buyAmount = e.detail}
                  style="flex:1"
                ></numeric-input>
                <div style="font-size:var(--text-xs);color:var(--color-text-muted);white-space:nowrap">
                  ≈ ${(this._buyAmount / d.config.btcPrice).toFixed(6)} BTC
                </div>
                <button class="btn btn-warning" @click=${() => this._modal = 'buy'}>Buy BTC →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${this._modal === 'buy' ? html`
        <preview-execute-modal
          title="Buy BTC"
          subtitle="Manual market buy on BTC Core strategy."
          domain="btc-core"
          .payload=${[
            { label: 'Spend',        value: fmt.usd(this._buyAmount, 2) },
            { label: 'BTC Price',    value: fmt.usd(d.config.btcPrice) },
            { label: 'BTC Received', value: `≈ ${(this._buyAmount / d.config.btcPrice).toFixed(6)} BTC` },
            { label: 'New Total',    value: `≈ ${(d.config.currentBtc + this._buyAmount / d.config.btcPrice).toFixed(5)} BTC` },
          ]}
          .warnings=${['Market buy — execution price may differ from quote.']}
          dangerLevel="warning"
          confirmText="Buy BTC"
          .executeFn=${() => this._executeBuy()}
          @closed=${() => this._modal = null}
          @executed=${() => { window.toast?.('BTC purchase executed', { type: 'success' }); this._modal = null; }}
        ></preview-execute-modal>
      ` : ''}
    `;
  }
}

customElements.define('btc-core-view', BtcCoreView);
