<template>
  <view class="app">
    <!-- Header -->
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">存钱与预算</text>
      <view class="header-action" @tap="onNewGoal">
        <text class="header-action-text">+ 新建</text>
      </view>
    </view>

    <!-- 分段控制器 -->
    <view class="segmented">
      <view
        class="seg-item"
        :class="{ active: activeTab === 'goals' }"
        @tap="activeTab = 'goals'"
      >
        <text class="seg-item-text">存钱目标</text>
      </view>
      <view
        class="seg-item"
        :class="{ active: activeTab === 'budget' }"
        @tap="activeTab = 'budget'"
      >
        <text class="seg-item-text">预算管理</text>
      </view>
    </view>

    <!-- 存钱目标列表 -->
    <view v-if="activeTab === 'goals'">
      <view
        class="goal-card"
        v-for="(goal, idx) in goalData"
        :key="goal.name"
        :style="{ borderColor: goal.borderColor }"
      >
        <view class="goal-top">
          <view class="goal-icon" :class="'goal-icon-' + (idx + 1)">
            <text class="goal-icon-text">{{ goal.icon }}</text>
          </view>
          <view class="goal-info">
            <text class="goal-name">{{ goal.name }}</text>
            <text class="goal-amount">{{ goal.amount }}</text>
          </view>
          <!-- 环形进度 -->
          <view class="goal-ring">
            <view class="goal-ring-bg"></view>
            <view class="goal-ring-fill" :class="'ring-' + (idx + 1)" :style="{ '--pct': goal.pct }"></view>
            <text class="goal-ring-text">{{ goal.pct }}%</text>
          </view>
        </view>

        <!-- 进度条 -->
        <view class="goal-progress">
          <view class="goal-bar-track">
            <view class="goal-bar-fill" :class="'fill-' + (idx + 1)" :style="{ width: goal.pct + '%' }"></view>
          </view>
        </view>

        <!-- 统计信息 -->
        <view class="goal-stats">
          <view class="goal-stat" v-for="stat in goal.stats" :key="stat.label">
            <text class="goal-stat-label">{{ stat.label }}</text>
            <text class="goal-stat-value">{{ stat.value }}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="goal-actions">
          <view class="goal-btn primary" @tap="onDeposit(goal.name)">
            <text class="goal-btn-text">存入金额</text>
          </view>
          <view class="goal-btn secondary" @tap="onAdjust(goal.name)">
            <text class="goal-btn-text">调整目标</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 预算管理 -->
    <view v-if="activeTab === 'budget'" class="budget-section">
      <!-- 总预算卡片 -->
      <view class="budget-total">
        <view class="budget-total-header">
          <text class="budget-total-label">本月总预算</text>
          <text class="budget-total-value">¥8,000</text>
        </view>
        <view class="budget-total-bar">
          <view class="budget-total-fill" style="width: 57%;"></view>
        </view>
        <view class="budget-total-stats">
          <text class="budget-stat-text">已用 ¥4,580</text>
          <text class="budget-stat-text">剩余 ¥3,420</text>
        </view>
      </view>

      <!-- 预算明细 -->
      <view class="budget-list">
        <view class="budget-item" v-for="item in budgetItems" :key="item.name">
          <view class="budget-item-icon" :class="item.iconClass">
            <text class="budget-item-icon-text">{{ item.icon }}</text>
          </view>
          <view class="budget-item-info">
            <text class="budget-item-name">{{ item.name }}</text>
            <view class="budget-item-bar">
              <view class="budget-item-fill" :class="item.fillClass" :style="{ width: item.pct + '%' }"></view>
            </view>
          </view>
          <view class="budget-item-right">
            <text class="budget-item-used" :class="{ over: item.over }">{{ item.used }}</text>
            <text class="budget-item-total">/ {{ item.total }}</text>
          </view>
        </view>
      </view>

      <!-- 添加预算按钮 -->
      <view class="add-budget">
        <text class="add-budget-icon">+</text>
        <text class="add-budget-text">添加预算</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/** 返回上一页 */
function goBack() {
  uni.navigateBack()
}

/** 当前选中的标签 */
const activeTab = ref<'goals' | 'budget'>('goals')

/** 新建目标 */
function onNewGoal() {
  console.log('新建目标')
}

/** 存入金额 */
function onDeposit(name: string) {
  console.log('存入金额:', name)
}

/** 调整目标 */
function onAdjust(name: string) {
  console.log('调整目标:', name)
}

