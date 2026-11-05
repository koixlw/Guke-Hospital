<script setup>
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

/* 接口日志（今日） */
const logs = [
  { t1: '预约状态回传', t2: '医技预约系统 · 10:05:12 · 184ms', tag: '成功', tone: 'g' },
  { t1: '检查项目记账 427.00', t2: '医技收费系统 · 10:05:13 · 216ms', tag: '成功', tone: 'g' },
  { t1: '检验报告回传（3 项）', t2: 'LIS · 10:06:40 · 158ms', tag: '成功', tone: 'g' },
  { t1: '检查报告回传（DR）', t2: '医技预约系统 · 14:12:05 · 203ms', tag: '成功', tone: 'g' },
  { t1: 'MRI 报告回传', t2: '医技预约系统 · 09:42:18 · 241ms', tag: '成功', tone: 'g' }
]

const toast = (m) => ElMessage.success(m)
</script>

<template>
  <div>
    <PageHeader
      title="术前检查及预约"
      sub="术前检查检验在门诊完成 · 复用现有医技预约、医技收费系统 · 报告回传关联申请单"
    >
      <template #actions>
        <el-button type="primary" size="small" @click="toast('检查申请已新增')">
          <IconSvg name="plus" :size="13" />新增检查申请
        </el-button>
        <el-button size="small" @click="toast('报告同步完成')">
          <IconSvg name="refresh" :size="13" />同步报告
        </el-button>
      </template>
    </PageHeader>

    <PatientBand />

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <SectionCard title="术前检查检验项目" tight>
          <template #right>7 项全部完成 · 报告已回传</template>
          <el-table :data="EXAMS" style="width: 100%">
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
              <template #default="{ row }"><TagBox :text="row.status" /></template>
            </el-table-column>
            <el-table-column prop="rpt" label="报告回传" width="118" class-name="num" />
            <el-table-column label="操作" width="66" align="center">
              <template #default>
                <span class="link">查看报告</span>
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
  </div>
</template>
