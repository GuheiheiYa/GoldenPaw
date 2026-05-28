# GoldenPaw Phase 1: Project Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the uni-app project skeleton with Design System, custom TabBar, routing, Pinia stores, and placeholder pages.

**Architecture:** uni-app (Vue3 + Vite + TypeScript) with custom TabBar component (center FAB button), Pinia state management with persistence, and SCSS-based Design System extracted from the existing HTML prototypes.

**Tech Stack:** uni-app, Vue 3, Vite, TypeScript, Vant 4, Pinia, SCSS

---

## File Map

### New Files (to create)
| File | Responsibility |
|------|---------------|
| `package.json` | Dependencies and scripts |
| `vite.config.ts` | Vite + uni-app plugin config |
| `tsconfig.json` | TypeScript configuration |
| `src/main.ts` | App entry point, Pinia + Vant setup |
| `src/App.vue` | Root component, global styles |
| `src/pages.json` | Page routes and custom tabBar config |
| `src/manifest.json` | uni-app platform config |
| `src/uni.scss` | uni-app global style variables |
| `src/styles/design-system.scss` | Design Tokens (colors, fonts, spacing, shadows) |
| `src/styles/mixins.scss` | Reusable SCSS mixins |
| `src/styles/reset.scss` | CSS reset |
| `src/types/transaction.ts` | Transaction, Category, Account interfaces |
| `src/stores/app.ts` | Global app state (showRecordSheet, currentTab) |
| `src/stores/transaction.ts` | Transaction CRUD store |
| `src/stores/category.ts` | Category management store |
| `src/stores/account.ts` | Account management store |
| `src/utils/format.ts` | Amount/date formatting |
| `src/utils/id.ts` | UUID generation |
| `src/components/TabBar.vue` | Custom bottom navigation with center FAB |
| `src/components/RecordSheet.vue` | Record transaction BottomSheet (placeholder) |
| `src/components/SegmentedControl.vue` | Segmented control component |
| `src/pages/index/index.vue` | Home page (placeholder) |
| `src/pages/ai/ai.vue` | AI bookkeeping page (placeholder) |
| `src/pages/assets/assets.vue` | Assets page (placeholder) |
| `src/pages/profile/profile.vue` | Profile page (placeholder) |
| `src/pages/report/report.vue` | Report page (placeholder) |
| `src/pages/detail/detail.vue` | Detail page (placeholder) |
| `src/pages/goals/goals.vue` | Goals page (placeholder) |
| `src/pages/pending/pending.vue` | Pending page (placeholder) |

---

## Task 1: Initialize uni-app Project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Create: `src/main.ts`, `src/App.vue`, `src/pages.json`, `src/manifest.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "golden-paw",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev:h5": "uni",
    "build:h5": "uni build",
    "dev:mp-weixin": "uni -p mp-weixin",
    "build:mp-weixin": "uni build -p mp-weixin"
  },
  "dependencies": {
    "@dcloudio/uni-app": "3.0.0-4060620250520001",
    "@dcloudio/uni-app-plus": "3.0.0-4060620250520001",
    "@dcloudio/uni-components": "3.0.0-4060620250520001",
    "@dcloudio/uni-h5": "3.0.0-4060620250520001",
    "@dcloudio/uni-mp-weixin": "3.0.0-4060620250520001",
    "vue": "^3.4.0",
    "pinia": "^2.1.0",
    "pinia-plugin-persistedstate": "^3.2.0"
  },
  "devDependencies": {
    "@dcloudio/types": "^3.4.0",
    "@dcloudio/uni-automator": "3.0.0-4060620250520001",
    "@dcloudio/uni-cli-shared": "3.0.0-4060620250520001",
    "@dcloudio/uni-stacktracey": "3.0.0-4060620250520001",
    "@dcloudio/vite-plugin-uni": "3.0.0-4060620250520001",
    "sass": "^1.77.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
})
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "types": ["@dcloudio/types"],
    "paths": {
      "@/*": ["./src/*"]
    },
    "baseUrl": "."
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>GoldenPaw</title>
  <!--preload-links-->
  <!--app-context-->
</head>
<body>
  <div id="app"><!--app-html--></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

- [ ] **Step 5: Create src/main.ts**

```typescript
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  return { app }
}
```

- [ ] **Step 6: Create src/App.vue**

```vue
<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('GoldenPaw App Launched')
})
</script>

<style lang="scss">
@import '@/styles/reset.scss';
@import '@/styles/design-system.scss';
</style>
```

