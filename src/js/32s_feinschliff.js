/* ================= Feinschliff: Sportnote, Chats, Kalender, bessere Antworten, Verein für Kinder ================= */

/* ---------- Sport zählt fürs Zeugnis ---------- */
['sport','jog','fahrrad','spielplatz'].forEach(k=>{const A=ACTS[k];if(!A)return;const f0=A.f;A.f=()=>{const r=f0();if(r!==null){p.sk.form=Math.min(100,(p.sk.form||0)+(k==='sport'?R(2,4):R(1,3)));if(p.age<19)p.sportY=(p.sportY||0)+1}return r}});
{const _g=gradesYear;gradesYear=function(){_g();const g=p.gr;if(g&&g.a===p.age){const bon=Math.min(1.5,(p.sportY||0)*.5+((p.clubs||[]).length?.5:0));if(bon){g.sp=clamp(Math.round((g.sp-bon)*2)/2,1,6);g.avg=(g.ma+g.de+g.en+g.sp)/4}}p.sportY=0}}

/* ---------- Verein für Kinder: die Eltern zahlen ---------- */
QEV.k_verein=()=>E('Probetraining!','Der Fußballverein um die Ecke sucht Kinder in deinem Alter. '+parentN()+' fragt: „Willst du mitmachen? Den Beitrag zahlen wir.“',()=>p.age>=6&&p.age<14&&!(p.clubs||[]).includes('fc'),[
  ['Ja, ich will in den Verein!',()=>{p.clubs=p.clubs||[];p.clubs.push('fc');add('gl',5);p.sk.form=Math.min(100,(p.sk.form||0)+2);kmem('Ich bin in den Fußballverein eingetreten');return 'Willkommen im Verein! Training ist zweimal pro Woche. Du findest ihn unter Freizeit → Sport.'}],
  ['Lieber ein anderes Hobby',()=>'Auch gut. Vielleicht später.']]);
// Vereinsbeitrag zahlen bei Kindern die Eltern
{const f=act;act=function(id,arg){if(id==='club'&&p&&p.age<18&&!p.prison&&CLUBS[arg]){const i=p.clubs.indexOf(arg);if(i>=0){p.clubs.splice(i,1);done('Aus dem '+CLUBS[arg][0]+' ausgetreten.');return}
  if(p.age<6)return;p.clubs.push(arg);add('gl',3);done('Willkommen im '+CLUBS[arg][0]+'! Den Beitrag zahlen '+(p.parentsGone?'deine Betreuer':'Mama und Papa')+'.');return}return f(id,arg)}}
{const _py=perkYear;perkYear=function(R0){_py(R0);try{if(p.age<18&&(p.clubs||[]).length){const back=p.clubs.reduce((s,c)=>s+px$(CLUBS[c][1]),0);p.money+=back;R0.inc.push(['Vereinsbeitrag (zahlen die Eltern)',back])}if(p.age>=6&&p.age<14&&!(p.clubs||[]).length&&!(p.kseen||{}).k_verein&&ch(.35)){p.kseen=p.kseen||{};p.kseen.k_verein=1;p.q.push({id:'k_verein'})}}catch(e){errLog(e)}}}
INVITES_KID.freund=[['Spielen wir nachher Fußball im Park?','fussball'],['Übernachtungsparty bei mir?','party'],['Kommst du mit auf den Spielplatz?','spiel']];

/* ---------- Chats: Neuestes sofort sehen, erst antworten, dann Details ---------- */
const _npcCard=npcCard;npcCard=()=>'';
{const _vc=viewChats;viewChats=function(){if(!chatSel)return _vc();const c=contacts().find(x=>x.id===chatSel);if(!c){chatSel=null;return _vc()}
  if(p.chats[c.id])p.chats[c.id].un=0;
  const acts={mama:[['call','Anrufen']],papa:[['call','Anrufen']],freund:[['meet','Treffen']],partner:[['love','Liebe Nachricht'],['time','Date']],chef:[]};
  const qa=(acts[c.id]||[['call','Anrufen']]).map(([k,l])=>btn(k==='time'?'time':k,c.id,l,'o',k==='love'?p.loveA===p.age||!!p.prison:(p.act<=0||!!p.prison))).join('');
  const M=c.msgs.slice(-25),show=p.chatAll===c.id?M:M.slice(-6),hidden=M.length-show.length;let lastA=null;
  const bub=show.map(m=>{let s='';if(m.a!==lastA){s+='<div class="bday-sep">Mit '+m.a+'</div>';lastA=m.a}return s+'<div class="bub'+(m.me?' me':'')+'">'+esc(m.t)+'</div>'}).join('');
  return '<section class="chat"><header><button class="back" data-a="chat" data-g="" aria-label="Alle Chats"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>'+cavOf(c)+'<div><b>'+esc(c.n)+'</b><small>'+esc(c.sub||'')+'</small></div></header>'+
    '<div class="bubbles">'+(hidden>0?'<button class="older" data-a="chatall" data-g="'+c.id+'">'+hidden+' ältere Nachricht'+(hidden===1?'':'en')+' anzeigen</button>':'')+(M.length?bub:'<p class="note" style="text-align:center">Noch keine Nachrichten.</p>')+'</div>'+
    chatExtra(c)+(qa&&!c.id.startsWith('g_')?'<div class="qa">'+qa+'</div>':'')+_npcCard(c)+'</section>'}}

