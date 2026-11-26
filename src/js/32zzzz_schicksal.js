/* ================= Zentrales Ereignissystem: Gedächtnis, Lebenslage-Ereignisse, Spätfolgen, Wendepunkte ================= */
/* Jede Entscheidung in einem Ereignis wird gemerkt */
function skMerk(k,d){p.skm=p.skm||[];p.skm.push({k,a:p.age,d:d||null});if(p.skm.length>120)p.skm.shift()}
const skMem=(k,minAgo)=>(p.skm||[]).filter(m=>m.k===k&&p.age-m.a>=(minAgo||0));
const histOf=(t,re,minAgo)=>(p.ehist||[]).find(h=>h.t===t&&(!re||re.test(h.o))&&p.age-h.a>=(minAgo||0));
{const _se=showEvent0;showEvent0=function(e){if(!e||!e.o)return _se(e);const e2=Object.assign({},e,{o:e.o.map(([l,f])=>[l,()=>{try{p.ehist=p.ehist||[];p.ehist.push({t:e.t,o:l,a:p.age});if(e.back){p.skfl=p.skfl||[];p.skfl.push({t:e.t,back:e.back,a:p.age});if(p.skfl.length>12)p.skfl.shift()}if(p.ehist.length>300)p.ehist.shift()}catch(x){errLog(x)}return f()}])});
  const r=_se(e2);try{if(e.cat||e.back){const d=document.getElementById('dlg'),h=d&&d.querySelector('h2');if(h&&!d.querySelector('.evcat'))h.insertAdjacentHTML('beforebegin','<div class="evcat">'+(e.cat?'<span>'+e.cat+'</span>':'')+(e.back?'<small>'+esc(e.back)+'</small>':(MEMO[e.t]?'<small class="memo">Das wird man sich merken</small>':''))+'</div>')}}catch(x){errLog(x)}return r}}
