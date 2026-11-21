/* ---------- Casino ---------- */
const SYMS=[{k:'kirsche',w:30,x:5},{k:'zitrone',w:25,x:8},{k:'glocke',w:18,x:12},{k:'bar',w:12,x:20},{k:'stern',w:10,x:40},{k:'sieben',w:5,x:150}];
const SYMSVG={kirsche:'<path d="M12 4c-2 3-3 6-3 9M12 4c2 2 3 5 4 9" stroke="#2F8F4E" stroke-width="2" fill="none"/><circle cx="8.5" cy="16" r="4" fill="#E4243B"/><circle cx="16" cy="16" r="4" fill="#C81D33"/>',
zitrone:'<ellipse cx="12" cy="13" rx="8" ry="6" fill="#F7D33C"/><path d="M4 13l-1.5 1M20 13l1.5-1" stroke="#E8B820" stroke-width="2"/>',
glocke:'<path d="M12 3a6 6 0 0 1 6 6v5l2 3H4l2-3V9a6 6 0 0 1 6-6z" fill="#F2B532"/><circle cx="12" cy="19.5" r="2" fill="#C98A12"/>',
bar:'<rect x="2.5" y="7" width="19" height="10" rx="2.5" fill="#1B1F2A"/><text x="12" y="15.2" font-size="7.5" font-weight="900" text-anchor="middle" fill="#fff" font-family="Nunito,sans-serif">BAR</text>',
stern:'<path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="#8E63D6"/>',
sieben:'<text x="12" y="20" font-size="21" font-weight="900" text-anchor="middle" fill="#E4243B" font-family="Nunito,sans-serif">7</text>'};
const symSvg=k=>'<svg viewBox="0 0 24 24" width="56" height="56" aria-hidden="true">'+SYMSVG[k]+'</svg>';
const RED=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36],rcol=n=>n===0?'gruen':RED.includes(n)?'rot':'schwarz';
const RLB={rot:['Rot',2],schwarz:['Schwarz',2],gerade:['Gerade',2],ungerade:['Ungerade',2],tief:['1 bis 18',2],hoch:['19 bis 36',2],zahl:['Einzelne Zahl',36]};
const SUITS=['♠','♥','♦','♣'],RANKS=['A','2','3','4','5','6','7','8','9','10','B','D','K'];
let casTab='automat',casBet=100,casBusy=false,casMsg='',slotRes=['sieben','stern','bar'],rlBet='rot',rlNum=7,rlLast=null,rlHist=[],bj=null;
function wsym(){let t=Math.random()*100,a=0;for(const s of SYMS){a+=s.w;if(t<a)return s.k}return 'kirsche'}
function betOk(){if(casBusy)return false;if(p.age<18||p.prison)return false;if(casBet<=0||p.money<casBet){toast('Nicht genug Geld für diesen Einsatz.');return false}return true}
function casSettle(win,bet){const net=win-bet;p.money+=win;if(net>0)p.casino.won+=net;else{p.casino.lost+=-net;if(-net>Math.max(1000,p.money*.2))add('gl',-2)}p.yr.casino+=net;if(net>=100000)log('Casino: '+eur(net)+' gewonnen!')}
function spin(){if(!betOk())return;casBusy=true;const bet=casBet;p.money-=bet;
  let r=[wsym(),wsym(),wsym()];if(p.cheat){const k=pick(['glocke','bar','stern','stern','sieben']);r=[k,k,k]}
  let n=0;const iv=setInterval(()=>{n++;const el=document.getElementById('reels');if(el)el.innerHTML=[0,1,2].map(i=>'<div class="reel spin">'+symSvg(n>=12-(2-i)*3?r[i]:wsym())+'</div>').join('');
    if(n>=12){clearInterval(iv);slotRes=r;let win=0;
      if(r[0]===r[1]&&r[1]===r[2])win=bet*SYMS.find(s=>s.k===r[0]).x;else if(r.filter(x=>x==='kirsche').length===2)win=bet*2;
      casSettle(win,bet);casMsg=win?(r[0]==='sieben'&&r[1]==='sieben'?'JACKPOT! ':'Gewinn: ')+eur(win)+'!':'Leider nichts. Nochmal?';if(win&&r.every(x=>x==='sieben'))ach('casino');casBusy=false;save();render()}},75);
}
function rlWins(n,b){if(b==='zahl')return n===rlNum;if(n===0)return false;return b==='rot'?rcol(n)==='rot':b==='schwarz'?rcol(n)==='schwarz':b==='gerade'?n%2===0:b==='ungerade'?n%2===1:b==='tief'?n<=18:n>=19}
function rlSpin(){if(!betOk())return;casBusy=true;const bet=casBet,b=rlBet;p.money-=bet;let n=R(0,36);
  if(p.cheat){const ok=[];for(let i=0;i<=36;i++)if(rlWins(i,b))ok.push(i);n=pick(ok)}
  let k=0;const iv=setInterval(()=>{k++;const t=k>=16?n:R(0,36),el=document.getElementById('rlnum');if(el){el.textContent=t;el.className='rlnum c-'+rcol(t)}
    if(k>=16){clearInterval(iv);const w=rlWins(n,b)?bet*RLB[b][1]:0;casSettle(w,bet);rlHist.unshift(n);rlHist=rlHist.slice(0,12);rlLast=n;
      casMsg=(w?'Gewinn: '+eur(w)+'!':'Verloren.')+' Die Kugel liegt auf '+n+(n?' '+(rcol(n)==='rot'?'Rot':'Schwarz'):'')+'.';casBusy=false;save();render()}},85);
}
const cval=c=>c.r==='A'?11:['B','D','K','10'].includes(c.r)?10:+c.r;
function hval(h){let t=h.reduce((s,c)=>s+cval(c),0),a=h.filter(c=>c.r==='A').length;while(t>21&&a){t-=10;a--}return t}
function newDeck(){const d=[];for(let k=0;k<4;k++)for(const s of SUITS)for(const r of RANKS)d.push({r,s});return shuffle(d)}
function take(pred){const i=bj.deck.findIndex(pred);return i>=0?bj.deck.splice(i,1)[0]:bj.deck.pop()}
function bjDeal(){if(!betOk())return;p.money-=casBet;bj={deck:newDeck(),ph:[],dh:[],bet:casBet,st:'play'};casMsg='';
  if(p.cheat){bj.dh=[take(c=>c.r==='6'),take(c=>cval(c)===10)];bj.ph=[take(c=>cval(c)===10),take(c=>['8','9','A'].includes(c.r))]}
  else{bj.ph.push(bj.deck.pop());bj.dh.push(bj.deck.pop());bj.ph.push(bj.deck.pop());bj.dh.push(bj.deck.pop())}
  if(hval(bj.ph)===21)return bjEnd();save();render()}
