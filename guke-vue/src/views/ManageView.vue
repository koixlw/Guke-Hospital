<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'
import { DEPTS, PATIENTS } from '@/data/demo'

/* 状态页签：未安排 / 已安排 / 已完成 */
const TABS = [
  { key: '未安排', count: 12 },
  { key: '已安排', count: 18 },
  { key: '已完成', count: 34 }
]

const active = ref('未安排')
const keyword = ref('')
const dept = ref('全部科室')

const curTab = computed(() => TABS.find((t) => t.key === active.value))

/* 手术患者列表（原版取患者前 7 例，状态随页签切换） */
const rows = computed(() =>
  PATIENTS.slice(0, 7).map((x, i) => ({
    name: x.name,
    sex: x.sex,
    age: x.age,
    apply: x.apply,
    dept: x.dept,
    op: x.op,
    anes: x.anes,
    time: i % 2 ? '2026-11-04 10:00' : '2026-11-03 14:30',
    status: active.value === '未安排' ? (i < 3 ? '待手术' : '待评估') : active.value
  }))
)

/* 状态统计：例数与占比进度计 */
const stats = [
  { nm: '未安排', n: 12, pct: '32%', cls: 'o' },
  { nm: '已安排', n: 18, pct: '48%', cls: '' },
  { nm: '已完成', n: 34, pct: '90%', cls: 'g' }
]

const toast = (m) => ElMessage.success(m)

const tabStyle = (t) => ({
  padding: '7px 16px',
  borderRadius: '5px',
  fontSize: '12.8px',
  cursor: 'pointer',
  ...(active.value === t.key
    ? { background: '#1b6fc4', color: '#fff', fontWeight: 600 }
    : { color: '#5b6b7f' })
})
</script>

<template>
  <div>
    <PageHeader
      title="手术管理"
      sub="手术患者集中管理 · 按未安排 / 已安排 / 已完成检索 · 按业务权限操作，防止越权"
    >
      <template #actions>
        <el-button size="small" @click="toast('手术患者列表已导出')">
          <IconSvg name="down" :size="13" />导出列表
        </el-button>
        <el-button size="small" @click="toast('列表已刷新')">
          <IconSvg name="refresh" :size="13" />刷新
        </el-button>
      </template>
    </PageHeader>

    <div class="card">
      <div class="card-bd" style="padding: 9px 12px; display: flex; gap: 8px; align-items: center">
        <div
          v-for="t in TABS"
          :key="t.key"
          :style="tabStyle(t)"
          @click="active = t.key"
        >
          {{ t.key }} <b style="margin-left: 4px">{{ t.count }}</b>
        </div>
        <span style="margin-left: auto; display: flex; gap: 8px; align-items: center">
          <el-input
            v-model="keyword"
            placeholder="住院号 / 床号 / 姓名"
            style="width: 190px"
            size="small"
          />
          <el-select v-model="dept" style="width: 130px" size="small">
            <el-option label="全部科室" value="全部科室" />
            <el-option v-for="d in DEPTS" :key="d" :label="d" :value="d" />
          </el-select>
          <el-button type="primary" size="small" @click="toast('查询完成')">
            <IconSvg name="search" :size="13" />查询
          </el-button>
        </span>
      </div>
    </div>

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <SectionCard :title="`手术患者列表 · ${curTab.key}（${curTab.count} 例）`" tight>
          <template #right>第 1 页 / 共 2 页</template>
          <el-table :data="rows" style="width: 100%">
            <el-table-column label="患者" width="96">
              <template #default="{ row }">
                <b>{{ row.name }}</b>
                <div class="hint">{{ row.sex }} · {{ row.age }}岁</div>
              </template>
            </el-table-column>
            <el-table-column prop="apply" label="申请单号" width="112" class-name="mono" />
            <el-table-column prop="dept" label="科室" width="110" />
            <el-table-column prop="op" label="手术名称" min-width="180" show-overflow-tooltip />
            <el-table-column prop="anes" label="麻醉方式" width="110" />
            <el-table-column prop="time" label="预约时间" width="132" class-name="num" />
            <el-table-column label="状态" width="80" align="center">
              <template #default="{ row }"><TagBox :text="row.status" /></template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template #default>
                <span class="link" @click="toast('手术安排')">安排手术</span> ·
                <span class="link" @click="toast('患者详情')">详情</span>
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="业务权限提示">
          <el-alert type="info" :closable="false" show-icon style="border: none; background: #f5f9fe">
            <template #title>当前角色：日间手术中心 · 张敏</template>
            <template #default>
              「未安排」由日间手术中心与手术室操作；「已安排」由手术室操作；「已完成」仅可查询与统计。
            </template>
          </el-alert>
        </SectionCard>

        <SectionCard title="状态统计">
          <table class="tb-plain">
            <tbody>
              <tr v-for="s in stats" :key="s.nm">
                <td style="width: 96px; color: #7b8fa3">{{ s.nm }}</td>
                <td class="r num"><b>{{ s.n }}</b> 例</td>
                <td style="width: 90px">
                  <div class="prog" :class="s.cls"><i :style="{ width: s.pct }" /></div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="hint" style="margin-top: 9px">今日台次利用率 86%，平均手术时长 52 分钟</div>
        </SectionCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tb-plain {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
.tb-plain td {
  padding: 7px 14px;
  border-bottom: 1px solid #eef2f7;
  color: #33475c;
}
.tb-plain tr:last-child td {
  border-bottom: none;
}
</style>
