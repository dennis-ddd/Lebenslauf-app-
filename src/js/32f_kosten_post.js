/* ================= Kosten des Lebens, Steuern und Post ================= */
// Einkommensteuer mit Stufen (Grenzen wachsen mit der Inflation)
const INCTAX=[[12000,0],[60000,.25],[250000,.38],[1e15,.45]];
function incTax(x){let t=0,prev=0;for(const [lim0,r] of INCTAX){const lim=lim0>1e14?lim0:px$(lim0);if(x>prev)t+=(Math.min(x,lim)-prev)*r;prev=lim}return Math.round(t)}
// Lebenshaltungskosten ab 18
function livingCosts(net){const a=p.age;if(a<18||p.prison)return [];const home=p.home==='eltern',cf=cityF(1),L=[];
  L.push([home?(a>=25?'Kostgeld an die Eltern':'Essen und Haushalt (bei den Eltern)'):'Essen und Haushalt',Math.round(px$(home?(a>=25?3600:a>=21?2400:1200):3600)*(home?1:cf))]);
  L.push(['Kleidung und Pflege',px$(900)]);
  const ph=[0,240,420,600][phoneTier()];if(ph)L.push(['Handyvertrag ('+PHONES[phoneTier()][0]+')',px$(ph)]);
  if(!home&&p.home!=='wohnheim')L.push(['Strom und Internet',Math.round(px$(1300)*cf)]);
  L.push(['Versicherungen',px$(600)]);if(!p.cars.length)L.push(['Bus und Bahn',px$(700)]);
  const kon=Math.round(Math.max(0,net)*.25+Math.max(0,p.money-px$(250000))*.015);if(kon)L.push(['Konsum, Ausgehen und Urlaub',kon]);
  return L}
// Steuern auf Immobilienbesitz
function propTaxes(){const L=[];let g=0;const vals=(p.props||[]).map(pr=>pr.val).concat((p.owned||[]).map(k=>HOMES[k]&&HOMES[k].buy?px$(HOMES[k].buy):0)).filter(v=>v>0);
  vals.forEach(v=>g+=v*.0035);if(g)L.push(['Grundsteuer ('+vals.length+' Objekt'+(vals.length>1?'e':'')+')',Math.round(g)]);
  if(vals.length>3){const extra=vals.sort((x,y)=>y-x).slice(3).reduce((s,v)=>s+v*.01,0);L.push(['Abgabe auf Mehrfachbesitz (ab der 4. Immobilie)',Math.round(extra)])}
  return L}
function costYear(R0,net){const L=livingCosts(net).concat(propTaxes());L.forEach(([n,c])=>{if(net<=0&&n==='Kostgeld an die Eltern')c=Math.round(c/3);p.money-=c;R0.out.push([n,c])});
  if(p.age>=18&&!p.prison&&net<px$(6000)&&p.money<px$(5000)&&!p.study&&p.age<67){const b=px$(6500)-Math.max(0,net);if(b>0){p.money+=b;R0.inc.push(['Bürgergeld (Grundsicherung)',b])}}}

/* ---------- Post: Briefe, Rechnungen, Mahnungen ---------- */
const MAIL={
 rundfunk:['Rundfunkbeitrag','Beitragsservice','Der Rundfunkbeitrag für das Jahr ist fällig.',1,()=>220],
 steuer:['Steuererklärung','Finanzamt','Bitte reichen Sie Ihre Steuererklärung ein. Oft gibt es Geld zurück.',2,()=>0],
 arzt:['Arztrechnung','Praxis Dr. Weber','Rechnung für Ihre letzte Behandlung.',1,()=>R(80,350)],
 knoellchen:['Strafzettel','Ordnungsamt','Falschparken in der Innenstadt.',1,()=>R(30,90)],
 kfz:['Kfz-Steuer','Hauptzollamt','Die Kfz-Steuer für Ihr Fahrzeug ist fällig.',1,()=>R(120,400)],
 nebenkosten:['Nebenkostenabrechnung','Hausverwaltung','Ihre Nebenkostenabrechnung für das letzte Jahr.',1,()=>R(-300,700)],
 handy:['Handyrechnung','Mobilfunkanbieter','Zusatzkosten: Sie haben Ihr Datenvolumen überschritten.',1,()=>R(20,120)],
 gewinn:['Sie haben gewonnen!','Glücks-Zentrale','Sie haben 10.000 € gewonnen! Überweisen Sie nur 49 € Bearbeitungsgebühr.',3,()=>49],
 oma:['Brief von Oma','Oma','Ein Brief mit krakeliger Schrift. Es fällt ein Geldschein heraus.',4,()=>50],
 werbung:['Werbung','Möbelhaus XXL','Riesiger Räumungsverkauf! Alles muss raus!',5,()=>0],
 schaetzung:['Steuerschätzung','Finanzamt','Weil keine Steuererklärung kam, wurde Ihre Steuer geschätzt. Bitte zahlen Sie die Nachzahlung.',1,()=>0]};
