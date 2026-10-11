# winter-rush
한겨울 숲속 마을 모바일 게임 개발 프로젝트

## 윈터 러시
나무를 베고, 북극곰을 사냥해 고기를 굽고, 마을 주민에게 팔아 업그레이드하세요.
주기적으로 몰려오는 **눈보라** 동안 모닥불이 꺼지지 않게 지키고, 마을을 습격하는 **곰**을 막아야 합니다.

- 기획서: [`docs/GDD.md`](docs/GDD.md)
- 플레이 가능한 프로토타입: [`prototype/index.html`](prototype/index.html)
- 플레이테스트 기록: [`docs/PLAYTEST.md`](docs/PLAYTEST.md)
- Claude·Codex 협업 방식: [`docs/WORKFLOW.md`](docs/WORKFLOW.md)

## 프로토타입 실행
빌드가 필요 없습니다. `prototype/index.html`을 브라우저로 열면 됩니다. Three.js는 프로젝트에 포함되어 있어 인터넷 연결 없이도 게임을 시작할 수 있습니다. 웹 글꼴은 연결되지 않으면 기기의 기본 글꼴로 표시됩니다.

```bash
cd prototype && python3 -m http.server 8000
# 휴대폰과 PC가 같은 와이파이라면 휴대폰에서 http://<PC-IP>:8000 접속
```

조작: 화면을 탭/클릭하면 그 위치로 이동, 드래그하면 가상 조이스틱, PC는 WASD 또는 방향키.

수치·업그레이드 비용은 `prototype/balance.js`, 게임 규칙은 `prototype/game.js`, 화면은 `prototype/index.html`과 `prototype/style.css`에서 관리합니다.

## Godot 시제품 (보류)
저장소 루트의 `project.godot`, `scenes/`, `scripts/`, `tests/`는 Codex가 만든 Godot 4 격자형 시제품입니다. 지금 개발·배포하는 게임은 위의 웹 프로토타입이며, 앱 이식을 시작할 때 참고합니다. 실행: Godot 4.3 이상으로 `project.godot`를 열고 F5, 검사는 `./tools/check.sh`. 모바일 출시 준비는 [`docs/MOBILE_RELEASE.md`](docs/MOBILE_RELEASE.md)에 있습니다.
