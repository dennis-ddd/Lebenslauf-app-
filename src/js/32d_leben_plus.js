/* ================= Leben+: Chats, Jobs, Hobbys, Geschwister, Handy, Erinnerungen, Prüfungen, Stadt ================= */
function spendTime(m){if(!clockOn())return true;if(p.clock+m>DAYEND){toast('Dafür ist es zu spät. Es ist schon '+clockTxt()+'.');return false}p.clock+=m;if(p.clock>=DAYEND-10)p.act=0;return true}

/* ---------- Chats: Antworten, Gruppen, Einladungen ---------- */
const REPLY={lieb:['Danke dir, hab dich lieb!','Das ist so lieb von dir!','Du bist die/der Beste.','Freu mich total, von dir zu hören!'],kurz:['Ok.','Jo.','Klingt gut.','Mal sehen.'],frech:['Lass mich in Ruhe.','Muss das jetzt sein?','Kein Bock.','Später vielleicht.']};
const INVITES={freund:[['Kino heute Abend?','kino'],['Kommst du mit zum Konzert?','konzert'],['Zocken bei mir?','zocken'],['Lust auf einen Spieleabend?','spiele']],mama:[['Kommst du Sonntag zum Essen?','essen']],papa:[['Hilfst du mir am Samstag beim Umzug von Oma?','hilfe']],
 partner:[['Wollen wir heute schick essen gehen?','dinner']],g_job:[['Feierabendbier heute?','bier']],g_klasse:[['Party bei Jonas am Freitag!','party']],kid:[['Grillen bei uns am Wochenende?','grill']]};
const GROUPS={g_fam:['Familie','#E5527A',()=>!p.parentsGone||(p.sibs||[]).length>0],g_klasse:['Klasse '+'','#3BB273',()=>!!p.school&&p.age>=10],g_job:['Kollegen','#6B7385',()=>!!(p.job&&!['influ','pol'].includes(p.job.id))]};
const GMSG={g_fam:[['Mama','Wer bringt am Sonntag den Nachtisch mit?'],['Papa','Ich hab ein neues Grillrezept.'],['Mama','Schaut mal, die Katze vom Nachbarn!'],['Papa','Wer hat meinen Akkuschrauber?']],
 g_klasse:[['Lena','Hat jemand die Mathe-Hausaufgaben?'],['Jonas','Morgen fällt Sport aus!!'],['Mia','Wer kommt mit ins Freibad?'],['Tim','Ich hab den Test komplett verhauen']],
 g_job:[['Sabine','Wer hat meinen Joghurt aus dem Kühlschrank genommen?'],['Murat','Meeting um 9 ist verschoben.'],['Chefin','Gute Arbeit diese Woche, Team!'],['Jan','Kuchen in der Küche!']]};
function relUp(id,n){if(id==='partner'&&p.partner)p.partner.rel=clamp(p.partner.rel+n,0,100);else if(p.rel&&p.rel[id]!=null)p.rel[id]=clamp(p.rel[id]+n,0,100);
  else if(String(id).startsWith('kid')){const k=p.kids[+id.slice(3)];if(k)k.rel=clamp(k.rel+n,0,100)}else if(String(id).startsWith('sib')){const s=(p.sibs||[])[+id.slice(3)];if(s)s.rel=clamp(s.rel+n,0,100)}}
function chatsYear(){const cs=contacts().map(c=>c.id);Object.keys(p.chats).forEach(k=>{const c=p.chats[k];if(c.inv&&c.inv.y<p.age)c.inv=null});
  Object.keys(GROUPS).forEach(g=>{if(GROUPS[g][2]()&&ch(.6)){const [n,t]=pick(GMSG[g]);msg(g,n+': '+t)}});
  cs.forEach(id=>{const key=id.startsWith('kid')?'kid':id;const L=INVITES[key];if(!L||!ch(.3))return;if(key==='kid'&&p.age-p.kids[+id.slice(3)].b<20)return;const [t,k]=pick(L);msg(id,t);p.chats[id].inv={t,k,y:p.age}});
  cs.forEach(id=>{const c=p.chats[id];if(c&&c.msgs.length&&!c.msgs[c.msgs.length-1].me&&!id.startsWith('g_'))c.pend=true})}
const _msg0=msg;msg=function(id,t,me){_msg0(id,t,me);const c=p.chats[id];if(c)c.pend=!me};
function chatExtra(c){const C=p.chats[c.id]||{};let h='';
  if(C.inv)h+='<div class="inv"><small>Einladung</small><b>'+esc(C.inv.t)+'</b><div class="btns">'+btn('invyes',c.id,'Zusagen · '+(clockOn()?'2 Std.':'1 Aktion'),'o',p.act<=0||!!p.prison)+btn('invno',c.id,'Absagen','g')+'</div></div>';
  else if(C.pend&&!c.id.startsWith('g_')&&c.id!=='chef')h+='<div class="replies">'+[['lieb','Lieb antworten'],['kurz','Kurz antworten'],['frech','Genervt antworten']].map(([k,l])=>'<button class="rp" data-a="reply" data-g="'+c.id+':'+k+'">'+l+'<small>„'+esc(REPLY[k][0])+'“</small></button>').join('')+'</div>';
  else if(C.pend&&c.id.startsWith('g_'))h+='<div class="replies">'+btn('greply',c.id,'Mitreden','o')+'</div>';
  return h}

