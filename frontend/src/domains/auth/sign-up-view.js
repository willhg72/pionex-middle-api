import { LitElement, html, css } from 'lit';
import { buttonStyles } from '../../styles/shared-styles.js';
import { router } from '../../app/router.js';
import { signUp } from '../../services/auth.service.js';
import { getLanguage, i18n, setLanguage } from '../../services/i18n.js';

class SignUpView extends LitElement {
  static properties = {
    _fullName: { type: String, state: true },
    _tenantName: { type: String, state: true },
    _email: { type: String, state: true },
    _password: { type: String, state: true },
    _loading: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _lang: { type: String, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display:block; min-height:100vh; color:var(--color-text-primary); }
    .shell { min-height:100vh; display:grid; place-items:center; padding:24px; background:radial-gradient(circle at 15% 20%, rgba(34,211,160,0.15), transparent 24%), radial-gradient(circle at 85% 10%, rgba(91,141,239,0.2), transparent 28%), linear-gradient(180deg, #07111f 0%, #0d1727 100%); }
    .card { width:min(620px,100%); padding:clamp(24px,4vw,40px); border-radius:28px; background:rgba(9,16,27,0.92); border:1px solid rgba(255,255,255,0.07); box-shadow:0 30px 80px rgba(0,0,0,0.35); }
    .header-row { display:flex; justify-content:space-between; align-items:center; gap:12px; }
    .lang { display:flex; gap:8px; }
    .eyebrow { font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#9fd6c6; font-weight:700; }
    h1 { margin:10px 0 8px; font-size:clamp(28px,4vw,42px); }
    p { margin:0 0 24px; color:var(--color-text-muted); line-height:1.6; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .field { display:flex; flex-direction:column; gap:8px; }
    .full { grid-column:1 / -1; }
    .label { font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:var(--color-text-muted); font-weight:700; }
    .input { width:100%; padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.09); background:rgba(255,255,255,0.03); color:var(--color-text-primary); font-size:14px; outline:none; }
    .input:focus { border-color:rgba(34,211,160,0.7); box-shadow:0 0 0 3px rgba(34,211,160,0.14); }
    .error { margin-top:16px; padding:12px 14px; border-radius:12px; background:rgba(240,74,94,0.1); border:1px solid rgba(240,74,94,0.25); color:#ff99a6; font-size:13px; }
    .footer { margin-top:22px; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; }
    .link { color:#9fd6c6; cursor:pointer; text-decoration:none; font-size:13px; }
    @media (max-width:720px) { .grid { grid-template-columns:1fr; } }
  `];

  constructor() {
    super();
    this._fullName = '';
    this._tenantName = '';
    this._email = '';
    this._password = '';
    this._loading = false;
    this._error = '';
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
      await signUp({
        fullName: this._fullName.trim(),
        tenantName: this._tenantName.trim(),
        email: this._email.trim(),
        password: this._password,
      });
      window.dispatchEvent(new CustomEvent('capintel-auth-changed'));
      router.navigate('overview');
    } catch (error) {
      this._error = error?.data?.detail || error.message || 'Unable to create account.';
    } finally {
      this._loading = false;
    }
  }

  render() {
    return html`
      <div class="shell">
        <form class="card" @submit=${this._submit}>
          <div class="header-row">
            <div class="eyebrow">${i18n('product', this._lang)}</div>
            <div class="lang">
              <button class="btn ${this._lang === 'es' ? 'btn-primary' : 'btn-ghost'}" type="button" @click=${() => setLanguage('es')}>ES</button>
              <button class="btn ${this._lang === 'en' ? 'btn-primary' : 'btn-ghost'}" type="button" @click=${() => setLanguage('en')}>EN</button>
            </div>
          </div>
          <h1>${i18n('signUp', this._lang)}</h1>
          <p>${i18n('signUpSubtitle', this._lang)}</p>
          <div class="grid">
            <label class="field">
              <span class="label">${i18n('fullName', this._lang)}</span>
              <input class="input" .value=${this._fullName} @input=${(e) => this._fullName = e.target.value} />
            </label>
            <label class="field">
              <span class="label">${i18n('workspaceName', this._lang)}</span>
              <input class="input" .value=${this._tenantName} @input=${(e) => this._tenantName = e.target.value} />
            </label>
            <label class="field full">
              <span class="label">${i18n('email', this._lang)}</span>
              <input class="input" type="email" autocomplete="email" .value=${this._email} @input=${(e) => this._email = e.target.value} />
            </label>
            <label class="field full">
              <span class="label">${i18n('password', this._lang)}</span>
              <input class="input" type="password" autocomplete="new-password" .value=${this._password} @input=${(e) => this._password = e.target.value} />
            </label>
          </div>
          ${this._error ? html`<div class="error">${this._error}</div>` : ''}
          <div class="footer">
            <a class="link" @click=${() => router.navigate('sign-in')}>${i18n('alreadyHave', this._lang)} ${i18n('signInLink', this._lang)}</a>
            <button class="btn btn-primary" type="submit" ?disabled=${this._loading}>
              ${this._loading ? i18n('creatingWorkspace', this._lang) : i18n('createWorkspace', this._lang)}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('sign-up-view', SignUpView);
