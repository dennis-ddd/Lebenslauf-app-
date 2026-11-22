/* ================= Nachbarn, Wohnungsprobleme, Erbstreit, Wirtschaftslage, Figuren mit Gedächtnis ================= */

/* ---------- Gemeinsame Helfer ---------- */
const memOf=o=>(o.mem=o.mem||[]);
function remember(o,t,v){const M=memOf(o);if(M.length&&M[M.length-1].t===t&&M[M.length-1].a===p.age)return;M.push({a:p.age,t,v:v||0});if(M.length>8)M.shift()}
const memSum=o=>memOf(o).reduce((s,m)=>s+(m.v||0),0);
const toJail=(y,why)=>{p.prison=y;p.job=null;add('gl',-12);try{ach('knast')}catch(e){}log(why+' '+y+' Jahr(e) Gefängnis.');news(p.first+' '+p.last+' muss ins Gefängnis','lokal')};

/* ---------- Nachbarn ---------- */
const NBTR={laut:['Laut','Feiert gern, auch unter der Woche.'],hilfsb:['Hilfsbereit','Nimmt Pakete an und leiht Werkzeug.'],neugier:['Neugierig','Weiß alles über alle im Haus.'],
  grill:['Grillfan','Lädt im Sommer ständig zum Grillen ein.'],ruhig:['Ruhig','Man hört nie etwas.'],streng:['Streng','Achtet auf jede Hausregel.']};
const rentedHome=()=>!!p.home&&p.home!=='eltern'&&p.home!=='eigen'&&!(p.owned||[]).includes(p.home);
function mkNb(){const g=pick(['w','m']);return {n:pick(g==='w'?FN:MN)+' '+pick(LN),g,b:p.age-R(22,78),rel:R(40,60),tr:pick(Object.keys(NBTR)),mem:[]}}
const nbAge=o=>p.age-o.b;
function nbSync(){if(!p)return;if(p.nbHome!==p.home||!p.nb){const moved=p.nbHome!=null&&p.nbHome!==p.home;p.nbHome=p.home;p.nb=[mkNb(),mkNb()];
  if(moved){p.rentX=0;p.mold=false;log('Neue Nachbarn: '+p.nb.map(x=>x.n).join(' und ')+'.')}}}
function nbYear(){nbSync();if(p.prison)return;
  p.nb.forEach((o,i)=>{if(nbAge(o)>82&&ch(.18)){const gift=o.rel>=85?px$(R(5,30)*1000):0;
      if(gift){p.money+=gift;log(o.n+' ist gestorben und hat dir '+eur(gift)+' vererbt. Ihr wart gute Nachbarn.');news('Nachbar/in hinterlässt '+p.first+' ein Erbe','lokal')}
      else log('Dein/e Nachbar/in '+o.n+' ist gestorben.');p.nb[i]=mkNb();log(p.nb[i].n+' zieht nebenan ein.')}});
  if(p.wanted>0){const bad=p.nb.findIndex(o=>o.rel<25);if(bad>=0&&ch(.22+p.wanted*.04)){p.q.push({id:'nbanzeige',d:bad});return}}
  if(ch(.5)){const i=R(0,p.nb.length-1),o=p.nb[i];
    const k=o.rel>=82&&ch(.35)?'nbfreund':{laut:'nblaerm',grill:'nbgrill',hilfsb:'nbpaket',neugier:'nbklatsch',streng:'nbregel',ruhig:'nbhilfe'}[o.tr];p.q.push({id:k,d:i})}}
const nbE=(i,f)=>{const o=p.nb&&p.nb[i];return o?f(o):null};
const nbRel=(o,v)=>{o.rel=clamp(o.rel+v,0,100)};
QEV.nblaerm=i=>nbE(i,o=>E('Party nebenan',o.n+' feiert schon wieder bis drei Uhr nachts. Die Wände wackeln.',()=>!p.prison,[
  ['Klingeln und bitten',()=>ch(.55)?(nbRel(o,2),add('gl',2),remember(o,'Ich habe nett um Ruhe gebeten',0),'Die Musik wird leiser. „Sorry!“'):(nbRel(o,-8),add('gl',-3),'Ein Lachen, die Tür geht zu. Weiter geht es.')],
  ['Mitfeiern',()=>(nbRel(o,10),add('gl',6),add('ge',-2),remember(o,'Wir haben zusammen gefeiert',1),'Beste Party des Jahres. Der Kater am Morgen auch.')],
  ['Polizei rufen',()=>(nbRel(o,-22),add('gl',1),remember(o,'Hat die Polizei gerufen',-2),'Endlich Ruhe. Im Treppenhaus grüßt '+o.n.split(' ')[0]+' nicht mehr.')]]));
QEV.nbgrill=i=>nbE(i,o=>E('Grillabend',o.n+' lädt das ganze Haus zum Grillen in den Hof ein.',()=>!p.prison,[
  ['Mit Nudelsalat hingehen',()=>(nbRel(o,10),add('gl',5),remember(o,'Kam zum Grillen, mit Nudelsalat',1),'Würstchen, Geschichten, Sonnenuntergang. Schön!')],
  ['Höflich absagen',()=>(nbRel(o,-3),'„Schade, nächstes Mal!“')]]));
QEV.nbpaket=i=>nbE(i,o=>E('Ein Paket',o.n+' fragt, ob du ein Paket annehmen kannst. Lieferung zwischen 8 und 20 Uhr.',()=>!p.prison,[
  ['Klar, mach ich',()=>(nbRel(o,7),remember(o,'Hat mein Paket angenommen',1),'Am Abend steht eine Flasche Wein vor deiner Tür. Danke!')],
  ['Keine Zeit',()=>(nbRel(o,-4),'„Okay, dann frage ich jemand anderen.“')]]));
