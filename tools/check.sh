#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

if ! command -v godot >/dev/null 2>&1; then
  echo "Godot 4 is required to run checks." >&2
  exit 1
fi

# The managed cloud machine has a read-only home directory.
if [[ ! -w "$HOME" ]]; then
  export XDG_CONFIG_HOME="${XDG_CONFIG_HOME:-/tmp/winter-rush-config}"
  export XDG_CACHE_HOME="${XDG_CACHE_HOME:-/tmp/winter-rush-cache}"
  export XDG_DATA_HOME="${XDG_DATA_HOME:-/tmp/winter-rush-data}"
fi

godot --headless --path . --script tests/run_tests.gd
godot --headless --path . --script tests/run_ui_tests.gd
godot --headless --path . --quit-after 3
