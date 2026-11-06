<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'
import StackedBarChart from '@/components/StackedBarChart.vue'

/* ================= 查询条件 ================= */
const query = reactive({
  inp: 'ZY20261102481',
  bed: '',
  name: '',
  dateFrom: '2026-10-01',
  dateTo: '2026-11-02'
})

/* 已提交的查询条件（点击「查询」后生效） */
const applied = ref({ ...query })

/* ================= 日间手术信息 ================= */
const allRows = [
  { inp: 'ZY20261102481', bed: '38-12', name: '王建国', op: '膝关节镜下半月板成形术', doc: '李国栋', nurse: '何静', anes: '椎管内麻醉', date: '2026-11-02', status: '已完成' },
  { inp: 'ZY20261102455', bed: '36-05', name: '陈志强', op: '桡骨远端骨折闭合复位内固定术', doc: '陈立新', nurse: '杨丽', anes: '臂丛神经阻滞', date: '2026-11-02', status: '已完成' },
  { inp: 'ZY20261102442', bed: '42-11', name: '张桂芳', op: '肩关节镜下肩袖修补术', doc: '刘晓峰', nurse: '邓小燕', anes: '全身麻醉', date: '2026-11-02', status: '待手术' },
  { inp: 'ZY20261102470', bed: '39-03', name: '吴大海', op: '踝关节镜下清理术', doc: '孙志刚', nurse: '唐雪梅', anes: '椎管内麻醉', date: '2026-11-01', status: '已完成' },
  { inp: 'ZY20261102431', bed: '37-08', name: '何俊', op: '锁骨骨折切开复位内固定术', doc: '李国栋', nurse: '何静', anes: '全身麻醉', date: '2026-11-01', status: '已完成' },
  { inp: 'ZY20261102418', bed: '41-05', name: '徐小梅', op: '腱鞘囊肿切除术', doc: '陈立新', nurse: '杨丽', anes: '局部麻醉', date: '2026-10-31', status: '已完成' }
]

const rows = computed(() =>
  allRows.filter((r) => {
    const a = applied.value
    if (a.inp && !r.inp.includes(a.inp)) return false
    if (a.bed && !r.bed.includes(a.bed)) return false
    if (a.name && !r.name.includes(a.name)) return false
    if (a.dateFrom && r.date < a.dateFrom) return false
    if (a.dateTo && r.date > a.dateTo) return false
    return true
  })
)

const doSearch = () => {
  applied.value = { ...query }
  ElMessage.success(`查询完成，共匹配 ${rows.value.length} 条记录`)
}

const reset = () => {
  Object.assign(query, { inp: '', bed: '', name: '', dateFrom: '2026-10-01', dateTo: '2026-11-02' })
  applied.value = { ...query }
  ElMessage.info('查询条件已重置')
}

/* ================= 统计维度 ================= */
const DIMS = [
  { key: 'dept', t: '全部科室', unit: '台', tip: '按科室统计日间手术与转普通住院台次' },
  { key: 'doc', t: '按医生', unit: '台', tip: '按术者统计日间手术与转普通住院台次' },
  { key: 'nurse', t: '按护士', unit: '台', tip: '按手术室护士统计日间手术与转普通住院台次' }
]
const dim = ref('dept')

/* 三套统计数据集（近 30 日） */
const DATASETS = {
  dept: [
    { label: '创伤骨科', s1: 42, s2: 38 },
    { label: '关节外科', s1: 58, s2: 46 },
    { label: '脊柱外科', s1: 26, s2: 21 },
    { label: '手外科', s1: 34, s2: 30 },
    { label: '足踝外科', s1: 18, s2: 14 },
    { label: '运动医学', s1: 22, s2: 19 }
  ],
  doc: [
    { label: '李国栋', s1: 41, s2: 36 },
    { label: '陈立新', s1: 36, s2: 31 },
    { label: '王海涛', s1: 33, s2: 26 },
    { label: '刘晓峰', s1: 29, s2: 24 },
    { label: '赵敏', s1: 24, s2: 19 },
    { label: '孙志刚', s1: 18, s2: 15 }
  ],
  nurse: [
    { label: '何静', s1: 38, s2: 33 },
    { label: '杨丽', s1: 35, s2: 30 },
    { label: '邓小燕', s1: 31, s2: 25 },
    { label: '唐雪梅', s1: 28, s2: 24 },
    { label: '张敏', s1: 22, s2: 19 }
  ]
}

const chartData = computed(() => DATASETS[dim.value])

const series = [
  { key: 's1', name: '日间手术', color: 'var(--series-1)' },
  { key: 's2', name: '转为普通住院', color: 'var(--series-2)' }
]

const dimLabel = computed(() => DIMS.find((d) => d.key === dim.value))

/* ================= 统计汇总 ================= */
const summary = computed(() => {
  const total = chartData.value.reduce((s, r) => s + r.s1, 0)
  const tr = chartData.value.reduce((s, r) => s + r.s2, 0)
  return [
    { nm: '手术总量', v: String(total), unit: ' 台', bold: true },
    { nm: '麻醉例数', v: '168', unit: ' 例（84%）', bold: true },
    { nm: '转普通住院', v: String(tr), unit: ' 例（6.0%）', bold: true },
    { nm: '平均术前等待', v: '0.4', unit: ' 天', bold: false },
    { nm: '退出日间路径', v: '7', unit: ' 例（3.5%）', bold: false }
  ]
})

