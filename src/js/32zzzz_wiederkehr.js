/* ================= Lebensfilm, Lebensalbum, Erinnerungsstücke, Zweite Chance ================= */
/* ---------- Zweite Chance: Schnappschuss zu Beginn jedes Jahres ---------- */
const SNAPK='lebenslauf-snap';let SNAP=null;
{const _au=ageUp;ageUp=function(){try{if(p&&p.alive&&!p.sb)SNAP=JSON.stringify(p)}catch(e){SNAP=null}return _au.apply(this,arguments)}}
function snapGet(){if(SNAP)return SNAP;try{return localStorage.getItem(SNAPK)}catch(e){return null}}
function canSecond(){if(!p||p.alive||p.used2c||p.age>=100||p.sb)return false;const s=snapGet();if(!s)return false;try{const o=JSON.parse(s);return o.first===p.first&&o.last===p.last&&o.age>=p.age-1&&o.age<=p.age}catch(e){return false}}
function secondChance(){if(!canSecond())return;const o=JSON.parse(snapGet());if(ALB.lives[0]&&ALB.lives[0].n===p.first+' '+p.last&&ALB.lives[0].a===p.age){ALB.lives.shift();albSave()}p=o;p.used2c=1;p.alive=true;SNAP=null;try{localStorage.removeItem(SNAPK)}catch(e){errLog(e)}
  log('Zweite Chance: Du bekommst das letzte Jahr noch einmal.');mile('Zweite Chance genutzt','big');save();render();toast('Die Uhr läuft rückwärts. Noch ein Versuch!')}
/* ---------- Erinnerungsstücke: über alle Leben gesammelt ---------- */
const KKEY='lebenslauf-album';let ALB={lives:[],keep:{}};try{Object.assign(ALB,JSON.parse(localStorage.getItem(KKEY)||'{}'))}catch(e){errLog(e)}
const albSave=()=>{try{localStorage.setItem(KKEY,JSON.stringify(ALB))}catch(e){errLog(e)}};
const KI={uhr:'<circle cx="12" cy="13" r="7"/><path d="M12 10v3l2 2M10 3h4M12 3v3"/>',herz:'<path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z"/>',stern:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.3 6L12 16.4 6.6 19.4l1.3-6L3.4 9.3l6-.7z"/>',
 brief:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 7l9 6 9-6"/>',hut:'<path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',ball:'<circle cx="12" cy="12" r="9"/><path d="M12 7l4 3-1.5 5h-5L8 10z"/>',
 schl:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',kamera:'<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 7l2-3h4l2 3"/>',
 nase:'<circle cx="12" cy="12" r="6"/><circle cx="10" cy="10" r="1.5"/>',pfote:'<circle cx="12" cy="15" r="4"/><circle cx="6" cy="9" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="14" cy="6" r="2"/><circle cx="18" cy="9" r="2"/>',
 karte:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',kette:'<circle cx="12" cy="16" r="4"/><path d="M5 3c0 6 3 9 7 9s7-3 7-9"/>',
 muenze:'<circle cx="12" cy="12" r="8"/><path d="M14.5 9a3 3 0 1 0 0 6M9 11h4M9 13h4"/>',buch:'<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-4a3 3 0 0 0-3 3"/>',
 gitarre:'<circle cx="9" cy="15" r="5"/><path d="M12 12l8-8M17 4l3 3"/>',ring:'<circle cx="12" cy="14" r="6"/><path d="M9 5l3-3 3 3-3 3z"/>',auto:'<path d="M3 15l2-6h14l2 6v4H3z"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
 pokal:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M12 13v4M8 21h8M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/>',
 baum:'<path d="M12 21v-6"/><path d="M12 3l6 8h-3l4 5H5l4-5H6z"/>',gitter:'<path d="M4 4h16v16H4zM9 4v16M15 4v16"/>',mikro:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4"/>',
 flug:'<path d="M2 16l20-8-7 12-3-5z"/>',kreuz:'<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>',kerze:'<path d="M10 10h4v11h-4z"/><path d="M12 3c1.5 2 1.5 4 0 5-1.5-1-1.5-3 0-5z"/>'};
