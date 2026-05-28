import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const showRecordSheet = ref(false)
  const currentTab = ref(0)

  function toggleRecordSheet() {
    showRecordSheet.value = !showRecordSheet.value
  }

  function openRecordSheet() {
    showRecordSheet.value = true
  }

  function closeRecordSheet() {
    showRecordSheet.value = false
  }

  function setCurrentTab(index: number) {
    currentTab.value = index
  }

  return {
    showRecordSheet,
    currentTab,
    toggleRecordSheet,
    openRecordSheet,
    closeRecordSheet,
    setCurrentTab,
  }
})
