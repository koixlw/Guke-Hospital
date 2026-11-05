<script setup>
import TagBox from './TagBox.vue'

/** 列表行：items = [{ t1, t2, tag, tone }] */
defineProps({
  items: { type: Array, required: true },
  flat: { type: Boolean, default: false }
})
</script>

<template>
  <div>
    <div
      v-for="(it, i) in items"
      :key="i"
      class="list-row"
      :style="flat ? { paddingLeft: 0, paddingRight: 0, borderBottom: i === items.length - 1 ? 'none' : '' } : {}"
    >
      <div>
        <div class="t1">{{ it.t1 }}</div>
        <div v-if="it.t2" class="t2">{{ it.t2 }}</div>
      </div>
      <div v-if="it.right || it.tag" class="rt">
        <slot name="right" :item="it" :index="i">
          <TagBox v-if="it.tag" :text="it.tag" :tone="it.tone" />
        </slot>
      </div>
    </div>
  </div>
</template>
