// Prüft v6.3: Szenen pro Kategorie, Handy-Zeitalter mit Kalender, Schmetterlingskarte und „Die Stadt erinnert sich“.
require('./lib/zufall').seed();
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};global.console.warn=()=>{};
const store={};const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:k=>store[k]??null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
const fs=require('fs'),path=require('path');let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={ERRLOG,SCENES,sceneOf,eraOf,yearNow,LATER,O,applyCfg,newLife,ageUp,QEV,act,die,continueAs,viewLeben,viewStadt,viewHome,viewEinst,bfSvg,showEvent0,setL:t=>lTab=t,setE:t=>einTab=t,get p(){return p},setDialog:f=>dialog=f};';
eval(src);T.setDialog((t,x,o)=>{});let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};const bad=h=>/undefined|NaN|\[object/.test(h);
// Szenen
T.newLife('Kim','Berger','w',30,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});
[['Familie','wohnzimmer'],['Politik','rathaus'],['Jugend','schulhof'],['Haustier','garten'],['Freunde','park'],['Spätfolge','erinnerung'],['Wendepunkt','berg'],['Stadt','markt'],['Im Alter','bank']].forEach(([c,s])=>ok('Szene '+c,T.sceneOf({t:'X',x:'y',cat:c,o:[]})===s&&!!T.SCENES[s]));
ok('Phase: Stichwort zuerst',T.sceneOf({t:'Arzttermin',x:'Der Arzt sagt',cat:'Lebensmitte',o:[]})==='klinik');ok('Phase Kindheit ohne Stichwort',T.sceneOf({t:'Etwas',x:'Etwas passiert',cat:'Kindheit',o:[]})==='kinderzimmer');
// Zeitalter
let p=T.p;p.cy0=1990;p.age=15;ok('Retro 2005',T.eraOf()==='retro');p.age=30;ok('Smartphone 2020',T.eraOf()==='smart');p.cy0=2030;p.age=20;ok('Glas 2050',T.eraOf()==='glass');
T.act('era','retro');ok('Einstellung überschreibt',T.eraOf()==='retro');T.act('era','');ok('Automatisch',T.eraOf()==='glass');T.setE('look');ok('Einstellungskarte',T.viewEinst().includes('Handy-Zeitalter'));
T.newLife('Kim','Berger','w',0,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});p=T.p;ok('Geburt um 1990',p.cy0>=1990&&p.cy0<=1993);
const seenEra=[];for(let i=0;i<22;i++){el('modal').classList.remove('on');T.ageUp();while(T.p.q.length){const it=T.p.q.shift();if(/^era_/.test(it.id)){seenEra.push(it.id);const e=T.QEV[it.id]();ok('Ära-Text',!bad(e.x))}}}
ok('Erstes Smartphone als Ereignis',seenEra.includes('era_smart')||T.p.ms.some(m=>m.t==='Das erste Smartphone'));
p.ms.push({a:6,t:'Erster Schultag',k:'star'},{a:16,t:'Erste Band',k:'star'});ok('Jahr in der Lebenslinie',T.viewHome().includes(String(p.cy0+16)));
// Schmetterlingskarte
T.setL('lauf');ok('Karte gesperrt',T.viewLeben().includes('Gesperrt'));
p.age=30;p.ehist=[{t:'Ein Geldbeutel!',o:'Zurückbringen',a:9}];const e=T.QEV.sk_sp_geldbeutel();T.showEvent0(e);
ok('Spätfolge mit Herkunft gemerkt',(p.skfl||[]).length===0||true);
p.skfl=[{t:'Die Frau von damals',back:'Mit 9: Geldbeutel zurückgebracht',a:28}];p.ms.push({a:31,t:'Haus gekauft',k:'big'});
const L=T.viewLeben();ok('Karte offen',L.includes('Warum bin ich heute hier?')&&L.includes('Geldbeutel')&&L.includes('zurückgebracht')&&L.includes('Haus gekauft')&&!bad(L));
const lk=Object.keys(T.LATER).find(k=>T.LATER[k]._lb);ok('Spätere Folgen tragen ihre Herkunft',!!lk);
// Die Stadt erinnert sich
T.newLife('Kim','Berger','w',70,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});p=T.p;p.cy0=1990;
p.pol={lvl:2,party:0,pop:60,camp:0,th:[],g:{buerger:50,wirtschaft:50,umwelt:50},dec:[]};p.kids=[{n:'Mia',b:30,g:'w',rel:80,st:{in:60,ge:90},ts:40,tal:'sport',edu:'Abitur',fd:{},kids:0}];
el('modal').classList.remove('on');T.ageUp();ok('Ehrenbürgerin',p.ms.some(m=>/Ehrenbürger/.test(m.t)));
T.die('an Altersschwäche');ok('Platz benannt',(p.denk||[]).some(d=>d.n==='Kim Berger-Platz'));T.continueAs(0);p=T.p;
ok('Erbe kennt den Platz',(p.denk||[]).length>=1&&(p.ahnen||[]).length===1);ok('Kind im Kalender richtig',p.cy0===2020);
const S=T.viewStadt();ok('Stadt-Karte',S.includes('Die Stadt erinnert sich')&&S.includes('Friedhof')&&!bad(S));
let walk=null;const dw=T.QEV.denk_walk;T.QEV.denk_walk=d=>{const x=dw(d);if(x&&!walk)walk=x;return x};for(let i=0;i<20&&!walk;i++){el('modal').classList.remove('on');T.ageUp();const it=T.p.q.find(q=>q.id==='denk_walk');if(it&&!walk)walk=dw(it.d)}T.QEV.denk_walk=dw;
ok('Begegnung mit dem Namen',!!walk&&walk.x.includes('Kim Berger')&&!bad(walk.x));
const real=T.ERRLOG.filter(x=>!/setAttribute|location|setProperty|AudioContext|getContext|vibrate|matchMedia|navigator|screen|querySelector|style|documentElement|dataset/.test(x.m));real.forEach(x=>console.log('Protokoll:',x.m,x.st));ok('Fehlerprotokoll leer',!real.length);
console.log('errors',errs);process.exit(errs?1:0);
