<template>
  <view class="app">
    <!-- 页面标题 -->
    <view class="page-title-bar">
      <text class="page-title">AI记账助手</text>
    </view>

    <!-- AI 状态卡片 -->
    <view class="ai-status">
      <view class="ai-avatar">
        <text class="ai-avatar-text">🤖</text>
      </view>
      <text class="ai-name">GoldenPaw AI</text>
      <text class="ai-desc">语音记账 · 智能分析 · 一句话搞定</text>
      <view class="ai-pulse">
        <view class="pulse-dot"></view>
        <text class="pulse-text">在线</text>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="ai-grid">
      <view class="ai-card" v-for="action in quickActions" :key="action.title" @tap="action.onTap">
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
        <text class="chat-title">对话</text>
        <text class="chat-clear" @tap="clearChat">清空</text>
      </view>

      <view
        class="chat-bubble"
        :class="msg.role"
        v-for="(msg, idx) in messages"
        :key="idx"
      >
        <text class="chat-bubble-text">{{ msg.content }}</text>
        <text class="chat-bubble-time">{{ msg.time }}</text>
      </view>

      <!-- Loading -->
      <view v-if="isLoading" class="chat-bubble ai">
        <text class="chat-bubble-text">思考中…</text>
      </view>

      <view class="chat-suggestion" v-if="messages.length <= 1 && !isLoading">
        <view
          class="suggestion-chip"
          v-for="item in suggestions"
          :key="item"
          @tap="onSuggestionTap(item)"
        >
          <text class="suggestion-text">"{{ item }}"</text>
        </view>
      </view>
    </view>

    <!-- 底部聊天输入栏 -->
    <view class="chat-input">
      <input
        class="chat-input-field"
        v-model="inputText"
        :placeholder="isLoading ? 'AI思考中…' : '说点什么...'"
        :disabled="isLoading"
        confirm-type="send"
        @confirm="sendMessage"
      />
      <view class="chat-send" :class="{ disabled: !inputText.trim() || isLoading }" @tap="sendMessage">
        <uni-icons type="paperplane" size="16" color="#fff" />
      </view>
    </view>

    <TabBar />
    <RecordSheet />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import { useAccountStore } from '@/stores/account'
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'
import { getToday } from '@/utils/format'
import { callDeepSeek, parseTransactionFallback, mapCategoryNameToId, type AIResult } from '@/utils/deepseek'

const appStore = useAppStore()
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()

onShow(() => {
  appStore.setCurrentTab(1)
})

/* ─── State ─── */
const inputText = ref('')
const isLoading = ref(false)

interface ChatMessage {
  role: 'ai' | 'user'
  content: string
  time: string
}

const messages = ref<ChatMessage[]>([
  {
    role: 'ai',
    content:
      '你好！我是 GoldenPaw AI，接入了 DeepSeek 大模型。你可以对我说：\n• "早餐15块" — 自动记账\n• "本月花了多少" — 消费分析\n• "工资到账8000" — 记录收入',
    time: '刚刚',
  },
])

const suggestions = ['早餐15块', '本月花了多少', '工资到账8000']

/** 获取用于 API 调用的历史消息（只取最近 10 轮，避免 token 超限） */
function getHistoryForAPI(): { role: 'user' | 'assistant'; content: string }[] {
  const hist: { role: 'user' | 'assistant'; content: string }[] = []
  // 跳过第一条 welcome 消息
  for (let i = 1; i < messages.value.length; i++) {
    const msg = messages.value[i]
    hist.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })
  }
  // 只保留最近 10 轮（20 条消息）
  return hist.slice(-20)
}

/* ─── Helpers ─── */
function getCurrentTimeLabel(): string {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

function formatAmount(amount: number): string {
  return `¥${(amount / 100).toFixed(2)}`
}

function pushUser(text: string) {
  messages.value.push({ role: 'user', content: text, time: getCurrentTimeLabel() })
}

function pushAI(text: string) {
  messages.value.push({ role: 'ai', content: text, time: getCurrentTimeLabel() })
}

/* ─── Core Handler ─── */
async function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  pushUser(text)
  inputText.value = ''
  isLoading.value = true

  // 调用 DeepSeek API
  const history = getHistoryForAPI()
  const res = await callDeepSeek(history, text)

  if (!res.success) {
    // API 失败，降级到本地 fallback
    handleFallback(text)
    isLoading.value = false
    return
  }

  // 处理 AI 返回结果
  await handleAIResult(res.result)
  isLoading.value = false
}

/** 处理 AI 返回的结构化结果 */
async function handleAIResult(result: AIResult) {
  if (result.action === 'record') {
    const defaultAccount = accountStore.accounts[0]
    if (!defaultAccount) {
      pushAI('请先添加一个账户，我才能帮你记账哦~')
      return
    }
    // 将中文分类名映射为 categoryId
    const categoryId = mapCategoryNameToId(result.category, result.type)
    const amountCents = Math.round(result.amount * 100)
    const tx = transactionStore.addTransaction({
      type: result.type,
      amount: amountCents,
      categoryId,
      accountId: defaultAccount.id,
      note: result.note || result.category,
    })
    accountStore.updateBalance(defaultAccount.id, result.type === 'income' ? amountCents : -amountCents)
    const cat = categoryStore.getCategoryById(categoryId)
    pushAI(
      `已记录：${cat?.name || result.category}${result.type === 'income' ? '收入' : '支出'} ${formatAmount(amountCents)}\n` +
      `分类：${cat?.icon || '💰'} ${cat?.name || result.category}\n时间：${tx.date}`
    )
    return
  }

  if (result.action === 'analysis') {
    const reply = buildAnalysisReply(result.query)
    pushAI(reply)
    return
  }

  // chat
  pushAI(result.reply)
}

