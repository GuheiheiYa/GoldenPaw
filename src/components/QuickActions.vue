<template>
  <view class="quick-row">
    <view
      v-for="action in actions"
      :key="action.label"
      class="capsule"
      :class="action.cls"
      @tap="handleTap(action)"
    >
      <text class="capsule-icon">{{ action.icon }}</text>
      <text class="capsule-label">{{ action.label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/** 快捷操作配置 */
const actions = [
  { icon: '📊', label: '报表', cls: 'capsule-green', path: '/pages/report/report' },
  { icon: '📋', label: '明细', cls: 'capsule-blue', path: '/pages/detail/detail' },
  { icon: '💰', label: '存钱', cls: 'capsule-warm', path: '/pages/goal/goal' },
  { icon: '⚡', label: '待确认', cls: 'capsule-gold', path: '/pages/confirm/confirm', badge: 3 },
]

/** 导航到对应页面 */
function handleTap(action: { path: string }) {
  uni.navigateTo({ url: action.path })
}
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;
@use '../styles/mixins' as *;

.quick-row {
  display: flex;
  gap: $space-2;
  padding: $space-4 $space-6;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.capsule {
  @include capsule-btn(transparent, transparent);
  flex: 1;
  justify-content: center;
  position: relative;

  &.capsule-green {
    background: linear-gradient(135deg, $success-100, #D4E6D4);
    color: $success-500;
  }

  &.capsule-blue {
    background: linear-gradient(135deg, $accent-100, #D6E5EC);
    color: $accent-500;
  }

  &.capsule-warm {
    background: linear-gradient(135deg, $brand-100, $bg-tertiary);
    color: $brand-600;
  }

  &.capsule-gold {
    background: $gradient-brand;
    color: white;
    box-shadow: $shadow-brand;
  }
}

.capsule-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.capsule-label {
  font-weight: 700;
  font-size: 13px;
  line-height: 1.4;
}
</style>
