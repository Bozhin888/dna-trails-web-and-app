/* DNA Trails prototype 2: composer, Roots Trail, the one map page, method, guarantee, hosts, partners, brand and small print */
(function(){
const A=window.APP, D=window.DNA, GEO=window.GEO, MD=window.MAPDATA, ic=A.ic, esc=A.esc, S=A.state, $=A.$, $$=A.$$, R=A.routes;
const head=(eyebrow,h1,sub,deep)=>`<section class="pagehead${deep?' deep':''}"><div class="wrap"><span class="eyebrow">${eyebrow}</span><h1>${h1}</h1>${sub?`<p class="sub">${sub}</p>`:''}</div></section>`;

/* ---------- Trip-it-Yourself: the composer ---------- */
const mins=t=>{const [h,m]=t.split(':').map(Number); return h*60+m;};
const RANK={small:0,regular:1,suv:2};
A.compose=u=>{
  const dates=Array.from({length:u.days},(_,i)=>A.dow(A.addDays(u.date,i)));
  const out=[]; const elig=A.allStops.filter(s=>{ if(RANK[s.minCar||'small']>RANK[u.car]){ out.push([s,'needs a bigger car']); return false; } if(s.host&&s.closed.some(d=>dates.includes(d))){ out.push([s,D.HOSTS[s.host].name+' is away on '+A.WDL[s.closed.find(d=>dates.includes(d))]+'s']); return false; } return true; });
  const score=s=>s.tags.filter(t=>u.apps.includes(t)).length*2+(s.host?1:0)+(A.hash(s.ref+u.date)%7)/10;
  const ranked=[...elig].sort((a,b)=>score(b)-score(a)); const seed=ranked[0]; if(!seed) return null;
  const pick=radius=>{ const near=ranked.filter(s=>A.km(seed,s)<=radius); const used=new Set(), days=[];
    for(let d=0;d<u.days;d++){ const first=near.find(s=>!used.has(s.ref)); if(!first) break; const day=[first]; used.add(first.ref);
      const rest=near.filter(s=>!used.has(s.ref)).sort((a,b)=>(score(b)-A.km(first,b)/25)-(score(a)-A.km(first,a)/25));
      for(const s of rest){ if(day.length>=3) break; if(A.km(first,s)>55) continue; if(day.some(x=>Math.abs(mins(x.time)-mins(s.time))<85)) continue; day.push(s); used.add(s.ref); }
      day.sort((a,b)=>mins(a.time)-mins(b.time)); days.push(day); }
    return days; };
  let days=pick(80); if(days.reduce((a,d)=>a+d.length,0)<u.days*2||days.length<u.days) days=pick(170);
  const reg=A.regions[A.trails[seed.trail].region];
  return {composed:{title:'Your '+reg.name+' trail',sub:'Composed for '+A.dShort(u.date),start:A.trails[seed.trail].start,region:reg.id,img:seed.img,days:days.map((d,i)=>({t:[...new Set(d.map(s=>A.shortWhere(s.where)))].slice(0,2).join(' and '),refs:d.map(s=>s.ref)}))},pool:elig.length,out,total:A.allStops.length};
};
R['trip-it-yourself']=()=>{
  const u=S.ui.tiy||(S.ui.tiy={days:2,date:A.addDays(A.today,8),car:'regular',apps:['food','wine']});
  const res=A.compose(u); const t=res&&A.trailOf({composed:res.composed}); const fl=t?A.flat(t):[];
  const chips=Array.from({length:8},(_,i)=>A.addDays(A.today,i+2)).map(d=>{ const dt=A.parse(d); return `<button data-td="${d}" aria-pressed="${u.date===d}"><span>${A.WD[dt.getDay()]}</span><b>${dt.getDate()}</b><small>${D.MONTHS[dt.getMonth()]}</small></button>`; }).join('');
  return {title:'Trip-it-Yourself',html:`
  ${head('Trip-it-Yourself','A trail composed for your dates','Three questions. It can only pick stops we have driven, so it cannot invent a restaurant.')}
  <section class="section tight"><div class="wrap tgrid wide-l" id="tiyGrid">
    <div class="buybox" style="position:static">
      <div class="stack-sm"><span class="flabel">1 · When, and for how long?</span><div class="datechips">${chips}</div>
        <div class="carpick" style="margin-top:6px">${[1,2,3].map(n=>`<button data-days="${n}" aria-pressed="${u.days===n}">${n} ${n===1?'day':'days'}<small>${['Three stops','A weekend','A long weekend'][n-1]}</small></button>`).join('')}</div></div>
      <div class="stack-sm"><span class="flabel">2 · What are you driving?</span><div class="carpick">${Object.entries(D.CARS).map(([k,c])=>`<button data-tcar="${k}" aria-pressed="${u.car===k}">${esc(c.label)}<small>${esc(c.hint)}</small></button>`).join('')}</div></div>
      <div class="stack-sm"><span class="flabel">3 · What is your appetite?</span><div class="row gap6">${D.APPETITES.map(([k,l])=>`<button class="chip" data-app="${k}" aria-pressed="${u.apps.includes(k)}">${esc(l)}</button>`).join('')}</div></div>
      <div class="notice gold">${ic('sparkle')}<span>The composer chooses from <b>${res?res.pool:0} of ${A.allStops.length} driven stops</b> that fit your car and dates.${res&&res.out.length?' Left out: '+res.out.slice(0,3).map(o=>esc(o[0].name)+' ('+esc(o[1])+')').join(', ')+(res.out.length>3?' and '+(res.out.length-3)+' more':'')+'.':''}</span></div>
    </div>
    <div class="stack-lg">${t?`
      ${A.ticket({trail:t,date:u.date,car:u.car,people:2,code:'DNA-····'})}
      <div class="stack"><div class="between"><h2>${esc(t.title)}</h2><span class="small muted">${fl.length} stops, ${fl.filter(s=>s.host).length} hosts to call ${A.sample('Sample stops')}</span></div>
      ${t.days.map((d,di)=>`<div class="stack-sm"><div class="hday" style="padding:6px 0 4px">Day ${di+1} · ${esc(d.t)} <span>${A.dLong(A.addDays(u.date,di))}</span></div>${d.stops.map(s=>`<div class="statusbar" style="padding:12px 14px;flex-wrap:nowrap"><div class="row" style="flex-wrap:nowrap;gap:14px;min-width:0"><span class="hs-time" style="flex:none">${s.time}</span><div style="min-width:0"><b style="font:700 17px var(--head);color:var(--green)">${esc(s.name)}</b><br><span class="small muted">${esc(s.where)} · from ${esc(A.trails[s.trail].title)}</span></div></div>${s.host?A.face(D.HOSTS[s.host].face,40):`<span class="tag line">Open</span>`}</div>`).join('')}</div>`).join('')}</div>
      <div class="row"><button class="btn lg" id="tiyBuy">Get this trail · EUR ${D.TYPES.composed.price}</button><span class="small muted">We call ${fl.filter(s=>s.host).length} hosts on ${A.dLong(A.addDays(u.date,-1))}. Works or it's free.</span></div>`
      :`<div class="empty"><h2>Nothing fits those answers</h2><p class="muted">Try a different day or a bigger appetite.</p></div>`}</div>
  </div></section>
  <section class="section band-white"><div class="wrap split"><div class="stack"><span class="eyebrow">Why it cannot hallucinate</span><h2>A closed world</h2><p class="lead">General AI planners draw on the whole internet, so in rural areas they guess. The composer draws on one list: stops a DNA Trails person has stood in, with a host who picked up the phone this season. If nothing fits, it says so.</p></div><div class="grid g2" style="gap:16px"><div class="stat"><b>${A.allStops.length}</b><span>driven stops in the pool today</span></div><div class="stat"><b>${A.verified.length}</b><span>of them with a host on the call list</span></div><div class="stat"><b>0</b><span>stops taken from the open web</span></div><div class="stat"><b>EUR 29</b><span>per car, whatever the length</span></div></div></div></section>`,
  init(){
    $$('[data-td]').forEach(b=>b.addEventListener('click',()=>{ u.date=b.dataset.td; A.render(); }));
    $$('[data-days]').forEach(b=>b.addEventListener('click',()=>{ u.days=+b.dataset.days; A.render(); }));
    $$('[data-tcar]').forEach(b=>b.addEventListener('click',()=>{ u.car=b.dataset.tcar; A.render(); }));
    $$('[data-app]').forEach(b=>b.addEventListener('click',()=>{ const k=b.dataset.app; u.apps=u.apps.includes(k)?u.apps.filter(x=>x!==k):[...u.apps,k]; if(!u.apps.length) u.apps=[k]; A.render(); }));
    const bb=$('#tiyBuy'); if(bb) bb.addEventListener('click',()=>A.checkout({composed:res.composed,date:u.date,car:u.car,people:2},t));
  }};
};

/* ---------- Roots Trail ---------- */
const villages=MD.points.filter(p=>p[3]===0);
R.roots=()=>{
  const r=S.roots;
  const form=r?`<div class="buybox" id="rootsDone" style="position:static;align-items:flex-start">${A.stamp({shape:'box',tone:'green',a:'Request received',b:A.dStamp(A.today),c:'We write in 3 days',rot:-4,size:120,land:true})}<h3 style="color:var(--deep)">We are looking for ${esc(r.village)}</h3><dl class="kv"><dt>Family</dt><dd>${esc(r.family)}</dd><dt>Coming</dt><dd>${esc(r.when)} · ${esc(r.people)} people</dd><dt>Reach you at</dt><dd>${esc(r.contact)}</dd></dl><p class="small" style="color:var(--pass-ink)">Within three working days you hear what we found: who is still in the village, whether the house stands, who has the church key, and a price. You pay nothing until you say yes.</p><button class="linkbtn" id="rootsAgain">Start another request</button><span class="small muted">Prototype: nothing was sent.</span></div>`
  :`<form class="buybox" style="position:static" id="rootsForm" novalidate>
      <h3 style="color:var(--deep)">Start with a village</h3>
      <label class="field"><span>The village or town</span><input id="rVillage" list="rList" placeholder="For example Galičnik" autocomplete="off"><datalist id="rList">${villages.map(v=>`<option value="${esc(v[2])}">`).join('')}</datalist><span class="hint" id="rHint">We have ${villages.length} villages and towns on file. Yours may be one of them.</span><span class="err" id="rErrV" hidden>Tell us the village, even if you are unsure of the spelling.</span></label>
      <label class="field"><span>Family name, as it was said at home</span><input id="rFamily" placeholder="For example Stojanovski" autocomplete="off"><span class="err" id="rErrF" hidden>A family name helps the people we call remember.</span></label>
      <label class="field"><span>What do you know?</span><textarea id="rKnow" placeholder="Who left, roughly when, where the house was, the name of the church, anything a grandparent said."></textarea></label>
      <div class="grid g2" style="gap:12px"><label class="field"><span>When are you coming?</span><select id="rWhen">${['June 2027','July 2027','August 2027','September 2027','Not sure yet'].map(m=>`<option>${m}</option>`).join('')}</select></label><label class="field"><span>How many of you?</span><select id="rPeople">${[2,3,4,5,6,'7 or more'].map(n=>`<option>${n}</option>`).join('')}</select></label></div>
      <label class="field"><span>Email or phone</span><input id="rContact" placeholder="you@example.com" autocomplete="off"><span class="err" id="rErrC" hidden>We need one way to write back.</span></label>
      <button class="btn lg block" type="submit">Ask us to look</button>
      <p class="small" style="color:var(--pass-ink)">Free to ask. EUR 190 to 390 per family if you go ahead, depending on how much digging it takes.</p></form>`;
  return {title:'Roots Trail',html:`
  <section class="thead">${A.img('village','','loading="eager"')}<div class="wrap">
    <div class="row gap6"><span class="tag roots" style="background:var(--gold);color:var(--deep)">Roots Trail</span><span class="tag line" style="color:#fff;border-color:rgba(255,255,255,.4)">Made by hand, one family at a time</span></div>
    <h1>A trail to the village your family came from.</h1><p class="sub">For people living abroad, coming back to roots and family.</p>
  </div></section>
  <section class="section tight"><div class="wrap tgrid side-440" id="rootsGrid">
    <div class="stack-lg">
      <p class="lead">You know the name of the village. Maybe a surname, a church, a story about a walnut tree. You are bringing a partner or children who have never seen it. We turn that into a day that works: the right road, the right door, and someone who is expecting you.</p>
      <div class="stack"><h2>What we do with a village name</h2>
        <div class="helixlist" id="rootsHelix">
          ${[['We call the village','The shop, the priest, the municipality office, a neighbour. In Macedonian, until someone says "Yes, I remember them."','phone'],['We find the places','The house, if it still stands. The church and who holds its key. The graveyard, and which corner to look in.','key'],['We drive the road','Last-kilometre notes for your car, like any trail. Some of these villages are at the end of 12 km of gravel.','road'],['Someone meets you','A local who knows the families walks with you for the day and translates the stories. You pay them directly, about EUR 50 to 80.','users'],['You get a pass, like any trail','Dated, confirmed the evening before, and it works offline. The stamp for your own village goes in the passport.','ticket']].map((s,i)=>`<article class="hstop" data-n="${i+1}"><div class="hs-body" style="border-top:0"><h3 style="display:flex;gap:10px;align-items:center">${ic(s[2])}${s[0]}</h3><p>${s[1]}</p></div></article>`).join('')}
        </div></div>
      <div class="notice gold">${ic('info')}<span><b>What we do not promise.</b> We cannot promise living relatives, a standing house or a clear answer. We promise to find out who and what is still there, and to tell you before you book a flight.</span></div>
    </div>
    <aside class="stack">${form}
      <div class="sidecard"><h3>Why this is called DNA Trails</h3><p class="small">The name was always about heritage. This is the trail that takes it literally: your own.</p></div></aside>
  </div></section>`,
  init(){
    A.watchHelix($('#rootsHelix'));
    const ag=$('#rootsAgain'); if(ag) ag.addEventListener('click',()=>{ S.roots=null; A.render(); });
    const f=$('#rootsForm'); if(!f) return; const v=$('#rVillage'), hint=$('#rHint');
    v.addEventListener('input',()=>{ const q=v.value.trim().toLowerCase(); const hit=q.length>2&&villages.find(p=>p[2].toLowerCase()===q); if(hit){ const m=GEO.munis[hit[4]]; hint.innerHTML=`${ic('check')} <b>${esc(hit[2])}</b> is in our catalogue${m?', in '+esc(m.name)+' municipality':''}. That is a good start.`; } else hint.textContent=`We have ${villages.length} villages and towns on file. Yours may be one of them.`; });
    f.addEventListener('submit',e=>{ e.preventDefault(); const val=id=>$('#'+id).value.trim(); const bad=[['rVillage','rErrV'],['rFamily','rErrF'],['rContact','rErrC']].filter(([i,er])=>{ const b=!val(i); $('#'+er).hidden=!b; return b; }); if(bad.length){ $('#'+bad[0][0]).focus(); return; }
      S.roots={village:val('rVillage'),family:val('rFamily'),know:val('rKnow'),when:val('rWhen'),people:val('rPeople'),contact:val('rContact')}; A.render(); const tgt=$('#rootsDone'); if(tgt) tgt.scrollIntoView({block:'center'}); A.toast(`${ic('check')} Request noted. Prototype: nothing was sent.`); });
  }};
};

/* ---------- the map: one informative page ---------- */
R.map=()=>{
  const u=S.ui.map||(S.ui.map={on:['religious','waterfall','winery','gorge_cave','archaeology','unique_experience'],trails:true,heat:false,month:7});
  const cats=MD.cats.filter(c=>c!=='food'); const mapped={}; MD.points.forEach(p=>mapped[MD.cats[p[3]]]=(mapped[MD.cats[p[3]]]||0)+1);
  return {title:'The map',html:`
  ${head('The research underneath','Everything we looked at before we chose what to drive.','One page. Filter it, get ideas, then let a trail do the work.')}
  <section class="section tight"><div class="wrap maplayout">
    <div class="mapside">
      <div class="grid g2" style="gap:12px"><div class="stat"><b>${A.fmt(A.totalPlaces)}</b><span>places researched</span></div><div class="stat"><b>${A.fmt(MD.points.length)}</b><span>placed on the map so far</span></div></div>
      <div class="stack-sm"><div class="between" style="align-items:center"><span class="flabel">Show on the map</span><span class="row gap6"><button class="linkbtn small" id="catAll">All</button><button class="linkbtn small" id="catNone">None</button></span></div>
        <div class="catlist" id="catList">${cats.map(c=>`<button data-cat="${c}" aria-pressed="${u.on.includes(c)}" style="color:${D.MAPCATS[c][1]}"><i></i><span style="color:var(--text)">${esc(D.MAPCATS[c][0])}</span><span class="c">${A.fmt(MD.catTotals[c])}</span></button>`).join('')}</div></div>
      <div class="stack-sm"><span class="flabel">Layers</span>
        <div class="row gap6"><button class="chip" id="tgTrails" aria-pressed="${u.trails}">${ic('route')}The six trails</button><button class="chip" id="tgHeat" aria-pressed="${u.heat}">${ic('users')}Visitors by month</button></div>
        <div id="heatBox" ${u.heat?'':'hidden'} class="stack-sm"><div class="row gap6" id="monthRow" style="gap:4px">${D.MONTHS.map((m,i)=>`<button class="chip" data-month="${i}" aria-pressed="${u.month===i}" style="padding:6px 9px;font-size:12.5px">${m}</button>`).join('')}</div><div class="legend" id="heatLegend" style="max-width:none;box-shadow:none;border:1.5px solid var(--line)"></div></div></div>
      <div class="mapdrawer" id="drawer"><span class="eyebrow">How to use this</span><p class="small">Tap a dot to see what it is. The counts on the left are everything we catalogued. The dots are the ${A.fmt(MD.points.length)} we have placed precisely so far.</p></div>
      <div class="sidecard" style="background:var(--pass);border-color:var(--pass-line)"><h3>Ideas are free. A trail makes them work.</h3><p class="small">A dot tells you a monastery exists. A trail tells you who has the key, and that she will be home on Saturday.</p><a class="btn sm" href="#trails">See the trails</a></div>
    </div>
    <div class="mapstage"><div id="bigMap" style="height:100%"></div></div>
  </div></section>`,
  init(){
    const trailPins=D.TRAILS.map(t=>{ const s=A.flat(t)[0]; return {x:s.x,y:s.y,key:t.id,title:t.title,sub:D.TYPES[t.type].label+' · EUR '+t.price,color:'#1C562B',label:t.title,left:s.x>GEO.w*.62}; });
    const drawer=$('#drawer');
    const m=A.makeMap($('#bigMap'),{regions:'outline',labels:'towns',towns:true,dots:u.on,
      onPin:k=>{ location.hash='trail-'+k; },
      onDot:d=>{ const cat=MD.cats[d[3]], mu=GEO.munis[d[4]]; let best=null; A.allStops.forEach(s=>{ const dist=Math.hypot(s.x-d[0],s.y-d[1]); if(!best||dist<best.dist) best={dist,s}; }); const near=best&&best.dist<75?A.trails[best.s.trail]:null;
        drawer.innerHTML=`<span class="eyebrow" style="color:${D.MAPCATS[cat][1]}">${esc(D.MAPCATS[cat][0])}</span><h3>${esc(d[2])}</h3><p class="small muted">${mu?esc(mu.name)+' municipality':''}</p>${near?`<div class="notice ok">${ic('route')}<span>Close to a trail we have driven: <a href="#trail-${near.id}"><b>${esc(near.title)}</b></a>.</span></div>`:`<p class="small">Not on a driven trail yet. It is in the catalogue the composer and future trails are cut from.</p>`}`; m.focus(d[0],d[1],Math.max(3.2,1),false); },
      onMuni:i=>{ const mu=GEO.munis[i]; const v=MD.tourists[i][u.month]; const yr=MD.tourists[i].reduce((a,b)=>a+b,0); drawer.innerHTML=`<span class="eyebrow">Municipality</span><h3>${esc(mu.name)}</h3><p class="small"><b>${A.fmt(v)}</b> domestic tourist arrivals in ${D.MONTHS_FULL[u.month]} 2023, <b>${A.fmt(yr)}</b> in the whole year. Source: State Statistical Office.</p><p class="small muted">We use these numbers to pick quiet days and to cap how many cars a trail takes.</p>`; }});
    const sync=()=>{ m.setDots(u.on); m.setPins(u.trails?trailPins:[]); m.setRoute(u.trails?A.trailLines(D.TRAILS):[]); m.setHeat(u.heat,u.month); $('#heatBox').hidden=!u.heat; if(u.heat) $('#heatLegend').innerHTML=A.legendHeat(u.month); $$('#catList [data-cat]').forEach(b=>b.setAttribute('aria-pressed',u.on.includes(b.dataset.cat))); $('#tgTrails').setAttribute('aria-pressed',u.trails); $('#tgHeat').setAttribute('aria-pressed',u.heat); $$('[data-month]').forEach(b=>b.setAttribute('aria-pressed',u.month===+b.dataset.month)); };
    sync();
    $('#catList').addEventListener('click',e=>{ const b=e.target.closest('[data-cat]'); if(!b) return; const c=b.dataset.cat; u.on=u.on.includes(c)?u.on.filter(x=>x!==c):[...u.on,c]; sync(); });
    $('#catAll').addEventListener('click',()=>{ u.on=[...cats]; sync(); }); $('#catNone').addEventListener('click',()=>{ u.on=[]; sync(); });
    $('#tgTrails').addEventListener('click',()=>{ u.trails=!u.trails; sync(); }); $('#tgHeat').addEventListener('click',()=>{ u.heat=!u.heat; sync(); });
    $('#monthRow').addEventListener('click',e=>{ const b=e.target.closest('[data-month]'); if(!b) return; u.month=+b.dataset.month; sync(); });
  }};
};

/* ---------- how it works ---------- */
R['how-it-works']=()=>({title:'How it works',html:`
  ${head('The method','Other planners tell you where to go.<br>We find out if anyone is home.','Five things happen between you picking a date and Vesna putting the pie in.')}
  <section class="section"><div class="wrap tgrid side-400">
    <div class="helixlist" id="howHelix">
      ${[['We drive it first','Two of us drive every trail before it goes on sale, once in a small rental and once in a high car. That is where the last-kilometre notes come from: where the asphalt ends, the last ATM, the last pump, the dead zones, the loud dog.','car','Before a trail exists'],
         ['We ask each host one question','"May we call you the day before a visitor comes?" That is the whole agreement. No contract, no commission, no listing fee. A host can say no on any day, for any reason.','chat','Once, by voice'],
         ['You pick a date and tell us your car','One price for everyone in it. Trails are capped at a few cars a day, so a village of 40 people never gets 40 visitors.','calendar','Any time'],
         ['We call every host the evening before','From 18:00, in Macedonian, by phone or Viber. Every yes becomes a dated stamp on your pass with a note in the host\'s own words. Every no gets you the backup stop, confirmed the same evening. We check once more at 07:30.','phone','18:00 the evening before'],
         ['You drive it offline, and collect stamps','Route, notes for your car and audio stories are saved to your phone. Stories start by GPS as you arrive. Each host stamps your passport. At the end, a receipt shows what your trip left in the villages.','stamp','On the day']
        ].map((s,i)=>`<article class="hstop" data-n="${i+1}"><div class="hs-body" style="border-top:0"><span class="hs-time">${s[3]}</span><h3 style="display:flex;gap:10px;align-items:center">${ic(s[2])}${s[0]}</h3><p>${s[1]}</p></div></article>`).join('')}
    </div>
    <aside class="stack" style="position:sticky;top:calc(96px + env(safe-area-inset-top,0px))">
      <div class="calllog"><h4>What a Host Ping sounds like</h4>
        <div><span class="t">DNA Trails</span> Добар ден, Зоран. Утре во 12:30 доаѓаат двајца гости. Дома сте?</div>
        <div class="muted" style="font-size:13px;padding:0 0 6px">Good afternoon, Zoran. Two guests are coming tomorrow at 12:30. Will you be home?</div>
        <div><span class="t">Zoran</span> Дома сме. Мајка ми прави полнети пиперки.</div>
        <div class="muted" style="font-size:13px;padding:0 0 8px">We are home. My mother is making stuffed peppers.</div>
        <div style="display:flex;justify-content:flex-end">${A.stamp({a:'Confirmed',b:'15 May|12:30',c:'Zoran',size:96,rot:-8})}</div></div>
      <div class="sidecard"><h3>${ic('shield')} And if it still goes wrong</h3><p class="small">A confirmed stop that is closed when you arrive means a full refund.</p><a class="btn sm outline" href="#guarantee">Works or it's free</a></div>
    </aside>
  </div></section>
  <section class="section band-deep"><div class="wrap stack-lg"><div class="stack-sm"><span class="eyebrow">What we refuse to do</span><h2>Five things you will not find here</h2></div>
    <div class="grid g3">${[['No bookings, no commission','You pay hosts in cash, on the spot. We take nothing from them, so we have no reason to send you anywhere but the best table.'],['No subscription','One trail, one trip, one price per car.'],['No star ratings','A host is either on the call list and answering, or not on a trail.'],['No trail we have not driven','If none of us has stood there, it is on the map page, not on the shelf.'],['No crowds by design','Each trail takes a few cars a day. When it is full, it is full.'],['No password','A six-digit code signs you in. Your profile keeps your passes, receipts and stamps.']].map(x=>`<div class="stack-sm"><h3>${x[0]}</h3><p class="muted">${x[1]}</p></div>`).join('')}</div></div></section>
  <section class="section"><div class="wrap stack center"><h2>Ready when you are</h2><div class="row" style="justify-content:center"><a class="btn lg" href="#trails">Find a trail</a><a class="btn lg outline" href="#faqs">Read the FAQs</a></div></div></section>`,
  init(){ A.watchHelix($('#howHelix')); }});

/* ---------- the guarantee ---------- */
R.guarantee=()=>({title:"Works or it's free",html:`
  <section class="pagehead deep"><div class="wrap headsplit"><div class="stack-sm"><span class="eyebrow">The guarantee</span><h1>Works or it's free.</h1><p class="sub">If a stop we confirmed is closed when you arrive, you get every cent of your pass back.</p></div>${A.stamp({a:'Works or',b:"It's free",c:'No forms',size:170,rot:-10,land:true})}</div></section>
  <section class="section"><div class="wrap narrow stack-lg">
    <p class="lead">A planner that guesses cannot guarantee anything. We can, because we do not guess. We called.</p>
    <div class="grid g2">
      <div class="sidecard"><h3>${ic('check')} You get a full refund when</h3><ul class="notes"><li>${ic('stamp')}<span>A stop stamped <b>confirmed</b> is closed, or the host is not there, within an hour of the time on your pass.</span></li><li>${ic('road')}<span>Our road notes for your car class were wrong and you could not reach a stop.</span></li></ul></div>
      <div class="sidecard"><h3>${ic('info')} It is not a refund when</h3><ul class="notes"><li>${ic('phone')}<span>A host cancelled the evening before and we told you, with the backup confirmed. That is the system working.</span></li><li>${ic('sun')}<span>A weather stop is called off, like the boat to Golem Grad. That stop comes off your price instead.</span></li><li>${ic('clock')}<span>You arrive more than an hour late without telling us. Hosts have their own day.</span></li></ul></div>
    </div>
    <div class="stack"><h2>How to claim</h2><div class="steps three"><div><h3>Tap one button</h3><p>"This stop is closed", on the road view. It works offline and sends when you next have signal.</p></div><div><h3>We call the host</h3><p>Right then. Sometimes she is in the garden. If nobody answers, that is the end of the checking.</p></div><div><h3>Money back</h3><p>The full price of the pass, to the card you paid with, within five working days. You keep the rest of the trail.</p></div></div></div>
    <div class="notice gold">${ic('cash')}<span><b>How we afford it.</b> About EUR 1 from every pass goes into a guarantee reserve. A host who misses twice comes off every trail until we have visited them again.</span></div>
    <p class="small muted">Plain-language summary. The full wording is in the <a href="#terms">terms</a>, which are a draft for a lawyer to review before launch.</p>
  </div></section>`});

/* ---------- hosts ---------- */
R.hosts=()=>{
  const stopsOf=id=>A.allStops.filter(s=>s.host===id);
  return {title:'Hosts',html:`
  ${head('Hosts, not listings','The people who are expecting you.','A first name, a face, and a phone that gets answered.')}
  <section class="section tight"><div class="wrap stack-lg">
    <p class="lead">There are ${Object.keys(D.HOSTS).length} hosts on the call list this season. None of them has a contract with us and none pays us anything. Each one agreed to a single thing: to be called the day before a visitor comes. </p><p class="small muted">${A.sample('Sample hosts')} Real names and portraits arrive with the first driven trails.</p>
    <div class="grid g3">${Object.entries(D.HOSTS).map(([id,h])=>{ const st=stopsOf(id)[0]; const t=st&&A.trails[st.trail]; return `<article class="hcard"><div class="hc-top">${A.face(h.face,72)}<div><h3>${esc(h.name)}</h3><span class="where">${esc(h.role)}<br>${esc(h.where)}</span></div></div><p>${esc(h.line)}</p><div class="hc-meta"><span>${ic('phone')} ${esc(h.phone)}</span><span>${esc(h.since)}</span></div>${t?`<a class="small" href="#trail-${t.id}">On the trail: ${esc(t.title)}</a>`:''}</article>`; }).join('')}</div>
  </div></section>
  <section class="section band-pass"><div class="wrap split">
    <div class="stack"><span class="eyebrow">If you are a host</span><h2>We only ask one question.</h2><p class="quote">"May we call you the day before a visitor comes?"</p><p>If you cook, pour, bake, weave, keep bees or keep a key, and you would welcome a few visitors a week, that is all we need. Guests pay you directly. We never take a share, and you can say no on any day.</p><div class="row"><a class="btn" href="#contact">Tell us about yourself</a><span class="small muted">Or about a neighbour who should be on a trail.</span></div></div>
    <div class="sidecard"><h3>What being on the call list means</h3><ul class="notes"><li>${ic('phone')}<span>One call or Viber message the evening before, in Macedonian, with the time and how many people.</span></li><li>${ic('cash')}<span>Guests pay you in cash. No commission, no listing fee, no contract.</span></li><li>${ic('qr')}<span>A small stamp card for your door, so guests can collect your stamp.</span></li><li>${ic('users')}<span>Never more than a few cars a day. You set the limit.</span></li><li>${ic('close')}<span>Miss two confirmed visits and you come off the trails until we have talked.</span></li></ul></div>
  </div></section>`};
};

/* ---------- partners ---------- */
R.partners=()=>({title:'For partners',html:`
  ${head('For partners','Put your area on a trail. Put a trail in your guests\' hands.','For municipalities, development programmes, rental desks, hotels and agencies.')}
  <section class="section"><div class="wrap stack-lg">
    <div class="split" style="align-items:start">
      <div class="stack"><span class="tag pack" style="align-self:flex-start">Sponsored trail builds</span><h2>We research, drive, verify and publish a trail through your area.</h2><p>For municipalities, regional development centres, donor programmes and producer associations. You fund the build. Travellers buy the pass. Hosts keep everything guests spend.</p>
        <dl class="kv"><dt>A build</dt><dd>EUR 4,000 to 8,000 per trail, depending on length and audio</dd><dt>Upkeep</dt><dd>EUR 1,000 a year: re-driving, call list, corrections</dd><dt>You receive</dt><dd>A live trail on the shelf, and a season report</dd></dl>
        <div class="notice gold">${ic('shield')}<span><b>One rule.</b> A sponsor pays for a trail to exist in its area. It cannot buy a place on it for a host who fails verification.</span></div>
        <div><a class="btn" href="#contact">Talk to us about a trail</a></div></div>
      <div class="receipt" style="max-width:none"><h4>Season report · sample</h4><p style="text-align:center">Maleševo Highlands · May to October</p><div style="margin:10px 0"><div class="rl"><span>Passes sold</span><span>214</span></div><div class="rl"><span>Visitors (2.6 per car)</span><span>556</span></div><div class="rl"><span>Host visits confirmed</span><span>612</span></div><div class="rl"><span>Closed on arrival</span><span>3</span></div><div class="rl"><span>Hosts on the call list</span><span>7</span></div></div><p style="text-align:center">Left with families in the area, about</p><div class="big">EUR 13,300</div><p style="text-align:center;font-size:13px">Illustration of the report format. Not real results.</p></div>
    </div>
    <hr class="perf">
    <div class="split" style="align-items:start">
      <div class="stack"><span class="tag quest" style="align-self:flex-start">Wholesale codes</span><h2>Hand your guests a weekend that works.</h2><p>For car rental desks, hotels, hostels and agencies. A rental desk already has the customer, the car and the dates. Add the trail.</p>
        <dl class="kv"><dt>Price</dt><dd>EUR 6 to 10 per code, in blocks of 50</dd><dt>How</dt><dd>Printed QR cards for the desk. The guest picks a trail and a date.</dd><dt>You can</dt><dd>Bundle it with the rental or room, or resell at full price</dd><dt>Agencies</dt><dd>License trails for your own self-drive packages</dd></dl>
        <div><a class="btn outline" href="#contact">Ask for a sample pack</a></div></div>
      <div class="stack center">${A.ticket({trail:A.trails.galicnik,code:'DESK-0412'})}<p class="small muted">A desk card carries a code instead of a price. The guest chooses the date.</p></div>
    </div>
    <p class="small muted">Prices on this page are working figures for discussion, not a public price list.</p>
  </div></section>`});

/* ---------- Our DNA ---------- */
R['our-dna']=()=>({title:'Our DNA',html:`
  ${head('Our DNA','Exploration is in our DNA.','A small team from Macedonia that got tired of sending friends to closed doors.',true)}
  <section class="section"><div class="wrap split" style="align-items:start">
    <div class="prose">
      <h2>From a marketplace to a phone call</h2>
      <p>DNA Trails started as a marketplace: travellers on one side, rural hosts on the other, bookings in the middle. We researched more than three thousand places, visited villages, sat at a lot of tables. And we kept hitting the same wall. The cheese maker has no website. The key to the church is with a neighbour. The road turns to gravel four kilometres early. The guesthouse answers Viber, in Macedonian, after six in the evening.</p>
      <p>Finding places was never the hard part. Any map can do that, and now any AI can too. The hard part is whether it will work on Tuesday.</p>
      <p>So we stopped building a booking engine and kept the one thing no app could copy: we know these people, we speak the language, and we are willing to pick up the phone. That became the product. A trail we have driven, hosts we have called, and a promise that it works or it is free.</p>
      <h2>What we believe</h2>
      <ul><li><b>Authenticity.</b> If we have not stood there, we do not sell it.</li><li><b>Sustainability.</b> A few cars a day, and every euro a guest spends stays with the family who earned it.</li><li><b>Community.</b> Hosts are neighbours with a phone number, never inventory.</li><li><b>Curiosity.</b> The best stop is usually the one after the asphalt ends.</li></ul>
    </div>
    <div class="stack"><div class="photo taped">${A.img('hero-1','A village road in rural Macedonia')}</div>
      <div class="sidecard"><h3>The old slogans, at work</h3><div class="tablewrap"><table><tbody>
        <tr><th>Exploration is in our DNA</th><td>Still the line over the door.</td></tr>
        <tr><th>Your Passport to Authenticity</th><td>Now an actual passport, with stamps.</td></tr>
        <tr><th>Hidden stories. Forgotten flavors. Roads less traveled.</th><td>The three layers of every trail.</td></tr>
        <tr><th>#FollowTheTrail</th><td>The start button, and the tag on a finished trail.</td></tr>
      </tbody></table></div></div></div>
  </div></section>
  <section class="section band-white"><div class="wrap stack-lg"><div class="stack-sm"><span class="eyebrow">The team</span><h2>The people who drive the trails</h2></div>
    <div class="team">${D.TEAM.map(m=>`<figure><img src="assets/img/${m[3]}.png" alt="${esc(m[0])}, ${esc(m[1])}" loading="lazy"><figcaption><b>${esc(m[0])}</b><span>${esc(m[2])}</span></figcaption></figure>`).join('')}</div></div></section>
  <section class="section band-deep"><div class="wrap stack center"><p class="quote" style="max-width:22ch">Go where you're expected.</p><a class="btn gold lg" href="#trails">Find a trail</a></div></section>`});

/* ---------- FAQs ---------- */
R.faqs=()=>({title:'FAQs',html:`
  ${head('Questions','FAQs','Short answers. If yours is missing, write to us.')}
  <section class="section tight"><div class="wrap narrow stack-lg">${D.FAQS.map(g=>`<div class="stack-sm"><h2>${esc(g[0])}</h2><div class="acc">${g[1].map(q=>`<details><summary>${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join('')}</div></div>`).join('')}
    <div class="row"><a class="btn" href="#contact">Ask something else</a><a class="btn outline" href="#guarantee">Read the guarantee</a></div></div></section>`});

/* ---------- contact ---------- */
R.contact=()=>{
  const sent=S.ui.contactSent;
  return {title:'Contact',html:`
  ${head('Contact','Write to us.','A trail idea, a host we should meet, a pass that needs help.')}
  <section class="section tight"><div class="wrap tgrid">
    ${sent?`<div class="stack" style="align-items:flex-start">${A.stamp({shape:'box',tone:'green',a:'Message noted',b:'Thank you',c:'We reply in 2 days',rot:-4,size:130,land:true})}<h2>Thanks, ${esc(sent)}.</h2><p class="lead">In the real product this lands with a person, and you hear back within two working days. In the prototype nothing was sent.</p><button class="btn outline" id="cAgain">Write another</button></div>`
    :`<form class="stack" id="cForm" novalidate>
      <div class="grid g2" style="gap:14px"><label class="field"><span>Your name</span><input id="cName" autocomplete="off"><span class="err" id="cErrN" hidden>What should we call you?</span></label><label class="field"><span>Email</span><input id="cEmail" type="email" autocomplete="off"><span class="err" id="cErrE" hidden>We need an email address to reply to.</span></label></div>
      <label class="field"><span>What is it about?</span><select id="cTopic"><option>A question about a trail</option><option>Help with my pass</option><option>I am a host, or know one</option><option>A road we should drive</option><option>Partnership</option><option>Something else</option></select></label>
      <label class="field"><span>Message</span><textarea id="cMsg"></textarea><span class="err" id="cErrM" hidden>A sentence or two is enough.</span></label>
      <div><button class="btn lg" type="submit">Send message</button></div></form>`}
    <aside class="stack"><div class="sidecard"><h3>${ic('mail')} Email</h3><span class="codebox" style="font-size:16px;letter-spacing:0">dnatrailsmk@gmail.com</span><button class="btn sm outline" data-copy="dnatrailsmk@gmail.com" style="align-self:flex-start">${ic('copy')}Copy address</button></div>
      <div class="sidecard"><h3>${ic('phone')} On the road right now?</h3><p class="small">Use "This stop is closed" in the road view. It reaches us faster than email and it works offline.</p></div>
      <div class="sidecard"><h3>Follow the trail</h3><div class="row">${[['ig','Instagram'],['fb','Facebook'],['tt','TikTok']].map(s=>`<a class="iconbtn" href="#contact" data-soon="${s[1]} would open in a new tab" aria-label="${s[1]}">${ic(s[0])}</a>`).join('')}</div></div></aside>
  </div></section>`,
  init(){ const ag=$('#cAgain'); if(ag) ag.addEventListener('click',()=>{ S.ui.contactSent=null; A.render(); }); const f=$('#cForm'); if(!f) return; f.addEventListener('submit',e=>{ e.preventDefault(); const n=$('#cName').value.trim(), em=$('#cEmail').value.trim(), ms=$('#cMsg').value.trim(); const bad=[[!n,'cErrN','cName'],[!/^\S+@\S+\.\S+$/.test(em),'cErrE','cEmail'],[ms.length<5,'cErrM','cMsg']]; bad.forEach(b=>$('#'+b[1]).hidden=!b[0]); const first=bad.find(b=>b[0]); if(first){ $('#'+first[2]).focus(); return; } S.ui.contactSent=n.split(' ')[0]; A.render(); }); }};
};

/* ---------- small print ---------- */
const legal=(title,sub,body)=>({title,html:`${head('Small print',title,sub)}<section class="section tight"><div class="wrap narrow"><div class="notice gold" style="margin-bottom:24px">${ic('info')}<span><b>Draft.</b> Written for the prototype so the pages have real shape. A lawyer must review it before launch.</span></div><div class="prose">${body}</div></div></section>`});
R.terms=()=>legal('Terms and guarantee','What you buy, what we promise, and where the promise ends.',`
  <h2>1. What a Trail Pass is</h2><p>A Trail Pass gives one car access to one self-guided trail on the dates you choose. It includes the route, last-kilometre notes, audio stories where available, and our evening-before confirmation calls to the hosts on the trail. It is not a package holiday. We do not provide transport, accommodation, meals or guiding.</p>
  <h2>2. Hosts are independent</h2><p>Hosts are private people and small businesses. You pay them directly for what they provide. DNA Trails takes no commission from hosts and is not a party to what you agree with them.</p>
  <h2>3. The guarantee</h2><p>If a stop shown as confirmed on your pass is closed, or the host is absent, when you arrive within one hour of the stated time, we refund the full price of the pass. The same applies if our road notes for the car class you declared were wrong and you could not reach a stop.</p><p>The guarantee does not apply where we told you about a change before your trail began and offered a confirmed backup, where a weather-dependent stop is called off (that stop is deducted from your price), or where you arrive more than one hour late without contacting us.</p>
  <h2>4. Changing or cancelling</h2><p>You can change your date free of charge until 18:00 on the evening before your trail starts. After that, hosts have been told to expect you. Cancellations before 18:00 on the evening before are refunded in full.</p>
  <h2>5. Driving and safety</h2><p>You drive at your own risk and are responsible for your vehicle, your insurance and your decisions on the road. Road notes describe conditions on the day we drove them and can change with weather. If a road looks unsafe, turn back, and tell us.</p>
  <h2>6. Capped trails</h2><p>Each trail has a daily limit on cars. A pass is valid only for the date on it.</p>`);
R.privacy=()=>legal('Privacy','What we keep, and the short list of what we do not.',`
  <h2>What we collect</h2><ul><li>Your pass: trail, dates, car class, number of people.</li><li>Your profile: a name, and a phone number or email, so we can send your confirmation and reach you on the day.</li><li>Payment is handled by a payment provider. We never see or store card numbers.</li></ul>
  <h2>What hosts are told</h2><p>The time you are expected, how many people, and anything you asked us to pass on, such as "no lamb". Not your surname, not your phone number.</p>
  <h2>Location</h2><p>The road view uses your phone's GPS to start stories and show the next stop. Your position stays on your phone. It is not sent to us.</p>
  <h2>What we do not do</h2><ul><li>No passwords. You sign in with a one-time code, and you can delete your profile at any time.</li><li>No advertising trackers.</li><li>No selling or sharing of personal data.</li></ul>
  <h2>Roots Trail requests</h2><p>What you tell us about your family is used only to make the calls needed to plan your trail, and is deleted on request.</p>`);
R.credits=()=>{
  const used=new Set(); D.TRAILS.forEach(t=>{ used.add(t.img); A.flat(t).forEach(s=>used.add(s.img)); }); D.SOON.forEach(s=>used.add(s.img)); ['village','hero-1'].forEach(k=>used.add(k));
  const cr=(window.CREDITS||[]).filter(c=>used.has(c.key));
  return {title:'Credits and sources',html:`
  ${head('Small print','Credits and sources','Where the data and the pictures in this prototype come from.')}
  <section class="section tight"><div class="wrap narrow stack-lg">
    <div class="stack"><h2>Data</h2><div class="tablewrap"><table><thead><tr><th>What</th><th>Source</th></tr></thead><tbody>
      <tr><td>Catalogue of ${A.fmt(A.totalPlaces)} places</td><td>DNA Trails field and desk research. ${A.fmt(MD.points.length)} entries have confirmed coordinates so far.</td></tr>
      <tr><td>Shaded relief</td><td>Open elevation tiles (Terrain Tiles on AWS, Mapzen), rendered for this map.</td></tr>
      <tr><td>Lakes, rivers, country outline</td><td>Natural Earth, public domain.</td></tr>
      <tr><td>Municipal and regional boundaries</td><td>Open administrative boundary data. Licence to be verified before launch.</td></tr>
      <tr><td>Tourist arrivals by municipality and month, 2023</td><td>State Statistical Office of the Republic of North Macedonia.</td></tr>
    </tbody></table></div></div>
    <div class="stack"><h2>What is sample content</h2><p>The six trails are built on real places with real coordinates. The hosts, their names, call notes, road notes, prices paid to hosts, availability and the passes are written for the design and marked as sample. They become real one driven trail at a time. Host portraits are drawings for the same reason.</p></div>
    <div class="stack"><h2>Photographs</h2><p class="small muted">Stand-in photographs from Wikimedia Commons under the licences shown, plus DNA Trails' own. They should be replaced or re-checked before launch.</p><div class="tablewrap"><table><thead><tr><th>Used for</th><th>Author</th><th>Licence</th></tr></thead><tbody>${cr.map(c=>`<tr><td>${esc(c.use)}</td><td>${esc(c.artist||'')}${c.src==='wm'?' · Wikimedia Commons':''}</td><td>${esc(c.lic||'')}</td></tr>`).join('')}</tbody></table></div></div>
    <div class="stack"><h2>Typefaces and marks</h2><p>Panton and Lato, as in the DNA Trails brand book. Courier Prime for typed notes. Logo and symbol: DNA Trails, August 2025 edition.</p></div>
  </div></section>`};
};
})();
