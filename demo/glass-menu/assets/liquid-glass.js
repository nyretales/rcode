/* Demo guard for the public demo pages on arungpalakka.com: shows a "Demo" badge, and on any other site
 * covers the page with an "unlicensed demo" notice. Not included in the kits people buy. */
(() => {
  const h = location.hostname;
  const ok = /(^|\.)R•CODE\.studio$/.test(h) || /(^|\.)(lovable\.app|lovableproject\.com)$/.test(h) || h === "localhost" || h === "127.0.0.1";
  const run = () => {
    const a = document.createElement("a");
    a.href = "../../shop.html";
    a.textContent = ok ? "Demo · arungpalakka.com/shop" : "Unlicensed demo — get Glass UI at arungpalakka.com/shop";
    // on our own site the badge sits at the end of the page, so it never covers the demo; elsewhere it is pinned on top
    a.style.cssText = (ok ? "display:table;margin:28px auto 24px;position:relative;" : "position:fixed;z-index:2147483647;left:50%;bottom:16px;transform:translateX(-50%);") + "padding:10px 18px;border-radius:999px;font:600 13px system-ui,sans-serif;color:#fff;background:rgba(10,10,20,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.3);text-decoration:none;white-space:nowrap";
    document.body.append(a);
    if (!ok) {
      const o = document.createElement("div");
      o.style.cssText = "position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,.45);backdrop-filter:blur(8px) grayscale(1);-webkit-backdrop-filter:blur(8px) grayscale(1)";
      document.body.append(o);
    }
  };
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", run) : run();
})();

(function(e){Object.defineProperty(e,Symbol.toStringTag,{value:`Module`});
/*!
* <glass-nav> — Glass Menus Pro by R•CODE IMAGINATION (https://arungpalakka.com)
* One custom element for the Glass Menus sets (Liquid Glass, Aurora & Motion, Mobile & Floating). No dependencies.
* Build-time flags __SET1__/__SET2__/__SET3__ keep only the menus of the set you bought (see build.sh).
*
* <glass-nav variant="lens|bounce|wave|spotlight|fab" theme="light|dark" active="0">
*   <a href="/" data-icon="home">Home</a>
*   <a href="/likes" data-icon="heart">Likes</a>
* </glass-nav>
*
* Emits "glass-nav-change" with detail { index, href, label } when a tab is chosen.
* Theme with CSS custom properties on the element: --gn-tint, --gn-border, --gn-text,
* --gn-accent, --gn-blur, --gn-item-width.
*/
let t={home:`<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>`,heart:`<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>`,plus:`<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/>`,user:`<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>`,bell:`<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>`,search:`<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>`,cart:`<path d="M3 4h2l2.4 11h10.2L20 8H6.2"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>`,chat:`<path d="M4 5h16v11H9l-5 4z"/>`,settings:`<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>`,grid:`<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>`},n=(e,n)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${n||t[e]||t.grid}</svg>`;function r(e,t,n,r,i,a){let o=n,s=e-n;if(!a)return`M${o},0 L${s},0 A${n},${n} 0 0 1 ${s},${t} L${o},${t} A${n},${n} 0 0 1 ${o},0 Z`;let c=Math.max(32,Math.min(e-32,r)),l=Math.min(i,2*(c-4),2*(e-c-4));a*=Math.min(1,l/i*1.15);let u=c-l/2,d=c+l/2,f=l*.28,p=e=>e<o?t/2-Math.sqrt(Math.max(0,n*n-(e-o)**2)):e>s?t/2-Math.sqrt(Math.max(0,n*n-(e-s)**2)):0,m=p(u),h=p(d),g=`M${u},${m} C${u+f},${m} ${c-l*.22},${-a} ${c},${-a} C${c+l*.22},${-a} ${d-f},${h} ${d},${h}`;return g+=d<=s?` L${s},0 A${n},${n} 0 0 1 ${s},${t}`:` A${n},${n} 0 0 1 ${s},${t}`,g+=` L${o},${t}`,g+=u>=o?` A${n},${n} 0 0 1 ${o},0 L${u},${m}`:` A${n},${n} 0 0 1 ${u},${m}`,g+` Z`}var i=class extends HTMLElement{static observedAttributes=[`active`,`variant`,`theme`];connectedCallback(){this.shadowRoot||this.attachShadow({mode:`open`}),document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>this.render(),{once:!0}):this.render(),this.mo??=new MutationObserver(()=>{clearTimeout(this.mt),this.mt=setTimeout(()=>this.isConnected&&this.render(),0)}),this.mo.observe(this,{childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:[`href`,`data-icon`,`data-svg`]})}disconnectedCallback(){cancelAnimationFrame(this.raf),this.ro?.disconnect(),this.mo?.disconnect()}attributeChangedCallback(e,t,n){!this.isConnected||t===n||!this.items||(e===`active`?this.select(+n||0,!1):this.render())}render(){cancelAnimationFrame(this.raf),this.ro?.disconnect();let e=this.getAttribute(`variant`)||`lens`;({lens:!0,bounce:!0,wave:!0,spotlight:!0,fab:!0,aurora:!1,magnetic:!1,morph:!1,underline:!1,gradient:!1,split:!1,tabbar:!1,dock:!1,radial:!1,sheet:!1,rail:!1,searchbar:!1})[e]||console.warn(`<glass-nav>: variant "${e}" is not part of this Glass Menus set.`);let t=[...this.querySelectorAll(`:scope > a`)];this.shadowRoot.innerHTML=`<style>
:host{--gn-tint:rgba(255,255,255,.14);--gn-border:rgba(255,255,255,.28);--gn-text:#fff;--gn-accent:#7fffe0;--gn-blur:18px;--gn-item-width:clamp(52px,calc((100vw - 110px) / var(--gn-n,5)),84px);
  display:inline-block;font-family:inherit;color:var(--gn-text);-webkit-tap-highlight-color:transparent}
:host([theme=dark]){--gn-tint:rgba(20,22,31,.5);--gn-border:rgba(255,255,255,.14)}
nav{position:relative;display:flex;gap:4px;padding:8px;border-radius:999px;background:var(--gn-tint);
  backdrop-filter:blur(var(--gn-blur)) saturate(170%);-webkit-backdrop-filter:blur(var(--gn-blur)) saturate(170%);
  border:1px solid var(--gn-border);box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 20px 50px rgba(0,0,0,.25);touch-action:none}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){nav{background:rgba(30,32,44,.88)}}
nav::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(180px 80px at var(--mx,50%) var(--my,0%),rgba(255,255,255,.3),transparent 70%);opacity:var(--glow,0);transition:opacity .3s}
a{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:4px;width:var(--gn-item-width);padding:10px 0;color:inherit;text-decoration:none;font-size:12px;font-weight:500;cursor:pointer;user-select:none;border-radius:999px;outline:none;transition:transform .35s}
a:focus-visible{box-shadow:0 0 0 2px var(--gn-accent)}
a svg,.bub svg,.fabbtn svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;transition:transform .35s cubic-bezier(.3,1.6,.5,1),opacity .2s}
a[aria-current=page] svg{transform:translateY(-2px) scale(1.12)}
a.under svg{opacity:0}
.lens{position:absolute;z-index:1;top:8px;bottom:8px;left:0;width:var(--gn-item-width);border-radius:999px;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.38),rgba(255,255,255,.12));
  backdrop-filter:blur(4px) brightness(1.15) saturate(190%);-webkit-backdrop-filter:blur(4px) brightness(1.15) saturate(190%);border:1px solid rgba(255,255,255,.45);box-shadow:inset 0 1px 1px rgba(255,255,255,.9),0 6px 18px rgba(0,0,0,.18)}
