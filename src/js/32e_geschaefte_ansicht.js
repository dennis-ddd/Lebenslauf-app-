/* ================= Geschäfte: aufgeräumte Ansicht mit Kopfkarte und Reitern ================= */
let bizTab='uebersicht',bizSelF=null,bizBuy=false;
const BTABS=[['uebersicht','Übersicht'],['laeden','Läden'],['firma','Firma'],['shop','Shop'],['bank','Bank']];
function bizValue(){const B=p.biz;if(!B)return 0;let v=B.fronts.reduce((s,k)=>s+FR[k].cost*(1+.3*(flvl(k)-1))*(1+.6*((B.fil||{})[k]||0)),0);
  if(B.firm)v+=B.firm.ipo?Math.round((p.sh.my||0)*(p.px.my||0)):B.firm.val;if(B.shop)v+=B.shop.lvl*5000+(B.shop.prods||[]).length*8000+(B.shop.sup?SUPPLY_COST:0);if(B.bank)v+=Math.round(B.bank.dep*.05);return Math.round(v)}
function viewBiz(){const raw=bizRaw(),B=p.biz,lock=!!p.prison;if(p.age<18||!B.co)return raw;ensurePlus();
  const seg=k=>{const a=raw.split('<!--S:'+k+'-->');return a.length>1?a[1].split('<!--S:')[0]:''};
  const grab=(s,t)=>{const o={};s.replace(new RegExp('<!--'+t+':(\\w+)-->([\\s\\S]*?)<!--\\/'+t+'-->','g'),(m,k,v)=>{o[k]=v;return ''});return o};
  const mk=seg('mk'),comps=grab(mk,'K'),mkt=(mk.split('<!--MKT-->')[1]||''),fronts=grab(seg('fr'),'F'),chains=grab(seg('ch'),'C');
  const m=mktOn(),nc=B.comp.length;
  let h='<section class="card bizhead"><div class="bh1"><span class="fic"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18"/></svg></span><div class="bht"><b>'+esc(B.co.name)+'</b><small>'+(B.hold?'Holding':'GmbH')+' · '+(B.fronts.length+(B.firm?1:0)+(B.shop?1:0)+(B.bank?1:0))+' Unternehmen</small></div>'+
    (B.hold?'<span class="chip">Holding</span>':btn('holding',null,'Holding · '+eur(HOLD_COST),'',p.money<HOLD_COST||lock))+'</div>'+
    '<div class="bkpi"><div><small>Gewinn pro Jahr</small><b class="up">'+eur(bizExpected())+'</b></div><div><small>Firmenwert</small><b>'+eur(bizValue())+'</b></div></div>'+
    ((B.ph||[]).length>1?'<div class="bph">'+bars(B.ph.slice(-10))+'<small>Gewinn der letzten Jahre</small></div>':'')+
    '<div class="bchips">'+(nc?'<button class="bchip warn" data-a="biztab" data-g="uebersicht">'+nc+' Konkurrent'+(nc>1?'en':'')+'</button>':'')+(m?'<button class="bchip ok" data-a="biztab" data-g="uebersicht">'+MKT[m.k][0]+' läuft</button>':'<button class="bchip" data-a="biztab" data-g="uebersicht">Kein Marketing</button>')+
      (p.dirty>0?'<button class="bchip dark" data-a="biztab" data-g="uebersicht">Schwarzgeld '+eur(p.dirty)+'</button>':'')+(B.shop&&(B.shop.prods||[]).length?'<button class="bchip" data-a="biztab" data-g="shop">'+B.shop.prods.length+' Produkte</button>':'')+'</div></section>';
  h+='<div class="seg full btabs">'+BTABS.map(([k,l])=>'<button data-a="biztab" data-g="'+k+'" aria-pressed="'+(bizTab===k)+'">'+l+'</button>').join('')+'</div>';
  if(bizTab==='uebersicht'){
    if(p.dirty>0||B.fronts.length)h+='<section class="card dirty slim"><div class="listseg"><div><div class="lbl">SCHWARZGELD</div><b class="bigd">'+eur(p.dirty)+'</b><small>Wäsche bis '+eur(washCap())+' pro Jahr</small></div><button class="ibtn" data-a="bizhelp" aria-label="So funktioniert Schwarzgeld">i</button></div></section>';
    const rows=B.fronts.map(k=>['bizself',k,FR[k].ic,FR[k].n,(1+((B.fil||{})[k]||0))+' Standort(e)',Math.round(FR[k].profit*(1+.5*(flvl(k)-1))*bizMul(k)),bstars(k)]);
    if(B.firm)rows.push(['biztab','firma',FI[B.firm.t].ic,B.firm.name,FI[B.firm.t].n+(B.firm.ipo?' · an der Börse':''),B.firm.ipo?0:firmProfit(),null]);
    if(B.shop)rows.push(['biztab','shop',SHOPCAT[B.shop.cat][2],B.shop.name,'Onlineshop · '+(B.shop.prods||[]).length+' Produkte',shopProfit(),bstars('shop')]);
    if(B.bank)rows.push(['biztab','bank','<path d="M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18"/>',B.bank.name,(1+(B.bank.fil||0))+' Standort(e)',Math.round(B.bank.dep*.01*(1+.05*(B.bank.fil||0))),null]);
    h+='<h3 class="sec">Deine Unternehmen</h3>'+(rows.length?'<section class="card burows">'+rows.map(r=>'<button class="burow" data-a="'+r[0]+'" data-g="'+r[1]+'"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+r[2]+'</svg></span><span class="but"><b>'+esc(r[3])+'</b><small>'+esc(r[4])+'</small>'+(r[6]!=null?starHtml(r[6]):'')+'</span><b class="'+(r[5]>=0?'up':'down')+'">'+eur(r[5])+'</b></button>').join('')+'</section>':
      '<section class="card"><p class="note">Noch kein Geschäft. Kauf einen Laden, gründe eine Firma oder einen Onlineshop.</p><div class="btns">'+btn('biztab','laeden','Laden kaufen','o')+btn('biztab','firma','Firma gründen')+btn('biztab','shop','Shop starten')+'</div></section>');
    if(nc)h+='<h3 class="sec">Konkurrenz</h3>'+Object.values(comps).join('');
    h+=mkt}
  if(bizTab==='laeden'){const own=B.fronts.slice();
    if(own.length){h+='<h3 class="sec">Deine Läden</h3>'+own.map(k=>{const F=FR[k];if(bizSelF===k)return '<div class="fsel">'+(fronts[k]||'')+(comps[k]||'')+(chains[k]||'')+'<button class="btn g" data-a="bizself" data-g="">Einklappen</button></div>';
      return '<section class="card burows"><button class="burow" data-a="bizself" data-g="'+k+'"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+F.ic+'</svg></span><span class="but"><b>'+F.n+'</b><small>Ausbau '+flvl(k)+'/3 · '+(1+((B.fil||{})[k]||0))+' Standort(e)'+(compOf(k)?' · Konkurrenz!':'')+'</small>'+starHtml(bstars(k))+'</span><svg class="i chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></section>'}).join('')}
    const rest=FRONTS.filter(F=>!B.fronts.includes(F.id));
    if(rest.length){if(own.length)h+='<button class="btn g newl" data-a="bizbuy">'+(bizBuy?'Angebote ausblenden':'Neuen Laden kaufen ('+rest.length+' Angebote)')+'</button>';else h+='<h3 class="sec">Laden kaufen</h3>';
      if(bizBuy||!own.length)h+=rest.map(F=>fronts[F.id]||'').join('')}}
  if(bizTab==='firma')h+=seg('fi');
  if(bizTab==='shop')h+=seg('sh');
  if(bizTab==='bank')h+=seg('bk');
  return h}
function act11(id,arg){switch(id){
  case 'biztab':bizTab=arg;bizSelF=null;render();window.scrollTo(0,0);return 1;
  case 'bizself':bizSelF=arg||null;bizTab='laeden';render();return 1;
  case 'bizbuy':bizBuy=!bizBuy;render();return 1;
  }return 0}
