/* ================= Einstellungen neu geordnet, Klassenclown, abwechslungsreichere Nachrichten und Antworten ================= */
/* ---------- Mehr Nachrichten ---------- */
const MORE_KID={mama:['Ich hab dir ein Pausenbrot mit Gurke gemacht!','Oma hat angerufen, sie vermisst dich.','Wo ist dein zweiter Schuh?','Heute Abend Spieleabend?','Hast du dein Zimmer schon aufgeräumt?'],
  papa:['Wollen wir am Wochenende einen Drachen steigen lassen?','Rate mal, wer heute den Rasen gemäht hat!','Witz des Tages: Was ist orange und läuft durch den Wald? Eine Wanderine!','Ich hol dich heute vom Training ab.'],
  freund:['Guck mal, ich hab einen Wackelzahn!','Was ist dein Lieblingstier?','Ich hab ein neues Fahrrad!!','Morgen in der Pause Fangen spielen?','Hast du auch so Angst vor dem Diktat?']};
const MORE_TEEN={mama:['Du warst gestern ganz schön spät zu Hause.','Ich hab dir Pizza in den Kühlschrank gestellt.','Können wir mal reden? Nichts Schlimmes.','Oma fragt, ob du am Sonntag zum Essen kommst.','Bitte bring den Müll runter!'],
  papa:['Ich lerne gerade einen Trend-Tanz. Bewerte mich!','Fahrstunde am Wochenende? Auf dem Supermarktparkplatz.','Was willst du eigentlich mal werden?','Ich hab deinen Lieblingssnack gekauft.','Deine Musik ist echt laut.'],
  freund:['OMG, hast du gesehen, wer jetzt mit wem zusammen ist?','Ich bin so verliebt, Hilfe 😭','Leihst du mir deine Notizen?','Herr Krause hat heute wieder komplett übertrieben','Ich hab gerade voll Stress mit meinen Eltern …','Schick mal das Foto von gestern!']};
const MORE_ADULT={mama:['Ich hab was über Rückenschmerzen im Fernsehen gesehen. Pass auf dich auf!','Papa will ein Elektroauto kaufen. Sag du mal was.','Weißt du noch, wie du als Kind immer im Garten gezeltet hast?','Ich bin jetzt in einer Yoga-Gruppe!','Schick mal wieder ein Foto von dir!'],
  papa:['Ich hab im Garten Tomaten gezogen. Riesig!','Wie viel verdient man eigentlich in deinem Job?','Der Nachbar hat sich einen Pool gebaut. Angeber.','Ich hab die alten Fotoalben digitalisiert.','Brauchst du mal Hilfe beim Aufbauen oder so?'],
  freund:['Ich hab gekündigt. Endlich!','Brauch mal deinen Rat …','Hast du am Samstag Zeit? Spieleabend!','Mein Date gestern war eine Katastrophe 😂','Schau mal, mein neuer Hund!','Ich hab im Lotto 12 Euro gewonnen. Ich bin reich.']};
[[CHAT_KID,MORE_KID],[CHAT_TEEN,MORE_TEEN],[CHAT_SMALL,MORE_ADULT]].forEach(([A,B])=>Object.keys(B).forEach(k=>{A[k]=(A[k]||[]).concat(B[k])}));
RPMAP.push(['Pausenbrot','food'],['Oma hat angerufen','miss'],['zweiter Schuh','who'],['Spieleabend','invite'],['Zimmer schon','order'],['Drachen','invite'],['Rate mal','funny'],['Witz des Tages','meme'],['hol dich','info'],
  ['Wackelzahn','share'],['Lieblingstier','q'],['neues Fahrrad','share'],['Fangen spielen','invite'],['Angst vor dem Diktat','comfort'],['spät zu Hause','order'],['Pizza in den Kühlschrank','food'],['mal reden','advice'],['Müll runter','order'],
  ['Trend-Tanz','meme'],['Fahrstunde','invite'],['eigentlich mal werden','advice'],['Lieblingssnack','food'],['Musik ist echt laut','order'],['wer jetzt mit wem','gossip'],['verliebt','advice'],['übertrieben','funny'],['Stress mit meinen Eltern','comfort'],['Foto von gestern','photo'],
  ['Rückenschmerzen','care'],['Elektroauto','advice'],['gezeltet','miss'],['Yoga-Gruppe','news'],['Foto von dir','photo'],['Tomaten','news'],['Wie viel verdient','q'],['Pool gebaut','gossip'],['Fotoalben','miss'],['Hilfe beim Aufbauen','info'],
  ['gekündigt','news'],['deinen Rat','advice'],['Date gestern','funny'],['neuer Hund','photo'],['12 Euro gewonnen','meme']);
