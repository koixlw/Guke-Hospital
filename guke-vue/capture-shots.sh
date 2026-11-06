#!/usr/bin/env bash
# 逐页截图（开发服务器需先启动，端口可用 --port 指定）
#
# 系统已加入登录与角色权限，截图脚本需要先注入登录态，
# 因此改用 scripts/capture-shots.mjs（基于 Chrome DevTools Protocol，无额外依赖）。
set -u
PORT="${1:-5173}"
cd "$(dirname "$0")"
node scripts/capture-shots.mjs --port "$PORT" --out shots
