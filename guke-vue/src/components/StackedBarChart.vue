<script setup>
import { computed, ref } from 'vue'

/**
 * 堆叠柱状图
 * data: [{ label, s1, s2 }]  ·  series: [{ key, name, color }]
 * 规范：细柱（≤24px）、顶端 4px 圆角、基线直角、段间 2px 表面留白、
 *      双系列必带图例、悬停提示 + 表格视图（数值不依赖颜色单独承载）。
 */
const props = defineProps({
  data: { type: Array, required: true },
  series: { type: Array, required: true },
  height: { type: Number, default: 132 },
  unit: { type: String, default: '' }
})

const hover = ref(null)
const wrapRef = ref(null)
const colRefs = ref([])

const total = (d) => props.series.reduce((a, s) => a + (d[s.key] || 0), 0)
const max = computed(() => Math.max(...props.data.map(total), 1))

/* 为柱顶数值标签预留空间，保证最高柱的标签不被裁切 */
const LABEL_SPACE = 26
const scale = (v) => Math.round((v / max.value) * (props.height - LABEL_SPACE))

const tipStyle = (i) => {
  const wrap = wrapRef.value
  const el = colRefs.value[i]
  if (!wrap || !el) return { display: 'none' }
  const parent = wrap.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  return {
    left: `${r.left - parent.left + r.width / 2}px`,
    top: `${r.top - parent.top - 8}px`
  }
}

const setCol = (el, i) => {
  if (el) colRefs.value[i] = el
}
</script>

<template>
  <div ref="wrapRef" class="viz">
    <!-- 绘图区：底部边框即基线 -->
    <div class="viz-plot" :style="{ height: height + 'px' }">
      <div
        v-for="(d, i) in data"
        :key="d.label"
        :ref="(el) => setCol(el, i)"
        class="viz-col"
        tabindex="0"
        @mouseenter="hover = i"
        @mouseleave="hover = null"
        @focus="hover = i"
        @blur="hover = null"
      >
        <div class="viz-total">{{ total(d) }}</div>
        <div class="viz-stack">
          <div
            v-for="(s, si) in series"
            :key="s.key"
            class="viz-seg"
            :class="si === 0 ? 's1 top' : 's2'"
            :style="{ height: scale(d[s.key] || 0) + 'px' }"
          />
        </div>
      </div>
    </div>

    <!-- 轴标签带 -->
    <div class="viz-axis">
      <div v-for="d in data" :key="d.label" class="viz-x">{{ d.label }}</div>
    </div>

    <div class="viz-legend">
      <span v-for="s in series" :key="s.key">
        <i :style="{ background: s.color }" />{{ s.name }}
      </span>
    </div>

    <div v-if="hover !== null" class="viz-tip" :style="tipStyle(hover)">
      <div class="t">{{ data[hover].label }}</div>
      <div v-for="s in series" :key="s.key" class="r">
        <i :style="{ background: s.color }" />{{ s.name }}<b>{{ data[hover][s.key] }}{{ unit }}</b>
      </div>
      <div class="r" style="border-top: 1px solid rgba(255,255,255,.25); margin-top: 3px; padding-top: 3px">
        合计<b>{{ total(data[hover]) }}{{ unit }}</b>
      </div>
    </div>
  </div>
</template>