Object.assign(RPT,{gossip:[['lieb','Ernsthaft?! Erzähl alles!',3],['kurz','Krass.',0],['frech','Lass die doch in Ruhe.',-1]],photo:[['lieb','Wie schön! Schick mehr! 😍',4],['kurz','Nett.',0],['frech','Und?',-3]],
  news:[['lieb','Wow, Glückwunsch! Das muss gefeiert werden!',5],['kurz','Oh, cool.',1],['frech','Na, wenn du meinst.',-4]],advice:[['lieb','Klar, ich hab immer ein offenes Ohr.',6],['kurz','Worum geht’s?',1],['frech','Frag jemand anderen.',-6]],
  comfort:[['lieb','Hey, du schaffst das. Ich bin für dich da.',6],['kurz','Wird schon.',1],['frech','Selber schuld.',-6]],meme:[['lieb','HAHAHA, der ist gut 😂',4],['kurz','Hä?',0],['frech','Flachwitz-Alarm.',-2]],
  q:[['lieb','Gute Frage! Lass uns das bei einem Treffen bereden.',3],['kurz','Weiß nicht.',0],['frech','Geht dich nichts an.',-4]],info:[['lieb','Super, danke dir!',3],['kurz','Ok.',0],['frech','Muss nicht sein.',-3]]});
/* ---------- Abwechslungsreichere Antworten ---------- */
const RPX={invite:{lieb:['Au ja, ich bin dabei!','Klingt super, wann genau?'],kurz:['Vielleicht.','Mal schauen.'],frech:['Keine Zeit, sorry.','Ehrlich gesagt: nein.']},
  how:{lieb:['Richtig gut! Und bei dir?','Viel los, aber schön. Erzähl du mal!'],kurz:['Passt.','Geht so.'],frech:['Warum fragst du?','Wie immer.']},
  miss:{lieb:['Ich dich auch! Lass uns bald was machen.','Total! Ich meld mich am Wochenende.'],kurz:['Ja, stimmt.','Bald mal.'],frech:['Du meldest dich doch auch nie.','Jaja.']},
  order:{lieb:['Mach ich sofort!','Klar, kein Problem.'],kurz:['Gleich.','Jaaa.'],frech:['Später!','Muss das jetzt sein?']},
  food:{lieb:['Mega, danke! 😋','Du bist die/der Beste!'],kurz:['Ok, danke.','Cool.'],frech:['Schon wieder das?','Hab keinen Hunger.']},
  funny:{lieb:['Hahaha, ich kann nicht mehr 😂','Typisch! 😂'],kurz:['Lol.','Haha.'],frech:['Ist mir egal.','Nicht lustig.']},
  share:{lieb:['Wie cool ist das denn!','Erzähl! Ich will alles wissen.'],kurz:['Aha.','Nice.'],frech:['Und jetzt?','Interessiert mich nicht.']},
  other:{lieb:['Schön, von dir zu hören!','Freut mich total!'],kurz:['Ok.','Alles klar.'],frech:['Was willst du?','Hm.']},
  wish:{lieb:['Danke, das ist so lieb! ❤️','Ach, ihr seid toll!'],kurz:['Danke.','Merci.'],frech:['Muss ja.','Jaja, danke.']},
  hw:{lieb:['Ja, alles fertig!','Fast, mach ich gleich zu Ende.'],kurz:['Ja.','Bald.'],frech:['Nerv nicht!','Hab keine Lust.']},
  care:{lieb:['Mach dir keine Sorgen, mir geht’s gut! ❤️','Lieb von dir, ich pass auf mich auf.'],kurz:['Ja ja.','Okay.'],frech:['Ich bin erwachsen!','Lass mich.']},
  sorry:{lieb:['Du hast recht. Es tut mir wirklich leid.','Ich lad dich zum Essen ein, versprochen.'],kurz:['Mein Fehler.','Sorry, ehrlich.'],frech:['Übertreib mal nicht.','Ich hatte halt viel zu tun.']},
  taunt:{lieb:['Freut mich ehrlich für dich.','Glückwunsch, gönn ich dir.'],kurz:['Schön.','Okay.'],frech:['Interessiert keinen.','Angeber.']},
  tauntk:{lieb:['Wow, cool!','Krass, gut gemacht!'],kurz:['Na und?','Okay.'],frech:['Angeber!','Gar nicht wahr!']}};
