// Prüft v6.4: Entscheidungen mit Folgen, verbundene Hobbys, Casino und Börse mit Reaktionen.
require('./lib/zufall').seed();
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};global.console.warn=()=>{};
const store={};const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:k=>store[k]??null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
const fs=require('fs'),path=require('path');let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={ERRLOG,jobBonus,interview,status,viewCasino,filmScenes,avatarSvg,stockVal,ensureStocks,SCENES,sceneOf,eraOf,yearNow,LATER,O,applyCfg,newLife,ageUp,QEV,act,die,continueAs,viewLeben,viewStadt,viewHome,viewEinst,bfSvg,showEvent0,setL:t=>lTab=t,setE:t=>einTab=t,get p(){return p},setDialog:f=>dialog=f,setStage:f=>stageDialog=f};';
eval(src);let lastO=null,lastR=null;T.setDialog((t,x,o)=>{if(t==='Ergebnis')lastR=x;else lastO=o});let calls=[];T.setStage((sc,h,t,o)=>{calls.push([h,t,o]);lastO=o});let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};const bad=h=>/undefined|NaN|\[object/.test(h);
const frsh_=(a)=>{T.newLife('Kim','Berger','w',a,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});return T.p};
const yr_=()=>{el('modal').classList.remove('on');T.ageUp()};
const tk_=id=>{const i=T.p.q.findIndex(q=>q.id===id);if(i<0)return null;const it=T.p.q.splice(i,1)[0];return T.QEV[id](it.d)};
const runE_=(e,i)=>{ok('Ereignistext '+e.t,!bad(e.x)&&!bad(e.back||''));lastO=null;lastR=null;T.showEvent0(e);ok('Dialog '+e.t,!!lastO);calls=[];lastO[i||0][1]();const r=lastR||(calls.length?String(calls[calls.length-1][1]):null);ok('Antwort '+e.t,typeof r==='string'&&!bad(r));return r};
const fnd_=(id,n)=>{let e=null;const o=T.QEV[id];T.QEV[id]=d=>{const x=o(d);if(x&&!e)e=x;return x};for(let i=0;i<(n||25)&&!e;i++){yr_();const x=tk_(id);if(x)e=x}T.QEV[id]=o;return e};
// Praktikum passt zum Job
let p=frsh_(20);p.prak='pflege';ok('Praktikum hilft Pflege',T.jobBonus({id:'pflege'}).v>=.1);ok('Praktikum hilft nicht Pilot',T.jobBonus({id:'pilot'}).v===0);
p.sprecher=true;ok('Klassensprecher hilft Jura',T.jobBonus({id:'jura'}).v>=.05);
p.hob={kochen:60};ok('Hobby Kochen hilft Koch',T.jobBonus({id:'koch'}).v>0);
// Geld oder Zeit
p=frsh_(36);p.prio='geld';p.kids=[{n:'Lea',b:30,g:'w',rel:70,alive:true,st:{in:50,ge:90},fd:{}}];
let e=fnd_('fo_prio_kid',8);ok('Kind sagt: Du bist nie da',!!e);if(e){runE_(e,0);ok('Prio wechselt zu Zeit',T.p.prio==='zeit');ok('Spur in der Schmetterlingskarte',(T.p.skfl||[]).some(x=>/Geld ist mir wichtiger/.test(x.back)))}
p=frsh_(62);p.prio='zeit';e=fnd_('fo_prio_look',12);ok('Bilanz Geld oder Zeit',!!e);if(e)runE_(e,0);
// Plan: Work and Travel
p=frsh_(17);p.plan='reise';e=fnd_('fo_reise',6);ok('Work and Travel',!!e);if(e){const n0=(T.p.fk||[]).length;runE_(e,0);ok('Freund aus dem Ausland',(T.p.fk||[]).length>n0||JSON.stringify(T.p).includes('aus Australien'))}
p=frsh_(35);p.plan='ausbildung';p.aus=false;e=fnd_('fo_plan_late',20);ok('Plan von damals',!!e);if(e){runE_(e,0);ok('Umschulung beginnt',!!T.p.azubi||T.p.aus)}
// Klassensprecher und Politik
p=frsh_(21);p.sprecher=true;e=fnd_('fo_spr',15);ok('Ortsverein ruft an',!!e);if(e){runE_(e,1);ok('Partei beigetreten',!!T.p.pol)}
// Erstes Wort beim eigenen Kind
p=frsh_(30);p.word1='Ball';p.kids=[{n:'Tim',b:29,g:'m',rel:70,alive:true,st:{in:50,ge:90},fd:{}}];e=fnd_('fo_word',1);ok('Erstes Wort des Kindes',!!e&&e.x.includes('Ball'));if(e)runE_(e);
ok('Lebensfilm: die ersten Male',T.filmScenes().join('').includes('Erstes Wort'));
// Brille im Avatar
p=frsh_(9);const a0=T.avatarSvg(9,100,p);p.kidGlasses=1;ok('Brille sichtbar',T.avatarSvg(9,100,p)!==a0);
// Führerschein abgegeben
p=frsh_(80);p.cars=['kombi'];p.ticket=1;const m0=p.money;yr_();ok('Auto verkauft',T.p.cars.length===0&&T.p.money>m0-5000);T.act('buycar','gebraucht');ok('Kein neues Auto',T.p.cars.length===0);
// Träume im Alter
e=null;for(let t=0;t<3&&!e;t++){p=frsh_(72);p.dr={pick:['million'],done:{}};e=fnd_('fo_dream',12)}ok('Alter Traum',!!e);if(e)runE_(e,1);ok('Traum wird weitergegeben',T.p.drPass==='million'||!e);
// Hobbys
p=frsh_(30);p.hob={gitarre:45};const f0=(p.fk||[]).length;e=fnd_('fo_hob',25);ok('Freund aus dem Gitarrenkurs',(T.p.fk||[]).length>f0);ok('Auftritt im Café',!!e);if(e)runE_(e);
T.p.hob.gitarre=100;const oh=T.QEV.fo_hob;T.QEV.fo_hob=d=>{const x=oh(d);if(x)setTimeout0.push(x);return x};const setTimeout0=[];
let hj=null;for(let i=0;i<40&&!hj;i++){hj=fnd_('fo_hobjob',1);setTimeout0.splice(0).forEach(x=>runE_(x))}T.QEV.fo_hob=oh;ok('Hobby zum Beruf',!!hj);
if(hj){T.p.job={id:'buero',t:'Bürokaufmann/-frau',pay:40000,part:false,yrs:2,perf:50};runE_(hj,0);ok('Selbstständig',T.p.hobPro==='gitarre'&&!T.p.job&&/Gitarrenlehrer/.test(T.status()));const mm=T.p.money;yr_();ok('Einkommen aus dem Hobby',T.p.money>mm)}
// Casino
p=frsh_(30);p.partner={name:'Alex',rel:70,g:'m'};p.casino={won:0,lost:0};
let gs=null;for(let i=0;i<6&&!gs;i++){T.p.gmbN=12;gs=fnd_('fo_gsorge',1)}ok('Partner macht sich Sorgen',!!gs);
if(gs){runE_(gs,0);ok('Selbstsperre',T.p.gsperr>T.p.age);ok('Casino gesperrt',T.viewCasino().includes('Selbstsperre aktiv'))}
p=frsh_(30);ok('Spielerschutz-Karte',T.viewCasino().includes('Spielerschutz'));T.act('gsperr');ok('Selbst sperren',T.p.gsperr===31);
// Börse
p=frsh_(40);p.partner={name:'Alex',rel:70,g:'m'};T.ensureStocks();const id=Object.keys(p.px).find(k=>k!=='my');p.money=200000;T.act('buyst',id+':100000');ok('Aktien gekauft',p.stk0===40&&p.pfIn>0);
yr_();p=T.p;p.px[id]*=.4;e=fnd_('fo_crash',1);ok('Börsencrash',!!e);if(e){runE_(e,1);ok('Durchhalten gemerkt',!!T.p.bHold)}
const real=T.ERRLOG.filter(x=>!/setAttribute|location|setProperty|AudioContext|getContext|vibrate|matchMedia|navigator|screen|querySelector|style|documentElement|dataset/.test(x.m));real.forEach(x=>console.log('Protokoll:',x.m,x.st));ok('Fehlerprotokoll leer',!real.length);
console.log('errors',errs);process.exit(errs?1:0);
