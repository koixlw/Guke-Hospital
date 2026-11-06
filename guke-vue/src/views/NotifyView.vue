<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import TagBox from '@/components/TagBox.vue'
import IconSvg from '@/components/IconSvg.vue'

/* 待通知 / 已通知患者（页面内静态数据） */
const rows = ref([
  { nm: '王建国', dept: '关节外科', opTime: '2026-11-03 10:00', room: '门诊手术室 2 间', tel: '138****7261', st: '待发送' },
  { nm: '陈志强', dept: '创伤骨科', opTime: '2026-11-03 14:30', room: '门诊手术室 2 间', tel: '139****5082', st: '待发送' },
  { nm: '张桂芳', dept: '关节外科', opTime: '2026-11-03 14:30', room: '门诊手术室 2 间', tel: '137****4437', st: '待发送' },
  { nm: '吴大海', dept: '运动医学科', opTime: '2026-11-03 08:30', room: '门诊手术室 1 间', tel: '135****9918', st: '已发送' },
  { nm: '赵文轩', dept: '足踝外科', opTime: '2026-11-04 10:00', room: '门诊手术室 1 间', tel: '136****3384', st: '待发送' }
])

/* 通知记录 */
const records = ref([
  { t1: '王建国 · 入院前通知', t2: '2026-11-01 16:20 · 已送达' },
  { t1: '陈志强 · 入院前通知', t2: '2026-11-01 16:20 · 已送达' },
  { t1: '张桂芳 · 入院前通知', t2: '2026-11-01 16:21 · 已送达' },
  { t1: '吴大海 · 入院前通知', t2: '2026-11-01 16:21 · 补发 1 次' }
])

/* 通知任务配置 */
const cfg = reactive({
  days: '1',
  time: '16:00',
  scope: '次日入院且评估通过',
  repeat: '不重复'
})

/* 已保存的参数（点击「参数配置」生效） */
const savedCfg = ref({ ...cfg })

const pending = computed(() => rows.value.filter((r) => r.st === '待发送'))

/* 发送单条 */
const sendOne = (row) => {
  if (row.st === '已发送') {
    ElMessage.info(`${row.nm} 的入院前通知已于今日 ${savedCfg.value.time} 发送，无需重复发送`)
    return
  }
  row.st = '已发送'
  records.value.unshift({
    t1: `${row.nm} · 入院前通知`,
    t2: `2026-11-02 ${savedCfg.value.time} · 已送达 ${row.tel}`
  })
  ElMessage.success(`已向 ${row.nm}（${row.tel}）发送入院前通知`)
}

/* 执行通知任务 */
const runTask = () => {
  const list = pending.value
  if (!list.length) {
    ElMessage.info('当前没有待发送的患者，任务无需执行')
    return
  }
  list.forEach((r) => {
    r.st = '已发送'
    records.value.unshift({
      t1: `${r.nm} · 入院前通知`,
      t2: `2026-11-02 ${savedCfg.value.time} · 已送达 ${r.tel}`
    })
  })
  ElMessage.success(`入院前通知任务已执行，共发送 ${list.length} 条短信`)
}

/* 保存参数 */
const saveCfg = () => {
  savedCfg.value = { ...cfg }
  ElMessage.success(
    `通知参数已保存：提前 ${cfg.days} 天、${cfg.time} 执行、${cfg.scope}，即时生效`
  )
}

const toast = (m) => ElMessage.success(m)
</script>

<template>
  <div>
    <PageHeader
      title="入院前通知"
      sub="入院前一天自动短信通知（提前天数参数化配置，默认 1 天） · 通知记录留痕、支持补发"
    >
      <template #actions>
        <el-button v-perm="'notify:send'" type="primary" size="small" @click="runTask">
          <IconSvg name="sms" :size="13" />立即执行通知任务
        </el-button>
        <el-button size="small" @click="saveCfg">
          <IconSvg name="cog" :size="13" />参数配置
        </el-button>
      </template>
    </PageHeader>

    <div class="grid g-side">
      <div>
        <SectionCard title="通知任务配置">
          <div class="form-grid c4">
            <div class="field">
              <label>提前通知天数</label>
              <el-input v-model="cfg.days" style="max-width: 80px" />
              <span class="hint">天</span>
            </div>
            <div class="field">
              <label>发送时间</label>
              <el-input v-model="cfg.time" />
            </div>
            <div class="field">
              <label>通知范围</label>
              <el-select v-model="cfg.scope">
                <el-option label="次日入院且评估通过" value="次日入院且评估通过" />
                <el-option label="全部待入院患者" value="全部待入院患者" />
              </el-select>
            </div>
            <div class="field">
              <label>重复发送</label>
              <el-select v-model="cfg.repeat">
                <el-option label="不重复" value="不重复" />
                <el-option label="允许重复" value="允许重复" />
              </el-select>
            </div>
          </div>
          <div class="hint" style="margin-top: 10px">
            <IconSvg name="info" :size="12" />
            参数由系统管理员维护，修改后即时生效；今日任务将于
            <b style="color: #d9820a">{{ savedCfg.time }}</b> 自动执行，当前待发送
            <b style="color: #d9820a">{{ pending.length }}</b> 条
          </div>
        </SectionCard>

        <SectionCard title="待通知 / 已通知患者" tight>
          <template #right>共 {{ pending.length }} 条待处理</template>
          <el-table :data="rows" style="width: 100%">
            <el-table-column label="姓名" width="80">
              <template #default="{ row }"><b>{{ row.nm }}</b></template>
            </el-table-column>
            <el-table-column prop="dept" label="科室" min-width="100" show-overflow-tooltip />
            <el-table-column prop="opTime" label="手术时间" width="132" class-name="num" />
            <el-table-column prop="room" label="手术间" width="132" />
            <el-table-column prop="tel" label="手机号" width="104" class-name="num" />
            <el-table-column label="通知状态" width="78" align="center">
              <template #default="{ row }">
                <TagBox :text="row.st === '待发送' ? '待通知' : row.st" :tone="row.st === '待发送' ? 'o' : 'g'" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="66" align="center">
              <template #default="{ row }">
                <span class="link" @click="sendOne(row)">
                  {{ row.st === '待发送' ? '发送' : '补发' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="通知短信预览">
          <div class="sms-bubble" style="font-size: 12.3px">
            <div class="h" style="margin-bottom: 6px">
              <span style="color: #0aa2a2">【四川省骨科医院】</span>
            </div>
            王建国您好，您预约的膝关节镜手术将于明日（11 月 3 日）10:00 进行，请于今日 14:00 前到住院部一楼日间手术中心办理入院手续，入院前请空腹 8 小时，携带身份证、医保卡及既往检查资料。
          </div>
          <div class="hint" style="margin-top: 9px; line-height: 1.8">
            提前通知天数变更示例：设为 2 天时，将于 11 月 1 日发送同一模板。
          </div>
        </SectionCard>

        <SectionCard title="通知记录">
          <div
            v-for="(r, i) in records"
            :key="r.t1 + r.t2"
            class="list-row"
            style="padding-left: 0"
            :style="i === records.length - 1 ? { borderBottom: 'none' } : {}"
          >
            <div>
              <div class="t1">{{ r.t1 }}</div>
              <div class="t2">{{ r.t2 }}</div>
            </div>
            <div class="rt"><TagBox text="成功" tone="g" /></div>
          </div>
        </SectionCard>
      </div>
    </div>
  </div>
</template>
