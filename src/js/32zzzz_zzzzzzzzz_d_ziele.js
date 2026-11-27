/* ================= Lebensphasen-Ziele: 3 Ziele pro Phase, sichtbar auf dem Startbildschirm =================
   Geschafft wird nur in der laufenden Phase. Ein Ziel bringt sofort eine Belohnung (schwebende Zahlen),
   alle drei einer Phase zusätzlich einen Bonus. Am Phasenende erscheint kurz die Bilanz und die neue Phase.
   Am Lebensende steht die Gesamtbilanz mit Note in der Todesanzeige. Alles über HOOK. */
const PHS=[['kind','Kindheit',0,12],['jugend','Jugend',13,17],['start','Durchstarten',18,29],['mitte','Mitten im Leben',30,49],['reife','Reife Jahre',50,66],['alter','Lebensabend',67,999]];
const pzNum=(v,max)=>[Math.max(0,Math.min(max,Math.floor(v))),max];
const PZ={
 kind:[['k_freund','Besten Freund finden',()=>(p.fk||[]).some(f=>f.cl>=65),()=>pzNum(Math.max(0,...(p.fk||[]).map(f=>f.cl||0)),65),'familie',{g:5}],
  ['k_schlau','Intelligenz 60',()=>p.st.in>=60,()=>pzNum(p.st.in,60),'bildung',{g:3,m:200}],
  ['k_fit','Mit 10 topfit (Gesundheit 70)',()=>p.age>=10&&p.st.ge>=70,()=>pzNum(p.st.ge,70),'freizeit',{g:3}]],
 jugend:[['j_geld','Erstes eigenes Geld',()=>!!p.job||!!(p.ach&&p.ach.job),null,'jobs',{m:300}],
  ['j_abschluss','Schulabschluss',()=>(RANK[p.edu]||0)>=1,null,'bildung',{g:4,m:300}],
  ['j_handy','Eigenes Smartphone',()=>phoneTier()>=1,null,'shop',{g:3}]],
 start:[['s_auszug','Ausziehen',()=>!!p.home&&p.home!=='eltern',null,'wohnen',{g:4}],
  ['s_job','Vollzeitjob',()=>!!(p.job&&!p.job.part),null,'jobs',{m:1000}],
  ['s_liebe','Feste Beziehung',()=>!!(p.partner&&p.partner.name),null,'liebe',{g:6}]],
 mitte:[['m_geld','50.000 € auf dem Konto',()=>p.money>=px$(50000),()=>pzNum(p.money/px$(500),100),'bank',{g:4}],
  ['m_rang','Eine Beförderung',()=>!!(p.job&&(p.job.rank||1)>=2),null,'jobs',{m:3000}],
  ['m_heim','Eigenes Zuhause',()=>houseOwned(),null,'wohnen',{g:6}]],
 reife:[['r_ausbau','Zuhause ausbauen',()=>!!(p.upg&&['anbau','pool','solar'].some(k=>p.upg[k]!=null)&&houseOwned()),null,'stadt',{g:4}],
  ['r_glueck','Glück 70',()=>p.st.gl>=70,()=>pzNum(p.st.gl,70),'freizeit',{m:2000}],
  ['r_spur','5 Spuren in der Stadt',()=>((cityModel()||{}).traces||[]).length>=5,()=>pzNum(((cityModel()||{}).traces||[]).length,5),'stadt',{g:5}]],
 alter:[['a_80','80 werden',()=>p.age>=80,()=>pzNum(p.age-66,14),'leben',{g:6}],
  ['a_freunde','Drei gute Freunde',()=>(p.fk||[]).filter(f=>f.cl>=50).length>=3,()=>pzNum((p.fk||[]).filter(f=>f.cl>=50).length,3),'familie',{g:5}],
  ['a_erbe','100.000 € hinterlassen',()=>p.money>=px$(100000),()=>pzNum(p.money/px$(1000),100),'bank',{g:3}]]};
const phOf=a=>PHS.find(x=>a>=x[2]&&a<=x[3])||PHS[PHS.length-1];
const pzS=()=>(p.pz=p.pz||{done:{},ph:{}});
const pzCount=k=>PZ[k].filter(g=>pzS().done[g[0]]!=null).length;
const pzRw=r=>[r.m?'+'+eur(px$(r.m)):'',r.g?'Glück +'+r.g:''].filter(Boolean).join(' · ');
function pzCheck(){if(!p||!p.alive||!p.st)return;const S=pzS(),ph=phOf(p.age),G=PZ[ph[0]];let got=[];
  G.forEach(g=>{if(S.done[g[0]]!=null)return;let ok=false;try{ok=!!g[2]()}catch(e){errLog(e,'pz:'+g[0])}if(!ok)return;S.done[g[0]]=p.age;const r=g[5]||{};if(r.m)p.money+=px$(r.m);if(r.g)add('gl',r.g);log('Ziel geschafft: '+g[1]+'.');got.push(g)});
  if(!got.length)return false;if(pzCount(ph[0])===3&&!S.ph[ph[0]]){S.ph[ph[0]]=3;p.money+=px$(1500);add('gl',5);mile(ph[1]+' gemeistert','star')}
  try{if(typeof fxPush==='function'&&!noDom())fxPush(got.length>1?got.length+' Ziele geschafft':'Ziel geschafft',got.map(g=>g[1]).join(' · ')+(pzCount(ph[0])===3?' · Phase gemeistert!':''),'pos')}catch(e){errLog(e,'pzpush')}return true}
