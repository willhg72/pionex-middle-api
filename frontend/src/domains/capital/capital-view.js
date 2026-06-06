import { LitElement, html, svg, css } from 'lit';
import { capitalMock } from '../../mocks/capital.mock.js';
import { fmt } from '../../utils/format.js';
import { buttonStyles } from '../../styles/shared-styles.js';

const STRATEGY_COLORS = [
  '#5b8def',  // miners — blue
  '#f5a623',  // btc core — orange
  '#22d3a0',  // btc ladder — green
  '#a855f7',  // scalping — purple
  '#2a2d3e',  // idle — dark
];

class CapitalView extends LitElement {
  static properties = {
    _data:  { type: Object, state: true },
    _range: { type: String, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }

    /* ---- KPI strip ---- */
    .kpi-strip { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--space-3); }

    /* ---- Main layout ---- */
    .main-row { display: grid; grid-template-columns: 1fr 340px; gap: var(--space-4); }
    @media (max-width: 1100px) { .main-row { grid-template-columns: 1fr; } }

    .bottom-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
    @media (max-width: 900px) { .bottom-row { grid-template-columns: 1fr; } }

    /* ---- Panel ---- */
    .panel {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
    }
    .panel-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: var(--space-4);
    }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .panel-sub   { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }

    /* ---- Area chart ---- */
    .chart-wrap { position: relative; height: 130px; }
    .chart-wrap svg { position: absolute; inset: 0; width: 100%; height: 100%; }

    /* ---- Range tabs ---- */
    .range-tabs { display: flex; gap: 2px; background: var(--color-bg-elevated); border-radius: 6px; padding: 3px; }
    .range-tab {
      padding: 3px 10px; border-radius: 4px; font-size: 10.5px; font-weight: 500;
      cursor: pointer; color: var(--color-text-muted); letter-spacing: 0.04em;
      transition: all 120ms ease;
    }
    .range-tab.active { background: var(--color-bg-hover); color: var(--color-text-primary); }

    /* ---- Donut chart ---- */
    .donut-section { display: flex; align-items: center; gap: var(--space-5); }
    .donut-wrap { flex-shrink: 0; }
    .donut-legend { flex: 1; display: flex; flex-direction: column; gap: var(--space-2); }
    .legend-row { display: flex; align-items: center; gap: var(--space-2); }
    .legend-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
    .legend-label { flex: 1; font-size: var(--text-xs); color: var(--color-text-secondary); }
    .legend-pct { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); min-width: 36px; text-align: right; }
    .legend-val { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-medium); min-width: 72px; text-align: right; }

    /* ---- Ranked list (right column, like "Top Skills") ---- */
    .ranked-list { display: flex; flex-direction: column; gap: 0; }
    .ranked-row {
      display: flex; align-items: center; gap: var(--space-3);
      padding: var(--space-2) 0;
      border-bottom: 1px solid var(--color-border-subtle);
    }
    .ranked-row:last-child { border-bottom: none; }
    .rank-num {
      font-size: var(--text-xs); color: var(--color-text-disabled);
      font-family: var(--font-mono); min-width: 14px; text-align: center;
    }
    .rank-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .rank-label { flex: 1; font-size: var(--text-sm); font-family: var(--font-mono); font-weight: var(--weight-medium); }
    .rank-bar-wrap { flex: 1; max-width: 100px; }
    .rank-bar-bg { height: 3px; background: var(--color-bg-elevated); border-radius: 2px; overflow: hidden; }
    .rank-bar-fill { height: 100%; border-radius: 2px; transition: width 500ms ease; }
    .rank-pct { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); min-width: 36px; text-align: right; }
    .rank-val { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-medium); min-width: 76px; text-align: right; }

    /* ---- Productive/Idle split ---- */
    .split-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-4); }
    .split-card { padding: var(--space-3); border-radius: var(--radius-md); text-align: center; }
    .split-card.prod { background: var(--color-positive-dim); border: 1px solid rgba(34,211,160,0.15); }
    .split-card.idle { background: var(--color-idle-dim);     border: 1px solid rgba(90,95,117,0.15); }
    .split-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: var(--space-1); }
    .split-val   { font-family: var(--font-mono); font-size: var(--text-xl); font-weight: var(--weight-semibold); }
    .split-card.prod .split-val { color: var(--color-positive); }
    .split-card.idle .split-val { color: var(--color-idle); }
    .split-sub   { font-size: 10px; color: var(--color-text-muted); margin-top: 2px; }

    /* ---- Risk table ---- */
    .risk-row { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border-subtle); }
    .risk-row:last-child { border-bottom: none; }
    .risk-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .risk-label { flex: 1; font-size: var(--text-sm); }
    .risk-bar-wrap { width: 80px; }
    .risk-pct { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); min-width: 36px; text-align: right; }
    .risk-val { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-medium); min-width: 72px; text-align: right; }
  `];

  constructor() {
    super();
    this._data = capitalMock;
    this._range = '30d';
  }

  /* ── Area chart SVG ─────────────────────────────────── */
  _renderAreaChart() {
    const hist = this._data.history;
    const W = 600, H = 130;
    const PAD = { top: 16, right: 12, bottom: 22, left: 4 };
    const cW = W - PAD.left - PAD.right;
    const cH = H - PAD.top - PAD.bottom;
    const vals = hist.map(h => h.total);
    const minV = Math.min(...vals);
    const maxV = Math.max(...vals);
    const range = maxV - minV || 1;

    const pts = hist.map((h, i) => ({
      x: PAD.left + (i / (hist.length - 1)) * cW,
      y: PAD.top + cH - ((h.total - minV) / range) * cH,
      h,
    }));

    // Smooth cubic bezier path
    const line = pts.map((p, i) => {
      if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      const prev = pts[i - 1];
      const cpx = ((prev.x + p.x) / 2).toFixed(1);
      return `C ${cpx} ${prev.y.toFixed(1)}, ${cpx} ${p.y.toFixed(1)}, ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(' ');

    const area = `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${H - PAD.bottom} L ${pts[0].x.toFixed(1)} ${H - PAD.bottom} Z`;

    // Y grid — 3 lines
    const yLevels = [minV, minV + range * 0.5, maxV];
    const dateIdxs = [0, Math.floor(hist.length / 4), Math.floor(hist.length / 2), Math.floor(hist.length * 3 / 4), hist.length - 1];

    return html`
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="overflow:visible">
        <defs>
          <linearGradient id="cap-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#22d3a0" stop-opacity="0.28"/>
            <stop offset="60%"  stop-color="#22d3a0" stop-opacity="0.06"/>
            <stop offset="100%" stop-color="#22d3a0" stop-opacity="0"/>
          </linearGradient>
          <filter id="cap-glow" x="-5%" y="-40%" width="110%" height="180%">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- Horizontal grid lines -->
        ${yLevels.map((v, i) => {
          const y = (PAD.top + cH - ((v - minV) / range) * cH).toFixed(1);
          return svg`
            <line x1="${PAD.left}" y1="${y}" x2="${W - PAD.right}" y2="${y}"
                  stroke="#1f2130" stroke-width="1" stroke-dasharray="${i === 0 ? 'none' : '3 4'}"/>
            <text x="${W - PAD.right + 5}" y="${(parseFloat(y) + 3.5).toFixed(1)}"
                  fill="#42475e" font-size="8.5" font-family="JetBrains Mono,monospace" text-anchor="start">
              $${(v / 1000).toFixed(0)}k
            </text>
          `;
        })}

        <!-- Area fill -->
        ${svg`<path d="${area}" fill="url(#cap-area-grad)"/>`}

        <!-- Main line -->
        ${svg`<path d="${line}" fill="none" stroke="#22d3a0" stroke-width="1.8"
              filter="url(#cap-glow)" stroke-linejoin="round" stroke-linecap="round"/>`}

        <!-- End dot -->
        ${svg`<circle cx="${pts[pts.length-1].x.toFixed(1)}" cy="${pts[pts.length-1].y.toFixed(1)}"
                r="3" fill="#22d3a0" filter="url(#cap-glow)"/>`}

        <!-- Date labels -->
        ${dateIdxs.map((idx, rank) => svg`
          <text x="${pts[idx].x.toFixed(1)}" y="${H}"
                fill="#42475e" font-size="8.5" font-family="Inter,sans-serif"
                text-anchor="${rank === 0 ? 'start' : rank === dateIdxs.length - 1 ? 'end' : 'middle'}">
            ${hist[idx].date}
          </text>
        `)}
      </svg>
    `;
  }

  /* ── Strategy donut — arc-path approach ─────────────── */
  _renderDonut() {
    const buckets = this._data.buckets;
    const total = buckets.reduce((s, b) => s + b.value, 0);
    const productive = buckets.filter(b => b.productive).reduce((s, b) => s + b.value, 0);
    const prodPct = ((productive / total) * 100).toFixed(1);
    const CX = 80, CY = 80, R = 62, SW = 14;
    const GAP = 0.04; // radians between segments

    // Arc path helper: 0 = 12 o'clock, clockwise
    const arc = (startA, endA) => {
      const a1 = startA + GAP / 2;
      const a2 = endA   - GAP / 2;
      if (a2 - a1 < 0.01) return null;
      const x1 = CX + R * Math.sin(a1), y1 = CY - R * Math.cos(a1);
      const x2 = CX + R * Math.sin(a2), y2 = CY - R * Math.cos(a2);
      const large = (a2 - a1) > Math.PI ? 1 : 0;
      return `M ${x1.toFixed(3)} ${y1.toFixed(3)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`;
    };

    const TWO_PI = 2 * Math.PI;
    let cumAngle = 0;
    const segments = buckets.map((b, i) => {
      const angle = (b.value / total) * TWO_PI;
      const seg = { b, startAngle: cumAngle, endAngle: cumAngle + angle, color: STRATEGY_COLORS[i] };
      cumAngle += angle;
      return seg;
    });

    return html`
      <div class="donut-section">
        <div class="donut-wrap">
          <svg viewBox="0 0 160 160" width="160" height="160">
            <!-- Track -->
            <circle cx="${CX}" cy="${CY}" r="${R}" fill="none"
                    stroke="#141620" stroke-width="${SW}"/>
            <!-- Colored arc segments -->
            ${segments.map(s => {
              const d = arc(s.startAngle, s.endAngle);
              if (!d) return '';
              return svg`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${SW}" stroke-linecap="round"/>`;
            })}
            <!-- Center labels -->
            <text x="${CX}" y="${CY - 8}" text-anchor="middle"
                  fill="#e8eaf2" font-family="JetBrains Mono, monospace"
                  font-size="15" font-weight="700">${prodPct}%</text>
            <text x="${CX}" y="${CY + 7}" text-anchor="middle"
                  fill="#565a6e" font-family="Inter, sans-serif"
                  font-size="9" letter-spacing="0.1em">PRODUCTIVE</text>
            <text x="${CX}" y="${CY + 20}" text-anchor="middle"
                  fill="#9195a8" font-family="JetBrains Mono, monospace" font-size="9">
              ${fmt.usd(productive, 0)}
            </text>
          </svg>
        </div>
        <div class="donut-legend">
          ${buckets.map((b, i) => html`
            <div class="legend-row">
              <div class="legend-dot" style="background:${STRATEGY_COLORS[i]}"></div>
              <span class="legend-label">${b.label}</span>
              <span class="legend-pct">${b.pct.toFixed(1)}%</span>
              <span class="legend-val">${fmt.usd(b.value)}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  /* ── By-Ticker ranked list (inspired by "Top Skills" in ref image) ── */
  _renderTickerRanked() {
    const tickers = this._data.byTicker;
    const maxPct = Math.max(...tickers.map(t => t.pct));
    return html`
      <div class="ranked-list">
        ${tickers.map((t, i) => html`
          <div class="ranked-row">
            <span class="rank-num">${i + 1}</span>
            <div class="rank-dot" style="background:${i === 0 ? '#f5a623' : i === 1 ? '#5b8def' : '#22d3a0'}"></div>
            <span class="rank-label">${t.ticker}</span>
            <div class="rank-bar-wrap">
              <div class="rank-bar-bg">
                <div class="rank-bar-fill" style="width:${(t.pct / maxPct * 100).toFixed(1)}%;background:${i === 0 ? '#f5a623' : '#5b8def'}"></div>
              </div>
            </div>
            <span class="rank-pct">${t.pct.toFixed(1)}%</span>
            <span class="rank-val">${fmt.usd(t.value)}</span>
          </div>
        `)}
      </div>
    `;
  }

  /* ── Risk breakdown ── */
  _renderRisk() {
    const riskColors = { 'Low Risk': '#22d3a0', 'Medium Risk': '#f5a623', 'High Risk': '#f04a5e', 'No Risk': '#5a5f75' };
    const maxVal = Math.max(...this._data.byRisk.map(r => r.value));
    return html`
      ${this._data.byRisk.map(r => html`
        <div class="risk-row">
          <div class="risk-dot" style="background:${riskColors[r.label] || '#5a5f75'}"></div>
          <span class="risk-label">${r.label}</span>
          <div class="risk-bar-wrap">
            <div class="rank-bar-bg">
              <div class="rank-bar-fill" style="width:${(r.value / maxVal * 100).toFixed(1)}%;background:${riskColors[r.label] || '#5a5f75'}"></div>
            </div>
          </div>
          <span class="risk-pct">${r.pct.toFixed(1)}%</span>
          <span class="risk-val">${fmt.usd(r.value)}</span>
        </div>
      `)}
    `;
  }

  render() {
    const d = this._data;
    const totalCapital = d.buckets.reduce((s, b) => s + b.value, 0);
    const productive   = d.buckets.filter(b => b.productive).reduce((s, b) => s + b.value, 0);
    const idle         = totalCapital - productive;

    return html`
      <div class="page">

        <!-- KPI strip -->
        <div class="kpi-strip">
          <stat-card label="Total Capital" value="${fmt.usd(totalCapital)}" accent="neutral" mono></stat-card>
          <stat-card label="Productive"    value="${fmt.usd(productive)}"   accent="positive" mono></stat-card>
          <stat-card label="Idle / Free"   value="${fmt.usd(idle)}"          accent="warning" mono></stat-card>
          <stat-card label="Strategies"    value="4"                         accent="accent"></stat-card>
          <stat-card label="Avg Risk"      value="Medium"                    accent="warning"></stat-card>
        </div>

        <!-- Area chart + Ticker ranked list -->
        <div class="main-row">
          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">Capital Over Time</div>
                <div class="panel-sub">30-day portfolio value</div>
              </div>
              <div class="range-tabs">
                ${['7d','14d','30d'].map(r => html`
                  <div class="range-tab ${this._range === r ? 'active' : ''}" @click=${() => this._range = r}>${r}</div>
                `)}
              </div>
            </div>
            <div class="chart-wrap">${this._renderAreaChart()}</div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">By Ticker</div>
                <div class="panel-sub">Capital allocation</div>
              </div>
            </div>
            ${this._renderTickerRanked()}
          </div>
        </div>

        <!-- Donut + Risk -->
        <div class="bottom-row">
          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">Strategy Allocation</div>
                <div class="panel-sub">Productive vs idle capital</div>
              </div>
            </div>
            <div class="split-row">
              <div class="split-card prod">
                <div class="split-label">Productive</div>
                <div class="split-val">${fmt.usd(productive, 0)}</div>
                <div class="split-sub">${((productive / totalCapital) * 100).toFixed(1)}% of total</div>
              </div>
              <div class="split-card idle">
                <div class="split-label">Idle / Free</div>
                <div class="split-val">${fmt.usd(idle, 0)}</div>
                <div class="split-sub">${((idle / totalCapital) * 100).toFixed(1)}% of total</div>
              </div>
            </div>
            ${this._renderDonut()}
          </div>

          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">By Risk Level</div>
                <div class="panel-sub">Capital at risk exposure</div>
              </div>
            </div>
            ${this._renderRisk()}
          </div>
        </div>

      </div>
    `;
  }
}

customElements.define('capital-view', CapitalView);
