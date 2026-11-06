<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'
import { CUR, FLOWS } from '@/data/demo'
import { money } from '@/utils/format'
import { useAuth } from '@/store/auth'

const auth = useAuth()

/* 门诊记账明细 */
const books = reactive([
  { date: '2026-10-30', nm: '血常规（五分类）', cat: '检验', amt: '28.00', st: '已记账' },
  { date: '2026-10-30', nm: '凝血四项', cat: '检验', amt: '56.00', st: '已记账' },
  { date: '2026-10-30', nm: '生化全套', cat: '检验', amt: '186.00', st: '已记账' },
  { date: '2026-10-30', nm: '心电图（十二导联）', cat: '检查', amt: '35.00', st: '已记账' },
  { date: '2026-10-30', nm: '胸部正侧位 DR', cat: '检查', amt: '128.00', st: '已记账' },
  { date: '2026-10-30', nm: '右膝关节 MRI（3.0T）', cat: '检查', amt: '427.00', st: '已记账' },
  { date: '2026-10-31', nm: '术前用药及耗材', cat: '材料', amt: '318.00', st: '已记账' }
])

/* 账户状态 */
const account = reactive({
  frozen: 2800,
  used: 1178,
  balance: 1622,
  status: '已冻结',
  hospitalized: 0
})

/* 资金流水（本地副本） */
const flows = ref(FLOWS.map((f) => ({ ...f })))

/* 账户状态流转轨迹 */
const states = ref([
  { t: '充值入账', tm: '2026-10-30 08:52', op: '收费处 · 刘芳', tone: 'g', done: true },
  { t: '冻结（进入日间流程）', tm: '2026-10-30 08:55', op: '系统自动', tone: 'b', done: true },
  { t: '门诊记账（检查检验）', tm: '2026-10-30 08:58', op: '系统自动 · 医技收费接口', tone: 'b', done: true },
  { t: '待处理：转住院结转 / 门诊结算', tm: '—', op: '—', tone: 'o', done: false }
])

const usedTotal = computed(() => books.reduce((s, b) => s + Number(b.amt), 0))

/* 权限校验 */
const requirePerm = (code, label) => {
  if (!auth.can(code)) {
    ElMessage.warning(`当前角色「${auth.role.value.name}」无「${label}」操作权限`)
    return false
  }
  return true
}

/* ---------- 充值 ---------- */
const chargeVisible = ref(false)
const chargeForm = reactive({ amount: '2800.00', way: '微信' })

const openCharge = () => {
  if (!requirePerm('pay:settle', '储值金充值')) return
  chargeVisible.value = true
}

const doCharge = () => {
  const amt = Number(chargeForm.amount)
  if (!amt || amt <= 0) {
    ElMessage.warning('请输入有效的充值金额')
    return
  }
  account.frozen = Number((account.frozen + amt).toFixed(2))
  account.balance = Number((account.balance + amt).toFixed(2))
  flows.value.unshift({
    tm: '2026-11-02 11:12',
    typ: '充值',
    amt: `+${money(amt)}`,
    bal: money(account.balance),
    op: `收费处 · ${auth.user.value.name}`,
    rmk: `日间手术专项储值金充值（${chargeForm.way}）`,
    no: 'CZ20261102021'
  })
  chargeVisible.value = false
  ElMessage.success(`充值 ${money(amt)} 元成功，可用余额 ${money(account.balance)} 元`)
}

/* ---------- 冻结 ---------- */
const doFreeze = () => {
  if (!requirePerm('pay:settle', '储值金冻结')) return
  if (account.status === '已冻结') {
    ElMessage.info('储值金已处于冻结状态，无需重复冻结')
    return
  }
  account.status = '已冻结'
  states.value[1].done = true
  states.value[1].tm = '2026-11-02 11:15'
  states.value[1].op = `收费处 · ${auth.user.value.name}`
  flows.value.unshift({
    tm: '2026-11-02 11:15',
    typ: '冻结',
    amt: `-${money(account.frozen)}`,
    bal: money(account.balance),
    op: '系统自动',
    rmk: '进入日间手术流程，专项储值金冻结',
    no: 'DJ20261102006'
  })
  ElMessage.success(`储值金 ${money(account.frozen)} 元已冻结`)
}

