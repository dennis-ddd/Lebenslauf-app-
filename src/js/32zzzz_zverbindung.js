/* ================= Die Geschichte geht weiter: Freunde im Chat, Generationswechsel mit Erbe und Erinnerungen ================= */
/* ---------- Freunde schreiben im Chat ---------- */
const FKCOL={treu:'#2FA88F',lustig:'#F08A24',chaot:'#E5527A',klug:'#5B6CF0',sport:'#13B3A6',kreativ:'#B05BD6'};
const FKMSG={treu:['Wie geht’s dir wirklich? Ich denk oft an dich.','Lust, mal wieder spazieren zu gehen?','Hab heute unser altes Foto gefunden. Wir sahen so jung aus!','Ich bin immer für dich da, das weißt du, oder?'],
  lustig:['Ich hab gerade beim Bäcker „Danke, gleichfalls“ gesagt, als sie „Guten Appetit“ meinte.','Wer zuletzt lacht, hat den Witz nicht verstanden. Also du. 😄','Karaoke am Freitag? Ich hab schon geübt. Leider.','Mein Navi hat mich heute in einen Feldweg geschickt. Ich wohne jetzt da.'],
  chaot:['Hab meinen Schlüssel im Kühlschrank gefunden. Frag nicht.','Ich glaub, ich hab gestern versehentlich einen Wohnwagen gekauft.','Sorry, dass ich mich so lange nicht gemeldet hab!','Spontan heute Abend? Ich hab zwei Tickets für irgendwas.'],
  klug:['Hast du das Buch gelesen, das ich dir empfohlen habe?','Ich hab eine Frage zum Leben. Kaffee?','Wusstest du, dass Oktopusse drei Herzen haben?','Wie läuft es bei dir mit der Arbeit?'],
  sport:['Laufen am Samstag? Keine Ausreden!','Neuer Rekord: 10 km in 48 Minuten! 💪','Kommst du mit zum Bouldern?','Ich hab mich für einen Halbmarathon angemeldet. Du auch?'],
  kreativ:['Ich hab ein Bild gemalt, das dich an unseren Urlaub erinnern soll.','Hilfst du mir, einen Namen für meine Band zu finden?','Ausstellung am Freitag, ich stelle zwei Bilder aus!','Ich hab eine verrückte Idee für ein Projekt. Bist du dabei?']};
const fkCid=f=>'fk_'+f.id;
const fkByCid=cid=>String(cid).startsWith('fk_')?fkList().find(f=>fkCid(f)===cid):null;
{const _co=contacts;contacts=function(){let c=_co.apply(this,arguments);if(p&&p.deadParent)c=c.filter(x=>x.id!==p.deadParent);
  if(p&&p.age>=8)fkList().filter(f=>f.cl>=25||(p.chats&&p.chats[fkCid(f)])).forEach(f=>c.push({id:fkCid(f),n:f.n,col:FKCOL[f.tr]||'#2FA88F',sub:(f.onkel?(f.g==='w'?'Tante (Freundin deiner Eltern)':'Onkel (Freund deiner Eltern)'):'Freund/in · '+FTR[f.tr][0])+(f.st.far?' · '+f.st.far:''),msgs:(p.chats[fkCid(f)]||{}).msgs||[],un:(p.chats[fkCid(f)]||{}).un||0}));return c}}
{const _ms=msg;msg=function(id,t,me){if(p&&p.deadParent&&id===p.deadParent)return;return _ms(id,t,me)}}
{const _ru=relUp;relUp=function(id,n){const f=fkByCid(id);if(f){fkCl(f,n);if(n>0)f.met=Math.max(f.met,p.age-1);return}return _ru(id,n)}}
{const _cv=cavOf;cavOf=function(c,size){const f=fkByCid(c.id);if(f)return '<span class="cav av" style="background:'+c.col+'">'+avatarSvg(Math.max(6,fkAge(f)),size||44,fkP(f))+'</span>';return _cv(c,size)}}
function fkChatYear(){if(!p||p.age<8||p.prison)return;fkList().filter(f=>f.cl>=30&&!f.gone).forEach(f=>{if(ch(f.cl>=60?.55:.3)){const t=chatPick(fkCid(f),FKMSG[f.tr]||FKMSG.treu);if(t)msg(fkCid(f),t)}})}
/* ---------- Lebensfilm: auch Freunde, Tiere und Ämter ---------- */
{const _fs=filmScenes;filmScenes=function(){const S=_fs.apply(this,arguments);try{const add=[];
  const ppl=fkList().slice().sort((a,b)=>b.cl-a.cl).slice(0,3).map(f=>f.n).concat((p.fkGone||[]).slice(-1).map(g=>g.n+' (in Erinnerung)'));
  if(ppl.length)add.push('<div class="lfs" style="--sc:#2FA88F"><small class="lfk">Deine Menschen</small><p>'+esc(ppl.join(', '))+'</p><em>'+(p.age>=6?'Und '+esc(p.friend)+', von Anfang an.':'')+'</em></div>');
  const tiere=(p.petGone||[]).map(t=>t.n).concat((p.pets||[]).map(t=>t.n));
  if(tiere.length)add.push('<div class="lfs" style="--sc:#F08A24"><div class="lfav" style="padding:14px">'+petIc((p.pets[0]||p.petGone[0]).t,72)+'</div><small class="lfk">Deine Tiere</small><p>'+esc(tiere.slice(0,4).join(', '))+'</p><em>Treue Begleiter durch die Jahre.</em></div>');
  if(p.pol&&p.pol.lvl>=1){const d=(p.pol.dec||[]).slice(-1)[0];add.push('<div class="lfs" style="--sc:#2B59C3"><small class="lfk">Dein Amt</small><p>'+esc(POLO[p.pol.lvl][0])+'</p><em>'+(d?'Mit '+d.a+': '+esc(d.t)+' – '+esc(d.o):'Im Dienst deiner Stadt.')+'</em></div>')}
  if(!add.length)return S;const i=S.findIndex(s=>s.includes('Die größten Momente')||s.includes('lfend'));S.splice(i<0?S.length:i,0,...add)}catch(e){errLog(e,'film')}return S}}
