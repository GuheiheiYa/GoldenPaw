/**
 * 云同步工具
 * 通过 Supabase 实现多设备数据同步
 *
 * 同步策略：
 * - 所有 store 数据合成一条 JSON 快照
 * - 使用 syncKey 标识用户（存储在 appStore）
 * - 上传：将本地全部数据序列化为 JSON，upsert 到云端
 * - 下载：从云端读取 JSON，反序列化后覆盖本地 store
 */

import { supabase, isSupabaseConfigured, updateProfile } from './supabase'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useTransactionStore } from '@/stores/transaction'
import { useAccountStore } from '@/stores/account'
import { useCategoryStore } from '@/stores/category'
import { useGoalBudgetStore } from '@/stores/goalBudget'
import { useRecurringStore } from '@/stores/recurring'

export type SyncStatus = 'idle' | 'uploading' | 'downloading' | 'success' | 'error'

/** 生成同步码 */
export function generateSyncKey(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/** 获取当前 syncKey */
function getSyncKey(): string {
  const appStore = useAppStore()
  const userStore = useUserStore()

  // 已登录用户优先使用 profile 中的 sync_key
  if (userStore.isLoggedIn && userStore.user?.syncKey) {
    return userStore.user.syncKey
  }

  if (!appStore.syncKey) {
    appStore.setSyncKey(generateSyncKey())
  }
  return appStore.syncKey
}

/** 打包本地全部数据 */
function packLocalData() {
  const txStore = useTransactionStore()
  const accStore = useAccountStore()
  const catStore = useCategoryStore()
  const gbStore = useGoalBudgetStore()
  const recStore = useRecurringStore()
  const appStore = useAppStore()

  return {
    transactions: txStore.transactions,
    accounts: accStore.accounts,
    expenseCategories: catStore.expenseCategories,
    incomeCategories: catStore.incomeCategories,
    goals: gbStore.goals,
    budgets: gbStore.budgets,
    rules: recStore.rules,
    theme: appStore.theme,
    cycle: appStore.cycle,
    currency: appStore.currency,
    reminderEnabled: appStore.reminderEnabled,
    budgetAlertEnabled: appStore.budgetAlertEnabled,
    syncKey: appStore.syncKey,
  }
}

/** 解包云端数据覆盖本地 */
function unpackCloudData(json: any) {
  const txStore = useTransactionStore()
  const accStore = useAccountStore()
  const catStore = useCategoryStore()
  const gbStore = useGoalBudgetStore()
  const recStore = useRecurringStore()
  const appStore = useAppStore()

  if (json.transactions) txStore.transactions = json.transactions
  if (json.accounts) accStore.accounts = json.accounts
  if (json.expenseCategories) catStore.expenseCategories = json.expenseCategories
  if (json.incomeCategories) catStore.incomeCategories = json.incomeCategories
  if (json.goals) gbStore.goals = json.goals
  if (json.budgets) gbStore.budgets = json.budgets
  if (json.rules) recStore.rules = json.rules
  if (json.theme) appStore.theme = json.theme
  if (json.cycle) appStore.cycle = json.cycle
  if (json.currency) appStore.setCurrency(json.currency)
  if (json.reminderEnabled !== undefined) appStore.reminderEnabled = json.reminderEnabled
  if (json.budgetAlertEnabled !== undefined) appStore.budgetAlertEnabled = json.budgetAlertEnabled
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
    const payload = packLocalData()

    const { error } = await supabase
      .from('sync_data')
      .upsert(
        {
          sync_key: syncKey,
          store_name: 'all',
          data_json: payload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'sync_key,store_name' }
      )

    if (error) throw error

    // 已登录用户将 syncKey 写入 profile，换设备登录自动恢复
    const userStore = useUserStore()
    if (userStore.isLoggedIn) {
      await updateProfile(userStore.user.id, { sync_key: syncKey })
      userStore.user.syncKey = syncKey
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
      .select('data_json')
      .eq('sync_key', key)
      .eq('store_name', 'all')
      .single()

    if (error) throw error
    if (!data) {
      return { success: false, message: '云端无数据，请先在其他设备上同步' }
    }

    unpackCloudData(data.data_json)

    // 如果使用了新的 syncKey，保存到本地
    const appStore = useAppStore()
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
      .eq('store_name', 'all')
      .single()

    if (error || !data) return null
    return data.updated_at
  } catch {
    return null
  }
}
