/* ================= Freundeskreis mit Tiefe und Haustiere mit Charakter ================= */
/* ---------- Freundeskreis ---------- */
const FTR={treu:['Treu','geht mit dir durch dick und dünn'],lustig:['Lustig','bringt dich immer zum Lachen'],chaot:['Chaotisch','kommt immer zu spät, aber mit den besten Geschichten'],
  klug:['Klug','hat für jedes Problem einen Rat'],sport:['Sportlich','zieht dich zu jedem Lauf mit'],kreativ:['Kreativ','malt, schreibt und hat ständig neue Ideen']};
const FMEET={treu:['Ihr redet stundenlang beim Spaziergang.','Ein Abend auf dem Balkon, wie früher.'],lustig:['Ihr lacht so sehr im Kino, dass ihr rausfliegt.','Karaoke-Abend. Niemand trifft einen Ton.'],
  chaot:['Ihr verpasst den Zug und landet in einer anderen Stadt. Großartiger Tag.','Ein spontaner Roadtrip ohne Plan.'],klug:['Ein langer Abend über das Leben und alles.','Ihr löst gemeinsam ein Kreuzworträtsel. Fast.'],
  sport:['Zehn Kilometer gemeinsam gelaufen. Du lebst noch.','Ein Nachmittag beim Bouldern.'],kreativ:['Ihr malt zusammen ein riesiges Bild.','Ein Töpferkurs mit sehr schiefen Tassen.']};
const FFROM=a=>a<13?['Grundschule','Nachbarschaft','Fußballverein']:a<19?['Schule','Verein','Sommerferien']:a<28?['Studium','Ausbildung','WG','einer Party']:a<60?['Arbeit','Verein','Nachbarschaft'].concat((p.kids||[]).length?['Elternabend']:[]):['Seniorensport','Kleingarten','Chor'];
const fkList=()=>(p.fk=p.fk||[]);
const fkAge=f=>p.age+(f.d||0);
const fkById=id=>fkList().find(f=>f.id===id);
const fkP=f=>{const h=hsh(f.n);return {g:f.g,st:{gl:Math.max(30,f.cl)},skin:h%5,hair:(h>>3)%6,beard:f.g==='m'&&fkAge(f)>25&&h%3===0,bald:f.g==='m'&&fkAge(f)>55&&h%2===0,glasses:h%4===0,look:{o:null,acc:[]}}};
function fkMake(from){const g=pick(['w','m']);return {id:'f'+Date.now().toString(36)+R(10,99),n:pick(g==='w'?FN:MN),g,d:R(-3,3),tr:pick(Object.keys(FTR)),from,since:p.age,cl:R(45,60),met:p.age,st:{mar:0,kids:0,far:0},mem:[]}}
function fkAdd(f){fkList().push(f);log(f.n+' ('+f.from+') gehört jetzt zu deinem Freundeskreis.')}
function fkMem(f,t){f.mem=f.mem||[];f.mem.push({a:p.age,t});if(f.mem.length>5)f.mem.shift()}
const fkCl=(f,v)=>{f.cl=clamp(f.cl+v,0,100)};
function fkYear(){if(!p||p.age<6||p.prison)return;const L=fkList();
  const near=L.filter(f=>!f.st.far).length;
  if(L.length<6&&near<5&&ch(p.age<12?.12:p.age<30?.25:.15)&&!p.fkNew){p.fkNew=fkMake(pick(FFROM(p.age)));p.q.push({id:'fk_neu'})}
  const EV=[];L.forEach(f=>{const fa=fkAge(f);
    if(f.met<p.age-0)fkCl(f,-(f.st.far?(f.pen?5:9):5));
    if(fa>=24&&fa<=38&&!f.st.mar&&ch(.12)){f.st.mar=1;EV.push({id:'fk_hochzeit',d:f.id})}
    else if(fa>=26&&fa<=42&&f.st.mar&&f.st.kids<3&&ch(.13)){f.st.kids++;if(f.st.kids===1&&f.cl>=55)EV.push({id:'fk_pate',d:f.id});else log(f.n+' hat ein Kind bekommen.')}
    else if(fa>=20&&fa<=60&&!f.st.far&&ch(.035))EV.push({id:'fk_umzug',d:f.id});
    else if(fa>=18&&ch(.04))EV.push({id:'fk_krise',d:f.id});
    else if(f.cl>=70&&fa>=18&&fa<=72&&ch(.05))EV.push({id:'fk_reise',d:f.id});
    else if(f.tr==='chaot'&&f.cl>=40&&ch(.05))EV.push({id:'fk_streit',d:f.id});
    if(fa>=62&&ch((fa-58)*.006))p.q.push({id:'fk_tod',d:f.id});
    if(f.cl<12&&!f.drift){f.drift=1;p.q.push({id:'fk_drift',d:f.id})}});
  if(EV.length){p.q.push(EV.splice(R(0,EV.length-1),1)[0]);if(EV.length&&ch(.3))p.q.push(pick(EV))}
  const close=L.filter(f=>f.cl>=40).length+((p.rel&&p.rel.freund>=40)?1:0);
  if(p.age>=16&&!close){add('gl',-3);if(ch(.3))log('Du fühlst dich in letzter Zeit ziemlich einsam.')}
  else if(close>=3)add('gl',1)}
