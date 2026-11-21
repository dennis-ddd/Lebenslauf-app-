// Prüft Gefängnis-Aktionen, Wärter-Beruf, Arzt-Rabatt, Gratulieren und den Namen-Lader.
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
global.setInterval=()=>({});global.clearInterval=()=>{};global.setTimeout=f=>{try{f()}catch(e){}};
const els={};function el(id){return els[id]||(els[id]={id,innerHTML:'',style:{},children:[],addEventListener(){},classList:{s:new Set(),add(c){this.s.add(c)},remove(c){this.s.delete(c)},contains(c){return this.s.has(c)},toggle(){}},querySelectorAll:()=>[],querySelector:()=>({focus(){},click(){},addEventListener(){}}),setAttribute(){},dataset:{},value:''})}
global.document={getElementById:el,addEventListener(){},createElement:()=>({getContext:()=>null}),querySelector:()=>null,body:el('body')};global.window={scrollTo(){}};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
const fs=require('fs'),path=require('path');
let src=(s=>s.split('<script>')[1].split('</script>')[0])(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8')).trim();
src=src.replace(/^\{/,'').replace(/\}\s*$/,'')+';global.T={applyCfg,newLife,act,get p(){return p},viewJva,jvaYear,applyNames,FN,PROCLUBS,FR,PARTIES,setTab:v=>tab=v,render,viewStadt,setG:v=>G=v,cevMarkers,cityEvents,setMode:v=>cityMode=v};';eval(src);
let errs=0;const ok=(n,c)=>{if(!c){errs++;console.log('FEHLER',n)}};
const close=()=>el('modal').classList.remove('on');
// Insasse
T.newLife('A','B','w',30,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});let p=T.p;p.prison=4;p.act=6;
ok('jva-ansicht',T.viewJva().includes('Hofgang'));
const f0=p.sk.form;T.act('jva','hof');close();ok('hofgang',p.sk.form>f0&&p.act===5);
for(let i=0;i<3;i++){p.act=5;T.act('jva','werk');close()}ok('gute führung',p.good>=3);T.jvaYear();ok('frueher raus',p.prison===3);
['bib','schule','therapie','besuch','kontakte','tausch','anwalt','flucht'].forEach(k=>{p.act=5;if(!p.prison)p.prison=2;try{T.act('jva',k);close()}catch(e){errs++;console.log('ERR',k,e.message)}});
// Außenstehender
T.newLife('A','B','w',30,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});p=T.p;p.prison=0;p.job=null;
ok('kein zutritt',T.viewJva().includes('nur als Insasse'));const a0=p.act;T.act('jva','hof');ok('ausserhalb nichts',p.act===a0);
p.job={id:'waerter',t:'x',pay:36000,perf:50,yrs:0};ok('waerter',T.viewJva().includes('Dienst'));
// Arzt wird günstiger
p.hv=6;p.act=3;T.act('arzt');close();ok('arzt kostenlos ab 6',p.act===3);
// Namen-Lader
T.applyNames('# test\n[Vornamen weiblich]\nZoe\nIda\n[Läden]\n'+Object.keys(T.FR)[0]+' = Testladen\n[Profivereine]\nFC Test\n[Parteien]\nNeue Partei | Alles neu');
ok('namen',T.FN.join()==='Zoe,Ida'&&T.PROCLUBS[0]==='FC Test'&&T.FR[Object.keys(T.FR)[0]].n==='Testladen'&&T.PARTIES[0][0]==='Neue Partei');
// Stadt rendert
T.setTab('stadt');try{T.render();T.viewStadt()}catch(e){errs++;console.log('ERR stadt',e.message)}
// Marker hängen an Gebäuden: Projektion mit Kamera-Stub
global.THREE={Vector3:class{set(x,y,z){this.x=x;this.y=y;this.z=z;return this}project(){const X=this.x,Z=this.z;this.x=X/100;this.y=Z/100;this.z=.5;return this}}};
T.newLife('A','B','w',30,false);T.applyCfg({act:6,clock:false,ev:'normal',big:false,wealth:'normal'});
const cells=[{x:10,z:20,top:5,lots:[],place:'home'},{x:-30,z:40,top:0,lots:[{h:8}],place:null},{x:500,z:0,top:0,lots:[],place:null}];
T.setG({L:{cells},cam:{}});T.setMode('map');T.setTab('stadt');const cev=el('cev');cev.clientWidth=400;cev.clientHeight=300;
const ce=T.cityEvents();if(!ce.length)console.log('(keine Stadt-Ereignisse in diesem Jahr)');
cev.children=ce.map((e,i)=>({dataset:{},style:{}}));
T.cevMarkers();ce.forEach((e,i)=>{cev.children[i].dataset.ci=String(e.ci)});T.cevMarkers();
ce.forEach((e,i)=>{const s=cev.children[i].style;ok('marker '+i,e.ci!=null&&cells[e.ci]&&/translate/.test(s.transform));ok('marker verschieden '+i,ce.filter(x=>x.ci===e.ci).length===1)});
console.log('marker',cev.children.map(c=>c.style.transform+' '+c.style.display).join(' | '));
console.log('errors',errs);
