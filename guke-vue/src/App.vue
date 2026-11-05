<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { NAV, CRUMB, TITLES } from '@/router/index.js'
import { HOSP, ROLES, SYS, TODAY, TOP_TABS } from '@/data/demo'
import IconSvg from '@/components/IconSvg.vue'

const route = useRoute()
const router = useRouter()

const role = ref(ROLES[0])
const activeTop = ref(TOP_TABS[0])

const activeKey = computed(() => {
  const k = route.path.replace(/^\//, '')
  return TITLES[k] ? k : 'dash'
})

const crumb = computed(() => {
  const c = CRUMB[activeKey.value]
  return c ? [c, TITLES[activeKey.value]] : [TITLES[activeKey.value]]
})

const onRoleChange = (v) => {
  role.value = v
  ElMessage.success(`已切换角色：${v}`)
}

const go = (k) => router.push('/' + k)
</script>

<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
            <path d="M12 4v16M4 12h16" />
          </svg>
        </div>
        <div class="brand-txt">
          <b>{{ HOSP }}</b>
          <span>{{ SYS }}</span>
        </div>
      </div>

      <nav class="topbar-mid">
        <div
          v-for="t in TOP_TABS"
          :key="t"
          class="top-tab"
          :class="{ on: activeTop === t }"
          @click="activeTop = t"
        >
          {{ t }}
        </div>
      </nav>

      <div class="top-right">
        <span>业务日期 {{ TODAY }}</span>
        <span class="divider" />
        <el-select
          :model-value="role"
          size="small"
          style="width: 158px"
          class="role-sel"
          @update:model-value="onRoleChange"
        >
          <el-option v-for="r in ROLES" :key="r" :label="r" :value="r" />
        </el-select>
        <span class="divider" />
        <span style="display: flex; align-items: center; gap: 6px">
          <span class="avatar">张</span>张敏
        </span>
      </div>
    </header>

    <div class="body">
      <aside class="sidebar">
        <div v-for="g in NAV" :key="g.g" class="side-group">
          <div class="side-group-title">{{ g.g }}</div>
          <div
            v-for="it in g.items"
            :key="it.k"
            class="side-item"
            :class="{ on: it.k === activeKey }"
            @click="go(it.k)"
          >
            <IconSvg :name="it.i" :size="15" />
            <span>{{ it.t }}</span>
            <span v-if="it.badge" class="side-badge">{{ it.badge }}</span>
          </div>
        </div>
      </aside>

      <main class="main">
        <div class="crumb">
          <template v-for="(c, i) in crumb" :key="c">
            <span v-if="i > 0">/</span>
            <b>{{ c }}</b>
          </template>
        </div>
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.role-sel :deep(.el-select__wrapper) {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: none;
  border-radius: 5px;
  padding: 0 8px;
}
.role-sel :deep(.el-select__selected-item) {
  color: #eaf4ff;
  font-size: 12px;
}
.role-sel :deep(.el-select__caret) {
  color: #cfe2f2;
}
</style>