QEV.nbklatsch=i=>nbE(i,o=>E('Treppenhaus-Gespräch',o.n+(p.wanted>0?' fragt neugierig, wer da nachts immer bei dir klingelt.':' erzählt dir den neuesten Klatsch aus dem Haus.'),()=>!p.prison,p.wanted>0?[
  ['Lockere Ausrede',()=>ch(.45+p.sk.charme/250)?(nbRel(o,3),'„Ach so, Lieferdienst. Verstehe!“ Gerettet.'):(nbRel(o,-12),remember(o,'Hat mir eine Lüge aufgetischt',-1),'Der Blick sagt alles. '+o.n.split(' ')[0]+' glaubt dir kein Wort.')],
  ['Tür zumachen',()=>(nbRel(o,-15),'Jetzt ist '+o.n.split(' ')[0]+' erst recht neugierig.')]]:[
  ['Zuhören',()=>(nbRel(o,4),add('gl',3),'Der Typ aus dem 3. Stock hat angeblich einen Papagei, der Schlager singt.')],
  ['Abwimmeln',()=>(nbRel(o,-3),'Du hast es eilig. '+o.n.split(' ')[0]+' schaut beleidigt.')]]));
QEV.nbregel=i=>nbE(i,o=>E('Beschwerde',o.n+' beschwert sich: '+pick(['Dein Fahrrad steht im Flur.','Der Müll ist falsch getrennt.','Du warst mit dem Treppenputzen dran.','Deine Schuhe stehen vor der Tür.']),()=>!p.prison,[
  ['Entschuldigen',()=>(nbRel(o,5),'„Na gut. Kann ja mal passieren.“')],
  ['Diskutieren',()=>(nbRel(o,-12),add('gl',-2),remember(o,'Hat mit mir gestritten',-1),'Zehn Minuten Streit im Flur. Ein Zettel hängt jetzt am schwarzen Brett.')],
  ['Ignorieren',()=>(nbRel(o,-6),'Ab jetzt hängt jede Woche ein Zettel an deiner Tür.')]]));
QEV.nbhilfe=i=>nbE(i,o=>E('Hilfe gesucht',nbAge(o)>=65?o.n+' ist nicht mehr gut zu Fuß und fragt, ob du die Einkäufe hochtragen kannst.':o.n+' zieht einen Schrank um und braucht starke Arme.',()=>!p.prison,[
  ['Helfen',()=>(nbRel(o,12),add('gl',4),remember(o,'Hat mir geholfen, als ich Hilfe brauchte',2),'Eine Stunde später: Kaffee, Kuchen und eine Freundschaft.')],
  ['Keine Zeit',()=>(nbRel(o,-5),'„Schon gut, ich frage jemand anderen.“')]]));
QEV.nbfreund=i=>nbE(i,o=>E('Gute Nachbarschaft',o.n+' steht mit '+(memSum(o)>=3?'einem selbstgebackenen Kuchen':'einer Pflanze')+' vor der Tür. '+(memSum(o)>=3?'„Ich hab nicht vergessen, wie du mir geholfen hast.“':'„Einfach so. Weil du ein/e tolle/r Nachbar/in bist.“'),()=>!p.prison,[
  ['Reinbitten',()=>(nbRel(o,5),add('gl',7),remember(o,'Wir haben zusammen Kaffee getrunken',1),'Ihr redet stundenlang. Aus Nachbarn werden Freunde.')],
  ['Danke sagen',()=>(add('gl',3),'Ein netter Moment an der Tür.')]]));
QEV.nbanzeige=i=>nbE(i,o=>E('Anzeige!',o.n+' hat dich bei der Polizei angezeigt. Er/sie hat beobachtet, was nachts bei dir los ist. Die Polizei steht vor der Tür.',()=>!p.prison,[
  ['Anwalt nehmen (5.000 €)',()=>{p.money-=px$(5000);if(ch(.7)){p.wanted=Math.max(0,p.wanted-1);return 'Dein Anwalt zerlegt die Aussage. Das Verfahren wird eingestellt.'}toJail(1,'Die Beweise reichen.');return 'Trotz Anwalt: verurteilt.'}],
  ['Alles abstreiten',()=>{if(ch(.4+p.sk.charme/300))return 'Du bleibst ruhig. Die Polizei zieht wieder ab, aber sie behält dich im Auge.';toJail(R(1,2),'Dein Leugnen hilft nicht.');return 'Abstreiten hat nicht gereicht.'}],
  ['Nachbar/in bestechen (2.000 €)',()=>{p.money-=px$(2000);if(ch(.6)){nbRel(o,15);remember(o,'Hat mich bestochen',0);return o.n.split(' ')[0]+' zieht die Anzeige zurück. „Hab mich wohl geirrt.“'}p.wanted=Math.min(5,p.wanted+1);toJail(2,'Bestechungsversuch fliegt auf.');return 'Das war ein Fehler.'}]]));

/* ---------- Wohnungsprobleme (nur zur Miete) ---------- */
function flatYear(){if(p.age<18||p.prison||!rentedHome())return;
  if(p.mold){add('ge',-3);log('Der Schimmel im Bad macht dich krank (Gesundheit −3).')}
  if(p.nkDebt){p.money-=p.nkDebt;log('Mahnung: Nebenkosten plus Mahngebühren, '+eur(p.nkDebt)+'.');p.nkDebt=0}
  const boom=p.world&&p.world.ph==='boom';if(ch(boom?.45:.3))p.q.push({id:pick(boom?['mieterh','mieterh','nebenk','schimmel']:['mieterh','nebenk','schimmel'])})}
QEV.mieterh=()=>{const x=Math.max(120,Math.round(px$(HOMES[p.home].c)*R(8,15)/100/10)*10);return E('Mieterhöhung','Ein Brief vom Vermieter: Die Miete steigt um '+eur(x)+' im Jahr.'+(p.world&&p.world.ph==='boom'?' Begründung: „Die Lage ist gefragt.“':''),()=>rentedHome(),[
  ['Akzeptieren',()=>(p.rentX=(p.rentX||0)+x,'Zähneknirschend unterschrieben.')],
  ['Widersprechen (Mieterverein 120 €)',()=>{p.money-=px$(120);if(ch(.55))return 'Der Mieterverein findet Fehler. Die Erhöhung ist unwirksam!';p.rentX=(p.rentX||0)+x;return 'Leider rechtens. Die Miete steigt.'}],
  ['Neue Wohnung suchen',()=>{p.rentX=(p.rentX||0)+x;setTimeout(()=>{if(p&&p.alive){tab='wohnen';render()}},600);return 'Du schaust dir Angebote an. Bis zum Umzug zahlst du mehr.'}]])};