/* ---------- Jobs: Kollegen, Homeoffice, Bewerbungsgespräch, Firmenfeier ---------- */
const OFFICE=['buero','info','bankkfm','architekt','berater','jura','lehrer'];
function colleagues(){if(!p.job||['influ','pol','sport'].includes(p.job.id))return [];if(!p.job.col){const r=rng(p.seed%9973+p.job.id.length*31+p.age);p.job.col=[0,1,2].map(i=>({n:FN.concat(MN)[Math.floor(r()*(FN.length+MN.length))],rel:50+Math.floor(r()*30)}))}return p.job.col}
function jobExtra(){if(!p.job)return '';const C=colleagues();let h='';
  if(C.length)h+='<section class="card"><h2 class="h">Dein Team</h2>'+C.map((c,i)=>'<div class="stat"><div class="r"><span>'+esc(c.n)+'</span><span>'+c.rel+' %</span></div><div class="bar"><i style="width:'+c.rel+'%"></i></div></div>').join('')+
    '<div class="btns">'+btn('colkaffee',null,'Kaffeepause mit dem Team','',p.colY===p.age||!!p.prison)+(OFFICE.includes(p.job.id)?btn('homeoffice',null,p.hoY===p.age?'Homeoffice genutzt':'Homeoffice-Tag','o',p.hoY===p.age||!!p.prison):'')+'</div>'+
    '<p class="note" style="margin-top:6px">Ein gutes Verhältnis zum Team steigert deine Leistung. '+(OFFICE.includes(p.job.id)?'Ein Homeoffice-Tag pro Jahr spart den Arbeitsweg: '+(clockOn()?'2 Stunden mehr Zeit.':'eine Aktion mehr.'):'')+'</p></section>';
  return h}
const INTERVIEW=[['Warum sollten wir gerade Sie nehmen?','Ich bringe Erfahrung mit und lerne schnell dazu.','Weil ich das Geld brauche.','Keine Ahnung, sagen Sie es mir.'],['Was ist Ihre größte Schwäche?','Ich bin manchmal zu ungeduldig, arbeite aber daran.','Ich habe keine.','Ich komme oft zu spät.'],
 ['Wo sehen Sie sich in fünf Jahren?','In einer verantwortungsvollen Rolle hier im Unternehmen.','Auf Ihrem Stuhl.','Im Urlaub.'],['Wie gehen Sie mit Stress um?','Ich plane gut und bleibe ruhig.','Ich werde laut.','Ich melde mich krank.'],
 ['Warum wollen Sie wechseln?','Ich suche eine neue Herausforderung.','Mein Chef ist ein Idiot.','Weiß nicht genau.']];
function interview(j,go){if(O.mini==='skip'||j.part)return go(0);const q=pick(INTERVIEW);
  dialog('Vorstellungsgespräch: '+j.t,q[0],shuffle([[q[1],()=>go(.15)],[q[2],()=>go(-.12)],[q[3],()=>go(-.2)]]).concat([['Ohne Gespräch (Zufall)',()=>go(0)]]))}
EVENTS.push(
 E('Firmenfeier','Die Weihnachtsfeier deiner Firma steht an. Es gibt Freigetränke.',()=>!!p.job&&!['influ','pol','sport'].includes(p.job.id)&&p.age>=18,[['Ausgelassen feiern',()=>ch(.6)?(add('gl',8),(colleagues()).forEach(c=>c.rel=Math.min(100,c.rel+8)),'Du tanzt mit der Chefin. Alle lieben dich.'):(p.job.perf-=10,add('gl',-4),'Du erzählst dem Chef, was du wirklich von ihm hältst. Ups.')],['Kurz vorbeischauen',()=>(colleagues().forEach(c=>c.rel=Math.min(100,c.rel+3)),'Höflich, freundlich, früh zu Hause.')],['Nicht hingehen',()=>(colleagues().forEach(c=>c.rel=Math.max(0,c.rel-5)),'Das Team hat dich vermisst. Ein bisschen.')]]),
 E('Ärger im Team','Ein Kollege nimmt sich immer die Lorbeeren für deine Arbeit.',()=>!!p.job&&colleagues().length>0&&p.age>=18,[['Ansprechen',()=>ch(.6)?(p.job.perf+=8,'Er entschuldigt sich. Ab jetzt läuft es fair.'):(colleagues()[0].rel=Math.max(0,colleagues()[0].rel-15),'Er streitet alles ab. Die Stimmung ist frostig.')],['Bei der Chefin melden',()=>(p.job.perf+=5,colleagues().forEach(c=>c.rel=Math.max(0,c.rel-5)),'Die Chefin weiß jetzt Bescheid. Das Team findet dich petzig.')],['Hinnehmen',()=>(add('gl',-4),'Du ärgerst dich still.')]]));

/* ---------- Hobbys ---------- */
const HOB={gitarre:['Gitarre','<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/>','in','Gitarrenunterricht geben'],kochen:['Kochen','<path d="M6 13h12v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M8 13V9a4 4 0 0 1 8 0v4"/>','ge','Catering für Feiern'],
 schach:['Schach','<path d="M9 21h6M10 17h4l1-6H9zM12 3v3M10 5h4"/>','in','Schachkurse für Kinder'],malen:['Malen','<path d="M12 3a9 9 0 1 0 0 18c1 0 2-1 1.5-2s.5-2 1.5-2h2a4 4 0 0 0 4-4 9 9 0 0 0-9-10z"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7" r="1"/>','au','Bilder verkaufen'],
 garten:['Gärtnern','<path d="M12 21V11M12 11c-4 0-6-3-6-7 4 0 6 3 6 7zM12 13c3 0 5-2 5-5-3 0-5 2-5 5z"/>','ge','Gemüse auf dem Markt verkaufen']};
