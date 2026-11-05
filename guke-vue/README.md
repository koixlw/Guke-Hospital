# 预入出院（日间手术）管理系统 · 四川省骨科医院

Vue 3 + Vite + Element Plus 重写版。由原静态演示系统（`../guke/`，原生 JavaScript + 字符串模板 + hash 路由）逐页迁移而来，页面内容、数据与信息结构与原版保持一致。

## 技术栈

| 依赖 | 版本 | 用途 |
|---|---|---|
| Vue | ^3.5 | `<script setup>` 单文件组件 |
| Vite | ^8 | 开发服务器与构建 |
| Element Plus | ^2.14 | 表单 / 表格 / 按钮 / 标签 / 提示条 / 步骤条等 UI 组件 |
| vue-router | ^4.6 | hash 路由（与原版 `#/dash` 形式一致） |
| @element-plus/icons-vue | ^2.3 | Element Plus 图标 |

未引入 UI 框架之外的重型依赖；图表为轻量自绘 SVG/CSS 组件，无 ECharts 依赖。

## 快速开始

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # 产物输出到 dist/
npm run preview  # 本地预览构建产物
```

## 目录结构

```
src/
├── App.vue                 应用外壳：顶栏 / 侧边栏 / 面包屑 / 路由出口
├── main.js                 入口（Element Plus 全量注册 + 中文语言包）
├── router/index.js         路由表、侧边栏 NAV 结构、页面标题与面包屑
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
└── views/                  18 个业务页面，与路由一一对应
```

## 页面清单

| 分组 | 页面 | 路由 |
|---|---|---|
| 总览 | 工作台 | `/dash` |
| 门诊·申请阶段 | 日间手术申请 / 诊间缴费记账▲ / 术前检查及预约 | `/apply` `/pay` `/exam` |
| 评估阶段 | 专科评估 / 麻醉评估 | `/spec` `/anes` |
| 预约·通知 | 预约通知 / 入院前通知 | `/booking` `/notify` |
| 住院环节 | 入院登记▲ / 转普通入院▲ | `/admit` `/transfer` |
| 手术环节 | 手术安排 / 手术登记 / 手术费用▲ / 手术医嘱▲ | `/schedule` `/checkin` `/fee` `/order` |
| 管理与统计 | 手术管理 / 手术查询 / 退出日间手术 | `/manage` `/query` `/quit` |
| 系统设置 | 参数配置 | `/config` |

▲ = 招标条款重点项（条款 1—5）。

## 与原版的对应关系

- **路由**：原版 `location.hash = '#/apply'` → 现为 vue-router hash 模式，路径完全一致，旧书签可继续使用。
- **样式**：原 `assets/app.css` 的设计令牌迁移至 `styles/index.css` 的 `:root`；Element Plus 主题色通过覆盖 `--el-color-primary` 等 CSS 变量实现（`#1b6fc4`），因此按钮、标签、步骤条、表格等组件与原版观感统一。
- **图标**：原 `assets/ui.js` 的内联 SVG 路径表迁移为 `components/IconSvg.vue`，保持同一套线性图标。
- **数据**：`assets/data.js` → `src/data/demo.js`，改为 ES module 具名导出。
- **页面**：原 `assets/pages.js` / `pages2.js` 中的 18 个 `pageXxx()` 函数 → `src/views/` 下 18 个 SFC，逐页 1:1 迁移。

迁移约定见 [`MIGRATION_SPEC.md`](./MIGRATION_SPEC.md)。

## 截图

`shots/` 下为重写版全部 18 个页面的截图（1600×1250）。开发服务器运行在 5174 端口时可一键重新生成：

```bash
npm run dev          # 另开一个终端
bash capture-shots.sh
```

## 与原版的差异（有意为之）

| 项 | 原版 | 重写版 | 原因 |
|---|---|---|---|
| 手术统计柱状图配色 | 蓝 `#2f7fc4` + 青 `#25a5a5` | 蓝 `#1b6fc4` + 橙 `#c67408` | 原配色经色觉可及性校验未通过「常规视力可分辨」下限（ΔE 13.3 < 15），两个系列难以区分；新配色通过全部六项校验 |
| 手术统计柱高 | 两段均按第一个系列取值（第二系列仅参与总数标签） | 按两个系列真实取值 | 原实现为渲染缺陷，柱高与所标数字不一致 |
| 表格合计行 | `<tfoot>` / `#append` 插槽 | `show-summary` + `summary-method` | Element Plus 2.14 的 `#append` 插槽渲染在 `<table>` 外的 `<div>` 中，`<tr>` 无法与真实列宽对齐 |
| 图表轴标签与图例 | 相互重叠 | 绘图区 / 轴标签带 / 图例三段分离 | 避免标签互相遮挡 |

## 说明

演示用虚构数据，患者信息均非真实。所有「新增 / 提交 / 保存」类操作仅作界面提示，不含后端持久化；后续接入接口时，将各视图中的静态数组替换为接口调用即可。