/* ---------- Kalender: eigene Einträge, nach Monaten sortiert ---------- */
viewKal=function(){p.cal=p.cal||[];const lock=!!p.prison;
  const bds=people().map(([id,n])=>({id,n,d:bdOf(id)}));
  const items=bds.map(b=>{const dn=p.grat[b.id]===p.age;return {m:b.d[1],d:b.d[0],k:'bd',h:'<div class="kal'+(dn?' done':'')+'"><span class="kd"><b>'+b.d[0]+'</b><small>'+MON[b.d[1]].slice(0,3)+'</small></span><div class="kt"><b>🎂 '+esc(b.n)+'</b><small>'+(dn?'Gratuliert':'Geburtstag')+'</small></div>'+(dn?'<span class="chip">Erledigt</span>':btn('grat',b.id,relOf(b.id)<30?'Gratulieren · 1 Aktion':'Gratulieren','o',p.age<6||!!p.prison&&b.id!=='mama'&&b.id!=='papa'))+'</div>'}})
   .concat(p.terms.map((t,i)=>{const T=TERM[t.k];if(!T||!T[2]())return null;return {m:t.m,d:t.d,h:'<div class="kal term'+(t.done?' done':'')+'"><span class="kd"><b>'+t.d+'</b><small>'+MON[t.m].slice(0,3)+'</small></span><div class="kt"><b>'+T[0]+'</b><small>'+(t.done?'Erledigt':T[1]+(T[4]?' · verpassen hat Folgen':''))+'</small></div>'+(t.done?'<span class="chip">Erledigt</span>':btn('term',i,'Hingehen','',lock))+'</div>'}}).filter(Boolean))
   .concat(p.cal.map((e,i)=>({e,i})).filter(x=>x.e.rep||x.e.a===p.age).map(({e,i})=>{const dn=e.done===p.age;return {m:e.m,d:e.d,h:'<div class="kal own'+(dn?' done':'')+'"><span class="kd"><b>'+e.d+'</b><small>'+MON[e.m].slice(0,3)+'</small></span><div class="kt"><b>'+esc(e.t)+'</b><small>Dein Eintrag'+(e.rep?' · jedes Jahr':'')+'</small></div>'+
     (dn?'<span class="chip">Erledigt</span>':btn('caldone',i,'Abhaken','g'))+'<button class="kdel" data-a="caldel" data-g="'+i+'" aria-label="Eintrag löschen">×</button></div>'}}))
   .sort((x,y)=>x.m-y.m||x.d-y.d);
  let h='<section class="card calnew"><h2 class="h">Neuer Eintrag</h2><input type="text" id="calt" maxlength="40" placeholder="z. B. Omas Besuch, Klassenfahrt, Fußballturnier">'+
    '<div class="calrow"><select id="cald" aria-label="Tag">'+Array.from({length:31},(_,i)=>'<option>'+(i+1)+'</option>').join('')+'</select><select id="calm" aria-label="Monat">'+MON.map((m,i)=>'<option value="'+i+'">'+m+'</option>').join('')+'</select></div>'+
    '<label class="calrep"><input type="checkbox" id="calr"> Jedes Jahr wiederholen</label>'+btn('caladd',null,'Eintragen','o')+'</section>';
  let cur=-1;h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Dein Jahr mit '+p.age+'</h2><span class="chip">'+items.filter(x=>!/ done/.test(x.h)).length+' offen</span></div>'+
    (items.length?items.map(x=>{let s='';if(x.m!==cur){cur=x.m;s='<div class="kmon">'+MON[x.m]+'</div>'}return s+x.h}).join(''):'<p class="note">Keine Termine.</p>')+'<p class="note" style="margin-top:8px">Gratulieren kostet keine Aktion, außer die Beziehung ist schlecht. Vergessene Geburtstage und Termine haben Folgen.</p></section>';
  const up=[];if(p.school)up.push(['Schulabschluss',(p.school==='Gymnasium'?18:p.school==='Hauptschule'?15:16)+(p.rep||0)-p.age+' Jahr(e)']);if(p.study)up.push(['Studienabschluss '+p.study.f,p.study.left+' Jahr(e)']);if(p.azubi)up.push(['Ausbildungsende',p.azubi.left+' Jahr(e)']);
  if(p.age<18)up.push(['18. Geburtstag',(18-p.age)+' Jahr(e)']);if(p.job&&!p.pension&&p.age<67&&p.job.id!=='influ')up.push(['Rente',67-p.age+' Jahre']);(p.loans||[]).forEach(l=>up.push(['Kredit abbezahlt',l.left+' Jahr(e)']));
  if(up.length)h+=card('Demnächst',up.map(u=>row(u[0],'in '+u[1])).join(''));
  return h};
{const _r=reminders;reminders=function(){const L=_r();const e=(p.cal||[]).find(x=>(x.rep||x.a===p.age)&&x.done!==p.age);if(e&&!(p.remS&&p.remS.own===p.age))L.unshift(['own','Dein Kalender: '+e.t+' am '+e.d+'. '+MON[e.m]+'.','kalender']);return L}}
function act20(id,arg){switch(id){
  case 'chatall':p.chatAll=p.chatAll===arg?null:arg;render();return 1;
  case 'caladd':{const t=(document.getElementById('calt')||{}).value||'';if(!t.trim()){toast('Schreib erst, was ansteht.');return 1}p.cal=p.cal||[];if(p.cal.length>=30){toast('Höchstens 30 eigene Einträge.');return 1}
    p.cal.push({t:t.trim().slice(0,40),d:+document.getElementById('cald').value,m:+document.getElementById('calm').value,rep:!!document.getElementById('calr').checked,a:p.age,done:null});save();render();toast('Eingetragen.');return 1}
  case 'caldone':{const e=(p.cal||[])[+arg];if(!e)return 1;e.done=p.age;add('gl',1);save();render();return 1}
  case 'caldel':{p.cal=(p.cal||[]).filter((_,i)=>i!==+arg);save();render();return 1}
}return 0}