const FKE=(id,f)=>{const x=fkById(id);return x?f(x):null};
const FE=(t,x,o)=>{const e=E(t,x,()=>true,o);e.cat='Freunde';return e};
QEV.fk_neu=()=>{const f=p.fkNew;p.fkNew=null;if(!f)return null;const T=FTR[f.tr];
  return FE('Eine neue Bekanntschaft','Bei '+(f.from==='einer Party'?'einer Party':f.from==='Arbeit'?'der Arbeit':f.from==='WG'?'der WG-Besichtigung':'„'+f.from+'“')+' lernst du '+f.n+' kennen. '+T[0]+': '+T[1]+'. Ihr versteht euch auf Anhieb.',[
    ['Nummern austauschen',()=>{fkAdd(f);add('gl',3);fkMem(f,'Kennengelernt ('+f.from+')');return f.n+' schreibt dir noch am selben Abend.'}],
    ['Lieber nicht',()=>'Ihr seht euch nie wieder. Schade eigentlich.']])};
QEV.fk_hochzeit=id=>FKE(id,f=>FE(f.n+' heiratet!',f.n+' ruft aufgeregt an: „Ich heirate! Und ich will, dass du '+(f.cl>=60?'mein/e Trauzeug/in bist':'dabei bist')+'.“',[
  ...(f.cl>=60?[['Eine Rede halten',()=>{const ok=ch(.4+p.st.in/250+(p.sk&&p.sk.charme||0)/300);fkCl(f,ok?18:8);add('gl',ok?6:2);fkMem(f,ok?'Deine legendäre Hochzeitsrede':'Die Rede, bei der du den Faden verloren hast');if(ok)mile('Trauzeug/in bei '+f.n,'star');return ok?'Die halbe Hochzeitsgesellschaft weint. '+f.n+' umarmt dich ewig.':'Du verlierst den Faden. Alle lachen, '+f.n+' am lautesten. Wird trotzdem ein schöner Abend.'}]]:[]),
  ['Hingehen und feiern',()=>{fkCl(f,8);add('gl',4);p.money-=px$(150);fkMem(f,'Ihr habt auf der Hochzeit bis zum Morgen getanzt');return 'Ein Fest bis in den Morgen.'}],
  ['Absagen',()=>{fkCl(f,-15);fkMem(f,'Du warst nicht auf der Hochzeit');return f.n+' ist enttäuscht. Sehr.'}]]));
QEV.fk_pate=id=>FKE(id,f=>FE('Willst du Pate werden?',f.n+' hat ein Baby bekommen und fragt: „Wirst du Pate oder Patin? Du bist für uns wie Familie.“',[
  ['Ja, sehr gerne',()=>{fkCl(f,14);add('gl',6);f.pate=1;mile('Pate/Patin für das Kind von '+f.n,'star');fkMem(f,'Du bist Pate/Patin geworden');return 'Du hältst das Baby im Arm und bist sofort verliebt.'}],
  ['Lieber nicht, die Verantwortung …',()=>{fkCl(f,-6);return f.n+' versteht das. Irgendwie.'}]]));
QEV.fk_umzug=id=>FKE(id,f=>{const c=pick(['Hamburg','München','Wien','Zürich','Lissabon','Kanada','Australien']);return FE(f.n+' zieht weg',f.n+' hat einen Job in '+c+' bekommen und zieht nächsten Monat weg.',[
  ['Abschiedsparty organisieren',()=>{f.st.far=c;fkCl(f,10);add('gl',2);p.money-=px$(200);fkMem(f,'Die Abschiedsparty vor dem Umzug nach '+c);return 'Mit Fotos, Tränen und viel zu viel Kuchen.'}],
  ['Versprechen, jede Woche zu schreiben',()=>{f.st.far=c;f.pen=1;fkCl(f,4);return 'Ihr schreibt euch. Fast jede Woche.'}],
  ['„Viel Glück“',()=>{f.st.far=c;fkCl(f,-4);return f.n+' ist weg. Der Kontakt wird weniger.'}]])});