const RPW={order:['Mein Zimmer ist kein Chaos, das ist moderne Kunst 🎨','Ich räume auf … in meinem Kopf. Zählt das?'],care:['Ich trag schon drei Jacken. Ich seh aus wie ein Michelin-Männchen.'],sorry:['Darf ich zur Entschuldigung einen Tanz aufführen? 💃'],
  hw:['Mein Hund hat sie gefressen. Ich hab keinen Hund.','Die Hausaufgaben sind auf einer geheimen Mission.'],food:['Bin schon unterwegs. Mit Gabel. 🍴'],invite:['Nur wenn es Snacks gibt.','Ich komme, aber nur im Pyjama.'],
  taunt:['Wow. Ich hab heute eine Fliege gefangen. Mit der Hand. Rekord.'],tauntk:['Ich kann mit den Ohren wackeln. Kannst du das?'],miss:['Ich hab dich mehr vermisst als WLAN!'],wish:['Danke! Ich bin jetzt offiziell uralt 👴'],
  comfort:['Soll ich dir was vorsingen? Warnung: Ich kann nicht singen.'],advice:['Mein Rat kostet einen Kaffee ☕'],news:['Ich bestelle schon mal Konfetti! 🎉'],gossip:['Moment, ich hol Popcorn 🍿'],
  meme:['Und wie nennt man einen Bumerang, der nicht zurückkommt? Stock.'],photo:['So schön, das wird mein neuer Handy-Hintergrund.'],
  _:['Ich antworte nur gegen Kekse 🍪','Moment, ich muss erst meinen Hamster fragen.','Eilmeldung: Ich hab’s gelesen!','Ich bin gerade ein Pinguin, später 🐧','*Trommelwirbel* … Ja!']};
const SERIOUS=['sorry','comfort','petze','advice'];
{const _ro=replyOpts;replyOpts=function(cid){const L=_ro(cid);if(!L.length)return L;const C=p.chats[cid],last=C.msgs.filter(m=>!m.me).slice(-1)[0],t=last?last.t:'',k=replyCat(cid,t),h=hsh(cid+'|'+t);
  const out=L.map(([kind,lab,txt,d],i)=>{const X=RPX[k]&&RPX[k][kind];if(!X||(p.age<12&&KIDTONE[txt]))return [kind,lab,txt,d];const pool=[txt].concat(X);return [kind,lab,pool[(h>>>(i*4))%pool.length],d]});
  if(cid!=='chef'){const W=(RPW[k]||[]).concat(RPW._),w=W[(h>>>13)%W.length];out.push(['witz','Witzig',w,SERIOUS.includes(k)?-3:3])}
  return out}}
{const f=act;act=function(id,arg){if(id==='reply'&&p&&String(arg).endsWith(':witz')&&p.school&&p.age<19){p.clown=clamp((p.clown||0)+2,0,100)}return f(id,arg)}}
/* ---------- Gruppenchats: mehr Nachrichten und echte Antworten ---------- */
GMSG.g_klasse=[['Lena','Hat jemand die Mathe-Hausaufgaben?','q'],['Jonas','Morgen fällt Sport aus!!','info'],['Mia','Wer kommt mit ins Freibad?','plan'],['Tim','Ich hab den Test komplett verhauen','drama'],
  ['Ali','Welche Seiten müssen wir in Bio lesen?','q'],['Sophie','Herr Krause hat heute wieder Socken in Sandalen an 😂','fun'],['Ben','Wer hat meinen Füller geklaut???','drama'],['Emma','Abstimmung Klassenfahrt: Berlin oder Ostsee?','plan'],
  ['Noah','Ich hab Hunger. Das ist alles.','fun'],['Lea','Kann mir wer Englisch erklären? Ich versteh nix','q'],['Paul','Vertretungsstunde! Wir haben frei!!','info'],['Hannah','Wer bringt was zum Klassenfrühstück mit?','plan'],
  ['Finn','Hat jemand gesehen, was in der Pause passiert ist?','drama'],['Luca','Ich hab ein Meme über den Hausmeister gemacht 😂','fun'],['Marie','Morgen Wandertag, vergesst die Regenjacke!','info'],['Elias','Wer will in der Pause Fußball?','plan']];
