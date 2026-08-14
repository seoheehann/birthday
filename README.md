
# DONGSHIN Birthday OS (동신 생일 선물 웹앱)

간단 소개

- 개인용 모바일 퍼스트 인터랙티브 생일 선물 웹앱입니다. React + Vite로 제작되었고, 사진·퀴즈·편지 등을 쉽게 편집할 수 있도록 데이터 파일을 분리해뒀습니다.

빠른 시작

1. 의존성 설치

```bash
npm install
```

2. 개발 서버 실행

```bash
npm run dev
```

빌드(배포용)

```bash
npm run build
npm run preview    # 빌드 결과 미리보기
```

콘텐츠(수정) 위치

- 사진: `src/assets/` 폴더
- 추억(타임라인): `src/data/memories.js`
- 퀴즈: `src/data/quiz.js`
- 랜덤 추억: `src/data/randomMemories.js`
- 쿠폰: `src/data/coupons.js`
- 편지: `src/data/letter.js`

사진 권장 규칙

- 권장 포맷: `webp` > `jpg` > `png`
- 권장 너비: 800–1200px (모바일 우선)
- 파일명은 소문자와 하이픈 사용: `timeline-2024-08-14.jpg`
- 최적화(압축)를 권장합니다(TinyPNG, Squoosh 등).

배포 방법

1) GitHub Pages (자동)
- 이 저장소를 GitHub에 푸시하면 포함된 Actions 워크플로우가 `dist/`를 빌드하여 `gh-pages` 브랜치로 배포합니다.
- 배포 URL 예: `https://<your-username>.github.io/<repo-name>/` (푸시 후 몇 분 내에 활성화)

2) Vercel (권장)
- Vercel에 프로젝트를 import하고 빌드명령을 `npm run build`, 출력 디렉터리를 `dist`로 지정하면 자동 배포됩니다.

임시 공유(로컬 서버 공개)

- `npx localtunnel --port 5173` 또는 `ngrok`으로 로컬 개발 서버를 일시적으로 외부에 공유할 수 있습니다.

라이브 데모(배포 후 교체)

- 라이브 URL(배포 후 이 부분을 실제 URL로 바꿔주세요):

	https://seoheehann.github.io/birthday/

문의 및 편집 도움

- 이미지 파일명이나 data 파일에 제가 직접 경로를 연결해드리길 원하면 알려주세요. 배포가 끝나면 README의 라이브 링크를 실제 URL로 확정해서 업데이트해드립니다.


