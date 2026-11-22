/* ================= Kindheit: Meilensteine, Minispiele, Niedlichkeit, Prägungen, Rückkehrer, seelische Last ================= */
const heavyOn=()=>!O.heavyOff;
const avgPar=()=>(relOf('mama')+relOf('papa'))/2;
const kmem=(t)=>{p.kmem=p.kmem||[];p.kmem.push({a:p.age,t});if(p.kmem.length>14)p.kmem.shift()};
const pg=(k,v)=>{p.pg=p.pg||{};p.pg[k]=(p.pg[k]||0)+(v||1)};

/* ---------- Kleine Minispiele für Babys ---------- */
function babyEnd(sc,txt){log(txt);checkAch();save();render();stageDialog(sc,'Geschafft!',txt,[['Weiter',()=>{try{chainEvent()}catch(e){}}]],'res')}
function miniGame(kind,cb){if(noDom()){cb(kind==='wort'?pick(['Mama','Papa','Wauwau','Nein!']):R(0,kind==='bau'?8:3));return}
  const d=document.getElementById('dlg'),m=document.getElementById('modal');d.className='dlg stage mg';m.classList.add('on');let stop=false;const fin=v=>{if(stop)return;stop=true;setTimeout(()=>{m.classList.remove('on');cb(v)},kind==='wort'?900:700)};
  if(kind==='wort'){const S=['Ma','Pa','Wau','Ba','Da','Nein'];let w=[];
    d.innerHTML='<div class="sbody"><h2>Dein erstes Wort</h2><p>Tippe zwei Silben. Mama und Papa halten die Luft an …</p><div class="mgword" id="mgw">…</div><div class="mgsyl">'+S.map(s=>'<button data-s="'+s+'">'+s+'</button>').join('')+'</div></div>';
    d.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const s=b.dataset.s;if(stop)return;if(s==='Nein'){d.querySelector('#mgw').textContent='Nein!';return fin('Nein!')}w.push(s);d.querySelector('#mgw').textContent=w.join('-');
      if(w.length===2){const x=w[0]===w[1]?{Ma:'Mama',Pa:'Papa',Wau:'Wauwau',Ba:'Baba',Da:'Dada'}[w[0]]:w.join('').toLowerCase();d.querySelector('#mgw').textContent=x[0].toUpperCase()+x.slice(1)+'!';fin(x[0].toUpperCase()+x.slice(1))}})}
  else if(kind==='lauf'){let t0=performance.now(),steps=0,tries=0,x=0;
    d.innerHTML='<div class="sbody"><h2>Laufen lernen</h2><p>Tippe, wenn der Punkt im grünen Bereich ist. Drei Versuche!</p><div class="mgbal"><i class="z"></i><i class="n" id="mgn"></i></div><div class="mgsteps" id="mgs">👣 0 Schritte</div><button class="btn o big" id="mgb">Schritt!</button></div>';
    const n=d.querySelector('#mgn'),loop=now=>{if(stop)return;x=50+46*Math.sin((now-t0)/(330-steps*40));n.style.left=x+'%';requestAnimationFrame(loop)};requestAnimationFrame(loop);
    d.querySelector('#mgb').onclick=()=>{if(stop)return;tries++;const ok=Math.abs(x-50)<13;if(ok)steps++;d.querySelector('#mgs').textContent=(ok?'👣 ':'💥 Plumps! ')+steps+' Schritt'+(steps===1?'':'e');if(tries>=3)fin(steps)}}
  else if(kind==='bau'){let w=70,lx=15,h=0,dir=1,x=0,t0=performance.now();
    d.innerHTML='<div class="sbody"><h2>Bauklötze</h2><p>Tippe, um den Klotz fallen zu lassen. Wie hoch wird dein Turm?</p><div class="mgtower" id="mgt"><i class="mv" id="mgm"></i></div><button class="btn o big" id="mgb">Fallen lassen</button></div>';
    const T=d.querySelector('#mgt'),M=d.querySelector('#mgm'),cols=['#F2994A','#E8467C','#7B4BE0','#13B3A6','#F6C453','#5CC8FF','#7BE3AE','#FF8FB1'];
    const loop=now=>{if(stop)return;x=(100-w)/2+((100-w)/2)*Math.sin((now-t0)/(520-h*35));M.style.left=x+'%';M.style.width=w+'%';M.style.bottom=(h*11)+'%';M.style.background=cols[h%8];requestAnimationFrame(loop)};requestAnimationFrame(loop);
    d.querySelector('#mgb').onclick=()=>{if(stop)return;const l=Math.max(x,lx),r=Math.min(x+w,lx+w),ov=r-l;if(ov<=4){M.style.display='none';return fin(h)}
      const b=document.createElement('i');b.className='bl';b.style.left=l+'%';b.style.width=ov+'%';b.style.bottom=(h*11)+'%';b.style.background=cols[h%8];T.appendChild(b);w=ov;lx=l;h++;if(h>=8){M.style.display='none';fin(h)}}}}
const playMini=(kind,sc,apply)=>()=>{setTimeout(()=>miniGame(kind,v=>babyEnd(sc,apply(v))),80);return 'Los geht’s!'};

