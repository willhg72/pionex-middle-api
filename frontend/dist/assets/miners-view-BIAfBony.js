import{k as g,p as y,i as N,b as R,a as S,g as $,n as w,q as I,e as n,l as r}from"./index-Bb1-_Ymx.js";import{c as M}from"./repeat-ByGDeUoN.js";import{d as P}from"./domain-state-mCFUKEFK.js";function c(i,e=0){const t=Number(i);return Number.isFinite(t)?t:e}function m(...i){for(const e of i)if(e!=null&&String(e).trim())return String(e);return""}function z(i){const e=String(i.rangeHealth||"").toLowerCase(),t=c(i.inventoryRatio);return e.includes("break")||t>=.65?"danger":e.includes("warn")||t>=.4?"warning":"ok"}function T(i){const e=c(i.quoteInvestment),t=c(i.gridProfit),a=c(i.totalProfit,t),s=c(i.closeProfit,a),l=c(i.trendPnl),o=z(i),d=m(i.symbol,i.baseSymbol,i.market),v=d.replace(/_PERP$/i,"").replace(/_USDT$/i,"").replace(/_/g,""),u=c(i.rangePosition,.5),f=Math.max(0,u-.2),h=Math.min(1,u+.2),_=Math.min(1,Math.max(0,u)),x=Math.max(1,c(i.referencePrice,c(i.currentPrice,0)));return{buOrderId:m(i.buOrderId),symbol:d,ticker:v,status:m(i.status,"unknown"),type:m(i.minerType,"grid_worker").replaceAll("_"," "),leverage:c(i.leverage,1),capital:e,openPnl:s,dailyPnl:t,totalProfit:a,gridProfit:t,closeProfit:s,trendPnl:l,fillRate:Math.round(Math.max(0,Math.min(100,c(i.executionEfficiencyReal,.5)*100))),gridGap:Math.max(.5,c(i.perVolume,0)*1e3),levels:Math.max(1,Math.round(c(i.expectedGridLevels,12))),currentPrice:x*_,gridLow:Math.max(1,x*f),gridHigh:Math.max(x*f+1,x*h),rangePosition:_,rangeHealth:m(i.rangeHealth,"unknown"),inventoryRatio:c(i.inventoryRatio),targetDailyUsdt:c(i.targetDailyUsdt,1),warning:o==="danger"?"Range or inventory risk is elevated. Review close PnL and regrid evidence.":o==="warning"?"This miner needs a closer look before scaling.":"",risk:o,inventoryGate:i.inventoryGate||null,promoHealth:i.promoHealth||null,harvestPolicy:i.harvestPolicy||null,raw:i}}function L(i){const e=i.reduce((o,d)=>o+c(d.capital),0),t=i.reduce((o,d)=>o+c(d.openPnl),0),a=i.reduce((o,d)=>o+c(d.dailyPnl),0),s=i.filter(o=>o.risk!=="ok").length,l=i.length?i.reduce((o,d)=>o+c(d.gridGap),0)/i.length:0;return{active:i.length,totalCapital:e,openPnl:t,dailyPnl:a,warnings:s,avgGridGap:l.toFixed(2)}}const p={async getMiners({targetDailyUsdt:i=1}={}){const e=await g(`/dashboard/miners?targetDailyUsdt=${encodeURIComponent(i)}`),t=Array.isArray(e?.miners)?e.miners.map(T):[];return{ok:!!e?.ok,source:e?.source||"api",miners:t,summary:L(t),count:t.length}},async getBalance(){return g("/dashboard/miners/account-balance")},async getHistory({symbol:i,limit:e=24}={}){const t=new URLSearchParams({limit:String(e)});return i&&t.set("symbol",i),g(`/dashboard/miners/history?${t.toString()}`)},async getEvents({symbol:i,limit:e=24}={}){const t=new URLSearchParams({limit:String(e)});return i&&t.set("symbol",i),g(`/dashboard/miners/events?${t.toString()}`)},async previewClose(i){return g("/dashboard/miners/close-preview",{method:"POST",body:JSON.stringify({buOrderId:i.buOrderId,symbol:i.symbol})})},async executeClose({confirmationToken:i,closeReason:e}){return g("/dashboard/miners/close",{method:"POST",body:JSON.stringify({confirmationToken:i,closeReason:e,...y()})})},async checkStabilization(i,{mode:e="auto",targetDailyUsdt:t=1}={}){return g("/dashboard/miners/stabilization-check",{method:"POST",body:JSON.stringify({buOrderId:i.buOrderId,mode:e,targetDailyUsdt:t,...y()})})},async previewRegrid(i,{mode:e="auto",targetDailyUsdt:t=1}={}){return g("/dashboard/miners/regrid-preview",{method:"POST",body:JSON.stringify({buOrderId:i.buOrderId,mode:e,targetDailyUsdt:t,...y()})})},async executeRegrid({confirmationToken:i,reason:e}){return g("/dashboard/miners/regrid",{method:"POST",body:JSON.stringify({confirmationToken:i,reason:e,...y()})})}},k="miners",C={free:{autoMs:15e3,manual:!1,maxManual:0,windowMs:3e4},pro:{autoMs:1e4,manual:!1,maxManual:0,windowMs:3e4},premium:{autoMs:5e3,manual:!0,maxManual:2,windowMs:3e4}};let b={data:null,balance:null,loaded:!1};class O extends N{static properties={_data:{type:Object,state:!0},_balance:{type:Object,state:!0},_loading:{type:Boolean,state:!0},_refreshing:{type:Boolean,state:!0},_error:{type:String,state:!0},_filter:{type:String,state:!0},_expandedId:{type:String,state:!0},_details:{type:Object,state:!0},_closeCtx:{type:Object,state:!0},_regridCtx:{type:Object,state:!0},_lang:{type:String,state:!0},_planTier:{type:String,state:!0},_nextAutoRefreshAt:{type:Number,state:!0},_hasLoadedOnce:{type:Boolean,state:!0}};static styles=[R,S`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .toolbar { display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center; justify-content: space-between; }
    .toolbar-left, .toolbar-right { display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center; }
    .toolbar-note { font-size: var(--text-xs); color: var(--color-text-muted); }
    .toolbar-status { font-size: var(--text-xs); color: var(--color-accent); }
    .hero { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-4); }
    .hero-main { display: flex; flex-direction: column; gap: var(--space-4); }
    .hero-summary { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-3); }
    .hero-glance {
      background: linear-gradient(140deg, rgba(91,141,239,.08) 0%, rgba(34,211,160,.04) 100%);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-lg);
      padding: 18px 20px;
    }
    .hero-eyebrow { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 6px; }
    .hero-value { font-family: var(--font-mono); font-size: 30px; line-height: 1; font-weight: var(--weight-bold); font-variant-numeric: tabular-nums slashed-zero; font-feature-settings: "tnum" 1, "zero" 1; }
    .hero-sub { margin-top: 6px; font-size: var(--text-sm); color: var(--color-text-secondary); }
    .hero-pills { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: var(--space-3); }
    .hero-pill {
      display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 999px;
      font-size: var(--text-xs); font-weight: var(--weight-semibold); font-family: var(--font-mono);
    }
    .hero-pill.ok { background: var(--color-positive-dim); color: var(--color-positive); }
    .hero-pill.warn { background: var(--color-warning-dim); color: var(--color-warning); }
    .hero-pill.danger { background: var(--color-negative-dim); color: var(--color-negative); }
    .hero-lanes { display: grid; gap: var(--space-2); }
    .lane {
      display: grid; grid-template-columns: 76px 1fr auto; gap: var(--space-3); align-items: center;
      padding: 10px 12px; border-radius: var(--radius-md); background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle);
    }
    .lane-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    .lane-bar { height: 8px; border-radius: 999px; background: var(--color-bg-panel); overflow: hidden; }
    .lane-fill { height: 100%; border-radius: 999px; }
    .lane-value { font-family: var(--font-mono); font-size: var(--text-xs); min-width: 42px; text-align: right; font-variant-numeric: tabular-nums slashed-zero; font-feature-settings: "tnum" 1, "zero" 1; }
    .kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--space-3); }
    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }
    .miners-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: var(--space-4); }
    .miner-card { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); overflow: hidden; }
    .miner-card.warning { border-left: 3px solid var(--color-warning); }
    .miner-card.danger { border-left: 3px solid var(--color-negative); }
    .miner-head { padding: var(--card-padding); cursor: pointer; display: flex; flex-direction: column; gap: var(--space-3); }
    .miner-head:hover { background: rgba(255,255,255,0.02); }
    .topline { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3); }
    .ticker { font-size: var(--text-lg); font-weight: var(--weight-bold); }
    .meta { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 3px; }
    .head-summary { display:flex; align-items:center; gap: var(--space-2); flex-wrap: wrap; justify-content: flex-end; }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 9px; border-radius: 999px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
    .badge.ok { background: var(--color-positive-dim); color: var(--color-positive); }
    .badge.warning { background: var(--color-warning-dim); color: var(--color-warning); }
    .badge.danger { background: var(--color-negative-dim); color: var(--color-negative); }
    .signal-badge { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); font-variant-numeric: tabular-nums slashed-zero; font-feature-settings: "tnum" 1, "zero" 1; }
    .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); }
    .metric { display: flex; flex-direction: column; gap: 2px; }
    .metric-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    .metric-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); font-variant-numeric: tabular-nums slashed-zero; font-feature-settings: "tnum" 1, "zero" 1; }
    .metric-value.pos { color: var(--color-positive); }
    .metric-value.neg { color: var(--color-negative); }
    .summary-strip { display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-2); }
    .summary-chip { padding: 10px; border-radius: var(--radius-md); background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle); }
    .summary-chip-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 4px; }
    .summary-chip-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums slashed-zero; font-feature-settings: "tnum" 1, "zero" 1; }
    .summary-chip-note { margin-top: 3px; font-size: var(--text-xs); color: var(--color-text-secondary); }
    .warning-banner { padding: 8px 10px; border-radius: var(--radius-md); background: var(--color-warning-dim); color: var(--color-warning); font-size: var(--text-xs); }
    .actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
    .actions .btn { flex: 1; min-width: 0; }
    .signal-row { display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-2); }
    .signal { padding: 10px; border-radius: var(--radius-md); background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle); }
    .signal.pass { border-color: rgba(34,211,160,0.28); background: rgba(34,211,160,0.08); }
    .signal.warn { border-color: rgba(245,166,35,0.28); background: rgba(245,166,35,0.08); }
    .signal.fail { border-color: rgba(240,74,94,0.28); background: rgba(240,74,94,0.08); }
    .signal-code { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-primary); }
    .signal-name { margin-top: 3px; font-size: 10px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .signal-value { margin-top: 6px; font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .signal-detail { margin-top: 4px; font-size: var(--text-xs); color: var(--color-text-secondary); }
    .range-track { display:flex; flex-direction:column; gap: 8px; }
    .range-track-top { display:flex; justify-content:space-between; gap:12px; font-size: var(--text-xs); color: var(--color-text-muted); }
    .range-bar { position: relative; height: 12px; border-radius: 999px; background: linear-gradient(90deg, rgba(240,74,94,0.18) 0%, rgba(245,166,35,0.18) 15%, rgba(34,211,160,0.2) 50%, rgba(245,166,35,0.18) 85%, rgba(240,74,94,0.18) 100%); overflow:hidden; border: 1px solid var(--color-border-subtle); }
    .range-marker { position:absolute; top:-2px; width: 2px; height: 16px; background: #e8eaf2; box-shadow: 0 0 0 2px rgba(255,255,255,0.12); }
    .range-marker::after { content:''; position:absolute; top:-3px; left:-4px; width:10px; height:10px; border-radius:50%; background:#e8eaf2; }
    .range-caption { font-size: var(--text-xs); color: var(--color-text-secondary); }
    .expanded { border-top: 1px solid var(--color-border-subtle); padding: var(--card-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-2); }
    .detail { padding: 10px; border-radius: var(--radius-md); background: var(--color-bg-elevated); }
    .detail-title { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 4px; }
    .detail-value { font-family: var(--font-mono); font-size: var(--text-sm); }
    .section { display: flex; flex-direction: column; gap: var(--space-2); }
    .section-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .mini-list { display: flex; flex-direction: column; gap: 8px; }
    .mini-item { padding: 10px; border-radius: var(--radius-md); background: var(--color-bg-elevated); font-size: var(--text-xs); color: var(--color-text-secondary); }
    .mini-item strong { color: var(--color-text-primary); }
    .chart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.86); display: flex; align-items: center; justify-content: center; z-index: 210; padding: 16px; }
    .chart-modal { display: flex; width: 96vw; max-width: 1420px; height: 88vh; background: var(--color-bg-panel); border: 1px solid var(--color-border-default); border-radius: var(--radius-xl); overflow: hidden; }
    .chart-left { flex: 1; display: flex; flex-direction: column; border-right: 1px solid var(--color-border-subtle); }
    .chart-right { width: 380px; display: flex; flex-direction: column; }
    .chart-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--color-border-subtle); background: var(--color-bg-card); }
    .tv-frame { flex: 1; border: none; width: 100%; }
    .exec-body { padding: 18px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
    .exec-row { display: flex; justify-content: space-between; gap: 12px; font-size: var(--text-sm); padding-bottom: 8px; border-bottom: 1px solid var(--color-border-subtle); }
    .exec-row span:last-child { font-family: var(--font-mono); text-align: right; }
    .exec-actions { margin-top: auto; display: flex; gap: 8px; padding: 14px 18px; border-top: 1px solid var(--color-border-subtle); }
    .exec-actions .btn { flex: 1; }
    .hint { font-size: var(--text-xs); color: var(--color-text-muted); }
    @media (max-width: 900px) {
      .hero { grid-template-columns: 1fr; }
      .hero-summary { grid-template-columns: 1fr; }
      .metrics { grid-template-columns: repeat(2, 1fr); }
      .summary-strip { grid-template-columns: 1fr; }
      .signal-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .detail-grid { grid-template-columns: 1fr; }
      .chart-modal { flex-direction: column; height: 94dvh; }
      .chart-left { min-height: 280px; border-right: 0; border-bottom: 1px solid var(--color-border-subtle); }
      .chart-right { width: 100%; }
    }
  `];constructor(){super(),this._data=b.data||{miners:[],summary:{active:0,totalCapital:0,openPnl:0,dailyPnl:0,warnings:0,avgGridGap:"0.00"}},this._balance=b.balance||null,this._loading=!b.loaded,this._refreshing=!1,this._error="",this._filter=P.load(k).filter||"all",this._expandedId="",this._details={},this._closeCtx=null,this._regridCtx=null,this._lang=$(),this._planTier="free",this._nextAutoRefreshAt=0,this._manualRefreshHits=[],this._refreshTimer=null,this._hasLoadedOnce=!!b.loaded}connectedCallback(){super.connectedCallback(),this._localeListener=()=>{this._lang=$(),this.requestUpdate()},window.addEventListener("capintel-locale-changed",this._localeListener),this._bootstrap()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-locale-changed",this._localeListener),clearTimeout(this._refreshTimer)}_t(e,t){return this._lang==="en"?t:e}_getRefreshPolicy(){return C[this._planTier]||C.free}_manualRefreshRemaining(){const e=this._getRefreshPolicy(),t=Date.now();return this._manualRefreshHits=this._manualRefreshHits.filter(a=>t-a<e.windowMs),Math.max(0,e.maxManual-this._manualRefreshHits.length)}_scheduleRefresh(){clearTimeout(this._refreshTimer);const e=this._getRefreshPolicy();this._nextAutoRefreshAt=Date.now()+e.autoMs,this._refreshTimer=window.setTimeout(()=>{this._load({auto:!0})},e.autoMs)}async _bootstrap(){try{const e=w.getCachedSettings();this._planTier=e.planTier||"free";const t=await w.getSettings().catch(()=>null);t?.planTier&&(this._planTier=t.planTier)}finally{this._scheduleRefresh(),await this._load()}}_emitShellMetrics(){const e=this._data?.summary||{},t=Array.isArray(this._data?.miners)?this._data.miners:[],a=t.filter(l=>l.risk!=="ok").length,s=t.length?Math.round((t.filter(l=>l.risk==="danger").length*100+t.filter(l=>l.risk==="warning").length*55)/t.length):0;I.setState({activeMinersCount:t.length,minerWarnings:a}),this.dispatchEvent(new CustomEvent("capintel-shell-metrics",{bubbles:!0,composed:!0,detail:{route:"miners",metrics:{totalCapital:Number(e.totalCapital||0),freeUsdt:Number(this._balance?.usdt?.free||0),openPnl:Number(e.openPnl||0),monthlyPnl:Number(e.dailyPnl||0),riskScore:s}}}))}async _load({auto:e=!1,manual:t=!1}={}){const a=this._hasLoadedOnce;if(t){if(!this._getRefreshPolicy().manual)return;if(this._manualRefreshRemaining()<=0){window.toast?.(this._t("Limite manual alcanzado: maximo 2 refresh en 30 segundos.","Manual limit reached: max 2 refreshes in 30 seconds."),{type:"warning"});return}this._manualRefreshHits.push(Date.now())}this._error="",a?this._refreshing=!0:this._loading=!0;try{const[s,l]=await Promise.all([p.getMiners(),p.getBalance().catch(()=>null)]);this._data=s,this._balance=l,b={data:s,balance:l,loaded:!0},this._hasLoadedOnce=!0,this._emitShellMetrics()}catch(s){const l=s?.data?.detail||s?.message||this._t("No se pudieron cargar los mineros activos.","Could not load active miners.");a?window.toast?.(l,{type:e?"warning":"error"}):this._error=l}finally{this._loading=!1,this._refreshing=!1,this._scheduleRefresh()}}_setFilter(e){this._filter=e,P.save(k,{filter:e})}_filteredMiners(){const e=Array.isArray(this._data?.miners)?this._data.miners:[];return this._filter==="warnings"?e.filter(t=>t.risk!=="ok"):this._filter==="danger"?e.filter(t=>t.risk==="danger"):e}_filterCounts(){const e=Array.isArray(this._data?.miners)?this._data.miners:[];return{all:e.length,warnings:e.filter(t=>t.risk!=="ok").length,danger:e.filter(t=>t.risk==="danger").length}}_heroSummary(){const e=Array.isArray(this._data?.miners)?this._data.miners:[],t=this._filterCounts(),a=e.reduce((o,d)=>o+Number(d.targetDailyUsdt||0),0),s=e.length?e.reduce((o,d)=>o+Number(d.inventoryRatio||0),0)/e.length:0,l=e.length?e.reduce((o,d)=>o+Number(d.rangePosition||0),0)/e.length:0;return{counts:t,totalTarget:a,avgInventory:s,avgRange:l,healthy:Math.max(0,t.all-t.warnings)}}_renderHeroLanes(){const e=this._heroSummary(),t=e.counts,a=Math.max(1,t.all),s=[{label:this._t("Salud","Health"),value:`${e.healthy}/${t.all}`,pct:e.healthy/a*100,color:"var(--color-positive)"},{label:this._t("Alertas","Warnings"),value:`${t.warnings}/${t.all}`,pct:t.warnings/a*100,color:"var(--color-warning)"},{label:this._t("Criticos","Critical"),value:`${t.danger}/${t.all}`,pct:t.danger/a*100,color:"var(--color-negative)"}];return n`
      <div class="hero-lanes">
        ${s.map(l=>n`
          <div class="lane">
            <div class="lane-label">${l.label}</div>
            <div class="lane-bar"><div class="lane-fill" style="width:${l.pct}%;background:${l.color}"></div></div>
            <div class="lane-value">${l.value}</div>
          </div>
        `)}
      </div>
    `}_signalSet(e){const t=Number(e.rangePosition),a=Number(e.inventoryRatio),s=Number(e.openPnl||0),l=Number(e.dailyPnl||0),o=Number(e.targetDailyUsdt||0),d=l>0?s/Math.max(l,1e-4):null,v=Number.isFinite(t)?t>=.15&&t<=.85?{code:"R",name:this._t("Rango","Range"),status:"pass",value:r.pctPlain(t*100,1),detail:this._t("Precio bien ubicado dentro del rango.","Price is well positioned inside the range.")}:t>=0&&t<=1?{code:"R",name:this._t("Rango","Range"),status:"warn",value:r.pctPlain(t*100,1),detail:this._t("Precio cerca de un borde del rango.","Price is near a range edge.")}:{code:"R",name:this._t("Rango","Range"),status:"fail",value:r.pctPlain(t*100,1),detail:this._t("Precio fuera del rango del minero.","Price is outside the miner range.")}:{code:"R",name:this._t("Rango","Range"),status:"warn",value:"—",detail:this._t("Posición de rango no disponible.","Range position not available.")},u=Number.isFinite(d)?d>=2?{code:"C",name:this._t("Cobertura","Coverage"),status:"pass",value:`${d.toFixed(2)}x`,detail:this._t("La ganancia de cierre tiene colchón sobre el grid.","Closeable gain has room over the grid profit.")}:d>=1?{code:"C",name:this._t("Cobertura","Coverage"),status:"warn",value:`${d.toFixed(2)}x`,detail:this._t("La cobertura existe, pero es delgada.","Coverage exists, but it is thin.")}:{code:"C",name:this._t("Cobertura","Coverage"),status:"fail",value:`${d.toFixed(2)}x`,detail:this._t("La cobertura es débil frente al riesgo abierto.","Coverage is weak versus open risk.")}:{code:"C",name:this._t("Cobertura","Coverage"),status:"warn",value:"—",detail:this._t("No hay suficiente información de grid para estimar cobertura.","Not enough grid information to estimate coverage.")},f=Number.isFinite(a)?a<=.05?{code:"I",name:this._t("Inventario","Inventory"),status:"pass",value:r.pctPlain(a*100,1),detail:this._t("Inventario limpio.","Inventory is clean.")}:a<=.1?{code:"I",name:this._t("Inventario","Inventory"),status:"warn",value:r.pctPlain(a*100,1),detail:this._t("Inventario elevado, necesita vigilancia.","Inventory is elevated and needs monitoring.")}:{code:"I",name:this._t("Inventario","Inventory"),status:"fail",value:r.pctPlain(a*100,1),detail:this._t("Inventario pesado para este capital.","Inventory is heavy for this capital.")}:{code:"I",name:this._t("Inventario","Inventory"),status:"warn",value:"—",detail:this._t("Inventario no disponible.","Inventory not available.")},h=s-Math.max(0,o),_=h>0?{code:"S",name:this._t("Stress","Stress"),status:"pass",value:r.pnl(h,2),detail:this._t("El minero conserva colchón sobre su meta diaria.","The miner still has a buffer over its daily target.")}:h>-1?{code:"S",name:this._t("Stress","Stress"),status:"warn",value:r.pnl(h,2),detail:this._t("El colchón es pequeño; conviene vigilarlo.","The buffer is small and should be monitored.")}:{code:"S",name:this._t("Stress","Stress"),status:"fail",value:r.pnl(h,2),detail:this._t("El cierre ya no cubre cómodamente el objetivo diario.","The closeable PnL no longer comfortably covers the daily target.")};return[v,u,f,_]}_renderSignalSet(e){return n`
      <div class="signal-row">
        ${this._signalSet(e).map(t=>n`
          <div class="signal ${t.status}">
            <div class="signal-code">${t.code}</div>
            <div class="signal-name">${t.name}</div>
            <div class="signal-value">${t.value}</div>
            <div class="signal-detail">${t.detail}</div>
          </div>
        `)}
      </div>
    `}_renderRangeTrack(e){const t=Number(e.rangePosition),a=Number.isFinite(t)?Math.max(0,Math.min(100,t*100)):0;return n`
      <div class="range-track">
        <div class="range-track-top">
          <span>${this._t("Bajo","Low")} ${r.usd(Number(e.gridLow||0),2)}</span>
          <span>${this._t("Actual","Current")} ${r.usd(Number(e.currentPrice||0),2)}</span>
          <span>${this._t("Alto","High")} ${r.usd(Number(e.gridHigh||0),2)}</span>
        </div>
        <div class="range-bar">
          <div class="range-marker" style="left: calc(${a}% - 1px)"></div>
        </div>
        <div class="range-caption">
          ${Number.isFinite(t)?this._t(`Precio al ${a.toFixed(1)}% del rango. ${e.rangeHealth||""}`,`Price at ${a.toFixed(1)}% of range. ${e.rangeHealth||""}`):this._t("No hay posición de rango disponible.","No range position is available.")}
        </div>
      </div>
    `}_renderCollapsedSummary(e){const t=this._signalSet(e),a=t.find(o=>o.code==="R"),s=t.find(o=>o.code==="C"),l=t.find(o=>o.code==="I");return n`
      <div class="summary-strip">
        <div class="summary-chip">
          <div class="summary-chip-label">${this._t("Rango y cierre","Range and close")}</div>
          <div class="summary-chip-value">${a?.value||"-"} · ${r.pnl(Number(e.openPnl||0),2)}</div>
          <div class="summary-chip-note">${e.rangeHealth||this._t("sin lectura","no reading")}</div>
        </div>
        <div class="summary-chip">
          <div class="summary-chip-label">${this._t("Cobertura real","Real coverage")}</div>
          <div class="summary-chip-value">${s?.value||"-"} · ${r.pnl(Number(e.dailyPnl||0),2)}</div>
          <div class="summary-chip-note">${this._t("grid del dia y colchon de salida","daily grid and close buffer")}</div>
        </div>
        <div class="summary-chip">
          <div class="summary-chip-label">${this._t("Inventario y cosecha","Inventory and harvest")}</div>
          <div class="summary-chip-value">${l?.value||"-"} · ${r.usd(Number(e.harvestPolicy?.suggestedAmountUsdt||0),2)}</div>
          <div class="summary-chip-note">${e.harvestPolicy?.action||this._t("sin accion recomendada","no suggested action")}</div>
        </div>
      </div>
    `}async _toggleExpanded(e){if(this._expandedId===e.buOrderId){this._expandedId="";return}if(this._expandedId=e.buOrderId,!this._details[e.buOrderId]){this._details={...this._details,[e.buOrderId]:{loading:!0,history:[],events:[]}};try{const[t,a]=await Promise.all([p.getHistory({symbol:e.symbol,limit:12}),p.getEvents({symbol:e.symbol,limit:12})]);this._details={...this._details,[e.buOrderId]:{loading:!1,history:Array.isArray(t?.snapshots)?t.snapshots:[],events:Array.isArray(a?.events)?a.events:[]}}}catch(t){this._details={...this._details,[e.buOrderId]:{loading:!1,error:t?.data?.detail||t?.message||this._t("No se pudo cargar el detalle del minero.","Could not load miner detail."),history:[],events:[]}}}}}async _openClose(e){try{const t=await p.previewClose(e);this._closeCtx={miner:e,preview:t}}catch(t){window.toast?.(t?.data?.detail||t?.message||this._t("No se pudo preparar el cierre.","Could not prepare close preview."),{type:"error"})}}async _executeClose(){const e=this._closeCtx?.miner,t=this._closeCtx?.preview?.confirmationToken,a=await p.executeClose({confirmationToken:t,closeReason:`Risk-control close requested from new dashboard for ${e?.symbol||"miner"}`});return await this._load(),{success:!!a?.ok,message:a?.ok?this._t(`${e?.ticker} cerrado en Pionex.`,`${e?.ticker} closed on Pionex.`):this._t("El cierre falló.","Close failed.")}}async _checkStabilization(e){try{const t=await p.checkStabilization(e),a=this._details[e.buOrderId]||{};this._details={...this._details,[e.buOrderId]:{...a,stabilization:t}},window.toast?.(t?.decisionReason||this._t("Chequeo de estabilización completado.","Stabilization check completed."),{type:"info"}),this._expandedId!==e.buOrderId&&await this._toggleExpanded(e)}catch(t){window.toast?.(t?.data?.detail||t?.message||this._t("Falló el chequeo de estabilización.","Stabilization check failed."),{type:"error"})}}async _openRegrid(e){this._regridCtx={miner:e,loading:!0,preview:null,result:null};try{const t=await p.previewRegrid(e);this._regridCtx={miner:e,loading:!1,preview:t,result:null}}catch(t){this._regridCtx={miner:e,loading:!1,preview:null,error:t?.data?.detail||t?.message||this._t("No se pudo construir el preview de regrid.","Could not build regrid preview.")}}}async _executeRegrid(){const e=this._regridCtx?.miner,t=this._regridCtx?.preview?.confirmationToken,a=await p.executeRegrid({confirmationToken:t,reason:`Range migration executed from new dashboard for ${e?.symbol||"miner"}`});return this._regridCtx={...this._regridCtx,result:a},await this._load(),a}_renderBalancePanel(){const e=this._balance;return e?.ok?n`
      <div class="panel">
        <div class="panel-title">${this._t("Balance de cuenta","Account Balance")}</div>
        <div class="detail-grid">
          <div class="detail"><div class="detail-title">${this._t("USDT libre","USDT Free")}</div><div class="detail-value">${r.usd(Number(e?.usdt?.free||0),2)}</div></div>
          <div class="detail"><div class="detail-title">${this._t("USDT total","USDT Total")}</div><div class="detail-value">${r.usd(Number(e?.usdt?.total||0),2)}</div></div>
          <div class="detail"><div class="detail-title">${this._t("Total estimado","Estimated Total")}</div><div class="detail-value">${r.usd(Number(e?.estimatedTotalUsd||0),2)}</div></div>
          <div class="detail"><div class="detail-title">${this._t("Activos","Assets")}</div><div class="detail-value">${Number(e?.assetsCount||0)}</div></div>
        </div>
      </div>
    `:n`<div class="panel"><div class="panel-title">${this._t("Balance de cuenta","Account Balance")}</div><div class="hint">${this._t("El balance no está disponible por ahora.","Balance not available right now.")}</div></div>`}_renderExpanded(e){const t=this._details[e.buOrderId]||{},a=t.stabilization;return n`
      <div class="expanded">
        ${this._renderSignalSet(e)}
        ${this._renderRangeTrack(e)}
        <div class="detail-grid">
          <div class="detail"><div class="detail-title">BU Order</div><div class="detail-value">${e.buOrderId}</div></div>
          <div class="detail"><div class="detail-title">Range Health</div><div class="detail-value">${e.rangeHealth||"—"}</div></div>
          <div class="detail"><div class="detail-title">Inventory Ratio</div><div class="detail-value">${r.pctPlain(Number(e.inventoryRatio||0)*100,1)}</div></div>
          <div class="detail"><div class="detail-title">Target Daily</div><div class="detail-value">${r.usd(Number(e.targetDailyUsdt||0),2)}</div></div>
          <div class="detail"><div class="detail-title">Trend PnL</div><div class="detail-value">${r.pnl(Number(e.trendPnl||0),2)}</div></div>
          <div class="detail"><div class="detail-title">Grid Profit</div><div class="detail-value">${r.pnl(Number(e.gridProfit||0),2)}</div></div>
          <div class="detail"><div class="detail-title">Fill Rate</div><div class="detail-value">${r.pctPlain(Number(e.fillRate||0),0)}</div></div>
        </div>

        ${e.inventoryGate?n`
          <div class="section">
            <div class="section-title">Inventory Gate</div>
            <div class="mini-item"><strong>${e.inventoryGate.label||"Gate"}</strong><br />${e.inventoryGate.detail||"No extra detail."}</div>
          </div>
        `:""}

        ${e.promoHealth?n`
          <div class="section">
            <div class="section-title">Promo Health</div>
            <div class="mini-item"><strong>${e.promoHealth.label||"Promo"}</strong><br />Score ${r.number(Number(e.promoHealth.score||0),1)}</div>
          </div>
        `:""}

        ${e.harvestPolicy?n`
          <div class="section">
            <div class="section-title">Harvest Policy</div>
            <div class="mini-item">
              <strong>${e.harvestPolicy.action||"Policy"}</strong><br />
              Suggested ${r.usd(Number(e.harvestPolicy.suggestedAmountUsdt||0),2)}<br />
              ${(e.harvestPolicy.blockers||[]).length?`Blockers: ${(e.harvestPolicy.blockers||[]).join(" · ")}`:"No active blockers."}
            </div>
          </div>
        `:""}

        ${a?n`
          <div class="section">
            <div class="section-title">Latest Stabilization Check</div>
            <div class="mini-item">
              <strong>${a.regridSuggestion||"NO_ACTION"}</strong><br />
              ${a.decisionReason||"No reason returned."}
            </div>
          </div>
        `:""}

        <div class="section">
          <div class="section-title">Recent Events</div>
          ${t.loading?n`<loading-view label="Loading events and history"></loading-view>`:""}
          ${t.error?n`<error-view label="Detail unavailable" .sub=${t.error}></error-view>`:""}
          ${!t.loading&&!t.error?n`
            <div class="mini-list">
              ${(t.events||[]).slice(0,4).map(s=>n`
                <div class="mini-item">
                  <strong>${s.eventType||s.event_type||"event"}</strong><br />
                  ${(s.reason||"No reason").toString()}
                </div>
              `)}
              ${(t.events||[]).length?"":n`<div class="mini-item">No backend events persisted yet for this symbol.</div>`}
            </div>
          `:""}
        </div>

        <div class="section">
          <div class="section-title">Snapshot History</div>
          ${!t.loading&&!t.error?n`
            <div class="mini-list">
              ${(t.history||[]).slice(0,4).map(s=>n`
                <div class="mini-item">
                  <strong>${s.createdAt?new Date(s.createdAt).toLocaleString():"Snapshot"}</strong><br />
                  close ${r.pnl(Number(s.payload?.closeProfit||s.closeProfit||0),2)} · grid ${r.pnl(Number(s.payload?.gridProfit||s.gridProfit||0),2)}
                </div>
              `)}
              ${(t.history||[]).length?"":n`<div class="mini-item">No stored snapshots yet for this symbol.</div>`}
            </div>
          `:""}
        </div>
      </div>
    `}_renderMinerCard(e){const t=this._expandedId===e.buOrderId,a=e.risk==="danger"?"danger":e.risk==="warning"?"warning":"ok";return n`
      <article class="miner-card ${a}">
        <div class="miner-head" @click=${()=>this._toggleExpanded(e)}>
          <div class="topline">
            <div>
              <div class="ticker">${e.ticker}</div>
              <div class="meta">${e.type} · ${r.leverage(e.leverage)} · ${e.status}</div>
            </div>
            <span class="badge ${a}">${a==="ok"?this._t("saludable","healthy"):a==="danger"?this._t("crítico","danger"):this._t("alerta","warning")}</span>
          </div>

          ${e.warning?n`<div class="warning-banner">${e.warning}</div>`:""}

          <div class="metrics">
            <div class="metric"><span class="metric-label">${this._t("PnL cierre","Close PnL")}</span><span class="metric-value ${Number(e.openPnl||0)>=0?"pos":"neg"}">${r.pnl(Number(e.openPnl||0),2)}</span></div>
            <div class="metric"><span class="metric-label">${this._t("PnL grid","Grid PnL")}</span><span class="metric-value ${Number(e.dailyPnl||0)>=0?"pos":"neg"}">${r.pnl(Number(e.dailyPnl||0),2)}</span></div>
            <div class="metric"><span class="metric-label">${this._t("Capital","Capital")}</span><span class="metric-value">${r.usd(Number(e.capital||0),2)}</span></div>
            <div class="metric"><span class="metric-label">${this._t("Posición en rango","Range Position")}</span><span class="metric-value">${r.pctPlain(Number(e.rangePosition||0)*100,1)}</span></div>
            <div class="metric"><span class="metric-label">${this._t("Inventario","Inventory")}</span><span class="metric-value">${r.pctPlain(Number(e.inventoryRatio||0)*100,1)}</span></div>
            <div class="metric"><span class="metric-label">${this._t("Objetivo / día","Target / Day")}</span><span class="metric-value">${r.usd(Number(e.targetDailyUsdt||0),2)}</span></div>
          </div>

          <div class="actions" @click=${s=>s.stopPropagation()}>
            <button class="btn btn-ghost btn-sm" @click=${()=>this._checkStabilization(e)}>${this._t("Revisar estabilización","Check Stabilization")}</button>
            <button class="btn btn-warning btn-sm" @click=${()=>this._openRegrid(e)}>${this._t("Preview regrid","Preview Regrid")}</button>
            <button class="btn btn-danger btn-sm" @click=${()=>this._openClose(e)}>${this._t("Cerrar","Close")}</button>
          </div>
        </div>
        ${t?this._renderExpanded(e):""}
      </article>
    `}_renderMinerCardEnhanced(e){const t=this._expandedId===e.buOrderId,a=e.risk==="danger"?"danger":e.risk==="warning"?"warning":"ok",s=this._signalSet(e),l=s.filter(v=>v.status==="pass").length,o=s.filter(v=>v.status==="warn").length,d=s.filter(v=>v.status==="fail").length;return n`
      <article class="miner-card ${a}">
        <div class="miner-head" @click=${()=>this._toggleExpanded(e)}>
          <div class="topline">
            <div>
              <div class="ticker">${e.ticker}</div>
              <div class="meta">${e.type} · ${r.leverage(e.leverage)} · ${e.status}</div>
            </div>
            <div class="head-summary">
              <span class="badge ${a}">${a==="ok"?this._t("saludable","healthy"):a==="danger"?this._t("critico","danger"):this._t("alerta","warning")}</span>
              <span class="signal-badge">R ${l} · W ${o} · C ${d}</span>
            </div>
          </div>

          ${e.warning?n`<div class="warning-banner">${e.warning}</div>`:""}

          <div class="metrics">
            <div class="metric"><span class="metric-label">${this._t("PnL cierre","Close PnL")}</span><span class="metric-value ${Number(e.openPnl||0)>=0?"pos":"neg"}">${r.pnl(Number(e.openPnl||0),2)}</span></div>
            <div class="metric"><span class="metric-label">${this._t("PnL grid","Grid PnL")}</span><span class="metric-value ${Number(e.dailyPnl||0)>=0?"pos":"neg"}">${r.pnl(Number(e.dailyPnl||0),2)}</span></div>
            <div class="metric"><span class="metric-label">${this._t("Capital","Capital")}</span><span class="metric-value">${r.usd(Number(e.capital||0),2)}</span></div>
            <div class="metric"><span class="metric-label">${this._t("Posicion en rango","Range Position")}</span><span class="metric-value">${r.pctPlain(Number(e.rangePosition||0)*100,1)}</span></div>
            <div class="metric"><span class="metric-label">${this._t("Inventario","Inventory")}</span><span class="metric-value">${r.pctPlain(Number(e.inventoryRatio||0)*100,1)}</span></div>
            <div class="metric"><span class="metric-label">${this._t("Objetivo / dia","Target / Day")}</span><span class="metric-value">${r.usd(Number(e.targetDailyUsdt||0),2)}</span></div>
          </div>

          ${this._renderCollapsedSummary(e)}

          <div class="actions" @click=${v=>v.stopPropagation()}>
            <button class="btn btn-ghost btn-sm" @click=${()=>this._checkStabilization(e)}>${this._t("Revisar estabilizacion","Check Stabilization")}</button>
            <button class="btn btn-warning btn-sm" @click=${()=>this._openRegrid(e)}>${this._t("Preview regrid","Preview Regrid")}</button>
            <button class="btn btn-danger btn-sm" @click=${()=>this._openClose(e)}>${this._t("Cerrar","Close")}</button>
          </div>
        </div>
        ${t?this._renderExpanded(e):""}
      </article>
    `}_renderRegridModal(){const e=this._regridCtx;if(!e?.miner)return"";const a=`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(`BYBIT:${e.miner.ticker}`)}&interval=240&theme=dark&style=1&locale=en&hide_top_toolbar=0&hide_side_toolbar=0&allow_symbol_change=1&drawings_access=all&save_image=1`,s=e.preview||{};return n`
      <div class="chart-overlay" @click=${l=>{l.target===l.currentTarget&&(this._regridCtx=null)}}>
        <div class="chart-modal">
          <div class="chart-left">
            <div class="chart-header">
              <div>
                <div class="ticker">${e.miner.ticker}</div>
                <div class="hint">4H · TradingView · validate the new range before regridding</div>
              </div>
              <button class="btn btn-ghost btn-sm" @click=${()=>this._regridCtx=null}>Close</button>
            </div>
            <iframe class="tv-frame" src="${a}"></iframe>
          </div>
          <div class="chart-right">
            <div class="exec-body">
              ${e.loading?n`<loading-view label="Building regrid preview"></loading-view>`:""}
              ${e.error?n`<error-view label="Regrid preview unavailable" .sub=${e.error}></error-view>`:""}
              ${!e.loading&&!e.error?n`
                <div class="exec-row"><span>Suggestion</span><span>${s.regridSuggestion||"—"}</span></div>
                <div class="exec-row"><span>Stabilization</span><span>${s.stabilizationState||"—"}</span></div>
                <div class="exec-row"><span>Range Break</span><span>${s.rangeBreakState||"—"}</span></div>
                <div class="exec-row"><span>Bottom</span><span>${s.regridCandidate?.bottom?r.usd(Number(s.regridCandidate.bottom),2):"—"}</span></div>
                <div class="exec-row"><span>Top</span><span>${s.regridCandidate?.top?r.usd(Number(s.regridCandidate.top),2):"—"}</span></div>
                <div class="exec-row"><span>Rows</span><span>${s.regridCandidate?.row||"—"}</span></div>
                <div class="mini-item"><strong>Reason</strong><br />${s.decisionReason||"No reason returned."}</div>
                ${(s.blockers||[]).length?n`
                  <div class="mini-item"><strong>Blockers</strong><br />${s.blockers.join(" · ")}</div>
                `:""}
                ${e.result?.ok?n`<div class="mini-item"><strong>Executed</strong><br />Regrid request sent to Pionex successfully.</div>`:""}
              `:""}
            </div>
            <div class="exec-actions">
              <button class="btn btn-ghost" @click=${()=>this._regridCtx=null}>Cancel</button>
              <button class="btn btn-warning" ?disabled=${!s.confirmationToken||e.loading||e.result?.ok} @click=${()=>this._executeRegrid()}>Apply Regrid</button>
            </div>
          </div>
        </div>
      </div>
    `}_renderLegacy(){if(this._loading)return n`<loading-view label="${this._t("Cargando mineros activos","Loading active miners")}"></loading-view>`;if(this._error)return n`<error-view label="${this._t("Mineros activos no disponibles","Active miners unavailable")}" .sub=${this._error}></error-view>`;const e=this._data?.summary||{},t=this._filteredMiners();return n`
      <div class="page">
        <div class="toolbar">
          <segmented-control
            .options=${[{value:"all",label:`${this._t("Todos","All")} (${this._data?.miners?.length||0})`},{value:"warnings",label:`${this._t("Alertas","Warnings")} (${e.warnings||0})`},{value:"danger",label:this._t("Críticos","Critical")}]}
            value=${this._filter}
            @change=${a=>this._setFilter(a.detail)}
          ></segmented-control>
          <button class="btn btn-ghost" @click=${()=>this._load()}>${this._t("Actualizar","Refresh")}</button>
        </div>

        <div class="hero">
          <div class="panel">
            <div class="panel-title">${this._t("KPIs de mineros","Miner KPIs")}</div>
            <div class="kpi-row">
              <stat-card label="${this._t("Mineros activos","Active Miners")}" value="${e.active||0}" accent="accent"></stat-card>
              <stat-card label="${this._t("Capital","Capital")}" value="${r.usd(Number(e.totalCapital||0),2)}" accent="neutral" mono></stat-card>
              <stat-card label="${this._t("PnL cierre","Close PnL")}" value="${r.pnl(Number(e.openPnl||0),2)}" accent="${Number(e.openPnl||0)>=0?"positive":"negative"}" mono></stat-card>
              <stat-card label="${this._t("PnL grid","Grid PnL")}" value="${r.pnl(Number(e.dailyPnl||0),2)}" accent="${Number(e.dailyPnl||0)>=0?"positive":"negative"}" mono></stat-card>
              <stat-card label="${this._t("Alertas","Warnings")}" value="${e.warnings||0}" accent="${e.warnings?"negative":"positive"}"></stat-card>
              <stat-card label="${this._t("Gap promedio","Avg Gap")}" value="${e.avgGridGap||"0.00"}%" accent="neutral" mono></stat-card>
            </div>
          </div>
          ${this._renderBalancePanel()}
        </div>

        <div class="miners-grid">
          ${t.map(a=>this._renderMinerCard(a))}
          ${t.length?"":n`<empty-view label="${this._t("No hay mineros para este filtro","No miners match this filter")}"></empty-view>`}
        </div>
      </div>

      ${this._closeCtx?n`
        <preview-execute-modal
          title="Close Miner"
          subtitle="${this._closeCtx.miner.ticker} · live Pionex close"
          domain="miners"
          .payload=${[{label:"Ticker",value:this._closeCtx.miner.ticker},{label:"BU Order",value:this._closeCtx.miner.buOrderId},{label:"Close PnL",value:r.pnl(Number(this._closeCtx.miner.openPnl||0),2),highlight:Number(this._closeCtx.miner.openPnl||0)<0?"danger":"pos"},{label:"Capital",value:r.usd(Number(this._closeCtx.miner.capital||0),2)}]}
          .warnings=${["This sends a real close instruction to Pionex.","The current close PnL will be realized immediately."]}
          dangerLevel="danger"
          confirmText="Close Position"
          .executeFn=${()=>this._executeClose()}
          @closed=${()=>{this._closeCtx=null}}
          @executed=${()=>{this._closeCtx=null}}
        ></preview-execute-modal>
      `:""}

      ${this._renderRegridModal()}
    `}render(){const e=this._hasLoadedOnce;if(this._loading&&!e)return n`<loading-view label="${this._t("Cargando mineros activos","Loading active miners")}"></loading-view>`;if(this._error&&!e)return n`<error-view label="${this._t("Mineros activos no disponibles","Active miners unavailable")}" .sub=${this._error}></error-view>`;const t=this._data?.summary||{},a=this._filteredMiners(),s=this._filterCounts(),l=this._heroSummary(),o=this._getRefreshPolicy(),d=Math.round(o.autoMs/1e3),v=this._manualRefreshRemaining();return n`
      <div class="page">
        <div class="toolbar">
          <div class="toolbar-left">
            <segmented-control
              .options=${[{value:"all",label:`${this._t("Todos","All")} (${s.all})`},{value:"warnings",label:`${this._t("Alertas","Warnings")} (${s.warnings})`},{value:"danger",label:`${this._t("Criticos","Critical")} (${s.danger})`}]}
              value=${this._filter}
              @change=${u=>this._setFilter(u.detail)}
            ></segmented-control>
            <div class="toolbar-note">
              ${this._t("Plan","Plan")}: ${this._planTier.toUpperCase()} · ${this._t("Auto refresh","Auto refresh")}: ${d}s
              ${o.manual?` · ${this._t("Manuales","Manuals")}: ${v}/${o.maxManual}`:""}
            </div>
          </div>
          <div class="toolbar-right">
            ${this._refreshing?n`<div class="toolbar-status">${this._t("Sincronizando en segundo plano","Syncing in background")}</div>`:""}
            ${this._error&&e?n`<div class="toolbar-note" style="color:var(--color-warning)">${this._error}</div>`:""}
            ${o.manual?n`<button class="btn btn-ghost" @click=${()=>this._load({manual:!0})}>${this._t("Actualizar","Refresh")}</button>`:""}
          </div>
        </div>

        <div class="hero">
          <div class="hero-main">
            <div class="hero-summary">
              <div class="hero-glance">
                <div class="hero-eyebrow">${this._t("Fleet status","Fleet status")}</div>
                <div class="hero-value">${t.active||0}</div>
                <div class="hero-sub">${this._t("mineros activos con capital desplegado","active miners with deployed capital")}</div>
                <div class="hero-pills">
                  <span class="hero-pill ok">${l.healthy} ${this._t("saludables","healthy")}</span>
                  <span class="hero-pill warn">${s.warnings} ${this._t("alertas","warnings")}</span>
                  <span class="hero-pill danger">${s.danger} ${this._t("criticos","critical")}</span>
                </div>
              </div>
              ${this._renderHeroLanes()}
            </div>

            <div class="panel">
              <div class="panel-title">${this._t("KPIs de mineros","Miner KPIs")}</div>
              <div class="kpi-row">
                <stat-card label="${this._t("Mineros activos","Active Miners")}" value="${t.active||0}" accent="accent"></stat-card>
                <stat-card label="${this._t("Capital desplegado","Deployed capital")}" value="${r.usd(Number(t.totalCapital||0),2)}" accent="neutral" mono></stat-card>
                <stat-card label="${this._t("PnL cierre","Close PnL")}" value="${r.pnl(Number(t.openPnl||0),2)}" accent="${Number(t.openPnl||0)>=0?"positive":"negative"}" mono></stat-card>
                <stat-card label="${this._t("Produccion grid","Grid production")}" value="${r.pnl(Number(t.dailyPnl||0),2)}" accent="${Number(t.dailyPnl||0)>=0?"positive":"negative"}" mono></stat-card>
                <stat-card label="${this._t("Objetivo diario","Daily target")}" value="${r.usd(Number(l.totalTarget||0),2)}" accent="accent" mono></stat-card>
                <stat-card label="${this._t("Inventario medio","Avg inventory")}" value="${r.pct(Number(l.avgInventory||0),2)}" accent="${l.avgInventory>.1?"negative":l.avgInventory>.05?"warning":"positive"}"></stat-card>
                <stat-card label="${this._t("Posicion media","Avg range pos")}" value="${r.pct(Number(l.avgRange||0),2)}" accent="neutral"></stat-card>
                <stat-card label="${this._t("Gap promedio","Avg gap")}" value="${t.avgGridGap||"0.00"}%" accent="neutral" mono></stat-card>
              </div>
            </div>
          </div>

          ${this._renderBalancePanel()}
        </div>

        <div class="miners-grid">
          ${M(a,u=>u.buOrderId||u.symbol||u.ticker,u=>this._renderMinerCardEnhanced(u))}
          ${a.length?"":n`<empty-view label="${this._t("No hay mineros para este filtro","No miners match this filter")}"></empty-view>`}
        </div>
      </div>

      ${this._closeCtx?n`
        <preview-execute-modal
          title="Close Miner"
          subtitle="${this._closeCtx.miner.ticker} · live Pionex close"
          domain="miners"
          .payload=${[{label:"Ticker",value:this._closeCtx.miner.ticker},{label:"BU Order",value:this._closeCtx.miner.buOrderId},{label:"Close PnL",value:r.pnl(Number(this._closeCtx.miner.openPnl||0),2),highlight:Number(this._closeCtx.miner.openPnl||0)<0?"danger":"pos"},{label:"Capital",value:r.usd(Number(this._closeCtx.miner.capital||0),2)}]}
          .warnings=${["This sends a real close instruction to Pionex.","The current close PnL will be realized immediately."]}
          dangerLevel="danger"
          confirmText="Close Position"
          .executeFn=${()=>this._executeClose()}
          @closed=${()=>{this._closeCtx=null}}
          @executed=${()=>{this._closeCtx=null}}
        ></preview-execute-modal>
      `:""}

      ${this._renderRegridModal()}
    `}}customElements.define("miners-view",O);
