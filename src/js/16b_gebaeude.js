/* ================= Gebäudegenerator für die 3D-Stadt =================
   Ersetzt die frühere Funktion bld() in buildScene() (16_stadt_3d.js) und die Ort-Details für Bank, Uni, Casino
   und den Hafenkran. Jedes Grundstück aus layout() ({x,z,w,d,h,col,kind,roof,place,shop,own,tower}) wird über
   buildBuilding() aus Modulen zusammengesetzt: Sockel, Fassade, Gesimse, Dach, Eingang, Dachaufbauten.

   Performance:
   - Alles läuft weiter über den Instanz-Sammler put(): gleiche Bauteile teilen sich eine Geometrie und ein Material
     und werden mit EINEM Draw-Call gezeichnet (InstancedMesh). Ein Gebäude ist nur eine Liste von Einträgen.
   - Texturen entstehen einmal pro Szene prozedural (DataTexture, 256 × 256) und werden im Weltraum projiziert.
     Dadurch verzerren sie bei unterschiedlich skalierten Instanzen nicht.
   - Fenster, Rahmen, Simse und Sockel zeichnet der Fassaden-Shader, nicht einzelne Meshes.
   - Schatten werfen nur große Bauteile. Kleinteile entfallen auf schwacher Grafik (q.det = 0). */

