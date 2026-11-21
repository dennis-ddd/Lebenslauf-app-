/* ================= Kinder und Generationen ================= */
const TAL={sport:['Sport','sv'],musik:['Musik','mu'],kopf:['Köpfchen','nh'],kunst:['Kunst','mu']};
const FD={nh:['Nachhilfe',1200,'Intelligenz +'],sv:['Sportverein',500,'Gesundheit +'],mu:['Musik und Kunst',800,'Kreativität +']};
const KJOBS={sport:['Sporttrainer/in','Profisportler/in','Physiotherapeut/in'],musik:['Musiker/in','Musiklehrer/in','Tontechniker/in'],kopf:['Ingenieur/in','Ärztin/Arzt','Informatiker/in'],kunst:['Designer/in','Fotograf/in','Architekt/in']};
function kidJob(k){if(k.edu==='keine'&&k.st.in<45)return pick(['Lagerarbeiter/in','Verkäufer/in','Paketbote/-botin']);const L=KJOBS[k.tal];return k.ts>=70||k.edu==='Abitur'?pick(L):pick(['Bürokaufmann/-frau','Mechatroniker/in','Pflegefachkraft',L[0]])}
const KIDMSG=['Kannst du mich abholen?','Ich hab eine 1 in Mathe!!','Darf ich bei Lea übernachten?','Ich hab dich lieb.','Wann gibt es Essen?','Papa/Mama, kann ich mehr Taschengeld?'];
const KIDMSG2=['Wie geht es dir?','Kommst du am Sonntag zum Essen?','Die Kleinen fragen nach dir!','Danke für alles, was du für mich getan hast.','Wir sollten mal wieder telefonieren.'];
function kidYear(R0){let cost=0;
  p.kids.forEach((k,i)=>{if(k.alive===false)return;const ka=p.age-k.b;if(ka<0)return;
    k.rel=clamp(k.rel-(ka>=13&&ka<=18?3:1),0,100);
    if(ka>=6&&ka<19)Object.keys(FD).forEach(f=>{if(k.fd[f]){cost+=px$(FD[f][1]);if(f==='nh')k.st.in=Math.min(100,k.st.in+3);if(f==='sv')k.st.ge=Math.min(100,k.st.ge+2);if(TAL[k.tal][1]===f)k.ts=Math.min(100,k.ts+6);k.rel=Math.min(100,k.rel+1)}});
    if(ka>=19)k.fd={};if(ka>=4)k.ts=Math.min(100,k.ts+R(0,3));k.st.in=clamp(k.st.in+R(-1,2),0,100);
    if(ka===16&&k.st.in<55&&k.edu==='keine'){k.edu='Realschule';log(k.n+' hat den Realschulabschluss.')}
    if(ka===18&&k.st.in>=55){k.edu='Abitur';log(k.n+' hat das Abitur bestanden!');add('gl',5);mile(k.n+' macht Abitur','kid')}
    if(ka>=13&&ka<=17&&k.rel<45&&ch(.3))p.q.push({id:'rebel',d:i});
    if(ka>=8&&ka<=22&&k.ts>=70&&ch(.25)){log(k.n+' gewinnt einen Wettbewerb ('+TAL[k.tal][0]+')!');add('gl',4);k.rel=Math.min(100,k.rel+3);if(ch(.4))news(k.n+' '+p.last+' gewinnt Talentwettbewerb','lokal')}
    if(ka>=18&&ka<=23&&!k.out&&ch(.35)){k.out=true;log(k.n+' zieht aus.');mile(k.n+' zieht aus','kid');add('gl',-2)}
    if(ka>=20&&!k.job&&ch(.4)){k.job=kidJob(k);log(k.n+' arbeitet jetzt als '+k.job+'.')}
    if(ka>=24&&ka<=40&&!k.mar&&ch(.12)){k.mar=true;log(k.n+' hat geheiratet!');add('gl',6);mile('Hochzeit von '+k.n,'kid')}
    if(ka>=25&&ka<=42&&k.mar&&k.kids<3&&ch(.15)){k.kids++;const first=p.kids.reduce((s,x)=>s+(x.kids||0),0)===1;log(k.n+' hat ein Baby bekommen. Du bist '+(first?'jetzt':'wieder')+' Großmutter/Großvater!');add('gl',8);mile(first?'Erstes Enkelkind':'Enkelkind ('+k.n+')','kid')}
    if(ka>=22&&ch(.07))p.q.push({id:'kidmoney',d:i});
    if(p.age>=70){if(k.rel>=60){add('ge',1);add('gl',1)}else if(k.rel<25&&ch(.3)){add('gl',-3);log(k.n+' meldet sich kaum noch bei dir.')}}
    if(ka>=10&&ch(.25))msg('kid'+i,pick(ka>=20?KIDMSG2:KIDMSG));
  });
  if(cost){p.money-=cost;R0.out.push(['Kinderförderung',cost])}}
