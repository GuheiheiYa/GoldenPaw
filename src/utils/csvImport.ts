import { useTransactionStore } from '@/stores/transaction'
import { useAccountStore } from '@/stores/account'
import { useCategoryStore } from '@/stores/category'
import { generateId } from '@/utils/id'
import type { Transaction } from '@/types/transaction'

/** CSV 解析结果 */
export interface CsvImportResult {
  success: number
  fail: number
  errors: string[]
}

/** 智能解析 CSV 文件内容，识别格式并导入 */
export function parseAndImportCsv(csvText: string): CsvImportResult {
  const lines = csvText.trim().split(/\r?\n/)
  if (lines.length < 2) {
    return { success: 0, fail: 0, errors: ['CSV 文件内容为空或格式不正确'] }
  }

  const header = parseCsvLine(lines[0])
  const format = detectFormat(header)

  if (!format) {
    return { success: 0, fail: 0, errors: ['无法识别 CSV 格式，请使用 GoldenPaw 导出格式、微信账单或支付宝账单'] }
  }

  const txStore = useTransactionStore()
  const accStore = useAccountStore()
  const catStore = useCategoryStore()

  let success = 0
  let fail = 0
  const errors: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i])
    if (row.length < 2) continue

    try {
      const tx = format.parser(row, header)
      if (tx) {
        // 确保分类和账户存在
        ensureCategoryExists(tx, catStore)
        ensureAccountExists(tx, accStore)
        txStore.addTransaction(tx)
        success++
      }
    } catch (e: any) {
      fail++
      if (errors.length < 5) {
        errors.push(`第 ${i + 1} 行: ${e.message || '解析失败'}`)
      }
    }
  }

  return { success, fail, errors }
}

/** 解析单行 CSV（简单实现，处理引号） */
function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

/** 检测 CSV 格式 */
function detectFormat(header: string[]): { name: string; parser: (row: string[], header: string[]) => Transaction | null } | null {
  const h = header.map(s => s.trim())
  const joined = h.join(',')

  // GoldenPaw 导出格式: 日期,时间,类型,金额,分类,账户,备注
  if (joined.includes('日期') && joined.includes('时间') && joined.includes('类型') && joined.includes('金额')) {
    return { name: 'GoldenPaw', parser: parseGoldenPawRow }
  }

  // 微信账单格式: 交易时间,交易类型,交易对方,商品,收/支,金额(元),...
  if (joined.includes('交易时间') && joined.includes('收/支') && joined.includes('金额')) {
    return { name: '微信账单', parser: parseWechatRow }
  }

  // 支付宝账单格式: 交易号,商家订单号,交易创建时间,...
  if (joined.includes('交易创建时间') && joined.includes('收/支') && joined.includes('金额')) {
    return { name: '支付宝账单', parser: parseAlipayRow }
  }

  return null
}

/** 解析 GoldenPaw 导出格式 */
function parseGoldenPawRow(row: string[], header: string[]): Transaction | null {
  const idx = (key: string) => header.findIndex(h => h.trim() === key)
  const dateIdx = idx('日期')
  const timeIdx = idx('时间')
  const typeIdx = idx('类型')
  const amountIdx = idx('金额')
  const categoryIdx = idx('分类')
  const accountIdx = idx('账户')
  const noteIdx = idx('备注')

  if (dateIdx < 0 || amountIdx < 0) return null

  const typeLabel = row[typeIdx]?.trim() || '支出'
  const type = typeLabel === '收入' ? 'income' : typeLabel === '转账' ? 'transfer' : 'expense'
  const amountYuan = parseFloat(row[amountIdx]) || 0

  return {
    id: generateId(),
    type,
    amount: Math.round(amountYuan * 100),
    date: row[dateIdx]?.trim() || '',
    time: timeIdx >= 0 ? row[timeIdx]?.trim() : '12:00',
    categoryId: '', // 由 ensureCategoryExists 填充
    accountId: '', // 由 ensureAccountExists 填充
    note: noteIdx >= 0 ? row[noteIdx]?.trim() : '',
    createdAt: Date.now(),
  }
}

