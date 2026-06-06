import { LitElement, html, css } from 'lit';

class ProgressBar extends LitElement {
  static properties = {
    value:   { type: Number }, // 0-100
    max:     { type: Number },
    label:   { type: String },
    sublabel:{ type: String },
    color:   { type: String }, // CSS color
    height:  { type: Number },
    showPct: { type: Boolean },
  };

  static styles = css`
    :host { display: block; }
    .wrapper { display: flex; flex-direction: column; gap: var(--space-1); }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: var(--text-xs);
    }
    .header-label { color: var(--color-text-secondary); }
    .header-pct { font-family: var(--font-mono); color: var(--color-text-muted); }

    .track {
      width: 100%;
      background: var(--color-bg-elevated);
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    .fill {
      height: 100%;
      border-radius: var(--radius-full);
      transition: width 0.5s ease;
      background: var(--fill-color, var(--color-accent));
    }
  `;

  render() {
    const pct = Math.min(100, Math.max(0, this.value || 0));
    const h = this.height || 6;
    return html`
      <div class="wrapper">
        ${this.label || this.showPct ? html`
          <div class="header">
            ${this.label ? html`<span class="header-label">${this.label}</span>` : ''}
            ${this.showPct ? html`<span class="header-pct">${pct.toFixed(1)}%</span>` : ''}
          </div>
        ` : ''}
        <div class="track" style="height:${h}px">
          <div class="fill" style="width:${pct}%; --fill-color:${this.color || ''}"></div>
        </div>
        ${this.sublabel ? html`<div style="font-size:var(--text-xs);color:var(--color-text-muted)">${this.sublabel}</div>` : ''}
      </div>
    `;
  }
}

customElements.define('progress-bar', ProgressBar);