/* ---------- Generationswechsel: Elternhaus, Freunde der Eltern, Erbstück, Erinnerungen ---------- */
{const _ca=continueAs;continueAs=function(i){const prev=p,k=prev&&prev.kids&&prev.kids[i];const r=_ca.apply(this,arguments);if(!k||p===prev)return r;
  try{const pn=prev.first,pg=prev.g;p.deadParent=pg==='w'?'mama':'papa';p.parentPrev={n:pn+' '+prev.last,g:pg,a:prev.age,job:prev.pension?'Rentner/in':(prev.job?prev.job.t:''),pol:prev.pol?prev.pol.lvl:0,ruf:prev.ruf||0};
    // Elternhaus
    const ka=p.age,home=(prev.props||[]).find(x=>x.use==='self');const solo=(prev.kids||[]).filter(x=>x.alive!==false).length===1||prev.will==='kid'+i;
    if(home&&ka>=18&&solo){const h=Object.assign({},home,{use:'leer',inh:1});p.props=p.props||[];p.props.push(h);p.money=Math.max(0,p.money-Math.round(h.val));mile('Elternhaus geerbt','star');log('Du erbst das Haus, in dem du aufgewachsen bist.')}
    // Freunde der Eltern werden Onkel und Tante
    (prev.fk||[]).filter(f=>f.cl>=60&&!f.gone).sort((a,b)=>b.cl-a.cl).slice(0,2).forEach(f=>{const fa=prev.age+(f.d||0);if(fa>90)return;const x=fkMake('der Familie');x.n=f.n;x.g=f.g;x.tr=f.tr;x.d=fa-p.age;x.cl=45;x.onkel=1;x.since=Math.max(0,p.age-ka);x.st={mar:f.st.mar,kids:f.st.kids,far:f.st.far};fkMem(x,'War '+(f.cl>=80?'der beste Freund':'ein guter Freund')+(f.g==='w'?'in':'')+' von '+(pg==='w'?'deiner Mutter':'deinem Vater'));fkList().push(x)});
    // Erbstück
    const own=Object.keys(ALB.keep||{}).filter(x=>ALB.keep[x]&&ALB.keep[x].n===pn+' '+prev.last);const ks=(prev.keepNew||[]).concat(own);const kk=ks.find(x=>KEEP[x])||'tagebuch';p.heirloom=kk;log('Erbstück von '+pn+': '+KEEP[kk][0]+'.')
    // Erinnerungen der Eltern
    p.pmem=(prev.skm||[]).filter(m=>['nbloan','mieterhilfe','kidsupport','sabbat'].includes(m.k)).map(m=>({k:m.k,d:m.d}));
    if((prev.ehist||[]).some(h=>h.t==='Ein Geldbeutel!'&&/Zurück/.test(h.o)))p.pmem.push({k:'wallet'});
    save()}catch(e){errLog(e,'erbe')}return r}}
