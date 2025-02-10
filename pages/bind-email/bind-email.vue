<template>
  <view class="bind-email">
    <page-header :title="$t('changeEmail')"/>
    
    
    <view class="container">
      <view class="form-container">
        <!-- 步骤提示 -->
        <view class="step-tips">
          <text class="step-number">{{ currentStep }}/2</text>
          <text class="step-desc">{{ stepDescription }}</text>
        </view>

        <!-- 第一步：验证原邮箱 -->
        <template v-if="currentStep === 1">
          <view class="form-item">
            <text class="label">{{ $t('oldEmail') }}</text>
            <view class="email-display">
              <text>{{ maskEmailAddress(oldEmail) }}</text>
            </view>
          </view>
          
          <view class="form-item">
            <text class="label">{{ $t('verificationCode') }}</text>
            <view class="verify-code-container">
              <input 
                class="verify-input" 
                type="number" 
                v-model="verifyCode" 
                :placeholder="$t('enterVerificationCode')"
                maxlength="6"
              />
              <button 
                class="verify-btn" 
                :class="{ 'disabled': isCountingDown }"
                :disabled="isCountingDown"
                @click="handleSendCode(1)"
              >
                {{ countDownText }}
              </button>
            </view>
          </view>

          <button 
            class="submit-btn" 
            :class="{ 'disabled': !isVerifyCodeValid }"
            :disabled="!isVerifyCodeValid"
            @click="handleVerifyOldEmail"
          >
            {{ $t('nextStep') }}
          </button>
        </template>

        <!-- 第二步：绑定新邮箱 -->
        <template v-if="currentStep === 2">
          <view class="form-item">
            <text class="label">{{ $t('newEmail') }}</text>
            <input 
              class="email-input" 
              type="text" 
              v-model="newEmail" 
              :placeholder="$t('enterNewEmail')"
            />
          </view>
          
          <view class="form-item">
            <text class="label">{{ $t('verificationCode') }}</text>
            <view class="verify-code-container">
              <input 
                class="verify-input" 
                type="number" 
                v-model="newVerifyCode" 
                :placeholder="$t('enterVerificationCode')"
                maxlength="6"
              />
              <button 
                class="verify-btn" 
                :class="{ 'disabled': !isEmailValid || isCountingDown }"
                :disabled="!isEmailValid || isCountingDown"
                @click="handleSendCode(2)"
              >
                {{ countDownText }}
              </button>
            </view>
          </view>

          <button 
            class="submit-btn" 
            :class="{ 'disabled': !isNewFormValid }"
            :disabled="!isNewFormValid"
            @click="handleSubmit"
          >
            {{ $t('confirmBind') }}
          </button>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 1,
      oldEmail: 'example@doumei.com',
      newEmail: '',
      verifyCode: '',
      newVerifyCode: '',
      countDown: {
        timer: null,
        count: 60,
        isRunning: false
      }
    }
  },

  computed: {
    stepDescription() {
   
      return this.currentStep === 1 ? this.$t('verifyOldEmail') : this.$t('bindNewEmail')
    },

    isEmailValid() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(this.newEmail)
    },

    isVerifyCodeValid() {
      return /^\d{6}$/.test(this.verifyCode)
    },

    isNewFormValid() {
      return this.isEmailValid && /^\d{6}$/.test(this.newVerifyCode)
    },

    isCountingDown() {
      return this.countDown.isRunning
    },

    countDownText() {
      return this.countDown.isRunning 
        ? `${this.countDown.count}${this.$t('seconds')}${this.$t('resend')}` 
        : this.$t('getVerificationCode')
    }
  },

  onLoad() {
    const userInfo = uni.getStorageSync('userInfo') || {}
    this.oldEmail = userInfo.email || ''
  },

  methods: {
    maskEmailAddress(email) {
      if (!email) return ''
      const [username, domain] = email.split('@')
      const maskedUsername = username.slice(0, 3) + '****'
      return `${maskedUsername}@${domain}`
    },

    startCountDown() {
      if (this.countDown.isRunning) return
      
      this.countDown.isRunning = true
      this.countDown.count = 60
      
      this.countDown.timer = setInterval(() => {
        if (this.countDown.count <= 1) {
          this.stopCountDown()
          return
        }
        this.countDown.count--
      }, 1000)
    },

    stopCountDown() {
      if (this.countDown.timer) {
        clearInterval(this.countDown.timer)
        this.countDown.timer = null
      }
      this.countDown.isRunning = false
      this.countDown.count = 60
    },

    async handleSendCode(step) {
      if (this.countDown.isRunning) return
      
      if (step === 2 && !this.isEmailValid) {
        uni.showToast({
          title: this.$t('enterValidEmail'),
          icon: 'none'
        })
        return
      }

      try {
        // TODO: 调用发送验证码接口
        uni.showToast({
          title: this.$t('codeSent'),
          icon: 'none'
        })
        this.startCountDown()
      } catch (error) {
        uni.showToast({
          title: error.message || this.$t('sendFailed'),
          icon: 'none'
        })
      }
    },

    async handleVerifyOldEmail() {
      if (!this.isVerifyCodeValid) return
      
      try {
        // TODO: 验证原邮箱验证码
        this.currentStep = 2
        this.verifyCode = ''
        this.stopCountDown()
      } catch (error) {
        uni.showToast({
          title: error.message || this.$t('verificationFailed'),
          icon: 'none'
        })
      }
    },

    async handleSubmit() {
      if (!this.isNewFormValid) return
      
      try {
        // TODO: 调用换绑邮箱接口
        uni.showToast({
          title: this.$t('bindSuccess'),
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.showToast({
          title: error.message || this.$t('operationFailed'),
          icon: 'none'
        })
      }
    },

    goBack() {
      uni.navigateBack()
    }
  },

  beforeDestroy() {
    this.stopCountDown()
  }
}
</script>

<style lang="scss" scoped>
.bind-email {
  min-height: 100vh;
  background: #1c1c1c;
  
  .nav-header {
    position: relative;
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 16px;
    background: #1c1c1c;
    
    .back-icon {
      position: absolute;
      left: 16px;
      height: 44px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      z-index: 1;
      
      text {
        font-size: 28px;
        color: #fff;
        transform: scaleX(0.8);
        height: auto;
        line-height: 1;
      }
    }
    
    .title {
      flex: 1;
      text-align: center;
      font-size: 17px;
      font-weight: 500;
      color: #fff;
    }
  }
  
  .container {
    padding: 20px;
    background-color: #1a1a1a;
    min-height: 100vh;
  }

  .form-container {
    background-color: #2a2a2a;
    border-radius: 12px;
    padding: 20px;
  }

  .step-tips {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    
    .step-number {
      color: #1db954;
      font-size: 18px;
      font-weight: 500;
    }
    
    .step-desc {
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
    }
  }

  .form-item {
    margin-bottom: 24px;
  }

  .label {
    display: block;
    margin-bottom: 12px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 15px;
  }

  .email-input, .email-display {
    height: 48px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 0 15px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }

  .email-display {
    display: flex;
    align-items: center;
  }

  .verify-code-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .verify-input {
    flex: 1;
    height: 48px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 0 15px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }

  .verify-btn {
    width: 120px;
    height: 48px;
    background-color: #1db954;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    line-height: 1;
    
    &.disabled {
      background-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.3);
    }
  }

  .submit-btn {
    width: 100%;
    height: 48px;
    background-color: #1db954;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    margin-top: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    line-height: 1;
    
    &.disabled {
      background-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.3);
    }
  }
}
</style> 