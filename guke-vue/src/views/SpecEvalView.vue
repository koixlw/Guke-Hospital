<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'
import { FAIL_REASON } from '@/data/demo'
import { useAuth } from '@/store/auth'

/* 术前检查检验报告（点击切换，中间详情同屏跟随） */
const REPORTS = [
  {
    nm: '血常规（五分类）',
    rpt: '2026-10-30 10:05 · 已回传',
    title: '报告详情 · 血常规（五分类）（2026-10-30 10:05）',
    lines: [
      { k: '白细胞计数 WBC', v: '6.42 ×10⁹/L <em>参考 3.5—9.5</em>' },
      { k: '红细胞计数 RBC', v: '4.78 ×10¹²/L <em>参考 4.3—5.8</em>' },
      { k: '血红蛋白 HGB', v: '142 g/L <em>参考 130—175</em>' },
      { k: '血小板计数 PLT', v: '213 ×10⁹/L <em>参考 125—350</em>' },
      { k: '报告结论', v: '血常规未见明显异常。' },
      { k: '审核', v: '检验科 · 周敏 副主任技师' }
    ]
  },
  {
    nm: '凝血四项（PT/APTT/TT/FIB）',
    rpt: '2026-10-30 10:05 · 已回传',
    title: '报告详情 · 凝血四项（2026-10-30 10:05）',
    lines: [
      { k: '凝血酶原时间 PT', v: '12.4 s <em>参考 11.0—14.5</em>' },
      { k: '国际标准化比值 INR', v: '1.05 <em>参考 0.80—1.20</em>' },
      { k: '活化部分凝血活酶 APTT', v: '33.8 s <em>参考 28.0—45.0</em>' },
      { k: '纤维蛋白原 FIB', v: '3.42 g/L <em>参考 2.00—4.00</em>' },
      { k: 'D-二聚体', v: '0.86 mg/L <em>参考 &lt; 0.50</em>', abn: true },
      { k: '报告结论', v: '凝血功能基本正常，D-二聚体轻度升高，建议结合临床。' },
      { k: '审核', v: '检验科 · 周敏 副主任技师' }
    ]
  },
  {
    nm: '生化全套（肝肾功能+电解质）',
    rpt: '2026-10-30 11:30 · 已回传',
    title: '报告详情 · 生化全套（2026-10-30 11:30）',
    lines: [
      { k: '谷丙转氨酶 ALT', v: '24 U/L <em>参考 9—50</em>' },
      { k: '肌酐 Cr', v: '78 μmol/L <em>参考 57—97</em>' },
      { k: '尿素氮 BUN', v: '5.4 mmol/L <em>参考 3.1—8.0</em>' },
      { k: '血钾 K⁺', v: '4.1 mmol/L <em>参考 3.5—5.3</em>' },
      { k: '空腹血糖 GLU', v: '5.6 mmol/L <em>参考 3.9—6.1</em>' },
      { k: '报告结论', v: '肝肾功能及电解质未见明显异常。' },
      { k: '审核', v: '检验科 · 陈蕾 主治医师' }
    ]
  },
  {
    nm: '心电图（十二导联）',
    rpt: '2026-10-30 09:25 · 已回传',
    title: '报告详情 · 心电图（十二导联）（2026-10-30 09:25）',
    lines: [
      { k: '心率 HR', v: '72 次/分 <em>参考 60—100</em>' },
      { k: 'PR 间期', v: '158 ms <em>参考 120—200</em>' },
      { k: 'QRS 时限', v: '92 ms <em>参考 80—120</em>' },
      { k: 'QTc', v: '412 ms <em>参考 &lt; 440</em>' },
      { k: '报告结论', v: '窦性心律，大致正常心电图。' },
      { k: '审核', v: '心功能室 · 郑霞 副主任医师' }
    ]
  },
  {
    nm: '胸部正侧位 DR',
    rpt: '2026-10-30 14:10 · 已回传',
    title: '报告详情 · 胸部正侧位 DR（2026-10-30 14:10）',
    lines: [
      { k: '双肺', v: '两肺纹理清晰，未见实变影' },
      { k: '心影', v: '大小、形态未见明显异常' },
      { k: '膈面', v: '光整，肋膈角锐利' },
      { k: '报告结论', v: '双肺、心影、膈面未见明显异常。' },
      { k: '审核', v: '放射科 · 罗建 主任医师' }
    ]
  },
  {
    nm: '右膝关节 MRI（3.0T）',
    rpt: '2026-10-31 09:40 · 已回传',
    title: '报告详情 · 右膝关节 MRI（3.0T）（2026-10-31 09:40）',
    lines: [
      { k: '内侧半月板', v: '后角见线状高信号，达关节面 <em>Ⅲ度撕裂</em>', abn: true },
      { k: '外侧半月板', v: '形态、信号未见明显异常' },
      { k: '前后交叉韧带', v: '连续性尚可，未见断裂' },
      { k: '关节积液', v: '少量' },
      { k: '报告结论', v: '右膝内侧半月板Ⅲ度撕裂，建议关节镜下半月板成形术。' },
      { k: '审核', v: '放射科 · 罗建 主任医师' }
    ]
  }
]

