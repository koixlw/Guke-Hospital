<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import PatientBand from '@/components/PatientBand.vue'
import TagBox from '@/components/TagBox.vue'
import MiniStat from '@/components/MiniStat.vue'
import IconSvg from '@/components/IconSvg.vue'

const toast = (m) => ElMessage.success(m)

/* 报到方式 */
const applyNo = ref('DZ20261102007')

/* 术前检查检验报告 */
const reports = [
  { nm: '血常规（五分类）', tm: '2026-10-30 10:05', cc: '未见明显异常' },
  { nm: '凝血四项', tm: '2026-10-30 10:05', cc: '凝血功能基本正常' },
  { nm: '心电图（十二导联）', tm: '2026-10-30 09:25', cc: '窦性心律，大致正常' },
  { nm: '右膝关节 MRI（3.0T）', tm: '2026-10-31 09:40', cc: '内侧半月板Ⅲ度撕裂' }
]

/* 术中药品 */
const drugs = [
  { nm: '盐酸罗哌卡因注射液', spec: '100mg/10ml', dose: '15mg', way: '蛛网膜下腔注射' },
  { nm: '枸橼酸舒芬太尼注射液', spec: '50μg/1ml', dose: '5μg', way: '蛛网膜下腔注射' },
  { nm: '注射用头孢呋辛钠', spec: '1.5g', dose: '1.5g', way: '静脉滴注（术前 30 分钟）' }
]

/* 报到信息 */
const checkin = [
  { k: '报到时间', v: '2026-11-02 08:12' },
  { k: '报到方式', v: '扫申请单条码' },
  { k: '报到护士', v: '何静' },
  { k: '手术间 / 台次', v: '1 间 / 第 1 台' }
]
</script>

<template>
  <div>
    <PageHeader
      title="手术登记"
      sub="扫申请单条码 / 刷医保卡·就诊卡·身份证 / 手工输入病历号或申请单号报到 · 查看报告与术中药品 · 打印知情同意书"
    >
      <template #actions>
        <el-button type="primary" size="small" @click="toast('知情同意书已发送至打印')">
          <IconSvg name="print" :size="13" />打印手术知情同意书
        </el-button>
      </template>
    </PageHeader>

    <SectionCard bare>
      <div style="display: flex; gap: 10px; align-items: center">
        <span class="chk-chip on"><IconSvg name="scan" :size="12" /> 扫申请单条码</span>
        <span class="chk-chip">刷医保卡</span>
        <span class="chk-chip">刷就诊卡</span>
        <span class="chk-chip">刷身份证</span>
        <span class="chk-chip">手工输入病历号</span>
        <span class="chk-chip">手工输入申请单号</span>
        <span style="width: 1px; height: 20px; background: var(--line); margin: 0 4px" />
        <el-input
          v-model="applyNo"
          placeholder="扫码后自动填入"
          style="width: 230px; flex: 0 0 230px"
        />
        <el-button type="primary" size="small" @click="toast('报到登记成功')">
          <IconSvg name="ok" :size="13" />报到登记
        </el-button>
        <span class="hint" style="margin-left: auto">
          设备：扫码枪（USB-HID）已连接 · 读卡器已连接
        </span>
      </div>
    </SectionCard>

    <div style="height: 12px" />

    <PatientBand>
      <template #extra><TagBox text="已报到" tone="g" /></template>
    </PatientBand>

    <div style="height: 12px" />

    <div class="grid g-side">
      <div>
        <SectionCard title="术前检查检验报告" tight>
          <template #right>共 7 份 · 全部已回传</template>
          <el-table :data="reports" style="width: 100%">
            <el-table-column prop="nm" label="项目名称" min-width="180" show-overflow-tooltip />
            <el-table-column prop="tm" label="报告时间" width="150" class-name="num" />
            <el-table-column prop="cc" label="结论" width="130" />
            <el-table-column label="操作" width="72" align="center">
              <template #default>
                <span class="link" @click="toast('报告已打开')">查看</span>
              </template>
            </el-table-column>
          </el-table>
        </SectionCard>

        <SectionCard title="术中药品（麻醉药 / 抗菌药）" tight>
          <template #right>来源：手术医嘱 · 费用已记账</template>
          <el-table :data="drugs" style="width: 100%">
            <el-table-column prop="nm" label="药品名称" min-width="180" show-overflow-tooltip />
            <el-table-column prop="spec" label="规格" width="110" class-name="mono" />
            <el-table-column prop="dose" label="剂量" width="80" class-name="num" />
            <el-table-column prop="way" label="给药途径" width="190" />
          </el-table>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="报到信息" tight>
          <table class="tb-plain">
            <tbody>
              <tr v-for="c in checkin" :key="c.k">
                <td style="width: 88px; color: #7b8fa3">{{ c.k }}</td>
                <td>{{ c.v }}</td>
              </tr>
              <tr>
                <td style="color: #7b8fa3">术前核对</td>
                <td>
                  <TagBox text="已核对" tone="g" />
                  <span style="margin-left: 4px">身份·术式·部位·过敏史</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="margin: 10px 14px">
            <el-button size="small" @click="toast('知情同意书已套打')">
              <IconSvg name="print" :size="13" />打印知情同意书（套打模板）
            </el-button>
          </div>
        </SectionCard>

        <SectionCard title="今日报到统计">
          <div style="display: flex; gap: 10px">
            <MiniStat label="已报到" :value="6" tone="good" />
            <MiniStat label="未报到" :value="2" tone="warn" />
          </div>
          <div class="hint" style="margin-top: 9px; line-height: 1.9">
            未报到患者将于 09:30 自动短信提醒；超时未到转日间手术中心电话确认。
          </div>
        </SectionCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tb-plain {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
.tb-plain td {
  padding: 8px 14px;
  border-bottom: 1px solid #eef2f7;
  color: #33475c;
}
.tb-plain tr:last-child td {
  border-bottom: none;
}
</style>