QEV.fk_krise=id=>FKE(id,f=>{const k=pick(['Trennung','Jobverlust','Krankheit in der Familie']);const c=px$(2000);return FE(f.n+' geht es schlecht',f.n+' steckt mitten in einer Krise ('+k+') und meldet sich spät in der Nacht.',[
  ['Sofort hinfahren',()=>{fkCl(f,16);add('gl',-1);f.met=p.age;fkMem(f,'Du warst in der schwersten Nacht da');return 'Ihr sitzt bis zum Morgen in der Küche. '+f.n+' sagt: „Ohne dich hätte ich das nicht geschafft.“'}],
  ['Mit Geld aushelfen ('+eur(c)+')',()=>{p.money-=c;fkCl(f,10);if(ch(.6))later('fkzurueck',R(2,4),{n:f.n,c});fkMem(f,'Du hast mit Geld ausgeholfen');return f.n+' ist sprachlos vor Dankbarkeit.'}],
  ['Gerade keine Zeit',()=>{fkCl(f,-14);fkMem(f,'Du hattest keine Zeit, als es drauf ankam');return 'Du schreibst „Kopf hoch!“. Die Antwort kommt erst Tage später.'}]])});
LATER.fkzurueck={ev:1,f:d=>E('Geld zurück',d.n+' steht vor deiner Tür, mit Umschlag und Wein: „Ich habe es nicht vergessen.“',()=>true,[['Danke!',()=>{p.money+=d.c;add('gl',4);return 'Du bekommst '+eur(d.c)+' zurück. Und eine Umarmung.'}]])};
QEV.fk_reise=id=>FKE(id,f=>{const z=pick(['Barcelona','Island','die Alpen','Rom','Kopenhagen','Marokko']),c=px$(900);return FE('Eine Reise mit '+f.n,f.n+' schlägt vor: „Lass uns zusammen nach '+z+'! Nur wir zwei, wie früher.“',[
  ['Koffer packen ('+eur(c)+')',()=>{p.money-=c;fkCl(f,14);add('gl',8);f.met=p.age;mile('Reise mit '+f.n+' nach '+z,'star');fkMem(f,'Eure Reise nach '+z);return 'Eine Woche, an die ihr euch noch mit 80 erinnern werdet.'}],
  ['Keine Zeit',()=>{fkCl(f,-5);return f.n+' fährt allein.'}]])});
QEV.fk_streit=id=>FKE(id,f=>{const w=pick(['hat dein Geheimnis weitererzählt','hat dein geliehenes Auto verbeult','hat deinen Geburtstag vergessen']);return FE('Ärger mit '+f.n,f.n+' '+w+'.',[
  ['Verzeihen',()=>{fkCl(f,3);add('gl',1);return 'Ihr lacht am Ende darüber. Fast.'}],['Ein ehrliches Gespräch',()=>{if(ch(.6)){fkCl(f,8);return 'Es war unangenehm, aber gut. Ihr seid euch jetzt näher.'}fkCl(f,-10);return 'Es wird laut. Ihr braucht erst mal Abstand.'}],
  ['Freundschaft beenden',()=>{p.fk=fkList().filter(x=>x!==f);add('gl',-4);return 'Du löschst die Nummer von '+f.n+'.'}]])});
QEV.fk_drift=id=>FKE(id,f=>FE('Aus den Augen verloren','Beim Durchscrollen siehst du ein altes Foto von dir und '+f.n+'. Ihr habt seit Ewigkeiten nichts voneinander gehört.',[
  ['Einfach anrufen',()=>{f.drift=0;f.cl=38;f.met=p.age;add('gl',3);return 'Nach zwei Minuten ist es, als wäre nie Zeit vergangen.'}],
  ['Loslassen',()=>{p.fk=fkList().filter(x=>x!==f);return 'Manche Freundschaften gehören zu einem bestimmten Lebensabschnitt.'}]]));
