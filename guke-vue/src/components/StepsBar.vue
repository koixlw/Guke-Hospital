<script setup>
/** 步骤条：current 之前为已完成，current 为进行中 */
defineProps({
  items: { type: Array, required: true },
  current: { type: Number, default: 0 }
})
</script>

<template>
  <div class="steps">
    <div
      v-for="(s, i) in items"
      :key="s"
      class="step"
      :class="{ done: i < current, cur: i === current }"
    >
      <div class="cir">{{ i < current ? '✓' : i + 1 }}</div>
      <div class="nm">{{ s }}</div>
    </div>
  </div>
</template>
