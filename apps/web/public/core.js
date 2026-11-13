/* DNA Trails prototype 2: core helpers, state, and the signature components
   (rubber stamps, the paper pass, the helix route line, host faces). */
(function(){
const D=window.DNA, GEO=window.GEO, MD=window.MAPDATA, IC=window.ICONS;
const A=window.APP={}; A.routes={};
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>Number(n).toLocaleString('en-US');
A.$=$;A.$$=$$;A.esc=esc;A.fmt=fmt;
const ic=(n,cls)=>`<svg class="ic ${cls||''}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]||IC.info}</svg>`;
A.ic=ic;

/* ---------- prototype clock: the evening the calls go out ---------- */
A.NOW=new Date(2027,4,14,19,10);
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parse=s=>{const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d);};
const addDays=(s,n)=>{const d=typeof s==='string'?parse(s):new Date(s); d.setDate(d.getDate()+n); return iso(d);};
const WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], WDL=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
A.iso=iso;A.parse=parse;A.addDays=addDays;A.today=iso(A.NOW);A.WD=WD;A.WDL=WDL;
A.dShort=s=>{const d=parse(s); return WD[d.getDay()]+' '+d.getDate()+' '+D.MONTHS[d.getMonth()];};
A.dLong=s=>{const d=parse(s); return WDL[d.getDay()]+' '+d.getDate()+' '+D.MONTHS_FULL[d.getMonth()];};
A.dStamp=s=>{const d=parse(s); return d.getDate()+' '+D.MONTHS[d.getMonth()].toUpperCase();};
A.dow=s=>parse(s).getDay();

/* ---------- storage ---------- */
const mem={}; const KEYS=['passes','roots','seen','user'];
const store={
  get(k,def){ if(k in mem) return mem[k]; try{const v=localStorage.getItem('dnatrails2.'+k); if(v!=null){mem[k]=JSON.parse(v); return mem[k];}}catch(e){} return def; },
  set(k,v){ mem[k]=v; try{localStorage.setItem('dnatrails2.'+k,JSON.stringify(v));}catch(e){} },
  clear(){ for(const k in mem) delete mem[k]; KEYS.forEach(k=>{ try{localStorage.removeItem('dnatrails2.'+k);}catch(e){} }); }
};
A.store=store;