/** 解析微信账单格式 */
function parseWechatRow(row: string[], header: string[]): Transaction | null {
  const idx = (key: string) => header.findIndex(h => h.includes(key))
  const timeIdx = idx('交易时间')
  const typeIdx = idx('收/支')
  const amountIdx = idx('金额')
  const counterpartyIdx = idx('交易对方')
  const productIdx = idx('商品')

  if (timeIdx < 0 || amountIdx < 0) return null

  const timeStr = row[timeIdx]?.trim() || ''
  const dateMatch = timeStr.match(/(\d{4}-\d{2}-\d{2})/)
  const date = dateMatch ? dateMatch[1] : timeStr.slice(0, 10)
  const time = timeStr.includes(' ') ? timeStr.split(' ')[1].slice(0, 5) : '12:00'

  const typeLabel = row[typeIdx]?.trim() || '支出'
  const type = typeLabel === '收入' ? 'income' : 'expense'

  // 微信金额格式：¥35.00 或 35.00
  const amountStr = row[amountIdx]?.replace(/[¥$,]/g, '').trim() || '0'
  const amountYuan = parseFloat(amountStr) || 0

  const counterparty = counterpartyIdx >= 0 ? row[counterpartyIdx]?.trim() : ''
  const product = productIdx >= 0 ? row[productIdx]?.trim() : ''
  const note = [counterparty, product].filter(Boolean).join(' - ')

  return {
    id: generateId(),
    type,
    amount: Math.round(amountYuan * 100),
    date,
    time,
    categoryId: '',
    accountId: '',
    note,
    createdAt: Date.now(),
  }
}

/** 解析支付宝账单格式 */
function parseAlipayRow(row: string[], header: string[]): Transaction | null {
  const idx = (key: string) => header.findIndex(h => h.includes(key))
  const timeIdx = idx('交易创建时间')
  const typeIdx = idx('收/支')
  const amountIdx = idx('金额')
  const counterpartyIdx = idx('交易对方')
  const productIdx = idx('商品名称')

  if (timeIdx < 0 || amountIdx < 0) return null

  const timeStr = row[timeIdx]?.trim() || ''
  const dateMatch = timeStr.match(/(\d{4}-\d{2}-\d{2})/)
  const date = dateMatch ? dateMatch[1] : timeStr.slice(0, 10)
  const time = timeStr.includes(' ') ? timeStr.split(' ')[1].slice(0, 5) : '12:00'

  const typeLabel = row[typeIdx]?.trim() || '支出'
  const type = typeLabel === '收入' ? 'income' : 'expense'

  const amountStr = row[amountIdx]?.replace(/[¥$,]/g, '').trim() || '0'
  const amountYuan = parseFloat(amountStr) || 0

  const counterparty = counterpartyIdx >= 0 ? row[counterpartyIdx]?.trim() : ''
  const product = productIdx >= 0 ? row[productIdx]?.trim() : ''
  const note = [counterparty, product].filter(Boolean).join(' - ')

  return {
    id: generateId(),
    type,
    amount: Math.round(amountYuan * 100),
    date,
    time,
    categoryId: '',
    accountId: '',
    note,
    createdAt: Date.now(),
  }
}

/** 确保分类存在，不存在则创建 */
function ensureCategoryExists(tx: Transaction, catStore: ReturnType<typeof useCategoryStore>) {
  const cats = catStore.getCategoriesByType(tx.type === 'income' ? 'income' : 'expense')
  if (cats.length > 0) {
    tx.categoryId = cats[0].id
  } else {
    // 创建一个默认分类
    const newCat = catStore.addCategory({
      type: tx.type === 'income' ? 'income' : 'expense',
      name: '其他',
      icon: '📦',
      color: '#B8A99E',
    })
    tx.categoryId = newCat.id
  }
}

/** 确保账户存在，不存在则创建 */
function ensureAccountExists(tx: Transaction, accStore: ReturnType<typeof useAccountStore>) {
  const accs = accStore.accounts
  if (accs.length > 0) {
    tx.accountId = accs[0].id
  } else {
    // 创建一个默认账户
    const newAcc = accStore.addAccount({
      name: '默认账户',
      type: 'savings',
      icon: '💳',
    })
    tx.accountId = newAcc.id
  }
}
