/* ================= Folgen: Entscheidungen, Hobbys, Casino und Börse hängen zusammen ================= */
const foSk=(t,back)=>{try{p.skfl=p.skfl||[];p.skfl.push({t,back,a:p.age});if(p.skfl.length>12)p.skfl.shift()}catch(e){errLog(e,'foSk')}};
const foPartner=()=>p.partner&&p.partner.name?p.partner:null;
const foMsg=(id,t)=>{try{if(id==='partner'&&!foPartner())return false;if(!p.chats||!p.chats[id])return false;msg(id,t);return true}catch(e){errLog(e,'foMsg');return false}};
const foKids=(a,b)=>(p.kids||[]).filter(k=>k.alive!==false&&p.age-k.b>=a&&p.age-k.b<=b);
const foF=()=>(p.fo=p.fo||{});

/* ---------- 1. Praktikum, Klassensprecher und Hobbys helfen bei passenden Jobs ---------- */
const PRAKJ={pflege:['pflege','arzt'],handwerk:['mecha','architekt','lager'],buero:['buero','bankkfm','jura','info'],kita:['lehrer','baby']};
const PRAKN={pflege:'im Pflegeheim',handwerk:'in der Werkstatt',buero:'im Büro',kita:'in der Kita'};
const HOBJ={kochen:['koch','cafe','kellner'],gitarre:['lehrer'],schach:['info','jura'],malen:['architekt','friseur'],garten:['lager']};
function jobBonus(j){const r={v:0,src:[]};try{if(!j)return r;
  if(p.prak&&(PRAKJ[p.prak]||[]).includes(j.id)&&p.age<35){r.v+=.12;r.src.push('prak')}
  if(p.sprecher&&['lehrer','jura','polizei'].includes(j.id)&&p.age<40){r.v+=.05;r.src.push('spr')}
  Object.keys(HOBJ).forEach(k=>{if(HOBJ[k].includes(j.id)&&p.hob&&hlvl(k)>=2){r.v+=Math.min(.08,(hlvl(k)-1)*.02);r.src.push('hob:'+k)}})}catch(e){errLog(e,'jobBonus')}return r}
{const _iv=interview;interview=function(j,go){const bb=jobBonus(j);return _iv(j,b=>{const had=p.job&&p.job.id;const r=go(b+bb.v);try{if(p.job&&p.job.id===j.id&&had!==j.id&&bb.src.length){
  if(bb.src.includes('prak')){foSk('Job als '+j.t,'Mit '+(p.prakA||15)+': Praktikum '+(PRAKN[p.prak]||''));log('Dein Schulpraktikum '+(PRAKN[p.prak]||'')+' hat beim Vorstellungsgespräch geholfen.')}
  const h=bb.src.find(s=>s.startsWith('hob:'));if(h){const k=h.slice(4);log('Dein Hobby '+HOB[k][0]+' hat dir bei der Bewerbung geholfen.')}}}catch(e){errLog(e,'jobBonus')}return r})}}

/* ---------- 2. „Geld oder Zeit?“ hat Folgen ---------- */
QEV.fo_prio_kid=()=>{const k=foKids(6,14)[0];if(!k||p.prio!=='geld')return null;
  return EC('Familie','„Du bist nie da“',k.n+' steht in der Tür, als du wieder spät heimkommst: „Papa von Lea war heute beim Schulfest. Du bist nie da.“',[
    ['Ab jetzt mehr Zeit nehmen',()=>{p.prio='zeit';k.rel=Math.min(100,(k.rel||50)+12);if(p.job)p.job.perf=Math.max(0,p.job.perf-6);add('gl',4);return 'Du gehst jetzt freitags früher. Der Chef murrt, '+k.n+' strahlt.'}],
    ['„Ich mache das doch für euch“',()=>{k.rel=Math.max(0,(k.rel||50)-12);add('gl',-3);return k.n+' nickt nur. Und geht in sein Zimmer.'}]],'Mit '+(p.prioA||18)+': „Geld ist mir wichtiger als Zeit“')};
