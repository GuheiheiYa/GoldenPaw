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
  updatedAt?: number
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

/** 定期交易周期 */
export type RecurringCycle = 'daily' | 'weekly' | 'monthly' | 'yearly'

/** 定期交易规则 */
export interface RecurringTransaction {
  id: string
  /** 名称，如"车贷" */
  name: string
  type: TransactionType
  /** 金额（单位：分） */
  amount: number
  categoryId: string
  accountId: string
  /** 周期 */
  cycle: RecurringCycle
  /** 每月几号（1-31，monthly 时有效） */
  dayOfMonth: number
  /** 下次执行日期 YYYY-MM-DD */
  nextDate: string
  /** 是否启用 */
  enabled: boolean
  /** 备注 */
  note: string
  /** 标签 */
  tags: string[]
  createdAt: number
}
