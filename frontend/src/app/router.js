export const ROUTES = {
  'sign-in': 'sign-in',
  'sign-up': 'sign-up',
  'forgot-password': 'forgot-password',
  'reset-password': 'reset-password',
  overview: 'overview',
  capital: 'capital',
  miners: 'miners',
  opportunities: 'opportunities',
  scalping: 'scalping',
  'btc-core': 'btc-core',
  'btc-ladder': 'btc-ladder',
  discovery: 'discovery',
  settings: 'settings',
};

export const NAV_ITEMS = [
  { id: 'overview', label: { es: 'Resumen', en: 'Overview' }, icon: '◈', group: 'main' },
  { id: 'capital', label: { es: 'Capital', en: 'Capital' }, icon: '◐', group: 'main' },
  { id: 'miners', label: { es: 'Mineros Activos', en: 'Active Miners' }, icon: '⬡', group: 'operations' },
  { id: 'opportunities', label: { es: 'Oportunidades', en: 'Opportunities' }, icon: '◆', group: 'operations' },
  { id: 'scalping', label: { es: 'Scalping Lab', en: 'Scalping Lab' }, icon: '⚡', group: 'operations' },
  { id: 'btc-core', label: { es: 'BTC Core', en: 'BTC Core' }, icon: '₿', group: 'btc' },
  { id: 'btc-ladder', label: { es: 'BTC Ladder', en: 'BTC Ladder' }, icon: '≡', group: 'btc' },
  { id: 'discovery', label: { es: 'Discovery', en: 'Discovery' }, icon: '◎', group: 'research' },
  { id: 'settings', label: { es: 'Configuración', en: 'Settings' }, icon: '⚙', group: 'system' },
];

export class Router {
  constructor() {
    this._listeners = [];
    this._current = this._parseRoute();
    window.addEventListener('hashchange', () => this._onHashChange());
  }

  _parseRoute() {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    const routeKey = hash.split('?')[0];
    return routeKey && ROUTES[routeKey] ? routeKey : 'sign-in';
  }

  _onHashChange() {
    const next = this._parseRoute();
    if (next !== this._current) {
      this._current = next;
      this._notify();
    }
  }

  get current() {
    return this._current;
  }

  navigate(route, query = '') {
    window.location.hash = `/${route}${query ? `?${query}` : ''}`;
  }

  onChange(cb) {
    this._listeners.push(cb);
    return () => {
      this._listeners = this._listeners.filter((listener) => listener !== cb);
    };
  }

  _notify() {
    this._listeners.forEach((cb) => cb(this._current));
  }
}

export const router = new Router();
