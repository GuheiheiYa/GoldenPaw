
# GoldenPaw 金爪 Design System v1.0
## 个人资产管家 · 记账 · 存钱 · 资产追踪

---

## 一、产品气质与定位

### 1.1 产品气质
**温暖专业 · 克制质感 · 成长陪伴**

GoldenPaw 不是冷冰冰的数字工具，也不是花哨的社交产品。它是一只安静趴在账本上的猫——用金色爪印帮你"抓住"每一笔财富。视觉上温暖但不甜腻，专业但不严肃，陪伴用户从记账走向资产增值的完整旅程。

### 1.2 目标用户画像
| 维度 | 描述 |
|------|------|
| **核心人群** | 22-35岁城市青年，有存钱意识但缺乏系统工具 |
| **收入阶段** | 月薪 8K-30K，开始关注理财但不想太复杂 |
| **使用动机** | 想搞清楚钱花哪了、想存下第一桶金、想追踪资产变化 |
| **审美偏好** | 讨厌广告感重的金融APP，喜欢有设计感的工具类产品 |
| **性别倾向** | 中性偏暖，男女皆宜，不刻意讨好某一方 |

### 1.3 核心使用场景
1. **碎片记账** — 饭后/购物后 10 秒内完成记录
2. **月底复盘** — 查看预算执行、消费结构、存钱进度
3. **资产盘点** — 每月初更新各账户余额，看净资产变化
4. **目标激励** — 查看存钱目标进度，获得成就感
5. **长期追踪** — 季度/年度回顾资产增长曲线

---

## 二、视觉语言提炼

### 2.1 设计语言关键词
- **圆润** — 大圆角传递亲和力，降低金融产品的冰冷感
- **呼吸** — 大量留白，信息层级清晰，不压迫
- **质感** — 渐变、微阴影、暖色调，营造"纸质账本"的温度
- **克制** — 不滥用色彩，主色仅用于关键行动点和进度指示

### 2.2 情绪板 (Mood Board)
- 材质：牛皮纸、黄铜、胡桃木、亚麻布
- 场景：午后阳光下的咖啡馆、整洁的书桌、猫咪打盹的窗台
- 关键词：Warmth / Clarity / Growth / Trust

---

## 三、Design System 规范

### 3.1 设计原则

| 原则 | 定义 | 适用场景 | 不要怎么用 |
|------|------|---------|-----------|
| **温暖优先** | 用暖色调降低金融焦虑 | 所有背景、卡片底色、空状态 | 不要用冷灰/纯黑做大面积背景 |
| **层级清晰** | 通过字重/字号/颜色建立信息层级 | 金额数字、标题、辅助文案 | 不要同一层级用多种强调手段 |
| **行动突出** | 主色仅用于可交互的核心操作 | 记账按钮、进度条、选中态 | 不要把主色用于装饰性元素 |
| **留白呼吸** | 信息块之间保持 16-24px 间距 | 卡片之间、列表项之间 | 不要塞满屏幕，边距 < 16px |
| **一致圆角** | 同层级组件圆角保持一致 | 卡片 20px、按钮 100px、小标签 8px | 不要随意混用圆角规格 |

---

### 3.2 色彩系统

#### 品牌色 (Brand)
| Token | 色值 | 角色 | 适用场景 | 不要怎么用 |
|-------|------|------|---------|-----------|
| `brand-500` | `#C8956C` | 主品牌色 | 记账按钮、进度条、选中态、金额高亮 | 不要用于大面积背景 |
| `brand-600` | `#A67B5B` | 深品牌色 | 按钮按下态、链接文字、图标强调 | 不要用于警告/错误 |
| `brand-200` | `#F5E6D3` | 浅品牌色 | 选中背景、标签底色、hover态 | 不要用于文字 |
| `brand-50` | `#FDF8F3` | 极淡品牌色 | 页面底色、卡片hover | 不要用于边框 |

