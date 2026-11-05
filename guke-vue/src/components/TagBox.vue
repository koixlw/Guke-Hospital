<script setup>
import { computed } from 'vue'
import { statusType, toneToTagType } from '@/utils/format'

/** 统一标签：传 text 自动映射语义色，传 tone 直接指定 */
const props = defineProps({
  text: { type: String, required: true },
  tone: { type: String, default: '' },
  solid: { type: Boolean, default: false }
})

const type = computed(() => (props.tone ? toneToTagType(props.tone) : statusType(props.text)))
</script>

<template>
  <el-tag
    :type="type"
    :effect="solid ? 'dark' : 'plain'"
    size="small"
    class="tag-box"
    :class="{ 'tag-teal': tone === 't' }"
  >
    {{ text }}
  </el-tag>
</template>

<style scoped>
.tag-box {
  border-radius: 3px;
  font-weight: 400;
  height: 20px;
  padding: 0 7px;
  font-size: 11.5px;
  line-height: 1;
}
</style>
