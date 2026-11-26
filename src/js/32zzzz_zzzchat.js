/* ================= Lebendigere Chats: Nachrichten zur Lebenslage, keine Wiederholungen, wechselnde Antworten ================= */
const isPar=w=>w==='mama'||w==='papa';
const isFr=w=>w==='freund'||String(w).startsWith('fk_')||String(w).startsWith('sib');
/* Nachrichten, die zu deinem Leben gerade passen */
function ctxLines(who){const L=[],P=isPar(who),F=isFr(who),a=p.age,mo=new Date().getMonth();
  const big=(p.ms||[]).filter(m=>m.a===p.age&&(m.k==='big'||m.k==='star')&&!/Erste Schritte|Zeitraffer/.test(m.t)).slice(-1)[0];
  if(big){if(P)L.push('Hab gehört: '+big.t+'! Wir sind so stolz auf dich.',who==='mama'?'Papa erzählt allen von „'+big.t+'“. Wirklich allen.':'Ich hab’s im ganzen Verein rumerzählt: '+big.t+'!');if(F)L.push(big.t+'?! Wahnsinn, das müssen wir feiern!','Ich hab’s gerade erfahren: '+big.t+'. Wie fühlt sich das an?')}
  if(p.job&&(p.job.yrs||0)<=1&&a>=16){if(P)L.push('Und, wie ist der neue Job als '+p.job.t+'?','Sind die Kollegen nett? Erzähl mal vom neuen Job!');if(F)L.push('Erzähl, wie ist es als '+p.job.t+'?')}
  if(!p.job&&a>=20&&a<64&&!p.school&&!p.pension){if(P)L.push('Hast du schon was Neues in Aussicht? Ich drück dir die Daumen.');if(F)L.push('Ich hab gehört, bei uns wird jemand gesucht. Soll ich dich empfehlen?')}
  if(p.partner&&a>=16){const n=p.partner.name;if(P)L.push(p.partner.mar?'Grüß '+n+' ganz lieb von uns!':'Wann lernen wir '+n+' endlich richtig kennen?');if(F)L.push('Was macht '+n+'? Grüß schön!')}
  else if(a>=22&&a<45&&P)L.push('Und? Gibt es jemanden in deinem Leben? Ich frag ja nur.');
  const kid=(p.kids||[]).filter(k=>k.alive!==false).slice(-1)[0];if(kid){if(P)L.push('Wann kommt ihr mal mit '+kid.n+' vorbei? Wir vermissen '+(kid.g==='w'?'sie':'ihn')+'!','Ich hab für '+kid.n+' einen Pulli gestrickt. Hoffentlich passt er.');if(F)L.push('Wie geht’s '+kid.n+'? Bestimmt schon riesig, oder?')}
  const pet=(p.pets||[])[0];if(pet){L.push('Wie geht’s '+pet.n+'? Schick mal ein Foto!');if(F)L.push(pet.n+' hat mir beim letzten Mal fast den Kuchen geklaut 😄')}
  if(p.st.ge<40)L.push(P?'Du klingst in letzter Zeit so erschöpft. Pass auf dich auf, ja?':'Du siehst müde aus in letzter Zeit. Alles okay?');
  if(p.st.gl<35&&F)L.push('Hey, du warst so still in letzter Zeit. Willst du reden?');
  if(a>=25&&typeof netWorth==='function'&&netWorth()>5e5&&F)L.push('Na, Großverdiener/in, lädst du mal zum Essen ein? 😄');
  if(p.pol&&p.pol.lvl>=1)L.push(P?'Ich hab dich in der Zeitung gesehen! Ich hab den Artikel ausgeschnitten.':'Hab dich in der Zeitung gesehen. Politiker/in, wer hätte das gedacht!');
  if(p.sm&&p.sm.fol>=1e4&&F)L.push('Mein Kollege kennt dein Video! Ich hab gesagt, ich kenn dich 😎');
  if((p.props||[]).some(x=>x.use==='self')&&P)L.push('Wie lebt es sich im eigenen Zuhause? Brauchst du noch Gardinen?');
  if(P&&a+30>=62)L.push(pick(['Mein Rücken macht mir zu schaffen. Alt werden ist nichts für Feiglinge.','Ich war beim Arzt. Nichts Schlimmes, keine Sorge.','Wir haben jetzt einen Seniorentanzkurs. Papa tritt mir ständig auf die Füße.','Kannst du mir mal erklären, wie man Fotos aufs Tablet bekommt?']));
  if(a>=13&&a<18&&P)L.push('Wie lief die Schule heute? Mehr als „gut“ bitte.','Deine Lehrerin hat angerufen. Nur Gutes, keine Sorge!');
  if(mo===11)L.push(P?'Kommst du an Weihnachten? Es gibt dein Lieblingsessen!':'Was machst du an Silvester?');
  if(mo>=5&&mo<=7)L.push(P?'Habt ihr schon Urlaubspläne für den Sommer?':'Freibad am Wochenende? Es soll 30 Grad werden!');
  if(mo===9&&P)L.push('Ich hab Kürbissuppe gekocht. Viel zu viel. Kommst du vorbei?');
  if(typeof curAl==='function'&&curAl()>8&&a>=20)L.push(P?(who==='mama'?'Bei Papa in der Firma gibt’s Kurzarbeit.':'Bei uns in der Firma gibt’s Kurzarbeit.')+' Hoffentlich bleibt’s dabei.':'Bei uns in der Firma wird gerade gespart. Wie ist es bei dir?');
  return L}
