import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { fmt } from '../../utils/format.js';
import { domainState } from '../../utils/domain-state.js';
import { buttonStyles } from '../../styles/shared-styles.js';
import { opportunitiesService } from '../../services/opportunities.service.js';

const DOMAIN = 'opportunities';

class OpportunitiesView extends LitElement {
  static properties = {
    _candidates: { type: Array, state: true },
    _summary: { type: Object, state: true },
    _loading: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _segment: { type: String, state: true },
    _capital: { type: Number, state: true },
    _selected: { type: Object, state: true },
    _execStep: { type: String, state: true },
    _execResult: { type: Object, state: true },
    _technicalGate: { type: Object, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .toolbar { display:flex; gap:var(--space-3); flex-wrap:wrap; align-items:center; justify-content:space-between; }
    .toolbar-left, .toolbar-right { display:flex; gap:var(--space-3); flex-wrap:wrap; align-items:center; }
    .toolbar-note { font-size: var(--text-xs); color: var(--color-text-muted); }
    .kpi-row { display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--space-3); }
    .opps { display:flex; flex-direction:column; gap: var(--space-3); }
    .card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
      display:flex;
      flex-direction:column;
      gap: var(--space-3);
    }
    .card.candidate { border-left: 3px solid var(--color-positive); }
    .card.watching { border-left: 3px solid var(--color-warning); }
    .card.rejected { border-left: 3px solid var(--color-negative); opacity: 0.9; }
    .head { display:flex; justify-content:space-between; gap: var(--space-3); align-items:flex-start; }
    .ticker { font-size: var(--text-lg); font-weight: var(--weight-bold); font-family: var(--font-mono); }
    .meta { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 4px; }
    .status-chip {
      display:inline-flex; align-items:center; gap:6px; padding:4px 9px; border-radius:999px;
      font-size:11px; letter-spacing:0.08em; text-transform:uppercase;
    }
    .status-chip.candidate { background: var(--color-positive-dim); color: var(--color-positive); }
    .status-chip.watching { background: var(--color-warning-dim); color: var(--color-warning); }
    .status-chip.rejected { background: var(--color-negative-dim); color: var(--color-negative); }
    .score { font-family: var(--font-mono); font-size: 28px; font-weight: var(--weight-bold); }
    .score-label { font-size: 10px; color: var(--color-text-muted); letter-spacing: 0.08em; text-transform: uppercase; }
    .metrics { display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: var(--space-3); }
    .metric { display:flex; flex-direction:column; gap:2px; }
    .metric-label { font-size:10px; color:var(--color-text-muted); letter-spacing:0.08em; text-transform:uppercase; }
    .metric-value {
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      font-variant-numeric: tabular-nums slashed-zero;
      font-feature-settings: "tnum" 1, "zero" 1;
    }
    .metric-value.pos { color: var(--color-positive); }
    .metric-value.neg { color: var(--color-negative); }
    .gate {
      display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-2);
      padding: var(--space-3);
      border-radius: var(--radius-md);
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-subtle);
    }
    .gate-item { font-size: var(--text-xs); color: var(--color-text-secondary); }
    .gate-item strong { color: var(--color-text-primary); }
    .notes { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.5; }
    .actions { display:flex; gap: var(--space-2); flex-wrap:wrap; }
    .actions .btn { flex:1; min-width: 0; }
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.88);
      display:flex; align-items:center; justify-content:center; z-index:220; padding:16px;
    }
    .modal {
      width: min(1100px, 96vw);
      max-height: 90vh;
      overflow: hidden;
      display:grid;
      grid-template-columns: 1.4fr 0.9fr;
      background: var(--color-bg-panel);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-xl);
    }
    .modal-left { border-right: 1px solid var(--color-border-subtle); min-height: 520px; }
    .modal-right { display:flex; flex-direction:column; }
    .modal-header {
      display:flex; justify-content:space-between; gap: var(--space-3); align-items:center;
      padding: 12px 16px; border-bottom: 1px solid var(--color-border-subtle); background: var(--color-bg-card);
    }
    .tv-frame { width:100%; height:100%; min-height:520px; border:none; }
    .panel-body { padding: 18px; display:flex; flex-direction:column; gap: 14px; overflow-y:auto; }
    .exec-row { display:flex; justify-content:space-between; gap:12px; font-size: var(--text-sm); padding-bottom:8px; border-bottom:1px solid var(--color-border-subtle); }
    .exec-row span:last-child {
      font-family: var(--font-mono);
      font-variant-numeric: tabular-nums slashed-zero;
      font-feature-settings: "tnum" 1, "zero" 1;
    }
    .callout {
      padding: 12px 14px; border-radius: var(--radius-md);
      background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle);
      font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.55;
    }
    .callout strong { color: var(--color-text-primary); }
    .checks { display:flex; flex-direction:column; gap:8px; }
    .check {
      padding: 10px 12px; border-radius: var(--radius-md);
      background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle);
      font-size: var(--text-xs); color: var(--color-text-secondary);
    }
    .check.pass { border-color: rgba(34,211,160,0.28); }
    .check.warn { border-color: rgba(245,166,35,0.28); }
    .check.fail { border-color: rgba(240,74,94,0.28); }
    .exec-actions { display:flex; gap:8px; padding: 14px 18px; border-top:1px solid var(--color-border-subtle); }
    .exec-actions .btn { flex:1; }
    @media (max-width: 900px) {
      .modal { grid-template-columns: 1fr; }
      .modal-left { min-height: 280px; border-right: 0; border-bottom: 1px solid var(--color-border-subtle); }
      .tv-frame { min-height: 280px; }
    }
  `];

  constructor() {
    super();
    const saved = domainState.load(DOMAIN);
    this._candidates = [];
    this._summary = {};
    this._loading = true;
    this._error = '';
    this._segment = saved.segment || 'all';
    this._capital = Number(saved.capital) || 175;
    this._selected = null;
    this._execStep = 'preview';
    this._execResult = null;
    this._technicalGate = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  _persist() {
    domainState.save(DOMAIN, { segment: this._segment, capital: this._capital });
  }

  async _load() {
    this._loading = true;
    this._error = '';
    try {
      const payload = await opportunitiesService.getCandidates({ capital: this._capital });
      this._candidates = Array.isArray(payload.candidates) ? payload.candidates : [];
      this._summary = payload.summary || {};
    } catch (error) {
      this._error = error?.data?.detail || error?.message || 'Could not load opportunities.';
      this._candidates = [];
      this._summary = {};
    } finally {
      this._loading = false;
    }
  }

  _setSegment(value) {
    this._segment = value;
    this._persist();
  }

  _filtered() {
    if (this._segment === 'all') return this._candidates;
    return this._candidates.filter((item) => item.status === this._segment);
  }

  _scoreColor(score) {
    if (score >= 80) return 'var(--color-positive)';
    if (score >= 60) return 'var(--color-accent)';
    if (score >= 40) return 'var(--color-warning)';
    return 'var(--color-negative)';
  }

  async _openModal(candidate) {
    this._selected = candidate;
    this._execStep = 'preview';
    this._execResult = null;
    this._technicalGate = null;
    try {
      this._technicalGate = await opportunitiesService.getTechnicalGate({
        symbol: candidate.symbol,
        configKey: candidate.configKey,
        capital: this._capital,
        targetDailyUsdt: candidate.targetDailyUsdt || 1,
      });
    } catch {
      this._technicalGate = null;
    }
  }

  _closeModal() {
    this._selected = null;
    this._execStep = 'preview';
    this._execResult = null;
    this._technicalGate = null;
  }

  async _executeCreate() {
    const c = this._selected;
    if (!c) return;
    this._execStep = 'executing';
    try {
      const preview = await opportunitiesService.previewCreate({
        symbol: c.symbol,
        configKey: c.configKey,
        capital: this._capital,
        targetDailyUsdt: c.targetDailyUsdt || 1,
      });
      if (!preview?.canCreate || !preview?.confirmationToken) {
        this._execResult = { success: false, message: (preview?.blockers || ['Opportunity is blocked']).join(' · ') };
        this._execStep = 'done';
        return;
      }
      const result = await opportunitiesService.executeCreate({
        confirmationToken: preview.confirmationToken,
        symbol: c.symbol,
        configKey: c.configKey,
        capital: this._capital,
        targetDailyUsdt: c.targetDailyUsdt || 1,
      });
      this._execResult = {
        success: Boolean(result?.pionex_created),
        message: result?.pionex_created
          ? `${c.ticker} miner created. BU ${result?.bu_order_id || 'created'}.`
          : (result?.error_message || 'Create request failed.'),
      };
      this._execStep = 'done';
      if (result?.pionex_created) {
        window.toast?.(`${c.ticker} miner created`, { type: 'success' });
        await this._load();
      } else {
        window.toast?.(this._execResult.message, { type: 'error' });
      }
    } catch (error) {
      this._execResult = { success: false, message: error?.data?.detail || error?.message || 'Create request failed.' };
      this._execStep = 'done';
      window.toast?.(this._execResult.message, { type: 'error' });
    }
  }

  _renderCandidate(c) {
    return html`
      <article class="card ${c.status}">
        <div class="head">
          <div>
            <div class="ticker">${c.ticker}</div>
            <div class="meta">${c.type} · ${fmt.leverage(c.leverage)} · ${c.rawStatus}</div>
          </div>
          <div style="text-align:right">
            <div class="score" style="color:${this._scoreColor(c.score)}">${c.score}</div>
            <div class="score-label">Score</div>
          </div>
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span class="status-chip ${c.status}">${c.rawStatus}</span>
          <span class="status-chip ${c.status}">${c.configKey}</span>
        </div>

        <div class="metrics">
          <div class="metric"><span class="metric-label">Capital</span><span class="metric-value">${fmt.usd(c.capitalRequired, 2)}</span></div>
          <div class="metric"><span class="metric-label">Est. monthly</span><span class="metric-value pos">${fmt.pnl(c.estimatedMonthly, 2)}</span></div>
          <div class="metric"><span class="metric-label">Vol 30d</span><span class="metric-value">${fmt.pctPlain(c.volatility30d, 2)}</span></div>
          <div class="metric"><span class="metric-label">Notional</span><span class="metric-value">${fmt.compact(c.volume24h)}</span></div>
          <div class="metric"><span class="metric-label">Coverage min</span><span class="metric-value">${c.minCoverage.toFixed(2)}x</span></div>
          <div class="metric"><span class="metric-label">Target/day</span><span class="metric-value">${fmt.usd(c.targetDailyUsdt, 2)}</span></div>
        </div>

        <div class="gate">
          <div class="gate-item"><strong>Trend:</strong> ${c.technicalGate?.trend || '-'}</div>
          <div class="gate-item"><strong>Residency 30d:</strong> ${fmt.pctPlain((c.metrics?.rangePosition30D || 0) * 100, 1)}</div>
          <div class="gate-item"><strong>Stress close:</strong> ${fmt.pnl(c.metrics?.expectedClosePnlAfter1PctAdverse || 0, 2)}</div>
          <div class="gate-item"><strong>Coverage:</strong> ${Number(c.metrics?.coverage1Pct || 0).toFixed(2)}x</div>
        </div>

        <div class="notes">${c.notes}</div>

        <div class="actions">
          <button class="btn btn-ghost" @click=${() => this._openModal(c)}>Technical Gate</button>
          <button class="btn btn-primary" ?disabled=${c.rawStatus !== 'Candidate'} @click=${() => this._openModal(c)}>Create Miner</button>
        </div>
      </article>
    `;
  }

  _renderModal() {
    const c = this._selected;
    if (!c) return '';
    const symbol = encodeURIComponent(`BYBIT:${c.ticker}`);
    const tvUrl = `https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=240&theme=dark&style=1&locale=en&hide_top_toolbar=0&hide_side_toolbar=0&allow_symbol_change=1&drawings_access=all&save_image=1`;
    return html`
      <div class="modal-overlay" @click=${(event) => { if (event.target === event.currentTarget) this._closeModal(); }}>
        <div class="modal">
          <div class="modal-left">
            <div class="modal-header">
              <div>
                <div class="ticker">${c.ticker}</div>
                <div class="meta">4H · Bybit Perpetual · execution context</div>
              </div>
              <button class="btn btn-ghost btn-sm" @click=${() => this._closeModal()}>Close</button>
            </div>
            <iframe class="tv-frame" src="${tvUrl}"></iframe>
          </div>
          <div class="modal-right">
            <div class="modal-header">
              <div>
                <div class="ticker">Opportunity Execution</div>
                <div class="meta">${c.type} · ${c.rawStatus}</div>
              </div>
            </div>
            ${this._execStep === 'done' ? html`
              <div class="panel-body">
                <div class="callout"><strong>${this._execResult?.success ? 'Success' : 'Failed'}</strong><br />${this._execResult?.message || 'No result message.'}</div>
              </div>
              <div class="exec-actions">
                <button class="btn btn-ghost" @click=${() => this._closeModal()}>Close</button>
              </div>
            ` : this._execStep === 'executing' ? html`
              <div class="panel-body">
                <loading-view label="Creating miner"></loading-view>
              </div>
            ` : html`
              <div class="panel-body">
                <div class="exec-row"><span>Ticker</span><span>${c.ticker}</span></div>
                <div class="exec-row"><span>Config</span><span>${c.configKey}</span></div>
                <div class="exec-row"><span>Capital</span><span>${fmt.usd(this._capital, 2)}</span></div>
                <div class="exec-row"><span>Leverage</span><span>${fmt.leverage(c.leverage)}</span></div>
                <div class="exec-row"><span>Monthly est.</span><span>${fmt.pnl(c.estimatedMonthly, 2)}</span></div>
                <div class="exec-row"><span>Stress close</span><span>${fmt.pnl(c.metrics?.expectedClosePnlAfter1PctAdverse || 0, 2)}</span></div>
                <div class="callout">
                  <strong>Decision:</strong> ${c.notes}
                </div>
                ${this._technicalGate ? html`
                  <div class="callout">
                    <strong>Technical Gate:</strong> ${this._technicalGate.recommendation} · ${this._technicalGate.score}/100
                    <br />${this._technicalGate.summary}
                  </div>
                  <div class="checks">
                    ${(this._technicalGate.checks || []).slice(0, 5).map((check) => html`
                      <div class="check ${String(check.status || '').toLowerCase()}">
                        <strong>${check.name}</strong><br />${check.detail}
                      </div>
                    `)}
                  </div>
                ` : ''}
              </div>
              <div class="exec-actions">
                <button class="btn btn-ghost" @click=${() => this._closeModal()}>Cancel</button>
                <button class="btn btn-primary" ?disabled=${c.rawStatus !== 'Candidate'} @click=${() => this._executeCreate()}>Create Miner</button>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    if (this._loading) return html`<loading-view label="Loading opportunities"></loading-view>`;
    if (this._error) return html`<error-view label="Opportunities unavailable" .sub=${this._error}></error-view>`;

    const counts = { new: 0, watching: 0, rejected: 0 };
    this._candidates.forEach((item) => { counts[item.status] = (counts[item.status] || 0) + 1; });
    const candidates = this._filtered();
    const summary = this._summary || {};

    return html`
      <div class="page">
        <div class="toolbar">
          <div class="toolbar-left">
            <segmented-control
              .options=${[
                { value: 'all', label: `All (${this._candidates.length})` },
                { value: 'new', label: `Candidates (${counts.new || 0})` },
                { value: 'watching', label: `Watch (${counts.watching || 0})` },
                { value: 'rejected', label: `Rejected (${counts.rejected || 0})` },
              ]}
              value=${this._segment}
              @change=${(event) => this._setSegment(event.detail)}
            ></segmented-control>
          </div>
          <div class="toolbar-right">
            <label class="toolbar-note">Capital per miner</label>
            <input
              class="input"
              style="max-width:140px"
              type="number"
              min="1"
              step="1"
              .value=${String(this._capital)}
              @change=${(event) => {
                this._capital = Number(event.target.value) || 175;
                this._persist();
                this._load();
              }}
            />
          </div>
        </div>

        <div class="kpi-row">
          <stat-card label="Candidates" value="${summary.candidatesCount || 0}" accent="positive"></stat-card>
          <stat-card label="Watch" value="${summary.watchCount || 0}" accent="warning"></stat-card>
          <stat-card label="Rejected" value="${summary.rejectedCount || 0}" accent="negative"></stat-card>
          <stat-card label="Universe" value="${summary.universeCount || 0}" accent="neutral"></stat-card>
          <stat-card label="Best symbol" value="${summary.bestSymbol || '-'}" accent="accent" mono></stat-card>
          <stat-card label="Capital assumed" value="${fmt.usd(summary.capitalAssumed || this._capital, 2)}" accent="neutral" mono></stat-card>
        </div>

        <div class="opps">
          ${repeat(candidates, (item) => item.id, (item) => this._renderCandidate(item))}
          ${!candidates.length ? html`<empty-view label="No opportunities in this segment"></empty-view>` : ''}
        </div>
      </div>
      ${this._renderModal()}
    `;
  }
}

customElements.define('opportunities-view', OpportunitiesView);
