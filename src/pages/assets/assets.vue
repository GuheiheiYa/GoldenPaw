<template>
  <view class="app">
    <view class="page-content">
      <view class="placeholder-card">
        <text class="placeholder-title">我的资产</text>
        <text class="placeholder-desc">净资产、资产构成、账户列表、趋势图表</text>
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
  appStore.setCurrentTab(2)
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
