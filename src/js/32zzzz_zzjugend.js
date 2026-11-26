/* ================= Jede Phase zählt: Jugend-Entscheidungen, Lebensträume, Lebenslinie ================= */
/* ---------- Jugend: echte Entscheidungen zwischen 13 und 17 ---------- */
const JE=(t,x,o)=>EC('Jugend',t,x,o);
const JUG=[
 {id:'j_ausgeh',w:()=>p.age>=14&&p.age<=17&&!p.parentsGone?1.4:0,ev:()=>JE('Wann bist du zuhause?','Deine Freunde gehen heute bis Mitternacht weg. '+(ch(.5)?'Mama':'Papa')+' sagt: „Um zehn bist du zuhause. Punkt.“',[
   ['Verhandeln: halb zwölf, mit Anruf',()=>{if(ch(.6)){add('gl',4);relUp('mama',2);return 'Deal. Du rufst um elf an und darfst bleiben. Erwachsen fühlt sich gut an.'}return '„Zehn Uhr.“ Verhandlungen gescheitert.'}],
   ['Heimlich länger bleiben',()=>{add('gl',5);if(ch(.5)){relUp('mama',-8);relUp('papa',-8);skMerk('heimlich');return 'Erwischt. Zwei Wochen Hausarrest und ein sehr langes Gespräch.'}return 'Niemand merkt etwas. Diesmal.'}],
   ['Um zehn heimgehen',()=>{relUp('mama',4);relUp('papa',4);return 'Du verpasst den besten Teil des Abends. Sagen alle am nächsten Tag.'}]])},
 {id:'j_foto',w:()=>p.age>=13&&p.age<=16?1.1:0,ev:()=>JE('Das Foto','Im Klassenchat taucht ein peinliches Foto von dir auf. Mit Zahnspange und Schlafanzug. Alle lachen.',[
   ['Selbst darüber lachen',()=>{add('gl',2);addRuf(1);return 'Du schreibst: „Mein bester Look!“ Plötzlich lachen alle mit dir statt über dich.'}],
   ['Der Lehrerin melden',()=>{add('gl',-1);return 'Das Foto wird gelöscht. Wer es gepostet hat, muss sich entschuldigen.'}],
   ['Zurückschlagen',()=>{addRuf(-2);add('gl',1);return 'Du postest ein noch peinlicheres Foto. Der Krieg im Klassenchat dauert eine Woche.'}]])},
 {id:'j_sprecher',w:()=>p.age>=14&&p.age<=17&&!!p.school&&!p.jSpr?1:0,ev:()=>{p.jSpr=1;return JE('Schülersprecher/in?','Die Wahl zum Schülersprecher steht an. Deine Freunde sagen: „Du musst kandidieren!“',[
   ['Kandidieren',()=>{const ok=ch(.35+(p.sk&&p.sk.charme||0)/150+(p.clown||0)/300);if(ok){p.jSprW=1;addRuf(3);mile('Schülersprecher/in','star');return 'Gewählt! Deine erste Rede ist holprig, aber ehrlich.'}add('gl',-2);return 'Knapp verloren. Aber du hast Blut geleckt.'}],
   ['Lieber jemand anderen unterstützen',()=>{add('gl',2);return 'Du machst Wahlkampf für jemanden aus deiner Klasse. Und ihr gewinnt.'}]])}},
 {id:'j_praktikum',w:()=>p.age>=14&&p.age<=16&&!p.prak?1.2:0,ev:()=>JE('Das Schulpraktikum','Zwei Wochen Praktikum. Wohin?',[
   ['Krankenhaus',()=>{p.prak='pflege';add('in',1);return 'Du siehst, wie anstrengend und wichtig der Job ist. Eine Pflegerin sagt: „Du hast ein Händchen dafür.“'}],
   ['Autowerkstatt',()=>{p.prak='handwerk';if(p.sk)p.sk.fahren=Math.min(100,(p.sk.fahren||0)+3);return 'Ölverschmiert und glücklich. Du weißt jetzt, wie ein Motor von innen aussieht.'}],
   ['Büro einer Firma',()=>{p.prak='buero';add('in',2);return 'Viel Kaffee kochen, aber auch eine echte Präsentation. Der Chef ist beeindruckt.'}],
   ['Kita',()=>{p.prak='kita';add('gl',3);return 'Zwanzig Kinder, null Pause. Und trotzdem der schönste Job der Welt.'}]])},
 {id:'j_band',w:()=>p.age>=13&&p.age<=17&&!p.jBand?.9:0,ev:()=>{p.jBand=1;return JE('Eine Band gründen?','Zwei aus deiner Klasse gründen eine Band und suchen noch jemanden. „Kannst du singen? Egal, wir auch nicht.“',[
   ['Dabei sein',()=>{add('gl',6);const f=fkMake('der Schulband');f.tr='kreativ';f.d=0;f.cl=62;fkAdd(f);fkMem(f,'Eure Schulband im Probenkeller');mile('Erste Band','star');return 'Euer erster Auftritt beim Schulfest: drei Songs, zwei schief, alle jubeln.'}],
   ['Lieber nicht',()=>'Die Band wird nie berühmt. Vielleicht wegen dir. Vielleicht nicht.']])}},
 {id:'j_herz',w:()=>p.age>=14&&p.age<=17?.9:0,ev:()=>JE('Herz gebrochen','Die Person, in die du verliebt bist, ist jetzt mit jemand anderem zusammen. Es tut weh.',[
   ['Mit Freunden reden',()=>{add('gl',3);if(p.rel)relUp('freund',4);return 'Pizza, Eis und schlechte Filme. Deine Freunde sind die Besten.'}],
   ['Traurige Musik, ganz laut',()=>{add('gl',-1);return 'Drei Tage lang dieselbe Playlist. Dann geht es langsam besser.'}],
   ['Mit Mama oder Papa reden',()=>{add('gl',2);relUp('mama',4);return '„Weißt du, mir ist das damals auch passiert …“ Es hilft mehr, als du dachtest.'}]])},
 {id:'j_party',w:()=>p.age>=15&&p.age<=17&&!p.jParty?1:0,ev:()=>{p.jParty=1;return JE('Sturmfrei','Deine Eltern sind übers Wochenende weg. Deine Freunde: „Party bei dir?!“',[
   ['Kleine Party, nur Freunde',()=>{add('gl',7);if(ch(.25)){p.money-=px$(150);return 'Schöner Abend. Bis auf die zerbrochene Lieblingsvase. Du kaufst heimlich eine neue.'}return 'Ein legendärer Abend, und alles ist morgens wieder sauber.'}],
   ['Riesenparty',()=>{add('gl',8);if(ch(.6)){relUp('mama',-10);relUp('papa',-10);addRuf(-1);skMerk('party');return 'Die Nachbarn rufen die Polizei. Deine Eltern kommen früher zurück. Das wird teuer.'}return 'Die halbe Schule ist da. Du bist eine Legende.'}],
   ['Lieber nicht',()=>{relUp('mama',3);return 'Du schaust Filme. Ganz allein. Ganz entspannt.'}]])}},
 {id:'j_mobbing',w:()=>p.age>=13&&p.age<=16&&!p.jMob?1:0,ev:()=>{p.jMob=1;const n=pick(FN.concat(MN));return JE('Auf dem Schulhof',n+' aus der Parallelklasse wird jeden Tag geschubst und ausgelacht. Heute schon wieder.',[
   ['Dazwischengehen',()=>{addRuf(3);add('gl',2);skMerk('mutig',{n});return 'Du stellst dich daneben. Die anderen ziehen ab. '+n+' nickt dir leise zu.'}],
   ['Einen Lehrer holen',()=>{addRuf(1);skMerk('mutig',{n});return 'Die Schule greift durch. Langsam wird es besser für '+n+'.'}],
   ['Wegschauen',()=>{add('gl',-2);return 'Du gehst weiter. Das Bild bleibt in deinem Kopf.'}]])}},
 {id:'j_roller',w:()=>p.age===15||p.age===16?.8:0,ev:()=>JE('Ein eigener Roller','Alle fahren plötzlich Roller. Der Führerschein dafür kostet '+eur(px$(600))+', der Roller noch mehr.',[
   ['Nebenjob und sparen',()=>{if(!p.job)p.money+=px$(400);add('gl',4);return 'Ein Jahr Zeitung austragen. Dann knatterst du stolz zur Schule.'}],
   ['Die Eltern fragen',()=>ch(.4)?(add('gl',5),'Sie sagen Ja! Mit Helm und tausend Regeln.'):(add('gl',-2),'„Viel zu gefährlich.“ Diskussion beendet.')],
   ['Fahrrad tut’s auch',()=>{add('ge',2);return 'Du bist der fitteste Mensch der Klasse.'}]])},
 {id:'j_zukunft',w:()=>p.age===16||p.age===17?1.2:0,ev:()=>JE('Und nach der Schule?','Beim Abendessen fragt deine Familie: „Weißt du schon, was du nach der Schule machen willst?“',[
   ['Studieren',()=>{p.plan='studium';add('in',1);return 'Alle nicken zufrieden. Du fragst dich nur noch: was eigentlich?'}],
   ['Eine Ausbildung',()=>{p.plan='ausbildung';return '„Etwas Handfestes“, sagt Papa. Er klingt stolz.'}],
   ['Erst mal die Welt sehen',()=>{p.plan='reise';add('gl',3);return 'Ein Jahr Work and Travel. Deine Mutter seufzt. Deine Oma findet es großartig.'}],
   ['Keine Ahnung',()=>'Das ist auch okay. Viele wissen es mit 30 noch nicht.']])}];
