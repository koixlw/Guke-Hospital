<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { NAV, CRUMB, TITLES, TOP_TABS } from '@/router/index.js'
import { HOSP, SYS, TODAY } from '@/data/demo'
import { actionLabels, useAuth } from '@/store/auth'
import IconSvg from '@/components/IconSvg.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const { user, role } = auth

/* 顶部业务域页签（点击筛选左侧菜单） */
const ALL_TAB = '全部业务'
const activeTop = ref(ALL_TAB)

const isLoginPage = computed(() => route.path === '/login')

const activeKey = computed(() => {
  const k = route.path.replace(/^\//, '')
  return TITLES[k] ? k : 'dash'
})

const crumb = computed(() => {
  const c = CRUMB[activeKey.value]
  return c ? [c, TITLES[activeKey.value]] : [TITLES[activeKey.value]]
})

/* 有权访问的导航分组 */
const navGroups = computed(() =>
  NAV.map((g) => ({ ...g, items: g.items.filter((i) => auth.hasModule(i.k)) }))
    .filter((g) => g.items.length)
    .filter((g) => !g.tab || activeTop.value === ALL_TAB || g.tab === activeTop.value)
)

/* 可见页签：剔除该业务域下没有任何可访问模块的页签 */
const availableTabs = computed(() =>
  TOP_TABS.filter(
    (t) => t === ALL_TAB || NAV.some((g) => g.tab === t && g.items.some((i) => auth.hasModule(i.k)))
  )
)

/* 每个业务域下可见的模块数 */
const tabCount = (t) => {
  if (t === ALL_TAB) {
    return NAV.reduce((n, g) => n + g.items.filter((i) => auth.hasModule(i.k)).length, 0)
  }
  return NAV.filter((g) => g.tab === t).reduce(
    (n, g) => n + g.items.filter((i) => auth.hasModule(i.k)).length,
    0
  )
}

/* 切换账号后若当前页签已不可见，自动回到「全部业务」 */
watch(
  () => user.value?.u,
  () => {
    if (!availableTabs.value.includes(activeTop.value)) activeTop.value = ALL_TAB
  }
)

const visibleModuleCount = computed(
  () => NAV.reduce((n, g) => n + g.items.filter((i) => auth.hasModule(i.k)).length, 0)
)

/* 「我的权限」弹窗 */
const permVisible = ref(false)
const myPerms = computed(() => (user.value ? actionLabels(user.value.role) : []))

const onCommand = async (cmd) => {
  if (cmd === 'perm') {
    permVisible.value = true
    return
  }
  if (cmd === 'switch') {
    auth.logout()
    ElMessage.info('已退出，请使用其他账号登录以体验不同权限')
    router.replace('/login')
    return
  }
  if (cmd === 'logout') {
    try {
      await ElMessageBox.confirm('确认退出登录？未保存的操作将丢失。', '退出登录', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning'
      })
    } catch {
      return
    }
    auth.logout()
    ElMessage.success('已安全退出')
    router.replace('/login')
  }
}

/* 菜单跳转：失败时给出提示，绝不静默 */
const go = (k) => {
  const target = '/' + k
  router.push(target).catch((err) => {
    /* 跳转到当前路由属于「重复导航」，忽略即可 */
    if (err?.name === 'NavigationDuplicated' || err?.type === 16) return
    console.error('[nav] 跳转失败', target, err)
    ElMessage.error(`无法打开【${TITLES[k] || k}】，请刷新页面后重试`)
  })
}
</script>

