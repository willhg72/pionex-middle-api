import { LitElement, html, css } from 'lit';

class SegmentedControl extends LitElement {
  static properties = {
    options:  { type: Array }, // Array<{ value, label }>
    value:    { type: String },
  };

  static styles = css`
    :host { display: inline-flex; }
    .control {
      display: inline-flex;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      padding: 2px;
      gap: 2px;
    }
    .seg {
      padding: var(--space-1) var(--space-3);
      border-radius: calc(var(--radius-md) - 2px);
      font-size: var(--text-xs);
      font-weight: var(--weight-medium);
      cursor: pointer;
      color: var(--color-text-muted);
      transition: all var(--transition-fast);
      user-select: none;
      white-space: nowrap;
    }
    .seg:hover { color: var(--color-text-secondary); }
    .seg.active {
      background: var(--color-bg-active);
      color: var(--color-text-primary);
    }
  `;

  _select(val) {
    this.value = val;
    this.dispatchEvent(new CustomEvent('change', { detail: val, bubbles: true }));
  }

  render() {
    return html`
      <div class="control">
        ${(this.options || []).map(opt => html`
          <div
            class="seg ${this.value === opt.value ? 'active' : ''}"
            @click=${() => this._select(opt.value)}
          >${opt.label}</div>
        `)}
      </div>
    `;
  }
}

customElements.define('segmented-control', SegmentedControl);
