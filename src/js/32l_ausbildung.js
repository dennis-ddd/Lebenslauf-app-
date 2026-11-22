/* ================= Was dir deine Ausbildung im Leben bringt ================= */
const hasDeg=k=>p&&p.deg===k;
function tradeOK(id){return !!p&&((p.job&&p.job.id===id)||((p.jobYrs||{})[id]||0)>=2)}
const juraOK=()=>hasDeg('Jura')||tradeOK('jura');
const PERKS=[
 ['Jura','Jura',juraOK,['Vor Gericht ziehen ohne Anwaltskosten, mit besseren Chancen','Im Gerichts-Minispiel bleiben nur zwei Antworten übrig','Bei einer Anzeige kannst du dich selbst verteidigen'],'Studium Jura oder Beruf Anwalt/Anwältin'],
 ['Medizin','Medizin',()=>hasDeg('Medizin'),['+2 Gesundheits-Punkte: Arzttermine werden schneller kostenlos','Notfälle in der Nachbarschaft: Du kannst Leben retten','Du merkst früher, wenn jemand in der Familie krank ist'],'Studium Medizin'],
 ['Informatik','Informatik',()=>hasDeg('Informatik'),['Eigene App programmieren: bringt jedes Jahr Geld','Hackerangriffe auf deine Geschäfte wehrst du selbst ab','Bessere Chancen beim Hacken'],'Studium Informatik'],
 ['Architektur','Architektur',()=>hasDeg('Architektur'),['Ausbauten an Immobilien 25 % günstiger','Baustellen sind ein Jahr schneller fertig'],'Studium Architektur'],
 ['Lehramt','Lehramt',()=>hasDeg('Lehramt'),['Deine Kinder lernen besser: Intelligenz jedes Jahr höher','Nachhilfe geben: Geld ohne Aktion, nur Zeit','Ehemalige Schüler erinnern sich an dich'],'Studium Lehramt'],
 ['mecha','Mechatronik',()=>tradeOK('mecha'),['Alte Autos herrichten und mit Gewinn verkaufen','Pannen reparierst du selbst, kostenlos','Autowerkstatt als Geschäft läuft 15 % besser'],'2 Jahre als Mechatroniker/in'],
 ['koch','Koch/Köchin',()=>tradeOK('koch'),['+2 Gesundheits-Punkte, weil du gesund kochst','Beim Grillfest der Nachbarn bist du der Star','Pizzeria und Kaffeerösterei laufen 15 % besser'],'2 Jahre als Koch/Köchin'],
 ['pflege','Pflege',()=>tradeOK('pflege'),['Eltern selbst pflegen macht dich nicht unglücklich','Ältere Nachbarn mögen dich jedes Jahr mehr','+1 Gesundheits-Punkt'],'2 Jahre als Pflegefachkraft'],
 ['friseur','Friseur/in',()=>tradeOK('friseur'),['Freunden die Haare schneiden: Beziehung und Aussehen +, keine Aktion'],'2 Jahre als Friseur/in'],
 ['bankkfm','Bankkaufmann/-frau',()=>tradeOK('bankkfm'),['Kredite 1 Prozentpunkt günstiger','Betrügerische Briefe und Angebote erkennst du sofort'],'2 Jahre als Bankkaufmann/-frau'],
 ['buero','Bürokaufmann/-frau',()=>tradeOK('buero'),['Steuererklärung selbst machen: 8 % der Steuern zurück','Nebenkosten-Abrechnungen prüfst du selbst, kostenlos'],'2 Jahre als Bürokaufmann/-frau'],
 ['polizei','Polizei',()=>tradeOK('polizei'),['Nachbarn zeigen dich viel seltener an','Aber: Krumme Dinge können dich den Job kosten'],'2 Jahre als Polizist/in'],
 ['pilot','Pilot/in',()=>tradeOK('pilot'),['Urlaub und Weltreise zum halben Preis','Seltene Notlandungen als Ereignis'],'2 Jahre als Pilot/in']];
const perk=k=>{const P=PERKS.find(x=>x[0]===k);return !!(P&&P[2]())};

