<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'
import { CUR, TRANSFER_REASON, TRANSFER_WAY } from '@/data/demo'
import { useAuth } from '@/store/auth'

const auth = useAuth()
const toast = (m) => ElMessage.success(m)

const form = reactive({
  reason: TRANSFER_REASON[1],
  way: TRANSFER_WAY[0],
  fromType: '日间手术住院',
  toType: '普通住院',
  date: '2026-11-02 15:30',
  ward: '骨关节外科一病区（38 病区）',
  bed: '38-12',
  doc: '李国栋',
  note: '患者今日行膝关节镜下半月板成形术，术中探查见内侧半月板后角桶柄状撕裂，行成形+缝合，术后出现膝关节腔积血，需继续住院观察引流及抗感染治疗，与患者家属沟通后同意转为普通住院继续治疗。',
  target: '患者本人',
  consent: '书面知情同意',
  sign: '李国栋'
})

const wards = ['骨关节外科一病区（38 病区）', '骨关节外科二病区']
const targets = ['患者本人', '家属（配偶）']
const consents = ['书面知情同意', '口头告知并记录']

/* 转普通住院影响 */
const impacts = [
  '住院类型由「日间手术住院」变更为「普通住院」，医保结算路径同步切换',
  '专项储值金及已发生费用自动结转，不重复计费',
  '日间手术路径终止，写入退出记录（含操作人、时间、原因）',
  '转普通住院记录可随病案归档，满足病历书写规范'
]

/* 当前住院信息 */
const transferred = ref(false)

const stay = computed(() => [
  { k: '住院号', v: CUR.inp, mono: true },
  { k: '病区 / 床位', v: `38 病区 / ${CUR.bed}` },
  { k: '入院时间', v: '2026-11-02 10:12' },
  { k: '住院类型', tag: transferred.value ? '普通住院' : '日间手术住院', tone: transferred.value ? 'g' : 'b' },
  { k: '手术状态', tag: '已完成', tone: 'gy', text: '2026-11-02 10:40' },
  { k: '已发生费用', v: '3,978.00 元' },
  { k: '储值金余额', v: '1,622.00 元（转入住院储值金）' }
])

