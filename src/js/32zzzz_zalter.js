/* ================= Gesundheit und Leben im Alter ================= */
const ACOND={ruecken:['Rückenschmerzen','Reha (3 Wochen)',1500,{gl:-2,ge:-2}],hoeren:['Schwerhörigkeit','Hörgerät',1800,{gl:-3}],augen:['Grauer Star','Augen-OP',900,{gl:-2,in:-1}],
  gelenke:['Arthrose','Physiotherapie',1200,{ge:-3}],herz:['Bluthochdruck','Tabletten und Kontrolle',300,{ge:-3}],gedaechtnis:['Vergesslichkeit','Gedächtnistraining (Aktion)',0,{in:-2,gl:-1}]};
const altS=()=>(p.alt=p.alt||{c:{},w:'zuhause',memo:0});
const AWOHN={zuhause:['Zuhause','In den eigenen vier Wänden.',0],betreut:['Betreutes Wohnen','Eigene Wohnung, Hilfe auf Knopfdruck. Weniger Stürze.',9000],kinder:['Bei den Kindern','Mehr Familie, weniger Ruhe.',0],heim:['Pflegeheim','Rundum versorgt. Besuch macht den Unterschied.',24000]};
function altYear(){if(!p||p.age<58||p.prison)return;const A=altS();
  Object.keys(ACOND).forEach(k=>{if(A.c[k])return;let r=.025+(p.age-58)*.004;if(p.st.ge<50)r*=1.5;if(typeof skMem==='function'&&skMem('lebensstil').length)r*=.6;if(A.sp>=p.age-1)r*=.6;if(k==='gedaechtnis'&&A.gt>=p.age-1)r*=.5;
    if(ch(r)){A.c[k]={y:p.age,t:0,l:1};log('Diagnose beim Arzt: '+ACOND[k][0]+'.')}});
  Object.keys(A.c).forEach(k=>{const c=A.c[k];if(k==='gedaechtnis'){if(A.gt>=p.age-1)c.t=1;else{c.t=0;if(ch(.35))c.l=Math.min(3,c.l+1)}}
    if(!c.t)Object.entries(ACOND[k][3]).forEach(([s,v])=>add(s,v*(k==='gedaechtnis'?c.l:1)))});
  if(A.w==='betreut'||A.w==='heim'){const c=px$(AWOHN[A.w][2]);p.money-=c;if(R0Out)R0Out.push(['Wohnen im Alter',c])}
  if(A.w==='heim'){add('ge',2);const vis=(p.kids||[]).some(k=>k.alive!==false&&k.rel>=60)||fkList().some(f=>f.cl>=50&&!f.st.far);add('gl',vis?1:-3)}
  if(A.w==='kinder'){add('gl',3);const k=(p.kids||[]).find(k=>k.alive!==false);if(k)k.rel=clamp(k.rel+(ch(.7)?2:-4),0,100)}
  if(A.w==='zuhause'&&p.age>=75&&p.st.ge<55&&ch(.08)&&!p.prison)p.q.push({id:'alt_sturz'});
  const once=(k,c)=>{A.ev=A.ev||{};if(!A.ev[k]&&c()){A.ev[k]=1;p.q.push({id:'alt_'+k});return true}return false};
  once('enkeltrick',()=>p.age>=70&&ch(.15))||once('jubilaeum',()=>p.age>=70&&p.partner&&p.partner.mar&&ch(.2))||
  once('fuehrerschein',()=>p.age>=80&&typeof hasLic==='function'&&hasLic('auto')&&ch(.3))||once('digital',()=>p.age>=68&&(p.kids||[]).some(k=>k.kids)&&ch(.2))||once('kreuzfahrt',()=>p.age>=66&&p.money>px$(8000)&&ch(.15))}
let R0Out=null;
{const _py=perkYear;perkYear=function(R0){R0Out=R0&&R0.out||null;_py(R0);try{altYear()}catch(e){errLog(e)}R0Out=null}}
const AE=(t,x,o)=>{const e=E(t,x,()=>true,o);e.cat='Im Alter';return e};
QEV.alt_sturz=()=>AE('Gestürzt','Im Badezimmer rutschst du aus. Zum Glück hört dich '+(p.partner?p.partner.name:'die Nachbarin')+'.',[
  ['Ins betreute Wohnen ziehen',()=>{altS().w='betreut';add('ge',-4);return 'Ein Notrufknopf am Handgelenk. Es fühlt sich sicherer an.'}],
  ['Zuhause bleiben, Haltegriffe einbauen',()=>{p.money-=px$(800);add('ge',-6);return 'Ein paar Haltegriffe und eine rutschfeste Matte. Es geht weiter.'}]]);
