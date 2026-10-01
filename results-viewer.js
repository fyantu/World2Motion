'use strict';
(() => {
  const grid=$('#results-grid');
  W2MResults.forEach((item,index)=>{
    const card=make('article','result-card');
    const heading=make('div','result-card-header');
    heading.append(make('span','result-number',String(index+1).padStart(2,'0')),make('h3','',item.title));
    card.append(heading,createWipePlayer(item.streams,item.title));
    const actions=make('div','method-actions'),play=make('button'),pause=make('button');
    play.type=pause.type='button';play.textContent='Play pair';pause.textContent='Pause pair';
    actions.append(play,pause);card.append(actions);grid.append(card);
    const group=linkPlayback(card),videos=[...card.querySelectorAll('video')];
    const update=()=>{const playing=videos.some(v=>!v.paused&&!v.ended);play.disabled=playing;pause.disabled=!playing;play.textContent=playing?'Playing pair':!group.finished()&&videos.some(v=>v.currentTime>.025)?'Resume pair':'Play pair';};
    const autoplay=registerAutoplay(card,group);
    play.addEventListener('click',()=>autoplay.resume());pause.addEventListener('click',()=>autoplay.pause());
    for(const event of ['play','pause','ended','timeupdate'])card.addEventListener(event,update,true);
    update();
  });
  $('#speed').addEventListener('change',()=>grid.querySelectorAll('video').forEach(v=>v.playbackRate=rate()));
})();
