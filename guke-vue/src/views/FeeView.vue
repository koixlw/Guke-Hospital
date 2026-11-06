<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import InfoList from '@/components/InfoList.vue'
import IconSvg from '@/components/IconSvg.vue'
import { GROUPS } from '@/data/demo'
import { money } from '@/utils/format'

const toast = (m) => ElMessage.success(m)

/* 常用组套（来自 @/data/demo 的 GROUPS） */
const GROUP_NAMES = Object.keys(GROUPS)

const toRows = (name) =>
  GROUPS[name].map((r) => ({ code: r.code, nm: r.nm, spec: r.spec, price: r.price, qty: r.qty }))

/* 已补录费用明细 */
const feeRows = ref(toRows('关节镜手术组套'))

/* 当前调入的组套 */
const groupName = ref('关节镜手术组套')
const groupCount = ref(GROUPS['关节镜手术组套'].length)

/* 手工补录一行 */
const addForm = reactive({
  nm: '膝关节镜下半月板成形术',
  spec: '例',
  price: '2400.00',
  qty: '1'
})

const total = computed(() => feeRows.value.reduce((s, r) => s + r.price * r.qty, 0))

/* 调入常用组套：整体替换费用明细表体 */
const loadGroup = () => {
  const g = GROUPS[groupName.value]
  feeRows.value = toRows(groupName.value)
  groupCount.value = g.length
  ElMessage.success(`已调入「${groupName.value}」${g.length} 项，合计 ${money(total.value)} 元`)
}

/* 添加：把录入的一行加入费用明细 */
const addRow = () => {
  const price = Number(addForm.price) || 0
  const qty = Number(addForm.qty) || 0
  feeRows.value.push({ code: '', nm: addForm.nm || '—', spec: addForm.spec, price, qty })
  ElMessage.success(`已添加「${addForm.nm}」`)
}

/* 删除一行 */
const removeRow = (index) => {
  const row = feeRows.value[index]
  feeRows.value.splice(index, 1)
  ElMessage.success(`已删除「${row.nm}」`)
}

/* 合计行：show-summary 会对齐真实列宽（Element Plus 的 append 插槽已不支持 <tr>） */
const feeSummary = ({ columns }) =>
  columns.map((col, i) =>
    i === 0 ? `合计 ${feeRows.value.length} 项` : i === 5 ? money(total.value) : ''
  )

/* 费用汇总 */
const summary = [
  { k: '术前门诊费用', v: '1,178.00' },
  { k: '本次手术费用', v: '4,840.00' },
  { k: '麻醉费用', v: '480.00' },
  { k: '耗材费用', v: '2,260.00' },
  { k: '住院费用合计', v: '8,758.00', sum: true }
]

/* HIS 收费衔接 */
const hisLogs = [
  { t1: '费用写入 HIS 住院费用', t2: '10:52:18 · 5 条明细 · 成功', tag: '成功', tone: 'g' },
  { t1: '医保项目对照', t2: '按医保编码自动对照 · 自付比例 0%', tag: '已对照', tone: 'g' },
  { t1: '住院储值金扣减', t2: '可用 1,622.00 元 · 不足部分出院结算', tag: '待结算', tone: 'o' }
]
</script>

