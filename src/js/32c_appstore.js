/* ================= App Store, Altersfreigaben und Speicherplatz ================= */
// Grund-Apps: immer installiert, erscheinen ab einem Alter
const APPMIN={post:16,leben:0,familie:0,bildung:0,freizeit:0,kalender:0,erfolge:0,einst:0,chats:4,stadt:6,store:8,shop:8,liebe:13,jobs:13,bank:16};
// Store-Apps: [Kurzbeschreibung, ab Alter, Größe, Bewertung, Funktionen]
const OPT={
 klick:['Social Media: Posts, Livestreams, Follower und Sponsoren.',13,'48 MB',4.6,['Eigenes Profil mit Posts','Kanal mit Livestreams und Videos','Sponsoren, Merch und Influencer-Karriere']],
 news:['Weltlage, Lokales, Börse und Klatsch, auch über dich.',8,'12 MB',4.2,['Boom, Rezession und Krisen live','Lokale Nachrichten aus deiner Stadt','Promi-Meldungen']],
 boerse:['Aktien kaufen, Kurse verfolgen, Dividenden kassieren.',16,'31 MB',4.4,['Aktien und Kursverläufe','Depot und Dividenden','Mit Pro: Kursalarme']],
 geschaefte:['Gründe Firmen, kauf Läden, eröffne Filialen und einen Onlineshop.',18,'64 MB',4.5,['Unternehmen und Holding','Filialen, Franchise, eigene Produkte','Eigene Bank']],
 casino:['Spielautomaten, Roulette und Blackjack.',18,'90 MB',3.9,['Drei Spiele','Gewinne und Verluste im Jahresrückblick','Nur ab 18']],
 wege:['Sport, Musik, Politik oder Untergrund: besondere Karrieren.',6,'38 MB',4.7,['Vom Jugendverein zum Nationalteam','Band, Album und Tour','Wahlkampf bis zum Ministeramt']],
 wohnen:['Wohnung suchen, Haus kaufen, einrichten und Immobilien vermieten.',16,'55 MB',4.6,['Mieten und kaufen','Einrichtung und Personal','Immobilien als Investment']],
 garage:['Autos kaufen, pflegen und Rennen fahren.',16,'27 MB',4.3,['Autos und Werkstatt','Straßenrennen','Fahrer für mehr Aktionen']],
 strasse:['Kleine Gaunereien bis zu großen Coups. Auf eigenes Risiko.',14,'19 MB',3.6,['Schnelles Geld','Fahndung und Gefängnis','Schwarzgeld']]};
const APPREQ={garage:()=>p.fs||p.cars.length?null:'Führerschein nötig'};
const STORE_CAP=[2,4,7,9],PRO_PRICE=4.99;
let dlId=null,storeSel=null;
const appInst=id=>!OPT[id]||!!(p.apps&&p.apps[id]);
const appCount=()=>Object.keys(OPT).filter(k=>p.apps&&p.apps[k]).length;
const appCap=()=>STORE_CAP[phoneTier()];
function appVisible(id){if(id==='jva')return jvaUse();if(OPT[id])return appInst(id)&&p.age>=OPT[id][1]-0;return p.age>=(APPMIN[id]||0)}
function ensureApps(){if(p.apps)return;p.apps={};p.appSeen={};
  const B=p.biz||{},used={klick:!!p.sm,news:(p.news||[]).length>0,boerse:p.sh&&Object.keys(p.sh).some(k=>p.sh[k]>0),geschaefte:!!B.co,casino:!!(p.casino&&(p.casino.won||p.casino.lost)),
   wege:!!(p.spo||p.mus||p.pol||p.gang),wohnen:(p.props||[]).length>0||(p.owned||[]).length>0||(p.home&&p.home!=='eltern'),garage:(p.cars||[]).length>0,strasse:(p.crimes||0)>0};
  Object.keys(used).forEach(k=>{if(used[k])p.apps[k]=1});
  APPS.forEach(a=>{if(appVisible(a[0]))p.appSeen[a[0]]=1})}
