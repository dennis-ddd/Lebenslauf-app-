require('./lib/zufall').seed();
global.__q=[];global.setInterval=(f)=>{const id={c:false,f};__q.push(id);return id};global.clearInterval=(id)=>{if(id)id.c=true};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){}}),setAttribute(){},addEventListener(){},onclick:null,dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null})};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
let src=(s=>s.split('<script>')[1].split('</script>')[0])(require('fs').readFileSync(require('path').join(__dirname,'..','index.html'),'utf8')).trim();src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={newLife,act,ageUp,render,listings,get p(){return p},setTab:v=>{tab=v},setW:v=>{wTab=v},getSel:()=>propSel};';eval(src);
let errs=0;const pick=a=>a[Math.floor(Math.random()*a.length)];
for(let r=0;r<150;r++){T.newLife('A','B','w',18,true);T.p.money+=5e7;T.setTab('wohnen');T.setW('immo');
 for(let y=0;y<40&&T.p.alive;y++){
  try{
   const L=T.listings();if(L.length&&Math.random()<.6)T.act('buyprop',pick(L).id);
   if(T.p.props.length){const pr=pick(T.p.props);T.act('prop',String(pr.id));
     for(const [a,g] of [['propuse',pick(['rent','self','versteck','lager','leer','rent'])],['tenant',String(pick([0,1,2]))],['evict','0'],['repair'],['sanieren'],['fasscol','3'],['build',pick(['dach','aufstock','anbau','solar','fassade'])],['landbuild',pick(['haus','mfh','buero'])]])T.act(a,g);
     T.render();if(Math.random()<.1)T.act('sellprop');T.act('prop','')}
   T.act('home',pick(['wg','villa']));T.render();
   el('modal').classList.remove('on');T.ageUp();
  }catch(e){errs++;if(errs<5)console.log(e.stack.split('\n').slice(0,3).join(' | '))}}}
console.log('errors',errs,'props',T.p.props.length,'home',T.p.home,'rent',T.p.props.reduce((s,x)=>s+x.ten.length,0));
