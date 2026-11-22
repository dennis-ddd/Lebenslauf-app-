// Spielt Leben ab Geburt durch, beantwortet alle Ereignisse zufällig und prüft die Kindheits-Systeme.
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=f=>{try{f()}catch(e){}};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,QEV,act,get p(){return p},setO:o=>Object.assign(O,o),viewLeben,viewDiary,viewFreizeit,setF:v=>fTab=v,continueAs,setDialog:f=>dialog=f};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};T.setDialog(()=>{});
const seen={},stats={prag:{},last:[],ther:0,gest:0,back:0,fear:0,nbBaby:0};
for(let life=0;life<120;life++){
  T.newLife('Kim','Test',pick(['w','m']),0,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});T.setO({heavyOff:life%10===9});
  for(let y=0;y<75;y++){let p=T.p;if(!p.alive)break;
    el('modal').classList.remove('on');try{T.ageUp()}catch(e){errs++;console.log('ERR ageUp',p.age,e.stack.split('\n').slice(0,3).join(' | '));break}
    p=T.p;let guard=0;
    while(p.q&&p.q.length&&guard++<12){const q=p.q.shift();if(!T.QEV[q.id])continue;let e;try{e=T.QEV[q.id](q.d)}catch(x){errs++;console.log('ERR qev',q.id,x.message);continue}
      if(!e||!e.c())continue;seen[q.id]=(seen[q.id]||0)+1;if(q.id.startsWith('nb')&&p.age<14)stats.nbBaby++;
      const o=pick(e.o);try{o[1]()}catch(x){errs++;console.log('ERR opt',q.id,o[0],x.message)}}
    if(p.ther&&p.ther.y<=p.age)for(let s=0;s<4;s++){p.act=6;try{T.act('therapie')}catch(x){errs++;console.log('ERR ther',x.message)}}
    if(p.age===16)(p.prag||[]).forEach(k=>stats.prag[k]=(stats.prag[k]||0)+1)}
  const p=T.p;stats.last.push(p.slast||0);if(p.ther||p.medi)stats.ther++;if((p.prag||[]).includes('gestaerkt'))stats.gest++;stats.back+=(p.km||[]).filter(m=>m.back).length;if(p.fears&&p.fears.wasser)stats.fear++;
  try{T.viewLeben();T.viewDiary();T.setF('gesund');T.viewFreizeit()}catch(x){errs++;console.log('ERR view',x.message)}}
ok('keine Nachbar-Ereignisse vor 14',stats.nbBaby===0);
['k_spielplatz','trauma','kmback','reunion'].forEach(k=>ok('ereignis '+k,seen[k]>0));
// Alle Baby-Meilensteine und Minispiele einmal direkt durchspielen
T.newLife('Baby','Test','w',0,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});
['m_laecheln','m_zahn','m_wort','m_krabbel','m_laufen','m_brokkoli','m_bau','m_haare','m_kita','m_warum','k_schwimm'].forEach(k=>{const e=T.QEV[k]();ok('baby '+k,e&&e.c());e.o.forEach(o=>{try{const r=o[1]();if(typeof r!=='string')console.log('kein Text',k)}catch(x){errs++;console.log('ERR baby',k,o[0],x.message)}})});
['scheidung','oma','mobbing','unfall','brand','sucht'].forEach(k=>{const e=T.QEV.trauma(k);ok('trauma '+k,e&&e.help);e.o.forEach(o=>o[1]())});
T.p.slast=60;T.p.age=30;['krise'].forEach(k=>{const e=T.QEV[k]();e.o.forEach(o=>o[1]())});
T.setO({heavyOff:true});ok('schalter',!T.QEV.trauma('oma').c());T.setO({heavyOff:false});
console.log('Ereignisse:',Object.entries(seen).filter(([k])=>/^(m_|k_|trauma|ausl|krise|kmback|reunion|lfrage)/.test(k)).map(([k,v])=>k+' '+v).join(', '));
console.log('Prägungen mit 16:',JSON.stringify(stats.prag),'| Therapie:',stats.ther,'Gestärkt:',stats.gest,'Rückkehrer:',stats.back,'Wasserangst:',stats.fear);
const L=stats.last.sort((a,b)=>a-b);console.log('Seelische Last am Ende: Median',L[L.length>>1],'Max',L[L.length-1]);
console.log('errors',errs);