<template>
  <!-- 登录页：仅渲染路由出口，不带系统外壳 -->
  <RouterView v-if="isLoginPage" />

  <div v-else class="app">
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
          v-for="t in availableTabs"
          :key="t"
          class="top-tab"
          :class="{ on: activeTop === t }"
          @click="activeTop = t"
        >
          {{ t }}
          <span class="cnt">{{ tabCount(t) }}</span>
        </div>
      </nav>

      <div class="top-right">
        <span>业务日期 {{ TODAY }}</span>
        <span class="divider" />
        <el-dropdown trigger="click" @command="onCommand">
          <span class="user-btn">
            <span class="avatar">{{ user?.name?.slice(0, 1) }}</span>
            <span class="u-info">
              <b>{{ user?.name }}</b>
              <em>{{ user?.title }} · {{ user?.dept }}</em>
            </span>
            <IconSvg name="down" :size="11" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>
                <span class="dd-role">当前角色：{{ role?.name }}</span>
              </el-dropdown-item>
              <el-dropdown-item command="perm">
                <IconSvg name="lock" :size="13" style="margin-right: 6px" />我的权限
              </el-dropdown-item>
              <el-dropdown-item command="switch">
                <IconSvg name="user" :size="13" style="margin-right: 6px" />切换账号
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <IconSvg name="logout" :size="13" style="margin-right: 6px" />退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <div class="body">
      <aside class="sidebar">
        <div v-for="g in navGroups" :key="g.g" class="side-group">
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

        <div class="side-foot">
          <div class="sf-role">当前角色</div>
          <div class="sf-name">{{ role?.name }}</div>
          <div class="sf-meta">可见 {{ visibleModuleCount }} 个模块 · {{ role?.scope }}</div>
        </div>
      </aside>

      <main class="main">
        <div class="crumb">
          <template v-for="(c, i) in crumb" :key="c">
            <span v-if="i > 0">/</span>
            <b>{{ c }}</b>
          </template>
          <span class="crumb-role">
            <IconSvg name="user" :size="11" />
            {{ role?.name }} · {{ user?.name }}
          </span>
        </div>
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <!-- 我的权限 -->
    <el-dialog v-model="permVisible" title="我的权限" width="520px">
      <div class="perm-hd">
        <span class="avatar-lg">{{ user?.name?.slice(0, 1) }}</span>
        <div>
          <div class="perm-name">
            {{ user?.name }}
            <span class="perm-role">{{ role?.name }}</span>
          </div>
          <div class="hint">{{ user?.title }} · {{ user?.dept }} · 数据权限：{{ role?.scope }}</div>
        </div>
      </div>

      <div class="hint" style="margin: 12px 0 6px">可访问模块（菜单 / 路由）</div>
      <div class="perm-mods">
        <span v-for="g in navGroups" :key="g.g" class="perm-mod">
          <b>{{ g.g }}</b>
          <span>{{ g.items.map((i) => i.t).join('、') }}</span>
        </span>
      </div>

      <div class="hint" style="margin: 14px 0 6px">可执行操作</div>
      <div v-if="myPerms.length" class="perm-acts">
        <span v-for="p in myPerms" :key="p.code" class="perm-act">{{ p.label }}</span>
      </div>
      <div v-else class="hint">当前角色为只读角色，无可执行操作。</div>

      <template #footer>
        <el-button size="small" @click="permVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.top-tab .cnt {
  font-size: 10px;
  line-height: 1;
  padding: 1px 4px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.16);
  color: #cfe2f2;
}
.top-tab.on .cnt {
  background: rgba(56, 168, 240, 0.32);
  color: #fff;
}
.user-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  outline: none;
  padding: 3px 4px;
  border-radius: 6px;
}
.user-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.u-info {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.u-info b {
  font-size: 12.5px;
  color: #fff;
  font-weight: 600;
}
.u-info em {
  font-size: 10px;
  font-style: normal;
  color: #9dc4e4;
}
.dd-role {
  font-size: 12px;
  color: #5b6b7f;
}
.side-foot {
  margin-top: auto;
  padding: 10px 12px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.sf-role {
  font-size: 10px;
  color: #6f93b5;
  letter-spacing: 0.6px;
}
.sf-name {
  font-size: 12.5px;
  color: #eaf4ff;
  font-weight: 600;
  margin: 2px 0 3px;
}
.sf-meta {
  font-size: 10.5px;
  color: #7fa6c9;
  line-height: 1.6;
}
.crumb-role {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: #8a99ab;
}
.perm-hd {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--line);
}
.avatar-lg {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #39a3e8, #0f7fd1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex: 0 0 42px;
}
.perm-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--txt);
  display: flex;
  align-items: center;
  gap: 8px;
}
.perm-role {
  font-size: 11px;
  font-weight: 400;
  color: var(--brand);
  background: var(--blue-bg);
  border: 1px solid #cfe0f5;
  border-radius: 3px;
  padding: 1px 6px;
}
.perm-mods {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.perm-mod {
  display: flex;
  gap: 10px;
  align-items: baseline;
  font-size: 12px;
  color: var(--txt2);
  background: var(--fill-color-lighter);
  border: 1px solid var(--line-lighter);
  border-radius: 5px;
  padding: 6px 9px;
}
.perm-mod b {
  color: var(--txt);
  flex: 0 0 128px;
  font-weight: 600;
}
.perm-acts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.perm-act {
  font-size: 11.5px;
  color: var(--brand);
  background: var(--blue-bg);
  border: 1px solid #cfe0f5;
  border-radius: 3px;
  padding: 2px 8px;
}
</style>
