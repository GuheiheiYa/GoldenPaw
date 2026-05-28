<template>
  <view class="app">
    <view class="page-content">
      <!-- Hero Section -->
      <view class="hero">
        <view class="hero-top">
          <view class="brand">
            <view class="brand-icon">
              <text class="brand-icon-text">🐾</text>
            </view>
            <text class="brand-text">GoldenPaw</text>
          </view>
          <view class="hero-actions">
            <view class="icon-btn" @tap="navigateTo('/pages/search/search')">
              <text class="icon-btn-text">🔍</text>
            </view>
            <view class="icon-btn" @tap="showToast('通知功能开发中')">
              <text class="icon-btn-text">🔔</text>
            </view>
          </view>
        </view>

        <!-- 余额卡片 -->
        <BalanceCard />
      </view>

      <!-- 快捷操作 -->
      <QuickActions />

      <!-- 周历 -->
      <WeekCalendar @day-tap="onDayTap" />

      <!-- 本月预算（占位） -->
      <view class="section-header">
        <text class="section-title">本月预算</text>
        <text class="section-link" @tap="navigateTo('/pages/goals/goals?tab=budget')">管理</text>
      </view>
      <scroll-view scroll-x class="budget-scroll" :show-scrollbar="false">
        <view class="budget-card card" v-for="(item, idx) in budgetItems" :key="idx">
          <text class="budget-emoji">{{ item.icon }}</text>
          <text class="budget-name">{{ item.name }}</text>
          <text class="budget-used">{{ item.used }}</text>
          <text class="budget-total">{{ item.detail }}</text>
          <view class="progress-bar">
            <view class="progress-fill" :class="item.fillCls" :style="{ width: item.pct + '%' }"></view>
          </view>
        </view>
      </scroll-view>

      <!-- 存钱目标（占位） -->
      <view class="section-header">
        <text class="section-title">存钱目标</text>
        <text class="section-link" @tap="navigateTo('/pages/goals/goals')">全部</text>
      </view>
      <view
        class="goal-card card"
        v-for="(goal, idx) in goalItems"
        :key="idx"
        :style="{ borderColor: goal.borderColor }"
      >
        <view class="goal-icon" :style="{ background: goal.iconBg }">
          <text class="goal-icon-text">{{ goal.icon }}</text>
        </view>
        <view class="goal-info">
          <text class="goal-name">{{ goal.name }}</text>
          <text class="goal-amount">{{ goal.amount }}</text>
          <view class="goal-track">
            <view class="goal-track-bar">
              <view class="progress-fill" :class="goal.fillCls" :style="{ width: goal.pct + '%' }"></view>
            </view>
            <text class="goal-pct">{{ goal.pct }}%</text>
          </view>
        </view>
      </view>

      <!-- 最近流水 -->
      <view class="section-header">
        <text class="section-title">最近流水</text>
        <text class="section-link" @tap="navigateTo('/pages/detail/detail')">查看全部</text>
      </view>
      <view class="flow-list">
        <FlowItem
          v-for="tx in recentFlowItems"
          :key="tx.id"
          :id="tx.id"
          :icon="tx.icon"
          :icon-bg="tx.iconBg"
          :title="tx.title"
          :meta="tx.meta"
          :amount="tx.amount"
          :amount-type="tx.amountType"
          @tap="onFlowItemTap"
        />
        <view v-if="recentFlowItems.length === 0" class="empty-hint">
          <text class="empty-text">暂无流水记录</text>
        </view>
      </view>
    </view>

    <TabBar />
    <RecordSheet />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import { formatAmount, formatDate } from '@/utils/format'
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'
import BalanceCard from '@/components/BalanceCard.vue'
import QuickActions from '@/components/QuickActions.vue'
import WeekCalendar from '@/components/WeekCalendar.vue'
import FlowItem from '@/components/FlowItem.vue'

const appStore = useAppStore()
const txStore = useTransactionStore()
const categoryStore = useCategoryStore()

onShow(() => {
  appStore.setCurrentTab(0)
})