/* 转为普通住院 */
const doTransfer = async () => {
  if (!auth.can('transfer:submit')) {
    ElMessage.warning(`当前角色「${auth.role.value.name}」无「转普通住院」操作权限`)
    return
  }
  if (transferred.value) {
    ElMessage.info('该患者已转为普通住院，无需重复操作')
    return
  }
  try {
    await ElMessageBox.confirm(
      `确认将 ${CUR.name}（${CUR.inp}）由「日间手术住院」转为「普通住院」？转出后日间手术路径终止。`,
      '转为普通住院',
      { confirmButtonText: '确认转出', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }
  transferred.value = true
  form.fromType = '日间手术住院'
  form.toType = '普通住院'
  ElMessage.success('已转为普通住院：住院类型已变更，储值金与费用同步结转，退出记录已写入')
}
</script>

<template>
  <div>
    <PageHeader
      title="转普通入院"
      sub="住院医生将日间手术住院患者转为普通住院患者 · 转住院原因与转住院方式字典化管理 · 记录完整可溯"
    >
      <template #title-extra><span class="tag solid">▲ 条款 3</span></template>
      <template #actions>
        <el-button v-perm="'transfer:submit'" type="primary" size="small" @click="doTransfer">
          <IconSvg name="swap" :size="13" />转为普通住院
        </el-button>
        <el-button size="small" @click="toast('已取消')">取消</el-button>
      </template>
    </PageHeader>

    <PatientBand>
      <template #extra>
        <TagBox :text="transferred ? '普通住院' : '日间手术住院'" :tone="transferred ? 'g' : 'b'" />
      </template>
    </PatientBand>

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <SectionCard title="转普通住院登记">
          <el-form :model="form" label-width="84px" label-position="left">
            <div class="form-grid c2">
              <div class="field">
                <label class="req">转住院原因</label>
                <el-select v-model="form.reason">
                  <el-option v-for="r in TRANSFER_REASON" :key="r" :label="r" :value="r" />
                </el-select>
              </div>
              <div class="field">
                <label class="req">转住院方式</label>
                <el-select v-model="form.way">
                  <el-option v-for="w in TRANSFER_WAY" :key="w" :label="w" :value="w" />
                </el-select>
              </div>
              <div class="field">
                <label>原住院类型</label>
                <el-input v-model="form.fromType" disabled />
              </div>
              <div class="field">
                <label>变更后类型</label>
                <el-input v-model="form.toType" disabled />
              </div>
              <div class="field">
                <label class="req">转住院日期</label>
                <el-input v-model="form.date" />
              </div>
              <div class="field">
                <label>转入病区</label>
                <el-select v-model="form.ward">
                  <el-option v-for="w in wards" :key="w" :label="w" :value="w" />
                </el-select>
              </div>
              <div class="field">
                <label>床位</label>
                <el-input v-model="form.bed" />
              </div>
              <div class="field">
                <label>主诊医师</label>
                <el-input v-model="form.doc" disabled />
              </div>
            </div>

            <div style="margin-top: 12px">
              <div class="hint" style="margin-bottom: 6px">转住院说明（病程记录）</div>
              <el-input v-model="form.note" type="textarea" :rows="3" resize="none" />
            </div>

            <div style="margin-top: 12px">
              <div class="hint" style="margin-bottom: 6px">告知与签名</div>
              <div class="form-grid">
                <div class="field">
                  <label>告知对象</label>
                  <el-select v-model="form.target">
                    <el-option v-for="t in targets" :key="t" :label="t" :value="t" />
                  </el-select>
                </div>
                <div class="field">
                  <label>告知方式</label>
                  <el-select v-model="form.consent">
                    <el-option v-for="c in consents" :key="c" :label="c" :value="c" />
                  </el-select>
                </div>
                <div class="field">
                  <label>医师签名</label>
                  <el-input v-model="form.sign" />
                </div>
              </div>
            </div>

            <el-alert type="info" :closable="false" show-icon style="margin-top: 12px">
              转换完成后患者按普通住院流程管理：专项储值金、已发生的检查检验费用、转普通住院记录同步流转；日间手术路径自动终止并写入退出记录。
            </el-alert>
          </el-form>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="当前住院信息" tight>
          <table class="tb-plain">
            <tbody>
              <tr v-for="s in stay" :key="s.k">
                <td style="width: 96px; color: #7b8fa3">{{ s.k }}</td>
                <td :class="{ mono: s.mono }">
                  <TagBox v-if="s.tag" :text="s.tag" :tone="s.tone" />
                  <span v-if="s.text" style="margin-left: 4px">{{ s.text }}</span>
                  <template v-else>{{ s.v }}</template>
                </td>
              </tr>
            </tbody>
          </table>
        </SectionCard>

        <SectionCard title="转普通住院影响">
          <div style="display: flex; flex-direction: column; gap: 9px; font-size: 12.5px">
            <div
              v-for="(im, i) in impacts"
              :key="i"
              style="display: flex; gap: 8px; align-items: flex-start"
            >
              <span style="color: #0f9d63; margin-top: 1px"><IconSvg name="ok" :size="13" /></span>
              <div>{{ im }}</div>
            </div>
          </div>
          <div
            class="hint"
            style="margin-top: 10px; border-top: 1px dashed var(--line); padding-top: 9px"
          >
            字典维护：转住院原因 {{ TRANSFER_REASON.length }} 项、转住院方式 {{ TRANSFER_WAY.length }} 项，由系统管理员在【参数配置 · 字典管理】中维护
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
  padding: 8px 14px;
  border-bottom: 1px solid #eef2f7;
  color: #33475c;
}
.tb-plain tr:last-child td {
  border-bottom: none;
}
</style>
