<template>
  <view class="app">
    <view class="page-content">
      <!-- 头部 -->
      <view class="header">
        <text class="header-title">我的资产</text>
        <view class="header-actions">
          <view class="icon-btn">
            <text class="icon-text">📊</text>
          </view>
          <view class="icon-btn">
            <text class="icon-text">⚙️</text>
          </view>
        </view>
      </view>

      <!-- 净资产卡片 -->
      <view class="networth-card">
        <text class="networth-label">净资产</text>
        <text class="networth-value">{{ formatAmount(totalNetWorth) }}</text>
        <view class="networth-change" :class="netWorthChange >= 0 ? '' : 'down'">
          <text class="networth-change-icon">{{ netWorthChange >= 0 ? '↑' : '↓' }}</text>
          <text>较上月 {{ formatAmount(netWorthChange, true) }}</text>
        </view>
      </view>

      <!-- 资产构成 -->
      <view class="section-header">
        <text class="section-title">资产构成</text>
        <text class="section-link">详情</text>
      </view>
      <view class="composition-card">
        <!-- 环形图 -->
        <view class="ring-chart">
          <view class="ring-chart-inner">
            <text class="ring-chart-label">总资产</text>
            <text class="ring-chart-value">{{ formatAmountCompact(totalAssets) }}</text>
          </view>
          <view class="ring-chart-svg">
            <view
              v-for="(segment, index) in ringSegments"
              :key="index"
              class="ring-segment"
              :style="{
                background: `conic-gradient(${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg, transparent ${segment.startAngle}deg)`,
              }"
            />
          </view>
        </view>

        <!-- 图例 -->
        <view class="legend">
          <view
            v-for="item in compositionData"
            :key="item.name"
            class="legend-item"
          >
            <view class="legend-dot" :style="{ background: item.color }" />
            <view class="legend-info">
              <text class="legend-name">{{ item.name }}</text>
              <text class="legend-value">{{ formatAmount(item.amount) }}</text>
            </view>
            <text class="legend-pct">{{ item.percentage }}%</text>
          </view>
        </view>
      </view>

      <!-- 账户列表 -->
      <view class="section-header">
        <text class="section-title">账户列表</text>
        <text class="section-link">管理</text>
      </view>
      <view class="account-list">
        <view
          v-for="account in accountStore.accounts"
          :key="account.id"
          class="account-card"
        >
          <view class="account-icon" :style="{ background: getAccountIconBg(account.type) }">
            <text class="account-icon-text">{{ account.icon }}</text>
          </view>
          <view class="account-info">
            <text class="account-name">{{ account.name }}</text>
            <text class="account-bank">{{ account.bank || getAccountTypeLabel(account.type) }}</text>
          </view>
          <view class="account-right">
            <text
              class="account-amount"
              :class="account.balance >= 0 ? '' : 'negative'"
            >
              {{ formatAmount(account.balance) }}
            </text>
            <text
              class="account-change"
              :class="getAccountChange(account.id) >= 0 ? 'up' : 'down'"
            >
              {{ formatAmount(getAccountChange(account.id), true) }}
            </text>
          </view>
        </view>
      </view>

      <!-- 添加账户按钮 -->
      <view class="add-account-btn">
        <text class="add-account-icon">+</text>
        <text class="add-account-text">添加账户</text>
      </view>

      <!-- 资产趋势 -->
      <view class="section-header">
        <text class="section-title">资产趋势</text>
        <text class="section-link">近6个月</text>
      </view>
      <view class="trend-card">
        <view class="trend-chart">
          <view
            v-for="(bar, index) in trendData"
            :key="index"
            class="trend-bar-wrapper"
          >
            <view
              class="trend-bar"
              :class="{ active: index === trendData.length - 1 }"
              :style="{ height: bar.height + '%' }"
            >
              <text class="trend-bar-value">{{ bar.value }}</text>
            </view>
            <text class="trend-bar-label">{{ bar.label }}</text>
          </view>
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
import { useAccountStore } from '@/stores/account'
import { formatAmount } from '@/utils/format'
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'

