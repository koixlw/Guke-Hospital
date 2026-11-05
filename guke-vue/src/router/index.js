import { createRouter, createWebHashHistory } from 'vue-router'

/**
 * 侧边栏导航结构（分组 → 菜单项）
 * badge 标记为招标条款重点项
 */
export const NAV = [
  { g: '总览', items: [{ k: 'dash', t: '工作台', i: 'dash' }] },
  {
    g: '门诊·申请阶段',
    items: [
      { k: 'apply', t: '日间手术申请', i: 'doc' },
      { k: 'pay', t: '诊间缴费记账', i: 'wallet', badge: '▲' },
      { k: 'exam', t: '术前检查及预约', i: 'list' }
    ]
  },
  {
    g: '评估阶段',
    items: [
      { k: 'spec', t: '专科评估', i: 'steth' },
      { k: 'anes', t: '麻醉评估', i: 'syringe' }
    ]
  },
  {
    g: '预约·通知',
    items: [
      { k: 'booking', t: '预约通知', i: 'sms' },
      { k: 'notify', t: '入院前通知', i: 'bell' }
    ]
  },
  {
    g: '住院环节',
    items: [
      { k: 'admit', t: '入院登记', i: 'hosp', badge: '▲' },
      { k: 'transfer', t: '转普通入院', i: 'swap', badge: '▲' }
    ]
  },
  {
    g: '手术环节',
    items: [
      { k: 'schedule', t: '手术安排', i: 'cal' },
      { k: 'checkin', t: '手术登记', i: 'barcode' },
      { k: 'fee', t: '手术费用', i: 'receipt', badge: '▲' },
      { k: 'order', t: '手术医嘱', i: 'rx', badge: '▲' }
    ]
  },
  {
    g: '管理与统计',
    items: [
      { k: 'manage', t: '手术管理', i: 'grid' },
      { k: 'query', t: '手术查询', i: 'chart' },
      { k: 'quit', t: '退出日间手术', i: 'exit' }
    ]
  },
  { g: '系统设置', items: [{ k: 'config', t: '参数配置', i: 'cog' }] }
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
  config: '参数配置'
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
  { path: '/', redirect: '/dash' },
  { path: '/dash', name: 'dash', component: () => import('@/views/DashboardView.vue'), meta: { title: TITLES.dash } },
  { path: '/apply', name: 'apply', component: () => import('@/views/ApplyView.vue'), meta: { title: TITLES.apply } },
  { path: '/pay', name: 'pay', component: () => import('@/views/PayView.vue'), meta: { title: TITLES.pay } },
  { path: '/exam', name: 'exam', component: () => import('@/views/ExamView.vue'), meta: { title: TITLES.exam } },
  { path: '/spec', name: 'spec', component: () => import('@/views/SpecEvalView.vue'), meta: { title: TITLES.spec } },
  { path: '/anes', name: 'anes', component: () => import('@/views/AnesEvalView.vue'), meta: { title: TITLES.anes } },
  { path: '/booking', name: 'booking', component: () => import('@/views/BookingView.vue'), meta: { title: TITLES.booking } },
  { path: '/notify', name: 'notify', component: () => import('@/views/NotifyView.vue'), meta: { title: TITLES.notify } },
  { path: '/admit', name: 'admit', component: () => import('@/views/AdmitView.vue'), meta: { title: TITLES.admit } },
  { path: '/transfer', name: 'transfer', component: () => import('@/views/TransferView.vue'), meta: { title: TITLES.transfer } },
  { path: '/schedule', name: 'schedule', component: () => import('@/views/ScheduleView.vue'), meta: { title: TITLES.schedule } },
  { path: '/checkin', name: 'checkin', component: () => import('@/views/CheckinView.vue'), meta: { title: TITLES.checkin } },
  { path: '/fee', name: 'fee', component: () => import('@/views/FeeView.vue'), meta: { title: TITLES.fee } },
  { path: '/order', name: 'order', component: () => import('@/views/OrderView.vue'), meta: { title: TITLES.order } },
  { path: '/manage', name: 'manage', component: () => import('@/views/ManageView.vue'), meta: { title: TITLES.manage } },
  { path: '/query', name: 'query', component: () => import('@/views/QueryView.vue'), meta: { title: TITLES.query } },
  { path: '/quit', name: 'quit', component: () => import('@/views/QuitView.vue'), meta: { title: TITLES.quit } },
  { path: '/config', name: 'config', component: () => import('@/views/ConfigView.vue'), meta: { title: TITLES.config } },
  { path: '/:pathMatch(.*)*', redirect: '/dash' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.afterEach((to) => {
  const key = to.path.replace(/^\//, '') || 'dash'
  document.title = `${TITLES[key] || TITLES.dash} · 预入出院（日间手术）管理系统`
})

export default router