/* ---------- Prozedurale Texturen ---------- */
const TXN=256;
const txH=(i,j)=>{const s=Math.sin(i*127.1+j*311.7)*43758.5453;return s-Math.floor(s)};
function txNoise(x,y,sc){const gx=x/sc,gy=y/sc,i=Math.floor(gx),j=Math.floor(gy),fx=gx-i,fy=gy-j,n=TXN/sc,
  a=txH(i%n,j%n),b=txH((i+1)%n,j%n),c=txH(i%n,(j+1)%n),d=txH((i+1)%n,(j+1)%n),u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
const txFbm=(x,y)=>txNoise(x,y,64)*.5+txNoise(x,y,32)*.3+txNoise(x,y,16)*.2;
/* Muster liefern einen Grauwert 0–255; ~210 = Fläche, dunkler = Fuge/Rille */
const TXP={
  putz:(x,y)=>208+30*(txFbm(x,y)-.5)+10*(txNoise(x,y,4)-.5),
  ziegel:(x,y)=>{const r=Math.floor(y/32),o=r%2?32:0,bx=(x+o)%64,by=y%32;if(bx<3||by<3)return 150+10*txNoise(x,y,8);return 196+34*txH(r,Math.floor((x+o)/64)%4)+14*(txNoise(x,y,8)-.5)},
  stein:(x,y)=>{const r=Math.floor(y/64),o=r%2?64:0,bx=(x+o)%128,by=y%64;if(bx<3||by<3)return 158;return 206+24*txH(r+7,Math.floor((x+o)/128)%2)+16*(txFbm(x*2,y*2)-.5)+(by<7?14:0)},
  welle:(x,y)=>205+38*Math.sin(x/TXN*16*Math.PI*2)+6*(txNoise(x,y,32)-.5),
  beton:(x,y)=>(x%128<2||y%128<2)?165:202+26*(txFbm(x,y)-.5),
  holz:(x,y)=>{const bx=x%32;if(bx<2)return 140;return 188+30*txH(Math.floor(x/32),3)+12*Math.sin(y*.21+txNoise(x,y,16)*6)},
  ziegeldach:(x,y)=>{const r=Math.floor(y/16),o=r%2?16:0,bx=(x+o)%32,by=y%16;if(bx<2)return 150;return 184+48*(by/16)-(by>13?52:0)+18*(txH(r,Math.floor((x+o)/32)%8)-.5)},
  streifen:x=>Math.floor(x/32)%2?255:178};
function txData(fns){const D=new Uint8Array(TXN*TXN*4);for(let y=0;y<TXN;y++)for(let x=0;x<TXN;x++){const i=(y*TXN+x)*4;
  for(let ch=0;ch<4;ch++){const f=fns[ch]||fns[0];D[i+ch]=f?Math.max(0,Math.min(255,f(x,y))):255}}return D}
function txMake(D){const t=new THREE.DataTexture(D,TXN,TXN,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=2;t.needsUpdate=true;return keep(t)}
/* Fassade: R Putz, G Ziegel, B Naturstein, A Wellblech. Übrige Texturen grau. */
function bldTex(){if(G.btx)return G.btx;const gray=f=>txMake(txData([f,f,f,()=>255]));
  return G.btx={fac:txMake(txData([TXP.putz,TXP.ziegel,TXP.stein,TXP.welle])),stein:gray(TXP.stein),dach:gray(TXP.ziegeldach),welle:gray(TXP.welle),beton:gray(TXP.beton),holz:gray(TXP.holz),streifen:gray(TXP.streifen)}}

/* ---------- Materialien ---------- */
const WV='#ifdef USE_INSTANCING\nmat4 mmx=modelMatrix*instanceMatrix;\n#else\nmat4 mmx=modelMatrix;\n#endif\n';
/* Weltraum-Textur (triplanar): keine UV-Verzerrung bei skalierten Instanzen, wirkt wie Bump durch Fugen und Rillen */
function wtMat(tex,sc,std){const m=keep(std?new THREE.MeshStandardMaterial(Object.assign({color:0xffffff},std)):new THREE.MeshLambertMaterial({color:0xffffff}));
  m.onBeforeCompile=sh=>{sh.uniforms.uT={value:tex};sh.uniforms.uS={value:sc};
    sh.vertexShader='varying vec3 vWP2;varying vec3 vWN2;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n'+WV+'vWP2=(mmx*vec4(transformed,1.)).xyz;vWN2=normalize(mat3(mmx)*objectNormal);');
    sh.fragmentShader='uniform sampler2D uT;uniform float uS;varying vec3 vWP2;varying vec3 vWN2;\n'+sh.fragmentShader.replace('#include <color_fragment>',
      '#include <color_fragment>\nvec3 n2=abs(vWN2);vec2 tc=n2.y>.8?vWP2.xz:(n2.x>n2.z?vWP2.zy:vWP2.xy);float tv=texture2D(uT,tc*uS).r;diffuseColor.rgb*=.42+.7*tv;diffuseColor.rgb*=mix(.7,1.,smoothstep(0.,2.4,vWP2.y));')};
  m.customProgramCacheKey=()=>'wt'+(std?'s':'l');return m}
/* Fassade: Fenster an der Gebäudekante ausgerichtet, Rahmen, Fensterbank, Geschoss-Simse, Sockel, Oberflächenstruktur, Licht bei Nacht.
   aKind: 0 ohne Fenster, 1 Wohnen, 2 Büro-Raster, 3 Laden (Schaufenster unten), 4 geschlossen
   aMat:  0 Putz, 1 Ziegel, 2 Naturstein, 3 Wellblech, 4 Glasfassade, 5 Beton */
function facadeMat2(){const m=keep(new THREE.MeshLambertMaterial({color:0xffffff})),tex=bldTex().fac;
  m.onBeforeCompile=sh=>{sh.uniforms.uNight=G.uni.night;sh.uniforms.uDet={value:tex};
    sh.vertexShader='attribute float aKind;attribute float aMat;\nvarying vec3 vWP;varying vec3 vLoc;varying vec3 vSz;varying vec3 vON;varying float vKind;varying float vMat;\n'+sh.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\n'+WV+'vWP=(mmx*vec4(transformed,1.)).xyz;vSz=vec3(length(mmx[0].xyz),length(mmx[1].xyz),length(mmx[2].xyz));vLoc=transformed*vSz;vON=objectNormal;vKind=aKind;vMat=aMat;');
    sh.fragmentShader='uniform float uNight;uniform sampler2D uDet;\nvarying vec3 vWP;varying vec3 vLoc;varying vec3 vSz;varying vec3 vON;varying float vKind;varying float vMat;\nfloat h21(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}\n'+sh.fragmentShader
      .replace('#include <color_fragment>','#include <color_fragment>\nfloat win=0.,lit=0.,frm=0.;\n'+
        'if(abs(vON.y)<.5){bool sx=abs(vON.x)>.5;float al=sx?vLoc.z:vLoc.x,wd=sx?vSz.z:vSz.x,y=vWP.y-.44;'+
        'vec4 dt=texture2D(uDet,vec2(al,y)*.55);float det=vMat<.5?dt.r:vMat<1.5?dt.g:vMat<2.5?dt.b:vMat<3.5?dt.a:vMat<4.5?1.:mix(dt.r,dt.b,.5);'+
        'diffuseColor.rgb*=.58+.5*det;'+
        'float bw=vKind>1.5&&vKind<2.5?.95:1.2,nb=max(1.,floor(wd/bw)),pos=(al+wd*.5)/(wd/nb),u=fract(pos),v=fract(y/1.3);'+
        'float inWin=step(.26,u)*step(u,.74)*step(.36,v)*step(v,.8)*step(.95,y)*step(y,vSz.y-.35);'+
        'float inGl=step(.31,u)*step(u,.69)*step(.41,v)*step(v,.76);'+
        'float sill=step(.22,u)*step(u,.78)*step(.31,v)*step(v,.36)*step(.95,y)*step(y,vSz.y-.35);'+
        'if(vKind>.5&&vKind<1.5){win=inWin*inGl;frm=max(inWin*(1.-inGl),sill);}'+
        'else if(vKind>1.5&&vKind<2.5){float v2=fract(y/1.2),u2=fract(pos);win=step(.14,v2)*step(v2,.86)*step(.06,u2)*step(u2,.94)*step(.7,y);frm=(1.-win)*step(.7,y)*.5;}'+
        'else if(vKind>2.5&&vKind<3.5){float n2=max(1.,floor(wd/2.6)),u3=fract((al+wd*.5)/(wd/n2));if(y<1.9){win=step(.07,u3)*step(u3,.93)*step(.18,y)*step(y,1.62);frm=step(1.62,y)*step(y,1.9);}else{win=inWin*inGl;frm=inWin*(1.-inGl);}}'+
        'float flr=(vMat<2.5&&vKind>.5&&vKind<3.5&&y>1.3)?(1.-step(.05,v))*step(.95,y):0.;'+
        'vec3 gl=mix(vec3(.18,.24,.34),vec3(.46,.58,.7),smoothstep(0.,40.,y)*.7+.18*h21(floor(vec2(pos,y/1.3))));'+
        'if(vMat>3.5&&vMat<4.5){gl=mix(gl,vec3(.36,.5,.62),.4);}'+
        'if(vKind>3.5){float b=step(y,1.6)*step(.1,y);diffuseColor.rgb=mix(diffuseColor.rgb*.72,vec3(.5,.42,.33),b*.9);}'+
        'else{diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.93,.91,.86),frm*.85);diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*1.16+.04,flr);diffuseColor.rgb=mix(diffuseColor.rgb,gl,win*.9);}'+
        'float soc=step(y,.62)*step(vMat,2.5)*(1.-step(2.5,vKind)*step(vKind,3.5));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.5,.48,.45)*(.7+.4*dt.b),soc*.8);'+
        'float cid=h21(floor(vec2(pos,y/1.3))+floor(vWP.xz*.09)*7.);lit=win*step(vKind>1.5&&vKind<2.5?.6:.48,cid);diffuseColor.rgb*=mix(.64,1.,smoothstep(0.,2.6,y));}\n'+
        'else if(vON.y<-.5)diffuseColor.rgb*=.6;')
      .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=vec3(1.,.76,.45)*lit*uNight;')};
  m.customProgramCacheKey=()=>'fassade2';return m}
/* Bauteil-Arten des Generators: [Geometrie, Material, wirft Schatten] */
const BKIND={stone:['box','stein',1],trim:['box','stein',0],colm:['col','stein',1],ped:['gable','stein',1],plat:['box','beton',1],conc:['box','beton',1],
  roof:['gable','dach',1],roofm:['gable','welle',1],corr:['box','welle',1],wood:['box','holz',1],awn:['box','streifen',0],dark:['box','lam',0],
  metal:['box','metal',0],pole:['col','metal',0],glass:['box','glas',0],gold:['dome','gold',1],domeS:['dome','lam',1],pyr:['pyr','dach',1],disc:['col','lam',0]};
function bldGeoMat(k){const D=BKIND[k];if(!D)return null;G.bk=G.bk||{};const T=bldTex();
  const geo=G.bk['g'+D[0]]||(G.bk['g'+D[0]]=keep(D[0]==='box'?new THREE.BoxGeometry(1,1,1):D[0]==='col'?new THREE.CylinderGeometry(.5,.5,1,12):D[0]==='gable'?gableGeo():
    D[0]==='dome'?new THREE.SphereGeometry(.5,22,10,0,Math.PI*2,0,Math.PI/2):(()=>{const g=new THREE.ConeGeometry(.7071,1,4);g.rotateY(Math.PI/4);g.translate(0,.5,0);return g})()));
  const mt=G.bk['m'+D[1]]||(G.bk['m'+D[1]]=D[1]==='lam'?keep(new THREE.MeshLambertMaterial({color:0xffffff})):D[1]==='metal'?keep(new THREE.MeshStandardMaterial({color:0xffffff,metalness:.45,roughness:.4})):
    D[1]==='glas'?keep(new THREE.MeshStandardMaterial({color:0xffffff,metalness:.25,roughness:.12})):D[1]==='gold'?keep(new THREE.MeshStandardMaterial({color:0xffffff,metalness:.7,roughness:.26,emissive:0x2a1a00})):
    wtMat(T[D[1]],D[1]==='dach'?.75:D[1]==='streifen'?1.1:D[1]==='welle'?.5:.36));return [geo,mt,!!D[2]]}

/* ---------- Generator ---------- */
const ROOFC=[0xA4553F,0x8E4A3A,0x6F5B52,0x5D6670,0x9B6B4E];
const darken=(c,k)=>new THREE.Color(c).multiplyScalar(k).getHex();
const lighten=(c,k)=>new THREE.Color(c).lerp(new THREE.Color(0xffffff),k).getHex();
/* Welches Modul baut dieses Grundstück? */
function bldType(l,c){if(l.tower)return 'turm';const pl=l.place,zn=c.zone;
  const M={bank:'bank',boerse:'boerse',casino:'casino',hafen:'hafen',schule:'schule',bschule:'schule',uni:'uni',klinik:'klinik',buero:'amt',jobcenter:'amt',makler:'amt',polizei:'amt',
    mall:'mall',club:'club',netcafe:'club',fitness:'halle',tierheim:'scheune',autohaus:'showroom',reise:'laden',kiosk:'laden',jva:'jva',park:'pavillon',villa:'villa'};
  if(pl==='home')return zn==='C'?(l.h>=12?'turm':'mfh'):l.roof==='gable'?'haus':'mfh';if(pl&&M[pl])return M[pl];
  if(zn==='R')return l.roof==='gable'?'haus':'mfh';if(zn==='V')return 'villa';if(zn==='C')return l.h>=12?'turm':'amt';if(zn==='B'||zn==='W')return 'laden';
  if(zn==='I')return 'fabrik';if(zn==='H')return 'hafen';if(zn==='T')return 'bahnhof';return 'allg'}
/* buildBuilding(lot, zelle, X)  X = {put, ao, q} aus buildScene. Rückgabe: höchster Punkt (für Pins und Beschriftungen). */
function buildBuilding(l,c,X){/* Vorderseite: Einzelbauten zeigen zur Straße mit Parkplatz/Hof (+z), Reihenhäuser im Wohnviertel nach außen */
  const t=bldType(l,c),f=(!l.place&&c.zone==='R')?(Math.sign(l.z-c.cz)||1):1,{w,d,h}=l,y0=.44,det=!!X.q.det,R=rng(hsh(Math.round(l.x*13)+':'+Math.round(l.z*7)+':'+t));
  const P=(k,lx,y,lz,sx,sy,sz,col,ry,kind,mt,rx)=>X.put(k,l.x+lx,y,l.z+f*lz,sx,sy,sz,col,ry||0,kind||0,mt||0,(rx||0)*f);
  const B=(k,lx,yb,lz,bw,bh,bd,col,kind,mt,ry,rx)=>P(k,lx,yb+bh/2,lz,bw,bh,bd,col,ry,kind,mt,rx);
  const ctx={l,c,t,w,d,h,y0,det,R,P,B,X,top:y0+h};X.ao(l.x,l.z,w,d);
  let top=(BMOD[t]||BMOD.allg)(ctx);
  if(l.own){const tp=y0+h;P('pole',w/2-.3,tp+1.6,d/2-.3,.12,3.2,.12,0x444444);P('glow',w/2+.25,tp+2.8,d/2-.3,1,.6,.08,0xF0B44C)}
  return Math.max(top||0,y0+h)}
/* Bausteine */
const BB={
  sockel:(C,hh,col)=>C.B('stone',0,C.y0,0,C.w+.18,hh||.5,C.d+.18,col||0xA9A196),
  koerper:(C,col,kind,mt,o)=>{o=o||{};C.B('wall',o.x||0,C.y0+(o.y||0),o.z||0,o.w||C.w,o.h||C.h,o.d||C.d,col,kind,mt)},
  sims:(C,y,col,o)=>{o=o||{};C.B('trim',o.x||0,y-.12,o.z||0,(o.w||C.w)+.3,.24,(o.d||C.d)+.3,col||0xEDE6DA)},
  /* Flachdach: Kiesfläche plus umlaufende Attika (4 schmale Ränder statt einer vollen Platte) */
  attika:(C,col,o)=>{o=o||{};const tp=o.top||C.y0+C.h,w=(o.w||C.w)+.22,d=(o.d||C.d)+.22,x=o.x||0,z=o.z||0,cl=col||lighten(darken(C.l.col,.85),.25),t=.24;
    C.B('conc',x,tp+.12,z,w-.1,.06,d-.1,0x8E8B86);C.B('trim',x,tp,z+d/2-t/2,w,.42,t,cl);C.B('trim',x,tp,z-d/2+t/2,w,.42,t,cl);C.B('trim',x+w/2-t/2,tp,z,t,.42,d-2*t,cl);C.B('trim',x-w/2+t/2,tp,z,t,.42,d-2*t,cl);return tp+.42},
  dachProps:(C,tp,o)=>{if(!C.det)return;o=o||{};const w=(o.w||C.w),d=(o.d||C.d),R=C.R;const n=1+Math.floor(R()*3);
    for(let k=0;k<n;k++)C.B('metal',(R()-.5)*w*.6+(o.x||0),tp,(R()-.5)*d*.6+(o.z||0),.9,.55,.7,0xB9BEC4);if(R()<.45)C.B('pole',(o.x||0)+w*.3,tp,(o.z||0)-d*.3,.7,1.1,.7,0x9AA3AD);
    if(R()<.35)C.P('pole',(o.x||0)-w*.32,tp+1.2,(o.z||0)+d*.25,.06,2.4,.06,0x777777)},
  satteldach:(C,col,o)=>{o=o||{};const w=o.w||C.w,d=o.d||C.d,tp=o.top||C.y0+C.h,ry=w>d?Math.PI/2:0,rw=(w>d?d:w)+.5,rd=(w>d?w:d)+.4,rh=Math.min(w,d)*(o.steil||.48);
    C.P('roof',o.x||0,tp,o.z||0,rw,rh,rd,col,ry);
    if(C.det&&!o.ohneGaube&&Math.max(w,d)>=3.2){const n=Math.max(w,d)>=5?2:1;for(let k=0;k<n;k++){const off=n===2?(k?.22:-.22)*Math.max(w,d):0,gx=w>d?off:0,gz=w>d?0:off;
      const lz=(w>d?d:w)*.2;C.B('wall',(o.x||0)+gx,tp+rh*.12,(o.z||0)+gz+lz,.8,.75,.7,lighten(C.l.col,.2),1,0);C.P('roof',(o.x||0)+gx,tp+rh*.12+.75,(o.z||0)+gz+lz,.8+.2,.38,.9,col,0)}}
    if(!o.ohneKamin)C.B('stone',(o.x||0)+(w>d?w*.28:w*.22),tp+rh*.35,(o.z||0)-(w>d?d*.12:d*.2),.42,rh*.75+.4,.42,0x8B5A45,0,1);return tp+rh},
  tuer:(C,lx,bw,bh,col)=>{C.B('dark',lx,C.y0,C.d/2+.02,bw,bh,.08,col||0x4A3A30);C.B('trim',lx,C.y0+bh,C.d/2+.06,bw+.2,.14,.12,0xEDE6DA)},
  vordach:(C,lx,bw,dep,y,col)=>{C.B('trim',lx,y,C.d/2+dep/2,bw,.14,dep,col||0xE4DED2)},
  markise:(C,y,col)=>{const n=Math.max(1,Math.floor(C.w/2.3)),sw=C.w/n;for(let k=0;k<n;k++){const cl=Array.isArray(col)?col[k%col.length]:col;C.P('awn',-C.w/2+sw*(k+.5),y,C.d/2+.42,sw-.12,.06,.95,cl,0,0,0,.38)}},
  schild:(C,txtCol,y,bw)=>{C.B('trim',0,y,C.d/2+.08,bw||C.w*.55,.5,.12,0x2C2A33);C.P('glow',0,y+.25,C.d/2+.15,(bw||C.w*.55)*.82,.2,.04,txtCol||0xFFD27A)},
  saeulen:(C,pw,ch,lz,n,col)=>{for(let k=0;k<n;k++){const x=-pw/2+.35+k*(pw-.7)/(n-1);C.B('trim',x,C.y0+.45,lz,.62,.18,.62,col);C.P('colm',x,C.y0+.63+ch/2,lz,.42,ch,.42,col);C.B('trim',x,C.y0+.63+ch,lz,.62,.18,.62,col)}}};
BB.treppe=(C,bw,dep,n)=>{for(let i=0;i<n;i++){const dd=dep-i*dep/n;C.B('stone',0,C.y0+i*.15,C.d/2+dd/2,bw-i*.25,.15,dd,0xD8D2C4)}};
/* Portikus: Treppe, Säulen, Gebälk, Dreiecksgiebel */
function portikus(C,pw,n,col){const ch=Math.min(C.h*.72,4.4),dep=1.9;BB.treppe(C,pw+1.1,dep,3);BB.saeulen(C,pw,ch,C.d/2+1.15,n,col);
  const ey=C.y0+.81+ch;C.B('trim',0,ey,C.d/2+.85,pw+.5,.55,1.75,col);C.P('ped',0,ey+.55,C.d/2+.85,pw+.5,Math.min(1.4,pw*.2),1.75,col);return {ey,ch}}
const BMOD={
  bank:C=>{const col=lighten(C.l.col,.35);BB.sockel(C,.7,0xB0A89A);BB.koerper(C,col,1,2);BB.sims(C,C.y0+C.h*.55,0xEEE7D8);BB.sims(C,C.y0+C.h,0xEEE7D8);const tp=BB.attika(C,0xE6DECD);
    const pw=Math.min(C.w*.82,6.2),{ey}=portikus(C,pw,6,0xF2ECDF);C.P('glow',0,ey+.28,C.d/2+1.74,pw*.42,.22,.04,0xF5D27A);BB.dachProps(C,tp);return Math.max(tp,ey+1.9)},
  boerse:C=>{const t=BMOD.bank(C);return t},
  casino:C=>{const col=0x3E2350,gold=0xD4AF37;BB.sockel(C,.5,0x2C2233);BB.koerper(C,col,3,0);BB.sims(C,C.y0+C.h,gold);const tp=BB.attika(C,0x6B4A2E);
    [[.38,0xFF4FA3],[.72,0xFFD34D]].forEach(([k,cl])=>{const y=C.y0+C.h*k;C.P('glow',0,y,C.d/2+.04,C.w*.96,.16,.05,cl);C.P('glow',0,y,-C.d/2-.04,C.w*.96,.16,.05,cl);C.P('glow',C.w/2+.04,y,0,.05,.16,C.d*.96,cl);C.P('glow',-C.w/2-.04,y,0,.05,.16,C.d*.96,cl)});
    const dr=Math.min(C.w,C.d)*.58;C.P('colm',0,tp+.5,0,dr,1,dr,0x8E6A2A);C.P('gold',0,tp+1,0,dr*1.04,dr*.78,dr*1.04,gold);C.P('pole',0,tp+1+dr*.39+.5,0,.14,1,.14,gold);C.P('glow',0,tp+1+dr*.39+1.05,0,.35,.35,.35,0xFFE08A);
    C.B('trim',0,C.y0+2.1,C.d/2+1.25,C.w*.62,.2,2.5,0xE8C25A);C.P('glow',0,C.y0+2.06,C.d/2+1.25,C.w*.58,.05,2.3,0xFFE7A0);[-1,1].forEach(s=>C.B('pole',s*C.w*.29,C.y0,C.d/2+2.4,.12,2.1,.12,gold));
    C.B('dark',0,C.y0,C.d/2+1.25,1.3,.03,2.5,0xB3263A);C.B('dark',C.w/2-.45,C.y0+C.h,C.d/2-.45,.5,3.2,.5,0x231A2B);C.P('glow',C.w/2-.45,C.y0+C.h+1.6,C.d/2-.18,.32,2.8,.05,0xFF4FA3);return tp+1+dr*.39+1.3},
  hafen:C=>{const col=C.l.place?0x6F8597:[0x7C8C99,0x8E7B66,0x6E7F72][Math.floor(C.R()*3)];BB.koerper(C,col,0,3);C.B('glass',0,C.y0+C.h-.75,C.d/2+.02,C.w*.9,.45,.05,0x5C7A92);
    const tp=C.y0+C.h,ry=C.w>C.d?Math.PI/2:0;C.P('roofm',0,tp,0,(C.w>C.d?C.d:C.w)+.4,.9,(C.w>C.d?C.w:C.d)+.3,0x8C949C,ry);
    C.B('plat',0,C.y0,C.d/2+.9,C.w*.92,.6,1.8,0xA9A39A);const n=Math.max(2,Math.floor(C.w/2.6));for(let k=0;k<n;k++){const x=-C.w/2+C.w/n*(k+.5);C.B('corr',x,C.y0+.6,C.d/2+.03,1.5,2.1,.06,0x4A5563);C.B('trim',x,C.y0+2.7,C.d/2+.05,1.7,.14,.1,0xD7D2C8)}
    if(C.det)for(let k=0;k<4;k++)C.B('pole',-C.w/2+C.w*(k+.5)/4,C.y0+.6,C.d/2+1.7,.22,.35,.22,0x2B2B2B);
    if(C.l.place==='hafen'||C.R()<.5){const cx=-C.w/2+.9,cz=C.d/2+4.4;[[-.5,-.5],[.5,-.5],[-.5,.5],[.5,.5]].forEach(([a,b])=>C.B('metal',cx+a,C.y0,cz+b,.18,7.5,.18,0xE0A33A));
      C.B('metal',cx,C.y0+7.5,cz,1.3,.9,1.3,0xE0A33A);C.B('metal',cx,C.y0+8.4,cz+2.6,.5,.45,7.6,0xE0A33A);C.B('metal',cx,C.y0+8.4,cz-1.8,.6,.6,1.6,0x7A7F88);C.B('dark',cx,C.y0+5.4,cz+5.6,.07,3,.07,0x333333);return C.y0+9.2}
    return tp+.9},
  schule:C=>{const col=new THREE.Color(C.l.col).lerp(new THREE.Color(0xB5563F),.65).getHex(),br=1,cw=C.w*.46,ww=C.w*.27,wh=C.h*.78;BB.sockel(C,.45,0x9C8F80);
    BB.koerper(C,col,1,br,{w:cw});[-1,1].forEach(s=>{BB.koerper(C,col,1,br,{x:s*(cw/2+ww/2),w:ww,h:wh,d:C.d*.9});BB.sims(C,C.y0+wh,0xEDE6DA,{x:s*(cw/2+ww/2),w:ww,d:C.d*.9});BB.attika(C,0xE2DACB,{x:s*(cw/2+ww/2),w:ww,d:C.d*.9,top:C.y0+wh})});
    BB.sims(C,C.y0+C.h,0xEDE6DA,{w:cw});const tp=BB.attika(C,0xE2DACB,{w:cw});BB.tuer(C,0,1.4,1.9,0x5A4636);BB.vordach(C,0,2.6,1.3,C.y0+2.2,0xDCD5C8);
    const th=C.h+2.8;C.B('wall',0,C.y0,C.d/2-.9,1.7,th,1.7,col,0,br);C.B('trim',0,C.y0+th,C.d/2-.9,2,.2,2,0xEDE6DA);C.P('pyr',0,C.y0+th+.2,C.d/2-.9,2,1.5,2,0x6A3B30);
    C.P('disc',0,C.y0+th-.9,C.d/2-.03,1.05,.06,1.05,0xF7F4EA,0,0,0,Math.PI/2);C.B('dark',0,C.y0+th-.9,C.d/2+.02,.06,.38,.03,0x222222);C.B('dark',.12,C.y0+th-.9,C.d/2+.02,.26,.05,.03,0x222222);
    BB.dachProps(C,tp,{w:cw});return C.y0+th+1.7},
  uni:C=>{const col=lighten(C.l.col,.3),ww=C.w*.26,cw=C.w*.48;BB.sockel(C,.6,0xA9A196);
    [-1,1].forEach(s=>{BB.koerper(C,0xB7654B,1,1,{x:s*(cw/2+ww/2),w:ww,h:C.h*.8,d:C.d*.85});BB.attika(C,0xE2DACB,{x:s*(cw/2+ww/2),w:ww,d:C.d*.85,top:C.y0+C.h*.8})});
    BB.koerper(C,col,1,2,{w:cw});BB.sims(C,C.y0+C.h,0xEFE9DC,{w:cw});const tp=BB.attika(C,0xE6DECD,{w:cw});const {ey}=portikus(C,cw*.9,4,0xF1ECE2);
    const dr=Math.min(cw,C.d)*.62;C.P('colm',0,tp+.6,0,dr,1.2,dr,0xE6DECD);C.P('domeS',0,tp+1.2,0,dr*1.04,dr*.8,dr*1.04,0x6FA89A);C.P('pole',0,tp+1.2+dr*.4+.5,0,.16,1,.16,0xD4AF37);return Math.max(ey+1.5,tp+1.2+dr*.4+1)},
  haus:C=>{const mt=C.R()<.35?1:0,col=mt?darken(0xC7745A,.95+C.R()*.1):C.l.col,rc=C.l.own?0xC9A23F:ROOFC[Math.floor(C.R()*ROOFC.length)];BB.sockel(C,.42);BB.koerper(C,col,1,mt);BB.sims(C,C.y0+C.h,0xEFE8DC);
    BB.tuer(C,C.w*(C.R()<.5?-.2:.2),.9,1.75);BB.vordach(C,0,1.6,.7,C.y0+2,0xE4DED2);return BB.satteldach(C,rc)},
  villa:C=>{const col=C.l.col;BB.sockel(C,.5,0xB7AFA2);BB.koerper(C,col,1,0);BB.sims(C,C.y0+C.h,0xFFFFFF);BB.tuer(C,0,1.1,2,0x3A4A5A);
    BB.saeulen(C,2.6,2.2,C.d/2+.85,4,0xFAF7F0);C.B('trim',0,C.y0+2.83,C.d/2+.7,3.1,.22,1.6,0xFAF7F0);return BB.satteldach(C,0x4E5560,{steil:.42})},
  mfh:C=>{const mt=C.R()<.4?1:0,col=mt?0xB86E55:C.l.col;BB.sockel(C,.5);BB.koerper(C,col,1,mt);BB.sims(C,C.y0+C.h,0xEFE8DC);const tp=BB.attika(C,darken(col,.8));
    BB.tuer(C,0,1.1,1.9);BB.vordach(C,0,1.8,.8,C.y0+2.1);
    if(C.det){const n=Math.floor((C.h-1.4)/1.3);for(let k=1;k<=n;k++){const y=C.y0+k*1.3+.04;[-1,1].forEach(s=>{if(C.w<3.6&&s>0)return;C.B('conc',s*C.w*.24,y,C.d/2+.33,1.15,.12,.66,0xD8D4CC);C.B('glass',s*C.w*.24,y+.12,C.d/2+.65,1.15,.5,.03,0x9FB8C8)})}}
    if(C.det)C.B('stone',C.w*.2,tp,-C.d*.15,1.1,.9,1.1,darken(col,.85),0,0);BB.dachProps(C,tp);return tp+.9},
  turm:C=>{const pod=Math.min(4.2,C.h*.2),sb=C.h>20?C.h*.18:0,tw=C.w*.86,td=C.d*.86,col=C.l.col;BB.koerper(C,0xC9C3B6,3,2,{h:pod});BB.sims(C,C.y0+pod,0xE4DED2);
    BB.koerper(C,col,2,4,{y:pod,w:tw,d:td,h:C.h-pod-sb});let tp=C.y0+C.h-sb;C.B('trim',0,tp,0,tw+.2,.3,td+.2,darken(col,.75));
    if(sb){BB.koerper(C,col,2,4,{y:C.h-sb+.3,w:tw*.74,d:td*.74,h:sb});tp=C.y0+C.h+.3;C.B('trim',0,tp,0,tw*.74+.2,.4,td*.74+.2,darken(col,.7));tp+=.4}
    BB.dachProps(C,tp,{w:tw*.7,d:td*.7});if(C.det&&!C.l.tower){C.P('pole',0,tp+1.5,0,.12,3,.12,0xCCCCCC);C.P('glow',0,tp+3.1,0,.3,.3,.3,0xFF5A4F)}BB.vordach(C,0,C.w*.5,1.4,C.y0+2.4,0xD9D6CF);return tp+3.2},
  amt:C=>{const col=C.l.col;BB.sockel(C,.7,0xA59D90);BB.koerper(C,col,C.l.kind===1?1:2,C.l.kind===1?2:5);BB.sims(C,C.y0+C.h,0xE7E1D5);const tp=BB.attika(C);BB.tuer(C,0,1.6,2.1,0x334155);BB.vordach(C,0,3,1.5,C.y0+2.4,0xD6D2CA);
    if(C.det){C.P('pole',C.w/2-.3,C.y0+2.2,C.d/2+1.6,.08,4.4,.08,0xCCCCCC);C.B('trim',C.w/2-.05,C.y0+3.6,C.d/2+1.6,.5,.75,.03,0x2F6FD6)}BB.dachProps(C,tp);return tp},
  klinik:C=>{BB.sockel(C,.5,0xBFC5CC);BB.koerper(C,0xF2F4F6,2,0);BB.sims(C,C.y0+C.h,0xFFFFFF);const tp=BB.attika(C,0xDCE1E6);BB.vordach(C,0,C.w*.6,2.4,C.y0+2.5,0xFFFFFF);C.B('dark',0,C.y0,C.d/2+.02,2.2,2.2,.06,0x4E6A85);
    C.P('glow',0,C.y0+2.45,C.d/2+2.42,C.w*.5,.12,.05,0xE5484D);BB.dachProps(C,tp,{w:C.w*.5});return tp},
  mall:C=>{BB.sockel(C,.35);BB.koerper(C,C.l.col,3,5);BB.sims(C,C.y0+C.h,0xE9E4DA);const tp=BB.attika(C);BB.markise(C,C.y0+2.15,[0xE4572E,0x2B59C3,0x3BB273]);
    C.B('trim',0,C.y0+C.h-.9,C.d/2+.08,C.w*.7,.8,.12,0x2C2A33);C.P('glow',0,C.y0+C.h-.5,C.d/2+.16,C.w*.6,.34,.04,0x7FD6FF);BB.dachProps(C,tp);return tp},
  club:C=>{BB.koerper(C,0x2B2340,3,5);const tp=BB.attika(C,0x1C1628);C.P('glow',0,C.y0+C.h*.55,C.d/2+.05,C.w*.8,.22,.05,0xD06BFF);C.P('glow',0,C.y0+C.h*.3,C.d/2+.05,C.w*.6,.16,.05,0x4ED6FF);
    BB.vordach(C,0,C.w*.4,1.2,C.y0+2.2,0x3A3050);BB.dachProps(C,tp);return tp},
  halle:C=>{BB.sockel(C,.4);BB.koerper(C,C.l.col,2,5);const tp=C.y0+C.h,ry=C.w>C.d?Math.PI/2:0;C.P('roofm',0,tp,0,(C.w>C.d?C.d:C.w)+.3,1,(C.w>C.d?C.w:C.d)+.3,0xA7B0B8,ry);BB.schild(C,0x3BB273,C.y0+C.h-1.1);BB.vordach(C,0,2.4,1.2,C.y0+2.3);return tp+1},
  scheune:C=>{C.B('wood',0,C.y0,0,C.w,C.h,C.d,0x9A5B3C);C.B('dark',0,C.y0,C.d/2+.03,1.8,2.2,.06,0x5A3524);C.B('trim',0,C.y0+1.1,C.d/2+.07,1.9,.1,.06,0xEDE6DA);return BB.satteldach(C,0x6E3B2E,{ohneGaube:true,ohneKamin:true})},
  showroom:C=>{C.B('glass',0,C.y0,C.d/2-1.4,C.w,C.h*.8,2.8,0x6E8FA8);BB.koerper(C,0xE9EEF2,2,5,{z:-1.4,d:C.d-2.8});C.B('trim',0,C.y0+C.h*.8,C.d/2-1.4,C.w+.3,.3,3.1,0xF4F6F8);
    const tp=BB.attika(C,0xDDE2E7,{z:-1.4,d:C.d-2.8});BB.schild(C,0x7FD6FF,C.y0+C.h*.8+.55,C.w*.5);return tp},
  laden:C=>{const kl=C.l.kind===4;BB.sockel(C,.3);BB.koerper(C,C.l.col,C.l.kind,C.R()<.3?1:0);BB.sims(C,C.y0+C.h,0xEFE8DC);const tp=BB.attika(C);
    if(!kl){BB.markise(C,C.y0+2.05,[[0xE4572E,0xF4F4F4],[0x2B59C3,0xF4F4F4],[0x3BB273,0xF2C14E],[0x7768AE,0xF4F4F4]][Math.floor(C.R()*4)]);BB.schild(C,[0xFFD27A,0x7FD6FF,0xFF8FB1][Math.floor(C.R()*3)],C.y0+2.6,C.w*.5)}
    BB.dachProps(C,tp);return tp},
  fabrik:C=>{BB.koerper(C,C.l.col,0,3);const tp=C.y0+C.h;for(let k=0;k<3;k++)C.P('roofm',-C.w/3+k*C.w/3,tp,0,C.w/3,1.2,C.d,0x8C949C);
    C.B('corr',0,C.y0,C.d/2+.03,2.4,2.6,.06,0x56606E);C.B('trim',0,C.y0+2.6,C.d/2+.06,2.6,.15,.1,0xD7D2C8);C.B('glass',0,C.y0+C.h-1,C.d/2+.02,C.w*.85,.4,.04,0x6E8FA8);return tp+1.2},
  bahnhof:C=>{BB.sockel(C,.5);BB.koerper(C,C.l.col,2,2);BB.sims(C,C.y0+C.h,0xEFE9DC);const tp=BB.attika(C);C.P('disc',0,C.y0+C.h-.9,C.d/2+.05,.9,.06,.9,0xF7F4EA,0,0,0,Math.PI/2);BB.tuer(C,0,2,2.2,0x3E4C5A);return tp},
  jva:C=>{BB.koerper(C,0x9AA0A8,1,5);const tp=BB.attika(C,0x7E848D);return tp},
  pavillon:C=>{const r=Math.min(C.w,C.d)*.5;for(let k=0;k<6;k++){const a=k/6*Math.PI*2;C.P('colm',Math.cos(a)*r*.8,C.y0+1.1,Math.sin(a)*r*.8,.22,2.2,.22,0xF4F1EA)}
    C.P('domeS',0,C.y0+2.2,0,r*2.1,r*.9,r*2.1,0x6FA89A);return C.y0+2.2+r*.9},
  allg:C=>{BB.sockel(C,.45);BB.koerper(C,C.l.col,C.l.kind,0);BB.sims(C,C.y0+C.h,0xEFE8DC);BB.tuer(C,0,1.1,1.9);BB.vordach(C,0,1.8,.9,C.y0+2.1);
    if(C.l.roof==='gable')return BB.satteldach(C,ROOFC[Math.floor(C.R()*ROOFC.length)]);const tp=BB.attika(C);BB.dachProps(C,tp);return tp}};
