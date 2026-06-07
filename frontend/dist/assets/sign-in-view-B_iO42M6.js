import{i as n,b as o,a as c,g as s,s as d,r as t,c as a,d as r,e as l}from"./index-BdK4FrM0.js";class p extends n{static properties={_email:{type:String,state:!0},_password:{type:String,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_lang:{type:String,state:!0}};static styles=[o,c`
    :host { display:block; min-height:100vh; color:var(--color-text-primary); }
    .auth-shell { min-height:100vh; display:grid; grid-template-columns:minmax(320px,520px) 1fr; background:radial-gradient(circle at top left, rgba(91,141,239,0.22), transparent 30%), linear-gradient(135deg, #07111f 0%, #0b1627 48%, #111d2f 100%); }
    .panel { display:flex; flex-direction:column; justify-content:center; padding:clamp(24px,5vw,56px); background:rgba(7,14,24,0.88); border-right:1px solid rgba(255,255,255,0.06); backdrop-filter:blur(12px); }
    .hero { display:flex; flex-direction:column; justify-content:center; gap:var(--space-5); padding:clamp(24px,5vw,64px); }
    .eyebrow { font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#8aa3d8; font-weight:700; }
    .header-row { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px; }
    .lang-toggle { display:flex; gap:8px; }
    h1 { margin:0 0 var(--space-2); font-size:clamp(28px,4vw,54px); line-height:1.02; }
    p { margin:0; color:var(--color-text-muted); line-height:1.6; }
    .card-title { font-size:28px; margin:0 0 8px; }
    .card-sub { color:var(--color-text-muted); margin-bottom:24px; }
    .stack { display:flex; flex-direction:column; gap:16px; }
    .field { display:flex; flex-direction:column; gap:8px; }
    .label { font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:var(--color-text-muted); font-weight:700; }
    .input { width:100%; padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.09); background:rgba(255,255,255,0.03); color:var(--color-text-primary); font-size:14px; outline:none; }
    .input:focus { border-color:rgba(91,141,239,0.7); box-shadow:0 0 0 3px rgba(91,141,239,0.18); }
    .error { padding:12px 14px; border-radius:12px; background:rgba(240,74,94,0.1); border:1px solid rgba(240,74,94,0.25); color:#ff99a6; font-size:13px; }
    .actions { display:flex; flex-direction:column; gap:12px; margin-top:8px; }
    .switch-row { display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; }
    .switch { font-size:13px; color:var(--color-text-muted); }
    .switch a { color:#8db2ff; cursor:pointer; text-decoration:none; }
    .metrics { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:16px; margin-top:12px; }
    .metric { padding:18px; border-radius:18px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); }
    .metric-label { font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#7e93be; }
    .metric-value { margin-top:10px; font-size:24px; font-weight:700; }
    @media (max-width:900px) { .auth-shell { grid-template-columns:1fr; } .hero { order:-1; min-height:260px; } .metrics { grid-template-columns:1fr; } }
  `];constructor(){super(),this._email="",this._password="",this._loading=!1,this._error="",this._lang=s()}connectedCallback(){super.connectedCallback(),this._langHandler=()=>{this._lang=s()},window.addEventListener("capintel-lang-changed",this._langHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-lang-changed",this._langHandler)}async _submit(e){e.preventDefault(),this._loading=!0,this._error="";try{await d({email:this._email.trim(),password:this._password}),window.dispatchEvent(new CustomEvent("capintel-auth-changed")),t.navigate("overview")}catch(i){this._error=i?.data?.detail||i.message||"Unable to sign in."}finally{this._loading=!1}}render(){return l`
      <div class="auth-shell">
        <section class="panel">
          <div class="header-row">
            <div class="eyebrow">${a("product",this._lang)}</div>
            <div class="lang-toggle">
              <button class="btn ${this._lang==="es"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>r("es")}>ES</button>
              <button class="btn ${this._lang==="en"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>r("en")}>EN</button>
            </div>
          </div>
          <h2 class="card-title">${a("signIn",this._lang)}</h2>
          <div class="card-sub">${a("signInSubtitle",this._lang)}</div>
          <form class="stack" @submit=${this._submit}>
            <label class="field">
              <span class="label">${a("email",this._lang)}</span>
              <input class="input" type="email" autocomplete="email" .value=${this._email} @input=${e=>this._email=e.target.value} />
            </label>
            <label class="field">
              <span class="label">${a("password",this._lang)}</span>
              <input class="input" type="password" autocomplete="current-password" .value=${this._password} @input=${e=>this._password=e.target.value} />
            </label>
            ${this._error?l`<div class="error">${this._error}</div>`:""}
            <div class="actions">
              <button class="btn btn-primary" type="submit" ?disabled=${this._loading}>
                ${this._loading?a("signingIn",this._lang):a("signInButton",this._lang)}
              </button>
              <div class="switch-row">
                <div class="switch">
                  ${a("noAccount",this._lang)}
                  <a @click=${()=>t.navigate("sign-up")}>${a("createAccount",this._lang)}</a>
                </div>
                <div class="switch">
                  <a @click=${()=>t.navigate("forgot-password")}>${a("forgotPassword",this._lang)}</a>
                </div>
              </div>
            </div>
          </form>
        </section>
        <section class="hero">
          <div class="eyebrow">${a("cockpit",this._lang)}</div>
          <h1>Worker dashboard, pero listo para evolucionar.</h1>
          <p>Esta capa nueva separa acceso, espacio de trabajo y experiencia visual del plano operacional. Eso nos permite migrar tabs, endurecer backend y mejorar el producto sin repetir deuda del monolito.</p>
          <div class="metrics">
            <div class="metric">
              <div class="metric-label">${a("workspaceIsolation",this._lang)}</div>
              <div class="metric-value">Live</div>
            </div>
            <div class="metric">
              <div class="metric-label">${a("authEntry",this._lang)}</div>
              <div class="metric-value">Phase 1</div>
            </div>
            <div class="metric">
              <div class="metric-label">${a("migrationPath",this._lang)}</div>
              <div class="metric-value">Tab by Tab</div>
            </div>
          </div>
        </section>
      </div>
    `}}customElements.define("sign-in-view",p);
