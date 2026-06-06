import { LitElement, html, css } from 'lit';
import { router, NAV_ITEMS } from './router.js';
import { store } from '../state/store.js';
import { fetchCurrentSession, signOut } from '../services/auth.service.js';
import { getAuthSession, isSessionActive, saveAuthSession } from '../services/auth-store.js';
import { getLanguage, i18n, setLanguage } from '../services/i18n.js';

class AppShell extends LitElement {
  static properties = {
    _route: { type: String, state: true },
    _time: { type: String, state: true },
    _connected: { type: Boolean, state: true },
    _navOpen: { type: Boolean, state: true },
    _session: { type: Object, state: true },
    _lang: { type: String, state: true },
  };

  static styles = css`
    :host { display:flex; flex-direction:column; height:100vh; width:100vw; overflow:hidden; background:var(--color-bg-base); color:var(--color-text-primary); font-family:var(--font-sans); }
    .topbar { height:var(--topbar-height); min-height:var(--topbar-height); background:var(--color-bg-panel); border-bottom:1px solid var(--color-border-subtle); display:flex; align-items:center; padding:0 var(--space-5); gap:var(--space-6); z-index:50; }
    .topbar-brand { display:flex; align-items:center; gap:var(--space-2); width:var(--nav-width); }
    .brand-icon { width:22px; height:22px; background:var(--color-accent); border-radius:5px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#fff; flex-shrink:0; }
    .brand-name { font-size:var(--text-sm); font-weight:var(--weight-semibold); letter-spacing:var(--tracking-tight); }
    .brand-sub { font-size:var(--text-xs); color:var(--color-text-muted); letter-spacing:var(--tracking-wider); text-transform:uppercase; }
    .topbar-metrics { display:flex; align-items:center; gap:var(--space-6); flex:1; }
    .topbar-metric { display:flex; align-items:baseline; gap:var(--space-2); }
    .topbar-metric-label { font-size:var(--text-xs); color:var(--color-text-muted); letter-spacing:var(--tracking-wide); text-transform:uppercase; }
    .topbar-metric-value { font-family:var(--font-mono); font-size:var(--text-sm); font-weight:var(--weight-semibold); letter-spacing:var(--tracking-tight); }
    .metric-positive { color:var(--color-positive); }
    .metric-negative { color:var(--color-negative); }
    .metric-neutral { color:var(--color-text-primary); }
    .topbar-right { display:flex; align-items:center; gap:var(--space-4); margin-left:auto; }
    .connection-dot { width:7px; height:7px; border-radius:50%; background:var(--color-positive); box-shadow:0 0 6px var(--color-positive); animation:pulse 2s ease-in-out infinite; }
    .connection-dot.disconnected { background:var(--color-negative); box-shadow:0 0 6px var(--color-negative); animation:none; }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
    .topbar-clock { font-family:var(--font-mono); font-size:var(--text-xs); color:var(--color-text-muted); letter-spacing:var(--tracking-wide); }
    .risk-badge-topbar { display:flex; align-items:center; gap:var(--space-1); padding:3px 8px; border-radius:var(--radius-sm); font-size:var(--text-xs); font-weight:var(--weight-semibold); letter-spacing:var(--tracking-wide); text-transform:uppercase; }
    .risk-low { background:var(--color-positive-dim); color:var(--color-positive); }
    .risk-medium { background:var(--color-warning-dim); color:var(--color-warning); }
    .risk-high { background:var(--color-negative-dim); color:var(--color-negative); }
    .shell-body { display:flex; flex:1; overflow:hidden; }
    .sidenav { width:var(--nav-width); min-width:var(--nav-width); background:var(--color-bg-panel); border-right:1px solid var(--color-border-subtle); display:flex; flex-direction:column; overflow-y:auto; padding:var(--space-4) 0; }
    .nav-group { margin-bottom:var(--space-2); }
    .nav-group-label { font-size:10px; font-weight:var(--weight-semibold); letter-spacing:0.12em; text-transform:uppercase; color:var(--color-text-muted); padding:var(--space-3) var(--space-4) var(--space-1); }
    .nav-item { display:flex; align-items:center; gap:var(--space-3); padding:var(--space-2) var(--space-4); cursor:pointer; color:var(--color-text-secondary); font-size:var(--text-sm); font-weight:var(--weight-medium); position:relative; }
    .nav-item:hover { background:var(--color-bg-hover); color:var(--color-text-primary); }
    .nav-item.active { background:var(--color-accent-dim); color:var(--color-accent); }
    .nav-item.active::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:var(--color-accent); }
    .nav-icon { width:20px; display:flex; align-items:center; justify-content:center; font-size:14px; opacity:0.7; }
    .nav-badge { margin-left:auto; background:var(--color-negative); color:#fff; font-size:10px; font-weight:var(--weight-bold); padding:1px 5px; border-radius:var(--radius-full); line-height:1.4; }
    .nav-badge-warn { background:var(--color-warning-dim); color:var(--color-warning); }
    .content { flex:1; overflow:hidden; display:flex; flex-direction:column; background:var(--color-bg-base); }
    .page-header { display:flex; align-items:center; justify-content:space-between; padding:var(--space-4) var(--content-padding); border-bottom:1px solid var(--color-border-subtle); background:var(--color-bg-panel); min-height:56px; }
    .page-title { font-size:var(--text-lg); font-weight:var(--weight-semibold); letter-spacing:var(--tracking-tight); }
    .page-subtitle { font-size:var(--text-sm); color:var(--color-text-muted); margin-top:2px; }
    .page-actions { display:flex; align-items:center; gap:var(--space-3); }
    .refresh-btn { display:inline-flex; align-items:center; gap:var(--space-2); padding:var(--space-1) var(--space-3); background:transparent; border:1px solid var(--color-border-default); border-radius:var(--radius-md); color:var(--color-text-secondary); font-size:var(--text-xs); cursor:pointer; }
    .refresh-btn:hover { background:var(--color-bg-hover); color:var(--color-text-primary); }
    .view-outlet { flex:1; overflow-y:auto; overflow-x:hidden; }
    .hamburger { display:none; background:none; border:1px solid var(--color-border-default); border-radius:var(--radius-md); color:var(--color-text-secondary); cursor:pointer; width:32px; height:32px; align-items:center; justify-content:center; font-size:16px; }
    .nav-backdrop { display:none; position:fixed; inset:0; top:var(--topbar-height); background:rgba(0,0,0,0.5); z-index:49; }
    .nav-backdrop.visible { display:block; }
    @media (max-width:1024px) { .topbar-metric:nth-child(n+3) { display:none; } }
    @media (max-width:768px) {
      .hamburger { display:flex; }
      .topbar-brand { width:auto; }
      .brand-sub, .topbar-metrics, .topbar-clock { display:none !important; }
      .topbar { padding:0 var(--space-3); gap:var(--space-3); }
      .sidenav { position:fixed; top:var(--topbar-height); left:0; bottom:0; z-index:50; transform:translateX(-100%); transition:transform 0.22s cubic-bezier(0.4,0,0.2,1); box-shadow:4px 0 32px rgba(0,0,0,0.5); }
      .sidenav.open { transform:translateX(0); }
      .page-header { padding:var(--space-3); min-height:48px; }
      .page-title { font-size:var(--text-md); }
    }
  `;

