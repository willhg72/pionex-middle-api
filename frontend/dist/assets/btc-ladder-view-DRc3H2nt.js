import{k as s,p as u,i as C,b as $,a as w,e as i,l as a}from"./index-BdK4FrM0.js";import{d as b}from"./domain-state-DjGkhkio.js";const d={async getDashboard(){return s("/dashboard/btc-ladder")},async getPrice(){return s("/dashboard/btc-ladder/price")},async placeAll({capitalUsdt:l,levels:e,maxDipPct:t}){return s("/dashboard/btc-ladder/place-all",{method:"POST",body:JSON.stringify({capitalUsdt:l,levels:e,maxDipPct:t,...u()})})},async cancelAll(){return s("/dashboard/btc-ladder/cancel-all",{method:"POST",body:JSON.stringify(u())})},async previewLimit({usdtAmount:l,limitPrice:e}){return s("/dashboard/btc-ladder/limit-preview",{method:"POST",body:JSON.stringify({usdtAmount:l,limitPrice:e})})},async executeLimit({confirmationToken:l}){return s("/dashboard/btc-ladder/limit-execute",{method:"POST",headers:{"Idempotency-Key":`ladder-${Date.now()}`},body:JSON.stringify({confirmationToken:l,...u()})})},async confirmFill({btcAmount:l,usdtAmount:e,price:t,note:o}){return s("/dashboard/btc-ladder/fill-confirm",{method:"POST",body:JSON.stringify({btcAmount:l,usdtAmount:e,price:t,note:o})})},async reconcile({autoLedger:l=!1}={}){return s("/dashboard/btc-ladder/reconcile",{method:"POST",body:JSON.stringify({autoLedger:l,...u()})})}},_="btc-ladder";function r(l,e=0){const t=Number(l);return Number.isFinite(t)?t:e}class P extends C{static properties={_data:{type:Object,state:!0},_price:{type:Number,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_capitalUsdt:{type:Number,state:!0},_levels:{type:Number,state:!0},_maxDipPct:{type:Number,state:!0},_limitUsdt:{type:Number,state:!0},_limitPrice:{type:Number,state:!0},_placeCtx:{type:Object,state:!0},_cancelCtx:{type:Boolean,state:!0},_limitCtx:{type:Object,state:!0},_fillCtx:{type:Object,state:!0}};static styles=[$,w`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .toolbar { display: flex; gap: var(--space-3); flex-wrap: wrap; }
    .hero { display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-4); }
    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }
    .chart-frame { width: 100%; height: 380px; border: none; border-radius: var(--radius-md); background: var(--color-bg-elevated); }
    .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
    .summary-box { padding: 12px; border-radius: var(--radius-md); background: var(--color-bg-elevated); }
    .summary-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 4px; }
    .summary-value { font-family: var(--font-mono); font-size: var(--text-md); }
    .kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--space-3); }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label { font-size: var(--text-xs); color: var(--color-text-muted); letter-spacing: 0.08em; text-transform: uppercase; }
    .field input { width: 100%; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px 12px; font-size: var(--text-sm); text-align: left; border-bottom: 1px solid var(--color-border-subtle); }
    th { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    td.mono { font-family: var(--font-mono); }
    .status { display: inline-flex; align-items: center; padding: 4px 8px; border-radius: 999px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }
    .status.open, .status.placed { background: var(--color-idle-dim); color: var(--color-text-secondary); }
    .status.partial_filled { background: var(--color-warning-dim); color: var(--color-warning); }
    .status.filled { background: var(--color-positive-dim); color: var(--color-positive); }
    .status.closed_unknown { background: var(--color-negative-dim); color: var(--color-negative); }
    .plan-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-2); }
    .plan-card { padding: 10px; border-radius: var(--radius-md); background: var(--color-bg-elevated); }
    .plan-title { font-size: 10px; color: var(--color-text-muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
    .plan-main { font-family: var(--font-mono); font-size: var(--text-sm); }
    .hint { font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.5; }
    .inline-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    @media (max-width: 900px) {
      .hero { grid-template-columns: 1fr; }
      .form-grid { grid-template-columns: 1fr; }
      .plan-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `];constructor(){super();const e=b.load(_);this._data={inventory:{},ladderOrders:[],reconciliation:{statusCounts:{}}},this._price=0,this._loading=!0,this._error="",this._capitalUsdt=e.capitalUsdt||120,this._levels=e.levels||6,this._maxDipPct=e.maxDipPct||18,this._limitUsdt=e.limitUsdt||30,this._limitPrice=e.limitPrice||0,this._placeCtx=null,this._cancelCtx=!1,this._limitCtx=null,this._fillCtx=null}connectedCallback(){super.connectedCallback(),this._load()}_persistDraft(){b.save(_,{capitalUsdt:this._capitalUsdt,levels:this._levels,maxDipPct:this._maxDipPct,limitUsdt:this._limitUsdt,limitPrice:this._limitPrice})}async _load(){this._loading=!0,this._error="";try{const[e,t]=await Promise.all([d.getDashboard(),d.getPrice().catch(()=>null)]);this._data=e||this._data,this._price=Number(t?.price||this._price||0),!this._limitPrice&&this._price>0&&(this._limitPrice=this._price*.96),this._persistDraft()}catch(e){this._error=e?.data?.detail||e?.message||"Could not load BTC ladder."}finally{this._loading=!1}}_buildPlanRows(){const e=r(this._price),t=r(this._capitalUsdt),o=Math.max(2,Math.min(12,Number(this._levels||6))),g=Math.max(2,Math.min(40,Number(this._maxDipPct||18)));if(!e||!t)return[];const m=Array.from({length:o},(c,n)=>n+1),f=m.reduce((c,n)=>c+n,0),x=g/o;return m.map((c,n)=>{const p=x*(n+1),v=e*(1-p/100),h=t*(c/f),y=h/v;return{idx:n+1,discountPct:p,levelPrice:v,usdt:h,btc:y}})}async _refreshStatuses(e=!1){try{const t=await d.reconcile({autoLedger:e});this._data={...this._data,ladderOrders:t.orders||this._data.ladderOrders,reconciliation:{statusCounts:t.statusCounts||{}}},e&&await this._load(),window.toast?.(`Checked ${t.checkedCount} ladder orders.`,{type:"info"})}catch(t){window.toast?.(t?.data?.detail||t?.message||"Could not reconcile ladder orders.",{type:"error"})}}async _openLimitPreview(){try{const e=await d.previewLimit({usdtAmount:this._limitUsdt,limitPrice:this._limitPrice});this._limitCtx=e}catch(e){window.toast?.(e?.data?.detail||e?.message||"Could not preview limit order.",{type:"error"})}}async _executePlaceAll(){const e=await d.placeAll({capitalUsdt:this._capitalUsdt,levels:this._levels,maxDipPct:this._maxDipPct});return await this._load(),{success:!!e?.ok,message:`${e?.placedCount||0} ladder orders placed on Pionex.`}}async _executeCancelAll(){const e=await d.cancelAll();return await this._refreshStatuses(!1),{success:!!e?.ok,message:`${e?.cancelledCount||0} open ladder orders cancelled.`}}async _executeLimit(){const e=await d.executeLimit({confirmationToken:this._limitCtx?.confirmationToken});return await this._load(),{success:!!e?.ok,message:e?.ok?"BTC ladder limit order placed on Pionex.":e?.error_message||"Order failed."}}async _confirmFill(){const e=this._fillCtx,t=await d.confirmFill({btcAmount:Number(e?.filledBtcAmount||e?.btcAmount||0),usdtAmount:Number(e?.filledUsdtAmount||e?.usdtAmount||0),price:Number(e?.price||0),note:`manual ledger confirmation from new dashboard for ${e?.orderId||"ladder-order"}`});return await this._refreshStatuses(!1),{success:!!t?.ok,message:"BTC fill added to ledger."}}_renderChart(){const t=`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent("BINANCE:BTCUSDT")}&interval=240&theme=dark&style=1&locale=en&hide_top_toolbar=0&hide_side_toolbar=0&allow_symbol_change=0&drawings_access=all&save_image=1`;return i`<iframe class="chart-frame" src="${t}"></iframe>`}_renderSummary(){const e=this._data?.inventory||{},t=this._data?.reconciliation?.statusCounts||{};return i`
      <div class="panel">
        <div class="panel-title">Ladder Reconciliation</div>
        <div class="summary-grid">
          <div class="summary-box"><div class="summary-label">Total BTC Ledger</div><div class="summary-value">${a.btc(r(e.totalBtc),8)}</div></div>
          <div class="summary-box"><div class="summary-label">Average Cost</div><div class="summary-value">${e.averagePrice?a.usd(r(e.averagePrice),2):"—"}</div></div>
          <div class="summary-box"><div class="summary-label">Pending USDT</div><div class="summary-value">${a.usd(r(e.pendingUsdt),2)}</div></div>
          <div class="summary-box"><div class="summary-label">Orders</div><div class="summary-value">O ${t.open||0} · P ${t.partial_filled||0} · F ${t.filled||0}</div></div>
        </div>
        <div class="hint" style="margin-top:12px">
          Los estados open y partial_filled salen de las open orders de Pionex. Si una orden desaparece de open orders pero no hay fill confirmado suficiente, queda en closed_unknown para evitar contaminar el ledger.
        </div>
      </div>
    `}_renderPlan(){const e=this._buildPlanRows();return i`
      <div class="panel">
        <div class="panel-title">Ladder Plan</div>
        <div class="form-grid">
          <div class="field">
            <label>Capital USDT</label>
            <input type="number" .value=${String(this._capitalUsdt)} @input=${t=>{this._capitalUsdt=Number(t.target.value),this._persistDraft()}} />
          </div>
          <div class="field">
            <label>Levels</label>
            <input type="number" min="2" max="12" .value=${String(this._levels)} @input=${t=>{this._levels=Number(t.target.value),this._persistDraft()}} />
          </div>
          <div class="field">
            <label>Max Dip %</label>
            <input type="number" min="2" max="40" .value=${String(this._maxDipPct)} @input=${t=>{this._maxDipPct=Number(t.target.value),this._persistDraft()}} />
          </div>
          <div class="field">
            <label>Spot Price</label>
            <input type="number" .value=${String(Number(this._price||0).toFixed(2))} @input=${t=>{this._price=Number(t.target.value),this._persistDraft()}} />
          </div>
        </div>
        <div class="inline-actions" style="margin-top:12px">
          <button class="btn btn-primary" @click=${()=>{this._placeCtx={rows:e}}}>Place Full Ladder</button>
          <button class="btn btn-danger" @click=${()=>{this._cancelCtx=!0}}>Cancel Open Orders</button>
          <button class="btn btn-ghost" @click=${()=>this._refreshStatuses(!1)}>Refresh Statuses</button>
          <button class="btn btn-warning" @click=${()=>this._refreshStatuses(!0)}>Refresh + Auto Ledger</button>
        </div>
        <div class="plan-grid" style="margin-top:12px">
          ${e.map(t=>i`
            <div class="plan-card">
              <div class="plan-title">L${t.idx} · -${t.discountPct.toFixed(1)}%</div>
              <div class="plan-main">${a.usd(t.levelPrice,2)}</div>
              <div class="hint">${a.usd(t.usdt,2)} · ${a.btc(t.btc,6)}</div>
            </div>
          `)}
          ${e.length?"":i`<div class="hint">Load a price and valid capital to compute a ladder plan.</div>`}
        </div>
      </div>
    `}_renderManualLimit(){return i`
      <div class="panel">
        <div class="panel-title">Single Ladder Limit</div>
        <div class="form-grid">
          <div class="field">
            <label>USDT Amount</label>
            <input type="number" .value=${String(this._limitUsdt)} @input=${e=>{this._limitUsdt=Number(e.target.value),this._persistDraft()}} />
          </div>
          <div class="field">
            <label>Limit Price</label>
            <input type="number" .value=${String(Number(this._limitPrice||0).toFixed(2))} @input=${e=>{this._limitPrice=Number(e.target.value),this._persistDraft()}} />
          </div>
        </div>
        <div class="inline-actions" style="margin-top:12px">
          <button class="btn btn-primary" @click=${()=>this._openLimitPreview()}>Preview Real Limit Order</button>
        </div>
      </div>
    `}_renderOrders(){const e=Array.isArray(this._data?.ladderOrders)?this._data.ladderOrders:[];return i`
      <div class="panel">
        <div class="panel-title">Latest Ladder Orders</div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Price</th>
                <th>USDT</th>
                <th>BTC</th>
                <th>Filled</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${e.map(t=>i`
                <tr>
                  <td class="mono">${t.orderId}</td>
                  <td class="mono">${a.usd(r(t.price),2)}</td>
                  <td class="mono">${a.usd(r(t.usdtAmount),2)}</td>
                  <td class="mono">${a.btc(r(t.btcAmount),8)}</td>
                  <td class="mono">${a.btc(r(t.filledBtcAmount||0),8)}</td>
                  <td><span class="status ${t.status||"placed"}">${t.status||"placed"}</span></td>
                  <td>
                    ${t.status==="closed_unknown"||t.status==="partial_filled"?i`
                      <button class="btn btn-ghost btn-sm" @click=${()=>{this._fillCtx=t}}>Confirm Fill</button>
                    `:i`<span class="hint">${t.reconciled?"ledger ok":"—"}</span>`}
                  </td>
                </tr>
              `)}
              ${e.length?"":i`<tr><td colspan="7" class="hint">No ladder orders yet. Place the ladder from the plan above.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    `}render(){if(this._loading)return i`<loading-view label="Loading BTC ladder"></loading-view>`;if(this._error)return i`<error-view label="BTC ladder unavailable" .sub=${this._error}></error-view>`;const e=this._data?.inventory||{};return i`
      <div class="page">
        <div class="toolbar">
          <button class="btn btn-ghost" @click=${()=>this._load()}>Refresh Dashboard</button>
        </div>

        <div class="hero">
          <div class="panel">
            <div class="panel-title">BTC Ladder Chart</div>
            ${this._renderChart()}
          </div>
          ${this._renderSummary()}
        </div>

        <div class="kpi-row">
          <stat-card label="BTC Ledger" value="${a.btc(r(e.totalBtc),8)}" accent="accent"></stat-card>
          <stat-card label="USDT Invested" value="${a.usd(r(e.totalUsdt),2)}" accent="neutral" mono></stat-card>
          <stat-card label="DCA Source" value="${a.btc(r(e.dcaBtc),8)}" accent="warning"></stat-card>
          <stat-card label="Ladder Source" value="${a.btc(r(e.ladderBtc),8)}" accent="positive"></stat-card>
        </div>

        ${this._renderPlan()}
        ${this._renderManualLimit()}
        ${this._renderOrders()}
      </div>

      ${this._placeCtx?i`
        <preview-execute-modal
          title="Place Full Ladder"
          subtitle="${this._levels} live BTC spot limit orders on Pionex"
          domain="btc-ladder"
          .payload=${[{label:"Capital",value:a.usd(this._capitalUsdt,2)},{label:"Levels",value:this._levels},{label:"Max Dip",value:`${this._maxDipPct}%`},{label:"Reference Price",value:a.usd(this._price,2)}]}
          .warnings=${["This sends real spot LIMIT buy orders to Pionex.","Capital will remain locked until orders fill or are cancelled."]}
          dangerLevel="warning"
          confirmText="Place Ladder"
          .executeFn=${()=>this._executePlaceAll()}
          @closed=${()=>{this._placeCtx=null}}
          @executed=${()=>{this._placeCtx=null}}
        ></preview-execute-modal>
      `:""}

      ${this._cancelCtx?i`
        <preview-execute-modal
          title="Cancel All Ladder Orders"
          subtitle="Cancel current open BTC ladder spot orders"
          domain="btc-ladder"
          .payload=${[{label:"Pending USDT",value:a.usd(r(this._data?.inventory?.pendingUsdt),2)},{label:"Open Orders",value:this._data?.reconciliation?.statusCounts?.open||0}]}
          .warnings=${["Only currently open spot orders will be cancelled.","Filled orders stay in the ledger and are not reversed."]}
          dangerLevel="danger"
          confirmText="Cancel Orders"
          .executeFn=${()=>this._executeCancelAll()}
          @closed=${()=>{this._cancelCtx=!1}}
          @executed=${()=>{this._cancelCtx=!1}}
        ></preview-execute-modal>
      `:""}

      ${this._limitCtx?i`
        <preview-execute-modal
          title="Create Ladder Limit Order"
          subtitle="Single live BTC spot limit buy on Pionex"
          domain="btc-ladder"
          .payload=${[{label:"USDT",value:a.usd(Number(this._limitCtx.usdtAmount||0),2)},{label:"Limit Price",value:a.usd(Number(this._limitCtx.limitPrice||0),2)},{label:"BTC Size",value:a.btc(Number(this._limitCtx.btcAmount||0),8)}]}
          .warnings=${[this._limitCtx.warning||"This will place a real BTC spot limit order."]}
          dangerLevel="warning"
          confirmText="Place Limit"
          .executeFn=${()=>this._executeLimit()}
          @closed=${()=>{this._limitCtx=null}}
          @executed=${()=>{this._limitCtx=null}}
        ></preview-execute-modal>
      `:""}

      ${this._fillCtx?i`
        <preview-execute-modal
          title="Confirm Ladder Fill Into Ledger"
          subtitle="${this._fillCtx.orderId}"
          domain="btc-ladder"
          .payload=${[{label:"Order Status",value:this._fillCtx.status||"unknown"},{label:"BTC",value:a.btc(Number(this._fillCtx.filledBtcAmount||this._fillCtx.btcAmount||0),8)},{label:"USDT",value:a.usd(Number(this._fillCtx.filledUsdtAmount||this._fillCtx.usdtAmount||0),2)},{label:"Price",value:a.usd(Number(this._fillCtx.price||0),2)}]}
          .warnings=${["Use this when Pionex no longer reports the order as open and you want to move the buy into the BTC ledger.","If the order was cancelled rather than filled, do not confirm it here."]}
          dangerLevel="warning"
          confirmText="Update Ledger"
          .executeFn=${()=>this._confirmFill()}
          @closed=${()=>{this._fillCtx=null}}
          @executed=${()=>{this._fillCtx=null}}
        ></preview-execute-modal>
      `:""}
    `}}customElements.define("btc-ladder-view",P);
