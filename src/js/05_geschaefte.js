/* ---------- Geschäfte ---------- */
const CO_FEES=[['Notar und Gesellschaftsvertrag',2400],['Eintrag ins Handelsregister',1300]],CO_COST=3700,HOLD_COST=25000,SHOP_COST=2500,BANK_COST=500000,MIDDLE_CAP=20000;
const FRONTS=[
{id:'kiosk',n:'Kiosk an der Ecke',d:'Zeitungen, Lotto, Kaffee. Und ein Hinterzimmer.',cost:45000,profit:5500,wash:22000,raid:2,ic:'<path d="M4 10h16l-1-5H5zM5 10v9h14v-9M9 19v-5h6v5"/>'},
{id:'wasch',n:'Waschsalon Sauberfix',d:'Der Klassiker, wenn Geld sauber werden soll.',cost:95000,profit:9000,wash:75000,raid:4,ic:'<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6h.01M11 6h.01"/>'},
{id:'pizza',n:'Pizzeria Bella Notte',d:'Gute Pizza, viele Barzahler.',cost:140000,profit:16000,wash:60000,raid:3,ic:'<path d="M12 3l9 16H3z"/><circle cx="11" cy="13" r="1"/><circle cx="14" cy="16" r="1"/>'},
{id:'shisha',n:'Shisha-Lounge Wolke 7',d:'Rauch, Musik, viel Bargeld.',cost:175000,profit:19000,wash:100000,raid:8,ic:'<path d="M7 18a5 5 0 0 1 0-10 6 6 0 0 1 11 2 4 4 0 0 1 0 8z"/>'},
{id:'werkstatt',n:'Autowerkstatt Hafenblick',d:'Autos rein, andere Autos raus. Mehr Sieg-Chance bei Straßenrennen.',cost:260000,profit:26000,wash:140000,raid:6,ic:'<path d="M14 7l3-3 3 3-3 3M15 8l-9 9-2 3 3-2 9-9"/>'},
{id:'club',n:'Nachtclub Neonlicht',d:'Die ganze Nacht Kasse, die ganze Nacht Risiko.',cost:480000,profit:52000,wash:300000,raid:10,ic:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'}];
const FR=Object.fromEntries(FRONTS.map(f=>[f.id,f]));
const FIRMS=[
{id:'kaffee',n:'Kaffeerösterei',cost:22000,g:.08,r:.12,ic:'<path d="M5 9h11v5a5 5 0 0 1-10 0z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2M8 3v3M11 3v3"/>'},
{id:'mode',n:'Modelabel',cost:34000,g:.10,r:.22,ic:'<path d="M8 3l4 2 4-2 5 4-3 3-2-1v12H8V9l-2 1-3-3z"/>'},
{id:'liefer',n:'Lieferdienst-App',cost:56000,g:.13,r:.32,ic:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'},
{id:'games',n:'Spielestudio',cost:90000,g:.15,r:.42,ic:'<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M15 12h.01M17 14h.01"/>'},
{id:'solar',n:'Solarfirma',cost:168000,g:.12,r:.18,ic:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>'},
{id:'tech',n:'Tech-Startup',cost:560000,g:.2,r:.55,hold:1,ic:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>'}];
const FI=Object.fromEntries(FIRMS.map(f=>[f.id,f]));
const SHOPCAT={mode:['Mode',.38,'<path d="M8 3l4 2 4-2 5 4-3 3-2-1v12H8V9l-2 1-3-3z"/>'],technik:['Technik und Gadgets',.22,'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>'],
kosmetik:['Kosmetik',.45,'<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>'],fitness:['Fitness und Ernährung',.35,'<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>'],
wohnen:['Wohnen und Deko',.30,'<path d="M8 3h8l3 8H5zM12 11v9M8 21h8"/>'],hand:['Handgemacht',.55,'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 7.5L20 19M8.5 16.5L20 5"/>']};
const SVC={tech:{n:'Technik und Website',st:'in',min:60,pro:4000},mkt:{n:'Marketing',st:'au',min:55,pro:6000},foto:{n:'Produktfotos',st:'au',min:50,pro:2500},vers:{n:'Versand',st:'ge',min:40,pro:3500}};
let drafts={},shopCat='mode',cheatTaps=0,cheatT=0;
function ensureBiz(){if(!p.biz)p.biz={co:null,hold:false,fronts:[],firm:null,shop:null,bank:null};if(p.dirty==null)p.dirty=0;if(!p.casino)p.casino={won:0,lost:0};if(p.yr&&p.yr.casino==null)p.yr.casino=0;regMyStock()}
function regMyStock(){const f=p&&p.biz&&p.biz.firm;
  if(f&&f.ipo&&!STK.my){const F=FI[f.t];const s={id:'my',n:f.name,p:10,v:Math.min(.5,F.r),d:F.g*.6,div:.02,c:'#F28C28',b:'Deine eigene Firma an der Börse.'};STOCKS.push(s);STK.my=s}
  if(!(f&&f.ipo)&&STK.my){STOCKS.splice(STOCKS.findIndex(s=>s.id==='my'),1);delete STK.my}}
const flvl=k=>(p.biz&&p.biz.lvl&&p.biz.lvl[k])||1;
function washCap(){const B=p.biz;return B?B.fronts.reduce((s,k)=>s+Math.round(FR[k].wash*(1+.4*(flvl(k)-1))),0):0}
function svcQ(k){const s=p.biz.shop.svc[k],S=SVC[k];return s==='pro'?1:clamp(p.st[S.st]/S.min,.3,1.15)}
function shopProfit(){const s=p.biz.shop;if(!s)return 0;const q=Object.keys(SVC).reduce((t,k)=>t+svcQ(k),0)/4,reach=1+(p.sm?Math.log10(p.sm.fol+10)/8:0);
  const rev=14000*s.lvl*q*reach;return Math.round(rev*SHOPCAT[s.cat][1]-Object.keys(SVC).reduce((t,k)=>t+(s.svc[k]==='pro'?SVC[k].pro:0),0))}
function empCost(f){return Math.round(8000+f.val*.008)}
function firmProfit(){const f=p.biz.firm;return f&&!f.ipo?Math.round(Math.max(0,f.val*.12-f.emp*empCost(f))*.5):0}
function bizExpected(){const B=p.biz;if(!B)return 0;return B.fronts.reduce((s,k)=>s+Math.round(FR[k].profit*(1+.5*(flvl(k)-1))*((B.dem&&B.dem[k])?B.dem[k][B.dem[k].length-1]:1)*bizMul(k)),0)+firmProfit()+shopProfit()+(B.bank?Math.round(B.bank.dep*.01*(1+.05*(B.bank.fil||0))):0)}
function bizYear(){ensureBiz();const B=p.biz,inc=[],out=[];let taxable=0;
  // Geschäfte
  let fp=0,fines=0;B.fronts.forEach(k=>{const F=FR[k],dm=B.dem[k]||(B.dem[k]=[1]);const d=clamp(dm[dm.length-1]+(Math.random()-.5)*.3,.6,1.5);dm.push(+d.toFixed(2));if(dm.length>10)dm.shift();fp+=Math.round(F.profit*(1+.5*(flvl(k)-1))*d*((p.props||[]).some(x=>x.use==='lager')?1.1:1)*bizMul(k));
    if(ch(F.raid/100*(p.dirty>0?1.5:.5)*(p.staff&&p.staff.guard?.5:1))){const fine=Math.round(F.cost*.1),lost=Math.round(p.dirty*.5*((p.props||[]).some(x=>x.use==='versteck')?.5:1));fines+=fine;p.dirty-=lost;
      log('Razzia im '+F.n+'! Strafe '+eur(fine)+(lost?', '+eur(lost)+' Schwarzgeld beschlagnahmt':'')+'.');add('gl',-6);
      if(lost>150000&&ch(.4)&&!p.prison){p.prison=2;p.job=null;log('Wegen Geldwäsche musst du für 2 Jahre ins Gefängnis.');ach('knast')}}});
  p.money+=fp-fines;taxable+=fp;inc.push(['Geschäfte',fp]);out.push(['Razzia-Strafen',fines]);
  // Geldwäsche
  let clean=0;const cap=washCap();if(p.dirty>0){let w=Math.min(p.dirty,cap);clean+=Math.round(w*.85);p.dirty-=w;
    if(p.dirty>0){const m=Math.min(p.dirty,MIDDLE_CAP);clean+=Math.round(m*.6);p.dirty-=m}}
  p.money+=clean;inc.push(['Geldwäsche (sauber)',clean]);
  // Firma
  const f=B.firm;if(f&&!f.ipo){const F=FI[f.t];const gr=F.g+(Math.random()*2-1)*F.r+Math.min(f.emp,10)*.02+f.mkt+(p.st.in-50)/800;
    const div=firmProfit();p.money+=div;taxable+=div;inc.push(['Firma: Gewinnausschüttung',div]);
    f.val=Math.round(f.val*(1+gr));f.last=gr;f.mkt=0;f.yrs++;f.hist.push(f.val);if(f.hist.length>40)f.hist.shift();
    if(f.val<F.cost*.2){log(f.name+' ist pleite. Die Firma wird abgewickelt.');add('gl',-12);B.firm=null}
    else if(gr>.3)log(f.name+' wächst stark: +'+Math.round(gr*100)+' %.');}
  // Onlineshop
  if(B.shop){const sp=Math.round(shopProfit()*(.7+Math.random()*.6));p.money+=sp;if(sp>0){taxable+=sp;inc.push(['Onlineshop',sp])}else out.push(['Onlineshop: Verlust',-sp]);B.shop.yrs++}
  // Bank
  if(B.bank){const bk=B.bank;if(ch(.03)){bk.dep=Math.round(bk.dep*.6);log('Bankenkrise! Kunden ziehen Geld von '+bk.name+' ab.')}
    else bk.dep=Math.round(bk.dep*(1.06+Math.random()*.16+.015*(bk.fil||0)));const pr=Math.round(bk.dep*.01*(1+.05*(bk.fil||0)));p.money+=pr;taxable+=pr;inc.push(['Eigene Bank',pr])}
  return {inc,out,taxable};
}
function bizRaw(){ensureBiz();const B=p.biz,minor=p.age<18,lock=!!p.prison;
  let h='<div class="bizsum"><div><b class="up">'+eur(bizExpected())+'</b><small>erwarteter Gewinn pro Jahr</small></div><div><b>'+eur(washCap())+'</b><small>Geldwäsche pro Jahr</small></div></div>';
  if(p.dirty>0||B.fronts.length)h+='<section class="card dirty"><div class="listseg"><div><div class="lbl">SCHWARZGELD</div><b class="bigd">'+eur(p.dirty)+'</b></div>'+btn('bizhelp',null,'So funktioniert es','g')+'</div><p class="note">Am Jahresende wird es über deine Geschäfte gewaschen (15 % Gebühr). Was darüber hinausgeht, nimmt ein Mittelsmann: bis 20.000 € pro Jahr, er behält 40 %.</p></section>';
  if(minor)return h+card('','<p class="note">Geschäfte führen kannst du ab 18 Jahren.</p>');
  if(!B.co)return h+'<section class="card found"><div class="fic"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18"/></svg></div><h2 class="h">Unternehmen gründen</h2><p class="note">Bevor du dein erstes Geschäft kaufst, brauchst du ein eingetragenes Unternehmen. Der Notar setzt den Gesellschaftsvertrag auf ('+eur(2400)+'), das Amtsgericht trägt es ins Handelsregister ein ('+eur(1300)+').</p>'+
    '<input type="text" id="coName" maxlength="28" placeholder="Name des Unternehmens" value="'+esc(drafts.coName||'')+'"><button class="btn o big" data-a="cofound"'+(p.money<CO_COST||lock?' disabled':'')+'>Gründen · '+eur(CO_COST)+'</button></section>'+
    '<p class="note" style="text-align:center">Danach kannst du Geschäfte kaufen, eine Firma aufbauen und an die Börse bringen, einen Onlineshop starten und später sogar eine eigene Bank gründen.</p>';
  h+='<section class="card co"><div class="fic"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18"/></svg></div><div class="ct"><b>'+esc(B.co.name)+'</b><small>'+(B.hold?'Holding · Tech-Startup und eigene Bank freigeschaltet':'GmbH · gegründet mit '+B.co.a+' Jahren')+'</small></div>'+
    (B.hold?'<span class="chip">Holding</span>':btn('holding',null,'Holding · '+eur(HOLD_COST),'',p.money<HOLD_COST||lock))+'</section>';
  h+='<!--S:mk-->'+plusTop(lock)+'<!--S:fr-->';
  // Geschäfte
  h+='<h3 class="sec">Geschäfte</h3>'+FRONTS.map(F=>{const own=B.fronts.includes(F.id),lv=flvl(F.id),dm=(B.dem&&B.dem[F.id])||[1],dl=dm[dm.length-1];
    return '<!--F:'+F.id+'--><section class="card front'+(own?' own':'')+'"><div class="fh"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+F.ic+'</svg></span><div><b>'+F.n+'</b><small>'+F.d+'</small></div></div>'+
      '<div class="tags"><span class="tag g">+'+eur(F.profit*(1+.5*(lv-1)))+' im Jahr</span><span class="tag">wäscht '+eur(F.wash*(1+.4*(lv-1)))+'</span><span class="tag w">Razzia '+(p.staff&&p.staff.guard?F.raid/2:F.raid)+' %</span></div>'+
      (own?'<div class="dem"><div><small>NACHFRAGE</small><b class="'+(dl>=1?'up':'down')+'">'+(dl>=1.15?'hoch':dl>=.9?'normal':'schwach')+'</b></div>'+bars(dm)+'</div><div class="lvl"><span>Ausbau '+lv+'/3</span><div class="segs">'+[1,2,3].map(i=>'<i class="'+(i<=lv?'on':'')+'"></i>').join('')+'</div>'+(lv<3?btn('upfront',F.id,'Ausbauen · '+eur(F.cost*.5*lv),'o',p.money<F.cost*.5*lv||lock):'')+'</div>':'')+
      '<div class="fb"><b>'+(own?'Gehört dir':eur(F.cost))+'</b>'+(own?btn('sellfront',F.id,'Verkaufen · '+eur(F.cost*.7),'g',lock):btn('front',F.id,'Kaufen','o',p.money<F.cost||lock))+'</div></section><!--/F-->'}).join('');
  h+='<!--S:fi-->';
  // Firma
  h+='<h3 class="sec">Eigene Firma</h3>';const f=B.firm;
  if(f){const F=FI[f.t],sv=f.ipo&&STK.my?STK.my:null,val=f.ipo?Math.round((p.sh.my||0)*p.px.my):f.val;
    h+='<section class="card"><div class="fh"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+F.ic+'</svg></span><div><b>'+esc(f.name)+'</b><small>'+F.n+' · seit '+f.yrs+' Jahr(en)'+(f.ipo?' · an der Börse':'')+'</small></div></div>';
    if(f.ipo)h+='<div class="bigv"><b>'+eur(val)+'</b><span class="note">Wert deiner Aktien</span></div>'+lineSvg(p.hist.my.slice(-20),110,true)+'<div class="btns">'+btn('goto','boerse','Zur Börse','o')+'</div></section>';
    else{h+='<div class="bigv"><b>'+eur(f.val)+'</b>'+(f.last!=null?'<span class="'+(f.last>=0?'up':'down')+'">'+pct(f.last*100)+' letztes Jahr</span>':'<span class="note">Firmenwert</span>')+'</div>'+(f.hist.length>1?lineSvg(f.hist.slice(-20),110,true):'')+
      '<div class="kv"><div><small>Mitarbeitende</small><b>'+f.emp+'</b></div><div><small>Ausschüttung</small><b class="up">'+eur(firmProfit())+'</b></div><div><small>Kosten Personal</small><b>'+eur(f.emp*empCost(f))+'</b></div></div>'+
      '<div class="btns">'+btn('f_hire',null,'Einstellen','o',p.act<=0||f.emp>=20||lock)+btn('f_fire',null,'Entlassen','g',!f.emp||lock)+btn('f_mkt',null,'Werbung · '+eur(f.val*.05),'',p.act<=0||p.money<f.val*.05||!!f.mkt||lock)+'</div>'+
      '<div class="btns">'+btn('f_inv',10000,'+10.000 € investieren','g',p.money<10000||lock)+btn('f_inv',100000,'+100.000 €','g',p.money<100000||lock)+'</div>'+
      '<div class="btns">'+btn('f_ipo',null,f.val>=1e6?'Börsengang':'Börsengang ab 1 Mio. €','o',f.val<1e6||lock)+btn('f_sell',null,'Verkaufen · '+eur(f.val*.8),'g',lock)+'</div>'+
      '<p class="note" style="margin-top:8px">Einstellen und Werbung kosten je 1 Aktion. Jede Person bringt 2 % mehr Wachstum, kostet aber '+eur(empCost(f))+' im Jahr. Beim Börsengang verkaufst du 40 % an Anleger und bekommst das Geld sofort.</p></section>'}}
  else h+='<section class="card"><p class="note" style="margin-bottom:10px">Gründe eine Firma, lass sie wachsen und bring sie an die Börse.</p><input type="text" id="firmName" maxlength="28" placeholder="Name der Firma" value="'+esc(drafts.firmName||'')+'"><div class="flist">'+
    FIRMS.map(F=>'<button class="fbtn" data-a="firm" data-g="'+F.id+'"'+(p.money<F.cost||(F.hold&&!B.hold)||lock?' disabled':'')+'><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+F.ic+'</svg><span>'+F.n+'</span><b>'+eur(F.cost)+'</b></button>').join('')+'</div><p class="note" style="margin-top:8px">Das Tech-Startup braucht eine Holding im Rücken. Je teurer, desto mehr Wachstum und Risiko.</p></section>';
  h+='<!--S:ch-->'+plusFronts(lock);
  h+='<!--S:sh-->';
  // Onlineshop
  h+='<h3 class="sec">Onlineshop</h3>';const s=B.shop;
  if(s){const C=SHOPCAT[s.cat];h+='<section class="card"><div class="fh"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+C[2]+'</svg></span><div><b>'+esc(s.name)+'</b><small>'+C[0]+' · Stufe '+s.lvl+' · Marge '+Math.round(C[1]*100)+' %</small></div></div>'+
      '<div class="bigv"><b class="'+(shopProfit()>=0?'up':'down')+'">'+eur(shopProfit())+'</b><span class="note">erwartet pro Jahr</span></div>'+
      Object.keys(SVC).map(k=>{const S=SVC[k],q=Math.round(svcQ(k)*100);return '<div class="svc"><div><b>'+S.n+'</b><small>'+(s.svc[k]==='pro'?'Profi: '+eur(S.pro)+' im Jahr':'Selbst: Qualität '+q+' % (dein '+STAT[S.st]+')')+'</small></div><div class="seg mini">'+[['self','Selbst'],['pro','Profi']].map(([v,l])=>'<button data-a="svc" data-g="'+k+':'+v+'" aria-pressed="'+(s.svc[k]===v)+'">'+l+'</button>').join('')+'</div></div>'}).join('')+
      '<div class="btns">'+btn('shoplvl',null,'Sortiment erweitern · '+eur(5000*s.lvl),'o',p.money<5000*s.lvl||lock)+btn('shopclose',null,'Schließen','g')+'</div><p class="note" style="margin-top:8px">Mehr Follower auf Klick bringen mehr Kundschaft.</p></section>'}
  else h+='<section class="card"><p class="note" style="margin-bottom:10px">Gründe einen Shop und verdiene jedes Jahr nebenbei. Technik, Marketing, Fotos und Versand machst du selbst, wenn du es kannst, oder du beauftragst Profis.</p><input type="text" id="shopName" maxlength="28" placeholder="Name deines Shops" value="'+esc(drafts.shopName||'')+'"><div class="cats">'+
    Object.keys(SHOPCAT).map(k=>'<button class="cat" data-a="shopcat" data-g="'+k+'" aria-pressed="'+(shopCat===k)+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+SHOPCAT[k][2]+'</svg>'+SHOPCAT[k][0]+'</button>').join('')+'</div><p class="note" style="margin:8px 0">Marge etwa '+Math.round(SHOPCAT[shopCat][1]*100)+' %.</p><button class="btn o big" data-a="shopfound"'+(p.money<SHOP_COST||lock?' disabled':'')+'>Gründen · '+eur(SHOP_COST)+'</button></section>';
  if(B.shop)h+=plusShop(lock);
  h+='<!--S:bk-->';
  // Bank
  h+='<h3 class="sec">Eigene Bank</h3>';
  if(B.bank)h+='<section class="card"><div class="fh"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18"/></svg></span><div><b>'+esc(B.bank.name)+'</b><small>Privatbank</small></div></div><div class="kv"><div><small>Kundengelder</small><b>'+eur(B.bank.dep)+'</b></div><div><small>Dein Anteil pro Jahr</small><b class="up">'+eur(B.bank.dep*.01*(1+.05*(B.bank.fil||0)))+'</b></div></div></section>'+plusBank(lock);
  else h+='<section class="card"><p class="note">Deine eigene Privatbank: Kunden bringen ihr Erspartes, du verleihst es weiter und verdienst an der Marge. Die Hälfte des Gewinns fließt jedes Jahr auf dein Konto.</p><p class="note" style="margin-top:6px">'+(B.hold?'':'Die Aufsicht gibt die Lizenz nur an eine Holding. ')+'Lizenz und Startkapital: '+eur(BANK_COST)+'.</p><button class="btn o big" data-a="bankbuy" style="margin-top:10px"'+(!B.hold||p.money<BANK_COST||lock?' disabled':'')+'>Bank gründen · '+eur(BANK_COST)+'</button></section>';
  return h;
}