  constructor() {
    super();
    this._route = router.current;
    this._time = this._formatTime();
    this._connected = true;
    this._data = store.getState();
    this._session = getAuthSession();
    this._lang = getLanguage();
  }

  connectedCallback() {
    super.connectedCallback();
    this._routerOff = router.onChange((route) => {
      this._route = route;
      this._enforceRouteGuard();
    });
    this._clockInterval = setInterval(() => {
      this._time = this._formatTime();
    }, 1000);
    this._storeOff = store.subscribe((state) => {
      this._data = state;
      this.requestUpdate();
    });
    this._authChanged = () => {
      this._session = getAuthSession();
      this._enforceRouteGuard();
      this.requestUpdate();
    };
    this._langChanged = () => {
      this._lang = getLanguage();
      this.requestUpdate();
    };
    window.addEventListener('capintel-auth-changed', this._authChanged);
    window.addEventListener('capintel-lang-changed', this._langChanged);
    this._bootstrapSession();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._routerOff?.();
    this._storeOff?.();
    window.removeEventListener('capintel-auth-changed', this._authChanged);
    window.removeEventListener('capintel-lang-changed', this._langChanged);
    clearInterval(this._clockInterval);
  }

  async _bootstrapSession() {
    if (!isSessionActive(this._session)) {
      this._session = null;
      this._enforceRouteGuard();
      return;
    }
    try {
      const next = await fetchCurrentSession();
      saveAuthSession({
        ...this._session,
        expiresAt: next.expiresAt,
        tenantApiKey: next.tenantApiKey,
        user: next.user,
        tenant: next.tenant,
      });
      this._session = getAuthSession();
    } catch {
      signOut();
      this._session = null;
    }
    this._enforceRouteGuard();
    this.requestUpdate();
  }