:host([theme=dark]) .lens{background:linear-gradient(180deg,color-mix(in srgb,var(--gn-accent) 28%,transparent),color-mix(in srgb,var(--gn-accent) 6%,transparent));border-color:color-mix(in srgb,var(--gn-accent) 60%,transparent);box-shadow:0 0 24px color-mix(in srgb,var(--gn-accent) 45%,transparent),inset 0 1px 1px rgba(255,255,255,.6)}
:host([variant=bounce]){padding-top:80px}
.bub{position:absolute;z-index:3;top:0;left:0;width:64px;height:64px;border-radius:50%;pointer-events:none;display:flex;align-items:center;justify-content:center;opacity:0;
  background:linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,.16));backdrop-filter:blur(10px) saturate(180%);-webkit-backdrop-filter:blur(10px) saturate(180%);
  border:1px solid rgba(255,255,255,.65);box-shadow:inset 0 2px 2px rgba(255,255,255,.9),0 14px 28px rgba(0,0,0,.25)}
.bub svg{width:28px;height:28px;stroke-width:1.8}
.dot{position:absolute;bottom:4px;left:0;width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.9}
:host([variant=wave]),:host([variant=fab]){padding-top:40px}
:host([variant=wave]) nav,:host([variant=fab]) nav{background:none;border:none;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none}
:host([variant=wave]) nav::before,:host([variant=fab]) nav::before{display:none}
.glassfill{position:absolute;inset:0;border-radius:999px;backdrop-filter:blur(var(--gn-blur)) saturate(160%);-webkit-backdrop-filter:blur(var(--gn-blur)) saturate(160%);z-index:-1}
.shape{position:absolute;inset:-40px -2px -2px -2px;width:calc(100% + 4px);height:calc(100% + 42px);pointer-events:none;overflow:visible;z-index:0}
.cone{position:absolute;top:0;left:0;width:120px;height:100%;pointer-events:none;border-radius:999px;background:radial-gradient(60px 46px at 50% 0%,color-mix(in srgb,var(--gn-accent) 55%,transparent),transparent 75%)}
.fabbtn{position:absolute;z-index:3;top:0;left:0;width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;pointer-events:none;
  background:linear-gradient(180deg,var(--gn-accent),color-mix(in srgb,var(--gn-accent) 60%,#0a3a33));color:#04161a;box-shadow:0 10px 24px color-mix(in srgb,var(--gn-accent) 40%,transparent),inset 0 1px 1px rgba(255,255,255,.7)}
.fabbtn svg{width:26px;height:26px;stroke-width:2}
/* ---- Set 2 · Aurora & Motion ---- */
.aurora{position:absolute;z-index:0;top:-8px;bottom:-8px;left:0;width:150px;border-radius:999px;pointer-events:none;opacity:.8;
  background:conic-gradient(from 0deg,#ff7ab6,#ffd166,#7fffe0,#2d3dff,#b46bff,#ff7ab6);filter:blur(16px)}
:host([variant=magnetic]) a svg{width:26px;height:26px;transition:none}
:host([variant=magnetic]) a{padding-top:14px}
.goo{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:1}
:host([variant=morph]) a{transition:color .25s}
:host([variant=morph]) a.on{color:#06121a}
.uline{position:absolute;z-index:1;bottom:5px;left:0;height:3px;border-radius:3px;background:var(--gn-accent);box-shadow:0 0 12px var(--gn-accent),0 0 2px var(--gn-accent);pointer-events:none}
:host([variant=underline]) a.on{color:var(--gn-accent)}
:host([variant=gradient]) nav::after{content:"";position:absolute;inset:0;border-radius:inherit;padding:1.5px;pointer-events:none;
  background:conic-gradient(from var(--ang,0deg),#ff7ab6,#ffd166,#7fffe0,#2d3dff,#b46bff,#ff7ab6);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
:host([variant=split]) nav{background:none;border:none;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none;gap:0}
:host([variant=split]) nav::before{display:none}
.seg{position:absolute;z-index:0;top:0;bottom:0;border-radius:999px;pointer-events:none;background:var(--gn-tint);backdrop-filter:blur(var(--gn-blur)) saturate(170%);-webkit-backdrop-filter:blur(var(--gn-blur)) saturate(170%);
  border:1px solid var(--gn-border);box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 16px 40px rgba(0,0,0,.25)}
.seg.on{background:linear-gradient(180deg,color-mix(in srgb,var(--gn-accent) 40%,rgba(255,255,255,.2)),color-mix(in srgb,var(--gn-accent) 10%,transparent));border-color:color-mix(in srgb,var(--gn-accent) 70%,transparent);box-shadow:0 0 26px color-mix(in srgb,var(--gn-accent) 45%,transparent),inset 0 1px 1px rgba(255,255,255,.7)}
/* ---- Set 3 · Mobile & Floating ---- */
:host([variant=tabbar]){--gn-item-width:clamp(52px,calc((100vw - 104px) / var(--gn-n,5)),68px)}
:host([variant=tabbar]) nav{border-radius:30px;padding:8px 8px 24px;gap:2px}
:host([variant=tabbar]) nav::after{content:"";position:absolute;left:50%;bottom:8px;width:110px;height:4px;margin-left:-55px;border-radius:4px;background:currentColor;opacity:.45}
:host([variant=tabbar]) .lens{border-radius:20px;bottom:24px}
:host([variant=tabbar]) a{font-size:11px;border-radius:20px}
:host([variant=tabbar]) a[aria-current=page]{color:var(--gn-accent)}
:host([variant=dock]){--gn-item-width:clamp(48px,calc((100vw - 90px) / var(--gn-n,5)),58px);padding-top:22px}
:host([variant=dock]) a span,:host([variant=rail]) a span.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
:host([variant=dock]) a{padding:14px 0}
:host([variant=dock]) .lens{border-radius:50%;width:48px;height:48px;top:50%;margin-top:-24px;bottom:auto}
:host([variant=dock]) a.center{z-index:3}
:host([variant=dock]) a.center::before{content:"";position:absolute;left:50%;top:50%;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;z-index:-1;transform:translateY(-16px);
  background:linear-gradient(180deg,var(--gn-accent),color-mix(in srgb,var(--gn-accent) 55%,#0a2a3a));box-shadow:0 12px 26px color-mix(in srgb,var(--gn-accent) 45%,transparent),inset 0 1px 1px rgba(255,255,255,.7)}
:host([variant=dock]) a.center svg{color:#06121a;transform:translateY(-16px);width:26px;height:26px;stroke-width:2}
.wrap{position:relative}
.fabmain{position:relative;z-index:4;width:64px;height:64px;border-radius:50%;border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#06121a;
  background:linear-gradient(180deg,var(--gn-accent),color-mix(in srgb,var(--gn-accent) 55%,#0a2a3a));box-shadow:0 14px 30px color-mix(in srgb,var(--gn-accent) 45%,transparent),inset 0 1px 1px rgba(255,255,255,.8)}
.fabmain svg{width:28px;height:28px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round}
.fabmain:focus-visible,.burger:focus-visible{outline:2px solid var(--gn-accent);outline-offset:3px}
:host([variant=radial]) nav{position:absolute;inset:0;background:none;border:none;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none;padding:0}
:host([variant=radial]) nav::before{display:none}
:host([variant=radial]) a{position:absolute;left:0;top:0;width:58px;height:58px;padding:0;justify-content:center;border-radius:50%;
  background:linear-gradient(180deg,rgba(255,255,255,.42),rgba(255,255,255,.12));backdrop-filter:blur(12px) saturate(180%);-webkit-backdrop-filter:blur(12px) saturate(180%);
  border:1px solid rgba(255,255,255,.6);box-shadow:inset 0 1px 1px rgba(255,255,255,.9),0 12px 26px rgba(0,0,0,.25)}
:host([variant=radial]) a span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.burger{position:relative;z-index:4;width:56px;height:56px;border-radius:50%;cursor:pointer;color:inherit;display:flex;align-items:center;justify-content:center;
  background:var(--gn-tint);backdrop-filter:blur(var(--gn-blur)) saturate(170%);-webkit-backdrop-filter:blur(var(--gn-blur)) saturate(170%);border:1px solid var(--gn-border);box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 14px 34px rgba(0,0,0,.25)}
.burger i{position:absolute;left:18px;width:20px;height:2px;border-radius:2px;background:currentColor}
:host([variant=sheet]) nav{position:absolute;top:68px;left:0;width:300px;flex-direction:column;align-items:stretch;gap:2px;padding:14px;border-radius:28px;transform-origin:28px 0}
:host([variant=sheet]) a{flex-direction:row;justify-content:flex-start;gap:14px;width:auto;padding:12px 14px;font-size:20px;font-weight:600;border-radius:16px}
:host([variant=sheet]) a[aria-current=page]{background:rgba(255,255,255,.16);color:var(--gn-accent)}
:host([variant=rail]) nav{flex-direction:column;border-radius:34px;padding:8px}
:host([variant=rail]) a{width:56px;height:56px;padding:0;justify-content:center}
:host([variant=rail]) a .tip{position:absolute;left:100%;margin-left:16px;padding:7px 12px;border-radius:999px;font-size:12px;white-space:nowrap;pointer-events:none;opacity:0;transform:translateX(-6px);transition:opacity .2s,transform .2s;
  background:var(--gn-tint);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--gn-border)}
:host([variant=rail]) a.hov .tip{opacity:1;transform:none}
:host([variant=rail]) .lens{top:0;left:8px;right:8px;width:auto;height:56px;bottom:auto}
:host([variant=rail]) a[aria-current=page]{color:var(--gn-accent)}
:host([variant=searchbar]){--gn-item-width:clamp(46px,calc((100vw - 170px) / var(--gn-n,4)),84px)}
:host([variant=searchbar]) nav{align-items:center}
.sbox{position:relative;z-index:2;height:44px;margin-left:6px;border-radius:999px;display:flex;align-items:center;overflow:hidden;cursor:text;
  background:rgba(255,255,255,.14);border:1px solid var(--gn-border)}
.sbox svg{flex:none;width:20px;height:20px;margin:0 12px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round}
.sbox input{flex:1;min-width:0;border:0;outline:0;background:none;color:inherit;font:inherit;font-size:15px}
.sbox input::placeholder{color:currentColor;opacity:.6}
:host([variant=searchbar]) a{transition:none}
</style><nav aria-label="${this.getAttribute(`label`)||`Main`}">${t.map(e=>`<a href="${e.getAttribute(`href`)||`#`}">${n(e.dataset.icon,e.dataset.svg)}<span>${e.textContent.trim()}</span></a>`).join(``)}</nav>`;let i=this.nav=this.shadowRoot.querySelector(`nav`),a=this.items=[...i.querySelectorAll(`a`)];if(this.style.setProperty(`--gn-n`,String(a.length||5)),!a.length)return;let o=matchMedia(`(prefers-reduced-motion: reduce)`).matches||this.hasAttribute(`reduce-motion`),s=e=>a[e].offsetLeft+a[e].offsetWidth/2,c=e=>a.reduce((t,n,r)=>Math.abs(s(r)-e)<Math.abs(s(t)-e)?r:t,0),l=e=>{let t=i.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top,w:t.width}},u=Math.min(a.length-1,+this.getAttribute(`active`)||0),d=0,f=0,p=0,m=!1,h=0,g=0,_=u;this.select=(e,t=!0)=>{u=e,a.forEach((t,n)=>n===e?t.setAttribute(`aria-current`,`page`):t.removeAttribute(`aria-current`)),t&&this.dispatchEvent(new CustomEvent(`glass-nav-change`,{bubbles:!0,composed:!0,detail:{index:e,href:a[e].getAttribute(`href`),label:a[e].textContent}}))},this.select(u,!1),a.forEach((e,t)=>{e.addEventListener(`click`,n=>{let r=new CustomEvent(`glass-nav-click`,{cancelable:!0,bubbles:!0,composed:!0,detail:{index:t,href:e.getAttribute(`href`)}});this.select(t),(!this.dispatchEvent(r)||this.hasAttribute(`no-navigate`))&&n.preventDefault()}),e.addEventListener(`keydown`,e=>{let n={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];if(n){e.preventDefault();let r=(t+n+a.length)%a.length;a[r].focus(),_=r,p=s(r)}(e.key===`Home`||e.key===`End`)&&(e.preventDefault(),a[e.key===`Home`?0:a.length-1].focus())}),e.addEventListener(`focus`,()=>{m||(_=t,p=s(t))})}),i.addEventListener(`pointermove`,t=>{let n=l(t);m=!0,_=c(n.x),p=e===`lens`?Math.max(s(0),Math.min(s(a.length-1),n.x)):s(_),i.style.setProperty(`--mx`,n.x+`px`),i.style.setProperty(`--my`,n.y+`px`),i.style.setProperty(`--glow`,1),g=(n.x/n.w-.5)*8});let v=()=>{m=!1,_=u,p=s(u),g=0,i.style.setProperty(`--glow`,0)};i.addEventListener(`pointerleave`,v),i.addEventListener(`pointerup`,e=>{e.pointerType!==`mouse`&&v()}),i.addEventListener(`focusout`,e=>{i.contains(e.relatedTarget)||v()});let y=()=>{},b=()=>m?_:u;if(i.addEventListener(`pointermove`,e=>l(e).x),i.addEventListener(`pointerleave`,()=>null),e===`lens`){let e=document.createElement(`div`);e.className=`lens`,i.prepend(e),y=()=>{let t=Math.min(.45,Math.abs(f)/40);e.style.transform=`translateX(${d-e.offsetWidth/2}px) scaleX(${1+t}) scaleY(${1-t*.35})`}}if(e===`bounce`){let e=a.map(e=>{let t=document.createElement(`div`);return t.className=`bub`,t.innerHTML=e.querySelector(`svg`).outerHTML,i.appendChild(t),{b:t,y:0,vy:0,s:.5,vs:0}}),t=document.createElement(`div`);t.className=`dot`,i.appendChild(t),y=()=>{e.forEach((e,t)=>{let n=t===b(),r=n?-78:0,c=n?1:.45;e.vy=(e.vy+(r-e.y)*.11)*.8,e.y+=e.vy,e.vs=(e.vs+(c-e.s)*.14)*.72,e.s+=e.vs,o&&(e.y=r,e.s=c,e.vy=0);let l=Math.max(-.22,Math.min(.22,e.vy/30)),u=Math.min(1,Math.max(0,-e.y/30));e.b.style.opacity=u,e.b.style.transform=`translate(${s(t)-32}px,${e.y+i.offsetHeight/2-40}px) scale(${e.s*(1+l*.6)},${e.s*(1-l)})`,a[t].classList.toggle(`under`,u>.35)}),t.style.transform=`translateX(${d-2.5}px)`}}if(e===`wave`||e===`fab`){let t=Math.random().toString(36).slice(2,8),n=document.createElement(`div`);n.className=`glassfill`,i.prepend(n);let o=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);o.setAttribute(`class`,`shape`),o.innerHTML=`<defs><filter id="gl${t}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="4"/></filter></defs><path class="f" fill="rgba(20,22,31,.55)" stroke="rgba(255,255,255,.18)"/>`+(e===`wave`?`<path class="g" fill="none" stroke="var(--gn-accent)" stroke-width="5" opacity=".6" filter="url(#gl${t})"/><path class="s" fill="none" stroke="var(--gn-accent)" stroke-width="2.2"/>`:``),i.prepend(o);let s,c=-1;e===`fab`&&(s=document.createElement(`div`),s.className=`fabbtn`,i.appendChild(s)),y=()=>{let t=i.offsetWidth,n=i.offsetHeight;o.setAttribute(`viewBox`,`-2 -40 ${t+4} ${n+42}`);let l=r(t,n,n/2,d,e===`wave`?120:118,e===`wave`?Math.max(18,30-Math.abs(f)):-34+Math.min(10,Math.abs(f)/2));if(o.querySelectorAll(`path`).forEach(e=>e.setAttribute(`d`,l)),s){let e=b();e!==c&&(s.innerHTML=a[e].querySelector(`svg`).outerHTML,a.forEach((t,n)=>t.classList.toggle(`under`,n===e)),c=e),s.style.transform=`translate(${d-30}px,-30px)`}else a.forEach((e,t)=>e.style.transform=t===b()?`translateY(-14px)`:``)}}if(e===`spotlight`){let e=document.createElement(`div`);e.className=`cone`,i.prepend(e),y=()=>{e.style.transform=`translateX(${d-60}px)`,a.forEach((e,t)=>e.style.filter=t===b()?`drop-shadow(0 0 8px var(--gn-accent))`:``)}}d=p=s(u);let x=()=>{if(!m&&document.activeElement!==this&&(p=s(_===u||!this.matches(`:focus-within`)?u:_)),o)d=p,f=0;else{let e=m?.16:.12,t=m?.72:.68;f=(f+(p-d)*e)*t,d+=f}h+=(g-h)*.12,e===`lens`&&!o&&(i.style.transform=`perspective(700px) rotateY(${h}deg)`),y(performance.now()),this.raf=requestAnimationFrame(x)};x(),this.ro=new ResizeObserver(()=>{d=p=s(u)}),this.ro.observe(i)}};function a(e=`glass-nav`){typeof window<`u`&&!customElements.get(e)&&customElements.define(e,class extends i{})}return a(),e.GlassNav=i,e.defineGlassNav=a,e})({});
(function(e){Object.defineProperty(e,Symbol.toStringTag,{value:`Module`});
/*!
* Glass UI — controls by R•CODE IMAGINATION (https://arungpalakka.com). No dependencies.
* <glass-cta href="/start">Start a project</glass-cta>            bubble-pop letters + light sheen
* <glass-toggle checked label="Dark mode"></glass-toggle>          switch (role="switch"), fires "change"
* <glass-segmented value="video"><button value="design">Design</button>…</glass-segmented>
* <glass-chips multiple><button value="ai">AI</button>…</glass-chips>   filter chips, fires "change"
* <glass-modal id="m" heading="Title">…</glass-modal> + <button data-glass-open="m">  dialog / bottom sheet on mobile
* showGlassToast("Saved", { from: button })                         toast in the nearest data-glass area
* <glass-tooltip text="Copy link"><button>…</button></glass-tooltip>  hover/focus tooltip
* Style follows the nearest data-glass="liquid|aurora|mobile" (see glass-ui.css).
*/
let t=()=>matchMedia(`(prefers-reduced-motion: reduce)`).matches,n=`
:host{--_h:var(--gu-h,44px);--_r:var(--gu-radius,999px);--_acc:var(--gu-accent,#7fffe0);--_ink:var(--gu-accent-ink,#06121a);
  --_tint:var(--gu-tint,rgba(255,255,255,.16));--_bd:var(--gu-border,rgba(255,255,255,.38));--_blur:var(--gu-blur,16px);color:var(--gu-text,#fff);font-family:inherit}
.glass{background:var(--_tint);border:1px solid var(--_bd);backdrop-filter:blur(var(--_blur)) saturate(170%);-webkit-backdrop-filter:blur(var(--_blur)) saturate(170%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 10px 26px -12px rgba(0,0,0,.45)}
.ring{position:absolute;inset:-1px;border-radius:inherit;padding:1.5px;pointer-events:none;background:var(--gu-ring,none);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
:focus-visible{outline:2px solid var(--_acc);outline-offset:3px}
`;function r(e,t){typeof window<`u`&&!customElements.get(e)&&customElements.define(e,t)}var i=class extends HTMLElement{connectedCallback(){if(this.shadowRoot)return;let e=()=>this.build();document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e()}build(){let e=this.textContent.trim(),t=this.getAttribute(`href`),r=this.attachShadow({mode:`open`}),i=t?`a`:`button`;r.innerHTML=`<style>${n}
      ${i}{position:relative;display:inline-flex;align-items:center;gap:8px;min-height:calc(var(--_h) + 4px);padding:0 calc(var(--gu-pad,20px) + 6px);border-radius:var(--_r);overflow:hidden;
        font:600 var(--gu-font,15px)/1 inherit;letter-spacing:.02em;color:#fff;text-decoration:none;cursor:pointer;border:1px solid color-mix(in srgb,var(--_acc) 60%,#fff);
        background:linear-gradient(180deg,color-mix(in srgb,var(--_acc) 75%,#fff) 0%,var(--_acc) 55%,color-mix(in srgb,var(--_acc) 70%,#000) 100%);
        color:var(--_ink);box-shadow:inset 0 1px 0 rgba(255,255,255,.5),inset 0 -6px 14px rgba(0,0,0,.18),0 0 26px color-mix(in srgb,var(--_acc) 40%,transparent),0 14px 30px -14px rgba(0,0,0,.6);
        transition:transform .3s cubic-bezier(.3,1.6,.5,1)}
      ${i}:hover{transform:translateY(-2px)}
      ${i}::before{content:"";position:absolute;inset:1px 8% 55% 8%;border-radius:999px;background:linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0));pointer-events:none}
      .sheen{position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.45) 48%,rgba(255,255,255,.1) 52%,transparent 62%);background-size:260% 100%;animation:sh 5s ease-in-out infinite}
      @keyframes sh{0%,60%{background-position:140% 0}100%{background-position:-60% 0}}
      .l{display:inline-block;animation:pop 6s cubic-bezier(.3,1.6,.5,1) infinite both}
      @keyframes pop{0%{opacity:0;transform:translateY(12px) scale(.3)}5%{opacity:1;transform:translateY(-7px) scale(1.18)}8%{transform:none}88%{opacity:1;transform:none}94%{opacity:0;transform:translateY(6px) scale(.6)}100%{opacity:0;transform:translateY(12px) scale(.3)}}
      @media (prefers-reduced-motion:reduce){.l,.sheen{animation:none}}
    </style><${i} part="button" ${t?`href="${t}"`:`type="button"`} aria-label="${e.replace(/"/g,`&quot;`)}"><span class="ring"></span><span class="sheen"></span><span aria-hidden="true">${[...e,` `,`→`].map((e,t)=>`<span class="l" style="animation-delay:${(t*.06).toFixed(2)}s">${e===` `?`&nbsp;`:e}</span>`).join(``)}</span></${i}>`}},a=class extends HTMLElement{static observedAttributes=[`checked`];get checked(){return this.hasAttribute(`checked`)}set checked(e){this.toggleAttribute(`checked`,!!e)}connectedCallback(){if(this.shadowRoot)return;let e=this.attachShadow({mode:`open`});e.innerHTML=`<style>${n}
      button{position:relative;width:calc(var(--_h) * 1.4);height:calc(var(--_h) * .74);padding:0;border-radius:999px;cursor:pointer;color:inherit}
      button[aria-checked=true]{background:linear-gradient(180deg,color-mix(in srgb,var(--_acc) 85%,#fff),color-mix(in srgb,var(--_acc) 60%,#000));border-color:color-mix(in srgb,var(--_acc) 70%,#fff);box-shadow:0 0 20px color-mix(in srgb,var(--_acc) 45%,transparent),inset 0 1px 0 rgba(255,255,255,.6)}
      .k{position:absolute;top:3px;left:3px;height:calc(100% - 6px);aspect-ratio:1;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.35)}
    </style><button class="glass" role="switch" aria-checked="${this.checked}" aria-label="${this.getAttribute(`label`)||`Toggle`}"><span class="ring"></span><span class="k"></span></button>`,this.btn=e.querySelector(`button`),this.knob=e.querySelector(`.k`),this.btn.addEventListener(`click`,()=>{this.checked=!this.checked,this.dispatchEvent(new Event(`change`,{bubbles:!0}))}),this.p=+!!this.checked,this.v=0,this.loop()}attributeChangedCallback(){this.btn?.setAttribute(`aria-checked`,String(this.checked))}disconnectedCallback(){cancelAnimationFrame(this.raf)}loop(){let e=+!!this.checked;t()?this.p=e:(this.v=(this.v+(e-this.p)*.2)*.65,this.p+=this.v);let n=this.btn.clientWidth-this.knob.offsetWidth-6,r=Math.min(.3,Math.abs(this.v)*3);this.knob.style.transform=`translateX(${this.p*n}px) scaleX(${1+r})`,this.raf=requestAnimationFrame(()=>this.loop())}},o=class extends HTMLElement{connectedCallback(){this.shadowRoot||(document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>this.build(),{once:!0}):this.build())}disconnectedCallback(){cancelAnimationFrame(this.raf)}opts(){return[...this.querySelectorAll(`:scope > button, :scope > [value]`)].map(e=>({value:e.getAttribute(`value`)??e.textContent.trim(),label:e.textContent.trim()}))}},s=class extends o{get value(){return this.getAttribute(`value`)}set value(e){this.setAttribute(`value`,e),this.sync?.()}build(){let e=this.opts(),r=this.attachShadow({mode:`open`});!this.value&&e[0]&&this.setAttribute(`value`,e[0].value),r.innerHTML=`<style>${n}
      .g{position:relative;display:inline-flex;padding:4px;border-radius:var(--_r);gap:2px}
      button{position:relative;z-index:1;min-height:calc(var(--_h) - 8px);padding:0 calc(var(--gu-pad,20px) - 4px);border:0;border-radius:var(--_r);background:none;color:inherit;font:500 var(--gu-font,15px)/1 inherit;cursor:pointer;transition:color .2s}
      button[aria-checked=true]{color:var(--_ink)}
      .lens{position:absolute;top:4px;bottom:4px;left:0;border-radius:var(--_r);background:linear-gradient(180deg,color-mix(in srgb,var(--_acc) 85%,#fff),var(--_acc));box-shadow:0 0 18px color-mix(in srgb,var(--_acc) 40%,transparent),inset 0 1px 0 rgba(255,255,255,.6)}
    </style><div class="g glass" role="radiogroup" aria-label="${this.getAttribute(`label`)||`Options`}"><span class="ring"></span><span class="lens"></span>${e.map(e=>`<button role="radio" data-v="${e.value}">${e.label}</button>`).join(``)}</div>`;let i=[...r.querySelectorAll(`button`)],a=r.querySelector(`.lens`);this.sync=()=>i.forEach(e=>{let t=e.dataset.v===this.value;e.setAttribute(`aria-checked`,t),e.tabIndex=t?0:-1});let o=e=>{this.value=e.dataset.v,e.focus(),this.dispatchEvent(new Event(`change`,{bubbles:!0}))};i.forEach((e,t)=>{e.addEventListener(`click`,()=>o(e)),e.addEventListener(`keydown`,e=>{let n={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];n&&(e.preventDefault(),o(i[(t+n+i.length)%i.length]))})}),this.sync();let s=0,c=0,l=0,u=()=>{let e=i.find(e=>e.dataset.v===this.value)||i[0];t()||!c?(s=e.offsetLeft,c=e.offsetWidth):(l=(l+(e.offsetLeft-s)*.2)*.66,s+=l,c+=(e.offsetWidth-c)*.3),a.style.transform=`translateX(${s}px) scaleY(${1-Math.min(.15,Math.abs(l)/60)})`,a.style.width=`${c}px`,this.raf=requestAnimationFrame(u)};u()}},c=class extends o{get value(){return[...this.shadowRoot.querySelectorAll(`button[aria-pressed=true]`)].map(e=>e.dataset.v)}build(){let e=this.opts(),t=this.attachShadow({mode:`open`}),r=this.hasAttribute(`multiple`),i=new Set((this.getAttribute(`value`)||``).split(`,`).filter(Boolean));t.innerHTML=`<style>${n}
      .g{display:flex;flex-wrap:wrap;gap:8px}
      button{position:relative;min-height:calc(var(--_h) - 8px);padding:0 16px;border-radius:var(--_r);color:inherit;font:500 calc(var(--gu-font,15px) - 1px)/1 inherit;cursor:pointer;
        transition:transform .25s cubic-bezier(.3,1.6,.5,1),background .2s,color .2s}
      button:active{transform:scale(.94)}
      button[aria-pressed=true]{color:var(--_ink);background:linear-gradient(180deg,color-mix(in srgb,var(--_acc) 85%,#fff),var(--_acc));border-color:transparent;box-shadow:0 0 16px color-mix(in srgb,var(--_acc) 40%,transparent)}
    </style><div class="g" role="group" aria-label="${this.getAttribute(`label`)||`Filters`}">${e.map(e=>`<button class="glass" aria-pressed="${i.has(e.value)}" data-v="${e.value}"><span class="ring"></span>${e.label}</button>`).join(``)}</div>`;let a=[...t.querySelectorAll(`button`)];a.forEach(e=>e.addEventListener(`click`,()=>{let t=e.getAttribute(`aria-pressed`)!==`true`;r||a.forEach(e=>e.setAttribute(`aria-pressed`,`false`)),e.setAttribute(`aria-pressed`,String(t)),this.dispatchEvent(new Event(`change`,{bubbles:!0}))}))}},l=class extends HTMLElement{connectedCallback(){if(this.shadowRoot)return;let e=this.attachShadow({mode:`open`});e.innerHTML=`<style>${n}
      dialog{position:fixed;width:min(460px,calc(100vw - 32px));max-height:calc(100vh - 48px);padding:24px;border-radius:28px;color:var(--gu-text,#fff);overflow:auto;
        background:color-mix(in srgb,var(--_tint) 70%,rgba(12,12,24,.55));border:1px solid var(--_bd);backdrop-filter:blur(26px) saturate(170%);-webkit-backdrop-filter:blur(26px) saturate(170%);
        box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 40px 90px -30px rgba(0,0,0,.8)}
      dialog[open]{animation:in .32s cubic-bezier(.3,1.4,.5,1)}
      dialog.out{animation:out .18s ease-in forwards}
      dialog::backdrop{background:rgba(6,6,14,.38);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
      @keyframes in{from{opacity:0;transform:translateY(14px) scale(.94)}}
      @keyframes out{to{opacity:0;transform:translateY(10px) scale(.96)}}
      dialog.sheet{margin:auto auto 0;width:100%;max-width:560px;border-radius:28px 28px 0 0;padding:14px 22px 30px}
      dialog.sheet[open]{animation:up .38s cubic-bezier(.25,1.2,.4,1)} dialog.sheet.out{animation:down .2s ease-in forwards}
      @keyframes up{from{transform:translateY(100%)}} @keyframes down{to{transform:translateY(100%)}}
      .bar{display:none;width:44px;height:5px;margin:0 auto 14px;border-radius:5px;background:currentColor;opacity:.35} .sheet .bar{display:block}
      header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:12px}
      h2{margin:0;font-size:20px;letter-spacing:-.01em}
      .x{width:36px;height:36px;border-radius:50%;border:1px solid var(--_bd);background:rgba(255,255,255,.1);color:inherit;font-size:20px;line-height:1;cursor:pointer}
      @media (prefers-reduced-motion:reduce){dialog,dialog.sheet{animation:none!important}}
    </style><dialog part="dialog" aria-labelledby="t"><span class="ring"></span><div class="bar" aria-hidden="true"></div>
      <header><h2 id="t">${this.getAttribute(`heading`)||``}</h2><button class="x" type="button" aria-label="${this.getAttribute(`close-label`)||`Close`}">×</button></header><slot></slot></dialog>`;let t=this.dlg=e.querySelector(`dialog`);e.querySelector(`.x`).addEventListener(`click`,()=>this.close()),t.addEventListener(`cancel`,e=>{e.preventDefault(),this.close()}),t.addEventListener(`click`,e=>{if(e.target!==t)return;let n=t.getBoundingClientRect();(e.clientX<n.left||e.clientX>n.right||e.clientY<n.top||e.clientY>n.bottom)&&this.close()}),this.opener=e=>{let t=e.target.closest?.(`[data-glass-open]`);t&&t.getAttribute(`data-glass-open`)===this.id&&this.show()},document.addEventListener(`click`,this.opener)}disconnectedCallback(){document.removeEventListener(`click`,this.opener)}get open(){return!!this.dlg?.open}show(){let e=this.closest(`[data-glass]`)?.getAttribute(`data-glass`);this.dlg.classList.remove(`out`),this.dlg.classList.toggle(`sheet`,this.hasAttribute(`sheet`)||e===`mobile`),this.dlg.open||this.dlg.showModal(),this.dispatchEvent(new Event(`open`))}close(){if(!this.dlg.open)return;let e=()=>{this.dlg.classList.remove(`out`),this.dlg.close(),this.dispatchEvent(new Event(`close`))};if(t())return e();this.dlg.classList.add(`out`),setTimeout(e,200)}},u=class extends HTMLElement{connectedCallback(){if(this.shadowRoot)return;let e=this.attachShadow({mode:`open`});e.innerHTML=`<style>${n}
      :host{position:fixed;z-index:1000;right:20px;bottom:20px;display:flex;flex-direction:column;align-items:flex-end;gap:10px;pointer-events:none}
      :host([inline]){position:absolute}
      :host([top]){top:20px;bottom:auto;left:50%;right:auto;translate:-50% 0;align-items:center}
      .t{position:relative;display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:16px;font-size:14px;pointer-events:auto;
        animation:tin .38s cubic-bezier(.3,1.5,.5,1)}
      .t.out{animation:tout .22s ease-in forwards}
      .i{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;font-size:13px;color:var(--_ink);background:var(--_acc);box-shadow:0 0 12px var(--_acc)}
      @keyframes tin{from{opacity:0;transform:translateY(16px) scale(.9)}} @keyframes tout{to{opacity:0;transform:translateY(8px) scale(.95)}}
      @media (prefers-reduced-motion:reduce){.t{animation:none!important}}
    </style><div role="status" aria-live="polite"></div>`,this.box=e.querySelector(`div`)}add(e,{duration:n=2800,icon:r=`✓`}={}){let i=document.createElement(`div`);return i.className=`t glass`,i.innerHTML=`<span class="ring"></span><span class="i" aria-hidden="true"></span><span class="m"></span>`,i.querySelector(`.i`).textContent=r,i.querySelector(`.m`).textContent=e,this.box.append(i),setTimeout(()=>{i.classList.add(`out`),setTimeout(()=>i.remove(),t()?0:230)},n),i}};function d(e,t={}){let n=t.from?.closest?.(`[data-glass]`)||document.querySelector(`[data-glass]`)||document.body,r=n.querySelector(`:scope > glass-toaster`);return r||(r=document.createElement(`glass-toaster`),n.getAttribute?.(`data-glass`)===`mobile`&&r.setAttribute(`top`,``),t.inline&&r.setAttribute(`inline`,``),n.append(r)),r.add(e,t)}let f=0;var p=class extends HTMLElement{connectedCallback(){if(this.tip)return;let e=()=>{let e=this.firstElementChild;if(!e)return;let t=this.tip=document.createElement(`span`);t.className=`gui-tip`,t.role=`tooltip`,t.id=`glass-tip-${++f}`,t.textContent=this.getAttribute(`text`)||``,this.append(t),e.setAttribute(`aria-describedby`,t.id);let n=()=>this.setAttribute(`data-open`,``),r=()=>this.removeAttribute(`data-open`);this.addEventListener(`pointerenter`,n),this.addEventListener(`pointerleave`,r),this.addEventListener(`focusin`,n),this.addEventListener(`focusout`,r),this.addEventListener(`keydown`,e=>e.key===`Escape`&&r())};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e()}};function m(){r(`glass-cta`,i),r(`glass-toggle`,a),r(`glass-segmented`,s),r(`glass-chips`,c),r(`glass-modal`,l),r(`glass-toaster`,u),r(`glass-tooltip`,p),typeof window<`u`&&(window.showGlassToast=d)}return m(),e.GlassChips=c,e.GlassCta=i,e.GlassModal=l,e.GlassSegmented=s,e.GlassToaster=u,e.GlassToggle=a,e.GlassTooltip=p,e.defineGlassControls=m,e.showGlassToast=d,e})({});