/* ---------- Gerichts-Minispiel ---------- */
const COURTQ=[['Welches Beweismittel legst du vor?','Ein Protokoll mit Datum und Uhrzeit','Ein Foto von deinem Hund','Dein Bauchgefühl'],
 ['Die Richterin fragt nach Zeugen. Wen nennst du?','Leute, die es selbst erlebt haben','Deine Mama, die nicht dabei war','Niemanden, das muss reichen'],
 ['Ab wann gilt meistens Nachtruhe?','22 Uhr','18 Uhr','1 Uhr'],
 ['Die Gegenseite wird laut. Was tust du?','Ruhig und sachlich antworten','Zurückbrüllen','Den Saal verlassen'],
 ['Wie heißt eine Einigung ohne Urteil?','Vergleich','Freispruch','Verwarnung'],
 ['Was gehört in eine gute Klageschrift?','Was passiert ist und was du forderst','Wie unsympathisch die Gegenseite ist','Nur deine Telefonnummer'],
 ['Wer muss im Zivilprozess seine Behauptung beweisen?','Wer etwas fordert','Immer das Gericht','Niemand'],
 ['Um wie viel darf die Miete in drei Jahren meist höchstens steigen?','20 %','50 %','100 %'],
 ['Was sagst du zur Richterin?','Frau Vorsitzende','Hey du','Euer Ehren, Baby']];
function court(c){const jura=juraOK(),fee=jura?0:px$(3000);
  if(!jura&&p.money<fee){toast('Ein Anwalt kostet '+eur(fee)+'. Das hast du gerade nicht.');return}
  p.money-=fee;const Q=COURTQ.slice().sort(()=>Math.random()-.5).slice(0,3);let sc=0,strat='beweis';
  const ask=i=>{if(i>=Q.length)return end();const q=Q[i];let o=[[q[1],1],[q[2],0],[q[3],0]];if(jura)o=[o[0],o[1+R(0,1)]];o.sort(()=>Math.random()-.5);
    dialog('⚖ Frage '+(i+1)+' von 3',q[0],o.map(x=>[x[0],()=>{if(x[1])sc++;setTimeout(()=>ask(i+1),60)}]))};
  const end=()=>{const pr=clamp(c.base+sc*.14+(jura?.15:0)+(strat==='hart'?.05:0)-(strat==='hart'&&sc<2?.15:0),.05,.95);
    let r;if(strat==='vergleich')r='settle';else if(ch(pr))r='win';else r=sc>=2&&strat!=='hart'?'settle':'lose';
    const txt=r==='win'?c.win():r==='settle'?c.settle():c.lose();
    if(r==='win'&&p.job&&p.job.id==='jura'){p.job.perf=Math.min(100,(p.job.perf||50)+6);if(ch(.4))news(p.first+' '+p.last+' gewinnt Prozess gegen '+c.opp,'lokal')}
    const res=txt+(fee?' Anwalt: '+eur(fee)+'.':' Du hast dich selbst vertreten.');log('Gericht: '+res);save();render();dialog(r==='win'?'⚖ Gewonnen!':r==='settle'?'⚖ Vergleich':'⚖ Verloren',res,[['OK',null]])};
  dialog('⚖ Vor Gericht: '+c.t,(jura?'Du vertrittst dich selbst. ':'Dein Anwalt kostet '+eur(fee)+'. ')+'Gegen '+c.opp+'. Wie gehst du vor?',[
    ['Beweise sammeln',()=>{strat='beweis';setTimeout(()=>ask(0),60)}],['Hart auftreten',()=>{strat='hart';setTimeout(()=>ask(0),60)}],['Auf einen Vergleich setzen',()=>{strat='vergleich';setTimeout(end,60)}]])}
const courtOpt=(label,c)=>['⚖ '+label+(juraOK()?' (selbst)':' (Anwalt)'),()=>{setTimeout(()=>court(c),60);return juraOK()?'Du setzt die Klageschrift selbst auf.':'Du nimmst dir einen Anwalt.'}];
const nbCourt=(o,i)=>courtOpt('Vor Gericht ziehen',{t:'Nachbarschaftsstreit',opp:o.n,base:.35,
  win:()=>{const v=px$(R(5,20)*100);p.money+=v;o.rel=0;remember(o,'Hat mich verklagt',-3);if(ch(.5)){const n=o.n;p.nb[i]=mkNb();return n+' muss '+eur(v)+' zahlen und zieht kurz darauf aus. Neu nebenan: '+p.nb[i].n+'.'}return o.n+' muss '+eur(v)+' zahlen. Im Haus ist es jetzt still. Sehr still.'},
  settle:()=>{o.rel=clamp(o.rel-10,0,100);remember(o,'Wir haben uns vor Gericht geeinigt',-1);return 'Ihr einigt euch: Ruhe ab 22 Uhr, Fahrrad in den Keller. Freunde werdet ihr nicht.'},
  lose:()=>{const v=px$(1500);p.money-=v;o.rel=clamp(o.rel-25,0,100);remember(o,'Hat mich verklagt und verloren',-3);return 'Das Gericht sieht keinen Verstoß. Du zahlst '+eur(v)+' Gerichtskosten.'}});
