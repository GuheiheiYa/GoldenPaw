# GoldenPaw 功能文档

记录每个已实现功能的详细说明，包括实现方式、数据来源、关联文件等。

---

## 功能记录模板

```markdown
### [功能名称]

**实现时间**: YYYY-MM-DD HH:mm:ss
**状态**: 已完成 / 开发中

**功能描述**:
简要描述功能用途。

**实现方式**:
- 技术方案说明
- 关键组件/方法说明
- 数据流说明

**关联文件**:
- `src/pages/xxx/xxx.vue` - 页面文件
- `src/components/xxx.vue` - 组件文件
- `src/stores/xxx.ts` - 状态管理
- `src/utils/xxx.ts` - 工具函数

**数据来源**:
- 本地存储 / API接口 / 用户输入

**注意事项**:
- 已知限制
- 待优化点
```

---

### 首页

**实现时间**: 2026-05-28
**状态**: 已完成
**最后更新**: 2026-05-29（预算/目标接入 store）

**功能描述**:
应用主页面，展示资产概览、快捷操作、周历、预算进度、存钱目标和最近流水。

**实现方式**:
- `BalanceCard.vue` 读取 `transactionStore.monthlyIncome/Expense/Balance`
- `WeekCalendar.vue` 本地计算本周日期，点击跳转明细页
- `FlowItem.vue` 读取最近 8 条交易，按分类映射图标和背景色
- 预算卡片从 `goalBudgetStore.budgetUsage` 动态读取（最多 3 个）
- 目标卡片从 `goalBudgetStore.goals` 动态读取（最多 3 个）

**关联文件**:
- `src/pages/index/index.vue`
- `src/components/BalanceCard.vue`
- `src/components/QuickActions.vue`
- `src/components/WeekCalendar.vue`
- `src/components/FlowItem.vue`
- `src/stores/transaction.ts`
- `src/stores/goalBudget.ts`

**数据来源**:
- `transactionStore`（流水、收支统计）
- `goalBudgetStore`（预算配置、目标配置）
- `categoryStore`（分类图标/名称映射）

**注意事项**:
- 预算 used 按当前月份实时计算，无需手动刷新

---

### 记账 BottomSheet

**实现时间**: 2026-05-28
**状态**: 已完成
**最后更新**: 2026-05-29（支持编辑模式）

**功能描述**:
底部弹出面板，支持创建和编辑交易记录。包含金额输入、分类选择、收支类型切换、日期/账户选择、备注输入。

**实现方式**:
- `NumberKeyboard.vue` 自定义数字键盘（支持 +/- 和退格）
- `CategoryGrid.vue` 从 `categoryStore` 读取分类列表
- `RecordSheet.vue` 管理表单状态：金额、分类、类型、日期、账户、备注
- 新建模式：调用 `transactionStore.addTransaction()` + `accountStore.updateBalance()`
- 编辑模式：通过 `appStore.editingTransactionId` 加载数据，调用 `transactionStore.updateTransaction()`
- 关闭时重置表单并 `clearEdit()`

**关联文件**:
- `src/components/RecordSheet.vue`
- `src/components/NumberKeyboard.vue`
- `src/components/CategoryGrid.vue`
- `src/components/SegmentedControl.vue`
- `src/stores/transaction.ts`
- `src/stores/account.ts`
- `src/stores/app.ts`

**数据来源**:
- 用户输入（金额、备注、日期）
- `categoryStore`（分类列表）
- `accountStore`（账户列表、余额更新）

**注意事项**:
- 编辑交易时不修改账户余额（避免重复计算）
- 金额单位：UI 显示元，存储为分（cents）
- 日期/账户/标签选择器目前为占位实现

---

### 明细页

**实现时间**: 2026-05-28
**状态**: 已完成
**最后更新**: 2026-05-29（日期范围筛选重构）

**功能描述**:
交易列表页面，支持按日分组、类型筛选、日期范围筛选、交易编辑和删除。

**实现方式**:
- `SegmentedControl.vue` 筛选全部/支出/收入/转账
- 交易按日分组，组内按日期时间降序
- 日期筛选：点击搜索图标直接弹出底部弹窗，支持快捷标签（今天/昨天/近7天/近30天/本月）+ 开始/结束日期双 picker
- 支持 URL 参数：`date=YYYY-MM-DD` 或 `date=start,end` 按日期/范围筛选
- 支持 URL 参数：`highlight=id` 高亮指定交易（3 秒后自动清除）
- 点击交易 → `appStore.editTransaction()` → 打开 `RecordSheet` 编辑
- 长按交易 → `uni.showModal` 确认 → `transactionStore.deleteTransaction()`
- 左滑删除：touch 事件 + translateX 动画，滑动超过阈值直接弹出删除确认

**关联文件**:
- `src/pages/detail/detail.vue`
- `src/components/SegmentedControl.vue`
- `src/components/RecordSheet.vue`
- `src/stores/transaction.ts`
- `src/stores/category.ts`
- `src/stores/app.ts`

