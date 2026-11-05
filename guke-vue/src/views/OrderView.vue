<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import InfoList from '@/components/InfoList.vue'
import IconSvg from '@/components/IconSvg.vue'
import { ORDER_TPL } from '@/data/demo'

/* 手术医嘱明细：初始 6 条（全身麻醉诱导 / 维持 4 条 + 椎管内麻醉 1 条 + 抗感染 1 条） */
const orders = ref([
  { typ: '临时', nm: '丙泊酚中/长链脂肪乳注射液', spec: '200mg/20ml', dose: '150mg', way: '静脉注射', freq: '术中', tm: '诱导' },
  { typ: '临时', nm: '枸橼酸舒芬太尼注射液', spec: '50μg/1ml', dose: '20μg', way: '静脉注射', freq: '术中', tm: '诱导' },
  { typ: '临时', nm: '注射用苯磺顺阿曲库铵', spec: '10mg', dose: '8mg', way: '静脉注射', freq: '术中', tm: '诱导' },
  { typ: '临时', nm: '盐酸右美托咪定注射液', spec: '200μg/2ml', dose: '40μg', way: '静脉泵入', freq: '术中', tm: '维持' },
  { typ: '临时', nm: '盐酸罗哌卡因注射液', spec: '100mg/10ml', dose: '15mg', way: '蛛网膜下腔注射', freq: '术中一次', tm: '麻醉' },
  { typ: '长期', nm: '注射用头孢呋辛钠', spec: '1.5g', dose: '1.5g', way: '静脉滴注', freq: 'bid', tm: '抗感染' }
])

const form = reactive({
  typ: '临时',
  nm: '盐酸罗哌卡因注射液',
  dose: '15mg',
  way: '蛛网膜下腔注射',
  freq: '术中一次',
  tpl: '椎管内麻醉医嘱模板'
})

const WAYS = ['蛛网膜下腔注射', '静脉注射', '静脉滴注', '静脉泵入']
const TPLS = Object.keys(ORDER_TPL)

/* 含术中麻醉药的医嘱条数（时机：诱导 / 维持 / 麻醉） */
const anesCount = computed(() => orders.value.filter((o) => ['诱导', '维持', '麻醉'].includes(o.tm)).length)

const toast = (m) => ElMessage.success(m)

const addOrder = () => {
  orders.value.push({
    typ: form.typ,
    nm: form.nm,
    spec: '—',
    dose: form.dose,
    way: form.way,
    freq: form.freq,
    tm: '—'
  })
  toast('医嘱已添加')
}

/* 一键带出：按所选模板重置医嘱明细 */
const loadTemplate = () => {
  const tpl = ORDER_TPL[form.tpl] || []
  orders.value = tpl.map((o) => ({ ...o }))
  toast(`已按模板带出 ${tpl.length} 条医嘱`)
}

const removeOrder = (i) => {
  orders.value.splice(i, 1)
  toast('医嘱已删除')
}

/* 下游衔接 */
const downstream = [
  { t1: '病案首页 · 麻醉记录', t2: '医嘱数据自动归集至麻醉记录单', tag: '已归集', tone: 'g' },
  { t1: '费用 · 药品记账', t2: '6 条医嘱对应药品已记账 486.00 元', tag: '已记账', tone: 'g' },
  { t1: '手术护理记录', t2: '术中用药与护理记录自动核对', tag: '一致', tone: 'g' }
]
</script>

