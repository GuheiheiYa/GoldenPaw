import { defineStore } from 'pinia'
import { ref } from 'vue'

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
  }
}, {
  persist: true,
})
