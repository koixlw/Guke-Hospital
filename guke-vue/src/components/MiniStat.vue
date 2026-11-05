<script setup>
/** 小型统计块（发送成功 / 失败待重发 等） */
defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], required: true },
  tone: { type: String, default: 'good' }
})
</script>

<template>
  <div class="mini-stat" :class="tone">
    <span class="hint">{{ label }}</span>
    <div class="v">{{ value }}</div>
  </div>
</template>
