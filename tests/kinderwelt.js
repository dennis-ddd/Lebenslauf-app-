// Prüft Spielzeugkiste, Schulranzen, Sparschwein und das Ereignis „Erstes Handy“ über viele Leben ab Geburt.
const pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=f=>{try{f()}catch(e){}};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,QEV,act,get p(){return p},setO:o=>Object.assign(O,o),viewHome,viewApp,kidMode,phoneTier,setDialog:f=>dialog=f};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};T.setDialog(()=>{});
const phoneAge={},pick3={};let smart=0;
for(let life=0;life<80;life++){
  T.newLife('Kim','Test',pick(['w','m']),0,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});T.setO({kidOff:false});
  for(let y=0;y<16;y++){let p=T.p;if(!p.alive)break;
    const m=T.kidMode(),h=T.viewHome();
    if(p.age<6){ok('Kiste mit '+p.age,m==='kiste'&&h.includes('kidw kiste'))}
    else if(!p.kph&&T.phoneTier()===0&&p.age<13){ok('Ranzen mit '+p.age,m==='ranzen'&&h.includes('kidw ranzen'))}
    else ok('Handy mit '+p.age,m===null&&!h.includes('kidw'));
    ok('keine Platzhalter',!/undefined|NaN/.test(h));
    if(m){try{const s=T.viewApp('spar');ok('Sparschwein',s.includes('kwsum'));const l=T.viewApp('leben');ok('Zurück-Text',l.includes(m==='kiste'?'<span>Kiste</span>':'<span>Ranzen</span>'))}catch(e){errs++;console.log('ERR view',e.message)}}
    el('modal').classList.remove('on');try{T.ageUp()}catch(e){errs++;console.log('ERR ageUp',p.age,e.stack.split('\n').slice(0,3).join(' | '));break}
    p=T.p;let g=0;
    while(p.q&&p.q.length&&g++<12){const q=p.q.shift();if(!T.QEV[q.id])continue;let e;try{e=T.QEV[q.id](q.d)}catch(x){errs++;console.log('ERR qev',q.id,x.message);continue}
      if(!e||!e.c())continue;const o=pick(e.o);if(q.id==='k_handy')pick3[o[0]]=(pick3[o[0]]||0)+1;try{o[1]()}catch(x){errs++;console.log('ERR opt',q.id,o[0],x.message)}}
    if(p.kph&&phoneAge.l!==life){phoneAge.l=life;phoneAge[p.age]=(phoneAge[p.age]||0)+1;if(p.items.includes('handy'))smart++}
  }
  ok('mit 13 hat jeder ein Handy',T.p.age<13||T.p.kph||T.phoneTier()>0);
}
// Sparziel wählen und Schalter
T.newLife('Kim','Test','w',6,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});
T.act('sgoal','konsole');ok('Sparziel gesetzt',T.p.sgoal==='konsole'&&T.viewApp('spar').includes('Sparziel: Spielkonsole'));
T.setO({kidOff:true});ok('Schalter aus',T.kidMode()===null&&!T.viewHome().includes('kidw'));T.setO({kidOff:false});
delete phoneAge.l;console.log('Erstes Handy mit Alter:',JSON.stringify(phoneAge),'· Smartphone direkt:',smart,'· Antworten:',JSON.stringify(pick3));
console.log('errors',errs);process.exit(errs?1:0);