/* ---------- Baby-Meilensteine ---------- */
QEV.m_laecheln=()=>E('Dein erstes Lächeln','Papa beugt sich über dein Bettchen und macht Grimassen.',()=>p.age<=2,[['Breit grinsen',()=>(relUp('papa',6),relUp('mama',4),add('gl',5),kmem('Mein erstes Lächeln'),'Papa hat es gefilmt. Das Video läuft auf jeder Familienfeier.')],['Erst mal weinen',()=>(add('gl',1),'Papa übt weiter. Morgen klappt es bestimmt.')]]);
QEV.m_zahn=()=>E('Der erste Zahn','Ein kleiner weißer Punkt! Aber die Nacht war lang.',()=>p.age<=2,[['Auf dem Beißring kauen',()=>(add('ge',2),'Mama und Papa schlafen endlich wieder.')],['Die ganze Nacht weinen',()=>(relUp('mama',-2),'Morgens trinken Mama und Papa sehr viel Kaffee.')]]);
QEV.m_wort=()=>E('Das erste Wort','Mama und Papa warten gespannt darauf, dass du dein erstes Wort sagst. Beide flüstern dir „ihren“ Namen vor.',()=>p.age<=3,[
  ['Sprechen üben (Minispiel)',playMini('wort','heim',w=>{p.word1=w;kmem('Mein erstes Wort: „'+w+'“');add('in',2);
    if(w==='Mama'){relUp('mama',10);return '„Mama!“ Mama weint vor Glück. Papa tut so, als wäre es ihm egal.'}if(w==='Papa'){relUp('papa',10);return '„Papa!“ Papa erzählt es jedem, auch dem Postboten.'}
    if(w==='Wauwau'){add('gl',4);return '„Wauwau!“ Der Nachbarshund ist offiziell dein Lieblingswesen.'}if(w==='Nein!'){add('gl',2);return '„Nein!“ Deine Eltern ahnen: Das wird eine spannende Zeit.'}return '„'+w+'!“ Niemand weiß, was es bedeutet, aber alle klatschen.'})],
  ['Lieber noch brabbeln',()=>'Brabbel, brabbel. Das erste Wort kommt ein andermal.']]);
QEV.m_krabbel=()=>E('Du krabbelst!','Nichts im Haus ist mehr sicher. Vor dir: eine offene Schranktür.',()=>p.age<=3,[['Topfdeckel ausräumen',()=>(add('gl',4),'Ein Konzert aus Deckeln. Die Nachbarn klopfen.')],['Zur Katze krabbeln',()=>(add('gl',3),kmem('Die Katze hat mich angeschnurrt'),'Die Katze lässt sich streicheln. Ein Moment für das Fotoalbum.')]]);
QEV.m_laufen=()=>E('Laufen lernen','Du stehst am Sofa, Mama hält die Arme auf. Drei Schritte trennen euch.',()=>p.age<=3,[
  ['Losgehen (Minispiel)',playMini('lauf','heim',s=>{p.walk1=p.age;kmem('Ich habe laufen gelernt');if(s>=2){add('ge',3);p.sk.form=Math.min(100,(p.sk.form||0)+3);relUp('mama',6);return 'Drei Schritte! Mama fängt dich auf und wirbelt dich herum. Fitness +3.'}if(s===1){add('ge',1);return 'Ein Schritt, dann Po-Landung. Morgen geht es weiter.'}return 'Plumps! Du lachst. Aufgeben ist keine Option.'})],
  ['Lieber krabbeln',()=>'Krabbeln ist auch schnell. Laufen lernst du später.']]);
QEV.m_brokkoli=()=>E('Brokkoli!','Papa hält dir ein Löffelchen Brokkoli hin. „Das ist ein kleiner Baum!“',()=>p.age<=4,[['Mutig probieren',()=>(add('ge',2),pg('mut'),'Hm. Gar nicht so schlecht! Papa ist stolz.')],['Gegen die Wand spucken',()=>(add('gl',3),pg('clown'),'Ein grüner Fleck an der Tapete. Er bleibt jahrelang da.')]]);
QEV.m_bau=()=>E('Bauklötze','Ein Eimer voller bunter Klötze. Wie hoch schaffst du es?',()=>p.age<=5,[
  ['Turm bauen (Minispiel)',playMini('bau','heim',h=>{add('in',Math.min(4,Math.ceil(h/2)));kmem('Mein Turm war '+h+' Klötze hoch');if(h>=6){pg('buch');return h+' Klötze! Ein echter Wolkenkratzer. Intelligenz +'+Math.min(4,Math.ceil(h/2))+'.'}return h+' Klötze, dann kracht es. Umwerfen ist sowieso das Beste.'})],
  ['Alles umwerfen',()=>(add('gl',4),pg('clown'),'KRACH! Das lustigste Geräusch der Welt.')]]);
QEV.m_haare=()=>E('Der erste Haarschnitt','Du sitzt auf Papas Schoß beim Friseur. Die Schere klappert.',()=>p.age<=5,[['Stillhalten',()=>(add('au',2),kmem('Mein erster Haarschnitt'),'Eine Locke kommt ins Fotoalbum.')],['Zappeln',()=>(add('gl',2),'Jetzt hast du einen sehr modernen Pony.')]]);
QEV.m_kita=()=>E('Kita-Start','Der erste Tag in der Kita. Mama muss gleich gehen.',()=>p.age<=6,[['Tapfer winken',()=>(pg('mut'),add('gl',3),kmem('Mein erster Kita-Tag'),'Nach fünf Minuten spielst du schon im Sandkasten.')],['An Mamas Bein klammern',()=>(relUp('mama',5),'Mama bleibt noch zehn Minuten. Dann geht es.')]]);
QEV.m_warum=()=>E('Die Warum-Phase','„Warum ist der Himmel blau?“, fragst du Papa zum zwanzigsten Mal heute.',()=>p.age<=6,[['Weiterfragen: „Warum?“',()=>(add('in',3),pg('buch'),'Papa holt ein Lexikon. Ihr lest zusammen bis zum Abendessen.')],['Selbst eine Antwort erfinden',()=>(add('gl',3),pg('clown'),'„Weil die Wolken ihn blau anmalen!“ Papa findet das eigentlich auch logisch.')]]);
QEV.k_schwimm=()=>E('Schwimmkurs','Das Becken ist tief, und der Schwimmlehrer pfeift.',()=>p.age<=8,[['Reinspringen',()=>(pg('mut'),p.sk.form=Math.min(100,(p.sk.form||0)+2),kmem('Seepferdchen geschafft'),'Seepferdchen! Das Abzeichen kommt auf die Badehose.')],
  ['Am Rand bleiben',()=>{if(!(p.pg&&p.pg.mut>=2)){p.fears=p.fears||{};p.fears.wasser=1}return 'Das Wasser bleibt dir unheimlich. Vielleicht für eine lange Zeit.'}]]);