**数据来源**:
- `transactionStore.transactions`（完整交易列表）
- `categoryStore`（分类图标/名称映射）

**注意事项**:
- 日期筛选值格式为单日期 `YYYY-MM-DD` 或范围 `YYYY-MM-DD,YYYY-MM-DD`
- 筛选状态条显示当前条件，点击 ✕ 可快速清空

---

### 搜索页

**实现时间**: 2026-05-28
**状态**: 已完成
**最后更新**: 2026-05-29（金额搜索逻辑修复）

**功能描述**:
按关键词搜索交易记录，支持备注、分类名称、金额匹配。

**实现方式**:
- `keyword` 实时过滤 `transactionStore.transactions`
- 匹配规则：备注（大小写不敏感）、分类名称、金额（元/分/格式化三种形式）
- 搜索结果点击跳转 `detail.vue?highlight=id`

**关联文件**:
- `src/pages/search/search.vue`
- `src/stores/transaction.ts`
- `src/stores/category.ts`

**数据来源**:
- `transactionStore.transactions`
- `categoryStore`

**注意事项**:
- 金额搜索同时匹配 `amount/100`（元）、`amount`（分）、`(amount/100).toFixed(2)`（格式化）

---

### 收支报表

**实现时间**: 2026-05-28
**状态**: 已完成
**最后更新**: 2026-05-29（全面接入真实数据）

**功能描述**:
展示收支趋势、分类占比和消费排行的统计报表页面。

**实现方式**:
- 周期切换：本周/本月/本季/本年，通过 `filteredTransactions` computed 动态过滤
- 柱状图：按日聚合收入/支出，CSS `linear-gradient` 动态高度渲染
- 饼图：按分类聚合支出/收入，CSS `conic-gradient` 动态角度渲染
- 排行列表：按分类汇总金额，倒序排列 TOP 5
- 汇总卡片：动态计算周期内总收入/总支出

**关联文件**:
- `src/pages/report/report.vue`
- `src/stores/transaction.ts`
- `src/stores/category.ts`

**数据来源**:
- `transactionStore.transactions`（全部交易记录）
- `categoryStore`（分类名称/图标/颜色）

**注意事项**:
- 柱状图、饼图使用纯 CSS 实现（`linear-gradient` / `conic-gradient`），非图表库
- 饼图中心文字根据当前选中类型（支出/收入）动态变化

---

### AI 记账

**实现时间**: 2026-05-28
**状态**: 已完成（核心功能）
**最后更新**: 2026-05-29（从静态壳到可交互）

**功能描述**:
AI 记账助手，支持自然语言输入快速记账和智能数据分析查询。

**实现方式**:
- 聊天消息列表：本地 `messages` 数组，支持 user/ai 角色渲染
- 输入框 `v-model` 绑定，`@confirm` / 发送按钮触发 `sendMessage()`
- **自然语言解析**：
  - 金额提取：正则匹配 "35块"、"35元"、"¥35"、"35.5" 等
  - 分类检测：关键词映射表（早餐→餐饮、打车→交通、工资→收入等）
  - 类型判断：默认支出，"工资"/"收入"/"到账" 等关键词识别为收入
- **智能分析查询**：
  - "本月花了多少" → 读取 `transactionStore.monthlyExpense/Income/Balance`
  - "本月收入" → 读取 `monthlyIncome`
  - "总支出"/"累计支出" → 遍历全部交易累加
- 解析成功 → 调用 `transactionStore.addTransaction()` 创建记录并更新账户余额
- 快捷操作卡片点击触发对应提示或自动发送示例消息

**关联文件**:
- `src/pages/ai/ai.vue`
- `src/stores/transaction.ts`
- `src/stores/category.ts`
- `src/stores/account.ts`

**数据来源**:
- 用户自然语言输入
- `transactionStore`（创建交易、读取统计）
- `categoryStore`（分类映射）
- `accountStore`（默认账户、余额更新）

**注意事项**:
- 基于规则匹配，非真实 AI API（适合离线使用）
- 票据识别功能标记为"开发中"
- 需要至少一个账户才能记账

---

### 存钱目标

**实现时间**: 2026-05-28
**状态**: 已完成（核心功能）
**最后更新**: 2026-05-29（SVG环形图 + EmojiGrid + 预算分类全展示）

**功能描述**:
存钱目标管理和预算管理页面，支持目标 CRUD 和分类预算设置。

**实现方式**:
- 新建 `goalBudgetStore`（Pinia + persist）：`goals[]` + `budgets[]`
- **目标管理**：
  - 目标列表：图标、名称、目标金额、已存金额、SVG 动态进度环、进度条
  - 新建目标：弹窗输入名称、`EmojiGrid` 选择图标、目标金额
  - 存入金额：弹窗输入金额，累加到 `savedAmount`
  - 调整目标：弹窗同时修改名称、目标金额、已存金额
- **预算管理**：
  - 总预算卡片：汇总所有预算限额和本月已用
  - 分类预算列表：`enrichedBudgets` 从 `categoryStore` 动态获取 icon/color
  - 添加预算：展示所有支出分类，已设预算的标记为禁用+「已设预算」标签

