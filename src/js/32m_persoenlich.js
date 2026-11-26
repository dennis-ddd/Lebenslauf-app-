/* ================= Persönlich: eigene Stadt, Tagebuch, Werte, Lebensfragen ================= */

/* ---------- Eigener Stadtname ---------- */
{const _cn=cityName;cityName=s=>(p&&p.cityN&&p.cityNS===s)?p.cityN:_cn(s)}
{const _ca=continueAs;continueAs=function(i){const cn=p&&p.cityN,cs=p&&p.cityNS;const r=_ca(i);if(p&&cn&&!p.cityN){p.cityN=cn;p.cityNS=cs;save()}return r}}
{const _ve=viewEinst;viewEinst=function(){const h=_ve();if(!p||!p.alive)return h;
  return h+'<section class="card"><h2 class="h">Deine Stadt</h2><p class="note">Gib deiner Heimatstadt einen eigenen Namen. Leer lassen für den zufälligen Namen.</p><div class="cityren"><input type="text" id="cren" maxlength="22" value="'+esc(p.cityN&&p.cityNS===p.seed?p.cityN:'')+'" placeholder="'+esc(cityName(p.seed))+'">'+btn('cityren',null,'Speichern','o')+'</div></section>'}}

/* ---------- Werte und Moral ---------- */
const VALS=[['e','Ehrlichkeit','ehrlich','gerissen'],['h','Herz','hilfsbereit','auf sich bedacht'],['f','Familie','familiär','unabhängig'],['r','Risiko','risikofreudig','vorsichtig'],['a','Ehrgeiz','ehrgeizig','gelassen']];
const VALRX=[['e',1,/ehrlich|entschuldig|zugeben|gestehen|wahrheit|zurückgeben|beichten|offen ansprechen/i],['e',-1,/lüg|ausrede|abstreiten|bestech|betr[üu]g|schummel|verschweig|klau|stehl|fälsch|leugn/i],
 ['h',1,/helfen|hilf|spende|aushelf|unterstütz|tröst|da sein|retten|erste hilfe|verzeih|kuchen|mitnehmen|für sich behalten|zuhören|pflegen/i],['h',-1,/ignorier|keine zeit|abwimmel|weitererzähl|auslach|belächel|tür zumachen|kontern|wütend/i],
 ['f',1,/familie|kinder|eltern|mama|papa|oma|opa|geschwister|versöhn|hochzeit|heiraten|ja!|ich auch/i],['f',-1,/trennung|noch nicht|nicht bereit|absagen|weiter schweigen|auszieh/i],
 ['r',1,/investier|wette|riskier|ausbruch|flucht|alles setzen|hart auftreten|gericht|klagen|einsatz|anwalt|bestech|annehmen/i],['r',-1,/abwarten|vorsichtig|später|lieber nicht|ablehnen|sicher|ein andermal|zahlen$/i],
 ['a',1,/überstunden|karriere|beförder|lernen|bewerb|weiterbild|checkliste|ehrgeiz|vorstand/i],['a',-1,/pause|ausruh|normal weiter|kündig|bleiben/i]];
function valAdd(k,v){p.vals=p.vals||{e:0,h:0,f:0,r:0,a:0};p.vals[k]=clamp((p.vals[k]||0)+v,-50,50)}
function valFromLabel(l){VALRX.forEach(([k,v,rx])=>{if(rx.test(l))valAdd(k,v*2)})}
const VALACT={klau:[['e',-2],['r',1]],tasche:[['e',-2],['r',1]],einbruch:[['e',-3],['r',2]],bankraub:[['e',-4],['r',3]],hack:[['e',-2],['r',1]],race:[['r',2]],lotto:[['r',1]],
  kidstime:[['f',2]],lernen:[['a',2]],work:[['a',1]],medi:[['a',-1]],nbkuchen:[['h',2]],nbbeschw:[['h',-1]],nachhilfe:[['h',1],['a',1]],call:[['f',1]],grat:[['f',1],['h',1]],invyes:[['f',1]],invno:[['f',-1]]};
{const _act=act;act=function(id,arg){const r=_act(id,arg);try{if(p&&VALACT[id])VALACT[id].forEach(([k,v])=>valAdd(k,v))}catch(e){errLog(e)}return r}}
function valWords(){const V=p.vals||{};return VALS.map(([k,n,pos,neg])=>[k,V[k]||0,pos,neg]).filter(x=>Math.abs(x[1])>=6).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,3).map(x=>x[1]>0?x[2]:x[3])}
function valCard(title){const V=p.vals||{},w=valWords();
  return '<section class="card vals"><h2 class="h">'+(title||'Was für ein Mensch du bist')+'</h2><p class="vsum">'+(w.length?w.map(x=>'<b>'+x+'</b>').join(' · '):'Noch nicht klar. Deine Entscheidungen formen deinen Charakter.')+'</p>'+
    VALS.map(([k,n,pos,neg])=>{const v=V[k]||0,x=50+v;return '<div class="vrow"><span>'+neg+'</span><div class="vbar"><i style="left:'+x+'%"></i></div><span>'+pos+'</span></div>'}).join('')+'</section>'}
{const _vd=viewDeath;viewDeath=function(){const h=_vd();try{const i=h.lastIndexOf('</section>');return i>0?h.slice(0,i+10)+valCard('Was für ein Mensch du warst')+h.slice(i+10):h+valCard('Was für ein Mensch du warst')}catch(e){return h}}}

