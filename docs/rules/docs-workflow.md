# 文档工作流规则

GoldenPaw 项目的文档管理流程，强制执行。

---

## 核心原则

1. **所有文档时间必须精确到秒** - 格式：`YYYY-MM-DD HH:MM:SS`
2. **所有引用必须使用 ID** - 禁止只用文字描述（需求 `[R-xxx]`、功能 `[F-xxx]`、问题 `[ISS-xxx]`）
3. **每次代码变更都必须同步文档** - 不能遗漏

---

## 文档更新时机

### 开始任务时（动手写代码之前）

| 触发条件 | 动作 | 必须更新的文档 |
|---------|------|--------------|
| 修复 Bug | 新建 `[ISS-xxx]`，关联 `[R-xxx]` | `issues.md` |
| 开发新功能 | 找到 `[R-xxx]`，标记 `🔄` | `requirements.md` |
| 开发新功能但无对应需求 | 新建 `[R-xxx]`，标记 `🔄` | `requirements.md` |

### 开发过程中（遇到情况时立即更新）

| 触发条件 | 动作 | 必须更新的文档 |
|---------|------|--------------|
| 发现新的 Bug 或技术债务 | 新建 `[ISS-xxx]` | `issues.md` |
| 做了重要的技术决策或架构变更 | 更新设计文档 | `design.md` |
| 新增了文件 | 更新文件树和页面跳转关系 | `navigation.md` |

### 完成任务后（代码写完、验证通过）

| 触发条件 | 动作 | 必须更新的文档 |
|---------|------|--------------|
| 新功能开发完成 | 标记 `✅` + 新建/更新 `[F-xxx]` + 新增条目 | `requirements.md` + `features.md` + `changelog.md` |
| Bug 修复完成 | 标记 `closed` + 新增条目 | `issues.md` + `changelog.md` |
| 任何代码变更 | 新增条目，标注 `[R-xxx]` + `[ISS-xxx]` + 文件列表 | `changelog.md` |

### 提交前（最后检查）

| 触发条件 | 动作 | 必须更新的文档 |
|---------|------|--------------|
| 准备 git commit | 追加一行，建立 commit ↔ 需求映射 | `git-commits.md` |

---

## 文档关联关系

```
requirements.md [R-xxx] ──→ features.md [F-xxx] ──→ issues.md [ISS-xxx]
       ↑                           ↑                      ↑
       └───────────────────────────┴──────────────────────┘
                         changelog.md
                         git-commits.md
```

- **纵向（功能维度）**：requirements → features → issues
- **横向（时间维度）**：git-commits → changelog
- 两者通过 `[R-xxx]` / `[ISS-xxx]` ID 串联

---

## 各文档格式快速参考

### requirements.md

```markdown
## 页面名 [R-xxx ~ R-xxx]

| ID | 需求描述 | 优先级 | 状态 | 关联功能 |
|----|---------|--------|------|---------|
| R-xxx | 需求描述 | P0 | ✅ | [F-xxx] |
```

- **只写「要什么」** - 不写实现方式、文件路径、技术细节
- 状态：✅ 已完成 | 🔄 开发中 | ⏳ 待开发 | ❌ 已废弃

### features.md

```markdown
## [F-xxx] 功能描述 ← [R-xxx]

**状态**: 已完成  **实现时间**: YYYY-MM-DD HH:MM:SS  **最后更新**: YYYY-MM-DD HH:MM:SS

**实现方式**:
- ...

**关联文件**:
- `src/...`

**已知问题**:
- [ISS-xxx] 问题描述
```

- **只写「怎么做」** - 必须标注 `[R-xxx]` 反向索引
- 记录关联的 Bug（引用 `[ISS-xxx]`）

### issues.md

```markdown
## Open（未解决）

### [ISS-xxx] 问题标题
- **关联需求**: [R-xxx]
- **关联功能**: [F-xxx]
- **问题描述**: ...
- **状态**: open
- **记录时间**: YYYY-MM-DD HH:MM:SS

## Closed（已解决）

### [ISS-xxx] 问题标题
- **关联需求**: [R-xxx]
- **解决方案**: ...
- **解决提交**: YYYY-MM-DD HH:MM:SS
- **状态**: closed
- **关闭时间**: YYYY-MM-DD HH:MM:SS
```

- **只写「出了什么问题」** - 待开发功能只在 requirements.md 中
- 已解决的问题必须记录「解决提交」时间点

### changelog.md

```markdown
## YYYY-MM-DD HH:MM:SS

**需求**: [R-xxx], [R-xxx]
**问题**: [ISS-xxx]（已解决）
**修改文件**:
- `src/...` — 变更说明

**变更摘要**:
- ...
```

- **只写「本次改了什么」** - 每次提交批次写一条
- 必须标注对应的需求ID和问题ID

### git-commits.md

```markdown
| 时间 | Commit Msg | 需求范围 | 修改文件数 | 回退影响 | 备注 |
|------|-----------|---------|-----------|---------|------|
| YYYY-MM-DD HH:MM:SS | feat: 描述 | R-xxx~R-xxx | 数字 | 大/中/小 | 备注 |

**回退指南**:
- 如需回退到「...」→ 回退到 YYYY-MM-DD HH:MM:SS 之前
```

- **commit ↔ 需求映射** - 不是重复 git log
- 标注「回退影响」和「回退指南」

---

## 文档更新检查清单

| 修改类型 | 必须更新的文档 |
|---------|--------------|
| 新增功能 | `requirements.md` + `features.md` + `changelog.md` |
| 修改现有功能 | `features.md` + `changelog.md` |
| 修复 Bug | `issues.md`（标记 closed）+ `changelog.md` |
| 数据模型变更 | `features.md` + `design.md` + `changelog.md` |
| 架构调整 | `design.md` |
| 新增/删除文件 | `navigation.md`（强制，禁止遗漏） |

---

## 常见错误

### ❌ 必须避免

1. **只更新代码不更新文档** → 每次变更都必须同步
2. **忘记标记需求状态** → 开发前标记 `🔄`，完成后标记 `✅`
3. **忘记新建问题** → 发现 Bug 立即新建 `[ISS-xxx]`
4. **使用文字描述代替 ID** → 必须使用 `[R-xxx]`、`[ISS-xxx]`
5. **提交前忘记更新 git-commits.md** → 每次提交前必须更新

### ✅ 最佳实践

1. **开始前先看 requirements.md** - 了解当前需求和状态
2. **边做边更新文档** - 不要等完成后再批量更新
3. **提交前检查文档** - 确保所有文档都已同步
4. **使用 ID 追踪** - 便于回溯和查找关联
