/* V6.4 — one catalog; selected title must always match selected official video. */
(function(){
 'use strict';
 const tracks=window.JAEWON_TRACKS;
 if(!Array.isArray(tracks)||tracks.length!==3)return;
 function playerURL(track, shouldPlay){
   const url=new URL('https://www.youtube-nocookie.com/embed/'+track.id);
   url.searchParams.set('controls','1');url.searchParams.set('playsinline','1');url.searchParams.set('rel','0');
   if(shouldPlay)url.searchParams.set('autoplay','1');
   return url.toString();
 }
 document.querySelectorAll('[data-playlist-root]').forEach(root=>{
   const buttons=Array.from(root.querySelectorAll('[data-track-index]'));
   const frame=root.querySelector('[data-youtube-frame]');
   const cover=root.querySelector('[data-player-cover]');
   const startButton=root.querySelector('[data-cover-play]');
   const title=root.querySelector('[data-now-title]');
   const artist=root.querySelector('[data-now-artist]');
   const source=root.querySelector('[data-source-link]');
   const status=root.querySelector('[data-player-status]');
   let active=0;
   function select(index,{start=false}={}){
     if(!Number.isInteger(index)||index<0||index>=tracks.length)return;
     active=index;
     const track=tracks[index];
     buttons.forEach(btn=>btn.setAttribute('aria-pressed',String(Number(btn.dataset.trackIndex)===index)));
     title.textContent=track.title;artist.textContent=track.artist;
     root.querySelector('[data-cover-title]').textContent=track.title;
     root.querySelector('[data-cover-artist]').textContent=track.artist;
     source.href='https://www.youtube.com/watch?v='+track.id;
     frame.title=track.artist+' — '+track.title+' 공식 YouTube 영상';
     if(start){
       cover.hidden=true;frame.hidden=false;frame.src=playerURL(track,true);
       status.textContent='“'+track.title+'”을 골랐어. 음악이 안 나오면 영상의 ▶를 눌러줘.';
     }else{
       frame.hidden=true;frame.removeAttribute('src');cover.hidden=false;
       status.textContent='“'+track.title+'” 선택했어. 위의 ‘이 곡 듣기’를 눌러줘.';
     }
   }
   buttons.forEach(btn=>btn.addEventListener('click',()=>{
     const idx=Number(btn.dataset.trackIndex);
     select(idx,{start:true});
     if(window.matchMedia('(max-width:870px)').matches){
       root.querySelector('.player-video-frame').scrollIntoView({
         behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center'
       });
     }
   }));
   if(startButton)startButton.addEventListener('click',()=>select(active,{start:true}));
   root.querySelectorAll('[data-work-link]').forEach(link=>link.addEventListener('click',()=>{
     select(active,{start:false});
     status.textContent='음악방을 새 탭에서 열었어. 거기서 편하게 들어.';
   }));
   select(0,{start:false});
 });
})();
