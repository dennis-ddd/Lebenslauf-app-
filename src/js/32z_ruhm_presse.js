/* ================= Stadt-Ruf und Promi-System, Stadtanzeiger (Lokalnachrichten) ================= */
const FAMEL=[[0,'Unbekannt'],[15,'Im Viertel bekannt'],[35,'Stadtbekannt'],[60,'Lokalpromi'],[80,'Star der Stadt']];
const fameLv=f=>FAMEL.filter(x=>f>=x[0]).pop();
const fameNow=()=>p?(p.fame||0):0;
function buzz(n){p.fameB=Math.min(40,(p.fameB||0)+n)}
function fameParts(){const P=[];if(!p)return P;const sm=p.sm,b=p.biz,o=p.pol;
  if(sm&&sm.fol>100)P.push(['Klick',clamp(Math.round(Math.log10(sm.fol)*17-34),0,90),'deine Videos']);
  if(b){let v=(b.fronts||[]).length*5+(b.shop?10:0)+(b.bank?25:0);if(b.firm)v+=18+clamp(Math.round(Math.log10(Math.max(1e5,b.firm.val||1e5))*6-30),0,30)+(b.firm.ipo?10:0);if(v)P.push(['Unternehmen',Math.min(75,v),'dein Unternehmen'])}
  if(o&&o.lvl!=null)P.push(['Politik',[3,14,42,52,64,80][o.lvl]||0,'deine Politik']);
  if(p.job&&p.job.id==='profi')P.push(['Sport',45,'deine Karriere']);else if(p.spo&&p.spo.lvl)P.push(['Sport',Math.min(40,p.spo.lvl*8+(p.spo.fans||0)/2000),'deine Karriere']);
  const nw=typeof netWorth==='function'?netWorth():0;if(nw>=1e6)P.push(['Reichtum',Math.min(45,Math.round(12+Math.log10(nw/1e6)*14)),'deinen Erfolg']);
  if(p.prison||(p.wanted||0)>=2)P.push(['Schlagzeilen',p.prison?18:(p.wanted||0)*4,'deine Vergangenheit']);
  if(p.fameB)P.push(['Presse und Auftritte',Math.round(p.fameB),'deine Auftritte']);
  return P.sort((a,b)=>b[1]-a[1])}
function fameTarget(){const P=fameParts();if(!P.length)return 0;const sum=P.reduce((s,x)=>s+x[1],0);return clamp(Math.round(P[0][1]+(sum-P[0][1])*.25),0,100)}
const PIMG=()=>p.ruf>=30?'beliebt':p.ruf<=-30?'berüchtigt':'bekannt';
/* Bekanntheit wirkt im Alltag */
{const _bm=bizMul;bizMul=k=>_bm(k)*(p?1+fameNow()/500*(p.ruf<=-30?-1:1):1)}
const PLACT=new Set(PLACES.flatMap(x=>x.a));
const RECOG={club:['Am Tresen wirst du erkannt. Die nächste Runde geht aufs Haus.',2],mall:['Zwei Jugendliche wollen ein Selfie mit dir.',2],park:['Ein Kind fragt nach einem Autogramm.',3],fitness:['Am Nebengerät flüstert jemand: „Ist das nicht …?“',1],_:['Jemand erkennt dich auf der Straße und winkt dir zu.',1]};
{const f=act;act=function(id,arg){const b=p&&[p.act,p.clock,p.money].join('|');const r=f(id,arg);
  try{if(p&&p.alive&&PLACT.has(id)&&b!==[p.act,p.clock,p.money].join('|')){const fm=fameNow();if(fm>=35&&!p.prison){p.recog=p.recog&&p.recog.y===p.age?p.recog:{y:p.age,n:0};
    if(p.recog.n<5&&ch(fm>=60?.2:.1)){p.recog.n++;const pl=PLACES.find(x=>x.a.includes(id));
      if(p.ruf<=-30&&ch(.5)){add('gl',-3);toast('Jemand erkennt dich und pöbelt: „Du schon wieder!“')}
      else{const R2=RECOG[pl&&pl.id]||RECOG._;add('gl',R2[1]);toast(R2[0])}}}}}catch(e){errLog(e)}return r}}
/* Promi-Ereignisse */
const CHAR=n=>['Tafel '+n,'Kinderhospiz Regenbogen','Tierheim '+n,'Jugendsport '+n][R(0,3)];
QEV.f_radio=d=>E('Interview-Anfrage','Radio '+cityName(p.seed)+' lädt dich ins Morgenprogramm ein. Thema: '+(d&&d.t||'dein Leben')+'.',()=>true,[
  ['Zusagen',()=>{buzz(4);add('gl',3);if(ch(.25)){addRuf(-3);return 'Ein unbedachter Satz wird zum Meme. Halb so wild, aber alle zitieren ihn.'}addRuf(2);return 'Charmant und schlagfertig. Danach erkennen dich noch mehr Leute.'}],
  ['Absagen',()=>'Du bleibst lieber im Hintergrund.']]);
