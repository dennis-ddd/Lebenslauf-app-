/* ================= Führerscheine: Auto, Motorrad, Boot, Flugzeug ================= */
const LIC={
  auto:{n:'Autoführerschein',k:'Klasse B',min:17,les:4,cost:2400,pr:'route',veh:null,note:'Mit 17 nur begleitet, ab 18 allein.'},
  moto:{n:'Motorradführerschein',k:'Klasse A1',min:16,les:3,cost:1800,pr:'route',veh:'moto',note:'Ab 16 bis 125 ccm, ab 18 Klasse A2.'},
  boot:{n:'Sportbootführerschein',k:'See und Binnen',min:16,les:2,cost:550,pr:'tonne',veh:'boot',note:'Pflicht ab 15 PS Motorleistung.'},
  flug:{n:'Flugschein',k:'PPL(A)',min:17,les:6,cost:11000,pr:'check',veh:'flug',note:'Privatpilotenlizenz für kleine Flugzeuge.'}};
const LICQ={
 auto:[['An einer Kreuzung ohne Schilder und Ampeln: Wer hat Vorfahrt?','Wer von rechts kommt','Wer schneller ist','Wer geradeaus fährt'],
  ['Wie schnell darfst du innerorts mit dem Auto höchstens fahren, wenn nichts anderes angezeigt ist?','50 km/h','60 km/h','30 km/h'],
  ['Höchstgeschwindigkeit für Autos auf Landstraßen außerorts?','100 km/h','80 km/h','120 km/h'],
  ['Wie viel Promille sind in der Probezeit erlaubt?','0,0 Promille','0,3 Promille','0,5 Promille'],
  ['Wie lange dauert die Probezeit normalerweise?','2 Jahre','1 Jahr','5 Jahre'],
  ['Welche Profiltiefe müssen Reifen mindestens haben?','1,6 mm','0,8 mm','3 mm'],
  ['Faustregel für den Abstand außerorts?','Halber Tacho in Metern','Eine Autolänge','10 Meter'],
  ['Stau auf einer zweispurigen Autobahn. Wo bildest du die Rettungsgasse?','Zwischen linker und rechter Spur','Auf dem Standstreifen','Gar nicht, erst wenn Blaulicht kommt'],
  ['Ein rundes blaues Schild mit weißem Pfeil bedeutet …','Vorgeschriebene Fahrtrichtung','Empfohlene Richtung','Parkplatz in Pfeilrichtung'],
  ['Die Ampel springt auf Gelb. Was tust du?','Anhalten, wenn es gefahrlos möglich ist','Gas geben','Sofort voll bremsen'],
  ['Darfst du das Handy beim Fahren in die Hand nehmen?','Nein','Ja, kurz zum Lesen','Ja, unter 30 km/h'],
  ['Faustformel für den normalen Bremsweg bei 50 km/h?','(50 : 10) × (50 : 10) = 25 m','50 × 2 = 100 m','50 : 2 = 25 km'],
  ['Ab welchem Alter gibt es begleitetes Fahren?','17','16','18'],
  ['Wann musst du Abblendlicht einschalten?','Bei Dämmerung, Dunkelheit oder schlechter Sicht','Nur nachts auf der Autobahn','Nur bei Regen']],
 moto:[['Ab welchem Alter gibt es die Klasse A1?','16','15','18'],
  ['Wie groß darf ein A1-Motorrad höchstens sein?','125 ccm und 11 kW','250 ccm','50 ccm'],
  ['Musst du auf dem Motorrad einen Helm tragen?','Ja, immer','Nur außerorts','Nur auf der Autobahn'],
  ['Wohin schaust du in einer Kurve?','Zum Kurvenausgang','Auf das Vorderrad','Auf den Tacho'],
  ['Mit welcher Bremse erzielst du die größte Bremswirkung?','Mit der Vorderradbremse, beide zusammen nutzen','Nur mit der Hinterradbremse','Mit dem Motor allein'],
  ['Musst du auch tagsüber mit Licht fahren?','Ja, Abblend- oder Tagfahrlicht','Nein, nur nachts','Nur im Tunnel'],
  ['Zwei Motorräder in einer Gruppe auf einer Spur. Wie fahrt ihr?','Versetzt hintereinander','Direkt nebeneinander','Dicht hintereinander in einer Linie'],
  ['Stau in der Stadt. Darfst du dich zwischen den Autos durchschlängeln?','Nein','Ja, langsam','Ja, wenn es eng ist'],
  ['Ab welchem Alter gibt es die Klasse A2?','18','17','21'],
  ['Was braucht ein Motorrad, um jemanden mitzunehmen?','Sitzplatz und Fußrasten für den Beifahrer','Nur einen zweiten Helm','Gar nichts'],
  ['Die Straße ist nass und voller Laub. Was tust du?','Langsamer fahren und sanft bremsen','Schneller fahren, um durchzukommen','Nur hinten bremsen']],
 boot:[['Welche Seite ist Backbord?','Links in Fahrtrichtung','Rechts in Fahrtrichtung','Hinten am Heck'],
  ['Welche Farbe hat das Seitenlicht an Steuerbord?','Grün','Rot','Weiß'],
  ['Zwei Motorboote kommen sich direkt entgegen. Was tun beide?','Nach Steuerbord ausweichen','Nach Backbord ausweichen','Beide stoppen'],
  ['Ab welcher Motorleistung brauchst du den Sportbootführerschein?','Mehr als 15 PS','Ab 5 PS','Ab 50 PS'],
  ['Ab welchem Alter gibt es den Sportbootführerschein?','16','14','18'],
  ['Du fährst in den Hafen ein. An welcher Seite lässt du die rote Tonne?','Backbord','Steuerbord','Egal'],
  ['Jemand fällt über Bord. Was zuerst?','„Mann über Bord“ rufen und die Person im Blick behalten','Weiterfahren und Hilfe holen','Sofort hinterherspringen'],
  ['Welches Funkwort steht für einen Notfall?','Mayday','Pan-Pan','Roger'],
  ['Ein Motorboot und ein Segelboot unter Segeln kreuzen. Wer weicht meist aus?','Das Motorboot','Das Segelboot','Das größere Boot'],
  ['Wer muss beim Überholen ausweichen?','Das überholende Boot','Das überholte Boot','Keiner'],
  ['Was sollten alle an Bord tragen, besonders bei Wind?','Rettungsweste','Mütze','Sonnenbrille']],
 flug:[['Ab welchem Alter gibt es die Privatpilotenlizenz?','17','16','21'],
  ['Welcher Transpondercode steht für einen Notfall?','7700','7600','1200'],
  ['Zwei Flugzeuge fliegen frontal aufeinander zu. Was tun beide?','Nach rechts ausweichen','Nach links ausweichen','Steigen'],
  ['In welche Richtung startet man am besten?','Gegen den Wind','Mit dem Wind','Quer zum Wind'],
  ['Was steuert das Querruder?','Die Rollbewegung um die Längsachse','Die Geschwindigkeit','Die Höhe direkt'],
  ['Was passiert bei einem zu großen Anstellwinkel?','Strömungsabriss','Mehr Auftrieb ohne Ende','Der Motor geht aus'],
  ['Wofür steht VFR?','Sichtflugregeln','Vollflugroute','Verkehrsfunkregel'],
  ['Wie heißt der Notruf im Funk?','Dreimal Mayday','Dreimal Hilfe','SOS über Lautsprecher'],
  ['Was machst du vor jedem Flug?','Eine Vorflugkontrolle','Nur volltanken','Nichts, das macht der Tower'],
  ['Hohe Lage, heißer Tag: Wie verändert sich die Startstrecke?','Sie wird länger','Sie wird kürzer','Sie bleibt gleich'],
  ['Welches Tauglichkeitszeugnis brauchst du für die PPL?','Klasse 2','Klasse 1','Keins'],
  ['Was zeigt der Höhenmesser mit eingestelltem QNH an?','Die Höhe über dem Meeresspiegel','Die Höhe über dem Boden','Die Geschwindigkeit']]};
