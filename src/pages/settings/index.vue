<template>
  <view class="app">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">{{ pageTitle }}</text>
    </view>

    <view class="content">
      <!-- 分类管理 -->
      <template v-if="type === 'category'">
        <view class="section-title">支出分类</view>
        <view class="setting-list">
          <view class="setting-item" v-for="cat in expenseCategories" :key="cat.id">
            <text class="setting-icon">{{ cat.icon }}</text>
            <text class="setting-name">{{ cat.name }}</text>
          </view>
        </view>
        <view class="section-title">收入分类</view>
        <view class="setting-list">
          <view class="setting-item" v-for="cat in incomeCategories" :key="cat.id">
            <text class="setting-icon">{{ cat.icon }}</text>
            <text class="setting-name">{{ cat.name }}</text>
          </view>
        </view>
      </template>

      <!-- 账户管理 -->
      <template v-else-if="type === 'account'">
        <view class="setting-list">
          <view class="setting-item" v-for="acc in accounts" :key="acc.id">
            <text class="setting-icon">{{ acc.icon }}</text>
            <view class="setting-info">
              <text class="setting-name">{{ acc.name }}</text>
              <text class="setting-desc">{{ acc.bank || acc.type }}</text>
            </view>
            <text class="setting-value">{{ formatAmount(acc.balance) }}</text>
          </view>
        </view>
        <view class="add-btn" @tap="showToast('添加账户功能开发中')">
          <text class="add-btn-text">+ 添加账户</text>
        </view>
      </template>

      <!-- 主题设置 -->
      <template v-else-if="type === 'theme'">
        <view class="setting-list">
          <view class="setting-item" v-for="theme in themes" :key="theme.id" @tap="showToast('主题切换功能开发中')">
            <view class="theme-preview" :style="{ background: theme.color }"></view>
            <text class="setting-name">{{ theme.name }}</text>
            <text v-if="theme.id === 'warm'" class="setting-badge">当前</text>
          </view>
        </view>
      </template>

      <!-- 提醒设置 -->
      <template v-else-if="type === 'reminder'">
        <view class="setting-list">
          <view class="setting-item">
            <view class="setting-info">
              <text class="setting-name">记账提醒</text>
              <text class="setting-desc">每天提醒您记账</text>
            </view>
            <view class="toggle" :class="{ on: reminderEnabled }" @tap="reminderEnabled = !reminderEnabled">
              <view class="toggle-knob"></view>
            </view>
          </view>
          <view class="setting-item">
            <view class="setting-info">
              <text class="setting-name">预算预警</text>
              <text class="setting-desc">预算使用超过80%时提醒</text>
            </view>
            <view class="toggle" :class="{ on: budgetAlertEnabled }" @tap="budgetAlertEnabled = !budgetAlertEnabled">
              <view class="toggle-knob"></view>
            </view>
          </view>
        </view>
      </template>

      <!-- 安全设置 -->
      <template v-else-if="type === 'security'">
        <view class="setting-list">
          <view class="setting-item" @tap="showToast('密码锁功能开发中')">
            <text class="setting-icon">🔒</text>
            <view class="setting-info">
              <text class="setting-name">密码锁</text>
              <text class="setting-desc">设置应用密码</text>
            </view>
            <text class="setting-arrow">›</text>
          </view>
          <view class="setting-item" @tap="showToast('指纹解锁功能开发中')">
            <text class="setting-icon">👆</text>
            <view class="setting-info">
              <text class="setting-name">指纹解锁</text>
              <text class="setting-desc">使用指纹快速解锁</text>
            </view>
            <text class="setting-arrow">›</text>
          </view>
        </view>
      </template>

      <!-- 币种设置 -->
      <template v-else-if="type === 'currency'">
        <view class="setting-list">
          <view class="setting-item" v-for="c in currencies" :key="c.code" @tap="showToast('币种切换功能开发中')">
            <text class="setting-icon">{{ c.icon }}</text>
            <view class="setting-info">
              <text class="setting-name">{{ c.name }}</text>
              <text class="setting-desc">{{ c.code }}</text>
            </view>
            <text v-if="c.code === 'CNY'" class="setting-badge">当前</text>
          </view>
        </view>
      </template>

      <!-- 记账周期 -->
      <template v-else-if="type === 'cycle'">
        <view class="setting-list">
          <view class="setting-item" v-for="c in cycles" :key="c.id" @tap="showToast('周期设置功能开发中')">
            <text class="setting-name">{{ c.name }}</text>
            <text v-if="c.id === 'natural'" class="setting-badge">当前</text>
          </view>
        </view>
      </template>

      <!-- 数据导出 -->
      <template v-else-if="type === 'export'">
        <view class="setting-list">
          <view class="setting-item" @tap="showToast('CSV导出功能开发中')">
            <text class="setting-icon">📄</text>
            <view class="setting-info">
              <text class="setting-name">导出为 CSV</text>
              <text class="setting-desc">通用格式，可用 Excel 打开</text>
            </view>
            <text class="setting-arrow">›</text>
          </view>
          <view class="setting-item" @tap="showToast('Excel导出功能开发中')">
            <text class="setting-icon">📊</text>
            <view class="setting-info">
              <text class="setting-name">导出为 Excel</text>
              <text class="setting-desc">包含图表和统计</text>
            </view>
            <text class="setting-arrow">›</text>
          </view>
        </view>
      </template>

      <!-- 数据导入 -->
      <template v-else-if="type === 'import'">
        <view class="setting-list">
          <view class="setting-item" @tap="showToast('微信账单导入开发中')">
            <text class="setting-icon">💬</text>
            <view class="setting-info">
              <text class="setting-name">导入微信账单</text>
              <text class="setting-desc">从微信导出的账单文件</text>
            </view>
            <text class="setting-arrow">›</text>
          </view>
          <view class="setting-item" @tap="showToast('支付宝账单导入开发中')">
            <text class="setting-icon">💰</text>
            <view class="setting-info">
              <text class="setting-name">导入支付宝账单</text>
              <text class="setting-desc">从支付宝导出的账单文件</text>
            </view>
            <text class="setting-arrow">›</text>
          </view>
        </view>
      </template>

      <!-- 云同步 -->
      <template v-else-if="type === 'sync'">
        <view class="sync-status">
          <text class="sync-icon">☁️</text>
          <text class="sync-title">云同步</text>
          <text class="sync-desc">上次同步：从未同步</text>
          <view class="sync-btn" @tap="showToast('云同步功能开发中')">
            <text class="sync-btn-text">立即同步</text>
          </view>
        </view>
      </template>

      <!-- 清空数据 -->
      <template v-else-if="type === 'clear'">
        <view class="warning-box">
          <text class="warning-icon">⚠️</text>
          <text class="warning-title">警告</text>
          <text class="warning-desc">此操作将永久删除所有交易记录、账户信息和设置，且无法恢复。请谨慎操作。</text>
        </view>
        <view class="danger-btn" @tap="onClearData">
          <text class="danger-btn-text">清空所有数据</text>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useCategoryStore } from '@/stores/category'