#### 功能色 (Functional)
| Token | 色值 | 角色 | 适用场景 | 不要怎么用 |
|-------|------|------|---------|-----------|
| `success-500` | `#6B8E6B` | 成功/收入/达成 | 收入金额、目标达成、正向变化 | 不要用于支出/警告 |
| `success-100` | `#E8F0E8` | 成功背景 | 收入标签背景、达成提示 | 不要用于文字 |
| `danger-500` | `#C06C5F` | 危险/支出/预警 | 支出金额、超支警告、预算红线 | 不要用于正向激励 |
| `danger-100` | `#F5E0DC` | 危险背景 | 超支标签背景、删除确认 | 不要用于主按钮 |
| `accent-500` | `#7A9EAF` | 辅助/资产 | 资产账户标识、图表辅助线、次要分类 | 不要抢主色风头 |
| `accent-100` | `#E8F1F5` | 辅助背景 | 次要标签、信息提示背景 | 不要用于核心操作 |

#### 中性色 (Neutral)
| Token | 色值 | 角色 | 适用场景 | 不要怎么用 |
|-------|------|------|---------|-----------|
| `text-primary` | `#3D3229` | 主文字 | 标题、金额、核心内容 | 不要用于辅助说明 |
| `text-secondary` | `#7A6B5D` | 次要文字 | 副标题、分类名、时间 | 不要用于主标题 |
| `text-tertiary` | `#A89B8E` | 辅助文字 | 占位符、禁用态、极次要信息 | 不要用于可点击内容 |
| `bg-primary` | `#FDF8F3` | 页面底色 | 所有页面背景 | 不要用于卡片内容区 |
| `bg-secondary` | `#F7EDE0` | 次级背景 | 列表底色交替、模块区分 | 不要用于主卡片 |
| `surface` | `#FFFFFF` | 卡片表面 | 所有卡片、浮层面板、按钮 | 不要用于页面底色 |
| `border` | `#EDE4D8` | 边框/分割线 | 卡片边框、列表分割线、输入框 | 不要用于文字 |

#### 渐变规范
| 渐变名 | 定义 | 适用场景 | 不要怎么用 |
|--------|------|---------|-----------|
| `gradient-brand` | `linear-gradient(135deg, #C8956C, #A67B5B)` | 核心按钮、完成按钮、品牌强调 | 不要用于背景 |
| `gradient-success` | `linear-gradient(90deg, #6B8E6B, #8FBC8F)` | 达成进度条、正向趋势 | 不要用于支出相关 |
| `gradient-danger` | `linear-gradient(90deg, #C06C5F, #D4857A)` | 超支进度条、负向趋势 | 不要用于收入相关 |

---

### 3.3 字体系统

#### 字体栈
```css
font-family: -apple-system, 'SF Pro Display', 'Segoe UI', 'PingFang SC', 'Noto Sans SC', sans-serif;
```

#### 字号规范
| Token | 字号 | 字重 | 行高 | 字间距 | 适用场景 | 不要怎么用 |
|-------|------|------|------|--------|---------|-----------|
| `text-hero` | 40px | 800 | 1.1 | -1.5px | 首页结余金额 | 不要用于其他页面 |
| `text-h1` | 24px | 700 | 1.3 | -0.3px | 页面大标题 | 不要用于卡片内 |
| `text-h2` | 18px | 700 | 1.4 | -0.2px | 区块标题 | 不要用于按钮 |
| `text-h3` | 16px | 700 | 1.4 | 0 | 卡片标题、列表主项 | 不要用于辅助文字 |
| `text-body` | 15px | 600 | 1.5 | 0 | 列表内容、正文 | 不要用 400 字重 |
| `text-caption` | 13px | 600 | 1.4 | 0 | 副标题、分类名 | 不要小于 13px |
| `text-small` | 11px | 600 | 1.4 | 0.5px | 标签、时间、辅助 | 不要用于主内容 |
| `text-micro` | 10px | 700 | 1.3 | 1px | 角标、极次要 | 不要用大写字母 |

#### 字重规则
- **700/800**：金额数字、标题、按钮文字、进度百分比
- **600**：正文、列表项、标签
- **400**：仅用于大段说明文字（极少使用）

