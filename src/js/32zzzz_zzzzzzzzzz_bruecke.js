/* ================= Brücke zwischen den alten Hüllen und HOOK =================
   Dieses Modul ist die äußerste Hülle (Dateiname sortiert als letztes vor 33).
   Es läuft also zuerst bzw. zuletzt und verteilt an HOOK:
   act      -> HOOK.claim('act') vor allen alten Hüllen, danach HOOK.emit('acted')
   perkYear -> nach allen alten Hüllen HOOK.emit('yearR0', R0) (Einnahmen/Ausgaben-Liste der Bilanz)
   ageUp    -> nach dem ganzen Jahreswechsel HOOK.emit('year', {from,to})
   newLife / continueAs -> HOOK.emit('life', p)
   render   -> HOOK.emit('render')
   Migrationsplan (pro Modul, jeweils mit Test):
   1. Neue Funktionen nur noch über HOOK.on.
   2. Alte Hülle {const f=act;act=function(id,arg){if(id==='x'){…;return 1}return f(id,arg)}}
      wird zu HOOK.on('act',(id,arg)=>{if(id!=='x')return;…;return 1},50,'modulname').
   3. Sind alle Hüllen umgezogen, schrumpft die Brücke auf: act=function(id,arg){const r=HOOK.claim('act',id,arg);…}. */
{const _act=act;act=function(id,arg){try{ST.dirty=true}catch(e){}let r=HOOK.claim('act',id,arg);if(r===undefined)r=_act.apply(this,arguments);HOOK.emit('acted',id,arg,r);return r}}
{const _py=perkYear;perkYear=function(R0){const r=_py.apply(this,arguments);HOOK.emit('yearR0',R0);return r}}
{const _au=ageUp;ageUp=function(){const a0=p&&p.age,q=p;const r=_au.apply(this,arguments);if(p&&p===q&&p.alive&&p.age>a0)HOOK.emit('year',{from:a0,to:p.age});return r}}
{const _nl=newLife;newLife=function(){const r=_nl.apply(this,arguments);HOOK.emit('life',p);return r}}
{const _ca=continueAs;continueAs=function(){const q=p,r=_ca.apply(this,arguments);if(p&&p!==q)HOOK.emit('life',p);return r}}
{const _r=render;render=function(){HOOK.emit('prerender');const r=_r.apply(this,arguments);HOOK.emit('render');return r}}
/* Zustand normalisieren: nur wenn sich etwas geändert haben kann (neues Leben, Aktion, Jahr, neues Klick-Konto),
   nicht bei jedem Zeichnen. Früher steckte das direkt in render(). */
const ST={p:null,dirty:true,sm:new WeakSet()};
function stateEnsure(){if(!p||!p.alive)return;
  /* Reparatur für Stände, die der alte BAföG-Fehler (Rate 0/0) beschädigt hat */
  if(!(typeof p.money==='number'&&isFinite(p.money))||p.moneyFix){p.money=isFinite(p.money)?p.money:0;delete p.moneyFix;log('Dein Kontostand war durch einen Fehler beim BAföG kaputt und wurde auf 0 € gesetzt.')}
  (p.loans||[]).forEach(l=>{if(!isFinite(l.pay)||l.pay<=0)l.pay=Math.round(isFinite(l.amt)?l.amt/Math.max(1,l.left||1):0)});if(p!==ST.p||ST.dirty){try{ensureStocks();ensureNew()}catch(e){errLog(e,'ensure')}ST.p=p;ST.dirty=false}
  if(p.sm&&!ST.sm.has(p.sm)){try{ensureSm()}catch(e){errLog(e,'ensureSm')}ST.sm.add(p.sm)}}
HOOK.on('prerender',stateEnsure,0,'zustand');['acted','year','life'].forEach(n=>HOOK.on(n,()=>{ST.dirty=true},0,'zustand'));
/* Ansichten: ein einziger Erweiterungspunkt statt vieler viewApp-Hüllen */
{const _va=viewApp;viewApp=function(id){return HOOK.pipe('view:app',_va.apply(this,arguments),id)}}
{const _vh=viewHome;viewHome=function(){return HOOK.pipe('view:home',_vh.apply(this,arguments))}}
{const _vd=viewDeath;viewDeath=function(){return HOOK.pipe('view:death',_vd.apply(this,arguments))}}
/* Stadt-Stecknadeln */
{const _pb=pinsBuild;pinsBuild=function(){HOOK.emit('pins:before');const r=_pb.apply(this,arguments);HOOK.emit('pins');return r}}

/* Umgezogen auf HOOK: Speichern, Feedback, Besitz, Bewährungsprobe, Denkmal-Pins (32zzzz_zzzzstadt),
   Viertel-Beschriftung und Filter der Pins (32zz_oberflaeche2). */
/* Beziehungswerte bleiben zwischen 0 und 100. Viele ältere Stellen ziehen ohne Grenze ab (z. B. vergessene Termine). */
function relClamp(){if(!p)return;const c=v=>isFinite(v)?clamp(Math.round(v),0,100):50;(p.kids||[]).forEach(k=>{k.rel=c(k.rel);if(!TAL[k.tal])k.tal='kopf';if(!k.fd)k.fd={};if(k.ts==null)k.ts=0});if(p.partner&&p.partner.rel!=null)p.partner.rel=c(p.partner.rel);(p.fk||[]).forEach(f=>{if(f.cl!=null)f.cl=c(f.cl)});
  if(p.rel&&typeof p.rel==='object')Object.keys(p.rel).forEach(k=>{if(typeof p.rel[k]==='number')p.rel[k]=c(p.rel[k])})}
HOOK.on('year',relClamp,5,'beziehung-grenzen');HOOK.on('acted',relClamp,5,'beziehung-grenzen');