QEV.f_papa=()=>E('Paparazzi!','Im Stadtanzeiger erscheinen Fotos von dir und '+esc(p.partner&&p.partner.name||'deinem Schatz')+' beim Einkaufen.',()=>!!p.partner,[
  ['Gelassen bleiben',()=>{buzz(2);return 'Du lachst darüber. Die Fotos sind eh ganz nett geworden.'}],
  ['Anwalt einschalten',()=>{const c=px$(3000);p.money-=c;addRuf(1);return 'Die Fotos verschwinden aus dem Netz. Kostet dich '+eur(c)+'.'}],
  ['Den Fotografen zur Rede stellen',()=>{buzz(5);addRuf(-6);if(p.partner)relUp('partner',-3);return 'Das Video vom Streit geht viral. Keine gute Presse.'}]]);
QEV.f_charity=d=>E('Schirmherrschaft','Der Verein „'+(d&&d.n||'Tafel')+'“ fragt, ob du Schirmherr/in der Spendenaktion wirst.',()=>true,[
  ['Zusagen und '+eur(px$(5000))+' spenden',()=>{const c=px$(5000);if(p.money<c)return 'Dafür reicht dein Geld gerade nicht. Du hilfst trotzdem beim Aufbau.';p.money-=c;addRuf(8);buzz(4);add('gl',5);if(typeof valAdd==='function')valAdd('h',4);return 'Dein Gesicht auf allen Plakaten, das Spendenziel wird übertroffen.'}],
  ['Nur das Gesicht leihen',()=>{addRuf(2);buzz(2);return 'Ein Foto, ein Händedruck, ein freundlicher Artikel.'}],
  ['Absagen',()=>'Du sagst freundlich ab.']]);
QEV.f_fan=()=>E('Ein Fan zu viel','Jemand wartet seit Tagen vor deiner Haustür und schreibt dir Briefe.',()=>true,[
  ['Sicherheitsdienst ('+eur(px$(4000))+')',()=>{p.money-=px$(4000);return 'Zwei freundliche, sehr breite Herren sorgen für Ruhe.'}],
  ['Polizei rufen',()=>{if(ch(.6))return 'Die Polizei spricht ein Kontaktverbot aus. Endlich Ruhe.';if(typeof addLast==='function')addLast(4);return 'Die Polizei kann wenig tun. Du schläfst schlecht.'}],
  ['Ignorieren',()=>{if(typeof addLast==='function')addLast(6);add('gl',-4);return 'Es hört nicht auf. Du schaust jetzt immer zweimal aus dem Fenster.'}]]);
QEV.f_ad=d=>E('Werbegesicht gesucht',(d&&d.b||'Das Autohaus')+' will dich für Plakate in der ganzen Stadt. Gage: '+eur(d&&d.pay||1000)+'.',()=>true,[
  ['Annehmen',()=>{p.money+=d.pay;buzz(3);return 'Dein Gesicht hängt jetzt an jeder Bushaltestelle.'}],['Ablehnen',()=>'Du willst nicht überall hängen.']]);
