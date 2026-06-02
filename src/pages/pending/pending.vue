<template>
  <view class="app">
    <!-- Header -->
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <uni-icons class="back-icon" type="arrow-left" size="20" color="#7A6B5D" />
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
          <uni-icons type="checkmarkempty" size="14" color="#fff" /><text class="pending-btn-text">确认</text>
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

    <!-- 编辑弹窗 -->
    <view class="modal-overlay" v-if="showEditModal" @tap="closeEditModal">
      <view class="modal-card" @tap.stop>
        <text class="modal-title">编辑记录</text>
        <view class="modal-field">
          <text class="modal-label">金额</text>
          <input class="modal-input" v-model="editForm.amount" type="digit" placeholder="0.00" />
        </view>
        <view class="modal-field">
          <text class="modal-label">商户</text>
          <input class="modal-input" v-model="editForm.merchant" placeholder="商户名称" />
        </view>
        <view class="modal-field">
          <text class="modal-label">分类</text>
          <view class="modal-select" @tap="showCategoryModal = true">
            <text>{{ editForm.category || '请选择分类' }}</text>
          </view>
        </view>
        <view class="modal-actions">
          <view class="modal-btn secondary" @tap="closeEditModal">
            <text>取消</text>
          </view>
          <view class="modal-btn primary" @tap="confirmEdit">
            <text>确定</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 分类选择弹窗 -->
    <view class="modal-overlay" v-if="showCategoryModal" @tap="showCategoryModal = false">
      <view class="modal-card category-modal-card" @tap.stop>
        <text class="modal-title">选择分类</text>
        <view class="category-list">
          <view
            class="category-item"
            :class="{ active: editForm.category === cat.name }"
            v-for="cat in categoryStore.getCategoriesByType('expense')"
            :key="cat.id"
            @tap="selectCategory(cat.name)"
          >
            <text class="category-icon">{{ cat.icon }}</text>
            <text class="category-name">{{ cat.name }}</text>
            <text v-if="editForm.category === cat.name" class="category-check">✓</text>
          </view>
        </view>
        <view class="modal-actions">
          <view class="modal-btn secondary" @tap="showCategoryModal = false">
            <text>取消</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { useAccountStore } from '@/stores/account'
import { useCategoryStore } from '@/stores/category'
import { getToday, getCurrentTime } from '@/utils/format'

const transactionStore = useTransactionStore()
const accountStore = useAccountStore()
const categoryStore = useCategoryStore()

/** 分类名称映射到ID */
const CATEGORY_MAP: Record<string, string> = {
  '餐饮美食': 'cat-food',
  '交通出行': 'cat-transport',
  '居住': 'cat-housing',
  '购物消费': 'cat-shopping',
  '娱乐': 'cat-entertainment',
  '通讯': 'cat-communication',
  '医疗': 'cat-medical',
  '学习': 'cat-education',
  '人情': 'cat-gift',
  '宠物': 'cat-pet',
}

/** 返回上一页 */
function goBack() {
  uni.navigateBack()
}

/** 解析金额字符串为分 */
function parseAmount(amountStr: string): number {
  const num = parseFloat(amountStr.replace(/[¥,+\s]/g, ''))
  return Math.round(num * 100)
}

/** 确认记录 — 创建真实交易 */
function onConfirm(id: number) {
  const item = pendingItems.find(i => i.id === id)
  if (!item) return

  const amount = parseAmount(item.amount)
  const categoryId = CATEGORY_MAP[item.category] || 'cat-other-expense'
  const defaultAccount = accountStore.accounts[0]
  if (!defaultAccount) {
    uni.showToast({ title: '请先添加账户', icon: 'none' })
    return
  }

  transactionStore.addTransaction({
    type: 'expense',
    amount,
    categoryId,
    accountId: defaultAccount.id,
    note: item.merchant,
    date: getToday(),
    time: getCurrentTime(),
  })
  accountStore.updateBalance(defaultAccount.id, -amount)

  pendingItems.splice(pendingItems.findIndex(i => i.id === id), 1)
  uni.showToast({ title: '已入账', icon: 'success' })
}

