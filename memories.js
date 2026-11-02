(function(){
 'use strict';
 const cards=Array.from(document.querySelectorAll('[data-memory-photo]'));
 const dialog=document.getElementById('memoryLightbox');
 const mainImage=document.getElementById('memoryLightboxImage');
 const counter=document.getElementById('memoryLightboxCounter');
 if(!cards.length||!dialog)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 document.documentElement.classList.add('memory-has-js');
 if(reduced)document.documentElement.classList.add('memory-reduce-motion');
 let current=0, lastTrigger=null;
 function show(index){
   current=(index+cards.length)%cards.length;
   const source=cards[current].querySelector('img');
   mainImage.src=source.dataset.full;
   mainImage.alt=source.alt;
   counter.textContent=String(current+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
 }
 function open(index,trigger){
   lastTrigger=trigger;
   show(index);
   if(typeof dialog.showModal==='function')dialog.showModal();
   else dialog.setAttribute('open','');
 }
 function close(){
   if(dialog.open){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');}
   if(lastTrigger)lastTrigger.focus({preventScroll:true});
 }
 cards.forEach((card,i)=>card.addEventListener('click',()=>open(i,card)));
 dialog.querySelector('[data-memory-close]').addEventListener('click',close);
 dialog.querySelector('[data-memory-prev]').addEventListener('click',()=>show(current-1));
 dialog.querySelector('[data-memory-next]').addEventListener('click',()=>show(current+1));
 dialog.addEventListener('click',ev=>{if(ev.target===dialog)close()});
 dialog.addEventListener('keydown',ev=>{
   if(ev.key==='ArrowRight'){ev.preventDefault();show(current+1)}
   if(ev.key==='ArrowLeft'){ev.preventDefault();show(current-1)}
 });
 const reveal=Array.from(document.querySelectorAll('.memory-reveal'));
 if(!reduced && 'IntersectionObserver' in window){
   reveal.forEach(el=>el.classList.add('memory-pending'));
   const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
     if(e.isIntersecting){e.target.classList.add('memory-visible');observer.unobserve(e.target)}
   }),{threshold:.05,rootMargin:'0px 0px 20px 0px'});
   reveal.forEach(el=>observer.observe(el));
 }
})();
