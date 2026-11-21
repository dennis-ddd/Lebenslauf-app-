/* ================= Schule und Studium ================= */
RANK.Hauptschule=.5;STUDY.BWL=4;JOBS.push({id:'berater',t:'Unternehmensberater/in',pay:72000,min:22,deg:'BWL'});
const SUBJ={ma:'Mathe',de:'Deutsch',en:'Englisch',sp:'Sport'};
const fmtN=x=>x.toFixed(1).replace('.',',');
function gradesYear(){if(!p.school||p.age<7)return;const b=1+(100-p.st.in)/26-Math.min(.9,(p.lernN||0)*.3)+(p.skipN||0)*.35;
  const g={ma:b+(Math.random()-.5)*1.2,de:b+(Math.random()-.5)*1,en:b+(Math.random()-.5)*1.2,sp:1+(100-p.sk.form)/28+(Math.random()-.5)};
  Object.keys(g).forEach(k=>g[k]=clamp(Math.round(g[k]*2)/2,1,6));g.avg=(g.ma+g.de+g.en+g.sp)/4;g.a=p.age;p.gr=g;
  log('Zeugnis: Durchschnitt '+fmtN(g.avg)+'.');
  if(g.avg>4.2&&(p.rep||0)<2&&p.age>=8&&ch(.55)){p.rep=(p.rep||0)+1;add('gl',-8);log('Du bleibst sitzen und musst das Jahr wiederholen.');if(!p.parentsGone)msg('mama','Sitzengeblieben?! Wir reden heute Abend.')}
  else if(g.avg<=1.5){add('gl',4);if(!p.parentsGone&&ch(.6))msg('papa','Was für ein Zeugnis! Ich bin so stolz.')}}
function schoolAge(a){const r=p.rep||0;
  if(p.school==='Hauptschule'&&a>=15+r){p.school=null;p.edu='Hauptschule';log('Hauptschulabschluss geschafft.');mile('Hauptschulabschluss','star')}
  if(p.school==='Gymnasium'&&a>=18+r&&p.gr&&p.gr.avg>4){p.school=null;p.edu='Realschule';add('gl',-10);log('Das Abitur ist nicht bestanden. Du gehst mit dem Realschulabschluss ab.')}}
function zeugnis(){const g=p.gr;return '<div class="mt">Zeugnis</div><div class="zgn">'+Object.keys(SUBJ).map(k=>'<span><small>'+SUBJ[k]+'</small><b class="'+(g[k]<=2?'up':g[k]>=4.5?'down':'')+'">'+fmtN(g[k])+'</b></span>').join('')+'<span class="avg"><small>Schnitt</small><b>'+fmtN(g.avg)+'</b></span></div>'}
function studyYear(R0){if(p.study&&p.study.kr){const k=px$(8000);p.money+=k;p.sdebt=(p.sdebt||0)+k;R0.inc.push(['Studienkredit (BAföG)',k])}
  if(p.study&&p.study.ex!==p.age-1&&p.study.ex!==p.age){const s=autoMG(3,p.st.in);p.study.sc=(p.study.sc||[]).concat([s])}
  if(!p.study&&p.sdebt>0){const half=Math.round(p.sdebt/2);ensureEcon();p.loans.push(mkLoan(half,0,10));log('Dein Studienkredit muss zurückgezahlt werden: '+eur(half)+' in 10 Jahren, die Hälfte ist erlassen.');p.sdebt=0}
  if(p.deg&&p.dnote==null&&p.lastSc){const av=p.lastSc.reduce((s,x)=>s+x,0)/p.lastSc.length;p.dnote=clamp(1+(3-av)*1.1,1,4);log('Abschlussnote '+p.deg+': '+fmtN(p.dnote)+'.')}
  if(p.study)p.lastSc=p.study.sc||[]}
function viewBildung(){let h='';
  h+='<section class="card"><h2 class="h">Abschluss</h2>'+row(p.edu==='keine'?'noch keiner':p.edu,(p.aus?'Ausbildung · ':'')+(p.deg?'Studium '+p.deg+(p.dnote?' (Note '+fmtN(p.dnote)+')':''):(p.school?p.school+(p.rep?' · '+p.rep+'× sitzengeblieben':''):'')))+(p.gr&&p.school?zeugnis():'')+'</section>';
  if(p.school)h+=card('Schulalltag',actRows(['lernen','schwaenzen'])+row('Klassensprecher/in','ab 12 Jahren · Charme und Ruf +',p.sprecher?'<span class="chip">Gewählt</span>':btn('sprecher',null,'Kandidieren','o',p.age<12||p.act<=0||p.sprY===p.age))+'<p class="note" style="margin-top:6px">Lernen verbessert das nächste Zeugnis, Schwänzen verschlechtert es. Ab Schnitt 4,3 droht Sitzenbleiben.</p>');
  else if(p.age<30)h+=card('Lernen',actRows(['lernen']));
  if(p.study){const sc=p.study.sc||[];h+='<section class="card"><h2 class="h">Studium '+p.study.f+'</h2>'+row('Noch '+p.study.left+' Jahr(e)','Prüfungen bisher: '+(sc.length?sc.map(s=>s+'/3').join(', '):'keine'))+
    row('Semesterprüfung','Einmal im Jahr, kostet keine Aktion',p.study.ex===p.age?'<span class="chip">Erledigt</span>':btn('exam',null,'Antreten','o',!!p.prison))+
    row('Studienkredit (BAföG)',p.study.kr?'Du bekommst '+eur(px$(8000))+' im Jahr. Die Hälfte zahlst du später zurück.':'8.000 € im Jahr, die Hälfte zahlst du später zurück',p.study.kr?'<span class="chip">Aktiv</span>':btn('bafoeg',null,'Beantragen'))+
    '<div class="btns">'+btn('studyquit',null,'Studium abbrechen','g')+'</div></section>'}
  h+=card('Studium und Ausbildung',special('study')+special('azubi'));
  return h}

