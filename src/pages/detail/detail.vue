<template>
  <view class="app">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <uni-icons class="back-icon" type="arrow-left" size="20" color="#7A6B5D" />
      </view>
      <text class="header-title">明细</text>
      <view class="header-actions">
        <view class="icon-btn" @tap="openDatePicker">
          <uni-icons class="icon-text" type="search" size="18" color="#999" />
        </view>
      </view>
    </view>

    <!-- 筛选标签栏 -->
    <view class="filter-bar">
      <SegmentedControl v-model="activeFilter" :options="filterOptions" />
    </view>

    <!-- 日期筛选状态 -->
    <view v-if="filterDateLabel" class="filter-status-bar">
      <view class="filter-status-tag">
        <text class="filter-status-text">📅 {{ filterDateLabel }}</text>
        <uni-icons class="filter-status-clear" type="closeempty" size="14" color="#999" @tap="filterDate = ''" />
      </view>
    </view>

    <!-- 日期分组列表 -->
    <view class="day-group" v-for="group in filteredGroups" :key="group.date">
      <view class="day-header">
        <text class="day-name">{{ formatDayHeader(group.date) }}</text>
        <text class="day-total">{{ formatDaySummary(group) }}</text>
      </view>
      <view class="tx-list">
        <view
          class="tx-item-wrap"
          v-for="tx in group.transactions"
          :key="tx.id"
        >
          <view class="tx-item-actions" v-if="swipedId === tx.id">
            <view class="tx-action-btn delete" @tap.stop="onDeleteTap(tx)">
              <text>删除</text>
            </view>
          </view>
          <view
            class="tx-item"
            :class="{ highlight: tx.id === highlightId, swiped: swipedId === tx.id }"
            @tap="onItemTap(tx)"
            @longpress="onLongPressTransaction(tx)"
            @touchstart="onTouchStart($event, tx)"
            @touchmove="onTouchMove($event, tx)"
            @touchend="onTouchEnd($event, tx)"
          >
            <view class="tx-icon" :style="{ background: getIconBg(tx.categoryId) }">
              <text class="tx-icon-emoji">{{ getIcon(tx.categoryId) }}</text>
            </view>
            <view class="tx-body">
              <text class="tx-title">{{ tx.note || getCatName(tx.categoryId) }}</text>
              <text class="tx-meta">
                {{ tx.time }} · {{ getCatName(tx.categoryId) }}
              </text>
              <view v-if="tx.tags && tx.tags.length > 0" class="tx-tags">
                <text class="tx-tag" v-for="t in tx.tags" :key="t">{{ t }}</text>
              </view>
            </view>
            <view class="tx-right">
              <text
                class="tx-amount"
                :class="tx.type === 'income' ? 'tx-amount-in' : 'tx-amount-out'"
              >
                {{ formatAmountText(tx) }}
              </text>
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

    <!-- 记账/编辑面板 -->
    <RecordSheet />

    <!-- 日期选择弹窗 -->
    <view class="date-picker-overlay" v-if="showDatePicker" @tap="showDatePicker = false">
      <view class="date-picker-card" @tap.stop>
        <text class="date-picker-title">选择日期范围</text>

        <!-- 快捷标签 -->
        <view class="date-quick-tags">
          <view
            class="date-quick-tag"
            v-for="tag in quickDateTags"
            :key="tag.label"
            :class="{ active: activeQuickTag === tag.label }"
            @tap="selectQuickTag(tag)"
          >
            <text>{{ tag.label }}</text>
          </view>
        </view>

        <!-- 日期范围 -->
        <view class="date-range-row">
          <view class="date-range-item">
            <text class="date-range-label">开始日期</text>
            <picker mode="date" :value="pickerStartDate" @change="onStartDateChange">
              <view class="date-range-display">{{ pickerStartDate }}</view>
            </picker>
          </view>
          <text class="date-range-sep">~</text>
          <view class="date-range-item">
            <text class="date-range-label">结束日期</text>
            <picker mode="date" :value="pickerEndDate" @change="onEndDateChange">
              <view class="date-range-display">{{ pickerEndDate }}</view>
            </picker>
          </view>
        </view>

        <view class="date-picker-actions">
          <view class="date-picker-btn secondary" @tap="clearDateFilter">
            <text>清空筛选</text>
          </view>
          <view class="date-picker-btn primary" @tap="confirmDateRange">
            <text>确定</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import { useAccountStore } from '@/stores/account'
