/* ================= Ruhiger und klarer: lange Seiten einklappbar, Kategorie für jedes Ereignis ================= */
/* Abschnitte, die selten gebraucht werden, starten eingeklappt; der Zustand wird gemerkt */
const FOLDT={'Fähigkeiten':1,'Kampf und Schutz':1,'Bekanntheit':0,'Kurse':1,'In Erinnerung':1,'Deine Entscheidungen':1,'Rückhalt':0,'Deine Gebäude':0,'Stadtleben':0,'Viertel':1,'Wohnen im Alter':0,'Ruhestand und Alltag':0,'Sammlung':0,'Wirtschaft':0};
function foldEnhance(){if(noDom())return;const v=document.getElementById('app');if(!v)return;O.fold=O.fold||{};
  v.querySelectorAll('section.card > h2.h:first-child').forEach(h=>{const t=h.textContent.trim(),sec=h.parentElement;if(!(t in FOLDT)||sec.classList.contains('cfold'))return;
    sec.classList.add('cfold');const shut=O.fold[t]!=null?O.fold[t]:FOLDT[t];if(shut)sec.classList.add('shut');h.setAttribute('role','button');h.setAttribute('tabindex','0');h.setAttribute('aria-expanded',String(!shut));
    const tg=()=>{const s=sec.classList.toggle('shut');h.setAttribute('aria-expanded',String(!s));O.fold[t]=s?1:0;try{localStorage.setItem(OKEY,JSON.stringify(O))}catch(e){errLog(e)}};
    h.addEventListener('click',tg);h.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tg()}})})}
{const _rn=render;render=function(){const r=_rn.apply(this,arguments);try{foldEnhance()}catch(e){errLog(e,'fold')}return r}}
/* Ältere Ereignisse bekommen eine Kategorie nach Lebensphase, damit alle Ereigniskarten gleich aussehen */
const phaseCat=a=>a<6?'Babyzeit':a<13?'Kindheit':a<18?'Jugend':a<30?'Junge Jahre':a<60?'Lebensmitte':'Späte Jahre';
{const _se=showEvent0;showEvent0=function(e){if(e&&e.o&&!e.cat&&p)e=Object.assign({},e,{cat:phaseCat(p.age)});return _se(e)}}
