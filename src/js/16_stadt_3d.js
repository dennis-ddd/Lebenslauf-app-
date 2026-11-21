/* ---------- 3D-Stadt ---------- */
const NB=6,PIT=14,RD=4,BS=PIT-RD;
function layout(seed){
  const r=rng(seed),cells=[];
  for(let i=0;i<NB;i++)for(let j=0;j<NB;j++)cells.push({x:(i-(NB-1)/2)*PIT,z:(j-(NB-1)/2)*PIT,lots:[],trees:[],type:'res',top:0,place:null});
  for(let i=cells.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]]}
  const RES=[0xF3E1C7,0xE8D0D9,0xD3E2EF,0xE6E6D4,0xD9E8D2,0xF1D5B8,0xC9D3E6,0xEFE8DA];
  cells.forEach((c,k)=>{
    const pl=PLACES[k];
    if(pl){c.place=pl.id;
      if(pl.id==='park'){c.type='park';c.lots.push({x:c.x,z:c.z,w:3,d:3,h:2,col:pl.c,place:pl.id});c.top=2;for(let t=0;t<10;t++)c.trees.push([c.x+(r()-.5)*8,c.z+(r()-.5)*8,.8+r()*.6])}
      else{const w=6+r()*2,h=pl.h*(.85+r()*.3);c.lots.push({x:c.x,z:c.z,w,d:6+r()*2,h,col:pl.c,place:pl.id});c.top=h;
        for(let t=0;t<3;t++)c.trees.push([c.x+(r()<.5?-1:1)*4.2,c.z+(r()-.5)*8,.6+r()*.3])}
    }else if(r()<.22){c.type='park';for(let t=0;t<9;t++)c.trees.push([c.x+(r()-.5)*8.4,c.z+(r()-.5)*8.4,.7+r()*.7])}
    else{const center=Math.hypot(c.x,c.z)<30;
      [[-2.3,-2.3],[2.3,-2.3],[-2.3,2.3],[2.3,2.3]].forEach(([dx,dz])=>{if(r()<.12){c.trees.push([c.x+dx,c.z+dz,.9]);return}
        const tall=center&&r()<.55,h=tall?7+r()*14:2.2+r()*3.5;c.lots.push({x:c.x+dx,z:c.z+dz,w:3.6+r()*.6,d:3.6+r()*.6,h,col:RES[Math.floor(r()*RES.length)]})})}
  });
  return {cells,ext:NB*PIT+RD};
}
let G=null;
const glOK=(()=>{try{const c=document.createElement('canvas');return !!(window.THREE&&(c.getContext('webgl')||c.getContext('experimental-webgl')))}catch(e){return false}})();
function winTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,64,64);x.fillStyle='rgba(40,55,90,.38)';
  [[10,10],[38,10],[10,38],[38,38]].forEach(([a,b])=>x.fillRect(a,b,16,17));const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function boxGeo(w,h,d){const g=new THREE.BoxGeometry(w,h,d),uv=g.attributes.uv,U=3;
  for(let f=0;f<6;f++){const sx=f<2?d:(f<4?0:w),sy=(f<2||f>=4)?h:0;for(let i=0;i<4;i++){const k=f*4+i;uv.setXY(k,uv.getX(k)*sx/U,uv.getY(k)*sy/U)}}return g}
function label(t,col){
  const c=document.createElement('canvas'),x=c.getContext('2d'),F='800 34px Nunito, system-ui, sans-serif';x.font=F;
  const w=Math.ceil(x.measureText(t).width)+52;c.width=w;c.height=58;x.font=F;
  const r=16;x.fillStyle='rgba(255,255,255,.95)';x.beginPath();x.moveTo(r,2);x.lineTo(w-r,2);x.quadraticCurveTo(w-2,2,w-2,r);x.lineTo(w-2,56-r);x.quadraticCurveTo(w-2,56,w-r,56);x.lineTo(r,56);x.quadraticCurveTo(2,56,2,56-r);x.lineTo(2,r);x.quadraticCurveTo(2,2,r,2);x.fill();
  x.fillStyle=hex(col);x.beginPath();x.arc(24,29,9,0,7);x.fill();x.fillStyle='#1B1F2A';x.textBaseline='middle';x.fillText(t,40,31);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(w/58*2.3,2.3,1);s.renderOrder=10;return s}
