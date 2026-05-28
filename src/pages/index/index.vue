<template>
  <view class="app">
    <view class="page-content">
      <view class="hero">
        <text class="brand-text">🐾 GoldenPaw</text>
      </view>
      <view class="placeholder-card">
        <text class="placeholder-title">首页</text>
        <text class="placeholder-desc">余额卡片、快捷操作、周历、预算、存钱目标、最近流水</text>
      </view>
    </view>
    <TabBar />
    <RecordSheet />
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'

const appStore = useAppStore()

onShow(() => {
  appStore.setCurrentTab(0)
})
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
  padding-bottom: 100px;
}

.page-content {
  padding: $space-10 $space-6 $space-6;
}

.hero {
  margin-bottom: $space-6;
}

.brand-text {
  font: 700 20px/1.2 $font-sans;
  color: $text-primary;
}

.placeholder-card {
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
