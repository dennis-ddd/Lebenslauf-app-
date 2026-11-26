/* ================= Klick wird erwachsen: Nische, Saisonplan, Team, Superfans, Rangliste, Risiken, Bühnen, eigene Marke ================= */
const crReach=()=>p&&p.sm?(p.sm.fol||0)+(p.sm.ch?(p.sm.ch.subs||0)*3:0):0;
const crCF=()=>{const sm=p.sm;sm.cr=sm.cr||{};return sm.cr};
const crTeamN=()=>{const s=(p.sm&&p.sm.studio)||{};return ['cutter','manager','mods','kamera'].filter(k=>s[k]).length};
let crNow=1;

/* ---------- Nische ---------- */
const NIS={
 gaming:{n:'Gaming',post:['meme'],vid:['gaming'],mg:'reakt',mt:'Speedrun-Challenge',sp:[['Pixelhaus Games','ein neues Spiel'],['ThronSeat Pro','einen Gaming-Stuhl']]},
 fitness:{n:'Fitness',post:['workout'],vid:['fit'],mg:'fitq',mt:'Fitness-Quiz live',sp:[['FitFuel','Proteinriegel'],['Laufwerk','Laufschuhe']]},
 beauty:{n:'Beauty',post:['selfie','outfit'],vid:['style'],mg:'beautyq',mt:'Styling-Challenge',sp:[['Glanz Kosmetik','eine Pflegeserie'],['Nordend Fashion','eine Kollektion']]},
 comedy:{n:'Comedy',post:['meme','party'],vid:['comedy','vlog'],mg:'pointe',mt:'Pointen-Battle',sp:[['Brausebude','Limonade'],['TurboNet','einen Handytarif']]},
 food:{n:'Food',post:['food'],vid:['tutorial'],mg:'rezept',mt:'Koch-Challenge',sp:[['Ökofarm','Müsli'],['Pfannenprofi','Kochgeschirr']]}};
const crNis=(kind,k)=>{const n=p.sm&&p.sm.nis&&NIS[p.sm.nis];if(!n)return 1;return n[kind].includes(k)?1.3:.92};
MG.fitq=bank([['Was gehört vor jedes Training?','Aufwärmen','Ein großes Eis','Direkt Maximalgewicht'],['Wie viel trinken beim Sport?','Regelmäßig kleine Schlucke','Gar nichts','Zwei Liter auf einmal'],['Was hilft bei Muskelkater?','Lockere Bewegung','Noch härter trainieren','Drei Tage nur liegen'],['Wofür sind Kniebeugen gut?','Beine und Po','Ohrläppchen','Fingernägel'],['Wie oft Pause bei Kraftsport?','Ein Tag Pause pro Muskelgruppe','Nie','Nach jeder Wiederholung eine Woche']]);
MG.beautyq=bank([['Welche Farbe passt zu fast allem?','Marineblau','Neongrün mit Pink','Leopard auf Karo'],['Was zuerst beim Make-up?','Pflege und Grundierung','Lippenstift','Wimperntusche auf die Wange'],['Wie wäscht man Wolle?','Kalt und schonend','Kochwäsche','Im Geschirrspüler'],['Was rettet ein schlichtes Outfit?','Ein gutes Accessoire','Drei Gürtel','Socken über den Schuhen'],['Wogegen hilft Sonnencreme?','Sonnenbrand und Hautalterung','Gegen Mücken','Gegen Regen']]);
MG.pointe=bank([['„Mein Navi hat gesagt: In 300 Metern links abbiegen …“','„… seitdem wohne ich im Feldweg.“','„… und dann bin ich links abgebogen.“','„… das war schön.“'],['„Ich hab heute beim Bäcker …“','„… „Gleichfalls!“ gesagt, als sie „Guten Appetit“ meinte.“','„… ein Brot gekauft.“','„… bezahlt.“'],['„Meine Pflanze und ich haben etwas gemeinsam …“','„… wir brauchen beide Sonne und reden nicht gern.“','„… wir sind grün.“','„… nichts.“'],['„Mein Wecker und ich …“','„… haben eine Beziehung voller Schlummertasten.“','„… stehen auf.“','„… sind laut.“'],['„Diät-Tag 1:“','„… Ich habe den Salat angeschaut. Er mich auch. Wir haben beide Pizza bestellt.“','„… Salat gegessen.“','„… es war okay.“']]);
MG.rezept=bank([['Was kommt bei Nudeln ins Wasser?','Salz','Zucker','Spülmittel'],['Wann kommt Basilikum in die Soße?','Ganz am Ende','Drei Stunden mitkochen','Gar nicht, nur Petersilie'],['Wie wird ein Steak saftig?','Nach dem Braten ruhen lassen','Sofort anschneiden','In Wasser kochen'],['Was macht Teig luftig?','Hefe oder Backpulver','Mehr Salz','Kälte'],['Woran erkennt man gutes Risotto?','Cremig, mit leichtem Biss','Knusprig','Trocken und hart']]);
Object.assign(MGN,{fitq:['Fitness-Quiz','Beantworte die Fragen deiner Community.'],beautyq:['Styling-Challenge','Welcher Tipp stimmt?'],pointe:['Pointen-Battle','Welche Pointe zündet?'],rezept:['Koch-Challenge','Was ist richtig in der Küche?']});