const HLV=['Anfänger/in','Fortgeschritten','Gut','Sehr gut','Meister/in'];
const hlvl=k=>Math.min(5,Math.floor(((p.hob||{})[k]||0)/20)+1);
function viewHobby(lock){p.hob=p.hob||{};let h='<section class="card"><h2 class="h">Hobbys</h2><p class="note">Übung macht den Meister. Ab Stufe 2 kannst du einmal im Jahr an einem Wettbewerb teilnehmen, ab Stufe 4 verdienst du nebenbei Geld.</p></section>';
  h+=Object.keys(HOB).map(k=>{const H=HOB[k],xp=p.hob[k]||0,l=hlvl(k),prog=l>=5?100:(xp%20)/20*100;
    return '<section class="card hob"><div class="fh"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+H[1]+'</svg></span><div><b>'+H[0]+'</b><small>Stufe '+l+' · '+HLV[l-1]+(l>=4?' · '+H[3]:'')+'</small></div></div>'+
      '<div class="bar"><i style="width:'+prog+'%;background:#8E63D6"></i></div><div class="btns">'+btn('hobby',k,'Üben · '+(clockOn()?'1,5 Std.':'1 Aktion'),'o',p.act<=0||lock||p.age<6)+(l>=2?btn('hobcomp',k,p.hcY&&p.hcY[k]===p.age?'Wettbewerb erledigt':'Wettbewerb','',lock||(p.hcY&&p.hcY[k]===p.age)):'')+'</div></section>'}).join('');
  return h}
function hobbyYear(R0){if(!p.hob)return;let inc=0;Object.keys(p.hob).forEach(k=>{if(hlvl(k)>=4)inc+=Math.round(px$(R(1500,4000))*(hlvl(k)-3))});if(inc){p.money+=inc;R0.inc.push(['Hobbys: Nebeneinkünfte',inc])}}

/* ---------- Geschwister und Pflege der Eltern ---------- */
function genSibs(){const L=[];const n=ch(.55)?(ch(.3)?2:1):0;for(let i=0;i<n;i++){const g=ch(.5)?'w':'m';let nm;do{nm=pick(g==='m'?MN:FN)}while(nm===p.first||L.some(x=>x.n===nm));L.push({n:nm,g,d:pick([-6,-4,-3,-2,2,3,4,5]),rel:R(55,80),job:null,mar:false})}return L}
const sibAge=s=>p.age+s.d;
function sibYear(){(p.sibs||[]).forEach((s,i)=>{const a=sibAge(s);if(a<0)return;s.rel=clamp(s.rel-1,0,100);
  if(a>=20&&!s.job&&ch(.4))s.job=pick(['Krankenpfleger/in','Ingenieur/in','Verkäufer/in','Lehrer/in','Polizist/in','Grafiker/in','Koch/Köchin']);
  if(a>=24&&a<=40&&!s.mar&&ch(.12)){s.mar=true;p.q.push({id:'sibwed',d:i})}
  if(a>=5&&p.age>=5&&p.age<=16&&ch(.15))p.q.push({id:'sibfight',d:i});
  if(a>=22&&ch(.05))p.q.push({id:'sibhelp',d:i});if(ch(.2))msg('sib'+i,pick(['Na, Kleines/Großes?','Weißt du noch, früher?','Mama nervt mal wieder, oder?','Wann sehen wir uns?']))});
  const pa=p.age+p.pa;if(!p.parentsGone&&pa>=78&&p.age>=18){if(!p.care&&(p.careAsk==null||p.age-p.careAsk>=3)){p.careAsk=p.age;p.q.push({id:'care'})}
    if(p.care==='heim'){const c=px$(18000);p.money-=c;return c}if(p.care==='selbst'){add('gl',-3);p.rel.mama=Math.min(100,p.rel.mama+4);p.rel.papa=Math.min(100,p.rel.papa+4);addRuf(1)}}
  if(p.parentsGone&&p.care){p.care=null}
  return 0}
Object.assign(QEV,{
 sibfight:i=>{const s=(p.sibs||[])[i];if(!s)return null;return E('Streit mit '+s.n,s.n+' hat dein Lieblingsspielzeug kaputt gemacht.',()=>true,[['Petzen',()=>(s.rel-=6,'Mama schimpft mit '+s.n+'. Du grinst.')],['Verzeihen',()=>(s.rel=Math.min(100,s.rel+6),add('gl',2),'Ihr baut zusammen eine Höhle aus Decken.')],['Rache!',()=>(s.rel-=10,add('gl',3),'Seine/ihre Lieblingssocken sind jetzt rosa.')]])},
 sibwed:i=>{const s=(p.sibs||[])[i];if(!s)return null;return E('Hochzeit von '+s.n,s.n+' heiratet und will, dass du eine Rede hältst.',()=>true,[['Rede halten',()=>ch(.6+(p.sk.charme||0)/250)?(s.rel=Math.min(100,s.rel+12),add('gl',8),'Alle weinen vor Rührung.'):(s.rel-=4,'Die Geschichte von früher war vielleicht doch zu peinlich.')],['Nur feiern',()=>(s.rel=Math.min(100,s.rel+4),add('gl',5),'Ein wunderschönes Fest.')]])},
 sibhelp:i=>{const s=(p.sibs||[])[i];if(!s)return null;const a=px$(R(2,10)*1000);return E(s.n+' braucht Hilfe',s.n+' steckt in Geldnot und fragt nach '+eur(a)+'.',()=>true,[['Helfen',()=>p.money<a?'Du hast selbst nicht genug.':(p.money-=a,s.rel=Math.min(100,s.rel+15),'Ihr seid euch so nah wie lange nicht.')],['Ablehnen',()=>(s.rel-=12,s.n+' ist enttäuscht.')]])},
 care:()=>E('Deine Eltern werden alt','Mama und Papa schaffen den Alltag nicht mehr allein. Wie kümmerst du dich?',()=>!p.parentsGone,[['Selbst pflegen',()=>(p.care='selbst',add('gl',-4),addRuf(5),'Du kümmerst dich selbst. Anstrengend, aber sie sind dir unendlich dankbar.')],['Pflegeheim (18.000 € im Jahr)',()=>(p.care='heim','Ein gutes Heim mit freundlichem Personal. Du besuchst sie oft.')],
   ...((p.sibs||[]).length?[['Geschwister bitten',()=>{const s=p.sibs.reduce((a,b)=>a.rel>b.rel?a:b);if(s.rel>=55){p.care='sib';return s.n+' übernimmt die Pflege. Du hilfst, wo du kannst.'}s.rel-=10;p.care='heim';return s.n+' weigert sich. Es wird doch das Pflegeheim.'}]]:[])])});
