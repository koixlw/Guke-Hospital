<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'
import { ANES, CUR, MODES } from '@/data/demo'

const form = reactive({
  apply: CUR.apply,
  dept: '关节外科门诊',
  doctor: '李国栋',
  op: '膝关节镜下半月板成形术',
  diag: '右膝内侧半月板撕裂',
  icd: 'S83.201',
  admitDate: '2026-11-03',
  duration: '60 分钟',
  anes: CUR.anes,
  mode: MODES[0],
  note: '患者右膝疼痛 3 个月，MRI 提示内侧半月板Ⅲ度撕裂，保守治疗无效，拟行关节镜手术。既往高血压，规律服药，血压控制稳定。'
})

/* 系统自动拦截：抗凝剂停药不足 7 天，提交按钮锁定 */
const anticoagulantBlocked = true

const toast = (m) => ElMessage.success(m)
const submit = () => {
  if (anticoagulantBlocked) {
    ElMessage.error('抗凝剂停药时间未达标，暂不允许提交日间手术申请')
    return
  }
  toast('日间手术申请已提交')
}
</script>

<template>
  <div>
    <PageHeader title="日间手术申请" sub="诊间医生站 · 门急诊医生开立 · 申请单为全流程唯一业务载体">
      <template #actions>
        <el-button size="small" @click="toast('已返回诊间')">返回诊间</el-button>
        <el-button size="small" @click="toast('申请单已发送至打印')">
          <IconSvg name="print" :size="13" />打印申请单
        </el-button>
      </template>
    </PageHeader>

    <PatientBand>
      <template #extra><TagBox text="已建档" tone="gy" /></template>
    </PatientBand>

    <div style="height: 12px" />

    <el-alert type="error" :closable="false" show-icon>
      <template #title>系统自动拦截：该患者口服抗凝剂停药时间不足 7 天，不允许申请日间手术</template>
      <template #default>
        系统读取门诊诊断与医嘱，识别到口服抗凝剂「利伐沙班片 10mg qd」，末次服药日期 2026-10-29，截至今日停药
        <b>4 天</b>，未达到 7 天安全停药要求。请待停药满 7 天后再行申请，或经专科会诊评估后按择期普通住院办理。
      </template>
    </el-alert>

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <SectionCard title="日间手术申请单">
          <el-form :model="form" label-width="84px" label-position="left">
            <div class="form-grid">
              <div class="field">
                <label>申请单号</label>
                <el-input v-model="form.apply" disabled />
              </div>
              <div class="field">
                <label>开单科室</label>
                <el-input v-model="form.dept" disabled />
              </div>
              <div class="field">
                <label class="req">申请医师</label>
                <el-input v-model="form.doctor" disabled />
              </div>
              <div class="field">
                <label class="req">拟手术名称</label>
                <el-input v-model="form.op" />
              </div>
              <div class="field">
                <label>诊断</label>
                <el-input v-model="form.diag" />
              </div>
              <div class="field">
                <label>ICD 编码</label>
                <el-input v-model="form.icd" />
              </div>
              <div class="field">
                <label class="req">拟入院日期</label>
                <el-input v-model="form.admitDate" />
              </div>
              <div class="field">
                <label>预计手术时长</label>
                <el-input v-model="form.duration" />
              </div>
              <div class="field">
                <label>拟麻醉方式</label>
                <el-select v-model="form.anes">
                  <el-option v-for="a in ANES" :key="a" :label="a" :value="a" />
                </el-select>
              </div>
            </div>

            <div style="margin-top: 14px">
              <div class="hint" style="margin-bottom: 7px">
                业务模式（贯穿评估、预约、通知、费用全部环节，可追溯）
              </div>
              <div class="radio-row">
                <el-radio-group v-model="form.mode">
                  <el-radio v-for="m in MODES" :key="m" :value="m">{{ m }}</el-radio>
                </el-radio-group>
                <span style="margin-left: auto" class="hint">
                  当前选择：{{ form.mode }} · 系统据此生成麻醉评估待办
                </span>
              </div>
            </div>

            <div style="margin-top: 14px">
              <div class="hint" style="margin-bottom: 6px">申请说明 / 术前注意事项</div>
              <el-input v-model="form.note" type="textarea" :rows="3" resize="none" />
            </div>

            <div
              style="margin-top: 14px; display: flex; gap: 9px; align-items: center; border-top: 1px dashed var(--line); padding-top: 12px"
            >
              <el-button size="small" @click="toast('草稿已保存')">保存草稿</el-button>
              <el-button type="primary" size="small" :disabled="anticoagulantBlocked" @click="submit">
                提交申请
              </el-button>
              <el-button size="small" @click="toast('已发起专科会诊')">发起会诊</el-button>
              <span class="hint" style="margin-left: auto; color: #d64545">
                <IconSvg name="warn" :size="12" /> 抗凝剂控制未通过，提交按钮已锁定
              </span>
            </div>
          </el-form>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="抗凝剂判断明细" tight>
          <table class="tb-plain">
            <tbody>
              <tr>
                <td style="width: 96px; color: #7b8fa3">识别来源</td>
                <td>门诊医嘱 · 药品字典</td>
              </tr>
              <tr>
                <td style="color: #7b8fa3">药品名称</td>
                <td><b>利伐沙班片</b> 10mg</td>
              </tr>
              <tr>
                <td style="color: #7b8fa3">服用频次</td>
                <td>每日 1 次（qd）</td>
              </tr>
              <tr>
                <td style="color: #7b8fa3">末次服药</td>
                <td>2026-10-29</td>
              </tr>
              <tr>
                <td style="color: #7b8fa3">停药天数</td>
                <td><b style="color: #d64545">4 天</b>（要求 ≥ 7 天）</td>
              </tr>
              <tr>
                <td style="color: #7b8fa3">判断结果</td>
                <td><TagBox text="拦截" tone="r" /> 不允许申请日间手术</td>
              </tr>
            </tbody>
          </table>
        </SectionCard>

        <SectionCard title="近期门诊就诊" tight>
          <div class="list-row" style="padding-left: 0; padding-right: 0">
            <div>
              <div class="t1">关节外科门诊 · 李国栋</div>
              <div class="t2">2026-10-28 · 门诊号 OP20261102031</div>
            </div>
            <div class="rt"><TagBox text="已完成" tone="gy" /></div>
          </div>
          <div
            class="list-row"
            style="padding-left: 0; padding-right: 0; border-bottom: none"
          >
            <div>
              <div class="t1">影像科 · 右膝 MRI 报告</div>
              <div class="t2">2026-10-31 · 内侧半月板Ⅲ度撕裂</div>
            </div>
            <div class="rt"><TagBox text="已回传" tone="g" /></div>
          </div>
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
