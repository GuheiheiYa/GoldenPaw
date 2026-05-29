import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Account } from '@/types/transaction'

const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc-cmb', name: '储蓄卡', type: 'savings', bank: '招商银行', icon: '💳', balance: 6850000 },
  { id: 'acc-alipay', name: '支付宝', type: 'savings', icon: '📱', balance: 1200000 },
  { id: 'acc-wechat', name: '微信零钱', type: 'savings', icon: '💬', balance: 580000 },
  { id: 'acc-cash', name: '现金', type: 'cash', icon: '💵', balance: 820000 },
  { id: 'acc-credit', name: '信用卡', type: 'credit', bank: '招商银行', icon: '💳', balance: -1228000 },
]

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([...DEFAULT_ACCOUNTS])

  function getAccountById(id: string): Account | undefined {
    return accounts.value.find(a => a.id === id)
  }

  function getDefaultAccount(): Account {
    return accounts.value[0]
  }

  function updateBalance(accountId: string, deltaCents: number) {
    const acc = accounts.value.find(a => a.id === accountId)
    if (acc) {
      acc.balance += deltaCents
    }
  }

  function addAccount(params: Omit<Account, 'id' | 'balance'>) {
    const acc: Account = {
      id: `acc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      balance: 0,
      ...params,
    }
    accounts.value.push(acc)
    return acc
  }

  function deleteAccount(id: string) {
    const idx = accounts.value.findIndex(a => a.id === id)
    if (idx !== -1) accounts.value.splice(idx, 1)
  }

  function updateAccount(id: string, updates: Partial<Omit<Account, 'id' | 'balance'>>) {
    const acc = accounts.value.find(a => a.id === id)
    if (acc) {
      Object.assign(acc, updates)
    }
    return acc
  }

  return {
    accounts,
    getAccountById,
    getDefaultAccount,
    updateBalance,
    addAccount,
    deleteAccount,
    updateAccount,
  }
}, {
  persist: true,
})
