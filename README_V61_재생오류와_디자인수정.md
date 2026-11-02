# JAEWON / V6.1 Listen redesign — 배포 및 점검

## 수정
- 생일 편지 `index.html`은 V6 원본을 유지하고 referrer 메타만 추가했습니다.
- `listen.html`은 음악 먼저 보이는 간결한 구성으로 변경: 짧아진 히어로, 고정된 16:9 재생 무대, 3곡 컴팩트 목록, 다음/이전 곡, 편지 돌아가기.
- 페이지 첫 진입에서는 YouTube iframe을 로드하지 않고, 자체 제작 커버와 재생 버튼을 보여줍니다. 사용자 재생 요청 이후 공식 IFrame Player API를 로드합니다.
- 오류 153 등 재생 실패를 감지하면 오류 화면 대신 공식 YouTube 링크 안내를 보여줍니다. API 자체가 열리지 않아도 대체 링크가 보입니다.
- `_headers`와 `meta referrer`로 YouTube 권장 Referrer-Policy 설정을 추가했습니다.

## 중요: 153 발생 원인
YouTube 오류 153은 HTTP Referer 또는 동등한 클라이언트 ID가 누락된 상태를 가리킵니다. 현재 사용자 스크린샷만으로는 사이트 주소/브라우저가 공개되지 않아, 해당 환경에서 빠진 이유를 단정할 수 없습니다.
- `file://`로 직접 연 HTML, 일부 미리보기/프리뷰 앱, 개인정보 보호 확장프로그램, `Referrer-Policy: no-referrer`, 광고 차단 등 여러 원인이 가능합니다.
- Netlify HTTPS 배포 후 새 주소에서 우선 점검하세요. Netlify 서버가 `_headers`를 반영하는지 네트워크 탭의 Response Headers로 확인하세요.
- 임베드가 계속 차단되면 공식 YouTube 링크가 대안입니다. 사용자가 직접 Play 버튼을 눌러야 소리가 날 수 있습니다.

## 사용 방법
1. 이 폴더의 **전체 파일**을 Netlify Drop에 올리세요. `index.html`, `listen.html`, `listen-v61.css`, `listen-v61.js`, `_headers`, `assets`는 같은 배포에 포함돼야 합니다.
2. 배포된 HTTPS 주소에서 `listen.html`을 엽니다. ‘이 곡 듣기’를 클릭하여 재생 요청 후 다음/이전 곡을 점검합니다.
3. PC 크롬과 모바일 카카오톡/사파리에서 각각 확인하세요. 인앱 브라우저에서는 YouTube가 외부 이동만 지원할 수 있습니다.
4. 세 곡의 YouTube 원본 링크와 재생 허용 여부는 게시 시점/국가/브라우저에 따라 달라질 수 있습니다. 자동 다음 곡 재생도 보장되지 않습니다.

**포함하지 않는 것**: 불법 음원 파일, YouTube 컨트롤 숨기기, YouTube 접근 제한 우회.
