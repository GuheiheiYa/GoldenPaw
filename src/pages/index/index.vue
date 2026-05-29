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
              <uni-icons class="icon-btn-text" type="search" size="18" color="#999" />
            </view>
            <view class="icon-btn" @tap="showToast('通知功能开发中')">
              <text class="icon-btn-text">🔔</text>
            </view>
          </view>
        </view>

        <!-- 余额卡片 -->
        <BalanceCard
          :income="cycleStats.income"
          :expense="cycleStats.expense"
          :balance="cycleStats.balance"
          :label="appStore.cycle === 'natural' ? '本月结余' : '本期结余'"
        />
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
        <view class="budget-scroll-inner">
          <view class="budget-card card" v-for="(item, idx) in budgetItems" :key="idx">
            <text class="budget-emoji">{{ item.icon }}</text>
            <text class="budget-name">{{ item.name }}</text>
            <text class="budget-used">{{ item.used }}</text>
            <text class="budget-total">{{ item.detail }}</text>
            <view class="progress-bar">
              <view class="progress-fill" :class="item.fillCls" :style="{ width: item.pct + '%' }"></view>
            </view>
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
          @tap="() => onFlowItemTap(tx.id)"
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
import { useGoalBudgetStore } from '@/stores/goalBudget'
import { formatAmount, formatDate } from '@/utils/format'
import { getCycleRange } from '@/utils/cycle'
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'
import BalanceCard from '@/components/BalanceCard.vue'
import QuickActions from '@/components/QuickActions.vue'
import WeekCalendar from '@/components/WeekCalendar.vue'
import FlowItem from '@/components/FlowItem.vue'

const appStore = useAppStore()
const txStore = useTransactionStore()
const categoryStore = useCategoryStore()
const goalBudgetStore = useGoalBudgetStore()

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

/** 首页预算数据（取自 store，最多3个） */
/** 按当前记账周期计算的收支统计 */
const cycleStats = computed(() => {
  const { start, end } = getCycleRange(appStore.cycle)
  return txStore.getStatsByDateRange(start, end)
})

const budgetItems = computed(() => {
  const { start, end } = getCycleRange(appStore.cycle)
  return goalBudgetStore.getBudgetUsageByRange(start, end).slice(0, 3).map(b => {
    const cat = categoryStore.getCategoryById(b.categoryId)
    const remaining = b.amount - b.used
    const fillCls = b.over ? 'fill-danger' : b.pct > 80 ? 'fill-accent' : 'fill-brand'
    return {
      icon: cat?.icon || '💰',
      name: cat?.name || '未知',
      used: formatAmount(b.used),
      detail: `剩余 ${formatAmount(Math.max(remaining, 0))} / ${formatAmount(b.amount)}`,
      pct: Math.min(b.pct, 100),
      fillCls,
    }
  })
})

/** 首页目标数据（取自 store，最多3个） */
const goalItems = computed(() => {
  const colors = [
    { fillCls: 'fill-brand', iconBg: 'linear-gradient(135deg, #FAF0E6, #F5E6D3)', borderColor: 'rgba(200,149,108,0.25)' },
    { fillCls: 'fill-success', iconBg: 'linear-gradient(135deg, #E8F1F5, #D6E5EC)', borderColor: 'rgba(122,158,175,0.25)' },
    { fillCls: 'fill-accent', iconBg: 'linear-gradient(135deg, #E8F0E8, #D4E6D4)', borderColor: 'rgba(107,142,107,0.25)' },
  ]
  return goalBudgetStore.goals.slice(0, 3).map((g, idx) => {
    const pct = g.targetAmount > 0 ? Math.round((g.savedAmount / g.targetAmount) * 100) : 0
    const style = colors[idx % colors.length]
    return {
      icon: g.icon,
      name: g.name,
      amount: `${formatAmount(g.savedAmount)} / ${formatAmount(g.targetAmount)}`,
      pct,
      ...style,
    }
  })
})

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
  padding: $space-10 0 $space-6;
}

/* ===== Hero ===== */
.hero {
  margin-bottom: $space-4;
  padding: 0 $space-6 $space-6;
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
  padding: 0 $space-6 $space-1;
  white-space: nowrap;
}

.budget-scroll-inner {
  display: flex;
  gap: $space-3;
  flex-direction: row;
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
  font: 700 13px/1.4 $font-sans;
  color: $text-primary;
  margin-bottom: $space-2;
  display: block;
}

.budget-used {
  font: 800 20px/1.4 $font-sans;
  margin-bottom: $space-1;
  display: block;
}

.budget-total {
  font: 600 11px/1.4 $font-sans;
  color: $text-secondary;
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
