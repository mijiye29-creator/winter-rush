# Claude ↔ Codex 자동 협업

## 1회 설정

1. 저장소에 [Claude GitHub App](https://github.com/apps/claude)을 설치한다.
2. 저장소 **Settings → Secrets and variables → Actions**에 `ANTHROPIC_API_KEY`와 `OPENAI_API_KEY`를 각각 Secret으로 등록한다. 키 값은 이슈, 채팅, 코드에 적지 않는다.
3. 같은 화면의 **Variables**에서 `AI_COLLAB_ENABLED`를 `true`로 등록한다. 이 값이 없거나 `false`이면 두 AI 작업이 실행되지 않아 API 비용이 발생하지 않는다.
4. 저장소 **Settings → Actions → General → Workflow permissions**에서 **Read and write permissions**를 허용한다. 필요한 범위는 Claude 작업의 코드·이슈·PR 쓰기와 Codex 검토 댓글 쓰기다.
5. `claude`와 `needs-review` 라벨을 만든다. 이미 있으면 그대로 쓴다.

## 사용법

1. 작업 이슈를 먼저 작성하고 목표·수정 범위·완료 조건을 채운다. 작성 **후** `claude` 라벨을 붙인다. 라벨을 붙이는 순간 Claude가 실행된다.
2. Claude가 코드를 바꾸면 워크플로가 PR을 열고 `needs-review` 라벨을 붙인다. Codex가 자동으로 변경 사항을 검토해 PR 댓글에 남긴다. 코드 변경이 없으면 PR은 열리지 않는다.
3. 수정이 필요하면 PR에 `@claude`와 함께 구체적인 요청을 댓글로 남긴다. Claude가 새 커밋을 올리면 Codex가 다시 검토한다.
4. 사람은 CI와 실제 모바일 플레이를 확인한 뒤 PR을 병합한다. 자동 병합은 하지 않는다.

`claude` 라벨을 다시 붙이거나 담당자가 `@claude` 댓글을 쓰면 Claude를 재실행할 수 있다. `needs-review` 라벨은 작업 중 비용을 아끼려면 제거하고, 검토할 준비가 되면 다시 붙인다. API 사용량은 각 서비스의 계정에서 확인한다.
