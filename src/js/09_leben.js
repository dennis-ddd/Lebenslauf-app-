/* ================= Leben: Fähigkeiten, Ziele ================= */
const SKN={form:['Form','Sport, Studio, Verein'],kampf:['Kampf','Boxclub, Selbstverteidigung'],fahren:['Fahren','Fahrsicherheitstraining, Straßenrennen'],schloss:['Schlösser','Übungsschlösser'],hack:['Hacken','Programmierkurs, Informatik'],charme:['Charme','Rhetorikkurs, Butler, Partys']};
const STATHELP={gl:'Glück steigt durch Freizeit, Freunde, Familie, ein schönes Zuhause, Komfort, Personal und Erfolge. Schulden, Krankheit, Streit und Gefängnis drücken es.',ge:'Gesundheit steigt durch Sport, gute Ernährung, Vorsorge und Behandlungen in der Klinik. Alter, Fast Food, Partys und unbehandelte Krankheiten senken sie.',in:'Intelligenz steigt durch Schule, Lernen, Lesen, Studium und Kurse.',au:'Aussehen steigt durch Training, Kleidung mit Stil, gute Haut und Behandlungen. Mit dem Alter sinkt es langsam.'};
const GOALS=[['abschluss','Einen Schulabschluss machen',()=>RANK[p.edu]>=1,500],['job','Den ersten Job bekommen',()=>!!p.ach.job,500],['studium','Ein Studium abschließen',()=>!!p.deg,3000],
['liebe','Heiraten',()=>!!(p.partner&&p.partner.mar),2000],['kind','Ein Kind bekommen',()=>p.kids.length>0,2000],['haus','Eine eigene Immobilie kaufen',()=>p.owned.length>0,5000],
['firma','Eine Firma gründen',()=>!!(p.biz&&p.biz.firm),5000],['k100','100.000 € Vermögen',()=>netWorth()>=1e5,5000],['mio','Millionär/in werden',()=>netWorth()>=1e6,25000],
['marathon','Einen Marathon laufen',()=>!!p.marathon,3000],['fol','10.000 Follower auf Klick',()=>!!(p.sm&&p.sm.fol>=1e4),3000],['welt','Eine Weltreise machen',()=>!!p.welt,0],['alt','80 Jahre alt werden',()=>p.age>=80,0]];
function checkGoals(){if(!p.goals)return;GOALS.forEach(([k,n,f,rw])=>{if(!p.goals[k]&&f()){p.goals[k]=p.age;if(rw)p.money+=rw;add('gl',5);log('Lebensziel erreicht: '+n+(rw?' (+'+eur(rw)+')':'')+'.');toast('Ziel erreicht: '+n)}})}
const skinTxt=s=>s>=85?'Makellos':s>=65?'Gut':s>=40?'Unrein':'Schlecht';
function stars(n){return '<span class="stars">'+[0,1,2,3,4].map(i=>'<i class="'+(i<n?'on':'')+'">★</i>').join('')+'</span>'}
function viewLeben(){ensureEcon();
  let h='<div class="seg full lt">'+[['ich','Ich'],['ziele','Ziele'],['lauf','Lebenslauf']].concat(O.rival&&p.rival?[['rival','Rivale']]:[]).map(([k,l])=>'<button data-a="ltab" data-g="'+k+'" aria-pressed="'+(lTab===k)+'">'+l+'</button>').join('')+'</div>';
  if(lTab==='ich'){
    h+='<section class="card me"><span class="meav">'+avatarSvg(p.age,112)+'</span><div><small>'+STAGE_N[stageOf(p.age)].toUpperCase()+'</small><b>'+esc(p.first+' '+p.last)+'</b><small>'+p.age+' Jahre · Stil '+stil()+' von 8</small>'+(stageOf(p.age)<7?'<small>Neuer Look mit '+STAGES[stageOf(p.age)+1]+' Jahren</small>':'')+'<div class="btns">'+btn('goshop',null,'Aussehen ändern','g')+'</div></div></section>';
    h+='<section class="card">'+Object.keys(STAT).map(k=>'<button class="stat sb" data-a="stathelp" data-g="'+k+'"><div class="r"><span>'+STAT[k]+'</span><span>'+p.st[k]+' %</span></div><div class="bar"><i class="'+(p.st[k]<30?'low':'')+'" style="width:'+p.st[k]+'%"></i></div></button>').join('')+'<p class="note" style="margin-top:6px">Tippe auf einen Wert, dann siehst du, wie du ihn steigerst.</p>'+
      '<div class="listseg" style="margin-top:10px"><span style="font-weight:800">Fahndung</span>'+stars(p.wanted)+'</div></section>';
    h+='<section class="card"><div class="fh"><span class="fic sm" style="background:'+(p.skinS>=65?'linear-gradient(135deg,#3BB273,#1E9E6A)':'linear-gradient(135deg,#F2B33D,#F08A24)')+'"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg></span><div><b>Haut: '+skinTxt(p.skinS)+'</b><small>Ernährung, Sport, Partynächte und Alter zeigen sich im Gesicht. Hilfe gibt es beim Hautarzt.</small></div></div></section>';
    h+='<section class="card"><h2 class="h">Fähigkeiten</h2>'+Object.keys(SKN).map(k=>'<div class="stat"><div class="r"><span>'+SKN[k][0]+'</span><span>'+Math.round(p.sk[k])+'</span></div><div class="bar"><i style="width:'+p.sk[k]+'%;background:#8E63D6"></i></div><small class="note">'+SKN[k][1]+'</small></div>').join('')+'</section>';
    const ill=Object.keys(p.ill);if(ill.length)h+=card('Gesundheit',ill.map(k=>row(ILLS[k].n,'seit '+p.ill[k].y+' Jahr(en)',btn('goto','freizeit','Behandeln','o'))).join(''));
    h+='<section class="card"><h2 class="h">Kampf und Schutz</h2>'+row('Pfefferspray',p.items.includes('pfeffer')?'Schützt dich bei Überfällen':'Hilft bei Überfällen auf der Straße · '+eur(px$(25)),p.items.includes('pfeffer')?'<span class="chip">Besitz</span>':btn('buypf',null,'Kaufen','',p.money<px$(25)||p.age<14))+
      row('Bodyguard',p.staff.guard?'Arbeitet für dich':'Gibt es in der App Wohnen unter Personal','')+'</section>';
  }
  if(lTab==='ziele'){const done=GOALS.filter(g=>p.goals[g[0]]).length;
    h+='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Lebensziele</h2><span class="chip">'+done+' von '+GOALS.length+'</span></div><div class="bar" style="margin:8px 0 4px"><i style="width:'+(done/GOALS.length*100)+'%"></i></div>'+
      GOALS.map(([k,n,f,rw])=>'<div class="goal'+(p.goals[k]?' done':'')+'"><span class="gk">'+(p.goals[k]?'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12l5 5 9-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>':'')+'</span><span class="gt"><b>'+n+'</b><small>'+(p.goals[k]?'geschafft mit '+p.goals[k]:rw?'Belohnung '+eur(rw)+' und Glück':'Belohnung: Glück')+'</small></span></div>').join('')+'</section>';
  }
  if(lTab==='rival')h+=viewRival();if(lTab==='ich')h+=rufCard();if(lTab==='lauf')h+=milesCard()+card('',statBars())+card('Dein Lebenslauf','<div class="log">'+p.log.slice(-80).reverse().map(e=>'<div><span>Alter '+e.a+'</span><span>'+esc(e.t)+'</span></div>').join('')+'</div>');
  return h;
}

