<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import StepsBar from '@/components/StepsBar.vue'
import IconSvg from '@/components/IconSvg.vue'
import { EXAMS } from '@/data/demo'

/* 麻醉评估流程环节 */
const flowItems = ['术前访视', '气道评估', '麻醉风险分级(ASA)', '评估结论']

/* 右侧：术前检查检验报告（最近 5 项） */
const reports = EXAMS.slice(0, 5).map((e) => ({ nm: e.nm, rpt: e.rpt }))

/* 评估环节配置 */
const stages = [
  { t1: '1. 术前访视', t2: '必填 6 项 · 护士/医师' },
  { t1: '2. 气道评估', t2: '必填 4 项 · 麻醉医师' },
  { t1: '3. 麻醉风险分级', t2: '必填 3 项 · 麻醉医师' },
  { t1: '4. 评估结论', t2: '必填 · 通过/不通过' }
]

const form = reactive({
  height: '172 cm / 74 kg',
  bmi: '25.0',
  fasting: '≥ 8 小时（达标）',
  airway: 'Mallampati Ⅱ 级',
  mouth: '3 横指',
  comorbidity: '高血压（控制稳定）',
  asa: 'Ⅱ 级',
  plan: '拟行椎管内麻醉（L3-4 腰硬联合），局麻药选用 0.5% 罗哌卡因 15mg，术中监测血压、心率、血氧，备全身麻醉预案。'
})

const toast = (m) => ElMessage.success(m)
</script>

<template>
  <div>
    <PageHeader
      title="麻醉评估"
      sub="麻醉医师按医院自定义流程评估 · 评估时同屏查看术前检查检验报告 · 未通过强制转退出管理"
    >
      <template #actions>
        <el-button size="small" @click="toast('麻醉评估流程配置已打开')">
          <IconSvg name="cog" :size="13" />流程配置
        </el-button>
        <el-button type="primary" size="small" @click="toast('麻醉评估已提交')">
          <IconSvg name="ok" :size="13" />提交评估
        </el-button>
      </template>
    </PageHeader>

    <PatientBand />

    <div style="height: 12px" />

    <div class="card">
      <div class="card-hd"><span class="ico" /></div>
      <div class="card-bd">
        <div style="padding: 12px 16px 6px">
          <div style="display: flex; align-items: center; margin-bottom: 10px">
            <div style="font-weight: 700; font-size: 13px">麻醉评估流程</div>
            <span class="hint" style="margin-left: 10px">
              当前流程共 4 个环节，由系统管理员在【参数配置 · 麻醉评估流程】中自定义，配置后即时生效，无需二次开发
            </span>
            <span style="margin-left: auto"><TagBox text="可配置" tone="t" /></span>
          </div>
          <StepsBar :items="flowItems" :current="2" />
        </div>
      </div>
    </div>

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <SectionCard title="评估表单 · 麻醉风险分级">
          <div class="form-grid">
            <div class="field">
              <label>身高 / 体重</label>
              <el-input v-model="form.height" />
            </div>
            <div class="field">
              <label>BMI</label>
              <el-input v-model="form.bmi" disabled />
            </div>
            <div class="field">
              <label>禁食时间</label>
              <el-input v-model="form.fasting" />
            </div>
            <div class="field">
              <label>气道评估</label>
              <el-select v-model="form.airway">
                <el-option label="Mallampati Ⅰ 级" value="Mallampati Ⅰ 级" />
                <el-option label="Mallampati Ⅱ 级" value="Mallampati Ⅱ 级" />
                <el-option label="Ⅲ 级" value="Ⅲ 级" />
              </el-select>
            </div>
            <div class="field">
              <label>张口度</label>
              <el-input v-model="form.mouth" />
            </div>
            <div class="field">
              <label>合并症</label>
              <el-input v-model="form.comorbidity" />
            </div>
          </div>
          <div style="margin-top: 12px">
            <div class="hint" style="margin-bottom: 6px">ASA 分级（决定能否继续日间手术流程）</div>
            <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap">
              <el-radio-group v-model="form.asa">
                <el-radio value="Ⅰ 级">Ⅰ 级</el-radio>
                <el-radio value="Ⅱ 级">Ⅱ 级</el-radio>
                <el-radio value="Ⅲ 级">Ⅲ 级</el-radio>
                <el-radio value="Ⅳ 级">Ⅳ 级</el-radio>
              </el-radio-group>
              <span class="hint" style="margin-left: 8px">Ⅲ 级及以上系统提示需科主任复核</span>
            </div>
          </div>
          <div style="margin-top: 12px">
            <div class="hint" style="margin-bottom: 6px">麻醉计划</div>
            <el-input v-model="form.plan" type="textarea" :rows="3" resize="none" />
          </div>
          <div class="result-bar" style="margin-top: 12px">
            <IconSvg name="ok" :size="15" />评估结论：通过 · 可继续日间手术流程（下一步：手术预约）
          </div>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="术前检查检验报告" tight>
          <template #right><span class="link">全部</span></template>
          <div v-for="r in reports" :key="r.nm" class="list-row" style="cursor: pointer">
            <div>
              <div class="t1">{{ r.nm }}</div>
              <div class="t2">{{ r.rpt }}</div>
            </div>
            <div class="rt"><TagBox text="查看" tone="b" /></div>
          </div>
        </SectionCard>

        <SectionCard title="评估环节配置">
          <div
            v-for="(s, i) in stages"
            :key="s.t1"
            class="list-row"
            style="padding-left: 0"
            :style="i === stages.length - 1 ? { borderBottom: 'none' } : {}"
          >
            <div>
              <div class="t1">{{ s.t1 }}</div>
              <div class="t2">{{ s.t2 }}</div>
            </div>
            <div class="rt"><TagBox text="启用" tone="g" /></div>
          </div>
        </SectionCard>
      </div>
    </div>
  </div>
</template>
