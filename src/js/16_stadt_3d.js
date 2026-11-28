/* ---------- 3D-Stadt: geplante Viertel, Instancing, Qualitätsstufen ---------- */
const NB=8,PIT=14,RD=4,BS=PIT-RD;
/* Stadtplan (Norden oben, Wasser im Süden). Der Seed dreht und spiegelt die Stadt.
   R Wohnen · V Villen · G Grün · C Innenstadt · B Geschäfte · I Gewerbe · H Hafen · W Ufer/Strand · T Bahnhof */
const ZG=['RRRRGRVV','RRRRRRVV','RRBCCBRG','GBCCCCBR','RBCCCCBR','RRBCTBRR','IIIBGRWW','HHHIGWWW'];
const ZN={R:'Wohnviertel',V:'Villenviertel',G:'Park',C:'Innenstadt',B:'Geschäftsviertel',I:'Gewerbegebiet',H:'Hafen',W:'Ufer',T:'Bahnhof'};
/* Zuordnung zu den Immobilien-Bezirken (DIST): 0 Altstadt · 1 Seeviertel · 2 Neubaugebiet · 3 Südstadt · 4 Hafen · 5 Vorstadt */
function zDist(z,i,j){return z==='C'||z==='T'||z==='B'?0:z==='V'||z==='W'?1:z==='H'||z==='I'?4:j<=1?2:(i<=1||i>=6)?5:3}
const PRULE=[['hafen','H',0],['club','HC',0],['casino','W',0],['villa','V',0],['park','G',1],['jva','I',-1],['buero','C',1],['boerse','C',1],['bank','C',1],['polizei','C',0],['makler','C',0],['jobcenter','C',0],
  ['reise','CB',0],['mall','B',0],['uni','B',-1],['bschule','BI',0],['fitness','B',0],['netcafe','BC',0],['autohaus','IB',0],['tierheim','IR',-1],['klinik','R',1],['schule','R',0],['kiosk','R',0]];
