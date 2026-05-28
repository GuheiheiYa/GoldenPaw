import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '@/types/transaction'

const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'cat-food', name: '餐饮', icon: '🍜', type: 'expense', color: '#FAF0E6', sortOrder: 0, isDefault: true },
  { id: 'cat-transport', name: '交通', icon: '🚕', type: 'expense', color: '#E8F0E8', sortOrder: 1, isDefault: true },
  { id: 'cat-housing', name: '居住', icon: '🏠', type: 'expense', color: '#E8F1F5', sortOrder: 2, isDefault: true },
  { id: 'cat-shopping', name: '购物', icon: '🛍️', type: 'expense', color: '#F5E0DC', sortOrder: 3, isDefault: true },
  { id: 'cat-entertainment', name: '娱乐', icon: '🎬', type: 'expense', color: '#F5E6D3', sortOrder: 4, isDefault: true },
  { id: 'cat-communication', name: '通讯', icon: '📱', type: 'expense', color: '#E8F1F5', sortOrder: 5, isDefault: true },
  { id: 'cat-medical', name: '医疗', icon: '💊', type: 'expense', color: '#E8F0E8', sortOrder: 6, isDefault: true },
  { id: 'cat-education', name: '学习', icon: '📚', type: 'expense', color: '#E8F1F5', sortOrder: 7, isDefault: true },
  { id: 'cat-gift', name: '人情', icon: '🎁', type: 'expense', color: '#F5E6D3', sortOrder: 8, isDefault: true },
  { id: 'cat-pet', name: '宠物', icon: '🐱', type: 'expense', color: '#FAF0E6', sortOrder: 9, isDefault: true },
  { id: 'cat-other-expense', name: '其他', icon: '💰', type: 'expense', color: '#F0F0F0', sortOrder: 10, isDefault: true },
]

const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'cat-salary', name: '工资', icon: '💰', type: 'income', color: '#E8F0E8', sortOrder: 0, isDefault: true },
  { id: 'cat-bonus', name: '奖金', icon: '🎉', type: 'income', color: '#F5E6D3', sortOrder: 1, isDefault: true },
  { id: 'cat-investment-income', name: '投资', icon: '📈', type: 'income', color: '#E8F1F5', sortOrder: 2, isDefault: true },
  { id: 'cat-other-income', name: '其他', icon: '💵', type: 'income', color: '#F0F0F0', sortOrder: 3, isDefault: true },
]

export const useCategoryStore = defineStore('category', () => {
  const expenseCategories = ref<Category[]>([...DEFAULT_EXPENSE_CATEGORIES])
  const incomeCategories = ref<Category[]>([...DEFAULT_INCOME_CATEGORIES])

  function getCategoriesByType(type: 'expense' | 'income'): Category[] {
    return type === 'expense' ? expenseCategories.value : incomeCategories.value
  }

  function getCategoryById(id: string): Category | undefined {
    return [...expenseCategories.value, ...incomeCategories.value].find(c => c.id === id)
  }

  return {
    expenseCategories,
    incomeCategories,
    getCategoriesByType,
    getCategoryById,
  }
}, {
  persist: true,
})
