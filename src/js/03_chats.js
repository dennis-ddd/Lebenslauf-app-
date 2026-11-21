/* ---------- Chats ---------- */
const CHAT_SMALL={mama:['Hast du genug gegessen?','Kommst du am Sonntag zum Essen?','Papa hat schon wieder das WLAN kaputt gemacht.','Ich hab dir einen Artikel geschickt, lies den mal!','Zieh dich warm an, es wird kalt!'],
papa:['Wie läuft es so?','Hast du das Spiel gestern gesehen?','Ich hab den Keller aufgeräumt. Willst du deine alten Sachen?','Ich bin stolz auf dich.'],
freund:['Lust auf Kino?','Du glaubst nicht, was mir heute passiert ist','Wir müssen mal wieder was machen!','Hab dich vermisst!','Kennst du schon den neuen Song? Hör mal rein!']};
function contacts(){const c=[];
  if(!p.parentsGone)c.push({id:'mama',n:'Mama',col:'#E5527A',sub:'Familie'},{id:'papa',n:'Papa',col:'#2B59C3',sub:'Familie'});
  if(p.age>=6)c.push({id:'freund',n:p.friend,col:'#2FA88F',sub:'beste/r Freund/in'});
  if(p.partner)c.push({id:'partner',n:p.partner.name,col:'#C2408C',sub:p.partner.mar?'verheiratet':'Beziehung'});
  if(p.job)c.push({id:'chef',n:'Chef/in',col:'#6B7385',sub:p.job.t});
  if(p.rival&&O.rival&&p.age>=6)c.push({id:'rival',n:p.rival.n,col:'#D64545',sub:p.rival.friend?'Freund/in (früher Rivale)':'Rival/in'});
  p.kids.forEach((k,i)=>{if(p.age-k.b>=10)c.push({id:'kid'+i,n:k.n,col:'#F08A24',sub:'dein Kind'})});
  return c.map(x=>Object.assign(x,{msgs:(p.chats[x.id]||{}).msgs||[],un:(p.chats[x.id]||{}).un||0}));
}
function msg(id,t,me){const c=p.chats[id]||(p.chats[id]={msgs:[],un:0});c.msgs.push({t,me:!!me,a:p.age});if(c.msgs.length>40)c.msgs.shift();if(!me)c.un++}
function unread(){return contacts().reduce((s,c)=>s+c.un,0)}