GMSG.g_fam=GMSG.g_fam.concat([['Oma','Wer hat mich aus der Gruppe gelöscht??','fun'],['Mama','Weihnachten dieses Jahr bei uns?','plan'],['Papa','Hat jemand das Passwort vom Streamingdienst?','q'],['Tante Gabi','Gute Nacht, ihr Lieben 🌙🌙🌙','fun'],['Mama','Schickt mal alle eure Urlaubsfotos!','q'],['Onkel Bernd','Ich verkaufe meinen Rasenmäher. Interesse?','info']]);
GMSG.g_job=GMSG.g_job.concat([['Murat','Wer bestellt mit Pizza?','plan'],['Sabine','Der Drucker ist schon wieder kaputt.','drama'],['Chefin','Morgen 8 Uhr Team-Meeting, bitte pünktlich.','info'],['Jan','Wer hat Ahnung von Tabellen? Hilfe!','q'],['Lisa','Freitag Afterwork?','plan'],['Tom','Ich hab aus Versehen „Allen antworten“ geklickt 🙈','fun']]);
const GTYPE={};Object.values(GMSG).concat([GMSG_KID]).forEach(L=>L.forEach(x=>{GTYPE[x[1]]=x[2]||(/\?$/.test(x[1])?'q':'fun')}));
const GOPT={q:[['hilf','Helfen','Ich helf dir! Schick ich dir gleich.'],['witz','Witz reißen','Die Antwort ist 42. Immer.'],['still','Nur mitlesen','']],
  fun:[['lach','Mitlachen','HAHA 😂😂'],['witz','Einen draufsetzen','Und ich dachte, das wäre Mode 😂'],['still','Nur mitlesen','']],
  plan:[['dabei','Zusagen','Bin dabei!'],['witz','Witz reißen','Nur wenn ich DJ sein darf 🎧'],['still','Nur mitlesen','']],
  drama:[['trost','Aufmuntern','Oh nein! Das wird schon wieder.'],['witz','Witz reißen','Das wird mal eine legendäre Geschichte.'],['still','Nur mitlesen','']],
  info:[['danke','Bedanken','Danke für die Info!'],['witz','Witz reißen','*wirft Konfetti* 🎉'],['still','Nur mitlesen','']]};
function gLast(cid){const C=p.chats[cid];const m=C&&C.msgs.filter(x=>!x.me).slice(-1)[0];const t=m?m.t.replace(/^[^:]+:\s*/,''):'';return GTYPE[t]||(/\?/.test(t)?'q':'fun')}
{const _ce=chatExtra;chatExtra=function(c){let h=_ce(c);if(!String(c.id).startsWith('g_'))return h;const C=p.chats[c.id]||{};if(!C.pend||C.inv)return h;
  const i=h.indexOf('<div class="replies">');const O2=GOPT[gLast(c.id)]||GOPT.fun;const nh='<div class="replies">'+O2.map(([k,l,t])=>'<button class="rp rp-'+(k==='witz'?'witz':k==='still'?'kurz':'lieb')+'" data-a="gopt" data-g="'+c.id+':'+k+'">'+(t?'„'+esc(t)+'“':'Nichts schreiben')+'<small>'+l+'</small></button>').join('')+'</div>';
  if(i<0)return h+nh;const j=h.indexOf('</div>',i)+6;return h.slice(0,i)+nh+h.slice(j)}}
