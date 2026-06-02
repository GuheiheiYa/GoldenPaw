# GoldenPaw 项目导航

从 App.vue 延伸到所有文件的完整项目树。

```
GoldenPaw/
│
├── App.vue                          # 根组件，全局生命周期，种子数据初始化
│   ├── 引入 → styles/reset.scss
│   ├── 引入 → styles/design-system.scss
│   └── 调用 → mock/seed.ts (seedAllStores)
│
├── main.ts                          # 应用入口
│   ├── 创建 → Pinia 实例
│   ├── 注册 → pinia-plugin-persistedstate
│   └── 挂载 → App
│
├── pages.json                       # 页面路由配置（custom TabBar）
│   ├── pages/index/index            # 首页 (Tab 0)
│   ├── pages/ai/ai                  # AI记账 (Tab 1)
│   ├── pages/assets/assets          # 资产 (Tab 3)
│   ├── pages/profile/profile        # 我的 (Tab 4)
│   ├── pages/report/report          # 收支报表 (二级)
│   ├── pages/detail/detail          # 明细 (二级，支持日期筛选 + highlight)
│   ├── pages/goals/goals            # 存钱目标 (二级)
│   ├── pages/pending/pending        # 待确认 (二级)
│   ├── pages/settings/index         # 设置页面 (二级，根据type参数显示不同内容)
│   ├── pages/search/search          # 搜索页面 (二级)
│   └── pages/help/help              # 帮助页面 (二级)
│
├── pages/
│   ├── index/index.vue              # 首页
│   │   ├── 使用 → BalanceCard.vue (余额卡片)
│   │   ├── 使用 → QuickActions.vue (快捷操作)
│   │   ├── 使用 → WeekCalendar.vue (周历)
│   │   ├── 使用 → FlowItem.vue (流水列表)
│   │   ├── 使用 → TabBar.vue
│   │   ├── 使用 → RecordSheet.vue
│   │   └── 数据 → stores/transaction.ts, stores/category.ts, stores/goalBudget.ts
│   │
│   ├── ai/ai.vue                    # AI记账助手（自然语言记账 + 智能分析）
│   │   ├── 使用 → TabBar.vue
│   │   ├── 使用 → RecordSheet.vue
│   │   └── 数据 → stores/transaction.ts, stores/category.ts, stores/account.ts
│   │
│   ├── assets/assets.vue            # 我的资产
│   │   ├── 使用 → TabBar.vue
│   │   ├── 使用 → RecordSheet.vue
│   │   └── 数据 → stores/account.ts
│   │
│   ├── profile/profile.vue          # 我的
│   │   ├── 使用 → TabBar.vue
│   │   ├── 使用 → RecordSheet.vue
│   │   └── 跳转 → settings/index, help/help
│   │
│   ├── report/report.vue            # 收支报表（动态数据 + 周期切换 + 自定义范围）
│   │   ├── 使用 → DateRangePicker.vue (自定义周期)
│   │   └── 数据 → stores/transaction.ts, stores/category.ts
│   │
│   ├── detail/detail.vue            # 明细（筛选/编辑/删除/高亮）
│   │   ├── 使用 → SegmentedControl.vue (筛选)
│   │   ├── 使用 → RecordSheet.vue (编辑)
│   │   ├── 使用 → DateRangePicker.vue (日期范围筛选)
│   │   └── 数据 → stores/transaction.ts, stores/category.ts, stores/app.ts
│   │
│   ├── goals/goals.vue              # 存钱与预算（目标CRUD + 预算管理）
│   │   └── 数据 → stores/goalBudget.ts, stores/category.ts, stores/transaction.ts
│   │
│   ├── pending/pending.vue          # 待确认
│   │   └── 静态数据 (3条示例待确认记录)
│   │
│   ├── settings/index.vue           # 设置页面（通用）
│   │   ├── type=category            # 分类管理（添加/编辑/删除，默认分类不可删）
│   │   ├── type=account             # 账户管理（添加/编辑/删除）
│   │   ├── type=theme               # 主题颜色（4套配色切换）
│   │   ├── type=reminder            # 提醒设置（持久化开关）
│   │   ├── type=security            # 密码锁（设置/修改/关闭）
│   │   ├── type=currency            # 币种设置（占位）
│   │   ├── type=cycle               # 记账周期（自然月/工资/自定义）
│   │   ├── type=export              # 导出数据（CSV导出）
│   │   ├── type=import              # 导入数据（CSV 智能识别 GoldenPaw/微信/支付宝）
│   │   ├── type=sync                # 云同步（占位）
│   │   └── type=clear               # 清空数据（真实删除）
│   │
│   ├── search/search.vue            # 搜索页面（备注/分类/金额）
│   │   └── 数据 → stores/transaction.ts, stores/category.ts
│   │
│   └── help/help.vue                # 帮助页面
│       └── FAQ + 联系方式
│
├── components/
│   ├── TabBar.vue                   # 自定义底部导航栏
│   │   ├── 5个Tab项 (首页/AI记账/占位/资产/我的)
│   │   └── 中心悬浮记账按钮 → 触发 RecordSheet
│   │
│   ├── RecordSheet.vue              # 记账 BottomSheet（新建 + 编辑）
│   │   ├── 使用 → SegmentedControl.vue (支出/收入/转账)
│   │   ├── 使用 → CategoryGrid.vue (分类选择)
│   │   ├── 使用 → NumberKeyboard.vue (数字键盘)
│   │   └── 数据 → stores/transaction.ts, stores/account.ts, stores/app.ts
│   │
│   ├── NumberKeyboard.vue           # 数字键盘
│   │   └── 7/8/9/←, 4/5/6/+, 1/2/3/-, 0/./完成
│   │
│   ├── CategoryGrid.vue             # 分类选择网格
│   │   └── 数据 → stores/category.ts
│   │
│   ├── SegmentedControl.vue         # 分段控制器
│   │
│   ├── BalanceCard.vue              # 余额卡片（本月结余/收入/支出）
│   │   └── 数据 → stores/transaction.ts
│   │
│   ├── QuickActions.vue             # 快捷操作（报表/明细/存钱/待确认）
│   │   └── 跳转 → report, detail, goals, pending
│   │
│   ├── WeekCalendar.vue             # 周历组件（周一到周日）
│   │
│   ├── FlowItem.vue                 # 流水列表项
│   │
│   ├── LineChart.vue                # SVG 折线图（可复用）
│   │   └── 使用于 → report.vue, assets.vue
│   │
│   ├── PageHeader.vue               # 统一页面头部（返回 + 标题 + actions slot）
│   │   └── 使用于 → detail, report, goals, settings, help 等二级页面
│   │
│   ├── EmptyState.vue               # 统一空状态组件
│   │   └── 使用于 → detail, goals
│   │
│   ├── EmojiGrid.vue                # 统一 emoji 选择器（40个emoji）
│   │   └── 使用于 → goals.vue（新建目标）, settings/index.vue（分类/账户图标）
│   │
│   └── DateRangePicker.vue          # 通用日期范围选择弹窗
│       ├── 快捷标签：今天/昨天/近7天/近30天/本月
│       ├── 双 picker 选择开始/结束日期
│       ├── 支持 slot 触发 或 ref.open() 调用
│       └── 使用于 → detail.vue（日期筛选）, report.vue（自定义周期）
│
├── stores/
│   ├── app.ts                       # 全局UI状态（持久化）
│   │   ├── state: showRecordSheet, currentTab, editTransactionId
│   │   ├── state: reminderEnabled, budgetAlertEnabled
│   │   ├── state: theme, cycle, appPassword, currency, fingerprintEnabled
│   │   └── actions: openRecordSheet, closeRecordSheet, setCurrentTab, editTransaction, clearEdit
│   │
│   ├── transaction.ts               # 交易记录 store（持久化）
│   │   ├── state: transactions[]
│   │   ├── actions: addTransaction, deleteTransaction, updateTransaction
│   │   └── getters: monthlyExpense, monthlyIncome, monthlyBalance
│   │
│   ├── category.ts                  # 分类管理 store（持久化）
│   │   ├── state: expenseCategories[], incomeCategories[]
│   │   └── actions: getCategoriesByType, getCategoryById
│   │
│   ├── account.ts                   # 账户管理 store（持久化）
│   │   ├── state: accounts[]
│   │   └── actions: getAccountById, getDefaultAccount, updateBalance
│   │
│   └── goalBudget.ts                # 存钱目标 + 预算管理 store（持久化）
│       ├── state: goals[], budgets[]
│       ├── actions: addGoal, updateGoal, deleteGoal, depositToGoal
│       ├── actions: addBudget, updateBudget, deleteBudget
│       └── getters: budgetUsage, totalBudget, totalBudgetUsed
│
├── types/
│   └── transaction.ts               # Transaction, Category, Account, Goal, Budget 接口
│
├── utils/
│   ├── format.ts                    # formatAmount(支持多币种符号), formatDate, getToday, getCurrentTime
│   ├── csvImport.ts                 # CSV 智能导入：识别 GoldenPaw/微信/支付宝格式
│   ├── id.ts                        # generateId
│   └── date.ts                      # getDaysAgo
│
├── mock/
│   └── seed.ts                      # 种子数据（17条示例交易）
│
├── styles/
│   ├── design-system.scss           # Design Tokens（颜色/字体/间距/阴影）
│   ├── mixins.scss                  # 可复用 mixin
│   └── reset.scss                   # CSS 重置
│
├── screenshots/                     # 浏览器截图
│   ├── home.png                     # 首页
│   ├── detail.png                   # 明细页
│   ├── assets.png                   # 资产页
│   ├── report.png                   # 报表页
│   └── record-sheet.png             # 记账面板
│
├── docs/
│   ├── design.md                    # 设计文档
│   ├── requirements.md              # 需求文档（[R-xxx] ID）
│   ├── features.md                  # 功能实现文档（[F-xxx] ID，与需求一一对应）
│   ├── changelog.md                 # 更新日志（每次提交批次，关联 R-xxx / ISS-xxx）
│   ├── issues.md                    # 问题追踪（[ISS-xxx] ID，分 open/closed）
│   ├── git-commits.md               # Git 提交索引（commit ↔ 需求映射，回退指南）
│   ├── navigation.md                # 项目导航（本文件）
│   └── superpowers/plans/           # 实现计划
│
└── design/                          # HTML 原型文件
    ├── 首页.html
    ├── AI记账.html
    ├── 资产.html
    ├── 我的.html
    ├── 收支报表.html
    ├── 明细.html
    └── 二级页面.html
```

