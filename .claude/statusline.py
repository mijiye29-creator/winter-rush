#!/usr/bin/env python3
"""Claude Code 상태줄: 이번 세션에서 쓴 토큰과 비용을 한 줄로 보여 줍니다.

끄려면 환경 변수 WR_TOKEN_MODE=off 로 실행하거나 .claude/settings.json 의 statusLine 을 지웁니다.
"""
import json
import os
import sys


def short(n):
    n = int(n or 0)
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n / 1_000:.1f}k"
    return str(n)


def main():
    if os.environ.get("WR_TOKEN_MODE", "").lower() == "off":
        return
    try:
        data = json.load(sys.stdin)
    except ValueError:
        print("토큰 정보 없음")
        return

    model = (data.get("model") or {}).get("display_name") or "Claude"
    ctx = data.get("context_window") or {}
    cost = (data.get("cost") or {}).get("total_cost_usd")

    total_in = ctx.get("total_input_tokens") or 0
    total_out = ctx.get("total_output_tokens") or 0

    # 지금 대화가 컨텍스트 창을 얼마나 채웠는지
    pct = ctx.get("used_percentage")
    if pct is None:
        usage = ctx.get("current_usage") or {}
        used = sum(usage.get(k) or 0 for k in (
            "input_tokens", "cache_creation_input_tokens", "cache_read_input_tokens"))
        size = ctx.get("context_window_size") or 0
        pct = used * 100 / size if size else None

    parts = [model, f"입력 {short(total_in)}", f"출력 {short(total_out)}",
             f"합계 {short(total_in + total_out)}"]
    if pct is not None:
        parts.append(f"컨텍스트 {pct:.0f}%")
    if cost is not None:
        parts.append(f"${cost:.2f}")
    print(" | ".join(parts))


main()