- [ ] **Step 7: Create src/pages.json**

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/ai/ai",
      "style": {
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/assets/assets",
      "style": {
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/profile/profile",
      "style": {
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/report/report",
      "style": {
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/detail/detail",
      "style": {
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/goals/goals",
      "style": {
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/pending/pending",
      "style": {
        "navigationStyle": "custom"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarBackgroundColor": "#FDF8F3",
    "backgroundColor": "#FDF8F3"
  },
  "tabBar": {
    "custom": true,
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "pagePath": "pages/ai/ai",
        "text": "AI记账"
      },
      {
        "pagePath": "pages/assets/assets",
        "text": "资产"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "我的"
      }
    ]
  }
}
```

- [ ] **Step 8: Create src/manifest.json**

```json
{
  "name": "GoldenPaw",
  "appid": "__UNI__GOLDENPAW",
  "description": "个人资产管理APP — 记账 · 存钱 · 资产追踪",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false
}
```

- [ ] **Step 9: Create src/uni.scss**

```scss
/* uni-app 全局样式变量 */
$uni-primary: #C8956C;
$uni-success: #6B8E6B;
$uni-error: #C06C5F;
$uni-warning: #D4A574;
$uni-text-color: #3D3229;
$uni-text-color-grey: #7A6B5D;
$uni-bg-color: #FDF8F3;
$uni-border-color: #EDE4D8;
```

- [ ] **Step 10: Install dependencies and verify**

Run: `cd D:/project/aiProject/GoldenPaw && npm install`
Expected: Dependencies installed successfully, no errors.

- [ ] **Step 11: Commit**

```bash
git init
git add -A
git commit -m "feat: initialize uni-app project with Vue3 + Vite + TypeScript"
```

---

## Task 2: Create Design System (SCSS)

**Files:**
- Create: `src/styles/design-system.scss`
- Create: `src/styles/mixins.scss`
- Create: `src/styles/reset.scss`

- [ ] **Step 1: Create src/styles/design-system.scss**

```scss
// GoldenPaw Design System v1.0
// Extracted from GoldenPaw_Design_System_v1.md

// ===== Brand Colors =====
$brand-50: #FDF8F3;
$brand-100: #F5E6D3;
$brand-200: #EDD4B8;
$brand-300: #D4A574;
$brand-400: #C8956C;
$brand-500: #C8956C;
$brand-600: #A67B5B;
$brand-700: #8B6549;
$brand-800: #6F4F3A;
$brand-900: #3D3229;

// ===== Functional Colors =====
$success-50: #F0F7F0;
$success-100: #E8F0E8;
$success-500: #6B8E6B;
$success-600: #5A7A5A;

$danger-50: #FAF0EE;
$danger-100: #F5E0DC;
$danger-500: #C06C5F;
$danger-600: #A85D52;

$accent-50: #F0F5F7;
$accent-100: #E8F1F5;
$accent-500: #7A9EAF;
$accent-600: #6A8C9C;

// ===== Neutral Colors =====
$text-primary: #3D3229;
$text-secondary: #7A6B5D;
$text-tertiary: #A89B8E;
$text-placeholder: #C4B8AD;

$bg-primary: #FDF8F3;
$bg-secondary: #F7EDE0;
$bg-tertiary: #F0E6D8;
$surface: #FFFFFF;
$surface-elevated: #FFFFFF;

$border: #EDE4D8;
$border-light: #F5EDE4;
$border-focus: #C8956C;

// ===== Gradients =====
$gradient-brand: linear-gradient(135deg, #C8956C, #A67B5B);
$gradient-success: linear-gradient(90deg, #6B8E6B, #8FBC8F);
$gradient-danger: linear-gradient(90deg, #C06C5F, #D4857A);
$gradient-warm: linear-gradient(180deg, #FDF8F3, #F7EDE0);

// ===== Shadows =====
$shadow-sm: 0 2px 8px rgba(61, 50, 41, 0.04);
$shadow-md: 0 8px 24px rgba(61, 50, 41, 0.06);
$shadow-lg: 0 16px 48px rgba(61, 50, 41, 0.08);
$shadow-brand: 0 4px 16px rgba(200, 149, 108, 0.35);
$shadow-inset: inset 0 1px 2px rgba(61, 50, 41, 0.04);

// ===== Radius =====
$radius-sm: 12px;
$radius-md: 16px;
$radius-lg: 20px;
$radius-xl: 24px;
$radius-full: 100px;
$radius-circle: 50%;

// ===== Spacing =====
$space-1: 4px;
$space-2: 8px;
$space-3: 12px;
$space-4: 16px;
$space-5: 20px;
$space-6: 24px;
$space-8: 32px;
$space-10: 40px;
$space-12: 48px;

// ===== Typography =====
$font-sans: -apple-system, 'SF Pro Display', 'Segoe UI', 'PingFang SC', 'Noto Sans SC', sans-serif;

// ===== Transitions =====
$transition-fast: 0.15s ease;
$transition-base: 0.2s ease;
$transition-slow: 0.3s ease;
$transition-spring: 0.4s cubic-bezier(0.32, 0.72, 0, 1);
```

- [ ] **Step 2: Create src/styles/mixins.scss**

```scss
@use './design-system' as *;

// ===== Typography Mixins =====
@mixin text-hero {
  font: 800 40px/1.1 $font-sans;
  letter-spacing: -1.5px;
  font-variant-numeric: tabular-nums;
}

@mixin text-h1 {
  font: 700 24px/1.3 $font-sans;
  letter-spacing: -0.3px;
}

@mixin text-h2 {
  font: 700 18px/1.4 $font-sans;
  letter-spacing: -0.2px;
}

@mixin text-h3 {
  font: 700 16px/1.4 $font-sans;
}

@mixin text-body {
  font: 600 15px/1.5 $font-sans;
}

@mixin text-caption {
  font: 600 13px/1.4 $font-sans;
}

@mixin text-small {
  font: 600 11px/1.4 $font-sans;
  letter-spacing: 0.5px;
}

@mixin text-micro {
  font: 700 10px/1.3 $font-sans;
  letter-spacing: 1px;
}

// ===== Gradient Mixins =====
@mixin gradient-brand {
  background: linear-gradient(135deg, $brand-500, $brand-600);
}

@mixin gradient-success {
  background: linear-gradient(90deg, $success-500, #8FBC8F);
}

@mixin gradient-danger {
  background: linear-gradient(90deg, $danger-500, #D4857A);
}

// ===== Component Mixins =====
@mixin card-base {
  background: $surface;
  border-radius: $radius-lg;
  border: 1px solid $border;
  box-shadow: $shadow-sm;
}

@mixin card-emphasis {
  background: $surface;
  border-radius: $radius-lg;
  border: 2px solid $brand-100;
  box-shadow: $shadow-md;
}

@mixin icon-btn {
  width: 40px;
  height: 40px;
  border-radius: $radius-sm;
  background: $surface;
  border: 1px solid $border;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: $shadow-sm;
  transition: $transition-base;

  &:active {
    transform: scale(0.92);
  }
}

@mixin capsule-btn($bg, $color) {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3 $space-4;
  border-radius: $radius-full;
  font: 700 13px/1.4 $font-sans;
  white-space: nowrap;
  cursor: pointer;
  transition: $transition-base;
  border: none;
  background: $bg;
  color: $color;
  box-shadow: $shadow-sm;

  &:active {
    transform: scale(0.95);
  }
}

// ===== Amount Display =====
@mixin amount-display {
  font-variant-numeric: tabular-nums;
  letter-spacing: -1px;
  font-weight: 800;
}
```

- [ ] **Step 3: Create src/styles/reset.scss**

```scss
// GoldenPaw Reset Styles

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: -apple-system, 'SF Pro Display', 'Segoe UI', 'PingFang SC', 'Noto Sans SC', sans-serif;
  background: #FDF8F3;
  color: #3D3229;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

image {
  max-width: 100%;
  display: block;
}

button {
  font-family: inherit;
}
```

- [ ] **Step 4: Verify SCSS compilation**

Run: `cd D:/project/aiProject/GoldenPaw && npx vite build --mode development 2>&1 | head -20`
Expected: Build starts without SCSS compilation errors.

- [ ] **Step 5: Commit**

```bash
git add src/styles/
git commit -m "feat: add Design System SCSS tokens and mixins"
```

---

## Task 3: Create TypeScript Types and Utilities

**Files:**
- Create: `src/types/transaction.ts`
- Create: `src/utils/format.ts`
- Create: `src/utils/id.ts`

- [ ] **Step 1: Create src/types/transaction.ts**

```typescript
/** 交易类型 */
export type TransactionType = 'expense' | 'income' | 'transfer'

/** 交易记录 */
export interface Transaction {
  id: string
  type: TransactionType
  /** 金额（单位：分） */
  amount: number
  categoryId: string
  accountId: string
  /** 转入账户（仅转账类型） */
  toAccountId?: string
  /** 日期 YYYY-MM-DD */
  date: string
  /** 时间 HH:mm */
  time: string
  note: string
  tags: string[]
  createdAt: number
}

/** 分类 */
export interface Category {
  id: string
  name: string
  /** emoji 或图标名 */
  icon: string
  type: TransactionType
  /** 背景色 */
  color: string
  sortOrder: number
  isDefault: boolean
}

/** 账户类型 */
export type AccountType = 'savings' | 'credit' | 'investment' | 'cash'

/** 账户 */
export interface Account {
  id: string
  name: string
  type: AccountType
  bank?: string
  icon: string
  /** 余额（单位：分） */
  balance: number
}
```

- [ ] **Step 2: Create src/utils/id.ts**

```typescript
/** 生成唯一ID */
export function generateId(): string {
  return 'xxxx-xxxx-xxxx'.replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  )
}
```

- [ ] **Step 3: Create src/utils/format.ts**

```typescript
/**
 * 格式化金额（分 → 元）
 * @param cents 金额（分）
 * @param showSign 是否显示正负号
 */
export function formatAmount(cents: number, showSign = false): string {
  const yuan = (cents / 100).toFixed(2)
  const formatted = Number(yuan).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  if (showSign && cents > 0) return `+¥${formatted}`
  return `¥${formatted}`
}

/**
 * 格式化日期
 * @param dateStr YYYY-MM-DD
 * @returns MM-DD 格式
 */
export function formatDate(dateStr: string): string {
  const parts = dateStr.split('-')
  return `${parts[1]}-${parts[2]}`
}

/**
 * 获取今天的日期字符串
 */
export function getToday(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * 获取当前时间字符串
 */
export function getCurrentTime(): string {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}
```

- [ ] **Step 4: Commit**

```bash
git add src/types/ src/utils/
git commit -m "feat: add TypeScript types and utility functions"
```

---

## Task 4: Create Pinia Stores

**Files:**
- Create: `src/stores/app.ts`
- Create: `src/stores/transaction.ts`
- Create: `src/stores/category.ts`
- Create: `src/stores/account.ts`

- [ ] **Step 1: Create src/stores/app.ts**

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  /** 记账面板是否显示 */
  const showRecordSheet = ref(false)
  /** 当前Tab索引 */
  const currentTab = ref(0)

  function toggleRecordSheet() {
    showRecordSheet.value = !showRecordSheet.value
  }

  function openRecordSheet() {
    showRecordSheet.value = true
  }

  function closeRecordSheet() {
    showRecordSheet.value = false
  }

  function setCurrentTab(index: number) {
    currentTab.value = index
  }

  return {
    showRecordSheet,
    currentTab,
    toggleRecordSheet,
    openRecordSheet,
    closeRecordSheet,
    setCurrentTab,
  }
})
```

- [ ] **Step 2: Create src/stores/category.ts**

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '@/types/transaction'

/** 默认支出分类 */
const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'cat-food', name: '餐饮', icon: '🍜', type: 'expense', color: '#FAF0E6', sortOrder: 0, isDefault: true },
  { id: 'cat-transport', name: '交通', icon: '🚕', type: 'expense', color: '#E8F0E8', sortOrder: 1, isDefault: true },
  { id: 'cat-housing', name: '居住', icon: '🏠', type: 'expense', color: '#E8F1F5', sortOrder: 2, isDefault: true },
  { id: 'cat-shopping', name: '购物', icon: '🛍️', type: 'expense', color: '#F5E0DC', sortOrder: 3, isDefault: true },
  { id: 'cat-entertainment', name: '娱乐', icon: '🎬', type: 'expense', color: '#F5E6D3', sortOrder: 4, isDefault: true },
  { id: 'cat-communication', name: '通讯', icon: '📱', type: 'expense', color: '#E8F1F5', sortOrder: 5, isDefault: true },
  { id: 'cat-medical', name: '医疗', icon: '💊', type: 'expense', color: '#E8F0E8', sortOrder: 6, isDefault: true },
  { id: 'cat-education', name: '学习', icon: '📚', type: 'expense', color: '#E8F1F5', sortOrder: 7, isDefault: true },
  { id: 'cat-gift', name: '人情', icon: '🎁', type: 'expense', color: '#F5E6D3', sortOrder: 8, isDefault: true },
  { id: 'cat-pet', name: '宠物', icon: '🐱', type: 'expense', color: '#FAF0E6', sortOrder: 9, isDefault: true },
  { id: 'cat-other-expense', name: '其他', icon: '💰', type: 'expense', color: '#F0F0F0', sortOrder: 10, isDefault: true },
]

/** 默认收入分类 */
const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'cat-salary', name: '工资', icon: '💰', type: 'income', color: '#E8F0E8', sortOrder: 0, isDefault: true },
  { id: 'cat-bonus', name: '奖金', icon: '🎉', type: 'income', color: '#F5E6D3', sortOrder: 1, isDefault: true },
  { id: 'cat-investment-income', name: '投资', icon: '📈', type: 'income', color: '#E8F1F5', sortOrder: 2, isDefault: true },
  { id: 'cat-other-income', name: '其他', icon: '💵', type: 'income', color: '#F0F0F0', sortOrder: 3, isDefault: true },
]

export const useCategoryStore = defineStore('category', () => {
  const expenseCategories = ref<Category[]>([...DEFAULT_EXPENSE_CATEGORIES])
  const incomeCategories = ref<Category[]>([...DEFAULT_INCOME_CATEGORIES])

  function getCategoriesByType(type: 'expense' | 'income'): Category[] {
    return type === 'expense' ? expenseCategories.value : incomeCategories.value
  }

  function getCategoryById(id: string): Category | undefined {
    return [...expenseCategories.value, ...incomeCategories.value].find(c => c.id === id)
  }

  return {
    expenseCategories,
    incomeCategories,
    getCategoriesByType,
    getCategoryById,
  }
}, {
  persist: true,
})
```

- [ ] **Step 3: Create src/stores/account.ts**

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Account } from '@/types/transaction'

const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc-cmb', name: '储蓄卡', type: 'savings', bank: '招商银行', icon: '💳', balance: 6850000 },
  { id: 'acc-alipay', name: '支付宝', type: 'savings', icon: '📱', balance: 1200000 },
  { id: 'acc-wechat', name: '微信零钱', type: 'savings', icon: '💬', balance: 580000 },
  { id: 'acc-cash', name: '现金', type: 'cash', icon: '💵', balance: 820000 },
  { id: 'acc-credit', name: '信用卡', type: 'credit', bank: '招商银行', icon: '💳', balance: -1228000 },
]

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([...DEFAULT_ACCOUNTS])

  function getAccountById(id: string): Account | undefined {
    return accounts.value.find(a => a.id === id)
  }

  function getDefaultAccount(): Account {
    return accounts.value[0]
  }

  /** 更新账户余额（单位：分） */
  function updateBalance(accountId: string, deltaCents: number) {
    const acc = accounts.value.find(a => a.id === accountId)
    if (acc) {
      acc.balance += deltaCents
    }
  }

  return {
    accounts,
    getAccountById,
    getDefaultAccount,
    updateBalance,
  }
}, {
  persist: true,
})
```

- [ ] **Step 4: Create src/stores/transaction.ts**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Transaction, TransactionType } from '@/types/transaction'
import { generateId } from '@/utils/id'
import { getToday, getCurrentTime } from '@/utils/format'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>([])

  /** 添加交易记录 */
  function addTransaction(params: {
    type: TransactionType
    amount: number
    categoryId: string
    accountId: string
    toAccountId?: string
    note?: string
    tags?: string[]
    date?: string
    time?: string
  }) {
    const tx: Transaction = {
      id: generateId(),
      type: params.type,
      amount: params.amount,
      categoryId: params.categoryId,
      accountId: params.accountId,
      toAccountId: params.toAccountId,
      date: params.date || getToday(),
      time: params.time || getCurrentTime(),
      note: params.note || '',
      tags: params.tags || [],
      createdAt: Date.now(),
    }
    transactions.value.unshift(tx)
    return tx
  }

  /** 删除交易记录 */
  function deleteTransaction(id: string) {
    const idx = transactions.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      transactions.value.splice(idx, 1)
    }
  }

  /** 按月份获取交易 */
  function getTransactionsByMonth(yearMonth: string): Transaction[] {
    return transactions.value.filter(t => t.date.startsWith(yearMonth))
  }

  /** 最近N条交易 */
  function getRecentTransactions(count: number): Transaction[] {
    return transactions.value.slice(0, count)
  }

  /** 本月支出合计（分） */
  const monthlyExpense = computed(() => {
    const prefix = getToday().slice(0, 7)
    return transactions.value
      .filter(t => t.type === 'expense' && t.date.startsWith(prefix))
      .reduce((sum, t) => sum + t.amount, 0)
  })

  /** 本月收入合计（分） */
  const monthlyIncome = computed(() => {
    const prefix = getToday().slice(0, 7)
    return transactions.value
      .filter(t => t.type === 'income' && t.date.startsWith(prefix))
      .reduce((sum, t) => sum + t.amount, 0)
  })

  /** 本月结余（分） */
  const monthlyBalance = computed(() => {
    return monthlyIncome.value - monthlyExpense.value
  })

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    getTransactionsByMonth,
    getRecentTransactions,
    monthlyExpense,
    monthlyIncome,
    monthlyBalance,
  }
}, {
  persist: true,
})
```

- [ ] **Step 5: Commit**

```bash
git add src/stores/
git commit -m "feat: add Pinia stores for app state, transactions, categories, accounts"
```

---

## Task 5: Create Custom TabBar Component

**Files:**
- Create: `src/components/TabBar.vue`

- [ ] **Step 1: Create src/components/TabBar.vue**

```vue
<template>
  <view class="tabbar-wrapper">
    <view class="tabbar">
      <!-- 悬浮记账按钮 -->
      <view class="fab-record" @tap="onFabTap">
        <text class="fab-icon">+</text>
        <text class="fab-label">记账</text>
      </view>

      <!-- Tab项 -->
      <view
        v-for="(tab, index) in tabs"
        :key="tab.path"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @tap="onTabTap(index, tab.path)"
      >
        <text class="tab-icon">{{ tab.icon }}</text>
        <text class="tab-text">{{ tab.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const tabs = [
  { path: '/pages/index/index', icon: '🏠', text: '首页' },
  { path: '/pages/ai/ai', icon: '🤖', text: 'AI记账' },
  { path: '', icon: '', text: '' }, // 占位
  { path: '/pages/assets/assets', icon: '💰', text: '资产' },
  { path: '/pages/profile/profile', icon: '👤', text: '我的' },
]

const currentTab = computed(() => appStore.currentTab)

function onTabTap(index: number, path: string) {
  if (!path) return
  appStore.setCurrentTab(index)
  uni.switchTab({ url: path })
}

function onFabTap() {
  appStore.openRecordSheet()
}
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

.tabbar-wrapper {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 414px;
  z-index: 100;
  pointer-events: none;
}

.tabbar {
  position: relative;
  margin: 0 24px 16px;
  height: 68px;
  background: $surface;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: $radius-xl;
  box-shadow: $shadow-lg;
  border: 2px solid $border;
  padding: 0 $space-2;
  backdrop-filter: blur(20px);
  pointer-events: all;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-1;
  color: $text-tertiary;
  font: 700 10px/1.3 $font-sans;
  height: 52px;
  border-radius: $radius-full;
  cursor: pointer;
  transition: $transition-base;

  &.active {
    color: $brand-600;
    background: linear-gradient(135deg, $brand-100, #FAF0E6);
  }
}

.tab-icon {
  font-size: 22px;
}

.tab-text {
  font-size: 10px;
}

.fab-record {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  background: $gradient-brand;
  border-radius: $radius-circle;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: $transition-base;
  box-shadow: $shadow-brand;
  border: 4px solid $bg-primary;
  pointer-events: all;
  z-index: 101;

  &:active {
    transform: translateX(-50%) scale(0.92);
  }
}

.fab-icon {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.fab-label {
  font: 700 10px/1.3 $font-sans;
  margin-top: 2px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TabBar.vue
git commit -m "feat: add custom TabBar component with center FAB button"
```

---

## Task 6: Create SegmentedControl and RecordSheet Components

**Files:**
- Create: `src/components/SegmentedControl.vue`
- Create: `src/components/RecordSheet.vue`

- [ ] **Step 1: Create src/components/SegmentedControl.vue**

```vue
<template>
  <view class="segmented">
    <view
      v-for="(option, index) in options"
      :key="option.value"
      class="seg-item"
      :class="{ active: modelValue === option.value }"
      @tap="onTap(option.value)"
    >
      <text class="seg-text">{{ option.label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface SegOption {
  label: string
  value: string
}

defineProps<{
  options: SegOption[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function onTap(value: string) {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

.segmented {
  display: flex;
  background: $surface;
  border-radius: $radius-full;
  padding: 4px;
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

  &.active {
    background: $gradient-brand;
    box-shadow: 0 2px 8px rgba(200, 149, 108, 0.25);
  }
}

.seg-text {
  font: 700 14px/1.4 $font-sans;
  color: $text-secondary;

  .seg-item.active & {
    color: white;
  }
}
</style>
```

- [ ] **Step 2: Create src/components/RecordSheet.vue**

This is a placeholder that will be fully implemented in Phase 3.

```vue
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

      <!-- 占位提示 -->
      <view class="placeholder">
        <text class="placeholder-text">记账面板 - 开发中...</text>
        <text class="placeholder-sub">Phase 3 将实现完整功能</text>
      </view>

      <!-- 关闭按钮 -->
      <view class="close-btn" @tap="onClose">
        <text class="close-text">关闭</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import SegmentedControl from './SegmentedControl.vue'

const appStore = useAppStore()
const txType = ref('expense')

const typeOptions = [
  { label: '支出', value: 'expense' },
  { label: '收入', value: 'income' },
  { label: '转账', value: 'transfer' },
]

const visible = computed(() => appStore.showRecordSheet)
const displayAmount = ref('0.00')

function onOverlayTap() {
  appStore.closeRecordSheet()
}

function onClose() {
  appStore.closeRecordSheet()
}
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

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
  background: $surface;
  border-radius: $radius-xl $radius-xl 0 0;
  padding: $space-4 $space-6 $space-8;
  transform: translateY(100%);
  transition: transform 0.3s ease;

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
  padding: $space-6 0;
  border-bottom: 2px dashed $border;
  margin-bottom: $space-6;
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

.placeholder {
  text-align: center;
  padding: $space-10 0;
}

.placeholder-text {
  font: 700 16px/1.4 $font-sans;
  color: $text-secondary;
  display: block;
  margin-bottom: $space-2;
}

.placeholder-sub {
  font: 600 13px/1.4 $font-sans;
  color: $text-tertiary;
  display: block;
}

.close-btn {
  margin-top: $space-4;
  padding: 14px;
  border-radius: $radius-md;
  background: $bg-primary;
  text-align: center;
  cursor: pointer;

  &:active {
    background: $brand-50;
  }
}

.close-text {
  font: 700 14px/1.4 $font-sans;
  color: $text-secondary;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SegmentedControl.vue src/components/RecordSheet.vue
git commit -m "feat: add SegmentedControl and RecordSheet placeholder components"
```

---

## Task 7: Create Placeholder Pages

**Files:**
- Create: `src/pages/index/index.vue`
- Create: `src/pages/ai/ai.vue`
- Create: `src/pages/assets/assets.vue`
- Create: `src/pages/profile/profile.vue`
- Create: `src/pages/report/report.vue`
- Create: `src/pages/detail/detail.vue`
- Create: `src/pages/goals/goals.vue`
- Create: `src/pages/pending/pending.vue`

- [ ] **Step 1: Create src/pages/index/index.vue**

```vue
<template>
  <view class="app">
    <view class="page-content">
      <view class="hero">
        <text class="brand-text">🐾 GoldenPaw</text>
      </view>
      <view class="placeholder-card">
        <text class="placeholder-title">首页</text>
        <text class="placeholder-desc">余额卡片、快捷操作、周历、预算、存钱目标、最近流水</text>
      </view>
    </view>
    <TabBar />
    <RecordSheet />
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'

const appStore = useAppStore()

onShow(() => {
  appStore.setCurrentTab(0)
})
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
  padding-bottom: 100px;
}

.page-content {
  padding: $space-10 $space-6 $space-6;
}

.hero {
  margin-bottom: $space-6;
}

.brand-text {
  font: 700 20px/1.2 $font-sans;
  color: $text-primary;
}

.placeholder-card {
  @include card-emphasis;
  padding: $space-8;
  text-align: center;
}

.placeholder-title {
  @include text-h1;
  display: block;
  margin-bottom: $space-3;
}

.placeholder-desc {
  @include text-body;
  color: $text-secondary;
  display: block;
}
</style>
```

- [ ] **Step 2: Create src/pages/ai/ai.vue**

```vue
<template>
  <view class="app">
    <view class="page-content">
      <view class="placeholder-card">
        <text class="placeholder-title">AI记账</text>
        <text class="placeholder-desc">语音记账 · 票据识别 · 智能分析</text>
      </view>
    </view>
    <TabBar />
    <RecordSheet />
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'

const appStore = useAppStore()

onShow(() => {
  appStore.setCurrentTab(1)
})
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
  padding-bottom: 100px;
}

.page-content {
  padding: $space-10 $space-6 $space-6;
}

.placeholder-card {
  @include card-emphasis;
  padding: $space-8;
  text-align: center;
}

.placeholder-title {
  @include text-h1;
  display: block;
  margin-bottom: $space-3;
}

.placeholder-desc {
  @include text-body;
  color: $text-secondary;
  display: block;
}
</style>
```

- [ ] **Step 3: Create src/pages/assets/assets.vue**

```vue
<template>
  <view class="app">
    <view class="page-content">
      <view class="placeholder-card">
        <text class="placeholder-title">我的资产</text>
        <text class="placeholder-desc">净资产、资产构成、账户列表、趋势图表</text>
      </view>
    </view>
    <TabBar />
    <RecordSheet />
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'

const appStore = useAppStore()

onShow(() => {
  appStore.setCurrentTab(2)
})
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
  padding-bottom: 100px;
}

.page-content {
  padding: $space-10 $space-6 $space-6;
}

.placeholder-card {
  @include card-emphasis;
  padding: $space-8;
  text-align: center;
}

.placeholder-title {
  @include text-h1;
  display: block;
  margin-bottom: $space-3;
}

.placeholder-desc {
  @include text-body;
  color: $text-secondary;
  display: block;
}
</style>
```

- [ ] **Step 4: Create src/pages/profile/profile.vue**

```vue
<template>
  <view class="app">
    <view class="page-content">
      <view class="placeholder-card">
        <text class="placeholder-title">我的</text>
        <text class="placeholder-desc">用户信息、数据管理、个性化设置</text>
      </view>
    </view>
    <TabBar />
    <RecordSheet />
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'

const appStore = useAppStore()

onShow(() => {
  appStore.setCurrentTab(3)
})
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
  padding-bottom: 100px;
}

.page-content {
  padding: $space-10 $space-6 $space-6;
}

.placeholder-card {
  @include card-emphasis;
  padding: $space-8;
  text-align: center;
}

.placeholder-title {
  @include text-h1;
  display: block;
  margin-bottom: $space-3;
}

.placeholder-desc {
  @include text-body;
  color: $text-secondary;
  display: block;
}
</style>
```

- [ ] **Step 5: Create src/pages/report/report.vue**

```vue
<template>
  <view class="app">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">收支报表</text>
    </view>
    <view class="placeholder-card">
      <text class="placeholder-title">收支报表</text>
      <text class="placeholder-desc">趋势图表、饼图、消费排行</text>
    </view>
  </view>
</template>

<script setup lang="ts">
function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

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

.placeholder-card {
  margin: 0 $space-6;
  @include card-emphasis;
  padding: $space-8;
  text-align: center;
}

.placeholder-title {
  @include text-h1;
  display: block;
  margin-bottom: $space-3;
}

.placeholder-desc {
  @include text-body;
  color: $text-secondary;
  display: block;
}
</style>
```

- [ ] **Step 6: Create src/pages/detail/detail.vue**

```vue
<template>
  <view class="app">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">明细</text>
    </view>
    <view class="placeholder-card">
      <text class="placeholder-title">交易明细</text>
      <text class="placeholder-desc">筛选、搜索、月度分组交易列表</text>
    </view>
  </view>
</template>

<script setup lang="ts">
function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

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

.placeholder-card {
  margin: 0 $space-6;
  @include card-emphasis;
  padding: $space-8;
  text-align: center;
}

.placeholder-title {
  @include text-h1;
  display: block;
  margin-bottom: $space-3;
}

.placeholder-desc {
  @include text-body;
  color: $text-secondary;
  display: block;
}
</style>
```

- [ ] **Step 7: Create src/pages/goals/goals.vue**

```vue
<template>
  <view class="app">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">存钱与预算</text>
    </view>
    <view class="placeholder-card">
      <text class="placeholder-title">存钱目标</text>
      <text class="placeholder-desc">目标列表、预算管理</text>
    </view>
  </view>
</template>

<script setup lang="ts">
function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

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

.placeholder-card {
  margin: 0 $space-6;
  @include card-emphasis;
  padding: $space-8;
  text-align: center;
}

.placeholder-title {
  @include text-h1;
  display: block;
  margin-bottom: $space-3;
}

.placeholder-desc {
  @include text-body;
  color: $text-secondary;
  display: block;
}
</style>
```

- [ ] **Step 8: Create src/pages/pending/pending.vue**

```vue
<template>
  <view class="app">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">待确认</text>
    </view>
    <view class="placeholder-card">
      <text class="placeholder-title">待确认</text>
      <text class="placeholder-desc">自动监听记录确认、来源设置</text>
    </view>
  </view>
</template>

<script setup lang="ts">
function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
@use '@/styles/design-system' as *;

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

.placeholder-card {
  margin: 0 $space-6;
  @include card-emphasis;
  padding: $space-8;
  text-align: center;
}

.placeholder-title {
  @include text-h1;
  display: block;
  margin-bottom: $space-3;
}

.placeholder-desc {
  @include text-body;
  color: $text-secondary;
  display: block;
}
</style>
```

- [ ] **Step 9: Commit**

```bash
git add src/pages/
git commit -m "feat: add placeholder pages for all 8 routes with TabBar integration"
```

---

## Task 8: Verify Build and Dev Server

**Files:**
- None (verification only)

- [ ] **Step 1: Run H5 dev server**

Run: `cd D:/project/aiProject/GoldenPaw && npm run dev:h5`
Expected: Dev server starts, compiles without errors, shows URL (usually http://localhost:5173).

- [ ] **Step 2: Verify pages load**

Open browser to the dev server URL. Verify:
- Home page loads with TabBar visible
- TabBar has 4 tabs + center FAB button
- Clicking tabs navigates between pages
- Clicking FAB button opens RecordSheet overlay
- RecordSheet can be closed

- [ ] **Step 3: Fix any compilation errors**

If there are errors, fix them before proceeding.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verify build and fix any issues"
```

---

## Verification Checklist

After all tasks are complete, verify:

- [ ] `npm run dev:h5` starts without errors
- [ ] All 8 pages are accessible
- [ ] TabBar renders correctly on all 4 tab pages
- [ ] Center FAB button opens RecordSheet
- [ ] RecordSheet overlay can be dismissed
- [ ] Back button works on secondary pages
- [ ] SCSS variables are applied correctly (warm gold theme)
- [ ] Pinia stores are initialized (check Vue devtools)

---

*Plan version: v1.0*
*Created: 2026-05-28*
