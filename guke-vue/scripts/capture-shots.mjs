#!/usr/bin/env node
/**
 * 逐页截图（无需额外依赖，基于 Chrome DevTools Protocol）
 *
 * 系统已加入登录与角色权限，截图前需要先注入登录态，
 * 因此不再直接用 `chrome --screenshot` 打开路由（那样只会截到登录页）。
 *
 * 用法：
 *   npm run dev                # 另开一个终端
 *   node scripts/capture-shots.mjs [--port 5173] [--user admin] [--out shots]
 */

import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROUTES = [
  'dash',
  'apply',
  'pay',
  'exam',
  'spec',
  'anes',
  'booking',
  'notify',
  'admit',
  'transfer',
  'schedule',
  'checkin',
  'fee',
  'order',
  'manage',
  'query',
  'quit',
  'config'
]

const argv = process.argv.slice(2)
const arg = (k, d) => {
  const i = argv.indexOf(`--${k}`)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d
}

const PORT = arg('port', process.env.PORT || '5173')
const BASE = `http://127.0.0.1:${PORT}`
const OUT = resolve(arg('out', 'shots'))
const USER = arg('user', 'admin')
const WIDTH = Number(arg('width', 1600))
const HEIGHT = Number(arg('height', 1250))

/* 演示账号 → 登录态（与 src/data/permissions.js 保持一致） */
const ACCOUNTS = {
  admin: { u: 'admin', name: '系统管理员', role: 'admin', dept: '信息中心', title: '管理员' },
  zhangmin: { u: 'zhangmin', name: '张敏', role: 'center', dept: '日间手术中心', title: '护士' },
  liguodong: { u: 'liguodong', name: '李国栋', role: 'doctor', dept: '关节外科门诊', title: '主治医师' }
}

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function findChrome() {
  const { existsSync } = await import('node:fs')
  for (const c of CHROME_CANDIDATES) if (existsSync(c)) return c
  throw new Error('未找到 Chrome / Edge，请手动指定浏览器路径')
}

/** 极简 CDP 客户端（Node 22 内置 WebSocket，无第三方依赖） */
async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl)
  await new Promise((res, rej) => {
    ws.onopen = res
    ws.onerror = rej
  })
  let id = 0
  const waiting = new Map()
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id && waiting.has(msg.id)) {
      const { resolve: rs, reject: rj } = waiting.get(msg.id)
      waiting.delete(msg.id)
      msg.error ? rj(new Error(JSON.stringify(msg.error))) : rs(msg.result)
    }
  }
  return {
    send(method, params = {}) {
      const mid = ++id
      ws.send(JSON.stringify({ id: mid, method, params }))
      return new Promise((rs, rj) => waiting.set(mid, { resolve: rs, reject: rj }))
    },
    close: () => ws.close()
  }
}

async function main() {
  const account = ACCOUNTS[USER]
  if (!account) throw new Error(`未知演示账号：${USER}`)

  const chrome = await findChrome()
  mkdirSync(OUT, { recursive: true })

  const port = 9333
  const proc = spawn(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      `--remote-debugging-port=${port}`,
      `--window-size=${WIDTH},${HEIGHT}`,
      '--user-data-dir=' + resolve('.chrome-shot-profile'),
      'about:blank'
    ],
    { stdio: 'ignore' }
  )

  /* 等待调试端口就绪 */
  let targets = null
  for (let i = 0; i < 40; i++) {
    await sleep(250)
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`)
      targets = await res.json()
      if (targets.some((t) => t.type === 'page')) break
    } catch {
      /* 继续等待 */
    }
  }
  const page = targets?.find((t) => t.type === 'page')
  if (!page) throw new Error('无法连接 Chrome 调试端口')

  const cdp = await connect(page.webSocketDebuggerUrl)
  await cdp.send('Page.enable')

  const goto = async (url, wait = 700) => {
    await cdp.send('Page.navigate', { url })
    await sleep(wait)
  }

  /* 1. 打开站点（会跳到登录页） */
  await goto(`${BASE}/#/login`, 1200)

  /* 2. 注入登录态后整页重载（登录态在应用启动时读取 localStorage） */
  await cdp.send('Runtime.evaluate', {
    expression: `localStorage.setItem('guke_day_surgery_user', ${JSON.stringify(JSON.stringify(account))})`
  })
  await cdp.send('Page.reload', { ignoreCache: false })
  await sleep(1800)

  /* 3. 逐页截图 */
  for (const r of ROUTES) {
    await goto(`${BASE}/#/${r}`, 900)
    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    })
    writeFileSync(resolve(OUT, `vue-${r}.png`), Buffer.from(data, 'base64'))
    process.stdout.write(`captured vue-${r}.png\n`)
  }

  cdp.close()
  proc.kill()
  console.log(`已输出至 ${OUT}`)
}

main().catch((e) => {
  console.error('截图失败：', e.message)
  process.exit(1)
})