/* ---------- 转住院结转 ---------- */
const doTransfer = async () => {
  if (!requirePerm('pay:settle', '转住院结转')) return
  try {
    await ElMessageBox.confirm(
      `确认将冻结金额 ${money(account.frozen)} 元原子性转入住院储值金？`,
      '转住院结转',
      { confirmButtonText: '确认结转', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }
  account.hospitalized = Number((account.hospitalized + account.frozen).toFixed(2))
  account.frozen = 0
  account.status = '已转入住院'
  states.value[3].t = '转住院结转'
  states.value[3].tm = '2026-11-02 11:18'
  states.value[3].op = `收费处 · ${auth.user.value.name} · HIS 储值金接口`
  states.value[3].tone = 'g'
  states.value[3].done = true
  flows.value.unshift({
    tm: '2026-11-02 11:18',
    typ: '转住院结转',
    amt: `-${money(account.hospitalized)}`,
    bal: money(account.balance),
    op: '系统自动 · HIS 储值金接口',
    rmk: '专项储值金原子性转入住院储值金',
    no: 'ZH20261102003'
  })
  ElMessage.success('已完成转住院结转，住院储值金同步增加')
}

/* ---------- 退出门诊结算 ---------- */
const doSettle = async () => {
  if (!requirePerm('pay:settle', '退出门间结算')) return
  try {
    await ElMessageBox.confirm(
      `确认按实际发生费用核销 ${money(usedTotal.value)} 元，并将余额 ${money(account.balance)} 元原路退回？`,
      '退出门诊结算',
      { confirmButtonText: '确认结算', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }
  flows.value.unshift({
    tm: '2026-11-02 11:22',
    typ: '门诊结算',
    amt: `-${money(usedTotal.value)}`,
    bal: '0.00',
    op: `收费处 · ${auth.user.value.name}`,
    rmk: '退出日间手术，已发生费用核销，余额原路退回',
    no: 'JS20261102009'
  })
  account.used = usedTotal.value
  account.balance = 0
  account.frozen = 0
  account.status = '已结算'
  states.value[3].t = '退出门诊结算'
  states.value[3].tm = '2026-11-02 11:22'
  states.value[3].op = `收费处 · ${auth.user.value.name}`
  states.value[3].tone = 'g'
  states.value[3].done = true
  ElMessage.success('退出门诊结算完成，余额已原路退回')
}

/* ---------- 查看账户详情 ---------- */
const detailVisible = ref(false)

const toast = (m) => ElMessage.success(m)

/* 合计行：Element Plus 的 show-summary 会对齐真实列宽 */
const bookSummary = ({ columns }) =>
  columns.map((col, i) => (i === 0 ? `合计 ${books.length} 项` : i === 3 ? money(usedTotal.value) : ''))
</script>

<template>
  <div>
    <PageHeader title="诊间缴费记账" sub="日间手术专项储值金 · 充值与门诊记账 · 冻结 / 转住院结转 / 退出门诊结算">
      <template #title-extra><span class="tag solid">▲ 条款 1</span></template>
      <template #actions>
        <el-button size="small" @click="toast('对账单已发送至打印')">
          <IconSvg name="print" :size="13" />打印对账单
        </el-button>
        <el-button size="small" @click="toast('对账文件已导出')">
          <IconSvg name="down" :size="13" />财务对账导出
        </el-button>
      </template>
    </PageHeader>

    <div class="grid g-side-r">
      <div>
        <div class="money-account">
          <div class="st">{{ account.status }}</div>
          <div class="t">
            <IconSvg name="wallet" :size="13" /> 日间手术专项储值金账户 · 与普通门诊账户独立记账
          </div>
          <div class="big">{{ money(account.frozen) }}<small>元</small></div>
          <div class="hint" style="color: #bcdcf4">
            {{ CUR.name }} · {{ CUR.sex }} · {{ CUR.age }}岁 · 病历号 {{ CUR.mrn }}
          </div>
          <div class="row">
            <div>冻结金额<b>{{ money(account.frozen) }}</b></div>
            <div>已发生费用<b>{{ money(account.used) }}</b></div>
            <div>可用余额<b>{{ money(account.balance) }}</b></div>
            <div>账户状态<b style="font-size: 12px">{{ account.status }}</b></div>
          </div>
        </div>

        <div class="card" style="margin-top: 12px">
          <div class="card-bd" style="display: flex; gap: 8px; flex-wrap: wrap; padding: 11px 13px">
            <el-button size="small" @click="openCharge">
              <IconSvg name="plus" :size="13" />充值
            </el-button>
            <el-button size="small" @click="doFreeze">
              <IconSvg name="money" :size="13" />冻结储值金
            </el-button>
            <el-button type="primary" size="small" @click="doTransfer">
              <IconSvg name="swap" :size="13" />转住院结转
            </el-button>
            <el-button type="danger" plain size="small" @click="doSettle">
              <IconSvg name="exit" :size="13" />退出门诊结算
            </el-button>
            <el-button size="small" @click="detailVisible = true">
              <IconSvg name="doc" :size="13" />查看账户详情
            </el-button>
            <span class="hint" style="margin-left: auto; align-self: center">
              资金类操作在数据库事务内完成，实时更新冻结金额与账户状态
            </span>
          </div>
        </div>

        <SectionCard title="门诊记账明细" tight>
          <template #right>全部由医技收费接口自动回写</template>
          <el-table :data="books" style="width: 100%" table-layout="auto" show-summary :summary-method="bookSummary">
            <el-table-column prop="date" label="发生日期" width="88" class-name="num" />
            <el-table-column prop="nm" label="项目名称" min-width="180" show-overflow-tooltip />
            <el-table-column prop="cat" label="类别" width="64" />
            <el-table-column prop="amt" label="金额(元)" width="88" align="right" class-name="num" />
            <el-table-column label="状态" width="76" align="center">
              <template #default="{ row }"><TagBox :text="row.st" tone="g" /></template>
            </el-table-column>
          </el-table>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="账户状态流转">
          <div class="trace">
            <div v-for="(s, i) in states" :key="i" class="trace-item" :class="'t-' + s.tone">
              <div style="font-weight: 600; color: #22364c; font-size: 12.5px">{{ s.t }}</div>
              <div class="hint">{{ s.tm }} · {{ s.op }}</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="资金流水" tight>
          <template #right><span class="link" @click="detailVisible = true">全部流水</span></template>
          <el-table :data="flows" style="width: 100%">
            <el-table-column label="时间" width="94">
              <template #default="{ row }">
                <span class="num" style="font-size: 11.5px">{{ row.tm.slice(5) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="typ" label="类型" width="60" />
            <el-table-column label="金额" width="82" align="right">
              <template #default="{ row }">
                <span class="num" :style="{ color: row.amt.startsWith('+') ? '#0f9d63' : '#33475c' }">
                  {{ row.amt }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="余额" width="82" align="right">
              <template #default="{ row }"><span class="num">{{ row.bal }}</span></template>
            </el-table-column>
          </el-table>
        </SectionCard>

        <el-alert type="info" :closable="false" show-icon style="margin-top: 12px">
          转住院时冻结金额原子性转入住院储值金并生成结转流水；退出日间手术时按实际发生费用核销、退回余额并生成结算流水，全程可追溯、账实相符。
        </el-alert>
      </div>
    </div>

    <!-- 充值 -->
    <el-dialog v-model="chargeVisible" title="日间手术专项储值金充值" width="440px">
      <el-form label-width="88px" label-position="left">
        <el-form-item label="患者">
          {{ CUR.name }} · {{ CUR.mrn }}
        </el-form-item>
        <el-form-item label="充值金额">
          <el-input v-model="chargeForm.amount" style="width: 160px">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="chargeForm.way" style="width: 160px">
            <el-option label="微信" value="微信" />
            <el-option label="支付宝" value="支付宝" />
            <el-option label="银行卡" value="银行卡" />
            <el-option label="现金" value="现金" />
          </el-select>
        </el-form-item>
        <el-form-item label="当前可用余额">
          <b class="num">{{ money(account.balance) }}</b> 元
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="chargeVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="doCharge">确认充值</el-button>
      </template>
    </el-dialog>

    <!-- 账户详情 -->
    <el-dialog v-model="detailVisible" title="专项储值金账户详情" width="600px">
      <table class="tb-plain">
        <tbody>
          <tr>
            <td style="width: 132px; color: #7b8fa3">账户类型</td>
            <td>日间手术专项储值金（与普通门诊账户独立记账）</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">冻结金额</td>
            <td class="num">{{ money(account.frozen) }} 元</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">已发生费用</td>
            <td class="num">{{ money(account.used) }} 元</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">可用余额</td>
            <td class="num"><b>{{ money(account.balance) }}</b> 元</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">已转住院储值金</td>
            <td class="num">{{ money(account.hospitalized) }} 元</td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">账户状态</td>
            <td><TagBox :text="account.status" :tone="account.status === '已结算' ? 'gy' : 'b'" /></td>
          </tr>
          <tr>
            <td style="color: #7b8fa3">流水笔数</td>
            <td class="num">{{ flows.length }} 笔</td>
          </tr>
        </tbody>
      </table>
      <template #footer>
        <el-button size="small" @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.tb-plain {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
.tb-plain td {
  padding: 7px 14px;
  border-bottom: 1px solid #eef2f7;
  color: #33475c;
}
.tb-plain tr:last-child td {
  border-bottom: none;
}
</style>
