/* ================= Wirtschaft & Bank ================= */
let bankUI={fgT:3,fgA:10000,krT:3,krA:10000,yr:null,fk:false},wTab='home',roomView=false,lTab='ich',fTab='aktiv';
function ensureEcon(){
  if(!p.econ){p.econ={idx:1,infl:[],lz:[]};let r=2;for(let i=0;i<12;i++){r=clamp(r+(2.2-r)*.3+(Math.random()*2-1)*.8,.3,6);p.econ.infl.push(+r.toFixed(1));p.econ.lz.push(+clamp(r+.5+(Math.random()-.5),0,6).toFixed(1))}}
  if(!p.fg)p.fg=[];if(!p.loans){p.loans=[];if(p.loan>0){p.loans.push(mkLoan(p.loan,8,5));p.loan=0}}if(p.bon==null)p.bon=70;if(!p.fin)p.fin=[];
  if(!p.sk)p.sk={fahren:0,schloss:0,hack:0,charme:R(10,30),kampf:R(5,20),form:R(20,45)};if(p.wanted==null)p.wanted=0;if(p.skinS==null)p.skinS=R(65,85);
  if(!p.ill)p.ill={};if(!p.ls)p.ls={vors:'beschw',krank:'spaeter',diet:'normal'};if(!p.staff)p.staff={};if(!p.furn)p.furn={};if(!p.rented)p.rented={};
  if(!p.ward)p.ward=[];if(!p.look)p.look={o:null,acc:[]};if(!p.goals)p.goals={};if(!p.clubs)p.clubs=[];if(p.gym===undefined)p.gym=null;if(!p.focus)p.focus='ganz';
  if(!p.once)p.once={};if(!p.props)p.props=[];if(p.home==='eigen'){const sp=p.props.find(x=>x.use==='self');if(sp)setEigenHome(sp);else p.home=p.age>=18?'wg':'eltern'}if(!p.biz.lvl)p.biz.lvl={};if(!p.biz.dem)p.biz.dem={};
}
const curInfl=()=>p.econ.infl[p.econ.infl.length-1],curLz=()=>p.econ.lz[p.econ.lz.length-1];
const px$=x=>Math.round(x*p.econ.idx);
const rates=()=>{const l=curLz();return {konto:Math.max(0,l-.7),1:Math.max(.1,l-.3),3:Math.max(.2,l),5:Math.max(.3,l+.2)}};
const pc1=v=>v.toFixed(1).replace('.',',')+' %';
const once=k=>p.once[k]===p.age,setOnce=k=>{p.once[k]=p.age};
function econYear(){const e=p.econ;let r=clamp(curInfl()+(2.2-curInfl())*.3+(Math.random()*2-1)*.9,.2,7.5);if(ch(.06))r=clamp(r+R(2,4),.2,9.5);
  e.infl.push(+r.toFixed(1));e.lz.push(+clamp(r+.4+(Math.random()-.5)*1.2,0,7).toFixed(1));if(e.infl.length>40){e.infl.shift();e.lz.shift()}e.idx*=1+r/100;return r}
