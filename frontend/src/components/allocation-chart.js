import { LitElement, html, css } from 'lit';

/**
 * Horizontal stacked bar allocation chart + legend.
 * items: Array<{ label, value, color, pct }>
 */
class AllocationChart extends LitElement {
  static properties = {
    items:  { type: Array },
    height: { type: Number },
    total:  { type: Number },
    _tip:   { type: Object, state: true },
  };

  static styles = css`
    :host { display: block; }
    .chart-wrap { display: flex; flex-direction: column; gap: var(--space-4); }

    .bar-track {
      width: 100%;
      display: flex;
      border-radius: var(--radius-md);
      overflow: hidden;
      gap: 1px;
      background: var(--color-bg-elevated);
    }

    .bar-seg {
      transition: width 0.5s ease;
      position: relative;
    }
    .bar-seg:hover { filter: brightness(1.15); }
    .bar-seg:first-child { border-radius: var(--radius-md) 0 0 var(--radius-md); }
    .bar-seg:last-child  { border-radius: 0 var(--radius-md) var(--radius-md) 0; }

    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3) var(--space-5);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 2px;
      flex-shrink: 0;
    }
    .legend-label {
      font-size: var(--text-xs);
      color: var(--color-text-secondary);
    }
    .legend-pct {
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-text-muted);
      margin-left: 2px;
    }
    .legend-value {
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-text-muted);
    }

    /* Segment hover tooltip */
    .seg-tooltip {
      position: fixed;
      min-width: 148px;
      padding: 9px 12px;
      border-radius: 8px;
      background: rgba(10,11,15,.97);
      border: 1px solid var(--color-border-default);
      box-shadow: 0 8px 24px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04);
      pointer-events: none;
      z-index: 999;
      opacity: 0;
      scale: 0.96;
      transition: opacity 80ms ease, scale 80ms ease;
    }
    .seg-tooltip.show { opacity: 1; scale: 1; }
    .seg-label { font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 5px; }
    .seg-val   { font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--color-text-primary); }
    .seg-row   { display: flex; justify-content: space-between; gap: 12px; margin-top: 4px; }
    .seg-lbl   { font-size: 10px; color: var(--color-text-muted); }
    .seg-pct   { font-family: var(--font-mono); font-size: 11px; font-weight: 500; color: var(--color-accent); }
  `;

  _showTip(e, item) {
    this._tip = { x: e.clientX + 14, y: e.clientY - 58, item };
  }

  _moveTip(e) {
    if (!this._tip) return;
    this._tip = { ...this._tip, x: e.clientX + 14, y: e.clientY - 58 };
  }

  _hideTip() {
    this._tip = null;
  }

  render() {
    const items = this.items || [];
    const h = this.height || 20;

    return html`
      <div class="chart-wrap">
        <div class="bar-track" style="height:${h}px">
          ${items.map(item => html`
            <div
              class="bar-seg"
              style="width:${item.pct}%; background:${item.color};"
              @mouseenter=${(e) => this._showTip(e, item)}
              @mousemove=${(e) => this._moveTip(e)}
              @mouseleave=${() => this._hideTip()}
            ></div>
          `)}
        </div>
        <div class="legend">
          ${items.map(item => html`
            <div class="legend-item">
              <div class="legend-dot" style="background:${item.color}"></div>
              <span class="legend-label">${item.label}</span>
              <span class="legend-pct">${item.pct.toFixed(1)}%</span>
              <span class="legend-value">($${item.value.toLocaleString()})</span>
            </div>
          `)}
        </div>
      </div>

      ${this._tip ? html`
        <div class="seg-tooltip show" style="left:${this._tip.x}px;top:${this._tip.y}px">
          <div class="seg-label">${this._tip.item.label}</div>
          <div class="seg-val">$${Number(this._tip.item.value || 0).toLocaleString()}</div>
          <div class="seg-row">
            <span class="seg-lbl">Porción</span>
            <span class="seg-pct">${Number(this._tip.item.pct || 0).toFixed(1)}%</span>
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('allocation-chart', AllocationChart);
