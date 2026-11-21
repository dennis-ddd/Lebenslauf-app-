/* ================= Minispiele ================= */
const eur2=v=>v.toFixed(2).replace('.',',')+' €';
const QZ=[['Wie viele Bundesländer hat Deutschland?','16','14','18'],['Welcher Planet ist der Sonne am nächsten?','Merkur','Venus','Mars'],['Wie viele Minuten hat ein Tag?','1.440','1.240','2.400'],['Hauptstadt von Spanien?','Madrid','Barcelona','Sevilla'],
 ['Wer schrieb „Faust“?','Goethe','Schiller','Kafka'],['Wie viele Seiten hat ein Sechseck?','6','5','8'],['Chemisches Zeichen für Gold?','Au','Ag','Go'],['Größter Ozean der Erde?','Pazifik','Atlantik','Indischer Ozean'],
 ['Wie viele Spieler hat eine Fußballmannschaft auf dem Feld?','11','10','12'],['Welches Tier ist ein Säugetier?','Wal','Hai','Thunfisch'],['In welchem Jahr fiel die Berliner Mauer?','1989','1991','1985'],['Wie heißt der längste Fluss Deutschlands?','Rhein','Elbe','Donau'],
 ['Was ist 15 % von 200?','30','25','35'],['Wie viele Knochen hat ein erwachsener Mensch etwa?','206','150','312'],['Wer malte die Mona Lisa?','Leonardo da Vinci','Michelangelo','Raffael'],['Welche Farbe entsteht aus Blau und Gelb?','Grün','Lila','Orange'],
 ['Hauptstadt von Australien?','Canberra','Sydney','Melbourne'],['Wie viele Kontinente gibt es?','7','5','6'],['Was misst ein Thermometer?','Temperatur','Luftdruck','Feuchtigkeit'],['Wie viele Bytes hat ein Kilobyte (klassisch)?','1.024','1.000','512'],
 ['Höchster Berg Deutschlands?','Zugspitze','Watzmann','Brocken'],['Wie heißt das Grundgesetz-Organ, das Gesetze beschließt?','Bundestag','Bundesrat','Kanzleramt'],['Welches Gas atmen Pflanzen bei Licht aus?','Sauerstoff','Stickstoff','Kohlendioxid'],
 ['Wie viele Ecken hat ein Würfel?','8','6','12'],['Was ist die Wurzel aus 144?','12','14','11'],['Welche Sprache hat die meisten Muttersprachler?','Chinesisch','Englisch','Spanisch'],['Wer entwickelte die Relativitätstheorie?','Albert Einstein','Isaac Newton','Max Planck'],
 ['Wie viele Tage hat ein Schaltjahr?','366','365','364'],['Hauptstadt von Kanada?','Ottawa','Toronto','Vancouver'],['Wie heißt der Mond der Erde auf Latein?','Luna','Sol','Terra']];
const DG=[['Fieber, Husten, Gliederschmerzen seit zwei Tagen.','Grippe','Sonnenbrand','Heuschnupfen'],['Juckende Augen und Niesen, immer im Frühling.','Heuschnupfen','Grippe','Migräne'],['Pochender Schmerz auf einer Kopfseite, lichtempfindlich.','Migräne','Mandelentzündung','Gastritis'],
 ['Rechts unten im Bauch starke Schmerzen, Fieber.','Blinddarmentzündung','Erkältung','Sodbrennen'],['Knöchel nach Sturz geschwollen und blau.','Verstauchung','Allergie','Grippe'],['Halsschmerzen, weiße Beläge auf den Mandeln.','Mandelentzündung','Migräne','Bronchitis'],
 ['Brennen hinter dem Brustbein nach dem Essen.','Sodbrennen','Herzinfarkt sicher','Heuschnupfen'],['Rote, juckende Quaddeln nach Erdbeeren.','Allergie','Masern','Sonnenstich'],['Durst, häufiges Wasserlassen, Müdigkeit.','Diabetes prüfen','Erkältung','Verstauchung']];
const AU=[['Es quietscht beim Bremsen.','Bremsbeläge','Zündkerzen','Scheibenwischer'],['Der Motor springt nicht an, es klickt nur.','Batterie','Reifen','Auspuff'],['Das Auto zieht beim Fahren nach links.','Spur/Reifendruck','Ölfilter','Hupe'],
 ['Blauer Rauch aus dem Auspuff.','Motor verbrennt Öl','Zu viel Wasser','Leerer Tank'],['Die Lenkung ist schwer geworden.','Servolenkung','Radio','Kofferraum'],['Warnlampe: Öl!','Ölstand prüfen','Reifen wechseln','Licht putzen']];