QEV.schimmel=()=>E('Schimmel im Bad','Schwarze Flecken an der Decke. Es riecht muffig.',()=>rentedHome(),[
  ['Vermieter informieren',()=>{if(ch(.6)){p.mold=false;return 'Ein Handwerker kommt nach zwei Wochen. Weg ist er.'}p.mold=true;p.rentX=(p.rentX||0)-Math.round(px$(HOMES[p.home].c)*.1);return 'Der Vermieter reagiert nicht. Du kürzt die Miete um 10 %, bis er handelt.'}],
  ['Selbst sanieren (400 €)',()=>{p.money-=px$(400);if(ch(.8)){p.mold=false;return 'Ein Wochenende mit Maske und Spray. Erledigt.'}p.mold=true;return 'Nach drei Wochen ist er zurück.'}],
  ['Ignorieren',()=>(p.mold=true,add('ge',-3),'Du lüftest öfter. Das reicht leider nicht.')]]);
QEV.nebenk=()=>{const x=px$(R(3,15)*100);return E('Nebenkosten-Nachzahlung','Die Jahresabrechnung ist da: Du musst '+eur(x)+' nachzahlen.',()=>rentedHome(),[
  ['Zahlen',()=>(p.money-=x,'Überwiesen. Nächstes Jahr wird geheizt wie bei Oma: mit Pullover.')],
  ['Prüfen lassen (60 €)',()=>{p.money-=px$(60);if(ch(.5)){p.money-=Math.round(x/2);return 'Die Abrechnung war falsch. Du zahlst nur die Hälfte!'}p.money-=x;return 'Alles korrekt. Du zahlst den vollen Betrag.'}],
  ['Erstmal nicht zahlen',()=>(p.nkDebt=Math.round(x*1.25),'Nächstes Jahr kommt die Mahnung, mit Gebühren.')]])};

/* ---------- Testament und Erbstreit ---------- */
function willChange(arg){if(!p.kids||p.kids.length<2||p.will===arg)return;p.willSet=1;
  if(String(arg).startsWith('kid')){const fav=+arg.slice(3);p.kids.forEach((k,i)=>{if(i!==fav&&k.alive!==false){k.rel=clamp((k.rel||60)-12,0,100)}});
    toast('Die anderen Kinder haben davon gehört. Sie sind enttäuscht.')}
  else if(arg==='stiftung'||arg==='partner'){p.kids.forEach(k=>{if(k.alive!==false)k.rel=clamp((k.rel||60)-8,0,100)});toast('Deine Kinder hatten auf mehr gehofft.')}
  else if(arg==='gleich')p.kids.forEach(k=>{if(k.alive!==false)k.rel=clamp((k.rel||60)+3,0,100)})}
function willYear(){if(p.age>=65&&!p.willSet&&!p.willAsk&&(p.kids||[]).filter(k=>k.alive!==false).length>=2){p.willAsk=1;p.q.push({id:'willremind'})}
  if(p.erbFeud&&(p.sibs||[]).some(s=>s.rel<35)&&ch(.3))p.q.push({id:'feud'})}
QEV.willremind=()=>E('Zeit für ein Testament?','Deine Notarin meint: Ohne Testament gibt es oft Streit. Wer soll später was bekommen?',()=>true,[
  ['Gerecht aufteilen',()=>(p.will='gleich',p.willSet=1,'Alle Kinder bekommen gleich viel. Das sorgt für Frieden.')],
  ['Lieblingskind bevorzugen',()=>{const L=p.kids.map((k,i)=>[k,i]).filter(x=>x[0].alive!==false).sort((a,b)=>(b[0].rel||0)-(a[0].rel||0));const i=L[0][1];willChange('kid'+i);p.will='kid'+i;return p.kids[i].n+' bekommt alles. Die anderen werden das nicht vergessen.'}],
  ['Später entscheiden',()=>(p.willAsk=0,'Du schiebst es auf. Im Familie-Reiter kannst du es jederzeit festlegen.')]]);
QEV.feud=()=>{const s=(p.sibs||[]).filter(x=>x.rel<35)[0];if(!s)return null;return E('Funkstille',s.n+' redet seit dem Erbe kaum mit dir. Bei Familienfesten sitzt ihr an verschiedenen Tischen.',()=>true,[
  ['Versöhnung anbieten',()=>{if(ch(.5)){s.rel=clamp(s.rel+28,0,100);if(!(p.sibs||[]).some(x=>x.rel<35))p.erbFeud=null;add('gl',6);return 'Ihr redet stundenlang. Es fließen Tränen. Endlich wieder Familie.'}s.rel=clamp(s.rel-5,0,100);return '„Dafür ist es zu spät.“ Die Tür bleibt zu.'}],
  ['Weiter schweigen',()=>(add('gl',-3),'Der Streit frisst sich in die nächste Generation.')]])};
QEV.erbklage=d=>E('Übergangen im Testament','Im Testament stand: Alles geht an '+d.to+'. Du bekommst nichts. Dir steht aber ein Pflichtteil zu: '+eur(d.pt)+'.',()=>true,[
  ['Pflichtteil einfordern',()=>{p.money+=d.pt;const s=(p.sibs||[]).find(x=>x.n===d.to);if(s)s.rel=clamp(s.rel-15,0,100);p.erbFeud=1;return 'Nach Monaten mit Anwälten bekommst du '+eur(d.pt)+'. Mit '+d.to+' ist es vorbei.'}],
  ['Verzichten, für den Frieden',()=>{const s=(p.sibs||[]).find(x=>x.n===d.to);if(s)s.rel=clamp(s.rel+20,0,100);add('gl',-4);return 'Es tut weh. Aber '+d.to+' ist dir dankbar.'}]]);
