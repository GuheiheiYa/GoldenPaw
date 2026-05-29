<template>
  <view class="app">
    <!-- Header -->
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <uni-icons class="back-icon" type="arrow-left" size="20" color="#7A6B5D" />
      </view>
      <text class="header-title">收支报表</text>
    </view>

    <!-- 时间周期选择 -->
    <view class="period-bar">
      <view
        v-for="period in periods"
        :key="period"
        class="period-chip"
        :class="{ active: activePeriod === period }"
        @tap="activePeriod = period"
      >
        <text class="period-chip-text">{{ period }}</text>
      </view>
    </view>

    <!-- 收支汇总 -->
    <view class="summary-row">
      <view class="summary-card">
        <text class="summary-label">收入</text>
        <text class="summary-value in">{{ formatAmount(summary.income) }}</text>
      </view>
      <view class="summary-card">
        <text class="summary-label">支出</text>
        <text class="summary-value out">{{ formatAmount(summary.expense) }}</text>
      </view>
    </view>

    <!-- 收支趋势折线图 -->
    <view class="chart-card">
      <text class="chart-title">收支趋势</text>
      <LineChart :labels="lineChartData.labels" :values="lineChartData.values" empty-text="暂无收支数据" />
    </view>

    <!-- 支出构成饼图 -->
    <view class="pie-section">
      <view class="pie-header">
        <text class="pie-title">支出构成</text>
        <view class="pie-tabs">
          <view
            class="pie-tab"
            :class="{ active: pieTab === '支出' }"
            @tap="pieTab = '支出'"
          >
            <text class="pie-tab-text">支出</text>
          </view>
          <view
            class="pie-tab"
            :class="{ active: pieTab === '收入' }"
            @tap="pieTab = '收入'"
          >
            <text class="pie-tab-text">收入</text>
          </view>
        </view>
      </view>
      <view class="pie-card">
        <!-- SVG 饼图 -->
        <view class="pie-chart">
          <view class="pie-chart-inner">
            <view class="pie-center">
              <text class="pie-center-amount">{{ formatAmount(pieData.total) }}</text>
              <text class="pie-center-label">总{{ pieTab === '支出' ? '支出' : '收入' }}</text>
            </view>
            <!-- 使用 CSS conic-gradient 实现饼图 -->
            <view class="pie-ring" :style="{ background: pieGradient }"></view>
          </view>
        </view>
        <view class="pie-legend">
          <view class="pie-legend-item" v-for="item in pieLegendData" :key="item.name">
            <view class="pie-legend-dot" :style="{ background: item.color }"></view>
            <text class="pie-legend-name">{{ item.name }}</text>
            <text class="pie-legend-value">{{ item.value }}</text>
            <text class="pie-legend-pct">{{ item.pct }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 消费排行 -->
    <view class="rank-card">
      <text class="rank-title">消费排行 TOP 5</text>
      <view class="rank-item" v-for="(item, idx) in rankData" :key="item.name">
        <view class="rank-num" :class="{ top: idx < 2 }">
          <text class="rank-num-text">{{ idx + 1 }}</text>
        </view>
        <view class="rank-icon" :style="{ background: item.iconBg }">
          <text class="rank-icon-text">{{ item.icon }}</text>
        </view>
        <view class="rank-info">
          <text class="rank-name">{{ item.name }}</text>
          <view class="rank-bar-track">
            <view class="rank-bar-fill" :style="{ width: item.pct + '%', background: item.barColor }"></view>
          </view>
        </view>
        <text class="rank-value">{{ item.value }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import { formatAmount, getToday } from '@/utils/format'
import type { Transaction } from '@/types/transaction'
import LineChart from '@/components/LineChart.vue'

const txStore = useTransactionStore()
const catStore = useCategoryStore()

/** 返回上一页 */
function goBack() {
  uni.navigateBack()
}

/** 当前选中的时间周期 */
const activePeriod = ref('本月')

/** 可选时间周期 */
const periods = ['本周', '本月', '本季', '本年']

/** 饼图标签切换 */
const pieTab = ref<'支出' | '收入'>('支出')

/** 获取周期内的交易 */
const periodTransactions = computed(() => {
  const today = getToday()
  const txs = txStore.transactions
  switch (activePeriod.value) {
    case '本周': {
      const d = new Date(today)
      const day = d.getDay() || 7
      const monday = new Date(d)
      monday.setDate(d.getDate() - day + 1)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      const s = monday.toISOString().slice(0, 10)
      const e = sunday.toISOString().slice(0, 10)
      return txs.filter(t => t.date >= s && t.date <= e)
    }
    case '本月': {
      const prefix = today.slice(0, 7)
      return txs.filter(t => t.date.startsWith(prefix))
    }
    case '本季': {
      const d = new Date(today)
      const m = d.getMonth()
      const qStart = Math.floor(m / 3) * 3
      const s = new Date(d.getFullYear(), qStart, 1).toISOString().slice(0, 10)
      const e = new Date(d.getFullYear(), qStart + 3, 0).toISOString().slice(0, 10)
      return txs.filter(t => t.date >= s && t.date <= e)
    }
    case '本年': {
      const y = today.slice(0, 4)
      return txs.filter(t => t.date.startsWith(y))
    }
    default:
      return txs
  }
})

/** 周期内收入/支出汇总 */
const summary = computed(() => {
  const income = periodTransactions.value
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const expense = periodTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  return { income, expense }
})

/** 折线图数据 */
const lineChartData = computed(() => {
  const today = getToday()
  const txs = periodTransactions.value.filter(t => t.type !== 'transfer')
  const typeFilter = pieTab.value === '支出' ? 'expense' : 'income'
  let labels: string[] = []
  let values: number[] = []

  switch (activePeriod.value) {
    case '本周': {
      const d = new Date(today)
      const day = d.getDay() || 7
      const monday = new Date(d)
      monday.setDate(d.getDate() - day + 1)
      for (let i = 0; i < 7; i++) {
        const cur = new Date(monday)
        cur.setDate(monday.getDate() + i)
        const dateStr = cur.toISOString().slice(0, 10)
        const dayTxs = txs.filter(t => t.date === dateStr && t.type === typeFilter)
        const val = dayTxs.reduce((s, t) => s + t.amount, 0)
        labels.push(`${cur.getMonth() + 1}/${cur.getDate()}`)
        values.push(val)
      }
      break
    }
    case '本月': {
      // 显示最近15天，避免31个点太密集
      for (let i = 14; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().slice(0, 10)
        const dayTxs = txs.filter(t => t.date === dateStr && t.type === typeFilter)
        const val = dayTxs.reduce((s, t) => s + t.amount, 0)
        // 只显示每隔3天的标签，以及第一天和最后一天
        const showLabel = i % 3 === 0 || i === 14
        const label = showLabel
          ? (i === 0 ? '今天' : i === 1 ? '昨天' : `${d.getMonth() + 1}/${d.getDate()}`)
          : ''
        labels.push(label)
        values.push(val)
      }
      break
    }
    case '本季': {
      const d = new Date(today)
      const m = d.getMonth()
      const qStart = Math.floor(m / 3) * 3
      for (let i = 0; i < 3; i++) {
        const month = qStart + i
        const monthStr = `${d.getFullYear()}-${String(month + 1).padStart(2, '0')}`
        const monthTxs = txs.filter(t => t.date.startsWith(monthStr) && t.type === typeFilter)
        const val = monthTxs.reduce((s, t) => s + t.amount, 0)
        labels.push(`${month + 1}月`)
        values.push(val)
      }
      break
    }
    case '本年': {
      const year = today.slice(0, 4)
      for (let i = 0; i < 12; i++) {
        const monthStr = `${year}-${String(i + 1).padStart(2, '0')}`
        const monthTxs = txs.filter(t => t.date.startsWith(monthStr) && t.type === typeFilter)
        const val = monthTxs.reduce((s, t) => s + t.amount, 0)
        labels.push(`${i + 1}月`)
        values.push(val)
      }
      break
    }
  }
  return { labels, values }
})



/** 饼图数据：按分类聚合 */
const pieData = computed(() => {
  const type = pieTab.value === '支出' ? 'expense' : 'income'
  const map = new Map<string, { amount: number; color: string; icon: string }>()
  for (const tx of periodTransactions.value) {
    if (tx.type !== type) continue
    const cat = catStore.getCategoryById(tx.categoryId)
    const name = cat?.name || '未知'
    const cur = map.get(name) || { amount: 0, color: cat?.color || '#B8A99E', icon: cat?.icon || '💰' }
    cur.amount += tx.amount
    map.set(name, cur)
  }
  const arr = Array.from(map.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.amount - a.amount)
  const total = arr.reduce((s, v) => s + v.amount, 0) || 1
  return { arr, total }
})

/** 饼图图例 */
const pieLegendData = computed(() => {
  const { arr, total } = pieData.value
  return arr.map(item => ({
    name: item.name,
    value: formatAmount(item.amount),
    pct: Math.round((item.amount / total) * 100),
    color: item.color,
  }))
})

/** 饼图 conic-gradient */
const pieGradient = computed(() => {
  const { arr, total } = pieData.value
  if (arr.length === 0) return 'conic-gradient(#EDE4D8 0deg 360deg)'
  const colors = ['#C8956C', '#7A9EAF', '#6B8E6B', '#C06C5F', '#D4A574', '#B8A99E', '#EDD4B8', '#A89B8E']
  let deg = 0
  const stops = arr.map((item, i) => {
    const start = deg
    const pct = item.amount / total
    deg += pct * 360
    return `${item.color || colors[i % colors.length]} ${start.toFixed(2)}deg ${deg.toFixed(2)}deg`
  })
  return `conic-gradient(${stops.join(', ')})`
})

/** 消费/收入排行 */
const rankData = computed(() => {
  const type = pieTab.value === '支出' ? 'expense' : 'income'
  const map = new Map<string, { amount: number; color: string; icon: string }>()
  for (const tx of periodTransactions.value) {
    if (tx.type !== type) continue
    const cat = catStore.getCategoryById(tx.categoryId)
    const name = cat?.name || '未知'
    const cur = map.get(name) || { amount: 0, color: cat?.color || '#B8A99E', icon: cat?.icon || '💰' }
    cur.amount += tx.amount
    map.set(name, cur)
  }
  const arr = Array.from(map.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
  const maxAmt = arr[0]?.amount || 1
  return arr.map(item => ({
    icon: item.icon,
    name: item.name,
    value: formatAmount(item.amount),
    pct: Math.round((item.amount / maxAmt) * 100),
    barColor: item.color,
    iconBg: `linear-gradient(135deg, ${item.color}22, ${item.color}44)`,
  }))
})
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
  padding: 48px $space-6 20px;
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
  letter-spacing: -0.3px;
}

/* ===== 时间周期 ===== */
.period-bar {
  display: flex;
  gap: 8px;
  padding: 0 $space-6 20px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.period-chip {
  padding: 8px 16px;
  border-radius: $radius-full;
  background: $surface;
  border: 1px solid $border;
  cursor: pointer;
  white-space: nowrap;

  &.active {
    background: $gradient-brand;
    border-color: transparent;
    box-shadow: $shadow-brand;

    .period-chip-text {
      color: white;
    }
  }
}

.period-chip-text {
  @include text-caption;
  color: $text-secondary;
  font-weight: 700;
}

/* ===== 收支汇总 ===== */
.summary-row {
  display: flex;
  gap: 12px;
  padding: 0 $space-6 20px;
}

.summary-card {
  flex: 1;
  background: $surface;
  border-radius: $radius-md;
  padding: 20px;
  border: 1px solid $border;
  box-shadow: $shadow-sm;
  text-align: center;
}

.summary-label {
  @include text-small;
  color: $text-tertiary;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: block;
}

.summary-value {
  @include text-hero;
  font-size: 24px;
  line-height: 1.2;
  display: block;

  &.in {
    color: $success-500;
  }

  &.out {
    color: $text-primary;
  }
}

.summary-change {
  @include text-caption;
  color: $text-secondary;
  margin-top: 4px;
  display: block;
}

/* ===== 折线图 ===== */
.chart-card {
  margin: 0 $space-6 20px;
  background: $surface;
  border-radius: $radius-lg;
  padding: 24px;
  border: 1px solid $border;
  box-shadow: $shadow-sm;
}

.chart-title {
  @include text-h3;
  margin-bottom: 16px;
  display: block;
}

/* ===== 饼图区 ===== */
.pie-section {
  margin: 0 $space-6 20px;
}

.pie-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.pie-title {
  @include text-h3;
}

.pie-tabs {
  display: flex;
  gap: 4px;
  background: $bg-primary;
  border-radius: 8px;
  padding: 2px;
}

.pie-tab {
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  background: transparent;

  &.active {
    background: $surface;
    box-shadow: $shadow-sm;

    .pie-tab-text {
      color: $text-primary;
    }
  }
}

.pie-tab-text {
  @include text-small;
  font-size: 11px;
  color: $text-tertiary;
}

.pie-card {
  background: $surface;
  border-radius: $radius-lg;
  padding: 24px;
  border: 1px solid $border;
  box-shadow: $shadow-sm;
}

/* 饼图 */
.pie-chart {
  width: 140px;
  height: 140px;
  margin: 0 auto 20px;
  position: relative;
}

.pie-chart-inner {
  width: 100%;
  height: 100%;
  position: relative;
}

.pie-ring {
  width: 100%;
  height: 100%;
  border-radius: $radius-circle;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70px;
    height: 70px;
    border-radius: $radius-circle;
    background: $surface;
  }
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  text-align: center;
}

.pie-center-amount {
  @include text-h3;
  color: $text-primary;
  display: block;
}

.pie-center-label {
  @include text-small;
  color: $text-tertiary;
  display: block;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pie-legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pie-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.pie-legend-name {
  @include text-body;
  flex: 1;
}

.pie-legend-value {
  @include text-body;
  font-variant-numeric: tabular-nums;
  color: $text-primary;
}

.pie-legend-pct {
  @include text-caption;
  color: $text-secondary;
  min-width: 40px;
  text-align: right;
}

/* ===== 消费排行 ===== */
.rank-card {
  margin: 0 $space-6 20px;
  background: $surface;
  border-radius: $radius-lg;
  padding: 24px;
  border: 1px solid $border;
  box-shadow: $shadow-sm;
}

.rank-title {
  @include text-h3;
  margin-bottom: 16px;
  display: block;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid $border;

  &:last-child {
    border-bottom: none;
  }
}

.rank-num {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-primary;
  flex-shrink: 0;

  &.top {
    background: $gradient-brand;

    .rank-num-text {
      color: white;
    }
  }
}

.rank-num-text {
  @include text-caption;
  color: $text-secondary;
  font-weight: 700;
}

.rank-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rank-icon-text {
  font-size: 18px;
}

.rank-info {
  flex: 1;
}

.rank-name {
  @include text-body;
  display: block;
  margin-bottom: 4px;
}

.rank-bar-track {
  height: 4px;
  background: $border;
  border-radius: 2px;
  overflow: hidden;
}

.rank-bar-fill {
  height: 100%;
  border-radius: 2px;
}

.rank-value {
  @include text-body;
  font-variant-numeric: tabular-nums;
  color: $text-primary;
  flex-shrink: 0;
}
</style>
