<script setup>
import { reactive } from 'vue'
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

const toast = (m) => ElMessage.success(m)
</script>

<template>
  <div>
    <PageHeader
      title="预约通知"
      sub="手术预约完成即自动发送预约成功短信 · 模板后台可配置 · 发送记录全量留痕"
    >
      <template #actions>
        <el-button size="small" @click="toast('短信模板配置已打开')">
          <IconSvg name="cog" :size="13" />短信模板配置
        </el-button>
        <el-button type="primary" size="small" @click="toast('预约已完成，预约成功短信已发送')">
          <IconSvg name="sms" :size="13" />完成预约并发送短信
        </el-button>
      </template>
    </PageHeader>

    <PatientBand />

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
                <el-button size="small" @click="toast('短信模板编辑已打开')">编辑模板</el-button>
              </span>
            </div>
          </div>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="短信发送记录" tight>
          <template #right>今日 39 条</template>
          <el-table :data="SMS.slice(0, 6)" style="width: 100%">
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
            <el-table-column label="操作" width="52" align="center">
              <template #default="{ row }">
                <span class="link">{{ row.status === '已送达' ? '详情' : '重发' }}</span>
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
  </div>
</template>
