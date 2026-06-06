import { LitElement, html, css } from 'lit';
import { buttonStyles } from '../../styles/shared-styles.js';
import { router } from '../../app/router.js';
import { resetPassword } from '../../services/auth.service.js';
import { getLanguage, i18n, setLanguage } from '../../services/i18n.js';

class ResetPasswordView extends LitElement {
  static properties = {
    _token: { type: String, state: true },
    _password: { type: String, state: true },
    _loading: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _success: { type: String, state: true },
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
    .msg,.error { margin-top:14px; padding:12px 14px; border-radius:12px; font-size:13px; line-height:1.5; }
    .msg { background:rgba(34,211,160,0.08); border:1px solid rgba(34,211,160,0.18); }
    .error { background:rgba(240,74,94,0.1); border:1px solid rgba(240,74,94,0.25); color:#ff99a6; }
  `];

  constructor() {
    super();
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    this._token = params.get('token') || '';
    this._password = '';
    this._loading = false;
    this._error = '';
    this._success = '';
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
    this._success = '';
    try {
      const result = await resetPassword({ resetToken: this._token, newPassword: this._password });
      this._success = result.message;
    } catch (error) {
      this._error = error?.data?.detail || error.message || 'Reset failed.';
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
          <h1>${i18n('reset', this._lang)}</h1>
          <p>${i18n('resetSubtitle', this._lang)}</p>
          <label class="field">
            <span class="label">${i18n('newPassword', this._lang)}</span>
            <input class="input" type="password" .value=${this._password} @input=${(e) => this._password = e.target.value} />
          </label>
          <button class="btn btn-primary" type="submit" ?disabled=${this._loading || !this._token}>
            ${this._loading ? i18n('updatingPassword', this._lang) : i18n('updatePassword', this._lang)}
          </button>
          ${this._success ? html`<div class="msg">${this._success}</div>` : ''}
          ${this._error ? html`<div class="error">${this._error}</div>` : ''}
          <div style="margin-top:16px;">
            <button class="btn btn-ghost" type="button" @click=${() => router.navigate('sign-in')}>${i18n('backToSignIn', this._lang)}</button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('reset-password-view', ResetPasswordView);
