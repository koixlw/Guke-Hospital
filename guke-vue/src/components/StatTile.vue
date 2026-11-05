<script setup>
/**
 * KPI 统计磁贴
 * label · value · unit · delta（说明性副标题）· tone（左侧状态色条）
 */
defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], required: true },
  unit: { type: String, default: '' },
  delta: { type: String, default: '' },
  tone: { type: String, default: '' }
})
</script>

<template>
  <div class="kpi" :class="tone">
    <div class="lb">{{ label }}</div>
    <div class="vl">
      {{ value }}<small v-if="unit">{{ unit }}</small>
    </div>
    <div v-if="delta" class="dt">{{ delta }}</div>
  </div>
</template>
