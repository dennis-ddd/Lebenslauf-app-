/* ---------- Avatar ---------- */
const STAGES=[0,6,14,18,21,30,50,80],STAGE_N=['Baby','Kind','Teenager','Volljährig','Anfang 20','Mitten im Leben','Best Ager','Senior/in'];
const stageOf=a=>{let s=0;STAGES.forEach((v,i)=>{if(a>=v)s=i});return s};
const SKIN=['#F6D3B8','#EBC09A','#C98E62','#9A643D','#6B4226'],HAIR=['#2B2118','#5A3A22','#A0652E','#D9A441','#1C1C1C','#8C3B1F'];
const SHIRT=['#F7B2C4','#5B9BE6','#6C5CE7','#2FA88F','#F08A24','#2B59C3','#8E6E53','#9AA5B8'];
const BGC=['#FDE8EF','#E3F1FF','#EDE9FF','#DDF5EE','#FFF0DD','#E3EAFA','#F3EAE0','#EEF0F4'];
function mix(a,b,t){const pa=parseInt(a.slice(1),16),pb=parseInt(b.slice(1),16);return '#'+[16,8,0].map(s=>Math.round(((pa>>s)&255)*(1-t)+((pb>>s)&255)*t).toString(16).padStart(2,'0')).join('')}
function avatarSvg(age,size,P,look){P=P||p;look=look||P.look;const s=stageOf(age),gl=P.st?P.st.gl:70,f=P.g!=='m';
  const skin=SKIN[P.skin||0],hair=s>=7?'#E9E9EC':(s===6?mix(HAIR[P.hair||0],'#BFC3CC',.55):HAIR[P.hair||0]);
  const cx=50,cy=s===0?50:(s===1?46:43),r=s===0?23:(s===1?20:18.5),sy=s===0?78:(s===1?70:66);
  let o='<svg viewBox="0 0 100 100" width="'+size+'" height="'+size+'" aria-hidden="true" style="display:block"><circle cx="50" cy="50" r="50" fill="'+BGC[s]+'"/>';
  if(f&&s>=1)o+='<path d="M'+(cx-r-3)+' '+cy+' Q'+(cx-r-6)+' '+(cy+r+16)+' '+(cx-r+4)+' '+(cy+r+18)+' L'+(cx+r-4)+' '+(cy+r+18)+' Q'+(cx+r+6)+' '+(cy+r+16)+' '+(cx+r+3)+' '+cy+' Z" fill="'+hair+'"/>';
  o+='<path d="M'+(s===0?26:16)+' 100 Q'+(s===0?28:18)+' '+(sy+4)+' 50 '+sy+' Q'+(s===0?72:82)+' '+(sy+4)+' '+(s===0?74:84)+' 100 Z" fill="'+(look&&look.o&&s>=2&&typeof OF!=='undefined'&&OF[look.o]?OF[look.o][4]:SHIRT[s])+'"/>'+(look&&look.o==='anzug'&&s>=2?'<path d="M46 '+sy+' L50 '+(sy+6)+' L54 '+sy+' Z" fill="#fff"/><path d="M49 '+(sy+6)+' l1 12 1-12z" fill="#D7263D"/>':'');
  o+='<rect x="'+(cx-5)+'" y="'+(cy+r-4)+'" width="10" height="'+(sy-cy-r+6)+'" rx="4" fill="'+skin+'"/>';
  if(s===2)o+='<path d="M38 '+(sy+1)+' Q50 '+(sy+10)+' 62 '+(sy+1)+'" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="3" stroke-linecap="round"/>';
  if(s===4)o+='<path d="M44 '+sy+' L50 '+(sy+8)+' L56 '+sy+' Z" fill="#fff"/>';
  if(s===5)o+='<path d="M40 '+(sy+1)+' L50 100 L46 100 L34 '+(sy+3)+' Z M60 '+(sy+1)+' L50 100 L54 100 L66 '+(sy+3)+' Z" fill="rgba(0,0,0,.2)"/>';
  if(s>=6)o+='<path d="M50 '+(sy+2)+' L50 100" stroke="rgba(0,0,0,.18)" stroke-width="2"/><circle cx="50" cy="'+(sy+12)+'" r="1.4" fill="rgba(0,0,0,.25)"/><circle cx="50" cy="'+(sy+21)+'" r="1.4" fill="rgba(0,0,0,.25)"/>';
  o+='<circle cx="'+(cx-r)+'" cy="'+(cy+2)+'" r="3.2" fill="'+skin+'"/><circle cx="'+(cx+r)+'" cy="'+(cy+2)+'" r="3.2" fill="'+skin+'"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+skin+'"/>';
  if(s===0)o+='<path d="M'+cx+' '+(cy-r+1)+' q-4 -7 3 -9 q-2 4 1 6" fill="none" stroke="'+hair+'" stroke-width="2.4" stroke-linecap="round"/>';
  else if(!f&&s>=6&&P.bald)o+=[-1,1].map(d=>'<path d="M'+(cx+d*r)+' '+(cy+2)+' Q'+(cx+d*r)+' '+(cy-r*.5)+' '+(cx+d*r*.6)+' '+(cy-r*.75)+'" fill="none" stroke="'+hair+'" stroke-width="4" stroke-linecap="round"/>').join('');
  else o+='<path d="M'+(cx-r-1)+' '+(cy+1)+' Q'+(cx-r-2)+' '+(cy-r*1.3)+' '+cx+' '+(cy-r*1.15)+' Q'+(cx+r+2)+' '+(cy-r*1.3)+' '+(cx+r+1)+' '+(cy+1)+' Q'+(cx+r*.7)+' '+(cy-r*.45)+' '+(cx+(f?-2:4))+' '+(cy-r*.55)+' Q'+(cx-r*.7)+' '+(cy-r*.4)+' '+(cx-r-1)+' '+(cy+1)+' Z" fill="'+hair+'"/>';
  const ey=cy+2,ex=r*.38,er=s===0?2.6:2.2;
  if(!f&&s>=5&&P.beard)o+='<path d="M'+(cx-r*.8)+' '+(cy+r*.2)+' Q'+(cx-r*.7)+' '+(cy+r+4)+' '+cx+' '+(cy+r+4)+' Q'+(cx+r*.7)+' '+(cy+r+4)+' '+(cx+r*.8)+' '+(cy+r*.2)+' Q'+cx+' '+(cy+r*.75)+' '+(cx-r*.8)+' '+(cy+r*.2)+' Z" fill="'+hair+'" opacity=".9"/>';
  o+='<circle cx="'+(cx-ex)+'" cy="'+ey+'" r="'+er+'" fill="#26201C"/><circle cx="'+(cx+ex)+'" cy="'+ey+'" r="'+er+'" fill="#26201C"/>';
  if(s<=1)o+='<circle cx="'+(cx-r*.62)+'" cy="'+(cy+r*.4)+'" r="3.4" fill="#F28C9B" opacity=".45"/><circle cx="'+(cx+r*.62)+'" cy="'+(cy+r*.4)+'" r="3.4" fill="#F28C9B" opacity=".45"/>';
  const my=cy+r*.48,mw=r*.32,ms='fill="none" stroke="#7A3B2E" stroke-width="2" stroke-linecap="round"';
  o+=gl>=60?'<path d="M'+(cx-mw)+' '+my+' Q'+cx+' '+(my+6)+' '+(cx+mw)+' '+my+'" '+ms+'/>':gl>=30?'<path d="M'+(cx-mw*.8)+' '+(my+1.5)+' L'+(cx+mw*.8)+' '+(my+1.5)+'" '+ms+'/>':'<path d="M'+(cx-mw)+' '+(my+4)+' Q'+cx+' '+(my-2)+' '+(cx+mw)+' '+(my+4)+'" '+ms+'/>';
  if(s>=6)o+='<path d="M'+(cx-r*.75)+' '+(ey-5)+' q3 -1.5 6 0 M'+(cx+r*.75-6)+' '+(ey-5)+' q3 -1.5 6 0" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1.2" stroke-linecap="round"/>';
  const acc=(look&&look.acc&&s>=2)?look.acc:[];
  if(acc.includes('kette'))o+='<path d="M42 '+(sy+2)+' Q50 '+(sy+12)+' 58 '+(sy+2)+'" fill="none" stroke="#E8B820" stroke-width="2"/><circle cx="50" cy="'+(sy+10)+'" r="2.2" fill="#E8B820"/>';
  if(acc.includes('hut'))o+='<ellipse cx="'+cx+'" cy="'+(cy-r*.62)+'" rx="'+(r+8)+'" ry="4" fill="#3A3F4B"/><path d="M'+(cx-r*.75)+' '+(cy-r*.62)+' Q'+(cx-r*.7)+' '+(cy-r*1.55)+' '+cx+' '+(cy-r*1.45)+' Q'+(cx+r*.7)+' '+(cy-r*1.55)+' '+(cx+r*.75)+' '+(cy-r*.62)+' Z" fill="#4A505E"/><rect x="'+(cx-r*.72)+'" y="'+(cy-r*.85)+'" width="'+(r*1.44)+'" height="3" fill="#C2408C"/>';
  if(acc.includes('brille'))o+='<g fill="#1B1F2A"><rect x="'+(cx-ex-5.5)+'" y="'+(ey-3.5)+'" width="11" height="7" rx="2.5"/><rect x="'+(cx+ex-5.5)+'" y="'+(ey-3.5)+'" width="11" height="7" rx="2.5"/><rect x="'+(cx-ex+5)+'" y="'+(ey-1.5)+'" width="'+(2*ex-10)+'" height="2"/></g>';
  else if(s===7||(s===6&&P.glasses))o+='<g fill="none" stroke="#3A3F4B" stroke-width="1.6"><circle cx="'+(cx-ex)+'" cy="'+ey+'" r="5"/><circle cx="'+(cx+ex)+'" cy="'+ey+'" r="5"/><path d="M'+(cx-ex+5)+' '+ey+' L'+(cx+ex-5)+' '+ey+'"/></g>';
  return o+'</svg>';
}

