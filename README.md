# GoldenPaw 金爪

个人资产管理APP — 记账 · 存钱 · 资产追踪

## 技术栈

- **框架**: uni-app (Vue3 + Vite + TypeScript)
- **UI**: Vant 4 + 自定义组件
- **图表**: uCharts
- **状态管理**: Pinia
- **本地存储**: SQLite + uni.setStorageSync

## 快速开始

```bash
# 安装依赖
npm install

# 开发（H5）
npm run dev:h5

# 开发（微信小程序）
npm run dev:mp-weixin

# 打包
npm run build:h5
```

## 项目结构

```
src/
├── pages/          # 页面（4个Tab页 + 4个二级页）
├── components/     # 公共组件（TabBar、RecordSheet等）
├── stores/         # Pinia 状态管理
├── styles/         # 全局样式和 Design Tokens
├── types/          # TypeScript 类型定义
└── utils/          # 工具函数
```

## 文档

- [Design](docs/design.md) - 技术架构和组件设计
- [Requirements](docs/requirements.md) - 功能需求清单
- [Features](docs/features.md) - 已实现功能说明
- [Changelog](docs/changelog.md) - 变更记录
- [Navigation](docs/navigation.md) - 文件树导航

## 设计规范

遵循 [GoldenPaw Design System v1.0](GoldenPaw_Design_System_v1.md)，暖金色系主题，圆润温暖的设计语言。

---

*GoldenPaw — 抓住每一笔财富*
