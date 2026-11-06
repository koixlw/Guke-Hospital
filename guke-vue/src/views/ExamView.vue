<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import InfoList from '@/components/InfoList.vue'
import IconSvg from '@/components/IconSvg.vue'
import { EXAMS } from '@/data/demo'

/* 接口调用状态（医技系统联通情况） */
const interfaces = [
  { nm: '医技预约系统', st: '已联通' },
  { nm: '医技收费系统', st: '已联通' },
  { nm: 'LIS 检验系统', st: '已联通' },
  { nm: 'PACS 影像系统', st: '已联通' }
]

/* 检查检验项目（本地副本，支持新增） */
const exams = ref(EXAMS.map((e) => ({ ...e })))

/* 接口日志（今日） */
const logs = ref([
  { t1: '预约状态回传', t2: '医技预约系统 · 10:05:12 · 184ms', tag: '成功', tone: 'g' },
  { t1: '检查项目记账 427.00', t2: '医技收费系统 · 10:05:13 · 216ms', tag: '成功', tone: 'g' },
  { t1: '检验报告回传（3 项）', t2: 'LIS · 10:06:40 · 158ms', tag: '成功', tone: 'g' },
  { t1: '检查报告回传（DR）', t2: '医技预约系统 · 14:12:05 · 203ms', tag: '成功', tone: 'g' },
  { t1: 'MRI 报告回传', t2: '医技预约系统 · 09:42:18 · 241ms', tag: '成功', tone: 'g' }
])

const doneCount = computed(() => exams.value.filter((e) => e.status === '报告已回传').length)

/* ---------- 查看报告 ---------- */
const reportVisible = ref(false)
const reportRow = ref(null)
const openReport = (row) => {
  reportRow.value = row
  reportVisible.value = true
}

/* ---------- 新增检查申请 ---------- */
const addVisible = ref(false)
const addForm = reactive({
  nm: '血常规（五分类）',
  cat: '检验',
  sys: 'LIS',
  appt: '2026-11-03 08:20'
})

const openAdd = () => {
  Object.assign(addForm, { nm: '血常规（五分类）', cat: '检验', sys: 'LIS', appt: '2026-11-03 08:20' })
  addVisible.value = true
}

const addExam = () => {
  const nm = addForm.nm.trim()
  if (!nm) {
    ElMessage.warning('请填写检查项目名称')
    return
  }
  exams.value.unshift({
    nm,
    cat: addForm.cat,
    sys: addForm.sys,
    appt: addForm.appt,
    status: '待执行',
    rpt: '—'
  })
  logs.value.unshift({
    t1: `新增检查申请：${nm}`,
    t2: `医技预约系统 · 刚刚 · 已提交`,
    tag: '成功',
    tone: 'g'
  })
  addVisible.value = false
  ElMessage.success(`检查申请「${nm}」已提交至 ${addForm.sys}`)
}

/* ---------- 同步报告 ---------- */
const sync = () => {
  let n = 0
  exams.value.forEach((e) => {
    if (e.status !== '报告已回传') {
      e.status = '报告已回传'
      e.rpt = '2026-11-02 09:40'
      n++
    }
  })
  logs.value.unshift({
    t1: `手动同步报告（${n} 项）`,
    t2: `集成平台 · 刚刚 · 报告已回传`,
    tag: '成功',
    tone: 'g'
  })
  ElMessage.success(n ? `已同步 ${n} 份报告` : '所有报告均已回传，无需同步')
}

const toast = (m) => ElMessage.success(m)
</script>

