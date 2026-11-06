# 迁移规范（Vue 3 + Vite + Element Plus）

本项目由原静态演示系统（`../guke/`，原生 JS + 字符串模板）逐页迁移而来。
**目标：页面内容、数据、文案、信息结构与原版 1:1 对应**，仅将渲染方式改为 Vue 3 SFC + Element Plus。

---

## 1. 目录与文件

```
src/
  App.vue                 应用外壳（顶栏 / 侧边栏 / 面包屑 / 路由出口 / 我的权限）
  main.js                 入口（Element Plus 全量注册 + 中文语言包 + v-perm 指令）
  router/index.js         路由表 + 全局守卫 + NAV 导航结构 + TOP_TABS + TITLES / CRUMB
  store/auth.js           登录态与权限判定（login / logout / can / hasModule）
  data/permissions.js     角色定义、模块清单、操作点清单、演示账号
  data/demo.js            全部演示数据（患者、检验、流水、短信、组套、字典…）
  utils/format.js         money() / statusType() / toneToTagType()
  styles/index.css        设计令牌 + Element Plus 主题变量覆盖 + 全部业务样式类
  components/             共享组件（见下）
  views/                  页面组件，一个路由一个文件
```

**页面文件命名**：`<Name>View.vue`，`<script setup>` + `<template>`，可选 `<style scoped>`。

---

## 2. 共享组件（直接使用，不要重复造轮子）

| 组件 | 用途 | 关键 props / slots |
|---|---|---|
| `PageHeader` | 页头（标题条 + 副标题 + 右侧按钮区） | `title`, `sub`；slot `actions`、`title-extra` |
| `SectionCard` | 卡片容器（对应原 `.card`） | `title`, `tight`；slot `right`（卡片头右侧）、默认 slot（内容） |
| `PatientBand` | 患者信息条 | `patient`（默认 `CUR`）；slot `extra`（附加标签） |
| `TagBox` | 状态标签（对应原 `.tag`） | `text`（必填）、`tone`（`g/o/r/b/gy/t`）、`solid` |
| `StatTile` | KPI 磁贴 | `label`, `value`, `unit`, `delta`, `tone`（`green/orange/red/teal`） |
| `MiniStat` | 小统计块 | `label`, `value`, `tone`（`good/warn/bad`） |
| `StepsBar` | 步骤条（对应原 `.steps`） | `items`（字符串数组）、`current`（当前索引） |
| `InfoList` | 列表行（对应原 `.list-row`） | `items`（`{t1,t2,tag,tone}` 数组）、`flat`；slot `right` 可自定义右侧 |
| `IconSvg` | 线性图标 | `name`（见 `components/IconSvg.vue` 的 ICONS 表）、`size` |
| `StackedBarChart` | 堆叠柱状图 | `data`（`[{label,s1,s2}]`）、`series`（`[{key,name,color}]`）、`unit` |

---

## 3. Element Plus 使用约定

- **按钮**：`<el-button size="small">`，主要动作用 `type="primary"`，破坏性操作 `type="danger" plain`。
  青色按钮用 `class="btn-teal"`。按钮内图标：`<IconSvg name="xxx" :size="13" />`。
- **表单**：用 `<el-form :model="form" label-width="84px" label-position="left">` +
  `<el-form-item>`，或用 `.form-grid` 栅格 + `.field` 手写布局（与原版一致时优先用 `.form-grid`）。
  只读字段用 `disabled` 的 `el-input`（样式已统一为浅灰）。
- **表格**：`<el-table :data="rows" style="width:100%">` + `<el-table-column>`。
  - 数字右对齐：`align="right"` + `class-name="num"`；居中：`align="center"`。
  - 表格头行右侧说明放进 `<template #append>` 里的 `el-table__footer` 行（合计行）。
  - 表格外框用 `SectionCard` 的 `tight` 属性（`.card-bd.tight` 无内边距）。
- **提示条**：`<el-alert type="error|warning|info|success" :closable="false" show-icon>`。
  标题放 `#title`，正文放默认 slot；正文里允许 `<b>`。
