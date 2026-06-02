# GoldenPaw 功能实现文档

> 本文档与 `requirements.md` 一一对应，通过 `[R-xxx]` / `[F-xxx]` 建立索引。
> 每个功能写清楚：实现方式、关联文件、数据来源、已知问题、注意事项。

---

## [F-001] 首页 - 顶部品牌标识 + 搜索/消息按钮 ← [R-001]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 顶部固定 header，左侧品牌 logo + "GoldenPaw" 文字
- 右侧搜索图标（跳转搜索页）+ 消息铃铛图标（预留）

**关联文件**:
- `src/pages/index/index.vue`

---

## [F-002] 首页 - 本月结余卡片 ← [R-002]

**状态**: 已完成  **实现时间**: 2026-05-28  **最后更新**: 2026-05-29（接入周期计算）

**实现方式**:
- `BalanceCard.vue` 组件，props 接收 income/expense/balance/label
- 首页通过 `getCycleRange(appStore.cycle)` 计算当前周期范围
- 调用 `transactionStore.getStatsByDateRange(start, end)` 获取周期内统计
- label 随 cycle 变化：natural → "本月结余"，其他 → "本期结余"

**关联文件**:
- `src/components/BalanceCard.vue`
- `src/pages/index/index.vue`
- `src/stores/transaction.ts`
- `src/utils/cycle.ts`

**数据来源**:
- `transactionStore.transactions`

**已知问题**:
- [ISS-020] 工资周期（25日-24日）跨月时，日期范围计算需验证边界

**注意事项**:
- 金额单位：UI 显示元，存储为分（cents）

---

## [F-003] 首页 - 快捷操作胶囊 ← [R-003]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- `QuickActions.vue` 组件，4 个胶囊按钮横向排列
- 点击分别跳转：报表、明细、存钱(goals)、待确认

**关联文件**:
- `src/components/QuickActions.vue`
- `src/pages/index/index.vue`

---

## [F-004] 首页 - 周历组件 ← [R-004]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- `WeekCalendar.vue` 组件，本地计算本周 7 天日期
- 高亮今天，点击某天跳转明细页并按该日期筛选

**关联文件**:
- `src/components/WeekCalendar.vue`
- `src/pages/index/index.vue`

---

## [F-005] 首页 - 本月预算卡片 ← [R-005]

**状态**: 已完成  **实现时间**: 2026-05-28  **最后更新**: 2026-05-29（接入周期计算）

**实现方式**:
- 从 `goalBudgetStore.getBudgetUsageByRange(start, end)` 读取预算使用情况
- 取前 3 个预算展示，显示分类图标、名称、已用金额、剩余/限额
- 进度条颜色随使用比例变化：brand (<80%) / accent (80%+) / danger (超出)

**关联文件**:
- `src/pages/index/index.vue`
- `src/stores/goalBudget.ts`
- `src/stores/category.ts`
- `src/utils/cycle.ts`

**数据来源**:
- `goalBudgetStore.budgets`
- `transactionStore.transactions`（预算 used 实时计算）
- `categoryStore`（分类图标/名称映射）

---

## [F-006] 首页 - 存钱目标卡片 ← [R-006]

**状态**: 已完成  **实现时间**: 2026-05-28  **最后更新**: 2026-05-29 00:00:00

**实现方式**:
- 从 `goalBudgetStore.goals` 读取目标列表，取前 3 个展示
- 显示图标、名称、已存金额/目标金额、进度百分比

**关联文件**:
- `src/pages/index/index.vue`
- `src/stores/goalBudget.ts`

**数据来源**:
- `goalBudgetStore.goals`

---

## [F-007] 首页 - 最近流水列表 ← [R-007]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- `FlowItem.vue` 组件，读取最近 8 条交易
- 按分类映射图标和背景色，显示金额（收入绿色/支出红色）

**关联文件**:
- `src/components/FlowItem.vue`
- `src/pages/index/index.vue`
- `src/stores/transaction.ts`

**数据来源**:
- `transactionStore.getRecentTransactions(8)`
- `categoryStore`（分类图标/名称映射）

---

## [F-008] 首页 - 自定义 TabBar + 悬浮记账按钮 ← [R-008]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- `TabBar.vue` 组件，4 个 Tab 项 + 中间悬浮 "+" 按钮
- 中间按钮触发 `appStore.toggleRecordSheet()`
- 选中态通过 `appStore.currentTab` 控制

**关联文件**:
- `src/components/TabBar.vue`
- `src/stores/app.ts`

---

