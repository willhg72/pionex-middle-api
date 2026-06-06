import { LitElement, html, css } from 'lit';

const baseStyles = css`
  :host { display: flex; align-items: center; justify-content: center; padding: var(--space-12); width: 100%; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: var(--space-3); text-align: center; }
  .icon { font-size: 32px; opacity: 0.4; }
  .label { font-size: var(--text-sm); color: var(--color-text-muted); }
  .sub   { font-size: var(--text-xs); color: var(--color-text-disabled); }
`;

class LoadingView extends LitElement {
  static properties = { label: { type: String } };
  static styles = [baseStyles, css`
    .spinner { width: 32px; height: 32px; border: 2px solid var(--color-border-default); border-top-color: var(--color-accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `];
  render() { return html`<div class="wrap"><div class="spinner"></div><span class="label">${this.label || 'Loading...'}</span></div>`; }
}

class EmptyView extends LitElement {
  static properties = { label: { type: String }, sub: { type: String } };
  static styles = baseStyles;
  render() { return html`<div class="wrap"><div class="icon">◎</div><span class="label">${this.label || 'No data'}</span>${this.sub ? html`<span class="sub">${this.sub}</span>` : ''}</div>`; }
}

class ErrorView extends LitElement {
  static properties = { label: { type: String }, sub: { type: String } };
  static styles = [baseStyles, css`.icon { color: var(--color-negative); }`];
  render() { return html`<div class="wrap"><div class="icon">⚠</div><span class="label" style="color:var(--color-negative)">${this.label || 'Error loading data'}</span>${this.sub ? html`<span class="sub">${this.sub}</span>` : ''}</div>`; }
}

class StaleView extends LitElement {
  static properties = { label: { type: String }, age: { type: String } };
  static styles = [baseStyles, css`.icon { color: var(--color-warning); }`];
  render() { return html`<div class="wrap"><div class="icon">⟳</div><span class="label" style="color:var(--color-warning)">${this.label || 'Data may be stale'}</span>${this.age ? html`<span class="sub">Last updated ${this.age}</span>` : ''}</div>`; }
}

customElements.define('loading-view', LoadingView);
customElements.define('empty-view', EmptyView);
customElements.define('error-view', ErrorView);
customElements.define('stale-view', StaleView);
