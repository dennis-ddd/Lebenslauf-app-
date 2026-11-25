// Prüft Lebensfilm, Lebensalbum mit Erinnerungsstücken und die Zweite Chance.
const pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};
const store={};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:k=>store[k]??null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,die,QEV,filmScenes,viewDeath,viewAlbum,canSecond,secondChance,ALB,KEEP,get p(){return p},setDialog:f=>dialog=f};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};T.setDialog(()=>{});const bad=h=>/undefined|NaN|\[object/.test(h);
for(let life=0;life<25;life++){T.newLife('Kim','Test'+life,pick(['w','m']),0,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});
  let y=0;while(T.p.alive&&y++<110){el('modal').classList.remove('on');try{T.ageUp()}catch(e){errs++;console.log('ERR ageUp',e.message);break}const p=T.p;let g=0;while(p.q&&p.q.length&&g++<12){const q=p.q.shift();const e=T.QEV[q.id]&&T.QEV[q.id](q.d);if(e&&e.c()){try{pick(e.o)[1]()}catch(x){}}}
    if(p.age===28&&!p.kids.length)p.kids.push({n:'Mia',b:p.age,g:'w',rel:60})}
  if(T.p.alive){T.die('an Altersschwäche')}
  const p=T.p;ok('tot',!p.alive);
  const S=T.filmScenes();ok('Film hat Szenen',S.length>=3);S.forEach(h=>ok('Szene ohne Fehler: '+h.slice(0,80),!bad(h)));
  const h=T.viewDeath();ok('Filmknopf',h.includes('data-lf="film"'));ok('Tod ohne Fehler',!bad(h));
  if(life===0){ok('Zweite Chance angeboten',T.canSecond()&&h.includes('data-lf="second"'));const a=p.age;T.secondChance();ok('zurückgespult',T.p.alive&&T.p.age===a-1&&T.p.used2c===1);
    let z=0;while(T.p.alive&&z++<60){try{T.ageUp()}catch(e){break}}if(T.p.alive)T.die('an Altersschwäche');ok('nur einmal',!T.canSecond())}}
ok('Album gefüllt',T.ALB.lives.length>=25);ok('Erinnerungsstücke gesammelt',Object.keys(T.ALB.keep).length>=3);
ok('gespeichert',JSON.parse(store['lebenslauf-album']).lives.length===T.ALB.lives.length);
const a=T.viewAlbum();ok('Album ohne Fehler',!bad(a));
console.log('Leben',T.ALB.lives.length,'Stücke',Object.keys(T.ALB.keep).join(', '));console.log('errors',errs);process.exit(errs?1:0);
