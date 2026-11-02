/* JAEWON V6.1 LISTEN — explicit play, referrer-aware YouTube API, resilient fallback */
(() => {
  'use strict';
  const tracks = [
    {title:'Home',artist:'Marsh',id:'gzN4IyECkHk'},
    {title:'Come Together',artist:'Nox Vahn & Marsh',id:'wULG18MXKz4'},
    {title:'Sun In Your Eyes',artist:'Above & Beyond · Marsh Remix',id:'5LHR-gp4Sts'}
  ];
  const $=s=>document.querySelector(s);
  const cards=Array.from(document.querySelectorAll('[data-track-index]'));
  const stage=$('[data-player-stage]');
  const cover=$('[data-player-poster]');
  const host=$('[data-video-host]');
  const fallback=$('[data-player-fallback]');
  const status=$('[data-player-status]');
  const trackNumber=$('[data-track-number]');
  const external=$('[data-external-link]');
  const fallbackExternal=$('[data-fallback-external]');
  let selected=0,player=null,playingRequested=false,loadToken=0,apiPromise=null;
  const sourceUrl=t=>'https://www.youtube.com/watch?v='+t.id;
  const setStatus=text=>{status.textContent=text;};
  function visible(mode){
    cover.hidden=(mode!=='cover');
    host.hidden=(mode!=='video');
    fallback.hidden=(mode!=='fallback');
  }
  function clearPlayer(){
    // Old API events must not alter the new selection.
    loadToken++;
    if(player && typeof player.destroy==='function'){
      try{player.destroy();}catch(e){}
    }
    player=null;
    host.replaceChildren();
  }
  function updateTrack(i,{start=false}={}){
    if(!Number.isInteger(i)||i<0||i>=tracks.length) return;
    selected=i;
    const t=tracks[i];
    cards.forEach(c=>{const chosen=Number(c.dataset.trackIndex)===i;c.classList.toggle('active',chosen);c.setAttribute('aria-pressed',String(chosen));});
    $('[data-now-title]').textContent=t.title;
    $('[data-now-artist]').textContent=t.artist;
    $('[data-poster-title]').textContent=t.title;
    $('[data-poster-artist]').textContent=t.artist;
    trackNumber.textContent=String(i+1).padStart(2,'0')+' / 03';
    external.href=sourceUrl(t);
    fallbackExternal.href=sourceUrl(t);
    if(player && typeof player.loadVideoById==='function' && playingRequested){
      try{player.loadVideoById(t.id);visible('video');setStatus('새 곡을 골랐어. 재생되지 않으면 영상의 ▶를 눌러줘.');return;}catch(e){}
    }
    clearPlayer();playingRequested=false;visible('cover');
    setStatus('선택한 곡을 듣고 싶으면 ‘이 곡 듣기’를 눌러줘.');
    if(start) startPlayer();
  }
  function showFallback(message){
    clearPlayer();
    visible('fallback');
    $('[data-fallback-description]').textContent=message;
    setStatus('재생 환경 때문에 막혔어. YouTube에서 바로 들을 수 있어.');
  }
  function getAPI(){
    if(window.YT && typeof window.YT.Player==='function')return Promise.resolve(window.YT);
    if(apiPromise)return apiPromise;
    apiPromise=new Promise((resolve,reject)=>{
      let done=false;
      const timeout=setTimeout(()=>finish(new Error('TIMEOUT')),12000);
      function finish(err){if(done)return;done=true;clearTimeout(timeout);if(err)reject(err);else resolve(window.YT);}
      const previous=window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady=()=>{if(typeof previous==='function')try{previous();}catch(e){};finish();};
      const script=document.createElement('script');
      script.src='https://www.youtube.com/iframe_api';
      script.async=true;
      script.onerror=()=>finish(new Error('SCRIPT_FAILED'));
      document.head.appendChild(script);
    }).catch(err=>{apiPromise=null;throw err;});
    return apiPromise;
  }
  async function startPlayer(){
    if(location.protocol!=='https:' && location.hostname!=='localhost' && location.hostname!=='127.0.0.1'){
      showFallback('이 미리보기에서는 YouTube가 사이트 주소를 확인할 수 없어. HTTPS로 배포하거나 YouTube에서 직접 들어줘.');
      return;
    }
    const myToken=++loadToken;
    playingRequested=true;
    setStatus('공식 YouTube 플레이어를 불러오는 중이야…');
    // Keep attractive cover visible until provider is ready; never flash an error iframe on arrival.
    try{
      const YT=await getAPI();
      if(myToken!==loadToken)return;
      const holder=document.createElement('div');holder.id='listen-youtube-'+myToken;host.replaceChildren(holder);
      // The provider requires a visible, adequately sized player at initialization.
      visible('video');
      player=new YT.Player(holder.id,{
        videoId:tracks[selected].id,
        width:'100%',height:'100%',
        playerVars:{autoplay:1,controls:1,playsinline:1,rel:0,origin:location.origin},
        events:{
          onReady:()=>{
            if(myToken!==loadToken)return;
            visible('video');
            setStatus('음악이 시작되지 않았다면 영상 안의 ▶를 눌러줘.');
            try{player.playVideo();}catch(e){}
          },
          onError:(event)=>{
            if(myToken!==loadToken)return;
            const code=event&&event.data;
            if(code===153)showFallback('영상 연결 정보가 전달되지 않았어(오류 153). 아래 버튼으로 공식 YouTube에서 바로 들을 수 있어.');
            else showFallback('이 영상은 현재 페이지 안에서 재생할 수 없어. 공식 YouTube에서 이어서 들어줘.');
          },
          onStateChange:(event)=>{
            if(myToken!==loadToken)return;
            if(event.data===YT.PlayerState.PLAYING)setStatus('지금 재생 중 · 좋은 음악 듣자.');
            if(event.data===YT.PlayerState.ENDED){
              // Continue the chosen three-song sequence where provider permits.
              const next=(selected+1)%tracks.length;
              updateTrack(next,{start:true});
            }
          }
        }
      });
    }catch(error){
      if(myToken!==loadToken)return;
      showFallback('이 브라우저에서 플레이어를 불러오지 못했어. 공식 YouTube에서 바로 열어줘.');
    }
  }
  cards.forEach(card=>card.addEventListener('click',()=>{
    const idx=Number(card.dataset.trackIndex);
    updateTrack(idx);
    if(window.matchMedia('(max-width:780px)').matches){
      stage.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
    }
  }));
  $('[data-play-button]').addEventListener('click',startPlayer);
  $('[data-retry-button]').addEventListener('click',()=>{clearPlayer();visible('cover');setStatus('다시 시도할 준비가 됐어.');startPlayer();});
  $('[data-previous]').addEventListener('click',()=>updateTrack((selected+tracks.length-1)%tracks.length,{start:playingRequested}));
  $('[data-next]').addEventListener('click',()=>updateTrack((selected+1)%tracks.length,{start:playingRequested}));
  updateTrack(0);
})();