QEV.fk_tod=id=>FKE(id,f=>{const close=f.cl>=50;return FE('Abschied von '+f.n,'Die Nachricht kommt an einem Dienstagmorgen: '+f.n+' ist gestorben.',[
  ['Eine Rede auf der Beerdigung halten',()=>{add('gl',close?-8:-3);addRuf(1);p.fkGone=(p.fkGone||[]).concat([{n:f.n,a:p.age}]);p.fk=fkList().filter(x=>x!==f);mile('Abschied von '+f.n,'star');return 'Du erzählst von '+(f.mem&&f.mem.length?f.mem[f.mem.length-1].t.toLowerCase():'euren besten Momenten')+'. Es wird gelacht und geweint.'}],
  ['Still gedenken',()=>{add('gl',close?-10:-4);p.fkGone=(p.fkGone||[]).concat([{n:f.n,a:p.age}]);p.fk=fkList().filter(x=>x!==f);return 'Du zündest eine Kerze an und schaust alte Fotos an.'}]])});
/* ---------- Haustiere mit Charakter ---------- */
Object.assign(PETS,{kaninchen:{n:'Kaninchen',pr:60,c:250,life:9,names:['Hoppel','Mümmel','Schnuffel','Luna']},vogel:{n:'Wellensittich',pr:40,c:120,life:10,names:['Pieps','Bubi','Coco','Kiwi']},
  schildi:{n:'Schildkröte',pr:120,c:150,life:70,names:['Kurt','Frieda','Methusalem','Speedy']},pferd:{n:'Pferd',pr:6000,c:4200,life:28,names:['Blitz','Stella','Donner','Fee']}});
const PART={hund:'ein Hund',katze:'eine Katze',hamster:'ein Hamster',kaninchen:'ein Kaninchen',vogel:'ein Wellensittich',schildi:'eine Schildkröte',pferd:'ein Pferd'};
const PTR={verspielt:'Verspielt',verschmust:'Verschmust',frech:'Frech',aengstlich:'Ängstlich',schlau:'Schlau'};
const PTRICK={hund:['Sitz','Pfote geben','Rolle','Toter Hund','Zeitung holen'],katze:['High Five','Durch den Reifen springen','Auf Pfiff kommen'],hamster:['Laufrad-Rekord','Durch das Labyrinth'],
  kaninchen:['Männchen machen','Durch den Tunnel','Über die Hürde'],vogel:['Hallo sagen','Wie das Handy klingeln','Auf die Schulter fliegen'],schildi:['Kommen, wenn man ruft'],pferd:['Verbeugen','Steigen','Über den Oxer springen']};
const PETCOL={hund:'#D5A35E',katze:'#8E63D6',hamster:'#F2994A',kaninchen:'#E5527A',vogel:'#3BB273',schildi:'#2FA88F',pferd:'#8E6E53'};
const PIC={hund:'<path d="M7 5c-3 0-4.5 4-3.5 8l3-1.5M17 5c3 0 4.5 4 3.5 8l-3-1.5"/><path d="M7 5h10v9a5 5 0 0 1-10 0z"/><circle cx="10" cy="10.5" r=".8"/><circle cx="14" cy="10.5" r=".8"/><path d="M10.8 14h2.4L12 15.4z"/>',katze:'<path d="M5 20V9L4 3l5 3h6l5-3-1 6v11z"/><circle cx="9.5" cy="12" r=".8"/><circle cx="14.5" cy="12" r=".8"/><path d="M12 15v1M8 16l-4 1M16 16l4 1"/>',
  hamster:'<circle cx="12" cy="13" r="7"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="10" cy="12" r=".8"/><circle cx="14" cy="12" r=".8"/>',kaninchen:'<path d="M9 9V3M15 9V3"/><circle cx="12" cy="15" r="6"/><circle cx="10" cy="14" r=".8"/><circle cx="14" cy="14" r=".8"/>',
  vogel:'<path d="M4 14c0-5 4-9 9-9a5 5 0 0 1 5 5l3 1-3 1c0 5-4 8-9 8l-2 2v-3c-2-1-3-3-3-5z"/><circle cx="15" cy="9" r=".8"/>',schildi:'<path d="M4 15a8 6 0 0 1 16 0z"/><path d="M20 13h2M3 17l-1 2M21 17l1 2M8 10l2 5M16 10l-2 5"/>',
  pferd:'<path d="M7 21v-6l-3-2 3-8 4-2 6 4 3 6-3 1-2-3v10"/><circle cx="9" cy="8" r=".8"/>'};