/** 目标数据 */
const goalData = [
  {
    icon: '✈️',
    name: '年底旅行基金',
    amount: '¥13,000 / ¥20,000',
    pct: 65,
    borderColor: 'rgba(200,149,108,0.25)',
    stats: [
      { label: '剩余天数', value: '218' },
      { label: '每月需存', value: '¥3,200' },
      { label: '已存进度', value: '65%' },
    ],
  },
  {
    icon: '📱',
    name: '换新手机',
    amount: '¥3,200 / ¥8,000',
    pct: 40,
    borderColor: 'rgba(122,158,175,0.25)',
    stats: [
      { label: '剩余天数', value: '90' },
      { label: '每月需存', value: '¥5,400' },
      { label: '已存进度', value: '40%' },
    ],
  },
  {
    icon: '🎁',
    name: '应急备用金',
    amount: '¥5,000 / ¥50,000',
    pct: 10,
    borderColor: 'rgba(107,142,107,0.25)',
    stats: [
      { label: '目标类型', value: '长期' },
      { label: '建议月存', value: '¥2,000' },
      { label: '已存进度', value: '10%' },
    ],
  },
]

/** 预算数据 */
const budgetItems = [
  { icon: '🍜', name: '餐饮美食', used: '¥1,200', total: '¥2,000', pct: 60, over: false, iconClass: 'food', fillClass: 'fill-brand' },
  { icon: '🚇', name: '交通出行', used: '¥480', total: '¥500', pct: 96, over: true, iconClass: 'transport', fillClass: 'fill-danger' },
  { icon: '🏠', name: '居住', used: '¥2,500', total: '¥3,000', pct: 83, over: false, iconClass: 'housing', fillClass: 'fill-accent' },
  { icon: '🛍️', name: '购物消费', used: '¥320', total: '¥1,500', pct: 21, over: false, iconClass: 'shopping', fillClass: 'fill-success' },
]
</script>

<style lang="scss" scoped>
@use '../../styles/design-system' as *;
@use '../../styles/mixins' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
  padding-bottom: 40px;
}

/* ===== Header ===== */
.header {
  padding: 48px $space-6 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  letter-spacing: -0.3px;
}

.header-action {
  padding: 8px 16px;
  border-radius: $radius-full;
  background: $gradient-brand;
  box-shadow: $shadow-brand;
  cursor: pointer;
}

.header-action-text {
  @include text-caption;
  color: white;
  font-weight: 700;
}

/* ===== 分段控制器 ===== */
.segmented {
  display: flex;
  background: $surface;
  border-radius: $radius-full;
  padding: 4px;
  margin: 0 $space-6 20px;
  box-shadow: $shadow-sm;
  border: 2px solid $border;
}

.seg-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: $radius-full;
  cursor: pointer;
  transition: $transition-base;
  border: none;
  background: transparent;

  &.active {
    background: $gradient-brand;
    box-shadow: 0 2px 8px rgba(200, 149, 108, 0.25);

    .seg-item-text {
      color: white;
    }
  }
}

.seg-item-text {
  @include text-body;
  color: $text-secondary;
  font-weight: 700;
}