QEV.fo_prio_look=()=>{if(!p.prio)return null;const g=p.prio==='geld';
  return EC('Wendepunkt','Geld oder Zeit, die Bilanz',g?'Du rechnest nach: Vorsorge gut, Konto gut. Aber wann warst du zuletzt einfach mal da, ohne auf die Uhr zu sehen?':'Du hast nie das große Geld gemacht. Dafür kennst du jeden Geburtstag, jedes Schulfest und jede Abendsonne am See.',
    g?[['Das Leben jetzt genießen',()=>{p.prio='zeit';add('gl',6);return 'Du kündigst den Bausparvertrag für eine Reise. Endlich.'}],['Es hat sich gelohnt',()=>{add('gl',2);return 'Sicherheit ist auch ein Geschenk. Für dich und für die anderen.'}]]
     :[['Ich würde es wieder so machen',()=>{add('gl',8);return 'Kein Zweifel. Die Zeit war das Wertvollste.'}],['Ein bisschen mehr Geld wäre nett gewesen',()=>{add('gl',2);return 'Ehrlich. Aber tauschen würdest du nicht.'}]],'Mit '+(p.prioA||18)+': '+(g?'„Geld ist mir wichtiger“':'„Zeit ist mir wichtiger“'))};

/* ---------- 3. Der Plan nach der Schule ---------- */
const WT=[['Australien','#E8A33D'],['Kanada','#D64545'],['Neuseeland','#2FA88F'],['Südamerika','#3BB273']];
QEV.fo_reise=()=>EC('Jugend','Work and Travel','Der Plan von damals: erst mal die Welt sehen. Jetzt wäre der Moment. Wohin?',[
  ...WT.slice(0,3).map(([l])=>['Nach '+l,()=>{const c=px$(2500);if(p.money>=c)p.money-=c;add('gl',9);p.sk.charme=Math.min(100,(p.sk.charme||0)+5);add('in',2);p.wtL=l;
    try{const f=fkMake('aus '+l);f.cl=60;fkAdd(f);fkMem(f,'Ihr habt euch in '+l+' kennengelernt')}catch(e){errLog(e,'wt')}mile('Ein Jahr in '+l,'star');return 'Ein Jahr Hostels, Erntejobs und Sonnenaufgänge. Du kommst anders zurück, als du gegangen bist.'}]),
  ['Doch lieber gleich anfangen',()=>{add('gl',-1);return 'Die Welt läuft nicht weg. Hoffentlich.'}]],'Mit '+(p.planA||16)+': „Erst mal die Welt sehen“');
QEV.fo_plan_late=()=>{const st=p.plan==='studium';if(!p.plan||(st&&(p.deg||p.study))||(!st&&(p.aus||p.azubi)))return null;
  return EC('Wendepunkt','Der Plan von damals',st?'Beim Aufräumen findest du einen alten Zettel: „Nach dem Abi: Studium!“ Es ist anders gekommen.':'Dein Vater hat damals gesagt: „Etwas Handfestes.“ Eine Ausbildung hast du nie gemacht.',[
    st?['Eine berufliche Weiterbildung machen',()=>{add('in',4);if(p.job){p.job.perf=Math.min(100,p.job.perf+6);p.job.pay=Math.round(p.job.pay*1.06)}mile('Weiterbildung abgeschlossen','star');return 'Abends lernen, am Wochenende Prüfungen. Es lohnt sich: '+(p.job?'6 % mehr Gehalt.':'Du fühlst dich klüger.')}]
      :['Jetzt eine Umschulung beginnen',()=>{if(p.job&&!p.job.part)p.job=null;p.azubi={left:2};add('gl',3);return 'Zwei Jahre Umschulung. Mit '+p.age+' wieder in der Berufsschule. Und es fühlt sich richtig an.'}],
    ['Es ist gut so, wie es ist',()=>{add('gl',3);return 'Pläne sind dafür da, sich zu ändern.'}]],'Mit '+(p.planA||16)+': '+(st?'„Ich will studieren“':'„Eine Ausbildung“'))};

/* ---------- 4. Klassensprecher/in, erstes Wort, Träume ---------- */
QEV.fo_spr=()=>p.pol||p.gang?null:EC('Politik','Der Ortsverein ruft an','„Du warst doch damals Klassensprecher'+(p.g==='w'?'in':'')+'! Wir suchen Leute, die den Mund aufmachen. Hast du Lust?“',[
  ...PARTIES.map((P,i)=>['Mitglied werden: '+P[0],()=>{p.pol={party:i,lvl:0,pop:R(28,45),camp:0,next:null};addRuf(3);return 'Du bist jetzt in der '+P[0]+'. Deine alte Klasse wäre stolz.'}]),
  ['Nein danke',()=>'Vielleicht später. Vielleicht nie.']],'In der Schule: zum Klassensprecher gewählt');