  _isAuthRoute(route = this._route) {
    return ['sign-in', 'sign-up', 'forgot-password', 'reset-password'].includes(route);
  }

  _enforceRouteGuard() {
    const authenticated = isSessionActive(this._session);
    if (!authenticated && !this._isAuthRoute()) {
      router.navigate('sign-in');
      return;
    }
    if (authenticated && this._isAuthRoute()) {
      router.navigate('overview');
    }
  }

  _formatTime() {
    return `${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC`;
  }

  _navigate(route) {
    router.navigate(route);
    this._navOpen = false;
  }

  _getPageMeta() {
    const pages = {
      overview: { title: i18n('shellOverview', this._lang), subtitle: 'Capital intelligence at a glance' },
      capital: { title: i18n('shellCapital', this._lang), subtitle: 'Allocation breakdown and history' },
      miners: { title: i18n('shellMiners', this._lang), subtitle: 'Perpetual futures grid positions' },
      opportunities: { title: i18n('shellOpportunities', this._lang), subtitle: 'Candidate analysis and simulation' },
      scalping: { title: i18n('shellScalping', this._lang), subtitle: 'Signal scan and execution' },
      'btc-core': { title: i18n('shellBtcCore', this._lang), subtitle: 'Bitcoin accumulation strategy' },
      'btc-ladder': { title: i18n('shellBtcLadder', this._lang), subtitle: 'DCA ladder order management' },
      discovery: { title: i18n('shellDiscovery', this._lang), subtitle: 'Universe scan and symbol intake' },
      settings: { title: i18n('shellSettings', this._lang), subtitle: 'API configuration, risk profile, preferences' },
    };
    return pages[this._route] || pages.overview;
  }

  _getNavBadge(id) {
    const state = this._data;
    if (id === 'miners' && state.minerWarnings > 0) return { count: state.minerWarnings, type: 'danger' };
    if (id === 'opportunities' && state.newOpportunities > 0) return { count: state.newOpportunities, type: 'warn' };
    return null;
  }

  _getRiskClass() {
    const score = this._data.riskScore;
    if (score < 35) return 'risk-low';
    if (score < 65) return 'risk-medium';
    return 'risk-high';
  }

  _getRiskLabel() {
    const score = this._data.riskScore;
    if (score < 35) return `LOW ${score}`;
    if (score < 65) return `MED ${score}`;
    return `HIGH ${score}`;
  }

  _renderNavGroups() {
    const groups = {
      main: i18n('shellDashboard', this._lang),
      operations: i18n('shellOperations', this._lang),
      btc: i18n('shellBitcoin', this._lang),
      research: i18n('shellResearch', this._lang),
      system: i18n('shellSystem', this._lang),
    };

    const byGroup = {};
    NAV_ITEMS.forEach((item) => {
      if (!byGroup[item.group]) byGroup[item.group] = [];
      byGroup[item.group].push(item);
    });

    return Object.entries(byGroup).map(([group, items]) => html`
      <div class="nav-group">
        <div class="nav-group-label">${groups[group]}</div>
        ${items.map((item) => {
          const badge = this._getNavBadge(item.id);
          return html`
            <div class="nav-item ${this._route === item.id ? 'active' : ''}" @click=${() => this._navigate(item.id)}>
              <span class="nav-icon">${item.icon}</span>
              <span>${item.label[this._lang] || item.label.en}</span>
              ${badge ? html`<span class="nav-badge ${badge.type === 'warn' ? 'nav-badge-warn' : ''}">${badge.count}</span>` : ''}
            </div>
          `;
        })}
      </div>
    `);
  }

