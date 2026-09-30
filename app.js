'use strict';
const $=s=>document.querySelector(s),make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
const rate=()=>Number($('#speed').value);
const posterObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting&&target.dataset.src){target.src=target.dataset.src;posterObserver.unobserve(target)}}),{rootMargin:'220px'});
const coverVideo=$('#hero-video');
let coverVisible=true,coverUserPaused=matchMedia('(prefers-reduced-motion: reduce)').matches,coverEpoch=0;
coverVideo.muted=true;
function pauseCover(){++coverEpoch;coverVideo.pause();}
async function playCover(){const ticket=++coverEpoch;try{await coverVideo.play();if(ticket!==coverEpoch) return;if(!coverVisible||document.hidden||coverUserPaused)pauseCover();}catch{}}
if(coverUserPaused){coverVideo.autoplay=false;pauseCover();}
new IntersectionObserver(entries=>{coverVisible=entries[0].isIntersecting;if(coverVisible&&!coverUserPaused&&!document.hidden)playCover();else pauseCover();},{threshold:.05}).observe($('#cover'));
document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseCover();document.querySelectorAll('video').forEach(v=>v.pause())}else if(coverVisible&&!coverUserPaused)playCover();});
$('#copy-citation').addEventListener('click',async()=>{const text=$('#bibtex').textContent;try{await navigator.clipboard.writeText(text);$('#copy-status').textContent='Citation copied.';$('#copy-citation').textContent='Copied';setTimeout(()=>$('#copy-citation').textContent='Copy BibTeX',2000);}catch{const range=document.createRange();range.selectNodeContents($('#bibtex'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);$('#copy-status').textContent='Citation selected. Press Ctrl+C or Command+C to copy.';}});
const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}),{rootMargin:'-10% 0px -65% 0px'});document.querySelectorAll('main section[id]').forEach(s=>navObserver.observe(s));