/** 通用页面跳转 */
function navigateTo(url: string) {
  uni.navigateTo({ url })
}

/** 显示提示 */
function showToast(msg: string) {
  uni.showToast({ title: msg, icon: 'none' })
}

/** 流水项点击 */
function onFlowItemTap(id: string) {
  // 跳转到明细页并高亮该条记录
  navigateTo(`/pages/detail/detail?highlight=${id}`)
}

/** 日期点击 */
function onDayTap(dateStr: string) {
  // 跳转到明细页并按日期筛选
  navigateTo(`/pages/detail/detail?date=${dateStr}`)
}

/** 预算占位数据 */
const budgetItems = [
  { icon: '🍜', name: '餐饮美食', used: '¥1,200', detail: '剩余 ¥800 / ¥2,000', pct: 60, fillCls: 'fill-brand' },
  { icon: '🚇', name: '交通出行', used: '¥480', detail: '剩余 ¥20 / ¥500', pct: 96, fillCls: 'fill-danger' },
  { icon: '🛍️', name: '购物消费', used: '¥320', detail: '剩余 ¥1,180 / ¥1,500', pct: 21, fillCls: 'fill-success' },
]

/** 目标占位数据 */
const goalItems = [
  { icon: '✈️', name: '年底旅行基金', amount: '¥13,000 / ¥20,000 · 还剩 218 天', pct: 65, fillCls: 'fill-brand', iconBg: 'linear-gradient(135deg, #FAF0E6, #F5E6D3)', borderColor: 'rgba(200,149,108,0.25)' },
  { icon: '📱', name: '换新手机', amount: '¥3,200 / ¥8,000 · 还剩 90 天', pct: 40, fillCls: 'fill-success', iconBg: 'linear-gradient(135deg, #E8F1F5, #D6E5EC)', borderColor: 'rgba(122,158,175,0.25)' },
  { icon: '🎁', name: '应急备用金', amount: '¥5,000 / ¥50,000 · 长期目标', pct: 10, fillCls: 'fill-accent', iconBg: 'linear-gradient(135deg, #E8F0E8, #D4E6D4)', borderColor: 'rgba(107,142,107,0.25)' },
]

/** 最近流水数据 */
const recentFlowItems = computed(() => {
  const txs = txStore.getRecentTransactions(8)
  return txs.map(tx => {
    const category = categoryStore.getCategoryById(tx.categoryId)
    const icon = category?.icon || '💰'
    const categoryName = category?.name || '其他'
    // 分类对应的背景色映射
    const bgMap: Record<string, string> = {
      'cat-food': 'linear-gradient(135deg, #FAF0E6, #F5E6D3)',
      'cat-transport': 'linear-gradient(135deg, #E8F0E8, #D4E6D4)',
      'cat-housing': 'linear-gradient(135deg, #E8F1F5, #D6E5EC)',
      'cat-shopping': 'linear-gradient(135deg, #F5E0DC, #F0D5CF)',
      'cat-entertainment': 'linear-gradient(135deg, #F5E6D3, #EDD4B8)',
      'cat-salary': 'linear-gradient(135deg, #E8F0E8, #D4E6D4)',
      'cat-bonus': 'linear-gradient(135deg, #F5E6D3, #EDD4B8)',
      'cat-investment-income': 'linear-gradient(135deg, #E8F1F5, #D6E5EC)',
    }
    const defaultBg = 'linear-gradient(135deg, #F0F0F0, #E8E8E8)'
    const iconBg = bgMap[tx.categoryId] || defaultBg
    const amountType = tx.type === 'income' ? 'in' as const : 'out' as const
    const sign = tx.type === 'income' ? '+' : '-'
    return {
      id: tx.id,
      icon,
      iconBg,
      title: tx.note || categoryName,
      meta: `${formatDate(tx.date)} ${tx.time} · ${categoryName}`,
      amount: `${sign}${formatAmount(tx.amount)}`,
      amountType,
    }
  })
})
</script>

<style lang="scss" scoped>
@use '../../styles/design-system' as *;
@use '../../styles/mixins' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
  padding-bottom: 100px;
}