/* Nie zweimal dieselbe Nachricht hintereinander: zuletzt benutzte Sätze werden gemerkt */
function chatPick(who,pool){p.cu=p.cu||{};const used=p.cu[who]||(p.cu[who]=[]);let C=[];
  try{const X=ctxLines(who).filter(t=>!used.includes(t));if(X.length&&ch(.6))C=X}catch(e){errLog(e,'ctx')}
  if(!C.length)C=(pool||[]).filter(t=>!used.includes(t));if(!C.length&&(pool||[]).length){const o=used.find(t=>pool.includes(t));C=[o];used.splice(used.indexOf(o),1)}if(!C.length)return null;
  const t=pick(C);used.push(t);if(used.length>24)used.shift();return t}
/* Mehr Grundsätze, damit sich auch normale Nachrichten abwechseln */
const MORE_CH={mama:['Ich hab heute an dich gedacht. Einfach so. ❤️','Die Nachbarin fragt ständig nach dir.','Ich hab ein neues Rezept ausprobiert. Papa sagt, es ist „interessant“.','Hast du eigentlich noch die blaue Jacke?','Ruf mal wieder an, ja?','Oma lässt dich grüßen!','Ich hab alte Fotos von dir gefunden. Du warst so süß!','Hast du schon gegessen? Ich frag ja nur.'],
  papa:['Ich hab das Auto gewaschen. Es glänzt wie neu.','Kennst du dich mit Druckern aus? Meiner streikt.','Unser Verein hat gewonnen! 3:1!','Ich hab ein neues Hobby: Brot backen.','Hast du Lust, am Wochenende zu grillen?','Weißt du noch, wie du als Kind vom Fahrrad gefallen bist? Ich lach heute noch.','Mama hat mich zum Yoga angemeldet. Hilfe.'],
  freund:['Ich hab gerade an früher gedacht. Wir waren echt verrückt 😂','Hast du die neue Serie schon gesehen? Unbedingt!','Kaffee diese Woche? Ich brauch dringend jemanden zum Reden.','Mein Chef hat heute einen Witz gemacht. Er war nicht lustig.','Wann waren wir eigentlich das letzte Mal tanzen?','Mir ist langweilig. Unterhalte mich!','Rate mal, wen ich heute getroffen hab!']};
Object.entries(MORE_CH).forEach(([k,v])=>{if(CHAT_SMALL[k])v.forEach(t=>{if(!CHAT_SMALL[k].includes(t))CHAT_SMALL[k].push(t)})});
FKMSG.treu.push('Ich hab heute ein Lied gehört und musste an dich denken.','Danke, dass du immer zuhörst.');FKMSG.lustig.push('Ich hab versucht, Sushi selbst zu machen. Es ist jetzt ein Reisberg.','Mein Hund hat heute meine Socke gegessen. Schon wieder.');
FKMSG.chaot.push('Ich hab mich verfahren. Schon wieder. Ich bin jetzt in Holland, glaube ich.','Ich hab meinen Job gekündigt. Oder wurde gekündigt. Unklar.');FKMSG.klug.push('Ich lese gerade über das Universum. Wir sind so klein!','Was hältst du von der neuen Stadtpolitik?');
FKMSG.sport.push('Ich hab mir einen Zeh gebrochen. Beim Yoga. Frag nicht.','Neue Laufschuhe gekauft! Testen wir sie?');FKMSG.kreativ.push('Ich hab ein Gedicht über Toastbrot geschrieben. Willst du es hören?','Hilf mir: Soll mein Bild blau oder grün werden?');
/* Dank für Geburtstagswünsche je nach Beziehung */
const BDTHX={par:['Danke, mein Schatz! Du bist das beste Geschenk.','Ach, wie lieb! Kommst du am Sonntag zum Kuchen?','Danke! Schon wieder ein Jahr älter … 🙈','Du hast dran gedacht! Papa hatte es vergessen 😄','Danke dir! Das hat meinen Tag gerettet.'],
  fr:['Danke!! Du hast dran gedacht <3','Wie lieb von dir, danke!','Danke dir! Feiern wir bald zusammen?','Danke! Ich werde alt, oder? 😅','Ahh danke! Lass uns am Wochenende anstoßen!','Du bist die/der Erste, die/der gratuliert! Danke!','Danke! Das nächste Bier geht auf mich.'],
  pa:['Danke, Liebling! Heute Abend gehöre ich ganz dir.','Du bist süß. Danke ❤️','Danke! Und wo ist mein Geschenk? 😉','Mit dir ist jedes Jahr schöner. Danke!']};