- **下拉**：`<el-select>` + `<el-option>`；单选用 `<el-radio-group>` + `<el-radio :value="x">`。
- **提示消息**：`import { ElMessage } from 'element-plus'`，`ElMessage.success('…')`。
  原版 `toast(msg)` → `ElMessage.success(msg)`。

### 状态标签
`TagBox` 的 `text` 传业务状态文案（如「已完成」「待手术」），`tone` 传语义色：
`g`=绿 / `o`=橙 / `r`=红 / `b`=蓝 / `gy`=灰 / `t`=青。

---

## 4. 布局类（来自 `styles/index.css`，直接用）

- 栅格：`.grid` + `.g-2 / .g-3 / .g-4 / .g-side（左主右窄 320px）/ .g-side-l（左窄 288px）/ .g-side-r（右 340px）`
- 间距：`.mt-8` `.mt-12` `.mt-14`；分隔：`.divider-dash`
- 排版：`.row`（flex 换行）`.col`（纵向）`.spacer`（占位）`.hint`（灰色小字）`.num`（等宽数字）
- 语义色文本：内联 `style="color:#0f9d63"`（绿）`#d9820a`（橙）`#d64545`（红）`#1b6fc4`（蓝）
- 键值表：`<table class="tb-plain">`（本项目页面内自带 scoped 样式时也可自定义）
- 时间轴：`.trace` + `.trace-item`（对应原「接口日志」「留痕」列表）
- 结果条：`.result-bar`（成功）/ `.result-bar.warn`
- 芯片：`.chk-chip`（可选中加 `.on`）
- 短信气泡：`.phone` + `.sms-bubble`（`.sms-bubble .h` 为发件人头）
- 迷你统计：`<MiniStat>`

---

## 5. 数据引用

业务演示数据在 `@/data/demo.js`：

```
HOSP SYS TODAY DEPTS DOCTORS NURSES OPS ANES MODES
PATIENTS CUR EXAMS FLOWS SMS GROUPS ORDER_TPL FAIL_REASON QUIT_REASON
TRANSFER_REASON TRANSFER_WAY
```

角色与权限数据在 `@/data/permissions.js`：

```
MODULES      全部模块（与路由 key 一致）
ACTIONS      可授权的操作点 `模块:操作` → 中文说明
ROLE_DEFS    角色定义（name / scope / desc / modules / actions）
USERS        演示账号
roleOf()     取角色定义
```

- 金额格式化：`import { money } from '@/utils/format'` → `money(4840)` → `"4,840.00"`
- 页面内独有的静态数组（如今日手术安排、检验报告明细、接口日志等）直接写在该页面的 `<script setup>` 里。

### 权限使用

```js
import { useAuth } from '@/store/auth'
const auth = useAuth()

auth.hasModule('pay')        // 模块可见（菜单 / 路由）
auth.can('pay:settle')       // 操作可执行
auth.role.value.name         // 当前角色名
auth.user.value.name         // 当前登录人姓名
```

模板中用全局指令 `v-perm` 控制按钮渲染：`<el-button v-perm="'pay:settle'">充值</el-button>`。
每个路由在 `src/router/index.js` 中通过 `meta.module` 声明所属模块，由全局守卫统一校验。

---

## 6. 硬性要求

1. **不删内容、不改文案**：原页面的每一个卡片、每一行表格、每一个字段、每一条说明都要保留。
   原版用 `<div style="...">` 内联排版的地方，改用 `styles/index.css` 中已有的类；
   没有对应类时才写 scoped 样式。
2. **不做交互逻辑**：本页内新增/删除等按钮只需给出 `ElMessage` 提示即可（除原版已有的真实逻辑外）。
3. **表格列宽**参照原版 `style="width:xxpx"`，统一换成 `width="xx"`；
   主名列用 `min-width` + `show-overflow-tooltip`。
4. 页面根元素包一层 `<div>`，内部按原版顺序排列。
5. 组件必须能被 `vite build` 编译通过，不得引用不存在的组件或变量。
