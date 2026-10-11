# Winter Rush collaboration rules

- Playable source: `prototype/index.html` (page), `prototype/style.css` (UI), `prototype/game.js` (game logic), `prototype/balance.js` (tuning and upgrade data). Keep the prototype runnable without a build step or network.
- Design and test records: `docs/GDD.md`, `docs/PLAYTEST.md`. Change the design record when mechanics or numbers change.
- `main` is the latest playable web game (`prototype/`). Work happens on one branch per issue and lands on `main` through a PR. `gh-pages` is the publish branch: deploy copies `main:prototype/{balance.js,game.js,index.html,style.css}` to its root and writes `version.json` with the deployed commit sha.
- Work from GitHub issues (see `docs/WORKFLOW.md`): one issue per task, owner label `claude` or `codex`, PR body starts with `Closes #N`, reviews go in PR comments, follow-ups become new issues. Comment "시작: <branch>" on the issue before editing; if another open issue is changing the same file, coordinate on that issue first.
- Before editing, fetch the active branch and check `git status`. Read only the code the issue's scope names.
- After editing, check JavaScript syntax, run the mobile browser smoke check, and report what was tested. Push only commits based on the current remote head.
- Keep replies short. Report changed files and observed behavior; do not paste whole source files. If work must stop, use the user's handover format with exact branch and next command.
- This is a web prototype. Apply the user's ScriptableObject, GameManager, and modular C# rules when a Unity port begins.
