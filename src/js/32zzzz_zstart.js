/* ================= Die ersten 10 Minuten: Erste Schritte, Zeitraffer für die Babyjahre, dezente Suche ================= */
/* ---------- Erste Schritte (nur im ersten Leben) ---------- */
const FSTEP=[['jahr','Werde ein Jahr älter','Halte unten „+1 Jahr“ gedrückt.'],['app','Öffne eine App','Tippe auf dem Handy auf eine App.'],['aktion','Mach etwas mit deiner Zeit','Lernen, Sport, Freunde treffen: Jede Aktion zählt.'],
  ['entsch','Triff eine Entscheidung','Ereignisse fragen dich, was du tust. Es gibt kein Richtig oder Falsch.'],['chat','Antworte in einem Chat','Jemand hat dir geschrieben. Antworte im Chat-App.']];
const fsOn=()=>p&&p.alive&&!O.firstDone&&!p.fsOff&&(typeof ALB==='undefined'||ALB.lives.length===0);
const fsS=()=>(p.fst=p.fst||{a0:p.age});
function fsCheck(){if(!fsOn())return;const s=fsS();const D={jahr:p.age>s.a0,app:!!s.app,aktion:!!s.act,entsch:(p.ehist||[]).length>0,chat:Object.values(p.chats||{}).some(c=>(c.msgs||[]).some(m=>m.me))};
  FSTEP.forEach(([k,t])=>{if(D[k]&&!s[k+'D']){s[k+'D']=1;add('gl',3);toast('Geschafft: '+t+' (+3 Glück)')}});
  if(FSTEP.every(([k])=>s[k+'D'])&&!s.all){s.all=1;O.firstDone=1;saveO();p.money+=px$(150);mile('Erste Schritte geschafft','star');setTimeout(()=>{try{dialog('Gut gemacht!','Du kennst jetzt das Wichtigste. Als Startgeschenk gibt es '+eur(px$(150))+'. Ab hier schreibst du deine eigene Geschichte.',[['Los geht’s',null]])}catch(e){errLog(e)}},400)}}
function fsCard(){if(!fsOn())return '';const s=fsS(),nx=FSTEP.find(([k])=>!s[k+'D']);if(!nx)return '';const n=FSTEP.filter(([k])=>s[k+'D']).length;
  return '<section class="card fsc"><div class="listseg"><b>Erste Schritte</b><button class="lnk" data-a="fsoff">Ausblenden</button></div><div class="fsd">'+FSTEP.map(([k])=>'<i class="'+(s[k+'D']?'on':'')+'"></i>').join('')+'<small>'+n+' von '+FSTEP.length+'</small></div>'+
    '<div class="fsn"><b>'+nx[1]+'</b><small>'+nx[2]+'</small></div></section>'}
{const _ua=useAct;useAct=function(){const r=_ua.apply(this,arguments);if(r&&p&&p.fst)p.fst.act=1;return r}}
/* ---------- Zeitraffer für die Babyjahre ---------- */
let FAST=0,FASTLOG=[];
const fastOk=()=>p&&p.alive&&p.age<5&&!p.prison;
{const _rc=recap;recap=function(R0,then){if(FAST>0){if(then)then();return}return _rc(R0,then)}}
{const _se=showEvent0;showEvent0=function(e){if(FAST>0&&e&&e.o&&e.o.length){const O2=e.o.filter(o=>!/Minispiel/.test(o[0]));if(!O2.length){FASTLOG.push(p.age+': '+e.t);return}const o=pick(O2);let r='';try{r=o[1]()||''}catch(x){errLog(x)}FASTLOG.push(p.age+': '+e.t+(r&&r!=='Los geht’s!'?' – '+r:''));return}return _se(e)}}
{const _mg=miniGame;miniGame=function(kind,cb){if(FAST>0){cb(kind==='wort'?pick(['Mama','Papa','Wauwau','Nein!']):R(0,kind==='bau'?8:3));return}return _mg.apply(this,arguments)}}
{const _ms=mgStart;mgStart=function(type,n,title,cb,v){if(FAST>0){try{cb(autoMG(n,v==null?p.st.in:v),true)}catch(e){errLog(e)}return}return _ms.apply(this,arguments)}}
function fastRun(){if(!fastOk())return;const tgt=Math.min(6,Math.max(p.age+1,6));FAST=tgt-p.age;FASTLOG=[];const startA=p.age;
  const step=()=>{if(!p||!p.alive||FAST<=0){FAST=0;fastEnd(startA);return}try{document.getElementById('modal').classList.remove('on')}catch(e){errLog(e)}ageUp();FAST--;if(FAST>0)setTimeout(step,noDom()?0:60);else{FAST=0;fastEnd(startA)}};step()}
