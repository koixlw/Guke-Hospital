<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 15 }
})

/* 与原演示系统一致的线性图标集（24×24 路径） */
const ICONS = {
  dash: 'M3 12h6V3H3v9zm0 9h6v-7H3v7zm9 0h9V12h-9v9zm0-18v7h9V3h-9z',
  doc: 'M6 2h8l5 5v15H6V2zm8 1.5V8h4.5M9 12h7M9 16h7M9 8h3',
  wallet: 'M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1V7zm0 0V6a2 2 0 0 1 2-2h11M17 13.5h2',
  check: 'M9 11l3 3 7-7M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  steth: 'M6 3v6a5 5 0 0 0 10 0V3M4 3h4M14 3h4M11 14v3a4 4 0 0 0 8 0v-2M19 11a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  syringe: 'M18 2l4 4M17 3l4 4-9 9-4-4 9-9zM8 12l-5 5v4h4l5-5M14 8l2 2',
  sms: 'M4 4h16v12H8l-4 4V4zM8 9h8M8 12h5',
  bell: 'M12 3a5 5 0 0 0-5 5v4l-2 3h14l-2-3V8a5 5 0 0 0-5-5zM10 18a2 2 0 0 0 4 0',
  hosp: 'M4 21V8l8-5 8 5v13M9 21v-5h6v5M12 8v4M10 10h4',
  swap: 'M4 8h13l-3-3M20 16H7l3 3',
  cal: 'M4 6h16v15H4V6zM4 10h16M9 3v4M15 3v4',
  barcode: 'M3 6h2v12H3V6zm3 0h1v12H6V6zm2 0h2v12H8V6zm3 0h1v12h-1V6zm2 0h2v12h-2V6zm3 0h1v12h-1V6z',
  receipt: 'M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3zM9 8h6M9 12h6',
  rx: 'M7 3v18M7 3h6a4 4 0 0 1 0 8H7M14 11l5 10',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  exit: 'M14 4H5v16h9M18 8l4 4-4 4M22 12H9',
  cog: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 15a1.6 1.6 0 0 1 0-4 1.6 1.6 0 0 0 .3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 4.6V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 21 11a1.6 1.6 0 0 1 0 4z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  plus: 'M12 5v14M5 12h14',
  print: 'M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8v-7z',
  save: 'M4 4h12l4 4v12H4V4zM8 4v6h8V4M8 20v-6h8v6',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6',
  warn: 'M12 3l9 16H3l9-16zM12 9v5M12 17h.01',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8h.01M11 12h1v5h1',
  ok: 'M20 6L9 17l-5-5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  money: 'M12 3v18M8 7h6a3 3 0 0 1 0 6H8h7a3 3 0 0 1 0 6H8',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3M17 4h3a1 1 0 0 1 1 1v3M20 17v3a1 1 0 0 1-1 1h-3M7 21H4a1 1 0 0 1-1-1v-3M4 12h16',
  pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  down: 'M12 4v12M7 12l5 5 5-5M4 20h16'
}

const d = computed(() => ICONS[props.name] || ICONS.info)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="d" />
  </svg>
</template>
