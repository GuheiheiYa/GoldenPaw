# GoldenPaw 更新日志

所有对项目的修改都会记录在此文档，时间精确到秒。

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
