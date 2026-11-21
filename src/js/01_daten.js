/* ---------- Daten ---------- */
const FN=['Lena','Mia','Emma','Hannah','Sophie','Lea','Anna','Marie','Lina','Clara'];
const MN=['Jonas','Paul','Leon','Finn','Elias','Noah','Ben','Luca','Felix','Tim'];
const LN=['Krüger','Müller','Schmidt','Wagner','Becker','Hoffmann','Schulz','Koch','Richter','Wolf'];
const STAT={gl:'Glück',ge:'Gesundheit',in:'Intelligenz',au:'Aussehen'};
const RANK={keine:0,Realschule:1,Abitur:2};
const HOMES={
eltern:{n:'Bei den Eltern',c:0,min:0,gl:0},wohnheim:{n:'Studentenwohnheim',c:3000,min:17,gl:1,study:1},
wg:{n:'WG-Zimmer',c:4800,min:18,gl:1},einzimmer:{n:'1-Zimmer-Wohnung',c:7200,min:18,gl:2},
dreizimmer:{n:'3-Zimmer-Wohnung',c:12000,min:18,gl:3},loft:{n:'Loft am Hafen',c:18000,min:18,gl:4},
penthouse:{n:'Penthouse',c:36000,min:18,gl:6},hausboot:{n:'Hausboot',buy:120000,c:1500,min:18,gl:4},
reihenhaus:{n:'Reihenhaus',buy:280000,c:2500,min:18,gl:4},villa:{n:'Stadtvilla',buy:900000,c:8000,min:18,gl:7}};
const JOBS=[
{id:'zeitung',t:'Zeitungszusteller/in',pay:2400,min:13,part:1},{id:'baby',t:'Babysitter/in',pay:1800,min:14,part:1},
{id:'cafe',t:'Café-Aushilfe',pay:4800,min:15,part:1},{id:'kellner',t:'Kellner/in',pay:6000,min:16,part:1},
{id:'kasse',t:'Kassierer/in',pay:24000,min:16,edu:1},{id:'lager',t:'Lagerarbeiter/in',pay:27000,min:18},
{id:'paket',t:'Paketbote/-botin',pay:29000,min:18},{id:'bus',t:'Busfahrer/in',pay:34000,min:21,edu:1},
{id:'friseur',t:'Friseur/in',pay:28000,min:18,aus:1},{id:'koch',t:'Koch/Köchin',pay:32000,min:18,aus:1},
{id:'buero',t:'Bürokaufmann/-frau',pay:36000,min:18,aus:1},{id:'mecha',t:'Mechatroniker/in',pay:38000,min:18,aus:1},
{id:'pflege',t:'Pflegefachkraft',pay:39000,min:18,aus:1},{id:'bankkfm',t:'Bankkaufmann/-frau',pay:44000,min:18,aus:1,edu:2},
{id:'polizei',t:'Polizist/in',pay:45000,min:18,edu:2,ge:60},{id:'pilot',t:'Pilot/in',pay:85000,min:21,edu:2,in:70},
{id:'lehrer',t:'Lehrer/in',pay:55000,min:22,deg:'Lehramt'},{id:'architekt',t:'Architekt/in',pay:62000,min:22,deg:'Architektur'},
{id:'info',t:'Informatiker/in',pay:65000,min:22,deg:'Informatik'},{id:'jura',t:'Anwalt/Anwältin',pay:80000,min:23,deg:'Jura'},
{id:'arzt',t:'Ärztin/Arzt',pay:90000,min:24,deg:'Medizin'},{id:'influ',t:'Influencer/in',pay:0,min:16,fol:10000},
{id:'profi',t:'Profisportler/in',pay:120000,min:18,max:35,ge:90}];
const STUDY={Informatik:4,Lehramt:5,Architektur:5,Jura:5,Medizin:6};
const STOCKS=[
{id:'nw',n:'NordWind Energie',p:42,v:.25,d:.06,div:.01,c:'#2B9ED8',b:'Baut Windparks vor der Küste.'},
{id:'px',n:'Pixelhaus Games',p:18,v:.4,d:.08,div:0,c:'#C2408C',b:'Spielestudio. Ein Hit oder ein Flop entscheidet alles.'},
{id:'hb',n:'Hansebank',p:65,v:.15,d:.04,div:.03,c:'#1E9E6A',b:'Solide Bank, zahlt jedes Jahr Dividende.'},
{id:'bz',n:'Brotzeit AG',p:30,v:.1,d:.03,div:.03,c:'#E0A030',b:'Bäckereikette. Langweilig, aber stabil.'},
{id:'rl',n:'RoboLogistik',p:12,v:.5,d:.1,div:0,c:'#7768AE',b:'Lagerroboter-Start-up. Sehr riskant.'},
{id:'ok',n:'Ökofarm',p:24,v:.2,d:.05,div:.01,c:'#3BB273',b:'Bio-Landwirtschaft im großen Stil.'}];
const STK=Object.fromEntries(STOCKS.map(x=>[x.id,x]));
let stockSel=null,stockRange=10;
function stepPrice(s,o){let n=o*(1+s.d+s.v*(Math.random()*2-1)*1.2)*worldF();if(Math.random()<.05)n*=.5;return Math.max(1,Math.round(n*100)/100)}
function ensureStocks(){if(!p.hist){p.hist={};STOCKS.forEach(s=>p.hist[s.id]=[p.px[s.id]])}if(!p.cost)p.cost={};if(!p.mnews)p.mnews=[]}
const SHOP=[{id:'handy',n:'Smartphone',pr:600,e:{gl:4},min:10},{id:'konsole',n:'Spielkonsole',pr:500,e:{gl:6},min:8},{id:'laptop',n:'Laptop',pr:1200,e:{in:3,gl:2},min:12},
{id:'kleid',n:'Designerkleidung',pr:900,e:{au:5},min:14},{id:'sofa',n:'Designersofa',pr:2500,e:{gl:5},min:18},{id:'uhr',n:'Luxusuhr',pr:15000,e:{gl:6,au:3},min:18},{id:'kamera',n:'Kamera',pr:1500,e:{gl:2},min:13},{id:'setup',n:'Streaming-Setup',pr:2500,e:{gl:2},min:16}];
const PETS={hund:{n:'Hund',pr:300,c:900,life:13,names:['Bello','Luna','Rocky','Kira']},katze:{n:'Katze',pr:150,c:600,life:16,names:['Minka','Felix','Mia','Tiger']},hamster:{n:'Hamster',pr:30,c:100,life:3,names:['Krümel','Flocke','Nugget']}};
const CARS={gebraucht:{n:'Gebrauchtwagen',pr:6000,c:2000,sp:0},kombi:{n:'Neuer Kombi',pr:28000,c:3000,sp:.05},sport:{n:'Sportwagen',pr:90000,c:6000,sp:.2}};
const ACH={job:'Erster Job',abi:'Abitur',studium:'Akademiker/in',heirat:'Ja, ich will',kind:'Elternglück',befoerd:'Beförderung',reich:'100.000 €',mio:'Millionär/in',
haus:'Eigenheim',tier:'Tierfreund/in',aktien:'Börsenprofi',renner:'Straßenkönig/in',knast:'Hinter Gittern',jackpot:'Jackpot',achtzig:'80 Jahre',micro:'10.000 Follower',unternehmer:'Unternehmer/in',ipo:'Börsengang',bankier:'Eigene Bank',casino:'Casino-Jackpot',star:'1 Mio. Follower',viral:'Viral gegangen',hundert:'100 Jahre'};
/* Orte der Stadt: Farbe, Höhe, Aktionen */
const PLACES=[
{id:'home',n:'Zuhause',c:0xF6C98F,h:4,a:['lesen','medi','pet','kidstime']},
{id:'schule',n:'Schule',c:0x8FB0F0,h:5,a:['lernen']},{id:'uni',n:'Universität',c:0x6F8FE0,h:9,a:['study']},
{id:'bschule',n:'Berufsschule',c:0xA7B9E8,h:5,a:['azubi']},{id:'jobcenter',n:'Jobcenter',c:0xB9A7E8,h:6,a:['jobs']},
{id:'buero',n:'Büropark',c:0x9C8CD8,h:17,a:['work']},{id:'klinik',n:'Klinikum',c:0xF2A7A0,h:10,a:['arzt','op']},
{id:'fitness',n:'Fitnessstudio',c:0x8FD6A0,h:4,a:['sport']},{id:'park',n:'Stadtpark',c:0x6FBF73,h:2,a:['jog','date']},
{id:'club',n:'Club Nachtfalter',c:0xC79BEA,h:5,a:['party','date']},{id:'bank',n:'Hansebank',c:0xF2D27A,h:12,a:['bankui','bankraub']},
{id:'boerse',n:'Börse',c:0xE8C35A,h:15,a:['stocksui']},{id:'mall',n:'Einkaufszentrum',c:0xF0A3C8,h:6,a:['shop','klau']},
{id:'tierheim',n:'Tierheim',c:0xC6E39A,h:3,a:['adopt']},{id:'autohaus',n:'Autohaus',c:0x9AD3E3,h:4,a:['cars']},
{id:'hafen',n:'Hafen',c:0x7FA6B8,h:3,a:['race']},{id:'makler',n:'Immobilienbüro',c:0xE3B48A,h:7,a:['homesui','bizui']},
{id:'reise',n:'Reisebüro',c:0x7FD1C9,h:4,a:['urlaub']},{id:'kiosk',n:'Kiosk',c:0xF4B678,h:2.5,a:['lotto','tasche']},
{id:'villa',n:'Villenviertel',c:0xEDE3D0,h:5,a:['einbruch']},{id:'netcafe',n:'Internetcafé',c:0x90A4C8,h:4,a:['hack']},
{id:'polizei',n:'Polizei & Gericht',c:0xA9B6CC,h:8,a:['record']},{id:'casino',n:'Casino Goldküste',c:0xD4AF37,h:9,a:['casinoui']},{id:'jva',n:'Gefängnis',c:0x8A8F99,h:6,a:[]}];
const PL=Object.fromEntries(PLACES.map(x=>[x.id,x]));
const hex=c=>'#'+c.toString(16).padStart(6,'0');