**关联文件**:
- `src/pages/goals/goals.vue`
- `src/components/EmojiGrid.vue`
- `src/stores/goalBudget.ts`
- `src/stores/transaction.ts`
- `src/stores/category.ts`

**数据来源**:
- `goalBudgetStore`（目标配置、预算配置）
- `transactionStore`（预算 used 实时计算）
- `categoryStore`（分类名称/图标/颜色动态获取）

**注意事项**:
- 进度环使用 SVG `<circle>` + `stroke-dasharray`，支持 0-100% 真实动态进度
- 预算 used 按自然月（YYYY-MM）计算
- 弹窗统一使用 `EmojiGrid.vue` 选择图标（40 个 emoji）

---

### 资产页

**实现时间**: 2026-05-28
**状态**: 部分完成
**最后更新**: 2026-05-29（趋势图改用 LineChart 组件）

**功能描述**:
展示净资产、资产构成、账户列表和资产趋势。

**实现方式**:
- 净资产卡片：汇总 `accountStore.accounts` 所有余额，动态计算较上月变化
- 账户列表：读取 `accountStore.accounts`，支持余额显示，点击管理跳转设置页
- 资产趋势图：`LineChart.vue` 组件，基于 `transactionStore` 动态计算最近6个月净资产
- 资产构成环形图：CSS `conic-gradient` 多层叠加（有 bug，待修复为 SVG）
- 资产构成详情：点击「详情」弹出 modal 展示各账户金额和占比

**关联文件**:
- `src/pages/assets/assets.vue`
- `src/components/LineChart.vue`
- `src/stores/account.ts`
- `src/stores/transaction.ts`

**数据来源**:
- `accountStore.accounts`
- `transactionStore.transactions`（趋势图动态计算）

**注意事项**:
- 趋势图已接入真实交易数据动态计算
- 环形图多层 `conic-gradient` 叠加会互相覆盖（已知限制）

---

### 我的 / 设置

**实现时间**: 2026-05-28
**状态**: 基本完成
**最后更新**: 2026-05-29（分类CRUD + 账户添加 + CSV导出）

**功能描述**:
用户中心页面和通用设置页面。

**实现方式**:
- 我的页面：用户信息卡片、菜单分组、统计数据使用真实 store
- 设置页面：根据 `type` 参数渲染不同内容
  - 分类管理：支持添加/删除自定义分类（底部弹窗表单，默认分类不可删）
  - 账户管理：支持添加账户（名称/类型/银行/图标）
  - 数据导出：CSV 导出已实现（H5 下载，其他平台复制剪贴板）
  - 提醒设置：记账提醒 + 预算预警开关，状态存 `appStore`（持久化）
  - 主题/安全/币种/周期/导入/同步：toast 占位
  - 清空数据：确认弹窗后真实清空

**关联文件**:
- `src/pages/profile/profile.vue`
- `src/pages/settings/index.vue`
- `src/stores/app.ts`
- `src/stores/category.ts`
- `src/stores/account.ts`
- `src/stores/transaction.ts`

**数据来源**:
- `transactionStore`（统计数量、清空数据）
- `categoryStore`（分类列表）
- `accountStore`（账户列表）
- `appStore`（提醒开关状态）

**注意事项**:
- 分类/账户管理已支持增删（编辑暂未实现）
- 主题切换只有 UI 框架，未实现多套配色

---

### 可复用组件

**LineChart.vue**
- 抽取自 `report.vue` 和 `assets.vue`
- Props：`labels`/`values`/`height`/`color`/`emptyText`
- SVG 折线图带区域填充、数据点、网格线
- Y/X 轴标签使用 HTML 渲染（避免 uni-app `<text>` 与 SVG `<text>` 冲突）

**PageHeader.vue**
- 统一页面头部：返回按钮 + 标题 + actions slot
- Props：`title`、`showBack`
- 返回按钮使用 `uni-icons type="arrow-left"`

**EmptyState.vue**
- 统一空状态：emoji icon + 标题 + 描述
- Props：`icon`、`title`、`description`

**EmojiGrid.vue**
- 统一 emoji 选择器，40 个常见 emoji
- Props：`modelValue`、`emojiList`（可选自定义列表）
- 8 列网格布局，支持 active 高亮

---

### 待确认

**实现时间**: 2026-05-28
**状态**: 核心功能完成

**功能描述**:
展示系统监听/解析到的待确认交易记录，用户可确认入账、编辑或忽略。

**实现方式**:
- 静态展示 3 条示例待确认记录
- 点击"确认"：解析金额/分类，调用 `transactionStore.addTransaction()` 创建真实交易 + 更新账户余额
- 点击"编辑"：弹出底部编辑表单，可修改金额/商户/分类
- 点击"忽略"：确认弹窗后从列表移除

**关联文件**:
- `src/pages/pending/pending.vue`

**注意事项**:
- 核心逻辑（确认后创建真实交易）已实现

---

*文档版本：v2.0*
*更新时间：2026-05-29 22:00*
