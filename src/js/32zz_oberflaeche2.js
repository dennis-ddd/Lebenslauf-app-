/* ================= Aufgeräumte Oberfläche: Heute, Ordner, Leiste, Mitteilungen, Stadt-Blatt, Story-Rückblick, schwebende Zahlen ================= */
const FOLD=[['leben','Leben','#E5407A',['leben','familie','liebe','tagebuch','erfolge','kalender']],['geld','Geld','#D5A35E',['bank','boerse','post','wohnen','geschaefte','casino']],
  ['karriere','Karriere','#3E7CB1',['jobs','wege','bildung']],['freizeit','Freizeit','#3BB273',['freizeit','shop','garage','strasse']],['social','Social','#8E63D6',['chats','klick','news']],['system','System','#7F8C9A',['store','einst','jva']]];
let homeF=null;
const uiNew=()=>O.theme==='aurora'&&!O.homeClassic;
const IC={bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',map:'<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'};
const svgI=ic=>'<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+ic+'</svg>';
const uiIc=(id,cls)=>{const A=APP[id];if(!A)return '';return '<span class="ic'+(cls?' '+cls:'')+'" style="background:'+(A[4]||hex(A[2]))+'">'+svgI(A[3])+'</span>'};
const visA=id=>APP[id]&&appVisible(id)&&!(id==='jva'&&!p.prison);
/* Was gerade wichtig ist: Erinnerungen, Abzeichen der Apps, ungelesene Mitteilungen */
function feed(){const L=[];if(!p)return L;
  try{reminders().forEach(r=>L.push({app:r[2]||'kalender',t:String(r[1]).replace(/<[^>]*>/g,''),pr:3}))}catch(e){errLog(e)}
  const T={chats:b=>b+' ungelesene Nachricht'+(b>1?'en':''),post:b=>b+' Brief'+(b>1?'e':'')+' im Briefkasten',kalender:b=>'Geburtstage und Termine stehen an',klick:b=>b==='!'?'Leg dir ein Klick-Profil an':b+' neue Klick-Mitteilung'+(b>1?'en':''),jobs:b=>b+' neue Stelle'+(b>1?'n':''),news:b=>b+' neue Schlagzeile'+(b>1?'n':''),erfolge:b=>b+' neue'+(b>1?'':'r')+' Erfolg'+(b>1?'e':''),store:b=>b+' App-Tipp'+(b>1?'s':'')};
  const PR={post:5,chats:4,kalender:3,klick:2,jobs:2,news:1,erfolge:1,store:0};
  Object.keys(T).forEach(id=>{if(!visA(id)||(p.prison&&!PRISON_APPS.includes(id)))return;const b=badgeOf(id);if(b&&!L.some(x=>x.app===id))L.push({app:id,t:T[id](b),pr:PR[id]})});
  (p.nh||[]).filter(n=>!n.r).slice(0,5).forEach(n=>L.push({app:n.g&&APP[n.g]?n.g:'inbox',t:n.t,pr:1,nh:1}));
  return L.sort((a,b)=>b.pr-a.pr)}
const inboxN=()=>feed().length;
{const _nt=notify;notify=function(t,g,s){_nt(t,g,s);try{if(p){p.nh=p.nh||[];p.nh.unshift({t:String(t).replace(/<[^>]*>/g,'').slice(0,140),g:g||null,a:p.age,r:0});if(p.nh.length>30)p.nh.length=30}}catch(e){errLog(e)}}}
/* Startseite */
function favApps(){const U=p.appUse||{},ex=['stadt','inbox','einst','store','jva'];let L=Object.keys(U).filter(id=>visA(id)&&!ex.includes(id)).sort((a,b)=>U[b]-U[a]).slice(0,4);
  ['chats','jobs','bank','freizeit','leben','bildung','familie'].forEach(id=>{if(L.length<4&&visA(id)&&!L.includes(id))L.push(id)});return L}
function uiAppBtn(id){const A=APP[id],lock=p.prison&&!PRISON_APPS.includes(id),b=badgeOf(id);return '<button class="app" data-a="goto" data-g="'+id+'"'+(lock?' disabled':'')+'>'+uiIc(id).replace('</span>',(b&&!lock?badgeTxt(id,b):'')+'</span>')+A[1]+'</button>'}
function viewHome2(){
  const ring=k=>'<div class="rw"><div class="ring" style="--v:'+p.st[k]+'"><b>'+p.st[k]+'</b></div><small>'+STAT[k]+'</small></div>';
  const F=feed(),last=p.log.filter(e=>!e.t.startsWith('Jahresbilanz')).slice(-1)[0];
  let h='<section class="phone h3 ph'+phoneTier()+(phoneOld()?' old':'')+(curFrame()?' frm':'')+'" style="--wall:'+WALLS[wallUsable(O.wall)?O.wall:0][1]+(curFrame()?';--frame:'+(curFrame()[0]==='#'?'linear-gradient('+curFrame()+','+curFrame()+')':curFrame()):'')+'"><div class="pstat"><span>'+esc(cityName(p.seed))+'</span><span>'+PHONES[phoneTier()][0]+(phoneOld()?' · Akku 9 %':'')+'</span><span>'+akt(p.act)+'</span></div>'+dayBar()+'<div class="rings">'+Object.keys(STAT).map(ring).join('')+'</div>';
  h+='<div class="today"><div class="tdh"><b>Heute wichtig</b>'+(F.length>3?'<button class="lnk" data-a="goto" data-g="inbox">Alle '+F.length+'</button>':'')+'</div>'+
    (F.length?F.slice(0,3).map(x=>'<button class="tdi" data-a="goto" data-g="'+x.app+'">'+uiIc(x.app==='inbox'?'inbox':x.app,'sm')+'<span>'+esc(x.t)+'</span>'+svgI('<path d="M9 6l6 6-6 6"/>')+'</button>').join(''):
      '<div class="tdi none">'+svgI('<path d="M5 12l5 5 9-10"/>')+'<span>Alles erledigt.'+(last?' Zuletzt: '+esc(last.t):'')+'</span></div>')+'</div>';
  if(p.prison)h+='<p class="pnote">Du sitzt noch '+p.prison+' Jahr(e) im Gefängnis. Einige Apps sind gesperrt.</p>';
  const fav=favApps();if(fav.length)h+='<div class="hsec">Favoriten</div><div class="apps fav">'+fav.map(uiAppBtn).join('')+'</div>';
  h+='<div class="hsec">Alle Apps</div><div class="folds">'+FOLD.map(([fid,n,c,ids])=>{const L=ids.filter(visA);if(!L.length)return '';const b=L.reduce((s,id)=>{const x=badgeOf(id);return s+(typeof x==='number'?x:x?1:0)},0);
    return '<button class="fold" data-a="hfold" data-g="'+fid+'" aria-label="Ordner '+n+'"><span class="fic">'+L.slice(0,4).map(id=>uiIc(id,'mini')).join('')+(b?'<span class="badge dot"></span>':'')+'</span><b>'+n+'</b><small>'+L.length+' App'+(L.length>1?'s':'')+'</small></button>'}).join('')+'</div>';
  if(homeF){const f=FOLD.find(x=>x[0]===homeF);if(f){const L=f[3].filter(visA);h+='<div class="fsheet" role="dialog" aria-label="Ordner '+f[1]+'"><div class="fsh"><b>'+f[1]+'</b><button class="xbtn" data-a="hfold" data-g="" aria-label="Ordner schließen">×</button></div><div class="apps">'+L.map(uiAppBtn).join('')+'</div></div>'}}
  return h+'</section>'}
{const _vh=viewHome;viewHome=function(){if(!uiNew()||(typeof kidMode==='function'&&kidMode()))return _vh();return viewHome2()}}
/* Mitteilungen */
const INBOXA=['inbox','Mitteilungen',0x7F95AE,IC.bell,'linear-gradient(135deg,#7F95AE,#4E5D73)'];
function viewInbox(){const F=feed().filter(x=>!x.nh),H=(p.nh||[]).slice(0,20);
  let h=card('Gerade wichtig',F.length?F.map(x=>'<div class="row ibx">'+uiIc(x.app,'sm')+'<div class="t"><b>'+esc(x.t)+'</b><small>'+(APP[x.app]?APP[x.app][1]:'')+'</small></div><button class="btn o sm" data-a="goto" data-g="'+x.app+'">Öffnen</button></div>').join(''):'<p class="note">Nichts Offenes. Gut gemacht.</p>');
  h+=card('Verlauf',H.length?H.map(n=>'<div class="row ibx'+(n.r?'':' un')+'">'+(n.g&&APP[n.g]?uiIc(n.g,'sm'):'<span class="ic sm" style="background:'+INBOXA[4]+'">'+svgI(IC.bell)+'</span>')+'<div class="t"><b>'+esc(n.t)+'</b><small>Alter '+n.a+'</small></div>'+(n.g&&APP[n.g]?'<button class="btn g sm" data-a="goto" data-g="'+n.g+'">Öffnen</button>':'')+'</div>').join('')+btn('nhread',null,'Alles als gelesen markieren','g'):'<p class="note">Hier landen alle Hinweise, die kurz oben eingeblendet werden.</p>');
  return h}
{const _va=viewApp;viewApp=function(id){if(id!=='inbox')return _va(id);const A=INBOXA;return '<div class="appbar"><button class="back pill" data-a="goto" data-g="home" aria-label="Zurück zum Handy">'+svgI('<path d="M15 5l-7 7 7 7"/>')+'<span>Handy</span></button><span class="ic" style="background:'+A[4]+'">'+svgI(A[3])+'</span><h2>'+A[1]+'</h2><span class="chip" style="margin-left:auto">'+akt(p.act)+'</span></div>'+viewInbox()}}
/* Leiste unten mit +1 Jahr in der Mitte */
{const _bs=buildShell;buildShell=function(){_bs();if(typeof document.querySelector!=='function')return;APP.inbox=INBOXA;
  if(!uiNew()){document.body&&document.body.classList&&document.body.classList.remove('tb');return}
  const age=document.querySelector('.age'),up=document.getElementById('up');if(!age||!up)return;document.body.classList.add('tb');age.classList.add('tbar');
  const mk=(g,ic,l)=>{const b=document.createElement('button');b.className='tbb';b.dataset.a='goto';b.dataset.g=g;b.innerHTML=svgI(ic)+'<span>'+l+'</span>';return b};
  const mid=document.createElement('div');mid.className='tbup';mid.appendChild(up);const lb=up.querySelector('.lbl2');if(lb)lb.innerHTML='<b>+1</b><small>Jahr</small>';up.setAttribute('aria-label','1 Jahr älter werden, gedrückt halten');
  age.innerHTML='';age.append(mk('home',IC.phone,'Handy'),mk('stadt',IC.map,'Stadt'),mid,mk('leben',IC.user,'Ich'),mk('inbox',IC.bell,'Mitteilungen'));
  // Stadt-Filter und Blatt
  const cw=document.getElementById('city');if(cw&&!document.getElementById('cflt')){const f=document.createElement('div');f.className='cflt';f.id='cflt';cw.appendChild(f)}
  const v2=document.getElementById('view2');if(v2&&!v2._sw){v2._sw=1;let y0=null;v2.addEventListener('touchstart',e=>{if(document.body.classList.contains('placeopen')&&v2.scrollTop<=0)y0=e.touches[0].clientY},{passive:true});
    v2.addEventListener('touchmove',e=>{if(y0==null)return;const d=e.touches[0].clientY-y0;if(d>0)v2.style.transform='translate(-50%,'+d+'px)'},{passive:true});
    v2.addEventListener('touchend',e=>{if(y0==null)return;const d=(e.changedTouches[0].clientY-y0);y0=null;v2.style.transform='';if(d>80)act('desel')})}}}
let cityFl='alle';
const CATP={arbeit:['jobcenter','buero','uni','bschule','schule','bank','boerse','makler','polizei','hafen','autohaus','klinik'],freizeit:['park','club','fitness','mall','casino','kiosk','reise','netcafe','tierheim','villa']};
{const _r=render;render=function(){_r();try{if(!p||!p.alive||!document.body||!document.body.classList||!document.body.classList.contains('tb'))return;
  document.querySelectorAll('.tbar .tbb').forEach(b=>{const g=b.dataset.g;b.setAttribute('aria-current',(tab===g||(g==='home'&&tab==='home'))?'page':'false');
    if(g==='home'){const m=typeof kidMode==='function'&&kidMode();b.querySelector('span').textContent=m==='kiste'?'Kiste':m==='ranzen'?'Ranzen':'Handy'}
    if(g==='stadt')b.style.visibility=appVisible('stadt')?'':'hidden';
    if(g==='inbox'){const n=inboxN();let s=b.querySelector('.badge');if(n){if(!s){s=document.createElement('span');s.className='badge';b.appendChild(s)}s.textContent=n>9?'9+':n}else if(s)s.remove()}});
  const f=document.getElementById('cflt');if(f){const h=[['alle','Alle'],['arbeit','Arbeit'],['freizeit','Freizeit'],['meine','Meine']].map(([k,l])=>'<button data-a="cflt" data-g="'+k+'" aria-pressed="'+(cityFl===k)+'">'+l+'</button>').join('');if(f._h!==h){f.innerHTML=h;f._h=h}}
  const v2=document.getElementById('view2');if(v2&&document.body.classList.contains('placeopen')&&v2.firstElementChild){v2.firstElementChild.classList.add('pcard');if(!v2.querySelector('.shh')){const hh=document.createElement('button');hh.className='shh';hh.dataset.a='desel';hh.setAttribute('aria-label','Blatt schließen');v2.insertBefore(hh,v2.firstChild)}}
  }catch(e){errLog(e)}}}
/* Filter und Viertelnamen auf der Karte */
HOOK.on('pins',()=>{const el=document.getElementById('pins');if(!el||!G||!G.L)return;
  if(!el.querySelector('.dl')){const D={};G.L.cells.forEach(c=>{const k=c.zone==='G'?null:DIST[c.dist][0];if(!k)return;(D[k]=D[k]||[]).push(c)});
    Object.keys(D).forEach(k=>{const C=D[k],x=C.reduce((s,c)=>s+c.x,0)/C.length,z=C.reduce((s,c)=>s+c.z,0)/C.length;const s=document.createElement('span');s.className='pinm dl';s.dataset.x=x;s.dataset.z=z;s.innerHTML='<span class="plb">'+k+'</span>';el.appendChild(s)})}
  el.querySelectorAll('.pinm').forEach(b=>{if(b.classList.contains('dl'))return;const g=b.dataset.g,own=b.classList.contains('own');let ok=true;
    if(cityFl==='arbeit')ok=CATP.arbeit.includes(g);else if(cityFl==='freizeit')ok=CATP.freizeit.includes(g);else if(cityFl==='meine')ok=own||g==='home';else ok=true;b.classList.toggle('fh',!ok)})},50,'pins-viertel-filter');
{const _pp=pinsProject;pinsProject=function(){_pp();const el=document.getElementById('pins');if(!el||!G)return;const far=G.dist>100,w=el.clientWidth,hh=el.clientHeight,v=(_pv.v2=_pv.v2||new THREE.Vector3());
  el.querySelectorAll('.pinm').forEach(b=>{if(b.classList.contains('fh'))b.style.display='none'});
  el.querySelectorAll('.dl').forEach(b=>{if(!far){b.style.display='none';return}v.set(+b.dataset.x,4,+b.dataset.z).project(G.cam);const x=(v.x+1)/2*w,y=(1-v.y)/2*hh;b.style.display=v.z<1?'':'none';b.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)'})}}
/* Jahresrückblick als Story-Karten */
const STORYK=[[/Beförder|Job|Stelle|Chef|Ausbildung|Studium|Abschluss|Abitur|Zeugnis|Schule/,'#3E7CB1','<path d="M3 7h18v13H3z"/><path d="M8 7V4h8v3"/>'],[/Liebe|zusammen|Hochzeit|verheiratet|Date|Partner|verlobt/,'#E5407A','<path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z"/>'],
  [/Baby|Geburt|Kind|Tochter|Sohn/,'#F2994A','<circle cx="12" cy="8" r="4"/><path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/>'],[/gestorben|Tod|Beerdigung|verstorben/,'#7F8C9A','<path d="M12 3v6M9 6h6"/><path d="M7 21V12h10v9"/>'],
  [/€|Geld|gewonnen|Gewinn|Erbe|Aktie|verkauft|gekauft/,'#D5A35E','<circle cx="12" cy="12" r="8"/><path d="M14.5 9a3 3 0 1 0 0 6M9 11h4M9 13h4"/>'],[/Umzug|gezogen|Wohnung|Haus|Villa/,'#2FA88F','<path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/>'],
  [/krank|Arzt|Klinik|Unfall|verletzt|Therapie/,'#E5484D','<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>'],[/./,'#8E63D6','<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.3 6L12 16.4 6.6 19.4l1.3-6L3.4 9.3l6-.7z"/>']];
function recapStory(R0,then){const a=p.age,newLook=stageOf(a)!==stageOf(a-1),cards=[];
  const st=Object.keys(STAT).map(k=>{const d=p.st[k]-R0.st[k];return '<span class="dchip '+(d>0?'pos':d<0?'neg':'')+'">'+STAT[k]+' <b>'+(d>0?'+':d<0?'−':'±')+Math.abs(d)+'</b></span>'}).join('');
  cards.push('<div class="rhead"><div class="rav'+(newLook?' new':'')+'">'+avatarSvg(a,newLook?116:96)+'</div><div><small>Alles Gute zum Geburtstag!</small><b class="rage">'+a+'</b><small>Jahre alt</small></div></div>'+(newLook?'<p class="look">Neuer Look: '+STAGE_N[stageOf(a)]+'</p>':'')+'<div class="dchips">'+st+'</div>');
  const ti=R0.inc.reduce((s,x)=>s+x[1],0),to=R0.out.reduce((s,x)=>s+x[1],0),bal=ti-to;
  if(ti||to){const top=(arr,sg)=>arr.filter(x=>x[1]>0).sort((x,y)=>y[1]-x[1]).slice(0,3).map(x=>'<div class="mrow"><span>'+x[0]+'</span><b class="'+(sg>0?'up':'down')+'">'+(sg>0?'+':'−')+eur(x[1])+'</b></div>').join('');
    cards.push('<div class="sthero" style="--sc:'+(bal>=0?'#2FA88F':'#E5484D')+'">'+svgI(STORYK[4][2])+'<b>'+(bal>=0?'+':'−')+eur(Math.abs(bal))+'</b><small>Bilanz des Jahres</small></div><div class="mbox">'+top(R0.inc,1)+top(R0.out,-1)+'<div class="mrow tot"><span>Kontostand</span><b>'+eur(R0.m0)+' → '+eur(p.money)+'</b></div></div>')}
  p.log.filter(e=>e.a===a&&!e.t.startsWith('Jahresbilanz')).slice(-4).forEach(e=>{const K=STORYK.find(k=>k[0].test(e.t));cards.push('<div class="sthero" style="--sc:'+K[1]+'">'+svgI(K[2])+'<p>'+esc(e.t)+'</p></div>')});
  if(p.gr&&p.gr.a===a)cards.push(zeugnis());
  const d=document.getElementById('dlg'),m=document.getElementById('modal');let i=0;d.className='dlg recap story';m.classList.add('on');
  const show=()=>{d.innerHTML='<div class="stbars">'+cards.map((_,k)=>'<i class="'+(k<i?'done':k===i?'on':'')+'"></i>').join('')+'</div><div class="sttop"><small>Dein Jahr mit '+a+' · '+(i+1)+' von '+cards.length+'</small><button class="lnk" data-s="skip">Überspringen</button></div><div class="stc">'+cards[i]+'</div>'+
    '<div class="ch stnav">'+(i>0?'<button class="btn g" data-s="prev">Zurück</button>':'')+'<button class="btn o" data-s="next">'+(i<cards.length-1?'Weiter':'Los geht’s')+'</button></div>';d.scrollTop=0;
    d.querySelectorAll('[data-s]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();const s=b.dataset.s;if(s==='prev'){i--;show()}else if(s==='next'&&i<cards.length-1){i++;show()}else{m.classList.remove('on');d.className='dlg';if(then)then()}});
    const st=d.querySelector('.stc');if(st)st.onclick=ev=>{if(ev.target.closest('button'))return;const r=st.getBoundingClientRect();if(ev.clientX<r.left+r.width*.3&&i>0){i--;show()}else if(i<cards.length-1){i++;show()}};
    const nb=d.querySelector('[data-s="next"]');if(nb)nb.focus()};show();
  sfx(O.mel&&UL[O.mel]?O.mel:'bday');vib([30,50,30])}
{const _rc=recap;recap=function(R0,then){if(noDom()||!uiNew())return _rc(R0,then);try{recapStory(R0,then)}catch(e){_rc(R0,then)}}}
/* Schwebende Zahlen direkt am gedrückten Knopf */
let lastPt=null;try{document.addEventListener('pointerdown',e=>{lastPt={x:e.clientX,y:e.clientY,t:Date.now()}},true)}catch(e){errLog(e)}
function fxNums(d){if(lessMotion()||!lastPt||Date.now()-lastPt.t>2500||!d.length)return;d.slice(0,3).forEach((x,k)=>{const o=document.createElement('div');o.className='fxnum '+(x[1]>0?'pos':'neg');o.textContent=x[0];o.style.left=lastPt.x+'px';o.style.top=(lastPt.y-8-k*24)+'px';o.style.animationDelay=k*90+'ms';document.body.appendChild(o);setTimeout(()=>o.remove(),1500)})}
{const f=act;act=function(id,arg){if(id==='hfold'){homeF=arg||null;render();return}if(id==='cflt'){cityFl=arg||'alle';if(G)pinsBuild();render();return}if(id==='nhread'){(p.nh||[]).forEach(n=>n.r=1);render();return}
  if(id==='goto'&&p&&APP[arg]){p.appUse=p.appUse||{};p.appUse[arg]=(p.appUse[arg]||0)+1;homeF=null;if(arg==='inbox')setTimeout(()=>{(p.nh||[]).forEach(n=>n.r=1)},0)}
  const s0=p&&p.alive?Object.assign({m:p.money},p.st):null;const r=f(id,arg);
  try{if(s0&&p&&p.alive&&!noDom()){const D=[];Object.keys(STAT).forEach(k=>{const d=p.st[k]-s0[k];if(d)D.push([(d>0?'+':'−')+Math.abs(d)+' '+STAT[k],d])});const dm=p.money-s0.m;if(Math.abs(dm)>=1)D.unshift([(dm>0?'+':'−')+eur(Math.abs(dm)),dm]);fxNums(D)}}catch(e){errLog(e)}
  if(id==='opt'&&arg==='homeClassic'){shell=false;render()}return r}}
{const _ve=viewEinst;viewEinst=function(){return _ve()+'<section class="card tgs"><h2 class="h">Startseite</h2>'+tog('homeClassic',!!O.homeClassic,'Klassische App-Ansicht','Alle Apps einzeln statt Heute, Ordnern und Leiste unten')+'</section>'}}
{const _yf=yearFlash;yearFlash=function(a){if(uiNew())return;return _yf(a)}}