JUG.forEach(s=>{s.cat='Jugend';s.cd=99;SK.push(s);QEV['sk_'+s.id]=()=>{try{return s.w()>0?s.ev():null}catch(e){errLog(e,s.id);return null}}});
/* Wer als Jugendliche/r mutig war, wird nicht vergessen */
const JSP={id:'sp_mutig',w:()=>skMem('mutig',15).length&&!p.cs2_mut&&p.age>=28?1.5:0,ev:()=>{p.cs2_mut=1;const n=(skMem('mutig')[0].d||{}).n||'Jemand';return EC('Spätfolge','Ein Dank nach vielen Jahren',n+' spricht dich auf einer Feier an: „Du warst damals auf dem Schulhof die einzige Person, die etwas gemacht hat. Das habe ich nie vergessen.“',[
  ['Gerührt sein',()=>{add('gl',8);addRuf(2);const f=fkMake('der Schulzeit');f.n=n;f.d=0;f.cl=58;fkAdd(f);fkMem(f,'Du hast '+n+' auf dem Schulhof beigestanden');return n+' ist heute ein guter Freund.'}]],'Damals auf dem Schulhof')}};
SPAET.push(JSP);QEV['sk_sp_mutig']=()=>{try{return JSP.w()>0?JSP.ev():null}catch(e){errLog(e,'sp_mutig');return null}};
/* Praktikum und Schülersprecher wirken später */
{const _jm=jobMkt;jobMkt=function(){let b=_jm();try{if(p.prak&&p.age<30)b+=.03}catch(e){errLog(e)}return b}}
/* ---------- Lebensträume ---------- */
const DREAMS={eigenheim:['Ein eigenes Zuhause',()=>(p.props||[]).some(x=>x.use==='self')],million:['Millionär/in werden',()=>netWorth()>=1e6],familie:['Eine große Familie',()=>(p.kids||[]).length>=3],
  welt:['Die Welt bereisen',()=>(p.ms||[]).some(m=>/Weltreise|Sabbatjahr|Kreuzfahrt|Work and Travel/.test(m.t))],firma:['Eine eigene Firma',()=>!!(p.biz&&(p.biz.firm||(p.biz.fronts||[]).length))],
  berühmt:['Berühmt werden',()=>!!(p.sm&&p.sm.fol>=1e5)||!!p.ach.star],stadt:['Die Stadt verändern',()=>!!(p.pol&&p.pol.lvl>=2)],studium:['Ein Studium schaffen',()=>!!p.deg],
  fit:['Topfit sein',()=>!!(p.sk&&p.sk.form>=70)],tier:['Einen Hund haben',()=>(p.pets||[]).some(x=>x.t==='hund')],liebe:['Die große Liebe heiraten',()=>!!(p.partner&&p.partner.mar)],
  alt:['Steinalt werden',()=>p.age>=90],vorbild:['Ein Vorbild sein',()=>(p.ruf||0)>=60],flug:['Ein Flugzeug fliegen',()=>!!(p.lic&&p.lic.flug&&p.lic.flug.ok)],
  buch:['Ein Buch schreiben',()=>!!(p.alt&&p.alt.memo>=4)],freunde:['Freunde fürs Leben',()=>fkList().filter(f=>f.cl>=60).length>=3]};