/* ---------- Kindheitsentscheidungen ---------- */
function kmates(){if(!p.km){const mk=r=>{const g=pick(['w','m']);return {n:pick(g==='w'?FN:MN),g,rel:R(45,60),role:r,mem:[]}};p.km=[mk('bully'),mk('freund'),mk('neu'),mk('klasse')];p.km[0].rel=35}return p.km}
const km=r=>kmates().find(x=>x.role===r);
const kmRel=(m,v,t,s)=>{m.rel=clamp(m.rel+v,0,100);if(t)remember(m,t,s||0)};
QEV.k_spielplatz=()=>{const m=kmates()[0];return E('Ärger auf dem Spielplatz',m.n+' hat dich vor allen „Baby“ genannt und deine Schaufel weggenommen.',()=>p.age<16,[
  ['Zurückschubsen',()=>(pg('durch'),valAdd('h',-2),kmRel(m,-12,'Hat mich geschubst',-2),kmem('Ich habe '+m.n+' geschubst'),m.n+' landet im Sand und weint. Du bekommst Ärger, aber die Schaufel ist zurück.')],
  ['Der Erzieherin sagen',()=>(pg('regel'),valAdd('e',2),kmRel(m,-6,'Hat mich verpetzt',-1),kmem('Ich habe '+m.n+' verpetzt'),m.n+' muss sich entschuldigen. Die anderen Kinder nennen dich jetzt „Petze“.')],
  ['Mit '+m.n+' reden',()=>{pg('schlicht');p.flash=p.flash||{};p.flash.reden=1;if(ch(.6)){kmRel(m,25,'Hat mit mir geredet, als alle anderen mich doof fanden',3);m.role='freund2';kmem('Ich habe mit '+m.n+' geredet. Wir wurden Freunde.');return 'Ihr redet. '+m.n+' ist eigentlich nur traurig, weil zu Hause gestritten wird. Am Ende baut ihr zusammen eine Burg.'}kmRel(m,2);return m.n+' streckt dir die Zunge raus. Aber du hast es versucht.'}]])};
QEV.k_pause=()=>{const m=km('neu');return E('Kein Pausenbrot',m.n+' ist neu in der Klasse und hat kein Pausenbrot dabei.',()=>p.age<16,[
  ['Dein Brot teilen',()=>(pg('herz'),valAdd('h',3),kmRel(m,18,'Hat sein Brot mit mir geteilt',3),kmem('Ich habe mein Brot mit '+m.n+' geteilt'),m.n+' strahlt. Ab heute sitzt ihr zusammen.')],
  ['Nichts tun',()=>(kmRel(m,-2),'Du isst dein Brot. '+m.n+' schaut aus dem Fenster.')],['Mit den anderen lachen',()=>(valAdd('h',-3),pg('durch'),kmRel(m,-18,'Hat mich ausgelacht',-3),'Die anderen lachen mit. '+m.n+' wird das nie vergessen.')]])};
QEV.k_test=()=>{const m=km('klasse');return E('Abschreiben?',m.n+' flüstert in der Mathearbeit: „Lass mich abschreiben, bitte!“',()=>p.age>=7&&p.age<16,[
  ['Heft rüberschieben',()=>(pg('schlitz'),valAdd('e',-2),kmRel(m,10,'Hat mich abschreiben lassen',1),ch(.3)?(add('gl',-3),'Erwischt! Ihr bekommt beide eine Sechs.'):'Klappt. '+m.n+' schuldet dir was.')],
  ['Kopf schütteln',()=>(pg('regel'),valAdd('e',2),kmRel(m,-5),'„Spielverderber“, murmelt '+m.n+'.')],['Der Lehrerin melden',()=>(pg('regel'),kmRel(m,-14,'Hat mich verpetzt',-2),add('in',1),'Die Lehrerin lobt dich. In der Pause redet keiner mit dir.')]])};
QEV.k_fenster=()=>E('Das kaputte Fenster','Dein Fußball fliegt durch das Küchenfenster der Nachbarin. Klirr!',()=>p.age>=6&&p.age<16,[
  ['Klingeln und gestehen',()=>(pg('regel'),pg('mut'),valAdd('e',4),kmem('Ich habe das Fenster gestanden'),'Die Nachbarin ist erst sauer, dann gerührt. Du darfst ihr Unkraut jäten. Danach gibt es Kuchen.')],
  ['Weglaufen',()=>(pg('schlitz'),valAdd('e',-3),ch(.5)?'Niemand hat dich gesehen. Glaubst du.':(relUp('papa',-6),'Papa hat es von der Nachbarin erfahren. Hausarrest.'))],
  ['Einem anderen Kind die Schuld geben',()=>(pg('schlitz'),valAdd('e',-5),valAdd('h',-2),kmRel(kmates()[3],-15,'Hat mir die Schuld gegeben',-3),'Es klappt. Aber es fühlt sich nicht gut an.')]]);
