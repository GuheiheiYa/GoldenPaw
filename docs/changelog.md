# GoldenPaw 更新日志

所有对项目的修改都会记录在此文档，时间精确到秒。

---

## 2026-05-29

### 22:00:00 - 用户反馈问题修复 Round 5（3项）
- **明细页日期筛选重构**
  - 删除 `uni.showActionSheet` 二级菜单（今天/昨天/近7天/近30天/本月/选择日期/清空筛选）
  - 点击搜索图标直接弹出「选择日期范围」底部弹窗
  - 弹窗顶部添加快捷标签（今天/昨天/近7天/近30天/本月），一键设置常用范围
  - 支持开始日期 + 结束日期双 picker，可自由组合任意日期范围
  - 保留「清空筛选」按钮
- **存钱目标图标展示不全修复**
  - 新建 `EmojiGrid.vue` 复用组件，统一使用 40 个常见 emoji
  - goals.vue 和 settings/index.vue 均复用该组件
  - 弹窗添加 `max-height: 85vh; overflow-y: auto`，确保内容可滚动
- **预算分类选择优化**
  - 弹窗展示所有支出分类（而非仅未设预算的）
  - 已设置预算的分类显示为禁用状态，标注「已设预算」标签
  - 无可用分类时显示提示「所有支出分类已设置预算」

### 21:00:00 - 图标统一引入 uni-icons
- 安装 `@dcloudio/uni-ui`，配置 `pages.json` easycom 自动导入
- 功能性图标全部替换为 `uni-icons` 组件：
  - 返回箭头 `arrow-left`（PageHeader、detail、search、goals、report、settings、help、pending）
  - 右箭头 `arrow-right`（profile、settings、help）
  - 搜索 `search`（index、detail、search）
  - 清除 `closeempty`（detail）
  - 确认 `checkmarkempty`（pending）
  - 涨跌箭头 `arrow-up`/`arrow-down`（assets）
  - 发送 `paperplane`（ai）
  - 退格 `arrow-left`（NumberKeyboard）

### 20:00:00 - 可复用组件抽取 & 体验优化
- **LineChart.vue**：从 report.vue 和 assets.vue 抽取 SVG 折线图，支持 labels/values/height/color/emptyText props
- **PageHeader.vue**：统一抽取返回按钮 + 标题 + actions slot，替换 detail/report/goals/settings 等页面
- **EmptyState.vue**：统一抽取空状态（icon + title + desc），替换 detail/goals
- **存钱目标优化**：
  - SVG 动态环形图替代固定 border hack，支持 0-100% 真实进度
  - 「调整」模式支持同时修改已存金额和目标金额
  - 新建目标使用 EmojiGrid 选择图标
- **预算分类动态化**：`enrichedBudgets` 从 `categoryStore.getCategoryById()` 动态取 icon 和 color

---

## 2026-05-29

### 18:30:00 - 用户反馈问题修复 Round 4（3项）
- **滑动删除视觉动画**
  - 恢复 `tx-item-actions` 删除按钮层，滑动时从右侧滑出
  - 滑动超过阈值后自动弹出删除确认（不需要二次点击）
  - 在 `onLoad` 中重置 `swipedId`，修复从首页进入后残留显示的问题
  - 分类管理页同步实现滑动删除动画
- **折线图 XY 轴数据**
  - 根因：uni-app 的 `<text>` 内置组件与 SVG `<text>` 元素冲突，导致 Y 轴刻度不显示
  - 修复：将 Y 轴和 X 轴标签移出 SVG，使用 HTML `<text>` 元素渲染
  - 添加 Y 轴刻度值（最大值、66%、33%、0）和 X 轴日期标签
  - 调整本月数据点密度，每3天显示一个标签避免重叠
  - 修复 `lineAreaPoints` 中 `paddingBottom` 未定义导致的 SVG 渲染错误
- **明细页筛选增强**
  - action sheet 增加"昨天"、"选择日期"、"清空筛选"选项
  - "选择日期"使用 `uni.showModal` 可编辑输入框，支持精确到某天的筛选
  - 添加日期筛选状态条，显示当前筛选条件（如"今天"、"5月20日"）
  - 点击状态条上的 ✕ 可快速清空筛选

### 17:30:00 - 用户反馈问题修复 Round 3（5项）
- **柱状图改折线图**
  - `report.vue` 和 `assets.vue` 的柱状图统一改为 SVG 折线图
  - 折线带区域填充、数据点、网格线、Y轴最大值标签
  - 报表页按周期自适应数据点：本周7天 / 本月最近15天 / 本季3个月 / 本年12个月
  - 解决本季/本年选择后数据点过少/过多的问题
