/* ================= Politik-Karriere mit Tiefe: Programm, Entscheidungen im Amt, Wahlkampf, Lobby, Koalition, Kanzleramt ================= */
POLO.push(['Bundeskanzler/in',260000,40]);
const PTH={wohnen:['Bezahlbares Wohnen','#E5527A'],klima:['Klima und Umwelt','#2FA88F'],sicher:['Sicherheit','#2B59C3'],bildung:['Bildung','#8E63D6'],wirtschaft:['Wirtschaft und Jobs','#D5A35E'],verkehr:['Verkehr','#F08A24'],rente:['Rente und Pflege','#7F8C9A']};
const PGRP={buerger:'Bürger/innen',wirtschaft:'Wirtschaft',umwelt:'Umweltverbände'};
const polS=()=>{const o=p.pol;if(!o)return null;o.th=o.th||[];o.g=o.g||{buerger:50,wirtschaft:50,umwelt:50};o.dec=o.dec||[];return o};
const polIn=()=>!!(p.pol&&p.pol.lvl>=1);
const polHas=t=>(p.pol&&p.pol.th||[]).includes(t);
function polEff(e){const o=polS();if(!o)return;if(e.pop)o.pop=clamp(o.pop+e.pop,0,100);['buerger','wirtschaft','umwelt'].forEach(k=>{if(e[k])o.g[k]=clamp(o.g[k]+e[k],0,100)});if(e.ruf)addRuf(e.ruf);
  if(e.th){const hit=e.th.filter(polHas).length;if(hit)o.pop=clamp(o.pop+hit*3,0,100)}
  if(e.dev&&p.cityS)cityS().dev=Math.max(0,cityS().dev+e.dev);if(e.dw!=null&&p.cityS){const s=cityS();s.dw[e.dw]=clamp((s.dw[e.dw]||0)+(e.dwv||.3),-1,1)}
  if(e.prop)(p.props||[]).forEach(pr=>{pr.val=Math.round(pr.val*(1+e.prop))})}
