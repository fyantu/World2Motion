'use strict';
(() => {
  const cover=document.getElementById('cover'),stage=document.getElementById('intro-stage');
  const svg=document.getElementById('intro-type'),cutout=document.getElementById('intro-cutout-title'),solid=document.getElementById('intro-solid-title');
  const matte=document.getElementById('intro-matte'),dim=document.getElementById('intro-dim');
  const kicker=document.getElementById('intro-kicker'),copy=document.getElementById('intro-copy'),caption=document.getElementById('intro-caption');
  const hint=document.getElementById('intro-hint'),motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
  let width=1,height=1,top=0,distance=1,frame=0;
  // Vector geometry: start inside M's left stroke, beside the gap after 2.
  const wordWidth=12625,centerX=6319.5,centerY=-724;
  const focusX=6605,focusY=-550,stemWidth=275;
  const clamp=n=>Math.max(0,Math.min(1,n));
  const ease=(a,b,p)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t);};
  const mix=(a,b,t)=>a+(b-a)*t;
  function paint(){
    frame=0;
    const p=motionPreference.matches?1:clamp((window.scrollY-top)/distance);
    const reveal=ease(0,.66,p),finish=ease(.69,.9,p);
    const finalY=height*(width<=700?.245:.285);
    const baseScale=width*.89/wordWidth;
    // One continuous zoom: the opening black region is the wordmark's own
    // negative space. Keep the same opaque mask until the white title arrives.
    const startScale=Math.max(width*.72/stemWidth,height/700);
    const scale=Math.exp(mix(Math.log(startScale),Math.log(baseScale),reveal));
    const x=mix(width*.35,width/2+(focusX-centerX)*baseScale,reveal);
    const y=mix(height*.5,finalY+(focusY-centerY)*baseScale,ease(.5,.78,p));
    const transform=`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(5)}) translate(${-focusX} ${-focusY})`;
    cutout.setAttribute('transform',transform);solid.setAttribute('transform',transform);
    matte.style.opacity=String(1-finish);
    solid.style.opacity=String(ease(.72,.9,p));
    dim.style.opacity=String(.79*finish);
    kicker.style.opacity=String(1-ease(.015,.115,p));
    const copyProgress=ease(.76,.91,p);
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
    schedule();
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',measure,{passive:true});
  window.addEventListener('pageshow',measure);
  motionPreference.addEventListener('change',measure);
  measure();
})();
