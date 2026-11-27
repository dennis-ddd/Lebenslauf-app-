/* ================= Spielgefühl: sofortiges Feedback auf jede Änderung =================
   Nach jedem render() wird der Zustand mit dem vorherigen verglichen. Jede Änderung erscheint als
   schwebende Zahl an der passenden Stelle, die Anzeige pulsiert, große Kontobewegungen kommen als
   Push-Nachricht, und beim Überschreiten kritischer Schwellen erklärt ein Hinweis die Folge. */
const FXL={money:'',gl:'Glück',ge:'Gesundheit',in:'Intelligenz',au:'Aussehen',act:'Aktion',fol:'Follower',ruf:'Ruf'};
const FXRING={gl:0,ge:1,in:2,au:3};
const FXS={snap:null,p:null};
const fxOn=()=>O.fx!==false;
function fxRead(){if(!p||!p.st)return null;return {money:Math.round(p.money||0),gl:p.st.gl,ge:p.st.ge,in:p.st.in,au:p.st.au,act:isFinite(p.act)?p.act:null,fol:p.sm?Math.round(p.sm.fol||0):null,ruf:p.ruf!=null?Math.round(p.ruf):null,age:p.age,alive:p.alive}}
function fxLayer(){let L=document.getElementById('fxl');if(!L){L=document.createElement('div');L.id='fxl';L.setAttribute('aria-hidden','true');document.body.appendChild(L)}return L}
function fxAnchor(k){const q=s=>{try{return document.querySelector(s)}catch(e){return null}};
  if(k==='money')return q('#hd .m b')||q('#hd .m');
  if(k in FXRING){const r=document.querySelectorAll('.rings .rw');if(r&&r[FXRING[k]])return r[FXRING[k]]}
  if(k==='act')return q('.pstat span:last-child')||q('#up');
  return q('#hd .ava')||q('#hd')}
function fxFloat(k,d,i){const a=fxAnchor(k);if(!a||!a.getBoundingClientRect)return;const r=a.getBoundingClientRect();if(!r.width&&!r.height)return;
  const el=document.createElement('div'),up=d>0,good=k==='act'?up:up;el.className='fxn '+(good?'pos':'neg')+(k==='money'?' big':'');
  el.textContent=k==='money'?(up?'+':'−')+eur(Math.abs(d)):(k==='fol'?(up?'+':'−')+kfmt(Math.abs(d))+' Follower':FXL[k]+' '+(up?'+':'−')+Math.abs(d));
  const top=k in FXRING?r.top-4-i*26:k==='act'?r.bottom+14+i*26:r.top+r.height/2+i*26;el.style.left=Math.round(r.left+r.width/2)+'px';el.style.top=Math.round(Math.max(16,top))+'px';fxLayer().appendChild(el);setTimeout(()=>el.remove(),1500);
  try{a.classList.remove('fxpu','fxpd');void a.offsetWidth;a.classList.add(up?'fxpu':'fxpd');setTimeout(()=>a.classList.remove('fxpu','fxpd'),900)}catch(e){errLog(e)}}
function fxPush(title,txt,kind,html){const L=fxLayer();let st=L.querySelector('.fxstack');if(!st){st=document.createElement('div');st.className='fxstack';L.appendChild(st)}if(!st||!st.children||!st.appendChild)return;
  if(kind!=='warn'){const old=st.querySelector('.fxpush.pos,.fxpush.neg');if(old)old.remove()}while(st.children.length>=2)st.firstChild.remove();
  const el=document.createElement('div');el.className='fxpush '+(kind||'');el.innerHTML='<b>'+esc(title)+'</b><span>'+(html||esc(txt))+'</span>';st.appendChild(el);setTimeout(()=>el.classList.add('out'),kind==='warn'?3600:2200);setTimeout(()=>el.remove(),kind==='warn'?4100:2700)}
/* Schwellen, deren Folgen im Spiel wirklich eintreten (siehe Jahreswechsel und Schicksal-Ereignisse). */
const FXWARN=[
 ['money',v=>v<0,'Konto im Minus','Zum Jahresende kostet das Glück, und Kreditraten können platzen.'],
 ['gl',v=>v<35,'Glück niedrig','Krisen wie „Nichts geht mehr“ werden wahrscheinlicher.'],
 ['ge',v=>v<25,'Gesundheit kritisch','Das Sterberisiko steigt deutlich. Arzt, Sport oder Ruhe helfen.'],
 ['act',v=>v===0,'Keine Aktionen mehr','Mit „+1 Jahr“ geht es weiter.']];
