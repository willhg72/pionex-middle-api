import{i as n,b as l,a as o,g as i,h as d,c as t,d as s,e,r as g}from"./index-BdK4FrM0.js";class p extends n{static properties={_email:{type:String,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_result:{type:Object,state:!0},_lang:{type:String,state:!0}};static styles=[l,o`
    :host { display:block; min-height:100vh; color:var(--color-text-primary); }
    .wrap { min-height:100vh; display:grid; place-items:center; padding:24px; background:linear-gradient(180deg, #07111f 0%, #0d1727 100%); }
    .card { width:min(560px,100%); padding:32px; border-radius:24px; background:rgba(9,16,27,0.92); border:1px solid rgba(255,255,255,0.07); }
    .header-row { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px; }
    .lang { display:flex; gap:8px; }
    h1 { margin:0 0 8px; font-size:34px; }
    p { margin:0 0 20px; color:var(--color-text-muted); line-height:1.6; }
    .field { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
    .label { font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:var(--color-text-muted); font-weight:700; }
    .input { width:100%; padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.09); background:rgba(255,255,255,0.03); color:var(--color-text-primary); }
    .note,.error { margin-top:14px; padding:12px 14px; border-radius:12px; font-size:13px; line-height:1.5; }
    .note { background:rgba(34,211,160,0.08); border:1px solid rgba(34,211,160,0.18); }
    .error { background:rgba(240,74,94,0.1); border:1px solid rgba(240,74,94,0.25); color:#ff99a6; }
    .linkbox { margin-top:12px; padding:12px; border-radius:12px; background:rgba(255,255,255,0.03); overflow-wrap:anywhere; }
  `];constructor(){super(),this._email="",this._loading=!1,this._error="",this._result=null,this._lang=i()}connectedCallback(){super.connectedCallback(),this._langHandler=()=>{this._lang=i()},window.addEventListener("capintel-lang-changed",this._langHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-lang-changed",this._langHandler)}async _submit(a){a.preventDefault(),this._loading=!0,this._error="";try{this._result=await d({email:this._email.trim()})}catch(r){this._error=r?.data?.detail||r.message||"Request failed."}finally{this._loading=!1}}render(){return e`
      <div class="wrap">
        <form class="card" @submit=${this._submit}>
          <div class="header-row">
            <div>${t("product",this._lang)}</div>
            <div class="lang">
              <button class="btn ${this._lang==="es"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>s("es")}>ES</button>
              <button class="btn ${this._lang==="en"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>s("en")}>EN</button>
            </div>
          </div>
          <h1>${t("forgot",this._lang)}</h1>
          <p>${t("forgotSubtitle",this._lang)}</p>
          <label class="field">
            <span class="label">${t("email",this._lang)}</span>
            <input class="input" type="email" .value=${this._email} @input=${a=>this._email=a.target.value} />
          </label>
          <button class="btn btn-primary" type="submit" ?disabled=${this._loading}>
            ${this._loading?t("sendingRecovery",this._lang):t("sendRecovery",this._lang)}
          </button>
          ${this._result?e`
            <div class="note">
              ${this._result.message}
              <div class="linkbox">${t("localRecovery",this._lang)}</div>
              ${this._result.resetUrl?e`<div class="linkbox"><a href="${this._result.resetUrl}">${this._result.resetUrl}</a></div>`:""}
            </div>
          `:""}
          ${this._error?e`<div class="error">${this._error}</div>`:""}
          <div style="margin-top:16px;">
            <button class="btn btn-ghost" type="button" @click=${()=>g.navigate("sign-in")}>${t("backToSignIn",this._lang)}</button>
          </div>
        </form>
      </div>
    `}}customElements.define("forgot-password-view",p);
