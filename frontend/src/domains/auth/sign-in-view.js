import { LitElement, html, css } from 'lit';
import { buttonStyles } from '../../styles/shared-styles.js';
import { router } from '../../app/router.js';
import { signIn } from '../../services/auth.service.js';
import { getLanguage, i18n, setLanguage } from '../../services/i18n.js';

class SignInView extends LitElement {
  static properties = {
    _email: { type: String, state: true },
    _password: { type: String, state: true },
    _loading: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _lang: { type: String, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display:block; min-height:100vh; color:var(--color-text-primary); }
    .auth-shell { min-height:100vh; display:grid; grid-template-columns:minmax(320px,520px) 1fr; background:radial-gradient(circle at top left, rgba(91,141,239,0.22), transparent 30%), linear-gradient(135deg, #07111f 0%, #0b1627 48%, #111d2f 100%); }
    .panel { display:flex; flex-direction:column; justify-content:center; padding:clamp(24px,5vw,56px); background:rgba(7,14,24,0.88); border-right:1px solid rgba(255,255,255,0.06); backdrop-filter:blur(12px); }
    .hero { display:flex; flex-direction:column; justify-content:center; gap:var(--space-5); padding:clamp(24px,5vw,64px); }
    .eyebrow { font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#8aa3d8; font-weight:700; }
    .header-row { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px; }
    .lang-toggle { display:flex; gap:8px; }
    h1 { margin:0 0 var(--space-2); font-size:clamp(28px,4vw,54px); line-height:1.02; }
    p { margin:0; color:var(--color-text-muted); line-height:1.6; }
    .card-title { font-size:28px; margin:0 0 8px; }
    .card-sub { color:var(--color-text-muted); margin-bottom:24px; }
    .stack { display:flex; flex-direction:column; gap:16px; }
    .field { display:flex; flex-direction:column; gap:8px; }
    .label { font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:var(--color-text-muted); font-weight:700; }
    .input { width:100%; padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.09); background:rgba(255,255,255,0.03); color:var(--color-text-primary); font-size:14px; outline:none; }
    .input:focus { border-color:rgba(91,141,239,0.7); box-shadow:0 0 0 3px rgba(91,141,239,0.18); }
    .error { padding:12px 14px; border-radius:12px; background:rgba(240,74,94,0.1); border:1px solid rgba(240,74,94,0.25); color:#ff99a6; font-size:13px; }
    .actions { display:flex; flex-direction:column; gap:12px; margin-top:8px; }
    .switch-row { display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; }
    .switch { font-size:13px; color:var(--color-text-muted); }
    .switch a { color:#8db2ff; cursor:pointer; text-decoration:none; }
    .metrics { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:16px; margin-top:12px; }
    .metric { padding:18px; border-radius:18px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); }
    .metric-label { font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#7e93be; }
    .metric-value { margin-top:10px; font-size:24px; font-weight:700; }
    @media (max-width:900px) { .auth-shell { grid-template-columns:1fr; } .hero { order:-1; min-height:260px; } .metrics { grid-template-columns:1fr; } }
  `];

  constructor() {
    super();
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
      await signIn({ email: this._email.trim(), password: this._password });
      window.dispatchEvent(new CustomEvent('capintel-auth-changed'));
      router.navigate('overview');
    } catch (error) {
      this._error = error?.data?.detail || error.message || 'Unable to sign in.';
    } finally {
      this._loading = false;
    }
  }

  render() {
    return html`
      <div class="auth-shell">
        <section class="panel">
          <div class="header-row">
            <div class="eyebrow">${i18n('product', this._lang)}</div>
            <div class="lang-toggle">
              <button class="btn ${this._lang === 'es' ? 'btn-primary' : 'btn-ghost'}" type="button" @click=${() => setLanguage('es')}>ES</button>
              <button class="btn ${this._lang === 'en' ? 'btn-primary' : 'btn-ghost'}" type="button" @click=${() => setLanguage('en')}>EN</button>
            </div>
          </div>
          <h2 class="card-title">${i18n('signIn', this._lang)}</h2>
          <div class="card-sub">${i18n('signInSubtitle', this._lang)}</div>
          <form class="stack" @submit=${this._submit}>
            <label class="field">
              <span class="label">${i18n('email', this._lang)}</span>
              <input class="input" type="email" autocomplete="email" .value=${this._email} @input=${(e) => this._email = e.target.value} />
            </label>
            <label class="field">
              <span class="label">${i18n('password', this._lang)}</span>
              <input class="input" type="password" autocomplete="current-password" .value=${this._password} @input=${(e) => this._password = e.target.value} />
            </label>
            ${this._error ? html`<div class="error">${this._error}</div>` : ''}
            <div class="actions">
              <button class="btn btn-primary" type="submit" ?disabled=${this._loading}>
                ${this._loading ? i18n('signingIn', this._lang) : i18n('signInButton', this._lang)}
              </button>
              <div class="switch-row">
                <div class="switch">
                  ${i18n('noAccount', this._lang)}
                  <a @click=${() => router.navigate('sign-up')}>${i18n('createAccount', this._lang)}</a>
                </div>
                <div class="switch">
                  <a @click=${() => router.navigate('forgot-password')}>${i18n('forgotPassword', this._lang)}</a>
                </div>
              </div>
            </div>
          </form>
        </section>
        <section class="hero">
          <div class="eyebrow">${i18n('cockpit', this._lang)}</div>
          <h1>Worker dashboard, pero listo para evolucionar.</h1>
          <p>Esta capa nueva separa acceso, espacio de trabajo y experiencia visual del plano operacional. Eso nos permite migrar tabs, endurecer backend y mejorar el producto sin repetir deuda del monolito.</p>
          <div class="metrics">
            <div class="metric">
              <div class="metric-label">${i18n('workspaceIsolation', this._lang)}</div>
              <div class="metric-value">Live</div>
            </div>
            <div class="metric">
              <div class="metric-label">${i18n('authEntry', this._lang)}</div>
              <div class="metric-value">Phase 1</div>
            </div>
            <div class="metric">
              <div class="metric-label">${i18n('migrationPath', this._lang)}</div>
              <div class="metric-value">Tab by Tab</div>
            </div>
          </div>
        </section>
      </div>
    `;
  }
}

customElements.define('sign-in-view', SignInView);
