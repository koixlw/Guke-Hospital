<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import InfoList from '@/components/InfoList.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'
import { useAuth } from '@/store/auth'
import { ROLE_DEFS } from '@/data/permissions'
import { FAIL_REASON, QUIT_REASON, TRANSFER_REASON, TRANSFER_WAY } from '@/data/demo'

const auth = useAuth()
const { role } = auth

/* ================= 参数分类 ================= */
const CATEGORIES = ['业务参数', '麻醉评估流程', '字典管理', '角色权限', '短信模板']
const activeCat = ref('业务参数')

/* ================= 业务参数 ================= */
const params = ref([
  { nm: '入院前通知提前天数', v: '1', unit: ' 天', bold: true, desc: '默认提前 1 天自动发送入院通知短信' },
  { nm: '口服抗凝剂停药天数', v: '7', unit: ' 天', bold: true, desc: '停药不足该天数自动拦截日间手术申请' },
  { nm: '入院前通知发送时间', v: '16:00', unit: '', bold: true, desc: '定时任务每日执行时间' },
  { nm: '预约成功短信发送时机', v: '预约完成时', unit: '', bold: false, desc: '可配置为预约完成时或次日 09:00' },
  { nm: '手术安排一致性校验', v: '开启', unit: '', bold: false, desc: '安排与预约不一致时自动生成通知待办' },
  { nm: '短信失败重试次数', v: '2', unit: ' 次', bold: false, desc: '失败后转人工电话通知并留痕' }
])

/* 修改参数弹窗 */
const editVisible = ref(false)
const editTarget = ref(null)
const editValue = ref('')

const openEdit = (row) => {
  editTarget.value = row
  editValue.value = row.v
  editVisible.value = true
}

const saveEdit = () => {
  if (editTarget.value) {
    editTarget.value.v = editValue.value
    ElMessage.success(`参数「${editTarget.value.nm}」已修改为 ${editValue.value}${editTarget.value.unit}，即时生效`)
  }
  editVisible.value = false
}

/* ================= 麻醉评估流程配置 ================= */
const anesFlow = ref([
  { seq: 1, stage: '术前访视', role: '护士 / 医师', req: '6 项', fields: '生命体征、过敏史、既往史、用药史' },
  { seq: 2, stage: '气道评估', role: '麻醉医师', req: '4 项', fields: 'Mallampati 分级、张口度、甲颏距离、颈椎活动度' },
  { seq: 3, stage: '麻醉风险分级', role: '麻醉医师', req: '3 项', fields: 'ASA 分级、合并症、麻醉计划' },
  { seq: 4, stage: '评估结论', role: '麻醉医师', req: '必填', fields: '通过 / 不通过、原因' }
])

/* 环节配置弹窗 */
const flowVisible = ref(false)
const flowTarget = ref(null)
const flowForm = reactive({ stage: '', role: '', req: '', fields: '', enabled: true })

const openFlow = (row) => {
  flowTarget.value = row
  flowForm.stage = row.stage
  flowForm.role = row.role
  flowForm.req = row.req
  flowForm.fields = row.fields
  flowForm.enabled = true
  flowVisible.value = true
}

const saveFlow = () => {
  if (flowTarget.value) {
    Object.assign(flowTarget.value, {
      stage: flowForm.stage,
      role: flowForm.role,
      req: flowForm.req,
      fields: flowForm.fields
    })
    ElMessage.success(`评估环节「${flowForm.stage}」已配置，保存后即时生效`)
  }
  flowVisible.value = false
}

const addFlow = () => {
  anesFlow.value.push({
    seq: anesFlow.value.length + 1,
    stage: '新增环节',
    role: '麻醉医师',
    req: '—',
    fields: '待配置'
  })
  ElMessage.success('已新增评估环节，请点击「配置」完善表单字段')
}

/* ================= 字典管理 ================= */
const dicts = ref([
  { key: '退出日间手术原因', items: [...QUIT_REASON] },
  { key: '转普通住院原因', items: [...TRANSFER_REASON] },
  { key: '转普通住院方式', items: [...TRANSFER_WAY] },
  { key: '评估未通过常见原因', items: [...FAIL_REASON] }
])

const dictAdd = reactive({ key: '退出日间手术原因', text: '' })