function parentInherit(){if(p.inhDone)return;p.inhDone=true;const n=1+(p.sibs||[]).length,tot=R(4,30)*10000,share=Math.round(tot/n);p.money+=share;log('Erbe deiner Eltern: '+eur(share)+(n>1?' (geteilt mit '+(n-1)+' Geschwister)':'')+'.');
  if(n>1&&p.sibs.some(s=>s.rel<35))p.q.push({id:'erbstreit'})}
QEV.erbstreit=()=>E('Streit ums Erbe','Deine Geschwister finden, dass du zu viel geerbt hast.',()=>true,[['Etwas abgeben (10.000 €)',()=>(p.money-=10000,p.sibs.forEach(s=>s.rel=Math.min(100,s.rel+15)),'Frieden in der Familie. Unbezahlbar.')],['Hart bleiben',()=>(p.sibs.forEach(s=>s.rel=Math.max(0,s.rel-20)),'Ihr redet nicht mehr miteinander.')]]);
function sibCard(){const S=p.sibs||[];if(!S.length)return card('Geschwister','<p class="note">Du bist Einzelkind.</p>');
  return card('Geschwister',S.map((s,i)=>{const a=sibAge(s);return a<0?row(s.n,'kommt in '+(-a)+' Jahr(en) zur Welt'):'<div class="stat"><div class="r"><span>'+esc(s.n)+' <small class="note">'+a+' Jahre'+(s.job?' · '+esc(s.job):'')+(s.mar?' · verheiratet':'')+'</small></span><span>'+s.rel+' %</span></div><div class="bar"><i class="'+(s.rel<30?'low':'')+'" style="width:'+s.rel+'%"></i></div></div><div class="btns" style="margin:4px 0 8px">'+btn('call','sib'+i,'Anrufen','',p.act<=0||!!p.prison||p.age<6)+'</div>'}).join(''))+
  (!p.parentsGone&&p.age+p.pa>=78?card('Pflege der Eltern','<p class="note">'+({selbst:'Du pflegst deine Eltern selbst.',heim:'Deine Eltern leben in einem Pflegeheim ('+eur(px$(18000))+' im Jahr).',sib:'Deine Geschwister kümmern sich um die Pflege.'}[p.care]||'Noch nicht geregelt.')+'</p>'):'')}

/* ---------- Handy: Apps verschieben ---------- */
let editApps=false,swapSel=null;
function appOrder(){const ids=APPS.map(a=>a[0]);const o=(O.order||[]).filter(x=>ids.includes(x));ids.forEach(x=>{if(!o.includes(x))o.push(x)});return o}
function orderedApps(){const o=appOrder();return APPS.slice().sort((a,b)=>o.indexOf(a[0])-o.indexOf(b[0]))}

/* ---------- Erinnerungen von oben ---------- */
function notify(t,goApp,sub){let n=document.getElementById('ntf');if(!n||!n.classList)return;n.innerHTML='<span class="nic"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21h4"/></svg></span><span class="nt"><small>Erinnerung · jetzt</small><b>'+esc(t)+'</b></span>';
  n.dataset.g=goApp||'';n.dataset.s=sub||'';n.classList.add('show');sfx('msg');vib(30);clearTimeout(notify.t);notify.t=setTimeout(()=>n.classList.remove('show'),5200)}
function reminders(){const L=[],a=p.age;
  if(a>=10&&p.st.ge<60&&(p.lastArzt==null||a-p.lastArzt>=2))L.push(['arzt','Du warst lange nicht beim Arzt. Ein Check-up tut dir gut.','freizeit','gesund']);
  if(a>=10&&(p.lastSport==null||a-p.lastSport>=2))L.push(['sport','Zeit für Sport! Dein Körper wird es dir danken.','freizeit','sport']);
  const ob=people().filter(([id])=>p.grat[id]!==a);if(a>=10&&ob.length)L.push(['bd','Geburtstag: '+ob[0][1]+'. Nicht vergessen zu gratulieren!','kalender']);
  const t=(p.terms||[]).find(x=>!x.done);if(t&&TERM[t.k])L.push(['term','Termin im Kalender: '+TERM[t.k][0]+'.','kalender']);
  if(p.money<0)L.push(['geld','Dein Konto ist im Minus. Schau mal in die Bank-App.','bank']);
  if(p.st.gl<30)L.push(['gl','Du wirkst niedergeschlagen. Unternimm etwas Schönes!','freizeit','aktiv']);
  return L.filter(r=>!(p.remS&&p.remS[r[0]]===a))}
function maybeRemind(){if(!p||!p.alive||tab!=='home'||document.getElementById('modal').classList.contains('on'))return;if(O.rem===false)return;p.remS=p.remS||{};
  const n=Object.values(p.remS).filter(v=>v===p.age).length;if(n>=2)return;const now=Date.now();if(maybeRemind.t&&now-maybeRemind.t<25000)return;const r=reminders()[0];if(!r)return;maybeRemind.t=now;p.remS[r[0]]=p.age;setTimeout(()=>notify(r[1],r[2],r[3]),900)}

