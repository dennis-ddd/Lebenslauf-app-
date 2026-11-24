/* ================= Effekte, Ereignis-Bühne, ruhigeres Design, Ladebildschirm, Lesbarkeit ================= */
const noDom=()=>typeof requestAnimationFrame==='undefined'||!document.body||!document.body.appendChild||typeof innerWidth==='undefined';
const lessMotion=()=>noDom()||O.lessM||(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const SVGI={coin:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M14.5 9.5a3 3 0 1 0 0 5M8.5 11h5M8.5 13h5"/></svg>',
 clock:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
 heart:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z"/></svg>',
 smile:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M9 14a4 4 0 0 0 6 0M9.5 10h.01M14.5 10h.01"/></svg>',
 brain:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 4 4V5zM15 5a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-4 4V5z"/></svg>',
 spark:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>',
 scale:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M7 20h10M5 8h14M5 8l-3 6h6zM19 8l-3 6h6z"/></svg>',
 star:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/></svg>',
 bolt:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3L5 14h6l-1 7 8-11h-6z"/></svg>',
 arrow:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>'};

/* ---------- Ereignisse als Bühne ---------- */
const SCN=(sky,body)=>'<svg viewBox="0 0 360 130" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+sky[0]+'"/><stop offset="1" stop-color="'+sky[1]+'"/></linearGradient></defs><rect width="360" height="130" fill="url(#sk)"/>'+body+'</svg>';
const WIN=(x,y,c,r)=>{let s='';for(let i=0;i<c;i++)for(let j=0;j<r;j++)s+='<rect x="'+(x+i*9)+'" y="'+(y+j*11)+'" width="5" height="6" rx="1" fill="'+((i*7+j*3)%4?'#FFD08A':'#5B4C8A')+'"/>';return s};
const SCENES={
 stadt:SCN(['#2A1650','#7B4BE0'],'<circle cx="300" cy="28" r="12" fill="#FFF3D6"/><circle cx="305" cy="24" r="11" fill="#3A2266"/>'+[[10,60,40],[55,40,34],[95,70,30],[130,30,44],[180,55,36],[222,45,40],[268,65,34],[305,50,50]].map(([x,y,w])=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+(130-y)+'" fill="#2B1C4F"/>'+WIN(x+5,y+8,Math.floor(w/9),Math.floor((120-y)/11))).join('')+'<rect y="118" width="360" height="12" fill="#1B1236"/>'),
 haus:SCN(['#3B2370','#C2617E'],'<rect x="60" y="20" width="240" height="110" fill="#4A3378"/>'+[90,170,250].map(x=>'<rect x="'+(x-18)+'" y="62" width="36" height="58" rx="3" fill="#2B1C4F"/><circle cx="'+(x+10)+'" cy="92" r="2.5" fill="#FFD08A"/><rect x="'+(x-10)+'" y="40" width="20" height="10" rx="2" fill="#FFD08A" opacity=".8"/>').join('')+'<rect y="120" width="360" height="10" fill="#22163F"/><circle cx="180" cy="28" r="6" fill="#FFE2A6"/><path d="M150 120l30-92 30 92z" fill="#FFE2A6" opacity=".12"/>'),
 klinik:SCN(['#1D4E6B','#5CC8D6'],'<rect x="90" y="30" width="180" height="100" rx="4" fill="#EEF6FA"/>'+WIN(105,48,16,6).replace(/#FFD08A/g,'#9FD8E8').replace(/#5B4C8A/g,'#BCE3EE')+'<rect x="160" y="8" width="40" height="40" rx="8" fill="#fff"/><path d="M180 16v24M168 28h24" stroke="#E8467C" stroke-width="8"/><rect x="20" y="96" width="62" height="28" rx="6" fill="#fff"/><rect x="62" y="102" width="20" height="12" fill="#9FD8E8"/><circle cx="34" cy="125" r="6" fill="#333"/><circle cx="70" cy="125" r="6" fill="#333"/><path d="M40 104h10M45 99v10" stroke="#E8467C" stroke-width="3"/>'),
 gericht:SCN(['#2C1F4A','#8C6A3E'],'<path d="M80 50L180 14l100 36z" fill="#E9DFC8"/><rect x="80" y="50" width="200" height="8" fill="#D8CCB0"/>'+[95,135,175,215,255].map(x=>'<rect x="'+x+'" y="58" width="12" height="58" fill="#E9DFC8"/>').join('')+'<rect x="70" y="116" width="220" height="14" fill="#D8CCB0"/><g transform="translate(180 32)" stroke="#8C6A3E" stroke-width="2" fill="none"><path d="M0-10v18M-14-6h28M-14-6l-6 10h12zM14-6l-6 10h12z"/></g>'),
 schule:SCN(['#356B9E','#F2C46B'],'<rect x="70" y="40" width="220" height="90" fill="#E07A5F"/><path d="M60 42l120-30 120 30z" fill="#B65A43"/>'+WIN(84,56,22,5).replace(/#5B4C8A/g,'#C9E4F2').replace(/#FFD08A/g,'#EAF4FA')+'<circle cx="180" cy="30" r="8" fill="#fff"/><path d="M180 25v5l3 2" stroke="#333" stroke-width="1.5" fill="none"/><rect x="166" y="100" width="28" height="30" fill="#6B3A2C"/><path d="M320 130V50" stroke="#ccc" stroke-width="2"/><path d="M320 52h22v14h-22z" fill="#13B3A6"/>'),
 buero:SCN(['#1E2A4A','#4E7AC7'],'<rect x="40" y="20" width="90" height="110" fill="#2E3C66"/>'+WIN(48,30,9,9).replace(/#FFD08A/g,'#A8C8FF')+'<rect x="150" y="45" width="70" height="85" fill="#34477A"/>'+WIN(156,55,7,7).replace(/#FFD08A/g,'#A8C8FF')+'<rect x="240" y="30" width="80" height="100" fill="#2A3760"/>'+WIN(246,40,8,8).replace(/#FFD08A/g,'#A8C8FF')),
 liebe:SCN(['#5B2A86','#F2994A'],'<circle cx="180" cy="120" r="46" fill="#FFC27A" opacity=".9"/><path d="M150 70s-22-14-22-30a12 12 0 0 1 22-6 12 12 0 0 1 22 6c0 16-22 30-22 30z" fill="#FF6B8E"/><path d="M212 82s-16-10-16-22a9 9 0 0 1 16-4 9 9 0 0 1 16 4c0 12-16 22-16 22z" fill="#FF9FB6"/><rect y="118" width="360" height="12" fill="#3A1C4F"/>'),
 geld:SCN(['#123B33','#13B3A6'],'<path d="M20 110L80 90l50 10 60-40 50 14 70-50" stroke="#C6FF9D" stroke-width="4" fill="none"/>'+[[70,112],[100,108],[260,104],[290,110],[320,106]].map(([x,y])=>'<ellipse cx="'+x+'" cy="'+y+'" rx="14" ry="5" fill="#F6C453"/><ellipse cx="'+x+'" cy="'+(y-5)+'" rx="14" ry="5" fill="#FFD978"/>').join('')),
 reise:SCN(['#2E7FE0','#9FE1F5'],'<circle cx="300" cy="32" r="16" fill="#FFE27A"/><g fill="#fff" opacity=".9"><ellipse cx="80" cy="40" rx="30" ry="10"/><ellipse cx="100" cy="34" rx="20" ry="10"/><ellipse cx="230" cy="80" rx="34" ry="10"/></g><path d="M120 76l60-8 40-18 8 4-24 22 34 4 8-6 6 2-8 12-60 6-12 10-8-2 6-12z" fill="#fff"/>'),
 heim:SCN(['#4B2A7A','#F2994A'],'<path d="M110 70l70-50 70 50v60H110z" fill="#F4E9DA"/><path d="M98 72l82-60 82 60" stroke="#B65A43" stroke-width="10" fill="none"/><rect x="166" y="92" width="28" height="38" fill="#8C5A3C"/><rect x="128" y="82" width="26" height="22" fill="#FFD08A"/><rect x="206" y="82" width="26" height="22" fill="#FFD08A"/><path d="M219 88s-6-4-6-8a3 3 0 0 1 6-2 3 3 0 0 1 6 2c0 4-6 8-6 8z" fill="#E8467C"/><rect y="124" width="360" height="6" fill="#3A1C4F"/>')};
const SCNRX=[['gericht',/gericht|anzeige|polizei|anwalt|klage|erbe|testament|pflichtteil|verhaft|knast|gefängnis|strafe/i],['klinik',/arzt|krank|notfall|klinik|kranken|gesund|unfall|schimmel|diagnose|operation/i],
 ['haus',/nachbar|treppen|paket|party nebenan|grill|hausordnung|beschwerde/i],['schule',/schule|prüfung|lehrer|klasse|zeugnis|uni|studium|abschluss/i],['liebe',/liebe|date|heirat|hochzeit|partner|kuss|verliebt|antrag|affäre/i],
 ['buero',/job|chef|büro|kolleg|firma|beförder|kündig|gehalt|vorstand|bewerb/i],['geld',/geld|bank|aktie|börse|wirtschaft|steuer|miete|nebenkosten|investi|lotto|erbe|kredit|prognose/i],
 ['reise',/reise|urlaub|flug|triebwerk|auswander|ausland/i],['heim',/familie|kind|baby|mama|papa|eltern|geburtstag|oma|opa|geschwister|bruder|schwester/i]];
const sceneOf=e=>{const s=(e.t||'')+' '+(typeof e.x==='function'?'':e.x||'');const m=SCNRX.find(x=>x[1].test(s));return m?m[0]:'stadt'};
function optMeta(l){const ic=/⚖/.test(l)?'scale':/★/.test(l)?'star':/€/.test(l)?'coin':/helf|hilf|unterstütz|tröst|verzeih|kuchen|danke|umarm|für sie|für ihn|da sein/i.test(l)?'heart':/std|min\.|warten|später|ein andermal/i.test(l)?'clock':/riskier|ausbruch|flucht|hart|wagen|wette|klauen|bestech/i.test(l)?'bolt':'arrow';
  const hint=/⚖|★/.test(l)?'Dein Wissen hilft':/€/.test(l)?'Kostet Geld':ic==='heart'?'Gut für Beziehungen':ic==='bolt'?'Riskant':/ignorier|keine zeit|abwimmel|weitererzähl|polizei rufen|kontern|belächel|absagen/i.test(l)?'Kann jemanden kränken':'';
  return [ic,hint]}
function stageDialog(sc,h,t,opts,cls,help){const d=document.getElementById('dlg');d.className='dlg stage'+(cls?' '+cls:'');
  d.innerHTML='<div class="scene">'+(SCENES[sc]||SCENES.stadt)+(help?'<button class="helpstar" type="button" aria-label="Hilfe im echten Leben">★</button>':'')+'</div>'+(help?'<div class="helpbox" hidden><b>Geht es dir selbst nicht gut?</b><span>Die TelefonSeelsorge ist rund um die Uhr erreichbar, kostenlos und anonym: <a href="tel:08001110111">0800 111 0 111</a> oder <a href="tel:08001110222">0800 111 0 222</a>. Auch per Chat auf telefonseelsorge.de.</span></div>':'')+'<div class="sbody"><h2>'+esc(h)+'</h2><p>'+esc(t)+'</p><div class="ocards">'+opts.map((o,i)=>{const m=optMeta(o[0]);
    return '<button class="ocard" data-o="'+i+'">'+SVGI[m[0]]+'<span><b>'+esc(o[0].replace(/^[⚖★]\s*/,''))+'</b>'+(m[1]?'<small>'+m[1]+'</small>':'')+'</span></button>'}).join('')+'</div></div>';
  const md=document.getElementById('modal');md.classList.add('on');const hs=d.querySelector('.helpstar');if(hs)hs.onclick=()=>{const b=d.querySelector('.helpbox');b.hidden=!b.hidden};
  d.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{md.classList.remove('on');const f=opts[+b.dataset.o][1];if(f)f()});try{d.querySelector('button').focus()}catch(e){}}
showEvent0=function(e){p.evSeen=p.evSeen||{};p.evSeen[e.t]=(p.evSeen[e.t]||0)+1;const t=typeof e.x==='function'?e.x():e.x,sc=sceneOf(e);
  stageDialog(sc,e.t,t,e.o.map(([l,f])=>[l,()=>{try{valFromLabel(l)}catch(_){}const r=f();log(r);checkAch();save();render();stageDialog(sc,'Ergebnis',r,[['Weiter',()=>{try{chainEvent()}catch(_){}}]],'res',e.help)}]),null,e.help)};
// Mehrere wartende Ereignisse pro Jahr nacheinander zeigen (höchstens drei)
function chainEvent(){if(!p||!p.alive)return;if(p.evNA!==p.age){p.evNA=p.age;p.evN=0}if(p.evN>=2)return;
  while(p.q&&p.q.length){const q=p.q.shift();const e=QEV[q.id]&&QEV[q.id](q.d);if(e&&e.c()){p.evN++;setTimeout(()=>{(typeof showEvent==='function'?showEvent:showEvent0)(e)},120);return}}}

/* ---------- Münzen, Konfetti, Jahreswechsel, Ringe ---------- */
let FX={money:null,rings:{}};
function coinBurst(n){if(lessMotion())return;const m=document.querySelector('#hd .m');if(!m)return;const r=m.getBoundingClientRect(),cx=innerWidth/2,cy=innerHeight*.45;
  for(let i=0;i<n;i++){const c=document.createElement('div');c.className='fxcoin';c.style.left=cx+'px';c.style.top=cy+'px';document.body.appendChild(c);
    const dx=(Math.random()-.5)*120,dy=-40-Math.random()*60,tx=r.left+r.width/2,ty=r.top+r.height/2;
    c.animate([{transform:'translate(-50%,-50%) scale(.6)',opacity:0},{transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px)) scale(1)',opacity:1,offset:.35},{transform:'translate(calc(-50% + '+(tx-cx)+'px),calc(-50% + '+(ty-cy)+'px)) scale(.5)',opacity:.9}],{duration:900+i*60,easing:'cubic-bezier(.3,.7,.4,1)'}).onfinish=()=>c.remove()}
  setTimeout(()=>{m.classList.add('pop');setTimeout(()=>m.classList.remove('pop'),350)},900)}
function countUp(el,from,to){if(lessMotion()||!el)return;const t0=performance.now(),D=700;const f=now=>{const k=Math.min(1,(now-t0)/D),v=Math.round(from+(to-from)*(1-Math.pow(1-k,3)));el.textContent=eur(v);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function confetti(){if(lessMotion())return;const cols=['#F2994A','#E8467C','#7B4BE0','#13B3A6','#F6C453','#FFFFFF'];
  for(let i=0;i<70;i++){const c=document.createElement('div');c.className='fxconf';c.style.background=cols[i%cols.length];c.style.left=(Math.random()*100)+'vw';document.body.appendChild(c);
    const x=(Math.random()-.5)*160,rot=Math.random()*720;c.animate([{transform:'translate(0,-20px) rotate(0)',opacity:1},{transform:'translate('+x+'px,'+(innerHeight*.9)+'px) rotate('+rot+'deg)',opacity:.2}],{duration:1600+Math.random()*1200,delay:Math.random()*300,easing:'cubic-bezier(.2,.6,.4,1)'}).onfinish=()=>c.remove()}}
function yearFlash(a){if(lessMotion())return;const o=document.createElement('div');o.className='fxyear';o.innerHTML='<b>'+a+'</b><span>'+(a===18?'Volljährig!':a%10===0?'Ein runder Geburtstag!':'Happy Birthday, '+esc(p.first)+'!')+'</span>';document.body.appendChild(o);
  o.animate([{opacity:0,transform:'scale(.9)'},{opacity:1,transform:'scale(1)',offset:.2},{opacity:1,offset:.7},{opacity:0,transform:'scale(1.04)'}],{duration:1300,easing:'ease-out'}).onfinish=()=>o.remove()}
{const _au=ageUp;ageUp=function(){const a0=p&&p.age;const r=_au.apply(this,arguments);if(p&&p.alive&&p.age>a0){yearFlash(p.age);setTimeout(confetti,150)}return r}}
function postFx(){if(!p||!p.alive)return;
  // Geld: Münzen und Hochzählen
  const mb=document.querySelector('#hd .m b');if(FX.money!=null&&mb&&p.money!==FX.money){if(p.money-FX.money>=50)coinBurst(Math.min(10,3+Math.floor(Math.log10(p.money-FX.money))));countUp(mb,FX.money,p.money)}FX.money=p.money;
  // Ringe füllen sich
  if(!lessMotion())document.querySelectorAll('.ring').forEach((r,i)=>{const k=tab+i,v=parseFloat(r.style.getPropertyValue('--v'))||0,pv=FX.rings[k];FX.rings[k]=v;const from=pv==null?0:pv;if(from===v)return;
    r.style.setProperty('--v',from);const lb=r.querySelector('b');requestAnimationFrame(()=>requestAnimationFrame(()=>{r.style.setProperty('--v',v)}));if(lb&&pv!=null)lb.animate([{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:500})});
  // App-Farbe als Akzent
  const A=APPS.find(a=>a[0]===tab);document.body.style.setProperty('--acc',A?'#'+A[2].toString(16).padStart(6,'0'):'#13B3A6');
  applyLook();calmUI()}
/* ---------- Weniger Text, mehr Symbole ---------- */
const STATI=[[/Glück/,'smile'],[/Gesundheit/,'heart'],[/Intelligenz|Klugheit/,'brain'],[/Aussehen/,'spark']];
function calmUI(){const v=document.getElementById('view');if(!v)return;
  v.querySelectorAll('button.btn:not([data-ic])').forEach(b=>{b.dataset.ic=1;const h=b.innerHTML;if(h.includes('<svg'))return;
    let n=h.replace(/\s*·?\s*\(?([\d.]+(?:,\d+)?\s?(?:k|Mio\.)?\s?€)\)?/,(m,x)=>' <span class="ic-c">'+SVGI.coin+x.replace(/\s?€/,'')+'</span>').replace(/\s*·\s*(\d+(?:,\d)?\s?(?:Std\.|Min\.))/,(m,x)=>' <span class="ic-c">'+SVGI.clock+x+'</span>');if(n!==h)b.innerHTML=n});
  v.querySelectorAll('.row .t small:not([data-ic])').forEach(s=>{s.dataset.ic=1;const h=s.innerHTML;if(h.includes('<'))return;
    let n=h;STATI.forEach(([rx,ic])=>{n=n.replace(new RegExp('('+rx.source+')\\s*([+\\-−]{1,3})','g'),(m,w,sg)=>'<span class="ic-s '+(sg[0]==='+'?'up':'dn')+'" title="'+w+'">'+SVGI[ic]+sg+'</span>')});
    n=n.replace(/·\s*(\d+(?:,\d)?\s?(?:Std\.|Min\.))/,(m,x)=>'<span class="ic-c">'+SVGI.clock+x+'</span>');if(n!==h)s.innerHTML=n});
  v.querySelectorAll('p.note:not([data-cl])').forEach(n=>{n.dataset.cl=1;if(n.textContent.length<170||n.closest('.dlg'))return;n.classList.add('clamp');const b=document.createElement('button');b.className='morebtn';b.type='button';b.textContent='Mehr anzeigen';
    b.onclick=ev=>{ev.stopPropagation();const o=n.classList.toggle('open');b.textContent=o?'Weniger':'Mehr anzeigen'};n.after(b)})}
{const _r=render;render=function(){const r=_r.apply(this,arguments);try{postFx()}catch(e){}return r}}

/* ---------- Darstellung: Schriftgröße, weniger Bewegung, Ladebildschirm ---------- */
function applyLook(){const b=document.body;if(!b||!b.classList)return;b.classList.toggle('fs1',O.fsz===1);b.classList.toggle('fs2',O.fsz===2);b.classList.toggle('lessmotion',!!lessMotion())}
{const _ve=viewEinst;viewEinst=function(){return _ve()+'<section class="card tgs"><h2 class="h">Darstellung</h2><div class="seg full fsz">'+[['0','Normal'],['1','Groß'],['2','Sehr groß']].map(([k,l])=>'<button data-a="fsz" data-g="'+k+'" aria-pressed="'+((O.fsz||0)===+k)+'">'+l+'</button>').join('')+'</div>'+
  tog('lessM',!!O.lessM,'Weniger Bewegung','Keine Münzen, kein Konfetti, keine Animationen')+tog('noSplash',!!O.noSplash,'Ladebildschirm aus','Ohne Lebensweisheit direkt ins Spiel')+'</section>'}}
function act17(id,arg){if(id==='fsz'){O.fsz=+arg;saveO();applyLook();render();return 1}if(id==='opt'&&arg==='lessM'){setTimeout(applyLook,0)}return 0}
const WISE=['Das Leben ist kein Rennen. Genieße die Strecke.','Kleine Schritte sind auch Schritte.','Wer nie etwas wagt, erlebt auch nichts.','Zeit mit Menschen, die man liebt, ist nie verschwendet.','Fehler sind Beweise, dass du es versuchst.',
 'Glück ist das Einzige, das sich verdoppelt, wenn man es teilt.','Morgen ist ein neuer Tag.','Man bereut selten, was man getan hat. Eher, was man nicht getan hat.','Ein guter Nachbar ist mehr wert als ein ferner Freund.','Geld kann man verdienen. Zeit nicht.',
 'Jeder Tag ist eine neue Seite im Tagebuch.','Freundschaft ist eine Pflanze, die man gießen muss.','Auch der längste Weg beginnt mit dem ersten Schritt.','Sei die Person, die du als Kind gebraucht hättest.','Mut ist, Angst zu haben und es trotzdem zu tun.'];
function splash(){if(O.noSplash||!document.body||document.getElementById('splash'))return;const s=document.createElement('div');s.id='splash';
  s.className='cov';s.innerHTML=(typeof COVER!=='undefined'?'<img class="splimg" src="'+COVER+'" alt="">':'<div class="splt">Lebenslauf</div>')+'<div class="spl spl2"><p>„'+pick(WISE)+'“</p><small>Tippen zum Starten</small></div>';document.body.appendChild(s);
  const go=()=>{if(!s.parentNode)return;s.classList.add('out');setTimeout(()=>s.remove(),lessMotion()?0:450)};s.onclick=go;setTimeout(go,lessMotion()?900:2400)}
try{applyLook();if(typeof window!=='undefined'&&window.addEventListener&&document.readyState!=null)splash()}catch(e){}
