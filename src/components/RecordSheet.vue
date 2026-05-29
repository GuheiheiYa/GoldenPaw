<template>
  <view v-if="visible" class="overlay" @tap="onOverlayTap">
    <view class="sheet" :class="{ show: visible }" @tap.stop>
      <!-- 拖拽手柄 -->
      <view class="handle" />

      <!-- 收支类型切换 -->
      <SegmentedControl
        v-model="txType"
        :options="typeOptions"
      />

      <!-- 金额显示 -->
      <view class="amount-area">
        <text class="amount-label">¥</text>
        <text class="amount-value">{{ displayAmount }}</text>
      </view>

      <!-- 分类网格 -->
      <view v-if="txType !== 'transfer'" class="category-section">
        <CategoryGrid
          :type="txType"
          v-model="selectedCategoryId"
        />
      </view>

      <!-- 附加信息行 -->
      <view class="info-row">
        <picker class="info-item" mode="date" :value="selectedDate" @change="onDateChange">
          <text class="info-icon">📅</text>
          <text class="info-text">{{ displayDate }}</text>
        </picker>
        <view class="info-item" @tap="onAccountTap">
          <text class="info-icon">💳</text>
          <text class="info-text">{{ currentAccountName }}</text>
        </view>
        <view class="info-item" @tap="onTagTap">
          <text class="info-icon">🏷️</text>
          <text class="info-text">标签</text>
        </view>
      </view>

      <!-- 商户输入 -->
      <view class="note-row">
        <input
          v-model="merchant"
          class="note-input"
          placeholder="商户名称（选填）..."
          placeholder-style="color: #C4B8AD"
          :maxlength="30"
        />
      </view>

      <!-- 备注输入 -->
      <view class="note-row">
        <input
          v-model="note"
          class="note-input"
          placeholder="添加备注..."
          placeholder-style="color: #C4B8AD"
          :maxlength="50"
        />
      </view>

      <!-- 数字键盘 -->
      <NumberKeyboard
        v-model="amountStr"
        @confirm="onConfirm"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 记账 BottomSheet 组件
 * 提供完整的记账功能：金额输入、分类选择、备注、保存交易
 */
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import { useAccountStore } from '@/stores/account'
import SegmentedControl from './SegmentedControl.vue'
import CategoryGrid from './CategoryGrid.vue'
import NumberKeyboard from './NumberKeyboard.vue'
import { getToday } from '@/utils/format'

const appStore = useAppStore()
const transactionStore = useTransactionStore()
const accountStore = useAccountStore()

const txType = ref<'expense' | 'income' | 'transfer'>('expense')
const amountStr = ref('0')
const selectedCategoryId = ref('')
const note = ref('')
const merchant = ref('')
const selectedDate = ref(getToday())
const selectedAccountId = ref('')

/** 是否为编辑模式 */
const isEditMode = computed(() => !!appStore.editTransactionId)

const typeOptions = [
  { label: '支出', value: 'expense' },
  { label: '收入', value: 'income' },
  { label: '转账', value: 'transfer' },
]

/** 是否显示面板 */
const visible = computed(() => appStore.showRecordSheet)

/** 格式化金额显示 */
const displayAmount = computed(() => {
  const val = amountStr.value
  if (!val || val === '0') return '0.00'
  return val
})

/** 日期显示 */
const displayDate = computed(() => {
  if (selectedDate.value === getToday()) return '今天'
  const parts = selectedDate.value.split('-')
  return `${parseInt(parts[1])}月${parseInt(parts[2])}日`
})

/** 当前账户名称 */
const currentAccountName = computed(() => {
  if (!selectedAccountId.value) return '未选择'
  const acc = accountStore.getAccountById(selectedAccountId.value)
  return acc ? acc.name : '未选择'
})

/** 切换类型时重置分类选择 */
watch(txType, () => {
  selectedCategoryId.value = ''
})

/** 组合备注和商户 */
const composedNote = computed(() => {
  if (merchant.value && note.value) return `${merchant.value} | ${note.value}`
  if (merchant.value) return merchant.value
  return note.value
})

/** 打开时初始化：新增模式用默认账户，编辑模式加载交易数据 */
watch(visible, (show) => {
  if (show) {
    if (isEditMode.value) {
      loadTransaction(appStore.editTransactionId)
    } else {
      const defaultAcc = accountStore.getDefaultAccount()
      if (defaultAcc) {
        selectedAccountId.value = defaultAcc.id
      }
      merchant.value = ''
    }
  }
})

/**
 * 加载交易数据到表单
 * @param txId 交易ID
 */
function loadTransaction(txId: string) {
  const tx = transactionStore.transactions.find(t => t.id === txId)
  if (!tx) return
  txType.value = tx.type
  amountStr.value = (tx.amount / 100).toFixed(2)
  selectedCategoryId.value = tx.categoryId
  // 解析商户和备注（格式："商户 | 备注" 或纯备注）
  const noteParts = (tx.note || '').split(' | ')
  if (noteParts.length >= 2) {
    merchant.value = noteParts[0]
    note.value = noteParts.slice(1).join(' | ')
  } else {
    merchant.value = ''
    note.value = tx.note || ''
  }
  selectedDate.value = tx.date
  selectedAccountId.value = tx.accountId
}

