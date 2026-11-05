#!/usr/bin/env bash
# 逐页截图（开发服务器需在 5174 端口运行）
set -u
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
OUT="C:/Users/Administrator/Desktop/demo/guke-vue/shots"
BASE="http://127.0.0.1:5174"
mkdir -p "$OUT"
for r in dash apply pay exam spec anes booking notify admit transfer schedule checkin fee order manage query quit config; do
  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --screenshot="$OUT/vue-$r.png" --window-size=1600,1250 --virtual-time-budget=3000 \
    "$BASE/#/$r" >/dev/null 2>&1
done
echo "captured $(ls -1 "$OUT" | wc -l) files"
