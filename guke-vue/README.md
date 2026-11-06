# 预入出院（日间手术）管理系统 · 四川省骨科医院

Vue 3 + Vite + Element Plus 重写版。由原静态演示系统（`../guke/`，原生 JavaScript + 字符串模板 + hash 路由）逐页迁移而来，页面内容、数据与信息结构与原版保持一致。

在此基础上补充了**登录鉴权与角色权限（RBAC）**：不同岗位登录后可见模块、可访问路由与可执行操作均不同。

## 技术栈

| 依赖 | 版本 | 用途 |
|---|---|---|
| Vue | ^3.5 | `<script setup>` 单文件组件 |
| Vite | ^8 | 开发服务器与构建 |
| Element Plus | ^2.14 | 表单 / 表格 / 按钮 / 标签 / 提示条 / 步骤条等 UI 组件 |
| vue-router | ^4.6 | hash 路由（与原版 `#/dash` 形式一致） |
| @element-plus/icons-vue | ^2.3 | Element Plus 图标 |

未引入 UI 框架之外的重型依赖；图表为轻量自绘 SVG/CSS 组件，无 ECharts 依赖。
权限体系同样零依赖：`src/store/auth.js` 为一个基于 `reactive` 的轻量登录态模块。

## 快速开始

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # 产物输出到 dist/
npm run preview  # 本地预览构建产物
```

进入系统需先登录。演示环境密码统一为 `123456`（系统管理员为 `admin123`）：

| 账号 | 姓名 | 角色 | 可访问模块 |
|---|---|---|---|
| `zhangmin` | 张敏 | 日间手术中心 | 14 个（预约 / 通知 / 入院 / 退出 / 管理） |
| `liguodong` | 李国栋 | 门急诊医生 | 7 个（申请 / 检查 / 评估 / 转住院） |
| `liufang` | 刘芳 | 收费人员 | 3 个（工作台 / 缴费记账 / 查询） |
| `wanghaitao` | 王海涛 | 专科医师 | 5 个（专科 / 麻醉评估） |
| `zhouwenbin` | 周文斌 | 麻醉医师 | 5 个（麻醉评估 / 手术医嘱） |
| `tangxuemei` | 唐雪梅 | 手术室人员 | 7 个（安排 / 登记 / 费用 / 医嘱） |
| `heyong` | 何静 | 住院登记处 / 护士 | 6 个（入院 / 登记 / 安排） |
| `admin` | 系统管理员 | 系统管理员 | 全部 18 个 |

登录页提供演示账号卡片，点击即可自动填充账号密码，便于快速切换角色对比权限差异。

## 登录与权限

### 权限模型

RBAC，两层控制：

- **模块权限**（`ROLE_DEFS[].modules`）——决定左侧菜单可见性与路由可进入性。
  路由守卫 `router.beforeEach` 校验 `to.meta.module`，无权访问时提示并跳回有权的落地页。
- **操作权限**（`ROLE_DEFS[].actions`）——决定页面内按钮是否渲染 / 可执行。
  编码为 `模块:操作`（如 `pay:settle`、`spec:sign`、`quit:confirm`），共 18 个操作点。

### 关键文件

| 文件 | 职责 |
|---|---|
| `src/data/permissions.js` | 角色定义、模块清单、操作点清单、演示账号 |
| `src/store/auth.js` | 登录态（localStorage 持久化）、`login / logout / can / hasModule` |
| `src/views/LoginView.vue` | 登录页（品牌区 + 登录表单 + 演示账号选择） |
| `src/router/index.js` | `/login` 公开路由、全局守卫、模块 `meta` |

### 在页面中控制按钮

```vue
<!-- 无权限时该按钮不渲染 -->
<el-button v-perm="'pay:settle'">充值</el-button>

