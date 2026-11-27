/* ================= Speichern v2: versioniert, mit Sicherung, Prüfung und Export/Import =================
   Format im localStorage:  KEY      -> {v:3, app:APPVER, t:Zeitstempel, p:{…Spielstand…}}
                            KEY-bak  -> der letzte gute Stand vor dem aktuellen (Rettungsanker)
   Alte Spielstände (reines p-Objekt ohne Hülle) werden weiterhin gelesen. */
const SAVEV=3,BAKK=KEY+'-bak';
const SV={warn:0,bakAge:null,bakT:0,info:null,fails:0};
/* Prüft, ob ein Objekt ein spielbarer Spielstand ist. */
function saveValid(o){return !!(o&&typeof o==='object'&&typeof o.first==='string'&&o.st&&typeof o.st==='object'&&typeof o.age==='number'&&isFinite(o.age)&&typeof o.money==='number'&&isFinite(o.money))}
/* Repariert alte oder beschädigte Stände, so weit es geht. */
function saveMigrate(o){try{
  ['log','ms','items','q','kids'].forEach(k=>{if(!Array.isArray(o[k]))o[k]=[]});
  Object.keys(STAT).forEach(k=>{const v=+o.st[k];o.st[k]=isFinite(v)?clamp(Math.round(v),0,100):50});
  if(!isFinite(o.act))o.act=0;if(o.ach==null||typeof o.ach!=='object')o.ach={};
  o.saveV=SAVEV}catch(e){errLog(e,'migrate')}return o}
function saveUnpack(raw){if(!raw)return null;let o=null;try{o=JSON.parse(raw)}catch(e){return null}if(o&&o.v&&o.p)o=o.p;return saveValid(o)?saveMigrate(o):null}
const savePack=()=>JSON.stringify({v:SAVEV,app:APPVER,t:Date.now(),p});
/* Kürzt die Listen, die über ein Leben am stärksten wachsen. */
function saveTrim(){if(!p)return;const cut=(a,n)=>Array.isArray(a)&&a.length>n?a.splice(0,a.length-n):0;
  cut(p.log,300);cut(p.diary,200);cut(p.news,40);cut(p.ehist,120);if(p.chats)Object.values(p.chats).forEach(c=>c&&cut(c.msgs,30))}
save=function(){if(!p)return;if(!saveValid(p)){errLog(new Error('Spielstand ungültig, nicht gespeichert'),'save');return}
  let s;try{s=savePack()}catch(e){errLog(e,'save-json');return}
  try{const now=Date.now();if(SV.bakAge!==p.age||now-SV.bakT>90000){const cur=localStorage.getItem(KEY);if(cur&&saveUnpack(cur))localStorage.setItem(BAKK,cur);SV.bakAge=p.age;SV.bakT=now}
    localStorage.setItem(KEY,s);SV.fails=0;return}catch(e){errLog(e,'save')}
  /* Speicher voll: Sicherung opfern, Listen kürzen, nochmal versuchen. */
  try{localStorage.removeItem(BAKK);saveTrim();localStorage.setItem(KEY,savePack());return}catch(e){errLog(e,'save-quota')}
  SV.fails++;if(!SV.warn){SV.warn=1;toast('Speichern fehlgeschlagen: Der Browser-Speicher ist voll. Exportiere deinen Spielstand in den Einstellungen.')}};
load=function(){let raw=null;try{raw=localStorage.getItem(KEY)}catch(e){errLog(e,'load');return null}
  if(raw==null)return null;const o=saveUnpack(raw);if(o)return o;
  /* Hauptstand kaputt: auf die Sicherung zurückfallen. */
  let b=null;try{b=saveUnpack(localStorage.getItem(BAKK))}catch(e){errLog(e,'load-bak')}
  if(b){if(!SV.info){SV.info=1;setTimeout(()=>toast('Dein Spielstand war beschädigt. Die letzte Sicherung wurde geladen.'),400)}return b}
  errLog(new Error('Spielstand und Sicherung unlesbar'),'load');return null};
