# Capital Intelligence Dashboard

A modular, production-grade perpetual futures trading cockpit built with **Vite + Lit Web Components + plain JavaScript**.

## Architecture

```
artifacts/trading-dashboard/
├── index.html                  # Single HTML entry point
├── vite.config.ts              # Vite config (port + base path from env)
├── src/
│   ├── main.js                 # Component registration hub
│   ├── app/
│   │   ├── app-shell.js        # Top-level shell with nav + topbar + router outlet
│   │   └── router.js           # Hash-based client-side router
│   ├── styles/
│   │   ├── tokens.css          # All CSS custom properties (design tokens)
│   │   └── global.css          # Base styles, utilities, button/input base
│   ├── components/             # Reusable Lit Web Components
│   │   ├── stat-card.js
│   │   ├── segmented-control.js
│   │   ├── data-table.js
│   │   ├── numeric-input.js
│   │   ├── toast-notification.js
│   │   ├── confirmation-modal.js
│   │   ├── preview-execute-modal.js  # Preview → Confirm → Execute flow
│   │   ├── risk-badge.js
│   │   ├── progress-bar.js
│   │   ├── allocation-chart.js
│   │   └── state-views.js      # loading-view, empty-view, error-view, stale-view
│   ├── domains/                # Business domain modules
│   │   ├── overview/           # Full Overview page (AI advisor, KPIs, allocation)
│   │   ├── capital/            # Capital breakdown and history
│   │   ├── miners/             # Active miners with close/regrid/stabilize flows
│   │   ├── opportunities/      # Candidate analysis and create-miner flow
│   │   ├── scalping/           # Signal scan, live monitors, trade journal
│   │   ├── btc-core/           # BTC accumulation progress + manual buy
│   │   ├── btc-ladder/         # DCA ladder orders with place/cancel flows
│   │   ├── discovery/          # Universe scan and symbol segmentation
│   │   └── settings/           # API config, risk profile, data management
│   ├── services/               # API client layer (one service per domain)
│   │   ├── api-client.js       # Base fetch wrapper + mock call utility
│   │   ├── miners.service.js
│   │   ├── opportunities.service.js
│   │   ├── capital.service.js
│   │   ├── scalping.service.js
│   │   ├── btc-core.service.js
│   │   ├── btc-ladder.service.js
│   │   └── discovery.service.js
│   ├── state/
│   │   └── store.js            # Global reactive store with localStorage persistence
│   ├── utils/
│   │   ├── format.js           # Number/date formatting utilities
│   │   ├── persistence.js      # localStorage helpers
│   │   ├── polling.js          # Polling utility for real-time data
│   │   └── export.js           # JSON export/import for dashboard state
│   └── mocks/                  # Mock data fixtures (one per domain)
│       ├── overview.mock.js
│       ├── miners.mock.js
│       ├── opportunities.mock.js
│       ├── capital.mock.js
│       ├── scalping.mock.js
│       ├── btc-core.mock.js
│       ├── btc-ladder.mock.js
│       └── discovery.mock.js
```

## Design Principles

### Web Components with Lit
Every UI element is a self-contained Lit element with encapsulated styles (Shadow DOM). Components communicate via custom events and properties, not via shared global state.

### Domain-first Organization
Code is organized by business domain, not by technical layer. Each domain folder contains its view, sub-components, and domain-specific logic. Shared cross-domain components live in `src/components/`.

### Preview → Confirm → Execute Pattern
All dangerous actions (close position, place orders, cancel orders) use the `<preview-execute-modal>` component which enforces a 3-step flow:
1. **Preview**: Show payload summary + warnings
2. **Confirm**: Require explicit acknowledgment checkbox
3. **Execute**: Send to exchange (or mock), show result

### CSS Design Tokens
All visual decisions live in `src/styles/tokens.css` as CSS custom properties. Never use hard-coded values — always reference tokens. This enables future theming.

## Extension Strategy

### Adding a New Domain Module
1. Create `src/domains/<name>/` folder
2. Add a `<name>-view.js` Lit element
3. Create `src/mocks/<name>.mock.js` with realistic data
4. Create `src/services/<name>.service.js` pointing to `/api/v1/<name>`
5. Register the component in `src/main.js`
6. Add the route to `src/app/router.js` (ROUTES + NAV_ITEMS)
7. Add the tag to the router map in `app-shell.js`

### Adding a New Shared Component
1. Create `src/components/<name>.js` as a Lit element
2. Import and register in `src/main.js`
3. Use it anywhere via its tag name

## Backend Integration

All services in `src/services/` are pre-wired to `/api/v1` routes:

```javascript
// Current (mock):
async getMiners() {
  return mockCall(minersMock.miners);
}

// Future (real backend):
async getMiners() {
  return apiFetch('/miners');
}
```

The `apiFetch()` function in `src/services/api-client.js` handles:
- Base URL: `/api/v1`
- JSON headers
- Error parsing via `ApiError`

### Polling
Use `src/utils/polling.js` to set up real-time data refresh:

```javascript
import { Poller } from '../utils/polling.js';
const poller = new Poller(() => this._loadData(), { interval: 30_000 });
```

The Poller handles start/stop, stale detection, and error recovery.

### Authentication
When auth is added, extend `api-client.js`:
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
  ...options.headers,
};
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm --filter @workspace/trading-dashboard run dev

# Build for production
pnpm --filter @workspace/trading-dashboard run build
```

## Stack
- **Vite** — bundler + dev server
- **Lit 3** — Web Components with reactive properties
- **Plain JavaScript** — no TypeScript in src/
- **CSS Custom Properties** — design token system
- **Hash Router** — client-side routing without a server
