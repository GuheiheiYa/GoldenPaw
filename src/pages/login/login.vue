<template>
  <view class="app">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <uni-icons class="back-icon" type="arrow-left" size="20" color="var(--text-secondary)" />
      </view>
      <text class="header-title">{{ isRegister ? '注册账号' : '登录' }}</text>
    </view>

    <view class="content">
      <view class="login-card">
        <text class="login-subtitle">{{ isRegister ? '创建新账号' : '欢迎回来' }}</text>

        <view class="form-field">
          <text class="form-label">邮箱</text>
          <input
            class="form-input"
            v-model="form.email"
            type="text"
            placeholder="请输入邮箱"
            confirm-type="next"
          />
        </view>

        <view class="form-field" v-if="isRegister">
          <text class="form-label">用户名</text>
          <input
            class="form-input"
            v-model="form.username"
            type="text"
            placeholder="给自己起个名字"
            confirm-type="next"
          />
        </view>

        <view class="form-field">
          <text class="form-label">密码</text>
          <input
            class="form-input"
            v-model="form.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            confirm-type="done"
            @confirm="onSubmit"
          />
        </view>

        <view class="form-field" v-if="isRegister">
          <text class="form-label">确认密码</text>
          <input
            class="form-input"
            v-model="form.confirmPassword"
            type="password"
            placeholder="再次输入密码"
            confirm-type="done"
            @confirm="onSubmit"
          />
        </view>

        <view class="login-btn" @tap="onSubmit">
          <text>{{ isRegister ? '注册' : '登录' }}</text>
        </view>

        <view class="toggle-mode" @tap="toggleMode">
          <text>{{ isRegister ? '已有账号？去登录' : '还没有账号？去注册' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { signInWithEmail, signUpWithEmail, createProfile } from '@/utils/supabase'

const userStore = useUserStore()

const isRegister = ref(false)
const form = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
})

function toggleMode() {
  isRegister.value = !isRegister.value
  form.email = ''
  form.username = ''
  form.password = ''
  form.confirmPassword = ''
}

function goBack() {
  uni.navigateBack()
}

function validate(): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) return '请输入邮箱'
  if (!emailRegex.test(form.email.trim())) return '邮箱格式不正确'
  if (isRegister.value && !form.username.trim()) return '请输入用户名'
  if (!form.password) return '请输入密码'
  if (form.password.length < 6) return '密码至少6位'
  if (isRegister.value && form.password !== form.confirmPassword) return '两次密码不一致'
  return null
}

async function onSubmit() {
  const err = validate()
  if (err) {
    uni.showToast({ title: err, icon: 'none' })
    return
  }

  uni.showLoading({ title: isRegister.value ? '注册中...' : '登录中...' })

  try {
    if (isRegister.value) {
      const { data, error } = await signUpWithEmail(form.email.trim(), form.password, form.username.trim())
      if (error) throw error

      if (data.user) {
        // 触发器会自动创建 profile，但如果没触发成功则兜底
        await createProfile(data.user.id, form.username.trim() || form.email.split('@')[0])
        await userStore.setAuthUser(data.user)

        if (data.session) {
          uni.showToast({ title: '注册成功', icon: 'success' })
          setTimeout(() => uni.navigateBack(), 800)
        } else {
          uni.showToast({ title: '注册成功，请查收验证邮件', icon: 'none' })
        }
      }
    } else {
      const { data, error } = await signInWithEmail(form.email.trim(), form.password)
      if (error) throw error

      if (data.user) {
        await userStore.setAuthUser(data.user)
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 800)
      }
    }
  } catch (e: any) {
    const msg = e.message || (isRegister.value ? '注册失败' : '登录失败')
    uni.showToast({ title: msg, icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}
</script>

<style lang="scss" scoped>
@use '../../styles/design-system' as *;
@use '../../styles/mixins' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
}

.header {
  padding: 48px $space-6 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: $radius-circle;
  background: $surface;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-sm;
}

.header-title {
  @include text-h1;
}

.content {
  padding: 0 $space-6;
}

.login-card {
  background: $surface;
  border-radius: $radius-lg;
  padding: 28px;
  box-shadow: $shadow-md;
  border: 1px solid $border;
}

.login-subtitle {
  @include text-h3;
  color: $text-secondary;
  display: block;
  margin-bottom: 24px;
  text-align: center;
}

.form-field {
  margin-bottom: 16px;
}

.form-label {
  @include text-small;
  color: $text-secondary;
  display: block;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  height: 48px;
  background: $bg-secondary;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 0 14px;
  font-size: 16px;
  color: $text-primary;
  box-sizing: border-box;

  &::placeholder {
    color: $text-tertiary;
  }
}

.login-btn {
  margin-top: 24px;
  height: 48px;
  background: $gradient-brand;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  box-shadow: $shadow-brand;
}

.toggle-mode {
  margin-top: 20px;
  text-align: center;

  text {
    @include text-small;
    color: $brand-600;
  }
}
</style>