const addOpt=(k,f)=>{const o=QEV[k];QEV[k]=d=>{const e=o(d);if(e){const x=f(d,e);if(x)e.o.push(x)}return e}};
addOpt('nblaerm',i=>nbCourt(p.nb[i],i));addOpt('nbregel',i=>nbCourt(p.nb[i],i));
addOpt('mieterh',(d,e)=>{const m=e.x.match(/um ([\d.]+)\s?€/);const x=m?+m[1].replace(/\./g,''):px$(300);return courtOpt('Gegen die Erhöhung klagen',{t:'Mieterhöhung',opp:'deinen Vermieter',base:.4,
  win:()=>'Die Erhöhung ist unwirksam. Die Miete bleibt, wie sie ist.',settle:()=>(p.rentX=(p.rentX||0)+Math.round(x/2),'Ihr trefft euch in der Mitte: nur die halbe Erhöhung.'),lose:()=>(p.rentX=(p.rentX||0)+x,p.money-=px$(900),'Die Erhöhung war rechtens. Dazu kommen Gerichtskosten.')})});
addOpt('nbanzeige',i=>juraOK()?courtOpt('Selbst verteidigen',{t:'Strafverfahren',opp:'die Staatsanwaltschaft',base:.3,
  win:()=>(p.wanted=Math.max(0,p.wanted-1),'Verfahren eingestellt. Die Staatsanwältin nickt dir anerkennend zu.'),settle:()=>(p.money-=px$(3000),'Einstellung gegen Geldauflage: '+eur(px$(3000))+'.'),lose:()=>(toJail(1,'Verurteilt.'),'Deine Verteidigung hat nicht gereicht.')}):null);
{const o=QEV.nebenk;QEV.nebenk=()=>{const e=o();if(e&&perk('buero')){const m=e.x.match(/([\d.]+)\s?€/),x=m?+m[1].replace(/\./g,''):0;e.o[1]=['★ Selbst prüfen (Bürokauffrau/-mann)',()=>{if(ch(.75)){p.money-=Math.round(x/2);return 'Du findest zwei Fehler. Du zahlst nur die Hälfte.'}p.money-=x;return 'Alles korrekt, leider.'}]}return e}}
{const o=QEV.nbgrill;QEV.nbgrill=i=>{const e=o(i);if(e&&perk('koch')){const n=p.nb[i];e.o.unshift(['★ Am Grill übernehmen (Koch/Köchin)',()=>(n.rel=clamp(n.rel+18,0,100),add('gl',7),remember(n,'Hat für alle gegrillt. Unglaublich lecker!',2),'Alle wollen dein Rezept. Du bist der Star des Abends.')])}return e}}

/* ---------- Gesundheit, Kosten, Immobilien ---------- */
{const _hp=hParts;hParts=()=>{const L=_hp();if(perk('Medizin'))L.push(['Medizinwissen',2]);if(perk('koch'))L.push(['Du kochst gesund',2]);if(perk('pflege'))L.push(['Pflegewissen',1]);return L}}
const archF=()=>perk('Architektur')?.75:1;
const archT=y=>perk('Architektur')?Math.max(1,y-1):y;
{const _bm=bizMul;bizMul=k=>_bm(k)*((perk('koch')&&(k==='pizza'||k==='kaffee'))||(perk('mecha')&&k==='werkstatt')?1.15:1)}
{const A=ACTS.urlaub,f=A.f;A.f=()=>{const r=f();if(r!==null&&perk('pilot')){p.money+=750;return r+' Als Pilot/in fliegst du zum halben Preis.'}return r}}

