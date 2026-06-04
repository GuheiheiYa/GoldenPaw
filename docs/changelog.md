# GoldenPaw 更新日志

> 每次提交/每次开发批次写一条，不是每改一个文件写一条。
> 必须标注对应的需求ID `[R-xxx]` 和问题ID `[ISS-xxx]`。

格式：按时间倒序，最新条目在最上方。

---

## 2026-05-29 23:45:00

**需求**: [R-016], [R-023], [R-072] ~ [R-074], [R-078] ~ [R-079], [R-082]
**问题**: [ISS-008], [ISS-014], [ISS-015]（已解决）
**修改文件**:
- `src/utils/deepseek.ts` — 新增 DeepSeek API 封装（DEV 走 Vite proxy）
- `src/pages/ai/ai.vue` — 接入 DeepSeek，网络失败降级本地规则匹配
- `src/pages/assets/assets.vue` — 环形图改为 SVG stroke-dasharray
- `src/styles/design-system.scss` — 新增 4 套 CSS 变量主题色板
- `src/stores/app.ts` — 新增 theme / cycle / appPassword + persist
- `src/utils/cycle.ts` — 新增 `getCycleRange()` 周期日期计算工具
- `src/pages/index/index.vue` — BalanceCard 接入周期统计
- `src/pages/goals/goals.vue` — 预算按周期范围计算已用金额
- `src/pages/settings/index.vue` — 分类编辑弹窗、账户编辑弹窗、密码锁弹窗、周期切换
- `src/App.vue` — 启动密码锁验证层
- `src/stores/transaction.ts` — 新增 `getStatsByDateRange()`
- `src/stores/goalBudget.ts` — 新增 `getBudgetUsageByRange()`
- `src/components/BalanceCard.vue` — 改为 props 驱动（income/expense/balance/label）
- `src/stores/category.ts` — `updateCategory()` 已暴露
- `src/stores/account.ts` — `updateAccount()` 已暴露
- `vite.config.ts` — `/api/deepseek` proxy 配置

**变更摘要**:
- Round 6 全部功能：DeepSeek AI 接入、分类/账户编辑删除、SVG 环形图、主题切换、记账周期、密码锁

---

## 2026-05-29 22:00:00

**需求**: [R-043], [R-057], [R-061]
**问题**: [ISS-002]（左滑删除优化，已解决）
**修改文件**:
- `src/pages/detail/detail.vue` — 日期筛选重构为底部弹窗（快捷标签 + 双picker）
- `src/components/EmojiGrid.vue` — 新建复用组件，40个emoji
- `src/pages/goals/goals.vue` — 预算弹窗展示所有分类，已设预算的标记禁用

**变更摘要**:
- Round 5：明细页日期筛选重构、EmojiGrid 组件统一、预算分类选择优化

---

## 2026-05-29 21:00:00

**需求**: —（纯视觉替换，无业务逻辑变更）
**问题**: —
**修改文件**:
- 12 个页面/组件文件 — 功能性图标全部替换为 `uni-icons`
- `package.json` / `pages.json` — 安装 `@dcloudio/uni-ui`，配置 easycom

**变更摘要**:
- 图标统一：返回箭头、右箭头、搜索、清除、确认、涨跌、发送、退格全部替换为 `uni-icons`

---

## 2026-05-29 20:00:00

**需求**: [R-055], [R-056], [R-095] ~ [R-097]
**问题**: [ISS-004]（目标环形图 >50% 画错，已解决）
**修改文件**:
- `src/components/LineChart.vue` — 新建，从 report/assets 抽取 SVG 折线图
- `src/components/PageHeader.vue` — 新建，统一返回+标题+actions
- `src/components/EmptyState.vue` — 新建，统一空状态
- `src/pages/goals/goals.vue` — 目标环形图改为 SVG，支持 0-100%；调整模式同时修改已存/目标金额
- `src/pages/report/report.vue` — 改用 LineChart
- `src/pages/assets/assets.vue` — 改用 LineChart
- `src/pages/detail/detail.vue` — 改用 PageHeader
- `src/pages/search/search.vue` — 改用 PageHeader

**变更摘要**:
- 可复用组件抽取（LineChart、PageHeader、EmptyState）+ 目标 SVG 环形图修复

---

## 2026-05-29 14:00 ~ 18:30

