/* ================= Lebendige Stadt: Entwicklung, Läden, Viertel, eigene Gebäude, Vollbild, Grafikqualität ================= */
const SHOPN=[['Café','Morgenrot','Kaffeeklatsch','Bohne & Co'],['Bäckerei','Kornblume','Brotzeit','Goldkruste'],['Buchladen','Seitenwind','Leseratte','Eselsohr'],['Boutique','Fadenlauf','Lieblingsstück','Kleiderliebe'],
  ['Eisdiele','Venezia','Dolomiti','Kugelrund'],['Sushi-Bar','Kaito','Nori','Wasabi'],['Blumenladen','Blütezeit','Löwenzahn','Mohnblume'],['Fahrradladen','Kettenblatt','Speiche','Rückenwind'],['Spieleladen','Würfelglück','Meeple','Joystick'],['Bioladen','Grünkern','Erdreich','Feldfrisch'],['Burgerladen','Patty','Grillmeister','Bun & Butter'],['Plattenladen','Rille','Vinyl','B-Seite']];
function cityS(){const s=p.cityS||(p.cityS={dev:0,dw:{},shops:{},bau:null,bauY:null,fest:null,ms:{}});s.dw=s.dw||{};s.shops=s.shops||{};s.ms=s.ms||{};return s}
const distW=d=>p&&p.cityS&&p.cityS.dw?(p.cityS.dw[d]||0):0;
const HZ={villa:'V',hausboot:'W',loft:'H',penthouse:'C'};
function ownList(){const L=[];if(!p)return L;const b=p.biz;
  if(b){(b.fronts||[]).forEach(k=>FR[k]&&L.push({id:'f_'+k,n:FR[k].n,app:'geschaefte',kind:'biz',z:'BCR'}));
    if(b.shop)L.push({id:'shop',n:b.shop.name||'Dein Laden',app:'geschaefte',kind:'biz',z:'BC'});
    if(b.firm)L.push({id:'firm',n:b.firm.name||b.firm.n||'Deine Firma',app:'geschaefte',kind:'biz',z:'C'});
    if(b.bank)L.push({id:'bank',n:b.bank.name||'Deine Bank',app:'geschaefte',kind:'biz',z:'C'})}
  (p.props||[]).forEach(pr=>{if(!PT[pr.t]||PT[pr.t].land)return;L.push({id:'p'+pr.id,n:propName(pr),app:'wohnen',kind:'prop',dist:pr.d,z:['CB','VW','R','R','HI','R'][pr.d]||'R'})});
  return L}
function cityOpts(){if(!p)return {key:''};const s=cityS(),own=ownList(),closed=Object.keys(s.shops).filter(k=>!s.shops[k].open).map(Number).sort((a,b)=>a-b);
  const dw={};Object.keys(s.dw).forEach(k=>dw[k]=Math.round(s.dw[k]*2)/2);
  const o={hz:HZ[p.home]||'R',own,dw,closed,tram:s.dev>=3,tower:s.dev>=6,bau:s.bau,fest:s.fest===p.age};
  o.key=[o.hz,own.map(x=>x.id).join(','),JSON.stringify(dw),closed.join(','),o.tram?1:0,o.tower?1:0,o.bau,o.fest?1:0].join('|');return o}
