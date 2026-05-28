<template>
  <view class="app">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">明细</text>
      <view class="header-actions">
        <view class="icon-btn">
          <text class="icon-text">🔍</text>
        </view>
        <view class="icon-btn">
          <text class="icon-text">⚙</text>
        </view>
      </view>
    </view>

    <!-- 筛选标签栏 -->
    <view class="filter-bar">
      <SegmentedControl v-model="activeFilter" :options="filterOptions" />
    </view>

    <!-- 月度分组列表 -->
    <view class="month-group" v-for="group in filteredGroups" :key="group.yearMonth">
      <view class="month-header">
        <text class="month-name">{{ formatMonthHeader(group.yearMonth) }}</text>
        <text class="month-total">{{ formatMonthSummary(group) }}</text>
      </view>
      <view class="tx-list">
        <view
          class="tx-item"
          v-for="tx in group.transactions"
          :key="tx.id"
          @tap="onTapTransaction(tx)"
        >
          <view class="tx-icon" :style="{ background: getIconBg(tx.categoryId) }">
            <text class="tx-icon-emoji">{{ getIcon(tx.categoryId) }}</text>
          </view>
          <view class="tx-body">
            <text class="tx-title">{{ tx.note || getCatName(tx.categoryId) }}</text>
            <text class="tx-meta">
              {{ formatDate(tx.date) }} {{ tx.time }} · {{ getCatName(tx.categoryId) }}
            </text>
          </view>
          <view class="tx-right">
            <text
              class="tx-amount"
              :class="tx.type === 'income' ? 'tx-amount-in' : 'tx-amount-out'"
            >
              {{ formatAmountText(tx) }}
            </text>
            <view v-if="tx.type === 'expense'" class="tx-tag">
              <text class="tx-tag-text">预算内</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredGroups.length === 0" class="empty-state">
      <text class="empty-icon">📋</text>
      <text class="empty-title">暂无记录</text>
      <text class="empty-desc">当前筛选条件下没有交易记录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import { formatAmount, formatDate } from '@/utils/format'
import SegmentedControl from '@/components/SegmentedControl.vue'
import type { Transaction } from '@/types/transaction'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

/** 当前筛选类型 */
const activeFilter = ref('all')

/** 筛选选项 */
const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '支出', value: 'expense' },
  { label: '收入', value: 'income' },
  { label: '转账', value: 'transfer' },
]

/** 月度分组数据结构 */
interface MonthGroup {
  yearMonth: string
  transactions: Transaction[]
}

/** 按月分组并排序的交易列表 */
const filteredGroups = computed<MonthGroup[]>(() => {
  // 根据筛选条件过滤
  const txs = activeFilter.value === 'all'
    ? transactionStore.transactions
    : transactionStore.transactions.filter(t => t.type === activeFilter.value)

  // 按日期和时间降序排列
  const sorted = [...txs].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date)
    return b.time.localeCompare(a.time)
  })

  // 按月份分组
  const groupMap = new Map<string, Transaction[]>()
  for (const tx of sorted) {
    const yearMonth = tx.date.slice(0, 7)
    if (!groupMap.has(yearMonth)) {
      groupMap.set(yearMonth, [])
    }
    groupMap.get(yearMonth)!.push(tx)
  }

  return Array.from(groupMap.entries()).map(([yearMonth, transactions]) => ({
    yearMonth,
    transactions,
  }))
})

/**
 * 格式化月份标题（如 "2026年5月"）
 * @param yearMonth 年月字符串（YYYY-MM）
 */
function formatMonthHeader(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  return `${year}年${parseInt(month)}月`
}

/**
 * 格式化月度汇总文本（如 "支出 ¥3,858.00"）
 * @param group 月度分组数据
 */