/* ---------- Superfans und Hater ---------- */
const SFT={treu:['Treu seit Tag 1',['Ich bin seit deinem allerersten Post dabei. Bleib genau so!','Hab heute an dich gedacht. Dein Video hat meinen Tag gerettet.','Ich zeig deine Videos allen meinen Freunden.']],
 fanart:['Malt Fanart',['Ich hab dich gemalt! Ist noch nicht perfekt, aber mit Liebe gemacht 🎨','Neues Fanart ist fertig. Darf ich es posten?','Ich hab ein Logo für deinen Kanal entworfen. Nur so, als Geschenk.']],
 lang:['Schreibt lange Nachrichten',['Ich wollte dir nur mal sagen: Du hast mir durch eine schwere Zeit geholfen. Danke.','Langer Text, sorry! Aber dein Video über Mut hat mich echt bewegt.','Ich hab wegen dir angefangen, Sport zu machen. 10 Kilo leichter und glücklicher!']],
 live:['Bei jedem Stream dabei',['Wann ist der nächste Stream?? Ich hab mir den Wecker gestellt!','Gestern war der beste Stream ever. Der Chat ist eskaliert, haha.','Ich bin Moderator in meinem Herzen. Darf ich helfen?']],
 krit:['Ehrlich, auch mal kritisch',['Fand das letzte Video ehrlich gesagt schwächer. Du kannst das besser!','Bitte nicht noch mehr Werbung. Wir mögen dich wegen dir.','Respekt, dass du zu deinem Fehler gestanden hast.']]};
const SFC=['Ich bin seit Tag 1 dabei!','Bestes Profil, ich sag’s immer wieder','Fanart kommt morgen 🎨','Hab den Wecker für dich gestellt','Endlich wieder was von dir!','Ich zeig das allen meinen Freunden'];
const crHandle=()=>'@'+pick(['luna','nova','pixel','jojo','lea','finn','zoe','emil','ida','mila','ben','toni','sami','kira'])+pick(['.fan','_liebt_dich','.forever','_1','.herz','_nr1','.live']);
function crSfAdd(){const sm=p.sm;sm.sf=sm.sf||[];if(sm.sf.length>=5)return;const used=sm.sf.map(x=>x.h),h=(FANS.find(f=>!used.includes(f))||crHandle()),typ=pick(Object.keys(SFT).filter(k=>!sm.sf.some(x=>x.typ===k))||['treu']);
  const f={h,typ:typ||'treu',since:p.age,lv:60};sm.sf.push(f);log('Klick: '+h+' ist jetzt ein Superfan von dir.');return f}

/* ---------- Rangliste ---------- */
const RKN=['luna','max','nova','pixel','taylor','toni','jojo','lea','ben','mia','finn','zoe','emil','ida','paul','kim','sam','noah','ella','ole','ava','leo','nina','tim'],RKS=['.tv','_live','official','.daily','macht','.mag','zockt','kocht','lacht','.fit','world','hd'];
function crRk(){const sm=p.sm,C=crCF();if(!C.rk){const set=new Set();C.rk=[];for(let i=1;i<=99;i++){let h;do{h='@'+pick(RKN)+pick(RKS)}while(set.has(h));set.add(h);C.rk.push({h,r:Math.round(3e7*Math.pow(i,-1.25)*(.85+Math.random()*.3))})}
  if(p.rival&&p.rival.n){C.rk[R(60,95)].h='@'+String(p.rival.n).toLowerCase().replace(/[^a-zäöüß]/g,'');C.rk.forEach(x=>{if(x.h==='@'+String(p.rival.n).toLowerCase().replace(/[^a-zäöüß]/g,''))x.riv=1})}}return C.rk}
const crRank=()=>{const r=crReach();return 1+crRk().filter(x=>x.r>r).length};

/* ---------- Ereignisse ---------- */
const crBack=t=>'Mit '+t;
QEV.cr_bo=()=>EC('Gesundheit','Leer','Seit Wochen schläfst du schlecht. Jede Idee fühlt sich gleich an, jeder Kommentar trifft dich. Dein Akku ist leer.',[
  ['Eine Saison Pause machen',()=>{const sm=p.sm;sm.pl=Math.max(2,sm.pl-3);sm.vl=Math.max(1,sm.vl-1);if(sm.ch)sm.ch.sl=Math.max(1,sm.ch.sl-2);add('ge',8);add('gl',6);crCF().bo=0;smGain(-sm.fol*.03);(sm.sz=sm.sz||['normal','normal','normal','normal'])[0]='pause';return 'Handy aus, Wald an. Ein paar Follower gehen. Du kommst zurück.'}],
  ['Weitermachen',()=>{add('ge',-10);add('gl',-8);crCF().bo=4;return 'Du lächelst in die Kamera. Nach dem Dreh weinst du im Auto.'}]],'Zu viel Arbeit ohne Team');
QEV.cr_streit=d=>{const T=(p.sm.team||{}),[a,b]=String(d).split(':');if(!T[a]||!T[b])return null;
  return EC('Karriere','Krach im Team',T[a].n+' ('+STUDIO[a][0]+') und '+T[b].n+' ('+STUDIO[b][0]+') streiten seit Tagen. Wer hat das Thumbnail verbockt? Die Stimmung ist im Keller.',[
    ['Alle an einen Tisch holen',()=>{T[a].mood=Math.min(100,T[a].mood+12);T[b].mood=Math.min(100,T[b].mood+12);add('gl',-1);return 'Pizza, ehrliche Worte, ein Handschlag. Das Team ist wieder eins.'}],
    ['Zu '+T[a].n+' halten',()=>{delete p.sm.studio[b];delete T[b];T[a].mood=Math.min(100,T[a].mood+8);return T[b]?'':'Die andere Seite kündigt. Es ist ruhiger. Aber auch leerer.'}],
    ['Raushalten',()=>{T[a].mood-=10;T[b].mood-=10;return 'Du schaust weg. Die Stimmung wird nicht besser.'}]])};
