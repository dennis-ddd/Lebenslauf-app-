/* ================= Handy runterwischen: zur Stadt. In der Stadt hochwischen: zurück zum Handy ================= */
const SW={on:false};
function swGo(to,el,dir){const done=()=>{if(!p||!p.alive)return;tab=to;if(to==='stadt')sel=null;render();window.scrollTo(0,0);if(to==='stadt'&&!lessMotion()){const c=document.getElementById('city');if(c&&c.animate)c.animate([{opacity:0,transform:'translateY(-30px)'},{opacity:1,transform:'none'}],{duration:320,easing:'ease-out'})}};
  if(el&&el.animate&&!lessMotion()){el.animate([{transform:el.style.transform||'none'},{transform:'translateY('+(dir*innerHeight)+'px)',opacity:.2}],{duration:260,easing:'ease-in'}).onfinish=done}else done()}
function swStart(x,y,t){if(!p||!p.alive||(typeof APD!=='undefined'&&APD&&APD.on))return;const m=document.getElementById('modal');if(m&&m.classList.contains('on'))return;
  let el=null,dir=0;if(tab==='home'&&t.closest&&t.closest('.phone, .pgrab')&&!t.closest('#up')){el=document.querySelector('.phone');dir=1}
  else if(tab==='stadt'&&t.closest&&t.closest('.cgrab')){el=document.getElementById('city');dir=-1}
  if(!el)return;const top=dir>0&&(t.closest('.pgrab')||y-el.getBoundingClientRect().top<110);Object.assign(SW,{on:true,x,y,el,dir,dy:0,t0:Date.now(),act:false,top})}
function swMove(x,y,ev){if(!SW.on)return;if(typeof APD!=='undefined'&&APD&&APD.on){swCancel();return}const dx=x-SW.x,dy=y-SW.y;
  if(!SW.act){if(Math.abs(dy)<10)return;if(Math.abs(dx)>Math.abs(dy)||Math.sign(dy)!==SW.dir||(SW.dir>0&&!SW.top&&window.scrollY>2)){SW.on=false;return}SW.act=true}
  if(ev&&ev.cancelable)ev.preventDefault();SW.dy=dy;const v=SW.dir>0?Math.max(0,dy):Math.min(0,dy);SW.el.style.transition='none';SW.el.style.transform='translateY('+(v*.55)+'px)';
  const g=document.querySelector(SW.dir>0?'.pgrab':'.cgrab');if(g)g.classList.toggle('ready',Math.abs(v)>90)}
function swEnd(){if(!SW.on)return;const s=SW;SW.on=false;if(!s.act)return;const g=document.querySelector('.pgrab.ready,.cgrab.ready');if(g)g.classList.remove('ready');
  const fast=Math.abs(s.dy)>45&&Date.now()-s.t0<300;if(Math.abs(s.dy)>90||fast){APDskip=Date.now();swGo(s.dir>0?'stadt':'home',s.el,s.dir)}else{s.el.style.transition='transform .25s';s.el.style.transform='';setTimeout(()=>{s.el.style.transition=''},260)}}
function swCancel(){if(SW.el){SW.el.style.transform=''}SW.on=false}
if(document.addEventListener){
  document.addEventListener('touchstart',e=>{if(e.touches.length===1)swStart(e.touches[0].clientX,e.touches[0].clientY,e.target)},{passive:true});
  document.addEventListener('touchmove',e=>{if(SW.on)swMove(e.touches[0].clientX,e.touches[0].clientY,e)},{passive:false});
  document.addEventListener('touchend',swEnd);document.addEventListener('touchcancel',swCancel);
  document.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')swStart(e.clientX,e.clientY,e.target)});
  document.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&SW.on)swMove(e.clientX,e.clientY,null)});
  document.addEventListener('pointerup',e=>{if(e.pointerType==='mouse')swEnd()})}
// Griffe als Hinweis
function swHandles(){const ph=document.querySelector('#view .phone');if(tab==='home'&&ph&&!document.querySelector('.pgrab')&&appVisible('stadt')){const g=document.createElement('button');g.className='pgrab';g.type='button';g.setAttribute('aria-label','Zur Stadt');
    g.innerHTML='<i></i><span>Oben am Handy runterwischen: Stadt</span>';g.onclick=()=>swGo('stadt',ph,1);ph.before(g)}
  let c=document.querySelector('.cgrab');if(tab==='stadt'){if(!c){c=document.createElement('button');c.className='cgrab';c.type='button';c.setAttribute('aria-label','Zurück zum Handy');
    c.innerHTML='<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg><span>Handy</span>';c.onclick=()=>swGo('home',document.getElementById('city'),-1);document.body.appendChild(c)}}
  else if(c)c.remove()}
{const _r=render;render=function(){const r=_r.apply(this,arguments);try{swHandles()}catch(e){}return r}}