const appStore = useAppStore()
const accountStore = useAccountStore()

onShow(() => {
  appStore.setCurrentTab(2)
})

// 计算总资产（只计算正余额）
const totalAssets = computed(() => {
  return accountStore.accounts
    .filter(acc => acc.balance > 0)
    .reduce((sum, acc) => sum + acc.balance, 0)
})

// 计算净资产（所有余额之和）
const totalNetWorth = computed(() => {
  return accountStore.accounts.reduce((sum, acc) => sum + acc.balance, 0)
})

// 月度变化（模拟数据）
const netWorthChange = computed(() => {
  return 324000 // +¥3,240.00
})

// 格式化金额（简化显示）
function formatAmountCompact(cents: number): string {
  const yuan = cents / 100
  if (yuan >= 10000) {
    return '¥' + (yuan / 10000).toFixed(1) + '万'
  }
  return formatAmount(cents)
}

// 账户类型标签
function getAccountTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    savings: '储蓄账户',
    credit: '信用卡',
    investment: '投资账户',
    cash: '现金',
  }
  return labels[type] || '账户'
}

// 账户图标背景色
function getAccountIconBg(type: string): string {
  const colors: Record<string, string> = {
    savings: 'linear-gradient(135deg, #FAF0E6, #F5E6D3)',
    credit: 'linear-gradient(135deg, #F0F0F0, #E0E0E0)',
    investment: 'linear-gradient(135deg, #E8F1F5, #D6E5EC)',
    cash: 'linear-gradient(135deg, #F5E0DC, #F0D5CF)',
  }
  return colors[type] || 'linear-gradient(135deg, #FAF0E6, #F5E6D3)'
}

// 获取账户月度变化（模拟数据）
function getAccountChange(accountId: string): number {
  const changes: Record<string, number> = {
    'acc-cmb': 200000,      // +¥2,000
    'acc-alipay': 150000,   // +¥1,500
    'acc-wechat': 80000,    // +¥800
    'acc-cash': 100000,     // +¥1,000
    'acc-credit': -150000,  // -¥1,500
  }
  return changes[accountId] || 0
}

// 资产构成数据
const compositionData = computed(() => {
  const accounts = accountStore.accounts.filter(acc => acc.balance > 0)
  const total = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  if (total === 0) return []

  return accounts.map(acc => ({
    name: acc.name,
    amount: acc.balance,
    percentage: Math.round((acc.balance / total) * 100),
    color: getTypeColor(acc.type),
  }))
})

// 根据账户类型获取颜色
function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    savings: '#C8956C',
    credit: '#7A9EAF',
    investment: '#6B8E6B',
    cash: '#C06C5F',
  }
  return colors[type] || '#C8956C'
}

// 环形图分段
const ringSegments = computed(() => {
  let currentAngle = 0
  const circumference = 2 * Math.PI * 70

  return compositionData.value.map(item => {
    const segmentAngle = (item.percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + segmentAngle
    currentAngle = endAngle

    return {
      color: item.color,
      startAngle,
      endAngle,
    }
  })
})

// 趋势数据（模拟）
const trendData = computed(() => {
  return [
    { label: '1月', value: '¥12万', height: 60 },
    { label: '2月', value: '¥13万', height: 68 },
    { label: '3月', value: '¥14万', height: 72 },
    { label: '4月', value: '¥15万', height: 78 },
    { label: '5月', value: '¥16万', height: 88 },
    { label: '6月', value: '¥16万', height: 92 },
  ]
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

// 头部
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-6;
}

.header-title {
  @include text-h1;
}

.header-actions {
  display: flex;
  gap: $space-2;
}

.icon-btn {
  @include icon-btn;
}

.icon-text {
  font-size: 18px;
}

// 净资产卡片
.networth-card {
  @include card-emphasis;
  padding: $space-8;
  text-align: center;
  margin-bottom: $space-6;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(200, 149, 108, 0.08) 0%, transparent 70%);
  }
}