const drS=()=>(p.dr=p.dr||{pick:[],done:{}});
function dreamYear(){if(!p||p.prison)return;const D=drS();if(p.age===16&&!D.ask&&!D.pick.length){D.ask=1;p.q.push({id:'dr_ask'})}
  D.pick.forEach(k=>{if(D.done[k]||!DREAMS[k])return;let ok=false;try{ok=DREAMS[k][1]()}catch(e){errLog(e,'dream')}if(ok){D.done[k]=p.age;add('gl',10);mile('Traum erfüllt: '+DREAMS[k][0],'big');toast('Traum erfüllt: '+DREAMS[k][0])}})}
QEV.dr_ask=()=>E('Wovon träumst du?','Mit 16 liegst du nachts wach und denkst: Was will ich eigentlich aus meinem Leben machen?',()=>true,[
  ['Träume aufschreiben',()=>{setTimeout(()=>{try{lTab='ziele';act('goto','leben')}catch(e){errLog(e)}},300);return 'Wähle unter Leben > Ziele bis zu drei Lebensträume.'}],['Später',()=>'Du kannst deine Träume jederzeit unter Leben > Ziele wählen.']]);
{const _py=perkYear;perkYear=function(R0){_py(R0);try{dreamYear()}catch(e){errLog(e,'dreamYear')}}}
{const f=act;act=function(id,arg){if(id==='po_join'&&p&&p.jSprW&&!p.pol){const r=f(id,arg);if(p.pol){p.pol.pop=clamp(p.pol.pop+8,0,100);toast('Als ehemalige/r Schülersprecher/in startest du mit Rückenwind.')}return r}
  if(id==='dream'){const D=drS();if(!DREAMS[arg]||D.done[arg])return;const i=D.pick.indexOf(arg);if(i>=0)D.pick.splice(i,1);else{if(D.pick.length>=3){toast('Höchstens drei Träume gleichzeitig.');return}D.pick.push(arg)}dreamYear();save();render();return}return f(id,arg)}}