QEV.cr_weg=k=>{const t=(p.sm.team||{})[k];if(!t||!p.sm.studio[k])return null;const rv=p.rival?esc(p.rival.n):'Ein großer Creator';
  return EC('Karriere','Abgeworben?',t.n+' kommt zu dir: „'+rv+' bietet mir mehr Geld. Ich weiß nicht, was ich machen soll.“',[
    ['Mehr Gehalt anbieten',()=>{t.bonus=1;t.mood=Math.min(100,t.mood+25);return t.n+' bleibt. Kostet '+eur(px$(5000))+' mehr im Jahr.'}],
    ['Gehen lassen',()=>{delete p.sm.studio[k];delete p.sm.team[k];add('gl',-2);return t.n+' räumt den Schreibtisch. Ihr umarmt euch trotzdem.'}]])};
QEV.cr_treffen=()=>EC('Freunde','Fan-Treffen',(p.sm.sf||[]).map(x=>x.h).slice(0,3).join(', ')+' und viele andere fragen: „Machst du ein Fan-Treffen?“',[
  ['Treffen im Park',()=>{add('gl',7);p.sm.trust=Math.min(100,p.sm.trust+5);(p.sm.sf||[]).forEach(x=>x.lv=Math.min(100,x.lv+10));smGain(p.sm.fol*.02);return 'Hunderte kommen. Selfies, Umarmungen, ein Fan weint vor Glück.'}],
  ['Online-Treffen',()=>{add('gl',3);p.sm.trust=Math.min(100,p.sm.trust+2);return 'Zwei Stunden Videocall. Gemütlich und nah.'}],
  ['Lieber nicht',()=>{(p.sm.sf||[]).forEach(x=>x.lv=Math.max(0,x.lv-8));return 'Ein paar sind enttäuscht.'}]]);
QEV.cr_hater=()=>{const H=crCF().hat;if(!H)return null;
  return EC('Freunde','Der Hater',H.h+' kommentiert unter jedem deiner Posts. Immer gemein, immer zuerst.',[
    ['Ignorieren',()=>{add('gl',-1);H.n++;return 'Du liest es trotzdem. Jedes Mal.'}],
    ['Freundlich antworten',()=>{if(ch(.45)){crCF().hat=null;const f=crSfAdd();if(f){f.h=H.h;f.typ='krit'}return 'Plötzlich eine lange Nachricht: „Sorry. Ging mir echt schlecht.“ Heute ist '+H.h+' einer deiner treuesten Fans.'}add('gl',-2);return 'Die Antwort wird gescreenshottet und verspottet. Na toll.'}],
    ['Blockieren',()=>{crCF().hat=null;add('gl',2);return 'Weg. Einfach so. Herrlich.'}]])};
QEV.cr_stalk=()=>EC('Freunde','Ein Fan geht zu weit','Jemand wartet seit Tagen vor deinem Haus. Er kennt deinen Tagesablauf und schreibt: „Ich weiß, dass du mich auch magst.“',[
  ['Polizei einschalten',()=>{add('gl',-3);return 'Ein Kontaktverbot. Die Angst bleibt noch eine Weile, aber du bist sicher.'}],
  ['Umziehen',()=>{p.money-=Math.min(Math.max(0,p.money),px$(5000));add('gl',-2);crCF().moved=1;return 'Neue Wohnung, Adresse geheim. Du zeigst nie wieder dein Fenster in Videos.'}],
  ['Öffentlich darüber sprechen',()=>{p.sm.trust=Math.min(100,p.sm.trust+6);smGain(p.sm.fol*.02);add('gl',-1);return 'Tausende stehen hinter dir. Andere Creator erzählen von ähnlichen Erlebnissen.'}]]);
QEV.cr_box=d=>EC('Karriere','Creator-Boxkampf',d+' fordert dich heraus: ein Boxkampf live vor Millionen. Die Klicks wären gigantisch.',[
  ['Annehmen und trainieren',()=>{const w=ch(.3+((p.sk&&p.sk.kampf)||0)/150+(p.st.ge||50)/400);if(p.sk)p.sk.kampf=Math.min(100,(p.sk.kampf||0)+6);
    if(w){smGain(p.sm.fol*.15);p.money+=px$(R(20000,80000));mile('Creator-Boxkampf gewonnen','star');add('gl',8);return 'Dritte Runde, ein sauberer Treffer. Sieg! Die Arena tobt.'}smGain(p.sm.fol*.05);add('gl',-6);add('ge',-8);return 'Niederlage nach Punkten. Aber alle reden darüber, und deine Nase heilt.'}],
  ['Ablehnen',()=>{p.sm.trust=Math.min(100,p.sm.trust+2);return '„Ich prügle mich nicht für Klicks.“ Viele finden das stark.'}]]);
QEV.cr_fake=()=>{const C=crCF();if(!C.fake)return null;
  return EC('Karriere','Fake-Follower fliegen auf','Ein Blog zeigt: Tausende deiner Follower sind Bots. Die Screenshots gehen herum.',[
    ['Ehrlich entschuldigen',()=>{smGain(-C.fake*1.2);p.sm.trust=Math.max(10,p.sm.trust-12);C.fake=0;return 'Du gibst es zu. Peinlich, aber viele rechnen dir die Ehrlichkeit an.'}],
    ['Abstreiten',()=>{smGain(-C.fake*1.5);p.sm.trust=Math.max(10,p.sm.trust-25);C.fake=0;add('gl',-3);return 'Die Beweise sind eindeutig. Das Abstreiten macht alles schlimmer.'}]],crBack((C.fakeA||p.age)+': Follower gekauft'))};
