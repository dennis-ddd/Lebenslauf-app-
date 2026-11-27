/* ================= Bewährungsprobe: Minispiel mit Einsatz =================
   Einmal im Jahr, 1 Aktion. Du setzt Geld, Glück oder Ruf und spielst das Minispiel deines Berufs.
   2 von 3 richtig: Einsatz zurück plus Gewinn in gleicher Höhe, Leistung +12, eine Empfehlung.
   Danach „Doppelt oder nichts“: 3 von 3 nötig. Gewinn verdoppelt, oder alles weg.
   Empfehlungen erhöhen am Jahresende die Chance auf eine Beförderung (zusätzlich zur normalen). */
const STAKE={geld:{n:'Geld',ic:'€'},gl:{n:'Glück',ic:'Glück'},ruf:{n:'Ruf',ic:'Ruf'}};
const stkAmt=k=>k==='geld'?Math.max(px$(300),Math.round((p.job?p.job.pay:20000)*.05/50)*50):5;
const stkTxt=(k,v)=>k==='geld'?eur(v):STAKE[k].n+' '+v;
function stkCan(k){const v=stkAmt(k);return k==='geld'?p.money>=v:k==='gl'?p.st.gl>v:(p.ruf||0)>-90}
function stkMove(k,v){if(k==='geld')p.money+=v;else if(k==='gl')add('gl',v);else addRuf(v)}
function stkPlay(k,n,cb){const ty=JOBMG[p.job.id]||'rechnen';mgStart(ty,3,'Bewährungsprobe: '+MGN[ty][0],(sc,auto)=>cb(sc,auto),ty==='reakt'?p.sk.fahren/2+p.st.ge/2:p.st.in)}
function stkStart(k){if(!p.job||p.prison||p.stkY===p.age||!STAKE[k])return;if(!stkCan(k)){toast('Dafür reicht dein '+STAKE[k].n+' gerade nicht.');return}if(!useAct())return;
  const v=stkAmt(k);p.stkY=p.age;stkMove(k,-v);save();render();
  stkPlay(k,1,sc=>{if(sc<2){p.job.perf=clamp(p.job.perf-6,0,100);log('Bewährungsprobe verloren: '+stkTxt(k,v)+' weg.');save();render();dialog('Daneben',sc+' von 3. Der Einsatz ist weg, und die Chefetage hat es gesehen.',[['Mist',null]]);return}
    stkMove(k,2*v);p.job.perf=clamp(p.job.perf+12,0,100);p.job.rec=(p.job.rec||0)+1;log('Bewährungsprobe gewonnen: +'+stkTxt(k,v)+', Empfehlung für die Beförderung.');save();render();
    dialog('Geschafft!',sc+' von 3. +'+stkTxt(k,v)+' und eine Empfehlung. Alles riskieren für das Doppelte?',[['Doppelt oder nichts',()=>stkDouble(k,v)],['Einstreichen',null]])})}
function stkDouble(k,v){stkPlay(k,2,sc=>{if(sc<3){stkMove(k,-2*v);p.job.perf=clamp(p.job.perf-8,0,100);p.job.rec=Math.max(0,(p.job.rec||1)-1);log('Doppelt oder nichts verloren: '+stkTxt(k,2*v)+' weg.');save();render();dialog('Alles weg',sc+' von 3. Gewinn, Einsatz und die Empfehlung sind verspielt.',[['Autsch',null]]);return}
  stkMove(k,2*v);p.job.perf=clamp(p.job.perf+8,0,100);p.job.rec=(p.job.rec||0)+1;mile('Doppelt oder nichts gewonnen','star');log('Doppelt oder nichts gewonnen: +'+stkTxt(k,2*v)+'.');save();render();
  dialog('Volltreffer!','3 von 3. Insgesamt +'+stkTxt(k,3*v)+' und zwei Empfehlungen. Die Beförderung rückt näher.',[['Weiter',null]])})}
/* Empfehlungen wirken am Jahresende. */
HOOK.on('year',()=>{const j=p&&p.job;if(!j||!j.rec)return;const ch0=Math.min(.6,.25*j.rec);
  if(j.perf>60&&(j.rank||1)<4&&j.promY!==p.age&&ch(ch0)){j.rank=(j.rank||1)+1;j.pay=Math.round(j.pay*((j.rank<4)?1.2:1.08));j.promY=p.age;add('gl',6);log('Beförderung dank deiner Bewährungsprobe! Neues Gehalt: '+eur(j.pay)+'.');try{msg('chef','Ihre Leistung in der Bewährungsprobe hat überzeugt. Herzlichen Glückwunsch zur Beförderung!')}catch(e){errLog(e)}}
  j.rec=0},45,'einsatz');
function stakeCard(){if(!p||!p.job||p.prison)return '';const done=p.stkY===p.age,lock=done||p.act<=0;
  return '<section class="card stake"><h2 class="h">Bewährungsprobe</h2><p class="note">'+(done?'Für dieses Jahr erledigt.':'Setz etwas ein. Gewinnst du, gibt es das Doppelte und eine Empfehlung für die Beförderung.')+'</p>'+
    (done?'':'<div class="stkg">'+Object.keys(STAKE).map(k=>'<button class="stkb" data-a="stake" data-g="'+k+'"'+(lock||!stkCan(k)?' disabled':'')+'><small>Einsatz</small><b>'+stkTxt(k,stkAmt(k))+'</b></button>').join('')+'</div>')+
    (p.job.rec?'<div class="mrow"><span>Empfehlungen</span><b class="up">'+p.job.rec+' · +'+Math.round(Math.min(.6,.25*p.job.rec)*100)+' % Beförderungschance</b></div>':'')+'</section>'}
{const _va=viewApp;viewApp=function(id){let h=_va.apply(this,arguments);try{if(id==='jobs'){const c=stakeCard();if(c){const i=h.indexOf('<section');h=i>=0?h.slice(0,i)+c+h.slice(i):h+c}}}catch(e){errLog(e,'stake')}return h}}
HOOK.on('act',(id,arg)=>{if(id==='stake'){stkStart(arg);return 1}},50,'einsatz');
