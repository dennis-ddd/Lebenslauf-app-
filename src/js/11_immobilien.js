/* ================= Immobilien-Investments ================= */
const PT={wohnung:{n:'Eigentumswohnung',u:1,b:180000,gl:3,sl:5,bld:['solar','fassade'],ic:'<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4"/>'},
haus:{n:'Einfamilienhaus',u:1,b:420000,gl:5,sl:8,bld:['dach','anbau','solar','fassade'],ic:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'},
laden:{n:'Ladenlokal',u:1,b:350000,gl:0,sl:0,com:1,bld:['fassade','solar'],ic:'<path d="M4 10h16l-1-5H5zM5 10v9h14v-9M9 19v-5h6v5"/>'},
buero:{n:'Büroetage',u:4,b:900000,gl:0,sl:0,com:1,bld:['aufstock','solar','fassade'],ic:'<rect x="4" y="3" width="10" height="18" rx="1"/><path d="M14 9h5a1 1 0 0 1 1 1v11H14M7 7h4M7 11h4M7 15h4"/>'},
mfh:{n:'Mehrfamilienhaus',u:8,b:1600000,gl:4,sl:9,bld:['dach','aufstock','anbau','solar','fassade'],ic:'<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M7 7h2M11 7h2M15 7h2M7 11h2M11 11h2M15 11h2M7 15h2M15 15h2M11 21v-5h2v5"/>'},
flaeche:{n:'Baugrundstück',u:0,b:150000,gl:0,sl:0,land:1,bld:[],ic:'<path d="M3 20h18M5 20l3-8h8l3 8M12 4v8M9 7l3-3 3 3"/>'}};
const DIST=[['Altstadt',1.3,.035],['Seeviertel',1.6,.045],['Neubaugebiet',1,.03],['Südstadt',.8,.02],['Hafen',1.1,.05],['Vorstadt',.9,.025]];
const TEN={zuv:['Zuverlässig',.9,.02,0],norm:['Normal',1,.06,1],schw:['Schwierig',1.15,.18,3]};
const TN_RES=['Familie Novak','Eine Studenten-WG','Ein junges Paar','Rentnerin Hilde','Familie Yilmaz','Ein Lehrer','Eine Pflegerin','Familie Costa','Ein Musiker'];
const TN_COM=['Ein Start-up','Eine Arztpraxis','Ein Steuerbüro','Ein Café','Eine Werbeagentur','Ein Friseursalon','Eine Anwaltskanzlei'];
const BLD={dach:['Dachgeschoss ausbauen','Aus dem Speicher werden Zimmer mit Dachfenstern.',.06,1,8,10,2,1],aufstock:['Aufstockung','Ein ganzes Stockwerk mehr.',.12,2,15,0,0,2],
anbau:['Anbau','Mehr Fläche zur Seite raus.',.09,1,10,6,1,1],solar:['Solaranlage','Strom vom eigenen Dach. Mieter zahlen gern etwas mehr.',.02,1,3,3,1,0],fassade:['Neue Fassade','Neuer Putz in deiner Farbe. Sieht aus wie neu.',.015,1,2,0,1,0]};
const COLORS=[['Weiß','#F4F2EE'],['Hellgrau','#C9CDD4'],['Ocker','#D9A441'],['Ziegelrot','#B4533B'],['Anthrazit','#3A3F4B']];
const USES=[['self','Selbst wohnen'],['rent','Vermieten'],['versteck','Versteck'],['lager','Lager'],['leer','Leer']];
const LANDB={haus:[300000,2],mfh:[1400000,3],buero:[800000,2]};
let propSel=null,fassCol=0;
const propVal=pr=>Math.round(pr.val*(.7+.3*pr.cond/100));
function unitRent(pr){const T=PT[pr.t];return pr.val*.045/Math.max(1,pr.units)*(.75+.25*pr.cond/100)*(1+.15*(pr.lvl-1))*pr.rb*(T.com?1.1:1)}
function mkTenant(pr,r){const T=PT[pr.t],k=r()<.35?'zuv':r()<.75?'norm':'schw';return {n:pick2(r,T.com?TN_COM:TN_RES),k,rent:Math.round(unitRent(pr)*TEN[k][1]),y:0}}
function listings(){const r=rng(p.seed%100000+p.age*977),L=[];const keys=['wohnung','wohnung','haus','haus','laden','buero','mfh','flaeche','flaeche'];
  for(let i=0;i<6;i++){const t=pick2(r,keys),d=Math.floor(r()*DIST.length),D=DIST[d];const val=Math.round(PT[t].b*D[1]*p.econ.idx*(.85+r()*.3)/1000)*1000;
    const cond=PT[t].land?100:R0i(r,55,100);L.push({id:p.age+'-'+i,t,d,val,cond,price:Math.round(val*(.7+.3*cond/100)/1000)*1000,occ:PT[t].land?0:r()})}
  return L.filter(x=>!(p.boughtL||[]).includes(x.id))}
function R0i(r,a,b){return a+Math.floor(r()*(b-a+1))}
const propName=pr=>{const d=DIST[pr.d][0];return PT[pr.t].n+' '+(d==='Hafen'?'am ':['Altstadt','Südstadt','Vorstadt'].includes(d)?'in der ':'im ')+d};
function rentIncome(){return (p.props||[]).reduce((s,pr)=>s+(pr.use==='rent'?pr.ten.reduce((t,x)=>t+x.rent,0):0),0)}
function propsValue(){return (p.props||[]).reduce((s,pr)=>s+propVal(pr),0)}
function setEigenHome(pr){const T=PT[pr.t];HOMES.eigen={n:propName(pr),ar:'Dein eigenes '+T.n.replace('Eigentumswohnung','Zuhause'),c:Math.round(pr.val*.006/p.econ.idx),gl:T.gl+pr.lvl+(pr.bd.fassade?1:0),sl:T.sl+(pr.bd.anbau?2:0)+(pr.bd.dach?1:0),min:18}}
function propYear(){const out={rent:0,cost:0};if(!p.props)return out;const infl=curInfl();
  p.props.forEach(pr=>{const D=DIST[pr.d];
    // Bauaufträge
    pr.jobs=pr.jobs.filter(j=>{if(p.age<j.done)return true;
      if(j.k==='san'){pr.lvl++;pr.val=Math.round(pr.val*1.2);pr.cond=100;pr.rb*=1;log('Sanierung fertig: '+propName(pr)+' ist jetzt Stufe '+pr.lvl+'.')}
      else if(j.k.startsWith('land_')){const t=j.k.slice(5);pr.t=t;pr.units=PT[t].u;pr.val=Math.round(pr.val+j.cost*1.15);pr.cond=100;log('Bau fertig: '+propName(pr)+'.')}
      else{const B=BLD[j.k];pr.bd[j.k]=1;pr.val=Math.round(pr.val*(1+B[4]/100));pr.rb*=1+B[5]/100;if(B[7]&&pr.t==='mfh'||B[7]&&pr.t==='buero')pr.units+=B[7];if(j.k==='fassade')pr.col=j.col;log(B[0]+' fertig: '+propName(pr)+'. Die neue Miete gilt ab dem nächsten Jahr.')}
      pr.reprice=true;return false});
    // Wert und Zustand
    pr.val=Math.round(pr.val*(1+D[2]+(Math.random()*.08-.03)+infl/100*.6));
    pr.cond=clamp(pr.cond-R(2,5)*(p.staff&&p.staff.haus?.5:1)-(pr.use==='rent'?pr.ten.filter(x=>x.k==='schw').length:0),20,100);
    const up=Math.round(pr.val*.008);out.cost+=up;
    if(pr.use==='rent'){pr.ten=pr.ten.filter(x=>{x.y++;if(ch(TEN[x.k][2])){if(x.k==='schw'&&ch(.5)){const dmg=Math.round(x.rent*.5*(p.staff&&p.staff.haus?.5:1));out.cost+=dmg;log(x.n+' hat in deinem '+PT[pr.t].n+' Schaden angerichtet: '+eur(dmg)+'.')}else log(x.n+' hat die Miete nicht gezahlt.');return true}
        out.rent+=Math.round(x.rent*(pr.jobs.length?.85:1));if(x.y>2&&ch(.1)){log(x.n+' ist ausgezogen.');return false}return true})}
    if(pr.reprice){pr.ten.forEach(x=>x.rent=Math.round(unitRent(pr)*TEN[x.k][1]));pr.reprice=false}
    if(pr.use==='self')setEigenHome(pr);});
  p.money+=out.rent-out.cost;return out;
}
function viewImmo(){const lock=!!p.prison;
  if(propSel!=null){const pr=p.props.find(x=>x.id===propSel);if(pr)return viewProp(pr,lock);propSel=null}
  let h='';const tv=propsValue(),ri=rentIncome(),bought=(p.props||[]).reduce((s,x)=>s+x.paid,0);
  h+='<div class="bizsum"><div><b>'+kfmt(tv)+' €</b><small>'+(p.props.length)+' Objekt(e) · '+(tv>=bought?'+':'−')+kfmt(Math.abs(tv-bought))+' € seit Kauf</small></div><div><b class="up">'+kfmt(ri)+' €</b><small>Mieteinnahmen im Jahr</small></div></div>';
  if(p.props.length)h+=p.props.map(pr=>{const T=PT[pr.t],occ=pr.units?pr.ten.length/pr.units:0,v=propVal(pr);
    return '<button class="card prow" data-a="prop" data-g="'+pr.id+'"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+T.ic+'</svg></span><span class="pt"><b>'+propName(pr)+'</b><small>'+(pr.jobs.length?'Baustelle · ':'')+(T.land?'unbebaut':pr.use==='rent'?pr.ten.length+' von '+pr.units+' vermietet':USES.find(u=>u[0]===pr.use)[1])+'</small>'+(T.land?'':'<span class="occ"><i style="width:'+occ*100+'%"></i></span>')+'</span><span class="pv"><b>'+kfmt(v)+' €</b><small class="'+(v>=pr.paid?'up':'down')+'">'+(v>=pr.paid?'+':'−')+kfmt(Math.abs(v-pr.paid))+' €</small></span></button>'}).join('');
  else h+=card('','<p class="note">Du besitzt noch keine Immobilien. Kauf eine Wohnung, ein Haus oder ein Grundstück, vermiete sie und lass den Wert wachsen.</p>');
  h+='<h3 class="sec">Auf dem Markt</h3>'+(p.age<18?card('','<p class="note">Immobilien kaufen kannst du ab 18 Jahren.</p>'):listings().map(L=>{const T=PT[L.t],D=DIST[L.d];
    return '<section class="card"><div class="fh"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+T.ic+'</svg></span><div><div class="lbl">'+D[0].toUpperCase()+'</div><b>'+T.n+'</b><small>'+(T.land?'Baugrund, bereit für ein Haus, Mehrfamilienhaus oder Büros':T.u+' Einheit(en) · Zustand '+L.cond+' % · '+Math.round(L.occ*T.u)+' vermietet')+'</small></div></div>'+
      '<div class="tags"><span class="tag g">Wertzuwachs ~'+Math.round(D[2]*100)+' %/Jahr</span>'+(T.land?'':'<span class="tag">Miete ~'+kfmt(L.val*.045)+' €/Jahr</span>')+'</div><div class="fb"><b>'+eur(L.price)+'</b>'+btn('buyprop',L.id,'Kaufen','o',p.money<L.price||lock)+'</div></section>'}).join('')+'<p class="note" style="text-align:center">Jedes Jahr kommen neue Angebote.</p>');
  return h;
}
function viewProp(pr,lock){const T=PT[pr.t],v=propVal(pr),busy=pr.jobs.length>0;
  let h='<button class="btn g sm" data-a="prop" data-g="">← Alle Immobilien</button><section class="card"><div class="fh"><span class="fic sm"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+T.ic+'</svg></span><div><div class="lbl">'+DIST[pr.d][0].toUpperCase()+'</div><b>'+propName(pr)+'</b>'+(pr.col!=null?'<small>Fassade: '+COLORS[pr.col][0]+'</small>':'')+'</div></div>'+
    '<div class="kv2"><div><small>Wert</small><b>'+kfmt(v)+' €</b><small class="up">gekauft für '+kfmt(pr.paid)+' €</small></div><div><small>Ausbau</small><b>'+(T.land?'–':pr.lvl+' von 3')+'</b><small class="'+(pr.cond>=70?'up':'down')+'">Zustand '+Math.round(pr.cond)+' %</small></div></div></section>';
  if(T.land){h+=card('Bebauen','<p class="note" style="margin-bottom:6px">Auf deinem Grundstück kannst du bauen lassen. Danach kannst du es vermieten oder selbst einziehen.</p>'+(busy?row('Baustelle','fertig, wenn du '+pr.jobs[0].done+' bist'):Object.keys(LANDB).map(k=>{const c=px$(LANDB[k][0]);return row(PT[k].n,LANDB[k][1]+' Jahre Bauzeit · '+PT[k].u+' Einheit(en)',btn('landbuild',k,eur(c),'o',p.money<c||lock))}).join('')));
    return h+'<button class="btn g big sell" data-a="sellprop">Verkaufen für '+eur(v*.97)+'</button>'}
  h+='<h3 class="sec">Nutzung</h3><div class="amts">'+USES.map(([k,l])=>'<button class="amt" data-a="propuse" data-g="'+k+'" aria-pressed="'+(pr.use===k)+'"'+(k==='self'&&(T.com||p.age<18)?' disabled':'')+'>'+l+'</button>').join('')+'</div><p class="note" style="margin-top:6px">'+
    ({self:'Du wohnst selbst hier, ohne Miete. Komfort hängt von Haus und Ausbau ab.',rent:'Mieter zahlen jedes Jahr. Zuverlässige zahlen etwas weniger, schwierige mehr, dafür fällt die Miete öfter aus und es gibt Schäden.',versteck:'Hier lagert dein Schwarzgeld. Bei einer Razzia wird nur halb so viel beschlagnahmt.',lager:'Lagerraum für deine Geschäfte: +10 % Gewinn in allen Läden.',leer:'Steht leer. Kostet nur Unterhalt.'})[pr.use]+'</p>';
  if(pr.use==='rent'){const free=pr.units-pr.ten.length;
    h+='<h3 class="sec">Mieter · '+pr.ten.length+' von '+pr.units+'</h3>'+pr.ten.map((x,i)=>'<section class="card trow"><span class="cav" style="background:'+(x.k==='zuv'?'#1E9E6A':x.k==='schw'?'#D9483B':'#5B7CE6')+'">'+esc(x.n.split(' ').pop()[0])+'</span><div class="ct"><b>'+esc(x.n)+'</b><small>'+TEN[x.k][0]+' · '+eur(x.rent)+'/Jahr · seit '+x.y+' Jahr(en)</small></div>'+btn('evict',i,'Kündigen','g')+'</section>').join('');
    if(free>0){const r=rng(pr.id*13+p.age);const apps=[0,1,2].map(()=>mkTenant(pr,r));
      h+=card('Freie Einheit · Bewerbungen',apps.map((x,i)=>row(esc(x.n),TEN[x.k][0]+' · '+eur(x.rent)+' im Jahr · Ausfallrisiko '+Math.round(TEN[x.k][2]*100)+' %',btn('tenant',i,'Einziehen lassen','o',lock))).join(''))}}
  // Pflege
  const rc=Math.round(pr.val*(100-pr.cond)/100*.15);
  h+='<h3 class="sec">Pflege</h3>'+card('',row('Reparieren','Zustand '+Math.round(pr.cond)+' % auf 100 %. Verfall drückt Wert und Miete.',btn('repair',null,eur(rc),'o',pr.cond>=99||p.money<rc||lock))+
    (pr.lvl<3?row('Sanieren auf Stufe '+(pr.lvl+1),'Neue Bäder, Böden, Fenster: +20 % Wert, +15 % Miete. Dauert 1 Jahr.',btn('sanieren',null,eur(pr.val*.25*pr.lvl),'o',busy&&pr.jobs.some(j=>j.k==='san')||p.money<pr.val*.25*pr.lvl||lock)):row('Voll saniert','Stufe 3 erreicht','')));
  // Bauaufträge
  const running=pr.jobs.map(j=>row(j.k==='san'?'Sanierung':BLD[j.k][0],'fertig, wenn du '+j.done+' bist (noch '+(j.done-p.age)+' Jahr(e)) · während der Bauzeit −15 % Miete, neue Miete ab dem Jahr danach','<span class="chip">Baustelle</span>')).join('');
  const doneB=Object.keys(pr.bd).map(k=>'<span class="tag g">✓ '+BLD[k][0]+'</span>').join('');
  h+='<h3 class="sec">Bauaufträge</h3>'+(running?card('',running):'')+(doneB?'<div class="tags">'+doneB+'</div>':'');
  h+=T.bld.filter(k=>!pr.bd[k]&&!pr.jobs.some(j=>j.k===k)).map(k=>{const B=BLD[k],c=Math.round(pr.val*B[2]);
    return '<section class="card"><b style="font-size:16px">'+B[0]+'</b><p class="note" style="margin:2px 0 8px">'+B[1]+'</p><div class="tags" style="margin:0 0 10px"><span class="tag">'+B[3]+' Jahr(e)</span><span class="tag g">+'+B[4]+' % Wert</span>'+(B[5]?'<span class="tag g">+'+B[5]+' % Miete</span>':'')+(B[6]?'<span class="tag">+'+B[6]+' Glück</span>':'')+(B[7]&&(pr.t==='mfh'||pr.t==='buero')?'<span class="tag">+'+B[7]+' Einheit(en)</span>':'')+'</div>'+
      (k==='fassade'?'<div class="amts" style="margin-bottom:10px">'+COLORS.map((c,i)=>'<button class="amt colb" data-a="fasscol" data-g="'+i+'" aria-pressed="'+(fassCol===i)+'"><i style="background:'+c[1]+'"></i>'+c[0]+'</button>').join('')+'</div>':'')+
      btn('build',k,'Beauftragen für '+eur(c)+', fertig mit '+(p.age+B[3]),'o',p.money<c||lock)+'</section>'}).join('');
  return h+'<button class="btn g big sell" data-a="sellprop">Verkaufen für '+eur(v*.97)+'</button>';
}
function act3(id,arg){const pr=propSel!=null&&p.props?p.props.find(x=>x.id===propSel):null;
  switch(id){
  case 'prop':propSel=arg?+arg:null;render();window.scrollTo(0,0);return 1;
  case 'buyprop':{const L=listings().find(x=>x.id===arg);if(!L||p.money<L.price||p.age<18||p.prison)return 1;p.money-=L.price;(p.boughtL=p.boughtL||[]).push(L.id);
    const nid=R(1,1e9),T=PT[L.t],np={id:nid,t:L.t,d:L.d,val:L.val,paid:L.price,cond:L.cond,lvl:1,units:T.u,rb:1,ten:[],use:T.land?'leer':'rent',bd:{},jobs:[],col:null};
    const r=rng(nid);const n=Math.round(L.occ*T.u);for(let i=0;i<n;i++)np.ten.push(mkTenant(np,r));p.props.push(np);propSel=nid;ach('haus');done(propName(np)+' gekauft.');return 1}
  case 'propuse':{if(!pr)return 1;if(arg==='self'){if(PT[pr.t].com||p.age<18)return 1;p.props.forEach(x=>{if(x.use==='self')x.use='leer'});setEigenHome(pr);p.home='eigen';if(pr.ten.length){log('Deine Mieter in '+propName(pr)+' mussten ausziehen.');pr.ten=[]}}
    else if(pr.use==='self'){p.home=p.age>=18?'wg':'eltern'}
    if(arg!=='rent'&&pr.ten.length&&arg!=='self'){pr.ten=[];log('Alle Mieter in '+propName(pr)+' sind ausgezogen.')}
    pr.use=arg;done(propName(pr)+': '+USES.find(u=>u[0]===arg)[1]+'.');return 1}
  case 'tenant':{if(!pr||pr.ten.length>=pr.units)return 1;const r=rng(pr.id*13+p.age);const apps=[0,1,2].map(()=>mkTenant(pr,r));pr.ten.push(apps[+arg]);done(apps[+arg].n+' zieht ein.');return 1}
  case 'evict':{if(!pr)return 1;const x=pr.ten.splice(+arg,1)[0];if(x)done('Vertrag mit '+x.n+' gekündigt.');return 1}
  case 'repair':{if(!pr)return 1;const c=Math.round(pr.val*(100-pr.cond)/100*.15);if(p.money<c)return 1;p.money-=c;pr.cond=100;done('Repariert: Zustand 100 %.');return 1}
  case 'sanieren':{if(!pr||pr.lvl>=3||pr.jobs.some(j=>j.k==='san'))return 1;const c=Math.round(pr.val*.25*pr.lvl);if(p.money<c)return 1;p.money-=c;pr.jobs.push({k:'san',done:p.age+1});done('Sanierung beauftragt. Fertig, wenn du '+(p.age+1)+' bist.');return 1}
  case 'fasscol':fassCol=+arg;render();return 1;
  case 'build':{if(!pr)return 1;const B=BLD[arg],c=Math.round(pr.val*B[2]);if(pr.bd[arg]||p.money<c)return 1;p.money-=c;pr.jobs.push({k:arg,done:p.age+B[3],col:arg==='fassade'?fassCol:null});if(B[6])add('gl',B[6]);done(B[0]+' beauftragt. Fertig, wenn du '+(p.age+B[3])+' bist.');return 1}
  case 'landbuild':{if(!pr||!PT[pr.t].land||pr.jobs.length)return 1;const c=px$(LANDB[arg][0]);if(p.money<c)return 1;p.money-=c;pr.jobs.push({k:'land_'+arg,done:p.age+LANDB[arg][1],cost:c});done('Bau eines '+PT[arg].n+' beauftragt.');return 1}
  case 'sellprop':{if(!pr)return 1;const v=Math.round(propVal(pr)*.97);if(pr.use==='self')p.home=p.age>=18?'wg':'eltern';p.money+=v;p.props=p.props.filter(x=>x!==pr);propSel=null;done(propName(pr)+' für '+eur(v)+' verkauft.');return 1}
  }return 0;
}

