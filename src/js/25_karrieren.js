/* ================= Karrieren: Sport, Musik, Politik, Untergrund ================= */
const SPORTS={fussball:'Fußball',basket:'Basketball',tennis:'Tennis',schwimm:'Schwimmen'};
const SLV=['Jugendverein','Amateurliga','Profi 2. Liga','Profi 1. Liga','Nationalteam'];
const PARTIES=[['Bürgerbündnis','#2B59C3','Ordnung, Wirtschaft, Sicherheit'],['Zukunftsliste','#2FA88F','Klima, Bildung, Digitales'],['Soziale Mitte','#E5527A','Gerechtigkeit, Wohnen, Rente']];
const POLO=[['Parteimitglied',0,16],['Stadtrat',8000,21],['Bürgermeister/in',95000,25],['Landtag',115000,28],['Bundestag',130000,30],['Minister/in',190000,35]];
const GANGS=['Hafenwölfe','Nachtfalken','Die Schatten','Rote Kobras'],GR=['Mitläufer/in','Kurier/in','Vollstrecker/in','Rechte Hand','Boss'],GREP=[0,20,50,100,180];
const GJ={liefer:['Lieferung','Ein Päckchen ohne Fragen von A nach B.',0,.75,[800,3000],0,'fahren'],schutz:['Schutzgeld eintreiben','Ladenbesitzer „überzeugen“.',1,.6,[2000,6000],1,'kampf'],
 revier:['Revierkampf','Die andere Gang muss aus dem Viertel.',2,.5,[4000,12000],2,'kampf'],coup:['Großer Coup','Ein Lagerhaus voller Ware.',3,.4,[30000,120000],4,'schloss']};
const BM=[['handy2','Smartphone Pro',.4],['laptop','Laptop',.4],['uhr','Luxusuhr',.35],['kamera','Kamera',.45]];
const SONGW=['Mitternacht','Hafenlicht','Kein Zurück','Sommerregen','Neonherz','Leise','Sturm','Für immer jung','Kopfkino','Goldstaub','Zuhause','Funken'];
let karTab='sport';
function sportYear(){const s=p.spo;if(!s)return;const a=p.age;if(s.inj>0)s.inj--;if(a>=30)s.sk=Math.max(0,s.sk-R(1,4));s.done=false;
  if(p.job&&p.job.id==='sport'){s.fans=Math.round(s.fans*1.05+s.sk*20);
    if(s.lvl===2&&s.sk>=75&&ch(.4))p.q.push({id:'transfer',d:Math.round(p.job.pay*2.2)});
    if(s.lvl>=3&&s.lvl<4&&s.sk>=88&&ch(.35)){s.lvl=4;p.job.pay=Math.round(p.job.pay*1.4);mile('Nationalteam!','star');news(p.first+' '+p.last+' ins Nationalteam berufen','kultur');log('Du wurdest ins Nationalteam berufen!')}
    if(a>=36||(a>=31&&s.sk<45)){log('Karriereende als Profi. Danke für alles, sagen die Fans.');mile('Karriereende als Profi','star');p.job=null;s.lvl=Math.min(s.lvl,3);s.ex=true}}}
function musicYear(R0){const m=p.mus;if(!m)return;m.al=false;m.tr=false;
  if(m.label){const v=Math.round(m.fans*.6);if(v){p.money+=v;R0.inc.push(['Musik: Streams und Konzerte',v])}}
  if(!m.label&&m.fans>=3000&&!m.offer&&ch(.5)){m.offer=true;p.q.push({id:'label'})}
  if(!m.act)m.fans=Math.round(m.fans*.95);m.act=false}
