<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import InfoList from '@/components/InfoList.vue'
import IconSvg from '@/components/IconSvg.vue'

/* 参数分类 */
const CATEGORIES = ['业务参数', '麻醉评估流程', '字典管理', '角色权限', '短信模板']
const activeCat = ref('业务参数')

/* 业务参数 */
const params = [
  { nm: '入院前通知提前天数', v: '1', unit: ' 天', bold: true, desc: '默认提前 1 天自动发送入院通知短信' },
  { nm: '口服抗凝剂停药天数', v: '7', unit: ' 天', bold: true, desc: '停药不足该天数自动拦截日间手术申请' },
  { nm: '入院前通知发送时间', v: '16:00', unit: '', bold: true, desc: '定时任务每日执行时间' },
  { nm: '预约成功短信发送时机', v: '预约完成时', unit: '', bold: false, desc: '可配置为预约完成时或次日 09:00' },
  { nm: '手术安排一致性校验', v: '开启', unit: '', bold: false, desc: '安排与预约不一致时自动生成通知待办' },
  { nm: '短信失败重试次数', v: '2', unit: ' 次', bold: false, desc: '失败后转人工电话通知并留痕' }
]

/* 麻醉评估流程配置 */
const anesFlow = [
  { seq: 1, stage: '术前访视', role: '护士 / 医师', req: '6 项', fields: '生命体征、过敏史、既往史、用药史' },
  { seq: 2, stage: '气道评估', role: '麻醉医师', req: '4 项', fields: 'Mallampati 分级、张口度、甲颏距离、颈椎活动度' },
  { seq: 3, stage: '麻醉风险分级', role: '麻醉医师', req: '3 项', fields: 'ASA 分级、合并症、麻醉计划' },
  { seq: 4, stage: '评估结论', role: '麻醉医师', req: '必填', fields: '通过 / 不通过、原因' }
]

/* 角色权限（RBAC） */
const roles = [
  { role: '门急诊医生', mods: '日间手术申请、专科评估（查看）', scope: '本科室患者' },
  { role: '收费人员', mods: '诊间缴费记账', scope: '全院患者（仅资金数据）' },
  { role: '专科医师 / 麻醉医师', mods: '专科评估、麻醉评估', scope: '本科室患者' },
  { role: '日间手术中心', mods: '预约通知、入院前通知、手术管理、退出日间手术', scope: '全院日间手术患者' },
  { role: '住院登记处 / 护士', mods: '入院登记、手术登记', scope: '本院区患者' },
  { role: '手术室人员', mods: '手术安排、手术费用、手术医嘱、手术管理', scope: '手术患者' },
  { role: '系统管理员', mods: '参数配置、权限管理', scope: '配置数据（不含患者诊疗数据）' }
]

/* 配置变更记录 */
const changes = [
  { t1: '入院前提前通知天数 2 → 1', t2: '系统管理员 · 2026-10-20 09:12' },
  { t1: '麻醉评估流程新增「气道评估」环节', t2: '系统管理员 · 2026-10-18 15:40' }
]

const toast = (m) => ElMessage.success(m)

const catStyle = (c) => ({
  padding: '8px 10px',
  borderRadius: '5px',
  fontSize: '12.5px',
  cursor: 'pointer',
  ...(activeCat.value === c
    ? { background: '#eaf2fd', color: '#155a9e', fontWeight: 600 }
    : { color: '#4a5d73' })
})
</script>

<template>
  <div>
    <PageHeader
      title="参数配置"
      sub="业务参数界面化配置 · 字典管理 · 角色权限 · 配置即时生效，无需二次开发"
    >
      <template #actions>
        <el-button type="primary" size="small" @click="toast('参数配置已保存并即时生效')">
          <IconSvg name="save" :size="13" />保存配置
        </el-button>
      </template>
    </PageHeader>

    <div class="grid g-side-l">
      <div>
        <SectionCard title="参数分类">
          <div style="display: flex; flex-direction: column; gap: 2px">
            <div
              v-for="c in CATEGORIES"
              :key="c"
              :style="catStyle(c)"
              @click="activeCat = c"
            >
              {{ c }}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="配置变更记录">
          <InfoList :items="changes" flat />
        </SectionCard>
      </div>

      <div>
        <SectionCard title="业务参数" tight>
          <template #right>参数修改即时生效</template>
          <el-table :data="params" style="width: 100%">
            <el-table-column prop="nm" label="参数名称" width="210" />
            <el-table-column label="当前值" width="130">
              <template #default="{ row }">
                <b v-if="row.bold">{{ row.v }}</b><template v-else>{{ row.v }}</template>{{ row.unit }}
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="说明" min-width="220" show-overflow-tooltip />
            <el-table-column label="操作" width="64" align="center">
              <template #default>
                <span class="link" @click="toast('参数修改')">修改</span>
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>

        <SectionCard title="麻醉评估流程配置" tight>
          <template #right>
            <span class="link" @click="toast('新增评估环节')">+ 新增环节</span>
          </template>
          <div class="hint" style="margin-bottom: 9px">
            医院可按自身管理要求配置评估环节、评估顺序、表单字段及必填项
          </div>
          <el-table :data="anesFlow" style="width: 100%">
            <el-table-column prop="seq" label="顺序" width="52" align="center" />
            <el-table-column prop="stage" label="评估环节" width="160" />
            <el-table-column prop="role" label="执行角色" width="120" />
            <el-table-column prop="req" label="必填项" width="90" />
            <el-table-column prop="fields" label="表单字段" min-width="220" show-overflow-tooltip />
            <el-table-column label="操作" width="64" align="center">
              <template #default>
                <span class="link" @click="toast('环节配置')">配置</span>
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>

        <SectionCard title="角色权限（RBAC）" tight>
          <template #right>最小权限原则 · 患者数据按科室隔离</template>
          <el-table :data="roles" style="width: 100%">
            <el-table-column prop="role" label="角色" width="170" />
            <el-table-column prop="mods" label="可访问模块" min-width="240" show-overflow-tooltip />
            <el-table-column prop="scope" label="数据权限" width="190" />
          </el-table>
        </SectionCard>
      </div>
    </div>
  </div>
</template>
