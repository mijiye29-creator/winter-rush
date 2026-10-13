# GitHub로 Claude·Codex 협업하기

![이슈에서 Claude, PR에서 Codex로 링크를 넘기는 순서](images/ai-setup-guide.png)

GitHub는 두 AI가 같은 코드와 작업 기록을 읽는 공유 장소다. **이슈·PR 링크를 각 AI 채팅에 직접 전달**하면 된다. GitHub 라벨이나 댓글만으로 Claude·Codex가 자동 실행되지는 않는다. 저장소에서 AI API를 호출하는 Actions는 사용하지 않으므로 새 API 키 등록은 필요 없다.

## 매번 하는 일

1. [Winter Rush 이슈](https://github.com/mijiye29-creator/winter-rush/issues/new/choose)에서 **작업**을 선택하고 목표·수정 범위·완료 조건을 적는다. `claude` 라벨은 담당 표시다.
2. 이슈 링크를 Claude 채팅에 보내고 아래 문장을 붙여 넣는다. Claude가 브랜치와 PR을 GitHub에 올려야 Codex가 변경 사항을 읽을 수 있다.
3. PR 링크를 이 Codex 채팅에 보내고 아래 검토 문장을 붙여 넣는다. 수정 내용은 같은 PR 브랜치에 반영한다.
4. [Actions](https://github.com/mijiye29-creator/winter-rush/actions)에서 **Prototype checks** 통과를 확인하고 휴대폰 크기 화면에서 플레이한다. 준비되면 사람이 PR을 병합한다.

### Claude에게 보낼 문장

> `mijiye29-creator/winter-rush` 이슈 #번호를 읽고 `AGENTS.md`, `docs/WORKFLOW.md` 규칙에 따라 구현해 줘. `origin/main` 기준 새 브랜치에서 작업하고 `node --check prototype/game.js`, `node --check prototype/balance.js`, `git diff --check`와 모바일 플레이를 확인해 줘. 브랜치를 푸시하고 본문 첫 줄이 `Closes #번호`인 PR을 만들어 줘. 브랜치·커밋·검사 결과를 PR에 기록해 줘.

### Codex에게 보낼 문장

> `mijiye29-creator/winter-rush` PR #번호를 검토해 줘. 버그, 모바일 조작, 저장·이어하기, 게임 밸런스를 확인하고 필요한 수정은 해당 PR 브랜치에 반영해 줘. 검사 결과와 남은 문제를 PR에 기록해 줘.

Claude나 Codex가 다른 컴퓨터에서 작업한다면 **로컬 커밋만으로는 공유되지 않는다**. 브랜치를 GitHub에 푸시해야 한다. 계정 연결은 각 서비스의 GitHub 접근 권한을 사용할 수 있지만, 이 협업 절차에 GitHub Actions용 AI API 키는 필요 없다.

## 토큰 사용량 보기 (Claude Code)

저장소의 `.claude/settings.json`이 Claude Code 하단 상태줄에 이번 세션의 토큰을 보여 줍니다.

```
Opus | 입력 152.3k | 출력 8.1k | 합계 160.5k | 컨텍스트 22% | $0.43
```

- 컴퓨터의 터미널에서 이 저장소를 열고 `claude`를 실행하면 자동으로 켜집니다. `python3`가 필요합니다.
- 끄기: `WR_TOKEN_MODE=off claude` 로 실행합니다.
- 즉시 확인: 대화창에 `/cost`(토큰·비용) 또는 `/context`(컨텍스트 사용량)를 입력합니다.