QEV.fo_word=()=>{const k=foKids(1,2)[0];if(!k||!p.word1)return null;const g=p.g==='w'?'Mama':'Papa';
  return EC('Familie','Das erste Wort',k.n+' zeigt auf dich und sagt laut und deutlich: „'+g+'!“ Deine Mutter lacht am Telefon: „Dein erstes Wort war übrigens „'+p.word1+'“.“',[
    ['Gerührt sein',()=>{add('gl',7);k.rel=Math.min(100,(k.rel||60)+5);return 'Manche Momente kommen zweimal im Leben. Einmal als Kind, einmal als Elternteil.'}]],'Dein erstes Wort: „'+p.word1+'“')};
QEV.fo_dream=()=>{const D=p.dr;if(!D||!D.pick)return null;const open=D.pick.filter(k=>!D.done[k]&&DREAMS[k]),dn=Object.keys(D.done);
  if(!open.length)return dn.length?EC('Im Alter','Ohne Reue','Du denkst an die Träume von damals. Jeder einzelne ist wahr geworden.',[['Lächeln',()=>{add('gl',10);mile('Alle Träume erfüllt','big');return 'Kaum jemand kann das von sich sagen.'}]],'Deine Lebensträume'):null;
  const n=DREAMS[open[0]][0];
  return EC('Im Alter','Was ich immer wollte','In einer alten Kiste findest du deine Liste mit Träumen. Einer ist nie wahr geworden: „'+n+'“.',[
    ['Ein letztes Mal anpacken',()=>{add('gl',6);mile('Einen alten Traum angepackt: '+n,'star');return 'Vielleicht klappt es nicht ganz. Aber du hast es versucht, und das zählt.'}],
    ['Den Traum den Enkeln weitergeben',()=>{p.drPass=open[0];add('gl',4);return 'Du erzählst den Kleinen davon. Ihre Augen leuchten.'}],
    ['Frieden damit schließen',()=>{add('gl',3);return 'Nicht jeder Traum muss wahr werden, um schön zu sein.'}]],'Deine Lebensträume')};
/* Weitergegebener Traum: das Kind übernimmt ihn */
{const _ca=continueAs;continueAs=function(i){const prev=p;const r=_ca.apply(this,arguments);try{if(p!==prev&&prev.drPass&&DREAMS[prev.drPass]){p.dr={pick:[prev.drPass],done:{}};log('Der Traum deiner Familie lebt weiter: „'+DREAMS[prev.drPass][0]+'“.')}}catch(e){errLog(e,'drPass')}return r}}

/* ---------- 5. Hobbys: Freunde, Auftritte und vielleicht ein Beruf ---------- */
const HOBX={
 gitarre:{club:'dem Gitarrenkurs',e3:['Offene Bühne','Im Café ist offene Bühne. Der Wirt winkt dich nach vorn.','Spielen','Applaus! Jemand filmt mit. Am nächsten Tag kennen dich Leute in der Bäckerei.'],e5:['Die Band ruft an','Eine lokale Band sucht dringend jemanden an der Gitarre. Großer Auftritt beim Stadtfest.','Einsteigen','Du stehst auf der großen Bühne. Tausend Leute singen mit.'],job:'Gitarrenlehrer/in',ms:'Auftritt beim Stadtfest'},
 kochen:{club:'der Kochschule',e3:['Nachbarschaftsessen','Im Hof soll es ein Fest geben. Alle fragen, ob du kochst.','Für alle kochen','Die Töpfe sind leer, die Nachbarn glücklich. Seitdem grüßt dich jeder.'],e5:['Kochshow im Lokalfernsehen','Das Lokalfernsehen sucht Hobbyköche für eine Show.','Mitmachen','Du gewinnst die Folge. Dein Rezept wird nachgekocht.'],job:'Caterer/in',ms:'Sieg in der Kochshow'},
 schach:{club:'dem Schachverein',e3:['Simultanturnier','Ein Großmeister spielt gegen 20 Leute gleichzeitig. Ein Platz ist frei.','Mitspielen','Remis gegen einen Großmeister! Er schüttelt dir anerkennend die Hand.'],e5:['Stadtmeisterschaft','Die Stadtmeisterschaft im Schach. Du bist an Nummer 1 gesetzt.','Antreten','Stadtmeister'+'! Dein Foto hängt jetzt im Vereinsheim.'],job:'Schachtrainer/in',ms:'Stadtmeister im Schach'},
 malen:{club:'dem Malkurs',e3:['Kleine Ausstellung','Die Stadtbücherei bietet dir eine Wand für deine Bilder.','Ausstellen','Ein Bild wird verkauft! An eine Fremde, die sagt, es erinnere sie an ihre Kindheit.'],e5:['Eine Galerie meldet sich','Eine echte Galerie will eine Ausstellung nur mit deinen Bildern.','Zusagen','Vernissage mit Sekt und Presse. Fast alles wird verkauft.'],job:'Malerin und Maler',ms:'Eigene Ausstellung in der Galerie'},
 garten:{club:'dem Kleingartenverein',e3:['Der Riesenkürbis','Dein Kürbis ist größer als alle anderen im Verein. Wettbewerb am Samstag.','Mitmachen','Platz 1! Ein Foto von dir und dem Kürbis erscheint in der Zeitung.'],e5:['Ein Gemeinschaftsgarten','Die Stadt sucht jemanden, der einen Gemeinschaftsgarten aufbaut.','Übernehmen','Aus der Brache wird ein grüner Treffpunkt für das ganze Viertel.'],job:'Gärtner/in',ms:'Gemeinschaftsgarten gegründet'}};
