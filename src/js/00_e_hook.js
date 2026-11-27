/* ================= HOOK: zentraler Verteiler =================
   Ersetzt nach und nach die Hüllen der Form {const f=act;act=function(id,arg){…return f(id,arg)}}.
   Deren Reihenfolge hängt vom Dateinamen ab. Bei HOOK entscheidet allein prio (kleiner = früher),
   bei Gleichstand die Reihenfolge der Anmeldung.

   HOOK.on(name, fn, prio=50, id)   anmelden; gibt eine Abmeldefunktion zurück
   HOOK.claim(name, …args)          der erste Handler, der etwas anderes als undefined liefert, gewinnt
                                    (für 'act': „diese Aktion gehört mir“)
   HOOK.emit(name, …args)           alle Handler laufen nacheinander (für 'year', 'life', 'acted', 'render')
   HOOK.pipe(name, wert, …args)     Wert läuft durch alle Handler; wer etwas zurückgibt, ersetzt ihn
                                    (für Ansichten: 'view:app', 'view:home', 'view:death')
   HOOK.list(name)                  Reihenfolge ansehen, z. B. in der Konsole: __hook.list('act')

   Ein Fehler in einem Handler wird protokolliert und stoppt die anderen nicht.

   Bekannte Namen:
   act(id,arg)        Aktion übernehmen (claim)
   acted(id,arg)      nach jeder Aktion (emit)
   year(R0)           nach dem Jahreswechsel, nach allen alten perkYear-Hüllen (emit)
   life(p)            neues Leben oder Generationswechsel (emit)
   prerender()        vor dem Neuzeichnen: Zustand nach Änderungen normalisieren (emit)
   render()           nach jedem Neuzeichnen (emit)
   pins:before/pins   vor/nach dem Aufbau der Stecknadeln in der 3D-Stadt (emit)
   view:*             HTML einer Ansicht erweitern (pipe) */
const HOOK=(()=>{const H={};let seq=0;
  const off=(name,fn)=>{if(H[name])H[name]=H[name].filter(h=>h.fn!==fn)};
  const on=(name,fn,prio,id)=>{if(typeof fn!=='function')return ()=>{};const L=H[name]=H[name]||[];
    L.push({fn,prio:prio==null?50:prio,seq:seq++,id:id||fn.name||'anonym'});L.sort((a,b)=>a.prio-b.prio||a.seq-b.seq);return ()=>off(name,fn)};
  const claim=(name,...a)=>{const L=H[name];if(!L)return undefined;for(const h of L.slice()){let r;try{r=h.fn(...a)}catch(e){errLog(e,'hook:'+name+':'+h.id);continue}if(r!==undefined)return r}return undefined};
  const emit=(name,...a)=>{const L=H[name];if(!L)return;for(const h of L.slice()){try{h.fn(...a)}catch(e){errLog(e,'hook:'+name+':'+h.id)}}};
  const pipe=(name,v,...a)=>{const L=H[name];if(!L)return v;for(const h of L.slice()){try{const r=h.fn(v,...a);if(r!==undefined)v=r}catch(e){errLog(e,'hook:'+name+':'+h.id)}}return v};
  const list=name=>(H[name]||[]).map(h=>h.prio+' '+h.id);
  const has=name=>!!(H[name]&&H[name].length);
  return Object.freeze({on,off,claim,emit,pipe,list,has})})();
try{if(typeof window!=='undefined')window.__hook=HOOK}catch(e){errLog(e)}
