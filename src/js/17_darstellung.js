/* ---------- Darstellung ---------- */
const fmtP=v=>v.toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
const pct=v=>(v>=0?'+':'−')+Math.abs(v).toFixed(1).replace('.',',')+' %';
function lineSvg(arr,h,big,force){
  const n=arr.length,mn=Math.min(...arr),mx=Math.max(...arr),sp=mx-mn||1,W=100,H=40,pad=big?2:3;
  const pts=arr.map((v,i)=>[(n<2?W:i/(n-1)*W),pad+(1-(v-mn)/sp)*(H-pad*2)]);
  const line=pts.map(q=>q[0].toFixed(2)+','+q[1].toFixed(2)).join(' ');const cls=force||(arr[n-1]>=arr[0]?'up':'down');
  const grid=big?[.25,.5,.75].map(g=>'<line x1="0" x2="100" y1="'+(H*g)+'" y2="'+(H*g)+'" stroke="var(--line)" stroke-width="1" vector-effect="non-scaling-stroke"/>').join(''):'';
  return '<svg class="'+cls+'" viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:'+h+'px;display:block" aria-hidden="true">'+grid+
    '<polygon points="0,40 '+line+' 100,40" fill="currentColor" opacity=".13"/><polyline points="'+line+'" fill="none" stroke="currentColor" stroke-width="'+(big?2.5:2)+'" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>';
}
function indexHist(){const SS=STOCKS.filter(s=>s.id!=='my');const L=Math.min(...SS.map(s=>p.hist[s.id].length));const out=[];for(let i=0;i<L;i++){let t=0;SS.forEach(s=>{const h=p.hist[s.id];t+=h[h.length-L+i]/h[0]});out.push(t/SS.length*1000)}return out}
function rangeSeg(){return '<div class="seg rs">'+[[5,'5 J.'],[10,'10 J.'],[0,'Alles']].map(([v,l])=>'<button data-a="range" data-g="'+v+'" aria-pressed="'+(stockRange===v)+'">'+l+'</button>').join('')+'</div>'}
const cut=a=>stockRange?a.slice(-(stockRange+1)):a;
function bigChart(arr){const a=cut(arr),mn=Math.min(...a),mx=Math.max(...a),yrs=a.length-1;
  return '<div class="bc"><span class="yl t">'+fmtP(mx).replace(' €','')+'</span><span class="yl b">'+fmtP(mn).replace(' €','')+'</span>'+lineSvg(a,170,true)+'</div><div class="xl"><span>vor '+yrs+' Jahren</span><span>heute</span></div>'}