function polYear(R0){const o=p.pol;if(!o)return;o.pop=clamp(o.pop-2,0,100);o.camp=o.camp||0;o.rd=false;
  if(o.lvl===1){const v=POLO[1][1];p.money+=v;R0.inc.push(['Politik: Aufwandsentschädigung Stadtrat',v])}
  if(o.lvl>=1&&p.ruf<-20&&ch(.25)){o.pop=Math.max(0,o.pop-25);news('Skandal um '+p.first+' '+p.last+'!','gross','Die Opposition fordert den Rücktritt.');log('Ein Skandal erschüttert deine politische Karriere.');if(o.lvl>=2&&p.job&&p.job.id==='pol'&&ch(.4)){p.job=null;o.lvl=1;log('Du musst zurücktreten.')}}
  if(o.next&&p.age>=o.next){const L=Math.min(POLO.length-1,o.lvl+1),thr=30+L*8,sc=o.pop*.5+o.camp*.6+p.ruf*.15+p.sk.charme*.15,w=clamp(.5+(sc-thr)/40,.05,.95);
    if(ch(w)){o.lvl=L;o.pop=Math.min(100,o.pop+10);add('gl',12);mile('Gewählt: '+POLO[L][0],'star');news(p.first+' '+p.last+' gewinnt die Wahl','gross','Neues Amt: '+POLO[L][0]+'.');log('Wahlsieg! Du bist jetzt '+POLO[L][0]+'.');
      if(L>=2){p.job={id:'pol',t:POLO[L][0],pay:px$(POLO[L][1]),part:false,yrs:0,perf:50};o.term=p.age+5}}
    else{o.pop=Math.max(0,o.pop-10);add('gl',-8);log('Wahl verloren ('+Math.round(w*100)+' % Chance). Beim nächsten Mal!');news('Niederlage für '+p.first+' '+p.last,'lokal')}
    o.next=null;o.camp=0}
  if(o.term&&p.age>=o.term&&p.job&&p.job.id==='pol'){if(ch(clamp(.3+o.pop/120+p.ruf/400,.1,.9))){o.term=p.age+5;log('Wiedergewählt als '+p.job.t+'!');o.pop=Math.min(100,o.pop+5)}else{log('Du wurdest nicht wiedergewählt.');p.job=null;o.term=null}}}
function gangYear(R0){const g=p.gang;if(!g)return;g.dn=0;
  if(g.rank>=3){const v=R(10,40)*1000*g.rank/3|0;p.dirty=(p.dirty||0)+v;log('Deine Leute bringen dir '+eur(v)+' Schwarzgeld.')}
  if(g.rank>=2&&!p.prison&&ch(.06+(p.wanted||0)*.03)){const y=R(2,5);p.prison=y;p.job=null;g.rank=Math.max(0,g.rank-1);add('gl',-15);ach('knast');news('Razzia bei den '+g.n,'gross');log('Razzia! Die Polizei hat dich erwischt: '+y+' Jahre Haft.')}}
