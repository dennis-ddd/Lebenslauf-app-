// Prüft v6.8: render() ohne Nebenwirkung, HOOK.pipe und Pins, BAföG-Rate, Kinder-Entwicklung, Lebensspuren, Lebensphasen-Ziele und Bilanz.
require('./lib/zufall').seed();
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};global.console.warn=()=>{};
const store={};const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:k=>store[k]??null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
const fs=require('fs'),path=require('path');let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={saveUnpack,HOOK,cityModel,pzCard,pzBilanz,pzCheck,PZ,viewHome,viewDeath,mkLoan,stateEnsure,relClamp,save,load,saveUnpack,saveValid,saveTrim,fxShort,KEY,BAKK,render,setP:x=>p=x,ERRLOG,jobBonus,interview,status,viewCasino,filmScenes,avatarSvg,stockVal,ensureStocks,SCENES,sceneOf,eraOf,yearNow,LATER,O,applyCfg,newLife,ageUp,QEV,act,die,continueAs,viewLeben,viewStadt,viewHome,viewEinst,bfSvg,showEvent0,setL:t=>lTab=t,setE:t=>einTab=t,get p(){return p},setDialog:f=>dialog=f,setStage:f=>stageDialog=f};';
eval(src);let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};const bad=h=>/undefined|NaN|\[object/.test(h);
const frsh=a=>{T.newLife('Kim','Berger','w',a,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});return T.p};
const yr=()=>{el('modal').classList.remove('on');T.ageUp()};
// render() ändert den Zustand nicht
let p=frsh(30);T.render();const j1=JSON.stringify(T.p);T.render();T.render();ok('render ohne Nebenwirkung',JSON.stringify(T.p)===j1);
delete T.p.cost;T.render();ok('ohne Änderung keine Reparatur beim Zeichnen',T.p.cost===undefined);T.act('goto','bank');ok('nach einer Aktion wird normalisiert',!!T.p.cost);
// HOOK.pipe
T.HOOK.on('view:test',(h,x)=>h+'B'+x);T.HOOK.on('view:test',h=>undefined);ok('pipe',T.HOOK.pipe('view:test','A',1)==='AB1');
ok('Pins laufen über HOOK',T.HOOK.list('pins:before').some(x=>/denkmal/.test(x))&&T.HOOK.list('pins').some(x=>/viertel/.test(x))&&T.HOOK.list('pins').some(x=>/spuren/.test(x)));
// BAföG: zinsloser Kredit
const L=T.mkLoan(1000,0,10);ok('Rate bei 0 % Zins',L.pay===100);
p=frsh(25);p.loans=[T.mkLoan(12000,0,10)];for(let i=0;i<3;i++)yr();ok('Kontostand bleibt gültig',Number.isFinite(T.p.money)&&T.p.loans[0].amt===8400);
p.loans=[{amt:5000,rate:0,n:10,left:10,pay:NaN}];p.money=NaN;T.act('goto','bank');ok('Reparatur kaputter Stände',p.money===0&&p.loans[0].pay===500);
ok('alter Speicherstand mit money:null wird gelesen',(()=>{const o=T.saveUnpack(JSON.stringify({first:'A',last:'B',age:40,money:null,st:{gl:50,ge:50,in:50,au:50}}));return o&&o.money===0})());
// Kinder entwickeln sich wieder (kidYear wurde von der Kindheits-Funktion überschrieben)
p=frsh(30);p.kids=[{n:'Lea',g:'w',b:29,alive:true,rel:90,st:{in:70,ge:90},fd:{},tal:'kopf',ts:20,edu:'keine',kids:0}];for(let i=0;i<20;i++){T.p.kids[0].rel=90;yr()}
const k=T.p.kids[0];ok('Kind macht Abitur',k.edu==='Abitur');ok('Talent wächst',k.ts>20);ok('Kind zieht aus',!!k.out);
// Beziehungen bleiben in Grenzen
p=frsh(40);p.kids=[{n:'Tim',g:'m',b:35,alive:true,rel:-80,st:{in:50,ge:90},fd:{},tal:'sport',ts:0,edu:'keine',kids:0}];p.partner={name:'Alex',rel:140,mar:false};T.act('goto','bank');ok('Beziehung zwischen 0 und 100',T.p.kids[0].rel===0&&T.p.partner.rel===100);
// Lebensspuren in der Stadt
p=frsh(30);const k0=T.cityModel().key;p.ms.push({a:30,t:'Hochzeit',k:'big'},{a:31,t:'Lea ist geboren',k:'kid'});const m=T.cityModel();
ok('Spuren aus Meilensteinen',m.traces.some(t=>t.place==='park'&&t.ico==='♥')&&m.traces.some(t=>t.place==='klinik'));ok('Szene baut neu',m.key!==k0);
p.denk=[{n:'Anna Berger-Platz'}];ok('Gedenkorte im Modell',T.cityModel().memorials.length===1);
// Lebensphasen-Ziele
p=frsh(18);p.home='eltern';ok('Karte auf dem Start',T.viewHome().includes('Durchstarten')&&!bad(T.pzCard()));
const g0=T.p.st.gl;p.home='wg';T.act('goto','bank');ok('Ziel geschafft: Ausziehen',T.p.pz.done.s_auszug===18&&T.p.st.gl>=Math.min(100,g0+4));
p.job={id:'buero',t:'Bürokaufmann/-frau',pay:30000,part:false,yrs:0,perf:50};p.partner={name:'Alex',rel:70,mar:false};const m0=T.p.money;T.act('goto','bank');
ok('Phase gemeistert',T.p.pz.ph.start===3&&T.p.ms.some(x=>/Durchstarten gemeistert/.test(x.t))&&T.p.money>m0);
p=frsh(17);T.act('goto','bank');yr();ok('Phasenwechsel bewertet die alte Phase',T.p.pz.ph.jugend!=null&&T.p.log.some(l=>/Jugend vorbei/.test(l.t)));
p.alive=false;const D=T.viewDeath();ok('Bilanz am Lebensende',D.includes('Deine Bilanz')&&/von 18 Lebenszielen/.test(D)&&!bad(T.pzBilanz()));
const real=T.ERRLOG.filter(x=>!/history|QuotaExceeded|setAttribute|location|setProperty|AudioContext|getContext|vibrate|matchMedia|navigator|screen|querySelector|style|documentElement|dataset|getBoundingClientRect|appendChild|classList|remove/.test(x.m));real.forEach(x=>console.log('Protokoll:',x.m,x.wo));ok('Fehlerprotokoll leer',!real.length);
console.log('errors',errs);process.exit(errs?1:0);
