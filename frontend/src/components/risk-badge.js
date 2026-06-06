import { LitElement, html, css } from 'lit';

class RiskBadge extends LitElement {
  static properties = {
    score: { type: Number },
    label: { type: String },
    size:  { type: String }, // 'sm' | 'md'
  };

  static styles = css`
    :host { display: inline-block; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .badge.sm { padding: 2px 6px; font-size: 10px; }
    .dot { width: 6px; height: 6px; border-radius: 50%; }

    .low    { background: var(--color-positive-dim); color: var(--color-positive); }
    .medium { background: var(--color-warning-dim);  color: var(--color-warning); }
    .high   { background: var(--color-negative-dim); color: var(--color-negative); }
    .extreme{ background: var(--color-danger-dim);   color: var(--color-danger); }
    .none   { background: var(--color-idle-dim);     color: var(--color-idle); }

    .dot.low    { background: var(--color-positive); }
    .dot.medium { background: var(--color-warning); }
    .dot.high   { background: var(--color-negative); }
    .dot.extreme{ background: var(--color-danger); }
    .dot.none   { background: var(--color-idle); }
  `;

  _getLevel() {
    if (this.label) return this.label.toLowerCase();
    if (this.score === undefined) return 'none';
    if (this.score < 25) return 'low';
    if (this.score < 50) return 'low';
    if (this.score < 65) return 'medium';
    if (this.score < 80) return 'high';
    return 'extreme';
  }

  _getLabel() {
    if (this.label) return this.label;
    const lvl = this._getLevel();
    const map = { low: 'Low', medium: 'Medium', high: 'High', extreme: 'Extreme', none: 'None' };
    return (this.score !== undefined ? `${map[lvl]} ${this.score}` : map[lvl]);
  }

  render() {
    const level = this._getLevel();
    const size = this.size || 'md';
    return html`
      <span class="badge ${level} ${size}">
        <span class="dot ${level}"></span>
        ${this._getLabel()}
      </span>
    `;
  }
}

customElements.define('risk-badge', RiskBadge);