QEV.cr_hack=()=>EC('Karriere','Konto gehackt','Du kommst nicht mehr in dein Klick-Konto. Jemand postet Werbung für Krypto-Betrug in deinem Namen.',[
  ['Den Support kontaktieren',()=>{smGain(-p.sm.fol*.08);p.sm.trust=Math.max(10,p.sm.trust-3);return 'Drei Wochen Chaos, dann ist das Konto zurück. Ein paar Follower sind weg.'}],
  ['Dem Hacker zahlen',()=>{const c=px$(5000);p.money-=Math.min(Math.max(0,p.money),c);if(ch(.5))return 'Er gibt das Konto zurück. Ein bitterer Preis.';smGain(-p.sm.fol*.15);return 'Geld weg, Konto auch erst nach Wochen zurück. Lektion gelernt.'}],
  ['Ganz neu anfangen',()=>{smGain(-p.sm.fol*.4);p.sm.trust=Math.min(100,p.sm.trust+5);return 'Neues Konto, neue Zwei-Faktor-Anmeldung. Die echten Fans finden dich wieder.'}]]);
QEV.cr_ban=()=>EC('Karriere','Kanal gesperrt','Klick sperrt deinen Kanal vorübergehend. Grund: „Verstöße gegen die Werberichtlinien“.',[
  ['Einspruch einlegen',()=>{if(ch(.5)){p.sm.trust=Math.max(10,p.sm.trust-2);return 'Der Einspruch klappt. Nach zwei Tagen bist du wieder online.'}if(p.sm.ch){p.sm.ch.sl=0;p.sm.ch.com=Math.max(0,p.sm.ch.com-10)}p.sm.vl=0;return 'Abgelehnt. Dieses Jahr gibt es keine Streams und Videos mehr.'}],
  ['Die Sperre absitzen',()=>{if(p.sm.ch)p.sm.ch.sl=0;p.sm.vl=0;p.sm.trust=Math.min(100,p.sm.trust+3);return 'Ein Jahr ohne Kanal. Du nutzt es, um durchzuatmen.'}]],'Riskante Werbeverträge');
QEV.cr_old=()=>{const o=crCF().oldP;if(!o)return null;
  return EC('Karriere','Ein alter Post taucht auf','Jemand hat einen Post von dir ausgegraben, den du mit '+o.a+' geschrieben hast: „'+o.cap+'“. Er geht herum, mit bösen Kommentaren.',[
    ['Sich entschuldigen',()=>{p.sm.trust=Math.max(10,p.sm.trust-4);smGain(-p.sm.fol*.02);return '„Ich war '+o.a+' und dumm. Ich hab dazugelernt.“ Die meisten lassen es gut sein.'}],
    ['Mit Humor nehmen',()=>{if(ch(.5)){smGain(p.sm.fol*.04);return 'Du reagierst mit einem Video über dein jüngeres Ich. Die Leute lieben es.'}p.sm.trust=Math.max(10,p.sm.trust-10);return 'Der Witz kommt nicht an. Jetzt bist du auch noch „unbelehrbar“.'}],
    ['Ignorieren',()=>{p.sm.trust=Math.max(10,p.sm.trust-8);return 'Es dauert zwei Wochen, bis das Internet etwas Neues findet.'}]],'Mit '+o.a+': dieser eine Post')};
const STG={messe:[5e4,'Creator-Messe','Die große Creator-Messe lädt dich als Gast ein. Bühne, Autogramme, Fans aus dem ganzen Land.','Hinfahren',()=>{add('gl',8);smGain(p.sm.fol*.05);crSfAdd();return 'Die Schlange vor deinem Stand reicht bis zum Ausgang.'}],
 single:[1e5,'Eine eigene Single?','Ein Label fragt: „Willst du einen Song aufnehmen?“ Singen kannst du … naja.','Aufnehmen',()=>{p.money-=Math.min(Math.max(0,p.money),px$(8000));if(ch(.3)){p.money+=px$(R(20000,120000));smGain(p.sm.fol*.1);mile('Eigene Single in den Charts','star');return 'Ein Ohrwurm! Platz 12 in den Charts.'}smGain(p.sm.fol*.02);p.sm.trust=Math.max(10,p.sm.trust-3);return 'Der Song wird ein Meme. Nicht so, wie du gehofft hattest.'}],
 reality:[2e5,'Einladung zur Reality-Show','Zwei Wochen im Dschungel-Camp-Verschnitt „Promi-Insel“. Die Gage ist hoch.','Zusagen',()=>{p.money+=px$(40000);smGain(p.sm.fol*.15);p.sm.trust=Math.max(10,p.sm.trust-8);add('gl',ch(.5)?6:-6);mile('Bei der Promi-Insel','star');return 'Kakerlaken, Lagerfeuer und ein Zusammenbruch vor laufender Kamera. Ganz Deutschland kennt dich jetzt.'}],
 buch:[3e5,'Ein Buchvertrag','Ein Verlag will ein Buch von dir: dein Leben, deine Tipps, deine Geschichte.','Selbst schreiben',()=>{p.money+=px$(R(20000,60000));add('in',2);p.sm.trust=Math.min(100,p.sm.trust+3);mile('Eigenes Buch veröffentlicht','star');return 'Lesereise, Signierstunden, Platz 4 der Bestsellerliste.'}]};
