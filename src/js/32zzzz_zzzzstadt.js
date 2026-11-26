/* ================= Die Stadt erinnert sich: Orte tragen die Namen deiner Familie ================= */
function denkFor(P){const nm=P.first+' '+P.last,yr=(P.cy0!=null?P.cy0:null),R=[],msT=t=>(P.ms||[]).some(m=>t.test(m.t));
  const add=(n,kind,why)=>{if(R.length<2&&!R.some(x=>x.n===n))R.push({n,kind,who:nm,why,y:yr!=null?yr+P.age:null,gen:P.gen||1})};
  if(P.pol&&P.pol.lvl>=6)add(nm+'-Allee','Allee','Bundeskanzler'+(P.g==='w'?'in':''));
  if(P.pol&&P.pol.lvl>=2)add(nm+'-Platz','Platz',(P.g==='w'?'Bürgermeisterin':'Bürgermeister')+' dieser Stadt');
  if(P.biz&&(P.biz.firm||(P.biz.fronts||[]).length>=2))add(nm+'-Straße','Straße','Gründer'+(P.g==='w'?'in':'')+' von '+((P.biz.firm&&P.biz.firm.name)||(P.biz.co&&P.biz.co.name)||'einer Firma'));
  if(P.job&&P.job.id==='profi'||msT(/Profivertrag/))add(nm+'-Arena','Arena','Sportidol der Stadt');
  if(msT(/Lebensretter/)||(P.ruf||0)>=70)add(P.first+'-Brunnen','Brunnen','Ein Vorbild für alle');
  if((P.sm&&P.sm.fol>=1e5)||(P.ach&&P.ach.star))add(nm+'-Bühne','Bühne','Star aus dieser Stadt');
  const hero=(P.ms||[]).find(m=>/ rettet die Familie/.test(m.t));if(hero)add(hero.t.split(' rettet')[0]+'-Hundewiese','Hundewiese','Der Hund, der eine Familie rettete');
  if(P.age>=95)add(P.first+'s Bank im Stadtpark','Bank','Wurde '+P.age+' Jahre alt');
  return R}
/* Beim Tod: Orte benennen, Grab auf dem Friedhof */
{const _die=die;die=function(c){try{if(p&&!p.sb&&p.alive){p.denkNew=denkFor(p);p.denk=(p.denk||[]).concat(p.denkNew);calEns();p.ahnen=(p.ahnen||[]).concat([{n:p.first+' '+p.last,y0:p.cy0,y1:p.cy0+p.age,a:p.age,gen:p.gen||1}]);
  if(p.denkNew.length){try{news('Die Stadt ehrt '+p.first+' '+p.last+': '+p.denkNew.map(d=>d.n).join(' und '),'lokal')}catch(e){errLog(e)}}}}catch(e){errLog(e,'denk')}
  const r=_die.apply(this,arguments);try{if(ALB&&ALB.lives[0]&&p.denkNew&&p.denkNew.length){ALB.lives[0].denk=p.denkNew.map(d=>d.n);albSave()}}catch(e){errLog(e,'denk')}return r}}
{const _ca=continueAs;continueAs=function(i){const prev=p;const r=_ca.apply(this,arguments);try{if(p!==prev){p.denk=(prev.denk||[]).slice();p.ahnen=(prev.ahnen||[]).slice();p.denkSeen={};(prev.denkNew||[]).forEach(d=>log('Die Stadt hat den „'+d.n+'“ nach '+d.who+' benannt.'))}}catch(e){errLog(e,'denk')}return r}}
/* Nachfahren begegnen den Namen ihrer Familie */
QEV.denk_walk=n=>{const d=(p.denk||[]).find(x=>x.n===n);if(!d)return null;const rel=d.gen===(p.gen||1)-1?((d.who.split(' ')[0])+', '+(p.deadParent==='mama'?'deine Mutter':'dein Vater')):d.gen<(p.gen||1)-1?d.who+', '+(d.gen===(p.gen||1)-2?'deine Großmutter oder dein Großvater':'eine/r deiner Vorfahren'):d.who;
  return EC('Stadt','Ein vertrauter Name',(d.kind==='Bank'?'Im Stadtpark setzt du dich auf eine Bank. Ein kleines Schild: „'+d.n+'“.':'Ein Schild fällt dir ins Auge: „'+d.n+'“.')+' Darunter steht: „'+d.why+'“. Gemeint ist '+rel+'.',[
    ['Kurz stehen bleiben',()=>{add('gl',4);return 'Du bist stolz. Und ein bisschen traurig. Und vor allem stolz.'}],
    ['Den anderen davon erzählen',()=>{addRuf(1);add('gl',2);return 'Die Leute hören dir zu. „Ach, aus der Familie bist du!“'}]],'Erinnerung an '+d.who)};
{const _py=perkYear;perkYear=function(R0){_py(R0);try{if(!p||p.prison||p.age<8)return;p.denkSeen=p.denkSeen||{};const D=(p.denk||[]).filter(d=>!p.denkSeen[d.n]&&d.who!==p.first+' '+p.last);if(D.length&&ch(.3)){const d=pick(D);p.denkSeen[d.n]=p.age;p.q.push({id:'denk_walk',d:d.n})}
  if(p.pol&&p.pol.lvl>=2&&p.age>=60&&!p.ehrenb){p.ehrenb=1;mile('Ehrenbürger'+(p.g==='w'?'in':'')+' der Stadt','big');news(p.first+' '+p.last+' wird Ehrenbürger'+(p.g==='w'?'in':''),'lokal')}}catch(e){errLog(e,'denk')}}}
/* Stadt-App: Gedenkorte und Friedhof */
function denkCard(){const D=p.denk||[],A=p.ahnen||[];if(!D.length&&!A.length)return '';
  return '<section class="card dkc"><h2 class="h">Die Stadt erinnert sich</h2>'+(D.length?D.map(d=>row(esc(d.n),esc(d.why)+(d.y?' · seit '+d.y:''),'<span class="chip">'+esc(d.kind)+'</span>')).join(''):'<p class="note">Noch trägt kein Ort den Namen deiner Familie.</p>')+
    (A.length?'<h3 class="dkh">Friedhof am Lindenhain</h3>'+A.slice().reverse().map(a=>row(esc(a.n),(a.y0!=null?a.y0+' – '+a.y1+' · ':'')+a.a+' Jahre · Generation '+a.gen,'<span class="dkk" aria-hidden="true">✝</span>')).join(''):'')+'</section>'}
{const _vs=viewStadt;viewStadt=function(){let h=_vs();try{if(p&&!p.prison){const c=denkCard();if(c)h+=c}}catch(e){errLog(e,'denk')}return h}}
/* Gedenkorte als Schilder in der 3D-Stadt */
{const _pb=pinsBuild;pinsBuild=function(){try{if(typeof G!=='undefined'&&G&&G.L&&p){const D=(p.denk||[]).slice(-4);G.L.cells.forEach(c=>{if(c.dk){c.lm=null;c.dk=0}});
  const free=G.L.cells.filter(c=>!c.place&&!c.lm&&(c.zone==='G'||c.zone==='C'||c.zone==='R'));D.forEach((d,i)=>{const pool=free.filter(c=>!c.dk);if(!pool.length)return;const c=pool[hsh(d.n)%pool.length];c.lm=d.n;c.dk=1})}}catch(e){errLog(e,'denkpin')}return _pb.apply(this,arguments)}}
