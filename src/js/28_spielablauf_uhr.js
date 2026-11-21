/* ================= Spielablauf: Konfiguration und Tagesuhr ================= */
const DAYSTART=7*60,DAYEND=27*60;
const DUR={lesen:60,medi:30,pet:45,kidstime:120,lernen:120,schwaenzen:300,sport:90,jog:45,date:150,party:240,arzt:90,op:240,urlaub:480,lotto:10,race:60,klau:30,tasche:30,einbruch:180,bankraub:240,hack:180,
 apply:90,work:240,time:120,propose:120,baby:60,call:20,meet:120,love:5,sprecher:60,sp_train:120,sp_trial:180,mu_prac:90,mu_song:120,mu_gig:180,po_work:120,po_plak:120,po_camp:180,ga_job:180,kidtime:120,adoptkid:120,umzug:480,
 kurs:180,train:90,turnier:240,treat:120,tour:120,event:120,welt:600};
const cfg=()=>p.cfg||{act:6,clock:true,ev:'normal',big:true,wealth:'normal'};
const clockOn=()=>!!cfg().clock;
const actBase=()=>cfg().act?cfg().act:999;
const unl=()=>!cfg().act;
const clockTxt=()=>{const m=p.clock==null?DAYSTART:p.clock,h=Math.floor(m/60)%24;return String(h).padStart(2,'0')+':'+String(m%60).padStart(2,'0')};
const durTxt=m=>m>=60?(m%60?(m/60).toFixed(1).replace('.',','):m/60)+' Std.':m+' Min.';
const evRate=()=>({oft:.9,normal:.65,selten:.3,aus:0})[cfg().ev]??.65;
const bigOn=()=>cfg().big!==false;
function dayBar(){if(!clockOn())return '';const f=clamp(((p.clock||DAYSTART)-DAYSTART)/(DAYEND-DAYSTART)*100,0,100);return '<div class="dayb'+(p.act<=0?' over':'')+'"><span>07:00</span><div><i style="width:'+f.toFixed(1)+'%"></i></div><span>03:00</span></div>'}
let CUR='',LASTM=0;
function useAct(){
  const free=!!(FREEA[CUR]&&FREEA[CUR]());
  if(p.act<=0&&!(free&&clockOn()&&p.clock<DAYEND-10)){toast(clockOn()&&p.clock>=DAYEND-10?'Es ist 3 Uhr nachts. Zeit zu schlafen: Werde ein Jahr älter.':'Keine Aktionen mehr in diesem Jahr. Werde ein Jahr älter.');return false}
  const m=clockOn()?durOf(CUR):0;
  if(clockOn()&&p.clock+m>DAYEND){toast('Dafür reicht die Zeit nicht mehr ('+durTxt(m)+'). Es ist schon '+clockTxt()+'.');return false}
  if(!unl()&&!free)p.act--;LASTM=m;
  if(clockOn()){p.clock+=m;if(p.clock>=DAYEND-10){p.act=0;setTimeout(()=>toast('Es ist '+clockTxt()+'. Der Tag ist vorbei. Halte den Knopf, um ein Jahr älter zu werden.'),2700)}}
  if(!free)setTimeout(actWarn,700);return true}
function refundAct(){if(!unl())p.act++;if(clockOn()){p.clock-=LASTM;if(p.act<=0&&p.clock<DAYEND-10)p.act=1}}
function applyCfg(f){p.cfg={act:+f.act,clock:!!f.clock,ev:f.ev,big:!!f.big,wealth:f.wealth};p.act=actBase();p.clock=DAYSTART;
  if(!p.sb){if(f.wealth==='arm')p.money=0;if(f.wealth==='reich'){if(p.age>=18){p.money+=40000;log('Deine Familie ist wohlhabend: 40.000 € Startkapital.')}else p.trust=40000}}
  ensureLife();save();render()}