QEV.cr_stg=k=>{const S=STG[k];if(!S)return null;return EC('Karriere',S[1],S[2],[[S[3],S[4]],['Absagen',()=>'Nicht alles muss man machen.']])};
const BRT={energy:['Energy-Drink',n=>n.toUpperCase()+' Energy'],kosmetik:['Kosmetik',n=>'Glow by '+n],mode:['Mode',n=>n.toUpperCase()+' Wear']};
QEV.cr_marke=()=>EC('Karriere','Deine eigene Marke','Eine Agentur schlägt vor: „Mit deiner Reichweite brauchst du eine eigene Marke. Was passt zu dir?“',[
  ...Object.keys(BRT).map(k=>[BRT[k][0],()=>{const c=px$(30000),own=p.money>=c;if(own)p.money-=c;p.sm.brand={k,n:BRT[k][1](p.first),a:p.age,share:own?1:.5,val:px$(own?60000:40000)};mile('Eigene Marke: '+p.sm.brand.n,'big');
    return own?'„'+p.sm.brand.n+'“ ist gestartet. Alles auf eigene Rechnung.':'Ein Investor zahlt den Start und bekommt dafür die Hälfte. „'+p.sm.brand.n+'“ ist gestartet.'}]),
  ['Kein Interesse',()=>'Du bleibst lieber vor der Kamera.']]);
QEV.cr_brand_ev=d=>{const b=p.sm.brand;if(!b)return null;const good=d==='1';
  return good?EC('Karriere','Ausverkauft!','„'+b.n+'“ ist nach einem viralen Video überall ausverkauft.',[['Nachproduzieren',()=>{b.val=Math.round(b.val*1.4);p.money+=Math.round(px$(R(10000,40000))*b.share);return 'Die Fabrik läuft Tag und Nacht. Die Marke ist jetzt viel mehr wert.'}]])
   :EC('Karriere','Rückruf','Bei „'+b.n+'“ gibt es Beschwerden. Eine Charge muss zurückgerufen werden.',[['Offen damit umgehen',()=>{b.val=Math.round(b.val*.8);p.sm.trust=Math.max(10,p.sm.trust-3);return 'Teuer, aber ehrlich. Die meisten Kunden bleiben.'}],['Herunterspielen',()=>{b.val=Math.round(b.val*.6);p.sm.trust=Math.max(10,p.sm.trust-12);return 'Die Presse findet es trotzdem heraus. Autsch.'}]])};
QEV.cr_nisdeal=()=>{const n=NIS[p.sm.nis];if(!n)return null;const S=pick(n.sp),pay=Math.round(Math.max(px$(800),crReach()*.012)/10)*10;
  return EC('Karriere','Ein Deal, der passt',S[0]+' ist begeistert von deinem '+n.n+'-Content und will eine Zusammenarbeit für '+S[1]+'.',[
    ['Annehmen ('+eur(pay)+')',()=>{p.money+=pay;p.sm.trust=Math.min(100,p.sm.trust+1);p.sm.earn+=pay;return 'Passt perfekt zu dir. Die Community findet es sogar gut.'}],['Ablehnen',()=>'Vielleicht nächstes Jahr.']])};

/* ---------- Posts und Videos: Nische, Kamera, Algorithmus, Superfans ---------- */
{const _sm=smMult;smMult=function(){const sm=p.sm,ss=(sm&&sm.cr&&sm.cr.ss)||0;return _sm.apply(this,arguments)*crNow*(1+Math.min(.35,ss*.012))}}
{const _dp=doPost;doPost=function(type){const sm=p.sm,n0=sm&&sm.posts?sm.posts.length&&sm.posts[0].id:null;crNow=crNis('post',type)*(sm&&sm.studio&&sm.studio.kamera?1.25:1);let r;try{r=_dp.apply(this,arguments)}finally{crNow=1}
  try{const po=sm&&sm.posts&&sm.posts[0];if(po&&po.id!==n0){if(sm.sf&&sm.sf.length&&ch(.7)){const f=pick(sm.sf);po.com[0]=[f.h,pick(SFC)]}if(p.age<=19&&!crCF().oldP&&(sm.mood==='wild'||ch(.25)))crCF().oldP={a:p.age,cap:po.cap};}}catch(e){errLog(e,'crpost')}return r}}
{const _dv=doVideo;doVideo=function(g){const sm=p.sm;crNow=crNis('vid',g)*(sm&&sm.studio&&sm.studio.kamera?1.25:1);try{return _dv.apply(this,arguments)}finally{crNow=1}}}
try{STUDIO.kamera=['Kamera-Team','Filmt und fotografiert für dich: Posts und Videos 1,25× besser.',0,10000]}catch(e){errLog(e,'kam')}

