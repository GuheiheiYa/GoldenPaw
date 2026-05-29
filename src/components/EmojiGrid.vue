<template>
  <view class="emoji-grid">
    <view
      class="emoji-cell"
      v-for="emoji in displayList"
      :key="emoji"
      :class="{ active: modelValue === emoji }"
      @tap="$emit('update:modelValue', emoji)"
    >
      <text>{{ emoji }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const DEFAULT_EMOJI_LIST: string[] = [
  '💰', '🍜', '🚕', '🏠', '🛍️', '🎬', '📱', '💊',
  '📚', '🎁', '🐱', '✈️', '💳', '💵', '🏋️', '☕',
  '🍺', '🚗', '🚌', '🚇', '⛽', '🏥', '📖', '🎮',
  '🧴', '👶', '🌿', '🔧', '🧽', '🎨', '🐶', '🐟',
  '🌸', '⚽', '🎵', '✨', '📷', '🎯', '🚀', '💻',
]

interface Props {
  modelValue: string
  emojiList?: string[]
}

const props = defineProps<Props>()

const displayList = computed(() => props.emojiList ?? DEFAULT_EMOJI_LIST)

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.emoji-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  border-radius: $radius-sm;
  background: $bg-primary;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 20px;
  min-height: 40px;

  &.active {
    background: $brand-50;
    border-color: $brand-500;
  }
}
</style>