function shopCells(){const L=layout(p.seed,{hz:HZ[p.home]||'R'});return L.cells.map((c,i)=>[c,i]).filter(([c])=>!c.place&&(c.zone==='B'||c.zone==='W')).map(x=>x[1])}
function shopName(r){const S=SHOPN[Math.floor(r()*SHOPN.length)];return S[0]+' '+S[1+Math.floor(r()*3)]}
/* Jährlicher Stadtwandel */
function cityYear(){if(!p||p.age<1)return;const s=cityS(),ph=typeof ecoPh==='function'?ecoPh():'normal',boom=ph==='boom',bad=ph==='rezession'||ph==='krise'||ph==='pandemie',r=rng(p.seed*97+p.age);
  if(!s.init){s.init=1;shopCells().forEach(i=>{s.shops[i]={n:shopName(r),open:r()>.12,y:p.age}})}
  const d0=s.dev;if(boom||r()<.45)s.dev++;if(bad&&r()<.35)s.dev=Math.max(0,s.dev-1);
  const M=[[3,'tram','Neue Straßenbahnlinie eröffnet','Ab sofort fährt eine Straßenbahn quer durch die Innenstadt.'],[6,'tower','Neuer Stadtturm fertig','Das höchste Gebäude der Stadt prägt jetzt die Skyline.'],[9,'park','Stadtpark wird neu gestaltet','Neue Wege, ein Brunnen und mehr Bänke.']];
  M.forEach(([n,k,t,x])=>{if(s.dev>=n&&!s.ms[k]){s.ms[k]=p.age;if(p.age>=8){news(t,'lokal',x);log('Stadt: '+t+'.')}}});
  // Viertel werden beliebter oder rutschen ab
  for(let d=0;d<DIST.length;d++){const o=s.dw[d]||0;let n=o+(r()-.5)*.3+(boom?.08:bad?-.1:0)-o*.12;n=clamp(Math.round(n*100)/100,-1,1);s.dw[d]=n;
    if(p.age>=14){if(o<.5&&n>=.5)news(DIST[d][0]+' wird immer beliebter','lokal','Neue Cafés, sanierte Häuser, steigende Mieten. Wer hier Immobilien hat, freut sich.');
      else if(o>-.5&&n<=-.5)news(DIST[d][0]+' kämpft mit Leerstand','lokal','Immer mehr Läden schließen, die Mieten sinken.')}}
  // Läden schließen und eröffnen
  let nn=0;Object.keys(s.shops).forEach(i=>{const sh=s.shops[i];if(sh.open){if(r()<(bad?.18:boom?.04:.08)){sh.open=false;sh.y=p.age;if(p.age>=10&&nn++<2)news('Aus für '+sh.n,'lokal','Nach '+Math.max(1,p.age-(sh.since||p.age-3))+' Jahren schließt der Laden. Im Schaufenster hängt jetzt „Zu vermieten“.')}}
    else if(r()<(boom?.5:bad?.15:.32)){sh.n=shopName(r);sh.open=true;sh.y=p.age;sh.since=p.age;if(p.age>=10&&nn++<2)news('Neueröffnung: '+sh.n,'lokal','Zur Eröffnung gibt es Rabatt. Die Schlange reicht bis zur Ecke.')}});
  // Baustelle und Stadtfest
  if(s.bau!=null&&p.age-s.bauY>=2){s.bau=null;if(p.age>=10)news('Baustelle in der Innenstadt beendet','lokal','Endlich wieder freie Fahrt.')}
  if(s.bau==null&&s.dev>d0&&r()<.35){const L=layout(p.seed,{hz:HZ[p.home]||'R'}),C=L.cells.map((c,i)=>[c,i]).filter(([c])=>!c.place&&(c.zone==='C'||c.zone==='B'));if(C.length){s.bau=C[Math.floor(r()*C.length)][1];s.bauY=p.age;if(p.age>=10)news('Großbaustelle in der Stadt','lokal','Kräne, Lärm und Umleitungen: Hier entsteht etwas Neues.')}}
  if(r()<.35){s.fest=p.age;if(p.age>=4)news('Stadtfest im Stadtpark','lokal','Live-Musik, Essensstände und Lichterketten bis spät in die Nacht.')}}
{const _py=perkYear;perkYear=function(R0){_py(R0);try{cityYear()}catch(e){errLog(e)}}}
/* Karten-Pins: Orte, eigene Gebäude und Wahrzeichen */
const OWNSVG='<svg class="pinsv" viewBox="0 0 24 32" aria-hidden="true"><path d="M12 31s10-11.2 10-19A10 10 0 0 0 2 12c0 7.8 10 19 10 19z"/><path d="M8 9l4-3 4 3v6H8z" fill="#fff" stroke="none"/></svg>';
pinsBuild=function(){const el=document.getElementById('pins');if(!el||!G||!G.L)return;const ppl=peopleAt();let h='';
  G.L.cells.forEach((c,i)=>{if(c.place){const P=PL[c.place],pp=ppl[c.place]||[],home=c.place==='home';
      h+='<button class="pinm'+(home?' home':'')+(sel===c.place?' on':'')+'" data-a="sel" data-g="'+c.place+'" data-ci="'+i+'" aria-label="'+esc(P.n)+'">'+
        (pp.length?'<span class="ppl">'+pp.map(x=>'<i title="'+esc(x.n)+'">'+npcAv(x.n,x.g,x.a,26)+'</i>').join('')+'</span>':'')+'<span class="plb">'+(home?'Zuhause':esc(P.n))+'</span>'+PINSVG+'</button>'}
    (c.own||[]).forEach(o=>{h+='<button class="pinm own" data-a="goto" data-g="'+o.app+'" data-ci="'+i+'" data-li="'+o.li+'" aria-label="'+esc(o.n)+'"><span class="plb">'+esc(o.n)+'</span>'+OWNSVG+'</button>'});
    if(c.lm)h+='<span class="pinm lm" data-ci="'+i+'"><span class="plb">'+c.lm+'</span></span>'});
  if(el.dataset.h!==h){el.innerHTML=h;el.dataset.h=h;el._w=null;G.ck=null}};
