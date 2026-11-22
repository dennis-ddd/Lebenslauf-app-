/* ================= Apps verschieben: lange drücken, ziehen, loslassen ================= */
let APD=null,APDskip=0;
function apdEnd(save){const d=APD;APD=null;if(!d)return;clearTimeout(d.tm);if(!d.on)return;
  d.gh.remove();d.el.classList.remove('dragsrc');document.body.classList.remove('appdrag');
  if(save){const vis=[...d.box.querySelectorAll('.app')].map(b=>b.dataset.g),all=appOrder(),rest=all.filter(x=>!vis.includes(x));
    // Unsichtbare Apps behalten ihren Platz relativ zu den sichtbaren
    const out=[];let vi=0;all.forEach(x=>{if(rest.includes(x))out.push(x);else out.push(vis[vi++])});while(vi<vis.length)out.push(vis[vi++]);
    O.order=out;saveO()}
  APDskip=Date.now();setTimeout(()=>{if(p)render()},0)}
if(document.addEventListener){
  document.addEventListener('pointerdown',e=>{if(!p||APD)return;const a=e.target.closest&&e.target.closest('.apps .app');if(!a||a.disabled)return;
    const d=APD={el:a,box:a.parentNode,x:e.clientX,y:e.clientY,id:e.pointerId,on:false};
    d.tm=setTimeout(()=>{if(APD!==d)return;d.on=true;const r=a.getBoundingClientRect();d.dx=d.x-r.left;d.dy=d.y-r.top;
      const gh=d.gh=a.cloneNode(true);gh.classList.add('dragghost');gh.style.width=r.width+'px';gh.style.left=(d.x-d.dx)+'px';gh.style.top=(d.y-d.dy)+'px';document.body.appendChild(gh);
      a.classList.add('dragsrc');document.body.classList.add('appdrag');try{if(O.vib&&navigator.vibrate)navigator.vibrate(25)}catch(_){}},420)});
  document.addEventListener('pointermove',e=>{const d=APD;if(!d||e.pointerId!==d.id)return;
    if(!d.on){if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>10){clearTimeout(d.tm);APD=null}return}
    e.preventDefault();d.gh.style.left=(e.clientX-d.dx)+'px';d.gh.style.top=(e.clientY-d.dy)+'px';
    const t=document.elementFromPoint(e.clientX,e.clientY),o=t&&t.closest&&t.closest('.apps .app');
    if(o&&o!==d.el&&o.parentNode===d.box){const L=[...d.box.children],i=L.indexOf(d.el),j=L.indexOf(o);d.box.insertBefore(d.el,j>i?o.nextSibling:o)}},{passive:false});
  document.addEventListener('touchmove',e=>{if(APD&&APD.on)e.preventDefault()},{passive:false});
  document.addEventListener('pointerup',e=>{if(APD&&e.pointerId===APD.id)apdEnd(true)});
  document.addEventListener('pointercancel',e=>{if(APD&&e.pointerId===APD.id)apdEnd(true)});
  document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('.apps .app'))e.preventDefault()});
  // Nach dem Ziehen keinen Klick auslösen
  document.addEventListener('click',e=>{if(Date.now()-APDskip<400&&e.target.closest&&e.target.closest('.apps .app')){e.stopPropagation();e.preventDefault()}},true);
}
