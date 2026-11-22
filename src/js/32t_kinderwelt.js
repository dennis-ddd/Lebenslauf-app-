/* ================= Kinderwelt: Spielzeugkiste (0–5), Schulranzen (6 bis zum ersten Handy), Ereignis „Erstes Handy“ ================= */
function kidMode(){if(!p||!p.alive||p.prison||O.kidOff)return null;if(p.age<6)return 'kiste';if(p.age<13&&!p.kph&&phoneTier()===0)return 'ranzen';return null}
const KIDT={
  kiste:[['teddy','Ich','leben'],['familie','Familie','familie'],['kloetze','Spielen','freizeit'],['funk','Funkgerät','chats'],['sticker','Sticker','erfolge'],['sparschwein','Sparschwein','spar']],
  ranzen:[['heft','Hausaufgaben','kalender'],['funk','Funkgerät','chats'],['sparschwein','Sparschwein','spar'],['maeppchen','Schule','bildung'],['teddy','Ich','leben'],['familie','Familie','familie'],['fussball','Freizeit','freizeit'],['fahrrad','Stadt','stadt'],['sticker','Erfolge','erfolge']]};
const kimg=(k,c)=>'<img class="'+(c||'')+'" src="'+KIMG[k]+'" alt="" draggable="false">';
const pocketM=()=>p.age<6?0:p.age<10?5:p.age<14?15:30;
const SPARA=['spar','Sparschwein',0x2B6E6E,'<ellipse cx="11" cy="13" rx="8" ry="6"/><path d="M19 12h2v3h-2M8 7.5l1-3 2.5 2M10 9h4"/>','linear-gradient(135deg,#3E8587,#1F4F5E)'];
function ensSpar(){if(!APP.spar)APP.spar=SPARA}
function viewKid(m){
  const T=KIDT[m].filter(t=>t[2]==='spar'||appVisible(t[2])),used=T.map(t=>t[2]);
  const last=p.log.filter(e=>!e.t.startsWith('Jahresbilanz')).slice(-1)[0];
  const more=orderedApps().filter(a=>appVisible(a[0])&&!used.includes(a[0])&&!(p.prison&&!PRISON_APPS.includes(a[0])));
  const day=['Mo','Di','Mi','Do','Fr'],dn=(p.age+(p.seed||0))%5;
  return '<section class="phone kidw '+m+'">'+
    (m==='ranzen'?'<div class="kwplan">'+day.map((d,i)=>'<span'+(i===dn?' class="now"':'')+'>'+d+'</span>').join('')+'</div>':'')+
    '<div class="kwhero">'+kimg(m)+'<div class="kwht"><b>'+(m==='kiste'?'Spielzeugkiste':'Schulranzen')+'</b><span>'+(m==='kiste'?'Tippe auf etwas, um damit zu spielen.':'Alles, was später das Handy kann. Mit 10 bis 12 gibt es dein erstes Handy.')+'</span><button class="kwchip" data-a="goto" data-g="spar">'+kimg('sparschwein')+eur(p.money)+'</button></div></div>'+
    '<div class="rings">'+Object.keys(STAT).map(k=>'<div class="rw"><div class="ring" style="--v:'+p.st[k]+'"><b>'+p.st[k]+'</b></div><small>'+STAT[k]+'</small></div>').join('')+'</div>'+
    (last?'<button class="news" data-a="goto" data-g="leben"><small>Neuigkeit · Alter '+last.a+'</small>'+esc(last.t)+'</button>':'')+
    '<div class="kwgrid">'+T.map(([img,n,id])=>{const b=id==='spar'?0:badgeOf(id);return '<button class="kwi" data-a="goto" data-g="'+id+'">'+kimg(img)+'<span>'+n+'</span>'+(b?'<i class="kwb">'+b+'</i>':'')+'</button>'}).join('')+'</div>'+
    (more.length?'<div class="kwmore"><small>Mehr</small><div>'+more.map(([id,n,c,ic,bg])=>{const b=badgeOf(id);return '<button class="kwm" data-a="goto" data-g="'+id+'" aria-label="'+esc(n)+'"><span class="ic" style="background:'+(bg||hex(c))+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+ic+'</svg>'+(b?'<span class="badge">'+b+'</span>':'')+'</span><em>'+n+'</em></button>'}).join('')+'</div></div>':'')+
    '</section>';
}
{const _vh=viewHome;viewHome=function(){ensSpar();const m=kidMode();return m?viewKid(m):_vh()}}
function viewSpar(){
  const goals=SHOP.filter(s=>s.min<=Math.max(p.age+4,8)&&s.pr<=3000&&!p.items.includes(s.id)).sort((a,b)=>a.pr-b.pr).slice(0,4);
  const g=SHOP.find(s=>s.id===p.sgoal&&!p.items.includes(s.id));
  let h='<section class="card kwspar">'+kimg('sparschwein','kwpig')+'<div class="kwsum">'+eur(p.money)+'</div><p class="note">'+(p.age<6?'Taschengeld gibt es ab 6 Jahren. Bis dahin landen Geschenke von Oma und Opa hier.':'Taschengeld: '+eur(pocketM())+' pro Monat'+(p.age<18?', die Eltern zahlen es einmal im Jahr aus.':'.'))+'</p>';
  if(g){const pc=clamp(Math.round(p.money/g.pr*100),0,100);
    h+='<div class="kwgoal"><b>Sparziel: '+esc(g.n)+'</b><small>'+eur(Math.min(p.money,g.pr))+' von '+eur(g.pr)+(p.age<g.min?' · erlaubt ab '+g.min+' Jahren':'')+'</small><div class="bar"><i style="width:'+pc+'%"></i></div>'+
      (pc>=100&&p.age>=g.min?btn('buy',g.id,'Jetzt kaufen','o'):'')+'</div>'}
  h+='</section>';
  if(goals.length)h+=card(g?'Anderes Sparziel':'Wofür sparst du?',goals.map(s=>row(s.n,eur(s.pr)+(p.age<s.min?' · ab '+s.min+' Jahren':''),btn('sgoal',s.id,p.sgoal===s.id?'Gewählt':'Wählen',p.sgoal===s.id?'g':'o',p.sgoal===s.id))).join(''));
  return h;
}
{const _va=viewApp;viewApp=function(id){
  let h;
  if(id==='spar'){const A=APP.spar;h='<div class="appbar"><button class="back pill" data-a="goto" data-g="home" aria-label="Zurück zum Handy"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>Handy</span></button><span class="ic" style="background:'+A[4]+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+A[3]+'</svg></span><h2>'+A[1]+'</h2><span class="chip" style="margin-left:auto">'+akt(p.act)+'</span></div>'+viewSpar()}
  else h=_va(id);
  const m=kidMode();if(m){const l=m==='kiste'?'Kiste':'Ranzen';h=h.replace('aria-label="Zurück zum Handy"','aria-label="Zurück zum '+(m==='kiste'?'Spielzeugkiste':'Schulranzen')+'"').replace('<span>Handy</span>','<span>'+l+'</span>')}
  return h}}
