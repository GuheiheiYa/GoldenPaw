<template>
  <view class="app">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <uni-icons class="back-icon" type="arrow-left" size="20" color="var(--text-secondary)" />
      </view>
      <text class="header-title">{{ pageTitle }}</text>
    </view>

    <view class="content">
      <!-- 分类管理 -->
      <template v-if="type === 'category'">
        <view class="section-title">支出分类</view>
        <view class="setting-list">
          <view
            class="setting-item-wrap"
            v-for="cat in expenseCategories"
            :key="cat.id"
          >
            <view class="setting-item-actions" v-if="catSwipedId === cat.id && !cat.isDefault">
              <view class="setting-action-btn delete" @tap.stop="onDeleteCategory(cat.id)">
                <text>删除</text>
              </view>
            </view>
            <view
              class="setting-item"
              :class="{ swiped: catSwipedId === cat.id }"
              @tap="onEditCategory(cat)"
              @touchstart="onCatTouchStart($event, cat)"
              @touchmove="onCatTouchMove($event, cat)"
              @touchend="onCatTouchEnd($event, cat)"
            >
              <text class="setting-icon">{{ cat.icon }}</text>
              <text class="setting-name">{{ cat.name }}</text>
            </view>
          </view>
        </view>
        <view class="section-title">收入分类</view>
        <view class="setting-list">
          <view
            class="setting-item-wrap"
            v-for="cat in incomeCategories"
            :key="cat.id"
          >
            <view class="setting-item-actions" v-if="catSwipedId === cat.id && !cat.isDefault">
              <view class="setting-action-btn delete" @tap.stop="onDeleteCategory(cat.id)">
                <text>删除</text>
              </view>
            </view>
            <view
              class="setting-item"
              :class="{ swiped: catSwipedId === cat.id }"
              @tap="onEditCategory(cat)"
              @touchstart="onCatTouchStart($event, cat)"
              @touchmove="onCatTouchMove($event, cat)"
              @touchend="onCatTouchEnd($event, cat)"
            >
              <text class="setting-icon">{{ cat.icon }}</text>
              <text class="setting-name">{{ cat.name }}</text>
            </view>
          </view>
        </view>
        <view class="add-btn" @tap="openCategoryModal">
          <text class="add-btn-text">+ 添加分类</text>
        </view>
      </template>

      <!-- 账户管理 -->
      <template v-else-if="type === 'account'">
        <view class="setting-list">
          <view
            class="setting-item-wrap"
            v-for="acc in accounts"
            :key="acc.id"
          >
            <view class="setting-item-actions" v-if="accSwipedId === acc.id">
              <view class="setting-action-btn delete" @tap.stop="onDeleteAccount(acc.id)">
                <text>删除</text>
              </view>
            </view>
            <view
              class="setting-item"
              :class="{ swiped: accSwipedId === acc.id }"
              @tap="onEditAccount(acc)"
              @touchstart="onAccTouchStart($event, acc)"
              @touchmove="onAccTouchMove($event, acc)"
              @touchend="onAccTouchEnd($event, acc)"
            >
              <text class="setting-icon">{{ acc.icon }}</text>
              <view class="setting-info">
                <text class="setting-name">{{ acc.name }}</text>
                <text class="setting-desc">{{ acc.bank || acc.type }}</text>
              </view>
              <text class="setting-value">{{ formatAmount(acc.balance) }}</text>
            </view>
          </view>
        </view>
        <view class="add-btn" @tap="openAccountModal">
          <text class="add-btn-text">+ 添加账户</text>
        </view>
      </template>

      <!-- 主题设置 -->
      <template v-else-if="type === 'theme'">
        <view class="setting-list">
          <view class="setting-item" v-for="t in themes" :key="t.id" @tap="onSelectTheme(t.id)">
            <view class="theme-preview" :style="{ background: t.color }"></view>
            <text class="setting-name">{{ t.name }}</text>
            <text v-if="t.id === appStore.theme" class="setting-badge">当前</text>
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
          <view class="setting-item" @tap="openPasswordModal">
            <text class="setting-icon">🔒</text>
            <view class="setting-info">
              <text class="setting-name">密码锁</text>
              <text class="setting-desc">{{ appStore.appPassword ? '已开启' : '设置 4 位数字密码' }}</text>
            </view>
            <text v-if="appStore.appPassword" class="setting-badge">已开启</text>
            <uni-icons v-else class="setting-arrow" type="arrow-right" size="14" color="var(--text-tertiary)" />
          </view>
        </view>
        <view v-if="appStore.appPassword" class="danger-btn" style="margin-top:24px;" @tap="onDisablePassword">
          <text class="danger-btn-text">关闭密码锁</text>
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
          <view class="setting-item" v-for="c in cycles" :key="c.id" @tap="onSelectCycle(c.id)">
            <text class="setting-name">{{ c.name }}</text>
            <text v-if="c.id === appStore.cycle" class="setting-badge">当前</text>
          </view>
        </view>
      </template>

      <!-- 数据导出 -->
      <template v-else-if="type === 'export'">
        <view class="setting-list">
          <view class="setting-item" @tap="exportCSV">
            <text class="setting-icon">📄</text>
            <view class="setting-info">
              <text class="setting-name">导出为 CSV</text>
              <text class="setting-desc">通用格式，可用 Excel 打开</text>
            </view>
            <uni-icons class="setting-arrow" type="arrow-right" size="14" color="var(--text-tertiary)" />
          </view>
          <view class="setting-item" @tap="showToast('Excel导出功能开发中')">
            <text class="setting-icon">📊</text>
            <view class="setting-info">
              <text class="setting-name">导出为 Excel</text>
              <text class="setting-desc">包含图表和统计</text>
            </view>
            <uni-icons class="setting-arrow" type="arrow-right" size="14" color="var(--text-tertiary)" />
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
            <uni-icons class="setting-arrow" type="arrow-right" size="14" color="var(--text-tertiary)" />
          </view>
          <view class="setting-item" @tap="showToast('支付宝账单导入开发中')">
            <text class="setting-icon">💰</text>
            <view class="setting-info">
              <text class="setting-name">导入支付宝账单</text>
              <text class="setting-desc">从支付宝导出的账单文件</text>
            </view>
            <uni-icons class="setting-arrow" type="arrow-right" size="14" color="var(--text-tertiary)" />
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

      <!-- 添加/编辑分类弹窗 -->
      <view class="modal-overlay" v-if="showCategoryModal" @tap="closeCategoryModal">
        <view class="modal-card" @tap.stop>
          <text class="modal-title">{{ editingCategoryId ? '编辑分类' : '添加分类' }}</text>
          <view class="modal-field">
            <text class="modal-label">类型</text>
            <view class="modal-options">
              <view class="modal-option" :class="{ active: categoryForm.type === 'expense' }" @tap="categoryForm.type = 'expense'">支出</view>
              <view class="modal-option" :class="{ active: categoryForm.type === 'income' }" @tap="categoryForm.type = 'income'">收入</view>
            </view>
          </view>
          <view class="modal-field">
            <text class="modal-label">名称</text>
            <input class="modal-input" v-model="categoryForm.name" placeholder="例如：健身" />
          </view>
          <view class="modal-field">
            <text class="modal-label">图标</text>
            <EmojiGrid v-model="categoryForm.icon" />
          </view>
          <view class="modal-actions">
            <view class="modal-btn secondary" @tap="closeCategoryModal">
              <text>取消</text>
            </view>
            <view class="modal-btn primary" @tap="confirmAddCategory">
              <text>确定</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 添加/编辑账户弹窗 -->
      <view class="modal-overlay" v-if="showAccountModal" @tap="closeAccountModal">
        <view class="modal-card" @tap.stop>
          <text class="modal-title">{{ editingAccountId ? '编辑账户' : '添加账户' }}</text>
          <view class="modal-field">
            <text class="modal-label">名称</text>
            <input class="modal-input" v-model="accountForm.name" placeholder="例如：工资卡" />
          </view>
          <view class="modal-field">
            <text class="modal-label">类型</text>
            <view class="modal-options">
              <view class="modal-option" :class="{ active: accountForm.type === 'savings' }" @tap="accountForm.type = 'savings'">储蓄</view>
              <view class="modal-option" :class="{ active: accountForm.type === 'credit' }" @tap="accountForm.type = 'credit'">信用卡</view>
              <view class="modal-option" :class="{ active: accountForm.type === 'cash' }" @tap="accountForm.type = 'cash'">现金</view>
              <view class="modal-option" :class="{ active: accountForm.type === 'investment' }" @tap="accountForm.type = 'investment'">投资</view>
            </view>
          </view>
          <view class="modal-field">
            <text class="modal-label">银行/机构（可选）</text>
            <input class="modal-input" v-model="accountForm.bank" placeholder="例如：招商银行" />
          </view>
          <view class="modal-field">
            <text class="modal-label">图标</text>
            <EmojiGrid v-model="accountForm.icon" />
          </view>
          <view class="modal-actions">
            <view class="modal-btn secondary" @tap="closeAccountModal">
              <text>取消</text>
            </view>
            <view class="modal-btn primary" @tap="confirmAddAccount">
              <text>确定</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 密码锁弹窗 -->
      <view class="modal-overlay" v-if="showPasswordModal" @tap="closePasswordModal">
        <view class="modal-card" @tap.stop>
          <text class="modal-title">{{ passwordModalTitle }}</text>
          <view class="modal-field" v-if="passwordStep === 'old' || passwordStep === 'verify'">
            <text class="modal-label">当前密码</text>
            <input class="modal-input" v-model="passwordForm.old" type="password" maxlength="4" placeholder="输入当前密码" />
          </view>
          <view class="modal-field" v-if="passwordStep !== 'verify'">
            <text class="modal-label">{{ passwordStep === 'old' ? '新密码' : '密码' }}</text>
            <input class="modal-input" v-model="passwordForm.new" type="password" maxlength="4" placeholder="输入 4 位数字" />
          </view>
          <view class="modal-field" v-if="passwordStep !== 'verify'">
            <text class="modal-label">确认密码</text>
            <input class="modal-input" v-model="passwordForm.confirm" type="password" maxlength="4" placeholder="再次输入 4 位数字" />
          </view>
          <view class="modal-field" v-if="passwordStep === 'verify'">
            <text class="modal-label" style="text-align:center; color: var(--text-secondary);">输入密码以关闭密码锁</text>
          </view>
          <view class="modal-actions">
            <view class="modal-btn secondary" @tap="closePasswordModal">
              <text>取消</text>
            </view>
            <view class="modal-btn primary" @tap="confirmPassword">
              <text>确定</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useCategoryStore } from '@/stores/category'
