/**
 * 测试数据种子模块
 * 用于在开发阶段填充示例交易数据，方便 UI 调试与展示。
 *
 * @author GoldenPaw
 * @date 2026-05-28
 */
import { useTransactionStore } from '@/stores/transaction'
import { getDaysAgo } from '@/utils/date'

interface SeedTx {
  type: 'expense' | 'income'
  amount: number
  categoryId: string
  accountId: string
  note: string
  date: string
  time: string
  tags?: string[]
}

/** 示例交易数据：覆盖近 7 天的餐饮、交通、购物、工资等场景 */
const SEED_TRANSACTIONS: SeedTx[] = [
  // 今天
  {
    type: 'expense',
    amount: 3500,
    categoryId: 'cat-food',
    accountId: 'acc-wechat',
    note: '午餐 - 黄焖鸡',
    date: getDaysAgo(0),
    time: '12:30',
    tags: ['午餐'],
  },
  {
    type: 'expense',
    amount: 1800,
    categoryId: 'cat-food',
    accountId: 'acc-alipay',
    note: '瑞幸咖啡',
    date: getDaysAgo(0),
    time: '09:15',
    tags: ['咖啡'],
  },
  {
    type: 'expense',
    amount: 5000,
    categoryId: 'cat-transport',
    accountId: 'acc-wechat',
    note: '地铁充值',
    date: getDaysAgo(0),
    time: '08:00',
  },

  // 昨天
  {
    type: 'expense',
    amount: 6800,
    categoryId: 'cat-food',
    accountId: 'acc-credit',
    note: '晚餐 - 海底捞',
    date: getDaysAgo(1),
    time: '18:45',
    tags: ['聚餐'],
  },
  {
    type: 'expense',
    amount: 2500,
    categoryId: 'cat-food',
    accountId: 'acc-wechat',
    note: '早餐 + 午餐外卖',
    date: getDaysAgo(1),
    time: '07:50',
  },

  // 2 天前
  {
    type: 'expense',
    amount: 12900,
    categoryId: 'cat-shopping',
    accountId: 'acc-credit',
    note: '优衣库换季衣服',
    date: getDaysAgo(2),
    time: '15:20',
    tags: ['衣服'],
  },
  {
    type: 'expense',
    amount: 3200,
    categoryId: 'cat-transport',
    accountId: 'acc-alipay',
    note: '打车回家',
    date: getDaysAgo(2),
    time: '22:10',
  },

  // 3 天前
  {
    type: 'income',
    amount: 25000000,
    categoryId: 'cat-salary',
    accountId: 'acc-cmb',
    note: '5月工资',
    date: getDaysAgo(3),
    time: '10:00',
    tags: ['工资'],
  },
  {
    type: 'expense',
    amount: 4500,
    categoryId: 'cat-food',
    accountId: 'acc-cash',
    note: '菜市场买菜',
    date: getDaysAgo(3),
    time: '17:30',
  },

  // 4 天前
  {
    type: 'expense',
    amount: 8900,
    categoryId: 'cat-entertainment',
    accountId: 'acc-alipay',
    note: '电影票 x2 + 爆米花',
    date: getDaysAgo(4),
    time: '19:00',
    tags: ['电影'],
  },
  {
    type: 'expense',
    amount: 3800,
    categoryId: 'cat-food',
    accountId: 'acc-wechat',
    note: '周末早茶',
    date: getDaysAgo(4),
    time: '10:30',
  },
  {
    type: 'expense',
    amount: 1500,
    categoryId: 'cat-transport',
    accountId: 'acc-cash',
    note: '共享单车月卡',
    date: getDaysAgo(4),
    time: '08:40',
  },

  // 5 天前
  {
    type: 'expense',
    amount: 35000,
    categoryId: 'cat-shopping',
    accountId: 'acc-credit',
    note: 'AirPods Pro',
    date: getDaysAgo(5),
    time: '14:00',
    tags: ['电子产品'],
  },
  {
    type: 'expense',
    amount: 2800,
    categoryId: 'cat-food',
    accountId: 'acc-wechat',
    note: '便利店零食',
    date: getDaysAgo(5),
    time: '20:30',
  },

  // 6 天前
  {
    type: 'income',
    amount: 300000,
    categoryId: 'cat-investment-income',
    accountId: 'acc-alipay',
    note: '基金分红',
    date: getDaysAgo(6),
    time: '09:00',
    tags: ['理财'],
  },
  {
    type: 'expense',
    amount: 15000,
    categoryId: 'cat-medical',
    accountId: 'acc-cmb',
    note: '感冒看诊 + 药费',
    date: getDaysAgo(6),
    time: '11:20',
  },
  {
    type: 'expense',
    amount: 4200,
    categoryId: 'cat-food',
    accountId: 'acc-cash',
    note: '朋友生日聚餐AA',
    date: getDaysAgo(6),
    time: '19:00',
    tags: ['人情'],
  },
]

/**
 * 填充交易种子数据
 * 如果当前交易列表为空，则批量写入示例数据；已有数据则跳过。
 */
export function seedAllStores(): void {
  const txStore = useTransactionStore()

  // 已有数据则跳过，避免重复填充
  if (txStore.transactions.length > 0) {
    return
  }

  SEED_TRANSACTIONS.forEach((tx) => {
    txStore.addTransaction({
      type: tx.type,
      amount: tx.amount,
      categoryId: tx.categoryId,
      accountId: tx.accountId,
      note: tx.note,
      date: tx.date,
      time: tx.time,
      tags: tx.tags,
    })
  })
}
