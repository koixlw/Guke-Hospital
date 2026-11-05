<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import InfoList from '@/components/InfoList.vue'
import IconSvg from '@/components/IconSvg.vue'

const toast = (m) => ElMessage.success(m)

/* 住院证号：支持扫码 / 刷身份证 / 手工输入调入 */
const certNo = ref('ZZ202611020088')

const form = reactive({
  inp: 'ZY20261102481',
  ward: '骨关节外科一病区（38 病区）',
  bed: '38-12',
  admitAt: '2026-11-02 10:12',
  diag: '右膝内侧半月板撕裂（S83.201）',
  nurse: '二级护理',
  doc: '李国栋',
  hospType: '日间手术住院',
  insurance: '城镇职工医保'
})

const wards = ['骨关节外科一病区（38 病区）', '日间手术病区']
const beds = ['38-12', '38-15', '39-02']
const nurseLevels = ['二级护理', '一级护理', '三级护理']
const insuranceTypes = ['城镇职工医保', '城乡居民医保', '自费']

/* 随患者转入住院的信息 */
const transItems = [
  { item: '日间手术申请单', content: 'DZ20261102007', qty: '1 份', st: '已调入' },
  { item: '术前检查检验项目及报告', content: '7 项 / 7 份报告', qty: '全部', st: '已转入' },
  { item: '专项储值金', content: '2,800.00 元', qty: '转入住院储值金', st: '已结转' },
  { item: '专科评估记录 / 麻醉评估记录', content: '各 1 份', qty: '全部', st: '已转入' },
  { item: '手术预约记录', content: '2026-11-03 10:00—11:30', qty: '1 条', st: '已转入' }
]

/* HIS 一体化联动日志 */
const logs = [
  { t1: '调入日间手术住院证', t2: 'HIS 入院登记接口 · 10:12:06 · 耗时 186ms', tag: '成功', tone: 'g' },
  { t1: '生成住院号 ZY20261102481', t2: 'HIS 入院登记接口 · 10:12:07 · 耗时 142ms', tag: '成功', tone: 'g' },
  { t1: '专项储值金 2,800.00 转入住院储值金', t2: 'HIS 储值金接口 · 10:12:08 · 耗时 221ms', tag: '成功', tone: 'g' },
  { t1: '住院登记信息回写 HIS', t2: 'HIS 入院登记接口 · 10:12:09 · 耗时 197ms', tag: '成功', tone: 'g' },
  { t1: '一致性校验（患者/费用/住院号）', t2: '院内集成平台 · 10:12:10 · 耗时 96ms', tag: '一致', tone: 'g' }
]

/* 一致性校验 */
const checks = [
  { k: '患者基本信息', v: '一致' },
  { k: '住院号 / 住院证', v: 'ZY20261102481' },
  { k: '专项储值金', v: '2,800.00 → 住院储值金' },
  { k: '检查检验报告', v: '7 份全部关联' }
]
</script>

