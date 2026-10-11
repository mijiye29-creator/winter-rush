# 3D 모델 만들기

블렌더 없이 코드로 모델을 만들고 GLB 파일로 내보냅니다. 게임은 `prototype/models/*.glb`를 읽고, 파일을 못 읽으면 예전 도형 모습으로 그립니다.

- `hero_lv1.js`: 주인공 Lv1(견습 사냥꾼) 모양. 크기·색을 바꾸려면 이 파일을 고칩니다.
- `export.html`: 브라우저로 열면 앞·옆·뒤·게임 각도 미리보기와 GLB 내려받기 버튼이 나옵니다.
- `build.js`: 저장소 루트에서 `node tools/models/build.js 미리보기.png` 를 실행하면 `prototype/models/hero_lv1.glb`를 다시 만듭니다(Playwright 필요).

기준: 발바닥 y=0, 얼굴은 +z 방향, 키 약 1.95. 오른손 벙어리장갑이 도끼 손잡이 위치(.45, .8, .15)에 있습니다. 부품·재질 이름(coat, fur, scarf …)은 다음 레벨 장비를 얹거나 색을 바꿀 때 씁니다.
