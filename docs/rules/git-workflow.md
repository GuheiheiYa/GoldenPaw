# Git 工作流规则

GoldenPaw 项目的 Git 使用规范。

---

## 分支策略

### 分支类型

| 分支 | 用途 | 命名规则 |
|------|------|---------|
| `master` | 生产代码 | - |
| `feature/*` | 新功能开发 | `feature/功能名` |
| `fix/*` | Bug 修复 | `fix/问题名` |
| `release/*` | 发布准备 | `release/版本号` |

### 工作流

```
master
  ↓
feature/xxx（或 worktree）
  ↓
开发 + 测试
  ↓
代码审查
  ↓
合并到 master
  ↓
删除 feature 分支
```

---

## 使用 Worktree（推荐）

### 何时使用

- 需要同时开发多个功能
- 需要隔离工作，不影响主分支
- 需要并行开发

### 使用技能

```
/using-git-worktrees
```

### 创建 Worktree

```bash
git worktree add ../GoldenPaw-feature-xxx feature/xxx
cd ../GoldenPaw-feature-xxx
```

### 管理 Worktree

```bash
git worktree list                         # 列出所有 worktree
git worktree remove ../GoldenPaw-feature-xxx  # 删除 worktree
```

---

## 提交规范

### 提交信息格式

```
类型: 简短描述（50字以内）

详细说明（可选，72字以内）
```

### 类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加交易记录功能` |
| `fix` | Bug 修复 | `fix: 修复余额计算错误` |
| `docs` | 文档 | `docs: 更新需求文档` |
| `style` | 格式（不影响代码运行） | `style: 格式化代码` |
| `refactor` | 重构（不是新功能也不是修复） | `refactor: 重构交易逻辑` |
| `test` | 测试 | `test: 添加单元测试` |
| `chore` | 构建过程或辅助工具变动 | `chore: 更新依赖` |

### 示例

```bash
git commit -m "feat: 添加交易记录功能"
git commit -m "fix: 修复余额计算错误"
git commit -m "docs: 更新需求文档 R-001 状态为 ✅"
```

---

## 暂存策略

### 推荐方式

```bash
git add <specific-file>                  # 暂存特定文件
git add src/components/BalanceCard.vue   # 暂存特定文件
```

### 禁止方式

```bash
git add -A                               # ❌ 禁止（可能包含敏感文件）
git add .                                # ❌ 禁止（可能包含敏感文件）
```

---

## 提交前检查

### 检查清单

```bash
git status                               # 查看状态
git diff                                 # 查看变更
git diff --staged                        # 查看暂存的变更
git log --oneline -5                     # 查看最近提交
```

### 必须确认

1. **代码审查通过** - 使用 `/code-review`
2. **功能验证通过** - 使用 `/verification-before-completion`
3. **测试通过** - 运行 `npx vitest run`
4. **文档已更新** - 见 `docs/rules/docs-workflow.md`
5. **git-commits.md 已更新** - 建立 commit ↔ 需求映射

---

## 推送规范

### 推送到远程

```bash
git push                                 # 推送到远程
git push -u origin feature/xxx           # 首次推送并设置上游
```

### 禁止操作

```bash
git push --force                         # ❌ 禁止（会覆盖远程历史）
git push --force-with-lease              # ⚠️ 谨慎使用
```

---

## 回退策略

### 回退本地提交

```bash
git reset --soft HEAD~1                  # 回退提交，保留变更
git reset --mixed HEAD~1                 # 回退提交，保留变更在工作区
git reset --hard HEAD~1                  # ⚠️ 回退提交，丢弃变更（谨慎使用）
```

### 回退远程提交

```bash
git revert <commit-hash>                 # 创建新提交来撤销（推荐）
```

---

## 常用 Git 命令

### 查看状态

```bash
git status                               # 查看工作区状态
git diff                                 # 查看未暂存的变更
git diff --staged                        # 查看已暂存的变更
git log --oneline -10                    # 查看最近 10 条提交
git log --graph --oneline                # 查看分支图
```

### 分支操作

```bash
git branch                               # 列出本地分支
git branch -a                            # 列出所有分支
git branch feature/xxx                   # 创建分支
git checkout feature/xxx                 # 切换分支
git checkout -b feature/xxx              # 创建并切换分支
git branch -d feature/xxx                # 删除分支
```

### 暂存操作

```bash
git stash                                # 暂存当前变更
git stash list                           # 列出所有暂存
git stash pop                            # 恢复最近暂存
git stash drop                           # 删除最近暂存
```

---

## 常见错误

### ❌ 必须避免

1. **在 master 分支开发** → 必须在 feature 分支或 worktree
2. **使用 `git add -A`** → 可能包含敏感文件
3. **使用 `git push --force`** → 会覆盖远程历史
4. **提交前不审查** → 必须先调用 `/code-review`
5. **提交前不验证** → 必须先调用 `/verification-before-completion`
6. **忘记更新文档** → 必须先更新 `docs/rules/docs-workflow.md`

### ✅ 最佳实践

1. **频繁提交** → 小步提交，便于回退
2. **使用有意义的提交信息** → 说明做了什么、为什么
3. **提交前检查** → 运行 `git status` 和 `git diff`
4. **使用 worktree** → 隔离工作，不影响主分支
5. **提交前运行测试** → 确保代码质量
