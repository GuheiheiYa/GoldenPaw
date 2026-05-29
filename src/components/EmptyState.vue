<template>
  <view class="empty-state">
    <text class="empty-icon">{{ icon }}</text>
    <text class="empty-title">{{ title }}</text>
    <text v-if="description" class="empty-desc">{{ description }}</text>
  </view>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description?: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;
@use '../styles/mixins' as *;

.empty-state {
  padding: 80px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.empty-title {
  @include text-h3;
  display: block;
  margin-bottom: 8px;
}

.empty-desc {
  @include text-body;
  color: $text-secondary;
  display: block;
}
</style>
