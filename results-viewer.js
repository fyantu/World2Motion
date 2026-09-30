'use strict';
(() => {
  const grid=$('#results-grid');
  function pauseResults(){grid.querySelectorAll('.result-card').forEach(card=>linkPlayback(card).pause());}
  function onPlay(){pauseCover();$('#overview-video').pause();document.dispatchEvent(new CustomEvent('media-section',{detail:'results'}));}
  W2MResults.forEach((item,index)=>{
    const card=make('article','result-card');
    const heading=make('div','result-card-header');
    heading.append(make('span','result-number',String(index+1).padStart(2,'0')),make('h3','',item.title));
    card.append(heading,createWipePlayer(item.streams,item.title,onPlay));
    const actions=make('div','method-actions'),play=make('button'),pause=make('button');
    play.type=pause.type='button';play.textContent='Play pair';pause.textContent='Pause pair';
    actions.append(play,pause);card.append(actions);grid.append(card);
    const group=linkPlayback(card),videos=[...card.querySelectorAll('video')];
    const update=()=>{const playing=videos.some(v=>!v.paused&&!v.ended);play.disabled=playing;pause.disabled=!playing;play.textContent=playing?'Playing pair':!group.finished()&&videos.some(v=>v.currentTime>.025)?'Resume pair':'Play pair';};
    play.addEventListener('click',()=>{onPlay();group.resume();});pause.addEventListener('click',()=>group.pause());
    for(const event of ['play','pause','ended','timeupdate'])card.addEventListener(event,update,true);
    update();
  });
  $('#speed').addEventListener('change',()=>grid.querySelectorAll('video').forEach(v=>v.playbackRate=rate()));
  $('#overview-video').addEventListener('play',pauseResults);
  document.addEventListener('media-section',event=>{if(event.detail!=='results')pauseResults();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseResults();});
})();