/* ---------- Ehrliche Lebensfragen ---------- */
const LQ=[
 [()=>!!p.job&&p.age>=18,'Bist du glücklich mit deinem Job?',()=>[['Ja, ich mag, was ich tue',()=>(add('gl',3),valAdd('a',2),'Das ist mehr wert als jedes Gehalt.')],['Es geht so',()=>'Nicht schlecht, nicht gut. Vielleicht ändert sich das noch.'],
   ['Nein, ich will etwas anderes',()=>(add('gl',-2),valAdd('r',2),setTimeout(()=>{if(p&&p.alive){tab='jobs';render()}},700),'Du schaust dir neue Stellen an. Mutig.')]]],
 [()=>p.age>=20,'Hast du genug Zeit für die Menschen, die du liebst?',()=>[['Ja',()=>(add('gl',2),valAdd('f',1),'Schön. Das ist nicht selbstverständlich.')],
   ['Zu wenig',()=>{valAdd('f',3);const id=p.partner?'partner':!p.parentsGone?'mama':'freund';relUp(id,6);return 'Du greifst sofort zum Handy und rufst an. Es tut gut, die Stimme zu hören.'}]]],
 [()=>p.age>=10,'Wofür bist du dieses Jahr dankbar?',()=>[['Meine Gesundheit',()=>(add('gl',3),'Gesund sein ist das größte Geschenk.')],['Meine Familie',()=>(add('gl',3),valAdd('f',2),'Familie ist ein Zuhause, das man mitnimmt.')],
   ['Meine Freunde',()=>(add('gl',3),valAdd('h',1),relUp('freund',3),'Gute Freunde sind die Familie, die man sich aussucht.')],['Was ich erreicht habe',()=>(add('gl',3),valAdd('a',2),'Du darfst stolz auf dich sein.')]]],
 [()=>p.age>=35,'Wenn du nochmal 18 wärst: Was würdest du anders machen?',()=>[['Mehr wagen',()=>(valAdd('r',3),add('gl',1),'Vielleicht ist es dafür nie zu spät.')],['Mehr lernen',()=>(valAdd('a',3),add('in',1),'Du meldest dich spontan für einen Kurs an.')],
   ['Mehr Zeit mit Familie',()=>(valAdd('f',3),'Dann fang heute damit an.')],['Nichts. Es ist gut so',()=>(add('gl',5),'Ein seltenes, schönes Gefühl.')]]],
 [()=>p.age>=16,'Bist du stolz auf den Menschen, der du bist?',()=>[['Ja',()=>(add('gl',4),'Das merkt man dir an.')],
   ['Nicht ganz',()=>((p.vals&&p.vals.e<-10)?(valAdd('e',4),'Du nimmst dir vor, ehrlicher zu sein. Ein Anfang.'):(add('in',1),'Niemand ist perfekt. Du arbeitest an dir.'))]]],
 [()=>p.age>=18,'Was ist dir wichtiger: Geld oder Zeit?',()=>[['Geld',()=>(valAdd('a',3),p.prio='geld','Sicherheit ist dir wichtig. Verständlich.')],['Zeit',()=>(valAdd('f',2),add('gl',3),p.prio='zeit','Die Zeit kommt nicht zurück. Geld schon.')]]],
 [()=>p.age>=12&&p.age<=16&&!p.dream,'Was willst du später mal werden?',()=>[['Ärztin oder Arzt',()=>(p.dream='arzt','Menschen helfen. Ein großer Traum.')],['Etwas mit Computern',()=>(p.dream='it','Die Zukunft gehört dir.')],
   ['Berühmt werden',()=>(p.dream='star','Bühne, Licht, Applaus!')],['Eigene Firma',()=>(p.dream='chef','Selbst der Chef sein. Warum nicht?')]]]];
