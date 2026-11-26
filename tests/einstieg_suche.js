// Prüft Erste Schritte, den Zeitraffer der Babyjahre und die Suche.
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=f=>{try{f()}catch(e){console.log('TO',e.message)}};global.clearTimeout=()=>{};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={showAllUpdates,CHANGES,applyCfg,newLife,ageUp,act,viewHome,srchFind,srchIndex,fsCheck,O,QEV,showEvent0,get p(){return p},get tab(){return tab},setDialog:f=>dialog=f};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};T.setDialog(()=>{});
// Zeitraffer
for(let i=0;i<10;i++){T.newLife('Kim','Test','w',0,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});ok('Karte',T.viewHome().includes('fastgo'));el('modal').classList.remove('on');T.act('fastgo');ok('Alter 6',T.p.age===6);ok('kein Zeitraffer mehr',!T.viewHome().includes('fastgo'));ok('Meilenstein',T.p.ms.some(m=>m.t==='Babyjahre im Zeitraffer'))}
// Erste Schritte
T.O.firstDone=0;T.newLife('Kim','Test','w',14,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});ok('Erste Schritte sichtbar',T.viewHome().includes('Erste Schritte'));
el('modal').classList.remove('on');T.ageUp();T.act('goto','freizeit');T.act('goto','home');T.p.act=6;T.act('lernen');T.p.ehist=[{t:'x',o:'y',a:15}];T.p.chats.mama=T.p.chats.mama||{msgs:[]};T.p.chats.mama.msgs.push({t:'Hi',me:true,a:15});T.fsCheck();
ok('alle Schritte',!!T.O.firstDone);ok('verschwindet',!T.viewHome().includes('fsc'));
// Suche
T.newLife('Kim','Test','m',30,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});T.p.pets=[{t:'hund',n:'Bello',age:3}];T.p.apps=Object.assign(T.p.apps||{},{wege:1});
const I=T.srchIndex();ok('Index groß',I.length>30);ok('ohne Fehler',I.every(r=>r.t&&!/undefined/.test(r.t+r.sub)));
[['friseur','Friseur'],['mama','Mama'],['bello','Bello'],['bank','Bank'],['joggen',null],['haustier','Haustiere'],['wahl','Politik']].forEach(([q,exp])=>{const r=T.srchFind(q);ok('Suche '+q+' → '+(r[0]&&r[0].t),r.length>0&&(!exp||r.some(x=>x.t===exp)))});
ok('Unsinn findet nichts',T.srchFind('xqzv').length===0);
const r=T.srchFind('friseur')[0];T.act(r.a,r.g);if(r.b)T.act(r.b,r.g2);ok('Navigation',T.tab==='freizeit');
// Update-Hinweise: jeder Eintrag lässt sich anzeigen
try{T.showAllUpdates();ok('Was ist neu',true)}catch(e){ok('Was ist neu: '+e.message,false)}
T.CHANGES.forEach(c=>ok('Eintrag '+c.v,c.v&&c.t&&Array.isArray(c.neu||[])));
console.log('errors',errs);process.exit(errs?1:0);
