<script setup>
/**
 * 通用卡片容器：与原演示系统 .card 保持一致，可选右上角附加区
 * bare：渲染一条无标题的卡片头（原版 card('', …) 的形态，仅有一条品牌色竖条）
 */
defineProps({
  title: { type: String, default: '' },
  tight: { type: Boolean, default: false },
  bare: { type: Boolean, default: false }
})
</script>

<template>
  <div class="card">
    <div v-if="title || $slots.right || bare" class="card-hd">
      <span v-if="title || bare" class="ico" />
      <span v-if="title">{{ title }}</span>
      <div v-if="$slots.right" class="right">
        <slot name="right" />
      </div>
    </div>
    <div class="card-bd" :class="{ tight }">
      <slot />
    </div>
  </div>
</template>