QEV.k_mut=()=>E('Die Mutprobe','Die großen Kinder wollen, dass du vom Dreimeterbrett springst.',()=>p.age>=8&&p.age<16&&!(p.fears&&p.fears.wasser),[
  ['Springen',()=>(pg('mut'),add('gl',5),kmem('Ich bin vom Dreimeterbrett gesprungen'),'Arschbombe! Die Großen klatschen.')],['Nein sagen',()=>(pg('regel'),'„Feigling!“ Aber du weißt, was du willst.')],['Eine eigene, lustigere Mutprobe erfinden',()=>(pg('clown'),add('gl',4),'Alle müssen jetzt rückwärts die Treppe runter. Du bist der Held des Tages.')]]);
QEV.k_wallet=()=>E('Ein Geldbeutel!','Auf dem Gehweg liegt ein Geldbeutel. Darin: 50 € und ein Ausweis von „Frau Berger“.',()=>p.age>=7&&p.age<16,[
  ['Zurückbringen',()=>(valAdd('e',5),valAdd('h',2),p.walletGood=1,kmem('Ich habe Frau Berger ihren Geldbeutel zurückgebracht'),'Frau Berger ist Juristin und schenkt dir 10 € Finderlohn. „So ehrliche Kinder sind selten.“')],
  ['Das Geld behalten',()=>(p.money+=50,valAdd('e',-5),pg('schlitz'),'50 € für Süßigkeiten. Den Geldbeutel wirfst du in einen Briefkasten.')]]);
QEV.k_theater=()=>E('Theater-AG','Die Lehrerin sucht jemanden für die Hauptrolle im Schultheater.',()=>p.age>=7&&p.age<14,[
  ['Melden!',()=>{pg('mut');p.flash=p.flash||{};p.flash.theater=1;add('gl',5);p.sk.charme=Math.min(100,(p.sk.charme||0)+2);kmem('Ich habe die Hauptrolle gespielt');return 'Du stehst auf der Bühne, das Herz klopft. Am Ende: tosender Applaus.'}],
  ['Lieber Baum Nummer 3',()=>'Ein sehr überzeugender Baum. Niemand merkt, wie nervös du bist.']]);
QEV.k_klingel=()=>E('Klingelstreich','Deine Freunde wollen bei Herrn Krause klingeln und wegrennen.',()=>p.age>=7&&p.age<14,[['Mitmachen',()=>(pg('clown'),valAdd('r',2),add('gl',4),'Herr Krause schimpft hinter euch her. Ihr lacht bis zum Abendessen.')],['Nicht mitmachen',()=>(pg('regel'),'„Langweiler!“ Morgen spielen sie trotzdem wieder mit dir.')]]);
QEV.k_taschen=()=>E('Das erste Taschengeld','Papa gibt dir 5 € pro Woche. Was machst du damit?',()=>p.age>=6&&p.age<12,[['Ins Sparschwein',()=>(valAdd('a',2),p.money+=60,'Am Jahresende sind 60 € drin. Du fühlst dich reich.')],['Süßigkeiten!',()=>(add('gl',4),add('ge',-1),'Lakritz, Gummibärchen, Brausepulver. Ein sehr gutes Jahr.')]]);
QEV.k_haustier=()=>E('Darf ich einen Hund?','Du willst unbedingt einen Hund. Mama und Papa sind skeptisch.',()=>p.age>=6&&p.age<13,[['Mit Plan überzeugen',()=>ch(.35+avgPar()/250)?(add('gl',8),kmem('Wir haben einen Hund bekommen'),(p.pets||[]).length||(typeof PETS!=='undefined'&&PETS.hund?p.pets.push({t:'hund',n:pick(PETS.hund.names),age:0}):0),'Ja! Ihr holt einen Welpen aus dem Tierheim.'):(add('gl',-2),'„Wenn du größer bist.“ Der Klassiker.')],['Betteln und weinen',()=>(relUp('mama',-3),'Das hat nicht geklappt.')]]);

/* ---------- Prägungen ---------- */
const PRAG={schlicht:['Streitschlichter/in','Vor Gericht besser, Beziehungen halten länger'],durch:['Durchsetzungsstark','Vor Gericht und bei Bewerbungen etwas besser'],regel:['Regeltreu','Bei Polizei, Bank, Büro und JVA mehr Leistung'],
  mut:['Mutig','Bewerbungen besser, keine Angst vor Wasser'],herz:['Großes Herz','Nachbarn und Freunde mögen dich jedes Jahr mehr'],schlitz:['Schlitzohr','Charme +4'],clown:['Klassenclown','Charme +6, aber Intelligenz −3'],buch:['Bücherwurm','Intelligenz +6'],
  gestaerkt:['Gestärkt','Hat Schweres verarbeitet: Beziehungen und helfende Berufe profitieren']};