---

## 页面间导航关系

```
首页 (Tab 0)
  ├── 点击"报表"胶囊 → /pages/report/report
  ├── 点击"明细"胶囊 → /pages/detail/detail
  ├── 点击"存钱"胶囊 → /pages/goals/goals
  ├── 点击"待确认"胶囊 → /pages/pending/pending
  ├── 点击搜索图标 → /pages/search/search
  ├── 点击日历日期 → /pages/detail/detail?date=YYYY-MM-DD
  ├── 点击流水项 → /pages/detail/detail?highlight=id
  ├── 点击"管理" → /pages/goals/goals?tab=budget
  └── 点击 + 号按钮 → 弹出 RecordSheet

AI记账 (Tab 1)
  └── 点击 + 号按钮 → 弹出 RecordSheet

资产 (Tab 3)
  └── 点击 + 号按钮 → 弹出 RecordSheet

我的 (Tab 4)
  ├── 点击设置菜单 → /pages/settings/index?type=xxx
  ├── 点击帮助 → /pages/help/help
  └── 点击 + 号按钮 → 弹出 RecordSheet

明细页
  └── 点击搜索 → /pages/search/search

搜索页
  └── 点击结果项 → /pages/detail/detail?highlight=id
```

---

*文档版本：v4.0*
*更新时间：2026-06-02 10:33:56*
