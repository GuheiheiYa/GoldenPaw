import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateId } from '@/utils/id'

/** 待确认项 */
export interface PendingItem {
  id: string
  sourceIcon: string
  sourceName: string
  sourceIconBg: string
  time: string
  rawText: string
  amount: string
  merchant: string
  parsedTime: string
  category: string
  categoryId: string
  account: string
}

/** 监听来源 */
export interface PendingSource {
  icon: string
  name: string
  iconBg: string
  enabled: boolean
}

export const usePendingStore = defineStore('pending', () => {
  const items = ref<PendingItem[]>([])
  const sources = ref<PendingSource[]>([
    { icon: '🏦', name: '招商银行', iconBg: 'linear-gradient(135deg, #E8F1F5, #D6E5EC)', enabled: true },
    { icon: '💳', name: '支付宝', iconBg: 'linear-gradient(135deg, #E8F0E8, #D4E6D4)', enabled: true },
    { icon: '💬', name: '微信支付', iconBg: 'linear-gradient(135deg, #FAF0E6, #F5E6D3)', enabled: false },
  ])

  /** 添加待确认项 */
  function addItem(item: Omit<PendingItem, 'id'>) {
    items.value.push({ ...item, id: generateId() })
  }

  /** 确认入账后移除 */
  function confirmItem(id: string) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) items.value.splice(idx, 1)
  }

  /** 编辑待确认项 */
  function editItem(id: string, updates: Partial<Pick<PendingItem, 'amount' | 'merchant' | 'category' | 'categoryId'>>) {
    const item = items.value.find(i => i.id === id)
    if (item) Object.assign(item, updates)
  }

  /** 忽略/删除待确认项 */
  function removeItem(id: string) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) items.value.splice(idx, 1)
  }

  /** 切换来源开关 */
  function toggleSource(name: string) {
    const source = sources.value.find(s => s.name === name)
    if (source) source.enabled = !source.enabled
  }

  return { items, sources, addItem, confirmItem, editItem, removeItem, toggleSource }
}, {
  persist: true,
})