**需求**: [R-014], [R-015], [R-021], [R-033], [R-035] ~ [R-039], [R-044] ~ [R-050], [R-051] ~ [R-061], [R-062] ~ [R-067], [R-075] ~ [R-077]
**问题**: [ISS-001] ~ [ISS-013]（全部已解决）
**修改文件**:
- `src/stores/transaction.ts` — 新增 `updateTransaction()`
- `src/stores/app.ts` — 新增 `editingTransactionId` + `editTransaction()` / `clearEdit()`
- `src/components/RecordSheet.vue` — 支持编辑模式
- `src/pages/detail/detail.vue` — 按日分组、左滑删除、URL 日期/高亮支持、添加 RecordSheet
- `src/pages/report/report.vue` — 全面重写，接入真实数据，周期切换动态过滤
- `src/pages/ai/ai.vue` — 重写，自然语言记账 + 智能分析
- `src/stores/goalBudget.ts` — 新建，目标+预算 CRUD
- `src/pages/goals/goals.vue` — 接入 goalBudgetStore，弹窗 CRUD
- `src/pages/index/index.vue` — 预算/目标接入 Store
- `src/pages/assets/assets.vue` — 趋势图动态计算
- `src/pages/pending/pending.vue` — 确认入账、编辑、忽略
- `src/pages/search/search.vue` — 金额搜索逻辑修复
- `src/pages/settings/index.vue` — 分类/账户添加、CSV导出、提醒开关持久化
- `src/pages/profile/profile.vue` — 统计数据使用真实 store

**变更摘要**:
- Round 1~4 核心功能补完：交易编辑删除、报表真实数据、AI记账、存钱目标、资产趋势、待确认、搜索、设置

---

## 2026-05-28 21:30:00

**需求**: [R-001] ~ [R-013], [R-019] ~ [R-032], [R-041] ~ [R-042], [R-062] ~ [R-067], [R-068] ~ [R-071], [R-085] ~ [R-086], [R-087] ~ [R-094]
**问题**: —
**修改文件**:
- `src/pages/index/index.vue` — 首页完整 UI
- `src/pages/detail/detail.vue` — 明细页骨架
- `src/pages/assets/assets.vue` — 资产页骨架
- `src/pages/ai/ai.vue` — AI记账页骨架
- `src/pages/report/report.vue` — 报表页骨架
- `src/pages/goals/goals.vue` — 存钱目标页骨架
- `src/pages/pending/pending.vue` — 待确认页骨架
- `src/pages/profile/profile.vue` — 我的页骨架
- `src/pages/settings/index.vue` — 设置页骨架
- `src/components/TabBar.vue` — TabBar + 悬浮记账按钮
- `src/components/RecordSheet.vue` — 底部弹出面板
- `src/components/NumberKeyboard.vue` — 数字键盘
- `src/components/CategoryGrid.vue` — 分类网格
- `src/components/SegmentedControl.vue` — 分段切换
- `src/components/BalanceCard.vue` — 结余卡片
- `src/components/QuickActions.vue` — 快捷操作
- `src/components/WeekCalendar.vue` — 周历
- `src/components/FlowItem.vue` — 流水项
- `src/stores/app.ts` — UI 状态
- `src/stores/transaction.ts` — 交易数据
- `src/stores/category.ts` — 分类数据
- `src/stores/account.ts` — 账户数据
- `src/mock/seed.ts` — 17条示例交易

**变更摘要**:
- Phase 1~5：项目骨架搭建 + 全部页面 UI 实现 + 基础 Store + Mock 数据

---

## 2026-05-28 20:30:00

**需求**: —
**问题**: —
**修改文件**:
- `docs/design.md` — 设计文档
- `docs/requirements.md` — 需求文档
- `docs/features.md` — 功能文档
- `docs/changelog.md` — 更新日志
- `docs/navigation.md` — 导航文档
- `README.md` — 项目说明

**变更摘要**:
- 项目初始化：文档结构创建

---

## 2026-05-29 11:11:19

**需求**: [R-034]
**问题**: [ISS-019]（已解决）
**修改文件**:
- `src/components/RecordSheet.vue` — 新增标签选择弹窗（预设标签网格 + 自定义输入 + 多选）
- `src/pages/detail/detail.vue` — 交易项显示标签
- `src/pages/search/search.vue` — 搜索结果显示标签
- `src/stores/transaction.ts` — `addTransaction` / `updateTransaction` 支持 `tags` 参数
- `src/types/transaction.ts` — `Transaction` 接口已有 `tags?: string[]`

**变更摘要**:
- 标签功能完整实现：记账时可选/可自定义标签，明细/搜索/首页显示标签

---

## 2026-06-02 10:33:56

**需求**: [R-040]
**问题**: [ISS-018]（已解决）
**修改文件**:
- `src/components/DateRangePicker.vue` — 新建通用日期范围选择弹窗组件（从 detail.vue 提取）
- `src/pages/detail/detail.vue` — 移除内嵌日期弹窗，改用 DateRangePicker 组件
- `src/pages/report/report.vue` — 周期 chip 栏新增「自定义」选项，接入 DateRangePicker；自定义范围 ≤31天按天显示折线图，>31天按月聚合
- `src/pages/settings/index.vue` — 账户管理弹窗图标输入框改为 EmojiGrid 组件

