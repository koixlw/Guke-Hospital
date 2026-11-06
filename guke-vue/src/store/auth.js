import { computed, reactive } from 'vue'
import { ACTIONS, ROLE_DEFS, USERS, roleOf } from '@/data/permissions'

/* ================= 登录态与权限判定 ================= */

const STORAGE_KEY = 'guke_day_surgery_user'

/* 演示用：把登录态存在 localStorage，刷新页面保持登录 */
function restore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    /* 只以账号为准恢复，角色等属性一律取自账号表，避免本地存储被篡改 */
    const hit = USERS.find((x) => x.u === s.u)
    if (!hit) return null
    return { u: hit.u, name: hit.name, role: hit.role, dept: hit.dept, title: hit.title }
  } catch {
    return null
  }
}

const state = reactive({
  user: restore()
})

const persist = () => {
  try {
    if (state.user) localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* 隐私模式下 localStorage 不可用时忽略，不影响使用 */
  }
}

/* 当前登录用户（不含密码） */
const currentUser = computed(() => state.user)

/** 当前角色定义 */
const currentRole = computed(() => (state.user ? roleOf(state.user.role) : null))

/** 是否已登录 */
const isLogged = () => !!state.user

/**
 * 登录
 * @returns {{ok: boolean, msg?: string}}
 */
const login = (username, password) => {
  const u = String(username || '').trim()
  const p = String(password || '')
  if (!u) return { ok: false, msg: '请输入账号' }
  if (!p) return { ok: false, msg: '请输入密码' }
  const hit = USERS.find((x) => x.u === u)
  if (!hit) return { ok: false, msg: '账号不存在，请重新输入' }
  if (hit.p !== p) return { ok: false, msg: '密码错误，请重新输入' }
  state.user = { u: hit.u, name: hit.name, role: hit.role, dept: hit.dept, title: hit.title }
  persist()
  return { ok: true }
}

/** 退出登录 */
const logout = () => {
  state.user = null
  persist()
}

/**
 * 操作权限判定
 * @param {string|string[]} code 形如 'pay:settle'，也可传数组表示「任一满足」
 */
const can = (code) => {
  if (!state.user) return false
  if (!code) return true
  const list = Array.isArray(code) ? code : [code]
  if (!list.length) return true
  const owned = roleOf(state.user.role).actions
  return list.some((c) => owned.includes(c))
}

/** 模块（菜单 / 路由）权限判定 */
const hasModule = (key) => {
  if (!state.user) return false
  if (!key) return true
  return roleOf(state.user.role).modules.includes(key)
}

/** 可见模块列表（按系统模块顺序） */
const visibleModules = () => {
  if (!state.user) return []
  const owned = roleOf(state.user.role).modules
  return owned.slice()
}

/** 登录后的落地页：优先工作台，否则第一个有权模块 */
const homePath = () => {
  const mods = visibleModules()
  if (mods.includes('dash')) return '/dash'
  return mods.length ? '/' + mods[0] : '/login'
}

export function useAuth() {
  return {
    user: currentUser,
    role: currentRole,
    isLogged,
    login,
    logout,
    can,
    hasModule,
    visibleModules,
    homePath
  }
}

/** 操作权限说明（用于「我的权限」展示） */
export const actionLabels = (roleKey) =>
  (ROLE_DEFS[roleKey]?.actions || []).map((c) => ({
    code: c,
    label: ACTIONS[c] || c
  }))

export { ACTIONS, ROLE_DEFS }
