import { LitElement, html, css } from 'lit';
import { buttonStyles } from '../../styles/shared-styles.js';
import { router } from '../../app/router.js';
import { requestPasswordReset } from '../../services/auth.service.js';
import { getLanguage, i18n, setLanguage } from '../../services/i18n.js';

class ForgotPasswordView extends LitElement {
  static properties = {
    _email: { type: String, state: true },
    _loading: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _result: { type: Object, state: true },
    _lang: { type: String, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display:block; min-height:100vh; color:var(--color-text-primary); }
    .wrap { min-height:100vh; display:grid; place-items:center; padding:24px; background:linear-gradient(180deg, #07111f 0%, #0d1727 100%); }
    .card { width:min(560px,100%); padding:32px; border-radius:24px; background:rgba(9,16,27,0.92); border:1px solid rgba(255,255,255,0.07); }
    .header-row { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px; }
    .lang { display:flex; gap:8px; }
    h1 { margin:0 0 8px; font-size:34px; }
    p { margin:0 0 20px; color:var(--color-text-muted); line-height:1.6; }
    .field { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
    .label { font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:var(--color-text-muted); font-weight:700; }
    .input { width:100%; padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.09); background:rgba(255,255,255,0.03); color:var(--color-text-primary); }
    .note,.error { margin-top:14px; padding:12px 14px; border-radius:12px; font-size:13px; line-height:1.5; }
    .note { background:rgba(34,211,160,0.08); border:1px solid rgba(34,211,160,0.18); }
    .error { background:rgba(240,74,94,0.1); border:1px solid rgba(240,74,94,0.25); color:#ff99a6; }
    .linkbox { margin-top:12px; padding:12px; border-radius:12px; background:rgba(255,255,255,0.03); overflow-wrap:anywhere; }
  `];

  constructor() {
    super();
    this._email = '';
    this._loading = false;
    this._error = '';
    this._result = null;
    this._lang = getLanguage();
  }

  connectedCallback() {
    super.connectedCallback();
    this._langHandler = () => { this._lang = getLanguage(); };
    window.addEventListener('capintel-lang-changed', this._langHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('capintel-lang-changed', this._langHandler);
  }

  async _submit(event) {
    event.preventDefault();
    this._loading = true;
    this._error = '';
    try {
      this._result = await requestPasswordReset({ email: this._email.trim() });
    } catch (error) {
      this._error = error?.data?.detail || error.message || 'Request failed.';
    } finally {
      this._loading = false;
    }
  }

  render() {
    return html`
      <div class="wrap">
        <form class="card" @submit=${this._submit}>
          <div class="header-row">
            <div>${i18n('product', this._lang)}</div>
            <div class="lang">
              <button class="btn ${this._lang === 'es' ? 'btn-primary' : 'btn-ghost'}" type="button" @click=${() => setLanguage('es')}>ES</button>
              <button class="btn ${this._lang === 'en' ? 'btn-primary' : 'btn-ghost'}" type="button" @click=${() => setLanguage('en')}>EN</button>
            </div>
          </div>
          <h1>${i18n('forgot', this._lang)}</h1>
          <p>${i18n('forgotSubtitle', this._lang)}</p>
          <label class="field">
            <span class="label">${i18n('email', this._lang)}</span>
            <input class="input" type="email" .value=${this._email} @input=${(e) => this._email = e.target.value} />
          </label>
          <button class="btn btn-primary" type="submit" ?disabled=${this._loading}>
            ${this._loading ? i18n('sendingRecovery', this._lang) : i18n('sendRecovery', this._lang)}
          </button>
          ${this._result ? html`
            <div class="note">
              ${this._result.message}
              <div class="linkbox">${i18n('localRecovery', this._lang)}</div>
              ${this._result.resetUrl ? html`<div class="linkbox"><a href="${this._result.resetUrl}">${this._result.resetUrl}</a></div>` : ''}
            </div>
          ` : ''}
          ${this._error ? html`<div class="error">${this._error}</div>` : ''}
          <div style="margin-top:16px;">
            <button class="btn btn-ghost" type="button" @click=${() => router.navigate('sign-in')}>${i18n('backToSignIn', this._lang)}</button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('forgot-password-view', ForgotPasswordView);