function gOpt(cid,k){const C=p.chats[cid];if(!C||!C.pend)return;const ty=gLast(cid),O2=(GOPT[ty]||GOPT.fun).find(x=>x[0]===k);if(!O2)return;C.pend=false;if(O2[2])msg(cid,O2[2],true);let t='';
  if(cid==='g_klasse'){if(k==='witz'){const cl=p.clown||0;if(cl>=70&&ch(.4)){p.cpop=clamp((p.cpop||50)-2,0,100);t='„Boah, nicht schon wieder“, schreibt Lena. Heute kam der Witz nicht an.'}else{p.clown=clamp(cl+4,0,100);p.cpop=clamp((p.cpop||50)+3,0,100);add('gl',2);pg('clown',.5);t='Die halbe Klasse schickt Lach-Smileys.'}}
    else if(k!=='still'){p.cpop=clamp((p.cpop||50)+2,0,100);t=k==='hilf'?'Lena schreibt: „Du bist die Rettung!“':'Ein paar Daumen hoch für dich.'}}
  else if(cid==='g_fam'){if(k!=='still'){relUp('mama',1);relUp('papa',1);t=k==='witz'?'Papa antwortet mit drei Tränen-Lach-Smileys.':'Mama freut sich, dass du dich meldest.'}}
  else if(cid==='g_job'){if(k==='witz'){if(ch(.7)){add('gl',2);t='Die Kollegen lachen. Sogar die Chefin reagiert mit einem Smiley.'}else{if(p.job)p.job.perf=Math.max(0,(p.job.perf||50)-2);t='Die Chefin schreibt: „Bitte beim Thema bleiben.“'}}else if(k!=='still'){if(p.job)p.job.perf=Math.min(100,(p.job.perf||50)+1);t='Das kommt gut an im Team.'}}
  render();if(t)toast(t)}
/* ---------- Klassenclown ---------- */
const CLOWNT=['Du machst den Lehrer nach. Die ganze Klasse kriegt einen Lachanfall.','Du baust einen Papierflieger-Wettbewerb in der Mathestunde auf.','Dein Furzkissen-Timing auf dem Lehrerstuhl: perfekt.','Du antwortest auf jede Frage im Stil eines Nachrichtensprechers.','Du verkleidest dich in der Pause als Hausmeister. Niemand merkt es.','Du reimst die ganze Bio-Stunde lang. Sogar die Lehrerin muss grinsen.'];
ACTS.clown={n:'Klassenclown spielen',d:'Beliebtheit und Spaß +, Noten −',ok:()=>!!p.school&&p.age>=7&&p.age<19,f:()=>{
  p.clown=clamp((p.clown||0)+R(6,11),0,100);p.cpop=clamp((p.cpop||50)+R(2,4),0,100);p.clownY=(p.clownY||0)+1;pg('clown',1);add('gl',R(3,6));let t=pick(CLOWNT);
  if(ch(.18+(p.clown||0)/400)){add('gl',-3);t+=' Leider sieht es die Lehrerin anders: Nachsitzen.'}
  else if(ch(.1)&&!p.parentsGone){relUp('mama',-4);msg('mama','Deine Lehrerin hat angerufen. Wir müssen reden.');t+=' Die Schule ruft zu Hause an. Ups.'}
  return t}};