const QEV={
 rebel:i=>{const k=p.kids[i];if(!k)return null;return E(k.n+' rebelliert',k.n+' kommt nachts um drei nach Hause und knallt die Tür.',()=>true,[['Hausarrest',()=>(k.rel-=10,k.st.in=Math.min(100,k.st.in+2),'Zwei Wochen Hausarrest. Eisige Stimmung.')],['In Ruhe reden',()=>(k.rel=Math.min(100,k.rel+8),'Ihr redet lange. '+k.n+' weint ein bisschen. Danach ist es besser.')],['Ignorieren',()=>(k.rel-=3,'Du tust so, als hättest du nichts gehört.')]])},
 kidmoney:i=>{const k=p.kids[i];if(!k)return null;const a=px$(R(3,15)*1000);return E(k.n+' braucht Geld',k.n+' fragt, ob du mit '+eur(a)+' aushelfen kannst. '+pick(['Die Waschmaschine ist kaputt.','Die Miete ist gestiegen.','Ein Kurs für den Job.','Für die Hochzeit.']),()=>true,[['Geben',()=>p.money<a?'Du hast gerade selbst nicht genug Geld.':(p.money-=a,k.rel=Math.min(100,k.rel+15),add('gl',3),'Du hilfst gern. '+k.n+' ist dir sehr dankbar.')],['Nein',()=>(k.rel-=12,k.n+' ist enttäuscht.')]])},
 label:()=>E('Ein Plattenvertrag!','Ein Label hat dich spielen sehen und will einen Vertrag. 10.000 € Vorschuss.',()=>true,[['Unterschreiben',()=>{p.mus.label=true;p.money+=10000;add('gl',10);mile('Plattenvertrag','star');news('Label nimmt '+p.mus.band+' unter Vertrag','kultur');return 'Du bist jetzt bei einem echten Label!'}],['Lieber unabhängig',()=>(add('gl',2),'Du machst weiter auf eigene Faust.')]]),
 transfer:d=>E('Transferangebot','Ein Spitzenverein will dich holen. Gehalt: '+eur(d)+' im Jahr.',()=>!!(p.job&&p.job.id==='sport'),[['Wechseln',()=>{p.job.pay=d;p.spo.lvl=Math.max(p.spo.lvl,3);p.spo.club=pick(PROCLUBS);mile('Wechsel zu '+p.spo.club,'star');news(p.first+' '+p.last+' wechselt zu '+p.spo.club,'kultur');return 'Neuer Verein: '+p.spo.club+'!'}],['Bleiben',()=>(p.spo.fans=Math.round(p.spo.fans*1.1),'Die Fans lieben dich für deine Treue.')]])};
function nextEvent(){
  const i=p.later.findIndex(l=>l.a<=p.age&&LATER[l.id]&&LATER[l.id].ev);if(i>=0){const l=p.later.splice(i,1)[0];const e=LATER[l.id].f(l.d);if(e&&e.c())return e}
  while(p.q.length){const q=p.q.shift();const e=QEV[q.id]&&QEV[q.id](q.d);if(e&&e.c())return e}
  if(!p.prison&&bigOn()&&(p.bigY==null||p.age-p.bigY>=4)&&ch(.06)){const bs=BIG.filter(b=>b.c());if(bs.length){p.bigY=p.age;return pick(bs)}}
  return null}
