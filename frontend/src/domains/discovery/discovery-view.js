import { LitElement, html, css } from 'lit';
import { discoveryMock } from '../../mocks/discovery.mock.js';
import { fmt } from '../../utils/format.js';
import { domainState } from '../../utils/domain-state.js';
import { buttonStyles } from '../../styles/shared-styles.js';

const DOMAIN = 'discovery';

class DiscoveryView extends LitElement {
  static properties = {
    _data:    { type: Object, state: true },
    _segment: { type: String, state: true },
    _search:  { type: String, state: true },
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
    .symbol-card.watch   { border-left: 3px solid var(--color-warning); }
    .symbol-card.rejected{ border-left: 3px solid var(--color-idle); opacity: 0.6; }

    .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); }
    .sym-name { font-size: var(--text-lg); font-weight: var(--weight-bold); font-family: var(--font-mono); }
    .trend-badge { font-size: var(--text-xs); padding: 2px 7px; border-radius: var(--radius-sm); font-weight: var(--weight-semibold); }
    .trend-bullish { background: var(--color-positive-dim); color: var(--color-positive); }
    .trend-bearish { background: var(--color-negative-dim); color: var(--color-negative); }
    .trend-neutral { background: var(--color-idle-dim);     color: var(--color-idle); }

    .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); margin-bottom: var(--space-3); }
    .met { display: flex; flex-direction: column; gap: 2px; }
    .met-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    .met-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .met-value.good { color: var(--color-positive); }
    .met-value.bad  { color: var(--color-negative); }

    .card-actions { display: flex; gap: var(--space-2); }
    .card-actions button { flex: 1; }
  `];

  constructor() {
    super();
    this._data = discoveryMock;
    const saved = domainState.load(DOMAIN);
    this._segment = saved.segment || 'all';
    this._search  = saved.search  || '';
  }

  _setSegment(v) {
    this._segment = v;
    domainState.save(DOMAIN, { segment: v, search: this._search });
  }

  _setSearch(v) {
    this._search = v;
    domainState.save(DOMAIN, { segment: this._segment, search: v });
  }

  _filtered() {
    let items = this._data.universe;
    if (this._segment !== 'all') items = items.filter(s => s.segment === this._segment);
    if (this._search) items = items.filter(s => s.ticker.toLowerCase().includes(this._search.toLowerCase()));
    return items;
  }

  _renderCard(sym) {
    return html`
      <div class="symbol-card ${sym.segment}">
        <div class="card-header">
          <span class="sym-name">${sym.ticker}</span>
          <span class="trend-badge trend-${sym.trend}">${sym.trend}</span>
        </div>

        <div class="metrics">
          <div class="met"><span class="met-label">Vol 24h</span><span class="met-value">${fmt.compact(sym.vol24h)}</span></div>
          <div class="met"><span class="met-label">Trades 24h</span><span class="met-value">${(sym.trades24h / 1000).toFixed(0)}K</span></div>
          <div class="met"><span class="met-label">Volatility</span><span class="met-value ${sym.volatility > 60 ? 'good' : ''}">${sym.volatility}%</span></div>
          <div class="met"><span class="met-label">Funding</span><span class="met-value ${sym.fundingRate < 0 ? 'good' : 'bad'}">${(sym.fundingRate * 100).toFixed(3)}%</span></div>
        </div>

        ${sym.segment !== 'rejected' ? html`
          <div class="card-actions">
            ${sym.segment === 'watch' ? html`
              <button class="btn btn-ghost btn-sm" @click=${() => window.toast?.(`${sym.ticker} kept in watch list`, { type: 'info' })}>Keep Watching</button>
            ` : ''}
            <button class="btn btn-primary btn-sm" @click=${() => window.toast?.(`${sym.ticker} promoted to Opportunities`, { type: 'success' })}>
              Promote →
            </button>
          </div>
        ` : html`
          <div class="card-actions">
            <button class="btn btn-ghost btn-sm" @click=${() => window.toast?.(`${sym.ticker} moved to watch list`, { type: 'info' })}>Reconsider</button>
          </div>
        `}
      </div>
    `;
  }

  render() {
    const items = this._filtered();
    const counts = { promote: 0, watch: 0, rejected: 0 };
    this._data.universe.forEach(s => counts[s.segment] = (counts[s.segment] || 0) + 1);

    return html`
      <div class="page">
        <div class="toolbar">
          <segmented-control
            .options=${[
              { value: 'all',      label: `Universe (${this._data.universe.length})` },
              { value: 'promote',  label: `Promote (${counts.promote || 0})` },
              { value: 'watch',    label: `Watching (${counts.watch || 0})` },
              { value: 'rejected', label: `Rejected (${counts.rejected || 0})` },
            ]}
            value=${this._segment}
            @change=${e => this._setSegment(e.detail)}
          ></segmented-control>
          <input
            class="search-input"
            type="search"
            placeholder="Search ticker..."
            .value=${this._search}
            @input=${e => this._setSearch(e.target.value)}
          />
          <button class="btn btn-ghost" @click=${() => window.toast?.('Universe scan triggered', { type: 'info' })}>↻ Scan Universe</button>
        </div>

        <div class="grid">
          ${items.map(s => this._renderCard(s))}
          ${items.length === 0 ? html`<empty-view label="No symbols match your filters"></empty-view>` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('discovery-view', DiscoveryView);