HOOK.on('acted',()=>{if(pzCheck()){save();render()}},70,'ziele');HOOK.on('life',()=>{if(p)pzS()},70,'ziele');
/* Phasenwechsel: verpasste Ziele verfallen, kurze Bilanz und Ausblick */
HOOK.on('year',({from,to})=>{if(!p)return;pzCheck();const a=phOf(from),b=phOf(to);if(a[0]===b[0])return;const S=pzS(),n=pzCount(a[0]);if(S.ph[a[0]]==null)S.ph[a[0]]=n;
  const next=PZ[b[0]].map(g=>g[1]).join(' · ');log(a[1]+' vorbei: '+n+' von 3 Zielen.');
  try{if(typeof fxPush==='function'&&!noDom())fxPush(a[1]+' vorbei: '+n+' von 3','Jetzt: '+b[1]+' · '+next,n===3?'pos':'warn')}catch(e){errLog(e,'pzph')}pzCheck()},70,'ziele');
/* Startbildschirm: drei Ziele der Phase, das nächste mit Fortschritt und direktem Weg */
function pzCard(){if(!p||!p.alive)return '';const S=pzS(),ph=phOf(p.age),G=PZ[ph[0]],n=pzCount(ph[0]),yl=ph[3]-p.age+1;
  const open=G.filter(g=>S.done[g[0]]==null),nx=open[0];
  return '<section class="card pzc"><div class="pzh"><b>'+ph[1]+'</b><span>'+n+'/3'+(ph[3]<900?' · noch '+yl+(yl===1?' Jahr':' Jahre'):'')+'</span></div><div class="pzl">'+
    G.map(g=>{const d=S.done[g[0]]!=null;let pr='';if(!d&&g[3]){try{const [c,m]=g[3]();pr='<i style="width:'+Math.round(c/m*100)+'%"></i>'}catch(e){errLog(e)}}
      return '<button class="pzg'+(d?' done':'')+(g===nx?' nx':'')+'" data-a="goto" data-g="'+g[4]+'"><span class="pzk">'+(d?'✓':'')+'</span><span class="pzt">'+esc(g[1])+'<small>'+(d?'mit '+S.done[g[0]]:pzRw(g[5]||{}))+'</small></span>'+(pr?'<span class="pzb">'+pr+'</span>':'')+'</button>'}).join('')+'</div></section>'}
HOOK.on('view:home',h=>{const c=pzCard();if(!c)return;const i=h.indexOf('<section');return i>=0?h.slice(0,i)+c+h.slice(i):h+c},50,'ziele');
/* Lebensende: Gesamtbilanz mit Note */
function pzGrade(t){return t>=16?['S','Ein Leben wie aus dem Bilderbuch']:t>=12?['A','Ein erfülltes Leben']:t>=8?['B','Ein gutes Leben mit Ecken und Kanten']:['C','Ein Leben voller Umwege']}
function pzBilanz(){const S=pzS(),tot=PHS.reduce((s,x)=>s+pzCount(x[0]),0),[gr,gt]=pzGrade(tot),tr=((cityModel()||{}).traces||[]).length;
  return '<section class="card pzend"><h2 class="h">Deine Bilanz</h2><div class="pzgr"><b>'+gr+'</b><span>'+gt+'<small>'+tot+' von 18 Lebenszielen · '+tr+' Spuren in der Stadt</small></span></div>'+
    PHS.map(x=>{const n=pzCount(x[0]);return '<div class="mrow"><span>'+x[1]+'</span><b>'+'●'.repeat(n)+'<span class="pzo">'+'○'.repeat(3-n)+'</span></b></div>'}).join('')+'</section>'}
HOOK.on('view:death',h=>{try{const c=pzBilanz(),a=h.indexOf('id="again"'),i=a>=0?h.lastIndexOf('<button',a):-1;return i>=0?h.slice(0,i)+c+h.slice(i):h+c}catch(e){errLog(e,'pzend')}},50,'ziele');