/* ---------- Mehr und bessere Antworten bei schweren Kindheitserlebnissen ---------- */
{const _t=QEV.trauma;QEV.trauma=k=>{const e=_t(k);if(!e)return e;const T=LASTT[k],b=T[2]*schutz(),O2=(l,m,f)=>[l,()=>{addLast(b*m);kmem(T[0]);return f()}];const par=parentN();
  const S={mobbing:[
    ['Sich wehren: „Hört auf damit!“',()=>{kmem(T[0]);if(ch(.4+(p.sk.form||0)/250+((p.pg||{}).mut||0)*.08)){addLast(b*.35);pg('mut');pg('durch');kmRel(kmates()[0],-5);return 'Alle sind überrascht. Seitdem lassen sie dich meistens in Ruhe.'}addLast(b*1.1);return 'Sie lachen noch lauter. Aber du hast dich gewehrt, und das zählt.'}],
    ['Mit einem Witz kontern',()=>{kmem(T[0]);if(ch(.35+(p.sk.charme||0)/200)){addLast(b*.45);pg('clown');return 'Die halbe Klasse lacht, diesmal mit dir. Der Spuk ist schnell vorbei.'}addLast(b);return 'Der Witz kommt nicht an. Es tut trotzdem gut, nicht nur still zu sein.'}],
    O2('Der Klassenlehrerin Bescheid sagen',.6,()=>(pg('regel'),'Die Lehrerin spricht mit der ganzen Klasse. Ganz weg ist es nicht, aber viel besser.')),
    O2('Mit '+par+' reden',.6,()=>(relUp(par==='Papa'?'papa':'mama',6),par+' nimmt dich in den Arm und redet mit der Schule. Du bist nicht allein.')),
    O2('Neue Freunde in einer AG suchen',.7,()=>(relUp('freund',6),add('gl',3),'In der Theater-AG findest du Leute, die dich mögen, wie du bist.')),
    O2('Alles in dich hineinfressen',1.3,()=>'Nach außen wirkst du stark. Innen ist es anders.')],
   scheidung:[O2('Mit beiden reden',.6,()=>'Mama und Papa sagen dir beide: Es liegt nicht an dir. Das hilft.'),O2('Bei Oma Halt suchen',.7,()=>'Bei Oma gibt es Kakao und keine Streitereien.'),O2('Wütend werden und Türen knallen',.9,()=>(pg('durch'),'Die Wut muss raus. Danach ist es ein bisschen leichter.')),O2('Sich ins Zimmer zurückziehen',1.2,()=>'Du hörst Musik, ganz laut. Damit du nichts anderes hörst.')],
   oma:[O2('Ein Bild für Oma malen',.5,()=>'Das Bild hängt jetzt neben ihrem Foto. Ein bisschen ist sie noch da.'),O2('Mit '+par+' weinen und reden',.6,()=>'Ihr erzählt euch Oma-Geschichten. Zwischen den Tränen lacht ihr auch.'),O2('So tun, als wäre nichts',1.2,()=>'Du willst nicht darüber reden. Noch nicht.')],
   unfall:[O2('Darüber reden',.6,()=>'Je öfter du es erzählst, desto kleiner wird der Knall im Kopf.'),O2('Malen, was passiert ist',.6,()=>'Auf dem Bild sind alle heil. Das tut gut.'),O2('Nicht mehr ins Auto steigen wollen',1.1,()=>'Ihr fahrt jetzt öfter Bus. Die Angst bleibt eine Weile.')],
   brand:[O2('Die Feuerwache besuchen',.5,()=>(pg('mut'),'Die Feuerwehrleute zeigen dir alles. Feuer ist jetzt etwas, das man löschen kann.')),O2('Darüber reden',.6,()=>'Mama und Papa sind da. Das Wichtigste: Alle sind sicher.'),O2('Nachts das Licht anlassen',1.1,()=>'Ein Nachtlicht hilft ein bisschen.')],
   sucht:[O2('Oma oder einer Lehrerin davon erzählen',.5,()=>'Jemand Erwachsenes weiß Bescheid und hilft. Du musst das nicht allein tragen.'),O2('Papa darauf ansprechen',.7,()=>(pg('mut'),ch(.4)?'Papa wird still. Ein paar Wochen später geht er zu einer Beratung.':'Papa wird laut. Aber du hast etwas Mutiges getan.')),O2('Schweigen',1.3,()=>'Du sagst niemandem etwas. Es bleibt ein Geheimnis, das schwer wiegt.')]};
  if(S[k])e.o=S[k];return e}}
