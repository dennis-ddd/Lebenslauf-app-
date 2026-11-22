/* ================= Kinderalltag: passende Aktivitäten, Arztbesuche mit den Eltern, bessere Chats ================= */
const parentN=()=>!p.parentsGone?(relOf('mama')>=relOf('papa')?'Mama':'Papa'):'Oma';

/* ---------- Aktivitäten für Kinder und Jugendliche ---------- */
Object.assign(ACTS,{
 kuscheln:{n:'Mit Mama und Papa kuscheln',d:'Glück +, Familie +',ok:()=>p.age<6&&!p.parentsGone,f:()=>{add('gl',R(3,6));relUp('mama',3);relUp('papa',3);return 'Warm, weich und sicher. Der beste Ort der Welt.'}},
 schlaf:{n:'Mittagsschlaf',d:'Gesundheit +',ok:()=>p.age<5,f:()=>{add('ge',R(2,4));return 'Zwei Stunden tief und fest geschlafen.'}},
 bilderbuch:{n:'Bilderbuch anschauen',d:'Intelligenz +',ok:()=>p.age>=1&&p.age<5,f:()=>{add('in',R(1,3));return 'Du zeigst auf jedes Tier und sagst laut, wie es heißt.'}},
 vorlesen:{n:'Vorlesen lassen',d:'Intelligenz +, Familie +',ok:()=>p.age>=2&&p.age<8,f:()=>{add('in',R(2,4));relUp(parentN()==='Papa'?'papa':'mama',3);return parentN()+' liest vor. Beim dritten Mal kannst du die Geschichte mitsprechen.'}},
 malen:{n:'Malen',d:'Glück +',ok:()=>p.age>=3&&p.age<12,f:()=>{add('gl',R(2,5));if(ch(.3))add('in',1);return 'Ein Bild für den Kühlschrank. Mama findet es wunderschön.'}},
 spielplatz:{n:'Auf den Spielplatz',d:'Glück +, Fitness +',ok:()=>p.age>=2&&p.age<11,f:()=>{add('gl',R(3,6));p.sk.form=Math.min(100,(p.sk.form||0)+1);return 'Rutsche, Schaukel, Klettergerüst. Und Sand in jeder Tasche.'}},
 kspielen:{n:'Mit Freunden spielen',d:'Glück +, Freundschaft +',ok:()=>p.age>=6&&p.age<13,f:()=>{add('gl',R(3,6));relUp('freund',5);return 'Verstecken, Fangen, eine Bande gründen. Der Nachmittag ist viel zu kurz.'}},
 fahrrad:{n:'Fahrrad fahren',d:'Fitness +, Glück +',ok:()=>p.age>=6&&p.age<16,f:()=>{p.sk.form=Math.min(100,(p.sk.form||0)+2);add('gl',R(2,4));return 'Freihändig! Fast.'}},
 zocken:{n:'Videospiele spielen',d:'Glück +',ok:()=>p.age>=8&&p.age<18,f:()=>{add('gl',R(3,6));if(ch(.25))add('ge',-1);return 'Noch ein Level. Und noch eins.'}},
 abhaengen:{n:'Mit Freunden abhängen',d:'Glück +, Freundschaft +',ok:()=>p.age>=13&&p.age<18,f:()=>{add('gl',R(3,7));relUp('freund',5);return 'Ihr sitzt auf der Parkbank, redet über alles und lacht über nichts.'}},
 kino:{n:'Mit Freunden ins Kino (10 €)',d:'Glück ++',ok:()=>p.age>=10&&p.age<18,f:()=>{if(p.money<10)return null;p.money-=10;add('gl',R(5,8));relUp('freund',3);return 'Popcorn, ein Film, und hinterher erzählt ihr euch die besten Szenen nach.'}},
 suess:{n:'Süßigkeiten kaufen (2 €)',d:'Glück +',ok:()=>p.age>=5&&p.age<18,f:()=>{if(p.money<2)return null;p.money-=2;add('gl',R(2,4));return pick(['Eine Tüte Gummibärchen. Die roten zuerst.','Brausepulver! Es kribbelt auf der Zunge.','Ein Lolli, so groß wie deine Hand.'])}},
 geburtstag:{n:'Geburtstagsfeier bei Freunden',d:'Glück +, Freundschaft +',ok:()=>p.age>=6&&p.age<16,f:()=>{add('gl',R(4,7));relUp('freund',4);return 'Topfschlagen, Kuchen und eine Wasserschlacht im Garten.'}}});