function dreamCard(){if(p.age<12)return '';const D=drS();const got=Object.keys(D.done).length;
  return '<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Deine Träume</h2><span class="chip">'+got+' erfüllt</span></div><p class="note">Wähle bis zu drei Lebensträume. Erfüllte Träume erscheinen im Lebensfilm.</p><div class="pth">'+
    Object.entries(DREAMS).map(([k,[n]])=>{const on=D.pick.includes(k),dn=D.done[k];return '<button data-a="dream" data-g="'+k+'" aria-pressed="'+(on||!!dn)+'" style="--pc:'+(dn?'#3BB273':'#8E63D6')+'"'+(dn?' disabled':'')+'>'+(dn?'✓ ':'')+n+'</button>'}).join('')+'</div></section>'}
{const _vl=viewLeben;viewLeben=function(){const h=_vl();if(lTab!=='ziele')return h;const i=h.indexOf('<section');return i>=0?h.slice(0,i)+dreamCard()+h.slice(i):h+dreamCard()}}
{const _fs=filmScenes;filmScenes=function(){const S=_fs.apply(this,arguments);try{const D=p.dr;if(D&&Object.keys(D.done).length){const sc='<div class="lfs" style="--sc:#3BB273"><small class="lfk">Erfüllte Träume</small><div class="lftl">'+Object.entries(D.done).map(([k,a])=>'<div><span>'+a+'</span><b>'+esc(DREAMS[k]?DREAMS[k][0]:k)+'</b></div>').join('')+'</div></div>';const i=S.findIndex(s=>s.includes('lfend'));S.splice(i<0?S.length:i,0,sc)}}catch(e){errLog(e,'film')}return S}}
/* ---------- Lebenslinie: dein Leben auf einen Blick ---------- */
function lifeLine(){if(!p||p.age<2)return '';const M=(p.ms||[]).filter(m=>m.k==='big'||m.k==='star').slice(-7);if(M.length<2)return '';
  const st=[{a:0,t:'Geburt'}].concat(M).concat([{a:p.age,t:'Heute',now:1}]);
  return '<section class="card llc"><div class="listseg"><b>Deine Lebenslinie</b><button class="lnk" data-a="llopen">Lebenslauf</button></div><div class="ll" role="list">'+st.map(s=>'<div class="lls'+(s.now?' now':'')+'" role="listitem"><i></i><b>'+s.a+'</b><em>'+(calEns(),p.cy0+s.a)+'</em><small>'+esc(s.t)+'</small></div>').join('')+'</div></section>'}
{const f=act;act=function(id,arg){if(id==='llopen'){lTab='lauf';act('goto','leben');return}return f(id,arg)}}
{const _vh=viewHome;viewHome=function(){let h=_vh();try{const L=lifeLine();if(!L)return h;const i=h.indexOf('<div class="today">');if(i>=0)return h.slice(0,i)+L.replace('<section class="card llc">','<div class="llc in">').replace(/<\/section>$/,'</div>')+h.slice(i);const j=h.indexOf('<section');return j>=0?h.slice(0,j)+L+h.slice(j):h+L}catch(e){errLog(e,'lebenslinie');return h}}}
{const _rn=render;render=function(){const r=_rn.apply(this,arguments);try{if(!noDom())document.querySelectorAll('.ll').forEach(l=>{l.scrollLeft=l.scrollWidth})}catch(e){errLog(e,'ll')}return r}}
