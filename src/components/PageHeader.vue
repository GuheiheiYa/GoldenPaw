<template>
  <view class="header">
    <view v-if="showBack" class="back-btn" @tap="onBack">
      <uni-icons class="back-icon" type="arrow-left" size="20" color="#7A6B5D" />
    </view>
    <text class="header-title">{{ title }}</text>
    <view class="header-actions">
      <slot name="actions" />
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  title: string
  showBack?: boolean
}

withDefaults(defineProps<Props>(), {
  showBack: true,
})

function onBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;
@use '../styles/mixins' as *;

.header {
  padding: 48px 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  @include icon-btn;
}

.back-icon {
  font-size: 20px;
  color: $text-secondary;
}

.header-title {
  @include text-h3;
  flex: 1;
  letter-spacing: -0.3px;
}

.header-actions {
  display: flex;
  gap: 8px;
}
</style>
