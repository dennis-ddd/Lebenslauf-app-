// Schreibt die eingebauten Namen nach inhalte/namen.txt (überschreibt die Datei!). Aufruf: node tests/namen_export.js
process.chdir(require('path').join(__dirname,'..'));
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{add(){},remove(){},contains(){},toggle(){}},querySelectorAll:()=>[],querySelector:()=>null,setAttribute(){},dataset:{}})}
global.setInterval=()=>({});global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
let src=(s=>s.split('<script>')[1].split('</script>')[0])(require('fs').readFileSync('index.html','utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.D={FN,MN,LN,CITYA,CITYB,FR,PL,GANGS,PARTIES,BANDN,SONGW,COMPN,PROCLUBS,RTAUNT};';eval(src);
const o=[];const sec=(t,h,L)=>{o.push('','['+t+']');if(h)o.push('# '+h);L.forEach(x=>o.push(x))};
o.push('# ==========================================================','#  Lebenslauf – alle Namen zum Bearbeiten','# ==========================================================',
'#  So funktioniert es:','#  - Jede Zeile ist ein Name. Leere Zeilen werden ignoriert.','#  - Zeilen mit # am Anfang sind Kommentare.',
'#  - Die Überschriften in [eckigen Klammern] nicht umbenennen.','#  - Lässt du einen Abschnitt leer, nimmt das Spiel die eingebauten Namen.',
'#  - Änderungen wirken nach dem nächsten Öffnen der App.');
sec('Vornamen weiblich','',D.FN);sec('Vornamen männlich','',D.MN);sec('Nachnamen','',D.LN);
sec('Ortsnamen Anfang','Stadtnamen entstehen aus Anfang + Ende, z. B. Neu + hafen = Neuhafen',D.CITYA);sec('Ortsnamen Ende','',D.CITYB);
sec('Läden','Kennung = Name. Die Kennung links nicht ändern, nur den Namen rechts.',Object.values(D.FR).map(f=>f.id+' = '+f.n));
sec('Gebäude in der Stadt','Kennung = Name. Nur den Namen rechts ändern.',Object.entries(D.PL).map(([k,v])=>k+' = '+v.n));sec('Gangs','',D.GANGS);sec('Parteien','Name | Beschreibung (Reihenfolge und Anzahl bitte gleich lassen)',D.PARTIES.map(x=>x[0]+' | '+x[2]));
sec('Bandnamen','',D.BANDN);sec('Songtitel','',D.SONGW);sec('Konkurrenten','',D.COMPN);sec('Profivereine','',D.PROCLUBS);sec('Sprüche des Rivalen','',D.RTAUNT);
require('fs').mkdirSync('inhalte',{recursive:true});require('fs').writeFileSync('inhalte/namen.txt',o.join('\n')+'\n');console.log(o.length);
