<script setup lang="ts">
import { onLaunch, onShow } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { seedAllStores } from '@/mock/seed'

const appStore = useAppStore()
const locked = ref(false)
const lockInput = ref('')

onLaunch(() => {
  console.log('GoldenPaw App Launched')
  seedAllStores()

  // #ifdef H5
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-theme', appStore.theme)
  }
  // #endif
})

onShow(() => {
  if (appStore.appPassword) {
    locked.value = true
    lockInput.value = ''
  }
})

watch(() => appStore.theme, (newTheme) => {
  // #ifdef H5
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-theme', newTheme)
  }
  // #endif
})

function onLockConfirm() {
  if (lockInput.value === appStore.appPassword) {
    locked.value = false
    lockInput.value = ''
  } else {
    uni.showToast({ title: '密码错误', icon: 'none' })
    lockInput.value = ''
  }
}
</script>

<template>
  <view style="min-height:100vh">
    <slot />
    <!-- 密码锁定层 -->
    <view v-if="locked" class="lock-screen">
      <view class="lock-content">
        <text class="lock-icon">🔒</text>
        <text class="lock-title">请输入密码</text>
        <input
          class="lock-input"
          v-model="lockInput"
          type="password"
          maxlength="4"
          placeholder="4 位数字密码"
          confirm-type="done"
          @confirm="onLockConfirm"
        />
        <view class="lock-btn" @tap="onLockConfirm">
          <text>解锁</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use '@/styles/reset.scss';
@use '@/styles/design-system.scss';

.lock-screen {
  position: fixed;
  inset: 0;
  background: var(--bg-primary, #FDF8F3);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-content {
  text-align: center;
  padding: 40px;
}

.lock-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 24px;
}

.lock-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary, #2C2C2C);
  display: block;
  margin-bottom: 32px;
}

.lock-input {
  width: 200px;
  height: 52px;
  background: white;
  border: 1px solid var(--border, #E8E0D8);
  border-radius: 12px;
  text-align: center;
  font-size: 24px;
  letter-spacing: 8px;
  margin-bottom: 24px;
}

.lock-btn {
  display: inline-block;
  padding: 12px 48px;
  background: var(--gradient-brand, linear-gradient(135deg, #C8956C, #A67B5B));
  border-radius: 999px;
  color: white;
  font-weight: 700;
}
</style>
