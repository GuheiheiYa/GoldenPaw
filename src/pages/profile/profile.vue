<template>
  <view class="app">
    <!-- Header -->
    <view class="header">
      <text class="header-title">我的</text>
    </view>

    <!-- 用户卡片 -->
    <view class="user-card">
      <view class="user-avatar">
        <text class="user-avatar-text">👤</text>
      </view>
      <text class="user-name">GoldenPaw用户</text>
      <text class="user-id">ID: goldenpaw_001</text>
      <view class="user-stats">
        <view class="user-stat">
          <text class="stat-value">{{ recordDays }}</text>
          <text class="stat-label">记账天数</text>
        </view>
        <view class="user-stat">
          <text class="stat-value">{{ recordCount }}</text>
          <text class="stat-label">记账笔数</text>
        </view>
        <view class="user-stat">
          <text class="stat-value">3</text>
          <text class="stat-label">存钱目标</text>
        </view>
      </view>
    </view>

    <!-- 数据管理 -->
    <view class="menu-section">
      <text class="menu-title">数据管理</text>
      <view class="menu-list">
        <view class="menu-item" v-for="item in dataMenus" :key="item.name" @tap="onMenuTap(item.name)">
          <view class="menu-icon" :class="item.iconClass">
            <text class="menu-icon-text">{{ item.icon }}</text>
          </view>
          <view class="menu-info">
            <text class="menu-name">{{ item.name }}</text>
            <text class="menu-desc">{{ item.desc }}</text>
          </view>
          <uni-icons class="menu-arrow" type="arrow-right" size="14" color="#C8B8A8" />
        </view>
      </view>
    </view>

    <!-- 个性化 -->
    <view class="menu-section">
      <text class="menu-title">个性化</text>
      <view class="menu-list">
        <view class="menu-item" v-for="item in personalMenus" :key="item.name" @tap="onMenuTap(item.name)">
          <view class="menu-icon" :class="item.iconClass">
            <text class="menu-icon-text">{{ item.icon }}</text>
          </view>
          <view class="menu-info">
            <text class="menu-name">{{ item.name }}</text>
            <text class="menu-desc">{{ item.desc }}</text>
          </view>
          <uni-icons class="menu-arrow" type="arrow-right" size="14" color="#C8B8A8" />
        </view>
      </view>
    </view>

    <!-- 基础设置 -->
    <view class="menu-section">
      <text class="menu-title">基础设置</text>
      <view class="menu-list">
        <view class="menu-item" v-for="item in basicMenus" :key="item.name" @tap="onMenuTap(item.name)">
          <view class="menu-icon" :class="item.iconClass">
            <text class="menu-icon-text">{{ item.icon }}</text>
          </view>
          <view class="menu-info">
            <text class="menu-name">{{ item.name }}</text>
            <text class="menu-desc">{{ item.desc }}</text>
          </view>
          <uni-icons class="menu-arrow" type="arrow-right" size="14" color="#C8B8A8" />
        </view>
      </view>
    </view>

    <!-- 关于 -->
    <view class="menu-section">
      <text class="menu-title">关于</text>
      <view class="menu-list">
        <view class="menu-item" v-for="item in aboutMenus" :key="item.name" @tap="onMenuTap(item.name)">
          <view class="menu-icon" :class="item.iconClass">
            <text class="menu-icon-text">{{ item.icon }}</text>
          </view>
          <view class="menu-info">
            <text class="menu-name">{{ item.name }}</text>
            <text v-if="item.desc" class="menu-desc">{{ item.desc }}</text>
          </view>
          <uni-icons v-if="item.arrow !== false" class="menu-arrow" type="arrow-right" size="14" color="#C8B8A8" />
        </view>
      </view>
    </view>

    <!-- 主题颜色（放最后） -->
    <view class="menu-section">
      <view class="menu-list">
        <view class="menu-item" v-for="item in themeMenu" :key="item.name" @tap="onMenuTap(item.name)">
          <view class="menu-icon" :class="item.iconClass">
            <text class="menu-icon-text">{{ item.icon }}</text>
          </view>
          <view class="menu-info">
            <text class="menu-name">{{ item.name }}</text>
            <text class="menu-desc">{{ item.desc }}</text>
          </view>
          <uni-icons class="menu-arrow" type="arrow-right" size="14" color="#C8B8A8" />
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
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'

const appStore = useAppStore()
const txStore = useTransactionStore()

onShow(() => {
  appStore.setCurrentTab(4)
})

/** 记账天数 */
const recordDays = computed(() => {
  const dates = new Set(txStore.transactions.map(t => t.date))
  return dates.size
})

/** 记账笔数 */
const recordCount = computed(() => txStore.transactions.length)

/** 菜单名称到设置类型的映射 */
const menuTypeMap: Record<string, string> = {
  '导出数据': 'export',
  '导入数据': 'import',
  '云同步': 'sync',
  '清空数据': 'clear',
  '主题颜色': 'theme',
  '提醒设置': 'reminder',
  '密码/指纹锁': 'security',
  '分类管理': 'category',
  '账户管理': 'account',
  '币种设置': 'currency',
  '记账周期': 'cycle',
}

