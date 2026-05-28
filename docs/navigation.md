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
│   ├── pages/assets/assets          # 资产 (Tab 2)
│   ├── pages/profile/profile        # 我的 (Tab 3)
│   ├── pages/report/report          # 收支报表 (二级)
│   ├── pages/detail/detail          # 明细 (二级，支持日期筛选)
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
│   │   └── 数据 → stores/transaction.ts, stores/category.ts
│   │
│   ├── ai/ai.vue                    # AI记账助手
│   │   ├── 使用 → TabBar.vue
│   │   └── 使用 → RecordSheet.vue
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
│   ├── report/report.vue            # 收支报表
│   │   └── 数据 → stores/transaction.ts
│   │
│   ├── detail/detail.vue            # 明细
│   │   ├── 使用 → SegmentedControl.vue (筛选)
│   │   └── 数据 → stores/transaction.ts, stores/category.ts
│   │
│   ├── goals/goals.vue              # 存钱与预算
│   │   └── 使用 → SegmentedControl.vue (切换)
│   │
│   ├── pending/pending.vue          # 待确认
│   │   └── 静态数据 (3条示例待确认记录)
│   │
│   ├── settings/index.vue           # 设置页面（通用）
│   │   ├── type=category            # 分类管理
│   │   ├── type=account             # 账户管理
│   │   ├── type=theme               # 主题颜色
│   │   ├── type=reminder            # 提醒设置
│   │   ├── type=security            # 密码/指纹锁
│   │   ├── type=currency            # 币种设置
│   │   ├── type=cycle               # 记账周期
│   │   ├── type=export              # 导出数据
│   │   ├── type=import              # 导入数据
│   │   ├── type=sync                # 云同步
│   │   └── type=clear               # 清空数据
│   │
│   ├── search/search.vue            # 搜索页面
│   │   └── 数据 → stores/transaction.ts, stores/category.ts
│   │
│   └── help/help.vue                # 帮助页面
│       └── FAQ + 联系方式
│
├── components/
│   ├── TabBar.vue                   # 自定义底部导航栏
│   │   ├── 4个Tab项 (首页/AI记账/资产/我的)
│   │   └── 中心悬浮记账按钮 → 触发 RecordSheet
│   │
│   ├── RecordSheet.vue              # 记账 BottomSheet（完整功能）
│   │   ├── 使用 → SegmentedControl.vue (支出/收入/转账)
│   │   ├── 使用 → CategoryGrid.vue (分类选择)
│   │   ├── 使用 → NumberKeyboard.vue (数字键盘)
│   │   └── 数据 → stores/transaction.ts (保存交易)
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
│   └── FlowItem.vue                 # 流水列表项
│
├── stores/
│   ├── app.ts                       # 全局状态
│   │   ├── state: showRecordSheet, currentTab
│   │   └── actions: openRecordSheet, closeRecordSheet, setCurrentTab
│   │
│   ├── transaction.ts               # 交易记录 store（持久化）
│   │   ├── state: transactions[]
│   │   ├── actions: addTransaction, deleteTransaction
│   │   └── getters: monthlyExpense, monthlyIncome, monthlyBalance
│   │
│   ├── category.ts                  # 分类管理 store（持久化）
│   │   ├── state: expenseCategories[], incomeCategories[]
│   │   └── actions: getCategoriesByType, getCategoryById
│   │
│   └── account.ts                   # 账户管理 store（持久化）
│       ├── state: accounts[]
│       └── actions: getAccountById, getDefaultAccount, updateBalance
│
├── types/
│   └── transaction.ts               # Transaction, Category, Account 接口
│
├── utils/
│   ├── format.ts                    # formatAmount, formatDate, getToday, getCurrentTime
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
│   ├── requirements.md              # 需求文档
│   ├── features.md                  # 功能文档
│   ├── changelog.md                 # 更新日志
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
  └── 点击 + 号按钮 → 弹出 RecordSheet

AI记账 (Tab 1)
  └── 点击 + 号按钮 → 弹出 RecordSheet

资产 (Tab 2)
  └── 点击 + 号按钮 → 弹出 RecordSheet

我的 (Tab 3)
  └── 点击 + 号按钮 → 弹出 RecordSheet
```

---

*文档版本：v2.0*
*更新时间：2026-05-28*