import { useAccountStore } from '@/stores/account'
import { useTransactionStore } from '@/stores/transaction'
import { useAppStore, type CycleType } from '@/stores/app'
import { formatAmount } from '@/utils/format'
import EmojiGrid from '@/components/EmojiGrid.vue'
import type { Account } from '@/types/transaction'

const categoryStore = useCategoryStore()
const accountStore = useAccountStore()
const transactionStore = useTransactionStore()
const appStore = useAppStore()

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

const reminderEnabled = computed({
  get: () => appStore.reminderEnabled,
  set: (v) => { appStore.reminderEnabled = v }
})
const budgetAlertEnabled = computed({
  get: () => appStore.budgetAlertEnabled,
  set: (v) => { appStore.budgetAlertEnabled = v }
})

const showCategoryModal = ref(false)
const editingCategoryId = ref('')
const categoryForm = ref({
  type: 'expense' as 'expense' | 'income',
  name: '',
  icon: '💰',
  color: '#FAF0E6',
})

function openCategoryModal() {
  editingCategoryId.value = ''
  categoryForm.value = { type: 'expense', name: '', icon: '💰', color: '#FAF0E6' }
  showCategoryModal.value = true
}

function onEditCategory(cat: any) {
  if (catSwipedId.value) {
    catSwipedId.value = ''
    return
  }
  editingCategoryId.value = cat.id
  categoryForm.value = {
    type: cat.type,
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
  }
  showCategoryModal.value = true
}

