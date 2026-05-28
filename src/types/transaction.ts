/** 交易类型 */
export type TransactionType = 'expense' | 'income' | 'transfer'

/** 交易记录 */
export interface Transaction {
  id: string
  type: TransactionType
  /** 金额（单位：分） */
  amount: number
  categoryId: string
  accountId: string
  /** 转入账户（仅转账类型） */
  toAccountId?: string
  /** 日期 YYYY-MM-DD */
  date: string
  /** 时间 HH:mm */
  time: string
  note: string
  tags: string[]
  createdAt: number
}

/** 分类 */
export interface Category {
  id: string
  name: string
  /** emoji 或图标名 */
  icon: string
  type: TransactionType
  /** 背景色 */
  color: string
  sortOrder: number
  isDefault: boolean
}

/** 账户类型 */
export type AccountType = 'savings' | 'credit' | 'investment' | 'cash'

/** 账户 */
export interface Account {
  id: string
  name: string
  type: AccountType
  bank?: string
  icon: string
  /** 余额（单位：分） */
  balance: number
}
