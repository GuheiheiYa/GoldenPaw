<template>
  <view class="app">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">收支报表</text>
    </view>
    <view class="placeholder-card">
      <text class="placeholder-title">收支报表</text>
      <text class="placeholder-desc">趋势图表、饼图、消费排行</text>
    </view>
  </view>
</template>

<script setup lang="ts">
function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;
@use '@/styles/mixins' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
}

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
}

.placeholder-card {
  margin: 0 $space-6;
  @include card-emphasis;
  padding: $space-8;
  text-align: center;
}

.placeholder-title {
  @include text-h1;
  display: block;
  margin-bottom: $space-3;
}

.placeholder-desc {
  @include text-body;
  color: $text-secondary;
  display: block;
}
</style>