function closeCategoryModal() {
  showCategoryModal.value = false
  editingCategoryId.value = ''
}

function confirmAddCategory() {
  if (!categoryForm.value.name.trim()) {
    uni.showToast({ title: '请输入分类名称', icon: 'none' })
    return
  }
  if (editingCategoryId.value) {
    categoryStore.updateCategory(editingCategoryId.value, {
      name: categoryForm.value.name.trim(),
      icon: categoryForm.value.icon,
      color: categoryForm.value.color,
    })
    uni.showToast({ title: '修改成功', icon: 'success' })
  } else {
    categoryStore.addCategory({
      type: categoryForm.value.type,
      name: categoryForm.value.name.trim(),
      icon: categoryForm.value.icon,
      color: categoryForm.value.color,
    })
    uni.showToast({ title: '添加成功', icon: 'success' })
  }
  closeCategoryModal()
}

/** 分类滑动删除 */
const catSwipedId = ref('')
let catTouchStartX = 0
let catHasSwiped = false

function onCatTouchStart(e: any, cat: any) {
  catTouchStartX = e.touches[0].clientX
  catHasSwiped = false
  // 点击其他项时复位
  if (catSwipedId.value && catSwipedId.value !== cat.id) {
    catSwipedId.value = ''
  }
}

function onCatTouchMove(e: any, cat: any) {
  const deltaX = e.touches[0].clientX - catTouchStartX
  if (deltaX < -40 && !cat.isDefault) {
    catSwipedId.value = cat.id
  } else if (deltaX > 40 && catSwipedId.value === cat.id) {
    catSwipedId.value = ''
  }
  if (deltaX < -60 && !catHasSwiped && !cat.isDefault) {
    catHasSwiped = true
    // #ifdef APP-PLUS
    uni.vibrateShort({})
    // #endif
  }
}