const hobF=k=>{const F=foF();F.hob=F.hob||{};return F.hob[k]=F.hob[k]||{}};
QEV.fo_hob=d=>{const [k,lv]=String(d||'').split(':'),X=HOBX[k];if(!X||!HOB[k])return null;const E5=lv==='5',T=E5?X.e5:X.e3,l=hlvl(k);
  return EC('Freizeit',T[0],T[1],[
    [T[2],()=>{const ok=ch(.45+l*.1);if(!ok){add('gl',-1);return E5?'Die Nerven spielen nicht mit. Es wird trotzdem ein schöner Tag, nur nicht deiner.':'Es läuft nicht ganz rund. Aber du hast dich getraut.'}
      add('gl',E5?10:6);addRuf(E5?3:1);if(k==='malen')p.money+=px$(E5?R(6000,14000):R(300,800));if(k==='kochen'&&E5)p.fameB=(p.fameB||0)+15;
      if(E5){mile(X.ms,'star');try{news(p.first+' '+p.last+': '+X.ms,'lokal')}catch(e){errLog(e)}}return T[3]}],
    ['Lieber nicht',()=>{add('gl',-1);return 'Vielleicht beim nächsten Mal.'}]],'Dein Hobby: '+HOB[k][0])};
QEV.fo_hobjob=k=>{const X=HOBX[k];if(!X||p.hobPro)return null;
  return EC('Wendepunkt','Aus Hobby wird Beruf?','Leute fragen dich ständig nach '+HOB[k][0]+'. Eine Freundin sagt: „Mach das doch beruflich! Du wärst '+X.job+'.“',[
    ['Den Sprung wagen',()=>{const t=p.job?p.job.t:null;if(p.job)p.job=null;p.hobPro=k;add('gl',8);mile('Selbstständig als '+X.job,'big');return (t?'Du kündigst als '+t+'. ':'')+'Ab jetzt bist du '+X.job+'. Unsicher, aufregend, deins.'}],
    ['Nebenher ausprobieren',()=>{p.hobSide=k;add('gl',3);return 'Zwei Abende pro Woche. Mal sehen, wohin das führt.'}],
    ['Es bleibt ein Hobby',()=>{add('gl',2);return 'Manches soll einfach Freude machen.'}]],'Dein Hobby: '+HOB[k][0])};
{const _st=status;status=function(){try{if(p&&p.alive&&!p.prison&&!p.job&&p.hobPro&&HOBX[p.hobPro]&&p.age<70)return HOBX[p.hobPro].job+' (selbstständig)'}catch(e){errLog(e)}return _st.apply(this,arguments)}}

