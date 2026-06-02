# 技能利用规则

GoldenPaw 项目可以利用的 superpowers 技能，按需加载。

---

## 可用技能

| 场景 | 技能名 | 触发时机 | 用途 |
|------|--------|---------|------|
| 前端 UI 开发 | `frontend-design` | 开始 Vue 组件开发前 | UI 设计、组件结构、样式最佳实践 |
| 新功能开发 | `feature-dev` | 开始新功能前 | 功能设计、实现规划、测试策略 |
| 复杂任务规划 | `writing-plans` | 多步骤任务开始前 | 制定详细的实现计划 |
| 调试问题 | `systematic-debugging` | 遇到 bug 或异常时 | 系统化定位和修复问题 |
| 代码审查 | `code-review` | 实现完成后、提交前 | 审查代码质量、发现潜在问题 |
| 功能验证 | `verification-before-completion` | 开始实现前、完成实现后 | 定义成功标准、验证完成 |
| TDD 开发 | `test-driven-development` | 可测试的业务逻辑开发 | 测试驱动的开发流程 |
| Git 分支管理 | `using-git-worktrees` | 需要隔离工作时 | 在独立分支工作，不影响主分支 |

---

## 使用原则

### 必须使用

1. **涉及前端 UI 开发** → 先调用 `/frontend-design`
2. **开始新功能** → 先调用 `/feature-dev` 或 `/writing-plans`
3. **遇到 bug** → 先调用 `/systematic-debugging`
4. **完成实现** → 先调用 `/code-review` 再提交
5. **复杂多步骤任务** → 先调用 `/writing-plans`

### 可选使用

1. **可测试的业务逻辑** → 使用 `/test-driven-development`
2. **需要隔离工作** → 使用 `/using-git-worktrees`

---

## 技能调用方式

在 Claude Code 中直接输入：

```
/frontend-design
/feature-dev
/writing-plans
/systematic-debugging
/code-review
/verification-before-completion
/test-driven-development
/using-git-worktrees
```

---

## 技能与工作流集成

```
开始任务
  ↓
调用技能（/frontend-design, /feature-dev, /writing-plans）
  ↓
制定计划（/writing-plans）
  ↓
实现代码（/test-driven-development，可选）
  ↓
代码审查（/code-review）
  ↓
功能验证（/verification-before-completion）
  ↓
Git 提交
  ↓
文档更新（见 docs/rules/docs-workflow.md）
```
