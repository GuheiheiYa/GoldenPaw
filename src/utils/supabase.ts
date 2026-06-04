/**
 * Supabase 客户端配置
 * 用于云同步：数据上传/下载/合并
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
    autoRefreshToken: false,
    persistSession: false,
  },
})

/** 检查 Supabase 是否已配置 */
export function isSupabaseConfigured(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY
}