let p=null,tab='home',form={g:'w',a:13,sb:false},cityMode='3d',sel=null,shell=false;
let globalAch={};try{globalAch=JSON.parse(localStorage.getItem(AKEY)||'{}')}catch(e){}

function add(k,n){p.st[k]=clamp(p.st[k]+n,0,100)}
function log(t){p.log.push({a:p.age,t});if(p.log.length>300)p.log.shift()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.display='none',2600)}
function ach(k){if(p.ach[k])return;p.ach[k]=1;if(MILE_ACH.includes(k))mile(ACH[k],'ach');sfx('win');vib(50);globalAch[k]=1;try{localStorage.setItem(AKEY,JSON.stringify(globalAch))}catch(e){}log('Erfolg freigeschaltet: '+ACH[k]+'!');toast('Erfolg: '+ACH[k])}
function inSchool(){return !!(p.school||p.study||p.azubi)}
function stockVal(){return STOCKS.reduce((s,x)=>s+(p.sh[x.id]||0)*p.px[x.id],0)}
function checkAch(){checkGoals();checkUnlocks();if(p.money>=100000)ach('reich');if(netWorth()>=1e6)ach('mio');if(stockVal()>=10000)ach('aktien');if(p.age>=80)ach('achtzig');if(p.age>=100)ach('hundert')}
const CITYA=['Neu','Alt','Ober','Nieder','Nord','Süd','West','Ost','Groß','Klein'],CITYB=['hafen','burg','stadt','felde','dorf','brück','heim','au','berg','wald'];
function cityName(seed){const r=rng(seed+7);return CITYA[Math.floor(r()*CITYA.length)]+CITYB[Math.floor(r()*CITYB.length)]}

