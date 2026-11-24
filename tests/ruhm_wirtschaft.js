// Prüft Wirtschaft (Arbeitslosigkeit, Immobilienmarkt, Lohnrunden), Bekanntheit mit Promi-Ereignissen und den Stadtanzeiger.
const pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=f=>{try{f()}catch(e){}};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,QEV,act,JOBS,viewNews,rufCard,fameNow,fameParts,econCard,bizMul,get p(){return p},setDialog:f=>dialog=f};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};T.setDialog(()=>{});
const seen={},rub={};let raises=0,mayors=new Set(),meNews=0,maxFame=0;
for(let life=0;life<12;life++){T.newLife('Kim','Test',pick(['w','m']),18,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});let p=T.p;
  p.job={id:'buero',t:'Bürokaufmann/-frau',pay:32000,part:false,yrs:0,perf:50};
  if(life%2){T.act('smjoin');p.sm.fol=life*40000}if(life%3===0){p.biz.co='Kim GmbH';p.biz.fronts.push('kiosk','pizza','wasch');p.money=3e6}
  for(let y=0;y<55;y++){p=T.p;if(!p.alive)break;const pay0=p.job&&p.job.pay;el('modal').classList.remove('on');try{T.ageUp()}catch(e){errs++;console.log('ERR',e.stack.split('\n').slice(0,3).join('|'));break}
    p=T.p;if(p.job&&pay0&&p.job.id==='buero'&&p.job.pay!==pay0)raises++;
    const e=p.econ;ok('Arbeitslosigkeit im Rahmen',e.al.every(a=>a>=2.5&&a<=14));ok('Immobilienindex positiv',e.ri>0);
    let g=0;while(p.q&&p.q.length&&g++<14){const q=p.q.shift();if(!T.QEV[q.id])continue;let ev;try{ev=T.QEV[q.id](q.d)}catch(x){errs++;console.log('ERR qev',q.id,x.message);continue}
      if(!ev||!ev.c())continue;seen[q.id]=(seen[q.id]||0)+1;const o=pick(ev.o);try{const r=o[1]();ok('Text '+q.id,typeof r==='string'&&!/undefined|NaN/.test(r))}catch(x){errs++;console.log('ERR opt',q.id,o[0],x.message)}}
    (p.news||[]).filter(n=>n.a===p.age&&n.r).forEach(n=>{rub[n.r]=(rub[n.r]||0)+1;if(n.me)meNews++;if(/Bürgermeister/.test(n.t))mayors.add(n.t)});
    maxFame=Math.max(maxFame,T.fameNow());ok('Bekanntheit 0–100',T.fameNow()>=0&&T.fameNow()<=100);
    if(y%9===0){const h=T.viewNews()+T.rufCard()+T.econCard();ok('Ansichten ohne Platzhalter',!/undefined|NaN/.test(h))}}}
ok('Lohnrunden',raises>50);ok('Promi-Ereignisse',['f_radio','f_charity','f_ad'].every(k=>seen[k]>0));ok('Rubriken',['politik','verkehr','polizei','sport','kultur'].every(k=>rub[k]>0));
ok('Berichte über dich',meNews>0);ok('Bürgermeisterwahlen',mayors.size>3);ok('Stars möglich',maxFame>=60);
console.log('Lohnrunden',raises,'Ereignisse',JSON.stringify(seen),'Rubriken',JSON.stringify(rub),'über dich',meNews,'max Bekanntheit',maxFame);console.log('errors',errs);process.exit(errs?1:0);