**变更摘要**:
- 日期选择统一为 DateRangePicker 通用组件，支持快捷标签 + 双 picker + v-model
- 报表页支持自定义日期范围（关闭 ISS-018）
- 账户图标选择统一使用 EmojiGrid（与分类管理一致）

---

## 2026-06-02 10:33:56

**需求**: [R-044]
**问题**: [ISS-017]（已解决）
**修改文件**:
- `src/pages/detail/detail.vue` — 添加右下角 FAB 记账按钮（固定定位 56px 圆形，品牌渐变背景）

**变更摘要**:
- 明细页新增浮动记账按钮，点击直接打开 RecordSheet（关闭 ISS-017）

---

## 2026-06-02 10:33:56

**需求**: [R-082]
**问题**: [ISS-020]（已解决）
**修改文件**:
- `src/utils/cycle.ts` — 修复工资周期逻辑：day ≥ 25 时返回「本月25日~下月24日」，否则返回「上月25日~本月24日」

**变更摘要**:
- 修复工资周期跨月边界计算错误，补充 13 个边界测试（跨年月/2月/4月/临界点）全部通过（关闭 ISS-020）

---

## 2026-06-02 10:33:56

**需求**: [R-081]
**问题**: —
**修改文件**:
- `src/stores/app.ts` — 新增 `currency` + `setCurrency()`，持久化，初始化同步到 format.ts
- `src/utils/format.ts` — 新增币种符号映射（CNY¥/USD$/EUR€/JPY¥），`formatAmount` 自动跟随全局币种
- `src/pages/settings/index.vue` — 币种列表支持点击切换，动态显示「当前」badge

**变更摘要**:
- 币种设置功能：4 种币种切换，金额显示符号全局跟随（仅切换符号，不做汇率转换）

---

## 2026-06-02 10:33:56

**需求**: [R-080]
**问题**: —
**修改文件**:
- `src/stores/app.ts` — 新增 `fingerprintEnabled` + `setFingerprintEnabled()`，持久化
- `src/pages/settings/index.vue` — 安全设置添加指纹解锁开关；检测支持状态；开启时验证指纹
- `src/App.vue` — 启动时优先尝试指纹验证，失败 fallback 到密码锁；H5 自动 fallback

**变更摘要**:
- 指纹解锁：APP/小程序端支持，H5 提示不支持；与密码锁配合使用（作为 fallback）

---

## 2026-06-02 10:33:56

**需求**: [R-017]
**问题**: —
**修改文件**:
- `src/pages/ai/ai.vue` — 语音记账快捷按钮接入 Web Speech API；识别结果自动填入输入框并发送给 AI 解析

**变更摘要**:
- 语音输入：H5 环境支持语音识别记账，识别结果自动发送给 DeepSeek AI 解析

---

## 2026-06-02 10:33:56

**需求**: [R-083]
**问题**: —
**修改文件**:
- `src/utils/csvImport.ts` — 新建 CSV 智能导入工具：自动识别 GoldenPaw/微信/支付宝三种格式
- `src/pages/settings/index.vue` — 导入数据页面改为 CSV 文件导入，支持格式提示

**变更摘要**:
- 数据导入：H5 环境支持 CSV 文件导入，智能识别三种账单格式，自动创建缺失分类/账户

---

---

## 2026-06-02 10:33:56

**需求**: [R-082a]
**问题**: 用户反馈记账周期理解偏差（实际为统计周期，用户期望为定期自动记账）
**修改文件**:
- `src/types/transaction.ts` — 新增 `RecurringTransaction` / `RecurringCycle` 类型
- `src/stores/recurring.ts` — 新建定期交易 Store（规则 CRUD + 到期执行 + 日期计算）
- `src/App.vue` — 启动时执行到期定期交易，自动创建记录并更新余额
- `src/pages/settings/index.vue` — 新增定期记账管理页面（添加/编辑/删除/启用禁用）
- `src/pages/profile/profile.vue` — 设置菜单添加「定期记账」入口
- `src/components/RecordSheet.vue` — 日期/账户选择改为统一底部弹窗风格；标签文字溢出省略修复
- `src/components/NumberKeyboard.vue` — 删除按钮图标修复（`⌫` 字符）
- `src/pages/pending/pending.vue` — 编辑弹窗分类改为选择器（底部弹窗列表）

**变更摘要**:
- 新增「定期自动记账」功能：每月8号扣车贷、每周一早餐等场景自动记账
- RecordSheet 日期/账户选择统一为项目风格底部弹窗
- 修复标签过多导致按钮错位、删除按钮图标缺失、pending 编辑弹窗分类输入问题

