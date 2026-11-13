/* DNA Trails prototype 2: profile, sign-in with a one-time code, payment step.
   Nothing here talks to a server. No password and no card field exists anywhere. */
(function(){
const A=window.APP, D=window.DNA, ic=A.ic, esc=A.esc, S=A.state, $=A.$, $$=A.$$, R=A.routes;

A.initial=u=>((u&&u.name||'?').trim()[0]||'?').toUpperCase();
A.SAMPLE_USER=()=>({name:'Ana Stojanovska',contact:'ana@example.com',car:'regular',people:2,lang:'en',since:'2027-04-28',sample:true,card:true});
A.signIn=u=>{ S.user=u; if(A.refreshHead) A.refreshHead(); };
A.signOut=()=>{ S.user=null; if(A.refreshHead) A.refreshHead(); };
A.avatar=(u,size)=>`<span class="avatar" style="--s:${size||44}px" aria-hidden="true">${esc(A.initial(u))}</span>`;
const METHOD={saved:'Sample card ending 4242',card:'Card',wallet:'Apple Pay or Google Pay'};
A.paidWith=p=>METHOD[(p.paid&&p.paid.method)||'saved'];

/* ---------- sign in: name + email or mobile, then a six-digit code ---------- */
A.auth=(box,onDone,o)=>{ o=o||{}; let step='who'; const d={name:'',contact:''};
  const draw=()=>{
    if(step==='who') box.innerHTML=`<form class="stack" id="auWho" novalidate>
      <label class="field"><span>Your name</span><input id="auName" autocomplete="off" placeholder="As a host should greet you" value="${esc(d.name)}"><span class="err" id="auErrN" hidden>Tell us what to call you. Hosts like a first name.</span></label>
      <label class="field"><span>Email or mobile number</span><input id="auContact" autocomplete="off" placeholder="you@example.com or +389 7X XXX XXX" value="${esc(d.contact)}"><span class="err" id="auErrC" hidden>We need one or the other, to send your code and your pass.</span></label>
      <button class="btn lg" type="submit">${ic('mail')}Send me a code</button>
      <p class="small muted">No password. New here or coming back, it is the same two steps.</p>
      <div class="prototool"><span><b>Prototype:</b> nothing is sent. Or skip the typing.</span><button type="button" class="btn sm outline" id="auSample">Use the sample account</button></div>
    </form>`;
    else box.innerHTML=`<form class="stack" id="auCode" novalidate>
      <p>We sent a six-digit code to <b>${esc(d.contact)}</b>.</p>
      <label class="field"><span>Code</span><input id="auDigits" class="codein" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="······"><span class="err" id="auErrD" hidden>Six digits, please.</span></label>
      <div class="row"><button class="btn lg" type="submit">${ic('check')}Confirm</button><button type="button" class="linkbtn" id="auBack">Use a different address</button></div>
      <p class="small muted"><b>Prototype:</b> no message was sent. Any six digits work.</p>
    </form>`;
    wire(); };
  const wire=()=>{
    const w=$('#auWho',box); if(w){ w.addEventListener('submit',e=>{ e.preventDefault(); d.name=$('#auName',box).value.trim(); d.contact=$('#auContact',box).value.trim(); const okC=/^\S+@\S+\.\S+$/.test(d.contact)||d.contact.replace(/\D/g,'').length>=8; $('#auErrN',box).hidden=!!d.name; $('#auErrC',box).hidden=okC; if(!d.name){ $('#auName',box).focus(); return; } if(!okC){ $('#auContact',box).focus(); return; } step='code'; draw(); $('#auDigits',box).focus(); });
      $('#auSample',box).addEventListener('click',()=>{ A.signIn(A.SAMPLE_USER()); A.toast(`${ic('check')} Signed in as the sample account`); onDone(S.user); }); }
    const c=$('#auCode',box); if(c){ c.addEventListener('submit',e=>{ e.preventDefault(); const v=$('#auDigits',box).value.replace(/\D/g,''); if(v.length!==6){ $('#auErrD',box).hidden=false; $('#auDigits',box).focus(); return; }
        A.signIn({name:d.name,contact:d.contact,car:o.car||'regular',people:o.people||2,lang:'en',since:A.today,card:false}); A.toast(`${ic('check')} Welcome, ${esc(d.name.split(' ')[0])}`); onDone(S.user); });
      $('#auBack',box).addEventListener('click',()=>{ step='who'; draw(); }); }
  };
  draw(); };

/* ---------- checkout: profile first, then payment ---------- */
A.checkout=(order,t)=>{
  const dates=t.days.length>1?A.dLong(order.date)+' to '+A.dLong(A.addDays(order.date,t.days.length-1)):A.dLong(order.date);
  const steps=n=>`<ol class="costeps" aria-label="Steps">${['Your profile','Payment','Your pass'].map((s,i)=>`<li class="${i<n?'done':i===n?'on':''}"><i>${i<n?ic('check'):i+1}</i>${s}</li>`).join('')}</ol>`;
  const o=A.modal(`<span class="eyebrow">Almost yours</span><h2>${esc(t.title)}</h2><div id="coBody" class="stack"></div>`);
  const body=$('#coBody',o);
  const pay=()=>{ const u=S.user; let method=u.card?'saved':'card';
    const opt=(k,label,sub)=>`<label class="payopt"><input type="radio" name="coMethod" value="${k}" ${method===k?'checked':''}><span><b>${label}</b><small>${sub}</small></span></label>`;
    body.innerHTML=`${steps(1)}
     <dl class="kv"><dt>Dates</dt><dd>${dates}</dd><dt>Car</dt><dd>${esc(D.CARS[order.car].label)}, ${order.people} aboard</dd><dt>We call</dt><dd>${A.dLong(A.addDays(order.date,-1))}, from 18:00</dd><dt>Pass goes to</dt><dd>${esc(u.name)}, ${esc(u.contact)}</dd><dt>Price</dt><dd><b>EUR ${t.price}</b>, once, for the whole car</dd></dl>
     <fieldset class="paymethods"><legend class="flabel">Pay with</legend>
       ${u.card?opt('saved','Saved card','Sample card ending 4242'):''}
       ${opt('card',u.card?'Another card':'Card','Visa, Mastercard or Maestro')}
       ${opt('wallet','Apple Pay or Google Pay','One tap, on a phone that has it set up')}
     </fieldset>
     <div class="cardmock" id="cardMock" aria-hidden="true"><div class="fakein w">Card number</div><div class="fakein">MM / YY</div><div class="fakein">CVC</div><p>The payment provider's secure form sits here. Card numbers never reach DNA Trails.</p></div>
     <label class="check" id="coKeepRow"><input type="checkbox" id="coKeep" checked><span>Remember this card in my profile</span></label>
     <div class="notice gold">${ic('info')}<span><b>Prototype:</b> nothing is charged and no card is asked for.</span></div>
     <div class="row"><button class="btn lg" id="coPay">${ic('lock')}Pay EUR ${t.price} and get my pass</button><button class="btn outline" data-close>Not yet</button></div>
     <p class="small muted">Works or it's free. Change your date free until 18:00 the evening before.</p>`;
    const sync=()=>{ method=($('input[name=coMethod]:checked',body)||{}).value||method; $('#cardMock',body).hidden=method!=='card'; $('#coKeepRow',body).hidden=method!=='card'; };
    $$('input[name=coMethod]',body).forEach(r=>r.addEventListener('change',sync)); sync();
    $('#coPay',body).addEventListener('click',()=>{ const us=S.user; if(method==='card'&&$('#coKeep',body).checked){ us.card=true; S.user=us; }
      const p=A.buy(Object.assign({},order,{paid:{method,eur:t.price,at:A.today}})); A.closeModal(); S.ui.fresh=p.code; A.go('pass-'+p.code); A.toast(`${ic('check')} Paid. Pass ${p.code} is in your profile`); });
  };
  if(S.user) pay();
  else { body.innerHTML=`${steps(0)}<p>First, who is travelling? Your profile keeps your pass, your receipt and your stamps, and tells us where to send the hosts' answers.</p><div id="coAuth"></div>`; A.auth($('#coAuth',o),()=>pay(),{car:order.car,people:order.people}); }
};

/* ---------- a payment receipt ---------- */
A.payReceipt=p=>{ const t=A.trailOf(p); A.modal(`<div class="stack" style="align-items:center"><div class="receipt"><h4>Receipt</h4><div style="text-align:center">DNA Trails · pass ${esc(p.code)}</div>
  <div class="rl"><span>${esc(t.title)}</span><span>EUR ${t.price}</span></div><div class="rl"><span>For</span><span>${A.dShort(p.date)} 2027, one car</span></div><div class="rl"><span>Paid</span><span>${A.dShort(p.bought||A.today)} 2027</span></div><div class="rl"><span>With</span><span>${esc(A.paidWith(p))}</span></div>
  ${p.refunded?`<div class="rl"><span>Refunded, guarantee</span><span>- EUR ${t.price}</span></div>`:''}<div class="rl tot"><span>Total</span><span>EUR ${p.refunded?0:t.price}</span></div><p style="text-align:center;font-size:12.5px">Sample receipt. Hosts are paid by you, in cash, and are not on this receipt.</p></div>
  <button class="btn outline sm" data-soon="A PDF copy is emailed in the real product.">${ic('download')}Email me a copy</button></div>`); };

/* ---------- the one profile page ---------- */
const codeForm=()=>`<form class="sidecard" id="codeForm" novalidate><h3>${ic('qr')} Have a code?</h3><p class="small muted">From a rental desk or hotel card, or from the person who bought the trail.</p><label class="field"><span>Pass code</span><input id="codeIn" placeholder="DNA-7K2M" autocomplete="off" autocapitalize="characters" style="font-family:var(--type);letter-spacing:.06em"><span class="err" id="codeErr" hidden></span></label><button class="btn outline" type="submit">Open the trail</button></form>`;
const wireCode=()=>{ const f=$('#codeForm'); if(!f) return; f.addEventListener('submit',e=>{ e.preventDefault(); let v=$('#codeIn').value.trim().toUpperCase().replace(/\s+/g,''); if(v&&!v.startsWith('DNA-')) v='DNA-'+v.replace(/^DNA/,''); const err=$('#codeErr'); if(!v){ err.textContent='Type the code from the pass, for example DNA-7K2M.'; err.hidden=false; return; } if(A.pass(v)){ A.go('pass-'+v); return; } err.textContent='No pass with that code in this browser. In the real product any valid code opens here.'; err.hidden=false; }); };
const LINKS=[['trails','route','Find a trail','Six driven trails'],['trip-it-yourself','sparkle','Trip-it-Yourself','Composed for your dates'],['roots','house','Roots Trail','Back to a family village'],['passport','stamp','Passport','Every stamp you collected'],['map','pin','The map','3,519 places we researched'],['how-it-works','phone','How it works','The evening-before call'],['guarantee','shield','Works or it\'s free','The refund promise'],['hosts','users','Hosts','The people expecting you'],['faqs','info','FAQs','Short answers'],['contact','mail','Contact','A person replies'],['our-dna','leaf','Our DNA','Who we are'],['partners','hands','For partners','Sponsored trails, desk codes'],['terms','receipt','Terms and privacy','The small print'],['credits','star','Credits','Photos and data sources']];

R.profile=()=>{
  const u=S.user;
  if(!u) return {title:'Profile',html:`
  <section class="pagehead"><div class="wrap"><span class="eyebrow">Your profile</span><h1>One place for your trails, stamps and receipts.</h1><p class="sub">Sign in with a code. There is no password to forget.</p></div></section>
  <section class="section tight"><div class="wrap tgrid side-400">
    <div class="buybox" style="position:static"><h2 style="font-size:26px;color:var(--deep)">Sign in or create a profile</h2><div id="pfAuth"></div></div>
    <aside class="stack">
      <div class="sidecard"><h3>What your profile holds</h3><ul class="notes"><li>${ic('ticket')}<span>Your passes, on any phone you sign in on.</span></li><li>${ic('stamp')}<span>Your passport and every stamp in it.</span></li><li>${ic('receipt')}<span>Payments, receipts and refunds.</span></li><li>${ic('phone')}<span>Where to send the hosts' answers the evening before.</span></li></ul></div>
      ${codeForm()}
    </aside>
  </div></section>`,init(){ A.auth($('#pfAuth'),()=>A.render()); wireCode(); }};

  const mine=A.mine(), live=mine.filter(p=>p.stage!=='done'), done=mine.filter(p=>p.stage==='done'); const next=live.slice().sort((a,b)=>a.date<b.date?-1:1)[0];
  const stamps=A.stamps(); const left=mine.reduce((a,p)=>a+A.dividend(p).eur,0); const edit=S.ui.editProfile;
  const since=A.parse(u.since||A.today);
  const tkt=p=>`<div class="stack-sm"><div class="row" style="gap:10px"><span class="live${p.stage==='booked'?' warn':''}">${esc(A.stageLabel(p))}</span>${p.sample?A.sample('Sample pass'):''}</div>${A.passTicket(p,{href:'#pass-'+p.code})}</div>`;
  const details=edit?`<form class="stack" id="pfForm" novalidate>
      <label class="field"><span>Name</span><input id="pfName" autocomplete="off" value="${esc(u.name)}"></label>
      <label class="field"><span>Email or mobile number</span><input id="pfContact" autocomplete="off" value="${esc(u.contact)}"></label>
      <div class="stack-sm"><span class="flabel">Usual car</span><div class="carpick" role="group" aria-label="Usual car">${Object.entries(D.CARS).map(([k,c])=>`<button type="button" data-pcar="${k}" aria-pressed="${(S.ui.pcar||u.car)===k}">${esc(c.label)}<small>${esc(c.hint)}</small></button>`).join('')}</div></div>
      <label class="field"><span>Language for messages</span><select id="pfLang"><option value="en" ${u.lang==='en'?'selected':''}>English</option><option value="mk" ${u.lang==='mk'?'selected':''}>Македонски</option></select></label>
      <div class="row"><button class="btn sm" type="submit">Save</button><button class="btn sm outline" type="button" id="pfCancel">Cancel</button></div></form>`
    :`<dl class="kv"><dt>Name</dt><dd>${esc(u.name)}</dd><dt>Reach me at</dt><dd>${esc(u.contact)}</dd><dt>Usual car</dt><dd>${esc(D.CARS[u.car||'regular'].label)}</dd><dt>Messages in</dt><dd>${u.lang==='mk'?'Македонски':'English'}</dd></dl><button class="btn sm outline" id="pfEdit">${ic('edit')}Edit details</button>`;
  return {title:'Profile',html:`
  <section class="pagehead"><div class="wrap">
    <div class="pfhead">${A.avatar(u,84)}<div class="stack-sm"><div class="row" style="gap:10px"><span class="eyebrow">Your profile</span>${u.sample?A.sample('Sample account'):''}</div><h1>${esc(u.name)}</h1><p class="muted">${esc(u.contact)} · on the trail since ${D.MONTHS_FULL[since.getMonth()]} ${since.getFullYear()}</p></div>
      <div class="row pfact"><a class="btn" href="#trails">${ic('route')}Find a trail</a><button class="btn outline" id="pfOut">Sign out</button></div></div>
    <div class="pfstats"><div class="stat"><b>${live.length}</b><span>${live.length===1?'trail':'trails'} coming up</span></div><div class="stat"><b>${done.length}</b><span>${done.length===1?'trail':'trails'} finished</span></div><div class="stat"><b>${stamps.length}</b><span>stamps collected</span></div><div class="stat"><b>${left}</b><span>euros left in villages</span></div></div>
  </div></section>
  <section class="section tight"><div class="wrap tgrid side-400">
    <div class="stack-lg">
      <div class="stack"><h2>${next?'Next up':'Your trails'}</h2>
        ${next?`${tkt(next)}<div class="row"><a class="btn" href="#pass-${next.code}">${ic('ticket')}Open my trail</a>${next.stage==='confirmed'||next.stage==='road'?`<a class="btn gold" href="#road-${next.code}">${ic('nav')}${next.stage==='road'?'Back to the road':'Start the trail'}</a>`:''}</div>`
          :`<div class="empty" style="padding:26px"><h3>Nothing coming up</h3><p class="muted">The shelf has six trails, and most Saturdays still have a car or two left.</p><a class="btn" href="#trails">Find a trail</a></div>`}
        ${live.filter(p=>p!==next).map(tkt).join('')}</div>
      <div class="stack"><div class="between"><h2>Passport</h2><a href="#passport">Open the passport</a></div>
        ${stamps.length?`<div class="pfstamps">${stamps.slice(-6).map(x=>{ const h=x.stop.host&&D.HOSTS[x.stop.host]; return h?A.stamp({tone:'green',a:A.shortWhere(x.stop.where),b:h.name,c:A.dStamp(x.date)+' 2027',size:92,rot:(A.hash(x.stop.ref)%17)-8}):A.stamp({shape:'box',tone:'ink',a:'Visited',b:A.shortWhere(x.stop.where),c:A.dStamp(x.date),size:62,rot:(A.hash(x.stop.ref)%11)-5}); }).join('')}</div>`
          :`<p class="muted">No stamps yet. Your first one is waiting at the first host of your first trail.</p>`}</div>
      ${done.length?`<div class="stack"><h2>Finished</h2>${done.map(tkt).join('')}</div>`:''}
      <div class="stack"><h2>Payments and receipts</h2>
        ${mine.length?`<div class="paylist">${mine.map(p=>{ const t=A.trailOf(p); return `<div class="payrow"><span class="d">${A.dShort(p.bought||A.today)}</span><span class="w"><b>${esc(t.title)}</b><small>${esc(A.paidWith(p))} · pass ${esc(p.code)}</small></span><span class="a">${p.refunded?'<s>EUR '+t.price+'</s> refunded':'EUR '+t.price}</span><button class="btn sm outline" data-receipt="${p.code}">Receipt</button></div>`; }).join('')}</div>`
          :`<p class="muted">Nothing paid yet. A pass is bought once, per trip. There is no subscription to manage.</p>`}</div>
      <div class="stack"><h2>Everything else</h2><div class="linkgrid">${LINKS.map(l=>`<a href="#${l[0]}">${ic(l[1])}<span><b>${l[2]}</b><small>${l[3]}</small></span></a>`).join('')}<a href="#app">${ic('phone')}<span><b>The app</b><small>The same trails, with notifications</small></span></a></div></div>
    </div>
    <aside class="stack">
      <div class="sidecard"><h3>${ic('user')} Your details</h3>${details}</div>
      <div class="sidecard"><h3>${ic('cash')} Payment method</h3>${u.card?`<p><b>Sample card ending 4242</b><br><span class="small muted">Held by the payment provider, not by us.</span></p><button class="btn sm outline" id="pfCardOff">Remove card</button>`:`<p class="small">No card saved. You choose how to pay each time: card, Apple Pay or Google Pay.</p>`}</div>
      ${S.roots?`<div class="sidecard"><h3>${ic('house')} Roots Trail request</h3><p class="small">We are looking for <b>${esc(S.roots.village)}</b>, family ${esc(S.roots.family)}. We write within three days.</p><a class="small" href="#roots">See the request</a></div>`:''}
      ${codeForm()}
      <div class="sidecard"><h3>${ic('lock')} Privacy</h3><p class="small">Hosts are told your first name, the time and how many you are. Nothing else leaves your profile.</p><div class="row"><a class="small" href="#privacy">Privacy</a><button class="linkbtn small" style="color:var(--rust-ink)" data-soon="Deleting a profile removes passes, stamps and receipts. Not wired up in the prototype.">Delete my profile</button></div></div>
    </aside>
  </div></section>`,
  init(){ wireCode();
    $('#pfOut').addEventListener('click',()=>{ A.signOut(); S.ui.editProfile=false; A.render(); window.scrollTo(0,0); A.toast('Signed out'); });
    const ed=$('#pfEdit'); if(ed) ed.addEventListener('click',()=>{ S.ui.editProfile=true; S.ui.pcar=u.car; A.render(); });
    const cn=$('#pfCancel'); if(cn) cn.addEventListener('click',()=>{ S.ui.editProfile=false; A.render(); });
    $$('[data-pcar]').forEach(b=>b.addEventListener('click',()=>{ S.ui.pcar=b.dataset.pcar; $$('[data-pcar]').forEach(x=>x.setAttribute('aria-pressed',x===b)); }));
    const f=$('#pfForm'); if(f) f.addEventListener('submit',e=>{ e.preventDefault(); const n=$('#pfName').value.trim(), c=$('#pfContact').value.trim(); if(!n||!c){ A.toast('A name and one way to reach you are needed'); return; } const us=S.user; if(c!==us.contact){ const old=us.contact; S.passes=S.passes.map(x=>x.owner===old?Object.assign(x,{owner:c}):x); } us.name=n; us.contact=c; us.car=S.ui.pcar||us.car; us.lang=$('#pfLang').value; S.user=us; S.ui.editProfile=false; A.render(); A.toast(`${ic('check')} Details saved`); });
    const co=$('#pfCardOff'); if(co) co.addEventListener('click',()=>{ const us=S.user; us.card=false; S.user=us; A.render(); A.toast('Card removed'); });
    $$('[data-receipt]').forEach(b=>b.addEventListener('click',()=>A.payReceipt(A.pass(b.dataset.receipt))));
  }};
};
})();