function bdThanks(id){return chatPick(id,isPar(id)?BDTHX.par:id==='partner'?BDTHX.pa:BDTHX.fr)||'Danke!'}
/* Mehr Antwortvarianten; die Auswahl wechselt jetzt mit jeder Nachricht */
const RPX2={invite:{lieb:['Unbedingt! Ich freu mich schon.','Ja! Ich bring Snacks mit.'],kurz:['Ich schau mal.','Kann sein.'],frech:['Diesmal nicht.','Frag mich nächste Woche.']},
  how:{lieb:['Gerade richtig gut, danke! Und selbst?','Ehrlich? Viel Stress, aber ich halt durch.','Besser, seit du fragst ❤️'],kurz:['Läuft.','Alles beim Alten.'],frech:['Frag nicht.','Muss ja.']},
  share:{lieb:['Oh wie schön, zeig mal!','Das ist ja toll!','Haha, das muss ich sehen!'],kurz:['Krass.','Ach was.'],frech:['Okay …','Spannend. Nicht.']},
  other:{lieb:['Du hast mir gerade den Tag versüßt!','Ach, schön, dass du schreibst!','Erzähl mehr!'],kurz:['Jo.','Hm, okay.'],frech:['Und?','Später.']},
  miss:{lieb:['Komm vorbei, ich mach Kaffee!','Ich vermisse dich auch so!'],kurz:['Same.','Ja, echt.'],frech:['Ach ja?','Komisch, du meldest dich nie.']},
  care:{lieb:['Danke, das bedeutet mir viel.','Ich pass auf, versprochen!'],kurz:['Klar.','Wird schon.'],frech:['Ich bin kein Kind mehr.','Jaja.']},
  wish:{lieb:['Ihr seid die Besten!','Ich freu mich so, danke!'],kurz:['Danke dir.','Merci!'],frech:['Endlich sagt’s mal wer.','Ja, ja.']}};
Object.entries(RPX2).forEach(([k,o])=>{if(!RPX[k])RPX[k]={lieb:[],kurz:[],frech:[]};Object.entries(o).forEach(([kind,arr])=>{RPX[k][kind]=(RPX[k][kind]||[]).concat(arr)})});
[['neue Job','how'],['vom neuen Job','how'],['Erzähl, wie ist es als','how'],['Hab gehört:','share'],['Ich hab’s gerade erfahren','share'],['müssen wir feiern','invite'],['Gibt es jemanden','how'],['lernen wir','invite'],['Grüß','other'],['kommt ihr mal mit','invite'],['Wie geht’s','how'],['Schick mal ein Foto','share'],['so erschöpft','care'],['müde aus','care'],['so still in letzter Zeit','care'],['lädst du mal','invite'],['in der Zeitung','share'],['kennt dein Video','share'],['eigenen Zuhause','how'],['Rücken','care'],['beim Arzt','care'],['Seniorentanzkurs','funny'],['Fotos aufs Tablet','order'],['Schule heute','how'],['Lehrerin hat angerufen','share'],['an Weihnachten','invite'],['Silvester','invite'],['Urlaubspläne','how'],['Freibad','invite'],['Kürbissuppe','invite'],['Kurzarbeit','share'],['gespart','how'],['Neues in Aussicht','care'],['soll ich dich empfehlen','share'],
 ['an dich gedacht','miss'],['Ruf mal wieder an','miss'],['Oma lässt','other'],['alte Fotos','share'],['Rezept','food'],['Drucker','order'],['gewonnen','share'],['grillen','invite'],['Yoga','funny'],['Kaffee diese Woche','invite'],['tanzen','invite'],['langweilig','other'],['Rate mal','share']].forEach(x=>RPMAP.push(x));