function bjHit(){if(!bj||bj.st!=='play')return;bj.ph.push(p.cheat?take(c=>hval(bj.ph.concat([c]))<=21):bj.deck.pop());if(hval(bj.ph)>21)return bjEnd();if(hval(bj.ph)===21)return bjStand();render()}
function bjDouble(){if(!bj||bj.st!=='play'||bj.ph.length!==2||p.money<bj.bet)return;p.money-=bj.bet;bj.bet*=2;bj.ph.push(p.cheat?take(c=>hval(bj.ph.concat([c]))<=21):bj.deck.pop());if(hval(bj.ph)>21)return bjEnd();bjStand()}
function bjStand(){if(!bj||bj.st!=='play')return;
  while(hval(bj.dh)<17)bj.dh.push(p.cheat?take(c=>hval(bj.dh.concat([c]))>21):bj.deck.pop());bjEnd()}
function bjEnd(){bj.st='done';const pv=hval(bj.ph),dv=hval(bj.dh),pbj=pv===21&&bj.ph.length===2,dbj=dv===21&&bj.dh.length===2;let w=0,t;
  if(pv>21)t='Überkauft mit '+pv+'. Die Bank gewinnt.';else if(pbj&&!dbj){w=bj.bet*2.5;t='Blackjack!'}else if(dv>21){w=bj.bet*2;t='Die Bank hat sich überkauft. Du gewinnst!'}
  else if(pv>dv){w=bj.bet*2;t='Du gewinnst mit '+pv+' gegen '+dv+'!'}else if(pv===dv){w=bj.bet;t='Unentschieden. Einsatz zurück.'}else t='Die Bank gewinnt mit '+dv+' gegen '+pv+'.';
  casSettle(w,bj.bet);casMsg=t+(w>bj.bet?' +'+eur(w-bj.bet):'');save();render()}