/** 点击遮罩关闭 */
function onOverlayTap() {
  resetForm()
  appStore.closeRecordSheet()
}

/** 日期选择器变更 */
function onDateChange(e: any) {
  if (e.detail && e.detail.value) {
    selectedDate.value = e.detail.value
  }
}

/** 点击账户 */
function onAccountTap() {
  const accounts = accountStore.accounts
  if (accounts.length === 0) {
    uni.showToast({ title: '请先添加账户', icon: 'none' })
    return
  }
  const names = accounts.map(a => `${a.icon} ${a.name}`)
  uni.showActionSheet({
    itemList: names,
    success: (res) => {
      selectedAccountId.value = accounts[res.tapIndex].id
    }
  })
}

/** 点击标签 */
function onTagTap() {
  uni.showToast({ title: '标签功能开发中', icon: 'none' })
}

/** 确认保存 */
function onConfirm() {
  const amountYuan = parseFloat(amountStr.value)
  if (!amountYuan || amountYuan <= 0) {
    uni.showToast({ title: '请输入金额', icon: 'none' })
    return
  }
  if (!selectedCategoryId.value && txType.value !== 'transfer') {
    uni.showToast({ title: '请选择分类', icon: 'none' })
    return
  }
  if (!selectedAccountId.value) {
    uni.showToast({ title: '请选择账户', icon: 'none' })
    return
  }

  // 金额转分
  const amountCents = Math.round(amountYuan * 100)

  if (isEditMode.value) {
    const oldTx = transactionStore.transactions.find(t => t.id === appStore.editTransactionId)
    if (oldTx) {
      // 回滚旧交易对余额的影响
      const oldDelta = oldTx.type === 'expense' ? oldTx.amount : -oldTx.amount
      accountStore.updateBalance(oldTx.accountId, oldDelta)

      // 应用新余额影响
      const newDelta = txType.value === 'expense' ? -amountCents : amountCents
      accountStore.updateBalance(selectedAccountId.value, newDelta)

      // 更新交易记录
      transactionStore.updateTransaction(oldTx.id, {
        type: txType.value,
        amount: amountCents,
        categoryId: selectedCategoryId.value,
        accountId: selectedAccountId.value,
        note: composedNote.value,
        date: selectedDate.value,
      })
    }
  } else {
    // 扣减或增加账户余额
    const deltaCents = txType.value === 'expense' ? -amountCents : amountCents
    accountStore.updateBalance(selectedAccountId.value, deltaCents)

    // 保存交易记录
    transactionStore.addTransaction({
      type: txType.value,
      amount: amountCents,
      categoryId: selectedCategoryId.value,
      accountId: selectedAccountId.value,
      note: composedNote.value,
      date: selectedDate.value,
    })
  }

  // 重置并关闭
  resetForm()
  appStore.closeRecordSheet()
}

/** 重置表单 */
function resetForm() {
  txType.value = 'expense'
  amountStr.value = '0'
  selectedCategoryId.value = ''
  note.value = ''
  merchant.value = ''
  selectedDate.value = getToday()
  selectedAccountId.value = accountStore.getDefaultAccount()?.id || ''
}
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;
@use '../styles/mixins' as *;

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sheet {
  width: 100%;
  max-width: 414px;
  max-height: 85vh;
  background: $surface;
  border-radius: $radius-xl $radius-xl 0 0;
  padding: $space-4 $space-6 $space-6;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  overflow-y: auto;

  &.show {
    transform: translateY(0);
  }
}

.handle {
  width: 40px;
  height: 4px;
  background: $border;
  border-radius: 2px;
  margin: 0 auto $space-5;
}

.amount-area {
  display: flex;
  align-items: baseline;
  padding: $space-5 0;
  border-bottom: 2px dashed $border;
  margin-bottom: $space-4;
}

.amount-label {
  font: 700 24px/1.1 $font-sans;
  color: $text-secondary;
  margin-right: $space-2;
}

.amount-value {
  @include text-hero;
  color: $text-primary;
}

.category-section {
  margin-bottom: $space-3;
}

.info-row {
  display: flex;
  gap: $space-3;
  padding: $space-3 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: $space-1;
  padding: $space-2 $space-3;
  background: $bg-primary;
  border-radius: $radius-full;
  cursor: pointer;
  transition: $transition-base;

  &:active {
    background: $brand-50;
  }
}

.info-icon {
  font-size: 14px;
}

.info-text {
  font: 600 13px/1.4 $font-sans;
  color: $text-secondary;
}

.note-row {
  padding: $space-2 0 $space-3;
}

.note-input {
  width: 100%;
  height: 40px;
  padding: 0 $space-3;
  border-radius: $radius-sm;
  background: $bg-primary;
  font: 600 14px/1.5 $font-sans;
  color: $text-primary;
  border: 1px solid transparent;
  transition: $transition-base;

  &:focus {
    border-color: $brand-300;
    background: $surface;
  }
}
</style>
