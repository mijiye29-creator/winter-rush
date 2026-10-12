# Claude ↔ GPT 협업 (API 없이 GitHub로)

API 키를 등록하지 않는다. 두 AI는 각자 앱에서 이 저장소에 GitHub로 연결해 작업하고, **이슈·PR·커밋으로만** 소통한다. 서로의 채팅은 공유되지 않으므로 필요한 내용은 전부 GitHub에 남긴다.

| | Claude | GPT (ChatGPT Codex) |
|---|---|---|
| 연결 | Claude Code(claude.ai/code)의 GitHub 연동 | ChatGPT Codex의 GitHub 연동(Codex 앱) |
| 작업 시작 | Claude 세션에 "이슈 #N 해줘" | Codex 웹에서 저장소 선택 후 "이슈 #N 해줘" |
| 검토 요청 | Claude 세션에 "PR #N 검토해줘" | PR 코멘트에 `@codex review` |
| 결과 | 브랜치 푸시 + PR, 검토는 PR 코멘트 | 브랜치 푸시 + PR, 검토는 PR 코멘트 |

## 1회 설정

- **GPT**: ChatGPT Codex 설정의 [Environments](https://chatgpt.com/codex/cloud/settings/environments)에서 이 저장소(`mijiye29-creator/winter-rush`) 환경을 한 번 만든다. 없으면 `@codex review`에 "create an environment" 안내 댓글만 달린다.
- **Claude**: claude.ai/code에서 GitHub를 연결하고 이 저장소를 고른다.

## 순서

1. 형이 이슈를 만든다(템플릿 5줄, 담당 라벨 `claude` 또는 `codex`).
2. 담당 AI가 이슈에 "시작: 브랜치 이름"을 남기고 작업 → PR(`Closes #N`).
3. 다른 AI가 PR을 검토하고 PR 코멘트로 의견을 남긴다. 고칠 것은 담당 AI가 같은 브랜치에 커밋, 나중 일은 새 이슈.
4. 형이 CI·모바일 플레이를 확인하고 병합한다. 병합 후 `gh-pages` 배포.

## 꺼 둔 것

- `.github/workflows/claude-issues.yml`, `codex-review.yml`은 API 키가 필요한 자동 실행이다. 저장소 변수 `AI_COLLAB_ENABLED`가 없으면 실행되지 않으므로 **등록하지 않는다**. API 비용이 생기지 않는다.
- Codex 검토는 ChatGPT 계정 사용량을 쓴다. 한도에 걸리면 PR에 그렇게 댓글이 달리며, 그때는 Claude에게 검토를 맡기거나 한도가 풀린 뒤 `@codex review`를 다시 단다.