function viewBoerse(){
  ensureStocks();const minor=p.age<18;
  if(stockSel&&STK[stockSel]){const s=STK[stockSel],h=p.hist[s.id],pr=p.px[s.id],a=cut(h),chg=(pr/a[0]-1)*100,c1=(pr/p.prev[s.id]-1)*100;
    const n=p.sh[s.id]||0,val=n*pr,cost=p.cost[s.id]||0,gv=val-cost,risk=s.v>=.4?'hoch':(s.v>=.2?'mittel':'niedrig');
    return '<section class="card"><button class="btn sm g" data-a="stock" data-g="">Alle Aktien</button><div class="sh"><div><h2 class="h" style="margin:8px 0 0">'+s.n+'</h2><p class="note">'+s.b+'</p></div></div>'+
      '<div class="bigv"><b>'+fmtP(pr)+'</b><span class="'+(c1>=0?'up':'down')+'">'+pct(c1)+' im letzten Jahr</span></div>'+rangeSeg()+bigChart(h)+
      '<div class="kv"><div><small>Zeitraum</small><b class="'+(chg>=0?'up':'down')+'">'+pct(chg)+'</b></div><div><small>Hoch</small><b>'+fmtP(Math.max(...a))+'</b></div><div><small>Tief</small><b>'+fmtP(Math.min(...a))+'</b></div><div><small>Risiko</small><b>'+risk+'</b></div><div><small>Dividende</small><b>'+(s.div?(s.div*100).toFixed(0)+' % pro Jahr':'keine')+'</b></div></div></section>'+
      card('Dein Bestand',n?row('Wert',(n<10?n.toFixed(2).replace('.',','):Math.round(n).toLocaleString('de-DE'))+' Stück','<span class="num">'+eur(val)+'</span>')+row('Gewinn/Verlust','eingesetzt '+eur(cost),'<span class="num '+(gv>=0?'up':'down')+'">'+(gv>=0?'+':'')+eur(gv)+'</span>')+'<div class="btns">'+btn('sellst',s.id+':half','Hälfte verkaufen','g')+btn('sellst',s.id+':all','Alles verkaufen','g')+'</div>':'<p class="note">Du besitzt noch keine Aktien von '+s.n+'.</p>')+
      card('Kaufen',minor?'<p class="note">Aktien kannst du ab 18 kaufen.</p>':'<p class="note" style="margin-bottom:8px">Kontostand: '+eur(p.money)+'</p><div class="btns">'+[500,1000,5000,20000].map(v=>btn('buyst',s.id+':'+v,eur(v),'',p.money<v||!!p.prison)).join('')+btn('buyst',s.id+':all','Alles','o',p.money<1||!!p.prison)+'</div>');
  }
  const sv=stockVal(),inv=STOCKS.reduce((t,s)=>t+(p.sh[s.id]?(p.cost[s.id]||0):0),0),gv=sv-inv,ix=indexHist(),ixa=cut(ix),ixc=(ix[ix.length-1]/ixa[0]-1)*100;
  const held=STOCKS.filter(s=>(p.sh[s.id]||0)*p.px[s.id]>=1);
  let h='<section class="card"><div class="lbl">DEIN DEPOT</div><div class="bigv"><b>'+eur(sv)+'</b>'+(inv?'<span class="'+(gv>=0?'up':'down')+'">'+(gv>=0?'+':'')+eur(gv)+' ('+pct(inv?gv/inv*100:0)+')</span>':'<span class="note">noch leer</span>')+'</div>';
  if(held.length)h+='<div class="alloc" aria-hidden="true">'+held.map(s=>'<i style="flex:'+((p.sh[s.id]*p.px[s.id])/sv).toFixed(4)+';background:'+s.c+'"></i>').join('')+'</div><div class="leg">'+held.map(s=>'<span><i style="background:'+s.c+'"></i>'+s.n+' '+Math.round(p.sh[s.id]*p.px[s.id]/sv*100)+' %</span>').join('')+'</div>';
  h+='</section><section class="card"><div class="listseg"><div><div class="lbl">HANSE-INDEX</div><div class="bigv" style="margin:0"><b>'+Math.round(ix[ix.length-1]).toLocaleString('de-DE')+' Pkt.</b><span class="'+(ixc>=0?'up':'down')+'">'+pct(ixc)+'</span></div></div></div>'+rangeSeg()+bigChart(ix)+'</section>';
  h+=card('Aktien','<p class="note" style="margin-bottom:4px">Kurve: letzte 10 Jahre · Prozent: letztes Jahr</p>'+(minor?'<p class="note">Aktien kannst du ab 18 kaufen. Zuschauen geht schon.</p>':'')+STOCKS.map(s=>{const pr=p.px[s.id],c1=(pr/p.prev[s.id]-1)*100,n=p.sh[s.id]||0;
    return '<button class="srow" data-a="stock" data-g="'+s.id+'"><span class="sn"><b>'+s.n+'</b><small>'+(n?'Besitz '+eur(n*pr):(s.div?'Dividende '+(s.div*100).toFixed(0)+' %':'keine Dividende'))+'</small></span><span class="sp">'+lineSvg(p.hist[s.id].slice(-11),36,false,c1>=0?'up':'down')+'</span><span class="sv"><b>'+fmtP(pr)+'</b><small class="'+(c1>=0?'up':'down')+'">'+pct(c1)+'</small></span></button>'}).join(''));
  if(p.mnews.length)h+=card('Börsennews',p.mnews.map(m=>row(esc(m.t),'Alter '+m.a)).join(''));
  return h;
}