## [F-009] 首页 - 预算/目标数据接入 goalBudgetStore ← [R-009]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- `index.vue` 中 `budgetItems` 和 `goalItems` 改为 `computed`
- 从 `goalBudgetStore` 动态读取，预算 used 实时计算

**关联文件**:
- `src/pages/index/index.vue`
- `src/stores/goalBudget.ts`

---

## [F-010] AI记账 - AI助手状态卡片 ← [R-010]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 顶部卡片展示 AI 头像、名称、描述、在线状态

**关联文件**:
- `src/pages/ai/ai.vue`

---

## [F-011] AI记账 - 快捷操作网格 ← [R-011]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 2x2 网格：语音记账、聊天记账、票据识别、智能分析
- 点击触发对应提示或自动发送示例消息

**关联文件**:
- `src/pages/ai/ai.vue`

---

## [F-012] AI记账 - 聊天界面 ← [R-012]

**状态**: 已完成  **实现时间**: 2026-05-28  **最后更新**: 2026-05-29（接入 DeepSeek）

**实现方式**:
- 消息列表：本地 `messages` 数组，支持 user/ai 角色渲染
- 建议芯片：快捷短语点击自动填入输入框
- AI 返回结构化 JSON（record/analyze/chat），前端解析后执行对应操作

**关联文件**:
- `src/pages/ai/ai.vue`
- `src/utils/deepseek.ts`

---

## [F-013] AI记账 - 输入框 + 发送按钮 ← [R-013]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 底部固定输入栏，`v-model` 绑定，`@confirm` / 发送按钮触发 `sendMessage()`
- `isLoading` 状态控制输入禁用，显示加载指示

**关联文件**:
- `src/pages/ai/ai.vue`

---

## [F-014] AI记账 - 自然语言解析记账 ← [R-014]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- **DeepSeek 优先**：调用 `callDeepSeek()`，system prompt 要求返回 JSON
- **本地 fallback**：网络失败时调用 `parseTransactionFallback()`
- 金额提取：正则匹配 "35块"、"35元"、"¥35"、"35.5"
- 分类检测：关键词映射表（早餐→餐饮、打车→交通等）
- 类型判断：默认支出，"工资"/"收入"/"到账" 等识别为收入
- 解析成功 → 调用 `transactionStore.addTransaction()` + 更新账户余额

**关联文件**:
- `src/utils/deepseek.ts`
- `src/pages/ai/ai.vue`
- `src/stores/transaction.ts`
- `src/stores/account.ts`

**数据来源**:
- 用户自然语言输入
- `categoryStore`（分类映射）
- `accountStore`（默认账户）

**注意事项**:
- 需要至少一个账户才能记账
- H5 开发环境通过 Vite proxy `/api/deepseek` 绕过 CORS

---

## [F-015] AI记账 - 智能分析查询 ← [R-015]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- "本月花了多少" → 读取 `transactionStore.getStatsByDateRange()`
- "本月收入" → 读取周期内收入
- "总支出"/"累计支出" → 遍历全部交易累加

**关联文件**:
- `src/pages/ai/ai.vue`
- `src/stores/transaction.ts`

---

## [F-016] AI记账 - 接入 DeepSeek API ← [R-016]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- `deepseek.ts` 封装 `uni.request` 调用 `deepseek-chat` 模型
- DEV 环境使用 `/api/deepseek`（Vite proxy），生产环境直连
- System prompt 要求 AI 返回严格 JSON：`{action, type, amount, category, note}`
- 解析失败时降级为聊天回复

**关联文件**:
- `src/utils/deepseek.ts`
- `vite.config.ts`（proxy 配置）

**注意事项**:
- API Key 硬编码在源码中，生产环境需改为环境变量

---

## [F-017] AI记账 - 语音输入 ← [R-017]

**状态**: 已完成  **实现时间**: 2026-06-02 10:33:56

**实现方式**:
- H5 环境使用 Web Speech API（`SpeechRecognition` / `webkitSpeechRecognition`）
- 语言设置为 `zh-CN`，识别结果自动填入输入框并发送给 AI 解析
- 识别过程中显示"正在聆听"提示
- 非 H5 环境提示"仅在 H5 环境可用"

**关联文件**:
- `src/pages/ai/ai.vue`

**注意事项**:
- 需要用户授权麦克风权限
- 识别准确率取决于浏览器和麦克风质量

---

## [F-019] 资产 - 净资产卡片 ← [R-019]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 汇总 `accountStore.accounts` 所有余额
- 动态计算较上月变化（基于交易数据）

**关联文件**:
- `src/pages/assets/assets.vue`
- `src/stores/account.ts`

---

