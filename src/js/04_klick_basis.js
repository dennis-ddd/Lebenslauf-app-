/* ---------- Social Media (Klick) ---------- */
const LV=[[0,'Neuling'],[1000,'Aufsteiger/in'],[10000,'Micro-Influencer/in'],[100000,'Influencer/in'],[1e6,'Star'],[1e7,'Megastar']];
const lvIdx=f=>{let i=0;LV.forEach((l,k)=>{if(f>=l[0])i=k});return i};
const POSTT={
selfie:{n:'Selfie',st:'au',tag:'#selfie',ic:'<circle cx="12" cy="9" r="4"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6"/>',cap:['Guten Morgen, Welt','Neuer Haarschnitt. Wie findet ihr ihn?','Einfach mal lächeln','Sonntagslaune']},
food:{n:'Essen',st:'gl',tag:'#lecker',ic:'<circle cx="12" cy="13" r="7"/><path d="M5 13h14M9 4v4M12 3v5M15 4v4"/>',cap:['Heute selbst gekocht','Bestes Frühstück der Stadt','Pizza-Freitag!','Omas Rezept, mein Versuch']},
reise:{n:'Reise',st:'gl',tag:'#fernweh',cost:300,ic:'<path d="M3 18h18M6 18l4-9 3 5 2-3 3 7"/><circle cx="17" cy="6" r="2"/>',cap:['Strand statt Alltag','Hier könnte ich für immer bleiben','Sonnenuntergang deluxe','Koffer gepackt, Kopf frei']},
workout:{n:'Workout',st:'ge',tag:'#fitness',ic:'<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>',cap:['Kein Tag ohne Training','Beine-Tag überlebt','Neuer Rekord!','5 Uhr morgens, ab ins Gym']},
meme:{n:'Meme',st:'in',tag:'#meme',ic:'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',cap:['Ich, wenn der Wecker klingelt','Montag. Schon wieder.','Hausaufgaben um 23:59','Wenn das WLAN weg ist']},
haustier:{n:'Haustier',st:'gl',tag:'#tierliebe',need:()=>p.pets.length>0,ic:'<circle cx="12" cy="13" r="6"/><path d="M7 9L6 4l4 3M17 9l1-5-4 3"/>',cap:['Darf ich vorstellen: {pet}','{pet} hat heute die Couch erobert','Mein ganzer Stolz: {pet}']},
paar:{n:'Pärchen',st:'au',tag:'#couplegoals',need:()=>!!p.partner,ic:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',cap:['Mit {partner} unterwegs','Mein Lieblingsmensch: {partner}','Jahrestag mit {partner}']}};
const TRENDS=['selfie','food','reise','workout','meme','haustier','paar'];
const VIDT={
gaming:{n:'Gaming',st:'in',c:'#6C5CE7',need:()=>p.items.includes('konsole')||p.items.includes('laptop'),needN:'Spielkonsole oder Laptop',t:['Ich spiele 10 Stunden am Stück','Der schwerste Level aller Zeiten','Neues Spiel: Ersteindruck']},
vlog:{n:'Vlog',st:'gl',c:'#F08A24',t:['Ein Tag in meinem Leben','Ich ziehe um!','Mein ehrliches Jahresfazit']},
comedy:{n:'Comedy',st:'gl',c:'#E5527A',t:['Typen von Leuten im Bus','Wenn Eltern Technik erklären','Ich versuche, ernst zu bleiben']},
tutorial:{n:'Tutorial',st:'in',c:'#2B59C3',t:['Lernen wie ein Profi: 5 Tricks','So sparst du Geld als Schüler','Kochen für Anfänger']},
style:{n:'Beauty & Style',st:'au',c:'#C2408C',t:['Mein Outfit der Woche','Schnelle Frisur in 5 Minuten','Haul: Was ich gekauft habe']},
fit:{n:'Fitness',st:'ge',c:'#2FA88F',t:['20 Minuten Workout für zuhause','Was ich an einem Tag esse','30-Tage-Challenge: Ergebnis']}};
const FANS=['@sonnenkind','@pixelpaul','@lisa.liebt','@max_macht','@kaffeekatze','@nordlicht','@die.jule','@tom.on.tour','@mila.mag','@ben_bastelt'];
const COMS=['Wie schön!','Mega!!','Will ich auch','Bester Account','Wo ist das?','Haha, zu gut','So inspirierend','Folge dir seit Tag 1','Krass','Mehr davon!','Du machst mir echt gute Laune','Wann kommt das nächste Video?'];
const BRANDS=[['FitFuel','Proteinriegel'],['Glanz Kosmetik','Gesichtscreme'],['Brausebude','Limonade'],['Pixelhaus Games','ihr neues Spiel'],['NordWind Energie','Ökostrom'],['Ökofarm','Müsli'],['Hansebank','ein Girokonto'],['TurboNet','einen Handytarif'],['Schuhwerk','Sneaker']];
let smTab='profil',chatSel=null;
const kfmt=n=>{n=Math.round(n);return n>=1e6?(n/1e6).toFixed(n>=1e7?0:1).replace('.',',')+' Mio.':n>=10000?Math.round(n/1000)+' Tsd.':n.toLocaleString('de-DE')};
function smGain(f){const o=lvIdx(p.sm.fol);p.sm.fol=Math.max(0,Math.round(p.sm.fol+f));const n=lvIdx(p.sm.fol);
  if(n>o){log('Klick: Du bist jetzt '+LV[n][1]+'!');toast('Neues Level: '+LV[n][1]);msg('freund','Du bist jetzt '+LV[n][1]+'?! Ich kenn dich noch von früher, haha.')}
  if(p.sm.fol>=10000)ach('micro');if(p.sm.fol>=1e6)ach('star')}
const fillT=t=>t.replace('{pet}',p.pets[0]?p.pets[0].n:'').replace('{partner}',p.partner?p.partner.name:'');
function postArt(po){const u='a'+po.id,ty=po.ty;
  if(ty==='meme')return '<div class="art meme"><span>'+esc(po.cap.split(' #')[0])+'</span></div>';
  const g=(c1,c2)=>'<defs><linearGradient id="'+u+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient></defs><rect width="100" height="100" fill="url(#'+u+')"/>';
  const heart='M50 78 C20 60 22 34 38 34 C45 34 50 40 50 44 C50 40 55 34 62 34 C78 34 80 60 50 78Z';
  const S={selfie:()=>g('#FFB199','#E5527A')+'<g transform="translate(14 14) scale(.86)">'+avatarSvg(po.a,100)+'</g>',
  food:()=>g('#FFE7C2','#FFC27A')+'<circle cx="50" cy="54" r="32" fill="#fff"/><circle cx="50" cy="54" r="25" fill="#F6F1E9"/><circle cx="42" cy="48" r="8" fill="#E4572E"/><circle cx="58" cy="58" r="7" fill="#F2C14E"/><ellipse cx="56" cy="44" rx="7" ry="3.5" fill="#3BB273" transform="rotate(-30 56 44)"/><ellipse cx="43" cy="62" rx="6" ry="3" fill="#3BB273" transform="rotate(20 43 62)"/>',
  reise:()=>g('#FFB86B','#E5527A')+'<circle cx="68" cy="40" r="13" fill="#FFE39A"/><rect y="62" width="100" height="38" fill="#2B7BC3"/><path d="M0 68 Q12 64 25 68 T50 68 T75 68 T100 68" fill="none" stroke="#9FD0F5" stroke-width="2"/><path d="M24 100 Q26 74 30 58" stroke="#6B4A2B" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M30 58 q-12 -4 -18 4 M30 58 q-4 -12 -14 -12 M30 58 q8 -10 18 -6 M30 58 q12 0 16 10" stroke="#2F8F4E" stroke-width="4" fill="none" stroke-linecap="round"/>',
  workout:()=>g('#5B9BE6','#2FA88F')+'<g transform="rotate(-20 50 50)"><rect x="22" y="47" width="56" height="6" rx="3" fill="#2A2F3A"/><rect x="14" y="34" width="10" height="32" rx="4" fill="#1B1F2A"/><rect x="76" y="34" width="10" height="32" rx="4" fill="#1B1F2A"/><rect x="8" y="39" width="7" height="22" rx="3" fill="#3A3F4B"/><rect x="85" y="39" width="7" height="22" rx="3" fill="#3A3F4B"/></g>',
  haustier:()=>g('#C6E39A','#7FD1C9')+'<path d="M30 40 L28 18 L44 32 Z M70 40 L72 18 L56 32 Z" fill="#B07A4A"/><circle cx="50" cy="55" r="27" fill="#C98E5A"/><ellipse cx="50" cy="66" rx="13" ry="9" fill="#EBD3B5"/><circle cx="40" cy="50" r="3.5" fill="#1B1F2A"/><circle cx="60" cy="50" r="3.5" fill="#1B1F2A"/><ellipse cx="50" cy="61" rx="4" ry="3" fill="#1B1F2A"/>',
  paar:()=>g('#FFB3C7','#C79BEA')+'<path d="'+heart+'" fill="#E5527A" transform="translate(-14 4)"/><path d="'+heart+'" fill="#fff" opacity=".92" transform="translate(30 10) scale(.7)"/>',
  outfit:()=>g('#D9C6F5','#8E63D6')+'<path d="M36 22 L50 28 L64 22 L80 34 L72 46 L66 42 L66 84 L34 84 L34 42 L28 46 L20 34 Z" fill="#fff"/><path d="M44 25 Q50 34 56 25" fill="none" stroke="#8E63D6" stroke-width="3"/><circle cx="50" cy="52" r="5" fill="#E5407A"/>',
  luxus:()=>g('#2A2F3A','#5A4A1E')+'<path d="M50 18 L58 40 L82 44 L64 58 L70 82 L50 70 L30 82 L36 58 L18 44 L42 40 Z" fill="#E7C14B"/><circle cx="76" cy="22" r="3" fill="#fff"/><circle cx="22" cy="74" r="2" fill="#fff"/>',
  party:()=>g('#3A1458','#C2337A')+'<circle cx="22" cy="24" r="4" fill="#FFD23F"/><circle cx="78" cy="30" r="3" fill="#4DD8E6"/><circle cx="64" cy="14" r="2.5" fill="#fff"/><path d="M40 86 L46 52 L34 40 L66 40 L54 52 L60 86 Z" fill="#fff" opacity=".9"/><path d="M38 44 L62 44 L54 52 L46 52 Z" fill="#E5407A"/>'};
  return '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" class="art" aria-hidden="true">'+S[ty]()+'</svg>';
}
const HEART='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="#E5527A"/></svg>';
function postCard(po,inDlg){return '<article class="post'+(inDlg?' dlgpost':'')+'"><header><span class="pav">'+avatarSvg(po.a,36)+'</span><span><b>'+esc(p.sm.h)+'</b><small>Alter '+po.a+(po.viral?' · viral':'')+'</small></span></header>'+postArt(po)+
  '<div class="pbody"><div class="likes">'+HEART+'<b>'+kfmt(po.likes)+'</b> Likes · '+(po.nf>=0?'+':'')+kfmt(po.nf)+' Follower</div><p><b>'+esc(p.sm.h)+'</b> '+esc(po.cap)+'</p>'+po.com.map(c=>'<p class="com"><b>'+esc(c[0])+'</b> '+esc(c[1])+'</p>').join('')+'</div></article>'}
function vidRow(v){const V=VIDT[v.g];return '<div class="vrow"><div class="thumb" style="background:'+V.c+'"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M9 7l8 5-8 5z" fill="#fff"/></svg><span>'+V.n+'</span></div><div><b>'+esc(v.t)+'</b><small>'+kfmt(v.views)+' Aufrufe · +'+kfmt(v.ns)+' Abos · Alter '+v.a+(v.viral?' · viral':'')+'</small></div></div>'}

function ensureNew(){
  if(p.skin==null){p.skin=R(0,4);p.hair=R(0,5);p.beard=ch(.5);p.bald=ch(.4);p.glasses=ch(.5)}
  if(!p.friend)p.friend=pick(FN.concat(MN));if(!p.pa)p.pa=R(24,36);if(!p.chats)p.chats={};if(!p.yr)p.yr={social:0,casino:0};ensureBiz();ensureEcon();
  if(p.m0==null)p.m0=p.money;if(!p.trend)p.trend=pick(TRENDS.slice(0,5));if(!p.seenJobs)p.seenJobs=[];if(p.sm===undefined)p.sm=null;ensureLife();
}
function newJobs(){return JOBS.filter(j=>!canJob(j)&&!p.seenJobs.includes(j.id)).length}

