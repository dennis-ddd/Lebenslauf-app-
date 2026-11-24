/* ================= Influencer-Karriere: Chat-Moderation, Thumbnail-Baukasten, Deals, Shitstorm, Collabs, Merch, Meilensteine, Agentur, Privatsphäre ================= */
const KB={live:1,risk:1,vid:1};
/* --- Chat moderieren beim Live gehen --- */
function chatGame(cb){if(noDom()||O.mini==='skip')return cb(null);const go=()=>wischRound('Chat moderieren',1,(r,ok)=>cb(ok),'chat');
  if(O.mini==='play')return go();dialog('Du bist live!','Der Chat läuft heiß. Moderierst du selbst? Gute Moderation hält Zuschauer und verhindert Shitstorms.',[['Selbst moderieren',go],['Einfach streamen',()=>cb(null)]])}
{const _dl=doLive;doLive=function(){const sm=p.sm,c=sm&&sm.ch;if(!sm||p.prison||!c||c.sl<=0||!(p.items.includes('handy')||p.items.includes('laptop')))return _dl();
  const F=FMT[chFmt];if((F[5]&&p.age<F[5])||(F[7]&&c.subs<F[7])||(F[6]&&c.once[chFmt]===p.age))return _dl();
  chatGame(ok=>{if(ok!=null){KB.live=.8+ok*.05;KB.risk=ok>=7?.3:ok>=5?.7:1.3;c.com=clamp(c.com+(ok-4),0,100)}
    try{_dl()}finally{KB.live=1;KB.risk=1}if(ok!=null)toast('Chat: '+ok+' von 8 richtig moderiert')})}}
/* --- Thumbnail-Baukasten beim Video --- */
const THB={bild:[['gesicht','Gesicht'],['ergebnis','Ergebnis'],['text','Großer Text']],titel:[['sachlich','Sachlich'],['frage','Mit Frage'],['bait','CLICKBAIT']],farbe:[['knall','Knallig'],['dunkel','Dunkel'],['pastell','Pastell']]};
const THN={bild:'Bild',titel:'Titel',farbe:'Farben'};
const THP={gaming:['gesicht','frage','knall'],vlog:['gesicht','sachlich','pastell'],comedy:['gesicht','frage','knall'],tutorial:['ergebnis','sachlich','dunkel'],style:['ergebnis','frage','pastell'],fit:['ergebnis','sachlich','knall']};
const THC={knall:'linear-gradient(135deg,#FF4D6D,#FFB703)',dunkel:'linear-gradient(135deg,#1B263B,#415A77)',pastell:'linear-gradient(135deg,#BDE0FE,#FFC8DD)'};
function thumbGame(g,cb){const V=VIDT[g],sm=p.sm,P=THP[g]||THP.vlog,t=pick(V.t),K=['bild','titel','farbe'];sm.thl=sm.thl||{};const known=sm.thl[g]||[];
  const hk=known.length?known:[K[R(0,2)]],sel={bild:'gesicht',titel:'sachlich',farbe:'knall'};
  const hint='Deine Zuschauer bei '+V.n+' mögen: '+hk.map(k=>THN[k]+' „'+THB[k].find(x=>x[0]===P[K.indexOf(k)])[1]+'“').join(', ')+'. Den Rest musst du ausprobieren.';
  const d=mgOpen('<h2>Thumbnail bauen</h2><p>'+esc(hint)+'</p><div class="thprev" id="thp"></div>'+K.map(k=>'<div class="throw"><small>'+THN[k]+'</small><div>'+THB[k].map(([v,l])=>'<button class="amt" data-k="'+k+'" data-v="'+v+'">'+l+'</button>').join('')+'</div></div>').join('')+'<button class="btn o big" id="thgo">Hochladen</button>');
  const draw=()=>{const tt=sel.titel==='bait'?t.toUpperCase()+' (KRASS!!)':sel.titel==='frage'?t+'?':t;
    d.querySelector('#thp').innerHTML='<div class="thimg" style="background:'+THC[sel.farbe]+'">'+(sel.bild==='gesicht'?'<span class="thface">'+avatarSvg(p.age,64)+'</span><i class="thwow">!</i>':sel.bild==='ergebnis'?'<span class="thres">✓</span>':'<span class="thtxt">'+esc(t.split(' ').slice(0,2).join(' '))+'</span>')+'</div><b>'+esc(tt)+'</b><small>'+esc(sm.h)+'</small>';
    d.querySelectorAll('[data-k]').forEach(b=>b.setAttribute('aria-pressed',sel[b.dataset.k]===b.dataset.v))};draw();
  d.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{sel[b.dataset.k]=b.dataset.v;draw()});
  d.querySelector('#thgo').onclick=()=>{const hit=K.filter((k,i)=>sel[k]===P[i]);sm.thl[g]=[...new Set(known.concat(hit))];const sc=hit.length,bait=sel.titel==='bait';mgClose();
    cb({m:(.85+.15*sc)*(bait?1.25:1),sc,bait})}}
{const _dv=doVideo;doVideo=function(g){const V=VIDT[g],sm=p.sm;if(sm)sm.lastV=g;
  if(!sm||p.prison||!sm.ch||sm.vl<=0||!V||(V.need&&!V.need())||!(p.items.includes('handy')||p.items.includes('kamera')||p.items.includes('laptop'))||noDom()||O.mini==='skip')return _dv(g);
  thumbGame(g,r=>{KB.vid=r.m;try{_dv(g)}finally{KB.vid=1}if(r.bait){sm.trust=Math.max(10,sm.trust-5)}toast('Thumbnail: '+r.sc+' von 3 Treffern'+(r.bait?' · Clickbait kostet Glaubwürdigkeit':''))})}}