const MEMO={'Ein Geldbeutel!':1,'Abschreiben?':1,'Der Rivale braucht Hilfe':1,'Ein Traum vom eigenen Laden':1,'Dein Kind will ausziehen':1,'Bitte um Geld':1,'Versuchung':1,'Mieter in Not':1,'Nichts geht mehr':1,'Ein großzügiges Angebot':1,'Ein Warnschuss':1,'Die Mutprobe':1,'Das kaputte Fenster':1};
const EC=(cat,t,x,o,back)=>{const e=E(t,x,()=>true,o);e.cat=cat;if(back)e.back=back;return e};
const kidAge=k=>p.age-k.b;
const liveKids=()=>(p.kids||[]).filter(k=>k.alive!==false);
const SKID=()=>liveKids().map((k,i)=>[k,p.kids.indexOf(k)]);
/* ---------- Ereignisse nach Lebenslage ---------- */
const SK=[
 // Familie
 {id:'kid_auszug',cat:'Familie',cd:99,w:()=>SKID().some(([k])=>kidAge(k)>=18&&kidAge(k)<=21&&!k.out)?3:0,ev:()=>{const [k,i]=SKID().find(([k])=>kidAge(k)>=18&&kidAge(k)<=21&&!k.out);const c=px$(6000);
   return EC('Familie','Dein Kind will ausziehen',esc(k.n)+' hat einen Studienplatz in einer anderen Stadt bekommen und will ausziehen.',[
    ['Unterstützen ('+eur(c)+' Starthilfe)',()=>{p.money-=c;k.out=1;k.rel=Math.min(100,k.rel+10);skMerk('kidsupport',{i,n:k.n});return esc(k.n)+' fällt dir um den Hals. Der Abschied tut trotzdem weh.'}],
    ['Einen anderen Weg vorschlagen',()=>{k.rel=Math.max(0,k.rel-8);skMerk('kidstopped',{i,n:k.n});return esc(k.n)+' bleibt erst mal, aber die Stimmung ist frostig.'}],
    ['„Mach, was du willst“',()=>{k.out=1;k.rel=Math.max(0,k.rel-3);return esc(k.n)+' zieht aus. Ohne große Worte.'}]])}},
 {id:'kid_pubertaet',cat:'Familie',cd:4,w:()=>SKID().some(([k])=>kidAge(k)>=13&&kidAge(k)<=16)?2:0,ev:()=>{const [k]=SKID().find(([k])=>kidAge(k)>=13&&kidAge(k)<=16);
   return EC('Familie','Türenknallen','„Du verstehst mich einfach nicht!“ '+esc(k.n)+' knallt die Tür und redet seit Tagen kaum noch mit dir.',[
    ['In Ruhe reden',()=>{k.rel=Math.min(100,k.rel+6);add('gl',2);return 'Ihr redet bis spät in die Nacht. Es ging um Liebeskummer.'}],
    ['Hausarrest',()=>{k.rel=Math.max(0,k.rel-6);return 'Zwei Wochen Hausarrest. Danach ist es ruhig, aber kühl.'}],
    ['Abwarten, das ist die Pubertät',()=>{k.rel=Math.max(0,k.rel-2);return 'Nach ein paar Wochen ist es vorbei. Fast.'}]])}},
 {id:'kid_geld',cat:'Familie',cd:6,w:()=>SKID().some(([k])=>kidAge(k)>=22)&&p.money>px$(8000)?1.5:0,ev:()=>{const [k,i]=SKID().find(([k])=>kidAge(k)>=22);const c=px$(5000);
   return EC('Familie','Bitte um Geld',esc(k.n)+' braucht '+eur(c)+' für die Kaution der ersten eigenen Wohnung.',[
    ['Schenken',()=>{p.money-=c;k.rel=Math.min(100,k.rel+8);skMerk('kidgift',{i});return 'Ein langer Anruf voller Dank.'}],
    ['Leihen',()=>{p.money-=c;skMerk('kidloan',{i,c});return 'Du leihst es. „Ich zahl’s zurück, versprochen.“'}],
    ['Ablehnen',()=>{k.rel=Math.max(0,k.rel-6);return esc(k.n)+' ist enttäuscht und fragt die Großeltern.'}]])}},
 // Partnerschaft
 {id:'partner_krise',cat:'Liebe',cd:5,w:()=>p.partner&&p.partner.rel<45?2.5:0,ev:()=>EC('Liebe','Es knirscht',esc(p.partner.name)+' sagt: „Wir sind nur noch Mitbewohner. So will ich nicht weiterleben.“',[
    ['Paartherapie',()=>{p.money-=px$(1200);if(ch(.65)){relUp('partner',18);return 'Es ist anstrengend, aber ihr findet zueinander zurück.'}relUp('partner',4);return 'Die Therapie zeigt: Ihr wollt verschiedene Dinge.'}],
    ['Gemeinsam verreisen',()=>{p.money-=px$(2500);relUp('partner',10);add('gl',4);return 'Zwei Wochen nur ihr zwei. Es fühlt sich wieder an wie früher.'}],
    ['Weitermachen wie bisher',()=>{relUp('partner',-8);return 'Ihr schweigt euch weiter an.'}]])},
 {id:'versuchung',cat:'Liebe',cd:10,w:()=>p.partner&&p.age>=30&&p.age<=55&&p.job?1:0,ev:()=>EC('Liebe','Versuchung','Eine Person aus der Arbeit flirtet seit Wochen mit dir. Heute fragt sie: „Noch ein Glas Wein, nur wir zwei?“',[
    ['Höflich ablehnen',()=>{relUp('partner',2);return 'Du fährst nach Hause. Gut so.'}],['Einen Abend lang vergessen',()=>{add('gl',4);skMerk('affaere');return 'Ein Abend, über den du mit niemandem sprichst.'}],
    [esc(p.partner.name)+' davon erzählen',()=>{relUp('partner',4);return 'Ehrlichkeit tut gut. '+esc(p.partner.name)+' ist dankbar.'}]])},
 // Nachbarschaft
 {id:'nb_kredit',cat:'Nachbarschaft',cd:12,w:()=>p.age>=25&&p.home!=='eltern'&&p.money>px$(15000)?1.5:0,ev:()=>{const n=pick(FN.concat(MN)),c=px$(10000);
   return EC('Nachbarschaft','Ein Traum vom eigenen Laden','Dein Nachbar '+n+' möchte ein kleines Café eröffnen und fragt dich nach einem Kredit über '+eur(c)+'.',[
    ['Geld leihen',()=>{p.money-=c;skMerk('nbloan',{n,c});return n+' umarmt dich. „Das vergesse ich dir nie.“'}],
    ['Mit Rat helfen statt mit Geld',()=>{skMerk('nbrat',{n});return 'Ihr sitzt einen Abend über dem Businessplan.'}],
    ['Ablehnen',()=>'„Verstehe ich“, sagt '+n+'. Etwas enttäuscht klingt es schon.']])}},
 // Stadt
 {id:'city_mall',cat:'Stadt',cd:15,w:()=>(p.props||[]).length||(p.biz&&(p.biz.fronts||[]).length)?1.2:0,ev:()=>EC('Stadt','Ein neues Einkaufszentrum','Gleich bei '+((p.props||[]).length?'deinen Immobilien':'deinem Geschäft')+' soll ein riesiges Einkaufszentrum entstehen.',[
    ['Beim Stadtrat Einspruch einlegen',()=>{if(ch(.4)){addRuf(2);return 'Der Stadtrat stoppt das Projekt. Die Nachbarschaft feiert dich.'}return 'Der Einspruch wird abgelehnt. Gebaut wird trotzdem.'}],
    ['Abwarten',()=>{const up=ch(.55);(p.props||[]).forEach(pr=>pr.val=Math.round(pr.val*(up?1.08:.95)));return up?'Mehr Leute in der Gegend: Deine Immobilien gewinnen an Wert.':'Mehr Verkehr, mehr Lärm: Die Werte sinken etwas.'}],
    ['Einen Laden darin mieten',()=>{p.money-=px$(8000);skMerk('mallshop');return 'Du sicherst dir eine Ladenfläche. Mal sehen, ob es sich lohnt.'}]])},
 // Unternehmen
 {id:'biz_uebernahme',cat:'Unternehmen',cd:8,w:()=>p.biz&&(p.biz.firm||(p.biz.fronts||[]).length>=2)?1.5:0,ev:()=>{const v=px$(Math.round((p.biz.firm&&p.biz.firm.val||200000)*1.3/1000)*1000);
   return EC('Unternehmen','Ein Übernahmeangebot','Ein großer Konkurrent möchte '+esc(p.biz.co||'deine Firma')+' kaufen. Angebot: '+eur(v)+'.',[
    ['Annehmen',()=>{p.money+=v;if(p.biz.firm)p.biz.firm=null;else p.biz.fronts=[];add('gl',6);mile('Firma verkauft','big');return 'Unterschrieben. Du bist reich, aber dein Lebenswerk gehört jetzt anderen.'}],
    ['Nachverhandeln',()=>{if(ch(.45)){const v2=Math.round(v*1.25);p.money+=v2;if(p.biz.firm)p.biz.firm=null;else p.biz.fronts=[];mile('Firma verkauft','big');return 'Sie legen 25 % drauf: '+eur(v2)+'. Deal!'}return 'Der Konkurrent zieht sein Angebot zurück und eröffnet direkt neben dir.'}],
    ['Ablehnen',()=>{skMerk('bizstay');return 'Deine Firma bleibt deine Firma.'}]])}},
 // Vermieter
 {id:'mieter',cat:'Immobilien',cd:4,w:()=>(p.props||[]).some(x=>x.use==='rent')?1.5:0,ev:()=>EC('Immobilien','Mieter in Not','Eine Mieterin hat ihren Job verloren und kann drei Monate keine Miete zahlen.',[
    ['Stunden',()=>{addRuf(3);skMerk('mieterhilfe');return 'Sie bedankt sich mit Tränen in den Augen.'}],['Halbe Miete akzeptieren',()=>{p.money-=px$(1500);addRuf(1);return 'Ein Kompromiss, mit dem beide leben können.'}],
    ['Kündigen',()=>{addRuf(-3);return 'Du bekommst die Wohnung zurück. Und schlechte Bewertungen im Netz.'}]])},
 // Karriere
 {id:'headhunter',cat:'Karriere',cd:12,w:()=>p.job&&p.age>=28&&p.age<=55?.45:0,ev:()=>{const pay=Math.round(p.job.pay*1.3);return EC('Karriere','Anruf vom Headhunter','Die Konkurrenz will dich als '+p.job.t+'. 30 % mehr Gehalt, aber neues Team und Probezeit.',[
    ['Wechseln',()=>{p.job.pay=pay;p.job.perf=45;p.job.yrs=0;add('gl',3);return 'Neuer Schreibtisch, neues Gehalt: '+eur(pay)+' im Jahr.'}],
    ['Gehaltserhöhung beim jetzigen Chef aushandeln',()=>{if(ch(.5)){p.job.pay=Math.round(p.job.pay*1.12);return 'Dein Chef legt 12 % drauf, um dich zu halten.'}return 'Dein Chef zuckt nur mit den Schultern.'}],['Ablehnen',()=>'Du bleibst, wo du bist.']])}},
 // Wendepunkte im mittleren Alter
 {id:'burnout',cat:'Wendepunkt',cd:25,w:()=>p.job&&p.age>=32&&p.age<=58&&p.st.gl<40&&p.st.ge<60?1.2:0,ev:()=>EC('Wendepunkt','Nichts geht mehr','Seit Wochen schläfst du schlecht. Heute Morgen kommst du einfach nicht aus dem Bett. Dein Arzt sagt: Burnout.',[
    ['Krankschreiben lassen und Therapie',()=>{add('ge',8);add('gl',6);if(typeof addLast==='function')addLast(-8);skMerk('burnout_heal');return 'Drei Monate Pause. Langsam kommt die Kraft zurück.'}],
    ['Stunden reduzieren',()=>{p.job.pay=Math.round(p.job.pay*.75);add('gl',8);p.job.part=true;return 'Weniger Geld, mehr Leben. Du fragst dich, warum du das nicht früher gemacht hast.'}],
    ['Zähne zusammenbeißen',()=>{add('ge',-10);add('gl',-6);skMerk('burnout_ignore');return 'Es geht weiter. Irgendwie. Aber nicht gut.'}]])},
 {id:'sinnkrise',cat:'Wendepunkt',cd:99,w:()=>p.age>=38&&p.age<=55&&!histOf('Midlife-Crisis')?1.2:0,ev:()=>EC('Wendepunkt','War das schon alles?','Du stehst morgens vor dem Spiegel und fragst dich: Ist das wirklich das Leben, das ich wollte?',[
    ['Sabbatjahr und Weltreise',()=>{p.money-=px$(15000);add('gl',14);mile('Sabbatjahr um die Welt','big');skMerk('sabbat');return 'Ein Jahr Rucksack, Strände und Sonnenaufgänge. Du kommst als anderer Mensch zurück.'}],
    ['Etwas völlig Neues lernen',()=>{add('in',6);add('gl',6);return 'Du lernst Töpfern, Spanisch und Klavier. Nicht alles gleichzeitig. Fast.'}],
    ['Ehrenamtlich helfen',()=>{addRuf(6);add('gl',8);if(typeof valAdd==='function')valAdd('h',5);return 'Bei der Tafel triffst du Menschen, die dich verändern.'}],
    ['Weitermachen',()=>'Du schiebst den Gedanken weg. Für jetzt.']])},
 {id:'neustart',cat:'Wendepunkt',cd:20,w:()=>!p.job&&p.age>=35&&p.age<=58&&!p.retired?2:0,ev:()=>EC('Wendepunkt','Neuanfang?','Ohne Job fühlt sich jeder Tag gleich an. Bei der Arbeitsagentur liegt ein Flyer: „Umschulung, kostenlos“.',[
    ['Umschulung zur Pflegefachkraft',()=>{p.job={id:'pflege',t:'Pflegefachkraft',pay:px$(36000),part:false,yrs:0,perf:55};add('gl',5);return 'Zwei Jahre später hast du einen Job, der Sinn ergibt.'}],
    ['Selbstständig machen',()=>{skMerk('selbst');add('gl',3);return 'Du gründest ein kleines Handwerksbüro. Die ersten Aufträge kommen über Freunde.'}],
    ['Weiter suchen',()=>'Du schreibst weiter Bewerbungen.']])},
 {id:'herz',cat:'Gesundheit',cd:12,w:()=>p.age>=42&&p.age<=65&&p.st.ge<70?1.3:0,ev:()=>EC('Gesundheit','Ein Warnschuss','Beim Treppensteigen sticht es plötzlich in der Brust. Im Krankenhaus heißt es: Diesmal war es nur eine Warnung.',[
    ['Leben umkrempeln: Sport und Ernährung',()=>{add('ge',12);skMerk('lebensstil');return 'Weniger Fleisch, mehr Spaziergänge. Nach einem Jahr fühlst du dich jünger.'}],
    ['Tabletten nehmen und weiter so',()=>{add('ge',3);return 'Die Tabletten helfen. Ein bisschen.'}]])}
];
/* ---------- Spätfolgen: frühere Entscheidungen kommen zurück ---------- */
const SPAET=[
 {id:'sp_geldbeutel',w:()=>p.age>=24&&p.age<=50&&histOf('Ein Geldbeutel!',/Zurück/,12)?2:0,ev:()=>{const h=histOf('Ein Geldbeutel!',/Zurück/);return EC('Spätfolge','Die Frau von damals','Bei einem Vorstellungsgespräch sitzt dir eine Frau gegenüber und stutzt: „Du hast mir als Kind meinen Geldbeutel zurückgebracht! Ich habe dich nie vergessen.“',[
   ['Lächeln',()=>{add('gl',6);if(p.job)p.job.pay=Math.round(p.job.pay*1.08);else p.money+=px$(3000);return p.job?'Sie sorgt dafür, dass du mehr Gehalt bekommst.':'Sie schenkt dir einen Gutschein über '+eur(px$(3000))+'.'}]],'Mit '+h.a+': Geldbeutel zurückgebracht')}},
 {id:'sp_geldbehalten',w:()=>p.age>=20&&histOf('Ein Geldbeutel!',/behalten/,10)?1:0,ev:()=>{const h=histOf('Ein Geldbeutel!',/behalten/);return EC('Spätfolge','Es nagt an dir','Beim Aufräumen findest du eine alte Quittung aus dem Geldbeutel, den du als Kind behalten hast. Seltsam, dass dich das noch beschäftigt.',[
   ['Spenden, um es gutzumachen',()=>{p.money-=px$(500);addRuf(3);add('gl',4);return 'Es fühlt sich an, als würde ein kleiner Stein von dir fallen.'}],['Vergessen',()=>{add('gl',-2);return 'Ganz vergessen kannst du es nicht.'}]],'Mit '+h.a+': Geld behalten')}},
 {id:'sp_abschreiben',w:()=>p.age>=26&&p.age<=50&&histOf('Abschreiben?',/rüberschieben/,12)?1.5:0,ev:()=>{const h=histOf('Abschreiben?',/rüberschieben/);const n=(kmates()[3]||{}).n||'Jonas';return EC('Spätfolge','Ein alter Bekannter',n+' aus deiner alten Klasse ist heute Personalchef. „Du hast mich damals abschreiben lassen. Ohne dich hätte ich die Arbeit nie bestanden.“',[
   ['Lachen und anstoßen',()=>{if(p.job){p.job.pay=Math.round(p.job.pay*1.1);return n+' empfiehlt dich für eine Gehaltserhöhung.'}p.job={id:'buero',t:'Bürokaufmann/-frau',pay:px$(34000),part:false,yrs:0,perf:55};return n+' besorgt dir einen Job im Büro.'}]],'Mit '+h.a+': Heft rübergeschoben')}},
 {id:'sp_freund',w:()=>p.age>=30&&p.km&&kmates()[1].rel>=60&&!kmates()[1].back&&!p.cs2_fr?1.2:0,ev:()=>{p.cs2_fr=1;const f=kmates()[1];return EC('Spätfolge','Ein Brief aus der Vergangenheit',f.n+', dein bester Freund aus der Grundschule, schreibt dir nach 20 Jahren: „Ich denke oft an unsere Baumhaus-Sommer. Wollen wir uns treffen?“',[
   ['Treffen',()=>{add('gl',8);skMerk('kindfreund',{n:f.n});f.back=1;if(typeof fkReunite==='function')fkReunite(f);return 'Ihr redet stundenlang. Es ist, als wäre keine Zeit vergangen.'}],['Keine Zeit',()=>{add('gl',-2);return 'Du antwortest nie. Später bereust du das.'}]],'Aus deiner Kindheit')}},
 {id:'sp_rivale',w:()=>p.age>=30&&p.rival&&histOf('Der Rivale braucht Hilfe',/Helfen/,5)&&!p.cs2_rv?2:0,ev:()=>{p.cs2_rv=1;return EC('Spätfolge','Eine Hand wäscht die andere',p.rival.n+' meldet sich: „Du hast mir damals geholfen, obwohl wir uns nicht leiden konnten. Jetzt bin ich dran.“',[
   ['Annehmen',()=>{p.money+=px$(12000);p.rival.friend=1;add('gl',8);return p.rival.n+' überweist dir '+eur(px$(12000))+' und lädt dich zum Essen ein. Aus Rivalen werden Freunde.'}]],'Du hast '+p.rival.n+' einmal geholfen')}},
 {id:'sp_nbloan',w:()=>skMem('nbloan',3).length&&!p.cs2_nb?3:0,ev:()=>{p.cs2_nb=1;const m=skMem('nbloan',3)[0].d,ok=ch(.55);
   return ok?EC('Spätfolge','Das Café läuft!',m.n+'s Café ist zum Treffpunkt der Nachbarschaft geworden. '+m.n+' zahlt dir '+eur(Math.round(m.c*1.3))+' zurück, mit Zinsen.',[['Freuen',()=>{p.money+=Math.round(m.c*1.3);add('gl',6);addRuf(3);return 'Und du hast für immer einen Stammplatz mit Gratis-Kaffee.'}]],'Vor ein paar Jahren: Kredit an '+m.n)
     :EC('Spätfolge','Das Café ist pleite',m.n+' steht mit gesenktem Kopf vor deiner Tür. Das Café hat aufgegeben. Dein Geld ist weg.',[['Trösten',()=>{add('gl',-2);addRuf(2);return 'Freundschaft ist mehr wert als Geld. Das sagst du dir zumindest.'}],['Vorwürfe machen',()=>{add('gl',-4);return 'Ihr grüßt euch seitdem nicht mehr.'}]],'Vor ein paar Jahren: Kredit an '+m.n)}},
 {id:'sp_kidsupport',w:()=>skMem('kidsupport',4).length&&!p.cs2_ks?2.5:0,ev:()=>{p.cs2_ks=1;const m=skMem('kidsupport',4)[0].d,k=p.kids[m.i];if(!k)return null;
   return EC('Spätfolge','Abschlussfeier',esc(k.n)+' hat das Studium abgeschlossen und hält eine Rede: „Ohne die Unterstützung meiner Eltern stünde ich heute nicht hier.“',[['Weinen vor Stolz',()=>{k.rel=Math.min(100,k.rel+10);add('gl',10);mile('Abschlussfeier von '+k.n,'star');return 'Einer der schönsten Tage deines Lebens.'}]],'Damals: Starthilfe für '+k.n)}},
 {id:'sp_kidstopped',w:()=>skMem('kidstopped',6).length&&!p.cs2_kst?2:0,ev:()=>{p.cs2_kst=1;const m=skMem('kidstopped',6)[0].d,k=p.kids[m.i];if(!k)return null;
   return EC('Spätfolge','Ein offenes Wort',esc(k.n)+' sagt beim Familienessen: „Weißt du, dass ich dir lange übel genommen habe, dass ich nicht studieren durfte?“',[
    ['Entschuldigen',()=>{k.rel=Math.min(100,k.rel+8);return 'Es fließen ein paar Tränen. Danach ist etwas leichter.'}],['Rechtfertigen',()=>{k.rel=Math.max(0,k.rel-6);return 'Der Abend endet früh.'}]],'Damals: Auszug ausgeredet')}},
 {id:'sp_kidloan',w:()=>skMem('kidloan',3).length&&!p.cs2_kl?2:0,ev:()=>{p.cs2_kl=1;const m=skMem('kidloan',3)[0].d,k=p.kids[m.i];if(!k)return null;const back=ch(.6);
   return EC('Spätfolge','Die Rückzahlung',back?esc(k.n)+' überweist dir das geliehene Geld zurück. Dazu ein Zettel: „Danke, dass du an mich geglaubt hast.“':esc(k.n)+' hat das geliehene Geld nie zurückgezahlt. Beim Geburtstag fällt eine spitze Bemerkung.',
    back?[['Freuen',()=>{p.money+=m.c;k.rel=Math.min(100,k.rel+5);return 'Das Geld ist zurück und das Vertrauen größer.'}]]:[['Darauf verzichten',()=>{k.rel=Math.min(100,k.rel+4);return 'Familie geht vor.'}],['Einfordern',()=>{k.rel=Math.max(0,k.rel-8);if(ch(.5)){p.money+=m.c;return 'Du bekommst das Geld. Die Stimmung ist im Keller.'}return 'Es gibt Streit. Geld siehst du keins.'}]],'Damals: '+eur(m.c)+' geliehen')}},
 {id:'sp_affaere',w:()=>skMem('affaere',2).length&&p.partner&&!p.cs2_af?2.5:0,ev:()=>{p.cs2_af=1;const pn=p.partner.name;return EC('Spätfolge','Eine Nachricht auf deinem Handy',esc(pn)+' hält dir dein Handy hin. Eine alte Nachricht. Von damals.',[
   ['Alles gestehen',()=>{if(ch(.45)){relUp('partner',-15);return 'Es tut furchtbar weh, aber ihr bleibt zusammen.'}p.partner=null;add('gl',-12);return 'Die Koffer stehen am nächsten Morgen vor der Tür.'}],
   ['Abstreiten',()=>{if(ch(.4)&&p.partner){relUp('partner',-6);return 'Die Zweifel bleiben, aber '+esc(pn)+' glaubt dir. Vorerst.'}p.partner=null;add('gl',-15);addRuf(-5);return 'Die Lüge fliegt auf. Das ist das Ende.'}]],'Der Abend damals')}},
 {id:'sp_mieterhilfe',w:()=>skMem('mieterhilfe',3).length&&!p.cs2_mh?1.5:0,ev:()=>{p.cs2_mh=1;return EC('Spätfolge','Post von einer alten Mieterin','Die Mieterin, der du damals die Miete gestundet hast, hat jetzt eine eigene Firma. Sie fragt, ob du ihre Büroräume vermieten willst. Zu Spitzenpreisen.',[['Gern',()=>{p.money+=px$(9000);addRuf(2);return 'Ein Vertrag über fünf Jahre. Gute Taten zahlen sich doch aus.'}]],'Damals: Miete gestundet')}},
 {id:'sp_sabbat',w:()=>skMem('sabbat',3).length&&!p.cs2_sb?1:0,ev:()=>{p.cs2_sb=1;return EC('Spätfolge','Postkarte aus Peru','Eine Postkarte von Luis, den du auf deiner Weltreise kennengelernt hast: „Komm uns besuchen, das Gästezimmer wartet!“',[['Hinfliegen',()=>{p.money-=px$(2500);add('gl',10);return 'Drei Wochen Anden, Lachen und Erinnerungen.'}],['Zurückschreiben',()=>{add('gl',3);return 'Ihr schreibt euch seitdem jedes Jahr.'}]],'Dein Sabbatjahr')}},
 {id:'sp_lebensstil',w:()=>skMem('lebensstil',5).length&&!p.cs2_ls?1:0,ev:()=>{p.cs2_ls=1;return EC('Spätfolge','Fitter als gedacht','Beim Check-up staunt dein Arzt: „Ihre Werte sind besser als vor zehn Jahren.“',[['Stolz sein',()=>{add('ge',8);add('gl',5);return 'Der Warnschuss damals hat sich gelohnt.'}]],'Damals: Leben umgekrempelt')}},
 {id:'sp_burnout',w:()=>skMem('burnout_ignore',3).length&&!p.cs2_bo?1.5:0,ev:()=>{p.cs2_bo=1;return EC('Spätfolge','Der Körper rächt sich','Du hast den Burnout damals ignoriert. Jetzt zwingt dich ein Bandscheibenvorfall in die Pause.',[['Endlich auf dich hören',()=>{add('ge',-6);add('gl',4);if(typeof addLast==='function')addLast(-4);return 'Sechs Wochen Ruhe. Diesmal nimmst du es ernst.'}]],'Damals: Zähne zusammengebissen')}}
];
/* ---------- Auswahl: jedes Jahr die passendsten Ereignisse ---------- */
function schicksalYear(){if(!p||p.age<12||p.prison)return;const c=cfg().ev;const n=c==='aus'?0:c==='selten'?1:c==='oft'?3:2;if(!n)return;
  p.sk2=p.sk2||{};const used=new Set(p.q.map(q=>q.id));
  const C=SPAET.map(s=>({s,w:s.w(),sp:1})).concat(SK.map(s=>({s,w:(p.sk2[s.id]!=null&&p.age-p.sk2[s.id]<s.cd)?0:s.w()}))).filter(x=>x.w>0&&!used.has('sk_'+x.s.id));
  for(let k=0;k<n&&C.length;k++){const tot=C.reduce((a,x)=>a+x.w,0);let r=Math.random()*tot*1.6;if(r>tot&&k>0)break;let i=0;for(;i<C.length;i++){r-=C[i].w;if(r<=0)break}const x=C.splice(Math.min(i,C.length-1),1)[0];if(!x)break;
    p.sk2[x.s.id]=p.age;p.q.push({id:'sk_'+x.s.id})}}
SK.concat(SPAET).forEach(s=>{QEV['sk_'+s.id]=()=>{try{return s.w()>0?s.ev():null}catch(e){return null}}});
{const _py=perkYear;perkYear=function(R0){_py(R0);try{schicksalYear()}catch(e){errLog(e)}}}
/* Lebenslauf: Entscheidungen, die zurückkamen */
function memCard(){const H=(p.ehist||[]).slice(-6).reverse();if(!H.length)return '';
  return card('Deine Entscheidungen',H.map(h=>row(esc(h.t),'Mit '+h.a+': '+esc(h.o),'')).join('')+'<p class="note">Das Leben vergisst nichts. Manches davon kommt Jahre später zurück.</p>')}
{const _rc=rufCard;rufCard=function(){return _rc()+memCard()}}