const hasPr=k=>(p.prag||[]).includes(k);
function pragFinal(){if(p.prag)return;const P=Object.entries(p.pg||{}).filter(x=>x[1]>=1).sort((a,b)=>b[1]-a[1]||Math.random()-.5).slice(0,2).map(x=>x[0]);p.prag=P;
  if(hasPr('schlitz'))p.sk.charme=Math.min(100,(p.sk.charme||0)+4);if(hasPr('clown')){p.sk.charme=Math.min(100,(p.sk.charme||0)+6);add('in',-3)}if(hasPr('buch'))add('in',6);if(hasPr('mut')&&p.fears)delete p.fears.wasser;
  if(P.length)log('Was dich geprägt hat: '+P.map(k=>PRAG[k][0]).join(', ')+'.')}
const pragJob=()=>(hasPr('mut')?.03:0)+(hasPr('durch')?.02:0)+((p.kmJob||0)===p.age?.15:0);
{const _c=court;court=function(c){c=Object.assign({},c);c.base+=(hasPr('schlicht')?.08:0)+(hasPr('durch')?.05:0);
  if(p.walletGood&&!p.walletUsed&&ch(.6)){p.walletUsed=1;c.base+=.3;toast('Die Richterin ist Frau Berger. Sie erinnert sich an den Geldbeutel von damals.')}return _c(c)}}

/* ---------- Kindheitsfreunde kommen zurück ---------- */
QEV.kmback=i=>{const m=(p.km||[])[i];if(!m||m.back)return null;m.back=1;const good=m.rel>=55,bad=m.rel<40,mem=(m.mem||[]).slice(-1)[0];
  const v=p.job?'job':!p.partner&&p.age<45&&!bad?'date':'nb';
  if(v==='job')return E('Ein bekanntes Gesicht',m.n+' ist jetzt Abteilungsleiter/in in deiner Firma. '+(good?'„Du? Wir waren doch zusammen in der Grundschule!“':bad?'Ein kurzer, kühler Blick. '+(mem?'„'+mem.t+'. Weißt du noch?“':''):'Ihr erkennt euch sofort.'),()=>!!p.job,[
    [good?'Über alte Zeiten reden':'Freundlich bleiben',()=>{if(good){p.job.pay=Math.round(p.job.pay*1.08);p.job.perf=Math.min(100,(p.job.perf||50)+8);return m.n+' setzt sich für dich ein. Gehalt +8 %. Kindheitsfreunde sind Gold wert.'}if(bad){p.job.perf=Math.max(0,(p.job.perf||50)-6);add('gl',-3);return m.n+' hat nichts vergessen. Deine Projekte werden plötzlich kritischer geprüft.'}p.job.perf=Math.min(100,(p.job.perf||50)+3);return 'Ein netter Plausch in der Kantine.'}],
    ...(bad?[['Dich für damals entschuldigen',()=>ch(.6)?(m.rel=60,p.job.perf=Math.min(100,(p.job.perf||50)+4),'„Das ist lange her. Danke, dass du das sagst.“ Das Eis ist gebrochen.'):'„Schon gut.“ Klingt nicht so.']]:[])]);
  if(v==='date')return E('Ein Wiedersehen',m.n+' sitzt im Café am Nebentisch. „'+p.first+'? Aus der Grundschule?“ Ihr lacht über alte Geschichten.',()=>!p.partner,[
    ['Nach einem Date fragen',()=>ch(good?.7:.4)?(p.partner={name:m.n,rel:good?72:58,mar:false},add('gl',10),kmem('Ich bin mit '+m.n+' zusammengekommen'),'Ihr seid zusammen! Wer hätte das auf dem Spielplatz gedacht.'):'„Lass uns lieber Freunde bleiben.“'],['Nummern austauschen',()=>(add('gl',3),'Ihr schreibt euch ab und zu.')]]);
  return E('Neue Nachbarn','In die Wohnung nebenan zieht '+m.n+'. Ihr kennt euch aus der Grundschule.',()=>true,[['Hallo sagen',()=>{nbSync();const o=p.nb[0];o.n=m.n;o.g=m.g;o.rel=clamp(m.rel+10,0,100);o.mem=(m.mem||[]).slice();o.b=0;return good?'Ihr umarmt euch. Was für ein Zufall!':bad?'Ihr nickt euch zu. Etwas angespannt.':'Ein nettes Wiedersehen.'}]])};
QEV.reunion=()=>{const M=kmates();M.forEach(m=>{if(!m.fate)m.fate=pick(['ist Ärztin/Arzt geworden','hat eine eigene Firma','ist Lehrer/in an eurer alten Schule','lebt in Australien','hat vier Kinder','ist Polizist/in','sucht gerade einen Job','ist Musiker/in','arbeitet bei der Bank'])});
  return E('Klassentreffen','Klassentreffen nach '+(p.age-10)+' Jahren! '+M.map(m=>m.n+' '+m.fate).join('. ')+'.',()=>true,[['Hingehen',()=>{add('gl',6);M.forEach(m=>m.rel=clamp(m.rel+5,0,100));const b=M[0];if(b&&b.rel<40&&ch(.5)){b.rel=55;return 'Ein lustiger Abend. Sogar '+b.n+' entschuldigt sich für damals auf dem Spielplatz.'}return 'Ein lustiger Abend voller „Weißt du noch?“.'}],['Absagen',()=>'Vielleicht beim nächsten Mal.']])};