function formatMonthSummary(group: MonthGroup): string {
  // 优先显示支出总额
  const expenseTotal = group.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  if (expenseTotal > 0) {
    return `支出 ${formatAmount(expenseTotal)}`
  }

  // 无支出则显示收入
  const incomeTotal = group.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  if (incomeTotal > 0) {
    return `收入 ${formatAmount(incomeTotal, true)}`
  }

  return '暂无数据'
}

/**
 * 获取分类图标
 * @param categoryId 分类ID
 */
function getIcon(categoryId: string): string {
  return categoryStore.getCategoryById(categoryId)?.icon ?? '💰'
}

/**
 * 获取图标渐变背景色
 * @param categoryId 分类ID
 */
function getIconBg(categoryId: string): string {
  const cat = categoryStore.getCategoryById(categoryId)
  if (cat) {
    return `linear-gradient(135deg, ${cat.color}, ${cat.color}88)`
  }
  // 默认渐变背景
  return 'linear-gradient(135deg, #FAF0E6, #F5E6D3)'
}

/**
 * 获取分类名称
 * @param categoryId 分类ID
 */
function getCatName(categoryId: string): string {
  return categoryStore.getCategoryById(categoryId)?.name ?? '未知分类'
}

/**
 * 格式化金额显示文本
 * @param tx 交易记录
 */
function formatAmountText(tx: Transaction): string {
  if (tx.type === 'income') {
    return `+${formatAmount(tx.amount)}`
  }
  if (tx.type === 'transfer') {
    return formatAmount(tx.amount)
  }
  // 支出显示负号
  return `-${formatAmount(tx.amount)}`
}

/** 返回上一页 */
function goBack() {
  uni.navigateBack()
}

/**
 * 点击交易项（预留跳转详情）
 * @param tx 交易记录
 */
function onTapTransaction(_tx: Transaction) {
  // 后续扩展：跳转交易详情页
}
</script>

<style lang="scss" scoped>
@use '../../styles/design-system' as *;
@use '../../styles/mixins' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
  padding-bottom: 40px;
}

/* 顶部导航 */
.header {
  padding: 48px 24px 16px;
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

.icon-btn {
  @include icon-btn;
}

.icon-text {
  font-size: 18px;
}

/* 筛选标签栏 */
.filter-bar {
  padding: 0 24px 16px;
}

/* 月度分组 */
.month-group {
  padding: 0 24px;
}

.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 8px;
}

.month-name {
  @include text-h3;
}

.month-total {
  @include text-caption;
  color: $text-secondary;
}

/* 交易项 */
.tx-list {
  background: $surface;
  border-radius: $radius-md;
  padding: 0 16px;
  box-shadow: $shadow-sm;
  border: 1px solid $border;
}

.tx-item {
  display: flex;
  align-items: center;
  padding: 14px 0;
  border-bottom: 2px dashed rgba(168, 155, 142, 0.15);
  cursor: pointer;

  &:active {
    opacity: 0.5;
  }

  &:last-child {
    border-bottom: none;
  }
}

.tx-icon {
  width: 44px;
  height: 44px;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
}

.tx-icon-emoji {
  font-size: 20px;
}

.tx-body {
  flex: 1;
  min-width: 0;
}

.tx-title {
  @include text-body;
  color: $text-primary;
  margin-bottom: 2px;
  display: block;
}

.tx-meta {
  @include text-small;
  color: $text-secondary;
  display: block;
}

.tx-right {
  text-align: right;
  flex-shrink: 0;
}

.tx-amount {
  @include amount-display;
  font-size: 16px;
  line-height: 1.4;
}

.tx-amount-out {
  color: $text-primary;
}

.tx-amount-in {
  color: $success-500;
}

/* 预算标签 */
.tx-tag {
  display: inline-block;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  background: $brand-50;
}

.tx-tag-text {
  @include text-micro;
  color: $brand-600;
}

/* 空状态 */
.empty-state {
  padding: 80px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.empty-title {
  @include text-h3;
  display: block;
  margin-bottom: 8px;
}

.empty-desc {
  @include text-body;
  color: $text-secondary;
  display: block;
}
</style>
