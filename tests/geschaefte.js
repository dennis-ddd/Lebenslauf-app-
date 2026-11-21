global.setInterval=()=>({});global.clearInterval=()=>{};
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),setAttribute(){},onclick:null,dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
let src=(s=>s.split('<script>')[1].split('</script>')[0])(require('fs').readFileSync(require('path').join(__dirname,'..','index.html'),'utf8')).trim();src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,act,get p(){return p},viewBiz,setTab:v=>{tab=v},QEV,showEvent,bizExpected,drafts};';eval(src);
let errs=0;const tryA=(...a)=>{try{T.act(...a)}catch(e){errs++;if(errs<8)console.log('ERR',a,e.stack.split('\n').slice(0,2).join('|'))}};
for(let r=0;r<40;r++){T.newLife('A','B','w',20,true);T.applyCfg({act:0,clock:false,ev:'normal',big:true,wealth:'normal'});const p=T.p;p.crimes=r%2?5:0;p.money=5e6;
 tryA('cofound');tryA('holding');['kiosk','pizza','club'].forEach(k=>tryA('front',k));tryA('shopcat','technik');tryA('shopfound');tryA('bankbuy');
 for(let y=0;y<15;y++){el('modal').classList.remove('on');p.money=Math.max(p.money,3e6);p.act=99;
  ['kiosk','pizza'].forEach(k=>{tryA('fil',k);tryA('frqual',k)});tryA('mkt',['flyer','tv','klick'][y%3]);
  (p.biz.comp||[]).slice().forEach(c=>tryA(['cpprice','cpqual','cpbuy','cprumor','cpsab','cpdruck'][R(0,5)],c.k));
  tryA('prodt','Kopfhörer');tryA('prodtier',['g','n','p'][y%3]);tryA('prodq',['b','g','t'][y%3]);T.drafts.prodName='Test '+y;tryA('prodnew');tryA('produp','0');if(y===8)tryA('prodrm','1');tryA('supply');tryA('bankfil');
  if(y===12)tryA('frsell','club');['uebersicht','laeden','firma','shop','bank'].forEach(b=>{tryA('biztab',b);try{T.viewBiz()}catch(e){errs++;console.log('V2',e.stack.split('\n').slice(0,2).join('|'))}});tryA('bizself','kiosk');
  try{T.viewBiz()}catch(e){errs++;console.log('VIEW',e.stack.split('\n').slice(0,2).join('|'))}
  while(p.q&&p.q.length){const q=p.q.shift();try{const e=T.QEV[q.id]&&T.QEV[q.id](q.d);if(e&&e.c())pick(e.o)[1]()}catch(x){errs++;console.log('Q',x.stack.split('\n').slice(0,2).join('|'))}}
  p.prison=0;try{T.ageUp()}catch(e){errs++;console.log('AGE',e.stack.split('\n').slice(0,3).join('|'))}if(!p.alive)break}
 if(r===0)console.log('fil',JSON.stringify(p.biz.fil),'prods',p.biz.shop&&p.biz.shop.prods.length,'bankfil',p.biz.bank&&p.biz.bank.fil,'exp',T.bizExpected(),'stars',JSON.stringify(p.biz.stars))}
console.log('errors',errs);
