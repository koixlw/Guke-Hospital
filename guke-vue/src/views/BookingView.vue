<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import MiniStat from '@/components/MiniStat.vue'
import IconSvg from '@/components/IconSvg.vue'
import { CUR, DOCTORS, SMS } from '@/data/demo'

/* 手术预约表单 */
const form = reactive({
  date: '2026-11-03',
  slot: '10:00 — 11:30',
  room: '门诊手术室 2 间',
  order: '第 2 台',
  surgeon: CUR.doc,
  anesDoctor: '周文斌'
})

/* 短信模板（可编辑） */
const template = ref(
  '【四川省骨科医院】{患者姓名}您好，您的手术已预约成功：{手术日期}（{时段}），{手术科室} · 主刀：{术者}，手术间：{术间}，麻醉方式：{麻醉方式}。请按时到院。'
)
const tplVisible = ref(false)

/* 发送记录（本地副本） */
const smsRows = ref(SMS.slice(0, 6).map((s) => ({ ...s })))

/* 完成预约 */
const booked = ref(false)
const doBook = () => {
  booked.value = true
  smsRows.value.unshift({
    tm: '2026-11-02 11:05',
    to: '138****7261',
    typ: '预约成功',
    content: `【四川省骨科医院】${CUR.name}您好，您的手术已预约成功：${form.date}（${form.slot}），${CUR.dept} · 主刀：${form.surgeon}，手术间：${form.room}。请按时到院。`,
    status: '已送达'
  })
  ElMessage.success('预约已完成，预约成功短信已发送')
}

/* 发送记录详情 */
const detailVisible = ref(false)
const detailRow = ref(null)
const openDetail = (row) => {
  detailRow.value = row
  detailVisible.value = true
}

/* 重发 */
const resend = (row) => {
  row.status = '已送达'
  ElMessage.success(`已重新向 ${row.to} 发送「${row.typ}」短信`)
}

const toast = (m) => ElMessage.success(m)
</script>

