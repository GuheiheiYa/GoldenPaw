<template>
  <view class="week-calendar card">
    <view
      v-for="(day, idx) in weekDays"
      :key="idx"
      class="week-day"
      :class="{ active: day.isToday }"
      @tap="handleDayTap(day)"
    >
      <text class="week-day-name">{{ day.name }}</text>
      <text class="week-day-num">{{ day.date }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/** 星期名称 */
const WEEK_NAMES = ['日', '一', '二', '三', '四', '五', '六']

/** 计算当前周的日期数据 */
const weekDays = computed(() => {
  const now = new Date()
  const today = now.getDate()
  // 获取本周一的日期
  const dayOfWeek = now.getDay() // 0=日, 1=一, ...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(now)
  monday.setDate(today + mondayOffset)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      name: WEEK_NAMES[i],
      date: d.getDate(),
      isToday:
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate(),
    }
  })
})

/** 点击日期 */
function handleDayTap(day: { date: number }) {
  // 后续可扩展为选中日期查看当日流水
}
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;
@use '../styles/mixins' as *;

.week-calendar {
  margin: 0 $space-6 $space-4;
  padding: $space-4;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.week-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;
  padding: $space-2 $space-1;
  border-radius: $radius-md;
  min-width: 40px;
  cursor: pointer;
  transition: $transition-base;

  &:active {
    transform: scale(0.95);
  }

  &.active {
    background: $gradient-brand;
    box-shadow: $shadow-brand;
  }
}

.week-day-name {
  @include text-micro;
  color: $text-tertiary;
  font-weight: 600;

  .active & {
    color: white;
  }
}

.week-day-num {
  @include text-h3;
  color: $text-primary;

  .active & {
    color: white;
  }
}
</style>
