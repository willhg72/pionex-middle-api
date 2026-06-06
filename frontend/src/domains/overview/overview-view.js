import { LitElement, html, css } from 'lit';
import { overviewMock } from '../../mocks/overview.mock.js';
import { router } from '../../app/router.js';
import { fmt } from '../../utils/format.js';

class OverviewView extends LitElement {
  static properties = {
    _data:       { type: Object, state: true },
    _advisorTab: { type: String, state: true },
  };

  static styles = css`
    :host { display: block; }
    .page {
      padding: var(--content-padding);
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    /* === KPI GRID === */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-3);
    }

    /* === TWO-COLUMN LAYOUT === */
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

    /* === PANELS === */
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

    .panel-title-label { display: flex; align-items: center; gap: var(--space-2); }

    /* === LIQUIDITY BAR === */
    .liquidity-bar-wrap {
      margin-top: var(--space-3);
    }
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

    /* === ALERTS === */
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
    .alert-danger  { background: var(--color-negative-dim); border-left: 3px solid var(--color-negative); }
    .alert-warning { background: var(--color-warning-dim);  border-left: 3px solid var(--color-warning); }
    .alert-info    { background: var(--color-accent-dim);   border-left: 3px solid var(--color-accent); }

    .alert-icon { flex-shrink: 0; font-size: 14px; margin-top: 1px; }
    .alert-text { flex: 1; color: var(--color-text-primary); line-height: 1.4; }
    .alert-time { font-size: var(--text-xs); color: var(--color-text-muted); white-space: nowrap; }

    /* === AI ADVISOR === */
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

    .advisor-content {
      padding: var(--card-padding);
    }

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
      width: 24px; height: 24px;
      border-radius: 50%;
      background: var(--color-accent-dim);
      color: var(--color-accent);
      font-size: var(--text-xs);
      font-weight: var(--weight-bold);
      display: flex; align-items: center; justify-content: center;
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
      display: flex; align-items: center; gap: var(--space-1);
    }

    .risk-sug {
      display: flex; align-items: flex-start; gap: var(--space-2);
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
    .tip-body  { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.6; }

    .warning-item-advisor {
      display: flex; align-items: center; gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      margin-bottom: var(--space-2);
    }
    .warning-item-advisor.high   { background: var(--color-negative-dim); color: var(--color-negative); }
    .warning-item-advisor.medium { background: var(--color-warning-dim);  color: var(--color-warning); }

    .whatif-placeholder {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: var(--space-10);
      border: 2px dashed var(--color-border-default);
      border-radius: var(--radius-lg);
      gap: var(--space-3);
      text-align: center;
    }
    .whatif-icon { font-size: 32px; opacity: 0.3; }
    .whatif-label { font-size: var(--text-sm); color: var(--color-text-muted); }
    .whatif-sub { font-size: var(--text-xs); color: var(--color-text-disabled); }

    /* === RECOMMENDED ACTIONS === */
    .action-item {
      display: flex; align-items: center; justify-content: space-between;
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
    .urgency-high   { background: var(--color-negative); box-shadow: 0 0 6px var(--color-negative); }
    .urgency-medium { background: var(--color-warning); }
    .urgency-low    { background: var(--color-idle); }

    .action-label { font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text-primary); }
    .action-arrow { color: var(--color-text-muted); font-size: 14px; }

    /* === MONTHLY PROGRESS === */
    .goal-header {
      display: flex; justify-content: space-between; align-items: baseline;
      margin-bottom: var(--space-3);
    }
    .goal-amount { font-family: var(--font-mono); font-size: var(--text-2xl); font-weight: var(--weight-semibold); color: var(--color-positive); }
    .goal-target { font-size: var(--text-xs); color: var(--color-text-muted); }

    @media (max-width: 1100px) {
      .row-2col { grid-template-columns: 1fr; }
      .row-3col { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 800px) {
      .row-3col { grid-template-columns: 1fr; }
    }
  `;

  constructor() {
    super();
    this._data = overviewMock;
    this._advisorTab = 'summary';
  }

  _renderKpiGrid() {
    const d = this._data;
    const kpis = [
      { label: 'Total Capital', value: fmt.usd(d.totalCapital), accent: 'neutral', mono: true },
      { label: 'Free USDT',     value: fmt.usd(d.freeUsdt),     accent: 'accent',  mono: true, sub: `${((d.freeUsdt/d.totalCapital)*100).toFixed(1)}% of total` },
      { label: 'Open PnL',      value: fmt.pnl(d.openPnl),      accent: d.openPnl >= 0 ? 'positive' : 'negative', mono: true },
      { label: 'Monthly PnL',   value: fmt.pnl(d.monthlyPnl),   accent: d.monthlyPnl >= 0 ? 'positive' : 'negative', mono: true },
      { label: 'Risk Score',    value: `${d.riskScore}/100`,     accent: d.riskScore < 50 ? 'positive' : d.riskScore < 70 ? 'warning' : 'negative', sub: fmt.riskLabel(d.riskScore) },
      { label: 'Active Miners', value: '$38,000',                accent: 'accent', mono: true, sub: '7 positions' },
      { label: 'Scalping',      value: fmt.usd(d.capitalScalp),  accent: 'neutral', mono: true, sub: 'futures mode' },
      { label: 'BTC Core',      value: fmt.usd(d.capitalBtcCore),accent: 'neutral', mono: true, sub: '0.418 BTC' },
      { label: 'BTC Ladder',    value: fmt.usd(d.capitalLadder), accent: 'neutral', mono: true, sub: '3/12 filled' },
    ];

    return html`
      <div class="kpi-grid">
        ${kpis.map(k => html`
          <stat-card
            label=${k.label}
            value=${k.value}
            accent=${k.accent}
            .sub=${k.sub || ''}
            ?mono=${k.mono || false}
          ></stat-card>
        `)}
      </div>
    `;
  }