---
---

## 2026-06-02 11:11:19

**需求**: UI 统一 + 样式修复
**修改文件**:
- `src/components/NumberKeyboard.vue` — 退格键图标颜色修复（白色→深色，避免在浅灰背景上看不清）
- `src/pages/pending/pending.vue` — 编辑弹窗分类选择改为内联胶囊标签式（与预算页统一），删除二级弹窗
- `src/pages/settings/index.vue` — 定期记账弹窗分类/账户改为内联胶囊标签式；首次执行日期改为底部弹窗+picker风格；删除两个二级弹窗

**变更摘要**:
- 全部分类选择统一为胶囊标签式（预算页风格），不再弹出二级选择窗
- 日期/账户选择统一为底部弹窗风格
- 退格键颜色修复

---
---

## 2026-06-02 11:11:19

**需求**: 文档清理 + 代码优化
**问题**: [ISS-020]（文档同步）
**修改文件**:
- `docs/requirements.md` — 删除 R-082a 重复行；Store 表格补充 recurring store
- `docs/features.md` — 删除 F-082a 重复段落（第一段格式损坏）
- `docs/changelog.md` — 修复 2026-06-02 10:33:56 条目中的空内容
- `docs/navigation.md` — 删除 type=recurring 和 recurring.ts 重复行；更新币种/待确认描述
- `docs/issues.md` — ISS-020 已关闭，从 Open 区域移至 Closed 区域
- `src/utils/format.ts` — 新增 `dateToString()`（本地时区安全的日期格式化）
- `src/pages/report/report.vue` — 新增 `getDaysDiff()` 修复未定义错误；替换全部 `toISOString().slice(0,10)` 为 `dateToString()`；提取 `categoryStats` computed 消除 pieData/rankData 重复遍历
- `src/pages/assets/assets.vue` — 替换 `toISOString()` 为 `dateToString()`
- `src/pages/detail/detail.vue` — 替换 `toISOString()` 为 `dateToString()`；补充 `datePickerRef` 声明
- `src/components/DateRangePicker.vue` — 替换 `toISOString()` 为 `dateToString()`
- `src/pages/settings/index.vue` — 替换 `toISOString()` 为 `dateToString()`；补充 `fileInputRef` 声明
- `src/utils/deepseek.ts` — API Key 改为从环境变量 `VITE_DEEPSEEK_API_KEY` 读取
- `src/types/transaction.ts` — Transaction 接口补充 `updatedAt?: number`
- `src/components/BalanceCard.vue` / `CategoryGrid.vue` / `DateRangePicker.vue` / `EmojiGrid.vue` / `FlowItem.vue` / `NumberKeyboard.vue` — 移除未使用的 `const props = ` 赋值
- `src/pages/ai/ai.vue` — 移除未使用的 `onMounted` 导入
- `src/App.vue` — 密码锁输入框增加 `type="number"` 限制只能输入数字
- `src/stores/category.ts` — 新增 `categoryMap` computed，`getCategoryById` / `updateCategory` 改用 Map 查找避免每次展开合并数组

**变更摘要**:
- 文档：修复全部重复项和过时描述，所有文档与代码同步
- 时区安全：全项目统一使用 `dateToString()` 替代 `toISOString().slice(0,10)`，消除 UTC+8 凌晨日期偏差 bug
- 运行时：修复 report.vue `getDaysDiff` 未定义错误
- 安全：DeepSeek API Key 不再硬编码
- 性能：report.vue 分类聚合结果缓存；category.ts 使用 Map 索引
- 代码质量：移除 6 个组件未使用的 props 变量、1 个未使用的 import、2 个未声明的 ref

---
*文档版本：v5.0*
*更新时间：2026-06-04 11:26:45*
*格式说明：每次提交一批写一条，必须关联 [R-xxx] / [ISS-xxx]*

---

## 2026-06-04 11:26:45

**需求**: [R-086a], [R-086b], [R-086c]
**问题**: [ISS-021] ~ [ISS-028]（新建，8 条 Open）
**修改文件**:
- `docs/issues.md` — 新建 8 条 Open 问题
- `docs/features.md` — 更新 F-062~F-067、F-068、F-069 的已知问题
- `docs/requirements.md` — 新增 R-086a/086b/086c 待开发需求
- `docs/changelog.md` — 本次记录

**变更摘要**:
- 全面代码审查，发现 8 个问题并记录到 issues.md
- 核心问题：待确认页面全部硬编码假数据（ISS-021）、我的页面目标数硬编码（ISS-022）
- 功能缺失：通知功能、Excel 导出、用户协议页面（R-086a/b/c）
- 代码质量：console.log 残留、Sass 警告、菜单描述误导
