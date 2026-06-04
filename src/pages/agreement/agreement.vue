<template>
  <view class="app">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <uni-icons class="back-icon" type="arrow-left" size="20" color="#7A6B5D" />
      </view>
      <text class="header-title">用户协议</text>
    </view>

    <scroll-view scroll-y class="content">
      <view class="section">
        <text class="section-title">一、服务条款的确认与接纳</text>
        <text class="section-text">欢迎使用 GoldenPaw（金爪）个人记账应用。请您仔细阅读以下条款，使用本应用即表示您同意遵守本协议的所有条款和条件。</text>
      </view>

      <view class="section">
        <text class="section-title">二、服务内容</text>
        <text class="section-text">GoldenPaw 提供个人记账、预算管理、存钱目标、资产追踪等财务管理功能。本应用的所有数据均存储在您的设备本地，不会上传至任何服务器。</text>
      </view>

      <view class="section">
        <text class="section-title">三、用户隐私</text>
        <text class="section-text">我们高度重视您的隐私保护：</text>
        <text class="section-text">• 您的所有财务数据仅存储在本地设备中</text>
        <text class="section-text">• 我们不会收集、存储或分享您的个人信息</text>
        <text class="section-text">• AI 记账功能使用 DeepSeek API 进行自然语言解析，相关数据传输遵循 DeepSeek 的隐私政策</text>
        <text class="section-text">• 清除应用数据或卸载应用将导致数据永久丢失，请定期导出备份</text>
      </view>

      <view class="section">
        <text class="section-title">四、用户行为规范</text>
        <text class="section-text">您应遵守以下规范：</text>
        <text class="section-text">• 合理使用本应用，不进行恶意操作</text>
        <text class="section-text">• 妥善保管设备密码和应用密码锁</text>
        <text class="section-text">• 定期备份重要数据</text>
      </view>

      <view class="section">
        <text class="section-title">五、免责声明</text>
        <text class="section-text">本应用仅供个人记账参考，不构成任何财务建议。因设备故障、系统更新、误操作等导致的数据丢失，我们不承担责任。建议您定期使用导出功能备份数据。</text>
      </view>

      <view class="section">
        <text class="section-title">六、协议修改</text>
        <text class="section-text">我们保留随时修改本协议的权利。修改后的协议将在应用内公布，继续使用本应用即表示您同意修改后的协议。</text>
      </view>

      <view class="section">
        <text class="section-title">七、联系方式</text>
        <text class="section-text">如有任何问题或建议，请通过以下方式联系我们：</text>
        <text class="section-text">• 邮箱：support@goldenpaw.app</text>
        <text class="section-text">• 微信公众号：GoldenPaw金爪</text>
      </view>

      <view class="footer">
        <text class="footer-text">GoldenPaw 团队</text>
        <text class="footer-text">最后更新：2026年6月</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
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
  display: flex;
  flex-direction: column;
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
  flex: 1;
  padding: 0 $space-6 $space-8;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  @include text-body;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-bottom: 12px;
}

.section-text {
  @include text-body;
  color: $text-secondary;
  line-height: 1.8;
  display: block;
  margin-bottom: 4px;
}

.footer {
  margin-top: 24px;
  padding: 24px 0;
  border-top: 1px solid $border;
  text-align: center;
}

.footer-text {
  @include text-caption;
  color: $text-tertiary;
  display: block;
  margin-bottom: 4px;
}
</style>