- **滑动删除优化**
  - 明细页：滑动超过60px直接弹出 `uni.showModal` 删除确认，无需再点击删除按钮
  - 移除 `tx-item-actions` 层和 `swipedId` 状态，消除从首页进入后残留显示的问题
  - 分类管理页：同样实现滑动删除，默认分类不可删除
- **日期选择改用 picker 组件**
  - `RecordSheet.vue` 的日期选择从 `uni.showActionSheet` 改为 `picker mode="date"`
  - 使用系统原生日期选择器，支持任意日期选择
- **资产构成详情按钮**
  - 绑定 `@tap` 事件，点击弹出 modal 展示各账户金额和占比明细
- **分类管理滑动删除**
  - 移除显式 ✕ 按钮，改为左滑弹出删除确认

### 16:00:00 - 用户反馈问题修复 Round 2（6项）
- **报表/资产柱状图不显示**
  - 根因：`align-items: flex-end` 导致子元素不 stretch，高度只有内容高度
  - 修复：给 `.bar-col` 和 `.trend-bar-wrapper` 添加 `height: 100%`
- **明细页筛选失效 + 删除交互优化**
  - 根因：`getToday()` 未在 detail.vue 中导入，导致 JS 运行时错误
  - 修复：导入 `getToday`；实现左滑删除（touch 事件 + translateX + 右侧删除层）
- **AI页面标题恢复**
  - 添加 `.page-title-bar` 标题区域，显示"AI记账助手"
- **资产页按钮无效**
  - "管理"和"添加账户"按钮没有绑定事件
  - 修复：绑定跳转 `/pages/settings/index?type=account`
- **分类管理 emoji 选择**
  - 将图标输入框替换为 35 个常用 emoji 网格选择
- **记账弹窗功能补全**
  - 日期选择：`uni.showActionSheet` 提供常用日期选项 + 自定义日期输入
  - 账户选择：`uni.showActionSheet` 列出所有账户
  - 商户字段：新增商户输入框，保存时与备注组合为 "商户 | 备注"
  - 键盘 +/-：实现连续计算（35 + 20 = 55）
  - 验证提示：金额/分类/账户未填写时弹出 `uni.showToast`

### 14:00:00 - 用户反馈问题修复（9项）
- **首页预算跳转修复**
  - `goals.vue` 添加 `onLoad` 读取 `?tab=budget` 参数，自动切换到预算管理Tab
- **报表柱状图 + Pie Center**
  - 柱状图无数据时显示"暂无收支数据"空状态提示
  - 饼图中心文字改为动态绑定 `formatAmount(pieData.total)`
- **明细页交互全面改进**
  - 列表从"按月分组"改为"按日分组"，日标题显示"今天/昨天/MM月DD日 星期X"
  - 去掉无功能的 ⚙ 设置按钮
  - 🔍 查询按钮改为日期筛选器（今天/近7天/近30天/本月/全部）
  - 交易项右侧添加显式 ✕ 删除按钮（同时保留长按删除）
- **待确认页面功能补全**
  - "确认"按钮：解析金额/分类，调用 `transactionStore.addTransaction()` 真实入账
  - "编辑"按钮：弹出底部表单，可修改金额/商户/分类
  - "忽略"按钮：添加确认弹窗
- **资产页优化**
  - 去掉右上角 📊 ⚙️ 两个无功能按钮
  - 趋势图从硬编码改为基于交易数据动态计算最近6个月净资产
  - 月度净资产变化也改为动态计算
- **AI页面Header统一**
  - 去掉 `ai.vue` 的返回按钮header，跟其他Tab页保持一致
- **TabBar中间按钮**
  - 去掉"记账"文字，只保留 "+" 图标
- **分类管理CRUD**
  - `categoryStore` 新增 `addCategory` / `updateCategory` / `deleteCategory`
  - 设置页分类管理支持添加/删除（底部弹窗表单，默认分类不可删）
- **账户管理添加**
  - `accountStore` 新增 `addAccount` / `deleteAccount`
  - 设置页账户管理支持添加账户（名称/类型/银行/图标）
- **数据导出CSV**
  - 设置页导出数据支持 CSV 导出（H5 直接下载，其他平台复制剪贴板）

### 11:30:00 - 核心功能补完（P0/P1/P2）
- **收支报表真实数据**
  - `report.vue` 全面重写，接入 `transactionStore` + `categoryStore`
  - 周期切换（本周/本月/本季/本年）动态过滤交易数据
  - 柱状图、饼图、消费排行从硬编码改为 `computed` 动态计算
  - 汇总卡片实时显示收入/支出金额
- **AI 记账核心功能**
  - `ai.vue` 重写：输入框 `v-model` 绑定，支持发送/回车
  - 本地规则解析器：识别金额（35块/35元/¥35）、分类关键词、收支类型
  - 自然语言记账："早餐15块" → 自动创建交易记录
  - 智能分析查询："本月花了多少" → 读取 `transactionStore` 输出统计
  - 聊天消息列表实时渲染，快捷操作卡片可触发交互