QEV.pflicht=d=>E('Erbstreit','Deine Geschwister fühlen sich übergangen und fordern ihren Pflichtteil: zusammen '+eur(d.pt)+'.',()=>true,[
  ['Zahlen',()=>(p.money-=d.pt,(p.sibs||[]).forEach(s=>s.rel=clamp(s.rel+12,0,100)),'Teuer, aber die Familie redet wieder miteinander.')],
  ['Vor Gericht gehen (5.000 €)',()=>{p.money-=px$(5000);if(ch(.45)){(p.sibs||[]).forEach(s=>s.rel=clamp(s.rel-15,0,100));p.erbFeud=1;return 'Das Gericht gibt dir recht. Du behältst alles, aber deine Geschwister sind fertig mit dir.'}p.money-=d.pt;p.erbFeud=1;return 'Verloren. Du zahlst den Pflichtteil und die Anwälte.'}]]);
{const _ca=continueAs;continueAs=function(i){const prev=p,k=prev.kids[i];if(!k)return _ca(i);
  const will=prev.will||'gleich',e=Math.max(0,estate()),heirs=prev.kids.filter(x=>x.alive!==false),n=heirs.length||1,pt=Math.round(e/n/2);
  _ca(i);if(p===prev||n<2)return;
  if(will==='kid'+i){p.sibs.forEach(s=>s.rel=clamp(s.rel-30,0,100));p.erbFeud=1;if(pt>0)p.q.push({id:'pflicht',d:{pt:pt*(n-1)}});log('Du hast alles geerbt. Deine Geschwister sind wütend.')}
  else if(will.startsWith('kid')){const fav=prev.kids[+will.slice(3)];if(fav){const s=p.sibs.find(x=>x.n===fav.n);if(s)s.rel=clamp(s.rel-35,0,100);p.erbFeud=1;if(pt>0)p.q.push({id:'erbklage',d:{to:fav.n,pt}});log('Im Testament wurdest du übergangen. Alles ging an '+fav.n+'.')}}
  else if(will==='stiftung'||will==='partner'){p.sibs.forEach(s=>s.rel=clamp(s.rel-5,0,100));log('Das Erbe ging '+(will==='stiftung'?'an eine Stiftung':'an '+(prev.partner?prev.partner.name:'den Partner'))+'. Deine Geschwister und du sind gemeinsam enttäuscht.')}
  else p.sibs.forEach(s=>s.rel=clamp(s.rel+5,0,100));save();render()}}

/* ---------- Wirtschaftslage: Prognosen und spürbare Folgen ---------- */
const ECO={normal:{d:1,j:0,t:'Alles im normalen Bereich.'},boom:{d:1.15,j:.08,t:'Mehr Kunden, mehr Stellen, aber auch Mieterhöhungen.'},rezession:{d:.85,j:-.12,t:'Weniger Kunden, Firmen stellen kaum ein, Entlassungen drohen.'},
  pandemie:{d:.85,j:-.05,t:'Clubs, Reisen und Gastronomie leiden.'},krise:{d:.92,j:-.05,t:'Energie und Lebensmittel werden teurer.'}};
const ecoPh=()=>p&&p.world&&ECO[p.world.ph]?p.world.ph:'normal';
const ecoJob=()=>ECO[ecoPh()].j;
{const _bm=bizMul;bizMul=k=>_bm(k)*ECO[ecoPh()].d}
{const _wy=worldYear;worldYear=function(R0){const w=p.world;
  if(w.ph==='normal'&&w.fc){const f=w.fc;w.fc=null;if(ch(.75)){w.ph=f;w.y=-1;w.dur=f==='boom'?R(2,4):f==='pandemie'?2:R(1,3);news(WORLD[f][0]+'!','welt','Die Prognose ist eingetroffen. '+WORLD[f][4]);log('Weltgeschehen: '+WORLD[f][0]+'. '+WORLD[f][4])}
    else news('Entwarnung: '+WORLD[f][0]+' bleibt aus','welt','Die Experten haben sich geirrt.')}
  _wy(R0);
  if(w.ph==='normal'&&!w.fc&&ch(.22)){const f=pick(['boom','boom','rezession','rezession','krise','pandemie']);w.fc=f;news('Prognose: '+WORLD[f][0]+' im nächsten Jahr?','welt','Experten erwarten: '+ECO[f].t);
    try{notify('Wirtschaftsprognose: Nächstes Jahr droht '+WORLD[f][0]+'.','news')}catch(e){}}}}
function ecoCard(){if(!p||!p.world)return '';const ph=ecoPh(),W=WORLD[ph],fc=p.world.fc;
  const lv=(l,v)=>'<div class="row"><span class="t">'+l+'</span><b class="'+(v>0?'up':v<0?'dn':'')+'">'+(v>0?'▲ höher':v<0?'▼ niedriger':'normal')+'</b></div>';
  return '<section class="card eco eco-'+ph+'"><h2 class="h">Was das für dich bedeutet</h2><p class="note">'+ECO[ph].t+'</p>'+
    lv('Gehälter',W[2])+lv('Chancen auf Jobs',ECO[ph].j)+lv('Kunden in Geschäften',ECO[ph].d-1)+lv('Mieten',ph==='boom'?1:0)+lv('Börse',W[1]-1)+
    (fc?'<p class="warn">Prognose für nächstes Jahr: <b>'+WORLD[fc][0]+'</b></p>':'')+'</section>'}
{const _vn=viewNews;viewNews=function(){const h=_vn(),i=h.indexOf('</section>')+10;return h.slice(0,i)+ecoCard()+h.slice(i)}}

/* ---------- Figuren mit Persönlichkeit, Zielen, Geheimnissen und Gedächtnis ---------- */
const NPCTR={treu:['Treu','vergisst nie, wer zu ihr/ihm gehalten hat'],nachtr:['Nachtragend','vergisst nichts, vor allem nichts Schlechtes'],gross:['Großzügig','teilt gern, auch Geld'],
  eifers:['Eifersüchtig','mag es nicht, zu kurz zu kommen'],ehrg:['Ehrgeizig','hat große Pläne'],vertr:['Verträumt','lebt in den Wolken']};