DUR.clown=60;if(PL.schule&&!PL.schule.a.includes('clown'))PL.schule.a.push('clown');
const clownT=c=>c>=70?'Legende der Schule':c>=40?'Klassenclown':c>=20?'Witzbold':'Unauffällig';
QEV.k_cltafel=()=>E('Ab an die Tafel!','„Na, dann erklär uns das doch mal“, sagt deine Lehrerin, nachdem du schon wieder gequatscht hast.',()=>!!p.school,[
  ['Mit einem Witz antworten',()=>{p.clown=clamp((p.clown||0)+6,0,100);p.cpop=clamp((p.cpop||50)+4,0,100);if(ch(.3)){add('gl',-2);return 'Die Klasse lacht, die Lehrerin nicht. Nachsitzen.'}add('gl',3);return 'Die Klasse lacht, sogar die Lehrerin schmunzelt.'}],
  ['Ernsthaft versuchen',()=>{add('in',2);return 'Du stammelst dich durch, aber am Ende stimmt es sogar. Respekt.'}],
  ['Die Lehrerin imitieren',()=>{p.clown=clamp((p.clown||0)+10,0,100);p.cpop=clamp((p.cpop||50)+6,0,100);if(ch(.4)){if(!p.parentsGone)relUp('mama',-6);add('gl',-4);return 'Legendär, aber: schriftlicher Verweis. Zu Hause gibt es Ärger.'}return 'Perfekt getroffen. Darüber spricht die ganze Schule.'}]]);
QEV.k_cltheater=()=>E('Theater-AG','Die Theater-AG sucht eine Hauptrolle. „Du bist doch eh die lustigste Person der Klasse“, sagt die AG-Leiterin.',()=>!!p.school,[
  ['Zusagen',()=>{p.sk.charme=Math.min(100,(p.sk.charme||0)+5);add('gl',5);mile('Hauptrolle im Schultheater','star');return 'Am Premierenabend gibt es stehenden Applaus.'}],['Lieber nicht',()=>'Du bleibst lieber im Publikum.']]);
QEV.k_clstreich=()=>E('Klassenfahrt','Nachts im Jugendherbergszimmer. Alle schauen dich an: „Du hast doch bestimmt eine Idee für einen Streich?“',()=>!!p.school,[
  ['Zahnpasta-Streich',()=>{p.clown=clamp((p.clown||0)+8,0,100);p.cpop=clamp((p.cpop||50)+3,0,100);if(ch(.5)){add('gl',-2);return 'Erwischt. Strafdienst: Frühstücksgeschirr spülen. Hat sich trotzdem gelohnt.'}add('gl',5);return 'Niemand weiß, wer es war. Fast niemand.'}],
  ['Gruselgeschichte erzählen',()=>{p.cpop=clamp((p.cpop||50)+4,0,100);add('gl',3);return 'Um drei Uhr nachts traut sich keiner mehr aufs Klo.'}],['Schlafen',()=>'Du schläfst. Morgens hast du Zahnpasta im Gesicht.']]);
QEV.k_clernst=()=>E('Gespräch mit der Klassenlehrerin','„Ich mag deinen Humor. Aber du störst fast jede Stunde. So geht das nicht weiter.“',()=>!!p.school,[
  ['Versprechen, ruhiger zu werden',()=>{p.clown=clamp((p.clown||0)-15,0,100);add('in',2);return 'Du reißt dich zusammen. Die Noten danken es dir.'}],
  ['Weitermachen wie bisher',()=>{p.clown=clamp((p.clown||0)+5,0,100);add('gl',-3);if(!p.parentsGone)relUp('mama',-4);return 'Schriftlicher Verweis. Deine Eltern sind nicht begeistert.'}]]);
