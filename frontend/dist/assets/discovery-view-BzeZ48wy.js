import{i as l,b as c,a as d,g as o,l as r,e as s}from"./index-Bb1-_Ymx.js";import{d as i}from"./domain-state-mCFUKEFK.js";const h={universe:[{ticker:"SOLUSDT",vol24h:428e7,trades24h:1842e3,volatility:82,fundingRate:-.008,trend:"bullish",segment:"promote"},{ticker:"ARBUSDT",vol24h:62e7,trades24h:38e4,volatility:74,fundingRate:-.005,trend:"bullish",segment:"promote"},{ticker:"NEARUSDT",vol24h:38e7,trades24h:21e4,volatility:68,fundingRate:.003,trend:"neutral",segment:"watch"},{ticker:"INJUSDT",vol24h:52e7,trades24h:29e4,volatility:91,fundingRate:-.012,trend:"bullish",segment:"watch"},{ticker:"SUIUSDT",vol24h:41e7,trades24h:24e4,volatility:88,fundingRate:-.009,trend:"bullish",segment:"watch"},{ticker:"OPUSDT",vol24h:18e7,trades24h:98e3,volatility:38,fundingRate:.012,trend:"bearish",segment:"rejected"},{ticker:"FTMUSDT",vol24h:145e6,trades24h:72e3,volatility:42,fundingRate:.008,trend:"neutral",segment:"rejected"},{ticker:"BLURUSDT",vol24h:82e6,trades24h:45e3,volatility:68,fundingRate:.015,trend:"bearish",segment:"rejected"}],filters:{minVol24h:1e8,minTrades24h:5e4,minVolatility:40,segments:["promote","watch","rejected"]}},n="discovery";class v extends l{static properties={_data:{type:Object,state:!0},_segment:{type:String,state:!0},_search:{type:String,state:!0},_lang:{type:String,state:!0}};static styles=[c,d`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-5); }
    .toolbar { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
    .search-input { padding: var(--space-2) var(--space-3); flex: 1; max-width: 280px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-3); }
    .symbol-card {
      background: var(--color-bg-card); border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg); padding: var(--card-padding);
      transition: all var(--transition-fast);
    }
    .symbol-card:hover { border-color: var(--color-border-default); }
    .symbol-card.promote { border-left: 3px solid var(--color-accent); }
    .symbol-card.watch { border-left: 3px solid var(--color-warning); }
    .symbol-card.rejected { border-left: 3px solid var(--color-idle); opacity: 0.6; }
    .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); }
    .sym-name { font-size: var(--text-lg); font-weight: var(--weight-bold); font-family: var(--font-mono); }
    .trend-badge { font-size: var(--text-xs); padding: 2px 7px; border-radius: var(--radius-sm); font-weight: var(--weight-semibold); }
    .trend-bullish { background: var(--color-positive-dim); color: var(--color-positive); }
    .trend-bearish { background: var(--color-negative-dim); color: var(--color-negative); }
    .trend-neutral { background: var(--color-idle-dim); color: var(--color-idle); }
    .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); margin-bottom: var(--space-3); }
    .met { display: flex; flex-direction: column; gap: 2px; }
    .met-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    .met-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .met-value.good { color: var(--color-positive); }
    .met-value.bad { color: var(--color-negative); }
    .card-actions { display: flex; gap: var(--space-2); }
    .card-actions button { flex: 1; }
  `];constructor(){super(),this._data=h;const e=i.load(n);this._segment=e.segment||"all",this._search=e.search||"",this._lang=o()}connectedCallback(){super.connectedCallback(),this._localeListener=()=>{this._lang=o(),this.requestUpdate()},window.addEventListener("capintel-locale-changed",this._localeListener)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-locale-changed",this._localeListener)}_t(e,t){return this._lang==="en"?t:e}_setSegment(e){this._segment=e,i.save(n,{segment:e,search:this._search})}_setSearch(e){this._search=e,i.save(n,{segment:this._segment,search:e})}_filtered(){let e=this._data.universe;return this._segment!=="all"&&(e=e.filter(t=>t.segment===this._segment)),this._search&&(e=e.filter(t=>t.ticker.toLowerCase().includes(this._search.toLowerCase()))),e}_trendLabel(e){return e==="bullish"?this._t("alcista","bullish"):e==="bearish"?this._t("bajista","bearish"):this._t("neutral","neutral")}_renderCard(e){return s`
      <div class="symbol-card ${e.segment}">
        <div class="card-header">
          <span class="sym-name">${e.ticker}</span>
          <span class="trend-badge trend-${e.trend}">${this._trendLabel(e.trend)}</span>
        </div>
        <div class="metrics">
          <div class="met"><span class="met-label">${this._t("Vol 24h","24h Vol")}</span><span class="met-value">${r.compact(e.vol24h)}</span></div>
          <div class="met"><span class="met-label">${this._t("Trades 24h","24h Trades")}</span><span class="met-value">${r.number(e.trades24h/1e3,0)}K</span></div>
          <div class="met"><span class="met-label">${this._t("Volatilidad","Volatility")}</span><span class="met-value ${e.volatility>60?"good":""}">${e.volatility}%</span></div>
          <div class="met"><span class="met-label">Funding</span><span class="met-value ${e.fundingRate<0?"good":"bad"}">${r.number(e.fundingRate*100,3)}%</span></div>
        </div>
        ${e.segment!=="rejected"?s`
          <div class="card-actions">
            ${e.segment==="watch"?s`
              <button class="btn btn-ghost btn-sm" @click=${()=>window.toast?.(this._t(`${e.ticker} sigue en observación`,`${e.ticker} kept in watch list`),{type:"info"})}>
                ${this._t("Seguir observando","Keep Watching")}
              </button>
            `:""}
            <button class="btn btn-primary btn-sm" @click=${()=>window.toast?.(this._t(`${e.ticker} promovido a Oportunidades`,`${e.ticker} promoted to Opportunities`),{type:"success"})}>
              ${this._t("Promover ->","Promote ->")}
            </button>
          </div>
        `:s`
          <div class="card-actions">
            <button class="btn btn-ghost btn-sm" @click=${()=>window.toast?.(this._t(`${e.ticker} movido a observación`,`${e.ticker} moved to watch list`),{type:"info"})}>
              ${this._t("Reconsiderar","Reconsider")}
            </button>
          </div>
        `}
      </div>
    `}render(){const e=this._filtered(),t={promote:0,watch:0,rejected:0};return this._data.universe.forEach(a=>{t[a.segment]=(t[a.segment]||0)+1}),s`
      <div class="page">
        <div class="toolbar">
          <segmented-control
            .options=${[{value:"all",label:`${this._t("Universo","Universe")} (${this._data.universe.length})`},{value:"promote",label:`${this._t("Promover","Promote")} (${t.promote||0})`},{value:"watch",label:`${this._t("Observando","Watching")} (${t.watch||0})`},{value:"rejected",label:`${this._t("Descartados","Rejected")} (${t.rejected||0})`}]}
            value=${this._segment}
            @change=${a=>this._setSegment(a.detail)}
          ></segmented-control>
          <input
            class="search-input"
            type="search"
            placeholder=${this._t("Buscar ticker...","Search ticker...")}
            .value=${this._search}
            @input=${a=>this._setSearch(a.target.value)}
          />
          <button class="btn btn-ghost" @click=${()=>window.toast?.(this._t("Escaneo del universo lanzado","Universe scan triggered"),{type:"info"})}>
            ↻ ${this._t("Escanear universo","Scan Universe")}
          </button>
        </div>
        <div class="grid">
          ${e.map(a=>this._renderCard(a))}
          ${e.length===0?s`<empty-view label="${this._t("No hay símbolos que coincidan con tus filtros","No symbols match your filters")}"></empty-view>`:""}
        </div>
      </div>
    `}}customElements.define("discovery-view",v);
