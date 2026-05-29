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

      <view class="chat-suggestion" v-if="messages.length <= 1">
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
        placeholder="说点什么..."
        confirm-type="send"
        @confirm="sendMessage"
      />
      <view class="chat-send" :class="{ disabled: !inputText.trim() }" @tap="sendMessage">
        <uni-icons type="paperplane" size="16" color="#fff" />
      </view>
    </view>

    <TabBar />
    <RecordSheet />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import { useAccountStore } from '@/stores/account'
import TabBar from '@/components/TabBar.vue'
import RecordSheet from '@/components/RecordSheet.vue'
import { getToday } from '@/utils/format'

const appStore = useAppStore()
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()

onShow(() => {
  appStore.setCurrentTab(1)
})

/* ─── State ─── */
const inputText = ref('')

interface ChatMessage {
  role: 'ai' | 'user'
  content: string
  time: string
}

const messages = ref<ChatMessage[]>([
  {
    role: 'ai',
    content:
      '你好！我是你的AI记账助手。你可以对我说：\n• "早餐15块" — 自动记账\n• "本月花了多少" — 消费分析\n• "工资到账8000" — 记录收入',
    time: '刚刚',
  },
])

const suggestions = ['早餐15块', '本月花了多少', '工资到账8000']

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

/* ─── Natural Language Parser ─── */
const CATEGORY_KEYWORDS: Record<string, string> = {
  // 支出
  '餐饮': 'cat-food', '饭': 'cat-food', '吃': 'cat-food', '餐': 'cat-food',
  '早餐': 'cat-food', '午餐': 'cat-food', '晚餐': 'cat-food', '夜宵': 'cat-food',
  '麦当劳': 'cat-food', '肯德基': 'cat-food', '咖啡': 'cat-food', '奶茶': 'cat-food',
  '水果': 'cat-food', '外卖': 'cat-food', '超市': 'cat-food',

  '交通': 'cat-transport', '打车': 'cat-transport', '滴滴': 'cat-transport',
  '地铁': 'cat-transport', '公交': 'cat-transport', '高铁': 'cat-transport',
  '火车': 'cat-transport', '油费': 'cat-transport', '停车费': 'cat-transport',

  '居住': 'cat-housing', '房租': 'cat-housing', '水电': 'cat-housing',
  '物业': 'cat-housing', '燃气': 'cat-housing',

  '购物': 'cat-shopping', '买': 'cat-shopping', '淘宝': 'cat-shopping',
  '京东': 'cat-shopping', '衣服': 'cat-shopping', '鞋': 'cat-shopping',
  '包': 'cat-shopping', '化妆品': 'cat-shopping',

  '娱乐': 'cat-entertainment', '电影': 'cat-entertainment', '游戏': 'cat-entertainment',
  '玩': 'cat-entertainment', 'KTV': 'cat-entertainment', '酒吧': 'cat-entertainment',

  '通讯': 'cat-communication', '话费': 'cat-communication', '流量': 'cat-communication',
  '宽带': 'cat-communication', '手机费': 'cat-communication',

  '医疗': 'cat-medical', '药': 'cat-medical', '医院': 'cat-medical',
  '看病': 'cat-medical', '挂号': 'cat-medical',

  '学习': 'cat-education', '书': 'cat-education', '课程': 'cat-education',
  '学费': 'cat-education', '培训': 'cat-education', '考试': 'cat-education',

  '人情': 'cat-gift', '红包': 'cat-gift', '礼物': 'cat-gift', '送礼': 'cat-gift',

  '宠物': 'cat-pet', '猫': 'cat-pet', '狗': 'cat-pet', '猫粮': 'cat-pet', '狗粮': 'cat-pet',

  // 收入
  '工资': 'cat-salary', '薪水': 'cat-salary', '月薪': 'cat-salary',
  '奖金': 'cat-bonus', '年终奖': 'cat-bonus',
  '投资': 'cat-investment-income', '股票': 'cat-investment-income',
  '基金': 'cat-investment-income', '理财': 'cat-investment-income', '收益': 'cat-investment-income',
}

function detectAmount(text: string): number | null {
  // 匹配 35块, 35元, 35.5, ¥35, 35.50元 等
  const patterns = [
    /(\d+(?:\.\d{1,2})?)\s*(?:块|元|块钱)/,
    /[¥￥]\s*(\d+(?:\.\d{1,2})?)/,
    /(\d+(?:\.\d{1,2})?)\s*(?:元|块)/,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m) return Math.round(parseFloat(m[1]) * 100)
  }
  // 纯数字，如果在合理范围
  const numMatch = text.match(/(\d+(?:\.\d{1,2})?)/)
  if (numMatch) {
    const n = parseFloat(numMatch[1])
    if (n > 0 && n < 1000000) return Math.round(n * 100)
  }
  return null
}