const KEEP={
 taschenuhr:['Die Taschenuhr','Werde 90 Jahre alt.','uhr','#C9A227',()=>p.age>=90],
 liebesbrief:['Der erste Liebesbrief','Heirate deine erste große Liebe.','brief','#E5407A',()=>!!p.ach.heirat&&(p.stats.partners||1)<=1],
 rote_nase:['Die rote Clownsnase','Werde Klassenclown des Jahrgangs.','nase','#E5484D',()=>msHas('Klassenclown')],
 doktorhut:['Der Doktorhut','Schließe ein Studium ab.','hut','#3E7CB1',()=>!!p.ach.studium],
 trikot:['Das Trikot vom ersten Profispiel','Unterschreib einen Profivertrag.','ball','#2FA88F',()=>msHas('Profivertrag')],
 schluessel:['Der Schlüssel zum Eigenheim','Kauf dir ein Haus.','schl','#8E6E53',()=>!!p.ach.haus],
 kamera:['Die alte Kamera','Erreiche 100.000 Follower.','kamera','#2BD1E6',()=>!!(p.sm&&p.sm.fol>=1e5)||!!p.ach.star],
 pfote:['Ein Pfotenabdruck','Hab ein Haustier.','pfote','#F2994A',()=>(p.pets||[]).length>0],
 weltkarte:['Die Weltkarte mit Stecknadeln','Mach ein Sabbatjahr um die Welt.','karte','#2B9ED8',()=>msHas('Sabbatjahr')],
 amtskette:['Die Amtskette','Werde Bürgermeister/in.','kette','#2B59C3',()=>!!(p.pol&&p.pol.lvl>=2)],
 erste_muenze:['Die erste Million','Werde Millionär/in.','muenze','#D5A35E',()=>!!p.ach.mio],
 tagebuch:['Das Tagebuch','Erlebe 25 Meilensteine.','buch','#8E63D6',()=>(p.ms||[]).length>=25],
 gitarre:['Die Gitarre','Lande einen Hit.','gitarre','#B05BD6',()=>!!(p.mus&&p.mus.hits)],
 ehering:['Die goldenen Ringe','Bleib bis ins hohe Alter (75) verheiratet.','ring','#E0B04A',()=>p.age>=75&&!!(p.partner&&p.partner.mar)],
 oldtimer:['Der Oldtimer','Besitze ein Auto und werde 70.','auto','#7F8C9A',()=>p.age>=70&&!!(p.cars&&p.cars.length)],
 pokal:['Der Pokal','Gewinne einen Wettbewerb oder Preis.','pokal','#F2B33D',()=>msHas('Quizshow')||msHas('Preis')||msHas('Meister')||msHas('Award')],
 stammbaum:['Der Stammbaum','Erreiche die dritte Generation.','baum','#3BB273',()=>p.gen>=3],
 gitterstab:['Ein Stück Gitterstab','Lande im Gefängnis.','gitter','#5A6270',()=>!!p.prison||(p.ms||[]).some(m=>/Gefängnis|Haft|Knast|Entlassen/.test(m.t))],
 mikrofon:['Das Mikrofon','Gib ein Interview im Radio oder Fernsehen.','mikro','#E5527A',()=>msHas('Radio')||msHas('Interview')||msHas('Fernseh')],
 flugticket:['Das Flugticket','Mach den Flugschein.','flug','#4FA3E0',()=>!!(p.lic&&p.lic.flug)],
 lebensretter:['Das Rettungsabzeichen','Rette ein Leben.','kreuz','#E5484D',()=>msHas('Lebensretter')],
 enkelbild:['Das Bild von den Enkeln','Hab 3 Enkelkinder.','herz','#F2994A',()=>(p.kids||[]).reduce((s,k)=>s+(k.kids||0),0)>=3],
 zweitechance:['Die stehengebliebene Uhr','Nutze eine zweite Chance.','uhr','#7A4BD6',()=>!!p.used2c],
 kerze:['Die Gedenkkerze','Lebe 10 Leben.','kerze','#F0CC87',()=>ALB.lives.length>=9]};