/* ---------- Jahresende ---------- */
{const _sy=smYear;smYear=function(){const sm=p.sm;let used=0;try{if(sm){ensureSm();const c=sm.ch;used=Math.max(0,postBudget()-sm.pl)+Math.max(0,3-sm.vl)+(c?Math.max(0,streamBudget()-c.sl):0)}}catch(e){errLog(e,'cr0')}
  let inc=_sy.apply(this,arguments);if(!sm||!p.sm)return inc;
  try{const C=crCF(),q=x=>p.q.push(typeof x==='string'?{id:x}:x),reach=crReach(),tn=crTeamN();if(C.a0==null)C.a0=p.age;
    /* Saisonplan und Algorithmus */
    const sz=sm.sz||(sm.sz=['normal','normal','normal','normal']),exp=sz.reduce((s,x)=>s+(x==='viel'?4:x==='normal'?2:0),0),np=sz.filter(x=>x==='pause').length;
    if(exp>0&&used>=exp*.8){C.ss=(C.ss||0)+sz.filter(x=>x!=='pause').length+sz.filter(x=>x==='viel').length;C.lastOk=1;if(C.ss>=8)log('Klick: Saisonplan erfüllt. Deine Serie: '+C.ss+'. Der Algorithmus liebt dich.')}
    else if(exp>0){if((C.ss||0)>=4)log('Klick: Saisonplan nicht geschafft. Die Serie ist gerissen.');C.ss=0;C.lastOk=0}
    sz.forEach((x,i)=>{if(x==='pause')sz[i]='normal'});
    /* Belastung und Burnout */
    const cap=8+tn*4;C.bo=Math.max(0,(C.bo||0)+Math.max(0,used-cap)-np*3-1);
    if(C.bo>=8&&tn<2&&(sm.fol>=10000||(p.job&&p.job.id==='influ'))&&(!C.boY||p.age-C.boY>=6)){C.boY=p.age;q('cr_bo')}
    /* Team */
    sm.team=sm.team||{};Object.keys(sm.team).forEach(k=>{if(!sm.studio[k]){delete sm.team[k];return}const t=sm.team[k];t.mood=clamp(t.mood+2-Math.max(0,used-cap)*1.5,0,100);if(t.bonus)inc-=px$(5000)});
    if(sm.studio.kamera)inc-=px$(STUDIO.kamera[3]);
    const tk=Object.keys(sm.team).filter(k=>sm.studio[k]);
    if(tk.length>=2&&ch(.2)&&(!C.stY||p.age-C.stY>=3)){C.stY=p.age;const [a,b]=shuffle(tk.slice());q({id:'cr_streit',d:a+':'+b})}
    else{const low=tk.find(k=>sm.team[k].mood<35&&!sm.team[k].bonus);if(low&&ch(.5))q({id:'cr_weg',d:low})}
    /* Superfans, Hater, Fan-Post */
    sm.sf=sm.sf||[];[500,5000,5e4,5e5,5e6].forEach((t,i)=>{if(sm.fol>=t&&sm.sf.length<=i)crSfAdd()});
    if(sm.sf.length){const n=Math.min(sm.sf.length,R(1,2));shuffle(sm.sf.slice()).slice(0,n).forEach(f=>{const t=chatPick('sf_'+f.typ,SFT[f.typ][1]);if(t)msg('g_fans',f.h+': '+t)})}
    if(sm.sf.length>=2&&sm.fol>=2e4&&(!C.trY||p.age-C.trY>=5)&&ch(.35)){C.trY=p.age;q('cr_treffen')}
    if(!C.hat&&!C.hatDone&&sm.fol>=3e4&&ch(.2)){C.hat={h:crHandle().replace(/\.(fan|herz|forever)|_liebt_dich|_nr1/,'_echt'),n:0};C.hatDone=1;q('cr_hater')}else if(C.hat&&ch(.4)){if((C.hat.q||0)>=2){C.hat=null;log('Klick: Der Hater ist verschwunden. Einfach so.')}else{C.hat.q=(C.hat.q||0)+1;q('cr_hater')}}
    if(sm.fol>=5e5&&!C.stalk&&ch(.05)){C.stalk=1;q('cr_stalk')}
    /* Rangliste */
    const rk=crRk();rk.forEach(x=>{x.r=Math.round(x.r*(x.riv?(.9+Math.random()*.35):(.9+Math.random()*.28)))});if(p.rival){const rv=rk.find(x=>x.riv);if(rv&&reach>5e4)rv.r=Math.round(Math.max(rv.r,reach*(.7+Math.random()*.6)))}
    const rkN=crRank(),rkP=C.rkP;C.rkP=rkN;if(rkN<=100){if(rkP==null||rkP>100){mile('Top 100 Creator im Land','star')}else if(rkN<rkP-4)log('Klick-Rangliste: Du steigst auf Platz '+rkN+'.');else if(rkN>rkP+4){const ov=rk.filter(x=>x.r>reach).sort((a,b)=>a.r-b.r)[0];log('Klick-Rangliste: '+(ov?ov.h+' hat dich überholt. ':'')+'Du bist jetzt auf Platz '+rkN+'.')}
      if(rkN<=10&&!(C.top10))(C.top10=1,mile('Top 10 Creator im Land','big'))}
    if(rkN<=60&&reach>=2e5&&!C.box&&ch(.35)){C.box=1;const above=rk.filter(x=>x.r>reach).sort((a,b)=>a.r-b.r)[0];q({id:'cr_box',d:above?above.h:'Ein Top-Creator'})}
    /* Risiken */
    if(C.fake&&ch(.3))q('cr_fake');
    if(sm.fol>=5e4&&!C.hack&&ch(.04)){C.hack=1;q('cr_hack')}
    if(sm.ch&&(sm.spon.some(k=>{const S=SPONS.find(x=>x[0]===k);return S&&S[4]})||sm.trust<30)&&ch(.15)&&(!C.banY||p.age-C.banY>=5)){C.banY=p.age;q('cr_ban')}
    if(sm.ch&&ch(.05)&&inc>0){inc=Math.round(inc*.6);log('Klick: Algorithmus-Update! Deine Werbeeinnahmen sind dieses Jahr um 40 % eingebrochen.')}
    if(C.oldP&&!C.oldDone&&sm.fol>=1e5&&p.age>=22&&ch(.2)){C.oldDone=1;q('cr_old')}
    /* Bühnen und Marke */
    C.stg=C.stg||{};const st=Object.keys(STG).find(k=>!C.stg[k]&&reach>=STG[k][0]);if(st&&ch(.4)){C.stg[st]=1;q({id:'cr_stg',d:st})}
    if(!sm.brand&&!C.brAsk&&reach>=2.5e5&&p.age>=18&&ch(.35)){C.brAsk=1;q('cr_marke')}
    if(sm.brand){const b=sm.brand,rev=Math.round(reach*.03*(sm.trust/80)*(.6+Math.random()*.8)*b.share*(p.biz&&p.biz.co?1.2:1));inc+=rev;b.val=Math.round(b.val*(.95+Math.random()*.15)+rev*.5);b.last=rev;if(ch(.1))q({id:'cr_brand_ev',d:ch(.5)?'1':'0'})}
    if(sm.nis&&reach>=5000&&ch(.4)&&(!C.ndY||p.age-C.ndY>=6)){C.ndY=p.age;q('cr_nisdeal')}
    C.mgY=null;
  }catch(e){errLog(e,'crYear')}return inc}}

