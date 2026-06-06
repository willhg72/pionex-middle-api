import { LitElement, html, css } from 'lit';
import { sleep } from '../utils/polling.js';
import { store } from '../state/store.js';
import { buttonStyles } from '../styles/shared-styles.js';

/**
 * Preview → Confirm → Execute modal flow with local audit trail.
 * Emits 'closed' event on dismiss, 'executed' on success.
 * Writes a structured audit entry to store on every execution attempt.
 *
 * Props:
 *   title:       string
 *   subtitle:    string
 *   domain:      string  — domain key for audit (e.g. 'miners', 'btc-core')
 *   payload:     Array<{ label, value, highlight? }>
 *   warnings:    Array<string>
 *   executeFn:   async function → { success, message }
 *   confirmText: string
 *   dangerLevel: 'normal' | 'warning' | 'danger'
 */
class PreviewExecuteModal extends LitElement {
  static properties = {
    title:       { type: String },
    subtitle:    { type: String },
    domain:      { type: String },
    payload:     { type: Array },
    warnings:    { type: Array },
    executeFn:   { type: Object },
    confirmText: { type: String },
    dangerLevel: { type: String },
    _step:       { type: String, state: true },
    _result:     { type: Object, state: true },
    _confirmed:  { type: Boolean, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }

    .overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.75);
      z-index: 200;
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(6px);
    }

    .modal {
      background: var(--color-bg-panel);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      width: 480px;
      max-width: 95vw;
      box-shadow: var(--shadow-lg);
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--space-5);
    }

    .modal-title { font-size: var(--text-lg); font-weight: var(--weight-semibold); }
    .modal-sub   { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 3px; }

    .close-btn {
      background: none; border: none; cursor: pointer;
      color: var(--color-text-muted); font-size: 18px;
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }
    .close-btn:hover { background: var(--color-bg-hover); color: var(--color-text-primary); }

    /* Step indicator */
    .steps {
      display: flex; align-items: center; gap: var(--space-2);
      margin-bottom: var(--space-5);
    }
    .step-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--color-border-strong);
      transition: background var(--transition-fast);
    }
    .step-dot.active { background: var(--color-accent); }
    .step-dot.done   { background: var(--color-positive); }
    .step-line { flex: 1; height: 1px; background: var(--color-border-subtle); }

    /* Payload */
    .payload {
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
      padding: var(--space-4);
      margin-bottom: var(--space-4);
      display: flex; flex-direction: column; gap: var(--space-2);
    }
    .payload-row { display: flex; justify-content: space-between; align-items: center; font-size: var(--text-sm); }
    .payload-label { color: var(--color-text-secondary); }
    .payload-value { font-family: var(--font-mono); color: var(--color-text-primary); font-weight: var(--weight-medium); }
    .payload-value.highlight { color: var(--color-warning); }
    .payload-value.danger    { color: var(--color-negative); }
    .payload-value.pos       { color: var(--color-positive); }

    /* Warnings */
    .warnings-block { margin-bottom: var(--space-4); }
    .warning-item {
      display: flex; align-items: flex-start; gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      background: var(--color-warning-dim);
      border-radius: var(--radius-md); margin-bottom: var(--space-2);
      font-size: var(--text-sm); color: var(--color-warning);
    }
    .warning-item.danger { background: var(--color-negative-dim); color: var(--color-negative); }

    /* Confirm checkbox */
    .confirm-row {
      display: flex; align-items: center; gap: var(--space-3);
      padding: var(--space-3); background: var(--color-bg-elevated);
      border-radius: var(--radius-md); margin-bottom: var(--space-4); cursor: pointer;
    }
    .confirm-check {
      width: 16px; height: 16px;
      border: 1.5px solid var(--color-border-strong); border-radius: 3px;
      flex-shrink: 0; display: flex; align-items: center; justify-content: center;
      transition: all var(--transition-fast);
    }
    .confirm-check.checked { background: var(--color-accent); border-color: var(--color-accent); }
    .confirm-check-text { font-size: var(--text-sm); color: var(--color-text-secondary); }

    /* Footer */
    .footer { display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-2); }

    /* Audit stamp */
    .audit-stamp {
      margin-top: var(--space-3); padding: var(--space-2) var(--space-3);
      background: var(--color-bg-elevated); border-radius: var(--radius-md);
      font-size: var(--text-xs); color: var(--color-text-muted);
      font-family: var(--font-mono);
    }

    /* Executing */
    .executing-content { text-align: center; padding: var(--space-8) 0; }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--color-border-default);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto var(--space-4);
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .executing-label { color: var(--color-text-secondary); font-size: var(--text-sm); }

    /* Result */
    .result-content { text-align: center; padding: var(--space-8) 0; }
    .result-icon { font-size: 40px; margin-bottom: var(--space-4); }
    .result-message { font-size: var(--text-md); font-weight: var(--weight-medium); }
    .result-sub { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-2); }
  `];

  constructor() {
    super();
    this._step = 'preview';
    this._confirmed = false;
    this._result = null;
    this._auditEntry = null;
  }

  _close() {
    this.dispatchEvent(new CustomEvent('closed', { bubbles: true }));
  }

  _stepStatus(s) {
    const order = ['preview', 'confirm', 'executing', 'success'];
    const ci = order.indexOf(s);
    const cur = order.indexOf(this._step);
    if (ci < cur) return 'done';
    if (ci === cur) return 'active';
    return '';
  }

  /** Build a compact payload object for the audit record. */
  _payloadForAudit() {
    const result = {};
    (this.payload || []).forEach(row => { result[row.label] = row.value; });
    return result;
  }

  async _execute() {
    this._step = 'executing';
    await sleep(1200);
    try {
      const result = this.executeFn ? await this.executeFn() : { success: true, message: 'Action executed successfully.' };
      this._result = result;
      this._step = result.success ? 'success' : 'error';

      // Write audit trail entry regardless of success/failure
      this._auditEntry = store.addAuditEvent({
        action:    this.title || 'Unknown Action',
        domain:    this.domain || 'unknown',
        payload:   this._payloadForAudit(),
        result,
        triggeredBy: 'user',
      });

      if (result.success) {
        this.dispatchEvent(new CustomEvent('executed', { detail: { result, auditId: this._auditEntry.id }, bubbles: true }));
      }
    } catch (e) {
      this._result = { success: false, message: e.message || 'Execution failed.' };
      this._step = 'error';
      this._auditEntry = store.addAuditEvent({
        action:  this.title || 'Unknown Action',
        domain:  this.domain || 'unknown',
        payload: this._payloadForAudit(),
        result:  this._result,
        triggeredBy: 'user',
      });
    }
  }

  _renderSteps() {
    return html`
      <div class="steps">
        <div class="step-dot ${this._stepStatus('preview')}"></div>
        <div class="step-line"></div>
        <div class="step-dot ${this._stepStatus('confirm')}"></div>
        <div class="step-line"></div>
        <div class="step-dot ${this._stepStatus('executing')}"></div>
      </div>
    `;
  }

  _renderPreview() {
    const dl = this.dangerLevel || 'normal';
    return html`
      ${this._renderSteps()}

      ${(this.warnings || []).length > 0 ? html`
        <div class="warnings-block">
          ${this.warnings.map(w => html`
            <div class="warning-item ${dl === 'danger' ? 'danger' : ''}">
              <span>${dl === 'danger' ? '⚠' : '!'}</span> ${w}
            </div>
          `)}
        </div>
      ` : ''}

      <div class="payload">
        ${(this.payload || []).map(row => html`
          <div class="payload-row">
            <span class="payload-label">${row.label}</span>
            <span class="payload-value ${row.highlight || ''}">${row.value}</span>
          </div>
        `)}
      </div>

      <div class="footer">
        <button class="btn btn-ghost" @click=${this._close}>Cancel</button>
        <button class="btn btn-primary" @click=${() => this._step = 'confirm'}>
          Review &amp; Confirm →
        </button>
      </div>
    `;
  }

  _renderConfirm() {
    const btnClass = this.dangerLevel === 'danger' ? 'btn-danger' : 'btn-primary';
    return html`
      ${this._renderSteps()}
      <p style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-bottom:var(--space-4)">
        Review the action details above. This action will be sent to the exchange immediately upon execution.
        Every execution is logged to your local audit trail.
      </p>
      <div class="confirm-row" @click=${() => this._confirmed = !this._confirmed}>
        <div class="confirm-check ${this._confirmed ? 'checked' : ''}">
          ${this._confirmed ? '✓' : ''}
        </div>
        <span class="confirm-check-text">I understand this action involves real capital and cannot be undone.</span>
      </div>
      <div class="footer">
        <button class="btn btn-ghost" @click=${() => this._step = 'preview'}>← Back</button>
        <button class="btn ${btnClass}" ?disabled=${!this._confirmed} @click=${this._execute}>
          ${this.confirmText || 'Execute'}
        </button>
      </div>
    `;
  }

  _renderExecuting() {
    return html`
      <div class="executing-content">
        <div class="spinner"></div>
        <div class="executing-label">Sending to exchange...</div>
      </div>
    `;
  }

  _renderResult() {
    const ok = this._step === 'success';
    const ae = this._auditEntry;
    return html`
      <div class="result-content">
        <div class="result-icon">${ok ? '✓' : '✕'}</div>
        <div class="result-message" style="color:${ok ? 'var(--color-positive)' : 'var(--color-negative)'}">
          ${ok ? 'Executed successfully' : 'Execution failed'}
        </div>
        <div class="result-sub">${this._result?.message || ''}</div>
      </div>
      ${ae ? html`
        <div class="audit-stamp">
          ◈ Audit #${ae.id.slice(-6)} · ${new Date(ae.timestamp).toLocaleTimeString('en-US', { hour12: false })} · ${ae.domain}
        </div>
      ` : ''}
      <div class="footer">
        <button class="btn btn-ghost" @click=${this._close}>Close</button>
      </div>
    `;
  }

  render() {
    return html`
      <div class="overlay" @click=${e => { if (e.target === e.currentTarget) this._close(); }}>
        <div class="modal">
          <div class="modal-header">
            <div>
              <div class="modal-title">${this.title || 'Confirm Action'}</div>
              ${this.subtitle ? html`<div class="modal-sub">${this.subtitle}</div>` : ''}
            </div>
            <button class="close-btn" @click=${this._close}>✕</button>
          </div>

          ${this._step === 'preview'   ? this._renderPreview()   : ''}
          ${this._step === 'confirm'   ? this._renderConfirm()   : ''}
          ${this._step === 'executing' ? this._renderExecuting() : ''}
          ${this._step === 'success' || this._step === 'error' ? this._renderResult() : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('preview-execute-modal', PreviewExecuteModal);