const addDictItem = () => {
  const d = dicts.value.find((x) => x.key === dictAdd.key)
  if (!d) return
  const v = dictAdd.text.trim()
  if (!v) {
    ElMessage.warning('请先填写字典项内容')
    return
  }
  if (d.items.includes(v)) {
    ElMessage.warning('该字典项已存在')
    return
  }
  d.items.push(v)
  dictAdd.text = ''
  ElMessage.success(`字典「${d.key}」已新增「${v}」`)
}

const removeDictItem = (dict, item) => {
  dict.items = dict.items.filter((x) => x !== item)
  ElMessage.success(`字典项「${item}」已删除`)
}

/* ================= 角色权限（RBAC） ================= */
const roles = computed(() =>
  Object.entries(ROLE_DEFS).map(([key, r]) => ({
    key,
    role: r.name,
    mods: r.modules.length + ' 个模块',
    scope: r.scope,
    desc: r.desc,
    actions: r.actions.length
  }))
)

/* 权限矩阵：角色 × 模块 */
const MATRIX_MODULES = [
  { k: 'dash', t: '工作台' },
  { k: 'apply', t: '申请' },
  { k: 'pay', t: '缴费' },
  { k: 'exam', t: '检查' },
  { k: 'spec', t: '专科评估' },
  { k: 'anes', t: '麻醉评估' },
  { k: 'booking', t: '预约' },
  { k: 'notify', t: '通知' },
  { k: 'admit', t: '入院登记' },
  { k: 'transfer', t: '转住院' },
  { k: 'schedule', t: '安排' },
  { k: 'checkin', t: '登记' },
  { k: 'fee', t: '费用' },
  { k: 'order', t: '医嘱' },
  { k: 'manage', t: '管理' },
  { k: 'query', t: '查询' },
  { k: 'quit', t: '退出' },
  { k: 'config', t: '配置' }
]

const matrix = computed(() =>
  Object.entries(ROLE_DEFS).map(([key, r]) => ({
    key,
    role: r.name,
    cells: MATRIX_MODULES.map((m) => r.modules.includes(m.k))
  }))
)

/* ================= 短信模板 ================= */
const templates = ref([
  {
    nm: '手术预约成功通知',
    biz: '预约通知',
    ch: '【四川省骨科医院】{患者姓名}您好，您的手术已预约成功：{手术日期}（{时段}），{手术科室} · 主刀：{术者}，手术间：{术间}，麻醉方式：{麻醉方式}。请按时到院。',
    on: true
  },
  {
    nm: '入院前通知',
    biz: '入院前通知',
    ch: '【四川省骨科医院】{患者姓名}您好，您预约的{手术名称}将于{手术日期} {手术时间}进行，请于{通知时间}前到住院部一楼日间手术中心办理入院手续，入院前请空腹 8 小时，携带身份证、医保卡及既往检查资料。',
    on: true
  },
  {
    nm: '手术安排变动通知',
    biz: '手术安排',
    ch: '【四川省骨科医院】{患者姓名}您好，您的手术时间由{原时间}调整为{新时间}，手术室调整为{新术间}，请知悉。',
    on: true
  },
  {
    nm: '报到提醒',
    biz: '入院前通知',
    ch: '【四川省骨科医院】{患者姓名}您好，请于今日 {提醒时间} 前完成住院登记，未按时报到将取消当日手术安排。',
    on: false
  }
])

const tplVisible = ref(false)
const tplTarget = ref(null)
const tplForm = reactive({ nm: '', ch: '' })

const openTpl = (t) => {
  tplTarget.value = t
  tplForm.nm = t.nm
  tplForm.ch = t.ch
  tplVisible.value = true
}

const saveTpl = () => {
  if (tplTarget.value) {
    tplTarget.value.nm = tplForm.nm
    tplTarget.value.ch = tplForm.ch
    ElMessage.success(`短信模板「${tplForm.nm}」已保存并即时生效`)
  }
  tplVisible.value = false
}

const toggleTpl = (t) => {
  t.on = !t.on
  ElMessage.success(`模板「${t.nm}」已${t.on ? '启用' : '停用'}`)
}

/* ================= 配置变更记录 ================= */
const changes = ref([
  { t1: '入院前提前通知天数 2 → 1', t2: '系统管理员 · 2026-10-20 09:12' },
  { t1: '麻醉评估流程新增「气道评估」环节', t2: '系统管理员 · 2026-10-18 15:40' }
])

