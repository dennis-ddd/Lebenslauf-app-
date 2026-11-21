/* ================= Geschäfte+: Filialen, Franchise, Marketing, Konkurrenz, Bewertungen, Produkte, Bankfilialen ================= */
const MKT={flyer:['Flyer und Plakate',2000,.06],klick:['Werbung auf Klick',8000,.14],radio:['Radiowerbung',20000,.2],tv:['TV-Spot',60000,.32]};
const COMPN=['Billig-Ketten-Konkurrenz','Ein hipper Neuer','Ein Großkonzern','Ein Familienbetrieb','Ein Discounter'];
const PRODT={mode:['T-Shirt','Hoodie','Sneaker','Tasche','Cap'],technik:['Ladekabel','Kopfhörer','Smartwatch','Handyhülle','Powerbank'],kosmetik:['Gesichtscreme','Parfüm','Lippenstift','Haaröl','Duschgel'],
 fitness:['Proteinpulver','Yogamatte','Hanteln','Energieriegel','Trinkflasche'],wohnen:['Duftkerze','Kissen','Poster','Lampe','Teppich'],hand:['Keramiktasse','Armband','Holzbrett','Strickmütze','Seife']};
const TIER={g:['Günstig',1.5,.22],n:['Normal',1,.38],p:['Premium',.55,.62]};
const QLV={b:['Basis',2000,.5],g:['Gut',6000,.75],t:['Top',15000,.95]};
const SUPPLY_COST=80000,PROD_MAX=4;
let prodT=null,prodTier='n',prodQ='g';
function ensurePlus(){const B=p.biz;if(!B)return;B.fil=B.fil||{};B.stars=B.stars||{};B.comp=B.comp||[];B.qy=B.qy||{};
  Object.keys(B.fil).forEach(k=>{if(!B.fronts.includes(k))delete B.fil[k]});B.comp=B.comp.filter(c=>c.k==='shop'?!!B.shop:B.fronts.includes(c.k));
  if(B.shop){B.shop.prods=B.shop.prods||[]}if(B.bank&&B.bank.fil==null)B.bank.fil=0}
const bstars=k=>{const B=p.biz;return B&&B.stars&&B.stars[k]!=null?B.stars[k]:3};
const mktOn=()=>{const m=p.biz&&p.biz.mkt;return m&&m.y>=p.age-1?m:null};
const compOf=k=>(p.biz&&p.biz.comp||[]).find(c=>c.k===k);
function bizMul(k){const B=p.biz;if(!B)return 1;ensurePlus();const fil=k==='shop'?0:(B.fil[k]||0),m=mktOn(),c=compOf(k);
  return (1+.7*fil)*(.85+(bstars(k)-1)*.075)*(1+(m?MKT[m.k][2]:0))*(c?1-c.str:1)}
