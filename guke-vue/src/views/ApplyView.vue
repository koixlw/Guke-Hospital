<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'
import { ANES, CUR, MODES } from '@/data/demo'
import { useAuth } from '@/store/auth'

const auth = useAuth()
const { user } = auth

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
const exempted = ref(false)
const anticoagulantBlocked = computed(() => !exempted.value)

const toast = (m) => ElMessage.success(m)

/* 科主任复核豁免 */
const applyExemption = async () => {
  if (!auth.can('apply:submit')) {
    ElMessage.warning(`当前角色「${auth.role.value.name}」无「提交日间手术申请」权限`)
    return
  }
  try {
    await ElMessageBox.confirm(
      '抗凝剂停药仅 4 天，未达 7 天安全停药要求。确认已由科主任复核并承担风险，豁免本次拦截？',
      '科主任复核豁免',
      { confirmButtonText: '确认豁免', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }
  exempted.value = true
  ElMessage.success('科主任复核豁免已记录，提交按钮已解锁（留痕可查）')
}

const submit = () => {
  if (!auth.can('apply:submit')) {
    ElMessage.warning(`当前角色「${auth.role.value.name}」无「提交日间手术申请」权限`)
    return
  }
  if (anticoagulantBlocked.value) {
    ElMessage.error('抗凝剂停药时间未达标（4 天 < 7 天），暂不允许提交日间手术申请')
    return
  }
  toast('日间手术申请已提交，已生成术前检查与麻醉评估待办')
}

/* 保存草稿 */
const draft = ref(false)
const saveDraft = () => {
  draft.value = true
  toast('草稿已保存')
}

/* 发起会诊 */
const consultVisible = ref(false)
const consultForm = reactive({ dept: '关节外科', way: '门诊会诊', note: '抗凝剂停药不足 7 天，请评估能否行日间手术。' })
const doConsult = () => {
  consultVisible.value = false
  toast(`已发起${consultForm.dept}${consultForm.way}，会诊单号 HZ20261102007`)
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

    <el-alert v-if="anticoagulantBlocked" type="error" :closable="false" show-icon>
      <template #title>系统自动拦截：该患者口服抗凝剂停药时间不足 7 天，不允许申请日间手术</template>
      <template #default>
        系统读取门诊诊断与医嘱，识别到口服抗凝剂「利伐沙班片 10mg qd」，末次服药日期 2026-10-29，截至今日停药
        <b>4 天</b>，未达到 7 天安全停药要求。请待停药满 7 天后再行申请，或经专科会诊评估后按择期普通住院办理。
      </template>
    </el-alert>

    <el-alert v-else type="warning" :closable="false" show-icon>
      <template #title>已由科主任复核并豁免抗凝剂停药限制，可提交日间手术申请</template>
      <template #default>
        豁免记录：复核人 {{ user?.name }} · 2026-11-02 11:26 · 留痕写入申请单操作日志，术者与麻醉医师须在术前再次核实用药史。
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
              style="margin-top: 14px; display: flex; gap: 9px; align-items: center; border-top: 1px dashed var(--line); padding-top: 12px; flex-wrap: wrap"
            >
              <el-button size="small" @click="saveDraft">保存草稿</el-button>
              <el-button v-perm="'apply:submit'" type="primary" size="small" @click="submit">
                提交申请
              </el-button>
              <el-button size="small" @click="consultVisible = true">发起会诊</el-button>
              <el-button v-if="anticoagulantBlocked" size="small" @click="applyExemption">
                <IconSvg name="warn" :size="13" />科主任复核
              </el-button>
              <span v-if="anticoagulantBlocked" class="hint" style="margin-left: auto; color: #d64545">
                <IconSvg name="warn" :size="12" /> 抗凝剂控制未通过，提交将被系统拦截
              </span>
              <span v-else class="hint" style="margin-left: auto; color: #0f9d63">
                <IconSvg name="ok" :size="12" /> 已豁免拦截，提交按钮已解锁
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
                <td v-if="anticoagulantBlocked"><TagBox text="拦截" tone="r" /> 不允许申请日间手术</td>
                <td v-else><TagBox text="已豁免" tone="o" /> 科主任复核通过，允许申请</td>
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

    <!-- 发起会诊 -->
    <el-dialog v-model="consultVisible" title="发起专科会诊" width="480px">
      <el-form label-width="88px" label-position="left">
        <el-form-item label="会诊科室">
          <el-select v-model="consultForm.dept" style="width: 200px">
            <el-option label="关节外科" value="关节外科" />
            <el-option label="心血管内科" value="心血管内科" />
            <el-option label="麻醉科" value="麻醉科" />
          </el-select>
        </el-form-item>
        <el-form-item label="会诊方式">
          <el-select v-model="consultForm.way" style="width: 200px">
            <el-option label="门诊会诊" value="门诊会诊" />
            <el-option label="床旁会诊" value="床旁会诊" />
            <el-option label="线上会诊" value="线上会诊" />
          </el-select>
        </el-form-item>
        <el-form-item label="会诊事由">
          <el-input v-model="consultForm.note" type="textarea" :rows="3" resize="none" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="consultVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="doConsult">发起会诊</el-button>
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