const RES=[0xF3E1C7,0xE8D0D9,0xD3E2EF,0xE6E6D4,0xD9E8D2,0xF1D5B8,0xC9D3E6,0xEFE8DA,0xE9C9B4,0xDDE3C8];
const OFF=[0xA9C4D8,0x8FA9C2,0xC9C3B6,0xB8C7CF,0x9DB3B0,0xD4CBBE,0x7F95AE,0xBFB2A2];
function layout(seed,opt){
  opt=opt||{};const r=rng(seed),rot=Math.floor(r()*4),sx=r()<.5?-1:1,th=rot*Math.PI/2,cs=Math.cos(th),sn=Math.sin(th);
  const W=(x,z)=>[sx*x*cs+z*sn,-sx*x*sn+z*cs],cells=[];
  for(let j=0;j<NB;j++)for(let i=0;i<NB;i++){const zn=ZG[j][i],cx=(i-(NB-1)/2)*PIT,cz=(j-(NB-1)/2)*PIT,w=W(cx,cz);
    cells.push({i,j,zone:zn,zn:ZN[zn],dist:zDist(zn,i,j),cx,cz,x:w[0],z:w[1],lots:[],trees:[],type:zn==='G'?'park':'res',top:0,place:null,own:[]})}
  const cd=c=>Math.hypot(c.cx,c.cz);
  const take=(id,zs,pref)=>{for(const z of zs){const L=cells.filter(c=>!c.place&&c.zone===z).map(c=>[c,pref*cd(c)+r()*(pref?3:100)]).sort((a,b)=>a[1]-b[1]);if(L.length){L[0][0].place=id;return L[0][0]}}return null};
  take('home',(opt.hz||'R')+'R',0);
  PRULE.forEach(([id,zs,pr])=>{if(PL[id])take(id,zs,pr)});
  PLACES.forEach(pl=>{if(!cells.some(c=>c.place===pl.id))take(pl.id,'RBCIVW',0)});
  const dw=opt.dw||{};
  cells.forEach((c,ci)=>{const R2=rng(seed*31+c.i*8+c.j+1),q=(dw[c.dist]||0),shopK=(opt.closed||[]).includes(ci)?4:3;
    const L=(x,z,w,d,h,col,kind,roof,extra)=>c.lots.push(Object.assign({x:c.cx+x,z:c.cz+z,w,d,h,col,kind,roof},extra||{}));
    if(c.place){const P=PL[c.place],h=P.h*(.9+R2()*.2);
      const sz={park:[3,3],kiosk:[3.2,2.6],villa:[6,4.6],mall:[8.6,6],hafen:[8,4.4],uni:[8,6.4],klinik:[7.4,7.4],jva:[5,5],schule:[7.6,4],autohaus:[7.6,5.6],tierheim:[6,4],casino:[7.6,5.4],home:[c.zone==='C'?6:4.6,c.zone==='C'?6:4]}[c.place]||[6.4,6.4];
      L(0,c.place==='mall'||c.place==='schule'?-1.6:0,sz[0],sz[1],c.place==='home'&&c.zone==='C'?Math.max(h,16):h,P.c,c.place==='park'?0:c.place==='buero'||c.place==='boerse'?2:c.place==='home'||c.place==='villa'||c.place==='klinik'?1:3,
        ['home','villa','kiosk','tierheim','schule'].includes(c.place)&&c.zone!=='C'?'gable':'flat',{place:c.place});c.top=.44+c.lots[0].h}
    else if(c.zone==='R'){[[-2.4,-2.4],[2.4,-2.4],[-2.4,2.4],[2.4,2.4]].forEach(([dx,dz])=>{const k=R2();if(k<.1)return;const cl=RES[Math.floor(R2()*RES.length)];
      if(k<.36-q*.06)L(dx,dz,4.3,4.3,4.6+R2()*3.4,cl,q<-.5&&R2()<.4?0:1,'flat');else L(dx,dz,3.3+R2()*.6,3.2+R2()*.6,2.5+R2()*1.2,cl,1,'gable')})}
    else if(c.zone==='V')L(R2()*1.6-.8,-.6,5.6,4.2,3+R2()*.6,[0xF4F1EA,0xEDE3D0,0xE6EEF2,0xF2E6DA][Math.floor(R2()*4)],1,'gable');
    else if(c.zone==='C'){const cl=()=>OFF[Math.floor(R2()*OFF.length)];if(R2()<.5)L(0,0,7.4,7.4,16+R2()*20,cl(),2,'flat');else{L(-2.4,0,4.2,8,12+R2()*16,cl(),2,'flat');L(2.6,-1.6,3.8,4.6,8+R2()*10,cl(),2,'flat')}}
    else if(c.zone==='B')L(0,-1.8,8.4,5.4,3.6+R2()*2,[0xE9DCC8,0xD8E1E8,0xE6D3D3,0xDCE6D6][Math.floor(R2()*4)],shopK,'flat',{shop:1});
    else if(c.zone==='I')L(0,-.8,8,6,4+R2()*1.6,[0xC9C2B4,0xB8BEC4,0xD0C8B0][Math.floor(R2()*3)],0,'saw');
    else if(c.zone==='H')L(0,-2.6,8.2,4,4.2,0xB7A58A,0,'gable');
    else if(c.zone==='W')L(-2.6,-2.8,3.2,2.6,2.6,0xF2E6CF,shopK,'flat',{shop:1});
    else if(c.zone==='T')L(0,-1.6,8.6,4,4.2,0xD9D2C3,2,'flat');
    if(!c.place&&c.lots.length)c.top=.44+Math.max(...c.lots.map(l=>l.h));else if(!c.place)c.top=1;
    if(c.zone==='G'&&!c.place)c.top=2.5});
  if(opt.tower){const c=cells.filter(c=>!c.place&&c.zone==='C').sort((a,b)=>Math.hypot(a.cx,a.cz)-Math.hypot(b.cx,b.cz))[0];if(c){c.lots=[{x:c.cx,z:c.cz,w:7.8,d:7.8,h:48,col:0x8FB3D1,kind:2,roof:'flat',tower:1}];c.top=48.6;c.lm='Stadtturm'}}
  // Eigene Firmen und Immobilien bekommen einen Bauplatz in einem passenden Viertel
  (opt.own||[]).forEach(o=>{const zs=o.z||'BCR',hs=hsh(o.id);let C=cells.filter(c=>!c.place&&c.lots.length&&zs.includes(c.zone)&&(o.dist==null||c.dist===o.dist||o.dist===c.dist));if(!C.length)C=cells.filter(c=>!c.place&&c.lots.length&&zs.includes(c.zone));if(!C.length)return;
    const c=C[hs%C.length],li=(hs>>>4)%c.lots.length,l=c.lots[li];if(l.own)return;l.own=o.kind;c.own.push({id:o.id,n:o.n,app:o.app,li,kind:o.kind})});
  return {cells,ext:NB*PIT+RD,rot,sx,th,W};
}
let G=null;
const glOK=(()=>{try{const c=document.createElement('canvas');return !!(window.THREE&&(c.getContext('webgl')||c.getContext('experimental-webgl')))}catch(e){return false}})();
/* Grafikqualität: auto erkennt das Gerät und stuft bei Ruckeln herunter */
const GQ={low:{pr:1,aa:false,sh:0,ao:0,far:300,fog:[110,260],cars:10,ped:0,det:0,fps:30},mid:{pr:1.5,aa:true,sh:0,ao:1,far:460,fog:[160,380],cars:18,ped:36,det:1,fps:60},high:{pr:2,aa:true,sh:1,ao:1,far:560,fog:[210,480],cars:26,ped:80,det:1,fps:60}};
function gfxQ(){const o=O.gfx||'auto';if(GQ[o])return o;if(GQ[O.gfxA])return O.gfxA;const N=typeof navigator!=='undefined'?navigator:{},S=typeof screen!=='undefined'?screen:{},m=N.deviceMemory||4,c=N.hardwareConcurrency||4,small=Math.min(S.width||800,S.height||800)<500;return (m<=2||c<=2)?'low':(m>=8&&c>=8&&!small)?'high':'mid'}
function winTex(){return null}function winEmTex(){return null}
function boxGeo(w,h,d){return new THREE.BoxGeometry(w,h,d)}
function label(t,col){
  const c=document.createElement('canvas'),x=c.getContext('2d'),F='800 34px Nunito, system-ui, sans-serif';x.font=F;
  const w=Math.ceil(x.measureText(t).width)+52;c.width=w;c.height=58;x.font=F;
  const r=16;x.fillStyle='rgba(255,255,255,.95)';x.beginPath();x.moveTo(r,2);x.lineTo(w-r,2);x.quadraticCurveTo(w-2,2,w-2,r);x.lineTo(w-2,56-r);x.quadraticCurveTo(w-2,56,w-r,56);x.lineTo(r,56);x.quadraticCurveTo(2,56,2,56-r);x.lineTo(2,r);x.quadraticCurveTo(2,2,r,2);x.fill();
  x.fillStyle=hex(col);x.beginPath();x.arc(24,29,9,0,7);x.fill();x.fillStyle='#1B1F2A';x.textBaseline='middle';x.fillText(t,40,31);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(w/58*2.3,2.3,1);s.renderOrder=10;return s}
function initThree(){
  if(G)return true;if(!glOK)return false;
  try{const qn=gfxQ(),q=GQ[qn],r=new THREE.WebGLRenderer({antialias:q.aa,powerPreference:qn==='low'?'low-power':'default'});r.setPixelRatio(Math.min(q.pr,window.devicePixelRatio||1));
    if(q.sh){r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap}
    G={r,qn,q,cam:new THREE.PerspectiveCamera(45,1,1,q.far),tgt:new THREE.Vector3(),dist:80,yaw:.7,el:.85,goal:null,ptr:new Map(),down:null,pick:[],pm:{},cars:[],seed:null,key:null,run:false,ray:new THREE.Raycaster(),mats:{},nk:0,uni:{night:{value:0},time:{value:0}},disp:[],fps:{n:0,t:0}};
    bindPointers(r.domElement);G.ro=new ResizeObserver(sizeThree);return true}catch(e){G=null;return false}
}
/* Qualität geändert: Renderer neu anlegen */
function cityReinit(){if(!G)return;G.run=false;try{G.ro.disconnect();cityDispose();G.r.dispose();G.r.forceContextLoss&&G.r.forceContextLoss();G.r.domElement.remove()}catch(e){errLog(e)}G=null;if(p&&tab==='stadt')render()}
function cityDispose(){G.pickGeo=G.pickMat=null;(G.disp||[]).forEach(o=>{try{o.dispose()}catch(e){errLog(e)}});G.disp=[];if(G.scene)G.scene.clear&&G.scene.clear()}
function mat(col){const k='c'+col;return G.mats[k]||(G.mats[k]=keep(new THREE.MeshLambertMaterial({color:col})))}
function winMat(col){return mat(col)}
function keep(o){G.disp.push(o);return o}
/* Fassaden-Shader: Fenster, beleuchtete Fenster bei Nacht und dunklere Bodenzone (Umgebungsverdeckung) ohne Texturen */
/* facadeMat() wurde durch facadeMat2() in 16b_gebaeude.js ersetzt (ausgerichtete Fenster, Rahmen, Simse, Sockel, Oberflächen). */
function gableGeo(){const g=new THREE.BufferGeometry(),A=[-.5,0,-.5],B=[.5,0,-.5],C=[.5,0,.5],D=[-.5,0,.5],E=[0,1,-.5],F=[0,1,.5];
  /* Wicklung gegen den Uhrzeigersinn von außen: Normalen zeigen nach außen (vorher innen: Giebel unsichtbar) */
  const v=[].concat(A,F,E,A,D,F,B,F,C,B,E,F,A,E,B,D,C,F);g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.computeVertexNormals();return g}
function aoTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,8,32,32,32);g.addColorStop(0,'rgba(0,0,0,.42)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return keep(new THREE.CanvasTexture(c))}
function buildScene(){
  if(G.scene)cityDispose();G.mats={};G.btx=null;G.bk=null;
  const opt=typeof cityOpts==='function'?cityOpts():{key:''},q=G.q;
  const L=layout(p.seed,opt);G.seed=p.seed;G.key=cityKey();G.L=L;G.pick=[];G.pm={};G.cars=[];G.peds=[];G.boats=[];
  const s=new THREE.Scene();s.fog=new THREE.Fog(0xCFE5F5,q.fog[0],q.fog[1]);G.cam.far=q.far;G.cam.updateProjectionMatrix();
  G.hemi=new THREE.HemisphereLight(0xffffff,0x7d8a6a,.7);s.add(G.hemi);G.sun=new THREE.DirectionalLight(0xffffff,.8);G.sun.position.set(50,90,30);s.add(G.sun,G.sun.target);
  if(q.sh){const S=G.sun.shadow;G.sun.castShadow=true;S.mapSize.set(2048,2048);const e=L.ext*.62;Object.assign(S.camera,{left:-e,right:e,top:e,bottom:-e,near:10,far:320});S.bias=-.0006;S.normalBias=.02;S.camera.updateProjectionMatrix()}
  // Himmel mit Verlauf und Sterne
  G.skyU={top:{value:new THREE.Color()},hor:{value:new THREE.Color()},bot:{value:new THREE.Color(0x8FA77E)}};
  G.sky=new THREE.Mesh(keep(new THREE.SphereGeometry(q.far*.85,24,12)),keep(new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:G.skyU,
    vertexShader:'varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform vec3 top;uniform vec3 hor;uniform vec3 bot;varying vec3 vP;void main(){float h=vP.y;vec3 c=h>0.?mix(hor,top,pow(smoothstep(0.,.6,h),.75)):mix(hor,bot,smoothstep(0.,-.15,h));gl_FragColor=vec4(c,1.);}'})));G.sky.renderOrder=-1;s.add(G.sky);
  {const n=q.det?420:200,pos=new Float32Array(n*3),R=rng(p.seed+3);for(let i=0;i<n;i++){const a=R()*6.283,e=.08+R()*1.4,rr=q.far*.8;pos[i*3]=Math.cos(a)*Math.cos(e)*rr;pos[i*3+1]=Math.sin(e)*rr;pos[i*3+2]=Math.sin(a)*Math.cos(e)*rr}
    const g=keep(new THREE.BufferGeometry());g.setAttribute('position',new THREE.BufferAttribute(pos,3));G.starM=keep(new THREE.PointsMaterial({color:0xffffff,size:1.6,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));G.stars=new THREE.Points(g,G.starM);s.add(G.stars)}
  const root=new THREE.Group();root.rotation.y=L.th;root.scale.x=L.sx;s.add(root);G.root=root;
  const ext=L.ext,half=ext/2,lines=[];for(let k=0;k<=NB;k++)lines.push((k-NB/2)*PIT);
  // Boden, Wasser, Straßen
  const gr=new THREE.Mesh(keep(new THREE.PlaneGeometry(900,900)),mat(0x9DBF86));gr.rotation.x=-Math.PI/2;gr.receiveShadow=!!q.sh;root.add(gr);
  const wm=keep(new THREE.MeshPhongMaterial({color:0x2E6E93,specular:0x9DC4E0,shininess:90}));G.water=wm;
  const wa=new THREE.Mesh(keep(new THREE.PlaneGeometry(900,420)),wm);wa.rotation.x=-Math.PI/2;wa.position.set(0,.06,half+1.2+210);root.add(wa);
  const as=new THREE.Mesh(keep(new THREE.PlaneGeometry(ext,ext)),mat(0x50565F));as.rotation.x=-Math.PI/2;as.position.y=.03;as.receiveShadow=!!q.sh;root.add(as);
  // Instanz-Sammler: gleiche Teile werden gemeinsam gezeichnet
  const PO={},o=new THREE.Object3D(),col=new THREE.Color();
  const put=(k,x,y,z,sx,sy,sz,c,ry,kind,mt,rx)=>(PO[k]=PO[k]||[]).push([x,y,z,sx,sy,sz,c,ry||0,kind||0,mt||0,rx||0]);
  const box=(x,y,z,w,h,d,c,ry)=>put('box',x,y+h/2,z,w,h,d,c,ry);
  const R=rng(p.seed*7+11);
  // Fahrbahnmarkierung und Zebrastreifen
  lines.forEach(c=>{for(let v=-half+1;v<half;v+=3){if(lines.some(o2=>Math.abs(o2-v)<RD/2+.6))continue;put('mark',v,.07,c,1.4,.02,.18,0xF2F2F2);put('mark',c,.07,v,.18,.02,1.4,0xF2F2F2)}});
  lines.forEach(a=>lines.forEach(b=>{if(Math.abs(a)>=half-1||Math.abs(b)>=half-1)return;for(let k=-1.5;k<=1.5;k+=.6){put('mark',a+k,.07,b-RD/2-.9,.32,.02,1.2,0xF6F6F6);put('mark',a-RD/2-.9,.07,b+k,1.2,.02,.32,0xF6F6F6)}}));
  // Kaimauer zum Wasser
  box(0,0,half+.6,ext+6,.55,1.4,0x8E8A83);
  const tree=(x,z,sc,kind,c)=>{const t=kind==null?Math.floor(R()*3):kind,g=c||[0x5FA35A,0x4E9150,0x6DAE5F,0x3F7F4A][Math.floor(R()*4)];
    put('trunk',x,.44+.6*sc,z,.32*sc,1.2*sc,.32*sc,0x7A5C42);
    if(t===0)put('crown',x,.44+1.25*sc+.9*sc,z,2.1*sc,2.3*sc,2.1*sc,g,R()*3);else if(t===1){put('cone',x,.44+1.0*sc+1.1*sc,z,1.9*sc,2.6*sc,1.9*sc,0x3C7A4E);put('cone',x,.44+1.0*sc+2.2*sc,z,1.3*sc,1.8*sc,1.3*sc,0x468A57)}
    else put('crown',x,.44+.8*sc,z,1.6*sc,1.1*sc,1.6*sc,g,R()*3)};
  const ao=(x,z,w,d)=>{if(q.ao)put('ao',x,.465,z,w+2.2,1,d+2.2,0)};
  /* Früher: const bld=(l,c)=>{…} – ersetzt durch buildBuilding() aus 16b_gebaeude.js */
  const BX={put,ao,q};
  // Viertel und Gebäude
  const RNG=c=>rng(p.seed*13+c.i*17+c.j*3+5);
  L.cells.forEach((c,ci)=>{const r2=RNG(c),X=c.cx,Z=c.cz,zn=c.zone,pl=c.place;
    const baseC=zn==='G'||pl==='park'?0x8DBE72:zn==='W'?0xD9C9A3:zn==='H'||zn==='I'?0xB9B6AE:0xD9DCE1;
    box(X,0,Z,BS,.4,BS,baseC);
    const inner=zn==='R'||zn==='V'?(c.dist!=null&&(opt.dw||{})[c.dist]<-.5?0x9FB07F:0x93C27A):zn==='C'||zn==='B'||zn==='T'?0xCBCDD1:null;if(inner&&!(zn==='G'))box(X,.4,Z,BS-1.5,.04,BS-1.5,inner);
    if(zn==='W'){box(X,.4,Z+2.2,BS,.03,BS*.55,0xE8D6A8);box(X,.4,Z-3.1,BS,.04,3.4,0xC9C2B8)}
    // Pick-Proxy für Orte (unsichtbar, aber anklickbar)
    if(pl){const pm=new THREE.Mesh(G.pickGeo||(G.pickGeo=keep(new THREE.BoxGeometry(1,1,1))),G.pickMat||(G.pickMat=keep(new THREE.MeshBasicMaterial({visible:false}))));pm.scale.set(BS,Math.max(3,c.top+1),BS);pm.position.set(X,Math.max(3,c.top+1)/2,Z);pm.userData.place=pl;root.add(pm);G.pick.push(pm);G.pm[pl]=pm}
    /* Gebäude: modularer Generator (16b_gebaeude.js) */
    c.lots.forEach(l=>{const tp=buildBuilding(l,c,BX);if(tp>c.top)c.top=tp});
    // Details je Ort
    if(pl==='klinik'){const t=c.top;box(X,t,Z,1.8,.25,.6,0xffffff);box(X,t,Z,.6,.25,1.8,0xffffff);put('glow',X,t+.27,Z,1.4,.05,.4,0xE5484D);put('glow',X,t+.27,Z,.4,.05,1.4,0xE5484D);box(X+3.1,.44,Z+3.1,2.4,.05,2.4,0x6C7480)}
    if(pl==='boerse'){put('cone',X,c.top+3,Z,1.2,6,1.2,0xD4AF37)}
    if(pl==='schule'){box(X,.4,Z+2.6,8,.05,3.6,0xC56B4A);box(X,.46,Z+2.6,7,.02,.08,0xffffff);box(X,.46,Z+2.6,.08,.02,3,0xffffff)}
    if(pl==='polizei'){put('glow',X,.44+c.lots[0].h*.85,Z+c.lots[0].d/2+.05,c.lots[0].w*.9,.3,.06,0x3E7CF0);put('cyl',X+2.4,.44+5,Z-2.4,1.2,10,1.2,0xA9B6CC)}
    if(pl==='jva'){[[0,4.4,BS-.6,.6],[0,-4.4,BS-.6,.6],[4.4,0,.6,BS-.6],[-4.4,0,.6,BS-.6]].forEach(([a,b,w,d])=>box(X+a,.44,Z+b,w,3,d,0x9AA0A8));[[-4.4,-4.4],[4.4,4.4]].forEach(([a,b])=>{box(X+a,.44,Z+b,1.2,5,1.2,0x8A8F99);put('glow',X+a,.44+5.3,Z+b,.5,.3,.5,0xFFF1B0)})}
    if(pl==='hafen'||zn==='H'){const n=q.det?14:6;for(let k=0;k<n;k++){const a=-3.8+(k%5)*1.9,b=1+Math.floor(k/5)*1.3;box(X+a,.44+(k>9?1.2:0),Z+b,1.7,1.15,1.1,[0xC0392B,0x2E86C1,0x27AE60,0xF39C12,0x7F8C8D][hsh(k+ci)%5])}
      box(X+3,.44,Z+BS/2+3,2,.3,7,0x8A7F6F)}
    if(pl==='autohaus'){for(let k=0;k<3;k++)put('car',X-2.6+k*2.6,.44,Z+3.6,1,1,1,[0xE4572E,0x2B59C3,0xF2C14E][k],0)}
    if(pl==='mall'||zn==='B'){for(let k=0;k<5;k++){box(X-4+k*2,.45,Z+3.2,.1,.02,2.4,0xffffff);if(q.det&&r2()<.6)put('car',X-3+k*2,.44,Z+3.2,1,1,1,[0xE4572E,0x2B59C3,0xF2C14E,0xFFFFFF,0x3BB273,0x222831][Math.floor(r2()*6)],Math.PI/2)}}
    if(zn==='I'&&!pl){put('cyl',X+3.2,.44+4,Z+3.4,.8,8,.8,0x9A8F86);put('cyl',X-3,.44+1.6,Z+3.2,2.2,3.2,2.2,0xC8CCD0);put('cyl',X-.6,.44+1.6,Z+3.2,2.2,3.2,2.2,0xC8CCD0)}
    if(zn==='V'&&!pl||pl==='villa'){box(X+2.6,.44,Z+3,3.4,.06,2,0x56B8E0);[[0,-4.6,BS-.6,.5],[0,4.6,BS-.6,.5]].forEach(([a,b,w,d])=>box(X+a,.44,Z+b,w,.9,d,0x3E7A45))}
    if(zn==='W'&&q.det){for(let k=0;k<5;k++){const a=-3.6+k*1.9,b=2.4+(k%2)*1.4;put('cyl',X+a,.44+.8,Z+b,.06,1.6,.06,0xDDDDDD);put('cone',X+a,.44+1.65,Z+b,1.5,.45,1.5,[0xE4572E,0xF2C14E,0x2B59C3,0xffffff][k%4])}}
    if(zn==='T'){box(X,.44+3,Z+2.6,8.6,.2,3.6,0xBFC8D0);for(let k=-1;k<=1;k++)put('cyl',X+k*3.4,.44+1.5,Z+2.6,.18,3,.18,0x6B7480);box(X-2.4,.44,Z+2.6,3.2,1.2,1.2,0xF2C14E);box(X+1.8,.44,Z+2.6,3.2,1.2,1.2,0xF2C14E);put('cyl',X+3.8,.44+4,Z-3.6,.6,8,.6,0xD9D2C3);put('glow',X+3.8,.44+7.2,Z-3.1,.8,.8,.05,0xFFF7E0)}
    // Bäume
    if(zn==='G'||pl==='park'){if(pl==='park'){put('cyl',X,.44+.2,Z,3.2,.4,3.2,0xC9C2B8);put('cyl',X,.44+.25,Z,2.4,.1,2.4,0x56B8E0);put('cyl',X,.44+1,Z,.25,1.6,.25,0xE5E5E5)}
      box(X,.42,Z,BS,.04,1,0xD8CFB8);box(X,.42,Z,1,.04,BS,0xD8CFB8);const n=pl==='park'?12:10;for(let k=0;k<n;k++){let a=(r2()-.5)*8.6,b=(r2()-.5)*8.6;if(Math.abs(a)<1.2)a+=a<0?-1.4:1.4;if(Math.abs(b)<1.2)b+=b<0?-1.4:1.4;tree(X+a,Z+b,.7+r2()*.6)}
      if(q.det)for(let k=0;k<4;k++)box(X+(k<2?-1.4:1.4),.44,Z+(k%2?3:-3),.3,.4,1.2,0x8A6A4A)}
    else if(zn==='R'||zn==='V'){const tq=(opt.dw||{})[c.dist]||0;[[-4.4,0],[4.4,0],[0,-4.4],[0,4.4]].forEach(([a,b])=>{if(r2()<.55+tq*.15)tree(X+a+(r2()-.5),Z+b+(r2()-.5),.6+r2()*.3,null)});c.lots.length<4&&zn==='R'&&tree(X+(r2()-.5)*4,Z+(r2()-.5)*4,.9,0)}
    else if(zn==='C'||zn==='B'){[[-4.6,-4.6],[4.6,-4.6],[-4.6,4.6],[4.6,4.6]].forEach(([a,b])=>{if(r2()<.7)tree(X+a,Z+b,.55,0)})}
    else if(zn==='W'&&!pl)tree(X+3.6,Z-3.8,.8,0,0x6DAE5F);
    if(c.lots.some(l=>l.tower)){put('cyl',X,c.top+4,Z,.4,8,.4,0xD9DEE4);put('glow',X,c.top+8.2,Z,.5,.5,.5,0xFF5A4F)}
  });
  // Wahrzeichen: Fernsehturm im Park am Rand
  {const tc=L.cells.find(c=>c.zone==='G'&&!c.place&&c.j===2)||L.cells.find(c=>c.zone==='G'&&!c.place);if(tc){const X=tc.cx+2.6,Z=tc.cz-2.6;put('cyl',X,.44+18,Z,1.6,36,1.6,0xD7DCE2);put('cyl',X,.44+3,Z,3.2,6,3.2,0xC4CBD3);put('sph',X,.44+32,Z,5,5,5,0xB9C2CC);put('cyl',X,.44+40,Z,.5,12,.5,0xE14B4B);put('glow',X,.44+46.2,Z,.6,.6,.6,0xFF5A4F);put('glow',X,.44+32,Z,5.2,.25,5.2,0xFFE2A6);tc.top=46;tc.lm='Fernsehturm'}}
  // Straßenbahn (ab einem gewissen Ausbau der Stadt)
  G.tram=null;if(opt.tram){for(let v=-half;v<half;v+=1.2)put('mark',v,.075,0,.25,.02,1.6,0x6F6A63);const tg=new THREE.Group(),tb=new THREE.Mesh(keep(new THREE.BoxGeometry(7,1.6,1.5)),mat(0xE8E2D0));tb.position.y=1.2;const ts=new THREE.Mesh(keep(new THREE.BoxGeometry(7.1,.5,1.55)),mat(0xC0392B));ts.position.y=.6;tg.add(tb,ts);root.add(tg);G.tram=tg;tg.userData.pos=-half}
  // Baustelle, Stadtfest und neuer Turm
  if(opt.bau!=null&&L.cells[opt.bau]){const c=L.cells[opt.bau];box(c.cx,.44,c.cz,BS-.4,.06,BS-.4,0x9C8462);[[0,4.6,BS-.4,.2],[0,-4.6,BS-.4,.2],[4.6,0,.2,BS-.4],[-4.6,0,.2,BS-.4]].forEach(([a,b,w,d])=>box(c.cx+a,.44,c.cz+b,w,1,d,0xF2C14E));box(c.cx-2.5,.44,c.cz-2.5,.5,14,.5,0xE0A33A);box(c.cx-.5,14.4,c.cz-2.5,8,.5,.5,0xE0A33A);box(c.cx+1.2,.44,c.cz+1,4,3,4,0xA8A39A)}
  if(opt.fest){const c=L.cells.find(x=>x.place==='park');if(c){box(c.cx,.44,c.cz-3.4,4.4,.6,2,0x3A3550);box(c.cx,.44+.6,c.cz-4.2,4.4,2.6,.2,0x2A2540);for(let k=0;k<12;k++)put('glow',c.cx-4+k*.75,.44+2.4+Math.sin(k)*.3,c.cz+3.6,.25,.25,.25,[0xFF6B6B,0xFFD93D,0x6BCB77,0x4D96FF][k%4])}}
  // Laternen
  {const pos=[];lines.forEach(a=>lines.forEach(b=>pos.push([a+RD/2+.4,b+RD/2+.4])));lines.forEach(a=>{for(let v=-half+PIT/2;v<half;v+=PIT)pos.push([a+RD/2+.4,v],[v,a+RD/2+.4])});
    pos.forEach(([a,b])=>{put('lpole',a,1.65,b,1,1,1,0x3B3550);put('lhead',a,3.35,b,.62,.5,.62,0xFFF2CF);put('lglow',a,.08,b,1,1,1,0)});}
  // Instanzen erzeugen
  const GEO={box:keep(new THREE.BoxGeometry(1,1,1)),wall:keep(new THREE.BoxGeometry(1,1,1)),mark:null,gable:keep(gableGeo()),cyl:keep(new THREE.CylinderGeometry(.5,.5,1,10)),cone:keep(new THREE.ConeGeometry(.5,1,8)),sph:keep(new THREE.SphereGeometry(.5,14,8,0,Math.PI*2,0,Math.PI/2)),
    crown:keep(new THREE.IcosahedronGeometry(.5,1)),trunk:keep(new THREE.CylinderGeometry(.35,.5,1,6)),glow:null,ao:keep(new THREE.PlaneGeometry(1,1)),lpole:keep(new THREE.CylinderGeometry(.09,.12,3.3,5)),lhead:keep(new THREE.SphereGeometry(.5,8,6)),lglow:keep(new THREE.PlaneGeometry(5.5,5.5)),car:null};
  GEO.mark=GEO.box;GEO.glow=GEO.box;
  {const cg=keep(new THREE.BoxGeometry(2.3,.7,1.1));cg.translate(0,.55,0);GEO.car=cg}
  const gc=document.createElement('canvas');gc.width=gc.height=64;{const gx=gc.getContext('2d'),gg=gx.createRadialGradient(32,32,0,32,32,32);gg.addColorStop(0,'rgba(255,205,120,.85)');gg.addColorStop(1,'rgba(255,205,120,0)');gx.fillStyle=gg;gx.fillRect(0,0,64,64)}
  G.glowM=keep(new THREE.MeshBasicMaterial({map:keep(new THREE.CanvasTexture(gc)),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0}));
  G.lampM=keep(new THREE.MeshBasicMaterial({color:0xffffff}));
  const MAT={wall:facadeMat2(),glow:G.lampM,lhead:G.lampM,ao:keep(new THREE.MeshBasicMaterial({map:aoTex(),transparent:true,depthWrite:false,color:0xffffff})),lglow:G.glowM};
  const lam=keep(new THREE.MeshLambertMaterial({color:0xffffff}));
  Object.keys(PO).forEach(k=>{const A=PO[k],gm=GEO[k]?null:bldGeoMat(k),geo=k==='wall'?GEO.wall:(GEO[k]||(gm&&gm[0])),m=MAT[k]||(gm&&gm[1])||lam;if(!geo)return;const im=new THREE.InstancedMesh(geo,m,A.length);
    if(k==='wall'){const kd=new Float32Array(A.length),md=new Float32Array(A.length);A.forEach((a,i)=>{kd[i]=a[8];md[i]=a[9]});geo.setAttribute('aKind',new THREE.InstancedBufferAttribute(kd,1));geo.setAttribute('aMat',new THREE.InstancedBufferAttribute(md,1))}
    A.forEach((a,i)=>{o.position.set(a[0],a[1],a[2]);o.rotation.set(k==='ao'||k==='lglow'?-Math.PI/2:a[10],a[7],0);if(k==='ao'||k==='lglow')o.rotation.set(-Math.PI/2,0,0);o.scale.set(a[3],k==='ao'?a[5]:a[4],k==='ao'?1:a[5]);if(k==='lglow'||k==='lpole'||k==='car')o.scale.set(1,1,1);o.updateMatrix();im.setMatrixAt(i,o.matrix);if(k!=='lglow'&&k!=='ao')im.setColorAt(i,col.setHex(a[6]))});
    if(im.instanceColor)im.instanceColor.needsUpdate=true;if(q.sh&&(gm?gm[2]:!['mark','glow','ao','lglow','lpole','lhead'].includes(k))){im.castShadow=true;im.receiveShadow=true}else if(q.sh&&gm)im.receiveShadow=true;
    if(k==='ao'||k==='lglow'||k==='mark')im.renderOrder=1;root.add(im);if(k==='glow')G.glowIM=im});
  // Autos (bewegt, instanziert)
  {const n=q.cars,CC=[0xE4572E,0x2B59C3,0xF2C14E,0xF4F4F4,0x3BB273,0x7768AE,0x222831,0x8E9AAF,0xB23A48],lanes=lines.filter(l=>Math.abs(l)<half-1||true);
    G.carB=new THREE.InstancedMesh(GEO.car,lam,n);G.carC=new THREE.InstancedMesh(keep(new THREE.BoxGeometry(1.2,.5,1)),keep(new THREE.MeshLambertMaterial({color:0x9FC1DD})),n);G.carL=new THREE.InstancedMesh(GEO.box,G.lampM,n*2);
    for(let i=0;i<n;i++){G.carB.setColorAt(i,col.setHex(CC[i%CC.length]));G.carL.setColorAt(i*2,col.setHex(0xFFF3C4));G.carL.setColorAt(i*2+1,col.setHex(0xFFF3C4));const ax=i%2,dir=i%4<2?1:-1;let line=lanes[Math.floor(R()*lanes.length)];if(opt.tram&&!ax&&line===0)line=lanes[0];
      G.cars.push({ax,dir,line:line+dir*(ax?-1:1)*.95,pos:(R()-.5)*ext,sp:5+R()*6})}
    G.carB.instanceColor.needsUpdate=true;G.carL.instanceColor.needsUpdate=true;if(q.sh){G.carB.castShadow=true}root.add(G.carB,G.carC,G.carL);[G.carB,G.carC,G.carL].forEach(m=>{m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.frustumCulled=false})}
  // Fußgänger laufen um die Blöcke
  if(q.ped){const n=q.ped,SH=[0xE4572E,0x2B59C3,0xF2C14E,0x3BB273,0x7768AE,0xF4F4F4,0x222831,0xE88EB3];
    G.pedB=new THREE.InstancedMesh(keep(new THREE.CylinderGeometry(.2,.26,.9,6)),lam,n);G.pedH=new THREE.InstancedMesh(keep(new THREE.SphereGeometry(.2,6,5)),keep(new THREE.MeshLambertMaterial({color:0xE8C09A})),n);
    const walk=L.cells.filter(c=>c.zone!=='I');for(let i=0;i<n;i++){const c=walk[Math.floor(R()*walk.length)];G.peds.push({x:c.cx,z:c.cz,t:R()*4,sp:(.05+R()*.05)*(R()<.5?1:-1)});G.pedB.setColorAt(i,col.setHex(SH[i%SH.length]))}
    G.pedB.instanceColor.needsUpdate=true;[G.pedB,G.pedH].forEach(m=>{m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.frustumCulled=false});root.add(G.pedB,G.pedH)}
  // Boote auf dem Wasser
  for(let k=0;k<(q.det?3:1);k++){const bg=new THREE.Group(),hu=new THREE.Mesh(GEO.box,mat(0xF4F4F4));hu.scale.set(5,.8,1.8);hu.position.y=.5;const cb=new THREE.Mesh(GEO.box,mat(0x2E6E93));cb.scale.set(1.8,.9,1.3);cb.position.set(-.6,1.3,0);bg.add(hu,cb);bg.userData={z:half+14+k*18,pos:(R()-.5)*ext*1.4,sp:(2+R()*2)*(k%2?1:-1)};if(bg.userData.sp<0)bg.rotation.y=Math.PI;root.add(bg);G.boats.push(bg)}
  // Auswahl-Ring und Spielfigur über dem Zuhause
  G.selR=new THREE.Mesh(keep(new THREE.RingGeometry(6.2,7,40)),keep(new THREE.MeshBasicMaterial({color:0xFFD27A,transparent:true,opacity:.85,depthWrite:false})));G.selR.rotation.x=-Math.PI/2;G.selR.visible=false;G.selR.renderOrder=2;root.add(G.selR);
  const home=L.cells.find(c=>c.place==='home');G.pin=new THREE.Group();
  const ball=new THREE.Mesh(keep(new THREE.SphereGeometry(1.1,16,12)),keep(new THREE.MeshLambertMaterial({color:0x2B59C3,emissive:0x0d2050})));const cone=new THREE.Mesh(keep(new THREE.ConeGeometry(.7,1.6,12)),mat(0x2B59C3));cone.rotation.x=Math.PI;cone.position.y=-1.4;
  G.pin.add(ball,cone);G.pin.visible=false;G.pin.userData.y=home.top+6.2;G.pin.position.set(home.cx,G.pin.userData.y,home.cz);root.add(G.pin);
  G.scene=s;G.tgt.set(home.x*.6,0,home.z*.6);G.ck=null;highlight();pinsBuild();
}
function sizeThree(){if(!G)return;const cv=document.getElementById('cv');if(!cv)return;const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;G.r.setSize(w,h);G.cam.aspect=w/h;G.cam.updateProjectionMatrix();G.ck=null}
function updCam(){const c=Math.cos(G.el);G.cam.position.set(G.tgt.x+Math.sin(G.yaw)*c*G.dist,Math.sin(G.el)*G.dist,G.tgt.z+Math.cos(G.yaw)*c*G.dist);G.cam.lookAt(G.tgt)}
const SKYK=[[0x5E9BD6,0xCFE5F5,0xffffff,.85,.72],[0x3A3F86,0xF6A46C,0xFFB37A,.5,.55],[0x0A0E2A,0x2A2560,0x6E63C9,.14,.5]];
const _sc={a:null,b:null};
function skyAt(nk){const a=nk<.5?SKYK[0]:SKYK[1],b=nk<.5?SKYK[1]:SKYK[2],k=nk<.5?nk*2:(nk-.5)*2;_sc.a=_sc.a||new THREE.Color();_sc.b=_sc.b||new THREE.Color();
  G.skyU.top.value.copy(_sc.a.setHex(a[0]).lerp(_sc.b.setHex(b[0]),k));G.skyU.hor.value.copy(_sc.a.setHex(a[1]).lerp(_sc.b.setHex(b[1]),k));G.scene.fog.color.copy(G.skyU.hor.value);G.skyU.bot.value.copy(G.skyU.hor.value).multiplyScalar(.75);
  G.sun.color.copy(_sc.a.setHex(a[2]).lerp(_sc.b.setHex(b[2]),k));G.sun.intensity=a[3]+(b[3]-a[3])*k;G.hemi.intensity=a[4]+(b[4]-a[4])*k;G.hemi.color.setHex(0xffffff).lerp(NIGHTC,Math.max(0,nk-.3));
  const el=(1-Math.min(1,nk*1.6))*.9+.12;G.sun.position.set(G.tgt.x+Math.cos(.8)*120*Math.cos(el),Math.sin(el)*120,G.tgt.z+Math.sin(.8)*120*Math.cos(el));G.sun.target.position.copy(G.tgt)}
