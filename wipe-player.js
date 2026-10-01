'use strict';
// Two synchronized full frames share a single viewport. Clipping reveals
// each side without stretching or cropping either video's coordinate system.
const wipePlayers=new Set();
let wipeFrame=0,wipePrevious=0;
const wipeReducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function animateWipes(now){
  const dt=Math.min(200,now-wipePrevious);wipePrevious=now;wipeFrame=0;
  let active=false;
  for(const player of wipePlayers){
    if(!player.element.isConnected){wipePlayers.delete(player);continue;}
    if(!player.manual&&player.visible&&!document.hidden&&!wipeReducedMotion.matches&&player.videos.some(v=>!v.paused&&!v.ended)){
      player.elapsed+=dt;player.set(50+40*Math.sin(2*Math.PI*player.elapsed/15125));active=true;
    }
  }
  if(active)wipeFrame=requestAnimationFrame(animateWipes);
}
function startWipes(){if(!wipeFrame){wipePrevious=performance.now();wipeFrame=requestAnimationFrame(animateWipes);}}
const wipeObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
  const player=target.wipePlayer;if(player){player.visible=isIntersecting;startWipes();}
}),{threshold:.05});
function mediaVideo(stream,title){
  const video=make('video');video.muted=true;video.playsInline=true;video.preload='none';
  video.dataset.src=stream.file;video.poster=stream.poster;
  video.setAttribute('aria-label',title+' — '+stream.label);
  video.addEventListener('loadedmetadata',()=>video.playbackRate=rate());
  posterObserver.observe(video);return video;
}
function createWipePlayer(streams,title){
  const motion=streams.find(s=>/motion/i.test(s.label));
  const rgb=streams.find(s=>s!==motion);
  const box=make('div','wipe-player');
  const motionVideo=mediaVideo(motion,title),rgbVideo=mediaVideo(rgb,title);
  motionVideo.className='wipe-motion';rgbVideo.className='wipe-rgb';
  const videoLabel=make('span','wipe-label wipe-label-left',/audio/i.test(rgb.label)?'Audio video':'RGB video');
  const motionLabel=make('span','wipe-label wipe-label-right','3D motion');
  const divider=make('span','wipe-divider'),handle=make('span','wipe-handle','↔');
  divider.setAttribute('aria-hidden','true');divider.append(handle);
  const slider=make('input','wipe-slider');slider.type='range';slider.min='0';slider.max='100';slider.step='1';slider.value='50';
  slider.setAttribute('aria-label',title+' — video and motion divider');
  box.append(motionVideo,rgbVideo,videoLabel,motionLabel,divider,slider);
  const player={element:box,videos:[motionVideo,rgbVideo],visible:false,manual:false,elapsed:0,set(value){
    const p=Math.max(0,Math.min(100,value));box.style.setProperty('--split',p+'%');slider.value=String(Math.round(p));
    slider.setAttribute('aria-valuetext',Math.round(p)+'% video, '+Math.round(100-p)+'% motion');
  }};
  const move=event=>{const rect=box.getBoundingClientRect();player.set(100*(event.clientX-rect.left)/rect.width);};
  slider.addEventListener('pointerdown',event=>{if(event.button!==0)return;player.manual=true;slider.focus({preventScroll:true});slider.setPointerCapture(event.pointerId);move(event);event.preventDefault();});
  slider.addEventListener('pointermove',event=>{if(slider.hasPointerCapture(event.pointerId))move(event);});
  slider.addEventListener('pointerup',event=>{if(slider.hasPointerCapture(event.pointerId)){move(event);slider.releasePointerCapture(event.pointerId);}});
  slider.addEventListener('input',()=>{player.manual=true;player.set(Number(slider.value));});
  for(const video of player.videos)video.addEventListener('play',startWipes);
  player.set(50);box.wipePlayer=player;wipePlayers.add(player);wipeObserver.observe(box);return box;
}
function disposeMedia(root){
  root.querySelectorAll('.method-card,.result-card').forEach(card=>autoplayPlayers.get(card)?.dispose());
  root.querySelectorAll('video').forEach(video=>{video.pause();posterObserver.unobserve(video);video.removeAttribute('src');video.load();});
  root.querySelectorAll('.wipe-player').forEach(box=>{wipeObserver.unobserve(box);wipePlayers.delete(box.wipePlayer);});
}
