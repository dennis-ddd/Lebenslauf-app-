// Prüft den lebendigen Avatar (alle Alter, Stimmungen, Frisuren, Kleidung) und den neuen Kleiderschrank.
require('./lib/zufall').seed();
const pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),insertAdjacentHTML(){},setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,ageUp,act,av:(...a)=>avatarSvg(...a),viewFreizeit,viewEinst,setF:t=>fTab=t,setE:t=>einTab=t,O,get p(){return p},setDialog:f=>dialog=f};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};T.setDialog(()=>{});const bad=h=>/undefined|NaN|\[object|null"/.test(h);
T.newLife('Kim','Test','w',30,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'reich'});
const tops=['tshirt','streifen','hoodie','hemd','strick','rolli','kleid','sport','anzug','designer','abendkleid','xmas','karneval'],jk=['jeans','bomber','daune','leder','mantel'],hw=['band','beanie','cap','hut'],gl=['sonne','pilot','horn'],jw=['ohrringe','kette'],hs=['kurz','locken','lang','dutt','zoepfe','undercut','afro','glatze'],hc=['braun','schwarz','blond','rot','blau','pink','grau','weiss'];
let n=0;
for(let a=0;a<=100;a+=3)for(const g of ['w','m'])for(let k=0;k<6;k++){const P={g,skin:k%5,hair:k,st:{gl:pick([10,40,70,90]),ge:pick([10,35,60,90])},beard:k%2===0,bald:k%3===0,glasses:k%2===1,
  look:{o:pick([null,null,'hoodie','anzug','tarn','o_gold']),acc:pick([[],['brille'],['hut','kette']]),top:pick(tops),jk:pick([null,...jk]),hw:pick([null,...hw]),gl:pick([null,...gl]),jw:pick([null,...jw]),hs:pick([null,...hs]),hc:pick([null,...hc])}};
  const s=T.av(a,64,P);n++;ok('Avatar a='+a+' '+JSON.stringify(P.look),s.startsWith('<svg')&&s.includes('</svg>')&&!bad(s))}
// Stimmungen des Spielers
const p=T.p;[[90,90,'m-strahlend'],[60,80,'m-zufrieden'],[20,80,'m-traurig'],[60,30,'m-muede'],[60,10,'m-krank']].forEach(([g,h,c])=>{p.st.gl=g;p.st.ge=h;ok('Stimmung '+c,T.av(30,80).includes(c))});
// Kleiderschrank
p.money=1e6;T.setF('shop');['oben','jacke','kopf','brille','schmuck','saison','friseur'].forEach(c=>{T.act('avcat',c);const h=T.viewFreizeit();ok('Shop '+c,h.includes('avtabs')&&!/undefined|NaN/.test(h))});
T.act('avbuy','oben:anzug');ok('Anzug gekauft',p.ward.includes('v:anzug')&&p.look.top==='anzug');T.act('avbuy','jacke:mantel');T.act('avbuy','brille:horn');T.act('avbuy','schmuck:smartwatch');ok('Uhr',p.look.wa==='smartwatch');
T.act('avwear','jacke:mantel');ok('Jacke abgelegt',!p.look.jk);T.act('avhair','dutt');ok('Friseur',p.look.hs==='dutt');T.act('avhc','pink');ok('Färben',p.look.hc==='pink');
const ge0=p.st.ge;p.st.ge=50;for(let i=0;i<3;i++)T.ageUp();ok('Jahre vergehen',p.alive);
// Kinder dürfen keinen Anzug
T.newLife('Mia','Test','w',8,false);T.applyCfg({act:6,clock:false,ev:'aus',big:false,wealth:'reich'});T.p.money=1e5;T.act('avbuy','oben:anzug');ok('Kind ohne Anzug',!T.p.ward.includes('v:anzug'));
// Klassischer Avatar
T.O.avClassic=true;ok('Klassisch',!T.av(30,80).includes('av2'));T.O.avClassic=false;T.setE('look');ok('Einstellung',T.viewEinst().includes('avClassic'));
console.log('Avatare geprüft',n);console.log('errors',errs);process.exit(errs?1:0);