/* ---------- Export und Import ---------- */
function saveExport(){if(!p)return;let data,fn;try{data=JSON.stringify({v:SAVEV,app:APPVER,t:Date.now(),p,album:typeof ALB!=='undefined'?ALB:null},null,1);
  fn='lebenslauf-'+String(p.first+'-'+p.last).toLowerCase().replace(/[^a-z0-9äöüß-]+/g,'')+'-'+p.age+'.json'}catch(e){errLog(e,'export');toast('Export hat nicht geklappt.');return}
  const plain=()=>{try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast('Spielstand exportiert.')}catch(e){errLog(e,'export');toast('Export hat nicht geklappt.')}};
  /* In der Claude-Vorschau laufen Downloads über die Plattform, sonst über einen normalen Download-Link. */
  const cl=typeof window!=='undefined'&&window.claude&&typeof window.claude.use==='function'?window.claude:null;if(!cl){plain();return}
  cl.use('downloads').then(dl=>{if(!dl){plain();return}return dl.save({filename:fn,data}).then(()=>toast('Spielstand exportiert.'),e=>{if(e&&e.code==='declined')return;if(e&&e.code==='host_unavailable'){toast('Hier kann keine Datei gespeichert werden. Öffne das Spiel im Browser.');return}plain()})}).catch(e=>{errLog(e,'export');plain()})}
function saveImport(){try{const inp=document.createElement('input');inp.type='file';inp.accept='.json,application/json';
  inp.onchange=()=>{const f=inp.files&&inp.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{let env=null;try{env=JSON.parse(rd.result)}catch(e){toast('Die Datei ist kein Spielstand.');return}
    const o=saveUnpack(JSON.stringify(env&&env.p?env.p:env));if(!o){toast('Die Datei ist kein gültiger Spielstand.');return}
    dialog('Spielstand laden?',o.first+' '+o.last+', '+o.age+' Jahre, '+eur(o.money)+'. Dein aktuelles Leben wird dabei ersetzt.',[['Laden',()=>{p=o;if(env.album&&typeof ALB!=='undefined'){try{Object.assign(ALB,env.album);albSave()}catch(e){errLog(e)}}tab='home';sel='home';save();render();toast('Spielstand geladen.')}],['Abbrechen',null]])};rd.readAsText(f)};inp.click()}catch(e){errLog(e,'import')}}
function saveBakInfo(){try{const b=saveUnpack(localStorage.getItem(BAKK));return b?b.first+', '+b.age+' Jahre':null}catch(e){return null}}
{const _ve=viewEinst;viewEinst=function(){const h=_ve();try{if(!p||!p.alive||typeof einTab==='undefined'||einTab!=='spiel')return h;const bi=saveBakInfo();
  return h+'<section class="card"><h2 class="h">Spielstand</h2><p class="note">Wird automatisch gespeichert. Als Datei sicherst du ihn für ein anderes Gerät.</p><div class="btns">'+btn('svexp',null,'Exportieren','o')+btn('svimp',null,'Importieren','g')+(bi&&bi!==p.first+', '+p.age+' Jahre'?btn('svbak',null,'Sicherung laden ('+esc(bi)+')','g'):'')+'</div></section>'}catch(e){errLog(e,'svcard')}return h}}
{const f=act;act=function(id,arg){if(id==='svexp'){saveExport();return 1}if(id==='svimp'){saveImport();return 1}
  if(id==='svbak'){const b=saveUnpack((()=>{try{return localStorage.getItem(BAKK)}catch(e){return null}})());if(!b){toast('Keine Sicherung vorhanden.');return 1}
    dialog('Sicherung laden?',b.first+' '+b.last+', '+b.age+' Jahre. Dein aktueller Stand wird ersetzt.',[['Laden',()=>{p=b;SV.bakAge=p.age;tab='home';sel='home';try{localStorage.setItem(KEY,savePack())}catch(e){errLog(e)}render();toast('Sicherung geladen.')}],['Abbrechen',null]]);return 1}
  return f(id,arg)}}
