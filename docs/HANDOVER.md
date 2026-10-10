# 🔄 AI 핸드오버 보고서

## 현재 진행 상황 (Progress)
- 게임은 웹 시제품. `prototype/index.html`은 시작 페이지, `style.css`는 화면, `balance.js`는 수치·업그레이드, `game.js`는 로직이다. 로컬 Three.js를 사용하므로 빌드 없이 실행한다.
- 채집·판매·마을 확장·눈보라 방어에 낚시, 직원, 늑대, 가죽 장비, 펫, 보스, 저장 기능이 추가됐다.
- 개발 브랜치는 `ccr-023f5a43-0sn456`(PR #2). 공개용 `gh-pages`는 `prototype/`을 루트에 게시한다. `main`은 아직 초기 README다.
- 수치와 장시간 검사 기록은 `docs/GDD.md`, `docs/PLAYTEST.md`를 본다. 협업 방식은 `AGENTS.md`, `docs/WORKFLOW.md`를 따른다.

## 현재 직면한 문제 또는 에러 (Current State/Blockers)
- 30분 가속 자동 플레이에서 고정 목표를 약 17~29분에 완료했다. 이동을 단순화한 결과라 실제 플레이 시간·재미는 사람 5명의 테스트가 필요하다.
- 3단계 피자·통합 창고·배달 트럭·모닥불 강화·목표 5개가 추가됐다. 배달 중 저장하면 트럭 화물이 사라지는 버그가 재현됐다(`docs/CLAUDE_REVIEW.md`).
- Android·iOS 네이티브 빌드와 실기기 성능은 아직 확인하지 않았다.

## 다음에 즉시 실행해야 할 작업 (Next Steps)
1. `git fetch origin ccr-023f5a43-0sn456` 후 `git status`와 원격 최신 커밋을 확인한다.
2. `cd prototype && python3 -m http.server 8000`으로 실행해 모바일 화면에서 판매·눈보라·저장 후 이어하기를 확인한다.
3. 사람 5명의 10분 플레이를 `docs/PLAYTEST.md` 양식으로 기록한다. 그 결과로 초반 수치를 조정한다.
4. 배달 중 저장 시 화물 소실을 수정하고, 현 24개 목표와 3단계 피자·배달 동선을 사람 플레이로 검증한다.

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

## 2026-10-10 단계 구조 (Claude, `game.js`·`balance.js`)
- `S.stage` 1/2. `applyStage(fanfare)`가 울타리(`fence1/2`, `WALLS1/2`), `CAMP.x2`, `eastG`/`decoG`, 모닥불 이동(`HEARTH_SHIFT`=3, `P.*`·타일·그릴 이동), `PAD_POS2`를 처리
- 직원은 1명씩(`addHelper` 등은 중복 생성 안 함), 능력치는 `T.staff`의 레벨별 배열
- 가죽은 `hidesOn()`(사냥꾼 Lv3) && 2단계에서만. `UP.*.stage`로 레벨별 필요 단계 지정, `padHidden()`은 최대 레벨/단계 미달 칸 숨김
- 훈제: `S.fishRaw`(투입 칸) → `updateSmoker` → `S.fishStock`(가게, `sfish`). 장작은 모닥불 장작 더미(`S.wood`)에서 가져감
- 배치 점검: `window.__winter.footprints()`가 바닥 시설·업그레이드 칸의 사각형 목록을 돌려줌. 업데이트 후 1·2단계 모두에서 겹침이 없는지 확인할 것 (연못은 원으로 판정)
- v0.5: 화덕 체인 `S.fishCrate → S.fishRaw(+S.ovenWood) → S.fishSmoked → S.fishStock`, 쉐프 작업 선택 `CHEF_JOBS`/`chooseChefJob`, 장인 `S.tanFuel`과 장작 운반, 생선 점원 `fishClerk`(SHOPS.fish.clerk), 칸 결제는 정지 0.5초 후(`p.dwell`)
- v0.6: 화덕 위 굽기(`fishRawPile`이 화덕 위, 완성 즉시 `S.fishStock`), 쉐프 작업은 `steak`/`fishIn` 두 가지, `helper2`/`hunter2`(2단계, `addHelper`/`addHunter`가 인원 수 판단)
- v0.7: `makeWolf(alpha)`/`T.alpha`(`S.packs` 카운터), 새끼 늑대 `u.fed`/`T.pet.tameMeat`, 펫 외형 `PET_LOOKS`/`applyPetLook`
- v0.8: 화덕 레벨 `UP.oven`/`T.ovenTime`/`T.ovenCap`(`ovenCap()`), 쉐프 `chooseChefJob(w)`는 `queuedNeed`·`w.since`·`w.want` 사용, 눈보라 장작 배율 `T.stormBurn`·`T.smoke.stormUse`
- v0.8.1: 사냥꾼 `collect` 상태, `campPickup(h)`로 마을 안 픽업 탐색
- v0.9: 칸 위치는 `makePad` 호출 순서 = 저장(`paid`) 순서라 새 칸은 맨 뒤에 추가. 장비 외형 `GEAR`/`applyGear()`(전용 재질 `gmat`, `mat()` 캐시 공유 금지), 막기 `blockChance()`/`T.armor`
- v1.0: `COIN_PILES`(S.coinPile/coinFish/coinLeather, `SHOPS.*.coin`), `WOOD_SPOTS`/`woodSpot()`(나무꾼 `deliver` 상태), `S.tanWood`, `heroLv()`, `makeBeast(kind)`/`spawnBeast()`(`T.beasts`, 몹 객체 `kind`/`sc`/`dmg`/`reach`/`big`), `AXE_LOOKS`, 망토 `capeG`
- v1.1: 재료 `S.mats`(pelt/tusk), 업그레이드 `UP.*.mats`(`matsNeed`/`matsOk`, 레벨업 시 차감), `axeDmg()`/`maxHpOf()`, 감시탑 `TOWERS`/`updateTowers`(`shots`의 `dmg` 덮어쓰기), 동상 `buildStatue()`
- v1.2: `S.stage` 3 = `UP.hearth`. `applyStage`가 `fence3`/`WALLS3`, `CAMP.x2`·`BOUNDS.x2`, `annexG`·`farTrees`·`eastBorder`, `LEATHER_ROUTE`를 처리. 3단계 코드는 `annexG` 블록(`PLOTS`, `updateAnnex`, `updateFarmer`, `updatePizzaCook`, 대장장이 `smithNpc`). 전리품 `S.raw`(주머니) → `S.forgeRaw`(⚒️ 칸) → `S.mats`. 겹침 점검은 1·2·3단계 모두 (`stage3Only`)
- v1.3: 창고 `S.whWood/whMeat`, `belts`/`updateWarehouses`(벨트 위 물건은 저장 안 됨), 은행 `S.bank`·`RUNNERS`(점원 NPC가 `walkPath`로 이동)·`payday()`/`S.strike`, `staffMul()`(walkPath·나무꾼 속도), 돌담 `stoneFence`, 숙소 `buildHouses()`
- v1.4: 창고는 `S.wh`(품목별)·`whOn()`/`whPut()`/`whRoom()`, 배달 `couriers`/`updateCourier`(`DELIVER` 목록, `collect`/`stash` 상태, `viaGate`). 공방 칸 `TAN.in`이 가죽·장작·전리품 공용, 대장장이는 `updateSmith`(`updateTannery`에서 호출). 피자 `T.pizzaRecipe`. 무기 `WEAPONS`/`buildWeapon()`(`axeHead`는 현재 칼날). `logFuel()`은 `UP.fire` 반영
- v1.4.1: Codex 병합. `guardPad`(큰 화로 칸 재사용), `S.paydayT`, 저장 `paid`는 칸 이름 키(옛 배열 저장은 버전별 칸 순서로 복원). `whCap()`·`courierCount()`가 `S.lv.fire` 반영. 전리품 픽업은 `beamGeo`/`ringGeo` 자식 메시
- v1.4.3: 창고·은행은 남서쪽 구석. `PAD_POS3`가 3단계 진입 때 칸 4개를 옮김. 겹침 검사는 같은 세션에서 1→2→3단계 순서로 해야 이동이 반영됨
