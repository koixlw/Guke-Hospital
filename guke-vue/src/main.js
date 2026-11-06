import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'element-plus/dist/index.css'
import '@/styles/index.css'

import App from './App.vue'
import router, { PENDING_ROUTE_KEY } from './router'
import { useAuth } from '@/store/auth'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

/**
 * v-perm 指令：当前角色无该操作权限时隐藏元素
 * 用法：<el-button v-perm="'pay:settle'">充值</el-button>
 * 也可传数组表示「任一满足即可见」：v-perm="['a:b','c:d']"
 *
 * 采用隐藏而非移除 DOM 节点：Vue 更新时仍能正常 patch 该节点，
 * 避免节点被提前摘除导致的渲染异常；display:none 同时也不会进入无障碍树。
 */
app.directive('perm', {
  mounted(el, binding) {
    const auth = useAuth()
    if (!auth.can(binding.value)) {
      el.style.display = 'none'
      el.setAttribute('data-no-perm', 'true')
    }
  }
})

app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.mount('#app')

/**
 * 上一次刷新若因分片失效导致跳转被打断，这里补跳回原目标地址。
 * （见 router/index.js 的 router.onError 自愈逻辑）
 */
router.isReady().then(() => {
  let pending = null
  try {
    pending = sessionStorage.getItem(PENDING_ROUTE_KEY)
    if (pending) sessionStorage.removeItem(PENDING_ROUTE_KEY)
  } catch {
    pending = null
  }
  if (pending) router.replace(pending).catch(() => {})
})