const polDec=(t,o)=>{const S=polS();if(S){S.dec.push({a:p.age,t,o,l:S.lvl});if(S.dec.length>30)S.dec.shift()}};
const PE2=(t,x,opts)=>{const e=E(t,x,()=>polIn()&&!p.prison,opts.map(([l,eff,txt])=>[l,()=>{polEff(eff);polDec(t,l);return txt}]));e.cat='Politik';return e};
/* Vorlagen im Stadtrat und als Bürgermeister/in */
const VORL=[
 {id:'radweg',min:1,ev:()=>PE2('Abstimmung: Radwege','Im Stadtrat liegt ein Antrag: Auf der Hauptstraße sollen Parkplätze für einen breiten Radweg weichen.',[
   ['Dafür stimmen',{umwelt:12,wirtschaft:-6,buerger:2,th:['klima','verkehr']},'Der Radweg kommt. Die Händler schimpfen, die Radfahrer jubeln.'],['Dagegen stimmen',{wirtschaft:8,umwelt:-10,th:['wirtschaft']},'Die Parkplätze bleiben. Bei der nächsten Fahrraddemo hält jemand ein Schild mit deinem Namen hoch.'],
   ['Kompromiss: halbe Spur',{buerger:4,pop:2},'Ein bisschen Radweg, ein paar Parkplätze. Keiner ist begeistert, keiner wütend.']])},
 {id:'bad',min:1,ev:()=>PE2('Das alte Hallenbad','Das Hallenbad ist marode. Sanieren kostet Millionen, die Stadt hat Schulden.',[
   ['Sanieren',{buerger:10,wirtschaft:-6,pop:3,th:['bildung']},'Die Schwimmvereine feiern. Der Kämmerer seufzt.'],['Schließen und Schulden abbauen',{wirtschaft:10,buerger:-10,pop:-3,th:['wirtschaft']},'Vernünftig, sagen die einen. Herzlos, sagen die anderen.'],
   ['Private Investoren suchen',{wirtschaft:6,buerger:-2},'Ein Fitnesskonzern übernimmt. Der Eintritt verdoppelt sich.']])},
 {id:'wohnungen',min:1,ev:()=>{const d=R(0,DIST.length-1);return PE2('Neue Wohnungen im '+DIST[d][0],'Ein Investor will 400 Wohnungen bauen. Die Anwohner fürchten Lärm und Verkehr.',[
   ['Genehmigen, mit 30 % Sozialwohnungen',{buerger:8,wirtschaft:4,umwelt:-4,th:['wohnen'],dev:1,dw:d,dwv:.2},'Die Kräne kommen. In zwei Jahren ziehen die ersten Familien ein.'],
   ['Genehmigen, ohne Auflagen',{wirtschaft:12,buerger:-6,dev:1,dw:d,dwv:.35,ruf:-1},'Luxuswohnungen mit Seeblick. Die Mieten im Viertel ziehen an.'],['Ablehnen',{umwelt:6,wirtschaft:-8,th:['klima']},'Die Wiese bleibt. Die Wohnungsnot auch.']])}},
 {id:'polizei',min:1,ev:()=>PE2('Mehr Polizei am Bahnhof?','Nach mehreren Überfällen fordern viele mehr Polizeistreifen und Kameras am Bahnhof.',[
   ['Mehr Streifen und Kameras',{buerger:6,umwelt:-2,th:['sicher'],pop:2},'Die Leute fühlen sich sicherer. Datenschützer protestieren.'],['Sozialarbeit statt Kameras',{buerger:2,umwelt:4,th:['bildung']},'Ein neues Jugendzentrum eröffnet. Die Wirkung zeigt sich langsam.'],['Alles bleibt, wie es ist',{pop:-3},'Die Zeitung titelt: „Stadtrat schaut weg“.']])},
 {id:'stadion',min:2,ev:()=>PE2('Ein neues Stadion','Der FC will ein neues Stadion. Die Stadt soll das Grundstück geben und die Hälfte zahlen.',[
   ['Zusagen',{buerger:6,wirtschaft:8,umwelt:-8,dev:1,pop:4,th:['wirtschaft']},'Die Fans singen deinen Namen. Das Stadion wird ein Wahrzeichen.'],['Nur das Grundstück geben',{wirtschaft:4,buerger:2},'Ein Kompromiss. Der Verein baut kleiner.'],['Ablehnen',{wirtschaft:-6,buerger:-6,umwelt:6},'Der FC droht mit Umzug ins Umland.']])},
 {id:'strassenbahn',min:2,ev:()=>PE2('Straßenbahn bis in die Vorstadt?','Die Verlängerung der Straßenbahn würde die Vorstadt anbinden. Kosten: viele Millionen, Bauzeit: vier Jahre.',[
   ['Bauen',{umwelt:10,buerger:6,wirtschaft:-4,dev:1,dw:5,dwv:.3,th:['verkehr','klima']},'Vier Jahre Baustelle, dann eine Bahn, die alle lieben.'],['Lieber Busse',{wirtschaft:4,buerger:2},'Günstig, aber niemand schwärmt von Bussen.'],['Verschieben',{pop:-2},'Vertagt. Wieder einmal.']])},
 {id:'grundsteuer',min:2,ev:()=>PE2('Loch in der Stadtkasse','Der Haushalt hat ein Loch von 20 Millionen. Steuern rauf oder sparen?',[
   ['Grundsteuer erhöhen',{wirtschaft:-8,buerger:-6,pop:-4,prop:-.02},'Die Kasse ist voll, die Laune im Keller.'],['Bei Kultur und Sport sparen',{buerger:-8,wirtschaft:6},'Zwei Jugendclubs schließen. Es gibt Demos vor dem Rathaus.'],['Neue Schulden',{wirtschaft:-4,pop:2},'Das Problem verschiebt sich auf später. Auf dich.']])},
 {id:'fest',min:2,ev:()=>PE2('Großes Stadtjubiläum','Die Stadt wird 800 Jahre alt. Wie groß soll gefeiert werden?',[
   ['Riesiges Fest mit Konzert',{buerger:12,wirtschaft:2,pop:6},'Zehntausende feiern. Du hältst die Eröffnungsrede.'],['Bescheiden feiern',{wirtschaft:4,buerger:2},'Ein nettes Fest. Morgen redet niemand mehr darüber.']])},
 {id:'klima',min:3,ev:()=>PE2('Klimagesetz im Parlament','Ein strenges Klimagesetz steht zur Abstimmung. Deine Partei ist gespalten.',[
   ['Dafür stimmen',{umwelt:14,wirtschaft:-8,th:['klima']},'Das Gesetz geht durch, auch mit deiner Stimme.'],['Dagegen stimmen',{wirtschaft:10,umwelt:-12,th:['wirtschaft']},'Die Umweltverbände setzen dich auf eine Liste. Keine gute Liste.'],['Enthalten',{pop:-3},'Du enthältst dich. Die Presse nennt es feige.']])},
 {id:'rente',min:3,ev:()=>PE2('Rentenreform','Soll das Rentenalter auf 69 steigen, um die Kassen zu retten?',[
   ['Ja, unpopulär, aber nötig',{wirtschaft:10,buerger:-12,pop:-5},'Die Reform kommt. Du bekommst wütende Briefe von Rentnern.'],['Nein, lieber Steuern erhöhen',{buerger:10,wirtschaft:-10,th:['rente']},'Die Gewerkschaften applaudieren.'],['Eine Kommission einsetzen',{pop:-1},'Die Kommission tagt. Und tagt. Und tagt.']])},
 {id:'krise',min:5,ev:()=>PE2('Krisensitzung','Eine schwere Flut trifft mehrere Bundesländer. Alle schauen auf dich.',[
   ['Sofort hinfahren und Hilfe zusagen',{buerger:14,pop:8,ruf:3},'Bilder von dir in Gummistiefeln gehen um die Welt. Die Hilfe kommt schnell.'],['Aus der Hauptstadt koordinieren',{wirtschaft:4,pop:-2},'Effizient, aber kalt, schreiben die Zeitungen.']])}];
