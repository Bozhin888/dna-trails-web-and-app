/* DNA Trails prototype 2: SVG map on a real shaded-relief base (carried over from prototype 1) */
(function(){
const A=window.APP, D=window.DNA, GEO=window.GEO, MD=window.MAPDATA, ic=A.ic, esc=A.esc;
const W=GEO.w,H=GEO.h, NS='http://www.w3.org/2000/svg';
const REGCOL={}; D.REGIONS.forEach(r=>REGCOL[r.key]=r.color);
const RAMP=['#EEF4EF','#D0E8D6','#D9D08F','#C99A4A','#B3602A','#7A3414'];
function hex(c){return [1,3,5].map(i=>parseInt(c.slice(i,i+2),16));}
function ramp(t){ t=Math.max(0,Math.min(1,t)); const n=RAMP.length-1; const i=Math.min(n-1,Math.floor(t*n)); const f=t*n-i; const a=hex(RAMP[i]),b=hex(RAMP[i+1]); return 'rgb('+a.map((v,k)=>Math.round(v+(b[k]-v)*f)).join(',')+')'; }
A.ramp=ramp; A.RAMP=RAMP;
const MONTH_MAX=Math.max(...MD.tourists.map(r=>Math.max(...r)));
const YEAR_MAX=Math.max(...MD.tourists.map(r=>r.reduce((a,b)=>a+b,0)));
A.heatT=(v,month)=>v<=0?0:Math.log(1+v)/Math.log(1+(month==null?YEAR_MAX:MONTH_MAX));
const catKeys=MD.cats;

A.makeMap=function(host,o){
  o=Object.assign({dark:false,regions:'outline',labels:'regions',towns:true,dots:false,heat:false,month:null,pins:[],route:null,interactive:true,zoomUi:true,attrib:true,pinLabels:false,minScale:1},o||{});
  host.classList.add('mapbox'); if(o.dark) host.classList.add('dark');
  host.innerHTML='';
  const svg=document.createElementNS(NS,'svg'); svg.setAttribute('role','img'); svg.setAttribute('aria-label',o.aria||'Map of Macedonia'); svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  const g=(cls)=>{const e=document.createElementNS(NS,'g'); if(cls) e.setAttribute('class',cls); svg.appendChild(e); return e;};
  const el=(parent,tag,attrs,text)=>{const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(text!=null) e.textContent=text; parent.appendChild(e); return e;};
  const gBase=g(); el(gBase,'image',{href:'assets/img/'+(o.dark?'relief-dark':'relief')+'.jpg',x:0,y:0,width:W,height:H,preserveAspectRatio:'none'});
  const defs=el(svg,'defs',{}); const uid='f'+Math.random().toString(36).slice(2,7); const bgc=o.dark?'#132B18':'#F7F6F1';
  [['l',1,0,0,0],['r',0,0,1,0],['t',0,1,0,0],['b',0,0,0,1]].forEach(([n,x1,y1,x2,y2])=>{ const lg=el(defs,'linearGradient',{id:uid+n,x1,y1,x2,y2}); el(lg,'stop',{offset:0,'stop-color':bgc,'stop-opacity':0}); el(lg,'stop',{offset:1,'stop-color':bgc,'stop-opacity':1}); });
  const F=90; el(gBase,'rect',{x:-2,y:-2,width:F,height:H+4,fill:`url(#${uid}l)`}); el(gBase,'rect',{x:W-F+2,y:-2,width:F,height:H+4,fill:`url(#${uid}r)`}); el(gBase,'rect',{x:-2,y:-2,width:W+4,height:F,fill:`url(#${uid}t)`}); el(gBase,'rect',{x:-2,y:H-F+2,width:W+4,height:F,fill:`url(#${uid}b)`});
  const gHeat=g(), gReg=g(), gWater=g(), gBorder=g(), gDots=g(), gLab=g(), gRoute=g(), gPins=g();
  /* water + border */
  for(const k in GEO.rivers) el(gWater,'path',{d:GEO.rivers[k],class:'river'});
  for(const k in GEO.lakes) el(gWater,'path',{d:GEO.lakes[k],class:'lake'});
  el(gBorder,'path',{d:GEO.country,class:'cborder',style:o.dark?'stroke:#D0E8D6;stroke-opacity:.55':''});
  /* municipalities */
  const muniEls=GEO.munis.map((m,i)=>{const p=el(gHeat,'path',{d:m.d,class:'muni','data-i':i}); return p;});
  /* regions */
  const regEls={};
  D.REGIONS.forEach(r=>{const gr=GEO.regions[r.key]; const p=el(gReg,'path',{d:gr.d,class:'reg','data-r':r.id,fill:r.color,tabindex:o.onRegion?0:-1}); regEls[r.id]=p; });
  /* labels */
  const regLab={};
  D.REGIONS.forEach(r=>{const c=GEO.regions[r.key].c; regLab[r.id]=el(gLab,'text',{x:c[0],y:c[1],class:'rlabel'},r.name);});
  const townEls=D.TOWNS.map(t=>{const [x,y]=A.proj(t[2],t[1]); const gg=el(gLab,'g',{class:'town'}); el(gg,'circle',{cx:x,cy:y,r:5,fill:o.dark?'#D0E8D6':'#132B18',stroke:'#fff','stroke-width':2}); el(gg,'text',{x:x+10,y:y+6,class:'tlabel'},t[0]); return {g:gg,x,y,c:gg.firstChild,t:gg.lastChild};});
  if(o.dark){ gLab.querySelectorAll('text').forEach(t=>{t.style.fill='#F4FAF5';t.style.stroke='rgba(19,43,24,.85)';}); }
  /* catalogue dots: one zero-length path per category, drawn at constant screen size */
  const dotEls={};
  catKeys.forEach((c,ci)=>{ const pts=MD.points.filter(p=>p[3]===ci); if(!pts.length) return; const d=pts.map(p=>`M${p[0]},${p[1]}h0`).join(''); const col=o.dark?'#E9D98A':(D.MAPCATS[c]||['','#383838'])[1]; dotEls[c]=el(gDots,'path',{d,fill:'none',stroke:col,'stroke-width':o.dark?3.4:6.5,'stroke-linecap':'round','vector-effect':'non-scaling-stroke',opacity:o.dark?.85:.9}); });
  host.appendChild(svg);
  const tip=document.createElement('div'); tip.className='map-tip'; tip.hidden=true; host.appendChild(tip);
  if(o.zoomUi&&o.interactive){ const z=document.createElement('div'); z.className='zoom'; z.innerHTML=`<button class="iconbtn" data-z="in" aria-label="Zoom in">${ic('plus')}</button><button class="iconbtn" data-z="out" aria-label="Zoom out">${ic('minus')}</button><button class="iconbtn" data-z="reset" aria-label="Reset view">${ic('compass')}</button>`; host.appendChild(z); z.addEventListener('click',e=>{const b=e.target.closest('[data-z]'); if(!b) return; if(b.dataset.z==='reset') api.reset(); else zoomAt(view.x+view.w/2,view.y+view.h/2,b.dataset.z==='in'?1/1.5:1.5,true);}); }
  if(o.attrib){ const a=document.createElement('div'); a.className='attrib'; a.innerHTML='Relief from open elevation data · Natural Earth · <a href="#credits">credits</a>'; host.appendChild(a); }

  /* view handling */
  let home={x:0,y:0,w:W,h:H};
  function computeHome(){ const r=host.getBoundingClientRect(); const ar=(r.width>40&&r.height>40)?r.width/r.height:W/H; const w=Math.max(W,H*ar), h=w/ar; home={x:(W-w)/2,y:(H-h)/2,w,h}; }
  computeHome();
  let view=Object.assign({},home);
  const state={dotsOn:new Set(), heat:o.heat, month:o.month, regions:o.regions, pins:[], sel:null};
  function k(){ const r=svg.getBoundingClientRect(); const s=Math.max(view.w/(r.width||800),view.h/(r.height||600)); return s; }
  function apply(){ svg.setAttribute('viewBox',`${view.x.toFixed(1)} ${view.y.toFixed(1)} ${view.w.toFixed(1)} ${view.h.toFixed(1)}`); const s=k(); svg.style.setProperty('--k',s);
    const zoom=W/view.w;
    for(const id in regLab){ regLab[id].style.fontSize=(15*s)+'px'; regLab[id].style.strokeWidth=(4*s)+'px'; regLab[id].style.display=(o.labels==='regions'&&zoom<2.6)?'':'none'; }
    townEls.forEach((t,i)=>{ const show=o.towns&&(zoom>1.5||i<8)&&(o.labels!=='regions'||zoom>1.25); t.g.style.display=show?'':'none'; t.c.setAttribute('r',3.2*s); t.c.setAttribute('stroke-width',1.4*s); t.t.style.fontSize=(12.5*s)+'px'; t.t.style.strokeWidth=(3.5*s)+'px'; t.t.setAttribute('x',t.x+7*s); t.t.setAttribute('y',t.y+4.5*s); });
    gPins.querySelectorAll('.pin').forEach(p=>p.setAttribute('transform',`translate(${p.dataset.x},${p.dataset.y}) scale(${s})`));
    gReg.querySelectorAll('.reg').forEach(p=>p.style.strokeWidth=(o.dark?1.2:1.8)*s);
  }
  function clamp(){ const minW=W/14, maxW=Math.max(W*1.15,home.w); view.w=Math.max(minW,Math.min(maxW,view.w)); view.h=view.w*(home.h/home.w); const x0=Math.min(-W*.2,home.x), x1=Math.max(W*1.2,home.x+home.w), y0=Math.min(-H*.2,home.y), y1=Math.max(H*1.2,home.y+home.h); view.x=Math.max(x0,Math.min(x1-view.w,view.x)); view.y=Math.max(y0,Math.min(y1-view.h,view.y)); }
  let anim;
  function animateTo(t){ cancelAnimationFrame(anim); const s=Object.assign({},view), t0=performance.now(); const step=now=>{const u=Math.min(1,(now-t0)/380), e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2; view={x:s.x+(t.x-s.x)*e,y:s.y+(t.y-s.y)*e,w:s.w+(t.w-s.w)*e,h:s.h+(t.h-s.h)*e}; apply(); if(u<1) anim=requestAnimationFrame(step);}; anim=requestAnimationFrame(step); }
  function zoomAt(cx,cy,f,smooth){ const t={w:view.w*f,h:view.h*f}; t.x=cx-(cx-view.x)*f; t.y=cy-(cy-view.y)*f; const keep=view; view=Object.assign({},t); clamp(); const target=Object.assign({},view); view=keep; if(smooth) animateTo(target); else {view=target; apply();} }
  function toMap(ev){ const r=svg.getBoundingClientRect(); const s=Math.max(view.w/r.width,view.h/r.height); const ox=(r.width-view.w/s)/2, oy=(r.height-view.h/s)/2; return [view.x+(ev.clientX-r.left-ox)*s, view.y+(ev.clientY-r.top-oy)*s, s]; }
  function toScreen(x,y){ const r=svg.getBoundingClientRect(); const s=Math.max(view.w/r.width,view.h/r.height); const ox=(r.width-view.w/s)/2, oy=(r.height-view.h/s)/2; return [(x-view.x)/s+ox,(y-view.y)/s+oy]; }
  function showTip(x,y,html){ const [sx,sy]=toScreen(x,y); tip.innerHTML=html; tip.style.left=sx+'px'; tip.style.top=sy+'px'; tip.hidden=false; }
  function hideTip(){ tip.hidden=true; }

  if(o.interactive){
    svg.addEventListener('wheel',e=>{ e.preventDefault(); const [mx,my]=toMap(e); zoomAt(mx,my,e.deltaY>0?1.18:1/1.18); hideTip(); },{passive:false});
    const ptrs=new Map(); let moved=0, last=null, pinch0=null;
    svg.addEventListener('pointerdown',e=>{ ptrs.set(e.pointerId,e); moved=0; last=[e.clientX,e.clientY]; if(ptrs.size===2){const [a,b]=[...ptrs.values()]; pinch0={d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),w:view.w};} });
    svg.addEventListener('pointermove',e=>{
      if(!ptrs.has(e.pointerId)){ hover(e); return; }
      ptrs.set(e.pointerId,e);
      if(ptrs.size===2&&pinch0){ const [a,b]=[...ptrs.values()]; const d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY); const f=(pinch0.w*pinch0.d/d)/view.w; const mid={clientX:(a.clientX+b.clientX)/2,clientY:(a.clientY+b.clientY)/2}; const [mx,my]=toMap(mid); zoomAt(mx,my,f); moved=99; return; }
      const s=k(); const dx=e.clientX-last[0], dy=e.clientY-last[1]; moved+=Math.abs(dx)+Math.abs(dy); if(moved>4){ try{svg.setPointerCapture(e.pointerId);}catch(_){} svg.classList.add('drag'); view.x-=dx*s; view.y-=dy*s; clamp(); apply(); hideTip(); } last=[e.clientX,e.clientY]; });
    const up=e=>{ ptrs.delete(e.pointerId); if(ptrs.size<2) pinch0=null; svg.classList.remove('drag'); };
    svg.addEventListener('pointerup',up); svg.addEventListener('pointercancel',up); svg.addEventListener('pointerleave',e=>{ if(!ptrs.size) hideTip(); });
    svg.addEventListener('click',e=>{ if(moved>6) return; click(e); });
    svg.addEventListener('keydown',e=>{ if(e.key==='Enter'&&e.target.classList.contains('reg')&&o.onRegion) o.onRegion(e.target.dataset.r); if(e.key==='Enter'&&e.target.closest('.pin')){const p=e.target.closest('.pin'); if(o.onPin) o.onPin(p.dataset.key);} });
  }
  function nearestDot(mx,my,s){ if(!state.dotsOn.size) return null; let best=null,bd=(9*s)*(9*s); for(const p of MD.points){ if(!state.dotsOn.has(catKeys[p[3]])) continue; const dx=p[0]-mx,dy=p[1]-my,d=dx*dx+dy*dy; if(d<bd){bd=d;best=p;} } return best; }
  function hover(e){ const pin=e.target.closest&&e.target.closest('.pin'); if(pin){ showTip(+pin.dataset.x,+pin.dataset.y-14*k(),`${esc(pin.dataset.title)}<small>${esc(pin.dataset.sub||'')}</small>`); return; }
    const [mx,my,s]=toMap(e); const d=nearestDot(mx,my,s); if(d){ const m=GEO.munis[d[4]]; showTip(d[0],d[1],`${esc(d[2])}<small>${(D.MAPCATS[catKeys[d[3]]]||[''])[0]}${m?' · '+esc(m.name):''}</small>`); svg.style.cursor='pointer'; return; }
    svg.style.cursor='';
    const mu=e.target.classList&&e.target.classList.contains('muni')&&state.heat?e.target:null;
    if(mu){ const i=+mu.dataset.i, m=GEO.munis[i]; const v=state.month==null?MD.tourists[i].reduce((a,b)=>a+b,0):MD.tourists[i][state.month]; showTip(m.c[0],m.c[1],`${esc(m.name)}<small>${A.fmt(v)} domestic arrivals, ${state.month==null?'2023':D.MONTHS_FULL[state.month]+' 2023'}</small>`); return; }
    const rg=e.target.classList&&e.target.classList.contains('reg')?e.target:null;
    if(rg&&o.onRegion){ const r=A.regions[rg.dataset.r]; const c=GEO.regions[r.key].c; showTip(c[0],c[1]-30*s,`${r.name} region<small>${esc(r.towns)}</small>`); return; }
    hideTip(); }
  function click(e){ const pin=e.target.closest&&e.target.closest('.pin'); if(pin){ if(o.onPin) o.onPin(pin.dataset.key); return; }
    const [mx,my,s]=toMap(e); const d=nearestDot(mx,my,s); if(d){ if(o.onDot) o.onDot(d); return; }
    if(e.target.classList.contains('muni')&&state.heat&&o.onMuni){ o.onMuni(+e.target.dataset.i); return; }
    if(e.target.classList.contains('reg')&&o.onRegion){ o.onRegion(e.target.dataset.r); return; }
    if(o.onBlank) o.onBlank(); }

  const api={el:host,svg,
    reset(){ animateTo(home); },
    focus(x,y,zoom,instant){ const w=W/(zoom||4), h=w*(home.h/home.w); const t={x:x-w/2,y:y-h/2,w,h}; if(instant){view=t;apply();} else animateTo(t); },
    fit(pts,pad){ if(!pts.length) return; let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; pts.forEach(p=>{x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1]);}); pad=pad==null?140:pad; x0-=pad;y0-=pad;x1+=pad;y1+=pad; const ar=home.w/home.h; let w=Math.max(x1-x0,(y1-y0)*ar,W/9), h=w/ar; const t={x:(x0+x1)/2-w/2,y:(y0+y1)/2-h/2,w,h}; view=t; clamp(); apply(); },
    setRegions(mode){ state.regions=mode; for(const id in regEls){ regEls[id].classList.toggle('tint',mode==='tint'); regEls[id].style.display=mode?'':'none'; regEls[id].style.pointerEvents=(o.onRegion&&mode&&!state.heat)?'':'none'; } },
    selectRegion(id){ state.sel=id; for(const r in regEls) regEls[r].classList.toggle('on',r===id); },
    setHeat(on,month){ state.heat=on; state.month=month==null?null:month; muniEls.forEach((p,i)=>{ if(!on){p.classList.remove('heat'); p.style.fill=''; p.style.fillOpacity=''; return;} const v=month==null?MD.tourists[i].reduce((a,b)=>a+b,0):MD.tourists[i][month]; p.classList.add('heat'); p.style.fill=ramp(A.heatT(v,month)); p.style.fillOpacity=.82; }); api.setRegions(state.regions); },
    setDots(set){ state.dotsOn=new Set(set||[]); for(const c in dotEls) dotEls[c].style.display=state.dotsOn.has(c)?'':'none'; },
    setPins(pins){ state.pins=pins||[]; gPins.innerHTML=''; state.pins.forEach(p=>{ const gg=el(gPins,'g',{class:'pin','data-x':p.x.toFixed(1),'data-y':p.y.toFixed(1),'data-key':p.key||'','data-title':p.title||'','data-sub':p.sub||'',tabindex:o.onPin?0:-1,role:'button','aria-label':p.title||'Pin'});
        const col=p.color||'#1C562B';
        if(p.n!=null){ el(gg,'circle',{r:14,class:'halo'}); el(gg,'circle',{r:11.5,fill:col}); el(gg,'text',{y:4.5},String(p.n)); }
        else { el(gg,'path',{d:'M0,0C-6,-9 -11,-14 -11,-21A11,11 0 1 1 11,-21C11,-14 6,-9 0,0Z',fill:col,stroke:'#fff','stroke-width':2}); el(gg,'circle',{cy:-21,r:4.2,fill:'#fff'}); }
        if(p.label) el(gg,'text',{x:(p.n!=null?17:14)*(p.left?-1:1),y:p.n!=null?5:-16,class:'plabel'+(p.left?' left':'')},p.label); }); apply(); },
    setRoute(lines){ gRoute.innerHTML=''; (lines||[]).forEach(l=>{ if(l.pts.length<2) return; el(gRoute,'path',{d:'M'+l.pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join('L'),class:'routeline '+(l.cls||''),style:l.color?'stroke:'+l.color:''}); }); },
    refresh:apply };
  api.setRegions(o.regions); api.setDots(o.dots===true?catKeys:(o.dots||[])); if(o.heat) api.setHeat(true,o.month); api.setPins(o.pins);
  if(o.route) api.setRoute(o.route);
  apply();
  if(window.ResizeObserver){ const ro=new ResizeObserver(()=>{ if(!document.body.contains(svg)){ro.disconnect();return;} const wasHome=Math.abs(view.w-home.w)<2&&Math.abs(view.x-home.x)<2; const cx=view.x+view.w/2, cy=view.y+view.h/2; computeHome(); if(wasHome) view=Object.assign({},home); else { view.h=view.w*(home.h/home.w); view.x=cx-view.w/2; view.y=cy-view.h/2; } apply(); }); ro.observe(host); }
  return api;
};
A.legendHeat=(month)=>`<b>Domestic tourist arrivals, ${month==null?'2023':D.MONTHS_FULL[month]+' 2023'}</b><div class="ramp">${A.RAMP.map(c=>`<i style="background:${c}"></i>`).join('')}</div><div class="rampl" style="position:relative;height:14px;display:block">${[[0,'0'],[100,'100'],[1000,'1k'],[10000,'10k']].map(([v,l])=>`<span style="position:absolute;left:${(A.heatT(v,month)*100).toFixed(1)}%;transform:translateX(${v?'-50%':'0'})">${l}</span>`).join('')}<span style="position:absolute;right:0">${Math.round((month==null?YEAR_MAX:MONTH_MAX)/1000)}k</span></div><div class="small muted" style="margin-top:6px">By municipality. Source: State Statistical Office.</div>`;
})();
