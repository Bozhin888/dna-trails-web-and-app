/* DNA Trails prototype 2: shell (header, footer, router, prototype guide) */
(function(){
const A=window.APP, D=window.DNA, ic=A.ic, esc=A.esc, S=A.state, $=A.$, $$=A.$$, R=A.routes;

const NAV=[['trails','Trails'],['how-it-works','How it works'],['hosts','Hosts'],['roots','Roots Trail'],['map','The map'],['our-dna','Our DNA']];
const GROUP={trail:'trails','trip-it-yourself':'trails',guarantee:'how-it-works'};

A.refreshHead=()=>{
  const cur=A.current||{}; const sec=GROUP[cur.base]||cur.base; const u=S.user; const live=A.mine().filter(p=>p.stage!=='done');
  $('#head').innerHTML=`<div class="wrap">
   <a class="brand" href="#home" aria-label="DNA Trails home"><img src="assets/logo/logo-color.svg" alt="DNA Trails"></a>
   <nav class="nav" id="nav" aria-label="Main">${NAV.map(n=>`<a href="#${n[0]}" ${sec===n[0]?'aria-current="page"':''}>${n[1]}</a>`).join('')}</nav>
   <div class="head-actions">
    <a class="passbtn${u?' in':''}" href="#profile" aria-label="${u?'Your profile, '+live.length+' trails coming up':'Sign in'}" ${cur.base==='profile'?'aria-current="page"':''}>${u?`<span class="av">${esc(A.initial(u))}</span><span class="t">${esc(u.name.split(' ')[0])}</span>`:`${ic('user')}<span class="t">Sign in</span>`}${live.length?`<span class="n">${live.length}</span>`:''}</a>
    <button class="iconbtn menu-btn" id="menuBtn" aria-label="Menu" aria-expanded="false">${ic('menu')}</button>
   </div></div>`;
};

const foot=()=>`<div class="wrap">
  <div><a href="#home"><img class="flogo" src="assets/logo/logo-white.svg" alt="DNA Trails"></a><p class="slogan">Hidden stories. Forgotten flavors. Roads less traveled.</p></div>
  <nav class="fcols" aria-label="Footer">
   <div><b>Trails</b><a href="#trails">All trails</a><a href="#trip-it-yourself">Trip-it-Yourself</a><a href="#roots">Roots Trail</a><a href="#map">The map</a></div>
   <div><b>The promise</b><a href="#how-it-works">How it works</a><a href="#guarantee">Works or it's free</a><a href="#hosts">Hosts</a><a href="#faqs">FAQs</a></div>
   <div><b>Your trip</b><a href="#profile">Profile</a><a href="#passport">Passport</a><a href="#contact">Contact</a></div>
   <div><b>DNA Trails</b><a href="#our-dna">Our DNA</a><a href="#partners">For partners</a><a href="#terms">Terms and guarantee</a><a href="#privacy">Privacy</a><a href="#credits">Credits</a></div>
  </nav>
  <div class="legal"><span>© 2027 DNA Trails. Exploration is in our DNA.</span><span>We do not take bookings or commission. You pay hosts directly. We just call ahead.</span></div>
 </div>`;

/* ---------- router ---------- */
const PREFIX=['trail','pass','road','app'];
A.parseHash=h=>{ h=(h||'').replace(/^#/,'')||'home'; if(h==='my-trails') h='profile'; if(R[h]) return {base:h,id:null,hash:h}; const m=h.match(/^([a-z]+)-(.+)$/); if(m&&PREFIX.includes(m[1])&&R[m[1]]) return {base:m[1],id:m[2],hash:h}; return {base:'lost',id:null,hash:h}; };
let lastHash=null;
A.render=()=>{
  const c=A.parseHash(location.hash); A.current=c; A.closeModal(); if(A.cleanup){ try{A.cleanup();}catch(_){} A.cleanup=null; }
  let page; try{ page=c.id!=null?R[c.base](c.id):R[c.base](); }catch(err){ console.error(err); page={title:'Something broke',html:`<section class="section"><div class="wrap empty"><h1>This page took a wrong turn</h1><p class="muted">${esc(err.message)}</p><a class="btn" href="#home">Back to the start</a></div></section>`}; }
  const app=$('#app'); app.innerHTML=page.html; document.body.classList.toggle('road',!!page.road); document.body.classList.toggle('appfull',!!page.appfull);
  document.title=(page.title&&page.title!=='DNA Trails'?page.title+' · ':'')+'DNA Trails';
  A.refreshHead();
  if(page.init){ try{ page.init(); }catch(err){ console.error(err); } }
  if(lastHash!==c.hash){ window.scrollTo(0,0); const h1=app.querySelector('h1'); if(h1&&lastHash!==null){ h1.setAttribute('tabindex','-1'); try{h1.focus({preventScroll:true});}catch(_){} } }
  lastHash=c.hash;
};
A.go=h=>{ if(location.hash==='#'+h) A.render(); else location.hash=h; };
window.addEventListener('hashchange',A.render);

document.addEventListener('click',e=>{
  const mb=e.target.closest('#menuBtn'); const nav=$('#nav');
  if(mb){ const open=!nav.classList.contains('open'); nav.classList.toggle('open',open); mb.setAttribute('aria-expanded',open); return; }
  if(nav&&nav.classList.contains('open')&&(e.target.closest('#nav a')||!e.target.closest('#nav'))) nav.classList.remove('open');
  const a=e.target.closest('a[href^="#"]'); if(a&&a.getAttribute('href')===location.hash&&!a.dataset.soon) window.scrollTo({top:0,behavior:'smooth'});
});

/* ---------- prototype guide ---------- */
A.sitemapModal=()=>{ const live=S.passes.find(p=>p.stage!=='done')||S.passes[0]; const done=S.passes.find(p=>p.stage==='done');
 const MAP=[
  ['The five screens',[['trails','1. Trail shelf'],['trail-tikves','2. Trail page with buy button'],[live?'pass-'+live.code:'my-trails','3. Your dated trail with stamps'],[live?'road-'+live.code:'my-trails','4. On the road (offline view)'],['passport','5. Passport']]],
  ['Around them',[['home','Home'],['how-it-works','How it works'],['guarantee','Works or it\'s free'],['hosts','Hosts'],['map','The map (one page)'],[done?'pass-'+done.code:'my-trails','A finished trail and its receipt']]],
  ['Profile and payment',[['profile','Profile (the one account page)'],['trail-kratovo','Sign up and pay: press "Get this pass"']]],
  ['Mobile app',[['app','All app screens'],['app-welcome','Click through the app']]],
  ['Other trail types',[['trip-it-yourself','Trip-it-Yourself composer'],['roots','Roots Trail'],['trail-galicnik','Quick Quest example'],['trail-prespa','Four-day trail example']]],
  ['Brand and small print',[['our-dna','Our DNA'],['partners','For partners'],['faqs','FAQs'],['contact','Contact'],['terms','Terms and guarantee'],['privacy','Privacy'],['credits','Credits and sources'],['lost','Page not found']]]
 ]; const n=MAP.reduce((a,s)=>a+s[1].length,0);
 A.modal(`<div class="stack-sm"><span class="eyebrow">Prototype guide</span><h2>${n} screens, all clickable</h2>
  <p class="small muted">The prototype's clock is stopped at <b>Friday 14 May 2027, 19:10</b>, two weeks after launch, on the evening the calls go out for Saturday's trails. Hosts, call notes, road notes and availability are sample content. Nothing is charged and nothing leaves this browser.</p></div>
  <div class="sitemap">${MAP.map(s=>`<section><h4>${s[0]}</h4>${s[1].map(p=>`<a href="#${p[0]}" data-close>${esc(p[1])}</a>`).join('')}</section>`).join('')}</div>
  <hr class="perf"><div class="row"><button class="btn sm outline" id="pbReset">${ic('trash')}Reset demo data</button><span class="small muted">Signs you out and clears anything you bought.</span></div>`,'wide'); };
document.addEventListener('click',e=>{
  if(e.target.closest('#pbOpen')){ A.sitemapModal(); return; }
  if(e.target.closest('#pbReset')){ A.store.clear(); S.ui={}; A.closeModal(); A.go('home'); A.toast('Demo data reset'); return; }
});

/* ---------- boot ---------- */
A.defs();
$('#foot').innerHTML=foot();
A.render();
})();
