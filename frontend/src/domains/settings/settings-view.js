import { LitElement, html, css } from 'lit';
import { exportDashboard, importDashboard } from '../../utils/export.js';
import { persistence } from '../../utils/persistence.js';
import { buttonStyles } from '../../styles/shared-styles.js';
import { settingsService } from '../../services/settings.service.js';
import {
  applyLocalePreferences,
  getBrowserTimezone,
  getLanguage,
  getTimezone,
  getTimezoneOptions,
  i18n,
} from '../../services/i18n.js';

class SettingsView extends LitElement {
  static properties = {
    _apiKey: { type: String, state: true },
    _apiSecret: { type: String, state: true },
    _apiKeyMasked: { type: String, state: true },
    _apiStored: { type: Boolean, state: true },
    _riskProfile: { type: String, state: true },
    _planTier: { type: String, state: true },
    _maxCapPct: { type: Number, state: true },
    _maxLeverage: { type: Number, state: true },
    _exchange: { type: String, state: true },
    _refreshInterval: { type: Number, state: true },
    _fixedIncomeAnnualPct: { type: Number, state: true },
    _language: { type: String, state: true },
    _timezone: { type: String, state: true },
    _timezoneOptions: { type: Array, state: true },
    _loading: { type: Boolean, state: true },
    _saved: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _validationMessage: { type: String, state: true },
    _lang: { type: String, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-5); }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-4); }
    .field-group { display: flex; flex-direction: column; gap: var(--space-4); }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label {
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      color: var(--color-text-secondary);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .field-input, .field-select {
      width: 100%;
      padding: 10px var(--space-3);
      background: var(--color-bg-base);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      color: var(--color-text-primary);
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      line-height: 1.5;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      outline: none;
      -webkit-appearance: none;
      appearance: none;
    }
    .field-input:hover, .field-select:hover { border-color: var(--color-border-strong); }
    .field-input:focus, .field-select:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(91,141,239,0.18);
    }
    .field-select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23636b8a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
      cursor: pointer;
    }
    .field-hint { font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.5; }
    .field-actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
    .risk-profiles { display: flex; flex-direction: column; gap: var(--space-2); }
    .risk-profile-opt {
      display: flex; align-items: center; gap: var(--space-3);
      padding: var(--space-3);
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border-subtle);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .risk-profile-opt:hover { border-color: var(--color-border-default); }
    .risk-profile-opt.selected { border-color: var(--color-accent); background: var(--color-accent-dim); }
    .rp-radio {
      width: 16px; height: 16px; border-radius: 50%;
      border: 2px solid var(--color-border-strong);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .rp-radio.selected { border-color: var(--color-accent); }
    .rp-radio.selected::after {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--color-accent);
    }
    .rp-body { flex: 1; }
    .rp-name { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .rp-desc { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }
    .limits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
    .data-actions { display: flex; flex-direction: column; gap: var(--space-3); }
    .data-action {
      display: flex; align-items: center; justify-content: space-between;
      gap: var(--space-3);
      padding: var(--space-3);
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
    }
    .da-label { font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .da-sub { font-size: var(--text-xs); color: var(--color-text-muted); }
    .save-bar {
      display: flex; align-items: center; justify-content: flex-end; gap: var(--space-3);
      padding-top: var(--space-4); border-top: 1px solid var(--color-border-subtle); margin-top: var(--space-2);
      flex-wrap: wrap;
    }
    .saved-msg { font-size: var(--text-xs); color: var(--color-positive); }
    .status-note, .error-box, .success-box {
      padding: 10px 12px;
      border-radius: var(--radius-md);
      font-size: var(--text-xs);
      line-height: 1.5;
      border: 1px solid var(--color-border-subtle);
    }
    .status-note { background: var(--color-bg-elevated); color: var(--color-text-muted); }
    .error-box { background: rgba(240,74,94,0.12); color: var(--color-negative); border-color: rgba(240,74,94,0.22); }
    .success-box { background: rgba(34,211,160,0.12); color: var(--color-positive); border-color: rgba(34,211,160,0.22); }
  `];

  constructor() {
    super();
    const saved = persistence.load('capintel_settings') || {};
    this._apiKey = saved.exchangeApiKey || '';
    this._apiSecret = saved.exchangeApiSecret || saved.apiSecret || '';
    this._apiKeyMasked = saved.exchangeApiKeyMasked || '';
    this._apiStored = Boolean(saved.hasExchangeApiKey);
    this._riskProfile = saved.riskProfile || 'moderate';
    this._planTier = saved.planTier || 'free';
    this._maxCapPct = saved.maxCapPct || 90;
    this._maxLeverage = saved.maxLeverage || 10;
    this._exchange = saved.exchange || 'pionex';
    this._refreshInterval = saved.refreshInterval || 30;
    this._fixedIncomeAnnualPct = saved.fixedIncomeAnnualPct || 3.48;
    this._language = saved.language || getLanguage();
    this._timezone = saved.timezone || getTimezone();
    this._timezoneOptions = getTimezoneOptions();
    this._loading = false;
    this._saved = false;
    this._error = '';
    this._validationMessage = '';
    this._lang = getLanguage();
  }

  connectedCallback() {
    super.connectedCallback();
    this._localeListener = () => {
      this._lang = getLanguage();
      this.requestUpdate();
    };
    window.addEventListener('capintel-locale-changed', this._localeListener);
    this._load();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('capintel-locale-changed', this._localeListener);
  }

  _t(key) {
    return i18n(key, this._lang);
  }

  _normalizeError(error, fallbackKey) {
    const detail = error?.data?.detail || error?.message || '';
    if (detail === 'Internal server error. Please try again.') {
      return this._t('genericTryAgain');
    }
    return detail || this._t(fallbackKey);
  }

  async _load() {
    this._loading = true;
    this._error = '';
    try {
      const saved = await settingsService.getSettings();
      this._riskProfile = saved.riskProfile;
      this._planTier = saved.planTier || 'free';
      this._maxCapPct = saved.maxCapPct;
      this._maxLeverage = saved.maxLeverage;
      this._exchange = saved.exchange;
      this._refreshInterval = saved.refreshInterval;
      this._fixedIncomeAnnualPct = saved.fixedIncomeAnnualPct || 3.48;
      this._language = saved.language || getLanguage();
      this._timezone = saved.timezone || getTimezone();
      this._apiStored = saved.hasExchangeApiKey;
      this._apiKeyMasked = saved.exchangeApiKeyMasked || '';
      this._timezoneOptions = [...new Set([this._timezone, getBrowserTimezone(), ...getTimezoneOptions()])];
      applyLocalePreferences({ language: this._language, timezone: this._timezone });
    } catch (error) {
      this._error = this._normalizeError(error, 'settingsLoadError');
    } finally {
      this._loading = false;
    }
  }

  _detectTimezone() {
    this._timezone = getBrowserTimezone();
    this._timezoneOptions = [...new Set([this._timezone, ...this._timezoneOptions])];
    applyLocalePreferences({ language: this._language, timezone: this._timezone });
  }

  async _save() {
    this._loading = true;
    this._error = '';
    this._validationMessage = '';
    try {
      const payload = {
        exchange: this._exchange,
        exchangeApiKey: this._apiKey.trim() || null,
        exchangeApiSecret: this._apiSecret.trim() || null,
        riskProfile: this._riskProfile,
        planTier: this._planTier,
        maxCapPct: this._maxCapPct,
        maxLeverage: this._maxLeverage,
        refreshInterval: this._refreshInterval,
        fixedIncomeAnnualPct: this._fixedIncomeAnnualPct,
        theme: 'dark',
        language: this._language,
        timezone: this._timezone,
      };
      if (payload.exchangeApiKey || payload.exchangeApiSecret) {
        const validation = await settingsService.validateApiKey(payload);
        if (!validation.valid) {
          throw new Error(validation.reason || 'Pionex credentials could not be validated.');
        }
        this._validationMessage = this._t('apiValidated');
      }
      const saved = await settingsService.saveSettings(payload);
      persistence.save('capintel_settings', {
        ...(persistence.load('capintel_settings') || {}),
        exchangeApiKey: this._apiKey.trim(),
        exchangeApiSecret: this._apiSecret.trim(),
        planTier: saved.planTier,
        language: saved.language,
        timezone: saved.timezone,
      });
      this._apiStored = saved.hasExchangeApiKey;
      this._apiKeyMasked = saved.exchangeApiKeyMasked || '';
      this._apiKey = '';
      this._apiSecret = '';
      this._language = saved.language;
      this._timezone = saved.timezone;
      this._planTier = saved.planTier || this._planTier;
      this._saved = true;
      applyLocalePreferences({ language: saved.language, timezone: saved.timezone });
      setTimeout(() => {
        this._saved = false;
      }, 3000);
      window.toast?.(this._t('settingsSavedToast'), { type: 'success' });
    } catch (error) {
      this._validationMessage = '';
      this._error = this._normalizeError(error, 'settingsSaveError');
      window.toast?.(this._error, { type: 'error' });
    } finally {
      this._loading = false;
    }
  }

  async _import() {
    try {
      await importDashboard();
      window.toast?.(this._t('importDashboardState'), { type: 'success' });
    } catch (error) {
      window.toast?.(`${this._t('importFailed')}: ${error.message}`, { type: 'error' });
    }
  }

  _renderRiskProfile() {
    const profiles = [
      { id: 'conservative', name: this._t('conservative'), desc: this._t('conservativeDesc') },
      { id: 'moderate', name: this._t('moderate'), desc: this._t('moderateDesc') },
      { id: 'aggressive', name: this._t('aggressive'), desc: this._t('aggressiveDesc') },
    ];

    return html`
      <div class="risk-profiles">
        ${profiles.map((profile) => html`
          <div class="risk-profile-opt ${this._riskProfile === profile.id ? 'selected' : ''}" @click=${() => { this._riskProfile = profile.id; }}>
            <div class="rp-radio ${this._riskProfile === profile.id ? 'selected' : ''}"></div>
            <div class="rp-body">
              <div class="rp-name">${profile.name}</div>
              <div class="rp-desc">${profile.desc}</div>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  _renderPlanTier() {
    const plans = [
      { id: 'free', name: this._t('freePlan'), desc: this._lang === 'en' ? 'Capital auto-refresh every 60s.' : 'Auto-refresh de Capital cada 60s.' },
      { id: 'pro', name: this._t('proPlan'), desc: this._lang === 'en' ? 'Capital auto-refresh every 30s.' : 'Auto-refresh de Capital cada 30s.' },
      { id: 'premium', name: this._t('premiumPlan'), desc: this._lang === 'en' ? 'Capital auto-refresh every 30s plus manual refresh with limits.' : 'Auto-refresh de Capital cada 30s más refresh manual con límites.' },
    ];

    return html`
      <div class="risk-profiles">
        ${plans.map((plan) => html`
          <div class="risk-profile-opt ${this._planTier === plan.id ? 'selected' : ''}" @click=${() => { this._planTier = plan.id; }}>
            <div class="rp-radio ${this._planTier === plan.id ? 'selected' : ''}"></div>
            <div class="rp-body">
              <div class="rp-name">${plan.name}</div>
              <div class="rp-desc">${plan.desc}</div>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      <div class="page">
        <div class="two-col">
          <div class="panel">
            <div class="panel-title">${this._t('exchangeApiConfiguration')}</div>
            <div class="field-group">
              <div class="field">
                <span class="field-label">${this._t('exchange')}</span>
                <select class="field-select" .value=${this._exchange} @change=${(event) => { this._exchange = event.target.value; }}>
                  <option value="bybit">Bybit</option>
                  <option value="binance">Binance</option>
                  <option value="okx">OKX</option>
                  <option value="pionex">Pionex</option>
                </select>
              </div>
              <div class="field">
                <span class="field-label">${this._t('apiKey')}</span>
                <input class="field-input" type="password" placeholder="••••••••••••••••" .value=${this._apiKey} @input=${(event) => { this._apiKey = event.target.value; }} />
                <span class="field-hint">${this._t('apiKeyHint')}</span>
              </div>
              <div class="field">
                <span class="field-label">${this._t('apiSecret')}</span>
                <input class="field-input" type="password" placeholder="••••••••••••••••" .value=${this._apiSecret} @input=${(event) => { this._apiSecret = event.target.value; }} />
              </div>
              <div class="status-note">
                ${this._apiStored
                  ? html`${this._t('credentialsStored')} <code>${this._apiKeyMasked || 'stored'}</code>. ${this._t('credentialsReplace')}`
                  : html`${this._t('noCredentialsStored')}`}
              </div>
            </div>
          </div>

          <div class="panel">
            <div class="panel-title">${this._t('preferences')}</div>
            <div class="field-group">
              <div class="field">
                <span class="field-label">${this._t('language')}</span>
                <select class="field-select" .value=${this._language} @change=${(event) => {
                  this._language = event.target.value;
                  applyLocalePreferences({ language: this._language, timezone: this._timezone });
                }}>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div class="field">
                <span class="field-label">${this._t('timezone')}</span>
                <select class="field-select" .value=${this._timezone} @change=${(event) => {
                  this._timezone = event.target.value;
                  applyLocalePreferences({ language: this._language, timezone: this._timezone });
                }}>
                  ${this._timezoneOptions.map((timezone) => html`<option value=${timezone}>${timezone}</option>`)}
                </select>
                <span class="field-hint">${this._t('detectedTimezone')}: <code>${getBrowserTimezone()}</code></span>
                <div class="field-actions">
                  <button class="btn btn-ghost btn-sm" @click=${() => this._detectTimezone()}>${this._t('detectTimezone')}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="two-col">
          <div class="panel">
            <div class="panel-title">${this._t('planTier')}</div>
            ${this._renderPlanTier()}
          </div>

          <div class="panel">
            <div class="panel-title">${this._t('riskProfile')}</div>
            ${this._renderRiskProfile()}
            <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--color-border-subtle)">
              <div class="panel-title" style="margin-bottom:var(--space-3)">${this._t('riskLimits')}</div>
              <div class="limits-grid">
                <div class="field">
                  <span class="field-label">${this._t('maxCapitalDeployed')}</span>
                  <input class="field-input" type="number" min="50" max="100" step="5" .value=${this._maxCapPct} @input=${(event) => { this._maxCapPct = Number(event.target.value); }} />
                </div>
                <div class="field">
                  <span class="field-label">${this._t('maxLeverage')}</span>
                  <input class="field-input" type="number" min="1" max="50" step="1" .value=${this._maxLeverage} @input=${(event) => { this._maxLeverage = Number(event.target.value); }} />
                </div>
                <div class="field">
                  <span class="field-label">${this._t('refreshIntervalSeconds')}</span>
                  <input class="field-input" type="number" min="5" max="3600" step="5" .value=${this._refreshInterval} @input=${(event) => { this._refreshInterval = Number(event.target.value); }} />
                </div>
                <div class="field">
                  <span class="field-label">${this._t('fixedIncomeAnnualPct')}</span>
                  <input class="field-input" type="number" min="0" max="100" step="0.01" .value=${this._fixedIncomeAnnualPct} @input=${(event) => { this._fixedIncomeAnnualPct = Number(event.target.value); }} />
                  <span class="field-hint">${this._t('fixedIncomeAnnualPctHint')}</span>
                </div>
              </div>
            </div>
            <div class="save-bar">
              ${this._error ? html`<span class="error-box">${this._error}</span>` : ''}
              ${this._validationMessage ? html`<span class="success-box">${this._validationMessage}</span>` : ''}
              ${this._saved ? html`<span class="saved-msg">✓ ${this._t('saved')}</span>` : ''}
              <button class="btn btn-primary" ?disabled=${this._loading} @click=${() => this._save()}>
                ${this._loading ? this._t('saving') : this._t('saveSettings')}
              </button>
            </div>
          </div>

          <div class="panel">
            <div class="panel-title">${this._t('dataManagement')}</div>
            <div class="data-actions">
              <div class="data-action">
                <div>
                  <div class="da-label">${this._t('exportDashboardState')}</div>
                  <div class="da-sub">${this._t('exportDashboardSub')}</div>
                </div>
                <button class="btn btn-ghost" @click=${() => exportDashboard()}>${this._t('exportJson')}</button>
              </div>
              <div class="data-action">
                <div>
                  <div class="da-label">${this._t('importDashboardState')}</div>
                  <div class="da-sub">${this._t('importDashboardSub')}</div>
                </div>
                <button class="btn btn-ghost" @click=${() => this._import()}>${this._t('importJson')}</button>
              </div>
              <div class="data-action">
                <div>
                  <div class="da-label">${this._t('clearLocalStorage')}</div>
                  <div class="da-sub">${this._t('clearLocalStorageSub')}</div>
                </div>
                <button class="btn btn-danger btn-sm" @click=${() => {
                  localStorage.clear();
                  window.toast?.(this._t('clearLocalStorage'), { type: 'warning' });
                }}>
                  ${this._t('clearAll')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="panel" style="border-color:var(--color-border-subtle)">
          <div class="panel-title">${this._t('about')}</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-4)">
            <div><div class="field-label">${this._t('version')}</div><div style="font-family:var(--font-mono);font-size:var(--text-sm);margin-top:2px">1.0.0-alpha</div></div>
            <div><div class="field-label">${this._t('architecture')}</div><div style="font-size:var(--text-sm);color:var(--color-text-muted);margin-top:2px">Vite + Lit Web Components</div></div>
            <div><div class="field-label">${this._t('apiBase')}</div><div style="font-family:var(--font-mono);font-size:var(--text-sm);margin-top:2px">/api/v1</div></div>
            <div><div class="field-label">${this._t('dataMode')}</div><div style="font-size:var(--text-sm);color:var(--color-positive);margin-top:2px">${this._t('settingsPersistenceActive')}</div></div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('settings-view', SettingsView);