const FG=[['Kundin will neue Haare. Was zuerst?','Haare waschen','Föhnen','Färben ohne Beratung'],['Kunde sitzt frisch gewaschen. Als Nächstes?','Schneiden','Föhnen','Kassieren'],['Schnitzel. Was zuerst?','Fleisch klopfen','Panieren','Braten'],
 ['Paniert ist das Schnitzel. Als Nächstes?','In heißem Fett braten','Klopfen','Würzen mit Zucker'],['Spaghetti. Was zuerst?','Wasser salzen und kochen','Nudeln in kaltes Wasser','Soße ins Wasser'],['Risotto. Was zuerst?','Zwiebeln andünsten','Reis kochen wie Nudeln','Parmesan zuerst']];
const KD=[['Das Kind will um 23 Uhr noch Süßigkeiten.','Freundlich Nein sagen, Zähne putzen','Ganze Tüte geben','Eltern anrufen und petzen'],['Das Kind ist hingefallen und weint.','Trösten und Pflaster','Ignorieren','Schimpfen'],
 ['Das Kind langweilt sich.','Zusammen etwas basteln','Den ganzen Abend Handy','Ins Bett schicken'],['Das Kind hat Fieber.','Eltern informieren','Eis essen gehen','Nichts tun']];
const STR=[['Zwei Männer streiten laut vor einer Kneipe.','Ruhig ansprechen und trennen','Sofort Handschellen','Wegschauen'],['Ein Auto parkt in der Feuerwehrzufahrt.','Halter ermitteln, Abschleppen','Reifen zerstechen','Ignorieren'],
 ['Ein Kind hat seine Eltern im Kaufhaus verloren.','Ausrufen lassen und beruhigen','Allein suchen lassen','Mitnehmen zur Wache sofort'],['Ein Autofahrer ist auffällig in Schlangenlinien unterwegs.','Anhalten und kontrollieren','Hinterherhupen','Nichts tun']];
const bank=B=>()=>{const x=pick(B);return {q:x[0],o:[[x[1],1],[x[2],0],[x[3],0]]}};
const MG={rechnen:()=>{const a=R(3,14),b=R(2,12),op=pick(['+','×','−']),r=op==='+'?a+b:op==='×'?a*b:a-b;return {q:'Schnell! '+a+' '+op+' '+b+' = ?',o:[[String(r),1],[String(r+R(1,4)),0],[String(r-R(1,5)),0]]}},
 wechsel:()=>{const pr=R(1,48)+R(0,19)*.05,pay=[5,10,20,50].find(v=>v>pr)||50,c=+(pay-pr).toFixed(2);return {q:'Rechnung '+eur2(pr)+'. Gegeben: '+pay+' €. Wie viel Rückgeld?',o:[[eur2(c),1],[eur2(c+R(1,4)*.5),0],[eur2(Math.max(.05,c-R(1,3)*.1)),0]]}},
 sort:()=>{const L='ABCDEF',a=L[R(0,5)],n=R(1,9),w=()=>{let x;do{x=L[R(0,5)]+R(1,9)}while(x===a+n);return x};return {pre:'Das Paket gehört in Regal '+a+n+'.',q:'In welches Regal gehört das Paket?',o:[[a+n,1],[w(),0],[w(),0]]}},
 logik:()=>{const t=R(0,2),a=R(1,9),d=R(2,7);let s;if(t===0)s=[a,a+d,a+2*d,a+3*d,a+4*d];else if(t===1)s=[a,a*2,a*4,a*8,a*16];else s=[a,a+d,a+d+1,a+2*d+1,a+2*d+2];const r=s[4];
   return {q:'Wie geht die Reihe weiter? '+s.slice(0,4).join(', ')+', …',o:[[String(r),1],[String(r+R(1,3)),0],[String(r-R(1,3)),0]]}},
 quiz:bank(QZ),diag:bank(DG),auto:bank(AU),folge:bank(FG),kind:bank(KD),streit:bank(STR)};
