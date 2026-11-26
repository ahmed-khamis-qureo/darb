(function(){
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const root=document.documentElement;
const fa=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const KEY='darb.v1';
const seed=[['إيه وسم العنوان الرئيسي في HTML؟','<h1>'],['إيه خاصية تغيير لون النص في CSS؟','color'],['إزاي تعرّف متغير ثابت في JavaScript؟','const'],['إيه رمز التعليق في بايثون؟','#'],['إيه الدالة اللي بتطبع في بايثون؟','print()'],['إيه الوسم اللي بيعمل رابط؟','<a>'],['إيه وحدة قياس بتتناسب مع حجم الشاشة؟','vw / %'],['إيه نوع بيانات True و False؟','Boolean']];
const def=()=>({tasks:[],cards:seed.map((c,i)=>({id:'s'+i,f:c[0],b:c[1]})),known:{},notes:'',focus:{},sessions:0,xp:0,days:[],done:0,hue:265,theme:'dark',goal:60,sound:true,best:0});
let S;
function load(){try{S=Object.assign(def(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){S=def()}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
load();
const dk=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>dk();
function streak(){let n=0;const d=new Date();if(!S.days.includes(dk(d)))d.setDate(d.getDate()-1);while(S.days.includes(dk(d))){n++;d.setDate(d.getDate()-1)}return n}
function mark(){const t=today();if(!S.days.includes(t))S.days.push(t);S.best=Math.max(S.best,streak())}
function totalMin(){return Object.values(S.focus).reduce((a,b)=>a+b,0)}
/* toast + confetti + sound */
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;$('#toasts').appendChild(e);setTimeout(()=>e.remove(),2900)}
const cv=$('#confetti'),cx=cv.getContext('2d');let parts=[],run=false;
function size(){cv.width=innerWidth;cv.height=innerHeight}size();addEventListener('resize',size);
function boom(x,y,n=70){const cs=['#ffd24a','#27e1c1','#7c5cff','#ff5d7a','#4f8cff'];for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=4+Math.random()*7;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-5,s:4+Math.random()*5,c:cs[i%5],r:Math.random()*6,l:70+Math.random()*30})}if(!run){run=true;fr()}}
function fr(){cx.clearRect(0,0,cv.width,cv.height);parts=parts.filter(p=>p.l-->0);parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.25;p.vx*=.99;p.r+=.2;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.globalAlpha=Math.min(1,p.l/30);cx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);cx.restore()});if(parts.length)requestAnimationFrame(fr);else{run=false;cx.clearRect(0,0,cv.width,cv.height)}}
let ac;function beep(seq){if(!S.sound)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();let t=ac.currentTime;seq.forEach(f=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;o.type='sine';o.connect(g);g.connect(ac.destination);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.25,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.start(t);o.stop(t+.32);t+=.22})}catch(e){}}
function buzz(p){if(S.sound&&navigator.vibrate)try{navigator.vibrate(p)}catch(e){}}
/* xp */
function addXp(n){const before=Math.floor(S.xp/100);S.xp+=n;const after=Math.floor(S.xp/100);save();renderLvl();if(after>before){toast('🎉 مستوى جديد: '+fa(after+1));beep([660,880,1100]);boom(innerWidth/2,innerHeight/3)}}
function renderLvl(){$('#lvlN').textContent='مستوى '+fa(Math.floor(S.xp/100)+1);$('#lvlBar').style.width=(S.xp%100)+'%'}
/* theme */
function applyTheme(){root.style.setProperty('--hue',S.hue);root.dataset.theme=S.theme;$('#hue').value=S.hue;$$('#themeSeg button').forEach(b=>b.classList.toggle('on',b.dataset.t===S.theme));$('#gVal').textContent=fa(S.goal);const sw=$('#soundSw');sw.classList.toggle('on',S.sound);sw.setAttribute('aria-checked',S.sound);const m=document.querySelector('meta[name=theme-color]');if(m)m.content=S.theme==='dark'?'#0a0b16':'#f4f1ff'}
/* navigation */
const order=['home','focus','tasks','cards','notes','stats'];
function go(name,push=true){if(!order.includes(name))name='home';$$('.view').forEach(v=>v.classList.toggle('active',v.id==='v-'+name));$$('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.go===name));$('#pill').style.setProperty('--i',order.indexOf(name));if(push)history.replaceState(null,'','#'+name);scrollTo({top:0});render(name);const v=$('#v-'+name);v.classList.remove('stg');void v.offsetWidth;v.classList.add('stg')}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)go(g.dataset.go)});
/* ripple + magnet */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn');if(!b)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';const d=Math.max(r.width,r.height);s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),600)});
$$('.magnet').forEach(b=>{b.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.25}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});
/* sheets */
function openSheet(id){const s=$(id);s.classList.add('open');s.setAttribute('aria-hidden','false')}
function closeSheets(){$$('.sheet.open').forEach(s=>{s.classList.remove('open');s.setAttribute('aria-hidden','true')})}
document.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeSheets()});
addEventListener('keydown',e=>{if(e.key==='Escape')closeSheets()});
$('#openSet').onclick=()=>openSheet('#setSheet');
/* HOME */
const quotes=['ابدأ بخمس دقايق بس، والباقي بيمشي لوحده.','خطوة صغيرة كل يوم أحسن من قفزة مرة في السنة.','التركيز مهارة، وبتتدرّب عليها.','اللي بيبدأ النهارده بيشكر نفسه بكرة.','مش لازم تكون مثالي، لازم تكون مستمر.'];
let qi=0;
function greet(){const h=new Date().getHours();return h<5?'سهران؟ 🌙':h<12?'صباح الخير ☀️':h<17?'نهارك سعيد 🌤':h<21?'مساء الخير 🌆':'ليلة سعيدة 🌙'}
function tweenNum(el,to){const from=+el.dataset.v||0;el.dataset.v=to;const t0=performance.now();(function s(t){const k=Math.min(1,(t-t0)/700),e=1-Math.pow(1-k,3);el.textContent=fa(Math.round(from+(to-from)*e));if(k<1)requestAnimationFrame(s)})(t0)}
const C1=326.7;
function renderHome(){$('#greet').textContent=greet();$('#quote').textContent=quotes[qi%quotes.length];
const m=S.focus[today()]||0;const k=Math.min(1,m/S.goal);const arc=$('#goalArc');arc.style.strokeDasharray=C1;arc.style.strokeDashoffset=C1*(1-k);tweenNum($('#goalMin'),m);
$('#goalTxt').textContent=m>=S.goal?'حققت هدفك! 🎉':'فاضل '+fa(S.goal-m)+' دقيقة على هدفك ('+fa(S.goal)+')';
tweenNum($('#streakN'),streak());tweenNum($('#hTasks'),S.tasks.filter(t=>!t.d).length);tweenNum($('#hCards'),S.cards.filter(c=>!S.known[c.id]).length);tweenNum($('#hSess'),S.sessions);tweenNum($('#hTotal'),totalMin())}
setInterval(()=>{const q=$('#quote');if(!q||!$('#v-home').classList.contains('active'))return;q.style.opacity=0;setTimeout(()=>{qi++;q.textContent=quotes[qi%quotes.length];q.style.opacity=1},500)},6000);
/* FOCUS */
const C2=565.5;let T={len:25,brk:false,running:false,end:0,left:25*60000,iv:null};
const tArc=$('#tArc');tArc.style.strokeDasharray=C2;
function fmt(ms){const s=Math.max(0,Math.ceil(ms/1000));return fa(String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'))}
function tRender(){const total=T.len*60000;$('#tTime').textContent=fmt(T.left);tArc.style.strokeDashoffset=C2*(1-T.left/total);const r=$('.tring');r.classList.toggle('run',T.running);r.classList.toggle('brk',T.brk);$('#tLabel').textContent=T.running?(T.brk?'استرخي شوية 🌿':'ركّز 🎯'):(T.left<total?'متوقف':'جاهز'+(T.brk?' للراحة':' للتركيز'));$('#tStart').textContent=T.running?'إيقاف مؤقت':(T.left<total?'كمّل':'ابدأ');document.title=T.running?fmt(T.left)+' | درب':'درب | مساعد المذاكرة'}
function tTick(){T.left=T.end-Date.now();if(T.left<=0){tFinish();return}tRender()}
function tStartStop(){if(T.running){clearInterval(T.iv);T.running=false;T.left=T.end-Date.now()}else{T.end=Date.now()+T.left;T.running=true;T.iv=setInterval(tTick,250);if(ac&&ac.state==='suspended')ac.resume();beep([])}tRender()}
function tFinish(){clearInterval(T.iv);T.running=false;if(!T.brk){const t=today();S.focus[t]=(S.focus[t]||0)+T.len;S.sessions++;mark();save();addXp(T.len);toast('🎉 خلصت جلسة '+fa(T.len)+' دقيقة');boom(innerWidth/2,innerHeight/2.5,110);setMode(5,true)}else{toast('الراحة خلصت، يلا نكمل');setMode(25,false)}buzz([200,100,200]);beep([784,988,1175]);renderHome()}
function setMode(m,brk){if(T.running){clearInterval(T.iv);T.running=false}T.len=m;T.brk=brk===undefined?m===5:brk;T.left=m*60000;$$('#modeSeg button').forEach(b=>b.classList.toggle('on',+b.dataset.m===m));tRender()}
$('#modeSeg').onclick=e=>{const b=e.target.closest('button');if(b)setMode(+b.dataset.m)};
$('#tStart').onclick=tStartStop;$('#tReset').onclick=()=>setMode(T.len,T.brk);
document.addEventListener('visibilitychange',()=>{if(T.running)tTick()});
/* TASKS */
let tf='all';
function renderTasks(){const l=$('#taskList');const list=S.tasks.filter(t=>tf==='all'||(tf==='open'?!t.d:t.d));l.replaceChildren(...list.map(t=>{const li=document.createElement('li');li.className='task'+(t.d?' done':'');li.dataset.id=t.id;const cols=['#27e1c1','#ffd24a','#ff5d7a'];li.innerHTML='<button class="ck" aria-label="تم">✓</button><span class="tx"></span><button class="pr" aria-label="الأهمية"></button><button class="del" aria-label="حذف">🗑</button>';li.querySelector('.tx').textContent=t.t;li.querySelector('.pr').style.background=cols[t.p||0];return li}));
$('#taskEmpty').style.display=list.length?'none':'block';const d=S.tasks.filter(t=>t.d).length;$('#taskBar').style.width=(S.tasks.length?d/S.tasks.length*100:0)+'%'}
function addTask(){const i=$('#taskIn'),v=i.value.trim();if(!v){i.focus();return}S.tasks.unshift({id:Date.now()+'',t:v,d:false,p:0});i.value='';save();renderTasks();buzz(15)}
$('#taskAdd').onclick=addTask;$('#taskIn').addEventListener('keydown',e=>{if(e.key==='Enter')addTask()});
$('#taskChips').onclick=e=>{const b=e.target.closest('button');if(!b)return;tf=b.dataset.f;$$('#taskChips button').forEach(x=>x.classList.toggle('on',x===b));renderTasks()};
$('#taskList').onclick=e=>{const li=e.target.closest('.task');if(!li)return;const t=S.tasks.find(x=>x.id===li.dataset.id);if(!t)return;
if(e.target.closest('.ck')){t.d=!t.d;if(t.d){S.done++;mark();save();const r=e.target.getBoundingClientRect();boom(r.left+r.width/2,r.top,28);beep([880]);buzz(20);addXp(5);if(S.tasks.every(x=>x.d)&&S.tasks.length>1){toast('خلصت كل مهامك! 🏆');boom(innerWidth/2,innerHeight/2.5,100)}}else{S.done=Math.max(0,S.done-1)}save();renderTasks()}
else if(e.target.closest('.pr')){t.p=((t.p||0)+1)%3;save();renderTasks()}
else if(e.target.closest('.del')){li.classList.add('leave');setTimeout(()=>{S.tasks=S.tasks.filter(x=>x!==t);save();renderTasks()},330)}};
/* CARDS */
let queue=[],cur=null;
function buildQueue(){queue=S.cards.filter(c=>!S.known[c.id]).map(c=>c.id)}
function cardById(id){return S.cards.find(c=>c.id===id)}
function renderCards(fresh){if(fresh||!queue.length&&S.cards.some(c=>!S.known[c.id]))buildQueue();else queue=queue.filter(id=>cardById(id));
const deck=$('#deck');deck.replaceChildren();const known=S.cards.filter(c=>S.known[c.id]).length;$('#cStat').textContent='عرفت '+fa(known)+' / '+fa(S.cards.length);
if(!queue.length){deck.innerHTML='<div class="done-deck"><b>'+(S.cards.length?'خلّصت كل البطاقات! 🎉':'مفيش بطاقات')+'</b><button class="btn primary" id="again">'+(S.cards.length?'ابدأ من الأول':'ضيف بطاقة')+'</button></div>';$('#again').onclick=()=>{if(S.cards.length){S.known={};save();renderCards(true)}else openAddSheet()};return}
queue.slice(0,3).reverse().forEach((id,idx,arr)=>{const depth=arr.length-1-idx,c=cardById(id);const el=document.createElement('div');el.className='fc';el.dataset.id=id;el.innerHTML='<div class="inner"><div class="face front"><small>السؤال</small><span class="ft"></span></div><div class="face back"><small>الإجابة</small><span class="bt"></span></div></div><span class="stamp y">عارفها</span><span class="stamp n">لسه</span>';el.querySelector('.ft').textContent=c.f;el.querySelector('.bt').textContent=c.b;
el.style.transform=depth?`translateY(${depth*12}px) scale(${1-depth*.05})`:'';el.style.zIndex=10-depth;if(!depth)attachDrag(el);deck.appendChild(el)})}
function decide(known,el){const id=el.dataset.id;el.style.transition='transform .45s ease,opacity .45s';const dir=known?1:-1;el.style.transform=`translateX(${dir*innerWidth}px) rotate(${dir*30}deg)`;el.style.opacity=0;
if(known){S.known[id]=true;mark();save();addXp(2);beep([700]);buzz(15)}else{queue.push(queue.shift());buzz(10)}
if(known)queue=queue.filter(x=>x!==id);setTimeout(()=>{renderCards(false);if(!queue.length&&S.cards.length){boom(innerWidth/2,innerHeight/2.5,100);toast('أحسنت! خلصت المجموعة 🏆')}},320)}
function attachDrag(el){let sx=0,dx=0,moved=false,on=false;const yes=el.querySelector('.stamp.y'),no=el.querySelector('.stamp.n');
el.addEventListener('pointerdown',e=>{on=true;moved=false;sx=e.clientX;dx=0;el.classList.add('drag');el.setPointerCapture(e.pointerId)});
el.addEventListener('pointermove',e=>{if(!on)return;dx=e.clientX-sx;if(Math.abs(dx)>6)moved=true;el.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;yes.style.opacity=Math.min(1,Math.max(0,dx/90));no.style.opacity=Math.min(1,Math.max(0,-dx/90))});
const end=()=>{if(!on)return;on=false;el.classList.remove('drag');if(Math.abs(dx)>90){decide(dx>0,el)}else{el.style.transform='';yes.style.opacity=no.style.opacity=0;if(!moved)el.classList.toggle('flip')}};
el.addEventListener('pointerup',end);el.addEventListener('pointercancel',()=>{on=false;el.classList.remove('drag');el.style.transform=''})}
$('#cYes').onclick=()=>{const el=$('#deck .fc:last-child');if(el)decide(true,el)};
$('#cNo').onclick=()=>{const el=$('#deck .fc:last-child');if(el)decide(false,el)};
/* add card sheet */
function renderClist(){$('#cList').replaceChildren(...S.cards.map(c=>{const li=document.createElement('li');li.innerHTML='<span><b></b><small></small></span><button aria-label="حذف">🗑</button>';li.querySelector('b').textContent=c.f;li.querySelector('small').textContent=c.b;li.querySelector('button').onclick=()=>{S.cards=S.cards.filter(x=>x!==c);delete S.known[c.id];save();renderClist();renderCards(true)};return li}))}
function openAddSheet(){renderClist();openSheet('#addSheet')}
$('#openAdd').onclick=openAddSheet;
$('#cSave').onclick=()=>{const f=$('#cFront').value.trim(),b=$('#cBack').value.trim();if(!f||!b){toast('اكتب السؤال والإجابة');return}S.cards.push({id:'c'+Date.now(),f,b});$('#cFront').value=$('#cBack').value='';save();renderClist();renderCards(true);toast('اتضافت البطاقة ✓');$('#cFront').focus()};
/* quiz */
let Q=[],qIdx=0,qScore=0,lock=false;
function startQuiz(){if(S.cards.length<3){toast('محتاج ٣ بطاقات على الأقل');return}const pool=[...S.cards].sort(()=>Math.random()-.5);Q=pool.slice(0,Math.min(5,pool.length)).map(c=>{const wrong=S.cards.filter(x=>x!==c&&x.b!==c.b).sort(()=>Math.random()-.5).slice(0,2).map(x=>x.b);return{q:c.f,a:c.b,o:[c.b,...wrong].sort(()=>Math.random()-.5)}});qIdx=0;qScore=0;$('#qs').textContent='⭐ ٠';openSheet('#quizSheet');qShow()}
function qShow(){lock=false;$('#fb').textContent='';$('#qn').textContent=fa(qIdx+1)+'/'+fa(Q.length);$('#qbar').style.width=(qIdx/Q.length*100)+'%';$('#qq').textContent=Q[qIdx].q;$('#opts').replaceChildren(...Q[qIdx].o.map(t=>{const b=document.createElement('button');b.type='button';b.className='opt';b.textContent=t;b.onclick=()=>qPick(b,t);return b}))}
function qPick(b,t){if(lock)return;lock=true;const ok=t===Q[qIdx].a;if(ok){b.classList.add('ok');qScore+=10;$('#qs').textContent='⭐ '+fa(qScore);$('#fb').textContent='صح! 🎉';const r=b.getBoundingClientRect();boom(r.left+r.width/2,r.top,40);beep([880,1100])}else{b.classList.add('no');[...$('#opts').children].find(x=>x.textContent===Q[qIdx].a).classList.add('ok');$('#fb').textContent='الإجابة الصح باللون الأخضر';buzz(80)}
setTimeout(()=>{qIdx++;qIdx<Q.length?qShow():qEnd()},1200)}
function qEnd(){$('#qbar').style.width='100%';$('#qq').textContent=qScore>=Q.length*10*.8?'أنت جامد! 🔥':qScore>=Q.length*10*.5?'مستواك حلو 👍':'كمّل مراجعة وهتوصل 💪';$('#opts').innerHTML='';$('#fb').textContent='نتيجتك: '+fa(qScore)+' من '+fa(Q.length*10);mark();addXp(Math.round(qScore/2));if(qScore>=Q.length*8)boom(innerWidth/2,innerHeight/2.5,110)}
$('#openQuiz').onclick=startQuiz;
/* NOTES */
const nt=$('#notes');let nTimer;
nt.value=S.notes;
function wc(){const w=nt.value.trim().split(/\s+/).filter(Boolean).length;$('#wc').textContent=fa(w)+' كلمة'}
nt.addEventListener('input',()=>{wc();$('#saved').style.opacity=.3;$('#saved').textContent='بيحفظ...';clearTimeout(nTimer);nTimer=setTimeout(()=>{S.notes=nt.value;save();$('#saved').textContent='محفوظ ✓';$('#saved').style.opacity=1},500)});
$('#clearNotes').onclick=function(){if(this.dataset.s){nt.value='';S.notes='';save();wc();this.textContent='مسح';delete this.dataset.s}else{this.dataset.s=1;this.textContent='متأكد؟ اضغط تاني';setTimeout(()=>{this.textContent='مسح';delete this.dataset.s},2500)}};
wc();
/* STATS */
const dn=['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];
function renderStats(){const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push({k:dk(d),n:dn[d.getDay()]})}const mx=Math.max(30,...days.map(d=>S.focus[d.k]||0));
const ch=$('#chart');ch.replaceChildren(...days.map((d,i)=>{const m=S.focus[d.k]||0,b=document.createElement('div');b.className='bar'+(i===6?' today':'');b.innerHTML='<u>'+fa(m)+'</u><i></i><span>'+d.n+'</span>';b.querySelector('i').dataset.h=Math.max(3,m/mx*100);return b}));
requestAnimationFrame(()=>requestAnimationFrame(()=>$$('#chart i').forEach(i=>i.style.height=i.dataset.h+'%')));
tweenNum($('#sTotal'),totalMin());tweenNum($('#sSess'),S.sessions);tweenNum($('#sDone'),S.done);tweenNum($('#sBest'),Math.max(S.best,streak()));
const B=[['🌱','أول جلسة',S.sessions>=1],['🔥','٣ أيام متتالية',Math.max(S.best,streak())>=3],['⏳','ساعة تركيز',totalMin()>=60],['✅','١٠ مهام',S.done>=10],['🃏','عرفت ٥ بطاقات',Object.keys(S.known).length>=5],['🏆','مستوى ٣',S.xp>=200]];
$('#badges').replaceChildren(...B.map(b=>{const d=document.createElement('div');d.className='bd'+(b[2]?' on':'');d.innerHTML='<span>'+b[0]+'</span>'+b[1];return d}))}
/* settings */
$('#hue').addEventListener('input',e=>{S.hue=+e.target.value;applyTheme()});$('#hue').addEventListener('change',save);
$('#themeSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.theme=b.dataset.t;save();applyTheme()};
$('#gMinus').onclick=()=>{S.goal=Math.max(10,S.goal-10);save();applyTheme();renderHome()};
$('#gPlus').onclick=()=>{S.goal=Math.min(300,S.goal+10);save();applyTheme();renderHome()};
$('#soundSw').onclick=()=>{S.sound=!S.sound;save();applyTheme()};
$('#exportBtn').onclick=()=>{const u=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='darb-backup.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);toast('تم تنزيل النسخة ✓')};
$('#importFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(typeof o!=='object'||!Array.isArray(o.tasks))throw 0;S=Object.assign(def(),o);save();nt.value=S.notes;applyTheme();renderLvl();closeSheets();go('home');toast('تم الاسترجاع ✓')}catch(x){toast('الملف مش صالح')}};r.readAsText(f);e.target.value=''};
$('#resetBtn').onclick=function(){if(this.dataset.s){S=def();save();nt.value='';wc();applyTheme();renderLvl();closeSheets();go('home');toast('اتمسحت البيانات');this.textContent='مسح كل البيانات';delete this.dataset.s}else{this.dataset.s=1;this.textContent='متأكد؟ اضغط تاني للمسح';setTimeout(()=>{this.textContent='مسح كل البيانات';delete this.dataset.s},3000)}};
/* render dispatcher */
function render(n){if(n==='home')renderHome();else if(n==='tasks')renderTasks();else if(n==='cards')renderCards(true);else if(n==='stats')renderStats();else if(n==='focus')tRender()}
applyTheme();renderLvl();setMode(25,false);
go((location.hash||'#home').slice(1),false);
if(location.hash.includes('demo')){}
addEventListener('hashchange',()=>go(location.hash.slice(1),false));
})();