const MSTAGE=['Rechnung','1. Mahnung','Inkasso','Gerichtsvollzieher'];
function mailYear(){if(p.age<16||p.prison)return;p.mail=p.mail||[];const a=p.age,nw=[];
  // Unbeantwortete Briefe eskalieren
  p.mail=p.mail.filter(m=>{const M=MAIL[m.k];if(!M)return false;
    if(M[3]>=3)return false;
    if(M[3]===2){const pen=px$(R(600,1800));nw.push({k:'schaetzung',amt:pen,st:0,id:R(1,1e9),y:a});log('Steuererklärung nicht abgegeben: Das Finanzamt hat geschätzt. Nachzahlung '+eur(pen)+'.');p.bon=Math.max(0,p.bon-3);return false}
    if(m.amt<=0)return false;
    m.st++;if(m.st===1){m.amt+=40;p.bon=Math.max(0,p.bon-3);log('Mahnung: '+M[0]+' ist überfällig (+40 € Gebühr).')}
    else if(m.st===2){m.amt=m.amt*2+100;p.bon=Math.max(0,p.bon-8);log('Inkasso! Die offene Rechnung „'+M[0]+'“ liegt jetzt beim Inkassobüro: '+eur(m.amt)+'.');msg('mama','Hast du deine Post nicht geöffnet? Da kam was vom Inkasso …')}
    else{const v=Math.round(m.amt*1.3);p.money-=v;p.bon=Math.max(0,p.bon-15);addRuf(-3);add('gl',-6);log('Der Gerichtsvollzieher war da und hat '+eur(v)+' gepfändet.');news('Gerichtsvollzieher im Viertel','lokal');return false}
    m.y=a;return true});p.mail=p.mail.concat(nw);
  const add2=k=>{const M=MAIL[k];p.mail.push({k,amt:px$(M[4]()),st:0,id:R(1,1e9),y:a})};
  if(a>=18&&p.home!=='eltern')add2('rundfunk');if(p.job||p.pension||p.biz&&p.biz.co)add2('steuer');
  if(p.cars.length){add2('kfz');if(ch(.35))add2('knoellchen')}if(p.home!=='eltern'&&p.home!=='wohnheim'&&ch(.6))add2('nebenkosten');
  if(Object.keys(p.ill||{}).length&&ch(.5))add2('arzt');if(phoneTier()&&ch(.25))add2('handy');
  if(ch(.25))add2('gewinn');if(a<30&&!p.parentsGone&&ch(.3))add2('oma');if(ch(.4))add2('werbung');
  p.mail=p.mail.slice(-14)}