/** 点击菜单项 */
function onMenuTap(name: string) {
  // 特殊处理
  if (name === '帮助中心') {
    uni.navigateTo({ url: '/pages/help/help' })
    return
  }
  if (name === '评分鼓励') {
    uni.showToast({ title: '感谢您的支持！', icon: 'none' })
    return
  }
  if (name === '用户协议') {
    uni.showToast({ title: '用户协议页面开发中', icon: 'none' })
    return
  }
  if (name === 'GoldenPaw') {
    return
  }

  // 跳转设置页面
  const type = menuTypeMap[name]
  if (type) {
    uni.navigateTo({ url: `/pages/settings/index?type=${type}` })
  }
}

/** 数据管理菜单 */
const dataMenus = [
  { icon: '📤', name: '导出数据', desc: 'CSV / Excel 格式', iconClass: 'gold' },
  { icon: '📥', name: '导入数据', desc: '微信 / 支付宝账单', iconClass: 'green' },
  { icon: '☁️', name: '云同步', desc: '上次同步: 5分钟前', iconClass: 'blue' },
  { icon: '🗑️', name: '清空数据', desc: '谨慎操作，不可恢复', iconClass: 'red' },
]

/** 个性化菜单 */
const personalMenus = [
  { icon: '🔔', name: '提醒设置', desc: '每日记账提醒、预算预警', iconClass: 'blue' },
  { icon: '🔒', name: '密码/指纹锁', desc: '保护您的财务隐私', iconClass: 'green' },
]

/** 主题菜单（放最后） */
const themeMenu = [
  { icon: '🎨', name: '主题颜色', desc: '暖金（当前）', iconClass: 'gold' },
]

/** 基础设置菜单 */
const basicMenus = [
  { icon: '🏷️', name: '分类管理', desc: '自定义收支分类', iconClass: 'gold' },
  { icon: '💳', name: '账户管理', desc: '管理资产账户', iconClass: 'blue' },
  { icon: '💰', name: '币种设置', desc: 'CNY（人民币）', iconClass: 'green' },
  { icon: '📅', name: '记账周期', desc: '自然月', iconClass: 'gray' },
]

/** 关于菜单 */
const aboutMenus = [
  { icon: '❓', name: '帮助中心', desc: '', iconClass: 'blue' },
  { icon: '⭐', name: '评分鼓励', desc: '', iconClass: 'gold' },
  { icon: '📋', name: '用户协议', desc: '', iconClass: 'gray' },
  { icon: '🐾', name: 'GoldenPaw', desc: 'v1.0.0', iconClass: 'gold', arrow: false },
]
</script>

<style lang="scss" scoped>
@use '../../styles/design-system' as *;
@use '../../styles/mixins' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
  padding-bottom: 160px;
}

/* ===== Header ===== */
.header {
  padding: 48px $space-6 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  @include text-h1;
}

/* ===== 用户卡片 ===== */
.user-card {
  margin: 0 $space-6 24px;
  background: $surface;
  border-radius: $radius-lg;
  padding: 28px;
  box-shadow: $shadow-md;
  border: 2px solid $brand-100;
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

.user-avatar {
  width: 72px;
  height: 72px;
  border-radius: $radius-circle;
  background: $gradient-brand;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: $shadow-brand;
}

.user-avatar-text {
  font-size: 36px;
}

.user-name {
  @include text-h2;
  display: block;
  margin-bottom: 4px;
}

.user-id {
  @include text-caption;
  color: $text-tertiary;
  display: block;
  margin-bottom: 16px;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.user-stat {
  text-align: center;
}

.stat-value {
  @include text-h2;
  color: $brand-600;
  font-weight: 800;
  display: block;
}

.stat-label {
  @include text-small;
  color: $text-tertiary;
  margin-top: 2px;
  display: block;
}

/* ===== 菜单区域 ===== */
.menu-section {
  margin: 0 $space-6 16px;
}

.menu-title {
  @include text-micro;
  color: $text-tertiary;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 8px;
  padding-left: 4px;
  display: block;
}

.menu-list {
  background: $surface;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  border: 1px solid $border;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid $border;
  cursor: pointer;
  transition: $transition-base;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: $brand-50;
  }
}

.menu-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.gold {
    background: linear-gradient(135deg, $brand-100, $bg-tertiary);
  }

  &.green {
    background: linear-gradient(135deg, $success-100, #D4E6D4);
  }

  &.blue {
    background: linear-gradient(135deg, $accent-100, #D6E5EC);
  }

  &.red {
    background: linear-gradient(135deg, $danger-100, #F0D5CF);
  }

  &.gray {
    background: linear-gradient(135deg, #F0F0F0, #E0E0E0);
  }
}

.menu-icon-text {
  font-size: 18px;
}

.menu-info {
  flex: 1;
}

.menu-name {
  @include text-body;
  color: $text-primary;
  display: block;
}

.menu-desc {
  @include text-caption;
  color: $text-secondary;
  margin-top: 2px;
  display: block;
}

.menu-arrow {
  font-weight: 700;
  font-size: 14px;
  color: $text-tertiary;
}
</style>