const NPCGOAL={freund:[['cafe','ein eigenes Café eröffnen'],['reise','ein Jahr um die Welt reisen'],['band','mit einer Band berühmt werden']],partner:[['haus','ein eigenes Haus'],['kinder','Kinder'],['hochzeit','heiraten'],['reise','eine große Reise mit dir']],
  sib:[['hochzeit','heiraten'],['auswandern','nach Kanada auswandern'],['studium','das Studium nachholen']],mama:[['meer','den Ruhestand am Meer']],papa:[['meer','den Ruhestand am Meer']],chef:[['vorstand','in den Vorstand aufsteigen']],rival:[['besser','besser sein als du']]};
const NPCSEC={freund:[['schulden','hat heimlich hohe Schulden'],['job','hat den Job verloren und es niemandem erzählt'],['crush','ist heimlich in deine/n Partner/in verliebt']],
  partner:[['kredit','hat heimlich einen Kredit aufgenommen'],['antrag','plant einen Heiratsantrag'],['affaere','hatte eine Affäre']],
  sib:[['abbruch','hat das Studium abgebrochen'],['verlobt','ist heimlich verlobt'],['schulden','hat Schulden bei den falschen Leuten']],
  mama:[['krank','ist krank und sagt es niemandem'],['erbstueck','hat ein wertvolles Familienerbstück versteckt']],papa:[['krank','ist krank und sagt es niemandem'],['erbstueck','hat ein wertvolles Familienerbstück versteckt']],
  chef:[['verkauf','die Firma wird heimlich verkauft']],rival:[['crush','war früher heimlich in dich verliebt']]};
const npcKind=id=>String(id).startsWith('sib')?'sib':id;
function npcOf(id){if(!p.npc)p.npc={};const k=npcKind(id);if(!NPCGOAL[k])return null;let o=p.npc[id];
  if(!o){o=p.npc[id]={tr:pick(Object.keys(NPCTR)),goal:pick(NPCGOAL[k])[0],sec:pick(NPCSEC[k])[0],mem:[],gk:0,sk:0,gd:0,sd:0};if(k==='partner'&&p.partner&&p.partner.mar&&o.goal==='hochzeit')o.goal='haus'}return o}
const npcName=id=>{const c=contacts().find(x=>x.id===id);return c?c.n:id};
const goalTxt=(id,o)=>(NPCGOAL[npcKind(id)].find(x=>x[0]===o.goal)||['',''])[1];
const secTxt=(id,o)=>(NPCSEC[npcKind(id)].find(x=>x[0]===o.sec)||['',''])[1];
function npcMem(id,t,v){const o=npcOf(id);if(!o)return;remember(o,t,v*(o.tr==='nachtr'&&v<0?2:1)*(o.tr==='treu'&&v>0?1.5:1))}
// Gedächtnis: Wie sich die Beziehung durch eine Aktion verändert, merkt sich die Person
{const _act=act;act=function(id,arg){const ids=['call','meet','love','time','grat','invyes','invno','kidtime','kidgift'];if(!ids.includes(id)||!p)return _act(id,arg);
  const who=id==='love'||id==='time'?'partner':id==='meet'?'freund':arg,before=who?relOf(who):0;const r=_act(id,arg);
  try{if(who&&npcOf(who)){const d=relOf(who)-before;if(id==='invno')npcMem(who,'Hat meine Einladung abgesagt',-1);else if(d>0)npcMem(who,{call:'Hat angerufen',meet:'Wir haben etwas unternommen',love:'Hat mir eine liebe Nachricht geschickt',time:'Wir hatten ein schönes Date',grat:'Hat mir gratuliert',invyes:'Ist zu meiner Einladung gekommen'}[id]||'War für mich da',1)}}catch(e){}
  return r}}
function npcYear(){if(p.prison||p.age<8)return;const cs=contacts().map(c=>c.id).filter(id=>npcOf(id));if(!cs.length)return;
  cs.forEach(id=>{const o=npcOf(id),C=p.chats[id];const talked=C&&C.msgs.some(m=>m.me&&m.a===p.age-1);if(!talked&&relOf(id)<45&&(o.tr==='nachtr'||o.tr==='eifers')&&ch(.4))npcMem(id,'Hat sich ein ganzes Jahr nicht gemeldet',-1)});
  const r=Math.random();
  if(r<.16){const L=cs.filter(id=>!npcOf(id).sd);if(L.length)p.q.push({id:'npcsec',d:pick(L)})}
  else if(r<.32){const L=cs.filter(id=>!npcOf(id).gd&&p.age>=16);if(L.length)p.q.push({id:'npcgoal',d:pick(L)})}
  else if(r<.42){const L=cs.filter(id=>Math.abs(memSum(npcOf(id)))>=3);if(L.length)p.q.push({id:'npcmem',d:pick(L)})}
  (p.npcInv||[]).filter(x=>x.a<=p.age).forEach(x=>{const n=npcName(x.id);if(x.ok){p.money+=x.amt*2;npcMem(x.id,'Hat an mich geglaubt und investiert',2);log(n+' zahlt deine Investition doppelt zurück: '+eur(x.amt*2)+'!')}else{npcMem(x.id,'Das Geld ist weg. Tut mir so leid.',0);log('Das Projekt von '+n+' ist gescheitert. Deine '+eur(x.amt)+' sind weg.')}});
  p.npcInv=(p.npcInv||[]).filter(x=>x.a>p.age)}
