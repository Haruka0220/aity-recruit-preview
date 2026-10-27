const slides=[...document.querySelectorAll('.slide')];
const dots=[...document.querySelectorAll('.slide-dot')];
const pause=document.querySelector('.slide-pause');
const hero=document.querySelector('.hero');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let active=0,paused=reduced.matches,timer;
function showSlide(index){
 active=index;
 slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===index);slide.setAttribute('aria-hidden',String(i!==index));});
 dots.forEach((dot,i)=>{dot.classList.toggle('is-active',i===index);dot.setAttribute('aria-pressed',String(i===index));});
}
function syncPlayback(){
 clearInterval(timer);
 pause.textContent=paused?'▶':'Ⅱ';
 pause.setAttribute('aria-label',paused?'スライドショーを再生':'スライドショーを一時停止');
 const focusAllowsPlayback=!hero.matches(':focus-within')||document.activeElement===pause;
 if(!paused&&!document.hidden&&focusAllowsPlayback)timer=setInterval(()=>showSlide((active+1)%slides.length),6000);
}
dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);paused=true;syncPlayback();}));
pause.addEventListener('click',()=>{paused=!paused;syncPlayback();});
hero.addEventListener('focusin',()=>clearInterval(timer));
hero.addEventListener('focusout',()=>setTimeout(syncPlayback,0));
document.addEventListener('visibilitychange',syncPlayback);
reduced.addEventListener('change',()=>{if(reduced.matches)paused=true;syncPlayback();});
syncPlayback();
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#nav');
function closeMenu(){toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
window.matchMedia('(min-width:901px)').addEventListener('change',closeMenu);
