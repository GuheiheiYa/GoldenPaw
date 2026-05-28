/**
 * 格式化金额（分 → 元）
 * @param cents 金额（分）
 * @param showSign 是否显示正负号
 */
export function formatAmount(cents: number, showSign = false): string {
  const yuan = (cents / 100).toFixed(2)
  const formatted = Number(yuan).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  if (showSign && cents > 0) return `+¥${formatted}`
  return `¥${formatted}`
}

/**
 * 格式化日期
 * @param dateStr YYYY-MM-DD
 * @returns MM-DD 格式
 */
export function formatDate(dateStr: string): string {
  const parts = dateStr.split('-')
  return `${parts[1]}-${parts[2]}`
}

/**
 * 获取今天的日期字符串
 */
export function getToday(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * 获取当前时间字符串
 */
export function getCurrentTime(): string {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}
