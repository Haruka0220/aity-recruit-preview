// User-requested motion, independent of Figma-authored timelines.
(() => {
 const scenes=[...document.querySelectorAll('.story-scene')];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches||!('IntersectionObserver' in window))return;
 const pending=new Map();
 const cancel=scene=>{clearTimeout(pending.get(scene));pending.delete(scene);};
 const reveal=scene=>{cancel(scene);scene.classList.add('is-revealed');};
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
   // Wait until the scene occupies most of the viewport, not its first edge.
   const required=.8*Math.min(1,window.innerHeight/entry.boundingClientRect.height);
   if(entry.isIntersecting&&entry.intersectionRatio>=required){
    if(!pending.has(entry.target)&&!entry.target.classList.contains('is-revealed')){
     // Let scroll snapping finish and paint the hidden state before starting.
     pending.set(entry.target,setTimeout(()=>reveal(entry.target),350));
    }
   }else{
    cancel(entry.target);
    if(entry.intersectionRatio<.2)entry.target.classList.remove('is-revealed');
   }
  }
 },{threshold:Array.from({length:21},(_,i)=>i/20)});
 for(const scene of scenes){
  scene.classList.add('motion-ready');
  observer.observe(scene);
  scene.addEventListener('focusin',()=>{reveal(scene);observer.unobserve(scene);});
 }
 reduced.addEventListener('change',()=>{
  if(reduced.matches){scenes.forEach(reveal);observer.disconnect();}
 });
})();