/** 本地 fallback（DeepSeek 不可用时） */
function handleFallback(text: string) {
  // 分析查询
  const reply = buildAnalysisReply(text)
  if (reply) {
    pushAI(reply)
    return
  }

  // 记账解析
  const parsed = parseTransactionFallback(text)
  if (parsed.success && parsed.amount) {
    const defaultAccount = accountStore.accounts[0]
    if (!defaultAccount) {
      pushAI('请先添加一个账户，我才能帮你记账哦~')
      return
    }
    const tx = transactionStore.addTransaction({
      type: parsed.type!,
      amount: parsed.amount,
      categoryId: parsed.categoryId!,
      accountId: defaultAccount.id,
      note: parsed.note!,
    })
    accountStore.updateBalance(defaultAccount.id, parsed.type === 'income' ? parsed.amount : -parsed.amount)
    const cat = categoryStore.getCategoryById(parsed.categoryId!)
    pushAI(
      `已记录：${cat?.name || '其他'}${parsed.type === 'income' ? '收入' : '支出'} ${formatAmount(parsed.amount)}\n` +
      `分类：${cat?.icon || '💰'} ${cat?.name || '其他'}\n时间：${tx.date}`
    )
    return
  }

  pushAI('抱歉，我没听懂。你可以这样说：\n• "早餐15块"\n• "打车28元"\n• "本月花了多少"\n• "工资到账8000"')
}

/** 构建分析查询回复 */
function buildAnalysisReply(query: string): string {
  const t = query.toLowerCase()

  // 本月收支
  if (t.includes('本月') && (t.includes('花') || t.includes('支出') || t.includes('消费') || t.includes('多少') || t.includes('概况'))) {
    const expense = transactionStore.monthlyExpense
    const income = transactionStore.monthlyIncome
    return `本月收支概况：\n• 支出：${formatAmount(expense)}\n• 收入：${formatAmount(income)}\n• 结余：${formatAmount(income - expense)}`
  }

  // 本月收入
  if (t.includes('本月') && (t.includes('收入') || t.includes('赚') || t.includes('到账'))) {
    return `本月收入共计：${formatAmount(transactionStore.monthlyIncome)}`
  }

  // 总支出
  if ((t.includes('总') || t.includes('一共') || t.includes('累计')) && (t.includes('支出') || t.includes('花'))) {
    const total = transactionStore.transactions
      .filter(tx => tx.type === 'expense')
      .reduce((s, tx) => s + tx.amount, 0)
    return `累计支出共计：${formatAmount(total)}`
  }

  // 总收入
  if ((t.includes('总') || t.includes('一共') || t.includes('累计')) && t.includes('收入')) {
    const total = transactionStore.transactions
      .filter(tx => tx.type === 'income')
      .reduce((s, tx) => s + tx.amount, 0)
    return `累计收入共计：${formatAmount(total)}`
  }

  return ''
}

function clearChat() {
  messages.value = [
    {
      role: 'ai',
      content:
        '对话已清空。接入了 DeepSeek 大模型，你可以对我说：\n• "早餐15块" — 自动记账\n• "本月花了多少" — 消费分析\n• "工资到账8000" — 记录收入',
      time: getCurrentTimeLabel(),
    },
  ]
}

function onSuggestionTap(text: string) {
  inputText.value = text
  sendMessage()
}

/* ─── Quick Actions ─── */
function goBack() {
  uni.navigateBack()
}

/** 启动语音输入 */
function startVoiceInput() {
  // #ifdef H5
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRecognition) {
    pushAI('当前浏览器不支持语音输入，请直接在下方的输入框中输入')
    return
  }
  const recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  pushAI('🎙️ 正在聆听，请说话...')

  recognition.onresult = (event: any) => {
    const text = event.results[0][0].transcript
    inputText.value = text
    sendMessage()
  }

  recognition.onerror = (event: any) => {
    pushAI('语音识别出错：' + (event.error || '未知错误'))
  }

  recognition.onend = () => {
    // 识别结束，如果输入框为空则提示
    if (!inputText.value) {
      pushAI('未识别到语音，请重试或直接输入')
    }
  }

  recognition.start()
  // #endif
  // #ifndef H5
  pushAI('语音输入仅在 H5 环境可用，请直接在下方的输入框中输入')
  // #endif
}

const quickActions = [
  {
    icon: '🎙️',
    title: '语音记账',
    desc: '说"午餐35块"自动识别',
    iconClass: 'voice',
    onTap: startVoiceInput,
  },
  {
    icon: '💬',
    title: '聊天记账',
    desc: '像聊天一样记录收支',
    iconClass: 'chat',
    onTap: () => {
      inputText.value = '午餐吃了麦当劳，花了42块5'
      sendMessage()
    },
  },
  {
    icon: '📷',
    title: '票据识别',
    desc: '拍照自动提取金额商户',
    iconClass: 'camera',
    onTap: () => {
      pushAI('票据识别功能正在开发中，敬请期待！')
    },
  },
  {
    icon: '📊',
    title: '智能分析',
    desc: '问"本月餐饮花多少"',
    iconClass: 'analyze',
    onTap: () => {
      inputText.value = '本月花了多少'
      sendMessage()
    },
  },
]
</script>

<style lang="scss" scoped>
@use '../../styles/design-system' as *;
@use '../../styles/mixins' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
  padding-bottom: 160px;
}

.page-title-bar {
  padding: 48px $space-6 12px;
}

.page-title {
  @include text-h1;
  font-size: 22px;
  color: $text-primary;
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

  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}

.chat-send-text {
  color: white;
  font-size: 18px;
  font-weight: 700;
}
</style>