const PEV2=[
 {id:'pe_cafe',w:()=>(p.pmem||[]).some(m=>m.k==='nbloan')&&p.age>=16,ev:()=>{const m=p.pmem.find(m=>m.k==='nbloan');const P=p.parentPrev;return EC('Familie','Ein Café voller Erinnerungen','Im Café um die Ecke stutzt der Besitzer bei deinem Namen. „Du bist das Kind von '+esc(P.n)+'? Ohne '+(P.g==='w'?'deine Mutter':'deinen Vater')+' gäbe es dieses Café nicht.“',[
   ['Erzählen lassen',()=>{add('gl',6);return 'Er erzählt eine Stunde lang. Seitdem trinkst du hier jeden Kaffee umsonst.'}]],(P.g==='w'?'Deine Mutter':'Dein Vater')+' hat '+esc(m.d&&m.d.n||'ihm')+' damals Geld geliehen')}},
 {id:'pe_wallet',w:()=>(p.pmem||[]).some(m=>m.k==='wallet')&&p.age>=18,ev:()=>{const P=p.parentPrev;return EC('Familie','Eine ehrliche Familie','Eine alte Dame hält dich im Supermarkt an: „Du siehst aus wie '+esc(P.n.split(' ')[0])+'. '+(P.g==='w'?'Sie':'Er')+' hat mir als Kind meinen Geldbeutel zurückgebracht. So was vergisst man nicht.“',[
   ['Lächeln',()=>{add('gl',5);addRuf(1);return 'Du gehst ein bisschen stolzer nach Hause.'}]],'Damals: Geldbeutel zurückgebracht')}},
 {id:'pe_name',w:()=>p.parentPrev&&(p.parentPrev.pol>=2||Math.abs(p.parentPrev.ruf)>=40)&&p.age>=14,ev:()=>{const P=p.parentPrev,good=P.pol>=2||P.ruf>=40;return EC('Familie','Bist du nicht …?',good?'„Moment, bist du das Kind von '+esc(P.n)+'?“ Die Frau am Schalter strahlt. '+(P.pol>=2?'„'+(P.g==='w'?'Sie':'Er')+' war so eine gute '+(P.g==='w'?'Bürgermeisterin':'Bürgermeister')+'!“':'„Eine echte Legende in dieser Stadt.“'):'„Ach, du bist das Kind von '+esc(P.n)+'.“ Der Ton ist plötzlich kühl. Der Ruf deiner Familie eilt dir voraus.',
   good?[['Stolz sein',()=>{add('gl',5);addRuf(2);return 'Der Name öffnet dir manche Tür.'}]]:[['Es ignorieren',()=>{add('gl',-2);return 'Du wirst beweisen, dass du anders bist.'}],['Den Namen verteidigen',()=>{addRuf(-1);return 'Ein kurzer Streit. Die Frau zuckt mit den Schultern.'}]],'Der Ruf deiner Familie')}}];
PEV2.forEach(s=>{QEV['sk_'+s.id]=()=>{try{return s.w()?s.ev():null}catch(e){errLog(e,s.id);return null}}});
function erbeYear(){if(!p||!p.parentPrev||p.prison)return;p.pev=p.pev||{};const C=PEV2.filter(s=>!p.pev[s.id]&&s.w());if(C.length&&ch(.25)){const s=pick(C);p.pev[s.id]=p.age;p.q.push({id:'sk_'+s.id})}}
{const _py=perkYear;perkYear=function(R0){_py(R0);try{fkChatYear()}catch(e){errLog(e,'fkchat')}try{erbeYear()}catch(e){errLog(e,'erbe')}}}
/* Familie > Eltern: Erinnerung an den verstorbenen Elternteil und das Erbstück */
{const _vf=viewFamilie;viewFamilie=function(){let h=_vf();try{if(famTab==='eltern'&&p.parentPrev){const P=p.parentPrev;
  const c='<section class="card"><h2 class="h">In Erinnerung</h2>'+row(esc(P.n),(P.g==='w'?'Deine Mutter':'Dein Vater')+' · '+P.a+' Jahre'+(P.job?' · '+esc(P.job):''),'')+(p.heirloom&&KEEP[p.heirloom]?row(KEEP[p.heirloom][0],'Dein Erbstück',keepIc(p.heirloom,36)):'')+'</section>';
  const i=h.indexOf('<section');h=i>=0?h.slice(0,i)+c+h.slice(i):h+c}}catch(e){errLog(e,'erinnerung')}return h}}
/* Passende Antworten auf Nachrichten von Freunden */
[['Bäcker','meme'],['zuletzt lacht','meme'],['Navi hat mich','meme'],['Schlüssel im Kühlschrank','meme'],['Wohnwagen gekauft','meme'],['Karaoke am Freitag','invite'],['Lust, mal wieder','invite'],['Spontan heute','invite'],['Laufen am Samstag','invite'],['Kommst du mit zum Bouldern','invite'],['Halbmarathon','invite'],['Ich hab eine Frage zum Leben','invite'],['Bist du dabei','invite'],
 ['Wie geht’s dir wirklich','how'],['Wie läuft es bei dir','how'],['unser altes Foto','share'],['Neuer Rekord','share'],['Ausstellung am Freitag','share'],['Oktopusse','share'],['Bild gemalt','share'],['Namen für meine Band','share'],['immer für dich da','comfort'],['so lange nicht gemeldet','sorry'],['das Buch gelesen','how']].forEach(x=>RPMAP.push(x));