import { useAppStore } from '@/stores/app'
import { formatAmount, formatDate, getToday } from '@/utils/format'
import SegmentedControl from '@/components/SegmentedControl.vue'
import RecordSheet from '@/components/RecordSheet.vue'
import type { Transaction } from '@/types/transaction'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()
const appStore = useAppStore()

/** URL 参数中的日期筛选（单日期或 start,end 范围） */
const filterDate = ref('')
/** 日期选择弹窗显示 */
const showDatePicker = ref(false)
/** 开始日期 */
const pickerStartDate = ref(getToday())
/** 结束日期 */
const pickerEndDate = ref(getToday())
/** 当前选中的快捷标签 */
const activeQuickTag = ref('')
/** 高亮交易ID */
const highlightId = ref('')
/** 当前左滑展开的交易ID */
const swipedId = ref('')
/** 触摸起始X坐标 */
let touchStartX = 0
/** 是否已触发滑动删除 */
let hasSwipedDelete = false

/** 处理点击（如果已左滑则先复位） */
function onItemTap(tx: Transaction) {
  if (swipedId.value && swipedId.value !== tx.id) {
    swipedId.value = ''
    return
  }
  if (swipedId.value === tx.id) {
    swipedId.value = ''
    return
  }
  onTapTransaction(tx)
}

/** 触摸开始 */
function onTouchStart(e: any, tx: Transaction) {
  touchStartX = e.touches[0].clientX
  hasSwipedDelete = false
}

/** 触摸移动 */
function onTouchMove(e: any, tx: Transaction) {
  const deltaX = e.touches[0].clientX - touchStartX
  if (deltaX < -40) {
    swipedId.value = tx.id
  } else if (deltaX > 40 && swipedId.value === tx.id) {
    swipedId.value = ''
  }
  if (deltaX < -60 && !hasSwipedDelete) {
    hasSwipedDelete = true
    // #ifdef APP-PLUS
    uni.vibrateShort({})
    // #endif
  }
}

/** 触摸结束 — 向左滑动超过阈值直接弹删除确认 */
function onTouchEnd(e: any, tx: Transaction) {
  if (hasSwipedDelete) {
    hasSwipedDelete = false
    // 延迟复位，让用户看到删除按钮动画
    setTimeout(() => { swipedId.value = '' }, 200)
    onDeleteTap(tx)
  }
}

/** 页面加载时获取参数 */
onLoad((options) => {
  swipedId.value = ''
  if (options?.date) {
    filterDate.value = options.date
  }
  if (options?.highlight) {
    highlightId.value = options.highlight
    // 3秒后清除高亮
    setTimeout(() => { highlightId.value = '' }, 3000)
  }
})

/** 当前筛选类型 */
const activeFilter = ref('all')

/** 筛选选项 */
const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '支出', value: 'expense' },
  { label: '收入', value: 'income' },
  { label: '转账', value: 'transfer' },
]

/** 日期分组数据结构 */
interface DayGroup {
  date: string
  transactions: Transaction[]
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

/** 按日分组并排序的交易列表 */
const filteredGroups = computed<DayGroup[]>(() => {
  // 根据筛选条件过滤
  let txs = activeFilter.value === 'all'
    ? [...transactionStore.transactions]
    : transactionStore.transactions.filter(t => t.type === activeFilter.value)

  // 如果有日期范围筛选
  if (filterDate.value) {
    if (filterDate.value.includes(',')) {
      const [start, end] = filterDate.value.split(',')
      txs = txs.filter(t => t.date >= start && t.date <= end)
    } else {
      txs = txs.filter(t => t.date === filterDate.value)
    }
  }

  // 按日期和时间降序排列
  const sorted = [...txs].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date)
    return b.time.localeCompare(a.time)
  })

  // 按日期分组
  const groupMap = new Map<string, Transaction[]>()
  for (const tx of sorted) {
    if (!groupMap.has(tx.date)) {
      groupMap.set(tx.date, [])
    }
    groupMap.get(tx.date)!.push(tx)
  }

  return Array.from(groupMap.entries()).map(([date, transactions]) => ({
    date,
    transactions,
  }))
})

/** 格式化日期标题（如 "05月29日 周四"） */
function formatDayHeader(dateStr: string): string {
  const d = new Date(dateStr)
  const today = getToday()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (dateStr === today) return '今天'
  if (dateStr === yesterday.toISOString().slice(0, 10)) return '昨天'
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  const weekday = WEEKDAYS[d.getDay()]
  return `${month}月${day}日 ${weekday}`
}

