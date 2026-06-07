const LANG_KEY = 'capintel_lang';
const TIMEZONE_KEY = 'capintel_timezone';
const DEFAULT_LANGUAGE = 'es';
const DEFAULT_TIMEZONE = 'America/Bogota';

const LOCALE_BY_LANGUAGE = {
  es: 'es-CO',
  en: 'en-US',
};

const DICT = {
  es: {
    product: 'Capa de control Pionex',
    signIn: 'Inicia sesión',
    signUp: 'Crea tu espacio de trabajo',
    forgot: 'Recupera tu cuenta',
    reset: 'Restablece tu contraseña',
    email: 'Correo',
    password: 'Contraseña',
    newPassword: 'Nueva contraseña',
    fullName: 'Nombre completo',
    workspaceName: 'Nombre del espacio',
    signInSubtitle: 'Accede a tu espacio de trabajo para abrir el dashboard nuevo y continuar la migración por pestañas.',
    signUpSubtitle: 'Este flujo crea el espacio principal, el usuario inicial y la llave interna con la que el frontend nuevo consume el backend.',
    forgotSubtitle: 'Ingresa tu correo y prepararemos el flujo de recuperación.',
    resetSubtitle: 'Define una nueva contraseña para volver a entrar.',
    signInButton: 'Entrar al dashboard',
    signingIn: 'Ingresando...',
    createWorkspace: 'Crear espacio',
    creatingWorkspace: 'Creando espacio...',
    sendRecovery: 'Enviar recuperación',
    sendingRecovery: 'Preparando recuperación...',
    updatePassword: 'Actualizar contraseña',
    updatingPassword: 'Actualizando...',
    noAccount: '¿Aún no tienes una cuenta?',
    createAccount: 'Crear cuenta',
    alreadyHave: '¿Ya tienes una cuenta?',
    signInLink: 'Inicia sesión',
    forgotPassword: 'Olvidé mi contraseña',
    backToSignIn: 'Volver al inicio de sesión',
    localRecovery: 'En entorno local se muestra el enlace directo para probar la recuperación sin correo.',
    workspaceIsolation: 'Aislamiento por espacio',
    authEntry: 'Entrada de acceso',
    migrationPath: 'Ruta de migración',
    cockpit: 'Centro operativo',
    shellOverview: 'Resumen',
    shellCapital: 'Capital',
    shellMiners: 'Mineros Activos',
    shellOpportunities: 'Oportunidades',
    shellScalping: 'Scalping Lab',
    shellBtcCore: 'BTC Core',
    shellBtcLadder: 'BTC Ladder',
    shellDiscovery: 'Discovery',
    shellSettings: 'Configuración',
    shellDashboard: 'Dashboard',
    shellOperations: 'Operación',
    shellBitcoin: 'Bitcoin',
    shellResearch: 'Research',
    shellSystem: 'Sistema',
    totalCapital: 'Capital total',
    freeUsdt: 'USDT libre',
    openPnl: 'PnL abierto',
    monthlyPnl: 'PnL mensual',
    refresh: 'Actualizar',
    signOut: 'Salir',
    workspace: 'Espacio',
    language: 'Idioma',
    timezone: 'Zona horaria',
    detectTimezone: 'Detectar zona horaria',
    detectedTimezone: 'Zona detectada del navegador',
    preferences: 'Preferencias',
    exchangeApiConfiguration: 'Configuración de API del exchange',
    exchange: 'Exchange',
    apiKey: 'API Key',
    apiSecret: 'API Secret',
    apiKeyHint: 'Se requieren permisos de lectura y trading. El permiso de retiro no es necesario y debe permanecer desactivado.',
    credentialsStored: 'Las credenciales están guardadas en backend para este espacio. Llave detectada:',
    credentialsReplace: 'Si llenas estos campos y guardas, se reemplazan.',
    noCredentialsStored: 'Todavía no hay credenciales persistidas en backend para este espacio.',
    riskProfile: 'Perfil de riesgo',
    planTier: 'Plan',
    freePlan: 'Free',
    proPlan: 'Pro',
    premiumPlan: 'Premium',
    riskLimits: 'Límites de riesgo',
    conservative: 'Conservador',
    moderate: 'Moderado',
    aggressive: 'Agresivo',
    conservativeDesc: 'Máximo 60% desplegado, máximo 5x de apalancamiento, solo estrategias de bajo riesgo.',
    moderateDesc: 'Máximo 85% desplegado, máximo 10x de apalancamiento, todas las estrategias permitidas.',
    aggressiveDesc: 'Máximo 95% desplegado, máximo 20x de apalancamiento, conjunto completo de estrategias.',
    maxCapitalDeployed: 'Capital máximo desplegado (%)',
    maxLeverage: 'Apalancamiento máximo',
    refreshIntervalSeconds: 'Intervalo de actualización (s)',
    fixedIncomeAnnualPct: 'Tasa anual de renta fija (%)',
    fixedIncomeAnnualPctHint: 'Si no la cambias, usa 3.48% como referencia base del Treasury a 1 año de EE. UU.',
    saveSettings: 'Guardar configuración',
    saving: 'Guardando...',
    saved: 'Guardado',
    dataManagement: 'Gestión de datos',
    exportDashboardState: 'Exportar estado del dashboard',
    exportDashboardSub: 'Descarga configuraciones locales, preferencias y filtros en JSON.',
    importDashboardState: 'Importar estado del dashboard',
    importDashboardSub: 'Restaura un respaldo JSON exportado previamente.',
    clearLocalStorage: 'Limpiar almacenamiento local',
    clearLocalStorageSub: 'Elimina preferencias locales del dashboard y restablece los valores por defecto.',
    exportJson: 'Exportar JSON',
    importJson: 'Importar JSON',
    clearAll: 'Limpiar todo',
    about: 'Acerca de',
    version: 'Versión',
    architecture: 'Arquitectura',
    apiBase: 'Base API',
    dataMode: 'Modo de datos',
    settingsPersistenceActive: 'La persistencia backend por espacio para auth y settings ya está activa.',
    settingsSavedToast: 'Configuración guardada',
    apiValidated: 'Las credenciales de Pionex fueron validadas correctamente.',
    pageOverviewSubtitle: 'Inteligencia de capital en un solo vistazo',
    pageCapitalSubtitle: 'Desglose de asignación e historial',
    pageMinersSubtitle: 'Posiciones grid perpetuas por minero',
    pageOpportunitiesSubtitle: 'Análisis de candidatos y simulación',
    pageScalpingSubtitle: 'Escaneo de señales y ejecución',
    pageBtcCoreSubtitle: 'Estrategia de acumulación de Bitcoin',
    pageBtcLadderSubtitle: 'Gestión de órdenes escalonadas DCA',
    pageDiscoverySubtitle: 'Escaneo de universo e incorporación de símbolos',
    pageSettingsSubtitle: 'API, riesgo y preferencias persistentes',
    connected: 'Conectado',
    disconnected: 'Desconectado',
    genericTryAgain: 'Error interno del servidor. Intenta de nuevo.',
    settingsLoadError: 'No se pudo cargar la configuración del espacio.',
    settingsSaveError: 'No se pudo guardar la configuración del espacio.',
    importFailed: 'La importación falló',
  },
  en: {
    product: 'Pionex Control Layer',
    signIn: 'Sign in',
    signUp: 'Create your workspace',
    forgot: 'Recover your account',
    reset: 'Reset your password',
    email: 'Email',
    password: 'Password',
    newPassword: 'New password',
    fullName: 'Full name',
    workspaceName: 'Workspace name',
    signInSubtitle: 'Access your workspace to open the new dashboard and continue the tab-by-tab migration.',
    signUpSubtitle: 'This flow creates the main workspace, the initial user, and the internal key used by the new frontend.',
    forgotSubtitle: 'Enter your email and we will prepare the recovery flow.',
    resetSubtitle: 'Set a new password to sign in again.',
    signInButton: 'Enter dashboard',
    signingIn: 'Signing in...',
    createWorkspace: 'Create workspace',
    creatingWorkspace: 'Creating workspace...',
    sendRecovery: 'Send recovery',
    sendingRecovery: 'Preparing recovery...',
    updatePassword: 'Update password',
    updatingPassword: 'Updating...',
    noAccount: "Don't have an account yet?",
    createAccount: 'Create account',
    alreadyHave: 'Already have an account?',
    signInLink: 'Sign in',
    forgotPassword: 'Forgot password?',
    backToSignIn: 'Back to sign in',
    localRecovery: 'In local mode the app shows the direct recovery link so you can test without email.',
    workspaceIsolation: 'Workspace isolation',
    authEntry: 'Auth entry',
    migrationPath: 'Migration path',
    cockpit: 'Trading cockpit',
    shellOverview: 'Overview',
    shellCapital: 'Capital',
    shellMiners: 'Active Miners',
    shellOpportunities: 'Opportunities',
    shellScalping: 'Scalping Lab',
    shellBtcCore: 'BTC Core',
    shellBtcLadder: 'BTC Ladder',
    shellDiscovery: 'Discovery',
    shellSettings: 'Settings',
    shellDashboard: 'Dashboard',
    shellOperations: 'Operations',
    shellBitcoin: 'Bitcoin',
    shellResearch: 'Research',
    shellSystem: 'System',
    totalCapital: 'Total capital',
    freeUsdt: 'Free USDT',
    openPnl: 'Open PnL',
    monthlyPnl: 'Monthly PnL',
    refresh: 'Refresh',
    signOut: 'Sign out',
    workspace: 'Workspace',
    language: 'Language',
    timezone: 'Timezone',
    detectTimezone: 'Detect timezone',
    detectedTimezone: 'Detected from browser',
    preferences: 'Preferences',
    exchangeApiConfiguration: 'Exchange API configuration',
    exchange: 'Exchange',
    apiKey: 'API key',
    apiSecret: 'API secret',
    apiKeyHint: 'Read and trade permissions are required. Withdraw permission is not needed and should remain disabled.',
    credentialsStored: 'Credentials are stored in the backend for this workspace. Detected key:',
    credentialsReplace: 'If you fill these fields and save, they will be replaced.',
    noCredentialsStored: 'There are no persisted backend credentials for this workspace yet.',
    riskProfile: 'Risk profile',
    planTier: 'Plan',
    freePlan: 'Free',
    proPlan: 'Pro',
    premiumPlan: 'Premium',
    riskLimits: 'Risk limits',
    conservative: 'Conservative',
    moderate: 'Moderate',
    aggressive: 'Aggressive',
    conservativeDesc: 'Max 60% deployed, max 5x leverage, only low-risk strategies.',
    moderateDesc: 'Max 85% deployed, max 10x leverage, all strategies allowed.',
    aggressiveDesc: 'Max 95% deployed, max 20x leverage, full strategy set.',
    maxCapitalDeployed: 'Max capital deployed (%)',
    maxLeverage: 'Max leverage',
    refreshIntervalSeconds: 'Refresh interval (s)',
    fixedIncomeAnnualPct: 'Fixed income annual rate (%)',
    fixedIncomeAnnualPctHint: 'If unchanged, it uses 3.48% as the base reference from the U.S. 1-year Treasury yield.',
    saveSettings: 'Save settings',
    saving: 'Saving...',
    saved: 'Saved',
    dataManagement: 'Data management',
    exportDashboardState: 'Export dashboard state',
    exportDashboardSub: 'Download local settings, preferences, and filters as JSON.',
    importDashboardState: 'Import dashboard state',
    importDashboardSub: 'Restore from a previously exported JSON backup.',
    clearLocalStorage: 'Clear local storage',
    clearLocalStorageSub: 'Remove local dashboard preferences and reset defaults.',
    exportJson: 'Export JSON',
    importJson: 'Import JSON',
    clearAll: 'Clear all',
    about: 'About',
    version: 'Version',
    architecture: 'Architecture',
    apiBase: 'API base',
    dataMode: 'Data mode',
    settingsPersistenceActive: 'Workspace-aware backend persistence for auth and settings is now active.',
    settingsSavedToast: 'Settings saved',
    apiValidated: 'Pionex credentials were validated successfully.',
    pageOverviewSubtitle: 'Capital intelligence at a glance',
    pageCapitalSubtitle: 'Allocation breakdown and history',
    pageMinersSubtitle: 'Perpetual futures grid positions',
    pageOpportunitiesSubtitle: 'Candidate analysis and simulation',
    pageScalpingSubtitle: 'Signal scan and execution',
    pageBtcCoreSubtitle: 'Bitcoin accumulation strategy',
    pageBtcLadderSubtitle: 'DCA ladder order management',
    pageDiscoverySubtitle: 'Universe scan and symbol intake',
    pageSettingsSubtitle: 'API, risk, and persistent preferences',
    connected: 'Connected',
    disconnected: 'Disconnected',
    genericTryAgain: 'Internal server error. Please try again.',
    settingsLoadError: 'Failed to load workspace settings.',
    settingsSaveError: 'Failed to save workspace settings.',
    importFailed: 'Import failed',
  },
};