function kidP(k,i){return {g:k.g,st:{gl:k.rel},skin:(p.skin+(p.partner?i%2:0))%5,hair:(p.hair+i)%6,beard:false,bald:false,glasses:false,look:{o:null,acc:[]}}}
let famTab='kinder';
function viewFamilie(){if(!['kinder','eltern','baum','erbe'].includes(famTab))famTab='kinder';
  let h='<div class="seg full">'+[['kinder','Kinder'],['eltern','Eltern'],['baum','Stammbaum'],['erbe','Testament']].map(([k,l])=>'<button data-a="famtab" data-g="'+k+'" aria-pressed="'+(famTab===k)+'">'+l+'</button>').join('')+'</div>';
  if(famTab==='kinder'){
    h+=p.kids.length?p.kids.map((k,i)=>{const ka=p.age-k.b,st=ka<6?'Kleinkind':ka<18?(ka<10?'Grundschule':'Schule'):k.job||(k.edu!=='keine'?k.edu:'sucht sich noch'),T=TAL[k.tal];
      return '<section class="card kid"><div class="fh"><span class="meav sm">'+avatarSvg(ka,60,kidP(k,i))+'</span><div><b>'+esc(k.n)+(k.adopt?' (adoptiert)':'')+'</b><small>'+ka+' Jahre · '+esc(st)+(k.out?' · ausgezogen':'')+(k.mar?' · verheiratet':'')+(k.kids?' · '+k.kids+' Kind(er)':'')+'</small></div></div>'+
        '<div class="stat"><div class="r"><span>Verbindung zu dir</span><span>'+k.rel+' %</span></div><div class="bar"><i class="'+(k.rel<30?'low':'')+'" style="width:'+k.rel+'%"></i></div></div>'+
        '<div class="stat"><div class="r"><span>Talent: '+T[0]+'</span><span>'+k.ts+'</span></div><div class="bar"><i style="width:'+k.ts+'%;background:#8E63D6"></i></div></div>'+
        (ka>=6&&ka<19?'<div class="mt">Förderung (pro Jahr)</div><div class="amts">'+Object.keys(FD).map(f=>'<button class="amt" data-a="kidfd" data-g="'+i+':'+f+'" aria-pressed="'+!!k.fd[f]+'">'+FD[f][0]+' · '+eur(px$(FD[f][1]))+'</button>').join('')+'</div><p class="note" style="margin-top:4px">'+T[0]+'-Talent wächst am schnellsten mit '+FD[T[1]][0]+'.</p>':'')+
        '<div class="btns">'+btn('kidtime',i,'Zeit verbringen','o',p.act<=0||!!p.prison)+(ka>=18?btn('kidgift',i,'2.000 € schenken','',p.money<2000):'')+'</div></section>'}).join(''):card('','<p class="note">Noch keine Kinder. Ein Baby bekommst du in der App Liebe, adoptieren kannst du hier.</p>');
    h+=card('Adoption',row('Ein Kind adoptieren','ab 25 Jahren · '+eur(px$(8000))+' Gebühren · 1 Aktion',btn('adoptkid',null,'Adoptieren','o',p.age<25||p.age>55||p.act<=0||!!p.prison||p.money<px$(8000))));
  }
  if(famTab==='eltern'){const rb=(id,n,s)=>'<div class="stat"><div class="r"><span>'+esc(n)+' <small class="note">'+s+'</small></span><span>'+p.rel[id]+' %</span></div><div class="bar"><i class="'+(p.rel[id]<30?'low':'')+'" style="width:'+p.rel[id]+'%"></i></div></div>';
    h+=card('Beziehungen',(p.parentsGone?'<p class="note">Deine Eltern sind verstorben.</p>':rb('mama','Mama','')+rb('papa','Papa',''))+(p.age>=6?rb('freund',p.friend,'beste/r Freund/in'):'')+'<p class="note" style="margin-top:6px">Anrufe, Treffen und Geburtstage halten Beziehungen warm. Ohne Kontakt kühlen sie ab.</p><div class="btns">'+btn('goto','chats','Zu den Chats','o')+btn('goto','kalender','Zum Kalender')+'</div>');
    h+=sibCard();h+=card('Haustiere',(p.pets.length?p.pets.map(x=>row(esc(x.n),PETS[x.t].n+' · '+x.age+' Jahre')).join(''):'<p class="note">Noch kein Haustier.</p>')+actRows(['pet']))+card('Tierheim',special('adopt'));
  }
  if(famTab==='baum'){const node=(n,s,cls)=>'<div class="tn '+(cls||'')+'"><b>'+esc(n)+'</b><small>'+esc(s)+'</small></div>';
    h+='<section class="card tree">'+(p.tree.length?p.tree.map(t=>node(t.n,'Generation '+t.gen+' · '+t.age+' Jahre · '+t.job,'anc')+'<i class="tl"></i>').join(''):'')+
      '<div class="trow">'+node(p.first+' '+p.last,'Du · Generation '+p.gen+' · '+p.age+' Jahre','me')+(p.partner?node(p.partner.name,p.partner.mar?'verheiratet':'Partner/in','pt'):'')+'</div>'+
      (p.kids.length?'<i class="tl"></i><div class="trow wrap">'+p.kids.map(k=>node(k.n,(p.age-k.b)+' Jahre'+(k.kids?' · '+k.kids+' Enkel':''),'kd')).join('')+'</div>':'')+'</section><p class="note">Wenn du stirbst, kannst du als eines deiner Kinder weiterspielen. So wächst dein Stammbaum über Generationen.</p>';
  }
  if(famTab==='erbe'){const opts=[['gleich','Gerecht aufteilen','Alle Kinder bekommen gleich viel.']].concat(p.kids.map((k,i)=>['kid'+i,'Alles an '+k.n,'Die anderen Kinder gehen leer aus.']),p.partner?[['partner','Alles an '+p.partner.name,'Die Kinder erben erst später.']]:[],[['stiftung','Stiftung für einen guten Zweck','Ruf +, die Familie erbt nichts.']]);
    h+='<section class="card"><h2 class="h">Dein Testament</h2><p class="note" style="margin-bottom:8px">Geschätztes Erbe heute: '+eur(Math.max(0,netWorth())*.9)+' (nach 10 % Erbschaftsteuer).</p>'+opts.map(([k,l,s])=>'<button class="opt wl" data-a="will" data-g="'+k+'" aria-pressed="'+(p.will===k)+'"><b>'+esc(l)+'</b><small>'+s+'</small></button>').join('')+
      '<p class="note" style="margin-top:8px">Ungleiche Testamente sorgen oft für Streit zwischen den Kindern. Wer erbt, startet beim Weiterspielen mit diesem Geld. Deine Firmen und Geschäfte übernimmt das Kind, mit dem du weiterspielst (außer bei einer Stiftung).</p></section>';
  }
  return h}