/* Stadtanzeiger */
const RUB={politik:['Politik','#6C8CFF'],verkehr:['Verkehr','#E0A33A'],polizei:['Polizei','#E5484D'],wirtschaft:['Wirtschaft','#2FA88F'],sport:['Sport','#3BB273'],kultur:['Kultur','#8E63D6'],leute:['Leute','#E5407A'],stadt:['Stadt','#7F95AE']};
const STRN=['Hafenstraße','Lindenallee','Bahnhofstraße','Kastanienweg','Ringstraße','Schillerstraße','Goethestraße','Am Stadtpark','Uferpromenade','Marktstraße','Kirchgasse','Mühlenweg'];
const RAT=['Tempo 30 in der ganzen Innenstadt','ein neues Hallenbad','mehr Radwege','höhere Parkgebühren','kostenloses WLAN am Marktplatz','eine Ganztagsschule mehr','längere Öffnungszeiten der Bibliothek','neue Bänke im Stadtpark','eine Seilbahn zum Hafen. Abgelehnt.','einen Hundestrand am Ufer'];
const POLK=['Einbruchserie im {d}: Polizei bittet um Hinweise','Fahrraddiebe im {d} gefasst','Unfall an der Kreuzung {s1}/{s2}: zwei Leichtverletzte','Falscher Polizist zockt Rentnerin ab','Gestohlener Rasenmäher taucht im Hafenbecken auf','Großeinsatz am Bahnhof: Fehlalarm'];
const VERK=['Vollsperrung der {s1} am Wochenende','Neue Ampel an der {s1} sorgt für Stau','Busse fahren ab sofort im 10-Minuten-Takt','Schlaglöcher in der {s1} werden endlich geflickt','Neue Fahrradstraße in der {s1}'];
const KULT=['Konzert im Club Nachtfalter: {b} spielen vor ausverkauftem Haus','Freilichtkino im Stadtpark','Neue Ausstellung im Rathaus zieht Tausende an','Lesenacht in der Stadtbibliothek','Theater {c}: Premiere mit stehendem Applaus'];
const LIGA=['Kreisliga','Landesliga','Regionalliga','3. Liga','2. Bundesliga','Bundesliga'];
function lnews(r,t,x,me){news(t,'lokal',x);if(p.news[0]){p.news[0].r=r;if(me)p.news[0].me=1}if(me)buzz(2)}
const prFill=(t,c)=>t.split('{d}').join(pick(DIST)[0]).split('{s1}').join(pick(STRN)).split('{s2}').join(pick(STRN)).split('{b}').join(pick(BANDN)).split('{c}').join(c);
function pressYear(){if(!p||p.age<10)return;const s=cityS(),c=cityName(p.seed),me=p.first+' '+p.last;s.press=s.press||{};const P=s.press;
  // Bürgermeisterwahl alle 5 Jahre
  if((p.age+(p.seed%5))%5===0){const pl=p.pol&&p.pol.lvl===2&&p.job&&p.job.id==='pol';const W=pl?me:pick(FN.concat(MN))+' '+pick(LN),pr=R(41,63);s.mayor={n:W,y:p.age,me:pl?1:0};
    lnews('politik',pl?me+' bleibt Bürgermeister/in von '+c:'Neue/r Bürgermeister/in: '+W,'Mit '+pr+' % der Stimmen. Wahlbeteiligung: '+R(48,71)+' %.',pl)}
  else if(ch(.6))lnews('politik','Stadtrat beschließt '+pick(RAT),'Die Abstimmung war knapp.');
  if(ch(.55))lnews('verkehr',prFill(pick(VERK),c));
  if(ch(.55))lnews('polizei',prFill(pick(POLK),c));
  // Fußball: FC der Stadt
  P.fc=P.fc||{pos:R(4,12),lg:R(1,3)};const F=P.fc;F.pos=clamp(F.pos+R(-4,4),1,18);let ft='FC '+c+' beendet die Saison auf Platz '+F.pos+' der '+LIGA[F.lg];
  if(F.pos<=2&&F.lg<LIGA.length-1){F.lg++;ft='Aufstieg! FC '+c+' spielt nächste Saison in der '+LIGA[F.lg];F.pos=R(8,14)}else if(F.pos>=16&&F.lg>0){F.lg--;ft='Abstieg: FC '+c+' muss in die '+LIGA[F.lg];F.pos=R(4,10)}
  lnews('sport',ft,p.job&&p.job.id==='profi'?me+' war einer der besten Spieler der Saison.':'',p.job&&p.job.id==='profi');
  if(ch(.5))lnews('kultur',prFill(pick(KULT),c));
  // Leute: Berichte über dich, wenn du bekannt bist
  const f=fameNow(),ms=(p.ms||[]).filter(m=>m.a===p.age),fr=(p.biz&&p.biz.fronts||[]).length,firm=!!(p.biz&&p.biz.firm);
  if(f>=15){if(P.fr!=null&&fr>P.fr)lnews('wirtschaft',me+' eröffnet ein neues Geschäft','Schon das '+fr+'. Unternehmen in der Stadt.',1);
    if(firm&&!P.firm)lnews('wirtschaft',me+' gründet eine eigene Firma','„Ich will etwas aufbauen, das bleibt.“',1);
    if(ms.length&&ch(.7)){const m=pick(ms);lnews('leute',me+' ('+p.age+'): '+m.t,PIMG()==='berüchtigt'?'Die Stadt schaut kritisch hin.':'Die halbe Stadt gratuliert.',1)}
    if(p.prison&&!P.jail){lnews('polizei','Bekannt aus der Stadt: '+me+' muss ins Gefängnis','Viele sind schockiert.',1)}}
  P.fr=fr;P.firm=firm;P.jail=!!p.prison;
  // Rubriken für die übrigen Lokalmeldungen dieses Jahres
  (p.news||[]).forEach(n=>{if(n.a===p.age&&n.cat==='lokal'&&!n.r)n.r=/Baustelle|Straßenbahn|Sperrung|Bahn/.test(n.t)?'verkehr':/Eröffnung|Aus für|Leerstand|beliebter|Stellen|Arbeitslos|Firma/.test(n.t)?'wirtschaft':/Stadtfest|Park|Konzert|Kino|Fest/.test(n.t)?'kultur':/Wahl|Stadtrat|Bürger/.test(n.t)?'politik':'stadt'})}