pinsProject=function(){const el=document.getElementById('pins');if(!el||!G||!G.L||!el.children.length)return;const w=el.clientWidth,hh=el.clientHeight;
  const v=(_pv.v=_pv.v||new THREE.Vector3()),L=[],LW=G.L.W;
  for(const b of el.children){const c=G.L.cells[+b.dataset.ci];if(!c)continue;let x0=c.x,z0=c.z,top=c.top||Math.max(2,...c.lots.map(l=>l.h));
    if(b.dataset.li!=null){const l=c.lots[+b.dataset.li];if(l){const q=LW(l.x,l.z);x0=q[0];z0=q[1];top=.44+l.h+2.6}}
    v.set(x0,top+.6,z0).project(G.cam);const x=(v.x+1)/2*w,y=(1-v.y)/2*hh,vis=v.z<1&&x>-40&&x<w+40&&y>-10&&y<hh+60;b.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';b.style.display=vis?'':'none';
    if(vis)L.push({b,x,y,pr:(b.classList.contains('on')?4:0)+(b.classList.contains('home')?3:0)+(b.classList.contains('own')?2:0)+(b.querySelector('.ppl')?1:0)-(b.classList.contains('lm')?1:0)})}
  L.sort((a,b)=>b.pr-a.pr||a.y-b.y);const R=[];const far=G.dist>95;
  L.forEach(o=>{const lb=o.b.querySelector('.plb');if(!lb)return;if(far&&o.pr<1){o.b.classList.add('nolbl');return}const lw=(lb._w=lb._w||lb.offsetWidth||80),r=[o.x-lw/2,o.y-58,o.x+lw/2,o.y-38];
    const hit=R.some(q=>r[0]<q[2]+4&&r[2]>q[0]-4&&r[1]<q[3]+2&&r[3]>q[1]-2);o.b.classList.toggle('nolbl',hit);if(!hit)R.push(r)});
  const ct=document.getElementById('ctime');if(ct){const h=cityHour(),n=G.nk>.5;const s=(n?'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>':'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5"/></svg>')+
    '<span>'+(h==null?(n?'Nacht':'Tag'):phaseOf(h)+' · <b>'+clockTxt()+'</b>')+'</span>';if(ct._s!==s){ct.innerHTML=s;ct._s=s}}};
{const _cm=cevMarkers;cevMarkers=function(){_cm();if(G)G.ck=null}}
/* Vollbild-Knopf: Ort schließen und Stadt wieder groß, sonst Vollbild an/aus */
const FSI='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',FSO='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
function cityFullBtn(){const b=document.getElementById('cfull');if(!b)return;const bd=document.body,full=bd.classList.contains('cityfull'),po=bd.classList.contains('placeopen');
  b.innerHTML=full?FSO:FSI;b.setAttribute('aria-label',po?'Stadt wieder groß zeigen':full?'Vollbild verlassen':'Stadt im Vollbild');b.classList.toggle('hl',po)}
{const _bs=buildShell;buildShell=function(){_bs();if(typeof document.querySelector!=='function')return;const cw=document.getElementById('city');if(cw&&!document.getElementById('cfull')){const r=document.createElement('div');r.className='rot rtop';cw.appendChild(r);const b=document.createElement('button');b.id='cfull';b.innerHTML=FSI;r.appendChild(b);
  b.onclick=()=>{const bd=document.body;if(bd.classList.contains('placeopen')){sel=null;bd.classList.add('cityfull');render()}else{bd.classList.toggle('cityfull');cityFullBtn();if(G)setTimeout(sizeThree,30)}}}}}
{const _r=render;render=function(){_r();try{const bd=document.body;if(bd&&bd.classList){if(tab!=='stadt'||!p||!p.alive)bd.classList.remove('cityfull');if(bd.classList.contains('placeopen'))bd.classList.remove('cityfull');cityFullBtn()}}catch(e){errLog(e)}}}
/* Grafikqualität in den Einstellungen */
{const _ve=viewEinst;viewEinst=function(){const cur=O.gfx||'auto',auto=G?G.qn:gfxQ();return _ve()+'<section class="card tgs"><h2 class="h">Grafik der Stadt</h2><div class="seg full">'+[['auto','Automatisch'],['low','Niedrig'],['mid','Mittel'],['high','Hoch']].map(([k,l])=>'<button data-a="gfx" data-g="'+k+'" aria-pressed="'+(cur===k)+'">'+l+'</button>').join('')+'</div>'+
  '<p class="note">'+(cur==='auto'?'Gerade aktiv: '+({low:'Niedrig',mid:'Mittel',high:'Hoch'}[auto]||'Mittel')+'. Ruckelt die Stadt, schaltet das Spiel selbst eine Stufe herunter.':'Niedrig spart Akku, Hoch zeigt Schatten und mehr Leben auf den Straßen.')+'</p></section>'}}
{const f=act;act=function(id,arg){if(id==='gfx'&&['auto','low','mid','high'].includes(arg)){O.gfx=arg;O.gfxA=null;saveO();if(G)cityReinit();toast('Grafik: '+({auto:'Automatisch',low:'Niedrig',mid:'Mittel',high:'Hoch'}[arg]));render();return}
  if(id==='sel'||id==='mode')document.body.classList.remove('cityfull');return f(id,arg)}}
