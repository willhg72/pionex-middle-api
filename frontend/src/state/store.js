/**
 * Global application state store.
 * Lightweight reactive store — no external dependencies.
 * Persists user preferences and audit log to localStorage.
 */

import { persistence } from '../utils/persistence.js';

const STORAGE_KEY  = 'capintel_state';
const AUDIT_KEY    = 'capintel_audit';
const MAX_AUDIT    = 200; // keep last N entries

const initialState = {
  // Global KPIs start at zero until a live tab refresh provides real metrics
  totalCapital:   0,
  freeUsdt:       0,
  openPnl:        0,
  monthlyPnl:     0,
  riskScore:      0,
  monthlyGoal:    10_000,
  monthlyGoalProgress: 52.1,

  // Capital allocation
  capitalMiners:  38_000,
  capitalScalp:   8_500,
  capitalBtcCore: 15_600,
  capitalLadder:  13_050,
  capitalIdle:    12_300,

  // Badge counts
  activeMinersCount: 0,
  minerWarnings:    0,
  newOpportunities: 3,

  // User preferences (persisted)
  theme: 'dark',
  refreshInterval: 30,

  // Last update timestamp
  lastUpdated: Date.now(),
};

class Store {
  constructor() {
    const saved = persistence.load(STORAGE_KEY);
    const savedPrefs = saved?.prefs || {};
    this._state = { ...initialState, ...savedPrefs };
    this._listeners = [];

    // Load audit log from localStorage
    const savedAudit = persistence.load(AUDIT_KEY);
    this._auditEvents = savedAudit?.events || [];
  }

  // ---- State ----

  getState() {
    return { ...this._state };
  }

  setState(partial) {
    this._state = { ...this._state, ...partial, lastUpdated: Date.now() };
    this._persist();
    this._notify();
  }

  subscribe(cb) {
    this._listeners.push(cb);
    return () => { this._listeners = this._listeners.filter(l => l !== cb); };
  }

  refresh() {
    const variation = () => (Math.random() - 0.5) * 200;
    this.setState({
      openPnl:  parseFloat((this._state.openPnl  + variation()).toFixed(2)),
      freeUsdt: parseFloat((this._state.freeUsdt + variation() * 0.1).toFixed(2)),
    });
  }

  // ---- Audit Trail ----

  /**
   * Record a completed dangerous action to the local audit log.
   * @param {object} entry
   * @param {string} entry.action      — e.g. 'Close Miner', 'Create Miner', 'Buy BTC'
   * @param {string} entry.domain      — e.g. 'miners', 'btc-core'
   * @param {object} entry.payload     — the action parameters shown in preview step
   * @param {object} entry.result      — { success, message }
   * @param {string} [entry.triggeredBy] — optional UI context label
   */
  addAuditEvent({ action, domain, payload = {}, result = {}, triggeredBy = 'user' }) {
    const event = {
      id:           `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp:    new Date().toISOString(),
      action,
      domain,
      triggeredBy,
      payload,
      result,
    };
    this._auditEvents = [event, ...this._auditEvents].slice(0, MAX_AUDIT);
    this._persistAudit();
    return event;
  }

  getAuditEvents({ domain, limit = 50 } = {}) {
    let events = this._auditEvents;
    if (domain) events = events.filter(e => e.domain === domain);
    return events.slice(0, limit);
  }

  clearAudit() {
    this._auditEvents = [];
    this._persistAudit();
  }

  // ---- Internal ----

  _persist() {
    persistence.save(STORAGE_KEY, {
      prefs: {
        theme: this._state.theme,
        refreshInterval: this._state.refreshInterval,
      },
    });
  }

  _persistAudit() {
    persistence.save(AUDIT_KEY, { events: this._auditEvents });
  }

  _notify() {
    this._listeners.forEach(cb => cb(this.getState()));
  }
}

export const store = new Store();
