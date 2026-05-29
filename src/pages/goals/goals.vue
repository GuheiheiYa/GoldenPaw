<template>
  <view class="app">
    <!-- Header -->
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <uni-icons class="back-icon" type="arrow-left" size="20" color="#7A6B5D" />
      </view>
      <text class="header-title">存钱与预算</text>
      <view class="header-action" @tap="openNewGoal">
        <text class="header-action-text">+ 新建</text>
      </view>
    </view>

    <!-- 分段控制器 -->
    <view class="segmented">
      <view
        class="seg-item"
        :class="{ active: activeTab === 'goals' }"
        @tap="activeTab = 'goals'"
      >
        <text class="seg-item-text">存钱目标</text>
      </view>
      <view
        class="seg-item"
        :class="{ active: activeTab === 'budget' }"
        @tap="activeTab = 'budget'"
      >
        <text class="seg-item-text">预算管理</text>
      </view>
    </view>

    <!-- 存钱目标列表 -->
    <view v-if="activeTab === 'goals'">
      <view
        class="goal-card"
        v-for="(goal, idx) in goalBudgetStore.goals"
        :key="goal.id"
        :style="{ borderColor: goalBorderColor(idx) }"
      >
        <view class="goal-top">
          <view class="goal-icon" :class="'goal-icon-' + ((idx % 3) + 1)">
            <text class="goal-icon-text">{{ goal.icon }}</text>
          </view>
          <view class="goal-info">
            <text class="goal-name">{{ goal.name }}</text>
            <text class="goal-amount">{{ formatAmount(goal.savedAmount) }} / {{ formatAmount(goal.targetAmount) }}</text>
          </view>
          <!-- 环形进度 (SVG) -->
          <view class="goal-ring">
            <svg viewBox="0 0 60 60" class="goal-ring-svg">
              <circle cx="30" cy="30" r="26" fill="none" stroke="#EDE4D8" stroke-width="6" />
              <circle
                cx="30" cy="30" r="26" fill="none"
                :stroke="ringColors[idx % 3]" stroke-width="6"
                :stroke-dasharray="`${ringCircumference * Math.min(goalPct(goal), 100) / 100} ${ringCircumference}`"
                stroke-linecap="round"
                transform="rotate(-90 30 30)"
              />
            </svg>
            <text class="goal-ring-text">{{ goalPct(goal) }}%</text>
          </view>
        </view>

        <!-- 进度条 -->
        <view class="goal-progress">
          <view class="goal-bar-track">
            <view class="goal-bar-fill" :class="'fill-' + ((idx % 3) + 1)" :style="{ width: Math.min(goalPct(goal), 100) + '%' }"></view>
          </view>
        </view>

        <!-- 统计信息 -->
        <view class="goal-stats">
          <view class="goal-stat">
            <text class="goal-stat-label">目标金额</text>
            <text class="goal-stat-value">{{ formatAmount(goal.targetAmount) }}</text>
          </view>
          <view class="goal-stat">
            <text class="goal-stat-label">已存金额</text>
            <text class="goal-stat-value">{{ formatAmount(goal.savedAmount) }}</text>
          </view>
          <view class="goal-stat">
            <text class="goal-stat-label">完成进度</text>
            <text class="goal-stat-value">{{ goalPct(goal) }}%</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="goal-actions">
          <view class="goal-btn primary" @tap="openDeposit(goal)">
            <text class="goal-btn-text">存入金额</text>
          </view>
          <view class="goal-btn secondary" @tap="openAdjust(goal)">
            <text class="goal-btn-text">调整</text>
          </view>
        </view>
      </view>

      <view v-if="goalBudgetStore.goals.length === 0" class="empty-state">
        <text class="empty-text">暂无存钱目标</text>
        <text class="empty-sub">点击右上角 + 新建一个</text>
      </view>
    </view>

    <!-- 预算管理 -->
    <view v-if="activeTab === 'budget'" class="budget-section">
      <!-- 总预算卡片 -->
      <view class="budget-total">
        <view class="budget-total-header">
          <text class="budget-total-label">本月总预算</text>
          <text class="budget-total-value">{{ formatAmount(goalBudgetStore.totalBudget) }}</text>
        </view>
        <view class="budget-total-bar">
          <view
            class="budget-total-fill"
            :style="{ width: totalBudgetPct + '%' }"
          ></view>
        </view>
        <view class="budget-total-stats">
          <text class="budget-stat-text">已用 {{ formatAmount(goalBudgetStore.totalBudgetUsed) }}</text>
          <text class="budget-stat-text">剩余 {{ formatAmount(Math.max(goalBudgetStore.totalBudget - goalBudgetStore.totalBudgetUsed, 0)) }}</text>
        </view>
      </view>

      <!-- 预算明细 -->
      <view class="budget-list">
        <view class="budget-item" v-for="item in enrichedBudgets" :key="item.id">
          <view class="budget-item-icon" :class="item.iconClass">
            <text class="budget-item-icon-text">{{ item.icon }}</text>
          </view>
          <view class="budget-item-info">
            <text class="budget-item-name">{{ item.name }}</text>
            <view class="budget-item-bar">
              <view
                class="budget-item-fill"
                :class="item.fillClass"
                :style="{ width: item.pct + '%' }"
              ></view>
            </view>
          </view>
          <view class="budget-item-right">
            <text class="budget-item-used" :class="{ over: item.over }">{{ formatAmount(item.used) }}</text>
            <text class="budget-item-total">/ {{ formatAmount(item.amount) }}</text>
          </view>
        </view>
      </view>

      <!-- 添加预算按钮 -->
      <view class="add-budget" @tap="openNewBudget">
        <text class="add-budget-icon">+</text>
        <text class="add-budget-text">添加预算</text>
      </view>
    </view>

    <!-- ===== Modal Overlay ===== -->
    <view class="modal-overlay" v-if="showModal" @tap="closeModal">
      <view class="modal-card" @tap.stop>
        <text class="modal-title">{{ modalTitle }}</text>

        <!-- 目标名称 -->
        <view class="modal-field" v-if="modalMode === 'newGoal' || modalMode === 'adjustGoal'">
          <text class="modal-label">名称</text>
          <input class="modal-input" v-model="modalForm.name" placeholder="例如：旅行基金" />
        </view>

        <!-- 图标 -->
        <view class="modal-field" v-if="modalMode === 'newGoal'">
          <text class="modal-label">图标</text>
          <EmojiGrid v-model="modalForm.icon" />
        </view>

        <!-- 金额 -->
        <view class="modal-field" v-if="modalMode !== 'adjustGoal'">
          <text class="modal-label">{{ modalMode === 'deposit' ? '存入金额' : modalMode === 'newBudget' ? '预算金额' : '目标金额' }} (元)</text>
          <input class="modal-input" v-model="modalForm.amount" type="digit" placeholder="0.00" />
        </view>

        <!-- 调整模式：目标金额 + 已存金额 -->
        <view class="modal-field" v-if="modalMode === 'adjustGoal'">
          <text class="modal-label">目标金额 (元)</text>
          <input class="modal-input" v-model="modalForm.amount" type="digit" placeholder="0.00" />
        </view>
        <view class="modal-field" v-if="modalMode === 'adjustGoal'">
          <text class="modal-label">已存金额 (元)</text>
          <input class="modal-input" v-model="modalForm.savedAmount" type="digit" placeholder="0.00" />
        </view>

        <!-- 分类选择（预算） -->
        <view class="modal-field" v-if="modalMode === 'newBudget'">
          <text class="modal-label">分类</text>
          <view v-if="availableBudgetCategories.length === 0" class="budget-empty-hint">
            <text>所有支出分类已设置预算</text>
          </view>
          <view class="modal-options">
            <view
              class="modal-option"
              v-for="cat in budgetCategoryOptions"
              :key="cat.id"
              :class="{ active: !cat.disabled && modalForm.categoryId === cat.id, disabled: cat.disabled }"
              @tap="!cat.disabled && (modalForm.categoryId = cat.id)"
            >
              <text>{{ cat.icon }} {{ cat.name }}</text>
              <text v-if="cat.disabled" class="option-badge">已设预算</text>
            </view>
          </view>
        </view>

        <view class="modal-actions">
          <view class="modal-btn secondary" @tap="closeModal">
            <text>取消</text>
          </view>
          <view class="modal-btn primary" @tap="confirmModal">
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
import { useGoalBudgetStore } from '@/stores/goalBudget'
import { useCategoryStore } from '@/stores/category'
import type { Goal } from '@/stores/goalBudget'
import EmojiGrid from '@/components/EmojiGrid.vue'