/* --- Werbedeals mit Verhandlung --- */
const DEALB=[['FitFuel','Proteinriegel',0],['Brausebude','Limonade',0],['Pixelhaus Games','ein neues Spiel',0],['NordWind Energie','Ökostrom',0],['Schuhwerk','Sneaker',0],['Glanz Kosmetik','eine Gesichtscreme',0],
  ['MoonPump','eine neue Kryptowährung',1],['SlimTee','einen Abnehmtee',1],['BetBlitz','eine Wett-App',1],['LuxWatch','sehr billige „Luxusuhren“',1]];
function dealTake(B,v){const sm=p.sm;p.money+=v;sm.earn+=v;if(p.yr)p.yr.social=(p.yr.social||0)+v;
  if(B[2]){sm.dodgy=(sm.dodgy||0)+1;sm.trust=Math.max(10,sm.trust-6);valAdd('e',-4);return 'Du postest über '+B[1]+' und kassierst '+eur(v)+'. Ein paar Kommentare sind skeptisch.'}
  sm.trust=Math.min(100,sm.trust+1);return 'Der Post kommt gut an. '+eur(v)+' sind auf deinem Konto.'}
QEV.k_deal=d=>{const B=DEALB[d.i],pay=d.pay;return E('Werbe-Anfrage: '+B[0],B[0]+' bietet dir '+eur(pay)+' für einen Post über '+B[1]+'.'+(B[2]?' Unter ähnlichen Posts anderer Creator gibt es viele wütende Kommentare.':'')+(p.sm&&p.sm.agency?' Deine Agentur hat schon vorverhandelt.':''),()=>!!p.sm,[
  ['Annehmen',()=>dealTake(B,pay)],
  ['Mehr Geld verlangen',()=>{if(ch(.35+(p.sk.charme||0)/250+(p.sm.agency?.25:0))){return 'Sie gehen auf '+eur(Math.round(pay*1.4/10)*10)+' hoch! '+dealTake(B,Math.round(pay*1.4/10)*10)}add('gl',-1);return B[0]+' ist abgesprungen. Zu teuer.'}],
  ['Ablehnen',()=>{if(B[2]){p.sm.trust=Math.min(100,p.sm.trust+3);valAdd('e',3);return 'Gute Entscheidung. Deine Community merkt, dass du nicht alles bewirbst.'}return 'Du lehnst höflich ab.'}]])};