/* ---------- Aktionen ohne Aktionspunkte ---------- */
function act15(id,arg){switch(id){
  case 'devapp':{if(!perk('Informatik')||p.prison||!spendTime(180))return 1;const a=p.myApp=p.myApp||{v:0,dl:0,n:pick(['Tagesplaner','Pflanzenwecker','Rezeptwürfel','Sparschwein','Laufbuddy'])};a.v++;a.dl+=R(300,2500)*a.v;done('Version '+a.v+' von „'+a.n+'“ ist online. '+kfmt(a.dl)+' Downloads.');return 1}
  case 'nachhilfe':{if(!perk('Lehramt')||p.prison||!spendTime(120))return 1;const v=px$(R(40,90));p.money+=v;p.tutN=(p.tutN||0)+1;done('Zwei Stunden Mathe mit einem Achtklässler. +'+eur(v)+'.');return 1}
  case 'carflip':{if(!perk('mecha')||p.prison)return 1;if((p.flipY||{})[p.age]>=2){toast('Mehr als zwei Autos pro Jahr schaffst du nicht.');return 1}const c=px$(1500);if(p.money<c){toast('Ein altes Auto kostet '+eur(c)+'.');return 1}if(!spendTime(240))return 1;
    p.flipY=p.flipY||{};p.flipY[p.age]=(p.flipY[p.age]||0)+1;p.money-=c;const s=ch(.85)?px$(R(2200,4300)):px$(R(800,1400));p.money+=s;done(s>c?'Rost weg, Motor läuft. Verkauft für '+eur(s)+'. Gewinn: '+eur(s-c)+'.':'Der Motor war hinüber. Nur '+eur(s)+' bekommen.');return 1}
  case 'haircut':{if(!perk('friseur')||p.prison)return 1;if((p.cutY||{})[p.age]>=3){toast('Für dieses Jahr sind alle frisiert.');return 1}if(!spendTime(45))return 1;p.cutY=p.cutY||{};p.cutY[p.age]=(p.cutY[p.age]||0)+1;
    const who=p.partner&&ch(.5)?'partner':'freund';relUp(who,6);try{npcMem(who,'Hat mir die Haare geschnitten',1)}catch(e){}add('au',1);done((who==='partner'?p.partner.name:p.friend)+' ist begeistert vom neuen Haarschnitt.');return 1}
}return 0}

/* ---------- Ereignisse ---------- */
QEV.notfall=()=>{const o=(p.nb||[])[0];if(!o)return null;const med=perk('Medizin'),pf=perk('pflege');return E('Notfall im Treppenhaus',o.n+' bricht vor deiner Tür zusammen und atmet kaum.',()=>!p.prison,[
  [(med?'★ Erste Hilfe (Medizin)':pf?'★ Erste Hilfe (Pflege)':'Erste Hilfe versuchen'),()=>{if(ch(med?.9:pf?.75:.4)){o.rel=100;remember(o,'Hat mir das Leben gerettet',5);addRuf(6);add('gl',10);news(p.first+' '+p.last+' rettet Nachbar/in das Leben','lokal');return 'Herzdruckmassage, bis der Notarzt kommt. '+o.n+' überlebt. Wegen dir.'}return 'Du gibst alles. Der Notarzt übernimmt. Es geht knapp gut.'}],
  ['Notruf wählen',()=>(remember(o,'Hat den Notarzt gerufen',2),o.rel=clamp(o.rel+10,0,100),'Der Rettungswagen ist in acht Minuten da. Gut gemacht.')]])};
QEV.hack=()=>E('Hackerangriff','Jemand hat die Kassensysteme deiner Geschäfte verschlüsselt und will 5.000 €.',()=>!!p.biz,[
  ['IT-Firma holen (3.000 €)',()=>(p.money-=px$(3000),'Nach drei Tagen läuft alles wieder.')],['Lösegeld zahlen',()=>(p.money-=px$(5000),ch(.5)?'Die Daten sind wieder da. Diesmal.':'Bezahlt, aber die Daten bleiben weg.')]]);
QEV.panne=()=>E('Panne!','Dein Auto bleibt auf der Landstraße liegen.',()=>(p.cars||[]).length>0,[
  ['Abschleppen lassen',()=>{const c=px$(R(300,1200));p.money-=c;return 'Werkstatt, Ersatzteil, Rechnung: '+eur(c)+'.'}]]);
QEV.exschueler=()=>E('Ein ehemaliger Schüler','Im Supermarkt spricht dich ein junger Mann an: „Sie waren meine Lieblingslehrkraft!“ Er arbeitet jetzt als Banker.',()=>true,[
  ['Ins Gespräch kommen',()=>ch(.5)?(p.money+=px$(R(5,20)*100),'Er gibt dir einen Aktientipp. Der geht auf!'):(add('gl',8),'Er erzählt, dass er wegen dir studiert hat. Das wärmt das Herz.')]]);
QEV.notlandung=()=>E('Triebwerksausfall!','Über den Alpen fällt ein Triebwerk aus. 180 Passagiere schauen nach vorne.',()=>!!(p.job&&p.job.id==='pilot'),[
  ['Checkliste abarbeiten',()=>ch(.85)?(addRuf(10),add('gl',8),p.job.perf=Math.min(100,(p.job.perf||50)+15),news('Heldin oder Held der Lüfte: Pilot/in '+p.first+' '+p.last+' landet sicher','lokal'),'Sichere Landung in München. Applaus in der Kabine.'):(add('gl',-10),'Harte Landung, alle verletzt, aber alle leben. Untersuchung folgt.')],
  ['Sofort umkehren',()=>ch(.6)?(addRuf(4),'Zurück am Startflughafen. Alle sicher.'):(add('ge',-8),'Unruhige Landung. Ein paar blaue Flecken.')]]);
