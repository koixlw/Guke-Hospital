/* ================= 角色 / 权限 / 演示账号 ================= */

/**
 * 权限模型：RBAC
 *  - 模块权限（modules）：决定左侧菜单与路由是否可见、可进入
 *  - 操作权限（actions）：决定页面内按钮是否可操作，编码为 `模块:操作`
 * 采用「最小权限原则」：默认不授权，需显式授予。
 */

/** 系统全部模块（与路由 key 一致） */
export const MODULES = [
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

/** 可授权的操作点 */
export const ACTIONS = {
  'apply:submit': '提交日间手术申请',
  'apply:print': '打印申请单',
  'pay:settle': '储值金充值 / 冻结 / 结转 / 结算',
  'exam:order': '新增术前检查申请',
  'spec:sign': '签发专科评估结论',
  'anes:submit': '提交麻醉评估结论',
  'booking:create': '完成手术预约并发送短信',
  'notify:send': '执行入院前通知任务',
  'admit:register': '确认入院登记',
  'transfer:submit': '转普通住院',
  'schedule:save': '保存手术排班 / 发出变动通知',
  'checkin:report': '手术报到登记',
  'fee:submit': '保存并提交手术费用',
  'order:submit': '保存并提交手术医嘱',
  'manage:arrange': '安排手术',
  'query:export': '导出报表',
  'quit:confirm': '确认退出日间手术',
  'config:save': '保存系统参数配置'
}

/** 角色定义 */
export const ROLE_DEFS = {
  center: {
    name: '日间手术中心',
    scope: '全院日间手术患者',
    desc: '预约、通知、入院、退出与手术管理',
    modules: [
      'dash',
      'apply',
      'pay',
      'exam',
      'spec',
      'anes',
      'booking',
      'notify',
      'admit',
      'schedule',
      'checkin',
      'manage',
      'quit',
      'query'
    ],
    actions: [
      'booking:create',
      'notify:send',
      'admit:register',
      'checkin:report',
      'manage:arrange',
      'quit:confirm',
      'query:export'
    ]
  },
  doctor: {
    name: '门急诊医生',
    scope: '本科室患者',
    desc: '开立日间手术申请、术前检查，签署专科评估与转住院',
    modules: ['dash', 'apply', 'exam', 'spec', 'anes', 'transfer', 'query'],
    actions: ['apply:submit', 'apply:print', 'exam:order', 'spec:sign', 'transfer:submit']
  },
  cashier: {
    name: '收费人员',
    scope: '全院患者（仅资金数据）',
    desc: '日间手术专项储值金充值、冻结、结转与门诊结算',
    modules: ['dash', 'pay', 'query'],
    actions: ['pay:settle']
  },
  specialist: {
    name: '专科医师',
    scope: '本科室患者',
    desc: '专科评估与麻醉评估结论签发',
    modules: ['dash', 'exam', 'spec', 'anes', 'query'],
    actions: ['spec:sign']
  },
  anes: {
    name: '麻醉医师',
    scope: '全院日间手术患者',
    desc: '麻醉评估、术中麻醉药医嘱补录',
    modules: ['dash', 'exam', 'anes', 'order', 'query'],
    actions: ['anes:submit', 'order:submit']
  },
  ward: {
    name: '住院登记处 / 护士',
    scope: '本院区患者',
    desc: '入院登记、手术报到与住院环节衔接',
    modules: ['dash', 'admit', 'checkin', 'schedule', 'transfer', 'query'],
    actions: ['admit:register', 'checkin:report', 'transfer:submit']
  },
  or: {
    name: '手术室人员',
    scope: '手术患者',
    desc: '手术排班、报到、费用与医嘱补录',
    modules: ['dash', 'schedule', 'checkin', 'fee', 'order', 'manage', 'query'],
    actions: ['schedule:save', 'checkin:report', 'fee:submit', 'order:submit', 'manage:arrange']
  },
  admin: {
    name: '系统管理员',
    scope: '配置数据（不含患者诊疗数据）',
    desc: '业务参数、字典、角色权限与短信模板维护',
    modules: [...MODULES],
    actions: Object.keys(ACTIONS)
  }
}

/** 演示账号（密码均为明文演示用，正式环境应由后端鉴权） */
export const USERS = [
  { u: 'zhangmin', p: '123456', name: '张敏', role: 'center', dept: '日间手术中心', title: '护士' },
  { u: 'liguodong', p: '123456', name: '李国栋', role: 'doctor', dept: '关节外科门诊', title: '主治医师' },
  { u: 'liufang', p: '123456', name: '刘芳', role: 'cashier', dept: '收费处', title: '收费员' },
  { u: 'wanghaitao', p: '123456', name: '王海涛', role: 'specialist', dept: '手外科 / 显微外科', title: '主任医师' },
  { u: 'zhouwenbin', p: '123456', name: '周文斌', role: 'anes', dept: '麻醉科', title: '主治医师' },
  { u: 'tangxuemei', p: '123456', name: '唐雪梅', role: 'or', dept: '手术室', title: '器械护士' },
  { u: 'heyong', p: '123456', name: '何静', role: 'ward', dept: '住院登记处', title: '护士' },
  { u: 'admin', p: 'admin123', name: '系统管理员', role: 'admin', dept: '信息中心', title: '管理员' }
]

/** 取角色定义 */
export const roleOf = (key) => ROLE_DEFS[key] || ROLE_DEFS.center
