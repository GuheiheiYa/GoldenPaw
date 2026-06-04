<template>
  <view class="app">
    <!-- Header -->
    <view class="header">
      <text class="header-title">我的</text>
    </view>

    <!-- 用户卡片 -->
    <view class="user-card">
      <view class="user-avatar" @tap="onAvatarTap">
        <image v-if="displayAvatar" class="user-avatar-img" :src="displayAvatar" mode="aspectFill" />
        <text v-else class="user-avatar-text">{{ userStore.isLoggedIn ? '✅' : '👤' }}</text>
      </view>
      <text class="user-name">{{ displayName }}</text>
      <text class="user-id">{{ displayId }}</text>
      <view v-if="userStore.isLoggedIn" class="login-badge" @tap.stop="onLogout">
        <text>退出登录</text>
      </view>
      <view v-else class="login-badge" @tap.stop="goLogin">
        <text>点击登录</text>
      </view>
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
          <text class="stat-value">{{ goalBudgetStore.goals.length }}</text>
          <text class="stat-label">存钱目标</text>
        </view>
      </view>
    </view>

    <!-- 账号设置 -->
    <view v-if="userStore.isLoggedIn" class="menu-section">
      <text class="menu-title">账号设置</text>
      <view class="menu-list">
        <view class="menu-item" @tap="openEditNameModal">
          <view class="menu-icon gold">
            <text class="menu-icon-text">✏️</text>
          </view>
          <view class="menu-info">
            <text class="menu-name">修改用户名</text>
            <text class="menu-desc">{{ userStore.user?.username || '未设置' }}</text>
          </view>
          <uni-icons class="menu-arrow" type="arrow-right" size="14" color="#C8B8A8" />
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

    <!-- 修改用户名弹窗 -->
    <view class="modal-overlay" v-if="showEditName" @tap="closeEditNameModal">
      <view class="modal-card" @tap.stop>
        <text class="modal-title">修改用户名</text>
        <view class="modal-field">
          <input class="modal-input" v-model="editNameValue" placeholder="输入新用户名" />
        </view>
        <view class="modal-actions">
          <view class="modal-btn secondary" @tap="closeEditNameModal">
            <text>取消</text>
          </view>
          <view class="modal-btn primary" @tap="confirmEditName">
            <text>保存</text>
          </view>
        </view>
      </view>
    </view>

    <TabBar />
    <RecordSheet />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'
import { useTransactionStore } from '@/stores/transaction'
import { useGoalBudgetStore } from '@/stores/goalBudget'
import { useUserStore } from '@/stores/user'
import { signOut } from '@/utils/supabase'
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'

const appStore = useAppStore()
const txStore = useTransactionStore()
const goalBudgetStore = useGoalBudgetStore()
const userStore = useUserStore()

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

/** 用户显示名称 */
const displayName = computed(() => {
  if (userStore.isLoggedIn) {
    return userStore.user?.username || userStore.user?.email?.split('@')[0] || '用户'
  }
  return 'GoldenPaw用户'
})

/** 用户ID显示 */
const displayId = computed(() => {
  if (userStore.isLoggedIn) {
    return `ID: ${userStore.user?.id?.slice(0, 8) || '...'}`
  }
  return 'ID: goldenpaw_001'
})

/** 头像 */
const displayAvatar = computed(() => {
  return userStore.user?.avatarUrl || ''
})

/** 跳转到登录 */
function goLogin() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/login' })
  }
}

/** 退出登录 */
async function onLogout() {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号吗？',
    confirmColor: '#C06C5F',
    success: async (res) => {
      if (res.confirm) {
        const { error } = await signOut()
        if (error) {
          uni.showToast({ title: '退出失败', icon: 'none' })
          return
        }
        userStore.setUser(null)
        uni.showToast({ title: '已退出登录', icon: 'success' })
      }
    },
  })
}

/** 选择并上传头像 */
function onAvatarTap() {
  if (!userStore.isLoggedIn) {
    goLogin()
    return
  }

  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res: any) => {
      const tempPath = res.tempFilePaths?.[0] || res.tempFiles?.[0]?.path
      if (!tempPath) {
        uni.showToast({ title: '选择图片失败', icon: 'none' })
        return
      }
      compressAndUploadAvatar(tempPath)
    },
    fail: () => {
      uni.showToast({ title: '选择图片失败', icon: 'none' })
    },
  })
}