/* ===== 目标卡片 ===== */
.goal-card {
  margin: 0 $space-6 16px;
  background: $surface;
  border-radius: $radius-lg;
  padding: 24px;
  box-shadow: $shadow-sm;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.goal-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.goal-icon {
  width: 56px;
  height: 56px;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.goal-icon-1 {
    background: linear-gradient(135deg, #FAF0E6, $brand-100);
  }

  &.goal-icon-2 {
    background: linear-gradient(135deg, $accent-100, #D6E5EC);
  }

  &.goal-icon-3 {
    background: linear-gradient(135deg, $success-100, #D4E6D4);
  }
}

.goal-icon-text {
  font-size: 28px;
}

.goal-info {
  flex: 1;
}

.goal-name {
  @include text-h2;
  display: block;
  margin-bottom: 4px;
}

.goal-amount {
  @include text-body;
  color: $text-secondary;
  display: block;
}

/* 环形进度 */
.goal-ring {
  width: 60px;
  height: 60px;
  position: relative;
  flex-shrink: 0;
}

.goal-ring-bg {
  width: 100%;
  height: 100%;
  border-radius: $radius-circle;
  border: 6px solid $border;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
}

.goal-ring-fill {
  width: 100%;
  height: 100%;
  border-radius: $radius-circle;
  border: 6px solid transparent;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);

  &.ring-1 {
    border-top-color: $brand-500;
    border-right-color: $brand-500;
  }

  &.ring-2 {
    border-top-color: $accent-500;
    border-right-color: $accent-500;
  }

  &.ring-3 {
    border-top-color: $success-500;
    border-right-color: transparent;
  }
}

.goal-ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @include text-caption;
  font-weight: 800;
  color: $text-primary;
}

/* 进度条 */
.goal-progress {
  margin-bottom: 16px;
}

.goal-bar-track {
  height: 12px;
  background: $border;
  border-radius: 6px;
  overflow: hidden;
}

.goal-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.6s ease;

  &.fill-1 {
    background: $gradient-brand;
  }

  &.fill-2 {
    background: $accent-500;
  }

  &.fill-3 {
    background: $success-500;
  }
}

/* 统计信息 */
.goal-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.goal-stat {
  flex: 1;
  padding: 12px;
  border-radius: $radius-sm;
  background: $bg-primary;
  text-align: center;
}

.goal-stat-label {
  @include text-small;
  color: $text-tertiary;
  margin-bottom: 4px;
  display: block;
}

.goal-stat-value {
  @include text-h3;
  color: $text-primary;
  display: block;
}

/* 操作按钮 */
.goal-actions {
  display: flex;
  gap: 10px;
}

.goal-btn {
  flex: 1;
  padding: 12px;
  border-radius: $radius-sm;
  text-align: center;
  cursor: pointer;
  border: none;

  &.primary {
    background: $gradient-brand;
    box-shadow: $shadow-brand;
  }

  &.secondary {
    background: $bg-primary;
    border: 1px solid $border;
  }
}

.goal-btn-text {
  @include text-body;
  font-weight: 700;

  .primary & {
    color: white;
  }

  .secondary & {
    color: $text-secondary;
  }
}

/* ===== 预算管理 ===== */
.budget-section {
  margin: 0 $space-6;
}

.budget-total {
  background: $surface;
  border-radius: $radius-md;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: $shadow-sm;
  border: 1px solid $border;
}

.budget-total-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.budget-total-label {
  @include text-caption;
  color: $text-secondary;
}

.budget-total-value {
  @include text-body;
  font-weight: 700;
  color: $text-primary;
}

.budget-total-bar {
  height: 10px;
  background: $border;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
}

.budget-total-fill {
  height: 100%;
  border-radius: 5px;
  background: $gradient-brand;
}

.budget-total-stats {
  display: flex;
  justify-content: space-between;
}

.budget-stat-text {
  @include text-caption;
  color: $text-secondary;
}

/* 预算明细列表 */
.budget-list {
  background: $surface;
  border-radius: $radius-md;
  padding: 0 20px;
  box-shadow: $shadow-sm;
  border: 1px solid $border;
}

.budget-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid $border;

  &:last-child {
    border-bottom: none;
  }
}

.budget-item-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.food {
    background: linear-gradient(135deg, #FAF0E6, $brand-100);
  }

  &.transport {
    background: linear-gradient(135deg, $success-100, #D4E6D4);
  }

  &.housing {
    background: linear-gradient(135deg, $accent-100, #D6E5EC);
  }

  &.shopping {
    background: linear-gradient(135deg, $danger-100, #F0D5CF);
  }
}

.budget-item-icon-text {
  font-size: 18px;
}

.budget-item-info {
  flex: 1;
}

.budget-item-name {
  @include text-body;
  display: block;
  margin-bottom: 2px;
}

.budget-item-bar {
  height: 6px;
  background: $border;
  border-radius: 3px;
  overflow: hidden;
}

.budget-item-fill {
  height: 100%;
  border-radius: 3px;

  &.fill-brand {
    background: $brand-500;
  }

  &.fill-danger {
    background: $danger-500;
  }

  &.fill-accent {
    background: $accent-500;
  }

  &.fill-success {
    background: $success-500;
  }
}

.budget-item-right {
  text-align: right;
}

.budget-item-used {
  @include text-body;
  font-weight: 700;
  color: $text-primary;
  display: block;

  &.over {
    color: $danger-500;
  }
}

.budget-item-total {
  @include text-small;
  color: $text-tertiary;
  display: block;
}

/* 添加预算 */
.add-budget {
  margin: 16px 0;
  padding: 14px;
  border-radius: $radius-md;
  border: 2px dashed $border;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.add-budget-icon {
  font-size: 20px;
  color: $text-secondary;
  font-weight: 700;
}

.add-budget-text {
  @include text-body;
  color: $text-secondary;
  font-weight: 700;
}
</style>
