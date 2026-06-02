# GoldenPaw 项目规则

本文件包含 GoldenPaw 项目的特定规则，优先级高于全局 CLAUDE.md。

---

## 项目概述

GoldenPaw（金爪）是一款个人资产管理APP，使用 uni-app (Vue3 + Vite + TypeScript) 开发。

---

## 规则路由（按需加载）

复杂规则通过路由按需加载，避免 CLAUDE.md 过于臃肿：

| 场景 | 规则文件 | 何时加载 |
|------|---------|---------|
| 技能利用 | `docs/rules/skills.md` | 开始任何开发任务前 |
| 文档工作流 | `docs/rules/docs-workflow.md` | 每次开发时（强制） |
| 测试策略 | `docs/rules/testing.md` | 涉及测试时 |
| Git 工作流 | `docs/rules/git-workflow.md` | Git 操作时 |
| 常见陷阱 | `docs/rules/common-pitfalls.md` | 遇到问题时参考 |

**加载方式**: 在 Claude Code 中读取对应文件，如 `Read docs/rules/skills.md`

---

## 文档体系（强制）

> **所有文档中的时间必须精确到秒**，格式：`YYYY-MM-DD HH:MM:SS`。

### 文档清单

| 文档 | 职责 | 组织方式 | ID规范 |
|------|------|---------|--------|
| `docs/requirements.md` | **只写「要什么」** — 需求清单 + 状态 | 按功能模块（页面）分层 | `[R-xxx]` |
| `docs/features.md` | **只写「怎么做」** — 技术实现细节 | 与 requirements 一一对应 | `[F-xxx]` |
| `docs/issues.md` | **只写「出了什么问题」** — Bug 追踪 | 分 open / closed | `[ISS-xxx]` |
| `docs/changelog.md` | **只写「本次改了什么」** — 更新日志 | 按提交批次，时间倒序 | 引用 `[R-xxx]` / `[ISS-xxx]` |
| `docs/git-commits.md` | **commit ↔ 需求映射** — 回退索引 | 按 commit 时间倒序 | 引用 `[R-xxx]` |
| `docs/navigation.md` | 项目文件导航 | 文件树 + 页面跳转关系 | — |
| `docs/design.md` | 设计文档 | 架构/技术栈/设计稿 | — |

### ID 规范（全文串联）

```
需求ID:    [R-001] ~ [R-999]    例：[R-012] 首页 - 本月结余卡片
功能ID:    [F-001] ~ [F-999]    例：[F-012] 与 R-012 一一对应
问题ID:    [ISS-001] ~ [ISS-999] 例：[ISS-005] 资产环形图颜色覆盖
```

**所有文档中引用需求/问题时必须使用ID**，禁止只用文字描述。

### 文档之间的关联

```
requirements.md [R-xxx] ──→ features.md [F-xxx] ──→ issues.md [ISS-xxx]
       ↑                           ↑                      ↑
       └───────────────────────────┴──────────────────────┘
                         changelog.md
                         git-commits.md
```

### 各文档格式模板

#### requirements.md

```markdown
## 首页 [R-001 ~ R-010]

| ID | 需求描述 | 优先级 | 状态 | 关联功能 |
|----|---------|--------|------|---------|
| R-001 | 顶部品牌标识 + 搜索/消息按钮 | P0 | ✅ | [F-001] |
```

- 不写实现方式、不写文件路径、不写技术细节
- 只写「用户需要什么」
- 状态变更时只改状态列

#### features.md

```markdown
## [F-002] 首页 - 本月结余卡片 ← [R-002]

**状态**: 已完成  **实现时间**: 2026-05-28 00:00:00  **最后更新**: 2026-05-29 00:00:00

**实现方式**:
- `BalanceCard.vue` 从 `transactionStore` 读取

**关联文件**:
- `src/components/BalanceCard.vue`
- `src/stores/transaction.ts`

**数据来源**:
- `transactionStore.transactions`

**已知问题**:
- [ISS-003] 工资周期下结余计算不准确

**注意事项**:
- 编辑交易时不修改账户余额
```

- 必须标注 `[R-xxx]` 反向索引
- 写清楚实现方案、文件路径、数据流
- 记录关联的 Bug（引用 ISS-ID）

#### issues.md

```markdown
## Open（未解决）

### [ISS-007] 资产环形图颜色覆盖
- **关联需求**: [R-012]
- **关联功能**: [F-012] 资产构成环形图
- **问题描述**: ...
- **状态**: open
- **记录时间**: 2026-05-29 00:00:00

## Closed（已解决）

### [ISS-001] 交易编辑功能缺失
- **关联需求**: [R-008]
- **解决方案**: ...
- **解决提交**: 2026-05-29 14:00:00
- **状态**: closed
- **关闭时间**: 2026-05-29 00:00:00
```

- 不再混合「待开发功能」——待开发功能只在 requirements.md 中
- 已解决的问题必须记录「解决提交」时间点

