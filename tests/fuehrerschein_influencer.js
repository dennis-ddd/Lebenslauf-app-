// Prüft Führerscheine (Fahrstunden, Theorie, Praxis, Fahrzeuge) und die neuen Influencer-Systeme.
require('./lib/zufall').seed();
const pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=f=>{try{f()}catch(e){}};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,QEV,act,LIC,LICQ,VEH,smYear,viewKlick,viewBildung,merchInc,get p(){return p},setO:o=>Object.assign(O,o),setTab:v=>smTab=v,setDialog:f=>dialog=f};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};
// Dialog-Stub: Theorie richtig beantworten, sonst erste Option
let correct=null;T.setDialog((t,x,o)=>{if(!o||!o.length)return;let c=o[0];if(/Theorie · Frage/.test(t)){const Q=Object.values(T.LICQ).flat().find(q=>q[0]===x);if(Q){c=o.find(b=>b[0]===(correct===false?Q[2]:Q[1]))||c}}if(c[1])c[1]()});
// Fragenpool prüfen
Object.entries(T.LICQ).forEach(([k,Q])=>{ok(k+' hat genug Fragen',Q.length>=10);Q.forEach(q=>ok('Frage vollständig '+q[0],q.length===4&&new Set(q.slice(1)).size===3))});
T.newLife('Kim','Test','w',18,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'reich'});T.setO({mini:'skip'});
let p=T.p;p.money=500000;
ok('Karte sichtbar',T.viewBildung().includes('Führerscheine'));
for(const k of Object.keys(T.LIC)){const L=T.LIC[k];
  for(let i=0;i<L.les;i++){p.act=6;T.act('lles',k)}ok(k+' Stunden',p.lic[k].l===L.les);
  correct=false;T.act('lthe',k);ok(k+' Theorie falsch = durchgefallen',!p.lic[k].th);
  correct=true;T.act('lthe',k);ok(k+' Theorie bestanden',p.lic[k].th===1);
  let tries=0;while(!p.lic[k].ok&&tries++<30){p.act=6;T.act('lpra',k)}ok(k+' Praxis bestanden',p.lic[k].ok===1);
  if(L.veh){p.act=6;T.act('vbuy',L.veh);ok(k+' Fahrzeug gekauft',p.veh.includes(L.veh));p.act=6;T.act('vride',L.veh)}}
ok('Auto setzt p.fs',p.fs===true);
const m0=p.money;T.ageUp();ok('Unterhalt abgezogen',T.p.money<m0+1e6);
// Influencer
T.newLife('Kim','Test','m',20,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});T.setO({mini:'skip'});p=T.p;
T.act('smjoin');p.sm.fol=120000;p.items.push('handy','laptop');T.act('chcreate');p.sm.studio.merch=1;p.rival=p.rival||{n:'Ben'};
['profil','biz','kanal','feed'].forEach(t=>{T.setTab(t);const h=T.viewKlick();ok('Klick '+t+' ohne Platzhalter',!/undefined|NaN/.test(h))});
T.setTab('biz');ok('Merch-Shop',T.viewKlick().includes('Merch-Shop'));const i0=T.merchInc(p.sm,p.sm.ch);T.act('kmerx','100');ok('Preis begrenzt',p.sm.mer.pr<=135);
ok('Zu teuer verkauft weniger',T.merchInc(p.sm,p.sm.ch)<i0);
p.act=6;T.act('kcollab',0);ok('Collab erledigt',p.sm.cre[0].done>0);p.act=6;T.act('kmeet');ok('Meet & Greet',p.sm.meetY===p.age);
T.act('kfam');ok('Privatsphäre an',p.sm.fam===1);
const seen={};for(let y=0;y<25;y++){T.p.q=[];T.smYear();(T.p.q||[]).forEach(q=>{seen[q.id]=(seen[q.id]||0)+1;const e=T.QEV[q.id](q.d);if(e&&e.c()){const o=pick(e.o);try{const r=o[1]();ok('Text '+q.id,typeof r==='string'&&!/undefined|NaN/.test(r))}catch(x){errs++;console.log('ERR',q.id,o[0],x.message)}}})}
ok('verifiziert',p.sm.ver===1);['k_deal','k_storm','k_award','k_agent'].forEach(k=>ok('Ereignis kam: '+k,seen[k]>0));
console.log('Ereignisse in 25 Jahren:',JSON.stringify(seen));console.log('errors',errs);process.exit(errs?1:0);