function fastEnd(a0){const L=(p.log||[]).filter(e=>e.a>a0&&!/^Jahresbilanz/.test(e.t)).slice(-8).map(e=>e.a+': '+e.t);const items=FASTLOG.concat(L).slice(0,10);mile('Babyjahre im Zeitraffer','star');save();render();
  try{htmlDialog('<h2>Deine ersten Jahre</h2><p>Du bist jetzt '+p.age+' und kommst in die Schule. Das ist passiert:</p><div class="fsl">'+(items.length?items.map(t=>'<div>'+esc(t)+'</div>').join(''):'<div>Viel geschlafen, viel gelacht, laufen gelernt.</div>')+'</div>','Weiter')}catch(e){errLog(e)}}
function fastCard(){if(!fastOk()||p.fastNo)return '';return '<section class="card fsc fast"><div class="lfrow"><div><b>Babyjahre im Zeitraffer</b><small>Spring direkt zum Schulstart mit 6. Deine Eltern entscheiden bis dahin für dich.</small></div><button class="btn o sm" data-a="fastgo">Vorspulen</button></div></section>'}
/* ---------- Dezente Suche ---------- */
const norm=s=>String(s||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9 ]/g,' ');
const SYN={geld:['bank','job','geschaefte','boerse'],arbeit:['jobs','bewerbung'],liebe:['date','partner','dating'],kleidung:['shoppen','kleiderschrank'],friseur:['frisur','haare'],haustier:['tiere','hund','katze'],freunde:['freundeskreis'],
  einstellungen:['optionen','settings'],politik:['partei','wahl','buergermeister'],auto:['fuehrerschein','fahrschule'],gesundheit:['arzt','krank'],wohnung:['wohnen','haus','miete'],album:['sammlung','erinnerung','leben']};
function srchIndex(){const R=[];const add=(t,sub,ty,a,g,b,g2,kw)=>R.push({t,sub,ty,a,g,b,g2,k:norm(t+' '+(sub||'')+' '+(kw||''))});
  APPS.forEach(A=>{try{if(A[0]!=='home'&&appVisible(A[0]))add(A[1],'App öffnen','App','goto',A[0])}catch(e){errLog(e)}});
  PLACES.forEach(P=>{(P.a||[]).forEach(k=>{const A=ACTS[k];if(!A)return;let ok=true;try{ok=A.ok()}catch(e){errLog(e)}if(ok)add(A.n,P.n,'Aktion','goto','stadt','sel',P.id,A.d)});add(P.n,'Ort in der Stadt','Ort','goto','stadt','sel',P.id)});
  try{contacts().forEach(c=>add(c.n,c.sub||'Chat','Person','goto','chats','chat',c.id))}catch(e){errLog(e)}
  (p.fk||[]).forEach(f=>add(f.n,'Freund/in','Person','goto','familie','famtab','freunde'));(p.kids||[]).forEach(k=>{if(k.alive!==false)add(k.n,'Dein Kind','Person','goto','familie','famtab','kinder')});(p.pets||[]).forEach(x=>add(x.n,(PETS[x.t]||{n:'Haustier'}).n,'Tier','goto','familie','famtab','tiere'));
  [['Kleiderschrank','Kleidung, Schmuck, Uhren','freizeit','ftab','shop','shoppen kleidung outfit'],['Friseur','Frisur und Haarfarbe','freizeit','avcat','friseur','haare'],['Haustiere','Tiere, Tricks, Tierheim','familie','famtab','tiere','tier hund katze'],
   ['Freundeskreis','Freunde treffen','familie','famtab','freunde',''],['Testament','Erbe regeln','familie','famtab','erbe',''],['Stammbaum','Deine Familie über Generationen','familie','famtab','baum',''],
   ['Lebensalbum','Alle Leben und Erinnerungsstücke','erfolge','etab','album','sammlung'],['Politik','Partei, Wahlen, Ämter','wege','kartab','politik','buergermeister'],['Führerschein','Auto, Motorrad, Boot, Flugzeug','bildung','','','fahrschule'],
   ['Einstellungen','Spiel, Aussehen, Bedienung, Hilfe','einst','','','optionen']].forEach(([t,s,app,a2,g2,kw])=>{if(app==='erfolge'||appVisible(app))add(t,s,'Bereich','goto',app,a2||null,g2||null,kw)});
  if(typeof ETITLE!=='undefined')Object.keys(ETITLE).forEach(k=>{if(ETITLE[k]!=='x')add(k,'Einstellungen','Einstellung','goto','einst','einstab',ETITLE[k])});
  return R}
