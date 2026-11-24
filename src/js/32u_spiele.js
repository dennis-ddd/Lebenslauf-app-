/* ================= Neue Spielarten: Merken, Suchbild, Sortieren, Elfmeter, Baukasten ================= */
let MGID=0;function mgOpen(h){const d=document.getElementById('dlg'),m=document.getElementById('modal');d.className='dlg stage mg mg2';d.dataset.mg=++MGID;d.innerHTML='<div class="sbody">'+h+'</div>';m.classList.add('on');return d}
function mgClose(){document.getElementById('modal').classList.remove('on')}
const mgFin=(d,ok,txt,cb,ms)=>{const id=d.dataset.mg;const f=d.querySelector('.mgfb');if(f){f.className='mgfb '+(ok?'ok':'no');f.textContent=txt}sfx(ok?'coin':'bad');setTimeout(()=>{if(d.dataset.mg===id)mgClose();cb(ok)},ms||900)};
/* 1) Merken: Reihenfolge einprägen und nachtippen */
const MEMOSET={
  memo:{h:'Reihenfolge merken',p:'Schau genau hin und tippe die Felder danach in derselben Reihenfolge.',s:['A','B','C','D','E','F','G','H','I']},
  check:{h:'Checkliste',p:'Präg dir die Reihenfolge der Checkliste ein und hak sie dann ab.',s:['Treibstoff','Klappen','Trimmung','Funk','Transponder','Gurte','Licht','Bremsen','Ruder']},
  halt:{h:'Haltestellen',p:'Merk dir die Haltestellen der Linie und fahre sie danach der Reihe nach an.',s:['Markt','Bahnhof','Schule','Park','Rathaus','Klinik','Zoo','Hafen','Kirche']},
  route:{h:'Fluchtweg',p:'Merk dir, wo der Verdächtige abgebogen ist, und folge ihm.',s:['Links','Rechts','Gerade','Hof','Tunnel','Brücke','Gasse','Treppe','Markt']}};
function memoRound(tt,lvl,cb,set){const S=MEMOSET[set||'memo'],n=Math.min(6,2+lvl),seq=[];while(seq.length<n){const x=R(0,8);if(seq[seq.length-1]!==x)seq.push(x)}
  const d=mgOpen('<h2>'+esc(tt)+'</h2><p>'+S.p+'</p><div class="mgmemo">'+S.s.map((t,i)=>'<button data-i="'+i+'" disabled>'+t+'</button>').join('')+'</div><div class="mgfb">Gut aufpassen …</div>');
  const B=[...d.querySelectorAll('[data-i]')],id=d.dataset.mg;let k=0,inp=[];
  const show=()=>{if(d.dataset.mg!==id)return;if(k>=seq.length){B.forEach(b=>{b.disabled=false;b.classList.remove('lit')});d.querySelector('.mgfb').textContent='Jetzt du: '+n+' Felder';return}
    const b=B[seq[k]];b.classList.add('lit');setTimeout(()=>{b.classList.remove('lit');k++;setTimeout(show,220)},620)};setTimeout(show,500);
  B.forEach(b=>b.onclick=()=>{const i=+b.dataset.i,j=inp.length;inp.push(i);b.classList.add(i===seq[j]?'ok':'no');setTimeout(()=>b.classList.remove('ok','no'),300);
    if(i!==seq[j]){B.forEach(x=>x.disabled=true);return mgFin(d,false,'Falsch! Richtig wäre „'+S.s[seq[j]]+'“ gewesen.',cb,1300)}
    if(inp.length===seq.length){B.forEach(x=>x.disabled=true);mgFin(d,true,'Perfekt gemerkt!',cb)}})}
/* 2) Suchbild: genau eine Person passt zur Beschreibung */
const JCK=[['#C0504D','rote'],['#3E7CB1','blaue'],['#5C9E5A','grüne'],['#D5A35E','gelbe']];
function personSvg(f){return '<svg viewBox="0 0 40 52" aria-hidden="true"><rect x="9" y="22" width="22" height="26" rx="8" fill="'+JCK[f.j][0]+'"/><circle cx="20" cy="15" r="9" fill="'+['#F1C9A5','#C68B59','#8D5524'][f.s]+'"/>'+
  (f.h?'<path d="M10 11h20v-3a10 6 0 0 0-20 0z" fill="#2A2F45"/><rect x="7" y="10" width="26" height="3" rx="1.5" fill="#2A2F45"/>':'')+(f.g?'<g fill="none" stroke="#111" stroke-width="1.6"><circle cx="16" cy="16" r="3"/><circle cx="24" cy="16" r="3"/><path d="M19 16h2"/></g>':'')+
  (f.b?'<rect x="27" y="30" width="9" height="12" rx="2" fill="#6B4A2F"/>':'')+'</svg>'}
