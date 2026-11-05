<script setup>
/** 页头：标题 + 说明 + 右侧操作区 */
defineProps({
  title: { type: String, required: true },
  sub: { type: String, default: '' }
})
</script>

<template>
  <div class="page-head">
    <div>
      <div class="page-title">
        <span class="bar" />
        {{ title }}
        <slot name="title-extra" />
      </div>
      <div v-if="sub" class="page-sub">{{ sub }}</div>
    </div>
    <div v-if="$slots.actions" class="page-actions">
      <slot name="actions" />
    </div>
  </div>
</template>
