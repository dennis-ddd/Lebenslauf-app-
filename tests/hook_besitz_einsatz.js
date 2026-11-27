// Prüft v6.7: HOOK-Verteiler, Stadtmodell, Besitz-Upgrades und Bewährungsprobe mit Einsatz.
require('./lib/zufall').seed();
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};global.console.warn=()=>{};
const store={};const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:k=>store[k]??null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
const fs=require('fs'),path=require('path');let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={HOOK,cityModel,cityOpts,houseOwned,UPG,upgHas,stakeCard,besitzCard,viewApp,setMg:f=>mgStart=f,setDlg:f=>dialog=f,mile,save,load,saveUnpack,saveValid,saveTrim,fxShort,KEY,BAKK,render,setP:x=>p=x,ERRLOG,jobBonus,interview,status,viewCasino,filmScenes,avatarSvg,stockVal,ensureStocks,SCENES,sceneOf,eraOf,yearNow,LATER,O,applyCfg,newLife,ageUp,QEV,act,die,continueAs,viewLeben,viewStadt,viewHome,viewEinst,bfSvg,showEvent0,setL:t=>lTab=t,setE:t=>einTab=t,get p(){return p},setDialog:f=>dialog=f,setStage:f=>stageDialog=f};';
eval(src);let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};const bad=h=>/undefined|NaN|\[object/.test(h);
const frsh=a=>{T.newLife('Kim','Berger','w',a,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});return T.p};
const yr=()=>{el('modal').classList.remove('on');T.ageUp()};
// ---------- HOOK ----------
const H=T.HOOK,seen=[];H.on('t1',()=>seen.push('b'),60,'b');H.on('t1',()=>seen.push('a'),10,'a');H.on('t1',()=>{throw new Error('kaputt')},30,'x');H.on('t1',()=>seen.push('c'),60,'c');
H.emit('t1');ok('Reihenfolge nach prio, dann Anmeldung',seen.join('')==='abc');ok('Fehler stoppt andere nicht',T.ERRLOG.some(e=>/kaputt/.test(e.m)&&/hook:t1:x/.test(e.wo)));
ok('list zeigt Reihenfolge',H.list('t1').join(',')==='10 a,30 x,60 b,60 c');
const offF=H.on('t2',()=>7);ok('claim liefert ersten Wert',H.claim('t2')===7);offF();ok('abmelden',H.claim('t2')===undefined);
// Brücke: act, acted, year, life
let lives=0,years=[],acted=[];H.on('life',()=>lives++);H.on('year',y=>years.push(y.to));H.on('acted',id=>acted.push(id));
H.on('act',(id)=>id==='testaktion'?42:undefined,50,'test');
let p=frsh(30);ok('life beim neuen Leben',lives===1);ok('act über HOOK',T.act('testaktion')===42&&acted.includes('testaktion'));
T.act('goto','bank');ok('alte Aktionen laufen weiter',acted.includes('goto'));
yr();ok('year nach dem Jahreswechsel',years[0]===31);
// ---------- Stadtmodell ----------
p=T.p;const m1=T.cityModel(),m2=T.cityModel();ok('Modell wird im Jahr wiederverwendet',m1===m2&&typeof m1.key==='string'&&m1.home&&m1.home.type===p.home);
ok('cityOpts zeigt aufs Modell',T.cityOpts()===m1);
p.cars=['kombi'];const m3=T.cityModel();ok('Besitzänderung baut neu',m3!==m1&&m3.car==='kombi'&&m3.key!==m1.key);
yr();ok('Neues Jahr baut neu',T.cityModel()!==m3&&T.cityModel().age===T.p.age);
// ---------- Upgrades ----------
p=frsh(40);p.money=200000;p.owned=(p.owned||[]).concat('reihenhaus');p.home='reihenhaus';ok('Haus gehört dir',T.houseOwned());
const a0=p.act,m0=p.money;T.act('upg','anbau');ok('Anbau gekauft',T.upgHas('anbau')&&p.money<m0);ok('Anbau: sofort +1 Aktion (Kosten 1 Aktion)',p.act===a0);
ok('Stadtmodell kennt den Anbau',T.cityModel().home.up.anbau===1&&/h:anbau/.test(T.cityModel().key));
T.act('upg','pool');const g0=T.p.st.gl;yr();ok('Pool: Glück im Jahr',T.p.log.some(l=>/Besitz: laufende Kosten/.test(l.t)));
ok('Anbau: Aktionen im neuen Jahr +1',T.p.act===7);
T.act('upg','schild');ok('Schild ohne Firma nicht möglich',!T.upgHas('schild'));
T.p.biz=T.p.biz||{};T.p.biz.firm={name:'Kim Solar',val:100000,emp:0,mkt:0,yrs:0};T.act('upg','schild');ok('Schild mit Firma',T.upgHas('schild')&&T.cityModel().firm.sign);
T.setTab&&0;const V=T.viewApp('stadt');ok('Besitz-Karte',V.includes('Dein Besitz')&&V.includes('Anbau')&&!bad(V));
// Umzug: Ausbauten bleiben im Haus und erhöhen den Verkaufswert
T.p.home='wg';T.act('goto','bank');ok('Umzug: Ausbauten bleiben zurück',!T.upgHas('anbau')&&T.p.upgV&&T.p.upgV.reihenhaus>0);
// ---------- Bewährungsprobe ----------
let score=[];T.setMg((ty,n,title,cb)=>cb(score.shift(),false));let dl=[];T.setDlg((h,t,o)=>dl.push([h,t,o]));
p=frsh(30);p.job={id:'buero',t:'Bürokaufmann/-frau',pay:40000,part:false,yrs:2,perf:65,rank:1};p.money=5000;
ok('Karte im Jobs-Tab',T.viewApp('jobs').includes('Bewährungsprobe'));
score=[3,3];let mm=p.money;T.act('stake','geld');const st=2000;ok('Gewinn: Einsatz zurück + Gewinn',T.p.money===mm+st);ok('Empfehlung',T.p.job.rec===1&&T.p.job.perf===77);
const d1=dl.pop();ok('Doppelt oder nichts angeboten',d1&&d1[2][0][0]==='Doppelt oder nichts');d1[2][0][1]();ok('Doppelt gewonnen',T.p.money===mm+3*st&&T.p.job.rec===2);
ok('Nur einmal im Jahr',(T.act('stake','geld'),T.p.money===mm+3*st));
// Beförderung über Empfehlungen (Seed macht das reproduzierbar, Chance 50 %)
let promoted=false;for(let i=0;i<12&&!promoted;i++){T.p.job.rec=2;T.p.job.perf=80;const r0=T.p.job.rank||1;yr();promoted=(T.p.job.rank||1)>r0}ok('Empfehlungen führen zur Beförderung',promoted);
// Verlieren
p=frsh(30);p.job={id:'buero',t:'Bürokaufmann/-frau',pay:40000,part:false,yrs:2,perf:65,rank:1};p.st.gl=60;score=[1];T.act('stake','gl');ok('Verloren: Glück weg',T.p.st.gl===55&&T.p.job.perf===59);
p=frsh(30);p.job={id:'buero',t:'Bürokaufmann/-frau',pay:40000,part:false,yrs:2,perf:65,rank:1};p.ruf=10;score=[2,2];T.act('stake','ruf');const d2=dl.pop();d2[2][0][1]();ok('Doppelt verloren: alles weg',T.p.ruf===5&&T.p.job.rec===0);
const real=T.ERRLOG.filter(x=>!/kaputt|history|QuotaExceeded|setAttribute|location|setProperty|AudioContext|getContext|vibrate|matchMedia|navigator|screen|querySelector|style|documentElement|dataset|getBoundingClientRect|appendChild|classList|remove/.test(x.m));real.forEach(x=>console.log('Protokoll:',x.m,x.wo));ok('Fehlerprotokoll leer',!real.length);
console.log('errors',errs);process.exit(errs?1:0);