function normalizeLanguage(language) {
  return language === 'en' ? 'en' : 'es';
}

function notifyPreferencesChange() {
  window.dispatchEvent(new CustomEvent('capintel-locale-changed'));
  window.dispatchEvent(new CustomEvent('capintel-lang-changed'));
}

export function getBrowserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
}

export function getLanguage() {
  return normalizeLanguage(window.localStorage.getItem(LANG_KEY) || DEFAULT_LANGUAGE);
}

export function getTimezone() {
  return window.localStorage.getItem(TIMEZONE_KEY) || getBrowserTimezone() || DEFAULT_TIMEZONE;
}

export function getLocale(language = getLanguage()) {
  return LOCALE_BY_LANGUAGE[normalizeLanguage(language)] || LOCALE_BY_LANGUAGE.es;
}

export function setLanguage(language) {
  window.localStorage.setItem(LANG_KEY, normalizeLanguage(language));
  notifyPreferencesChange();
}

export function setTimezone(timezone) {
  const next = String(timezone || '').trim() || getBrowserTimezone() || DEFAULT_TIMEZONE;
  window.localStorage.setItem(TIMEZONE_KEY, next);
  notifyPreferencesChange();
}

export function applyLocalePreferences({ language, timezone } = {}) {
  if (language) {
    window.localStorage.setItem(LANG_KEY, normalizeLanguage(language));
  }
  if (timezone) {
    window.localStorage.setItem(TIMEZONE_KEY, String(timezone).trim() || DEFAULT_TIMEZONE);
  }
  notifyPreferencesChange();
}

