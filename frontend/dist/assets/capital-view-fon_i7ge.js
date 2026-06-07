import{i as T,b as S,a as B,g as R,n as P,e as n,l as o,o as F,w as x}from"./index-BdK4FrM0.js";const b=["#5b8def","#f5a623","#22d3a0","#a855f7","#2a2d3e"],z={free:{autoMs:6e4,manual:!1,maxManual:0,windowMs:3e4},pro:{autoMs:3e4,manual:!1,maxManual:0,windowMs:3e4},premium:{autoMs:3e4,manual:!0,maxManual:3,windowMs:3e4}};class D extends T{static properties={_data:{type:Object,state:!0},_loading:{type:Boolean,state:!0},_refreshing:{type:Boolean,state:!0},_error:{type:String,state:!0},_range:{type:String,state:!0},_monthlyScale:{type:String,state:!0},_capitalHoverIndex:{type:Number,state:!0},_monthlyHoverIndex:{type:Number,state:!0},_lang:{type:String,state:!0},_planTier:{type:String,state:!0},_nextAutoRefreshAt:{type:Number,state:!0}};static styles=[S,B`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); flex-wrap: wrap; }
    .toolbar-note { font-size: var(--text-xs); color: var(--color-text-muted); }
    .toolbar-status { font-size: var(--text-xs); color: var(--color-accent); }
    .kpi-strip { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: var(--space-3); }
    .main-row { display: grid; grid-template-columns: 1fr 340px; gap: var(--space-4); }
    @media (max-width: 1100px) { .main-row { grid-template-columns: 1fr; } }
    .bottom-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
    @media (max-width: 900px) { .bottom-row { grid-template-columns: 1fr; } }
    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel :is(
      .toolbar-note, .toolbar-status, .portfolio-total, .money-amount, .chart-legend-value, .chart-legend-pnl,
      .legend-pct, .legend-val, .rank-num, .rank-label, .rank-pct, .rank-val, .split-val, .snapshot-value,
      .portfolio-coin, .portfolio-value, .portfolio-qty, .portfolio-freeze, .portfolio-pct, .monthly-month,
      .monthly-metric-value, .event-symbol, .mdb-period, .mdb-value, .portfolio-summary-value, .portfolio-summary-sub
    ) {
      font-variant-numeric: tabular-nums slashed-zero;
      font-feature-settings: "tnum" 1, "zero" 1;
    }
    .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4); gap: var(--space-3); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .panel-sub { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }
    .chart-wrap { position: relative; height: 130px; overflow: visible; }
    .chart-wrap svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .chart-tooltip {
      position: absolute;
      top: 8px;
      transform: translateX(-50%);
      min-width: 118px;
      max-width: 150px;
      padding: 8px 10px;
      border-radius: var(--radius-md);
      background: rgba(10, 11, 15, 0.96);
      border: 1px solid var(--color-border-default);
      box-shadow: var(--shadow-lg);
      pointer-events: none;
      z-index: 2;
    }
    .chart-tooltip-date { font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 4px; }
    .chart-tooltip-value { font-family: var(--font-mono); font-size: 12px; font-weight: var(--weight-semibold); color: var(--color-text-primary); }
    .chart-tooltip-pnl { margin-top: 3px; font-size: 10px; color: var(--color-text-secondary); }
    .range-tabs { display: flex; gap: 2px; background: var(--color-bg-elevated); border-radius: 6px; padding: 3px; }
    .range-tab {
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 10.5px;
      font-weight: 500;
      cursor: pointer;
      color: var(--color-text-muted);
      letter-spacing: 0.04em;
      transition: all 120ms ease;
    }
    .range-tab.active { background: var(--color-bg-hover); color: var(--color-text-primary); }
    .donut-section { display: flex; align-items: center; gap: var(--space-5); }
    .donut-wrap { flex-shrink: 0; }
    .donut-legend { flex: 1; display: flex; flex-direction: column; gap: var(--space-2); }
    .legend-row { display: grid; grid-template-columns: 8px 1fr auto auto; align-items: center; gap: var(--space-2); }
    .legend-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
    .legend-label { flex: 1; font-size: var(--text-xs); color: var(--color-text-secondary); }
    .legend-pct { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); min-width: 42px; text-align: right; }
    .legend-val { font-family: var(--font-mono); font-size: 11px; font-weight: var(--weight-medium); min-width: 58px; text-align: right; }
    .ranked-list { display: flex; flex-direction: column; gap: 0; }
    .ranked-row { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border-subtle); }
    .ranked-row:last-child { border-bottom: none; }
    .rank-num { font-size: var(--text-xs); color: var(--color-text-disabled); font-family: var(--font-mono); min-width: 14px; text-align: center; }
    .rank-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .rank-label { flex: 1; font-size: var(--text-sm); font-family: var(--font-mono); font-weight: var(--weight-medium); }
    .rank-bar-wrap { flex: 1; max-width: 100px; }
    .rank-bar-bg { height: 3px; background: var(--color-bg-elevated); border-radius: 2px; overflow: hidden; }
    .rank-bar-fill { height: 100%; border-radius: 2px; transition: width 500ms ease; }
    .rank-pct { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); min-width: 36px; text-align: right; }
    .rank-val { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-medium); min-width: 76px; text-align: right; }
    .split-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-4); }
    .split-card { padding: var(--space-3); border-radius: var(--radius-md); text-align: center; }
    .split-card.prod { background: var(--color-positive-dim); border: 1px solid rgba(34,211,160,0.15); }
    .split-card.idle { background: var(--color-idle-dim); border: 1px solid rgba(90,95,117,0.15); }
    .split-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: var(--space-1); }
    .split-val { font-family: var(--font-mono); font-size: var(--text-xl); font-weight: var(--weight-semibold); }
    .split-card.prod .split-val { color: var(--color-positive); }
    .split-card.idle .split-val { color: var(--color-idle); }
    .split-sub { font-size: 10px; color: var(--color-text-muted); margin-top: 2px; }
    .risk-row { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border-subtle); }
    .risk-row:last-child { border-bottom: none; }
    .risk-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .risk-label { flex: 1; font-size: var(--text-sm); }
    .risk-bar-wrap { width: 80px; }
    .snapshot-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-3); }
    @media (max-width: 900px) { .snapshot-grid { grid-template-columns: 1fr; } }
    .snapshot-card { border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); background: var(--color-bg-elevated); padding: var(--space-3); }
    .snapshot-label { color: var(--color-text-muted); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
    .snapshot-value { font-family: var(--font-mono); font-size: var(--text-lg); font-weight: var(--weight-semibold); }
    .snapshot-note { margin-top: 4px; color: var(--color-text-muted); font-size: var(--text-xs); }
    .portfolio-grid { display:grid; grid-template-columns: 320px 1fr; gap: var(--space-4); }
    @media (max-width: 1000px) { .portfolio-grid { grid-template-columns: 1fr; } }
    .portfolio-summary-grid { display:grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin: var(--space-4) 0; }
    .portfolio-summary-card { padding: var(--space-3); border-radius: var(--radius-md); background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle); }
    .portfolio-summary-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 6px; }
    .portfolio-summary-value { font-family: var(--font-mono); font-size: var(--text-lg); font-weight: var(--weight-semibold); }
    .portfolio-summary-sub { margin-top: 4px; color: var(--color-text-muted); font-size: var(--text-xs); }
    .portfolio-table { display:flex; flex-direction:column; gap:0; }
    .portfolio-head, .portfolio-row {
      display:grid;
      grid-template-columns: 120px 1fr 1fr 1fr 1fr;
      gap: var(--space-3);
      align-items:center;
    }
    .portfolio-head {
      padding: 0 0 10px;
      border-bottom: 1px solid var(--color-border-subtle);
      color: var(--color-text-muted);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .portfolio-row {
      padding: 12px 0;
      border-bottom: 1px solid var(--color-border-subtle);
    }
    .portfolio-coin { display:flex; align-items:center; gap:10px; font-family:var(--font-mono); font-size:var(--text-md); font-weight:var(--weight-semibold); }
    .coin-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
    .portfolio-value, .portfolio-qty, .portfolio-freeze, .portfolio-pct { font-family:var(--font-mono); font-size:var(--text-md); font-weight: var(--weight-medium); }
    .portfolio-pct { display:flex; align-items:center; gap:10px; }
    .portfolio-pct-bar { flex:1; height:6px; border-radius:999px; background:var(--color-bg-elevated); overflow:hidden; }
    .portfolio-pct-fill { height:100%; border-radius:999px; }
    .monthly-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: var(--space-4); }
    @media (max-width: 1000px) { .monthly-grid { grid-template-columns: 1fr; } }
    .monthly-chart-wrap { position: relative; height: 220px; margin-bottom: var(--space-4); }
    .monthly-chart-wrap svg { width: 100%; height: 100%; }
    .monthly-chart-note { display:flex; align-items:center; justify-content:space-between; gap:var(--space-3); margin-top:var(--space-2); color:var(--color-text-muted); font-size:var(--text-xs); }
    .monthly-chart-tooltip {
      position: absolute;
      top: 10px;
      transform: translateX(-50%);
      min-width: 132px;
      max-width: 164px;
      padding: 8px 10px;
      border-radius: var(--radius-md);
      background: rgba(10, 11, 15, 0.96);
      border: 1px solid var(--color-border-default);
      box-shadow: var(--shadow-lg);
      pointer-events: none;
      z-index: 2;
    }
    .monthly-list { display: flex; flex-direction: column; gap: 0; }
    .monthly-row { display: grid; grid-template-columns: 88px 1fr 1fr 1fr; gap: var(--space-3); align-items: center; padding: 10px 0; border-bottom: 1px solid var(--color-border-subtle); }
    .monthly-row:last-child { border-bottom: none; }
    .monthly-month { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-secondary); }
    .monthly-metric-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); margin-bottom: 2px; }
    .monthly-metric-value { font-family: var(--font-mono); font-size: var(--text-md); font-weight: var(--weight-medium); }
    .event-list { display: flex; flex-direction: column; gap: 10px; }
    .event-item { border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); background: var(--color-bg-elevated); padding: 12px; }
    .event-top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); margin-bottom: 6px; }
    .event-symbol { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .event-time { color: var(--color-text-muted); font-size: var(--text-xs); }
    .event-meta { display: flex; flex-wrap: wrap; gap: 10px; color: var(--color-text-secondary); font-size: var(--text-xs); }
    .benchmark-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-3); }
    @media (max-width: 900px) { .benchmark-grid { grid-template-columns: 1fr; } }
    .dca-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: var(--space-3); }
    @media (max-width: 1200px) { .dca-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 700px) { .dca-grid { grid-template-columns: 1fr; } }
    .scale-tabs { display:flex; gap:2px; background:var(--color-bg-elevated); border-radius:6px; padding:3px; }

    /* ── Portfolio hero (non-trader view) ── */
    .portfolio-hero {
      background: linear-gradient(140deg, rgba(91,141,239,.07) 0%, rgba(34,211,160,.04) 100%);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-lg); padding: 20px 24px; margin-bottom: 4px;
    }
    .portfolio-eyebrow { font-size: var(--text-xs); font-weight: var(--weight-semibold); letter-spacing: .12em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 4px; }
    .portfolio-total { font-family: var(--font-mono); font-size: var(--text-4xl); font-weight: var(--weight-bold); letter-spacing: -.03em; line-height: 1.1; }
    .portfolio-meta { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 4px; }
    .portfolio-pills { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: var(--space-3); }
    .pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: var(--radius-full); font-size: var(--text-sm); font-weight: var(--weight-semibold); font-family: var(--font-mono); }
    .pill-pos { background: var(--color-positive-dim); color: var(--color-positive); }
    .pill-neg { background: var(--color-negative-dim); color: var(--color-negative); }
    .pill-acc { background: var(--color-accent-dim);   color: var(--color-accent); }

    /* ── Money map ── */
    .money-map { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-1); }
    .money-row {
      display: flex; align-items: center; gap: var(--space-3);
      padding: 10px 14px; border-radius: var(--radius-md);
      background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle);
      cursor: pointer; transition: border-color var(--transition-fast), background var(--transition-fast);
    }
    .money-row:hover { border-color: var(--color-border-strong); background: var(--color-bg-hover); }
    .money-icon { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
    .money-label-wrap { flex: 1; min-width: 0; }
    .money-name  { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .money-desc  { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 1px; }
    .money-right { margin-left: auto; text-align: right; flex-shrink: 0; }
    .money-amount{ font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .money-pct   { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 1px; }

    /* ── Chart legend — lives in panel-header, never overlaps the chart ── */
    .chart-legend {
      display: flex; flex-direction: column; align-items: flex-end; gap: 2px;
      min-width: 130px; opacity: 0; transition: opacity 150ms ease;
    }
    .chart-legend.active { opacity: 1; }
    .chart-legend-hint  { font-size: var(--text-xs); color: var(--color-text-disabled); }
    .chart-legend-date  { font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--color-text-muted); }
    .chart-legend-value { font-family: var(--font-mono); font-size: var(--text-lg); font-weight: var(--weight-semibold); letter-spacing: -.02em; }
    .chart-legend-pnl   { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-medium); }
    .chart-legend-pnl.pos { color: var(--color-positive); }
    .chart-legend-pnl.neg { color: var(--color-negative); }

    /* ── Monthly data bar (replaces floating tooltip on bar chart) ── */
    .monthly-data-bar {
      display: flex; align-items: center; gap: var(--space-5); flex-wrap: wrap;
      padding: var(--space-2) 0 var(--space-3);
      border-bottom: 1px solid var(--color-border-subtle); margin-bottom: var(--space-3);
    }
    .mdb-period { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-semibold); min-width: 60px; }
    .mdb-group  { display: flex; flex-direction: column; gap: 1px; }
    .mdb-label  { font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--color-text-muted); }
    .mdb-value  { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .mdb-value.pos { color: var(--color-positive); }
    .mdb-value.neg { color: var(--color-negative); }

    /* ── KPI delta flash animations ── */
    @keyframes kpiFlashPos {
      0%, 8%  { box-shadow: 0 0 0 2px rgba(34,211,160,.45), 0 0 14px rgba(34,211,160,.12); }
      100%    { box-shadow: none; }
    }
    @keyframes kpiFlashNeg {
      0%, 8%  { box-shadow: 0 0 0 2px rgba(240,74,94,.45), 0 0 14px rgba(240,74,94,.1); }
      100%    { box-shadow: none; }
    }
    .kpi-flash-pos { animation: kpiFlashPos 1.5s ease forwards; border-radius: var(--radius-lg); }
    .kpi-flash-neg { animation: kpiFlashNeg 1.5s ease forwards; border-radius: var(--radius-lg); }
  `];constructor(){super(),this._data={summary:{},buckets:[],byTicker:[],byRisk:[],history:[],monthlyHistory:[],recentCloseEvents:[],accountBreakdown:{},portfolioAssets:[],notes:{}},this._loading=!0,this._refreshing=!1,this._error="",this._range="30d",this._monthlyScale="annual",this._capitalHoverIndex=-1,this._monthlyHoverIndex=-1,this._lang=R(),this._planTier="free",this._nextAutoRefreshAt=0,this._manualRefreshHits=[],this._refreshTimer=null,this._prevSummary=null}connectedCallback(){super.connectedCallback(),this._localeListener=()=>{this._lang=R(),this.requestUpdate()},window.addEventListener("capintel-locale-changed",this._localeListener),this._bootstrap()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-locale-changed",this._localeListener),clearTimeout(this._refreshTimer)}_t(t,e){return this._lang==="en"?e:t}_getRefreshPolicy(){return z[this._planTier]||z.free}_manualRefreshRemaining(){const t=this._getRefreshPolicy(),e=Date.now();return this._manualRefreshHits=this._manualRefreshHits.filter(i=>e-i<t.windowMs),Math.max(0,t.maxManual-this._manualRefreshHits.length)}_scheduleRefresh(){clearTimeout(this._refreshTimer);const t=this._getRefreshPolicy();this._nextAutoRefreshAt=Date.now()+t.autoMs,this._refreshTimer=window.setTimeout(()=>{this._load({auto:!0})},t.autoMs)}async _bootstrap(){try{const t=P.getCachedSettings();this._planTier=t.planTier||"free";const e=await P.getSettings().catch(()=>null);e?.planTier&&(this._planTier=e.planTier)}finally{this._scheduleRefresh(),await this._load()}}_emitShellMetrics(){const t=this._data?.summary||{},e=Array.isArray(this._data?.byRisk)?this._data.byRisk:[],i={"No Risk":5,"Low Risk":20,"Medium Risk":55,"High Risk":85},a=e.reduce((s,r)=>s+Number(r.value||0),0)||0,l=a>0?Math.round(e.reduce((s,r)=>s+(i[r.label]||50)*Number(r.value||0),0)/a):42;this.dispatchEvent(new CustomEvent("capintel-shell-metrics",{bubbles:!0,composed:!0,detail:{route:"capital",metrics:{totalCapital:Number(t.totalCapitalVisible||0),freeUsdt:Number(t.freeUsdt||0),openPnl:Number(t.allMinerGain||0),monthlyPnl:Number(t.monthlyCloseablePnlChange||0),riskScore:l}}}))}updated(t){if(!t.has("_data")||!this._prevSummary)return;const e=this._data?.summary||{},i=this._prevSummary;[["totalCapitalVisible","kpi-total"],["capitalMining","kpi-mining"],["capitalNotMining","kpi-idle"],["allMinerGain","kpi-gain"],["minerCapitalRoiPct","kpi-roi"],["fixedEquivalentMinerCapital","kpi-fixed"],["monthlyCloseablePnlChange","kpi-monthly"],["revenueAccumulated","kpi-revenue"]].forEach(([l,s])=>{if(i[l]===void 0||e[l]===i[l])return;const r=this.renderRoot?.querySelector(`[data-kpi="${s}"]`);if(!r)return;const m=Number(e[l])>Number(i[l]);r.classList.remove("kpi-flash-pos","kpi-flash-neg"),r.offsetWidth,r.classList.add(m?"kpi-flash-pos":"kpi-flash-neg"),setTimeout(()=>r.classList.remove("kpi-flash-pos","kpi-flash-neg"),1600)})}_getBucketIcon(t){return{"Active Miners":"⬡","BTC Core":"₿","BTC Ladder":"≡",Scalping:"⚡","Free USDT":"◎"}[t]||"◆"}_getFriendlyLabel(t){return{"Active Miners":{es:"Mineros activos",en:"Active Miners"},"BTC Core":{es:"Bitcoin Stack",en:"Bitcoin Stack"},"BTC Ladder":{es:"BTC Escalera",en:"BTC Ladder"},Scalping:{es:"Scalping Lab",en:"Scalping Lab"},"Free USDT":{es:"Disponible (USDT)",en:"Available (USDT)"},"Wallet USDT":{es:"Wallet USDT",en:"Wallet USDT"}}[t]?.[this._lang]||t}_getBucketDesc(t){return{"Active Miners":{es:"Capturando spreads en el mercado",en:"Capturing market spreads"},"BTC Core":{es:"Posición de largo plazo en Bitcoin",en:"Long-term Bitcoin position"},"BTC Ladder":{es:"Acumulación gradual, bajo riesgo",en:"Gradual accumulation, low risk"},Scalping:{es:"Estrategia de capturas rápidas",en:"Short-term capture strategy"},"Free USDT":{es:"Listo para desplegar o retirar",en:"Ready to deploy or withdraw"},"Wallet USDT":{es:"Saldo spot total reportado por Pionex",en:"Total spot wallet reported by Pionex"}}[t]?.[this._lang]||""}_renderPortfolioHero(){const t=this._data?.summary||{},e=Array.isArray(this._data?.buckets)?this._data.buckets:[];if(!e.length)return n``;const i=Number(t.totalCapitalVisible||0),a=Number(t.monthlyCloseablePnlChange||0),l=Number(t.freeUsdt||t.capitalNotMining||0),s=e.filter(r=>r.productive);return n`
      <div class="portfolio-hero">
        <div class="portfolio-eyebrow">${this._t("Tu portafolio","Your portfolio")}</div>
        <div class="portfolio-total">${o.usd(i,0)}</div>
        <div class="portfolio-meta">${s.length} ${this._t("estrategias activas","active strategies")}</div>
        <div class="portfolio-pills">
          <span class="pill ${a>=0?"pill-pos":"pill-neg"}">
            ${a>=0?"▲":"▼"} ${o.usd(Math.abs(a),0)} ${this._t("este mes","this month")}
          </span>
          <span class="pill pill-acc">${o.usd(l,0)} ${this._t("disponibles","available")}</span>
        </div>
      </div>
      <div class="money-map">
        ${e.map((r,m)=>n`
          <div class="money-row">
            <div class="money-icon" style="background:${b[m%b.length]}22;color:${b[m%b.length]}">
              ${this._getBucketIcon(r.label)}
            </div>
            <div class="money-label-wrap">
              <div class="money-name">${this._getFriendlyLabel(r.label)}</div>
              <div class="money-desc">${this._getBucketDesc(r.label)}</div>
            </div>
            <div class="money-right">
              <div class="money-amount" style="color:${b[m%b.length]}">${o.usd(Number(r.value||0),0)}</div>
              <div class="money-pct">${Number(r.pct||0).toFixed(1)}%</div>
            </div>
          </div>
        `)}
      </div>
    `}async _load({auto:t=!1,manual:e=!1}={}){const i=!!(this._data?.history&&this._data.history.length||Object.keys(this._data?.summary||{}).length||this._data?.portfolioAssets&&this._data.portfolioAssets.length);if(e){if(!this._getRefreshPolicy().manual)return;if(this._manualRefreshRemaining()<=0){window.toast?.(this._t("Límite manual alcanzado: máximo 3 refresh en 30 segundos.","Manual limit reached: max 3 refreshes in 30 seconds."),{type:"warning"});return}this._manualRefreshHits.push(Date.now())}this._error="",i?this._refreshing=!0:this._loading=!0;try{this._prevSummary={...this._data?.summary||{}},this._data=await F.getDashboard(),this._emitShellMetrics()}catch(a){const l=a?.data?.detail||a?.message||this._t("No se pudo cargar el panel de capital.","Could not load capital dashboard.");i?window.toast?.(l,{type:t?"warning":"error"}):(this._error=l,t||window.toast?.(this._error,{type:"error"}))}finally{this._loading=!1,this._refreshing=!1,this._scheduleRefresh()}}_getHistory(){const t=Array.isArray(this._data?.history)?this._data.history:[],e=t.length,i=Number.parseInt(this._range,10);return!Number.isFinite(i)||i>=e?t:t.slice(e-i)}_getMonthlyRows(){const t=Array.isArray(this._data?.monthlyHistory)?this._data.monthlyHistory:[],e=this._monthlyScale==="quarter"?3:this._monthlyScale==="semester"?6:12;return t.slice(-e)}_formatDateRange(t){return t.length?`${o.date(t[0].isoDate)} - ${o.date(t.at(-1).isoDate)}`:""}_formatShortDate(t){return new Intl.DateTimeFormat(o.locale(),{timeZone:o.timezone(),month:"short",day:"numeric"}).format(new Date(t))}_historySnapshotLabel(t){const e=new Set((t||[]).map(a=>String(a.isoDate||""))),i=Array.from(e).filter(Boolean).length;return i<=1?this._t("1 snapshot guardado","1 saved snapshot"):this._t(`${i} snapshots guardados`,`${i} saved snapshots`)}_setCapitalHover(t){const e=this._getHistory();if(!e.length)return;const i=t.currentTarget.getBoundingClientRect(),a=Math.min(1,Math.max(0,(t.clientX-i.left)/i.width));this._capitalHoverIndex=Math.round(a*(e.length-1))}_setMonthlyHover(t){const e=Array.isArray(this._data?.monthlyHistory)?this._data.monthlyHistory:[];if(!e.length)return;const i=t.currentTarget.getBoundingClientRect(),a=Math.min(1,Math.max(0,(t.clientX-i.left)/i.width));this._monthlyHoverIndex=Math.round(a*(e.length-1))}_renderAreaChart(){const t=this._getHistory();if(!t.length)return n``;const e=600,i=130,a={top:16,right:12,bottom:22,left:4},l=e-a.left-a.right,s=i-a.top-a.bottom,r=t.map(v=>Number(v.total||0)),m=Math.min(...r),f=Math.max(...r),y=Math.abs(f-m)<1e-6,h=y?m*.96:m,u=y?f*1.04||1:f,d=u-h||1,p=t.map((v,$)=>({x:a.left+$/Math.max(1,t.length-1)*l,y:a.top+s-(Number(v.total||0)-h)/d*s,item:v})),c=p.map((v,$)=>{if($===0)return`M ${v.x.toFixed(1)} ${v.y.toFixed(1)}`;const N=p[$-1],A=((N.x+v.x)/2).toFixed(1);return`C ${A} ${N.y.toFixed(1)}, ${A} ${v.y.toFixed(1)}, ${v.x.toFixed(1)} ${v.y.toFixed(1)}`}).join(" "),g=`${c} L ${p.at(-1).x.toFixed(1)} ${i-a.bottom} L ${p[0].x.toFixed(1)} ${i-a.bottom} Z`,_=[h,h+d*.5,u],k=new Set(t.map(v=>String(v.isoDate||""))).size<=1?[t.length-1]:Array.from(new Set([0,Math.floor(t.length/2),t.length-1])),M=this._capitalHoverIndex>=0?Math.min(this._capitalHoverIndex,p.length-1):p.length-1,C=p[M];return n`
      <svg viewBox="0 0 ${e} ${i}" preserveAspectRatio="none" style="overflow:visible">
        <defs>
          <linearGradient id="cap-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#22d3a0" stop-opacity="0.28"></stop>
            <stop offset="60%" stop-color="#22d3a0" stop-opacity="0.06"></stop>
            <stop offset="100%" stop-color="#22d3a0" stop-opacity="0"></stop>
          </linearGradient>
          <filter id="cap-glow" x="-5%" y="-40%" width="110%" height="180%">
            <feGaussianBlur stdDeviation="2" result="b"></feGaussianBlur>
            <feMerge><feMergeNode in="b"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge>
          </filter>
        </defs>
        ${_.map((v,$)=>{const N=(a.top+s-(v-h)/d*s).toFixed(1);return x`
            <line x1="${a.left}" y1="${N}" x2="${e-a.right}" y2="${N}" stroke="#1f2130" stroke-width="1" stroke-dasharray="${$===0?"none":"3 4"}"></line>
            <text x="${e-a.right+5}" y="${(Number(N)+3.5).toFixed(1)}" fill="#42475e" font-size="8.5" font-family="JetBrains Mono, monospace" text-anchor="start">
              ${o.usd(v,0)}
            </text>
          `})}
        ${x`<path d="${g}" fill="url(#cap-area-grad)"></path>`}
        ${x`<path d="${c}" fill="none" stroke="#22d3a0" stroke-width="1.8" filter="url(#cap-glow)" stroke-linejoin="round" stroke-linecap="round"></path>`}
        ${x`<line x1="${C.x.toFixed(1)}" y1="${a.top}" x2="${C.x.toFixed(1)}" y2="${i-a.bottom}" stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-dasharray="4 4"></line>`}
        ${x`<circle cx="${C.x.toFixed(1)}" cy="${C.y.toFixed(1)}" r="4.2" fill="#22d3a0" stroke="#10131c" stroke-width="2"></circle>`}
        ${x`<circle cx="${p.at(-1).x.toFixed(1)}" cy="${p.at(-1).y.toFixed(1)}" r="3" fill="#22d3a0" filter="url(#cap-glow)"></circle>`}
        ${k.map((v,$)=>x`
          <text x="${p[v].x.toFixed(1)}" y="${i}" fill="#42475e" font-size="8.5" font-family="Inter, sans-serif" text-anchor="${$===0?"start":$===k.length-1?"end":"middle"}">
            ${this._formatShortDate(t[v].isoDate)}
          </text>
        `)}
      </svg>
    `}_renderDonut(){const t=Array.isArray(this._data?.buckets)?this._data.buckets:[],e=t.reduce((d,p)=>d+Number(p.value||0),0)||1,i=t.filter(d=>d.productive).reduce((d,p)=>d+Number(p.value||0),0),a=(i/e*100).toFixed(1),l=80,s=80,r=62,m=14,f=.04,y=(d,p)=>{const c=d+f/2,g=p-f/2;if(g-c<.01)return null;const _=l+r*Math.sin(c),w=s-r*Math.cos(c),k=l+r*Math.sin(g),M=s-r*Math.cos(g),C=g-c>Math.PI?1:0;return`M ${_.toFixed(3)} ${w.toFixed(3)} A ${r} ${r} 0 ${C} 1 ${k.toFixed(3)} ${M.toFixed(3)}`};let h=0;const u=t.map((d,p)=>{const c=Number(d.value||0)/e*(2*Math.PI),g={bucket:d,startAngle:h,endAngle:h+c,color:b[p%b.length]};return h+=c,g});return n`
      <div class="donut-section">
        <div class="donut-wrap">
          <svg viewBox="0 0 160 160" width="160" height="160">
            <circle cx="${l}" cy="${s}" r="${r}" fill="none" stroke="#141620" stroke-width="${m}"></circle>
            ${u.map(d=>{const p=y(d.startAngle,d.endAngle);return p?x`<path d="${p}" fill="none" stroke="${d.color}" stroke-width="${m}" stroke-linecap="round"></path>`:""})}
            <text x="${l}" y="${s-8}" text-anchor="middle" fill="#e8eaf2" font-family="JetBrains Mono, monospace" font-size="15" font-weight="700">${a}%</text>
            <text x="${l}" y="${s+7}" text-anchor="middle" fill="#565a6e" font-family="Inter, sans-serif" font-size="9" letter-spacing="0.1em">${this._t("PRODUCTIVO","PRODUCTIVE")}</text>
            <text x="${l}" y="${s+20}" text-anchor="middle" fill="#9195a8" font-family="JetBrains Mono, monospace" font-size="9">${o.usd(i)}</text>
          </svg>
        </div>
        <div class="donut-legend">
          ${t.map((d,p)=>n`
            <div class="legend-row">
              <div class="legend-dot" style="background:${b[p%b.length]}"></div>
              <span class="legend-label">${d.label}</span>
              <span class="legend-pct">${Number(d.pct||0).toFixed(1)}%</span>
              <span class="legend-val">${o.usd(Number(d.value||0))}</span>
            </div>
          `)}
        </div>
      </div>
    `}_renderTickerRanked(){const t=Array.isArray(this._data?.byTicker)?this._data.byTicker:[],e=Math.max(1,...t.map(i=>Number(i.pct||0)));return n`
      <div class="ranked-list">
        ${t.map((i,a)=>n`
          <div class="ranked-row">
            <span class="rank-num">${a+1}</span>
            <div class="rank-dot" style="background:${a===0?"#f5a623":a===1?"#5b8def":"#22d3a0"}"></div>
            <span class="rank-label">${i.ticker}</span>
            <div class="rank-bar-wrap"><div class="rank-bar-bg"><div class="rank-bar-fill" style="width:${(Number(i.pct||0)/e*100).toFixed(1)}%;background:${a===0?"#f5a623":"#5b8def"}"></div></div></div>
            <span class="rank-pct">${Number(i.pct||0).toFixed(1)}%</span>
            <span class="rank-val">${o.usd(Number(i.value||0))}</span>
          </div>
        `)}
      </div>
    `}_renderRisk(){const t={"Low Risk":"#22d3a0","Medium Risk":"#f5a623","High Risk":"#f04a5e","No Risk":"#5a5f75"},e=Array.isArray(this._data?.byRisk)?this._data.byRisk:[],i=Math.max(1,...e.map(a=>Number(a.value||0)));return n`
      ${e.map(a=>n`
        <div class="risk-row">
          <div class="risk-dot" style="background:${t[a.label]||"#5a5f75"}"></div>
          <span class="risk-label">${a.label}</span>
          <div class="risk-bar-wrap"><div class="rank-bar-bg"><div class="rank-bar-fill" style="width:${(Number(a.value||0)/i*100).toFixed(1)}%;background:${t[a.label]||"#5a5f75"}"></div></div></div>
          <span class="rank-pct">${Number(a.pct||0).toFixed(1)}%</span>
          <span class="rank-val">${o.usd(Number(a.value||0))}</span>
        </div>
      `)}
    `}_renderMonthlyHistory(){const t=this._getMonthlyRows();return n`
      <div class="monthly-list">
        ${t.map(e=>n`
          <div class="monthly-row">
            <div class="monthly-month">${e.label||e.month||"—"}</div>
            <div>
              <div class="monthly-metric-label">${this._t("Capital","Capital")}</div>
              <div class="monthly-metric-value">${o.usd(Number(e.totalMoney||0),0)}</div>
            </div>
            <div>
              <div class="monthly-metric-label">${this._t("Revenue acum.","Revenue acc.")}</div>
              <div class="monthly-metric-value">${o.pnl(Number(e.revenueAccumulated||0),2)}</div>
            </div>
            <div>
              <div class="monthly-metric-label">${this._t("Cambio mensual","Monthly change")}</div>
              <div class="monthly-metric-value">${o.pnl(Number(e.monthRevenue||0),2)} · ${o.pct(Number(e.monthRoiPct||0),2)}</div>
            </div>
          </div>
        `)}
      </div>
    `}_renderMonthlyChart(){const t=this._getMonthlyRows();if(!t.length)return"";const e=640,i=220,a={top:20,right:16,bottom:36,left:34},l=e-a.left-a.right,s=i-a.top-a.bottom,r=t.map(c=>Number(c.totalMoney||0)),m=Math.max(1,...r),f=c=>a.top+s-c/m*s,y=c=>a.left+(c+.5)*(l/Math.max(1,t.length)),h=Math.max(28,Math.min(46,l/Math.max(1,t.length*1.85))),u=this._monthlyHoverIndex>=0?Math.min(this._monthlyHoverIndex,t.length-1):t.length-1,d=t[u],p=y(u);return u/Math.max(1,t.length-1)*100,n`
      <div class="monthly-data-bar">
        <div class="mdb-period">${d?.label||d?.month||"—"}</div>
        <div class="mdb-group">
          <span class="mdb-label">${this._t("Capital","Capital")}</span>
          <span class="mdb-value">${o.usd(Number(d?.totalMoney||0),0)}</span>
        </div>
        <div class="mdb-group">
          <span class="mdb-label">${this._t("Rev. acum.","Rev. acc.")}</span>
          <span class="mdb-value ${Number(d?.revenueAccumulated||0)>=0?"pos":"neg"}">${o.pnl(Number(d?.revenueAccumulated||0),2)}</span>
        </div>
        <div class="mdb-group">
          <span class="mdb-label">${this._t("Cambio","Change")}</span>
          <span class="mdb-value ${Number(d?.monthRevenue||0)>=0?"pos":"neg"}">${o.pnl(Number(d?.monthRevenue||0),2)} · ${o.pct(Number(d?.monthRoiPct||0),2)}</span>
        </div>
      </div>
      <div class="monthly-chart-wrap" @mousemove=${this._setMonthlyHover} @mouseleave=${()=>{this._monthlyHoverIndex=-1}}>
        <svg viewBox="0 0 ${e} ${i}" preserveAspectRatio="none">
          ${x`<line x1="${a.left}" y1="${a.top}" x2="${a.left}" y2="${i-a.bottom}" stroke="#2b3044" stroke-width="1.15"></line>`}
          ${x`<line x1="${a.left}" y1="${i-a.bottom}" x2="${e-a.right}" y2="${i-a.bottom}" stroke="#2b3044" stroke-width="1.15"></line>`}
          ${[.25,.5,.75,1].map(c=>x`
            <line x1="${a.left}" y1="${(a.top+s-s*c).toFixed(1)}" x2="${e-a.right}" y2="${(a.top+s-s*c).toFixed(1)}" stroke="#1f2130" stroke-width="1" stroke-dasharray="3 4"></line>
          `)}
          ${[0,.5,1].map(c=>{const g=m*c,_=a.top+s-s*c;return x`
              <text x="${(a.left-8).toFixed(1)}" y="${(_+3).toFixed(1)}" fill="#6d7287" font-size="8.5" font-family="JetBrains Mono, monospace" text-anchor="end">
                ${o.usd(g,0)}
              </text>
            `})}
          ${r.map((c,g)=>{const _=y(g)-h/2,w=f(c),k=Math.max(4,a.top+s-w),M=g===u;return x`
              <rect x="${_.toFixed(1)}" y="${w.toFixed(1)}" width="${h.toFixed(1)}" height="${k.toFixed(1)}" rx="6" fill="${M?"#6f82ff":"rgba(111,130,255,0.82)"}"></rect>
              <text x="${y(g).toFixed(1)}" y="${(w-8).toFixed(1)}" fill="${M?"#e8eaf2":"#9195a8"}" font-size="9" font-family="JetBrains Mono, monospace" text-anchor="middle">
                ${o.usd(c,0)}
              </text>
            `})}
          ${x`<line x1="${p.toFixed(1)}" y1="${a.top}" x2="${p.toFixed(1)}" y2="${i-a.bottom}" stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-dasharray="4 4"></line>`}
          ${t.map((c,g)=>x`
            <text x="${y(g).toFixed(1)}" y="${(i-8).toFixed(1)}" fill="#6d7287" font-size="9" font-family="Inter, sans-serif" text-anchor="middle">${c.label||c.month||g+1}</text>
          `)}
        </svg>
      </div>
      <div class="monthly-chart-note">
        <span>${this._t("Escala mensual del capital total por cierre","Monthly total-capital close scale")}</span>
        <span>${this._t("Monto sobre cada barra","Value on top of each bar")}</span>
      </div>
    `}_renderBenchmarks(){const e=(Array.isArray(this._data?.monthlyHistory)?this._data.monthlyHistory:[]).at(-1)||{},i=Number(e.minersRoiPct||0),a=Number(this._data?.summary?.fixedIncomeMonthlyPct||0),l=Number(e.totalMoney||this._data?.summary?.totalCapitalVisible||0),s=Number(e.revenueAccumulated||this._data?.summary?.revenueAccumulated||0),r=Number(e.fixedEquivalent||this._data?.summary?.fixedEquivalentTotalCapital||0),m=i-a,f=s-r,y=[{label:this._t("Green bar: miners to date","Green bar: miners to date"),value:`${o.pnl(s,2)} · ${o.pct(i,2)}`,note:`${this._t("closeable miner gain sobre","closeable miner gain over")} ${o.usd(l,0)}`},{label:this._t("Fixed income equivalent","Fixed income equivalent"),value:`${o.usd(r,2)} · ${o.pct(a,2)}`,note:`${Number(this._data?.summary?.fixedIncomeAnnualPct||0).toFixed(1)}% APR ${this._t("llevado a tasa mensual","converted to monthly rate")}`},{label:this._t("Miners vs fixed","Miners vs fixed"),value:o.pct(m,2),note:`${f>=0?this._t("adelante por","ahead by"):this._t("atrás por","behind by")} ${o.usd(Math.abs(f),2)}`}];return n`
      <div class="benchmark-grid">
        ${y.map(h=>n`
          <div class="snapshot-card">
            <div class="snapshot-label">${h.label}</div>
            <div class="snapshot-value">${h.value}</div>
            <div class="snapshot-note">${h.note}</div>
          </div>
        `)}
      </div>
    `}_renderBtcDca(){const t=this._data?.btcDca||{},e=[{label:this._t("BTC bought this month","BTC bought this month"),value:o.usd(Number(t.currentUsdt||0),2),note:`${o.number(Number(t.currentBtc||0),8)} BTC · ${Number(t.currentCount||0)} ${this._t("compras","buys")}`},{label:this._t("BTC buy remaining","BTC buy remaining"),value:o.usd(Number(t.remainingUsdt||0),2),note:`${o.usd(Number(t.budget||0),2)} ${this._t("presupuesto mensual","monthly budget")}`},{label:this._t("BTC month average","BTC month average"),value:t.currentAvg?o.usd(Number(t.currentAvg||0),2):"—",note:`${this._t("mes","month")} ${t.currentMonth||"—"}`},{label:this._t("Monthly DCA edge","Monthly DCA edge"),value:t.dcaEdge===null||t.dcaEdge===void 0?"—":o.pct(Number(t.dcaEdge||0),2),note:t.previousAvg?`${this._t("vs promedio previo","vs prior avg")} ${o.usd(Number(t.previousAvg||0),2)}`:this._t("sin promedio previo","no prior average")},{label:this._t("3M DCA edge","3M DCA edge"),value:t.dcaEdge3m===null||t.dcaEdge3m===void 0?"—":o.pct(Number(t.dcaEdge3m||0),2),note:t.previous3Avg?`${this._t("vs 3M avg","vs 3M avg")} ${o.usd(Number(t.previous3Avg||0),2)} · ${Number(t.previous3Count||0)} ${this._t("compras","buys")}`:this._t("sin 3M previos","no previous 3M buys")}];return n`
      <div class="dca-grid">
        ${e.map(i=>n`
          <div class="snapshot-card">
            <div class="snapshot-label">${i.label}</div>
            <div class="snapshot-value">${i.value}</div>
            <div class="snapshot-note">${i.note}</div>
          </div>
        `)}
      </div>
    `}_renderAccountBreakdown(){const t=this._data?.accountBreakdown||{},e=[{label:this._t("Estimated equity","Estimated equity"),value:o.usd(Number(t.estimatedEquity||0),2),note:this._t("wallet + user-funded miner margin","wallet + user-funded miner margin")},{label:this._t("Other assets","Other assets"),value:o.usd(Number(t.otherAssetsValue||0),2),note:this._t("spot assets fuera de USDT/BTC","spot assets outside USDT/BTC")},{label:this._t("BTC Core value","BTC Core value"),value:o.usd(Number(t.btcCoreValue||0),2),note:this._t("ledger BTC o wallet BTC, el mayor","max of BTC ledger and BTC wallet")},{label:this._t("USDT wallet","USDT wallet"),value:o.usd(Number(t.walletUsdtTotal||t.freeUsdt||0),2),note:`${this._t("libre","free")} ${o.usd(Number(t.freeUsdt||0),2)}`},{label:this._t("Miner margin","Miner margin"),value:o.usd(Number(t.minerMargin||0),2),note:this._t("capital propio desplegado en mineros","user-funded capital deployed in miners")},{label:this._t("Promo margin","Promo margin"),value:o.usd(Number(t.promoMargin||0),2),note:this._t("monitorizado pero fuera de capital propio","monitored but excluded from own capital")}];return n`
      <div class="snapshot-grid">
        ${e.map(i=>n`
          <div class="snapshot-card">
            <div class="snapshot-label">${i.label}</div>
            <div class="snapshot-value">${i.value}</div>
            <div class="snapshot-note">${i.note}</div>
          </div>
        `)}
      </div>
    `}_renderPortfolioAssets(){const t=Array.isArray(this._data?.portfolioAssets)?this._data.portfolioAssets:[];if(!t.length)return n`<empty-view label="${this._t("Todavía no hay activos spot visibles en Pionex","No visible spot assets from Pionex yet")}"></empty-view>`;const e=t.slice(0,6),i=t.reduce((s,r)=>s+Number(r.usdValue||0),0)||1,a=t[0],l=e.map((s,r)=>({label:s.coin,value:Number(s.usdValue||0),pct:Number(s.proportionPct||0),color:b[r%b.length]}));return n`
      <div class="portfolio-grid">
        <div class="panel" style="padding:var(--space-4)">
          <div class="panel-title">${this._t("Distribución spot en Pionex","Pionex spot distribution")}</div>
          <div class="panel-sub">${o.usd(Number(this._data?.summary?.reportedBalanceUsd||i),2)} ${this._t("reportados por balance","reported by account balance")}</div>
          <div class="portfolio-summary-grid">
            <div class="portfolio-summary-card">
              <div class="portfolio-summary-label">${this._t("Activos detectados","Detected assets")}</div>
              <div class="portfolio-summary-value">${t.length}</div>
              <div class="portfolio-summary-sub">${this._t("monedas con valor visible en la cuenta","coins with visible value in the account")}</div>
            </div>
            <div class="portfolio-summary-card">
              <div class="portfolio-summary-label">${this._t("Mayor posición","Largest position")}</div>
              <div class="portfolio-summary-value">${a?.coin||"—"}</div>
              <div class="portfolio-summary-sub">${a?`${o.pctPlain(Number(a.proportionPct||0),2)} · ${o.usd(Number(a.usdValue||0),2)}`:"—"}</div>
            </div>
          </div>
          <allocation-chart .items=${l} .height=${22}></allocation-chart>
        </div>
        <div class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">${this._t("Portafolio de monedas","Coin portfolio")}</div>
              <div class="panel-sub">${this._t("monedas reales detectadas en el balance de Pionex","real coins detected from the Pionex balance")}</div>
            </div>
          </div>
          <div class="portfolio-table">
            <div class="portfolio-head">
              <div>${this._t("Coin","Coin")}</div>
              <div>${this._t("Cantidad","Quantity")}</div>
              <div>${this._t("Valor USD","USD value")}</div>
              <div>${this._t("Libre / congelado","Free / frozen")}</div>
              <div>${this._t("Proporción","Proportion")}</div>
            </div>
            ${t.map((s,r)=>n`
              <div class="portfolio-row">
                <div class="portfolio-coin">
                  <span class="coin-dot" style="background:${b[r%b.length]}"></span>
                  <span>${s.coin}</span>
                </div>
                <div class="portfolio-qty">${o.number(Number(s.quantity||0),8)}</div>
                <div class="portfolio-value">${o.usd(Number(s.usdValue||0),2)}</div>
                <div class="portfolio-freeze">${o.number(Number(s.free||0),8)} / ${o.number(Number(s.frozen||0),8)}</div>
                <div class="portfolio-pct">
                  <span>${o.pctPlain(Number(s.proportionPct||0),2)}</span>
                  <span class="portfolio-pct-bar"><span class="portfolio-pct-fill" style="width:${Math.max(0,Math.min(100,Number(s.proportionPct||0)))}%;background:${b[r%b.length]}"></span></span>
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>
    `}_renderRecentEvents(){const t=Array.isArray(this._data?.recentCloseEvents)?this._data.recentCloseEvents:[];return t.length?n`
      <div class="event-list">
        ${t.map(e=>n`
          <div class="event-item">
            <div class="event-top">
              <div class="event-symbol">${e.symbol||e.buOrderId||"Event"}</div>
              <div class="event-time">${e.detectedAt?o.datetime(e.detectedAt):"—"}</div>
            </div>
            <div class="event-meta">
              <span>${this._t("Reason","Reason")}: ${e.closeReason||"—"}</span>
              <span>${this._t("Released","Released")}: ${o.usd(Number(e.releasedUsdtEstimate||0),2)}</span>
              <span>${this._t("PnL","PnL")}: ${o.pnl(Number(e.realizedPnlUsdt||0),2)}</span>
              <span>${this._t("Redeployed","Redeployed")}: ${e.redeployedWithinWindow?this._t("sí","yes"):this._t("no","no")}</span>
            </div>
          </div>
        `)}
      </div>
    `:n`<empty-view label="${this._t("Todavía no hay eventos recientes de capital","No recent capital events yet")}"></empty-view>`}render(){const t=!!(this._data?.history&&this._data.history.length||Object.keys(this._data?.summary||{}).length||this._data?.portfolioAssets&&this._data.portfolioAssets.length);if(this._loading&&!t)return n`<loading-view label="${this._t("Cargando capital","Loading capital")}"></loading-view>`;if(this._error&&!t)return n`<error-view label="${this._t("Capital no disponible","Capital unavailable")}" .sub=${this._error}></error-view>`;const e=this._data?.summary||{},i=this._getHistory(),a=this._capitalHoverIndex>=0?Math.min(this._capitalHoverIndex,i.length-1):i.length-1,l=i[a],s=Number(e.totalCapitalVisible||0),r=Number(e.capitalMining||0),m=Number(e.capitalNotMining||0),f=this._getRefreshPolicy(),y=Math.round(f.autoMs/1e3),h=this._manualRefreshRemaining();return n`
      <div class="page">
        <div class="toolbar">
          <div class="toolbar-note">
            ${this._t("Corte:","As of:")} ${this._data?.asOf?o.datetime(this._data.asOf):"—"}
            · ${this._t("Plan","Plan")}: ${this._planTier.toUpperCase()}
            · ${this._t("Auto refresh","Auto refresh")}: ${y}s
            ${f.manual?`· ${this._t("Manuales disponibles","Manuals available")}: ${h}/${f.maxManual}`:""}
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap">
            ${this._refreshing?n`<div class="toolbar-status">${this._t("Sincronizando en segundo plano","Syncing in background")}</div>`:""}
            ${this._error&&t?n`<div class="toolbar-note" style="color:var(--color-warning)">${this._error}</div>`:""}
            ${f.manual?n`
              <button class="btn btn-ghost" @click=${()=>this._load({manual:!0})}>${this._t("Actualizar","Refresh")}</button>
            `:""}
          </div>
        </div>

        ${this._renderPortfolioHero()}

        <div class="kpi-strip">
          <stat-card data-kpi="kpi-total" label="${this._t("Capital visible","Visible capital")}" value="${o.usd(s,2)}" accent="neutral" mono></stat-card>
          <stat-card data-kpi="kpi-mining" label="${this._t("Capital mining","Capital mining")}" value="${o.usd(r,2)}" accent="positive" mono></stat-card>
          <stat-card data-kpi="kpi-idle" label="${this._t("Capital no mining","Capital not mining")}" value="${o.usd(m,2)}" accent="warning" mono></stat-card>
          <stat-card data-kpi="kpi-gain" label="${this._t("All miner gain","All miner gain")}" value="${o.pnl(Number(e.allMinerGain||0),2)}" accent="${Number(e.allMinerGain||0)>=0?"positive":"negative"}" mono></stat-card>
          <stat-card data-kpi="kpi-roi" label="${this._t("Miner capital ROI","Miner capital ROI")}" value="${o.pct(Number(e.minerCapitalRoiPct||0),2)}" accent="accent"></stat-card>
          <stat-card data-kpi="kpi-fixed" label="${this._t("Fixed equivalent","Fixed equivalent")}" value="${o.usd(Number(e.fixedEquivalentMinerCapital||0),2)}" accent="neutral" mono></stat-card>
          <stat-card data-kpi="kpi-monthly" label="${this._t("Monthly closeable change","Monthly closeable change")}" value="${o.pnl(Number(e.monthlyCloseablePnlChange||0),2)}" accent="${Number(e.monthlyCloseablePnlChange||0)>=0?"positive":"negative"}" mono></stat-card>
          <stat-card data-kpi="kpi-revenue" label="${this._t("Revenue accumulated","Revenue accumulated")}" value="${o.pnl(Number(e.revenueAccumulated||0),2)}" accent="${Number(e.revenueAccumulated||0)>=0?"positive":"negative"}" mono></stat-card>
        </div>

        <div class="main-row">
          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">${this._t("Capital visible en el tiempo","Visible capital over time")}</div>
                <div class="panel-sub">${this._formatDateRange(i)} · ${this._historySnapshotLabel(i)} · ${this._range.toUpperCase()}</div>
              </div>
              <div class="chart-legend ${l?"active":""}">
                ${l?n`
                  <div class="chart-legend-date">${o.date(l.isoDate)}</div>
                  <div class="chart-legend-value">${o.usd(Number(l.total||0),0)}</div>
                  <div class="chart-legend-pnl ${Number(l.pnl||0)>=0?"pos":"neg"}">${o.pnl(Number(l.pnl||0),2)}</div>
                `:n`<div class="chart-legend-hint">${this._t("↑ mueve el cursor sobre el gráfico","↑ hover the chart")}</div>`}
              </div>
              <div class="range-tabs">
                ${["7d","14d","30d"].map(u=>n`
                  <div class="range-tab ${this._range===u?"active":""}" @click=${()=>{this._range=u,this._capitalHoverIndex=-1}}>${u}</div>
                `)}
              </div>
            </div>
            <div class="chart-wrap" @mousemove=${this._setCapitalHover} @mouseleave=${()=>{this._capitalHoverIndex=-1}}>
              ${this._renderAreaChart()}
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">${this._t("Por ticker","By ticker")}</div>
                <div class="panel-sub">${this._t("Capital visible por activo","Visible capital by asset")}</div>
              </div>
            </div>
            ${this._renderTickerRanked()}
          </div>
        </div>

        <div class="bottom-row">
          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">${this._t("Asignación de capital","Capital allocation")}</div>
                <div class="panel-sub">${this._t("Productivo vs no minando","Productive vs not mining")}</div>
              </div>
            </div>
            <div class="split-row">
              <div class="split-card prod">
                <div class="split-label">${this._t("Capital mining","Capital mining")}</div>
                <div class="split-val">${o.usd(r,0)}</div>
                <div class="split-sub">${s>0?(r/s*100).toFixed(1):"0.0"}% ${this._t("del total","of total")}</div>
              </div>
              <div class="split-card idle">
                <div class="split-label">${this._t("No mining","Not mining")}</div>
                <div class="split-val">${o.usd(m,0)}</div>
                <div class="split-sub">${s>0?(m/s*100).toFixed(1):"0.0"}% ${this._t("del total","of total")}</div>
              </div>
            </div>
            ${this._renderDonut()}
          </div>

          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">${this._t("Por nivel de riesgo","By risk level")}</div>
                <div class="panel-sub">${this._t("Exposición viva por bucket","Live exposure by bucket")}</div>
              </div>
            </div>
            ${this._renderRisk()}
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">${this._t("Capital and revenue snapshot","Capital and revenue snapshot")}</div>
              <div class="panel-sub">${this._t("equity, wallet, BTC core y otros activos","equity, wallet, BTC core, and other assets")}</div>
            </div>
          </div>
          ${this._renderAccountBreakdown()}
        </div>

        ${this._renderPortfolioAssets()}

        <div class="monthly-grid">
          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">${this._t("Capital mensual e ingresos","Monthly capital and revenue")}</div>
                <div class="panel-sub">${this._t("barras mensuales del capital con histórico importado si existe","monthly capital bars using imported history when available")}</div>
              </div>
              <div class="scale-tabs">
                ${[{id:"quarter",es:"3M",en:"3M"},{id:"semester",es:"6M",en:"6M"},{id:"annual",es:"12M",en:"12M"}].map(u=>n`
                  <div class="range-tab ${this._monthlyScale===u.id?"active":""}" @click=${()=>{this._monthlyScale=u.id,this._monthlyHoverIndex=-1}}>
                    ${this._lang==="en"?u.en:u.es}
                  </div>
                `)}
              </div>
            </div>
            ${this._renderMonthlyChart()}
            ${this._renderMonthlyHistory()}
          </div>

          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">${this._t("Recent capital events","Recent capital events")}</div>
                <div class="panel-sub">${this._t("cierres detectados y redeploy cercano","detected closes and nearby redeploy")}</div>
              </div>
            </div>
            ${this._renderRecentEvents()}
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">${this._t("Miners monthly ROI vs fixed income","Miners monthly ROI vs fixed income")}</div>
              <div class="panel-sub">${this._t("siguiente bloque funcional heredado del monolito","next functional block brought from the monolith")}</div>
            </div>
          </div>
          ${this._renderBenchmarks()}
        </div>

        <div class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">${this._t("BTC Core DCA","BTC Core DCA")}</div>
              <div class="panel-sub">${this._t("lectura de acumulación conectada a capital","accumulation readout connected into capital")}</div>
            </div>
          </div>
          ${this._renderBtcDca()}
        </div>
      </div>
    `}}customElements.define("capital-view",D);
