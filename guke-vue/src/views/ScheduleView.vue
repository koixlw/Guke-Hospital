<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import TagBox from '@/components/TagBox.vue'
import InfoList from '@/components/InfoList.vue'
import IconSvg from '@/components/IconSvg.vue'
import { PATIENTS } from '@/data/demo'
import { useAuth } from '@/store/auth'

const auth = useAuth()

/* 三个手术间排班 */
const rooms = ref([
  {
    nm: '门诊手术室 1 间',
    list: [
      { time: '08:30—10:00', op: '膝关节镜下半月板成形术', pt: '王建国', doc: '李国栋', st: '已完成' },
      { time: '10:30—11:30', op: '腕管综合征切开减压术', pt: '李秀兰', doc: '王海涛', st: '手术中' }
    ]
  },
  {
    nm: '门诊手术室 2 间',
    list: [
      { time: '09:10—11:00', op: '桡骨远端骨折闭合复位内固定术', pt: '陈志强', doc: '陈立新', st: '已完成' },
      { time: '14:30—16:00', op: '肩关节镜下肩袖修补术', pt: '张桂芳', doc: '刘晓峰', st: '待手术' }
    ]
  },
  {
    nm: '门诊手术室 3 间',
    list: [
      { time: '13:30—15:00', op: '腰椎间盘突出椎间孔镜髓核摘除术', pt: '刘建华', doc: '赵敏', st: '待手术' },
      { time: '15:10—16:10', op: '掌腱膜挛缩松解术', pt: '周雅琴', doc: '王海涛', st: '待手术' }
    ]
  }
])

/* 变动通知处置 */
const changes = ref([
  {
    pt: '陈志强',
    book: '11-03 10:00 / 1 间',
    plan: '11-03 14:30 / 2 间',
    diff: '时间 + 术间',
    diffTone: 'r',
    st: '待通知',
    stTone: 'o',
    op: 'notify'
  },
  {
    pt: '张桂芳',
    book: '11-03 14:30 / 2 间',
    plan: '11-03 14:30 / 2 间',
    diff: '无差异',
    diffTone: '',
    st: '已一致',
    stTone: 'g',
    op: 'view'
  }
])

/* 通知留痕 */
const traces = ref([
  { t1: '短信通知 · 陈志强', t2: '2026-11-01 15:43 · 已送达 139****5082', tag: '成功', tone: 'g' },
  { t1: '电话通知 · 陈志强', t2: '2026-11-01 15:50 · 通话 42 秒 · 何静', tag: '已确认', tone: 'g' }
])

/* 短信通知 / 电话通知 */
const smsNotify = (row) => {
  row.st = '已通知'
  row.stTone = 'g'
  row.op = 'view'
  traces.value.unshift({
    t1: `短信通知 · ${row.pt}`,
    t2: `2026-11-02 11:05 · 已送达 · 系统自动发送`,
    tag: '成功',
    tone: 'g'
  })
  ElMessage.success(`已向 ${row.pt} 发送手术安排变动短信，并写入通知留痕`)
}

const telNotify = (row) => {
  row.st = '已通知'
  row.stTone = 'g'
  row.op = 'view'
  traces.value.unshift({
    t1: `电话通知 · ${row.pt}`,
    t2: `2026-11-02 11:07 · 通话 46 秒 · 何静`,
    tag: '已确认',
    tone: 'g'
  })
  ElMessage.success(`已登记 ${row.pt} 的电话通知，并写入通知留痕`)
}

/* 拖入患者 → 安排手术 */
const pickVisible = ref(false)
const pickRoom = ref('门诊手术室 1 间')
const pickForm = reactive({ pt: '', time: '', doc: '' })

const patients = PATIENTS.filter((p) => p.status === '待手术' || p.status === '待评估')

const openPick = (room) => {
  pickRoom.value = room
  Object.assign(pickForm, { pt: patients[0]?.name || '', time: '16:30—17:30', doc: patients[0]?.doc || '' })
  pickVisible.value = true
}

const doArrange = () => {
  if (!auth.can('schedule:save')) {
    ElMessage.warning(`当前角色「${auth.role.value.name}」无「保存手术排班」权限`)
    return
  }
  const p = PATIENTS.find((x) => x.name === pickForm.pt)
  const room = rooms.value.find((r) => r.nm === pickRoom.value)
  if (!p || !room) {
    ElMessage.warning('请选择患者与手术间')
    return
  }
  room.list.push({
    time: pickForm.time,
    op: p.op,
    pt: p.name,
    doc: pickForm.doc,
    st: '待手术'
  })
  pickVisible.value = false
  ElMessage.success(`已将 ${p.name} 安排至「${pickRoom.value}」${pickForm.time}`)
}

/* 保存排班 */
const saved = ref(false)
const saveSchedule = () => {
  if (!auth.can('schedule:save')) {
    ElMessage.warning(`当前角色「${auth.role.value.name}」无「保存手术排班」权限`)
    return
  }
  saved.value = true
  ElMessage.success('排班已保存，一致性校验通过')
}

const toast = (m) => ElMessage.success(m)
</script>

