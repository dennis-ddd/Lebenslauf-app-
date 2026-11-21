/* ================= Spielablauf im laufenden Spiel ================= */
function cfgCard(){const c=cfg(),ch2=(a,list,cur)=>'<div class="schips">'+list.map(([v,l])=>'<button class="sch" data-a="'+a+'" data-g="'+v+'" aria-pressed="'+(String(cur)===String(v))+'"><b>'+l+'</b></button>').join('')+'</div>';
  return '<section class="card sc"><h2 class="h">Spielablauf</h2><div class="sl">Aktionen pro Jahr</div>'+ch2('cfgact',[[3,'3'],[4,'4'],[6,'6'],[9,'9'],[12,'12'],[18,'18'],[0,'∞']],c.act)+
    '<div class="tgs">'+tog2('cfgclock',c.clock,'Tagesuhr','Jede Aktion kostet Zeit, um 3 Uhr ist Schluss')+'</div><div class="sl">Zufallsereignisse</div>'+ch2('cfgev',[['oft','Oft'],['normal','Normal'],['selten','Selten'],['aus','Aus']],c.ev)+
    '<div class="tgs">'+tog2('cfgbig',c.big!==false,'Großereignisse','Seltene Eilmeldungen')+'</div><p class="note">Mehr Aktionen gelten sofort, weniger ab dem nächsten Jahr.</p></section>'+
    '<section class="card sc"><h2 class="h">Hilfe</h2><div class="tgs">'+tog2('tuttog',O.tut!==false,'Tipps zu den Apps','Beim ersten Öffnen einer App erscheint ein kurzer Hinweis')+'</div><div class="btns">'+btn('tutshow',null,'Tutorial ansehen','o')+btn('tipreset',null,'Alle Tipps erneut zeigen')+'</div></section>'}
const tog2=(a,on,l,s)=>'<button class="tg" data-a="'+a+'" aria-pressed="'+!!on+'"><span><b>'+l+'</b><small>'+s+'</small></span><i></i></button>';
function act7(id,arg){switch(id){
  case 'tipok':O.seenTips=O.seenTips||{};O.seenTips[arg]=1;saveO();render();return 1;
  case 'tipoff':O.tut=false;saveO();toast('Tipps ausgeschaltet. Du kannst sie in den Einstellungen wieder anschalten.');render();return 1;
  case 'tuttog':O.tut=O.tut===false;saveO();render();return 1;
  case 'tutshow':showTut(0);return 1;
  case 'tipreset':O.seenTips={};O.tut=true;saveO();toast('Alle Tipps werden wieder angezeigt.');render();return 1;
  case 'cfgact':{const c=cfg(),n=+arg,old=actBase();c.act=n;p.cfg=c;const nb=actBase();if(nb>old&&(!clockOn()||p.clock<DAYEND-10))p.act=n?Math.min(nb,p.act+(nb-old)):999;else if(!n)p.act=999;save();render();return 1}
  case 'cfgclock':{const c=cfg();c.clock=!c.clock;p.cfg=c;if(c.clock&&p.clock==null)p.clock=DAYSTART;if(!c.clock&&p.act<=0&&unl())p.act=999;save();render();return 1}
  case 'cfgev':{const c=cfg();c.ev=arg;p.cfg=c;save();render();return 1}
  case 'cfgbig':{const c=cfg();c.big=c.big===false;p.cfg=c;save();render();return 1}
  }return 0}

