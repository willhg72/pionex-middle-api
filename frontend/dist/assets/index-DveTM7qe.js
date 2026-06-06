(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();const te=globalThis,he=te.ShadowRoot&&(te.ShadyCSS===void 0||te.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,me=Symbol(),Se=new WeakMap;let Ve=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(he&&e===void 0){const a=t!==void 0&&t.length===1;a&&(e=Se.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&Se.set(t,e))}return e}toString(){return this.cssText}};const st=i=>new Ve(typeof i=="string"?i:i+"",void 0,me),m=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((a,r,o)=>a+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new Ve(t,i,me)},ot=(i,e)=>{if(he)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const a=document.createElement("style"),r=te.litNonce;r!==void 0&&a.setAttribute("nonce",r),a.textContent=t.cssText,i.appendChild(a)}},Ce=he?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const a of e.cssRules)t+=a.cssText;return st(t)})(i):i;const{is:nt,defineProperty:lt,getOwnPropertyDescriptor:dt,getOwnPropertyNames:ct,getOwnPropertySymbols:pt,getPrototypeOf:vt}=Object,re=globalThis,Ae=re.trustedTypes,ut=Ae?Ae.emptyScript:"",gt=re.reactiveElementPolyfillSupport,W=(i,e)=>i,ue={toAttribute(i,e){switch(e){case Boolean:i=i?ut:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},We=(i,e)=>!nt(i,e),Pe={attribute:!0,type:String,converter:ue,reflect:!1,useDefault:!1,hasChanged:We};Symbol.metadata??=Symbol("metadata"),re.litPropertyMetadata??=new WeakMap;let F=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Pe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const a=Symbol(),r=this.getPropertyDescriptor(e,a,t);r!==void 0&&lt(this.prototype,e,r)}}static getPropertyDescriptor(e,t,a){const{get:r,set:o}=dt(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:r,set(n){const p=r?.call(this);o?.call(this,n),this.requestUpdate(e,p,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Pe}static _$Ei(){if(this.hasOwnProperty(W("elementProperties")))return;const e=vt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(W("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(W("properties"))){const t=this.properties,a=[...ct(t),...pt(t)];for(const r of a)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[a,r]of t)this.elementProperties.set(a,r)}this._$Eh=new Map;for(const[t,a]of this.elementProperties){const r=this._$Eu(t,a);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const r of a)t.unshift(Ce(r))}else e!==void 0&&t.push(Ce(e));return t}static _$Eu(e,t){const a=t.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ot(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){const a=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,a);if(r!==void 0&&a.reflect===!0){const o=(a.converter?.toAttribute!==void 0?a.converter:ue).toAttribute(t,a.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,t){const a=this.constructor,r=a._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const o=a.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:ue;this._$Em=r;const p=n.fromAttribute(t,o.type);this[r]=p??this._$Ej?.get(r)??p,this._$Em=null}}requestUpdate(e,t,a,r=!1,o){if(e!==void 0){const n=this.constructor;if(r===!1&&(o=this[e]),a??=n.getPropertyOptions(e),!((a.hasChanged??We)(o,t)||a.useDefault&&a.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,a))))return;this.C(e,t,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:r,wrapped:o},n){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),o!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const a=this.constructor.elementProperties;if(a.size>0)for(const[r,o]of a){const{wrapped:n}=o,p=this[r];n!==!0||this._$AL.has(r)||p===void 0||this.C(r,void 0,o,p)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(a=>a.hostUpdate?.()),this.update(t)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};F.elementStyles=[],F.shadowRootOptions={mode:"open"},F[W("elementProperties")]=new Map,F[W("finalized")]=new Map,gt?.({ReactiveElement:F}),(re.reactiveElementVersions??=[]).push("2.1.2");const be=globalThis,Te=i=>i,ae=be.trustedTypes,Ee=ae?ae.createPolicy("lit-html",{createHTML:i=>i}):void 0,Je="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,Ye="?"+M,ht=`<${Ye}>`,B=document,Y=()=>B.createComment(""),X=i=>i===null||typeof i!="object"&&typeof i!="function",fe=Array.isArray,mt=i=>fe(i)||typeof i?.[Symbol.iterator]=="function",ne=`[ 	
\f\r]`,q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ze=/-->/g,Re=/>/g,U=RegExp(`>|${ne}(?:([^\\s"'>=/]+)(${ne}*=${ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Oe=/'/g,Le=/"/g,Xe=/^(?:script|style|textarea|title)$/i,Ze=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),s=Ze(1),j=Ze(2),G=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Ne=new WeakMap,I=B.createTreeWalker(B,129);function Qe(i,e){if(!fe(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ee!==void 0?Ee.createHTML(e):e}const bt=(i,e)=>{const t=i.length-1,a=[];let r,o=e===2?"<svg>":e===3?"<math>":"",n=q;for(let p=0;p<t;p++){const c=i[p];let g,u,v=-1,b=0;for(;b<c.length&&(n.lastIndex=b,u=n.exec(c),u!==null);)b=n.lastIndex,n===q?u[1]==="!--"?n=ze:u[1]!==void 0?n=Re:u[2]!==void 0?(Xe.test(u[2])&&(r=RegExp("</"+u[2],"g")),n=U):u[3]!==void 0&&(n=U):n===U?u[0]===">"?(n=r??q,v=-1):u[1]===void 0?v=-2:(v=n.lastIndex-u[2].length,g=u[1],n=u[3]===void 0?U:u[3]==='"'?Le:Oe):n===Le||n===Oe?n=U:n===ze||n===Re?n=q:(n=U,r=void 0);const f=n===U&&i[p+1].startsWith("/>")?" ":"";o+=n===q?c+ht:v>=0?(a.push(g),c.slice(0,v)+Je+c.slice(v)+M+f):c+M+(v===-2?p:f)}return[Qe(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),a]};class Z{constructor({strings:e,_$litType$:t},a){let r;this.parts=[];let o=0,n=0;const p=e.length-1,c=this.parts,[g,u]=bt(e,t);if(this.el=Z.createElement(g,a),I.currentNode=this.el.content,t===2||t===3){const v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(r=I.nextNode())!==null&&c.length<p;){if(r.nodeType===1){if(r.hasAttributes())for(const v of r.getAttributeNames())if(v.endsWith(Je)){const b=u[n++],f=r.getAttribute(v).split(M),x=/([.?@])?(.*)/.exec(b);c.push({type:1,index:o,name:x[2],strings:f,ctor:x[1]==="."?xt:x[1]==="?"?yt:x[1]==="@"?_t:se}),r.removeAttribute(v)}else v.startsWith(M)&&(c.push({type:6,index:o}),r.removeAttribute(v));if(Xe.test(r.tagName)){const v=r.textContent.split(M),b=v.length-1;if(b>0){r.textContent=ae?ae.emptyScript:"";for(let f=0;f<b;f++)r.append(v[f],Y()),I.nextNode(),c.push({type:2,index:++o});r.append(v[b],Y())}}}else if(r.nodeType===8)if(r.data===Ye)c.push({type:2,index:o});else{let v=-1;for(;(v=r.data.indexOf(M,v+1))!==-1;)c.push({type:7,index:o}),v+=M.length-1}o++}}static createElement(e,t){const a=B.createElement("template");return a.innerHTML=e,a}}function K(i,e,t=i,a){if(e===G)return e;let r=a!==void 0?t._$Co?.[a]:t._$Cl;const o=X(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,t,a)),a!==void 0?(t._$Co??=[])[a]=r:t._$Cl=r),r!==void 0&&(e=K(i,r._$AS(i,e.values),r,a)),e}class ft{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:a}=this._$AD,r=(e?.creationScope??B).importNode(t,!0);I.currentNode=r;let o=I.nextNode(),n=0,p=0,c=a[0];for(;c!==void 0;){if(n===c.index){let g;c.type===2?g=new Q(o,o.nextSibling,this,e):c.type===1?g=new c.ctor(o,c.name,c.strings,this,e):c.type===6&&(g=new wt(o,this,e)),this._$AV.push(g),c=a[++p]}n!==c?.index&&(o=I.nextNode(),n++)}return I.currentNode=B,r}p(e){let t=0;for(const a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=K(this,e,t),X(e)?e===$||e==null||e===""?(this._$AH!==$&&this._$AR(),this._$AH=$):e!==this._$AH&&e!==G&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):mt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==$&&X(this._$AH)?this._$AA.nextSibling.data=e:this.T(B.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:a}=e,r=typeof a=="number"?this._$AC(e):(a.el===void 0&&(a.el=Z.createElement(Qe(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===r)this._$AH.p(t);else{const o=new ft(r,this),n=o.u(this.options);o.p(t),this.T(n),this._$AH=o}}_$AC(e){let t=Ne.get(e.strings);return t===void 0&&Ne.set(e.strings,t=new Z(e)),t}k(e){fe(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let a,r=0;for(const o of e)r===t.length?t.push(a=new Q(this.O(Y()),this.O(Y()),this,this.options)):a=t[r],a._$AI(o),r++;r<t.length&&(this._$AR(a&&a._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const a=Te(e).nextSibling;Te(e).remove(),e=a}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class se{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,r,o){this.type=1,this._$AH=$,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=$}_$AI(e,t=this,a,r){const o=this.strings;let n=!1;if(o===void 0)e=K(this,e,t,0),n=!X(e)||e!==this._$AH&&e!==G,n&&(this._$AH=e);else{const p=e;let c,g;for(e=o[0],c=0;c<o.length-1;c++)g=K(this,p[a+c],t,c),g===G&&(g=this._$AH[c]),n||=!X(g)||g!==this._$AH[c],g===$?e=$:e!==$&&(e+=(g??"")+o[c+1]),this._$AH[c]=g}n&&!r&&this.j(e)}j(e){e===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class xt extends se{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===$?void 0:e}}class yt extends se{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==$)}}class _t extends se{constructor(e,t,a,r,o){super(e,t,a,r,o),this.type=5}_$AI(e,t=this){if((e=K(this,e,t,0)??$)===G)return;const a=this._$AH,r=e===$&&a!==$||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,o=e!==$&&(a===$||r);r&&this.element.removeEventListener(this.name,this,a),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class wt{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){K(this,e)}}const $t=be.litHtmlPolyfillSupport;$t?.(Z,Q),(be.litHtmlVersions??=[]).push("3.3.3");const kt=(i,e,t)=>{const a=t?.renderBefore??e;let r=a._$litPart$;if(r===void 0){const o=t?.renderBefore??null;a._$litPart$=r=new Q(e.insertBefore(Y(),o),o,void 0,t??{})}return r._$AI(i),r};const xe=globalThis;class h extends F{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=kt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}h._$litElement$=!0,h.finalized=!0,xe.litElementHydrateSupport?.({LitElement:h});const St=xe.litElementPolyfillSupport;St?.({LitElement:h});(xe.litElementVersions??=[]).push("4.2.2");const Ct={"sign-in":"sign-in","sign-up":"sign-up","forgot-password":"forgot-password","reset-password":"reset-password",overview:"overview",capital:"capital",miners:"miners",opportunities:"opportunities",scalping:"scalping","btc-core":"btc-core","btc-ladder":"btc-ladder",discovery:"discovery",settings:"settings"},At=[{id:"overview",label:{es:"Resumen",en:"Overview"},icon:"◈",group:"main"},{id:"capital",label:{es:"Capital",en:"Capital"},icon:"◐",group:"main"},{id:"miners",label:{es:"Mineros Activos",en:"Active Miners"},icon:"⬡",group:"operations"},{id:"opportunities",label:{es:"Oportunidades",en:"Opportunities"},icon:"◆",group:"operations"},{id:"scalping",label:{es:"Scalping Lab",en:"Scalping Lab"},icon:"⚡",group:"operations"},{id:"btc-core",label:{es:"BTC Core",en:"BTC Core"},icon:"₿",group:"btc"},{id:"btc-ladder",label:{es:"BTC Ladder",en:"BTC Ladder"},icon:"≡",group:"btc"},{id:"discovery",label:{es:"Discovery",en:"Discovery"},icon:"◎",group:"research"},{id:"settings",label:{es:"Configuración",en:"Settings"},icon:"⚙",group:"system"}];class Pt{constructor(){this._listeners=[],this._current=this._parseRoute(),window.addEventListener("hashchange",()=>this._onHashChange())}_parseRoute(){const t=window.location.hash.replace("#/","").replace("#","").split("?")[0];return t&&Ct[t]?t:"sign-in"}_onHashChange(){const e=this._parseRoute();e!==this._current&&(this._current=e,this._notify())}get current(){return this._current}navigate(e,t=""){window.location.hash=`/${e}${t?`?${t}`:""}`}onChange(e){return this._listeners.push(e),()=>{this._listeners=this._listeners.filter(t=>t!==e)}}_notify(){this._listeners.forEach(e=>e(this._current))}}const A=new Pt,P={save(i,e){try{localStorage.setItem(i,JSON.stringify({...e,_savedAt:Date.now()}))}catch(t){console.warn("[persistence] save failed:",t)}},load(i){try{const e=localStorage.getItem(i);return e?JSON.parse(e):null}catch(e){return console.warn("[persistence] load failed:",e),null}},remove(i){try{localStorage.removeItem(i)}catch{}},exportAll(){const i={};try{for(let e=0;e<localStorage.length;e++){const t=localStorage.key(e);t?.startsWith("capintel_")&&(i[t]=JSON.parse(localStorage.getItem(t)||"null"))}}catch(e){console.warn("[persistence] export failed:",e)}return i},importAll(i){try{return Object.entries(i).forEach(([e,t])=>{e.startsWith("capintel_")&&localStorage.setItem(e,JSON.stringify(t))}),!0}catch(e){return console.warn("[persistence] import failed:",e),!1}}},Me="capintel_state",De="capintel_audit",Tt=200,Et={totalCapital:87450,freeUsdt:12300,openPnl:1842.5,monthlyPnl:5210,riskScore:42,monthlyGoal:1e4,monthlyGoalProgress:52.1,capitalMiners:38e3,capitalScalp:8500,capitalBtcCore:15600,capitalLadder:13050,capitalIdle:12300,minerWarnings:2,newOpportunities:3,theme:"dark",refreshInterval:30,lastUpdated:Date.now()};class zt{constructor(){const t=P.load(Me)?.prefs||{};this._state={...Et,...t},this._listeners=[];const a=P.load(De);this._auditEvents=a?.events||[]}getState(){return{...this._state}}setState(e){this._state={...this._state,...e,lastUpdated:Date.now()},this._persist(),this._notify()}subscribe(e){return this._listeners.push(e),()=>{this._listeners=this._listeners.filter(t=>t!==e)}}refresh(){const e=()=>(Math.random()-.5)*200;this.setState({openPnl:parseFloat((this._state.openPnl+e()).toFixed(2)),freeUsdt:parseFloat((this._state.freeUsdt+e()*.1).toFixed(2))})}addAuditEvent({action:e,domain:t,payload:a={},result:r={},triggeredBy:o="user"}){const n={id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,timestamp:new Date().toISOString(),action:e,domain:t,triggeredBy:o,payload:a,result:r};return this._auditEvents=[n,...this._auditEvents].slice(0,Tt),this._persistAudit(),n}getAuditEvents({domain:e,limit:t=50}={}){let a=this._auditEvents;return e&&(a=a.filter(r=>r.domain===e)),a.slice(0,t)}clearAudit(){this._auditEvents=[],this._persistAudit()}_persist(){P.save(Me,{prefs:{theme:this._state.theme,refreshInterval:this._state.refreshInterval}})}_persistAudit(){P.save(De,{events:this._auditEvents})}_notify(){this._listeners.forEach(e=>e(this.getState()))}}const H=new zt,Rt=Object.freeze(Object.defineProperty({__proto__:null,store:H},Symbol.toStringTag,{value:"Module"})),Ot="/api/v1",Lt="capintel_settings",Nt="capintel_auth";class Mt extends Error{constructor(e,t,a=null){super(t),this.status=e,this.data=a}}function ye(){try{return JSON.parse(window.localStorage.getItem(Lt)??"{}")}catch{return{}}}function et(){try{return JSON.parse(window.localStorage.getItem(Nt)??"{}")}catch{return{}}}function Dt(){const i=et(),e=ye();return i.tenantApiKey?.trim()||e.tenantApiKey?.trim()||""}function Ut(){const i=ye();return i.exchangeApiSecret?.trim()||i.apiSecret?.trim()||""}function D(){const e=ye().exchangeApiKey?.trim()||"",t=Ut();return{...e?{api_key:e}:{},...t?{api_secret:t}:{}}}async function _(i,e={}){const t=`${Ot}${i}`,a=Dt(),r=et().token?.trim()||"",o={"Content-Type":"application/json",...a?{"X-API-Key":a}:{},...r?{Authorization:`Bearer ${r}`}:{},...e.headers},n=await fetch(t,{...e,headers:o});if(!n.ok){const p=await n.json().catch(()=>null);throw new Mt(n.status,n.statusText,p)}return n.status===204?null:n.json()}const _e="capintel_auth",ie="capintel_settings";function we(i){try{return JSON.parse(window.localStorage.getItem(i)??"{}")}catch{return{}}}function ge(i,e){window.localStorage.setItem(i,JSON.stringify(e))}function J(){const i=we(_e);return i?.token?i:null}function $e(i){const e={token:i.token,expiresAt:i.expiresAt,tenantApiKey:i.tenantApiKey,user:i.user,tenant:i.tenant};ge(_e,e);const t=we(ie);ge(ie,{...t,tenantApiKey:i.tenantApiKey})}function It(){const i=J(),e=we(ie);if(e.tenantApiKey&&e.tenantApiKey===i?.tenantApiKey){const{tenantApiKey:t,...a}=e;ge(ie,a)}window.localStorage.removeItem(_e)}function le(i=J()){return!i?.token||!i?.expiresAt?!1:Number(i.expiresAt)*1e3>Date.now()}async function Bt(i){const e=await _("/auth/sign-up",{method:"POST",body:JSON.stringify(i)});return $e(e),e}async function jt(i){const e=await _("/auth/sign-in",{method:"POST",body:JSON.stringify(i)});return $e(e),e}async function Ft(){return _("/auth/me")}async function Ht(i){return _("/auth/forgot-password",{method:"POST",body:JSON.stringify(i)})}async function Gt(i){return _("/auth/reset-password",{method:"POST",body:JSON.stringify(i)})}function Ue(){It()}const tt="capintel_lang",Ie={es:{product:"Capa de control Pionex",signIn:"Inicia sesión",signUp:"Crea tu espacio de trabajo",forgot:"Recupera tu cuenta",reset:"Restablece tu contraseña",email:"Correo",password:"Contraseña",newPassword:"Nueva contraseña",fullName:"Nombre completo",workspaceName:"Nombre del espacio",signInSubtitle:"Accede a tu espacio de trabajo para abrir el dashboard nuevo y continuar la migración por pestañas.",signUpSubtitle:"Este flujo crea el espacio principal, el usuario inicial y la llave interna con la que el frontend nuevo consume el backend.",forgotSubtitle:"Ingresa tu correo y prepararemos el flujo de recuperación.",resetSubtitle:"Define una nueva contraseña para volver a entrar.",signInButton:"Entrar al dashboard",signingIn:"Ingresando...",createWorkspace:"Crear espacio",creatingWorkspace:"Creando espacio...",sendRecovery:"Enviar recuperación",sendingRecovery:"Preparando recuperación...",updatePassword:"Actualizar contraseña",updatingPassword:"Actualizando...",noAccount:"¿Aún no tienes una cuenta?",createAccount:"Crear cuenta",alreadyHave:"¿Ya tienes una cuenta?",signInLink:"Inicia sesión",forgotPassword:"Olvidé mi contraseña",backToSignIn:"Volver al inicio de sesión",localRecovery:"En entorno local se muestra el enlace directo para probar la recuperación sin correo.",workspaceIsolation:"Aislamiento por espacio",authEntry:"Entrada de acceso",migrationPath:"Ruta de migración",cockpit:"Centro operativo",shellOverview:"Resumen",shellCapital:"Capital",shellMiners:"Mineros Activos",shellOpportunities:"Oportunidades",shellScalping:"Scalping Lab",shellBtcCore:"BTC Core",shellBtcLadder:"BTC Ladder",shellDiscovery:"Discovery",shellSettings:"Configuración",shellDashboard:"Dashboard",shellOperations:"Operación",shellBitcoin:"Bitcoin",shellResearch:"Research",shellSystem:"Sistema",totalCapital:"Capital total",freeUsdt:"USDT libre",openPnl:"PnL abierto",monthlyPnl:"PnL mensual",refresh:"Actualizar",signOut:"Salir",workspace:"Espacio"},en:{product:"Pionex Control Layer",signIn:"Sign in",signUp:"Create your workspace",forgot:"Recover your account",reset:"Reset your password",email:"Email",password:"Password",newPassword:"New password",fullName:"Full name",workspaceName:"Workspace name",signInSubtitle:"Access your workspace to open the new dashboard and continue the tab-by-tab migration.",signUpSubtitle:"This flow creates the main workspace, the initial user, and the internal key used by the new frontend.",forgotSubtitle:"Enter your email and we will prepare the recovery flow.",resetSubtitle:"Set a new password to sign in again.",signInButton:"Enter dashboard",signingIn:"Signing in...",createWorkspace:"Create workspace",creatingWorkspace:"Creating workspace...",sendRecovery:"Send recovery",sendingRecovery:"Preparing recovery...",updatePassword:"Update password",updatingPassword:"Updating...",noAccount:"Don't have an account yet?",createAccount:"Create account",alreadyHave:"Already have an account?",signInLink:"Sign in",forgotPassword:"Forgot password?",backToSignIn:"Back to sign in",localRecovery:"In local mode the app shows the direct recovery link so you can test without email.",workspaceIsolation:"Workspace isolation",authEntry:"Auth entry",migrationPath:"Migration path",cockpit:"Trading cockpit",shellOverview:"Overview",shellCapital:"Capital",shellMiners:"Active Miners",shellOpportunities:"Opportunities",shellScalping:"Scalping Lab",shellBtcCore:"BTC Core",shellBtcLadder:"BTC Ladder",shellDiscovery:"Discovery",shellSettings:"Settings",shellDashboard:"Dashboard",shellOperations:"Operations",shellBitcoin:"Bitcoin",shellResearch:"Research",shellSystem:"System",totalCapital:"Total Capital",freeUsdt:"Free USDT",openPnl:"Open PnL",monthlyPnl:"Monthly PnL",refresh:"Refresh",signOut:"Sign out",workspace:"Workspace"}};function z(){return window.localStorage.getItem(tt)||"es"}function O(i){window.localStorage.setItem(tt,i==="en"?"en":"es"),window.dispatchEvent(new CustomEvent("capintel-lang-changed"))}function d(i,e=z()){return Ie[e]?.[i]||Ie.es[i]||i}class Kt extends h{static properties={_route:{type:String,state:!0},_time:{type:String,state:!0},_connected:{type:Boolean,state:!0},_navOpen:{type:Boolean,state:!0},_session:{type:Object,state:!0},_lang:{type:String,state:!0}};static styles=m`
    :host { display:flex; flex-direction:column; height:100vh; width:100vw; overflow:hidden; background:var(--color-bg-base); color:var(--color-text-primary); font-family:var(--font-sans); }
    .topbar { height:var(--topbar-height); min-height:var(--topbar-height); background:var(--color-bg-panel); border-bottom:1px solid var(--color-border-subtle); display:flex; align-items:center; padding:0 var(--space-5); gap:var(--space-6); z-index:50; }
    .topbar-brand { display:flex; align-items:center; gap:var(--space-2); width:var(--nav-width); }
    .brand-icon { width:22px; height:22px; background:var(--color-accent); border-radius:5px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#fff; flex-shrink:0; }
    .brand-name { font-size:var(--text-sm); font-weight:var(--weight-semibold); letter-spacing:var(--tracking-tight); }
    .brand-sub { font-size:var(--text-xs); color:var(--color-text-muted); letter-spacing:var(--tracking-wider); text-transform:uppercase; }
    .topbar-metrics { display:flex; align-items:center; gap:var(--space-6); flex:1; }
    .topbar-metric { display:flex; align-items:baseline; gap:var(--space-2); }
    .topbar-metric-label { font-size:var(--text-xs); color:var(--color-text-muted); letter-spacing:var(--tracking-wide); text-transform:uppercase; }
    .topbar-metric-value { font-family:var(--font-mono); font-size:var(--text-sm); font-weight:var(--weight-semibold); letter-spacing:var(--tracking-tight); }
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
    @media (max-width:1024px) { .topbar-metric:nth-child(n+3) { display:none; } }
    @media (max-width:768px) {
      .hamburger { display:flex; }
      .topbar-brand { width:auto; }
      .brand-sub, .topbar-metrics, .topbar-clock { display:none !important; }
      .topbar { padding:0 var(--space-3); gap:var(--space-3); }
      .sidenav { position:fixed; top:var(--topbar-height); left:0; bottom:0; z-index:50; transform:translateX(-100%); transition:transform 0.22s cubic-bezier(0.4,0,0.2,1); box-shadow:4px 0 32px rgba(0,0,0,0.5); }
      .sidenav.open { transform:translateX(0); }
      .page-header { padding:var(--space-3); min-height:48px; }
      .page-title { font-size:var(--text-md); }
    }
  `;constructor(){super(),this._route=A.current,this._time=this._formatTime(),this._connected=!0,this._data=H.getState(),this._session=J(),this._lang=z()}connectedCallback(){super.connectedCallback(),this._routerOff=A.onChange(e=>{this._route=e,this._enforceRouteGuard()}),this._clockInterval=setInterval(()=>{this._time=this._formatTime()},1e3),this._storeOff=H.subscribe(e=>{this._data=e,this.requestUpdate()}),this._authChanged=()=>{this._session=J(),this._enforceRouteGuard(),this.requestUpdate()},this._langChanged=()=>{this._lang=z(),this.requestUpdate()},window.addEventListener("capintel-auth-changed",this._authChanged),window.addEventListener("capintel-lang-changed",this._langChanged),this._bootstrapSession()}disconnectedCallback(){super.disconnectedCallback(),this._routerOff?.(),this._storeOff?.(),window.removeEventListener("capintel-auth-changed",this._authChanged),window.removeEventListener("capintel-lang-changed",this._langChanged),clearInterval(this._clockInterval)}async _bootstrapSession(){if(!le(this._session)){this._session=null,this._enforceRouteGuard();return}try{const e=await Ft();$e({...this._session,expiresAt:e.expiresAt,tenantApiKey:e.tenantApiKey,user:e.user,tenant:e.tenant}),this._session=J()}catch{Ue(),this._session=null}this._enforceRouteGuard(),this.requestUpdate()}_isAuthRoute(e=this._route){return["sign-in","sign-up","forgot-password","reset-password"].includes(e)}_enforceRouteGuard(){const e=le(this._session);if(!e&&!this._isAuthRoute()){A.navigate("sign-in");return}e&&this._isAuthRoute()&&A.navigate("overview")}_formatTime(){return`${new Date().toLocaleTimeString("en-US",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"})} UTC`}_navigate(e){A.navigate(e),this._navOpen=!1}_getPageMeta(){const e={overview:{title:d("shellOverview",this._lang),subtitle:"Capital intelligence at a glance"},capital:{title:d("shellCapital",this._lang),subtitle:"Allocation breakdown and history"},miners:{title:d("shellMiners",this._lang),subtitle:"Perpetual futures grid positions"},opportunities:{title:d("shellOpportunities",this._lang),subtitle:"Candidate analysis and simulation"},scalping:{title:d("shellScalping",this._lang),subtitle:"Signal scan and execution"},"btc-core":{title:d("shellBtcCore",this._lang),subtitle:"Bitcoin accumulation strategy"},"btc-ladder":{title:d("shellBtcLadder",this._lang),subtitle:"DCA ladder order management"},discovery:{title:d("shellDiscovery",this._lang),subtitle:"Universe scan and symbol intake"},settings:{title:d("shellSettings",this._lang),subtitle:"API configuration, risk profile, preferences"}};return e[this._route]||e.overview}_getNavBadge(e){const t=this._data;return e==="miners"&&t.minerWarnings>0?{count:t.minerWarnings,type:"danger"}:e==="opportunities"&&t.newOpportunities>0?{count:t.newOpportunities,type:"warn"}:null}_getRiskClass(){const e=this._data.riskScore;return e<35?"risk-low":e<65?"risk-medium":"risk-high"}_getRiskLabel(){const e=this._data.riskScore;return e<35?`LOW ${e}`:e<65?`MED ${e}`:`HIGH ${e}`}_renderNavGroups(){const e={main:d("shellDashboard",this._lang),operations:d("shellOperations",this._lang),btc:d("shellBitcoin",this._lang),research:d("shellResearch",this._lang),system:d("shellSystem",this._lang)},t={};return At.forEach(a=>{t[a.group]||(t[a.group]=[]),t[a.group].push(a)}),Object.entries(t).map(([a,r])=>s`
      <div class="nav-group">
        <div class="nav-group-label">${e[a]}</div>
        ${r.map(o=>{const n=this._getNavBadge(o.id);return s`
            <div class="nav-item ${this._route===o.id?"active":""}" @click=${()=>this._navigate(o.id)}>
              <span class="nav-icon">${o.icon}</span>
              <span>${o.label[this._lang]||o.label.en}</span>
              ${n?s`<span class="nav-badge ${n.type==="warn"?"nav-badge-warn":""}">${n.count}</span>`:""}
            </div>
          `})}
      </div>
    `)}_renderView(){const e={"sign-in":s`<sign-in-view></sign-in-view>`,"sign-up":s`<sign-up-view></sign-up-view>`,"forgot-password":s`<forgot-password-view></forgot-password-view>`,"reset-password":s`<reset-password-view></reset-password-view>`,overview:s`<overview-view></overview-view>`,capital:s`<capital-view></capital-view>`,miners:s`<miners-view></miners-view>`,opportunities:s`<opportunities-view></opportunities-view>`,scalping:s`<scalping-view></scalping-view>`,"btc-core":s`<btc-core-view></btc-core-view>`,"btc-ladder":s`<btc-ladder-view></btc-ladder-view>`,discovery:s`<discovery-view></discovery-view>`,settings:s`<settings-view></settings-view>`};return e[this._route]||e.overview}render(){const e=this._data,t=this._getPageMeta(),a=e.openPnl>=0?"metric-positive":"metric-negative",r=e.openPnl>=0?"+":"";return le(this._session)?s`
      <div class="nav-backdrop ${this._navOpen?"visible":""}" @click=${()=>this._navOpen=!1}></div>
      <div class="topbar">
        <button class="hamburger" @click=${()=>this._navOpen=!this._navOpen} aria-label="Menu">☰</button>
        <div class="topbar-brand">
          <div class="brand-icon">CI</div>
          <div>
            <div class="brand-name">CapIntel</div>
            <div class="brand-sub">${d("cockpit",this._lang)}</div>
          </div>
        </div>
        <div class="topbar-metrics">
          <div class="topbar-metric">
            <span class="topbar-metric-label">${d("totalCapital",this._lang)}</span>
            <span class="topbar-metric-value metric-neutral">$${e.totalCapital.toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0})}</span>
          </div>
          <div class="topbar-metric">
            <span class="topbar-metric-label">${d("freeUsdt",this._lang)}</span>
            <span class="topbar-metric-value metric-neutral">$${e.freeUsdt.toLocaleString("en-US",{minimumFractionDigits:0})}</span>
          </div>
          <div class="topbar-metric">
            <span class="topbar-metric-label">${d("openPnl",this._lang)}</span>
            <span class="topbar-metric-value ${a}">${r}$${Math.abs(e.openPnl).toLocaleString("en-US",{minimumFractionDigits:0})}</span>
          </div>
          <div class="topbar-metric">
            <span class="topbar-metric-label">${d("monthlyPnl",this._lang)}</span>
            <span class="topbar-metric-value ${e.monthlyPnl>=0?"metric-positive":"metric-negative"}">${e.monthlyPnl>=0?"+":""}$${Math.abs(e.monthlyPnl).toLocaleString("en-US",{minimumFractionDigits:0})}</span>
          </div>
        </div>
        <div class="topbar-right">
          <button class="refresh-btn" @click=${()=>O(this._lang==="es"?"en":"es")}>${this._lang.toUpperCase()}</button>
          <div class="topbar-clock">${this._session?.tenant?.name||d("workspace",this._lang)}</div>
          <div class="risk-badge-topbar ${this._getRiskClass()}">RISK ${this._getRiskLabel()}</div>
          <div class="topbar-clock">${this._time}</div>
          <div class="connection-dot ${this._connected?"":"disconnected"}" title="${this._connected?"Connected":"Disconnected"}"></div>
          <button class="refresh-btn" @click=${()=>{Ue(),this._session=null,A.navigate("sign-in")}}>
            ${d("signOut",this._lang)}
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
              <div class="page-title">${t.title}</div>
              <div class="page-subtitle">${t.subtitle}</div>
            </div>
            <div class="page-actions">
              <button class="refresh-btn" @click=${()=>H.refresh()}>↻ ${d("refresh",this._lang)}</button>
            </div>
          </div>
          <div class="view-outlet">${this._renderView()}</div>
        </main>
      </div>
    `:s`${this._renderView()}`}}customElements.define("app-shell",Kt);class qt extends h{static properties={label:{type:String},value:{type:String},sub:{type:String},delta:{type:Number},deltaPct:{type:Number},accent:{type:String},size:{type:String},mono:{type:Boolean}};static styles=m`
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
      font-size: var(--text-2xl);
      font-weight: var(--weight-semibold);
      letter-spacing: -0.025em;
      line-height: 1.1;
      color: var(--color-text-primary);
    }
    .value.mono { font-family: var(--font-mono); }
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
  `;render(){const e=this.accent||"neutral",t=this.size||"md",a=this.delta>=0;return s`
      <div class="card">
        <div class="accent-bar ${e}"></div>
        <div class="label">${this.label}</div>
        <div class="value ${e} ${t} ${this.mono?"mono":""}">${this.value}</div>
        <div class="footer">
          ${this.sub?s`<span class="sub">${this.sub}</span>`:""}
          ${this.delta!==void 0?s`
            <span class="delta ${a?"delta-pos":"delta-neg"}">
              ${a?"▲":"▼"} ${Math.abs(this.delta).toFixed(2)}${this.deltaPct!==void 0?` (${Math.abs(this.deltaPct).toFixed(1)}%)`:""}
            </span>
          `:""}
        </div>
      </div>
    `}}customElements.define("stat-card",qt);class Vt extends h{static properties={options:{type:Array},value:{type:String}};static styles=m`
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
  `;_select(e){this.value=e,this.dispatchEvent(new CustomEvent("change",{detail:e,bubbles:!0}))}render(){return s`
      <div class="control">
        ${(this.options||[]).map(e=>s`
          <div
            class="seg ${this.value===e.value?"active":""}"
            @click=${()=>this._select(e.value)}
          >${e.label}</div>
        `)}
      </div>
    `}}customElements.define("segmented-control",Vt);class Wt extends h{static properties={columns:{type:Array},rows:{type:Array},emptyText:{type:String},compact:{type:Boolean},highlightFn:{type:Object}};static styles=m`
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
  `;_renderCell(e,t){if(e.render)return e.render(t[e.key],t);const a=t[e.key];return a??"—"}render(){const e=this.columns||[],t=this.rows||[];return s`
      <div class="table-wrap">
        <table class="${this.compact?"compact":""}">
          <thead>
            <tr>
              ${e.map(a=>s`
                <th class="${a.align||"left"}" style="${a.width?`width:${a.width}`:""}">${a.label}</th>
              `)}
            </tr>
          </thead>
          <tbody>
            ${t.length===0?s`
              <tr class="empty-row">
                <td colspan="${e.length}">${this.emptyText||"No data"}</td>
              </tr>
            `:t.map(a=>{const r=this.highlightFn?this.highlightFn(a):"";return s`
                <tr class="${r}" @click=${()=>this.dispatchEvent(new CustomEvent("row-click",{detail:a,bubbles:!0}))}>
                  ${e.map(o=>s`
                    <td class="${o.align||"left"}">${this._renderCell(o,a)}</td>
                  `)}
                </tr>
              `})}
          </tbody>
        </table>
      </div>
    `}}customElements.define("data-table",Wt);class Jt extends h{static properties={value:{type:Number},min:{type:Number},max:{type:Number},step:{type:Number},label:{type:String},suffix:{type:String},prefix:{type:String},disabled:{type:Boolean}};static styles=m`
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
  `;_change(e){const t=parseFloat(e.target.value);this.value=isNaN(t)?this.value:t,this.dispatchEvent(new CustomEvent("change",{detail:this.value,bubbles:!0}))}_step(e){const t=this.step||1,a=(this.value||0)+e*t,r=this.min!==void 0?Math.max(this.min,this.max!==void 0?Math.min(this.max,a):a):a;this.value=parseFloat(r.toFixed(8)),this.dispatchEvent(new CustomEvent("change",{detail:this.value,bubbles:!0}))}render(){return s`
      <div class="field">
        ${this.label?s`<label class="label">${this.label}</label>`:""}
        <div class="input-wrap">
          ${this.prefix?s`<span class="prefix">${this.prefix}</span>`:""}
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
          ${this.suffix?s`<span class="suffix">${this.suffix}</span>`:""}
          <button class="btn-step" @click=${()=>this._step(-1)}>−</button>
          <button class="btn-step" @click=${()=>this._step(1)}>+</button>
        </div>
      </div>
    `}}customElements.define("numeric-input",Jt);class Yt extends h{static properties={_toasts:{type:Array,state:!0}};static styles=m`
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
  `;constructor(){super(),this._toasts=[],window.toast=(e,t={})=>this.show(e,t)}show(e,{type:t="info",title:a,duration:r=4e3}={}){const o=Date.now()+Math.random(),n={id:o,message:e,title:a,type:t};this._toasts=[...this._toasts,n],r>0&&setTimeout(()=>this._dismiss(o),r)}_dismiss(e){this._toasts=this._toasts.filter(t=>t.id!==e)}_icon(e){return{success:"✓",error:"✕",warning:"!",info:"i"}[e]||"i"}render(){return s`
      ${this._toasts.map(e=>s`
        <div class="toast ${e.type}">
          <span class="toast-icon">${this._icon(e.type)}</span>
          <div class="toast-body">
            ${e.title?s`<div class="toast-title">${e.title}</div>`:""}
            <div class="toast-sub">${e.message}</div>
          </div>
          <button class="toast-close" @click=${()=>this._dismiss(e.id)}>✕</button>
        </div>
      `)}
    `}}customElements.define("toast-notification",Yt);class Xt extends h{static properties={title:{type:String},message:{type:String},confirmLabel:{type:String},cancelLabel:{type:String},danger:{type:Boolean}};static styles=m`
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
  `;_confirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0}))}render(){return s`
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
    `}}customElements.define("confirmation-modal",Xt);const ke=i=>new Promise(e=>setTimeout(e,i)),T=m`
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
`;class Zt extends h{static properties={title:{type:String},subtitle:{type:String},domain:{type:String},payload:{type:Array},warnings:{type:Array},executeFn:{type:Object},confirmText:{type:String},dangerLevel:{type:String},_step:{type:String,state:!0},_result:{type:Object,state:!0},_confirmed:{type:Boolean,state:!0}};static styles=[T,m`
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
  `];constructor(){super(),this._step="preview",this._confirmed=!1,this._result=null,this._auditEntry=null}_close(){this.dispatchEvent(new CustomEvent("closed",{bubbles:!0}))}_stepStatus(e){const t=["preview","confirm","executing","success"],a=t.indexOf(e),r=t.indexOf(this._step);return a<r?"done":a===r?"active":""}_payloadForAudit(){const e={};return(this.payload||[]).forEach(t=>{e[t.label]=t.value}),e}async _execute(){this._step="executing",await ke(1200);try{const e=this.executeFn?await this.executeFn():{success:!0,message:"Action executed successfully."};this._result=e,this._step=e.success?"success":"error",this._auditEntry=H.addAuditEvent({action:this.title||"Unknown Action",domain:this.domain||"unknown",payload:this._payloadForAudit(),result:e,triggeredBy:"user"}),e.success&&this.dispatchEvent(new CustomEvent("executed",{detail:{result:e,auditId:this._auditEntry.id},bubbles:!0}))}catch(e){this._result={success:!1,message:e.message||"Execution failed."},this._step="error",this._auditEntry=H.addAuditEvent({action:this.title||"Unknown Action",domain:this.domain||"unknown",payload:this._payloadForAudit(),result:this._result,triggeredBy:"user"})}}_renderSteps(){return s`
      <div class="steps">
        <div class="step-dot ${this._stepStatus("preview")}"></div>
        <div class="step-line"></div>
        <div class="step-dot ${this._stepStatus("confirm")}"></div>
        <div class="step-line"></div>
        <div class="step-dot ${this._stepStatus("executing")}"></div>
      </div>
    `}_renderPreview(){const e=this.dangerLevel||"normal";return s`
      ${this._renderSteps()}

      ${(this.warnings||[]).length>0?s`
        <div class="warnings-block">
          ${this.warnings.map(t=>s`
            <div class="warning-item ${e==="danger"?"danger":""}">
              <span>${e==="danger"?"⚠":"!"}</span> ${t}
            </div>
          `)}
        </div>
      `:""}

      <div class="payload">
        ${(this.payload||[]).map(t=>s`
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
    `}_renderConfirm(){const e=this.dangerLevel==="danger"?"btn-danger":"btn-primary";return s`
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
    `}_renderExecuting(){return s`
      <div class="executing-content">
        <div class="spinner"></div>
        <div class="executing-label">Sending to exchange...</div>
      </div>
    `}_renderResult(){const e=this._step==="success",t=this._auditEntry;return s`
      <div class="result-content">
        <div class="result-icon">${e?"✓":"✕"}</div>
        <div class="result-message" style="color:${e?"var(--color-positive)":"var(--color-negative)"}">
          ${e?"Executed successfully":"Execution failed"}
        </div>
        <div class="result-sub">${this._result?.message||""}</div>
      </div>
      ${t?s`
        <div class="audit-stamp">
          ◈ Audit #${t.id.slice(-6)} · ${new Date(t.timestamp).toLocaleTimeString("en-US",{hour12:!1})} · ${t.domain}
        </div>
      `:""}
      <div class="footer">
        <button class="btn btn-ghost" @click=${this._close}>Close</button>
      </div>
    `}render(){return s`
      <div class="overlay" @click=${e=>{e.target===e.currentTarget&&this._close()}}>
        <div class="modal">
          <div class="modal-header">
            <div>
              <div class="modal-title">${this.title||"Confirm Action"}</div>
              ${this.subtitle?s`<div class="modal-sub">${this.subtitle}</div>`:""}
            </div>
            <button class="close-btn" @click=${this._close}>✕</button>
          </div>

          ${this._step==="preview"?this._renderPreview():""}
          ${this._step==="confirm"?this._renderConfirm():""}
          ${this._step==="executing"?this._renderExecuting():""}
          ${this._step==="success"||this._step==="error"?this._renderResult():""}
        </div>
      </div>
    `}}customElements.define("preview-execute-modal",Zt);class Qt extends h{static properties={score:{type:Number},label:{type:String},size:{type:String}};static styles=m`
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
  `;_getLevel(){return this.label?this.label.toLowerCase():this.score===void 0?"none":this.score<25||this.score<50?"low":this.score<65?"medium":this.score<80?"high":"extreme"}_getLabel(){if(this.label)return this.label;const e=this._getLevel(),t={low:"Low",medium:"Medium",high:"High",extreme:"Extreme",none:"None"};return this.score!==void 0?`${t[e]} ${this.score}`:t[e]}render(){const e=this._getLevel(),t=this.size||"md";return s`
      <span class="badge ${e} ${t}">
        <span class="dot ${e}"></span>
        ${this._getLabel()}
      </span>
    `}}customElements.define("risk-badge",Qt);const oe=m`
  :host { display: flex; align-items: center; justify-content: center; padding: var(--space-12); width: 100%; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: var(--space-3); text-align: center; }
  .icon { font-size: 32px; opacity: 0.4; }
  .label { font-size: var(--text-sm); color: var(--color-text-muted); }
  .sub   { font-size: var(--text-xs); color: var(--color-text-disabled); }
`;class ea extends h{static properties={label:{type:String}};static styles=[oe,m`
    .spinner { width: 32px; height: 32px; border: 2px solid var(--color-border-default); border-top-color: var(--color-accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `];render(){return s`<div class="wrap"><div class="spinner"></div><span class="label">${this.label||"Loading..."}</span></div>`}}class ta extends h{static properties={label:{type:String},sub:{type:String}};static styles=oe;render(){return s`<div class="wrap"><div class="icon">◎</div><span class="label">${this.label||"No data"}</span>${this.sub?s`<span class="sub">${this.sub}</span>`:""}</div>`}}class aa extends h{static properties={label:{type:String},sub:{type:String}};static styles=[oe,m`.icon { color: var(--color-negative); }`];render(){return s`<div class="wrap"><div class="icon">⚠</div><span class="label" style="color:var(--color-negative)">${this.label||"Error loading data"}</span>${this.sub?s`<span class="sub">${this.sub}</span>`:""}</div>`}}class ia extends h{static properties={label:{type:String},age:{type:String}};static styles=[oe,m`.icon { color: var(--color-warning); }`];render(){return s`<div class="wrap"><div class="icon">⟳</div><span class="label" style="color:var(--color-warning)">${this.label||"Data may be stale"}</span>${this.age?s`<span class="sub">Last updated ${this.age}</span>`:""}</div>`}}customElements.define("loading-view",ea);customElements.define("empty-view",ta);customElements.define("error-view",aa);customElements.define("stale-view",ia);class ra extends h{static properties={value:{type:Number},max:{type:Number},label:{type:String},sublabel:{type:String},color:{type:String},height:{type:Number},showPct:{type:Boolean}};static styles=m`
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
  `;render(){const e=Math.min(100,Math.max(0,this.value||0)),t=this.height||6;return s`
      <div class="wrapper">
        ${this.label||this.showPct?s`
          <div class="header">
            ${this.label?s`<span class="header-label">${this.label}</span>`:""}
            ${this.showPct?s`<span class="header-pct">${e.toFixed(1)}%</span>`:""}
          </div>
        `:""}
        <div class="track" style="height:${t}px">
          <div class="fill" style="width:${e}%; --fill-color:${this.color||""}"></div>
        </div>
        ${this.sublabel?s`<div style="font-size:var(--text-xs);color:var(--color-text-muted)">${this.sublabel}</div>`:""}
      </div>
    `}}customElements.define("progress-bar",ra);class sa extends h{static properties={items:{type:Array},height:{type:Number},total:{type:Number}};static styles=m`
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
  `;render(){const e=this.items||[],t=this.height||20;return s`
      <div class="chart-wrap">
        <div class="bar-track" style="height:${t}px">
          ${e.map(a=>s`
            <div
              class="bar-seg"
              style="width:${a.pct}%; background:${a.color};"
              title="${a.label}: $${a.value.toLocaleString()} (${a.pct.toFixed(1)}%)"
            ></div>
          `)}
        </div>
        <div class="legend">
          ${e.map(a=>s`
            <div class="legend-item">
              <div class="legend-dot" style="background:${a.color}"></div>
              <span class="legend-label">${a.label}</span>
              <span class="legend-pct">${a.pct.toFixed(1)}%</span>
              <span class="legend-value">($${a.value.toLocaleString()})</span>
            </div>
          `)}
        </div>
      </div>
    `}}customElements.define("allocation-chart",sa);const oa={totalCapital:87450,freeUsdt:12300,openPnl:1842.5,monthlyPnl:5210,riskScore:42,monthlyGoal:1e4,monthlyGoalProgress:52.1,capitalMiners:38e3,capitalScalp:8500,capitalBtcCore:15600,capitalLadder:13050,capitalIdle:12300,capitalAllocation:[{label:"Active Miners",value:38e3,color:"var(--color-strategy-miners)",pct:43.5},{label:"BTC Core",value:15600,color:"var(--color-strategy-btccore)",pct:17.8},{label:"BTC Ladder",value:13050,color:"var(--color-strategy-ladder)",pct:14.9},{label:"Scalping",value:8500,color:"var(--color-strategy-scalp)",pct:9.7},{label:"Free / Idle",value:12300,color:"var(--color-strategy-idle)",pct:14.1}],liquidity:{exposure:75150,free:12300,totalPortfolio:87450,exposurePct:85.9},alerts:[{id:1,level:"danger",message:"XRPUSDT miner grid gap exceeded 4.2% — consider regrid",time:"4m ago"},{id:2,level:"warning",message:"BTC ladder has 3 unfilled levels past lower bound",time:"12m ago"},{id:3,level:"warning",message:"Scalping daily target at 78% — reduce position sizing",time:"28m ago"},{id:4,level:"info",message:"Monthly goal progress: 52.1% — on track",time:"1h ago"}],advisor:{generatedAt:Date.now()-3e5,executiveSummary:"Your portfolio is performing within expected parameters. Capital efficiency is strong at 85.9% deployed, with healthy diversification across 4 active strategies. Open PnL of +$1,842 indicates positive momentum in current positions. Risk score of 42/100 suggests conservative-moderate exposure — appropriate for current market conditions.",recommendations:[{priority:1,category:"Capital Reallocation",action:"Deploy $5,000 from idle reserves into SOLUSDT miner",rationale:"SOL volatility is elevated (7-day realized vol: 82%) — favorable grid mining conditions.",impact:"Est. +$180–$340/month additional yield",risk:"Low"},{priority:2,category:"Risk Reduction",action:"Regrid XRPUSDT miner — current grid gap is suboptimal",rationale:"Gap widened to 4.2% vs optimal 2.8% for current volatility regime.",impact:"Reduces regrid frequency, improves fill rate",risk:"Minimal operational risk"},{priority:3,category:"BTC Ladder",action:"Extend BTC ladder lower bound by $2,000 at -8% levels",rationale:"BTC showing consolidation signals — extended ladder captures potential dip.",impact:"Captures additional BTC accumulation on deeper dips",risk:"Capital locked in lower ladder rungs"}],riskSuggestions:["Total exposure (85.9%) is approaching your 90% soft limit — monitor free liquidity.","XRPUSDT miner represents single-ticker concentration risk. Consider diversifying to 3+ tickers.","Scalping leverage at 10x is within profile, but reduce to 7x if daily PnL drops below -$200."],educationalTips:[{title:"Grid Mining in High-Volatility Markets",body:"When realized volatility exceeds 80%, tighten grid spacing to capture more oscillations. Consider widening the outer bounds to avoid premature grid close."},{title:"Capital Efficiency Principle",body:"Keeping 10–15% in free USDT provides tactical flexibility without sacrificing yield. Your current 14.1% idle is well-positioned."}],warnings:[{level:"high",text:"XRPUSDT grid gap requires attention within 24h"},{level:"medium",text:"BTC ladder lower levels unfilled — market may not revisit"}],whatIfSimulations:null},recommendedActions:[{id:"regrid-xrp",label:"Regrid XRPUSDT",route:"miners",urgency:"high"},{id:"deploy-sol",label:"New SOL Opportunity",route:"opportunities",urgency:"medium"},{id:"extend-ladder",label:"Extend BTC Ladder",route:"btc-ladder",urgency:"medium"},{id:"review-scalp",label:"Review Scalping Limits",route:"scalping",urgency:"low"}]},l={usd(i,e=0){return"$"+Math.abs(i).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})},pnl(i,e=2){const t=i>=0?"+":"-",a=Math.abs(i).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e});return`${t}$${a}`},pct(i,e=2){return`${i>=0?"+":""}${i.toFixed(e)}%`},pctPlain(i,e=1){return`${i.toFixed(e)}%`},compact(i){return Math.abs(i)>=1e6?`$${(i/1e6).toFixed(2)}M`:Math.abs(i)>=1e3?`$${(i/1e3).toFixed(1)}K`:`$${i.toFixed(2)}`},btc(i,e=5){return`${i.toFixed(e)} BTC`},leverage(i){return`${i}x`},date(i){return new Date(i).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})},datetime(i){return new Date(i).toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:!1})},riskLabel(i){return i<25?"Minimal":i<50?"Low":i<65?"Medium":i<80?"High":"Critical"},riskClass(i){return i<50?"positive":i<65?"warning":"negative"}};class na extends h{static properties={_data:{type:Object,state:!0},_advisorTab:{type:String,state:!0}};static styles=m`
    :host { display: block; }
    .page {
      padding: var(--content-padding);
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    /* === KPI GRID === */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-3);
    }

    /* === TWO-COLUMN LAYOUT === */
    .row-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    .row-3col {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: var(--space-4);
    }

    /* === PANELS === */
    .panel {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
    }

    .panel-title {
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-4);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .panel-title-label { display: flex; align-items: center; gap: var(--space-2); }

    /* === LIQUIDITY BAR === */
    .liquidity-bar-wrap {
      margin-top: var(--space-3);
    }
    .liq-header {
      display: flex;
      justify-content: space-between;
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      margin-bottom: var(--space-2);
    }
    .liq-track {
      height: 12px;
      background: var(--color-bg-elevated);
      border-radius: var(--radius-full);
      overflow: hidden;
      display: flex;
    }
    .liq-fill {
      height: 100%;
      background: var(--color-accent);
      border-radius: var(--radius-full) 0 0 var(--radius-full);
      transition: width 0.5s ease;
    }
    .liq-free {
      height: 100%;
      background: var(--color-positive-dim);
      flex: 1;
    }
    .liq-legend {
      display: flex;
      gap: var(--space-4);
      margin-top: var(--space-3);
      font-size: var(--text-xs);
    }
    .liq-legend-item { display: flex; align-items: center; gap: var(--space-1); }
    .liq-dot { width: 8px; height: 8px; border-radius: 2px; }

    /* === ALERTS === */
    .alert-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      padding: var(--space-3);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-2);
      font-size: var(--text-sm);
      cursor: pointer;
      transition: filter var(--transition-fast);
    }
    .alert-item:hover { filter: brightness(1.1); }
    .alert-item:last-child { margin-bottom: 0; }
    .alert-danger  { background: var(--color-negative-dim); border-left: 3px solid var(--color-negative); }
    .alert-warning { background: var(--color-warning-dim);  border-left: 3px solid var(--color-warning); }
    .alert-info    { background: var(--color-accent-dim);   border-left: 3px solid var(--color-accent); }

    .alert-icon { flex-shrink: 0; font-size: 14px; margin-top: 1px; }
    .alert-text { flex: 1; color: var(--color-text-primary); line-height: 1.4; }
    .alert-time { font-size: var(--text-xs); color: var(--color-text-muted); white-space: nowrap; }

    /* === AI ADVISOR === */
    .advisor-panel {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-lg);
    }

    .advisor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--card-padding);
      border-bottom: 1px solid var(--color-border-subtle);
    }

    .advisor-title {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-md);
      font-weight: var(--weight-semibold);
    }

    .advisor-chip {
      font-size: 10px;
      font-weight: var(--weight-semibold);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 2px 7px;
      background: var(--color-accent-dim);
      color: var(--color-accent);
      border-radius: var(--radius-sm);
    }

    .advisor-timestamp {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .advisor-tabs {
      display: flex;
      gap: 0;
      padding: 0 var(--card-padding);
      border-bottom: 1px solid var(--color-border-subtle);
      overflow-x: auto;
    }

    .advisor-tab {
      padding: var(--space-3) var(--space-4);
      font-size: var(--text-xs);
      font-weight: var(--weight-medium);
      color: var(--color-text-muted);
      cursor: pointer;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      transition: all var(--transition-fast);
    }
    .advisor-tab:hover { color: var(--color-text-secondary); }
    .advisor-tab.active {
      color: var(--color-accent);
      border-bottom-color: var(--color-accent);
    }

    .advisor-content {
      padding: var(--card-padding);
    }

    .advisor-summary {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      line-height: 1.7;
    }

    .rec-card {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-3);
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-3);
      border-left: 3px solid var(--color-accent);
    }
    .rec-card:last-child { margin-bottom: 0; }

    .rec-priority {
      width: 24px; height: 24px;
      border-radius: 50%;
      background: var(--color-accent-dim);
      color: var(--color-accent);
      font-size: var(--text-xs);
      font-weight: var(--weight-bold);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .rec-body { flex: 1; }
    .rec-category { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 3px; }
    .rec-action { font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text-primary); margin-bottom: 4px; }
    .rec-rationale { font-size: var(--text-xs); color: var(--color-text-muted); }
    .rec-impact {
      margin-top: var(--space-2);
      font-size: var(--text-xs);
      color: var(--color-positive);
      display: flex; align-items: center; gap: var(--space-1);
    }

    .risk-sug {
      display: flex; align-items: flex-start; gap: var(--space-2);
      padding: var(--space-3);
      background: var(--color-warning-dim);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      color: var(--color-warning);
      margin-bottom: var(--space-2);
    }

    .tip-card {
      padding: var(--space-3);
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-2);
    }
    .tip-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-2); }
    .tip-body  { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.6; }

    .warning-item-advisor {
      display: flex; align-items: center; gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      margin-bottom: var(--space-2);
    }
    .warning-item-advisor.high   { background: var(--color-negative-dim); color: var(--color-negative); }
    .warning-item-advisor.medium { background: var(--color-warning-dim);  color: var(--color-warning); }

    .whatif-placeholder {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: var(--space-10);
      border: 2px dashed var(--color-border-default);
      border-radius: var(--radius-lg);
      gap: var(--space-3);
      text-align: center;
    }
    .whatif-icon { font-size: 32px; opacity: 0.3; }
    .whatif-label { font-size: var(--text-sm); color: var(--color-text-muted); }
    .whatif-sub { font-size: var(--text-xs); color: var(--color-text-disabled); }

    /* === RECOMMENDED ACTIONS === */
    .action-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: var(--space-3);
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-2);
      cursor: pointer;
      transition: background var(--transition-fast);
    }
    .action-item:hover { background: var(--color-bg-hover); }
    .action-item:last-child { margin-bottom: 0; }

    .action-left { display: flex; align-items: center; gap: var(--space-3); }
    .urgency-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .urgency-high   { background: var(--color-negative); box-shadow: 0 0 6px var(--color-negative); }
    .urgency-medium { background: var(--color-warning); }
    .urgency-low    { background: var(--color-idle); }

    .action-label { font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text-primary); }
    .action-arrow { color: var(--color-text-muted); font-size: 14px; }

    /* === MONTHLY PROGRESS === */
    .goal-header {
      display: flex; justify-content: space-between; align-items: baseline;
      margin-bottom: var(--space-3);
    }
    .goal-amount { font-family: var(--font-mono); font-size: var(--text-2xl); font-weight: var(--weight-semibold); color: var(--color-positive); }
    .goal-target { font-size: var(--text-xs); color: var(--color-text-muted); }

    @media (max-width: 1100px) {
      .row-2col { grid-template-columns: 1fr; }
      .row-3col { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 800px) {
      .row-3col { grid-template-columns: 1fr; }
    }
  `;constructor(){super(),this._data=oa,this._advisorTab="summary"}_renderKpiGrid(){const e=this._data,t=[{label:"Total Capital",value:l.usd(e.totalCapital),accent:"neutral",mono:!0},{label:"Free USDT",value:l.usd(e.freeUsdt),accent:"accent",mono:!0,sub:`${(e.freeUsdt/e.totalCapital*100).toFixed(1)}% of total`},{label:"Open PnL",value:l.pnl(e.openPnl),accent:e.openPnl>=0?"positive":"negative",mono:!0},{label:"Monthly PnL",value:l.pnl(e.monthlyPnl),accent:e.monthlyPnl>=0?"positive":"negative",mono:!0},{label:"Risk Score",value:`${e.riskScore}/100`,accent:e.riskScore<50?"positive":e.riskScore<70?"warning":"negative",sub:l.riskLabel(e.riskScore)},{label:"Active Miners",value:"$38,000",accent:"accent",mono:!0,sub:"7 positions"},{label:"Scalping",value:l.usd(e.capitalScalp),accent:"neutral",mono:!0,sub:"futures mode"},{label:"BTC Core",value:l.usd(e.capitalBtcCore),accent:"neutral",mono:!0,sub:"0.418 BTC"},{label:"BTC Ladder",value:l.usd(e.capitalLadder),accent:"neutral",mono:!0,sub:"3/12 filled"}];return s`
      <div class="kpi-grid">
        ${t.map(a=>s`
          <stat-card
            label=${a.label}
            value=${a.value}
            accent=${a.accent}
            .sub=${a.sub||""}
            ?mono=${a.mono||!1}
          ></stat-card>
        `)}
      </div>
    `}_renderAllocationAndLiquidity(){const e=this._data;return s`
      <div class="row-2col">
        <!-- Capital Allocation -->
        <div class="panel">
          <div class="panel-title">
            <span class="panel-title-label">Capital Allocation</span>
            <span style="font-size:var(--text-xs);color:var(--color-text-muted)">Total: ${l.usd(e.totalCapital)}</span>
          </div>
          <allocation-chart .items=${e.capitalAllocation}></allocation-chart>
        </div>

        <!-- Liquidity vs Exposure -->
        <div class="panel">
          <div class="panel-title">Liquidity vs Exposure</div>
          <div class="liquidity-bar-wrap">
            <div class="liq-header">
              <span>Deployed: ${l.usd(e.liquidity.exposure)} (${e.liquidity.exposurePct.toFixed(1)}%)</span>
              <span>Free: ${l.usd(e.liquidity.free)}</span>
            </div>
            <div class="liq-track">
              <div class="liq-fill" style="width:${e.liquidity.exposurePct}%"></div>
              <div class="liq-free"></div>
            </div>
            <div class="liq-legend">
              <div class="liq-legend-item">
                <div class="liq-dot" style="background:var(--color-accent)"></div>
                <span style="font-size:var(--text-xs);color:var(--color-text-muted)">Deployed capital</span>
              </div>
              <div class="liq-legend-item">
                <div class="liq-dot" style="background:var(--color-positive-dim)"></div>
                <span style="font-size:var(--text-xs);color:var(--color-text-muted)">Available liquidity</span>
              </div>
            </div>
          </div>

          <!-- Monthly goal progress -->
          <div style="margin-top:var(--space-5);padding-top:var(--space-4);border-top:1px solid var(--color-border-subtle)">
            <div class="panel-title" style="margin-bottom:var(--space-3)">Monthly Goal Progress</div>
            <div class="goal-header">
              <span class="goal-amount">${l.usd(e.monthlyPnl)}</span>
              <span class="goal-target">Target: ${l.usd(e.monthlyGoal)}</span>
            </div>
            <progress-bar
              value=${e.monthlyGoalProgress}
              color="var(--color-positive)"
              height="8"
              showPct
              sublabel="On track — ${(100-e.monthlyGoalProgress).toFixed(1)}% remaining this month"
            ></progress-bar>
          </div>
        </div>
      </div>
    `}_renderAlerts(){const e=this._data.alerts,t={danger:"⚠",warning:"!",info:"ℹ"};return s`
      <div class="panel">
        <div class="panel-title">
          <span class="panel-title-label">
            Priority Alerts
            <span style="font-size:var(--text-xs);background:var(--color-negative-dim);color:var(--color-negative);padding:1px 6px;border-radius:var(--radius-sm);font-weight:600">${e.filter(a=>a.level==="danger").length}</span>
          </span>
        </div>
        ${e.map(a=>s`
          <div class="alert-item alert-${a.level}">
            <span class="alert-icon">${t[a.level]}</span>
            <span class="alert-text">${a.message}</span>
            <span class="alert-time">${a.time}</span>
          </div>
        `)}
      </div>
    `}_renderAdvisorContent(){const e=this._data.advisor;switch(this._advisorTab){case"summary":return s`<p class="advisor-summary">${e.executiveSummary}</p>`;case"recommendations":return s`${e.recommendations.map(t=>s`
          <div class="rec-card">
            <div class="rec-priority">${t.priority}</div>
            <div class="rec-body">
              <div class="rec-category">${t.category}</div>
              <div class="rec-action">${t.action}</div>
              <div class="rec-rationale">${t.rationale}</div>
              <div class="rec-impact">↑ ${t.impact} · Risk: ${t.risk}</div>
            </div>
          </div>
        `)}`;case"risk":return s`${e.riskSuggestions.map(t=>s`
          <div class="risk-sug"><span>⚠</span>${t}</div>
        `)}`;case"tips":return s`${e.educationalTips.map(t=>s`
          <div class="tip-card">
            <div class="tip-title">${t.title}</div>
            <div class="tip-body">${t.body}</div>
          </div>
        `)}`;case"warnings":return s`${e.warnings.map(t=>s`
          <div class="warning-item-advisor ${t.level}"><span>⚠</span>${t.text}</div>
        `)}`;case"whatif":return s`
          <div class="whatif-placeholder">
            <div class="whatif-icon">⟁</div>
            <div class="whatif-label">What-If Simulation Engine</div>
            <div class="whatif-sub">AI-powered scenario modeling — coming in a future release.<br>
            Will support: capital reallocation scenarios, drawdown simulations, strategy stress tests.</div>
          </div>
        `;default:return""}}_renderAdvisor(){const e=this._data.advisor,t=[{id:"summary",label:"Executive Summary"},{id:"recommendations",label:"Recommendations"},{id:"risk",label:"Risk Suggestions"},{id:"tips",label:"Educational Tips"},{id:"warnings",label:`Warnings (${e.warnings.length})`},{id:"whatif",label:"What-If (Soon)"}];return s`
      <div class="advisor-panel">
        <div class="advisor-header">
          <div class="advisor-title">
            <span>Portfolio Advisor</span>
            <span class="advisor-chip">AI Copilot</span>
          </div>
          <span class="advisor-timestamp">Updated ${Math.round((Date.now()-e.generatedAt)/6e4)}m ago · Mock data</span>
        </div>
        <div class="advisor-tabs">
          ${t.map(a=>s`
            <div
              class="advisor-tab ${this._advisorTab===a.id?"active":""}"
              @click=${()=>this._advisorTab=a.id}
            >${a.label}</div>
          `)}
        </div>
        <div class="advisor-content">
          ${this._renderAdvisorContent()}
        </div>
      </div>
    `}_renderRecommendedActions(){const e=this._data.recommendedActions;return s`
      <div class="panel">
        <div class="panel-title">Recommended Next Actions</div>
        ${e.map(t=>s`
          <div class="action-item" @click=${()=>A.navigate(t.route)}>
            <div class="action-left">
              <div class="urgency-dot urgency-${t.urgency}"></div>
              <span class="action-label">${t.label}</span>
            </div>
            <span class="action-arrow">→</span>
          </div>
        `)}
      </div>
    `}render(){return s`
      <div class="page">
        ${this._renderKpiGrid()}
        ${this._renderAllocationAndLiquidity()}
        <div class="row-2col">
          ${this._renderAlerts()}
          ${this._renderRecommendedActions()}
        </div>
        ${this._renderAdvisor()}
      </div>
    `}}customElements.define("overview-view",na);const la={buckets:[{label:"Active Miners",value:38e3,pct:43.5,productive:!0,risk:"medium"},{label:"BTC Core",value:15600,pct:17.8,productive:!0,risk:"low"},{label:"BTC Ladder",value:13050,pct:14.9,productive:!0,risk:"low"},{label:"Scalping",value:8500,pct:9.7,productive:!0,risk:"high"},{label:"Free USDT",value:12300,pct:14.1,productive:!1,risk:"none"}],byTicker:[{ticker:"BTCUSDT",value:27600,pct:31.6},{ticker:"ETHUSDT",value:15600,pct:17.8},{ticker:"SOLUSDT",value:14e3,pct:16},{ticker:"XRPUSDT",value:4500,pct:5.1},{ticker:"AVAXUSDT",value:3500,pct:4},{ticker:"Other",value:22250,pct:25.5}],byRisk:[{label:"Low Risk",value:28650,pct:32.8},{label:"Medium Risk",value:46e3,pct:52.6},{label:"High Risk",value:8500,pct:9.7},{label:"No Risk",value:4300,pct:4.9}],history:Array.from({length:30},(i,e)=>({date:new Date(Date.now()-(29-e)*864e5).toLocaleDateString("en-US",{month:"short",day:"numeric"}),total:72e3+e*520+Math.random()*1e3,pnl:-800+e*220+Math.random()*400}))},Be=["#5b8def","#f5a623","#22d3a0","#a855f7","#2a2d3e"];class da extends h{static properties={_data:{type:Object,state:!0},_range:{type:String,state:!0}};static styles=[T,m`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }

    /* ---- KPI strip ---- */
    .kpi-strip { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--space-3); }

    /* ---- Main layout ---- */
    .main-row { display: grid; grid-template-columns: 1fr 340px; gap: var(--space-4); }
    @media (max-width: 1100px) { .main-row { grid-template-columns: 1fr; } }

    .bottom-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
    @media (max-width: 900px) { .bottom-row { grid-template-columns: 1fr; } }

    /* ---- Panel ---- */
    .panel {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
    }
    .panel-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: var(--space-4);
    }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .panel-sub   { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }

    /* ---- Area chart ---- */
    .chart-wrap { position: relative; height: 130px; }
    .chart-wrap svg { position: absolute; inset: 0; width: 100%; height: 100%; }

    /* ---- Range tabs ---- */
    .range-tabs { display: flex; gap: 2px; background: var(--color-bg-elevated); border-radius: 6px; padding: 3px; }
    .range-tab {
      padding: 3px 10px; border-radius: 4px; font-size: 10.5px; font-weight: 500;
      cursor: pointer; color: var(--color-text-muted); letter-spacing: 0.04em;
      transition: all 120ms ease;
    }
    .range-tab.active { background: var(--color-bg-hover); color: var(--color-text-primary); }

    /* ---- Donut chart ---- */
    .donut-section { display: flex; align-items: center; gap: var(--space-5); }
    .donut-wrap { flex-shrink: 0; }
    .donut-legend { flex: 1; display: flex; flex-direction: column; gap: var(--space-2); }
    .legend-row { display: flex; align-items: center; gap: var(--space-2); }
    .legend-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
    .legend-label { flex: 1; font-size: var(--text-xs); color: var(--color-text-secondary); }
    .legend-pct { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); min-width: 36px; text-align: right; }
    .legend-val { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-medium); min-width: 72px; text-align: right; }

    /* ---- Ranked list (right column, like "Top Skills") ---- */
    .ranked-list { display: flex; flex-direction: column; gap: 0; }
    .ranked-row {
      display: flex; align-items: center; gap: var(--space-3);
      padding: var(--space-2) 0;
      border-bottom: 1px solid var(--color-border-subtle);
    }
    .ranked-row:last-child { border-bottom: none; }
    .rank-num {
      font-size: var(--text-xs); color: var(--color-text-disabled);
      font-family: var(--font-mono); min-width: 14px; text-align: center;
    }
    .rank-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .rank-label { flex: 1; font-size: var(--text-sm); font-family: var(--font-mono); font-weight: var(--weight-medium); }
    .rank-bar-wrap { flex: 1; max-width: 100px; }
    .rank-bar-bg { height: 3px; background: var(--color-bg-elevated); border-radius: 2px; overflow: hidden; }
    .rank-bar-fill { height: 100%; border-radius: 2px; transition: width 500ms ease; }
    .rank-pct { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); min-width: 36px; text-align: right; }
    .rank-val { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-medium); min-width: 76px; text-align: right; }

    /* ---- Productive/Idle split ---- */
    .split-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-4); }
    .split-card { padding: var(--space-3); border-radius: var(--radius-md); text-align: center; }
    .split-card.prod { background: var(--color-positive-dim); border: 1px solid rgba(34,211,160,0.15); }
    .split-card.idle { background: var(--color-idle-dim);     border: 1px solid rgba(90,95,117,0.15); }
    .split-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: var(--space-1); }
    .split-val   { font-family: var(--font-mono); font-size: var(--text-xl); font-weight: var(--weight-semibold); }
    .split-card.prod .split-val { color: var(--color-positive); }
    .split-card.idle .split-val { color: var(--color-idle); }
    .split-sub   { font-size: 10px; color: var(--color-text-muted); margin-top: 2px; }

    /* ---- Risk table ---- */
    .risk-row { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border-subtle); }
    .risk-row:last-child { border-bottom: none; }
    .risk-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .risk-label { flex: 1; font-size: var(--text-sm); }
    .risk-bar-wrap { width: 80px; }
    .risk-pct { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); min-width: 36px; text-align: right; }
    .risk-val { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-medium); min-width: 72px; text-align: right; }
  `];constructor(){super(),this._data=la,this._range="30d"}_renderAreaChart(){const e=this._data.history,t=600,a=130,r={top:16,right:12,bottom:22,left:4},o=t-r.left-r.right,n=a-r.top-r.bottom,p=e.map(y=>y.total),c=Math.min(...p),g=Math.max(...p),u=g-c||1,v=e.map((y,S)=>({x:r.left+S/(e.length-1)*o,y:r.top+n-(y.total-c)/u*n,h:y})),b=v.map((y,S)=>{if(S===0)return`M ${y.x.toFixed(1)} ${y.y.toFixed(1)}`;const L=v[S-1],ee=((L.x+y.x)/2).toFixed(1);return`C ${ee} ${L.y.toFixed(1)}, ${ee} ${y.y.toFixed(1)}, ${y.x.toFixed(1)} ${y.y.toFixed(1)}`}).join(" "),f=`${b} L ${v[v.length-1].x.toFixed(1)} ${a-r.bottom} L ${v[0].x.toFixed(1)} ${a-r.bottom} Z`,x=[c,c+u*.5,g],k=[0,Math.floor(e.length/4),Math.floor(e.length/2),Math.floor(e.length*3/4),e.length-1];return s`
      <svg viewBox="0 0 ${t} ${a}" preserveAspectRatio="none" style="overflow:visible">
        <defs>
          <linearGradient id="cap-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#22d3a0" stop-opacity="0.28"/>
            <stop offset="60%"  stop-color="#22d3a0" stop-opacity="0.06"/>
            <stop offset="100%" stop-color="#22d3a0" stop-opacity="0"/>
          </linearGradient>
          <filter id="cap-glow" x="-5%" y="-40%" width="110%" height="180%">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- Horizontal grid lines -->
        ${x.map((y,S)=>{const L=(r.top+n-(y-c)/u*n).toFixed(1);return j`
            <line x1="${r.left}" y1="${L}" x2="${t-r.right}" y2="${L}"
                  stroke="#1f2130" stroke-width="1" stroke-dasharray="${S===0?"none":"3 4"}"/>
            <text x="${t-r.right+5}" y="${(parseFloat(L)+3.5).toFixed(1)}"
                  fill="#42475e" font-size="8.5" font-family="JetBrains Mono,monospace" text-anchor="start">
              $${(y/1e3).toFixed(0)}k
            </text>
          `})}

        <!-- Area fill -->
        ${j`<path d="${f}" fill="url(#cap-area-grad)"/>`}

        <!-- Main line -->
        ${j`<path d="${b}" fill="none" stroke="#22d3a0" stroke-width="1.8"
              filter="url(#cap-glow)" stroke-linejoin="round" stroke-linecap="round"/>`}

        <!-- End dot -->
        ${j`<circle cx="${v[v.length-1].x.toFixed(1)}" cy="${v[v.length-1].y.toFixed(1)}"
                r="3" fill="#22d3a0" filter="url(#cap-glow)"/>`}

        <!-- Date labels -->
        ${k.map((y,S)=>j`
          <text x="${v[y].x.toFixed(1)}" y="${a}"
                fill="#42475e" font-size="8.5" font-family="Inter,sans-serif"
                text-anchor="${S===0?"start":S===k.length-1?"end":"middle"}">
            ${e[y].date}
          </text>
        `)}
      </svg>
    `}_renderDonut(){const e=this._data.buckets,t=e.reduce((x,k)=>x+k.value,0),a=e.filter(x=>x.productive).reduce((x,k)=>x+k.value,0),r=(a/t*100).toFixed(1),o=80,n=80,p=62,c=14,g=.04,u=(x,k)=>{const y=x+g/2,S=k-g/2;if(S-y<.01)return null;const L=o+p*Math.sin(y),ee=n-p*Math.cos(y),at=o+p*Math.sin(S),it=n-p*Math.cos(S),rt=S-y>Math.PI?1:0;return`M ${L.toFixed(3)} ${ee.toFixed(3)} A ${p} ${p} 0 ${rt} 1 ${at.toFixed(3)} ${it.toFixed(3)}`},v=2*Math.PI;let b=0;const f=e.map((x,k)=>{const y=x.value/t*v,S={b:x,startAngle:b,endAngle:b+y,color:Be[k]};return b+=y,S});return s`
      <div class="donut-section">
        <div class="donut-wrap">
          <svg viewBox="0 0 160 160" width="160" height="160">
            <!-- Track -->
            <circle cx="${o}" cy="${n}" r="${p}" fill="none"
                    stroke="#141620" stroke-width="${c}"/>
            <!-- Colored arc segments -->
            ${f.map(x=>{const k=u(x.startAngle,x.endAngle);return k?j`<path d="${k}" fill="none" stroke="${x.color}" stroke-width="${c}" stroke-linecap="round"/>`:""})}
            <!-- Center labels -->
            <text x="${o}" y="${n-8}" text-anchor="middle"
                  fill="#e8eaf2" font-family="JetBrains Mono, monospace"
                  font-size="15" font-weight="700">${r}%</text>
            <text x="${o}" y="${n+7}" text-anchor="middle"
                  fill="#565a6e" font-family="Inter, sans-serif"
                  font-size="9" letter-spacing="0.1em">PRODUCTIVE</text>
            <text x="${o}" y="${n+20}" text-anchor="middle"
                  fill="#9195a8" font-family="JetBrains Mono, monospace" font-size="9">
              ${l.usd(a,0)}
            </text>
          </svg>
        </div>
        <div class="donut-legend">
          ${e.map((x,k)=>s`
            <div class="legend-row">
              <div class="legend-dot" style="background:${Be[k]}"></div>
              <span class="legend-label">${x.label}</span>
              <span class="legend-pct">${x.pct.toFixed(1)}%</span>
              <span class="legend-val">${l.usd(x.value)}</span>
            </div>
          `)}
        </div>
      </div>
    `}_renderTickerRanked(){const e=this._data.byTicker,t=Math.max(...e.map(a=>a.pct));return s`
      <div class="ranked-list">
        ${e.map((a,r)=>s`
          <div class="ranked-row">
            <span class="rank-num">${r+1}</span>
            <div class="rank-dot" style="background:${r===0?"#f5a623":r===1?"#5b8def":"#22d3a0"}"></div>
            <span class="rank-label">${a.ticker}</span>
            <div class="rank-bar-wrap">
              <div class="rank-bar-bg">
                <div class="rank-bar-fill" style="width:${(a.pct/t*100).toFixed(1)}%;background:${r===0?"#f5a623":"#5b8def"}"></div>
              </div>
            </div>
            <span class="rank-pct">${a.pct.toFixed(1)}%</span>
            <span class="rank-val">${l.usd(a.value)}</span>
          </div>
        `)}
      </div>
    `}_renderRisk(){const e={"Low Risk":"#22d3a0","Medium Risk":"#f5a623","High Risk":"#f04a5e","No Risk":"#5a5f75"},t=Math.max(...this._data.byRisk.map(a=>a.value));return s`
      ${this._data.byRisk.map(a=>s`
        <div class="risk-row">
          <div class="risk-dot" style="background:${e[a.label]||"#5a5f75"}"></div>
          <span class="risk-label">${a.label}</span>
          <div class="risk-bar-wrap">
            <div class="rank-bar-bg">
              <div class="rank-bar-fill" style="width:${(a.value/t*100).toFixed(1)}%;background:${e[a.label]||"#5a5f75"}"></div>
            </div>
          </div>
          <span class="risk-pct">${a.pct.toFixed(1)}%</span>
          <span class="risk-val">${l.usd(a.value)}</span>
        </div>
      `)}
    `}render(){const e=this._data,t=e.buckets.reduce((o,n)=>o+n.value,0),a=e.buckets.filter(o=>o.productive).reduce((o,n)=>o+n.value,0),r=t-a;return s`
      <div class="page">

        <!-- KPI strip -->
        <div class="kpi-strip">
          <stat-card label="Total Capital" value="${l.usd(t)}" accent="neutral" mono></stat-card>
          <stat-card label="Productive"    value="${l.usd(a)}"   accent="positive" mono></stat-card>
          <stat-card label="Idle / Free"   value="${l.usd(r)}"          accent="warning" mono></stat-card>
          <stat-card label="Strategies"    value="4"                         accent="accent"></stat-card>
          <stat-card label="Avg Risk"      value="Medium"                    accent="warning"></stat-card>
        </div>

        <!-- Area chart + Ticker ranked list -->
        <div class="main-row">
          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">Capital Over Time</div>
                <div class="panel-sub">30-day portfolio value</div>
              </div>
              <div class="range-tabs">
                ${["7d","14d","30d"].map(o=>s`
                  <div class="range-tab ${this._range===o?"active":""}" @click=${()=>this._range=o}>${o}</div>
                `)}
              </div>
            </div>
            <div class="chart-wrap">${this._renderAreaChart()}</div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">By Ticker</div>
                <div class="panel-sub">Capital allocation</div>
              </div>
            </div>
            ${this._renderTickerRanked()}
          </div>
        </div>

        <!-- Donut + Risk -->
        <div class="bottom-row">
          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">Strategy Allocation</div>
                <div class="panel-sub">Productive vs idle capital</div>
              </div>
            </div>
            <div class="split-row">
              <div class="split-card prod">
                <div class="split-label">Productive</div>
                <div class="split-val">${l.usd(a,0)}</div>
                <div class="split-sub">${(a/t*100).toFixed(1)}% of total</div>
              </div>
              <div class="split-card idle">
                <div class="split-label">Idle / Free</div>
                <div class="split-val">${l.usd(r,0)}</div>
                <div class="split-sub">${(r/t*100).toFixed(1)}% of total</div>
              </div>
            </div>
            ${this._renderDonut()}
          </div>

          <div class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-title">By Risk Level</div>
                <div class="panel-sub">Capital at risk exposure</div>
              </div>
            </div>
            ${this._renderRisk()}
          </div>
        </div>

      </div>
    `}}customElements.define("capital-view",da);const de="capintel_domain_",E={save(i,e){P.save(`${de}${i}`,e)},load(i){const e=P.load(`${de}${i}`);if(!e)return{};const{_savedAt:t,...a}=e;return a},clear(i){P.remove(`${de}${i}`)}};function w(i,e=0){const t=Number(i);return Number.isFinite(t)?t:e}function V(...i){for(const e of i)if(e!=null&&String(e).trim())return String(e);return""}function ca(i){const e=String(i.rangeHealth||"").toLowerCase(),t=w(i.inventoryRatio);return e.includes("break")||t>=.65?"danger":e.includes("warn")||t>=.4?"warning":"ok"}function pa(i){const e=w(i.quoteInvestment),t=w(i.gridProfit),a=w(i.totalProfit,t),r=w(i.closeProfit,a),o=w(i.trendPnl),n=ca(i),p=V(i.symbol,i.baseSymbol,i.market),c=p.replace(/_PERP$/i,"").replace(/_USDT$/i,"").replace(/_/g,""),g=w(i.rangePosition,.5),u=Math.max(0,g-.2),v=Math.min(1,g+.2),b=Math.min(1,Math.max(0,g)),f=Math.max(1,w(i.referencePrice,w(i.currentPrice,0)));return{buOrderId:V(i.buOrderId),symbol:p,ticker:c,status:V(i.status,"unknown"),type:V(i.minerType,"grid_worker").replaceAll("_"," "),leverage:w(i.leverage,1),capital:e,openPnl:r,dailyPnl:t,totalProfit:a,gridProfit:t,closeProfit:r,trendPnl:o,fillRate:Math.round(Math.max(0,Math.min(100,w(i.executionEfficiencyReal,.5)*100))),gridGap:Math.max(.5,w(i.perVolume,0)*1e3),levels:Math.max(1,Math.round(w(i.expectedGridLevels,12))),currentPrice:f*b,gridLow:Math.max(1,f*u),gridHigh:Math.max(f*u+1,f*v),rangePosition:b,rangeHealth:V(i.rangeHealth,"unknown"),inventoryRatio:w(i.inventoryRatio),targetDailyUsdt:w(i.targetDailyUsdt,1),warning:n==="danger"?"Range or inventory risk is elevated. Review close PnL and regrid evidence.":n==="warning"?"This miner needs a closer look before scaling.":"",risk:n,inventoryGate:i.inventoryGate||null,promoHealth:i.promoHealth||null,harvestPolicy:i.harvestPolicy||null,raw:i}}function va(i){const e=i.reduce((n,p)=>n+w(p.capital),0),t=i.reduce((n,p)=>n+w(p.openPnl),0),a=i.reduce((n,p)=>n+w(p.dailyPnl),0),r=i.filter(n=>n.risk!=="ok").length,o=i.length?i.reduce((n,p)=>n+w(p.gridGap),0)/i.length:0;return{active:i.length,totalCapital:e,openPnl:t,dailyPnl:a,warnings:r,avgGridGap:o.toFixed(2)}}const R={async getMiners({targetDailyUsdt:i=1}={}){const e=await _(`/dashboard/miners?targetDailyUsdt=${encodeURIComponent(i)}`),t=Array.isArray(e?.miners)?e.miners.map(pa):[];return{ok:!!e?.ok,source:e?.source||"api",miners:t,summary:va(t),count:t.length}},async getBalance(){return _("/dashboard/miners/account-balance")},async getHistory({symbol:i,limit:e=24}={}){const t=new URLSearchParams({limit:String(e)});return i&&t.set("symbol",i),_(`/dashboard/miners/history?${t.toString()}`)},async getEvents({symbol:i,limit:e=24}={}){const t=new URLSearchParams({limit:String(e)});return i&&t.set("symbol",i),_(`/dashboard/miners/events?${t.toString()}`)},async previewClose(i){return _("/dashboard/miners/close-preview",{method:"POST",body:JSON.stringify({buOrderId:i.buOrderId,symbol:i.symbol})})},async executeClose({confirmationToken:i,closeReason:e}){return _("/dashboard/miners/close",{method:"POST",body:JSON.stringify({confirmationToken:i,closeReason:e,...D()})})},async checkStabilization(i,{mode:e="auto",targetDailyUsdt:t=1}={}){return _("/dashboard/miners/stabilization-check",{method:"POST",body:JSON.stringify({buOrderId:i.buOrderId,mode:e,targetDailyUsdt:t,...D()})})},async previewRegrid(i,{mode:e="auto",targetDailyUsdt:t=1}={}){return _("/dashboard/miners/regrid-preview",{method:"POST",body:JSON.stringify({buOrderId:i.buOrderId,mode:e,targetDailyUsdt:t,...D()})})},async executeRegrid({confirmationToken:i,reason:e}){return _("/dashboard/miners/regrid",{method:"POST",body:JSON.stringify({confirmationToken:i,reason:e,...D()})})}},je="miners";class ua extends h{static properties={_data:{type:Object,state:!0},_balance:{type:Object,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_filter:{type:String,state:!0},_expandedId:{type:String,state:!0},_details:{type:Object,state:!0},_closeCtx:{type:Object,state:!0},_regridCtx:{type:Object,state:!0}};static styles=[T,m`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .toolbar { display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center; }
    .hero { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-4); }
    .kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--space-3); }
    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }
    .miners-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: var(--space-4); }
    .miner-card { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); overflow: hidden; }
    .miner-card.warning { border-left: 3px solid var(--color-warning); }
    .miner-card.danger { border-left: 3px solid var(--color-negative); }
    .miner-head { padding: var(--card-padding); cursor: pointer; display: flex; flex-direction: column; gap: var(--space-3); }
    .miner-head:hover { background: rgba(255,255,255,0.02); }
    .topline { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3); }
    .ticker { font-size: var(--text-lg); font-weight: var(--weight-bold); }
    .meta { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 3px; }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 9px; border-radius: 999px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
    .badge.ok { background: var(--color-positive-dim); color: var(--color-positive); }
    .badge.warning { background: var(--color-warning-dim); color: var(--color-warning); }
    .badge.danger { background: var(--color-negative-dim); color: var(--color-negative); }
    .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); }
    .metric { display: flex; flex-direction: column; gap: 2px; }
    .metric-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    .metric-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .metric-value.pos { color: var(--color-positive); }
    .metric-value.neg { color: var(--color-negative); }
    .warning-banner { padding: 8px 10px; border-radius: var(--radius-md); background: var(--color-warning-dim); color: var(--color-warning); font-size: var(--text-xs); }
    .actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
    .actions .btn { flex: 1; min-width: 0; }
    .expanded { border-top: 1px solid var(--color-border-subtle); padding: var(--card-padding); display: flex; flex-direction: column; gap: var(--space-4); }
    .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-2); }
    .detail { padding: 10px; border-radius: var(--radius-md); background: var(--color-bg-elevated); }
    .detail-title { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 4px; }
    .detail-value { font-family: var(--font-mono); font-size: var(--text-sm); }
    .section { display: flex; flex-direction: column; gap: var(--space-2); }
    .section-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .mini-list { display: flex; flex-direction: column; gap: 8px; }
    .mini-item { padding: 10px; border-radius: var(--radius-md); background: var(--color-bg-elevated); font-size: var(--text-xs); color: var(--color-text-secondary); }
    .mini-item strong { color: var(--color-text-primary); }
    .chart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.86); display: flex; align-items: center; justify-content: center; z-index: 210; padding: 16px; }
    .chart-modal { display: flex; width: 96vw; max-width: 1420px; height: 88vh; background: var(--color-bg-panel); border: 1px solid var(--color-border-default); border-radius: var(--radius-xl); overflow: hidden; }
    .chart-left { flex: 1; display: flex; flex-direction: column; border-right: 1px solid var(--color-border-subtle); }
    .chart-right { width: 380px; display: flex; flex-direction: column; }
    .chart-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--color-border-subtle); background: var(--color-bg-card); }
    .tv-frame { flex: 1; border: none; width: 100%; }
    .exec-body { padding: 18px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
    .exec-row { display: flex; justify-content: space-between; gap: 12px; font-size: var(--text-sm); padding-bottom: 8px; border-bottom: 1px solid var(--color-border-subtle); }
    .exec-row span:last-child { font-family: var(--font-mono); text-align: right; }
    .exec-actions { margin-top: auto; display: flex; gap: 8px; padding: 14px 18px; border-top: 1px solid var(--color-border-subtle); }
    .exec-actions .btn { flex: 1; }
    .hint { font-size: var(--text-xs); color: var(--color-text-muted); }
    @media (max-width: 900px) {
      .hero { grid-template-columns: 1fr; }
      .metrics { grid-template-columns: repeat(2, 1fr); }
      .detail-grid { grid-template-columns: 1fr; }
      .chart-modal { flex-direction: column; height: 94dvh; }
      .chart-left { min-height: 280px; border-right: 0; border-bottom: 1px solid var(--color-border-subtle); }
      .chart-right { width: 100%; }
    }
  `];constructor(){super(),this._data={miners:[],summary:{active:0,totalCapital:0,openPnl:0,dailyPnl:0,warnings:0,avgGridGap:"0.00"}},this._balance=null,this._loading=!0,this._error="",this._filter=E.load(je).filter||"all",this._expandedId="",this._details={},this._closeCtx=null,this._regridCtx=null}connectedCallback(){super.connectedCallback(),this._load()}async _load(){this._loading=!0,this._error="";try{const[e,t]=await Promise.all([R.getMiners(),R.getBalance().catch(()=>null)]);this._data=e,this._balance=t}catch(e){this._error=e?.data?.detail||e?.message||"Could not load active miners."}finally{this._loading=!1}}_setFilter(e){this._filter=e,E.save(je,{filter:e})}_filteredMiners(){const e=Array.isArray(this._data?.miners)?this._data.miners:[];return this._filter==="warnings"?e.filter(t=>t.risk!=="ok"):this._filter==="danger"?e.filter(t=>t.risk==="danger"):e}async _toggleExpanded(e){if(this._expandedId===e.buOrderId){this._expandedId="";return}if(this._expandedId=e.buOrderId,!this._details[e.buOrderId]){this._details={...this._details,[e.buOrderId]:{loading:!0,history:[],events:[]}};try{const[t,a]=await Promise.all([R.getHistory({symbol:e.symbol,limit:12}),R.getEvents({symbol:e.symbol,limit:12})]);this._details={...this._details,[e.buOrderId]:{loading:!1,history:Array.isArray(t?.snapshots)?t.snapshots:[],events:Array.isArray(a?.events)?a.events:[]}}}catch(t){this._details={...this._details,[e.buOrderId]:{loading:!1,error:t?.data?.detail||t?.message||"Could not load miner detail.",history:[],events:[]}}}}}async _openClose(e){try{const t=await R.previewClose(e);this._closeCtx={miner:e,preview:t}}catch(t){window.toast?.(t?.data?.detail||t?.message||"Could not prepare close preview.",{type:"error"})}}async _executeClose(){const e=this._closeCtx?.miner,t=this._closeCtx?.preview?.confirmationToken,a=await R.executeClose({confirmationToken:t,closeReason:`Risk-control close requested from new dashboard for ${e?.symbol||"miner"}`});return await this._load(),{success:!!a?.ok,message:a?.ok?`${e?.ticker} closed on Pionex.`:"Close failed."}}async _checkStabilization(e){try{const t=await R.checkStabilization(e),a=this._details[e.buOrderId]||{};this._details={...this._details,[e.buOrderId]:{...a,stabilization:t}},window.toast?.(t?.decisionReason||"Stabilization check completed.",{type:"info"}),this._expandedId!==e.buOrderId&&await this._toggleExpanded(e)}catch(t){window.toast?.(t?.data?.detail||t?.message||"Stabilization check failed.",{type:"error"})}}async _openRegrid(e){this._regridCtx={miner:e,loading:!0,preview:null,result:null};try{const t=await R.previewRegrid(e);this._regridCtx={miner:e,loading:!1,preview:t,result:null}}catch(t){this._regridCtx={miner:e,loading:!1,preview:null,error:t?.data?.detail||t?.message||"Could not build regrid preview."}}}async _executeRegrid(){const e=this._regridCtx?.miner,t=this._regridCtx?.preview?.confirmationToken,a=await R.executeRegrid({confirmationToken:t,reason:`Range migration executed from new dashboard for ${e?.symbol||"miner"}`});return this._regridCtx={...this._regridCtx,result:a},await this._load(),a}_renderBalancePanel(){const e=this._balance;return e?.ok?s`
      <div class="panel">
        <div class="panel-title">Account Balance</div>
        <div class="detail-grid">
          <div class="detail"><div class="detail-title">USDT Free</div><div class="detail-value">${l.usd(Number(e?.usdt?.free||0),2)}</div></div>
          <div class="detail"><div class="detail-title">USDT Total</div><div class="detail-value">${l.usd(Number(e?.usdt?.total||0),2)}</div></div>
          <div class="detail"><div class="detail-title">Estimated Total</div><div class="detail-value">${l.usd(Number(e?.estimatedTotalUsd||0),2)}</div></div>
          <div class="detail"><div class="detail-title">Assets</div><div class="detail-value">${Number(e?.assetsCount||0)}</div></div>
        </div>
      </div>
    `:s`<div class="panel"><div class="panel-title">Account Balance</div><div class="hint">Balance not available right now.</div></div>`}_renderExpanded(e){const t=this._details[e.buOrderId]||{},a=t.stabilization;return s`
      <div class="expanded">
        <div class="detail-grid">
          <div class="detail"><div class="detail-title">BU Order</div><div class="detail-value">${e.buOrderId}</div></div>
          <div class="detail"><div class="detail-title">Range Health</div><div class="detail-value">${e.rangeHealth||"—"}</div></div>
          <div class="detail"><div class="detail-title">Inventory Ratio</div><div class="detail-value">${l.pctPlain(Number(e.inventoryRatio||0)*100,1)}</div></div>
          <div class="detail"><div class="detail-title">Target Daily</div><div class="detail-value">${l.usd(Number(e.targetDailyUsdt||0),2)}</div></div>
          <div class="detail"><div class="detail-title">Trend PnL</div><div class="detail-value">${l.pnl(Number(e.trendPnl||0),2)}</div></div>
          <div class="detail"><div class="detail-title">Grid Profit</div><div class="detail-value">${l.pnl(Number(e.gridProfit||0),2)}</div></div>
        </div>

        ${e.inventoryGate?s`
          <div class="section">
            <div class="section-title">Inventory Gate</div>
            <div class="mini-item"><strong>${e.inventoryGate.label||"Gate"}</strong><br />${e.inventoryGate.detail||"No extra detail."}</div>
          </div>
        `:""}

        ${e.harvestPolicy?s`
          <div class="section">
            <div class="section-title">Harvest Policy</div>
            <div class="mini-item"><strong>${e.harvestPolicy.action||"Policy"}</strong><br />${e.harvestPolicy.detail||"No extra detail."}</div>
          </div>
        `:""}

        ${a?s`
          <div class="section">
            <div class="section-title">Latest Stabilization Check</div>
            <div class="mini-item">
              <strong>${a.regridSuggestion||"NO_ACTION"}</strong><br />
              ${a.decisionReason||"No reason returned."}
            </div>
          </div>
        `:""}

        <div class="section">
          <div class="section-title">Recent Events</div>
          ${t.loading?s`<loading-view label="Loading events and history"></loading-view>`:""}
          ${t.error?s`<error-view label="Detail unavailable" .sub=${t.error}></error-view>`:""}
          ${!t.loading&&!t.error?s`
            <div class="mini-list">
              ${(t.events||[]).slice(0,4).map(r=>s`
                <div class="mini-item">
                  <strong>${r.eventType||r.event_type||"event"}</strong><br />
                  ${(r.reason||"No reason").toString()}
                </div>
              `)}
              ${(t.events||[]).length?"":s`<div class="mini-item">No backend events persisted yet for this symbol.</div>`}
            </div>
          `:""}
        </div>

        <div class="section">
          <div class="section-title">Snapshot History</div>
          ${!t.loading&&!t.error?s`
            <div class="mini-list">
              ${(t.history||[]).slice(0,4).map(r=>s`
                <div class="mini-item">
                  <strong>${r.createdAt?new Date(r.createdAt).toLocaleString():"Snapshot"}</strong><br />
                  close ${l.pnl(Number(r.payload?.closeProfit||r.closeProfit||0),2)} · grid ${l.pnl(Number(r.payload?.gridProfit||r.gridProfit||0),2)}
                </div>
              `)}
              ${(t.history||[]).length?"":s`<div class="mini-item">No stored snapshots yet for this symbol.</div>`}
            </div>
          `:""}
        </div>
      </div>
    `}_renderMinerCard(e){const t=this._expandedId===e.buOrderId,a=e.risk==="danger"?"danger":e.risk==="warning"?"warning":"ok";return s`
      <article class="miner-card ${a}">
        <div class="miner-head" @click=${()=>this._toggleExpanded(e)}>
          <div class="topline">
            <div>
              <div class="ticker">${e.ticker}</div>
              <div class="meta">${e.type} · ${l.leverage(e.leverage)} · ${e.status}</div>
            </div>
            <span class="badge ${a}">${a==="ok"?"healthy":a}</span>
          </div>

          ${e.warning?s`<div class="warning-banner">${e.warning}</div>`:""}

          <div class="metrics">
            <div class="metric"><span class="metric-label">Close PnL</span><span class="metric-value ${Number(e.openPnl||0)>=0?"pos":"neg"}">${l.pnl(Number(e.openPnl||0),2)}</span></div>
            <div class="metric"><span class="metric-label">Grid PnL</span><span class="metric-value ${Number(e.dailyPnl||0)>=0?"pos":"neg"}">${l.pnl(Number(e.dailyPnl||0),2)}</span></div>
            <div class="metric"><span class="metric-label">Capital</span><span class="metric-value">${l.usd(Number(e.capital||0),2)}</span></div>
            <div class="metric"><span class="metric-label">Range Position</span><span class="metric-value">${l.pctPlain(Number(e.rangePosition||0)*100,1)}</span></div>
            <div class="metric"><span class="metric-label">Inventory</span><span class="metric-value">${l.pctPlain(Number(e.inventoryRatio||0)*100,1)}</span></div>
            <div class="metric"><span class="metric-label">Target / Day</span><span class="metric-value">${l.usd(Number(e.targetDailyUsdt||0),2)}</span></div>
          </div>

          <div class="actions" @click=${r=>r.stopPropagation()}>
            <button class="btn btn-ghost btn-sm" @click=${()=>this._checkStabilization(e)}>Check Stabilization</button>
            <button class="btn btn-warning btn-sm" @click=${()=>this._openRegrid(e)}>Preview Regrid</button>
            <button class="btn btn-danger btn-sm" @click=${()=>this._openClose(e)}>Close</button>
          </div>
        </div>
        ${t?this._renderExpanded(e):""}
      </article>
    `}_renderRegridModal(){const e=this._regridCtx;if(!e?.miner)return"";const a=`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(`BYBIT:${e.miner.ticker}`)}&interval=240&theme=dark&style=1&locale=en&hide_top_toolbar=0&hide_side_toolbar=0&allow_symbol_change=1&drawings_access=all&save_image=1`,r=e.preview||{};return s`
      <div class="chart-overlay" @click=${o=>{o.target===o.currentTarget&&(this._regridCtx=null)}}>
        <div class="chart-modal">
          <div class="chart-left">
            <div class="chart-header">
              <div>
                <div class="ticker">${e.miner.ticker}</div>
                <div class="hint">4H · TradingView · validate the new range before regridding</div>
              </div>
              <button class="btn btn-ghost btn-sm" @click=${()=>this._regridCtx=null}>Close</button>
            </div>
            <iframe class="tv-frame" src="${a}"></iframe>
          </div>
          <div class="chart-right">
            <div class="exec-body">
              ${e.loading?s`<loading-view label="Building regrid preview"></loading-view>`:""}
              ${e.error?s`<error-view label="Regrid preview unavailable" .sub=${e.error}></error-view>`:""}
              ${!e.loading&&!e.error?s`
                <div class="exec-row"><span>Suggestion</span><span>${r.regridSuggestion||"—"}</span></div>
                <div class="exec-row"><span>Stabilization</span><span>${r.stabilizationState||"—"}</span></div>
                <div class="exec-row"><span>Range Break</span><span>${r.rangeBreakState||"—"}</span></div>
                <div class="exec-row"><span>Bottom</span><span>${r.regridCandidate?.bottom?l.usd(Number(r.regridCandidate.bottom),2):"—"}</span></div>
                <div class="exec-row"><span>Top</span><span>${r.regridCandidate?.top?l.usd(Number(r.regridCandidate.top),2):"—"}</span></div>
                <div class="exec-row"><span>Rows</span><span>${r.regridCandidate?.row||"—"}</span></div>
                <div class="mini-item"><strong>Reason</strong><br />${r.decisionReason||"No reason returned."}</div>
                ${(r.blockers||[]).length?s`
                  <div class="mini-item"><strong>Blockers</strong><br />${r.blockers.join(" · ")}</div>
                `:""}
                ${e.result?.ok?s`<div class="mini-item"><strong>Executed</strong><br />Regrid request sent to Pionex successfully.</div>`:""}
              `:""}
            </div>
            <div class="exec-actions">
              <button class="btn btn-ghost" @click=${()=>this._regridCtx=null}>Cancel</button>
              <button class="btn btn-warning" ?disabled=${!r.confirmationToken||e.loading||e.result?.ok} @click=${()=>this._executeRegrid()}>Apply Regrid</button>
            </div>
          </div>
        </div>
      </div>
    `}render(){if(this._loading)return s`<loading-view label="Loading active miners"></loading-view>`;if(this._error)return s`<error-view label="Active miners unavailable" .sub=${this._error}></error-view>`;const e=this._data?.summary||{},t=this._filteredMiners();return s`
      <div class="page">
        <div class="toolbar">
          <segmented-control
            .options=${[{value:"all",label:`All (${this._data?.miners?.length||0})`},{value:"warnings",label:`Warnings (${e.warnings||0})`},{value:"danger",label:"Critical"}]}
            value=${this._filter}
            @change=${a=>this._setFilter(a.detail)}
          ></segmented-control>
          <button class="btn btn-ghost" @click=${()=>this._load()}>Refresh</button>
        </div>

        <div class="hero">
          <div class="panel">
            <div class="panel-title">Miner KPIs</div>
            <div class="kpi-row">
              <stat-card label="Active Miners" value="${e.active||0}" accent="accent"></stat-card>
              <stat-card label="Capital" value="${l.usd(Number(e.totalCapital||0),2)}" accent="neutral" mono></stat-card>
              <stat-card label="Close PnL" value="${l.pnl(Number(e.openPnl||0),2)}" accent="${Number(e.openPnl||0)>=0?"positive":"negative"}" mono></stat-card>
              <stat-card label="Grid PnL" value="${l.pnl(Number(e.dailyPnl||0),2)}" accent="${Number(e.dailyPnl||0)>=0?"positive":"negative"}" mono></stat-card>
              <stat-card label="Warnings" value="${e.warnings||0}" accent="${e.warnings?"negative":"positive"}"></stat-card>
              <stat-card label="Avg Gap" value="${e.avgGridGap||"0.00"}%" accent="neutral" mono></stat-card>
            </div>
          </div>
          ${this._renderBalancePanel()}
        </div>

        <div class="miners-grid">
          ${t.map(a=>this._renderMinerCard(a))}
          ${t.length?"":s`<empty-view label="No miners match this filter"></empty-view>`}
        </div>
      </div>

      ${this._closeCtx?s`
        <preview-execute-modal
          title="Close Miner"
          subtitle="${this._closeCtx.miner.ticker} · live Pionex close"
          domain="miners"
          .payload=${[{label:"Ticker",value:this._closeCtx.miner.ticker},{label:"BU Order",value:this._closeCtx.miner.buOrderId},{label:"Close PnL",value:l.pnl(Number(this._closeCtx.miner.openPnl||0),2),highlight:Number(this._closeCtx.miner.openPnl||0)<0?"danger":"pos"},{label:"Capital",value:l.usd(Number(this._closeCtx.miner.capital||0),2)}]}
          .warnings=${["This sends a real close instruction to Pionex.","The current close PnL will be realized immediately."]}
          dangerLevel="danger"
          confirmText="Close Position"
          .executeFn=${()=>this._executeClose()}
          @closed=${()=>{this._closeCtx=null}}
          @executed=${()=>{this._closeCtx=null}}
        ></preview-execute-modal>
      `:""}

      ${this._renderRegridModal()}
    `}}customElements.define("miners-view",ua);const ga={candidates:[{id:"op1",ticker:"SOLUSDT",type:"Long Grid",status:"new",score:88,capitalRequired:5e3,leverage:4,estimatedMonthly:420,estimatedAnnual:5040,volatility30d:82,fundingRate:-.008,volume24h:428e7,technicalGate:{trend:"bullish",rsi:52,support:95,resistance:115},notes:"High volatility + positive trend = favorable grid conditions. SOL ecosystem momentum strong.",createdAt:Date.now()-36e5*2},{id:"op2",ticker:"NEARUSDT",type:"Neutral Grid",status:"watching",score:72,capitalRequired:2500,leverage:5,estimatedMonthly:210,estimatedAnnual:2520,volatility30d:68,fundingRate:.003,volume24h:38e7,technicalGate:{trend:"neutral",rsi:48,support:4.2,resistance:6.1},notes:"Consolidating range — neutral grid viable. Monitor for breakout.",createdAt:Date.now()-36e5*8},{id:"op3",ticker:"ARBUSDT",type:"Long Grid",status:"new",score:81,capitalRequired:3e3,leverage:4,estimatedMonthly:280,estimatedAnnual:3360,volatility30d:74,fundingRate:-.005,volume24h:62e7,technicalGate:{trend:"bullish",rsi:56,support:1.05,resistance:1.48},notes:"ARB showing bullish structure with moderate volatility. Favorable grid spread.",createdAt:Date.now()-36e5*1},{id:"op4",ticker:"OPUSDT",type:"Long Grid",status:"rejected",score:41,capitalRequired:2e3,leverage:5,estimatedMonthly:120,estimatedAnnual:1440,volatility30d:38,fundingRate:.012,volume24h:18e7,technicalGate:{trend:"bearish",rsi:38,support:1.8,resistance:2.4},notes:"Low volatility + high positive funding rate = poor grid conditions. Rejected.",createdAt:Date.now()-864e5*2}]},Fe="opportunities";class ha extends h{static properties={_candidates:{type:Array,state:!0},_segment:{type:String,state:!0},_dragSrc:{type:Number,state:!0},_dragOver:{type:Number,state:!0},_chartCandidate:{type:Object,state:!0},_execStep:{type:String,state:!0},_execResult:{type:Object,state:!0}};static styles=[T,m`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-5); }
    .candidates { display: flex; flex-direction: column; gap: var(--space-3); }
    .toolbar { display: flex; gap: var(--space-3); flex-wrap: wrap; }

    /* === Cards === */
    .opp-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
      transition: border-color 0.15s, box-shadow 0.15s, opacity 0.15s, transform 0.15s;
      cursor: grab;
      user-select: none;
    }
    .opp-card:hover { border-color: var(--color-border-default); }
    .opp-card.new { border-left: 3px solid var(--color-accent); }
    .opp-card.rejected { opacity: 0.5; }
    .opp-card.dragging { opacity: 0.3; transform: scale(0.98); cursor: grabbing; }
    .opp-card.drag-over {
      border-color: var(--color-accent);
      box-shadow: 0 -3px 0 0 var(--color-accent) inset, 0 4px 20px rgba(91,141,239,0.15);
    }

    .opp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); }
    .opp-title { display: flex; align-items: center; gap: var(--space-3); }
    .opp-ticker { font-size: var(--text-lg); font-weight: var(--weight-bold); }
    .opp-type   { font-size: var(--text-xs); color: var(--color-text-muted); }

    .score-badge { display: flex; flex-direction: column; align-items: center; min-width: 56px; }
    .score-value { font-size: var(--text-2xl); font-weight: var(--weight-bold); font-family: var(--font-mono); }
    .score-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-muted); }

    .opp-metrics {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: var(--space-3); margin-bottom: var(--space-3);
    }
    @media (max-width: 480px) { .opp-metrics { grid-template-columns: 1fr 1fr; } }
    .met { display: flex; flex-direction: column; gap: 2px; }
    .met-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    .met-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .met-value.pos { color: var(--color-positive); }
    .met-value.neg { color: var(--color-negative); }

    .tech-gate {
      display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap;
      padding: var(--space-3); background: var(--color-bg-elevated);
      border-radius: var(--radius-md); margin-bottom: var(--space-3); font-size: var(--text-xs);
    }
    .gate-item { display: flex; align-items: center; gap: var(--space-1); }
    .gate-label { color: var(--color-text-muted); }
    .gate-value { font-family: var(--font-mono); color: var(--color-text-secondary); }
    .trend-bull { color: var(--color-positive); }
    .trend-bear { color: var(--color-negative); }
    .trend-neu  { color: var(--color-text-muted); }

    .opp-notes { font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-3); line-height: 1.5; }
    .opp-actions { display: flex; gap: var(--space-2); }
    .opp-actions .btn { flex: 1; }
    @media (max-width: 480px) { .opp-actions { flex-direction: column; } }

    /* === Chart + Exec modal === */
    .chart-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.88);
      display: flex; align-items: center; justify-content: center;
      z-index: 200;
      padding: 16px;
      backdrop-filter: blur(6px);
    }
    .chart-modal {
      display: flex;
      width: 96vw; max-width: 1440px;
      height: 88vh; max-height: 920px;
      background: var(--color-bg-panel);
      border-radius: var(--radius-xl);
      overflow: hidden;
      border: 1px solid var(--color-border-default);
      box-shadow: 0 24px 80px rgba(0,0,0,0.75);
    }
    @media (max-width: 900px) {
      .chart-modal { flex-direction: column; height: 95dvh; max-height: none; }
      .chart-left { flex: 1; min-height: 280px; border-right: none; border-bottom: 1px solid var(--color-border-subtle); }
      .chart-right { height: auto; }
    }
    @media (max-width: 600px) {
      .chart-overlay { padding: 0; }
      .chart-modal { width: 100%; height: 100dvh; border-radius: 0; }
      .chart-left { display: none; }
      .chart-right { flex: 1; }
    }

    .chart-left {
      flex: 1; display: flex; flex-direction: column;
      border-right: 1px solid var(--color-border-subtle); min-width: 0;
    }
    .chart-header-bar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 16px;
      background: var(--color-bg-card);
      border-bottom: 1px solid var(--color-border-subtle);
      flex-shrink: 0;
    }
    .chart-ticker-label { font-size: var(--text-md); font-weight: var(--weight-bold); font-family: var(--font-mono); }
    .chart-meta-label   { font-size: var(--text-xs); color: var(--color-text-muted); }
    .tv-frame { flex: 1; width: 100%; border: none; display: block; min-height: 0; }

    .chart-right {
      width: 380px; min-width: 320px;
      display: flex; flex-direction: column;
      overflow-y: auto;
      background: var(--color-bg-panel);
    }
    @media (max-width: 900px) { .chart-right { width: 100%; min-width: 0; } }

    /* Exec panel pieces */
    .exec-header {
      padding: 20px 20px 16px;
      border-bottom: 1px solid var(--color-border-subtle);
      flex-shrink: 0;
    }
    .exec-title { font-size: var(--text-lg); font-weight: var(--weight-bold); }
    .exec-sub   { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 3px; }

    .exec-body { flex: 1; padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }

    .pay-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 0; border-bottom: 1px solid var(--color-border-subtle);
      font-size: var(--text-sm);
    }
    .pay-row:last-child { border-bottom: none; }
    .pay-label { color: var(--color-text-muted); }
    .pay-value { font-family: var(--font-mono); font-weight: var(--weight-semibold); }
    .pay-value.pos { color: var(--color-positive); }

    .exec-warn-list { display: flex; flex-direction: column; gap: 6px; }
    .exec-warn-item {
      display: flex; align-items: flex-start; gap: 6px;
      padding: 8px 10px;
      background: var(--color-warning-dim);
      border-radius: var(--radius-md);
      font-size: var(--text-xs); color: var(--color-warning); line-height: 1.5;
    }

    .confirm-prompt {
      padding: 14px 16px;
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
      font-size: var(--text-sm); color: var(--color-text-secondary);
      line-height: 1.65;
    }
    .confirm-prompt strong { color: var(--color-text-primary); }
    .confirm-prompt p + p { margin-top: 10px; }

    .exec-actions {
      padding: 14px 20px;
      border-top: 1px solid var(--color-border-subtle);
      display: flex; gap: 8px;
      flex-shrink: 0;
    }
    .exec-actions .btn { flex: 1; }

    .exec-pending {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 16px; color: var(--color-text-muted); font-size: var(--text-sm);
    }
    .exec-spinner {
      width: 34px; height: 34px; border-radius: 50%;
      border: 3px solid var(--color-border-default);
      border-top-color: var(--color-accent);
      animation: spin 0.75s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .exec-done {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 14px; padding: 32px;
    }
    .exec-done-icon {
      width: 56px; height: 56px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: bold;
    }
    .exec-done.success .exec-done-icon { background: var(--color-positive-dim); color: var(--color-positive); }
    .exec-done.fail    .exec-done-icon { background: var(--color-negative-dim); color: var(--color-negative); }
    .exec-done-msg {
      text-align: center; font-size: var(--text-sm);
      color: var(--color-text-secondary); line-height: 1.5;
    }

    .chart-close-btn {
      background: none; border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md); color: var(--color-text-muted);
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 13px; transition: all 0.15s; flex-shrink: 0;
    }
    .chart-close-btn:hover { background: var(--color-bg-elevated); color: var(--color-text-primary); }

    .mobile-chart-hint { display: none; font-size: 11px; color: var(--color-text-muted); }
    @media (max-width: 600px) { .mobile-chart-hint { display: block; } }
    .mobile-chart-hint a { color: var(--color-accent); }
  `];constructor(){super(),this._candidates=[...ga.candidates],this._segment="all",this._dragSrc=-1,this._dragOver=-1,this._chartCandidate=null,this._execStep="preview",this._execResult=null;const e=E.load(Fe);e.segment&&(this._segment=e.segment)}_setSegment(e){this._segment=e,E.save(Fe,{segment:e})}_filtered(){return this._segment==="all"?this._candidates:this._candidates.filter(e=>e.status===this._segment)}_scoreColor(e){return e>=80?"var(--color-positive)":e>=60?"var(--color-accent)":e>=40?"var(--color-warning)":"var(--color-negative)"}_idx(e){return this._candidates.indexOf(e)}_onDragStart(e,t){this._dragSrc=this._idx(t),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",String(this._dragSrc))}_onDragOver(e,t){e.preventDefault(),e.dataTransfer.dropEffect="move";const a=this._idx(t);this._dragOver!==a&&(this._dragOver=a)}_onDrop(e,t){e.preventDefault();const a=this._idx(t);if(this._dragSrc<0||this._dragSrc===a){this._dragSrc=-1,this._dragOver=-1;return}const r=[...this._candidates],[o]=r.splice(this._dragSrc,1);r.splice(a,0,o),this._candidates=r,this._dragSrc=-1,this._dragOver=-1}_onDragEnd(){this._dragSrc=-1,this._dragOver=-1}_openChart(e){this._chartCandidate=e,this._execStep="preview",this._execResult=null}_closeChart(){this._chartCandidate=null,this._execStep="preview",this._execResult=null}async _doExecute(){this._execStep="executing",await ke(1500),this._execResult={success:!0,message:`${this._chartCandidate.ticker} grid miner deployed successfully. Capital locked in position.`},this._execStep="done",window.toast?.(`${this._chartCandidate.ticker} miner created`,{type:"success"})}_renderChartModal(){const e=this._chartCandidate;if(!e)return"";const a=`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(`BYBIT:${e.ticker}`)}&interval=240&theme=dark&style=1&locale=en&hide_top_toolbar=0&hide_side_toolbar=0&allow_symbol_change=1&drawings_access=all&save_image=1`;return s`
      <div class="chart-overlay" @click=${r=>{r.target===r.currentTarget&&this._closeChart()}}>
        <div class="chart-modal">
          <!-- Left: TradingView chart -->
          <div class="chart-left">
            <div class="chart-header-bar">
              <div>
                <div class="chart-ticker-label">${e.ticker}</div>
                <div class="chart-meta-label">4H · Bybit Perpetual · Technical Analysis</div>
              </div>
              <button class="chart-close-btn" @click=${this._closeChart} title="Close">✕</button>
            </div>
            <iframe src="${a}" class="tv-frame" frameborder="0" allowtransparency="true" scrolling="no"></iframe>
          </div>
          <!-- Right: Execute panel -->
          <div class="chart-right">
            ${this._renderExecPanel(e)}
          </div>
        </div>
      </div>
    `}_renderExecPanel(e){if(this._execStep==="preview")return s`
      <div class="exec-header">
        <div class="exec-title">Create Grid Miner</div>
        <div class="exec-sub">${e.ticker} · ${e.type}</div>
      </div>
      <div class="exec-body">
        <div>
          ${[{label:"Ticker",value:e.ticker},{label:"Strategy",value:e.type},{label:"Capital",value:l.usd(e.capitalRequired)},{label:"Leverage",value:l.leverage(e.leverage)},{label:"Est. Monthly",value:l.pnl(e.estimatedMonthly),cls:"pos"},{label:"Score",value:`${e.score} / 100`}].map(a=>s`
            <div class="pay-row">
              <span class="pay-label">${a.label}</span>
              <span class="pay-value ${a.cls||""}">${a.value}</span>
            </div>
          `)}
        </div>
        <div class="exec-warn-list">
          <div class="exec-warn-item">⚠ ${l.usd(e.capitalRequired)} will be locked in this grid.</div>
          <div class="exec-warn-item">⚠ Perpetual futures carry liquidation risk if price exits the grid.</div>
        </div>
        <p class="mobile-chart-hint">
          Chart hidden on small screens —
          <a href="https://www.tradingview.com/chart/?symbol=BYBIT:${e.ticker}" target="_blank">open in TradingView ↗</a>
        </p>
      </div>
      <div class="exec-actions">
        <button class="btn btn-ghost" @click=${this._closeChart}>Cancel</button>
        <button class="btn btn-primary" @click=${()=>this._execStep="confirm"}>Review & Confirm →</button>
      </div>
    `;if(this._execStep==="confirm")return s`
      <div class="exec-header">
        <div class="exec-title">Confirm Deployment</div>
        <div class="exec-sub">Verify chart range before committing capital</div>
      </div>
      <div class="exec-body">
        <div class="confirm-prompt">
          <p>You are about to deploy <strong>${l.usd(e.capitalRequired)}</strong> into a
          <strong>${e.type}</strong> grid strategy on <strong>${e.ticker}</strong>.</p>
          <p>Verify on the chart that the current price sits inside a viable range.
          RSI: <strong>${e.technicalGate.rsi}</strong> ·
          Support: <strong>${e.technicalGate.support}</strong> ·
          Resistance: <strong>${e.technicalGate.resistance}</strong>.</p>
        </div>
      </div>
      <div class="exec-actions">
        <button class="btn btn-ghost" @click=${()=>this._execStep="preview"}>← Back</button>
        <button class="btn btn-positive" @click=${()=>this._doExecute()}>Deploy Capital ✓</button>
      </div>
    `;if(this._execStep==="executing")return s`
      <div class="exec-pending">
        <div class="exec-spinner"></div>
        <span>Deploying ${e.ticker} grid miner…</span>
      </div>
    `;const t=this._execResult?.success;return s`
      <div class="exec-done ${t?"success":"fail"}">
        <div class="exec-done-icon">${t?"✓":"✕"}</div>
        <div class="exec-done-msg">${this._execResult?.message||"An error occurred."}</div>
        <button class="btn btn-ghost" style="width:100%;margin-top:8px" @click=${this._closeChart}>Close</button>
      </div>
    `}_renderCandidate(e){const t={bullish:"trend-bull",bearish:"trend-bear",neutral:"trend-neu"}[e.technicalGate?.trend]||"",a=this._idx(e);return s`
      <div
        class="opp-card ${e.status} ${this._dragSrc===a?"dragging":""} ${this._dragOver===a?"drag-over":""}"
        draggable="true"
        @dragstart=${r=>this._onDragStart(r,e)}
        @dragover=${r=>this._onDragOver(r,e)}
        @drop=${r=>this._onDrop(r,e)}
        @dragend=${()=>this._onDragEnd()}
      >
        <div class="opp-header">
          <div class="opp-title">
            <div>
              <div class="opp-ticker">${e.ticker}</div>
              <div class="opp-type">${e.type} · ${l.leverage(e.leverage)}</div>
            </div>
            <span class="tag ${e.status==="new"?"tag-accent":e.status==="watching"?"tag-warning":"tag-muted"}">${e.status}</span>
          </div>
          <div class="score-badge">
            <span class="score-value" style="color:${this._scoreColor(e.score)}">${e.score}</span>
            <span class="score-label">Score</span>
          </div>
        </div>

        <div class="opp-metrics">
          <div class="met"><span class="met-label">Capital Needed</span><span class="met-value">${l.usd(e.capitalRequired)}</span></div>
          <div class="met"><span class="met-label">Est. Monthly</span><span class="met-value pos">${l.pnl(e.estimatedMonthly)}</span></div>
          <div class="met"><span class="met-label">Volatility 30d</span><span class="met-value">${e.volatility30d}%</span></div>
          <div class="met"><span class="met-label">Funding Rate</span><span class="met-value ${e.fundingRate<0?"pos":"neg"}">${(e.fundingRate*100).toFixed(3)}%</span></div>
          <div class="met"><span class="met-label">Volume 24h</span><span class="met-value">${l.compact(e.volume24h)}</span></div>
          <div class="met"><span class="met-label">Annual Yield</span><span class="met-value pos">${l.pnl(e.estimatedAnnual)}</span></div>
        </div>

        <div class="tech-gate">
          <div class="gate-item"><span class="gate-label">Trend:</span><span class="gate-value ${t}">${e.technicalGate?.trend}</span></div>
          <div class="gate-item"><span class="gate-label">RSI:</span><span class="gate-value">${e.technicalGate?.rsi}</span></div>
          <div class="gate-item"><span class="gate-label">Support:</span><span class="gate-value">${e.technicalGate?.support}</span></div>
          <div class="gate-item"><span class="gate-label">Resistance:</span><span class="gate-value">${e.technicalGate?.resistance}</span></div>
        </div>

        <div class="opp-notes">${e.notes}</div>

        ${e.status!=="rejected"?s`
          <div class="opp-actions">
            <button class="btn btn-ghost btn-sm" @click=${r=>r.stopPropagation()}>Simulate Capital</button>
            <button class="btn btn-primary btn-sm" @click=${r=>{r.stopPropagation(),this._openChart(e)}}>📈 Create Miner →</button>
          </div>
        `:""}
      </div>
    `}render(){const e=this._filtered(),t={new:0,watching:0,rejected:0};return this._candidates.forEach(a=>{t[a.status]=(t[a.status]||0)+1}),s`
      <div class="page">
        <div class="toolbar">
          <segmented-control
            .options=${[{value:"all",label:`All (${this._candidates.length})`},{value:"new",label:`New (${t.new||0})`},{value:"watching",label:`Watching (${t.watching||0})`},{value:"rejected",label:`Rejected (${t.rejected||0})`}]}
            value=${this._segment}
            @change=${a=>this._setSegment(a.detail)}
          ></segmented-control>
        </div>

        <div class="candidates">
          ${e.map(a=>this._renderCandidate(a))}
          ${e.length===0?s`<empty-view label="No opportunities in this category"></empty-view>`:""}
        </div>
      </div>

      ${this._renderChartModal()}
    `}}customElements.define("opportunities-view",ha);const ma={config:{mode:"futures",riskPerTrade:1.5,leverage:10,dailyTargetMin:150,dailyTargetMax:400,capitalAllocated:8500},stats:{todayPnl:187.4,todayTrades:12,winRate:66.7,dailyProgress:52.1,weeklyPnl:842.2,avgWin:48.3,avgLoss:-24.1,sharpeRatio:1.84},signals:[{id:"s1",ticker:"BTCUSDT",direction:"LONG",strength:"strong",entry:43820,sl:43580,tp:44240,rr:1.9,timeframe:"5m",confidence:84,ts:Date.now()-12e4},{id:"s2",ticker:"ETHUSDT",direction:"SHORT",strength:"medium",entry:2315,sl:2335,tp:2278,rr:1.85,timeframe:"15m",confidence:71,ts:Date.now()-3e5},{id:"s3",ticker:"SOLUSDT",direction:"LONG",strength:"weak",entry:101.2,sl:99.8,tp:103.8,rr:1.86,timeframe:"5m",confidence:58,ts:Date.now()-48e4}],monitors:[{ticker:"BTCUSDT",pnl:92.4,status:"active",leverage:10,size:850,entry:43200,current:43820},{ticker:"ETHUSDT",pnl:45.8,status:"active",leverage:10,size:500,entry:2265,current:2315}],journal:[{id:"j1",date:"2024-06-04",ticker:"BTCUSDT",direction:"LONG",pnl:148.2,notes:"Clean break of 43k resistance. Executed well."},{id:"j2",date:"2024-06-04",ticker:"SOLUSDT",direction:"SHORT",pnl:-48.1,notes:"Stopped out. Failed breakdown — momentum reversed."},{id:"j3",date:"2024-06-03",ticker:"ETHUSDT",direction:"LONG",pnl:212.8,notes:"EMA bounce + volume confirmation. Held for full target."}]},ce="scalping";class ba extends h{static properties={_data:{type:Object,state:!0},_mode:{type:String,state:!0},_tab:{type:String,state:!0}};static styles=[T,m`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-5); }
    .top-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--space-3); }
    .two-col { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-4); }
    @media (max-width: 1000px) { .two-col { grid-template-columns: 1fr; } }

    .panel { background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--card-padding); }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-4); display: flex; align-items: center; justify-content: space-between; }

    .signal-card {
      display: flex; align-items: center; gap: var(--space-4);
      padding: var(--space-3); background: var(--color-bg-elevated);
      border-radius: var(--radius-md); margin-bottom: var(--space-2);
      border-left: 3px solid transparent;
    }
    .signal-card.strong { border-left-color: var(--color-positive); }
    .signal-card.medium { border-left-color: var(--color-warning); }
    .signal-card.weak   { border-left-color: var(--color-idle); }

    .sig-dir { font-size: var(--text-xs); font-weight: var(--weight-bold); padding: 3px 8px; border-radius: var(--radius-sm); letter-spacing: 0.08em; }
    .sig-dir.long  { background: var(--color-positive-dim); color: var(--color-positive); }
    .sig-dir.short { background: var(--color-negative-dim); color: var(--color-negative); }

    .sig-ticker { font-size: var(--text-md); font-weight: var(--weight-semibold); font-family: var(--font-mono); }
    .sig-meta   { font-size: var(--text-xs); color: var(--color-text-muted); }

    .sig-levels { display: flex; gap: var(--space-4); margin-left: auto; font-size: var(--text-xs); font-family: var(--font-mono); }
    .sig-level-item { display: flex; flex-direction: column; gap: 2px; align-items: flex-end; }
    .sig-level-label { color: var(--color-text-muted); }
    .sig-rr { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-accent); min-width: 40px; text-align: right; }
    .sig-confidence { font-size: var(--text-xs); color: var(--color-text-muted); min-width: 50px; text-align: right; }

    .config-fields { display: flex; flex-direction: column; gap: var(--space-3); }
    .field-row { display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border-subtle); }
    .field-row:last-child { border-bottom: none; }
    .field-label { font-size: var(--text-sm); color: var(--color-text-secondary); }
    .field-val { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }

    .monitor-row { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3); background: var(--color-bg-elevated); border-radius: var(--radius-md); margin-bottom: var(--space-2); }
    .mon-ticker { font-family: var(--font-mono); font-weight: var(--weight-semibold); width: 80px; }
    .mon-pnl { font-family: var(--font-mono); font-weight: var(--weight-semibold); }
    .mon-actions { margin-left: auto; display: flex; gap: var(--space-2); }

    .journal-row { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-3); border-bottom: 1px solid var(--color-border-subtle); }
    .journal-row:last-child { border-bottom: none; }
    .jour-date { font-size: var(--text-xs); color: var(--color-text-muted); min-width: 70px; }
    .jour-body { flex: 1; font-size: var(--text-sm); }
    .jour-pnl { font-family: var(--font-mono); font-weight: var(--weight-semibold); min-width: 80px; text-align: right; }

    .daily-progress { padding: var(--space-3); background: var(--color-bg-elevated); border-radius: var(--radius-md); margin-bottom: var(--space-4); }
    .dp-header { display: flex; justify-content: space-between; margin-bottom: var(--space-2); font-size: var(--text-sm); }
    .dp-range { font-size: var(--text-xs); color: var(--color-text-muted); }

    .scan-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--color-border-subtle); margin-bottom: var(--space-3); }
    .scan-tab { padding: var(--space-2) var(--space-3); font-size: var(--text-xs); font-weight: var(--weight-medium); color: var(--color-text-muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all var(--transition-fast); }
    .scan-tab.active { color: var(--color-accent); border-bottom-color: var(--color-accent); }
    .scan-tab:hover { color: var(--color-text-secondary); }
  `];constructor(){super(),this._data=ma;const e=E.load(ce);this._mode=e.mode||"futures",this._tab=e.tab||"signals"}_setMode(e){this._mode=e,E.save(ce,{mode:e,tab:this._tab})}_setTab(e){this._tab=e,E.save(ce,{mode:this._mode,tab:e})}_renderSignals(){return s`
      <div class="panel">
        <div class="panel-title">
          Scan Signals
          <segmented-control
            .options=${[{value:"futures",label:"Futures"},{value:"spot",label:"Spot"}]}
            value=${this._mode}
            @change=${e=>this._setMode(e.detail)}
          ></segmented-control>
        </div>
        <div class="scan-tabs">
          <div class="scan-tab ${this._tab==="signals"?"active":""}" @click=${()=>this._setTab("signals")}>Live Signals</div>
          <div class="scan-tab ${this._tab==="monitors"?"active":""}" @click=${()=>this._setTab("monitors")}>Active Monitors</div>
          <div class="scan-tab ${this._tab==="journal"?"active":""}" @click=${()=>this._setTab("journal")}>Trade Journal</div>
        </div>

        ${this._tab==="signals"?this._data.signals.map(e=>s`
          <div class="signal-card ${e.strength}">
            <span class="sig-dir ${e.direction.toLowerCase()}">${e.direction}</span>
            <div>
              <div class="sig-ticker">${e.ticker}</div>
              <div class="sig-meta">${e.timeframe} · ${new Date(e.ts).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1})}</div>
            </div>
            <div class="sig-levels">
              <div class="sig-level-item"><span class="sig-level-label">Entry</span><span>${e.entry.toLocaleString()}</span></div>
              <div class="sig-level-item"><span class="sig-level-label">SL</span><span style="color:var(--color-negative)">${e.sl.toLocaleString()}</span></div>
              <div class="sig-level-item"><span class="sig-level-label">TP</span><span style="color:var(--color-positive)">${e.tp.toLocaleString()}</span></div>
            </div>
            <div><div class="sig-rr">R:R ${e.rr}</div><div class="sig-confidence">${e.confidence}% conf</div></div>
          </div>
        `):""}

        ${this._tab==="monitors"?this._data.monitors.map(e=>s`
          <div class="monitor-row">
            <span class="mon-ticker">${e.ticker}</span>
            <span class="mon-pnl" style="color:${e.pnl>=0?"var(--color-positive)":"var(--color-negative)"}">${l.pnl(e.pnl)}</span>
            <div class="mon-actions">
              <button class="btn btn-ghost btn-sm">Close TP</button>
              <button class="btn btn-danger btn-sm">Stop</button>
            </div>
          </div>
        `):""}

        ${this._tab==="journal"?this._data.journal.map(e=>s`
          <div class="journal-row">
            <span class="jour-date">${e.date}</span>
            <div class="jour-body">
              <div style="font-size:var(--text-xs);font-weight:var(--weight-semibold);margin-bottom:2px">${e.ticker} · ${e.direction}</div>
              <div style="font-size:var(--text-xs);color:var(--color-text-muted)">${e.notes}</div>
            </div>
            <span class="jour-pnl" style="color:${e.pnl>=0?"var(--color-positive)":"var(--color-negative)"}">${l.pnl(e.pnl)}</span>
          </div>
        `):""}
      </div>
    `}render(){const e=this._data.stats,t=this._data.config;return s`
      <div class="page">
        <div class="top-row">
          <stat-card label="Today PnL"    value="${l.pnl(e.todayPnl)}"         accent="positive" mono></stat-card>
          <stat-card label="Today Trades" value="${e.todayTrades}"                accent="neutral"></stat-card>
          <stat-card label="Win Rate"     value="${e.winRate.toFixed(1)}%"        accent="${e.winRate>55?"positive":"warning"}" mono></stat-card>
          <stat-card label="Weekly PnL"   value="${l.pnl(e.weeklyPnl)}"         accent="positive" mono></stat-card>
          <stat-card label="Sharpe"       value="${e.sharpeRatio.toFixed(2)}"     accent="accent" mono></stat-card>
          <stat-card label="Avg Win"      value="${l.pnl(e.avgWin)}"            accent="positive" mono></stat-card>
        </div>

        <div class="daily-progress">
          <div class="dp-header">
            <span style="font-size:var(--text-sm);font-weight:var(--weight-semibold)">Daily Target Progress</span>
            <span style="font-family:var(--font-mono);color:var(--color-positive)">${l.pnl(e.todayPnl)}</span>
          </div>
          <progress-bar value=${e.dailyProgress} color="var(--color-positive)" height="8" showPct></progress-bar>
          <div class="dp-range">Target range: ${l.usd(t.dailyTargetMin)} – ${l.usd(t.dailyTargetMax)}</div>
        </div>

        <div class="two-col">
          ${this._renderSignals()}

          <div class="panel">
            <div class="panel-title">Configuration</div>
            <div class="config-fields">
              <div class="field-row"><span class="field-label">Mode</span><span class="field-val">${t.mode.toUpperCase()}</span></div>
              <div class="field-row"><span class="field-label">Risk / Trade</span><span class="field-val">${t.riskPerTrade}%</span></div>
              <div class="field-row"><span class="field-label">Leverage</span><span class="field-val">${l.leverage(t.leverage)}</span></div>
              <div class="field-row"><span class="field-label">Capital</span><span class="field-val">${l.usd(t.capitalAllocated)}</span></div>
              <div class="field-row"><span class="field-label">Daily Target</span><span class="field-val">${l.usd(t.dailyTargetMin)} – ${l.usd(t.dailyTargetMax)}</span></div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("scalping-view",ba);const fa={config:{monthlyBudget:2e3,currentBtc:.41842,targetBtc:1,btcPrice:43820},progress:{pctToTarget:41.8,usdValue:18338,remaining:.58158,remainingUsd:25482},purchases:[{id:"b1",date:"2024-06-01",amount:.0458,price:43680,usd:2000.69,note:"Monthly DCA"},{id:"b2",date:"2024-05-15",amount:.0284,price:62830,usd:1784.37,note:"Dip buy"},{id:"b3",date:"2024-05-01",amount:.0324,price:58410,usd:1892.48,note:"Monthly DCA"},{id:"b4",date:"2024-04-01",amount:.0298,price:67120,usd:2000.18,note:"Monthly DCA"}]};class xa extends h{static properties={_data:{type:Object,state:!0},_modal:{type:String,state:!0},_buyAmount:{type:Number,state:!0}};static styles=[T,m`
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
  `];constructor(){super(),this._data=fa,this._modal=null,this._buyAmount=500}async _executeBuy(){return await ke(1500),{success:!0,message:`Purchased ${(this._buyAmount/this._data.config.btcPrice).toFixed(5)} BTC at $${this._data.config.btcPrice.toLocaleString()}. Total: ${l.usd(this._buyAmount,2)}.`}}render(){const e=this._data;return s`
      <div class="page">
        <div class="two-col">
          <div class="panel">
            <div class="panel-title">BTC Accumulation Progress</div>
            <div class="btc-progress-display">
              <div class="btc-main">${l.btc(e.config.currentBtc)}</div>
              <div class="btc-target">of ${l.btc(e.config.targetBtc)} target · ${e.progress.pctToTarget.toFixed(1)}% complete</div>
              <progress-bar value=${e.progress.pctToTarget} color="var(--color-warning)" height="10" showPct></progress-bar>
              <div class="btc-sub">≈ ${l.usd(e.progress.usdValue)}</div>
            </div>

            <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--color-border-subtle)">
              <div class="config-field"><span class="cf-label">Remaining</span><span class="cf-value" style="color:var(--color-text-muted)">${l.btc(e.progress.remaining)}</span></div>
              <div class="config-field"><span class="cf-label">Remaining (USD)</span><span class="cf-value">${l.usd(e.progress.remainingUsd)}</span></div>
              <div class="config-field"><span class="cf-label">Current BTC Price</span><span class="cf-value">${l.usd(e.config.btcPrice)}</span></div>
              <div class="config-field"><span class="cf-label">Monthly Budget</span><span class="cf-value">${l.usd(e.config.monthlyBudget)}</span></div>
              <div class="config-field"><span class="cf-label">Months to Target</span><span class="cf-value">${(e.progress.remainingUsd/e.config.monthlyBudget).toFixed(1)}</span></div>
            </div>
          </div>

          <div>
            <div class="panel" style="margin-bottom:var(--space-4)">
              <div class="panel-title">Purchase History</div>
              ${e.purchases.map(t=>s`
                <div class="purchase-row">
                  <span class="pr-date">${t.date}</span>
                  <span class="pr-amount">${l.btc(t.amount)}</span>
                  <span class="pr-price">@ ${l.usd(t.price)}</span>
                  <span class="pr-usd">${l.usd(t.usd,2)}</span>
                </div>
                <div style="padding:0 0 var(--space-2) 0;font-size:var(--text-xs);color:var(--color-text-disabled);border-bottom:1px solid var(--color-border-subtle)">${t.note}</div>
              `)}
            </div>

            <div class="panel">
              <div class="panel-title">Manual Buy</div>
              <div class="buy-section">
                <numeric-input
                  label="USDT Amount"
                  .value=${this._buyAmount}
                  min="10" max="50000" step="100"
                  prefix="$"
                  @change=${t=>this._buyAmount=t.detail}
                  style="flex:1"
                ></numeric-input>
                <div style="font-size:var(--text-xs);color:var(--color-text-muted);white-space:nowrap">
                  ≈ ${(this._buyAmount/e.config.btcPrice).toFixed(6)} BTC
                </div>
                <button class="btn btn-warning" @click=${()=>this._modal="buy"}>Buy BTC →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${this._modal==="buy"?s`
        <preview-execute-modal
          title="Buy BTC"
          subtitle="Manual market buy on BTC Core strategy."
          domain="btc-core"
          .payload=${[{label:"Spend",value:l.usd(this._buyAmount,2)},{label:"BTC Price",value:l.usd(e.config.btcPrice)},{label:"BTC Received",value:`≈ ${(this._buyAmount/e.config.btcPrice).toFixed(6)} BTC`},{label:"New Total",value:`≈ ${(e.config.currentBtc+this._buyAmount/e.config.btcPrice).toFixed(5)} BTC`}]}
          .warnings=${["Market buy — execution price may differ from quote."]}
          dangerLevel="warning"
          confirmText="Buy BTC"
          .executeFn=${()=>this._executeBuy()}
          @closed=${()=>this._modal=null}
          @executed=${()=>{window.toast?.("BTC purchase executed",{type:"success"}),this._modal=null}}
        ></preview-execute-modal>
      `:""}
    `}}customElements.define("btc-core-view",xa);const N={async getDashboard(){return _("/dashboard/btc-ladder")},async getPrice(){return _("/dashboard/btc-ladder/price")},async placeAll({capitalUsdt:i,levels:e,maxDipPct:t}){return _("/dashboard/btc-ladder/place-all",{method:"POST",body:JSON.stringify({capitalUsdt:i,levels:e,maxDipPct:t,...D()})})},async cancelAll(){return _("/dashboard/btc-ladder/cancel-all",{method:"POST",body:JSON.stringify(D())})},async previewLimit({usdtAmount:i,limitPrice:e}){return _("/dashboard/btc-ladder/limit-preview",{method:"POST",body:JSON.stringify({usdtAmount:i,limitPrice:e})})},async executeLimit({confirmationToken:i}){return _("/dashboard/btc-ladder/limit-execute",{method:"POST",headers:{"Idempotency-Key":`ladder-${Date.now()}`},body:JSON.stringify({confirmationToken:i,...D()})})},async confirmFill({btcAmount:i,usdtAmount:e,price:t,note:a}){return _("/dashboard/btc-ladder/fill-confirm",{method:"POST",body:JSON.stringify({btcAmount:i,usdtAmount:e,price:t,note:a})})},async reconcile({autoLedger:i=!1}={}){return _("/dashboard/btc-ladder/reconcile",{method:"POST",body:JSON.stringify({autoLedger:i,...D()})})}},He="btc-ladder";function C(i,e=0){const t=Number(i);return Number.isFinite(t)?t:e}class ya extends h{static properties={_data:{type:Object,state:!0},_price:{type:Number,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_capitalUsdt:{type:Number,state:!0},_levels:{type:Number,state:!0},_maxDipPct:{type:Number,state:!0},_limitUsdt:{type:Number,state:!0},_limitPrice:{type:Number,state:!0},_placeCtx:{type:Object,state:!0},_cancelCtx:{type:Boolean,state:!0},_limitCtx:{type:Object,state:!0},_fillCtx:{type:Object,state:!0}};static styles=[T,m`
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
  `];constructor(){super();const e=E.load(He);this._data={inventory:{},ladderOrders:[],reconciliation:{statusCounts:{}}},this._price=0,this._loading=!0,this._error="",this._capitalUsdt=e.capitalUsdt||120,this._levels=e.levels||6,this._maxDipPct=e.maxDipPct||18,this._limitUsdt=e.limitUsdt||30,this._limitPrice=e.limitPrice||0,this._placeCtx=null,this._cancelCtx=!1,this._limitCtx=null,this._fillCtx=null}connectedCallback(){super.connectedCallback(),this._load()}_persistDraft(){E.save(He,{capitalUsdt:this._capitalUsdt,levels:this._levels,maxDipPct:this._maxDipPct,limitUsdt:this._limitUsdt,limitPrice:this._limitPrice})}async _load(){this._loading=!0,this._error="";try{const[e,t]=await Promise.all([N.getDashboard(),N.getPrice().catch(()=>null)]);this._data=e||this._data,this._price=Number(t?.price||this._price||0),!this._limitPrice&&this._price>0&&(this._limitPrice=this._price*.96),this._persistDraft()}catch(e){this._error=e?.data?.detail||e?.message||"Could not load BTC ladder."}finally{this._loading=!1}}_buildPlanRows(){const e=C(this._price),t=C(this._capitalUsdt),a=Math.max(2,Math.min(12,Number(this._levels||6))),r=Math.max(2,Math.min(40,Number(this._maxDipPct||18)));if(!e||!t)return[];const o=Array.from({length:a},(c,g)=>g+1),n=o.reduce((c,g)=>c+g,0),p=r/a;return o.map((c,g)=>{const u=p*(g+1),v=e*(1-u/100),b=t*(c/n),f=b/v;return{idx:g+1,discountPct:u,levelPrice:v,usdt:b,btc:f}})}async _refreshStatuses(e=!1){try{const t=await N.reconcile({autoLedger:e});this._data={...this._data,ladderOrders:t.orders||this._data.ladderOrders,reconciliation:{statusCounts:t.statusCounts||{}}},e&&await this._load(),window.toast?.(`Checked ${t.checkedCount} ladder orders.`,{type:"info"})}catch(t){window.toast?.(t?.data?.detail||t?.message||"Could not reconcile ladder orders.",{type:"error"})}}async _openLimitPreview(){try{const e=await N.previewLimit({usdtAmount:this._limitUsdt,limitPrice:this._limitPrice});this._limitCtx=e}catch(e){window.toast?.(e?.data?.detail||e?.message||"Could not preview limit order.",{type:"error"})}}async _executePlaceAll(){const e=await N.placeAll({capitalUsdt:this._capitalUsdt,levels:this._levels,maxDipPct:this._maxDipPct});return await this._load(),{success:!!e?.ok,message:`${e?.placedCount||0} ladder orders placed on Pionex.`}}async _executeCancelAll(){const e=await N.cancelAll();return await this._refreshStatuses(!1),{success:!!e?.ok,message:`${e?.cancelledCount||0} open ladder orders cancelled.`}}async _executeLimit(){const e=await N.executeLimit({confirmationToken:this._limitCtx?.confirmationToken});return await this._load(),{success:!!e?.ok,message:e?.ok?"BTC ladder limit order placed on Pionex.":e?.error_message||"Order failed."}}async _confirmFill(){const e=this._fillCtx,t=await N.confirmFill({btcAmount:Number(e?.filledBtcAmount||e?.btcAmount||0),usdtAmount:Number(e?.filledUsdtAmount||e?.usdtAmount||0),price:Number(e?.price||0),note:`manual ledger confirmation from new dashboard for ${e?.orderId||"ladder-order"}`});return await this._refreshStatuses(!1),{success:!!t?.ok,message:"BTC fill added to ledger."}}_renderChart(){const t=`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent("BINANCE:BTCUSDT")}&interval=240&theme=dark&style=1&locale=en&hide_top_toolbar=0&hide_side_toolbar=0&allow_symbol_change=0&drawings_access=all&save_image=1`;return s`<iframe class="chart-frame" src="${t}"></iframe>`}_renderSummary(){const e=this._data?.inventory||{},t=this._data?.reconciliation?.statusCounts||{};return s`
      <div class="panel">
        <div class="panel-title">Ladder Reconciliation</div>
        <div class="summary-grid">
          <div class="summary-box"><div class="summary-label">Total BTC Ledger</div><div class="summary-value">${l.btc(C(e.totalBtc),8)}</div></div>
          <div class="summary-box"><div class="summary-label">Average Cost</div><div class="summary-value">${e.averagePrice?l.usd(C(e.averagePrice),2):"—"}</div></div>
          <div class="summary-box"><div class="summary-label">Pending USDT</div><div class="summary-value">${l.usd(C(e.pendingUsdt),2)}</div></div>
          <div class="summary-box"><div class="summary-label">Orders</div><div class="summary-value">O ${t.open||0} · P ${t.partial_filled||0} · F ${t.filled||0}</div></div>
        </div>
        <div class="hint" style="margin-top:12px">
          Los estados open y partial_filled salen de las open orders de Pionex. Si una orden desaparece de open orders pero no hay fill confirmado suficiente, queda en closed_unknown para evitar contaminar el ledger.
        </div>
      </div>
    `}_renderPlan(){const e=this._buildPlanRows();return s`
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
          ${e.map(t=>s`
            <div class="plan-card">
              <div class="plan-title">L${t.idx} · -${t.discountPct.toFixed(1)}%</div>
              <div class="plan-main">${l.usd(t.levelPrice,2)}</div>
              <div class="hint">${l.usd(t.usdt,2)} · ${l.btc(t.btc,6)}</div>
            </div>
          `)}
          ${e.length?"":s`<div class="hint">Load a price and valid capital to compute a ladder plan.</div>`}
        </div>
      </div>
    `}_renderManualLimit(){return s`
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
    `}_renderOrders(){const e=Array.isArray(this._data?.ladderOrders)?this._data.ladderOrders:[];return s`
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
              ${e.map(t=>s`
                <tr>
                  <td class="mono">${t.orderId}</td>
                  <td class="mono">${l.usd(C(t.price),2)}</td>
                  <td class="mono">${l.usd(C(t.usdtAmount),2)}</td>
                  <td class="mono">${l.btc(C(t.btcAmount),8)}</td>
                  <td class="mono">${l.btc(C(t.filledBtcAmount||0),8)}</td>
                  <td><span class="status ${t.status||"placed"}">${t.status||"placed"}</span></td>
                  <td>
                    ${t.status==="closed_unknown"||t.status==="partial_filled"?s`
                      <button class="btn btn-ghost btn-sm" @click=${()=>{this._fillCtx=t}}>Confirm Fill</button>
                    `:s`<span class="hint">${t.reconciled?"ledger ok":"—"}</span>`}
                  </td>
                </tr>
              `)}
              ${e.length?"":s`<tr><td colspan="7" class="hint">No ladder orders yet. Place the ladder from the plan above.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    `}render(){if(this._loading)return s`<loading-view label="Loading BTC ladder"></loading-view>`;if(this._error)return s`<error-view label="BTC ladder unavailable" .sub=${this._error}></error-view>`;const e=this._data?.inventory||{};return s`
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
          <stat-card label="BTC Ledger" value="${l.btc(C(e.totalBtc),8)}" accent="accent"></stat-card>
          <stat-card label="USDT Invested" value="${l.usd(C(e.totalUsdt),2)}" accent="neutral" mono></stat-card>
          <stat-card label="DCA Source" value="${l.btc(C(e.dcaBtc),8)}" accent="warning"></stat-card>
          <stat-card label="Ladder Source" value="${l.btc(C(e.ladderBtc),8)}" accent="positive"></stat-card>
        </div>

        ${this._renderPlan()}
        ${this._renderManualLimit()}
        ${this._renderOrders()}
      </div>

      ${this._placeCtx?s`
        <preview-execute-modal
          title="Place Full Ladder"
          subtitle="${this._levels} live BTC spot limit orders on Pionex"
          domain="btc-ladder"
          .payload=${[{label:"Capital",value:l.usd(this._capitalUsdt,2)},{label:"Levels",value:this._levels},{label:"Max Dip",value:`${this._maxDipPct}%`},{label:"Reference Price",value:l.usd(this._price,2)}]}
          .warnings=${["This sends real spot LIMIT buy orders to Pionex.","Capital will remain locked until orders fill or are cancelled."]}
          dangerLevel="warning"
          confirmText="Place Ladder"
          .executeFn=${()=>this._executePlaceAll()}
          @closed=${()=>{this._placeCtx=null}}
          @executed=${()=>{this._placeCtx=null}}
        ></preview-execute-modal>
      `:""}

      ${this._cancelCtx?s`
        <preview-execute-modal
          title="Cancel All Ladder Orders"
          subtitle="Cancel current open BTC ladder spot orders"
          domain="btc-ladder"
          .payload=${[{label:"Pending USDT",value:l.usd(C(this._data?.inventory?.pendingUsdt),2)},{label:"Open Orders",value:this._data?.reconciliation?.statusCounts?.open||0}]}
          .warnings=${["Only currently open spot orders will be cancelled.","Filled orders stay in the ledger and are not reversed."]}
          dangerLevel="danger"
          confirmText="Cancel Orders"
          .executeFn=${()=>this._executeCancelAll()}
          @closed=${()=>{this._cancelCtx=!1}}
          @executed=${()=>{this._cancelCtx=!1}}
        ></preview-execute-modal>
      `:""}

      ${this._limitCtx?s`
        <preview-execute-modal
          title="Create Ladder Limit Order"
          subtitle="Single live BTC spot limit buy on Pionex"
          domain="btc-ladder"
          .payload=${[{label:"USDT",value:l.usd(Number(this._limitCtx.usdtAmount||0),2)},{label:"Limit Price",value:l.usd(Number(this._limitCtx.limitPrice||0),2)},{label:"BTC Size",value:l.btc(Number(this._limitCtx.btcAmount||0),8)}]}
          .warnings=${[this._limitCtx.warning||"This will place a real BTC spot limit order."]}
          dangerLevel="warning"
          confirmText="Place Limit"
          .executeFn=${()=>this._executeLimit()}
          @closed=${()=>{this._limitCtx=null}}
          @executed=${()=>{this._limitCtx=null}}
        ></preview-execute-modal>
      `:""}

      ${this._fillCtx?s`
        <preview-execute-modal
          title="Confirm Ladder Fill Into Ledger"
          subtitle="${this._fillCtx.orderId}"
          domain="btc-ladder"
          .payload=${[{label:"Order Status",value:this._fillCtx.status||"unknown"},{label:"BTC",value:l.btc(Number(this._fillCtx.filledBtcAmount||this._fillCtx.btcAmount||0),8)},{label:"USDT",value:l.usd(Number(this._fillCtx.filledUsdtAmount||this._fillCtx.usdtAmount||0),2)},{label:"Price",value:l.usd(Number(this._fillCtx.price||0),2)}]}
          .warnings=${["Use this when Pionex no longer reports the order as open and you want to move the buy into the BTC ledger.","If the order was cancelled rather than filled, do not confirm it here."]}
          dangerLevel="warning"
          confirmText="Update Ledger"
          .executeFn=${()=>this._confirmFill()}
          @closed=${()=>{this._fillCtx=null}}
          @executed=${()=>{this._fillCtx=null}}
        ></preview-execute-modal>
      `:""}
    `}}customElements.define("btc-ladder-view",ya);const _a={universe:[{ticker:"SOLUSDT",vol24h:428e7,trades24h:1842e3,volatility:82,fundingRate:-.008,trend:"bullish",segment:"promote"},{ticker:"ARBUSDT",vol24h:62e7,trades24h:38e4,volatility:74,fundingRate:-.005,trend:"bullish",segment:"promote"},{ticker:"NEARUSDT",vol24h:38e7,trades24h:21e4,volatility:68,fundingRate:.003,trend:"neutral",segment:"watch"},{ticker:"INJUSDT",vol24h:52e7,trades24h:29e4,volatility:91,fundingRate:-.012,trend:"bullish",segment:"watch"},{ticker:"SUIUSDT",vol24h:41e7,trades24h:24e4,volatility:88,fundingRate:-.009,trend:"bullish",segment:"watch"},{ticker:"OPUSDT",vol24h:18e7,trades24h:98e3,volatility:38,fundingRate:.012,trend:"bearish",segment:"rejected"},{ticker:"FTMUSDT",vol24h:145e6,trades24h:72e3,volatility:42,fundingRate:.008,trend:"neutral",segment:"rejected"},{ticker:"BLURUSDT",vol24h:82e6,trades24h:45e3,volatility:68,fundingRate:.015,trend:"bearish",segment:"rejected"}],filters:{minVol24h:1e8,minTrades24h:5e4,minVolatility:40,segments:["promote","watch","rejected"]}},pe="discovery";class wa extends h{static properties={_data:{type:Object,state:!0},_segment:{type:String,state:!0},_search:{type:String,state:!0}};static styles=[T,m`
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
    .symbol-card.watch   { border-left: 3px solid var(--color-warning); }
    .symbol-card.rejected{ border-left: 3px solid var(--color-idle); opacity: 0.6; }

    .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); }
    .sym-name { font-size: var(--text-lg); font-weight: var(--weight-bold); font-family: var(--font-mono); }
    .trend-badge { font-size: var(--text-xs); padding: 2px 7px; border-radius: var(--radius-sm); font-weight: var(--weight-semibold); }
    .trend-bullish { background: var(--color-positive-dim); color: var(--color-positive); }
    .trend-bearish { background: var(--color-negative-dim); color: var(--color-negative); }
    .trend-neutral { background: var(--color-idle-dim);     color: var(--color-idle); }

    .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); margin-bottom: var(--space-3); }
    .met { display: flex; flex-direction: column; gap: 2px; }
    .met-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
    .met-value { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .met-value.good { color: var(--color-positive); }
    .met-value.bad  { color: var(--color-negative); }

    .card-actions { display: flex; gap: var(--space-2); }
    .card-actions button { flex: 1; }
  `];constructor(){super(),this._data=_a;const e=E.load(pe);this._segment=e.segment||"all",this._search=e.search||""}_setSegment(e){this._segment=e,E.save(pe,{segment:e,search:this._search})}_setSearch(e){this._search=e,E.save(pe,{segment:this._segment,search:e})}_filtered(){let e=this._data.universe;return this._segment!=="all"&&(e=e.filter(t=>t.segment===this._segment)),this._search&&(e=e.filter(t=>t.ticker.toLowerCase().includes(this._search.toLowerCase()))),e}_renderCard(e){return s`
      <div class="symbol-card ${e.segment}">
        <div class="card-header">
          <span class="sym-name">${e.ticker}</span>
          <span class="trend-badge trend-${e.trend}">${e.trend}</span>
        </div>

        <div class="metrics">
          <div class="met"><span class="met-label">Vol 24h</span><span class="met-value">${l.compact(e.vol24h)}</span></div>
          <div class="met"><span class="met-label">Trades 24h</span><span class="met-value">${(e.trades24h/1e3).toFixed(0)}K</span></div>
          <div class="met"><span class="met-label">Volatility</span><span class="met-value ${e.volatility>60?"good":""}">${e.volatility}%</span></div>
          <div class="met"><span class="met-label">Funding</span><span class="met-value ${e.fundingRate<0?"good":"bad"}">${(e.fundingRate*100).toFixed(3)}%</span></div>
        </div>

        ${e.segment!=="rejected"?s`
          <div class="card-actions">
            ${e.segment==="watch"?s`
              <button class="btn btn-ghost btn-sm" @click=${()=>window.toast?.(`${e.ticker} kept in watch list`,{type:"info"})}>Keep Watching</button>
            `:""}
            <button class="btn btn-primary btn-sm" @click=${()=>window.toast?.(`${e.ticker} promoted to Opportunities`,{type:"success"})}>
              Promote →
            </button>
          </div>
        `:s`
          <div class="card-actions">
            <button class="btn btn-ghost btn-sm" @click=${()=>window.toast?.(`${e.ticker} moved to watch list`,{type:"info"})}>Reconsider</button>
          </div>
        `}
      </div>
    `}render(){const e=this._filtered(),t={promote:0,watch:0,rejected:0};return this._data.universe.forEach(a=>t[a.segment]=(t[a.segment]||0)+1),s`
      <div class="page">
        <div class="toolbar">
          <segmented-control
            .options=${[{value:"all",label:`Universe (${this._data.universe.length})`},{value:"promote",label:`Promote (${t.promote||0})`},{value:"watch",label:`Watching (${t.watch||0})`},{value:"rejected",label:`Rejected (${t.rejected||0})`}]}
            value=${this._segment}
            @change=${a=>this._setSegment(a.detail)}
          ></segmented-control>
          <input
            class="search-input"
            type="search"
            placeholder="Search ticker..."
            .value=${this._search}
            @input=${a=>this._setSearch(a.target.value)}
          />
          <button class="btn btn-ghost" @click=${()=>window.toast?.("Universe scan triggered",{type:"info"})}>↻ Scan Universe</button>
        </div>

        <div class="grid">
          ${e.map(a=>this._renderCard(a))}
          ${e.length===0?s`<empty-view label="No symbols match your filters"></empty-view>`:""}
        </div>
      </div>
    `}}customElements.define("discovery-view",wa);const $a=()=>{const i=P.exportAll(),e=new Blob([JSON.stringify(i,null,2)],{type:"application/json"}),t=URL.createObjectURL(e),a=document.createElement("a");a.href=t,a.download=`capintel-backup-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(t)},ka=()=>new Promise((i,e)=>{const t=document.createElement("input");t.type="file",t.accept=".json",t.onchange=async a=>{const r=a.target.files[0];if(!r)return e(new Error("No file selected"));try{const o=await r.text(),n=JSON.parse(o);P.importAll(n)?i(n):e(new Error("Import failed"))}catch(o){e(o)}},t.click()}),Sa="modulepreload",Ca=function(i){return"/dashboard/"+i},Ge={},Aa=function(e,t,a){let r=Promise.resolve();if(t&&t.length>0){let g=function(u){return Promise.all(u.map(v=>Promise.resolve(v).then(b=>({status:"fulfilled",value:b}),b=>({status:"rejected",reason:b}))))};var n=g;document.getElementsByTagName("link");const p=document.querySelector("meta[property=csp-nonce]"),c=p?.nonce||p?.getAttribute("nonce");r=g(t.map(u=>{if(u=Ca(u),u in Ge)return;Ge[u]=!0;const v=u.endsWith(".css"),b=v?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${b}`))return;const f=document.createElement("link");if(f.rel=v?"stylesheet":Sa,v||(f.as="script"),f.crossOrigin="",f.href=u,c&&f.setAttribute("nonce",c),document.head.appendChild(f),v)return new Promise((x,k)=>{f.addEventListener("load",x),f.addEventListener("error",()=>k(new Error(`Unable to preload CSS for ${u}`)))})}))}function o(p){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=p,window.dispatchEvent(c),!c.defaultPrevented)throw p}return r.then(p=>{for(const c of p||[])c.status==="rejected"&&o(c.reason);return e().catch(o)})},Ke="capintel_settings";function qe(i){const e=P.load(Ke)||{};P.save(Ke,{...e,exchange:i.exchange,exchangeApiKey:e.exchangeApiKey||"",exchangeApiSecret:e.exchangeApiSecret||"",riskProfile:i.riskProfile,maxCapPct:i.maxCapPct,maxLeverage:i.maxLeverage,refreshInterval:i.refreshInterval,theme:i.theme,hasExchangeApiKey:i.hasExchangeApiKey,hasExchangeApiSecret:i.hasExchangeApiSecret,exchangeApiKeyMasked:i.exchangeApiKeyMasked||null,updatedAt:i.updatedAt||null})}const ve={async getSettings(){const i=await _("/settings");return qe(i),i},async saveSettings(i){const e=await _("/settings",{method:"POST",body:JSON.stringify(i)});return qe(e),e},async validateApiKey({exchange:i,exchangeApiKey:e,exchangeApiSecret:t}){return _("/settings/validate-api-key",{method:"POST",body:JSON.stringify({exchange:i,exchangeApiKey:e,exchangeApiSecret:t})})},async getAuditLog({limit:i=50,domain:e}={}){const{store:t}=await Aa(async()=>{const{store:a}=await Promise.resolve().then(()=>Rt);return{store:a}},void 0);return{data:t.getAuditEvents({limit:i,domain:e}),ok:!0}}};class Pa extends h{static properties={_apiKey:{type:String,state:!0},_apiSecret:{type:String,state:!0},_apiKeyMasked:{type:String,state:!0},_apiStored:{type:Boolean,state:!0},_riskProfile:{type:String,state:!0},_maxCapPct:{type:Number,state:!0},_maxLeverage:{type:Number,state:!0},_exchange:{type:String,state:!0},_refreshInterval:{type:Number,state:!0},_loading:{type:Boolean,state:!0},_saved:{type:Boolean,state:!0},_error:{type:String,state:!0},_validationMessage:{type:String,state:!0}};static styles=[T,m`
    :host { display: block; }
    .page { padding: var(--content-padding); display: flex; flex-direction: column; gap: var(--space-5); }

    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }

    .panel {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
    }
    .panel-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-4); }

    .field-group { display: flex; flex-direction: column; gap: var(--space-4); }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label {
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      color: var(--color-text-secondary);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .field-input {
      width: 100%;
      padding: 10px var(--space-3);
      background: var(--color-bg-base);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      color: var(--color-text-primary);
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      line-height: 1.5;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      outline: none;
      -webkit-appearance: none;
      appearance: none;
    }
    .field-input:hover {
      border-color: var(--color-border-strong);
    }
    .field-input:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(91,141,239,0.18);
    }
    select.field-input {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23636b8a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
      cursor: pointer;
    }
    input[type=number].field-input {
      font-family: var(--font-mono);
      font-size: var(--text-base);
      font-weight: var(--weight-semibold);
    }
    input[type=number].field-input::-webkit-inner-spin-button,
    input[type=number].field-input::-webkit-outer-spin-button { opacity: 0.4; }
    .field-hint { font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.5; }

    .risk-profiles {
      display: flex; flex-direction: column; gap: var(--space-2);
    }
    .risk-profile-opt {
      display: flex; align-items: center; gap: var(--space-3);
      padding: var(--space-3);
      background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border-subtle);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .risk-profile-opt:hover { border-color: var(--color-border-default); }
    .risk-profile-opt.selected { border-color: var(--color-accent); background: var(--color-accent-dim); }

    .rp-radio {
      width: 16px; height: 16px; border-radius: 50%;
      border: 2px solid var(--color-border-strong);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .rp-radio.selected { border-color: var(--color-accent); }
    .rp-radio.selected::after {
      content: ''; width: 7px; height: 7px;
      border-radius: 50%; background: var(--color-accent);
    }
    .rp-body { flex: 1; }
    .rp-name { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
    .rp-desc { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }

    .limits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }

    .data-actions { display: flex; flex-direction: column; gap: var(--space-3); }
    .data-action {
      display: flex; align-items: center; justify-content: space-between;
      padding: var(--space-3); background: var(--color-bg-elevated);
      border-radius: var(--radius-md);
    }
    .da-label { font-size: var(--text-sm); font-weight: var(--weight-medium); }
    .da-sub { font-size: var(--text-xs); color: var(--color-text-muted); }

    .save-bar {
      display: flex; align-items: center; justify-content: flex-end; gap: var(--space-3);
      padding-top: var(--space-4); border-top: 1px solid var(--color-border-subtle); margin-top: var(--space-2);
    }
    .saved-msg { font-size: var(--text-xs); color: var(--color-positive); }
    .status-note {
      padding: 10px 12px;
      border-radius: var(--radius-md);
      background: var(--color-bg-elevated);
      color: var(--color-text-muted);
      font-size: var(--text-xs);
      line-height: 1.5;
      border: 1px solid var(--color-border-subtle);
    }
    .error-box {
      padding: 10px 12px;
      border-radius: var(--radius-md);
      background: rgba(240,74,94,0.12);
      color: var(--color-negative);
      font-size: var(--text-xs);
      border: 1px solid rgba(240,74,94,0.22);
    }
    .success-box {
      padding: 10px 12px;
      border-radius: var(--radius-md);
      background: rgba(34,211,160,0.12);
      color: var(--color-positive);
      font-size: var(--text-xs);
      border: 1px solid rgba(34,211,160,0.22);
    }
  `];constructor(){super();const e=P.load("capintel_settings")||{};this._apiKey=e.exchangeApiKey||"",this._apiSecret=e.exchangeApiSecret||e.apiSecret||"",this._apiKeyMasked=e.exchangeApiKeyMasked||"",this._apiStored=!!e.hasExchangeApiKey,this._riskProfile=e.riskProfile||"moderate",this._maxCapPct=e.maxCapPct||90,this._maxLeverage=e.maxLeverage||10,this._exchange=e.exchange||"pionex",this._refreshInterval=e.refreshInterval||30,this._loading=!1,this._saved=!1,this._error="",this._validationMessage=""}connectedCallback(){super.connectedCallback(),this._load()}async _load(){this._loading=!0,this._error="";try{const e=await ve.getSettings();this._riskProfile=e.riskProfile,this._maxCapPct=e.maxCapPct,this._maxLeverage=e.maxLeverage,this._exchange=e.exchange,this._refreshInterval=e.refreshInterval,this._apiStored=e.hasExchangeApiKey,this._apiKeyMasked=e.exchangeApiKeyMasked||""}catch(e){this._error=e?.data?.detail||e.message||"Failed to load tenant settings."}finally{this._loading=!1}}async _save(){this._loading=!0,this._error="",this._validationMessage="";try{const e={exchange:this._exchange,exchangeApiKey:this._apiKey.trim()||null,exchangeApiSecret:this._apiSecret.trim()||null,riskProfile:this._riskProfile,maxCapPct:this._maxCapPct,maxLeverage:this._maxLeverage,refreshInterval:this._refreshInterval,theme:"dark"};if(e.exchangeApiKey||e.exchangeApiSecret){const a=await ve.validateApiKey(e);if(!a.valid)throw new Error(a.reason||"Pionex credentials could not be validated.");this._validationMessage="Pionex credentials validated successfully."}const t=await ve.saveSettings(e);P.save("capintel_settings",{...P.load("capintel_settings")||{},exchangeApiKey:this._apiKey.trim(),exchangeApiSecret:this._apiSecret.trim()}),this._apiStored=t.hasExchangeApiKey,this._apiKeyMasked=t.exchangeApiKeyMasked||"",this._apiKey="",this._apiSecret="",this._saved=!0,setTimeout(()=>this._saved=!1,3e3),window.toast?.("Tenant settings saved",{type:"success"})}catch(e){this._error=e?.data?.detail||e.message||"Failed to save tenant settings.",window.toast?.(this._error,{type:"error"})}finally{this._loading=!1}}async _import(){try{await ka(),window.toast?.("Dashboard state imported",{type:"success"})}catch(e){window.toast?.("Import failed: "+e.message,{type:"error"})}}_renderRiskProfile(){return s`
      <div class="risk-profiles">
        ${[{id:"conservative",name:"Conservative",desc:"Max 60% deployed, max 5x leverage, only low-risk strategies"},{id:"moderate",name:"Moderate",desc:"Max 85% deployed, max 10x leverage, all strategies allowed"},{id:"aggressive",name:"Aggressive",desc:"Max 95% deployed, max 20x leverage, full strategy set"}].map(t=>s`
          <div class="risk-profile-opt ${this._riskProfile===t.id?"selected":""}" @click=${()=>this._riskProfile=t.id}>
            <div class="rp-radio ${this._riskProfile===t.id?"selected":""}"></div>
            <div class="rp-body">
              <div class="rp-name">${t.name}</div>
              <div class="rp-desc">${t.desc}</div>
            </div>
          </div>
        `)}
      </div>
    `}render(){return s`
      <div class="page">
        <div class="two-col">
          <!-- API Configuration -->
          <div class="panel">
            <div class="panel-title">Exchange API Configuration</div>
            <div class="field-group">
              <div class="field">
                <span class="field-label">Exchange</span>
                <select class="field-input" .value=${this._exchange} @change=${e=>this._exchange=e.target.value}>
                  <option value="bybit">Bybit</option>
                  <option value="binance">Binance</option>
                  <option value="okx">OKX</option>
                  <option value="pionex">Pionex</option>
                </select>
              </div>
              <div class="field">
                <span class="field-label">API Key</span>
                <input class="field-input" type="password" placeholder="••••••••••••••••" .value=${this._apiKey} @input=${e=>this._apiKey=e.target.value} />
                <span class="field-hint">Read + Trade permissions required. Withdraw permission is NOT needed and should be disabled.</span>
              </div>
              <div class="field">
                <span class="field-label">API Secret</span>
                <input class="field-input" type="password" placeholder="••••••••••••••••" .value=${this._apiSecret} @input=${e=>this._apiSecret=e.target.value} />
              </div>
              <div class="status-note">
                ${this._apiStored?s`Credenciales guardadas en backend para este tenant. Llave detectada: <code>${this._apiKeyMasked||"stored"}</code>. Si llenas estos campos y guardas, se reemplazan.`:s`Todavia no hay credenciales persistidas en backend para este tenant.`}
              </div>
            </div>
          </div>

          <!-- Risk Profile -->
          <div class="panel">
            <div class="panel-title">Risk Profile</div>
            ${this._renderRiskProfile()}

            <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--color-border-subtle)">
              <div class="panel-title" style="margin-bottom:var(--space-3)">Risk Limits</div>
              <div class="limits-grid">
                <div class="field">
                  <span class="field-label">Max Capital Deployed (%)</span>
                  <input class="field-input" type="number" min="50" max="100" step="5" .value=${this._maxCapPct} @input=${e=>this._maxCapPct=+e.target.value} />
                </div>
                <div class="field">
                  <span class="field-label">Max Leverage</span>
                  <input class="field-input" type="number" min="1" max="50" step="1" .value=${this._maxLeverage} @input=${e=>this._maxLeverage=+e.target.value} />
                </div>
                <div class="field">
                  <span class="field-label">Refresh Interval (s)</span>
                  <input class="field-input" type="number" min="5" max="3600" step="5" .value=${this._refreshInterval} @input=${e=>this._refreshInterval=+e.target.value} />
                </div>
              </div>
            </div>

            <div class="save-bar">
              ${this._error?s`<span class="error-box">${this._error}</span>`:""}
              ${this._validationMessage?s`<span class="success-box">${this._validationMessage}</span>`:""}
              ${this._saved?s`<span class="saved-msg">✓ Saved</span>`:""}
              <button class="btn btn-primary" ?disabled=${this._loading} @click=${this._save}>${this._loading?"Saving...":"Save Settings"}</button>
            </div>
          </div>
        </div>

        <!-- Data Management -->
        <div class="panel">
          <div class="panel-title">Data Management</div>
          <div class="data-actions">
            <div class="data-action">
              <div>
                <div class="da-label">Export Dashboard State</div>
                <div class="da-sub">Download all local settings, preferences, and filters as JSON.</div>
              </div>
              <button class="btn btn-ghost" @click=${$a}>↓ Export JSON</button>
            </div>
            <div class="data-action">
              <div>
                <div class="da-label">Import Dashboard State</div>
                <div class="da-sub">Restore from a previously exported JSON backup.</div>
              </div>
              <button class="btn btn-ghost" @click=${()=>this._import()}>↑ Import JSON</button>
            </div>
            <div class="data-action">
              <div>
                <div class="da-label">Clear Local Storage</div>
                <div class="da-sub">Remove all local dashboard preferences and reset to defaults.</div>
              </div>
              <button class="btn btn-danger btn-sm" @click=${()=>{localStorage.clear(),window.toast?.("Local storage cleared",{type:"warning"})}}>
                Clear All
              </button>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="panel" style="border-color:var(--color-border-subtle)">
          <div class="panel-title">About</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-4)">
            <div><div class="field-label">Version</div><div style="font-family:var(--font-mono);font-size:var(--text-sm);margin-top:2px">1.0.0-alpha</div></div>
            <div><div class="field-label">Architecture</div><div style="font-size:var(--text-sm);color:var(--color-text-muted);margin-top:2px">Vite + Lit Web Components</div></div>
            <div><div class="field-label">API Base</div><div style="font-family:var(--font-mono);font-size:var(--text-sm);margin-top:2px">/api/v1</div></div>
            <div><div class="field-label">Data Mode</div><div style="font-size:var(--text-sm);color:var(--color-positive);margin-top:2px">Tenant-aware backend persistence for auth and settings is now active</div></div>
          </div>
        </div>
      </div>
    `}}customElements.define("settings-view",Pa);class Ta extends h{static properties={_email:{type:String,state:!0},_password:{type:String,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_lang:{type:String,state:!0}};static styles=[T,m`
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
  `];constructor(){super(),this._email="",this._password="",this._loading=!1,this._error="",this._lang=z()}connectedCallback(){super.connectedCallback(),this._langHandler=()=>{this._lang=z()},window.addEventListener("capintel-lang-changed",this._langHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-lang-changed",this._langHandler)}async _submit(e){e.preventDefault(),this._loading=!0,this._error="";try{await jt({email:this._email.trim(),password:this._password}),window.dispatchEvent(new CustomEvent("capintel-auth-changed")),A.navigate("overview")}catch(t){this._error=t?.data?.detail||t.message||"Unable to sign in."}finally{this._loading=!1}}render(){return s`
      <div class="auth-shell">
        <section class="panel">
          <div class="header-row">
            <div class="eyebrow">${d("product",this._lang)}</div>
            <div class="lang-toggle">
              <button class="btn ${this._lang==="es"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>O("es")}>ES</button>
              <button class="btn ${this._lang==="en"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>O("en")}>EN</button>
            </div>
          </div>
          <h2 class="card-title">${d("signIn",this._lang)}</h2>
          <div class="card-sub">${d("signInSubtitle",this._lang)}</div>
          <form class="stack" @submit=${this._submit}>
            <label class="field">
              <span class="label">${d("email",this._lang)}</span>
              <input class="input" type="email" autocomplete="email" .value=${this._email} @input=${e=>this._email=e.target.value} />
            </label>
            <label class="field">
              <span class="label">${d("password",this._lang)}</span>
              <input class="input" type="password" autocomplete="current-password" .value=${this._password} @input=${e=>this._password=e.target.value} />
            </label>
            ${this._error?s`<div class="error">${this._error}</div>`:""}
            <div class="actions">
              <button class="btn btn-primary" type="submit" ?disabled=${this._loading}>
                ${this._loading?d("signingIn",this._lang):d("signInButton",this._lang)}
              </button>
              <div class="switch-row">
                <div class="switch">
                  ${d("noAccount",this._lang)}
                  <a @click=${()=>A.navigate("sign-up")}>${d("createAccount",this._lang)}</a>
                </div>
                <div class="switch">
                  <a @click=${()=>A.navigate("forgot-password")}>${d("forgotPassword",this._lang)}</a>
                </div>
              </div>
            </div>
          </form>
        </section>
        <section class="hero">
          <div class="eyebrow">${d("cockpit",this._lang)}</div>
          <h1>Worker dashboard, pero listo para evolucionar.</h1>
          <p>Esta capa nueva separa acceso, espacio de trabajo y experiencia visual del plano operacional. Eso nos permite migrar tabs, endurecer backend y mejorar el producto sin repetir deuda del monolito.</p>
          <div class="metrics">
            <div class="metric">
              <div class="metric-label">${d("workspaceIsolation",this._lang)}</div>
              <div class="metric-value">Live</div>
            </div>
            <div class="metric">
              <div class="metric-label">${d("authEntry",this._lang)}</div>
              <div class="metric-value">Phase 1</div>
            </div>
            <div class="metric">
              <div class="metric-label">${d("migrationPath",this._lang)}</div>
              <div class="metric-value">Tab by Tab</div>
            </div>
          </div>
        </section>
      </div>
    `}}customElements.define("sign-in-view",Ta);class Ea extends h{static properties={_fullName:{type:String,state:!0},_tenantName:{type:String,state:!0},_email:{type:String,state:!0},_password:{type:String,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_lang:{type:String,state:!0}};static styles=[T,m`
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
  `];constructor(){super(),this._fullName="",this._tenantName="",this._email="",this._password="",this._loading=!1,this._error="",this._lang=z()}connectedCallback(){super.connectedCallback(),this._langHandler=()=>{this._lang=z()},window.addEventListener("capintel-lang-changed",this._langHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-lang-changed",this._langHandler)}async _submit(e){e.preventDefault(),this._loading=!0,this._error="";try{await Bt({fullName:this._fullName.trim(),tenantName:this._tenantName.trim(),email:this._email.trim(),password:this._password}),window.dispatchEvent(new CustomEvent("capintel-auth-changed")),A.navigate("overview")}catch(t){this._error=t?.data?.detail||t.message||"Unable to create account."}finally{this._loading=!1}}render(){return s`
      <div class="shell">
        <form class="card" @submit=${this._submit}>
          <div class="header-row">
            <div class="eyebrow">${d("product",this._lang)}</div>
            <div class="lang">
              <button class="btn ${this._lang==="es"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>O("es")}>ES</button>
              <button class="btn ${this._lang==="en"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>O("en")}>EN</button>
            </div>
          </div>
          <h1>${d("signUp",this._lang)}</h1>
          <p>${d("signUpSubtitle",this._lang)}</p>
          <div class="grid">
            <label class="field">
              <span class="label">${d("fullName",this._lang)}</span>
              <input class="input" .value=${this._fullName} @input=${e=>this._fullName=e.target.value} />
            </label>
            <label class="field">
              <span class="label">${d("workspaceName",this._lang)}</span>
              <input class="input" .value=${this._tenantName} @input=${e=>this._tenantName=e.target.value} />
            </label>
            <label class="field full">
              <span class="label">${d("email",this._lang)}</span>
              <input class="input" type="email" autocomplete="email" .value=${this._email} @input=${e=>this._email=e.target.value} />
            </label>
            <label class="field full">
              <span class="label">${d("password",this._lang)}</span>
              <input class="input" type="password" autocomplete="new-password" .value=${this._password} @input=${e=>this._password=e.target.value} />
            </label>
          </div>
          ${this._error?s`<div class="error">${this._error}</div>`:""}
          <div class="footer">
            <a class="link" @click=${()=>A.navigate("sign-in")}>${d("alreadyHave",this._lang)} ${d("signInLink",this._lang)}</a>
            <button class="btn btn-primary" type="submit" ?disabled=${this._loading}>
              ${this._loading?d("creatingWorkspace",this._lang):d("createWorkspace",this._lang)}
            </button>
          </div>
        </form>
      </div>
    `}}customElements.define("sign-up-view",Ea);class za extends h{static properties={_email:{type:String,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_result:{type:Object,state:!0},_lang:{type:String,state:!0}};static styles=[T,m`
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
  `];constructor(){super(),this._email="",this._loading=!1,this._error="",this._result=null,this._lang=z()}connectedCallback(){super.connectedCallback(),this._langHandler=()=>{this._lang=z()},window.addEventListener("capintel-lang-changed",this._langHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-lang-changed",this._langHandler)}async _submit(e){e.preventDefault(),this._loading=!0,this._error="";try{this._result=await Ht({email:this._email.trim()})}catch(t){this._error=t?.data?.detail||t.message||"Request failed."}finally{this._loading=!1}}render(){return s`
      <div class="wrap">
        <form class="card" @submit=${this._submit}>
          <div class="header-row">
            <div>${d("product",this._lang)}</div>
            <div class="lang">
              <button class="btn ${this._lang==="es"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>O("es")}>ES</button>
              <button class="btn ${this._lang==="en"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>O("en")}>EN</button>
            </div>
          </div>
          <h1>${d("forgot",this._lang)}</h1>
          <p>${d("forgotSubtitle",this._lang)}</p>
          <label class="field">
            <span class="label">${d("email",this._lang)}</span>
            <input class="input" type="email" .value=${this._email} @input=${e=>this._email=e.target.value} />
          </label>
          <button class="btn btn-primary" type="submit" ?disabled=${this._loading}>
            ${this._loading?d("sendingRecovery",this._lang):d("sendRecovery",this._lang)}
          </button>
          ${this._result?s`
            <div class="note">
              ${this._result.message}
              <div class="linkbox">${d("localRecovery",this._lang)}</div>
              ${this._result.resetUrl?s`<div class="linkbox"><a href="${this._result.resetUrl}">${this._result.resetUrl}</a></div>`:""}
            </div>
          `:""}
          ${this._error?s`<div class="error">${this._error}</div>`:""}
          <div style="margin-top:16px;">
            <button class="btn btn-ghost" type="button" @click=${()=>A.navigate("sign-in")}>${d("backToSignIn",this._lang)}</button>
          </div>
        </form>
      </div>
    `}}customElements.define("forgot-password-view",za);class Ra extends h{static properties={_token:{type:String,state:!0},_password:{type:String,state:!0},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_success:{type:String,state:!0},_lang:{type:String,state:!0}};static styles=[T,m`
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
  `];constructor(){super();const e=new URLSearchParams(window.location.hash.split("?")[1]||"");this._token=e.get("token")||"",this._password="",this._loading=!1,this._error="",this._success="",this._lang=z()}connectedCallback(){super.connectedCallback(),this._langHandler=()=>{this._lang=z()},window.addEventListener("capintel-lang-changed",this._langHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("capintel-lang-changed",this._langHandler)}async _submit(e){e.preventDefault(),this._loading=!0,this._error="",this._success="";try{const t=await Gt({resetToken:this._token,newPassword:this._password});this._success=t.message}catch(t){this._error=t?.data?.detail||t.message||"Reset failed."}finally{this._loading=!1}}render(){return s`
      <div class="wrap">
        <form class="card" @submit=${this._submit}>
          <div class="header-row">
            <div>${d("product",this._lang)}</div>
            <div class="lang">
              <button class="btn ${this._lang==="es"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>O("es")}>ES</button>
              <button class="btn ${this._lang==="en"?"btn-primary":"btn-ghost"}" type="button" @click=${()=>O("en")}>EN</button>
            </div>
          </div>
          <h1>${d("reset",this._lang)}</h1>
          <p>${d("resetSubtitle",this._lang)}</p>
          <label class="field">
            <span class="label">${d("newPassword",this._lang)}</span>
            <input class="input" type="password" .value=${this._password} @input=${e=>this._password=e.target.value} />
          </label>
          <button class="btn btn-primary" type="submit" ?disabled=${this._loading||!this._token}>
            ${this._loading?d("updatingPassword",this._lang):d("updatePassword",this._lang)}
          </button>
          ${this._success?s`<div class="msg">${this._success}</div>`:""}
          ${this._error?s`<div class="error">${this._error}</div>`:""}
          <div style="margin-top:16px;">
            <button class="btn btn-ghost" type="button" @click=${()=>A.navigate("sign-in")}>${d("backToSignIn",this._lang)}</button>
          </div>
        </form>
      </div>
    `}}customElements.define("reset-password-view",Ra);
