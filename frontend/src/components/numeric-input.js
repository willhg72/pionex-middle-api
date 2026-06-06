import { LitElement, html, css } from 'lit';

class NumericInput extends LitElement {
  static properties = {
    value:    { type: Number },
    min:      { type: Number },
    max:      { type: Number },
    step:     { type: Number },
    label:    { type: String },
    suffix:   { type: String },
    prefix:   { type: String },
    disabled: { type: Boolean },
  };

  static styles = css`
    :host { display: block; }
    .field { display: flex; flex-direction: column; gap: var(--space-1); }
    .label { font-size: var(--text-xs); font-weight: var(--weight-medium); color: var(--color-text-secondary); }
    .input-wrap {
      display: flex; align-items: center;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .input-wrap:focus-within { border-color: var(--color-accent); }
    .prefix, .suffix {
      padding: 0 var(--space-2);
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      flex-shrink: 0;
    }
    input[type=number] {
      flex: 1; border: none; background: transparent;
      font-family: var(--font-mono); font-size: var(--text-base);
      color: var(--color-text-primary);
      padding: var(--space-2) var(--space-1);
      text-align: right;
    }
    input[type=number]:focus { outline: none; }
    input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
    .btn-step {
      background: var(--color-bg-active); border: none;
      padding: var(--space-2) var(--space-2); cursor: pointer;
      color: var(--color-text-secondary); font-size: 11px;
      transition: all var(--transition-fast);
      border-left: 1px solid var(--color-border-subtle);
    }
    .btn-step:hover { background: var(--color-bg-hover); color: var(--color-text-primary); }
  `;

  _change(e) {
    const v = parseFloat(e.target.value);
    this.value = isNaN(v) ? this.value : v;
    this.dispatchEvent(new CustomEvent('change', { detail: this.value, bubbles: true }));
  }

  _step(dir) {
    const s = this.step || 1;
    const newVal = (this.value || 0) + dir * s;
    const clamped = this.min !== undefined ? Math.max(this.min, this.max !== undefined ? Math.min(this.max, newVal) : newVal) : newVal;
    this.value = parseFloat(clamped.toFixed(8));
    this.dispatchEvent(new CustomEvent('change', { detail: this.value, bubbles: true }));
  }

  render() {
    return html`
      <div class="field">
        ${this.label ? html`<label class="label">${this.label}</label>` : ''}
        <div class="input-wrap">
          ${this.prefix ? html`<span class="prefix">${this.prefix}</span>` : ''}
          <input
            type="number"
            .value=${this.value ?? ''}
            min=${this.min ?? ''}
            max=${this.max ?? ''}
            step=${this.step ?? 'any'}
            ?disabled=${this.disabled}
            @change=${this._change}
            @input=${this._change}
          />
          ${this.suffix ? html`<span class="suffix">${this.suffix}</span>` : ''}
          <button class="btn-step" @click=${() => this._step(-1)}>−</button>
          <button class="btn-step" @click=${() => this._step(+1)}>+</button>
        </div>
      </div>
    `;
  }
}

customElements.define('numeric-input', NumericInput);
