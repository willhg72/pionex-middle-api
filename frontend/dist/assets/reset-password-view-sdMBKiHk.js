import{i as n,b as o,a as l,g as r,j as d,c as t,d as i,e as a,r as p}from"./index-BdK4FrM0.js";class c extends n{static properties={_token:{type:String,state:!0},_password:{type:String,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_success:{type:String,state:!0},_lang:{type:String,state:!0}};static styles=[o,l`
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
    .msg,.error { margin-top:14px; padding:12px 14px; border-radius:12px; font-size:13px; line-height:1.5; }
    .msg { background:rgba(34,211,160,0.08); border:1px solid rgba(34,211,160,0.18); }
    .error { background:rgba(240,74,94,0.1); border:1px solid rgba(240,74,94,0.25); color:#ff99a6; }
  `];constructor(){super();const s=new URLSearchParams(window.location.hash.split("?")[1]||"");this._token=s.get("token")||"",this._password="",this._loading=!1,this._error="",this._success="",this._lang=r()}connectedCallback(){super.connectedCallback(),this._langHandler=()=>{this._lang=r()},window.addEventListener("capintel-lang-changed",this._langHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-lang-changed",this._langHandler)}async _submit(s){s.preventDefault(),this._loading=!0,this._error="",this._success="";try{const e=await d({resetToken:this._token,newPassword:this._password});this._success=e.message}catch(e){this._error=e?.data?.detail||e.message||"Reset failed."}finally{this._loading=!1}}render(){return a`
      <div class="wrap">
        <form class="card" @submit=${this._submit}>
          <div class="header-row">
            <div>${t("product",this._lang)}</div>
            <div class="lang">
              <button class="btn ${this._lang==="es"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>i("es")}>ES</button>
              <button class="btn ${this._lang==="en"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>i("en")}>EN</button>
            </div>
          </div>
          <h1>${t("reset",this._lang)}</h1>
          <p>${t("resetSubtitle",this._lang)}</p>
          <label class="field">
            <span class="label">${t("newPassword",this._lang)}</span>
            <input class="input" type="password" .value=${this._password} @input=${s=>this._password=s.target.value} />
          </label>
          <button class="btn btn-primary" type="submit" ?disabled=${this._loading||!this._token}>
            ${this._loading?t("updatingPassword",this._lang):t("updatePassword",this._lang)}
          </button>
          ${this._success?a`<div class="msg">${this._success}</div>`:""}
          ${this._error?a`<div class="error">${this._error}</div>`:""}
          <div style="margin-top:16px;">
            <button class="btn btn-ghost" type="button" @click=${()=>p.navigate("sign-in")}>${t("backToSignIn",this._lang)}</button>
          </div>
        </form>
      </div>
    `}}customElements.define("reset-password-view",c);
