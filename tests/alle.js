// Führt alle Tests aus und fasst zusammen:  node tests/alle.js
// Zufallsabhängige Tests laufen mit festem Seed (tests/lib/zufall.js), Erkundungstests mit wechselndem Seed.
const {execFileSync}=require('child_process'),fs=require('fs'),path=require('path');
const dir=__dirname,files=fs.readdirSync(dir).filter(f=>f.endsWith('.js')&&f!=='alle.js').sort();let bad=[];const t0=Date.now();
for(const f of files){const s=Date.now();try{execFileSync('node',[path.join(dir,f)],{stdio:'pipe',timeout:600000});console.log('ok   '+f+' ('+((Date.now()-s)/1000).toFixed(1)+' s)')}
  catch(e){bad.push(f);const out=String(e.stdout||'')+String(e.stderr||'');console.log('FAIL '+f+'\n'+out.split('\n').filter(l=>/FEHLER|SEED=|Error|errors/.test(l)).slice(0,6).map(l=>'     '+l).join('\n'))}}
console.log('\n'+(files.length-bad.length)+' von '+files.length+' Tests grün in '+((Date.now()-t0)/1000).toFixed(0)+' s'+(bad.length?' · rot: '+bad.join(', '):''));process.exit(bad.length?1:0);