const toast = (m) => ElMessage.success(m)
</script>

<template>
  <div>
    <PageHeader
      title="手术查询"
      sub="按住院号码 / 床号 / 姓名组合检索 · 手术统计、麻醉统计、术后统计报表，支持科室、医生、护士维度与导出"
    >
      <template #actions>
        <el-button v-perm="'query:export'" size="small" @click="toast('报表已导出为 Excel')">
          <IconSvg name="down" :size="13" />导出 Excel
        </el-button>
        <el-button size="small" @click="toast('报表已发送至打印')">
          <IconSvg name="print" :size="13" />打印报表
        </el-button>
      </template>
    </PageHeader>

    <SectionCard bare tight>
      <div style="display: flex; gap: 10px; align-items: center; padding: 11px 14px; flex-wrap: wrap">
        <div class="field" style="flex: 0 0 auto">
          <label style="flex: 0 0 52px">住院号</label>
          <el-input v-model="query.inp" class="w-auto" style="width: 150px" size="small" />
        </div>
        <div class="field" style="flex: 0 0 auto">
          <label style="flex: 0 0 40px">床号</label>
          <el-input v-model="query.bed" class="w-auto" style="width: 80px" size="small" />
        </div>
        <div class="field" style="flex: 0 0 auto">
          <label style="flex: 0 0 40px">姓名</label>
          <el-input v-model="query.name" class="w-auto" style="width: 110px" size="small" />
        </div>
        <div class="field" style="flex: 0 0 auto">
          <label style="flex: 0 0 68px">手术日期</label>
          <el-input v-model="query.dateFrom" class="w-auto" style="width: 120px" size="small" />
          <span style="color: #5b6b7f">—</span>
          <el-input v-model="query.dateTo" class="w-auto" style="width: 120px" size="small" />
        </div>
        <el-button type="primary" size="small" @click="doSearch">
          <IconSvg name="search" :size="13" />查询
        </el-button>
        <el-button size="small" @click="reset">重置</el-button>
        <span class="hint" style="margin-left: auto">查询响应 0.6 秒 · 支持多条件组合</span>
      </div>
    </SectionCard>

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <SectionCard title="日间手术信息" tight>
          <template #right>共 87 条 · 当前显示 {{ rows.length }} 条</template>
          <el-table :data="rows" style="width: 100%">
            <el-table-column prop="inp" label="住院号" width="118" class-name="mono" />
            <el-table-column prop="bed" label="床号" width="56" />
            <el-table-column label="姓名" width="70">
              <template #default="{ row }"><b>{{ row.name }}</b></template>
            </el-table-column>
            <el-table-column prop="op" label="手术名称" min-width="190" show-overflow-tooltip />
            <el-table-column prop="doc" label="术者" width="66" />
            <el-table-column prop="anes" label="麻醉方式" width="100" />
            <el-table-column prop="date" label="手术日期" width="96" class-name="num" />
            <el-table-column label="状态" width="74" align="center">
              <template #default="{ row }"><TagBox :text="row.status" /></template>
            </el-table-column>
            <el-table-column label="操作" width="52" align="center">
              <template #default="{ row }">
                <span class="link" @click="toast(`手术记录详情：${row.name} · ${row.op}`)">查看</span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="!rows.length" class="hint" style="padding: 14px; text-align: center">
            未匹配到符合条件的记录，请调整查询条件
          </div>
        </SectionCard>

        <SectionCard title="统计维度">
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
            <span
              v-for="d in DIMS"
              :key="d.key"
              class="chk-chip"
              :class="{ on: dim === d.key }"
              @click="dim = d.key"
            >
              {{ d.t }}
            </span>
            <span style="margin-left: auto; display: flex; gap: 8px">
              <el-button size="small" @click="toast('手术统计报表已生成')">手术统计</el-button>
              <el-button size="small" @click="toast('麻醉统计报表已生成')">麻醉统计</el-button>
              <el-button size="small" @click="toast('术后统计报表已生成')">术后统计</el-button>
            </span>
          </div>
          <div class="hint" style="margin-top: 9px">
            <IconSvg name="info" :size="12" /> 当前维度：{{ dimLabel?.t }} —— {{ dimLabel?.tip }}
          </div>
        </SectionCard>
      </div>

      <div>
        <SectionCard :title="`手术统计（近 30 日 · ${dimLabel?.t}）`">
          <StackedBarChart :data="chartData" :series="series" unit=" 台" />
          <table class="tb-plain" style="margin-top: 6px">
            <tbody>
              <tr v-for="s in summary" :key="s.nm">
                <td style="width: 104px; color: #7b8fa3">{{ s.nm }}</td>
                <td class="r num">
                  <b v-if="s.bold">{{ s.v }}</b><template v-else>{{ s.v }}</template>{{ s.unit }}
                </td>
              </tr>
            </tbody>
          </table>
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
