/* ================= Spürbare Wirtschaft: Arbeitslosigkeit, Immobilienmarkt, Lohnrunden, Preisschocks, Wirtschaftsseite ================= */
function ecoX(){const e=p.econ;if(!e)return {al:[5.5],re:[100],ri:1};if(!e.al){e.al=[];e.re=[];let a=5.5;for(let i=0;i<10;i++){a=clamp(a+(Math.random()-.5)*.7,4,7.5);e.al.push(+a.toFixed(1));e.re.push(100)}e.ri=1}return e}
const curAl=()=>{const e=ecoX();return e.al[e.al.length-1]};
const sgn=v=>(v>=0?'+':'−')+pc1(Math.abs(v));
const SPECJ=['influ','pol','profi'];
/* Bewerbungen: hohe Arbeitslosigkeit = mehr Konkurrenz, Bekanntheit hilft ein wenig */
function jobMkt(){if(!p||!p.econ)return 0;return -(curAl()-5.5)*.018+(typeof fameNow==='function'?Math.min(.08,fameNow()/1000):0)}
{const _bm=bizMul;bizMul=k=>_bm(k)*(p&&p.econ?1-(curAl()-5.5)*.012:1)}
function econYear2(R0){const e=ecoX(),ph=typeof ecoPh==='function'?ecoPh():'normal',infl=curInfl(),lz=curLz(),lz0=e.lz[e.lz.length-2]==null?lz:e.lz[e.lz.length-2];
  // Arbeitslosigkeit folgt der Konjunktur
  const tgt=5.5+({boom:-1.8,rezession:3.4,krise:1.3,pandemie:2.2}[ph]||0),a0=curAl();let a=a0+(tgt-a0)*.45+(Math.random()-.5)*.5;a=+clamp(a,2.5,14).toFixed(1);e.al.push(a);
  // Immobilienpreise: Konjunktur und Zinsen
  const d=.025+({boom:.05,rezession:-.07,krise:-.02,pandemie:-.015}[ph]||0)-(lz-2.5)*.012+(Math.random()-.5)*.03;e.ri*=1+d;e.re.push(Math.round(e.ri*100));
  if(e.al.length>40){e.al.shift();e.re.shift()}e.reD=d;
  (p.props||[]).forEach(pr=>{pr.val=Math.round(pr.val*(1+d-.025))});
  // Lohnrunde: Gehälter wachsen mit der Inflation, aber nicht ganz
  e.raise=null;if(p.job&&!SPECJ.includes(p.job.id)&&p.age>=16){const r=clamp(infl*.75/100+(ph==='boom'?.015:0)-(ph==='rezession'?.01:0)+(Math.random()-.5)*.01,-.03,.08);p.job.pay=Math.round(p.job.pay*(1+r));e.raise=r}
  // Kurzarbeit und Entlassungen bei hoher Arbeitslosigkeit
  if(p.job&&!p.job.part&&!SPECJ.includes(p.job.id)&&p.age<67){
    if(ph==='rezession'&&ch(.15)){const x=Math.round(p.job.pay*.2);p.money-=x;R0&&R0.out&&R0.out.push(['Kurzarbeit: 20 % weniger Gehalt',x]);log('Kurzarbeit: Deine Firma hat weniger Aufträge. Dir fehlen '+eur(x)+'.');add('gl',-3)}
    else if(a>7&&ch((a-7)*.012)){log('Stellenabbau: Du hast deinen Job als '+p.job.t+' verloren.');news('Firma in '+cityName(p.seed)+' streicht Stellen','lokal','Auch '+p.first+' '+p.last+' ist betroffen.');if(p.news[0])p.news[0].r='wirtschaft';p.job=null;add('gl',-8);if(typeof addLast==='function')addLast(4)}}
  // Schlagzeilen, wenn sich etwas Spürbares tut
  if(p.age>=12){const N=(t,x,r)=>{news(t,'welt',x);if(p.news[0])p.news[0].r=r||'wirtschaft'};
    if(infl>=5)N('Preisschock: Inflation bei '+pc1(infl),'Lebensmittel, Energie und Mieten werden spürbar teurer.');
    if(lz-lz0>=.8)N('Notenbank erhöht den Leitzins auf '+pc1(lz),'Kredite werden teurer, Sparen lohnt sich wieder mehr.');else if(lz0-lz>=.8)N('Notenbank senkt den Leitzins auf '+pc1(lz),'Kredite werden billiger, Immobilien gefragter.');
    if(a-a0>=1)N('Arbeitslosigkeit steigt auf '+pc1(a),'Firmen stellen kaum noch ein.');else if(a0-a>=1)N('Arbeitslosigkeit sinkt auf '+pc1(a),'Viele Firmen suchen Leute.');
    if(d<=-.04)N('Immobilienpreise fallen deutlich','Ein Minus von '+pc1(-d*100)+' in einem Jahr.');else if(d>=.07)N('Immobilienpreise auf Rekordhoch','Ein Plus von '+pc1(d*100)+' in einem Jahr.')}
  if(infl>=5&&p.age>=16)add('gl',-2)}
{const _py=perkYear;perkYear=function(R0){_py(R0);try{if(p&&p.econ)econYear2(R0)}catch(e){}}}
/* Immobilien-Angebote folgen dem Markt */
{const _li=listings;listings=function(){const L=_li();if(!p||!p.econ||!p.econ.ri)return L;return L.map(x=>Object.assign({},x,{price:Math.round(x.price*p.econ.ri/1000)*1000,val:Math.round((x.val||x.price)*p.econ.ri)}))}}
/* Wirtschaftsseite */
function spark(v,col){const n=v.length;if(n<2)return '';const mn=Math.min(...v),mx=Math.max(...v),rg=mx-mn||1;
  return '<svg class="spk" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="'+col+'" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" points="'+v.map((x,i)=>(i/(n-1)*100).toFixed(1)+','+(27-(x-mn)/rg*24).toFixed(1)).join(' ')+'"/></svg>'}
