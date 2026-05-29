import type { CycleType } from '@/stores/app'

/**
 * 根据记账周期类型，返回当前周期的起止日期
 */
export function getCycleRange(type: CycleType): { start: string; end: string } {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-based
  const day = now.getDate()

  if (type === 'salary') {
    // 工资周期：上月25日 ~ 本月24日
    let startYear = year
    let startMonth = month - 1
    if (startMonth < 0) {
      startMonth = 11
      startYear -= 1
    }
    const start = formatDate(startYear, startMonth, 25)
    const end = formatDate(year, month, 24)
    return { start, end }
  }

  if (type === 'custom') {
    // 自定义周期：暂按自然月处理（后续可扩展为自定义起止日）
    const start = formatDate(year, month, 1)
    const end = formatDate(year, month, lastDayOfMonth(year, month))
    return { start, end }
  }

  // 自然月（默认）
  const start = formatDate(year, month, 1)
  const end = formatDate(year, month, lastDayOfMonth(year, month))
  return { start, end }
}

function formatDate(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function lastDayOfMonth(y: number, m: number): number {
  return new Date(y, m + 1, 0).getDate()
}
