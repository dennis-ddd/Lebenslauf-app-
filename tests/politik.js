// Prüft die Politik-Karriere: Programm, Vorlagen im Amt, Wahlkampf, Lobby, Skandale, Koalition und Kanzleramt.
const pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=f=>{try{f()}catch(e){}};global.clearTimeout=()=>{};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,QEV,LATER,act,viewWege,POLO,setK:t=>karTab=t,get p(){return p},setDialog:f=>dialog=f};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};T.setDialog((t,x,o)=>{if(o&&o[0]&&o[0][1])try{o[0][1]()}catch(e){}});const bad=h=>/undefined|NaN|\[object/.test(h);
const seen={},maxL={};
for(let life=0;life<40;life++){T.newLife('Kim','Test',pick(['w','m']),16,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});
  T.act('po_join',R0(3));const p=T.p;if(!p.pol){errs++;console.log('kein Beitritt');continue}['wohnen','klima','sicher','wirtschaft'].slice(0,3).forEach(t=>T.act('po_th',t));ok('max 3 Themen',p.pol.th.length===3);
  let y=0;while(T.p.alive&&y++<70){const P=T.p;P.money=Math.max(P.money,30000);if(!P.pol)break;
    for(let a=0;a<4;a++){P.act=6;try{if(!P.pol.next&&P.pol.lvl<T.POLO.length-1)T.act('po_cand');T.act(pick(['po_work','po_camp','po_plak','po_presse']))}catch(e){errs++;console.log('ERR act',e.message)}}
    el('modal').classList.remove('on');try{T.ageUp()}catch(e){errs++;console.log('ERR ageUp',e.stack.split('\n').slice(0,3).join('|'));break}
    const q=T.P||T.p.q;let g=0;while(T.p.q.length&&g++<16){const it=T.p.q.shift();if(!T.QEV[it.id])continue;let e;try{e=T.QEV[it.id](it.d)}catch(x){errs++;console.log('ERR ev',it.id,x.message);continue}if(!e||!e.c())continue;
      if(/^pol_/.test(it.id))seen[it.id.replace(/^pol_v_.*/,'pol_vorlage')]=(seen[it.id.replace(/^pol_v_.*/,'pol_vorlage')]||0)+1;if(e.cat==='Politik'&&!/^pol_v_/.test(it.id)){}
      try{const r=pick(e.o)[1]();ok('Text '+it.id,r==null||typeof r==='string'&&!bad(r))}catch(x){errs++;console.log('ERR',it.id,x.message)}}
    (T.p.later||[]).filter(l=>l.id==='pol_skandal'&&l.a<=T.p.age).forEach(l=>{seen.skandal=(seen.skandal||0)+1});
    if(T.p.pol){maxL[T.p.pol.lvl]=(maxL[T.p.pol.lvl]||0)+1;const o=T.p.pol;ok('Werte 0–100',[o.pop,o.g.buerger,o.g.wirtschaft,o.g.umwelt].every(v=>v>=0&&v<=100))}
    if(y%10===0){T.setK('politik');const h=T.viewWege();ok('Ansicht',!bad(h)&&h.includes('Dein Programm'))}}}
// TV-Duell und Rivale gezielt
T.newLife('Kim','Test','w',30,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'normal'});T.act('po_join',0);{const p=T.p;p.pol.lvl=1;p.rival={n:'Max Rivale',friend:0};p.pol.next=p.age+1;p.pol.gegner='Max Rivale';
 ['pol_duell','pol_rivale'].forEach(k=>{for(let i=0;i<3;i++){const e=T.QEV[k]();ok('Ereignis '+k,!!e);if(e){seen[k]=(seen[k]||0)+1;const r=e.o[i%e.o.length][1]();ok('Text '+k,typeof r==='string'&&!bad(r))}}})}
function R0(n){return Math.floor(Math.random()*n)}
console.log('Ereignisse',JSON.stringify(seen));console.log('Jahre pro Stufe',JSON.stringify(maxL));
['pol_vorlage','pol_duell','pol_lobby','pol_buerger'].forEach(k=>ok('Ereignis '+k,seen[k]>0));ok('Bürgermeister erreicht',maxL[2]>0);ok('Landtag oder höher',(maxL[3]||0)+(maxL[4]||0)+(maxL[5]||0)+(maxL[6]||0)>0);
console.log('errors',errs);process.exit(errs?1:0);