function onCatTouchEnd(e: any, cat: any) {
  if (catHasSwiped && !cat.isDefault) {
    catHasSwiped = false
    setTimeout(() => { catSwipedId.value = '' }, 200)
    uni.showModal({
      title: '删除分类',
      content: `确定删除分类「${cat.name}」吗？`,
      confirmColor: '#C06C5F',
      success: (res) => {
        if (res.confirm) {
          categoryStore.deleteCategory(cat.id)
        }
      },
    })
  }
}

function onDeleteCategory(id: string) {
  const cat = categoryStore.getCategoryById(id)
  if (cat?.isDefault) {
    uni.showToast({ title: '默认分类不可删除', icon: 'none' })
    return
  }
  uni.showModal({
    title: '删除分类',
    content: `确定删除分类「${cat?.name || ''}」吗？`,
    confirmColor: '#C06C5F',
    success: (res) => {
      if (res.confirm) {
        categoryStore.deleteCategory(id)
      }
    },
  })
}

const showAccountModal = ref(false)
const editingAccountId = ref('')
const accountForm = ref({
  name: '',
  type: 'savings' as Account['type'],
  bank: '',
  icon: '💳',
})

function openAccountModal() {
  editingAccountId.value = ''
  accountForm.value = { name: '', type: 'savings', bank: '', icon: '💳' }
  showAccountModal.value = true
}

function onEditAccount(acc: Account) {
  if (accSwipedId.value) {
    accSwipedId.value = ''
    return
  }
  editingAccountId.value = acc.id
  accountForm.value = {
    name: acc.name,
    type: acc.type,
    bank: acc.bank || '',
    icon: acc.icon,
  }
  showAccountModal.value = true
}

function closeAccountModal() {
  showAccountModal.value = false
  editingAccountId.value = ''
}

function confirmAddAccount() {
  if (!accountForm.value.name.trim()) {
    uni.showToast({ title: '请输入账户名称', icon: 'none' })
    return
  }
  if (editingAccountId.value) {
    accountStore.updateAccount(editingAccountId.value, {
      name: accountForm.value.name.trim(),
      type: accountForm.value.type,
      bank: accountForm.value.bank.trim() || undefined,
      icon: accountForm.value.icon,
    })
    uni.showToast({ title: '修改成功', icon: 'success' })
  } else {
    accountStore.addAccount({
      name: accountForm.value.name.trim(),
      type: accountForm.value.type,
      bank: accountForm.value.bank.trim() || undefined,
      icon: accountForm.value.icon,
    })
    uni.showToast({ title: '添加成功', icon: 'success' })
  }
  closeAccountModal()
}

/** 账户滑动删除 */
const accSwipedId = ref('')
let accTouchStartX = 0
let accHasSwiped = false

function onAccTouchStart(e: any, acc: Account) {
  accTouchStartX = e.touches[0].clientX
  accHasSwiped = false
  if (accSwipedId.value && accSwipedId.value !== acc.id) {
    accSwipedId.value = ''
  }
}

function onAccTouchMove(e: any, acc: Account) {
  const deltaX = e.touches[0].clientX - accTouchStartX
  if (deltaX < -40) {
    accSwipedId.value = acc.id
  } else if (deltaX > 40 && accSwipedId.value === acc.id) {
    accSwipedId.value = ''
  }
  if (deltaX < -60 && !accHasSwiped) {
    accHasSwiped = true
    // #ifdef APP-PLUS
    uni.vibrateShort({})
    // #endif
  }
}

function onAccTouchEnd(e: any, acc: Account) {
  if (accHasSwiped) {
    accHasSwiped = false
    setTimeout(() => { accSwipedId.value = '' }, 200)
    uni.showModal({
      title: '删除账户',
      content: `确定删除账户「${acc.name}」吗？\n余额 ${formatAmount(acc.balance)} 将被清零`,
      confirmColor: '#C06C5F',
      success: (res) => {
        if (res.confirm) {
          accountStore.deleteAccount(acc.id)
        }
      },
    })
  }
}

