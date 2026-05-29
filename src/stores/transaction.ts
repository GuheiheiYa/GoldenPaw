import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Transaction, TransactionType } from '@/types/transaction'
import { generateId } from '@/utils/id'
import { getToday, getCurrentTime } from '@/utils/format'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>([])

  function addTransaction(params: {
    type: TransactionType
    amount: number
    categoryId: string
    accountId: string
    toAccountId?: string
    note?: string
    tags?: string[]
    date?: string
    time?: string
  }) {
    const tx: Transaction = {
      id: generateId(),
      type: params.type,
      amount: params.amount,
      categoryId: params.categoryId,
      accountId: params.accountId,
      toAccountId: params.toAccountId,
      date: params.date || getToday(),
      time: params.time || getCurrentTime(),
      note: params.note || '',
      tags: params.tags || [],
      createdAt: Date.now(),
    }
    transactions.value.unshift(tx)
    return tx
  }

  function deleteTransaction(id: string) {
    const idx = transactions.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      transactions.value.splice(idx, 1)
    }
  }

  function updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) {
    const tx = transactions.value.find(t => t.id === id)
    if (!tx) return
    Object.assign(tx, { ...updates, updatedAt: Date.now() })
    return tx
  }

  function getTransactionsByMonth(yearMonth: string): Transaction[] {
    return transactions.value.filter(t => t.date.startsWith(yearMonth))
  }

  function getRecentTransactions(count: number): Transaction[] {
    return transactions.value.slice(0, count)
  }

  function getStatsByDateRange(start: string, end: string) {
    const list = transactions.value.filter(t => t.date >= start && t.date <= end)
    const income = list.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = list.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expense, balance: income - expense }
  }

  const monthlyExpense = computed(() => {
    const prefix = getToday().slice(0, 7)
    return transactions.value
      .filter(t => t.type === 'expense' && t.date.startsWith(prefix))
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const monthlyIncome = computed(() => {
    const prefix = getToday().slice(0, 7)
    return transactions.value
      .filter(t => t.type === 'income' && t.date.startsWith(prefix))
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const monthlyBalance = computed(() => {
    return monthlyIncome.value - monthlyExpense.value
  })

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getTransactionsByMonth,
    getRecentTransactions,
    getStatsByDateRange,
    monthlyExpense,
    monthlyIncome,
    monthlyBalance,
  }
}, {
  persist: true,
})