function appLock(id){const O2=OPT[id];if(!O2)return null;if(p.age<O2[1])return 'Ab '+O2[1]+' Jahren';const r=APPREQ[id]&&APPREQ[id]();return r||null}
function recs(){const R=[];const add=(k,why)=>{if(OPT[k]&&!appInst(k)&&!appLock(k)&&!R.some(x=>x[0]===k))R.push([k,why])};
  if(p.age>=13&&p.age<=30)add('klick','Deine Freunde sind alle auf Klick.');if(p.age>=18&&p.home==='eltern')add('wohnen','Zeit für die erste eigene Wohnung?');
  if(p.money>=20000)add('boerse','Lass dein Geld für dich arbeiten.');if(p.age>=18&&p.money>=40000)add('geschaefte','Genug Kapital für ein eigenes Geschäft.');
  if(p.sk.form>=50||p.age<16)add('wege','Du hast Talent. Mach eine Karriere draus.');if((p.crimes||0)>0||p.wanted)add('strasse','Du kennst dich ja schon aus …');
  if(p.fs||p.cars.length)add('garage','Du hast den Führerschein. Jetzt fehlt ein Auto.');add('news','Bleib informiert, was in der Welt passiert.');return R.slice(0,3)}
function appYear(R0){ensureApps();
  APPS.forEach(a=>{const id=a[0];if(!OPT[id]&&appVisible(id)&&p.appSeen[id]==null){p.appSeen[id]=0;log('Neue App auf deinem Handy: '+a[1]+'.')}});
  if(p.pro&&p.pro.boerse&&p.hist&&p.sh)STOCKS.forEach(s=>{if(!(p.sh[s.id]>0))return;const h=p.hist[s.id];if(!h||h.length<2)return;const c=h[h.length-1]/h[h.length-2]-1;
    if(Math.abs(c)>=.1){const t='Kursalarm: '+s.n+' '+(c>0?'+':'')+Math.round(c*100)+' %';news(t,'boerse');log(t+'.')}})}
const appIc=(id,sz)=>{const A=APP[id];return '<span class="ic'+(sz?' '+sz:'')+'" style="background:'+(A[4]||hex(A[2]))+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+A[3]+'</svg></span>'};
function appBtn(id){if(dlId===id)return '<button class="btn sm o dl" disabled><span>Wird geladen …</span></button>';
  if(appInst(id))return btn('goto',id,'Öffnen','o');const l=appLock(id);if(l)return '<span class="chip lockc">'+esc(l)+'</span>';
  return btn('appget',id,'Laden','o',appCount()>=appCap())}
function viewStore(){ensureApps();const cap=appCap(),n=appCount();
  let h='<section class="card stcap"><div class="listseg"><div><b>Speicher</b><small>'+PHONES[phoneTier()][0]+'</small></div><span class="chip">'+n+' von '+cap+' Apps</span></div><div class="bar"><i style="width:'+Math.min(100,n/cap*100)+'%;background:'+(n>=cap?'#D64545':'#0E9F7E')+'"></i></div>'+
    (n>=cap?'<p class="note">Der Speicher ist voll. Lösch eine App oder hol dir ein besseres Handy.</p>'+(phoneTier()<3?btn('goto','shop','Zum Shop','o'):''):'<p class="note">Grund-Apps belegen keinen Speicher. Bessere Handys haben mehr Platz.</p>')+'</section>';
  const R=recs();if(R.length)h+='<h3 class="sec">Für dich empfohlen</h3><div class="recs">'+R.map(([k,why])=>'<div class="rec">'+appIc(k)+'<b>'+APP[k][1]+'</b><small>'+esc(why)+'</small>'+appBtn(k)+'</div>').join('')+'</div>';
  h+='<h3 class="sec">Alle Apps</h3>'+Object.keys(OPT).map(k=>{const O2=OPT[k];return '<section class="card stapp'+(storeSel===k?' open':'')+'"><button class="sthead" data-a="appsel" data-g="'+k+'">'+appIc(k)+'<span class="stt"><b>'+APP[k][1]+'</b><small>'+esc(O2[0])+'</small><span class="stmeta">'+starHtml(O2[3])+' · '+O2[2]+(O2[1]?' · ab '+O2[1]:'')+'</span></span></button>'+
    (storeSel===k?'<ul class="ul2">'+O2[4].map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+(k==='boerse'&&appInst(k)?row('Börse Pro','Kursalarme bei großen Bewegungen deiner Aktien',p.pro&&p.pro.boerse?'<span class="chip">Gekauft</span>':btn('apppro','boerse',eur2(PRO_PRICE),'',p.money<PRO_PRICE)):'')+(k==='garage'&&!p.fs?row('Fahrschule','ab 17 · '+eur(px$(2500))+' · 1 Aktion',btn('fahrschule',null,'Prüfung machen','o',p.age<17||p.act<=0||p.money<px$(2500)||!!p.prison)):''):'')+
    '<div class="stb">'+appBtn(k)+(appInst(k)?btn('apprm',k,'Löschen','g'):'')+'</div></section>'}).join('');
  h+='<p class="note" style="text-align:center">Gelöschte Apps behalten ihre Daten. Du kannst sie jederzeit neu laden.</p>';
  return h}
