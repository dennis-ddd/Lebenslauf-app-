/* ================= Lebendiger Avatar: Stimmungen, Altern, Blinzeln, neuer Kleiderschrank ================= */
{
/* Neuer, lebendiger Avatar (Entwurf) */
const SKIN2=['#F8DCC4','#EDC4A0','#D49C6E','#A9724B','#6F4B33'];
const HAIRC={braun:'#5A3A22',schwarz:'#221C1C',blond:'#E2B85E',rot:'#B4532A',blau:'#3E7BE6',pink:'#E86AA6',grau:'#A9A8B2',weiss:'#ECEBF2'};
let AVN=0;
const shade=(h,f)=>{const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const m=f<0?0:255,k=Math.abs(f);r=Math.round(r+(m-r)*k);g=Math.round(g+(m-g)*k);b=Math.round(b+(m-b)*k);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
const av2=o=>{const id='a'+(AVN++),a=o.age,st=a<3?0:a<10?1:a<18?2:a<50?3:a<70?4:5,mood=o.mood||'zufrieden';
  const cx=60,r=[30,28,27,26,26,26][st],cy=[62,58,56,54,54,55][st],sw=[24,28,32,36,36,35][st];
  let skin=SKIN2[o.skin||0];if(mood==='krank')skin=shade(skin,.0);
  let hc=HAIRC[o.hairCol||'braun'];if(st===4&&!o.dye)hc=shade(hc,.35);if(st===5&&!o.dye)hc=HAIRC.weiss;
  const top=TOPS[o.top||'tshirt'],sh=shade(skin,-.12);
  let s='<svg class="av2 m-'+mood+'" viewBox="0 0 120 120" width="'+(o.size||120)+'" height="'+(o.size||120)+'" aria-hidden="true" style="display:block;--d:'+((AVN%9)*.47).toFixed(2)+'s"><defs>'+
   '<radialGradient id="'+id+'bg" cx="30%" cy="20%" r="90%"><stop offset="0" stop-color="'+(mood==='traurig'?'#4C5A8C':mood==='krank'?'#5C7A6A':'#7B4BE0')+'"/><stop offset=".6" stop-color="'+(mood==='traurig'?'#2C3358':mood==='krank'?'#2F4A40':'#13B3A6')+'"/><stop offset="1" stop-color="'+(mood==='strahlend'?'#F2994A':'#1C1236')+'"/></radialGradient>'+
   '<radialGradient id="'+id+'sk" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="'+shade(skin,.12)+'"/><stop offset="1" stop-color="'+skin+'"/></radialGradient>'+
   '<clipPath id="'+id+'c"><circle cx="60" cy="60" r="58"/></clipPath>'+(top.pat||'').replace(/PID/g,id)+'</defs>'+
   '<circle cx="60" cy="60" r="58" fill="url(#'+id+'bg)"/><g clip-path="url(#'+id+'c)">';
  // Haare hinten
  const H=HAIRS[o.hair||'kurz'];if(H.back&&st>0)s+=H.back(cx,cy,r,hc);
  // Körper atmet
  s+='<g class="torso">'+top.draw(cx,cy+r,sw,o.topCol||top.col,id,st)+(o.jacket&&JACKETS[o.jacket]?JACKETS[o.jacket].draw(cx,cy+r,sw):'')+
    (o.jewel==='kette'?'<path d="M'+(cx-9)+' '+(cy+r+6)+' Q'+cx+' '+(cy+r+17)+' '+(cx+9)+' '+(cy+r+6)+'" stroke="#F6C453" stroke-width="1.8" fill="none"/><circle cx="'+cx+'" cy="'+(cy+r+15)+'" r="2.4" fill="#F6C453"/>':'')+'</g>';
  // Hals, Kopf
  s+='<g class="head"><rect x="'+(cx-7)+'" y="'+(cy+r-8)+'" width="14" height="14" rx="5" fill="'+sh+'"/>';
  if(o.top==='rolli')s+='<rect x="'+(cx-9)+'" y="'+(cy+r-2)+'" width="18" height="9" rx="4" fill="'+shade(TOPS.rolli.col,-.1)+'"/>';
  s+='<ellipse cx="'+(cx-r)+'" cy="'+(cy+2)+'" rx="4.5" ry="6" fill="'+sh+'"/><ellipse cx="'+(cx+r)+'" cy="'+(cy+2)+'" rx="4.5" ry="6" fill="'+sh+'"/>'+
    (o.jewel==='ohrringe'?'<circle cx="'+(cx-r)+'" cy="'+(cy+8)+'" r="2.2" fill="#F6C453"/><circle cx="'+(cx+r)+'" cy="'+(cy+8)+'" r="2.2" fill="#F6C453"/>':'')+
    '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+r+'" ry="'+(r*1.06)+'" fill="url(#'+id+'sk)"/>';
  if(mood==='krank')s+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+r+'" ry="'+(r*1.06)+'" fill="#7BC47F" opacity=".22"/>';
  // Gesicht
  const ey=cy-1+(st===0?4:0),ex=st===0?9.5:9.5,es=st===0?3.8:st<3?3.5:3.3;
  const lid=mood==='muede'||mood==='krank';
  s+='<g class="eyes" style="transform-origin:'+cx+'px '+ey+'px">'+[-1,1].map(d=>{const x=cx+d*ex;return '<ellipse cx="'+x+'" cy="'+ey+'" rx="'+(es+1)+'" ry="'+(es+1.2)+'" fill="#fff"/><circle cx="'+x+'" cy="'+(ey+.3)+'" r="'+es+'" fill="#3B2A22"/><circle cx="'+(x+1)+'" cy="'+(ey-1)+'" r="1.1" fill="#fff"/>'+
    (lid?'<path d="M'+(x-es-1.5)+' '+(ey-es-1.5)+'h'+(2*es+3)+'v'+(es+1.2)+'h-'+(2*es+3)+'z" fill="'+skin+'"/><path d="M'+(x-es-1)+' '+(ey-.3)+'h'+(2*es+2)+'" stroke="'+sh+'" stroke-width="1"/>':'')}).join('')+'</g>';
  if(mood==='muede')s+=[-1,1].map(d=>'<path d="M'+(cx+d*ex-3)+' '+(ey+5)+' q3 2 6 0" stroke="#9C7BB0" stroke-width="1.2" fill="none" opacity=".7"/>').join('');
  // Brauen nach Stimmung
  const bt={strahlend:[-2.5,0],zufrieden:[-1.5,0],muede:[-1,.5],traurig:[0,2.2],krank:[0,1.6]}[mood]||[-1.5,0];
  if(st>0)s+=[-1,1].map(d=>'<path d="M'+(cx+d*(ex+3.5))+' '+(ey-6+bt[0]+bt[1])+' L'+(cx+d*(ex-3))+' '+(ey-6+bt[0]-bt[1]*.6)+'" stroke="'+shade(hc,-.15)+'" stroke-width="'+(st>=3?2:1.6)+'" stroke-linecap="round"/>').join('');
  if(st>0)s+='<path d="M'+(cx-1.8)+' '+(ey+7.5)+' q1.8 1.8 3.6 0" stroke="'+shade(skin,-.25)+'" stroke-width="1.3" fill="none" stroke-linecap="round"/>';
  // Mund
  const my=cy+r*.48,mw=st===0?4:5;
  s+=({strahlend:'<path d="M'+(cx-mw-1)+' '+(my-1)+' Q'+cx+' '+(my+7)+' '+(cx+mw+1)+' '+(my-1)+'Z" fill="#8E2E3E"/><path d="M'+(cx-mw+1)+' '+my+' Q'+cx+' '+(my+2)+' '+(cx+mw-1)+' '+my+'" fill="#fff"/>',
    zufrieden:'<path d="M'+(cx-mw)+' '+my+' Q'+cx+' '+(my+4.5)+' '+(cx+mw)+' '+my+'" stroke="#8E3E3E" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    muede:'<path d="M'+(cx-mw+1)+' '+(my+1)+' h'+(2*mw-2)+'" stroke="#8E3E3E" stroke-width="1.8" stroke-linecap="round"/>',
    traurig:'<path d="M'+(cx-mw)+' '+(my+3)+' Q'+cx+' '+(my-2)+' '+(cx+mw)+' '+(my+3)+'" stroke="#8E3E3E" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    krank:'<path d="M'+(cx-mw)+' '+(my+2)+' q'+mw/2+' -2 '+mw+' 0 t'+mw+' 0" stroke="#8E3E3E" stroke-width="1.6" fill="none" stroke-linecap="round"/>'})[mood];
  if(mood==='strahlend'||mood==='zufrieden')s+='<circle cx="'+(cx-ex-3)+'" cy="'+(my-3)+'" r="3.4" fill="#FF7B8F" opacity=".28"/><circle cx="'+(cx+ex+3)+'" cy="'+(my-3)+'" r="3.4" fill="#FF7B8F" opacity=".28"/>';
  if(mood==='traurig')s+='<path class="tear" d="M'+(cx+ex+1)+' '+(ey+4)+' q-1.6 3 0 4.4 q1.6 -1.4 0 -4.4z" fill="#8FD3FF"/>';
  if(mood==='krank')s+='<path d="M'+(cx+r-4)+' '+(cy-r*.6)+' q-2 4 0 5.5 q2 -1.5 0 -5.5z" fill="#8FD3FF"/>';
  // Falten im Alter
  if(st>=4)s+=[-1,1].map(d=>'<path d="M'+(cx+d*(ex+4.5))+' '+(ey-1)+' l'+d*2.5+' -1.5 M'+(cx+d*(ex+4.5))+' '+(ey+1.5)+' l'+d*2.5+' 1" stroke="'+sh+'" stroke-width=".9"/>').join('')+'<path d="M'+(cx-mw-3)+' '+(my-4)+' q-1 3 0 5 M'+(cx+mw+3)+' '+(my-4)+' q1 3 0 5" stroke="'+sh+'" stroke-width=".9" fill="none"/>';
  if(st>=5)s+='<path d="M'+(cx-8)+' '+(cy-r*.62)+' q8 -2 16 0 M'+(cx-6)+' '+(cy-r*.5)+' q6 -1.5 12 0" stroke="'+sh+'" stroke-width=".8" fill="none"/>';
  // Bart
  if(o.beard&&st>=3)s+='<path d="M'+(cx-r+3)+' '+(cy+2)+' Q'+(cx-r+4)+' '+(cy+r+4)+' '+cx+' '+(cy+r+5)+' Q'+(cx+r-4)+' '+(cy+r+4)+' '+(cx+r-3)+' '+(cy+2)+' Q'+(cx+r-8)+' '+(my+5)+' '+cx+' '+(my+4)+' Q'+(cx-r+8)+' '+(my+5)+' '+(cx-r+3)+' '+(cy+2)+'Z" fill="'+hc+'" opacity="'+(o.beard==='voll'?.95:.45)+'"/>';
  // Haare vorne
  if(st===0)s+='<path d="M'+(cx-3)+' '+(cy-r+1)+' q3 -7 6 -1 q2 -5 5 -1" stroke="'+hc+'" stroke-width="2.4" fill="none" stroke-linecap="round"/>';else if(H.front)s+=H.front(cx,cy,r,hc);
  // Kopf-Accessoires und Brillen
  if(o.headw&&HEADW[o.headw])s+=HEADW[o.headw](cx,cy,r);
  const gl=o.glasses||(st===5&&o.oldGlasses!==false?'lese':null);if(gl&&GLASSES[gl])s+=GLASSES[gl](cx,ey,ex,es);
  s+='</g></g><circle cx="60" cy="60" r="58" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/></svg>';return s}
const hcap=(cx,cy,r,c,lift)=>'<path d="M'+(cx-r-1.5)+' '+(cy+2-(lift||0))+' C'+(cx-r-2)+' '+(cy-r*1.45)+' '+(cx+r+2)+' '+(cy-r*1.45)+' '+(cx+r+1.5)+' '+(cy+2-(lift||0))+' C'+(cx+r*.75)+' '+(cy-r*.55)+' '+(cx-r*.15)+' '+(cy-r*.85)+' '+(cx-r-1.5)+' '+(cy+2-(lift||0))+'Z" fill="'+c+'"/>';
const HAIRS={
 kurz:{n:'Kurz',front:(cx,cy,r,c)=>hcap(cx,cy,r,c,4)},
 locken:{n:'Locken',front:(cx,cy,r,c)=>hcap(cx,cy,r,c,2)+[...Array(7)].map((_,i)=>{const a=Math.PI*(1.05+i*.15);return '<circle cx="'+(cx+Math.cos(a)*r*1.02)+'" cy="'+(cy-6+Math.sin(a)*r*1.02)+'" r="5.6" fill="'+c+'"/>'}).join('')},
 lang:{n:'Lang offen',back:(cx,cy,r,c)=>'<path d="M'+(cx-r-3)+' '+(cy-4)+' Q'+(cx-r-6)+' '+(cy+r+22)+' '+(cx-r+4)+' '+(cy+r+26)+' L'+(cx+r-4)+' '+(cy+r+26)+' Q'+(cx+r+6)+' '+(cy+r+22)+' '+(cx+r+3)+' '+(cy-4)+'Z" fill="'+shade(c,-.12)+'"/>',front:(cx,cy,r,c)=>hcap(cx,cy,r,c,-6)},
 dutt:{n:'Dutt',back:(cx,cy,r,c)=>'<circle cx="'+cx+'" cy="'+(cy-r-7)+'" r="9" fill="'+shade(c,-.08)+'"/>',front:(cx,cy,r,c)=>hcap(cx,cy,r,c,2)},
 zoepfe:{n:'Zöpfe',back:(cx,cy,r,c)=>[-1,1].map(d=>[0,1,2,3].map(i=>'<ellipse cx="'+(cx+d*(r+3))+'" cy="'+(cy+6+i*8)+'" rx="4.6" ry="5" fill="'+shade(c,-.1*(i%2))+'"/>').join('')).join(''),front:(cx,cy,r,c)=>hcap(cx,cy,r,c,-2)},
 undercut:{n:'Undercut',front:(cx,cy,r,c)=>'<path d="M'+(cx-r)+' '+(cy-4)+' Q'+cx+' '+(cy-r*1.1)+' '+(cx+r)+' '+(cy-4)+'" stroke="'+c+'" stroke-width="2" fill="none" opacity=".4"/><path d="M'+(cx-r*.8)+' '+(cy-r*.55)+' C'+(cx-r*.6)+' '+(cy-r*1.55)+' '+(cx+r*1.1)+' '+(cy-r*1.5)+' '+(cx+r*.85)+' '+(cy-r*.6)+' C'+(cx+r*.3)+' '+(cy-r*.95)+' '+(cx-r*.3)+' '+(cy-r*.8)+' '+(cx-r*.8)+' '+(cy-r*.55)+'Z" fill="'+c+'"/>'},
 afro:{n:'Afro',back:(cx,cy,r,c)=>'<circle cx="'+cx+'" cy="'+(cy-4)+'" r="'+(r*1.45)+'" fill="'+c+'"/>',front:(cx,cy,r,c)=>'<path d="M'+(cx-r)+' '+(cy-5)+' Q'+cx+' '+(cy-r*1.05)+' '+(cx+r)+' '+(cy-5)+'" stroke="'+c+'" stroke-width="5" fill="none"/>'},
 glatze:{n:'Glatze',front:(cx,cy,r,c)=>'<path d="M'+(cx-r+1)+' '+(cy-2)+' q2 -6 6 -8 M'+(cx+r-1)+' '+(cy-2)+' q-2 -6 -6 -8" stroke="'+c+'" stroke-width="3" fill="none" opacity=".8"/><ellipse cx="'+(cx-6)+'" cy="'+(cy-r*.75)+'" rx="5" ry="2.4" fill="#fff" opacity=".25"/>'}};
const neckV=(cx,y,w)=>'<path d="M'+(cx-7)+' '+(y-2)+' Q'+cx+' '+(y+6)+' '+(cx+7)+' '+(y-2)+'" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1.5"/>';
const torso=(cx,y,w,c)=>'<path d="M'+(cx-w)+' 124 C'+(cx-w)+' '+(y+12)+' '+(cx-w*.6)+' '+(y+2)+' '+(cx-11)+' '+y+' L'+(cx+11)+' '+y+' C'+(cx+w*.6)+' '+(y+2)+' '+(cx+w)+' '+(y+12)+' '+(cx+w)+' 124Z" fill="'+c+'"/>';
const TOPS={
 tshirt:{n:'T-Shirt Basic',col:'#13B3A6',draw:(cx,y,w,c)=>torso(cx,y,w,c)+neckV(cx,y,w)},
 streifen:{n:'Streifenshirt',col:'#F4F1EA',pat:'<pattern id="PIDst" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#F4F1EA"/><rect width="6" height="2.4" fill="#2A3458"/></pattern>',draw:(cx,y,w,c,id)=>torso(cx,y,w,'url(#'+id+'st)')+neckV(cx,y,w)},
 hoodie:{n:'Hoodie',col:'#6C5CE7',draw:(cx,y,w,c)=>'<path d="M'+(cx-15)+' '+(y+2)+' Q'+cx+' '+(y-10)+' '+(cx+15)+' '+(y+2)+'" fill="'+shade(c,-.2)+'"/>'+torso(cx,y,w,c)+'<path d="M'+(cx-4)+' '+(y+4)+' v12 M'+(cx+4)+' '+(y+4)+' v12" stroke="#fff" stroke-width="1.4"/><rect x="'+(cx-12)+'" y="'+(y+20)+'" width="24" height="10" rx="3" fill="'+shade(c,-.12)+'"/>'},
 hemd:{n:'Hemd',col:'#EEF2F7',draw:(cx,y,w,c)=>torso(cx,y,w,c)+'<path d="M'+(cx-10)+' '+(y-1)+' l10 9 l10 -9 l-3 8 l-7 1 l-7 -1z" fill="#fff" stroke="#C9D2DE" stroke-width=".8"/>'+[0,1,2].map(i=>'<circle cx="'+cx+'" cy="'+(y+12+i*6)+'" r=".9" fill="#9AA6B6"/>').join('')},
 strick:{n:'Strickpulli',col:'#C0703E',draw:(cx,y,w,c)=>torso(cx,y,w,c)+[...Array(7)].map((_,i)=>'<path d="M'+(cx-w+6+i*(w*2-12)/6)+' '+(y+8)+' v30" stroke="'+shade(c,-.12)+'" stroke-width="1.4"/>').join('')+'<path d="M'+(cx-10)+' '+(y+1)+' Q'+cx+' '+(y+7)+' '+(cx+10)+' '+(y+1)+'" stroke="'+shade(c,-.2)+'" stroke-width="3" fill="none"/>'},
 rolli:{n:'Rollkragen',col:'#2B2B3A',draw:(cx,y,w,c)=>torso(cx,y,w,c)},
 kleid:{n:'Sommerkleid',col:'#F7A8C2',draw:(cx,y,w,c)=>torso(cx,y+3,w,c)+'<path d="M'+(cx-9)+' '+(y+3)+' v-5 M'+(cx+9)+' '+(y+3)+' v-5" stroke="'+c+'" stroke-width="2.4"/>'+[...Array(6)].map((_,i)=>'<circle cx="'+(cx-w+8+i*(w*2-16)/5)+'" cy="'+(y+16+(i%2)*8)+'" r="2.2" fill="#fff" opacity=".8"/>').join('')},
 sport:{n:'Sportdress',col:'#1E2E4E',draw:(cx,y,w,c)=>torso(cx,y,w,c)+'<path d="M'+(cx-w)+' '+(y+22)+' L'+(cx+w)+' '+(y+6)+'" stroke="#C6FF3D" stroke-width="4"/>'+neckV(cx,y,w)},
 anzug:{n:'Maßanzug',col:'#2A3458',draw:(cx,y,w,c)=>torso(cx,y,w,c)+'<path d="M'+(cx-9)+' '+y+' L'+cx+' '+(y+20)+' L'+(cx+9)+' '+y+'z" fill="#fff"/><path d="M'+cx+' '+(y+3)+' l-2.2 3 l2.2 14 l2.2 -14z" fill="#E8467C"/><path d="M'+(cx-11)+' '+y+' L'+(cx-2)+' '+(y+22)+' L'+(cx-7)+' '+(y+10)+'z M'+(cx+11)+' '+y+' L'+(cx+2)+' '+(y+22)+' L'+(cx+7)+' '+(y+10)+'z" fill="'+shade(c,-.25)+'"/>'},
 designer:{n:'Designer-Outfit',col:'#111318',draw:(cx,y,w,c)=>torso(cx,y,w,c)+'<path d="M'+(cx-10)+' '+(y+1)+' L'+cx+' '+(y+14)+' L'+(cx+10)+' '+(y+1)+'" stroke="#F6C453" stroke-width="1.6" fill="none"/><rect x="'+(cx+w*.35)+'" y="'+(y+14)+'" width="7" height="5" rx="1" fill="#F6C453"/>'},
 abendkleid:{n:'Abendkleid',col:'#8E1B3A',draw:(cx,y,w,c)=>torso(cx,y+4,w,c)+[...Array(9)].map((_,i)=>'<circle cx="'+(cx-w+6+(i*13)%(w*2-12))+'" cy="'+(y+10+(i*7)%22)+'" r=".9" fill="#FFD6E0"/>').join('')}};
const JACKETS={
 jeans:{n:'Jeansjacke',draw:(cx,y,w)=>'<path d="M'+(cx-w)+' 124 C'+(cx-w)+' '+(y+12)+' '+(cx-w*.6)+' '+(y+2)+' '+(cx-11)+' '+y+' L'+(cx-6)+' 124Z M'+(cx+w)+' 124 C'+(cx+w)+' '+(y+12)+' '+(cx+w*.6)+' '+(y+2)+' '+(cx+11)+' '+y+' L'+(cx+6)+' 124Z" fill="#4A6FA5"/><path d="M'+(cx-w*.7)+' '+(y+14)+' h'+(w*.5)+' M'+(cx+w*.2)+' '+(y+14)+' h'+(w*.5)+'" stroke="#8FB0DA" stroke-width="1"/>'},
 bomber:{n:'Bomberjacke',draw:(cx,y,w)=>'<path d="M'+(cx-w)+' 124 C'+(cx-w)+' '+(y+12)+' '+(cx-w*.6)+' '+(y+2)+' '+(cx-11)+' '+y+' L'+(cx-4)+' 124Z M'+(cx+w)+' 124 C'+(cx+w)+' '+(y+12)+' '+(cx+w*.6)+' '+(y+2)+' '+(cx+11)+' '+y+' L'+(cx+4)+' 124Z" fill="#4E5B3A"/><path d="M'+(cx-12)+' '+(y+1)+' Q'+cx+' '+(y+5)+' '+(cx+12)+' '+(y+1)+'" stroke="#E07A3E" stroke-width="3" fill="none"/>'},
 leder:{n:'Lederjacke',draw:(cx,y,w)=>'<path d="M'+(cx-w)+' 124 C'+(cx-w)+' '+(y+12)+' '+(cx-w*.6)+' '+(y+2)+' '+(cx-11)+' '+y+' L'+(cx-2)+' '+(y+18)+' L'+(cx-3)+' 124Z M'+(cx+w)+' 124 C'+(cx+w)+' '+(y+12)+' '+(cx+w*.6)+' '+(y+2)+' '+(cx+11)+' '+y+' L'+(cx+6)+' 124Z" fill="#1A1A1F"/><path d="M'+(cx-11)+' '+y+' l7 12 l-3 3z" fill="#2E2E36"/><path d="M'+(cx+4)+' '+(y+10)+' v24" stroke="#C9C9D2" stroke-width="1" stroke-dasharray="1.5 1.5"/>'},
 mantel:{n:'Mantel',draw:(cx,y,w)=>'<path d="M'+(cx-w)+' 124 C'+(cx-w)+' '+(y+12)+' '+(cx-w*.6)+' '+(y+2)+' '+(cx-11)+' '+y+' L'+(cx-3)+' 124Z M'+(cx+w)+' 124 C'+(cx+w)+' '+(y+12)+' '+(cx+w*.6)+' '+(y+2)+' '+(cx+11)+' '+y+' L'+(cx+3)+' 124Z" fill="#B88B5A"/><path d="M'+(cx-11)+' '+y+' L'+(cx-3)+' '+(y+16)+' L'+(cx-8)+' '+(y+16)+'z M'+(cx+11)+' '+y+' L'+(cx+3)+' '+(y+16)+' L'+(cx+8)+' '+(y+16)+'z" fill="#9A6F42"/>'},
 daune:{n:'Daunenjacke',draw:(cx,y,w)=>'<path d="M'+(cx-w-2)+' 124 C'+(cx-w-2)+' '+(y+10)+' '+(cx-w*.6)+' '+y+' '+(cx-12)+' '+(y-2)+' L'+(cx+12)+' '+(y-2)+' C'+(cx+w*.6)+' '+y+' '+(cx+w+2)+' '+(y+10)+' '+(cx+w+2)+' 124Z" fill="#E8467C"/>'+[0,1,2].map(i=>'<path d="M'+(cx-w)+' '+(y+10+i*9)+' Q'+cx+' '+(y+13+i*9)+' '+(cx+w)+' '+(y+10+i*9)+'" stroke="#B8305E" stroke-width="1.2" fill="none"/>').join('')+'<path d="M'+cx+' '+(y+2)+' v30" stroke="#B8305E" stroke-width="1.2"/>'}};
const HEADW={
 cap:(cx,cy,r)=>'<path d="M'+(cx-r-1)+' '+(cy-r*.35)+' C'+(cx-r)+' '+(cy-r*1.5)+' '+(cx+r)+' '+(cy-r*1.5)+' '+(cx+r+1)+' '+(cy-r*.35)+'Z" fill="#E8467C"/><path d="M'+(cx-r-1)+' '+(cy-r*.35)+' Q'+(cx+r*.2)+' '+(cy-r*.55)+' '+(cx+r+16)+' '+(cy-r*.2)+'" stroke="#B8305E" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="'+cx+'" cy="'+(cy-r*1.1)+'" r="1.6" fill="#B8305E"/>',
 beanie:(cx,cy,r)=>'<path d="M'+(cx-r-1)+' '+(cy-r*.3)+' C'+(cx-r)+' '+(cy-r*1.55)+' '+(cx+r)+' '+(cy-r*1.55)+' '+(cx+r+1)+' '+(cy-r*.3)+'Z" fill="#13B3A6"/><rect x="'+(cx-r-2)+'" y="'+(cy-r*.48)+'" width="'+(2*r+4)+'" height="7" rx="3" fill="#0E8C82"/><circle cx="'+cx+'" cy="'+(cy-r*1.3)+'" r="5" fill="#F4F1EA"/>',
 hut:(cx,cy,r)=>'<ellipse cx="'+cx+'" cy="'+(cy-r*.55)+'" rx="'+(r+12)+'" ry="5" fill="#3A2E2A"/><path d="M'+(cx-r*.75)+' '+(cy-r*.55)+' L'+(cx-r*.6)+' '+(cy-r*1.35)+' Q'+cx+' '+(cy-r*1.2)+' '+(cx+r*.6)+' '+(cy-r*1.35)+' L'+(cx+r*.75)+' '+(cy-r*.55)+'Z" fill="#4A3B35"/><rect x="'+(cx-r*.72)+'" y="'+(cy-r*.78)+'" width="'+(r*1.44)+'" height="4" fill="#C0703E"/>',
 band:(cx,cy,r)=>'<path d="M'+(cx-r)+' '+(cy-r*.5)+' Q'+cx+' '+(cy-r*.85)+' '+(cx+r)+' '+(cy-r*.5)+'" stroke="#F2994A" stroke-width="4.5" fill="none"/>'};
const GLASSES={
 sonne:(cx,ey,ex,es)=>[-1,1].map(d=>'<rect x="'+(cx+d*ex-es-2.5)+'" y="'+(ey-es-1)+'" width="'+(2*es+5)+'" height="'+(2*es+2)+'" rx="3" fill="#1A1A22" opacity=".92"/>').join('')+'<path d="M'+(cx-ex+es+2.5)+' '+(ey-1)+' h'+(2*ex-2*es-5)+'" stroke="#1A1A22" stroke-width="1.6"/>',
 horn:(cx,ey,ex,es)=>[-1,1].map(d=>'<rect x="'+(cx+d*ex-es-2.5)+'" y="'+(ey-es-1.5)+'" width="'+(2*es+5)+'" height="'+(2*es+3)+'" rx="2.5" fill="rgba(255,255,255,.12)" stroke="#3A2418" stroke-width="2"/>').join('')+'<path d="M'+(cx-ex+es+2.5)+' '+(ey-1)+' h'+(2*ex-2*es-5)+'" stroke="#3A2418" stroke-width="2"/>',
 pilot:(cx,ey,ex,es)=>[-1,1].map(d=>'<path d="M'+(cx+d*ex-es-2.5)+' '+(ey-es)+' h'+(2*es+5)+' q0 '+(2*es+3)+' -'+(es+2.5)+' '+(2*es+3)+' q-'+(es+2.5)+' 0 -'+(es+2.5)+' -'+(2*es+3)+'z" fill="#6B4A2A" opacity=".75" stroke="#D9B45A" stroke-width="1"/>').join('')+'<path d="M'+(cx-ex+es+2.5)+' '+(ey-es)+' h'+(2*ex-2*es-5)+'" stroke="#D9B45A" stroke-width="1"/>',
 lese:(cx,ey,ex,es)=>[-1,1].map(d=>'<circle cx="'+(cx+d*ex)+'" cy="'+(ey+.5)+'" r="'+(es+2.2)+'" fill="rgba(255,255,255,.15)" stroke="#8C8A98" stroke-width="1.3"/>').join('')+'<path d="M'+(cx-ex+es+2.2)+' '+ey+' h'+(2*ex-2*es-4.4)+'" stroke="#8C8A98" stroke-width="1.3"/>'};

const SHOPI={
 oben:['Oberteile',[['tshirt','T-Shirt Basic',25,1,''],['streifen','Streifenshirt',45,1,''],['hoodie','Hoodie',60,1,''],['hemd','Hemd',80,2,'Wirkt ordentlich'],['strick','Strickpulli',120,2,'Gemütlich: Glück +1 im Winter'],['rolli','Rollkragen',140,3,''],['sport','Sportdress',90,2,'Sport bringt 20 % mehr Fitness'],['kleid','Sommerkleid',150,2,''],['abendkleid','Abendkleid',2400,4,'Dates und Galas laufen besser'],['anzug','Maßanzug',1800,4,'Bewerbungen +5 %'],['designer','Designer-Outfit',4500,5,'Ruf +1 pro Jahr']]],
 jacke:['Jacken',[['jeans','Jeansjacke',90,1,''],['bomber','Bomberjacke',180,2,''],['daune','Daunenjacke',300,2,'Im Winter seltener krank'],['leder','Lederjacke',450,3,'Wirkt cool: Charme +'],['mantel','Mantel',600,3,'Wirkt seriös']]],
 kopf:['Kopf',[['band','Stirnband',15,1,''],['beanie','Mütze',25,1,''],['cap','Cap',30,1,''],['hut','Hut',70,2,'']]],
 brille:['Brillen',[['sonne','Sonnenbrille',90,1,''],['pilot','Pilotenbrille',160,2,''],['horn','Hornbrille',220,2,'Wirkt klug: Bewerbungen +3 %']]],
 schmuck:['Schmuck',[['ohrringe','Ohrringe',60,1,''],['kette','Goldkette',900,2,''],['smartwatch','Smartwatch',350,1,'Gesundheit +1 pro Jahr'],['luxusuhr','Luxusuhr',8000,4,'Ruf ++, aber Diebe werden aufmerksam']]],
 saison:['Saison',[['xmas','Weihnachtspulli',35,1,'Nur im Dezember. Familie freut sich'],['karneval','Karnevalskostüm',60,1,'Nur im Februar. Party-Bonus']]],
 friseur:['Friseur',[]]};
const LOOK={age:27,g:'w',skin:2,hair:'lang',hairCol:'braun',mood:'strahlend',top:'tshirt',jacket:null,headw:null,glasses:null,jewel:null};
const ART={
 wrist:(face,band,case_,extra)=>'<svg viewBox="0 0 120 120" width="110" height="110" aria-hidden="true"><defs><radialGradient id="wbg" cx="30%" cy="20%" r="90%"><stop offset="0" stop-color="#7B4BE0"/><stop offset=".6" stop-color="#13B3A6"/><stop offset="1" stop-color="#1C1236"/></radialGradient><linearGradient id="arm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3AE82"/><stop offset="1" stop-color="#C98E62"/></linearGradient></defs><circle cx="60" cy="60" r="58" fill="url(#wbg)"/><path d="M-6 74 Q40 66 70 60 L132 48 L132 92 L74 94 Q40 98 -6 100Z" fill="url(#arm)"/><path d="M96 54 q14 -4 26 -2 l0 40 q-12 3 -26 2z" fill="#E9B78C"/><rect x="47" y="56" width="18" height="46" rx="5" fill="'+band+'"/>'+case_+(extra||'')+'<circle cx="60" cy="60" r="58" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/></svg>',
 smartwatch:()=>ART.wrist(0,'#2B2B3A','<rect x="42" y="64" width="28" height="30" rx="8" fill="#111" stroke="#555" stroke-width="1.5"/><rect x="45" y="67" width="22" height="24" rx="5" fill="#0B1A2E"/><path d="M48 80 h4 l2 -5 l3 9 l2 -4 h6" stroke="#5CE1C6" stroke-width="1.6" fill="none"/><text x="56" y="74" font-size="5" fill="#fff" text-anchor="middle" font-weight="700">10:24</text><rect x="70" y="72" width="2.5" height="7" rx="1" fill="#555"/>'),
 luxusuhr:()=>ART.wrist(0,'#C9A24A','<circle cx="56" cy="79" r="16" fill="#E8C66A" stroke="#9C7A2A" stroke-width="2"/><circle cx="56" cy="79" r="12.5" fill="#0F2340"/>'+[...Array(12)].map((_,i)=>{const a=i*Math.PI/6;return '<circle cx="'+(56+Math.cos(a)*10.5).toFixed(1)+'" cy="'+(79+Math.sin(a)*10.5).toFixed(1)+'" r=".9" fill="#E8C66A"/>'}).join('')+'<path d="M56 79 L56 71 M56 79 L62 82" stroke="#E8C66A" stroke-width="1.6" stroke-linecap="round"/><rect x="72" y="76" width="3" height="6" rx="1" fill="#C9A24A"/>','<path d="M44 66 l3 3 M68 66 l-3 3" stroke="#fff" stroke-width="1.5" opacity=".7"/><circle cx="40" cy="60" r="1.6" fill="#fff"/><circle cx="74" cy="58" r="1.2" fill="#fff"/>'),
 ohrringe:()=>'<svg viewBox="0 0 120 120" width="110" height="110" aria-hidden="true"><defs><radialGradient id="ebg" cx="30%" cy="20%" r="90%"><stop offset="0" stop-color="#7B4BE0"/><stop offset=".6" stop-color="#13B3A6"/><stop offset="1" stop-color="#1C1236"/></radialGradient></defs><circle cx="60" cy="60" r="58" fill="url(#ebg)"/><ellipse cx="60" cy="86" rx="36" ry="10" fill="#3A1C4F" opacity=".6"/>'+[42,78].map(x=>'<circle cx="'+x+'" cy="46" r="3" fill="#F6C453"/><path d="M'+x+' 49 v6" stroke="#F6C453" stroke-width="1.6"/><circle cx="'+x+'" cy="66" r="11" fill="none" stroke="#F6C453" stroke-width="3.5"/><circle cx="'+(x-4)+'" cy="58" r="1.4" fill="#fff"/>').join('')+'<circle cx="60" cy="60" r="58" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/></svg>',
 kette:()=>'<svg viewBox="0 0 120 120" width="110" height="110" aria-hidden="true"><defs><radialGradient id="kbg" cx="30%" cy="20%" r="90%"><stop offset="0" stop-color="#7B4BE0"/><stop offset=".6" stop-color="#13B3A6"/><stop offset="1" stop-color="#1C1236"/></radialGradient></defs><circle cx="60" cy="60" r="58" fill="url(#kbg)"/><path d="M30 36 Q60 26 90 36 L84 96 Q60 104 36 96Z" fill="#2A1840"/><path d="M38 40 Q60 92 82 40" stroke="#F6C453" stroke-width="3" fill="none" stroke-dasharray="3 1.5"/><path d="M60 82 l-7 9 l7 9 l7 -9z" fill="#F6C453" stroke="#C98A12" stroke-width="1"/><circle cx="57" cy="88" r="1.5" fill="#fff"/><circle cx="60" cy="60" r="58" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/></svg>'};

const xmasTop={n:'Weihnachtspulli',col:'#B8233A',draw:(cx,y,w,c)=>torso(cx,y,w,c)+[...Array(5)].map((_,i)=>'<path d="M'+(cx-w+8+i*(w*2-16)/4)+' '+(y+16)+' l3 -5 l3 5z" fill="#2E8B57"/>').join('')+'<path d="M'+(cx-w)+' '+(y+26)+' H'+(cx+w)+'" stroke="#fff" stroke-width="2" stroke-dasharray="3 2"/>'};TOPS.xmas=xmasTop;
TOPS.karneval={n:'Karneval',col:'#F2C14E',draw:(cx,y,w,c)=>torso(cx,y,w,c)+[...Array(8)].map((_,i)=>'<circle cx="'+(cx-w+5+(i*11)%(w*2-10))+'" cy="'+(y+8+(i*9)%24)+'" r="2.4" fill="'+['#E8467C','#13B3A6','#7B4BE0'][i%3]+'"/>').join('')};/* ---------- Einbindung ins Spiel ---------- */
const _avOld=avatarSvg;
const AVCOL=['#F7B2C4','#5B9BE6','#13B3A6','#F08A24','#6C5CE7','#2FA88F'];
const avStage=a=>a<3?0:a<10?1:a<18?2:a<50?3:a<70?4:5;
const defHair=(P,st)=>{const i=(P.hair||0)%6;if(P.g==='m'){if(P.bald&&st>=4)return 'glatze';return st<=1?['kurz','kurz','locken','kurz','locken','kurz'][i]:['kurz','undercut','locken','kurz','afro','kurz'][i]}return st<=1?['zoepfe','lang','zoepfe','lang','locken','zoepfe'][i]:['lang','dutt','lang','locken','lang','zoepfe'][i]};
const OFMAP={hoodie:['hoodie'],bomber:['tshirt','bomber'],kleid:['kleid'],anzug:['anzug'],designer:['designer'],tarn:['strick'],blumen:['kleid'],punkte:['tshirt']};
const avMood=P=>{const st=P.st||{},gl=st.gl==null?70:st.gl,ge=st.ge==null?80:st.ge;
  if(P===p&&p){if(p.prison)return 'traurig';if(ge<22||(Object.keys(p.ill||{}).length&&ge<45))return 'krank'}
  if(gl>=78)return 'strahlend';if(gl<30)return 'traurig';if(ge<40)return 'muede';return 'zufrieden'};
avatarSvg=function(age,size,P,look){P=P||p;if(!P)return '';if(O.avClassic)return _avOld(age,size,P,look);look=look||P.look||{};const st=avStage(age),acc=look.acc||[];
  const o={age,size,skin:(P.skin||0)%5,mood:avMood(P),g:P.g};
  o.hair=look.hs&&st>=1?look.hs:defHair(P,st);if(o.hair==='glatze'&&P.g!=='m'&&!look.hs)o.hair='kurz';
  o.hairCol=look.hc&&HAIRC[look.hc]?look.hc:null;o.dye=!!(look.hc&&!String(look.hc).startsWith('alt'));
  let top=null,jk=null;
  if(look.o&&st>=2){const m=OFMAP[look.o];if(m){top=m[0];jk=m[1]||null;if(!m[1]&&typeof OF!=='undefined'&&OF[look.o]&&m[0]==='tshirt')o.topCol=OF[look.o][4]}else if(typeof OF!=='undefined'&&OF[look.o]){top='tshirt';o.topCol=OF[look.o][4]}}
  if(!top)top=look.top&&TOPS[look.top]?look.top:null;
  if(!top){top=st<=1?'tshirt':st===2?'hoodie':st===3?(P.g==='m'?'tshirt':'streifen'):st===4?'hemd':'strick';if(top==='tshirt'&&!look.top)o.topCol=AVCOL[((P.hair||0)+(P.skin||0)+st)%AVCOL.length]}
  if(st<2&&['anzug','designer','abendkleid'].includes(top))top='tshirt';o.top=top;
  if(st>=2){o.jacket=look.jk||jk||null;o.headw=look.hw||(acc.includes('hut')?'hut':null);o.glasses=look.gl||(acc.includes('brille')?'sonne':null);o.jewel=look.jw||(acc.includes('kette')?'kette':null)}
  else if(look.hw&&['cap','beanie','band'].includes(look.hw))o.headw=look.hw;
  if(!o.glasses&&P.glasses&&st>=4)o.glasses='lese';
  if(P.g==='m'&&P.beard&&age>=21)o.beard=age<40?'leicht':'voll';
  // Haarfarbe: Grundfarbe aus dem alten Modell, falls keine gewählt
  return av2(o)};
/* Haarfarbe aus dem alten Modell übernehmen */
{const H0=['#2B2118','#5A3A22','#A0652E','#D9A441','#1C1C1C','#8C3B1F'];H0.forEach((c,i)=>{HAIRC['alt'+i]=c})}
{const _as=avatarSvg;avatarSvg=function(age,size,P,look){P=P||p;if(!P||O.avClassic)return _as(age,size,P,look);const L=look||P.look||{};if(!L.hc){const L2=Object.assign({},L,{hc:'alt'+((P.hair||0)%6)});return _as(age,size,P,L2)}return _as(age,size,P,L)}}
/* ---------- Kleiderschrank und Shop ---------- */
const AVSLOT={oben:'top',jacke:'jk',kopf:'hw',brille:'gl',schmuck:'jw'};
const OLDID={hoodie:'hoodie',kleid:'kleid',anzug:'anzug',designer:'designer',bomber:'bomber',kette:'kette',hut:'hut',sonne:'brille'};
const avOwn=id=>id==='tshirt'||p.ward.includes('v:'+id)||(OLDID[id]&&p.ward.includes(OLDID[id]));
const avItem=(cat,id)=>(SHOPI[cat]&&SHOPI[cat][1].find(x=>x[0]===id));
const avMonth=()=>new Date().getMonth();
const SAISON={xmas:11,karneval:1};
const HPRICE=k=>k==='glatze'?15:k==='afro'||k==='zoepfe'?90:45;
let avCat='oben';
const avLook=()=>{p.look=p.look||{o:null,acc:[]};if(!p.look.acc)p.look.acc=[];return p.look};
const avWorn=(cat,id)=>{const L=avLook();if(cat==='saison')return L.top===id&&!L.o;if(id==='smartwatch'||id==='luxusuhr')return L.wa===id;if(cat==='oben')return L.top===id&&!L.o;return L[AVSLOT[cat]]===id};
const avStil=()=>{const L=avLook();let s=L.wa==='luxusuhr'?3:L.wa?1:0;Object.entries(AVSLOT).forEach(([c,k])=>{const it=L[k]&&avItem(c,L[k]);if(it)s+=it[3]});if(L.o&&typeof OF!=='undefined'&&OF[L.o])s=Math.max(s,OF[L.o][2]);return Math.min(8,s)};
{const _st=stil;stil=function(){let a=0;try{a=_st()}catch(e){errLog(e)}return Math.max(a,avStil())}}
const avAgeOk=(cat,id)=>{if(p.age<10)return cat==='oben'?['tshirt','streifen','hoodie','sport'].includes(id):cat==='kopf'||cat==='friseur';if(p.age<14)return !(cat==='jacke'||cat==='schmuck'||['anzug','designer','abendkleid'].includes(id));return true};
function viewAvShop(){const L=avLook(),s=stil();
  let h='<section class="card avshop"><div class="avbig">'+avatarSvg(p.age,132)+(L.wa&&ART[L.wa]?'<span class="avwa">'+ART[L.wa]().replace(/width="110" height="110"/,'width="46" height="46"')+'</span>':'')+'</div>'+
    '<div class="listseg" style="margin-top:6px"><b>Dein Stil</b><b>'+s+' von 8</b></div><div class="bar" style="margin:6px 0"><i style="width:'+s/8*100+'%;background:#C2408C"></i></div>'+
    '<p class="note">Ab Stil 5 steigt dein Aussehen jedes Jahr. Manche Teile haben eine Wirkung.</p>'+
    '<div class="avslots">'+Object.entries(AVSLOT).map(([c,k])=>{const it=L[k]&&avItem(c,L[k]);return '<span class="'+(it?'':'e')+'">'+SHOPI[c][0]+': '+(it?it[1]:'–')+'</span>'}).join('')+(L.wa?'<span>Uhr: '+(L.wa==='luxusuhr'?'Luxusuhr':'Smartwatch')+'</span>':'')+'</div>'+
    row('Shoppingtour','Bummeln und anprobieren · '+eur(px$(300))+' · +6 Glück, zweimal im Jahr',btn('tour',null,(p.tourN||0)>=2&&p.tourA===p.age?'Erledigt':'Los','o',((p.tourN||0)>=2&&p.tourA===p.age)||p.money<px$(300)))+'</section>';
  h+='<div class="avtabs">'+Object.entries(SHOPI).map(([k,v])=>'<button data-a="avcat" data-g="'+k+'" aria-pressed="'+(avCat===k)+'">'+v[0]+'</button>').join('')+'</div>';
  if(avCat==='friseur'){h+='<div class="wgrid">'+Object.entries(HAIRS).map(([k,H])=>{const on=(L.hs||'')===k,pr=px$(HPRICE(k)),ok=avAgeOk('friseur',k)&&!(k==='glatze'&&p.age<14);
      return '<div class="wcard'+(on?' on':'')+'"><div class="wav">'+avatarSvg(p.age,96,null,Object.assign({},L,{hs:k,hw:null,o:L.o}))+'</div><b>'+H.n+'</b><span class="note">'+eur(pr)+'</span>'+(on?'<span class="chip">Aktuell</span>':btn('avhair',k,'Schneiden','o',p.money<pr||!ok||p.age<6))+'</div>'}).join('')+'</div>';
    h+=card('Haarfarbe','<div class="avcols">'+Object.entries(HAIRC).filter(([k])=>!k.startsWith('alt')).map(([k,c])=>'<button data-a="avhc" data-g="'+k+'" style="background:'+c+'" aria-label="'+k+'" aria-pressed="'+(L.hc===k)+'"'+(p.age<12||p.money<px$(60)?' disabled':'')+'></button>').join('')+'<button data-a="avhc" data-g="" class="nat" aria-pressed="'+(!L.hc)+'">Natur</button></div><p class="note">Färben kostet '+eur(px$(60))+'.</p>');
    return h}
  h+='<div class="wgrid">'+SHOPI[avCat][1].map(([id,n,pr,st,eff])=>{const own=avOwn(id),on=avWorn(avCat,id),price=px$(pr),ok=avAgeOk(avCat,id),sm=SAISON[id];const notNow=sm!=null&&avMonth()!==sm&&!own;
    const prev=avCat==='schmuck'&&ART[id]?ART[id]().replace(/width="110" height="110"/,'width="96" height="96"'):avatarSvg(Math.max(p.age,avCat==='oben'||avCat==='kopf'?p.age:14),96,null,Object.assign({},L,{o:null},avCat==='saison'||avCat==='oben'?{top:id}:{[AVSLOT[avCat]]:id}));
    return '<div class="wcard'+(on?' on':'')+'">'+(st>=4?'<span class="avtag">Luxus</span>':sm!=null?'<span class="avtag s">Saison</span>':'')+'<div class="wav">'+prev+'</div><b>'+n+'</b><span class="stars small">'+'★'.repeat(st)+'</span><small class="aveff">'+(eff||'&nbsp;')+'</small>'+
      (!ok?'<span class="note">Noch zu jung</span>':own?btn('avwear',avCat+':'+id,on?'Ablegen':'Anziehen',on?'g':'o'):notNow?'<span class="note">'+(sm===11?'Nur im Dezember':'Nur im Februar')+'</span>':btn('avbuy',avCat+':'+id,eur(price),'o',p.money<price))+'</div>'}).join('')+'</div>';
  return h}
{const _vf=viewFreizeit;viewFreizeit=function(){const h=_vf();if(fTab!=='shop'||p.prison||O.avClassic)return h;const i=h.indexOf('</div>');return h.slice(0,i+6)+viewAvShop()}}
{const f=act;act=function(id,arg){
  if(id==='avcat'){avCat=arg;render();return}
  if(id==='avbuy'||id==='avwear'){const [c,k]=String(arg).split(':'),it=avItem(c,k),L=avLook();if(!it)return;
    if(id==='avbuy'){if(avOwn(k))return;if(!avAgeOk(c,k)){toast('Dafür bist du noch zu jung.');return}const pr=px$(it[2]);if(p.money<pr){toast('Das kostet '+eur(pr)+'.');return}p.money-=pr;p.ward.push('v:'+k);sfx&&sfx('tap')}
    const on=avWorn(c,k);
    if(c==='oben'||c==='saison'){L.o=null;L.top=on&&id==='avwear'?null:k}
    else if(k==='smartwatch'||k==='luxusuhr')L.wa=on&&id==='avwear'?null:k;
    else{const s=AVSLOT[c];L[s]=on&&id==='avwear'?null:k;if(s==='gl')L.acc=L.acc.filter(x=>x!=='brille');if(s==='hw')L.acc=L.acc.filter(x=>x!=='hut');if(s==='jw')L.acc=L.acc.filter(x=>x!=='kette')}
    if(id==='avbuy')done(it[1]+' gekauft und angezogen.');else{save();render()}return}
  if(id==='avhair'){if(!HAIRS[arg])return;const pr=px$(HPRICE(arg));if(p.money<pr)return;p.money-=pr;avLook().hs=arg;add('gl',2);done('Neuer Look beim Friseur: '+HAIRS[arg].n+'.');return}
  if(id==='avhc'){const L=avLook();if(!arg){L.hc=null;save();render();return}if(!HAIRC[arg]||p.money<px$(60))return;p.money-=px$(60);L.hc=arg;done('Frisch gefärbt.');return}
  return f(id,arg)}}
/* Wirkung der Kleidung */
{const _py=perkYear;perkYear=function(R0){_py(R0);try{if(!p||p.prison)return;const L=avLook();if(L.wa==='smartwatch')add('ge',1);if(L.top==='designer'&&!L.o||L.o==='designer')addRuf(1);
  if(L.wa==='luxusuhr'){addRuf(1);if(ch(.06)){L.wa=null;p.ward=p.ward.filter(x=>x!=='v:luxusuhr');add('gl',-6);log('Auf offener Straße wird dir die Luxusuhr vom Handgelenk gerissen.');news('Dreister Uhrenraub in der Innenstadt','polizei')}}
  if(L.top==='strick'&&!L.o)add('gl',1)}catch(e){errLog(e)}}}
{const _jm=jobMkt;jobMkt=function(){const L=p&&p.look||{};return _jm()+((L.top==='anzug'&&!L.o)||L.o==='anzug'?.05:0)+(L.gl==='horn'?.03:0)}}
{const _ve=viewEinst;viewEinst=function(){const h=_ve();if(typeof einTab==='undefined'||einTab!=='look')return h;return h+'<section class="card"><h2 class="h">Avatar</h2>'+tog('avClassic',!!O.avClassic,'Klassischer Avatar','Der alte, einfache Avatar ohne Stimmungen und Animationen')+'</section>'}}
}