const crimPast=()=>(p.crimes||0)>=3||!!p.gang||(p.wanted||0)>=2;
const starHtml=s=>'<span class="stars">'+[1,2,3,4,5].map(i=>'<i class="'+(s>=i-.25?'on':s>=i-.75?'half':'')+'"></i>').join('')+'<b>'+s.toFixed(1).replace('.',',')+'</b></span>';
const filCost=k=>Math.round(FR[k].cost*.6*(1+.25*(p.biz.fil[k]||0)));
const franchise=k=>Math.max(0,(p.biz.fil[k]||0)-3);
/* Produkte */
function prodRev(x){const s=p.biz.shop,reach=1+(p.sm?Math.log10(p.sm.fol+10)/8:0),T=TIER[x.tier];return 9000*T[1]*x.q*reach*(.85+(x.st-1)*.075)}
function prodProfitOne(x){return Math.round(prodRev(x)*TIER[x.tier][2]*(p.biz.shop.sup?1.15:1)*bizMul('shop'))}
function prodProfit(){const s=p.biz&&p.biz.shop;if(!s||!s.prods)return 0;return s.prods.reduce((t,x)=>t+prodProfitOne(x),0)}
const shopProfit0=shopProfit;
shopProfit=function(){const s=p.biz&&p.biz.shop;if(!s)return 0;return Math.round(shopProfit0()*bizMul('shop')*(s.sup?1.15:1))+prodProfit()};
/* Jahreswechsel */
function bizPlusYear(R0){const B=p.biz;if(!B||!B.co)return;ensurePlus();
  // Franchise-Gebühren und Filialkosten
  let fr=0;B.fronts.forEach(k=>{if(franchise(k))fr+=Math.round(FR[k].profit*.45*franchise(k))});if(fr){p.money+=fr;R0.inc.push(['Franchise-Gebühren',fr])}
  if(B.bank&&B.bank.fil){const c=B.bank.fil*px$(40000);p.money-=c;R0.out.push(['Bankfilialen: Betrieb',c])}
  // Bewertungen
  B.fronts.concat(B.shop?['shop']:[]).forEach(k=>{let s=bstars(k)+(Math.random()-.5)*.4+(mktOn()?.1:0)-(B.fil[k]||0)*.03;B.stars[k]=clamp(Math.round(s*10)/10,1,5);
    if(B.stars[k]>=4.6&&ch(.2))news((k==='shop'?B.shop.name:FR[k].n)+' bekommt Bestnoten von der Kundschaft','lokal');if(B.stars[k]<=1.8&&ch(.3))news('Kundschaft klagt über '+(k==='shop'?B.shop.name:FR[k].n),'lokal')});
  // Produkte
  if(B.shop)B.shop.prods.forEach(x=>{x.st=clamp(Math.round((x.st+(x.q-.7)*.6+(Math.random()-.5)*.5)*10)/10,1,5);x.last=Math.round(prodRev(x)*(.7+Math.random()*.6));
    if(ch(.06*x.q)){const b=Math.round(prodProfitOne(x)*2);p.money+=b;R0.inc.push(['Verkaufsschlager: '+x.n,b]);news(x.n+' ist der Verkaufsschlager des Jahres','kultur');x.hit=(x.hit||0)+1;mile('Verkaufsschlager: '+x.n,'star')}});
  // Konkurrenz: kommt und geht
  B.comp=B.comp.filter(c=>{if(p.age-c.y>=3&&ch(.3)){log(c.n+' hat aufgegeben. '+(c.k==='shop'?B.shop.name:FR[c.k].n)+' hat wieder Ruhe.');return false}return true});
  const targets=B.fronts.concat(B.shop?['shop']:[]).filter(k=>!compOf(k));if(targets.length&&ch(.13)){const k=pick(targets),n=pick(COMPN);B.comp.push({k,n,str:R(15,30)/100,y:p.age});
    log('Konkurrenz! '+n+' macht direkt neben '+(k==='shop'?'deinem Onlineshop':'deinem '+FR[k].n)+' auf.');news(n+' fordert '+(k==='shop'?B.shop.name:FR[k].n)+' heraus','lokal')}
  // Mitarbeiter-Ereignisse
  const units=B.fronts.concat(B.shop?['shop']:[]);if(units.length&&ch(.12))p.q.push({id:'bizstaff',d:{k:pick(units),t:pick(['streik','star','weg'])}});
  if(B.mkt&&B.mkt.y<p.age-1)B.mkt=null;B.ph=(B.ph||[]).concat([bizExpected()]).slice(-15)}
const uName=k=>k==='shop'?p.biz.shop.name:FR[k].n;
QEV.bizstaff=d=>{const B=p.biz;if(!B||!(d.k==='shop'?B.shop:B.fronts.includes(d.k)))return null;const n=uName(d.k);
  if(d.t==='streik')return E('Streik!','Das Team von '+n+' streikt für mehr Lohn.',()=>true,[['Lohn erhöhen ('+eur(px$(8000))+')',()=>(p.money-=px$(8000),B.stars[d.k]=Math.min(5,bstars(d.k)+.3),'Die Stimmung ist super. Der Service auch.')],['Hart bleiben',()=>(B.stars[d.k]=Math.max(1,bstars(d.k)-.6),p.money-=px$(3000),'Zwei Wochen zu. Die Kundschaft ist sauer.')]]);
  if(d.t==='star')return E('Mitarbeiter/in des Jahres','Die Kundschaft von '+n+' liebt eine Mitarbeiterin. Sie hätte gern eine Beförderung.',()=>true,[['Befördern (+5.000 € im Jahr)',()=>(p.money-=5000,B.stars[d.k]=Math.min(5,bstars(d.k)+.6),'Sie blüht auf. Die Bewertungen steigen.')],['Ein Lob muss reichen',()=>ch(.5)?(B.stars[d.k]=Math.max(1,bstars(d.k)-.4),'Sie kündigt und geht zur Konkurrenz.'):'Sie bleibt. Vorerst.']]);
  return E('Kündigung','Die Filialleitung von '+n+' hat ein Angebot von der Konkurrenz.',()=>true,[['Mehr Gehalt bieten ('+eur(px$(6000))+')',()=>(p.money-=px$(6000),'Sie bleibt.')],['Gehen lassen',()=>(B.stars[d.k]=Math.max(1,bstars(d.k)-.7),'Ohne sie läuft es holprig.')]])};
