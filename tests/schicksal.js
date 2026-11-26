// Prüft das zentrale Ereignissystem: Lebenslage-Ereignisse, Spätfolgen, Gedächtnis und Wendepunkte.
const pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=f=>{try{f()}catch(e){}};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,QEV,SK,SPAET,showEvent0,rufCard,get p(){return p},setDialog:f=>dialog=f};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};let lastO=null;T.setDialog((t,x,o)=>{lastO=o});
const seen={};
for(let life=0;life<60;life++){T.newLife('Kim','Test',pick(['w','m']),12,false);T.applyCfg({act:6,clock:false,ev:pick(['normal','oft']),big:false,wealth:pick(['normal','reich'])});
  for(let y=0;y<70;y++){let p=T.p;if(!p.alive)break;
    if(p.age===25&&!p.job)p.job={id:'buero',t:'Bürokaufmann/-frau',pay:36000,part:false,yrs:0,perf:50};
    if(p.age===27&&!p.partner)p.partner={name:'Alex',rel:40,g:'m',mar:false};
    if(p.age===29&&!p.kids.length)p.kids.push({n:'Mia',b:p.age,g:'w',rel:60});
    el('modal').classList.remove('on');try{T.ageUp()}catch(e){errs++;console.log('ERR ageUp',e.stack.split('\n').slice(0,3).join('|'));break}p=T.p;
    let g=0;while(p.q&&p.q.length&&g++<20){const q=p.q.shift();if(!T.QEV[q.id])continue;let e;try{e=T.QEV[q.id](q.d)}catch(x){errs++;console.log('ERR ev',q.id,x.message);continue}if(!e||!e.c())continue;
      if(q.id.startsWith('sk_')){seen[q.id]=(seen[q.id]||0)+1;ok('Kategorie '+q.id,!!e.cat);if(q.id.startsWith('sk_sp_'))ok('Erinnerung '+q.id,!!e.back&&!/undefined/.test(e.back))}
      lastO=null;try{T.showEvent0(e)}catch(x){}
      const o=lastO&&lastO.length?pick(lastO):pick(e.o);try{const r=o[1]();ok('Text '+q.id,r==null||typeof r==='string'&&!/undefined|NaN/.test(r))}catch(x){errs++;console.log('ERR',q.id,x.message)}}
    ok('Gedächtnis begrenzt',(p.ehist||[]).length<=300)}
  if(life===5){const h=T.rufCard();ok('Entscheidungskarte',!/undefined|NaN/.test(h))}}
// Gezielt: jedes Ereignis in passender Lage auslösen
T.newLife('Kim','Test','w',40,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});{const p=T.p;
 p.money=500000;p.home='wohnung';p.job={id:'buero',t:'Bürokaufmann/-frau',pay:36000,part:false,yrs:0,perf:50};p.partner={name:'Alex',rel:30,g:'m',mar:true};
 p.kids=[{n:'Mia',b:p.age-19,g:'w',rel:60},{n:'Ben',b:p.age-14,g:'m',rel:60},{n:'Lea',b:p.age-25,g:'w',rel:60}];p.biz={co:{name:'Kim GmbH'},hold:false,fronts:[],firm:{name:'Kim GmbH',t:'it',val:300000,emp:0,mkt:0,yrs:0,ipo:false,hist:[1],last:null},shop:null,bank:null};
 p.props=[{use:'rent',val:200000}];p.rival={n:'Max',friend:0};p.st.gl=30;p.st.ge=40;
 p.ehist=[{t:'Ein Geldbeutel!',o:'Zurückbringen',a:9},{t:'Ein Geldbeutel!',o:'Das Geld behalten',a:10},{t:'Abschreiben?',o:'Heft rüberschieben',a:11},{t:'Der Rivale braucht Hilfe',o:'Helfen (5.000 €)',a:30}];
 p.skm=['nbloan','kidsupport','kidstopped','kidloan','affaere','mieterhilfe','sabbat','lebensstil','burnout_ignore'].map(k=>({k,a:30,d:{n:'Tom',c:5000,i:0}}));
 [...T.SK,...T.SPAET].forEach(s=>{if(['neustart'].includes(s.id))return;const w=s.w();if(!w){console.log('kein Gewicht',s.id);return}
  for(let t=0;t<6;t++){if(!s.w())break;let e;try{e=s.ev()}catch(x){errs++;console.log('ERR',s.id,x.message);return}if(!e)continue;seen['sk_'+s.id]=1;e.o.forEach(o=>{const sv=JSON.stringify(p);try{const r=o[1]();ok('Text '+s.id,r==null||typeof r==='string'&&!/undefined|NaN/.test(r))}catch(x){errs++;console.log('ERR',s.id,o[0],x.message)}})}})}
const all=T.SK.map(s=>'sk_'+s.id),sp=T.SPAET.map(s=>'sk_'+s.id);
console.log('Lebenslage',all.filter(k=>seen[k]).length+'/'+all.length,'Spätfolgen',sp.filter(k=>seen[k]).length+'/'+sp.length);
console.log('nie gesehen:',all.concat(sp).filter(k=>!seen[k]).join(', '));
ok('mind. 10 Lebenslage-Ereignisse',all.filter(k=>seen[k]).length>=10);ok('mind. 6 Spätfolgen',sp.filter(k=>seen[k]).length>=6);
console.log('errors',errs);process.exit(errs?1:0);
