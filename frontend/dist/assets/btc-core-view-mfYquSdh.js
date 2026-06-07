import{i as o,b as r,a as n,g as i,v as c,l as e,e as s}from"./index-Bb1-_Ymx.js";const l={config:{monthlyBudget:2e3,currentBtc:.41842,targetBtc:1,btcPrice:43820},progress:{pctToTarget:41.8,usdValue:18338,remaining:.58158,remainingUsd:25482},purchases:[{id:"b1",date:"2024-06-01",amount:.0458,price:43680,usd:2000.69,note:"Monthly DCA"},{id:"b2",date:"2024-05-15",amount:.0284,price:62830,usd:1784.37,note:"Dip buy"},{id:"b3",date:"2024-05-01",amount:.0324,price:58410,usd:1892.48,note:"Monthly DCA"},{id:"b4",date:"2024-04-01",amount:.0298,price:67120,usd:2000.18,note:"Monthly DCA"}]};class d extends o{static properties={_data:{type:Object,state:!0},_modal:{type:String,state:!0},_buyAmount:{type:Number,state:!0},_lang:{type:String,state:!0}};static styles=[r,n`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-5); }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-4); }
    .btc-progress-display { text-align: center; padding: var(--space-6) 0; }
    .btc-main { font-size: var(--text-4xl); font-weight: var(--weight-bold); font-family: var(--font-mono); letter-spacing: var(--tracking-tighter); color: var(--color-warning); margin-bottom: var(--space-1); }
    .btc-target { font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-5); }
    .btc-sub { font-size: var(--text-lg); color: var(--color-text-secondary); font-family: var(--font-mono); margin-top: var(--space-2); }
    .config-field { display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border-subtle); }
    .config-field:last-child { border-bottom: none; }
    .cf-label { font-size: var(--text-sm); color: var(--color-text-secondary); }
    .cf-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .purchase-row { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border-subtle); font-size: var(--text-sm); }
    .purchase-row:last-child { border-bottom: none; }
    .pr-date { color: var(--color-text-muted); font-size: var(--text-xs); min-width: 80px; }
    .pr-amount { font-family: var(--font-mono); font-weight: var(--weight-semibold); color: var(--color-warning); min-width: 100px; }
    .pr-price { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 90px; }
    .pr-usd { font-family: var(--font-mono); color: var(--color-text-secondary); margin-left: auto; }
    .buy-section { padding: var(--space-4); background: var(--color-bg-elevated); border-radius: var(--radius-md); display: flex; align-items: flex-end; gap: var(--space-3); }
  `];constructor(){super(),this._data=l,this._modal=null,this._buyAmount=500,this._lang=i()}connectedCallback(){super.connectedCallback(),this._localeListener=()=>{this._lang=i(),this.requestUpdate()},window.addEventListener("capintel-locale-changed",this._localeListener)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-locale-changed",this._localeListener)}_t(t,a){return this._lang==="en"?a:t}async _executeBuy(){await c(1500);const t=(this._buyAmount/this._data.config.btcPrice).toFixed(5);return{success:!0,message:this._t(`Compra ejecutada: ${t} BTC a ${e.usd(this._data.config.btcPrice,0)}. Total: ${e.usd(this._buyAmount,2)}.`,`Purchase executed: ${t} BTC at ${e.usd(this._data.config.btcPrice,0)}. Total: ${e.usd(this._buyAmount,2)}.`)}}render(){const t=this._data;return s`
      <div class="page">
        <div class="two-col">
          <div class="panel">
            <div class="panel-title">${this._t("Progreso de acumulación BTC","BTC Accumulation Progress")}</div>
            <div class="btc-progress-display">
              <div class="btc-main">${e.btc(t.config.currentBtc)}</div>
              <div class="btc-target">${this._t("de","of")} ${e.btc(t.config.targetBtc)} ${this._t("objetivo","target")} · ${t.progress.pctToTarget.toFixed(1)}% ${this._t("completado","complete")}</div>
              <progress-bar value=${t.progress.pctToTarget} color="var(--color-warning)" height="10" showPct></progress-bar>
              <div class="btc-sub">≈ ${e.usd(t.progress.usdValue)}</div>
            </div>
            <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--color-border-subtle)">
              <div class="config-field"><span class="cf-label">${this._t("Restante","Remaining")}</span><span class="cf-value" style="color:var(--color-text-muted)">${e.btc(t.progress.remaining)}</span></div>
              <div class="config-field"><span class="cf-label">${this._t("Restante (USD)","Remaining (USD)")}</span><span class="cf-value">${e.usd(t.progress.remainingUsd)}</span></div>
              <div class="config-field"><span class="cf-label">${this._t("Precio actual BTC","Current BTC Price")}</span><span class="cf-value">${e.usd(t.config.btcPrice)}</span></div>
              <div class="config-field"><span class="cf-label">${this._t("Presupuesto mensual","Monthly Budget")}</span><span class="cf-value">${e.usd(t.config.monthlyBudget)}</span></div>
              <div class="config-field"><span class="cf-label">${this._t("Meses al objetivo","Months to Target")}</span><span class="cf-value">${e.number(t.progress.remainingUsd/t.config.monthlyBudget,1)}</span></div>
            </div>
          </div>

          <div>
            <div class="panel" style="margin-bottom:var(--space-4)">
              <div class="panel-title">${this._t("Historial de compras","Purchase History")}</div>
              ${t.purchases.map(a=>s`
                <div class="purchase-row">
                  <span class="pr-date">${a.date}</span>
                  <span class="pr-amount">${e.btc(a.amount)}</span>
                  <span class="pr-price">@ ${e.usd(a.price)}</span>
                  <span class="pr-usd">${e.usd(a.usd,2)}</span>
                </div>
                <div style="padding:0 0 var(--space-2) 0;font-size:var(--text-xs);color:var(--color-text-disabled);border-bottom:1px solid var(--color-border-subtle)">${a.note}</div>
              `)}
            </div>

            <div class="panel">
              <div class="panel-title">${this._t("Compra manual","Manual Buy")}</div>
              <div class="buy-section">
                <numeric-input
                  label="${this._t("Monto USDT","USDT Amount")}"
                  .value=${this._buyAmount}
                  min="10"
                  max="50000"
                  step="100"
                  prefix="$"
                  @change=${a=>{this._buyAmount=a.detail}}
                  style="flex:1"
                ></numeric-input>
                <div style="font-size:var(--text-xs);color:var(--color-text-muted);white-space:nowrap">
                  ≈ ${(this._buyAmount/t.config.btcPrice).toFixed(6)} BTC
                </div>
                <button class="btn btn-warning" @click=${()=>{this._modal="buy"}}>${this._t("Comprar BTC ->","Buy BTC ->")}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${this._modal==="buy"?s`
        <preview-execute-modal
          title="${this._t("Comprar BTC","Buy BTC")}"
          subtitle="${this._t("Compra manual de mercado para la estrategia BTC Core.","Manual market buy for the BTC Core strategy.")}"
          domain="btc-core"
          .payload=${[{label:this._t("Gasto","Spend"),value:e.usd(this._buyAmount,2)},{label:this._t("Precio BTC","BTC Price"),value:e.usd(t.config.btcPrice)},{label:this._t("BTC recibido","BTC Received"),value:`≈ ${(this._buyAmount/t.config.btcPrice).toFixed(6)} BTC`},{label:this._t("Nuevo total","New Total"),value:`≈ ${(t.config.currentBtc+this._buyAmount/t.config.btcPrice).toFixed(5)} BTC`}]}
          .warnings=${[this._t("Compra a mercado: el precio final puede diferir del estimado.","Market buy: final execution price may differ from the estimate.")]}
          dangerLevel="warning"
          confirmText="${this._t("Comprar BTC","Buy BTC")}"
          .executeFn=${()=>this._executeBuy()}
          @closed=${()=>{this._modal=null}}
          @executed=${()=>{window.toast?.(this._t("Compra BTC ejecutada","BTC purchase executed"),{type:"success"}),this._modal=null}}
        ></preview-execute-modal>
      `:""}
    `}}customElements.define("btc-core-view",d);
