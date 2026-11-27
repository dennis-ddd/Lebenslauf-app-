// Prüft Namenskollisionen zwischen allen Modulen (siehe tests/lib/kollision.js) und dass die Prüfung selbst anschlägt.
const fs=require('fs'),os=require('os'),path=require('path'),check=require('./lib/kollision');let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};
// Selbsttest mit absichtlichen Kollisionen
const t=fs.mkdtempSync(path.join(os.tmpdir(),'koll-'));fs.mkdirSync(path.join(t,'src','js'),{recursive:true});
fs.writeFileSync(path.join(t,'index.html'),'<script>{const A=1;const CHANGES=[];const A=2;}</script>');
fs.writeFileSync(path.join(t,'src','js','a.js'),'const A=1;\nfunction f(){}\nQEV.x=()=>1;');fs.writeFileSync(path.join(t,'src','js','b.js'),'const A=2;\nfunction f(){}\nQEV.x=()=>2;\nconst o=QEV.y;QEV.y=()=>o();');
const S=check(t);ok('erkennt doppeltes const',S.some(x=>/Doppelt deklariert: A/.test(x)));ok('erkennt doppelte Funktion',S.some(x=>/Funktion doppelt: f/.test(x)));ok('erkennt doppeltes Ereignis',S.some(x=>/QEV\.x/.test(x)));ok('Erweiterung erlaubt',!S.some(x=>/QEV\.y/.test(x)));
fs.rmSync(t,{recursive:true,force:true});
// Echter Stand
const P=check();P.forEach(x=>console.log('FEHLER',x));errs+=P.length;console.log('errors',errs);process.exit(errs?1:0);