/* ---------- Rückblenden ---------- */
{const _se=showEvent0;showEvent0=function(e){try{const sc=sceneOf(e),F=p.flash||{};p.flashY=p.flashY||{};let x=null;
  if(F.theater&&(sc==='buero'||sc==='schule')&&(p.age-(p.flashY.t||0))>=5){p.flashY.t=p.age;x=['✦ Rückblende: Mut wie damals in der Theater-AG',()=>{add('gl',5);if(p.job)p.job.perf=Math.min(100,(p.job.perf||50)+5);return 'Du denkst an die Bühne in der 3. Klasse. Das Herz klopft wie damals. Und genau wie damals klappt es.'}]}
  else if(F.reden&&(sc==='haus'||sc==='gericht'||sc==='liebe')&&(p.age-(p.flashY.r||0))>=5){p.flashY.r=p.age;x=['✦ Rückblende: Reden wie damals auf dem Spielplatz',()=>{add('gl',4);if(p.partner)p.partner.rel=clamp(p.partner.rel+5,0,100);(p.nb||[]).forEach(o=>o.rel=clamp(o.rel+5,0,100));return 'Du erinnerst dich an den Spielplatz. Reden hat damals geholfen. Es hilft auch heute.'}]}
  if(x&&p.age>=16)e=Object.assign({},e,{o:e.o.concat([x])})}catch(_){}return _se(e)}}

/* ---------- Ängste ---------- */
{const A=ACTS.urlaub,f=A.f;A.f=()=>{const r=f();if(r!==null&&p.fears&&p.fears.wasser){add('gl',-3);return r+' Ins Meer gehst du nicht. Die Angst vom Schwimmkurs ist noch da.'}return r}}

/* ---------- Seelische Last ---------- */
const LASTT={scheidung:['Die Trennung der Eltern','Mama und Papa streiten jeden Abend. Dann sagen sie es dir: Sie trennen sich.',18],oma:['Abschied von Oma','Oma ist gestorben. Gestern hat sie dir noch Pfannkuchen gemacht.',15],
  mobbing:['Mobbing','Seit Wochen lachen sie über dich, im Bus, in der Pause, im Klassenchat.',22],unfall:['Der Unfall','Ein Auto übersieht euch an der Kreuzung. Alle überleben, aber der Knall bleibt im Kopf.',20],
  brand:['Feuer!','Nachts piept der Rauchmelder. Ihr rennt raus. Das Kinderzimmer brennt aus.',25],sucht:['Papa trinkt','Papa trinkt zu viel. Zu Hause ist es oft laut, manchmal unheimlich.',25]};
const schutz=()=>(avgPar()>70?.7:1)*(relOf('freund')>70?.8:1)*((hasPr('mut')||hasPr('herz'))?.9:1)*(p.schutzG?.8:1);
function addLast(v){p.slast=clamp(Math.round((p.slast||0)+v),0,100)}
QEV.trauma=k=>{const T=LASTT[k];if(!T)return null;const first=!p.heavySeen;p.heavySeen=1;
  const e=E(T[0],T[1]+(first?' (Dieses Spiel enthält schwere Lebensereignisse. Du kannst sie in den Einstellungen abschalten.)':''),()=>heavyOn(),[
    ['Mit jemandem darüber reden',()=>{const who=avgPar()>=50?'mama':'freund';relUp(who,6);addLast(T[2]*schutz()*.6);kmem(T[0]);return (who==='mama'?'Mama':'Dein bester Freund')+' hört dir zu. Es tut immer noch weh, aber du bist nicht allein.'}],
    ['Alles in dich hineinfressen',()=>{addLast(T[2]*schutz()*1.2);kmem(T[0]);return 'Nach außen wirkst du stark. Innen ist es anders.'}]]);e.help=true;return e};
const AUSL={scheidung:'Ein lauter Streit im Nachbarhaus. Plötzlich bist du wieder acht und hörst deine Eltern.',oma:'Der Geruch von Pfannkuchen in einem Café. Dir kommen die Tränen.',
  mobbing:'Kollegen lachen, als du reinkommst. Wahrscheinlich nicht über dich. Trotzdem rast dein Herz.',unfall:'Quietschende Reifen an der Ampel. Deine Hände zittern.',brand:'Ein Rauchmelder piept. Herzrasen, kalter Schweiß.',sucht:'Jemand auf der Party trinkt zu viel. Du willst nur noch weg.'};
QEV.ausl=k=>{const e=E('Es kommt wieder hoch',AUSL[k]||'Etwas erinnert dich an früher. Die Gefühle von damals sind plötzlich da.',()=>heavyOn(),[
  ['Mit jemandem reden',()=>{relUp(p.partner?'partner':'freund',5);addLast(-3);return 'Es hilft, darüber zu sprechen.'}],['Runterschlucken',()=>(addLast(3),add('gl',-3),'Du funktionierst weiter. Aber es kostet Kraft.')],
  ['Zum Hausarzt gehen',()=>(p.ther=p.ther||{s:0,y:p.age+1},'Deine Hausärztin hört zu und überweist dich zur Psychotherapie. Ein Platz ist ab nächstem Jahr frei.')]]);e.help=true;return e};
QEV.krise=()=>{const e=E('Nichts geht mehr','Seit Wochen schläfst du kaum. Arbeit, Freunde, alles fühlt sich unendlich schwer an.',()=>heavyOn(),[
  ['In eine Klinik gehen',()=>{addLast(-22);p.ther=p.ther||{s:0,y:p.age};p.ther.y=p.age;if(p.job)p.job.perf=Math.max(0,(p.job.perf||50)-10);add('ge',4);return 'Acht Wochen Klinik. Ruhe, Gespräche, Struktur. Du kommst stabiler zurück und machst danach mit Therapie weiter.'}],
  ['Einen Freund anrufen',()=>{addLast(-8);relUp(p.partner?'partner':'freund',8);return (p.partner?p.partner.name:p.friend)+' kommt sofort vorbei. Ihr redet die halbe Nacht.'}],
  ['Weitermachen wie bisher',()=>{addLast(4);if(p.job&&ch(.4)){p.job=null;return 'Du schaffst es nicht mehr zur Arbeit. Der Job ist weg.'}if(p.partner)p.partner.rel=clamp(p.partner.rel-15,0,100);return 'Es geht irgendwie weiter. Aber dein Umfeld merkt, dass etwas nicht stimmt.'}]]);e.help=true;return e};
