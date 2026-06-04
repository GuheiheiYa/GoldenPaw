# GoldenPaw 项目设计文档

## 一、项目概述

GoldenPaw（金爪）是一款个人资产管理APP，核心功能包括记账、存钱、资产追踪。采用 uni-app (Vue3 + Vite + TypeScript) 跨端开发，支持 iOS/Android/微信小程序/H5。

### 1.1 技术栈

| 层级 | 技术方案 | 说明 |
|------|---------|------|
| 框架 | uni-app (Vue3 + Vite + TypeScript) | 跨端开发，开发体验好 |
| UI 组件 | Vant 4 + 自定义组件 | NumberKeyboard、SwipeCell、Calendar |
| 图标 | Iconfont + Phosphor Icons | 分类图标用 Iconfont，系统图标用 Phosphor |
| 图表 | uCharts | 跨端图表，支持饼图/折线/柱状/环形 |
| 状态管理 | Pinia + pinia-plugin-persistedstate | 本地持久化，离线优先 |
| 本地存储 | uni.setStorageSync | 配置用 Storage，交易数据存 Pinia persist |
| 云服务 | Supabase | Auth（邮箱登录）+ Database（云同步/Profiles） |
| AI | DeepSeek API | 自然语言记账、智能分析 |

### 1.2 设计规范

遵循 `GoldenPaw_Design_System_v1.md` 中定义的完整设计系统，包括：
- 色彩系统（品牌色 #C8956C 暖金色系）
- 字体系统（系统字体栈，800字重用于金额）
- 间距系统（4px基础单位）
- 圆角/阴影/边框规范
- 组件规范（按钮、卡片、输入框、列表、导航）
- 状态规范（Default/Hover/Active/Selected/Disabled）
- 文案语气规范（友好专业、鼓励成长）

---

## 二、页面架构

### 2.1 页面清单

#### TabBar 主页面（4个Tab + 中心悬浮按钮）

| 页面 | 路由 | 来源HTML | 说明 |
|------|------|---------|------|
| 首页 | `/pages/index/index` | `首页.html` | 余额卡片、快捷操作、周历、预算、存钱目标、最近流水 |
| AI记账 | `/pages/ai/ai` | `AI记账.html` | 语音/聊天/票据识别/智能分析，聊天式界面 |
| 资产 | `/pages/assets/assets` | `资产.html` | 净资产、资产构成环形图、账户列表、趋势图表 |
| 我的 | `/pages/profile/profile` | `我的.html` | 用户卡片、数据管理、个性化设置、关于 |
| **记账** | `组件（BottomSheet）` | **新建** | 导航栏中间+号按钮，底部弹出记账面板 |

#### 二级页面（从首页胶囊进入）

| 页面 | 路由 | 来源HTML | 说明 |
|------|------|---------|------|
| 收支报表 | `/pages/report/report` | `收支报表.html` | 趋势柱状图、饼图、消费排行TOP5 |
| 明细 | `/pages/detail/detail` | `明细.html` | 筛选Tab、月度分组交易列表 |
| 存钱目标 | `/pages/goals/goals` | `二级页面.html` | 存钱目标列表、预算管理（Segmented切换） |
| 待确认 | `/pages/pending/pending` | `二级页面.html` | 自动监听的消费记录确认、来源设置 |

### 2.2 TabBar 设计

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐   │
│  │ 首页  │  │AI记账│  │ 资产  │  │ 我的  │   │
│  └──────┘  └──────┘  └──────┘  └──────┘   │
│         ┌─────────────────────┐            │
│         │    ✚ 记账（悬浮）    │            │
│         │   gradient-brand    │            │
│         │   64x64 圆形        │            │
│         └─────────────────────┘            │
└─────────────────────────────────────────────┘
```

- 4个Tab项：首页、AI记账、资产、我的
- 中心悬浮按钮：64x64圆形，gradient-brand背景，点击弹出记账BottomSheet
- 使用自定义TabBar组件（非uni-app原生），因为需要中心悬浮按钮

---

## 三、记账 BottomSheet 详细设计

### 3.1 交互流程

```
用户点击 + 号按钮
    ↓
底部弹出记账面板（动画 0.3s ease）
    ↓
默认：支出模式，金额 ¥0.00
    ↓
用户操作：
  1. 输入金额（数字键盘）
  2. 选择分类（分类网格）
  3. 切换类型（支出/收入/转账）
  4. 填写备注（可选）
  5. 选择日期（默认今天）
  6. 选择账户（默认常用账户）
    ↓
点击"完成"按钮
    ↓