const goalBudgetStore = useGoalBudgetStore()
const categoryStore = useCategoryStore()

onLoad((options) => {
  if (options?.tab === 'budget') {
    activeTab.value = 'budget'
  }
})

function goBack() {
  uni.navigateBack()
}

const activeTab = ref<'goals' | 'budget'>('goals')

function formatAmount(cents: number): string {
  return `¥${(cents / 100).toFixed(2)}`
}

function goalPct(goal: Goal): number {
  if (goal.targetAmount <= 0) return 0
  return Math.round((goal.savedAmount / goal.targetAmount) * 100)
}

function goalBorderColor(idx: number): string {
  const colors = ['rgba(200,149,108,0.25)', 'rgba(122,158,175,0.25)', 'rgba(107,142,107,0.25)']
  return colors[idx % colors.length]
}

const ringColors = ['#C8956C', '#7A9EAF', '#6B8E6B']
const ringCircumference = 2 * Math.PI * 26

/* ─── Budget enrichment ─── */
const enrichedBudgets = computed(() => {
  return goalBudgetStore.budgetUsage.map(b => {
    const cat = categoryStore.getCategoryById(b.categoryId)
    return {
      ...b,
      name: cat?.name || '未知',
      icon: cat?.icon || '💰',
      iconClass: getBudgetIconClass(cat?.id || ''),
      fillClass: b.over ? 'fill-danger' : b.pct > 80 ? 'fill-accent' : 'fill-brand',
    }
  })
})

