<template>
  <view v-if="visible" class="overlay" @tap="onOverlayTap">
    <view class="sheet" :class="{ show: visible }" @tap.stop>
      <!-- 拖拽手柄 -->
      <view class="handle" />

      <!-- 收支类型切换 -->
      <SegmentedControl
        v-model="txType"
        :options="typeOptions"
      />

      <!-- 金额显示 -->
      <view class="amount-area">
        <text class="amount-label">¥</text>
        <text class="amount-value">{{ displayAmount }}</text>
      </view>

      <!-- 占位提示 -->
      <view class="placeholder">
        <text class="placeholder-text">记账面板 - 开发中...</text>
        <text class="placeholder-sub">Phase 3 将实现完整功能</text>
      </view>

      <!-- 关闭按钮 -->
      <view class="close-btn" @tap="onClose">
        <text class="close-text">关闭</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import SegmentedControl from './SegmentedControl.vue'

const appStore = useAppStore()
const txType = ref('expense')

const typeOptions = [
  { label: '支出', value: 'expense' },
  { label: '收入', value: 'income' },
  { label: '转账', value: 'transfer' },
]

const visible = computed(() => appStore.showRecordSheet)
const displayAmount = ref('0.00')

function onOverlayTap() {
  appStore.closeRecordSheet()
}

function onClose() {
  appStore.closeRecordSheet()
}
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;
@use '@/styles/mixins' as *;

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sheet {
  width: 100%;
  max-width: 414px;
  background: $surface;
  border-radius: $radius-xl $radius-xl 0 0;
  padding: $space-4 $space-6 $space-8;
  transform: translateY(100%);
  transition: transform 0.3s ease;

  &.show {
    transform: translateY(0);
  }
}

.handle {
  width: 40px;
  height: 4px;
  background: $border;
  border-radius: 2px;
  margin: 0 auto $space-5;
}

.amount-area {
  display: flex;
  align-items: baseline;
  padding: $space-6 0;
  border-bottom: 2px dashed $border;
  margin-bottom: $space-6;
}

.amount-label {
  font: 700 24px/1.1 $font-sans;
  color: $text-secondary;
  margin-right: $space-2;
}

.amount-value {
  @include text-hero;
  color: $text-primary;
}

.placeholder {
  text-align: center;
  padding: $space-10 0;
}

.placeholder-text {
  font: 700 16px/1.4 $font-sans;
  color: $text-secondary;
  display: block;
  margin-bottom: $space-2;
}

.placeholder-sub {
  font: 600 13px/1.4 $font-sans;
  color: $text-tertiary;
  display: block;
}

.close-btn {
  margin-top: $space-4;
  padding: 14px;
  border-radius: $radius-md;
  background: $bg-primary;
  text-align: center;
  cursor: pointer;

  &:active {
    background: $brand-50;
  }
}

.close-text {
  font: 700 14px/1.4 $font-sans;
  color: $text-secondary;
}
</style>