## [F-020] 资产 - 账户列表 ← [R-020]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 读取 `accountStore.accounts`，显示图标、名称、类型/银行、余额
- 点击"管理"跳转设置页账户管理

**关联文件**:
- `src/pages/assets/assets.vue`
- `src/stores/account.ts`

---

## [F-021] 资产 - 资产趋势折线图 ← [R-021]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- `LineChart.vue` 组件，基于 `transactionStore` 动态计算最近6个月净资产
- 每月净资产 = 该月累计收入 - 累计支出 + 初始余额

**关联文件**:
- `src/pages/assets/assets.vue`
- `src/components/LineChart.vue`
- `src/stores/transaction.ts`

---

## [F-022] 资产 - 资产构成详情按钮 ← [R-022]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 点击「详情」弹出 modal，展示各账户金额和占比明细

**关联文件**:
- `src/pages/assets/assets.vue`

---

## [F-023] 资产 - 资产构成环形图（SVG） ← [R-023]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- SVG `<circle>` + `stroke-dasharray` 动态计算每段弧长
- 半径 r=70，圆周长 = 2πr，按百分比分配 `dashArray` 和 `dashOffset`
- `transform="rotate(-90 80 80)"` 将起始点转到顶部
- 图例列表同步显示各账户金额和占比

**关联文件**:
- `src/pages/assets/assets.vue`

**已知问题**:
- [ISS-008] 已解决：原 CSS `conic-gradient` 多层叠加导致颜色覆盖

---

## [F-024] 资产 - 添加账户按钮 ← [R-024]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 点击跳转 `/pages/settings/index?type=account`

**关联文件**:
- `src/pages/assets/assets.vue`

---

## [F-025] 记账 BottomSheet - 底部弹出面板 ← [R-025]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- `RecordSheet.vue` 组件，v-if 控制显示，CSS transition 动画
- 通过 `appStore.showRecordSheet` 全局控制打开/关闭

**关联文件**:
- `src/components/RecordSheet.vue`
- `src/stores/app.ts`

---

## [F-026] 记账 BottomSheet - 支出/收入/转账 Segmented 切换 ← [R-026]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- `SegmentedControl.vue` 组件，切换时更新表单类型
- 分类网格随类型动态变化（支出分类 / 收入分类）

**关联文件**:
- `src/components/SegmentedControl.vue`
- `src/components/RecordSheet.vue`

---

## [F-027] 记账 BottomSheet - 金额输入 ← [R-027]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- `NumberKeyboard.vue` 自定义数字键盘
- 支持 +/- 连续计算（35 + 20 = 55）
- 退格、清空、小数点支持

**关联文件**:
- `src/components/NumberKeyboard.vue`
- `src/components/RecordSheet.vue`

---

## [F-028] 记账 BottomSheet - 分类选择网格 ← [R-028]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- `CategoryGrid.vue` 从 `categoryStore` 读取分类列表
- 点击选中，高亮显示

**关联文件**:
- `src/components/CategoryGrid.vue`
- `src/components/RecordSheet.vue`
- `src/stores/category.ts`

---

## [F-029] 记账 BottomSheet - 日期选择 ← [R-029]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- `picker mode="date"` 系统原生日期选择器

**关联文件**:
- `src/components/RecordSheet.vue`

---

## [F-030] 记账 BottomSheet - 账户选择 ← [R-030]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- `uni.showActionSheet` 列出所有账户名称
- 选择后记录 accountId

**关联文件**:
- `src/components/RecordSheet.vue`
- `src/stores/account.ts`

---

## [F-031] 记账 BottomSheet - 商户输入 + 备注输入 ← [R-031]

**状态**: 已完成  **实现时间**: 2026-05-28  **最后更新**: 2026-05-29 00:00:00

**实现方式**:
- 新增商户输入框，保存时与备注组合为 "商户 | 备注"

**关联文件**:
- `src/components/RecordSheet.vue`

---

## [F-032] 记账 BottomSheet - 完成按钮 → 保存交易 ← [R-032]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 验证：金额/分类/账户未填写时弹出 `uni.showToast`
- 调用 `transactionStore.addTransaction()` + `accountStore.updateBalance()`

**关联文件**:
- `src/components/RecordSheet.vue`
- `src/stores/transaction.ts`
- `src/stores/account.ts`

---

## [F-033] 记账 BottomSheet - 编辑模式 ← [R-033]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- `appStore.editingTransactionId` 标记编辑状态
- 打开 RecordSheet 时加载交易数据回显
- 调用 `transactionStore.updateTransaction()` 保存
- 关闭时重置表单并 `clearEdit()`

**关联文件**:
- `src/components/RecordSheet.vue`
- `src/stores/app.ts`
- `src/stores/transaction.ts`

