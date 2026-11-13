/* DNA Trails: connects the Prototype 2 UI to the real backend (/api).
   Sign-in codes, profile, passes, checkout and road progress go to the server.
   In demo mode (DEMO_MODE=1) the sample account and the prototype guide stay. */
(function(){
const A=window.APP, S=A.state, $=A.$, ic=A.ic, esc=A.esc;
const api=async(path,opts)=>{ const r=await fetch('/api/'+path,Object.assign({headers:{'Content-Type':'application/json'},credentials:'same-origin'},opts||{}, opts&&opts.body?{body:JSON.stringify(opts.body)}:{}));
  let d={}; try{ d=await r.json(); }catch(_){}
  if(!r.ok){ const e=new Error(d.error||'Something went wrong. Try again.'); e.status=r.status; throw e; } return d; };
A.api=api;
let CFG={demo:true}, server=null; // server = the signed-in server user, or null

/* server passes use the user id as owner; the UI matches passes to user.contact */
const toUi=(p,u)=>Object.assign({},p,{owner:u.contact});
const samples=()=>CFG.demo?(A.store.get('passes',[])||[]).filter(p=>p.sample):[];
const adopt=(user,passes)=>{
  server=user||null;
  if(user){ A.store.set('user',Object.assign({},user)); S.passes=samples().concat((passes||[]).filter(p=>p.stage!=='pending').map(p=>toUi(p,user))); }
  else { const cur=S.user; if(cur&&!cur.sample) A.store.set('user',null); S.passes=samples(); }
};

/* ---------- sign in: real codes ---------- */
let pending=null, verified=false;
document.addEventListener('submit',async e=>{
  const f=e.target;
  if(f.id==='auWho'){ // let the prototype validate and move on; send the code alongside
    const name=($('#auName',f)||{}).value||'', contact=($('#auContact',f)||{}).value||'';
    if(!name.trim()||!(/^\S+@\S+\.\S+$/.test(contact.trim())||contact.replace(/\D/g,'').length>=8)) return;
    pending={name:name.trim(),contact:contact.trim()};
    api('auth/start',{method:'POST',body:pending}).then(d=>{ if(d.devCode){ setTimeout(()=>{ const n=document.querySelector('#auCode .small.muted'); if(n) n.innerHTML=`<b>Demo:</b> your code is <b style="font-family:var(--type)">${esc(d.devCode)}</b>. With email set up it arrives by email.`; },30); } })
      .catch(err=>A.toast(esc(err.message)));
    return;
  }
  if(f.id==='auCode'&&!verified){
    e.preventDefault(); e.stopImmediatePropagation();
    const code=(($('#auDigits',f)||{}).value||'').replace(/\D/g,''); if(code.length!==6||!pending){ verified=true; f.requestSubmit(); verified=false; return; }
    try{ const d=await api('auth/verify',{method:'POST',body:Object.assign({code},pending)}); adopt(d.user,d.passes); verified=true; f.requestSubmit(); }
    catch(err){ const er=$('#auErrD',f); if(er){ er.textContent=err.message; er.hidden=false; } }
    finally{ verified=false; }
  }
},true);
/* the prototype builds its own user object after a code; keep the server's instead */
const origSignIn=A.signIn;
A.signIn=u=>{ if(server&&!u.sample) u=Object.assign({},server); origSignIn(u); };
const origSignOut=A.signOut;
A.signOut=()=>{ if(server) api('auth/signout',{method:'POST'}).catch(()=>{}); server=null; origSignOut(); adopt(null); };

/* ---------- profile edits ---------- */
document.addEventListener('submit',e=>{
  if(e.target.id!=='pfForm'||!server) return;
  const name=$('#pfName').value.trim(), contact=$('#pfContact').value.trim();
  setTimeout(()=>{ const u=S.user; api('me',{method:'PATCH',body:{name,contact,car:u.car,lang:u.lang}}).then(d=>adopt(d.user,null)).catch(err=>{ A.toast(esc(err.message)); }); },0);
},true);
document.addEventListener('click',e=>{
  if(e.target.closest('#pfCardOff')&&server) api('me',{method:'PATCH',body:{card:false}}).catch(()=>{});
},true);

/* ---------- checkout: the pay button goes to the server ---------- */
const origCheckout=A.checkout; let co=null;
A.checkout=(order,t)=>{ co={order,t}; origCheckout(order,t); };
document.addEventListener('click',async e=>{
  const b=e.target.closest('#coPay'); if(!b||!co||!server) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const method=(document.querySelector('input[name=coMethod]:checked')||{}).value||'card';
  const keepCard=!!(document.getElementById('coKeep')||{}).checked;
  b.disabled=true;
  try{
    const o=co.order; const d=await api('checkout',{method:'POST',body:{trail:o.trail,date:o.date,car:o.car,people:o.people,composed:o.composed||null,method,keepCard}});
    if(d.redirect){ location.href=d.redirect; return; }
    if(d.user) adopt(d.user,null);
    const p=toUi(d.pass,server); S.passes=[p].concat(S.passes.filter(x=>x.code!==p.code));
    A.closeModal(); S.ui.fresh=p.code; A.go('pass-'+p.code); A.toast(`${ic('check')} Paid. Pass ${esc(p.code)} is in your profile`);
  }catch(err){ A.toast(esc(err.message)); b.disabled=false; }
},true);

/* ---------- road progress and stamps ---------- */
const origSave=A.savePass;
A.savePass=p=>{ origSave(p); if(server&&!p.sample) api('passes/'+encodeURIComponent(p.code),{method:'PATCH',body:{stage:p.stage,at:p.at,got:p.got,date:p.date}}).catch(()=>{}); };

/* ---------- a code from a desk, a hotel or a friend ---------- */
document.addEventListener('submit',async e=>{
  if(e.target.id!=='codeForm'||!server) return;
  let v=($('#codeIn').value||'').trim().toUpperCase().replace(/\s+/g,''); if(!v||A.pass(v)||A.pass('DNA-'+v.replace(/^DNA-?/,''))) return;
  e.preventDefault(); e.stopImmediatePropagation();
  try{ const d=await api('passes/redeem',{method:'POST',body:{code:v}}); const p=toUi(d.pass,server); S.passes=[p].concat(S.passes.filter(x=>x.code!==p.code)); A.go('pass-'+p.code); }
  catch(err){ const er=$('#codeErr'); if(er){ er.textContent=err.message; er.hidden=false; } }
},true);

/* ---------- boot ---------- */
(async()=>{
  try{ CFG=await api('config'); }catch(_){}
  document.body.classList.toggle('demo',!!CFG.demo);
  const pb=document.getElementById('protobar'); if(pb) pb.hidden=!CFG.demo;
  if(!CFG.demo){ const st=document.createElement('style'); st.textContent='.prototool{display:none!important}'; document.head.appendChild(st); }
  try{ const d=await api('me'); if(d.user) adopt(d.user,d.passes); else if(!(S.user&&S.user.sample&&CFG.demo)) adopt(null); }catch(_){}
  A.render();
})();
})();
