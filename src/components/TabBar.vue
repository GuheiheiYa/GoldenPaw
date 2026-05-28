<template>
  <view class="tabbar-wrapper">
    <view class="tabbar">
      <!-- 悬浮记账按钮 -->
      <view class="fab-record" @tap="onFabTap">
        <text class="fab-icon">+</text>
        <text class="fab-label">记账</text>
      </view>

      <!-- Tab项 -->
      <view
        v-for="(tab, index) in tabs"
        :key="tab.path"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @tap="onTabTap(index, tab.path)"
      >
        <text class="tab-icon">{{ tab.icon }}</text>
        <text class="tab-text">{{ tab.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const tabs = [
  { path: '/pages/index/index', icon: '🏠', text: '首页' },
  { path: '/pages/ai/ai', icon: '🤖', text: 'AI记账' },
  { path: '', icon: '', text: '' }, // 占位
  { path: '/pages/assets/assets', icon: '💰', text: '资产' },
  { path: '/pages/profile/profile', icon: '👤', text: '我的' },
]

const currentTab = computed(() => appStore.currentTab)

function onTabTap(index: number, path: string) {
  if (!path) return
  appStore.setCurrentTab(index)
  uni.switchTab({ url: path })
}

function onFabTap() {
  appStore.openRecordSheet()
}
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

.tabbar-wrapper {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 414px;
  z-index: 100;
  pointer-events: none;
}

.tabbar {
  position: relative;
  margin: 0 24px 16px;
  height: 68px;
  background: $surface;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: $radius-xl;
  box-shadow: $shadow-lg;
  border: 2px solid $border;
  padding: 0 $space-2;
  backdrop-filter: blur(20px);
  pointer-events: all;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-1;
  color: $text-tertiary;
  font: 700 10px/1.3 $font-sans;
  height: 52px;
  border-radius: $radius-full;
  cursor: pointer;
  transition: $transition-base;

  &.active {
    color: $brand-600;
    background: linear-gradient(135deg, $brand-100, #FAF0E6);
  }
}

.tab-icon {
  font-size: 22px;
}

.tab-text {
  font-size: 10px;
}

.fab-record {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  background: $gradient-brand;
  border-radius: $radius-circle;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: $transition-base;
  box-shadow: $shadow-brand;
  border: 4px solid $bg-primary;
  pointer-events: all;
  z-index: 101;

  &:active {
    transform: translateX(-50%) scale(0.92);
  }
}

.fab-icon {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.fab-label {
  font: 700 10px/1.3 $font-sans;
  margin-top: 2px;
}
</style>
