// Fester Zufall für Tests: ersetzt Math.random durch einen reproduzierbaren Generator (mulberry32).
// Nutzung am Anfang eines Tests:  require('./lib/zufall').seed();         // Seed aus SEED oder fest 4242
//                                  require('./lib/zufall').seed('zufall'); // jedes Mal neu, Seed wird ausgegeben
// Schlägt ein Test fehl, lässt er sich mit  SEED=<Zahl> node tests/x.js  exakt wiederholen.
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
exports.seed=function(mode){let s=process.env.SEED!=null?+process.env.SEED:mode==='zufall'?(Date.now()%1e9):4242;Math.random=mulberry32(s);exports.value=s;if(mode==='zufall'||process.env.SEED!=null)console.log('SEED='+s);return s};
