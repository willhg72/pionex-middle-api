import { LitElement, html, css } from 'lit';

class ConfirmationModal extends LitElement {
  static properties = {
    title:   { type: String },
    message: { type: String },
    confirmLabel: { type: String },
    cancelLabel:  { type: String },
    danger:  { type: Boolean },
  };

  static styles = css`
    :host { display: block; }
    .overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      z-index: 300;
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(4px);
    }
    .modal {
      background: var(--color-bg-panel);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      width: 400px; max-width: 95vw;
      box-shadow: var(--shadow-lg);
    }
    .title { font-size: var(--text-lg); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }
    .message { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.6; margin-bottom: var(--space-6); }
    .footer { display: flex; gap: var(--space-3); justify-content: flex-end; }
  `;

  _confirm() { this.dispatchEvent(new CustomEvent('confirm', { bubbles: true })); }
  _cancel()  { this.dispatchEvent(new CustomEvent('cancel', { bubbles: true })); }

  render() {
    return html`
      <div class="overlay" @click=${e => { if (e.target === e.currentTarget) this._cancel(); }}>
        <div class="modal">
          <div class="title">${this.title || 'Are you sure?'}</div>
          <div class="message">${this.message || 'This action cannot be undone.'}</div>
          <div class="footer">
            <button class="btn btn-ghost" @click=${this._cancel}>${this.cancelLabel || 'Cancel'}</button>
            <button class="btn ${this.danger ? 'btn-danger' : 'btn-primary'}" @click=${this._confirm}>${this.confirmLabel || 'Confirm'}</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirmation-modal', ConfirmationModal);