  _renderAllocationAndLiquidity() {
    const d = this._data;
    return html`
      <div class="row-2col">
        <!-- Capital Allocation -->
        <div class="panel">
          <div class="panel-title">
            <span class="panel-title-label">Capital Allocation</span>
            <span style="font-size:var(--text-xs);color:var(--color-text-muted)">Total: ${fmt.usd(d.totalCapital)}</span>
          </div>
          <allocation-chart .items=${d.capitalAllocation}></allocation-chart>
        </div>

        <!-- Liquidity vs Exposure -->
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

          <!-- Monthly goal progress -->
          <div style="margin-top:var(--space-5);padding-top:var(--space-4);border-top:1px solid var(--color-border-subtle)">
            <div class="panel-title" style="margin-bottom:var(--space-3)">Monthly Goal Progress</div>
            <div class="goal-header">
              <span class="goal-amount">${fmt.usd(d.monthlyPnl)}</span>
              <span class="goal-target">Target: ${fmt.usd(d.monthlyGoal)}</span>
            </div>
            <progress-bar
              value=${d.monthlyGoalProgress}
              color="var(--color-positive)"
              height="8"
              showPct
              sublabel="On track — ${(100 - d.monthlyGoalProgress).toFixed(1)}% remaining this month"
            ></progress-bar>
          </div>
        </div>
      </div>
    `;
  }

  _renderAlerts() {
    const alerts = this._data.alerts;
    const icons = { danger: '⚠', warning: '!', info: 'ℹ' };
    return html`
      <div class="panel">
        <div class="panel-title">
          <span class="panel-title-label">
            Priority Alerts
            <span style="font-size:var(--text-xs);background:var(--color-negative-dim);color:var(--color-negative);padding:1px 6px;border-radius:var(--radius-sm);font-weight:600">${alerts.filter(a => a.level === 'danger').length}</span>
          </span>
        </div>
        ${alerts.map(a => html`
          <div class="alert-item alert-${a.level}">
            <span class="alert-icon">${icons[a.level]}</span>
            <span class="alert-text">${a.message}</span>
            <span class="alert-time">${a.time}</span>
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
        return html`${adv.recommendations.map(r => html`
          <div class="rec-card">
            <div class="rec-priority">${r.priority}</div>
            <div class="rec-body">
              <div class="rec-category">${r.category}</div>
              <div class="rec-action">${r.action}</div>
              <div class="rec-rationale">${r.rationale}</div>
              <div class="rec-impact">↑ ${r.impact} · Risk: ${r.risk}</div>
            </div>
          </div>
        `)}`;

      case 'risk':
        return html`${adv.riskSuggestions.map(s => html`
          <div class="risk-sug"><span>⚠</span>${s}</div>
        `)}`;

      case 'tips':
        return html`${adv.educationalTips.map(t => html`
          <div class="tip-card">
            <div class="tip-title">${t.title}</div>
            <div class="tip-body">${t.body}</div>
          </div>
        `)}`;

      case 'warnings':
        return html`${adv.warnings.map(w => html`
          <div class="warning-item-advisor ${w.level}"><span>⚠</span>${w.text}</div>
        `)}`;

      case 'whatif':
        return html`
          <div class="whatif-placeholder">
            <div class="whatif-icon">⟁</div>
            <div class="whatif-label">What-If Simulation Engine</div>
            <div class="whatif-sub">AI-powered scenario modeling — coming in a future release.<br>
            Will support: capital reallocation scenarios, drawdown simulations, strategy stress tests.</div>
          </div>
        `;

      default: return '';
    }
  }

  _renderAdvisor() {
    const adv = this._data.advisor;
    const tabs = [
      { id: 'summary',         label: 'Executive Summary' },
      { id: 'recommendations', label: 'Recommendations' },
      { id: 'risk',            label: 'Risk Suggestions' },
      { id: 'tips',            label: 'Educational Tips' },
      { id: 'warnings',        label: `Warnings (${adv.warnings.length})` },
      { id: 'whatif',          label: 'What-If (Soon)' },
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
          ${tabs.map(t => html`
            <div
              class="advisor-tab ${this._advisorTab === t.id ? 'active' : ''}"
              @click=${() => this._advisorTab = t.id}
            >${t.label}</div>
          `)}
        </div>
        <div class="advisor-content">
          ${this._renderAdvisorContent()}
        </div>
      </div>
    `;
  }

  _renderRecommendedActions() {
    const actions = this._data.recommendedActions;
    return html`
      <div class="panel">
        <div class="panel-title">Recommended Next Actions</div>
        ${actions.map(a => html`
          <div class="action-item" @click=${() => router.navigate(a.route)}>
            <div class="action-left">
              <div class="urgency-dot urgency-${a.urgency}"></div>
              <span class="action-label">${a.label}</span>
            </div>
            <span class="action-arrow">→</span>
          </div>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      <div class="page">
        ${this._renderKpiGrid()}
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
