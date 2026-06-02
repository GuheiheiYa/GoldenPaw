<template>
  <view class="app">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <uni-icons class="back-icon" type="arrow-left" size="20" color="#7A6B5D" />
      </view>
      <view class="search-box">
        <uni-icons class="search-icon" type="search" size="16" color="#999" />
        <input class="search-input" v-model="keyword" placeholder="搜索交易记录" focus />
      </view>
    </view>

    <view class="content">
      <!-- 搜索结果 -->
      <view v-if="keyword && results.length > 0" class="result-list">
        <view class="result-item" v-for="tx in results" :key="tx.id" @tap="goToDetail(tx.id)">
          <view class="result-icon" :style="{ background: getIconBg(tx.categoryId) }">
            <text class="result-icon-emoji">{{ getIcon(tx.categoryId) }}</text>
          </view>
          <view class="result-body">
            <text class="result-title">{{ tx.note || getCatName(tx.categoryId) }}</text>
            <text class="result-meta">{{ tx.date }} · {{ getCatName(tx.categoryId) }}</text>
          </view>
          <text class="result-amount" :class="tx.type === 'income' ? 'in' : 'out'">
            {{ tx.type === 'income' ? '+' : '-' }}{{ formatAmount(tx.amount) }}
          </text>
        </view>
      </view>

      <!-- 无结果 -->
      <view v-else-if="keyword && results.length === 0" class="empty">
        <uni-icons class="empty-icon" type="search" size="48" color="#C8B8A8" />
        <text class="empty-title">未找到相关记录</text>
        <text class="empty-desc">试试其他关键词</text>
      </view>

      <!-- 搜索提示 -->
      <view v-else class="tips">
        <text class="tips-title">搜索提示</text>
        <text class="tips-item">• 输入交易备注关键词</text>
        <text class="tips-item">• 输入分类名称如"餐饮"</text>
        <text class="tips-item">• 输入金额如"100"</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import { formatAmount } from '@/utils/format'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

const keyword = ref('')

const results = computed(() => {
  if (!keyword.value) return []
  const kw = keyword.value.toLowerCase()
  return transactionStore.transactions.filter(tx => {
    const cat = categoryStore.getCategoryById(tx.categoryId)
    const catName = cat?.name || ''
    const note = tx.note || ''
    const amountYuan = String(tx.amount / 100)
    const amountCents = String(tx.amount)
    const amountFormatted = (tx.amount / 100).toFixed(2)
    const tagsMatch = (tx.tags || []).some(t => t.toLowerCase().includes(kw))
    return note.toLowerCase().includes(kw) ||
           catName.toLowerCase().includes(kw) ||
           amountYuan.includes(kw) ||
           amountCents.includes(kw) ||
           amountFormatted.includes(kw) ||
           tagsMatch
  })
})

function getIcon(catId: string) {
  return categoryStore.getCategoryById(catId)?.icon || '💰'
}

function getCatName(catId: string) {
  return categoryStore.getCategoryById(catId)?.name || '其他'
}

function getIconBg(catId: string) {
  const bgMap: Record<string, string> = {
    'cat-food': 'linear-gradient(135deg, #FAF0E6, #F5E6D3)',
    'cat-transport': 'linear-gradient(135deg, #E8F0E8, #D4E6D4)',
    'cat-housing': 'linear-gradient(135deg, #E8F1F5, #D6E5EC)',
    'cat-shopping': 'linear-gradient(135deg, #F5E0DC, #F0D5CF)',
  }
  return bgMap[catId] || 'linear-gradient(135deg, #F0F0F0, #E8E8E8)'
}

function goBack() {
  uni.navigateBack()
}

function goToDetail(id: string) {
  uni.navigateTo({ url: `/pages/detail/detail?highlight=${id}` })
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
  padding: 48px 16px 16px;
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

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background: $surface;
  border-radius: $radius-full;
  padding: 8px 16px;
  border: 1px solid $border;
}

.search-icon {
  font-size: 16px;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  font-size: 15px;
}

.content {
  padding: $space-4 $space-6;
}

.result-list {
  background: $surface;
  border-radius: $radius-lg;
  border: 1px solid $border;
  overflow: hidden;
}

.result-item {
  display: flex;
  align-items: center;
  padding: $space-3 $space-4;
  border-bottom: 1px solid $border-light;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: $brand-50;
  }
}

.result-icon {
  width: 40px;
  height: 40px;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $space-3;
}

.result-icon-emoji {
  font-size: 18px;
}

.result-body {
  flex: 1;
}

.result-title {
  @include text-body;
  display: block;
}

.result-meta {
  @include text-small;
  color: $text-secondary;
  display: block;
}

.result-amount {
  @include text-h3;
  font-variant-numeric: tabular-nums;

  &.out { color: $text-primary; }
  &.in { color: $success-500; }
}

.empty, .tips {
  text-align: center;
  padding: $space-10 0;
}

.empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: $space-4;
}

.empty-title {
  @include text-h3;
  display: block;
  margin-bottom: $space-2;
}

.empty-desc {
  @include text-caption;
  color: $text-secondary;
}

.tips-title {
  @include text-h3;
  display: block;
  margin-bottom: $space-4;
}

.tips-item {
  @include text-body;
  color: $text-secondary;
  display: block;
  margin-bottom: $space-2;
}
</style>
