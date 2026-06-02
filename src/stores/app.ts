import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { setCurrencySymbol } from '@/utils/format'

const THEME_STORAGE_KEY = 'goldenpaw_theme'

export type CycleType = 'natural' | 'salary' | 'custom'

export const useAppStore = defineStore('app', () => {
  const showRecordSheet = ref(false)
  const currentTab = ref(0)
  const editTransactionId = ref('')
  const reminderEnabled = ref(true)
  const budgetAlertEnabled = ref(true)
  const theme = ref<string>(uni.getStorageSync(THEME_STORAGE_KEY) || 'warm')
  const cycle = ref<CycleType>('natural')
  const appPassword = ref('') // 空字符串表示未设置密码
  const currency = ref('CNY')

  function toggleRecordSheet() {
    showRecordSheet.value = !showRecordSheet.value
  }

  function openRecordSheet() {
    editTransactionId.value = ''
    showRecordSheet.value = true
  }

  function openEditRecordSheet(txId: string) {
    editTransactionId.value = txId
    showRecordSheet.value = true
  }

  function closeRecordSheet() {
    showRecordSheet.value = false
    editTransactionId.value = ''
  }

  function setCurrentTab(index: number) {
    currentTab.value = index
  }

  function setTheme(newTheme: string) {
    theme.value = newTheme
    uni.setStorageSync(THEME_STORAGE_KEY, newTheme)
  }

  function setCycle(type: CycleType) {
    cycle.value = type
  }

  function setPassword(pwd: string) {
    appPassword.value = pwd
  }

  function setCurrency(code: string) {
    currency.value = code
    setCurrencySymbol(code)
  }

  // 初始化时同步持久化的币种到 format.ts
  watch(currency, (val) => {
    setCurrencySymbol(val)
  }, { immediate: true })

  return {
    showRecordSheet,
    currentTab,
    editTransactionId,
    reminderEnabled,
    budgetAlertEnabled,
    theme,
    cycle,
    appPassword,
    toggleRecordSheet,
    openRecordSheet,
    openEditRecordSheet,
    closeRecordSheet,
    setCurrentTab,
    setTheme,
    setCycle,
    setPassword,
    currency,
    setCurrency,
  }
}, {
  persist: true,
})
