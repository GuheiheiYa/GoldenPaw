<template>
  <view class="balance-card card card-emphasis">
    <text class="balance-label">{{ label }}</text>
    <text class="balance-value">{{ formatAmount(balance) }}</text>
    <view class="balance-row">
      <view class="pill pill-in">
        <text class="pill-label">收入</text>
        <text class="pill-value pill-up">+{{ formatAmount(income) }}</text>
      </view>
      <view class="pill pill-out">
        <text class="pill-label">支出</text>
        <text class="pill-value pill-down">-{{ formatAmount(expense) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { formatAmount } from '@/utils/format'

defineProps<{
  income: number
  expense: number
  balance: number
  label?: string
}>()
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;
@use '../styles/mixins' as *;

.balance-card {
  padding: $space-6;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(200, 149, 108, 0.08) 0%, transparent 70%);
  }
}

.balance-label {
  @include text-small;
  color: $text-tertiary;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: $space-2;
  display: block;
}

.balance-value {
  @include text-hero;
  color: $text-primary;
  margin-bottom: $space-5;
  display: block;
  position: relative;
}

.balance-row {
  display: flex;
  gap: $space-3;
  justify-content: center;
  position: relative;
}

.pill {
  padding: $space-3 $space-5;
  border-radius: $radius-full;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;
  min-width: 110px;
}

.pill-in {
  background: $success-100;
}

.pill-out {
  background: $danger-100;
}

.pill-label {
  @include text-micro;
  color: $text-secondary;
  font-weight: 600;
}

.pill-value {
  @include amount-display;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 700;
}

.pill-up {
  color: $success-500;
}

.pill-down {
  color: $danger-500;
}
</style>
