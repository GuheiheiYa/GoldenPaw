import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateId } from '@/utils/id'
import { getToday } from '@/utils/format'
import { useTransactionStore } from './transaction'

export interface Goal {
  id: string
  icon: string
  name: string
  targetAmount: number
  savedAmount: number
  deadline?: string
}

export interface Budget {
  id: string
  categoryId: string
  amount: number
}

const DEFAULT_GOALS: Goal[] = [
  { id: 'goal-1', icon: '✈️', name: '年底旅行基金', targetAmount: 2000000, savedAmount: 1300000, deadline: '2026-12-31' },
  { id: 'goal-2', icon: '📱', name: '换新手机', targetAmount: 800000, savedAmount: 320000, deadline: '2026-08-31' },
  { id: 'goal-3', icon: '🎁', name: '应急备用金', targetAmount: 5000000, savedAmount: 500000 },
]

const DEFAULT_BUDGETS: Budget[] = [
  { id: 'bdg-1', categoryId: 'cat-food', amount: 200000 },
  { id: 'bdg-2', categoryId: 'cat-transport', amount: 50000 },
  { id: 'bdg-3', categoryId: 'cat-housing', amount: 300000 },
  { id: 'bdg-4', categoryId: 'cat-shopping', amount: 150000 },
]

export const useGoalBudgetStore = defineStore('goalBudget', () => {
  const goals = ref<Goal[]>([...DEFAULT_GOALS])
  const budgets = ref<Budget[]>([...DEFAULT_BUDGETS])

  /* ─── Goals ─── */
  function addGoal(params: Omit<Goal, 'id' | 'savedAmount'>) {
    const goal: Goal = {
      id: generateId(),
      savedAmount: 0,
      ...params,
    }
    goals.value.push(goal)
    return goal
  }

  function updateGoal(id: string, updates: Partial<Omit<Goal, 'id'>>) {
    const g = goals.value.find(x => x.id === id)
    if (g) Object.assign(g, updates)
    return g
  }

  function deleteGoal(id: string) {
    const idx = goals.value.findIndex(x => x.id === id)
    if (idx !== -1) goals.value.splice(idx, 1)
  }

  function depositToGoal(id: string, amount: number) {
    const g = goals.value.find(x => x.id === id)
    if (g) g.savedAmount = Math.min(g.savedAmount + amount, g.targetAmount)
    return g
  }

  /* ─── Budgets ─── */
  function addBudget(params: Omit<Budget, 'id'>) {
    const b: Budget = { id: generateId(), ...params }
    budgets.value.push(b)
    return b
  }

  function updateBudget(id: string, updates: Partial<Omit<Budget, 'id'>>) {
    const b = budgets.value.find(x => x.id === id)
    if (b) Object.assign(b, updates)
    return b
  }

  function deleteBudget(id: string) {
    const idx = budgets.value.findIndex(x => x.id === id)
    if (idx !== -1) budgets.value.splice(idx, 1)
  }

  /* ─── Computed: budget usage this month ─── */
  const budgetUsage = computed(() => {
    const txStore = useTransactionStore()
    const prefix = getToday().slice(0, 7)
    const monthTxs = txStore.transactions.filter(t => t.type === 'expense' && t.date.startsWith(prefix))

    const usedByCategory = new Map<string, number>()
    for (const tx of monthTxs) {
      usedByCategory.set(tx.categoryId, (usedByCategory.get(tx.categoryId) || 0) + tx.amount)
    }

    return budgets.value.map(b => {
      const used = usedByCategory.get(b.categoryId) || 0
      return {
        ...b,
        used,
        remaining: Math.max(b.amount - used, 0),
        pct: b.amount > 0 ? Math.min(Math.round((used / b.amount) * 100), 100) : 0,
        over: used > b.amount,
      }
    })
  })

  const totalBudget = computed(() => budgets.value.reduce((s, b) => s + b.amount, 0))
  const totalBudgetUsed = computed(() => budgetUsage.value.reduce((s, b) => s + b.used, 0))

  return {
    goals,
    budgets,
    budgetUsage,
    totalBudget,
    totalBudgetUsed,
    addGoal,
    updateGoal,
    deleteGoal,
    depositToGoal,
    addBudget,
    updateBudget,
    deleteBudget,
  }
}, {
  persist: true,
})