**注意事项**:
- 编辑交易时不修改账户余额（避免重复计算）

---

## [F-034] 记账 BottomSheet - 标签选择 ← [R-034]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 底部弹窗展示 10 个常用预设标签（午餐/晚餐/加班/出差/报销/投资/人情/娱乐/AA/家庭）
- 支持多选/取消，已选标签高亮显示
- 自定义输入框 + 添加按钮，新建标签即时加入已选列表
- 标签展示区域用 `flex-wrap` 换行，溢出时自动滚动
- 明细页和搜索页显示标签（`tx.tags.join(' ')`）

**关联文件**:
- `src/components/RecordSheet.vue`
- `src/pages/detail/detail.vue`
- `src/pages/search/search.vue`
- `src/types/transaction.ts`

**数据来源**:
- 预设标签：RecordSheet 内部常量 `presetTags`
- 已选标签：`tags` ref，编辑时从 `tx.tags || []` 加载
- 保存时：`transactionStore.addTransaction()` / `updateTransaction()` 传入 `tags`

**已知问题**:
- [ISS-019] 已解决：标签字段已有但 UI 未提供选择和展示

---

## [F-035] 收支报表 - 时间周期选择 ← [R-035]

**状态**: 已完成  **实现时间**: 2026-05-28  **最后更新**: 2026-06-02（新增自定义周期）

**实现方式**:
- Chip 标签栏：本周/本月/本季/本年/自定义
- 前四项固定周期，通过 `switch` 计算日期范围后过滤交易
- **自定义**：点击打开 `DateRangePicker`，选择任意日期范围
- 自定义范围 ≤ 31 天：折线图按天显示（稀疏标签）；> 31 天：按月聚合

**关联文件**:
- `src/pages/report/report.vue`
- `src/components/DateRangePicker.vue`
- `src/stores/transaction.ts`

---

## [F-036] 收支报表 - 收支摘要卡片 ← [R-036]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 动态计算周期内总收入/总支出

**关联文件**:
- `src/pages/report/report.vue`
- `src/stores/transaction.ts`

---

## [F-037] 收支报表 - 收支趋势折线图 ← [R-037]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- `LineChart.vue` 组件，按周期自适应数据点
- 本周7天 / 本月最近15天 / 本季3个月 / 本年12个月

**关联文件**:
- `src/pages/report/report.vue`
- `src/components/LineChart.vue`

---

## [F-038] 收支报表 - 支出/收入饼图 ← [R-038]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- CSS `conic-gradient` 动态角度渲染
- 按分类聚合支出/收入，计算每段角度
- 饼图中心文字根据当前选中类型动态变化

**关联文件**:
- `src/pages/report/report.vue`
- `src/stores/transaction.ts`
- `src/stores/category.ts`

---

## [F-039] 收支报表 - 消费排行 TOP 5 ← [R-039]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 按分类汇总金额，倒序排列 TOP 5

**关联文件**:
- `src/pages/report/report.vue`
- `src/stores/transaction.ts`
- `src/stores/category.ts`

---

## [F-041] 明细 - 筛选Tab ← [R-041]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- `SegmentedControl.vue` 筛选全部/支出/收入/转账

**关联文件**:
- `src/pages/detail/detail.vue`
- `src/components/SegmentedControl.vue`

---

## [F-042] 明细 - 搜索按钮 ← [R-042]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 点击跳转搜索页面

**关联文件**:
- `src/pages/detail/detail.vue`

---

## [F-043] 明细 - 日期筛选 ← [R-043]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 点击搜索图标直接弹出底部弹窗
- 顶部快捷标签：今天/昨天/近7天/近30天/本月
- 开始日期 + 结束日期双 picker，可自由组合
- 保留「清空筛选」按钮
- 筛选状态条显示当前条件，点击 ✕ 快速清空

**关联文件**:
- `src/pages/detail/detail.vue`

---

## [F-044] 明细 - 按日分组交易列表 ← [R-044]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 从"按月分组"改为"按日分组"
- 日标题显示：今天/昨天/MM月DD日 星期X
- 组内按时间降序

**关联文件**:
- `src/pages/detail/detail.vue`
- `src/stores/transaction.ts`

---

## [F-045] 明细 - 交易项点击编辑 ← [R-045]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 点击交易 → `appStore.openEditRecordSheet(txId)` → 打开 RecordSheet

**关联文件**:
- `src/pages/detail/detail.vue`
- `src/components/RecordSheet.vue`
- `src/stores/app.ts`

---