const cardH=(c,hid)=>hid?'<span class="pcard back"></span>':'<span class="pcard'+(c.s==='♥'||c.s==='♦'?' red':'')+'"><b>'+c.r+'</b><i>'+c.s+'</i></span>';
function viewCasino(){
  let h='<section class="cas-hero"><button class="cas-logo" data-a="cheat">Casino Goldküste'+(p.cheat?'<i class="cstar" aria-hidden="true">★</i>':'')+'</button>';
  if(p.age<18)return h+'<p>Zutritt ab 18 Jahren.</p></section>';
  if(p.prison)return h+'<p>Aus dem Gefängnis kommst du hier nicht rein.</p></section>';
  h+='<div class="cas-bal"><small>Dein Geld</small><b>'+eur(p.money)+'</b></div><div class="cas-st"><span>Gewonnen <b>'+eur(p.casino.won)+'</b></span><span>Verloren <b>'+eur(p.casino.lost)+'</b></span></div></section>';
  h+='<div class="seg cas-tabs">'+[['automat','Automat'],['roulette','Roulette'],['blackjack','Blackjack']].map(([k,l])=>'<button data-a="castab" data-g="'+k+'" aria-pressed="'+(casTab===k)+'">'+l+'</button>').join('')+'</div>';
  const bets=[10,100,1000,10000,100000];const playing=casTab==='blackjack'&&bj&&bj.st==='play';
  h+='<div class="chips">'+bets.map(b=>'<button class="chipb'+(casBet===b?' on':'')+'" data-a="bet" data-g="'+b+'"'+(playing?' disabled':'')+'>'+(b>=1000?(b/1000)+' Tsd.':b)+'</button>').join('')+'<button class="chipb'+(casBet===Math.floor(p.money)&&casBet>0?' on':'')+'" data-a="bet" data-g="all"'+(playing?' disabled':'')+'>Alles</button></div><p class="note" style="text-align:center;margin:-4px 0 0">Einsatz: <b>'+eur(casBet)+'</b></p>';
  if(casTab==='automat'){
    h+='<section class="card slot"><div class="reels" id="reels">'+slotRes.map(k=>'<div class="reel">'+symSvg(k)+'</div>').join('')+'</div><p class="cmsg">'+esc(casMsg||'Drei gleiche gewinnen. Zwei Kirschen verdoppeln.')+'</p><button class="btn o big" data-a="spin"'+(casBusy?' disabled':'')+'>Drehen · '+eur(casBet)+'</button>'+
      '<div class="pay">'+SYMS.slice().reverse().map(s=>'<span><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">'+SYMSVG[s.k]+'</svg>×3 = '+s.x+'×</span>').join('')+'</div></section>';
  }
  if(casTab==='roulette'){
    h+='<section class="card rl"><div class="rlwrap"><div id="rlnum" class="rlnum c-'+(rlLast==null?'gruen':rcol(rlLast))+'">'+(rlLast==null?'?':rlLast)+'</div></div><div class="rlhist">'+rlHist.map(n=>'<i class="c-'+rcol(n)+'">'+n+'</i>').join('')+'</div><p class="cmsg">'+esc(casMsg||'Worauf setzt du?')+'</p>'+
      '<div class="rlbets">'+Object.keys(RLB).map(k=>'<button class="rlb b-'+k+'" data-a="rlbet" data-g="'+k+'" aria-pressed="'+(rlBet===k)+'">'+RLB[k][0]+'<small>'+RLB[k][1]+'×</small></button>').join('')+'</div>'+
      (rlBet==='zahl'?'<div class="numpick">'+btn('rlnum',rlNum-1,'−','g',rlNum<=0)+'<b class="rlsmall c-'+rcol(rlNum)+'">'+rlNum+'</b>'+btn('rlnum',rlNum+1,'+','g',rlNum>=36)+'</div>':'')+
      '<button class="btn o big" data-a="rl"'+(casBusy?' disabled':'')+'>Kugel werfen · '+eur(casBet)+'</button></section>';
  }
  if(casTab==='blackjack'){
    const play=bj&&bj.st==='play';
    h+='<section class="card bjt">';
    if(bj){h+='<div class="bjrow"><small>Bank'+(play?'':' · '+hval(bj.dh))+'</small><div class="hand">'+bj.dh.map((c,i)=>cardH(c,play&&i===1)).join('')+'</div></div><div class="bjrow"><small>Du · '+hval(bj.ph)+'</small><div class="hand">'+bj.ph.map(c=>cardH(c)).join('')+'</div></div>'}
    else h+='<p class="cmsg">Komm so nah wie möglich an 21, ohne drüber zu gehen. Die Bank zieht bis 17. Blackjack zahlt 3 zu 2.</p>';
    if(casMsg&&bj&&!play)h+='<p class="cmsg">'+esc(casMsg)+'</p>';
    h+=play?'<div class="btns" style="justify-content:center">'+btn('bjhit',null,'Karte','o')+btn('bjstand',null,'Halten','')+btn('bjdouble',null,'Verdoppeln','g',bj.ph.length!==2||p.money<bj.bet)+'</div>':'<button class="btn o big" data-a="bjdeal">Austeilen · '+eur(casBet)+'</button>';
    h+='</section>';
  }
  return h+'<p class="note" style="text-align:center">Im echten Leben gewinnt auf Dauer immer das Casino.</p>';
}

