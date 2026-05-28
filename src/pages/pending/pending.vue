<template>
  <view class="app">
    <!-- Header -->
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">待确认</text>
      <view class="header-badge">
        <text class="badge-text">{{ pendingItems.length }}</text>
      </view>
    </view>

    <!-- 信息提示 -->
    <view class="info-banner">
      <text class="info-banner-text">系统自动监听到的消费记录，确认后会自动记入明细。您可以在设置中管理监听来源。</text>
    </view>

    <!-- 待确认列表 -->
    <view class="pending-item" v-for="item in pendingItems" :key="item.id">
      <view class="pending-source">
        <view class="pending-source-icon" :style="{ background: item.sourceIconBg }">
          <text class="pending-source-icon-text">{{ item.sourceIcon }}</text>
        </view>
        <text class="pending-source-name">{{ item.sourceName }}</text>
        <text class="pending-source-time">{{ item.time }}</text>
      </view>
      <view class="pending-content">
        <text class="pending-raw">"{{ item.rawText }}"</text>
        <view class="pending-parsed">
          <view class="parsed-row">
            <text class="parsed-label">金额</text>
            <text class="parsed-value amount">{{ item.amount }}</text>
          </view>
          <view class="parsed-row">
            <text class="parsed-label">商户</text>
            <text class="parsed-value">{{ item.merchant }}</text>
          </view>
          <view class="parsed-row">
            <text class="parsed-label">时间</text>
            <text class="parsed-value">{{ item.parsedTime }}</text>
          </view>
          <view class="parsed-row">
            <text class="parsed-label">分类</text>
            <text class="parsed-value">{{ item.category }}</text>
          </view>
          <view class="parsed-row">
            <text class="parsed-label">账户</text>
            <text class="parsed-value">{{ item.account }}</text>
          </view>
        </view>
      </view>
      <view class="pending-actions">
        <view class="pending-btn confirm" @tap="onConfirm(item.id)">
          <text class="pending-btn-text">✓ 确认</text>
        </view>
        <view class="pending-btn edit" @tap="onEdit(item.id)">
          <text class="pending-btn-text">✏️ 编辑</text>
        </view>
        <view class="pending-btn ignore" @tap="onIgnore(item.id)">
          <text class="pending-btn-text">忽略</text>
        </view>
      </view>
    </view>

    <!-- 监听来源设置 -->
    <view class="source-section">
      <text class="source-title">监听来源设置</text>
      <view class="source-list">
        <view class="source-item" v-for="source in sourceList" :key="source.name">
          <view class="source-icon" :style="{ background: source.iconBg }">
            <text class="source-icon-text">{{ source.icon }}</text>
          </view>
          <view class="source-info">
            <text class="source-name">{{ source.name }}</text>
            <text class="source-status" :class="{ off: !source.enabled }">
              {{ source.enabled ? '● 监听中' : '○ 已关闭' }}
            </text>
          </view>
          <view class="source-toggle" :class="{ off: !source.enabled }" @tap="toggleSource(source)">
            <view class="source-toggle-thumb"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

/** 返回上一页 */
function goBack() {
  uni.navigateBack()
}

/** 确认记录 */
function onConfirm(id: number) {
  console.log('确认记录:', id)
  pendingItems.splice(pendingItems.findIndex(item => item.id === id), 1)
}

/** 编辑记录 */
function onEdit(id: number) {
  console.log('编辑记录:', id)
}

/** 忽略记录 */
function onIgnore(id: number) {
  console.log('忽略记录:', id)
  pendingItems.splice(pendingItems.findIndex(item => item.id === id), 1)
}

/** 切换来源开关 */
function toggleSource(source: typeof sourceList[number]) {
  source.enabled = !source.enabled
}

/** 待确认数据 */
const pendingItems = reactive([
  {
    id: 1,
    sourceIcon: '🏦',
    sourceName: '招商银行',
    sourceIconBg: 'linear-gradient(135deg, #E8F1F5, #D6E5EC)',
    time: '2分钟前',
    rawText: '您尾号8888的账户于05-26 14:32支出人民币35.00元，商户：瑞幸咖啡。',
    amount: '-¥35.00',
    merchant: '瑞幸咖啡',
    parsedTime: '05-26 14:32',
    category: '餐饮美食',
    account: '招商银行储蓄卡',
  },
  {
    id: 2,
    sourceIcon: '💳',
    sourceName: '支付宝',
    sourceIconBg: 'linear-gradient(135deg, #E8F0E8, #D4E6D4)',
    time: '15分钟前',
    rawText: '支付宝-花呗账单：05-26 12:15 美团外卖 -¥28.50',
    amount: '-¥28.50',
    merchant: '美团外卖',
    parsedTime: '05-26 12:15',
    category: '餐饮美食',
    account: '支付宝花呗',
  },
  {
    id: 3,
    sourceIcon: '💬',
    sourceName: '微信支付',
    sourceIconBg: 'linear-gradient(135deg, #FAF0E6, #F5E6D3)',
    time: '1小时前',
    rawText: '微信支付凭证：05-26 09:08 滴滴出行 -¥15.00',
    amount: '-¥15.00',
    merchant: '滴滴出行',
    parsedTime: '05-26 09:08',
    category: '交通出行',
    account: '微信零钱',
  },
])