/** 压缩图片并转为 base64 上传 */
function compressAndUploadAvatar(filePath: string) {
  uni.showLoading({ title: '处理中...' })

  // #ifdef H5
  // H5: tempFilePaths 是 blob URL，直接用 Image + Canvas 压缩
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const size = 200
    canvas.width = size
    canvas.height = size
    // 居中裁剪填充
    const min = Math.min(img.width, img.height)
    const sx = (img.width - min) / 2
    const sy = (img.height - min) / 2
    ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size)
    const base64 = canvas.toDataURL('image/jpeg', 0.7)
    uploadAvatarBase64(base64)
  }
  img.onerror = () => {
    uni.hideLoading()
    uni.showToast({ title: '图片处理失败', icon: 'none' })
  }
  img.src = filePath
  // #endif

  // #ifndef H5
  // 小程序/APP: 先用 uni.compressImage 压缩，再读文件转 base64
  uni.compressImage({
    src: filePath,
    quality: 70,
    success: (compressRes: any) => {
      const fs = uni.getFileSystemManager()
      fs.readFile({
        filePath: compressRes.tempFilePath,
        encoding: 'base64',
        success: (readRes: any) => {
          const base64 = `data:image/jpeg;base64,${readRes.data}`
          uploadAvatarBase64(base64)
        },
        fail: () => {
          uni.hideLoading()
          uni.showToast({ title: '图片读取失败', icon: 'none' })
        },
      })
    },
    fail: () => {
      uni.hideLoading()
      uni.showToast({ title: '图片压缩失败', icon: 'none' })
    },
  })
  // #endif
}

/** 上传 base64 头像到 profile */
async function uploadAvatarBase64(base64: string) {
  const ok = await userStore.updateAvatarUrl(base64)
  uni.hideLoading()
  if (ok) {
    uni.showToast({ title: '头像已更新', icon: 'success' })
  } else {
    uni.showToast({ title: '头像保存失败', icon: 'none' })
  }
}

/* ===== 修改用户名 ===== */
const showEditName = ref(false)
const editNameValue = ref('')

function openEditNameModal() {
  editNameValue.value = userStore.user?.username || ''
  showEditName.value = true
}

function closeEditNameModal() {
  showEditName.value = false
}

async function confirmEditName() {
  const name = editNameValue.value.trim()
  if (!name) {
    uni.showToast({ title: '用户名不能为空', icon: 'none' })
    return
  }
  uni.showLoading({ title: '保存中...' })
  const ok = await userStore.updateUsername(name)
  uni.hideLoading()
  if (ok) {
    uni.showToast({ title: '修改成功', icon: 'success' })
    closeEditNameModal()
  } else {
    uni.showToast({ title: '修改失败', icon: 'none' })
  }
}

/** 菜单名称到设置类型的映射 */
const menuTypeMap: Record<string, string> = {
  '导出数据': 'export',
  '导入数据': 'import',
  '云同步': 'sync',
  '清空数据': 'clear',
  '定期记账': 'recurring',
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
    uni.navigateTo({ url: '/pages/agreement/agreement' })
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
  { icon: '📤', name: '导出数据', desc: 'CSV 格式', iconClass: 'gold' },
  { icon: '📥', name: '导入数据', desc: '微信 / 支付宝账单', iconClass: 'green' },
  { icon: '☁️', name: '云同步', desc: '从未同步', iconClass: 'blue' },
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
  { icon: '🔄', name: '定期记账', desc: '自动记账规则', iconClass: 'accent' },
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
  overflow: hidden;
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: $radius-circle;
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
  margin-bottom: 8px;
}

.login-badge {
  display: inline-block;
  padding: 4px 14px;
  background: $gradient-brand;
  border-radius: 999px;
  margin-bottom: 16px;

  text {
    font-size: 12px;
    color: white;
    font-weight: 600;
  }
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

  &.accent {
    background: linear-gradient(135deg, #F5E6C8, #E8D5B0);
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

/* ===== Modal ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}

.modal-card {
  background: $surface;
  border-radius: $radius-lg;
  padding: 24px;
  width: 100%;
  max-width: 320px;
  box-shadow: $shadow-lg;
}

.modal-title {
  @include text-h3;
  display: block;
  margin-bottom: 20px;
  text-align: center;
}

.modal-field {
  margin-bottom: 16px;
}

.modal-input {
  width: 100%;
  height: 48px;
  background: $bg-secondary;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 0 14px;
  font-size: 16px;
  color: $text-primary;
  box-sizing: border-box;

  &::placeholder {
    color: $text-tertiary;
  }
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  height: 44px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;

  &.secondary {
    background: $bg-secondary;
    color: $text-secondary;
  }

  &.primary {
    background: $gradient-brand;
    color: white;
  }
}
</style>