/** 格式化日汇总文本 */
function formatDaySummary(group: DayGroup): string {
  const expenseTotal = group.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const incomeTotal = group.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const parts: string[] = []
  if (expenseTotal > 0) parts.push(`支出 ${formatAmount(expenseTotal)}`)
  if (incomeTotal > 0) parts.push(`收入 ${formatAmount(incomeTotal, true)}`)
  return parts.join(' · ') || '暂无数据'
}

/** 打开日期范围选择弹窗 */
function openDatePicker() {
  const today = getToday()
  if (filterDate.value) {
    if (filterDate.value.includes(',')) {
      const [start, end] = filterDate.value.split(',')
      pickerStartDate.value = start
      pickerEndDate.value = end
    } else {
      pickerStartDate.value = filterDate.value
      pickerEndDate.value = filterDate.value
    }
  } else {
    pickerStartDate.value = today
    pickerEndDate.value = today
  }
  activeQuickTag.value = ''
  showDatePicker.value = true
}

/** 快捷日期标签 */
interface QuickTag {
  label: string
  getValue: () => string
}
const quickDateTags: QuickTag[] = [
  {
    label: '今天',
    getValue: () => {
      const t = getToday()
      return `${t},${t}`
    },
  },
  {
    label: '昨天',
    getValue: () => {
      const t = getToday()
      const d = new Date(t)
      d.setDate(d.getDate() - 1)
      const y = d.toISOString().slice(0, 10)
      return `${y},${y}`
    },
  },
  {
    label: '近7天',
    getValue: () => {
      const t = getToday()
      const d = new Date(t)
      d.setDate(d.getDate() - 6)
      return `${d.toISOString().slice(0, 10)},${t}`
    },
  },
  {
    label: '近30天',
    getValue: () => {
      const t = getToday()
      const d = new Date(t)
      d.setDate(d.getDate() - 29)
      return `${d.toISOString().slice(0, 10)},${t}`
    },
  },
  {
    label: '本月',
    getValue: () => {
      const t = getToday()
      return `${t.slice(0, 7)}-01,${t}`
    },
  },
]

/** 选择快捷标签 */
function selectQuickTag(tag: QuickTag) {
  activeQuickTag.value = tag.label
  const range = tag.getValue()
  const [start, end] = range.split(',')
  pickerStartDate.value = start
  pickerEndDate.value = end
}

/** 清空日期筛选 */
function clearDateFilter() {
  filterDate.value = ''
  activeQuickTag.value = ''
  showDatePicker.value = false
}

/** 当前日期筛选标签 */
const filterDateLabel = computed(() => {
  if (!filterDate.value) return ''
  const today = getToday()
  if (filterDate.value === today) return '今天'
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (filterDate.value === yesterday.toISOString().slice(0, 10)) return '昨天'
  if (filterDate.value.includes(',')) {
    const [start, end] = filterDate.value.split(',')
    if (end === today) {
      const days = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
      return `近${days + 1}天`
    }
    return `${start} 至 ${end}`
  }
  if (filterDate.value.length === 7) {
    return `${filterDate.value}月`
  }
  const parts = filterDate.value.split('-')
  if (parts.length === 3) {
    return `${parseInt(parts[1])}月${parseInt(parts[2])}日`
  }
  return filterDate.value
})

/** 开始日期变更 */
function onStartDateChange(e: any) {
  if (e.detail?.value) {
    pickerStartDate.value = e.detail.value
    activeQuickTag.value = ''
  }
}

/** 结束日期变更 */
function onEndDateChange(e: any) {
  if (e.detail?.value) {
    pickerEndDate.value = e.detail.value
    activeQuickTag.value = ''
  }
}

/** 确认日期范围 */
function confirmDateRange() {
  if (pickerStartDate.value === pickerEndDate.value) {
    filterDate.value = pickerStartDate.value
  } else {
    filterDate.value = `${pickerStartDate.value},${pickerEndDate.value}`
  }
  showDatePicker.value = false
}

