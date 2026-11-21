/* ================= Städte ================= */
const CITYT={mittel:['Mittelgroße Stadt',1,1,'Alles in Maßen.'],gross:['Großstadt',1.15,1.45,'Mehr Gehalt, teure Mieten, viel los.'],klein:['Kleinstadt',.93,.75,'Ruhig, günstig, jeder kennt jeden.'],dorf:['Dorf',.86,.55,'Viel Natur, wenig Jobs, sehr günstig.'],ausland:['Ausland',1.22,1.3,'Neues Land, neue Sprache. Intelligenz +, manchmal Heimweh.']};
const cityF=i=>{const c=CITYT[(p&&p.city)||'mittel']||CITYT.mittel;return c[i+1]};
function moveCity(t){if(p.prison||!CITYT[t])return;CUR='umzug';const c=px$(2500);if(p.money<c){toast('Der Umzug kostet '+eur(c)+'.');return}if(!useAct())return;p.money-=c;p.seed=R(1,2e9);p.city=t;p.stats.cities++;
  if(p.age>=6){p.rel.freund=Math.max(0,p.rel.freund-25);msg('freund','Du ziehst weg?! Ich werd dich so vermissen. Melde dich!')}
  if(p.job&&!p.job.part&&!['influ','pol','sport'].includes(p.job.id)){log('Du hast deinen Job als '+p.job.t+' für den Umzug aufgegeben.');p.job=null}
  if(t==='ausland'){add('in',4);add('gl',-2)}mile('Umzug nach '+cityName(p.seed),'star');log('Du ziehst nach '+cityName(p.seed)+' ('+CITYT[t][0]+').');sel='home';save();render()}
function movePick(){dialog('Wohin soll es gehen?','Umzug kostet '+eur(px$(2500))+' und eine Aktion. Gehälter und Mieten unterscheiden sich je nach Ort.',Object.keys(CITYT).filter(k=>k!=='mittel').map(k=>[CITYT[k][0]+' (Gehalt ×'+String(CITYT[k][1]).replace('.',',')+')',()=>moveCity(k)]).concat([['Doch nicht',null]]))}

/* ================= Jahreswechsel ================= */
function lifeX(R0){ensureLife();
  worldYear(R0);bizPlusYear(R0);appYear(R0);chatsYear();hobbyYear(R0);examYear();{const sc=sibYear();if(sc)R0.out.push(['Pflegeheim der Eltern',sc])}calYear(R0);kidYear(R0);gradesYear();studyYear(R0);sportYear();musicYear(R0);polYear(R0);gangYear(R0);rivalYear();laterYear();habitYear();
  ['mama','papa'].forEach(k=>p.rel[k]=Math.max(0,p.rel[k]-2));p.rel.freund=Math.max(0,p.rel.freund-3);
  if(p.age>=8&&p.rel.freund<12){log('Du und '+p.friend+' habt euch aus den Augen verloren.');p.friend=pick(FN.concat(MN).filter(x=>x!==p.friend));p.rel.freund=45;p.chats.freund={msgs:[],un:0};msg('freund','Hi! Wir kennen uns vom Sport. Lust, mal was zu machen?')}
  p.lernN=0;p.skipN=0;if(p.trust&&p.age>=18){p.money+=p.trust;R0.inc.push(['Treuhandfonds der Familie',p.trust]);log('Du bekommst deinen Treuhandfonds: '+eur(p.trust)+'.');p.trust=0}
  const S=p.stats;S.maxNW=Math.max(S.maxNW,Math.round(netWorth()));S.earn+=Math.round(R0.inc.reduce((s,x)=>s+Math.max(0,x[1]),0));if(p.sm)S.maxFol=Math.max(S.maxFol,p.sm.fol);
  if(p.age>=8&&ch(.3)&&!p.parentsGone){const k=pick(['mama','papa']);if(p.rel[k]<30)msg(k,'Du meldest dich gar nicht mehr. Ist alles okay?')}}

