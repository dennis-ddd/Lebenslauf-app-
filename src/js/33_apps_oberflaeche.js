const APPS=[
['leben','Leben',0xF2B33D,'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'],
['chats','Chats',0x2FB86E,'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>'],
['klick','Klick',0xE5407A,'<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><path d="M16.5 7.5h.01"/>','linear-gradient(135deg,#FF9A4C,#E5407A 55%,#8E63D6)'],
['geschaefte','Geschäfte',0x5B5BD6,'<rect x="4" y="3" width="10" height="18" rx="1.5"/><path d="M14 9h5a1 1 0 0 1 1 1v11H14M7 7h4M7 11h4M7 15h4"/>','linear-gradient(135deg,#7B7BF0,#4B3FD1)'],
['casino','Casino',0xC9A227,'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.3"/><circle cx="16" cy="16" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="16" cy="8" r="1.3"/><circle cx="8" cy="16" r="1.3"/>','linear-gradient(135deg,#F6D365,#C9A227 55%,#8A5A00)'],
['news','Nachrichten',0xD64545,'<rect x="3" y="5" width="15" height="15" rx="2"/><path d="M18 9h3v9a2 2 0 0 1-2 2"/><path d="M7 9h7M7 13h7M7 17h4"/>','linear-gradient(135deg,#F06B5B,#B42318)'],
['kalender','Kalender',0xF5F7FB,'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/>','linear-gradient(135deg,#FF8A65,#E5527A)'],
['stadt','Stadt',0x2B59C3,'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'],
['jobs','Jobs',0x5B7CE6,'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>'],
['wege','Karriere',0x14503A,'<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>','linear-gradient(135deg,#3BB273,#14503A)'],
['bildung','Bildung',0x3F8EDB,'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>'],
['liebe','Liebe',0xE5527A,'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'],
['familie','Familie',0x2FA88F,'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M14 20c0-2.5 1.3-5 3-5s4 1.5 4 5"/>'],
['freizeit','Freizeit',0x3BB273,'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>'],
['strasse','Straße',0xD9483B,'<path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z"/>'],
['bank','Bank',0x1E9E6A,'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>'],
['boerse','Börse',0x158A7A,'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>'],
['wohnen','Wohnen',0xF08A24,'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'],
['garage','Garage',0x6B7385,'<path d="M5 16l1.5-5a2 2 0 0 1 2-1.5h7a2 2 0 0 1 2 1.5L19 16"/><rect x="3" y="16" width="18" height="4" rx="1.5"/><circle cx="7.5" cy="20" r="1"/><circle cx="16.5" cy="20" r="1"/>'],
['shop','Shop',0xC2408C,'<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'],
['erfolge','Erfolge',0x8E63D6,'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M10 17h4"/>'],
['store','App Store',0x2B9ED8,'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 15l3-7 3 7M10 13h4"/>','linear-gradient(135deg,#3FD0A4,#0E9F7E)'],
['einst','Einstellungen',0x6B7385,'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>']];
const APP=Object.fromEntries(APPS.map(a=>[a[0],a]));
const PRISON_APPS=['news','kalender','einst','chats','klick','leben','freizeit','bank','boerse','erfolge','stadt'];
const btn=(id,arg,label,cls,dis)=>'<button class="btn sm '+(cls||'')+'" data-a="'+id+'"'+(arg!=null?' data-g="'+esc(arg)+'"':'')+(dis?' disabled':'')+'>'+label+'</button>';
const row=(t,s,right)=>'<div class="row"><div class="t"><b>'+t+'</b>'+(s?'<small>'+s+'</small>':'')+'</div>'+(right||'')+'</div>';
const card=(title,body)=>'<section class="card">'+(title?'<h2 class="h">'+title+'</h2>':'')+body+'</section>';
function status(){
  if(!p.alive)return 'verstorben';if(p.prison)return 'im Gefängnis';if(p.job)return p.job.t;
  if(p.study)return 'Student/in '+p.study.f;if(p.azubi)return 'Azubi';
  if(p.school)return p.school==='Grundschule'?'Grundschüler/in':'Schüler/in';if(p.pension)return 'Rentner/in';
  return p.age<6?'Kleinkind':'ohne Job';
}
function actRows(ids){return ids.map(a=>{const A=ACTS[a];return row(A.n,A.d+(clockOn()?' · '+durTxt(DUR[a]||60):''),btn(a,null,A.crime?'Wagen':'Los',A.crime?'g':'o',!can(a)))}).join('')}
function special(a){
  let h='';
  switch(a){
  case 'study':if(p.deg)return row('Studium '+p.deg,'abgeschlossen');if(p.study)return row('Studium '+p.study.f,'noch '+p.study.left+' Jahr(e)');
    Object.keys(STUDY).forEach(f=>h+=row('Studium '+f,STUDY[f]+' Jahre · braucht Abitur',btn('study',f,'Einschreiben','o',p.edu!=='Abitur'||inSchool()||p.age<17||!!p.prison)));return h;
  case 'azubi':return row('Ausbildung',p.aus?'abgeschlossen':(p.azubi?'noch '+p.azubi.left+' Jahr(e)':'3 Jahre · 12.000 € pro Jahr · braucht Schulabschluss'),p.aus||p.azubi?'':btn('azubi',null,'Starten','o',RANK[p.edu]<1||inSchool()||!!p.prison));
  case 'jobs':return row('Stellenangebote','23 Berufe, passend zu deinem Abschluss',btn('goto','jobs','Ansehen'));
  case 'work':return row('Schicht arbeiten',p.job?'Minispiel: Kopfrechnen für Leistung und Bonus':'Du brauchst zuerst einen Job',btn('work',null,'Los','o',!p.job||p.act<=0||!!p.prison));
  case 'bankui':return row('Konto, Sparbuch und Kredit','Sparkonto '+eur(p.sav)+' · Kredit '+eur(loanSum()),btn('goto','bank','Öffnen'));
  case 'stocksui':return row('Aktien handeln','Depotwert '+eur(stockVal()),btn('goto','boerse','Zur Börse'));
  case 'homesui':return row('Wohnungen und Häuser','Du wohnst: '+HOMES[p.home].n,btn('goto','wohnen','Ansehen'));
  case 'shop':SHOP.forEach(s=>{const own=p.items.includes(s.id);h+=row(s.n,own?'im Besitz':eur(s.pr)+' · ab '+s.min+' Jahren',own?'<span class="chip">Besitz</span>':btn('buy',s.id,'Kaufen','',p.age<s.min||!!p.prison))});return h;
  case 'adopt':Object.keys(PETS).forEach(k=>{const P2=PETS[k];h+=row(P2.n,eur(P2.pr)+' · Unterhalt '+eur(P2.c)+'/Jahr',btn('adopt',k,'Adoptieren','',p.age<8||!!p.prison))});return h;
  case 'cars':Object.keys(CARS).forEach(k=>{const C=CARS[k];h+=row(C.n,eur(C.pr)+' · Unterhalt '+eur(C.c)+'/Jahr · ab 18',btn('buycar',k,'Kaufen','',p.age<18||!!p.prison))});return h;
  case 'casinoui':return row('Casino','Automat, Roulette und Blackjack · ab 18',btn('goto','casino','Rein','o',p.age<18));
  case 'bizui':return row('Geschäfte und Firmen','Unternehmen gründen, Läden kaufen, Firma aufbauen',btn('goto','geschaefte','Ansehen'));
  case 'record':return row('Strafregister',p.crimes?p.crimes+' Straftat(en)':'keine Einträge')+row('Bei der Polizei anfangen','braucht Abitur und Gesundheit 60 %',btn('goto','jobs','Bewerben'));
  }
  return '';
}
function placeCard(id){
  const P=PL[id];let h='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">'+P.n+'</h2><span class="chip">'+akt(p.act)+'</span></div>';
  if(p.prison&&id!=='jva')return h+'<p class="note" style="margin-top:8px">Du sitzt im Gefängnis und kommst hier nicht hin. Noch '+p.prison+' Jahr(e).</p></section>';
  P.a.forEach(a=>{h+=ACTS[a]?actRows([a]):special(a)});
  return h+'</section>';
}
function viewStadt(){
  let h=cevStrip();
  if(cityMode==='list'||!G){
    h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">'+esc(cityName(p.seed))+'</h2>'+(G?'<div class="seg" style="border:2px solid var(--line)">'+['3d','2d','list'].map(m=>'<button data-a="mode" data-g="'+m+'" aria-pressed="'+(cityMode===m)+'">'+(m==='list'?'Liste':m.toUpperCase())+'</button>').join('')+'</div>':'')+'</div>'+
      (G?'':'<p class="note" style="margin:6px 0">Die 3D-Ansicht läuft auf diesem Gerät nicht, hier sind alle Orte als Liste.</p>')+
      '<div class="plist" style="margin-top:10px">'+PLACES.map(x=>'<button class="pl" data-a="sel" data-g="'+x.id+'" aria-pressed="'+(sel===x.id)+'"><i style="background:'+hex(x.c)+'"></i>'+x.n+'</button>').join('')+'</div></section>';
  }
  h+=sel?placeCard(sel):card('','<p class="note">Tippe auf ein Gebäude mit Namensschild.</p>');
  h+=card('Deine Stadt',row(esc(cityName(p.seed)),CITYT[p.city||'mittel'][0]+' · Gehalt ×'+String(cityF(0)).replace('.',',')+' · Mieten ×'+String(cityF(1)).replace('.',','))+'<p class="note">'+CITYT[p.city||'mittel'][3]+'</p>');
  h+='<button class="btn g" data-a="newcity"'+(p.prison?' disabled':'')+'>In eine neue Stadt ziehen</button>';
  return h;
}
function statBars(){return Object.keys(STAT).map(k=>'<div class="stat"><div class="r"><span>'+STAT[k]+'</span><span>'+p.st[k]+' %</span></div><div class="bar"><i class="'+(p.st[k]<30?'low':'')+'" style="width:'+p.st[k]+'%"></i></div></div>').join('')}
function viewChats(){
  const cs=contacts();
  if(chatSel){const c=cs.find(x=>x.id===chatSel);if(!c){chatSel=null;return viewChats()}
    if(p.chats[c.id])p.chats[c.id].un=0;
    const acts={mama:[['call','Anrufen']],papa:[['call','Anrufen']],freund:[['meet','Treffen']],partner:[['love','Liebe Nachricht'],['time','Date']],chef:[]};
    const qa=(acts[c.id]||[['call','Anrufen']]).map(([k,l])=>btn(k==='time'?'time':k,c.id,l,'o',k==='love'?p.loveA===p.age||!!p.prison:(p.act<=0||!!p.prison))).join('');
    return '<section class="chat"><header><button class="back" data-a="chat" data-g="" aria-label="Alle Chats"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><span class="cav" style="background:'+c.col+'">'+esc(c.n[0])+'</span><div><b>'+esc(c.n)+'</b><small>'+esc(c.sub||'')+'</small></div></header>'+
      '<div class="bubbles">'+(c.msgs.length?c.msgs.slice(-25).map(m=>'<div class="bub'+(m.me?' me':'')+'">'+esc(m.t)+'<small>Alter '+m.a+'</small></div>').join(''):'<p class="note" style="text-align:center">Noch keine Nachrichten.</p>')+'</div>'+
      chatExtra(c)+(qa&&!c.id.startsWith('g_')?'<div class="qa">'+qa+'</div>':'')+'</section>';
  }
  return '<section class="card clist">'+cs.map(c=>{const l=c.msgs[c.msgs.length-1];return '<button class="crow" data-a="chat" data-g="'+c.id+'"><span class="cav" style="background:'+c.col+'">'+esc(c.n[0])+'</span><span class="ct"><b>'+esc(c.n)+'</b><small>'+(l?(l.me?'Du: ':'')+esc(l.t):esc(c.sub||''))+'</small></span>'+(c.un?'<span class="badge">'+c.un+'</span>':(p.chats[c.id]&&p.chats[c.id].inv?'<span class="badge nb">Einladung</span>':''))+'</button>'}).join('')+'</section>';
}
const RANKN=['Einstieg','Erfahren','Leitung','Spitze'];
const akt=n=>(clockOn()?clockTxt()+' · ':'')+(unl()&&n>0?'∞ Aktionen':n===1?'1 Aktion':n+' Aktionen');
function badgeOf(id){if(id==='store')return p.storeY===p.age?0:recs().length;if(id==='chats')return unread();if(id==='klick')return p.sm?p.sm.deals.length+p.sm.nf:(p.age>=13?'!':0);if(id==='jobs')return newJobs();if(id==='news')return p.newsUn||0;if(id==='erfolge')return p.newUL||0;if(id==='kalender')return openBd();return 0}
function viewHome(){
  const last=p.log.filter(e=>!e.t.startsWith('Jahresbilanz')).slice(-1)[0];
  const ring=k=>'<div class="rw"><div class="ring" style="--v:'+p.st[k]+'"><b>'+p.st[k]+'</b></div><small>'+STAT[k]+'</small></div>';
  return '<section class="phone ph'+phoneTier()+(phoneOld()?' old':'')+(curFrame()?' frm':'')+'" style="--wall:'+WALLS[wallUsable(O.wall)?O.wall:0][1]+(curFrame()?';--frame:'+(curFrame()[0]==='#'?'linear-gradient('+curFrame()+','+curFrame()+')':curFrame()):'')+'"><div class="pstat"><span>'+esc(cityName(p.seed))+'</span><span>'+PHONES[phoneTier()][0]+(phoneOld()?' · Akku 9 %':'')+'</span><span>'+akt(p.act)+'</span></div>'+
    dayBar()+'<div class="rings">'+Object.keys(STAT).map(ring).join('')+'</div>'+
    (last?'<button class="news" data-a="goto" data-g="leben"><small>Neuigkeit · Alter '+last.a+'</small>'+esc(last.t)+'</button>':'')+
    (p.prison?'<p class="pnote">Du sitzt noch '+p.prison+' Jahr(e) im Gefängnis. Einige Apps sind gesperrt.</p>':'')+
    '<div class="apps'+(editApps?' edit':'')+'">'+orderedApps().filter(a=>appVisible(a[0])).map(([id,n,c,ic,bg])=>{const lock=p.prison&&!PRISON_APPS.includes(id)&&!editApps,b=editApps?0:badgeOf(id),nw=!editApps&&p.appSeen&&p.appSeen[id]===0;
      return '<button class="app'+(nw?' newapp':'')+(editApps&&swapSel===id?' pick':'')+'" data-a="'+(editApps?'appswap':'goto')+'" data-g="'+id+'"'+(lock?' disabled':'')+'><span class="ic" style="background:'+(bg||hex(c))+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+ic+'</svg>'+(b&&!lock?'<span class="badge">'+b+'</span>':nw?'<span class="badge nb">Neu</span>':'')+'</span>'+n+'</button>'}).join('')+'</div><div class="phb">'+(editApps?'<span class="note">'+(swapSel?'Tippe auf den neuen Platz':'Tippe eine App an, dann ihren neuen Platz')+'</span>'+btn('appreset',null,'Zurücksetzen','g')+btn('appedit',null,'Fertig','o'):btn('appedit',null,'Apps anordnen','g'))+'</div></section>';
}
function viewApp(id){
  const V={
  chats:viewChats,store:viewStore,news:viewNews,kalender:viewKal,wege:viewWege,einst:viewEinst,klick:viewKlick,geschaefte:viewBiz,casino:viewCasino,
  leben:viewLeben,
  stadt:viewStadt,
  jobs:()=>{let h='';
    if(!(p.job&&p.job.id==='influ'))h+='<button class="trend pro" data-a="goto" data-g="klick"><b>Influencer-Karriere</b><span>'+(p.sm?kfmt(p.sm.fol)+' von 10.000 Followern für den Job Influencer/in. Weiter in Klick':'Starte auf Klick und werde ab 10.000 Followern Influencer/in')+'</span></button>';
    if(p.job&&p.job.id==='influ')h+='<section class="card"><div class="lbl">AKTUELLER JOB</div>'+row('Influencer/in','seit '+p.job.yrs+' Jahr(en) · letztes Jahr '+eur(p.job.pay)+' aus Klick')+'<div class="btns">'+btn('goto','klick','Zu Klick','o')+btn('quit',null,'Aufhören','g')+'</div></section>';
    else if(p.job){const rk=p.job.rank||1;h+='<section class="card"><div class="lbl">DEIN JOB</div>'+row(esc(p.job.t),RANKN[rk-1]+' · seit '+p.job.yrs+' Jahr(en) · Leistung '+p.job.perf+' %','<span class="num" style="color:var(--blueText)">'+eur(p.job.pay)+'</span>')+
      '<div class="segs big4">'+[1,2,3,4].map(i=>'<i class="'+(i<=rk?'on':'')+'"></i>').join('')+'</div><p class="note" style="margin:6px 0">Rang '+rk+' von 4 · '+(rk<4?'Gute Leistung bringt Beförderungen mit 20 % mehr Gehalt.':'Ganz oben.')+'</p>'+'<div class="btns">'+btn('work',null,'Schicht (Minispiel)','o',p.act<=0||!!p.prison)+btn('quit',null,'Kündigen','g')+'</div></section>'}
    h+=jobExtra();
    return h+card('Stellenangebote',JOBS.map(j=>{const r=canJob(j);return row(j.t+(j.part?' (Teilzeit)':''),r||(j.id==='influ'?'Einkommen aus Klick, 1,5× Reichweite':eur(j.pay)+' pro Jahr'),btn('apply',j.id,'Bewerben','o',!!r||p.act<=0||!!(p.job&&p.job.id===j.id)))}).join(''))},
  bildung:viewBildung,
  liebe:()=>{let h='';
    if(p.partner)h=row(esc(p.partner.name),(p.partner.mar?'verheiratet':'in einer Beziehung')+' · Verbindung '+clamp(p.partner.rel,0,100)+' %')+
      '<div class="btns">'+btn('time',null,'Zeit verbringen','',p.act<=0||!!p.prison)+(p.partner.mar?'':btn('propose',null,'Heiratsantrag','o',p.age<18||p.act<=0||!!p.prison))+btn('baby',null,'Kind bekommen','',p.age<18||p.age>48||p.act<=0||!!p.prison)+btn('split',null,p.partner.mar?'Scheidung':'Schluss machen','g')+'</div>';
    else h=row('Single',p.age<14?'ab 14 Jahren kannst du daten':'Mach dich auf die Suche')+actRows(['date']);
    return card('Beziehung',h)},
  familie:viewFamilie,
  freizeit:viewFreizeit,
  strasse:()=>card('Kriminalität','<p class="note" style="margin-bottom:6px">Wer erwischt wird, landet vor Gericht.</p>'+actRows(['klau','tasche','einbruch','hack','bankraub','race']))+card('Polizei & Gericht',special('record')),
  bank:viewBank,
  boerse:viewBoerse,
  wohnen:viewWohnen,
  garage:()=>card('Deine Fahrzeuge',p.cars.length?p.cars.map(c=>row(CARS[c].n,'Unterhalt '+eur(CARS[c].c)+' pro Jahr',btn('sellcar',c,'Verkaufen','g'))).join(''):'<p class="note">Noch kein Auto.</p>')+card('Autohaus',special('cars'))+card('Hafen',actRows(['race'])),
  shop:()=>card('Einkaufszentrum',special('shop'))+card('',actRows(['klau'])),
  erfolge:()=>'<div class="seg full">'+[['erfolge','Erfolge'],['samml','Sammlung'+(p.newUL?' ('+p.newUL+')':'')]].map(([k,l])=>'<button data-a="etab" data-g="'+k+'" aria-pressed="'+(eTab===k)+'">'+l+'</button>').join('')+'</div>'+(eTab==='samml'?viewSamml():card('Erfolge','<div class="ach">'+Object.keys(ACH).map(k=>'<span class="'+(p.ach[k]?'on':'')+'">'+ACH[k]+'</span>').join('')+'</div><p class="note" style="margin-top:8px">In diesem Leben: '+Object.keys(p.ach).length+' · In allen Leben: '+Object.keys(globalAch).length+' von '+Object.keys(ACH).length+'.</p>'))};
  const A=APP[id];
  return '<div class="appbar"><button class="back" data-a="goto" data-g="home" aria-label="Zurück zum Handy"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><span class="ic" style="background:'+(A[4]||hex(A[2]))+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+A[3]+'</svg></span><h2>'+A[1]+'</h2><span class="chip" style="margin-left:auto">'+akt(p.act)+'</span></div>'+
    (p.prison&&!PRISON_APPS.includes(id)?card('','<p class="note">Im Gefängnis nicht verfügbar.</p>'):((OPT[id]&&(!appInst(id)||appLock(id)))||(!OPT[id]&&!appVisible(id))?appGate(id):tipCard(id)+V[id]()));
}
function holdButton(b,fn){const MS=650;let t=null,st=0;
  const fill=b.querySelector('.fill');
  const reset=()=>{clearTimeout(t);t=null;fill.style.transition='width .15s';fill.style.width='0%';b.classList.remove('holding')};
  b.addEventListener('pointerdown',e=>{if(e.button>0||document.getElementById('modal').classList.contains('on'))return;st=Date.now();b.classList.add('holding');
    fill.style.transition='width '+MS+'ms linear';fill.style.width='100%';
    t=setTimeout(()=>{t=null;reset();try{navigator.vibrate&&navigator.vibrate(30)}catch(x){}fn()},MS)});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{if(t){const short=Date.now()-st<MS;reset();if(short&&ev==='pointerup')toast('Halte den Knopf kurz gedrückt, um ein Jahr älter zu werden.')}}));
  b.addEventListener('contextmenu',e=>e.preventDefault());
  b.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();fn()}});
  b.addEventListener('click',e=>e.preventDefault());
}
function buildShell(){
  document.getElementById('app').innerHTML='<header class="top" id="hd"></header><main id="view"></main><div id="ntf" class="ntf" role="status"></div><div id="city"><div id="cv"></div><div id="cev" class="cev"></div><div class="ctl"><div class="cname" id="cname"></div><div class="seg" id="cseg"></div></div>'+
    '<div class="rot"><button aria-label="Drehen" id="rotL"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v4h4"/></svg></button><button aria-label="Zum Zuhause" id="ctr"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg></button></div></div>'+
    '<main id="view2"></main><div class="age"><button class="btn o big hold" id="up" aria-label="1 Jahr älter werden, gedrückt halten"><span class="fill" aria-hidden="true"></span><span class="lbl2">+ 1 Jahr älter werden<small>gedrückt halten</small></span></button></div>';
  holdButton(document.getElementById('up'),ageUp);
  document.getElementById('rotL').onclick=()=>{if(G)G.yaw+=Math.PI/4};
  document.getElementById('ctr').onclick=()=>{if(G&&G.L){const c=G.L.cells.find(x=>x.place==='home');G.goal=new THREE.Vector3(c.x,0,c.z);G.dist=80}};
  shell=true;
}
function render(){if(p&&p.sm)ensureSm();
  const app=document.getElementById('app');
  if(!p){shell=false;if(G)G.run=false;renderStart();return}
  if(!p.alive){shell=false;if(G)G.run=false;
    app.innerHTML=viewDeath();
    document.getElementById('again').onclick=()=>{p=null;try{localStorage.removeItem(KEY)}catch(e){}render()};return}
  if(!APP[tab])tab='home';ensureStocks();ensureNew();
  if(!shell)buildShell();
  const map=tab==='stadt'&&cityMode!=='list'&&initThree();
  if(tab==='stadt'&&!map)cityMode='list';
  document.getElementById('hd').innerHTML='<div class="ava">'+avatarSvg(p.age,58)+'<span class="agebadge">'+p.age+'</span></div><div><div class="n">'+esc(p.first+' '+p.last)+'</div><div class="s">'+p.age+' Jahre · '+esc(status())+(curTitle()?' · '+esc(curTitle()):'')+(p.sb?' · Sandbox':'')+'</div></div><div class="m"><small>Kontostand</small><b>'+eur(p.money)+'</b></div>';
  document.getElementById('cname').innerHTML=esc(cityName(p.seed))+'<small>Ziehen zum Bewegen, zwei Finger zum Zoomen</small>';
  document.getElementById('cseg').innerHTML=['3d','2d','list'].map(m=>'<button data-a="mode" data-g="'+m+'" aria-pressed="'+(cityMode===m)+'">'+(m==='list'?'Liste':m.toUpperCase())+'</button>').join('');
  const html=tab==='home'?viewHome():viewApp(tab);
  if(map){const i=html.indexOf('</div>')+6;document.getElementById('view').innerHTML=html.slice(0,i);document.getElementById('view2').innerHTML=html.slice(i)}
  else{document.getElementById('view').innerHTML=html;document.getElementById('view2').innerHTML=''}
  document.getElementById('view2').style.display=map?'flex':'none';document.getElementById('view').style.flex=map?'none':'1';
  showCity(!!map);highlight();{const bd=document.body;if(bd&&bd.classList){if(tab==='home'||tab==='stadt')bd.classList.remove('noage');else bd.classList.add('noage')}}cevMarkers();if(tab!=='home'&&editApps){editApps=false;swapSel=null}setTimeout(maybeRemind,0);{const up=document.getElementById('up');if(up&&up.classList){if(p.act<=0)up.classList.add('ready');else up.classList.remove('ready')}}
}
function renderStart(){
  const app=document.getElementById('app'),old=load();
  if(form.act==null)form.act=6;if(form.clock==null)form.clock=true;if(!form.wealth)form.wealth='normal';if(!form.ev)form.ev='normal';if(form.big==null)form.big=true;if(form.riv==null)form.riv=O.rival;if(!form.mini)form.mini=O.mini;if(form.tut==null)form.tut=!O.tutDone;
  if(form.fn==null){form.fn=pick(form.g==='m'?MN:FN);form.ln=pick(LN)}
  const ages=[[0,'Baby','ab Geburt',1],[6,'Kind','ab 6 Jahren',8],[13,'Teenager','ab 13 Jahren',15],[18,'Erwachsen','ab 18 Jahren',25]];
  const chips=(key,list)=>'<div class="schips">'+list.map(([v,l,s])=>'<button class="sch" data-sk="'+key+'" data-sv="'+v+'" aria-pressed="'+(String(form[key])===String(v))+'"><b>'+l+'</b>'+(s?'<small>'+s+'</small>':'')+'</button>').join('')+'</div>';
  const tg2=(key,l,s)=>'<button class="tg" data-st="'+key+'" aria-pressed="'+!!form[key]+'"><span><b>'+l+'</b><small>'+s+'</small></span><i></i></button>';
  const P={g:form.g==='m'?'m':'w',st:{gl:88},skin:form.skin==null?(form.skin=R(0,4)):form.skin,hair:form.hair==null?(form.hair=R(0,5)):form.hair,beard:false,bald:false,glasses:false};
  const ag=(ages.find(x=>x[0]===form.a)||ages[2])[3];
  const actHint=+form.act===0?'Unbegrenzt: Nur die Tagesuhr begrenzt dich.':+form.act<=4?'Herausfordernd: Jede Entscheidung zählt.':+form.act>=12?'Entspannt: Du kannst viel ausprobieren.':'Ausgewogen, wie im Original.';
  const dice='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.2"/><circle cx="15" cy="15" r="1.2"/><circle cx="15" cy="9" r="1.2"/><circle cx="9" cy="15" r="1.2"/></svg>';
  const has=!!(old&&old.alive&&old.st),home=has&&!form.neu;
  const contC=has?'<section class="card contc"><div class="cc1"><span class="cav2">'+avatarSvg(old.age,76,old)+'</span><div class="cc2"><small>Dein Spielstand</small><b>'+esc(old.first+' '+old.last)+'</b><span>'+old.age+' Jahre'+(old.job?' · '+esc(old.job.t):'')+'</span><span>'+eur(old.money)+(old.gen>1?' · Generation '+old.gen:'')+'</span></div></div><button class="btn o big" id="cont">Weiterspielen</button></section>':'';
  app.innerHTML='<div class="start s2">'+'<section class="hero"><div class="hav">'+avatarSvg(ag,112,P)+'</div><div class="ht"><small>LEBENSSIMULATOR</small><h1>Lebenslauf</h1><p>Ein ganzes Leben in einer neuen Stadt. Jede Entscheidung zählt.</p></div><div class="hchips"><span>Karriere</span><span>Liebe</span><span>Familie</span><span>Börse</span><span>Klick</span><span>Generationen</span></div></section>'+
    
    (home?contC+'<button class="btn g newl" id="neu"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Neues Leben beginnen</button>':
    (has?'<button class="backs" id="back"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>Zurück zum Spielstand</button>':'')+'<section class="card sc"><div class="sh"><span class="sn">1</span><h2>Wer bist du?</h2><button class="dice" id="dice" aria-label="Zufälliger Name">'+dice+'</button></div><div class="nm"><label>Vorname<input type="text" id="fn" maxlength="20" value="'+esc(form.fn)+'"></label><label>Nachname<input type="text" id="ln" maxlength="20" value="'+esc(form.ln)+'"></label></div>'+
      '<div class="grid3">'+[['w','Weiblich'],['m','Männlich'],['d','Divers']].map(([k,n])=>'<button class="sch" data-gs="'+k+'" aria-pressed="'+(form.g===k)+'"><b>'+n+'</b></button>').join('')+'</div></section>'+
    '<section class="card sc"><div class="sh"><span class="sn">2</span><h2>Wann startest du?</h2></div><div class="ages">'+ages.map(([a,n,s])=>'<button class="sch big2" data-as="'+a+'" aria-pressed="'+(form.a===a)+'"><b>'+n+'</b><small>'+s+'</small></button>').join('')+'</div></section>'+
    '<section class="card sc"><div class="sh"><span class="sn">3</span><h2>Spielablauf</h2></div>'+
      '<div class="sl">Aktionen pro Jahr</div>'+chips('act',[[3,'3'],[4,'4'],[6,'6'],[9,'9'],[12,'12'],[18,'18'],[0,'∞']])+'<p class="note">'+actHint+'</p>'+
      '<div class="tgs">'+tg2('clock','Tagesuhr','Jede Aktion kostet Zeit. Um 3 Uhr nachts ist der Tag vorbei.')+'</div>'+
      '<div class="sl">Zufallsereignisse</div>'+chips('ev',[['oft','Oft'],['normal','Normal'],['selten','Selten'],['aus','Aus']])+
      '<div class="tgs">'+tg2('big','Großereignisse','Seltene Eilmeldungen: Lottogewinn, Quizshow, Hochwasser …')+tg2('riv','Rivale','Eine Person aus der Schulzeit fordert dich heraus')+'</div>'+
      '<div class="sl">Herkunft</div>'+chips('wealth',[['arm','Arm','kein Taschengeld'],['normal','Normal','Durchschnitt'],['reich','Reich','40.000 € mit 18']])+
      '<div class="sl">Minispiele</div>'+chips('mini',[['ask','Fragen'],['play','Immer spielen'],['skip','Überspringen']])+
      '<div class="tgs">'+tg2('sb','Sandbox','1 Million € Startgeld und du stirbst nicht')+tg2('tut','Tutorial und Tipps','Kurze Einführung und Hinweise beim ersten Öffnen jeder App')+'</div>'+
      '<p class="note">Rivale und Minispiele kannst du später in den Einstellungen ändern.</p></section>'+
    '<div class="sgo"><button class="btn o big" id="go">Leben starten</button><button class="btn g" id="rnd">Zufälliges Leben</button></div>'+(has?'<p class="note warnn">Ein neues Leben ersetzt deinen aktuellen Spielstand.</p>':''))+
    '<p class="note" style="text-align:center">Version '+APPVER+' · Spielstand bleibt auf diesem Gerät</p></div>';
  if(home){document.getElementById('neu').onclick=()=>{form.neu=true;renderStart();window.scrollTo(0,0)};const c=document.getElementById('cont');c.onclick=()=>{p=old;tab='home';sel='home';render()};if(!renderStart.shown){renderStart.shown=true;setTimeout(showUpdates,400)}return}
  {const bk=document.getElementById('back');if(bk)bk.onclick=()=>{form.neu=false;renderStart();window.scrollTo(0,0)}}
  const keep=()=>{form.fn=document.getElementById('fn').value;form.ln=document.getElementById('ln').value};
  const re=()=>{keep();renderStart()};
  app.querySelectorAll('[data-gs]').forEach(b=>b.onclick=()=>{form.g=b.dataset.gs;re()});
  app.querySelectorAll('[data-as]').forEach(b=>b.onclick=()=>{form.a=+b.dataset.as;re()});
  app.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>{const v=b.dataset.sv;form[b.dataset.sk]=isNaN(+v)?v:+v;re()});
  app.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{form[b.dataset.st]=!form[b.dataset.st];re()});
  document.getElementById('dice').onclick=()=>{form.fn=pick(form.g==='m'?MN:form.g==='w'?FN:FN.concat(MN));form.ln=pick(LN);form.skin=R(0,4);form.hair=R(0,5);renderStart()};
  const start=(fn,ln,g,a)=>{form.neu=false;O.tut=!!form.tut;O.rival=!!form.riv;O.mini=form.mini;saveO();newLife(fn,ln,g,a,!!form.sb);applyCfg(form);if(form.tut)setTimeout(()=>showTut(0),350);if(p.skin!=null&&form.skin!=null){p.skin=form.skin;p.hair=form.hair;save();render()}};
  document.getElementById('go').onclick=()=>{keep();start((form.fn||'').trim()||'Lena',(form.ln||'').trim()||'Krüger',form.g,form.a)};
  document.getElementById('rnd').onclick=()=>{const g=pick(['w','m']);form.skin=null;start(pick(g==='m'?MN:FN),pick(LN),g,pick([0,6,13,18]))};
  const c=document.getElementById('cont');if(c)c.onclick=()=>{p=old;tab='home';sel='home';render()};
  if(!renderStart.shown){renderStart.shown=true;setTimeout(showUpdates,400)}
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-t]');if(t&&t.closest('#nav')){tab=t.dataset.t;render();window.scrollTo(0,0);return}
  const a=e.target.closest('[data-a]');if(a&&!a.disabled&&a.closest('#app'))act(a.dataset.a,a.dataset.g);
});
document.addEventListener('input',e=>{const t=e.target;if(t&&['coName','firmName','shopName','chName','prodName'].includes(t.id))drafts[t.id]=t.value});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const m=document.getElementById('modal');if(m.classList.contains('on')&&m.querySelectorAll('[data-o]').length===1)m.querySelector('[data-o]').click()}});
render();
}
