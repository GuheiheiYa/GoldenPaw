/**
 * DeepSeek API 封装
 * 用于 AI 记账助手，自然语言解析 + 智能分析
 */

const API_BASE = import.meta.env.DEV ? '/api/deepseek' : 'https://api.deepseek.com'
const API_KEY = 'sk-18cff1e829d449d6902fd62a1ecd5dc8'

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface RecordResult {
  action: 'record'
  type: 'expense' | 'income'
  amount: number // 元
  category: string
  note: string
}

export interface AnalysisResult {
  action: 'analysis'
  query: string
}

export interface ChatResult {
  action: 'chat'
  reply: string
}

export type AIResult = RecordResult | AnalysisResult | ChatResult

/** 获取 system prompt，告知 AI 返回 JSON 格式 */
function getSystemPrompt(): string {
  return `你是一个智能记账助手，名字叫 GoldenPaw AI。用户会用自然语言描述收支情况或询问财务问题。

**规则：**
1. 如果用户想记账（提到金额和花费/收入），提取信息并返回严格 JSON：
{"action":"record","type":"expense|income","amount":数字(元),"category":"分类","note":"原始描述"}

2. 如果用户在问财务分析（如"本月花了多少""总收入是多少"），返回：
{"action":"analysis","query":"具体查询内容"}

3. 如果只是闲聊或无法识别，用自然语言回复，返回：
{"action":"chat","reply":"友好回复内容"}

**可用支出分类**（必须从这里选）：餐饮、交通、居住、购物、娱乐、通讯、医疗、学习、人情、宠物、其他
**可用收入分类**（必须从这里选）：工资、奖金、投资、其他

**注意：**
- amount 必须是数字，单位元，不要乘100
- 不要返回 markdown 代码块，只返回纯 JSON 字符串
- 回复要简洁友好，像朋友聊天一样`
}

/**
 * 调用 DeepSeek Chat Completion API
 * @param history 历史消息（不含 system）
 * @param userInput 用户最新输入
 */
export async function callDeepSeek(
  history: { role: 'user' | 'assistant'; content: string }[],
  userInput: string
): Promise<{ success: true; result: AIResult; rawReply: string } | { success: false; error: string }> {
  if (!API_KEY) {
    return { success: false, error: '请先配置 DeepSeek API Key' }
  }

  const messages: DeepSeekMessage[] = [
    { role: 'system', content: getSystemPrompt() },
    ...history,
    { role: 'user', content: userInput },
  ]

  try {
    const res = await uni.request({
      url: `${API_BASE}/chat/completions`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      data: {
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 512,
      },
    })

    // @ts-ignore uni.request 返回值结构
    const data = res.data as any
    if (data?.error) {
      return { success: false, error: data.error.message || 'API 返回错误' }
    }

    const rawReply = data?.choices?.[0]?.message?.content || ''

    // 尝试解析 JSON
    const parsed = parseAIReply(rawReply)
    if (parsed) {
      return { success: true, result: parsed, rawReply }
    }

    // 解析失败，当作聊天回复
    return {
      success: true,
      result: { action: 'chat', reply: rawReply || '我没太明白，能再说一次吗？' },
      rawReply,
    }
  } catch (err: any) {
    return { success: false, error: err.message || '网络请求失败，请检查网络或 API Key' }
  }
}

/** 解析 AI 返回的 JSON */
function parseAIReply(reply: string): AIResult | null {
  // 去除可能的 markdown 代码块标记
  const clean = reply.replace(/```json\s*|\s*```/g, '').trim()

  try {
    const data = JSON.parse(clean)
    if (data.action === 'record') {
      return {
        action: 'record',
        type: data.type === 'income' ? 'income' : 'expense',
        amount: Number(data.amount) || 0,
        category: String(data.category || '其他'),
        note: String(data.note || ''),
      }
    }
    if (data.action === 'analysis') {
      return { action: 'analysis', query: String(data.query || '') }
    }
    if (data.action === 'chat') {
      return { action: 'chat', reply: String(data.reply || '') }
    }
  } catch {
    // 不是 JSON，尝试从文本中提取
  }

  return null
}