/* ---------- 6. Casino: Glück, Sorge, Selbstsperre ---------- */
const GPLAY=['spin','rl','bjdeal'];
QEV.fo_gsorge=()=>{const pt=foPartner(),who=pt?pt.name:'Deine beste Freundin';
  return EC('Freunde','„Wir müssen reden“',who+' setzt sich zu dir: „Du warst dieses Jahr ständig im Casino. Ich mache mir Sorgen um dich.“',[
    ['Hilfe annehmen',()=>{p.gsucht=0;p.gsperr=p.age+3;add('gl',5);if(pt)pt.rel=Math.min(100,pt.rel+8);mile('Hilfe angenommen','star');return 'Beratungsstelle, Selbstsperre, ehrliche Gespräche. Es ist schwer. Aber du bist nicht allein.'}],
    ['Mir ein Limit setzen',()=>{p.gsucht=Math.max(0,(p.gsucht||0)-15);add('gl',1);return 'Ein fester Betrag pro Monat. Mal sehen, ob du dich dran hältst.'}],
    ['„Ich hab das im Griff“',()=>{p.gsucht=(p.gsucht||0)+8;if(pt)pt.rel=Math.max(0,pt.rel-10);add('gl',-2);return who+' sagt nichts mehr. Aber der Blick bleibt.'}]],'Mit '+(p.gmb0||18)+': Der erste Abend im Casino')};
{const _vc=viewCasino;viewCasino=function(){let h=_vc.apply(this,arguments);try{if(!p)return h;const on=p.gsperr&&p.age<p.gsperr;
  const c='<section class="card gsc"><h2 class="h">Spielerschutz</h2>'+(on?'<p class="note">Selbstsperre aktiv bis '+p.gsperr+' Jahre. Gut, dass du auf dich aufpasst.</p>':
    '<p class="note">Spielen soll Spaß machen.'+((p.gsucht||0)>=30?' Du spielst gerade sehr viel.':'')+'</p>'+row('Selbstsperre für ein Jahr','Kein Casino bis zum nächsten Geburtstag',btn('gsperr',null,'Sperren','o')))+'</section>';
  h=on?c:h+c}catch(e){errLog(e,'gsc')}return h}}

/* ---------- 7. Börse: Gewinne und Verluste spürt die Familie ---------- */
QEV.fo_crash=d=>EC('Geld','Rote Zahlen im Depot','Dein Depot hat dieses Jahr '+eur(+d||0)+' verloren. Im Radio reden sie von Panik an der Börse.',[
  ['Alles verkaufen',()=>{ensureStocks();let v=0;Object.keys(p.sh||{}).forEach(id=>{const n=p.sh[id]||0;if(n&&p.px[id]){v+=Math.round(n*p.px[id]);p.sh[id]=0;p.cost[id]=0}});p.money+=v;p.pfv=0;add('gl',-2);return 'Verkauft für '+eur(v)+'. Wenigstens kannst du wieder schlafen.'}],
  ['Durchhalten',()=>{p.bHold={a:p.age,v:stockVal()};add('gl',-1);return 'Augen zu und abwarten. Langfristig steigt die Börse. Meistens.'}]],'Mit '+(p.stk0||18)+': Die ersten Aktien gekauft');

/* ---------- Aktionen ---------- */
{const f=act;act=function(id,arg){try{
  if(GPLAY.includes(id)&&p){if(p.gsperr&&p.age<p.gsperr){toast('Selbstsperre aktiv bis '+p.gsperr+' Jahre.');return 1}if(typeof casBusy!=='undefined'&&!casBusy){p.gmbN=(p.gmbN||0)+1;if(p.gmb0==null)p.gmb0=p.age}}
  if(id==='gsperr'&&p){p.gsperr=p.age+1;add('gl',1);done('Selbstsperre bis '+p.gsperr+' Jahre. Das Casino ist zu.');return 1}
  if(id==='buycar'&&p&&p.ticket){toast('Du hast deinen Führerschein abgegeben.');return 1}
  if(id==='buyst'&&p){const m0=p.money;const r=f(id,arg);if(p.money<m0){p.pfIn=(p.pfIn||0)+(m0-p.money);if(p.stk0==null)p.stk0=p.age}return r}
  if(id==='sellst'&&p){const m0=p.money;const r=f(id,arg);if(p.money>m0)p.pfIn=(p.pfIn||0)-(p.money-m0);return r}
}catch(e){errLog(e,'foAct')}return f(id,arg)}}