const VEH={moto:{n:'Motorrad',pr:7500,c:700,gl:4,lic:'moto',r:'Ausfahrt'},boot:{n:'Motorboot',pr:28000,c:2400,gl:5,lic:'boot',r:'Bootstour'},flug:{n:'Kleinflugzeug',pr:140000,c:11000,gl:7,lic:'flug',r:'Rundflug'}};
WISCH.tonne={h:'Fahrprüfung auf dem Wasser',p:'Der Prüfer gibt dir Situationen. Was machst du?',bins:['Backbord','Steuerbord'],gen:()=>pick([['Rote Tonne voraus. An welcher Seite lässt du sie?',0],['Grüne Tonne voraus. An welcher Seite lässt du sie?',1],['Motorboot kommt dir direkt entgegen. Wohin weichst du aus?',1],['Du willst ein Boot überholen, links ist frei. Auf welcher Seite überholst du?',0],['An welcher Seite leuchtet dein rotes Licht?',0],['An welcher Seite leuchtet dein grünes Licht?',1]])};
MGX.tonne=(t,l,cb)=>wischRound(t,l,cb,'tonne');MGN.tonne=['Prüfungsfahrt','Entscheide richtig zwischen Backbord und Steuerbord.'];
const licS=k=>{p.lic=p.lic||{};if(k==='auto'&&p.fs&&!(p.lic.auto&&p.lic.auto.ok))p.lic.auto={l:4,th:1,ok:1};return p.lic[k]||(p.lic[k]={l:0,th:0,ok:0})};
const hasLic=k=>!!(licS(k).ok);
const lesPr=k=>px$(Math.round(LIC[k].cost*.8/LIC[k].les/10)*10);
function licTheory(k){const L=LIC[k],s=licS(k),fee=px$(k==='flug'?300:90);if(p.money<fee){toast('Die Theorieprüfung kostet '+eur(fee)+'.');return}
  if(!spendTime(60))return;p.money-=fee;const Q=shuffle(LICQ[k].slice()).slice(0,5);let sc=0;const wrong=[];
  const ask=i=>{if(i>=5)return end();const q=Q[i];dialog('Theorie · Frage '+(i+1)+' von 5',q[0],shuffle([[q[1],1],[q[2],0],[q[3],0]]).map(([t,ok])=>[t,()=>{if(ok)sc++;else wrong.push(q);sfx(ok?'coin':'bad');setTimeout(()=>ask(i+1),60)}]))};
  const end=()=>{const pass=sc>=4;if(pass){s.th=1;add('in',2)}else add('gl',-2);
    const txt=sc+' von 5 richtig. '+(pass?'Bestanden! Jetzt fehlt noch die praktische Prüfung.':'Durchgefallen. Ab 4 richtigen Antworten bestehst du.')+(wrong.length?' Richtig wäre gewesen: '+wrong.map(q=>'„'+q[1]+'“').join(', ')+'.':'');
    log(L.n+', Theorie: '+sc+' von 5.');save();render();dialog(pass?'Theorie bestanden':'Theorie nicht bestanden',txt,[['OK',null]])};
  ask(0)}