## [F-046] 明细 - 长按删除 ← [R-046]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 长按交易触发 `uni.showModal` 确认删除
- 调用 `transactionStore.deleteTransaction()`

**关联文件**:
- `src/pages/detail/detail.vue`
- `src/stores/transaction.ts`

---

## [F-047] 明细 - 左滑删除 ← [R-047]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- touch 事件 + translateX 动画
- 滑动超过阈值直接弹出删除确认（无需二次点击）
- 从首页进入后 `onLoad` 中重置 `swipedId`，消除残留显示

**关联文件**:
- `src/pages/detail/detail.vue`

---

## [F-048] 明细 - URL日期筛选支持 ← [R-048]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- `detail.vue` 读取 `date` URL 参数
- 支持单日期 `YYYY-MM-DD` 或范围 `YYYY-MM-DD,YYYY-MM-DD`

**关联文件**:
- `src/pages/detail/detail.vue`

---

## [F-049] 明细 - URL高亮跳转支持 ← [R-049]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- `detail.vue` 读取 `highlight` URL 参数
- 匹配交易添加脉冲高亮样式，3 秒后自动清除

**关联文件**:
- `src/pages/detail/detail.vue`

---

## [F-050] 搜索功能 ← [R-050]

**状态**: 已完成  **实现时间**: 2026-05-28  **最后更新**: 2026-05-29 00:00:00

**实现方式**:
- `keyword` 实时过滤 `transactionStore.transactions`
- 匹配规则：备注（大小写不敏感）、分类名称、金额
- 金额搜索同时匹配元（35）、分（3500）、格式化（35.00）三种形式
- 搜索结果点击跳转 `detail.vue?highlight=id`

**关联文件**:
- `src/pages/search/search.vue`
- `src/stores/transaction.ts`
- `src/stores/category.ts`

---


## [F-051] 存钱目标 - Segmented切换 ← [R-051]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- `SegmentedControl.vue` 切换存钱目标/预算管理

**关联文件**:
- `src/pages/goals/goals.vue`
- `src/components/SegmentedControl.vue`

---

## [F-052] 存钱目标 - 目标卡片 ← [R-052]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 图标、名称、目标金额、已存金额、SVG 动态进度环、进度条、统计

**关联文件**:
- `src/pages/goals/goals.vue`
- `src/stores/goalBudget.ts`

---

## [F-053] 存钱目标 - 存入金额/调整目标 ← [R-053]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 弹窗输入金额，存入模式累加到 `savedAmount`
- 调整模式同时修改名称、目标金额、已存金额

**关联文件**:
- `src/pages/goals/goals.vue`
- `src/stores/goalBudget.ts`

---

## [F-054] 存钱目标 - 新建目标 ← [R-054]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 弹窗表单：输入名称、`EmojiGrid` 选择图标、目标金额

**关联文件**:
- `src/pages/goals/goals.vue`
- `src/components/EmojiGrid.vue`
- `src/stores/goalBudget.ts`

---

## [F-055] 存钱目标 - SVG动态环形图 ← [R-055]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- SVG `<circle>` + `stroke-dasharray` 动态计算
- 半径 r=26，支持 0-100% 真实动态进度
- 解决了原 `border-top/right-color` 旋转法只支持 0-50% 的问题

**关联文件**:
- `src/pages/goals/goals.vue`

**已知问题**:
- [ISS-004] 已解决：原 CSS border hack 只支持 0-50%

---

## [F-056] 存钱目标 - 调整模式 ← [R-056]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 弹窗支持同时修改已存金额和目标金额

**关联文件**:
- `src/pages/goals/goals.vue`
- `src/stores/goalBudget.ts`

---

## [F-057] 存钱目标 - EmojiGrid组件 ← [R-057]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 新建 `EmojiGrid.vue`，40 个常见 emoji，7 列网格
- 复用于 goals.vue 新建目标和 settings 分类管理

**关联文件**:
- `src/components/EmojiGrid.vue`
- `src/pages/goals/goals.vue`
- `src/pages/settings/index.vue`

---

## [F-058] 存钱目标 - 预算管理 ← [R-058]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 总预算卡片：汇总所有预算限额和本期已用
- 分类预算列表：`enrichedBudgets` 从 `categoryStore` 动态获取 icon/color

**关联文件**:
- `src/pages/goals/goals.vue`
- `src/stores/goalBudget.ts`
- `src/stores/category.ts`

---

## [F-059] 存钱目标 - 添加预算 ← [R-059]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 弹窗选择分类 + 输入限额

**关联文件**:
- `src/pages/goals/goals.vue`
- `src/stores/goalBudget.ts`

---