function perkYear(R0){if(!p||p.prison)return;
  if(p.job){p.jobYrs=p.jobYrs||{};p.jobYrs[p.job.id]=(p.jobYrs[p.job.id]||0)+1}
  if(p.myApp){const a=p.myApp,v=Math.round(a.dl*.35*(perk('Informatik')?1:.5));if(v>0){p.money+=v;R0.inc.push(['App „'+a.n+'“',v])}a.dl=Math.round(a.dl*.85)}
  if(perk('Lehramt'))(p.kids||[]).forEach(k=>{if(p.age-k.b<19&&k.st)k.st.in=Math.min(100,(k.st.in||50)+2)});
  if(perk('pflege')){if(p.care==='selbst')add('gl',4);(p.nb||[]).forEach(o=>{if(nbAge(o)>=65)o.rel=clamp(o.rel+3,0,100)})}
  if(perk('buero')){const t=(R0.out.find(x=>x[0]==='Steuern')||[0,0])[1];if(t>0){const r=Math.round(t*.08);p.money+=r;R0.inc.push(['Steuererklärung (selbst gemacht)',r])}}
  if(perk('polizei')&&p.job&&p.job.id==='polizei'&&p.wanted>0&&ch(.3)){p.job=null;add('gl',-10);log('Interne Ermittlungen: Du wurdest aus dem Polizeidienst entlassen.');news('Polizist/in '+p.first+' '+p.last+' suspendiert','lokal')}
  if(perk('Medizin')&&ch(.2)){const id=['mama','papa'].find(x=>{const o=p.npc&&p.npc[x];return o&&o.sec==='krank'&&!o.sd});if(id)p.q.push({id:'npcsec',d:id})}
  const r=Math.random();
  if(r<.05&&nbOk())p.q.push({id:'notfall'});
  else if(r<.11&&p.biz&&(p.biz.fronts||[]).length){if(perk('Informatik'))log('Ein Hackerangriff auf deine Geschäfte: Du hast ihn selbst abgewehrt.');else p.q.push({id:'hack'})}
  else if(r<.19&&(p.cars||[]).length){if(perk('mecha'))log('Panne mit dem Auto: Du hast es selbst repariert, kostenlos.');else p.q.push({id:'panne'})}
  else if(r<.23&&perk('Lehramt')&&p.age>=35)p.q.push({id:'exschueler'});
  else if(r<.27&&p.job&&p.job.id==='pilot')p.q.push({id:'notlandung'})}

/* ---------- Bildungs-App: Was dir deine Ausbildung bringt ---------- */
function perkCard(){if(!p||p.age<14)return '';const lock=!!p.prison;
  const acts={Informatik:p.myApp?btn('devapp',null,'App updaten · 3 Std.','o',lock):btn('devapp',null,'App programmieren · 3 Std.','o',lock),Lehramt:btn('nachhilfe',null,'Nachhilfe geben · 2 Std.','o',lock),
    mecha:btn('carflip',null,'Auto herrichten · 4 Std.','o',lock),friseur:btn('haircut',null,'Haare schneiden · 45 Min.','o',lock)};
  const on=PERKS.filter(P=>P[2]()),off=PERKS.filter(P=>!P[2]());
  return '<section class="card perks"><h2 class="h">Das bringt dir deine Ausbildung</h2>'+(on.length?on.map(P=>'<div class="pk on"><b>'+P[1]+' <span class="chip">aktiv</span></b><ul>'+P[3].map(x=>'<li>'+x+'</li>').join('')+'</ul>'+(acts[P[0]]?'<div class="btns">'+acts[P[0]]+'</div>':'')+(P[0]==='Informatik'&&p.myApp?'<small class="note">„'+esc(p.myApp.n)+'“ · Version '+p.myApp.v+' · '+kfmt(p.myApp.dl)+' Downloads</small>':'')+'</div>').join(''):'<p class="note">Noch nichts freigeschaltet. Jedes Studium und jede Ausbildung bringt dir Vorteile im Alltag.</p>')+
    '<details class="pkmore"><summary>Alle Vorteile ansehen</summary>'+off.map(P=>'<div class="pk"><b>'+P[1]+'</b><small>'+P[4]+'</small><ul>'+P[3].map(x=>'<li>'+x+'</li>').join('')+'</ul></div>').join('')+'</details></section>'}
{const _vb=viewBildung;viewBildung=function(){return _vb()+perkCard()}}