/* Wahlkampf, Lobby, Koalition, Skandale */
QEV.pol_duell=()=>{const o=polS();if(!o||!o.next)return null;const L=Math.min(POLO.length-1,o.lvl+1),gn=o.gegner||'';return E('Das TV-Duell','Mitten im Wahlkampf: TV-Duell gegen '+gn+'. Millionen schauen zu. Die erste Frage kommt.',()=>true,[
  ['Mit Fakten überzeugen',()=>{const ok=ch(.35+p.st.in/200);o.camp+=ok?18:4;return ok?'Du kennst jede Zahl. Die Umfragen springen nach oben.':'Zu viele Zahlen. Die Zuschauer schalten um.'}],
  ['Mit Humor punkten',()=>{const ok=ch(.35+(p.sk.charme||0)/200);o.camp+=ok?20:-4;return ok?'Ein Witz, der morgen auf allen Titelseiten steht. Sympathiepunkte!':'Der Witz zündet nicht. Peinliche Stille.'}],
  ['Den Gegner angreifen',()=>{const ok=ch(.45);o.camp+=ok?14:-8;addRuf(-1);return ok?gn+' gerät ins Stottern. Treffer!':'Der Angriff wirkt unfair. Das Publikum buht.'}]])};
QEV.pol_lobby=()=>{const o=polS();if(!o)return null;const c=px$(R(20,80)*1000);return E('Ein großzügiges Angebot','Ein Lobbyist lädt dich in ein teures Restaurant ein. Unter der Serviette liegt ein Umschlag: '+eur(c)+'. „Nur eine kleine Gefälligkeit bei der nächsten Abstimmung.“',()=>true,[
  ['Annehmen',()=>{p.money+=c;addRuf(-6);o.g.wirtschaft=clamp(o.g.wirtschaft+10,0,100);later('pol_skandal',R(2,5),{c});return 'Der Umschlag wandert in deine Tasche. Niemand hat es gesehen. Hoffentlich.'}],
  ['Ablehnen',()=>{addRuf(3);return 'Du stehst auf und gehst. Gutes Gefühl.'}],['Ablehnen und öffentlich machen',()=>{addRuf(6);o.pop=clamp(o.pop+8,0,100);news(p.first+' '+p.last+' deckt Bestechungsversuch auf','gross');return 'Die Presse feiert dich als unbestechlich.'}]])};
LATER.pol_skandal={ev:1,f:d=>E('Der Umschlag','Ein Journalist ruft an: „Wir haben Fotos von Ihnen und einem Lobbyisten. Mit Umschlag.“',()=>!!p.pol,[
  ['Alles abstreiten',()=>{if(ch(.4)){addRuf(-2);return 'Die Fotos sind unscharf. Die Geschichte verläuft im Sand.'}p.pol.pop=Math.max(0,p.pol.pop-35);addRuf(-12);news('Bestechungsskandal um '+p.first+' '+p.last,'gross');if(p.job&&p.job.id==='pol'){p.job=null;p.pol.lvl=Math.max(1,p.pol.lvl-1);p.pol.term=null}mile('Rücktritt nach Skandal','bad');return 'Der Skandal ist nicht mehr aufzuhalten. Du musst zurücktreten.'}],
  ['Zurücktreten und Geld spenden',()=>{p.money-=d.c;addRuf(-4);if(p.job&&p.job.id==='pol'){p.job=null;p.pol.term=null}p.pol.lvl=Math.max(1,p.pol.lvl-1);p.pol.pop=Math.max(0,p.pol.pop-15);return 'Ein Neuanfang. Manche respektieren das sogar.'}]])};