Object.assign(DUR,{suess:15,kuscheln:30,schlaf:120,bilderbuch:30,vorlesen:30,malen:60,spielplatz:90,kspielen:120,fahrrad:60,zocken:90,abhaengen:120,kino:150,geburtstag:180});
const KIDPL={kiosk:['suess'],home:['kuscheln','schlaf','bilderbuch','vorlesen','malen','zocken'],park:['spielplatz','kspielen','fahrrad','abhaengen'],mall:['kino'],schule:['kspielen']};
const KIDACT=['kuscheln','schlaf','bilderbuch','vorlesen','malen','spielplatz','kspielen','fahrrad','zocken','abhaengen','kino','geburtstag','lesen','medi','party'];
const KIDMIN={bankraub:18,klau:14,tasche:14,einbruch:16,hack:14,race:18,cars:18,homesui:18,bizui:18,urlaub:18,lotto:18,casinoui:18,op:18,stocksui:18,study:17,azubi:15,jobs:15,work:15,date:14,party:16,record:14,adopt:8,bankui:7,shop:6,medi:12,kidstime:99,sport:14};
const kidShow=a=>{if(KIDMIN[a]!=null&&p.age<KIDMIN[a])return false;if(ACTS[a]&&!ACTS[a].ok())return false;if(a==='work'&&!p.job)return false;return true};
{const _pc=placeCard;placeCard=function(id){if(!p||p.age>=18||p.prison||id==='jva')return _pc(id);const P=PL[id];
  let h='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">'+P.n+'<button class="xbtn" data-a="desel" aria-label="Schließen">×</button></h2><span class="chip">'+akt(p.act)+'</span></div>';
  const L=(KIDPL[id]||[]).concat(P.a).filter((a,i,A)=>A.indexOf(a)===i&&kidShow(a));
  if(id==='klinik')return h+'<p class="note">'+(p.age<14?'Wenn du krank bist oder eine Untersuchung ansteht, geht '+parentN()+' mit dir hierher.':'Du kannst allein zum Arzt gehen. Die Krankenkasse deiner Eltern zahlt.')+'</p>'+row(ACTS.arzt.n,'Gesundheit +',btn('arzt',null,'Los','o',!can('arzt')))+'</section>';
  if(!L.length)return h+'<p class="note" style="margin-top:8px">'+(id==='club'?'Hier kommst du erst ab 16 rein.':id==='casino'?'Erst ab 18.':'Hier gibt es für dich noch nichts zu tun. Komm wieder, wenn du älter bist.')+'</p></section>';
  L.forEach(a=>{h+=ACTS[a]?actRows([a]):a==='shop'?SHOP.filter(s=>s.min<=p.age).map(s=>{const own=p.items.includes(s.id);return row(s.n,own?'im Besitz':eur(s.pr),own?'<span class="chip">Besitz</span>':btn('buy',s.id,'Kaufen','',p.money<s.pr))}).join(''):special(a)});return h+'</section>'}}
// Kinder gehen nicht allein zum Arzt
Object.defineProperty(ACTS.arzt,'n',{get:()=>p&&p.age<14?'Mit '+parentN()+' zum Kinderarzt':p&&p.age<18?'Zum Kinderarzt':'Check-up beim Arzt',configurable:true});
Object.defineProperty(TERM.zahn,0,{get:()=>p&&p.age<14?'Zahnarzt mit '+parentN():'Zahnarzt-Kontrolle',configurable:true});
// Stadtfeste für Kinder
{const _s=season;season=function(){const S=_s();if(!p||p.age>=16)return S;const R2={gluehwein:['gluehwein','Kinderpunsch',3,'Heiß, süß, mit Zimt und ohne Alkohol.'],kostuem:['kostuem','Kostümfest in der Schule',5,'Das beste Kostüm bekommt eine Urkunde.'],grill:['grill','Grillen mit der Familie',0,'Würstchen, Stockbrot und Glühwürmchen.'],geschenke:['geschenke','Geschenke basteln',5,'Selbst gemacht ist am schönsten.']};
  return Object.assign({},S,{a:S.a.map(x=>R2[x[0]]||x)})}}

