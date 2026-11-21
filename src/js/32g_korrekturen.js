/* ================= Korrekturen und Gefängnis ================= */
/* ---------- Aktionen: Hinweise, kostenlose Aktionen, Arzt wird günstiger ---------- */
const FREEA={arzt:()=>(p.hv||0)>=6};
const durOf=id=>id==='arzt'?((p.hv||0)>=6?30:(p.hv||0)>=3?45:90):(DUR[id]||60);
function actWarn(){if(unl()||!p||!p.alive)return;if(p.act===2)notify('Nur noch 2 Aktionen in diesem Jahr. Plane gut!','');else if(p.act===1)notify('Achtung: Das ist deine letzte Aktion in diesem Jahr.','');
  else if(p.act===0)notify(clockOn()&&p.clock>=DAYEND-10?'Es ist 3 Uhr nachts. Zeit für ein neues Jahr: Halte „+1 Jahr“ gedrückt.':'Alle Aktionen verbraucht. Kostenlose Dinge gehen noch, sonst „+1 Jahr“ gedrückt halten.','home')}
{const {f}=ACTS.arzt;ACTS.arzt.f=()=>{p.hv=(p.hv||0)+1;return f()}}

/* ---------- Gefängnis: nur für Insassen und Wärter ---------- */
JOBS.push({id:'waerter',t:'Justizvollzugsbeamter/in',pay:36000,min:20,edu:1});JOBMG.waerter='streit';
const JVA={
 hof:['Hofgang und Training','Form und Gesundheit +',90,()=>{p.sk.form=Math.min(100,p.sk.form+4);add('ge',2);add('gl',2);return pick(['Klimmzüge an der Hofmauer.','Du drehst 50 Runden im Hof.','Liegestütze, bis die Arme brennen.'])}],
 bib:['Bibliothek','Intelligenz +',60,()=>{add('in',R(3,5));return pick(['Du liest einen dicken Roman.','Ein Buch über Wirtschaft. Interessant!','Du lernst Spanisch aus einem alten Lehrbuch.'])}],
 werk:['Arbeit in der Werkstatt','etwas Geld und gute Führung',240,()=>{const v=px$(R(200,450));p.money+=v;p.good=(p.good||0)+1;return 'Du baust Möbel in der Werkstatt und verdienst '+eur(v)+'.'}],
 schule:['Schulabschluss nachholen','Bildung, wenn du noch keinen Abschluss hast',180,()=>{if(RANK[p.edu]>=1)return 'Du hast schon einen Abschluss. Du hilfst anderen beim Lernen.';p.jvEdu=(p.jvEdu||0)+1;add('in',3);if(p.jvEdu>=2){p.edu=RANK[p.edu]>=.5?'Realschule':'Hauptschule';p.jvEdu=0;mile('Abschluss im Gefängnis: '+p.edu,'star');return 'Geschafft! Du hast den Abschluss ('+p.edu+') nachgeholt.'}return 'Ein Jahr Unterricht. Noch eins, dann hast du den Abschluss.'}],
 therapie:['Anti-Gewalt-Training','Ruf +, gute Führung',120,()=>{addRuf(5);add('gl',2);p.good=(p.good||0)+1;return 'Du lernst, mit Wut umzugehen. Die Leitung ist beeindruckt.'}],
 besuch:['Besuch empfangen','Familie und Partner',60,()=>{if(p.partner)p.partner.rel=Math.min(100,p.partner.rel+8);if(!p.parentsGone){p.rel.mama=Math.min(100,p.rel.mama+6)}add('gl',6);return p.partner?p.partner.name+' besucht dich. Ihr haltet Händchen durch die Scheibe.':!p.parentsGone?'Mama kommt mit Kuchen. Er wird am Eingang kontrolliert.':'Niemand kommt. Ein Pfarrer leistet dir Gesellschaft.'}],
 kontakte:['Kontakte knüpfen','Fähigkeiten im Untergrund, Ruf −',90,()=>{addRuf(-4);const k=pick(['schloss','hack','kampf']);p.sk[k]=Math.min(100,(p.sk[k]||0)+5);if(p.gang)p.gang.rep+=4;return 'Ein alter Hase zeigt dir ein paar Tricks.'}],
 tausch:['Tauschhandel','Zigaretten gegen Gefälligkeiten',30,()=>ch(.6)?(p.money+=R(20,120),'Ein guter Deal. Du hast jetzt Kaffee und ein bisschen Geld.'):(add('ge',-4),p.good=Math.max(0,(p.good||0)-1),'Der Deal fliegt auf. Eine Woche Einzelzelle.')],
 anwalt:['Berufung einlegen','3.000 € Anwalt, Chance auf weniger Haft',120,()=>{const c=px$(3000);if(p.money<c)return 'Du kannst dir den Anwalt nicht leisten.';p.money-=c;if(p.prison>1&&ch(.35)){p.prison--;return 'Die Berufung hat Erfolg: ein Jahr weniger Haft!'}return 'Die Berufung wird abgelehnt.'}],
 flucht:['Ausbruch versuchen','Sehr riskant',180,()=>{if(ch(.12+(p.sk.schloss||0)/400)){p.prison=0;p.wanted=5;addRuf(-10);mile('Ausbruch aus dem Gefängnis','star');news('Ausbruch aus der JVA '+cityName(p.seed)+'!','gross');return 'Du bist draußen! Aber jetzt sucht dich die ganze Stadt.'}p.prison+=2;p.good=0;add('gl',-8);return 'Erwischt am Zaun. Zwei Jahre mehr.'}]};