<template>
  <div>
    <PageHeader
      title="手术安排"
      sub="手术台次、日期时间、术间、手术医生排班 · 安排信息与预约信息不一致时自动识别并通知患者（短信 / 电话）"
    >
      <template #actions>
        <el-button size="small" @click="toast('通知记录已打开')">
          <IconSvg name="sms" :size="13" />通知记录
        </el-button>
        <el-button v-perm="'schedule:save'" type="primary" size="small" @click="saveSchedule">
          <IconSvg name="save" :size="13" />保存排班
        </el-button>
      </template>
    </PageHeader>

    <el-alert v-if="changes.some((c) => c.st === '待通知')" type="warning" :closable="false" show-icon>
      <template #title>系统自动识别到 1 例手术安排变动，需通知患者确认</template>
      <template #default>
        陈志强（住院号 ZY20261102455）：预约信息为 2026-11-03 10:00 / 门诊手术室 1 间，现有安排为 2026-11-03 14:30 / 门诊手术室 2 间。<b>时间变更 + 术间变更</b>，系统已生成变动通知待办。
      </template>
    </el-alert>

    <div style="height: 12px" />

    <div class="rooms">
      <div v-for="r in rooms" :key="r.nm" class="room">
        <SectionCard :title="r.nm">
          <template #right>{{ r.list.length }} 台</template>
          <div class="room-bd">
            <div
              v-for="c in r.list"
              :key="c.time + c.pt"
              class="case"
              :class="{ pending: c.st === '待手术' }"
            >
              <div class="case-hd">
                <b>{{ c.time }}</b>
                <span class="case-st"><TagBox :text="c.st" :tone="c.st === '已完成' ? 'gy' : c.st === '手术中' ? 'b' : 'o'" /></span>
              </div>
              <div class="case-op">{{ c.op }}</div>
              <div class="hint" style="margin-top: 3px">{{ c.pt }} · 术者 {{ c.doc }}</div>
            </div>
            <div class="drag" @click="openPick(r.nm)">+ 拖入患者安排手术</div>
          </div>
        </SectionCard>
      </div>
    </div>

    <div style="height: 12px" />

    <div class="grid g-side">
      <SectionCard title="变动通知处置" tight>
        <template #right>通知内容自动携带最新安排信息</template>
        <el-table :data="changes" style="width: 100%">
          <el-table-column prop="pt" label="患者" width="70">
            <template #default="{ row }"><b>{{ row.pt }}</b></template>
          </el-table-column>
          <el-table-column prop="book" label="预约信息" width="120" />
          <el-table-column prop="plan" label="安排信息" width="120" />
          <el-table-column label="差异项" width="120">
            <template #default="{ row }">
              <TagBox v-if="row.diffTone" :text="row.diff" :tone="row.diffTone" />
              <span v-else>{{ row.diff }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="72" align="center">
            <template #default="{ row }"><TagBox :text="row.st" :tone="row.stTone" /></template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template #default="{ row }">
              <template v-if="row.op === 'notify'">
                <span class="link" @click="smsNotify(row)">短信通知</span> ·
                <span class="link" @click="telNotify(row)">电话通知</span>
              </template>
              <span v-else class="link" @click="toast(`已查看 ${row.pt} 的安排详情`)">查看</span>
            </template>
          </el-table-column>
        </el-table>
      </SectionCard>

      <SectionCard title="通知留痕">
        <InfoList :items="traces" flat />
      </SectionCard>
    </div>

    <!-- 安排手术 -->
    <el-dialog v-model="pickVisible" title="安排手术" width="480px">
      <el-form label-width="88px" label-position="left">
        <el-form-item label="手术间">
          <el-select v-model="pickRoom" style="width: 220px">
            <el-option v-for="r in rooms" :key="r.nm" :label="r.nm" :value="r.nm" />
          </el-select>
        </el-form-item>
        <el-form-item label="患者">
          <el-select v-model="pickForm.pt" style="width: 220px">
            <el-option v-for="p in patients" :key="p.name" :label="p.name" :value="p.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="手术时段">
          <el-input v-model="pickForm.time" style="width: 160px" />
        </el-form-item>
        <el-form-item label="术者">
          <el-input v-model="pickForm.doc" style="width: 160px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="pickVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="doArrange">确认安排</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.rooms {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.room {
  flex: 1;
  min-width: 0;
}
.room :deep(.card-bd) {
  padding: 8px 10px;
}
.case {
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 8px;
  background: #fafcfd;
}
.case.pending {
  background: #fbfdff;
}
.case-hd {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
}
.case-hd b {
  font-size: 12.5px;
}
.case-st {
  margin-left: auto;
}
.case-op {
  font-size: 12.3px;
  color: #33475c;
  line-height: 1.5;
}
.drag {
  border: 1px dashed #d9e3ee;
  border-radius: 6px;
  padding: 7px;
  text-align: center;
  color: #9aaabb;
  font-size: 12px;
  cursor: pointer;
}
.drag:hover {
  border-color: var(--brand);
  color: var(--brand);
  background: var(--blue-bg);
}
</style>