QEV.npcsec=id=>{const o=npcOf(id);if(!o||o.sd)return null;const n=npcName(id),s=o.sec;o.sd=1;o.sk=1;
  const help=(t,v,f)=>[t,()=>{const r=f();npcMem(id,t==='Weitererzählen'?'Hat mein Geheimnis verraten':'Hat mein Geheimnis für sich behalten',v);return r}];
  const O={schulden:[help('Mit Geld aushelfen (2.000 €)',2,()=>(p.money-=px$(2000),relUp(id,15),n+' umarmt dich. „Das zahle ich dir zurück. Versprochen.“')),help('Für sich behalten',1,()=>(relUp(id,5),'„Danke, dass du mich nicht verurteilst.“')),help('Weitererzählen',-3,()=>(relUp(id,-30),'Es spricht sich herum. '+n+' fühlt sich verraten.'))],
    job:[help('Beim Bewerben helfen',2,()=>(relUp(id,12),add('gl',3),'Ihr schreibt zusammen Bewerbungen. Drei Wochen später: neuer Job!')),help('Für sich behalten',1,()=>(relUp(id,4),'Du sagst niemandem etwas.')),help('Weitererzählen',-3,()=>(relUp(id,-25),'Peinlich für '+n+'. Und für eure Freundschaft.'))],
    crush:[help('Offen ansprechen',1,()=>ch(.6)?(relUp(id,5),'Ein ehrliches Gespräch. Es ist komisch, aber ihr bleibt Freunde.'):(relUp(id,-15),'Es wird nie wieder so wie früher.')),help('Abstand halten',0,()=>(relUp(id,-8),'Ihr seht euch seltener.')),help('Weitererzählen',-3,()=>(relUp(id,-30),p.partner?(p.partner.rel=clamp(p.partner.rel-6,0,100),'Drama! Jetzt ist auch dein/e Partner/in verunsichert.'):'Drama im Freundeskreis.'))],
    kredit:[help('Gemeinsam abbezahlen (3.000 €)',2,()=>(p.money-=px$(3000),relUp(id,10),'Ihr macht einen Plan. Keine Geheimnisse mehr.')),help('Wütend werden',-1,()=>(relUp(id,-18),'Ein lauter Abend. Das Vertrauen hat einen Knacks.'))],
    antrag:[help('Überrascht tun',1,()=>(relUp(id,10),p.partner&&!p.partner.mar?(p.partner.mar=true,mile('Verlobt und verheiratet','heart'),add('gl',15),'Auf Knien, im Lieblingsrestaurant. Ja! Ihr heiratet.'):'Ein wunderschöner Abend.')),help('Verraten, dass du es weißt',0,()=>(relUp(id,-3),'„Du hast mir die Überraschung verdorben!“'))],
    affaere:[help('Verzeihen',1,()=>(relUp(id,-5),add('gl',-6),'Es tut weh. Aber ihr wollt es nochmal versuchen.')),help('Trennung',-2,()=>{const nm=n;p.partner=null;add('gl',-12);return 'Du packst die Koffer. Das Kapitel mit '+nm+' ist vorbei.'})],
    abbruch:[help('Unterstützen',2,()=>(relUp(id,12),'„Danke, dass du nicht wie unsere Eltern reagierst.“')),help('Weitererzählen',-3,()=>(relUp(id,-25),'Die Eltern wissen es jetzt. '+n+' redet nicht mehr mit dir.'))],
    verlobt:[help('Gratulieren',1,()=>(relUp(id,8),add('gl',4),'Du bist die erste Person, die es weiß. Trauzeug/in?')),help('Weitererzählen',-2,()=>(relUp(id,-15),'Die Überraschung für die Familie ist dahin.'))],
    krank:[help('Für sie/ihn da sein',2,()=>(relUp(id,15),add('gl',-3),'Du begleitest zu jedem Arzttermin. Gemeinsam schafft ihr das.')),help('Arzt der Familie informieren',1,()=>(relUp(id,5),'Früh erkannt. Die Prognose ist gut.'))],
    erbstueck:[help('Gemeinsam ansehen',1,()=>{const v=px$(R(3,20)*1000);p.money+=v;return 'Eine alte Taschenuhr vom Urgroßvater. Ein Gutachter schätzt sie auf '+eur(v)+'. Sie gehört jetzt dir.'})],
    verkauf:[help('Rechtzeitig umschauen',1,()=>(add('in',2),'Du polierst deinen Lebenslauf. Gut vorbereitet.')),help('Kollegen warnen',0,()=>(add('gl',2),'Die Kollegen sind dankbar. Der Chef weniger.'))]};
  const opts=O[s]||[['Zuhören',()=>(relUp(id,4),'Ihr redet lange.')]];
  return E('Geheimnis: '+n,n+' vertraut dir etwas an: '+n.split(' ')[0]+' '+secTxt(id,o)+'.',()=>!p.prison,opts)};
