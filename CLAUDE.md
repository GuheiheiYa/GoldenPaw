# GoldenPaw 项目规则

本文件包含 GoldenPaw 项目的特定规则，优先级高于全局 CLAUDE.md。

---

## 项目概述

GoldenPaw（金爪）是一款个人资产管理APP，使用 uni-app (Vue3 + Vite + TypeScript) 开发。

---

## 必须遵守的规则

### 1. 文档同步更新（强制）

**每次修改代码后，必须检查并更新相关文档：**

| 修改类型 | 必须更新的文档 |
|---------|--------------|
| 新增页面 | `docs/navigation.md` + `docs/changelog.md` |
| 新增功能 | `docs/issues.md`（标记已完成） + `docs/changelog.md` |
| 修复 Bug | `docs/changelog.md` |
| 修改按钮/交互 | `docs/issues.md`（更新测试状态） |
| 数据模型变更 | `docs/design.md` + `docs/changelog.md` |

### 2. 按钮功能完整性（强制）

**每个可点击的按钮必须有实际功能，不允许：**
- 只有 `console.log` 的空实现
- 跳转到不存在的页面
- 点击无反应

**如果功能暂未实现，必须：**
- 在 `docs/issues.md` 中记录
- 使用 `uni.showToast({ title: '功能开发中' })` 提示用户

### 3. 页面创建规范

**创建新页面时必须：**
1. 在 `src/pages.json` 中添加路由配置
2. 在 `docs/navigation.md` 中添加文件说明
3. 在 `docs/changelog.md` 中记录
4. 更新 `docs/issues.md` 标记对应按钮为已完成

### 4. 代码规范

- 使用 `<script setup lang="ts">` 语法
- 样式使用 `@use '../../styles/design-system' as *;`（相对路径）
- 组件文件名 PascalCase：`BalanceCard.vue`
- 工具文件名 camelCase：`formatAmount.ts`

### 5. 测试验证

**完成开发后必须：**
1. 运行 `npm run dev:h5` 确认无编译错误
2. 使用 Playwright 或浏览器测试所有新增按钮
3. 在 `docs/issues.md` 中更新测试结果

---

## 项目结构

```
src/
├── pages/          # 页面（4个Tab + 4个二级 + 更多）
├── components/     # 公共组件
├── stores/         # Pinia 状态管理
├── styles/         # 全局样式
├── types/          # TypeScript 类型
├── utils/          # 工具函数
└── mock/           # 测试数据
```

---

## 文档清单

| 文档 | 用途 | 更新频率 |
|------|------|---------|
| `docs/design.md` | 设计文档 | 架构变更时 |
| `docs/requirements.md` | 需求文档 | 需求变更时 |
| `docs/features.md` | 功能文档 | 新增功能时 |
| `docs/changelog.md` | 更新日志 | **每次修改** |
| `docs/navigation.md` | 项目导航 | 新增/删除文件时 |
| `docs/issues.md` | 问题清单 | **每次测试** |

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

*项目规则版本：v1.0*
*创建时间：2026-05-28*
