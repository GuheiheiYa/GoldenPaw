import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const showRecordSheet = ref(false)
  const currentTab = ref(0)
  const editTransactionId = ref('')
  const reminderEnabled = ref(true)
  const budgetAlertEnabled = ref(true)

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

  return {
    showRecordSheet,
    currentTab,
    editTransactionId,
    reminderEnabled,
    budgetAlertEnabled,
    toggleRecordSheet,
    openRecordSheet,
    openEditRecordSheet,
    closeRecordSheet,
    setCurrentTab,
  }
})