QEV.npcgoal=id=>{const o=npcOf(id);if(!o||o.gd)return null;const n=npcName(id),g=o.goal;o.gk=1;
  const fin=(t,v)=>{o.gd=1;npcMem(id,t,v)};
  if(g==='cafe'||g==='band'){const amt=px$(g==='cafe'?5000:2000);return E(n+' hat einen Plan',n+' will '+goalTxt(id,o)+' und fragt, ob du '+eur(amt)+' investierst.',()=>p.money>=amt,[
    ['Investieren',()=>{p.money-=amt;(p.npcInv=p.npcInv||[]).push({id,amt,a:p.age+R(2,4),ok:ch(.55+(o.tr==='ehrg'?.15:0))});fin('Hat in meinen Traum investiert',2);relUp(id,12);return 'Ihr stoßt an. In ein paar Jahren weißt du, ob es geklappt hat.'}],
    ['Nur Mut machen',()=>(fin('Hat mir Mut gemacht',1),relUp(id,4),'„Danke. Irgendwann schaffe ich das.“')],['Abraten',()=>(fin('Hat nicht an mich geglaubt',-1),relUp(id,-8),'„Du klingst wie meine Eltern.“')]])}
  if(g==='hochzeit'&&npcKind(id)==='sib')return E('Hochzeit!',n+' heiratet und lädt dich ein.',()=>true,[['Hingehen (Geschenk 300 €)',()=>(p.money-=px$(300),fin('Kam zu meiner Hochzeit',2),relUp(id,10),add('gl',6),'Du hältst eine Rede. Alle weinen. Vor Lachen.')],['Absagen',()=>(fin('Kam nicht zu meiner Hochzeit',-2),relUp(id,-15),'Das wird dir noch lange vorgehalten.')]]);
  if(g==='auswandern')return E('Abschied?',n+' will '+goalTxt(id,o)+'.',()=>true,[['Unterstützen',()=>(fin('Hat mich beim Auswandern unterstützt',2),relUp(id,8),add('gl',-3),'Ein tränenreicher Abschied am Flughafen. Ihr chattet jede Woche.')],['Überreden zu bleiben',()=>ch(.4)?(fin('Hat mich überredet zu bleiben',0),'„Na gut. Ich bleibe.“'):(fin('Wollte mich nicht gehen lassen',-1),relUp(id,-8),n+' fliegt trotzdem. Und ist sauer.')]]);
  if(npcKind(id)==='partner'){if(g==='hochzeit'&&p.partner&&!p.partner.mar)return E('Die große Frage',n+' fragt beim Abendessen: „Wollen wir nicht endlich heiraten?“',()=>!!p.partner,[['Ja!',()=>(p.partner.mar=true,fin('Hat Ja gesagt',3),add('gl',15),mile('Hochzeit','heart'),'Ihr heiratet im Sommer. Bester Tag deines Lebens.')],['Noch nicht',()=>(fin('Wollte mich nicht heiraten',-2),relUp(id,-12),'Stille. Lange Stille.')]]);
    if(g==='haus')return E('Traum vom Haus',n+' zeigt dir Hausangebote auf dem Handy. „Wäre das nicht schön? Ein eigenes Zuhause?“',()=>!!p.partner,[['Wir suchen zusammen',()=>(fin('Hat mit mir nach einem Haus gesucht',1),relUp(id,6),setTimeout(()=>{if(p&&p.alive){tab='wohnen';render()}},600),'Ihr schaut euch Angebote an.')],['Zu teuer',()=>(fin('Hat meinen Traum vom Haus abgetan',-1),relUp(id,-6),'„Immer ist alles zu teuer.“')]]);
    if(g==='kinder')return E('Kinderwunsch',n+' sagt leise: „Ich wünsche mir ein Kind mit dir.“',()=>!!p.partner,[['Ich auch',()=>(fin('Wir wollen beide Kinder',2),relUp(id,10),'Ihr haltet euch lange im Arm. Im Familie-Reiter könnt ihr es versuchen.')],['Ich bin nicht bereit',()=>(fin('Will (noch) keine Kinder',-1),relUp(id,-10),'Ein schwieriges Gespräch.')]]);
    return E('Gemeinsamer Traum',n+' träumt von '+goalTxt(id,o)+'. 4.000 €, zwei Wochen.',()=>!!p.partner,[['Buchen',()=>(p.money-=px$(4000),fin('Unsere große Reise',3),relUp(id,15),add('gl',12),'Sonnenaufgang am Meer. Das vergesst ihr nie.')],['Ein andermal',()=>(fin('Wieder keine Reise',-1),relUp(id,-5),'„Wie immer.“')]])}
  if(g==='meer')return E('Ruhestand am Meer',n+' erzählt, dass ihr Traum ein Häuschen am Meer ist. Es fehlen 10.000 €.',()=>true,[['Zuschießen (10.000 €)',()=>(p.money-=px$(10000),fin('Hat uns das Haus am Meer ermöglicht',3),relUp(id,18),add('gl',6),'Postkarten mit Möwen und Sonnenbrand. Sie sind überglücklich.')],['Nur besuchen kommen',()=>(fin('Kommt uns besuchen',1),relUp(id,4),'„Wir freuen uns auf dich!“')]]);
  if(g==='vorstand')return E('Der Chef braucht dich',n+' will in den Vorstand und braucht ein Spitzenergebnis im Team.',()=>!!p.job,[['Überstunden machen',()=>(p.job.perf=Math.min(100,(p.job.perf||50)+12),add('gl',-4),fin('Hat mir den Rücken freigehalten',2),'Der Chef wird befördert. Und vergisst dich nicht.')],['Normal weiterarbeiten',()=>(fin('Hat sich nicht ins Zeug gelegt',-1),'Der Chef ist enttäuscht.')]]);
  if(g==='besser')return E('Die alte Rivalität',n+' will unbedingt '+goalTxt(id,o)+' und fordert dich zu einem Wettrennen heraus.',()=>true,[['Annehmen',()=>ch(.45+p.sk.form/250)?(add('gl',6),fin('Hat mich geschlagen',-1),'Gewonnen! '+n+' ist sprachlos.'):(add('gl',-4),fin('Ich war besser',0),'Verloren. '+n+' grinst.')],['Ablehnen',()=>'Du hast Besseres zu tun.']]);
  return E(n+' hat einen Traum',n+' will '+goalTxt(id,o)+'.',()=>true,[['Unterstützen',()=>(fin('Hat mich unterstützt',2),relUp(id,10),'„Du bist die/der Beste.“')],['Belächeln',()=>(fin('Hat mich ausgelacht',-2),relUp(id,-10),'Das sitzt.')]])};
QEV.npcmem=id=>{const o=npcOf(id);if(!o)return null;const n=npcName(id),s=memSum(o),M=memOf(o),good=s>0,last=M.filter(m=>good?m.v>0:m.v<0).slice(-1)[0];if(!last)return null;
  if(good){const gift=o.tr==='gross'?px$(R(10,30)*100):0;return E(n+' erinnert sich',n+': „Weißt du noch? '+last.t+'. Das vergesse ich dir nie.“'+(gift?' Dazu gibt es '+eur(gift)+' „für dich, einfach so“.':''),()=>true,[
    ['Danke!',()=>{if(gift)p.money+=gift;relUp(id,6);add('gl',6);if(p.job&&ch(.3)){p.job.perf=Math.min(100,(p.job.perf||50)+8);return n+' hat dich außerdem bei deinem Chef empfohlen. Leistung +8.'}return 'Ein warmer Moment.'}]])}
  return E(n+' hat es nicht vergessen',n+': „'+last.t+'. Glaub nicht, dass ich das vergessen habe.“',()=>true,[
    ['Entschuldigen',()=>ch(o.tr==='nachtr'?.35:.65)?(remember(o,'Hat sich ehrlich entschuldigt',2),relUp(id,10),'„Okay. Schwamm drüber.“'):(relUp(id,-4),'„Das reicht nicht.“')],
    ['Kontern',()=>(remember(o,'Hat mich angegiftet',-1),relUp(id,-10),add('gl',-2),'Der Streit eskaliert.')]])};