QEV.alt_enkeltrick=()=>{const c=px$(8000);return AE('Ein seltsamer Anruf','„Hallo Oma/Opa, ich bin’s! Ich hatte einen Unfall und brauche sofort '+eur(c)+'. Bitte sag Mama nichts!“',[
  ['Sofort das Geld überweisen',()=>{p.money-=c;add('gl',-8);mile('Opfer des Enkeltricks','bad');return 'Erst am Abend merkst du: Es war gar nicht dein Enkel. Das Geld ist weg.'}],
  ['Zurückrufen und nachfragen',()=>{add('gl',3);addRuf(2);news('Senior/in entlarvt Telefonbetrüger','lokal');return 'Dein echtes Enkelkind ist ahnungslos. Die Polizei schnappt die Betrüger dank dir.'}],
  ['Einfach auflegen',()=>'Klick. Nicht mit dir.']])};
QEV.alt_jubilaeum=()=>AE('Euer großes Jubiläum','Seit Jahrzehnten an der Seite von '+p.partner.name+'. Die Kinder wollen ein Fest organisieren.',[
  ['Großes Fest mit allen',()=>{p.money-=px$(3000);add('gl',10);relUp('partner',10);mile('Jubiläum mit '+p.partner.name,'big');return 'Die ganze Familie tanzt. '+p.partner.name+' hält eine Rede, bei der alle weinen.'}],
  ['Zu zweit an den Ort, wo alles begann',()=>{add('gl',8);relUp('partner',12);return 'Ihr sitzt auf derselben Bank wie damals. Manche Dinge ändern sich nie.'}]]);
QEV.alt_fuehrerschein=()=>AE('Noch fahren?','Beim Einparken übersiehst du einen Poller. Deine Kinder fragen vorsichtig, ob du noch fahren solltest.',[
  ['Den Führerschein freiwillig abgeben',()=>{add('gl',-2);addRuf(2);p.ticket=1;return 'Ab jetzt Bus, Taxi und Enkel-Chauffeur. Erstaunlich entspannt.'}],
  ['Eine Fahrprobe machen',()=>ch(.5)?(add('gl',3),'Der Fahrlehrer ist beeindruckt. Du darfst weiterfahren.'):(add('gl',-3),'Durchgefallen. Du gibst den Schlüssel ab.')],
  ['Weiterfahren, alles halb so wild',()=>{if(ch(.25)){p.money-=px$(2500);add('ge',-6);return 'Ein Auffahrunfall. Zum Glück nur Blechschaden. Und ein Schreck.'}return 'Es geht gut. Diesmal.'}]]);
QEV.alt_digital=()=>{const k=(p.kids||[]).find(k=>k.kids);return AE('Technik-Nachhilfe','Dein Enkelkind erklärt dir zum dritten Mal, wie man ein Foto verschickt.',[
  ['Geduldig zuhören',()=>{add('gl',4);add('in',1);return 'Am Ende schickst du allen ein Foto. Leider von deinem Daumen.'}],['Lieber anrufen wie früher',()=>{add('gl',2);return 'Manche Dinge waren früher einfach besser.'}]])};
QEV.alt_kreuzfahrt=()=>{const c=px$(4500);return AE('Kreuzfahrt?','Im Briefkasten liegt ein Prospekt: „Drei Wochen Mittelmeer für Junggebliebene“.',[
  ['Buchen ('+eur(c)+')',()=>{p.money-=c;add('gl',10);mile('Kreuzfahrt durchs Mittelmeer','star');return 'Sonnenuntergänge, Tanzabende und neue Freunde aus ganz Europa.'}],['Zu teuer',()=>'Du stellst dir das Meer einfach vor.']])};
