# Winter Rush

한겨울 숲속 마을을 키우고 침입자를 막는 모바일 게임의 첫 플레이 버전입니다.

출시 목표는 **Android와 iPhone 모두**입니다. 현재는 두 기기에서 공통으로 사용할 Godot 프로젝트를 개발 중이며, 앱 설치 파일은 아직 만들지 않았습니다. 준비 과정은 [모바일 출시 안내](docs/MOBILE_RELEASE.md)에 정리했습니다.

## 지금 해볼 수 있는 것

1. 노란색 `나`를 방향키/WASD로 움직이거나, 가고 싶은 쪽 칸을 눌러 한 칸씩 움직입니다.
2. `나무`와 `광석` 칸을 밟아 자원을 모읍니다. 다시 방문해도 채집할 수 있습니다.
3. `시장`에서 자원을 팔아 돈을 법니다. 나무는 3원, 광석은 5원입니다.
4. `확장` 칸에서 돈을 써 집, 작업장, 망루를 차례로 세웁니다. 건물마다 마을 체력이 3씩 늘어납니다.
5. `성장` 칸에서 경험치를 써 레벨을 올립니다.
6. 6턴마다 나타나는 `적`이 마을에 닿기 전에 그 칸으로 이동해 막습니다.

마을을 3번 확장하고 레벨 3에 도달하면 승리합니다. 마을 체력이 0이면 패배합니다. `R` 키나 종료 후 화면 터치로 다시 시작합니다.

## 실행하기

[Godot 4.3 이상](https://godotengine.org/download)으로 이 폴더의 `project.godot`를 연 뒤 **F5**를 누르세요. 첫 실행에는 Godot이 `.godot/` 임시 파일을 만듭니다.

명령줄에서는 저장소 루트에서 아래 명령을 사용합니다.

```bash
godot --path .
./tools/check.sh
```

첫 버전은 도형과 글자로 만든 시제품입니다. Android/iPhone 설치 파일, 저장 기능, 실제 그림과 소리, 스토어 등록은 다음 단계입니다.

## 파일 안내

- `project.godot`: Godot 프로젝트 설정
- `scenes/Main.tscn`, `scripts/main.gd`: 화면과 입력
- `scripts/game_state.gd`: 게임 규칙과 데이터
- `tests/run_tests.gd`: 핵심 규칙 검사
- `tests/run_ui_tests.gd`: 터치 입력과 재시작 검사
- `docs/ROADMAP.md`: 출시까지의 순서
- `docs/MOBILE_RELEASE.md`: Android/iPhone 빌드 준비
- `docs/AI_COLLABORATION.md`: Codex와 Claude 작업을 넘기는 방법
- `tools/check.sh`: 게임 규칙·터치·시작을 한 번에 검사
- `CLAUDE.md`: Claude와 작업할 때의 규칙

코드를 바꾸면 게임 규칙 검사를 실행하고, 화면도 직접 한 번 플레이해 보세요. 변경 사항은 작은 단위로 Git 커밋에 저장합니다.
