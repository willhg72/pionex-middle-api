import { LitElement, html, css } from 'lit';

class ToastNotification extends LitElement {
  static properties = {
    _toasts: { type: Array, state: true },
  };

  static styles = css`
    :host {
      position: fixed;
      bottom: var(--space-6);
      right: var(--space-6);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      pointer-events: none;
    }
    .toast {
      pointer-events: all;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-lg);
      padding: var(--space-3) var(--space-4);
      display: flex;
      align-items: center;
      gap: var(--space-3);
      box-shadow: var(--shadow-lg);
      animation: slideIn 0.2s ease;
      min-width: 280px;
      max-width: 380px;
    }
    @keyframes slideIn {
      from { transform: translateX(20px); opacity: 0; }
      to   { transform: translateX(0); opacity: 1; }
    }
    .toast.success { border-left: 3px solid var(--color-positive); }
    .toast.error   { border-left: 3px solid var(--color-negative); }
    .toast.warning { border-left: 3px solid var(--color-warning); }
    .toast.info    { border-left: 3px solid var(--color-accent); }

    .toast-icon { font-size: 16px; flex-shrink: 0; }
    .toast-body { flex: 1; }
    .toast-title { font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text-primary); }
    .toast-sub   { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }
    .toast-close {
      background: none; border: none; cursor: pointer;
      color: var(--color-text-muted); font-size: 14px;
      padding: 2px; border-radius: var(--radius-sm);
    }
    .toast-close:hover { color: var(--color-text-primary); }
  `;

  constructor() {
    super();
    this._toasts = [];
    // Expose global show method
    window.toast = (msg, opts = {}) => this.show(msg, opts);
  }

  show(message, { type = 'info', title, duration = 4000 } = {}) {
    const id = Date.now() + Math.random();
    const toast = { id, message, title, type };
    this._toasts = [...this._toasts, toast];
    if (duration > 0) {
      setTimeout(() => this._dismiss(id), duration);
    }
  }

  _dismiss(id) {
    this._toasts = this._toasts.filter(t => t.id !== id);
  }

  _icon(type) {
    return { success: '✓', error: '✕', warning: '!', info: 'i' }[type] || 'i';
  }

  render() {
    return html`
      ${this._toasts.map(t => html`
        <div class="toast ${t.type}">
          <span class="toast-icon">${this._icon(t.type)}</span>
          <div class="toast-body">
            ${t.title ? html`<div class="toast-title">${t.title}</div>` : ''}
            <div class="toast-sub">${t.message}</div>
          </div>
          <button class="toast-close" @click=${() => this._dismiss(t.id)}>✕</button>
        </div>
      `)}
    `;
  }
}

customElements.define('toast-notification', ToastNotification);
