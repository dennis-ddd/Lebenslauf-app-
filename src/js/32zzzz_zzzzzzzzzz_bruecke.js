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
{const _act=act;act=function(id,arg){let r=HOOK.claim('act',id,arg);if(r===undefined)r=_act.apply(this,arguments);HOOK.emit('acted',id,arg,r);return r}}
{const _py=perkYear;perkYear=function(R0){const r=_py.apply(this,arguments);HOOK.emit('yearR0',R0);return r}}
{const _au=ageUp;ageUp=function(){const a0=p&&p.age,q=p;const r=_au.apply(this,arguments);if(p&&p===q&&p.alive&&p.age>a0)HOOK.emit('year',{from:a0,to:p.age});return r}}
{const _nl=newLife;newLife=function(){const r=_nl.apply(this,arguments);HOOK.emit('life',p);return r}}
{const _ca=continueAs;continueAs=function(){const q=p,r=_ca.apply(this,arguments);if(p&&p!==q)HOOK.emit('life',p);return r}}
{const _r=render;render=function(){const r=_r.apply(this,arguments);HOOK.emit('render');return r}}

/* Erste umgezogene Module: Speichern (Export/Import/Sicherung) und Feedback-Einstellungen
   laufen jetzt über HOOK statt über eigene act-Hüllen (siehe dort). */
