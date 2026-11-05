<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import StatTile from '@/components/StatTile.vue'
import MiniStat from '@/components/MiniStat.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'

const router = useRouter()

const kpis = [
  { lb: '今日日间手术申请', vl: 24, u: '例', dt: '较昨日 +6 例', tone: '' },
  { lb: '待专科评估', vl: 6, u: '例', dt: '超时未评估 1 例', tone: 'orange' },
  { lb: '待麻醉评估', vl: 5, u: '例', dt: '平均等待 3.2 小时', tone: 'orange' },
  { lb: '待预约手术', vl: 4, u: '例', dt: '号源充足', tone: 'teal' },
  { lb: '今日入院登记', vl: 8, u: '例', dt: '已报到 6 例', tone: 'green' },
  { lb: '今日手术完成', vl: 11, u: '例', dt: '台次利用率 86%', tone: 'green' }
]

const flow = [
  { nm: '申请', n: 24, st: 'on' },
  { nm: '缴费冻结', n: 21, st: 'on' },
  { nm: '术前检查', n: 19, st: 'on' },
  { nm: '专科评估', n: 18, st: 'on' },
  { nm: '麻醉评估', n: 15, st: 'cur' },
  { nm: '手术预约', n: 14, st: '' },
  { nm: '入院登记', n: 12, st: '' },
  { nm: '手术登记', n: 11, st: '' },
  { nm: '术后结算', n: 11, st: '' }
]

const schedules = [
  { room: 'OR-1', time: '08:30', op: '膝关节镜下半月板成形术', pt: '王建国', doc: '李国栋', anes: '椎管内麻醉', st: '已完成' },
  { room: 'OR-1', time: '10:40', op: '腕管综合征切开减压术', pt: '李秀兰', doc: '王海涛', anes: '臂丛神经阻滞', st: '待手术' },
  { room: 'OR-2', time: '09:10', op: '桡骨远端骨折闭合复位内固定术', pt: '陈志强', doc: '陈立新', anes: '臂丛神经阻滞', st: '已完成' },
  { room: 'OR-2', time: '14:30', op: '肩关节镜下肩袖修补术', pt: '张桂芳', doc: '刘晓峰', anes: '全身麻醉', st: '待手术' },
  { room: 'OR-3', time: '13:30', op: '腰椎间盘突出椎间孔镜髓核摘除术', pt: '刘建华', doc: '赵敏', anes: '局部麻醉', st: '待手术' }
]

const todos = [
  { t1: '麻醉评估待处理', t2: '赵文轩 等 5 例', tag: '5 例', tone: 'o', to: 'anes' },
  { t1: '专科评估超时未完成', t2: '周雅琴 已等待 26 小时', tag: '1 例', tone: 'r', to: 'spec' },
  { t1: '手术安排变动待通知', t2: '陈志强 术间/时间变更', tag: '1 例', tone: 'o', to: 'schedule' },
  { t1: '入院前通知待确认', t2: '今日 16:00 定时任务', tag: '8 例', tone: 'b', to: 'notify' },
  { t1: '退出日间手术待审核', t2: '患者电话告知不来手术', tag: '1 例', tone: 'gy', to: 'quit' }
]

const toast = (m) => ElMessage.success(m)
</script>

<template>
  <div>
    <PageHeader title="工作台" sub="日间手术中心 · 张敏 · 2026-11-02 星期一 · 数据截至 10:38">
      <template #actions>
        <el-button size="small" @click="toast('数据已刷新')">
          <IconSvg name="refresh" :size="13" />刷新数据
        </el-button>
        <el-button size="small" @click="toast('日报已导出')">
          <IconSvg name="down" :size="13" />导出日报
        </el-button>
      </template>
    </PageHeader>

    <div class="grid" style="grid-template-columns: repeat(6, 1fr)">
      <StatTile
        v-for="k in kpis"
        :key="k.lb"
        :label="k.lb"
        :value="k.vl"
        :unit="k.u"
        :delta="k.dt"
        :tone="k.tone"
      />
    </div>

    <div class="grid g-side" style="margin-top: 12px">
      <div>
        <SectionCard title="日间手术全流程实时看板">
          <template #right>近 7 日平均在院时长 1.4 天</template>
          <div class="flow-strip">
            <div v-for="f in flow" :key="f.nm" class="flow-node">
              <div class="bar" :class="f.st || 'off'" />
              <div class="n" :class="{ cur: f.st === 'cur' }">{{ f.n }}</div>
              <div class="nm">{{ f.nm }}</div>
            </div>
          </div>
          <div
            class="hint"
            style="display: flex; gap: 16px; border-top: 1px dashed var(--line); margin-top: 8px; padding-top: 8px"
          >
            <span>● 蓝色：已完成该环节</span>
            <span>● 橙色：当前集中环节</span>
            <span>流程断点自动预警：滞留超过 24 小时转红</span>
          </div>
        </SectionCard>

        <SectionCard title="今日手术安排" tight>
          <template #right>共 11 台 · 已完成 9 台</template>
          <el-table :data="schedules" style="width: 100%">
            <el-table-column prop="room" label="手术间" width="64" />
            <el-table-column prop="time" label="时间" width="64" class-name="num" />
            <el-table-column prop="op" label="手术名称" min-width="200" show-overflow-tooltip />
            <el-table-column prop="pt" label="患者" width="70" />
            <el-table-column prop="doc" label="术者" width="70" />
            <el-table-column prop="anes" label="麻醉方式" width="96" />
            <el-table-column label="状态" width="76" align="center">
              <template #default="{ row }">
                <TagBox :text="row.st" />
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="我的待办" tight>
          <template #right>共 16 项</template>
          <div
            v-for="t in todos"
            :key="t.t1"
            class="list-row"
            style="cursor: pointer"
            @click="router.push('/' + t.to)"
          >
            <div>
              <div class="t1">{{ t.t1 }}</div>
              <div class="t2">{{ t.t2 }}</div>
            </div>
            <div class="rt">
              <TagBox :text="t.tag" :tone="t.tone" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="短信通知状态（今日）">
          <div style="display: flex; gap: 10px; margin-bottom: 10px">
            <MiniStat label="发送成功" :value="37" tone="good" />
            <MiniStat label="失败待重发" :value="2" tone="warn" />
          </div>
          <div class="hint" style="line-height: 1.9">
            短信平台：已联通 · 网关状态正常<br />
            定时任务：入院前通知 16:00 自动执行<br />
            失败原因：号码空号 1 条、关机 1 条
          </div>
        </SectionCard>
      </div>
    </div>
  </div>
</template>
