/* ================= 通用格式化 / 状态映射 ================= */

/** 金额：千分位 + 两位小数 */
export const money = (n) =>
  Number(n || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** 状态 → Element Plus el-tag 类型 */
const STATUS_TYPE = {
  报告已回传: 'success',
  已送达: 'success',
  已完成: 'info',
  已安排: 'primary',
  待手术: 'warning',
  待评估: 'warning',
  待缴费: 'danger',
  待入院: 'primary',
  已冻结: 'primary',
  已转入住院: 'success',
  未安排: 'warning',
  已结算: 'info',
  待通知: 'warning',
  已核验: 'success',
  一致: 'success',
  成功: 'success'
}

export const statusType = (s) => STATUS_TYPE[s] || 'info'

/** 业务状态标签配色（沿用原演示系统语义色） */
const STATUS_TONE = {
  报告已回传: 'g',
  已送达: 'g',
  已完成: 'gy',
  已安排: 'b',
  待手术: 'o',
  待评估: 'o',
  待缴费: 'r',
  待入院: 't',
  已冻结: 'b',
  已转入住院: 'g',
  未安排: 'o',
  已结算: 'gy',
  待通知: 'o',
  成功: 'g'
}

export const statusTone = (s) => STATUS_TONE[s] || 'gy'

/** 状态 → el-tag 类型（用于流程类标签） */
export const toneToTagType = (tone) =>
  ({ g: 'success', gy: 'info', o: 'warning', r: 'danger', b: 'primary', t: 'primary' })[tone] || 'info'