#### 金额数字特殊处理
```css
.amount {
  font-variant-numeric: tabular-nums;  /* 等宽数字，防止跳动 */
  letter-spacing: -1px;
  font-weight: 800;
}
```

---

### 3.4 间距与栅格

#### 基础单位
- **基础间距单位**：4px
- **栅格**：页面水平边距 28px（移动端）/ 32px（平板）

#### 间距Token
| Token | 值 | 适用场景 | 不要怎么用 |
|-------|-----|---------|-----------|
| `space-1` | 4px | 图标与文字间距、内部紧凑间距 | 不要用于模块间距 |
| `space-2` | 8px | 列表项内间距、小标签间距 | 不要用于卡片间距 |
| `space-3` | 12px | 卡片内元素间距、按钮组 | 不要用于页面边距 |
| `space-4` | 16px | 标准组件间距、列表项padding | 不要用于大模块分隔 |
| `space-5` | 20px | 卡片内部padding、表单间距 | 不要用于页面边距 |
| `space-6` | 24px | 区块标题到内容、卡片间距 | 不要用于紧凑列表 |
| `space-8` | 32px | 大模块分隔、Hero区域padding | 不要用于小元素 |
| `space-10` | 40px | 页面顶部安全区、大区块分隔 | 不要滥用 |

#### 页面边距
- 移动端：`28px` 左右边距
- 卡片内边距：`20px` 或 `24px`
- 列表项高度：最小 `56px`（保证点击区域）

---

### 3.5 圆角、边框、阴影

#### 圆角系统
| Token | 值 | 适用场景 | 不要怎么用 |
|-------|-----|---------|-----------|
| `radius-sm` | 12px | 小标签、输入框、图标容器 | 不要用于大卡片 |
| `radius-md` | 16px | 中等卡片、列表项、弹窗 | 不要用于按钮 |
| `radius-lg` | 20px | 大卡片、模块容器 | 不要用于小元素 |
| `radius-xl` | 24px | 特殊强调卡片 | 不要滥用 |
| `radius-full` | 100px | 按钮、胶囊标签、导航项 | 不要用于卡片 |
| `radius-circle` | 50% | 头像、图标按钮、状态点 | 不要用于文字容器 |

#### 边框
| Token | 值 | 适用场景 | 不要怎么用 |
|-------|-----|---------|-----------|
| `border-default` | 1px solid #EDE4D8 | 卡片边框、分割线 | 不要用 2px 做普通边框 |
| `border-emphasis` | 2px solid #EDE4D8 | 强调卡片边框 | 不要用于普通列表 |
| `border-active` | 2px solid #C8956C | 选中态、聚焦态 | 不要用于静态展示 |

#### 阴影系统
| Token | 值 | 适用场景 | 不要怎么用 |
|-------|-----|---------|-----------|
| `shadow-sm` | `0 2px 8px rgba(61,50,41,0.04)` | 小按钮、标签、hover态 | 不要用于大卡片 |
| `shadow-md` | `0 8px 24px rgba(61,50,41,0.06)` | 卡片、浮层、下拉菜单 | 不要叠加多层 |
| `shadow-lg` | `0 16px 48px rgba(61,50,41,0.08)` | 底部导航、模态框、重要浮层 | 不要用于普通元素 |
| `shadow-brand` | `0 4px 16px rgba(200,149,108,0.35)` | 记账按钮、核心CTA | 不要用于次要按钮 |

---

### 3.6 核心组件规范

#### 按钮 (Button)

**主按钮 (Primary)**
```
背景: gradient-brand
文字: white, 14px, 700
圆角: radius-full
高度: 48px
内边距: 0 24px
阴影: shadow-brand
按下: scale(0.96), opacity 0.9
```
- **适用**：记账完成、保存、核心操作
- **不要**：用于次要操作、删除、取消

**次按钮 (Secondary)**
```
背景: surface
边框: 1px solid border
文字: text-primary, 14px, 600
圆角: radius-full
高度: 44px
按下: background -> bg-primary
```
- **适用**：取消、返回、次要选项
- **不要**：用于需要强引导的场景

