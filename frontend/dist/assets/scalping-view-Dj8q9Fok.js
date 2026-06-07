import{i as l,b as n,a as d,g as r,l as e,e as s}from"./index-BdK4FrM0.js";import{d as i}from"./domain-state-DjGkhkio.js";const c={config:{mode:"futures",riskPerTrade:1.5,leverage:10,dailyTargetMin:150,dailyTargetMax:400,capitalAllocated:8500},stats:{todayPnl:187.4,todayTrades:12,winRate:66.7,dailyProgress:52.1,weeklyPnl:842.2,avgWin:48.3,avgLoss:-24.1,sharpeRatio:1.84},signals:[{id:"s1",ticker:"BTCUSDT",direction:"LONG",strength:"strong",entry:43820,sl:43580,tp:44240,rr:1.9,timeframe:"5m",confidence:84,ts:Date.now()-12e4},{id:"s2",ticker:"ETHUSDT",direction:"SHORT",strength:"medium",entry:2315,sl:2335,tp:2278,rr:1.85,timeframe:"15m",confidence:71,ts:Date.now()-3e5},{id:"s3",ticker:"SOLUSDT",direction:"LONG",strength:"weak",entry:101.2,sl:99.8,tp:103.8,rr:1.86,timeframe:"5m",confidence:58,ts:Date.now()-48e4}],monitors:[{ticker:"BTCUSDT",pnl:92.4,status:"active",leverage:10,size:850,entry:43200,current:43820},{ticker:"ETHUSDT",pnl:45.8,status:"active",leverage:10,size:500,entry:2265,current:2315}],journal:[{id:"j1",date:"2024-06-04",ticker:"BTCUSDT",direction:"LONG",pnl:148.2,notes:"Clean break of 43k resistance. Executed well."},{id:"j2",date:"2024-06-04",ticker:"SOLUSDT",direction:"SHORT",pnl:-48.1,notes:"Stopped out. Failed breakdown — momentum reversed."},{id:"j3",date:"2024-06-03",ticker:"ETHUSDT",direction:"LONG",pnl:212.8,notes:"EMA bounce + volume confirmation. Held for full target."}]},o="scalping";class v extends l{static properties={_data:{type:Object,state:!0},_mode:{type:String,state:!0},_tab:{type:String,state:!0},_lang:{type:String,state:!0}};static styles=[n,d`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-5); }
    .top-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--space-3); }
    .two-col { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-4); }
    @media (max-width: 1000px) { .two-col { grid-template-columns: 1fr; } }
    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-4); display: flex; align-items: center; justify-content: space-between; }
    .signal-card {
      display: flex; align-items: center; gap: var(--space-4);
      padding: var(--space-3); background: var(--color-bg-elevated);
      border-radius: var(--radius-md); margin-bottom: var(--space-2);
      border-left: 3px solid transparent;
    }
    .signal-card.strong { border-left-color: var(--color-positive); }
    .signal-card.medium { border-left-color: var(--color-warning); }
    .signal-card.weak { border-left-color: var(--color-idle); }
    .sig-dir { font-size: var(--text-xs); font-weight: var(--weight-bold); padding: 3px 8px; border-radius: var(--radius-sm); letter-spacing: 0.08em; }
    .sig-dir.long { background: var(--color-positive-dim); color: var(--color-positive); }
    .sig-dir.short { background: var(--color-negative-dim); color: var(--color-negative); }
    .sig-ticker { font-size: var(--text-md); font-weight: var(--weight-semibold); font-family: var(--font-mono); }
    .sig-meta { font-size: var(--text-xs); color: var(--color-text-muted); }
    .sig-levels { display: flex; gap: var(--space-4); margin-left: auto; font-size: var(--text-xs); font-family: var(--font-mono); }
    .sig-level-item { display: flex; flex-direction: column; gap: 2px; align-items: flex-end; }
    .sig-level-label { color: var(--color-text-muted); }
    .sig-rr { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-accent); min-width: 40px; text-align: right; }
    .sig-confidence { font-size: var(--text-xs); color: var(--color-text-muted); min-width: 60px; text-align: right; }
    .config-fields { display: flex; flex-direction: column; gap: var(--space-3); }
    .field-row { display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border-subtle); }
    .field-row:last-child { border-bottom: none; }
    .field-label { font-size: var(--text-sm); color: var(--color-text-secondary); }
    .field-val { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .monitor-row { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3); background: var(--color-bg-elevated); border-radius: var(--radius-md); margin-bottom: var(--space-2); }
    .mon-ticker { font-family: var(--font-mono); font-weight: var(--weight-semibold); width: 80px; }
    .mon-pnl { font-family: var(--font-mono); font-weight: var(--weight-semibold); }
    .mon-actions { margin-left: auto; display: flex; gap: var(--space-2); }
    .journal-row { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-3); border-bottom: 1px solid var(--color-border-subtle); }
    .journal-row:last-child { border-bottom: none; }
    .jour-date { font-size: var(--text-xs); color: var(--color-text-muted); min-width: 70px; }
    .jour-body { flex: 1; font-size: var(--text-sm); }
    .jour-pnl { font-family: var(--font-mono); font-weight: var(--weight-semibold); min-width: 80px; text-align: right; }
    .daily-progress { padding: var(--space-3); background: var(--color-bg-elevated); border-radius: var(--radius-md); margin-bottom: var(--space-4); }
    .dp-header { display: flex; justify-content: space-between; margin-bottom: var(--space-2); font-size: var(--text-sm); }
    .dp-range { font-size: var(--text-xs); color: var(--color-text-muted); }
    .scan-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--color-border-subtle); margin-bottom: var(--space-3); }
    .scan-tab { padding: var(--space-2) var(--space-3); font-size: var(--text-xs); font-weight: var(--weight-medium); color: var(--color-text-muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all var(--transition-fast); }
    .scan-tab.active { color: var(--color-accent); border-bottom-color: var(--color-accent); }
    .scan-tab:hover { color: var(--color-text-secondary); }
  `];constructor(){super(),this._data=c;const a=i.load(o);this._mode=a.mode||"futures",this._tab=a.tab||"signals",this._lang=r()}connectedCallback(){super.connectedCallback(),this._localeListener=()=>{this._lang=r(),this.requestUpdate()},window.addEventListener("capintel-locale-changed",this._localeListener)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-locale-changed",this._localeListener)}_t(a,t){return this._lang==="en"?t:a}_setMode(a){this._mode=a,i.save(o,{mode:a,tab:this._tab})}_setTab(a){this._tab=a,i.save(o,{mode:this._mode,tab:a})}_renderSignals(){return s`
      <div class="panel">
        <div class="panel-title">
          ${this._t("Señales de escaneo","Scan Signals")}
          <segmented-control
            .options=${[{value:"futures",label:"Futures"},{value:"spot",label:"Spot"}]}
            value=${this._mode}
            @change=${a=>this._setMode(a.detail)}
          ></segmented-control>
        </div>
        <div class="scan-tabs">
          <div class="scan-tab ${this._tab==="signals"?"active":""}" @click=${()=>this._setTab("signals")}>${this._t("Señales en vivo","Live Signals")}</div>
          <div class="scan-tab ${this._tab==="monitors"?"active":""}" @click=${()=>this._setTab("monitors")}>${this._t("Monitores activos","Active Monitors")}</div>
          <div class="scan-tab ${this._tab==="journal"?"active":""}" @click=${()=>this._setTab("journal")}>${this._t("Bitácora","Trade Journal")}</div>
        </div>

        ${this._tab==="signals"?this._data.signals.map(a=>s`
          <div class="signal-card ${a.strength}">
            <span class="sig-dir ${a.direction.toLowerCase()}">${a.direction}</span>
            <div>
              <div class="sig-ticker">${a.ticker}</div>
              <div class="sig-meta">${a.timeframe} · ${e.datetime(a.ts)}</div>
            </div>
            <div class="sig-levels">
              <div class="sig-level-item"><span class="sig-level-label">${this._t("Entrada","Entry")}</span><span>${e.number(a.entry,2)}</span></div>
              <div class="sig-level-item"><span class="sig-level-label">SL</span><span style="color:var(--color-negative)">${e.number(a.sl,2)}</span></div>
              <div class="sig-level-item"><span class="sig-level-label">TP</span><span style="color:var(--color-positive)">${e.number(a.tp,2)}</span></div>
            </div>
            <div><div class="sig-rr">R:R ${a.rr}</div><div class="sig-confidence">${a.confidence}% ${this._t("conf.","conf")}</div></div>
          </div>
        `):""}

        ${this._tab==="monitors"?this._data.monitors.map(a=>s`
          <div class="monitor-row">
            <span class="mon-ticker">${a.ticker}</span>
            <span class="mon-pnl" style="color:${a.pnl>=0?"var(--color-positive)":"var(--color-negative)"}">${e.pnl(a.pnl)}</span>
            <div class="mon-actions">
              <button class="btn btn-ghost btn-sm">${this._t("Cerrar TP","Close TP")}</button>
              <button class="btn btn-danger btn-sm">${this._t("Detener","Stop")}</button>
            </div>
          </div>
        `):""}

        ${this._tab==="journal"?this._data.journal.map(a=>s`
          <div class="journal-row">
            <span class="jour-date">${a.date}</span>
            <div class="jour-body">
              <div style="font-size:var(--text-xs);font-weight:var(--weight-semibold);margin-bottom:2px">${a.ticker} · ${a.direction}</div>
              <div style="font-size:var(--text-xs);color:var(--color-text-muted)">${a.notes}</div>
            </div>
            <span class="jour-pnl" style="color:${a.pnl>=0?"var(--color-positive)":"var(--color-negative)"}">${e.pnl(a.pnl)}</span>
          </div>
        `):""}
      </div>
    `}render(){const a=this._data.stats,t=this._data.config;return s`
      <div class="page">
        <div class="top-row">
          <stat-card label="${this._t("PnL de hoy","Today PnL")}" value="${e.pnl(a.todayPnl)}" accent="positive" mono></stat-card>
          <stat-card label="${this._t("Trades de hoy","Today Trades")}" value="${a.todayTrades}" accent="neutral"></stat-card>
          <stat-card label="${this._t("Win rate","Win Rate")}" value="${a.winRate.toFixed(1)}%" accent="${a.winRate>55?"positive":"warning"}" mono></stat-card>
          <stat-card label="${this._t("PnL semanal","Weekly PnL")}" value="${e.pnl(a.weeklyPnl)}" accent="positive" mono></stat-card>
          <stat-card label="Sharpe" value="${a.sharpeRatio.toFixed(2)}" accent="accent" mono></stat-card>
          <stat-card label="${this._t("Ganancia media","Avg Win")}" value="${e.pnl(a.avgWin)}" accent="positive" mono></stat-card>
        </div>

        <div class="daily-progress">
          <div class="dp-header">
            <span style="font-size:var(--text-sm);font-weight:var(--weight-semibold)">${this._t("Progreso objetivo diario","Daily Target Progress")}</span>
            <span style="font-family:var(--font-mono);color:var(--color-positive)">${e.pnl(a.todayPnl)}</span>
          </div>
          <progress-bar value=${a.dailyProgress} color="var(--color-positive)" height="8" showPct></progress-bar>
          <div class="dp-range">${this._t("Rango objetivo","Target range")}: ${e.usd(t.dailyTargetMin)} - ${e.usd(t.dailyTargetMax)}</div>
        </div>

        <div class="two-col">
          ${this._renderSignals()}
          <div class="panel">
            <div class="panel-title">${this._t("Configuración","Configuration")}</div>
            <div class="config-fields">
              <div class="field-row"><span class="field-label">${this._t("Modo","Mode")}</span><span class="field-val">${t.mode.toUpperCase()}</span></div>
              <div class="field-row"><span class="field-label">${this._t("Riesgo / trade","Risk / Trade")}</span><span class="field-val">${t.riskPerTrade}%</span></div>
              <div class="field-row"><span class="field-label">${this._t("Apalancamiento","Leverage")}</span><span class="field-val">${e.leverage(t.leverage)}</span></div>
              <div class="field-row"><span class="field-label">${this._t("Capital","Capital")}</span><span class="field-val">${e.usd(t.capitalAllocated)}</span></div>
              <div class="field-row"><span class="field-label">${this._t("Objetivo diario","Daily Target")}</span><span class="field-val">${e.usd(t.dailyTargetMin)} - ${e.usd(t.dailyTargetMax)}</span></div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("scalping-view",v);
