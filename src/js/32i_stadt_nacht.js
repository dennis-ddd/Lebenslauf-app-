/* ================= Stadt bei Nacht: Licht nach Spieluhr, Karten-Pins mit Namen und Personen ================= */
const NIGHTC=new (typeof THREE!=='undefined'?THREE.Color:function(){})(0x6E63C9);
function cityHour(){if(p&&clockOn())return ((p.clock==null?DAYSTART:p.clock)/60)%24;return null}
function nightK(t){const h=cityHour();if(h==null)return (Math.cos((t||0)/1000/180*2*Math.PI)+1)/2;
  if(h>=7&&h<17)return 0;if(h>=17&&h<20.5)return (h-17)/3.5;if(h>=5&&h<7)return 1-(h-5)/2;return 1}
const phaseOf=h=>h==null?null:h<5?'Nacht':h<10?'Morgen':h<12?'Vormittag':h<14?'Mittag':h<18?'Nachmittag':h<21?'Abend':'Nacht';
const hsh=s=>{let h=7;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h};
function npcAv(n,g,age,size){const h=hsh(n);return avatarSvg(Math.max(1,age|0),size,{g:g||(FN.includes(String(n).split(' ')[0])?'w':'m'),skin:h%5,hair:(h>>>3)%6,st:{gl:70}})}
function peopleAt(){const P={},h=cityHour(),H=h==null?15:h,add=(pl,n,g,a)=>{(P[pl]=P[pl]||[]).length<3&&P[pl].push({n,g,a})};if(!p||p.prison)return P;
  const evening=H>=18||H<7;
  if(p.age<18&&!p.parentsGone&&(evening||p.age<6)){add('home','Mama','w',p.age+30);add('home','Papa','m',p.age+32)}
  if(p.partner&&(evening||h==null))add('home',p.partner.name,null,p.age);
  (p.kids||[]).forEach(k=>{if(evening||h==null)add('home',k.n,k.g,p.age-k.b)});
  if(p.age>=6&&p.age<19&&H<15){add('schule',p.friend,null,p.age);if(p.rival&&O.rival)add('schule',p.rival.n,null,p.age)}
  if(p.job&&H>=8&&H<18)add(p.job.id==='waerter'?'jva':'buero','Chef/in',null,48);
  if(p.age>=6&&p.friend&&H>=15&&H<20)add('park',p.friend,null,p.age);
  if(p.age>=16&&p.friend&&(H>=21||H<4))add('club',p.friend,null,p.age);
  return P}
const PINSVG='<svg class="pinsv" viewBox="0 0 24 32" aria-hidden="true"><path d="M12 31s10-11.2 10-19A10 10 0 0 0 2 12c0 7.8 10 19 10 19z"/><circle cx="12" cy="12" r="4.2"/></svg>';
function pinsBuild(){const el=document.getElementById('pins');if(!el||!G||!G.L)return;const ppl=peopleAt();
  const h=G.L.cells.map((c,i)=>{if(!c.place)return '';const P=PL[c.place],pp=ppl[c.place]||[],home=c.place==='home';
    return '<button class="pinm'+(home?' home':'')+(sel===c.place?' on':'')+'" data-a="sel" data-g="'+c.place+'" data-ci="'+i+'" aria-label="'+esc(P.n)+'">'+
      (pp.length?'<span class="ppl">'+pp.map(x=>'<i title="'+esc(x.n)+'">'+npcAv(x.n,x.g,x.a,26)+'</i>').join('')+'</span>':'')+
      '<span class="plb">'+(home?'Zuhause':esc(P.n))+'</span>'+PINSVG+'</button>'}).join('');
  if(el.dataset.h!==h){el.innerHTML=h;el.dataset.h=h;el._w=null}}
const _pv={};
function pinsProject(){const el=document.getElementById('pins');if(!el||!G||!G.L||!el.children.length)return;const w=el.clientWidth,hh=el.clientHeight;
  const v=(_pv.v=_pv.v||new THREE.Vector3()),L=[];
  for(const b of el.children){const c=G.L.cells[+b.dataset.ci];if(!c)continue;const top=c.top||Math.max(2,...c.lots.map(l=>l.h));v.set(c.x,top+.6,c.z).project(G.cam);
    const x=(v.x+1)/2*w,y=(1-v.y)/2*hh,vis=v.z<1&&x>-40&&x<w+40&&y>-10&&y<hh+60;b.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';b.style.display=vis?'':'none';
    if(vis)L.push({b,x,y,pr:(b.classList.contains('on')?3:0)+(b.classList.contains('home')?2:0)+(b.querySelector('.ppl')?1:0)})}
  // Namensschilder dürfen sich nicht überdecken
  L.sort((a,b)=>b.pr-a.pr||a.y-b.y);const R=[];
  const far=G.dist>95;L.forEach(o=>{const lb=o.b.querySelector('.plb');if(far&&o.pr<1){o.b.classList.add('nolbl');return}const lw=(lb._w=lb._w||lb.offsetWidth||80),r=[o.x-lw/2,o.y-58,o.x+lw/2,o.y-38];
    const hit=R.some(q=>r[0]<q[2]+4&&r[2]>q[0]-4&&r[1]<q[3]+2&&r[3]>q[1]-2);o.b.classList.toggle('nolbl',hit);if(!hit)R.push(r)});
  const ct=document.getElementById('ctime');if(ct){const h=cityHour(),n=G.nk>.5;const s=(n?'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>':'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5"/></svg>')+
    '<span>'+(h==null?(n?'Nacht':'Tag'):phaseOf(h)+' · <b>'+clockTxt()+'</b>')+'</span>';if(ct._s!==s){ct.innerHTML=s;ct._s=s}}}
