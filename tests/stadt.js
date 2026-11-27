// Prüft Stadtplanung (Viertel, Orte, Seed), Stadtwandel über viele Jahre und eigene Gebäude auf der Karte. Läuft ohne 3D.
require('./lib/zufall').seed();
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=f=>{try{f()}catch(e){}};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body'),documentElement:{style:{setProperty(){}}}};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,layout,cityOpts,cityYear,cityS,ownList,viewStadt,PLACES,ZG,get p(){return p},setDialog:f=>dialog=f};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};T.setDialog(()=>{});
const RULE={hafen:'H',casino:'W',villa:'V',park:'G',jva:'I',buero:'C',boerse:'C',bank:'C',mall:'B',klinik:'R',schule:'R'};
for(let s=1;s<=300;s++){const L=T.layout(s*7919);const ids=L.cells.filter(c=>c.place).map(c=>c.place);
  ok('alle Orte vorhanden '+s,T.PLACES.every(p=>ids.includes(p.id)));ok('kein Ort doppelt '+s,new Set(ids).size===ids.length);
  L.cells.forEach(c=>{if(c.place&&RULE[c.place])ok(c.place+' im richtigen Viertel ('+c.zone+') '+s,c.zone===RULE[c.place]);ok('Höhe gesetzt',c.top>0||c.zone==='G');ok('Koordinaten',isFinite(c.x)&&isFinite(c.z))});
  const L2=T.layout(s*7919);ok('Seed reproduzierbar '+s,JSON.stringify(L2.cells.map(c=>[c.place,c.x,c.z,c.lots.length]))===JSON.stringify(L.cells.map(c=>[c.place,c.x,c.z,c.lots.length])));
  const hz=['V','W','H','C'][s%4],L3=T.layout(s,{hz});ok('Zuhause im Wunschviertel '+hz,L3.cells.find(c=>c.place==='home').zone===hz)}
// Wasser liegt immer an einer Seite: Hafen und Ufer haben dieselbe Außenkante
{const L=T.layout(42);const H=L.cells.filter(c=>c.zone==='H'||c.zone==='W');ok('Ufer in letzter Reihe',H.filter(c=>c.j===7).length>=6)}
// Stadtwandel über ein ganzes Leben
T.newLife('Kim','Test','w',0,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'reich'});
let opened=0,closed=0,keys=new Set();
for(let y=0;y<85;y++){const p=T.p;if(!p.alive)break;const before=JSON.stringify(p.cityS&&p.cityS.shops||{});el('modal').classList.remove('on');try{T.ageUp()}catch(e){errs++;console.log('ERR',e.message);break}
  const s=T.cityS();Object.values(s.dw).forEach(v=>ok('Viertel im Rahmen',v>=-1&&v<=1));const sh=Object.values(s.shops);opened+=sh.filter(x=>x.open&&x.y===T.p.age).length;closed+=sh.filter(x=>!x.open&&x.y===T.p.age).length;keys.add(T.cityOpts().key);
  if(y===30){p.money=5e6;p.props=p.props||[];}}
const s=T.cityS();ok('Stadt baut aus',s.dev>=3);ok('Läden eröffnen',opened>0);ok('Läden schließen',closed>0);ok('Stadt verändert sich sichtbar',keys.size>5);
ok('Stadtleben-Karte',!/undefined|NaN/.test(T.viewStadt()));
// Eigene Firmen und Immobilien bekommen Bauplätze
T.newLife('Kim','Test','m',30,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'reich'});const p=T.p;
p.biz={co:'X',fronts:['kiosk','pizza'],firm:{name:'Kim AG'},shop:null,bank:null};p.props=[{id:5,t:'haus',d:1,val:1},{id:6,t:'mfh',d:4,val:1},{id:7,t:'wohnung',d:0,val:1}];
const o=T.cityOpts();ok('eigene Liste',o.own.length===6);const L=T.layout(p.seed,o);const own=L.cells.flatMap(c=>c.own.map(x=>[x,c]));
ok('alle eigenen Gebäude auf der Karte',own.length===6);own.forEach(([x,c])=>{ok('Bauplatz frei',!c.place);if(x.id==='p6')ok('Hafen-Immobilie am Hafen',c.zone==='H'||c.zone==='I');if(x.id==='p5')ok('Seeviertel am Ufer',c.zone==='V'||c.zone==='W')});
console.log('Läden geöffnet',opened,'geschlossen',closed,'Ausbau',s.dev,'verschiedene Stadtbilder',keys.size);console.log('errors',errs);process.exit(errs?1:0);
