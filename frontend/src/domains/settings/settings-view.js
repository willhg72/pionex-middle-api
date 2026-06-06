import { LitElement, html, css } from 'lit';
import { exportDashboard, importDashboard } from '../../utils/export.js';
import { persistence } from '../../utils/persistence.js';
import { buttonStyles } from '../../styles/shared-styles.js';
import { settingsService } from '../../services/settings.service.js';

class SettingsView extends LitElement {
  static properties = {
    _apiKey:      { type: String, state: true },
    _apiSecret:   { type: String, state: true },
    _apiKeyMasked:{ type: String, state: true },
    _apiStored:   { type: Boolean, state: true },
    _riskProfile: { type: String, state: true },
    _maxCapPct:   { type: Number, state: true },
    _maxLeverage: { type: Number, state: true },
    _exchange:    { type: String, state: true },
    _refreshInterval: { type: Number, state: true },
    _loading:     { type: Boolean, state: true },
    _saved:       { type: Boolean, state: true },
    _error:       { type: String, state: true },
    _validationMessage: { type: String, state: true },
  };

  static styles = [buttonStyles, css`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-5); }

    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }

    .panel {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
    }
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
    .field-input {
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
    .field-input:hover {
      border-color: var(--color-border-strong);
    }
    .field-input:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(91,141,239,0.18);
    }
    select.field-input {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23636b8a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
      cursor: pointer;
    }
    input[type=number].field-input {
      font-family: var(--font-mono);
      font-size: var(--text-base);
      font-weight: var(--weight-semibold);
    }
    input[type=number].field-input::-webkit-inner-spin-button,
    input[type=number].field-input::-webkit-outer-spin-button { opacity: 0.4; }
    .field-hint { font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.5; }

    .risk-profiles {
      display: flex; flex-direction: column; gap: var(--space-2);
    }
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
      content: ''; width: 7px; height: 7px;
      border-radius: 50%; background: var(--color-accent);
    }
    .rp-body { flex: 1; }
    .rp-name { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .rp-desc { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }

    .limits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }

    .data-actions { display: flex; flex-direction: column; gap: var(--space-3); }
    .data-action {
      display: flex; align-items: center; justify-content: space-between;
      padding: var(--space-3); background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
    }
    .da-label { font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .da-sub { font-size: var(--text-xs); color: var(--color-text-muted); }

    .save-bar {
      display: flex; align-items: center; justify-content: flex-end; gap: var(--space-3);
      padding-top: var(--space-4); border-top: 1px solid var(--color-border-subtle); margin-top: var(--space-2);
    }
    .saved-msg { font-size: var(--text-xs); color: var(--color-positive); }
    .status-note {
      padding: 10px 12px;
      border-radius: var(--radius-md);
      background: var(--color-bg-elevated);
      color: var(--color-text-muted);
      font-size: var(--text-xs);
      line-height: 1.5;
      border: 1px solid var(--color-border-subtle);
    }
    .error-box {
      padding: 10px 12px;
      border-radius: var(--radius-md);
      background: rgba(240,74,94,0.12);
      color: var(--color-negative);
      font-size: var(--text-xs);
      border: 1px solid rgba(240,74,94,0.22);
    }
    .success-box {
      padding: 10px 12px;
      border-radius: var(--radius-md);
      background: rgba(34,211,160,0.12);
      color: var(--color-positive);
      font-size: var(--text-xs);
      border: 1px solid rgba(34,211,160,0.22);
    }
  `];