/* Stadtleben-Karte in der Stadt-App */
{const _vs=viewStadt;viewStadt=function(){let h=_vs();if(!p||p.prison)return h;const s=cityS(),own=ownList();
  const sh=Object.values(s.shops),open=sh.filter(x=>x.open).length,neu=sh.filter(x=>x.open&&x.y===p.age),zu=sh.filter(x=>!x.open&&x.y===p.age);
  const tr=v=>v>=.5?'<span class="chip up">beliebt</span>':v<=-.5?'<span class="chip down">Leerstand</span>':v>.15?'<span class="chip up">im Kommen</span>':v<-.15?'<span class="chip down">schwächelt</span>':'<span class="chip">stabil</span>';
  const ms=[['Straßenbahn',3,'tram'],['Stadtturm',6,'tower'],['Neuer Stadtpark',9,'park']];
  let c='<div class="mrow"><span>Ausbau der Stadt</span><b>Stufe '+s.dev+'</b></div>'+ms.map(([n,lv,k])=>'<div class="mrow"><span>'+n+'</span><b>'+(s.ms[k]?'eröffnet':'ab Stufe '+lv)+'</b></div>').join('')+
    '<div class="mrow"><span>Läden geöffnet</span><b>'+open+' von '+sh.length+'</b></div>'+(neu.length?'<p class="note">Neu: '+neu.map(x=>esc(x.n)).join(', ')+'</p>':'')+(zu.length?'<p class="note">Geschlossen: '+zu.map(x=>esc(x.n)).join(', ')+'</p>':'');
  h+=card('Stadtleben',c);
  h+=card('Viertel',DIST.map((d,i)=>row(d[0],'',tr(s.dw[i]||0))).join('')+'<p class="note">Beliebte Viertel steigern den Wert deiner Immobilien, Leerstand drückt ihn.</p>');
  if(own.length)h+=card('Deine Gebäude in der Stadt',own.map(o=>row(esc(o.n),o.kind==='prop'?'Immobilie · '+DIST[o.dist][0]:'Unternehmen','<button class="btn g sm" data-a="goto" data-g="'+o.app+'">Öffnen</button>')).join('')+'<p class="note">Auf der Karte erkennst du sie am goldenen Dach und der Fahne.</p>');
  return h}}