保存交易记录 → 关闭面板 → 刷新首页流水列表
```

### 3.2 面板布局

```
┌─────────────────────────────────────┐
│  ─── 拖拽手柄 (16x4, border色) ───  │
│                                     │
│  ┌─────────┬─────────┬─────────┐   │
│  │  支出    │  收入    │  转账   │   │  ← Segmented 控制器
│  └─────────┴─────────┴─────────┘   │
│                                     │
│  ¥ 0.00                             │  ← 金额显示区 (text-hero: 40px, 800)
│  ─────────────────────────────────  │  ← 2px dashed border
│                                     │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐   │  ← 分类网格
│  │🍜│ │🚕│ │🏠│ │🛍│ │🎬│ │📱│   │     2行可滚动
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘   │     48x48 图标
│  餐饮  交通  居住  购物  娱乐  通讯   │     选中态: brand边框+brand-50背景
│                                     │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐   │
│  │💊│ │📚│ │🎁│ │🐱│ │💰│ │···│   │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘   │
│  医疗  学习  人情  宠物  其他  更多   │
│                                     │
│  📅 今天   💳 招商银行   🏷️ 标签   │  ← 附加信息行
│  备注：_________________________    │  ← 备注输入框
│                                     │
│  ┌───┬───┬───┬────┐               │
│  │ 7 │ 8 │ 9 │ ←  │               │  ← 数字键盘
│  ├───┼───┼───┼────┤               │     自定义实现
│  │ 4 │ 5 │ 6 │ +  │               │     支持小数点
│  ├───┼───┼───┼────┤               │     最大12位
│  │ 1 │ 2 │ 3 │ -  │               │
│  ├───┼───┼───┼────┤               │
│  │ 0 │ . │完成│    │               │  ← 完成按钮: gradient-brand
│  └───┴───┴───┴────┘               │
└─────────────────────────────────────┘
```

### 3.3 数据模型

```typescript
// 交易记录
interface Transaction {
  id: string                    // UUID
  type: 'expense' | 'income' | 'transfer'  // 类型
  amount: number                // 金额（分）
  categoryId: string            // 分类ID
  accountId: string             // 账户ID
  toAccountId?: string          // 转入账户（转账时）
  date: string                  // YYYY-MM-DD
  time: string                  // HH:mm
  note: string                  // 备注
  tags: string[]                // 标签
  createdAt: number             // 创建时间戳
  updatedAt?: number            // 更新时间戳
}

// 分类
interface Category {
  id: string
  name: string
  icon: string                  // emoji 或图标名
  type: 'expense' | 'income'
  color: string                 // 背景色
  sortOrder: number
  isDefault: boolean
}

// 账户
interface Account {
  id: string
  name: string
  type: 'savings' | 'credit' | 'investment' | 'cash'
  bank?: string
  icon: string
  balance: number               // 余额（分）
}

// 存钱目标
interface Goal {
  id: string
  icon: string                  // emoji
  name: string
  targetAmount: number          // 目标金额（分）
  savedAmount: number           // 已存金额（分）
  deadline?: string             // YYYY-MM-DD
}

// 预算
interface Budget {
  id: string
  categoryId: string            // 关联分类ID
  amount: number                // 月度限额（分）
}
```

---

## 四、项目目录结构

```
GoldenPaw/
├── docs/                           # 文档目录
│   ├── 需求文档.md                  # 功能需求（已完成/未完成）
│   ├── 功能文档.md                  # 已实现功能详细说明
│   ├── 更新日志.md                  # 变更记录（精确到秒）
│   ├── 项目导航.md                  # 项目文件树导航
│   └── 设计文档.md                  # 本文档
├── src/
│   ├── pages/                      # 页面目录
│   │   ├── index/
│   │   │   └── index.vue           # 首页（Tab）
│   │   ├── ai/
│   │   │   └── ai.vue              # AI记账（Tab）
│   │   ├── assets/
│   │   │   └── assets.vue          # 资产（Tab）
│   │   ├── profile/
│   │   │   └── profile.vue         # 我的（Tab）
│   │   ├── report/
│   │   │   └── report.vue          # 收支报表（二级）
│   │   ├── detail/
│   │   │   └── detail.vue          # 明细（二级）
│   │   ├── goals/
│   │   │   └── goals.vue           # 存钱目标（二级）
│   │   ├── pending/
│   │   │   └── pending.vue         # 待确认（二级）
│   │   ├── settings/
│   │   │   └── index.vue           # 设置页面（二级，type参数）
│   │   ├── search/
│   │   │   └── search.vue          # 搜索页面（二级）
│   │   └── help/
│   │       └── help.vue            # 帮助页面（二级）
│   ├── components/                 # 公共组件
│   │   ├── TabBar.vue              # 自定义底部导航栏
│   │   ├── RecordSheet.vue         # 记账 BottomSheet（新建+编辑）
│   │   ├── NumberKeyboard.vue      # 数字键盘
│   │   ├── CategoryGrid.vue        # 分类选择网格
│   │   ├── FlowItem.vue            # 流水列表项
│   │   ├── BalanceCard.vue         # 余额卡片
│   │   ├── QuickActions.vue        # 快捷操作胶囊
│   │   ├── WeekCalendar.vue        # 周历组件
│   │   └── SegmentedControl.vue    # 分段控制器
│   ├── stores/                     # Pinia 状态管理
│   │   ├── transaction.ts          # 交易记录 store（CRUD + 月度统计）
│   │   ├── category.ts             # 分类管理 store（只读）
│   │   ├── account.ts              # 账户管理 store（余额更新）
│   │   ├── goalBudget.ts           # 存钱目标 + 预算 store（CRUD）
│   │   └── app.ts                  # 全局应用状态（Tab/Sheet/编辑模式/提醒开关）
│   ├── styles/                     # 全局样式
│   │   ├── design-system.scss      # Design Tokens（从设计文档提取）
│   │   ├── mixins.scss             # 常用 mixin
│   │   └── reset.scss              # 样式重置
│   ├── types/                      # TypeScript 类型
│   │   ├── transaction.ts
│   │   ├── category.ts
│   │   └── account.ts
│   ├── utils/                      # 工具函数
│   │   ├── format.ts               # 金额/日期格式化
│   │   ├── storage.ts              # 本地存储封装
│   │   └── id.ts                   # UUID 生成
│   ├── static/                     # 静态资源
│   │   ├── icons/                  # 图标文件
│   │   └── images/                 # 图片文件
│   ├── App.vue                     # 根组件
│   ├── main.ts                     # 入口文件
│   ├── pages.json                  # 页面路由配置
│   ├── manifest.json               # 应用配置
│   └── uni.scss                    # uni-app 全局样式变量
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 五、pages.json 配置

