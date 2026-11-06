<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import InfoList from '@/components/InfoList.vue'
import StepsBar from '@/components/StepsBar.vue'
import IconSvg from '@/components/IconSvg.vue'
import { QUIT_REASON } from '@/data/demo'
import { useAuth } from '@/store/auth'

const auth = useAuth()

const NOTIFY_WAYS = ['电话告知日间手术中心', '现场办理', '短信回复']

const form = reactive({
  reason: QUIT_REASON[0],
  date: '2026-11-02',
  notify: NOTIFY_WAYS[0],
  stage: '麻醉评估（未通过）',
  operator: '日间手术中心 · 张敏',
  phone: '138****7261',
  note: '麻醉评估 ASA Ⅲ 级，合并重度睡眠呼吸暂停，日间手术风险较高，经与患者及家属沟通，改为普通住院择期手术。'
})

/* 资金结算预览（自动衔接） */
const settle = [
  { nm: '专项储值金冻结金额', amt: '2,800.00', rmk: '充值后全额冻结', green: false },
  { nm: '已发生检查检验费用', amt: '1,178.00', rmk: '按门诊规则核销', green: false },
  { nm: '应退余额', amt: '1,622.00', rmk: '原支付渠道退回', green: true }
]

/* 资源释放 */
const exited = ref(false)
const resources = computed(() => [
  { t1: '手术间 / 台次', t2: '门诊手术室 2 间 · 11-03 10:00 第 2 台', tag: exited.value ? '已释放' : '待释放', tone: exited.value ? 'g' : 'o' },
  { t1: '床位预占', t2: '38 病区 38-12', tag: exited.value ? '已释放' : '待释放', tone: exited.value ? 'g' : 'o' },
  { t1: '短信通知', t2: '向患者发送退出确认短信', tag: exited.value ? '已发送' : '待发送', tone: exited.value ? 'g' : 'o' }
])

const steps = ['退出申请', '原因确认', '资金结算', '资源释放']
const stepCurrent = computed(() => (exited.value ? 3 : 1))

/* 确认退出 */
const doQuit = async () => {
  if (!auth.can('quit:confirm')) {
    ElMessage.warning(`当前角色「${auth.role.value.name}」无「确认退出日间手术」权限`)
    return
  }
  if (exited.value) {
    ElMessage.info('该患者已退出日间手术路径，无需重复操作')
    return
  }
  try {
    await ElMessageBox.confirm(
      `确认以「${form.reason}」退出日间手术路径？已发生检查检验费用将按门诊规则核销，余额 ${settle[2].amt} 元原路退回。`,
      '确认退出日间手术',
      { confirmButtonText: '确认退出', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }
  exited.value = true
  form.stage = '已退出日间路径'
  ElMessage.success('已确认退出日间手术路径：资源已释放，门诊结算完成，退出记录已写入')
}

const toast = (m) => ElMessage.success(m)

/* 结算结果行：show-summary 会对齐真实列宽 */
const settleSummary = ({ columns }) =>
  columns.map((col, i) => (i === 0 ? '结算结果' : i === 1 ? '1,622.00' : i === 2 ? '生成结算流水 SK20261102012' : ''))
</script>

<template>
  <div>
    <PageHeader
      title="退出日间手术"
      sub="麻醉评估未通过、患者电话告知不来手术等情形，由日间手术中心退出日间路径 · 选择退出原因 · 自动衔接门诊结算"
    >
      <template #actions>
        <el-button v-perm="'quit:confirm'" type="danger" size="small" @click="doQuit">
          <IconSvg name="exit" :size="13" />确认退出
        </el-button>
        <el-button size="small" @click="toast('已取消退出操作')">取消</el-button>
      </template>
    </PageHeader>

    <PatientBand>
      <template #extra>
        <TagBox v-if="exited" text="已退出" tone="gy" />
        <TagBox v-else text="待退出" tone="o" />
      </template>
    </PatientBand>

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <el-alert type="warning" :closable="false" show-icon>
          <template #title>退出前请确认已完成信息核对</template>
          <template #default>
            退出日间路径后，患者将不再进入手术安排与入院流程，已执行检查检验费用按门诊规则核销，余额原路退回。
          </template>
        </el-alert>

        <div style="height: 12px" />

        <SectionCard title="退出登记">
          <div class="form-grid c2">
            <div class="field">
              <label class="req">退出原因</label>
              <el-select v-model="form.reason">
                <el-option v-for="r in QUIT_REASON" :key="r" :label="r" :value="r" />
              </el-select>
            </div>
            <div class="field">
              <label class="req">退出日期</label>
              <el-input v-model="form.date" />
            </div>
            <div class="field">
              <label>告知方式</label>
              <el-select v-model="form.notify">
                <el-option v-for="w in NOTIFY_WAYS" :key="w" :label="w" :value="w" />
              </el-select>
            </div>
            <div class="field">
              <label>评估环节</label>
              <el-input v-model="form.stage" disabled />
            </div>
            <div class="field">
              <label>操作人</label>
              <el-input v-model="form.operator" disabled />
            </div>
            <div class="field">
              <label>联系电话</label>
              <el-input v-model="form.phone" />
            </div>
          </div>

          <div style="margin-top: 12px">
            <div class="hint" style="margin-bottom: 6px">退出说明</div>
            <el-input v-model="form.note" type="textarea" :rows="2" resize="none" />
          </div>
        </SectionCard>

        <SectionCard title="资金结算预览（自动衔接）" tight>
          <template #right>结算方式：门诊结算（原路退回）</template>
          <el-table :data="settle" style="width: 100%" table-layout="auto" show-summary :summary-method="settleSummary">
            <el-table-column prop="nm" label="项目" min-width="160" />
            <el-table-column label="金额(元)" width="130" align="right">
              <template #default="{ row }">
                <span
                  class="num"
                  :style="row.green ? { color: '#0f9d63', fontWeight: 700 } : {}"
                >{{ row.amt }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="rmk" label="说明" width="180" />
          </el-table>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="退出流程">
          <div style="padding-top: 4px">
            <StepsBar :items="steps" :current="stepCurrent" />
          </div>
        </SectionCard>

        <SectionCard title="资源释放">
          <InfoList :items="resources" flat />
        </SectionCard>

        <SectionCard title="退出记录留痕">
          <div class="hint" style="line-height: 2">
            操作人：张敏（日间手术中心）<br />
            操作时间：2026-11-02 11:02:35<br />
            操作内容：退出日间路径 + 门诊结算<br />
            退出原因：{{ form.reason }}<br />
            结果：{{ exited ? '成功 · 已写入退出记录表' : '待确认 · 尚未写入退出记录表' }}
          </div>
        </SectionCard>
      </div>
    </div>
  </div>
</template>
