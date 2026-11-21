/* ================= Einstellungen, Präsentation, Handy ================= */
const OKEY='lebenslauf-opts';
let O={snd:true,vib:true,theme:'auto',mini:'ask',rival:true,wall:0};try{Object.assign(O,JSON.parse(localStorage.getItem(OKEY)||'{}'))}catch(e){}
function applyTheme(){try{const r=document.documentElement;if(O.theme==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',O.theme)}catch(e){}}
function saveO(){try{localStorage.setItem(OKEY,JSON.stringify(O))}catch(e){}applyTheme()}
applyTheme();
let AC=null;
const SFX={coin:[[988,.06],[1319,.12]],win:[[523,.09],[659,.09],[784,.09],[1047,.22]],bday:[[523,.12],[523,.1],[587,.22],[523,.22],[698,.22],[659,.36]],msg:[[880,.06],[1175,.09]],bad:[[330,.16],[247,.34]],tap:[[700,.035]],big:[[392,.12],[523,.12],[659,.12],[784,.12],[1047,.3]]};
function sfx(k){if(!O.snd)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();let t=AC.currentTime+.01;
  (SFX[k]||SFX.tap).forEach(([f,d])=>{const o=AC.createOscillator(),g=AC.createGain();o.type=k==='bad'?'triangle':'sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.13,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.03);t+=d*.92})}catch(e){}}
function vib(ms){if(!O.vib)return;try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}}
const WALLS=[['Nachtblau','linear-gradient(160deg,#1B2340,#0B1022)'],['Sonnenuntergang','linear-gradient(160deg,#F5A25D,#C2306A 60%,#3A1F5C)'],['Ozean','linear-gradient(160deg,#1E9ED8,#1B3C7A)'],
  ['Wald','linear-gradient(160deg,#3BB273,#14503A)'],['Aurora','linear-gradient(160deg,#16213E,#1B7F79 50%,#7A4BD6)'],['Gold','linear-gradient(160deg,#3A2E12,#C9A227 60%,#2A220C)'],['Neon','linear-gradient(160deg,#120C2E,#E5407A 55%,#2BD1E6)'],['Marmor','linear-gradient(160deg,#5A6275,#2A2F3A 50%,#7C8396)']];
const PHONES=[['Kinderhandy','Tasten und ein kleines Display. Telefonieren geht.',1],['Smartphone','Das erste richtige Handy. Kamera ist okay.',3],['Smartphone Pro','Super Kamera: Posts gelingen besser.',5],['Ultra Fold','Faltbar, beste Kamera, alle Hintergründe.',8]];
function phoneTier(){const it=p.items;return it.includes('handy3')?3:it.includes('handy2')?2:it.includes('handy')?1:0}
const phoneOld=()=>phoneTier()>0&&p.phoneY!=null&&p.age-p.phoneY>=6;
const wallOk=i=>i<PHONES[phoneTier()][2];
SHOP.push({id:'handy2',n:'Smartphone Pro',pr:1400,e:{gl:4},min:12},{id:'handy3',n:'Ultra Fold',pr:2800,e:{gl:6,au:1},min:14});

/* ---------- Meilensteine, Ruf, Statistik ---------- */
function mile(t,k){if(!p.ms)p.ms=[];if(p.ms.some(m=>m.t===t&&m.a===p.age))return;p.ms.push({a:p.age,t,k:k||'star'});if(p.ms.length>60)p.ms.shift()}
const rufTxt=r=>r>=60?'Vorbild':r>=25?'Ehrlich':r>-25?'Unauffällig':r>-60?'Zwielichtig':'Skrupellos';
function addRuf(n){p.ruf=clamp((p.ruf||0)+n,-100,100)}
const MILE_ACH=['job','abi','studium','heirat','kind','befoerd','mio','haus','knast','jackpot','unternehmer','star','micro','ipo','hundert','achtzig'];

/* ---------- Weltgeschehen ---------- */
const WORLD={normal:['Normale Zeiten',1,0,0,'Die Wirtschaft läuft ruhig.'],boom:['Wirtschaftsboom',1.1,.03,0,'Aktien steigen, Gehälter auch.'],rezession:['Rezession',.86,-.01,.07,'Firmen sparen, Entlassungen drohen.'],
  pandemie:['Pandemie',.92,0,.03,'Clubs und Reisen sind eingeschränkt, Gesundheit leidet.'],krise:['Energiekrise',.94,-.005,.03,'Alles wird teurer.']};
const worldF=()=>p&&p.world?WORLD[p.world.ph][1]:1;
const LOCAL=['Neues Stadion für {c} geplant','{c}: Busfahrer streiken drei Tage lang','Rekordhitze in {c}, Freibäder überfüllt','{c} bekommt eine neue Straßenbahnlinie','Stadtfest in {c} lockt 80.000 Besucher',
  'Bürgerentscheid in {c}: Park statt Parkhaus','Bäckerei in {c} backt größte Brezel der Welt','Schneechaos legt {c} lahm','Neues Kino in {c} eröffnet','Hafen von {c} wird modernisiert','Ein Fuchs spaziert durchs Rathaus von {c}','Marathon in {c}: Streckenrekord!'];
const KULTUR=['Sommerhit des Jahres: „Wolkenlos“ von Juna Ray','Serie „Hafenkinder“ bricht alle Streaming-Rekorde','Raumfahrt: erste Touristin landet auf der Mondstation','Studie: Hunde machen glücklicher als Katzen. Katzen widersprechen.',
  'Neues Handy faltet sich jetzt dreimal','Fußball: Außenseiter gewinnt den Pokal','Forscher entdecken neue Froschart im Regenwald','Robotertaxis fahren jetzt in fünf Großstädten','Promi-Hochzeit des Jahres in Venedig','Videospiel „Sternenstaub“ verkauft 20 Millionen Mal'];
function news(t,cat,txt){if(!p.news)p.news=[];p.news.unshift({a:p.age,t,cat:cat||'welt',x:txt||''});p.news=p.news.slice(0,40);p.newsUn=(p.newsUn||0)+1}
function worldYear(R0){const w=p.world;w.y++;let ch2=false;
  if(w.ph==='normal'){const r=Math.random();const nx=r<.08?'boom':r<.14?'rezession':r<.16?'pandemie':r<.2?'krise':null;if(nx){w.ph=nx;w.y=0;w.dur=nx==='pandemie'?2:nx==='boom'?R(2,4):R(1,3);ch2=true}}
  else if(w.y>=w.dur){w.ph='normal';w.y=0;ch2=true;news('Experten: Die Lage hat sich normalisiert','welt','Nach der '+WORLD[p.world.ph][0]+' kehrt Ruhe ein.')}
  const W=WORLD[w.ph];if(ch2&&w.ph!=='normal'){news(W[0]+'!','welt',W[4]);log('Weltgeschehen: '+W[0]+'. '+W[4])}
  if(w.ph!=='normal'&&!ch2)news(W[0]+' hält an','welt',W[4]);
  if(p.job&&p.job.id!=='influ'&&p.job.id!=='pol'&&W[2])p.job.pay=Math.round(p.job.pay*(1+W[2]));
  if(p.job&&!p.job.part&&p.job.id!=='influ'&&p.job.id!=='pol'&&W[3]&&ch(W[3])){log('Wegen der '+W[0]+' wurdest du entlassen.');news('Welle von Entlassungen','welt','Auch '+p.first+' '+p.last+' hat es getroffen.');p.job=null;add('gl',-8)}
  if(w.ph==='pandemie'){add('ge',-R(0,4));add('gl',-2)}
  if(w.ph==='krise'){const c=px$(R(600,1500));p.money-=c;R0.out.push(['Energiekrise: höhere Rechnungen',c])}
  news(LOCAL[R(0,LOCAL.length-1)].split('{c}').join(cityName(p.seed)),'lokal');if(ch(.7))news(pick(KULTUR),'kultur');
  if(p.mnews&&p.mnews[0]&&p.mnews[0].a===p.age)news(p.mnews[0].t,'boerse');
  const me=p.first+' '+p.last;
  if(p.sm&&p.sm.fol>=100000&&ch(.6))news(me+': '+kfmt(p.sm.fol)+' Follower und kein Ende in Sicht','promi');
  if(netWorth()>=1e6&&ch(.4))news('Reichenliste: '+me+' besitzt über '+eur(Math.floor(netWorth()/1e6)*1e6),'promi');
  if(p.prison&&ch(.5))news(me+' sitzt weiter in Haft','lokal');
}

/* ---------- Kalender ---------- */
const MON=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
function bdOf(id){p.bd=p.bd||{};if(!p.bd[id]){const r=rng((p.seed%100000)+[...id].reduce((t,c,i)=>t+c.charCodeAt(0)*(i+3)*17,0));p.bd[id]=[1+Math.floor(r()*28),Math.floor(r()*12)]}return p.bd[id]}
function people(){const L=[];if(!p.parentsGone)L.push(['mama','Mama'],['papa','Papa']);if(p.age>=6)L.push(['freund',p.friend]);if(p.partner)L.push(['partner',p.partner.name]);
  p.kids.forEach((k,i)=>{if(k.alive!==false)L.push(['kid'+i,k.n])});if(p.rival&&O.rival&&p.age>=6)L.push(['rival',p.rival.n]);return L}
const TERM={arzt:['Vorsorge beim Hausarzt','Gesundheit +3',()=>p.age>=18,()=>{add('ge',3);return 'Alles im grünen Bereich.'},null],
 zahn:['Zahnarzt-Kontrolle','Aussehen +1',()=>p.age>=6,()=>{add('au',1);return 'Keine Löcher!'},null],
 eltern:['Elternabend','Deine Kinder freuen sich',()=>p.kids.some(k=>p.age-k.b>=6&&p.age-k.b<18),()=>{p.kids.forEach(k=>{if(p.age-k.b>=6&&p.age-k.b<18)k.rel=Math.min(100,k.rel+5)});return 'Die Lehrerin lobt deine Kinder.'},()=>{p.kids.forEach(k=>{if(p.age-k.b>=6&&p.age-k.b<18)k.rel-=3});return 'Elternabend verpasst. Die Kinder sind enttäuscht.'}],
 jahrestag:['Hochzeitstag','Verbindung +8 (Essen 150 €)',()=>!!(p.partner&&p.partner.mar),()=>{p.money-=150;p.partner.rel=Math.min(100,p.partner.rel+8);add('gl',3);return 'Ein romantischer Abend.'},()=>{if(!p.partner)return '';p.partner.rel-=12;msg('partner','Du hast unseren Hochzeitstag vergessen. Echt jetzt?');return 'Hochzeitstag vergessen! Verbindung −12.'}],
 tuev:['TÜV-Termin','Auto bleibt in Schuss (120 €)',()=>p.cars.length>0,()=>{p.money-=120;return 'Plakette bekommen.'},()=>{p.money-=300;return 'TÜV vergessen: 300 € Bußgeld.'}],
 treffen:['Klassentreffen','Alte Gesichter wiedersehen',()=>[20,30,40,50,60].includes(p.age),()=>{add('gl',5);let t='Viele alte Geschichten, viel Gelächter.';if(p.rival&&O.rival&&!p.rival.friend){const me=netWorth(),rv=p.rival.money;t+=me>=rv?' '+p.rival.n+' ist sichtlich neidisch auf deinen Erfolg.':' '+p.rival.n+' prahlt den ganzen Abend. Das nervt.';add('gl',me>=rv?5:-4)}return t},null],
 wahl:['Wahltag','Deine Stimme zählt',()=>p.age>=18&&p.age%4===0,()=>{addRuf(1);return 'Du warst wählen.'},null],
 blut:['Blutspende','Glück +3, Ruf +2',()=>p.age>=18&&p.age<=68,()=>{add('gl',3);addRuf(2);return 'Du hast Leben gerettet.'},null]};
function newTerms(){const ks=Object.keys(TERM).filter(k=>TERM[k][2]());p.terms=shuffle(ks).slice(0,4).map(k=>({k,d:R(1,28),m:R(0,11),done:false})).sort((x,y)=>x.m-y.m||x.d-y.d)}
function calYear(R0){if(p.age-1>=10)people().forEach(([id,n])=>{if(p.grat&&p.grat[id]===p.age-1)return;
    if(id==='partner'&&p.partner){p.partner.rel-=8;msg('partner','Du hast meinen Geburtstag vergessen …')}
    else if(id==='mama'||id==='papa'){p.rel[id]=Math.max(0,p.rel[id]-5);msg(id,'Hast du meinen Geburtstag vergessen? Naja.')}
    else if(id==='freund'){p.rel.freund=Math.max(0,p.rel.freund-7)}
    else if(id.startsWith('kid')){const k=p.kids[+id.slice(3)];if(k&&p.age-1-k.b>=3)k.rel-=6}});
  (p.terms||[]).forEach(t=>{if(!t.done&&TERM[t.k]&&TERM[t.k][4]){const r=TERM[t.k][4]();if(r)log(r)}});newTerms()}
function openBd(){if(p.age<10)return 0;return people().filter(([id])=>!(p.grat&&p.grat[id]===p.age)).length}

/* ---------- Ensure ---------- */
function ensureLife(){
  if(p.ruf==null)p.ruf=0;if(!p.ms)p.ms=[];if(!p.news)p.news=[];if(p.newsUn==null)p.newsUn=0;if(!p.world)p.world={ph:'normal',y:0,dur:0};
  if(!p.rel)p.rel={mama:70,papa:70,freund:65};if(!p.grat)p.grat={};if(!p.terms)newTerms();if(!p.later)p.later=[];if(!p.q)p.q=[];if(!p.habit)p.habit={};
  if(!p.stats)p.stats={maxNW:Math.max(0,p.money),earn:0,jobs:p.job?1:0,partners:p.partner?1:0,cities:1,maxFol:0};if(!p.tree)p.tree=[];if(!p.gen)p.gen=1;if(!p.will)p.will='gleich';
  if(!p.city)p.city='mittel';if(!p.cfg)p.cfg={act:6,clock:true,ev:'normal',big:true,wealth:'normal'};if(p.clock==null)p.clock=DAYSTART;if(p.phoneY==null&&phoneTier()>0)p.phoneY=p.age;
  p.kids.forEach(k=>{if(k.rel==null){k.rel=70;k.g=k.g||(FN.includes(k.n)?'w':'m');k.tal=pick(Object.keys(TAL));k.ts=R(10,40);k.st={in:R(35,90),ge:R(65,95),gl:70};k.fd={};k.edu='keine';k.alive=true;k.kids=0}});
  if(p.rival===undefined)p.rival=null;if(!p.rival&&O.rival&&p.age>=6)mkRival();
  if(!p.gr)p.gr=null;if(p.rep==null)p.rep=0;
}

/* ---------- Views: Einstellungen, Nachrichten, Kalender ---------- */
const tog=(k,on,l,s)=>'<button class="tg" data-a="opt" data-g="'+k+'" aria-pressed="'+on+'"><span><b>'+l+'</b><small>'+s+'</small></span><i></i></button>';
function viewEinst(){const t=phoneTier();
  let h='<section class="card"><h2 class="h">Dein Handy</h2>'+row(PHONES[t][0]+(phoneOld()?' (alt)':''),PHONES[t][1]+(phoneOld()?' Der Akku hält kaum noch einen Tag.':''),t<3?btn('goto','shop','Upgrade','o',p.age<10):'<span class="chip">Top</span>')+'</section>';
  h+='<section class="card"><h2 class="h">Hintergrund</h2><div class="walls">'+WALLS.map((w,i)=>'<button class="wall" data-a="wall" data-g="'+i+'" aria-pressed="'+(O.wall===i)+'" aria-label="'+w[0]+'" style="background:'+w[1]+'"'+(wallUsable(i)?'':' disabled')+'>'+(wallUsable(i)?'':'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>')+'</button>').join('')+'</div><p class="note" style="margin-top:8px">Bessere Handys schalten mehr Hintergründe frei, besondere gibt es in der Sammlung (App Erfolge).</p></section>';
  if(p)h+=cfgCard();h+='<section class="card"><h2 class="h">Design</h2><div class="seg full">'+[['auto','Automatisch'],['light','Hell'],['dark','Dunkel']].map(([k,l])=>'<button data-a="theme" data-g="'+k+'" aria-pressed="'+(O.theme===k)+'">'+l+'</button>').join('')+'</div></section>';
  h+='<section class="card tgs">'+tog('snd',O.snd,'Töne','Kleine Klänge bei Geld, Erfolgen, Geburtstagen')+tog('vib',O.vib,'Vibration','Kurzes Brummen bei wichtigen Momenten')+tog('rival',O.rival,'Rivale','Eine Person aus deiner Schulzeit fordert dich ein Leben lang heraus')+'</section>';
  h+='<section class="card"><h2 class="h">Minispiele bei der Arbeit</h2><div class="seg full">'+[['ask','Fragen'],['play','Immer spielen'],['skip','Überspringen']].map(([k,l])=>'<button data-a="mini" data-g="'+k+'" aria-pressed="'+(O.mini===k)+'">'+l+'</button>').join('')+'</div><p class="note" style="margin-top:6px">Beim Überspringen wird das Ergebnis aus deinen Werten berechnet.</p></section>';
  return h}
const NCAT={welt:['Welt','#2B59C3'],lokal:['Lokal','#2FA88F'],kultur:['Kultur','#8E63D6'],boerse:['Börse','#158A7A'],promi:['Promis','#E5407A'],gross:['Eilmeldung','#D64545'],rival:['Leute','#F08A24']};
function viewNews(){p.newsUn=0;const W=WORLD[p.world.ph];
  let h='<section class="card nwhead ph-'+p.world.ph+'"><small>WELTLAGE</small><b>'+W[0]+'</b><span>'+W[4]+'</span></section>';
  if(!p.news.length)return h+card('','<p class="note">Noch keine Nachrichten. Werde ein Jahr älter.</p>');
  let la=null;p.news.forEach(n=>{if(n.a!==la){h+='<h3 class="sec">Alter '+n.a+'</h3>';la=n.a}const c=NCAT[n.cat]||NCAT.welt;
    h+='<article class="nw'+(n.cat==='gross'?' brk':'')+'"><span class="nc" style="background:'+c[1]+'">'+c[0]+'</span><b>'+esc(n.t)+'</b>'+(n.x?'<small>'+esc(n.x)+'</small>':'')+'</article>'});
  return h}
function viewKal(){let h='';const bds=people().map(([id,n])=>({id,n,d:bdOf(id)})).sort((x,y)=>x.d[1]-y.d[1]||x.d[0]-y.d[0]);
  const items=bds.map(b=>({m:b.d[1],d:b.d[0],h:'<div class="kal'+(p.grat[b.id]===p.age?' done':'')+'"><span class="kd"><b>'+b.d[0]+'</b><small>'+MON[b.d[1]].slice(0,3)+'</small></span><div class="kt"><b>Geburtstag: '+esc(b.n)+'</b><small>'+(p.grat[b.id]===p.age?'Gratuliert':'Nicht vergessen! Sonst ist jemand enttäuscht.')+'</small></div>'+(p.grat[b.id]===p.age?'<span class="chip">Erledigt</span>':btn('grat',b.id,'Gratulieren','o',p.age<6||!!p.prison&&b.id!=='mama'&&b.id!=='papa'))+'</div>'}))
   .concat(p.terms.map((t,i)=>{const T=TERM[t.k];if(!T)return null;return {m:t.m,d:t.d,h:'<div class="kal term'+(t.done?' done':'')+'"><span class="kd"><b>'+t.d+'</b><small>'+MON[t.m].slice(0,3)+'</small></span><div class="kt"><b>'+T[0]+'</b><small>'+(t.done?'Erledigt':T[1]+(T[4]?' · verpassen hat Folgen':''))+'</small></div>'+(t.done?'<span class="chip">Erledigt</span>':btn('term',i,'Hingehen','',!!p.prison))+'</div>'}}).filter(Boolean)).sort((x,y)=>x.m-y.m||x.d-y.d);
  h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Dein Jahr mit '+p.age+'</h2><span class="chip">'+openBd()+' offen</span></div><p class="note" style="margin:4px 0 8px">Gratulieren und Termine kosten keine Aktion. Vergessene Geburtstage und Termine haben Folgen.</p>'+(items.length?items.map(x=>x.h).join(''):'<p class="note">Keine Termine.</p>')+'</section>';
  const up=[];if(p.school)up.push(['Schulabschluss',(p.school==='Gymnasium'?18:p.school==='Hauptschule'?15:16)+(p.rep||0)-p.age+' Jahr(e)']);if(p.study)up.push(['Studienabschluss '+p.study.f,p.study.left+' Jahr(e)']);if(p.azubi)up.push(['Ausbildungsende',p.azubi.left+' Jahr(e)']);
  if(p.pol&&p.pol.next)up.push(['Nächste Wahl ('+POLO[Math.min(POLO.length-1,p.pol.lvl+1)][0]+')',Math.max(0,p.pol.next-p.age)+' Jahr(e)']);if(p.job&&!p.pension&&p.age<67&&p.job.id!=='influ')up.push(['Rente',67-p.age+' Jahre']);
  if(p.sm&&p.sm.ch&&p.sm.ch.plan.length)up.push(['Plan-Streams',p.sm.ch.plan.map(i=>SLOTS[i][0]+':00').join(', ')]);
  (p.loans||[]).forEach(l=>up.push(['Kredit abbezahlt',l.left+' Jahr(e)']));
  if(up.length)h+=card('Demnächst',up.map(u=>row(u[0],'in '+u[1])).join(''));
  return h}

