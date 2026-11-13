/* DNA Trails prototype 2: your dated trail (the pass), the on-the-road view, the passport, my trails */
(function(){
const A=window.APP, D=window.DNA, ic=A.ic, esc=A.esc, S=A.state, $=A.$, $$=A.$$, R=A.routes;

const rangeText=(t,date)=>t.days.length>1?A.dLong(date)+' to '+A.dLong(A.addDays(date,t.days.length-1)):A.dLong(date);
const passStatus=p=>{ const t=A.trailOf(p), fl=A.flat(t), sw=p.stage==='booked'?[]:A.swapped(p); return (s,i)=>{ s=typeof s==='number'?fl[s]:s; if((p.got||[]).includes(s.ref)) return 'done'; if(p.stage==='road'&&fl[p.at]&&fl[p.at].ref===s.ref) return 'now'; if(sw.includes(s.ref)||p.closedStop===s.ref) return 'swap'; return ''; }; };
const passStamp=(p,t,land)=>{ if(p.refunded) return A.stamp({shape:'box',tone:'rust',a:'Guarantee used',b:'Refunded',c:'EUR '+t.price+' returned',rot:-6,size:84}); if(p.stage==='booked') return A.stamp({ghost:true,a:'We call',b:A.dStamp(A.callDay(p)),c:'from 18:00',rot:-9,size:96}); if(p.stage==='done') return A.stamp({shape:'box',tone:'green',a:'Trail complete',b:A.dStamp(A.addDays(p.date,t.days.length-1)),c:'#FollowTheTrail',rot:-6,size:84}); return A.stamp({a:'Confirmed',b:A.dStamp(p.date),c:A.flat(t).filter(s=>s.host).length+' hosts called',rot:-10,size:100,land}); };
A.passTicket=(p,o)=>{ const t=A.trailOf(p); const st=passStatus(p); return A.ticket(Object.assign({trail:t,date:p.date,car:p.car,people:p.people,code:p.code,status:i=>st(i),stamp:passStamp(p,t,o&&o.land)},o||{})); };

A.receipt=p=>{ const t=A.trailOf(p), dv=A.dividend(p); return `<div class="receipt"><h4>Village dividend</h4><p style="text-align:center">${esc(t.title)}<br>${A.dShort(p.date)} 2027 · pass ${esc(p.code)}</p>
  <div style="margin:10px 0 4px">${dv.list.map(s=>`<div class="rl"><span>${esc(D.HOSTS[s.host].name)}, ${esc(A.shortWhere(s.where))}</span><span>EUR ${Math.round(s.spend*Math.max(1,p.people||2)/2)}</span></div>`).join('')||'<div class="rl"><span>No host stops stamped</span><span>EUR 0</span></div>'}</div>
  <p style="text-align:center;margin-top:10px">You left about</p><div class="big">EUR ${dv.eur}</div><p style="text-align:center">with ${dv.families} ${dv.families===1?'family':'families'} in ${dv.villages} ${dv.villages===1?'village':'villages'}</p>
  <div class="rl" style="margin-top:12px"><span>DNA Trails kept (your pass)</span><span>EUR ${p.refunded?0:t.price}</span></div><div class="rl"><span>Commission taken from hosts</span><span>EUR 0</span></div>
  <p style="text-align:center;margin-top:12px;font-weight:700">#FOLLOWTHETRAIL</p></div>`; };

/* ---------- your trail ---------- */
R.pass=code=>{
  const p=A.pass(code);
  if(!p) return {title:'Pass not found',html:`<section class="section"><div class="wrap empty">${A.stamp({shape:'box',tone:'rust',a:'No such pass',b:esc(code).slice(0,9),c:'On this device',rot:-5,size:110})}<h1>We cannot find that pass here</h1><p class="lead muted">In the real product a code opens your trail on any phone. In this prototype, passes live only in the browser that bought them.</p><a class="btn" href="#my-trails">My trails</a></div></section>`};
  const t=A.trailOf(p), fl=A.flat(t), hosts=fl.filter(s=>s.host), sw=p.stage==='booked'?[]:A.swapped(p); const land=S.ui.land===code; S.ui.land=null; const fresh=S.ui.fresh===code; S.ui.fresh=null;
  const got=(p.got||[]).length; const callTimes=['18:05','18:12','18:20','18:31','18:40','18:52','19:03','19:08'];
  let status;
  if(p.stage==='booked') status=`<div class="statusbar"><div class="stack-sm"><span class="live warn">Waiting for the call</span><h2>We call your ${hosts.length===1?'host':hosts.length+' hosts'} on ${A.dLong(A.callDay(p))}</h2><p class="muted">From 18:00, in Macedonian. Each yes lands below as a dated stamp, and you get one message when they are all in.</p></div><div class="stack-sm"><button class="btn outline" id="chDate">${ic('calendar')}Change date</button></div></div>
    <div class="prototool"><span><b>Prototype:</b> the calls happen on ${A.dShort(A.callDay(p))}. Skip ahead to see the stamps land.</span><button class="btn sm" id="doCalls">${ic('phone')}Make the calls now</button></div>`;
  else if(p.stage==='confirmed') status=`<div class="statusbar"><div class="stack-sm"><span class="live">${sw.length?(hosts.length-sw.length)+' confirmed, '+sw.length+' swapped':'All hosts confirmed'}</span><h2>${sw.length?'Your trail is set, with one change':'Everyone is expecting you'}</h2><p class="muted">Called ${A.dLong(A.callDay(p))}. We check once more at 07:30 on the morning you leave.${p.offline?' Saved for offline use.':''}</p></div><div class="row"><button class="btn outline" id="saveOff" ${p.offline?'disabled':''}>${ic('download')}${p.offline?'Saved offline':'Save for offline'}</button><a class="btn gold" href="#road-${p.code}" id="startBtn">${ic('nav')}Start the trail</a></div></div>`;
  else if(p.stage==='road') status=`<div class="statusbar"><div class="stack-sm"><span class="live">On the road</span><h2>${got} of ${fl.length} stops done</h2><p class="muted">Pick up where you left off. Everything is saved to this phone.</p></div><a class="btn gold" href="#road-${p.code}">${ic('nav')}Back to the road view</a></div>`;
  else status=`<div class="statusbar"><div class="stack-sm"><span class="live">Finished ${A.dShort(A.addDays(p.date,t.days.length-1))}</span><h2>Thank you for going the long way</h2><p class="muted">${got} of ${fl.length} stops stamped. Your stamps are in the passport.</p></div><div class="row"><a class="btn" href="#passport">${ic('stamp')}Open the passport</a><button class="btn outline" data-copy="I just finished ${esc(t.title)} with DNA Trails. #FOLLOWTHETRAIL">${ic('share')}Copy share text</button></div></div>`;
  const log=p.stage==='booked'?`<p>No calls yet. We call the evening before, so the answer is fresh.</p>`:hosts.map((s,i)=>`<div><span class="t">${A.WD[A.dow(A.callDay(p))]} ${callTimes[i%8]}</span> ${esc(D.HOSTS[s.host].name)}, ${esc(A.shortWhere(s.where))}: ${sw.includes(s.ref)?'away, backup confirmed':'yes'}</div>`).join('')+`<div><span class="t">${A.WD[A.dow(p.date)]} 07:30</span> morning check: ${p.stage==='confirmed'?'scheduled':'all in'}</div>`;
  const cash=Math.round(A.spend(t)*(p.people||2)/2/5)*5;
  return {title:'Your trail',html:`
  <section class="pagehead"><div class="wrap">
    <a class="crumb" style="color:var(--green)" href="#profile">${ic('back')}Profile</a>
    <div class="row" style="gap:10px"><span class="eyebrow">Your trail</span>${p.sample?A.sample('Sample pass'):''}</div>
    ${fresh?`<div class="notice ok">${ic('check')}<span><b>You are in.</b> Keep this code: <b>${esc(p.code)}</b>. Your pass is saved in your profile. The code lets a second phone in the car open it too.</span></div>`:''}
    <div class="passhead">${A.passTicket(p,{land})}
      <div class="expect"><h3>${p.stage==='done'?'The people you met':p.stage==='booked'?'The people we will call':'The people expecting you'}</h3>
      <ul>${hosts.filter(s=>!sw.includes(s.ref)).map(s=>`<li>${A.hostChip(s.host,38)}</li>`).join('')}</ul>
      <p class="small muted">${p.stage==='booked'?'Each one gets a phone call in Macedonian the evening before you leave.':'Sample hosts. Real names and faces arrive with the first driven trails.'}</p></div>
    </div>
  </div></section>
  <section class="section tight"><div class="wrap tgrid">
    <div class="stack-lg">
      <div class="stack">${status}</div>
      ${p.stage==='done'?`<div class="stack" style="align-items:center">${A.receipt(p)}<p class="small muted" style="max-width:48ch;text-align:center">Estimated from what these hosts usually charge. It is the number we show sponsors too: what a trail leaves behind.</p></div>`:''}
      <div class="stack"><div class="between"><h2>${p.stage==='done'?'Where you went':'Your stops'}</h2><span class="small muted">${rangeText(t,p.date)}</span></div>
      ${A.routeList(t,{mode:'pass',pass:p,car:p.car,date:p.date,swaps:sw,land,openNotes:false})}</div>
    </div>
    <aside class="stack">
      <div class="calllog"><h4>Host Ping log</h4>${log}</div>
      <div class="sidecard"><h3>${ic('shield')} Works or it's free</h3><p class="small">If a stop stamped <b>confirmed</b> is closed when you arrive, tap "This stop is closed" in the road view. Your EUR ${t.price} comes back. No forms, no photos, no argument.</p><a class="small" href="#guarantee">How the guarantee works</a></div>
      <div class="sidecard"><h3>${ic('cash')} Bring cash</h3><p class="small">About <b>EUR ${cash}</b> for ${p.people||2}. Hosts are paid by you, directly. Each stop says what it costs and where the last ATM is.</p></div>
      <div class="sidecard"><h3>${ic('ticket')} Your code</h3><span class="codebox">${esc(p.code)}</span><p class="small muted">Share it with whoever is navigating. It opens this trail on a second phone, without signing in. ${p.composed?'Composed for you from verified stops.':''}</p></div>
    </aside>
  </div></section>`,
  init(){
    A.watchHelix($('.helixlist'));
    const dc=$('#doCalls'); if(dc) dc.addEventListener('click',()=>{ p.stage='confirmed'; A.savePass(p); S.ui.land=p.code; A.render(); const n=A.swapped(p).length; A.toast(`${ic('phone')} ${n?'Calls made. One host is away, the backup is confirmed.':'Calls made. Everyone said yes.'}`); const hl=$('.helixlist'); if(hl) hl.scrollIntoView({behavior:'smooth',block:'start'}); });
    const so=$('#saveOff'); if(so) so.addEventListener('click',()=>{ p.offline=true; A.savePass(p); A.render(); A.toast(`${ic('download')} Saved: route, road notes and ${fl.filter(s=>s.story).length} stories`); });
    const cd=$('#chDate'); if(cd) cd.addEventListener('click',()=>{ if(p.composed){ A.toast('Composed trails are built for their dates. Compose a new one to move it.'); return; } const chips=Array.from({length:8},(_,i)=>A.addDays(A.today,i+2)).map(d=>{ const n=A.left(t.id,d)+(d===p.date?1:0); const dt=A.parse(d); return `<button data-nd="${d}" aria-pressed="${p.date===d}" ${n===0?'disabled':''}><span>${A.WD[dt.getDay()]}</span><b>${dt.getDate()}</b><small>${n===0?'full':n+' left'}</small></button>`; }).join('');
      const o=A.modal(`<span class="eyebrow">Change date</span><h2>When instead?</h2><p class="muted">Free until 18:00 the evening before. After that the hosts are already expecting you.</p><div class="datechips" style="grid-template-columns:repeat(4,minmax(0,1fr))">${chips}</div>`); $$('[data-nd]',o).forEach(b=>b.addEventListener('click',()=>{ p.date=b.dataset.nd; A.savePass(p); A.closeModal(); A.render(); A.toast(`${ic('check')} Moved to ${A.dLong(p.date)}`); })); });
  }};
};

/* ---------- on the road ---------- */
R.road=code=>{
  const p=A.pass(code); if(!p) return R.pass(code);
  const t=A.trailOf(p), fl=A.flat(t), n=fl.length;
  if(p.stage==='booked') return {title:'Not yet',html:`<section class="section"><div class="wrap empty">${A.stamp({ghost:true,a:'We call',b:A.dStamp(A.callDay(p)),c:'from 18:00',size:120})}<h1>Your hosts have not been called yet</h1><p class="lead muted">The road view opens once the evening-before calls are in, so that everything on it is true.</p><a class="btn" href="#pass-${p.code}">Back to your trail</a></div></section>`};
  if(p.stage==='confirmed'){ p.stage='road'; p.at=0; A.savePass(p); }
  const sw=A.swapped(p); const at=Math.min(p.at,n); const cur=fl[at]; const prev=at>0?fl[at-1]:null; const arr=S.ui.arr===code+'/'+at; const justGot=S.ui.justGot; S.ui.justGot=null;
  const status=(s,i)=>(p.got||[]).includes(s.ref)||i<at?'done':i===at&&p.stage!=='done'?'now':'';
  let main;
  if(at>=n||p.stage==='done'){
    const dv=A.dividend(p);
    main=`<div class="arrive">${A.stamp({shape:'box',tone:'green',a:'Trail complete',b:t.composed?'Your trail':t.title.replace(/^The /,'').split(/,| and /)[0],c:'#FollowTheTrail',rot:-5,size:130,land:true})}<h2>That was the whole trail</h2><p>You left about <b>EUR ${dv.eur}</b> with ${dv.families} ${dv.families===1?'family':'families'} in ${dv.villages} ${dv.villages===1?'village':'villages'}.</p><a class="bigbtn" style="background:var(--green);color:#fff" href="#pass-${p.code}">${ic('receipt')}See your receipt</a><a class="linkbtn" style="color:var(--green)" href="#passport">Open the passport</a></div>`;
  } else {
    const h=cur.host&&D.HOSTS[cur.host]; const swapped=sw.includes(cur.ref); const leg=prev?A.leg(prev,cur):null;
    const away=leg&&leg.km?`about ${leg.km} km · ${A.hm(leg.min)} from ${esc(prev.name)}`:prev?'A short walk from the last stop':`Your first stop. The trail starts from ${esc(t.start||'your door')}`;
    if(arr){
      main=`<div class="arrive"><span class="eyebrow">You have arrived · stop ${at+1} of ${n}</span><h2>${esc(cur.name)}</h2>
        ${h&&!swapped?`${A.face(h.face,84,'#E9F3EB')}<p><b>${esc(h.name)}</b> has a small QR card by the door. Scan it and the stamp is yours.</p><button class="bigbtn" id="scanBtn" style="background:var(--green);color:#fff">${ic('qr')}Scan ${esc(h.name)}'s stamp</button><button class="linkbtn" id="closedBtn">This stop is closed</button>`
        :`<p>${swapped?'This is your backup stop. Nothing to scan here.':'No host here, so nothing to scan. Take your time.'}</p><button class="bigbtn" id="visitBtn" style="background:var(--green);color:#fff">${ic('check')}Mark as visited</button>`}
      </div>`;
    } else {
      main=`<div class="nowcard"><span class="k">${at===0?'First stop':'Next stop'} · ${at+1} of ${n}${t.days.length>1?' · day '+(cur.dayIdx+1):''}</span><h1>${esc(cur.name)}</h1>
        <span class="away">${ic('nav')}${away}</span>
        ${h?(swapped?`<div class="notice">${ic('info')}<span><b>${esc(h.name)} is away today.</b> Backup, confirmed last night: ${esc(cur.backup)}.</span></div>`:`<div class="hs-host">${A.hostChip(cur.host,52)}${A.stamp({a:'Confirmed',b:cur.time,c:'this morning 07:30',size:92,rot:-8})}</div><p class="transcript" style="border-color:var(--mint)">${esc(cur.note)}</p>`):`<span class="live">No host · always open</span>`}
        <button class="bigbtn" data-soon="Opens your maps app with the saved route. Not wired up in the prototype.">${ic('nav')}Navigate there</button>
        <button class="bigbtn mint" id="hereBtn">${ic('pin')}I'm here</button></div>`;
    }
  }
  const notes=cur&&p.stage!=='done'?`<div class="roadcard"><h3>${ic('road')}Last kilometre · ${esc(D.CARS[p.car].label.toLowerCase())}</h3>${A.noteList(cur,p.car)}</div>`:'';
  const story=cur&&cur.story&&p.stage!=='done'?`<div class="roadcard"><h3>${ic('head')}Story for this stop</h3><div class="player"><button id="playBtn" aria-label="Play story">${ic('play')}</button><div><div class="t">${esc(cur.story.t)}</div><div class="m"><span id="pTime">0:00</span> / ${cur.story.mins}:00 · starts by itself when you get close</div><div class="bar"><i id="pBar"></i></div></div></div><p class="transcript">${esc(cur.story.text)}</p></div>`:'';
  const dvDone=at>=n||p.stage==='done';
  return {title:'On the road',road:true,html:`
  <div class="roadview">
    <div class="road-top"><a href="#pass-${p.code}">${ic('back')}Your trail</a><span class="offline">${ic('wifi')}Offline ready</span></div>
    <div class="road-grid">
      <div class="road-col">
        ${justGot?`<div class="arrive" style="flex-direction:row;text-align:left;gap:16px;padding:14px 18px">${justGot.host?A.stamp({tone:'green',a:A.shortWhere(justGot.where),b:D.HOSTS[justGot.host].name,c:A.dStamp(A.addDays(p.date,justGot.dayIdx))+' 2027',size:92,rot:-9,land:true}):A.stamp({shape:'box',tone:'ink',a:'Visited',b:A.dStamp(A.addDays(p.date,justGot.dayIdx)),c:A.shortWhere(justGot.where),size:70,rot:-5,land:true})}<div><b style="font:800 18px var(--head);color:var(--deep)">Stamped.</b><br><span class="small">${esc(justGot.name)} is in your passport.</span></div></div>`:''}
        ${main}${notes}${story}
        <div class="roadcard"><h3>${ic('route')}${esc(t.title)}</h3><div class="upnext">${fl.map((s,i)=>`<div class="${status(s,i)}"><span class="n">${i+1}</span><span>${esc(s.name)}<br><small>${s.time}${s.host?' · '+esc(D.HOSTS[s.host].name):''}${sw.includes(s.ref)?' · backup':''}${p.closedStop===s.ref?' · closed, refunded':''}</small></span>${(p.got||[]).includes(s.ref)?ic('check'):''}</div>`).join('')}</div></div>
        ${dvDone?'':`<div class="prototool"><span><b>Prototype:</b> there is no GPS here. Use "I'm here" to move along the trail. Stories would start by themselves.</span></div>`}
      </div>
      <div class="road-map"><div id="rMap" style="height:100%"></div></div>
    </div>
  </div>`,
  init(){
    const m=A.makeMap($('#rMap'),{dark:true,regions:null,labels:'towns',towns:true,attrib:true,pins:A.trailPins(t,(s,i)=>status(s,i)==='done'?'#B8A559':status(s,i)==='now'?'#D0E8D6':'#8FB09A'),route:A.trailLines([t])});
    const pts=cur?[[cur.x,cur.y]].concat(prev?[[prev.x,prev.y]]:[]).concat(fl[at+1]?[[fl[at+1].x,fl[at+1].y]]:[]):fl.map(s=>[s.x,s.y]); m.fit(pts.length>1?pts:fl.map(s=>[s.x,s.y]),160);
    const adv=(ref,collect)=>{ if(collect){ p.got=[...(p.got||[]),ref]; S.ui.justGot=fl.find(s=>s.ref===ref); } p.at=at+1; if(p.at>=n) p.stage='done'; A.savePass(p); S.ui.arr=null; A.render(); window.scrollTo(0,0); };
    const hb=$('#hereBtn'); if(hb) hb.addEventListener('click',()=>{ S.ui.arr=code+'/'+at; A.render(); window.scrollTo(0,0); });
    const sb=$('#scanBtn'); if(sb) sb.addEventListener('click',()=>adv(cur.ref,true));
    const vb=$('#visitBtn'); if(vb) vb.addEventListener('click',()=>adv(cur.ref,true));
    const cb=$('#closedBtn'); if(cb) cb.addEventListener('click',()=>{ const h=D.HOSTS[cur.host];
      const o=A.modal(`<span class="eyebrow">Works or it's free</span><h2>Sorry. Let us check.</h2><p id="gStep" class="typed">Calling ${esc(h.name)} now …</p>`);
      const tm=setTimeout(()=>{ const box=$('.modal',o); if(!box) return; box.innerHTML=`<span class="eyebrow">Works or it's free</span><h2>No answer. This one is on us.</h2>${A.stamp({shape:'box',tone:'rust',a:'Guarantee used',b:'Refunded',c:'EUR '+t.price+' returned',rot:-4,size:110,land:true})}<p>${esc(h.name)} confirmed last night and is not here now. Your <b>EUR ${t.price}</b> goes back to your card within five working days. There is nothing to fill in.</p><div class="notice ok">${ic('nav')}<span><b>Your backup:</b> ${esc(cur.backup||'the next stop on the trail')}.</span></div><p class="small muted">${esc(h.name)} comes off the call list until we have spoken with them.</p><button class="btn lg" id="gGo">Carry on with the trail</button>`;
        $('#gGo',box).addEventListener('click',()=>{ p.refunded=true; p.closedStop=cur.ref; A.closeModal(); adv(cur.ref,false); A.toast(`${ic('undo')} Refund of EUR ${t.price} started`); }); },1700);
      const prevClean=A.cleanup; A.cleanup=()=>{ clearTimeout(tm); if(prevClean) prevClean(); }; });
    const pb=$('#playBtn'); if(pb){ let playing=false, sec=0, timer=null; const total=cur.story.mins*60; const tick=()=>{ sec=Math.min(total,sec+4); $('#pBar').style.width=(sec/total*100)+'%'; $('#pTime').textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'); if(sec>=total){ clearInterval(timer); playing=false; pb.innerHTML=ic('play'); } };
      pb.addEventListener('click',()=>{ playing=!playing; pb.innerHTML=ic(playing?'pause':'play'); pb.setAttribute('aria-label',playing?'Pause story':'Play story'); clearInterval(timer); if(playing){ if(sec>=total) sec=0; timer=setInterval(tick,250); A.toast('Audio is simulated in the prototype. The text below is the story.'); } });
      const prevClean=A.cleanup; A.cleanup=()=>{ clearInterval(timer); if(prevClean) prevClean(); }; }
  }};
};

/* ---------- passport ---------- */
R.passport=()=>{
  const stamps=A.stamps(); const withStamps=A.mine().filter(p=>(p.got||[]).length||p.stage==='road'||p.stage==='confirmed');
  const hostsMet=new Set(stamps.filter(x=>x.stop.host).map(x=>x.stop.host)).size; const finished=A.mine().filter(p=>p.stage==='done'); const left=A.mine().reduce((a,p)=>a+A.dividend(p).eur,0);
  const page=p=>{ const t=A.trailOf(p), fl=A.flat(t), got=p.got||[]; const st=passStatus(p);
    return `<article class="pppage"><div class="between" style="align-items:flex-start"><div class="stack-sm"><div class="row gap6">${A.typeTag(t)}<span class="tag line">${A.dShort(p.date)} 2027</span></div><h3><a href="#pass-${p.code}" style="color:inherit;text-decoration:none">${esc(t.title)}</a></h3></div>${p.stage==='done'?A.stamp({shape:'box',tone:'rust',a:'Trail complete',b:A.dStamp(A.addDays(p.date,t.days.length-1)),c:'#FollowTheTrail',size:76,rot:-5}):`<span class="live${p.stage==='booked'?' warn':''}">${esc(A.stageLabel(p))}</span>`}</div>
      <div style="overflow:hidden">${A.helixH(fl.length,{seg:Math.min(60,Math.floor(560/fl.length)),h:44,status:i=>st(i)==='done'?'done':''})}</div>
      <div class="slots">${fl.map(s=>{ const has=got.includes(s.ref); const d=A.dStamp(A.addDays(p.date,s.dayIdx)); const h=s.host&&D.HOSTS[s.host];
        return `<div class="slot">${h?A.stamp({tone:has?'green':'ink',ghost:!has,a:A.shortWhere(s.where),b:h.name,c:has?d+' 2027':'not yet',size:104,rot:(A.hash(s.ref)%17)-8}):A.stamp({shape:'box',tone:'ink',ghost:!has,a:has?'Visited':'Not yet',b:A.shortWhere(s.where),c:has?d:'no host',size:70,rot:(A.hash(s.ref)%11)-5})}<span>${esc(s.name)}</span></div>`; }).join('')}</div>
      ${p.stage==='done'?`<hr class="perf"><p class="typed">You left about <b>EUR ${A.dividend(p).eur}</b> with ${A.dividend(p).families} families. <a href="#pass-${p.code}">See the receipt</a></p>`:''}</article>`; };
  return {title:'Passport',html:`
  <section class="pagehead deep"><div class="wrap"><span class="eyebrow">The Passport</span><h1>Your Passport to Authenticity</h1><p class="sub">One stamp per host. One strand per trail.</p></div></section>
  <section class="section tight"><div class="wrap ppgrid">
    <aside class="stack">
      <div class="ppcover"><span class="k">Passport</span><img src="assets/logo/symbol-white.svg" alt=""><span class="t">Exploration is in our DNA</span><span class="k" style="letter-spacing:.2em;font-size:11px">DNA Trails · Macedonia</span></div>
      <div class="grid g2" style="gap:14px"><div class="stat"><b>${stamps.length}</b><span>stamps collected</span></div><div class="stat"><b>${hostsMet}</b><span>hosts met</span></div><div class="stat"><b>${finished.length}</b><span>${finished.length===1?'trail':'trails'} finished</span></div><div class="stat"><b>${left}</b><span>euros left in villages</span></div></div>
      <div class="sidecard"><h3>The paper passport</h3><p class="small">A real booklet with a page per region. Hosts keep an ink stamp by the door. EUR 15, posted to you or waiting at your first stop.</p><button class="btn outline sm" data-soon="Paper passports go on sale in June. Not wired up in the prototype.">Order one · EUR 15</button></div>
    </aside>
    <div class="stack">${withStamps.length?withStamps.map(page).join(''):`<div class="pppage empty"><h3>No stamps yet</h3><p>Your first one is waiting at the first host of your first trail.</p><a class="btn" href="#trails">Find a trail</a></div>`}
      <p class="small muted">${S.user?(S.user.sample?'Sample stamps come from the sample account. Buy a trail and drive it in the road view to add your own.':'Stamps live in your profile, so they follow you to any phone.'):'<a href="#profile">Sign in</a> to see your stamps. They live in your profile, so they follow you to any phone.'}</p></div>
  </div></section>`};
};

/* ---------- my trails ---------- */
R['my-trails']=()=>{
  const ps=S.passes; const live=ps.filter(p=>p.stage!=='done'), done=ps.filter(p=>p.stage==='done');
  const row=p=>`<div class="stack-sm"><div class="row" style="gap:10px"><span class="live${p.stage==='booked'?' warn':''}">${esc(A.stageLabel(p))}</span>${p.sample?A.sample('Sample pass'):''}</div>${A.passTicket(p,{href:'#pass-'+p.code})}</div>`;
  return {title:'My trails',html:`
  <section class="pagehead"><div class="wrap"><span class="eyebrow">No account, just a code</span><h1>My trails</h1><p class="sub">Every pass bought on this phone, and a door for the ones that were not.</p></div></section>
  <section class="section tight"><div class="wrap tgrid">
    <div class="stack-lg">
      ${live.length?`<div class="stack"><h2>Coming up</h2>${live.map(row).join('')}</div>`:`<div class="empty"><h2>Nothing coming up</h2><p class="muted">The shelf has six trails, and most Saturdays still have a car or two left.</p><a class="btn" href="#trails">Find a trail</a></div>`}
      ${done.length?`<div class="stack"><h2>Finished</h2>${done.map(row).join('')}</div>`:''}
    </div>
    <aside class="stack">
      <form class="sidecard" id="codeForm" novalidate><h3>Have a code?</h3><p class="small muted">Bought on another phone, or handed a card at a rental desk? Enter the code.</p><label class="field"><span>Pass code</span><input id="codeIn" placeholder="DNA-7K2M" autocomplete="off" autocapitalize="characters" style="font-family:var(--type);letter-spacing:.06em"><span class="err" id="codeErr" hidden></span></label><button class="btn" type="submit">Open my trail</button></form>
      <div class="sidecard"><h3>Lost your code?</h3><p class="small">It is in the confirmation message we sent to your phone. Still stuck? Write to us with the date and the trail and we will find it.</p><a class="small" href="#contact">Contact us</a></div>
    </aside>
  </div></section>`,
  init(){ $('#codeForm').addEventListener('submit',e=>{ e.preventDefault(); let v=$('#codeIn').value.trim().toUpperCase().replace(/\s+/g,''); if(v&&!v.startsWith('DNA-')) v='DNA-'+v.replace(/^DNA/,''); const err=$('#codeErr'); if(!v){ err.textContent='Type the code from your pass, for example DNA-7K2M.'; err.hidden=false; return; } if(A.pass(v)){ A.go('pass-'+v); return; } err.textContent='No pass with that code in this browser. In the real product any valid code opens here.'; err.hidden=false; }); }};
};
})();
