<template>
  <view class="app">
    <!-- Header -->
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">AI记账助手</text>
    </view>

    <!-- AI 状态卡片 -->
    <view class="ai-status">
      <view class="ai-avatar">
        <text class="ai-avatar-text">🤖</text>
      </view>
      <text class="ai-name">GoldenPaw AI</text>
      <text class="ai-desc">语音记账 · 票据识别 · 智能分析</text>
      <view class="ai-pulse">
        <view class="pulse-dot"></view>
        <text class="pulse-text">在线</text>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="ai-grid">
      <view class="ai-card" v-for="action in quickActions" :key="action.title">
        <view class="ai-card-icon" :class="action.iconClass">
          <text class="ai-card-icon-text">{{ action.icon }}</text>
        </view>
        <text class="ai-card-title">{{ action.title }}</text>
        <text class="ai-card-desc">{{ action.desc }}</text>
      </view>
    </view>

    <!-- 聊天历史 -->
    <view class="chat-section">
      <view class="chat-header">
        <text class="chat-title">最近对话</text>
        <text class="chat-clear">清空</text>
      </view>

      <view class="chat-bubble ai">
        <text class="chat-bubble-text">你好！我是你的AI记账助手。你可以对我说：\n• "早餐15块" — 语音记账\n• "分析本月消费" — 智能分析\n• "截图识别" — 票据录入</text>
        <text class="chat-bubble-time">刚刚</text>
      </view>

      <view class="chat-bubble user">
        <text class="chat-bubble-text">午餐吃了麦当劳，花了42块5</text>
        <text class="chat-bubble-time">2分钟前</text>
      </view>

      <view class="chat-bubble ai">
        <text class="chat-bubble-text">已记录：餐饮支出 ¥42.50\n分类：餐饮美食\n时间：今天 12:30</text>
        <text class="chat-bubble-time">2分钟前</text>
      </view>

      <view class="chat-suggestion">
        <view class="suggestion-chip" v-for="item in suggestions" :key="item" @tap="onSuggestionTap(item)">
          <text class="suggestion-text">"{{ item }}"</text>
        </view>
      </view>
    </view>

    <!-- 底部聊天输入栏 -->
    <view class="chat-input">
      <input class="chat-input-field" placeholder="说点什么..." />
      <view class="chat-send">
        <text class="chat-send-text">↑</text>
      </view>
    </view>

    <TabBar />
    <RecordSheet />
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'

const appStore = useAppStore()

onShow(() => {
  appStore.setCurrentTab(1)
})

/** 返回上一页 */
function goBack() {
  uni.navigateBack()
}

/** 快捷操作列表 */
const quickActions = [
  { icon: '🎙️', title: '语音记账', desc: '说"午餐35块"自动识别', iconClass: 'voice' },
  { icon: '💬', title: '聊天记账', desc: '像聊天一样记录收支', iconClass: 'chat' },
  { icon: '📷', title: '票据识别', desc: '拍照自动提取金额商户', iconClass: 'camera' },
  { icon: '📊', title: '智能分析', desc: '问"本月餐饮花多少"', iconClass: 'analyze' },
]

/** 建议话术 */
const suggestions = ['打车28元', '本月花了多少', '识别这张发票']

/** 点击建议话术 */
function onSuggestionTap(text: string) {
  console.log('发送建议:', text)
}
</script>

<style lang="scss" scoped>
@use '../../styles/design-system' as *;
@use '../../styles/mixins' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
  padding-bottom: 160px;
}

/* ===== Header ===== */
.header {
  padding: 48px $space-6 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  @include icon-btn;
}

.back-icon {
  font-size: 20px;
  color: $text-secondary;
}

.header-title {
  @include text-h3;
  letter-spacing: -0.3px;
}