/* ---------- Jahreswechsel: alles zusammenführen ---------- */
{const _py=perkYear;perkYear=function(R0){_py(R0);try{if(!p||!p.alive)return;const F=foF(),q=id=>p.q.push(typeof id==='string'?{id}:id);
  if(p.prio&&p.prioA==null)p.prioA=p.age;if(p.plan&&p.planA==null)p.planA=p.age;if(p.prak&&p.prakA==null)p.prakA=p.age;
  if(p.prison)return;
  /* Geld oder Zeit */
  if(p.prio==='geld'){if(p.job)p.job.perf=Math.min(100,p.job.perf+1);if(foPartner()&&ch(.5))p.partner.rel=Math.max(0,p.partner.rel-1)}
  if(p.prio==='zeit'){if(ch(.5))add('gl',1);if(foPartner()&&ch(.5))p.partner.rel=Math.min(100,p.partner.rel+1);foKids(0,25).forEach(k=>{if(ch(.4))k.rel=Math.min(100,(k.rel||50)+1)})}
  if(p.prio==='geld'&&!F.pk&&p.age>=30&&foKids(6,14).length&&ch(.45)){F.pk=1;q('fo_prio_kid')}
  if(p.prio&&!F.pl&&p.age>=62&&p.age<=70&&ch(.4)){F.pl=1;q('fo_prio_look')}
  /* Plan nach der Schule */
  if(p.plan&&!F.po){if(p.plan==='studium'&&p.study){F.po=1;add('gl',3);foMsg('mama','Du studierst! Genau wie du es damals beim Abendessen gesagt hast. Wir sind stolz auf dich.')}
    else if(p.plan==='ausbildung'&&p.azubi){F.po=1;add('gl',3);foMsg('papa','Eine Ausbildung. Etwas Handfestes. Ich bin stolz auf dich.')}}
  if(p.plan==='reise'&&!F.wt&&p.age>=18&&p.age<=21&&!p.study&&ch(.75)){F.wt=1;q('fo_reise')}
  if((p.plan==='studium'||p.plan==='ausbildung')&&!F.pll&&p.age>=32&&p.age<=50&&ch(.15)){F.pll=1;q('fo_plan_late')}
  /* Klassensprecher, erstes Wort, Träume */
  if(p.sprecher&&!F.spr&&!p.pol&&p.age>=21&&p.age<=35&&ch(.22)){F.spr=1;q('fo_spr')}
  if(p.word1&&!F.w1&&foKids(1,2).length){F.w1=1;q('fo_word')}
  if(p.dr&&p.dr.pick&&p.dr.pick.length&&!F.dre&&p.age>=72&&ch(.45)){F.dre=1;q('fo_dream')}
  /* Führerschein abgegeben: Autos werden verkauft */
  if(p.ticket&&!F.tk){F.tk=1;const C=(p.cars||[]).filter(k=>CARS[k]);if(C.length){const v=C.reduce((s,k)=>s+Math.round(px$(CARS[k].pr)*.35),0);p.money+=v;p.cars=[];log('Ohne Führerschein brauchst du kein Auto mehr: verkauft für '+eur(v)+'.')}}
  /* Hobbys */
  if(p.hob)Object.keys(p.hob).forEach(k=>{if(!HOBX[k])return;const l=hlvl(k),H=hobF(k);
    if(l>=2&&!H.f){H.f=1;try{const fr=fkMake('aus '+HOBX[k].club);fr.cl=55;fkAdd(fr);fkMem(fr,'Ihr habt euch bei '+HOB[k][0]+' kennengelernt')}catch(e){errLog(e,'hobf')}}
    if(l>=3&&!H.e3&&ch(.4)){H.e3=1;q({id:'fo_hob',d:k+':3'})}
    else if(l>=5&&!H.e5&&ch(.4)){H.e5=1;q({id:'fo_hob',d:k+':5'})}
    else if(l>=5&&H.e5&&!H.j&&!p.hobPro&&p.age>=22&&p.age<=60&&ch(.3)){H.j=1;q({id:'fo_hobjob',d:k})}});
  if(p.hobPro&&p.job&&!p.job.part){log('Du arbeitest jetzt wieder angestellt. '+HOB[p.hobPro][0]+' bleibt ein Hobby.');p.hobPro=null}
  if(p.hobPro&&HOBX[p.hobPro]&&!p.job&&p.age<70){const inc=Math.round(px$(R(20000,34000))*(hlvl(p.hobPro)>=5?1.15:1));p.money+=inc;if(R0&&R0.inc)R0.inc.push([HOBX[p.hobPro].job,inc])}
  if(p.hobSide&&HOBX[p.hobSide]&&p.age<75){const inc=Math.round(px$(R(2500,6000)));p.money+=inc;if(R0&&R0.inc)R0.inc.push([HOB[p.hobSide][0]+' nebenher',inc])}
  /* Casino */
  {const n=p.gmbN||0;p.gmbN=0;const cs=p.casino||{won:0,lost:0},cur=(cs.won||0)-(cs.lost||0),dn=cur-(p.gmbL==null?cur:p.gmbL);p.gmbL=cur;
    let s=p.gsucht||0;s+=n>=10?16:n>=5?7:n===0?-8:-3;if(dn<-px$(5000))s+=8;s=Math.max(0,Math.min(100,s));p.gsucht=s;
    if(s>=30&&(!F.gs||p.age-F.gs>=4)&&!(p.gsperr&&p.age<p.gsperr)){F.gs=p.age;q('fo_gsorge')}
    if(s>=60&&!(p.gsperr&&p.age<p.gsperr)&&p.money>0){const v=Math.min(Math.round(p.money*.08),px$(R(1500,6000)));p.money-=v;add('gl',-3);log('Heimlich verspielt: '+eur(v)+'.')}
    if(dn>px$(20000)){add('gl',3);foMsg('freund','Ich hab gehört, du hast im Casino abgeräumt?! Erzähl!')||foMsg('partner','Du hast WAS gewonnen?! Heute Abend gehen wir essen.')}
    if(dn<-px$(10000)&&foPartner()){p.partner.rel=Math.max(0,p.partner.rel-8);foMsg('partner','Wo ist das ganze Geld vom Konto hin? Wir müssen reden.')}}
  /* Börse */
  if(p.sh&&p.px&&p.pfv==null){p.pfv=stockVal();p.pfIn=0}else if(p.sh&&p.px){const v=stockVal(),prev=p.pfv,g=v-prev-(p.pfIn||0);p.pfv=v;p.pfIn=0;
    if(prev>px$(3000)&&g>Math.max(px$(15000),prev*.4)){add('gl',5);(foMsg('partner','Hast du schon ins Depot geschaut?! Plus '+eur(g)+'!')||foMsg('freund','Du mit deinen Aktien! Gib mir mal einen Tipp.'));if(!F.bw){F.bw=1;foSk('Börsengewinn: '+eur(g),'Mit '+(p.stk0||18)+': Die ersten Aktien gekauft')}}
    else if(prev>px$(3000)&&g<-Math.max(px$(10000),prev*.35)){add('gl',-3);if(foPartner())p.partner.rel=Math.max(0,p.partner.rel-3);if(!F.bc||p.age-F.bc>=5){F.bc=p.age;q({id:'fo_crash',d:-g})}}
    if(p.bHold&&p.age>p.bHold.a){if(v>p.bHold.v*1.15){mile('Geduld an der Börse zahlt sich aus','star');foSk('Das Depot erholt sich','Mit '+p.bHold.a+': Im Börsencrash durchgehalten');p.bHold=null}else if(p.age-p.bHold.a>=4)p.bHold=null}}
}catch(e){errLog(e,'folgen')}}}

/* ---------- Lebensfilm: das erste Wort ---------- */
{const _fs=filmScenes;filmScenes=function(){const S=_fs.apply(this,arguments);try{if(p.word1||p.walk1!=null){const t=[p.word1?'Erstes Wort: „'+esc(p.word1)+'“':'',p.walk1!=null?'Erste Schritte mit '+p.walk1:''].filter(Boolean).join(' · ');
  S.splice(Math.min(1,S.length),0,'<div class="lfs" style="--sc:#F2B33D"><small class="lfk">Die ersten Male</small><div class="lfav">'+avatarSvg(1,100,p)+'</div><p>'+t+'</p></div>')}}catch(e){errLog(e,'film')}return S}}
try{if(!CATSC.Freizeit)CATSC.Freizeit='park';if(!CATSC.Geld)CATSC.Geld='buero'}catch(e){errLog(e,'catsc')}