## [F-060] 存钱目标 - 预算used实时联动 ← [R-060]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- `budgetUsage` computed 从 `transactionStore` 实时过滤计算
- 支持按记账周期计算已用金额（`getBudgetUsageByRange`）

**关联文件**:
- `src/stores/goalBudget.ts`
- `src/stores/transaction.ts`
- `src/utils/cycle.ts`

---

## [F-061] 存钱目标 - 预算分类选择展示 ← [R-061]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 弹窗展示所有支出分类
- 已设置预算的分类显示为禁用状态，标注「已设预算」标签
- 无可用分类时显示提示

**关联文件**:
- `src/pages/goals/goals.vue`
- `src/stores/goalBudget.ts`
- `src/stores/category.ts`

---

## [F-062] 待确认 - 信息提示横幅 ← [R-062]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 顶部横幅提示待确认记录数量

**关联文件**:
- `src/pages/pending/pending.vue`

---

## [F-063] 待确认 - 待确认卡片 ← [R-063]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 卡片展示来源、原始文本、解析结果（金额/分类/类型）

**关联文件**:
- `src/pages/pending/pending.vue`

---

## [F-064] 待确认 - 确认按钮 ← [R-064]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 点击"确认"：解析金额/分类，调用 `transactionStore.addTransaction()` 创建真实交易
- 同时更新对应账户余额

**关联文件**:
- `src/pages/pending/pending.vue`
- `src/stores/transaction.ts`
- `src/stores/account.ts`

---

## [F-065] 待确认 - 编辑按钮 ← [R-065]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 弹出底部表单，可修改金额/商户/分类

**关联文件**:
- `src/pages/pending/pending.vue`

---

## [F-066] 待确认 - 忽略按钮 ← [R-066]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 点击"忽略"：确认弹窗后从列表移除

**关联文件**:
- `src/pages/pending/pending.vue`

---

## [F-067] 待确认 - 监听来源设置 ← [R-067]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 开关切换监听来源

**关联文件**:
- `src/pages/pending/pending.vue`

---

## [F-068] 我的/设置 - 用户卡片 ← [R-068]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 头像、昵称、ID、统计数据（记账天数/笔数/目标数）
- 统计数据使用真实 store

**关联文件**:
- `src/pages/profile/profile.vue`
- `src/stores/transaction.ts`

---

## [F-069] 我的/设置 - 数据管理菜单 ← [R-069]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 导出数据、导入数据、云同步、清空数据
- 点击跳转到对应 settings 子页面

**关联文件**:
- `src/pages/profile/profile.vue`

---

## [F-070] 我的/设置 - 个性化菜单 ← [R-070]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 提醒设置、密码/指纹锁
- 点击跳转到对应 settings 子页面

**关联文件**:
- `src/pages/profile/profile.vue`

---

## [F-071] 我的/设置 - 基础设置菜单 ← [R-071]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 分类管理、账户管理、币种设置、记账周期
- 点击跳转到对应 settings 子页面

**关联文件**:
- `src/pages/profile/profile.vue`

---

## [F-072] 我的/设置 - 关于菜单 ← [R-072]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 帮助中心、评分鼓励、用户协议、版本号

**关联文件**:
- `src/pages/profile/profile.vue`

---

## [F-073] 我的/设置 - 分类管理 ← [R-073]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 展示支出分类和收入分类列表
- 点击分类项打开编辑弹窗（修改名称/图标/颜色）
- 左滑弹出删除确认，默认分类不可删除
- 底部「+ 添加分类」按钮打开新增弹窗
- 新增/编辑均使用 `EmojiGrid` 选择图标

**关联文件**:
- `src/pages/settings/index.vue`
- `src/components/EmojiGrid.vue`
- `src/stores/category.ts`

---

## [F-074] 我的/设置 - 账户管理 ← [R-074]

**状态**: 已完成  **实现时间**: 2026-05-29  **最后更新**: 2026-06-02（图标改用 EmojiGrid）

**实现方式**:
- 展示账户列表（图标、名称、类型/银行、余额）
- 点击账户项打开编辑弹窗（修改名称/类型/银行/图标）
- 左滑弹出删除确认
- 底部「+ 添加账户」按钮打开新增弹窗
- 图标选择使用 `EmojiGrid` 组件（与分类管理统一）

**关联文件**:
- `src/pages/settings/index.vue`
- `src/components/EmojiGrid.vue`
- `src/stores/account.ts`

---

## [F-075] 我的/设置 - 数据导出 ← [R-075]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- CSV 导出：遍历 `transactionStore.transactions`，生成 CSV 字符串
- H5：创建 Blob 下载
- 非 H5：`uni.setClipboardData` 复制到剪贴板