function fxCheck(a,b){const W=FXWARN.filter(([k,bad])=>{const was=a[k]!=null&&bad(a[k]),is=b[k]!=null&&bad(b[k]);return is&&!was&&!(k==='act'&&unl())});if(!W.length)return;
  if(W.length===1)fxPush(W[0][2],W[0][3],'warn');else fxPush('Achtung','',  'warn',W.map(w=>'<i>'+esc(w[2])+'</i> '+esc(w[3])).join('<br>'))}
{const _r=render;render=function(){const r=_r.apply(this,arguments);try{const s=fxRead();
  if(!s||p!==FXS.p||!FXS.snap||s.age!==FXS.snap.age||!s.alive||!fxOn()){FXS.p=p;FXS.snap=s;return r}
  const a=FXS.snap;FXS.snap=s;let n=0;const used={};
  Object.keys(FXL).forEach(k=>{if(a[k]==null||s[k]==null)return;const d=s[k]-a[k];if(!d||(k==='act'&&unl()))return;const g=k in FXRING?'st':k;fxFloat(k,d,(used[g]=(used[g]||0)+1)-1);n++});
  const dm=s.money-a.money;if(Math.abs(dm)>=px$(500))fxPush('Konto',(dm>0?'+':'−')+eur(Math.abs(dm))+' · neuer Stand '+eur(s.money),dm>0?'pos':'neg');
  fxCheck(a,s)}catch(e){errLog(e,'fx')}return r}}
/* ---------- Kurze Texte: Ereignisse zeigen 1–2 Sätze, der Rest auf Wunsch ---------- */
function fxShort(t){if(O.kurz===false||typeof t!=='string'||t.length<110||t.includes('<'))return t;const S=[];t.split(/(?<=[.!?…][“"«»]?)\s+(?=[A-ZÄÖÜ„"«])/).forEach(x=>{const l=S[S.length-1];if(l&&(l.length<8||/\b(?:z|d|u|bzw|ca|Dr|Nr|St|vgl|usw|etc)\.$/.test(l)))S[S.length-1]=l+' '+x;else S.push(x)});if(!S||S.length<=2)return t;const k=S.slice(0,2).join(' ').trim();return k.length<t.length-20?k:t}
function fxMore(full,short){if(full===short)return;try{const d=document.getElementById('dlg'),pe=d&&(d.querySelector('.sbody > p')||d.querySelector('p'));if(!pe)return;
  const b=document.createElement('button');b.type='button';b.className='more';b.textContent='mehr';b.onclick=ev=>{ev.stopPropagation();pe.textContent=full};pe.appendChild(document.createTextNode(' '));pe.appendChild(b)}catch(e){errLog(e,'more')}}
{const _sd=stageDialog;stageDialog=function(sc,h,t){const s=fxShort(t),A=[...arguments];A[2]=s;const r=_sd.apply(this,A);fxMore(t,s);return r}}
{const _dl=dialog;dialog=function(h,t){const s=fxShort(t),A=[...arguments];A[1]=s;const r=_dl.apply(this,A);fxMore(t,s);return r}}
/* ---------- Einstellungen ---------- */
{const _ve=viewEinst;viewEinst=function(){const h=_ve();try{if(typeof einTab==='undefined'||einTab!=='bed')return h;
  const tg=(k,l,s)=>'<button class="tg" data-a="fxopt" data-g="'+k+'" aria-pressed="'+(O[k]!==false)+'"><span><b>'+l+'</b><small>'+s+'</small></span><i></i></button>';
  return h+'<section class="card tgs"><h2 class="h">Rückmeldung</h2>'+tg('fx','Schwebende Zahlen','+250 € oder Glück −3 direkt an der Anzeige')+tg('kurz','Kurze Texte','Ereignisse zeigen 2 Sätze, der Rest per „mehr“')+'</section>'}catch(e){errLog(e,'fxcard')}return h}}
{const f=act;act=function(id,arg){if(id==='fxopt'&&(arg==='fx'||arg==='kurz')){O[arg]=O[arg]===false;saveO();render();return 1}return f(id,arg)}}