/* Ansichten */
function plusTop(lock){const B=p.biz;ensurePlus();const m=mktOn();let h='';
  if(B.comp.length)h+='<h3 class="sec">Konkurrenz</h3>'+B.comp.map(c=>{const F=c.k==='shop'?null:FR[c.k],buy=c.k==='shop'?px$(40000):Math.round(F.cost*.8),q=c.k==='shop'?px$(8000):Math.round(F.profit*.6),cr=crimPast();
    return '<!--K:'+c.k+'--><section class="card comp"><div class="fh"><span class="fic sm" style="background:linear-gradient(135deg,#D64545,#7A1F1F)"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/></svg></span><div><b>'+esc(c.n)+'</b><small>gegen '+esc(uName(c.k))+' · −'+Math.round(c.str*100)+' % Umsatz</small></div></div>'+
      '<div class="cpg">'+btn('cpprice',c.k,'Preiskampf · '+eur(px$(10000)),'',lock||p.money<px$(10000))+btn('cpqual',c.k,'Qualität · '+eur(q),'',lock||p.money<q)+btn('cpbuy',c.k,'Aufkaufen · '+eur(buy),'o',lock||p.money<buy)+btn('cprumor',c.k,'Gerüchte streuen','g',lock)+'</div>'+
      (cr?'<div class="cpdark"><small>Deine Vergangenheit öffnet andere Wege</small><div class="cpg">'+btn('cpsab',c.k,'Sabotage','g',lock||p.act<=0)+btn('cpdruck',c.k,p.gang?'Die Gang schicken':'Einschüchtern','g',lock||p.act<=0)+'</div></div>':'')+'</section><!--/K-->'}).join('');
  h+='<!--MKT--><h3 class="sec">Marketing</h3><section class="card">'+(m?'<div class="listseg"><b>'+MKT[m.k][0]+' läuft</b><span class="chip">+'+Math.round(MKT[m.k][2]*100)+' % Umsatz</span></div><p class="note">Wirkt bis zum nächsten Jahreswechsel auf alle Geschäfte und den Shop.</p>':
    '<p class="note" style="margin-bottom:8px">Eine Kampagne pro Jahr steigert den Umsatz aller Geschäfte und des Shops. Bewertungen steigen leicht.</p>'+Object.keys(MKT).map(k=>row(MKT[k][0],'+'+Math.round(MKT[k][2]*100)+' % Umsatz für ein Jahr',btn('mkt',k,eur(px$(MKT[k][1])),'o',lock||p.money<px$(MKT[k][1])))).join(''))+'</section>';
  return h}
function plusFronts(lock){const B=p.biz;ensurePlus();if(!B.fronts.length)return '';
  return '<h3 class="sec">Filialen und Ketten</h3>'+B.fronts.map(k=>{const F=FR[k],fil=B.fil[k]||0,fr=franchise(k),sell=Math.round(F.cost*(1+.3*(flvl(k)-1))*(1+.6*fil)*(.8+.1*bstars(k)));
    return '<!--C:'+k+'--><section class="card chain"><div class="fh"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+F.ic+'</svg></span><div><b>'+F.n+(fil?' · Kette':'')+'</b><small>'+(1+fil)+' Standort(e)'+(fr?' · Franchise':'')+'</small></div>'+starHtml(bstars(k))+'</div>'+
      '<div class="locs">'+Array.from({length:1+fil},(_,i)=>'<span>'+esc(i?cityName(p.seed+i*7919):cityName(p.seed))+'</span>').join('')+'</div>'+
      '<div class="kv"><div><small>Gewinn pro Jahr (geschätzt)</small><b class="up">'+eur(F.profit*(1+.5*(flvl(k)-1))*bizMul(k))+'</b></div><div><small>'+(fr?'Franchise-Gebühren':'Ab 5 Standorten')+'</small><b>'+(fr?eur(F.profit*.45*fr):'Franchise')+'</b></div></div>'+
      '<div class="btns">'+(fil<9?btn('fil',k,'Filiale eröffnen · '+eur(filCost(k)),'o',lock||p.money<filCost(k)):'<span class="chip">Maximal 10 Standorte</span>')+btn('frqual',k,B.qy[k]===p.age?'Qualität verbessert':'Qualität · '+eur(Math.round(F.profit*.5)),'',lock||B.qy[k]===p.age||p.money<F.profit*.5)+btn('frsell',k,'Alles verkaufen · '+eur(sell),'g',lock)+'</div></section><!--/C-->'}).join('')}