/* ---------- geo ---------- */
const P=GEO.proj;
A.proj=(lon,lat)=>{const n=Math.pow(2,P.Z); const tx=(lon+180)/360*n; const r=lat*Math.PI/180; const ty=(1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*n; return [(tx-P.X0)*256-P.cx0,(ty-P.Y0)*256-P.cy0];};
A.km=(a,b)=>{const R=6371,t=x=>x*Math.PI/180; const dl=t(b.lat-a.lat),dn=t(b.lon-a.lon); const h=Math.sin(dl/2)**2+Math.cos(t(a.lat))*Math.cos(t(b.lat))*Math.sin(dn/2)**2; return 2*R*Math.asin(Math.sqrt(h));};
A.leg=(a,b)=>{const road=A.km(a,b)*1.45; if(road<0.4) return {km:0,min:0}; const min=road/42*60; return {km:road<10?Math.max(1,Math.round(road)):Math.round(road/5)*5,min:Math.max(5,Math.round(min/5)*5)};};
A.hm=min=>{const h=Math.floor(min/60),m=min%60; return h?(h+' h'+(m?' '+m+' min':'')):m+' min';};
const byId=arr=>Object.fromEntries(arr.map(x=>[x.id,x]));
A.regions=byId(D.REGIONS);

/* ---------- trails ---------- */
A.trails=byId(D.TRAILS);
A.stopIndex={};
D.TRAILS.forEach(t=>{ let n=0; t.days.forEach((d,di)=>d.stops.forEach(s=>{ s.ref=t.id+'/'+s.id; s.trail=t.id; s.day=di; s.n=++n; [s.x,s.y]=A.proj(s.lon,s.lat); A.stopIndex[s.ref]=s; })); t.nStops=n; t.nHosts=t.days.reduce((a,d)=>a+d.stops.filter(s=>s.host).length,0); t.price=D.TYPES[t.type].price; });
A.allStops=Object.values(A.stopIndex);
A.verified=A.allStops.filter(s=>s.host);
/* a pass may carry a composed trail; resolve either kind to {title, days:[{t, stops:[stop]}]} */
A.trailOf=p=>{ if(p.composed){ const c=p.composed; return Object.assign({},c,{id:'composed',type:'composed',composed:true,price:D.TYPES.composed.price,days:c.days.map(d=>({t:d.t,sleep:d.sleep||null,stops:d.refs.map(r=>A.stopIndex[r]).filter(Boolean)}))}); } return A.trails[p.trail]; };
A.flat=t=>t.days.reduce((a,d,di)=>a.concat(d.stops.map(s=>Object.assign(Object.create(s),{dayIdx:di}))),[]);
A.typeOf=t=>D.TYPES[t.type];
A.daysLabel=t=>t.days.length===1?'1 day':t.days.length+' days';
/* capped trails: cars left on a date (deterministic so the demo is stable) */
const hash=s=>{let h=2166136261; for(let i=0;i<s.length;i++){h^=s.charCodeAt(i); h=Math.imul(h,16777619);} return (h>>>0);};
A.hash=hash;
A.left=(tid,date)=>{ const t=A.trails[tid]; const cap=t?t.cap:4; const d=A.dow(date); const r=hash(tid+date)%100; let taken=d===6?(r<25?cap:r<60?cap-1:cap-2):d===0?(r<15?cap:r<50?cap-2:1):(r<55?0:r<85?1:2); taken=Math.max(0,Math.min(cap,taken)); const mine=S.passes.filter(p=>p.trail===tid&&p.date===date&&!p.sample).length; return Math.max(0,cap-taken-mine); };
/* which hosts are away on a given date (their closed weekdays) */
A.closedOn=(t,date)=>{ const out=[]; t.days.forEach((d,di)=>{ const wd=A.dow(addDays(date,di)); d.stops.forEach(s=>{ if(s.host&&s.closed&&s.closed.includes(wd)) out.push(s); }); }); return out; };
const CARRANK={small:0,regular:1,suv:2};
A.carIssues=(t,car)=>A.flat(t).filter(s=>CARRANK[s.minCar||'small']>CARRANK[car]);
A.spend=t=>A.flat(t).reduce((a,s)=>a+(s.spend||0),0);

/* ---------- passes ---------- */
const SEED=()=>[
 {code:'DNA-7K2M',trail:'tikves',date:'2027-05-15',car:'regular',people:2,stage:'confirmed',at:0,got:[],sample:true,bought:'2027-05-11'},
 {code:'DNA-3QF8',trail:'galicnik',date:'2027-05-02',car:'small',people:2,stage:'done',at:4,got:['galicnik/church','galicnik/sheep','galicnik/lunch','galicnik/duf'],sample:true,bought:'2027-04-30'}
];
const S=A.state={
  get passes(){ let p=store.get('passes',null); if(!p){ p=SEED(); store.set('passes',p); } return p; },
  set passes(v){ store.set('passes',v); },
  get roots(){ return store.get('roots',null); }, set roots(v){ store.set('roots',v); },
  get user(){ return store.get('user',null); }, set user(v){ store.set('user',v); },
  ui:{}
};
A.pass=code=>S.passes.find(p=>p.code===code);
/* passes that belong to the signed-in profile: the sample account owns the two sample passes */
A.mine=()=>{ const u=S.user; if(!u) return []; return S.passes.filter(p=>p.owner?p.owner===u.contact:(u.sample?p.sample:!p.sample)); };
A.savePass=p=>{ S.passes=S.passes.map(x=>x.code===p.code?p:x); if(A.refreshHead) A.refreshHead(); };
A.newCode=()=>{ const al='ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let c; do{ c='DNA-'+Array.from({length:4},()=>al[Math.floor(Math.random()*al.length)]).join(''); }while(A.pass(c)); return c; };
A.buy=o=>{ const p=Object.assign({code:A.newCode(),stage:'booked',at:0,got:[],bought:A.today,owner:S.user?S.user.contact:null},o); const all=S.passes; all.unshift(p); S.passes=all; if(A.refreshHead) A.refreshHead(); return p; };
A.callDay=p=>addDays(p.date,-1);
/* after the evening call: which stops were swapped for their backup */
A.swapped=p=>A.closedOn(A.trailOf(p),p.date).map(s=>s.ref);
A.stageLabel=p=>({booked:'Calls go out '+A.dShort(A.callDay(p)),confirmed:'Hosts confirmed',road:'On the road',done:'Trail finished'}[p.stage])+(p.refunded?' · refunded':'');
A.activePass=()=>S.passes.find(p=>p.stage!=='done');
/* passport: every stamp collected on this device */
A.stamps=()=>{ const out=[]; A.mine().forEach(p=>{ const t=A.trailOf(p); if(!t) return; const fl=A.flat(t); (p.got||[]).forEach(ref=>{ const s=A.stopIndex[ref]; if(!s) return; const st=fl.find(x=>x.ref===ref); out.push({stop:s,pass:p,date:addDays(p.date,st?st.dayIdx:0),trail:t}); }); }); return out; };
A.dividend=p=>{ const t=A.trailOf(p); const got=A.flat(t).filter(s=>s.host&&(p.got||[]).includes(s.ref)&&!(p.closedStop===s.ref)); const eur=got.reduce((a,s)=>a+Math.round((s.spend||0)*Math.max(1,(p.people||2))/2),0); const villages=[...new Set(got.map(s=>s.where))]; return {eur,families:got.length,villages:villages.length,list:got}; };

/* ---------- stamps ---------- */
/* o: {shape:'round'|'box', tone:'gold'|'green'|'rust'|'ink', a,b,c, rot, size, ghost, land, delay} */
A.stamp=o=>{
  o=Object.assign({shape:'round',tone:'gold',rot:-7,size:112},o);
  const cls=['stamp',o.tone,o.shape,o.ghost?'ghost':'',o.land?'land':'',o.cls||''].join(' ');
  const st=`--rot:${o.rot}deg;${o.shape==='round'?`width:${o.size}px`:`width:${Math.round(o.size*1.5)}px`}${o.delay?`;animation-delay:${o.delay}ms`:''}`;
  let inner; const fit=(s,fs,max)=>{ const n=String(s||'').length; return n>max?` style="font-size:${(fs*max/n).toFixed(1)}px;letter-spacing:0"`:''; };
  if(o.shape==='round'){
    const bl=String(o.b||'').split('|');
    inner=`<circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" stroke-width="3.2"${o.ghost?' stroke-dasharray="5 5"':''}/><circle cx="60" cy="60" r="50.5" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <text class="s-arc"><textPath href="#arcT" startOffset="50%">${esc(o.a||'')}</textPath></text>
    <text class="s-arc"><textPath href="#arcB" startOffset="50%">${esc(o.c||'')}</textPath></text>
    <path d="M12.5 60h5M102.5 60h5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
    ${bl.length>1?`<text class="s-mid" x="60" y="57"${fit(bl[0],15,7)}>${esc(bl[0])}</text><text class="s-mid s2" x="60" y="72"${fit(bl[1],11.5,9)}>${esc(bl[1])}</text>`:`<text class="s-mid" x="60" y="65.5"${fit(bl[0],15,7)}>${esc(bl[0])}</text>`}`;
    return `<span class="${cls}" style="${st}" role="img" aria-label="${esc([o.a,(o.b||'').replace('|',' '),o.c].filter(Boolean).join(', '))}"><svg viewBox="0 0 120 120"><g${o.ghost?'':' filter="url(#ink)"'}>${o.ghost?'':`<g opacity=".22" transform="translate(1.6 1.1)">${inner}</g>`}${inner}</g></svg></span>`;
  }
  inner=`<rect x="3" y="3" width="174" height="66" rx="5" fill="none" stroke="currentColor" stroke-width="3"${o.ghost?' stroke-dasharray="5 5"':''}/><rect x="8" y="8" width="164" height="56" rx="2.5" fill="none" stroke="currentColor" stroke-width="1"/>
   <text class="s-top" x="90" y="23">${esc(o.a||'')}</text><text class="s-big" x="90" y="45"${fit(o.b,21,11)}>${esc(o.b||'')}</text><text class="s-top" x="90" y="59">${esc(o.c||'')}</text>`;
  return `<span class="${cls}" style="${st}" role="img" aria-label="${esc([o.a,o.b,o.c].filter(Boolean).join(', '))}"><svg viewBox="0 0 180 72"><g${o.ghost?'':' filter="url(#ink)"'}>${o.ghost?'':`<g opacity=".22" transform="translate(1.6 1.1)">${inner}</g>`}${inner}</g></svg></span>`;
};
A.defs=()=>{ if($('#gdefs')) return; const d=document.createElement('div'); d.id='gdefs'; d.setAttribute('aria-hidden','true'); d.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
  d.innerHTML=`<svg width="0" height="0"><defs>
   <path id="arcT" d="M 20.5,60 a 39.5,39.5 0 1,1 79,0"/><path id="arcB" d="M 13.5,60 a 46.5,46.5 0 0,0 93,0"/>
   <filter id="ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="1.6" result="d"/><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="9" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -5 3.7" result="m"/><feComposite in="d" in2="m" operator="in"/></filter>
  </defs></svg>`; document.body.appendChild(d); };

/* ---------- host faces (drawn, because real portraits come with the first driven trails) ---------- */
const SKIN=['#F1CBA6','#E3B28C','#CC9670'];
A.face=(f,size,bg)=>{ f=f||{}; const sk=SKIN[f.skin||0], hr=f.hair||'#444', top=f.top||'#1C562B'; let back='',hair='',extra='';
  let hx=48,hy=40,rx=17,ry=20;
  if(f.style==='long') back=`<path d="M28 42C26 20 39 13 48 13s22 7 20 29l2 22c-5 4-10-1-10-6H36c0 5-5 10-10 6z" fill="${hr}"/>`;
  if(f.style==='scarf'){ back=`<path d="M27 44C24 21 37 12 48 12s24 9 21 32c0 13-9 21-21 23-12-2-21-10-21-23z" fill="${f.scarf||'#B3602A'}"/><path d="M43 64l5 9 5-9z" fill="${f.scarf||'#B3602A'}"/>`; rx=13.5; ry=16.5; hy=42; hair=`<path d="M35.500 37c3-7 8-9 12.500-9s9.500 2 12.500 9c-4-3-8-4-12.500-4s-8.500 1-12.500 4z" fill="${hr}"/>`; }
  if(f.style==='short') hair=`<path d="M31 38c-1-16 8-22 17-22s18 6 17 22c-2-8-8-11-17-11s-15 3-17 11z" fill="${hr}"/>`;
  if(f.style==='long') hair=`<path d="M31 38c0-15 8-21 17-21s17 6 17 21c-4-8-10-10-17-10s-13 2-17 10z" fill="${hr}"/>`;
  if(f.style==='bun') hair=`<circle cx="48" cy="14" r="7.500" fill="${hr}"/><path d="M31 38c-1-16 8-21 17-21s18 5 17 21c-2-8-8-11-17-11s-15 3-17 11z" fill="${hr}"/>`;
  if(f.style==='bald') hair=`<path d="M31 41c-1-5 0-9 2-12l1.500 10zM65 41c1-5 0-9-2-12l-1.500 10z" fill="${hr}"/>`;
  if(f.style==='cap') hair=`<path d="M31 40c-.5-4 0-7 1-9h32c1 2 1.500 5 1 9l-2.500-6h-29z" fill="${hr}"/><path d="M29 32c0-12 9-17.500 20-17.500S68 20 68 30l8 3.500c-5 2.500-16 1.500-47-1.500z" fill="${f.cap||'#383838'}"/>`;
  if(f.beard) extra+=`<path d="M31.500 43c1 15 9 20 16.500 20s15.500-5 16.500-20c-3 9-9 12-16.500 12s-13.500-3-16.500-12z" fill="${hr}"/>`;
  const mouth=f.mous?`<path d="M39.500 49.500q4.500-4.500 8.500-1.500 4-3 8.500 1.500-4.500 2.500-8.500 1-4 1.500-8.500-1z" fill="${hr}"/>`:`<path d="M42.500 49q5.500 5 11 0" fill="none" stroke="#7A3F2A" stroke-width="1.700" stroke-linecap="round"/>`;
  if(f.glasses) extra+=`<g fill="none" stroke="#383838" stroke-width="1.400"><circle cx="41.300" cy="41" r="5"/><circle cx="54.700" cy="41" r="5"/><path d="M46.300 41h3.400"/></g>`;
  const ear=f.style==='scarf'?'':`<circle cx="31" cy="42" r="3.400" fill="${sk}"/><circle cx="65" cy="42" r="3.400" fill="${sk}"/>`;
  return `<svg class="face" viewBox="0 0 96 96" width="${size||64}" height="${size||64}" aria-hidden="true"><circle cx="48" cy="48" r="48" fill="${bg||'#D0E8D6'}"/><clipPath id="fc"><circle cx="48" cy="48" r="48"/></clipPath><g clip-path="url(#fc)">${back}<path d="M12 98c0-22 16-31 36-31s36 9 36 31z" fill="${top}"/><rect x="41.500" y="55" width="13" height="14" rx="5" fill="${sk}" style="filter:brightness(.93)"/>${ear}<ellipse cx="${hx}" cy="${hy}" rx="${rx}" ry="${ry}" fill="${sk}"/>${hair}<circle cx="41.300" cy="41" r="1.700" fill="#2B2B2B"/><circle cx="54.700" cy="41" r="1.700" fill="#2B2B2B"/><circle cx="37" cy="47" r="3" fill="#B3602A" opacity=".2"/><circle cx="59" cy="47" r="3" fill="#B3602A" opacity=".2"/>${mouth}${extra}</g></svg>`; };
A.host=id=>D.HOSTS[id];
A.shortWhere=w=>{ const p=String(w).split(',').map(x=>x.trim()); let s=p[p.length-1].replace(/^above /,''); return s.length>16?p[0]:s; };
A.hostChip=(id,size)=>{ const h=D.HOSTS[id]; if(!h) return ''; return `<span class="hostchip">${A.face(h.face,size||40)}<span><b>${esc(h.name)}</b><small>${esc(h.role)}</small></span></span>`; };

/* ---------- helix ---------- */
/* horizontal strip: n rungs; status(i) -> 'done'|'now'|'' */
A.helixH=(n,o)=>{ o=Object.assign({seg:54,h:44,status:()=>'',numbers:true},o); const w=o.seg*n, cy=o.h/2, amp=o.h/2-9; let a='',b='';
  for(let x=0;x<=w;x+=3){ const y=amp*Math.sin(Math.PI*x/o.seg); a+=(x?'L':'M')+x+','+(cy-y).toFixed(1); b+=(x?'L':'M')+x+','+(cy+y).toFixed(1); }
  let rungs=''; for(let i=0;i<n;i++){ const x=o.seg*(i+.5), st=o.status(i); rungs+=`<g class="rung ${st}"><path d="M${x},${cy-amp}V${cy+amp}"/><circle cx="${x}" cy="${cy}" r="${o.numbers?9:5}"/>${o.numbers?`<text x="${x}" y="${cy+3.6}">${i+1}</text>`:''}</g>`; }
  return `<svg class="helixh" viewBox="0 0 ${w} ${o.h}" style="width:${w}px;max-width:100%" aria-hidden="true"><path class="strand story" d="${b}"/><path class="strand road" d="${a}"/>${rungs}</svg>`; };
/* vertical: draws behind a list of .hstop rows inside a .helixlist container */
A.drawHelix=box=>{ if(!box) return; const stops=$$('.hstop',box); let svg=$('svg.helixv',box); if(!svg){ svg=document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('class','helixv'); svg.setAttribute('aria-hidden','true'); box.prepend(svg); }
  const H=box.offsetHeight, W=64, cx=W/2, amp=17; if(!stops.length||!H) return; const ys=stops.map(s=>s.offsetTop+30);
  const tw=ys.slice(1).map((y,i)=>Math.max(1,2*Math.round(((y-ys[i])/150-1)/2)+1)); const base=[Math.PI/2]; tw.forEach((k,i)=>base.push(base[i]+k*Math.PI));
  const ph=y=>{ if(y<=ys[0]) return base[0]-(ys[0]-y)/150*Math.PI; for(let i=0;i<ys.length-1;i++){ if(y<=ys[i+1]) return base[i]+(y-ys[i])/(ys[i+1]-ys[i])*tw[i]*Math.PI; } return base[ys.length-1]+(y-ys[ys.length-1])/150*Math.PI; };
  const y0=Math.max(0,ys[0]-44), y1=Math.min(H,ys[ys.length-1]+48); let a='',b='';
  for(let y=y0;y<=y1;y+=3){ const dx=amp*Math.sin(ph(y)); a+=(a?'L':'M')+(cx+dx).toFixed(1)+','+y; b+=(b?'L':'M')+(cx-dx).toFixed(1)+','+y; }
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`); svg.setAttribute('width',W); svg.setAttribute('height',H);
  svg.innerHTML=`<path class="strand story" d="${b}"/><path class="strand road" d="${a}"/>`+stops.map((s,i)=>`<g class="rung ${s.dataset.st||''}"><path d="M${cx-amp},${ys[i]}H${cx+amp}"/><circle cx="${cx}" cy="${ys[i]}" r="13"/><text x="${cx}" y="${ys[i]+4.5}">${s.dataset.n||i+1}</text></g>`).join(''); };
A.watchHelix=box=>{ if(!box) return; A.drawHelix(box); if(window.ResizeObserver){ const ro=new ResizeObserver(()=>{ if(!document.body.contains(box)){ro.disconnect();return;} A.drawHelix(box); }); ro.observe(box); } };

/* ---------- the paper pass ---------- */
A.qr=code=>{ const N=21; let h=hash(code); const rnd=()=>{ h^=h<<13; h^=h>>>17; h^=h<<5; return (h>>>0)/4294967296; }; let r='';
  const finder=(x,y)=>`<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="var(--pass)"/><rect x="${x+2}" y="${y+2}" width="3" height="3"/>`;
  const inF=(x,y)=>(x<8&&y<8)||(x>12&&y<8)||(x<8&&y>12);
  for(let y=0;y<N;y++) for(let x=0;x<N;x++){ if(inF(x,y)) continue; if(rnd()<.47) r+=`<rect x="${x}" y="${y}" width="1.050" height="1.050"/>`; }
  return `<svg class="qr" viewBox="-1 -1 23 23" aria-hidden="true">${finder(0,0)}${finder(14,0)}${finder(0,14)}${r}</svg>`; };
A.ticket=o=>{ /* o:{trail, date, car, people, code, stage, stamp, cls, href} */
  const t=o.trail, ty=D.TYPES[t.type]; const n=t.nStops||A.flat(t).length; const range=o.date?(t.days.length>1?A.dShort(o.date)+' to '+A.dShort(addDays(o.date,t.days.length-1)):A.dLong(o.date)):'Pick your date';
  return `<div class="ticketwrap ${o.cls||''}"><article class="ticket">
   <div class="t-main">
    <div class="t-head"><img src="assets/logo/symbol-color.svg" alt=""><span>Trail pass</span><span class="t-type">${esc(ty.label)} · ${esc(A.daysLabel(t))}</span></div>
    <h3>${o.href?`<a href="${o.href}">${esc(t.title)}</a>`:esc(t.title)}</h3>
    <dl class="t-fields"><div><dt>Date</dt><dd>${esc(range)}</dd></div><div><dt>Car</dt><dd>${o.car?esc(D.CARS[o.car].label):'One car'}${o.people?', '+o.people+' aboard':''}</dd></div><div><dt>Starts</dt><dd>${esc(t.start||'Your door')}</dd></div><div><dt>Stops</dt><dd>${n}, ${A.flat(t).filter(s=>s.host).length} hosts called</dd></div></dl>
    <div class="t-foot"><div class="t-helix">${A.helixH(n,{seg:Math.max(26,Math.min(50,Math.floor((o.stamp?260:400)/n))),h:38,status:o.status||(()=>'')})}</div>${o.stamp||''}</div>
   </div>
   <div class="t-stub"><span class="t-admit">Admit one car</span>${A.qr(o.code||t.id)}<span class="t-code">${esc(o.code||'DNA-····')}</span><span class="t-price">EUR ${t.price}</span></div>
  </article></div>`; };

/* ---------- shared bits ---------- */
A.img=(key,alt,attrs)=>`<img src="assets/img/${key}.jpg" alt="${esc(alt||'')}" loading="lazy" ${attrs||''}>`;
document.addEventListener('error',e=>{const t=e.target; if(t&&t.tagName==='IMG'&&!t.dataset.fb&&/assets\/img\//.test(t.src)){t.dataset.fb=1; t.src='assets/img/placeholder.jpg';}},true);
A.sample=t=>`<span class="sample">${t||'Sample'}</span>`;
A.typeTag=t=>`<span class="tag ${t.type}">${esc(D.TYPES[t.type].label)}</span>`;
A.leftTag=(tid,date)=>{ const n=A.left(tid,date), cap=A.trails[tid].cap; return n===0?`<span class="left none">Full on ${A.dShort(date)}</span>`:`<span class="left ${n<=1?'low':''}">${n} of ${cap} cars left ${A.dShort(date)}</span>`; };
A.nextSat=()=>{ let d=A.today; for(let i=1;i<9;i++){ const x=addDays(d,i); if(A.dow(x)===6&&i>1) return x; } return addDays(d,8); };
A.trailCard=t=>{ const sat=addDays(A.today,8); const hosts=[...new Set(A.flat(t).filter(s=>s.host).map(s=>s.host))];
  return `<article class="tcard"><a class="tc-media" href="#trail-${t.id}" tabindex="-1" aria-hidden="true">${A.img(t.img,'')}<span class="tc-price"><b>EUR ${t.price}</b> per car</span>${t.audio?`<span class="tc-audio">${ic('head')}Audio stories</span>`:''}</a>
   <div class="tc-body"><div class="row gap6">${A.typeTag(t)}<span class="tag line">${esc(A.daysLabel(t))}</span><span class="tag line">${esc(A.regions[t.region].name)}</span></div>
   <h3><a href="#trail-${t.id}">${esc(t.title)}</a></h3><p class="tc-sub">${esc(t.sub)}</p>
   <div class="tc-hosts">${hosts.slice(0,4).map(h=>A.face(D.HOSTS[h].face,34)).join('')}<span>${hosts.map(h=>D.HOSTS[h].name).slice(0,3).join(', ')}${hosts.length>3?' and '+(hosts.length-3)+' more':''} ${hosts.length===1?'is':'are'} on the call list</span></div>
   <div class="tc-foot"><span class="driven">${ic('check')}Driven ${esc(t.driven)}</span>${A.leftTag(t.id,sat)}</div></div></article>`; };
A.promise=()=>`<div class="promise"><div>${ic('phone')}<b>It calls ahead.</b><span>We phone every host on your route, in Macedonian, the evening before.</span></div><div>${ic('shield')}<b>Works or it's free.</b><span>A confirmed stop that is closed means a full refund. No forms.</span></div><div>${ic('wifi')}<b>Works without signal.</b><span>Route, road notes and stories are saved to your phone.</span></div></div>`;

/* ---------- toast / modal ---------- */
let toastT;
A.toast=(html,ms)=>{ $$('.toast').forEach(t=>t.remove()); const t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.innerHTML=html; document.body.appendChild(t); clearTimeout(toastT); toastT=setTimeout(()=>t.remove(),ms||3400); };
A.modal=(html,cls)=>{ A.closeModal(); const o=document.createElement('div'); o.className='overlay'; o.innerHTML=`<div class="modal ${cls||''}" role="dialog" aria-modal="true"><button class="iconbtn x" data-close aria-label="Close">${ic('close')}</button>${html}</div>`; o.addEventListener('click',e=>{ if(e.target===o||e.target.closest('[data-close]')) A.closeModal(); }); document.body.appendChild(o); const f=o.querySelector('input,select,button:not(.x),a'); if(f) f.focus(); return o; };
A.closeModal=()=>$$('.overlay').forEach(o=>o.remove());
document.addEventListener('click',e=>{
  const cp=e.target.closest('[data-copy]'); if(cp){ const txt=cp.dataset.copy; const done=()=>A.toast(`${ic('check')} Copied`); try{navigator.clipboard.writeText(txt).then(done,()=>A.toast('Select the text to copy it'));}catch(_){A.toast('Select the text to copy it');} return; }
  const tg=e.target.closest('[data-soon]'); if(tg){ e.preventDefault(); A.toast(esc(tg.dataset.soon||'Not wired up in this prototype')); return; }
},false);
document.addEventListener('keydown',e=>{ if(e.key==='Escape') A.closeModal(); });
})();