const jvaUse=()=>!!p.prison||!!(p.job&&p.job.id==='waerter');
function viewJva(){if(!jvaUse())return card('','<p class="note">Hier kommst du nur als Insasse oder als Justizvollzugsbeamter/in hinein.</p>'+(p.age>=20?'<div class="btns">'+btn('goto','jobs','Jobs ansehen','')+'</div>':''));
  if(!p.prison)return '<section class="card jvah"><b>Dienst in der JVA</b><small>Du arbeitest als Justizvollzugsbeamter/in.</small></section>'+card('Dienst',special('work')+row('Zellenkontrolle','Einmal im Jahr · Minispiel',p.jvK===p.age?'<span class="chip">Erledigt</span>':btn('jvkontrolle',null,'Kontrolle','o'))+row('Gespräch mit einem Häftling','Gute Führung fördern',btn('jvgespr',null,'Reden','',p.act<=0)));
  let h='<section class="card jvah"><b>Noch '+p.prison+' Jahr(e) Haft</b><small>Gute Führung: '+(p.good||0)+' von 3. Mit 3 Punkten wirst du ein Jahr früher entlassen.</small><div class="bar"><i style="width:'+Math.min(100,(p.good||0)/3*100)+'%;background:#0E9F7E"></i></div></section>';
  h+='<section class="card">'+Object.keys(JVA).map(k=>{const J=JVA[k];return row(J[0],J[1]+(clockOn()?' · '+durTxt(J[2]):''),btn('jva',k,k==='flucht'?'Wagen':'Los',k==='flucht'?'g':'o',p.act<=0))}).join('')+'</section>';
  return h}
function jvaYear(){if(p.prison&&(p.good||0)>=3&&p.prison>1){p.prison--;p.good=0;log('Gute Führung: Du wirst ein Jahr früher entlassen.')}}

/* ---------- Gratulieren, Einladungen und Gesundheitstermine ---------- */
const relOf=id=>id==='partner'&&p.partner?p.partner.rel:p.rel&&p.rel[id]!=null?p.rel[id]:String(id).startsWith('kid')?((p.kids[+id.slice(3)]||{}).rel??60):String(id).startsWith('sib')?(((p.sibs||[])[+id.slice(3)]||{}).rel??60):id==='rival'?20:60;
const HEALTHT=['arzt','zahn','blut'];

/* ---------- Vollbild-Hinweis ---------- */
/* Der Wechsel ins Vollbild passiert jetzt nur noch einmal pro Start (siehe shell.html) und lässt sich abschalten. */

/* ---------- Aktionen ---------- */
function act13(id,arg){switch(id){
  case 'jva':{const J=JVA[arg];if(!J||!p.prison)return 1;CUR='jva_'+arg;DUR[CUR]=J[2];if(!useAct())return 1;done(J[3]());return 1}
  case 'jvkontrolle':{if(!p.job||p.job.id!=='waerter'||p.jvK===p.age)return 1;p.jvK=p.age;mgStart('streit',3,'Zellenkontrolle',s=>{p.job.perf=Math.min(100,p.job.perf+s*5);const t='Zellenkontrolle: '+['Nichts gefunden, aber Ärger mit den Häftlingen.','Ein verstecktes Handy entdeckt.','Zwei Schmuggelverstecke ausgehoben!','Perfekte Kontrolle. Die Leitung lobt dich.'][s];log(t);save();render();dialog('Kontrolle',t,[['OK',null]])});return 1}
  case 'jvgespr':{if(!p.job||p.job.id!=='waerter')return 1;CUR='jvgespr';if(!useAct())return 1;addRuf(2);p.job.perf=Math.min(100,p.job.perf+3);done(pick(['Ein Häftling erzählt dir seine Geschichte. Du hörst zu.','Du schlichtest einen Streit, bevor er eskaliert.']));return 1}
  case 'fstog':O.fs=O.fs===false;saveO();toast(O.fs===false?'Vollbild beim Start ist aus.':'Vollbild beim Start ist an.');render();return 1;
  }return 0}