/* ================= Aktionen ================= */
ACTS.schwaenzen={n:'Schwänzen',d:'Glück +, Zeugnis −',ok:()=>!!p.school&&p.age>=10,f:()=>{p.skipN=(p.skipN||0)+1;add('gl',R(3,6));if(ch(.25)&&!p.parentsGone){p.rel.mama=Math.max(0,p.rel.mama-5);msg('mama','Die Schule hat angerufen. Du warst nicht da?!');return 'Erwischt! Die Schule hat deine Eltern angerufen.'}return 'Ein freier Tag im Park.'}};
function act5(id,arg){const lock=!!p.prison;
  switch(id){
  case 'opt':O[arg]=!O[arg];saveO();if(arg==='rival'&&O.rival)ensureLife();if(arg==='snd'&&O.snd)sfx('coin');render();return 1;
  case 'theme':O.theme=arg;saveO();render();return 1;
  case 'wall':if(wallUsable(+arg)){O.wall=+arg;saveO();render()}return 1;
  case 'mini':O.mini=arg;saveO();render();return 1;
  case 'grat':{if(p.grat[arg]===p.age||p.age<6||!people().some(x=>x[0]===arg))return 1;p.grat[arg]=p.age;const nm=(people().find(x=>x[0]===arg)||[0,''])[1];
    if(arg==='partner'&&p.partner)p.partner.rel=Math.min(100,p.partner.rel+5);else if(p.rel[arg]!=null)p.rel[arg]=Math.min(100,p.rel[arg]+6);else if(arg.startsWith('kid')){const k=p.kids[+arg.slice(3)];if(k)k.rel=Math.min(100,k.rel+6)}
    if(arg!=='rival'){msg(arg,'Alles Gute zum Geburtstag!',true);msg(arg,pick(['Danke!! Du hast dran gedacht <3','Wie lieb von dir, danke!','Danke dir! Feiern wir bald zusammen?']))}else{msg('rival','Alles Gute. Ehrlich.',true);msg('rival','… Danke. Hätte ich nicht gedacht.');if(ch(.2)&&p.age>=25){p.rival.friend=true;mile('Frieden mit '+p.rival.n,'star')}}
    done('Du hast '+nm+' gratuliert.');return 1}
  case 'term':{const t=p.terms[+arg];if(!t||t.done||lock)return 1;t.done=true;done(TERM[t.k][3]());return 1}
  case 'famtab':famTab=arg;render();return 1;
  case 'kidtime':{const k=p.kids[+arg];if(!k||lock||!useAct())return 1;k.rel=Math.min(100,k.rel+R(8,14));k.ts=Math.min(100,k.ts+2);add('gl',R(3,6));done(pick(['Ein Nachmittag im Zoo mit ','Pizza und Filmabend mit ','Fußball im Park mit ','Zusammen gebacken mit '])+k.n+'.');return 1}
  case 'kidfd':{const [i,f]=arg.split(':'),k=p.kids[+i];if(!k)return 1;k.fd[f]=!k.fd[f];render();return 1}
  case 'kidgift':{const k=p.kids[+arg];if(!k||p.money<2000)return 1;p.money-=2000;k.rel=Math.min(100,k.rel+10);msg('kid'+arg,'Danke!! Das hilft mir gerade so sehr.');done(k.n+' freut sich über 2.000 €.');return 1}
  case 'adoptkid':{const c=px$(8000);if(p.age<25||p.age>55||lock||p.money<c||!useAct())return 1;p.money-=c;const g=ch(.5)?'w':'m',n=pick((g==='m'?MN:FN).filter(x=>!p.kids.some(k=>k.n===x)&&x!==p.first)),ka=R(0,6);p.kids.push({n,b:p.age-ka,g,adopt:true});ensureLife();add('gl',12);ach('kind');mile(n+' kommt in die Familie','kid');done(n+' ('+ka+' Jahre) ist jetzt dein Kind.');return 1}
  case 'will':p.will=arg;if(arg==='stiftung')addRuf(0);save();render();return 1;
  case 'sprecher':{if(p.sprecher||p.age<12||!p.school||p.sprY===p.age||!useAct())return 1;p.sprY=p.age;if(ch(.35+p.sk.charme/200+p.st.au/400)){p.sprecher=true;p.sk.charme=Math.min(100,p.sk.charme+5);addRuf(5);mile('Klassensprecher/in','star');done('Gewählt! Du bist Klassensprecher/in.')}else done('Knapp verloren. Nächstes Jahr wieder!');return 1}
  case 'exam':{if(!p.study||p.study.ex===p.age||lock)return 1;mgStart('quiz',3,'Semesterprüfung',(sc,auto)=>{p.study.ex=p.age;p.study.sc=(p.study.sc||[]).concat([sc]);if(sc>=2)add('in',2);else add('gl',-3);const t='Semesterprüfung'+(auto?' (automatisch)':'')+': '+sc+' von 3 Aufgaben richtig.';log(t);save();render();dialog('Prüfung',t,[['Weiter',null]])});return 1}
  case 'bafoeg':if(p.study){p.study.kr=true;done('Studienkredit bewilligt: '+eur(px$(8000))+' pro Jahr.')}return 1;
  case 'studyquit':if(p.study){const f=p.study.f;p.study=null;add('gl',-5);done('Du hast das Studium '+f+' abgebrochen.')}return 1;
  case 'kartab':karTab=arg;render();return 1;
  case 'sp_join':if(p.spo||p.age<6||p.age>25||lock)return 1;p.spo={s:arg,lvl:0,sk:clamp(R(12,30)+p.sk.form/5,0,100),inj:0,fans:0,club:'TSV '+cityName(p.seed),done:false};done('Du spielst jetzt '+SPORTS[arg]+' beim '+p.spo.club+'.');return 1;
  case 'sp_train':{const s=p.spo;if(!s||s.inj>0||lock||!useAct())return 1;s.sk=Math.min(100,s.sk+R(3,7)*(p.st.ge/100+.3));p.sk.form=Math.min(100,p.sk.form+2);add('ge',1);if(ch(.05)){s.inj=R(1,2);add('ge',-6);done('Verletzt beim Training! '+s.inj+' Jahr(e) Pause.');return 1}done('Hartes Training. Können: '+Math.round(s.sk)+'.');return 1}
  case 'sp_game':{const s=p.spo;if(!s||s.done||s.inj>0||lock)return 1;mgStart('reakt',3,'Spieltag',(sc,auto)=>{s.done=true;s.sk=Math.min(100,s.sk+sc);s.fans+=Math.round((sc+1)*(10+s.sk*(s.lvl+1)*3));const pro=p.job&&p.job.id==='sport',b=pro?sc*Math.round(p.job.pay/50):0;p.money+=b;
    const t=['Niederlage.','Unentschieden.','Knapper Sieg!','Kantersieg, du warst überragend!'][sc]+(b?' Siegprämie '+eur(b)+'.':'')+(auto?' (simuliert)':'');log('Spieltag: '+t);if(sc===3){add('gl',5);if(s.lvl>=3)news(p.first+' '+p.last+' schießt '+(s.club)+' zum Sieg','kultur')}save();render();dialog('Abpfiff',t,[['Weiter',null]])},s.sk);return 1}
  case 'sp_trial':{const s=p.spo;if(!s||p.age<16||p.age>26||s.trY===p.age||lock||!useAct())return 1;s.trY=p.age;
    if(s.sk>=55&&ch(.4+(s.sk-55)/60)){s.lvl=2;s.club=pick(['SC Nordhafen','Borussia Weststadt','FC Altbrück','TuS Südfelde']);if(p.job)log('Du hörst als '+p.job.t+' auf.');p.study=null;p.job={id:'sport',t:'Profi ('+SPORTS[s.s]+')',pay:px$(45000+Math.round(s.sk*600)),part:false,yrs:0,perf:50};ach('job');mile('Profivertrag bei '+s.club,'star');news(p.first+' '+p.last+' unterschreibt bei '+s.club,'kultur');done('Profivertrag beim '+s.club+'!')}
    else if(s.sk>=35&&s.lvl<1){s.lvl=1;done('Für die Profis reicht es noch nicht, aber du spielst jetzt in der Amateurliga.')}else done('Der Trainer schüttelt den Kopf. Weiter trainieren!');return 1}
  case 'mu_band':if(p.mus||p.age<13||lock)return 1;p.mus={band:pick(['Die ','The ',''])+pick(['Nachtfalter','Hafenlichter','Blauen Stunden','Kometen','Neonherzen','Sturmvögel']),sk:R(10,30),fans:R(5,30),songs:[],label:false,hits:0};done('Deine Band „'+p.mus.band+'“ ist gegründet!');return 1;
  case 'mu_prac':if(!p.mus||lock||!useAct())return 1;p.mus.sk=Math.min(100,p.mus.sk+R(3,7));p.mus.act=true;done('Stundenlang geübt. Können: '+Math.round(p.mus.sk)+'.');return 1;
  case 'mu_song':{const m=p.mus;if(!m||lock||!useAct())return 1;const q=clamp((m.sk*.6+p.st.in*.2+R(0,30))/100,0,1),t=pick(SONGW)+(ch(.3)?' ('+pick(['Remix','Akustik','Live'])+')':'');m.songs.push({t,q,rel:false});m.act=true;if(m.songs.length>20)m.songs.shift();done('Neuer Song: „'+t+'“. '+(q>=.8?'Das könnte ein Hit werden!':q>=.5?'Ganz ordentlich.':'Naja, Übung macht den Meister.'));return 1}
  case 'mu_gig':{const m=p.mus;if(!m||!m.songs.length||p.age<14||lock||!useAct())return 1;const best=Math.max(...m.songs.map(x=>x.q)),nf=Math.round((20+m.fans*.06)*(.5+best)*(.8+Math.random()*.4)),pay=Math.round(50+m.fans*.15);m.fans+=nf;p.money+=pay;m.act=true;if(p.sm)smGain(nf*.3);add('gl',R(3,6));sfx('coin');done('Konzert gespielt: +'+kfmt(nf)+' Fans, '+eur(pay)+' Gage.');return 1}
  case 'mu_album':{const m=p.mus,nw=m&&m.songs.filter(x=>!x.rel);if(!m||!m.label||m.al||lock||nw.length<3)return 1;m.al=true;const q=nw.reduce((s,x)=>s+x.q,0)/nw.length,hit=ch(q*.6);nw.forEach(x=>x.rel=true);
    const mul=hit?R(18,30)/10:1+q*.4;m.fans=Math.round(m.fans*mul+500);if(hit){m.hits++;nw.sort((a,b)=>b.q-a.q)[0].hit=true;mile('Hit in den Charts','star');news(m.band+' stürmt die Charts','kultur');if(p.sm)smGain(m.fans*.1)}const pay=Math.round(m.fans*1.2);p.money+=pay;
    if(!p.ms.some(x=>x.t==='Erstes Album'))mile('Erstes Album','star');done('Album veröffentlicht'+(hit?': ein Hit! Platz '+R(1,5)+' der Charts.':'. Platz '+R(12,80)+' der Charts.')+' '+eur(pay)+' Einnahmen.');return 1}
  case 'mu_tour':{const m=p.mus;if(!m||!m.label||m.tr||m.fans<10000||lock)return 1;m.tr=true;const pay=Math.round(m.fans*1.5);p.money+=pay;m.fans=Math.round(m.fans*1.1);add('ge',-5);add('gl',8);done('Tour durch 20 Städte: '+eur(pay)+' verdient.');return 1}
  case 'po_join':if(p.pol||p.age<16||lock||p.gang)return 1;p.pol={party:+arg,lvl:0,pop:R(15,35),camp:0,next:null};addRuf(2);done('Du bist jetzt Mitglied im '+PARTIES[+arg][0]+'.');return 1;
  case 'po_work':if(!p.pol||lock||!useAct())return 1;p.pol.pop=Math.min(100,p.pol.pop+R(2,6));addRuf(1);done(pick(['Flyer verteilt.','Infostand in der Fußgängerzone.','Sitzung bis Mitternacht.','Bürgersprechstunde gehalten.'])+' Beliebtheit: '+p.pol.pop+' %.');return 1;
  case 'po_cand':{const o=p.pol;if(!o||o.next||lock)return 1;const L=Math.min(POLO.length-1,o.lvl+1);if(p.age<POLO[L][2])return 1;o.next=p.age+1;o.camp=0;done('Du kandidierst als '+POLO[L][0]+'. Gewählt wird nächstes Jahr.');return 1}
  case 'po_plak':{const o=p.pol,c=px$(3000);if(!o||!o.next||p.money<c||lock||!useAct())return 1;p.money-=c;o.camp+=15;done('Dein Gesicht hängt an jeder Laterne. Wahlkampf: '+o.camp+'.');return 1}
  case 'po_camp':{const o=p.pol;if(!o||!o.next||lock||!useAct())return 1;o.camp+=R(6,12)+Math.round(p.sk.charme/12);done('Du hast an hundert Türen geklingelt. Wahlkampf: '+o.camp+'.');return 1}
  case 'po_rede':{const o=p.pol;if(!o||!o.next||o.rd||lock)return 1;mgStart('quiz',3,'Große Rede',(sc,auto)=>{o.rd=true;o.camp+=sc*7;o.pop=Math.min(100,o.pop+sc*2);const t='Deine Rede'+(auto?' (simuliert)':'')+': '+['Ein Desaster. Buhrufe.','Höflicher Applaus.','Viel Applaus!','Stehende Ovationen!'][sc];log(t);save();render();dialog('Rede gehalten',t,[['Weiter',null]])},p.sk.charme);return 1}
  case 'ga_join':if(p.gang||p.age<16||lock||(p.pol&&p.pol.lvl>=2))return 1;if(p.pol){p.pol=null;log('Deine Partei hat dich ausgeschlossen.')}p.gang={n:pick(GANGS),rank:0,rep:0};addRuf(-15);done('Du gehörst jetzt zu den '+p.gang.n+'.');return 1;
  case 'ga_job':{const g=p.gang,J=GJ[arg];if(!g||!J||g.rank<J[2]||lock||!useAct())return 1;const before=(p.dirty||0)+p.money,pr=p.prison;
    const r=crime(J[3]+p.sk[J[6]]/300+g.rank*.03,R(J[4][0],J[4][1]),J[5],J[0]+' erledigt');const ok=!p.prison&&(p.dirty||0)+p.money>before;
    g.rep=Math.max(0,g.rep+(ok?R(6,12):-5));addRuf(-3);p.sk[J[6]]=Math.min(100,p.sk[J[6]]+2);while(g.rank<4&&g.rep>=GREP[g.rank+1]){g.rank++;log('Aufstieg in der Gang: Du bist jetzt '+GR[g.rank]+'.');if(g.rank===4)mile('Boss der '+g.n,'star')}
    log(r);checkAch();save();render();dialog(J[0],r,[['OK',null]]);return 1}
  case 'ga_buy':{const B=BM.find(x=>x[0]===arg),S=SHOP.find(x=>x.id===arg);if(!B||!S||p.items.includes(arg)||lock)return 1;const c=Math.round(S.pr*B[2]);if(p.money<c)return 1;p.money-=c;addRuf(-3);
    if(ch(.15)){p.money-=1000;p.wanted=Math.min(5,(p.wanted||0)+1);done('Hehlerei aufgeflogen! Ware weg, 1.000 € Strafe.');return 1}p.items.push(arg);if(arg.startsWith('handy'))p.phoneY=p.age;Object.keys(S.e).forEach(k=>add(k,S.e[k]));done(B[1]+' für '+eur(c)+'. Frag nicht, woher.');return 1}
  case 'ga_wash':{if(!p.dirty||lock)return 1;const v=Math.round(p.dirty*.55);p.money+=v;p.dirty=0;done('Der Hehler gibt dir '+eur(v)+' sauberes Geld.');return 1}
  case 'ga_leave':{if(!p.gang)return 1;const n=p.gang.n;p.gang=null;addRuf(5);if(ch(.3)){add('ge',-15);done('Die '+n+' lassen dich nicht einfach gehen. Du landest im Krankenhaus, aber du bist raus.')}else done('Du bist raus bei den '+n+'.');return 1}
  case 'movepick':if(!lock)movePick();return 1;
  }return 0}

function rufCard(){return '<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Ruf</h2><b>'+rufTxt(p.ruf)+'</b></div><div class="rufbar"><i style="left:'+((p.ruf+100)/2)+'%"></i></div><div class="listseg rufl"><span>Skrupellos</span><span>Vorbild</span></div><p class="note">Ehrliche Entscheidungen helfen in Politik und Beruf. Ein schlechter Ruf öffnet Türen im Untergrund und sorgt für Skandale.</p></section>'}
function milesCard(){return card('Meilensteine',p.ms.length?'<div class="tline">'+p.ms.slice().reverse().map(m=>'<div class="tm '+m.k+'"><span>'+m.a+'</span><b>'+esc(m.t)+'</b></div>').join('')+'</div>':'<p class="note">Noch keine. Große Momente landen hier.</p>')}

