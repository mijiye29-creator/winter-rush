#!/bin/bash
# 클라우드 세션 시작 때 HyperFrames 스킬과 markitdown을 설치하거나 최신으로 맞춥니다.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# 네트워크 문제로 설치가 실패해도 세션 시작은 막지 않습니다.
if ! timeout 300 npx --yes hyperframes skills update >/dev/null 2>&1; then
  echo "hyperframes skills update failed; run 'npx hyperframes skills update' manually." >&2
fi

# markitdown: 문서(PDF, Word, Excel 등)를 Markdown으로 바꾸는 도구
venv="$HOME/.venvs/markitdown"
if [ ! -x "$venv/bin/markitdown" ]; then
  if ! { python3 -m venv "$venv" &&
         timeout 600 "$venv/bin/pip" install -q 'markitdown[all]'; } >/dev/null 2>&1; then
    echo "markitdown install failed; see the session-start hook for the install command." >&2
  fi
fi
if [ -n "${CLAUDE_ENV_FILE:-}" ] && [ -x "$venv/bin/markitdown" ]; then
  echo "export PATH=\"$venv/bin:\$PATH\"" >> "$CLAUDE_ENV_FILE"
fi
