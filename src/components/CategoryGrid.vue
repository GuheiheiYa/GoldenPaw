<template>
  <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
    <view class="category-grid">
      <view
        v-for="cat in categories"
        :key="cat.id"
        class="cat-item"
        :class="{ selected: modelValue === cat.id }"
        @tap="onSelect(cat.id)"
      >
        <view class="cat-icon-wrap" :style="{ background: cat.color }">
          <text class="cat-icon">{{ cat.icon }}</text>
        </view>
        <text class="cat-name">{{ cat.name }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
/**
 * 分类选择网格组件
 * 根据收支类型展示分类列表，支持水平滚动
 */
import { computed } from 'vue'
import { useCategoryStore } from '@/stores/category'

defineProps<{
  /** 收支类型 */
  type: 'expense' | 'income' | 'transfer'
  /** 选中的分类ID */
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const categoryStore = useCategoryStore()

/** 当前类型对应的分类列表 */
const categories = computed(() => {
  if (props.type === 'transfer') return []
  return categoryStore.getCategoriesByType(props.type)
})

/** 选择分类 */
function onSelect(id: string) {
  emit('update:modelValue', id)
}
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;
@use '../styles/mixins' as *;

.category-scroll {
  white-space: nowrap;
  padding: $space-2 0;
}

.category-grid {
  display: inline-flex;
  gap: $space-4;
  padding: $space-2 $space-2;
}

.cat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-2;
  cursor: pointer;
  transition: $transition-base;
  flex-shrink: 0;

  &:active {
    transform: scale(0.92);
  }

  &.selected .cat-icon-wrap {
    border: 2px solid $brand-500;
    background: $brand-50;
  }

  &.selected .cat-name {
    color: $brand-600;
  }
}

.cat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: $transition-base;
}

.cat-icon {
  font-size: 22px;
}

.cat-name {
  font: 600 12px/1.2 $font-sans;
  color: $text-secondary;
  white-space: nowrap;
}
</style>
