<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'
import { useAuth } from '@/store/auth'
import { DEPTS, PATIENTS } from '@/data/demo'

const router = useRouter()
const auth = useAuth()
const { user, role } = auth

/* 状态页签：未安排 / 已安排 / 已完成 */
const TABS = [
  { key: '未安排', count: 12 },
  { key: '已安排', count: 18 },
  { key: '已完成', count: 34 }
]

const active = ref('未安排')
const form = reactive({ keyword: '', dept: '全部科室' })
const applied = ref({ keyword: '', dept: '全部科室' })

const curTab = computed(() => TABS.find((t) => t.key === active.value))

/* 手术患者列表（状态随页签切换） */
const allRows = computed(() =>
  PATIENTS.slice(0, 7).map((x, i) => ({
    name: x.name,
    sex: x.sex,
    age: x.age,
    apply: x.apply,
    inp: x.inp || '—',
    bed: x.bed || '—',
    dept: x.dept,
    op: x.op,
    anes: x.anes,
    doc: x.doc,
    time: i % 2 ? '2026-11-04 10:00' : '2026-11-03 14:30',
    status: active.value === '未安排' ? (i < 3 ? '待手术' : '待评估') : active.value
  }))
)

const rows = computed(() =>
  allRows.value.filter((r) => {
    const a = applied.value
    if (a.dept !== '全部科室' && r.dept !== a.dept) return false
    const k = a.keyword.trim()
    if (!k) return true
    return [r.name, r.inp, r.bed, r.apply].some((v) => String(v || '').includes(k))
  })
)

const doSearch = () => {
  applied.value = { ...form }
  ElMessage.success(`查询完成，共匹配 ${rows.value.length} 例`)
}

const reset = () => {
  Object.assign(form, { keyword: '', dept: '全部科室' })
  applied.value = { ...form }
  ElMessage.info('查询条件已重置')
}

/* 详情弹窗 */
const detailVisible = ref(false)
const detailRow = ref(null)
const openDetail = (row) => {
  detailRow.value = row
  detailVisible.value = true
}

/* 安排手术：受 manage:arrange 权限控制 */
const arrange = (row) => {
  if (!auth.can('manage:arrange')) {
    ElMessage.warning(`当前角色「${role.value.name}」无「安排手术」操作权限`)
    return
  }
  router.push('/schedule')
}

/* 状态统计 */
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

/* 各状态页签允许的操作（防止越权） */
const OPERATE_HINT = {
  未安排: '由日间手术中心与手术室操作',
  已安排: '由手术室操作',
  已完成: '仅可查询与统计'
}
</script>

<template>
  <div>
    <PageHeader
      title="手术管理"
      sub="手术患者集中管理 · 按未安排 / 已安排 / 已完成检索 · 按业务权限操作，防止越权"
    >
      <template #actions>
        <el-button v-perm="'query:export'" size="small" @click="toast('手术患者列表已导出')">
          <IconSvg name="down" :size="13" />导出列表
        </el-button>
        <el-button size="small" @click="toast('列表已刷新')">
          <IconSvg name="refresh" :size="13" />刷新
        </el-button>
      </template>
    </PageHeader>

    <div class="card">
      <div class="card-bd" style="padding: 9px 12px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
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
            v-model="form.keyword"
            placeholder="住院号 / 床号 / 姓名"
            style="width: 190px"
            size="small"
            clearable
            @keyup.enter="doSearch"
          />
          <el-select v-model="form.dept" style="width: 130px" size="small">
            <el-option label="全部科室" value="全部科室" />
            <el-option v-for="d in DEPTS" :key="d" :label="d" :value="d" />
          </el-select>
          <el-button type="primary" size="small" @click="doSearch">
            <IconSvg name="search" :size="13" />查询
          </el-button>
          <el-button size="small" @click="reset">重置</el-button>
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
            <el-table-column prop="dept" label="科室" width="104" />
            <el-table-column prop="op" label="手术名称" min-width="160" show-overflow-tooltip />
            <el-table-column prop="anes" label="麻醉方式" width="106" />
            <el-table-column prop="time" label="预约时间" width="128" class-name="num" />
            <el-table-column label="状态" width="78" align="center">
              <template #default="{ row }"><TagBox :text="row.status" /></template>
            </el-table-column>
            <el-table-column label="操作" width="118" align="center">
              <template #default="{ row }">
                <span class="link" @click="arrange(row)">安排手术</span> ·
                <span class="link" @click="openDetail(row)">详情</span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="!rows.length" class="hint" style="padding: 14px; text-align: center">
            未匹配到符合条件的患者，请调整查询条件
          </div>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="业务权限提示">
          <el-alert type="info" :closable="false" show-icon style="border: none; background: #f5f9fe">
            <template #title>当前角色：{{ role?.name }} · {{ user?.name }}</template>
            <template #default>
              「未安排」{{ OPERATE_HINT['未安排'] }}；「已安排」{{ OPERATE_HINT['已安排'] }}；「已完成」{{ OPERATE_HINT['已完成'] }}。
            </template>
          </el-alert>
          <div class="hint" style="margin-top: 9px; line-height: 1.9">
            <IconSvg name="info" :size="12" />
            当前页签「{{ curTab.key }}」允许的操作：{{ OPERATE_HINT[curTab.key] }}<br />
            数据权限：{{ role?.scope }}
          </div>
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

    <!-- 患者详情 -->
    <el-dialog v-model="detailVisible" title="手术患者详情" width="560px">
      <table v-if="detailRow" class="tb-plain">
        <tbody>
          <tr>
            <td style="width: 96px; color: #7b8fa3">患者</td>
            <td><b>{{ detailRow.name }}</b> · {{ detailRow.sex }} · {{ detailRow.age }}岁</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">申请单号</td>
            <td class="mono">{{ detailRow.apply }}</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">住院号 / 床号</td>
            <td class="mono">{{ detailRow.inp }} / {{ detailRow.bed }}</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">科室 / 主诊医师</td>
            <td>{{ detailRow.dept }} · {{ detailRow.doc }}</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">拟施手术</td>
            <td>{{ detailRow.op }}</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">麻醉方式</td>
            <td>{{ detailRow.anes }}</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">预约时间</td>
            <td class="num">{{ detailRow.time }}</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">当前状态</td>
            <td><TagBox :text="detailRow.status" /></td>
          </tr>
        </tbody>
      </table>
      <template #footer>
        <el-button size="small" @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" size="small" @click="detailVisible = false; arrange(detailRow)">
          安排手术
        </el-button>
      </template>
    </el-dialog>
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
