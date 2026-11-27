// Spielt 10 ganze Leben mit vielen Systemen und prüft das Fehlerprotokoll: Außer fehlenden Browser-Funktionen
require('./lib/zufall').seed('zufall');
// (die es in Node nicht gibt) darf kein Fehler auftreten. Prüft außerdem, dass sich Ereignisse nicht zu oft wiederholen.
const pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};
const store={};const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:k=>store[k]??null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
global.console.warn=()=>{};
const fs=require('fs'),path=require('path');let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'');src+=';global.T={ERRLOG,applyCfg,newLife,ageUp,QEV,act,continueAs,get p(){return p},setDialog:f=>dialog=f};';
eval(src);T.setDialog(()=>{});
const titles={};let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};
for(let life=0;life<10;life++){T.newLife('Kim','Test',pick(['w','m']),0,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:pick(['normal','reich'])});
  let y=0;while(T.p.alive&&y++<105){const p=T.p;p.act=6;for(let a=0;a<4;a++){try{T.act(pick(['lernen','sport','party','freunde','lesen','meditieren','seniorsport','garten']));const f=(p.fk||[])[0];if(f)T.act('fkmeet',f.id);const x=(p.pets||[])[0];if(x)T.act('pplay',x.id)}catch(e){}}
    if(p.age===10)T.act('adopt',pick(['hund','katze']));if(p.age===18&&!p.job)T.act('apply','kellner');
    el('modal').classList.remove('on');try{T.ageUp()}catch(e){errs++;console.log('ERR ageUp',e.message);break}
    let g=0;while(T.p.q.length&&g++<30){const it=T.p.q.shift();const f=T.QEV[it.id];if(!f)continue;let e;try{e=f(it.d)}catch(x){errs++;console.log('ERR ev',it.id,x.message);continue}if(!e||!e.c())continue;titles[e.t]=(titles[e.t]||0)+1;try{pick(e.o)[1]()}catch(x){errs++;console.log('ERR opt',it.id,x.message)}}}
  if(!T.p.alive&&T.p.kids.some(k=>k.alive!==false)&&life%3===0){try{T.continueAs(T.p.kids.findIndex(k=>k.alive!==false))}catch(e){errs++;console.log('ERR Generation',e.message)}}}
const DOM=/setAttribute|location is not defined|setProperty|AudioContext|getContext|vibrate|matchMedia|requestAnimationFrame|navigator|screen is not|querySelector|scrollIntoView|focus is not|closest|dataset|classList|getBoundingClientRect|style/;
const real=T.ERRLOG.filter(x=>!DOM.test(x.m));real.forEach(x=>console.log('Fehlerprotokoll:',x.n+'×',x.m,'|',x.st));ok('keine Spielfehler im Protokoll',real.length===0);
const top=Object.entries(titles).sort((a,b)=>b[1]-a[1]);console.log('häufigste Ereignisse pro Leben:',top.slice(0,6).map(([t,n])=>t+' '+(n/10).toFixed(1)).join(' · '));
top.forEach(([t,n])=>ok('zu häufig: '+t+' '+(n/10).toFixed(1)+' pro Leben',n/10<=3.5));
console.log('errors',errs);process.exit(errs?1:0);
