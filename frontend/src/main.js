import './styles/tokens.css';
import './styles/global.css';

// Register all web components
import './app/app-shell.js';
import './components/stat-card.js';
import './components/segmented-control.js';
import './components/data-table.js';
import './components/numeric-input.js';
import './components/toast-notification.js';
import './components/confirmation-modal.js';
import './components/preview-execute-modal.js';
import './components/risk-badge.js';
import './components/state-views.js';
import './components/progress-bar.js';
import './components/allocation-chart.js';

// Domain views — loaded lazily on first navigation via app-shell._ensureRouteViewLoaded()
// (removed static imports to keep the initial bundle light)
