'use strict';
(() => {
  const grid=$('#comparison-grid'),picker=$('#case-select');
  const playAll=$('#compare-play'),pauseAll=$('#compare-pause'),status=$('#comparison-status');
  let epoch=0,loading=false;
  const cards=()=>[...grid.querySelectorAll('.method-card')];
  const videos=()=>[...grid.querySelectorAll('video')];
  const done=v=>v.ended||(Number.isFinite(v.duration)&&v.currentTime>=v.duration-.025);

  function watch(root,play,pause,noun){
    function update(){
      const vs=[...root.querySelectorAll('video')];
      const finished=vs.every(done),playing=vs.some(v=>!v.paused&&!done(v));
      play.disabled=playing;
      play.textContent=playing?'Playing '+noun:!finished&&vs.some(v=>v.currentTime>.025)?'Resume '+noun:'Play '+noun;
      pause.disabled=!playing;
    }
    for(const event of ['play','pause','ended','seeking','seeked','timeupdate'])root.addEventListener(event,update,true);
    update();
  }
  function updateAll(){
    const vs=videos(),playing=vs.some(v=>!v.paused&&!done(v));
    const allPlaying=vs.length>0&&vs.every(v=>!v.paused||done(v))&&playing;
    playAll.disabled=loading||allPlaying;
    playAll.textContent=loading?'Loading…':allPlaying?'Playing all':vs.some(v=>v.currentTime>.025)&&!vs.every(done)?'Resume all':'Play all';
    pauseAll.disabled=!loading&&!playing;
  }
  function pauseComparison(){
    ++epoch;loading=false;
    cards().forEach(card=>linkPlayback(card).pause());
    updateAll();
  }
  function pauseOtherSections(){pauseCover();$('#overview-video').pause();}
  function methodCard(method,caseTitle){
    const paired=method.streams.length>1;
    const card=make('article','method-card'+(paired?' video-method':['hoifhli','light'].includes(method.id)?' interaction-method':' motion-method')+(method.id==='ours_smooth'?' ours':''));
    card.dataset.method=method.id;
    const heading=make('div','method-card-header');
    heading.append(make('h4','',method.name),make('span','method-category',method.category));
    card.append(heading);
    const streams=make('div','method-streams');
    for(const stream of method.streams){
      const figure=make('figure'),video=make('video');
      video.controls=true;video.muted=true;video.playsInline=true;video.preload='none';
      video.dataset.src=stream.file;video.poster=stream.poster;
      video.setAttribute('aria-label',caseTitle+' — '+method.name+' — '+stream.label);
      video.addEventListener('loadedmetadata',()=>video.playbackRate=rate());
      video.addEventListener('play',pauseOtherSections);
      posterObserver.observe(video);
      figure.append(video,make('figcaption','',stream.label));streams.append(figure);
    }
    card.append(streams);
    const actions=make('div','method-actions'),play=make('button'),pause=make('button');
    const noun=paired?'pair':'motion';
    play.type=pause.type='button';pause.textContent='Pause '+noun;
    play.addEventListener('click',()=>{pauseOtherSections();linkPlayback(card).resume();});
    pause.addEventListener('click',()=>linkPlayback(card).pause());
    actions.append(play,pause);card.append(actions);linkPlayback(card);watch(card,play,pause,noun);
    return card;
  }
  function showCase(){
    pauseComparison();
    status.className='sr-only';
    videos().forEach(video=>posterObserver.unobserve(video));
    const item=W2MComparison.find(c=>c.id===picker.value);
    grid.replaceChildren(...item.methods.map(method=>methodCard(method,item.title)));
    grid.setAttribute('aria-label',item.title+' — eight methods');
    status.textContent=item.title+'. Eight methods loaded.';
    updateAll();
  }
  picker.addEventListener('change',showCase);
  for(const event of ['play','pause','ended','timeupdate'])grid.addEventListener(event,updateAll,true);
  playAll.addEventListener('click',async()=>{
    const ticket=++epoch,groups=cards().map(linkPlayback);
    status.className='sr-only';
    pauseOtherSections();loading=true;updateAll();
    try{
      await Promise.all(groups.map(group=>group.ready()));
      if(ticket!==epoch)return;
      const restart=groups.every(group=>group.finished());
      await Promise.all(groups.filter(group=>restart||!group.finished()).map(group=>group.resume()));
    }catch{
      if(ticket!==epoch)return;
      groups.forEach(group=>group.pause());
      status.className='error';status.textContent='A video could not load. Select Play all to retry.';
    }finally{if(ticket===epoch){loading=false;updateAll();}}
  });
  pauseAll.addEventListener('click',pauseComparison);
  $('#speed').addEventListener('change',()=>videos().forEach(video=>video.playbackRate=rate()));
  $('#overview-video').addEventListener('play',()=>{pauseCover();pauseComparison();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseComparison();});
  showCase();
})();
