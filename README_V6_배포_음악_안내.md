# JAEWON × CHARLIE · V6 / A LETTER YOU CAN LISTEN TO

## 배포
1. 이 폴더의 전체 내용을 Netlify Drop에 업로드합니다. `index.html`이 사이트 루트에 있도록 합니다.
2. `index.html`은 생일 편지 메인(영상, GSAP, 3곡 플레이리스트), `listen.html`은 음악을 켜두고 일할 수 있는 전용 음악방입니다.
3. `playlist.js`와 `playlist.css`는 두 페이지가 공유합니다. 파일을 삭제하지 마세요.
4. 카카오톡 공유 썸네일은 배포 후 `index.html`의 `og:image`를 실제 HTTPS 절대 주소로 연결하세요. 제공된 `assets/og-patrick.jpg`를 사용하면 됩니다.

## 재생 구현과 제한
- 3곡 모두 **권리자가 공개한 공식 YouTube 영상**을 표준 iframe으로 삽입했습니다.
  - Home — Marsh: https://www.youtube.com/watch?v=gzN4IyECkHk
  - Come Together — Nox Vahn & Marsh: https://www.youtube.com/watch?v=wULG18MXKz4
  - Sun In Your Eyes (Marsh Remix) — Above & Beyond: https://www.youtube.com/watch?v=5LHR-gp4Sts
- 곡 카드 클릭 시 해당 영상으로 전환합니다. **플레이어가 충분히 화면에 보이는 상태에서 직접 곡을 선택한 경우에만** 자동재생을 시도합니다. 다른 경우에는 해당 플레이어로 스크롤한 뒤 ▶ 버튼을 직접 눌러야 합니다.
- 후속 곡 자동재생/반복은 YouTube 플레이어가 허용할 때에만 가능합니다. 완전한 백그라운드 재생 및 무광고/무중단 감상은 보장할 수 없습니다.
- 공식 플레이어는 **항상 화면에 표시 가능한 크기**를 유지하며, YouTube 광고/출처/기본 컨트롤을 가리지 않습니다.
- **MP3 파일을 직접 호스팅하지 않습니다.** 음악 구매는 사이트 재배포 권한이 아니며, 공개 업로드에는 별도 라이선스가 필요합니다.
- '일할 때 듣기' 링크는 별도의 `listen.html` 탭을 열어 작업 중 음악을 감상하기 위한 것입니다. 모바일 브라우저의 백그라운드 재생 제한은 기기마다 다를 수 있습니다.

## 사이트 설계
- V5의 생일 편지, GBG 흐름, 추상 무음 영상, GSAP/ScrollTrigger 연출을 보존했습니다.
- 새 01.5 챕터는 음악을 함께 듣던 경험을 **재원이형이 직접 골라 듣는 선물**로 바꿉니다.
- 편지 페이지 하단의 비공개 제작 후기에는 규현이 왜 이 화면을 만들었는지 짧게 남겼습니다.
- 모바일에서는 곡 카드를 수직으로, 플레이어를 16:9 가로폭으로 배치했습니다.
- `prefers-reduced-motion` 시 전환과 배경 영상을 최소화하고, 키보드 탐색과 aria-pressed 상태를 제공합니다.

## 주의
- `noindex`는 검색 회피일 뿐 비밀번호가 아닙니다. 개인적인 편지를 진짜 비공개로 운영하려면 별도의 방문자 접근제어가 필요합니다.
- 배포 후 공식 YouTube iframe이 실제 환경에서 보이는지, 카카오톡 인앱브라우저/아이폰에서 재생되는지 수동 최종 검수하세요.
- 이전 V5 원본은 별도 ZIP으로 보존했습니다. V6 배포물에는 구버전 페이지를 넣지 않았습니다.