function lastYear(){if(!heavyOn()||!p.slast)return;
  if(p.medi)addLast(-4);if(p.ther&&p.ther.y<=p.age)p.ther.s=0;
  if(p.age<18)return;
  if(p.slast>=20){add('ge',-1);if(p.age%4===0)log('Du schläfst schlecht. Die Vergangenheit lässt dich nicht los.')}
  if(p.slast>=35){add('gl',-3);relUp('freund',-2)}
  const tags=p.trig||[];if(tags.length&&ch(Math.min(.35,p.slast/120)))p.q.push({id:'ausl',d:pick(tags)});
  else if(p.slast>=55&&ch(.3))p.q.push({id:'krise'})}
function lastCard(){if(!p.slast&&!p.ther&&!hasPr('gestaerkt'))return '';const L=p.slast||0,lock=!!p.prison,T=p.ther,open=T&&T.y<=p.age;
  return '<section class="card"><h2 class="h">Seelische Gesundheit</h2>'+(hasPr('gestaerkt')&&!L?'<p class="note">Du hast Schweres verarbeitet. Das hat dich gestärkt.</p>':
    '<div class="row"><span class="t">Seelische Last<small>'+(L>=55?'Sehr hoch. Hol dir bitte Hilfe.':L>=35?'Hoch. Gespräche oder Therapie helfen.':L>=20?'Spürbar, vor allem nachts.':'Leicht.')+'</small></span><b>'+L+'</b></div><div class="bar"><i class="low" style="width:'+L+'%"></i></div>'+
    '<div class="btns">'+(T?(open?btn('therapie',null,p.age<18?'Kinder- und Jugendtherapie · 1 Std.':'Therapiesitzung · 1 Std.','o',lock||(T.s||0)>=8):'<span class="note">Therapieplatz ab '+T.y+'</span>'):btn('hausarzt',null,p.age<18?'Mit '+parentN()+' zum Kinderarzt · 1 Std.':'Hausarzt-Gespräch · 1 Std.','o',lock))+(L>=45&&!p.medi&&p.age>=16?btn('psychiater',null,'Zum Psychiater','g',lock):'')+'</div>'+(p.medi?'<p class="note">Du nimmst Medikamente, die dich stabilisieren.</p>':'')+(T&&open?'<p class="note">Sitzungen dieses Jahr: '+(T.s||0)+' von 8</p>':''))+'</section>'+
    (p.fears&&p.fears.wasser&&p.age>=16?'<section class="card"><h2 class="h">Angst vor Wasser</h2><p class="note">Seit dem Schwimmkurs als Kind ist dir tiefes Wasser unheimlich.</p>'+btn('swimfix',null,'Schwimmkurs für Erwachsene · 1,5 Std. ('+(p.swimN||0)+'/3)','o',lock)+'</section>':'')}
function act18(id,arg){switch(id){
  case 'hausarzt':{if(p.ther||!spendTime(60))return 1;p.ther={s:0,y:p.age+1};done('Deine Hausärztin nimmt sich Zeit und überweist dich. Ein Therapieplatz ist ab nächstem Jahr frei.');return 1}
  case 'therapie':{const T=p.ther;if(!T||T.y>p.age||(T.s||0)>=8||!spendTime(60))return 1;T.s=(T.s||0)+1;addLast(-R(2,4));
    if(!p.slast){p.prag=p.prag||[];if(!p.prag.includes('gestaerkt'))p.prag.push('gestaerkt');p.ther=null;p.medi=0;add('gl',10);try{mile('Seelisch gestärkt','star')}catch(e){}done('Du hast es geschafft. Was damals war, gehört zu dir, aber es bestimmt dich nicht mehr.');return 1}
    done(pick(['Eine schwere Stunde. Danach bist du erschöpft, aber leichter.','Ihr sprecht über damals. Zum ersten Mal ohne Tränen.','Du lernst eine Atemübung gegen das Herzrasen.','Deine Therapeutin sagt: „Das war ein großer Schritt.“']));return 1}
  case 'psychiater':{if(p.medi||!spendTime(90))return 1;p.medi=1;addLast(-5);done('Der Psychiater verschreibt dir ein Medikament. Es dauert ein paar Wochen, dann wird es ruhiger in dir.');return 1}
  case 'swimfix':{if(!(p.fears&&p.fears.wasser)||!spendTime(90))return 1;p.swimN=(p.swimN||0)+1;if(p.swimN>=3){delete p.fears.wasser;add('gl',8);try{mile('Angst vor Wasser überwunden','star')}catch(e){}done('Du springst vom Beckenrand. Nach all den Jahren!');}else done('Stunde '+p.swimN+' von 3. Du traust dich schon bis zur Hüfte.');return 1}
}return 0}