/* ---------- Abschlussprüfungen ---------- */
const EXQ={
 schule:[['Was ist 3/4 von 80?','60','40','75'],['Welches Wort ist ein Verb?','laufen','schnell','Haus'],['Wie heißt die Hauptstadt von Frankreich?','Paris','Lyon','Marseille'],['Was ist 12 × 12?','144','124','132'],['Was ist das Gegenteil von „mutig“?','feige','stark','laut'],['Wie viele Grad hat ein rechter Winkel?','90','45','180'],['Welches Gas brauchen wir zum Atmen?','Sauerstoff','Helium','Stickstoff'],['„I go“ in der Vergangenheit heißt …','I went','I goed','I gone']],
 abitur:[['Was ist die Ableitung von x²?','2x','x','2x²'],['Wer schrieb „Die Leiden des jungen Werthers“?','Goethe','Schiller','Fontane'],['Was bedeutet DNA?','Desoxyribonukleinsäure','Daten-Netz-Analyse','Doppel-Nukleo-Amin'],['In welchem Jahr endete der Zweite Weltkrieg?','1945','1939','1949'],['Was ist die Hauptstadt von Kanada?','Ottawa','Toronto','Montreal'],['Welches Organ produziert Insulin?','Bauchspeicheldrüse','Leber','Niere'],['Was ist log₁₀(1000)?','3','10','100'],['Was beschreibt die Gewaltenteilung?','Legislative, Exekutive, Judikative','Bund, Land, Kommune','Polizei, Armee, Gericht']],
 aus:[['Was gehört auf eine Rechnung?','Umsatzsteuer und Datum','Lieblingsfarbe','Wetterbericht'],['Wie lange dauert die Probezeit in der Ausbildung höchstens?','4 Monate','1 Jahr','2 Wochen'],['Wer ist für Arbeitsschutz verantwortlich?','Der Arbeitgeber','Nur die Azubis','Die Kundschaft'],['Was ist Brutto?','Lohn vor Abzügen','Lohn nach Abzügen','Trinkgeld'],['Was macht ein Betriebsrat?','Vertritt die Beschäftigten','Leitet die Firma','Prüft die Steuern'],['Was ist ein Skonto?','Rabatt bei schneller Zahlung','Eine Mahnung','Ein Kredit']],
 Informatik:[['Was ist ein Algorithmus?','Eine Schritt-für-Schritt-Anleitung','Ein Computervirus','Eine Programmiersprache'],['Wie viele Bits hat ein Byte?','8','4','16'],['Was bedeutet „Bug“?','Ein Programmfehler','Ein schneller Prozessor','Ein Kabel'],['Welche Zahl ist 1010 im Binärsystem?','10','12','8'],['Was speichert eine Datenbank?','Daten in Tabellen','Strom','Nur Bilder'],['Was ist HTML?','Auszeichnungssprache für Webseiten','Ein Betriebssystem','Ein Virenscanner']],
 Lehramt:[['Was ist Didaktik?','Die Lehre vom Unterrichten','Ein Schulfach','Ein Notensystem'],['Was hilft bei Lärm in der Klasse am meisten?','Klare Regeln und Rituale','Lauter schreien','Alle nach Hause schicken'],['Was bedeutet Inklusion?','Gemeinsames Lernen aller Kinder','Nachsitzen','Frontalunterricht'],['Wer entwickelte die Montessori-Pädagogik?','Maria Montessori','Rudolf Steiner','Jean Piaget'],['Was ist eine Lernzielkontrolle?','Ein Test, ob Ziele erreicht wurden','Ein Elterngespräch','Ein Ausflug']],
 Architektur:[['Was ist ein Grundriss?','Waagerechter Schnitt durch ein Gebäude','Die Fassade','Ein Dachtyp'],['Welcher Baustoff ist am druckfestesten?','Beton','Holz','Glas'],['Was ist der Bauhaus-Stil bekannt für?','Schlichte, funktionale Formen','Viele Verzierungen','Fachwerk'],['Was bedeutet Maßstab 1:100?','1 cm sind 1 m','1 m sind 1 cm','1 cm sind 100 m'],['Wofür steht Statik?','Lehre vom Gleichgewicht der Kräfte','Elektrik','Farbenlehre']],
 Jura:[['Ab wann ist man in Deutschland voll geschäftsfähig?','Mit 18','Mit 16','Mit 21'],['Was regelt das BGB?','Bürgerliches Recht','Strafrecht','Verkehrsregeln'],['Was ist ein Vertrag?','Zwei übereinstimmende Willenserklärungen','Eine Rechnung','Ein Urteil'],['Wer ist das höchste deutsche Gericht?','Bundesverfassungsgericht','Amtsgericht','Landgericht'],['Was bedeutet „in dubio pro reo“?','Im Zweifel für den Angeklagten','Gleiches Recht für alle','Strafe muss sein']],
 Medizin:[['Wie viele Kammern hat das Herz?','4','2','3'],['Welche Blutgruppe ist Universalspender?','0 negativ','AB positiv','A positiv'],['Was misst der Blutdruck?','Druck in den Arterien','Zucker im Blut','Puls in der Lunge'],['Wo sitzt das Kleinhirn?','Hinterkopf','Stirn','Hals'],['Was hilft bei Herzstillstand zuerst?','Herzdruckmassage','Wasser trinken','Hochlegen der Beine'],['Welches Vitamin bildet die Haut mit Sonnenlicht?','Vitamin D','Vitamin C','Vitamin A']],
 BWL:[['Was ist Umsatz?','Verkaufserlöse','Gewinn nach Steuern','Kosten'],['Was ist eine Bilanz?','Gegenüberstellung von Vermögen und Kapital','Ein Werbeplan','Eine Steuererklärung'],['Was bedeutet Marketing-Mix (4P)?','Product, Price, Place, Promotion','Plan, Profit, People, Power','Preis, Personal, Post, Planung'],['Was ist ein Break-even-Point?','Ab hier macht man Gewinn','Die Insolvenz','Der höchste Umsatz'],['Was ist Liquidität?','Zahlungsfähigkeit','Beliebtheit','Lagerbestand']]};
function examYear(){const now={edu:p.edu,aus:!!p.aus,deg:p.deg};const pv=p.exPrev;p.exPrev=now;if(!pv)return;
  if(now.edu!==pv.edu&&now.edu&&now.edu!=='keine')p.q.unshift({id:'exam5',d:now.edu==='Abitur'?'abitur':'schule'});
  if(now.aus&&!pv.aus)p.q.unshift({id:'exam5',d:'aus'});if(now.deg&&now.deg!==pv.deg)p.q.unshift({id:'exam5',d:now.deg})}