const petIc=(t,sz)=>'<span class="kpi pti" style="--kc:'+(PETCOL[t]||'#8E63D6')+';width:'+(sz||52)+'px;height:'+(sz||52)+'px"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+(PIC[t]||PIC.hund)+'</svg></span>';
function petEns(){(p.pets||[]).forEach(x=>{if(!x.id)x.id='p'+R(1e5,9e5);if(x.b==null)x.b=55;if(!x.tr)x.tr=pick(Object.keys(PTR));if(!x.tk)x.tk=[];if(x.hp==null)x.hp=100;if(x.pl==null)x.pl=p.age})}
function petYear(){if(!p||!p.pets||p.prison)return;petEns();
  const seen=p.petSeen||[],now=p.pets.map(x=>x.id);seen.forEach(s=>{if(!now.includes(s.id)&&!s.gone)p.q.push({id:'pet_abschied',d:s})});
  p.pets.forEach(x=>{const L=PETS[x.t].life;if(x.pl<p.age-1)x.b=clamp(x.b-6,0,100);if(x.age>L*.6)x.hp=clamp(x.hp-R(4,10),5,100);
    if(x.age===L-1&&!x.oldEv)p.q.push({id:'pet_alt',d:x.id});
    else if(ch(.06)&&!x.wegEv&&['hund','katze','kaninchen','vogel'].includes(x.t))p.q.push({id:'pet_weg',d:x.id});
    else if(x.tr==='frech'&&ch(.12))p.q.push({id:'pet_streich',d:x.id});
    else if(x.t==='hund'&&x.b>=70&&ch(.04)&&!x.held)p.q.push({id:'pet_held',d:x.id});
    else if(x.b>=75&&ch(.06))add('gl',2)});
  p.petSeen=p.pets.map(x=>({id:x.id,n:x.n,t:x.t,b:x.b,age:x.age}))}
const PEV=(id,f)=>{const x=(p.pets||[]).find(y=>y.id===id);return x?f(x):null};
const PE=(t,x,o)=>{const e=E(t,x,()=>true,o);e.cat='Haustier';return e};
QEV.pet_weg=id=>PEV(id,x=>{x.wegEv=1;return PE(x.n+' ist weg!','Die Tür stand nur kurz offen. Jetzt ist '+x.n+' verschwunden.',[
  ['Die ganze Nachbarschaft absuchen',()=>{if(ch(.5+x.b/250)){x.b=clamp(x.b+10,0,100);add('gl',4);return 'Nach drei Stunden findest du '+x.n+' im Garten der Nachbarn. Ihr kuschelt den ganzen Abend.'}p.pets=p.pets.filter(y=>y!==x);add('gl',-10);(p.petSeen||[]).forEach(s=>{if(s.id===x.id)s.gone=1});return x.n+' bleibt verschwunden. Du hängst noch monatelang Zettel auf.'}],
  ['Zettel aufhängen und warten',()=>{if(ch(.6)){add('gl',2);return 'Zwei Tage später ruft eine Frau an: '+x.n+' sitzt bei ihr auf dem Sofa.'}p.pets=p.pets.filter(y=>y!==x);add('gl',-10);(p.petSeen||[]).forEach(s=>{if(s.id===x.id)s.gone=1});return x.n+' kommt nicht zurück.'}]])});
QEV.pet_streich=id=>PEV(id,x=>PE(x.n+' war das!',pick([x.n+' hat deine Lieblingsschuhe zerlegt.',x.n+' hat den Weihnachtsbraten vom Tisch geklaut.',x.n+' hat sich im Wäschekorb versteckt und dich zu Tode erschreckt.']),[
  ['Lachen',()=>{add('gl',3);x.b=clamp(x.b+4,0,100);return 'Wie soll man bei dem Blick auch böse sein?'}],
  ...(p.sm?[['Ein Video posten',()=>{const g=R(50,600)*(ch(.1)?40:1);p.sm.fol+=g;add('gl',2);return 'Das Video geht '+(g>5000?'viral':'gut')+': +'+kfmt(g)+' Follower.'}]]:[]),
  ['Schimpfen',()=>{x.b=clamp(x.b-6,0,100);return x.n+' schaut beleidigt weg.'}]]));