/** 编辑记录 */
const showEditModal = ref(false)
const showCategoryModal = ref(false)
const editingItem = ref<any>(null)
const editForm = ref({ amount: '', merchant: '', category: '' })

function onEdit(id: number) {
  const item = pendingItems.find(i => i.id === id)
  if (!item) return
  editingItem.value = item
  editForm.value = {
    amount: item.amount.replace(/[¥,-\s]/g, ''),
    merchant: item.merchant,
    category: item.category,
  }
  showEditModal.value = true
}

function confirmEdit() {
  if (!editingItem.value) return
  const amountNum = parseFloat(editForm.value.amount)
  if (isNaN(amountNum) || amountNum <= 0) {
    uni.showToast({ title: '请输入有效金额', icon: 'none' })
    return
  }
  editingItem.value.amount = `-¥${amountNum.toFixed(2)}`
  editingItem.value.merchant = editForm.value.merchant
  editingItem.value.category = editForm.value.category
  showEditModal.value = false
  editingItem.value = null
}

function selectCategory(name: string) {
  editForm.value.category = name
  showCategoryModal.value = false
}

function closeEditModal() {
  showEditModal.value = false
  showCategoryModal.value = false
  editingItem.value = null
}

/** 忽略记录 */
function onIgnore(id: number) {
  uni.showModal({
    title: '忽略记录',
    content: '确定忽略这条记录吗？',
    confirmColor: '#C06C5F',
    success: (res) => {
      if (res.confirm) {
        pendingItems.splice(pendingItems.findIndex(item => item.id === id), 1)
      }
    },
  })
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

/* ===== Modal ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-card {
  width: 100%;
  max-width: 430px;
  background: $surface;
  border-radius: $radius-lg $radius-lg 0 0;
  padding: 24px;
  padding-bottom: 40px;
  animation: slideUp 0.25s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-title {
  @include text-h2;
  display: block;
  margin-bottom: 20px;
  text-align: center;
}

.modal-field {
  margin-bottom: 16px;
}

.modal-label {
  @include text-caption;
  color: $text-secondary;
  display: block;
  margin-bottom: 6px;
}

.modal-input {
  width: 100%;
  height: 48px;
  background: $bg-primary;
  border-radius: $radius-sm;
  padding: 0 14px;
  border: 1px solid $border;
  @include text-body;
  color: $text-primary;
  box-sizing: border-box;

  &::placeholder {
    color: $text-placeholder;
  }
}

.modal-select {
  width: 100%;
  height: 48px;
  background: $bg-primary;
  border-radius: $radius-sm;
  padding: 0 14px;
  border: 1px solid $border;
  display: flex;
  align-items: center;
  @include text-body;
  color: $text-primary;
  box-sizing: border-box;
  cursor: pointer;
}

.category-modal-card {
  max-height: 70vh;
  overflow-y: auto;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: $radius-sm;
  background: $bg-primary;
  cursor: pointer;
  transition: background 0.2s;

  &:active,
  &.active {
    background: $brand-50;
    border: 1px solid $brand-200;
  }
}

.category-icon {
  font-size: 20px;
}

.category-name {
  flex: 1;
  @include text-body;
}

.category-check {
  color: $brand-500;
  font-weight: 700;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-btn {
  flex: 1;
  padding: 14px;
  border-radius: $radius-sm;
  text-align: center;
  cursor: pointer;

  &.primary {
    background: $gradient-brand;
    box-shadow: $shadow-brand;
    color: white;
    font-weight: 700;
  }

  &.secondary {
    background: $bg-primary;
    border: 1px solid $border;
    color: $text-secondary;
    font-weight: 700;
  }
}
</style>