**关联文件**:
- `src/pages/settings/index.vue`
- `src/stores/transaction.ts`
- `src/stores/category.ts`
- `src/stores/account.ts`

---

## [F-076] 我的/设置 - 提醒设置 ← [R-076]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 记账提醒 + 预算预警开关
- 状态存 `appStore`（Pinia persist），刷新后保持

**关联文件**:
- `src/pages/settings/index.vue`
- `src/stores/app.ts`

---

## [F-077] 我的/设置 - 清空数据 ← [R-077]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 警告提示 + 确认弹窗
- 确认后清空 `transactionStore.transactions`（其他 store 数据保留或同步清空）

**关联文件**:
- `src/pages/settings/index.vue`
- `src/stores/transaction.ts`

---

## [F-078] 我的/设置 - 主题颜色 ← [R-078]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- `design-system.scss` 定义 `:root` + `[data-theme="xxx"]` CSS 变量色板
- 4套主题：warm（暖金）、blue（海蓝）、green（森林绿）、pink（樱花粉）
- `appStore.theme` 持久化，切换时更新 `body[data-theme]`
- 所有 SCSS 变量 `$brand-500` 等指向 `var(--brand-500)`，自动跟随主题

**关联文件**:
- `src/styles/design-system.scss`
- `src/stores/app.ts`
- `src/pages/settings/index.vue`

---

## [F-079] 我的/设置 - 密码锁 ← [R-079]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- `appStore.appPassword` 存储 4 位数字密码（空字符串表示未开启）
- `App.vue` 在 `onShow` 时检查密码，若设置则显示全屏锁定层
- 设置页支持：设置新密码、修改密码（验证旧密码）、关闭密码锁（验证密码）

**关联文件**:
- `src/App.vue`
- `src/stores/app.ts`
- `src/pages/settings/index.vue`

---

## [F-080] 我的/设置 - 指纹解锁 ← [R-080]

**状态**: 已完成  **实现时间**: 2026-06-02 10:33:56

**实现方式**:
- `appStore.fingerprintEnabled` 存储开关状态，Pinia persist
- 设置页：
  - 通过 `uni.checkIsSupportSoterAuthentication` 检测指纹支持
  - 不支持时显示"当前设备不支持"并禁用开关
  - 开启时需先设置密码锁，然后通过 `uni.startSoterAuthentication` 验证指纹
- `App.vue` 启动时：若指纹开启且设备支持，优先尝试指纹验证；失败/取消后 fallback 到密码锁
- H5 环境自动 fallback 到密码锁

**关联文件**:
- `src/App.vue`
- `src/stores/app.ts`
- `src/pages/settings/index.vue`

**注意事项**:
- 仅在 APP-PLUS / MP-WEIXIN 端可用，H5 不支持
- 开启指纹前必须先设置密码锁（作为 fallback）

---

## [F-082] 我的/设置 - 记账周期 ← [R-082]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- `appStore.cycle` 存储周期类型（`'natural' | 'salary' | 'custom'`）
- `src/utils/cycle.ts` 提供 `getCycleRange()` 统一计算当前周期起止日期
- 首页 `BalanceCard` 和预算卡片根据周期范围动态过滤交易
- `goals.vue` 预算管理同样使用周期范围计算已用金额

**关联文件**:
- `src/utils/cycle.ts`
- `src/stores/app.ts`
- `src/pages/index/index.vue`
- `src/pages/goals/goals.vue`
- `src/pages/settings/index.vue`

---

## [F-085] 我的/设置 - 帮助中心 ← [R-085]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- FAQ 展开收起
- 联系方式展示

**关联文件**:
- `src/pages/help/help.vue`

---

## [F-086] 组件 - TabBar ← [R-086]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 自定义 TabBar，4 个 Tab 项 + 中间悬浮 "+" 按钮
- 中间按钮触发 `appStore.toggleRecordSheet()`

**关联文件**:
- `src/components/TabBar.vue`

---

## [F-087] 组件 - RecordSheet ← [R-087]

**状态**: 已完成  **实现时间**: 2026-05-28  **最后更新**: 2026-05-29 00:00:00

**实现方式**:
- 底部弹出面板，v-if + CSS transition 动画
- 新建/编辑双模式，通过 `appStore.editTransactionId` 控制
- 集成 NumberKeyboard、CategoryGrid、SegmentedControl

**关联文件**:
- `src/components/RecordSheet.vue`

---

## [F-088] 组件 - NumberKeyboard ← [R-088]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 自定义数字键盘网格
- 支持 +/- 连续计算、退格、小数点