/** 监听来源列表 */
const sourceList = reactive([
  { icon: '🏦', name: '招商银行', iconBg: 'linear-gradient(135deg, #E8F1F5, #D6E5EC)', enabled: true },
  { icon: '💳', name: '支付宝', iconBg: 'linear-gradient(135deg, #E8F0E8, #D4E6D4)', enabled: true },
  { icon: '💬', name: '微信支付', iconBg: 'linear-gradient(135deg, #FAF0E6, #F5E6D3)', enabled: false },
])
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
  flex: 1;
}

.header-badge {
  padding: 4px 12px;
  border-radius: $radius-full;
  background: $danger-500;
}

.badge-text {
  @include text-caption;
  color: white;
  font-weight: 700;
}

/* ===== 信息提示 ===== */
.info-banner {
  margin: 0 $space-6 20px;
  padding: 16px 20px;
  border-radius: $radius-md;
  background: linear-gradient(135deg, $accent-100, #D6E5EC);
  border: 1px solid $accent-100;
}

.info-banner-text {
  @include text-caption;
  color: $accent-600;
  line-height: 1.5;
  display: block;
}

/* ===== 待确认项 ===== */
.pending-item {
  margin: 0 $space-6 12px;
  background: $surface;
  border-radius: $radius-lg;
  padding: 20px;
  box-shadow: $shadow-sm;
  border: 2px solid $border;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: $brand-500;
  }
}

.pending-source {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.pending-source-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pending-source-icon-text {
  font-size: 16px;
}

.pending-source-name {
  @include text-body;
  font-weight: 700;
  color: $text-primary;
}

.pending-source-time {
  @include text-small;
  color: $text-tertiary;
  margin-left: auto;
}

.pending-content {
  background: $bg-primary;
  border-radius: $radius-sm;
  padding: 16px;
  margin-bottom: 16px;
}

.pending-raw {
  @include text-caption;
  color: $text-secondary;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed $border;
  display: block;
  line-height: 1.5;
}

.pending-parsed {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.parsed-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.parsed-label {
  @include text-caption;
  color: $text-tertiary;
}

.parsed-value {
  @include text-body;
  font-weight: 700;
  color: $text-primary;

  &.amount {
    color: $danger-500;
    font-size: 18px;
  }
}

.pending-actions {
  display: flex;
  gap: 10px;
}

.pending-btn {
  flex: 1;
  padding: 12px;
  border-radius: $radius-sm;
  text-align: center;
  cursor: pointer;
  border: none;

  &.confirm {
    background: $gradient-brand;
    box-shadow: $shadow-brand;
  }

  &.edit {
    background: $bg-primary;
    border: 1px solid $border;
  }

  &.ignore {
    background: transparent;
    border: 1px solid $border;
  }
}

.pending-btn-text {
  @include text-body;
  font-weight: 700;

  .confirm & {
    color: white;
  }

  .edit & {
    color: $text-secondary;
  }

  .ignore & {
    color: $text-tertiary;
  }
}

/* ===== 监听来源设置 ===== */
.source-section {
  margin: 24px $space-6 0;
}

.source-title {
  @include text-h3;
  margin-bottom: 12px;
  display: block;
}

.source-list {
  background: $surface;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  border: 1px solid $border;
  overflow: hidden;
}

.source-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid $border;

  &:last-child {
    border-bottom: none;
  }
}

.source-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.source-icon-text {
  font-size: 20px;
}

.source-info {
  flex: 1;
}

.source-name {
  @include text-body;
  font-weight: 700;
  color: $text-primary;
  display: block;
}

.source-status {
  @include text-caption;
  color: $success-500;
  display: block;
  margin-top: 2px;

  &.off {
    color: $text-tertiary;
  }
}

/* 开关 */
.source-toggle {
  width: 48px;
  height: 28px;
  border-radius: 14px;
  background: $success-500;
  position: relative;
  cursor: pointer;
  transition: background $transition-base;

  &.off {
    background: $border;
  }
}

.source-toggle-thumb {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 24px;
  height: 24px;
  border-radius: $radius-circle;
  background: white;
  box-shadow: $shadow-sm;
  transition: transform $transition-base;
}

.source-toggle.off .source-toggle-thumb {
  transform: translateX(-20px);
}
</style>