function appGate(id){const O2=OPT[id];const l=appLock(id);
  return '<section class="card gate">'+appIc(id,'big')+'<h2 class="h">'+APP[id][1]+'</h2>'+(O2?starHtml(O2[3])+'<p class="note">'+esc(O2[0])+'</p><ul class="ul2">'+O2[4].map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><div class="stb">'+appBtn(id)+'</div>'+
    (!l&&appCount()>=appCap()?'<p class="note">Kein Platz mehr. Lösch eine App im App Store.</p>':''):'<p class="note">Diese App gibt es ab '+(APPMIN[id]||0)+' Jahren.</p>')+'</section>'}
function act9(id,arg){switch(id){
  case 'appsel':storeSel=storeSel===arg?null:arg;render();return 1;
  case 'appget':{ensureApps();if(!OPT[arg]||appInst(arg)||appLock(arg)||dlId)return 1;if(appCount()>=appCap()){toast('Speicher voll. Lösch eine App oder hol dir ein besseres Handy.');return 1}
    dlId=arg;render();setTimeout(()=>{if(!p)return;p.apps[arg]=1;p.appSeen[arg]=0;dlId=null;sfx('coin');toast(APP[arg][1]+' ist installiert und auf deinem Handy.');save();render()},1300);return 1}
  case 'apprm':{if(!OPT[arg]||!appInst(arg))return 1;delete p.apps[arg];if(tab===arg)tab='home';done(APP[arg][1]+' gelöscht. Die Daten bleiben erhalten.');return 1}
  case 'apppro':{if(p.money<PRO_PRICE)return 1;p.money-=PRO_PRICE;p.pro=p.pro||{};p.pro[arg]=1;done('Börse Pro freigeschaltet: Ab jetzt meldet sich die App bei großen Kursbewegungen.');return 1}
  case 'fahrschule':{const c=px$(2500);if(p.fs||p.age<17||p.money<c||p.prison||!useAct())return 1;p.money-=c;if(ch(.6+(p.sk.fahren||0)/200)){p.fs=true;add('gl',8);mile('Führerschein','star');done('Bestanden! Du hast den Führerschein.')}else{add('gl',-4);done('Durchgefallen. Beim nächsten Mal klappt es.')}return 1}
  }return 0}
TUT.splice(TUT.length-1,0,['Der App Store','Viele Apps lädst du dir erst, wenn du sie brauchst: Klick, Börse, Geschäfte, Casino und mehr. Manche gibt es erst ab einem bestimmten Alter. Bessere Handys haben mehr Speicher.','<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 15l3-7 3 7M10 13h4"/>']);
APPTIP.store='Hier lädst du zusätzliche Apps. Grund-Apps belegen keinen Speicher, Store-Apps schon. Gelöschte Apps behalten ihre Daten.';