function fameYear(){if(!p)return;p.fameB=Math.round((p.fameB||0)*.7);const t=fameTarget(),o=p.fame||0;p.fame=Math.round(o+(t-o)*.5);
  const L0=fameLv(o),L1=fameLv(p.fame);if(L1[0]>L0[0]&&p.age>=10){log('Bekanntheit: Du bist jetzt „'+L1[1]+'“.');if(L1[0]>=35)mile(L1[1],'star')}
  const f=p.fame,q=p.q;let n=0;const P=fameParts(),topic=P[0]?P[0][2]:'dein Leben',push=(id,d)=>{if(n<2){q.push({id,d});n++}};
  if(f>=70&&ch(.1))push('f_fan');if(f>=50&&p.partner&&ch(.25))push('f_papa');if(f>=35&&ch(.3))push('f_radio',{t:topic});
  if(f>=35&&ch(.2))push('f_charity',{n:CHAR(cityName(p.seed))});if(f>=45&&!(p.job&&p.job.id==='influ')&&ch(.25))push('f_ad',{b:pick(['Das Autohaus','Die Hansebank','Das Einkaufszentrum','Der Energieversorger']),pay:px$(Math.round(f*120/100)*100)})}
{const _py=perkYear;perkYear=function(R0){_py(R0);try{fameYear();pressYear()}catch(e){errLog(e)}}}
/* Ansichten */
function fameCard(){const f=fameNow(),L=fameLv(f),P=fameParts(),nx=FAMEL.find(x=>x[0]>f);
  const eff=f>=35?['Leute erkennen dich in der Stadt','Deine Geschäfte haben '+(p.ruf<=-30?'weniger':'mehr')+' Kunden (×'+(1+f/500*(p.ruf<=-30?-1:1)).toFixed(2).replace('.',',')+')','Bewerbungen fallen dir leichter','Radio, Werbung und Vereine fragen an'].concat(f>=50?['Paparazzi interessieren sich für dein Privatleben']:[]).concat(f>=70?['Manche Fans gehen zu weit']:[]):['Noch kennt dich kaum jemand. Firmen, Klick, Politik oder Sport machen dich bekannt.'];
  return '<section class="card fame"><div class="listseg"><h2 class="h" style="margin:0">Bekanntheit</h2><b>'+L[1]+'</b></div><div class="bar"><i style="width:'+f+'%"></i></div>'+
    '<p class="note">'+f+' von 100'+(nx?' · nächste Stufe „'+nx[1]+'“ ab '+nx[0]:'')+(f>=15?' · Die Stadt findet dich '+PIMG()+'.':'')+'</p>'+
    (P.length?'<div class="mt">Woher dich die Leute kennen</div>'+P.slice(0,4).map(x=>'<div class="mrow"><span>'+x[0]+'</span><b>'+Math.round(x[1])+'</b></div>').join(''):'')+
    '<div class="mt">Was das bedeutet</div><ul class="feff">'+eff.map(x=>'<li>'+x+'</li>').join('')+'</ul></section>'}
{const _rc=rufCard;rufCard=function(){return _rc()+fameCard()}}
function pressCard(){const c=cityName(p.seed),yr=(p.news||[]).filter(n=>n.cat==='lokal'&&n.r);if(!yr.length)return '';const last=yr[0].a,L=yr.filter(n=>n.a===last).slice(0,8),s=p.cityS||{};
  return '<section class="card press"><div class="prh"><b>Stadtanzeiger</b><small>'+esc(c)+' · Alter '+last+(s.mayor?' · Bürgermeister/in: '+esc(s.mayor.n):'')+'</small></div>'+
    L.map(n=>{const r=RUB[n.r]||RUB.stadt;return '<article class="nw'+(n.me?' me':'')+'"><span class="nc" style="background:'+r[1]+'">'+(n.me?'Über dich':r[0])+'</span><b>'+esc(n.t)+'</b>'+(n.x?'<small>'+esc(n.x)+'</small>':'')+'</article>'}).join('')+'</section>'}
{const _vn=viewNews;viewNews=function(){const all=p.news,last=(all.find(n=>n.cat==='lokal'&&n.r)||{}).a;p.news=all.filter(n=>!(n.cat==='lokal'&&n.r&&n.a===last));let h;try{h=_vn()}finally{p.news=all}
  const i=h.indexOf('</section>')+10;return h.slice(0,i)+pressCard()+h.slice(i)}}