function npcCard(c){const o=npcOf(c.id);if(!o)return '';const M=memOf(o).slice(-3).reverse();
  return '<div class="npcc"><div class="npch"><b>'+esc(c.n)+'</b><span class="chip">'+NPCTR[o.tr][0]+'</span></div><small>'+esc(c.n.split(' ')[0])+' '+NPCTR[o.tr][1]+'.</small>'+
    (o.gk||relOf(c.id)>=70?'<div class="npcl"><span>Ziel</span>'+goalTxt(c.id,o)+(o.gd?' ✓':'')+'</div>':'<div class="npcl dim"><span>Ziel</span>Noch unbekannt. Baue eine engere Beziehung auf.</div>')+
    (o.sk?'<div class="npcl"><span>Geheimnis</span>'+secTxt(c.id,o)+'</div>':'')+
    (M.length?'<div class="npcm"><span>Erinnert sich</span>'+M.map(m=>'<i class="'+(m.v>0?'g':m.v<0?'b':'')+'">'+esc(m.t)+' <small>(mit '+m.a+')</small></i>').join('')+'</div>':'')+'</div>'}
{const _ce=chatExtra;chatExtra=c=>npcCard(c)+_ce(c)}
// Echte Gesichter statt Anfangsbuchstaben
function cavOf(c,size){if(String(c.id).startsWith('g_'))return '<span class="cav" style="background:'+c.col+'">'+esc(c.n[0])+'</span>';
  const g=c.id==='mama'?'w':c.id==='papa'?'m':c.id==='partner'&&p.partner?(p.partner.g||null):String(c.id).startsWith('sib')?((p.sibs||[])[+c.id.slice(3)]||{}).g:null;
  const a=c.id==='mama'?p.age+30:c.id==='papa'?p.age+32:c.id==='chef'?46:p.age;
  return '<span class="cav av" style="background:'+c.col+'">'+npcAv(c.n,g,a,size||44)+'</span>'}

/* ---------- Nachbarn in der Wohnen-App ---------- */
function nbCard(){nbSync();if(!p.nb)return '';const lock=!!p.prison;
  return '<section class="card"><h2 class="h">Deine Nachbarn</h2>'+p.nb.map((o,i)=>{const m=memOf(o).slice(-1)[0];
    return '<div class="nbr"><span class="cav av">'+npcAv(o.n,o.g,nbAge(o),44)+'</span><div class="t"><b>'+esc(o.n)+' · '+nbAge(o)+'</b><small>'+NBTR[o.tr][0]+': '+NBTR[o.tr][1]+'</small>'+
      '<div class="bar"><i class="'+(o.rel<35?'low':'')+'" style="width:'+o.rel+'%"></i></div>'+(m?'<small class="nbm">Erinnert sich: '+esc(m.t)+'</small>':'')+
      '<div class="btns">'+btn('nbgruss',i,p.nbg&&p.nbg[i]===p.age?'Gegrüßt':'Grüßen','g',lock||(p.nbg&&p.nbg[i]===p.age))+btn('nbkuchen',i,'Kuchen bringen','o',lock)+(o.tr==='laut'||o.tr==='streng'?btn('nbbeschw',i,'Beschweren','g',lock):'')+'</div></div></div>'}).join('')+
    '<p class="note">Wer mit den Nachbarn zerstritten ist, wird bei krummen Dingen eher angezeigt.</p></section>'+
    (rentedHome()&&(p.rentX||p.mold)?'<section class="card"><h2 class="h">Mietwohnung</h2>'+(p.rentX?row('Mieterhöhungen',(p.rentX>0?'+':'')+eur(p.rentX)+' im Jahr',''):'')+(p.mold?row('Schimmel im Bad','Kostet jedes Jahr Gesundheit',btn('moldfix',null,'Sanieren · '+eur(px$(600)),'o',lock||p.money<px$(600))):'')+'</section>':'')}
{const _vw=viewWohnen;viewWohnen=function(){return _vw()+nbCard()}}
function act14(id,arg){switch(id){
  case 'nbgruss':{const o=p.nb&&p.nb[+arg];if(!o)return 1;p.nbg=p.nbg||{};if(p.nbg[arg]===p.age)return 1;p.nbg[arg]=p.age;nbRel(o,3);toast('„Guten Morgen!“ '+o.n.split(' ')[0]+' lächelt.');render();return 1}
  case 'nbkuchen':{const o=p.nb&&p.nb[+arg];if(!o||p.prison)return 1;if(!spendTime(45))return 1;p.money-=px$(8);nbRel(o,8);remember(o,'Hat mir Kuchen gebracht',1);done(o.n.split(' ')[0]+' freut sich riesig über den Kuchen.');return 1}
  case 'nbbeschw':{const o=p.nb&&p.nb[+arg];if(!o||p.prison)return 1;if(!spendTime(15))return 1;nbRel(o,-8);remember(o,'Hat sich über mich beschwert',-1);done(o.tr==='laut'?'Es wird ein paar Wochen leiser. '+o.n.split(' ')[0]+' grüßt dich nicht mehr.':'„Ich halte mich nur an die Hausordnung!“');return 1}
  case 'moldfix':{const c=px$(600);if(p.money<c||!spendTime(120))return 1;p.money-=c;p.mold=false;if(p.rentX<0)p.rentX=0;done('Der Fachbetrieb war da. Das Bad ist wieder sauber.');return 1}
}return 0}

/* ---------- Jahreswechsel ---------- */
function leben2Year(R0){try{nbYear()}catch(e){}try{flatYear()}catch(e){}try{willYear()}catch(e){}try{npcYear()}catch(e){}}
