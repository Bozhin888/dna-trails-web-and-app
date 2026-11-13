/* DNA Trails prototype 2: the mobile app, as designed screens.
   Every screen is a fixed sample state (the Tikveš weekend of the sample account), linked into a click-through. */
(function(){
const A=window.APP, D=window.DNA, GEO=window.GEO, ic=A.ic, esc=A.esc, S=A.state, $=A.$, $$=A.$$, R=A.routes, H=D.HOSTS;
const T=A.trails.tikves, FL=A.flat(T), U=A.SAMPLE_USER();
const P={code:'DNA-7K2M',trail:'tikves',date:'2027-05-15',car:'regular',people:2,stage:'confirmed',got:[]};
const go=id=>`href="#app-${id}"`;
const img=k=>`assets/img/${k}.jpg`;
const sat=A.addDays(A.today,8);

/* ---------- chrome ---------- */
const status=()=>`<div class="ph-status" aria-hidden="true"><b>9:41</b><span class="ph-sys"><svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".7"/><rect x="5" y="5" width="3" height="7" rx=".7"/><rect x="10" y="2.5" width="3" height="9.5" rx=".7"/><rect x="15" y="0" width="3" height="12" rx=".7"/></svg><svg viewBox="0 0 26 12"><rect x=".7" y=".7" width="21" height="10.6" rx="3" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="2.4" y="2.4" width="15" height="7.2" rx="1.6"/><rect x="23.2" y="4" width="2" height="4" rx="1"/></svg></span></div>`;
const TABS=[['trails','route','Trails'],['map','pin','Map'],['mytrail','ticket','My trail'],['passport','stamp','Passport'],['profile','user','Profile']];
const tabs=cur=>`<nav class="ph-tabs" aria-label="App tabs">${TABS.map(t=>`<a ${go(t[0])} class="${t[0]==='mytrail'?'mid':''}" ${cur===t[0]?'aria-current="page"':''}>${t[0]==='mytrail'?`<span class="bub">${ic(t[1])}</span>`:ic(t[1])}<span>${t[2]}</span></a>`).join('')}</nav>`;
const top=(eyebrow,title,right)=>`<header class="ph-top"><div><small>${eyebrow}</small><h1>${title}</h1></div>${right||''}</header>`;
const nav=(back,title,right)=>`<div class="ph-nav"><a class="ph-round" ${go(back)} aria-label="Back">${ic('back')}</a><b>${title||''}</b>${right||'<span class="ph-round ghost"></span>'}</div>`;
const av=(size)=>`<a ${go('profile')} class="ph-av" aria-label="Profile">${A.avatar(U,size||38)}</a>`;
const row=(icon,label,sub,to,extra)=>`<a class="ph-row" ${to?(to[0]==='#'?`href="${to}"`:go(to)):''}>${ic(icon)}<span><b>${label}</b>${sub?`<small>${sub}</small>`:''}</span>${extra||ic('chev')}</a>`;
const hostsOf=t=>[...new Set(A.flat(t).filter(s=>s.host).map(s=>s.host))];
const faces=(ids,size)=>`<span class="ph-faces">${ids.map(h=>A.face(H[h].face,size||28)).join('')}</span>`;

/* a compact two-strand route list with fixed row height, so it needs no measuring */
const ROWH=76;
const routeList=(stops,st)=>{ const n=stops.length, h=n*ROWH, cx=22, amp=11; let a='',b='';
  for(let y=6;y<=h-6;y+=3){ const dx=amp*Math.sin(Math.PI*(y-ROWH/2)/ROWH+Math.PI/2); a+=(a?'L':'M')+(cx+dx).toFixed(1)+','+y; b+=(b?'L':'M')+(cx-dx).toFixed(1)+','+y; }
  const rungs=stops.map((s,i)=>{ const y=i*ROWH+ROWH/2; return `<g class="rung ${st?st(s,i):''}"><circle cx="${cx}" cy="${y}" r="11"/><text x="${cx}" y="${y+4}">${s.n||i+1}</text></g>`; }).join('');
  return `<div class="ph-route" style="--rh:${ROWH}px"><svg class="helixv" viewBox="0 0 44 ${h}" width="44" height="${h}" aria-hidden="true"><path class="strand story" d="${b}"/><path class="strand road" d="${a}"/>${rungs}</svg>
   ${stops.map(s=>`<div class="ph-stop"><span class="tm">${s.time}</span><span class="w"><b>${esc(s.name)}</b><small>${esc(A.shortWhere(s.where))}${s.host?' · '+esc(H[s.host].name):' · no host, always open'}</small></span>${s.host?A.face(H[s.host].face,34):`<span class="ph-open">Open</span>`}</div>`).join('')}</div>`; };

/* ---------- screens ---------- */
const SC=[];
const add=(id,group,title,note,o)=>SC.push(Object.assign({id,group,title,note},o));

add('welcome','Start','Welcome','First launch. One promise, two ways in.',{dark:true,html:()=>`
 <div class="ph-hero" style="background-image:linear-gradient(180deg,rgba(19,43,24,.55),rgba(19,43,24,.96) 62%),url(${img('hero-1')})">
  <img class="ph-logo" src="assets/logo/logo-white.svg" alt="DNA Trails">
  <div class="ph-herotext"><span class="eyebrow">Self-guided rural trails in Macedonia</span><h1>The itinerary that <em>calls ahead.</em></h1>
   <ul class="ph-promise"><li>${ic('phone')}<span>We phone every host the evening before you go.</span></li><li>${ic('shield')}<span>A confirmed stop that is closed means your trail is free.</span></li><li>${ic('wifi')}<span>Route, notes and stories work with no signal.</span></li></ul></div>
  <div class="ph-actions"><a class="btn gold lg" ${go('signup')}>Create my profile</a><a class="btn outline lg" ${go('signup')}>${ic('qr')}I have a code</a><a class="ph-textlink" ${go('signup')}>Already travelling with us? Sign in</a></div>
 </div>`});

add('signup','Start','Create a profile','Name, email or mobile, then a six-digit code. No password.',{html:()=>`
 ${nav('welcome','')}
 <div class="ph-pad stack">
  <div class="stack-sm"><h1>Your profile</h1><p class="muted">It keeps your passes, receipts and stamps, and tells us where to send the hosts' answers.</p></div>
  <div class="ph-field"><small>Your name</small><div>Ana Stojanovska</div></div>
  <div class="ph-field on"><small>Email or mobile number</small><div>ana@example.com</div></div>
  <div class="stack-sm"><span class="flabel">Six-digit code we sent you</span><div class="ph-code"><i>4</i><i>8</i><i>2</i><i>0</i><i>1</i><i class="cur"></i></div><p class="small muted">No password. A new code each time you sign in on a new phone.</p></div>
  <a class="btn lg" ${go('trails')}>Confirm and continue</a>
  <div class="ph-or"><span>or</span></div>
  <a class="btn outline" ${go('trails')}>Continue with Apple</a><a class="btn outline" ${go('trails')}>Continue with Google</a>
 </div>`});

add('trails','Find','Trails','The shelf. Six driven trails, with what is left for the weekend.',{tab:'trails',html:()=>`
 ${top('Friday 14 May','Trails',av())}
 <div class="ph-chips"><span class="chip" aria-pressed="true">All trails</span><span class="chip">One day</span><span class="chip">A weekend</span><span class="chip">3 to 5 days</span></div>
 <div class="ph-pad stack">
  ${D.TRAILS.map((t,i)=>{ const left=A.left(t.id,sat); return `<a class="ph-card" ${go(t.id==='tikves'?'trail':'trail')}><div class="ph-cardimg" style="background-image:url(${img(t.img)})"><span class="ph-price">EUR ${t.price}<small> per car</small></span>${t.audio?`<span class="ph-pill">${ic('head')}Audio</span>`:''}</div>
   <div class="ph-cardbody"><div class="row gap6">${A.typeTag(t)}<span class="tag line">${esc(A.daysLabel(t))}</span></div><h3>${esc(t.title)}</h3><p>${esc(t.sub)}</p>
   <div class="between">${faces(hostsOf(t).slice(0,4))}<span class="left ${left<=1?'low':''}">${left?left+' of '+t.cap+' cars left Sat':'Full on Sat'}</span></div></div></a>`; }).join('')}
  <a class="ph-banner" ${go('compose')}>${ic('sparkle')}<span><b>Dates that fit none of these?</b><small>Compose a trail from stops we have driven</small></span>${ic('chev')}</a>
 </div>`});

add('trail','Find','Trail page','One trail: the route, the hosts, and one button.',{html:()=>`
 <div class="ph-photo" style="background-image:linear-gradient(180deg,rgba(19,43,24,.25),rgba(19,43,24,0) 40%,rgba(19,43,24,.85)),url(${img(T.img)})">
  <div class="ph-nav over"><a class="ph-round" ${go('trails')} aria-label="Back">${ic('back')}</a><span class="ph-round">${ic('share')}</span></div>
  <div class="ph-phototext"><div class="row gap6">${A.typeTag(T)}<span class="tag line" style="color:#fff;border-color:rgba(255,255,255,.6)">2 days · Vardar</span></div><h1>${esc(T.title)}</h1></div>
 </div>
 <div class="ph-pad stack">
  <div class="ph-facts"><span>${ic('pin')}6 stops</span><span>${ic('users')}3 hosts called</span><span>${ic('head')}Audio stories</span><span>${ic('car')}4 cars a day</span></div>
  <p>${esc(T.pitch)}</p>
  <div class="row" style="gap:12px">${A.stamp({shape:'box',tone:'green',a:'Driven',b:'24 APR',c:'Every kilometre',size:78,rot:-4})}<p class="small muted" style="flex:1">Driven by two of us in a small rental and a high car. Every host agreed to be called. ${A.sample()}</p></div>
  ${T.days.map((d,di)=>`<div class="stack-sm"><span class="ph-day">Day ${di+1} · ${esc(d.t)}</span>${routeList(FL.filter(s=>s.dayIdx===di))}</div>`).join('')}
  <div class="notice gold">${ic('cash')}<span>Bring about <b>EUR 80</b> in cash for two. Hosts are paid by you, directly.</span></div>
 </div>`,cta:()=>`<div class="ph-cta"><span class="ph-ctaprice"><b>EUR ${T.price}</b><small>per car, a weekend</small></span><a class="btn lg" ${go('checkout')}>Choose a date</a></div>`});

add('checkout','Find','Date and payment','A sheet over the trail: date, car, people, pay. The profile already holds the rest.',{html:()=>`
 <div class="ph-photo dim" style="background-image:linear-gradient(180deg,rgba(19,43,24,.7),rgba(19,43,24,.85)),url(${img(T.img)})"><div class="ph-phototext"><h1>${esc(T.title)}</h1></div></div>`,
 sheet:()=>`<div class="ph-sheet tall"><i class="grab"></i>
  <div class="between"><h2>Pick your date</h2><a class="ph-round sm" ${go('trail')} aria-label="Close">${ic('close')}</a></div>
  <div class="datechips">${Array.from({length:8},(_,i)=>{ const d=A.addDays(A.today,2+i), n=A.left('tikves',d), dt=A.parse(d); return `<button ${i===6?'aria-pressed="true"':'aria-pressed="false"'} ${n?'':'disabled'}><span>${A.WD[dt.getDay()]}</span><b>${dt.getDate()}</b><small>${n?n+' left':'full'}</small></button>`; }).join('')}</div>
  <div class="carpick">${Object.entries(D.CARS).map(([k,c])=>`<button aria-pressed="${k==='regular'}">${esc(c.label)}<small>${esc(c.hint)}</small></button>`).join('')}</div>
  <div class="between"><span class="flabel">People in the car</span><span class="stepper"><button aria-label="Fewer">${ic('minus')}</button><b>2</b><button aria-label="More">${ic('plus')}</button></span></div>
  <div class="notice ok">${ic('phone')}<span>We call all 3 hosts on <b>Friday 21 May</b> from 18:00 and stamp your pass.</span></div>
  <div class="ph-payrow">${ic('cash')}<span><b>Sample card ending 4242</b><small>From your profile</small></span><span class="ph-change">Change</span></div>
  <a class="btn lg" ${go('push')}>${ic('lock')}Pay EUR ${T.price}</a>
  <a class="ph-wallet" ${go('push')}>Pay with Apple Pay or Google Pay</a>
  <p class="small muted" style="text-align:center">Works or it's free. Change your date free until 18:00 the evening before.</p>
 </div>`});

add('push','Go','The evening before','What the app adds to the website: the hosts answer on your lock screen.',{dark:true,html:()=>`
 <div class="ph-lock" style="background-image:linear-gradient(180deg,rgba(19,43,24,.35),rgba(19,43,24,.75)),url(${img('relief-dark')})">
  <div class="ph-clock"><small>Friday 14 May</small><b>18:24</b></div>
  <div class="ph-notes">
   <a class="ph-note" ${go('mytrail')}><img src="assets/logo/symbol-color.svg" alt=""><span><small>DNA Trails · now</small><b>All 3 hosts said yes</b>Zoran, Marija and Kiro are expecting you tomorrow. Your pass is stamped.</span></a>
   <a class="ph-note" ${go('mytrail')}><img src="assets/logo/symbol-color.svg" alt=""><span><small>DNA Trails · 18:20</small><b>Kiro, Dolni Disan</b>At the still from 13:00. The plum one is ready.</span></a>
   <a class="ph-note" ${go('mytrail')}><img src="assets/logo/symbol-color.svg" alt=""><span><small>DNA Trails · 18:05</small><b>Zoran, Vataša</b>Expecting you at 12:30. His mother is making stuffed peppers.</span></a>
   <a class="ph-note quiet" ${go('mytrail')}><img src="assets/logo/symbol-color.svg" alt=""><span><small>DNA Trails · 17:00</small><b>For tomorrow</b>Bring about EUR 80 in cash. The last ATM is in Kavadarci.</span></a>
  </div>
  <a class="ph-textlink" ${go('mytrail')}>Open DNA Trails</a>
 </div>`});

add('mytrail','Go','My trail','Your dated pass, the stamps from last night\'s calls, and the start button.',{tab:'mytrail',html:()=>`
 ${top('Tomorrow','My trail',av())}
 <div class="ph-pad stack">
  ${A.ticket({trail:T,date:P.date,car:P.car,people:P.people,code:P.code,stamp:A.stamp({tone:'gold',a:'Confirmed',b:'15 MAY',c:'3 hosts called',size:92,rot:-9})})}
  <div class="ph-box"><span class="live">All hosts confirmed</span><h3>Everyone is expecting you</h3><p class="small muted">Called Friday 14 May. We check once more at 07:30 on the morning you leave.</p></div>
  <div class="calllog"><h4>Host Ping log</h4><div><span class="t">Fri 18:05</span> Zoran, Vataša: yes</div><div><span class="t">Fri 18:12</span> Marija, Demir Kapija: yes</div><div><span class="t">Fri 18:20</span> Kiro, Dolni Disan: yes</div><div><span class="t">Sat 07:30</span> morning check: scheduled</div></div>
  <div class="stack-sm"><span class="ph-day">Day 1 · Saturday 15 May</span>${routeList(FL.filter(s=>s.dayIdx===0))}</div>
  <div class="stack-sm"><span class="ph-day">Day 2 · Sunday 16 May</span>${routeList(FL.filter(s=>s.dayIdx===1))}</div>
  <div class="ph-list">${row('shield','Works or it\'s free','A closed stop means a full refund','how')}${row('share','Share with your co-driver','Code DNA-7K2M opens it on a second phone',null)}</div>
 </div>`,cta:()=>`<div class="ph-cta"><span class="ph-ctaprice"><b class="ok">${ic('download')} Saved offline</b><small>route, notes and 3 stories</small></span><a class="btn gold lg" ${go('road')}>${ic('nav')}Start</a></div>`});

add('road','Go','On the road','Dark, big buttons, no tab bar. Built for a dashboard mount and no signal.',{dark:true,html:()=>`
 <div class="ph-nav over dark"><a class="ph-round" ${go('mytrail')} aria-label="Back">${ic('back')}</a><span class="ph-offline">${ic('wifi')}Offline ready</span></div>
 <div class="ph-map" data-map="road"></div>
 <div class="ph-pad stack" style="margin-top:-26px;position:relative">
  <div class="nowcard"><span class="eyebrow">Next stop · 2 of 6 · Day 1</span><h1>Vranec from the barrel</h1><div class="away">${ic('nav')}<span>14 km · about 20 min · Vataša</span></div>
   <div class="row" style="gap:12px">${A.hostChip('zoran',44)}${A.stamp({tone:'gold',a:'Confirmed',b:'14 MAY',c:'18:05',size:70,rot:8})}</div>
   <p class="typed" style="color:#DDE8DF">"Expecting you at 12:30. His mother is making stuffed peppers."</p>
   <span class="bigbtn" style="background:var(--gold);color:var(--deep)">${ic('nav')}Navigate there</span><a class="bigbtn" ${go('stamp')} style="background:var(--mint);color:var(--deep)">${ic('pin')}I'm here</a></div>
  <div class="roadcard"><h3>${ic('road')} Last kilometre · regular car</h3>${A.noteList(FL[1],'regular')}</div>
  <div class="roadcard"><h3>${ic('head')} Story for this stop</h3><div class="player"><span class="ph-play">${ic('play')}</span><div style="flex:1"><b>${esc((FL[1].story&&FL[1].story.t)||'The vines of 1987')}</b><div class="bar"><i style="width:34%"></i></div><small>1:20 / 4:00 · starts by itself as you arrive</small></div></div></div>
 </div>`});

add('stamp','Go','Stamped','Arriving at a host. The stamp is the reward, and the proof for the guarantee.',{dark:true,html:()=>`
 <div class="ph-nav over dark"><a class="ph-round" ${go('road')} aria-label="Back">${ic('back')}</a><span class="ph-offline">${ic('wifi')}Offline ready</span></div>
 <div class="ph-pad stack" style="padding-top:8px">
  <div class="arrive"><span class="eyebrow" style="color:var(--rust-ink)">You have arrived · stop 2 of 6</span>
   ${A.stamp({tone:'green',a:'Vataša',b:'Zoran',c:'15 MAY 2027',size:190,rot:-8,land:true})}
   <h2>Stamped.</h2><p>Vranec from the barrel is in your passport. Zoran has the QR card by the cellar door.</p></div>
  <div class="roadcard"><h3>${ic('cash')} What it costs here</h3><p class="small" style="color:#DDE8DF">${esc(FL[1].cash)}</p></div>
  <div class="roadcard"><h3>${ic('flag')} Up next</h3><div class="ph-next"><span class="tm">18:00</span><span><b>Sunset at Tikveš Lake</b><small>about 25 km · no host, always open</small></span></div></div>
  <a class="bigbtn" ${go('road')} style="background:var(--gold);color:var(--deep)">${ic('nav')}Go to the next stop</a>
  <a class="ph-textlink" ${go('refund')}>This stop is closed</a>
 </div>`});

add('refund','Go','The guarantee','If a confirmed stop is closed: one tap, one call from us, money back.',{dark:true,html:()=>`
 <div class="ph-nav over dark"><a class="ph-round" ${go('road')} aria-label="Back">${ic('back')}</a><span class="ph-offline">${ic('wifi')}Offline ready</span></div>
 <div class="ph-pad stack" style="opacity:.35"><div class="nowcard"><span class="eyebrow">Next stop · 2 of 6</span><h1>Vranec from the barrel</h1></div></div>`,
 sheet:()=>`<div class="ph-sheet"><i class="grab"></i><span class="eyebrow" style="color:var(--rust-ink)">Works or it's free</span><h2>No answer. This one is on us.</h2>
  ${A.stamp({shape:'box',tone:'rust',a:'Guarantee used',b:'Refunded',c:'EUR 19 returned',size:120,rot:-4,land:true})}
  <p>Zoran confirmed last night and is not here now. Your <b>EUR 19</b> goes back to your card within five working days. There is nothing to fill in.</p>
  <div class="notice ok">${ic('nav')}<span><b>Your backup:</b> a tasting at the next cellar in Vataša, confirmed just now.</span></div>
  <a class="btn lg" ${go('road')}>Carry on with the trail</a></div>`});

add('passport','Go','Passport','One stamp per host, one strand per trail. Lives in the profile.',{tab:'passport',html:()=>{ const g=A.trails.galicnik, gf=A.flat(g);
 const slot=(s,has,d)=>{ const h=s.host&&H[s.host]; return `<div class="slot">${h?A.stamp({tone:has?'green':'ink',ghost:!has,a:A.shortWhere(s.where),b:h.name,c:has?d+' 2027':'not yet',size:88,rot:(A.hash(s.ref)%17)-8}):A.stamp({shape:'box',tone:'ink',ghost:!has,a:has?'Visited':'Not yet',b:A.shortWhere(s.where),c:has?d:'no host',size:58,rot:(A.hash(s.ref)%11)-5})}<span>${esc(s.name)}</span></div>`; };
 return `<div class="ph-deephead">${top('The passport','Your Passport to Authenticity')}
  <div class="ph-stats"><div><b>4</b><small>stamps</small></div><div><b>2</b><small>hosts met</small></div><div><b>51</b><small>euros left in villages</small></div></div></div>
 <div class="ph-pad stack">
  <div class="pppage"><div class="between" style="align-items:flex-start"><div class="stack-sm"><div class="row gap6">${A.typeTag(g)}<span class="tag line">2 May 2027</span></div><h3>${esc(g.title)}</h3></div></div>
   ${A.helixH(gf.length,{seg:62,h:40,status:()=>'done'})}<div class="slots">${gf.map(s=>slot(s,true,'2 MAY')).join('')}</div></div>
  <div class="pppage"><div class="stack-sm"><div class="row gap6">${A.typeTag(T)}<span class="tag line">15 May 2027</span></div><h3>${esc(T.title)}</h3><span class="live">Hosts confirmed</span></div>
   ${A.helixH(FL.length,{seg:50,h:40})}<div class="slots">${FL.slice(0,4).map(s=>slot(s,false,'')).join('')}</div></div>
 </div>`; }});

add('map','Find','The map','One informative tab: everything we researched, filtered by category.',{tab:'map',html:()=>`
 <div class="ph-map full" data-map="big"></div>
 <div class="ph-mapbar"><div class="ph-search">${ic('search')}<span>3,519 places researched</span>${ic('filter')}</div>
  <div class="ph-chips over">${[['religious','Churches'],['waterfall','Waterfalls'],['winery','Wineries'],['gorge_cave','Gorges'],['archaeology','Archaeology']].map((c,i)=>`<span class="chip" aria-pressed="${i<3}"><i style="background:${D.MAPCATS[c[0]][1]}"></i>${c[1]}</span>`).join('')}</div></div>`,
 sheet:()=>`<div class="ph-sheet peek"><i class="grab"></i><span class="eyebrow" style="color:${D.MAPCATS.waterfall[1]}">Waterfall</span><h3>Smolare Waterfall</h3><p class="small muted">Novo Selo municipality · on the slopes of Belasica</p>
  <a class="ph-banner tight" ${go('trail')}>${ic('route')}<span><b>On a trail we have driven</b><small>Waterfalls and a Village Table · EUR 12</small></span>${ic('chev')}</a></div>`});

add('compose','Find','Trip-it-Yourself','Three questions. It can only pick stops we have driven.',{html:()=>`
 ${nav('trails','Trip-it-Yourself')}
 <div class="ph-pad stack">
  <div class="stack-sm"><h1>A trail composed for your dates</h1><p class="muted">Three questions. It cannot invent a restaurant.</p></div>
  <div class="stack-sm"><span class="flabel">1 · When, and for how long?</span><div class="datechips">${Array.from({length:4},(_,i)=>{ const dt=A.parse(A.addDays(A.today,6+i)); return `<button aria-pressed="${i===2}"><span>${A.WD[dt.getDay()]}</span><b>${dt.getDate()}</b><small>May</small></button>`; }).join('')}</div>
   <div class="ph-seg"><span>1 day</span><span class="on">2 days</span><span>3 days</span></div></div>
  <div class="stack-sm"><span class="flabel">2 · What are you driving?</span><div class="carpick">${Object.entries(D.CARS).map(([k,c])=>`<button aria-pressed="${k==='regular'}">${esc(c.label)}<small>${esc(c.hint)}</small></button>`).join('')}</div></div>
  <div class="stack-sm"><span class="flabel">3 · What is your appetite?</span><div class="row gap6" style="flex-wrap:wrap">${D.APPETITES.map((a,i)=>`<span class="chip" aria-pressed="${i<2}">${a[1]}</span>`).join('')}</div></div>
  <div class="ph-result"><span class="eyebrow">Composed from 25 of 28 driven stops</span><h3>Your Vardar trail</h3><p class="small">Sat 22 to Sun 23 May · 6 stops · 3 hosts to call</p>${A.helixH(6,{seg:50,h:40})}</div>
 </div>`,cta:()=>`<div class="ph-cta"><span class="ph-ctaprice"><b>EUR 29</b><small>per car, composed</small></span><a class="btn lg" ${go('checkout')}>Get this trail</a></div>`});

add('roots','Find','Roots Trail','For people living abroad, coming back to roots and family.',{html:()=>`
 <div class="ph-photo short" style="background-image:linear-gradient(180deg,rgba(19,43,24,.35),rgba(19,43,24,.92)),url(${img('galicnik')})">
  <div class="ph-nav over"><a class="ph-round" ${go('profile')} aria-label="Back">${ic('back')}</a><span></span></div>
  <div class="ph-phototext"><span class="tag gold">Roots Trail</span><h1>A trail to the village your family came from.</h1><p>For people living abroad, coming back to roots and family.</p></div></div>
 <div class="ph-pad stack">
  <div class="ph-field on"><small>The village or town</small><div>Galičnik</div></div>
  <p class="small" style="color:var(--green);margin-top:-8px">${ic('check')} Galičnik is in our catalogue, in Mavrovo i Rostuša municipality.</p>
  <div class="ph-field"><small>Family name, as it was said at home</small><div>Stojanovski</div></div>
  <div class="ph-field area"><small>What do you know?</small><div class="ph-ph">Who left, roughly when, where the house was, the name of the church.</div></div>
  <div class="ph-two"><div class="ph-field"><small>When</small><div>June 2027</div></div><div class="ph-field"><small>How many</small><div>4</div></div></div>
  <div class="ph-list">${row('phone','We call the village','Until someone says "Yes, I remember them."',null,' ')}${row('key','We find the places','The house, the church and who holds its key',null,' ')}${row('users','Someone meets you','A local who knows the families, for the day',null,' ')}</div>
 </div>`,cta:()=>`<div class="ph-cta"><span class="ph-ctaprice"><b>Free to ask</b><small>EUR 190 to 390 if you go ahead</small></span><a class="btn lg" ${go('profile')}>Ask us to look</a></div>`});

add('hosts','About','Hosts','The people on the call list. A first name, a face, a phone that gets answered.',{html:()=>`
 ${nav('profile','Hosts')}
 <div class="ph-pad stack">
  <div class="stack-sm"><h1>The people who are expecting you</h1><p class="muted">15 hosts on the call list this season. None has a contract with us and none pays us anything. ${A.sample('Sample hosts')}</p></div>
  <div class="ph-list">${['zoran','marija','kiro','vesna','riste','teodora','lence','mara'].map(k=>`<div class="ph-row host">${A.face(H[k].face,46)}<span><b>${esc(H[k].name)} <em>${esc(H[k].role)}</em></b><small>${esc(H[k].where)}</small><small class="typed">${esc(H[k].since)} · ${esc(H[k].phone)}</small></span>${ic('chev')}</div>`).join('')}</div>
 </div>`});

add('how','About','How it works','The method and the guarantee on one scroll.',{html:()=>`
 ${nav('profile','How it works')}
 <div class="ph-pad stack">
  <div class="stack-sm"><h1>We find out if anyone is home.</h1><p class="muted">Five things happen between you picking a date and the table being set.</p></div>
  <div class="ph-steps">${[['Before a trail exists','We drive it first','In a small rental and in a high car. That is where the road notes come from.'],['Once, by voice','We ask each host one question','"May we call you the day before a visitor comes?"'],['Any time','You pick a date and tell us your car','One price for everyone in it. A few cars a day, no more.'],['18:00 the evening before','We call every host','Each yes becomes a dated stamp on your pass. Each no gets you the backup.'],['On the day','You drive it offline','Stories start by GPS. Each host stamps your passport.']].map((s,i)=>`<div><i>${i+1}</i><span><small>${s[0]}</small><b>${s[1]}</b><p>${s[2]}</p></span></div>`).join('')}</div>
  <div class="ph-guar">${A.stamp({a:'Works or',b:"It's free",c:'No forms',size:104,rot:-9})}<span><b>Works or it's free.</b><p>A confirmed stop that is closed when you arrive means every cent of your pass back. One tap, no forms.</p></span></div>
 </div>`});

add('profile','You','Profile','The one account page. Everything else is one tap from here.',{tab:'profile',html:()=>`
 <div class="ph-pad stack" style="padding-top:8px">
  <div class="ph-prof">${A.avatar(U,72)}<div><h1>${esc(U.name)}</h1><p class="small muted">${esc(U.contact)}</p>${A.sample('Sample account')}</div></div>
  <div class="ph-stats light"><div><b>1</b><small>coming up</small></div><div><b>4</b><small>stamps</small></div><div><b>51</b><small>euros left in villages</small></div></div>
  <a class="ph-next card" ${go('mytrail')}><span class="thumb" style="background-image:url(${img(T.img)})"></span><span><small class="live">Hosts confirmed</small><b>${esc(T.title)}</b><small>Sat 15 to Sun 16 May · pass DNA-7K2M</small></span>${ic('chev')}</a>
  <div class="stack-sm"><span class="flabel">My trails</span><div class="ph-list">${row('ticket','Tikveš Wine Villages','Tomorrow · 3 hosts confirmed','mytrail')}${row('check','The High Road to Galičnik','Finished 2 May · 4 stamps','passport')}${row('stamp','Passport','4 stamps, 2 hosts met','passport')}</div></div>
  <div class="stack-sm"><span class="flabel">Account</span><div class="ph-list">${row('user','Your details','Name, contact, usual car',null)}${row('cash','Payment method','Sample card ending 4242',null)}${row('receipt','Payments and receipts','2 payments, 0 refunds',null)}${row('chat','Notifications','Host answers, morning check',null,'<span class="ph-toggle on"></span>')}${row('globe','Language','English',null)}</div></div>
  <div class="stack-sm"><span class="flabel">More trails</span><div class="ph-list">${row('route','Find a trail','Six driven trails','trails')}${row('sparkle','Trip-it-Yourself','Composed for your dates','compose')}${row('house','Roots Trail','Back to a family village','roots')}${row('qr','Redeem a code','From a rental desk or hotel',null)}${row('pin','The map','3,519 places we researched','map')}</div></div>
  <div class="stack-sm"><span class="flabel">About</span><div class="ph-list">${row('phone','How it works','The evening-before call','how')}${row('shield','Works or it\'s free','The refund promise','how')}${row('users','Hosts','The people expecting you','hosts')}${row('info','FAQs and contact','A person replies',null)}${row('lock','Terms and privacy','',null)}</div></div>
  <a class="ph-textlink" ${go('welcome')} style="color:var(--rust-ink)">Sign out</a>
 </div>`});

A.appScreens=SC;
const GROUPS=['Start','Find','Go','You','About'];
const ORDER=['welcome','signup','trails','trail','checkout','push','mytrail','road','stamp','refund','passport','map','compose','roots','profile','hosts','how'];
SC.sort((a,b)=>ORDER.indexOf(a.id)-ORDER.indexOf(b.id));

const phone=(s,live)=>`<div class="phone${s.dark?' dark':''}${live?' is-live':''}" data-screen="${s.id}">${status()}<div class="ph-body${['road','stamp','refund'].includes(s.id)?' roadview':''}">${s.html()}</div>${s.cta?s.cta():''}${s.sheet?s.sheet():''}${s.tab?tabs(s.tab):''}</div>`;
const initMaps=root=>{ $$('[data-map]',root).forEach(el=>{ if(el.dataset.done) return; el.dataset.done='1';
  if(el.dataset.map==='road') A.makeMap(el,{dark:true,regions:null,labels:'towns',towns:true,attrib:false,interactive:false,zoomUi:false,pins:A.trailPins(T,(s,i)=>i===0?'#B8A559':i===1?'#D0E8D6':'#8FB09A'),route:A.trailLines([T])}).fit(FL.map(s=>[s.x,s.y]),90);
  else A.makeMap(el,{regions:'outline',labels:'towns',towns:true,attrib:false,interactive:false,zoomUi:false,dots:['religious','waterfall','winery'],pins:D.TRAILS.map(t=>{ const s=A.flat(t)[0]; return {x:s.x,y:s.y,color:'#1C562B'}; })}).fit([[GEO.w*.24,GEO.h*.2],[GEO.w*.76,GEO.h*.8]],0); }); };

R.app=id=>{
  if(id==null) return {title:'Mobile app',html:`
   <section class="pagehead deep"><div class="wrap headsplit"><div class="stack-sm"><span class="eyebrow">The mobile app</span><h1>The same trails, in your pocket.</h1><p class="sub">${SC.length} screens. Tap any one to click through it at full size.</p></div><a class="btn gold lg" href="#app-welcome">${ic('play')}Start the click-through</a></div></section>
   <section class="section tight"><div class="wrap stack-lg">
    <div class="notice ok">${ic('info')}<span><b>What the app adds to the website:</b> the hosts' answers arrive as notifications, the road view stays awake on a dashboard mount, and a five-tab bar keeps Trails, Map, My trail, Passport and Profile one thumb away. Content, prices and the guarantee are identical.</span></div>
    ${GROUPS.map(g=>{ const list=SC.filter(s=>s.group===g); return list.length?`<div class="stack"><h2>${g==='Start'?'Start':g==='Find'?'Find a trail':g==='Go'?'Go':g==='You'?'You':'About'}</h2><div class="appboard">${list.map(s=>`<div class="thumb" data-open="app-${s.id}" role="link" tabindex="0" aria-label="${esc(s.title)}"><div class="thumbbox" inert>${phone(s)}</div><b>${esc(s.title)}</b><small>${esc(s.note)}</small></div>`).join('')}</div></div>`:''; }).join('')}
   </div></section>`,init(){ initMaps($('#app')); $$('.thumb[data-open]').forEach(t=>{ const f=()=>A.go(t.dataset.open); t.addEventListener('click',f); t.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); f(); } }); }); }};
  const i=SC.findIndex(s=>s.id===id); if(i<0) return R.lost();
  const s=SC[i], prev=SC[(i-1+SC.length)%SC.length], next=SC[(i+1)%SC.length];
  return {title:s.title+' · app',appfull:true,html:`
  <div class="appstage">
   <aside class="applist"><a class="crumb" href="#app">${ic('back')}All app screens</a><h2>Mobile app</h2>
    ${GROUPS.map(g=>{ const list=SC.filter(x=>x.group===g); return `<div><h4>${g}</h4>${list.map(x=>`<a href="#app-${x.id}" ${x.id===id?'aria-current="page"':''}>${esc(x.title)}</a>`).join('')}</div>`; }).join('')}
    <a class="btn outline sm" href="#home">Back to the website</a></aside>
   <div class="appcenter">
    <div class="appstrip"><a href="#app" aria-label="All app screens">${ic('grid')}<span>Screens</span></a><b>${esc(s.title)} <small>${i+1}/${SC.length}</small></b><span class="pn"><a href="#app-${prev.id}" aria-label="Previous screen">${ic('back')}</a><a href="#app-${next.id}" aria-label="Next screen" style="transform:scaleX(-1)">${ic('back')}</a></span></div>
    ${phone(s,true)}
    <p class="appnote">${esc(s.note)}</p>
   </div>
  </div>`,init(){ initMaps($('#app')); }};
};
})();
