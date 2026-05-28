<template>
  <view class="app">
    <!-- Header -->
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
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
        <text class="summary-value in">¥12,500</text>
        <text class="summary-change">较上月 +15%</text>
      </view>
      <view class="summary-card">
        <text class="summary-label">支出</text>
        <text class="summary-value out">¥3,858</text>
        <text class="summary-change">较上月 -8%</text>
      </view>
    </view>

    <!-- 收支趋势柱状图 -->
    <view class="chart-card">
      <text class="chart-title">收支趋势</text>
      <view class="bar-chart">
        <view class="bar-col" v-for="bar in barData" :key="bar.label">
          <view class="bar-wrapper">
            <view class="bar" :class="bar.type" :style="{ height: bar.pct + '%' }"></view>
            <text class="bar-value">{{ bar.value }}</text>
          </view>
          <text class="bar-label">{{ bar.label }}</text>
        </view>
      </view>
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
              <text class="pie-center-amount">¥3,858</text>
              <text class="pie-center-label">总支出</text>
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
import { ref } from 'vue'

/** 返回上一页 */
function goBack() {
  uni.navigateBack()
}

/** 当前选中的时间周期 */
const activePeriod = ref('本月')

/** 可选时间周期 */
const periods = ['本周', '本月', '本季', '本年', '自定义']

/** 饼图标签切换 */
const pieTab = ref('支出')

/** 柱状图数据 */
const barData = [
  { label: '1日', type: 'out', pct: 30, value: '¥800' },
  { label: '5日', type: 'in', pct: 100, value: '¥12.5K' },
  { label: '10日', type: 'out', pct: 25, value: '¥650' },
  { label: '15日', type: 'out', pct: 35, value: '¥900' },
  { label: '20日', type: 'out', pct: 40, value: '¥1,050' },
  { label: '25日', type: 'out', pct: 28, value: '¥720' },
  { label: '30日', type: 'out', pct: 32, value: '¥838' },
]

/** 饼图渐变色 */
const pieGradient = `conic-gradient(
  #C8956C 0deg 111.6deg,
  #7A9EAF 111.6deg 200.88deg,
  #6B8E6B 200.88deg 244.44deg,
  #C06C5F 244.44deg 273.6deg,
  #D4A574 273.6deg 298.8deg,
  #B8A99E 298.8deg 360deg
)`

/** 饼图图例数据 */
const pieLegendData = [
  { name: '餐饮美食', value: '¥1,200', pct: 31, color: '#C8956C' },
  { name: '居住', value: '¥1,000', pct: 26, color: '#7A9EAF' },
  { name: '交通出行', value: '¥480', pct: 12, color: '#6B8E6B' },
  { name: '购物消费', value: '¥320', pct: 8, color: '#C06C5F' },
  { name: '休闲娱乐', value: '¥258', pct: 7, color: '#D4A574' },
  { name: '其他', value: '¥600', pct: 16, color: '#B8A99E' },
]

/** 消费排行数据 */
const rankData = [
  { icon: '🍜', name: '餐饮美食', value: '¥1,200', pct: 100, barColor: '#C8956C', iconBg: 'linear-gradient(135deg, #FAF0E6, #F5E6D3)' },
  { icon: '🏠', name: '居住', value: '¥1,000', pct: 83, barColor: '#7A9EAF', iconBg: 'linear-gradient(135deg, #E8F1F5, #D6E5EC)' },
  { icon: '🚇', name: '交通出行', value: '¥480', pct: 40, barColor: '#6B8E6B', iconBg: 'linear-gradient(135deg, #E8F0E8, #D4E6D4)' },
  { icon: '🛍️', name: '购物消费', value: '¥320', pct: 27, barColor: '#C06C5F', iconBg: 'linear-gradient(135deg, #F5E0DC, #F0D5CF)' },
  { icon: '🎬', name: '休闲娱乐', value: '¥258', pct: 22, barColor: '#D4A574', iconBg: 'linear-gradient(135deg, #FFF8E1, #FFECB3)' },
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

/* ===== 柱状图 ===== */
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
  margin-bottom: 20px;
  display: block;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 160px;
  padding: 0 4px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.bar-wrapper {
  flex: 1;
  width: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar {
  width: 100%;
  border-radius: 6px 6px 0 0;
  transition: height 0.6s ease;

  &.in {
    background: $gradient-success;
  }

  &.out {
    background: $gradient-danger;
  }
}

.bar-value {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  @include text-micro;
  font-size: 9px;
  white-space: nowrap;
  color: $text-secondary;
}

.bar-label {
  @include text-small;
  font-size: 10px;
  color: $text-tertiary;
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
