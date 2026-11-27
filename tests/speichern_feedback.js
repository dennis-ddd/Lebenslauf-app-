// Prüft v6.6: Speichern mit Sicherung und Prüfung, Import-Format, kurze Ereignistexte.
require('./lib/zufall').seed();
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};global.console.warn=()=>{};
const store={};const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:k=>store[k]??null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
const fs=require('fs'),path=require('path');let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={save,load,saveUnpack,saveValid,saveTrim,fxShort,KEY,BAKK,render,setP:x=>p=x,ERRLOG,jobBonus,interview,status,viewCasino,filmScenes,avatarSvg,stockVal,ensureStocks,SCENES,sceneOf,eraOf,yearNow,LATER,O,applyCfg,newLife,ageUp,QEV,act,die,continueAs,viewLeben,viewStadt,viewHome,viewEinst,bfSvg,showEvent0,setL:t=>lTab=t,setE:t=>einTab=t,get p(){return p},setDialog:f=>dialog=f,setStage:f=>stageDialog=f};';
eval(src);let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};
const frsh=a=>{T.newLife('Kim','Berger','w',a,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});return T.p};
// Neues Format mit Hülle
frsh(30);T.save();const env=JSON.parse(store[T.KEY]);ok('Hülle mit Version',env.v===3&&env.p&&env.p.first==='Kim'&&typeof env.t==='number');
ok('Laden',T.load()&&T.load().first==='Kim'&&T.load().age===30);
// Altes Format (reines p) wird gelesen
store[T.KEY]=JSON.stringify(T.p);ok('Altes Format',T.load()&&T.load().age===30);
// Sicherung entsteht beim Jahreswechsel
T.save();T.p.age=31;T.save();ok('Sicherung vorhanden',!!store[T.BAKK]&&T.saveUnpack(store[T.BAKK]).age===30);
// Kaputter Hauptstand -> Sicherung
store[T.KEY]='{kaputt';const r=T.load();ok('Rettung aus Sicherung',r&&r.age===30);
// Kein Hauptstand (z. B. nach dem Tod gelöscht) -> keine Wiederbelebung aus der Sicherung
delete store[T.KEY];ok('Gelöschter Stand bleibt gelöscht',T.load()===null);
// Ungültiger Zustand wird nicht gespeichert
frsh(40);T.save();const before=store[T.KEY];T.p.money=NaN;T.save();ok('NaN wird nicht gespeichert',store[T.KEY]===before);T.p.money=1000;
// Reparatur alter Stände
const o=T.saveUnpack(JSON.stringify({first:'A',last:'B',age:20,money:5,st:{gl:'80',ge:200}}));ok('Reparatur',o&&o.st.gl===80&&o.st.ge===100&&o.st.in===50&&Array.isArray(o.log));
ok('Müll wird abgelehnt',T.saveUnpack('{"a":1}')===null&&T.saveUnpack('null')===null&&T.saveUnpack('')===null);
// Speicher voll: Sicherung opfern, kürzen, erneut versuchen
frsh(50);for(let i=0;i<900;i++)T.p.log.push({a:50,t:'Eintrag '+i});const set0=localStorage.setItem;let n=0;localStorage.setItem=function(k,v){if(k===T.KEY&&n++===0)throw new Error('QuotaExceededError');set0.call(this,k,v)};
T.save();localStorage.setItem=set0;ok('Nach vollem Speicher gespeichert',T.load()&&T.load().age===50);ok('Liste gekürzt',T.p.log.length<=300);
// Kurze Texte
const L='Du kommst nach Hause. Die Tür steht offen. Im Flur liegen Scherben. Jemand war hier. Dein Herz rast, aber du gehst hinein.';
const k=T.fxShort(L);ok('Kürzung auf 2 Sätze',k==='Du kommst nach Hause. Die Tür steht offen.');ok('Kurz bleibt',T.fxShort('Kurzer Satz. Noch einer.')==='Kurzer Satz. Noch einer.');ok('HTML bleibt',T.fxShort('<b>x</b>'+L)==='<b>x</b>'+L);
T.O.kurz=false;ok('Abschaltbar',T.fxShort(L)===L);T.O.kurz=true;
const real=T.ERRLOG.filter(x=>!/QuotaExceeded|Spielstand|setAttribute|location|setProperty|AudioContext|getContext|vibrate|matchMedia|navigator|screen|querySelector|style|documentElement|dataset|getBoundingClientRect|appendChild|classList|remove/.test(x.m));real.forEach(x=>console.log('Protokoll:',x.m,x.wo));ok('Fehlerprotokoll leer',!real.length);
console.log('errors',errs);process.exit(errs?1:0);