**图标按钮 (Icon Button)**
```
尺寸: 40x40px
背景: surface
边框: 1px solid border
圆角: 12px
图标: 20px, text-secondary
按下: scale(0.92), bg -> bg-primary
```
- **适用**：顶部操作、工具栏
- **不要**：作为主要行动点

**胶囊按钮 (Capsule)**
```
背景: 按功能色渐变
文字: 对应深色, 14px, 700
圆角: radius-full
内边距: 12px 20px
阴影: shadow-sm
```
- **适用**：快捷操作行、标签筛选
- **不要**：用于表单提交

---

#### 卡片 (Card)

**标准卡片**
```
背景: surface
圆角: radius-lg (20px)
内边距: 20px 或 24px
边框: border-default
阴影: shadow-sm
```
- **适用**：预算卡片、存钱目标、资产账户
- **不要**：用于列表项（用列表组件）

**强调卡片**
```
背景: surface
圆角: radius-lg
内边距: 24px
边框: 2px solid brand-200
阴影: shadow-md
```
- **适用**：首页余额、重要提醒
- **不要**：用于普通信息展示

**选中卡片**
```
背景: brand-50
边框: border-active
阴影: shadow-sm + inset glow
```
- **适用**：分类选中、账户选中
- **不要**：用于静态展示

---

#### 输入/表单

**金额输入**
```
字体: text-hero (40px, 800)
对齐: 右对齐
颜色: text-primary
下划线: 2px dashed border (未输入) / brand-500 (已输入)
键盘: 自定义数字键盘
```
- **适用**：记账金额输入
- **不要**：用于普通文本输入

**普通输入框**
```
高度: 48px
背景: surface
边框: 1px solid border
圆角: radius-md
内边距: 0 16px
字体: 15px, 600
聚焦: border-color -> brand-500, shadow-sm
```
- **适用**：备注、搜索、设置项
- **不要**：用于金额输入

---

#### 列表 (List)

**标准列表项**
```
高度: 最小 56px
内边距: 14px 0
分割线: 2px dashed border (底部)
图标区: 48x48px, radius-sm
标题: text-body (15px, 600)
辅助: text-caption (13px)
金额: text-body, 右对齐
```
- **适用**：流水列表、账户列表
- **不要**：分割线用实线（用虚线保持轻盈感）

**可滑动列表项**
```
左滑露出: 编辑(brand) / 删除(danger)
滑动阈值: 80px
动画: 0.3s ease
```
- **适用**：流水明细、预算管理
- **不要**：用于不可编辑的展示列表

---

#### 进度/状态

**进度条**
```
轨道: 高度 8px, bg border, radius-full
填充: 按功能色渐变
过渡: width 0.6s ease
```
- **适用**：预算剩余、存钱进度
- **不要**：用于不确定的加载状态

**环形进度**
```
尺寸: 56x56px
轨道: 4px, border
填充: 4px, brand-500
文字: 14px, 700, 居中
```
- **适用**：资产占比、目标完成度
- **不要**：用于精确数值展示

---

#### 导航

**底部导航 (TabBar)**
```
背景: surface, backdrop-filter: blur(20px)
圆角: radius-lg (悬浮, 距底 16px)
边框: 2px solid border
阴影: shadow-lg
高度: 68px
内边距: 0 8px

未选中: text-tertiary, 10px, 700
选中: brand-dark, bg -> brand-200, radius-full
图标: 22px

中间按钮: 56x56, gradient-brand, radius-circle
          阴影: shadow-brand, 边框: 3px solid surface
```
- **适用**：全局导航
- **不要**：超过 5 个 Tab

**分段控制器 (Segmented)**
```
背景: surface
圆角: radius-full
内边距: 4px
边框: 2px solid border

未选中: text-secondary, 14px, 700
选中: gradient-brand, white, shadow-sm
过渡: 0.2s ease
```
- **适用**：支出/收入/转账切换、周/月/年切换
- **不要**：超过 4 个选项

---

### 3.7 状态规范