function suchRound(tt,lvl,cb,set){
  if(set==='katze'){const n=12,t=R(0,n-1);
    const bush=c=>'<svg viewBox="0 0 40 40" aria-hidden="true">'+(c?'<path d="M13 13l2-6 3 5M27 13l-2-6-3 5" fill="#5A5A5A"/><circle cx="17" cy="16" r="1.4" fill="#E8D27A"/><circle cx="23" cy="16" r="1.4" fill="#E8D27A"/>':'')+'<circle cx="12" cy="26" r="10" fill="#2E6B4F"/><circle cx="28" cy="26" r="10" fill="#2E6B4F"/><circle cx="20" cy="20" r="'+(c?9:11)+'" fill="#3B8060"/><circle cx="20" cy="30" r="9" fill="#25573F"/></svg>';
    const d=mgOpen('<h2>'+esc(tt)+'</h2><p>Irgendwo in den Büschen sitzt die Katze. Achte auf die Ohren.</p><div class="mgsuch k">'+Array.from({length:n},(_,i)=>'<button data-i="'+i+'">'+bush(i===t)+'</button>').join('')+'</div><div class="mgfb">Ein Versuch!</div>');
    d.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{d.querySelectorAll('[data-i]').forEach(x=>x.disabled=true);const ok=+b.dataset.i===t;d.querySelectorAll('[data-i]')[t].classList.add('hit');mgFin(d,ok,ok?'Da ist sie!':'Leider nur ein Busch.',cb,1200)});return}
  const n=lvl>=3?12:9,tgt={j:R(0,3),h:ch(.5)?1:0,g:ch(.5)?1:0,s:R(0,2),b:ch(.4)?1:0},L=[];const key=f=>f.j+'-'+f.h+'-'+f.g;
  while(L.length<n-1){const f={j:R(0,3),h:R(0,1),g:R(0,1),s:R(0,2),b:ch(.3)?1:0};const same=[f.j===tgt.j,f.h===tgt.h,f.g===tgt.g].filter(Boolean).length;if(key(f)!==key(tgt)&&same>=1)L.push(f)}
  const ti=R(0,n-1);L.splice(ti,0,tgt);
  const desc=JCK[tgt.j][1]+' Jacke, '+(tgt.h?'mit Mütze':'ohne Mütze')+', '+(tgt.g?'mit Brille':'ohne Brille');
  const d=mgOpen('<h2>'+esc(tt)+'</h2><p>Gesucht: <b>'+desc+'</b>. Tipp auf die richtige Person.</p><div class="mgsuch">'+L.map((f,i)=>'<button data-i="'+i+'">'+personSvg(f)+'</button>').join('')+'</div><div class="mgfb">Ein Versuch!</div>');
  d.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{d.querySelectorAll('[data-i]').forEach(x=>x.disabled=true);const ok=+b.dataset.i===ti;d.querySelectorAll('[data-i]')[ti].classList.add('hit');mgFin(d,ok,ok?'Erwischt!':'Falsche Person!',cb,1300)})}
/* 3) Sortieren: jedes Teil in den richtigen Korb */
const WISCH={
  paket:{h:'Pakete sortieren',p:'Ordne jedes Paket der richtigen Tour zu.',bins:['Tour Nord (PLZ 1–3)','Tour Mitte (4–6)','Tour Süd (7–9)'],gen:()=>{const z=R(1,9),plz=z+String(R(0,9999)).padStart(4,'0');return [plz,z<=3?0:z<=6?1:2]}},
  chat:{h:'Chat moderieren',p:'Fans willst du halten, Trolle und Spam fliegen raus.',bins:['Antworten','Bannen','Ignorieren'],gen:()=>pick(CHATM)}};
const CHATM=[['Wie heißt dein Setup? Sieht mega aus!',0],['Grüße aus Hamburg! Erster Stream bei dir 👋',0],['Kannst du das nochmal erklären?',0],['Wann kommt das nächste Video?',0],['Du bist der Grund, warum ich lache 😂',0],['Welches Spiel als Nächstes?',0],
  ['Billige Follower kaufen 👉 kl1ck-boost.biz',1],['Du bist so schlecht, hör auf',1],['GRATIS iPhone!!! Link im Profil',1],['Alle hier sind Opfer',1],['*** Werbung *** schnell reich werden',1],['Ich weiß, wo du wohnst',1],
  ['lol',2],['first',2],['😂😂😂',2],['gg',2],['hallo',2],['ok',2]];
function wischRound(tt,lvl,cb,set){const W=WISCH[set||'paket'],n=set==='chat'?8:Math.min(6,3+lvl);let k=0,ok=0,cur=W.gen();
  const d=mgOpen('<h2>'+esc(tt)+'</h2><p>'+W.p+'</p><div class="mgcard" id="mgc"></div><div class="mgbins">'+W.bins.map((b,i)=>'<button class="btn '+(i===1&&set==='chat'?'r':'o')+'" data-b="'+i+'">'+b+'</button>').join('')+'</div><div class="mgfb" id="mgf">1 von '+n+'</div>');
  const c=d.querySelector('#mgc'),f=d.querySelector('#mgf'),showC=()=>{c.className='mgcard in';c.innerHTML=set==='chat'?'<small>'+esc(pick(FANS))+'</small>'+esc(cur[0]):'<small>Paket</small><b>PLZ '+cur[0]+'</b>'};showC();
  d.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{if(k>=n)return;const r=+b.dataset.b===cur[1];if(r)ok++;sfx(r?'coin':'bad');c.className='mgcard out '+(r?'ok':'no');k++;f.textContent=k<n?(k+1)+' von '+n+' · '+ok+' richtig':ok+' von '+n+' richtig';
    setTimeout(()=>{if(k>=n){mgClose();cb(set==='chat'?ok:ok>=Math.ceil(n*.7),ok)}else{cur=W.gen();showC()}},360)})}
