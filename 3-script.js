(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const root=document.documentElement;
/* theme + lamp */
const lamp=$('#lamp');
lamp.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark'});
/* fireflies */
const ff=$('#fireflies');
for(let i=0;i<16;i++){const s=document.createElement('i');s.style.cssText=`left:${20+Math.random()*60}%;top:${20+Math.random()*60}%;--x:${(Math.random()-.5)*80}px;--y:${(Math.random()-.5)*80}px;--d:${2+Math.random()*3}s`;ff.appendChild(s)}
/* nav */
const burger=$('#burger'),links=$('#links');
burger.addEventListener('click',()=>{const o=links.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
links.addEventListener('click',e=>{if(e.target.tagName==='A'){links.classList.remove('open');burger.setAttribute('aria-expanded',false)}});
/* progress */
addEventListener('scroll',()=>{const h=document.body.scrollHeight-innerHeight;$('#progress').style.width=(scrollY/h*100)+'%'},{passive:true});
/* reveal */
$$('.reveal').forEach((el,i)=>el.style.setProperty('--dl',(i%3)*.08+'s'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));
/* counters */
$$('[data-count]').forEach(el=>{const t=+el.dataset.count;let n=0;const step=()=>{n+=Math.max(1,t/40);if(n>=t){el.textContent=t+'+';return}el.textContent=Math.floor(n);requestAnimationFrame(step)};setTimeout(step,500)});
/* flip cards (tap on touch) */
$$('.flip').forEach(f=>f.addEventListener('click',()=>f.classList.toggle('on')));
/* particles bg */
const cv=$('#bg'),cx=cv.getContext('2d');let W,H,P=[];
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight;P=Array.from({length:Math.min(60,Math.floor(W/14))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))}
rs();addEventListener('resize',rs);
(function loop(){cx.clearRect(0,0,W,H);const dark=root.dataset.theme==='dark';cx.fillStyle=dark?'rgba(255,255,255,.55)':'rgba(20,23,46,.4)';
for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;cx.beginPath();cx.arc(p.x,p.y,1.6,0,7);cx.fill()}
cx.strokeStyle=dark?'rgba(124,92,255,.18)':'rgba(124,92,255,.15)';
for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);if(d<110){cx.beginPath();cx.moveTo(P[i].x,P[i].y);cx.lineTo(P[j].x,P[j].y);cx.stroke()}}
requestAnimationFrame(loop)})();
/* path slider with swipe */
const rail=$('#rail'),cards=$$('#rail .card'),dots=$('#dots');let idx=0;
cards.forEach((_,i)=>{const d=document.createElement('i');dots.appendChild(d)});
function go(i){idx=(i+cards.length)%cards.length;rail.style.transform=`translateX(${-idx*100}%)`;[...dots.children].forEach((d,k)=>d.classList.toggle('on',k===idx));cards.forEach((c,k)=>c.classList.toggle('active',k===idx))}
$('#next').onclick=()=>go(idx+1);$('#prev').onclick=()=>go(idx-1);go(0);
let sx=null;const vp=$('#viewport');
vp.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
vp.ontouchend=e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>40)go(idx+(dx<0?1:-1))};
/* tilt */
cards.forEach(c=>{c.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=c.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`rotateY(${x*10}deg) rotateX(${-y*10}deg)`});c.addEventListener('pointerleave',()=>c.style.transform='')});
/* cat */
const cat=$('#cat'),name=$('#nameIn'),pass=$('#passIn');
const pupils=$$('.eye b');
function look(f){pupils.forEach(p=>p.style.transform=`translate(${f}px,2px)`)}
name.addEventListener('input',()=>{look(Math.max(-5,Math.min(5,(name.value.length-6)*1)))});
name.addEventListener('focus',()=>{cat.classList.remove('hide');look(0)});
pass.addEventListener('focus',()=>cat.classList.add('hide'));
pass.addEventListener('blur',()=>cat.classList.remove('hide'));
$('#loginBtn').onclick=()=>{cat.classList.remove('hide');$('#hello').textContent=name.value.trim()?`أهلاً يا ${name.value.trim()}! 🎉`:'اكتب اسمك الأول 🙂'};
/* live editor */
const code=$('#code'),out=$('#out');
function run(){out.innerHTML=code.value.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/\son\w+=/gi,' data-x=')}
code.addEventListener('input',run);run();
/* team */
const team=[['سارة','مدرّسة الويب','#7c5cff'],['كريم','مدرّب بايثون','#27a6e1'],['منى','مصممة واجهات','#e1566b'],['يوسف','مشرف المشاريع','#27c18a']];
const tc=$('#tcards');team.forEach(t=>{const d=document.createElement('div');d.className='tc';d.style.background=`linear-gradient(160deg,${t[2]},#14172e)`;d.textContent=t[0][0];tc.appendChild(d)});
let ti=0;const tcs=[...tc.children];
function showT(){tcs.forEach((c,i)=>{let o=(i-ti+team.length)%team.length;if(o>team.length/2)o-=team.length;const a=Math.abs(o);c.style.transform=`translateX(${-o*58}%) scale(${1-a*.15}) rotateY(${o*-22}deg)`;c.style.opacity=a>1?0:1-a*.45;c.style.zIndex=10-a});$('#tname').textContent=team[ti][0];$('#trole').textContent=team[ti][1]}
$('#tnext').onclick=()=>{ti=(ti+1)%team.length;showT()};$('#tprev').onclick=()=>{ti=(ti-1+team.length)%team.length;showT()};showT();
tc.addEventListener('click',e=>{const i=tcs.indexOf(e.target);if(i>-1){ti=i;showT()}});
/* join */
$('#joinBtn').onclick=()=>{const m=$('#mail').value.trim();$('#joinMsg').textContent=/^\S+@\S+\.\S+$/.test(m)?'تمام! (نموذج تجريبي، مفيش بيانات اتبعتت) ✅':'اكتب إيميل صحيح'};
})();