import { useAccountStore } from '@/stores/account'
import { useTransactionStore } from '@/stores/transaction'
import { formatAmount } from '@/utils/format'

const categoryStore = useCategoryStore()
const accountStore = useAccountStore()
const transactionStore = useTransactionStore()

const type = ref('')

onLoad((options) => {
  type.value = options?.type || ''
})

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    category: '分类管理',
    account: '账户管理',
    theme: '主题颜色',
    reminder: '提醒设置',
    security: '密码/指纹锁',
    currency: '币种设置',
    cycle: '记账周期',
    export: '导出数据',
    import: '导入数据',
    sync: '云同步',
    clear: '清空数据',
  }
  return titles[type.value] || '设置'
})

const expenseCategories = computed(() => categoryStore.getCategoriesByType('expense'))
const incomeCategories = computed(() => categoryStore.getCategoriesByType('income'))
const accounts = computed(() => accountStore.accounts)

const reminderEnabled = ref(true)
const budgetAlertEnabled = ref(true)

const themes = [
  { id: 'warm', name: '暖金色', color: 'linear-gradient(135deg, #C8956C, #A67B5B)' },
  { id: 'blue', name: '海蓝色', color: 'linear-gradient(135deg, #7A9EAF, #6A8C9C)' },
  { id: 'green', name: '森林绿', color: 'linear-gradient(135deg, #6B8E6B, #5A7A5A)' },
  { id: 'pink', name: '樱花粉', color: 'linear-gradient(135deg, #E8A0BF, #D68BB2)' },
]

