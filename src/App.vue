<script setup lang="ts">
import { onLaunch, onShow } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { seedAllStores } from '@/mock/seed'
import { useRecurringStore } from '@/stores/recurring'
import { useTransactionStore } from '@/stores/transaction'
import { useAccountStore } from '@/stores/account'
import { getCurrentTime } from '@/utils/format'

const appStore = useAppStore()
const locked = ref(false)
const lockInput = ref('')

onLaunch(() => {
  seedAllStores()

  // 执行到期的定期交易
  executeRecurringTransactions()

  // #ifdef H5
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-theme', appStore.theme)
  }
  // #endif
})

onShow(() => {
  if (appStore.fingerprintEnabled && appStore.appPassword) {
    // 优先尝试指纹验证
    // #ifdef APP-PLUS || MP-WEIXIN
    uni.checkIsSupportSoterAuthentication({
      success(res) {
        if ((res.supportMode || []).includes('fingerPrint')) {
          uni.startSoterAuthentication({
            requestAuthModes: ['fingerPrint'],
            challenge: 'goldenpaw_unlock_' + Date.now(),
            authContent: '请用指纹解锁',
            success() {
              // 指纹验证通过，无需显示密码锁
            },
            fail() {
              // 指纹验证失败，fallback 到密码锁
              locked.value = true
              lockInput.value = ''
            },
          })
        } else {
          // 设备不支持指纹，fallback 到密码锁
          locked.value = true
          lockInput.value = ''
        }
      },
      fail() {
        locked.value = true
        lockInput.value = ''
      },
    })
    // #endif
    // #ifndef APP-PLUS || MP-WEIXIN
    // H5 不支持指纹，fallback 到密码锁
    locked.value = true
    lockInput.value = ''
    // #endif
    return
  }

  if (appStore.appPassword) {
    locked.value = true
    lockInput.value = ''
  }
})

watch(() => appStore.theme, (newTheme) => {
  // #ifdef H5
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-theme', newTheme)
  }
  // #endif
})

function onLockConfirm() {
  if (lockInput.value === appStore.appPassword) {
    locked.value = false
    lockInput.value = ''
  } else {
    uni.showToast({ title: '密码错误', icon: 'none' })
    lockInput.value = ''
  }
}

/** 执行到期的定期交易 */
function executeRecurringTransactions() {
  const recurringStore = useRecurringStore()
  const txStore = useTransactionStore()
  const accStore = useAccountStore()
  const dueRules = recurringStore.getDueRules()

  if (dueRules.length === 0) return

  let executed = 0
  for (const rule of dueRules) {
    // 创建交易记录
    txStore.addTransaction({
      type: rule.type,
      amount: rule.amount,
      categoryId: rule.categoryId,
      accountId: rule.accountId,
      note: `[定期] ${rule.name}${rule.note ? ' - ' + rule.note : ''}`,
      date: rule.nextDate,
      time: getCurrentTime(),
      tags: rule.tags,
    })

    // 更新账户余额
    if (rule.type === 'expense') {
      accStore.updateBalance(rule.accountId, -rule.amount)
    } else if (rule.type === 'income') {
      accStore.updateBalance(rule.accountId, rule.amount)
    }

    // 推进下次执行日期
    recurringStore.advanceNextDate(rule.id)
    executed++
  }

  if (executed > 0) {
    uni.showToast({ title: `已自动执行 ${executed} 条定期交易`, icon: 'none' })
  }
}
</script>

<template>
  <view style="min-height:100vh">
    <slot />
    <!-- 密码锁定层 -->
    <view v-if="locked" class="lock-screen">
      <view class="lock-content">
        <text class="lock-icon">🔒</text>
        <text class="lock-title">请输入密码</text>
        <input
          class="lock-input"
          v-model="lockInput"
          type="number"
          maxlength="4"
          placeholder="4 位数字密码"
          confirm-type="done"
          @confirm="onLockConfirm"
        />
        <view class="lock-btn" @tap="onLockConfirm">
          <text>解锁</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use '@/styles/reset.scss';
@use '@/styles/design-system.scss';

.lock-screen {
  position: fixed;
  inset: 0;
  background: var(--bg-primary, #FDF8F3);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-content {
  text-align: center;
  padding: 40px;
}

.lock-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 24px;
}

.lock-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary, #2C2C2C);
  display: block;
  margin-bottom: 32px;
}

.lock-input {
  width: 200px;
  height: 52px;
  background: white;
  border: 1px solid var(--border, #E8E0D8);
  border-radius: 12px;
  text-align: center;
  font-size: 24px;
  letter-spacing: 8px;
  margin-bottom: 24px;
}

.lock-btn {
  display: inline-block;
  padding: 12px 48px;
  background: var(--gradient-brand, linear-gradient(135deg, #C8956C, #A67B5B));
  border-radius: 999px;
  color: white;
  font-weight: 700;
}
</style>