function estate(){return Math.max(0,Math.round(netWorth()*.9))}
function shareOf(i){const e=estate(),alive=p.kids.filter(k=>k.alive!==false).length||1;if(p.will==='gleich')return Math.round(e/alive);if(p.will==='kid'+i)return e;return 0}
function continueAs(i){const prev=p,k=prev.kids[i];if(!k)return;const ka=prev.age-k.b,share=shareOf(i),deg=k.edu;
  const tree=(prev.tree||[]).concat([{n:prev.first+' '+prev.last,gen:prev.gen||1,age:prev.age,job:prev.pension?'Rentner/in':status(),nw:Math.round(netWorth())}]);
  const lastN=prev.last,sb=prev.sb;newLife(k.n,lastN,k.g,Math.max(0,ka),sb);p.cfg=prev.cfg;p.act=actBase();p.clock=DAYSTART;ensureLife();
  p.gen=(prev.gen||1)+1;p.tree=tree;p.sibs=prev.kids.filter((x,j)=>j!==i&&x.alive!==false).map(x=>({n:x.n,g:x.g,d:k.b-x.b,rel:clamp(x.rel,20,90),job:x.job||null,mar:!!x.mar}));if(prev.apps){p.apps=Object.assign({},prev.apps);p.appSeen={};APPS.forEach(a=>{if(appVisible(a[0]))p.appSeen[a[0]]=1})}p.money+=share;
  if(prev.biz&&prev.biz.co&&prev.will!=='stiftung'&&(prev.will==='gleich'||prev.will==='kid'+i)){const bv=(prev.biz.fronts||[]).reduce((s,k)=>s+FR[k].cost,0)+(prev.biz.firm&&!prev.biz.firm.ipo?prev.biz.firm.val:0);p.biz=prev.biz;p.dirty=prev.dirty||0;p.money=Math.max(0,p.money-Math.min(share,bv));log('Du übernimmst das Familienunternehmen '+prev.biz.co.name+'.');mile('Familienunternehmen übernommen','star')}p.st.in=k.st.in;p.st.ge=Math.min(100,k.st.ge);p.st.gl=clamp(50+Math.round(k.rel/3),0,100);
  if(ka>=18){p.edu=deg==='keine'?(k.st.in>=55?'Abitur':'Realschule'):deg;p.school=null}
  p.parentsGone=!prev.partner;p.pa=ka+R(25,35);if(prev.rival&&ka>=6){p.rival=null}
  for(let j=0;j<(k.kids||0);j++){const ca=R(0,Math.max(0,Math.min(20,ka-22)));p.kids.push({n:pick(ch(.5)?FN:MN),b:p.age-ca})}
  if(k.mar&&ka>=18){newPartner(70);p.partner.mar=true}
  if(k.tal==='sport')p.sk.form=Math.max(p.sk.form,k.ts*.6);if(share)log('Du erbst '+eur(share)+'.');
  mile('Generation '+p.gen+' beginnt','star');log('Du spielst jetzt als '+k.n+' weiter, Kind von '+prev.first+'.');ensureLife();save();render()}