/* ---------- Zurück-Navigation (auch die Zurück-Geste des Handys) ---------- */
let navKey='',navPop=false;
function navSync(){const k=tab+'|'+(chatSel||'')+'|'+(tab==='stadt'?sel||'':'');if(k!==navKey){if(navKey&&!navPop)try{history.pushState({k},'')}catch(e){}navKey=k}navPop=false}
if(window.addEventListener)window.addEventListener('popstate',()=>{if(!p||!p.alive)return;navPop=true;
  if(document.getElementById('modal').classList.contains('on')){document.getElementById('modal').classList.remove('on')}
  else if(tab==='chats'&&chatSel)chatSel=null;else if(tab==='stadt'&&sel)sel=null;else if(tab!=='home')tab='home';render()});

/* ---------- Stadt-Ereignisse sitzen auf echten Gebäuden ---------- */
function cevMarkers(){const el=document.getElementById('cev');if(!el)return;const show=tab==='stadt'&&!p.prison&&G&&G.L&&cityMode!=='list';
  const L=show?cityEvents():[];if(show){const cells=G.L.cells;L.forEach((e,i)=>{if(e.ci==null||!cells[e.ci]){const used=L.map(x=>x.ci);let free=cells.map((c,j)=>j).filter(j=>!cells[j].place&&!used.includes(j));if(!free.length)free=cells.map((c,j)=>j).filter(j=>!used.includes(j));e.ci=free.length?pick(free):0}})}
  const html=L.map((e,i)=>'<button class="cevm" data-a="cityev" data-g="'+i+'" data-ci="'+e.ci+'" aria-label="'+CEV[e.k][0]+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+CEV[e.k][2]+'</svg></button>').join('');
  if(el.dataset.h!==html){el.innerHTML=html;el.dataset.h=html}cevProject()}
const _cv={};
function cevProject(){const el=document.getElementById('cev');if(!el||!G||!G.L||!el.children||!el.children.length||typeof THREE==='undefined')return;const w=el.clientWidth,h=el.clientHeight;
  for(const b of el.children){const c=G.L.cells[+b.dataset.ci];if(!c)continue;const v=(_cv.v=_cv.v||new THREE.Vector3()).set(c.x,(c.top||Math.max(2,...c.lots.map(l=>l.h)))+3,c.z).project(G.cam);
    const x=(v.x+1)/2*w,y=(1-v.y)/2*h,vis=v.z<1&&x>-30&&x<w+30&&y>-30&&y<h+30;b.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';b.style.display=vis?'grid':'none'}}

/* ---------- Namen aus inhalte/namen.txt (bearbeitbar) ---------- */
const BANDN=['Die Nachtfalter','Hafenlichter','Die Blauen Stunden','The Kometen','Neonherzen','Sturmvögel'];
const PROCLUBS=['SC Nordhafen','Borussia Weststadt','FC Altbrück','TuS Südfelde','FC Nordstern','Union Hafenstadt','SV Weißblau','Eintracht Südpark'];
function applyNames(txt){const S={};let cur=null;txt.split(/\r?\n/).forEach(l=>{l=l.trim();if(!l||l.startsWith('#'))return;const m=l.match(/^\[(.+)\]$/);if(m){cur=m[1].trim().toLowerCase();S[cur]=[];return}if(cur)S[cur].push(l)});
  const set=(arr,key)=>{const L=S[key];if(L&&L.length){arr.length=0;L.forEach(x=>arr.push(x))}};
  set(FN,'vornamen weiblich');set(MN,'vornamen männlich');set(LN,'nachnamen');set(CITYA,'ortsnamen anfang');set(CITYB,'ortsnamen ende');set(BANDN,'bandnamen');set(SONGW,'songtitel');
  set(COMPN,'konkurrenten');set(GANGS,'gangs');set(PROCLUBS,'profivereine');set(RTAUNT,'sprüche des rivalen');
  (S['gebäude in der stadt']||[]).forEach(l=>{const [k,v]=l.split('=').map(x=>x.trim());if(PL[k]&&v)PL[k].n=v});
  (S['läden']||[]).forEach(l=>{const [k,v]=l.split('=').map(x=>x.trim());if(FR[k]&&v)FR[k].n=v});
  (S['parteien']||[]).forEach((l,i)=>{const [n,d]=l.split('|').map(x=>x.trim());if(PARTIES[i]&&n){PARTIES[i][0]=n;if(d)PARTIES[i][2]=d}})}
try{if(typeof fetch==='function'&&location&&location.protocol.startsWith('http'))fetch('inhalte/namen.txt',{cache:'no-cache'}).then(r=>r.ok?r.text():'').then(t=>{if(t){applyNames(t);if(p)render();else if(typeof renderStart==='function'&&document.getElementById('app'))renderStart()}}).catch(()=>{})}catch(e){}