function detectCategory(text: string, type: 'expense' | 'income'): string {
  const defaults = type === 'expense' ? 'cat-other-expense' : 'cat-other-income'
  for (const [keyword, catId] of Object.entries(CATEGORY_KEYWORDS)) {
    if (text.includes(keyword)) return catId
  }
  return defaults
}

function detectType(text: string): 'expense' | 'income' {
  const incomeWords = ['工资', '奖金', '收入', '收到', '到账', '发钱', '赚钱', '收益', '退款', '报销']
  for (const w of incomeWords) {
    if (text.includes(w)) return 'income'
  }
  return 'expense'
}

function parseTransaction(text: string):
  | { success: true; amount: number; categoryId: string; type: 'expense' | 'income'; note: string }
  | { success: false } {
  const amount = detectAmount(text)
  if (!amount) return { success: false }
  const type = detectType(text)
  const categoryId = detectCategory(text, type)
  return { success: true, amount, categoryId, type, note: text }
}

/* ─── Analysis Queries ─── */
function analyzeQuery(text: string): string | null {
  const t = text.toLowerCase()
  const today = getToday()
  const monthPrefix = today.slice(0, 7)

  // 本月支出
  if (t.includes('本月') && (t.includes('花') || t.includes('支出') || t.includes('消费') || t.includes('多少'))) {
    const expense = transactionStore.monthlyExpense
    const income = transactionStore.monthlyIncome
    return `本月收支概况：\n• 支出：${formatAmount(expense)}\n• 收入：${formatAmount(income)}\n• 结余：${formatAmount(income - expense)}`
  }

  // 本月收入
  if (t.includes('本月') && (t.includes('收入') || t.includes('赚') || t.includes('到账'))) {
    return `本月收入共计：${formatAmount(transactionStore.monthlyIncome)}`
  }

  // 总支出 / 总计
  if ((t.includes('总') || t.includes('一共') || t.includes('累计')) && (t.includes('支出') || t.includes('花'))) {
    const totalExpense = transactionStore.transactions
      .filter(tx => tx.type === 'expense')
      .reduce((s, tx) => s + tx.amount, 0)
    return `累计支出共计：${formatAmount(totalExpense)}`
  }

  // 总收入
  if ((t.includes('总') || t.includes('一共') || t.includes('累计')) && t.includes('收入')) {
    const totalIncome = transactionStore.transactions
      .filter(tx => tx.type === 'income')
      .reduce((s, tx) => s + tx.amount, 0)
    return `累计收入共计：${formatAmount(totalIncome)}`
  }

  return null
}

/* ─── Core Handler ─── */
function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  pushUser(text)
  inputText.value = ''

  // 优先检查是否是分析查询
  const analysis = analyzeQuery(text)
  if (analysis) {
    pushAI(analysis)
    return
  }

  // 尝试解析为记账指令
  const parsed = parseTransaction(text)
  if (parsed.success) {
    const defaultAccount = accountStore.accounts[0]
    if (!defaultAccount) {
      pushAI('请先添加一个账户，我才能帮你记账哦~')
      return
    }
    const tx = transactionStore.addTransaction({
      type: parsed.type,
      amount: parsed.amount,
      categoryId: parsed.categoryId,
      accountId: defaultAccount.id,
      note: parsed.note,
    })
    accountStore.updateBalance(defaultAccount.id, parsed.type === 'income' ? parsed.amount : -parsed.amount)
    const cat = categoryStore.getCategoryById(parsed.categoryId)
    pushAI(
      `已记录：${cat?.name || '其他'}${parsed.type === 'income' ? '收入' : '支出'} ${formatAmount(parsed.amount)}\n` +
      `分类：${cat?.icon || '💰'} ${cat?.name || '其他'}\n时间：${tx.date}`
    )
    return
  }

  // 无法解析
  pushAI('抱歉，我没听懂。你可以这样说：\n• "早餐15块"\n• "打车28元"\n• "本月花了多少"\n• "工资到账8000"')
}

function clearChat() {
  messages.value = [
    {
      role: 'ai',
      content:
        '对话已清空。你可以对我说：\n• "早餐15块" — 自动记账\n• "本月花了多少" — 消费分析\n• "工资到账8000" — 记录收入',
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

const quickActions = [
  {
    icon: '🎙️',
    title: '语音记账',
    desc: '说"午餐35块"自动识别',
    iconClass: 'voice',
    onTap: () => {
      pushAI('请直接在下方的输入框中输入，例如："早餐15块"、"打车28元"')
    },
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
