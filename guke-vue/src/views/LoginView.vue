<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import IconSvg from '@/components/IconSvg.vue'
import { HOSP, SYS, TODAY } from '@/data/demo'
import { ROLE_DEFS, USERS } from '@/data/permissions'
import { useAuth } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuth()

const form = reactive({ username: '', password: '' })
const loading = ref(false)
const errorMsg = ref('')
const activeAccount = ref('')

/* 演示账号：按角色分组展示，点击即可填充账号密码 */
const accounts = computed(() =>
  USERS.map((u) => ({
    ...u,
    roleName: ROLE_DEFS[u.role].name,
    roleDesc: ROLE_DEFS[u.role].desc
  }))
)

const fill = (a) => {
  activeAccount.value = a.u
  form.username = a.u
  form.password = a.p
  errorMsg.value = ''
}

const submit = () => {
  errorMsg.value = ''
  const res = auth.login(form.username, form.password)
  if (!res.ok) {
    errorMsg.value = res.msg
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(`欢迎回来，${auth.user.value.name}`)
  const redirect = route.query.redirect
  router.replace(typeof redirect === 'string' && redirect ? redirect : auth.homePath())
}

onMounted(() => {
  /* 已登录时直接进入系统 */
  if (auth.isLogged()) router.replace(auth.homePath())
})
</script>

<template>
  <div class="login-page">
    <!-- 左侧：品牌与系统简介 -->
    <div class="lp-brand">
      <div class="lp-brand-inner">
        <div class="lp-logo">
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

        <h1>预入出院（日间手术）<br />全流程数字化管理平台</h1>
        <p class="lp-desc">
          覆盖门诊申请、缴费记账、术前检查、专科与麻醉评估、预约通知、入院登记、手术安排、费用与医嘱、
          转普通住院与退出日间路径的完整闭环，与 HIS、LIS、PACS、医技预约及收费系统一体化集成。
        </p>

        <ul class="lp-features">
          <li><IconSvg name="check" :size="14" />申请单为全流程唯一业务载体，全环节可追溯</li>
          <li><IconSvg name="check" :size="14" />储值金冻结 — 转住院结转 — 门诊结算，资金全程闭环</li>
          <li><IconSvg name="check" :size="14" />角色权限最小化配置，患者数据按科室隔离</li>
          <li><IconSvg name="check" :size="14" />关键业务参数界面化配置，配置即时生效</li>
        </ul>

        <div class="lp-foot">
          <span>业务日期 {{ TODAY }}</span>
          <span class="dot">·</span>
          <span>演示版本 v1.0</span>
          <span class="dot">·</span>
          <span>四川省骨科医院 信息中心</span>
        </div>
      </div>
    </div>

    <!-- 右侧：登录表单 -->
    <div class="lp-form">
      <div class="lp-card">
        <div class="lp-card-hd">
          <h2>用户登录</h2>
          <p>请使用医院统一账号登录，不同岗位登录后可见模块与可执行操作不同</p>
        </div>

        <el-form :model="form" label-position="top" @submit.prevent="submit">
          <el-form-item label="账号">
            <el-input
              v-model="form.username"
              size="large"
              placeholder="请输入账号"
              autocomplete="username"
              @input="errorMsg = ''"
            >
              <template #prefix><IconSvg name="user" :size="14" /></template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码">
            <el-input
              v-model="form.password"
              size="large"
              type="password"
              placeholder="请输入密码"
              show-password
              autocomplete="current-password"
              @input="errorMsg = ''"
              @keyup.enter="submit"
            >
              <template #prefix><IconSvg name="lock" :size="14" /></template>
            </el-input>
          </el-form-item>

          <el-alert v-if="errorMsg" type="error" :closable="false" show-icon style="margin-bottom: 14px">
            {{ errorMsg }}
          </el-alert>

          <el-button
            type="primary"
            size="large"
            class="lp-submit"
            :loading="loading"
            @click="submit"
          >
            登 录
          </el-button>
        </el-form>

        <div class="lp-divider">
          <span>演示账号（点击自动填充）</span>
        </div>

        <div class="lp-accounts">
          <div
            v-for="a in accounts"
            :key="a.u"
            class="lp-account"
            :class="{ on: activeAccount === a.u }"
            @click="fill(a)"
          >
            <span class="ava">{{ a.name.slice(0, 1) }}</span>
            <span class="who">
              <b>{{ a.name }}</b>
              <em>{{ a.roleName }} · {{ a.dept }}</em>
            </span>
            <code>{{ a.u }}</code>
          </div>
        </div>

        <div class="lp-tip">
          <IconSvg name="info" :size="12" />
          <span>
            演示环境所有账号密码均为 <b>123456</b>（管理员为 <b>admin123</b>），登录后可体验不同角色的权限差异。
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
}