/* --- Shitstorm --- */
const STORMT={post:'Ein alter Post von dir taucht wieder auf. Er ist nicht gut gealtert, und alle teilen ihn.',deal:'Jemand hat recherchiert: Das Produkt aus deinem Werbepost ist eine Abzocke. Die Kommentare explodieren.',live:'Ein aus dem Zusammenhang gerissener Clip aus deinem Stream macht die Runde.'};
QEV.k_storm=d=>E('Shitstorm!',STORMT[d.r]||STORMT.post,()=>!!p.sm,[
  ['Ehrliches Entschuldigungsvideo',()=>{smGain(-p.sm.fol*.03);p.sm.trust=Math.min(100,p.sm.trust+8);valAdd('e',3);addLast(3);return 'Du stehst dazu. Ein paar gehen, die meisten respektieren es.'}],
  ['Aussitzen',()=>{if(ch(.5))return 'Nach zwei Wochen redet keiner mehr darüber. Glück gehabt.';smGain(-p.sm.fol*.1);p.sm.trust=Math.max(10,p.sm.trust-8);addLast(5);return 'Dein Schweigen macht es schlimmer. Du verlierst viele Follower.'}],
  ['Zurückschießen',()=>{valAdd('r',3);if(ch(.3)){smGain(p.sm.fol*.08);p.sm.trust=Math.max(10,p.sm.trust-5);return 'Das Drama bringt Klicks. Mehr Follower, aber nicht gerade Respekt.'}smGain(-p.sm.fol*.15);p.sm.trust=Math.max(10,p.sm.trust-12);addLast(8);add('gl',-6);news('Wirbel um '+p.sm.h,'lokal');return 'Das ging nach hinten los. Sogar die Lokalpresse schreibt darüber.'}],
  ['Social-Media-Pause',()=>{smGain(-p.sm.fol*.05);add('gl',4);addLast(-6);return 'Du legst das Handy für einen Monat weg. Dein Kopf dankt es dir.'}]]);
/* --- Drama mit dem Rivalen --- */
QEV.k_beef=()=>E('Diss-Video',(p.rival?esc(p.rival.n):'Ein anderer Creator')+' hat ein Video über dich gemacht. Titel: „Warum '+esc(p.first)+' total fake ist“.',()=>!!p.sm&&!!p.rival,[
  ['Ignorieren',()=>{p.sm.trust=Math.min(100,p.sm.trust+2);return 'Du reagierst nicht. Nach einer Woche ist es vergessen.'}],
  ['Antwortvideo drehen',()=>{smGain(p.sm.fol*.06);p.sm.trust=Math.max(10,p.sm.trust-4);add('gl',2);return 'Dein Konter geht viral. Drama zieht, auch wenn es nicht gerade erwachsen wirkt.'}],
  ['Zum Versöhnungs-Collab einladen',()=>{if(ch(.5)){smGain(p.sm.fol*.04);p.sm.trust=Math.min(100,p.sm.trust+4);if(p.rival)p.rival.friend=true;return 'Ihr dreht zusammen ein Video. Die Fans feiern es.'}return (p.rival?p.rival.n:'Er')+' lehnt ab. Immerhin hast du es versucht.'}]]);
/* --- Goldener Klick, Agentur, Familie online --- */
QEV.k_award=()=>E('Goldener Klick','Du bist für den „Goldenen Klick“ nominiert, den Preis für die besten Creator des Jahres.',()=>!!p.sm,[
  ['Hingehen',()=>{add('gl',5);if(ch(.4)){smGain(p.sm.fol*.1);mile('Goldener Klick gewonnen','star');news(p.sm.h+' gewinnt den Goldenen Klick','welt');add('gl',8);return 'Dein Name wird aufgerufen! Du gewinnst den Goldenen Klick.'}smGain(p.sm.fol*.02);return 'Diesmal gewinnt jemand anderes, aber der Abend war großartig.'}],
  ['Absagen',()=>'Du bleibst zu Hause. Die Gala läuft ohne dich.']]);
