/* ================= Freizeit: Events, Sport, Gesundheit, Shoppen ================= */
function season(){const m=new Date().getMonth();
  if(m===9)return {n:'Halloween',d:'Kürbisse vor jeder Tür, Geister auf der Straße, Nebel in der Gasse.',a:[['kostuem','Kostümparty',40,'Das beste Kostüm gewinnt eine Flasche Sekt. Vielleicht triffst du jemanden.']]};
  if(m>=10)return {n:'Weihnachtsmarkt',d:'Lichter, Buden und eine Eisbahn mitten in der Stadt.',a:[['gluehwein','Glühwein',4,'Heiß, süß und mit Zimt.'],['mandeln','Gebrannte Mandeln',4,'In der Tüte, noch warm.'],['eis','Eislaufen',8,'Runde um Runde mit Musik und Lichtern.'],['geschenke','Geschenke kaufen',150,'Für Familie und Freunde. Die Augen beim Auspacken sind es wert.']]};
  if(m===1)return {n:'Karneval',d:'Konfetti, Kamelle und Kostüme in allen Straßen.',a:[['umzug','Zum Umzug',10,'Kamelle fangen und mitsingen.'],['kostuem','Kostümparty',40,'Wer erkennt dich unter der Maske?']]};
  if(m>=2&&m<=4)return {n:'Frühlingsfest',d:'Riesenrad, Zuckerwatte und die ersten warmen Tage.',a:[['riesenrad','Riesenrad',8,'Die ganze Stadt von oben.'],['flohmarkt','Flohmarkt',0,'Alte Sachen verkaufen, ein bisschen Geld verdienen.']]};
  return {n:'Sommer in der Stadt',d:'Freibad, Grillduft und lange Abende am Fluss.',a:[['freibad','Ins Freibad',6,'Sprungturm, Pommes, Sonnenbrand.'],['grill','Grillparty',30,'Mit Freunden bis in die Nacht.']]};
}
const KURSE={fahren:['Fahrsicherheitstraining',300,'fahren',16],schloss:['Übungsschlösser',90,'schloss',12],hack:['Online-Kurs Programmieren',240,'hack',12],charme:['Rhetorikkurs',200,'charme',14],kampf:['Selbstverteidigung',150,'kampf',10]};
const GYM={basic:{n:'Studio Basic',c:600,u:3,d:'Geräte, Hanteln, Duschen. 3 Einheiten im Jahr.'},premium:{n:'Studio Premium',c:1800,u:6,d:'Sauna, Kurse, Trainer. 6 Einheiten im Jahr.'}};
const FOCUS={ganz:['Ganzkörper','Von allem etwas, gleichmäßig fit.'],ausdauer:['Ausdauer','Laufband und Rad: mehr Form und Gesundheit.'],kraft:['Kraft','Muskeln und Ausstrahlung: mehr Aussehen.'],kampfs:['Kampfsport','Sandsack und Technik: mehr Kampf.']};
const CLUBS={fc:['Fußballverein',400,'Training unter Flutlicht, danach ins Vereinsheim. Glück und Freundschaften.'],box:['Boxclub',700,'Sandsäcke und ein Trainer, der nichts durchgehen lässt. Kampf und Form.'],lauf:['Lauftreff',150,'Jeden Morgen ein paar Kilometer. Form und Gesundheit.']};
const TURN={lauf:['Stadtlauf',40,800,'form',35],box:['Boxabend',150,6000,'kampf',55],marathon:['Marathon',120,15000,'form',65]};
const VORS={nie:['Nie',0,'Kostet nichts, aber Krankheiten fallen spät auf.',1.3],beschw:['Nur bei Beschwerden',0,'Du gehst, wenn etwas weh tut.',1],jahr:['Jedes Jahr',900,'Check-up jedes Jahr. Früherkennung, weniger Krankheiten.',.6]};
const KRANK={abwarten:['Abwarten','Spart Geld, aber Krankheiten werden schlimmer.'],spaeter:['Wenn es nicht besser wird','Nach einem Jahr gehst du doch zur Behandlung.'],sofort:['Sofort behandeln','Bei Krankheit gehst du gleich hin. Kostet, heilt aber schnell.']};
const DIET={normal:{n:'Wie bisher',c:0,d:'Du isst, was gerade da ist.'},fast:{n:'Fast Food',c:1500,d:'Schnell, billig, lecker. Der Körper sieht das anders.',ge:-2,au:-1,gl:1,skin:-6},
ausgewogen:{n:'Ausgewogen',c:3600,d:'Von allem etwas, viel Gemüse, wenig Zucker.',ge:1,skin:3},vegetarisch:{n:'Vegetarisch',c:3200,d:'Ohne Fleisch, mit viel Gemüse und Hülsenfrüchten.',ge:1,skin:3},
vegan:{n:'Vegan',c:4200,d:'Rein pflanzlich. Gut geplant sehr gesund.',ge:2,skin:4},eiweiss:{n:'Eiweißreich',c:5400,d:'Viel Protein für den Sport. Mit Training baust du Muskeln auf.',ge:1,form:2,skin:-2},
mediterran:{n:'Mediterran',c:6000,d:'Olivenöl, Fisch, Gemüse, Vollkorn. Gut fürs Herz.',ge:2,gl:1,skin:5}};
const ILLS={grippe:{n:'Grippe',a:[0,120],p:.12,dmg:3,self:.8,cure:'hausarzt'},zahn:{n:'Zahnschmerzen',a:[6,120],p:.06,dmg:1,self:.2,cure:'zahnarzt'},haut:{n:'Unreine Haut',a:[12,30],p:.12,dmg:0,au:-3,self:.4,cure:'hautarzt'},
ruecken:{n:'Rückenschmerzen',a:[28,120],p:.06,dmg:2,self:.2,cure:'physio'},depr:{n:'Niedergeschlagenheit',a:[12,120],p:.03,dmg:1,gl:-5,self:.25,cure:'psycho'},verletzt:{n:'Sportverletzung',a:[0,120],p:0,dmg:3,self:.6,cure:'ortho'},
herz:{n:'Herzschwäche',a:[50,120],p:.025,dmg:6,self:0,death:.06,cure:'herzop'},huefte:{n:'Hüftarthrose',a:[55,120],p:.035,dmg:3,self:0,cure:'huefte'},star:{n:'Grauer Star',a:[60,120],p:.04,dmg:1,self:0,cure:'katarakt'}};
const TREAT={hausarzt:['Vorsorge beim Hausarzt',80,'Blut, Blutdruck, ein paar Fragen. Hilft bei Grippe.',{ge:2}],zahnarzt:['Zahnarzt',90,'Kontrolle und Reinigung. Tut kaum weh, versprochen.',{au:1}],
bleaching:['Bleaching',450,'Strahlend weiße Zähne. Dein Lächeln wirkt gleich doppelt.',{au:4}],hautarzt:['Hautarzt',150,'Pickel und Unreinheiten behandeln. Wirkt zwei Jahre.',{skin:20}],
botox:['Botox und Filler',600,'Glättet Falten: du wirkst jünger.',{au:6},30],physio:['Physiotherapie',400,'Massage, Übungen, ein Rücken, der wieder mitmacht.',{ge:3}],
psycho:['Psychotherapie',900,'Eine Stunde nur für dich. Reden hilft.',{gl:8}],ortho:['Orthopäde',300,'Rücken, Gelenke und Verletzungen.',{ge:2}],
check:['Großer Gesundheitscheck',1200,'Ein ganzer Tag Untersuchungen. Was gefunden wird, lässt sich meist noch gut behandeln.',{ge:4},18],
katarakt:['Katarakt-OP',3500,'Eine kleine OP am Auge. Alles wird wieder klar.',{ge:2},45],huefte:['Neue Hüfte',15000,'Wieder schmerzfrei gehen.',{ge:6},45],
herzop:['Herz-OP',35000,'Bypass oder neue Klappe. Teuer und riskant, aber ein starkes Herz hält länger.',{ge:10},40,.06],premium:['Premium-Klinik',60000,'Ein Jahr rundum betreut: Spezialisten, Frühdiagnostik, Erholung. Wirkt zwei Jahre.',{ge:15,gl:5},18],
schoenop:['Schönheits-OP',6000,'Ein kleiner Eingriff, ein großer Auftritt. Ganz ohne Risiko ist es nicht.',{au:15},18,.1],facelift:['Facelift',14000,'Die große Verjüngung, mit kleinem Risiko.',{au:20},40,.05]};
const OUTFITS=[['hoodie','Hoodie',1,60,'#6C5CE7'],['bomber','Bomberjacke',2,180,'#4E5B3A'],['kleid','Sommerkleid',2,150,'#F7A8C2'],['tarn','Tarnpullover',2,130,'#6B7A4B'],['blumen','Blumen-Look',2,160,'#F2B33D'],['punkte','Punkte-Look',2,140,'#D7263D'],['anzug','Maßanzug',4,1800,'#2A3458'],['designer','Designer-Outfit',5,4500,'#111318']];
const ACCS=[['brille','Sonnenbrille',1,90],['hut','Hut',1,70],['kette','Goldkette',2,900]];
const OF=Object.fromEntries(OUTFITS.map(o=>[o[0],o]));
function stil(){const o=p.ward.filter(k=>OF[k]).reduce((m,k)=>Math.max(m,OF[k][2]),0),a=ACCS.filter(x=>p.ward.includes(x[0])).reduce((s,x)=>s+x[2],0);return Math.min(8,o+a)}
function lifeYear(){const out={ls:0,treat:0,risk:0},a=p.age;
  // Lebensstil
  const dk=p.staff.koch?'mediterran':p.ls.diet,D=DIET[dk];out.ls+=px$(DIET[p.ls.diet].c)+px$(VORS[p.ls.vors][1]);
  if(p.gym){out.gym=px$(GYM[p.gym].c);out.ls+=out.gym}p.clubs.forEach(c=>out.ls+=px$(CLUBS[c][1]));
  if(D.ge)add('ge',D.ge);if(D.au)add('au',D.au);if(D.gl)add('gl',D.gl);if(D.form)p.sk.form=clamp(p.sk.form+D.form,0,100);
  if(p.clubs.includes('fc')){add('gl',4);p.sk.form=Math.min(100,p.sk.form+2)}if(p.clubs.includes('box')){p.sk.kampf=Math.min(100,p.sk.kampf+3);p.sk.form=Math.min(100,p.sk.form+2)}if(p.clubs.includes('lauf')){p.sk.form=Math.min(100,p.sk.form+3);add('ge',2)}
  p.gymU=p.gym?GYM[p.gym].u:0;
  // Form sinkt ohne Sport
  if(!p.gym&&!p.clubs.length)p.sk.form=Math.max(0,p.sk.form-(a>40?3:2));if(p.sk.form>=60)add('ge',1);
  // Haut
  p.skinS=clamp(p.skinS+(D.skin||0)/3+(p.sk.form>=50?1:0)-(a>40?1:0)+(p.skinT>0?4:0)+R(-2,2)-(p.ill.haut?6:0),0,100);if(p.skinT>0)p.skinT--;
  if(p.skinS>=85)add('au',1);else if(p.skinS<40)add('au',-2);if(stil()>=5)add('au',1);
  if(p.prem>0){p.prem--;add('ge',3)}
  // Krankheiten
  const vf=VORS[p.ls.vors][3];
  Object.keys(ILLS).forEach(k=>{const I=ILLS[k];if(p.ill[k]){const s=p.ill[k];s.y++;add('ge',-I.dmg);if(I.gl)add('gl',I.gl);if(I.au)add('au',I.au);out.risk+=I.death||0;
      const pol=p.ls.krank,T=TREAT[I.cure],c=px$(T[1]);
      if((pol==='sofort'||(pol==='spaeter'&&s.y>=2))&&p.money>=c&&!p.prison){p.money-=c;out.treat+=c;delete p.ill[k];log(I.n+' wurde behandelt ('+T[0]+', '+eur(c)+').');return}
      if(ch(I.self)){delete p.ill[k];log(I.n+' ist von selbst abgeklungen.')}return}
    if(a<I.a[0]||a>I.a[1]||!I.p)return;let pr=I.p*vf*(p.sk.form>=60?.75:1)*(p.prem>0?.3:1)*(D.ge>0?.85:D.ge<0?1.3:1);if(k==='depr'&&p.st.gl<35)pr*=6;
    if(ch(pr)){p.ill[k]={y:0};log((p.ls.vors==='jahr'?'Früh erkannt: ':'Diagnose: ')+I.n+'.');if(p.ls.vors==='jahr')p.ill[k].y=-1}});
  if(!Object.keys(p.ill).length)add('ge',a<40?2:a<65?1:0);
  p.money-=out.ls;
  return out;
}
function viewFreizeit(){ensureEcon();const lock=!!p.prison;
  let h='<div class="seg full ft">'+[['aktiv','Aktiv'],['hobby','Hobbys'],['sport','Sport'],['gesund','Gesundheit'],['shop','Shoppen']].map(([k,l])=>'<button data-a="ftab" data-g="'+k+'" aria-pressed="'+(fTab===k)+'">'+l+'</button>').join('')+'</div>';
  if(fTab==='hobby')return h+viewHobby(lock);
  if(lock&&fTab!=='sport')return h+card('','<p class="note">Im Gefängnis kannst du nur trainieren und lesen.</p>')+card('',actRows(['sport','lesen']));
  if(fTab==='aktiv'){const S=season();
    h+='<section class="card event"><div class="lbl">HEUTE IN DER STADT</div><h2 class="h">'+S.n+'</h2><p class="note">'+S.d+'</p>'+S.a.map(([k,n,c,d])=>row(n,(c?eur(px$(c))+' · ':'')+d,btn('event',k,once('ev_'+k)?'Erledigt':'Los','o',once('ev_'+k)||p.money<px$(c)))).join('')+'</section>';
    h+=card('Aktivitäten',actRows(['party','urlaub','medi','lesen','lotto'])+row('Weltreise','Ein halbes Jahr um die Welt · '+eur(px$(perk('pilot')?12500:25000)),btn('welt',null,p.welt?'Gemacht':'Los','o',p.age<18||p.money<px$(25000)||p.act<=0)));
    h+=card('Kurse','<p class="note" style="margin-bottom:4px">Jeder Kurs kostet 1 Aktion und verbessert eine Fähigkeit.</p>'+Object.keys(KURSE).map(k=>{const K=KURSE[k];return row(K[0],eur(px$(K[1]))+' · '+SKN[K[2]][0]+' '+Math.round(p.sk[K[2]]),btn('kurs',k,'Los','',p.age<K[3]||p.act<=0||p.money<px$(K[1])||p.sk[K[2]]>=100))}).join(''));
  }
  if(fTab==='sport'){
    h+='<div class="bizsum"><div><b>'+Math.round(p.sk.form)+'</b><small>Form von 100</small></div><div><b>'+Math.round(p.sk.kampf)+'</b><small>Kampf von 100</small></div></div>';
    h+=card('Fitnessstudio',Object.keys(GYM).map(k=>{const G=GYM[k];return row(G.n,eur(px$(G.c)/12)+' im Monat · '+G.d+' Monatlich kündbar.',p.gym===k?btn('gym','none','Kündigen','g'):btn('gym',k,'Abschließen','',p.age<14||lock))}).join('')+
      (p.gym?row('Trainieren',(p.gymU||0)+' von '+GYM[p.gym].u+' Einheiten übrig · kostet keine Aktion',btn('train',null,'Los','o',!p.gymU)):'')+
      '<div class="mt" style="margin-top:10px">Trainingsschwerpunkt</div><div class="amts">'+Object.keys(FOCUS).map(k=>'<button class="amt" data-a="focus" data-g="'+k+'" aria-pressed="'+(p.focus===k)+'">'+FOCUS[k][0]+'</button>').join('')+'</div><p class="note" style="margin-top:6px">'+FOCUS[p.focus][1]+'</p>');
    h+=card('Verein',Object.keys(CLUBS).map(k=>{const C=CLUBS[k],in_=p.clubs.includes(k);return row(C[0],eur(px$(C[1]))+' im Jahr · '+C[2],btn('club',k,in_?'Austreten':'Eintreten',in_?'g':'',lock||p.age<8))}).join(''));
    h+=card('Turniere','<p class="note" style="margin-bottom:4px">Einmal pro Jahr. Startgeld, kein Einsatz. Deine Chance hängt von Form oder Kampf ab.</p>'+Object.keys(TURN).map(k=>{const T=TURN[k],chc=Math.round(clamp((p.sk[T[3]]-T[4])/40+.3,.05,.9)*100);
      return row(T[0],'Startgeld '+eur(px$(T[1]))+' · Sieg '+eur(px$(T[2]))+' · Chance '+chc+' %',btn('turnier',k,once('t_'+k)?'Erledigt':'Antreten','o',once('t_'+k)||p.age<14||lock||p.money<px$(T[1])))}).join(''));
    h+=card('Training',actRows(['sport','jog']));
  }
  if(fTab==='gesund'){const ill=Object.keys(p.ill);
    h+=card('Dein Befinden',ill.length?ill.map(k=>{const I=ILLS[k],T=TREAT[I.cure];return row(I.n,p.ill[k].y<0?'früh erkannt':'seit '+p.ill[k].y+' Jahr(en)',btn('treat',I.cure,T[0]+' · '+eur(px$(T[1])),'o',p.money<px$(T[1])||once('tr_'+I.cure)))}).join(''):'<p class="note">Dir fehlt gerade nichts. Gesundheit '+p.st.ge+' %.</p>');
    const opt=(key,obj,cur,lab)=>Object.keys(obj).map(k=>{const o=obj[k],n=Array.isArray(o)?o[0]:o.n,d=Array.isArray(o)?(o.length>3?o[2]:o[1]):o.d,c=Array.isArray(o)?(typeof o[1]==='number'?o[1]:0):o.c;
      return '<div class="opt2'+(cur===k?' on':'')+'"><div><b>'+n+'</b><small>'+(c?eur(px$(c))+' im Jahr · ':'')+d+'</small></div>'+(cur===k?'<span class="chip">Gewählt</span>':btn(key,k,'Wählen','g'))+'</div>'}).join('');
    h+=hInfo()+card('Vorsorge',opt('vors',VORS,p.ls.vors))+card('Wenn du krank wirst',opt('krank',KRANK,p.ls.krank))+card('Ernährung'+(p.staff.koch?' (dein Koch kocht mediterran)':''),opt('diet',DIET,p.ls.diet));
    h+=card('Praxis und Klinik','<p class="note" style="margin-bottom:4px">Jede Behandlung einmal pro Jahr, ohne Aktion.</p>'+Object.keys(TREAT).map(k=>{const T=TREAT[k];return row(T[0],eur(px$(T[1]))+' · '+T[2],btn('treat',k,once('tr_'+k)?'Erledigt':'Termin','o',once('tr_'+k)||p.money<px$(T[1])||(T[4]&&p.age<T[4])))}).join(''));
  }
  if(fTab==='shop'){const st=stil();
    h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Dein Stil</h2><b>'+st+' von 8</b></div><div class="bar" style="margin:8px 0"><i style="width:'+st/8*100+'%;background:#C2408C"></i></div><p class="note">Ab Stil 5 steigt dein Aussehen jedes Jahr. Was du trägst, sieht man an deiner Figur.</p>'+
      row('Shoppingtour','Bummeln und anprobieren · '+eur(px$(300))+' · +6 Glück, zweimal im Jahr',btn('tour',null,(p.tourN||0)>=2&&p.tourA===p.age?'Erledigt':'Los','o',((p.tourN||0)>=2&&p.tourA===p.age)||p.money<px$(300)))+'</section>';
    h+='<div class="wgrid">'+OUTFITS.map(o=>{const own=p.ward.includes(o[0]),worn=p.look.o===o[0];return '<div class="wcard'+(worn?' on':'')+'"><div class="wav">'+avatarSvg(Math.max(p.age,14),96,null,{o:o[0],acc:p.look.acc})+'</div><b>'+o[1]+'</b><span class="stars small">'+'★'.repeat(o[2])+'</span>'+
      (own?btn('wear',o[0],worn?'Ablegen':'Anziehen',worn?'g':'o'):btn('outfit',o[0],eur(px$(o[3])),'o',p.money<px$(o[3])||p.age<10))+'</div>'}).join('')+'</div>';
    h+=card('Accessoires',ACCS.map(x=>{const own=p.ward.includes(x[0]),worn=p.look.acc.includes(x[0]);return row(x[1],'Stil +'+x[2]+(own?'':' · '+eur(px$(x[3]))),own?btn('wear',x[0],worn?'Ablegen':'Tragen',worn?'g':'o'):btn('outfit',x[0],'Kaufen','',p.money<px$(x[3])||p.age<10))}).join(''));
  }
  return h;
}
function act2(id,arg){
  switch(id){
  case 'fgterm':bankUI.fgT=+arg;render();return 1;
  case 'fgamt':bankUI.fgA=arg==='all'?'all':+arg;render();return 1;
  case 'fgopen':{const a=bankUI.fgA==='all'?Math.floor(Math.max(0,p.money)):bankUI.fgA;if(p.age<18||a<100||p.money<a)return 1;p.money-=a;p.fg.push({amt:a,rate:+rates()[bankUI.fgT].toFixed(1),left:bankUI.fgT});done(eur(a)+' als Festgeld für '+bankUI.fgT+' Jahr(e) angelegt.');return 1}
  case 'fgbreak':{const f=p.fg[+arg];if(!f)return 1;p.fg.splice(+arg,1);const v=Math.round(f.amt*.97);p.money+=v;done('Festgeld vorzeitig gekündigt: '+eur(v)+' zurück.');return 1}
  case 'krterm':bankUI.krT=+arg;render();return 1;
  case 'kramt':bankUI.krA=arg==='max'?'max':+arg;render();return 1;
  case 'kropen':{const ml=maxLoan(),a=Math.min(bankUI.krA==='max'?ml:bankUI.krA,ml);if(a<1000||p.prison)return 1;p.loans.push(mkLoan(a,loanRate(),bankUI.krT));p.money+=a;done('Kredit über '+eur(a)+' aufgenommen.');return 1}
  case 'krrepay':{const [i,v]=arg.split(':'),l=p.loans[+i];if(!l)return 1;const a=v==='all'?l.amt:Math.min(5000,l.amt,Math.max(0,p.money));if(a<=0||p.money<a)return 1;p.money-=a;l.amt-=a;
    if(l.amt<=0)p.loans.splice(+i,1);else l.pay=mkLoan(l.amt,l.rate,Math.max(1,l.left)).pay;done(eur(a)+' Kredit zurückgezahlt.');return 1}
  case 'finyr':bankUI.yr=+arg;render();return 1;
  case 'fktoggle':bankUI.fk=!bankUI.fk;render();return 1;
  case 'wtab':wTab=arg;render();return 1;
  case 'enter':roomView=!roomView;render();return 1;
  case 'furn':{const [k,t]=arg.split(':'),ti=+t,c=px$(TIERS[ti][2]*FURN[k][1]);if(!furnOk(k)||(p.furn[k]!=null&&p.furn[k]>=ti)||p.money<c||p.prison)return 1;p.money-=c;p.furn[k]=ti;add('gl',2);done(FURN[k][0]+' ('+TIERS[ti][0]+') ist eingerichtet.');return 1}
  case 'rentout':if(!p.owned.includes(arg)||p.home===arg)return 1;p.rented[arg]=!p.rented[arg];done(p.rented[arg]?HOMES[arg].n+' ist jetzt vermietet.':HOMES[arg].n+' wird nicht mehr vermietet.');return 1;
  case 'staff':{const S=STAFF[arg];if(p.staff[arg]){const n=p.staff[arg];delete p.staff[arg];done(S.n+' '+n+' ist entlassen.');return 1}if(p.age<18||p.prison||(S.need&&!S.need()))return 1;p.staff[arg]=applicant(arg);done(p.staff[arg]+' arbeitet jetzt als '+S.n+' für dich.');return 1}
  case 'ltab':lTab=arg;render();return 1;
  case 'stathelp':dialog(STAT[arg],STATHELP[arg],[['Verstanden',null]]);return 1;
  case 'buypf':if(p.items.includes('pfeffer')||p.money<px$(25))return 1;p.money-=px$(25);p.items.push('pfeffer');done('Pfefferspray gekauft.');return 1;
  case 'goshop':tab='freizeit';fTab='shop';render();window.scrollTo(0,0);return 1;
  case 'ftab':fTab=arg;render();return 1;
  case 'event':{const S=season(),e=S.a.find(x=>x[0]===arg);if(!e||once('ev_'+arg))return 1;const c=px$(e[2]);if(p.money<c)return 1;p.money-=c;setOnce('ev_'+arg);let t='';
    if(arg==='flohmarkt'){const g=R(40,300);p.money+=g;t='Flohmarkt: '+eur(g)+' eingenommen.'}
    else if(arg==='geschenke'){add('gl',6);if(p.partner)p.partner.rel=Math.min(100,p.partner.rel+6);if(!p.parentsGone)msg('mama','Danke für das Geschenk, mein Schatz! Du bist der/die Beste.');t='Alle haben sich über deine Geschenke gefreut.'}
    else if(arg==='kostuem'&&!p.partner&&p.age>=16&&ch(.2)){newPartner(55);add('gl',8);t='Auf der Kostümparty hast du '+p.partner.name+' kennengelernt!'}
    else{add('gl',R(3,7));t=e[1]+': '+e[3]}done(t);return 1}
  case 'welt':if(p.welt||p.age<18||!useAct())return 1;{const c=px$(perk('pilot')?12500:25000);if(p.money<c){refundAct();toast('Die Weltreise kostet '+eur(c)+'.');return 1}p.money-=c;p.welt=true;add('gl',25);add('in',3);done('Ein halbes Jahr um die Welt. Unvergesslich!')}return 1;
  case 'kurs':{const K=KURSE[arg],c=px$(K[1]);if(p.age<K[3]||p.money<c||!useAct())return 1;p.money-=c;const g=R(10,20);p.sk[K[2]]=Math.min(100,p.sk[K[2]]+g);if(arg==='hack')add('in',2);done(K[0]+' abgeschlossen: '+SKN[K[2]][0]+' +'+g+'.');return 1}
  case 'gym':if(arg==='none'){p.gym=null;p.gymU=0;done('Studio-Abo gekündigt.');return 1}if(p.age<14||p.prison)return 1;{p.gym=arg;p.gymU=GYM[arg].u;done(GYM[arg].n+' abgeschlossen: '+eur(px$(GYM[arg].c)/12)+' im Monat, abgebucht zum Jahresende.')}return 1;
  case 'train':{if(!p.gym||!p.gymU)return 1;p.gymU--;const f=p.focus;p.sk.form=Math.min(100,p.sk.form+(f==='ausdauer'?5:3));add('ge',f==='ausdauer'?3:2);if(f==='kraft'||f==='ganz')add('au',f==='kraft'?3:1);if(f==='kampfs')p.sk.kampf=Math.min(100,p.sk.kampf+4);
    if(p.ls.diet==='eiweiss')add('au',1);if(ch(.04)){p.ill.verletzt={y:0};done('Autsch, beim Training verletzt.')}else done('Training ('+FOCUS[f][0]+') erledigt.');return 1}
  case 'focus':p.focus=arg;render();return 1;
  case 'club':{const i=p.clubs.indexOf(arg);if(i>=0){p.clubs.splice(i,1);done('Aus dem '+CLUBS[arg][0]+' ausgetreten.');return 1}const c=px$(CLUBS[arg][1]);if(p.money<c||p.prison)return 1;p.money-=c;p.clubs.push(arg);add('gl',3);done('Willkommen im '+CLUBS[arg][0]+'!');return 1}
  case 'turnier':{const T=TURN[arg],c=px$(T[1]);if(once('t_'+arg)||p.money<c||p.age<14||p.prison)return 1;p.money-=c;setOnce('t_'+arg);const chc=clamp((p.sk[T[3]]-T[4])/40+.3,.05,.9);let t;
    if(ch(.08)){p.ill.verletzt={y:0};t=T[0]+': verletzt ausgeschieden.'}else if(ch(chc)){const w=px$(T[2]);p.money+=w;add('gl',10);t=T[0]+' gewonnen! Preisgeld '+eur(w)+'.';if(arg==='marathon')p.marathon=true;if(arg==='box')p.sk.kampf=Math.min(100,p.sk.kampf+3)}
    else{add('gl',2);t=T[0]+': ins Ziel gekommen, aber nicht gewonnen.';if(arg==='marathon'&&p.sk.form>=55)p.marathon=true}
    log(t);checkGoals();save();render();dialog(T[0],t,[['Weiter',null]]);return 1}
  case 'vors':p.ls.vors=arg;save();render();return 1;
  case 'krank':p.ls.krank=arg;save();render();return 1;
  case 'diet':p.ls.diet=arg;save();render();return 1;
  case 'treat':{const T=TREAT[arg],c=px$(T[1]);if(once('tr_'+arg)||p.money<c||(T[4]&&p.age<T[4])||p.prison)return 1;p.money-=c;setOnce('tr_'+arg);
    if(T[5]&&ch(T[5])){add('ge',-15);done(T[0]+': Es gab Komplikationen. Gesundheit −15.');return 1}
    Object.keys(T[3]).forEach(k=>{if(k==='skin'){p.skinS=Math.min(100,p.skinS+T[3][k]);p.skinT=2}else add(k,T[3][k])});
    if(arg==='premium')p.prem=2;if(arg==='check'||arg==='premium'){}
    const cured=Object.keys(p.ill).filter(k=>ILLS[k].cure===arg||(arg==='premium')||(arg==='check'&&ILLS[k].dmg<=2));cured.forEach(k=>delete p.ill[k]);
    done(T[0]+' erledigt.'+(cured.length?' Geheilt: '+cured.map(k=>ILLS[k].n).join(', ')+'.':''));return 1}
  case 'tour':{if(p.tourA!==p.age){p.tourA=p.age;p.tourN=0}if(p.tourN>=2)return 1;const c=px$(300);if(p.money<c)return 1;p.money-=c;p.tourN++;add('gl',6);done('Shoppingtour: viel anprobiert, viel gelacht.');return 1}
  case 'outfit':{const o=OF[arg]||ACCS.find(x=>x[0]===arg);const c=px$(o[3]);if(p.ward.includes(arg)||p.money<c)return 1;p.money-=c;p.ward.push(arg);if(OF[arg])p.look.o=arg;else p.look.acc.push(arg);add('gl',2);done(o[1]+' gekauft und angezogen.');return 1}
  case 'wear':{if(OF[arg])p.look.o=p.look.o===arg?null:arg;else{const i=p.look.acc.indexOf(arg);if(i>=0)p.look.acc.splice(i,1);else p.look.acc.push(arg)}save();render();return 1}
  case 'upfront':{const F=FR[arg],l=p.biz.lvl[arg]||1,c=Math.round(F.cost*.5*l);if(!p.biz.fronts.includes(arg)||l>=3||p.money<c||p.prison)return 1;p.money-=c;p.biz.lvl[arg]=l+1;done(F.n+' ausgebaut auf Stufe '+(l+1)+'.');return 1}
  }
  return 0;
}

