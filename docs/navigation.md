# GoldenPaw 项目导航

从 App.vue 延伸到所有文件的完整项目树。

```
GoldenPaw/
│
├── App.vue                          # 根组件，全局生命周期
│   ├── 引入 → styles/design-system.scss
│   ├── 引入 → stores/ (Pinia)
│   └── 子组件 → TabBar.vue (在各页面中使用)
│
├── main.ts                          # 应用入口
│   ├── 创建 → Pinia 实例
│   ├── 注册 → Vant 4 组件
│   └── 挂载 → App
│
├── pages.json                       # 页面路由配置
│   ├── pages/index/index            # 首页 (Tab)
│   ├── pages/ai/ai                  # AI记账 (Tab)
│   ├── pages/assets/assets          # 资产 (Tab)
│   ├── pages/profile/profile        # 我的 (Tab)
│   ├── pages/report/report          # 收支报表 (二级)
│   ├── pages/detail/detail          # 明细 (二级)
│   ├── pages/goals/goals            # 存钱目标 (二级)
│   └── pages/pending/pending        # 待确认 (二级)
│
├── pages/
│   ├── index/index.vue              # 首页
│   │   ├── 使用 → BalanceCard.vue
│   │   ├── 使用 → TabBar.vue
│   │   ├── 使用 → RecordSheet.vue
│   │   ├── 使用 → stores/transaction.ts
│   │   └── 跳转 → report, detail, goals, pending
│   │
│   ├── ai/ai.vue                    # AI记账
│   │   ├── 使用 → TabBar.vue
│   │   └── 使用 → RecordSheet.vue
│   │
│   ├── assets/assets.vue            # 资产
│   │   ├── 使用 → TabBar.vue
│   │   ├── 使用 → RecordSheet.vue
│   │   └── 使用 → stores/account.ts
│   │
│   ├── profile/profile.vue          # 我的
│   │   ├── 使用 → TabBar.vue
│   │   └── 使用 → RecordSheet.vue
│   │
│   ├── report/report.vue            # 收支报表
│   │   └── 使用 → stores/transaction.ts
│   │
│   ├── detail/detail.vue            # 明细
│   │   ├── 使用 → FlowItem.vue
│   │   └── 使用 → stores/transaction.ts
│   │
│   ├── goals/goals.vue              # 存钱目标
│   │   └── 使用 → GoalCard.vue, BudgetCard.vue
│   │
│   └── pending/pending.vue          # 待确认
│       └── 使用 → stores/transaction.ts
│
├── components/
│   ├── TabBar.vue                   # 自定义底部导航栏
│   │   ├── 4个Tab项 (首页/AI记账/资产/我的)
│   │   └── 中心悬浮记账按钮 → 触发 RecordSheet
│   │
│   ├── RecordSheet.vue              # 记账 BottomSheet
│   │   ├── 使用 → SegmentedControl.vue (支出/收入/转账)
│   │   ├── 使用 → CategoryGrid.vue (分类选择)
│   │   ├── 使用 → NumberKeyboard.vue (数字键盘)
│   │   └── 使用 → stores/transaction.ts (保存交易)
│   │
│   ├── NumberKeyboard.vue           # 数字键盘
│   │   └── 0-9, 小数点, 退格, +/-
│   │
│   ├── CategoryGrid.vue             # 分类选择网格
│   │   └── 使用 → stores/category.ts
│   │
│   ├── SegmentedControl.vue         # 分段控制器
│   │
│   ├── FlowItem.vue                 # 流水列表项
│   │
│   ├── BalanceCard.vue              # 余额卡片
│   │
│   ├── GoalCard.vue                 # 存钱目标卡片
│   │
│   └── BudgetCard.vue               # 预算卡片
│
├── stores/
│   ├── transaction.ts               # 交易记录 store
│   │   ├── state: transactions[]
│   │   ├── actions: addTransaction, deleteTransaction, updateTransaction
│   │   └── getters: monthlyIncome, monthlyExpense, recentTransactions
│   │
│   ├── category.ts                  # 分类管理 store
│   │   ├── state: expenseCategories[], incomeCategories[]
│   │   └── actions: addCategory, updateCategory
│   │
│   ├── account.ts                   # 账户管理 store
│   │   ├── state: accounts[]
│   │   └── actions: addAccount, updateBalance
│   │
│   └── app.ts                       # 全局状态
│       ├── state: currentMonth, showRecordSheet
│       └── actions: toggleRecordSheet
│
├── styles/
│   ├── design-system.scss           # Design Tokens (颜色/字体/间距/圆角/阴影)
│   ├── mixins.scss                  # 常用 mixin (text-hero, gradient-brand 等)
│   └── reset.scss                   # 样式重置
│
├── types/
│   ├── transaction.ts               # Transaction 接口定义
│   ├── category.ts                  # Category 接口定义
│   └── account.ts                   # Account 接口定义
│
├── utils/
│   ├── format.ts                    # formatAmount, formatDate, formatTime
│   ├── storage.ts                   # uni.setStorageSync 封装
│   └── id.ts                        # generateId (UUID)
│
├── static/
│   ├── icons/                       # 图标文件
│   └── images/                      # 图片文件
│
├── docs/
│   ├── 需求文档.md
│   ├── 功能文档.md
│   ├── 更新日志.md
│   ├── 项目导航.md
│   └── 设计文档.md
│
└── README.md
```

---

## 页面间导航关系

```
首页 (Tab)
  ├── 点击"报表"胶囊 → 收支报表页
  ├── 点击"明细"胶囊 → 明细页
  ├── 点击"存钱"胶囊 → 存钱目标页
  ├── 点击"待确认"胶囊 → 待确认页
  ├── 点击"最近流水" → 明细页
  └── 点击 + 号按钮 → 弹出记账 BottomSheet

AI记账 (Tab)
  └── 点击 + 号按钮 → 弹出记账 BottomSheet

资产 (Tab)
  └── 点击 + 号按钮 → 弹出记账 BottomSheet

我的 (Tab)
  └── 点击 + 号按钮 → 弹出记账 BottomSheet
```

---

*文档版本：v1.0*
*创建时间：2026-05-28*