QEV.pet_held=id=>PEV(id,x=>{x.held=1;return PE(x.n+' ist ein Held','Mitten in der Nacht bellt '+x.n+' wie verrückt. In der Küche schmort ein Kabel. Ihr kommt gerade noch rechtzeitig.',[
  ['Die größte Wurst der Welt kaufen',()=>{x.b=100;add('gl',8);mile(x.n+' rettet die Familie','big');news('Hund '+x.n+' verhindert Wohnungsbrand','lokal');return 'Sogar die Zeitung berichtet über '+x.n+'.'}]])});
QEV.pet_alt=id=>PEV(id,x=>{x.oldEv=1;const c=px$(600);return PE(x.n+' wird alt','Die Schnauze ist grau, die Schritte langsam. '+x.n+' schläft fast den ganzen Tag.',[
  ['Extra-Pflege und Tierarzt ('+eur(c)+')',()=>{p.money-=c;x.age=Math.max(0,x.age-2);x.hp=clamp(x.hp+25,0,100);return 'Die Tierärztin ist zufrieden. Ihr habt noch etwas gemeinsame Zeit.'}],
  ['Die letzte Zeit genießen',()=>{x.b=clamp(x.b+10,0,100);add('gl',3);return 'Lange Nachmittage im Garten, nur ihr zwei.'}]])});
QEV.pet_abschied=s=>{(p.petSeen||[]).forEach(y=>{if(y.id===s.id)y.gone=1});return PE('Abschied von '+s.n,s.n+' ist friedlich eingeschlafen. '+(s.b>=70?'Ihr wart unzertrennlich.':'Es ist plötzlich sehr still im Haus.'),[
  ['Im Garten begraben',()=>{add('gl',-4);mile('Abschied von '+s.n,'star');p.petGone=(p.petGone||[]).concat([{n:s.n,t:s.t,a:p.age}]);return 'Unter dem Apfelbaum. Mit dem Lieblingsspielzeug.'}],
  ['Ein Foto an die Wand hängen',()=>{add('gl',-2);p.petGone=(p.petGone||[]).concat([{n:s.n,t:s.t,a:p.age}]);return s.n+' schaut dich jetzt jeden Morgen an.'}]])};