<!-- 脚本内判定 -->
import { useAuth } from '@/store/auth'
const auth = useAuth()
if (!auth.can('spec:sign')) ElMessage.warning('当前角色无签发权限')
```

`v-perm` 为全局指令（见 `src/main.js`），支持单个编码或数组（任一满足即渲染）。

### 切换账号

顶栏右上角用户菜单提供「我的权限」（查看可见模块与可执行操作）、「切换账号」与「退出登录」。

## 目录结构

```
src/
├── App.vue                 应用外壳：顶栏 / 侧边栏 / 面包屑 / 路由出口 / 我的权限
├── main.js                 入口（Element Plus 全量注册 + 中文语言包 + v-perm 指令）
├── router/index.js         路由表、全局守卫、侧边栏 NAV、顶部业务域页签、标题与面包屑
├── store/auth.js           登录态与权限判定
├── data/permissions.js     角色 / 模块 / 操作点 / 演示账号
├── data/demo.js            全部演示数据（患者、检验、流水、短信、费用组套、字典…）
├── utils/format.js         金额格式化与状态 → 标签类型映射
├── styles/index.css        设计令牌 + Element Plus 主题变量覆盖 + 业务样式
├── components/             共享组件
│   ├── PageHeader.vue      页头（标题 / 副标题 / 操作区）
│   ├── SectionCard.vue     卡片容器
│   ├── PatientBand.vue     患者信息条
│   ├── TagBox.vue          状态标签
│   ├── StatTile.vue        KPI 磁贴
│   ├── MiniStat.vue        小统计块
│   ├── StepsBar.vue        步骤条
│   ├── InfoList.vue        列表行
│   ├── IconSvg.vue         线性图标集
│   └── StackedBarChart.vue 堆叠柱状图（含悬停提示）
└── views/                  19 个页面（18 个业务页面 + 登录页），与路由一一对应
scripts/
└── capture-shots.mjs       逐页截图（基于 Chrome DevTools Protocol，无额外依赖）
```

## 页面清单

| 分组 | 页面 | 路由 |
|---|---|---|
| — | 用户登录（公开） | `/login` |
| 总览 | 工作台 | `/dash` |
| 门诊·申请阶段 | 日间手术申请 / 诊间缴费记账▲ / 术前检查及预约 | `/apply` `/pay` `/exam` |
| 评估阶段 | 专科评估 / 麻醉评估 | `/spec` `/anes` |
| 预约·通知 | 预约通知 / 入院前通知 | `/booking` `/notify` |
| 住院环节 | 入院登记▲ / 转普通入院▲ | `/admit` `/transfer` |
| 手术环节 | 手术安排 / 手术登记 / 手术费用▲ / 手术医嘱▲ | `/schedule` `/checkin` `/fee` `/order` |
| 管理与统计 | 手术管理 / 手术查询 / 退出日间手术 | `/manage` `/query` `/quit` |
| 系统设置 | 参数配置 | `/config` |

▲ = 招标条款重点项（条款 1—5）。

顶栏业务域页签（全部业务 / 门诊业务 / 住院业务 / 手术业务 / 统计报表 / 系统管理）用于筛选左侧菜单，页签上的数字为该业务域下当前角色可见的模块数。

## 与原版的对应关系

- **路由**：原版 `location.hash = '#/apply'` → 现为 vue-router hash 模式，路径完全一致，旧书签可继续使用。
- **样式**：原 `assets/app.css` 的设计令牌迁移至 `styles/index.css` 的 `:root`；Element Plus 主题色通过覆盖 `--el-color-primary` 等 CSS 变量实现（`#1b6fc4`），因此按钮、标签、步骤条、表格等组件与原版观感统一。
- **图标**：原 `assets/ui.js` 的内联 SVG 路径表迁移为 `components/IconSvg.vue`，保持同一套线性图标。
- **数据**：`assets/data.js` → `src/data/demo.js`，改为 ES module 具名导出。
- **页面**：原 `assets/pages.js` / `pages2.js` 中的 18 个 `pageXxx()` 函数 → `src/views/` 下 18 个 SFC，逐页 1:1 迁移。

迁移约定见 [`MIGRATION_SPEC.md`](./MIGRATION_SPEC.md)。

## 截图

`shots/` 下为重写版全部 18 个业务页面的截图（1600×1250）。因系统已加入登录，截图脚本需先注入登录态，
改用基于 Chrome DevTools Protocol 的 Node 脚本（无额外依赖）：

```bash
npm run dev                    # 另开一个终端
node scripts/capture-shots.mjs --port 5173 --user admin
```

`--user` 可选 `admin` / `zhangmin` / `liguodong`，用于以不同角色出图。

## 与原版的差异（有意为之）

| 项 | 原版 | 重写版 | 原因 |
|---|---|---|---|
| 手术统计柱状图配色 | 蓝 `#2f7fc4` + 青 `#25a5a5` | 蓝 `#1b6fc4` + 橙 `#c67408` | 原配色经色觉可及性校验未通过「常规视力可分辨」下限（ΔE 13.3 < 15），两个系列难以区分；新配色通过全部六项校验 |
| 手术统计柱高 | 两段均按第一个系列取值（第二系列仅参与总数标签） | 按两个系列真实取值 | 原实现为渲染缺陷，柱高与所标数字不一致 |
| 表格合计行 | `<tfoot>` / `#append` 插槽 | `show-summary` + `summary-method` | Element Plus 2.14 的 `#append` 插槽渲染在 `<table>` 外的 `<div>` 中，`<tr>` 无法与真实列宽对齐 |
| 图表轴标签与图例 | 相互重叠 | 绘图区 / 轴标签带 / 图例三段分离 | 避免标签互相遮挡 |

## 说明

演示用虚构数据，患者信息均非真实。登录态保存在浏览器 `localStorage`；页面内的操作多为**前端状态流转**（如储值金冻结 → 转住院结转 → 门诊结算、通知发送与留痕、排班与状态变更），刷新后回到初始数据，不含后端持久化。

后续接入后端时：
- `src/store/auth.js` 的 `login / logout` 改为调用鉴权接口，令牌由服务端签发；
- `src/data/permissions.js` 的角色与操作点改为从后端权限表下发；
- 各视图中的静态数组替换为接口调用，页面内的状态流转改为提交接口后再更新。