function onDeleteAccount(id: string) {
  const acc = accountStore.getAccountById(id)
  uni.showModal({
    title: '删除账户',
    content: `确定删除账户「${acc?.name || ''}」吗？`,
    confirmColor: '#C06C5F',
    success: (res) => {
      if (res.confirm) {
        accountStore.deleteAccount(id)
      }
    },
  })
}

function exportCSV() {
  const txs = transactionStore.transactions
  const header = '日期,时间,类型,金额,分类,账户,备注\n'
  const rows = txs.map(tx => {
    const cat = categoryStore.getCategoryById(tx.categoryId)
    const acc = accountStore.getAccountById(tx.accountId)
    const typeLabel = tx.type === 'income' ? '收入' : tx.type === 'expense' ? '支出' : '转账'
    const amountYuan = (tx.amount / 100).toFixed(2)
    return `${tx.date},${tx.time},${typeLabel},${amountYuan},${cat?.name || ''},${acc?.name || ''},"${tx.note || ''}"`
  }).join('\n')
  const csv = header + rows

  // H5 环境下通过创建 Blob 下载
  // #ifdef H5
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `goldenpaw_export_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  uni.showToast({ title: '导出成功', icon: 'success' })
  // #endif

  // 非 H5 环境下复制到剪贴板
  // #ifndef H5
  uni.setClipboardData({
    data: csv,
    success: () => uni.showToast({ title: '已复制CSV到剪贴板', icon: 'success' }),
  })
  // #endif
}

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

function onSelectTheme(themeId: string) {
  appStore.setTheme(themeId)
  uni.showToast({ title: '主题已切换', icon: 'success' })
}

function onSelectCycle(cycleId: string) {
  appStore.setCycle(cycleId as CycleType)
  uni.showToast({ title: '周期已切换', icon: 'success' })
}

/* ===== Password Lock ===== */
const showPasswordModal = ref(false)
const passwordStep = ref<'new' | 'old' | 'verify'>('new')
const passwordForm = ref({ old: '', new: '', confirm: '' })

const passwordModalTitle = computed(() => {
  if (passwordStep.value === 'verify') return '关闭密码锁'
  if (passwordStep.value === 'old') return '修改密码'
  return '设置密码锁'
})

function openPasswordModal() {
  passwordStep.value = appStore.appPassword ? 'old' : 'new'
  passwordForm.value = { old: '', new: '', confirm: '' }
  showPasswordModal.value = true
}

function closePasswordModal() {
  showPasswordModal.value = false
  passwordForm.value = { old: '', new: '', confirm: '' }
}

function confirmPassword() {
  const { old, new: n, confirm } = passwordForm.value
  const DIGIT_RE = /^\d{4}$/

  if (passwordStep.value === 'verify') {
    if (old !== appStore.appPassword) {
      uni.showToast({ title: '密码错误', icon: 'none' })
      return
    }
    appStore.setPassword('')
    uni.showToast({ title: '密码锁已关闭', icon: 'success' })
    closePasswordModal()
    return
  }

  if (passwordStep.value === 'old') {
    if (old !== appStore.appPassword) {
      uni.showToast({ title: '旧密码错误', icon: 'none' })
      return
    }
  }

  if (!DIGIT_RE.test(n)) {
    uni.showToast({ title: '请输入 4 位数字密码', icon: 'none' })
    return
  }
  if (n !== confirm) {
    uni.showToast({ title: '两次输入不一致', icon: 'none' })
    return
  }

  appStore.setPassword(n)
  uni.showToast({ title: '密码设置成功', icon: 'success' })
  closePasswordModal()
}

function onDisablePassword() {
  passwordStep.value = 'verify'
  passwordForm.value = { old: '', new: '', confirm: '' }
  showPasswordModal.value = true
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

.setting-item-wrap {
  position: relative;
  border-bottom: 1px solid $border-light;

  &:last-child {
    border-bottom: none;
  }
}

.setting-item-actions {
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

.setting-action-btn {
  @include text-body;
  color: white;
  font-weight: 700;

  &.delete {
    color: white;
  }
}

.setting-item {
  display: flex;
  align-items: center;
  padding: $space-4 $space-5;
  background: $surface;
  transition: transform 0.25s ease;
  cursor: pointer;
  position: relative;
  z-index: 1;

  &:active {
    background: $brand-50;
  }

  &.swiped {
    transform: translateX(-80px);
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

.modal-options {
  display: flex;
  gap: 8px;
}

.modal-option {
  padding: 8px 14px;
  border-radius: $radius-full;
  background: $bg-primary;
  border: 1px solid $border;
  cursor: pointer;

  &.active {
    background: $brand-50;
    border-color: $brand-500;
  }
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
