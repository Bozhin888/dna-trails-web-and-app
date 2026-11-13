/* DNA Trails prototype 2: home, the trail shelf, the trail page and buying a pass */
(function(){
const A=window.APP, D=window.DNA, MD=window.MAPDATA, ic=A.ic, esc=A.esc, S=A.state, $=A.$, $$=A.$$, R=A.routes;
const CT=MD.catTotals; A.totalPlaces=Object.values(CT).reduce((a,b)=>a+b,0)-CT.food;
const firstBookable=()=>A.addDays(A.today,2);   /* calls for tomorrow went out at 18:00 */
const buyState=t=>{ const u=S.ui.buy||(S.ui.buy={car:'regular',people:2}); if(!u.date||u.date<firstBookable()) u.date=A.addDays(A.today,8); if(t&&A.left(t.id,u.date)===0){ for(let i=2;i<14;i++){ const d=A.addDays(A.today,i); if(A.left(t.id,d)>0){u.date=d;break;} } } return u; };
A.buyState=buyState;

/* ---------- home ---------- */
R.home=()=>{
  const sp=A.pass('DNA-7K2M')||{trail:'tikves',date:'2027-05-15',car:'regular',people:2,code:'DNA-7K2M'}; const st=A.trails.tikves;
  const shelf=['galicnik','tikves','malesevo'].map(id=>A.trailCard(A.trails[id])).join('');
  const hosts=['zoran','teodora','riste','lence','ljupco'];
  const note={zoran:'Expecting you at 12:30. His mother is making stuffed peppers.',teodora:'Home, and cooking since morning. Asked how many of you eat spicy.',riste:'At the hut until 13:00. Kept a wheel of kashkaval for you.',lence:'Firing the oven for 12:15. One without egg, as you asked.',ljupco:'Lake is calm tomorrow. Be at the pier at 14:00.'};
  return {title:'DNA Trails',html:`
  <section class="hero"><div class="wrap">
    <div class="stack" style="gap:20px">
      <span class="eyebrow" style="color:var(--gold-hi)">Self-guided rural trails in Macedonia</span>
      <h1>The itinerary that <em>calls ahead.</em></h1>
      <p class="lead">A Trail is one to five days of villages, family tables and back roads. We drove it first. The evening before you go, we phone every host on your route. If a stop we confirmed is closed, your trail is free.</p>
      <div class="row"><a class="btn gold lg" href="#trails">Find a trail</a><a class="btn outline lg" href="#how-it-works">How it works</a></div>
      <p class="small" style="color:#B9CDBD">From EUR 12 per car, not per person. No subscription.</p>
    </div>
    <div class="hero-art">
      <div class="callnote c1">${A.face(D.HOSTS.zoran.face,38)}<span><b>Fri 18:40 · Zoran, Vataša</b>Expecting you at 12:30. His mother is making stuffed peppers.</span></div>
      ${A.ticket({trail:st,date:sp.date,car:sp.car,people:sp.people,code:sp.code,href:'#pass-'+sp.code,stamp:A.stamp({a:'Confirmed',b:A.dStamp(sp.date),c:st.nHosts+' hosts called',rot:-11,size:104,land:true,delay:500})})}
      <div class="callnote c2">${A.face(D.HOSTS.marija.face,38)}<span><b>Fri 18:52 · Marija</b>Table set in the yard for 11:15. Come hungry.</span></div>
    </div>
  </div></section>

  <section class="section tight" style="padding-bottom:0"><div class="wrap">${A.promise()}</div></section>

  <section class="section"><div class="wrap stack-lg">
    <div class="between"><div class="stack-sm"><span class="eyebrow">On the shelf</span><h2>Six trails. Every kilometre driven.</h2><p class="sub">No trail goes on sale until one of us has driven it.</p></div><a class="btn outline" href="#trails">See all six ${ic('arrow')}</a></div>
    <div class="grid g3">${shelf}</div>
  </div></section>

  <section class="section band-white"><div class="wrap stack-lg">
    <div class="stack-sm"><span class="eyebrow">How it works</span><h2>Other planners tell you where to go.<br>We find out if anyone is home.</h2></div>
    <div class="steps">
      <div><span class="when">Any time</span><h3>Pick a trail and a date</h3><p>Tell us what you are driving. One price covers everyone in the car.</p></div>
      <div><span class="when">18:00, the evening before</span><h3>We call every host</h3><p>In Macedonian, by phone or Viber. Each yes lands on your pass as a dated stamp. A no gets you the backup stop.</p></div>
      <div><span class="when">On the day</span><h3>Drive it offline</h3><p>Route, road notes for your car and audio stories are saved to your phone. No signal needed.</p></div>
      <div><span class="when">At every host</span><h3>Collect your stamps</h3><p>Each host stamps your passport. At the end you see what your trip left in the villages.</p></div>
    </div>
    <div class="row"><a class="btn" href="#how-it-works">The whole method</a><a class="linkbtn" href="#guarantee">Read the guarantee</a></div>
  </div></section>

  <section class="section band-mint"><div class="wrap stack-lg">
    <div class="between"><div class="stack-sm"><span class="eyebrow">Hosts, not listings</span><h2>Zoran is expecting you.</h2><p class="lead">No star ratings and no review counts. A first name, a face, and a phone that got answered last night. ${A.sample('Sample hosts')}</p></div><a class="btn outline" href="#hosts">Meet all ${Object.keys(D.HOSTS).length} ${ic('arrow')}</a></div>
    <div class="hostrow">${hosts.map(id=>{const h=D.HOSTS[id]; return `<article class="hcard"><div class="hc-top">${A.face(h.face,64)}<div><h3>${esc(h.name)}</h3><span class="where">${esc(h.role)} · ${esc(h.where)}</span></div></div><p class="typed">${esc(note[id])}</p><div class="hc-meta"><span>Last call: Fri 14 May</span><span class="driven">${ic('check')}Answered</span></div></article>`;}).join('')}</div>
  </div></section>

  <section class="section band-deep"><div class="wrap stack-lg">
    <div class="stack-sm"><span class="eyebrow">Three layers in every trail</span><h2>Our old slogan turned out to be the product.</h2></div>
    <div class="layers">
      <div>${ic('head')}<span class="slog">Hidden stories.</span><p>Audio that starts by itself as you drive past: the legend, the feud, the recipe. It runs on GPS, so it works with no signal at all.</p></div>
      <div>${ic('fork')}<span class="slog">Forgotten flavors.</span><p>Hosts who cook, pour, bake and milk, and who know you are coming because we told them. You pay them directly, in cash.</p></div>
      <div>${ic('road')}<span class="slog">Roads less traveled.</span><p>Last-kilometre notes from someone who drove it: where the asphalt ends for your car, the last ATM, the last pump, the loud dog.</p></div>
    </div>
  </div></section>

  <section class="section band-pass"><div class="wrap split">
    <div class="stack"><span class="eyebrow">The Passport</span><h2>Your Passport to Authenticity</h2><p class="lead">Every host has a stamp. Collect it on your phone when you arrive, or in the paper passport if you like ink on your fingers. Finish a trail and one strand of the helix fills in.</p><div class="row"><a class="btn" href="#passport">Open the passport</a><span class="small muted">Paper edition, EUR 15, from June.</span></div></div>
    <div class="row" style="justify-content:center;gap:4px 10px">${A.stamp({tone:'green',a:'Bistra · Galičnik',b:'Riste',c:'2 May 2027',rot:-9,size:128})}${A.stamp({a:'Galičnik',b:'Vesna',c:'2 May 2027',rot:6,size:128})}${A.stamp({shape:'box',tone:'rust',a:'Trail complete',b:'The High Road',c:'#FollowTheTrail',rot:-4,size:128})}</div>
  </div></section>

  <section class="section"><div class="wrap stack-lg">
    <div class="stack-sm"><span class="eyebrow">Two more ways in</span><h2>Compose your own, or follow your roots.</h2></div>
    <div class="grid g2">
      <article class="tcard"><div class="tc-body" style="padding:24px;gap:12px"><div class="row gap6"><span class="tag composed">Trip-it-Yourself</span><span class="tag line">EUR 29 per car</span></div><h3><a href="#trip-it-yourself">A trail composed for your dates</a></h3><p class="tc-sub">Three questions: when, what car, what appetite. The composer can only pick from stops we have verified, so it cannot invent a restaurant.</p><div class="row" style="margin-top:auto"><a class="btn" href="#trip-it-yourself">Compose a trail</a><span class="small muted">${A.verified.length} verified stops to draw from</span></div></div></article>
      <article class="tcard"><div class="tc-body" style="padding:24px;gap:12px"><div class="row gap6"><span class="tag roots">Roots Trail</span><span class="tag line">From EUR 190 per family</span></div><h3><a href="#roots">A trail to your family's village</a></h3><p class="tc-sub">For people living abroad who are coming back to their roots and family. Name the village. We find the road, the church, the oldest neighbour who remembers, and someone to meet you.</p><div class="row" style="margin-top:auto"><a class="btn" href="#roots">Start with a village</a><span class="small muted">Made by hand, one family at a time</span></div></div></article>
    </div>
  </div></section>

  <section class="section band-white"><div class="wrap split">
    <div class="stack"><span class="eyebrow">The research underneath</span><h2>We mapped the country before we sold a single trail.</h2><p class="lead">Every trail is cut from the same catalogue: villages, monasteries, waterfalls, wineries and hosts across all 80 municipalities. One page shows it all. Filter it, get ideas, then let a trail do the work.</p>
      <div class="grid g3" style="gap:16px"><div class="stat"><b>${A.fmt(A.totalPlaces)}</b><span>places researched</span></div><div class="stat"><b>${A.fmt(MD.points.length)}</b><span>placed on the map so far</span></div><div class="stat"><b>80</b><span>municipalities covered</span></div></div>
      <div class="row"><a class="btn outline" href="#map">Open the map</a></div></div>
    <div id="homeMap" style="height:380px"></div>
  </div></section>`,
  init(){ const m=A.makeMap($('#homeMap'),{interactive:false,zoomUi:false,regions:'outline',labels:'none',towns:false,dots:true,attrib:false}); m.setRoute(A.trailLines(D.TRAILS)); }};
};
/* route lines for one or more trails: road strand plus story strand */
A.trailLines=trails=>{ const out=[]; trails.forEach(t=>{ const pts=A.flat(t).map(s=>[s.x,s.y]); out.push({pts,cls:''},{pts,cls:'story'}); }); return out; };

/* ---------- the trail shelf ---------- */
R.trails=()=>{
  const f=S.ui.shelf||(S.ui.shelf='all'); const list=D.TRAILS.filter(t=>f==='all'||t.type===f);
  const chip=(k,l)=>`<button class="chip" data-shelf="${k}" aria-pressed="${f===k}">${l}</button>`;
  return {title:'Trails',html:`
  <section class="pagehead"><div class="wrap"><span class="eyebrow">The trail shelf</span><h1>Six trails, all driven.</h1><p class="sub">Every stop visited by one of us. Every host has agreed to be called.</p></div></section>
  <section class="section tight"><div class="wrap stack-lg">
    <div class="between"><div class="row" role="group" aria-label="Trail length">${chip('all','All trails')}${chip('quest','Quick Quest · one day')}${chip('pack','Pack & Go · a weekend')}${chip('long','Pack & Go · 3 to 5 days')}</div><span class="small muted">Availability shown for ${A.dLong(A.addDays(A.today,8))}. ${A.sample('Sample availability')}</span></div>
    <div class="grid g3">${list.map(A.trailCard).join('')}</div>
    <div class="stack"><div class="stack-sm"><span class="eyebrow">Being driven</span><h2>Not for sale yet</h2><p class="muted">We sell a trail only after two of us have driven it and every host has said yes to being called.</p></div>
      <div class="grid g3">${D.SOON.map(s=>`<article class="tcard soon"><div class="tc-media">${A.img(s.img,'')}</div><div class="tc-body"><div class="row gap6">${A.typeTag(s)}<span class="tag line">${esc(s.when)}</span></div><h3 style="color:var(--muted)">${esc(s.title)}</h3><p class="tc-sub">${esc(s.sub)}</p></div></article>`).join('')}
      <article class="tcard soon"><div class="tc-body" style="justify-content:center;gap:12px;padding:24px"><h3>Know a road we should drive?</h3><p class="tc-sub">Tell us about a village, a host or a stretch of gravel worth the trouble.</p><div><a class="btn outline sm" href="#contact">Suggest a trail</a></div></div></article></div></div>
  </div></section>
  <section class="section band-white"><div class="wrap stack-lg">
    <div class="stack-sm"><span class="eyebrow">One price per car</span><h2>What a trail costs</h2><p class="muted">Bought once, for one trip. No subscription. Hosts are paid by you, in cash, on the spot.</p></div>
    <div class="pricecards">
      <div class="pricecard"><span class="tag quest">Quick Quest</span><span class="p">EUR 12 <small>per car</small></span><p>A one-day trail with three or four stops.</p></div>
      <div class="pricecard"><span class="tag pack">Pack &amp; Go</span><span class="p">EUR 19 <small>per car</small></span><p>A weekend, with places to sleep that we have slept in.</p></div>
      <div class="pricecard"><span class="tag long">Pack &amp; Go, long</span><span class="p">EUR 29 <small>per car</small></span><p>Three to five days across a whole region.</p></div>
      <div class="pricecard"><span class="tag composed">Trip-it-Yourself</span><span class="p">EUR 29 <small>per car</small></span><p>Composed for your dates from verified stops only. <a href="#trip-it-yourself">Compose one</a></p></div>
    </div>
    ${A.promise()}
  </div></section>`,
  init(){ $$('[data-shelf]').forEach(b=>b.addEventListener('click',()=>{ S.ui.shelf=b.dataset.shelf; A.render(); })); }};
};

/* ---------- one stop, as shown on the trail page and on your pass ---------- */
/* ctx: {car, date (of this stop), mode:'sell'|'pass', pass, swapped:bool, got:bool} */
A.noteList=(s,car)=>`<ul class="notes"><li>${ic('road')}<span><b>${esc(D.CARS[car].label)}:</b> ${esc(s.road[car])}</span></li><li>${ic('cash')}<span>${esc(s.cash)}</span></li><li>${ic('fuel')}<span>${esc(s.fuel)}</span></li><li>${ic('signal')}<span>${esc(s.signal)}</span></li>${s.extra?`<li>${ic('info')}<span>${esc(s.extra)}</span></li>`:''}</ul>`;
A.stopCard=(s,i,ctx)=>{ const h=s.host&&D.HOSTS[s.host]; const p=ctx.pass; let hostBlock='', st='';
  if(h){ let stamp, note='';
    if(ctx.mode==='sell'){ const away=s.closed.includes(A.dow(ctx.date)); stamp=away?A.stamp({shape:'box',tone:'rust',ghost:true,a:'Away on '+A.WDL[A.dow(ctx.date)]+'s',b:'Backup',c:'Confirmed instead',rot:-3,size:84}):A.stamp({ghost:true,a:'We call',b:A.dStamp(A.addDays(ctx.date,-1)),c:h.name,rot:-6,size:88}); if(away) note=`<div class="hs-note swap"><b>${esc(h.name)} is away on ${A.WDL[A.dow(ctx.date)]}s</b>You get the backup instead: ${esc(s.backup)}.</div>`; }
    else if(ctx.swapped){ st='swap'; stamp=A.stamp({shape:'box',tone:'rust',a:'Changed '+A.dStamp(A.callDay(p)),b:'Backup',c:'Confirmed',rot:-4,size:88,land:ctx.land,delay:ctx.delay}); note=`<div class="hs-note swap"><b>Called ${A.dShort(A.callDay(p))}, ${ctx.callTime}</b>${esc(h.name)} is away that day. Your backup is confirmed: ${esc(s.backup)}.</div>`; }
    else if(p.stage==='booked'){ stamp=A.stamp({ghost:true,a:'We call',b:A.dStamp(A.callDay(p)),c:h.name,rot:-6,size:92}); }
    else if(p.closedStop===s.ref){ st='swap'; stamp=A.stamp({shape:'box',tone:'rust',a:'Closed on arrival',b:'Refunded',c:'Our mistake',rot:-5,size:88}); note=`<div class="hs-note swap"><b>Guarantee used</b>${esc(h.name)} confirmed and was not there. Your pass was refunded in full.</div>`; }
    else { const got=(p.got||[]).includes(s.ref); st=got?'done':''; stamp=got?A.stamp({tone:'green',a:A.shortWhere(s.where),b:h.name,c:A.dStamp(ctx.date)+' 2027',rot:-8,size:96}):A.stamp({a:'Confirmed',b:A.dStamp(ctx.date)+'|'+s.time,c:h.name,rot:-7,size:96,land:ctx.land,delay:ctx.delay}); note=`<div class="hs-note"><b>Called ${A.dShort(A.callDay(p))}, ${ctx.callTime} · ${esc(h.phone)}</b>${esc(s.note)}</div>`; }
    hostBlock=`<div class="hs-host">${A.hostChip(s.host,46)}${stamp}</div>${note}`;
  } else if(ctx.mode==='pass'&&(p.got||[]).includes(s.ref)) st='done';
  const story=s.story?`<div class="storyline">${ic('head')}<span><b>${esc(s.story.t)}</b> · ${s.story.mins} min${ctx.audio===false?'':' · starts by itself as you arrive'}</span></div>`:'';
  return `<article class="hstop" data-n="${i+1}" data-st="${st}">
   <div class="hs-head">${A.img(s.img,'')}<div><span class="hs-time">${s.time} · about ${A.hm(s.mins)}</span><h3>${esc(s.name)}</h3><span class="hs-where">${ic('pin')}${esc(s.where)}${h?'':' · no host, always open'}</span></div></div>
   <div class="hs-body"><p>${esc(s.what)}</p>${hostBlock}${story}
    <details class="more"${ctx.openNotes?' open':''}><summary>Last-kilometre notes for a ${esc(D.CARS[ctx.car].label.toLowerCase())}</summary><div>${A.noteList(s,ctx.car)}${h&&s.backup&&ctx.mode==='sell'&&!s.closed.includes(A.dow(ctx.date))?`<p class="small muted" style="margin-top:10px"><b>If ${esc(h.name)} cannot make it:</b> ${esc(s.backup)}.</p>`:''}</div></details>
   </div></article>`; };
A.legRow=(a,b)=>{ const l=A.leg(a,b); return l.km?`<div class="sleep">${ic('car')}<span>about ${l.km} km · ${A.hm(l.min)} to the next stop</span></div>`:''; };
A.routeList=(t,ctx)=>{ let i=0, html=''; const callTimes=['18:05','18:12','18:20','18:31','18:40','18:52','19:03','19:08']; let hc=0;
  t.days.forEach((d,di)=>{ const date=A.addDays(ctx.date,di); if(t.days.length>1) html+=`<div class="hday">Day ${di+1} · ${esc(d.t)} <span>${A.dLong(date)}</span></div>`;
    d.stops.forEach((s,si)=>{ const c=Object.assign({},ctx,{date}); if(s.host){ c.callTime=callTimes[hc%callTimes.length]; c.delay=250+hc*320; hc++; } if(ctx.swaps) c.swapped=ctx.swaps.includes(s.ref); html+=A.stopCard(s,i,c); i++; if(si<d.stops.length-1) html+=A.legRow(s,d.stops[si+1]); });
    if(d.sleep) html+=`<div class="sleep">${ic('bed')}<span>${esc(d.sleep)}</span></div>`; });
  return `<div class="helixlist">${html}</div>`; };
A.trailPins=(t,statusFn)=>A.flat(t).map((s,i)=>({x:s.x,y:s.y,n:i+1,key:s.ref,title:s.name,sub:s.where,color:statusFn?statusFn(s,i):(s.host?'#1C562B':'#7D6C1F')}));

/* ---------- trail page ---------- */
R.trail=id=>{
  const t=A.trails[id]; if(!t) return R.lost();
  const u=buyState(t); const ty=D.TYPES[t.type]; const left=A.left(t.id,u.date); const away=A.closedOn(t,u.date); const carIss=A.carIssues(t,u.car);
  const chips=Array.from({length:8},(_,i)=>A.addDays(A.today,i+2)).map(d=>{ const n=A.left(t.id,d); const dt=A.parse(d); return `<button data-date="${d}" class="${n<=1?'low':''}" aria-pressed="${u.date===d}" ${n===0?'disabled':''}><span>${A.WD[dt.getDay()]}</span><b>${dt.getDate()}</b><small>${n===0?'full':n+' left'}</small></button>`; }).join('');
  const cash=Math.round(A.spend(t)*u.people/2/5)*5;
  return {title:t.title,html:`
  <section class="thead">${A.img(t.img,'','loading="eager"')}<div class="wrap">
    <a class="crumb" href="#trails">${ic('back')}All trails</a>
    <div class="row gap6">${A.typeTag(t)}<span class="tag line" style="color:#fff;border-color:rgba(255,255,255,.4)">${esc(A.daysLabel(t))}</span><span class="tag line" style="color:#fff;border-color:rgba(255,255,255,.4)">${esc(A.regions[t.region].name)} region</span></div>
    <h1>${esc(t.title)}</h1><p class="sub">${esc(t.sub)}</p>
    <div class="facts"><span>${ic('flag')}${t.nStops} stops, ${t.nHosts} hosts called</span><span>${ic('car')}about ${t.km} km from ${esc(t.start)}</span><span>${ic('sun')}${esc(t.best)}</span><span>${ic('users')}${t.cap} cars a day, no more</span>${t.audio?`<span>${ic('head')}Audio stories</span>`:''}</div>
  </div></section>
  <section class="section tight"><div class="wrap tgrid">
    <div class="stack-lg">
      <div class="stack"><p class="lead">${esc(t.pitch)}</p>
        <div class="row" style="gap:18px">${A.stamp({shape:'box',tone:'green',a:'Driven',b:t.driven.replace(' 2027',''),c:'Every kilometre',rot:-4,size:92})}<p class="small muted" style="max-width:46ch">Driven by ${esc(t.drivenBy)} in a small rental and a high car. Every host on it has agreed to be called before a visitor comes. ${A.sample()}</p></div></div>
      <div class="stack"><div class="between"><h2>The route</h2><span class="small muted"><span style="color:var(--green);font-weight:700">Green strand:</span> the road. <span style="color:var(--gold-ink);font-weight:700">Gold strand:</span> the story. Stops are the rungs.</span></div>
        ${A.routeList(t,{mode:'sell',car:u.car,date:u.date,audio:t.audio})}</div>
      <div class="stack"><h2>On the map</h2><div id="tMap" style="height:420px"></div></div>
      <div class="notice gold">${ic('cash')}<span><b>Bring about EUR ${cash} in cash</b> for ${u.people} ${u.people===1?'person':'people'}. That is what the hosts on this trail charge for food, tastings and entry. You pay them directly. We take nothing from them.</span></div>
    </div>
    <aside class="buybox" aria-label="Get this trail">
      <div class="price"><b>EUR ${t.price}</b><span>per car, ${esc(ty.len.toLowerCase())}</span></div>
      <div class="stack-sm"><span class="flabel">Start date</span><div class="datechips" role="group" aria-label="Start date">${chips}</div><span class="small" style="color:var(--pass-ink)">${left} of ${t.cap} cars left on ${A.dLong(u.date)}. ${A.sample()}</span></div>
      <div class="stack-sm"><span class="flabel">What are you driving?</span><div class="carpick" role="group" aria-label="Car">${Object.entries(D.CARS).map(([k,c])=>`<button data-car="${k}" aria-pressed="${u.car===k}">${esc(c.label)}<small>${esc(c.hint)}</small></button>`).join('')}</div></div>
      <div class="row" style="justify-content:space-between"><span class="flabel">People in the car</span><span class="stepper"><button data-ppl="-1" aria-label="Fewer">${ic('minus')}</button><b>${u.people}</b><button data-ppl="1" aria-label="More">${ic('plus')}</button></span></div>
      ${carIss.map(s=>`<div class="notice">${ic('car')}<span><b>${esc(s.name)}</b> needs more car than a ${esc(D.CARS[u.car].label.toLowerCase())}. ${esc(s.road[u.car])}</span></div>`).join('')}
      ${away.map(s=>`<div class="notice">${ic('info')}<span><b>${esc(D.HOSTS[s.host].name)} is away on ${A.WDL[A.dow(A.addDays(u.date,s.day))]}s.</b> You get the confirmed backup for that stop.</span></div>`).join('')}
      <div class="notice ok">${ic('phone')}<span>We call ${t.nHosts===1?'your host':'all '+t.nHosts+' hosts'} on <b>${A.dLong(A.addDays(u.date,-1))}</b> from 18:00 and stamp your pass.</span></div>
      <button class="btn lg block" id="buyBtn">Get this pass · EUR ${t.price}</button>
      <p class="small" style="color:var(--pass-ink)">${ic('shield')} <b>Works or it's free.</b> A confirmed stop that is closed means a full refund. Change your date free until 18:00 the evening before.</p>
    </aside>
  </div></section>
  <section class="section band-white"><div class="wrap stack-lg"><h2>More from the shelf</h2><div class="grid g3">${D.TRAILS.filter(x=>x.id!==t.id).slice(0,3).map(A.trailCard).join('')}</div></div></section>`,
  init(){
    A.watchHelix($('.helixlist'));
    const m=A.makeMap($('#tMap'),{regions:'outline',labels:'towns',towns:true,pins:A.trailPins(t),route:A.trailLines([t]),onPin:k=>{ const s=A.stopIndex[k]; const el=$$('.hstop')[s.n-1]; if(el) el.scrollIntoView({behavior:'smooth',block:'center'}); }}); m.fit(A.flat(t).map(s=>[s.x,s.y]),150);
    $$('[data-date]').forEach(b=>b.addEventListener('click',()=>{ u.date=b.dataset.date; A.render(); }));
    $$('[data-car]').forEach(b=>b.addEventListener('click',()=>{ u.car=b.dataset.car; A.render(); }));
    $$('[data-ppl]').forEach(b=>b.addEventListener('click',()=>{ u.people=Math.max(1,Math.min(7,u.people+ +b.dataset.ppl)); A.render(); }));
    $('#buyBtn').addEventListener('click',()=>A.checkout({trail:t.id,date:u.date,car:u.car,people:u.people},t));
  }};
};

/* ---------- checkout (no card form in the prototype) ---------- */
A.checkout=(order,t)=>{
  const o=A.modal(`<span class="eyebrow">Almost yours</span><h2>${esc(t.title)}</h2>
   <dl class="kv"><dt>Dates</dt><dd>${t.days.length>1?A.dLong(order.date)+' to '+A.dLong(A.addDays(order.date,t.days.length-1)):A.dLong(order.date)}</dd><dt>Car</dt><dd>${esc(D.CARS[order.car].label)}, ${order.people} aboard</dd><dt>We call</dt><dd>${A.dLong(A.addDays(order.date,-1))}, from 18:00</dd><dt>Price</dt><dd><b>EUR ${t.price}</b>, once, for the whole car</dd></dl>
   <label class="field"><span>Phone or Viber for the evening-before message</span><input id="coPhone" type="tel" inputmode="tel" placeholder="+389 7X XXX XXX" autocomplete="off"></label>
   <div class="notice gold">${ic('info')}<span>This is where card payment happens. In the prototype nothing is charged and no card is asked for.</span></div>
   <div class="row"><button class="btn lg" id="coPay">Pay EUR ${t.price} and get my pass</button><button class="btn outline" data-close>Not yet</button></div>
   <p class="small muted">No account needed. Your pass has a code. The code opens your trail on any phone.</p>`);
  $('#coPay',o).addEventListener('click',()=>{ const p=A.buy(order); A.closeModal(); S.ui.fresh=p.code; A.go('pass-'+p.code); A.toast(`${ic('check')} Pass ${p.code} is yours`); });
};

R.lost=()=>({title:'Off the trail',html:`<section class="section"><div class="wrap empty">${A.stamp({shape:'box',tone:'rust',a:'Page not found',b:'404',c:'Not on any trail',rot:-5,size:120})}<h1>You have wandered off the trail</h1><p class="lead muted">This page does not exist. The good news: nobody was expecting you here, so nobody is waiting.</p><div class="row" style="justify-content:center"><a class="btn" href="#trails">Back to the trails</a><a class="btn outline" href="#home">Home</a></div></div></section>`});
})();
