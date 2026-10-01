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
document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseCover();}else if(coverVisible&&!coverUserPaused)playCover();});
const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}),{rootMargin:'-10% 0px -65% 0px'});document.querySelectorAll('main section[id]').forEach(s=>navObserver.observe(s));

// Start visible players as synchronized groups; explicit pauses persist across scrolling.
const autoplayPlayers=new Map();
const autoplayObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
  const player=autoplayPlayers.get(target);
  if(player){player.visible=isIntersecting;player.update();}
}),{threshold:0});
function registerAutoplay(root,group=linkPlayback(root),{muted=true}={}){
  let userPaused=false,running=false;
  const player={visible:false,
    update(){
      const shouldPlay=player.visible&&!document.hidden&&!userPaused;
      if(shouldPlay===running)return;
      running=shouldPlay;
      if(running)group.resume();else group.pause();
    },
    resume(){userPaused=false;running=!document.hidden;if(running)return group.resume();group.pause();return Promise.resolve();},
    pause(){userPaused=true;running=false;group.pause();},
    dispose(){running=false;group.pause();autoplayObserver.unobserve(root);autoplayPlayers.delete(root);root.removeEventListener('ended',repeat,true);}
  };
  function repeat(){if(running&&group.finished())group.resume();}
  root.addEventListener('ended',repeat,true);
  root.querySelectorAll('video').forEach(video=>{video.muted=muted;video.defaultMuted=muted;});
  autoplayPlayers.set(root,player);autoplayObserver.observe(root);
  return player;
}
document.addEventListener('visibilitychange',()=>autoplayPlayers.forEach(player=>player.update()));
const overviewVideo=$('#overview-video');
const demoStart=$('#demo-start');
overviewVideo.loop=true;
const overviewAutoplay=registerAutoplay(overviewVideo.parentElement,{
  resume:()=>overviewVideo.play().catch(error=>{if(error.name==='NotAllowedError')demoStart.hidden=false;}),
  pause:()=>overviewVideo.pause(),finished:()=>overviewVideo.ended
},{muted:false});
demoStart.addEventListener('click',()=>{overviewVideo.muted=false;overviewAutoplay.resume();});
overviewVideo.addEventListener('pause',()=>{if(overviewAutoplay.visible&&!document.hidden&&!overviewVideo.ended)overviewAutoplay.pause();});
overviewVideo.addEventListener('play',()=>{demoStart.hidden=true;if(overviewAutoplay.visible&&!document.hidden)overviewAutoplay.resume();});