function licPractice(k){const L=LIC[k],s=licS(k),fee=px$(k==='flug'?900:k==='boot'?120:180);if(p.money<fee){toast('Die Prüfung kostet '+eur(fee)+'.');return}
  if(!useAct())return;p.money-=fee;
  mgStart(L.pr,L.pr==='tonne'?1:2,'Praktische Prüfung',(sc,auto)=>{const need=L.pr==='tonne'?1:2,ok=auto?ch(.45+s.l*.06+(p.sk.fahren||0)/250):sc>=need;
    if(ok){s.ok=1;if(k==='auto')p.fs=true;add('gl',8);mile(L.n,'star');if(p.sk)p.sk.fahren=Math.min(100,(p.sk.fahren||0)+4)}else{add('gl',-4);s.fail=(s.fail||0)+1}
    const txt=ok?'Bestanden! Du hast jetzt den '+L.n+'.'+(k==='auto'&&p.age<18?' Bis 18 fährst du begleitet.':''):'Durchgefallen. Der Prüfer war nicht zufrieden. Nimm noch eine Stunde und versuch es nochmal.';
    log(L.n+': '+(ok?'bestanden.':'durchgefallen.'));save();render();dialog(ok?'Bestanden!':'Nicht bestanden',txt,[['OK',null]])},40+s.l*10+(p.sk.fahren||0)/2)}