// Kindheitsentscheidungen: mehr Möglichkeiten
addOpt('k_spielplatz',()=>['Mit einem Spruch kontern',()=>{const m=kmates()[0];if(ch(.4+(p.sk.charme||0)/200)){pg('clown');kmRel(m,5);return '„Baby? Wenigstens kann ich meine Schaufel selbst halten!“ Alle lachen, sogar '+m.n+'.'}pg('durch');kmRel(m,-4);return 'Der Spruch geht daneben. '+m.n+' grinst triumphierend.'}]);
addOpt('k_spielplatz',()=>['Einfach weggehen',()=>(add('gl',-1),'Du spielst woanders weiter. Die Schaufel holt Mama später zurück.')]);
addOpt('k_test',()=>['Ausrede: „Ich weiß es selbst nicht“',()=>(pg('schlitz'),'Halb gelogen, halb wahr. '+kmates()[3].n+' glaubt dir.')]);
addOpt('k_fenster',()=>['Ausrede: „Das war ein Vogel!“',()=>{pg('schlitz');valAdd('e',-2);return ch(.25)?'Die Nachbarin schaut skeptisch, aber sie glaubt dir. Glück gehabt!':(relUp('papa',-4),'Ein Vogel mit Fußball? Papa glaubt dir kein Wort. Hausarrest.')}]);
addOpt('k_klingel',()=>['Nur Schmiere stehen',()=>(pg('schlitz'),add('gl',3),'Du stehst an der Ecke und pfeifst, als Herr Krause kommt. Ihr entkommt alle.')]);
addOpt('k_pause',()=>['Der Lehrerin Bescheid sagen',()=>(pg('regel'),kmRel(km('neu'),6),'Die Lehrerin organisiert ein Brot aus der Mensa. '+km('neu').n+' schaut dich dankbar an.')]);