function viewWege(){if(!['sport','musik','politik','gang'].includes(karTab))karTab='sport';const lock=!!p.prison;
  let h='<div class="seg full">'+[['sport','Sport'],['musik','Musik'],['politik','Politik'],['gang','Untergrund']].map(([k,l])=>'<button data-a="kartab" data-g="'+k+'" aria-pressed="'+(karTab===k)+'">'+l+'</button>').join('')+'</div>';
  if(karTab==='sport'){const s=p.spo;
    if(!s)return h+'<section class="card"><h2 class="h">Sportkarriere</h2><p class="note">Fang im Jugendverein an, trainiere hart, überzeuge beim Probetraining und werde Profi. Ab 6 Jahren, bis 25.</p><div class="amts" style="margin-top:8px">'+Object.keys(SPORTS).map(k=>'<button class="amt" data-a="sp_join" data-g="'+k+'"'+(p.age<6||p.age>25||lock?' disabled':'')+'>'+SPORTS[k]+'</button>').join('')+'</div></section>';
    const pro=p.job&&p.job.id==='sport';
    h+='<section class="card"><div class="fh"><span class="fic" style="background:linear-gradient(135deg,#3BB273,#14503A)"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg></span><div><b>'+SPORTS[s.s]+' · '+(s.ex?'Ex-Profi':SLV[s.lvl])+'</b><small>'+esc(s.club)+(pro?' · '+eur(p.job.pay)+' im Jahr':'')+'</small></div></div>'+
      '<div class="stat"><div class="r"><span>Können</span><span>'+Math.round(s.sk)+'</span></div><div class="bar"><i style="width:'+s.sk+'%;background:#2FA88F"></i></div></div><p class="note">Fans: '+kfmt(s.fans)+(s.inj?' · verletzt, noch '+s.inj+' Jahr(e)':'')+'</p></section>';
    if(!s.ex)h+=card('Training und Spiele',row('Training','1 Aktion · Können +',btn('sp_train',null,'Trainieren','o',p.act<=0||lock||s.inj>0))+row('Spieltag','Einmal im Jahr · Minispiel: Reaktion',s.done?'<span class="chip">Gespielt</span>':btn('sp_game',null,'Anpfiff','',lock||s.inj>0))+
      (!pro?row('Probetraining bei einem Profiverein','16–26 Jahre · ab Können 55 · 1 Aktion',btn('sp_trial',null,'Hingehen','o',p.age<16||p.age>26||p.act<=0||lock||s.trY===p.age)):'')+'<p class="note" style="margin-top:6px">Ab Können 75 kommen Angebote von Spitzenvereinen, ab 88 ruft das Nationalteam.</p>');
    return h}
  if(karTab==='musik'){const m=p.mus;
    if(!m)return h+'<section class="card"><h2 class="h">Musikkarriere</h2><p class="note">Gründe eine Band, schreib Songs, spiel Konzerte und hol dir einen Plattenvertrag. Ab 13 Jahren.</p>'+btn('mu_band',null,'Band gründen','o',p.age<13||lock)+'</section>';
    const best=m.songs.length?Math.max(...m.songs.map(x=>x.q)):0;
    h+='<section class="card"><div class="fh"><span class="fic" style="background:linear-gradient(135deg,#8E63D6,#C2306A)"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></span><div><b>'+esc(m.band)+'</b><small>'+(m.label?'Bei einem Label unter Vertrag':'Unabhängig')+' · '+kfmt(m.fans)+' Fans'+(m.hits?' · '+m.hits+' Hit(s)':'')+'</small></div></div>'+
      '<div class="stat"><div class="r"><span>Musikalisches Können</span><span>'+Math.round(m.sk)+'</span></div><div class="bar"><i style="width:'+m.sk+'%;background:#8E63D6"></i></div></div></section>';
    h+=card('Proberaum und Bühne',row('Üben','1 Aktion · Können +',btn('mu_prac',null,'Üben','o',p.act<=0||lock))+row('Song schreiben','1 Aktion · Qualität hängt von Können und Intelligenz ab',btn('mu_song',null,'Schreiben','',p.act<=0||lock))+
      row('Konzert spielen','ab 14 · 1 Aktion · Fans und etwas Geld',btn('mu_gig',null,'Auftreten','o',p.age<14||p.act<=0||lock||!m.songs.length))+
      (m.label?row('Album veröffentlichen','Einmal im Jahr, braucht 3 neue Songs',m.al?'<span class="chip">Erschienen</span>':btn('mu_album',null,'Veröffentlichen','o',lock||m.songs.filter(x=>!x.rel).length<3))+row('Tour','ab 10.000 Fans · einmal im Jahr · Gesundheit −5',m.tr?'<span class="chip">Getourt</span>':btn('mu_tour',null,'Auf Tour gehen','',lock||m.fans<10000)):'<p class="note" style="margin-top:6px">Ab etwa 3.000 Fans melden sich Plattenlabels.</p>'));
    if(m.songs.length)h+=card('Deine Songs',m.songs.slice(-8).reverse().map(s=>row('„'+esc(s.t)+'“',(s.rel?'veröffentlicht':'unveröffentlicht')+(s.hit?' · Hit!':''),qbars(s.q,'#8E63D6'))).join(''));
    return h}
  if(karTab==='politik'){const o=p.pol;
    if(!o)return h+'<section class="card"><h2 class="h">Politik</h2><p class="note">Tritt einer Partei bei, mach dir einen Namen und kandidiere: Stadtrat, Bürgermeister/in, Landtag, Bundestag, Ministeramt. Ab 16 Jahren.</p>'+PARTIES.map((x,i)=>row('<span class="pdot" style="background:'+x[1]+'"></span>'+x[0],x[2],btn('po_join',i,'Beitreten','o',p.age<16||lock||!!p.gang))).join('')+(p.gang?'<p class="note">Mit Gang-Vergangenheit nimmt dich keine Partei.</p>':'')+'</section>';
    const P=PARTIES[o.party],L=Math.min(POLO.length-1,o.lvl+1);
    h+='<section class="card"><div class="fh"><span class="fic" style="background:'+P[1]+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21h16M6 21V10M10 21V10M14 21V10M18 21V10M3 10l9-6 9 6z"/></svg></span><div><b>'+POLO[o.lvl][0]+'</b><small>'+P[0]+' · Ruf: '+rufTxt(p.ruf)+'</small></div></div>'+
      '<div class="stat"><div class="r"><span>Beliebtheit</span><span>'+o.pop+' %</span></div><div class="bar"><i style="width:'+o.pop+'%;background:'+P[1]+'"></i></div></div>'+(o.next?'<div class="stat"><div class="r"><span>Wahlkampf</span><span>'+o.camp+'</span></div><div class="bar"><i style="width:'+Math.min(100,o.camp)+'%;background:#F28C28"></i></div></div><p class="note">Die Wahl ist in '+Math.max(0,o.next-p.age)+' Jahr(en).</p>':'')+'</section>';
    h+=card('Politische Arbeit',row('Parteiarbeit','1 Aktion · Beliebtheit +',btn('po_work',null,'Los','o',p.act<=0||lock))+
      (o.lvl<POLO.length-1?(o.next?row('Plakate kleben','1 Aktion · '+eur(px$(3000))+' · Wahlkampf +15',btn('po_plak',null,'Kleben','',p.act<=0||lock||p.money<px$(3000)))+row('Hausbesuche','1 Aktion · Wahlkampf +',btn('po_camp',null,'Klingeln','',p.act<=0||lock))+row('Große Rede','Einmal im Jahr · Minispiel: Quiz',o.rd?'<span class="chip">Gehalten</span>':btn('po_rede',null,'Ans Pult','o',lock)):
        row('Kandidieren: '+POLO[L][0],'ab '+POLO[L][2]+' Jahren · Wahl nächstes Jahr',btn('po_cand',null,'Antreten','o',p.age<POLO[L][2]||lock))):row('Ganz oben','Du bist Minister/in.'))+
      '<p class="note" style="margin-top:6px">Die Chance hängt von Beliebtheit, Wahlkampf, Ruf und Charme ab. Ein schlechter Ruf führt zu Skandalen.</p>');
    return h}
  const g=p.gang;
  if(!g)return h+'<section class="card"><h2 class="h">Untergrund</h2><p class="note">Schließ dich einer Gang an. Aufträge bringen Schwarzgeld und Ansehen in der Gang, aber Fahndung und Gefängnis drohen. Ab 16 Jahren.</p>'+btn('ga_join',null,'Der Gang beitreten','g',p.age<16||lock||!!(p.pol&&p.pol.lvl>=2))+'</section>';
  const nx=GREP[g.rank+1];
  h+='<section class="card gangc"><div class="fh"><span class="fic" style="background:linear-gradient(135deg,#3A3F4B,#111)"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z"/></svg></span><div><b>'+esc(g.n)+'</b><small>'+GR[g.rank]+' · Ansehen '+g.rep+(nx?' von '+nx:'')+'</small></div></div>'+(nx?'<div class="bar"><i style="width:'+clamp((g.rep-GREP[g.rank])/(nx-GREP[g.rank])*100,0,100)+'%;background:#D64545"></i></div>':'')+
    '<p class="note" style="margin-top:6px">Schwarzgeld: '+eur(p.dirty||0)+' · Fahndung '+(p.wanted||0)+' von 5</p></section>';
  h+=card('Aufträge',Object.keys(GJ).map(k=>{const J=GJ[k];return row(J[0],J[1]+' · '+eur(J[4][0])+'–'+eur(J[4][1]),btn('ga_job',k,g.rank<J[2]?'ab '+GR[J[2]]:'Machen','g',g.rank<J[2]||p.act<=0||lock))}).join(''));
  h+=card('Schwarzmarkt',BM.map(([id,n,f])=>{const S=SHOP.find(x=>x.id===id);return row(n+' (heiß)',eur(Math.round(S.pr*f))+' statt '+eur(S.pr),p.items.includes(id)?'<span class="chip">Besitz</span>':btn('ga_buy',id,'Kaufen','',lock||p.money<S.pr*f))}).join('')+
    row('Hehler','Wäscht Schwarzgeld sofort, nimmt 45 %',btn('ga_wash',null,'Waschen','g',lock||!(p.dirty>0))))+'<button class="btn g" data-a="ga_leave"'+(lock?' disabled':'')+'>Aussteigen</button>';
  return h}