/* ---------- Gesundheit für Kinder: die Eltern entscheiden und begleiten ---------- */
const KIDDOC=[['kinderarzt','Kinderarzt','Vorsorge, Impfungen und wenn du krank bist.',()=>true,()=>{add('ge',R(2,4));return 'Abhören, in den Hals schauen, ein Aufkleber zum Schluss. Alles gut!'}],
 ['zahnarzt','Zahnarzt','Kontrolle und Zähneputzen üben.',()=>p.age>=3,()=>{add('au',1);return 'Keine Löcher! Du bekommst einen neuen Zahnbecher.'}],
 ['kfo','Kieferorthopäde','Eine Zahnspange für gerade Zähne.',()=>p.age>=9&&p.age<16&&!p.spange,()=>{p.spange=p.age;add('au',3);add('gl',-2);return 'Eine Zahnspange! Die ersten Tage drückt sie. In zwei Jahren sind die Zähne gerade.'}],
 ['hautarzt','Hautarzt','Gegen Pickel in der Pubertät.',()=>p.age>=13,()=>{p.skinY=p.age;add('au',2);return 'Eine Creme gegen Pickel. Nach ein paar Wochen sieht es viel besser aus.'}],
 ['augenarzt','Augenarzt','Sehtest. Brauchst du eine Brille?',()=>p.age>=5,()=>ch(.25)?(p.kidGlasses=1,add('in',1),'Du brauchst eine Brille! Plötzlich ist die Tafel ganz scharf.'):'Adleraugen. Alles bestens.'],
 ['kjp','Kinder- und Jugendtherapie','Reden hilft, wenn dich etwas belastet.',()=>(p.slast||0)>0||p.st.gl<35,()=>{addLast(-R(3,5));add('gl',4);return 'Eine Stunde nur für dich. Mit Spielen, Malen und Reden. Danach ist es leichter.'}]];
function kidHealth(){const lock=!!p.prison,who=parentN(),alone=p.age>=14;
  return card('Das regeln '+(p.parentsGone?'deine Betreuer':'Mama und Papa'),'<p class="note">Die Krankenkasse deiner Eltern zahlt alle Arztbesuche. '+(p.age<6?'Bei den Vorsorge-Untersuchungen (U-Untersuchungen) schaut der Kinderarzt, ob du dich gut entwickelst.':'Zu essen gibt es, was zu Hause auf den Tisch kommt.')+'</p>'+
      row('Ernährung',p.age<16?'Familienessen, mal gesund, mal Pizza':'Du darfst mitentscheiden','')+row('Vorsorge',p.age<6?'U-Untersuchungen beim Kinderarzt':'Jährlich beim Kinderarzt','<span class="chip">automatisch</span>'))+
    card('Arzt und Praxis','<p class="note" style="margin-bottom:4px">'+(alone?'Du kannst allein hingehen oder dich begleiten lassen.':who+' macht den Termin und geht mit dir hin.')+' Jede Praxis einmal im Jahr.</p>'+
      KIDDOC.filter(D=>D[3]()).map(D=>row(D[1],D[2],btn('kiddoc',D[0],once('kd_'+D[0])?'Erledigt':alone?'Termin machen':'Mit '+who+' hin','o',lock||once('kd_'+D[0])))).join(''))}
function act19(id,arg){switch(id){
  case 'kiddoc':{const D=KIDDOC.find(x=>x[0]===arg);if(!D||!D[3]()||once('kd_'+arg)||p.prison)return 1;if(!spendTime(arg==='kjp'?60:90))return 1;setOnce('kd_'+arg);p.lastArzt=p.age;p.hv=(p.hv||0)+1;
    let t=D[4]();if(arg==='kinderarzt'){const ill=Object.keys(p.ill||{});if(ill.length){delete p.ill[ill[0]];t+=' Und gegen '+ILLS[ill[0]].n+' gibt es Medizin. Bald geht es dir besser.'}}done(t);return 1}
  case 'reply':{const [cid,k]=String(arg).split(':');const C=p.chats[cid];if(!C||!C.pend)return 1;const R=replyOpts(cid).find(x=>x[0]===k);if(!R)return 1;msg(cid,R[2],true);C.pend=false;
    const d=R[3]!=null?R[3]:(k==='lieb'?5:k==='kurz'?1:-6);if(cid==='rival'&&p.rival){if(k==='lieb'&&ch(.15)&&!p.rival.friend){p.rival.friend=1;toast(p.rival.n+' ist überrascht. Vielleicht werdet ihr doch noch Freunde.')}if(k==='frech')addRuf(-1)}else relUp(cid,d);try{if(npcOf(cid))npcMem(cid,k==='lieb'?'Hat mir lieb geantwortet':k==='frech'?'War im Chat genervt':'',k==='lieb'?1:k==='frech'?-1:0)}catch(e){}render();return 1}
}return 0}