const EXN={schule:'Schulabschluss',abitur:'Abitur',aus:'Ausbildung'};
QEV.exam5=k=>E('Abschlussprüfung: '+(EXN[k]||'Studium '+k),'Fünf Fragen entscheiden über deine Abschlussnote. Bereit?',()=>true,[['Prüfung starten',()=>{setTimeout(()=>finalExam(k),40);return 'Stift raus, Handy weg. Los geht es!'}],['Einfach durchmogeln',()=>{let s=0;for(let i=0;i<5;i++)if(ch(.35+p.st.in/200))s++;examResult(k,s,true);return 'Du hast die Prüfung irgendwie hinter dich gebracht ('+s+' von 5).'}]]);
function finalExam(k){const B=(EXQ[k]||QZ).slice();shuffle(B);const qs=B.slice(0,5);let i=0,s=0;
  const step=()=>{if(i>=5){examResult(k,s,false);const n=examNote(s);save();render();dialog('Prüfung bestanden'+(s>=4?'!':''),s+' von 5 richtig. Deine Note: '+fmtN(n)+'.',[['Super',null]]);if(s>=4)sfx('win');return}
    const q=qs[i];i++;dialog('Frage '+i+' von 5',q[0],shuffle([[q[1],()=>{s++;sfx('coin');step()}],[q[2],()=>{sfx('bad');step()}],[q[3],()=>{sfx('bad');step()}]]))};step()}
const examNote=s=>[4.3,3.7,3.0,2.3,1.7,1.0][s];
function examResult(k,s,auto){const n=examNote(s);p.exN=p.exN||{};p.exN[k]=n;add('in',s);add('gl',(s-2)*2);mile((EXN[k]||'Studium '+k)+': Note '+fmtN(n),'star');log('Abschlussprüfung '+(EXN[k]||k)+(auto?' (durchgemogelt)':'')+': '+s+' von 5 richtig, Note '+fmtN(n)+'.');
  if(s===5&&!p.parentsGone)msg('mama','Eine 1,0?! Ich sag es der ganzen Familie!');if(k===p.deg)p.dnote=n}

/* ---------- Stadt: anklickbare Ereignisse ---------- */
const CEV={katze:['Katze im Baum','Eine Katze sitzt fest. Schaffst du es hoch?','<path d="M5 20c0-6 3-9 7-9s7 3 7 9"/><path d="M8 11L6 5l4 3h4l4-3-2 6"/>'],tourist:['Tourist sucht den Weg','Ein Paar aus Japan sucht das Museum.','<circle cx="12" cy="10" r="3"/><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/>'],
 geld:['Geldschein auf dem Boden','Da liegt ein Schein im Rinnstein.','<rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="12" cy="12" r="2"/>'],dieb:['Taschendieb!','Jemand reißt einer Frau die Tasche weg!','<path d="M6 8h12l-1 12H7z"/><path d="M9 8a3 3 0 0 1 6 0"/>'],
 flash:['Flashmob','Auf dem Marktplatz tanzen plötzlich hundert Leute.','<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/>'],markt:['Glücksrad am Markt','Einmal drehen kostet nichts.','<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>'],
 umfrage:['Straßenumfrage','Das Lokalfernsehen stellt eine Quizfrage.','<rect x="3" y="6" width="14" height="12" rx="2"/><path d="M17 10l4-2v8l-4-2"/>'],unfall:['Fahrradunfall','Ein Radfahrer ist gestürzt und blutet am Knie.','<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-7h5l3 7"/>'],
 verfolgung:['Verfolgungsjagd','Ein Verdächtiger rennt davon. Du bist im Dienst!','<path d="M13 4l-3 7h4l-3 9"/>'],notfall:['Medizinischer Notfall','Jemand bricht auf der Straße zusammen.','<path d="M12 5v14M5 12h14"/>'],foodtruck:['Foodtruck-Ansturm','Dein Foodtruck-Stand: Die Schlange ist riesig!','<rect x="2" y="7" width="15" height="10" rx="2"/><path d="M17 10h3l2 3v4h-5"/>'],
 lieferung:['Eilige Lieferung','Ein Paket muss sofort an die richtige Adresse.','<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/>'],schueler:['Schüler/in in der Stadt','Ein Kind aus deiner Klasse fragt dich etwas.','<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c2 2 10 2 12 0v-5"/>'],fans:['Fans erkennen dich!','„Bist du nicht …?“ Eine Gruppe will ein Selfie.','<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>'],
 panne:['Autopanne','Ein Auto steht mit Warnblinker am Rand.','<path d="M3 13l2-5h14l2 5v5H3z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>'],buerger:['Bürgergespräch','Leute erkennen dich und haben Fragen zur Politik.','<path d="M4 21h16M6 21V10M18 21V10M3 10l9-6 9 6z"/>']};
const JOBCEV={polizei:'verfolgung',arzt:'notfall',pflege:'notfall',koch:'foodtruck',kellner:'foodtruck',cafe:'foodtruck',paket:'lieferung',zeitung:'lieferung',lager:'lieferung',lehrer:'schueler',influ:'fans',mecha:'panne',pol:'buerger'};
function cityEvents(){if(p.cevY!==p.age){p.cevY=p.age;const g=shuffle(['katze','tourist','geld','dieb','flash','markt','umfrage','unfall']).slice(0,3);const j=p.job&&JOBCEV[p.job.id];if(j)g.push(j);else if(p.sm&&p.sm.fol>=20000)g.push('fans');
    p.cev=g.map(k=>({k,x:R(8,82),y:R(22,68)}))}return p.age>=6?p.cev||[]:[]}