QEV.k_clpreis=()=>E('Abschlusszeitung','In der Abschlusszeitung wirst du zum „Klassenclown des Jahrgangs“ gewählt!',()=>!!p.school,[
  ['Stolz annehmen',()=>{mile('Klassenclown des Jahrgangs','star');p.sk.charme=Math.min(100,(p.sk.charme||0)+3);add('gl',6);return 'Bei der Feier musst du eine Rede halten. Natürlich mit Pointe.'}]]);
{const _py=perkYear;perkYear=function(R0){_py(R0);try{if(!p||!p.school)return;const c=p.clown||0;p.cs=p.cs||{};
  if(c>=25&&ch(.45))p.q.push({id:pick(c>=70&&!p.cs.ernst?['k_cltafel','k_clernst']:c>=40?['k_cltafel','k_cltheater','k_clstreich']:['k_cltafel','k_clstreich'])});
  if(p.q.some(x=>x.id==='k_clernst'))p.cs.ernst=1;
  if(c>=50&&p.age>=15&&!p.cs.preis&&ch(.5)){p.cs.preis=1;p.q.push({id:'k_clpreis'})}
  if(c>=40&&GROUPS.g_klasse[2]()&&ch(.4))msg('g_klasse',pick(['Lena','Jonas','Mia','Finn'])+': Erzähl mal wieder einen Witz! 😂');
  p.clown=Math.max(0,c-3)}catch(e){}}}
{const _g=gradesYear;gradesYear=function(){_g();const g=p.gr,n=p.clownY||0;if(g&&g.a===p.age&&n){const d=Math.min(1,n*.25);['ma','de','en'].forEach(k=>g[k]=clamp(Math.round((g[k]+d)*2)/2,1,6));g.avg=(g.ma+g.de+g.en+g.sp)/4;
  if(n>=2)log('Bemerkung im Zeugnis: „Stört häufig den Unterricht, ist aber bei allen beliebt.“')}p.clownY=0}}
{const _vb=viewBildung;viewBildung=function(){let h=_vb();if(!p.school&&!(p.clown>0))return h;
  const bar=(v,c)=>'<div class="bar clb"><i style="width:'+v+'%;background:'+c+'"></i></div>';
  return h+card('In der Klasse',row('Beliebtheit',(p.cpop||50)+' von 100',bar(p.cpop||50,'#2FA88F'))+row('Klassenclown',clownT(p.clown||0)+' · '+(p.clown||0)+' von 100',bar(p.clown||0,'#F2C14E'))+
    (p.school?actRows(['clown']):'')+'<p class="note">Witze machen dich beliebt und bringen Spaß, aber die Noten leiden und Lehrer verlieren die Geduld. Wer lange Klassenclown bleibt, wird davon geprägt: mehr Charme fürs Leben.</p>')}}
/* Witzige Videos laufen besser, wenn man früher Klassenclown war */
{const _dv=doVideo;doVideo=function(g){if(g==='comedy'&&(p.clown>=40||hasPr('clown'))){KB.vid*=1.25;try{return _dv(g)}finally{KB.vid=1}}return _dv(g)}}
/* ---------- Einstellungen: in Tabs, alles wie beim Start änderbar ---------- */
let einTab='spiel';
const ETITLE={'Dein Handy':'look','Hintergrund':'look','Design':'look','Darstellung':'look','Grafik der Stadt':'look','Startseite':'look','Hilfe':'help','Spielablauf':'x','Minispiele bei der Arbeit':'x','Kindheit':'spiel','Inhalte':'spiel','Deine Stadt':'spiel'};
function startCard(){const c=cfg(),ch2=(a,list,cur)=>'<div class="schips">'+list.map(([v,l])=>'<button class="sch" data-a="'+a+'" data-g="'+v+'" aria-pressed="'+(String(cur)===String(v))+'"><b>'+l+'</b></button>').join('')+'</div>';
  return '<section class="card sc"><h2 class="h">Wie beim Start</h2><p class="note" style="margin-top:-2px">Alles, was du beim Start gewählt hast, kannst du hier jederzeit ändern.</p><div class="sl">Aktionen pro Jahr</div>'+ch2('cfgact',[[3,'3'],[4,'4'],[6,'6'],[9,'9'],[12,'12'],[18,'18'],[0,'∞']],c.act)+
    '<div class="tgs">'+tog2('cfgclock',c.clock,'Tagesuhr','Jede Aktion kostet Zeit, um 3 Uhr ist Schluss')+'</div><div class="sl">Zufallsereignisse</div>'+ch2('cfgev',[['oft','Oft'],['normal','Normal'],['selten','Selten'],['aus','Aus']],c.ev)+
    '<div class="tgs">'+tog2('cfgbig',c.big!==false,'Großereignisse','Seltene Eilmeldungen: Lottogewinn, Quizshow, Hochwasser …')+tog('rival',O.rival,'Rivale','Eine Person aus der Schulzeit fordert dich ein Leben lang heraus')+tog2('tuttog',O.tut!==false,'Tipps zu den Apps','Kurzer Hinweis beim ersten Öffnen einer App')+'</div>'+
    '<div class="sl">Minispiele</div>'+ch2('mini',[['ask','Fragen'],['play','Immer spielen'],['skip','Überspringen']],O.mini||'ask')+
    '<p class="note">Mehr Aktionen gelten sofort, weniger ab dem nächsten Jahr. Herkunft und Sandbox gelten nur für ein neues Leben.</p></section>'}