function act21(id,arg){switch(id){
  case 'sgoal':if(!SHOP.some(s=>s.id===arg))return 1;p.sgoal=arg;toast('Neues Sparziel: '+SHOP.find(s=>s.id===arg).n);render();return 1;
  }return 0}
{const f=act;act=function(id,arg){ensSpar();if(act21(id,arg))return;return f(id,arg)}}
/* Erstes Handy */
QEV.k_handy=()=>E('Dein erstes Handy?',parentN()+' legt eine kleine Schachtel auf den Tisch: „Du bist jetzt alt genug für ein eigenes Handy. Aber erst mal ein Kinderhandy, okay?“',()=>!p.kph&&phoneTier()===0&&p.age>=10&&p.age<13,[
  ['Kinderhandy, super!',()=>{p.kph=1;p.phoneY=p.age;add('gl',4);mile('Erstes Handy','star');if(typeof kmem==='function')kmem('Ich habe mein erstes Handy bekommen');return 'Dein erstes Handy! Ab jetzt findest du alles als Apps auf dem Handy. Der Ranzen bleibt für die Schule.'}],
  ['Ich will ein richtiges Smartphone',()=>{p.kph=1;p.phoneY=p.age;mile('Erstes Handy','star');if(ch(.4)){p.items.push('handy');add('gl',6);return parentN()+' gibt nach: Du bekommst ein echtes Smartphone. Pass gut darauf auf!'}add('gl',-2);return parentN()+' bleibt hart: „Erst mal das Kinderhandy, dann sehen wir weiter.“ Besser als nichts.'}],
  ['Brauche ich noch nicht',()=>{p.kphNo=p.age;add('in',1);return 'Okay. '+parentN()+' fragt nächstes Jahr noch mal. Bis dahin bleibt alles im Schulranzen.'}]]);
{const _py=perkYear;perkYear=function(R0){_py(R0);try{
  if(!p||p.prison)return;p.kseen=p.kseen||{};
  if(p.age===6&&!p.kseen.ranzen&&!O.kidOff){p.kseen.ranzen=1;log('Aus der Spielzeugkiste wird ein Schulranzen. Alles Wichtige steckt jetzt darin.')}
  if(!p.kph&&phoneTier()===0&&p.age>=10&&p.age<=12&&!p.kseen['kh'+p.age]&&(p.age===12||ch(.5))){p.kseen['kh'+p.age]=1;p.q.push({id:'k_handy'})}
  if(!p.kph&&phoneTier()===0&&p.age>=13){p.kph=1;p.phoneY=p.age;log('Mit 13 bekommst du endlich ein eigenes Handy.');mile('Erstes Handy','star')}
  }catch(e){}}}
{const _ve=viewEinst;viewEinst=function(){return _ve()+'<section class="card tgs"><h2 class="h">Kindheit</h2>'+tog('kidOff',!!O.kidOff,'Normales Handy auch als Kind','Statt Spielzeugkiste und Schulranzen gleich die Apps zeigen')+'</section>'}}