/* 4) Elfmeter: Körpersprache lesen, Ecke wählen */
function elferRound(tt,lvl,cb){const lean=R(0,2),bluff=ch(.25),dive=bluff?R(0,2):lean,lt=['links','in die Mitte','rechts'][lean];
  const d=mgOpen('<h2>'+esc(tt)+'</h2><p>Der Torwart verlagert sein Gewicht nach <b>'+lt+'</b>. Manche bluffen aber. Wohin schießt du?</p><div class="mgtor"><i class="kp k'+lean+'" id="kp"></i><i class="ball" id="bl"></i></div><div class="mgbins">'+['Links','Mitte','Rechts'].map((b,i)=>'<button class="btn o" data-b="'+i+'">'+b+'</button>').join('')+'</div><div class="mgfb">Ein Schuss.</div>');
  d.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{d.querySelectorAll('[data-b]').forEach(x=>x.disabled=true);const s=+b.dataset.b,ok=s!==dive;d.querySelector('#kp').className='kp d'+dive;d.querySelector('#bl').className='ball s'+s;
    mgFin(d,ok,ok?'Tor!':bluff?'Gehalten! Er hat geblufft.':'Gehalten!',cb,1300)})}
const MGX={memo:(t,l,cb)=>memoRound(t,l,cb,'memo'),check:(t,l,cb)=>memoRound(t,l,cb,'check'),halt:(t,l,cb)=>memoRound(t,l,cb,'halt'),route:(t,l,cb)=>memoRound(t,l,cb,'route'),
  finden:(t,l,cb)=>suchRound(t,l,cb),katze:(t,l,cb)=>suchRound(t,l,cb,'katze'),wisch:(t,l,cb)=>wischRound(t,l,cb,'paket'),elfer:elferRound};
Object.assign(MGN,{memo:['Merken','Merk dir die Reihenfolge.'],check:['Checkliste','Merk dir die Checkliste und arbeite sie ab.'],halt:['Linienfahrt','Merk dir die Haltestellen und fahre sie der Reihe nach an.'],route:['Verfolgung','Merk dir den Weg des Verdächtigen.'],
  finden:['Suchbild','Finde die Person, die zur Beschreibung passt.'],katze:['Suchbild','Finde die Katze in den Büschen.'],wisch:['Sortieren','Sortiere jedes Teil in den richtigen Korb.'],elfer:['Elfmeter','Lies den Torwart und wähle die Ecke.']});
{const _pm=playMG;playMG=function(type,n,title,cb){if(!MGX[type])return _pm(type,n,title,cb);if(noDom())return cb(autoMG(n,p.st.in),true);let sc=0,i=0;
  const step=()=>{if(i>=n)return cb(sc,false);i++;MGX[type](title+' · '+i+' von '+n,i,ok=>{if(ok)sc++;step()})};step()}}
Object.assign(JOBMG,{zeitung:'wisch',lager:'wisch',paket:'wisch',bus:'halt',pilot:'check',profi:'elfer',sport:'elfer'});
/* Laufen lernen: Schrittfolge statt Timing */
{const _mg=miniGame;miniGame=function(kind,cb){if(kind!=='lauf'||noDom())return _mg(kind,cb);
  const seq=Array.from({length:3},()=>R(0,1)),nm=['Links','Rechts'];let k=0,steps=0;
  const d=mgOpen('<h2>Laufen lernen</h2><p>Mama zeigt es vor: <b>'+seq.map(s=>nm[s]).join(' · ')+'</b>. Gleich verschwindet der Tipp!</p><div class="mgsteps" id="mgs">0 Schritte</div><div class="mgbins"><button class="btn o" data-b="0" disabled>Linker Fuß</button><button class="btn o" data-b="1" disabled>Rechter Fuß</button></div>');
  setTimeout(()=>{const pp=d.querySelector('p');if(pp)pp.textContent='Jetzt du! Welcher Fuß kommt zuerst?';d.querySelectorAll('[data-b]').forEach(b=>b.disabled=false)},2200);
  d.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{const ok=+b.dataset.b===seq[k];k++;if(ok){steps++;sfx('coin')}else sfx('bad');d.querySelector('#mgs').textContent=(ok?'':'Plumps! ')+steps+' Schritt'+(steps===1?'':'e');
    if(!ok||k>=3){d.querySelectorAll('[data-b]').forEach(x=>x.disabled=true);setTimeout(()=>{mgClose();cb(steps)},900)}})}}