.networth-label {
  font: 600 12px/1.4 $font-sans;
  color: $text-tertiary;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: $space-2;
}

.networth-value {
  @include text-hero;
  display: block;
  margin-bottom: $space-3;
  position: relative;
}

.networth-change {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-4;
  border-radius: $radius-full;
  background: $success-100;
  font: 700 14px/1.4 $font-sans;
  color: $success-500;

  &.down {
    background: $danger-100;
    color: $danger-500;
  }
}

.networth-change-icon {
  font-size: 16px;
}

// 区块标题
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-3;
}

.section-title {
  @include text-h2;
}

.section-link {
  font: 600 13px/1.4 $font-sans;
  color: $brand-600;
}

// 资产构成卡片
.composition-card {
  @include card-base;
  padding: $space-6;
  margin-bottom: $space-6;
}

// 环形图
.ring-chart {
  width: 160px;
  height: 160px;
  margin: 0 auto $space-5;
  position: relative;
}

.ring-chart-svg {
  width: 100%;
  height: 100%;
  border-radius: $radius-circle;
  background: $border;
  position: relative;
  overflow: hidden;
}

.ring-segment {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ring-chart-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
  background: $surface;
  width: 100px;
  height: 100px;
  border-radius: $radius-circle;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ring-chart-label {
  font: 600 12px/1.4 $font-sans;
  color: $text-tertiary;
}

.ring-chart-value {
  @include text-h3;
}

// 图例
.legend {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.legend-name {
  font: 600 14px/1.4 $font-sans;
}

.legend-value {
  font: 700 14px/1.4 $font-sans;
  font-variant-numeric: tabular-nums;
}

.legend-pct {
  font: 600 13px/1.4 $font-sans;
  color: $text-secondary;
}

// 账户列表
.account-list {
  margin-bottom: $space-4;
}

.account-card {
  @include card-base;
  padding: $space-5;
  display: flex;
  align-items: center;
  gap: $space-3;
  margin-bottom: $space-3;
  transition: $transition-base;

  &:active {
    transform: scale(0.98);
  }
}

.account-icon {
  width: 48px;
  height: 48px;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.account-icon-text {
  font-size: 22px;
}

.account-info {
  flex: 1;
}

.account-name {
  font: 700 15px/1.4 $font-sans;
  margin-bottom: 2px;
}

.account-bank {
  font: 600 12px/1.4 $font-sans;
  color: $text-secondary;
}

.account-right {
  text-align: right;
}

.account-amount {
  font: 700 18px/1.4 $font-sans;
  font-variant-numeric: tabular-nums;

  &.negative {
    color: $danger-500;
  }
}

.account-change {
  font: 600 12px/1.4 $font-sans;
  margin-top: 2px;

  &.up {
    color: $success-500;
  }

  &.down {
    color: $danger-500;
  }
}

// 添加账户按钮
.add-account-btn {
  padding: $space-4;
  border-radius: $radius-md;
  border: 2px dashed $border;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  margin-bottom: $space-6;
  transition: $transition-base;

  &:active {
    background: $brand-50;
    border-color: $brand-300;
  }
}

.add-account-icon {
  font: 700 20px/1 $font-sans;
  color: $text-secondary;
}

.add-account-text {
  font: 700 14px/1.4 $font-sans;
  color: $text-secondary;
}

// 资产趋势卡片
.trend-card {
  @include card-base;
  padding: $space-6;
}

.trend-chart {
  height: 120px;
  display: flex;
  align-items: flex-end;
  gap: $space-2;
}

.trend-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.trend-bar {
  width: 100%;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, $brand-500, $brand-600);
  opacity: 0.3;
  position: relative;
  transition: $transition-base;

  &.active {
    opacity: 1;
  }
}

.trend-bar-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font: 700 10px/1.4 $font-sans;
  color: $brand-600;
  white-space: nowrap;
  opacity: 0;

  .trend-bar.active & {
    opacity: 1;
  }
}

.trend-bar-label {
  font: 600 10px/1.4 $font-sans;
  color: $text-tertiary;
  margin-top: $space-2;
}
</style>
