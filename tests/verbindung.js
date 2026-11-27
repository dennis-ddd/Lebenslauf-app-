// Prüft die Verbindungen aus v6.0: Freunde im Chat, Lebensfilm mit Freunden, Tieren und Amt,
require('./lib/zufall').seed();
// Generationswechsel mit Elternhaus, Onkel/Tante, Erbstück und Erinnerungen der Eltern.
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};global.console.warn=()=>{};
const store={};const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:k=>store[k]??null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
const fs=require('fs'),path=require('path');let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={viewChats,setChat:x=>chatSel=x,KEEP,ERRLOG,applyCfg,newLife,ageUp,QEV,act,die,continueAs,contacts,msg,replyOpts,filmScenes,viewFamilie,fkMake,setFam:t=>famTab=t,get p(){return p},setDialog:f=>dialog=f};';
eval(src);T.setDialog(()=>{});
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};const bad=h=>/undefined|NaN|\[object/.test(h);
T.newLife('Kim','Berger','w',58,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});let p=T.p;
const a=T.fkMake('Studium');a.n='Jonas';a.g='m';a.cl=85;a.tr='lustig';const b=T.fkMake('Arbeit');b.n='Sophie';b.g='w';b.cl=70;b.tr='treu';p.fk=[a,b];
p.partner={name:'Alex',rel:70,g:'m',mar:true};p.kids=[{n:'Mia',b:p.age-30,g:'w',rel:80,st:{in:60,ge:90},ts:40,tal:'sport',edu:'Abitur',fd:{},kids:0}];
p.props=[{id:1,t:'wohnung',d:0,val:300000,paid:250000,cond:80,lvl:1,units:1,rb:1,ten:[],use:'self',bd:{},jobs:[],col:null}];p.pets=[{t:'hund',n:'Bello',age:5,b:80,tr:'verspielt',tk:[],hp:90,id:'p1'}];
p.pol={lvl:2,party:0,pop:60,camp:0,th:['wohnen'],g:{buerger:60,wirtschaft:50,umwelt:50},dec:[{a:55,t:'Abstimmung: Radwege',o:'Dafür stimmen',l:2}]};
p.skm=[{k:'nbloan',a:40,d:{n:'Tom',c:8000}}];p.ehist=[{t:'Ein Geldbeutel!',o:'Zurückbringen',a:9}];p.ruf=50;
// Freunde im Chat
let C=T.contacts();ok('Freunde als Kontakte',C.some(c=>c.n==='Jonas')&&C.some(c=>c.n==='Sophie'));
const cj=C.find(c=>c.n==='Jonas').id;T.msg(cj,'Wie geht’s dir wirklich?');p.chats[cj].pend=true;const r0=a.cl;const R=T.replyOpts(cj);ok('Antworten',R.length>=3);T.act('reply',cj+':lieb');ok('Antwort ändert Nähe',a.cl>r0||a.cl===100);
for(let i=0;i<3;i++){el('modal').classList.remove('on');T.ageUp()}ok('Freunde schreiben',Object.keys(p.chats).some(k=>k.startsWith('fk_')&&p.chats[k].msgs.some(m=>!m.me)));
{T.setChat(null);const h=T.viewChats();ok('Chat-Liste mit Freunden',h.includes('Jonas')&&!bad(h));T.setChat(cj);const h2=T.viewChats();ok('Chat mit Freund',h2.includes('rp-lieb')||h2.includes('Jonas'));T.setChat(null)}
// Lebensfilm
const S=T.filmScenes().join('');ok('Film: Menschen',S.includes('Deine Menschen')&&S.includes('Jonas'));ok('Film: Tiere',S.includes('Deine Tiere')&&S.includes('Bello'));ok('Film: Amt',S.includes('Dein Amt'));ok('Film ohne Fehler',!bad(S));
// Generationswechsel
p.keepNew=['taschenuhr'];T.die('an Altersschwäche');ok('tot',!T.p.alive);T.continueAs(0);p=T.p;
ok('neue Generation',p.first==='Mia'&&p.gen===2);ok('Elternhaus geerbt',(p.props||[]).some(x=>x.inh&&x.use==='leer'));
ok('Onkel/Tante',(p.fk||[]).filter(f=>f.onkel).length===2);ok('Erbstück',!!p.heirloom&&!!T.KEEP[p.heirloom]);ok('Erinnerungen der Eltern',(p.pmem||[]).length>=2);
ok('verstorbene Mutter schreibt nicht mehr',!T.contacts().some(c=>c.id==='mama'));T.msg('mama','Hallo?');ok('keine Nachricht von der Verstorbenen',!(p.chats.mama&&p.chats.mama.msgs.some(m=>m.t==='Hallo?')));
T.setFam('eltern');const H=T.viewFamilie();ok('In Erinnerung',H.includes('In Erinnerung')&&H.includes('Kim Berger')&&!bad(H));
// Erinnerungen der Eltern kommen zurück
const seen={};for(let y=0;y<25;y++){el('modal').classList.remove('on');T.ageUp();let g=0;while(T.p.q.length&&g++<20){const it=T.p.q.shift();const f=T.QEV[it.id];if(!f)continue;const e=f(it.d);if(!e||!e.c())continue;if(/^sk_pe_/.test(it.id))seen[it.id]=1;try{const r=e.o[0][1]();ok('Text '+it.id,r==null||typeof r==='string'&&!bad(r))}catch(x){errs++;console.log('ERR',it.id,x.message)}}}
console.log('Erinnerungs-Ereignisse:',Object.keys(seen).join(', '));ok('mind. 2 Erinnerungen der Eltern',Object.keys(T.p.pev||{}).length>=2);
const real=T.ERRLOG.filter(x=>!/setAttribute|location|setProperty|AudioContext|getContext|vibrate|matchMedia|navigator|screen|querySelector|style/.test(x.m));real.forEach(x=>console.log('Protokoll:',x.m,x.st));ok('Fehlerprotokoll leer',!real.length);
console.log('errors',errs);process.exit(errs?1:0);