function plusShop(lock){const s=p.biz.shop;ensurePlus();const T=PRODT[s.cat];if(!prodT||!T.includes(prodT))prodT=T[0];
  let h='<h3 class="sec">Eigene Produkte · '+s.prods.length+' von '+PROD_MAX+'</h3>';
  h+=s.prods.map((x,i)=>'<section class="card prod"><div class="listseg"><div><b>'+esc(x.n)+'</b><small>'+esc(x.t)+' · '+TIER[x.tier][0]+(x.hit?' · '+x.hit+'× Verkaufsschlager':'')+'</small></div>'+starHtml(x.st)+'</div>'+
    '<div class="kv"><div><small>Qualität</small>'+qbars(x.q,'#0E9F7E')+'</div><div><small>Gewinn pro Jahr</small><b class="up">'+eur(prodProfitOne(x))+'</b></div></div>'+
    '<div class="btns">'+(x.q<.95?btn('produp',i,'Verbessern · '+eur(px$(5000)),'',lock||p.money<px$(5000)):'')+btn('prodrm',i,'Aus dem Sortiment','g')+'</div></section>').join('');
  if(s.prods.length<PROD_MAX)h+='<section class="card newprod"><h2 class="h">Neues Produkt entwickeln</h2><input type="text" id="prodName" maxlength="26" placeholder="Name, z. B. „'+esc(s.name.split(' ')[0])+' '+esc(prodT)+'“" value="'+esc(drafts.prodName||'')+'">'+
    '<div class="sl">Art</div><div class="schips">'+T.map(t=>'<button class="sch" data-a="prodt" data-g="'+esc(t)+'" aria-pressed="'+(prodT===t)+'"><b>'+esc(t)+'</b></button>').join('')+'</div>'+
    '<div class="sl">Preis</div><div class="schips">'+Object.keys(TIER).map(k=>'<button class="sch" data-a="prodtier" data-g="'+k+'" aria-pressed="'+(prodTier===k)+'"><b>'+TIER[k][0]+'</b><small>'+(k==='g'?'viel Absatz':k==='p'?'hohe Marge':'ausgewogen')+'</small></button>').join('')+'</div>'+
    '<div class="sl">Entwicklung</div><div class="schips">'+Object.keys(QLV).map(k=>'<button class="sch" data-a="prodq" data-g="'+k+'" aria-pressed="'+(prodQ===k)+'"><b>'+QLV[k][0]+'</b><small>'+eur(px$(QLV[k][1]))+'</small></button>').join('')+'</div>'+
    '<button class="btn o big" data-a="prodnew" style="margin-top:6px"'+(lock||p.money<px$(QLV[prodQ][1])?' disabled':'')+'>Produkt starten · '+eur(px$(QLV[prodQ][1]))+'</button></section>';
  h+=card('Eigene Produktion',s.sup?'<p class="note">Deine Manufaktur beliefert den Shop: +15 % Marge auf alles.</p>':row('Lieferkette aufbauen','Eigene Produktion statt Zwischenhändler: +15 % Marge',btn('supply',null,eur(px$(SUPPLY_COST)),'o',lock||p.money<px$(SUPPLY_COST))));
  return h}