function initThree(){
  if(G)return true;if(!glOK)return false;
  try{const r=new THREE.WebGLRenderer({antialias:true});r.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
    G={r,cam:new THREE.PerspectiveCamera(45,1,1,900),tgt:new THREE.Vector3(),dist:105,yaw:.7,el:.85,goal:null,ptr:new Map(),down:null,pick:[],pm:{},cars:[],seed:null,run:false,ray:new THREE.Raycaster(),WIN:winTex(),mats:{}};
    bindPointers(r.domElement);G.ro=new ResizeObserver(sizeThree);return true}catch(e){G=null;return false}
}
function mat(col,win){const k=col+(win?'w':'');return G.mats[k]||(G.mats[k]=new THREE.MeshLambertMaterial({color:col,map:win?G.WIN:null}))}
function buildScene(){
  const L=layout(p.seed);G.seed=p.seed;G.L=L;G.pick=[];G.pm={};G.cars=[];
  const s=new THREE.Scene();s.background=new THREE.Color(0xBFD9F2);s.fog=new THREE.Fog(0xBFD9F2,170,340);
  G.hemi=new THREE.HemisphereLight(0xffffff,0x7d8a6a,.75);s.add(G.hemi);G.sun=new THREE.DirectionalLight(0xffffff,.75);G.sun.position.set(40,80,25);s.add(G.sun);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(700,700),mat(0xB2CF98));gr.rotation.x=-Math.PI/2;s.add(gr);
  const as=new THREE.Mesh(new THREE.PlaneGeometry(L.ext,L.ext),mat(0x5E6575));as.rotation.x=-Math.PI/2;as.position.y=.03;s.add(as);
  // Fahrbahnmarkierung
  const lines=[];for(let k=0;k<=NB;k++)lines.push((k-NB/2)*PIT);
  const dash=[];lines.forEach(c=>{for(let v=-L.ext/2+1;v<L.ext/2;v+=3){if(lines.some(o=>Math.abs(o-v)<RD/2+.4))continue;dash.push([v,c,0],[c,v,1])}});
  const dm=new THREE.InstancedMesh(new THREE.BoxGeometry(1.4,.05,.22),mat(0xF4F4F4),dash.length),o=new THREE.Object3D();
  dash.forEach((d,i)=>{o.position.set(d[0],.06,d[1]);o.rotation.set(0,d[2]?Math.PI/2:0,0);o.updateMatrix();dm.setMatrixAt(i,o.matrix)});s.add(dm);
  // Blöcke und Gebäude
  const trees=[];
  L.cells.forEach(c=>{
    const base=new THREE.Mesh(new THREE.BoxGeometry(BS,.4,BS),mat(c.type==='park'?0x8FC27A:0xE4E7EC));base.position.set(c.x,.2,c.z);s.add(base);
    if(c.place){base.userData.place=c.place;G.pick.push(base)}
    c.lots.forEach(l=>{
      const m=new THREE.Mesh(boxGeo(l.w,l.h,l.d),l.place?new THREE.MeshLambertMaterial({color:l.col,map:l.place==='park'?null:G.WIN}):mat(l.col,true));m.position.set(l.x,.4+l.h/2,l.z);s.add(m);
      const top=new THREE.Color(l.col).multiplyScalar(.8).getHex();const rf=new THREE.Mesh(new THREE.BoxGeometry(l.w+.3,.35,l.d+.3),mat(top));rf.position.set(l.x,.4+l.h+.17,l.z);s.add(rf);
      if(l.place){m.userData.place=rf.userData.place=l.place;G.pick.push(m,rf);G.pm[l.place]=m}});
    c.trees.forEach(t=>trees.push(t));
    if(c.place){const sp=label(PL[c.place].n,PL[c.place].c);sp.position.set(c.x,.4+c.top+2.6,c.z);s.add(sp)}
  });
  const tk=new THREE.InstancedMesh(new THREE.CylinderGeometry(.18,.24,1.3,6),mat(0x8A6A4A),trees.length),cr=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1.1,0),mat(0x5FA35A),trees.length);
  trees.forEach((t,i)=>{o.rotation.set(0,0,0);o.scale.set(1,1,1);o.position.set(t[0],1.05,t[1]);o.updateMatrix();tk.setMatrixAt(i,o.matrix);o.scale.set(t[2],t[2]*1.15,t[2]);o.position.set(t[0],1.3+t[2],t[1]);o.updateMatrix();cr.setMatrixAt(i,o.matrix)});s.add(tk,cr);
  // Autos
  const CC=[0xE4572E,0x2B59C3,0xF2C14E,0xFFFFFF,0x3BB273,0x7768AE,0x222831];
  for(let i=0;i<18;i++){const g=new THREE.Group(),col=CC[i%CC.length];
    const b=new THREE.Mesh(new THREE.BoxGeometry(2.4,.75,1.15),mat(col));b.position.y=.55;const cab=new THREE.Mesh(new THREE.BoxGeometry(1.25,.55,1.05),mat(0xCFE3F5));cab.position.set(-.15,1.15,0);g.add(b,cab);
    const ax=i%2,dir=i%4<2?1:-1,line=lines[Math.floor(Math.random()*lines.length)];
    g.userData={ax,dir,line:line+dir*(ax?-1:1)*.95,pos:(Math.random()-.5)*L.ext,sp:6+Math.random()*6};g.rotation.y=ax?(dir>0?-Math.PI/2:Math.PI/2):(dir>0?0:Math.PI);s.add(g);G.cars.push(g)}
  // Spielfigur über dem Zuhause
  const home=L.cells.find(c=>c.place==='home');G.pin=new THREE.Group();
  const ball=new THREE.Mesh(new THREE.SphereGeometry(1.1,16,12),new THREE.MeshLambertMaterial({color:0x2B59C3,emissive:0x0d2050}));const cone=new THREE.Mesh(new THREE.ConeGeometry(.7,1.6,12),mat(0x2B59C3));cone.rotation.x=Math.PI;cone.position.y=-1.4;
  G.pin.add(ball,cone);G.pin.userData.y=.4+home.top+6.2;G.pin.position.set(home.x,G.pin.userData.y,home.z);s.add(G.pin);
  G.scene=s;G.tgt.set(0,0,0);highlight();
}
function sizeThree(){if(!G)return;const cv=document.getElementById('cv');if(!cv)return;const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;G.r.setSize(w,h);G.cam.aspect=w/h;G.cam.updateProjectionMatrix()}
function updCam(){const c=Math.cos(G.el);G.cam.position.set(G.tgt.x+Math.sin(G.yaw)*c*G.dist,Math.sin(G.el)*G.dist,G.tgt.z+Math.cos(G.yaw)*c*G.dist);G.cam.lookAt(G.tgt)}
function loop(t){
  if(!G||!G.run)return;requestAnimationFrame(loop);const dt=Math.min(.05,(t-(G.lt||t))/1000);G.lt=t;const half=G.L.ext/2;
  G.cars.forEach(g=>{const u=g.userData;u.pos+=u.dir*u.sp*dt;if(u.pos>half)u.pos=-half;if(u.pos<-half)u.pos=half;if(u.ax)g.position.set(u.line,0,u.pos);else g.position.set(u.pos,0,u.line)});
  G.pin.position.y=G.pin.userData.y+Math.sin(t/400)*.5;
  const k=(Math.cos(t/1000/120*2*Math.PI)+1)/2,sky=new THREE.Color(0x2E3A63).lerp(new THREE.Color(0xBFD9F2),k);G.scene.background.copy(sky);G.scene.fog.color.copy(sky);G.hemi.intensity=.42+.38*k;G.sun.intensity=.25+.55*k;
  if(G.goal){G.tgt.lerp(G.goal,.08);if(G.tgt.distanceTo(G.goal)<.05)G.goal=null}
  const elGoal=cityMode==='2d'?1.5:.85;G.el+=(elGoal-G.el)*.1;
  updCam();G.r.render(G.scene,G.cam);cevProject();
}
function bindPointers(el){
  el.style.touchAction='none';
  el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);G.ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});G.down=G.ptr.size===1?{x:e.clientX,y:e.clientY,t:performance.now(),mv:0}:Object.assign(G.down||{},{mv:99})});
  el.addEventListener('pointermove',e=>{const o=G.ptr.get(e.pointerId);if(!o)return;
    if(G.ptr.size===2){const [a,b]=[...G.ptr.values()];const d0=Math.hypot(a.x-b.x,a.y-b.y),r0=Math.atan2(b.y-a.y,b.x-a.x);o.x=e.clientX;o.y=e.clientY;
      const [a2,b2]=[...G.ptr.values()];const d1=Math.hypot(a2.x-b2.x,a2.y-b2.y),r1=Math.atan2(b2.y-a2.y,b2.x-a2.x);if(d1>0)G.dist=clamp(G.dist*d0/d1,30,190);if(cityMode!=='2d')G.yaw-=r1-r0;return}
    const dx=e.clientX-o.x,dy=e.clientY-o.y;o.x=e.clientX;o.y=e.clientY;if(G.down)G.down.mv+=Math.abs(dx)+Math.abs(dy);
    const k=G.dist*.0019,sy=Math.sin(G.yaw),cy=Math.cos(G.yaw),lim=G.L.ext/2;
    G.tgt.x=clamp(G.tgt.x-(cy*dx+sy*dy)*k,-lim,lim);G.tgt.z=clamp(G.tgt.z-(-sy*dx+cy*dy)*k,-lim,lim);G.goal=null});
  const up=e=>{if(!G.ptr.has(e.pointerId))return;G.ptr.delete(e.pointerId);
    if(!G.ptr.size&&G.down&&G.down.mv<10&&performance.now()-G.down.t<500){const rc=el.getBoundingClientRect();
      G.ray.setFromCamera({x:(e.clientX-rc.left)/rc.width*2-1,y:-(e.clientY-rc.top)/rc.height*2+1},G.cam);const h=G.ray.intersectObjects(G.pick,false)[0];if(h)selectPlace(h.object.userData.place)}
    if(!G.ptr.size)G.down=null};
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',e=>{G.ptr.delete(e.pointerId);G.down=null});
  el.addEventListener('wheel',e=>{e.preventDefault();G.dist=clamp(G.dist*(1+Math.sign(e.deltaY)*.1),30,190)},{passive:false});
}
function highlight(){if(!G||!G.pm)return;Object.keys(G.pm).forEach(k=>G.pm[k].material.emissive.setHex(k===sel?0x6a3a00:0))}
function selectPlace(id){sel=id;if(G&&G.L){const c=G.L.cells.find(x=>x.place===id);if(c&&tab==='stadt'&&cityMode!=='list')G.goal=new THREE.Vector3(c.x,0,c.z)}highlight();render()}
function showCity(on){
  const w=document.getElementById('city');if(!w)return;
  if(!on){w.style.display='none';if(G)G.run=false;return}
  w.style.display='block';const cv=document.getElementById('cv');
  if(G.r.domElement.parentNode!==cv)cv.appendChild(G.r.domElement);G.ro.disconnect();G.ro.observe(cv);sizeThree();
  if(G.seed!==p.seed)buildScene();
  if(!G.run){G.run=true;G.lt=0;requestAnimationFrame(loop)}
}