const currencies = [
  { code: 'CNY', name: '人民币', icon: '🇨🇳' },
  { code: 'USD', name: '美元', icon: '🇺🇸' },
  { code: 'EUR', name: '欧元', icon: '🇪🇺' },
  { code: 'JPY', name: '日元', icon: '🇯🇵' },
]

const cycles = [
  { id: 'natural', name: '自然月（1日-月末）' },
  { id: 'salary', name: '工资周期（25日-24日）' },
  { id: 'custom', name: '自定义周期' },
]

function goBack() {
  uni.navigateBack()
}

function showToast(msg: string) {
  uni.showToast({ title: msg, icon: 'none' })
}

function onClearData() {
  uni.showModal({
    title: '确认清空',
    content: '此操作将永久删除所有数据，确定要继续吗？',
    confirmColor: '#C06C5F',
    success: (res) => {
      if (res.confirm) {
        // 清空数据
        transactionStore.transactions.splice(0)
        uni.showToast({ title: '数据已清空', icon: 'success' })
        setTimeout(() => goBack(), 1500)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@use '../../styles/design-system' as *;
@use '../../styles/mixins' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
}

.header {
  padding: 48px 24px 20px;
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
}

.content {
  padding: 0 $space-6 $space-8;
}

.section-title {
  @include text-caption;
  color: $text-tertiary;
  padding: $space-4 0 $space-2;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.setting-list {
  background: $surface;
  border-radius: $radius-lg;
  border: 1px solid $border;
  overflow: hidden;
  margin-bottom: $space-4;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: $space-4 $space-5;
  border-bottom: 1px solid $border-light;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: $brand-50;
  }
}

.setting-icon {
  font-size: 24px;
  margin-right: $space-3;
}

.setting-info {
  flex: 1;
}

.setting-name {
  @include text-body;
  display: block;
}

.setting-desc {
  @include text-small;
  color: $text-secondary;
  display: block;
  margin-top: 2px;
}

.setting-value {
  @include text-body;
  color: $text-secondary;
}

.setting-arrow {
  font-size: 20px;
  color: $text-tertiary;
}

.setting-badge {
  @include text-micro;
  background: $gradient-brand;
  color: white;
  padding: 2px 8px;
  border-radius: $radius-full;
}

/* Toggle */
.toggle {
  width: 48px;
  height: 28px;
  border-radius: 14px;
  background: $border;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;

  &.on {
    background: $success-500;
  }
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  box-shadow: $shadow-sm;
  transition: transform 0.2s;

  .on & {
    transform: translateX(20px);
  }
}

/* Theme Preview */
.theme-preview {
  width: 40px;
  height: 40px;
  border-radius: $radius-sm;
  margin-right: $space-3;
}

/* Add Button */
.add-btn {
  margin: $space-4 0;
  padding: $space-4;
  border: 2px dashed $border;
  border-radius: $radius-lg;
  text-align: center;
  cursor: pointer;

  &:active {
    border-color: $brand-500;
    background: $brand-50;
  }
}

.add-btn-text {
  @include text-body;
  color: $brand-600;
}

/* Sync Status */
.sync-status {
  text-align: center;
  padding: $space-10 0;
}

.sync-icon {
  font-size: 64px;
  display: block;
  margin-bottom: $space-4;
}

.sync-title {
  @include text-h2;
  display: block;
  margin-bottom: $space-2;
}

.sync-desc {
  @include text-caption;
  color: $text-secondary;
  display: block;
  margin-bottom: $space-6;
}

.sync-btn {
  display: inline-block;
  padding: $space-3 $space-8;
  background: $gradient-brand;
  border-radius: $radius-full;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
}

.sync-btn-text {
  color: white;
  font-weight: 700;
}

/* Warning Box */
.warning-box {
  background: $danger-50;
  border: 1px solid $danger-100;
  border-radius: $radius-lg;
  padding: $space-5;
  margin-bottom: $space-6;
  text-align: center;
}

.warning-icon {
  font-size: 48px;
  display: block;
  margin-bottom: $space-3;
}

.warning-title {
  @include text-h3;
  color: $danger-500;
  display: block;
  margin-bottom: $space-2;
}

.warning-desc {
  @include text-caption;
  color: $text-secondary;
  display: block;
}

.danger-btn {
  padding: $space-4;
  background: $danger-500;
  border-radius: $radius-lg;
  text-align: center;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
}

.danger-btn-text {
  color: white;
  font-weight: 700;
}
</style>