```json
{
  "pages": [
    { "path": "pages/index/index", "style": { "navigationStyle": "custom" } },
    { "path": "pages/ai/ai", "style": { "navigationStyle": "custom" } },
    { "path": "pages/assets/assets", "style": { "navigationStyle": "custom" } },
    { "path": "pages/profile/profile", "style": { "navigationStyle": "custom" } },
    { "path": "pages/report/report", "style": { "navigationStyle": "custom" } },
    { "path": "pages/detail/detail", "style": { "navigationStyle": "custom" } },
    { "path": "pages/goals/goals", "style": { "navigationStyle": "custom" } },
    { "path": "pages/pending/pending", "style": { "navigationStyle": "custom" } }
  ],
  "tabBar": {
    "custom": true,
    "list": [
      { "pagePath": "pages/index/index", "text": "首页" },
      { "pagePath": "pages/ai/ai", "text": "AI记账" },
      { "pagePath": "pages/assets/assets", "text": "资产" },
      { "pagePath": "pages/profile/profile", "text": "我的" }
    ]
  }
}
```

---

## 六、开发顺序

### Phase 1：项目骨架
1. 初始化 uni-app 项目
2. 安装依赖（Vant 4、Pinia、uCharts）
3. 配置 Design System（SCSS变量）
4. 实现自定义 TabBar
5. 配置 pages.json 路由

### Phase 2：核心页面
6. 首页（index）- 余额卡片、快捷操作、最近流水
7. 明细页（detail）- 交易列表
8. 资产页（assets）- 净资产、账户列表

### Phase 3：记账功能
9. 记账 BottomSheet（RecordSheet）
10. 数字键盘（NumberKeyboard）
11. 分类选择（CategoryGrid）
12. Pinia Store 实现

### Phase 4：辅助页面
13. AI记账页（ai）
14. 我的页（profile）
15. 收支报表（report）
16. 存钱目标（goals）
17. 待确认（pending）

### Phase 5：完善
18. 页面间数据联动
19. 本地持久化
20. 动画和交互优化

---

## 七、关键实现细节

### 7.1 自定义 TabBar

由于需要中心悬浮按钮，必须使用自定义TabBar：
- 使用 `uni.hideTabBar()` 隐藏原生TabBar
- 创建 `components/TabBar.vue` 组件
- 在每个Tab页面中引入该组件
- 中心按钮点击触发 `RecordSheet` 显示

### 7.2 记账 BottomSheet

- 使用 `v-model` 控制显示/隐藏
- 底部弹出动画（transform + transition）
- 遮罩层点击关闭
- 拖拽手柄支持下拉关闭
- 数字键盘自定义实现（避免系统键盘）
- 分类网格水平滚动

### 7.3 数据持久化

- Pinia + pinia-plugin-persistedstate 自动持久化到 localStorage
- 交易数据量大时考虑 SQLite（uni-app 插件市场有 better-sqlite）
- 配置数据用 uni.setStorageSync

---

*文档版本：v2.0*
*更新时间：2026-05-29 22:00*
