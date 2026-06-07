const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/miners-view-Bn98d26V.js","assets/repeat-CeHd_txR.js","assets/domain-state-DjGkhkio.js","assets/opportunities-view-V4pjvd50.js","assets/scalping-view-Dj8q9Fok.js","assets/btc-ladder-view-DRc3H2nt.js","assets/discovery-view-CTIoTKny.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();const He="modulepreload",Ke=function(r){return"/dashboard/"+r},ue={},f=function(e,t,a){let s=Promise.resolve();if(t&&t.length>0){let l=function(u){return Promise.all(u.map(h=>Promise.resolve(h).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),d=n?.nonce||n?.getAttribute("nonce");s=l(t.map(u=>{if(u=Ke(u),u in ue)return;ue[u]=!0;const h=u.endsWith(".css"),p=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${p}`))return;const v=document.createElement("link");if(v.rel=h?"stylesheet":He,h||(v.as="script"),v.crossOrigin="",v.href=u,d&&v.setAttribute("nonce",d),document.head.appendChild(v),h)return new Promise((y,E)=>{v.addEventListener("load",y),v.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(n){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=n,window.dispatchEvent(d),!d.defaultPrevented)throw n}return s.then(n=>{for(const d of n||[])d.status==="rejected"&&i(d.reason);return e().catch(i)})};const H=globalThis,re=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ae=Symbol(),he=new WeakMap;let Te=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(re&&e===void 0){const a=t!==void 0&&t.length===1;a&&(e=he.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&he.set(t,e))}return e}toString(){return this.cssText}};const Ve=r=>new Te(typeof r=="string"?r:r+"",void 0,ae),b=(r,...e)=>{const t=r.length===1?r[0]:e.reduce((a,s,i)=>a+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[i+1],r[0]);return new Te(t,r,ae)},Ge=(r,e)=>{if(re)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const a=document.createElement("style"),s=H.litNonce;s!==void 0&&a.setAttribute("nonce",s),a.textContent=t.cssText,r.appendChild(a)}},ge=re?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(const a of e.cssRules)t+=a.cssText;return Ve(t)})(r):r;const{is:Je,defineProperty:Ye,getOwnPropertyDescriptor:We,getOwnPropertyNames:qe,getOwnPropertySymbols:Xe,getPrototypeOf:Ze}=Object,J=globalThis,ve=J.trustedTypes,Qe=ve?ve.emptyScript:"",et=J.reactiveElementPolyfillSupport,N=(r,e)=>r,Q={toAttribute(r,e){switch(e){case Boolean:r=r?Qe:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Ie=(r,e)=>!Je(r,e),me={attribute:!0,type:String,converter:Q,reflect:!1,useDefault:!1,hasChanged:Ie};Symbol.metadata??=Symbol("metadata"),J.litPropertyMetadata??=new WeakMap;let P=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=me){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const a=Symbol(),s=this.getPropertyDescriptor(e,a,t);s!==void 0&&Ye(this.prototype,e,s)}}static getPropertyDescriptor(e,t,a){const{get:s,set:i}=We(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:s,set(n){const d=s?.call(this);i?.call(this,n),this.requestUpdate(e,d,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??me}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;const e=Ze(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){const t=this.properties,a=[...qe(t),...Xe(t)];for(const s of a)this.createProperty(s,t[s])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[a,s]of t)this.elementProperties.set(a,s)}this._$Eh=new Map;for(const[t,a]of this.elementProperties){const s=this._$Eu(t,a);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const s of a)t.unshift(ge(s))}else e!==void 0&&t.push(ge(e));return t}static _$Eu(e,t){const a=t.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ge(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){const a=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,a);if(s!==void 0&&a.reflect===!0){const i=(a.converter?.toAttribute!==void 0?a.converter:Q).toAttribute(t,a.type);this._$Em=e,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(e,t){const a=this.constructor,s=a._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const i=a.getPropertyOptions(s),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Q;this._$Em=s;const d=n.fromAttribute(t,i.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(e,t,a,s=!1,i){if(e!==void 0){const n=this.constructor;if(s===!1&&(i=this[e]),a??=n.getPropertyOptions(e),!((a.hasChanged??Ie)(i,t)||a.useDefault&&a.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,a))))return;this.C(e,t,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:s,wrapped:i},n){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),i!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}const a=this.constructor.elementProperties;if(a.size>0)for(const[s,i]of a){const{wrapped:n}=i,d=this[s];n!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,i,d)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(a=>a.hostUpdate?.()),this.update(t)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};P.elementStyles=[],P.shadowRootOptions={mode:"open"},P[N("elementProperties")]=new Map,P[N("finalized")]=new Map,et?.({ReactiveElement:P}),(J.reactiveElementVersions??=[]).push("2.1.2");const se=globalThis,be=r=>r,K=se.trustedTypes,fe=K?K.createPolicy("lit-html",{createHTML:r=>r}):void 0,Le="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,Me="?"+w,tt=`<${Me}>`,A=document,R=()=>A.createComment(""),U=r=>r===null||typeof r!="object"&&typeof r!="function",ie=Array.isArray,rt=r=>ie(r)||typeof r?.[Symbol.iterator]=="function",X=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ye=/-->/g,xe=/>/g,$=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_e=/'/g,we=/"/g,ze=/^(?:script|style|textarea|title)$/i,Ne=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),o=Ne(1),Qt=Ne(2),O=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),$e=new WeakMap,S=A.createTreeWalker(A,129);function De(r,e){if(!ie(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return fe!==void 0?fe.createHTML(e):e}const at=(r,e)=>{const t=r.length-1,a=[];let s,i=e===2?"<svg>":e===3?"<math>":"",n=L;for(let d=0;d<t;d++){const l=r[d];let u,h,p=-1,v=0;for(;v<l.length&&(n.lastIndex=v,h=n.exec(l),h!==null);)v=n.lastIndex,n===L?h[1]==="!--"?n=ye:h[1]!==void 0?n=xe:h[2]!==void 0?(ze.test(h[2])&&(s=RegExp("</"+h[2],"g")),n=$):h[3]!==void 0&&(n=$):n===$?h[0]===">"?(n=s??L,p=-1):h[1]===void 0?p=-2:(p=n.lastIndex-h[2].length,u=h[1],n=h[3]===void 0?$:h[3]==='"'?we:_e):n===we||n===_e?n=$:n===ye||n===xe?n=L:(n=$,s=void 0);const y=n===$&&r[d+1].startsWith("/>")?" ":"";i+=n===L?l+tt:p>=0?(a.push(u),l.slice(0,p)+Le+l.slice(p)+w+y):l+w+(p===-2?d:y)}return[De(r,i+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),a]};class B{constructor({strings:e,_$litType$:t},a){let s;this.parts=[];let i=0,n=0;const d=e.length-1,l=this.parts,[u,h]=at(e,t);if(this.el=B.createElement(u,a),S.currentNode=this.el.content,t===2||t===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=S.nextNode())!==null&&l.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(const p of s.getAttributeNames())if(p.endsWith(Le)){const v=h[n++],y=s.getAttribute(p).split(w),E=/([.?@])?(.*)/.exec(v);l.push({type:1,index:i,name:E[2],strings:y,ctor:E[1]==="."?it:E[1]==="?"?nt:E[1]==="@"?ot:Y}),s.removeAttribute(p)}else p.startsWith(w)&&(l.push({type:6,index:i}),s.removeAttribute(p));if(ze.test(s.tagName)){const p=s.textContent.split(w),v=p.length-1;if(v>0){s.textContent=K?K.emptyScript:"";for(let y=0;y<v;y++)s.append(p[y],R()),S.nextNode(),l.push({type:2,index:++i});s.append(p[v],R())}}}else if(s.nodeType===8)if(s.data===Me)l.push({type:2,index:i});else{let p=-1;for(;(p=s.data.indexOf(w,p+1))!==-1;)l.push({type:7,index:i}),p+=w.length-1}i++}}static createElement(e,t){const a=A.createElement("template");return a.innerHTML=e,a}}function T(r,e,t=r,a){if(e===O)return e;let s=a!==void 0?t._$Co?.[a]:t._$Cl;const i=U(e)?void 0:e._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(r),s._$AT(r,t,a)),a!==void 0?(t._$Co??=[])[a]=s:t._$Cl=s),s!==void 0&&(e=T(r,s._$AS(r,e.values),s,a)),e}class st{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:a}=this._$AD,s=(e?.creationScope??A).importNode(t,!0);S.currentNode=s;let i=S.nextNode(),n=0,d=0,l=a[0];for(;l!==void 0;){if(n===l.index){let u;l.type===2?u=new I(i,i.nextSibling,this,e):l.type===1?u=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(u=new lt(i,this,e)),this._$AV.push(u),l=a[++d]}n!==l?.index&&(i=S.nextNode(),n++)}return S.currentNode=A,s}p(e){let t=0;for(const a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}}class I{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,s){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=T(this,e,t),U(e)?e===m||e==null||e===""?(this._$AH!==m&&this._$AR(),this._$AH=m):e!==this._$AH&&e!==O&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):rt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==m&&U(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:a}=e,s=typeof a=="number"?this._$AC(e):(a.el===void 0&&(a.el=B.createElement(De(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===s)this._$AH.p(t);else{const i=new st(s,this),n=i.u(this.options);i.p(t),this.T(n),this._$AH=i}}_$AC(e){let t=$e.get(e.strings);return t===void 0&&$e.set(e.strings,t=new B(e)),t}k(e){ie(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let a,s=0;for(const i of e)s===t.length?t.push(a=new I(this.O(R()),this.O(R()),this,this.options)):a=t[s],a._$AI(i),s++;s<t.length&&(this._$AR(a&&a._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const a=be(e).nextSibling;be(e).remove(),e=a}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,s,i){this.type=1,this._$AH=m,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=i,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=m}_$AI(e,t=this,a,s){const i=this.strings;let n=!1;if(i===void 0)e=T(this,e,t,0),n=!U(e)||e!==this._$AH&&e!==O,n&&(this._$AH=e);else{const d=e;let l,u;for(e=i[0],l=0;l<i.length-1;l++)u=T(this,d[a+l],t,l),u===O&&(u=this._$AH[l]),n||=!U(u)||u!==this._$AH[l],u===m?e=m:e!==m&&(e+=(u??"")+i[l+1]),this._$AH[l]=u}n&&!s&&this.j(e)}j(e){e===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class it extends Y{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===m?void 0:e}}class nt extends Y{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==m)}}class ot extends Y{constructor(e,t,a,s,i){super(e,t,a,s,i),this.type=5}_$AI(e,t=this){if((e=T(this,e,t,0)??m)===O)return;const a=this._$AH,s=e===m&&a!==m||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,i=e!==m&&(a===m||s);s&&this.element.removeEventListener(this.name,this,a),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class lt{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){T(this,e)}}const er={I},ct=se.litHtmlPolyfillSupport;ct?.(B,I),(se.litHtmlVersions??=[]).push("3.3.3");const dt=(r,e,t)=>{const a=t?.renderBefore??e;let s=a._$litPart$;if(s===void 0){const i=t?.renderBefore??null;a._$litPart$=s=new I(e.insertBefore(R(),i),i,void 0,t??{})}return s._$AI(r),s};const ne=globalThis;class g extends P{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=dt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return O}}g._$litElement$=!0,g.finalized=!0,ne.litElementHydrateSupport?.({LitElement:g});const pt=ne.litElementPolyfillSupport;pt?.({LitElement:g});(ne.litElementVersions??=[]).push("4.2.2");const ut={"sign-in":"sign-in","sign-up":"sign-up","forgot-password":"forgot-password","reset-password":"reset-password",capital:"capital",overview:"overview",miners:"miners",opportunities:"opportunities",scalping:"scalping","btc-core":"btc-core","btc-ladder":"btc-ladder",discovery:"discovery",settings:"settings"},ht=[{id:"capital",label:{es:"Capital",en:"Capital"},icon:"◐",group:"main"},{id:"overview",label:{es:"Resumen",en:"Overview"},icon:"◈",group:"main"},{id:"miners",label:{es:"Mineros Activos",en:"Active Miners"},icon:"⬡",group:"operations"},{id:"opportunities",label:{es:"Oportunidades",en:"Opportunities"},icon:"◆",group:"operations"},{id:"scalping",label:{es:"Scalping Lab",en:"Scalping Lab"},icon:"⚡",group:"operations"},{id:"btc-core",label:{es:"BTC Core",en:"BTC Core"},icon:"₿",group:"btc"},{id:"btc-ladder",label:{es:"BTC Ladder",en:"BTC Ladder"},icon:"≡",group:"btc"},{id:"discovery",label:{es:"Discovery",en:"Discovery"},icon:"◎",group:"research"},{id:"settings",label:{es:"Configuración",en:"Settings"},icon:"⚙",group:"system"}];class gt{constructor(){this._listeners=[],this._current=this._parseRoute(),window.addEventListener("hashchange",()=>this._onHashChange())}_parseRoute(){const t=window.location.hash.replace("#/","").replace("#","").split("?")[0];return t&&ut[t]?t:"sign-in"}_onHashChange(){const e=this._parseRoute();e!==this._current&&(this._current=e,this._notify())}get current(){return this._current}navigate(e,t=""){window.location.hash=`/${e}${t?`?${t}`:""}`}onChange(e){return this._listeners.push(e),()=>{this._listeners=this._listeners.filter(t=>t!==e)}}_notify(){this._listeners.forEach(e=>e(this._current))}}const C=new gt,k={save(r,e){try{localStorage.setItem(r,JSON.stringify({...e,_savedAt:Date.now()}))}catch(t){console.warn("[persistence] save failed:",t)}},load(r){try{const e=localStorage.getItem(r);return e?JSON.parse(e):null}catch(e){return console.warn("[persistence] load failed:",e),null}},remove(r){try{localStorage.removeItem(r)}catch{}},exportAll(){const r={};try{for(let e=0;e<localStorage.length;e++){const t=localStorage.key(e);t?.startsWith("capintel_")&&(r[t]=JSON.parse(localStorage.getItem(t)||"null"))}}catch(e){console.warn("[persistence] export failed:",e)}return r},importAll(r){try{return Object.entries(r).forEach(([e,t])=>{e.startsWith("capintel_")&&localStorage.setItem(e,JSON.stringify(t))}),!0}catch(e){return console.warn("[persistence] import failed:",e),!1}}},Se="capintel_state",ke="capintel_audit",vt=200,mt={totalCapital:0,freeUsdt:0,openPnl:0,monthlyPnl:0,riskScore:0,monthlyGoal:1e4,monthlyGoalProgress:52.1,capitalMiners:38e3,capitalScalp:8500,capitalBtcCore:15600,capitalLadder:13050,capitalIdle:12300,activeMinersCount:0,minerWarnings:0,newOpportunities:3,theme:"dark",refreshInterval:30,lastUpdated:Date.now()};class bt{constructor(){const t=k.load(Se)?.prefs||{};this._state={...mt,...t},this._listeners=[];const a=k.load(ke);this._auditEvents=a?.events||[]}getState(){return{...this._state}}setState(e){this._state={...this._state,...e,lastUpdated:Date.now()},this._persist(),this._notify()}subscribe(e){return this._listeners.push(e),()=>{this._listeners=this._listeners.filter(t=>t!==e)}}refresh(){const e=()=>(Math.random()-.5)*200;this.setState({openPnl:parseFloat((this._state.openPnl+e()).toFixed(2)),freeUsdt:parseFloat((this._state.freeUsdt+e()*.1).toFixed(2))})}addAuditEvent({action:e,domain:t,payload:a={},result:s={},triggeredBy:i="user"}){const n={id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,timestamp:new Date().toISOString(),action:e,domain:t,triggeredBy:i,payload:a,result:s};return this._auditEvents=[n,...this._auditEvents].slice(0,vt),this._persistAudit(),n}getAuditEvents({domain:e,limit:t=50}={}){let a=this._auditEvents;return e&&(a=a.filter(s=>s.domain===e)),a.slice(0,t)}clearAudit(){this._auditEvents=[],this._persistAudit()}_persist(){k.save(Se,{prefs:{theme:this._state.theme,refreshInterval:this._state.refreshInterval}})}_persistAudit(){k.save(ke,{events:this._auditEvents})}_notify(){this._listeners.forEach(e=>e(this.getState()))}}const F=new bt,ft=Object.freeze(Object.defineProperty({__proto__:null,store:F},Symbol.toStringTag,{value:"Module"})),yt="/api/v1",xt=300,_t="capintel_settings",wt="capintel_auth";class $t extends Error{constructor(e,t,a=null){super(t),this.status=e,this.data=a}}async function tr(r,e=xt){return await new Promise(t=>setTimeout(t,e)),{data:r,ok:!0}}function oe(){try{return JSON.parse(window.localStorage.getItem(_t)??"{}")}catch{return{}}}function Re(){try{return JSON.parse(window.localStorage.getItem(wt)??"{}")}catch{return{}}}function St(){const r=Re(),e=oe();return r.tenantApiKey?.trim()||e.tenantApiKey?.trim()||""}function kt(){const r=oe();return r.exchangeApiSecret?.trim()||r.apiSecret?.trim()||""}function rr(){const e=oe().exchangeApiKey?.trim()||"",t=kt();return{...e?{api_key:e}:{},...t?{api_secret:t}:{}}}async function _(r,e={}){const t=`${yt}${r}`,a=St(),s=Re().token?.trim()||"",i={"Content-Type":"application/json",...a?{"X-API-Key":a}:{},...s?{Authorization:`Bearer ${s}`}:{},...e.headers},n=await fetch(t,{...e,headers:i});if(!n.ok){const d=await n.json().catch(()=>null);throw new $t(n.status,n.statusText,d)}return n.status===204?null:n.json()}const le="capintel_auth",V="capintel_settings";function ce(r){try{return JSON.parse(window.localStorage.getItem(r)??"{}")}catch{return{}}}function ee(r,e){window.localStorage.setItem(r,JSON.stringify(e))}function D(){const r=ce(le);return r?.token?r:null}function de(r){const e={token:r.token,expiresAt:r.expiresAt,tenantApiKey:r.tenantApiKey,user:r.user,tenant:r.tenant};ee(le,e);const t=ce(V);ee(V,{...t,tenantApiKey:r.tenantApiKey})}function At(){const r=D(),e=ce(V);if(e.tenantApiKey&&e.tenantApiKey===r?.tenantApiKey){const{tenantApiKey:t,...a}=e;ee(V,a)}window.localStorage.removeItem(le)}function Z(r=D()){return!r?.token||!r?.expiresAt?!1:Number(r.expiresAt)*1e3>Date.now()}async function ar(r){const e=await _("/auth/sign-up",{method:"POST",body:JSON.stringify(r)});return de(e),e}async function sr(r){const e=await _("/auth/sign-in",{method:"POST",body:JSON.stringify(r)});return de(e),e}async function Et(){return _("/auth/me")}async function ir(r){return _("/auth/forgot-password",{method:"POST",body:JSON.stringify(r)})}async function nr(r){return _("/auth/reset-password",{method:"POST",body:JSON.stringify(r)})}function Ae(){At()}const pe="capintel_lang",Ue="capintel_timezone",Ct="es",Be="America/Bogota",Ee={es:"es-CO",en:"en-US"},Ce={es:{product:"Capa de control Pionex",signIn:"Inicia sesión",signUp:"Crea tu espacio de trabajo",forgot:"Recupera tu cuenta",reset:"Restablece tu contraseña",email:"Correo",password:"Contraseña",newPassword:"Nueva contraseña",fullName:"Nombre completo",workspaceName:"Nombre del espacio",signInSubtitle:"Accede a tu espacio de trabajo para abrir el dashboard nuevo y continuar la migración por pestañas.",signUpSubtitle:"Este flujo crea el espacio principal, el usuario inicial y la llave interna con la que el frontend nuevo consume el backend.",forgotSubtitle:"Ingresa tu correo y prepararemos el flujo de recuperación.",resetSubtitle:"Define una nueva contraseña para volver a entrar.",signInButton:"Entrar al dashboard",signingIn:"Ingresando...",createWorkspace:"Crear espacio",creatingWorkspace:"Creando espacio...",sendRecovery:"Enviar recuperación",sendingRecovery:"Preparando recuperación...",updatePassword:"Actualizar contraseña",updatingPassword:"Actualizando...",noAccount:"¿Aún no tienes una cuenta?",createAccount:"Crear cuenta",alreadyHave:"¿Ya tienes una cuenta?",signInLink:"Inicia sesión",forgotPassword:"Olvidé mi contraseña",backToSignIn:"Volver al inicio de sesión",localRecovery:"En entorno local se muestra el enlace directo para probar la recuperación sin correo.",workspaceIsolation:"Aislamiento por espacio",authEntry:"Entrada de acceso",migrationPath:"Ruta de migración",cockpit:"Centro operativo",shellOverview:"Resumen",shellCapital:"Capital",shellMiners:"Mineros Activos",shellOpportunities:"Oportunidades",shellScalping:"Scalping Lab",shellBtcCore:"BTC Core",shellBtcLadder:"BTC Ladder",shellDiscovery:"Discovery",shellSettings:"Configuración",shellDashboard:"Dashboard",shellOperations:"Operación",shellBitcoin:"Bitcoin",shellResearch:"Research",shellSystem:"Sistema",totalCapital:"Capital total",freeUsdt:"USDT libre",openPnl:"PnL abierto",monthlyPnl:"PnL mensual",refresh:"Actualizar",signOut:"Salir",workspace:"Espacio",language:"Idioma",timezone:"Zona horaria",detectTimezone:"Detectar zona horaria",detectedTimezone:"Zona detectada del navegador",preferences:"Preferencias",exchangeApiConfiguration:"Configuración de API del exchange",exchange:"Exchange",apiKey:"API Key",apiSecret:"API Secret",apiKeyHint:"Se requieren permisos de lectura y trading. El permiso de retiro no es necesario y debe permanecer desactivado.",credentialsStored:"Las credenciales están guardadas en backend para este espacio. Llave detectada:",credentialsReplace:"Si llenas estos campos y guardas, se reemplazan.",noCredentialsStored:"Todavía no hay credenciales persistidas en backend para este espacio.",riskProfile:"Perfil de riesgo",planTier:"Plan",freePlan:"Free",proPlan:"Pro",premiumPlan:"Premium",riskLimits:"Límites de riesgo",conservative:"Conservador",moderate:"Moderado",aggressive:"Agresivo",conservativeDesc:"Máximo 60% desplegado, máximo 5x de apalancamiento, solo estrategias de bajo riesgo.",moderateDesc:"Máximo 85% desplegado, máximo 10x de apalancamiento, todas las estrategias permitidas.",aggressiveDesc:"Máximo 95% desplegado, máximo 20x de apalancamiento, conjunto completo de estrategias.",maxCapitalDeployed:"Capital máximo desplegado (%)",maxLeverage:"Apalancamiento máximo",refreshIntervalSeconds:"Intervalo de actualización (s)",fixedIncomeAnnualPct:"Tasa anual de renta fija (%)",fixedIncomeAnnualPctHint:"Si no la cambias, usa 3.48% como referencia base del Treasury a 1 año de EE. UU.",saveSettings:"Guardar configuración",saving:"Guardando...",saved:"Guardado",dataManagement:"Gestión de datos",exportDashboardState:"Exportar estado del dashboard",exportDashboardSub:"Descarga configuraciones locales, preferencias y filtros en JSON.",importDashboardState:"Importar estado del dashboard",importDashboardSub:"Restaura un respaldo JSON exportado previamente.",clearLocalStorage:"Limpiar almacenamiento local",clearLocalStorageSub:"Elimina preferencias locales del dashboard y restablece los valores por defecto.",exportJson:"Exportar JSON",importJson:"Importar JSON",clearAll:"Limpiar todo",about:"Acerca de",version:"Versión",architecture:"Arquitectura",apiBase:"Base API",dataMode:"Modo de datos",settingsPersistenceActive:"La persistencia backend por espacio para auth y settings ya está activa.",settingsSavedToast:"Configuración guardada",apiValidated:"Las credenciales de Pionex fueron validadas correctamente.",pageOverviewSubtitle:"Inteligencia de capital en un solo vistazo",pageCapitalSubtitle:"Desglose de asignación e historial",pageMinersSubtitle:"Posiciones grid perpetuas por minero",pageOpportunitiesSubtitle:"Análisis de candidatos y simulación",pageScalpingSubtitle:"Escaneo de señales y ejecución",pageBtcCoreSubtitle:"Estrategia de acumulación de Bitcoin",pageBtcLadderSubtitle:"Gestión de órdenes escalonadas DCA",pageDiscoverySubtitle:"Escaneo de universo e incorporación de símbolos",pageSettingsSubtitle:"API, riesgo y preferencias persistentes",connected:"Conectado",disconnected:"Desconectado",genericTryAgain:"Error interno del servidor. Intenta de nuevo.",settingsLoadError:"No se pudo cargar la configuración del espacio.",settingsSaveError:"No se pudo guardar la configuración del espacio.",importFailed:"La importación falló"},en:{product:"Pionex Control Layer",signIn:"Sign in",signUp:"Create your workspace",forgot:"Recover your account",reset:"Reset your password",email:"Email",password:"Password",newPassword:"New password",fullName:"Full name",workspaceName:"Workspace name",signInSubtitle:"Access your workspace to open the new dashboard and continue the tab-by-tab migration.",signUpSubtitle:"This flow creates the main workspace, the initial user, and the internal key used by the new frontend.",forgotSubtitle:"Enter your email and we will prepare the recovery flow.",resetSubtitle:"Set a new password to sign in again.",signInButton:"Enter dashboard",signingIn:"Signing in...",createWorkspace:"Create workspace",creatingWorkspace:"Creating workspace...",sendRecovery:"Send recovery",sendingRecovery:"Preparing recovery...",updatePassword:"Update password",updatingPassword:"Updating...",noAccount:"Don't have an account yet?",createAccount:"Create account",alreadyHave:"Already have an account?",signInLink:"Sign in",forgotPassword:"Forgot password?",backToSignIn:"Back to sign in",localRecovery:"In local mode the app shows the direct recovery link so you can test without email.",workspaceIsolation:"Workspace isolation",authEntry:"Auth entry",migrationPath:"Migration path",cockpit:"Trading cockpit",shellOverview:"Overview",shellCapital:"Capital",shellMiners:"Active Miners",shellOpportunities:"Opportunities",shellScalping:"Scalping Lab",shellBtcCore:"BTC Core",shellBtcLadder:"BTC Ladder",shellDiscovery:"Discovery",shellSettings:"Settings",shellDashboard:"Dashboard",shellOperations:"Operations",shellBitcoin:"Bitcoin",shellResearch:"Research",shellSystem:"System",totalCapital:"Total capital",freeUsdt:"Free USDT",openPnl:"Open PnL",monthlyPnl:"Monthly PnL",refresh:"Refresh",signOut:"Sign out",workspace:"Workspace",language:"Language",timezone:"Timezone",detectTimezone:"Detect timezone",detectedTimezone:"Detected from browser",preferences:"Preferences",exchangeApiConfiguration:"Exchange API configuration",exchange:"Exchange",apiKey:"API key",apiSecret:"API secret",apiKeyHint:"Read and trade permissions are required. Withdraw permission is not needed and should remain disabled.",credentialsStored:"Credentials are stored in the backend for this workspace. Detected key:",credentialsReplace:"If you fill these fields and save, they will be replaced.",noCredentialsStored:"There are no persisted backend credentials for this workspace yet.",riskProfile:"Risk profile",planTier:"Plan",freePlan:"Free",proPlan:"Pro",premiumPlan:"Premium",riskLimits:"Risk limits",conservative:"Conservative",moderate:"Moderate",aggressive:"Aggressive",conservativeDesc:"Max 60% deployed, max 5x leverage, only low-risk strategies.",moderateDesc:"Max 85% deployed, max 10x leverage, all strategies allowed.",aggressiveDesc:"Max 95% deployed, max 20x leverage, full strategy set.",maxCapitalDeployed:"Max capital deployed (%)",maxLeverage:"Max leverage",refreshIntervalSeconds:"Refresh interval (s)",fixedIncomeAnnualPct:"Fixed income annual rate (%)",fixedIncomeAnnualPctHint:"If unchanged, it uses 3.48% as the base reference from the U.S. 1-year Treasury yield.",saveSettings:"Save settings",saving:"Saving...",saved:"Saved",dataManagement:"Data management",exportDashboardState:"Export dashboard state",exportDashboardSub:"Download local settings, preferences, and filters as JSON.",importDashboardState:"Import dashboard state",importDashboardSub:"Restore from a previously exported JSON backup.",clearLocalStorage:"Clear local storage",clearLocalStorageSub:"Remove local dashboard preferences and reset defaults.",exportJson:"Export JSON",importJson:"Import JSON",clearAll:"Clear all",about:"About",version:"Version",architecture:"Architecture",apiBase:"API base",dataMode:"Data mode",settingsPersistenceActive:"Workspace-aware backend persistence for auth and settings is now active.",settingsSavedToast:"Settings saved",apiValidated:"Pionex credentials were validated successfully.",pageOverviewSubtitle:"Capital intelligence at a glance",pageCapitalSubtitle:"Allocation breakdown and history",pageMinersSubtitle:"Perpetual futures grid positions",pageOpportunitiesSubtitle:"Candidate analysis and simulation",pageScalpingSubtitle:"Signal scan and execution",pageBtcCoreSubtitle:"Bitcoin accumulation strategy",pageBtcLadderSubtitle:"DCA ladder order management",pageDiscoverySubtitle:"Universe scan and symbol intake",pageSettingsSubtitle:"API, risk, and persistent preferences",connected:"Connected",disconnected:"Disconnected",genericTryAgain:"Internal server error. Please try again.",settingsLoadError:"Failed to load workspace settings.",settingsSaveError:"Failed to save workspace settings.",importFailed:"Import failed"}};function j(r){return r==="en"?"en":"es"}function Fe(){window.dispatchEvent(new CustomEvent("capintel-locale-changed")),window.dispatchEvent(new CustomEvent("capintel-lang-changed"))}function je(){return Intl.DateTimeFormat().resolvedOptions().timeZone||Be}function x(){return j(window.localStorage.getItem(pe)||Ct)}function G(){return window.localStorage.getItem(Ue)||je()}function W(r=x()){return Ee[j(r)]||Ee.es}function Pt(r){window.localStorage.setItem(pe,j(r)),Fe()}function Ot({language:r,timezone:e}={}){r&&window.localStorage.setItem(pe,j(r)),e&&window.localStorage.setItem(Ue,String(e).trim()||Be),Fe()}function c(r,e=x()){const t=j(e);return Ce[t]?.[r]||Ce.es[r]||r}function Tt(r,e={}){return new Intl.NumberFormat(W(),{maximumFractionDigits:0,...e}).format(Number(r||0))}function M(r,e={}){return new Intl.NumberFormat(W(),{style:"currency",currency:"USD",maximumFractionDigits:0,...e}).format(Number(r||0))}function Pe(r,e={}){return new Intl.DateTimeFormat(W(),{timeZone:G(),...e}).format(new Date(r))}function or(){const e=[je(),"America/Bogota","America/New_York","America/Mexico_City","America/Los_Angeles","Europe/Madrid","UTC"].filter(Boolean);return[...new Set(e)]}const te="capintel_settings";function Oe(r){const e=k.load(te)||{};k.save(te,{...e,exchange:r.exchange,exchangeApiKey:e.exchangeApiKey||"",exchangeApiSecret:e.exchangeApiSecret||"",riskProfile:r.riskProfile,maxCapPct:r.maxCapPct,maxLeverage:r.maxLeverage,refreshInterval:r.refreshInterval,fixedIncomeAnnualPct:r.fixedIncomeAnnualPct,planTier:r.planTier||e.planTier||"free",theme:r.theme,language:r.language,timezone:r.timezone,hasExchangeApiKey:r.hasExchangeApiKey,hasExchangeApiSecret:r.hasExchangeApiSecret,exchangeApiKeyMasked:r.exchangeApiKeyMasked||null,updatedAt:r.updatedAt||null}),Ot({language:r.language,timezone:r.timezone})}const It={getCachedSettings(){return k.load(te)||{}},async getSettings(){const r=await _("/settings");return Oe(r),r},async saveSettings(r){const e=await _("/settings",{method:"POST",body:JSON.stringify(r)});return Oe(e),e},async validateApiKey({exchange:r,exchangeApiKey:e,exchangeApiSecret:t}){return _("/settings/validate-api-key",{method:"POST",body:JSON.stringify({exchange:r,exchangeApiKey:e,exchangeApiSecret:t})})},async getAuditLog({limit:r=50,domain:e}={}){const{store:t}=await f(async()=>{const{store:a}=await Promise.resolve().then(()=>ft);return{store:a}},void 0);return{data:t.getAuditEvents({limit:r,domain:e}),ok:!0}}},Lt={async getDashboard({targetDailyUsdt:r=1,fixedIncomeAnnualPct:e=null}={}){const t=new URLSearchParams({targetDailyUsdt:String(r)});return e!=null&&t.set("fixedIncomeAnnualPct",String(e)),_(`/dashboard/capital?${t.toString()}`)}},z={usd(r,e=0){return M(Math.abs(r),{minimumFractionDigits:e,maximumFractionDigits:e})},pnl(r,e=2){const t=r>=0?"+":"-",a=M(Math.abs(r),{minimumFractionDigits:e,maximumFractionDigits:e});return`${t}${a}`},pct(r,e=2){return`${r>=0?"+":""}${r.toFixed(e)}%`},pctPlain(r,e=1){return`${r.toFixed(e)}%`},compact(r){return Math.abs(r)>=1e6?`${M(r/1e6,{maximumFractionDigits:2})}M`:Math.abs(r)>=1e3?`${M(r/1e3,{maximumFractionDigits:1})}K`:M(r,{minimumFractionDigits:2,maximumFractionDigits:2})},btc(r,e=5){return`${r.toFixed(e)} BTC`},leverage(r){return`${r}x`},date(r){return Pe(r,{month:"short",day:"numeric",year:"numeric"})},datetime(r){return Pe(r,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:!1})},riskLabel(r){return r<25?x()==="en"?"Minimal":"Mínimo":r<50?x()==="en"?"Low":"Bajo":r<65?x()==="en"?"Medium":"Medio":r<80?x()==="en"?"High":"Alto":x()==="en"?"Critical":"Crítico"},riskClass(r){return r<50?"positive":r<65?"warning":"negative"},number(r,e=0){return Tt(r,{minimumFractionDigits:e,maximumFractionDigits:e})},locale(){return W()},timezone(){return G()}};class Mt extends g{static properties={_route:{type:String,state:!0},_time:{type:String,state:!0},_connected:{type:Boolean,state:!0},_navOpen:{type:Boolean,state:!0},_session:{type:Object,state:!0},_lang:{type:String,state:!0},_headerMetrics:{type:Object,state:!0},_headerMetricsRoute:{type:String,state:!0},_tickerMetrics:{type:Object,state:!0}};static styles=b`
    :host { display:flex; flex-direction:column; height:100vh; width:100vw; overflow:hidden; background:var(--color-bg-base); color:var(--color-text-primary); font-family:var(--font-sans); }
    .topbar { height:var(--topbar-height); min-height:var(--topbar-height); background:var(--color-bg-panel); border-bottom:1px solid var(--color-border-subtle); display:flex; align-items:center; padding:0 var(--space-5); gap:var(--space-6); z-index:50; }
    .topbar-brand { display:flex; align-items:center; gap:var(--space-2); width:var(--nav-width); }
    .brand-icon { width:22px; height:22px; background:var(--color-accent); border-radius:5px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#fff; flex-shrink:0; }
    .brand-name { font-size:var(--text-sm); font-weight:var(--weight-semibold); letter-spacing:var(--tracking-tight); }
    .brand-sub { font-size:var(--text-xs); color:var(--color-text-muted); letter-spacing:var(--tracking-wider); text-transform:uppercase; }
    .ticker-shell {
      flex:1;
      min-width:0;
      height:38px;
      display:flex;
      align-items:center;
      overflow:hidden;
      position:relative;
      border:1px solid var(--color-border-subtle);
      border-radius:var(--radius-md);
      background:linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.03));
    }
    .ticker-shell::before,
    .ticker-shell::after {
      content:'';
      position:absolute;
      top:0;
      bottom:0;
      width:28px;
      z-index:1;
      pointer-events:none;
    }
    .ticker-shell::before { left:0; background:linear-gradient(90deg, var(--color-bg-panel), transparent); }
    .ticker-shell::after { right:0; background:linear-gradient(270deg, var(--color-bg-panel), transparent); }
    .ticker-track {
      display:flex;
      align-items:center;
      gap:var(--space-6);
      min-width:max-content;
      white-space:nowrap;
      padding-left:var(--space-5);
      animation:tickerScroll 34s linear infinite;
    }
    .ticker-shell:hover .ticker-track { animation-play-state:paused; }
    @keyframes tickerScroll {
      from { transform:translateX(0); }
      to { transform:translateX(-50%); }
    }
    .topbar-metric { display:flex; align-items:baseline; gap:var(--space-2); }
    .topbar-metric-label { font-size:var(--text-xs); color:var(--color-text-muted); letter-spacing:var(--tracking-wide); text-transform:uppercase; }
    .topbar-metric-value {
      font-family:var(--font-mono);
      font-size:var(--text-sm);
      font-weight:var(--weight-semibold);
      letter-spacing:var(--tracking-tight);
      font-variant-numeric: tabular-nums slashed-zero;
      font-feature-settings: "tnum" 1, "zero" 1;
    }
    .metric-positive { color:var(--color-positive); }
    .metric-negative { color:var(--color-negative); }
    .metric-neutral { color:var(--color-text-primary); }
    .topbar-right { display:flex; align-items:center; gap:var(--space-4); margin-left:auto; }
    .connection-dot { width:7px; height:7px; border-radius:50%; background:var(--color-positive); box-shadow:0 0 6px var(--color-positive); animation:pulse 2s ease-in-out infinite; }
    .connection-dot.disconnected { background:var(--color-negative); box-shadow:0 0 6px var(--color-negative); animation:none; }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
    .topbar-clock { font-family:var(--font-mono); font-size:var(--text-xs); color:var(--color-text-muted); letter-spacing:var(--tracking-wide); }
    .risk-badge-topbar { display:flex; align-items:center; gap:var(--space-1); padding:3px 8px; border-radius:var(--radius-sm); font-size:var(--text-xs); font-weight:var(--weight-semibold); letter-spacing:var(--tracking-wide); text-transform:uppercase; }
    .risk-low { background:var(--color-positive-dim); color:var(--color-positive); }
    .risk-medium { background:var(--color-warning-dim); color:var(--color-warning); }
    .risk-high { background:var(--color-negative-dim); color:var(--color-negative); }
    .shell-body { display:flex; flex:1; overflow:hidden; }
    .sidenav { width:var(--nav-width); min-width:var(--nav-width); background:var(--color-bg-panel); border-right:1px solid var(--color-border-subtle); display:flex; flex-direction:column; overflow-y:auto; padding:var(--space-4) 0; }
    .nav-group { margin-bottom:var(--space-2); }
    .nav-group-label { font-size:10px; font-weight:var(--weight-semibold); letter-spacing:0.12em; text-transform:uppercase; color:var(--color-text-muted); padding:var(--space-3) var(--space-4) var(--space-1); }
    .nav-item { display:flex; align-items:center; gap:var(--space-3); padding:var(--space-2) var(--space-4); cursor:pointer; color:var(--color-text-secondary); font-size:var(--text-sm); font-weight:var(--weight-medium); position:relative; }
    .nav-item:hover { background:var(--color-bg-hover); color:var(--color-text-primary); }
    .nav-item.active { background:var(--color-accent-dim); color:var(--color-accent); }
    .nav-item.active::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:var(--color-accent); }
    .nav-icon { width:20px; display:flex; align-items:center; justify-content:center; font-size:14px; opacity:0.7; }
    .nav-badge { margin-left:auto; background:var(--color-negative); color:#fff; font-size:10px; font-weight:var(--weight-bold); padding:1px 5px; border-radius:var(--radius-full); line-height:1.4; }
    .nav-badge-warn { background:var(--color-warning-dim); color:var(--color-warning); }
    .content { flex:1; overflow:hidden; display:flex; flex-direction:column; background:var(--color-bg-base); }
    .page-header { display:flex; align-items:center; justify-content:space-between; padding:var(--space-4) var(--content-padding); border-bottom:1px solid var(--color-border-subtle); background:var(--color-bg-panel); min-height:56px; }
    .page-title { font-size:var(--text-lg); font-weight:var(--weight-semibold); letter-spacing:var(--tracking-tight); }
    .page-subtitle { font-size:var(--text-sm); color:var(--color-text-muted); margin-top:2px; }
    .page-actions { display:flex; align-items:center; gap:var(--space-3); }
    .refresh-btn { display:inline-flex; align-items:center; gap:var(--space-2); padding:var(--space-1) var(--space-3); background:transparent; border:1px solid var(--color-border-default); border-radius:var(--radius-md); color:var(--color-text-secondary); font-size:var(--text-xs); cursor:pointer; }
    .refresh-btn:hover { background:var(--color-bg-hover); color:var(--color-text-primary); }
    .view-outlet { flex:1; overflow-y:auto; overflow-x:hidden; }
    .hamburger { display:none; background:none; border:1px solid var(--color-border-default); border-radius:var(--radius-md); color:var(--color-text-secondary); cursor:pointer; width:32px; height:32px; align-items:center; justify-content:center; font-size:16px; }
    .nav-backdrop { display:none; position:fixed; inset:0; top:var(--topbar-height); background:rgba(0,0,0,0.5); z-index:49; }
    .nav-backdrop.visible { display:block; }
    @media (max-width:1024px) { .ticker-shell { min-width:220px; } }
    @media (max-width:768px) {
      .hamburger { display:flex; }
      .topbar-brand { width:auto; }
      .brand-sub, .topbar-clock { display:none !important; }
      .topbar { padding:0 var(--space-3); gap:var(--space-3); }
      .ticker-shell { height:34px; }
      .sidenav { position:fixed; top:var(--topbar-height); left:0; bottom:0; z-index:50; transform:translateX(-100%); transition:transform 0.22s cubic-bezier(0.4,0,0.2,1); box-shadow:4px 0 32px rgba(0,0,0,0.5); }
      .sidenav.open { transform:translateX(0); }
      .page-header { padding:var(--space-3); min-height:48px; }
      .page-title { font-size:var(--text-md); }
    }
  `;constructor(){super(),this._route=C.current,this._time=this._formatTime(),this._connected=!0,this._data=F.getState(),this._session=D(),this._lang=x(),this._headerMetrics=null,this._headerMetricsRoute="",this._lazyViews=new Set,this._viewInstances=new Map,this._tickerMetrics={totalCapital:0,freeUsdt:0,openPnl:0,monthlyPnl:0}}connectedCallback(){super.connectedCallback(),this._routerOff=C.onChange(e=>{this._route=e,e!==this._headerMetricsRoute&&(this._headerMetrics=null),this._ensureRouteViewLoaded(e),this._enforceRouteGuard()}),this._clockInterval=setInterval(()=>{this._time=this._formatTime()},3e4),this._storeOff=F.subscribe(e=>{this._data=e,this.requestUpdate()}),this._authChanged=()=>{this._session=D(),this._enforceRouteGuard(),this.requestUpdate()},this._langChanged=()=>{this._lang=x(),this._time=this._formatTime(),this.requestUpdate()},window.addEventListener("capintel-auth-changed",this._authChanged),window.addEventListener("capintel-lang-changed",this._langChanged),window.addEventListener("capintel-locale-changed",this._langChanged),this._ensureRouteViewLoaded(this._route),this._bootstrapSession()}disconnectedCallback(){super.disconnectedCallback(),this._routerOff?.(),this._storeOff?.(),window.removeEventListener("capintel-auth-changed",this._authChanged),window.removeEventListener("capintel-lang-changed",this._langChanged),window.removeEventListener("capintel-locale-changed",this._langChanged),clearInterval(this._clockInterval),clearInterval(this._tickerInterval)}async _bootstrapSession(){if(!Z(this._session)){this._session=null,this._enforceRouteGuard();return}try{const e=await Et();de({...this._session,expiresAt:e.expiresAt,tenantApiKey:e.tenantApiKey,user:e.user,tenant:e.tenant}),this._session=D(),await It.getSettings().catch(()=>null),await this._loadGlobalTickerMetrics(),clearInterval(this._tickerInterval),this._tickerInterval=setInterval(()=>{this._loadGlobalTickerMetrics()},3e4)}catch{Ae(),this._session=null}this._enforceRouteGuard(),this.requestUpdate()}_isAuthRoute(e=this._route){return["sign-in","sign-up","forgot-password","reset-password"].includes(e)}_enforceRouteGuard(){const e=Z(this._session);if(!e&&!this._isAuthRoute()){C.navigate("sign-in");return}e&&this._isAuthRoute()&&C.navigate("overview")}_formatTime(){return`${new Intl.DateTimeFormat(z.locale(),{timeZone:G(),hour12:!1,hour:"2-digit",minute:"2-digit"}).format(new Date)} · ${G()}`}async _loadGlobalTickerMetrics(){try{const t=(await Lt.getDashboard())?.summary||{};this._tickerMetrics={totalCapital:Number(t.totalCapitalVisible||0),freeUsdt:Number(t.freeUsdt||0),openPnl:Number(t.allMinerGain||0),monthlyPnl:Number(t.monthlyCloseablePnlChange||0)}}catch{}}_tickerItems(){const e=this._tickerMetrics||{};return[{label:c("totalCapital",this._lang),value:z.usd(Number(e.totalCapital||0),0),cls:"metric-neutral"},{label:c("freeUsdt",this._lang),value:z.usd(Number(e.freeUsdt||0),0),cls:"metric-neutral"},{label:c("openPnl",this._lang),value:`${Number(e.openPnl||0)>=0?"+":"-"}${z.usd(Math.abs(Number(e.openPnl||0)),0)}`,cls:Number(e.openPnl||0)>=0?"metric-positive":"metric-negative"},{label:c("monthlyPnl",this._lang),value:`${Number(e.monthlyPnl||0)>=0?"+":"-"}${z.usd(Math.abs(Number(e.monthlyPnl||0)),0)}`,cls:Number(e.monthlyPnl||0)>=0?"metric-positive":"metric-negative"}]}_renderTickerTape(){const e=this._tickerItems(),t=[...e,...e];return o`
      <div class="ticker-shell" aria-label="Global ticker">
        <div class="ticker-track">
          ${t.map((a,s)=>o`
            <div class="topbar-metric" data-idx=${s}>
              <span class="topbar-metric-label">${a.label}</span>
              <span class="topbar-metric-value ${a.cls}">${a.value}</span>
            </div>
          `)}
        </div>
      </div>
    `}_navigate(e){C.navigate(e),this._navOpen=!1}async _ensureRouteViewLoaded(e){if(this._lazyViews.has(e))return;const a={"sign-in":()=>f(()=>import("./sign-in-view-B_iO42M6.js"),[]),"sign-up":()=>f(()=>import("./sign-up-view-D6PnbSRn.js"),[]),"forgot-password":()=>f(()=>import("./forgot-password-view-CjdfV_4V.js"),[]),"reset-password":()=>f(()=>import("./reset-password-view-sdMBKiHk.js"),[]),overview:()=>f(()=>import("./overview-view-DMOGHKgc.js"),[]),capital:()=>f(()=>import("./capital-view-fon_i7ge.js"),[]),miners:()=>f(()=>import("./miners-view-Bn98d26V.js"),__vite__mapDeps([0,1,2])),opportunities:()=>f(()=>import("./opportunities-view-V4pjvd50.js"),__vite__mapDeps([3,1,2])),scalping:()=>f(()=>import("./scalping-view-Dj8q9Fok.js"),__vite__mapDeps([4,2])),"btc-core":()=>f(()=>import("./btc-core-view-wpjZored.js"),[]),"btc-ladder":()=>f(()=>import("./btc-ladder-view-DRc3H2nt.js"),__vite__mapDeps([5,2])),discovery:()=>f(()=>import("./discovery-view-CTIoTKny.js"),__vite__mapDeps([6,2])),settings:()=>f(()=>import("./settings-view-BADaZEPE.js"),[])}[e];a&&(await a().catch(s=>console.warn("[lazy]",e,s)),this._lazyViews.add(e),this.requestUpdate())}_getPageMeta(){const e={overview:{title:c("shellOverview",this._lang),subtitle:c("pageOverviewSubtitle",this._lang)},capital:{title:c("shellCapital",this._lang),subtitle:c("pageCapitalSubtitle",this._lang)},miners:{title:c("shellMiners",this._lang),subtitle:c("pageMinersSubtitle",this._lang)},opportunities:{title:c("shellOpportunities",this._lang),subtitle:c("pageOpportunitiesSubtitle",this._lang)},scalping:{title:c("shellScalping",this._lang),subtitle:c("pageScalpingSubtitle",this._lang)},"btc-core":{title:c("shellBtcCore",this._lang),subtitle:c("pageBtcCoreSubtitle",this._lang)},"btc-ladder":{title:c("shellBtcLadder",this._lang),subtitle:c("pageBtcLadderSubtitle",this._lang)},discovery:{title:c("shellDiscovery",this._lang),subtitle:c("pageDiscoverySubtitle",this._lang)},settings:{title:c("shellSettings",this._lang),subtitle:c("pageSettingsSubtitle",this._lang)}};return e[this._route]||e.overview}_getNavBadge(e){const t=this._data;return e==="miners"&&t.activeMinersCount>0?{count:t.activeMinersCount,type:"danger"}:e==="opportunities"&&t.newOpportunities>0?{count:t.newOpportunities,type:"warn"}:null}_getRiskClass(){const e=this._headerMetricsRoute===this._route&&this._headerMetrics?.riskScore!==void 0?this._headerMetrics.riskScore:this._data.riskScore;return e<35?"risk-low":e<65?"risk-medium":"risk-high"}_getRiskLabel(){const e=this._headerMetricsRoute===this._route&&this._headerMetrics?.riskScore!==void 0?this._headerMetrics.riskScore:this._data.riskScore;return e<35?`LOW ${e}`:e<65?`MED ${e}`:`HIGH ${e}`}_handleShellMetrics(e){const t=e.detail||{};!t.route||t.route!==this._route||(this._headerMetrics=t.metrics||null,this._headerMetricsRoute=t.route)}_renderNavGroups(){const e={main:c("shellDashboard",this._lang),operations:c("shellOperations",this._lang),btc:c("shellBitcoin",this._lang),research:c("shellResearch",this._lang),system:c("shellSystem",this._lang)},t={};return ht.forEach(a=>{t[a.group]||(t[a.group]=[]),t[a.group].push(a)}),Object.entries(t).map(([a,s])=>o`
      <div class="nav-group">
        <div class="nav-group-label">${e[a]}</div>
        ${s.map(i=>{const n=this._getNavBadge(i.id);return o`
            <div class="nav-item ${this._route===i.id?"active":""}" @click=${()=>this._navigate(i.id)}>
              <span class="nav-icon">${i.icon}</span>
              <span>${i.label[this._lang]||i.label.en}</span>
              ${n?o`<span class="nav-badge ${n.type==="warn"?"nav-badge-warn":""}">${n.count}</span>`:""}
            </div>
          `})}
      </div>
    `)}_renderView(){const t={"sign-in":"sign-in-view","sign-up":"sign-up-view","forgot-password":"forgot-password-view","reset-password":"reset-password-view",overview:"overview-view",capital:"capital-view",miners:"miners-view",opportunities:"opportunities-view",scalping:"scalping-view","btc-core":"btc-core-view","btc-ladder":"btc-ladder-view",discovery:"discovery-view",settings:"settings-view"}[this._route];return t&&!customElements.get(t)?o`<loading-view label="Loading…"></loading-view>`:t?(this._viewInstances.has(this._route)||this._viewInstances.set(this._route,document.createElement(t)),this._viewInstances.get(this._route)):""}render(){this._data;const e=this._getPageMeta();return Z(this._session)?o`
      <div class="nav-backdrop ${this._navOpen?"visible":""}" @click=${()=>this._navOpen=!1}></div>
      <div class="topbar">
        <button class="hamburger" @click=${()=>this._navOpen=!this._navOpen} aria-label="Menu">☰</button>
        <div class="topbar-brand">
          <div class="brand-icon">CI</div>
          <div>
            <div class="brand-name">CapIntel</div>
            <div class="brand-sub">${c("cockpit",this._lang)}</div>
          </div>
        </div>
        ${this._renderTickerTape()}
        <div class="topbar-right">
          <button class="refresh-btn" @click=${()=>Pt(this._lang==="es"?"en":"es")}>${this._lang.toUpperCase()}</button>
          <div class="topbar-clock">${this._session?.tenant?.name||c("workspace",this._lang)}</div>
          <div class="risk-badge-topbar ${this._getRiskClass()}">RISK ${this._getRiskLabel()}</div>
          <div class="topbar-clock">${this._time}</div>
          <div class="connection-dot ${this._connected?"":"disconnected"}" title="${this._connected?c("connected",this._lang):c("disconnected",this._lang)}"></div>
          <button class="refresh-btn" @click=${()=>{Ae(),this._session=null,C.navigate("sign-in")}}>
            ${c("signOut",this._lang)}
          </button>
        </div>
      </div>
      <div class="shell-body">
        <nav class="sidenav ${this._navOpen?"open":""}">
          ${this._renderNavGroups()}
        </nav>
        <main class="content">
          <div class="page-header">
            <div>
              <div class="page-title">${e.title}</div>
              <div class="page-subtitle">${e.subtitle}</div>
            </div>
          </div>
          <div class="view-outlet" @capintel-shell-metrics=${this._handleShellMetrics}>${this._renderView()}</div>
        </main>
      </div>
    `:o`${this._renderView()}`}}customElements.define("app-shell",Mt);class zt extends g{static properties={label:{type:String},value:{type:String},sub:{type:String},delta:{type:Number},deltaPct:{type:Number},accent:{type:String},size:{type:String},mono:{type:Boolean}};static styles=b`
    :host { display: block; }

    .card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
      transition: border-color var(--transition-fast);
    }
    .card:hover { border-color: var(--color-border-default); }

    .label {
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text-muted);
      margin-bottom: var(--space-2);
    }

    .value {
      font-family: var(--font-mono);
      font-size: var(--text-2xl);
      font-weight: var(--weight-semibold);
      letter-spacing: -0.025em;
      line-height: 1.1;
      color: var(--color-text-primary);
      font-variant-numeric: tabular-nums slashed-zero;
      font-feature-settings: "tnum" 1, "zero" 1;
    }
    .value.mono {}
    .value.sm { font-size: var(--text-xl); }
    .value.lg { font-size: var(--text-3xl); }

    .value.positive { color: var(--color-positive); }
    .value.negative { color: var(--color-negative); }
    .value.warning  { color: var(--color-warning); }
    .value.accent   { color: var(--color-accent); }

    .footer {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-top: var(--space-2);
    }

    .sub {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .delta {
      font-size: var(--text-xs);
      font-weight: var(--weight-medium);
      font-family: var(--font-mono);
      font-variant-numeric: tabular-nums slashed-zero;
      font-feature-settings: "tnum" 1, "zero" 1;
    }
    .delta-pos { color: var(--color-positive); }
    .delta-neg { color: var(--color-negative); }

    .accent-bar {
      height: 2px;
      border-radius: 1px;
      margin-bottom: var(--space-3);
      width: 28px;
    }
    .accent-bar.positive { background: var(--color-positive); }
    .accent-bar.negative { background: var(--color-negative); }
    .accent-bar.warning  { background: var(--color-warning); }
    .accent-bar.accent   { background: var(--color-accent); }
    .accent-bar.neutral  { background: var(--color-border-strong); }
  `;render(){const e=this.accent||"neutral",t=this.size||"md",a=this.delta>=0;return o`
      <div class="card">
        <div class="accent-bar ${e}"></div>
        <div class="label">${this.label}</div>
        <div class="value ${e} ${t} ${this.mono?"mono":""}">${this.value}</div>
        <div class="footer">
          ${this.sub?o`<span class="sub">${this.sub}</span>`:""}
          ${this.delta!==void 0?o`
            <span class="delta ${a?"delta-pos":"delta-neg"}">
              ${a?"▲":"▼"} ${Math.abs(this.delta).toFixed(2)}${this.deltaPct!==void 0?` (${Math.abs(this.deltaPct).toFixed(1)}%)`:""}
            </span>
          `:""}
        </div>
      </div>
    `}}customElements.define("stat-card",zt);class Nt extends g{static properties={options:{type:Array},value:{type:String}};static styles=b`
    :host { display: inline-flex; }
    .control {
      display: inline-flex;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      padding: 2px;
      gap: 2px;
    }
    .seg {
      padding: var(--space-1) var(--space-3);
      border-radius: calc(var(--radius-md) - 2px);
      font-size: var(--text-xs);
      font-weight: var(--weight-medium);
      cursor: pointer;
      color: var(--color-text-muted);
      transition: all var(--transition-fast);
      user-select: none;
      white-space: nowrap;
    }
    .seg:hover { color: var(--color-text-secondary); }
    .seg.active {
      background: var(--color-bg-active);
      color: var(--color-text-primary);
    }
  `;_select(e){this.value=e,this.dispatchEvent(new CustomEvent("change",{detail:e,bubbles:!0}))}render(){return o`
      <div class="control">
        ${(this.options||[]).map(e=>o`
          <div
            class="seg ${this.value===e.value?"active":""}"
            @click=${()=>this._select(e.value)}
          >${e.label}</div>
        `)}
      </div>
    `}}customElements.define("segmented-control",Nt);class Dt extends g{static properties={columns:{type:Array},rows:{type:Array},emptyText:{type:String},compact:{type:Boolean},highlightFn:{type:Object}};static styles=b`
    :host { display: block; }
    .table-wrap {
      width: 100%;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--text-sm);
    }
    thead th {
      padding: var(--space-2) var(--space-3);
      text-align: left;
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-muted);
      border-bottom: 1px solid var(--color-border-subtle);
      white-space: nowrap;
    }
    thead th.right { text-align: right; }
    thead th.center { text-align: center; }

    tbody tr {
      border-bottom: 1px solid var(--color-border-subtle);
      cursor: default;
      transition: background var(--transition-fast);
    }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:hover { background: var(--color-bg-hover); }

    tbody tr.warning { border-left: 2px solid var(--color-warning); }
    tbody tr.danger  { border-left: 2px solid var(--color-negative); }

    td {
      padding: var(--space-2) var(--space-3);
      color: var(--color-text-primary);
      vertical-align: middle;
    }
    td.right  { text-align: right; }
    td.center { text-align: center; }

    .empty-row td {
      text-align: center;
      color: var(--color-text-muted);
      padding: var(--space-10);
      font-size: var(--text-sm);
    }

    .compact thead th, .compact td {
      padding: var(--space-1) var(--space-3);
    }
  `;_renderCell(e,t){if(e.render)return e.render(t[e.key],t);const a=t[e.key];return a??"—"}render(){const e=this.columns||[],t=this.rows||[];return o`
      <div class="table-wrap">
        <table class="${this.compact?"compact":""}">
          <thead>
            <tr>
              ${e.map(a=>o`
                <th class="${a.align||"left"}" style="${a.width?`width:${a.width}`:""}">${a.label}</th>
              `)}
            </tr>
          </thead>
          <tbody>
            ${t.length===0?o`
              <tr class="empty-row">
                <td colspan="${e.length}">${this.emptyText||"No data"}</td>
              </tr>
            `:t.map(a=>{const s=this.highlightFn?this.highlightFn(a):"";return o`
                <tr class="${s}" @click=${()=>this.dispatchEvent(new CustomEvent("row-click",{detail:a,bubbles:!0}))}>
                  ${e.map(i=>o`
                    <td class="${i.align||"left"}">${this._renderCell(i,a)}</td>
                  `)}
                </tr>
              `})}
          </tbody>
        </table>
      </div>
    `}}customElements.define("data-table",Dt);class Rt extends g{static properties={value:{type:Number},min:{type:Number},max:{type:Number},step:{type:Number},label:{type:String},suffix:{type:String},prefix:{type:String},disabled:{type:Boolean}};static styles=b`
    :host { display: block; }
    .field { display: flex; flex-direction: column; gap: var(--space-1); }
    .label { font-size: var(--text-xs); font-weight: var(--weight-medium); color: var(--color-text-secondary); }
    .input-wrap {
      display: flex; align-items: center;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .input-wrap:focus-within { border-color: var(--color-accent); }
    .prefix, .suffix {
      padding: 0 var(--space-2);
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      flex-shrink: 0;
    }
    input[type=number] {
      flex: 1; border: none; background: transparent;
      font-family: var(--font-mono); font-size: var(--text-base);
      color: var(--color-text-primary);
      padding: var(--space-2) var(--space-1);
      text-align: right;
    }
    input[type=number]:focus { outline: none; }
    input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
    .btn-step {
      background: var(--color-bg-active); border: none;
      padding: var(--space-2) var(--space-2); cursor: pointer;
      color: var(--color-text-secondary); font-size: 11px;
      transition: all var(--transition-fast);
      border-left: 1px solid var(--color-border-subtle);
    }
    .btn-step:hover { background: var(--color-bg-hover); color: var(--color-text-primary); }
  `;_change(e){const t=parseFloat(e.target.value);this.value=isNaN(t)?this.value:t,this.dispatchEvent(new CustomEvent("change",{detail:this.value,bubbles:!0}))}_step(e){const t=this.step||1,a=(this.value||0)+e*t,s=this.min!==void 0?Math.max(this.min,this.max!==void 0?Math.min(this.max,a):a):a;this.value=parseFloat(s.toFixed(8)),this.dispatchEvent(new CustomEvent("change",{detail:this.value,bubbles:!0}))}render(){return o`
      <div class="field">
        ${this.label?o`<label class="label">${this.label}</label>`:""}
        <div class="input-wrap">
          ${this.prefix?o`<span class="prefix">${this.prefix}</span>`:""}
          <input
            type="number"
            .value=${this.value??""}
            min=${this.min??""}
            max=${this.max??""}
            step=${this.step??"any"}
            ?disabled=${this.disabled}
            @change=${this._change}
            @input=${this._change}
          />
          ${this.suffix?o`<span class="suffix">${this.suffix}</span>`:""}
          <button class="btn-step" @click=${()=>this._step(-1)}>−</button>
          <button class="btn-step" @click=${()=>this._step(1)}>+</button>
        </div>
      </div>
    `}}customElements.define("numeric-input",Rt);class Ut extends g{static properties={_toasts:{type:Array,state:!0}};static styles=b`
    :host {
      position: fixed;
      bottom: var(--space-6);
      right: var(--space-6);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      pointer-events: none;
    }
    .toast {
      pointer-events: all;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-lg);
      padding: var(--space-3) var(--space-4);
      display: flex;
      align-items: center;
      gap: var(--space-3);
      box-shadow: var(--shadow-lg);
      animation: slideIn 0.2s ease;
      min-width: 280px;
      max-width: 380px;
    }
    @keyframes slideIn {
      from { transform: translateX(20px); opacity: 0; }
      to   { transform: translateX(0); opacity: 1; }
    }
    .toast.success { border-left: 3px solid var(--color-positive); }
    .toast.error   { border-left: 3px solid var(--color-negative); }
    .toast.warning { border-left: 3px solid var(--color-warning); }
    .toast.info    { border-left: 3px solid var(--color-accent); }

    .toast-icon { font-size: 16px; flex-shrink: 0; }
    .toast-body { flex: 1; }
    .toast-title { font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text-primary); }
    .toast-sub   { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }
    .toast-close {
      background: none; border: none; cursor: pointer;
      color: var(--color-text-muted); font-size: 14px;
      padding: 2px; border-radius: var(--radius-sm);
    }
    .toast-close:hover { color: var(--color-text-primary); }
  `;constructor(){super(),this._toasts=[],window.toast=(e,t={})=>this.show(e,t)}show(e,{type:t="info",title:a,duration:s=4e3}={}){const i=Date.now()+Math.random(),n={id:i,message:e,title:a,type:t};this._toasts=[...this._toasts,n],s>0&&setTimeout(()=>this._dismiss(i),s)}_dismiss(e){this._toasts=this._toasts.filter(t=>t.id!==e)}_icon(e){return{success:"✓",error:"✕",warning:"!",info:"i"}[e]||"i"}render(){return o`
      ${this._toasts.map(e=>o`
        <div class="toast ${e.type}">
          <span class="toast-icon">${this._icon(e.type)}</span>
          <div class="toast-body">
            ${e.title?o`<div class="toast-title">${e.title}</div>`:""}
            <div class="toast-sub">${e.message}</div>
          </div>
          <button class="toast-close" @click=${()=>this._dismiss(e.id)}>✕</button>
        </div>
      `)}
    `}}customElements.define("toast-notification",Ut);class Bt extends g{static properties={title:{type:String},message:{type:String},confirmLabel:{type:String},cancelLabel:{type:String},danger:{type:Boolean}};static styles=b`
    :host { display: block; }
    .overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      z-index: 300;
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(4px);
    }
    .modal {
      background: var(--color-bg-panel);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      width: 400px; max-width: 95vw;
      box-shadow: var(--shadow-lg);
    }
    .title { font-size: var(--text-lg); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }
    .message { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.6; margin-bottom: var(--space-6); }
    .footer { display: flex; gap: var(--space-3); justify-content: flex-end; }
  `;_confirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0}))}render(){return o`
      <div class="overlay" @click=${e=>{e.target===e.currentTarget&&this._cancel()}}>
        <div class="modal">
          <div class="title">${this.title||"Are you sure?"}</div>
          <div class="message">${this.message||"This action cannot be undone."}</div>
          <div class="footer">
            <button class="btn btn-ghost" @click=${this._cancel}>${this.cancelLabel||"Cancel"}</button>
            <button class="btn ${this.danger?"btn-danger":"btn-primary"}" @click=${this._confirm}>${this.confirmLabel||"Confirm"}</button>
          </div>
        </div>
      </div>
    `}}customElements.define("confirmation-modal",Bt);class lr{constructor(e,{interval:t=3e4,immediate:a=!0}={}){this._fn=e,this._interval=t,this._timer=null,this._running=!1,this._lastFetch=null,this._staleThreshold=t*2,a&&this.start()}start(){this._running||(this._running=!0,this._tick())}stop(){this._running=!1,this._timer&&(clearTimeout(this._timer),this._timer=null)}setInterval(e){this._interval=e,this.stop(),this.start()}get isStale(){return this._lastFetch?Date.now()-this._lastFetch>this._staleThreshold:!0}async _tick(){try{await this._fn(),this._lastFetch=Date.now()}catch(e){console.warn("[poller] fetch error:",e)}this._running&&(this._timer=setTimeout(()=>this._tick(),this._interval))}}const Ft=r=>new Promise(e=>setTimeout(e,r)),jt=b`
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 6px 14px;
    border-radius: 7px;
    font-family: var(--font-sans);
    font-size: 11.5px;
    font-weight: 500;
    letter-spacing: 0.015em;
    cursor: pointer;
    transition: background 130ms ease, box-shadow 130ms ease, transform 130ms ease, border-color 130ms ease, color 130ms ease;
    border: 1px solid transparent;
    white-space: nowrap;
    user-select: none;
    line-height: 1;
    text-decoration: none;
  }
  .btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Primary — blue gradient */
  .btn-primary {
    background: linear-gradient(160deg, #6b9cf5 0%, #4274de 100%);
    color: #fff;
    border-color: rgba(91,141,239,0.3);
    box-shadow: 0 1px 2px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
    text-shadow: 0 1px 2px rgba(0,0,0,0.25);
  }
  .btn-primary:hover:not(:disabled) {
    background: linear-gradient(160deg, #7eadf7 0%, #5b8def 100%);
    box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 20px rgba(91,141,239,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
    transform: translateY(-1px);
  }
  .btn-primary:active:not(:disabled) { transform: translateY(0); box-shadow: 0 1px 3px rgba(0,0,0,0.45); }

  /* Ghost — frosted */
  .btn-ghost {
    background: rgba(255,255,255,0.025);
    color: var(--color-text-secondary);
    border-color: var(--color-border-strong);
  }
  .btn-ghost:hover:not(:disabled) {
    background: rgba(255,255,255,0.06);
    color: var(--color-text-primary);
    border-color: #4a4e63;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    transform: translateY(-1px);
  }
  .btn-ghost:active:not(:disabled) { transform: translateY(0); }

  /* Danger */
  .btn-danger {
    background: rgba(240,74,94,0.08);
    color: var(--color-negative);
    border-color: rgba(240,74,94,0.2);
  }
  .btn-danger:hover:not(:disabled) {
    background: linear-gradient(160deg, #f25a6e 0%, #d43750 100%);
    color: #fff;
    border-color: #f04a5e;
    box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 20px rgba(240,74,94,0.3);
    transform: translateY(-1px);
  }
  .btn-danger:active:not(:disabled) { transform: translateY(0); }

  /* Warning */
  .btn-warning {
    background: rgba(245,166,35,0.08);
    color: var(--color-warning);
    border-color: rgba(245,166,35,0.2);
  }
  .btn-warning:hover:not(:disabled) {
    background: linear-gradient(160deg, #f7b83a 0%, #df9418 100%);
    color: #0a0b0f;
    border-color: #f5a623;
    box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 20px rgba(245,166,35,0.3);
    transform: translateY(-1px);
    font-weight: 600;
  }
  .btn-warning:active:not(:disabled) { transform: translateY(0); }

  /* Positive */
  .btn-positive {
    background: rgba(34,211,160,0.08);
    color: var(--color-positive);
    border-color: rgba(34,211,160,0.2);
  }
  .btn-positive:hover:not(:disabled) {
    background: linear-gradient(160deg, #28e0ab 0%, #17b589 100%);
    color: #0a0b0f;
    border-color: #22d3a0;
    box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 20px rgba(34,211,160,0.3);
    transform: translateY(-1px);
    font-weight: 600;
  }
  .btn-positive:active:not(:disabled) { transform: translateY(0); }

  /* Small variant */
  .btn-sm { padding: 4px 10px; font-size: 11px; border-radius: 5px; }
`;class Ht extends g{static properties={title:{type:String},subtitle:{type:String},domain:{type:String},payload:{type:Array},warnings:{type:Array},executeFn:{type:Object},confirmText:{type:String},dangerLevel:{type:String},_step:{type:String,state:!0},_result:{type:Object,state:!0},_confirmed:{type:Boolean,state:!0}};static styles=[jt,b`
    :host { display: block; }

    .overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.75);
      z-index: 200;
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(6px);
    }

    .modal {
      background: var(--color-bg-panel);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      width: 480px;
      max-width: 95vw;
      box-shadow: var(--shadow-lg);
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--space-5);
    }

    .modal-title { font-size: var(--text-lg); font-weight: var(--weight-semibold); }
    .modal-sub   { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 3px; }

    .close-btn {
      background: none; border: none; cursor: pointer;
      color: var(--color-text-muted); font-size: 18px;
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }
    .close-btn:hover { background: var(--color-bg-hover); color: var(--color-text-primary); }

    /* Step indicator */
    .steps {
      display: flex; align-items: center; gap: var(--space-2);
      margin-bottom: var(--space-5);
    }
    .step-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--color-border-strong);
      transition: background var(--transition-fast);
    }
    .step-dot.active { background: var(--color-accent); }
    .step-dot.done   { background: var(--color-positive); }
    .step-line { flex: 1; height: 1px; background: var(--color-border-subtle); }

    /* Payload */
    .payload {
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
      padding: var(--space-4);
      margin-bottom: var(--space-4);
      display: flex; flex-direction: column; gap: var(--space-2);
    }
    .payload-row { display: flex; justify-content: space-between; align-items: center; font-size: var(--text-sm); }
    .payload-label { color: var(--color-text-secondary); }
    .payload-value { font-family: var(--font-mono); color: var(--color-text-primary); font-weight: var(--weight-medium); }
    .payload-value.highlight { color: var(--color-warning); }
    .payload-value.danger    { color: var(--color-negative); }
    .payload-value.pos       { color: var(--color-positive); }

    /* Warnings */
    .warnings-block { margin-bottom: var(--space-4); }
    .warning-item {
      display: flex; align-items: flex-start; gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      background: var(--color-warning-dim);
      border-radius: var(--radius-md); margin-bottom: var(--space-2);
      font-size: var(--text-sm); color: var(--color-warning);
    }
    .warning-item.danger { background: var(--color-negative-dim); color: var(--color-negative); }

    /* Confirm checkbox */
    .confirm-row {
      display: flex; align-items: center; gap: var(--space-3);
      padding: var(--space-3); background: var(--color-bg-elevated);
      border-radius: var(--radius-md); margin-bottom: var(--space-4); cursor: pointer;
    }
    .confirm-check {
      width: 16px; height: 16px;
      border: 1.5px solid var(--color-border-strong); border-radius: 3px;
      flex-shrink: 0; display: flex; align-items: center; justify-content: center;
      transition: all var(--transition-fast);
    }
    .confirm-check.checked { background: var(--color-accent); border-color: var(--color-accent); }
    .confirm-check-text { font-size: var(--text-sm); color: var(--color-text-secondary); }

    /* Footer */
    .footer { display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-2); }

    /* Audit stamp */
    .audit-stamp {
      margin-top: var(--space-3); padding: var(--space-2) var(--space-3);
      background: var(--color-bg-elevated); border-radius: var(--radius-md);
      font-size: var(--text-xs); color: var(--color-text-muted);
      font-family: var(--font-mono);
    }

    /* Executing */
    .executing-content { text-align: center; padding: var(--space-8) 0; }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--color-border-default);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto var(--space-4);
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .executing-label { color: var(--color-text-secondary); font-size: var(--text-sm); }

    /* Result */
    .result-content { text-align: center; padding: var(--space-8) 0; }
    .result-icon { font-size: 40px; margin-bottom: var(--space-4); }
    .result-message { font-size: var(--text-md); font-weight: var(--weight-medium); }
    .result-sub { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-2); }
  `];constructor(){super(),this._step="preview",this._confirmed=!1,this._result=null,this._auditEntry=null}_close(){this.dispatchEvent(new CustomEvent("closed",{bubbles:!0}))}_stepStatus(e){const t=["preview","confirm","executing","success"],a=t.indexOf(e),s=t.indexOf(this._step);return a<s?"done":a===s?"active":""}_payloadForAudit(){const e={};return(this.payload||[]).forEach(t=>{e[t.label]=t.value}),e}async _execute(){this._step="executing",await Ft(1200);try{const e=this.executeFn?await this.executeFn():{success:!0,message:"Action executed successfully."};this._result=e,this._step=e.success?"success":"error",this._auditEntry=F.addAuditEvent({action:this.title||"Unknown Action",domain:this.domain||"unknown",payload:this._payloadForAudit(),result:e,triggeredBy:"user"}),e.success&&this.dispatchEvent(new CustomEvent("executed",{detail:{result:e,auditId:this._auditEntry.id},bubbles:!0}))}catch(e){this._result={success:!1,message:e.message||"Execution failed."},this._step="error",this._auditEntry=F.addAuditEvent({action:this.title||"Unknown Action",domain:this.domain||"unknown",payload:this._payloadForAudit(),result:this._result,triggeredBy:"user"})}}_renderSteps(){return o`
      <div class="steps">
        <div class="step-dot ${this._stepStatus("preview")}"></div>
        <div class="step-line"></div>
        <div class="step-dot ${this._stepStatus("confirm")}"></div>
        <div class="step-line"></div>
        <div class="step-dot ${this._stepStatus("executing")}"></div>
      </div>
    `}_renderPreview(){const e=this.dangerLevel||"normal";return o`
      ${this._renderSteps()}

      ${(this.warnings||[]).length>0?o`
        <div class="warnings-block">
          ${this.warnings.map(t=>o`
            <div class="warning-item ${e==="danger"?"danger":""}">
              <span>${e==="danger"?"⚠":"!"}</span> ${t}
            </div>
          `)}
        </div>
      `:""}

      <div class="payload">
        ${(this.payload||[]).map(t=>o`
          <div class="payload-row">
            <span class="payload-label">${t.label}</span>
            <span class="payload-value ${t.highlight||""}">${t.value}</span>
          </div>
        `)}
      </div>

      <div class="footer">
        <button class="btn btn-ghost" @click=${this._close}>Cancel</button>
        <button class="btn btn-primary" @click=${()=>this._step="confirm"}>
          Review &amp; Confirm →
        </button>
      </div>
    `}_renderConfirm(){const e=this.dangerLevel==="danger"?"btn-danger":"btn-primary";return o`
      ${this._renderSteps()}
      <p style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-bottom:var(--space-4)">
        Review the action details above. This action will be sent to the exchange immediately upon execution.
        Every execution is logged to your local audit trail.
      </p>
      <div class="confirm-row" @click=${()=>this._confirmed=!this._confirmed}>
        <div class="confirm-check ${this._confirmed?"checked":""}">
          ${this._confirmed?"✓":""}
        </div>
        <span class="confirm-check-text">I understand this action involves real capital and cannot be undone.</span>
      </div>
      <div class="footer">
        <button class="btn btn-ghost" @click=${()=>this._step="preview"}>← Back</button>
        <button class="btn ${e}" ?disabled=${!this._confirmed} @click=${this._execute}>
          ${this.confirmText||"Execute"}
        </button>
      </div>
    `}_renderExecuting(){return o`
      <div class="executing-content">
        <div class="spinner"></div>
        <div class="executing-label">Sending to exchange...</div>
      </div>
    `}_renderResult(){const e=this._step==="success",t=this._auditEntry;return o`
      <div class="result-content">
        <div class="result-icon">${e?"✓":"✕"}</div>
        <div class="result-message" style="color:${e?"var(--color-positive)":"var(--color-negative)"}">
          ${e?"Executed successfully":"Execution failed"}
        </div>
        <div class="result-sub">${this._result?.message||""}</div>
      </div>
      ${t?o`
        <div class="audit-stamp">
          ◈ Audit #${t.id.slice(-6)} · ${new Date(t.timestamp).toLocaleTimeString("en-US",{hour12:!1})} · ${t.domain}
        </div>
      `:""}
      <div class="footer">
        <button class="btn btn-ghost" @click=${this._close}>Close</button>
      </div>
    `}render(){return o`
      <div class="overlay" @click=${e=>{e.target===e.currentTarget&&this._close()}}>
        <div class="modal">
          <div class="modal-header">
            <div>
              <div class="modal-title">${this.title||"Confirm Action"}</div>
              ${this.subtitle?o`<div class="modal-sub">${this.subtitle}</div>`:""}
            </div>
            <button class="close-btn" @click=${this._close}>✕</button>
          </div>

          ${this._step==="preview"?this._renderPreview():""}
          ${this._step==="confirm"?this._renderConfirm():""}
          ${this._step==="executing"?this._renderExecuting():""}
          ${this._step==="success"||this._step==="error"?this._renderResult():""}
        </div>
      </div>
    `}}customElements.define("preview-execute-modal",Ht);class Kt extends g{static properties={score:{type:Number},label:{type:String},size:{type:String}};static styles=b`
    :host { display: inline-block; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .badge.sm { padding: 2px 6px; font-size: 10px; }
    .dot { width: 6px; height: 6px; border-radius: 50%; }

    .low    { background: var(--color-positive-dim); color: var(--color-positive); }
    .medium { background: var(--color-warning-dim);  color: var(--color-warning); }
    .high   { background: var(--color-negative-dim); color: var(--color-negative); }
    .extreme{ background: var(--color-danger-dim);   color: var(--color-danger); }
    .none   { background: var(--color-idle-dim);     color: var(--color-idle); }

    .dot.low    { background: var(--color-positive); }
    .dot.medium { background: var(--color-warning); }
    .dot.high   { background: var(--color-negative); }
    .dot.extreme{ background: var(--color-danger); }
    .dot.none   { background: var(--color-idle); }
  `;_getLevel(){return this.label?this.label.toLowerCase():this.score===void 0?"none":this.score<25||this.score<50?"low":this.score<65?"medium":this.score<80?"high":"extreme"}_getLabel(){if(this.label)return this.label;const e=this._getLevel(),t={low:"Low",medium:"Medium",high:"High",extreme:"Extreme",none:"None"};return this.score!==void 0?`${t[e]} ${this.score}`:t[e]}render(){const e=this._getLevel(),t=this.size||"md";return o`
      <span class="badge ${e} ${t}">
        <span class="dot ${e}"></span>
        ${this._getLabel()}
      </span>
    `}}customElements.define("risk-badge",Kt);const q=b`
  :host { display: flex; align-items: center; justify-content: center; padding: var(--space-12); width: 100%; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: var(--space-3); text-align: center; }
  .icon { font-size: 32px; opacity: 0.4; }
  .label { font-size: var(--text-sm); color: var(--color-text-muted); }
  .sub   { font-size: var(--text-xs); color: var(--color-text-disabled); }
`;class Vt extends g{static properties={label:{type:String}};static styles=[q,b`
    .spinner { width: 32px; height: 32px; border: 2px solid var(--color-border-default); border-top-color: var(--color-accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `];render(){return o`<div class="wrap"><div class="spinner"></div><span class="label">${this.label||"Loading..."}</span></div>`}}class Gt extends g{static properties={label:{type:String},sub:{type:String}};static styles=q;render(){return o`<div class="wrap"><div class="icon">◎</div><span class="label">${this.label||"No data"}</span>${this.sub?o`<span class="sub">${this.sub}</span>`:""}</div>`}}class Jt extends g{static properties={label:{type:String},sub:{type:String}};static styles=[q,b`.icon { color: var(--color-negative); }`];render(){return o`<div class="wrap"><div class="icon">⚠</div><span class="label" style="color:var(--color-negative)">${this.label||"Error loading data"}</span>${this.sub?o`<span class="sub">${this.sub}</span>`:""}</div>`}}class Yt extends g{static properties={label:{type:String},age:{type:String}};static styles=[q,b`.icon { color: var(--color-warning); }`];render(){return o`<div class="wrap"><div class="icon">⟳</div><span class="label" style="color:var(--color-warning)">${this.label||"Data may be stale"}</span>${this.age?o`<span class="sub">Last updated ${this.age}</span>`:""}</div>`}}customElements.define("loading-view",Vt);customElements.define("empty-view",Gt);customElements.define("error-view",Jt);customElements.define("stale-view",Yt);class Wt extends g{static properties={value:{type:Number},max:{type:Number},label:{type:String},sublabel:{type:String},color:{type:String},height:{type:Number},showPct:{type:Boolean}};static styles=b`
    :host { display: block; }
    .wrapper { display: flex; flex-direction: column; gap: var(--space-1); }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: var(--text-xs);
    }
    .header-label { color: var(--color-text-secondary); }
    .header-pct { font-family: var(--font-mono); color: var(--color-text-muted); }

    .track {
      width: 100%;
      background: var(--color-bg-elevated);
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    .fill {
      height: 100%;
      border-radius: var(--radius-full);
      transition: width 0.5s ease;
      background: var(--fill-color, var(--color-accent));
    }
  `;render(){const e=Math.min(100,Math.max(0,this.value||0)),t=this.height||6;return o`
      <div class="wrapper">
        ${this.label||this.showPct?o`
          <div class="header">
            ${this.label?o`<span class="header-label">${this.label}</span>`:""}
            ${this.showPct?o`<span class="header-pct">${e.toFixed(1)}%</span>`:""}
          </div>
        `:""}
        <div class="track" style="height:${t}px">
          <div class="fill" style="width:${e}%; --fill-color:${this.color||""}"></div>
        </div>
        ${this.sublabel?o`<div style="font-size:var(--text-xs);color:var(--color-text-muted)">${this.sublabel}</div>`:""}
      </div>
    `}}customElements.define("progress-bar",Wt);class qt extends g{static properties={items:{type:Array},height:{type:Number},total:{type:Number},_tip:{type:Object,state:!0}};static styles=b`
    :host { display: block; }
    .chart-wrap { display: flex; flex-direction: column; gap: var(--space-4); }

    .bar-track {
      width: 100%;
      display: flex;
      border-radius: var(--radius-md);
      overflow: hidden;
      gap: 1px;
      background: var(--color-bg-elevated);
    }

    .bar-seg {
      transition: width 0.5s ease;
      position: relative;
    }
    .bar-seg:hover { filter: brightness(1.15); }
    .bar-seg:first-child { border-radius: var(--radius-md) 0 0 var(--radius-md); }
    .bar-seg:last-child  { border-radius: 0 var(--radius-md) var(--radius-md) 0; }

    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3) var(--space-5);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 2px;
      flex-shrink: 0;
    }
    .legend-label {
      font-size: var(--text-xs);
      color: var(--color-text-secondary);
    }
    .legend-pct {
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-text-muted);
      margin-left: 2px;
    }
    .legend-value {
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-text-muted);
    }

    /* Segment hover tooltip */
    .seg-tooltip {
      position: fixed;
      min-width: 148px;
      padding: 9px 12px;
      border-radius: 8px;
      background: rgba(10,11,15,.97);
      border: 1px solid var(--color-border-default);
      box-shadow: 0 8px 24px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04);
      pointer-events: none;
      z-index: 999;
      opacity: 0;
      scale: 0.96;
      transition: opacity 80ms ease, scale 80ms ease;
    }
    .seg-tooltip.show { opacity: 1; scale: 1; }
    .seg-label { font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 5px; }
    .seg-val   { font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--color-text-primary); }
    .seg-row   { display: flex; justify-content: space-between; gap: 12px; margin-top: 4px; }
    .seg-lbl   { font-size: 10px; color: var(--color-text-muted); }
    .seg-pct   { font-family: var(--font-mono); font-size: 11px; font-weight: 500; color: var(--color-accent); }
  `;_showTip(e,t){this._tip={x:e.clientX+14,y:e.clientY-58,item:t}}_moveTip(e){this._tip&&(this._tip={...this._tip,x:e.clientX+14,y:e.clientY-58})}_hideTip(){this._tip=null}render(){const e=this.items||[],t=this.height||20;return o`
      <div class="chart-wrap">
        <div class="bar-track" style="height:${t}px">
          ${e.map(a=>o`
            <div
              class="bar-seg"
              style="width:${a.pct}%; background:${a.color};"
              @mouseenter=${s=>this._showTip(s,a)}
              @mousemove=${s=>this._moveTip(s)}
              @mouseleave=${()=>this._hideTip()}
            ></div>
          `)}
        </div>
        <div class="legend">
          ${e.map(a=>o`
            <div class="legend-item">
              <div class="legend-dot" style="background:${a.color}"></div>
              <span class="legend-label">${a.label}</span>
              <span class="legend-pct">${a.pct.toFixed(1)}%</span>
              <span class="legend-value">($${a.value.toLocaleString()})</span>
            </div>
          `)}
        </div>
      </div>

      ${this._tip?o`
        <div class="seg-tooltip show" style="left:${this._tip.x}px;top:${this._tip.y}px">
          <div class="seg-label">${this._tip.item.label}</div>
          <div class="seg-val">$${Number(this._tip.item.value||0).toLocaleString()}</div>
          <div class="seg-row">
            <span class="seg-lbl">Porción</span>
            <span class="seg-pct">${Number(this._tip.item.pct||0).toFixed(1)}%</span>
          </div>
        </div>
      `:""}
    `}}customElements.define("allocation-chart",qt);export{Ot as A,O as E,lr as P,b as a,jt as b,c,Pt as d,o as e,ar as f,x as g,ir as h,g as i,nr as j,_ as k,z as l,tr as m,It as n,Lt as o,rr as p,F as q,C as r,sr as s,er as t,Ft as u,k as v,Qt as w,G as x,or as y,je as z};
