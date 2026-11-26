/* ================= Schmetterlingskarte: Wie deine Entscheidungen zusammenhängen ================= */
/* Auch ältere Spätfolgen schreiben jetzt auf, woher sie kommen */
const LATERLBL={zeuge:'Als Zeug/in ausgesagt',schweige:'Schweigegeld genommen',startup:'In ein Start-up investiert',kollege:'Kollegen ausgestochen',alibi:'Einen Freund gedeckt',boerse2:'Gefundene Börse behalten',boerse:'Gefundene Börse zurückgegeben',
  plagiat:'Abgeschrieben',liebe:'Eine Liebe auf Distanz',fit:'Sport oder Party gewählt',nachbar:'Dem Nachbarn geholfen',kumpel:'Geld geliehen und vergessen',fkzurueck:'Einem Freund Geld geliehen',pol_skandal:'Den Umschlag angenommen'};
Object.keys(LATER).forEach(k=>{const L=LATER[k];if(!L||typeof L.f!=='function'||L._lb)return;const f=L.f;L.f=function(d){const e=f.apply(this,arguments);if(e&&!e.back&&LATERLBL[k])return Object.assign({},e,{back:'Damals: '+LATERLBL[k]});return e};L._lb=1});
const TBACK={'Ein bekanntes Gesicht':'Aus deiner Schulzeit','Klassentreffen':'Deine alte Klasse'};
{const _se=showEvent0;showEvent0=function(e){if(e&&e.o&&!e.back&&TBACK[e.t])e=Object.assign({},e,{back:TBACK[e.t]});return _se(e)}}
/* Ketten bauen: Entscheidung → was daraus wurde → was danach kam */
const bfOpen=()=>!!p&&(p.skfl||[]).length>0&&p.age>=25;
function bfChains(){const F=(p.skfl||[]).slice(-6),M=(p.ms||[]).filter(m=>(m.k==='big'||m.k==='star')&&!/Erste Schritte|Zeitraffer/.test(m.t));
  return F.map(f=>{const dec=String(f.back||'').replace(/^(Mit \d+: |Damals: |Damals )/,'');const am=(String(f.back||'').match(/^Mit (\d+):/)||[])[1];const next=M.find(m=>m.a>=f.a&&m.a<=f.a+6&&m.t!==f.t);
    return {dec:dec||'Eine Entscheidung',da:am!=null?+am:null,res:f.t,ra:f.a,nx:next?next.t:null,na:next?next.a:null}})}
const bfWrap=(t,n)=>{const w=String(t).split(' '),L=[];let c='';w.forEach(x=>{if((c+' '+x).trim().length>n){if(c)L.push(c);c=x}else c=(c+' '+x).trim()});if(c)L.push(c);return L.slice(0,3)};
function bfSvg(){const C=bfChains();if(!C.length)return '';const rh=92,W=340,H=C.length*rh+70;let s='<svg class="bfsvg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Schmetterlingskarte deiner Entscheidungen"><defs><marker id="bfa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#F0CC87"/></marker></defs>';
  const box=(x,y,w,t,sub,col)=>{const L=bfWrap(t,15);return '<g><rect x="'+x+'" y="'+y+'" width="'+w+'" height="66" rx="12" fill="'+col+'" fill-opacity=".18" stroke="'+col+'" stroke-opacity=".7"/>'+(sub?'<text x="'+(x+10)+'" y="'+(y+15)+'" font-size="9.5" fill="'+col+'" font-weight="700">'+esc(sub)+'</text>':'')+L.map((l,i)=>'<text x="'+(x+10)+'" y="'+(y+(sub?31:24)+i*13)+'" font-size="11" fill="#F6F2FF">'+esc(l)+'</text>').join('')+'</g>'};
  C.forEach((c,i)=>{const y=10+i*rh;s+=box(4,y,104,c.dec,c.da!=null?'Mit '+c.da:'Damals','#B49CFF')+'<path d="M110 '+(y+33)+'H120" stroke="#F0CC87" stroke-width="2" marker-end="url(#bfa)"/>'+box(122,y,104,c.res,'Mit '+c.ra,'#F0CC87');
    if(c.nx)s+='<path d="M228 '+(y+33)+'H238" stroke="#F0CC87" stroke-width="2" marker-end="url(#bfa)"/>'+box(240,y,96,c.nx,'Mit '+c.na,'#7BE3AE');
    if(i<C.length-1)s+='<path d="M170 '+(y+68)+'v'+(rh-70)+'" stroke="rgba(255,255,255,.18)" stroke-dasharray="3 4"/>'});
  const y=10+C.length*rh;const now=p.pension?'Im Ruhestand':p.job?p.job.t:(p.school?'In der Schule':'Auf der Suche');
  s+='<path d="M170 '+(y-24)+'v14" stroke="#F0CC87" stroke-width="2" marker-end="url(#bfa)"/><rect x="95" y="'+(y-8)+'" width="150" height="44" rx="22" fill="#F0CC87"/><text x="170" y="'+(y+10)+'" text-anchor="middle" font-size="11" font-weight="700" fill="#1B1240">Heute, mit '+p.age+'</text><text x="170" y="'+(y+25)+'" text-anchor="middle" font-size="10.5" fill="#1B1240">'+esc(now)+'</text></svg>';
  return s}
function bfCard(){if(!p)return '';if(!bfOpen()){const n=(p.skfl||[]).length;return '<section class="card bfc lock"><div class="listseg"><b>Warum bin ich heute hier?</b><span class="chip">Gesperrt</span></div><p class="note">Die Schmetterlingskarte öffnet sich, sobald '+(n?'du 25 bist':'die erste Entscheidung von früher zu dir zurückkommt')+'.</p></section>'}
  if(!p.bfSeen){p.bfSeen=1;try{toast('Neu: Die Schmetterlingskarte zeigt, wie dein Leben zusammenhängt.')}catch(e){errLog(e)}}
  return '<section class="card bfc"><h2 class="h">Warum bin ich heute hier?</h2><p class="note">Deine Schmetterlingskarte: Entscheidungen, was daraus wurde, und was danach kam.</p><div class="bfl"><span style="--c:#B49CFF">Entscheidung</span><span style="--c:#F0CC87">Folge</span><span style="--c:#7BE3AE">Danach</span></div>'+bfSvg()+'</section>'}
{const _vl=viewLeben;viewLeben=function(){const h=_vl();if(lTab!=='lauf')return h;try{const i=h.indexOf('<section');const c=bfCard();return i>=0?h.slice(0,i)+c+h.slice(i):h+c}catch(e){errLog(e,'karte');return h}}}
/* Freischaltung ankündigen */
{const _py=perkYear;perkYear=function(R0){_py(R0);try{if(p&&bfOpen()&&!p.bfAnn){p.bfAnn=1;mile('Schmetterlingskarte freigeschaltet','star');log('Unter Leben > Lebenslauf siehst du jetzt, wie deine Entscheidungen zusammenhängen.')}}catch(e){errLog(e,'bf')}}}