/** 根据分类ID获取预算图标样式类 */
function getBudgetIconClass(categoryId: string): string {
  const typeMap: Record<string, string> = {
    'cat-food': 'food',
    'cat-transport': 'transport',
    'cat-housing': 'housing',
    'cat-shopping': 'shopping',
    'cat-entertainment': 'shopping',
    'cat-communication': 'transport',
    'cat-medical': 'housing',
    'cat-education': 'food',
    'cat-gift': 'shopping',
    'cat-pet': 'food',
    'cat-other-expense': 'transport',
  }
  return typeMap[categoryId] || 'transport'
}

const totalBudgetPct = computed(() => {
  const total = goalBudgetStore.totalBudget
  if (total <= 0) return 0
  return Math.min(Math.round((goalBudgetStore.totalBudgetUsed / total) * 100), 100)
})

const usedBudgetCategoryIds = computed(() => new Set(goalBudgetStore.budgets.map(b => b.categoryId)))

const availableBudgetCategories = computed(() => {
  return categoryStore.expenseCategories.filter(c => !usedBudgetCategoryIds.value.has(c.id))
})

const budgetCategoryOptions = computed(() => {
  return categoryStore.expenseCategories.map(c => ({
    ...c,
    disabled: usedBudgetCategoryIds.value.has(c.id),
  }))
})

/* ─── Modal ─── */
const showModal = ref(false)
type ModalMode = 'newGoal' | 'deposit' | 'adjustGoal' | 'newBudget'
const modalMode = ref<ModalMode>('newGoal')
const modalTitle = ref('')
const editingGoalId = ref('')

const modalForm = ref({
  name: '',
  icon: '✨',
  amount: '',
  savedAmount: '',
  categoryId: '',
})

