import { LitElement, html, css } from 'lit';
import { btcCoreMock } from '../../mocks/btc-core.mock.js';
import { fmt } from '../../utils/format.js';
import { sleep } from '../../utils/polling.js';
import { buttonStyles } from '../../styles/shared-styles.js';
import { getLanguage } from '../../services/i18n.js';

class BtcCoreView extends LitElement {
  static properties = {
    _data: { type: Object, state: true },
    _modal: { type: String, state: true },
    _buyAmount: { type: Number, state: true },
    _lang: { type: String, state: true },
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
    this._lang = getLanguage();
  }

  connectedCallback() {
    super.connectedCallback();
    this._localeListener = () => {
      this._lang = getLanguage();
      this.requestUpdate();
    };
    window.addEventListener('capintel-locale-changed', this._localeListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('capintel-locale-changed', this._localeListener);
  }

  _t(es, en) {
    return this._lang === 'en' ? en : es;
  }

  async _executeBuy() {
    await sleep(1500);
    const btcAcquired = (this._buyAmount / this._data.config.btcPrice).toFixed(5);
    return {
      success: true,
      message: this._t(
        `Compra ejecutada: ${btcAcquired} BTC a ${fmt.usd(this._data.config.btcPrice, 0)}. Total: ${fmt.usd(this._buyAmount, 2)}.`,
        `Purchase executed: ${btcAcquired} BTC at ${fmt.usd(this._data.config.btcPrice, 0)}. Total: ${fmt.usd(this._buyAmount, 2)}.`,
      ),
    };
  }

  render() {
    const data = this._data;

    return html`
      <div class="page">
        <div class="two-col">
          <div class="panel">
            <div class="panel-title">${this._t('Progreso de acumulación BTC', 'BTC Accumulation Progress')}</div>
            <div class="btc-progress-display">
              <div class="btc-main">${fmt.btc(data.config.currentBtc)}</div>
              <div class="btc-target">${this._t('de', 'of')} ${fmt.btc(data.config.targetBtc)} ${this._t('objetivo', 'target')} · ${data.progress.pctToTarget.toFixed(1)}% ${this._t('completado', 'complete')}</div>
              <progress-bar value=${data.progress.pctToTarget} color="var(--color-warning)" height="10" showPct></progress-bar>
              <div class="btc-sub">≈ ${fmt.usd(data.progress.usdValue)}</div>
            </div>
            <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--color-border-subtle)">
              <div class="config-field"><span class="cf-label">${this._t('Restante', 'Remaining')}</span><span class="cf-value" style="color:var(--color-text-muted)">${fmt.btc(data.progress.remaining)}</span></div>
              <div class="config-field"><span class="cf-label">${this._t('Restante (USD)', 'Remaining (USD)')}</span><span class="cf-value">${fmt.usd(data.progress.remainingUsd)}</span></div>
              <div class="config-field"><span class="cf-label">${this._t('Precio actual BTC', 'Current BTC Price')}</span><span class="cf-value">${fmt.usd(data.config.btcPrice)}</span></div>
              <div class="config-field"><span class="cf-label">${this._t('Presupuesto mensual', 'Monthly Budget')}</span><span class="cf-value">${fmt.usd(data.config.monthlyBudget)}</span></div>
              <div class="config-field"><span class="cf-label">${this._t('Meses al objetivo', 'Months to Target')}</span><span class="cf-value">${fmt.number(data.progress.remainingUsd / data.config.monthlyBudget, 1)}</span></div>
            </div>
          </div>

          <div>
            <div class="panel" style="margin-bottom:var(--space-4)">
              <div class="panel-title">${this._t('Historial de compras', 'Purchase History')}</div>
              ${data.purchases.map((purchase) => html`
                <div class="purchase-row">
                  <span class="pr-date">${purchase.date}</span>
                  <span class="pr-amount">${fmt.btc(purchase.amount)}</span>
                  <span class="pr-price">@ ${fmt.usd(purchase.price)}</span>
                  <span class="pr-usd">${fmt.usd(purchase.usd, 2)}</span>
                </div>
                <div style="padding:0 0 var(--space-2) 0;font-size:var(--text-xs);color:var(--color-text-disabled);border-bottom:1px solid var(--color-border-subtle)">${purchase.note}</div>
              `)}
            </div>

            <div class="panel">
              <div class="panel-title">${this._t('Compra manual', 'Manual Buy')}</div>
              <div class="buy-section">
                <numeric-input
                  label="${this._t('Monto USDT', 'USDT Amount')}"
                  .value=${this._buyAmount}
                  min="10"
                  max="50000"
                  step="100"
                  prefix="$"
                  @change=${(event) => { this._buyAmount = event.detail; }}
                  style="flex:1"
                ></numeric-input>
                <div style="font-size:var(--text-xs);color:var(--color-text-muted);white-space:nowrap">
                  ≈ ${(this._buyAmount / data.config.btcPrice).toFixed(6)} BTC
                </div>
                <button class="btn btn-warning" @click=${() => { this._modal = 'buy'; }}>${this._t('Comprar BTC ->', 'Buy BTC ->')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${this._modal === 'buy' ? html`
        <preview-execute-modal
          title="${this._t('Comprar BTC', 'Buy BTC')}"
          subtitle="${this._t('Compra manual de mercado para la estrategia BTC Core.', 'Manual market buy for the BTC Core strategy.')}"
          domain="btc-core"
          .payload=${[
            { label: this._t('Gasto', 'Spend'), value: fmt.usd(this._buyAmount, 2) },
            { label: this._t('Precio BTC', 'BTC Price'), value: fmt.usd(data.config.btcPrice) },
            { label: this._t('BTC recibido', 'BTC Received'), value: `≈ ${(this._buyAmount / data.config.btcPrice).toFixed(6)} BTC` },
            { label: this._t('Nuevo total', 'New Total'), value: `≈ ${(data.config.currentBtc + this._buyAmount / data.config.btcPrice).toFixed(5)} BTC` },
          ]}
          .warnings=${[this._t('Compra a mercado: el precio final puede diferir del estimado.', 'Market buy: final execution price may differ from the estimate.')]}
          dangerLevel="warning"
          confirmText="${this._t('Comprar BTC', 'Buy BTC')}"
          .executeFn=${() => this._executeBuy()}
          @closed=${() => { this._modal = null; }}
          @executed=${() => {
            window.toast?.(this._t('Compra BTC ejecutada', 'BTC purchase executed'), { type: 'success' });
            this._modal = null;
          }}
        ></preview-execute-modal>
      ` : ''}
    `;
  }
}

customElements.define('btc-core-view', BtcCoreView);
