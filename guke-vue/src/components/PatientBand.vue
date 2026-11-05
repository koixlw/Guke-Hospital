<script setup>
import { CUR } from '@/data/demo'

/** 患者信息条：各业务页面统一口径 */
const props = defineProps({
  patient: { type: Object, default: () => CUR }
})
</script>

<template>
  <div class="patient-band">
    <div class="pb-avatar">
      <div class="cir">{{ props.patient.name.slice(0, 1) }}</div>
      <span>{{ props.patient.sex }} · {{ props.patient.age }}岁</span>
    </div>
    <div class="pb-main">
      <div class="pb-name">
        {{ props.patient.name }}
        <span class="sub">病历号 {{ props.patient.mrn }}</span>
        <span class="tag t">{{ props.patient.mode }}</span>
        <slot name="extra" />
      </div>
      <div class="pb-kv">
        <span>门诊号 <b>{{ props.patient.opd }}</b></span>
        <span>住院号 <b>{{ props.patient.inp || '—' }}</b></span>
        <span>床位 <b>{{ props.patient.bed || '—' }}</b></span>
        <span>科室 <b>{{ props.patient.dept }}</b></span>
        <span>主诊医师 <b>{{ props.patient.doc }}</b></span>
        <span>诊断 <b>{{ props.patient.diag }}（{{ props.patient.icd }}）</b></span>
      </div>
    </div>
    <div class="pb-side">
      <div style="font-size: 11px; color: #7b8fa3">日间手术申请单号</div>
      <div class="mono" style="font-weight: 700; color: #1a5c9e">{{ props.patient.apply }}</div>
      <div style="font-size: 11px; color: #7b8fa3">业务模式 · {{ props.patient.mode }}</div>
    </div>
  </div>
</template>
