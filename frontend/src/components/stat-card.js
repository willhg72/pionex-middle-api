import { LitElement, html, css } from 'lit';

class StatCard extends LitElement {
  static properties = {
    label:    { type: String },
    value:    { type: String },
    sub:      { type: String },
    delta:    { type: Number },
    deltaPct: { type: Number },
    accent:   { type: String }, // 'positive' | 'negative' | 'warning' | 'accent' | 'neutral'
    size:     { type: String }, // 'sm' | 'md' | 'lg'
    mono:     { type: Boolean },
  };

  static styles = css`
    :host { display: block; }

    .card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
      transition: border-color var(--transition-fast);
    }
    .card:hover { border-color: var(--color-border-default); }

    .label {
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text-muted);
      margin-bottom: var(--space-2);
    }

    .value {
      font-size: var(--text-2xl);
      font-weight: var(--weight-semibold);
      letter-spacing: -0.025em;
      line-height: 1.1;
      color: var(--color-text-primary);
    }
    .value.mono { font-family: var(--font-mono); }
    .value.sm { font-size: var(--text-xl); }
    .value.lg { font-size: var(--text-3xl); }

    .value.positive { color: var(--color-positive); }
    .value.negative { color: var(--color-negative); }
    .value.warning  { color: var(--color-warning); }
    .value.accent   { color: var(--color-accent); }

    .footer {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-top: var(--space-2);
    }

    .sub {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .delta {
      font-size: var(--text-xs);
      font-weight: var(--weight-medium);
      font-family: var(--font-mono);
    }
    .delta-pos { color: var(--color-positive); }
    .delta-neg { color: var(--color-negative); }

    .accent-bar {
      height: 2px;
      border-radius: 1px;
      margin-bottom: var(--space-3);
      width: 28px;
    }
    .accent-bar.positive { background: var(--color-positive); }
    .accent-bar.negative { background: var(--color-negative); }
    .accent-bar.warning  { background: var(--color-warning); }
    .accent-bar.accent   { background: var(--color-accent); }
    .accent-bar.neutral  { background: var(--color-border-strong); }
  `;

  render() {
    const accent = this.accent || 'neutral';
    const size = this.size || 'md';
    const deltaPos = this.delta >= 0;

    return html`
      <div class="card">
        <div class="accent-bar ${accent}"></div>
        <div class="label">${this.label}</div>
        <div class="value ${accent} ${size} ${this.mono ? 'mono' : ''}">${this.value}</div>
        <div class="footer">
          ${this.sub ? html`<span class="sub">${this.sub}</span>` : ''}
          ${this.delta !== undefined ? html`
            <span class="delta ${deltaPos ? 'delta-pos' : 'delta-neg'}">
              ${deltaPos ? '▲' : '▼'} ${Math.abs(this.delta).toFixed(2)}${this.deltaPct !== undefined ? ` (${Math.abs(this.deltaPct).toFixed(1)}%)` : ''}
            </span>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('stat-card', StatCard);