const mailOpen=()=>(p.mail||[]).filter(m=>MAIL[m.k]&&MAIL[m.k][3]<=2).length;
function viewPost(){p.mail=p.mail||[];const lock=!!p.prison;const bills=p.mail.filter(m=>MAIL[m.k]&&MAIL[m.k][3]===1&&m.amt>0),sum=bills.reduce((s,m)=>s+m.amt,0);
  let h='<section class="card postsum"><div class="listseg"><div><b>Briefkasten</b><small>'+(p.mail.length?p.mail.length+' Brief(e)':'Leer')+'</small></div>'+(bills.length?btn('mailpayall',null,'Alle bezahlen · '+eur(sum),'o',lock||p.money<sum):'<span class="chip">Alles erledigt</span>')+'</div>'+
    '<p class="note">Unbezahlte Rechnungen werden zur Mahnung, dann geht es zum Inkasso und am Ende kommt der Gerichtsvollzieher. Jeder Brief kostet 10 Minuten.</p></section>';
  if(!p.mail.length)return h+card('','<p class="note">Keine Post. Herrlich.</p>');
  h+=p.mail.map((m,i)=>{const M=MAIL[m.k];if(!M)return '';const st=m.st||0;
    let act='';if(M[3]===1)act=m.amt>0?btn('mailpay',i,'Bezahlen · '+eur(m.amt),'o',lock||p.money<m.amt):btn('mailpay',i,'Gutschrift '+eur(-m.amt)+' annehmen','o',lock);
    else if(M[3]===2)act=btn('mailtax',i,'Erklärung machen (1 Std.)','o',lock);else if(M[3]===3)act=btn('mailpay',i,'49 € überweisen','',lock)+btn('mailtrash',i,'Wegwerfen','g');
    else if(M[3]===4)act=btn('mailpay',i,'Öffnen','o',lock);else act=btn('mailtrash',i,'Wegwerfen','g');
    return '<section class="card letter st'+st+'"><div class="lh"><span class="lic"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></span><div><small>'+esc(M[1])+(st?' · <b class="down">'+MSTAGE[st]+'</b>':'')+'</small><b>'+esc(st?MSTAGE[st]+': '+M[0]:M[0])+'</b></div></div><p class="note">'+esc(M[2])+'</p><div class="btns">'+act+'</div></section>'}).join('');
  return h}
function act12(id,arg){const lock=!!p.prison;if(id.startsWith('mail')){if(lock)return 1;p.mail=p.mail||[]}switch(id){
  case 'mailpay':{const m=p.mail[+arg];if(!m)return 1;const M=MAIL[m.k];if(m.amt>0&&p.money<m.amt)return 1;if(!spendTime(10))return 1;
    if(M[3]===3&&perk('bankkfm')){p.mail.splice(+arg,1);done('Als Bankkaufmann/-frau erkennst du die Masche sofort: Betrug. Ab in den Müll.');return 1}if(M[3]===3){p.money-=m.amt;p.mail.splice(+arg,1);add('gl',-5);done('Du hast 49 € überwiesen. Die 10.000 € kommen nie an. Es war Betrug.');return 1}
    if(M[3]===4){p.money+=m.amt;p.mail.splice(+arg,1);add('gl',4);done('Oma schreibt, dass sie stolz auf dich ist. Und legt '+eur(m.amt)+' bei.');return 1}
    p.money-=m.amt;p.mail.splice(+arg,1);done(m.amt>=0?M[0]+' bezahlt: '+eur(m.amt)+'.':'Gutschrift: '+eur(-m.amt)+' zurück.');return 1}
  case 'mailpayall':{const bills=p.mail.filter(m=>MAIL[m.k]&&MAIL[m.k][3]===1);const sum=bills.reduce((s,m)=>s+m.amt,0);if(p.money<sum)return 1;if(!spendTime(10*bills.length))return 1;p.money-=sum;p.mail=p.mail.filter(m=>!bills.includes(m));done(bills.length+' Rechnung(en) bezahlt: '+eur(sum)+'.');return 1}
  case 'mailtax':{const m=p.mail[+arg];if(!m||!spendTime(60))return 1;mgStart('rechnen',3,'Steuererklärung',(s,auto)=>{const v=px$(R(150,500))*(s+1);p.money+=v;p.mail=p.mail.filter(x=>x!==m);log('Steuererklärung abgegeben: '+eur(v)+' Rückzahlung.');save();render();dialog('Steuererklärung',s+' von 3 Belegen richtig zugeordnet. Das Finanzamt erstattet dir '+eur(v)+'.',[['Super',null]])});return 1}
  case 'mailtrash':{const m=p.mail[+arg];if(!m)return 1;p.mail.splice(+arg,1);render();return 1}
  }return 0}
APPTIP.post='Hier landen Rechnungen, Behördenbriefe und Werbung. Bezahl Rechnungen rechtzeitig, sonst kommen Mahnungen, Inkasso und Gerichtsvollzieher. Vorsicht vor Betrug!';