QEV.pol_koalition=()=>{const o=polS();if(!o)return null;const others=PARTIES.map((x,i)=>i).filter(i=>i!==o.party);return E('Koalitionsverhandlungen','Deine Partei hat die Wahl gewonnen, aber nicht allein die Mehrheit. Mit wem willst du regieren?',()=>true,[
  ...others.map(i=>['Mit '+(i===0?'dem ':'der ')+PARTIES[i][0],()=>{o.coal=i;o.pop=clamp(o.pop+R(-4,6),0,100);return 'Nach zwölf Nächten steht der Vertrag. '+(i===0?'Das ':'Die ')+PARTIES[i][0]+' bekommt drei Ministerien.'}]),
  ['Minderheitsregierung wagen',()=>{o.coal=-1;o.pop=clamp(o.pop-4,0,100);return 'Riskant. Jedes Gesetz wird ein Krimi.'}]])};
QEV.pol_rivale=()=>{const o=polS();if(!o||!o.next||!p.rival)return null;o.gegner=p.rival.n;return E('Ausgerechnet!','Die Gegenpartei schickt ihre/n Kandidat/in ins Rennen: '+p.rival.n+'. Dein Rivale aus der Schulzeit.',()=>true,[
  ['Fair bleiben',()=>{addRuf(2);o.camp+=4;return 'Ihr gebt euch vor den Kameras die Hand. Die Presse liebt die Geschichte.'}],['Alte Geschichten auspacken',()=>{addRuf(-3);o.camp+=8;return 'Schmutziger Wahlkampf. Er wirkt trotzdem.'}]])};
QEV.pol_buerger=()=>{const o=polS();if(!o)return null;const t=pick(Object.keys(PTH));return E('Bürgersprechstunde','Eine ältere Frau sitzt vor dir: „Ich kann meine Miete nicht mehr zahlen. Was tun Sie eigentlich für Leute wie mich?“',()=>true,[
  ['Persönlich helfen',()=>{o.pop=clamp(o.pop+4,0,100);o.g.buerger=clamp(o.g.buerger+4,0,100);addRuf(2);return 'Du telefonierst zwei Stunden für sie herum. Am Ende hat sie eine Lösung. Und du eine Wählerin mehr.'}],
  ['Auf dein Programm verweisen',()=>{if(polHas('wohnen')){o.pop=clamp(o.pop+3,0,100);return 'Bezahlbares Wohnen ist dein Thema. Sie nickt.'}return 'Sie verlässt den Raum kopfschüttelnd.'}]])};
/* Jahreslauf */
function polYear2(){const o=polS();if(!o||p.prison)return;
  if(o.next&&!o.gegner)o.gegner=pick(FN.concat(MN))+' '+pick(LN);
  if(polIn()){const V=VORL.filter(v=>o.lvl>=v.min&&!(o.vy&&o.vy[v.id]&&p.age-o.vy[v.id]<8));if(V.length&&ch(o.lvl>=2?.8:.5)){const v=pick(V);o.vy=o.vy||{};o.vy[v.id]=p.age;p.q.push({id:'pol_v_'+v.id})}
    if(o.lvl>=2&&ch(.12)&&!(o.lob&&p.age-o.lob<6)){o.lob=p.age;p.q.push({id:'pol_lobby'})}if(ch(.2))p.q.push({id:'pol_buerger'});
    const avg=(o.g.buerger+o.g.wirtschaft+o.g.umwelt)/3;o.pop=clamp(o.pop+Math.round((avg-50)/12),0,100);
    // Themen treffen auf die Lage in der Stadt
    if(typeof curAl==='function'&&curAl()>8&&polHas('wirtschaft'))o.pop=clamp(o.pop+2,0,100);
    if(p.cityS&&Object.values(cityS().dw).some(v=>v>.6)&&polHas('wohnen'))o.pop=clamp(o.pop+2,0,100)}
  if(o.lvl===5&&!o.kanzlerTry&&p.age>=40&&o.pop>=65&&ch(.25)){o.kanzlerTry=1;log('Deine Partei will dich als Kanzlerkandidat/in aufstellen.')}}
