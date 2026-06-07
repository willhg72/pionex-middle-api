import { LitElement, html, css } from 'lit';
import { discoveryMock } from '../../mocks/discovery.mock.js';
import { fmt } from '../../utils/format.js';
import { domainState } from '../../utils/domain-state.js';
import { buttonStyles } from '../../styles/shared-styles.js';
import { getLanguage } from '../../services/i18n.js';

const DOMAIN = 'discovery';

class DiscoveryView extends LitElement {
  static properties = {
    _data: { type: Object, state: true },
    _segment: { type: String, state: true },
    _search: { type: String, state: true },
    _lang: { type: String, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-5); }
    .toolbar { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
    .search-input { padding: var(--space-2) var(--space-3); flex: 1; max-width: 280px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-3); }
    .symbol-card {
      background: var(--color-bg-card); border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg); padding: var(--card-padding);
      transition: all var(--transition-fast);
    }
    .symbol-card:hover { border-color: var(--color-border-default); }
    .symbol-card.promote { border-left: 3px solid var(--color-accent); }
    .symbol-card.watch { border-left: 3px solid var(--color-warning); }
    .symbol-card.rejected { border-left: 3px solid var(--color-idle); opacity: 0.6; }
    .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); }
    .sym-name { font-size: var(--text-lg); font-weight: var(--weight-bold); font-family: var(--font-mono); }
    .trend-badge { font-size: var(--text-xs); padding: 2px 7px; border-radius: var(--radius-sm); font-weight: var(--weight-semibold); }
    .trend-bullish { background: var(--color-positive-dim); color: var(--color-positive); }
    .trend-bearish { background: var(--color-negative-dim); color: var(--color-negative); }
    .trend-neutral { background: var(--color-idle-dim); color: var(--color-idle); }
    .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); margin-bottom: var(--space-3); }
    .met { display: flex; flex-direction: column; gap: 2px; }
    .met-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    .met-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .met-value.good { color: var(--color-positive); }
    .met-value.bad { color: var(--color-negative); }
    .card-actions { display: flex; gap: var(--space-2); }
    .card-actions button { flex: 1; }
  `];

  constructor() {
    super();
    this._data = discoveryMock;
    const saved = domainState.load(DOMAIN);
    this._segment = saved.segment || 'all';
    this._search = saved.search || '';
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

  _setSegment(value) {
    this._segment = value;
    domainState.save(DOMAIN, { segment: value, search: this._search });
  }

  _setSearch(value) {
    this._search = value;
    domainState.save(DOMAIN, { segment: this._segment, search: value });
  }

  _filtered() {
    let items = this._data.universe;
    if (this._segment !== 'all') items = items.filter((symbol) => symbol.segment === this._segment);
    if (this._search) items = items.filter((symbol) => symbol.ticker.toLowerCase().includes(this._search.toLowerCase()));
    return items;
  }

  _trendLabel(trend) {
    if (trend === 'bullish') return this._t('alcista', 'bullish');
    if (trend === 'bearish') return this._t('bajista', 'bearish');
    return this._t('neutral', 'neutral');
  }

  _renderCard(symbol) {
    return html`
      <div class="symbol-card ${symbol.segment}">
        <div class="card-header">
          <span class="sym-name">${symbol.ticker}</span>
          <span class="trend-badge trend-${symbol.trend}">${this._trendLabel(symbol.trend)}</span>
        </div>
        <div class="metrics">
          <div class="met"><span class="met-label">${this._t('Vol 24h', '24h Vol')}</span><span class="met-value">${fmt.compact(symbol.vol24h)}</span></div>
          <div class="met"><span class="met-label">${this._t('Trades 24h', '24h Trades')}</span><span class="met-value">${fmt.number(symbol.trades24h / 1000, 0)}K</span></div>
          <div class="met"><span class="met-label">${this._t('Volatilidad', 'Volatility')}</span><span class="met-value ${symbol.volatility > 60 ? 'good' : ''}">${symbol.volatility}%</span></div>
          <div class="met"><span class="met-label">Funding</span><span class="met-value ${symbol.fundingRate < 0 ? 'good' : 'bad'}">${fmt.number(symbol.fundingRate * 100, 3)}%</span></div>
        </div>
        ${symbol.segment !== 'rejected' ? html`
          <div class="card-actions">
            ${symbol.segment === 'watch' ? html`
              <button class="btn btn-ghost btn-sm" @click=${() => window.toast?.(this._t(`${symbol.ticker} sigue en observación`, `${symbol.ticker} kept in watch list`), { type: 'info' })}>
                ${this._t('Seguir observando', 'Keep Watching')}
              </button>
            ` : ''}
            <button class="btn btn-primary btn-sm" @click=${() => window.toast?.(this._t(`${symbol.ticker} promovido a Oportunidades`, `${symbol.ticker} promoted to Opportunities`), { type: 'success' })}>
              ${this._t('Promover ->', 'Promote ->')}
            </button>
          </div>
        ` : html`
          <div class="card-actions">
            <button class="btn btn-ghost btn-sm" @click=${() => window.toast?.(this._t(`${symbol.ticker} movido a observación`, `${symbol.ticker} moved to watch list`), { type: 'info' })}>
              ${this._t('Reconsiderar', 'Reconsider')}
            </button>
          </div>
        `}
      </div>
    `;
  }

  render() {
    const items = this._filtered();
    const counts = { promote: 0, watch: 0, rejected: 0 };
    this._data.universe.forEach((symbol) => {
      counts[symbol.segment] = (counts[symbol.segment] || 0) + 1;
    });

    return html`
      <div class="page">
        <div class="toolbar">
          <segmented-control
            .options=${[
              { value: 'all', label: `${this._t('Universo', 'Universe')} (${this._data.universe.length})` },
              { value: 'promote', label: `${this._t('Promover', 'Promote')} (${counts.promote || 0})` },
              { value: 'watch', label: `${this._t('Observando', 'Watching')} (${counts.watch || 0})` },
              { value: 'rejected', label: `${this._t('Descartados', 'Rejected')} (${counts.rejected || 0})` },
            ]}
            value=${this._segment}
            @change=${(event) => this._setSegment(event.detail)}
          ></segmented-control>
          <input
            class="search-input"
            type="search"
            placeholder=${this._t('Buscar ticker...', 'Search ticker...')}
            .value=${this._search}
            @input=${(event) => this._setSearch(event.target.value)}
          />
          <button class="btn btn-ghost" @click=${() => window.toast?.(this._t('Escaneo del universo lanzado', 'Universe scan triggered'), { type: 'info' })}>
            ↻ ${this._t('Escanear universo', 'Scan Universe')}
          </button>
        </div>
        <div class="grid">
          ${items.map((symbol) => this._renderCard(symbol))}
          ${items.length === 0 ? html`<empty-view label="${this._t('No hay símbolos que coincidan con tus filtros', 'No symbols match your filters')}"></empty-view>` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('discovery-view', DiscoveryView);
