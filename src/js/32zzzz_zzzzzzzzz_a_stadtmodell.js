/* ================= Stadtmodell: die 3D-Stadt liest nur noch ein abgeleitetes Modell =================
   cityModel() liefert ein flaches Objekt mit allem, was die Szene zeichnen muss. Es wird neu berechnet,
   wenn ein neues Jahr beginnt, ein anderes Leben geladen wird oder sich der Besitz ändert
   (Wohnung, Autos, Upgrades, Firma, Handy, eigene Läden). Sonst wird das gespeicherte Modell geliefert.
   Die Szene baut sich nur neu, wenn sich model.key ändert.

   Felder: alles aus den bisherigen Stadtoptionen (hz, own, dw, closed, tram, tower, bau, fest, key)
           home  {type, owned, up:{anbau,pool,solar}}
           car   'sport' | 'kombi' | 'gebraucht' | null
           firm  {name, sign}
           phone 0–3
           age   Alter bei der Berechnung
   Migration: 16_stadt_3d liest schon nur cityOpts(); das zeigt jetzt auf cityModel().
   Als Nächstes ziehen pinsBuild (32i) und die Stadtleben-Ansichten (32x) auf cityModel() um. */
const CM={m:null,p:null,age:null,sig:null,n:0};
const _cityLive=cityOpts;
const houseOwned=()=>!!(p&&(p.home==='eigen'||(p.owned||[]).includes(p.home)));
const firmName=()=>(p&&p.biz&&((p.biz.firm&&p.biz.firm.name)||(p.biz.co&&p.biz.co.name)))||null;
function cmSig(){let own=0;try{own=typeof ownList==='function'?ownList().length:0}catch(e){errLog(e,'cmSig')}
  return [p.home,(p.owned||[]).join(','),(p.cars||[]).join(','),Object.keys(p.upg||{}).sort().join(','),firmName()||'',phoneTier(),own].join('|')}
function cmBuild(){const o=Object.assign({},_cityLive()),cars=p.cars||[],car=['sport','kombi','gebraucht'].find(k=>cars.includes(k))||null,own=houseOwned();
  const up={};if(own&&p.upg)['anbau','pool','solar'].forEach(k=>{if(p.upg[k])up[k]=1});
  const fn=firmName(),m=Object.assign(o,{home:{type:p.home,owned:own,up},car,firm:{name:fn,sign:!!(fn&&p.upg&&p.upg.schild)},phone:phoneTier(),age:p.age});
  m.key=(o.key||'')+'|h:'+Object.keys(up).sort().join(',')+'|c:'+(car||'')+'|f:'+(m.firm.sign?fn:'');return m}
function cityModel(){if(!p)return null;let s='';try{s=cmSig()}catch(e){errLog(e,'cm')}
  if(!CM.m||CM.p!==p||CM.age!==p.age||CM.sig!==s){CM.m=cmBuild();CM.p=p;CM.age=p.age;CM.sig=s;CM.n++}return CM.m}
const cityModelDirty=()=>{CM.m=null};
cityOpts=function(){return cityModel()||{key:''}};
HOOK.on('year',cityModelDirty,10,'stadtmodell');HOOK.on('life',cityModelDirty,10,'stadtmodell');

/* ---------- 3D: Besitz sichtbar machen (liest nur das Modell) ---------- */
const CARCOL={sport:0xD64545,kombi:0x2F6FD6,gebraucht:0x9AA3AD};
function cmDraw(){if(!G||!G.root||!G.L||typeof THREE==='undefined')return;const m=cityModel();if(!m)return;
  const g=new THREE.Group();g.name='besitz';const B=keep(new THREE.BoxGeometry(1,1,1));
  const mesh=(col,x,y,z,sx,sy,sz,rx,ry)=>{const o=new THREE.Mesh(B,mat(col));o.position.set(x,y,z);o.scale.set(sx,sy,sz);if(rx)o.rotation.x=rx;if(ry)o.rotation.y=ry;g.add(o);return o};
  const c=G.L.cells.find(x=>x.place==='home'),l=c&&c.lots&&c.lots[0];
  if(c&&l){const top=.44+l.h,half=BS/2-.3,sx=Math.sign(l.x-c.cx)||1,sz=Math.sign(l.z-c.cz)||1;
    /* freie Seite des Grundstücks: gegenüber der Hauslage innerhalb der Zelle */
    const fx=c.cx-sx*Math.min(half-1.6,Math.max(1.8,half-(l.w/2))),fz=c.cz-sz*Math.min(half-1.4,Math.max(1.6,half-(l.d/2)));
    if(m.home.up.anbau){const w=Math.max(2.2,l.w*.5),h=Math.max(2,l.h*.6);mesh(0xF0CC87,fx,.44+h/2,l.z,w,h,Math.max(2,l.d*.7));mesh(0xC9A23F,fx,.44+h+.12,l.z,w+.2,.24,Math.max(2,l.d*.7)+.2)}
    if(m.home.up.pool){const px=m.home.up.anbau?l.x:fx,pz=m.home.up.anbau?fz:fz;mesh(0xFFFFFF,px,.5,pz,3.6,.14,2.4);mesh(0x3FB7E8,px,.56,pz,3.1,.1,1.9)}
    if(m.home.up.solar){for(let k=-1;k<=1;k++)mesh(0x1F2D55,l.x+k*Math.min(1.2,l.w/4),top+Math.min(l.w,l.d)*.22+.25,l.z,Math.min(1.05,l.w/4.2),.08,Math.min(1.4,l.d*.35),-.35)}
    if(m.car){const cx=l.x+sx*Math.min(1.4,l.w/3),cz=c.cz+sz*(half-.6);mesh(CARCOL[m.car],cx,.82,cz,2.3,.6,1.1);mesh(0x22303F,cx-.15,1.32,cz,1.2,.46,1);mesh(0x111111,cx-.75,.6,cz,.5,.5,1.16);mesh(0x111111,cx+.75,.6,cz,.5,.5,1.16)}}
  if(m.firm.sign){/* am eigenen Firmengebäude, sonst über dem Büropark */
    const fc=G.L.cells.find(x=>(x.own||[]).some(o=>o.id==='firm')),fl=fc&&fc.lots.find(l=>l.own),b=fc||G.L.cells.find(x=>x.place==='buero');
    if(b){const X=fl?fl.x:b.cx,Z=fl?fl.z:b.cz,Y=fl?.44+fl.h:(b.top||10);const s=label(m.firm.name,0xF2B33D);s.position.set(X,Y+3.4,Z);g.add(s);mesh(0xF2B33D,X,Y+.9,Z,Math.min(4,(fl?fl.w:4)*.8),1.1,.3);mesh(0x333333,X,Y+.2,Z,.2,.5,.2)}}
  G.root.add(g);G.besitz=g}
{const _bs=buildScene;buildScene=function(){const r=_bs.apply(this,arguments);try{cmDraw()}catch(e){errLog(e,'cmDraw')}return r}}
