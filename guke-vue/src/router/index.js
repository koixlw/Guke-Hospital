import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuth } from '@/store/auth'

/**
 * 顶部业务域页签（点击后筛选左侧菜单）
 * 每个导航分组归属一个业务域，tab 为空表示常驻（总览）
 */
export const TOP_TABS = ['全部业务', '门诊业务', '住院业务', '手术业务', '统计报表', '系统管理']

/**
 * 侧边栏导航结构（分组 → 菜单项）
 * badge 标记为招标条款重点项
 */
export const NAV = [
  { g: '总览', items: [{ k: 'dash', t: '工作台', i: 'dash' }] },
  {
    g: '门诊·申请阶段',
    tab: '门诊业务',
    items: [
      { k: 'apply', t: '日间手术申请', i: 'doc' },
      { k: 'pay', t: '诊间缴费记账', i: 'wallet', badge: '▲' },
      { k: 'exam', t: '术前检查及预约', i: 'list' }
    ]
  },
  {
    g: '评估阶段',
    tab: '门诊业务',
    items: [
      { k: 'spec', t: '专科评估', i: 'steth' },
      { k: 'anes', t: '麻醉评估', i: 'syringe' }
    ]
  },
  {
    g: '预约·通知',
    tab: '住院业务',
    items: [
      { k: 'booking', t: '预约通知', i: 'sms' },
      { k: 'notify', t: '入院前通知', i: 'bell' }
    ]
  },
  {
    g: '住院环节',
    tab: '住院业务',
    items: [
      { k: 'admit', t: '入院登记', i: 'hosp', badge: '▲' },
      { k: 'transfer', t: '转普通入院', i: 'swap', badge: '▲' }
    ]
  },
  {
    g: '手术环节',
    tab: '手术业务',
    items: [
      { k: 'schedule', t: '手术安排', i: 'cal' },
      { k: 'checkin', t: '手术登记', i: 'barcode' },
      { k: 'fee', t: '手术费用', i: 'receipt', badge: '▲' },
      { k: 'order', t: '手术医嘱', i: 'rx', badge: '▲' }
    ]
  },
  {
    g: '管理与统计',
    tab: '手术业务',
    items: [
      { k: 'manage', t: '手术管理', i: 'grid' },
      { k: 'quit', t: '退出日间手术', i: 'exit' }
    ]
  },
  {
    g: '统计报表',
    tab: '统计报表',
    items: [{ k: 'query', t: '手术查询', i: 'chart' }]
  },
  { g: '系统设置', tab: '系统管理', items: [{ k: 'config', t: '参数配置', i: 'cog' }] }
]

export const TITLES = {
  dash: '工作台',
  apply: '日间手术申请',
  pay: '诊间缴费记账',
  exam: '术前检查及预约',
  spec: '专科评估',
  anes: '麻醉评估',
  booking: '预约通知',
  notify: '入院前通知',
  admit: '入院登记',
  transfer: '转普通入院',
  schedule: '手术安排',
  checkin: '手术登记',
  fee: '手术费用',
  order: '手术医嘱',
  manage: '手术管理',
  query: '手术查询',
  quit: '退出日间手术',
  config: '参数配置',
  login: '用户登录'
}