/* ---------- Ansicht ---------- */
Object.assign(FOLDT,{'Deine Nische':0,'Saisonplan':1,'Superfans':1,'Top 100 Creator':1,'Dein Team':0,'Deine Marke':0});
const SZN=['Frühling','Sommer','Herbst','Winter'],SZL={normal:['Normal','2 Inhalte'],viel:['Vollgas','4 Inhalte'],pause:['Pause','erholen']};
function crProfil(){const sm=p.sm,C=crCF(),lock=!!p.prison;let h='';
  const n=NIS[sm.nis];
  h+='<section class="card"><h2 class="h">Deine Nische</h2>'+(n?'<p class="note">'+n.n+': passende Posts und Videos erreichen 30 % mehr Leute, und Firmen aus der Branche melden sich.</p><div class="btns">'+btn('crmg',null,C.mgY===p.age?n.mt+' erledigt':n.mt,'o',lock||C.mgY===p.age)+btn('crnis','','Nische wechseln','g')+'</div>':
    '<p class="note">Wofür sollen dich die Leute kennen? Mit einer Nische wächst du schneller, aber anderes zieht etwas weniger.</p><div class="amts">'+Object.keys(NIS).map(k=>'<button class="amt" data-a="crnis" data-g="'+k+'">'+NIS[k].n+'</button>').join('')+'</div>')+'</section>';
  const sz=sm.sz||(sm.sz=['normal','normal','normal','normal']),exp=sz.reduce((s,x)=>s+(x==='viel'?4:x==='normal'?2:0),0),used=Math.max(0,postBudget()-sm.pl)+Math.max(0,3-sm.vl)+(sm.ch?Math.max(0,streamBudget()-sm.ch.sl):0);
  h+='<section class="card"><h2 class="h">Saisonplan</h2><p class="note">Plane die vier Saisons. Wer seinen Plan schafft, baut eine Serie auf, und der Algorithmus belohnt das. Pausen schützen vor Burnout.</p><div class="szg">'+
    sz.map((x,i)=>'<button class="szb sz-'+x+'" data-a="crsz" data-g="'+i+'"><small>'+SZN[i]+'</small><b>'+SZL[x][0]+'</b><small>'+SZL[x][1]+'</small></button>').join('')+'</div>'+
    '<div class="mrow"><span>Dieses Jahr geschafft</span><b>'+used+' von '+exp+' Inhalten</b></div><div class="mrow"><span>Serie</span><b class="up">'+(C.ss||0)+' · +'+Math.round(Math.min(.35,(C.ss||0)*.012)*100)+' % Reichweite</b></div>'+
    (crTeamN()<2&&(C.bo||0)>=4?'<p class="note warn">Du arbeitest am Limit. Plane eine Pause oder hol dir ein Team.</p>':'')+'</section>';
  if((sm.sf||[]).length)h+='<section class="card"><h2 class="h">Superfans</h2>'+sm.sf.map(f=>row(esc(f.h),SFT[f.typ][0]+' · seit '+f.since,'<span class="kbar sm"><i style="width:'+f.lv+'%"></i></span>')).join('')+(C.hat?row(esc(C.hat.h),'Hater · kommentiert unter jedem Post','<span class="chip">Hater</span>'):'')+'<div class="btns">'+btn('crfans',null,'Fan-Post lesen','g')+'</div></section>';
  if(crReach()>=1000){const rk=crRk(),me=crReach(),r=crRank(),L=rk.map(x=>({h:x.h,r:x.r,riv:x.riv})).concat([{h:sm.h,r:me,me:1}]).sort((a,b)=>b.r-a.r),i=L.findIndex(x=>x.me);
    const show=new Set([0,1,2,i-1,i,i+1].filter(k=>k>=0&&k<Math.min(L.length,101)));
    h+='<section class="card"><h2 class="h">Top 100 Creator</h2><p class="note">'+(r<=100?'Du bist auf Platz '+r+' im ganzen Land.':'Noch nicht in den Top 100. Platz 100 hat '+kfmt(L[99].r)+' Reichweite, du '+kfmt(me)+'.')+'</p>'+
      [...show].sort((a,b)=>a-b).map(k=>{const x=L[k];return '<div class="mrow rk'+(x.me?' me':'')+'"><span>'+(k+1)+'. '+esc(x.h)+(x.riv?' <small>(Rivale)</small>':'')+'</span><b>'+kfmt(x.r)+'</b></div>'}).join('')+
      (C.fake?'':'<div class="btns">'+btn('crfake',null,'10.000 Follower kaufen ('+eur(px$(400))+')','g',lock||C.fakeY===p.age||p.money<px$(400))+'</div><p class="note">Geht schnell. Fliegt aber oft auf.</p>')+'</section>'}
  return h}