<template>
  <div>
    <PageHeader
      title="手术费用"
      sub="手术室补录手术费用 · 支持调入手术费用常用组套批量带出项目与标准 · 补录完成即时进入住院费用清单"
    >
      <template #title-extra><span class="tag solid">▲ 条款 4</span></template>
      <template #actions>
        <el-button v-perm="'fee:submit'" type="primary" size="small" @click="toast('手术费用已提交，已同步至 HIS 住院费用清单')">
          <IconSvg name="save" :size="13" />保存并提交
        </el-button>
        <el-button size="small" @click="toast('费用清单已发送至打印')">
          <IconSvg name="print" :size="13" />打印费用清单
        </el-button>
      </template>
    </PageHeader>

    <PatientBand>
      <template #extra><TagBox text="术中" tone="o" /></template>
    </PatientBand>

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <SectionCard title="补录手术费用">
          <template #right>补录人：手术室 · 唐雪梅</template>
          <el-form :model="addForm" label-width="84px" label-position="left">
            <div style="display: flex; gap: 9px; align-items: flex-end; flex-wrap: wrap">
              <div class="field" style="flex: 0 0 auto">
                <label style="flex: 0 0 62px">项目名称</label>
                <el-input v-model="addForm.nm" style="width: 250px; flex: 0 0 250px" />
              </div>
              <div class="field" style="flex: 0 0 auto">
                <label style="flex: 0 0 44px">规格</label>
                <el-input v-model="addForm.spec" style="width: 70px; flex: 0 0 70px" />
              </div>
              <div class="field" style="flex: 0 0 auto">
                <label style="flex: 0 0 44px">单价</label>
                <el-input v-model="addForm.price" style="width: 84px; flex: 0 0 84px" />
              </div>
              <div class="field" style="flex: 0 0 auto">
                <label style="flex: 0 0 44px">数量</label>
                <el-input v-model="addForm.qty" style="width: 56px; flex: 0 0 56px" />
              </div>
              <el-button size="small" @click="addRow">
                <IconSvg name="plus" :size="13" />添加
              </el-button>
              <span style="width: 1px; height: 22px; background: var(--line); margin: 0 2px" />
              <div class="field" style="flex: 0 0 auto">
                <label style="flex: 0 0 62px">常用组套</label>
                <el-select v-model="groupName" style="width: 170px; flex: 0 0 170px">
                  <el-option v-for="g in GROUP_NAMES" :key="g" :label="g" :value="g" />
                </el-select>
              </div>
              <el-button class="btn-teal" size="small" @click="loadGroup">
                <IconSvg name="down" :size="13" />调入常用组套
              </el-button>
            </div>
          </el-form>
          <div class="hint" style="margin-top: 9px">
            <IconSvg name="info" :size="12" /> 调入组套后自动带出项目编码、名称、规格、单价，可修改数量；费用数据与 HIS 收费结算直接衔接
          </div>
        </SectionCard>

        <SectionCard title="已补录费用明细" tight>
          <template #right>组套：{{ groupName }}（{{ groupCount }} 项）</template>
          <el-table
            :data="feeRows"
            style="width: 100%"
            table-layout="auto"
            show-summary
            :summary-method="feeSummary"
          >
            <el-table-column prop="code" label="项目编码" width="96" class-name="mono">
              <template #default="{ row }">{{ row.code || '—' }}</template>
            </el-table-column>
            <el-table-column prop="nm" label="项目名称" min-width="180" show-overflow-tooltip />
            <el-table-column prop="spec" label="规格" width="80" />
            <el-table-column label="单价(元)" width="88" align="right" class-name="num">
              <template #default="{ row }">{{ money(row.price) }}</template>
            </el-table-column>
            <el-table-column prop="qty" label="数量" width="58" align="center" class-name="num" />
            <el-table-column label="金额(元)" width="92" align="right" class-name="num">
              <template #default="{ row }">{{ money(row.price * row.qty) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="58" align="center">
              <template #default="{ $index }">
                <span class="link" @click="removeRow($index)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="费用汇总" tight>
          <table class="tb-plain">
            <tbody>
              <tr v-for="s in summary" :key="s.k" :class="{ sum: s.sum }">
                <td style="width: 104px; color: #7b8fa3" :style="s.sum ? { color: '#1f2d3d', fontWeight: 700 } : {}">
                  {{ s.k }}
                </td>
                <td class="r num" :style="s.sum ? { fontWeight: 700, fontSize: '14px', color: '#1b6fc4' } : {}">
                  {{ s.v }}
                </td>
              </tr>
            </tbody>
          </table>
        </SectionCard>

        <SectionCard title="HIS 收费衔接">
          <div class="result-bar" style="margin-bottom: 9px">
            <IconSvg name="ok" :size="15" /> 已同步至 HIS 费用清单
          </div>
          <InfoList :items="hisLogs" flat />
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
  padding: 8px 14px;
  border-bottom: 1px solid #eef2f7;
  color: #33475c;
}
.tb-plain tr:last-child td {
  border-bottom: none;
}
.tb-plain tr.sum td {
  background: #f6fafd;
}
</style>