function persCard(){if(!p)return '';const c=px$(250);
  return '<section class="card"><h2 class="h">Name</h2>'+(p.age>=18?'<p class="note">Beim Standesamt kannst du deinen Namen ändern. Gebühr: '+eur(c)+'.</p><div class="frow"><input id="nfn" maxlength="18" value="'+esc(p.first)+'" aria-label="Vorname"><input id="nln" maxlength="22" value="'+esc(p.last)+'" aria-label="Nachname"></div>'+btn('namechg',null,'Namen ändern','o',p.money<c):'<p class="note">Deinen Namen kannst du ab 18 beim Standesamt ändern.</p>')+'</section>'}
{const _ve=viewEinst;viewEinst=function(){const all=_ve(),S={spiel:[],look:[],bed:[],help:[]};
  all.split(/(?=<section)/).forEach(s=>{if(!s.trim())return;const m=s.match(/<h2 class="h"[^>]*>([^<]*)</),t=m?m[1]:'',k=ETITLE[t]||(t?'spiel':'bed');if(k==='x')return;
    if(!t)s=s.replace(/<button class="tg" data-a="opt" data-g="rival"[\s\S]*?<\/button>/,'');S[k].push(s)});
  const tabs=[['spiel','Spiel'],['look','Aussehen'],['bed','Bedienung'],['help','Hilfe']];
  const body=einTab==='spiel'?startCard()+persCard()+S.spiel.join(''):einTab==='look'?S.look.join(''):einTab==='bed'?S.bed.join(''):S.help.join('')+'<section class="card"><h2 class="h">Neues Leben</h2><p class="note">Startet ein neues Leben. Der aktuelle Spielstand wird dabei ersetzt.</p>'+btn('goStart',null,'Zum Startbildschirm','g')+'</section>';
  return '<div class="seg full etab">'+tabs.map(([k,l])=>'<button data-a="etab" data-g="'+k+'" aria-pressed="'+(einTab===k)+'">'+l+'</button>').join('')+'</div>'+body}}
{const f=act;act=function(id,arg){
  if(id==='etab'){einTab=arg;render();return}
  if(id==='gopt'){const [cid,k]=String(arg).split(':');gOpt(cid,k);return}
  if(id==='namechg'){const a=document.getElementById('nfn'),b=document.getElementById('nln');if(!a||!b||p.age<18)return;const fn=a.value.trim().slice(0,18),ln=b.value.trim().slice(0,22),c=px$(250);
    if(!fn||!ln){toast('Bitte Vor- und Nachnamen eintragen.');return}if(fn===p.first&&ln===p.last){toast('Das ist schon dein Name.');return}if(p.money<c){toast('Die Gebühr beträgt '+eur(c)+'.');return}
    p.money-=c;log('Namensänderung: Aus '+p.first+' '+p.last+' wird '+fn+' '+ln+'.');p.first=fn;p.last=ln;save();toast('Du heißt jetzt '+fn+' '+ln+'.');render();return}
  if(id==='goStart'){tab='home';p&&save();if(typeof renderStart==='function'){shell=false;renderStart()}return}
  return f(id,arg)}}
/* Zahnrad-Zugang auf der Startseite */
{const _vh=viewHome;viewHome=function(){const h=_vh();return h.replace('<div class="hsec">Alle Apps</div>','<div class="hsec hsx">Alle Apps<button class="lnk" data-a="goto" data-g="einst">Einstellungen</button></div>')}}
