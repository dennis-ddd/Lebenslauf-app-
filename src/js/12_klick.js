/* ================= Klick 2.0: Profil, Feed, Kanal, Business ================= */
Object.assign(POSTT,{
outfit:{n:'Outfit des Tages',st:'au',tag:'#ootd',ic:'<path d="M8 3l4 2 4-2 5 4-3 3-2-1v12H8V9l-2 1-3-3z"/>',cap:['Heute so unterwegs','Neues Teil, neues Glück','Was sagt ihr zum Look?']},
luxus:{n:'Luxus zeigen',st:'au',tag:'#luxury',ic:'<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',cap:['Kleine Belohnung für mich','Hart gearbeitet, gut gelebt','Man gönnt sich ja sonst nichts'],warn:1},
party:{n:'Partyfoto',st:'gl',tag:'#nightlife',ic:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',need:()=>p.partyY===p.age,nn:'Erst feiern gehen',cap:['Was für eine Nacht','Die Crew ist komplett','Bis der DJ nach Hause geht']}});
['selfie','outfit','luxus','party','workout','food','reise','meme','haustier','paar'].forEach(k=>{if(POSTT[k]&&!POSTT[k].ord)POSTT[k].ord=1});
const PORDER=['selfie','outfit','luxus','party','workout','food','reise','meme','haustier','paar'];
const PCOL={selfie:'#E5407A',outfit:'#8E63D6',luxus:'#C9A227',party:'#7A2E5A',workout:'#2FA88F',food:'#F08A24',reise:'#2B9ED8',meme:'#3A3F4B',haustier:'#6FBF73',paar:'#E5527A'};
function postQ(k){const s=p.st;switch(k){case 'outfit':return stil()/8;case 'luxus':return clamp(Math.log10(Math.max(10,netWorth()))/7,0,1);case 'workout':return p.sk.form/100;case 'meme':return s.in/100;case 'selfie':case 'paar':return s.au/100;default:return s.gl/100}}
const MOODS={echt:['Echt','<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>','Ehrlich und nahbar. Glaubwürdigkeit steigt.'],lustig:['Lustig','<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>','Stark bei Memes, Partys und Haustieren.'],
edel:['Edel','<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>','Stark bei Luxus, Outfits und Reisen. Kostet etwas Glaubwürdigkeit.'],wild:['Wild','<path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z"/>','Viel höhere Chance, viral zu gehen. Aber Shitstorm-Gefahr.']};
const moodF=(m,k)=>m==='lustig'?(['meme','party','haustier'].includes(k)?1.3:.9):m==='edel'?(['luxus','outfit','reise'].includes(k)?1.3:.9):1;
const CATS={gaming:['Gaming','in'],chat:['Just Chatting','gl'],musik:['Musik','gl'],sport:['Sport','form'],kochen:['Kochen','gl'],kunst:['Kunst','in']};
const FMT={immer:['Wie immer','Dein Thema, deine Art. Solide.',1,0,.02],chat:['Just Chatting','Reden mit der Community. Etwas weniger Zuschauer, dafür mehr Bindung.',.85,5,.01],
crazy:['Verrückte Challenge','Viele neue Zuschauer, aber echte Shitstorm-Gefahr.',1.55,-2,.12],irl:['IRL durch die Stadt','Unterwegs live, ab 16. Neue Leute schalten zufällig ein.',1.3,1,.04,16],
marathon:['24-Stunden-Marathon','Einmal im Jahr. Riesiger Schub, aber anstrengend (Gesundheit −6).',2.6,6,.03,0,1],kollab:['Kollab mit einem Star','Einmal im Jahr, ab 5.000 Abos. Ein Star bringt seine Fans mit.',3.6,2,.03,0,1,5000],
charity:['Charity-Stream','Einmal im Jahr. Alle Spenden gehen an einen guten Zweck: Community und Glaubwürdigkeit steigen stark.',1.4,12,0,0,1]};
const SLOTS=[[16,'Nachmittag',1],[18,'Vorabend',1.1],[20,'Prime-Time',1.25],[22,'Prime-Time',1.3]];
const PLQ=[[1000,'Bronzene Plakette'],[100000,'Silberne Plakette'],[1e6,'Goldene Plakette'],[1e7,'Diamant-Plakette']];
const SPONS=[['Blitz Energy','Energydrink',1000,.22],['ThronSeat','Gaming-Stühle',5000,.3],['TunnelVPN','VPN-Dienst',10000,.38],['Nordend Fashion','Mode',25000,.32],['Hansebank','Girokonto',60000,.45],['Velocità Motors','Sportwagen',250000,.6],['SlimWunder','Abnehmpillen',3000,.7,1],['GoldRausch','Online-Casino',20000,.9,1]];
const STUDIO={merch:['Merch-Kollektion','Shirts, Hoodies, Tassen mit deinem Namen. Bringt jedes Jahr Geld, je größer die Community.',5000,0],mods:['Moderatoren','Halten deinen Chat sauber: Shitstorm-Risiko nur noch ein Drittel, Community +5 pro Jahr.',0,8000],
cutter:['Cutter/in','Schneidet deine Videos: 1,5× Aufrufe.',0,12000],manager:['Manager/in','Verhandelt für dich: +1 Sponsor-Platz und +20 % Sponsorengeld, nimmt dafür 15 %.',0,0]};
let chSub='live',chFmt='immer';
function ensureSm(){const sm=p.sm;if(!sm)return;if(sm.pl==null){sm.pl=6;sm.vl=3;sm.mood='echt';sm.spon=[];sm.studio={};sm.nposts=sm.posts.length;sm.follows=R(80,300);sm.earn=0}
  if(!sm.ch)sm.ch=null;}
const postBudget=()=>6+(p.job&&p.job.id==='influ'?2:0),streamBudget=()=>4+(p.job&&p.job.id==='influ'?2:0);
function smJoin(){if(p.sm||p.age<13)return;p.sm={h:'@'+(p.first+'.'+p.last).toLowerCase().replace(/[^a-z0-9äöüß.]/g,''),fol:R(20,60),likes:0,subs:0,views:0,yv:0,posts:[],vids:[],streams:[],trust:80,deals:[],dyr:0,active:false,nf:0,pl:postBudget(),vl:3,mood:'echt',spon:[],studio:{},nposts:0,follows:R(80,300),earn:0,ch:null}}
function smMult(){return (p.job&&p.job.id==='influ'?1.5:1)*(p.sm.trust/80)}
function doPost(type){const T=POSTT[type],sm=p.sm;if(!sm||p.prison||(T.need&&!T.need()))return;ensureSm();
  if(sm.pl<=0){toast('Keine Posts mehr übrig in diesem Jahr.');return}
  if(T.cost&&p.money<T.cost&&p.travelY!==p.age){toast('Die Reise kostet '+eur(T.cost)+'.');return}
  if(T.cost&&p.travelY!==p.age)p.money-=T.cost;sm.pl--;sm.nposts++;
  const m=sm.mood,trend=p.trend===type,viral=ch(.04*(m==='wild'?2.5:1));
  let q=(.35+postQ(type)*.9)*(.75+Math.random()*.5)*(trend?2:1)*smMult()*moodF(m,type)*(viral?6:1);
  const base=140+sm.fol*.07/(1+sm.fol/60000);let nf=Math.round(base*q*(.8+Math.random()*.6));
  let likes=Math.round((sm.fol+nf)*.12*q+R(5,25)),note='';
  if(m==='echt')sm.trust=Math.min(100,sm.trust+2);if(m==='edel')sm.trust=Math.max(10,sm.trust-1);
  if((m==='wild'&&ch(.08))||(T.warn&&ch(.05))){nf=-Math.round(sm.fol*.06);sm.trust=Math.max(10,sm.trust-8);note='Shitstorm in den Kommentaren!';add('gl',-4)}
  smGain(nf);sm.likes+=Math.max(0,likes);sm.active=true;add('gl',R(1,3));
  const post={ty:type,cap:fillT(pick(T.cap))+' '+T.tag,likes:Math.max(0,likes),nf,a:p.age,viral,com:(()=>{const c=shuffle(COMS.slice());return shuffle(FANS.slice()).slice(0,2).map((f,i)=>[f,c[i]])})(),id:R(1,1e9)};
  sm.posts.unshift(post);sm.posts=sm.posts.slice(0,15);
  if(viral){ach('viral');msg('freund','Alter, dein Post ist überall!! '+kfmt(likes)+' Likes!')}
  log('Neuer Post ('+T.n+'): '+kfmt(likes)+' Likes, '+(nf>=0?'+':'')+kfmt(nf)+' Follower.'+(viral?' Viral!':''));checkAch();save();render();
  htmlDialog('<h2>'+(note?'Autsch!':viral?'Viral gegangen!':'Gepostet!')+'</h2>'+(note?'<p>'+note+'</p>':'')+postCard(post,true)+'<div class="gain"><span><b>'+(nf>=0?'+':'')+kfmt(nf)+'</b>Follower</span><span><b>'+kfmt(likes)+'</b>Likes</span>'+(trend?'<span><b>2×</b>Trend</span>':'')+'</div>','Weiter');
}
function doVideo(g){const V=VIDT[g],sm=p.sm;if(!sm||p.prison||!sm.ch)return;ensureSm();
  if(!(p.items.includes('handy')||p.items.includes('kamera')||p.items.includes('laptop'))){toast('Du brauchst ein Smartphone, eine Kamera oder einen Laptop aus dem Shop.');return}
  if(V.need&&!V.need()){toast('Dafür brauchst du: '+V.needN+'.');return}if(sm.vl<=0){toast('Keine Videos mehr übrig in diesem Jahr.');return}sm.vl--;
  const eq=p.items.includes('kamera')?1.6:1,cut=sm.studio.cutter?1.5:1,viral=ch(.04),q=(.4+p.st[V.st]/100*.8)*(.6+Math.random()*.8)*eq*cut*smMult()*(viral?8:1);
  const views=Math.round((sm.ch.subs*.8/(1+sm.ch.subs/100000)+sm.fol*.12/(1+sm.fol/100000)+250)*q),ns=Math.round(views*.05);
  sm.ch.subs+=ns;sm.subs=sm.ch.subs;sm.views+=views;sm.yv+=views;sm.active=true;smGain(views*.02);
  const v={g,t:pick(V.t),views,ns,a:p.age,viral};sm.vids.unshift(v);sm.vids=sm.vids.slice(0,10);if(viral)ach('viral');checkPlq();
  log('Neues Video „'+v.t+'“: '+kfmt(views)+' Aufrufe.');checkAch();save();render();
  htmlDialog('<h2>'+(viral?'Dein Video geht viral!':'Video hochgeladen')+'</h2><div class="card" style="padding:10px 12px">'+vidRow(v)+'</div><div class="gain"><span><b>'+kfmt(views)+'</b>Aufrufe</span><span><b>+'+kfmt(ns)+'</b>Abos</span><span><b>'+eur(views*.01)+'</b>Werbung</span></div><p class="note">Werbeeinnahmen werden am Jahresende ausgezahlt.</p>','Weiter');
}
function checkPlq(){const c=p.sm.ch;if(!c)return;c.plq=c.plq||0;while(c.plq<PLQ.length&&c.subs>=PLQ[c.plq][0]){log('Klick: '+PLQ[c.plq][1]+' für '+kfmt(PLQ[c.plq][0])+' Abonnenten!');toast(PLQ[c.plq][1]+'!');add('gl',6);c.plq++}}
const comTxt=c=>c>=75?'Begeistert':c>=50?'Zufrieden':c>=25?'Unruhig':'Genervt';
function nextSlot(){const c=p.sm.ch;return c.plan.slice().sort((a,b)=>a-b).find(i=>!c.done.includes(i))}
function doLive(){const sm=p.sm;if(!sm||p.prison||!sm.ch)return;ensureSm();const c=sm.ch,F=FMT[chFmt];
  if(!(p.items.includes('handy')||p.items.includes('laptop'))){toast('Zum Streamen brauchst du mindestens ein Smartphone aus dem Shop.');return}
  if(c.sl<=0){toast('Alle Streams für dieses Jahr sind gemacht.');return}
  if(F[5]&&p.age<F[5]){toast('Dieses Format geht erst ab '+F[5]+'.');return}if(F[7]&&c.subs<F[7]){toast('Dafür brauchst du '+kfmt(F[7])+' Abos.');return}if(F[6]&&c.once[chFmt]===p.age){toast('Dieses Format gibt es nur einmal im Jahr.');return}
  c.sl--;if(F[6])c.once[chFmt]=p.age;
  const si=nextSlot(),planned=si!=null;let sM=1,txt=[];
  if(planned){c.done.push(si);c.streak++;sM=SLOTS[si][2]*(c.ann.includes(si)?1.15:1)*(1+Math.min(.3,c.streak*.02))}else c.streak=0;
  const eq=p.items.includes('setup')&&p.items.includes('laptop')?1.6:p.items.includes('laptop')?1.2:1,CS=CATS[c.cat],sv=CS[1]==='form'?p.sk.form:p.st[CS[1]];
  const viewers=Math.round((c.subs*.1/(1+c.subs/120000)+sm.fol*.012/(1+sm.fol/120000)+30)*eq*(.6+sv/100*.6)*F[2]*sM*(.7+c.com/100*.6)*smMult()*(.75+Math.random()*.5));
  let ns=Math.round(viewers*(.25+Math.random()*.2)*(F[6]&&chFmt==='charity'?1.2:1)),don=Math.round(viewers*(.3+Math.random()*.9));
  c.com=clamp(c.com+F[3]+(c.streak>=5?1:0),0,100);if(chFmt==='marathon')add('ge',-6);
  const risk=F[4]*(sm.studio.mods?.33:1)*(sm.mood==='wild'?1.5:1);
  if(ch(risk)){ns=-Math.round(c.subs*.05);smGain(-sm.fol*.08);c.com=Math.max(0,c.com-15);sm.trust=Math.max(10,sm.trust-10);don=Math.round(don/3);txt.push('Shitstorm! Ein Satz kam falsch an.');add('gl',-6)}
  else{smGain(viewers*.08);add('gl',R(2,5))}
  c.subs=Math.max(0,c.subs+ns);sm.subs=c.subs;c.streams++;c.rec=Math.max(c.rec,viewers);c.vh.push(viewers);if(c.vh.length>12)c.vh.shift();
  if(chFmt==='charity'){sm.trust=Math.min(100,sm.trust+10);add('gl',8);txt.push('Du hast '+eur(don)+' für einen guten Zweck gesammelt.');log('Charity-Stream: '+eur(don)+' gespendet.');don=0}
  else{p.money+=don;p.yr.social+=don;c.earn+=don;sm.earn+=don;
    if(c.goal){c.goal.got+=don;if(c.goal.got>=c.goal.amt){txt.push('Spendenziel von '+eur(c.goal.amt)+' erreicht! Die Community feiert.');c.com=Math.min(100,c.com+10);sm.trust=Math.min(100,sm.trust+4);add('gl',5);c.goal=null}}}
  if(planned)txt.push('Plan-Stream um '+SLOTS[si][0]+':00 · Serie: '+c.streak+' am Stück.');
  sm.active=true;sm.streams.unshift({viewers,don,a:p.age,f:chFmt});sm.streams=sm.streams.slice(0,8);checkPlq();checkAch();
  log('Stream ('+F[0]+'): '+kfmt(viewers)+' Zuschauer, '+(ns>=0?'+':'')+kfmt(ns)+' Abos.');save();render();
  htmlDialog('<h2>'+(viewers>=c.rec&&c.streams>1?'Neuer Rekord!':'Stream beendet')+'</h2><p>'+txt.join(' ')+'</p><div class="gain"><span><b>'+kfmt(viewers)+'</b>Zuschauer</span><span><b>'+(ns>=0?'+':'')+kfmt(ns)+'</b>Abos</span><span><b>'+eur(don)+'</b>Spenden</span></div>','Weiter');
}
function sponPay(S){const sm=p.sm,c=sm.ch;return Math.round(((sm.fol+(c?c.subs:0)*3)*S[3]/10)*(sm.studio.manager?1.2:1)/10)*10+200}
function smYear(){const sm=p.sm;if(!sm)return 0;ensureSm();let inc=0;
  inc+=Math.round(sm.yv*.01);if(sm.fol>=1000)inc+=Math.round(sm.fol*.02);
  const c=sm.ch;if(c){inc+=Math.round(c.subs*1.5/(1+c.subs/300000));const miss=c.plan.filter(i=>!c.done.includes(i)).length;if(miss){c.streak=0;c.com=Math.max(0,c.com-8*miss);log('Klick: '+miss+' geplante(r) Stream(s) ausgefallen. Die Community ist enttäuscht.')}
    if(sm.studio.mods)c.com=Math.min(100,c.com+5);c.hist.push(c.subs);if(c.hist.length>30)c.hist.shift();c.sl=streamBudget();c.done=[];c.ann=[]}
  let sp=0;sm.spon.forEach(k=>{const S=SPONS.find(x=>x[0]===k);if(!S)return;sp+=sponPay(S);if(S[4]){sm.trust=Math.max(10,sm.trust-8);if(c)c.com=Math.max(0,c.com-5)}});
  if(sm.studio.manager)sp=Math.round(sp*.85);inc+=sp;
  if(sm.studio.merch)inc+=Math.round((sm.fol*.01+(c?c.subs*.08:0))*(c?(.5+c.com/100):1));
  let cost=(sm.studio.mods?px$(STUDIO.mods[3]):0)+(sm.studio.cutter?px$(STUDIO.cutter[3]):0);inc-=cost;
  if(!sm.active&&sm.fol>50){smGain(-sm.fol*.08);log('Klick: Ohne neue Inhalte sind dir Follower verloren gegangen.')}
  sm.trust=Math.min(100,sm.trust+5);sm.yv=0;sm.active=false;sm.dyr=0;sm.pl=postBudget();sm.vl=3;sm.earn+=Math.max(0,inc);
  sm.deals=[];if(sm.fol>=1000){const n=R(1,2);shuffle(BRANDS.slice()).slice(0,n).forEach(b=>sm.deals.push({b:b[0],pr:b[1],pay:Math.round(sm.fol*R(4,12)/1000)*10+50}));sm.nf+=n}
  return inc;
}
function qbars(q,col){const n=Math.round(clamp(q,0,1)*5);return '<span class="qb">'+[0,1,2,3,4].map(i=>'<i style="background:'+(i<n?col:'var(--line)')+'"></i>').join('')+'</span>'}
function viewKlick(){
  if(!p.sm)return '<section class="kl-hero"><div class="kl-logo">Klick</div><p>Teile dein Leben, streame live, sammle Follower und mach daraus deinen Beruf.</p><div class="kl-steps"><span>Posts</span><span>Livestreams</span><span>Videos</span><span>Sponsoren</span><span>Merch</span></div>'+
    (p.age<13?'<p class="kl-note">Ein Konto gibt es ab 13 Jahren.</p>':'<button class="btn big kl-btn" data-a="smjoin">Konto erstellen</button>')+'</section>';
  ensureSm();const sm=p.sm,c=sm.ch,lock=!!p.prison;if(!['profil','feed','kanal','biz'].includes(smTab))smTab='profil';
  let h='<div class="seg kl-tabs">'+[['profil','Profil'],['feed','Feed'],['kanal','Kanal'],['biz','Business'+(sm.deals.length?' ('+sm.deals.length+')':'')]].map(([k,l])=>'<button data-a="smtab" data-g="'+k+'" aria-pressed="'+(smTab===k)+'">'+l+'</button>').join('')+'</div>';
  if(smTab==='profil'){const li=lvIdx(sm.fol),nx=LV[li+1],prog=nx?clamp((sm.fol-LV[li][0])/(nx[0]-LV[li][0])*100,0,100):100;
    const sp=sm.spon.reduce((s,k)=>{const S=SPONS.find(x=>x[0]===k);return s+(S?sponPay(S):0)},0);
    h+='<section class="kl-prof"><div class="kl-top"><span class="kl-av">'+avatarSvg(p.age,72)+'</span><div><b>'+esc(p.first+' '+p.last)+'</b><small>'+esc(sm.h)+'</small><span class="kl-lv">'+LV[li][1]+'</span></div></div>'+
      '<div class="kl-stats four"><div><b>'+kfmt(sm.fol)+'</b><small>Follower</small></div><div><b>'+sm.nposts+'</b><small>Posts</small></div><div><b>'+sm.follows+'</b><small>Folgt</small></div><div><b>'+kfmt(sm.earn)+'</b><small>verdient €</small></div></div>'+
      '<div class="kl-prog"><i style="width:'+prog.toFixed(1)+'%"></i></div><small class="kl-next">'+(nx?'Noch '+kfmt(nx[0]-sm.fol)+' Follower bis '+nx[1]:'Höchstes Level erreicht')+'</small>'+
      '<div class="kl-trust"><span>Glaubwürdigkeit</span><span class="kbar"><i style="width:'+sm.trust+'%"></i></span><b>'+sm.trust+' %</b></div>'+(sp?'<small class="kl-next">Sponsoren bringen etwa '+eur(sp)+' im Jahr.</small>':'')+'</section>';
    const T=POSTT[p.trend];h+='<div class="trend"><b>Trend des Jahres: '+T.n+' '+T.tag+'</b><span>Doppelte Reichweite für diese Posts</span></div>';
    if(p.job&&p.job.id==='influ')h+='<div class="trend pro"><b>Vollzeit-Influencer/in</b><span>1,5× Reichweite, 2 Posts und 2 Streams mehr pro Jahr, 2 Aktionen mehr</span></div>';
    else if(sm.fol>=10000||(c&&c.subs>=5000))h+='<button class="trend pro" data-a="goto" data-g="jobs"><b>Mach es zum Beruf!</b><span>Du kannst jetzt Influencer/in werden. Zur Jobs-App</span></button>';
    else h+='<div class="trend pro"><b>Ziel: Influencer/in</b><span>Ab 10.000 Followern oder 5.000 Abos wird es dein Beruf. Noch '+kfmt(10000-sm.fol)+' Follower.</span></div>';
    h+='<section class="card"><h2 class="h">Stimmung des Posts</h2><div class="moods">'+Object.keys(MOODS).map(k=>'<button class="mood" data-a="mood" data-g="'+k+'" aria-pressed="'+(sm.mood===k)+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+MOODS[k][1]+'</svg>'+MOODS[k][0]+'</button>').join('')+'</div><p class="note" style="margin-top:6px">'+MOODS[sm.mood][2]+'</p></section>';
    h+='<div class="listseg" style="padding:0 4px"><h3 class="sec" style="margin:0">Neuer Post</h3><b class="note">'+sm.pl+' von '+postBudget()+' übrig</b></div><div class="pgrid">'+PORDER.filter(k=>POSTT[k]).map(k=>{const P=POSTT[k],no=P.need&&!P.need(),q=postQ(k);
      return '<button class="pcard2'+(p.trend===k?' hot':'')+'" data-a="post" data-g="'+k+'"'+(no||sm.pl<=0||lock?' disabled':'')+'><span class="pic" style="background:'+PCOL[k]+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+P.ic+'</svg></span>'+(p.trend===k?'<span class="hotf">Trend</span>':P.warn?'<span class="warnf">!</span>':'')+'<b>'+P.n+'</b>'+(no?'<small>'+(P.nn||(k==='paar'?'Braucht Partner':'Braucht Haustier'))+'</small>':P.cost&&p.travelY!==p.age?'<small>'+eur(P.cost)+'</small>':'')+qbars(q,PCOL[k])+'</button>'}).join('')+'</div>'+
      '<p class="note">Posts kosten keine Aktion. Die Balken zeigen, wie gut dir der Post gelingt: Selfies leben vom Aussehen, Outfits vom Stil, Luxus vom Vermögen, Workouts von der Form.</p>';
  }
  if(smTab==='feed')h+=sm.posts.length?sm.posts.map(x=>postCard(x)).join(''):card('','<p class="note">Noch keine Posts. Leg im Profil los!</p>');
  if(smTab==='kanal'){
    if(!c){h+='<section class="card chcreate"><span class="fic" style="background:linear-gradient(135deg,#9B5CFF,#6C3BE0)"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/></svg></span><h2 class="h">Eigenen Kanal starten</h2><p class="note">Streame live, lade Videos hoch, sammle Abos und Spenden. Ab 13 Jahren mit Smartphone. Laptop und Streaming-Setup aus dem Shop machen es besser.</p>'+
      '<input type="text" id="chName" maxlength="28" placeholder="Name deines Kanals" value="'+esc(drafts.chName||(p.first+' '+p.last+' Live'))+'"><div class="mt">Thema</div><div class="amts">'+Object.keys(CATS).map(k=>'<button class="amt" data-a="chcat" data-g="'+k+'" aria-pressed="'+((drafts.chCat||'gaming')===k)+'">'+CATS[k][0]+'</button>').join('')+'</div>'+
      '<button class="btn o big" data-a="chcreate" style="margin-top:12px"'+(lock||p.age<13?' disabled':'')+'>Kanal starten</button></section>';return h}
    const pl=c.plq||0,nx=PLQ[pl],prev=pl?PLQ[pl-1][0]:0;
    h+='<section class="card chhead"><div class="fh"><span class="fic" style="background:linear-gradient(135deg,#9B5CFF,#6C3BE0)"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/></svg></span><div><b>'+esc(c.name)+'</b><small>'+CATS[c.cat][0]+(pl?' · '+PLQ[pl-1][1]:'')+'</small></div></div>'+
      '<div class="kl-stats four dark"><div><b>'+kfmt(c.subs)+'</b><small>Abonnenten</small></div><div><b>'+c.streams+'</b><small>Streams</small></div><div><b>'+kfmt(c.rec)+'</b><small>Rekord live</small></div><div><b>'+kfmt(c.earn)+'</b><small>Spenden €</small></div></div>'+
      (nx?'<div class="kl-prog purple"><i style="width:'+clamp((c.subs-prev)/(nx[0]-prev)*100,0,100).toFixed(1)+'%"></i></div><small class="note">Nächstes Ziel: '+kfmt(nx[0])+' Abonnenten, '+nx[1]+'.</small>':'<small class="note">Alle Plaketten gesammelt!</small>')+'</section>';
    h+='<div class="seg full">'+[['live','Live'],['plan','Plan'],['videos','Videos'],['stats','Statistik']].map(([k,l])=>'<button data-a="chsub" data-g="'+k+'" aria-pressed="'+(chSub===k)+'">'+l+'</button>').join('')+'</div>';
    if(chSub==='live'){const ns=nextSlot();
      h+='<h3 class="sec">Format</h3><div class="fmts">'+Object.keys(FMT).map(k=>{const F=FMT[k],used=F[6]&&c.once[k]===p.age,lk=(F[5]&&p.age<F[5])||(F[7]&&c.subs<F[7]);
        return '<button class="fmt" data-a="chfmt" data-g="'+k+'" aria-pressed="'+(chFmt===k)+'"'+(used||lk?' disabled':'')+'><b>'+F[0]+'</b><small>'+(used?'dieses Jahr erledigt':lk?(F[7]?'ab '+kfmt(F[7])+' Abos':'ab '+F[5]+' Jahren'):F[6]?'Einmal im Jahr':'×'+F[2].toFixed(1).replace('.',',')+' Zuschauer')+'</small></button>'}).join('')+'</div><p class="note">'+FMT[chFmt][1]+'</p>'+
        '<button class="btn big live-btn" data-a="golive"'+(c.sl<=0||lock?' disabled':'')+'><span class="dotlive"></span>Live gehen</button><p class="note">'+c.sl+' von '+streamBudget()+' Streams in diesem Jahr übrig'+(ns!=null?' · der nächste füllt deinen '+SLOTS[ns][0]+':00-Termin':' · ohne Plan-Termin keine Serie')+'. Streams kosten keine Aktion.</p>';
      h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Community</h2><b class="'+(c.com>=50?'up':'down')+'">'+comTxt(c.com)+'</b></div><div class="kl-prog purple"><i style="width:'+c.com+'%"></i></div><p class="note" style="margin-top:6px">Eine begeisterte Community lässt den Kanal schneller wachsen. Ausgefallene Plan-Streams und Shitstorms schaden ihr.</p></section>';
      if(c.vh.length)h+=card('Letzte Streams',bars(c.vh.slice(-10))+sm.streams.slice(0,4).map(s=>row(kfmt(s.viewers)+' Zuschauer',(FMT[s.f]?FMT[s.f][0]:'Stream')+' · Alter '+s.a,'<span class="num up">+'+eur(s.don)+'</span>')).join(''));
    }
    if(chSub==='plan'){
      h+='<section class="card"><h2 class="h">Sendeplan</h2><p class="note">Bis zu vier feste Sendezeiten, die jedes Jahr wiederkommen. Abends schauen mehr zu, eine Ankündigung bringt Hype, und wer verlässlich sendet, baut eine Serie auf. Ausgefallene Plan-Streams kosten Community.</p></section>'+
        SLOTS.map((S,i)=>{const on=c.plan.includes(i),dn=c.done.includes(i),an=c.ann.includes(i);
          return '<section class="card slot2'+(on?' on':'')+'"><div class="st"><b>'+S[0]+':00</b><small class="'+(S[2]>1.2?'up':'')+'">'+S[1]+'</small></div><div class="sd"><small>'+(on?(dn?'heute schon gestreamt':'offen'):'kein fester Termin')+' · ×'+S[2].toFixed(2).replace('.',',')+(an?' · angekündigt +15 %':'')+'</small><div class="btns" style="margin:4px 0 0">'+
            (on?btn('ann',i,an?'Angekündigt':'Ankündigen','',an||dn)+btn('slot',i,'Entfernen','g'):btn('slot',i,'Termin hinzufügen','o',c.plan.length>=4))+'</div></div></section>'}).join('');
      h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Serie</h2><b class="up">'+c.streak+' am Stück</b></div><p class="note">Dein nächster Plan-Stream bringt +'+Math.min(30,(c.streak+1)*2)+' % Zuschauer und Abos.</p></section>';
      const base=Math.max(100,c.subs*.05);
      h+='<section class="card"><h2 class="h">Spendenziel</h2>'+(c.goal?'<div class="bigv"><b>'+eur(c.goal.got)+'</b><span class="note">von '+eur(c.goal.amt)+'</span></div><div class="kl-prog purple"><i style="width:'+clamp(c.goal.got/c.goal.amt*100,0,100)+'%"></i></div>'+btn('goal','0','Ziel aufgeben','g'):
        '<p class="note">Setze ein Ziel. Die Zuschauer spenden in deinen Streams. Bei Erfolg gibt es Community, Glaubwürdigkeit und ein Dankeschön.</p><div class="amts" style="margin-top:8px">'+[1,5,25,100].map(m=>{const a=Math.round(base*m/100)*100;return '<button class="amt" data-a="goal" data-g="'+a+'">'+eur(a)+'</button>'}).join('')+'</div>')+'</section>';
    }
    if(chSub==='videos'){const eq=p.items.includes('kamera')?'Kamera (1,6×)':(p.items.includes('handy')||p.items.includes('laptop')?'Smartphone/Laptop':'keine Kamera');
      h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Video hochladen</h2><b class="note">'+sm.vl+' von 3 übrig</b></div><p class="note" style="margin:6px 0 10px">Ausrüstung: '+eq+(sm.studio.cutter?' · mit Cutter 1,5×':'')+'. Werbung bringt 1 € pro 100 Aufrufe, ausgezahlt am Jahresende. Videos kosten keine Aktion.</p><div class="ptypes">'+
        Object.keys(VIDT).map(k=>{const V=VIDT[k];return '<button class="ptype" data-a="video" data-g="'+k+'"'+(sm.vl<=0||lock?' disabled':'')+'><span class="dot" style="background:'+V.c+'"></span>'+V.n+'</button>'}).join('')+'</div></section>'+card('Deine Videos',sm.vids.length?sm.vids.map(vidRow).join(''):'<p class="note">Noch keine Videos.</p>');
    }
    if(chSub==='stats'){const sp=sm.spon.reduce((s,k)=>{const S=SPONS.find(x=>x[0]===k);return s+(S?sponPay(S):0)},0);
      h+=card('Abonnenten pro Jahr',c.hist.length>1?lineSvg(c.hist.slice(-15),110,true,'neu'):'<p class="note">Nach dem ersten Jahr siehst du hier deine Kurve.</p>')+
        card('Zuschauer pro Stream',c.vh.length?bars(c.vh)+'<p class="note">Rekord: '+kfmt(c.rec)+' Zuschauer gleichzeitig.</p>':'<p class="note">Noch keine Streams.</p>')+
        card('Einnahmen pro Jahr (geschätzt)','<div class="mrow"><span>Abos (bis 1,50 € pro Abo)</span><b>'+eur(c.subs*1.5/(1+c.subs/300000))+'</b></div><div class="mrow"><span>Creator-Fonds</span><b>'+eur(sm.fol>=1000?sm.fol*.02:0)+'</b></div><div class="mrow"><span>Sponsoren</span><b>'+eur(sm.studio.manager?sp*.85:sp)+'</b></div><div class="mrow"><span>Merch</span><b>'+eur(sm.studio.merch?(sm.fol*.01+c.subs*.08)*(.5+c.com/100):0)+'</b></div><div class="mrow"><span>Spenden bisher gesamt</span><b>'+eur(c.earn)+'</b></div>');
    }
  }
  if(smTab==='biz'){const max=3+(sm.studio.manager?1:0),reach=sm.fol+(c?c.subs*3:0);
    h+='<div class="listseg" style="padding:0 4px"><h3 class="sec" style="margin:0">Sponsoren</h3><b class="note">'+sm.spon.length+'/'+max+'</b></div>'+SPONS.map(S=>{const on=sm.spon.includes(S[0]),need=reach<S[2],full=!on&&sm.spon.length>=max;
      return '<section class="card sprow'+(need?' dim':'')+'"><span class="vb'+(S[4]?' risky':'')+'">'+(S[4]?'!':'✓')+'</span><div class="ct"><b>'+S[0]+'</b><small>'+S[1]+' · '+(need?'ab '+kfmt(S[2])+' Reichweite':eur(sponPay(S))+'/Jahr')+(S[4]?' · schadet Glaubwürdigkeit':'')+'</small></div>'+
        (on?btn('spon',S[0],'Beenden','g'):need||full?'<span class="lock">'+(need?'Gesperrt':'Voll')+'</span>':btn('spon',S[0],'Unterschreiben','o',lock))+'</section>'}).join('')+'<p class="note">Reichweite = Follower + 3 × Abos. Sponsoren zahlen jedes Jahr, solange der Vertrag läuft.</p>';
    if(sm.deals.length||sm.fol>=1000)h+=card('Einmalige Anfragen',(sm.deals.length?sm.deals.map((d,i)=>'<div class="deal"><span class="cav" style="background:#8E63D6">'+esc(d.b[0])+'</span><div class="dt"><b>'+esc(d.b)+'</b><small>ein Post über '+esc(d.pr)+'</small></div><b class="num up">'+eur(d.pay)+'</b><div class="btns" style="grid-column:1/-1">'+btn('deal',i+':1','Annehmen','o',lock)+btn('deal',i+':0','Ablehnen','g')+'</div></div>').join(''):'<p class="note">Gerade keine Anfragen.</p>'));
    h+='<h3 class="sec">Studio</h3>'+Object.keys(STUDIO).map(k=>{const S=STUDIO[k],on=!!sm.studio[k];return '<section class="card sprow"><div class="ct"><b>'+S[0]+'</b><small>'+S[1]+(S[2]?' Start: '+eur(px$(S[2]))+'.':'')+(S[3]?' '+eur(px$(S[3]))+' im Jahr.':'')+'</small></div>'+(on?(k==='merch'?'<span class="chip">Läuft</span>':btn('studio',k,'Entlassen','g')):btn('studio',k,k==='merch'?'Starten':'Einstellen','o',lock||p.money<px$(S[2])||(k!=='merch'&&p.age<16)))+'</section>'}).join('');
  }
  return h;
}
function act4(id,arg){const sm=p.sm;
  switch(id){
  case 'mood':if(sm){sm.mood=arg;render()}return 1;
  case 'chcat':drafts.chCat=arg;render();return 1;
  case 'chcreate':{if(!sm||sm.ch||p.age<13||p.prison)return 1;const nm=(drafts.chName||'').trim()||p.first+' '+p.last+' Live';sm.ch={name:nm,cat:drafts.chCat||'gaming',subs:sm.subs||0,streams:0,rec:0,earn:0,com:60,streak:0,plan:[2],ann:[],done:[],goal:null,once:{},hist:[sm.subs||0],vh:[],sl:streamBudget(),plq:0};chSub='live';done('Dein Kanal „'+nm+'“ ist online.');return 1}
  case 'chsub':chSub=arg;render();return 1;
  case 'chfmt':chFmt=arg;render();return 1;
  case 'golive':doLive();return 1;
  case 'slot':{const c=sm&&sm.ch;if(!c)return 1;const i=+arg,k=c.plan.indexOf(i);if(k>=0)c.plan.splice(k,1);else if(c.plan.length<4)c.plan.push(i);save();render();return 1}
  case 'ann':{const c=sm&&sm.ch;if(!c||c.ann.includes(+arg))return 1;c.ann.push(+arg);toast('Angekündigt! Der '+SLOTS[+arg][0]+':00-Stream bekommt +15 % Zuschauer.');save();render();return 1}
  case 'goal':{const c=sm&&sm.ch;if(!c)return 1;c.goal=+arg?{amt:+arg,got:0}:null;save();render();return 1}
  case 'spon':{if(!sm)return 1;const i=sm.spon.indexOf(arg);if(i>=0){sm.spon.splice(i,1);done('Vertrag mit '+arg+' beendet.');return 1}
    if(sm.spon.length>=3+(sm.studio.manager?1:0))return 1;sm.spon.push(arg);sm.trust=Math.max(10,sm.trust-3);done('Sponsorvertrag mit '+arg+' unterschrieben.');return 1}
  case 'studio':{if(!sm)return 1;const S=STUDIO[arg];if(sm.studio[arg]){if(arg==='merch')return 1;delete sm.studio[arg];done(S[0]+' entlassen.');return 1}const c=px$(S[2]);if(p.money<c)return 1;p.money-=c;sm.studio[arg]=1;done(arg==='merch'?'Deine Merch-Kollektion ist im Shop!':S[0]+' arbeitet jetzt für dich.');return 1}
  }return 0;
}

function newLife(first,last,g,age,sb){
  p={first,last,g,age,alive:true,sb:!!sb,seed:R(1,2e9),money:sb?1000000:(age>=18?2000:0),st:{gl:R(55,90),ge:R(65,95),in:R(35,90),au:R(35,90)},
    edu:'keine',school:null,study:null,azubi:null,aus:false,deg:null,job:null,pension:0,home:'eltern',owned:[],cars:[],items:[],pets:[],
    partner:null,kids:[],prison:0,crimes:0,wins:0,act:6,sav:0,loan:0,sh:{},px:{},prev:{},ach:{},log:[],cause:''};
  p.hist={};p.cost={};p.mnews=[];STOCKS.forEach(s=>{let v=s.p;const h=[v];for(let i=0;i<12;i++){v=stepPrice(s,v);h.push(v)}p.hist[s.id]=h;p.px[s.id]=v;p.prev[s.id]=h[h.length-2]});
  ensureNew();regMyStock();p.m0=p.money;if(age>=6)msg('freund','Hey! Treffen wir uns morgen nach der Schule?');if(age>=13)msg('mama','Denk dran, heute Abend gibt es Spaghetti!');
  log((age===0?'Du wurdest in ':'Dein neues Leben mit '+age+' beginnt in ')+cityName(p.seed)+(age===0?' geboren.':'.'));
  if(age>=6)p.school='Grundschule';
  if(age>=10)p.school=p.st.in>=55?'Gymnasium':p.st.in>=38?'Realschule':'Hauptschule';
  if(age>=18){p.edu=p.school==='Gymnasium'?'Abitur':'Realschule';p.school=null;log('Du hast '+(p.edu==='Abitur'?'das Abitur':'den Realschulabschluss')+' in der Tasche.')}
  p.sibs=genSibs();tab='home';sel='home';save();render();
}
function grade(){return Math.min(4,1+(100-p.st.in)/30).toFixed(1).replace('.',',')}

