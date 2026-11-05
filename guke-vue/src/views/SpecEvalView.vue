<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'
import { EXAMS, FAIL_REASON } from '@/data/demo'

/* 左侧：术前检查检验报告列表（默认选中第 2 项） */
const reports = EXAMS.slice(0, 6).map((e, i) => ({
  nm: e.nm,
  rpt: `${e.rpt} · 已回传`,
  sel: i === 1
}))

/* 右侧：未通过常见原因（可多选） */
const reasons = ref(FAIL_REASON.slice(0, 4).map((t, i) => ({ t, on: i === 0 })))
const toggleReason = (r) => {
  r.on = !r.on
}

/* 评估表单 */
const form = reactive({
  conclusion: '通过',
  asa: 'Ⅱ 级',
  opinion:
    '患者一般情况可，心肺功能可耐受手术，术前检查检验结果无明显手术禁忌，同意行日间手术。',
  custom: ''
})

const toast = (m) => ElMessage.success(m)
</script>

<template>
  <div>
    <PageHeader
      title="专科评估"
      sub="专科医师在线评估 · 报告同屏查看 · 未通过原因提供常见选项并与退出流程联动"
    >
      <template #actions>
        <el-button size="small" @click="toast('评估结论已暂存')">暂存</el-button>
        <el-button type="primary" size="small" @click="toast('专科评估结论已提交')">
          <IconSvg name="ok" :size="13" />提交评估结论
        </el-button>
      </template>
    </PageHeader>

    <PatientBand />

    <div style="height: 12px" />

    <div style="display: flex; gap: 12px; align-items: flex-start">
      <!-- 左：术前检查检验报告 -->
      <div style="width: 246px; flex: 0 0 246px">
        <SectionCard title="术前检查检验报告" tight>
          <template #right>7 项</template>
          <div
            v-for="r in reports"
            :key="r.nm"
            class="list-row"
            style="cursor: pointer"
            :style="
              r.sel
                ? { background: '#f2f8ff', borderLeft: '2px solid #1b6fc4' }
                : {}
            "
          >
            <div>
              <div class="t1">{{ r.nm }}</div>
              <div class="t2">{{ r.rpt }}</div>
            </div>
            <div class="rt"><TagBox text="已查看" tone="gy" /></div>
          </div>
        </SectionCard>
      </div>

      <!-- 中：报告详情 + 专科评估意见 -->
      <div style="flex: 1; min-width: 0">
        <SectionCard title="报告详情 · 凝血四项（2026-10-30 10:05）" tight>
          <template #right><span class="link">切换报告</span></template>
          <div class="report-line">
            <div class="k">凝血酶原时间 PT</div>
            <div class="v">12.4 s <em>参考 11.0—14.5</em></div>
          </div>
          <div class="report-line">
            <div class="k">国际标准化比值 INR</div>
            <div class="v">1.05 <em>参考 0.80—1.20</em></div>
          </div>
          <div class="report-line">
            <div class="k">活化部分凝血活酶 APTT</div>
            <div class="v">33.8 s <em>参考 28.0—45.0</em></div>
          </div>
          <div class="report-line">
            <div class="k">纤维蛋白原 FIB</div>
            <div class="v">3.42 g/L <em>参考 2.00—4.00</em></div>
          </div>
          <div class="report-line">
            <div class="k">D-二聚体</div>
            <div class="v abn">0.86 mg/L <em>参考 &lt; 0.50</em></div>
          </div>
          <div class="report-line">
            <div class="k">报告结论</div>
            <div class="v">凝血功能基本正常，D-二聚体轻度升高，建议结合临床。</div>
          </div>
          <div class="report-line">
            <div class="k">审核</div>
            <div class="v">检验科 · 周敏 副主任技师</div>
          </div>
        </SectionCard>

        <SectionCard title="专科评估意见">
          <div class="form-grid c2">
            <div class="field">
              <label>评估结论</label>
              <el-radio-group v-model="form.conclusion">
                <el-radio value="通过">通过</el-radio>
                <el-radio value="不通过">不通过</el-radio>
              </el-radio-group>
            </div>
            <div class="field">
              <label>ASA 分级</label>
              <el-select v-model="form.asa">
                <el-option label="Ⅰ 级" value="Ⅰ 级" />
                <el-option label="Ⅱ 级" value="Ⅱ 级" />
                <el-option label="Ⅲ 级" value="Ⅲ 级" />
              </el-select>
            </div>
          </div>
          <div style="margin-top: 10px">
            <div class="hint" style="margin-bottom: 6px">评估意见</div>
            <el-input v-model="form.opinion" type="textarea" :rows="2" resize="none" />
          </div>
        </SectionCard>
      </div>

      <!-- 右：评估表单 + 评估记录 -->
      <div style="width: 352px; flex: 0 0 352px">
        <SectionCard title="评估表单（未通过时填写）">
          <div class="hint" style="margin-bottom: 7px">常见原因（可多选，支持自定义补充）</div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px">
            <span
              v-for="r in reasons"
              :key="r.t"
              class="chk-chip"
              :class="{ on: r.on }"
              @click="toggleReason(r)"
            >
              {{ r.on ? '✓ ' : '' }}{{ r.t }}
            </span>
          </div>
          <div class="hint" style="margin: 10px 0 5px">自定义补充</div>
          <el-input
            v-model="form.custom"
            type="textarea"
            :rows="2"
            resize="none"
            placeholder="请填写具体原因，将同步至病案与退出记录"
          />
          <div class="hint" style="margin: 10px 0 5px">评估结论流转</div>
          <div
            style="
              background: #f7fafd;
              border: 1px solid #e3edf7;
              border-radius: 6px;
              padding: 9px 11px;
              font-size: 12px;
              line-height: 1.8;
              color: #42586e;
            "
          >
            通过 → 生成麻醉评估待办<br />
            不通过 → 一键触发退出日间路径（需选择退出原因）
          </div>
          <div style="display: flex; gap: 8px; margin-top: 12px">
            <el-button type="primary" size="small" @click="toast('评估表单已保存')">
              <IconSvg name="save" :size="13" />保存
            </el-button>
            <el-button class="btn-teal" size="small" @click="toast('评估结论已签发')">
              <IconSvg name="ok" :size="13" />签发
            </el-button>
          </div>
        </SectionCard>

        <SectionCard title="评估记录">
          <div class="list-row" style="padding-left: 0">
            <div>
              <div class="t1">专科评估 · 通过</div>
              <div class="t2">李国栋 · 2026-10-31 11:02</div>
            </div>
            <div class="rt"><TagBox text="已签发" tone="g" /></div>
          </div>
          <div class="list-row" style="padding-left: 0; padding-right: 0; border-bottom: none">
            <div>
              <div class="t1">术前访视记录</div>
              <div class="t2">日间手术中心 · 何静 · 2026-10-31</div>
            </div>
            <div class="rt"><TagBox text="已完成" tone="gy" /></div>
          </div>
        </SectionCard>
      </div>
    </div>
  </div>
</template>
