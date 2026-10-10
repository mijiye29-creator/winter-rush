# 🔄 AI 핸드오버 보고서

## 현재 진행 상황 (Progress)
- 게임은 웹 시제품. `prototype/index.html`은 시작 페이지, `style.css`는 화면, `balance.js`는 수치·업그레이드, `game.js`는 로직이다. 로컬 Three.js를 사용하므로 빌드 없이 실행한다.
- 채집·판매·마을 확장·눈보라 방어에 낚시, 직원, 늑대, 가죽 장비, 펫, 보스, 저장 기능이 추가됐다.
- 개발 브랜치는 `ccr-023f5a43-0sn456`(PR #2). 공개용 `gh-pages`는 `prototype/`을 루트에 게시한다. `main`은 아직 초기 README다.
- 수치와 장시간 검사 기록은 `docs/GDD.md`, `docs/PLAYTEST.md`를 본다. 협업 방식은 `AGENTS.md`, `docs/WORKFLOW.md`를 따른다.

## 현재 직면한 문제 또는 에러 (Current State/Blockers)
- 30분 가속 자동 플레이에서 고정 목표를 약 17~29분에 완료했다. 이동을 단순화한 결과라 실제 플레이 시간·재미는 사람 5명의 테스트가 필요하다.
- 목표 완료 후에는 동전이 계속 쌓이고 새로운 선택이나 보상은 없다.
- Android·iOS 네이티브 빌드와 실기기 성능은 아직 확인하지 않았다.

## 다음에 즉시 실행해야 할 작업 (Next Steps)
1. `git fetch origin ccr-023f5a43-0sn456` 후 `git status`와 원격 최신 커밋을 확인한다.
2. `cd prototype && python3 -m http.server 8000`으로 실행해 모바일 화면에서 판매·눈보라·저장 후 이어하기를 확인한다.
3. 사람 5명의 10분 플레이를 `docs/PLAYTEST.md` 양식으로 기록한다. 그 결과로 초반 수치를 조정한다.
4. 15개 목표 이후 콘텐츠를 설계한다. 후보는 장작을 판매·난방·감시탑 방어에 배분하는 선택이다.

## 공유된 컨텍스트 및 주요 규칙 (Key Context)
- 한 작업의 구현 담당은 Claude 또는 Codex 한 명으로 정하고, 다른 한 명이 리뷰한다. 같은 파일을 동시에 수정하지 않는다.
- 새 수치는 `prototype/balance.js`에 둔다. 새 게임 상태를 저장해야 하면 `prototype/game.js`의 `save()`와 `load()`를 함께 확인한다.
- 사용자 보고는 짧게 한다. 토큰·컨텍스트가 부족하거나 인수인계 지시가 오면 이 형식으로 최신 브랜치와 다음 명령을 남긴다.
- Unity 이식 시 설정은 ScriptableObject, 전역 상태는 GameManager 싱글톤, 기능은 독립 C# 스크립트로 설계한다.

## 2026-10-10 상점·직원 개편 (Claude, `game.js`·`balance.js`)
- 가게는 `SHOPS`(main 스테이크 / fish 생선 / leather 가죽 제품)로 일반화. 손님은 `c.shop`을 갖고, 앞에서부터 `val('clerk')`명이 동시에 응대됨
- 새 업그레이드: `clerk`(판매 점원), `artisan`(가죽 장인, `T.tanTime`), `fisher`(낚시꾼, `updateFishers`). 털 장비와 `cur:'fur'` 결제 제거
- 생선 굽기 제거: 생선은 `S.fishStock` → 생선 가게. 가죽 → `S.leather` → 가죽 가게
- 사냥꾼은 `h.hides`를 들고 와 가죽 공방에 넣음. 펫은 1마리, `S.petHits`로 `T.pet` 레벨 성장