VORL.forEach(v=>{QEV['pol_v_'+v.id]=()=>{try{return v.ev()}catch(e){return null}}});
{const _py=perkYear;perkYear=function(R0){_py(R0);try{polYear2()}catch(e){errLog(e)}}}
/* Koalition nach gewonnener Wahl ab Landtag */
{const _pl=polYear;polYear=function(R0){const o=p.pol,l0=o?o.lvl:0;_pl(R0);if(o&&o.lvl>l0){if(o.lvl>=3&&ch(.6))p.q.push({id:'pol_koalition'});o.gegner=null;o.rv=0;o.terms=(o.terms||0)+1}if(o&&!o.next)o.gegner=null}}
/* Aktionen */
{const f=act;act=function(id,arg){
  if(id==='po_th'){const o=polS();if(!o)return;const i=o.th.indexOf(arg);if(i>=0)o.th.splice(i,1);else{if(o.th.length>=3){toast('Höchstens drei Kernthemen.');return}o.th.push(arg)}save();render();return}
  if(id==='po_cand'){const o=polS(),had=o&&o.next;f(id,arg);if(o&&o.next&&!had){if(!o.gegner)o.gegner=pick(FN.concat(MN))+' '+pick(LN);const show=k=>{const e=QEV[k]();if(e)setTimeout(()=>{try{showEvent0(e)}catch(x){errLog(x)}},500)};
    if(p.rival&&!o.rv&&ch(.35)){o.rv=1;show('pol_rivale')}else if(o.lvl+1>=2&&ch(.7))show('pol_duell')}return}
  if(id==='po_quit'){const o=polS();if(!o||!(p.job&&p.job.id==='pol'))return;dialog('Rücktritt?','Willst du dein Amt als '+p.job.t+' wirklich niederlegen?',[['Zurücktreten',()=>{p.job=null;o.term=null;o.lvl=1;addRuf(1);mile('Rücktritt vom Amt','star');done('Du legst dein Amt nieder. Ein Kapitel endet.')}],['Doch nicht',null]]);return}
  if(id==='po_presse'){const o=polS();if(!o||o.pk===p.age)return;CUR='po_work';if(!useAct())return;o.pk=p.age;const ok=ch(.45+(p.sk.charme||0)/250+p.st.in/400);o.pop=clamp(o.pop+(ok?6:-3),0,100);done(ok?'Die Pressekonferenz läuft glänzend. Deine Botschaft ist in allen Nachrichten.':'Eine fiese Frage bringt dich ins Schwimmen. Der Clip geht viral, leider.');return}
  return f(id,arg)}}
/* Ansicht */
function polExtra(){const o=polS();if(!o)return '';let h='';
  h+=card('Dein Programm','<p class="note">Wähle bis zu drei Kernthemen. Entscheidungen, die dazu passen, machen dich glaubwürdig.</p><div class="pth">'+Object.entries(PTH).map(([k,[n,c]])=>'<button data-a="po_th" data-g="'+k+'" aria-pressed="'+polHas(k)+'" style="--pc:'+c+'">'+n+'</button>').join('')+'</div>');
  h+=card('Rückhalt','<div class="pgrp">'+Object.entries(PGRP).map(([k,n])=>'<div class="stat"><div class="r"><span>'+n+'</span><span>'+o.g[k]+' %</span></div><div class="bar"><i class="'+(o.g[k]<30?'low':'')+'" style="width:'+o.g[k]+'%"></i></div></div>').join('')+'</div>'+
    (o.next?'<p class="note">Umfrage für die Wahl: '+Math.round(clamp(30+o.pop*.3+o.camp*.3,5,85))+' % · Gegenkandidat/in: '+esc(o.gegner||'noch offen')+'</p>':'')+
    (o.coal!=null&&o.lvl>=3?'<p class="note">Koalition: '+(o.coal<0?'Minderheitsregierung':'mit '+(o.coal===0?'dem ':'der ')+PARTIES[o.coal][0])+'</p>':''));
  if(polIn())h+=card('Im Amt',row('Pressekonferenz','Einmal im Jahr · 1 Aktion · Beliebtheit +/−',btn('po_presse',null,o.pk===p.age?'Erledigt':'Los','o',p.act<=0||o.pk===p.age||!!p.prison))+(p.job&&p.job.id==='pol'?row('Rücktritt','Das Amt niederlegen',btn('po_quit',null,'Zurücktreten','g')):''));
  if(o.dec.length)h+=card('Deine Entscheidungen',o.dec.slice(-6).reverse().map(d=>row(esc(d.t),'Mit '+d.a+' als '+POLO[Math.min(d.l,POLO.length-1)][0]+': '+esc(d.o),'')).join(''));
  return h}
{const _vw=viewWege;viewWege=function(){const h=_vw();if(karTab!=='politik'||!p.pol)return h;return h.replace('Du bist Minister/in.',p.pol.lvl>=6?'Du bist Bundeskanzler/in. Höher geht es nicht.':'Du bist Minister/in.')+polExtra()}}