function crBiz(){const sm=p.sm;let h='';sm.team=sm.team||{};const tk=Object.keys(sm.team).filter(k=>sm.studio[k]);
  if(tk.length)h+='<section class="card"><h2 class="h">Dein Team</h2>'+tk.map(k=>{const t=sm.team[k];return row(esc(t.n),STUDIO[k][0]+' · Stimmung '+(t.mood>=65?'gut':t.mood>=35?'geht so':'schlecht')+(t.bonus?' · mit Gehaltsplus':''),'<span class="kbar sm"><i style="width:'+t.mood+'%"></i></span>')}).join('')+'<p class="note">Ein Team schafft mehr und schützt dich vor Burnout. Zu viel Arbeit drückt aber auf die Stimmung.</p></section>';
  if(sm.brand){const b=sm.brand;h+='<section class="card"><h2 class="h">Deine Marke</h2>'+row(esc(b.n),BRT[b.k][0]+' · seit '+b.a+(b.share<1?' · 50 % gehören dem Investor':''),'<b class="num up">'+eur(b.val*b.share)+'</b>')+(b.last?'<p class="note">Letztes Jahr: '+eur(b.last)+' Gewinn für dich'+(p.biz&&p.biz.co?' (über '+esc(p.biz.co.name)+' vertrieben, +20 %)':'')+'.</p>':'')+'<div class="btns">'+btn('crbrsell',null,'Marke verkaufen','g',!!p.prison)+'</div></section>'}
  return h}
{const _vk=viewKlick;viewKlick=function(){let h=_vk.apply(this,arguments);try{if(p&&p.sm){if(smTab==='profil')h+=crProfil();if(smTab==='biz')h+=crBiz()}}catch(e){errLog(e,'crView')}return h}}

/* ---------- Fan-Post im Chat ---------- */
{const _co=contacts;contacts=function(){const c=_co.apply(this,arguments);try{if(p&&p.sm&&(p.sm.sf||[]).length&&!c.some(x=>x.id==='g_fans'))c.push({id:'g_fans',n:'Fan-Post',col:'#E5407A',sub:'Nachrichten deiner Superfans',msgs:(p.chats.g_fans||{}).msgs||[],un:(p.chats.g_fans||{}).un||0})}catch(e){errLog(e,'crco')}return c}}
{const _ro=replyOpts;replyOpts=function(cid){if(cid==='g_fans')return [['lieb','Lieb','Danke dir, das bedeutet mir echt viel! ❤️',3],['kurz','Kurz','Danke 🙏',1],['frech','Genervt','Bitte keine Privatnachrichten mehr.',-4]];return _ro.apply(this,arguments)}}

/* ---------- Aktionen ---------- */
{const f=act;act=function(id,arg){try{const sm=p&&p.sm;
  if(id==='crnis'&&sm){if(!arg){if(sm.nis){sm.nis=null;sm.trust=Math.max(10,sm.trust-8);smGain(-sm.fol*.05);done('Nische aufgegeben. Ein Teil der Community ist irritiert.')}return 1}if(!NIS[arg])return 1;sm.nis=arg;done('Deine Nische: '+NIS[arg].n+'.');return 1}
  if(id==='crsz'&&sm){const sz=sm.sz||(sm.sz=['normal','normal','normal','normal']),i=+arg;if(sz[i]==null)return 1;sz[i]=sz[i]==='normal'?'viel':sz[i]==='viel'?'pause':'normal';save();render();return 1}
  if(id==='crmg'&&sm){const n=NIS[sm.nis],C=crCF();if(!n||C.mgY===p.age||p.prison)return 1;C.mgY=p.age;mgStart(n.mg,3,n.mt,sc=>{const g=Math.round((sm.fol*.01+50)*(sc+1));smGain(g);if(sc>=2)sm.trust=Math.min(100,sm.trust+2);done(n.mt+': '+sc+' von 3. '+(sc>=2?'Die Community feiert dich!':'Nicht ganz dein Tag.')+' +'+kfmt(g)+' Follower.')},sm.nis==='fitness'?p.st.ge:sm.nis==='beauty'?p.st.au:p.st.in);return 1}
  if(id==='crfans'){f('goto','chats');return f('chat','g_fans')}
  if(id==='crfake'&&sm){const C=crCF(),c=px$(400);if(C.fake||C.fakeY===p.age||p.money<c||p.prison)return 1;p.money-=c;C.fakeY=p.age;C.fake=10000;C.fakeA=p.age;smGain(10000);done('10.000 neue Follower. Seltsam stille Follower.');return 1}
  if(id==='crbrsell'&&sm&&sm.brand){const b=sm.brand,v=Math.round(b.val*b.share);p.money+=v;mile('Marke „'+b.n+'“ verkauft','star');sm.brand=null;done('„'+b.n+'“ für '+eur(v)+' verkauft.');return 1}
  if(id==='studio'&&sm){const had=!!sm.studio[arg],r=f(id,arg);try{sm.team=sm.team||{};if(!had&&sm.studio[arg]&&arg!=='merch'){const g=pick(['w','m']);sm.team[arg]={n:pick(g==='w'?FN:MN),g,mood:70}}if(had&&!sm.studio[arg])delete sm.team[arg]}catch(e){errLog(e,'crteam')}return r}
  if(id==='reply'&&String(arg).startsWith('g_fans:')&&sm){const k=String(arg).split(':')[1],r=f(id,arg);sm.trust=clamp(sm.trust+(k==='lieb'?2:k==='frech'?-3:0),10,100);const sf=(sm.sf||[])[0];if(sf)sf.lv=clamp(sf.lv+(k==='lieb'?6:k==='frech'?-12:0),0,100);return r}
}catch(e){errLog(e,'crAct')}return f(id,arg)}}