const EPI=['Hat gelebt, geliebt und gelacht.','Lieber reich als langweilig.','Endlich mal ausschlafen.','Danke für alles.','Ich war hier.','Alles richtig gemacht. Fast.'];
function viewDeath(){ensureLife();const S=p.stats,ep=p.epi!=null?EPI[p.epi]:null,heirs=p.kids.filter(k=>k.alive!==false);
  const enk=p.kids.reduce((s,k)=>s+(k.kids||0),0),me=p.first+' '+p.last;
  const nach=me+' wurde '+p.age+' Jahre alt. '+(p.deg?'Studierte '+p.deg+'. ':'')+(p.pension?'Arbeitete bis zur Rente. ':p.job?'Zuletzt '+p.job.t+'. ':'')+(p.partner&&p.partner.mar?'Hinterlässt '+p.partner.name+'. ':'')+(p.kids.length?p.kids.length+' Kind(er)'+(enk?' und '+enk+' Enkel':'')+' trauern. ':'')+(p.ruf>=40?'Bekannt für ein großes Herz.':p.ruf<=-40?'Nicht alle werden weinen.':'');
  let h='<div class="start death"><div class="grave"><div class="stone"><small>In Erinnerung an</small><b>'+esc(me)+'</b>'+(curTitle()?'<span class="ttl">'+esc(curTitle())+'</span>':'')+'<span>'+(p.gen>1?'Generation '+p.gen+' · ':'')+'† mit '+p.age+'</span><em>'+(ep?'„'+esc(ep)+'“':'Wähle unten einen Spruch')+'</em></div></div>'+
    '<p class="obit">'+esc(nach)+' Gestorben '+esc(p.cause)+'.</p>';
  if(p.epi==null)h+='<section class="card"><h2 class="h">Spruch für den Grabstein</h2><div class="epis">'+EPI.map((e,i)=>'<button class="opt" data-d="epi:'+i+'">'+esc(e)+'</button>').join('')+'</div></section>';
  h+='<section class="card"><h2 class="h">Statistik</h2><div class="sgrid">'+[[eur(S.maxNW),'höchstes Vermögen'],[eur(S.earn),'insgesamt verdient'],[S.jobs,'Jobs'],[S.partners,'Partner/innen'],[p.kids.length,'Kinder'],[enk,'Enkel'],[S.cities,'Städte'],[p.crimes,'Straftaten'],[kfmt(Math.max(S.maxFol,p.sm?p.sm.fol:0)),'Follower (max.)'],[rufTxt(p.ruf),'Ruf'],[Object.keys(p.ach).length,'Erfolge'],[(p.ms||[]).length,'Meilensteine']].map(x=>'<div><b>'+x[0]+'</b><small>'+x[1]+'</small></div>').join('')+'</div></section>';
  h+='<section class="card"><h2 class="h">Lebensrückblick</h2><div class="tline">'+((p.ms||[]).length?p.ms.map(m=>'<div class="tm '+m.k+'"><span>'+m.a+'</span><b>'+esc(m.t)+'</b></div>').join(''):'<p class="note">Ein ruhiges Leben ohne große Wendepunkte.</p>')+'</div></section>';
  if(heirs.length){const e=estate();h+='<section class="card"><h2 class="h">Erbe und Weiterspielen</h2><p class="note">Nachlass: '+eur(e)+' · Testament: '+(p.will==='gleich'?'gerecht aufgeteilt':p.will==='stiftung'?'Stiftung':p.will==='partner'?'an '+(p.partner?p.partner.name:'Partner/in'):'an ein Kind')+'</p>'+
    (p.will.startsWith('kid')&&heirs.length>1?'<p class="note" style="color:var(--bad)">Die übrigen Kinder fühlen sich übergangen. Es gibt Streit ums Erbe.</p>':'')+
    p.kids.map((k,i)=>k.alive===false?'':row('Als '+esc(k.n)+' weiterspielen',(p.age-k.b)+' Jahre · erbt '+eur(shareOf(i)),'<button class="btn sm o" data-d="cont:'+i+'">Weiter</button>')).join('')+'</section>'}
  h+='<button class="btn o big" id="again">Neues Leben</button></div>';return h}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-d]');if(!b||!p||p.alive)return;const [k,v]=b.dataset.d.split(':');
  if(k==='epi'){p.epi=+v;save();render()}if(k==='cont')continueAs(+v)});