const DREAMJOB={arzt:['arzt'],it:['info'],chef:[]};
QEV.lfrage=i=>{const q=LQ[i];if(!q||!q[0]())return null;return E('Eine ehrliche Frage',q[1],()=>true,q[2]())};
function lqYear(){if(p.prison||p.age<10||(p.lqLast!=null&&p.age-p.lqLast<3)||!ch(.22))return;p.lqLast=p.age;const L=LQ.map((q,i)=>i).filter(i=>{const y=(p.lqY||{})[i];return LQ[i][0]()&&(y==null||p.age-y>=6)});if(!L.length)return;const i=pick(L);p.lqY=p.lqY||{};p.lqY[i]=p.age;p.q.push({id:'lfrage',d:i})}
function dreamCheck(){if(!p.dream||p.dreamDone)return;const j=p.job&&p.job.id;const ok=p.dream==='chef'?!!(p.biz&&(p.biz.fronts||[]).length):p.dream==='star'?(p.fol||0)>=100000||(p.mus&&p.mus.fame>=60):!!j&&(DREAMJOB[p.dream]||[]).includes(j);
  if(ok){p.dreamDone=1;add('gl',12);log('Kindheitstraum erfüllt! Schon mit '+(p.dreamA||14)+' wusstest du, was du willst.');try{mile('Kindheitstraum erfüllt','star')}catch(e){errLog(e)}}}

/* ---------- Tagebuch ---------- */
const fp=t=>String(t).replace(/\bDu hast\b/g,'Ich habe').replace(/\bdu hast\b/g,'ich habe').replace(/\bDu bist\b/g,'Ich bin').replace(/\bdu bist\b/g,'ich bin').replace(/\bDu\b/g,'Ich').replace(/\bdu\b/g,'ich')
  .replace(/\bDein(e|en|em|er|es)?\b/g,'Mein$1').replace(/\bdein(e|en|em|er|es)?\b/g,'mein$1').replace(/\bdich\b/g,'mich').replace(/\bdir\b/g,'mir').replace(/\bIch wirst\b/g,'Ich werde').replace(/\bich wirst\b/g,'ich werde').replace(/\bIch kannst\b/g,'Ich kann').replace(/\bich kannst\b/g,'ich kann').replace(/\b(Ich|ich) musst\b/g,'$1 muss').replace(/\b(Ich|ich) bekommst\b/g,'$1 bekomme').replace(/\b(Ich|ich) verdienst\b/g,'$1 verdiene');
const MOOD=[[80,['Was für ein Jahr! Ich bin einfach glücklich.','Ich könnte die ganze Welt umarmen.']],[60,['Alles in allem ein gutes Jahr.','Ich bin zufrieden.']],[40,['Ein Jahr mit Höhen und Tiefen.','Es war okay. Nicht mehr, nicht weniger.']],[0,['Es war ein schweres Jahr.','Ich hoffe, das nächste wird besser.']]];
function diaryWrite(a0){const L=p.log.filter(l=>l.a===a0||l.a===a0+1).map(l=>l.t).filter(t=>t&&t.length>18&&!/^(Gericht: )?\+|Geburtstag|Aktion/.test(t));
  const pickL=L.slice(-12).sort((a,b)=>b.length-a.length).slice(0,4);const m=MOOD.find(x=>p.st.gl>=x[0])[1];
  const txt=(a0<6?'':pick(m)+' ')+(pickL.length?pickL.map(fp).join(' '):'Ein ruhiges Jahr ohne große Ereignisse.');
  p.diary=p.diary||[];p.diary.push({a:a0,t:txt});if(p.diary.length>130)p.diary.shift()}
{const _au=ageUp;ageUp=function(){const a0=p&&p.age;const r=_au.apply(this,arguments);try{if(p&&p.alive&&p.age>a0){diaryWrite(a0);dreamCheck()}}catch(e){errLog(e)}return r}}
function viewDiary(){p.dnotes=p.dnotes||{};const D=(p.diary||[]).slice().reverse();
  return valCard()+'<section class="card"><h2 class="h">Notiz für dieses Jahr</h2><textarea id="dnote" maxlength="400" rows="3" placeholder="Was beschäftigt dich gerade? Nur du siehst das.">'+esc(p.dnotes[p.age]||'')+'</textarea><div class="btns">'+btn('dnote',null,'Speichern','o')+'</div></section>'+
    '<section class="card diary"><h2 class="h">Mein Tagebuch</h2>'+(D.length?D.map(e=>'<article><h3>Mit '+e.a+'</h3><p>'+esc(e.t)+'</p>'+(p.dnotes[e.a]?'<p class="dn">„'+esc(p.dnotes[e.a])+'“</p>':'')+'</article>').join(''):'<p class="note">Am Ende jedes Jahres schreibt '+esc(p.first)+' hier einen Eintrag.</p>')+'</section>'}
function act16(id,arg){switch(id){
  case 'dnote':{const t=document.getElementById('dnote');if(!t)return 1;p.dnotes=p.dnotes||{};const v=t.value.trim();if(v)p.dnotes[p.age]=v.slice(0,400);else delete p.dnotes[p.age];save();toast('Gespeichert.');return 1}
  case 'cityren':{const t=document.getElementById('cren');if(!t)return 1;const v=t.value.trim().slice(0,22);if(v){p.cityN=v;p.cityNS=p.seed}else{p.cityN=null}save();toast('Deine Stadt heißt jetzt '+cityName(p.seed)+'.');render();return 1}
}return 0}
{const _py=perkYear;perkYear=function(R0){_py(R0);try{lqYear()}catch(e){errLog(e)}}}