function licCard(){if(p.age<14)return '';p.veh=p.veh||[];let h='';
  Object.keys(LIC).forEach(k=>{const L=LIC[k],s=licS(k);let sub,b='';
    if(s.ok){sub=L.k+' · bestanden';const V=L.veh&&VEH[L.veh];if(V){b=p.veh.includes(L.veh)?btn('vride',L.veh,V.r,'o',p.act<=0):btn('vbuy',L.veh,V.n+' · '+eur(px$(V.pr)),'',p.age<18||p.money<px$(V.pr))}else b='<span class="chip">Fertig</span>'}
    else if(p.age<L.min){sub=L.k+' · ab '+L.min+' Jahren';b='<span class="chip">Später</span>'}
    else{sub=L.k+' · Fahrstunden '+s.l+' von '+L.les+(s.th?' · Theorie bestanden':'');
      b=(s.l<L.les?btn('lles',k,'Stunde · '+eur(lesPr(k)),'o',p.act<=0||p.money<lesPr(k)):'')+(!s.th&&s.l>=Math.ceil(L.les/2)?btn('lthe',k,'Theorie','o'):'')+(s.th&&s.l>=L.les?btn('lpra',k,'Prüfung','o',p.act<=0):'')}
    h+=row(L.n,sub+(s.ok?'':'<br><small class="note">'+L.note+'</small>'),'<span class="licb">'+b+'</span>')});
  return card('Führerscheine',h+'<p class="note">Erst Fahrstunden, dann 5 Theoriefragen (ab 4 richtig bestanden), dann die praktische Prüfung.</p>')}
{const _vb=viewBildung;viewBildung=function(){return _vb()+licCard()}}
function act22(id,arg){switch(id){
  case 'lles':{const L=LIC[arg],s=L&&licS(arg);if(!L||s.ok||p.age<L.min||s.l>=L.les||p.prison)return 1;const c=lesPr(arg);if(p.money<c){toast('Eine Stunde kostet '+eur(c)+'.');return 1}if(!useAct())return 1;p.money-=c;s.l++;if(p.sk)p.sk.fahren=Math.min(100,(p.sk.fahren||0)+2);
    done(pick(['Die Stunde lief gut.','Einmal fast den Bordstein erwischt, sonst prima.','Dein Lehrer nickt zufrieden.','Ein bisschen nervös, aber du wirst sicherer.'])+' Stunde '+s.l+' von '+L.les+'.');return 1}
  case 'lthe':{const L=LIC[arg],s=L&&licS(arg);if(!L||s.ok||s.th||p.prison)return 1;licTheory(arg);return 1}
  case 'lpra':{const L=LIC[arg],s=L&&licS(arg);if(!L||s.ok||!s.th||s.l<L.les||p.prison)return 1;licPractice(arg);return 1}
  case 'fahrschule':{const s=licS('auto');if(p.age<17||s.ok)return 0;tab='bildung';render();toast('Die Fahrschule findest du jetzt unter Bildung.');return 1}
  case 'vbuy':{const V=VEH[arg];if(!V||!hasLic(V.lic)||p.age<18||p.veh.includes(arg))return 1;const c=px$(V.pr);if(p.money<c){toast(V.n+' kostet '+eur(c)+'.');return 1}p.money-=c;p.veh.push(arg);add('gl',V.gl+3);mile(V.n+' gekauft','star');done('Du hast jetzt ein '+V.n+'. Unterhalt: '+eur(px$(V.c))+' pro Jahr.');return 1}
  case 'vride':{const V=VEH[arg];if(!V||!p.veh.includes(arg)||p.prison||!useAct())return 1;add('gl',V.gl+R(0,3));let t;
    if(arg==='moto'&&ch(.04)){add('ge',-15);t='Auf nasser Straße rutschst du weg. Prellungen, aber der Helm hat dich gerettet.'}
    else{const pt=p.partner&&p.partner.rel!=null;if(pt)relUp('partner',4);t=(arg==='moto'?'Kurvige Landstraße, Sonne, Freiheit.':arg==='boot'?'Raus aufs Wasser. Der Wind riecht nach Salz.':'Über den Wolken. Die Stadt sieht aus wie Spielzeug.')+(pt?' '+esc(p.partner.name||'Dein Schatz')+' war mit dabei.':'')}
    done(t);return 1}
  }return 0}
{const f=act;act=function(id,arg){if(act22(id,arg))return;return f(id,arg)}}
{const _py=perkYear;perkYear=function(R0){_py(R0);try{if(!p)return;p.veh=p.veh||[];
  if(p.fs)licS('auto');
  if(p.job&&p.job.id==='pilot'&&!hasLic('flug')){p.lic.flug={l:6,th:1,ok:1};log('Über die Airline hast du auch die Privatpilotenlizenz bekommen.')}
  const c=p.veh.reduce((s,k)=>s+px$(VEH[k].c),0);if(c){p.money-=c;if(p.money<0&&p.veh.length&&ch(.5)){const k=p.veh.pop();log('Du musstest dein '+VEH[k].n+' verkaufen, das Geld war zu knapp.');p.money+=Math.round(px$(VEH[k].pr)*.5)}}
  p.veh.forEach(k=>add('gl',1));}catch(e){errLog(e)}}}
