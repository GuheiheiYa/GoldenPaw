import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, getProfile, updateProfile, createProfile } from '@/utils/supabase'
import type { Profile } from '@/utils/supabase'

export interface UserInfo {
  id: string
  email: string
  username: string
  avatarUrl: string | null
  syncKey: string | null
}

export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo | null>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!user.value)

  /** 设置用户信息 */
  function setUser(info: UserInfo | null) {
    user.value = info
  }

  /** 从 Supabase Session 恢复用户 + 拉取 profile */
  async function restoreSession() {
    loading.value = true
    try {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        await setAuthUser(data.session.user)
        return true
      }
      user.value = null
      profile.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  /** 根据 auth.user 设置本地用户（并拉取 profile） */
  async function setAuthUser(authUser: any) {
    const email = authUser.email || ''
    const fallbackName = email.split('@')[0] || '用户'

    // 拉取 profiles 表
    let p = await getProfile(authUser.id)

    // 如果 profile 不存在，尝试创建（兜底）
    if (!p) {
      const { data: newP } = await createProfile(authUser.id, fallbackName)
      p = newP
    }

    profile.value = p

    user.value = {
      id: authUser.id,
      email,
      username: p?.username || authUser.user_metadata?.username || fallbackName,
      avatarUrl: p?.avatar_url || authUser.user_metadata?.avatar_url || null,
      syncKey: p?.sync_key || null,
    }

    return user.value
  }

  /** 监听 Auth 状态变化 */
  function subscribeAuthChanges() {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await setAuthUser(session.user)
      } else if (event === 'SIGNED_OUT') {
        user.value = null
        profile.value = null
      } else if (event === 'USER_UPDATED' && session?.user) {
        await setAuthUser(session.user)
      }
    })
    return data.subscription
  }

  /** 更新本地及云端用户名 */
  async function updateUsername(name: string): Promise<boolean> {
    if (!user.value) return false
    const { data, error } = await updateProfile(user.value.id, { username: name })
    if (error || !data) return false
    user.value.username = data.username
    if (profile.value) profile.value.username = data.username
    return true
  }

  /** 更新本地及云端头像 */
  async function updateAvatarUrl(url: string): Promise<boolean> {
    if (!user.value) return false
    const { data, error } = await updateProfile(user.value.id, { avatar_url: url })
    if (error || !data) return false
    user.value.avatarUrl = data.avatar_url
    if (profile.value) profile.value.avatar_url = data.avatar_url
    return true
  }

  /** 更新 syncKey 到 profile */
  async function updateSyncKey(key: string): Promise<boolean> {
    if (!user.value) return false
    const { data, error } = await updateProfile(user.value.id, { sync_key: key })
    if (error || !data) return false
    user.value.syncKey = data.sync_key
    if (profile.value) profile.value.sync_key = data.sync_key
    return true
  }

  return {
    user,
    profile,
    loading,
    isLoggedIn,
    setUser,
    restoreSession,
    setAuthUser,
    subscribeAuthChanges,
    updateUsername,
    updateAvatarUrl,
    updateSyncKey,
  }
})