**关联文件**:
- `src/components/NumberKeyboard.vue`

---

## [F-089] 组件 - CategoryGrid ← [R-089]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 从 `categoryStore` 读取分类列表，网格渲染
- 点击选中高亮

**关联文件**:
- `src/components/CategoryGrid.vue`

---

## [F-090] 组件 - SegmentedControl ← [R-090]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 分段切换器，props 传入选项列表和当前选中值

**关联文件**:
- `src/components/SegmentedControl.vue`

---

## [F-091] 组件 - BalanceCard ← [R-091]

**状态**: 已完成  **实现时间**: 2026-05-28  **最后更新**: 2026-05-29 00:00:00

**实现方式**:
- Props：income / expense / balance / label
- 显示结余金额、收入/支出 pill

**关联文件**:
- `src/components/BalanceCard.vue`

---

## [F-092] 组件 - QuickActions ← [R-092]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 4 个胶囊按钮横向排列

**关联文件**:
- `src/components/QuickActions.vue`

---

## [F-093] 组件 - WeekCalendar ← [R-093]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 本地计算本周 7 天日期
- 高亮今天，点击触发事件

**关联文件**:
- `src/components/WeekCalendar.vue`

---

## [F-094] 组件 - FlowItem ← [R-094]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00

**实现方式**:
- 交易项渲染：图标、名称、时间、金额
- 金额颜色：收入绿色 / 支出红色

**关联文件**:
- `src/components/FlowItem.vue`

---

## [F-095] 组件 - LineChart ← [R-095]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- SVG 折线图，支持 labels/values/height/color/emptyText props
- 带区域填充、数据点、网格线
- Y/X 轴标签使用 HTML 渲染（避免 uni-app `<text>` 与 SVG `<text>` 冲突）

**关联文件**:
- `src/components/LineChart.vue`

---

## [F-096] 组件 - PageHeader ← [R-096]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 统一页面头部：返回按钮 + 标题 + actions slot
- Props：title、showBack
- 返回按钮使用 `uni-icons type="arrow-left"`

**关联文件**:
- `src/components/PageHeader.vue`

---

## [F-097] 组件 - EmptyState ← [R-097]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 统一空状态：emoji icon + 标题 + 描述
- Props：icon、title、description

**关联文件**:
- `src/components/EmptyState.vue`

---

## [F-098] 组件 - EmojiGrid ← [R-098]

**状态**: 已完成  **实现时间**: 2026-05-29 00:00:00

**实现方式**:
- 40 个常见 emoji，7 列网格布局
- Props：modelValue、emojiList（可选自定义）
- 支持 active 高亮

**关联文件**:
- `src/components/EmojiGrid.vue`

---

## [F-081] 我的/设置 - 币种设置 ← [R-081]

**状态**: 已完成  **实现时间**: 2026-06-02 10:33:56

**实现方式**:
- `appStore.currency` 存储当前币种（CNY/USD/EUR/JPY），Pinia persist
- `format.ts` 维护全局币种变量，通过 `setCurrencySymbol()` 同步
- `formatAmount()` 自动根据当前币种显示对应符号（¥/$/€/¥）
- `settings/index.vue` 币种列表点击切换，显示「当前」badge

**关联文件**:
- `src/pages/settings/index.vue`
- `src/stores/app.ts`
- `src/utils/format.ts`

**注意事项**:
- 仅切换显示符号，金额数值不变（不做汇率转换）

---

## [F-099] 组件 - DateRangePicker ← [R-040]

**状态**: 已完成  **实现时间**: 2026-06-02 10:33:56

**实现方式**:
- 从 `detail.vue` 提取的日期范围选择弹窗，封装为通用组件
- 支持 slot 触发（包裹任意元素点击即打开）
- 内置 5 个快捷标签：今天/昨天/近7天/近30天/本月
- 双 `picker mode="date"` 选择开始/结束日期
- 支持 `v-model` 绑定（单日期或范围字符串）
- 暴露 `open()` / `close()` 方法供父组件调用
- 已应用于：`detail.vue`（日期筛选）、`report.vue`（自定义周期）

**Props**:
- `modelValue`: string — 当前值（`YYYY-MM-DD` 或 `YYYY-MM-DD,YYYY-MM-DD`）

**Emits**:
- `update:modelValue`: 值变更
- `confirm`: 用户点击确定
- `clear`: 用户点击清空筛选

**关联文件**:
- `src/components/DateRangePicker.vue`

---

*文档版本：v3.3*
*更新时间：2026-06-02 10:33:56*
*格式说明：每个功能按 [F-xxx] 编号，与 requirements.md 的 [R-xxx] 一一对应*
