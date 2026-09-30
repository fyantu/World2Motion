'use strict';
(() => {
  const cover=document.getElementById('cover'),stage=document.getElementById('intro-stage');
  const svg=document.getElementById('intro-type'),cutout=document.getElementById('intro-cutout-title'),solid=document.getElementById('intro-solid-title');
  const matte=document.getElementById('intro-matte'),curtain=document.getElementById('intro-curtain'),dim=document.getElementById('intro-dim');
  const kicker=document.getElementById('intro-kicker'),copy=document.getElementById('intro-copy'),caption=document.getElementById('intro-caption');
  const hint=document.getElementById('intro-hint'),motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
  let width=1,height=1,top=0,distance=1,wordWidth=1,centerX=0,centerY=0,frame=0;
  const clamp=n=>Math.max(0,Math.min(1,n));
  const ease=(a,b,p)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t);};
  const mix=(a,b,t)=>a+(b-a)*t;
  function paint(){
    frame=0;
    const p=motionPreference.matches?1:clamp((window.scrollY-top)/distance);
    const curtainProgress=ease(0,.22,p),reveal=ease(.14,.64,p),finish=ease(.66,.88,p);
    const finalY=height*(width<=700?.245:.285);
    const x=width/2,y=mix(height*.5,finalY,ease(.57,.79,p));
    const baseScale=width*.89/wordWidth;
    const scale=baseScale*mix(5.8,1,reveal);
    const transform=`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(5)}) translate(${-centerX} ${-centerY})`;
    cutout.setAttribute('transform',transform);solid.setAttribute('transform',transform);
    curtain.style.clipPath=`inset(0 0 0 ${mix(66,100,curtainProgress).toFixed(3)}%)`;
    curtain.style.opacity=String(1-ease(.18,.24,p));
    matte.style.opacity=String(ease(.075,.22,p)*(1-finish));
    solid.style.opacity=String(ease(.69,.87,p));
    dim.style.opacity=String(.79*ease(.66,.88,p));
    kicker.style.opacity=String(1-ease(.015,.115,p));
    const copyProgress=ease(.72,.88,p);
    copy.style.opacity=String(copyProgress);
    copy.style.transform=`translateY(${(28*(1-copyProgress)).toFixed(2)}px)`;
    const visible=copyProgress>.85;
    copy.inert=!visible;
    copy.classList.toggle('is-visible',visible);
    copy.setAttribute('aria-hidden',String(!visible));
    caption.style.opacity=String(finish);
    hint.style.opacity=String(mix(.9,.55,finish));
    cover.dataset.introStage=p<.14?'opening':p<.72?'cutout':'credits';
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
  function measure(){
    width=stage.clientWidth;height=stage.clientHeight;
    top=cover.getBoundingClientRect().top+window.scrollY;
    distance=Math.max(1,cover.offsetHeight-height);
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const bounds=cutout.getBBox();
    wordWidth=bounds.width;centerX=bounds.x+bounds.width/2;centerY=bounds.y+bounds.height/2;
    schedule();
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',measure,{passive:true});
  window.addEventListener('pageshow',measure);
  motionPreference.addEventListener('change',measure);
  document.fonts.ready.then(measure);
  measure();
})();
