/* ================= Sammlung: Freischaltbares für alle Leben ================= */
const UKEY='lebenslauf-sammlung';
let UL={};try{UL=JSON.parse(localStorage.getItem(UKEY)||'{}')}catch(e){errLog(e)}
const msHas=s=>(p.ms||[]).some(m=>m.t.startsWith(s));
const ULD={
 w_galaxie:['wall','Galaxie','Werde 80 Jahre alt.',()=>p.age>=80,'radial-gradient(circle at 30% 20%,#7A4BD6,#1B1240 45%,#05030F)'],
 w_geld:['wall','Geldregen','Werde Millionär/in.',()=>!!p.ach.mio,'linear-gradient(160deg,#1E7A3C,#0B3D20 55%,#C9A227)'],
 w_buehne:['wall','Bühnenlicht','Lande einen Hit in den Charts.',()=>!!(p.mus&&p.mus.hits),'linear-gradient(180deg,#2A0F3A,#7A2E5A 50%,#F2B33D)'],
 w_stadion:['wall','Flutlicht','Unterschreib einen Profivertrag.',()=>msHas('Profivertrag'),'linear-gradient(180deg,#0B1A3A,#1E7A3C 70%,#9AD36B)'],
 w_nacht:['wall','Großstadtnacht','Lebe in 3 verschiedenen Städten.',()=>p.stats&&p.stats.cities>=3,'linear-gradient(180deg,#0B1022,#2B2F6E 60%,#F28C28)'],
 w_herz:['wall','Herzklopfen','Heirate.',()=>!!p.ach.heirat,'linear-gradient(160deg,#FFB3C7,#E5527A 55%,#7A1F4A)'],
 o_gold:['outfit','Goldene Jacke','Erreiche 1 Million Follower.',()=>!!p.ach.star,'#C9A227'],
 o_trikot:['outfit','Nationaltrikot','Werde ins Nationalteam berufen.',()=>!!(p.spo&&p.spo.lvl>=4),'#E0E4EC'],
 o_talar:['outfit','Absolventen-Talar','Schließe ein Studium ab.',()=>!!p.ach.studium,'#1B1F2A'],
 o_leder:['outfit','Lederjacke','Werde Boss einer Gang.',()=>!!(p.gang&&p.gang.rank>=4),'#3A2A20'],
 o_amt:['outfit','Amtskette','Werde Bürgermeister/in.',()=>!!(p.pol&&p.pol.lvl>=2),'#2B59C3'],
 o_glitzer:['outfit','Glitzeranzug','Knack den Casino-Jackpot.',()=>!!p.ach.casino,'#B05BD6'],
 f_gold:['frame','Goldrahmen','Werde 100 Jahre alt.',()=>p.age>=100,'#C9A227'],
 f_regen:['frame','Regenbogen','Erreiche die dritte Generation.',()=>p.gen>=3,'linear-gradient(90deg,#E5407A,#F2B33D,#3BB273,#2B9ED8,#8E63D6)'],
 f_neon:['frame','Neon','Geh auf Klick viral.',()=>!!p.ach.viral,'#2BD1E6'],
 f_holz:['frame','Holz','Kauf dir ein Eigenheim.',()=>!!p.ach.haus,'#8E6E53'],
 m_party:['mel','Party','Erreiche 10.000 Follower.',()=>!!p.ach.micro],
 m_jazz:['mel','Jazz','Hab den Ruf „Vorbild“.',()=>p.ruf>=60],
 m_8bit:['mel','8-Bit','Gewinne in der Quizshow.',()=>msHas('Quizshow')],
 m_fanfare:['mel','Fanfare','Zieh in den Bundestag ein.',()=>!!(p.pol&&p.pol.lvl>=4)],
 t_legende:['title','Legende','Sammle 12 Erfolge in einem Leben.',()=>Object.keys(p.ach).length>=12],
 t_tycoon:['title','Tycoon','Bring eine Firma an die Börse.',()=>!!p.ach.ipo],
 t_pate:['title','Pate/Patin','Werde Boss einer Gang.',()=>!!(p.gang&&p.gang.rank>=4)],
 t_star:['title','Superstar','Erreiche 1 Million Follower.',()=>!!p.ach.star],
 t_held:['title','Held/in','Rette ein Leben.',()=>msHas('Lebensretter')],
 t_dynastie:['title','Dynastie','Erreiche die dritte Generation.',()=>p.gen>=3],
 t_minister:['title','Exzellenz','Werde Minister/in.',()=>!!(p.pol&&p.pol.lvl>=5)]};