const _m4={o:null};
function loop(t){
  if(!G||!G.run)return;requestAnimationFrame(loop);
  if(G.q.fps<60&&G.lf&&t-G.lf<30)return;const dt=Math.min(.06,(t-(G.lt||t))/1000);G.lt=t;G.lf=t;const half=G.L.ext/2,o=_m4.o||(_m4.o=new THREE.Object3D());
  // Leistung beobachten: bei Ruckeln automatisch eine Stufe herunter
  if(!O.gfx||O.gfx==='auto'){const f=G.fps;if(f.n<270){f.n++;if(f.n>30)f.t+=dt;if(f.n===270&&f.t/240>(G.qn==='high'?.024:.034)&&G.qn!=='low'){O.gfxA=G.qn==='high'?'mid':'low';try{saveO&&saveO()}catch(e){errLog(e)}setTimeout(cityReinit,0);return}}}
  G.cars.forEach((u,i)=>{u.pos+=u.dir*u.sp*dt;if(u.pos>half)u.pos=-half;if(u.pos<-half)u.pos=half;const x=u.ax?u.line:u.pos,z=u.ax?u.pos:u.line,ry=u.ax?(u.dir>0?-Math.PI/2:Math.PI/2):(u.dir>0?0:Math.PI);
    o.rotation.set(0,ry,0);o.scale.set(1,1,1);o.position.set(x,0,z);o.updateMatrix();G.carB.setMatrixAt(i,o.matrix);o.position.y=1.15;o.translateX(-.15);o.updateMatrix();G.carC.setMatrixAt(i,o.matrix);
    const on=G.nk>.35;o.position.set(x,.6,z);o.translateX(1.17);o.scale.set(on?.08:0,on?.18:0,on?.25:0);o.translateZ(-.35);o.updateMatrix();G.carL.setMatrixAt(i*2,o.matrix);o.translateZ(.7);o.updateMatrix();G.carL.setMatrixAt(i*2+1,o.matrix)});
  G.carB.instanceMatrix.needsUpdate=G.carC.instanceMatrix.needsUpdate=G.carL.instanceMatrix.needsUpdate=true;
  if(G.pedB){const near=G.dist<120,hs=BS/2-.45;G.pedB.visible=G.pedH.visible=near;if(near){G.peds.forEach((u,i)=>{u.t=(u.t+u.sp*dt*4+4)%4;const s=Math.floor(u.t),f=u.t-s,a=-hs+f*2*hs;let x,z;
      if(s===0){x=a;z=-hs}else if(s===1){x=hs;z=a}else if(s===2){x=-a;z=hs}else{x=-hs;z=-a}const bob=Math.abs(Math.sin(t/140+i))*.06;
      o.rotation.set(0,0,0);o.scale.set(1,1,1);o.position.set(u.x+x,.44+.45+bob,u.z+z);o.updateMatrix();G.pedB.setMatrixAt(i,o.matrix);o.position.y+=.62;o.updateMatrix();G.pedH.setMatrixAt(i,o.matrix)});G.pedB.instanceMatrix.needsUpdate=G.pedH.instanceMatrix.needsUpdate=true}}
  if(G.tram){const u=G.tram.userData;u.pos+=4*dt;if(u.pos>half)u.pos=-half;G.tram.position.set(u.pos,0,0)}
  G.boats.forEach(b=>{const u=b.userData;u.pos+=u.sp*dt;const lim=half*1.6;if(u.pos>lim)u.pos=-lim;if(u.pos<-lim)u.pos=lim;b.position.set(u.pos,Math.sin(t/700+u.z)*.12,u.z)});
  G.pin.position.y=G.pin.userData.y+Math.sin(t/400)*.5;if(G.selR.visible)G.selR.material.opacity=.55+Math.sin(t/260)*.3;
  const nk=nightK(t);G.nk+=(nk-G.nk)*.05;G.uni.night.value=G.nk;skyAt(G.nk);G.starM.opacity=Math.max(0,G.nk-.45)*1.6;G.glowM.opacity=G.nk*.9;G.lampM.color.setScalar(.92+G.nk*.08);
  if(G.goal){G.tgt.lerp(G.goal,.08);if(G.tgt.distanceTo(G.goal)<.05)G.goal=null}
  const elGoal=cityMode==='2d'?1.5:.85;G.el+=(elGoal-G.el)*.1;
  updCam();G.sky.position.copy(G.cam.position);G.stars.position.copy(G.cam.position);G.r.render(G.scene,G.cam);
  // Pins nur neu setzen, wenn sich die Kamera bewegt hat (spart DOM-Arbeit)
  const P=G.cam.position,ck=P.x.toFixed(2)+','+P.y.toFixed(2)+','+P.z.toFixed(2)+','+G.tgt.x.toFixed(2)+','+G.tgt.z.toFixed(2);
  if(ck!==G.ck||t-(G.pt||0)>600){G.ck=ck;G.pt=t;cevProject();pinsProject()}
}
function bindPointers(el){
  el.style.touchAction='none';
  el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);G.ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});G.down=G.ptr.size===1?{x:e.clientX,y:e.clientY,t:performance.now(),mv:0}:Object.assign(G.down||{},{mv:99})});
  el.addEventListener('pointermove',e=>{const o=G.ptr.get(e.pointerId);if(!o)return;
    if(G.ptr.size===2){const [a,b]=[...G.ptr.values()];const d0=Math.hypot(a.x-b.x,a.y-b.y),r0=Math.atan2(b.y-a.y,b.x-a.x);o.x=e.clientX;o.y=e.clientY;
      const [a2,b2]=[...G.ptr.values()];const d1=Math.hypot(a2.x-b2.x,a2.y-b2.y),r1=Math.atan2(b2.y-a2.y,b2.x-a2.x);if(d1>0)G.dist=clamp(G.dist*d0/d1,26,200);if(cityMode!=='2d')G.yaw-=r1-r0;return}
    const dx=e.clientX-o.x,dy=e.clientY-o.y;o.x=e.clientX;o.y=e.clientY;if(G.down)G.down.mv+=Math.abs(dx)+Math.abs(dy);
    const k=G.dist*.0019,sy=Math.sin(G.yaw),cy=Math.cos(G.yaw),lim=G.L.ext/2;
    G.tgt.x=clamp(G.tgt.x-(cy*dx+sy*dy)*k,-lim,lim);G.tgt.z=clamp(G.tgt.z-(-sy*dx+cy*dy)*k,-lim,lim);G.goal=null});
  const up=e=>{if(!G.ptr.has(e.pointerId))return;G.ptr.delete(e.pointerId);
    if(!G.ptr.size&&G.down&&G.down.mv<10&&performance.now()-G.down.t<500){const rc=el.getBoundingClientRect();
      G.ray.setFromCamera({x:(e.clientX-rc.left)/rc.width*2-1,y:-(e.clientY-rc.top)/rc.height*2+1},G.cam);const h=G.ray.intersectObjects(G.pick,false)[0];if(h)selectPlace(h.object.userData.place)}
    if(!G.ptr.size)G.down=null};
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',e=>{G.ptr.delete(e.pointerId);G.down=null});
  el.addEventListener('wheel',e=>{e.preventDefault();G.dist=clamp(G.dist*(1+Math.sign(e.deltaY)*.1),26,200)},{passive:false});
}
function highlight(){if(!G||!G.L||!G.selR)return;const c=sel&&G.L.cells.find(x=>x.place===sel);G.selR.visible=!!c;if(c)G.selR.position.set(c.cx,.5,c.cz);pinsBuild()}
function selectPlace(id){sel=id;if(G&&G.L){const c=G.L.cells.find(x=>x.place===id);if(c&&tab==='stadt'&&cityMode!=='list')G.goal=new THREE.Vector3(c.x,0,c.z)}highlight();render()}
function cityKey(){return p.seed+'|'+(typeof cityOpts==='function'?cityOpts().key:'')+'|'+(G?G.qn:'')}
function showCity(on){
  const w=document.getElementById('city');if(!w)return;
  if(!on){w.style.display='none';if(G)G.run=false;return}
  w.style.display='block';const cv=document.getElementById('cv');
  if(G.r.domElement.parentNode!==cv)cv.appendChild(G.r.domElement);G.ro.disconnect();G.ro.observe(cv);sizeThree();
  if(G.seed!==p.seed||G.key!==cityKey())buildScene();
  if(!G.run){G.run=true;G.lt=0;requestAnimationFrame(loop)}
}
document.addEventListener('visibilitychange',()=>{if(!G)return;if(document.hidden)G.run=false;else if(tab==='stadt'&&document.getElementById('city')&&document.getElementById('city').style.display==='block'&&!G.run){G.run=true;G.lt=0;requestAnimationFrame(loop)}});
