const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),setAttribute(){},onclick:null,dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
let src=(s=>s.split('<script>')[1].split('</script>')[0])(require('fs').readFileSync(require('path').join(__dirname,'..','index.html'),'utf8')).trim();src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,act,get p(){return p},QEV,EVENTS,finalExam,runCityEv,viewChats,setChat:v=>chatSel=v,examResult,reminders,viewHome,setEdit:v=>editApps=v,viewStadt,setTab:v=>tab=v,render};';eval(src);
let errs=0;const t=(n,f)=>{try{f()}catch(e){errs++;if(errs<12)console.log('ERR',n,e.stack.split('\n').slice(0,2).join('|'))}};
for(let r=0;r<60;r++){T.newLife('A','B','w',[6,13,18,30][r%4],false);T.applyCfg({act:0,clock:r%2==0,ev:'normal',big:true,wealth:'normal'});const p=T.p;
 for(let y=0;y<40&&p.alive;y++){el('modal').classList.remove('on');p.act=50;
  ['exam5','sibfight','sibwed','sibhelp','care','erbstreit','bizstaff'].forEach(id=>t(id,()=>{const d=id==='exam5'?pick(['schule','abitur','aus','Medizin','BWL','Jura']):id==='bizstaff'?{k:'shop',t:'streik'}:0;const e=T.QEV[id](d);if(e&&e.c())pick(e.o)[1]()}));
  t('exam',()=>T.finalExam(pick(['schule','Informatik'])));t('city',()=>{T.setTab('stadt');T.viewStadt();T.runCityEv(0)});
  t('chats',()=>{T.setTab('chats');['mama','freund','g_fam','g_klasse','g_job','sib0','partner'].forEach(c=>{T.setChat(c);T.viewChats()});T.setChat(null)});
  t('home',()=>{T.setTab('home');T.setEdit(r%2==0);T.viewHome();T.reminders()});
  t('evs',()=>{const ev=T.EVENTS.filter(e=>e.c());if(ev.length){const e=pick(ev);pick(e.o)[1]()}});
  ['hobby','hobcomp','colkaffee','homeoffice','invyes','reply'].forEach(a=>t(a,()=>T.act(a,a==='reply'?'mama:lieb':a==='invyes'?'freund':'schach')));
  t('age',()=>T.ageUp())}}
console.log('errors',errs);