/**
 * 本地备用解析（当 DeepSeek 不可用时降级使用）
 * 保留原来的简单规则匹配
 */
export function parseTransactionFallback(text: string): {
  success: boolean
  amount?: number
  categoryId?: string
  type?: 'expense' | 'income'
  note?: string
} {
  // 金额匹配
  const patterns = [
    /(\d+(?:\.\d{1,2})?)\s*(?:块|元|块钱)/,
    /[¥￥]\s*(\d+(?:\.\d{1,2})?)/,
    /(\d+(?:\.\d{1,2})?)\s*(?:元|块)/,
  ]
  let amount: number | undefined
  for (const p of patterns) {
    const m = text.match(p)
    if (m) {
      amount = Math.round(parseFloat(m[1]) * 100)
      break
    }
  }
  if (!amount) {
    const numMatch = text.match(/(\d+(?:\.\d{1,2})?)/)
    if (numMatch) {
      const n = parseFloat(numMatch[1])
      if (n > 0 && n < 1000000) amount = Math.round(n * 100)
    }
  }
  if (!amount) return { success: false }

  // 类型判断
  const incomeWords = ['工资', '奖金', '收入', '收到', '到账', '发钱', '赚钱', '收益', '退款', '报销']
  const type: 'expense' | 'income' = incomeWords.some(w => text.includes(w)) ? 'income' : 'expense'

  // 分类映射（简化版）
  const catMap: Record<string, string> = {
    餐饮: 'cat-food', 饭: 'cat-food', 吃: 'cat-food', 早餐: 'cat-food', 午餐: 'cat-food', 晚餐: 'cat-food',
    外卖: 'cat-food', 超市: 'cat-food',
    交通: 'cat-transport', 打车: 'cat-transport', 滴滴: 'cat-transport', 地铁: 'cat-transport', 公交: 'cat-transport',
    居住: 'cat-housing', 房租: 'cat-housing', 水电: 'cat-housing',
    购物: 'cat-shopping', 买: 'cat-shopping', 淘宝: 'cat-shopping', 衣服: 'cat-shopping',
    娱乐: 'cat-entertainment', 电影: 'cat-entertainment', 游戏: 'cat-entertainment',
    通讯: 'cat-communication', 话费: 'cat-communication',
    医疗: 'cat-medical', 药: 'cat-medical', 医院: 'cat-medical',
    学习: 'cat-education', 书: 'cat-education', 学费: 'cat-education',
    人情: 'cat-gift', 红包: 'cat-gift', 礼物: 'cat-gift',
    宠物: 'cat-pet', 猫: 'cat-pet', 狗: 'cat-pet',
    工资: 'cat-salary', 薪水: 'cat-salary',
    奖金: 'cat-bonus', 年终奖: 'cat-bonus',
    投资: 'cat-investment-income', 股票: 'cat-investment-income', 基金: 'cat-investment-income',
  }

  let categoryId = type === 'expense' ? 'cat-other-expense' : 'cat-other-income'
  for (const [kw, id] of Object.entries(catMap)) {
    if (text.includes(kw)) {
      categoryId = id
      break
    }
  }

  return { success: true, amount, categoryId, type, note: text }
}

/**
 * 将中文分类名映射为 categoryId
 */
export function mapCategoryNameToId(name: string, type: 'expense' | 'income'): string {
  const expenseMap: Record<string, string> = {
    餐饮: 'cat-food', 交通: 'cat-transport', 居住: 'cat-housing', 购物: 'cat-shopping',
    娱乐: 'cat-entertainment', 通讯: 'cat-communication', 医疗: 'cat-medical',
    学习: 'cat-education', 人情: 'cat-gift', 宠物: 'cat-pet', 其他: 'cat-other-expense',
  }
  const incomeMap: Record<string, string> = {
    工资: 'cat-salary', 奖金: 'cat-bonus', 投资: 'cat-investment-income', 其他: 'cat-other-income',
  }
  const map = type === 'expense' ? expenseMap : incomeMap
  return map[name] || (type === 'expense' ? 'cat-other-expense' : 'cat-other-income')
}
