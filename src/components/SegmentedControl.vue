<template>
  <view class="segmented">
    <view
      v-for="(option, index) in options"
      :key="option.value"
      class="seg-item"
      :class="{ active: modelValue === option.value }"
      @tap="onTap(option.value)"
    >
      <text class="seg-text">{{ option.label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface SegOption {
  label: string
  value: string
}

defineProps<{
  options: SegOption[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function onTap(value: string) {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;

.segmented {
  display: flex;
  background: $surface;
  border-radius: $radius-full;
  padding: 4px;
  box-shadow: $shadow-sm;
  border: 2px solid $border;
}

.seg-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: $radius-full;
  cursor: pointer;
  transition: $transition-base;

  &.active {
    background: $gradient-brand;
    box-shadow: 0 2px 8px rgba(200, 149, 108, 0.25);
  }
}

.seg-text {
  font: 700 14px/1.4 $font-sans;
  color: $text-secondary;

  .seg-item.active & {
    color: white;
  }
}
</style>