| 状态 | 视觉表现 | 适用场景 | 不要怎么用 |
|------|---------|---------|-----------|
| **Default** | 标准样式 | 初始展示 | — |
| **Hover** | 背景微变深、阴影增强 | 桌面端鼠标悬停 | 移动端不要依赖 hover |
| **Active/Pressed** | scale(0.96)、透明度 0.9 | 按下瞬间 | 不要用于不可点击元素 |
| **Selected** | brand 边框 + brand-50 背景 | 分类选中、日期选中 | 不要用于单选以外的场景 |
| **Disabled** | opacity 0.4, 无交互 | 未满足条件时 | 不要只改颜色不改透明度 |
| **Loading** | 骨架屏 / 品牌色脉冲动画 | 数据加载 | 不要用全局 loading 遮罩 |
| **Error** | danger 边框 + danger-100 背景 + 图标 | 输入错误、同步失败 | 不要用于警告（用 Warning） |
| **Warning** | brand-500 边框 + brand-50 背景 | 预算超支 80%、即将到期 | 不要用于严重错误 |
| **Success** | success-500 图标 + success-100 背景 | 记账成功、目标达成 | 不要用于普通完成 |

---

### 3.8 图标/插画规范

#### 图标风格
- **风格**：线性图标 (Outline) + 2px 描边，选中时填充为面性
- **尺寸**：系统图标 20-24px，分类图标 28-32px
- **颜色**：默认 text-secondary，选中 brand-dark，禁用 text-tertiary
- **来源**：Phosphor Icons / Heroicons（系统级），Iconfont 自建（分类级）

#### 分类图标规范
| 分类 | 图标 | 背景色 | 选中色 |
|------|------|--------|--------|
| 餐饮 | 🍜 / 餐具 | #FAF0E6 | brand-500 |
| 交通 | 🚇 / 地铁 | #E8F0E8 | success-500 |
| 购物 | 🛍️ / 购物袋 | #F5E0DC | danger-500 |
| 居住 | 🏠 / 房子 | #E8F1F5 | accent-500 |
| 娱乐 | 🎬 / 电影 | #F5E6D3 | brand-500 |
| 医疗 | 💊 / 药丸 | #E8F0E8 | success-500 |
| 学习 | 📚 / 书本 | #E8F1F5 | accent-500 |
| 人情 | 🎁 / 礼物 | #F5E6D3 | brand-500 |
| 宠物 | 🐱 / 猫爪 | #FAF0E6 | brand-500 |
| 收入 | 💰 / 钱袋 | #E8F0E8 | success-500 |

#### 插画规范
- **风格**：扁平插画 + 暖色调，线条圆润
- **场景**：空状态、目标达成、首次引导
- **元素**：猫咪元素可融入（如空状态一只猫趴在空账本上）
- **禁忌**：不要用 3D 拟物、不要用冷色调插画

---

### 3.9 文案语气规范

#### 语气基调
**友好专业 · 鼓励成长 · 不制造焦虑**

| 场景 | 正确示例 | 错误示例 |
|------|---------|---------|
| 超支提醒 | "本月餐饮预算剩余 20%，注意控制哦" | "你已超支！请立即停止消费！" |
| 目标达成 | "恭喜！旅行基金已存够 65% 🎉" | "你还没存够钱，继续加油" |
| 空状态 | "还没有记账，记一笔开始理财之旅吧~" | "暂无数据" |
| 记账成功 | "已记录：午餐 42.5元 ✓" | "记账成功" |
| 资产增长 | "本月净资产 +¥2,340 📈" | "你的资产增加了" |

#### 数字格式
- 金额：`¥12,500.00`（千分位 + 两位小数）
- 百分比：`65%`（不加空格）
- 日期：`05-26` 或 `5月26日`（统一）
- 时间：`14:30`（24小时制）

---

### 3.10 禁用规则 / 设计红线

