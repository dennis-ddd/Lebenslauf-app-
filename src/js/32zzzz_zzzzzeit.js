/* ================= Handy-Zeitalter: Die App altert mit, vom Tastenhandy bis zur Glas-Oberfläche ================= */
/* Kalender: Die erste Generation kommt um 1990 zur Welt, jede weitere so viel später, wie die Eltern alt waren */
function calEns(){if(!p)return;if(p.cy0==null)p.cy0=1990+Math.max(0,(p.gen||1)-1)*30}
const yearNow=()=>{calEns();return p.cy0+p.age};
const ERAS={retro:['Tastenhandy','bis 2008'],smart:['Smartphone','2009 bis 2047'],glass:['Zukunft','ab 2048']};
function eraOf(){if(!p)return 'smart';if(O.era&&ERAS[O.era])return O.era;const y=yearNow();return y<2009?'retro':y>=2048?'glass':'smart'}
{const _nl=newLife;newLife=function(){const r=_nl.apply(this,arguments);try{if(p){p.cy0=1990+R(0,3);p.eraSeen=eraOf()}}catch(e){errLog(e,'cal')}return r}}
{const _ca=continueAs;continueAs=function(i){const prev=p,k=prev&&prev.kids&&prev.kids[i];let y0=null;try{if(prev){const c0=prev.cy0!=null?prev.cy0:1990+Math.max(0,(prev.gen||1)-1)*30;y0=c0+(k?k.b:30)}}catch(e){errLog(e,'cal')}
  const r=_ca.apply(this,arguments);try{if(p!==prev&&y0!=null){p.cy0=y0;p.eraSeen=eraOf()}}catch(e){errLog(e,'cal')}return r}}
/* Übergänge als Ereignis */
QEV.era_smart=()=>EC('Stadt','Dein erstes Smartphone','Es ist '+yearNow()+'. Alle reden nur noch vom Touchscreen. Heute hältst du dein erstes Smartphone in der Hand: Apps, Farben, Wischen statt Tippen.',[['Ausprobieren',()=>{add('gl',3);return 'Du wischst stundenlang durch die neuen Apps. Die Tasten vermisst du keine Sekunde. Fast.'}]]);
QEV.era_glass=()=>EC('Stadt','Die Zukunft ist da','Es ist '+yearNow()+'. Dein neues Handy ist eine hauchdünne Glasscheibe. Die Bilder schweben, die Apps leuchten wie Licht.',[['Staunen',()=>{add('gl',3);return 'Du zeigst es '+(p.kids&&p.kids.length?'deinen Kindern':'allen')+'. Sie finden es völlig normal.'}]]);
{const _py=perkYear;perkYear=function(R0){_py(R0);try{if(!p||O.era)return;const e=eraOf();if(p.eraSeen&&e!==p.eraSeen){p.q.push({id:e==='glass'?'era_glass':'era_smart'});mile(e==='glass'?'Die Glas-Handys kommen':'Das erste Smartphone','star')}p.eraSeen=e}catch(x){errLog(x,'era')}}}
/* Design und Jahreszahl anwenden */
function eraApply(){if(noDom())return;const r=document.documentElement;const e=p&&p.alive?eraOf():(O.era||'smart');if(r.dataset.era!==e)r.dataset.era=e;
  if(!p||!p.alive)return;const y=yearNow();document.querySelectorAll('.pstat').forEach(s=>{let x=s.querySelector('.pyear');if(!x){x=document.createElement('span');x.className='pyear';s.insertBefore(x,s.children[1]||null)}x.textContent=y})}
{const _rn=render;render=function(){const r=_rn.apply(this,arguments);try{eraApply()}catch(e){errLog(e,'era')}return r}}
/* Einstellung unter Aussehen */
{const f=act;act=function(id,arg){if(id==='era'){O.era=arg||null;saveO();render();return}return f(id,arg)}}
{const _ve=viewEinst;viewEinst=function(){const h=_ve();if(typeof einTab==='undefined'||einTab!=='look')return h;const cur=O.era||'';
  return h+'<section class="card"><h2 class="h">Handy-Zeitalter</h2><p class="note">Automatisch altert das Handy mit der Zeit: Tastenhandy bis 2008, dann Smartphone, ab 2048 die Glas-Oberfläche'+(p&&p.alive?'. Bei dir ist gerade '+yearNow()+'.':'.')+'</p><div class="seg full">'+[['','Automatisch'],['retro','Tasten'],['smart','Smartphone'],['glass','Zukunft']].map(([k,l])=>'<button data-a="era" data-g="'+k+'" aria-pressed="'+(cur===k)+'">'+l+'</button>').join('')+'</div></section>'}}
