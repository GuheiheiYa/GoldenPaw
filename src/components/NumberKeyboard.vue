<template>
  <view class="keyboard">
    <view class="keyboard-row">
      <view class="key" @tap="onKey('7')">
        <text class="key-text">7</text>
      </view>
      <view class="key" @tap="onKey('8')">
        <text class="key-text">8</text>
      </view>
      <view class="key" @tap="onKey('9')">
        <text class="key-text">9</text>
      </view>
      <view class="key key-func" @tap="onBackspace">
        <text class="key-text" style="font-size:16px;">⌫</text>
      </view>
    </view>
    <view class="keyboard-row">
      <view class="key" @tap="onKey('4')">
        <text class="key-text">4</text>
      </view>
      <view class="key" @tap="onKey('5')">
        <text class="key-text">5</text>
      </view>
      <view class="key" @tap="onKey('6')">
        <text class="key-text">6</text>
      </view>
      <view class="key key-func" @tap="onKey('+')">
        <text class="key-text">+</text>
      </view>
    </view>
    <view class="keyboard-row">
      <view class="key" @tap="onKey('1')">
        <text class="key-text">1</text>
      </view>
      <view class="key" @tap="onKey('2')">
        <text class="key-text">2</text>
      </view>
      <view class="key" @tap="onKey('3')">
        <text class="key-text">3</text>
      </view>
      <view class="key key-func" @tap="onKey('-')">
        <text class="key-text">-</text>
      </view>
    </view>
    <view class="keyboard-row">
      <view class="key" @tap="onKey('0')">
        <text class="key-text">0</text>
      </view>
      <view class="key" @tap="onDot">
        <text class="key-text">.</text>
      </view>
      <view class="key key-confirm" @tap="onConfirm">
        <text class="key-text key-confirm-text">完成</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
/**
 * 自定义数字键盘组件
 * 支持数字输入、小数点（最多2位）、退格、连续加减计算，最大12位
 */
defineProps<{
  /** 当前金额字符串 */
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'confirm'): void
}>()

/** 最大位数 */
const MAX_DIGITS = 12

/** 当前操作符 */
const operator = ref<'+' | '-' | ''>('')
/** 操作数（第一个数值） */
const operand = ref(0)

/** 处理数字和运算符输入 */
function onKey(key: string) {
  const val = props.modelValue

  // 处理加减运算符（连续计算）
  if (key === '+' || key === '-') {
    const currentVal = parseFloat(val || '0')
    // 如果已有操作符，先计算结果
    if (operator.value) {
      let result = 0
      if (operator.value === '+') result = operand.value + currentVal
      if (operator.value === '-') result = operand.value - currentVal
      operand.value = result
    } else {
      operand.value = currentVal
    }
    operator.value = key
    emit('update:modelValue', '0')
    return
  }

  // 检查最大位数（不含小数点）
  const digitsOnly = val.replace(/[^0-9]/g, '')
  if (digitsOnly.length >= MAX_DIGITS) return

  // 小数点后最多2位
  const dotIndex = val.indexOf('.')
  if (dotIndex !== -1 && val.length - dotIndex > 2) return

  // 防止多个小数点
  if (key === '.' && val.includes('.')) return

  // 防止开头多个0
  if (val === '0' && key !== '.') {
    emit('update:modelValue', key)
    return
  }

  emit('update:modelValue', val + key)
}

/** 处理小数点输入 */
function onDot() {
  onKey('.')
}

/** 退格处理 */
function onBackspace() {
  const val = props.modelValue
  if (val.length <= 1) {
    emit('update:modelValue', '0')
  } else {
    emit('update:modelValue', val.slice(0, -1))
  }
}

/** 确认 */
function onConfirm() {
  // 如果有待计算的操作符，先计算结果
  if (operator.value) {
    const currentVal = parseFloat(props.modelValue || '0')
    let result = 0
    if (operator.value === '+') result = operand.value + currentVal
    if (operator.value === '-') result = operand.value - currentVal
    emit('update:modelValue', result.toFixed(2))
    operator.value = ''
    operand.value = 0
  }
  emit('confirm')
}
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;

.keyboard {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 12px;
}

.keyboard-row {
  display: flex;
  gap: 8px;
}

.key {
  flex: 1;
  height: 48px;
  border-radius: $radius-sm;
  background: $bg-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: $transition-fast;

  &:active {
    background: $bg-secondary;
    transform: scale(0.95);
  }
}

.key-func {
  background: $bg-secondary;

  &:active {
    background: $bg-tertiary;
  }
}

.key-confirm {
  background: $gradient-brand;
  box-shadow: $shadow-brand;
  flex: 2;

  &:active {
    opacity: 0.9;
    transform: scale(0.95);
  }
}

.key-text {
  font: 700 18px/1 $font-sans;
  color: $text-primary;
}

.key-confirm-text {
  color: white;
  font-size: 16px;
}
</style>