/* Wiederkehrende Systemnachrichten bekommen wechselnde Formulierungen */
const MVAR={'Hast du meinen Geburtstag vergessen? Naja.':['Hast du meinen Geburtstag vergessen? Naja.','Gestern war übrigens mein Geburtstag. Nur so.','Kein Anruf an meinem Geburtstag? Schade.','Ich hab den ganzen Tag aufs Telefon geschaut … Geburtstag vergessen?','Mein Geburtstag ist vorbei. Ich hoffe, dir geht’s gut.'],
  'Du hast meinen Geburtstag vergessen …':['Du hast meinen Geburtstag vergessen …','Mein Geburtstag. Gestern. Ohne dich.','Ich hab mich wirklich auf meinen Geburtstag gefreut. Mit dir.'],
  'Hast du deine Post nicht geöffnet? Da kam was vom Inkasso …':['Hast du deine Post nicht geöffnet? Da kam was vom Inkasso …','Ich mach mir Sorgen. Schon wieder ein Brief vom Inkasso?','Du weißt, dass du immer zu uns kommen kannst, wenn das Geld knapp ist? Wegen dem Inkasso …','Bei uns lag Inkasso-Post für dich. Sollen wir reden?']};
const FBD=['Happy Birthday!! Party?','Alles Gute, alte Socke!','Noch ein Jahr älter, haha. Alles Gute!','Geburtstagskind! Heute Abend geht die erste Runde auf mich 🎉','Alles Gute! Bleib so, wie du bist (nur pünktlicher).','HAPPY BIRTHDAY 🎂🎈 Ich hab dir was Peinliches geschenkt.','Ein Jahr weiser, ein Jahr schöner. Alles Gute!','Du wirst alt. Ich auch. Alles Gute trotzdem!'];
FBD.slice(0,3).forEach(t=>{MVAR[t]=FBD});
const BDM=['Alles Gute zum {n}. Geburtstag, mein Schatz!','{n}! Wo ist die Zeit hin? Alles Liebe zum Geburtstag!','Happy Birthday! {n} Jahre und immer noch mein Baby 😘','Alles, alles Gute zum Geburtstag! Ich bin so stolz auf dich.','Zum {n}. Geburtstag nur das Beste! Kuchen steht bereit 🎂','Herzlichen Glückwunsch zum {n}.! Papa hat schon wieder geweint.','Mein Schatz wird {n}! Feier schön!'];
{const _ms=msg;msg=function(id,t,me){if(!me&&p&&typeof t==='string'){try{const V=MVAR[t];if(V)t=chatPick(id+'#v',V)||t;else{const m=t.match(/^Alles Gute zum (\d+)\. Geburtstag, mein Schatz!$/);if(m)t=(chatPick(id+'#bd',BDM)||BDM[0]).replace(/\{n\}/g,m[1])}}catch(e){errLog(e,'var')}}return _ms(id,t,me)}}
/* Mehr Einladungen der Familie, damit nicht jedes Jahr derselbe Umzug ansteht */
INVITES.mama.push(['Ich koche am Sonntag Rouladen. Kommst du?','essen'],['Familienessen am Samstag! Oma kommt auch.','essen'],['Ich brauch Hilfe beim Ausmisten des Dachbodens. Hast du Zeit?','hilfe']);
INVITES.papa.push(['Kannst du mir helfen, das neue Regal aufzubauen?','hilfe'],['Hilfst du mir im Garten? Die Hecke wächst uns über den Kopf.','hilfe'],['Grillen am Wochenende? Ich hab neue Würstchen.','essen']);
INVITES.partner.push(['Lass uns heute spontan ins Kino gehen!','dinner'],['Ich hab einen Tisch im neuen Italiener reserviert.','dinner']);
[['Rouladen','invite'],['Familienessen','invite'],['Dachboden','order'],['Regal','order'],['Hecke','order'],['Würstchen','invite'],['spontan ins Kino','invite'],['Italiener','invite'],['Gestern war übrigens mein Geburtstag','sorry'],['Kein Anruf an meinem Geburtstag','sorry'],['aufs Telefon geschaut','sorry'],['Mein Geburtstag ist vorbei','sorry'],['Ohne dich','sorry'],['mit dir.','sorry'],['Inkasso','care'],['wo ist die Zeit hin','wish'],['Happy Birthday','wish'],['Geburtstag nur das Beste','wish'],['Herzlichen Glückwunsch zum','wish'],['wird ','wish']].forEach(x=>RPMAP.push(x));