/* ===== AI 状态卡片 ===== */
.ai-status {
  margin: 0 $space-6 20px;
  background: $surface;
  border-radius: $radius-lg;
  padding: 24px;
  box-shadow: $shadow-md;
  border: 2px solid $brand-100;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(200, 149, 108, 0.1) 0%, transparent 70%);
  }
}

.ai-avatar {
  width: 64px;
  height: 64px;
  border-radius: $radius-circle;
  background: $gradient-brand;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: $shadow-brand;
}

.ai-avatar-text {
  font-size: 32px;
}

.ai-name {
  @include text-h2;
  display: block;
  margin-bottom: 4px;
}

.ai-desc {
  @include text-caption;
  color: $text-secondary;
  display: block;
}

.ai-pulse {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 6px 14px;
  border-radius: $radius-full;
  background: $brand-50;
  border: 1px solid $brand-100;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: $radius-circle;
  background: $success-500;
  animation: pulse 2s infinite;
}

.pulse-text {
  @include text-caption;
  color: $brand-600;
  font-weight: 600;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ===== 快捷操作网格 ===== */
.ai-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 $space-6 20px;
}

.ai-card {
  background: $surface;
  border-radius: $radius-md;
  padding: 20px;
  border: 1px solid $border;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: $transition-base;

  &:active {
    transform: scale(0.96);
  }
}

.ai-card-icon {
  width: 44px;
  height: 44px;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;

  &.voice {
    background: linear-gradient(135deg, $brand-100, $bg-tertiary);
  }

  &.chat {
    background: linear-gradient(135deg, $accent-100, #D6E5EC);
  }

  &.camera {
    background: linear-gradient(135deg, $success-100, #D4E6D4);
  }

  &.analyze {
    background: linear-gradient(135deg, $danger-100, #F0D5CF);
  }
}

.ai-card-icon-text {
  font-size: 22px;
}

.ai-card-title {
  @include text-body;
  color: $text-primary;
  margin-bottom: 4px;
  display: block;
}

.ai-card-desc {
  @include text-caption;
  color: $text-secondary;
  display: block;
}

/* ===== 聊天区 ===== */
.chat-section {
  margin: 0 $space-6 20px;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.chat-title {
  @include text-h3;
}

.chat-clear {
  @include text-caption;
  color: $text-tertiary;
  cursor: pointer;
}

.chat-bubble {
  background: $surface;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid $border;
  box-shadow: $shadow-sm;

  &.ai {
    border-bottom-left-radius: 4px;
  }

  &.user {
    border-bottom-right-radius: 4px;
    background: $brand-50;
    border-color: $brand-100;
  }
}

.chat-bubble-text {
  @include text-body;
  color: $text-primary;
  white-space: pre-line;
  display: block;
}

.chat-bubble-time {
  @include text-small;
  color: $text-tertiary;
  margin-top: 8px;
  display: block;
}

.chat-suggestion {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.suggestion-chip {
  padding: 8px 14px;
  border-radius: $radius-full;
  background: $surface;
  border: 1px solid $border;
  cursor: pointer;

  &:active {
    background: $brand-50;
    border-color: $brand-500;
  }
}

.suggestion-text {
  @include text-caption;
  color: $text-secondary;
}

/* ===== 底部输入栏 ===== */
.chat-input {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 366px;
  display: flex;
  gap: 8px;
  align-items: center;
  background: $surface;
  border-radius: $radius-full;
  padding: 8px 8px 8px 20px;
  box-shadow: $shadow-lg;
  border: 2px solid $border;
  z-index: 50;
}

.chat-input-field {
  flex: 1;
  border: none;
  background: transparent;
  @include text-body;
  color: $text-primary;
  outline: none;

  &::placeholder {
    color: $text-placeholder;
  }
}

.chat-send {
  width: 40px;
  height: 40px;
  border-radius: $radius-circle;
  background: $gradient-brand;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: $shadow-brand;
}

.chat-send-text {
  color: white;
  font-size: 18px;
  font-weight: 700;
}
</style>
