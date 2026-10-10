# 🔄 AI 핸드오버 보고서

> 마지막 갱신: 2026-10-10 · 기준 커밋 `16c95e9` · 브랜치 `ccr-023f5a43-0sn456` · PR #2 (draft, 머지 전)

## 현재 진행 상황 (Progress)
- **게임**: `prototype/index.html` 단일 파일(약 1,390줄, three.js r128, 빌드 없음). Three.js는 `prototype/vendor/three.min.js`에 포함됨.
- **기획서**: `docs/GDD.md` (코어 루프, 눈보라/곰 시스템, 수치표, v0.2 기능 표)
- **완료 기능**
  - 코어 루프: 벌목 → 모닥불(장작 칸) → 곰 사냥 → 고기 칸 → 그릴(날것/익음/탐) → 카운터 → 손님 → 동전 → 업그레이드 칸
  - 눈보라(평온 70초, 경고 8초, 눈보라 25초), 마을 온기, 습격 곰, 보스 곰(3회마다)
  - 업그레이드 11종(`UP` 객체): bag, axe, boots, gate, helper, cart, server, belt, hunter, cabin, fishing
  - NPC: 나무꾼(helpers), 서빙 직원(servers), 사냥꾼(hunters, 화살 shots), 컨베이어(beltItems)
  - 얼음 낚시터(동쪽, `fishBarrier` 벽 제거로 해금), 생선구이 주문
  - 손맛: `startSwing`/`updateSwing`(3단 모션), `playerHit`(히트스톱, 흔들림, 진동, 치명타, 피격 숫자), `burst` 파티클, WebAudio 효과음(`sfx`)
  - 목표 10단계(`GOALS`), Day 표시, 자동 저장(`SAVE_KEY='winter-rush-v1'`, 4초마다 localStorage)
  - 조작: 탭하면 그 위치로 이동(`pl.target`), 드래그는 조이스틱, PC는 WASD

## 파일 구조 (`prototype/index.html` 섹션 순서)
| 섹션 주석 | 내용 |
|---|---|
| `tuning` | `T`(수치), `UP`(업그레이드), `S`(전체 게임 상태), `tick()` 타이머 |
| `renderer / scene` | 씬, 카메라, 조명, `mat()` 머티리얼 캐시, `disposeActor()` |
| `items` | `GEO`, `IMAT`, `ITEM_H`, `pile()`, `fly()` |
| `juice` | `burst`, `popText`, `SND`, `tone`, `noise`, `sfx`, `play`, `buzz` |
| `world layout` | `P`(좌표), `walls`, 울타리, 나무, 타일, 모닥불, 그릴(`grillSlots`, `takeReady`), 카운터, 낚시터, 벨트, 오두막, 업그레이드 칸(`makePad`) |
| `characters` | `makePerson`, 플레이어, 쌓기(`stack`), 나무꾼, `walkPath`, 서빙 직원, 사냥꾼, 손님, 곰(`makeBear`, `bearHurt`, `updateBears`) |
| `player` | 입력(조이스틱, 탭), 충돌, `updatePlayer`, 스윙, `playerHit`, `levelUp` |
| `fire, warmth, blizzard` | `updateFire`(굽기, 탐), `updatePhase`, 눈 파티클 |
| `tutorial + HUD` | `TUT` 6단계, HUD 갱신, `GOALS` |
| `save` | `save()`, `load()` |
| `loop` | `frame()`(히트스톱 `g` dt), 시작/이어하기 버튼, `window.__winter` 디버그 핸들 |

## 현재 직면한 문제 (Current State/Blockers)
- **밸런스 미검증**: 곰 공격이 셀 수 있음(테스트에서 2.5초에 체력 4칸 감소). 보스 주기 `T.bossEvery=3`(원래 제안은 5)
- **실기기 미확인**: 진동, 효과음, 성능. 아이폰은 진동 API를 지원하지 않음
- **Vercel 배포(winter-rush-lime.vercel.app)는 구버전**이고 자동 갱신되지 않음. GitHub Pages가 기본 공개 URL
- 업그레이드 칸이 왼쪽 화면 끝에서 잘려 보일 수 있음(400px 폭)
- Unity C# 이식 요청이 있었으나 기능 요구사항을 받지 못해 보류(사용자 규칙: SO, GameManager 싱글톤, 모듈화)

## 다음에 즉시 실행할 작업 (Next Steps)
```bash
git fetch origin ccr-023f5a43-0sn456 && git checkout ccr-023f5a43-0sn456
cd prototype && python3 -m http.server 8000   # http://localhost:8000
```
1. 사용자 피드백 받아 밸런스 조정: `T`(prototype/index.html `tuning` 섹션), 곰 공격 쿨다운 `b.cd = 1.3`(`updateBears`)
2. 수정 후 헤드리스 검증: Playwright로 `#go` 클릭 → `window.__winter`로 상태 조작/확인, `pageerror` 없음 확인
3. 커밋 후 브랜치에 푸시 → GitHub Pages 자동 배포(1~2분)
4. Claude 링크 갱신 시 `vendor/three.min.js`를 함께 게시해야 함

## 공유된 컨텍스트 및 주요 규칙 (Key Context)
- **배포**
  - GitHub Pages: https://mijiye29-creator.github.io/winter-rush/prototype/ (브랜치 `ccr-023f5a43-0sn456`, 루트에서 배포)
  - Claude 링크: https://claude.ai/artifact/DEhr9mLESBZ5SoXnBAZiro (비공개)
- **사용자 응답 규칙**: 인사와 서론은 생략하고 개조식으로 짧게. 코드는 수정된 조각만 보여 줌. 수정 요약은 1~3줄. 확인이 필요하면 예/아니오로 질문
- **Unity 규칙(이식 시)**: 설정값은 ScriptableObject, 전역 상태(골드, 저장)는 GameManager 싱글톤, 기능별 독립 스크립트
- **핸드오버 규칙**: 토큰이 부족하거나 사용자가 지시하면 이 형식으로 보고서를 작성
- **코드 관례**
  - 모든 상태는 `S`에 둠. 새 상태를 추가하면 `save()`의 `keys` 배열에도 넣을 것
  - 새 업그레이드: `UP`에 항목 추가 → `makePad(key, x, z)` → `levelUp()`에 효과와 `msg` 추가
  - 주기 동작은 `tick(key, interval, dt)`로 처리. 키가 유일해야 함
  - 제거하는 액터는 `disposeActor(group)`로 지오메트리를 해제. 아이템 메시는 공유 지오메트리라 해제하지 않음
  - 게임 로직은 `g`(히트스톱이 반영된 dt)를 받고, UI와 카메라는 실제 `dt`를 받음
- **좌표**: 마을 x는 -8~8, z는 -10~6. 정문 z=6(x는 ±1.8), 곰 들판 z>8, 숲 x<-8, 낚시터 x>8(z는 -3~1에서 진입), 손님 줄 z≈-12
