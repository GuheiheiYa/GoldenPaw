<template>
  <view class="line-chart" v-if="values.some(v => v > 0)">
    <!-- Y轴标签 -->
    <view class="y-axis-labels">
      <text class="y-label">{{ yMaxLabel }}</text>
      <text class="y-label">{{ yMidHighLabel }}</text>
      <text class="y-label">{{ yMidLowLabel }}</text>
      <text class="y-label">{{ yMinLabel }}</text>
    </view>
    <view class="chart-body">
      <svg :viewBox="`0 0 300 ${svgHeight}`" class="line-svg" preserveAspectRatio="xMidYMid meet">
        <!-- 水平网格线 -->
        <line
          v-for="i in 4"
          :key="'h' + i"
          x1="0"
          :y1="gridY(i)"
          x2="300"
          :y2="gridY(i)"
          stroke="#EDE4D8"
          stroke-width="0.5"
          stroke-dasharray="3,3"
        />
        <!-- 区域填充 -->
        <polygon :points="areaPoints" :fill="areaColor" />
        <!-- 折线 -->
        <polyline
          :points="linePoints"
          fill="none"
          :stroke="color"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <!-- 数据点 -->
        <circle
          v-for="(pt, i) in pointsData"
          :key="i"
          :cx="pt.x"
          :cy="pt.y"
          r="3.5"
          :fill="color"
        />
      </svg>
      <!-- X轴标签 -->
      <view class="x-axis-labels">
        <text
          v-for="(pt, i) in pointsData"
          :key="i"
          class="x-label"
          :class="{ empty: !pt.label }"
        >
          {{ pt.label }}
        </text>
      </view>
    </view>
  </view>
  <view class="chart-empty" v-else>
    <text class="chart-empty-text">{{ emptyText }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  labels: string[]
  values: number[]
  height?: number
  color?: string
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 170,
  color: '#C8956C',
  emptyText: '暂无数据',
})

const svgHeight = 140
const paddingTop = 10
const paddingBottom = 10
const chartH = svgHeight - paddingTop - paddingBottom

const minVal = computed(() => Math.min(...props.values, 0))
const maxVal = computed(() => Math.max(...props.values, 1))
const range = computed(() => maxVal.value - minVal.value || 1)

const pointsData = computed(() => {
  const { values, labels } = props
  if (values.length === 0) return []
  return values.map((v, i) => {
    const x = values.length === 1 ? 150 : (i / (values.length - 1)) * 300
    const y = paddingTop + chartH - ((v - minVal.value) / range.value) * chartH
    return { x, y, label: labels[i] || '' }
  })
})

const linePoints = computed(() => {
  return pointsData.value.map((p) => `${p.x},${p.y}`).join(' ')
})

const areaPoints = computed(() => {
  if (pointsData.value.length === 0) return ''
  const first = pointsData.value[0]
  const last = pointsData.value[pointsData.value.length - 1]
  const bottomY = svgHeight - paddingBottom
  return `${first.x},${bottomY} ` + pointsData.value.map((p) => `${p.x},${p.y}`).join(' ') + ` ${last.x},${bottomY}`
})

function formatAxisLabel(val: number): string {
  const yuan = val / 100
  if (Math.abs(yuan) >= 10000) {
    return '¥' + (yuan / 10000).toFixed(1) + '万'
  }
  return '¥' + yuan.toFixed(2)
}

const yMaxLabel = computed(() => formatAxisLabel(maxVal.value))
const yMidHighLabel = computed(() => formatAxisLabel(minVal.value + range.value * 0.66))
const yMidLowLabel = computed(() => formatAxisLabel(minVal.value + range.value * 0.33))
const yMinLabel = computed(() => formatAxisLabel(minVal.value))

const areaColor = computed(() => `${props.color}14`)

function gridY(i: number): number {
  return paddingTop + (i - 1) * (chartH / 3)
}
</script>

<style lang="scss" scoped>
@use '../styles/design-system' as *;
@use '../styles/mixins' as *;

.line-chart {
  display: flex;
  height: 170px;
  padding: 0;
}

.y-axis-labels {
  width: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px 4px 20px 0;
}

.y-label {
  font-size: 9px;
  color: #8C7B6B;
  text-align: right;
  line-height: 1;
}

.chart-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.line-svg {
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: visible;
}

.x-axis-labels {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  padding: 4px 0 0;
  height: 18px;
}

.x-label {
  font-size: 9px;
  color: #A89B8E;
  text-align: center;
  flex: 1;

  &.empty {
    flex: 0.3;
  }
}

.chart-empty {
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-empty-text {
  @include text-caption;
  color: $text-tertiary;
}
</style>