- **存钱目标真实数据**
  - 新建 `src/stores/goalBudget.ts`（Pinia + persist）
  - 目标支持：新建、存入金额、调整目标、删除
  - 预算支持：按分类设置月度限额，used 实时联动 `transactionStore`
  - `goals.vue` 添加弹窗表单，完成 CRUD 交互
- **首页预算/目标接入 Store**
  - `index.vue` 的 `budgetItems` 和 `goalItems` 改为 `computed`
  - 从 `goalBudgetStore` 动态读取，预算 used 实时计算
- **交易编辑/删除（P0）**
  - `transactionStore` 新增 `updateTransaction()`
  - `appStore` 新增 `editingTransactionId` + `editTransaction()` / `clearEdit()`
  - `RecordSheet.vue` 支持编辑模式：加载交易数据、更新保存、重置表单
  - `detail.vue` 点击编辑打开 RecordSheet，长按删除（`uni.showModal` 确认）
- **明细页 highlight 跳转**
  - `detail.vue` 读取 `highlight` URL 参数，匹配交易添加脉冲高亮
  - 3 秒后自动清除高亮状态
- **搜索金额搜索逻辑修复**
  - 同时匹配元（35）、分（3500）、格式化金额（35.00）三种形式
- **设置提醒开关持久化**
  - `appStore` 新增 `reminderEnabled` / `budgetAlertEnabled`（Pinia persist）
  - `settings/index.vue` 使用 `computed` 双向绑定，刷新后保持用户设置

---

## 2026-05-28

### 20:35:00 - 文档命名规范化
- 文档文件名统一使用英文：design.md, requirements.md, features.md, changelog.md, navigation.md
- 更新 README.md 中的文档链接

### 20:30:00 - 项目初始化
- 创建项目文档结构
- 编写设计文档（技术栈、页面架构、组件设计）
- 编写需求文档（9个功能模块详细需求）
- 编写更新日志文档
- 编写项目导航文档
- 创建 README.md

### 21:00:00 - Phase 1 项目骨架搭建完成
- 初始化 uni-app 项目（Vue3 + Vite + TypeScript）
- 安装依赖：865个包（@dcloudio/uni-app, Vue 3.4, Pinia, pinia-plugin-persistedstate, sass, TypeScript）
- 创建 Design System SCSS（design-system.scss, mixins.scss, reset.scss）
- 创建 TypeScript 类型定义（Transaction, Category, Account）
- 创建工具函数（formatAmount, formatDate, getToday, getCurrentTime, generateId）
- 创建 4 个 Pinia Store（app, transaction, category, account）
- 创建自定义 TabBar 组件（含中心悬浮记账按钮）
- 创建 SegmentedControl 和 RecordSheet 组件
- 创建 8 个占位页面（4个Tab + 4个二级）
- 修复 SCSS 编译错误（@use 相对路径导入）
- 构建验证通过

### 21:30:00 - Phase 2-5 全部页面实现完成
- 创建 Mock 种子数据（17条示例交易）
- 实现首页完整UI（BalanceCard、QuickActions、WeekCalendar、FlowItem）
- 实现明细页（筛选Tab、月度分组、交易列表）
- 实现资产页（净资产、环形图、账户列表、趋势图）
- 实现记账BottomSheet完整功能（NumberKeyboard、CategoryGrid、保存交易）
- 实现AI记账页（AI状态卡片、快捷操作、聊天界面）
- 实现我的页面（用户卡片、菜单分组）
- 实现收支报表页（周期选择、趋势图、饼图、排行）
- 实现存钱目标页（目标卡片、预算管理）
- 实现待确认页（待确认记录、来源设置）
- 浏览器截图验证全部通过

### 22:00:00 - 交互逻辑完善
- 修复存钱和待确认按钮跳转路径错误
- 首页搜索按钮跳转搜索页面
- 首页日历点击跳转明细页并按日期筛选
- 首页流水项点击跳转明细页
- 首页"管理"跳转预算管理、"全部"跳转存钱目标列表
- FlowItem 和 WeekCalendar 组件支持点击事件
- 明细页支持日期筛选参数
- 新增设置页面（分类/账户/主题/提醒/安全/币种/周期/导出/导入/同步/清空）
- 新增搜索页面（支持按备注、分类、金额搜索）
- 新增帮助页面（FAQ + 联系方式）
- 我的页面所有菜单跳转到对应设置页面
- 我的页面统计数据使用真实 store 数据
- 创建项目 CLAUDE.md 规则文件

---

*每次修改代码或文档后，必须在此文件顶部添加新条目。*