| # | 红线 | 后果 |
|---|------|------|
| 1 | **禁止纯黑/纯白大面积使用** | 破坏温暖质感，造成视觉疲劳 |
| 2 | **禁止超过 3 种主色同时出现** | 色彩混乱，失去品牌辨识度 |
| 3 | **禁止直角（0px 圆角）** | 与圆润设计语言冲突 |
| 4 | **禁止阴影叠加超过 2 层** | 造成脏感，降低质感 |
| 5 | **禁止金额用红色表示收入** | 违背用户认知（红=支出/亏） |
| 6 | **禁止进度条用彩虹色** | 不专业，破坏统一性 |
| 7 | **禁止按钮文字小于 14px** | 点击区域不足，可读性差 |
| 8 | **禁止列表项高度小于 48px** | 点击困难，不符合移动端规范 |
| 9 | **禁止用"加载中..."作为唯一反馈** | 用户焦虑，应用骨架屏/进度条 |
| 10 | **禁止在首页展示广告/推广** | 破坏工具属性，降低信任感 |

---

## 四、Design Tokens 输出

### 4.1 CSS Variables

```css
:root {
  /* Brand */
  --gp-brand-50: #FDF8F3;
  --gp-brand-100: #F5E6D3;
  --gp-brand-200: #EDD4B8;
  --gp-brand-300: #D4A574;
  --gp-brand-400: #C8956C;
  --gp-brand-500: #C8956C;
  --gp-brand-600: #A67B5B;
  --gp-brand-700: #8B6549;
  --gp-brand-800: #6F4F3A;
  --gp-brand-900: #3D3229;

  /* Functional */
  --gp-success-50: #F0F7F0;
  --gp-success-100: #E8F0E8;
  --gp-success-500: #6B8E6B;
  --gp-success-600: #5A7A5A;

  --gp-danger-50: #FAF0EE;
  --gp-danger-100: #F5E0DC;
  --gp-danger-500: #C06C5F;
  --gp-danger-600: #A85D52;

  --gp-accent-50: #F0F5F7;
  --gp-accent-100: #E8F1F5;
  --gp-accent-500: #7A9EAF;
  --gp-accent-600: #6A8C9C;

  /* Neutral */
  --gp-text-primary: #3D3229;
  --gp-text-secondary: #7A6B5D;
  --gp-text-tertiary: #A89B8E;
  --gp-text-placeholder: #C4B8AD;

  --gp-bg-primary: #FDF8F3;
  --gp-bg-secondary: #F7EDE0;
  --gp-bg-tertiary: #F0E6D8;
  --gp-surface: #FFFFFF;
  --gp-surface-elevated: #FFFFFF;

  --gp-border: #EDE4D8;
  --gp-border-light: #F5EDE4;
  --gp-border-focus: #C8956C;

  /* Gradients */
  --gp-gradient-brand: linear-gradient(135deg, #C8956C, #A67B5B);
  --gp-gradient-success: linear-gradient(90deg, #6B8E6B, #8FBC8F);
  --gp-gradient-danger: linear-gradient(90deg, #C06C5F, #D4857A);
  --gp-gradient-warm: linear-gradient(180deg, #FDF8F3, #F7EDE0);

  /* Shadows */
  --gp-shadow-sm: 0 2px 8px rgba(61, 50, 41, 0.04);
  --gp-shadow-md: 0 8px 24px rgba(61, 50, 41, 0.06);
  --gp-shadow-lg: 0 16px 48px rgba(61, 50, 41, 0.08);
  --gp-shadow-brand: 0 4px 16px rgba(200, 149, 108, 0.35);
  --gp-shadow-inset: inset 0 1px 2px rgba(61, 50, 41, 0.04);

  /* Radius */
  --gp-radius-sm: 12px;
  --gp-radius-md: 16px;
  --gp-radius-lg: 20px;
  --gp-radius-xl: 24px;
  --gp-radius-full: 100px;
  --gp-radius-circle: 50%;

  /* Spacing */
  --gp-space-1: 4px;
  --gp-space-2: 8px;
  --gp-space-3: 12px;
  --gp-space-4: 16px;
  --gp-space-5: 20px;
  --gp-space-6: 24px;
  --gp-space-8: 32px;
  --gp-space-10: 40px;
  --gp-space-12: 48px;

  /* Typography */
  --gp-font-sans: -apple-system, 'SF Pro Display', 'Segoe UI', 'PingFang SC', 'Noto Sans SC', sans-serif;

  --gp-text-hero: 800 40px/1.1 var(--gp-font-sans);
  --gp-text-h1: 700 24px/1.3 var(--gp-font-sans);
  --gp-text-h2: 700 18px/1.4 var(--gp-font-sans);
  --gp-text-h3: 700 16px/1.4 var(--gp-font-sans);
  --gp-text-body: 600 15px/1.5 var(--gp-font-sans);
  --gp-text-caption: 600 13px/1.4 var(--gp-font-sans);
  --gp-text-small: 600 11px/1.4 var(--gp-font-sans);
  --gp-text-micro: 700 10px/1.3 var(--gp-font-sans);

  /* Transitions */
  --gp-transition-fast: 0.15s ease;
  --gp-transition-base: 0.2s ease;
  --gp-transition-slow: 0.3s ease;
  --gp-transition-spring: 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}
```