<template>
  <div>
    <PageHeader
      title="术前检查及预约"
      sub="术前检查检验在门诊完成 · 复用现有医技预约、医技收费系统 · 报告回传关联申请单"
    >
      <template #actions>
        <el-button v-perm="'exam:order'" type="primary" size="small" @click="openAdd">
          <IconSvg name="plus" :size="13" />新增检查申请
        </el-button>
        <el-button size="small" @click="sync">
          <IconSvg name="refresh" :size="13" />同步报告
        </el-button>
      </template>
    </PageHeader>

    <PatientBand />

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <SectionCard title="术前检查检验项目" tight>
          <template #right>{{ doneCount }} / {{ exams.length }} 项已完成 · 报告已回传</template>
          <el-table :data="exams" style="width: 100%">
            <el-table-column label="项目名称" min-width="200" show-overflow-tooltip>
              <template #default="{ row }">
                <b>{{ row.nm }}</b>
                <div class="hint" style="margin-top: 2px">{{ row.cat }} · 来源：{{ row.sys }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="appt" label="预约时间" width="118" class-name="num" />
            <el-table-column label="执行科室" width="112">
              <template #default="{ row }">{{ row.sys === 'LIS' ? '检验科' : '医技预约系统' }}</template>
            </el-table-column>
            <el-table-column label="状态" width="88" align="center">
              <template #default="{ row }">
                <TagBox :text="row.status" :tone="row.status === '报告已回传' ? 'g' : 'o'" />
              </template>
            </el-table-column>
            <el-table-column prop="rpt" label="报告回传" width="118" class-name="num" />
            <el-table-column label="操作" width="72" align="center">
              <template #default="{ row }">
                <span class="link" @click="openReport(row)">查看报告</span>
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="接口调用状态">
          <div style="display: flex; flex-direction: column; gap: 9px">
            <div
              v-for="i in interfaces"
              :key="i.nm"
              style="display: flex; align-items: center; gap: 8px; font-size: 12.5px"
            >
              <span
                style="width: 6px; height: 6px; border-radius: 50%; background: #0f9d63; display: inline-block"
              />
              {{ i.nm }}
              <span style="margin-left: auto"><TagBox :text="i.st" tone="g" /></span>
            </div>
          </div>
          <div
            class="hint"
            style="margin-top: 10px; line-height: 1.8; border-top: 1px dashed var(--line); padding-top: 9px"
          >
            本系统不重复建设医技功能，通过集成平台接口调用现有医技系统完成预约与收费，报告回传后与申请单自动关联。
          </div>
        </SectionCard>

        <SectionCard title="接口日志（今日）" tight>
          <InfoList :items="logs" flat />
        </SectionCard>
      </div>
    </div>

    <!-- 报告详情 -->
    <el-dialog v-model="reportVisible" title="检查检验报告" width="560px">
      <table v-if="reportRow" class="tb-plain">
        <tbody>
          <tr>
            <td style="width: 92px; color: #7b8fa3">项目名称</td>
            <td><b>{{ reportRow.nm }}</b></td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">类别 / 来源</td>
            <td>{{ reportRow.cat }} · {{ reportRow.sys }}</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">预约时间</td>
            <td class="num">{{ reportRow.appt }}</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">报告时间</td>
            <td class="num">{{ reportRow.rpt }}</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">状态</td>
            <td><TagBox :text="reportRow.status" :tone="reportRow.status === '报告已回传' ? 'g' : 'o'" /></td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">报告结论</td>
            <td>
              {{ reportRow.status === '报告已回传' ? '未见明显异常，可作为日间手术术前评估依据。' : '报告尚未回传，请稍后同步。' }}
            </td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">关联申请单</td>
            <td class="mono">DZ20261102007</td>
          </tr>
        </tbody>
      </table>
      <template #footer>
        <el-button size="small" @click="reportVisible = false">关闭</el-button>
        <el-button type="primary" size="small" @click="reportVisible = false; toast('报告已发送至打印')">
          打印报告
        </el-button>
      </template>
    </el-dialog>

    <!-- 新增检查申请 -->
    <el-dialog v-model="addVisible" title="新增检查申请" width="500px">
      <el-form label-width="96px" label-position="left">
        <el-form-item label="项目名称">
          <el-input v-model="addForm.nm" style="width: 260px" placeholder="如：血常规（五分类）" />
        </el-form-item>
        <el-form-item label="类别">
          <el-radio-group v-model="addForm.cat">
            <el-radio value="检验">检验</el-radio>
            <el-radio value="检查">检查</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="来源系统">
          <el-select v-model="addForm.sys" style="width: 200px">
            <el-option label="LIS" value="LIS" />
            <el-option label="医技预约" value="医技预约" />
          </el-select>
        </el-form-item>
        <el-form-item label="预约时间">
          <el-input v-model="addForm.appt" style="width: 200px" />
        </el-form-item>
      </el-form>
      <div class="hint">
        <IconSvg name="info" :size="12" />
        提交后通过集成平台写入医技预约系统，报告回传时自动关联申请单 DZ20261102007。
      </div>
      <template #footer>
        <el-button size="small" @click="addVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="addExam">提交申请</el-button>
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
