// One wheel/trackpad gesture advances one introductory screen.
// Touch and keyboard use native CSS snap; the recruitment flow stays free.
(() => {
 const scenes=[...document.querySelectorAll('.hero,.story-scene')];
 const flow=document.querySelector('.recruitment-flow');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!flow||!scenes.length)return;
 // Keep the entire wheel burst (including its decaying inertia) together.
 // Time since the last event, not time since navigation, ends a gesture.
 const GESTURE_GAP=160;
 let lockedUntil=0,lastWheel=-Infinity,total=0,direction=0,consumed=false;
 window.addEventListener('wheel',event=>{
  if(reduced.matches||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
  if(event.target.closest('input,textarea,select,[contenteditable="true"],#nav.is-open'))return;
  const now=performance.now();
  const continuing=now-lastWheel<GESTURE_GAP;
  lastWheel=now;
  if(!continuing){consumed=false;total=0;direction=0;}
  // Do not let momentum start another transition, even after 500ms.
  // This also catches the tail of a gesture that lands at recruitment.
  if(consumed||now<lockedUntil){
   event.preventDefault();return;
  }
  lockedUntil=0;
  // Do not intercept reading in the lower half of the page.
  if(window.scrollY>=flow.offsetTop-2)return;
  const index=scenes.reduce((best,el,i)=>Math.abs(el.getBoundingClientRect().top)<Math.abs(scenes[best].getBoundingClientRect().top)?i:best,0);
  const current=scenes[index];
  // Short/zoomed viewports need natural scrolling within a tall scene.
  if(current.offsetHeight>window.innerHeight+2)return;
  const sign=Math.sign(event.deltaY);
  if(!sign)return;
  if(!continuing||sign!==direction)total=0;
  direction=sign;
  total+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?window.innerHeight:1);
  event.preventDefault();
  if(Math.abs(total)<8)return;
  const target=sign>0?(scenes[index+1]||flow):scenes[Math.max(0,index-1)];
  total=0;consumed=true;lockedUntil=now+500;
  window.scrollTo({top:target.offsetTop,behavior:'smooth'});
 },{passive:false});
})();