function cevStrip(){const L=cityEvents();if(!L.length)return '';return '<section class="card cevs"><div class="lbl">GERADE IN DER STADT</div><div class="cevl">'+L.map((e,i)=>'<button class="cevb" data-a="cityev" data-g="'+i+'"'+(p.prison?' disabled':'')+'><span class="cevi"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+CEV[e.k][2]+'</svg></span><b>'+CEV[e.k][0]+'</b></button>').join('')+'</div><p class="note">Kostet keine Aktion, nur etwas Zeit. Auf der Karte pulsieren die Orte.</p></section>'}
function cevMarkers(){const el=document.getElementById('cev');if(!el)return;el.innerHTML=tab==='stadt'&&!p.prison?cityEvents().map((e,i)=>'<button class="cevm" data-a="cityev" data-g="'+i+'" style="left:'+e.x+'%;top:'+e.y+'%" aria-label="'+CEV[e.k][0]+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+CEV[e.k][2]+'</svg></button>').join(''):''}
function runCityEv(i){const L=p.cev||[],e=L[i];if(!e||p.prison)return;if(!spendTime(30))return;L.splice(i,1);const k=e.k,T=CEV[k][0];
  const fin=t=>{log(T+': '+t);checkAch();save();render();dialog(T,t,[['Weiter',null]])};
  const ques=(bankArr,ok,bad)=>{const q=pick(bankArr);dialog(T,q[0],shuffle([[q[1],()=>{sfx('coin');fin(ok())}],[q[2],()=>{sfx('bad');fin(bad())}],[q[3],()=>{sfx('bad');fin(bad())}]]))};
  switch(k){
  case 'katze':return mgStart('reakt',1,T,s=>fin(s?(add('gl',5),addRuf(2),'Du kletterst hoch und rettest die Katze. Die Besitzerin umarmt dich.'):(add('ge',-2),'Du rutschst ab. Die Feuerwehr erledigt das. Die Katze guckt dich spöttisch an.')),p.sk.form);
  case 'tourist':return dialog(T,CEV[k][1],[['Hinbringen',()=>{p.money+=10;addRuf(2);add('gl',3);fin('Sie bedanken sich überschwänglich und schenken dir 10 € und ein Foto.')}],['Den Weg erklären',()=>fin(ch(.6)?'Sie finden es. Hoffentlich.':'Du hast „links“ gesagt und „rechts“ gemeint. Ups.')],['Weitergehen',()=>fin('Du hast es eilig.')]]);
  case 'geld':{const v=pick([5,10,20,50]);return dialog(T,'Es sind '+v+' €. Was tust du?',[['Einstecken',()=>{p.money+=v;addRuf(-1);fin('Glückstag! '+v+' € mehr.')}],['Zum Fundbüro',()=>{addRuf(2);fin('Das Fundbüro bedankt sich. Ehrlichkeit zahlt sich aus. Irgendwann.')}]])}
  case 'dieb':return mgStart('reakt',2,T,s=>fin(s>=2?(addRuf(8),p.money+=100,add('gl',6),news(p.first+' '+p.last+' stoppt Taschendieb','lokal'),'Du stellst ihm ein Bein! Die Frau gibt dir 100 € Finderlohn.'):s?(addRuf(3),'Du erwischst die Tasche, der Dieb entkommt.'):'Zu langsam. Der Dieb ist weg.'),p.sk.form);
  case 'flash':return dialog(T,CEV[k][1],[['Mittanzen',()=>{add('gl',6);if(p.sm)smGain(R(100,1500));fin('Du tanzt mit. Irgendwer filmt alles, und du bist im Video.')}],['Zuschauen',()=>{add('gl',2);fin('Beeindruckend!')}]]);
  case 'markt':{const w=pick([0,0,5,10,25,50,200]);p.money+=w;return fin(w?'Das Rad bleibt bei '+w+' € stehen!':'Niete. Aber ein Lolli zum Trost.')}
  case 'umfrage':return ques(QZ,()=>{p.money+=50;add('gl',4);return 'Richtig! 50 € und du bist heute Abend im Fernsehen.'},()=>{add('gl',-2);return 'Falsch. Und das im Fernsehen …'});
  case 'unfall':return ques(DG.concat([['Ein Knie blutet stark.','Druckverband anlegen','Pusten','Nichts tun']]),()=>{addRuf(5);add('gl',3);return 'Du hilfst richtig. Der Radfahrer bedankt sich.'},()=>'Der Krankenwagen übernimmt. Gut, dass er schnell da war.');
  case 'verfolgung':return mgStart('reakt',3,T,s=>fin(s>=2?(p.job&&(p.job.perf=Math.min(100,p.job.perf+12)),addRuf(4),news('Polizist/in '+p.last+' fasst Flüchtigen','lokal'),'Festnahme! Dein Revier ist stolz.'):'Er entwischt um die Ecke. Beim nächsten Mal.'),p.sk.form);
  case 'notfall':return ques(DG,()=>{if(p.job)p.job.perf=Math.min(100,p.job.perf+10);addRuf(6);return 'Deine Erstversorgung rettet ein Leben!'},()=>'Die Notärztin übernimmt. Du warst nah dran.');
  case 'foodtruck':return mgStart('wechsel',3,T,s=>{const v=s*80;p.money+=v;fin(s+' von 3 Kunden richtig bedient: '+eur(v)+' Trinkgeld.')});
  case 'lieferung':return mgStart('sort',2,T,s=>{const v=s*40;p.money+=v;if(p.job)p.job.perf=Math.min(100,p.job.perf+s*4);fin(s?'Pünktlich zugestellt: '+eur(v)+' Bonus.':'Falsche Adresse. Der Kunde ist sauer.')});
  case 'schueler':return ques(QZ,()=>{addRuf(3);return 'Du erklärst es super. Das Kind strahlt.'},()=>'Du musst passen. Peinlich als Lehrkraft.');
  case 'fans':return dialog(T,CEV[k][1],[['Selfie machen',()=>{smGain(R(300,3000));add('gl',5);fin('Das Selfie geht durch Klick. Neue Follower!')}],['Weitergehen',()=>fin('Du bist inkognito unterwegs.')]]);
  case 'panne':return ques(AU,()=>{p.money+=150;return 'Problem erkannt und behoben. 150 € auf die Hand.'},()=>'Du findest den Fehler nicht. Der Pannendienst kommt.');
  case 'buerger':return dialog(T,CEV[k][1],[['Zuhören und antworten',()=>{if(p.pol)p.pol.pop=Math.min(100,p.pol.pop+4);addRuf(2);fin('Die Leute fühlen sich ernst genommen. Beliebtheit +4.')}],['Keine Zeit',()=>{if(p.pol)p.pol.pop=Math.max(0,p.pol.pop-2);fin('„Typisch Politik“, murmelt jemand.')}]]);
  }}

/* ---------- Aktionen ---------- */
function act10(id,arg){const lock=!!p.prison;switch(id){
  case 'reply':{const [cid,k]=arg.split(':');const C=p.chats[cid];if(!C||!C.pend)return 1;msg(cid,pick(REPLY[k]),true);C.pend=false;relUp(cid,k==='lieb'?5:k==='kurz'?1:-6);if(k==='frech'&&cid==='rival')addRuf(-1);render();return 1}
  case 'greply':{const C=p.chats[arg];if(!C)return 1;msg(arg,pick(['Haha, genau!','Bin dabei!','Wer bringt was mit?','Ich auch!']),true);C.pend=false;add('gl',1);if(arg==='g_job')colleagues().forEach(c=>c.rel=Math.min(100,c.rel+2));render();return 1}
  case 'invyes':{const C=p.chats[arg];if(!C||!C.inv||lock)return 1;CUR='meet';if(!useAct())return 1;const t=C.inv.t;C.inv=null;relUp(arg,10);add('gl',R(4,8));if(arg==='g_job')colleagues().forEach(c=>c.rel=Math.min(100,c.rel+6));msg(arg,'Bin dabei!',true);done('Zugesagt: '+t+' Es wurde ein richtig schöner Abend.');return 1}
  case 'invno':{const C=p.chats[arg];if(!C||!C.inv)return 1;C.inv=null;relUp(arg,-4);msg(arg,'Sorry, heute kann ich nicht.',true);render();return 1}
  case 'colkaffee':{if(p.colY===p.age||lock)return 1;if(!spendTime(30))return 1;p.colY=p.age;colleagues().forEach(c=>c.rel=Math.min(100,c.rel+R(4,9)));if(p.job)p.job.perf=Math.min(100,p.job.perf+3);done('Kaffee, Klatsch und Kekse. Das Team mag dich.');return 1}
  case 'homeoffice':{if(p.hoY===p.age||lock||!p.job)return 1;p.hoY=p.age;if(clockOn())p.clock=Math.max(DAYSTART,p.clock-120);else if(!unl())p.act++;if(p.act<=0)p.act=1;done('Homeoffice-Tag: Jogginghose, kein Stau. '+(clockOn()?'Du gewinnst 2 Stunden.':'Eine Aktion mehr.'));return 1}
  case 'hobby':{const H=HOB[arg];if(!H||lock||p.age<6)return 1;CUR='hobby';if(!useAct())return 1;p.hob=p.hob||{};const l0=hlvl(arg);p.hob[arg]=Math.min(100,(p.hob[arg]||0)+R(6,12)+Math.round(p.st.in/25));add('gl',R(2,4));add(H[2],1);const l1=hlvl(arg);
    if(l1>l0){mile(H[0]+': '+HLV[l1-1],'star');sfx('win')}done(H[0]+' geübt.'+(l1>l0?' Neue Stufe: '+HLV[l1-1]+'!':''));return 1}
  case 'hobcomp':{const H=HOB[arg];if(!H||lock)return 1;p.hcY=p.hcY||{};if(p.hcY[arg]===p.age)return 1;if(!spendTime(120))return 1;p.hcY[arg]=p.age;const l=hlvl(arg),place=clamp(6-l-R(0,2)+R(0,2),1,8);
    if(place<=3){const w=[0,1000,400,150][place]*(l>=4?3:1);p.money+=w;add('gl',8);if(place===1){mile('Wettbewerb gewonnen: '+H[0],'star');news(p.first+' '+p.last+' gewinnt '+H[0]+'-Wettbewerb','lokal')}done('Wettbewerb '+H[0]+': Platz '+place+'! '+eur(w)+' Preisgeld.')}else done('Wettbewerb '+H[0]+': Platz '+place+'. Dabei sein ist alles.');return 1}
  case 'appedit':editApps=!editApps;swapSel=null;render();return 1;
  case 'appswap':{if(!editApps)return 1;if(swapSel==null){swapSel=arg;render();return 1}if(swapSel===arg){swapSel=null;render();return 1}const o=appOrder(),a=o.indexOf(swapSel),b=o.indexOf(arg);if(a>=0&&b>=0){o[a]=arg;o[b]=swapSel}O.order=o;saveO();swapSel=null;sfx('tap');render();return 1}
  case 'appreset':O.order=null;saveO();swapSel=null;render();return 1;
  case 'cityev':runCityEv(+arg);return 1;
  case 'remgo':return 1;
  }return 0}
document.addEventListener('click',e=>{const n=e.target.closest&&e.target.closest('#ntf');if(!n||!p||!p.alive)return;n.classList.remove('show');const g=n.dataset.g;if(!g)return;if(g==='freizeit'&&n.dataset.s)fTab=n.dataset.s;tab=g;if(p.appSeen)p.appSeen[g]=1;render();window.scrollTo(0,0)});
DUR.hobby=90;
['sport','jog'].forEach(k=>{const f0=ACTS[k].f;ACTS[k].f=()=>{p.lastSport=p.age;return f0()}});
{const f0=ACTS.arzt.f;ACTS.arzt.f=()=>{p.lastArzt=p.age;return f0()}}
APPTIP.stadt='Deine Stadt lebt: Pulsierende Punkte auf der Karte und die Liste „Gerade in der Stadt“ zeigen, wo etwas los ist. Tippe drauf! Je nach Job passiert Besonderes.';
