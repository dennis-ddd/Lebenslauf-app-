/* ================= Sichtbarer Besitz: Hausausbau, Auto, Firmenschild, Handy =================
   Jedes Upgrade kostet Geld und 1 Aktion, hat laufende Kosten oder Ersparnis und eine Wirkung pro Jahr.
   Sichtbar wird es über das Stadtmodell in der 3D-Stadt (siehe _a_stadtmodell). */
const UPG={
 anbau:{n:'Anbau mit Arbeitszimmer',pr:40000,yr:-1200,eff:'+1 Aktion pro Jahr',need:'haus'},
 pool:{n:'Garten mit Pool',pr:25000,yr:-800,eff:'Glück +2 pro Jahr',need:'haus'},
 solar:{n:'Solardach',pr:15000,yr:900,eff:'Strom vom eigenen Dach',need:'haus'},
 schild:{n:'Leuchtschild für die Firma',pr:8000,yr:-300,eff:'Ruf +1 pro Jahr, Firma +2 % Wert',need:'firma'}};
const upgOk=k=>UPG[k].need==='haus'?houseOwned():!!firmName();
const upgHas=k=>!!(p.upg&&p.upg[k]!=null&&upgOk(k));
function upgBuy(k){const U=UPG[k];if(!U||p.prison)return;p.upg=p.upg||{};if(p.upg[k]!=null&&upgOk(k)){toast('Hast du schon.');return}
  if(!upgOk(k)){toast(U.need==='haus'?'Dafür brauchst du ein eigenes Haus.':'Dafür brauchst du eine Firma.');return}
  const pr=px$(U.pr);if(p.money<pr){toast(U.n+' kostet '+eur(pr)+'.');return}if(!useAct())return;
  p.money-=pr;p.upg[k]=p.age;if(U.need==='haus')p.upgH=p.home;
  if(k==='anbau'&&!unl())p.act+=1;if(k==='pool')add('gl',3);if(k==='schild')addRuf(3);
  mile(U.n,'star');done(U.n+' fertig. Schau in der Stadt vorbei!')}
/* Jahreswirkung */
HOOK.on('year',()=>{if(!p||!p.upg)return;let sum=0;Object.keys(UPG).forEach(k=>{if(!upgHas(k))return;const U=UPG[k];sum+=px$(U.yr);
  if(k==='pool')add('gl',2);if(k==='anbau'&&!unl())p.act+=1;if(k==='schild'){addRuf(1);if(p.biz&&p.biz.firm&&p.biz.firm.val)p.biz.firm.val=Math.round(p.biz.firm.val*1.02)}});
  if(sum){p.money+=sum;log('Besitz: '+(sum>0?'Ersparnis ':'laufende Kosten ')+eur(Math.abs(sum))+' im Jahr.')}},40,'besitz');
/* Umzug: die Ausbauten bleiben im alten Haus und steigern dessen Wert beim Verkauf. */
HOOK.on('acted',id=>{if(!p||!p.upg||!p.upgH||p.upgH===p.home)return;const val=['anbau','pool','solar'].filter(k=>p.upg[k]!=null).reduce((s,k)=>s+px$(UPG[k].pr)*.6,0);
  if(val){p.upgV=p.upgV||{};p.upgV[p.upgH]=(p.upgV[p.upgH]||0)+Math.round(val);['anbau','pool','solar'].forEach(k=>delete p.upg[k]);log('Die Ausbauten bleiben im alten Zuhause und machen es '+eur(Math.round(val))+' wertvoller.')}p.upgH=null},30,'besitz-umzug');
HOOK.on('acted',(id,arg)=>{if(id==='sellhome'&&p&&p.upgV&&p.upgV[arg]&&!(p.owned||[]).includes(arg)){const v=p.upgV[arg];delete p.upgV[arg];p.money+=v;log('Ausbauten beim Verkauf: +'+eur(v)+'.');save();render()}},40,'besitz-verkauf');
/* ---------- Ansicht in der Stadt-App ---------- */
const NEXTPHONE=['handy','handy2','handy3'];
function besitzCard(){if(!p||!p.alive||p.age<10)return '';const lock=!!p.prison,m=cityModel();let h='<section class="card besitz"><h2 class="h">Dein Besitz</h2>';
  const own=houseOwned();
  if(own)['anbau','pool','solar'].forEach(k=>{const U=UPG[k],has=upgHas(k);h+=row(U.n,U.eff+' · '+(U.yr>0?'spart ':'kostet ')+eur(px$(Math.abs(U.yr)))+'/Jahr',has?'<span class="chip ok">Gebaut</span>':btn('upg',k,eur(px$(U.pr)),'o',lock||p.money<px$(U.pr)||p.act<=0))});
  else h+=row('Eigenes Haus','Mit Haus kannst du anbauen, einen Pool und ein Solardach bauen.',btn('goto','wohnen','Wohnen','g'));
  h+=row('Auto vor der Tür',m&&m.car?CARS[m.car].n+' · steht vor deinem Haus':'Noch kein Auto',btn('goto','garage','Garage','g'));
  const t=phoneTier(),nx=NEXTPHONE[t],S=nx&&SHOP.find(x=>x.id===nx);
  h+=row('Handy: '+PHONES[t][0],PHONES[t][2]+' App-Plätze'+(S?' · nächstes: '+S.n+' mit '+PHONES[t+1][2]+' Plätzen':' · bestes Modell'),S?btn('buy',nx,eur(S.pr),'o',lock||p.money<S.pr||p.age<S.min):'<span class="chip ok">Top</span>');
  if(firmName()){const U=UPG.schild,has=upgHas('schild');h+=row(U.n,'„'+esc(firmName())+'“ leuchtet über dem Büropark · '+U.eff,has?'<span class="chip ok">Hängt</span>':btn('upg','schild',eur(px$(U.pr)),'o',lock||p.money<px$(U.pr)||p.act<=0))}
  h+='<div class="btns">'+btn('upgshow',null,'In der 3D-Stadt ansehen','g')+'</div></section>';return h}
{const _va=viewApp;viewApp=function(id){let h=_va.apply(this,arguments);try{if(id==='stadt')h+=besitzCard()}catch(e){errLog(e,'besitz')}return h}}
HOOK.on('act',(id,arg)=>{if(id==='upg'){upgBuy(arg);return 1}
  if(id==='upgshow'){try{cityMode='3d';tab='stadt';render();if(typeof selectPlace==='function')selectPlace('home')}catch(e){errLog(e,'upgshow')}return 1}},50,'besitz');
