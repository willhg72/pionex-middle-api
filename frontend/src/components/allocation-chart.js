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
  `;

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
              title="${item.label}: $${item.value.toLocaleString()} (${item.pct.toFixed(1)}%)"
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
    `;
  }
}

customElements.define('allocation-chart', AllocationChart);