/* ---------- Chats: Antworten, die zur Nachricht passen ---------- */
const RPMAP=[['Geburtstag vergessen','sorry'],['meldest dich','sorry'],['an meinen Sachen','sorry'],['sag’s Mama','petze'],['Leihst du','lend'],['Wer hat die Kekse','who'],['Wer hat meinen','who'],
 ['genug gegessen','care'],['warm an','care'],['Mütze','care'],['zum Essen','sunday'],['Spaghetti','food'],['Bäcker','food'],['Grillrezept','food'],['Nachtisch','sunday'],['Kuchen gebacken','food'],['Abendessen ist fertig','come'],
 ['WLAN','funny'],['Mama nervt','funny'],['Fernbedienung','who'],['Artikel','link'],['neuen Song','link'],['Spiel gestern','sport'],['alten Sachen','keller'],
 ['mal wieder was machen','miss'],['Wann sehen wir uns','miss'],['Weißt du noch','miss'],['Kleines/Großes','miss'],['vermisst','miss'],
 ['Hausaufgaben gemacht','hw'],['für die Arbeit gelernt','hw'],['Hast du die Hausaufgaben','have'],['Sammelkarten','have'],['Fahrradrennen','challenge'],['Wetten','challenge'],
 ['Geld für die Klassenfahrt','thanks'],['Danke für das Geschenk','wish'],['stolz auf dich','wish'],['Alles Gute','wish'],['Happy Birthday','wish'],
 ['Respekt','respect'],['Glückwunsch … glaub','respect'],['hätte ich auch','respect'],['Zimmer aufräumen','order'],['Tisch decken','order'],['Erdbeben','order'],['Um 22 Uhr','order'],['Vergiss','order'],
 ['Wie läuft','how'],['Wie war','how'],['Party','invite'],['Feierabendbier','invite'],['Grillen bei uns','invite']];
const RPK=[['taunt',/und du\?|besser als|schneller als|mehr .* als du|nichts aus dir|leben ist einfach besser|befördert|neues auto|witzig\.|gewinne/i],
 ['invite',/wollen wir|lust|kommst du|gehen wir|spielen wir|zocken|kino|soll ich dich|hilfst du|fahrradtour|übernachtung|spielst du|\?$/i],
 ['share',/du glaubst nicht|schaut mal|kennst du|gesehen|was in der/i]];
const RPT={taunt:[['lieb','Schön für dich. Ehrlich.',2],['kurz','Aha.',0],['frech','Kümmer dich um dein eigenes Leben.',-4]],
 tauntk:[['lieb','Cool, gut gemacht!',2],['kurz','Na und?',0],['frech','Angeber!',-4]],
 respect:[['lieb','Danke! Das bedeutet mir was.',3],['kurz','Danke.',0],['frech','Neidisch, was?',-4]],
 sorry:[['lieb','Tut mir echt leid! Ich mach’s wieder gut.',6],['kurz','Sorry.',1],['frech','Ist doch nicht so schlimm.',-6]],
 petze:[['lieb','Nein, warte! Ich mach’s wieder gut!',4],['kurz','Mach doch.',-1],['frech','Petze!',-5]],
 lend:[['lieb','Klar, nimm es!',5],['kurz','Wenn du es heil zurückbringst.',1],['frech','Nein, das ist meins!',-5]],
 who:[['lieb','Ich war’s … Sorry! 🙈',4],['kurz','Keine Ahnung.',0],['frech','Ich doch nicht!',-3]],
 care:[['lieb','Ja, alles gut! Hab dich lieb ❤️',5],['kurz','Ja.',1],['frech','Ich bin doch kein Baby mehr!',-4]],
 sunday:[['lieb','Klar, ich bring Nachtisch mit!',5],['kurz','Mal sehen.',0],['frech','Diesmal nicht.',-5]],
 food:[['lieb','Lecker! Ich freu mich! 😋',4],['kurz','Okay.',1],['frech','Bäh, schon wieder?',-4]],
 come:[['lieb','Komme sofort! 🏃',4],['kurz','Gleich.',0],['frech','Keinen Hunger.',-4]],
 funny:[['lieb','Haha, typisch! 😂',4],['kurz','Oh je.',1],['frech','Ist mir egal.',-4]],
 link:[['lieb','Schau ich mir gleich an!',4],['kurz','Später.',0],['frech','Keine Zeit für so was.',-4]],
 sport:[['lieb','Ja! Was für ein Spiel! ⚽',5],['kurz','Nee, verpasst.',0],['frech','Fußball ist langweilig.',-4]],
 keller:[['lieb','Oh ja, ich komm vorbei und schau!',5],['kurz','Wirf weg, was du willst.',0],['frech','Das ist doch alles Müll.',-4]],
 miss:[['lieb','Ja! Ich vermisse dich auch.',6],['kurz','Bald mal.',1],['frech','Keine Zeit.',-5]],
 hw:[['lieb','Ja, alles fertig!',4],['kurz','Fast.',0],['frech','Nerv nicht!',-5]],
 have:[['lieb','Ja, hab ich! Brauchst du was?',4],['kurz','Ja.',0],['frech','Mach doch selber.',-4]],
 challenge:[['lieb','Ich! Wetten? 😄',4],['kurz','Mal sehen.',0],['frech','Kindisch.',-4]],
 thanks:[['lieb','Danke! Du bist die/der Beste!',5],['kurz','Danke.',1],['frech','Ist das alles?',-6]],
 wish:[['lieb','Danke! Hab dich lieb ❤️',5],['kurz','Danke.',1],['frech','Ja, ja.',-5]],
 order:[['lieb','Mach ich, versprochen!',4],['kurz','Ja, ja …',0],['frech','Gleich! Nerv nicht.',-6]],
 invite:[['lieb','Ja, total gern! 😊',5],['kurz','Mal sehen.',0],['frech','Keine Lust.',-6]],
 how:[['lieb','Alles gut! Danke, dass du fragst.',5],['kurz','Passt.',1],['frech','Wieso fragst du?',-5]],
 share:[['lieb','Erzähl mehr! 😮',4],['kurz','Cool.',1],['frech','Interessiert mich nicht.',-5]],
 other:[['lieb','Das ist lieb von dir!',4],['kurz','Okay.',1],['frech','Lass mich in Ruhe.',-6]]};
