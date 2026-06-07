import{k as d,i as y,b as x,t as _,a as w,n as h,l as n,e as l}from"./index-Bb1-_Ymx.js";import{c as $}from"./repeat-ByGDeUoN.js";import{d as g}from"./domain-state-mCFUKEFK.js";function o(a,e=0){const t=Number(a);return Number.isFinite(t)?t:e}function S(a){const e=String(a||"").toLowerCase();return e==="candidate"?"new":e==="watch"?"watching":e==="reject"||e==="no data"?"rejected":"watching"}function k(a){const e=a?.score,t=Number(e);return Number.isFinite(t)?t<=1?Math.round(t*100):Math.round(t):0}function C(a={}){const e=o(a.change14dPct,0),t=String(a.regime||"").toLowerCase();return{trend:t==="bull"?"bullish":t==="bear"?"bearish":"neutral",rsi:o(a.residency30d,0)*100,support:o(a.atlDistancePct,0),resistance:o(a.athDistancePct,0),change14d:e}}function M(a,e){const t=a?.metrics||{},s=String(a?.symbol||"").toUpperCase(),i=s.includes("_")?s:`${s.replace(/USDT$/,"")}USDT`;return{id:`${s}-${a?.configKey||e}`,symbol:s,ticker:i,configKey:a?.configKey||"",type:a?.workerTypeLabel||a?.workerType||"Worker",workerType:a?.workerType||"",status:S(a?.status),rawStatus:a?.status||"Watch",score:k(a),capitalRequired:o(a?.capital,0),leverage:o(a?.leverage,1),estimatedMonthly:o(t.gridDailyProfit,0)*30,estimatedAnnual:o(t.gridDailyProfit,0)*365,volatility30d:Math.abs(o(t.change30dPct,0)),fundingRate:0,volume24h:o(a?.activeNotional,0),technicalGate:C(t),notes:a?.decisionReason||"No decision note returned.",createdAt:Date.now()-e*1e3,metrics:t,minCoverage:o(a?.minCoverage,0),targetDailyUsdt:o(a?.targetDailyUsdt,1),orderParameters:a?.orderParameters||{}}}const p={async getCandidates({capital:a=175,universe:e="",source:t="pionex",targetDailyUsdt:s=1}={}){const i=new URLSearchParams({capital:String(a),source:t,targetDailyUsdt:String(s)});e&&i.set("universe",e);const r=await d(`/dashboard/opportunities?${i.toString()}`),c=Array.isArray(r?.opportunities)?r.opportunities:[];return{ok:!!r?.ok,summary:r?.summary||{},errors:Array.isArray(r?.errors)?r.errors:[],candidates:c.map((b,f)=>M(b,f))}},async previewCreate({symbol:a,configKey:e,capital:t,targetDailyUsdt:s=1,source:i="pionex"}){return d("/dashboard/opportunities/create-preview",{method:"POST",body:JSON.stringify({symbol:a,configKey:e,capital:t,targetDailyUsdt:s,source:i})})},async executeCreate({confirmationToken:a,symbol:e,configKey:t,capital:s,targetDailyUsdt:i=1,source:r="pionex"}){return d("/dashboard/opportunities/create",{method:"POST",body:JSON.stringify({confirmationToken:a,symbol:e,configKey:t,capital:s,targetDailyUsdt:i,source:r})})},async getTechnicalGate({symbol:a,configKey:e,capital:t,targetDailyUsdt:s=1,source:i="pionex"}){return d("/dashboard/opportunities/technical-gate",{method:"POST",body:JSON.stringify({symbol:a,configKey:e,capital:t,targetDailyUsdt:s,source:i})})}};function u(a){const e=String(a||"free").trim().toLowerCase();return e==="pro"||e==="premium"?e:"free"}function T(a,e){const t=u(a);return e[t]||e.free}function m(a,e,t=Date.now()){const s=(Array.isArray(a)?a:[]).filter(c=>Number.isFinite(c)&&t-c<e.windowMs),i=Math.max(0,e.maxManual-s.length),r=i>0||s.length===0?0:Math.max(0,e.windowMs-(t-s[0]));return{history:s,remaining:i,allowed:i>0,retryAfterMs:r}}function P(a,e,t=Date.now()){const s=m(a,e,t);return s.allowed?{history:[...s.history,t],remaining:Math.max(0,s.remaining-1),allowed:!0,retryAfterMs:0}:s}function R(a){return`${Math.max(1,Math.round(a/1e3))}s`}const v="opportunities",O={free:{maxManual:1,windowMs:3e4},pro:{maxManual:2,windowMs:15e3},premium:{maxManual:2,windowMs:1e4}};class A extends y{static properties={_candidates:{type:Array,state:!0},_summary:{type:Object,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_segment:{type:String,state:!0},_capital:{type:Number,state:!0},_selected:{type:Object,state:!0},_execStep:{type:String,state:!0},_execResult:{type:Object,state:!0},_technicalGate:{type:Object,state:!0},_refreshing:{type:Boolean,state:!0},_planTier:{type:String,state:!0},_refreshHits:{type:Array,state:!0}};static styles=[x,_,w`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .toolbar { display:flex; gap:var(--space-3); flex-wrap:wrap; align-items:center; justify-content:space-between; }
    .toolbar-left, .toolbar-right { display:flex; gap:var(--space-3); flex-wrap:wrap; align-items:center; }
    .toolbar-note { font-size: var(--text-xs); color: var(--color-text-muted); }
    .toolbar-note.live { color: var(--color-positive); }
    .kpi-row { display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--space-3); }
    .opps { display:flex; flex-direction:column; gap: var(--space-3); }
    .card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
      display:flex;
      flex-direction:column;
      gap: var(--space-3);
    }
    .card.candidate { border-left: 3px solid var(--color-positive); }
    .card.watching { border-left: 3px solid var(--color-warning); }
    .card.rejected { border-left: 3px solid var(--color-negative); opacity: 0.9; }
    .head { display:flex; justify-content:space-between; gap: var(--space-3); align-items:flex-start; }
    .ticker { font-size: var(--text-lg); font-weight: var(--weight-bold); }
    .meta { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 4px; }
    .status-chip {
      display:inline-flex; align-items:center; gap:6px; padding:4px 9px; border-radius:999px;
      font-size:11px; letter-spacing:0.08em; text-transform:uppercase;
    }
    .status-chip.candidate { background: var(--color-positive-dim); color: var(--color-positive); }
    .status-chip.watching { background: var(--color-warning-dim); color: var(--color-warning); }
    .status-chip.rejected { background: var(--color-negative-dim); color: var(--color-negative); }
    .score { font-size: 28px; font-weight: var(--weight-bold); }
    .score-label { font-size: 10px; color: var(--color-text-muted); letter-spacing: 0.08em; text-transform: uppercase; }
    .metrics { display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: var(--space-3); }
    .metric { display:flex; flex-direction:column; gap:2px; }
    .metric-label { font-size:10px; color:var(--color-text-muted); letter-spacing:0.08em; text-transform:uppercase; }
    .metric-value {
      font-size: var(--text-sm);
    }
    .metric-value.pos { color: var(--color-positive); }
    .metric-value.neg { color: var(--color-negative); }
    .gate {
      display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-2);
      padding: var(--space-3);
      border-radius: var(--radius-md);
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-subtle);
    }
    .gate-item { font-size: var(--text-xs); color: var(--color-text-secondary); }
    .gate-item strong { color: var(--color-text-primary); }
    .notes { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.5; }
    .actions { display:flex; gap: var(--space-2); flex-wrap:wrap; }
    .actions .btn { flex:1; min-width: 0; }
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.88);
      display:flex; align-items:center; justify-content:center; z-index:220; padding:16px;
    }
    .modal {
      width: min(1100px, 96vw);
      max-height: 90vh;
      overflow: hidden;
      display:grid;
      grid-template-columns: 1.4fr 0.9fr;
      background: var(--color-bg-panel);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-xl);
    }
    .modal-left { border-right: 1px solid var(--color-border-subtle); min-height: 520px; }
    .modal-right { display:flex; flex-direction:column; }
    .modal-header {
      display:flex; justify-content:space-between; gap: var(--space-3); align-items:center;
      padding: 12px 16px; border-bottom: 1px solid var(--color-border-subtle); background: var(--color-bg-card);
    }
    .tv-frame { width:100%; height:100%; min-height:520px; border:none; }
    .panel-body { padding: 18px; display:flex; flex-direction:column; gap: 14px; overflow-y:auto; }
    .exec-row { display:flex; justify-content:space-between; gap:12px; font-size: var(--text-sm); padding-bottom:8px; border-bottom:1px solid var(--color-border-subtle); }
    .callout {
      padding: 12px 14px; border-radius: var(--radius-md);
      background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle);
      font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.55;
    }
    .callout strong { color: var(--color-text-primary); }
    .checks { display:flex; flex-direction:column; gap:8px; }
    .check {
      padding: 10px 12px; border-radius: var(--radius-md);
      background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle);
      font-size: var(--text-xs); color: var(--color-text-secondary);
    }
    .check.pass { border-color: rgba(34,211,160,0.28); }
    .check.warn { border-color: rgba(245,166,35,0.28); }
    .check.fail { border-color: rgba(240,74,94,0.28); }
    .exec-actions { display:flex; gap:8px; padding: 14px 18px; border-top:1px solid var(--color-border-subtle); }
    .exec-actions .btn { flex:1; }
    @media (max-width: 900px) {
      .modal { grid-template-columns: 1fr; }
      .modal-left { min-height: 280px; border-right: 0; border-bottom: 1px solid var(--color-border-subtle); }
      .tv-frame { min-height: 280px; }
    }
  `];constructor(){super();const e=g.load(v);this._candidates=[],this._summary={},this._loading=!0,this._error="",this._segment=e.segment||"all",this._capital=Number(e.capital)||175,this._selected=null,this._execStep="preview",this._execResult=null,this._technicalGate=null,this._refreshing=!1,this._planTier=u(h.getCachedSettings().planTier),this._refreshHits=[],this._hasLoadedOnce=!1}connectedCallback(){super.connectedCallback(),this._load(),this._syncPlanTier()}_persist(){g.save(v,{segment:this._segment,capital:this._capital})}async _syncPlanTier(){try{const e=await h.getSettings();this._planTier=u(e?.planTier)}catch{this._planTier=u(h.getCachedSettings().planTier)}}_refreshPolicy(){return T(this._planTier,O)}_refreshWindowState(){return m(this._refreshHits,this._refreshPolicy())}_refreshHint(e=m(this._refreshHits,this._refreshPolicy())){const t=this._refreshPolicy();return`${this._planTier.toUpperCase()} · manual ${t.maxManual}/${t.maxManual} · ventana ${R(t.windowMs)} · disponibles ${e.remaining}`}async _load({silent:e=!1}={}){e&&this._hasLoadedOnce?this._refreshing=!0:this._loading=!0,this._error="";try{const t=await p.getCandidates({capital:this._capital});this._candidates=Array.isArray(t.candidates)?t.candidates:[],this._summary=t.summary||{},this._hasLoadedOnce=!0}catch(t){this._error=t?.data?.detail||t?.message||"Could not load opportunities.",this._hasLoadedOnce||(this._candidates=[],this._summary={})}finally{this._loading=!1,this._refreshing=!1}}async _refreshManually(){const e=this._refreshPolicy(),t=P(this._refreshHits,e);if(this._refreshHits=t.history,!t.allowed){const s=Math.max(1,Math.ceil(t.retryAfterMs/1e3));window.toast?.(`Refresh disponible en ${s}s.`,{type:"warning"}),this.requestUpdate();return}await this._load({silent:!0})}_setSegment(e){this._segment=e,this._persist()}_filtered(){return this._segment==="all"?this._candidates:this._candidates.filter(e=>e.status===this._segment)}_scoreColor(e){return e>=80?"var(--color-positive)":e>=60?"var(--color-accent)":e>=40?"var(--color-warning)":"var(--color-negative)"}async _openModal(e){this._selected=e,this._execStep="preview",this._execResult=null,this._technicalGate=null;try{this._technicalGate=await p.getTechnicalGate({symbol:e.symbol,configKey:e.configKey,capital:this._capital,targetDailyUsdt:e.targetDailyUsdt||1})}catch{this._technicalGate=null}}_closeModal(){this._selected=null,this._execStep="preview",this._execResult=null,this._technicalGate=null}async _executeCreate(){const e=this._selected;if(e){this._execStep="executing";try{const t=await p.previewCreate({symbol:e.symbol,configKey:e.configKey,capital:this._capital,targetDailyUsdt:e.targetDailyUsdt||1});if(!t?.canCreate||!t?.confirmationToken){this._execResult={success:!1,message:(t?.blockers||["Opportunity is blocked"]).join(" · ")},this._execStep="done";return}const s=await p.executeCreate({confirmationToken:t.confirmationToken,symbol:e.symbol,configKey:e.configKey,capital:this._capital,targetDailyUsdt:e.targetDailyUsdt||1});this._execResult={success:!!s?.pionex_created,message:s?.pionex_created?`${e.ticker} miner created. BU ${s?.bu_order_id||"created"}.`:s?.error_message||"Create request failed."},this._execStep="done",s?.pionex_created?(window.toast?.(`${e.ticker} miner created`,{type:"success"}),await this._load()):window.toast?.(this._execResult.message,{type:"error"})}catch(t){this._execResult={success:!1,message:t?.data?.detail||t?.message||"Create request failed."},this._execStep="done",window.toast?.(this._execResult.message,{type:"error"})}}}_renderCandidate(e){return l`
      <article class="card ${e.status}">
        <div class="head">
          <div>
            <div class="ticker num-ui-strong">${e.ticker}</div>
            <div class="meta">${e.type} · ${n.leverage(e.leverage)} · ${e.rawStatus}</div>
          </div>
          <div style="text-align:right">
            <div class="score num-ui-strong" style="color:${this._scoreColor(e.score)}">${e.score}</div>
            <div class="score-label">Score</div>
          </div>
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span class="status-chip ${e.status}">${e.rawStatus}</span>
          <span class="status-chip ${e.status}">${e.configKey}</span>
        </div>

        <div class="metrics">
          <div class="metric"><span class="metric-label">Capital</span><span class="metric-value num-ui">${n.usd(e.capitalRequired,2)}</span></div>
          <div class="metric"><span class="metric-label">Est. monthly</span><span class="metric-value num-ui pos">${n.pnl(e.estimatedMonthly,2)}</span></div>
          <div class="metric"><span class="metric-label">Vol 30d</span><span class="metric-value num-ui">${n.pctPlain(e.volatility30d,2)}</span></div>
          <div class="metric"><span class="metric-label">Notional</span><span class="metric-value num-ui">${n.compact(e.volume24h)}</span></div>
          <div class="metric"><span class="metric-label">Coverage min</span><span class="metric-value num-ui">${e.minCoverage.toFixed(2)}x</span></div>
          <div class="metric"><span class="metric-label">Target/day</span><span class="metric-value num-ui">${n.usd(e.targetDailyUsdt,2)}</span></div>
        </div>

        <div class="gate">
          <div class="gate-item"><strong>Trend:</strong> ${e.technicalGate?.trend||"-"}</div>
          <div class="gate-item"><strong>Residency 30d:</strong> ${n.pctPlain((e.metrics?.rangePosition30D||0)*100,1)}</div>
          <div class="gate-item"><strong>Stress close:</strong> ${n.pnl(e.metrics?.expectedClosePnlAfter1PctAdverse||0,2)}</div>
          <div class="gate-item"><strong>Coverage:</strong> ${Number(e.metrics?.coverage1Pct||0).toFixed(2)}x</div>
        </div>

        <div class="notes">${e.notes}</div>

        <div class="actions">
          <button class="btn btn-ghost" @click=${()=>this._openModal(e)}>Technical Gate</button>
          <button class="btn btn-primary" ?disabled=${e.rawStatus!=="Candidate"} @click=${()=>this._openModal(e)}>Create Miner</button>
        </div>
      </article>
    `}_renderModal(){const e=this._selected;if(!e)return"";const s=`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(`BYBIT:${e.ticker}`)}&interval=240&theme=dark&style=1&locale=en&hide_top_toolbar=0&hide_side_toolbar=0&allow_symbol_change=1&drawings_access=all&save_image=1`;return l`
      <div class="modal-overlay" @click=${i=>{i.target===i.currentTarget&&this._closeModal()}}>
        <div class="modal">
          <div class="modal-left">
            <div class="modal-header">
              <div>
                <div class="ticker">${e.ticker}</div>
                <div class="meta">4H · Bybit Perpetual · execution context</div>
              </div>
              <button class="btn btn-ghost btn-sm" @click=${()=>this._closeModal()}>Close</button>
            </div>
            <iframe class="tv-frame" src="${s}"></iframe>
          </div>
          <div class="modal-right">
            <div class="modal-header">
              <div>
                <div class="ticker">Opportunity Execution</div>
                <div class="meta">${e.type} · ${e.rawStatus}</div>
              </div>
            </div>
            ${this._execStep==="done"?l`
              <div class="panel-body">
                <div class="callout"><strong>${this._execResult?.success?"Success":"Failed"}</strong><br />${this._execResult?.message||"No result message."}</div>
              </div>
              <div class="exec-actions">
                <button class="btn btn-ghost" @click=${()=>this._closeModal()}>Close</button>
              </div>
            `:this._execStep==="executing"?l`
              <div class="panel-body">
                <loading-view label="Creating miner"></loading-view>
              </div>
            `:l`
              <div class="panel-body">
                <div class="exec-row"><span>Ticker</span><span class="num-ui">${e.ticker}</span></div>
                <div class="exec-row"><span>Config</span><span class="num-ui">${e.configKey}</span></div>
                <div class="exec-row"><span>Capital</span><span class="num-ui">${n.usd(this._capital,2)}</span></div>
                <div class="exec-row"><span>Leverage</span><span class="num-ui">${n.leverage(e.leverage)}</span></div>
                <div class="exec-row"><span>Monthly est.</span><span class="num-ui">${n.pnl(e.estimatedMonthly,2)}</span></div>
                <div class="exec-row"><span>Stress close</span><span class="num-ui">${n.pnl(e.metrics?.expectedClosePnlAfter1PctAdverse||0,2)}</span></div>
                <div class="callout">
                  <strong>Decision:</strong> ${e.notes}
                </div>
                ${this._technicalGate?l`
                  <div class="callout">
                    <strong>Technical Gate:</strong> ${this._technicalGate.recommendation} · ${this._technicalGate.score}/100
                    <br />${this._technicalGate.summary}
                  </div>
                  <div class="checks">
                    ${(this._technicalGate.checks||[]).slice(0,5).map(i=>l`
                      <div class="check ${String(i.status||"").toLowerCase()}">
                        <strong>${i.name}</strong><br />${i.detail}
                      </div>
                    `)}
                  </div>
                `:""}
              </div>
              <div class="exec-actions">
                <button class="btn btn-ghost" @click=${()=>this._closeModal()}>Cancel</button>
                <button class="btn btn-primary" ?disabled=${e.rawStatus!=="Candidate"} @click=${()=>this._executeCreate()}>Create Miner</button>
              </div>
            `}
          </div>
        </div>
      </div>
    `}render(){if(this._loading)return l`<loading-view label="Loading opportunities"></loading-view>`;if(this._error)return l`<error-view label="Opportunities unavailable" .sub=${this._error}></error-view>`;const e={new:0,watching:0,rejected:0};this._candidates.forEach(r=>{e[r.status]=(e[r.status]||0)+1});const t=this._filtered(),s=this._summary||{},i=this._refreshWindowState();return l`
      <div class="page">
        <div class="toolbar">
          <div class="toolbar-left">
            <segmented-control
              .options=${[{value:"all",label:`All (${this._candidates.length})`},{value:"new",label:`Candidates (${e.new||0})`},{value:"watching",label:`Watch (${e.watching||0})`},{value:"rejected",label:`Rejected (${e.rejected||0})`}]}
              value=${this._segment}
              @change=${r=>this._setSegment(r.detail)}
            ></segmented-control>
          </div>
          <div class="toolbar-right">
            <span class="toolbar-note ${this._refreshing?"live":""}">
              ${this._refreshing?"Sincronizando...":this._refreshHint(i)}
            </span>
            <button
              class="btn btn-ghost"
              ?disabled=${this._refreshing||!i.allowed}
              @click=${()=>this._refreshManually()}
            >
              Refresh
            </button>
            <label class="toolbar-note">Capital per miner</label>
            <input
              class="input"
              style="max-width:140px"
              type="number"
              min="1"
              step="1"
              .value=${String(this._capital)}
              @change=${r=>{this._capital=Number(r.target.value)||175,this._persist(),this._load({silent:this._hasLoadedOnce})}}
            />
          </div>
        </div>

        <div class="kpi-row">
          <stat-card label="Candidates" value="${s.candidatesCount||0}" accent="positive"></stat-card>
          <stat-card label="Watch" value="${s.watchCount||0}" accent="warning"></stat-card>
          <stat-card label="Rejected" value="${s.rejectedCount||0}" accent="negative"></stat-card>
          <stat-card label="Universe" value="${s.universeCount||0}" accent="neutral"></stat-card>
          <stat-card label="Best symbol" value="${s.bestSymbol||"-"}" accent="accent" mono></stat-card>
          <stat-card label="Capital assumed" value="${n.usd(s.capitalAssumed||this._capital,2)}" accent="neutral" mono></stat-card>
        </div>

        <div class="opps">
          ${$(t,r=>r.id,r=>this._renderCandidate(r))}
          ${t.length?"":l`<empty-view label="No opportunities in this segment"></empty-view>`}
        </div>
      </div>
      ${this._renderModal()}
    `}}customElements.define("opportunities-view",A);
