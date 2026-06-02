# 测试策略规则

GoldenPaw 项目的测试方法和工具。

---

## 测试金字塔

```
        E2E 测试（Playwright）
              ↑
        组件测试（Vue Test Utils）
              ↑
        单元测试（Vitest）
```

---

## 测试类型

### 1. 单元测试

**工具**: Vitest

**适用场景**:
- Store 逻辑（Pinia stores）
- 工具函数（utils）
- 计算逻辑

**何时使用 TDD**:
- 可测试的业务逻辑 → **必须** TDD（`/test-driven-development`）
- 简单的工具函数 → 推荐 TDD
- 复杂的状态管理 → **必须** TDD

**示例**:
```typescript
// src/utils/formatAmount.test.ts
import { describe, it, expect } from 'vitest'
import { formatAmount } from './formatAmount'

describe('formatAmount', () => {
  it('formats positive amount correctly', () => {
    expect(formatAmount(1234.56)).toBe('¥1,234.56')
  })
})
```

### 2. 组件测试

**工具**: Vue Test Utils + Vitest

**适用场景**:
- Vue 组件交互
- 事件处理
- 状态渲染

**何时使用 TDD**:
- 复杂的组件逻辑 → 推荐 TDD
- 简单的展示组件 → 不需要 TDD

**示例**:
```typescript
// src/components/BalanceCard.test.ts
import { mount } from '@vue/test-utils'
import BalanceCard from './BalanceCard.vue'

describe('BalanceCard', () => {
  it('renders amount correctly', () => {
    const wrapper = mount(BalanceCard, {
      props: { amount: 1234.56 }
    })
    expect(wrapper.text()).toContain('¥1,234.56')
  })
})
```

### 3. E2E 测试

**工具**: Playwright

**适用场景**:
- 完整用户流程
- 页面导航
- 表单提交

**何时使用**:
- 新增页面后 → 必须测试核心流程
- 重要功能变更后 → 必须回归测试
- 提交前 → 运行关键测试

**示例**:
```typescript
// tests/e2e/transaction.spec.ts
import { test, expect } from '@playwright/test'

test('add transaction', async ({ page }) => {
  await page.goto('/')
  await page.click('button:has-text("记账")')
  await page.fill('input[name="amount"]', '100')
  await page.click('button:has-text("保存")')
  await expect(page.locator('.transaction-list')).toContainText('100')
})
```

---

## 测试驱动开发（TDD）流程

### 使用技能

```
/test-driven-development
```

### 标准流程

```
1. 写失败的测试（Red）
   ↓
2. 写最少的代码让测试通过（Green）
   ↓
3. 重构代码，保持测试通过（Refactor）
   ↓
4. 重复
```

### 何时使用 TDD

| 场景 | 是否使用 TDD | 说明 |
|------|-------------|------|
| Store 逻辑 | ✅ 必须 | 复杂状态管理需要测试保障 |
| 工具函数 | ✅ 推荐 | 纯函数易于测试 |
| Vue 组件逻辑 | ⚠️ 可选 | 根据复杂度决定 |
| UI 样式 | ❌ 不需要 | 样式难以单元测试 |
| API 调用 | ✅ 推荐 | 使用 mock 测试 |

---

## 测试运行

### 运行单元测试

```bash
npx vitest run                           # 运行所有测试
npx vitest run --watch                   # 监视模式
npx vitest run src/utils                 # 运行特定目录
npx vitest run src/utils/formatAmount    # 运行特定文件
```

### 运行组件测试

```bash
npx vitest run src/components            # 运行组件测试
```

### 运行 E2E 测试

```bash
npx playwright test                      # 运行所有 E2E 测试
npx playwright test tests/e2e/home       # 运行特定测试
npx playwright test --headed             # 有界面模式
```

---

## 测试覆盖率

### 目标

- 单元测试：80%+
- 组件测试：70%+
- E2E 测试：核心流程 100%

### 检查覆盖率

```bash
npx vitest run --coverage                # 生成覆盖率报告
```

---

## Mock 策略

### Pinia Store Mock

```typescript
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})
```

### API Mock

```typescript
import { vi } from 'vitest'
vi.mock('@/utils/api', () => ({
  fetchTransactions: vi.fn().mockResolvedValue([])
}))
```

---

## 测试检查清单

### 开发前

- [ ] 确定是否需要 TDD
- [ ] 如果需要，调用 `/test-driven-development`

### 开发中

- [ ] 编写测试用例
- [ ] 确保测试通过
- [ ] 保持测试独立性

### 完成后

- [ ] 运行所有相关测试
- [ ] 检查测试覆盖率
- [ ] 更新文档（见 `docs/rules/docs-workflow.md`）

### 提交前

- [ ] 运行 `npx vitest run`
- [ ] 运行关键 E2E 测试
- [ ] 确保所有测试通过
