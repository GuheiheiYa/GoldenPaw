<template>
  <!-- 触发插槽 -->
  <view class="date-range-trigger" @tap="onTriggerTap">
    <slot />
  </view>

  <!-- 日期选择弹窗 -->
  <view class="date-picker-overlay" v-if="show" @tap="show = false">
    <view class="date-picker-card" @tap.stop>
      <text class="date-picker-title">选择日期范围</text>

      <!-- 快捷标签 -->
      <view class="date-quick-tags">
        <view
          class="date-quick-tag"
          v-for="tag in quickDateTags"
          :key="tag.label"
          :class="{ active: activeQuickTag === tag.label }"
          @tap="selectQuickTag(tag)"
        >
          <text>{{ tag.label }}</text>
        </view>
      </view>

      <!-- 日期范围 -->
      <view class="date-range-row">
        <view class="date-range-item">
          <text class="date-range-label">开始日期</text>
          <picker mode="date" :value="pickerStartDate" @change="onStartDateChange">
            <view class="date-range-display">{{ pickerStartDate }}</view>
          </picker>
        </view>
        <text class="date-range-sep">~</text>
        <view class="date-range-item">
          <text class="date-range-label">结束日期</text>
          <picker mode="date" :value="pickerEndDate" @change="onEndDateChange">
            <view class="date-range-display">{{ pickerEndDate }}</view>
          </picker>
        </view>
      </view>

      <view class="date-picker-actions">
        <view class="date-picker-btn secondary" @tap="onClear">
          <text>清空筛选</text>
        </view>
        <view class="date-picker-btn primary" @tap="onConfirm">
          <text>确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getToday } from '@/utils/format'

const props = defineProps<{
  /** 当前值：单日期 YYYY-MM-DD 或范围 YYYY-MM-DD,YYYY-MM-DD */
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'confirm', value: string): void
  (e: 'clear'): void
}>()

/** 弹窗显示状态 */
const show = ref(false)
/** 开始日期 */
const pickerStartDate = ref(getToday())
/** 结束日期 */
const pickerEndDate = ref(getToday())
/** 当前选中的快捷标签 */
const activeQuickTag = ref('')

/** 打开弹窗 */
function open() {
  const today = getToday()
  if (props.modelValue) {
    if (props.modelValue.includes(',')) {
      const [start, end] = props.modelValue.split(',')
      pickerStartDate.value = start
      pickerEndDate.value = end
    } else {
      pickerStartDate.value = props.modelValue
      pickerEndDate.value = props.modelValue
    }
  } else {
    pickerStartDate.value = today
    pickerEndDate.value = today
  }
  activeQuickTag.value = deriveActiveTag(props.modelValue)
  show.value = true
}

/** 关闭弹窗 */
function close() {
  show.value = false
}

/** 触发点击 */
function onTriggerTap() {
  open()
}

/** 根据当前值反推匹配的快捷标签 */
function deriveActiveTag(value: string): string {
  if (!value) return ''
  const today = getToday()
  for (const tag of quickDateTags) {
    if (tag.getValue() === value) return tag.label
  }
  // 单日期匹配
  if (value === today) return '今天'
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (value === yesterday.toISOString().slice(0, 10)) return '昨天'
  return ''
}

/** 快捷日期标签 */
interface QuickTag {
  label: string
  getValue: () => string
}
const quickDateTags: QuickTag[] = [
  {
    label: '今天',
    getValue: () => {
      const t = getToday()
      return `${t},${t}`
    },
  },
  {
    label: '昨天',
    getValue: () => {
      const t = getToday()
      const d = new Date(t)
      d.setDate(d.getDate() - 1)
      const y = d.toISOString().slice(0, 10)
      return `${y},${y}`
    },
  },
  {
    label: '近7天',
    getValue: () => {
      const t = getToday()
      const d = new Date(t)
      d.setDate(d.getDate() - 6)
      return `${d.toISOString().slice(0, 10)},${t}`
    },
  },
  {
    label: '近30天',
    getValue: () => {
      const t = getToday()
      const d = new Date(t)
      d.setDate(d.getDate() - 29)
      return `${d.toISOString().slice(0, 10)},${t}`
    },
  },
  {
    label: '本月',
    getValue: () => {
      const t = getToday()
      return `${t.slice(0, 7)}-01,${t}`
    },
  },
]

/** 选择快捷标签 */
function selectQuickTag(tag: QuickTag) {
  activeQuickTag.value = tag.label
  const range = tag.getValue()
  const [start, end] = range.split(',')
  pickerStartDate.value = start
  pickerEndDate.value = end
}

/** 开始日期变更 */
function onStartDateChange(e: any) {
  if (e.detail?.value) {
    pickerStartDate.value = e.detail.value
    activeQuickTag.value = ''
  }
}

/** 结束日期变更 */
function onEndDateChange(e: any) {
  if (e.detail?.value) {
    pickerEndDate.value = e.detail.value
    activeQuickTag.value = ''
  }
}

/** 确认 */
function onConfirm() {
  const value = pickerStartDate.value === pickerEndDate.value
    ? pickerStartDate.value
    : `${pickerStartDate.value},${pickerEndDate.value}`
  emit('update:modelValue', value)
  emit('confirm', value)
  show.value = false
}

/** 清空 */
function onClear() {
  emit('update:modelValue', '')
  emit('clear')
  show.value = false
}

/** 暴露方法给父组件 */
defineExpose({ open, close })
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;
@use '../styles/mixins' as *;

.date-range-trigger {
  display: inline-flex;
}

/* 日期选择弹窗 */
.date-picker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.date-picker-card {
  width: 100%;
  max-width: 430px;
  max-height: 85vh;
  overflow-y: auto;
  background: $surface;
  border-radius: $radius-lg $radius-lg 0 0;
  padding: 24px;
  padding-bottom: 40px;
  animation: slideUp 0.25s ease;
}

.date-picker-title {
  @include text-h2;
  display: block;
  margin-bottom: 20px;
  text-align: center;
}

/* 快捷标签 */
.date-quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.date-quick-tag {
  padding: 6px 14px;
  border-radius: $radius-full;
  background: $bg-primary;
  border: 1px solid $border;
  cursor: pointer;
  @include text-small;
  color: $text-secondary;

  &.active {
    background: $brand-50;
    border-color: $brand-500;
    color: $brand-600;
    font-weight: 600;
  }
}

/* 日期范围 */
.date-range-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 24px;
}

.date-range-item {
  flex: 1;
}

.date-range-label {
  @include text-caption;
  color: $text-secondary;
  display: block;
  margin-bottom: 6px;
}

.date-range-display {
  height: 48px;
  background: $bg-primary;
  border-radius: $radius-sm;
  border: 1px solid $border;
  display: flex;
  align-items: center;
  justify-content: center;
  @include text-body;
  color: $text-primary;
}

.date-range-sep {
  @include text-body;
  color: $text-tertiary;
  padding-bottom: 12px;
}

.date-picker-actions {
  display: flex;
  gap: 12px;
}

.date-picker-btn {
  flex: 1;
  padding: 14px;
  border-radius: $radius-sm;
  text-align: center;
  cursor: pointer;

  &.primary {
    background: $gradient-brand;
    box-shadow: $shadow-brand;
    color: white;
    font-weight: 700;
  }

  &.secondary {
    background: $bg-primary;
    border: 1px solid $border;
    color: $text-secondary;
    font-weight: 700;
  }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