const saveAll = () => {
  changes.value.unshift({
    t1: `保存参数配置（${CATEGORIES.find((c) => c === activeCat.value)}）`,
    t2: `系统管理员 · 刚刚`
  })
  ElMessage.success('参数配置已保存并即时生效')
}

const resetAll = async () => {
  try {
    await ElMessageBox.confirm('确认还原全部参数配置为系统默认值？', '还原默认', {
      confirmButtonText: '还原',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }
  ElMessage.success('已还原为系统默认配置')
}

const catStyle = (c) => ({
  padding: '8px 10px',
  borderRadius: '5px',
  fontSize: '12.5px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
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
        <el-button size="small" @click="resetAll">
          <IconSvg name="refresh" :size="13" />还原默认
        </el-button>
        <el-button v-perm="'config:save'" type="primary" size="small" @click="saveAll">
          <IconSvg name="save" :size="13" />保存配置
        </el-button>
      </template>
    </PageHeader>

    <el-alert v-if="!auth.can('config:save')" type="info" :closable="false" show-icon style="margin-bottom: 12px">
      <template #title>当前角色「{{ role?.name }}」为只读访问，仅系统管理员可修改并保存配置</template>
    </el-alert>

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
              <IconSvg
                :name="c === '业务参数' ? 'cog' : c === '麻醉评估流程' ? 'syringe' : c === '字典管理' ? 'list' : c === '角色权限' ? 'lock' : 'sms'"
                :size="13"
              />
              {{ c }}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="配置变更记录">
          <InfoList :items="changes" flat />
        </SectionCard>
      </div>

      <div>
        <!-- 业务参数 -->
        <SectionCard v-if="activeCat === '业务参数'" title="业务参数" tight>
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
              <template #default="{ row }">
                <span class="link" @click="openEdit(row)">修改</span>
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>

        <!-- 麻醉评估流程 -->
        <SectionCard v-else-if="activeCat === '麻醉评估流程'" title="麻醉评估流程配置" tight>
          <template #right>
            <span class="link" @click="addFlow">+ 新增环节</span>
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
              <template #default="{ row }">
                <span class="link" @click="openFlow(row)">配置</span>
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>

        <!-- 字典管理 -->
        <SectionCard v-else-if="activeCat === '字典管理'" title="字典管理" tight>
          <template #right>退出原因 / 转住院原因 / 转住院方式 / 评估未通过原因</template>
          <el-table :data="dicts" style="width: 100%">
            <el-table-column prop="key" label="字典名称" width="180" />
            <el-table-column label="字典项" min-width="300">
              <template #default="{ row }">
                <span
                  v-for="it in row.items"
                  :key="it"
                  class="dict-chip"
                >
                  {{ it }}
                  <i class="x" @click="removeDictItem(row, it)">×</i>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="项数" width="60" align="center">
              <template #default="{ row }">{{ row.items.length }}</template>
            </el-table-column>
          </el-table>

          <div style="display: flex; gap: 8px; align-items: center; margin-top: 12px; padding-top: 11px; border-top: 1px dashed var(--line)">
            <div class="field" style="flex: 0 0 auto">
              <label style="flex: 0 0 62px">所属字典</label>
              <el-select v-model="dictAdd.key" style="width: 180px" size="small">
                <el-option v-for="d in dicts" :key="d.key" :label="d.key" :value="d.key" />
              </el-select>
            </div>
            <div class="field" style="flex: 1">
              <label style="flex: 0 0 62px">字典项</label>
              <el-input
                v-model="dictAdd.text"
                placeholder="输入新增字典项"
                size="small"
                @keyup.enter="addDictItem"
              />
            </div>
            <el-button type="primary" size="small" @click="addDictItem">
              <IconSvg name="plus" :size="13" />新增
            </el-button>
          </div>
        </SectionCard>

        <!-- 角色权限 -->
        <SectionCard v-else-if="activeCat === '角色权限'" title="角色权限（RBAC）" tight>
          <template #right>最小权限原则 · 患者数据按科室隔离</template>
          <el-table :data="roles" style="width: 100%">
            <el-table-column prop="role" label="角色" width="150" />
            <el-table-column prop="desc" label="职责说明" min-width="240" show-overflow-tooltip />
            <el-table-column prop="mods" label="可访问模块" width="100" align="center" />
            <el-table-column prop="actions" label="可执行操作" width="100" align="center" />
            <el-table-column prop="scope" label="数据权限" width="180" />
          </el-table>

          <div class="hint" style="margin: 14px 0 7px">权限矩阵（● = 可见该模块）</div>
          <div class="matrix-wrap">
            <table class="matrix">
              <thead>
                <tr>
                  <th class="role-col">角色</th>
                  <th v-for="m in MATRIX_MODULES" :key="m.k">{{ m.t }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in matrix" :key="r.key">
                  <td class="role-col">{{ r.role }}</td>
                  <td v-for="(c, i) in r.cells" :key="i" :class="{ on: c }">
                    {{ c ? '●' : '' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>

        <!-- 短信模板 -->
        <SectionCard v-else title="短信模板" tight>
          <template #right>模板变量在发送时自动替换</template>
          <el-table :data="templates" style="width: 100%">
            <el-table-column prop="nm" label="模板名称" width="170" />
            <el-table-column prop="biz" label="适用业务" width="110" />
            <el-table-column prop="ch" label="模板内容" min-width="300" show-overflow-tooltip />
            <el-table-column label="状态" width="70" align="center">
              <template #default="{ row }">
                <TagBox :text="row.on ? '已启用' : '已停用'" :tone="row.on ? 'g' : 'gy'" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110" align="center">
              <template #default="{ row }">
                <span class="link" @click="openTpl(row)">编辑</span> ·
                <span class="link" @click="toggleTpl(row)">{{ row.on ? '停用' : '启用' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>
      </div>
    </div>

    <!-- 修改参数 -->
    <el-dialog v-model="editVisible" title="修改业务参数" width="440px">
      <el-form label-width="120px" label-position="left">
        <el-form-item label="参数名称">{{ editTarget?.nm }}</el-form-item>
        <el-form-item label="当前值">{{ editTarget?.v }}{{ editTarget?.unit }}</el-form-item>
        <el-form-item label="新值">
          <el-input v-model="editValue" style="width: 160px" />
          <span v-if="editTarget?.unit" class="hint" style="margin-left: 8px">{{ editTarget?.unit }}</span>
        </el-form-item>
        <el-form-item label="说明">{{ editTarget?.desc }}</el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="editVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="saveEdit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 配置评估环节 -->
    <el-dialog v-model="flowVisible" title="配置评估环节" width="520px">
      <el-form label-width="96px" label-position="left">
        <el-form-item label="环节名称">
          <el-input v-model="flowForm.stage" style="width: 260px" />
        </el-form-item>
        <el-form-item label="执行角色">
          <el-input v-model="flowForm.role" style="width: 260px" />
        </el-form-item>
        <el-form-item label="必填项">
          <el-input v-model="flowForm.req" style="width: 260px" />
        </el-form-item>
        <el-form-item label="表单字段">
          <el-input v-model="flowForm.fields" type="textarea" :rows="2" resize="none" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="flowVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="saveFlow">保存</el-button>
      </template>
    </el-dialog>

    <!-- 编辑短信模板 -->
    <el-dialog v-model="tplVisible" title="编辑短信模板" width="600px">
      <el-form label-width="80px" label-position="left">
        <el-form-item label="模板名称">
          <el-input v-model="tplForm.nm" style="width: 320px" />
        </el-form-item>
        <el-form-item label="模板内容">
          <el-input v-model="tplForm.ch" type="textarea" :rows="5" resize="none" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="tplVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="saveTpl">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.dict-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: #1a5c9e;
  background: var(--blue-bg);
  border: 1px solid #cfe0f5;
  border-radius: 3px;
  padding: 1px 4px 1px 7px;
  margin: 2px 6px 2px 0;
}
.dict-chip .x {
  cursor: pointer;
  font-style: normal;
  color: #7fa6c9;
  padding: 0 2px;
}
.dict-chip .x:hover {
  color: var(--red);
}
.matrix-wrap {
  overflow-x: auto;
  padding-bottom: 4px;
}
.matrix {
  border-collapse: collapse;
  font-size: 11px;
  white-space: nowrap;
}
.matrix th,
.matrix td {
  border: 1px solid #eef2f7;
  padding: 5px 4px;
  text-align: center;
  color: #8a99ab;
}
.matrix th {
  background: #f5f8fc;
  color: #5b6b7f;
  font-weight: 600;
}
.matrix .role-col {
  text-align: left;
  padding-left: 9px;
  font-weight: 600;
  color: #33475c;
}
.matrix td.on {
  color: #1b6fc4;
  font-size: 13px;
}
</style>
