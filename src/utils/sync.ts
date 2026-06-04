/**
 * 云同步工具
 * 通过 Supabase 实现多设备数据同步
 *
 * 同步策略：
 * - 每个 store 的数据独立存储为 JSON 快照
 * - 使用 syncKey 标识用户（存储在 appStore）
 * - 上传：将本地 store 数据序列化为 JSON，upsert 到云端
 * - 下载：从云端读取 JSON，反序列化后覆盖本地 store
 * - 冲突处理：以 updated_at 时间戳为准，云端更新则覆盖本地
 */

import { supabase, isSupabaseConfigured } from './supabase'
import { useAppStore } from '@/stores/app'
import { useTransactionStore } from '@/stores/transaction'
import { useAccountStore } from '@/stores/account'
import { useCategoryStore } from '@/stores/category'
import { useGoalBudgetStore } from '@/stores/goalBudget'
import { useRecurringStore } from '@/stores/recurring'

export type SyncStatus = 'idle' | 'uploading' | 'downloading' | 'success' | 'error'

/** 所有可同步的 store 名称 */
const SYNC_STORES = [
  'transactions',
  'accounts',
  'categories',
  'goalBudget',
  'recurring',
  'appSettings',
] as const

/** 生成同步码 */
export function generateSyncKey(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/** 获取当前 syncKey */
function getSyncKey(): string {
  const appStore = useAppStore()
  if (!appStore.syncKey) {
    appStore.setSyncKey(generateSyncKey())
  }
  return appStore.syncKey
}

/**
 * 上传本地数据到云端
 */
export async function uploadToCloud(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: '请先配置 Supabase（.env 中设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY）' }
  }

  try {
    const syncKey = getSyncKey()
    const txStore = useTransactionStore()
    const accStore = useAccountStore()
    const catStore = useCategoryStore()
    const gbStore = useGoalBudgetStore()
    const recStore = useRecurringStore()
    const appStore = useAppStore()

    const snapshots = [
      { store_name: 'transactions', data: { transactions: txStore.transactions } },
      { store_name: 'accounts', data: { accounts: accStore.accounts } },
      { store_name: 'categories', data: { expenseCategories: catStore.expenseCategories, incomeCategories: catStore.incomeCategories } },
      { store_name: 'goalBudget', data: { goals: gbStore.goals, budgets: gbStore.budgets } },
      { store_name: 'recurring', data: { rules: recStore.rules } },
      { store_name: 'appSettings', data: { theme: appStore.theme, cycle: appStore.cycle, currency: appStore.currency, reminderEnabled: appStore.reminderEnabled, budgetAlertEnabled: appStore.budgetAlertEnabled } },
    ]

    for (const snap of snapshots) {
      const { error } = await supabase
        .from('sync_data')
        .upsert(
          {
            sync_key: syncKey,
            store_name: snap.store_name,
            data_json: snap.data,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'sync_key,store_name' }
        )
      if (error) throw error
    }

    return { success: true, message: '同步成功！数据已上传到云端' }
  } catch (err: any) {
    console.error('[Sync] 上传失败:', err)
    return { success: false, message: err.message || '同步失败，请检查网络' }
  }
}

/**
 * 从云端下载数据覆盖本地
 */
export async function downloadFromCloud(syncKey?: string): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: '请先配置 Supabase' }
  }

  const key = syncKey || getSyncKey()
  if (!key) {
    return { success: false, message: '请输入同步码' }
  }

  try {
    const { data, error } = await supabase
      .from('sync_data')
      .select('store_name, data_json, updated_at')
      .eq('sync_key', key)

    if (error) throw error
    if (!data || data.length === 0) {
      return { success: false, message: '云端无数据，请先在其他设备上同步' }
    }

    const txStore = useTransactionStore()
    const accStore = useAccountStore()
    const catStore = useCategoryStore()
    const gbStore = useGoalBudgetStore()
    const recStore = useRecurringStore()
    const appStore = useAppStore()

    for (const row of data) {
      const json = row.data_json as any
      switch (row.store_name) {
        case 'transactions':
          if (json.transactions) txStore.transactions = json.transactions
          break
        case 'accounts':
          if (json.accounts) accStore.accounts = json.accounts
          break
        case 'categories':
          if (json.expenseCategories) catStore.expenseCategories = json.expenseCategories
          if (json.incomeCategories) catStore.incomeCategories = json.incomeCategories
          break
        case 'goalBudget':
          if (json.goals) gbStore.goals = json.goals
          if (json.budgets) gbStore.budgets = json.budgets
          break
        case 'recurring':
          if (json.rules) recStore.rules = json.rules
          break
        case 'appSettings':
          if (json.theme) appStore.theme = json.theme
          if (json.cycle) appStore.cycle = json.cycle
          if (json.currency) appStore.setCurrency(json.currency)
          if (json.reminderEnabled !== undefined) appStore.reminderEnabled = json.reminderEnabled
          if (json.budgetAlertEnabled !== undefined) appStore.budgetAlertEnabled = json.budgetAlertEnabled
          break
      }
    }

    // 如果使用了新的 syncKey，保存到本地
    if (syncKey && syncKey !== appStore.syncKey) {
      appStore.setSyncKey(syncKey)
    }

    return { success: true, message: '同步成功！云端数据已恢复到本地' }
  } catch (err: any) {
    console.error('[Sync] 下载失败:', err)
    return { success: false, message: err.message || '同步失败，请检查网络' }
  }
}

/**
 * 获取云端数据最后更新时间
 */
export async function getCloudLastUpdate(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null

  try {
    const key = getSyncKey()
    const { data, error } = await supabase
      .from('sync_data')
      .select('updated_at')
      .eq('sync_key', key)
      .order('updated_at', { ascending: false })
      .limit(1)

    if (error || !data || data.length === 0) return null
    return data[0].updated_at
  } catch {
    return null
  }
}
