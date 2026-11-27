// Findet Namenskollisionen im gemeinsamen Namensraum aller Module (src/js/*.js laufen in EINEM Block).
// 1. Doppelte const/let/class: V8 kompiliert das Spielskript aus index.html; ein SyntaxError nennt den Namen.
// 2. Doppelte function-Deklarationen am Zeilenanfang: erlaubt, aber die spätere überschreibt still die frühere.
// 3. Doppelte Ereignis-IDs QEV.x = … in verschiedenen Dateien.
const fs=require('fs'),path=require('path'),vm=require('vm');
module.exports=function check(root){root=root||path.join(__dirname,'..','..');const dir=path.join(root,'src','js'),P=[];
  const files=fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort(),src={};files.forEach(f=>src[f]=fs.readFileSync(path.join(dir,f),'utf8'));
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),i=html.indexOf('const CHANGES'),a=html.lastIndexOf('<script>',i),b=html.indexOf('</script>',i);
  try{new vm.Script(html.slice(a+8,b),{filename:'index.html'})}catch(e){const m=/Identifier '([^']+)' has already been declared/.exec(e.message);
    if(m){const re=new RegExp('(?:const|let|var|class|function)\\s+'+m[1].replace(/\$/g,'\\$')+'\\b|,\\s*'+m[1].replace(/\$/g,'\\$')+'\\s*=');P.push('Doppelt deklariert: '+m[1]+' in '+files.filter(f=>re.test(src[f])).join(', '))}else P.push('Syntaxfehler im Spielskript: '+e.message)}
  const fn={};files.forEach(f=>{for(const m of src[f].matchAll(/^function\s+([A-Za-z_$][\w$]*)\s*\(/gm))(fn[m[1]]=fn[m[1]]||[]).push(f)});
  Object.entries(fn).forEach(([n,L])=>{if(L.length>1)P.push('Funktion doppelt: '+n+' in '+L.join(', '))});
  // Erweiterungen der Form  const o=QEV.x;QEV.x=…  rufen das Original auf und sind erlaubt.
  const q={};files.forEach(f=>{for(const m of src[f].matchAll(/\bQEV\.([A-Za-z_$][\w$]*)\s*=(?!=)/g)){const n=m[1],wrap=new RegExp('=\\s*QEV\\.'+n+'\\s*;\\s*QEV\\.'+n+'\\s*=').test(src[f]);if(!wrap)(q[n]=q[n]||new Set()).add(f)}});
  Object.entries(q).forEach(([n,S])=>{if(S.size>1)P.push('Ereignis doppelt: QEV.'+n+' in '+[...S].join(', '))});
  return P};
