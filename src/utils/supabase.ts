/**
 * Supabase 客户端配置
 * 用于：
 * - 云同步：数据上传/下载/合并
 * - Auth：用户登录/注册/会话管理
 * - Profiles：用户扩展信息（头像、用户名等）
 *
 * 使用前需在 .env 中配置：
 * VITE_SUPABASE_URL=your-project-url
 * VITE_SUPABASE_ANON_KEY=your-anon-key
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

/** 检查 Supabase 是否已配置 */
export function isSupabaseConfigured(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY
}

/** 获取当前会话（可用于启动时恢复登录状态） */
export async function getCurrentSession() {
  if (!isSupabaseConfigured()) return { session: null, user: null }
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) return { session: null, user: null }
  return { session: data.session, user: data.session.user }
}

/** 邮箱+密码注册 */
export async function signUpWithEmail(email: string, password: string, username?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  })
  return { data, error }
}

/** 邮箱+密码登录 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

/** 退出登录 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/* ============================================================
 * Profiles 相关 API
 * ============================================================ */

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  sync_key: string | null
  created_at: string
  updated_at: string
}

/** 根据 userId 获取 profile */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('[Supabase] getProfile error:', error)
    return null
  }
  return data as Profile
}

/** 更新 profile（记录不存在时自动插入） */
export async function updateProfile(userId: string, updates: Partial<Pick<Profile, 'username' | 'avatar_url' | 'sync_key'>>) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates })
    .select()
    .single()

  return { data: data as Profile | null, error }
}

/** 创建 profile（注册成功后调用，如果触发器未生效时兜底） */
export async function createProfile(userId: string, username: string, syncKey?: string) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, username, sync_key: syncKey || null })
    .select()
    .single()

  return { data: data as Profile | null, error }
}
