<template>
  <view class="flow-item" @tap="handleTap">
    <view class="flow-icon" :style="{ background: iconBg }">
      <text class="flow-icon-emoji">{{ icon }}</text>
    </view>
    <view class="flow-body">
      <text class="flow-title">{{ title }}</text>
      <text class="flow-meta">{{ meta }}</text>
    </view>
    <view class="flow-right">
      <text class="flow-amt" :class="amountType === 'in' ? 'flow-amt-in' : 'flow-amt-out'">
        {{ amount }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
/** 流水项的 props */
defineProps<{
  /** 交易ID */
  id?: string
  /** emoji 图标 */
  icon: string
  /** 图标背景色 */
  iconBg: string
  /** 标题 */
  title: string
  /** 元信息（日期、分类等） */
  meta: string
  /** 金额文本 */
  amount: string
  /** 金额类型：in=收入，out=支出 */
  amountType: 'in' | 'out'
}>()

const emit = defineEmits<{
  (e: 'tap', id: string): void
}>()

/** 点击流水项 */
function handleTap() {
  if (props.id) {
    emit('tap', props.id)
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;
@use '../styles/mixins' as *;

.flow-item {
  display: flex;
  align-items: center;
  padding: $space-3 0;
  border-bottom: 2px dashed rgba(168, 155, 142, 0.15);
  cursor: pointer;
  transition: $transition-fast;

  &:active {
    opacity: 0.5;
  }

  &:last-child {
    border-bottom: none;
  }
}

.flow-icon {
  width: 48px;
  height: 48px;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $space-3;
  flex-shrink: 0;
}

.flow-icon-emoji {
  font-size: 22px;
}

.flow-body {
  flex: 1;
}

.flow-title {
  font: 700 15px/1.4 $font-sans;
  color: $text-primary;
  margin-bottom: $space-1;
  display: block;
}

.flow-meta {
  font: 600 12px/1.4 $font-sans;
  color: $text-secondary;
  display: block;
}

.flow-right {
  text-align: right;
}

.flow-amt {
  @include amount-display;
  font-size: 16px;
  line-height: 1.4;
}

.flow-amt-out {
  color: $text-primary;
}

.flow-amt-in {
  color: $success-500;
}
</style>
