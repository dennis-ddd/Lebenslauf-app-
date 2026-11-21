/* ================= Wohnen ================= */
Object.assign(HOMES.eltern,{ar:'Dein altes Kinderzimmer',sl:2});Object.assign(HOMES.wohnheim,{ar:'Am Campus',sl:2});Object.assign(HOMES.wg,{ar:'In der Südstadt',sl:3});
Object.assign(HOMES.einzimmer,{ar:'In der Altstadt',sl:4});Object.assign(HOMES.dreizimmer,{ar:'Am Stadtpark',sl:6});Object.assign(HOMES.loft,{ar:'Am Hafen',sl:7});
Object.assign(HOMES.penthouse,{ar:'Über den Dächern',sl:9});Object.assign(HOMES.hausboot,{ar:'Im alten Hafenbecken',sl:5});Object.assign(HOMES.reihenhaus,{ar:'In der Vorstadt',sl:8});Object.assign(HOMES.villa,{ar:'Im Villenviertel',sl:12});
const STAFF={
haus:{n:'Hausmeister/in',pay:38000,ic:'<path d="M14 7l3-3 3 3-3 3M15 8l-9 9-2 3 3-2 9-9"/>',d:'Hält deine Immobilien in Schuss: Reparaturen und Mieterärger kosten nur noch die Hälfte.',need:()=>p.owned.length>0||(p.props&&p.props.length>0),nn:'braucht eine eigene Immobilie'},
putz:{n:'Putzkraft',pay:18000,ic:'<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',d:'Ein Zuhause, in dem immer alles glänzt. Jedes Jahr +3 Glück.'},
garten:{n:'Gärtner/in',pay:26000,ic:'<path d="M12 22v-8M12 14c-4 0-7-3-7-8 5 0 7 3 7 8zM12 14c4 0 7-3 7-8-5 0-7 3-7 8z"/>',d:'Rasen wie auf dem Golfplatz. +2 Glück und +1 Aussehen pro Jahr.',need:()=>['reihenhaus','villa'].includes(p.home),nn:'braucht ein Haus mit Garten'},
koch:{n:'Koch/Köchin',pay:45000,ic:'<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 3-3 6s1 4 3 4v8"/>',d:'Jeden Tag frisch gekocht. Zählt wie mediterrane Ernährung, dazu +2 Glück.'},
fahrer:{n:'Chauffeur',pay:55000,ic:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M3 12h7M14 12h7M12 14v7"/>',d:'Fährt vor, wartet, findet immer einen Parkplatz. Du hast 2 Aktionen mehr pro Jahr.',need:()=>p.cars.length>0,nn:'braucht ein eigenes Auto'},
butler:{n:'Butler',pay:80000,ic:'<path d="M12 4a6 6 0 0 1 6 6v5l2 3H4l2-3v-5a6 6 0 0 1 6-6zM10 21h4"/>',d:'Empfängt Gäste und kennt jeden Wunsch. +4 Glück und +2 Charme pro Jahr.'},
guard:{n:'Bodyguard',pay:110000,ic:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',d:'Steht vor der Tür. Schützt vor Überfällen und halbiert das Razzia-Risiko deiner Geschäfte.'}};
const SURN=['Novak','Okafor','Costa','Weber','Keller','Santos','Yilmaz','Rossi','Kowalski','Nguyen','Schulte','Haas'];
const applicant=k=>{const r=rng(p.age*31+[...k].reduce((t,c,i)=>t+c.charCodeAt(0)*(i+7)*13,0)+(p.seed%1000));return pick2(r,FN.concat(MN))+' '+pick2(r,SURN)};
function pick2(r,a){return a[Math.floor(r()*a.length)]}
const FURN={bett:['Bett',1,'<path d="M3 18v-6h18v6M3 12V7h7v5M3 18v2M21 18v2"/>'],sofa:['Sofa',1,'<path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M3 11h18v6H3zM5 17v2M19 17v2"/>'],
kueche:['Küche',3,'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M8 6h.01M12 6h.01"/>'],tv:['Fernseher',.8,'<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/>'],
desk:['Schreibtisch',.6,'<path d="M3 8h18M5 8v12M19 8v12M14 8v6h5"/>'],bad:['Bad',2.5,'<path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM6 12V5a2 2 0 0 1 4 0"/>'],
deko:['Pflanzen & Deko',.4,'<path d="M12 21v-7M12 14c-4 0-6-3-6-7 4 0 6 3 6 7zM12 14c4 0 6-3 6-7-4 0-6 3-6 7zM8 21h8"/>'],kunst:['Kunst',2,'<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 16l5-5 4 4 3-3 4 4"/>'],
kamin:['Kamin',3,'<path d="M4 21V9h16v12M2 9h20M9 21v-5a3 3 0 0 1 6 0v5"/>'],pool:['Pool',10,'<path d="M3 17c2 0 2-1.5 4.5-1.5S9.5 17 12 17s2.5-1.5 4.5-1.5S19 17 21 17M7 14V5a2 2 0 0 1 4 0M13 14V5a2 2 0 0 1 4 0M7 9h6"/>']};
const TIERS=[['Einfach',1,500],['Gut',2,3000],['Luxus',4,18000]];
const furnOk=k=>k==='pool'?['reihenhaus','villa'].includes(p.home):k==='kamin'?['reihenhaus','villa','loft','penthouse'].includes(p.home):true;
function activeFurn(){return Object.keys(p.furn).filter(furnOk).slice(0,HOMES[p.home].sl)}
function comfort(){return HOMES[p.home].gl+activeFurn().reduce((s,k)=>s+TIERS[p.furn[k]][1],0)}
function roomSvg(){const af=activeFurn(),t=k=>p.furn[k],gold=k=>t(k)===2?'#C9A227':'#7A5A3A',H=HOMES[p.home];
  const wall=['eltern','wohnheim','wg'].includes(p.home)?'#E8E1D5':['villa','penthouse'].includes(p.home)?'#EDE6F5':'#DDE6F2';
  let s='<svg viewBox="0 0 360 220" class="room" role="img" aria-label="Dein Zuhause von innen"><rect width="360" height="150" fill="'+wall+'"/><rect y="150" width="360" height="70" fill="#C9A47A"/><path d="M0 150h360" stroke="#A9845A" stroke-width="3"/>'+
    '<rect x="140" y="22" width="80" height="62" rx="6" fill="#BFE0F7" stroke="#fff" stroke-width="5"/><path d="M180 22v62M140 53h80" stroke="#fff" stroke-width="3"/>';
  if(af.includes('kunst'))s+='<rect x="40" y="30" width="56" height="42" fill="#fff" stroke="'+gold('kunst')+'" stroke-width="5"/><path d="M44 66l14-16 12 12 8-8 14 12" fill="none" stroke="#E5527A" stroke-width="3"/>';
  if(af.includes('tv'))s+='<rect x="250" y="70" width="80" height="48" rx="4" fill="#1B1F2A"/><rect x="254" y="74" width="72" height="40" fill="'+(t('tv')?'#3B6FD8':'#2A3458')+'"/><rect x="284" y="118" width="12" height="10" fill="#1B1F2A"/>';
  if(af.includes('kamin'))s+='<rect x="236" y="96" width="96" height="56" fill="#9A8C7E"/><rect x="258" y="112" width="52" height="40" rx="20" fill="#2A1A10"/><path d="M276 150c-4-10 6-12 4-22 8 6 10 14 6 22" fill="#F28C28"/>';
  if(af.includes('bett'))s+='<rect x="18" y="128" width="110" height="34" rx="6" fill="'+(t('bett')===2?'#8E63D6':'#5B7CE6')+'"/><rect x="18" y="110" width="26" height="52" rx="5" fill="'+gold('bett')+'"/><rect x="48" y="120" width="30" height="12" rx="5" fill="#fff"/>';
  if(af.includes('sofa'))s+='<rect x="140" y="132" width="96" height="30" rx="10" fill="'+(t('sofa')===2?'#C2408C':'#2FA88F')+'"/><rect x="146" y="116" width="84" height="22" rx="10" fill="'+(t('sofa')===2?'#A8306F':'#24917A')+'"/>';
  if(af.includes('desk'))s+='<rect x="250" y="138" width="80" height="8" fill="'+gold('desk')+'"/><rect x="256" y="146" width="6" height="26" fill="'+gold('desk')+'"/><rect x="318" y="146" width="6" height="26" fill="'+gold('desk')+'"/><rect x="276" y="118" width="30" height="20" rx="2" fill="#1B1F2A"/>';
  if(af.includes('deko'))s+='<rect x="108" y="170" width="22" height="22" rx="4" fill="#B5651D"/><circle cx="119" cy="158" r="16" fill="#3BB273"/><circle cx="110" cy="150" r="9" fill="#2F8F4E"/>';
  if(af.includes('kueche'))s+='<rect x="6" y="60" width="26" height="50" fill="'+gold('kueche')+'"/><rect x="10" y="66" width="18" height="16" fill="#fff" opacity=".5"/>';
  if(af.includes('bad'))s+='<ellipse cx="200" cy="198" rx="44" ry="12" fill="#fff" stroke="#9FD0F5" stroke-width="3"/>';
  if(af.includes('pool'))s+='<rect x="250" y="180" width="104" height="34" rx="10" fill="#5BC0EB" stroke="#fff" stroke-width="3"/><path d="M258 196q8-5 16 0t16 0 16 0 16 0 16 0" fill="none" stroke="#fff" stroke-width="2"/>';
  s+='<text x="12" y="212" font-size="13" font-weight="800" fill="#5A4030" font-family="Nunito,sans-serif">'+esc(H.n)+'</text></svg>';return s}
function homeYear(){const out={rent:0,repair:0,staff:0};
  p.owned.forEach(k=>{if(k===p.home)return;const H=HOMES[k];if(p.rented[k]){const r=px$(H.buy*.045);out.rent+=r;if(ch(.1)){const rp=Math.round(px$(H.buy*.03)*(p.staff.haus?.5:1));out.repair+=rp;log('Ärger mit den Mietern in deinem '+H.n+': Reparatur '+eur(rp)+'.')}}});
  Object.keys(p.staff).forEach(k=>{const S=STAFF[k];if(S.need&&!S.need()){log(S.n+' '+p.staff[k]+' hat gekündigt, weil die Voraussetzung fehlt.');delete p.staff[k];return}out.staff+=px$(S.pay)});
  p.money+=out.rent-out.repair-out.staff;
  if(p.staff.putz)add('gl',3);if(p.staff.garten){add('gl',2);add('au',1)}if(p.staff.koch)add('gl',2);if(p.staff.butler){add('gl',4);p.sk.charme=Math.min(100,p.sk.charme+2)}
  add('gl',Math.min(8,Math.round(comfort()/4)));
  return out;
}
function viewWohnen(){ensureEcon();const H=HOMES[p.home],sl=H.sl,af=activeFurn(),lock=!!p.prison;
  let h=wTab==='immo'?'':'<section class="card homecard"><div class="fh"><span class="fic sm" style="background:linear-gradient(135deg,#FFB35C,#F08A24)"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg></span><div><div class="lbl">DEIN ZUHAUSE</div><b>'+H.n+'</b><small>'+H.ar+'</small></div></div>'+
    '<div class="tags"><span class="tag g">Komfort +'+comfort()+'</span><span class="tag">'+af.length+' von '+sl+' Plätzen eingerichtet</span>'+(p.age>=18&&H.c?'<span class="tag w">'+eur(px$(H.c))+(H.buy?' Unterhalt':' Miete')+' im Jahr</span>':'')+'</div>'+
    '<button class="btn o big" data-a="enter">'+(roomView?'Raum schließen':'Eintreten')+'</button>'+(roomView?roomSvg():'')+'</section>';
  h+='<div class="seg full wt">'+[['home','Einrichten'],['umzug','Umziehen'],['immo','Immobilien'],['personal','Personal']].map(([k,l])=>'<button data-a="wtab" data-g="'+k+'" aria-pressed="'+(wTab===k)+'">'+l+'</button>').join('')+'</div>';
  if(wTab==='home'){
    h+='<p class="note">Jedes Möbelstück bringt Komfort, und Komfort bringt jedes Jahr Glück. Dein Zuhause hat '+sl+' Plätze. Pool und Kamin gehen nur in passenden Häusern.</p>'+
      Object.keys(FURN).map(k=>{const F=FURN[k],cur=p.furn[k],ok=furnOk(k),act=af.includes(k);
        return '<section class="card furn"><div class="fh"><span class="fic sm'+(act?'':' off')+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+F[2]+'</svg></span><div><b>'+F[0]+'</b><small>'+(cur!=null?TIERS[cur][0]+(act?' · aufgestellt':' · kein Platz'):ok?'noch nicht vorhanden':'passt nicht in dieses Zuhause')+'</small></div></div><div class="tiers">'+
          TIERS.map((T,i)=>{const c=px$(T[2]*F[1]);return '<button class="tier'+(cur===i?' on':'')+'" data-a="furn" data-g="'+k+':'+i+'"'+(cur!=null&&cur>=i||!ok||p.money<c||lock?' disabled':'')+'><b>'+T[0]+'</b><small>+'+T[1]+' Komfort</small><span>'+(cur!=null&&cur>=i?'vorhanden':eur(c))+'</span></button>'}).join('')+'</div></section>'}).join('');
  }
  if(wTab==='immo')h+=viewImmo();
  if(wTab==='umzug'){const keys=Object.keys(HOMES).filter(k=>k!=='eigen');
    h+=keys.map(k=>{const o=HOMES[k],own=p.owned.includes(k),here=p.home===k;
      const price=o.buy?eur(px$(o.buy)):(o.c?eur(px$(o.c))+' im Jahr':(p.age>=18?'1.200 € Kostgeld':'kostenlos'));
      return '<section class="card"><div class="fh"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg></span><div><b>'+o.n+'</b><small>'+o.ar+' · '+o.sl+' Plätze · Komfort '+o.gl+'</small></div></div>'+
        (own&&!here?'<div class="tags"><span class="tag g">Gehört dir</span>'+(p.rented[k]?'<span class="tag g">vermietet: +'+eur(px$(o.buy*.045))+' im Jahr</span>':'')+'</div>':'')+
        '<div class="fb"><b>'+(here?'Hier wohnst du':price)+'</b><span class="btns" style="margin:0">'+(here?'':
          (own?btn('home',k,'Einziehen','',lock)+btn('rentout',k,p.rented[k]?'Nicht vermieten':'Vermieten','g',lock)+btn('sellhome',k,'Verkaufen','g'):
            btn('home',k,o.buy?'Kaufen':'Mieten','o',p.age<o.min||lock||(o.buy&&p.money<px$(o.buy)))))+'</span></div></section>'}).join('');
    if(wTab==='umzug')h+='<p class="note">Gekaufte Immobilien, in denen du nicht wohnst, kannst du vermieten: 4,5 % des Kaufpreises im Jahr, manchmal mit Reparaturen.</p>';
  }
  if(wTab==='personal'){
    h+='<p class="note">Leute, die dir den Rücken freihalten. Jede Person kostet einen Jahreslohn und bringt etwas, das du im Alltag merkst.</p>'+Object.keys(STAFF).map(k=>{const S=STAFF[k],hired=p.staff[k],ok=!S.need||S.need();
      return '<section class="card"><div class="fh"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+S.ic+'</svg></span><div style="flex:1"><b>'+S.n+'</b><small>'+(hired?'Arbeitet für dich: '+esc(hired):'Es bewirbt sich '+applicant(k))+'</small></div><b class="num">'+eur(px$(S.pay))+'</b></div>'+
        '<p class="note" style="margin:8px 0">'+S.d+(ok?'':' <b>('+S.nn+')</b>')+'</p>'+(hired?btn('staff',k,'Entlassen','g'):btn('staff',k,'Einstellen','o',!ok||p.age<18||lock))+'</section>'}).join('');
  }
  return h;
}

