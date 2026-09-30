'use strict';
// A case shares one playback clock, including the native video controls.
const playbackGroups = new WeakMap();
function linkPlayback(root) {
  if (playbackGroups.has(root)) return playbackGroups.get(root);
  const videos = [...root.querySelectorAll('video')];
  let phase = 'paused', epoch = 0, leader = videos[0], desiredRate = 1;
  const expectedSeeks = new WeakMap();
  const targetTime = (video, time) => Math.max(0, Math.min(time, Number.isFinite(video.duration) ? video.duration : time));
  function seek(time, source) {
    for (const video of videos) {
      if (video === source || !video.readyState) continue;
      const target = targetTime(video, time);
      if (Math.abs(video.currentTime - target) > 0.025) { expectedSeeks.set(video, target); video.currentTime = target; }
    }
  }
  function pause() {
    ++epoch; phase = 'paused';
    for (const video of videos) video.pause();
  }
  function ready(video) {
    if (!video.src) video.src = video.dataset.src;
    video.preload = 'auto';
    if (video.readyState >= 3) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const cleanup = () => { clearTimeout(timeout); video.removeEventListener('canplay', ok); video.removeEventListener('error', bad); };
      const ok = () => { cleanup(); resolve(); };
      const bad = () => { cleanup(); reject(new Error('Video load failed')); };
      const timeout = setTimeout(bad, 30000);
      video.addEventListener('canplay', ok); video.addEventListener('error', bad);
      video.load();
    });
  }
  async function play(time = 0, source = videos[0]) {
    const ticket = ++epoch; phase = 'loading'; leader = source;
    desiredRate = source.playbackRate;
    videos.forEach(video => video.pause());
    try {
      await Promise.all(videos.map(ready));
      if (ticket !== epoch) return;
      for (const video of videos) {
        const target = targetTime(video, time);
        if (Math.abs(video.currentTime - target) > 0.001) { expectedSeeks.set(video, target); video.currentTime = target; }
        video.playbackRate = desiredRate;
      }
      phase = 'playing';
      await Promise.all(videos.filter(video => !Number.isFinite(video.duration) || video.currentTime < video.duration - 0.001).map(video => video.play()));
    } catch (error) {
      if (ticket !== epoch) return;
      pause();
      let message = root.querySelector('.playback-error');
      if (!message) { message = document.createElement('p'); message.className = 'error playback-error'; root.append(message); }
      message.textContent = 'A video could not load. Click play to retry.';
    }
  }
  for (const video of videos) {
    video.addEventListener('play', () => { if (phase === 'paused') play(video.currentTime, video); });
    video.addEventListener('pause', () => { if (phase === 'playing' && video.paused && !video.ended) pause(); });
    video.addEventListener('seeking', () => {
      const expected = expectedSeeks.get(video); expectedSeeks.delete(video);
      if (expected != null && Math.abs(video.currentTime - expected) < 0.15) return;
      if (phase !== 'loading') { leader = video; seek(video.currentTime, video); }
    });
    video.addEventListener('ratechange', () => {
      desiredRate = video.playbackRate;
      for (const other of videos) if (other.playbackRate !== desiredRate) other.playbackRate = desiredRate;
    });
    video.addEventListener('timeupdate', () => {
      if (phase === 'playing' && video === leader && !video.seeking) {
        for (const other of videos) if (!other.seeking && !other.ended && Math.abs(other.currentTime - video.currentTime) > 0.12) seek(video.currentTime, video);
      }
    });
    video.addEventListener('ended', () => { if (videos.every(other => other.ended || other.currentTime >= other.duration - 0.06)) phase = 'paused'; });
  }
  const finished = () => videos.every(v => v.ended || (Number.isFinite(v.duration) && v.currentTime >= v.duration - 0.001));
  function resume() {
    if (phase === 'playing' && videos.some(v => !v.paused)) return Promise.resolve();
    const source = leader.ended ? (videos.find(v => !v.ended) || leader) : leader;
    return play(finished() ? 0 : source.currentTime, source);
  }
  const group = { play, resume, finished, pause, ready: () => Promise.all(videos.map(ready)) }; playbackGroups.set(root, group); return group;
}