function econCard(){if(!p||!p.econ)return '';const e=ecoX(),L=k=>e[k].slice(-12),infl=curInfl(),lz=curLz(),al=curAl(),re=e.re.slice(-11),ch10=re.length>1?(re[re.length-1]/re[0]-1)*100:0;
  const tile=(n,v,sub,data,col)=>'<div class="ectile"><small>'+n+'</small><b>'+v+'</b>'+spark(data,col)+'<span>'+sub+'</span></div>';
  let h='<section class="card econ"><h2 class="h">Wirtschaft in '+esc(cityName(p.seed))+'</h2><div class="ecgrid">'+
    tile('Inflation',pc1(infl),infl>=4?'Preise steigen stark':infl<=1.5?'Preise stabil':'normal',L('infl'),'#F2994A')+
    tile('Leitzins',pc1(lz),lz>=4?'Kredite teuer':lz<=1.5?'Kredite billig':'mittel',L('lz'),'#6C8CFF')+
    tile('Arbeitslosigkeit',pc1(al),al>=8?'schwerer Jobmarkt':al<=4.5?'Fachkräfte gesucht':'normal',L('al'),'#E5484D')+
    tile('Immobilienpreise',(ch10>=0?'+':'')+Math.round(ch10)+' %','in 10 Jahren',re,'#2FA88F')+'</div>';
  const me=[];if(p.age>=16){if(e.raise!=null){const real=e.raise*100-infl;me.push(['Dein Gehalt',sgn(e.raise*100)+' · real '+sgn(real),real>=0?'up':'dn'])}
    me.push(['Sparzinsen auf dem Konto',pc1(rates().konto),'']);if(p.age>=18)me.push(['Zins für einen neuen Kredit',pc1(loanRate()),loanRate()>8?'dn':'']);
    if((p.props||[]).length)me.push(['Deine Immobilien',sgn((e.reD||0)*100)+' Marktwert in diesem Jahr',(e.reD||0)>=0?'up':'dn']);
    me.push(['Preise im Vergleich zum Start','+'+Math.round((p.econ.idx-1)*100)+' %','']);
    h+='<div class="mt">Für dich</div>'+me.map(([a,b,c])=>'<div class="mrow"><span>'+a+'</span><b class="'+c+'">'+b+'</b></div>').join('')}
  return h+'</section>'}
{const _vn=viewNews;viewNews=function(){const h=_vn(),i=h.indexOf('</section>')+10;return h.slice(0,i)+econCard()+h.slice(i)}}