const AGN=['StarLink Talents','Hype Agency','Nordlicht Media','Glow Management'];
QEV.k_agent=()=>E('Agentur-Angebot',pick(AGN)+' will dich unter Vertrag nehmen: 20 % deiner Klick-Einnahmen, dafür bessere Deals und Profi-Verhandlungen.',()=>!!p.sm&&!p.sm.agency,[
  ['Unterschreiben',()=>{p.sm.agency={n:pick(AGN),shady:ch(.15)};return 'Vertrag unterschrieben. Ab jetzt läuft das Business professioneller.'}],
  ['Erst mal ablehnen',()=>{p.sm.agNo=p.age;return 'Du bleibst unabhängig.'}]]);
QEV.k_kidonline=()=>E('„Lösch die Fotos!“','Dein Kind ist sauer: In der Schule zeigen alle deine alten Posts mit ihm herum.',()=>!!p.sm&&p.sm.fam,[
  ['Fotos löschen, Kinder nicht mehr zeigen',()=>{p.sm.fam=0;p.kids.forEach(k=>{if(p.age-k.b>=10)k.rel=Math.min(100,(k.rel||50)+6)});return 'Du löschst die Fotos. Dein Kind ist erleichtert.'}],
  ['Ist doch nicht schlimm',()=>{p.kids.forEach(k=>{if(p.age-k.b>=10)k.rel=Math.max(0,(k.rel||50)-10)});return 'Dein Kind redet zwei Tage nicht mit dir.'}]]);
/* --- Merch-Shop --- */
const MERP={hoodie:['Hoodie',22,45],tasse:['Tasse',4,15],cap:['Cap',7,25],shirt:['T-Shirt',8,25]};
const MERD={logo:'Schlichtes Logo',spruch:'Dein Spruch',meme:'Insider-Meme'};
function merFit(sm,c){const m=sm.mer;if(!m)return 1;const com=c?c.com:50;return m.d==='meme'?(com>=60?1.35:.75):m.d==='logo'?(sm.trust>=70?1.25:.9):1.05}
function merchInc(sm,c){if(!sm.mer)return Math.round((sm.fol*.01+(c?c.subs*.08:0))*(c?(.5+c.com/100):1));return merProg(sm,c)[1]}
function merProg(sm,c){const m=sm.mer,P=MERP[m.p],fans=sm.fol+(c?c.subs*2:0),base=fans*.006*merFit(sm,c)*(c?(.5+c.com/100):1)*(sm.ver?1.2:1);
  const units=Math.round(base*Math.max(.05,Math.exp(-2.2*(m.pr/P[2]-1)))),prof=Math.max(0,Math.round(units*(m.pr-P[1])));return [units,prof]}
/* --- Collabs --- */
const CRN=['@lenaontour','@techtim','@kochkunst.kai','@fitmitfee','@gamergustav','@jule.jokes','@reisereni','@mia.makeup','@buildbjoern','@laura.lacht','@nico.nerdet','@sophiesounds'];
function creators(sm){if(sm.creY!==p.age){sm.creY=p.age;sm.cre=shuffle(CRN.slice()).slice(0,3).map(h=>({h,f:Math.max(500,Math.round(sm.fol*R(40,320)/100)),g:pick(Object.keys(VIDT)),done:0}))}return sm.cre}
/* --- Jahreswechsel --- */
{const _sy=smYear;smYear=function(){let inc=_sy();const sm=p.sm;if(!sm)return inc;try{
  if(sm.agency){if(sm.agency.shady&&ch(.35)){log('Deine Agentur '+sm.agency.n+' ist pleite und mit deinen Einnahmen verschwunden.');addLast(6);add('gl',-8);sm.agency=null;inc=0}else inc=Math.round(inc*.8)}
  if(sm.fol>=100000&&!sm.ver){sm.ver=1;sm.trust=Math.min(100,sm.trust+5);mile('Verifiziert auf Klick','star');log('Klick hat dein Profil verifiziert. Der blaue Haken gehört dir.')}
  if(sm.fam){smGain(sm.fol*.03);if(p.partner&&p.partner.rel!=null)relUp('partner',ch(.5)?-4:1);if((p.kids||[]).some(k=>p.age-k.b>=10&&p.age-k.b<18)&&ch(.3))p.q.push({id:'k_kidonline'})}
  const q=p.q;if(sm.fol>=2000&&ch(sm.agency?.85:.5)){const dodgyOK=sm.agency?ch(.3):true,L=DEALB.map((b,i)=>i).filter(i=>dodgyOK||!DEALB[i][2]),i=pick(L);let pay=Math.round(sm.fol*R(5,14)/1000)*10+100;if(DEALB[i][2])pay*=2.5;if(sm.agency)pay*=1.4;q.push({id:'k_deal',d:{i,pay:Math.round(pay/10)*10}})}
  if(sm.fol>=2000){const dg=sm.dodgy||0,pr=.05+dg*.12+(sm.trust<40?.08:0);if(ch(pr)){const r=dg?'deal':pick(['post','live']);if(dg)sm.dodgy--;q.push({id:'k_storm',d:{r}})}}
  if(p.rival&&sm.fol>=1000&&ch(.12))q.push({id:'k_beef'});
  if(sm.fol>=50000&&ch(.35))q.push({id:'k_award'});
  if(sm.fol>=25000&&!sm.agency&&(!sm.agNo||p.age-sm.agNo>=5)&&ch(.4))q.push({id:'k_agent'});
  }catch(e){}return inc}}