function srchFind(q){const n=norm(q).trim();if(!n)return [];const words=n.split(/\s+/);let ex=[];Object.entries(SYN).forEach(([k,v])=>{if(k.startsWith(words[0])||v.some(x=>x.startsWith(words[0])))ex=ex.concat([k],v)});
  const I=srchIndex(),seen=new Set();return I.map(r=>{let s=0;words.forEach(w=>{const t=norm(r.t);if(t.startsWith(w))s+=5;else if(t.includes(w))s+=3;else if(r.k.includes(w))s+=1});if(!s&&ex.some(x=>r.k.includes(x)))s=1;if(s&&r.ty==='App')s+=.5;return [s,r]}).filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0]).map(x=>x[1]).filter(r=>{const k=r.t+r.ty+r.g2;if(seen.has(k))return false;seen.add(k);return true}).slice(0,12)}
let SRES=[];
function srchOpen(){const d=document.getElementById('dlg'),m=document.getElementById('modal');d.className='dlg srch';m.classList.add('on');
  d.innerHTML='<div class="srbar"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="srq" type="search" placeholder="Apps, Orte, Personen, Aktionen …" autocomplete="off" aria-label="Suchen"><button class="lnk" data-sx="close">Fertig</button></div><div id="srr" class="srr"></div>';
  const inp=d.querySelector('#srq'),out=d.querySelector('#srr');
  const draw=()=>{const q=inp.value;SRES=srchFind(q);out.innerHTML=!q.trim()?'<p class="note">Tipp: „Friseur“, „Hund“, „Mama“, „Bewerbung“, „Wahl“</p>':SRES.length?SRES.map((r,i)=>'<button class="srow" data-si="'+i+'"><span class="srty">'+r.ty+'</span><span><b>'+esc(r.t)+'</b><small>'+esc(r.sub||'')+'</small></span></button>').join(''):'<p class="note">Nichts gefunden.</p>'};
  inp.addEventListener('input',draw);draw();setTimeout(()=>{try{inp.focus()}catch(e){errLog(e)}},50);
  d.onclick=e=>{const b=e.target.closest('[data-si],[data-sx]');if(!b)return;e.stopPropagation();m.classList.remove('on');d.className='dlg';d.onclick=null;if(b.dataset.sx)return;srchGo(SRES[+b.dataset.si])}}
function srchGo(r){if(!r)return;if(r.g==='freizeit'&&r.b==='avcat'){fTab='shop'}act(r.a,r.g);if(r.b)act(r.b,r.g2)}
/* ---------- Einbindung ---------- */
{const f=act;act=function(id,arg){
  if(id==='goto'&&p&&p.fst&&arg&&arg!=='home')p.fst.app=1;
  if(id==='fsoff'){p.fsOff=1;save();render();return}
  if(id==='fastgo'){fastRun();return}
  if(id==='srch'){srchOpen();return}
  const r=f(id,arg);try{fsCheck()}catch(e){errLog(e)}return r}}
{const _py=perkYear;perkYear=function(R0){_py(R0);try{fsCheck()}catch(e){errLog(e)}}}
{const _vh=viewHome;viewHome=function(){let h=_vh();const top=fastCard()+fsCard();
  h=h.replace('<div class="hsec hsx">Alle Apps<button class="lnk" data-a="goto" data-g="einst">Einstellungen</button></div>','<div class="hsec hsx">Alle Apps<span class="hsxb"><button class="lnk srbtn" data-a="srch" aria-label="Suchen"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg></button><button class="lnk" data-a="goto" data-g="einst">Einstellungen</button></span></div>');
  if(!top)return h;const i=h.indexOf('<section');return i>=0?h.slice(0,i)+top+h.slice(i):top+h}}
{const f=act;act=function(id,arg){if(id==='whatsnew'){showAllUpdates();return}return f(id,arg)}}
{const _ve=viewEinst;viewEinst=function(){const h=_ve();if(typeof einTab==='undefined'||einTab!=='help')return h;const c='<section class="card">'+row('Was ist neu?','Alle Updates der letzten Zeit zum Nachlesen · Version '+APPVER,btn('whatsnew',null,'Ansehen','o'))+'</section>';const i=h.indexOf('</div>');return i>=0?h.slice(0,i+6)+c+h.slice(i+6):c+h}}