#### changelog.md

```markdown
## 2026-05-29 23:45:00

**需求**: [R-023], [R-024]
**问题**: [ISS-005]（已解决）
**修改文件**:
- `src/utils/deepseek.ts` — 新增 DeepSeek API 封装
- `src/pages/settings/index.vue` — 分类/账户编辑弹窗

**变更摘要**:
- Round 6 全部功能：DeepSeek AI 接入、分类/账户编辑删除
```

- 每次提交批次写一条，不是每改一个文件写一条
- 必须标注对应的需求ID和问题ID
- 文件列表写清「改了什么」

#### git-commits.md

```markdown
| 时间 | Commit Msg | 需求范围 | 修改文件数 | 回退影响 | 备注 |
|------|-----------|---------|-----------|---------|------|
| 2026-05-29 23:45:00 | feat: DeepSeek + CRUD | R-023~R-026 | 16 | 大 | Round 6 |

**回退指南**:
- 如需回退到「Round 6 之前」→ 回退到 2026-05-29 22:00:00 之前
```

- 不是重复 git log，而是 commit 摘要 + 需求映射
- 标注「回退影响」（大/中/小）
- 写「回退指南」

### 工作流（每次开发必须遵循）

| 阶段 | 动作 | 必须更新的文档 |
|------|------|--------------|
| **开发前** | 在 requirements.md 找到 `[R-xxx]`，标记 `🔄` | requirements.md |
| **开发中** | 遇到问题 → issues.md 新建 `[ISS-xxx]`，关联 `[R-xxx]` | issues.md |
| **开发完** | changelog.md 新增条目，标注 `[R-xxx]` + `[ISS-xxx]` + 文件列表 | changelog.md |
| **文档同步** | features.md 补充/更新对应 `[F-xxx]` 的实现细节 | features.md |
| **Git 提交** | git-commits.md 追加一行，建立 commit ↔ 需求映射 | git-commits.md |
| **新增文件** | 必须更新 navigation.md（文件树 + 页面跳转关系） | navigation.md |

---

## 必须遵守的规则

### 1. 按钮功能完整性（强制）

**每个可点击的按钮必须有实际功能，不允许：**
- 只有 `console.log` 的空实现
- 跳转到不存在的页面
- 点击无反应

**如果功能暂未实现，必须：**
- 在 `requirements.md` 中标记为 `⏳`
- 使用 `uni.showToast({ title: '功能开发中' })` 提示用户

### 2. 交互逻辑合理性（强制）

**所有交互必须符合用户预期：**
- 日历日期点击 → 跳转明细页并按该日期筛选
- "管理"按钮 → 跳转到对应的管理页面
- "全部"按钮 → 跳转到完整的列表页面
- 列表项点击 → 跳转到详情/编辑页面
- 搜索按钮 → 打开搜索页面或搜索框
- 返回按钮 → 返回上一页

**交互设计原则：**
- 点击后必须有明确的反馈（页面跳转、弹窗、toast）
- 跳转路径必须正确，页面必须存在
- 筛选/查询条件必须正确传递

### 3. 页面创建规范

**创建新页面时必须：**
1. 在 `src/pages.json` 中添加路由配置
2. 在 `docs/navigation.md` 中添加文件说明
3. 在 `docs/requirements.md` 中新增 `[R-xxx]` 需求
4. 在 `docs/features.md` 中新增 `[F-xxx]` 功能文档
5. 在 `docs/changelog.md` 中记录

### 4. 代码规范

- 使用 `<script setup lang="ts">` 语法
- 样式使用 `@use '../../styles/design-system' as *;`（相对路径）
- 组件文件名 PascalCase：`BalanceCard.vue`
- 工具文件名 camelCase：`formatAmount.ts`

### 5. 测试验证

**完成开发后必须：**
1. 运行 `npm run build:h5` 确认无编译错误
2. 使用 Playwright 或浏览器测试所有新增按钮
3. 在 `docs/issues.md` 中更新测试结果

---

## 项目结构

```
src/
├── pages/          # 页面（4个Tab + 二级页面）
├── components/     # 公共组件
├── stores/         # Pinia 状态管理
├── styles/         # 全局样式
├── types/          # TypeScript 类型
├── utils/          # 工具函数
└── mock/           # 测试数据

docs/
├── design.md         # 设计文档
├── requirements.md   # 需求文档 [R-xxx]
├── features.md       # 功能文档 [F-xxx]
├── changelog.md      # 更新日志
├── issues.md         # 问题追踪 [ISS-xxx]
├── git-commits.md    # Git 提交索引
├── navigation.md     # 项目导航
└── superpowers/plans/ # 实现计划
```

---

## 常用命令

```bash
# 启动开发服务器
npm run dev:h5

# 构建
npm run build:h5

# 查看 Git 状态
git status

# 提交
git add -A && git commit -m "描述"
```

---

*项目规则版本：v2.1*
*更新时间：2026-06-01 00:00:00*
