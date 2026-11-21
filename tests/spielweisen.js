// Simuliert 5 Spielweisen mit je N Leben und schreibt eine Auswertung nach tests/spielweisen.json
const N=+process.argv[2]||50;
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=f=>{try{f()}catch(e){}return 0};global.clearTimeout=()=>{};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),setAttribute(){},onclick:null,dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};global.navigator={};
const html=require('fs').readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
let src=html.split('<script>')[1].split('</script>')[0].trim().replace(/^\{/,'').replace(/\}\s*$/,'');
// Dialoge automatisch beantworten: Ereignisse zufällig, Jahresrückblick sofort weiter
src+=';htmlDialog=function(h,l,then){if(then)then()};dialog=function(t,x,opts){if(opts&&opts.length){const o=opts[Math.floor(Math.random()*opts.length)];if(o[1])o[1]()}};toast=function(){};'+
 'global.T={applyCfg,newLife,ageUp,act,get p(){return p},JOBS,canJob,netWorth,status,STOCKS,FR,O,saveO};';
eval(src);
T.O.mini='skip';T.O.rival=true;
const A=(id,arg)=>{try{T.act(id,arg)}catch(e){errs++}};let errs=0;
const bestJob=()=>T.JOBS.filter(j=>!T.canJob(j)&&j.id!=='influ').sort((a,b)=>b.pay-a.pay)[0];
const S={
 fleissig(p){const a=p.age;
  if(a>=6&&p.school){A('lernen');A('lernen');A('sport')}
  if(!p.school&&a>=17&&p.edu==='Abitur'&&!p.deg&&!p.study)A('study',p.st.in>=75?'Medizin':pick(['Informatik','Jura','Architektur']));
  if(!p.school&&a>=16&&p.edu!=='Abitur'&&!p.aus&&!p.azubi)A('azubi');
  if(a>=16&&!p.study&&!p.azubi&&!p.school){const j=bestJob();if(j&&(!p.job||(p.job.pay<j.pay*.8&&!j.part)))A('apply',j.id)}
  if(a>=20&&!p.partner)A('date');if(p.partner&&!p.partner.mar&&a>=26)A('propose');if(p.partner&&p.partner.mar&&p.kids.length<2&&a>=28&&a<=40)A('baby');
  if(p.st.ge<65)A('arzt');if(p.job)A('work');A('sport');A('lesen')},
 influencer(p){const a=p.age;
  if(p.school&&a>=6){A('lernen');A('sport')}
  if(a>=13){A('appget','klick');if(!p.items.includes('handy')&&p.money>=400)A('buy','handy');A('smjoin');A('chcreate');
   const sm=p.sm;if(sm){for(let i=0;i<10&&sm.pl>0;i++)A('post',pick(['selfie','outfit','food','meme','workout','reise']));
    if(sm.ch){for(let i=0;i<8&&sm.ch.sl>0;i++){A('chfmt',pick(['immer','chat','crazy','irl','marathon','kollab','charity']));A('golive')}for(let i=0;i<3;i++)A('video',pick(['gaming','vlog']))}
    if((sm.fol>=10000||(sm.ch&&sm.ch.subs>=5000))&&(!p.job||p.job.id!=='influ'))A('apply','influ');
    if(sm.fol>=3000)A('spon','Blitz Energy');if(p.money>20000)A('studio','merch')}}
  if(a>=16&&!p.job&&!p.school){const j=bestJob();if(j)A('apply',j.id)}
  if(a>=20&&!p.partner)A('date');if(p.st.ge<60)A('arzt');A('sport');if(p.job&&p.job.id!=='influ')A('work')},
 unternehmer(p){const a=p.age;
  if(p.school&&a>=6){A('lernen');A('lernen')}
  if(a>=13&&a<18&&!p.job)A('apply','zeitung');
  if(a>=18){if(!p.job||p.job.part){const j=bestJob();if(j)A('apply',j.id)}A('appget','geschaefte');A('appget','boerse');A('cofound');
   for(const k of ['kiosk','wasch','pizza','cafe','club','hotel'])if(T.FR[k]&&p.money>T.FR[k].cost*1.3)A('front',k);
   if(p.biz&&p.biz.co){if(!p.biz.shop&&p.money>15000){A('shopcat','technik');A('shopfound')}if(p.biz.shop&&p.money>20000)A('prodnew');
    (p.biz.fronts||[]).forEach(k=>{if(p.money>T.FR[k].cost)A('fil',k);if(p.money>T.FR[k].profit)A('frqual',k)});if(p.money>30000)A('mkt','klick');
    (p.biz.comp||[]).forEach(c=>A(pick(['cpprice','cpqual','cpbuy']),c.k))}
   if(p.money>50000)A('buyst',pick(T.STOCKS).id+':'+Math.round(p.money*.15));if(p.job)A('work')}
  if(p.st.ge<60)A('arzt');A('sport');if(a>=25&&!p.partner)A('date')},
 kriminell(p){const a=p.age;
  if(p.school&&a>=10)A('schwaenzen');
  if(a>=14){A('appget','strasse');A(pick(['klau','tasche']));if(a>=16)A(pick(['einbruch','klau','hack']));if(a>=21&&ch2(.3))A('bankraub')}
  if(a>=16){A('appget','wege');A('ga_join');if(p.gang){A('ga_job',p.gang.rank>=3?'coup':p.gang.rank>=2?'revier':p.gang.rank>=1?'schutz':'liefer');A('ga_job','liefer');if(p.dirty>5000)A('ga_wash')}}
  if(a>=18&&!p.job&&ch2(.3))A('apply','lager');if(p.st.ge<50)A('arzt');A('party')},
 faulenzer(p){const a=p.age;if(a>=18&&!p.job)A('apply','lager');A('party');if(ch2(.5))A('lesen')}};
function ch2(x){return Math.random()<x}
const out={};
for(const k of Object.keys(S)){const L=[];
 for(let r=0;r<N;r++){T.newLife('Test','Person',pick(['w','m']),0,false);T.applyCfg({act:6,clock:true,ev:'normal',big:true,wealth:'normal'});const p=T.p;
  const rec={death:0,cause:'',m30:null,m50:null,end:0,max:0,mio:null,job40:'',deg:'',edu:'',fol:0,kids:0,jail:0,crimes:0,influAge:null,partner:false};
  for(let y=0;y<130&&p.alive;y++){try{S[k](p)}catch(e){errs++}
   if(p.prison)rec.jail++;if(p.job&&p.job.id==='influ'&&rec.influAge==null)rec.influAge=p.age;
   let nw=0;try{nw=T.netWorth()}catch(e){}rec.max=Math.max(rec.max,nw);if(nw>=1e6&&rec.mio==null)rec.mio=p.age;if(p.age===30)rec.m30=nw;if(p.age===50)rec.m50=nw;if(p.age===40)rec.job40=T.status();
   try{T.ageUp()}catch(e){errs++;if(errs<5)console.log(e.stack.split('\n').slice(0,2).join('|'))}}
  rec.death=p.age;rec.cause=p.cause||'';try{rec.end=T.netWorth()}catch(e){}rec.deg=p.deg||'';rec.edu=p.edu;rec.fol=p.sm?Math.max(p.sm.fol,(p.stats&&p.stats.maxFol)||0):0;rec.kids=p.kids.length;rec.crimes=p.crimes||0;rec.partner=!!(p.partner&&p.partner.mar);L.push(rec)}
 out[k]=L;process.stderr.write(k+' fertig\n')}
require('fs').writeFileSync(require('path').join(__dirname,'spielweisen.json'),JSON.stringify(out));
console.log('errors',errs);