/* Aktionen im Ruhestand */
Object.assign(ACTS,{
  seniorsport:{n:'Seniorensport',d:'Hält dich fit und senkt das Risiko für Beschwerden',ok:()=>p.age>=58,f:()=>{altS().sp=p.age;add('ge',R(2,4));add('gl',2);if(ch(.15)&&fkList().length<6&&!p.fkNew){p.fkNew=fkMake('Seniorensport');p.q.push({id:'fk_neu'})}return pick(['Wassergymnastik mit Musik aus den 80ern.','Nordic Walking im Park. Du überholst sogar jemanden.','Tanzkurs für Junggebliebene.'])}},
  gedtrain:{n:'Gedächtnistraining',d:'Hält den Kopf fit',ok:()=>p.age>=58,f:()=>{altS().gt=p.age;add('in',1);return pick(['Sudoku, Schach und ein Gedächtniskurs in der Volkshochschule.','Du lernst Italienisch. Mit 70. Warum nicht?'])}},
  enkel:{n:'Enkel hüten',d:'Die Familie rückt zusammen',ok:()=>(p.kids||[]).some(k=>k.kids&&k.alive!==false),f:()=>{const k=(p.kids||[]).filter(k=>k.kids&&k.alive!==false);const kk=pick(k);kk.rel=clamp(kk.rel+4,0,100);add('gl',6);return pick(['Ihr backt Plätzchen. Die Küche sieht aus wie nach einem Schneesturm.','Du erzählst Geschichten von früher. Die Enkel hängen an deinen Lippen.','Ein Nachmittag im Zoo, mit drei Eis pro Kopf.'])}},
  memoiren:{n:'Memoiren schreiben',d:'Dein Leben als Buch',ok:()=>p.age>=60&&(altS().memo||0)<4,f:()=>{const A=altS();A.memo=(A.memo||0)+1;if(A.memo>=4){const m=px$(R(2,30)*1000);p.money+=m;mile('Memoiren veröffentlicht','big');news(p.first+' '+p.last+' veröffentlicht Lebenserinnerungen','kultur');return 'Dein Buch ist fertig! Ein kleiner Verlag druckt es. Honorar: '+eur(m)+'.'}return 'Kapitel '+A.memo+' von 4 ist fertig.'}},
  garten:{n:'Im Kleingarten werkeln',d:'Frische Luft, Ruhe und eigene Tomaten',ok:()=>p.age>=55,f:()=>{add('gl',4);add('ge',1);return pick(['Die Tomaten werden dieses Jahr riesig.','Ein Nachmittag mit Kaffee unter dem Kirschbaum.'])}}});
Object.assign(DUR,{seniorsport:90,gedtrain:60,enkel:180,memoiren:120,garten:120});
{const f=act;act=function(id,arg){
  if(id==='altfix'){const A=altS(),c=A.c[arg],C=ACOND[arg];if(!c||c.t||!C[2])return;const cost=px$(C[2]);if(p.money<cost){toast('Das kostet '+eur(cost)+'.');return}p.money-=cost;c.t=1;add('gl',3);done(C[1]+': Es geht dir spürbar besser.');return}
  if(id==='altwohn'){const A=altS();if(!AWOHN[arg]||A.w===arg)return;if(arg==='kinder'&&!(p.kids||[]).some(k=>k.alive!==false&&k.rel>=55)){toast('Dafür braucht es ein Kind, das dich gern aufnimmt.');return}A.w=arg;mile('Neues Zuhause: '+AWOHN[arg][0],'star');done('Du wohnst jetzt: '+AWOHN[arg][0]+'.');return}
  return f(id,arg)}}
function altCard(){if(p.age<55)return '';const A=altS(),ks=Object.keys(A.c);
  let h='<section class="card altc"><h2 class="h">Gesundheit im Alter</h2>'+(ks.length?ks.map(k=>{const c=A.c[k],C=ACOND[k];return row(C[0]+(k==='gedaechtnis'&&c.l>1?' (Stufe '+c.l+')':''),c.t?(k==='gedaechtnis'?'Gut im Griff, solange du trainierst':'Behandelt: '+C[1]):'Unbehandelt · drückt auf '+Object.keys(C[3]).map(s=>STAT[s]).join(' und '),
    c.t?'<span class="chip">OK</span>':(C[2]?btn('altfix',k,C[1].split(' (')[0]+' · '+eur(px$(C[2])),'o',p.money<px$(C[2])):''))}).join(''):'<p class="note">Keine Beschwerden. Bewegung und ein wacher Kopf halten das so.</p>')+'</section>';
  h+=card('Ruhestand und Alltag',actRows(['seniorsport','gedtrain','garten','enkel','memoiren'].filter(k=>ACTS[k].ok())));
  if(p.age>=70)h+=card('Wohnen im Alter',Object.keys(AWOHN).map(k=>{const W=AWOHN[k];return row(W[0]+(A.w===k?' <small class="note">jetzt</small>':''),W[1]+(W[2]?' · '+eur(px$(W[2]))+'/Jahr':''),A.w===k?'<span class="chip">Hier</span>':btn('altwohn',k,'Umziehen','g'))}).join(''));
  return h}
{const _vl=viewLeben;viewLeben=function(){const h=_vl();if(lTab!=='ich'||p.age<55)return h;const i=h.indexOf('<section class="card"><h2 class="h">Kampf und Schutz</h2>');return i>0?h.slice(0,i)+altCard()+h.slice(i):h+altCard()}}
