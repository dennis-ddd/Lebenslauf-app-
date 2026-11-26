// Prüft Freundeskreis, Haustiere mit Charakter und Gesundheit/Leben im Alter über viele ganze Leben.
const pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,QEV,act,viewFamilie,viewLeben,continueAs,setFam:t=>famTab=t,setL:t=>lTab=t,get p(){return p},setDialog:f=>dialog=f};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};T.setDialog(()=>{});const bad=h=>/undefined|NaN|\[object/.test(h);
const seen={};let maxF=0,maxTricks=0,conds=0,pets=0,inherit=0;
for(let life=0;life<40;life++){T.newLife('Kim','Test',pick(['w','m']),6,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:pick(['normal','reich'])});
  let y=0;while(T.p.alive&&y++<100){const p=T.p;p.money=Math.max(p.money,20000);
    if(p.age===10&&ch2(.6))T.act('adopt',pick(['hund','katze','kaninchen','vogel','schildi','hamster']));
    if(p.age===30&&!p.kids.length)p.kids.push({n:'Mia',b:p.age,g:'w',rel:70,st:{in:50,ge:80},ts:40,tal:'sport',edu:'keine',fd:{}});
    if(p.age===58&&p.kids[0])p.kids[0].kids=2;
    for(let a=0;a<3;a++){p.act=6;const f=(p.fk||[])[a];try{if(f)T.act(pick(['fkmeet','fkmsg']),f.id);const x=(p.pets||[])[0];if(x)T.act(pick(['pplay','ptrick','pvet']),x.id);if(p.age>=58)T.act(pick(['seniorsport','gedtrain','garten','enkel','memoiren']));if(p.age>=60&&p.alt){const k=Object.keys(p.alt.c)[0];if(k)T.act('altfix',k);if(p.age===75)T.act('altwohn',pick(['betreut','kinder','heim']))}if(a===0)T.act('fkabend')}catch(e){errs++;console.log('ERR act',e.stack.split('\n').slice(0,2).join('|'))}}
    el('modal').classList.remove('on');try{T.ageUp()}catch(e){errs++;console.log('ERR ageUp',e.stack.split('\n').slice(0,3).join('|'));break}
    const q=T.p.q;let g=0;while(q&&q.length&&g++<16){const it=q.shift();if(!T.QEV[it.id])continue;let e;try{e=T.QEV[it.id](it.d)}catch(x){errs++;console.log('ERR ev',it.id,x.message);continue}if(!e||!e.c())continue;
      if(/^(fk_|pet_|alt_)/.test(it.id))seen[it.id]=(seen[it.id]||0)+1;try{const r=pick(e.o)[1]();ok('Text '+it.id,r==null||typeof r==='string'&&!bad(r))}catch(x){errs++;console.log('ERR',it.id,x.message)}}
    const P=T.p;maxF=Math.max(maxF,(P.fk||[]).length);(P.pets||[]).forEach(x=>maxTricks=Math.max(maxTricks,(x.tk||[]).length));if(P.alt)conds=Math.max(conds,Object.keys(P.alt.c).length);pets=Math.max(pets,(P.pets||[]).length);
    ok('Nähe 0–100',(P.fk||[]).every(f=>f.cl>=0&&f.cl<=100));
    if(y%15===0){['kinder','eltern','freunde','tiere','baum','erbe'].forEach(t=>{T.setFam(t);let h;try{h=T.viewFamilie()}catch(e){errs++;console.log('ERR view',t,e.message);return}{const m=h.match(/.{60}(undefined|NaN|\[object).{30}/);ok('Familie '+t+(m?' '+m[0]:''),!m&&h.includes('data-g="tiere"'))}});
      T.setL('ich');const h=T.viewLeben();ok('Leben-Ansicht',!bad(h));if(P.age>=55)ok('Alter-Karte',h.includes('Gesundheit im Alter'))}}
  // Haustiere ziehen beim Weiterspielen mit
  if(!T.p.alive&&T.p.kids.some(k=>k.alive!==false)&&(T.p.pets||[]).length){const n=T.p.pets.length,i=T.p.kids.findIndex(k=>k.alive!==false);try{T.continueAs(i);if((T.p.pets||[]).length===n)inherit++}catch(e){errs++;console.log('ERR cont',e.message)}}}
function ch2(x){return Math.random()<x}
console.log('Ereignisse',JSON.stringify(seen));console.log('max Freunde',maxF,'max Tricks',maxTricks,'max Beschwerden',conds,'Haustiere vererbt',inherit);
['fk_neu','fk_hochzeit','fk_krise','fk_tod','pet_streich','fk_umzug','alt_enkeltrick'].forEach(k=>ok('Ereignis '+k,seen[k]>0));ok('Freunde gefunden',maxF>=3);ok('Tricks gelernt',maxTricks>=1);ok('Beschwerden im Alter',conds>=1);
console.log('errors',errs);process.exit(errs?1:0);