/* ---------- 左侧品牌区 ---------- */
.lp-brand {
  flex: 1 1 52%;
  min-width: 0;
  background: linear-gradient(150deg, #0a2440 0%, #0d2f4f 45%, #12588c 100%);
  color: #fff;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.lp-brand::after {
  content: '';
  position: absolute;
  right: -140px;
  bottom: -180px;
  width: 460px;
  height: 460px;
  border-radius: 50%;
  background: rgba(56, 168, 240, 0.09);
}
.lp-brand::before {
  content: '';
  position: absolute;
  left: -90px;
  top: -120px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(10, 162, 162, 0.08);
}
.lp-brand-inner {
  position: relative;
  z-index: 1;
  max-width: 620px;
  padding: 40px 56px;
}
.lp-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 34px;
}
.lp-logo .brand-txt b {
  font-size: 16px;
  letter-spacing: 0.6px;
  display: block;
  line-height: 1.2;
}
.lp-logo .brand-txt span {
  font-size: 11px;
  color: #9dc4e4;
  letter-spacing: 0.8px;
}
.lp-brand h1 {
  font-size: 30px;
  line-height: 1.42;
  font-weight: 700;
  margin: 0 0 18px;
  letter-spacing: 0.5px;
}
.lp-desc {
  font-size: 13px;
  line-height: 2;
  color: #b9d3e8;
  margin: 0 0 26px;
}
.lp-features {
  list-style: none;
  padding: 0;
  margin: 0 0 34px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.lp-features li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 13px;
  color: #d6e6f5;
  line-height: 1.6;
}
.lp-features svg {
  color: #3fca9a;
  margin-top: 2px;
  flex: 0 0 auto;
}
.lp-foot {
  font-size: 11.5px;
  color: #7fa6c9;
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 16px;
}
.lp-foot .dot {
  opacity: 0.5;
}

/* ---------- 右侧表单区 ---------- */
.lp-form {
  flex: 0 0 480px;
  max-width: 480px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 32px 30px;
  overflow-y: auto;
}
.lp-card {
  width: 100%;
  margin: auto 0;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 10px 34px rgba(13, 47, 79, 0.08);
  padding: 26px 26px 20px;
}
.lp-card-hd h2 {
  font-size: 19px;
  margin: 0 0 6px;
  color: var(--txt);
  letter-spacing: 0.5px;
}
.lp-card-hd p {
  font-size: 12px;
  color: var(--txt3);
  margin: 0 0 20px;
  line-height: 1.7;
}
.lp-card :deep(.el-form-item) {
  margin-bottom: 15px;
}
.lp-card :deep(.el-form-item__label) {
  font-size: 12.5px;
  color: var(--txt2);
  padding-bottom: 5px;
  line-height: 1;
}
.lp-card :deep(.el-input__wrapper) {
  border-radius: 6px;
}
.lp-card :deep(.el-input__prefix) {
  color: var(--txt3);
}
.lp-submit {
  width: 100%;
  font-weight: 600;
  letter-spacing: 4px;
}
.lp-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0 12px;
  color: var(--txt3);
  font-size: 11.5px;
}
.lp-divider::before,
.lp-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}
.lp-accounts {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.lp-account {
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid var(--line);
  border-radius: 7px;
  padding: 7px 10px;
  cursor: pointer;
  transition: all 0.15s;
  background: #fbfcfe;
}
.lp-account:hover {
  border-color: var(--brand);
  background: var(--blue-bg);
}
.lp-account.on {
  border-color: var(--brand);
  background: var(--blue-bg);
  box-shadow: 0 0 0 2px rgba(27, 111, 196, 0.1);
}
.lp-account .ava {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #39a3e8, #0f7fd1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex: 0 0 26px;
}
.lp-account .who {
  flex: 1;
  min-width: 0;
  line-height: 1.35;
}
.lp-account .who b {
  font-size: 12.5px;
  color: var(--txt);
  display: block;
}
.lp-account .who em {
  font-size: 10.5px;
  color: var(--txt3);
  font-style: normal;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lp-account code {
  font-size: 10.5px;
  color: var(--brand);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 1px 5px;
  flex: 0 0 auto;
}
.lp-tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--line);
  font-size: 11.5px;
  color: var(--txt3);
  line-height: 1.7;
}
.lp-tip svg {
  margin-top: 3px;
  flex: 0 0 auto;
}
.lp-tip span {
  flex: 1;
  min-width: 0;
}
.lp-tip b {
  color: var(--brand);
}

@media (max-width: 1180px) {
  .lp-brand {
    display: none;
  }
  .lp-form {
    flex: 1 1 auto;
    max-width: none;
  }
}
</style>
