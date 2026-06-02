import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateId } from '@/utils/id'
import { getToday } from '@/utils/format'
import type { RecurringTransaction, RecurringCycle } from '@/types/transaction'

/**
 * 定期交易 Store
 * 管理周期性自动记账规则（如每月8号车贷、每周一早餐等）
 */
export const useRecurringStore = defineStore('recurring', () => {
  /** 定期交易规则列表 */
  const rules = ref<RecurringTransaction[]>([])

  /** 启用的规则数量 */
  const enabledCount = computed(() => rules.value.filter(r => r.enabled).length)

  /**
   * 添加定期交易规则
   */
  function addRule(rule: Omit<RecurringTransaction, 'id' | 'createdAt'>) {
    const newRule: RecurringTransaction = {
      ...rule,
      id: generateId(),
      createdAt: Date.now(),
    }
    rules.value.push(newRule)
    return newRule
  }

  /**
   * 更新规则
   */
  function updateRule(id: string, updates: Partial<Omit<RecurringTransaction, 'id' | 'createdAt'>>) {
    const idx = rules.value.findIndex(r => r.id === id)
    if (idx >= 0) {
      rules.value[idx] = { ...rules.value[idx], ...updates }
    }
  }

  /**
   * 删除规则
   */
  function deleteRule(id: string) {
    const idx = rules.value.findIndex(r => r.id === id)
    if (idx >= 0) {
      rules.value.splice(idx, 1)
    }
  }

  /**
   * 切换启用状态
   */
  function toggleEnabled(id: string) {
    const rule = rules.value.find(r => r.id === id)
    if (rule) {
      rule.enabled = !rule.enabled
    }
  }

  /**
   * 获取今天需要执行的规则列表
   */
  function getDueRules(): RecurringTransaction[] {
    const today = getToday()
    return rules.value.filter(r => r.enabled && r.nextDate <= today)
  }

  /**
   * 计算下一个执行日期
   */
  function calcNextDate(cycle: RecurringCycle, dayOfMonth: number, fromDate?: string): string {
    const base = fromDate ? new Date(fromDate) : new Date()
    base.setHours(0, 0, 0, 0)

    switch (cycle) {
      case 'daily': {
        base.setDate(base.getDate() + 1)
        break
      }
      case 'weekly': {
        base.setDate(base.getDate() + 7)
        break
      }
      case 'monthly': {
        base.setMonth(base.getMonth() + 1)
        // 处理月末（如 31 日 -> 下月可能没有 31 日）
        const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
        base.setDate(Math.min(dayOfMonth, lastDay))
        break
      }
      case 'yearly': {
        base.setFullYear(base.getFullYear() + 1)
        break
      }
    }

    const y = base.getFullYear()
    const m = String(base.getMonth() + 1).padStart(2, '0')
    const d = String(base.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  /**
   * 执行规则后更新下次执行日期
   */
  function advanceNextDate(id: string) {
    const rule = rules.value.find(r => r.id === id)
    if (rule) {
      rule.nextDate = calcNextDate(rule.cycle, rule.dayOfMonth, rule.nextDate)
    }
  }

  return {
    rules,
    enabledCount,
    addRule,
    updateRule,
    deleteRule,
    toggleEnabled,
    getDueRules,
    calcNextDate,
    advanceNextDate,
  }
}, {
  persist: true,
})