const ULT={wall:'Hintergründe',outfit:'Exklusive Outfits',frame:'Handy-Rahmen',mel:'Geburtstagsmelodien',title:'Titel'};
Object.keys(ULD).forEach(k=>{const U=ULD[k];if(U[0]==='wall')WALLS.push([U[1],U[4],k]);if(U[0]==='outfit')OF[k]=[k,U[1],3,0,U[4]]});
Object.assign(SFX,{m_party:[[523,.08],[659,.08],[784,.08],[659,.08],[1047,.3]],m_jazz:[[392,.18],[466,.12],[523,.18],[622,.12],[587,.36]],m_8bit:[[1047,.06],[784,.06],[1047,.06],[1319,.06],[1568,.24]],m_fanfare:[[392,.14],[392,.08],[523,.14],[659,.14],[784,.4]]});
const wallOk0=wallOk;
function wallUsable(i){const w=WALLS[i];if(!w)return false;return w[2]?!!UL[w[2]]:wallOk0(i)}
function checkUnlocks(){if(!p)return;Object.keys(ULD).forEach(k=>{if(UL[k])return;let ok=false;try{ok=ULD[k][3]()}catch(e){errLog(e)}
  if(ok){UL[k]=1;try{localStorage.setItem(UKEY,JSON.stringify(UL))}catch(e){errLog(e)}p.newUL=(p.newUL||0)+1;log('Freigeschaltet für alle Leben: '+ULD[k][1]+' ('+ULT[ULD[k][0]]+').');toast('Freigeschaltet: '+ULD[k][1]);sfx('big');vib([40,30,40])}})}
const curTitle=()=>O.title&&UL[O.title]&&ULD[O.title]?ULD[O.title][1]:'';
const curFrame=()=>O.frame&&UL[O.frame]&&ULD[O.frame]?ULD[O.frame][4]:'';
let eTab='erfolge';
function viewSamml(){p.newUL=0;const n=Object.keys(ULD).length,got=Object.keys(ULD).filter(k=>UL[k]).length;
  let h='<section class="card"><div class="listseg"><h2 class="h" style="margin:0">Deine Sammlung</h2><span class="chip">'+got+' von '+n+'</span></div><div class="bar" style="margin:8px 0 4px"><i style="width:'+(got/n*100)+'%"></i></div><p class="note">Alles hier bleibt freigeschaltet, auch in jedem neuen Leben.</p></section>';
  Object.keys(ULT).forEach(t=>{h+='<h3 class="sec">'+ULT[t]+'</h3><div class="ulg">'+Object.keys(ULD).filter(k=>ULD[k][0]===t).map(k=>{const U=ULD[k],on=!!UL[k];
    const act=t==='wall'?O.wall===WALLS.findIndex(w=>w[2]===k):t==='outfit'?p.look&&p.look.o===k:t==='frame'?O.frame===k:t==='mel'?O.mel===k:O.title===k;
    const pv=t==='wall'?'<span class="ulpv" style="background:'+U[4]+'"></span>':t==='outfit'?'<span class="ulpv av">'+(on?avatarSvg(Math.max(p.age,14),52,null,{o:k,acc:[]}):'')+'</span>':t==='frame'?'<span class="ulpv fr" style="background:'+U[4]+'"><i></i></span>':t==='mel'?'<span class="ulpv mel"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></span>':'<span class="ulpv tt">'+esc(U[1])+'</span>';
    return '<div class="ul'+(on?'':' lock')+(act?' act':'')+'">'+pv+'<b>'+esc(U[1])+'</b><small>'+(on?'Freigeschaltet':esc(U[2]))+'</small>'+(on?'<div class="btns">'+(t==='mel'?btn('ulplay',k,'Anhören'):'')+btn('ulset',k,act?'Ablegen':'Benutzen',act?'g':'o')+'</div>':'<span class="ullock"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span>')+'</div>'}).join('')+'</div>'});
  return h}
function act6(id,arg){switch(id){
  case 'etab':eTab=arg;render();return 1;
  case 'ulplay':sfx(arg);return 1;
  case 'ulset':{const U=ULD[arg];if(!U||!UL[arg])return 1;const t=U[0];
    if(t==='wall'){const i=WALLS.findIndex(w=>w[2]===arg);O.wall=O.wall===i?0:i}
    else if(t==='outfit'){p.look=p.look||{o:null,acc:[]};if(p.look.o===arg)p.look.o=null;else{p.look.o=arg;if(!p.ward.includes(arg))p.ward.push(arg)}save()}
    else if(t==='frame')O.frame=O.frame===arg?null:arg;else if(t==='mel'){O.mel=O.mel===arg?null:arg;if(O.mel)sfx(arg)}else if(t==='title')O.title=O.title===arg?null:arg;
    saveO();render();return 1}
  }return 0}