<template>
  <div>
    <PageHeader
      title="手术医嘱"
      sub="手术室补录手术医嘱 · 至少包括术中麻醉药 · 支持常用医嘱模板一键带出 · 与病案、费用衔接"
    >
      <template #title-extra><span class="tag solid" style="margin-left: 2px">▲ 条款 5</span></template>
      <template #actions>
        <el-button type="primary" size="small" @click="toast('手术医嘱已保存并提交')">
          <IconSvg name="save" :size="13" />保存并提交
        </el-button>
        <el-button size="small" @click="toast('医嘱单已发送至打印')">
          <IconSvg name="print" :size="13" />打印医嘱单
        </el-button>
      </template>
    </PageHeader>

    <PatientBand>
      <template #extra><TagBox text="术中" tone="o" /></template>
    </PatientBand>

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <SectionCard title="补录手术医嘱">
          <template #right>补录人：麻醉医师 · 周文斌</template>

          <div style="display: flex; gap: 9px; align-items: flex-end; flex-wrap: wrap">
            <div class="field" style="flex: 0 0 auto">
              <label style="flex: 0 0 44px">类型</label>
              <el-select v-model="form.typ" class="w-auto" style="width: 76px" size="small">
                <el-option label="临时" value="临时" />
                <el-option label="长期" value="长期" />
              </el-select>
            </div>
            <div class="field" style="flex: 0 0 auto">
              <label style="flex: 0 0 62px">药品名称</label>
              <el-input v-model="form.nm" class="w-auto" style="width: 240px" size="small" />
            </div>
            <div class="field" style="flex: 0 0 auto">
              <label style="flex: 0 0 44px">剂量</label>
              <el-input v-model="form.dose" class="w-auto" style="width: 74px" size="small" />
            </div>
            <div class="field" style="flex: 0 0 auto">
              <label style="flex: 0 0 44px">用法</label>
              <el-select v-model="form.way" class="w-auto" style="width: 132px" size="small">
                <el-option v-for="w in WAYS" :key="w" :label="w" :value="w" />
              </el-select>
            </div>
            <div class="field" style="flex: 0 0 auto">
              <label style="flex: 0 0 44px">频次</label>
              <el-input v-model="form.freq" class="w-auto" style="width: 70px" size="small" />
            </div>
            <el-button size="small" @click="addOrder">
              <IconSvg name="plus" :size="13" />添加
            </el-button>
            <span style="width: 1px; height: 22px; background: var(--line); margin: 0 2px" />
            <div class="field" style="flex: 0 0 auto">
              <label style="flex: 0 0 62px">医嘱模板</label>
              <el-select v-model="form.tpl" class="w-auto" style="width: 172px" size="small">
                <el-option v-for="t in TPLS" :key="t" :label="t" :value="t" />
              </el-select>
            </div>
            <el-button class="btn-teal" size="small" @click="loadTemplate">
              <IconSvg name="down" :size="13" />一键带出
            </el-button>
          </div>

          <div class="hint" style="margin-top: 9px">
            <IconSvg name="info" :size="12" /> 医嘱模板由系统管理员维护，覆盖麻醉诱导、维持、辅助用药与抗感染用药，减少手工录入
          </div>
        </SectionCard>

        <SectionCard title="手术医嘱明细" tight>
          <template #right>共 {{ orders.length }} 条 · 含术中麻醉药 {{ anesCount }} 条</template>
          <el-table :data="orders" style="width: 100%">
            <el-table-column label="类型" width="56" align="center">
              <template #default="{ row }">
                <TagBox :text="row.typ" :tone="row.typ === '临时' ? 'b' : 't'" />
              </template>
            </el-table-column>
            <el-table-column label="药品名称" min-width="180" show-overflow-tooltip>
              <template #default="{ row }"><b>{{ row.nm }}</b></template>
            </el-table-column>
            <el-table-column prop="spec" label="规格" width="100" />
            <el-table-column prop="dose" label="剂量" width="66" class-name="num" />
            <el-table-column prop="way" label="用法" width="132" />
            <el-table-column prop="freq" label="频次" width="76" />
            <el-table-column prop="tm" label="时机" width="72" />
            <el-table-column label="操作" width="52" align="center">
              <template #default="{ $index }">
                <span class="link" @click="removeOrder($index)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="麻醉药核对">
          <div class="result-bar" style="margin-bottom: 10px">
            <IconSvg name="ok" :size="15" /> 术中麻醉药记录完整
          </div>
          <table class="tb-plain">
            <tbody>
              <tr>
                <td style="width: 104px; color: #7b8fa3">全身麻醉药</td>
                <td>丙泊酚、舒芬太尼、顺阿曲库铵</td>
              </tr>
              <tr>
                <td style="color: #7b8fa3">局部麻醉药</td>
                <td>罗哌卡因</td>
              </tr>
              <tr>
                <td style="color: #7b8fa3">肌肉松弛剂</td>
                <td>苯磺顺阿曲库铵</td>
              </tr>
              <tr>
                <td style="color: #7b8fa3">辅助用药</td>
                <td>右美托咪定、地塞米松</td>
              </tr>
              <tr>
                <td style="color: #7b8fa3">抗菌药</td>
                <td>头孢呋辛（术前 30 分钟）</td>
              </tr>
            </tbody>
          </table>
          <div class="hint" style="margin-top: 9px">符合手术安全核查与病历书写规范要求</div>
        </SectionCard>

        <SectionCard title="下游衔接">
          <InfoList :items="downstream" flat />
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
