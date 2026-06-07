import{i as r,b as o,a as p,g as i,f as d,r as s,c as a,d as l,e as n}from"./index-BdK4FrM0.js";class c extends r{static properties={_fullName:{type:String,state:!0},_tenantName:{type:String,state:!0},_email:{type:String,state:!0},_password:{type:String,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_lang:{type:String,state:!0}};static styles=[o,p`
    :host { display:block; min-height:100vh; color:var(--color-text-primary); }
    .shell { min-height:100vh; display:grid; place-items:center; padding:24px; background:radial-gradient(circle at 15% 20%, rgba(34,211,160,0.15), transparent 24%), radial-gradient(circle at 85% 10%, rgba(91,141,239,0.2), transparent 28%), linear-gradient(180deg, #07111f 0%, #0d1727 100%); }
    .card { width:min(620px,100%); padding:clamp(24px,4vw,40px); border-radius:28px; background:rgba(9,16,27,0.92); border:1px solid rgba(255,255,255,0.07); box-shadow:0 30px 80px rgba(0,0,0,0.35); }
    .header-row { display:flex; justify-content:space-between; align-items:center; gap:12px; }
    .lang { display:flex; gap:8px; }
    .eyebrow { font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#9fd6c6; font-weight:700; }
    h1 { margin:10px 0 8px; font-size:clamp(28px,4vw,42px); }
    p { margin:0 0 24px; color:var(--color-text-muted); line-height:1.6; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .field { display:flex; flex-direction:column; gap:8px; }
    .full { grid-column:1 / -1; }
    .label { font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:var(--color-text-muted); font-weight:700; }
    .input { width:100%; padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.09); background:rgba(255,255,255,0.03); color:var(--color-text-primary); font-size:14px; outline:none; }
    .input:focus { border-color:rgba(34,211,160,0.7); box-shadow:0 0 0 3px rgba(34,211,160,0.14); }
    .error { margin-top:16px; padding:12px 14px; border-radius:12px; background:rgba(240,74,94,0.1); border:1px solid rgba(240,74,94,0.25); color:#ff99a6; font-size:13px; }
    .footer { margin-top:22px; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; }
    .link { color:#9fd6c6; cursor:pointer; text-decoration:none; font-size:13px; }
    @media (max-width:720px) { .grid { grid-template-columns:1fr; } }
  `];constructor(){super(),this._fullName="",this._tenantName="",this._email="",this._password="",this._loading=!1,this._error="",this._lang=i()}connectedCallback(){super.connectedCallback(),this._langHandler=()=>{this._lang=i()},window.addEventListener("capintel-lang-changed",this._langHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-lang-changed",this._langHandler)}async _submit(t){t.preventDefault(),this._loading=!0,this._error="";try{await d({fullName:this._fullName.trim(),tenantName:this._tenantName.trim(),email:this._email.trim(),password:this._password}),window.dispatchEvent(new CustomEvent("capintel-auth-changed")),s.navigate("overview")}catch(e){this._error=e?.data?.detail||e.message||"Unable to create account."}finally{this._loading=!1}}render(){return n`
      <div class="shell">
        <form class="card" @submit=${this._submit}>
          <div class="header-row">
            <div class="eyebrow">${a("product",this._lang)}</div>
            <div class="lang">
              <button class="btn ${this._lang==="es"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>l("es")}>ES</button>
              <button class="btn ${this._lang==="en"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>l("en")}>EN</button>
            </div>
          </div>
          <h1>${a("signUp",this._lang)}</h1>
          <p>${a("signUpSubtitle",this._lang)}</p>
          <div class="grid">
            <label class="field">
              <span class="label">${a("fullName",this._lang)}</span>
              <input class="input" .value=${this._fullName} @input=${t=>this._fullName=t.target.value} />
            </label>
            <label class="field">
              <span class="label">${a("workspaceName",this._lang)}</span>
              <input class="input" .value=${this._tenantName} @input=${t=>this._tenantName=t.target.value} />
            </label>
            <label class="field full">
              <span class="label">${a("email",this._lang)}</span>
              <input class="input" type="email" autocomplete="email" .value=${this._email} @input=${t=>this._email=t.target.value} />
            </label>
            <label class="field full">
              <span class="label">${a("password",this._lang)}</span>
              <input class="input" type="password" autocomplete="new-password" .value=${this._password} @input=${t=>this._password=t.target.value} />
            </label>
          </div>
          ${this._error?n`<div class="error">${this._error}</div>`:""}
          <div class="footer">
            <a class="link" @click=${()=>s.navigate("sign-in")}>${a("alreadyHave",this._lang)} ${a("signInLink",this._lang)}</a>
            <button class="btn btn-primary" type="submit" ?disabled=${this._loading}>
              ${this._loading?a("creatingWorkspace",this._lang):a("createWorkspace",this._lang)}
            </button>
          </div>
        </form>
      </div>
    `}}customElements.define("sign-up-view",c);
