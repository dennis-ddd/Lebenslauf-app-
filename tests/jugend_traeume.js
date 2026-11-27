// Prüft v6.1: Jugend-Entscheidungen (13 bis 17), Lebensträume, Lebenslinie und die späte Folge der Zivilcourage.
require('./lib/zufall').seed();
const pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};global.console.warn=()=>{};
const store={};const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:k=>store[k]??null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
const fs=require('fs'),path=require('path');let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={ERRLOG,JUG,DREAMS,applyCfg,newLife,ageUp,QEV,act,viewHome,viewLeben,filmScenes,setL:t=>lTab=t,get p(){return p},setDialog:f=>dialog=f};';
eval(src);T.setDialog(()=>{});let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};const bad=h=>/undefined|NaN|\[object/.test(h);
// Jugend über 25 Leben
const seen={};let teenEv=0,teenY=0;
for(let l=0;l<25;l++){T.newLife('Kim','Test',pick(['w','m']),12,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});
  for(let y=0;y<6;y++){el('modal').classList.remove('on');T.ageUp();teenY++;let g=0;while(T.p.q.length&&g++<20){const it=T.p.q.shift();const f=T.QEV[it.id];if(!f)continue;const e=f(it.d);if(!e||!e.c())continue;if(/^sk_j_/.test(it.id)){seen[it.id]=(seen[it.id]||0)+1;teenEv++;ok('Kategorie Jugend',e.cat==='Jugend')}
    try{const r=pick(e.o)[1]();ok('Text '+it.id,r==null||typeof r==='string'&&!bad(r))}catch(x){errs++;console.log('ERR',it.id,x.message)}}}}
console.log('Jugend-Ereignisse:',Object.keys(seen).length,'von',T.JUG.length,'·',(teenEv/teenY).toFixed(2),'pro Jahr');ok('mind. 8 verschiedene Jugend-Ereignisse',Object.keys(seen).length>=8);ok('mind. 0,6 Jugend-Ereignisse pro Jahr',teenEv/teenY>=.6);
// Jedes Jugend-Ereignis in allen Optionen
T.newLife('Kim','Test','w',15,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});T.p.school={t:'Gymnasium'};
T.JUG.forEach(s=>{T.p.age=s.id==='j_roller'?15:s.id==='j_zukunft'?16:15;['jSpr','jBand','jParty','jMob','prak'].forEach(k=>delete T.p[k]);T.p.school={t:'Gymnasium'};const e=s.ev();e.o.forEach(o=>{try{const r=o[1]();ok('Text '+s.id+' '+o[0],typeof r==='string'&&!bad(r))}catch(x){errs++;console.log('ERR',s.id,o[0],x.message)}})});
// Zivilcourage kommt zurück
{const p=T.p;p.skm=[{k:'mutig',a:15,d:{n:'Lena'}}];p.age=30;const e=T.QEV.sk_sp_mutig();ok('Späte Folge Zivilcourage',!!e);if(e){const n0=(p.fk||[]).length;e.o[0][1]();ok('Lena im Freundeskreis',(p.fk||[]).length===n0+1)}}
// Lebensträume
T.newLife('Kim','Test','m',16,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});
['tier','liebe','familie','fit'].forEach(k=>T.act('dream',k));ok('höchstens 3 Träume',T.p.dr.pick.length===3);
T.setL('ziele');const Z=T.viewLeben();ok('Träume-Karte',Z.includes('Deine Träume')&&!bad(Z));
T.p.pets=[{t:'hund',n:'Bello',age:2}];el('modal').classList.remove('on');T.ageUp();ok('Traum erfüllt',!!T.p.dr.done.tier&&T.p.ms.some(m=>/Traum erfüllt/.test(m.t)));
ok('Film: Erfüllte Träume',T.filmScenes().join('').includes('Erfüllte Träume'));
// Lebenslinie
T.p.ms.push({a:16,t:'Erste Band',k:'star'},{a:17,t:'Führerschein',k:'star'});const H=T.viewHome();ok('Lebenslinie',H.includes('Deine Lebenslinie')&&H.includes('Heute')&&!bad(H));
const real=T.ERRLOG.filter(x=>!/setAttribute|location|setProperty|AudioContext|getContext|vibrate|matchMedia|navigator|screen|querySelector|style/.test(x.m));real.forEach(x=>console.log('Protokoll:',x.m,x.st));ok('Fehlerprotokoll leer',!real.length);
console.log('errors',errs);process.exit(errs?1:0);
