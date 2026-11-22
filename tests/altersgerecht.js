// Spielt 80 Leben von 0 bis 17 und listet jede Nachricht, jedes Ereignis und jeden Chat mit dem frühesten Alter in /tmp/altersgerecht.txt.
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=f=>{try{f()}catch(e){}};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
let src=(s=>s.split('<script>')[1].split('</script>')[0])(require('fs').readFileSync(require('path').join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+`;global.T={applyCfg,newLife,ageUp,QEV,EVENTS,get p(){return p},setNotify:f=>notify=f,setShow:f=>showEvent0=f,setDialog:f=>dialog=f,setToast:f=>toast=f};`;eval(src);
const seen={};const rec=(kind,age,t)=>{const k=kind+': '+String(t).slice(0,110);if(!seen[k])seen[k]={n:0,a:age};seen[k].n++;seen[k].a=Math.min(seen[k].a,age)};
let curAge=0;T.setNotify((t)=>rec('Benachrichtigung',curAge,t));T.setToast(t=>rec('Toast',curAge,t));T.setDialog((h,x)=>rec('Dialog',curAge,h+' – '+x));
T.setShow(e=>{rec('Ereignis',curAge,e.t+' – '+(typeof e.x==='function'?e.x():e.x));});
for(let life=0;life<80;life++){T.newLife('Kim','Test',pick(['w','m']),0,false);T.applyCfg({act:6,clock:false,ev:'normal',big:true,wealth:'normal'});
  for(let y=0;y<17;y++){const p=T.p;curAge=p.age;el('modal').classList.remove('on');try{T.ageUp()}catch(e){console.log('ERR',e.message);break}curAge=T.p.age;
    let g=0;while(T.p.q.length&&g++<10){const q=T.p.q.shift();const e=T.QEV[q.id]&&T.QEV[q.id](q.d);if(e&&e.c()){rec('Ereignis',curAge,e.t+' – '+(typeof e.x==='function'?e.x():e.x));try{pick(e.o)[1]()}catch(x){}}}
    // auch zufällige EVENTS prüfen
    T.EVENTS.filter(e=>e.c()).forEach(e=>rec('Zufallsereignis möglich',curAge,e.t));}
  const p=T.p;(p.mail||[]).forEach(m=>rec('Brief',m.a||'?',m.t||m.k||JSON.stringify(m).slice(0,80)));
  Object.entries(p.chats||{}).forEach(([id,c])=>(c.msgs||[]).forEach(m=>{if(!m.me)rec('Chat '+id,m.a,m.t)}));
  (p.log||[]).forEach(l=>{if(l.a<18)rec('Verlauf',l.a,l.t)})}
const L=Object.entries(seen).filter(([k])=>!k.startsWith('Verlauf')).sort((a,b)=>a[1].a-b[1].a);
require('fs').writeFileSync('/tmp/altersgerecht.txt',L.map(([k,v])=>'ab '+v.a+' ('+v.n+'×) '+k).join('\n'));
require('fs').writeFileSync('/tmp/altersgerecht_verlauf.txt',Object.entries(seen).filter(([k])=>k.startsWith('Verlauf')).sort((a,b)=>a[1].a-b[1].a).map(([k,v])=>'ab '+v.a+' ('+v.n+'×) '+k).join('\n'));
console.log(L.length);