/* --- Ansicht --- */
{const _vk=viewKlick;viewKlick=function(){let h=_vk();const sm=p.sm;if(!sm)return h;const c=sm.ch,lock=!!p.prison;
  if(sm.ver)h=h.replace('<small>'+esc(sm.h)+'</small>','<small>'+esc(sm.h)+' <span class="kver" title="Verifiziert">✓</span></small>');
  if(smTab==='profil'){
    h+=card('Privatsphäre',row('Familie in Posts zeigen',sm.fam?'An · mehr Reichweite, aber nicht alle finden das gut':'Aus · Partner und Kinder bleiben privat',btn('kfam',null,sm.fam?'Ausschalten':'Einschalten',sm.fam?'g':'o')));
    const goals=[[100000,'Verifiziert-Haken',!!sm.ver],[50000,'Nominierung Goldener Klick',sm.fol>=50000],[25000,'Agentur-Angebote',sm.fol>=25000],[20000,'Meet & Greet',sm.fol>=20000],[2000,'Werbe-Anfragen',sm.fol>=2000]];
    h+=card('Meilensteine',goals.map(g=>row(g[1],kfmt(g[0])+' Follower',g[2]?'<span class="chip up">Erreicht</span>':'<span class="chip">'+clamp(Math.round(sm.fol/g[0]*100),0,99)+' %</span>')).join(''))}
  if(smTab==='biz'){
    if(sm.fol>=500){const C=creators(sm);h+='<h3 class="sec">Collabs</h3>'+card('',C.map((x,i)=>row(x.h,kfmt(x.f)+' Follower · '+VIDT[x.g].n,x.done?'<span class="chip">'+(x.done===1?'Gedreht':'Abgesagt')+'</span>':btn('kcollab',i,'Anfragen','o',lock||p.act<=0))).join('')+'<p class="note">Ein Collab kostet eine Aktion. Größere Creator sagen seltener zu.</p>')}
    if(sm.fol>=20000)h+=card('Meet & Greet',row('Fantreffen in der Stadt','Saalmiete '+eur(px$(1500))+' · 1 Aktion · einmal im Jahr',btn('kmeet',null,sm.meetY===p.age?'Erledigt':'Veranstalten','o',lock||sm.meetY===p.age||p.act<=0||p.money<px$(1500))));
    if(sm.agency)h+=card('Agentur',row(esc(sm.agency.n),'Nimmt 20 % deiner Klick-Einnahmen. Deals +40 %, öfter Anfragen, bessere Verhandlungen.',btn('kagq',null,'Kündigen','g')));
    if(sm.studio.merch){if(!sm.mer)sm.mer={p:'hoodie',d:'logo',pr:45};const m=sm.mer,P=MERP[m.p],[u,pf]=merProg(sm,c);
      h+='<section class="card merch"><h2 class="h">Merch-Shop</h2><div class="mt">Produkt</div><div class="amts">'+Object.keys(MERP).map(k=>'<button class="amt" data-a="kmerp" data-g="'+k+'" aria-pressed="'+(m.p===k)+'">'+MERP[k][0]+'</button>').join('')+'</div>'+
        '<div class="mt">Design</div><div class="amts">'+Object.keys(MERD).map(k=>'<button class="amt" data-a="kmerd" data-g="'+k+'" aria-pressed="'+(m.d===k)+'">'+MERD[k]+'</button>').join('')+'</div>'+
        '<div class="mt">Preis</div><div class="merpr">'+btn('kmerx','-5','Billiger','g',m.pr<=P[1]+1)+'<b>'+eur(m.pr)+'</b>'+btn('kmerx','5','Teurer','g',m.pr>=P[2]*3)+'</div>'+
        '<div class="mrow"><span>Herstellung pro Stück</span><b>'+eur(P[1])+'</b></div><div class="mrow"><span>Prognose verkauft</span><b>'+kfmt(u)+' Stück</b></div><div class="mrow"><span>Gewinn pro Jahr</span><b class="up">'+eur(pf)+'</b></div>'+
        '<p class="note">Zu teuer, und keiner kauft. Zu billig, und du verdienst nichts. Memes laufen bei einer begeisterten Community, ein schlichtes Logo bei hoher Glaubwürdigkeit.</p></section>'}}
  return h}}
