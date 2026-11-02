/* One visible, unmodified official YouTube embed per page. No music files are hosted here. */
(function(){
  'use strict';
  const tracks = [
    {name:'Home', artist:'Marsh', id:'gzN4IyECkHk'},
    {name:'Come Together', artist:'Nox Vahn & Marsh', id:'wULG18MXKz4'},
    {name:'Sun In Your Eyes (Marsh Remix)', artist:'Above & Beyond', id:'5LHR-gp4Sts'}
  ];
  function playerURL(index, shouldPlay){
    const ids=tracks.map(t=>t.id);
    const sequence=ids.slice(index).concat(ids.slice(0,index));
    const url=new URL('https://www.youtube-nocookie.com/embed/'+sequence[0]);
    url.searchParams.set('playlist',sequence.slice(1).join(','));
    url.searchParams.set('controls','1');
    url.searchParams.set('playsinline','1');
    url.searchParams.set('rel','0');
    // Loop through the set when the provider/browser supports it.
    url.searchParams.set('loop','1');
    if(shouldPlay) url.searchParams.set('autoplay','1');
    return url.toString();
  }
  document.querySelectorAll('[data-playlist-root]').forEach(function(root){
    const buttons=Array.from(root.querySelectorAll('[data-track-index]'));
    const frame=root.querySelector('[data-youtube-frame]');
    const title=root.querySelector('[data-now-title]');
    const artist=root.querySelector('[data-now-artist]');
    const source=root.querySelector('[data-source-link]');
    const status=root.querySelector('[data-player-status]');
    let active=0;
    buttons.forEach(function(button){
      button.addEventListener('click',function(){
        const i=Number(button.dataset.trackIndex);
        if(!Number.isInteger(i) || i<0 || i>=tracks.length) return;
        active=i;
        const t=tracks[i];
        buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
        title.textContent=t.name;
        artist.textContent=t.artist;
        frame.title=t.artist+' — '+t.name+' 공식 YouTube 플레이어';
        source.href='https://www.youtube.com/watch?v='+t.id;
        // Never automatically play a YouTube embed that is out of view.
        // A track selection can start it only when most of the visible player is on screen.
        const rect=frame.getBoundingClientRect();
        const visible=Math.max(0,Math.min(window.innerHeight,rect.bottom)-Math.max(0,rect.top));
        const canTryPlay=rect.height>0 && (visible/rect.height)>0.55;
        frame.src=playerURL(i,canTryPlay);
        status.textContent='\u201c'+t.name+'\u201d을 골랐어. '+(canTryPlay ? '재생되지 않으면 영상 안의 ▶를 눌러줘.' : '영상 안의 ▶를 누르면 음악이 시작돼.');
        if (window.innerWidth < 871) {
          const playerStage=root.querySelector('.player-video-frame');
          playerStage.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center'});
        }
      });
    });
    root.querySelectorAll('[data-work-link]').forEach(function(link){
      link.addEventListener('click',function(){
        if(link.getAttribute('href') === 'listen.html'){
          // When the dedicated player is opened, avoid two overlapping streams.
          frame.src=playerURL(active,false);
          status.textContent='작업용 플레이어를 새 탭에서 열었어. 거기서 재생해 줘.';
        }
      });
    });
  });
})();