/* ---------- Jahreslauf der Kindheit ---------- */
const MILE={1:['m_laecheln','m_zahn'],2:['m_wort','m_krabbel'],3:['m_laufen','m_brokkoli'],4:['m_bau','m_haare','m_kita'],5:['m_warum'],6:['k_schwimm']};
const KIDEV=['k_spielplatz','k_pause','k_test','k_fenster','k_mut','k_wallet','k_theater','k_klingel','k_taschen','k_haustier'];
function kidYear(){if(p.prison||p.kyA===p.age)return;p.kyA=p.age;if(p.age<16&&p.money<0)p.money=0;p.kseen=p.kseen||{};
  if(MILE[p.age])MILE[p.age].forEach(k=>{if(!p.kseen[k]){p.kseen[k]=1;p.q.push({id:k})}});
  if(p.age<6){p.cute=Math.max(0,100-p.age*18);relUp('mama',2);relUp('papa',2)}
  else if(!p.cuteDone){p.cuteDone=1;p.cute=0;const v=Math.round(avgPar()/5);p.sk.charme=Math.min(100,(p.sk.charme||0)+v);if(p.age<=8)log('Aus deiner Niedlichkeit wird Charme: +'+v+'.')}
  if(p.age>=4&&p.age<16&&ch(.85)){kmates();const L=KIDEV.filter(k=>!p.kseen[k]&&QEV[k]()&&QEV[k]().c());if(L.length){const k=pick(L);p.kseen[k]=1;p.q.push({id:k})}}
  if(p.age>=3&&p.age<16&&heavyOn()&&(p.hvN||0)<2&&ch(.06)){const L=Object.keys(LASTT).filter(k=>!(p.trig||[]).includes(k)&&(k!=='mobbing'||kmates()[0].rel<45));if(L.length){const k=pick(L);p.hvN=(p.hvN||0)+1;(p.trig=p.trig||[]).push(k);p.q.push({id:'trauma',d:k})}}
  if(p.age>=4&&p.age<16&&heavyOn()&&avgPar()<35)addLast(3);
  if(p.age===16)pragFinal();
  if(p.age>=20&&p.age<=60&&p.km&&ch(.08)){const i=p.km.findIndex(m=>!m.back);if(i>=0)p.q.push({id:'kmback',d:i})}
  if([30,40,50].includes(p.age)&&p.km)p.q.push({id:'reunion'});
  // Laufende Wirkungen der Prägungen
  if(p.age>=16){if(hasPr('schlicht')&&p.partner)p.partner.rel=clamp(p.partner.rel+2,0,100);if(hasPr('herz')){relUp('freund',2);(p.nb||[]).forEach(o=>o.rel=clamp(o.rel+2,0,100))}
    if(hasPr('regel')&&p.job&&['polizei','bankkfm','buero','waerter'].includes(p.job.id))p.job.perf=Math.min(100,(p.job.perf||50)+3);
    if(hasPr('gestaerkt')){relUp(p.partner?'partner':'freund',2);if(p.job&&['arzt','pflege','lehrer','sozial'].some(x=>p.job.id.includes(x)))p.job.perf=Math.min(100,(p.job.perf||50)+3)}}
  lastYear()}
{const _py=perkYear;perkYear=function(R0){_py(R0);try{kidYear()}catch(e){if(typeof console!=='undefined')console.log('kidYear',e)}}}
{const _ca=continueAs;continueAs=function(i){const prev=p,L=prev&&prev.slast||0,G=prev&&(prev.prag||[]).includes('gestaerkt');const r=_ca(i);if(p&&p!==prev){if(L>=30&&heavyOn())p.slast=(p.slast||0)+10;if(G)p.schutzG=1}return r}}

/* ---------- Anzeige im Leben-Bereich und im Tagebuch ---------- */
function kidCards(){let h='';if(p.age<6)h+='<section class="card cute"><h2 class="h">Niedlichkeit</h2><div class="bar"><i style="width:'+(p.cute==null?100:p.cute)+'%;background:linear-gradient(90deg,#FF8FB1,#F6C453)"></i></div><p class="note">Alle schmelzen dahin. Deine Familie mag dich jedes Jahr mehr. Mit 6 wird daraus Charme, je mehr Liebe du bekommst, desto mehr.</p></section>';
  if((p.prag||[]).length||(p.kmem||[]).length)h+='<section class="card"><h2 class="h">Was mich geprägt hat</h2>'+((p.prag||[]).length?'<div class="prag">'+p.prag.map(k=>'<div><b>'+PRAG[k][0]+'</b><small>'+PRAG[k][1]+'</small></div>').join('')+'</div>':'<p class="note">Mit 16 zeigt sich, was dich geprägt hat.</p>')+
    ((p.kmem||[]).length?'<ul class="kmem">'+p.kmem.slice(-6).map(m=>'<li><span>Mit '+m.a+'</span>'+esc(m.t)+'</li>').join('')+'</ul>':'')+'</section>';
  return h}
{const _vl=viewLeben;viewLeben=function(){return kidCards()+_vl()}}
{const _vd=viewDiary;viewDiary=function(){const h=_vd();const k=kidCards();const i=h.indexOf('</section>')+10;return h.slice(0,i)+k+h.slice(i)}}
{const _vf=viewFreizeit;if(typeof _vf==='function')viewFreizeit=function(){const h=_vf();return fTab==='gesund'?(h.replace(/(<\/section>)/,'$1'+lastCard())):h}}
{const _ve=viewEinst;viewEinst=function(){return _ve()+'<section class="card tgs"><h2 class="h">Inhalte</h2>'+tog('heavyOff',!!O.heavyOff,'Schwere Lebensereignisse aus','Keine Trennungen, Todesfälle, Unfälle oder seelischen Krisen')+'</section>'}}
