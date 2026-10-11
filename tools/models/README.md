# 3D 모델 만들기

블렌더 없이 코드로 모델을 만들고 GLB 파일로 내보냅니다. 게임은 `prototype/models/*.glb`를 읽고, 파일을 못 읽으면 예전 도형 모습으로 그립니다.

- `hero_lv1.js`, `woodcutter_lv1.js`, `hunter_lv1.js`, `hearth_lv1.js`: 주인공·나무꾼·사냥꾼·모닥불 Lv1 모양. 크기·색을 바꾸려면 이 파일을 고칩니다. `kit.js`는 공통 도우미입니다.
- `export.html`: 브라우저로 열면 앞·옆·뒤·게임 각도 미리보기(`?m=hunter_lv1`처럼 고름)와 모델별 GLB 내려받기 버튼이 나옵니다.
- `bake.js`: 부품을 색이 칠해진 한 덩어리로 합칩니다. 게임이 주인공을 한 번에 그려서 가볍습니다.
- `build.js`: 저장소 루트에서 `node tools/models/build.js 미리보기폴더` 를 실행하면 `prototype/models/*.glb`를 모두 다시 만듭니다(Playwright 필요).

기준: 발바닥 y=0, 얼굴은 +z 방향, 키 약 1.95. 오른손 벙어리장갑이 도끼 손잡이 위치(.45, .8, .15)에 있습니다. 부품·재질 이름(coat, fur, scarf …)은 다음 레벨 장비를 얹거나 색을 바꿀 때 씁니다.

면수 기준: 모델 하나에 삼각형 약 1,500개 이하, 메시 1개. 미리보기 페이지 제목에 삼각형 수가 나옵니다.

claude.ai 아티팩트처럼 .glb 파일을 못 올리는 곳에서는 모델을 base64로 담은 `models/models.js`(`window.WINTER_MODELS = {이름: base64}`)를 만들어 `game.js`보다 먼저 읽히면 됩니다. 게임은 그게 있으면 파일 대신 그걸 씁니다.
