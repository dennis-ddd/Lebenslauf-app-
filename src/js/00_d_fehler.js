/* ================= Fehlerprotokoll: Fehler werden nicht mehr still verschluckt, sondern gesammelt ================= */
const ERRLOG=[];
function errLog(e,wo){try{const m=(e&&e.message)||String(e);const k=(wo||'')+m;const x=ERRLOG.find(y=>y.k===k);if(x){x.n++;return}if(ERRLOG.length>=60)return;
  const st=(e&&e.stack||'').split('\n').slice(1,3).map(s=>s.trim()).join(' | ');ERRLOG.push({k,m,wo:wo||'',st,n:1,a:typeof p!=='undefined'&&p?p.age:null});if(typeof console!=='undefined'&&console.warn)console.warn('[Lebenslauf]',m,st)}catch(_){}}