### 4.2 Tailwind Config (参考)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF8F3',
          100: '#F5E6D3',
          200: '#EDD4B8',
          300: '#D4A574',
          400: '#C8956C',
          500: '#C8956C',
          600: '#A67B5B',
          700: '#8B6549',
          800: '#6F4F3A',
          900: '#3D3229',
        },
        success: {
          50: '#F0F7F0',
          100: '#E8F0E8',
          500: '#6B8E6B',
          600: '#5A7A5A',
        },
        danger: {
          50: '#FAF0EE',
          100: '#F5E0DC',
          500: '#C06C5F',
          600: '#A85D52',
        },
        accent: {
          50: '#F0F5F7',
          100: '#E8F1F5',
          500: '#7A9EAF',
          600: '#6A8C9C',
        },
        gp: {
          text: {
            primary: '#3D3229',
            secondary: '#7A6B5D',
            tertiary: '#A89B8E',
            placeholder: '#C4B8AD',
          },
          bg: {
            primary: '#FDF8F3',
            secondary: '#F7EDE0',
            tertiary: '#F0E6D8',
          },
          surface: '#FFFFFF',
          border: '#EDE4D8',
        },
      },
      borderRadius: {
        'gp-sm': '12px',
        'gp-md': '16px',
        'gp-lg': '20px',
        'gp-xl': '24px',
        'gp-full': '100px',
      },
      boxShadow: {
        'gp-sm': '0 2px 8px rgba(61, 50, 41, 0.04)',
        'gp-md': '0 8px 24px rgba(61, 50, 41, 0.06)',
        'gp-lg': '0 16px 48px rgba(61, 50, 41, 0.08)',
        'gp-brand': '0 4px 16px rgba(200, 149, 108, 0.35)',
      },
      spacing: {
        'gp-1': '4px',
        'gp-2': '8px',
        'gp-3': '12px',
        'gp-4': '16px',
        'gp-5': '20px',
        'gp-6': '24px',
        'gp-8': '32px',
        'gp-10': '40px',
        'gp-12': '48px',
      },
      fontFamily: {
        sans: ['-apple-system', 'SF Pro Display', 'Segoe UI', 'PingFang SC', 'Noto Sans SC', 'sans-serif'],
      },
      fontSize: {
        'gp-hero': ['40px', { lineHeight: '1.1', letterSpacing: '-1.5px', fontWeight: '800' }],
        'gp-h1': ['24px', { lineHeight: '1.3', letterSpacing: '-0.3px', fontWeight: '700' }],
        'gp-h2': ['18px', { lineHeight: '1.4', letterSpacing: '-0.2px', fontWeight: '700' }],
        'gp-h3': ['16px', { lineHeight: '1.4', fontWeight: '700' }],
        'gp-body': ['15px', { lineHeight: '1.5', fontWeight: '600' }],
        'gp-caption': ['13px', { lineHeight: '1.4', fontWeight: '600' }],
        'gp-small': ['11px', { lineHeight: '1.4', letterSpacing: '0.5px', fontWeight: '600' }],
        'gp-micro': ['10px', { lineHeight: '1.3', letterSpacing: '1px', fontWeight: '700' }],
      },
      transitionTimingFunction: {
        'gp-spring': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
}
```

### 4.3 SCSS 变量 (uni-app 推荐)

```scss
// styles/variables.scss
$gp-prefix: 'gp';