  _renderView() {
    const views = {
      'sign-in': html`<sign-in-view></sign-in-view>`,
      'sign-up': html`<sign-up-view></sign-up-view>`,
      'forgot-password': html`<forgot-password-view></forgot-password-view>`,
      'reset-password': html`<reset-password-view></reset-password-view>`,
      overview: html`<overview-view></overview-view>`,
      capital: html`<capital-view></capital-view>`,
      miners: html`<miners-view></miners-view>`,
      opportunities: html`<opportunities-view></opportunities-view>`,
      scalping: html`<scalping-view></scalping-view>`,
      'btc-core': html`<btc-core-view></btc-core-view>`,
      'btc-ladder': html`<btc-ladder-view></btc-ladder-view>`,
      discovery: html`<discovery-view></discovery-view>`,
      settings: html`<settings-view></settings-view>`,
    };
    return views[this._route] || views.overview;
  }

  render() {
    const state = this._data;
    const meta = this._getPageMeta();
    const pnlClass = state.openPnl >= 0 ? 'metric-positive' : 'metric-negative';
    const pnlSign = state.openPnl >= 0 ? '+' : '';
    const authenticated = isSessionActive(this._session);

    if (!authenticated) {
      return html`${this._renderView()}`;
    }

    return html`
      <div class="nav-backdrop ${this._navOpen ? 'visible' : ''}" @click=${() => this._navOpen = false}></div>
      <div class="topbar">
        <button class="hamburger" @click=${() => this._navOpen = !this._navOpen} aria-label="Menu">☰</button>
        <div class="topbar-brand">
          <div class="brand-icon">CI</div>
          <div>
            <div class="brand-name">CapIntel</div>
            <div class="brand-sub">${i18n('cockpit', this._lang)}</div>
          </div>
        </div>
        <div class="topbar-metrics">
          <div class="topbar-metric">
            <span class="topbar-metric-label">${i18n('totalCapital', this._lang)}</span>
            <span class="topbar-metric-value metric-neutral">$${state.totalCapital.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </div>
          <div class="topbar-metric">
            <span class="topbar-metric-label">${i18n('freeUsdt', this._lang)}</span>
            <span class="topbar-metric-value metric-neutral">$${state.freeUsdt.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
          </div>
          <div class="topbar-metric">
            <span class="topbar-metric-label">${i18n('openPnl', this._lang)}</span>
            <span class="topbar-metric-value ${pnlClass}">${pnlSign}$${Math.abs(state.openPnl).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
          </div>
          <div class="topbar-metric">
            <span class="topbar-metric-label">${i18n('monthlyPnl', this._lang)}</span>
            <span class="topbar-metric-value ${state.monthlyPnl >= 0 ? 'metric-positive' : 'metric-negative'}">${state.monthlyPnl >= 0 ? '+' : ''}$${Math.abs(state.monthlyPnl).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
          </div>
        </div>
        <div class="topbar-right">
          <button class="refresh-btn" @click=${() => setLanguage(this._lang === 'es' ? 'en' : 'es')}>${this._lang.toUpperCase()}</button>
          <div class="topbar-clock">${this._session?.tenant?.name || i18n('workspace', this._lang)}</div>
          <div class="risk-badge-topbar ${this._getRiskClass()}">RISK ${this._getRiskLabel()}</div>
          <div class="topbar-clock">${this._time}</div>
          <div class="connection-dot ${this._connected ? '' : 'disconnected'}" title="${this._connected ? 'Connected' : 'Disconnected'}"></div>
          <button class="refresh-btn" @click=${() => { signOut(); this._session = null; router.navigate('sign-in'); }}>
            ${i18n('signOut', this._lang)}
          </button>
        </div>
      </div>
      <div class="shell-body">
        <nav class="sidenav ${this._navOpen ? 'open' : ''}">
          ${this._renderNavGroups()}
        </nav>
        <main class="content">
          <div class="page-header">
            <div>
              <div class="page-title">${meta.title}</div>
              <div class="page-subtitle">${meta.subtitle}</div>
            </div>
            <div class="page-actions">
              <button class="refresh-btn" @click=${() => store.refresh()}>↻ ${i18n('refresh', this._lang)}</button>
            </div>
          </div>
          <div class="view-outlet">${this._renderView()}</div>
        </main>
      </div>
    `;
  }
}

customElements.define('app-shell', AppShell);
