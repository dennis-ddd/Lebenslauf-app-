// Prüft, dass Chats nicht eintönig werden: Nachrichten passen zur Lebenslage, wiederholen sich nicht
// und die Antwortmöglichkeiten wechseln. Prüft außerdem, dass kein „[object Object]“ in Ereignissen steht.
const pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};global.console.warn=()=>{};
const store={};const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:k=>store[k]??null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
const fs=require('fs'),path=require('path');let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={ERRLOG,SK,applyCfg,newLife,ageUp,QEV,act,msg,replyOpts,ctxLines,chatPick,get p(){return p},setDialog:f=>dialog=f};';
eval(src);T.setDialog(()=>{});let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};
// 40 Jahre: Nachrichten von Mama, Papa, Freund
T.newLife('Kim','Test','w',18,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});let p=T.p;
const got={};for(let y=0;y<40;y++){if(y===5){p.job={id:'buero',t:'Bürokaufmann/-frau',pay:36000,part:false,yrs:0,perf:50}}if(y===8)p.partner={name:'Alex',rel:70,g:'m',mar:false};if(y===12)p.kids.push({n:'Mia',b:p.age,g:'w',rel:70});
  ['mama','papa','freund'].forEach(w=>{const t=T.chatPick(w,['A1','A2','A3','A4','A5','A6','A7','A8']);(got[w]=got[w]||[]).push(t)});el('modal').classList.remove('on');T.ageUp()}
Object.entries(got).forEach(([w,L])=>{for(let i=1;i<L.length;i++){const win=L.slice(Math.max(0,i-6),i);ok(w+': keine Wiederholung in 6 Jahren ('+L[i]+')',!win.includes(L[i]))}
  const ctx=L.filter(t=>!/^A\d$/.test(t)).length;ok(w+': Nachrichten passen zur Lebenslage',ctx>=3);ok(w+': keine Platzhalter',!L.some(t=>/undefined|NaN|\[object/.test(t)))});
{const A=got.mama.concat(got.papa);ok('Kontext: mind. zwei von Job, Partner, Kind',[/Job|Bürokaufmann/,/Alex/,/Mia/].filter(r=>A.some(t=>r.test(t))).length>=2)}
// Antwortmöglichkeiten wechseln bei derselben Nachricht in verschiedenen Jahren
const seenOpts=new Set();for(let i=0;i<6;i++){T.msg('freund','Lust auf Kino?');p.chats.freund.pend=true;T.replyOpts('freund').forEach(o=>seenOpts.add(o[2]));p.age++}
ok('Antworten wechseln',seenOpts.size>=7);
// Geburtstagsdank verschieden
const th=new Set();for(let i=0;i<5;i++){p.act=6;T.act('gratulate','freund');const m=(p.chats.freund.msgs||[]).filter(x=>!x.me).slice(-1)[0];if(m)th.add(m.t);p.age++}
// Kein [object Object] in Ereignissen mit echter Firma
p.biz={co:{name:'Kim GmbH'},hold:false,fronts:['cafe','kiosk'],firm:{name:'Kim Tech',t:'it',val:300000,emp:0,mkt:0,yrs:0,ipo:false,hist:[1],last:null},shop:null,bank:null};
const s=T.SK.find(x=>x.id==='biz_uebernahme');const e=s.ev();ok('Übernahme nennt die Firma',/Kim Tech/.test(e.x)&&!/object/.test(e.x));
console.log('Antwortvarianten',seenOpts.size,'· Beispiel Mama:',got.mama.slice(5,9).join(' | '));
console.log('errors',errs);process.exit(errs?1:0);