/** 点击删除按钮 */
function onDeleteTap(tx: Transaction) {
  uni.showModal({
    title: '删除交易',
    content: `确认删除「${tx.note || getCatName(tx.categoryId)} ${formatAmountText(tx)}」？`,
    confirmColor: '#C06C5F',
    success: (res) => {
      if (res.confirm) {
        const delta = tx.type === 'expense' ? tx.amount : -tx.amount
        accountStore.updateBalance(tx.accountId, delta)
        transactionStore.deleteTransaction(tx.id)
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    },
  })
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
 * 点击交易项 — 打开编辑面板
 * @param tx 交易记录
 */
function onTapTransaction(tx: Transaction) {
  appStore.openEditRecordSheet(tx.id)
}

/**
 * 长按交易项 — 弹出删除确认
 * @param tx 交易记录
 */
function onLongPressTransaction(tx: Transaction) {
  uni.showModal({
    title: '删除交易',
    content: `确认删除「${tx.note || getCatName(tx.categoryId)} ${formatAmountText(tx)}」？`,
    confirmColor: '#C06C5F',
    success: (res) => {
      if (res.confirm) {
        // 回滚余额影响：支出删除→余额增加，收入删除→余额减少
        const delta = tx.type === 'expense' ? tx.amount : -tx.amount
        accountStore.updateBalance(tx.accountId, delta)
        transactionStore.deleteTransaction(tx.id)
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    },
  })
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
  padding: 0 24px 12px;
}

/* 日期筛选状态 */
.filter-status-bar {
  padding: 0 24px 12px;
}

.filter-status-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: $brand-50;
  border: 1px solid $brand-100;
  border-radius: $radius-full;
}

.filter-status-text {
  @include text-small;
  color: $brand-600;
  font-weight: 600;
}

.filter-status-clear {
  font-size: 12px;
  color: $brand-400;
  cursor: pointer;
  padding: 2px;

  &:active {
    color: $danger-500;
  }
}

/* 日期分组 */
.day-group {
  padding: 0 24px;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 8px;
}

.day-name {
  @include text-h3;
}

.day-total {
  @include text-caption;
  color: $text-secondary;
}

/* 交易项 */
.tx-list {
  background: $surface;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  border: 1px solid $border;
  overflow: hidden;
}

.tx-item-wrap {
  position: relative;
  border-bottom: 2px dashed rgba(168, 155, 142, 0.15);

  &:last-child {
    border-bottom: none;
  }
}

.tx-item-actions {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $danger-500;
}

.tx-action-btn {
  @include text-body;
  color: white;
  font-weight: 700;

  &.delete {
    color: white;
  }
}

.tx-item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: $surface;
  transition: transform 0.25s ease;
  cursor: pointer;

  &:active {
    opacity: 0.5;
  }

  &.swiped {
    transform: translateX(-80px);
  }

  &.highlight {
    background: rgba(200, 149, 108, 0.12);
    animation: highlightPulse 1.5s ease;
  }
}

@keyframes highlightPulse {
  0% { background: rgba(200, 149, 108, 0.25); }
  100% { background: rgba(200, 149, 108, 0.12); }
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

.tx-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.tx-tag {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--brand-50, #FAF0E6);
  color: var(--brand-600, #A67B5B);
  font-size: 10px;
  line-height: 1.4;
}

/* 删除按钮 */
.tx-delete {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: $radius-circle;
  background: $danger-50;
  margin-top: 4px;
  cursor: pointer;

  &:active {
    background: $danger-100;
  }
}

.tx-delete-text {
  @include text-micro;
  color: $danger-500;
  font-size: 12px;
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

/* 日期选择弹窗 */
.date-picker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.date-picker-card {
  width: 100%;
  max-width: 430px;
  max-height: 85vh;
  overflow-y: auto;
  background: $surface;
  border-radius: $radius-lg $radius-lg 0 0;
  padding: 24px;
  padding-bottom: 40px;
  animation: slideUp 0.25s ease;
}

.date-picker-title {
  @include text-h2;
  display: block;
  margin-bottom: 20px;
  text-align: center;
}

/* 快捷标签 */
.date-quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.date-quick-tag {
  padding: 6px 14px;
  border-radius: $radius-full;
  background: $bg-primary;
  border: 1px solid $border;
  cursor: pointer;
  @include text-small;
  color: $text-secondary;

  &.active {
    background: $brand-50;
    border-color: $brand-500;
    color: $brand-600;
    font-weight: 600;
  }
}

/* 日期范围 */
.date-range-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 24px;
}

.date-range-item {
  flex: 1;
}

.date-range-label {
  @include text-caption;
  color: $text-secondary;
  display: block;
  margin-bottom: 6px;
}

.date-range-display {
  height: 48px;
  background: $bg-primary;
  border-radius: $radius-sm;
  border: 1px solid $border;
  display: flex;
  align-items: center;
  justify-content: center;
  @include text-body;
  color: $text-primary;
}

.date-range-sep {
  @include text-body;
  color: $text-tertiary;
  padding-bottom: 12px;
}

.date-picker-actions {
  display: flex;
  gap: 12px;
}

.date-picker-btn {
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

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