/* Haustiere ziehen mit zur nächsten Generation */
{const _ca=continueAs;continueAs=function(i){const prev=p,pets=(prev.pets||[]).slice(),fk=0;_ca.apply(this,arguments);if(p===prev)return;
  if(pets.length&&!(p.pets||[]).length){p.pets=pets;log(pets.map(x=>x.n).join(' und ')+(pets.length>1?' leben':' lebt')+' jetzt bei dir.');save()}}}
{const _py=perkYear;perkYear=function(R0){_py(R0);try{fkYear()}catch(e){}try{petYear()}catch(e){}}}
/* ---------- Aktionen ---------- */
{const _ap=adoptPet;adoptPet=function(){const r=_ap.apply(this,arguments);try{petEns()}catch(e){}return r}}
{const f=act;act=function(id,arg){
  if(/^(pplay|ptrick|pvet|petname)$/.test(id))petEns();
  if(id==='adopt'){const P=PETS[arg];if(!P||p.age<8||p.prison)return;if(p.money<P.pr){toast('Das kostet '+eur(P.pr)+'.');return}if(arg==='pferd'&&p.age<12){toast('Ein Pferd gibt es ab 12 Jahren.');return}adoptPet(arg);petEns();const x=p.pets[p.pets.length-1];done((PART[arg]||P.n).replace(/^e/,'E')+' namens '+x.n+' zieht bei dir ein. Charakter: '+PTR[x.tr]+'.');return}
  if(id==='fkmeet'){const x=fkById(arg);if(!x)return;if(x.met===p.age){toast('Ihr habt euch dieses Jahr schon getroffen.');return}const c=x.st.far?px$(250):px$(30);if(p.money<c){toast('Dafür fehlt dir das Geld.');return}CUR='freunde';if(!useAct())return;p.money-=c;x.met=p.age;x.drift=0;fkCl(x,x.st.far?16:12);add('gl',3);const t=pick(FMEET[x.tr]);fkMem(x,t);done(x.st.far?'Du besuchst '+x.n+' in '+x.st.far+'. '+t:t);return}
  if(id==='fkmsg'){const x=fkById(arg);if(!x)return;if(x.wy===p.age){toast('Du hast '+x.n+' dieses Jahr schon geschrieben.');return}x.wy=p.age;fkCl(x,4);done(x.n+' antwortet mit drei Sprachnachrichten.');return}
  if(id==='fkabend'){const L=fkList().filter(x=>!x.st.far);if(L.length<2){toast('Dafür brauchst du mindestens zwei Freunde in der Nähe.');return}if(p.fkA===p.age){toast('Euer Freundesabend war dieses Jahr schon.');return}const c=px$(40)*L.length;if(p.money<c){toast('Dafür fehlt dir das Geld.');return}CUR='party';if(!useAct())return;p.money-=c;p.fkA=p.age;L.forEach(x=>{fkCl(x,7);x.met=p.age;fkMem(x,'Der Freundesabend mit '+(L.length)+' Leuten')});add('gl',6);done('Ein Abend mit '+L.map(x=>x.n).join(', ')+'. Es wird spät. Sehr spät.');return}
  if(id==='pplay'){const x=(p.pets||[]).find(y=>y.id===arg);if(!x)return;if(x.pl===p.age&&x.pl2===p.age){toast(x.n+' braucht jetzt eine Pause.');return}CUR='pet';if(!useAct())return;if(x.pl===p.age)x.pl2=p.age;x.pl=p.age;x.b=clamp(x.b+(x.tr==='verschmust'?12:9),0,100);add('gl',x.tr==='verspielt'?6:4);done(pick(['Du spielst mit '+x.n+', bis ihr beide müde seid.',x.n+' rollt sich auf deinem Schoß zusammen.','Ein langer Ausflug mit '+x.n+'.']));return}
  if(id==='ptrick'){const x=(p.pets||[]).find(y=>y.id===arg);if(!x)return;const T=PTRICK[x.t]||[],nx=T.find(t=>!x.tk.includes(t));if(!nx){toast(x.n+' kann schon alle Tricks.');return}CUR='pet';if(!useAct())return;x.pl=p.age;
    const ok=ch(.3+(x.tr==='schlau'?.25:0)-(x.tr==='aengstlich'?.1:0)+x.b/300);if(ok){x.tk.push(nx);x.b=clamp(x.b+5,0,100);add('gl',4);if(x.tk.length===T.length)mile(x.n+' kann alle Tricks','star');done(x.n+' kann jetzt „'+nx+'“!')}else done(x.n+' schaut dich nur fragend an. Morgen vielleicht.');return}
  if(id==='pvet'){const x=(p.pets||[]).find(y=>y.id===arg);if(!x)return;const c=px$(120);if(p.money<c){toast('Das kostet '+eur(c)+'.');return}p.money-=c;x.hp=clamp(x.hp+30,0,100);done('Die Tierärztin sagt: '+(x.hp>=80?'Kerngesund!':'Gut aufpassen, aber alles im Rahmen.'));return}
  if(id==='petname'){const x=(p.pets||[]).find(y=>y.id===arg);if(!x)return;const n=(window.prompt?window.prompt('Neuer Name für '+x.n+':',x.n):null);if(n&&n.trim()){x.n=n.trim().slice(0,16);save();render()}return}
  return f(id,arg)}}
Object.assign(DUR,{freunde:120});
/* ---------- Ansichten ---------- */
function viewFreunde(){const L=fkList();let h='';
  h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Dein Freundeskreis</h2><span class="chip">'+(L.length+(p.age>=6?1:0))+'</span></div>'+(p.age>=6?row(esc(p.friend)+' <small class="note">beste/r Freund/in</small>','Seit der Kindheit · Nähe '+(p.rel.freund||0)+' %',''):'')+
    '<p class="note">Freundschaften brauchen Pflege. Wer sich lange nicht meldet, verliert sich aus den Augen.</p>'+(L.filter(x=>!x.st.far).length>=2?'<div class="btns">'+btn('fkabend',null,'Freundesabend veranstalten','o',p.act<=0||p.fkA===p.age)+'</div>':'')+'</section>';
  if(!L.length)h+=card('','<p class="note">Noch niemand. Neue Freunde lernst du in der Schule, im Studium, bei der Arbeit, im Verein oder in der Nachbarschaft kennen.</p>');
  L.forEach(x=>{const st=[];if(x.st.mar)st.push('verheiratet');if(x.st.kids)st.push(x.st.kids+' Kind'+(x.st.kids>1?'er':'')+(x.pate?' (Patenkind)':''));if(x.st.far)st.push('lebt in '+x.st.far);const m=(x.mem||[]).slice(-1)[0];
    h+='<section class="card fkc"><div class="fh"><span class="meav sm">'+avatarSvg(Math.max(6,fkAge(x)),56,fkP(x))+'</span><div><b>'+esc(x.n)+'</b><small>'+fkAge(x)+' Jahre · '+FTR[x.tr][0]+' · aus „'+esc(x.from)+'“ · seit '+(p.age-x.since)+' J.</small>'+
      '<div class="stat"><div class="r"><span>Nähe</span><span>'+x.cl+' %</span></div><div class="bar"><i class="'+(x.cl<30?'low':'')+'" style="width:'+x.cl+'%"></i></div></div>'+(st.length?'<div class="albm">'+st.map(s=>'<i>'+esc(s)+'</i>').join('')+'</div>':'')+(m?'<p class="note fkm">↺ Mit '+m.a+': '+esc(m.t)+'</p>':'')+
      '<div class="btns">'+btn('fkmeet',x.id,x.st.far?'Besuchen':'Treffen','o',p.act<=0||x.met===p.age||!!p.prison)+btn('fkmsg',x.id,'Schreiben','g',x.wy===p.age)+'</div></div></div></section>'});
  if((p.fkGone||[]).length)h+=card('In Erinnerung',p.fkGone.map(g=>row(esc(g.n),'gestorben, als du '+g.a+' warst','')).join(''));
  return h}