export const CRUMB = {
  apply: '门诊·申请阶段',
  pay: '门诊·申请阶段',
  exam: '门诊·申请阶段',
  spec: '评估阶段',
  anes: '评估阶段',
  booking: '预约·通知',
  notify: '预约·通知',
  admit: '住院环节',
  transfer: '住院环节',
  schedule: '手术环节',
  checkin: '手术环节',
  fee: '手术环节',
  order: '手术环节',
  manage: '管理与统计',
  query: '管理与统计',
  quit: '管理与统计',
  config: '系统设置'
}

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { title: TITLES.login, public: true } },
  { path: '/', redirect: '/dash' },
  { path: '/dash', name: 'dash', component: () => import('@/views/DashboardView.vue'), meta: { title: TITLES.dash, module: 'dash' } },
  { path: '/apply', name: 'apply', component: () => import('@/views/ApplyView.vue'), meta: { title: TITLES.apply, module: 'apply' } },
  { path: '/pay', name: 'pay', component: () => import('@/views/PayView.vue'), meta: { title: TITLES.pay, module: 'pay' } },
  { path: '/exam', name: 'exam', component: () => import('@/views/ExamView.vue'), meta: { title: TITLES.exam, module: 'exam' } },
  { path: '/spec', name: 'spec', component: () => import('@/views/SpecEvalView.vue'), meta: { title: TITLES.spec, module: 'spec' } },
  { path: '/anes', name: 'anes', component: () => import('@/views/AnesEvalView.vue'), meta: { title: TITLES.anes, module: 'anes' } },
  { path: '/booking', name: 'booking', component: () => import('@/views/BookingView.vue'), meta: { title: TITLES.booking, module: 'booking' } },
  { path: '/notify', name: 'notify', component: () => import('@/views/NotifyView.vue'), meta: { title: TITLES.notify, module: 'notify' } },
  { path: '/admit', name: 'admit', component: () => import('@/views/AdmitView.vue'), meta: { title: TITLES.admit, module: 'admit' } },
  { path: '/transfer', name: 'transfer', component: () => import('@/views/TransferView.vue'), meta: { title: TITLES.transfer, module: 'transfer' } },
  { path: '/schedule', name: 'schedule', component: () => import('@/views/ScheduleView.vue'), meta: { title: TITLES.schedule, module: 'schedule' } },
  { path: '/checkin', name: 'checkin', component: () => import('@/views/CheckinView.vue'), meta: { title: TITLES.checkin, module: 'checkin' } },
  { path: '/fee', name: 'fee', component: () => import('@/views/FeeView.vue'), meta: { title: TITLES.fee, module: 'fee' } },
  { path: '/order', name: 'order', component: () => import('@/views/OrderView.vue'), meta: { title: TITLES.order, module: 'order' } },
  { path: '/manage', name: 'manage', component: () => import('@/views/ManageView.vue'), meta: { title: TITLES.manage, module: 'manage' } },
  { path: '/query', name: 'query', component: () => import('@/views/QueryView.vue'), meta: { title: TITLES.query, module: 'query' } },
  { path: '/quit', name: 'quit', component: () => import('@/views/QuitView.vue'), meta: { title: TITLES.quit, module: 'quit' } },
  { path: '/config', name: 'config', component: () => import('@/views/ConfigView.vue'), meta: { title: TITLES.config, module: 'config' } },
  { path: '/:pathMatch(.*)*', redirect: '/dash' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

/* ================= 全局守卫：登录校验 + 模块权限校验 ================= */
router.beforeEach((to) => {
  const auth = useAuth()

  /* 登录页放行 */
  if (to.meta.public) {
    return auth.isLogged() && to.path === '/login' ? auth.homePath() : true
  }

  /* 未登录 → 跳转登录页，并记录原访问地址 */
  if (!auth.isLogged()) {
    return { path: '/login', query: to.fullPath === '/dash' ? {} : { redirect: to.fullPath } }
  }

  /* 已登录但无权访问该模块 → 提示并回到有权模块 */
  if (to.meta.module && !auth.hasModule(to.meta.module)) {
    ElMessage.warning(`当前角色「${auth.role.value.name}」无权访问【${TITLES[to.meta.module] || to.meta.module}】`)
    return auth.homePath()
  }

  return true
})

router.afterEach((to) => {
  const key = to.path.replace(/^\//, '') || 'dash'
  document.title = `${TITLES[key] || TITLES.dash} · 预入出院（日间手术）管理系统`
})

/**
 * 路由加载失败自愈
 *
 * 开发期 Vite 重新预构建依赖、或发布新版本后，浏览器持有的旧分片 URL 会失效
 * （旧 `?v=hash` 请求会返回 504 Outdated Optimize Dep），
 * 表现为「点击菜单没有反应」：路由被中断，URL 与页面都停在原地，且控制台无明显提示。
 *
 * 处理方式：记录下被打断的目标地址 → 刷新页面拿到新的分片 → 刷新后自动补跳。
 * 若短时间内重复失败（刷新也解决不了），则提示用户手动刷新，避免刷新死循环。
 */
const CHUNK_ERROR =
  /dynamically imported module|Loading chunk|Failed to fetch|Importing a module script failed|Outdated Optimize Dep/i

export const PENDING_ROUTE_KEY = 'guke_pending_route'
const RELOAD_TS_KEY = 'guke_chunk_reload_ts'

router.onError((error, to) => {
  const msg = error?.message || String(error || '')
  if (!CHUNK_ERROR.test(msg)) {
    console.error('[router] 导航失败', to?.fullPath, error)
    ElMessage.error('页面跳转失败，请重试')
    return
  }

  const last = Number(sessionStorage.getItem(RELOAD_TS_KEY) || 0)
  if (Date.now() - last < 10000) {
    ElMessage.error('页面资源加载持续失败，请手动刷新浏览器（Ctrl + Shift + R）')
    return
  }

  try {
    sessionStorage.setItem(PENDING_ROUTE_KEY, to?.fullPath || location.hash)
    sessionStorage.setItem(RELOAD_TS_KEY, String(Date.now()))
  } catch {
    /* 隐私模式下不可用时忽略 */
  }
  ElMessage.warning('页面资源已更新，正在自动刷新并继续跳转…')
  setTimeout(() => window.location.reload(), 600)
})

export default router