function resetForm() {
  modalForm.value = { name: '', icon: '✨', amount: '', savedAmount: '', categoryId: '' }
  editingGoalId.value = ''
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function openNewGoal() {
  activeTab.value = 'goals'
  modalMode.value = 'newGoal'
  modalTitle.value = '新建目标'
  resetForm()
  showModal.value = true
}

function openDeposit(goal: Goal) {
  modalMode.value = 'deposit'
  modalTitle.value = `存入「${goal.name}」`
  editingGoalId.value = goal.id
  modalForm.value = { name: '', icon: '', amount: '', categoryId: '' }
  showModal.value = true
}

function openAdjust(goal: Goal) {
  modalMode.value = 'adjustGoal'
  modalTitle.value = `调整「${goal.name}」`
  editingGoalId.value = goal.id
  modalForm.value = {
    name: goal.name,
    icon: goal.icon,
    amount: (goal.targetAmount / 100).toFixed(2),
    savedAmount: (goal.savedAmount / 100).toFixed(2),
    categoryId: '',
  }
  showModal.value = true
}

function openNewBudget() {
  modalMode.value = 'newBudget'
  modalTitle.value = '添加预算'
  resetForm()
  if (availableBudgetCategories.value.length > 0) {
    modalForm.value.categoryId = availableBudgetCategories.value[0].id
  }
  showModal.value = true
}

function confirmModal() {
  const amountNum = Math.round(parseFloat(modalForm.value.amount || '0') * 100)

  if (modalMode.value === 'newGoal') {
    if (!modalForm.value.name || amountNum <= 0) {
      uni.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    goalBudgetStore.addGoal({
      icon: modalForm.value.icon || '✨',
      name: modalForm.value.name,
      targetAmount: amountNum,
    })
  } else if (modalMode.value === 'deposit') {
    if (amountNum <= 0) {
      uni.showToast({ title: '请输入有效金额', icon: 'none' })
      return
    }
    goalBudgetStore.depositToGoal(editingGoalId.value, amountNum)
  } else if (modalMode.value === 'adjustGoal') {
    if (!modalForm.value.name || amountNum <= 0) {
      uni.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    const savedAmountNum = Math.round(parseFloat(modalForm.value.savedAmount || '0') * 100)
    goalBudgetStore.updateGoal(editingGoalId.value, {
      name: modalForm.value.name,
      targetAmount: amountNum,
      savedAmount: savedAmountNum,
    })
  } else if (modalMode.value === 'newBudget') {
    if (!modalForm.value.categoryId || amountNum <= 0) {
      uni.showToast({ title: '请选择分类并输入金额', icon: 'none' })
      return
    }
    goalBudgetStore.addBudget({
      categoryId: modalForm.value.categoryId,
      amount: amountNum,
    })
  }

  closeModal()
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

/* ===== Header ===== */
.header {
  padding: 48px $space-6 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.header-action {
  padding: 8px 16px;
  border-radius: $radius-full;
  background: $gradient-brand;
  box-shadow: $shadow-brand;
  cursor: pointer;
}

.header-action-text {
  @include text-caption;
  color: white;
  font-weight: 700;
}

/* ===== 分段控制器 ===== */
.segmented {
  display: flex;
  background: $surface;
  border-radius: $radius-full;
  padding: 4px;
  margin: 0 $space-6 20px;
  box-shadow: $shadow-sm;
  border: 2px solid $border;
}

.seg-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: $radius-full;
  cursor: pointer;
  transition: $transition-base;
  border: none;
  background: transparent;

  &.active {
    background: $gradient-brand;
    box-shadow: 0 2px 8px rgba(200, 149, 108, 0.25);

    .seg-item-text {
      color: white;
    }
  }
}

.seg-item-text {
  @include text-body;
  color: $text-secondary;
  font-weight: 700;
}

/* ===== 目标卡片 ===== */
.goal-card {
  margin: 0 $space-6 16px;
  background: $surface;
  border-radius: $radius-lg;
  padding: 24px;
  box-shadow: $shadow-sm;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.goal-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.goal-icon {
  width: 56px;
  height: 56px;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.goal-icon-1 {
    background: linear-gradient(135deg, #FAF0E6, $brand-100);
  }

  &.goal-icon-2 {
    background: linear-gradient(135deg, $accent-100, #D6E5EC);
  }

  &.goal-icon-3 {
    background: linear-gradient(135deg, $success-100, #D4E6D4);
  }
}

.goal-icon-text {
  font-size: 28px;
}

.goal-info {
  flex: 1;
}

.goal-name {
  @include text-h2;
  display: block;
  margin-bottom: 4px;
}

.goal-amount {
  @include text-body;
  color: $text-secondary;
  display: block;
}

/* 环形进度 */
.goal-ring {
  width: 60px;
  height: 60px;
  position: relative;
  flex-shrink: 0;
}

.goal-ring-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.goal-ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @include text-caption;
  font-weight: 800;
  color: $text-primary;
}

/* 进度条 */
.goal-progress {
  margin-bottom: 16px;
}

.goal-bar-track {
  height: 12px;
  background: $border;
  border-radius: 6px;
  overflow: hidden;
}

.goal-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.6s ease;

  &.fill-1 {
    background: $gradient-brand;
  }

  &.fill-2 {
    background: $accent-500;
  }

  &.fill-3 {
    background: $success-500;
  }
}

/* 统计信息 */
.goal-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.goal-stat {
  flex: 1;
  padding: 12px;
  border-radius: $radius-sm;
  background: $bg-primary;
  text-align: center;
}

.goal-stat-label {
  @include text-small;
  color: $text-tertiary;
  margin-bottom: 4px;
  display: block;
}

.goal-stat-value {
  @include text-h3;
  color: $text-primary;
  display: block;
}

/* 操作按钮 */
.goal-actions {
  display: flex;
  gap: 10px;
}

.goal-btn {
  flex: 1;
  padding: 12px;
  border-radius: $radius-sm;
  text-align: center;
  cursor: pointer;
  border: none;

  &.primary {
    background: $gradient-brand;
    box-shadow: $shadow-brand;
  }

  &.secondary {
    background: $bg-primary;
    border: 1px solid $border;
  }
}

.goal-btn-text {
  @include text-body;
  font-weight: 700;

  .primary & {
    color: white;
  }

  .secondary & {
    color: $text-secondary;
  }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 24px;
}

.empty-text {
  @include text-body;
  color: $text-secondary;
  display: block;
  margin-bottom: 8px;
}

.empty-sub {
  @include text-caption;
  color: $text-tertiary;
  display: block;
}

/* ===== 预算管理 ===== */
.budget-section {
  margin: 0 $space-6;
}

.budget-total {
  background: $surface;
  border-radius: $radius-md;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: $shadow-sm;
  border: 1px solid $border;
}

.budget-total-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.budget-total-label {
  @include text-caption;
  color: $text-secondary;
}

.budget-total-value {
  @include text-body;
  font-weight: 700;
  color: $text-primary;
}

.budget-total-bar {
  height: 10px;
  background: $border;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
}

.budget-total-fill {
  height: 100%;
  border-radius: 5px;
  background: $gradient-brand;
}

.budget-total-stats {
  display: flex;
  justify-content: space-between;
}

.budget-stat-text {
  @include text-caption;
  color: $text-secondary;
}

/* 预算明细列表 */
.budget-list {
  background: $surface;
  border-radius: $radius-md;
  padding: 0 20px;
  box-shadow: $shadow-sm;
  border: 1px solid $border;
}

.budget-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid $border;

  &:last-child {
    border-bottom: none;
  }
}

.budget-item-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.food {
    background: linear-gradient(135deg, #FAF0E6, $brand-100);
  }

  &.transport {
    background: linear-gradient(135deg, $success-100, #D4E6D4);
  }

  &.housing {
    background: linear-gradient(135deg, $accent-100, #D6E5EC);
  }

  &.shopping {
    background: linear-gradient(135deg, $danger-100, #F0D5CF);
  }
}

.budget-item-icon-text {
  font-size: 18px;
}

.budget-item-info {
  flex: 1;
}

.budget-item-name {
  @include text-body;
  display: block;
  margin-bottom: 2px;
}

.budget-item-bar {
  height: 6px;
  background: $border;
  border-radius: 3px;
  overflow: hidden;
}

.budget-item-fill {
  height: 100%;
  border-radius: 3px;

  &.fill-brand {
    background: $brand-500;
  }

  &.fill-danger {
    background: $danger-500;
  }

  &.fill-accent {
    background: $accent-500;
  }

  &.fill-success {
    background: $success-500;
  }
}

.budget-item-right {
  text-align: right;
}

.budget-item-used {
  @include text-body;
  font-weight: 700;
  color: $text-primary;
  display: block;

  &.over {
    color: $danger-500;
  }
}

.budget-item-total {
  @include text-small;
  color: $text-tertiary;
  display: block;
}

/* 添加预算 */
.add-budget {
  margin: 16px 0;
  padding: 14px;
  border-radius: $radius-md;
  border: 2px dashed $border;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.add-budget-icon {
  font-size: 20px;
  color: $text-secondary;
  font-weight: 700;
}

.add-budget-text {
  @include text-body;
  color: $text-secondary;
  font-weight: 700;
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
  max-height: 85vh;
  overflow-y: auto;
  background: $surface;
  border-radius: $radius-lg $radius-lg 0 0;
  padding: 24px;
  padding-bottom: 40px;
  animation: slideUp 0.25s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
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

.modal-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modal-option {
  padding: 8px 14px;
  border-radius: $radius-full;
  background: $bg-primary;
  border: 1px solid $border;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  &.active {
    background: $brand-50;
    border-color: $brand-500;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: $surface;
  }
}

.option-badge {
  font-size: 10px;
  color: $text-tertiary;
  background: $bg-primary;
  padding: 2px 6px;
  border-radius: $radius-full;
}

.budget-empty-hint {
  padding: 16px;
  text-align: center;
  color: $text-tertiary;
  font-size: 14px;
  background: $bg-primary;
  border-radius: $radius-sm;
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
