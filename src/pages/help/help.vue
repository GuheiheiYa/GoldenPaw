<template>
  <view class="app">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <uni-icons class="back-icon" type="arrow-left" size="20" color="#7A6B5D" />
      </view>
      <text class="header-title">帮助中心</text>
    </view>

    <view class="content">
      <view class="faq-section">
        <text class="section-title">常见问题</text>

        <view class="faq-item" v-for="(faq, idx) in faqs" :key="idx" @tap="faq.open = !faq.open">
          <view class="faq-question">
            <text class="faq-q-text">{{ faq.q }}</text>
            <uni-icons class="faq-arrow" :class="{ open: faq.open }" type="arrow-right" size="20" color="#C8B8A8" />
          </view>
          <view v-if="faq.open" class="faq-answer">
            <text class="faq-a-text">{{ faq.a }}</text>
          </view>
        </view>
      </view>

      <view class="contact-section">
        <text class="section-title">联系我们</text>
        <view class="contact-card">
          <text class="contact-icon">📧</text>
          <view class="contact-info">
            <text class="contact-label">邮箱</text>
            <text class="contact-value">support@goldenpaw.app</text>
          </view>
        </view>
        <view class="contact-card">
          <text class="contact-icon">💬</text>
          <view class="contact-info">
            <text class="contact-label">微信公众号</text>
            <text class="contact-value">GoldenPaw金爪</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const faqs = ref([
  { q: '如何记账？', a: '点击底部导航栏中间的"+"按钮，选择收支类型、分类，输入金额即可完成记账。', open: false },
  { q: '如何设置预算？', a: '进入"存钱与预算"页面，切换到"预算管理"标签，点击"添加预算"即可设置分类预算。', open: false },
  { q: '数据会丢失吗？', a: '数据保存在本地浏览器中，清除浏览器数据会导致数据丢失。建议定期使用"导出数据"功能备份。', open: false },
  { q: '如何导入其他记账APP的数据？', a: '进入"我的"->"导入数据"，支持导入微信和支付宝的账单文件。', open: false },
  { q: '如何修改分类？', a: '进入"我的"->"分类管理"，可以查看和管理所有收支分类。', open: false },
])

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
@use '../../styles/design-system' as *;
@use '../../styles/mixins' as *;

.app {
  min-height: 100vh;
  background: $gradient-warm;
}

.header {
  padding: 48px 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  @include icon-btn;
}

.back-icon {
  font-size: 20px;
  color: $text-secondary;
}

.header-title {
  @include text-h3;
}

.content {
  padding: 0 $space-6 $space-8;
}

.section-title {
  @include text-caption;
  color: $text-tertiary;
  padding: $space-4 0 $space-2;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.faq-item {
  background: $surface;
  border-radius: $radius-lg;
  border: 1px solid $border;
  margin-bottom: $space-3;
  overflow: hidden;
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-4 $space-5;
  cursor: pointer;

  &:active {
    background: $brand-50;
  }
}

.faq-q-text {
  @include text-body;
  flex: 1;
}

.faq-arrow {
  font-size: 20px;
  color: $text-tertiary;
  transition: transform 0.2s;

  &.open {
    transform: rotate(90deg);
  }
}

.faq-answer {
  padding: 0 $space-5 $space-4;
  border-top: 1px solid $border-light;
}

.faq-a-text {
  @include text-caption;
  color: $text-secondary;
  line-height: 1.6;
}

.contact-card {
  display: flex;
  align-items: center;
  background: $surface;
  border-radius: $radius-lg;
  border: 1px solid $border;
  padding: $space-4 $space-5;
  margin-bottom: $space-3;
}

.contact-icon {
  font-size: 32px;
  margin-right: $space-4;
}

.contact-info {
  flex: 1;
}

.contact-label {
  @include text-small;
  color: $text-secondary;
  display: block;
}

.contact-value {
  @include text-body;
  display: block;
}
</style>
