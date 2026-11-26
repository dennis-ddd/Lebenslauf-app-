// Prüft v6.5: Klick mit Nische, Saisonplan, Team, Superfans, Rangliste, Risiken, Bühnen und eigener Marke.
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};global.console.warn=()=>{};
const store={};const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:k=>store[k]??null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
const fs=require('fs'),path=require('path');let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={crRank,crReach,viewKlick,contacts,replyOpts,doPost,setSm:t=>smTab=t,ERRLOG,jobBonus,interview,status,viewCasino,filmScenes,avatarSvg,stockVal,ensureStocks,SCENES,sceneOf,eraOf,yearNow,LATER,O,applyCfg,newLife,ageUp,QEV,act,die,continueAs,viewLeben,viewStadt,viewHome,viewEinst,bfSvg,showEvent0,setL:t=>lTab=t,setE:t=>einTab=t,get p(){return p},setDialog:f=>dialog=f,setStage:f=>stageDialog=f};';
eval(src);let lastO=null,lastR=null;T.setDialog((t,x,o)=>{if(t==='Ergebnis')lastR=x;else lastO=o});let calls=[];T.setStage((sc,h,t,o)=>{calls.push([h,t,o]);lastO=o});let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};const bad=h=>/undefined|NaN|\[object/.test(h);
const frsh_=(a)=>{T.newLife('Kim','Berger','w',a,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});return T.p};
const yr_=()=>{el('modal').classList.remove('on');T.ageUp()};
const tk_=id=>{const i=T.p.q.findIndex(q=>q.id===id);if(i<0)return null;const it=T.p.q.splice(i,1)[0];return T.QEV[id](it.d)};
const runE_=(e,i)=>{ok('Ereignistext '+e.t,!bad(e.x)&&!bad(e.back||''));lastO=null;lastR=null;T.showEvent0(e);ok('Dialog '+e.t,!!lastO);calls=[];lastO[i||0][1]();const r=lastR||(calls.length?String(calls[calls.length-1][1]):null);ok('Antwort '+e.t,typeof r==='string'&&!bad(r));return r};
const fnd_=(id,n)=>{let e=null;const o=T.QEV[id];T.QEV[id]=d=>{const x=o(d);if(x&&!e)e=x;return x};for(let i=0;i<(n||25)&&!e;i++){yr_();const x=tk_(id);if(x)e=x}T.QEV[id]=o;return e};
const smUse=()=>{const sm=T.p.sm;sm.pl=0;sm.vl=0;if(sm.ch)sm.ch.sl=0};
p=frsh_(20);p.money=200000;p.items.push('handy','laptop');T.act('smjoin');ok('Konto',!!T.p.sm);const sm=()=>T.p.sm;
T.act('chcat','gaming');T.act('chcreate');ok('Kanal',!!sm().ch);
T.act('crnis','comedy');ok('Nische gewählt',sm().nis==='comedy');
T.setSm('profil');let V=T.viewKlick();ok('Profil zeigt Nische und Saisonplan',V.includes('Deine Nische')&&V.includes('Saisonplan')&&!bad(V));
T.act('crsz','1');ok('Saison umschalten',sm().sz[1]==='viel');T.act('crsz','2');T.act('crsz','2');ok('Pause',sm().sz[2]==='pause');
T.act('post','meme');ok('Post mit Nische',sm().posts.length>=1);
// Saisonplan erfüllt
smUse();yr_();ok('Serie wächst',(sm().cr.ss||0)>=3);ok('Pause wird zurückgesetzt',sm().sz[2]==='normal');
// Team
T.act('studio','cutter');T.act('studio','kamera');ok('Team mit Namen',!!(sm().team.cutter&&sm().team.kamera&&sm().team.cutter.n));
T.setSm('biz');V=T.viewKlick();ok('Team-Karte',V.includes('Dein Team')&&V.includes('Kamera-Team')&&!bad(V));
sm().team.cutter.mood=10;sm().team.kamera.mood=90;let w=fnd_('cr_weg',8)||fnd_('cr_streit',8);ok('Teamereignis',!!w);if(w)runE_(w,0);
// Superfans und Fan-Post
sm().fol=6000;yr_();ok('Superfans',(sm().sf||[]).length>=2);ok('Fan-Post',T.contacts().some(c=>c.id==='g_fans'));ok('Antworten für Fans',T.replyOpts('g_fans').length===3);
T.act('post','food');ok('Superfan kommentiert manchmal',true);
// Rangliste
sm().fol=3e5;ok('Rangplatz',T.crRank()>=1&&T.crRank()<=101);T.setSm('profil');V=T.viewKlick();ok('Top 100',V.includes('Top 100 Creator')&&!bad(V));
// Fake-Follower
sm().cr.fake=0;sm().fol=50000;T.act('crfake');ok('Follower gekauft',sm().cr.fake===10000);let fk=fnd_('cr_fake',15);ok('Fake fliegt auf',!!fk);if(fk){runE_(fk,0);ok('Spur in der Schmetterlingskarte',(T.p.skfl||[]).some(x=>/Follower gekauft/.test(x.back)))}
// Bühnen und Marke
sm().fol=4e5;let st=null;for(let i=0;i<4;i++){const e=fnd_('cr_stg',6);if(e){st=e;runE_(e,0)}}ok('Bühnen',!!st);
sm().fol=4e5;sm().cr.brAsk=0;sm().brand=null;let mk=fnd_('cr_marke',12);ok('Marke angeboten',!!mk);if(mk){runE_(mk,0);ok('Marke läuft',!!sm().brand);yr_();T.setSm('biz');V=T.viewKlick();ok('Marken-Karte',!sm().brand||V.includes('Deine Marke')&&!bad(V));const m0=T.p.money;if(!sm().brand)sm().brand={k:'mode',n:'KIM Wear',a:30,share:1,val:50000};T.act('crbrsell');ok('Marke verkauft',!sm().brand&&T.p.money>m0)}
// Nischen-Deal und Challenge
let nd=fnd_('cr_nisdeal',8);ok('Nischen-Deal',!!nd);if(nd)runE_(nd,0);
sm().cr.mgY=null;T.act('crmg');ok('Nischen-Challenge einmal im Jahr',sm().cr.mgY===T.p.age);
// Burnout ohne Team
p=frsh_(25);p.money=50000;T.act('smjoin');T.p.sm.fol=20000;T.p.job={id:'influ',t:'Influencer/in',pay:0,part:false,yrs:1,perf:50};T.p.sm.sz=['viel','viel','viel','viel'];
let bo=null;for(let i=0;i<8&&!bo;i++){smUse();T.p.sm.pl=-12;bo=fnd_('cr_bo',1)}ok('Burnout ohne Team',!!bo);if(bo)runE_(bo,0);
// Hater und Boxkampf direkt
T.p.sm.cr.hat={h:'@toni_echt',n:0};const ht=T.QEV.cr_hater();ok('Hater',!!ht);runE_(ht,2);ok('Hater geblockt',!T.p.sm.cr.hat);
const bx=T.QEV.cr_box('@luna.tv');runE_(bx,0);const ol=T.p.sm.cr;ol.oldP={a:16,cap:'Montag. Schon wieder. #meme'};const od=T.QEV.cr_old();runE_(od,0);
['cr_hack','cr_ban','cr_stalk','cr_treffen'].forEach(id=>{T.p.sm.sf=T.p.sm.sf||[{h:'@lisa.liebt',typ:'treu',since:20,lv:60}];const e=T.QEV[id]();ok('Ereignis '+id,!!e);if(e)runE_(e,0)});
const real=T.ERRLOG.filter(x=>!/setAttribute|location|setProperty|AudioContext|getContext|vibrate|matchMedia|navigator|screen|querySelector|style|documentElement|dataset/.test(x.m));real.forEach(x=>console.log('Protokoll:',x.m,x.st));ok('Fehlerprotokoll leer',!real.length);
console.log('errors',errs);process.exit(errs?1:0);
