import{k as c,i as h,b,a as x,l as r,e as l}from"./index-BdK4FrM0.js";import{c as y}from"./repeat-CeHd_txR.js";import{d as p}from"./domain-state-DjGkhkio.js";function o(t,e=0){const a=Number(t);return Number.isFinite(a)?a:e}function f(t){const e=String(t||"").toLowerCase();return e==="candidate"?"new":e==="watch"?"watching":e==="reject"||e==="no data"?"rejected":"watching"}function _(t){const e=t?.score,a=Number(e);return Number.isFinite(a)?a<=1?Math.round(a*100):Math.round(a):0}function w(t={}){const e=o(t.change14dPct,0),a=String(t.regime||"").toLowerCase();return{trend:a==="bull"?"bullish":a==="bear"?"bearish":"neutral",rsi:o(t.residency30d,0)*100,support:o(t.atlDistancePct,0),resistance:o(t.athDistancePct,0),change14d:e}}function $(t,e){const a=t?.metrics||{},s=String(t?.symbol||"").toUpperCase(),i=s.includes("_")?s:`${s.replace(/USDT$/,"")}USDT`;return{id:`${s}-${t?.configKey||e}`,symbol:s,ticker:i,configKey:t?.configKey||"",type:t?.workerTypeLabel||t?.workerType||"Worker",workerType:t?.workerType||"",status:f(t?.status),rawStatus:t?.status||"Watch",score:_(t),capitalRequired:o(t?.capital,0),leverage:o(t?.leverage,1),estimatedMonthly:o(a.gridDailyProfit,0)*30,estimatedAnnual:o(a.gridDailyProfit,0)*365,volatility30d:Math.abs(o(a.change30dPct,0)),fundingRate:0,volume24h:o(t?.activeNotional,0),technicalGate:w(a),notes:t?.decisionReason||"No decision note returned.",createdAt:Date.now()-e*1e3,metrics:a,minCoverage:o(t?.minCoverage,0),targetDailyUsdt:o(t?.targetDailyUsdt,1),orderParameters:t?.orderParameters||{}}}const d={async getCandidates({capital:t=175,universe:e="",source:a="pionex",targetDailyUsdt:s=1}={}){const i=new URLSearchParams({capital:String(t),source:a,targetDailyUsdt:String(s)});e&&i.set("universe",e);const n=await c(`/dashboard/opportunities?${i.toString()}`),v=Array.isArray(n?.opportunities)?n.opportunities:[];return{ok:!!n?.ok,summary:n?.summary||{},errors:Array.isArray(n?.errors)?n.errors:[],candidates:v.map((m,g)=>$(m,g))}},async previewCreate({symbol:t,configKey:e,capital:a,targetDailyUsdt:s=1,source:i="pionex"}){return c("/dashboard/opportunities/create-preview",{method:"POST",body:JSON.stringify({symbol:t,configKey:e,capital:a,targetDailyUsdt:s,source:i})})},async executeCreate({confirmationToken:t,symbol:e,configKey:a,capital:s,targetDailyUsdt:i=1,source:n="pionex"}){return c("/dashboard/opportunities/create",{method:"POST",body:JSON.stringify({confirmationToken:t,symbol:e,configKey:a,capital:s,targetDailyUsdt:i,source:n})})},async getTechnicalGate({symbol:t,configKey:e,capital:a,targetDailyUsdt:s=1,source:i="pionex"}){return c("/dashboard/opportunities/technical-gate",{method:"POST",body:JSON.stringify({symbol:t,configKey:e,capital:a,targetDailyUsdt:s,source:i})})}},u="opportunities";class k extends h{static properties={_candidates:{type:Array,state:!0},_summary:{type:Object,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_segment:{type:String,state:!0},_capital:{type:Number,state:!0},_selected:{type:Object,state:!0},_execStep:{type:String,state:!0},_execResult:{type:Object,state:!0},_technicalGate:{type:Object,state:!0}};static styles=[b,x`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .toolbar { display:flex; gap:var(--space-3); flex-wrap:wrap; align-items:center; justify-content:space-between; }
    .toolbar-left, .toolbar-right { display:flex; gap:var(--space-3); flex-wrap:wrap; align-items:center; }
    .toolbar-note { font-size: var(--text-xs); color: var(--color-text-muted); }
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
    .ticker { font-size: var(--text-lg); font-weight: var(--weight-bold); font-family: var(--font-mono); }
    .meta { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 4px; }
    .status-chip {
      display:inline-flex; align-items:center; gap:6px; padding:4px 9px; border-radius:999px;
      font-size:11px; letter-spacing:0.08em; text-transform:uppercase;
    }
    .status-chip.candidate { background: var(--color-positive-dim); color: var(--color-positive); }
    .status-chip.watching { background: var(--color-warning-dim); color: var(--color-warning); }
    .status-chip.rejected { background: var(--color-negative-dim); color: var(--color-negative); }
    .score { font-family: var(--font-mono); font-size: 28px; font-weight: var(--weight-bold); }
    .score-label { font-size: 10px; color: var(--color-text-muted); letter-spacing: 0.08em; text-transform: uppercase; }
    .metrics { display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: var(--space-3); }
    .metric { display:flex; flex-direction:column; gap:2px; }
    .metric-label { font-size:10px; color:var(--color-text-muted); letter-spacing:0.08em; text-transform:uppercase; }
    .metric-value {
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      font-variant-numeric: tabular-nums slashed-zero;
      font-feature-settings: "tnum" 1, "zero" 1;
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
    .exec-row span:last-child {
      font-family: var(--font-mono);
      font-variant-numeric: tabular-nums slashed-zero;
      font-feature-settings: "tnum" 1, "zero" 1;
    }
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
  `];constructor(){super();const e=p.load(u);this._candidates=[],this._summary={},this._loading=!0,this._error="",this._segment=e.segment||"all",this._capital=Number(e.capital)||175,this._selected=null,this._execStep="preview",this._execResult=null,this._technicalGate=null}connectedCallback(){super.connectedCallback(),this._load()}_persist(){p.save(u,{segment:this._segment,capital:this._capital})}async _load(){this._loading=!0,this._error="";try{const e=await d.getCandidates({capital:this._capital});this._candidates=Array.isArray(e.candidates)?e.candidates:[],this._summary=e.summary||{}}catch(e){this._error=e?.data?.detail||e?.message||"Could not load opportunities.",this._candidates=[],this._summary={}}finally{this._loading=!1}}_setSegment(e){this._segment=e,this._persist()}_filtered(){return this._segment==="all"?this._candidates:this._candidates.filter(e=>e.status===this._segment)}_scoreColor(e){return e>=80?"var(--color-positive)":e>=60?"var(--color-accent)":e>=40?"var(--color-warning)":"var(--color-negative)"}async _openModal(e){this._selected=e,this._execStep="preview",this._execResult=null,this._technicalGate=null;try{this._technicalGate=await d.getTechnicalGate({symbol:e.symbol,configKey:e.configKey,capital:this._capital,targetDailyUsdt:e.targetDailyUsdt||1})}catch{this._technicalGate=null}}_closeModal(){this._selected=null,this._execStep="preview",this._execResult=null,this._technicalGate=null}async _executeCreate(){const e=this._selected;if(e){this._execStep="executing";try{const a=await d.previewCreate({symbol:e.symbol,configKey:e.configKey,capital:this._capital,targetDailyUsdt:e.targetDailyUsdt||1});if(!a?.canCreate||!a?.confirmationToken){this._execResult={success:!1,message:(a?.blockers||["Opportunity is blocked"]).join(" · ")},this._execStep="done";return}const s=await d.executeCreate({confirmationToken:a.confirmationToken,symbol:e.symbol,configKey:e.configKey,capital:this._capital,targetDailyUsdt:e.targetDailyUsdt||1});this._execResult={success:!!s?.pionex_created,message:s?.pionex_created?`${e.ticker} miner created. BU ${s?.bu_order_id||"created"}.`:s?.error_message||"Create request failed."},this._execStep="done",s?.pionex_created?(window.toast?.(`${e.ticker} miner created`,{type:"success"}),await this._load()):window.toast?.(this._execResult.message,{type:"error"})}catch(a){this._execResult={success:!1,message:a?.data?.detail||a?.message||"Create request failed."},this._execStep="done",window.toast?.(this._execResult.message,{type:"error"})}}}_renderCandidate(e){return l`
      <article class="card ${e.status}">
        <div class="head">
          <div>
            <div class="ticker">${e.ticker}</div>
            <div class="meta">${e.type} · ${r.leverage(e.leverage)} · ${e.rawStatus}</div>
          </div>
          <div style="text-align:right">
            <div class="score" style="color:${this._scoreColor(e.score)}">${e.score}</div>
            <div class="score-label">Score</div>
          </div>
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span class="status-chip ${e.status}">${e.rawStatus}</span>
          <span class="status-chip ${e.status}">${e.configKey}</span>
        </div>

        <div class="metrics">
          <div class="metric"><span class="metric-label">Capital</span><span class="metric-value">${r.usd(e.capitalRequired,2)}</span></div>
          <div class="metric"><span class="metric-label">Est. monthly</span><span class="metric-value pos">${r.pnl(e.estimatedMonthly,2)}</span></div>
          <div class="metric"><span class="metric-label">Vol 30d</span><span class="metric-value">${r.pctPlain(e.volatility30d,2)}</span></div>
          <div class="metric"><span class="metric-label">Notional</span><span class="metric-value">${r.compact(e.volume24h)}</span></div>
          <div class="metric"><span class="metric-label">Coverage min</span><span class="metric-value">${e.minCoverage.toFixed(2)}x</span></div>
          <div class="metric"><span class="metric-label">Target/day</span><span class="metric-value">${r.usd(e.targetDailyUsdt,2)}</span></div>
        </div>

        <div class="gate">
          <div class="gate-item"><strong>Trend:</strong> ${e.technicalGate?.trend||"-"}</div>
          <div class="gate-item"><strong>Residency 30d:</strong> ${r.pctPlain((e.metrics?.rangePosition30D||0)*100,1)}</div>
          <div class="gate-item"><strong>Stress close:</strong> ${r.pnl(e.metrics?.expectedClosePnlAfter1PctAdverse||0,2)}</div>
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
                <div class="exec-row"><span>Ticker</span><span>${e.ticker}</span></div>
                <div class="exec-row"><span>Config</span><span>${e.configKey}</span></div>
                <div class="exec-row"><span>Capital</span><span>${r.usd(this._capital,2)}</span></div>
                <div class="exec-row"><span>Leverage</span><span>${r.leverage(e.leverage)}</span></div>
                <div class="exec-row"><span>Monthly est.</span><span>${r.pnl(e.estimatedMonthly,2)}</span></div>
                <div class="exec-row"><span>Stress close</span><span>${r.pnl(e.metrics?.expectedClosePnlAfter1PctAdverse||0,2)}</span></div>
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
    `}render(){if(this._loading)return l`<loading-view label="Loading opportunities"></loading-view>`;if(this._error)return l`<error-view label="Opportunities unavailable" .sub=${this._error}></error-view>`;const e={new:0,watching:0,rejected:0};this._candidates.forEach(i=>{e[i.status]=(e[i.status]||0)+1});const a=this._filtered(),s=this._summary||{};return l`
      <div class="page">
        <div class="toolbar">
          <div class="toolbar-left">
            <segmented-control
              .options=${[{value:"all",label:`All (${this._candidates.length})`},{value:"new",label:`Candidates (${e.new||0})`},{value:"watching",label:`Watch (${e.watching||0})`},{value:"rejected",label:`Rejected (${e.rejected||0})`}]}
              value=${this._segment}
              @change=${i=>this._setSegment(i.detail)}
            ></segmented-control>
          </div>
          <div class="toolbar-right">
            <label class="toolbar-note">Capital per miner</label>
            <input
              class="input"
              style="max-width:140px"
              type="number"
              min="1"
              step="1"
              .value=${String(this._capital)}
              @change=${i=>{this._capital=Number(i.target.value)||175,this._persist(),this._load()}}
            />
          </div>
        </div>

        <div class="kpi-row">
          <stat-card label="Candidates" value="${s.candidatesCount||0}" accent="positive"></stat-card>
          <stat-card label="Watch" value="${s.watchCount||0}" accent="warning"></stat-card>
          <stat-card label="Rejected" value="${s.rejectedCount||0}" accent="negative"></stat-card>
          <stat-card label="Universe" value="${s.universeCount||0}" accent="neutral"></stat-card>
          <stat-card label="Best symbol" value="${s.bestSymbol||"-"}" accent="accent" mono></stat-card>
          <stat-card label="Capital assumed" value="${r.usd(s.capitalAssumed||this._capital,2)}" accent="neutral" mono></stat-card>
        </div>

        <div class="opps">
          ${y(a,i=>i.id,i=>this._renderCandidate(i))}
          ${a.length?"":l`<empty-view label="No opportunities in this segment"></empty-view>`}
        </div>
      </div>
      ${this._renderModal()}
    `}}customElements.define("opportunities-view",k);