function act23(id,arg){const sm=p.sm;if(!sm)return 0;switch(id){
  case 'kfam':sm.fam=sm.fam?0:1;if(sm.fam&&p.partner&&ch(.4)){relUp('partner',-3);toast((p.partner.name||'Dein Schatz')+' findet das nicht so gut.')}render();return 1;
  case 'kcollab':{const x=creators(sm)[+arg];if(!x||x.done||p.prison||!useAct())return 1;const pr=clamp(.75-(x.f/(sm.fol+1)-1)*.2+(sm.trust-60)/200+(sm.ver?.1:0),.08,.92);
    if(ch(pr)){x.done=1;const fit=sm.ch&&VIDT[x.g]&&x.g===(sm.lastV||'')?1.3:1,gain=Math.round(x.f*R(3,8)/100*fit);smGain(gain);if(sm.ch){sm.ch.subs+=Math.round(gain*.3);sm.subs=sm.ch.subs}add('gl',4);sm.active=true;done('Collab mit '+x.h+'! Das Video läuft super: +'+kfmt(gain)+' Follower.')}
    else{x.done=2;done(x.h+' hat abgesagt: „Gerade keine Zeit, sorry!“')}return 1}
  case 'kmeet':{if(sm.fol<20000||sm.meetY===p.age||p.prison)return 1;const c=px$(1500);if(p.money<c||!useAct())return 1;p.money-=c;sm.meetY=p.age;
    if(ch(.1)){sm.trust=Math.max(10,sm.trust-3);add('gl',-2);done('Viel zu viele Leute! Die Polizei muss den Platz räumen. Peinlich.')}else{smGain(sm.fol*.02);if(sm.ch)sm.ch.com=Math.min(100,sm.ch.com+8);add('gl',7);done('Hunderte Fans, Selfies, Umarmungen. Ein Tag, den du nicht vergisst.')}return 1}
  case 'kagq':sm.agency=null;sm.agNo=p.age;done('Agenturvertrag gekündigt.');return 1;
  case 'kmerp':if(MERP[arg]&&sm.mer){sm.mer.p=arg;sm.mer.pr=MERP[arg][2];render()}return 1;
  case 'kmerd':if(MERD[arg]&&sm.mer){sm.mer.d=arg;render()}return 1;
  case 'kmerx':if(sm.mer){const P=MERP[sm.mer.p];sm.mer.pr=clamp(sm.mer.pr+(+arg),P[1]+1,P[2]*3);render()}return 1;
  }return 0}
{const f=act;act=function(id,arg){if(act23(id,arg))return;return f(id,arg)}}