const sel = ref(1)
const reports = computed(() => REPORTS.map((r, i) => ({ ...r, sel: i === sel.value })))
const curReport = computed(() => REPORTS[sel.value])

const selectReport = (i) => {
  sel.value = i
}

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

/* 评估记录 */
const records = ref([
  { t1: '专科评估 · 通过', t2: '李国栋 · 2026-10-31 11:02' },
  { t1: '术前访视记录', t2: '日间手术中心 · 何静 · 2026-10-31' }
])

/* 签发 */
const signed = ref(false)
const sign = () => {
  if (!auth_can('spec:sign')) {
    ElMessage.warning('当前角色无「签发专科评估结论」权限')
    return
  }
  if (form.conclusion === '不通过' && !reasons.value.some((r) => r.on) && !form.custom.trim()) {
    ElMessage.warning('评估结论为「不通过」时，必须选择或填写未通过原因')
    return
  }
  signed.value = true
  records.value.unshift({
    t1: `专科评估 · ${form.conclusion}`,
    t2: `李国栋 · 2026-11-02 11:20`
  })
  ElMessage.success(
    form.conclusion === '通过'
      ? '专科评估结论已签发，已生成麻醉评估待办'
      : '专科评估结论已签发，可一键触发退出日间路径'
  )
}

/* 权限判定（页面内按操作点控制） */
const auth = useAuth()
const auth_can = (code) => auth.can(code)

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
        <el-button v-perm="'spec:sign'" type="primary" size="small" @click="sign">
          <IconSvg name="ok" :size="13" />提交评估结论
        </el-button>
      </template>
    </PageHeader>

    <PatientBand>
      <template #extra>
        <TagBox v-if="signed" :text="form.conclusion" :tone="form.conclusion === '通过' ? 'g' : 'r'" />
        <TagBox v-else text="待评估" tone="o" />
      </template>
    </PatientBand>

    <div style="height: 12px" />

    <div style="display: flex; gap: 12px; align-items: flex-start">
      <!-- 左：术前检查检验报告 -->
      <div style="width: 246px; flex: 0 0 246px">
        <SectionCard title="术前检查检验报告" tight>
          <template #right>{{ REPORTS.length }} 项</template>
          <div
            v-for="(r, i) in reports"
            :key="r.nm"
            class="list-row"
            style="cursor: pointer"
            :style="
              r.sel
                ? { background: '#f2f8ff', borderLeft: '2px solid #1b6fc4' }
                : {}
            "
            @click="selectReport(i)"
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
        <SectionCard :title="curReport.title" tight>
          <template #right>
            <span class="link" @click="toast('请在左侧报告列表中选择其他报告')">切换报告</span>
          </template>
          <div v-for="l in curReport.lines" :key="l.k" class="report-line">
            <div class="k">{{ l.k }}</div>
            <div class="v" :class="{ abn: l.abn }">{{ l.v }}</div>
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
            <el-button class="btn-teal" size="small" @click="sign">
              <IconSvg name="ok" :size="13" />签发
            </el-button>
          </div>
        </SectionCard>

        <SectionCard title="评估记录">
          <div
            v-for="(r, i) in records"
            :key="r.t1 + r.t2"
            class="list-row"
            style="padding-left: 0"
            :style="i === records.length - 1 ? { borderBottom: 'none' } : {}"
          >
            <div>
              <div class="t1">{{ r.t1 }}</div>
              <div class="t2">{{ r.t2 }}</div>
            </div>
            <div class="rt"><TagBox text="已签发" tone="g" /></div>
          </div>
        </SectionCard>
      </div>
    </div>
  </div>
</template>
