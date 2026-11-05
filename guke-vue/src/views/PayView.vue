<script setup>
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'
import { CUR, FLOWS } from '@/data/demo'
import { money } from '@/utils/format'

const books = [
  { date: '2026-10-30', nm: '血常规（五分类）', cat: '检验', amt: '28.00', st: '已记账' },
  { date: '2026-10-30', nm: '凝血四项', cat: '检验', amt: '56.00', st: '已记账' },
  { date: '2026-10-30', nm: '生化全套', cat: '检验', amt: '186.00', st: '已记账' },
  { date: '2026-10-30', nm: '心电图（十二导联）', cat: '检查', amt: '35.00', st: '已记账' },
  { date: '2026-10-30', nm: '胸部正侧位 DR', cat: '检查', amt: '128.00', st: '已记账' },
  { date: '2026-10-30', nm: '右膝关节 MRI（3.0T）', cat: '检查', amt: '427.00', st: '已记账' },
  { date: '2026-10-31', nm: '术前用药及耗材', cat: '材料', amt: '318.00', st: '已记账' }
]

const states = [
  { t: '充值入账', tm: '2026-10-30 08:52', op: '收费处 · 刘芳', tone: 'g' },
  { t: '冻结（进入日间流程）', tm: '2026-10-30 08:55', op: '系统自动', tone: 'b' },
  { t: '门诊记账（检查检验）', tm: '2026-10-30 08:58', op: '系统自动 · 医技收费接口', tone: 'b' },
  { t: '待处理：转住院结转 / 门诊结算', tm: '—', op: '—', tone: 'o' }
]

const toast = (m) => ElMessage.success(m)

/* 合计行：Element Plus 的 show-summary 会对齐真实列宽 */
const bookSummary = ({ columns }) =>
  columns.map((col, i) => (i === 0 ? '合计 7 项' : i === 3 ? '1,178.00' : ''))
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
          <div class="st">已冻结</div>
          <div class="t">
            <IconSvg name="wallet" :size="13" /> 日间手术专项储值金账户 · 与普通门诊账户独立记账
          </div>
          <div class="big">2,800.00<small>元</small></div>
          <div class="hint" style="color: #bcdcf4">
            {{ CUR.name }} · {{ CUR.sex }} · {{ CUR.age }}岁 · 病历号 {{ CUR.mrn }}
          </div>
          <div class="row">
            <div>冻结金额<b>2,800.00</b></div>
            <div>已发生费用<b>1,178.00</b></div>
            <div>可用余额<b>1,622.00</b></div>
            <div>账户状态<b style="font-size: 12px">已冻结</b></div>
          </div>
        </div>

        <div class="card" style="margin-top: 12px">
          <div class="card-bd" style="display: flex; gap: 8px; flex-wrap: wrap; padding: 11px 13px">
            <el-button size="small" @click="toast('充值')">
              <IconSvg name="plus" :size="13" />充值
            </el-button>
            <el-button size="small" @click="toast('储值金已冻结')">
              <IconSvg name="money" :size="13" />冻结储值金
            </el-button>
            <el-button type="primary" size="small" @click="toast('已转住院结转')">
              <IconSvg name="swap" :size="13" />转住院结转
            </el-button>
            <el-button type="danger" plain size="small" @click="toast('退出门诊结算')">
              <IconSvg name="exit" :size="13" />退出门诊结算
            </el-button>
            <el-button size="small" @click="toast('账户明细已展开')">
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
            <div v-for="(s, i) in states" :key="s.t" class="trace-item" :class="'t-' + s.tone">
              <div style="font-weight: 600; color: #22364c; font-size: 12.5px">{{ s.t }}</div>
              <div class="hint">{{ s.tm }} · {{ s.op }}</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="资金流水" tight>
          <template #right><span class="link">全部流水</span></template>
          <el-table :data="FLOWS" style="width: 100%">
            <el-table-column label="时间" width="94">
              <template #default="{ row }">
                <span class="num" style="font-size: 11.5px">{{ row.tm.slice(5) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="typ" label="类型" width="54" />
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
  </div>
</template>

