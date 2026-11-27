// Prüft Klassenclown (Aktion, Ereignisse, Noten), alle neuen Chat-Nachrichten und Antworten, Gruppenchats und die neuen Einstellungs-Tabs.
require('./lib/zufall').seed();
const pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=f=>{try{f()}catch(e){}};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,QEV,act,ACTS,replyOpts,replyCat,msg,GMSG,GOPT,gOpt,MORE_KID,MORE_TEEN,MORE_ADULT,viewEinst,viewBildung,chatExtra,setTab:t=>einTab=t,get p(){return p},setDialog:f=>dialog=f};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};T.setDialog(()=>{});
// Jede neue Nachricht hat eine passende Antwort-Kategorie und 4 Antworten (inkl. witzig), stabil bei jedem Aufruf
T.newLife('Kim','Test','w',20,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});
[T.MORE_KID,T.MORE_TEEN,T.MORE_ADULT].forEach(M=>Object.entries(M).forEach(([who,L])=>L.forEach(t=>{const k=T.replyCat(who,t);ok('Kategorie für „'+t+'“',k!=='other');
  const p=T.p;p.chats[who]=p.chats[who]||{msgs:[]};p.chats[who].msgs=[{t,me:false,a:p.age}];p.chats[who].pend=true;const A=T.replyOpts(who),B=T.replyOpts(who);
  ok('4 Antworten',A.length===4&&A[3][0]==='witz');ok('stabil',JSON.stringify(A)===JSON.stringify(B));ok('Text ohne Lücke',A.every(x=>x[2]&&!/undefined/.test(x[2])))})));
// Gruppenchats: jede Nachricht hat Optionen, Antworten wirken
Object.keys(T.GMSG).forEach(g=>T.GMSG[g].forEach(x=>{ok('Typ '+x[1],!x[2]||T.GOPT[x[2]])}));
// Klassenclown über eine ganze Schulzeit
const seen={};let maxC=0,preis=0;
for(let life=0;life<30;life++){T.newLife('Kim','Test',pick(['w','m']),6,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});
  for(let y=0;y<13;y++){let p=T.p;if(!p.alive)break;const n=life%3===0?0:life%3===1?2:4;for(let i=0;i<n;i++){p.act=6;try{T.act('clown')}catch(e){errs++;console.log('ERR clown',e.message)}}
    if(p.chats.g_klasse&&p.chats.g_klasse.pend){try{T.gOpt('g_klasse',pick(['witz','still','hilf','lach','dabei','trost','danke']))}catch(e){errs++;console.log('ERR gopt',e.message)}}
    el('modal').classList.remove('on');try{T.ageUp()}catch(e){errs++;console.log('ERR ageUp',e.stack.split('\n').slice(0,2).join('|'));break}p=T.p;
    ok('Clown 0–100',(p.clown||0)>=0&&(p.clown||0)<=100);ok('Beliebtheit 0–100',(p.cpop||50)>=0&&(p.cpop||50)<=100);maxC=Math.max(maxC,p.clown||0);
    let g=0;while(p.q&&p.q.length&&g++<14){const q=p.q.shift();if(!T.QEV[q.id])continue;const e=T.QEV[q.id](q.d);if(!e||!e.c())continue;seen[q.id]=(seen[q.id]||0)+1;if(q.id==='k_clpreis')preis++;const o=pick(e.o);try{const r=o[1]();ok('Text '+q.id,typeof r==='string'&&!/undefined|NaN/.test(r))}catch(x){errs++;console.log('ERR',q.id,x.message)}}
    if(y===6){const h=T.viewBildung();ok('Klassen-Karte',h.includes('In der Klasse')&&!/undefined|NaN/.test(h))}}}
ok('Clown-Ereignisse',['k_cltafel','k_cltheater','k_clstreich'].every(k=>seen[k]>0));ok('Clown des Jahrgangs',preis>0);
// Einstellungen: alle Tabs, Rivale nur einmal
T.newLife('Kim','Test','w',25,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});
['spiel','look','bed','help'].forEach(t=>{T.setTab(t);const h=T.viewEinst();ok('Tab '+t,h.length>200&&!/undefined|NaN/.test(h));if(t==='spiel'){ok('Wie beim Start',h.includes('Wie beim Start'));ok('Rivale einmal',(h.match(/data-g="rival"/g)||[]).length===1)}});
console.log('Ereignisse',JSON.stringify(seen),'höchster Clown-Wert',maxC);console.log('errors',errs);process.exit(errs?1:0);