const MGN={rechnen:['Kopfrechnen','Rechne schnell und richtig.'],wechsel:['Wechselgeld','Gib das richtige Rückgeld heraus.'],sort:['Sortieren','Merk dir das Regal und sortiere richtig ein.'],reakt:['Reaktion','Drück Stopp, wenn der Punkt im grünen Feld ist.'],
 logik:['Logik','Finde die nächste Zahl der Reihe.'],quiz:['Wissensquiz','Beantworte die Fragen.'],diag:['Diagnose','Welche Erkrankung passt zu den Beschwerden?'],auto:['Werkstatt','Finde den Fehler am Auto.'],
 folge:['Arbeitsschritte','Was kommt als Nächstes?'],kind:['Kinder hüten','Wie reagierst du richtig?'],streit:['Streifendienst','Was ist die richtige Maßnahme?']};
const JOBMG={zeitung:'sort',baby:'kind',cafe:'wechsel',kellner:'wechsel',kasse:'wechsel',lager:'sort',paket:'sort',bus:'reakt',friseur:'folge',koch:'folge',buero:'logik',mecha:'auto',pflege:'diag',bankkfm:'rechnen',polizei:'streit',pilot:'reakt',lehrer:'quiz',architekt:'logik',info:'logik',jura:'quiz',arzt:'diag',profi:'reakt',sport:'reakt',berater:'logik',pol:'quiz'};
function reactRound(title,cb){const d=document.getElementById('dlg'),m=document.getElementById('modal');d.className='dlg';const x=R(15,62),w=R(15,22);
  d.innerHTML='<h2>'+esc(title)+'</h2><p>Drück Stopp, wenn der Punkt im grünen Feld ist.</p><div class="rbar"><i class="rz" style="left:'+x+'%;width:'+w+'%"></i><b class="rm" id="rm"></b></div><div class="ch"><button class="btn o" id="rstop">Stopp!</button></div>';m.classList.add('on');
  let pos=0,dir=1;const sp=1.5+Math.random()*1.5,mk=d.querySelector('#rm'),iv=setInterval(()=>{pos+=dir*sp;if(pos>=100){pos=100;dir=-1}if(pos<=0){pos=0;dir=1}if(mk&&mk.style)mk.style.left=pos+'%'},16);
  const b=d.querySelector('#rstop');if(b){b.onclick=()=>{clearInterval(iv);m.classList.remove('on');const ok=pos>=x&&pos<=x+w;sfx(ok?'coin':'bad');cb(ok)};if(b.focus)b.focus()}}
function playMG(type,n,title,cb){let sc=0,i=0;
  const step=()=>{if(i>=n){cb(sc,false);return}i++;const tt=title+' · '+i+' von '+n;
    if(type==='reakt'){reactRound(tt,ok=>{if(ok)sc++;step()});return}
    const g=MG[type](),ask=()=>dialog(tt,g.q,shuffle(g.o.slice()).map(([l,ok])=>[l,()=>{if(ok){sc++;sfx('coin')}else sfx('bad');step()}]));
    if(g.pre)dialog(tt,'Merke dir: '+g.pre,[['Gemerkt',ask]]);else ask()};
  step()}
const autoMG=(n,v)=>{let s=0;for(let i=0;i<n;i++)if(ch(.35+v/250))s++;return s};
function mgStart(type,n,title,cb,v){const auto=()=>cb(autoMG(n,v==null?p.st.in:v),true);
  if(O.mini==='skip')return auto();if(O.mini==='play')return playMG(type,n,title,cb);
  dialog(title,MGN[type][1]+' Du kannst spielen oder überspringen. Überspringen nimmt dein Ergebnis aus deinen Werten.',[['Spielen',()=>playMG(type,n,title,cb)],['Überspringen',auto]])}
function shift(){
  if(!p.job||p.prison||!useAct())return;const ty=JOBMG[p.job.id]||'rechnen';
  mgStart(ty,3,'Schicht: '+MGN[ty][0],(sc,auto)=>{const d=sc*10-10;p.job.perf=clamp(p.job.perf+d,0,100);const bonus=sc*Math.round(p.job.pay/400);p.money+=bonus;if(sc===3)add('gl',3);if(bonus)sfx('coin');
    const t='Schicht als '+p.job.t+(auto?' (übersprungen)':'')+': '+sc+' von 3 richtig. '+(bonus?'Bonus '+eur(bonus)+'. ':'')+'Leistung '+(d>=0?'+':'')+d+'.';log(t);save();render();dialog('Schicht beendet',t,[['Weiter',null]])},ty==='reakt'?p.sk.fahren/2+p.st.ge/2:p.st.in);
}

