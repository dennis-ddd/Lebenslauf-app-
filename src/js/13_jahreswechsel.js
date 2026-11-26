/* ---------- Ein Jahr vergeht ---------- */
function ageUp(){
  if(!p||!p.alive||document.getElementById('modal').classList.contains('on'))return;
  ensureNew();
  const R0={st:Object.assign({},p.st),m0:p.m0,inc:[],out:[]};
  p.age++;const a=p.age;
  if(a===6){p.school='Grundschule';log('Du bist in die Grundschule gekommen.')}
  else if(a===10){p.school=p.st.in>=55?'Gymnasium':p.st.in>=38?'Realschule':'Hauptschule';log(p.school==='Gymnasium'?'Du wechselst aufs Gymnasium.':'Du wechselst auf die '+p.school+'.')}
  else if(p.school==='Realschule'&&a>=16+(p.rep||0)){p.school=null;p.edu='Realschule';log('Realschulabschluss mit Note '+grade()+'.');msg('papa','Realschulabschluss! Ich bin so stolz auf dich.')}
  else if(p.school==='Gymnasium'&&a>=18+(p.rep||0)&&!(p.gr&&p.gr.avg>4)){p.school=null;p.edu='Abitur';log('Abitur bestanden mit Note '+grade()+'!');add('gl',8);ach('abi');msg('papa','Abitur in der Tasche! Ich bin so stolz auf dich.')}
  schoolAge(a);if(p.school)add('in',R(0,3));
  if(p.study){p.study.left--;add('in',R(1,3));if(p.study.left<=0){p.deg=p.study.f;p.study=null;log('Studium '+p.deg+' abgeschlossen!');add('gl',10);ach('studium');msg('mama','Mein Kind hat einen Abschluss in '+p.deg+'! Ich hab es allen erzählt.')}}
  if(p.azubi){p.azubi.left--;if(p.azubi.left<=0){p.azubi=null;p.aus=true;log('Ausbildung abgeschlossen!');add('gl',6)}}
  if(p.prison>0){p.prison--;add('gl',-6);log(p.prison>0?'Noch '+p.prison+' Jahr(e) im Gefängnis.':'Du bist wieder frei!');if(p.prison>0&&!p.parentsGone)msg('mama','Ich besuch dich am Sonntag. Halt durch.')}
  // Arbeit
  let sal=0;
  if(p.job&&!p.prison){
    const J=JOBS.find(j=>j.id===p.job.id);p.job.yrs++;
    if(p.job.id!=='influ'){sal=Math.round(p.job.pay*cityF(0));
      if(J&&J.max&&a>J.max){log('Karriereende als '+p.job.t+'.');p.job=null}
      else if(p.job.perf>70&&ch(.35)){p.job.rank=Math.min(4,(p.job.rank||1)+1);p.job.pay=Math.round(p.job.pay*((p.job.rank||1)<4?1.2:1.08));log('Beförderung! Neues Gehalt: '+eur(p.job.pay)+' pro Jahr.');add('gl',6);ach('befoerd');msg('chef','Glückwunsch zur Beförderung! Sie haben es sich verdient.')}
      else if(p.job.perf<25&&ch(.4)){msg('chef','Wir müssen uns leider von Ihnen trennen.');log('Du wurdest als '+p.job.t+' entlassen.');p.job=null;add('gl',-10)}
      if(p.job)p.job.perf+=Math.sign(50-p.job.perf)*5}}
  const smi=smYear();if(p.job&&p.job.id==='influ')p.job.pay=smi;const BZ=bizYear();
  const azubi=p.azubi?12000:0,pocket=a>=6&&a<18?(cfg().wealth==='arm'?0:cfg().wealth==='reich'?1200:300):0;
  const gross=sal+azubi+p.pension+smi,tax=incTax(gross+BZ.taxable);
  const wohnen=Math.round(cityF(1)*(a>=18?px$(HOMES[p.home].c+(p.home==='eltern'?1200:0)+(rentedHome()?(p.rentX||0):0))+p.owned.filter(k=>k!==p.home).reduce((t,k)=>t+px$(HOMES[k].c),0):0)),kids=p.kids.filter(k=>a-k.b<18).length*3000,
    cars=p.cars.reduce((s,c)=>s+CARS[c].c,0),pets=p.pets.reduce((s,x)=>s+PETS[x.t].c,0),zins=0;
  p.money+=gross-tax-wohnen-kids-cars-pets-zins+pocket;
  const BK=bankYear(),HY=homeYear(),LY=lifeYear(),PY=propYear(),si=BK.si;p.wanted=Math.max(0,(p.wanted||0)-1);
  // Börse
  ensureStocks();let dv=0;
  STOCKS.forEach(s=>{const o=p.px[s.id];p.prev[s.id]=o;const n=stepPrice(s,o);p.px[s.id]=n;p.hist[s.id].push(n);if(p.hist[s.id].length>80)p.hist[s.id].shift();dv+=(p.sh[s.id]||0)*n*s.div});
  dv=Math.round(dv);p.money+=dv;
  {const mv=STOCKS.map(s=>[s,(p.px[s.id]/p.prev[s.id]-1)*100]).sort((x,y)=>Math.abs(y[1])-Math.abs(x[1]))[0];const pc=Math.abs(mv[1]).toFixed(0);
   const why=mv[1]>=0?pick(['Rekordgewinn gemeldet','neuer Großauftrag','Analysten begeistert','Übernahmegerüchte']):pick(['Gewinnwarnung','Chef tritt zurück','Skandal um Produkte','schwaches Jahr']);
   p.mnews.unshift({a:p.age,t:mv[0].n+' '+(mv[1]>=0?'+':'−')+pc+' %: '+why});p.mnews=p.mnews.slice(0,5)}
  R0.inc=[['Gehalt',sal],['Ausbildungsvergütung',azubi],['Rente',p.pension],['Taschengeld',pocket],['Klick: Abos, Sponsoren, Merch & Werbung',smi],['Klick: Deals & Spenden',p.yr.social],['Dividenden',dv],['Sparzinsen',si],['Mieteinnahmen',HY.rent],['Immobilien: Mieten',PY.rent]].concat(BZ.inc,[['Casino-Gewinne',Math.max(0,p.yr.casino)]]);
  R0.out=[['Steuern',tax],['Wohnen',wohnen],['Kinder',kids],['Autos',cars],['Haustiere',pets],['Kreditraten',BK.raten],['Personal',HY.staff],['Reparaturen',HY.repair],['Immobilien: Unterhalt & Schäden',PY.cost],['Lebensstil',LY.ls-(LY.gym||0)],['Fitnessstudio-Abo (12 × '+eur((LY.gym||0)/12)+')',LY.gym||0],['Behandlungen',LY.treat]].concat(BZ.out,[['Casino-Verluste',Math.max(0,-p.yr.casino)]]);
  lifeX(R0);p.fin.push({a:p.age,inc:R0.inc.filter(x=>x[1]>0).map(x=>[x[0],Math.round(x[1])]),out:R0.out.filter(x=>x[1]>0).map(x=>[x[0],Math.round(x[1])])});if(p.fin.length>15)p.fin.shift();
  p.yr={social:0,casino:0};
  if(p.money<0){add('gl',-8);if(a>=18){log('Du bist im Minus: '+eur(p.money)+'.');if(!p.parentsGone)msg('mama','Brauchst du Hilfe mit Geld? Sag ruhig Bescheid.')}}
  add('gl',Math.round(HOMES[p.home].gl/2));if(p.home==='eltern'&&a>=26)add('gl',-3);
  if(a===67&&p.job){p.pension=Math.round((p.job.pay||30000)*.45);log('Du gehst in Rente: '+eur(p.pension)+' pro Jahr.');p.job=null}
  // Beziehungen, Tiere, Nachrichten
  if(p.partner){p.partner.rel+=R(-6,3);if(p.partner.rel<12){log(p.partner.name+' hat dich verlassen.');p.partner=null;add('gl',-12)}else if(p.partner.rel<30)msg('partner','Wir müssen reden.')}
  p.pets=p.pets.filter(x=>{x.age++;if(x.age>=PETS[x.t].life&&ch(.5)){log('Dein '+PETS[x.t].n+' '+x.n+' ist gestorben.');add('gl',-10);return false}return true});
  if(!p.parentsGone&&a+p.pa>=86&&ch(.35)){p.parentsGone=true;log('Deine Eltern sind in hohem Alter verstorben.');parentInherit();add('gl',-15)}
  if(a>=8&&!p.parentsGone)msg('mama','Alles Gute zum '+a+'. Geburtstag, mein Schatz!');
  if(a>=8&&ch(.7))msg('freund',pick(['Happy Birthday!! Party?','Alles Gute, alte Socke!','Noch ein Jahr älter, haha. Alles Gute!']));
  for(let ci=0;ci<(a>=16?2:1);ci++)if(a>=8&&ch(.5)){const who=pick(['mama','papa','freund'].filter(k=>k==='freund'?a>=10:!p.parentsGone));const POOL=a<13?CHAT_KID:a<18?CHAT_TEEN:CHAT_SMALL;if(who&&POOL[who]){const t=typeof chatPick==='function'?chatPick(who,POOL[who]):pick(POOL[who]);if(t)msg(who,t)}}
  p.trend=pick(TRENDS.filter(k=>k!==p.trend));
  // Körper
  if(a>45)add('ge',-R(0,2));if(a>65)add('ge',-R(1,4));if(a>30)add('au',-R(0,1));
  add('gl',R(-3,3));checkAch();p.act=actBase()+(p.job&&p.job.id==='influ'?2:0)+(p.staff&&p.staff.fahrer?2:0);p.clock=DAYSTART;
  const risk=LY.risk+(p.st.ge<=0?1:0)+(a>65?(a-65)*.008:0)+(p.st.ge<20?.08:0);
  if(!p.sb&&ch(risk)){die(p.st.ge<20?'an einer schweren Krankheit':'friedlich im Schlaf');return}
  p.m0=p.money;save();render();
  const ev=EVENTS.filter(e=>e.c()),next=nextEvent()||(ev.length&&ch(evRate())?pickEv(ev):null);
  recap(R0,()=>{if(next)showEvent(next)});
}
function die(c){sfx('bad');vib(300);p.alive=false;p.cause=c;log('Du bist '+c+' gestorben.');save();render()}
function htmlDialog(html,label,then,cls){
  const d=document.getElementById('dlg'),m=document.getElementById('modal');d.className='dlg'+(cls?' '+cls:'');
  d.innerHTML=html+'<div class="ch"><button class="btn o" data-o="0">'+esc(label)+'</button></div>';m.classList.add('on');d.scrollTop=0;
  d.querySelector('[data-o]').onclick=()=>{m.classList.remove('on');d.className='dlg';if(then)then()};d.querySelector('[data-o]').focus();
}
function recap(R0,then){
  const a=p.age,newLook=stageOf(a)!==stageOf(a-1);
  const st=Object.keys(STAT).map(k=>{const d=p.st[k]-R0.st[k];return '<span class="dchip '+(d>0?'pos':d<0?'neg':'')+'">'+STAT[k]+' <b>'+(d>0?'+':d<0?'−':'±')+Math.abs(d)+'</b></span>'}).join('');
  const li=(arr,sg)=>arr.filter(x=>x[1]>0).map(x=>'<div class="mrow"><span>'+x[0]+'</span><b class="'+(sg>0?'up':'down')+'">'+(sg>0?'+':'−')+eur(x[1])+'</b></div>').join('');
  const ti=R0.inc.reduce((s,x)=>s+x[1],0),to=R0.out.reduce((s,x)=>s+x[1],0);
  const evs=p.log.filter(e=>e.a===a).slice(-5);
  let h='<div class="conf" aria-hidden="true">'+Array.from({length:16},(_,i)=>'<i style="left:'+(i*6+3)+'%;background:'+['#F28C28','#2B59C3','#E5527A','#3BB273','#F2C14E'][i%5]+';animation-delay:'+(i%6*.07)+'s"></i>').join('')+'</div>';
  h+='<div class="rhead"><div class="rav'+(newLook?' new':'')+'">'+avatarSvg(a,newLook?116:88)+'</div><div><small>Alles Gute zum Geburtstag!</small><b class="rage">'+a+'</b><small>Jahre alt</small></div></div>';
  if(newLook)h+='<p class="look">Neuer Look: '+STAGE_N[stageOf(a)]+'</p>';
  h+='<div class="dchips">'+st+'</div>';
  if(ti||to)h+='<div class="mbox"><div class="mt">Einnahmen</div>'+(li(R0.inc,1)||'<div class="mrow"><span>keine</span></div>')+'<div class="mt">Ausgaben</div>'+(li(R0.out,-1)||'<div class="mrow"><span>keine</span></div>')+
    '<div class="mrow tot"><span>Bilanz des Jahres</span><b class="'+(ti-to>=0?'up':'down')+'">'+(ti-to>=0?'+':'−')+eur(Math.abs(ti-to))+'</b></div><div class="mrow"><span>Kontostand</span><b>'+eur(R0.m0)+' → '+eur(p.money)+'</b></div></div>';
  if(evs.length)h+='<div class="mt">Dein Jahr</div><ul class="evl">'+evs.map(e=>'<li>'+esc(e.t)+'</li>').join('')+'</ul>';
  if(p.gr&&p.gr.a===a)h+=zeugnis();sfx(O.mel&&UL[O.mel]?O.mel:'bday');vib([30,50,30]);htmlDialog(h,'Weiter',then,'recap');
}