function plusBank(lock){const bk=p.biz.bank;ensurePlus();const c=Math.round(px$(250000)*(1+.3*bk.fil));
  return '<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Bankfilialen</h2><span class="chip">'+(1+bk.fil)+' Standort(e)</span></div><div class="locs">'+Array.from({length:1+bk.fil},(_,i)=>'<span>'+esc(cityName(p.seed+i*104729))+'</span>').join('')+'</div>'+
    '<p class="note" style="margin:6px 0">Jede Filiale bringt sofort neue Kundengelder (+'+eur(px$(600000))+'), lässt die Einlagen schneller wachsen und erhöht deine Marge. Betrieb: '+eur(px$(40000))+' pro Filiale und Jahr.</p>'+
    (bk.fil<12?btn('bankfil',null,'Filiale eröffnen · '+eur(c),'o',lock||p.money<c):'<span class="chip">Maximal 13 Standorte</span>')+'</section>'}
/* Aktionen */
function act8(id,arg){const B=p.biz;if(!B)return 0;ensurePlus();const lock=!!p.prison;
  const kill=(k,t)=>{B.comp=B.comp.filter(c=>c.k!==k);done(t)};
  switch(id){
  case 'mkt':{const M=MKT[arg],c=px$(M[1]);if(!M||mktOn()||p.money<c||lock)return 1;p.money-=c;B.mkt={k:arg,y:p.age};done(M[0]+' gestartet: +'+Math.round(M[2]*100)+' % Umsatz bis zum Jahresende.');return 1}
  case 'fil':{const k=arg,c=filCost(k);if(!B.fronts.includes(k)||(B.fil[k]||0)>=9||p.money<c||lock)return 1;p.money-=c;B.fil[k]=(B.fil[k]||0)+1;const n=B.fil[k]+1;if(n===5){mile('Franchise: '+FR[k].n,'star');news(FR[k].n+' wird zur Franchise-Kette','kultur')}done('Neue Filiale von '+FR[k].n+' in '+cityName(p.seed+B.fil[k]*7919)+'! Jetzt '+n+' Standorte.');return 1}
  case 'frqual':{const k=arg,c=Math.round(FR[k].profit*.5);if(B.qy[k]===p.age||p.money<c||lock)return 1;p.money-=c;B.qy[k]=p.age;B.stars[k]=Math.min(5,bstars(k)+.5);done('Neue Rezepte, geschultes Team: '+FR[k].n+' steigt in der Bewertung.');return 1}
  case 'frsell':{const k=arg;if(!B.fronts.includes(k)||lock)return 1;const fil=B.fil[k]||0,v=Math.round(FR[k].cost*(1+.3*(flvl(k)-1))*(1+.6*fil)*(.8+.1*bstars(k)));p.money+=v;B.fronts=B.fronts.filter(x=>x!==k);delete B.fil[k];if(B.lvl)delete B.lvl[k];done(FR[k].n+' samt Filialen für '+eur(v)+' verkauft.');return 1}
  case 'cpprice':{const c=px$(10000);if(p.money<c||lock)return 1;p.money-=c;const C=compOf(arg);if(!C)return 1;if(ch(.5)){kill(arg,'Preiskampf gewonnen! '+C.n+' gibt auf.')}else{C.str=Math.min(.45,C.str+.05);done('Der Preiskampf geht weiter. Beide verdienen weniger.')}return 1}
  case 'cpqual':{const C=compOf(arg);if(!C||lock)return 1;const c=arg==='shop'?px$(8000):Math.round(FR[arg].profit*.6);if(p.money<c)return 1;p.money-=c;B.stars[arg]=Math.min(5,bstars(arg)+.7);C.str=Math.round(C.str*50)/100;done('Qualitätsoffensive: Die Kundschaft merkt den Unterschied.');return 1}
  case 'cpbuy':{const C=compOf(arg);if(!C||lock)return 1;const c=arg==='shop'?px$(40000):Math.round(FR[arg].cost*.8);if(p.money<c)return 1;p.money-=c;if(arg!=='shop'&&(B.fil[arg]||0)<9)B.fil[arg]=(B.fil[arg]||0)+1;kill(arg,'Du hast '+C.n+' aufgekauft.'+(arg!=='shop'?' Der Laden wird deine neue Filiale.':''));return 1}
  case 'cprumor':{const C=compOf(arg);if(!C||lock)return 1;addRuf(-5);if(ch(.55)){C.str=Math.round(C.str*50)/100;done('Die Gerüchte wirken. Bei '+C.n+' bleiben Kunden weg.')}else{B.stars[arg]=Math.max(1,bstars(arg)-.5);done('Es kommt raus, dass die Gerüchte von dir stammen. Peinlich.')}return 1}
  case 'cpsab':{const C=compOf(arg);if(!C||lock||!crimPast()||!useAct())return 1;addRuf(-8);p.crimes++;p.wanted=Math.min(5,(p.wanted||0)+1);
    if(ch(.55+(p.sk.schloss||0)/300)){kill(arg,'Lieferungen bleiben aus, die Kühlung fällt aus … '+C.n+' muss schließen. Niemand kann dir etwas nachweisen.')}
    else if(ch(.35)){p.prison=1;p.job=null;ach('knast');add('gl',-12);log('Die Sabotage fliegt auf. Ein Jahr Haft.');save();render();dialog('Erwischt','Die Sabotage fliegt auf. Ein Jahr Haft.',[['OK',null]])}
    else{p.money-=5000;done('Die Sabotage geht schief. 5.000 € Strafe.')}return 1}
  case 'cpdruck':{const C=compOf(arg);if(!C||lock||!crimPast()||!useAct())return 1;addRuf(-12);p.crimes++;p.wanted=Math.min(5,(p.wanted||0)+1);
    if(ch(.6+(p.sk.kampf||0)/300+(p.gang?.1+p.gang.rank*.03:0))){if(p.gang)p.gang.rep+=5;kill(arg,(p.gang?'Ein paar Leute von den '+p.gang.n:'Ein paar zwielichtige Bekannte')+' statten '+C.n+' einen Besuch ab. Am nächsten Tag ist der Laden verrammelt.')}
    else if(ch(.4)){p.prison=2;p.job=null;ach('knast');add('gl',-15);log('Anzeige wegen Nötigung: zwei Jahre Haft.');save();render();dialog('Anzeige','Der Konkurrent geht zur Polizei. Zwei Jahre Haft wegen Nötigung.',[['OK',null]])}
    else{C.str=Math.min(.45,C.str+.05);done(C.n+' lässt sich nicht einschüchtern und macht jetzt erst recht Druck.')}return 1}
  case 'prodt':prodT=arg;render();return 1;
  case 'prodtier':prodTier=arg;render();return 1;
  case 'prodq':prodQ=arg;render();return 1;
  case 'prodnew':{const s=B.shop;if(!s||s.prods.length>=PROD_MAX||lock)return 1;const c=px$(QLV[prodQ][1]);if(p.money<c)return 1;p.money-=c;const q=clamp(QLV[prodQ][2]+(Math.random()-.5)*.1,.3,1),nm=(drafts.prodName||'').trim()||s.name.split(' ')[0]+' '+prodT;
    s.prods.push({n:nm,t:prodT,tier:prodTier,q,st:clamp(Math.round((2.2+q*2.6)*10)/10,1,5),y:p.age});drafts.prodName='';if(s.prods.length===1)mile('Erstes eigenes Produkt','star');done('„'+nm+'“ ist ab sofort im Shop!');return 1}
  case 'produp':{const x=B.shop&&B.shop.prods[+arg],c=px$(5000);if(!x||p.money<c||lock)return 1;p.money-=c;x.q=Math.min(.95,x.q+.15);x.st=Math.min(5,x.st+.4);done('„'+x.n+'“ ist jetzt besser.');return 1}
  case 'prodrm':{const s=B.shop;if(!s)return 1;const x=s.prods.splice(+arg,1)[0];done(x?'„'+x.n+'“ aus dem Sortiment genommen.':'');return 1}
  case 'supply':{const s=B.shop,c=px$(SUPPLY_COST);if(!s||s.sup||p.money<c||lock)return 1;p.money-=c;s.sup=true;done('Deine eigene Produktion läuft. +15 % Marge.');return 1}
  case 'bankfil':{const bk=B.bank;if(!bk||bk.fil>=12||lock)return 1;const c=Math.round(px$(250000)*(1+.3*bk.fil));if(p.money<c)return 1;p.money-=c;bk.fil++;bk.dep+=px$(600000);done('Neue Filiale der '+bk.name+' in '+cityName(p.seed+bk.fil*104729)+'.');return 1}
  }return 0}