<template>
  <div>
    <PageHeader
      title="预约通知"
      sub="手术预约完成即自动发送预约成功短信 · 模板后台可配置 · 发送记录全量留痕"
    >
      <template #actions>
        <el-button size="small" @click="tplVisible = true">
          <IconSvg name="cog" :size="13" />短信模板配置
        </el-button>
        <el-button v-perm="'booking:create'" type="primary" size="small" @click="doBook">
          <IconSvg name="sms" :size="13" />完成预约并发送短信
        </el-button>
      </template>
    </PageHeader>

    <PatientBand>
      <template #extra>
        <TagBox v-if="booked" text="已预约" tone="g" />
        <TagBox v-else text="待预约" tone="o" />
      </template>
    </PatientBand>

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <SectionCard title="手术预约">
          <div class="form-grid">
            <div class="field">
              <label class="req">手术日期</label>
              <el-input v-model="form.date" />
            </div>
            <div class="field">
              <label class="req">手术时段</label>
              <el-select v-model="form.slot">
                <el-option label="08:30 — 10:00" value="08:30 — 10:00" />
                <el-option label="10:00 — 11:30" value="10:00 — 11:30" />
                <el-option label="13:30 — 15:00" value="13:30 — 15:00" />
              </el-select>
            </div>
            <div class="field">
              <label class="req">手术间</label>
              <el-select v-model="form.room">
                <el-option label="门诊手术室 1 间" value="门诊手术室 1 间" />
                <el-option label="门诊手术室 2 间" value="门诊手术室 2 间" />
                <el-option label="门诊手术室 3 间" value="门诊手术室 3 间" />
              </el-select>
            </div>
            <div class="field">
              <label>台次</label>
              <el-input v-model="form.order" />
            </div>
            <div class="field">
              <label>术者</label>
              <el-select v-model="form.surgeon">
                <el-option v-for="d in DOCTORS" :key="d" :label="d" :value="d" />
              </el-select>
            </div>
            <div class="field">
              <label>麻醉医师</label>
              <el-select v-model="form.anesDoctor">
                <el-option label="周文斌" value="周文斌" />
                <el-option label="王海涛" value="王海涛" />
              </el-select>
            </div>
          </div>
          <div class="hint" style="margin-top: 11px">
            <IconSvg name="info" :size="12" />
            预约保存后系统按模板自动向患者手机号 138****7261 发送预约成功短信，默认在预约完成时发送
          </div>
        </SectionCard>

        <SectionCard title="短信内容预览（模板：手术预约成功通知）">
          <div class="phone">
            <div class="sms-bubble">
              <div class="h">
                <span style="color: #0aa2a2">【四川省骨科医院】</span>
                <span style="margin-left: auto">106****8899</span>
              </div>
              王建国您好，您的手术已预约成功：<br />
              手术日期：2026 年 11 月 3 日（周二）10:00—11:30<br />
              手术科室：关节外科 · 主刀：李国栋<br />
              手术间：门诊手术室 2 间 · 麻醉方式：椎管内麻醉<br />
              请于 11 月 2 日 14:00 前到住院部一楼日间手术中心办理入院，术前禁食 8 小时，携带身份证、医保卡。如有疑问请致电
              028-65238736。
            </div>
            <div style="display: flex; gap: 8px; margin-top: 10px; align-items: center">
              <span class="hint">模板变量：{患者姓名} {手术日期} {时段} {术间} {术者} {麻醉方式}</span>
              <span style="margin-left: auto">
                <el-button size="small" @click="tplVisible = true">编辑模板</el-button>
              </span>
            </div>
          </div>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="短信发送记录" tight>
          <template #right>今日 {{ smsRows.length }} 条</template>
          <el-table :data="smsRows" style="width: 100%">
            <el-table-column prop="tm" label="发送时间" width="104" class-name="num" />
            <el-table-column prop="to" label="接收号码" width="96" />
            <el-table-column label="类型" width="104">
              <template #default="{ row }">
                <TagBox :text="row.typ" :tone="row.typ === '预约成功' ? 'b' : 't'" />
              </template>
            </el-table-column>
            <el-table-column label="状态" width="72" align="center">
              <template #default="{ row }">
                <TagBox :text="row.status" :tone="row.status === '已送达' ? 'g' : 'r'" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="64" align="center">
              <template #default="{ row }">
                <span class="link" @click="row.status === '已送达' ? openDetail(row) : resend(row)">
                  {{ row.status === '已送达' ? '详情' : '重发' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>

        <SectionCard title="发送统计">
          <div style="display: flex; gap: 10px; margin-bottom: 10px">
            <MiniStat label="预约成功短信" :value="24" tone="good" />
            <MiniStat label="入院前通知" :value="13" tone="warn" />
            <MiniStat label="发送失败" :value="2" tone="bad" />
          </div>
          <div class="hint" style="line-height: 1.9">
            短信平台：中国移动云 MAS · 网关正常<br />
            失败自动重试 2 次，仍失败转人工电话通知并留痕
          </div>
        </SectionCard>
      </div>
    </div>

    <!-- 短信模板配置 -->
    <el-dialog v-model="tplVisible" title="短信模板配置 · 手术预约成功通知" width="620px">
      <div class="hint" style="margin-bottom: 8px">
        模板变量：{患者姓名} {手术日期} {时段} {术间} {术者} {麻醉方式} {手术科室} {麻醉方式}
      </div>
      <el-input v-model="template" type="textarea" :rows="6" resize="none" />
      <template #footer>
        <el-button size="small" @click="tplVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="tplVisible = false; toast('短信模板已保存并即时生效')">
          保存模板
        </el-button>
      </template>
    </el-dialog>

    <!-- 发送记录详情 -->
    <el-dialog v-model="detailVisible" title="短信发送详情" width="520px">
      <table v-if="detailRow" class="tb-plain">
        <tbody>
          <tr>
            <td style="width: 82px; color: #7b8fa3">发送时间</td>
            <td class="num">{{ detailRow.tm }}</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">接收号码</td>
            <td class="num">{{ detailRow.to }}</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">类型</td>
            <td>{{ detailRow.typ }}</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">状态</td>
            <td><TagBox :text="detailRow.status" :tone="detailRow.status === '已送达' ? 'g' : 'r'" /></td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">短信内容</td>
            <td style="line-height: 1.8">{{ detailRow.content }}</td>
          </tr>
        </tbody>
      </table>
      <template #footer>
        <el-button size="small" @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" size="small" @click="detailVisible = false; resend(detailRow)">重新发送</el-button>
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