// Brand
$brand-50: #FDF8F3;
$brand-100: #F5E6D3;
$brand-200: #EDD4B8;
$brand-300: #D4A574;
$brand-400: #C8956C;
$brand-500: #C8956C;
$brand-600: #A67B5B;
$brand-700: #8B6549;
$brand-800: #6F4F3A;
$brand-900: #3D3229;

// Functional
$success-50: #F0F7F0;
$success-100: #E8F0E8;
$success-500: #6B8E6B;
$success-600: #5A7A5A;

$danger-50: #FAF0EE;
$danger-100: #F5E0DC;
$danger-500: #C06C5F;
$danger-600: #A85D52;

$accent-50: #F0F5F7;
$accent-100: #E8F1F5;
$accent-500: #7A9EAF;
$accent-600: #6A8C9C;

// Neutral
$text-primary: #3D3229;
$text-secondary: #7A6B5D;
$text-tertiary: #A89B8E;
$text-placeholder: #C4B8AD;

$bg-primary: #FDF8F3;
$bg-secondary: #F7EDE0;
$bg-tertiary: #F0E6D8;
$surface: #FFFFFF;

$border: #EDE4D8;
$border-light: #F5EDE4;
$border-focus: #C8956C;

// Shadows
$shadow-sm: 0 2px 8px rgba(61, 50, 41, 0.04);
$shadow-md: 0 8px 24px rgba(61, 50, 41, 0.06);
$shadow-lg: 0 16px 48px rgba(61, 50, 41, 0.08);
$shadow-brand: 0 4px 16px rgba(200, 149, 108, 0.35);

// Radius
$radius-sm: 12px;
$radius-md: 16px;
$radius-lg: 20px;
$radius-xl: 24px;
$radius-full: 100px;
$radius-circle: 50%;

// Spacing
$space-1: 4px;
$space-2: 8px;
$space-3: 12px;
$space-4: 16px;
$space-5: 20px;
$space-6: 24px;
$space-8: 32px;
$space-10: 40px;
$space-12: 48px;

// Typography
$font-sans: -apple-system, 'SF Pro Display', 'Segoe UI', 'PingFang SC', 'Noto Sans SC', sans-serif;

@mixin text-hero {
  font: 800 40px/1.1 $font-sans;
  letter-spacing: -1.5px;
  font-variant-numeric: tabular-nums;
}

@mixin text-h1 {
  font: 700 24px/1.3 $font-sans;
  letter-spacing: -0.3px;
}

@mixin text-h2 {
  font: 700 18px/1.4 $font-sans;
  letter-spacing: -0.2px;
}

@mixin text-h3 {
  font: 700 16px/1.4 $font-sans;
}

@mixin text-body {
  font: 600 15px/1.5 $font-sans;
}

@mixin text-caption {
  font: 600 13px/1.4 $font-sans;
}

@mixin text-small {
  font: 600 11px/1.4 $font-sans;
  letter-spacing: 0.5px;
}

@mixin text-micro {
  font: 700 10px/1.3 $font-sans;
  letter-spacing: 1px;
}

// Gradients
@mixin gradient-brand {
  background: linear-gradient(135deg, $brand-500, $brand-600);
}

@mixin gradient-success {
  background: linear-gradient(90deg, $success-500, #8FBC8F);
}

@mixin gradient-danger {
  background: linear-gradient(90deg, $danger-500, #D4857A);
}

// Transitions
$transition-fast: 0.15s ease;
$transition-base: 0.2s ease;
$transition-slow: 0.3s ease;
$transition-spring: 0.4s cubic-bezier(0.32, 0.72, 0, 1);
```

---

## 五、版本记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-05-28 | 初始版本，覆盖记账/存钱/资产三大模块 |

---

*GoldenPaw Design System — 抓住每一笔财富*