export function i18n(key, language = getLanguage()) {
  const lang = normalizeLanguage(language);
  return DICT[lang]?.[key] || DICT.es[key] || key;
}

export function formatNumber(value, options = {}) {
  return new Intl.NumberFormat(getLocale(), {
    maximumFractionDigits: 0,
    ...options,
  }).format(Number(value || 0));
}

export function formatCurrency(value, options = {}) {
  return new Intl.NumberFormat(getLocale(), {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    ...options,
  }).format(Number(value || 0));
}

export function formatDateTime(value, options = {}) {
  return new Intl.DateTimeFormat(getLocale(), {
    timeZone: getTimezone(),
    ...options,
  }).format(new Date(value));
}

export function getTimezoneOptions() {
  const detected = getBrowserTimezone();
  const base = [
    detected,
    'America/Bogota',
    'America/New_York',
    'America/Mexico_City',
    'America/Los_Angeles',
    'Europe/Madrid',
    'UTC',
  ].filter(Boolean);
  return [...new Set(base)];
}

export function formatRelativeMinutesAgo(value) {
  const minutes = Math.max(0, Math.round((Date.now() - Number(value || 0)) / 60000));
  if (getLanguage() === 'en') {
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    return `${hours}h ago`;
  }
  if (minutes < 1) return 'ahora';
  if (minutes < 60) return `hace ${minutes}m`;
  const hours = Math.round(minutes / 60);
  return `hace ${hours}h`;
}