<template>
  <div>
    <PageHeader
      title="入院登记"
      sub="调入日间手术住院证完成入院登记 · 与 HIS 入院登记系统一体化 · 申请、报告、储值金随患者转入住院"
    >
      <template #title-extra><span class="tag solid">▲ 条款 2</span></template>
      <template #actions>
        <el-button size="small" @click="toast('已扫码调入住院证')">
          <IconSvg name="scan" :size="13" />扫码调入
        </el-button>
        <el-button type="primary" size="small" @click="toast('入院登记成功，已回写 HIS')">
          <IconSvg name="ok" :size="13" />确认登记并回写 HIS
        </el-button>
      </template>
    </PageHeader>

    <SectionCard bare>
      <div style="display: flex; gap: 10px; align-items: center">
        <span style="font-size: 12.5px; color: #5b6b7f">住院证号</span>
        <el-input v-model="certNo" style="width: 210px; flex: 0 0 210px" />
        <el-button size="small" @click="toast('已从 HIS 调入住院证')">
          <IconSvg name="refresh" :size="13" />从 HIS 调入住院证
        </el-button>
        <span style="width: 1px; height: 20px; background: var(--line)" />
        <span class="hint">支持扫描住院证条码 / 刷身份证 / 输入住院证号调入</span>
        <span style="margin-left: auto; display: flex; align-items: center; gap: 6px">
          <TagBox text="HIS 已联通" tone="g" />
          <TagBox text="集成平台正常" tone="g" />
        </span>
      </div>
    </SectionCard>

    <div style="height: 12px" />

    <PatientBand />

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <SectionCard title="随患者转入住院的信息（自动带出，无需二次录入）" tight>
          <template #right>数据来源：HIS 住院证 + 本系统申请单</template>
          <el-table :data="transItems" style="width: 100%">
            <el-table-column prop="item" label="转入项" min-width="180" show-overflow-tooltip />
            <el-table-column prop="content" label="内容 / 单号" width="210" class-name="mono" />
            <el-table-column prop="qty" label="数量" width="150" />
            <el-table-column label="状态" width="82" align="center">
              <template #default="{ row }"><TagBox :text="row.st" tone="g" /></template>
            </el-table-column>
          </el-table>
        </SectionCard>

        <SectionCard title="住院登记信息">
          <el-form :model="form" label-width="84px" label-position="left">
            <div class="form-grid">
              <div class="field">
                <label>住院号</label>
                <el-input v-model="form.inp" disabled />
              </div>
              <div class="field">
                <label>病区</label>
                <el-select v-model="form.ward">
                  <el-option v-for="w in wards" :key="w" :label="w" :value="w" />
                </el-select>
              </div>
              <div class="field">
                <label>床位</label>
                <el-select v-model="form.bed">
                  <el-option v-for="b in beds" :key="b" :label="b" :value="b" />
                </el-select>
              </div>
              <div class="field">
                <label>入院日期</label>
                <el-input v-model="form.admitAt" />
              </div>
              <div class="field">
                <label>入院诊断</label>
                <el-input v-model="form.diag" />
              </div>
              <div class="field">
                <label>护理级别</label>
                <el-select v-model="form.nurse">
                  <el-option v-for="n in nurseLevels" :key="n" :label="n" :value="n" />
                </el-select>
              </div>
              <div class="field">
                <label>主诊医师</label>
                <el-input v-model="form.doc" disabled />
              </div>
              <div class="field">
                <label>住院类型</label>
                <el-input v-model="form.hospType" disabled />
              </div>
              <div class="field">
                <label>医保类型</label>
                <el-select v-model="form.insurance">
                  <el-option v-for="i in insuranceTypes" :key="i" :label="i" :value="i" />
                </el-select>
              </div>
            </div>

            <div
              style="margin-top: 12px; display: flex; gap: 9px; align-items: center; border-top: 1px dashed var(--line); padding-top: 11px"
            >
              <span class="hint">
                <IconSvg name="info" :size="12" /> 登记成功后将自动衔接手术安排与手术登记环节，HIS 侧实时可见
              </span>
              <span style="margin-left: auto; display: flex; gap: 8px">
                <el-button size="small" @click="toast('住院证已发送至打印')">
                  <IconSvg name="print" :size="13" />打印住院证
                </el-button>
                <el-button size="small" @click="toast('住院登记信息已保存')">保存</el-button>
              </span>
            </div>
          </el-form>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="HIS 一体化联动状态">
          <div class="result-bar" style="margin-bottom: 10px">
            <IconSvg name="ok" :size="15" /> 入院登记一体化成功 · 双方数据一致
          </div>
          <InfoList :items="logs" flat />
        </SectionCard>

        <SectionCard title="一致性校验" tight>
          <table class="tb-plain">
            <tbody>
              <tr v-for="c in checks" :key="c.k">
                <td style="width: 104px; color: #7b8fa3">{{ c.k }}</td>
                <td>{{ c.v }}</td>
                <td style="text-align: center; width: 62px"><TagBox text="通过" tone="g" /></td>
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
  padding: 8px 14px;
  border-bottom: 1px solid #eef2f7;
  color: #33475c;
}
.tb-plain tr:last-child td {
  border-bottom: none;
}
</style>