function viewTiere(){petEns();let h='';
  (p.pets||[]).forEach(x=>{const P=PETS[x.t],T=PTRICK[x.t]||[];
    h+='<section class="card ptc"><div class="fh">'+petIc(x.t)+'<div><b>'+esc(x.n)+' <button class="lnk sm" data-a="petname" data-g="'+x.id+'" aria-label="Umbenennen">✎</button></b><small>'+P.n+' · '+x.age+' '+(x.age===1?'Jahr':'Jahre')+' · '+PTR[x.tr]+'</small>'+
      '<div class="stat"><div class="r"><span>Bindung</span><span>'+x.b+' %</span></div><div class="bar"><i class="'+(x.b<30?'low':'')+'" style="width:'+x.b+'%"></i></div></div>'+
      '<div class="stat"><div class="r"><span>Gesundheit</span><span>'+x.hp+' %</span></div><div class="bar"><i class="'+(x.hp<40?'low':'')+'" style="width:'+x.hp+'%;background:#3BB273"></i></div></div>'+
      '<div class="albm">'+T.map(t=>'<i class="'+(x.tk.includes(t)?'on':'off')+'">'+(x.tk.includes(t)?'✓ ':'')+esc(t)+'</i>').join('')+'</div>'+
      '<div class="btns">'+btn('pplay',x.id,'Spielen','o',p.act<=0||!!p.prison)+btn('ptrick',x.id,'Trick üben','',p.act<=0||!!p.prison||x.tk.length>=T.length)+btn('pvet',x.id,'Tierarzt','g',p.money<px$(120))+'</div></div></div></section>'});
  if(!(p.pets||[]).length)h+=card('','<p class="note">Noch kein Haustier. Jedes Tier hat seinen eigenen Charakter, lernt Tricks und wird ein Teil der Familie.</p>');
  if((p.petGone||[]).length)h+=card('In Erinnerung',p.petGone.map(g=>row(esc(g.n),(PETS[g.t]||{n:''}).n+' · bis du '+g.a+' warst','')).join(''));
  h+=card('Tierheim',special('adopt'));return h}
{const _vf=viewFamilie;viewFamilie=function(){const want=famTab;if(want==='freunde'||want==='tiere'){famTab='kinder'}let h=_vf();famTab=want;
  const i=h.indexOf('<div class="seg full">'),j=h.indexOf('</div>',i);
  const seg='<div class="seg full ft6">'+[['kinder','Kinder'],['eltern','Eltern'],['freunde','Freunde'],['tiere','Tiere'],['baum','Stammbaum'],['erbe','Testament']].map(([k,l])=>'<button data-a="famtab" data-g="'+k+'" aria-pressed="'+(famTab===k)+'">'+l+'</button>').join('')+'</div>';
  if(want==='freunde')return seg+viewFreunde();if(want==='tiere')return seg+viewTiere();
  h=seg+h.slice(j+6);
  const a=h.indexOf('<section class="card"><h2 class="h">Haustiere</h2>'),b=h.indexOf('<h2 class="h">Tierheim</h2>');if(a>=0&&b>a){const e=h.indexOf('</section>',b)+10;h=h.slice(0,a)+card('',row('Haustiere','Jetzt mit Charakter, Tricks und Bindung',btn('famtab','tiere','Ansehen','g')))+h.slice(e)}
  return h}}