.page-content {
  padding: $space-10 $space-6 $space-6;
}

/* ===== Hero ===== */
.hero {
  margin-bottom: $space-4;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -80px;
    right: -60px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(200, 149, 108, 0.18) 0%, transparent 70%);
    filter: blur(40px);
  }

  &::after {
    content: '';
    position: absolute;
    top: 20px;
    left: -40px;
    width: 160px;
    height: 160px;
    background: radial-gradient(circle, rgba(107, 142, 107, 0.12) 0%, transparent 70%);
    filter: blur(40px);
  }
}

.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-6;
  position: relative;
  z-index: 1;
}

.brand {
  display: flex;
  align-items: center;
  gap: $space-2;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: $radius-sm;
  background: $gradient-brand;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-brand;
}

.brand-icon-text {
  font-size: 18px;
}

.brand-text {
  @include text-h1;
  font-size: 20px;
  color: $text-primary;
  letter-spacing: -0.3px;
}

.hero-actions {
  display: flex;
  gap: $space-2;
  position: relative;
  z-index: 1;
}

.icon-btn {
  @include icon-btn;
}

.icon-btn-text {
  font-size: 18px;
}

/* ===== Section Header ===== */
.section-header {
  padding: $space-6 $space-6 $space-3;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  @include text-h2;
  color: $text-primary;
}

.section-link {
  @include text-caption;
  color: $brand-600;
}

/* ===== Budget Cards ===== */
.budget-scroll {
  display: flex;
  gap: $space-3;
  padding: 0 $space-6 $space-1;
  white-space: nowrap;
}

.budget-card {
  min-width: 140px;
  padding: $space-4;
  border: 2px solid transparent;

  &:nth-child(1) { border-color: rgba(200, 149, 108, 0.3); }
  &:nth-child(2) { border-color: rgba(192, 108, 95, 0.25); }
  &:nth-child(3) { border-color: rgba(107, 142, 107, 0.25); }
}

.budget-emoji {
  font-size: 32px;
  margin-bottom: $space-2;
  display: block;
}

.budget-name {
  @include text-caption;
  color: $text-primary;
  margin-bottom: $space-2;
  display: block;
}

.budget-used {
  @include text-h1;
  margin-bottom: $space-1;
  display: block;
}

.budget-total {
  @include text-micro;
  color: $text-secondary;
  font-weight: 600;
  display: block;
}

.progress-bar {
  height: 8px;
  background: $border;
  border-radius: $radius-full;
  overflow: hidden;
  margin-top: $space-3;
}

.progress-fill {
  height: 100%;
  border-radius: $radius-full;
  transition: width 0.6s ease;

  &.fill-brand { background: $gradient-brand; }
  &.fill-danger { background: $gradient-danger; }
  &.fill-success { background: $gradient-success; }
  &.fill-accent { background: $accent-500; }
}

/* ===== Goal Cards ===== */
.goal-card {
  margin: 0 $space-6 $space-3;
  padding: $space-5;
  display: flex;
  align-items: center;
  gap: $space-4;
  border: 2px solid transparent;
}

.goal-icon {
  width: 56px;
  height: 56px;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.goal-icon-text {
  font-size: 28px;
}

.goal-info {
  flex: 1;
}

.goal-name {
  @include text-h3;
  color: $text-primary;
  margin-bottom: $space-1;
  display: block;
}

.goal-amount {
  @include text-caption;
  color: $text-secondary;
  margin-bottom: $space-3;
  display: block;
}

.goal-track {
  display: flex;
  align-items: center;
  gap: $space-2;
}

.goal-track-bar {
  flex: 1;
  height: 10px;
  background: $border;
  border-radius: $radius-full;
  overflow: hidden;
}

.goal-pct {
  @include text-h3;
  color: $text-primary;
  min-width: 40px;
  text-align: right;
}

/* ===== Flow List ===== */
.flow-list {
  padding: 0 $space-6;
}

.empty-hint {
  padding: $space-8;
  text-align: center;
}

.empty-text {
  @include text-body;
  color: $text-tertiary;
}
</style>