function replyCat(cid,t){const m=RPMAP.find(x=>t.includes(x[0]));if(m)return m[1];const r=RPK.find(x=>x[1].test(t));if(r){if(r[0]==='taunt'&&p&&p.age<18)return 'tauntk';return r[0]}return 'other'}
const KIDTONE={'Ja, total gern! 😊':'Jaaa! Au ja! 😃','Mach ich, versprochen!':'Okiii, mach ich!','Danke! Hab dich lieb ❤️':'Danke!! Hab dich soooo lieb ❤️','Gleich! Nerv nicht.':'Menno! Gleich!','Keine Lust.':'Nö, keine Lust.','Ja, alles gut! Hab dich lieb ❤️':'Jaaa, Mama! ❤️','Ich bin doch kein Baby mehr!':'Ich bin doch schon groß!'};
function replyOpts(cid){const C=p.chats[cid];if(!C)return [];const last=C.msgs.filter(m=>!m.me).slice(-1)[0];const t=last?last.t:'';const k=replyCat(cid,t);
  return RPT[k].map(([kind,txt,d])=>[kind,kind==='lieb'?'Lieb':kind==='kurz'?'Kurz':'Genervt',p.age<12&&KIDTONE[txt]?KIDTONE[txt]:txt,d])}
// Antwort-Knöpfe ersetzen
{const _ce=chatExtra;chatExtra=function(c){let h=_ce(c);const i=h.indexOf('<div class="replies">');if(i<0)return h;const j=h.indexOf('</div>',i)+6;
  return h.slice(0,i)+'<div class="replies">'+replyOpts(c.id).map(([k,l,t])=>'<button class="rp rp-'+k+'" data-a="reply" data-g="'+c.id+':'+k+'">„'+esc(t)+'“<small>'+l+'</small></button>').join('')+'</div>'+h.slice(j)}}
// Chats nicht überfüllen: höchstens 25 Nachrichten, höchstens 2 unbeantwortete pro Jahr
{const _m=msg;msg=function(id,t,me){const c=p.chats[id];if(!me&&c&&c.msgs.length){const open=c.msgs.slice(-4).filter(m=>!m.me&&m.a===p.age).length;if(open>=2&&!/Geburtstag|Alles Gute|Danke für das Geschenk/.test(t))return}
  _m(id,t,me);const C=p.chats[id];if(C&&C.msgs.length>25)C.msgs.splice(0,C.msgs.length-25)}}

/* ---------- Taschengeld ---------- */
{const _py=perkYear;perkYear=function(R0){_py(R0);try{if(p&&!p.prison&&p.age>=6&&p.age<18&&!p.parentsGone&&!p.job){const v=p.age<10?60:p.age<14?180:360;p.money+=v;R0.inc.push(['Taschengeld',v]);if(p.age===6)log('Ab jetzt bekommst du Taschengeld.')}}catch(e){}}}
