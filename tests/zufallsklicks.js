// Zufallsklicks: 8 Leben, je Jahr 25 zufällige Knöpfe aus allen Apps. Meldet Abstürze gruppiert.
// Prüft v6.5: Klick mit Nische, Saisonplan, Team, Superfans, Rangliste, Risiken, Bühnen und eigener Marke.
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};global.console.warn=()=>{};
const store={};const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:k=>store[k]??null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
const fs=require('fs'),path=require('path');let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={viewApp,viewHome,get APPK(){return Object.keys(APP)},setTab:t=>tab=t,crRank,crReach,viewKlick,contacts,replyOpts,doPost,setSm:t=>smTab=t,ERRLOG,jobBonus,interview,status,viewCasino,filmScenes,avatarSvg,stockVal,ensureStocks,SCENES,sceneOf,eraOf,yearNow,LATER,O,applyCfg,newLife,ageUp,QEV,act,die,continueAs,viewLeben,viewStadt,viewHome,viewEinst,bfSvg,showEvent0,setL:t=>lTab=t,setE:t=>einTab=t,get p(){return p},setDialog:f=>dialog=f,setStage:f=>stageDialog=f};';
eval(src);let lastO=null,lastR=null;T.setDialog((t,x,o)=>{if(t==='Ergebnis')lastR=x;else lastO=o});let calls=[];T.setStage((sc,h,t,o)=>{calls.push([h,t,o]);lastO=o});let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};const bad=h=>/undefined|NaN|\[object/.test(h);
const frsh_=(a)=>{T.newLife('Kim','Berger','w',a,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});return T.p};
const yr_=()=>{el('modal').classList.remove('on');T.ageUp()};
const tk_=id=>{const i=T.p.q.findIndex(q=>q.id===id);if(i<0)return null;const it=T.p.q.splice(i,1)[0];return T.QEV[id](it.d)};
const runE_=(e,i)=>{ok('Ereignistext '+e.t,!bad(e.x)&&!bad(e.back||''));lastO=null;lastR=null;T.showEvent0(e);ok('Dialog '+e.t,!!lastO);calls=[];lastO[i||0][1]();const r=lastR||(calls.length?String(calls[calls.length-1][1]):null);ok('Antwort '+e.t,typeof r==='string'&&!bad(r));return r};
const fnd_=(id,n)=>{let e=null;const o=T.QEV[id];T.QEV[id]=d=>{const x=o(d);if(x&&!e)e=x;return x};for(let i=0;i<(n||25)&&!e;i++){yr_();const x=tk_(id);if(x)e=x}T.QEV[id]=o;return e};
const pick=a=>a[Math.floor(Math.random()*a.length)];const errs2={};const note=(w,e)=>{const k=w+': '+(e&&e.message||e);errs2[k]=(errs2[k]||0)+1};
const skip=/^(reset|again|neu|delall|wipe|export|import|del|quit|sui|die|kill|srch|svexp|svimp|svbak)/;
let acts=0;
for(let life=0;life<8;life++){frsh_([0,6,13,18,25,40,60,75][life]);T.p.money=[500,5000,50000,500000][life%4];
 for(let y=0;y<40&&T.p.alive;y++){
  for(let k=0;k<25;k++){const t=pick(T.APPK.concat(['home']));let h='';try{T.setTab(t);h=t==='home'?T.viewHome():T.viewApp(t)}catch(e){note('view '+t,e);continue}
   const B=[...h.matchAll(/data-a="([^"]+)"(?:[^>]*?data-g="([^"]*)")?/g)].filter(m=>!skip.test(m[1]));if(!B.length)continue;const m=pick(B);
   try{el('modal').classList.remove('on');T.act(m[1],m[2]);acts++}catch(e){note('act '+m[1]+'('+m[2]+') in '+t,e)}
   if(!T.p||!T.p.alive)break}
  if(!T.p||!T.p.alive)break;try{el('modal').classList.remove('on');T.ageUp()}catch(e){note('ageUp',e)}}}
console.log('Aktionen',acts);console.log(Object.entries(errs2).sort((a,b)=>b[1]-a[1]).slice(0,25).map(([k,v])=>v+'× '+k).join('\n'));
const real=T.ERRLOG.filter(x=>!/setAttribute|location|setProperty|AudioContext|getContext|vibrate|matchMedia|navigator|screen|querySelector|style|documentElement|dataset|scroll|focus|classList|getBoundingClientRect|appendChild|addEventListener/.test(x.m));
const g={};real.forEach(x=>{const k=x.m+' @'+(x.wo||'')+' '+String(x.st||'').split('\n').slice(1,3).join(' ').replace(/\s+/g,' ').slice(0,160);g[k]=(g[k]||0)+1});console.log('ERRLOG:');console.log(Object.entries(g).sort((a,b)=>b[1]-a[1]).slice(0,20).map(([k,v])=>v+'× '+k).join('\n'));
const nErr=Object.keys(errs2).length;console.log('errors',nErr);process.exit(nErr?1:0);
