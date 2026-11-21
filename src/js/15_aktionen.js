/* ---------- Aktionen ---------- */
function newPartner(rel){if(p.stats)p.stats.partners++;p.partner={name:pick(ch(.5)?FN:MN),rel,mar:false};p.chats.partner={msgs:[],un:0};msg('partner','Hey du :) Ich hab die ganze Zeit an dich gedacht.')}
function adoptPet(t,free){const P=PETS[t];if(!free)p.money-=P.pr;p.pets.push({t,n:pick(P.names),age:0});add('gl',8);ach('tier')}
function crime(succ,gain,jail,txt){
  p.crimes++;addRuf(-4);succ=clamp(succ-(p.wanted||0)*.05,.05,.95);p.wanted=Math.min(5,(p.wanted||0)+1);
  if(ch(succ)){add('gl',R(-2,4));if(gain>=1000){p.dirty=(p.dirty||0)+gain;return txt+': +'+eur(gain)+' Schwarzgeld. Waschen kannst du es über die App Geschäfte.'}p.money+=gain;return txt+': +'+eur(gain)+'.'}
  if(p.age<14){add('gl',-6);return 'Erwischt! Deine Eltern holen dich bei der Polizei ab.'}
  if(!jail){p.money-=500;add('gl',-6);return 'Erwischt! Geldstrafe: 500 €.'}
  p.prison=jail;p.job=null;add('gl',-15);ach('knast');sel='jva';return 'Erwischt! Das Gericht verurteilt dich zu '+jail+' Jahr(en) Gefängnis.';
}
const ACTS={
lesen:{n:'Lesen',d:'Intelligenz +',ok:()=>p.age>=5,f:()=>{add('in',R(2,5));return 'Du hast ein Buch verschlungen.'}},
medi:{n:'Meditieren',d:'Glück +',ok:()=>p.age>=8,f:()=>{add('gl',R(3,7));return 'Du fühlst dich ruhiger.'}},
pet:{n:'Mit dem Haustier spielen',d:'Glück +',ok:()=>p.pets.length>0,f:()=>{add('gl',R(4,8));return 'Du kuschelst mit '+p.pets[0].n+'.'}},
kidstime:{n:'Zeit mit den Kindern',d:'Glück +',ok:()=>p.kids.length>0,f:()=>{add('gl',R(4,8));return 'Ein schöner Tag mit den Kindern.'}},
lernen:{n:'Extra lernen',d:'Intelligenz ++',ok:()=>p.age>=6&&p.age<=30,f:()=>{add('in',R(3,6));p.lernN=(p.lernN||0)+1;return 'Du hast fleißig gelernt.'}},
sport:{n:'Training',d:'Gesundheit und Aussehen +',ok:()=>p.age>=6,f:()=>{add('ge',R(2,6));add('au',R(1,3));return 'Du hast dich ausgepowert.'}},
jog:{n:'Joggen',d:'Gesundheit und Glück +',ok:()=>p.age>=8,f:()=>{add('ge',R(2,5));add('gl',R(1,3));return 'Eine Runde durch den Park.'}},
date:{n:'Jemanden kennenlernen',d:'ab 14 Jahren, als Single',ok:()=>p.age>=14&&!p.partner,f:()=>{if(ch(.35+p.st.au/200+p.sk.charme/400)){newPartner(50);add('gl',8);return 'Du bist jetzt mit '+p.partner.name+' zusammen!'}add('gl',-3);return 'Kein Glück diesmal.'}},
party:{n:'Feiern',d:'Glück +, Gesundheit −',ok:()=>p.age>=16,f:()=>{p.partyY=p.age;add('gl',R(5,10));add('ge',-R(0,4));return 'Die Nacht war lang.'}},
arzt:{n:'Check-up beim Arzt',d:'Gesundheit +',ok:()=>true,f:()=>{add('ge',R(4,12));return 'Check-up erledigt.'}},
op:{n:'Schönheits-OP (6.000 €)',d:'Aussehen ++, mit Risiko',ok:()=>p.age>=18,f:()=>{if(p.money<6000)return null;p.money-=6000;if(ch(.12)){add('ge',-20);return 'Komplikationen bei der OP!'}add('au',R(10,20));return 'Das Ergebnis kann sich sehen lassen.'}},
urlaub:{n:'Urlaub buchen (1.500 €)',d:'Glück ++',ok:()=>p.age>=18,f:()=>{if(p.money<1500)return null;p.money-=1500;p.travelY=p.age;add('gl',R(10,18));return 'Erholt aus dem Urlaub zurück.'}},
lotto:{n:'Lotto spielen (20 €)',d:'winzige Chance auf 1 Mio.',ok:()=>p.age>=18,f:()=>{p.money-=20;if(ch(.0005)){p.money+=1000000;add('gl',30);ach('jackpot');return 'JACKPOT! 1.000.000 €!'}if(ch(.05)){p.money+=200;return '200 € gewonnen.'}return 'Kein Gewinn.'}},
race:{n:'Straßenrennen (Einsatz 1.000 €)',d:'braucht ein Auto, illegal',crime:1,ok:()=>p.age>=18&&p.cars.length>0,f:()=>{if(p.money<1000)return null;p.crimes++;
  if(ch(.12)){p.money-=3000;add('gl',-8);return 'Polizeikontrolle! Einsatz weg und 2.000 € Strafe.'}
  const sp=Math.max(...p.cars.map(c=>CARS[c].sp))+(p.biz&&p.biz.fronts.includes('werkstatt')?.1:0)+p.sk.fahren/250;p.sk.fahren=Math.min(100,p.sk.fahren+2);if(ch(.45+sp)){p.money+=1000;p.wins++;add('gl',6);if(p.wins>=3)ach('renner');return 'Gewonnen! +1.000 €. Siege: '+p.wins+'.'}p.money-=1000;return 'Verloren. Der Einsatz ist weg.'}},
klau:{n:'Ladendiebstahl',d:'Kriminalität',crime:1,ok:()=>p.age>=10,f:()=>crime(.7,R(20,150),0,'Du hast etwas mitgehen lassen')},
tasche:{n:'Taschendiebstahl',d:'Kriminalität',crime:1,ok:()=>p.age>=12,f:()=>crime(.6,R(50,400),1,'Du hast eine Geldbörse geklaut')},
einbruch:{n:'Einbruch in eine Villa',d:'Kriminalität, hohes Risiko',crime:1,ok:()=>p.age>=16,f:()=>crime(.45+p.sk.schloss/250,R(2000,12000),R(1,3),'Der Einbruch hat geklappt')},
bankraub:{n:'Banküberfall',d:'Kriminalität, extremes Risiko',crime:1,ok:()=>p.age>=18,f:()=>crime(.2,R(50000,250000),R(5,10),'Der Banküberfall ist geglückt')},
hack:{n:'Hacken',d:'braucht Intelligenz 75 %, Informatik oder Hacken 50',crime:1,ok:()=>p.age>=16&&(p.st.in>=75||p.deg==='Informatik'||p.sk.hack>=50),f:()=>crime(.5+p.sk.hack/200,R(20000,80000),R(2,5),'Du hast ein Firmenkonto gehackt')}};
const PRISON_OK=['sport','lesen'];
function can(id){const A=ACTS[id];return A.ok()&&!(p.world&&p.world.ph==='pandemie'&&(id==='party'||id==='urlaub'))&&(!p.prison||PRISON_OK.includes(id))&&p.act>0}
function done(t){sfx('tap');log(t);checkAch();save();render();toast(t)}
function canJob(j){
  if(p.prison)return 'nicht im Gefängnis';
  if(p.age<j.min)return 'ab '+j.min+' Jahren';
  if(j.max&&p.age>j.max)return 'bis '+j.max+' Jahre';
  if(p.age>=67)return 'Du bist in Rente';
  if(!j.part&&inSchool())return 'nicht neben Schule, Studium oder Ausbildung';
  if(j.edu&&RANK[p.edu]<j.edu)return j.edu===2?'braucht Abitur':'braucht Schulabschluss';
  if(j.aus&&!p.aus)return 'braucht Ausbildung';
  if(j.deg&&p.deg!==j.deg)return 'braucht Studium '+j.deg;
  if(j.fol&&!(p.sm&&(p.sm.fol>=j.fol||(p.sm.ch&&p.sm.ch.subs>=5000))))return 'braucht '+kfmt(j.fol)+' Follower oder 5.000 Abos auf Klick';
  for(const k of ['ge','in','au'])if(j[k]&&p.st[k]<j[k])return 'braucht '+STAT[k]+' '+j[k]+' %';
  return '';
}
function act(id,arg){
  if(!p||!p.alive)return;CUR=id;
  if(ACTS[id]){const A=ACTS[id];if(!can(id)||!useAct())return;const r=A.f();if(r===null){refundAct();toast('Dafür hast du nicht genug Geld.');return}
    if(A.crime){log(r);checkAch();save();render();dialog(A.n,r,[['OK',null]])}else done(r);return}
  if(act2(id,arg)||act3(id,arg)||act4(id,arg)||act5(id,arg)||act6(id,arg)||act7(id,arg)||act8(id,arg)||act9(id,arg)||act10(id,arg)||act11(id,arg)||act12(id,arg)||act13(id,arg))return;
  switch(id){
  case 'goto':tab=arg;if(arg==='stadt')sel=null;if(p.appSeen)p.appSeen[arg]=1;if(arg==='store')p.storeY=p.age;if(arg==='klick'&&p.sm)p.sm.nf=0;if(arg==='chats')chatSel=null;render();if(arg==='jobs')p.seenJobs=JOBS.filter(j=>!canJob(j)).map(j=>j.id);window.scrollTo(0,0);break;
  case 'apply':{const j=JOBS.find(x=>x.id===arg);if(canJob(j)||!useAct())return;
    interview(j,bon=>{if(ch(.45+p.st.in/250+p.st.au/500+p.sk.charme/500+bon)){p.job={id:j.id,t:j.t,pay:j.pay,part:!!j.part,yrs:0,perf:50};add('gl',6);ach('job');if(p.stats)p.stats.jobs++;p.chats.chef={msgs:[],un:0};if(j.id==='influ')msg('freund','Du bist jetzt hauptberuflich Influencer/in?! Wie cool ist das denn!');else msg('chef','Willkommen im Team! Morgen um 8 geht es los.');done('Du bist jetzt '+j.t+'.')}else done('Absage als '+j.t+'. Versuch es nochmal.')});break}
  case 'work':shift();break;
  case 'quit':if(!p.job)return;{const t=p.job.t;p.job=null;done('Du hast als '+t+' gekündigt.')}break;
  case 'study':if(p.edu!=='Abitur'||inSchool()||p.age<17||p.prison||p.deg)return;if(p.job&&!p.job.part)p.job=null;p.study={f:arg,left:STUDY[arg]};done('Du studierst jetzt '+arg+'.');break;
  case 'azubi':if(RANK[p.edu]<1||inSchool()||p.aus||p.prison)return;if(p.job&&!p.job.part)p.job=null;p.azubi={left:3};done('Du hast eine Ausbildung begonnen.');break;
  case 'time':if(!p.partner||!useAct())return;p.partner.rel=Math.min(100,p.partner.rel+R(6,12));add('gl',3);done('Schöne Zeit mit '+p.partner.name+'.');break;
  case 'propose':if(!p.partner||p.partner.mar||p.age<18||p.prison||!useAct())return;
    if(ch(p.partner.rel/110+p.sk.charme/300)){p.partner.mar=true;p.money-=8000;add('gl',15);ach('heirat');msg('partner','Bester Tag meines Lebens!');done(p.partner.name+' hat Ja gesagt! Die Hochzeit kostet 8.000 €.')}else{p.partner.rel-=10;add('gl',-8);done(p.partner.name+' hat Nein gesagt …')}break;
  case 'baby':if(!p.partner||p.age<18||p.age>48||p.prison||!useAct())return;
    if(ch(.55)){const n=pick((ch(.5)?FN:MN).filter(x=>!p.kids.some(k=>k.n===x)&&x!==p.first));p.kids.push({n,b:p.age});add('gl',12);ach('kind');mile(n+' ist geboren','kid');if(!p.parentsGone)msg('mama','Ich bin Oma geworden?! Ich freu mich so!');done(n+' ist geboren!')}else done('Diesmal hat es nicht geklappt.');break;
  case 'split':if(!p.partner)return;{const nm=p.partner.name,m=p.partner.mar;if(m&&p.money>0)p.money=Math.round(p.money*.7);p.partner=null;add('gl',-10);done(m?'Scheidung von '+nm+'. Das kostet 30 % deines Geldes.':'Du hast mit '+nm+' Schluss gemacht.')}break;
  case 'home':{if(p.home==='eigen')(p.props||[]).forEach(x=>{if(x.use==='self')x.use='leer'});const h=HOMES[arg];if(p.age<h.min||p.home===arg||p.prison)return;if(h.study&&!p.study){toast('Nur für Studierende.');return}
    if(h.buy&&!p.owned.includes(arg)){const pr=px$(h.buy);if(p.money<pr){toast(h.n+' kostet '+eur(pr)+'.');return}p.money-=pr;p.owned.push(arg);ach('haus')}if(p.rented)delete p.rented[arg];
    p.home=arg;add('gl',2);done('Du wohnst jetzt: '+h.n+'.');break}
  case 'sellhome':{if(!p.owned.includes(arg)||p.home===arg)return;const v=Math.round(px$(HOMES[arg].buy)*.92);p.owned=p.owned.filter(k=>k!==arg);if(p.rented)delete p.rented[arg];p.money+=v;done(HOMES[arg].n+' für '+eur(v)+' verkauft.');break}
  case 'buycar':{const c=CARS[arg];if(p.age<18||p.prison)return;if(p.money<c.pr){toast(c.n+' kostet '+eur(c.pr)+'.');return}p.money-=c.pr;p.cars.push(arg);add('gl',arg==='sport'?10:5);done('Du hast jetzt einen '+c.n+'.');break}
  case 'sellcar':{const i=p.cars.indexOf(arg);if(i<0)return;p.cars.splice(i,1);const v=Math.round(CARS[arg].pr*.5);p.money+=v;done(CARS[arg].n+' für '+eur(v)+' verkauft.');break}
  case 'buy':{const s=SHOP.find(x=>x.id===arg);if(p.items.includes(arg)||p.age<s.min||p.prison)return;if(p.money<s.pr){toast(s.n+' kostet '+eur(s.pr)+'.');return}
    p.money-=s.pr;p.items.push(arg);if(arg.startsWith('handy'))p.phoneY=p.age;Object.keys(s.e).forEach(k=>add(k,s.e[k]));done('Gekauft: '+s.n+'.');break}
  case 'adopt':{const P=PETS[arg];if(p.age<8||p.prison)return;if(p.money<P.pr){toast('Das kostet '+eur(P.pr)+'.');return}adoptPet(arg);done('Ein '+P.n+' namens '+p.pets[p.pets.length-1].n+' zieht bei dir ein.');break}
  case 'dep':{const v=arg==='all'?Math.max(0,p.money):Math.min(1000,p.money);if(v<=0)return;p.money-=v;p.sav+=v;done(eur(v)+' aufs Sparkonto gelegt.');break}
  case 'wd':{const v=arg==='all'?p.sav:Math.min(1000,p.sav);if(v<=0)return;p.sav-=v;p.money+=v;done(eur(v)+' vom Sparkonto abgehoben.');break}
  case 'loan':if(p.age<18||p.loan>=50000)return;p.loan+=10000;p.money+=10000;done('Kredit über 10.000 € aufgenommen (8 % Zinsen pro Jahr).');break;
  case 'repay':{const v=Math.min(p.loan,1000,Math.max(0,p.money));if(v<=0)return;p.loan-=v;p.money-=v;done(eur(v)+' Kredit getilgt.');break}
  case 'buyst':{ensureStocks();const [id,amt]=arg.split(':');const s=STK[id];if(p.age<18||p.prison)return;const v=amt==='all'?Math.floor(Math.max(0,p.money)):+amt;
    if(v<1||p.money<v){toast('Dafür reicht dein Kontostand nicht.');return}p.money-=v;p.sh[id]=(p.sh[id]||0)+v/p.px[id];p.cost[id]=(p.cost[id]||0)+v;done('Aktien von '+s.n+' für '+eur(v)+' gekauft.');break}
  case 'sellst':{ensureStocks();const [id,part]=arg.split(':');const n=p.sh[id]||0;if(!n)return;const f=part==='half'?.5:1;const v=Math.round(n*f*p.px[id]);
    p.money+=v;p.sh[id]=n*(1-f);p.cost[id]=(p.cost[id]||0)*(1-f);if(f===1)p.sh[id]=0;done((f===1?'Alle':'Die Hälfte der')+' Aktien von '+STK[id].n+' für '+eur(v)+' verkauft.');break}
  case 'stock':stockSel=arg||null;render();window.scrollTo(0,0);break;
  case 'range':stockRange=+arg;render();break;
  case 'newcity':movePick();break;
  case 'mode':cityMode=arg;render();break;
  case 'cofound':{ensureBiz();if(p.biz.co||p.age<18||p.prison)return;if(p.money<CO_COST){toast('Die Gründung kostet '+eur(CO_COST)+'.');return}const nm=(drafts.coName||'').trim()||p.last+' GmbH';p.money-=CO_COST;p.biz.co={name:nm,a:p.age};drafts.coName='';ach('unternehmer');done(nm+' ist gegründet und im Handelsregister eingetragen.');break}
  case 'holding':if(!p.biz.co||p.biz.hold||p.money<HOLD_COST||p.prison)return;p.money-=HOLD_COST;p.biz.hold=true;done(p.biz.co.name+' ist jetzt eine Holding.');break;
  case 'front':{const F=FR[arg];if(!p.biz.co||p.biz.fronts.includes(arg)||p.prison)return;if(p.money<F.cost){toast(F.n+' kostet '+eur(F.cost)+'.');return}p.money-=F.cost;p.biz.fronts.push(arg);done(F.n+' gehört jetzt dir.');break}
  case 'sellfront':{if(!p.biz.fronts.includes(arg))return;p.biz.fronts=p.biz.fronts.filter(k=>k!==arg);const v=Math.round(FR[arg].cost*.7);p.money+=v;done(FR[arg].n+' für '+eur(v)+' verkauft.');break}
  case 'firm':{const F=FI[arg];if(!p.biz.co||p.biz.firm||p.prison||(F.hold&&!p.biz.hold))return;if(p.money<F.cost){toast('Dafür brauchst du '+eur(F.cost)+'.');return}const nm=(drafts.firmName||'').trim()||(p.last+' '+F.n);p.money-=F.cost;p.biz.firm={name:nm,t:arg,val:F.cost,emp:0,mkt:0,yrs:0,ipo:false,hist:[F.cost],last:null};drafts.firmName='';done('Deine Firma '+nm+' ist gestartet.');break}
  case 'f_hire':{const f=p.biz.firm;if(!f||f.ipo||f.emp>=20||p.prison||!useAct())return;f.emp++;done('Neue Person eingestellt. Team: '+f.emp+'.');break}
  case 'f_fire':{const f=p.biz.firm;if(!f||!f.emp)return;f.emp--;done('Eine Person entlassen. Team: '+f.emp+'.');break}
  case 'f_mkt':{const f=p.biz.firm,c=Math.round(f?f.val*.05:0);if(!f||f.ipo||f.mkt||p.money<c||p.prison||!useAct())return;p.money-=c;f.mkt=.1;done('Werbekampagne für '+f.name+' läuft: +10 % Wachstum im nächsten Jahr.');break}
  case 'f_inv':{const f=p.biz.firm,v=+arg;if(!f||f.ipo||p.money<v||p.prison)return;p.money-=v;f.val+=v;done(eur(v)+' in '+f.name+' investiert.');break}
  case 'f_ipo':{const f=p.biz.firm;if(!f||f.ipo||f.val<1e6||p.prison)return;ensureStocks();f.ipo=true;regMyStock();const tot=f.val/10;p.px.my=10;p.prev.my=10;p.hist.my=[10];p.sh.my=tot*.6;p.cost.my=f.val*.6;const cash=Math.round(f.val*.4);p.money+=cash;ach('ipo');log(f.name+' geht an die Börse!');done('Börsengang geschafft! Du bekommst '+eur(cash)+' und behältst 60 % der Aktien.');break}
  case 'f_sell':{const f=p.biz.firm;if(!f||f.ipo)return;const v=Math.round(f.val*.8);p.money+=v;p.biz.firm=null;done(f.name+' für '+eur(v)+' verkauft.');break}
  case 'shopcat':shopCat=arg;render();break;
  case 'shopfound':{if(!p.biz.co||p.biz.shop||p.prison)return;if(p.money<SHOP_COST){toast('Die Gründung kostet '+eur(SHOP_COST)+'.');return}const nm=(drafts.shopName||'').trim()||p.first+'s Shop';p.money-=SHOP_COST;p.biz.shop={name:nm,cat:shopCat,lvl:1,yrs:0,svc:{tech:'self',mkt:'self',foto:'self',vers:'self'}};drafts.shopName='';done('Dein Onlineshop '+nm+' ist online.');break}
  case 'svc':{const [k,v]=arg.split(':');if(!p.biz.shop)return;p.biz.shop.svc[k]=v;save();render();break}
  case 'shoplvl':{const s=p.biz.shop,c=s?5000*s.lvl:0;if(!s||p.money<c||p.prison)return;p.money-=c;s.lvl++;done('Sortiment erweitert: Stufe '+s.lvl+'.');break}
  case 'shopclose':{if(!p.biz.shop)return;const n=p.biz.shop.name;p.biz.shop=null;done(n+' ist geschlossen.');break}
  case 'bankbuy':{if(!p.biz.hold||p.biz.bank||p.money<BANK_COST||p.prison)return;p.money-=BANK_COST;p.biz.bank={name:p.biz.co.name+' Privatbank',dep:2000000};ach('bankier');done('Die '+p.biz.bank.name+' hat eröffnet.');break}
  case 'bizhelp':dialog('So funktioniert Schwarzgeld','Beute aus Einbrüchen, Hacks und Überfällen ab 1.000 € ist Schwarzgeld. Ausgeben kannst du es erst, wenn es gewaschen ist. Jedes Geschäft wäscht pro Jahr eine feste Summe und behält 15 %. Viel Schwarzgeld macht Razzien wahrscheinlicher: Dann ist die Hälfte weg, und bei großen Summen droht Gefängnis.',[['Verstanden',null]]);break;
  case 'cheat':{const now=Date.now();if(now-cheatT>2500)cheatTaps=0;cheatT=now;cheatTaps++;if(cheatTaps>=7){cheatTaps=0;p.cheat=!p.cheat;save();render();toast(p.cheat?'Glückssträhne aktiviert':'Glückssträhne beendet')}break}
  case 'castab':if(casBusy)return;casTab=arg;casMsg='';render();break;
  case 'bet':if(casBusy||(bj&&bj.st==='play'))return;casBet=arg==='all'?Math.floor(Math.max(0,p.money)):+arg;render();break;
  case 'spin':spin();break;
  case 'rl':rlSpin();break;
  case 'rlbet':if(casBusy)return;rlBet=arg;render();break;
  case 'rlnum':rlNum=clamp(+arg,0,36);render();break;
  case 'bjdeal':bjDeal();break;
  case 'bjhit':bjHit();break;
  case 'bjstand':bjStand();break;
  case 'bjdouble':bjDouble();break;
  case 'chat':chatSel=arg||null;render();window.scrollTo(0,0);break;
  case 'call':{if(p.prison||!useAct())return;if(String(arg).startsWith('sib'))relUp(arg,8);if(p.rel&&p.rel[arg]!=null)p.rel[arg]=Math.min(100,p.rel[arg]+8);if(String(arg).startsWith('kid')){const k=p.kids[+arg.slice(3)];if(k)k.rel=Math.min(100,k.rel+6)}if(arg==='rival'&&p.rival&&p.age>=25&&ch(.1)){p.rival.friend=true;mile('Frieden mit '+p.rival.n,'star')}msg(arg,'Ich ruf dich gleich mal an!',true);msg(arg,pick(['Schön, dass du anrufst!','Endlich meldest du dich :)','Hab mich so gefreut, deine Stimme zu hören!']));p.chats[arg].un=0;add('gl',R(3,6));done('Ihr habt lange telefoniert.');break}
  case 'meet':{if(p.prison||!useAct())return;if(p.rel)p.rel.freund=Math.min(100,p.rel.freund+10);msg('freund','Lust, heute was zu machen?',true);msg('freund',pick(['Klar! Bin in 20 Minuten da.','Immer! Kino oder Pizza?','Ja!! Endlich.']));p.chats.freund.un=0;add('gl',R(5,9));done('Ein toller Tag mit '+p.friend+'.');break}
  case 'love':{if(!p.partner||p.prison||p.loveA===p.age)return;p.loveA=p.age;msg('partner',pick(['Ich denk an dich.','Hab dich lieb!','Freu mich auf heute Abend.']),true);msg('partner',pick(['Ich dich auch <3','Du bist süß.','Kann es kaum erwarten!']));p.chats.partner.un=0;p.partner.rel=Math.min(100,p.partner.rel+4);done('Du hast '+p.partner.name+' eine liebe Nachricht geschickt.');break}
  case 'smjoin':if(p.age<13||p.sm)return;smJoin();msg('freund','Du bist jetzt auf Klick? Folge dir!');done('Dein Klick-Konto '+p.sm.h+' ist online.');break;
  case 'smtab':smTab=arg;render();break;
  case 'post':doPost(arg);break;
  case 'video':doVideo(arg);break;
  case 'live':doLive();break;
  case 'deal':{const [i,ok]=arg.split(':'),sm=p.sm,d=sm&&sm.deals[+i];if(!d)return;sm.deals.splice(+i,1);
    if(ok==='1'){if(p.prison)return;p.money+=d.pay;p.yr.social+=d.pay;sm.trust=Math.max(10,sm.trust-8);sm.dyr++;let t='Deal mit '+d.b+': +'+eur(d.pay)+'.';
      if(sm.dyr>2){smGain(-sm.fol*.05);t+=' Deine Fans finden, dass es zu viel Werbung wird.'}done(t)}
    else{sm.trust=Math.min(100,sm.trust+2);done('Du hast '+d.b+' abgesagt. Deine Fans mögen das.')}break}
  case 'sel':selectPlace(arg);if(cityMode==='list'||!G)setTimeout(()=>{const x=document.querySelector('.xbtn');if(x&&x.scrollIntoView)x.closest('section').scrollIntoView({behavior:'smooth',block:'start'})},60);break;
  }
}