function keepCheck(){const neu=[];Object.keys(KEEP).forEach(k=>{if(ALB.keep[k])return;let ok=false;try{ok=KEEP[k][4]()}catch(e){errLog(e)}if(ok){ALB.keep[k]={n:p.first+' '+p.last,a:p.age};neu.push(k)}});return neu}
const keepIc=(k,sz)=>{const K=KEEP[k];return '<span class="kpi" style="--kc:'+K[3]+';width:'+(sz||44)+'px;height:'+(sz||44)+'px"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+KI[K[2]]+'</svg></span>'};
/* Beim Tod: Leben ins Album, neue Erinnerungsstücke */
{const _die=die;die=function(c){try{if(SNAP)localStorage.setItem(SNAPK,SNAP)}catch(e){errLog(e)}
  try{if(p&&!p.sb){const neu=keepCheck();p.keepNew=neu;const best=(p.ms||[]).filter(m=>m.k==='big'||m.k==='star').slice(-3).map(m=>m.t);
    ALB.lives.unshift({n:p.first+' '+p.last,g:p.g,a:p.age,c:c,gen:p.gen||1,t:p.pension?'Rentner/in':p.job?p.job.t:status(),nw:Math.round(netWorth()),ms:best,k:neu,ruf:p.ruf||0,y:Date.now()});
    if(ALB.lives.length>60)ALB.lives.length=60;albSave()}}catch(e){errLog(e)}
  return _die(c)}}
/* ---------- Lebensfilm ---------- */
function filmScenes(){const S=[],me=p.first+' '+p.last,ms=p.ms||[],A=a=>Math.min(a,p.age);
  const sc=(age,kap,txt,sub,col)=>S.push('<div class="lfs" style="--sc:'+(col||'#8E63D6')+'"><small class="lfk">'+kap+'</small><div class="lfav">'+avatarSvg(A(age),age<3?100:120,p)+'</div><p>'+txt+'</p>'+(sub?'<em>'+sub+'</em>':'')+'</div>');
  const inR=(a,b)=>ms.filter(m=>m.a>=a&&m.a<b);
  sc(0,'Kapitel 1 · Der Anfang',esc(me)+' kommt in '+esc(cityName(p.seed))+' zur Welt.',(p.gen>1?'Generation '+p.gen+' der Familie '+esc(p.last):'Ein ganzes Leben liegt vor dir.'),'#F2994A');
  if(p.age>=7){const f=p.km&&p.km[1],c=inR(1,13);const parts=[];if(f&&f.rel>=55)parts.push('Bester Freund: '+esc(f.n));if(p.clown>=60)parts.push('Der Klassenclown');const h=(p.ehist||[]).find(x=>x.a<13);
    sc(8,'Kapitel 2 · Kindheit',c.length?esc(c[c.length-1].t):'Sommer im Freibad, Hausaufgaben, Streiche.',parts.join(' · ')||(h?'Mit '+h.a+': '+esc(h.o):''),'#3BB273')}
  if(p.age>=15){const c=inR(13,20);sc(16,'Kapitel 3 · Jugend',c.length?esc(c.slice(-2).map(m=>m.t).join(' · ')):'Erste Partys, erster Liebeskummer.',p.edu&&p.edu!=='keine'?'Abschluss: '+esc(p.edu):'','#2B9ED8')}
  if(p.age>=22){const c=inR(20,40).filter(m=>m.k!=='bad');const love=ms.find(m=>m.k==='love'||/Hochzeit|Heirat|verheiratet/.test(m.t));
    sc(30,'Kapitel 4 · Mitten im Leben',c.length?esc(c.slice(-2).map(m=>m.t).join(' · ')):'Arbeit, Freunde, Alltag.',love?'Mit '+love.a+': '+esc(love.t):'','#E5407A')}
  if(p.kids&&p.kids.length&&p.age>=25)sc(Math.min(p.age,38),'Familie',p.kids.length===1?'Ein Kind: '+esc(p.kids[0].n):p.kids.length+' Kinder: '+esc(p.kids.map(k=>k.n).join(', ')),p.partner?'Mit '+esc(p.partner.name)+' an deiner Seite':'','#F2994A');
  (p.skfl||[]).slice(-2).forEach(f=>sc(f.a,'Was zurückkam',esc(f.t),esc(f.back),'#7A4BD6'));
  if(p.age>=45){const c=inR(40,200).filter(m=>m.k!=='bad');sc(Math.min(p.age,58),'Kapitel 5 · Die späten Jahre',c.length?esc(c.slice(-2).map(m=>m.t).join(' · ')):'Ruhiger, weiser, ein bisschen grauer.',p.pension?'Endlich Rente':'','#D5A35E')}
  const big=ms.filter(m=>m.k==='big'||m.k==='star').slice(-3);if(big.length)S.push('<div class="lfs" style="--sc:#F2B33D"><small class="lfk">Die größten Momente</small><div class="lftl">'+big.map(m=>'<div><span>'+m.a+'</span><b>'+esc(m.t)+'</b></div>').join('')+'</div></div>');
  const ep=p.epi!=null?EPI[p.epi]:'';S.push('<div class="lfs lfend" style="--sc:#7F8C9A"><small class="lfk">Ende</small><div class="lfav old">'+avatarSvg(p.age,120,p)+'</div><p>'+esc(me)+'<br><span>'+p.age+' Jahre</span></p>'+(ep?'<em>„'+esc(ep)+'“</em>':'')+'<div class="lfst"><span><b>'+eur(p.stats.maxNW||0)+'</b>höchstes Vermögen</span><span><b>'+(p.ms||[]).length+'</b>Meilensteine</span><span><b>'+(p.kids||[]).length+'</b>Kinder</span></div></div>');
  const heirs=(p.kids||[]).map((k,i)=>[k,i]).filter(([k])=>k.alive!==false);
  if(heirs.length)S.push('<div class="lfs" style="--sc:#3BB273"><small class="lfk">Die Geschichte geht weiter</small><p>Mit wem spielst du weiter?</p><div class="lfheirs">'+heirs.map(([k,i])=>'<button class="lfh" data-lf="cont" data-i="'+i+'">'+avatarSvg(Math.max(0,p.age-k.b),64,kidP(k,i))+'<b>'+esc(k.n)+'</b><small>'+(p.age-k.b)+' Jahre</small></button>').join('')+'</div></div>');
  return S}
let lfT=null;
function playFilm(){const S=filmScenes(),d=document.getElementById('dlg'),m=document.getElementById('modal');let i=0;p.filmSeen=1;save();d.className='dlg recap story film';m.classList.add('on');
  const close=()=>{clearTimeout(lfT);m.classList.remove('on');d.className='dlg'};
  const show=()=>{clearTimeout(lfT);d.innerHTML='<div class="stbars">'+S.map((_,k)=>'<i class="'+(k<i?'done':k===i?'on lfrun':'')+'"></i>').join('')+'</div><div class="sttop"><small>Dein Lebensfilm</small><button class="lnk" data-s="skip">Schließen</button></div><div class="stc">'+S[i]+'</div>'+
    '<div class="ch stnav">'+(i>0?'<button class="btn g" data-s="prev">Zurück</button>':'')+(i<S.length-1?'<button class="btn o" data-s="next">Weiter</button>':'<button class="btn o" data-s="skip">Fertig</button>')+'</div>';
    d.querySelectorAll('[data-s]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();const s=b.dataset.s;if(s==='prev'){i--;show()}else if(s==='next'){i++;show()}else close()});
    d.querySelectorAll('[data-lf=cont]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();close();continueAs(+b.dataset.i)});
    const st=d.querySelector('.stc');if(st)st.onclick=ev=>{if(ev.target.closest('button'))return;const r=st.getBoundingClientRect();if(ev.clientX<r.left+r.width*.3&&i>0){i--;show()}else if(i<S.length-1){i++;show()}};
    if(i<S.length-1&&!(typeof lessMotion==='function'&&lessMotion()))lfT=setTimeout(()=>{if(m.classList.contains('on')&&d.classList.contains('film')){i++;show()}},5200)};
  show()}
/* ---------- Todesbildschirm erweitern ---------- */
{const _vd=viewDeath;viewDeath=function(){let h=_vd();
  const top='<section class="card lfcta"><div class="lfrow"><div><b>Dein Lebensfilm</b><small>Dein ganzes Leben in einer Minute</small></div><button class="btn o" data-lf="film">Abspielen</button></div>'+
    (canSecond()?'<div class="lfrow sc2"><div><b>Zweite Chance</b><small>Spul ein Jahr zurück und versuch es noch einmal. Nur einmal pro Leben.</small></div><button class="btn g" data-lf="second">Zurückspulen</button></div>':'')+'</section>';
  const nk=(p.keepNew||[]).filter(k=>KEEP[k]);const kc=nk.length?'<section class="card"><h2 class="h">Neue Erinnerungsstücke</h2><p class="note">Sie bleiben in deinem Lebensalbum, für immer.</p><div class="kpg">'+nk.map(k=>'<div class="kp">'+keepIc(k)+'<b>'+esc(KEEP[k][0])+'</b></div>').join('')+'</div></section>':'';
  const i=h.indexOf('</p>',h.indexOf('class="obit"'));if(i>0)h=h.slice(0,i+4)+top+kc+h.slice(i+4);else h=top+kc+h;
  return h}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-lf]');if(!b||!p||p.alive)return;const k=b.dataset.lf;if(k==='film')playFilm();if(k==='second')secondChance()});
{const _rn=render;render=function(){const r=_rn.apply(this,arguments);try{if(p&&!p.alive&&!p.filmSeen&&!noDom()&&document.getElementById('dlg'))setTimeout(()=>{if(p&&!p.alive&&!p.filmSeen)playFilm()},700)}catch(e){errLog(e)}return r}}
/* ---------- Lebensalbum (in Erfolge und auf dem Startbildschirm) ---------- */
function viewAlbum(){const n=Object.keys(KEEP).length,got=Object.keys(KEEP).filter(k=>ALB.keep[k]).length;
  let h='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Erinnerungsstücke</h2><span class="chip">'+got+' von '+n+'</span></div><div class="bar" style="margin:8px 0 10px"><i style="width:'+(got/n*100)+'%"></i></div><div class="kpg">'+
    Object.keys(KEEP).map(k=>{const on=ALB.keep[k];return '<div class="kp'+(on?'':' lock')+'">'+keepIc(k)+'<b>'+esc(on?KEEP[k][0]:'???')+'</b><small>'+(on?'von '+esc(on.n):esc(KEEP[k][1]))+'</small></div>'}).join('')+'</div><p class="note">Am Ende jedes Lebens kommen neue Stücke dazu, je nachdem, wie du gelebt hast.</p></section>';
  h+='<section class="card"><h2 class="h">Deine Leben</h2>'+(ALB.lives.length?ALB.lives.map(L=>'<div class="alb"><div class="albh"><b>'+esc(L.n)+'</b><span>'+L.a+' Jahre'+(L.gen>1?' · Gen. '+L.gen:'')+'</span></div><small>'+esc(L.t||'')+' · '+eur(L.nw||0)+' · gestorben '+esc(L.c||'')+'</small>'+(L.ms&&L.ms.length?'<div class="albm">'+L.ms.map(t=>'<i>'+esc(t)+'</i>').join('')+'</div>':'')+'</div>').join(''):'<p class="note">Noch kein Leben zu Ende gelebt. Hier erscheint später jede Geschichte.</p>')+'</section>';
  return h}
{const _va=viewApp;viewApp=function(id){const h=_va.apply(this,arguments);if(id!=='erfolge')return h;
  const i=h.indexOf('<div class="seg full"><button data-a="etab"');if(i<0)return h;const j=h.indexOf('</div>',i);
  const ab='<button data-a="etab" data-g="album" aria-pressed="'+(eTab==='album')+'">Album</button>';
  return h.slice(0,j)+ab+'</div>'+(eTab==='album'?viewAlbum():h.slice(j+6))}}
{const _rs=renderStart;renderStart=function(){_rs.apply(this,arguments);try{if(!ALB.lives.length)return;const app=document.getElementById('app'),st=app&&app.querySelector('.start');if(!st||st.querySelector('.albst'))return;
  const got=Object.keys(KEEP).filter(k=>ALB.keep[k]).length,L=ALB.lives[0];
  const hero=st.querySelector('.hero');const html='<section class="card albst"><div class="lfrow"><div><b>Dein Lebensalbum</b><small>'+ALB.lives.length+' '+(ALB.lives.length===1?'Leben':'Leben')+' · '+got+' Erinnerungsstücke · zuletzt '+esc(L.n)+' ('+L.a+')</small></div><button class="btn g sm" data-alb="1">Ansehen</button></div></section>';
  if(hero)hero.insertAdjacentHTML('afterend',html);else st.insertAdjacentHTML('afterbegin',html);
  const b=st.querySelector('[data-alb]');if(b)b.onclick=()=>htmlDialog('<h2>Lebensalbum</h2>'+viewAlbum(),'Schließen')}catch(e){errLog(e)}}}