function mkLoan(a,rate,n){const i=rate/100,pay=Math.round(a*i/(1-Math.pow(1+i,-n)));return {amt:a,rate,n,left:n,pay}}
const loanSum=()=>(p.loans||[]).reduce((t,l)=>t+l.amt,0),fgSum=()=>(p.fg||[]).reduce((t,f)=>t+f.amt,0);
function bonitaet(){const inc=(p.job?p.job.pay:0)+p.pension;return clamp(Math.round(35+Math.min(30,inc/2500)+Math.min(25,Math.max(0,netWorth())/40000)-loanSum()/Math.max(10000,inc*2)*12+(p.bon-70)),0,100)}
const bonTxt=b=>b>=80?'Sehr gut':b>=60?'Gut':b>=40?'Mittel':b>=20?'Schwach':'Schlecht';
const maxLoan=()=>p.age<18?0:Math.round(((((p.job?p.job.pay:0)+p.pension)*3+Math.max(0,netWorth())*.5+5000)*bonitaet()/100)/1000)*1000;
const loanRate=()=>+Math.max(.5,curLz()+2+(100-bonitaet())/12-(perk('bankkfm')?1:0)).toFixed(1);
function bankYear(){const r=econYear(),out={zins:0,raten:0,fgz:0,si:0};
  out.si=Math.round(p.sav*rates().konto/100);p.sav+=out.si;
  p.fg=p.fg.filter(f=>{const z=Math.round(f.amt*f.rate/100);f.amt+=z;out.fgz+=z;f.left--;if(f.left<=0){p.money+=f.amt;log('Festgeld ausgezahlt: '+eur(f.amt)+'.');return false}return true});
  let missed=false;p.loans=p.loans.filter(l=>{const z=Math.round(l.amt*l.rate/100),pay=Math.min(l.pay,l.amt+z);l.amt=l.amt+z-pay;p.money-=pay;out.raten+=pay;out.zins+=z;l.left--;
    if(l.left<=0&&l.amt>0){p.money-=l.amt;out.raten+=l.amt;l.amt=0}return l.amt>0});
  if(p.money<0&&out.raten>0){missed=true;p.bon=Math.max(0,p.bon-12);log('Eine Kreditrate ist geplatzt. Deine Bonität sinkt.')}
  if(!missed)p.bon=Math.min(95,p.bon+2);
  if(p.job&&p.job.id!=='influ')p.job.pay=Math.round(p.job.pay*(1+r/100));if(p.pension)p.pension=Math.round(p.pension*(1+r/200));
  return out;
}
function netWorth(){const B=p.biz||{};return p.money+p.sav-loanSum()+fgSum()+stockVal()+propsValue()+p.owned.reduce((s,k)=>s+HOMES[k].buy,0)+(B.fronts||[]).reduce((s,k)=>s+FR[k].cost,0)+(B.firm&&!B.firm.ipo?B.firm.val:0)}
function fixedCosts(){const L=[];const a=p.age,H=HOMES[p.home];
  if(a>=18)L.push(['Wohnen: '+H.n,px$(H.c+(p.home==='eltern'?1200:0))]);
  p.owned.filter(k=>k!==p.home).forEach(k=>L.push(['Unterhalt '+HOMES[k].n,px$(HOMES[k].c)]));
  const kd=p.kids.filter(k=>a-k.b<18).length;if(kd)L.push(['Kinder ('+kd+')',kd*3000]);
  p.cars.forEach(c=>L.push([CARS[c].n,CARS[c].c]));p.pets.forEach(x=>L.push([PETS[x.t].n+' '+x.n,PETS[x.t].c]));
  Object.keys(p.staff).forEach(k=>L.push([STAFF[k].n,px$(STAFF[k].pay)]));
  const d=DIET[p.ls.diet];if(d.c)L.push(['Ernährung: '+d.n,px$(d.c)]);if(VORS[p.ls.vors].c)L.push(['Vorsorge',px$(VORS[p.ls.vors].c)]);
  if(p.gym)L.push([GYM[p.gym].n,px$(GYM[p.gym].c)]);p.clubs.forEach(c=>L.push([CLUBS[c].n,px$(CLUBS[c].c)]));
  (p.props||[]).forEach(pr=>L.push(['Unterhalt '+propName(pr),Math.round(pr.val*.008)]));
  p.loans.forEach((l,i)=>L.push(['Kreditrate '+(i+1),l.pay]));
  return L;
}
function bars(arr,hi){const mx=Math.max(...arr,1);return '<div class="vbars">'+arr.map((v,i)=>'<i style="height:'+Math.max(6,v/mx*100)+'%"'+(i===arr.length-1?' class="hi"':'')+'></i>').join('')+'</div>'}
function viewBank(){ensureEcon();const R2=rates(),b=bonitaet(),nw=netWorth(),minor=p.age<18;
  const born=p.econ.idx;let h='';
  // Vermögen
  const parts=[['Konto',Math.max(0,p.money),'#1E9E6A'],['Sparkonto',p.sav,'#2B59C3'],['Festgeld',fgSum(),'#8E63D6'],['Depot',stockVal(),'#F28C28'],['Immobilien & Firmen',nw-p.money-p.sav-fgSum()-stockVal()+loanSum(),'#C2408C']].filter(x=>x[1]>0);
  const tot=parts.reduce((s,x)=>s+x[1],0)||1;
  h+='<section class="card"><div class="listseg"><div class="lbl">NETTOVERMÖGEN</div>'+(loanSum()?'<span class="pill neg">−'+kfmt(loanSum())+' € Kredit</span>':'')+'</div><b class="bignum">'+eur(nw)+'</b><p class="note">Alles zusammen: Konto, Sparkonto, Festgeld, Depot, Immobilien und Geschäfte, abzüglich Kredite.</p>'+
    '<div class="alloc" style="height:12px;margin:12px 0 8px">'+parts.map(x=>'<i style="flex:'+(x[1]/tot).toFixed(4)+';background:'+x[2]+'"></i>').join('')+'</div><div class="leg">'+parts.map(x=>'<span><i style="background:'+x[2]+'"></i>'+x[0]+' '+kfmt(x[1])+' €</span>').join('')+(p.dirty>0?'<span><i style="background:#3A3F4B"></i>Schwarzgeld '+kfmt(p.dirty)+' €</span>':'')+'</div></section>';
  // Inflation
  h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Inflation</h2><b class="up" style="font-size:22px">'+pc1(curInfl())+'</b></div>'+bars(p.econ.infl.slice(-12))+
    '<div class="kv2"><div><small>Seit deiner Geburt</small><b>+'+Math.round((born-1)*100)+' %</b><small>teurer</small></div><div><small>Ein Kaffee</small><b>'+(3*born).toFixed(2).replace('.',',')+' €</b><small>heute</small></div></div>'+
    '<p class="note">Mieten, Lebensstil, Personal und Behandlungen werden jedes Jahr um die Inflation teurer. Gehälter steigen mit. Geld auf dem Konto bringt keine Zinsen und verliert so jedes Jahr an Wert.</p></section>';
  if(minor)return h+card('','<p class="note">Sparkonto, Festgeld und Kredite gibt es ab 18 Jahren.</p>');
  // Sparkonto
  h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Sparkonto</h2><b class="up">'+pc1(R2.konto)+' Zinsen</b></div><div class="bigv"><b>'+eur(p.sav)+'</b><span class="note">täglich verfügbar</span></div><div class="btns">'+btn('dep',1,'1.000 € einzahlen')+btn('dep','all','Alles einzahlen','g')+btn('wd',1,'1.000 € abheben')+btn('wd','all','Alles abheben','g')+'</div></section>';
  // Festgeld
  const fa=bankUI.fgA==='all'?Math.max(0,Math.floor(p.money)):bankUI.fgA,fr=R2[bankUI.fgT],fe=Math.round(fa*Math.pow(1+fr/100,bankUI.fgT));
  h+='<section class="card"><h2 class="h">Festgeld</h2><p class="note">Mehr Zinsen als auf dem Sparkonto. Dafür kommst du erst nach der Laufzeit ohne Verlust an dein Geld. Wer früher kündigt, zahlt 3 % Gebühr und verliert die Zinsen.</p>'+
    '<div class="seg full" style="margin:10px 0">'+[1,3,5].map(t=>'<button data-a="fgterm" data-g="'+t+'" aria-pressed="'+(bankUI.fgT===t)+'">'+t+' J. · '+pc1(R2[t])+'</button>').join('')+'</div>'+
    '<div class="amts">'+[1000,10000,50000,100000,'all'].map(v=>'<button class="amt" data-a="fgamt" data-g="'+v+'" aria-pressed="'+(bankUI.fgA===v||String(bankUI.fgA)===String(v))+'">'+(v==='all'?'Alles':kfmt(v)+' €')+'</button>').join('')+'</div>'+
    '<p class="note" style="margin:8px 0">'+eur(fa)+' für '+bankUI.fgT+' Jahr(e): danach etwa <b>'+eur(fe)+'</b>, wenn die Zinsen bleiben.</p>'+btn('fgopen',null,'Festgeld anlegen','o',fa<100||p.money<fa)+
    (p.fg.length?'<div style="margin-top:10px">'+p.fg.map((f,i)=>row(eur(f.amt),pc1(f.rate)+' · noch '+f.left+' Jahr(e)',btn('fgbreak',i,'Kündigen','g'))).join('')+'</div>':'')+'</section>';
  // Kredit
  const ml=maxLoan(),ka=Math.min(bankUI.krA==='max'?ml:bankUI.krA,ml),kr=loanRate(),kl=ka>0?mkLoan(ka,kr,bankUI.krT):null;
  h+='<section class="card"><div class="listseg"><div class="lbl">BONITÄT</div><b class="'+(b>=60?'up':b>=40?'':'down')+'">'+bonTxt(b)+'</b></div><div class="bar" style="margin:6px 0 12px"><i style="width:'+b+'%"></i></div>'+
    '<div class="seg full">'+[2,3,5].map(t=>'<button data-a="krterm" data-g="'+t+'" aria-pressed="'+(bankUI.krT===t)+'">'+t+' Jahre</button>').join('')+'</div>'+
    '<div class="amts" style="margin-top:10px">'+[5000,10000,25000,100000,'max'].map(v=>'<button class="amt" data-a="kramt" data-g="'+v+'" aria-pressed="'+(String(bankUI.krA)===String(v))+'"'+(v!=='max'&&v>ml?' disabled':'')+'>'+(v==='max'?'Maximum':kfmt(v)+' €')+'</button>').join('')+'</div>'+
    '<div class="bigv" style="margin-top:10px"><b>'+eur(ka)+'</b><span class="note">möglich bis '+eur(ml)+'</span></div>'+
    '<div class="kv2"><div><small>Zins</small><b>'+pc1(kr)+'</b></div><div><small>Rate im Jahr</small><b>'+(kl?eur(kl.pay):'–')+'</b></div></div>'+
    (kl?'<p class="warn">Der Kredit kostet dich insgesamt '+eur(kl.pay*bankUI.krT-ka)+' Zinsen. Leih dir nur Geld, das du wirklich brauchst. Platzt eine Rate, sinkt deine Bonität.</p>':'')+btn('kropen',null,'Kredit aufnehmen','o',!kl||ka<1000||p.prison)+
    (p.loans.length?'<div style="margin-top:10px">'+p.loans.map((l,i)=>row('Kredit '+(i+1)+': noch '+eur(l.amt),pc1(l.rate)+' · '+eur(l.pay)+' im Jahr · '+l.left+' Jahr(e)','<span class="btns" style="margin:0">'+btn('krrepay',i+':5000','−5.000 €','g',p.money<1)+btn('krrepay',i+':all','Ablösen','g',p.money<l.amt)+'</span>')).join('')+'</div>':'')+'</section>';
  // Leitzins
  h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Leitzins</h2><b style="font-size:22px">'+pc1(curLz())+'</b></div>'+lineSvg(p.econ.lz.slice(-12),90,true,'neu')+
    row('Sparkonto','täglich frei','<b class="num up">'+pc1(R2.konto)+'</b>')+row('Festgeld 1 Jahr','','<b class="num up">'+pc1(R2[1])+'</b>')+row('Festgeld 3 Jahre','','<b class="num up">'+pc1(R2[3])+'</b>')+row('Festgeld 5 Jahre','','<b class="num up">'+pc1(R2[5])+'</b>')+row('Kredit für dich','','<b class="num down">'+pc1(kr)+'</b>')+'</section>';
  // Depot
  const held=STOCKS.filter(s=>(p.sh[s.id]||0)*p.px[s.id]>=1);
  if(held.length)h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Depot</h2>'+btn('goto','boerse','Zur Börse','g')+'</div><b class="bignum">'+eur(stockVal())+'</b>'+held.map(s=>row(s.n,'','<b class="num">'+eur(p.sh[s.id]*p.px[s.id])+'</b>')).join('')+'</section>';
  // Feste Kosten
  const fk=fixedCosts(),fks=fk.reduce((s,x)=>s+x[1],0);
  h+='<section class="card"><button class="fkhead" data-a="fktoggle"><span><b>Feste Kosten pro Jahr</b><small>'+fk.length+' Posten</small></span><b class="down">'+eur(fks)+'</b><svg class="i" viewBox="0 0 24 24" aria-hidden="true" style="transform:rotate('+(bankUI.fk?180:0)+'deg)"><path d="M6 9l6 6 6-6"/></svg></button>'+(bankUI.fk?fk.map(x=>'<div class="mrow"><span>'+esc(x[0])+'</span><b>'+eur(x[1])+'</b></div>').join(''):'')+'</section>';
  // Einnahmen & Ausgaben
  if(p.fin.length){const yrs=p.fin.slice(-6).reverse(),sel=yrs.find(y=>y.a===bankUI.yr)||yrs[0];
    h+='<section class="card"><h2 class="h">Einnahmen und Ausgaben</h2><div class="amts">'+yrs.map(y=>'<button class="amt" data-a="finyr" data-g="'+y.a+'" aria-pressed="'+(y===sel)+'">mit '+y.a+'</button>').join('')+'</div>'+
      '<div class="mbox" style="margin-top:10px"><div class="mt">Eingenommen</div>'+(sel.inc.map(x=>'<div class="mrow"><span>'+x[0]+'</span><b class="up">+'+eur(x[1])+'</b></div>').join('')||'<div class="mrow"><span>nichts</span></div>')+
      '<div class="mt">Ausgegeben</div>'+(sel.out.map(x=>'<div class="mrow"><span>'+x[0]+'</span><b class="down">−'+eur(x[1])+'</b></div>').join('')||'<div class="mrow"><span>nichts</span></div>')+'</div></section>'}
  return h;
}