  constructor() {
    super();
    const saved = persistence.load('capintel_settings') || {};
    this._apiKey = saved.exchangeApiKey || '';
    this._apiSecret = saved.exchangeApiSecret || saved.apiSecret || '';
    this._apiKeyMasked = saved.exchangeApiKeyMasked || '';
    this._apiStored = Boolean(saved.hasExchangeApiKey);
    this._riskProfile = saved.riskProfile || 'moderate';
    this._maxCapPct = saved.maxCapPct || 90;
    this._maxLeverage = saved.maxLeverage || 10;
    this._exchange = saved.exchange || 'pionex';
    this._refreshInterval = saved.refreshInterval || 30;
    this._loading = false;
    this._saved = false;
    this._error = '';
    this._validationMessage = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  async _load() {
    this._loading = true;
    this._error = '';
    try {
      const saved = await settingsService.getSettings();
      this._riskProfile = saved.riskProfile;
      this._maxCapPct = saved.maxCapPct;
      this._maxLeverage = saved.maxLeverage;
      this._exchange = saved.exchange;
      this._refreshInterval = saved.refreshInterval;
      this._apiStored = saved.hasExchangeApiKey;
      this._apiKeyMasked = saved.exchangeApiKeyMasked || '';
    } catch (error) {
      this._error = error?.data?.detail || error.message || 'Failed to load tenant settings.';
    } finally {
      this._loading = false;
    }
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
        maxCapPct: this._maxCapPct,
        maxLeverage: this._maxLeverage,
        refreshInterval: this._refreshInterval,
        theme: 'dark',
      };
      if (payload.exchangeApiKey || payload.exchangeApiSecret) {
        const validation = await settingsService.validateApiKey(payload);
        if (!validation.valid) {
          throw new Error(validation.reason || 'Pionex credentials could not be validated.');
        }
        this._validationMessage = 'Pionex credentials validated successfully.';
      }
      const saved = await settingsService.saveSettings(payload);
      persistence.save('capintel_settings', {
        ...(persistence.load('capintel_settings') || {}),
        exchangeApiKey: this._apiKey.trim(),
        exchangeApiSecret: this._apiSecret.trim(),
      });
      this._apiStored = saved.hasExchangeApiKey;
      this._apiKeyMasked = saved.exchangeApiKeyMasked || '';
      this._apiKey = '';
      this._apiSecret = '';
      this._saved = true;
      setTimeout(() => this._saved = false, 3000);
      window.toast?.('Tenant settings saved', { type: 'success' });
    } catch (error) {
      this._error = error?.data?.detail || error.message || 'Failed to save tenant settings.';
      window.toast?.(this._error, { type: 'error' });
    } finally {
      this._loading = false;
    }
  }

  async _import() {
    try {
      await importDashboard();
      window.toast?.('Dashboard state imported', { type: 'success' });
    } catch (e) {
      window.toast?.('Import failed: ' + e.message, { type: 'error' });
    }
  }

  _renderRiskProfile() {
    const profiles = [
      { id: 'conservative', name: 'Conservative', desc: 'Max 60% deployed, max 5x leverage, only low-risk strategies' },
      { id: 'moderate',     name: 'Moderate',     desc: 'Max 85% deployed, max 10x leverage, all strategies allowed' },
      { id: 'aggressive',   name: 'Aggressive',   desc: 'Max 95% deployed, max 20x leverage, full strategy set' },
    ];
    return html`
      <div class="risk-profiles">
        ${profiles.map(p => html`
          <div class="risk-profile-opt ${this._riskProfile === p.id ? 'selected' : ''}" @click=${() => this._riskProfile = p.id}>
            <div class="rp-radio ${this._riskProfile === p.id ? 'selected' : ''}"></div>
            <div class="rp-body">
              <div class="rp-name">${p.name}</div>
              <div class="rp-desc">${p.desc}</div>
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
          <!-- API Configuration -->
          <div class="panel">
            <div class="panel-title">Exchange API Configuration</div>
            <div class="field-group">
              <div class="field">
                <span class="field-label">Exchange</span>
                <select class="field-input" .value=${this._exchange} @change=${e => this._exchange = e.target.value}>
                  <option value="bybit">Bybit</option>
                  <option value="binance">Binance</option>
                  <option value="okx">OKX</option>
                  <option value="pionex">Pionex</option>
                </select>
              </div>
              <div class="field">
                <span class="field-label">API Key</span>
                <input class="field-input" type="password" placeholder="••••••••••••••••" .value=${this._apiKey} @input=${e => this._apiKey = e.target.value} />
                <span class="field-hint">Read + Trade permissions required. Withdraw permission is NOT needed and should be disabled.</span>
              </div>
              <div class="field">
                <span class="field-label">API Secret</span>
                <input class="field-input" type="password" placeholder="••••••••••••••••" .value=${this._apiSecret} @input=${e => this._apiSecret = e.target.value} />
              </div>
              <div class="status-note">
                ${this._apiStored
                  ? html`Credenciales guardadas en backend para este tenant. Llave detectada: <code>${this._apiKeyMasked || 'stored'}</code>. Si llenas estos campos y guardas, se reemplazan.`
                  : html`Todavia no hay credenciales persistidas en backend para este tenant.`}
              </div>
            </div>
          </div>

          <!-- Risk Profile -->
          <div class="panel">
            <div class="panel-title">Risk Profile</div>
            ${this._renderRiskProfile()}

            <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--color-border-subtle)">
              <div class="panel-title" style="margin-bottom:var(--space-3)">Risk Limits</div>
              <div class="limits-grid">
                <div class="field">
                  <span class="field-label">Max Capital Deployed (%)</span>
                  <input class="field-input" type="number" min="50" max="100" step="5" .value=${this._maxCapPct} @input=${e => this._maxCapPct = +e.target.value} />
                </div>
                <div class="field">
                  <span class="field-label">Max Leverage</span>
                  <input class="field-input" type="number" min="1" max="50" step="1" .value=${this._maxLeverage} @input=${e => this._maxLeverage = +e.target.value} />
                </div>
                <div class="field">
                  <span class="field-label">Refresh Interval (s)</span>
                  <input class="field-input" type="number" min="5" max="3600" step="5" .value=${this._refreshInterval} @input=${e => this._refreshInterval = +e.target.value} />
                </div>
              </div>
            </div>

            <div class="save-bar">
              ${this._error ? html`<span class="error-box">${this._error}</span>` : ''}
              ${this._validationMessage ? html`<span class="success-box">${this._validationMessage}</span>` : ''}
              ${this._saved ? html`<span class="saved-msg">✓ Saved</span>` : ''}
              <button class="btn btn-primary" ?disabled=${this._loading} @click=${this._save}>${this._loading ? 'Saving...' : 'Save Settings'}</button>
            </div>
          </div>
        </div>

        <!-- Data Management -->
        <div class="panel">
          <div class="panel-title">Data Management</div>
          <div class="data-actions">
            <div class="data-action">
              <div>
                <div class="da-label">Export Dashboard State</div>
                <div class="da-sub">Download all local settings, preferences, and filters as JSON.</div>
              </div>
              <button class="btn btn-ghost" @click=${exportDashboard}>↓ Export JSON</button>
            </div>
            <div class="data-action">
              <div>
                <div class="da-label">Import Dashboard State</div>
                <div class="da-sub">Restore from a previously exported JSON backup.</div>
              </div>
              <button class="btn btn-ghost" @click=${() => this._import()}>↑ Import JSON</button>
            </div>
            <div class="data-action">
              <div>
                <div class="da-label">Clear Local Storage</div>
                <div class="da-sub">Remove all local dashboard preferences and reset to defaults.</div>
              </div>
              <button class="btn btn-danger btn-sm" @click=${() => { localStorage.clear(); window.toast?.('Local storage cleared', { type: 'warning' }); }}>
                Clear All
              </button>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="panel" style="border-color:var(--color-border-subtle)">
          <div class="panel-title">About</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-4)">
            <div><div class="field-label">Version</div><div style="font-family:var(--font-mono);font-size:var(--text-sm);margin-top:2px">1.0.0-alpha</div></div>
            <div><div class="field-label">Architecture</div><div style="font-size:var(--text-sm);color:var(--color-text-muted);margin-top:2px">Vite + Lit Web Components</div></div>
            <div><div class="field-label">API Base</div><div style="font-family:var(--font-mono);font-size:var(--text-sm);margin-top:2px">/api/v1</div></div>
            <div><div class="field-label">Data Mode</div><div style="font-size:var(--text-sm);color:var(--color-positive);margin-top:2px">Tenant-aware backend persistence for auth and settings is now active</div></div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('settings-view', SettingsView);
