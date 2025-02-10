<template>
  <view class="bind-phone">
    <page-header :title="$t('changePhone')"/>

    <view class="container">
      <view class="form-container">
        <!-- 步骤提示 -->
        <view class="step-tips">
          <text class="step-number">{{ currentStep }}/2</text>
          <text class="step-desc">{{ stepDescription }}</text>
        </view>

        <!-- 第一步：验证原手机号 -->
        <template v-if="currentStep === 1">
          <view class="form-item">
            <text class="label">{{ $t('verifyOldPhone') }}</text>
            <view class="phone-display">
              <text>+{{ oldAreaCode }} {{ maskPhoneNumber(oldPhone) }}</text>
            </view>
          </view>
          
          <view class="form-item">
            <text class="label">{{ $t('phoneVerificationCode') }}</text>
            <view class="verify-code-container">
              <input 
                class="verify-input" 
                type="number" 
                v-model="verifyCode" 
                :placeholder="$t('enterPhoneVerificationCode')"
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
            @click="handleVerifyOldPhone"
          >
            {{ $t('nextStep') }}
          </button>
        </template>

        <!-- 第二步：绑定新手机号 -->
        <template v-if="currentStep === 2">
          <view class="form-item">
            <text class="label">{{ $t('newPhone') }}</text>
            <view class="phone-input-container">
              <view class="area-code" @click="showPicker = true">
                <text>+{{ areaCode }}</text>
                <text class="arrow-down">▼</text>
              </view>
              <input 
                class="phone-input" 
                type="number" 
                v-model="phone" 
                :placeholder="inputPlaceholder"
                :maxlength="currentMaxLength"
                @input="handlePhoneInput"
              />
            </view>
          </view>
          
          <view class="form-item">
            <text class="label">{{ $t('phoneVerificationCode') }}</text>
            <view class="verify-code-container">
              <input 
                class="verify-input" 
                type="number" 
                v-model="newVerifyCode" 
                :placeholder="$t('enterPhoneVerificationCode')"
                maxlength="6"
              />
              <button 
                class="verify-btn" 
                :class="{ 'disabled': !isPhoneValid || isCountingDown }"
                :disabled="!isPhoneValid || isCountingDown"
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

      <!-- 区号选择弹窗 -->
      <view class="picker-popup" v-if="showPicker">
        <view class="picker-mask" @click="showPicker = false"></view>
        <view class="picker-content">
          <view class="picker-header">
            <text class="picker-title">{{ $t('selectArea') }}</text>
            <text class="picker-close" @click="showPicker = false">✕</text>
          </view>
          <scroll-view scroll-y class="picker-body">
            <view 
              class="picker-item"
              v-for="item in translatedAreaList"
              :key="item.code"
              @click="selectArea(item)"
            >
              <text class="picker-item-name">{{ item.name }}</text>
              <text class="picker-item-code">+{{ item.code }}</text>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 1,
      oldAreaCode: '86',
      oldPhone: '13800138000', // 从用户数据中获取
      areaCode: '86',
      phone: '',
      verifyCode: '',
      newVerifyCode: '',
      countDown: {
        timer: null,
        count: 60,
        isRunning: false
      },
      showPicker: false,
      areaList: [
        { key: 'mainlandChina', code: '86' },
        { key: 'hongKong', code: '852' },
        { key: 'macao', code: '853' },
        { key: 'taiwan', code: '886' },
        { key: 'japan', code: '81' },
        { key: 'korea', code: '82' },
        { key: 'singapore', code: '65' },
        { key: 'malaysia', code: '60' },
        { key: 'thailand', code: '66' },
        { key: 'vietnam', code: '84' },
        { key: 'indonesia', code: '62' },
        { key: 'philippines', code: '63' },
        { key: 'india', code: '91' },
        { key: 'australia', code: '61' },
        { key: 'newZealand', code: '64' },
        { key: 'usa', code: '1' },
        { key: 'canada', code: '1' },
        { key: 'uk', code: '44' },
        { key: 'germany', code: '49' },
        { key: 'france', code: '33' }
      ]
    }
  },

  computed: {
    stepDescription() {
      return this.currentStep === 1 ? this.$t('verifyOldPhone') : this.$t('bindNewPhone')
    },

    currentMaxLength() {
      const maxLengths = {
        '86': 11,
        '852': 8,
        '853': 8,
        '886': 9,
        '81': 10,
        '82': 10
      }
      return maxLengths[this.areaCode] || 11
    },

    translatedAreaList() {
      return this.areaList.map(item => ({
        ...item,
        name: this.$t(`countries.${item.key}`)
      }))
    },

    inputPlaceholder() {
      const area = this.translatedAreaList.find(item => item.code === this.areaCode)
      return this.$t('enterNewPhone')
    },

    isPhoneValid() {
      const patterns = {
        '86': /^1[3-9]\d{9}$/,
        '852': /^[5-9]\d{7}$/,
        '853': /^[6]\d{7}$/,
        '886': /^[0-9]\d{8}$/,
        '81': /^[0-9]\d{9}$/,
        '82': /^[0-9]\d{9}$/,
        '65': /^[689]\d{7}$/,  // 新加坡
        '60': /^1\d{8,9}$/,    // 马来西亚
        '66': /^[689]\d{8}$/,  // 泰国
        '84': /^[3-9]\d{8}$/,  // 越南
        '62': /^8\d{9,10}$/,   // 印度尼西亚
        '63': /^9\d{9}$/,      // 菲律宾
        '91': /^[6789]\d{9}$/, // 印度
        '61': /^4\d{8}$/,      // 澳大利亚
        '64': /^2\d{7,9}$/,    // 新西兰
        '1': /^\d{10}$/,       // 美国和加拿大
        '44': /^7\d{9}$/,      // 英国
        '49': /^1\d{10,11}$/,  // 德国
        '33': /^[67]\d{8}$/    // 法国
      }
      return patterns[this.areaCode]?.test(this.phone) || false
    },

    isVerifyCodeValid() {
      return /^\d{6}$/.test(this.verifyCode)
    },

    isNewFormValid() {
      return this.isPhoneValid && /^\d{6}$/.test(this.newVerifyCode)
    },

    isCountingDown() {
      return this.countDown.isRunning
    },

    countDownText() {
      return this.countDown.isRunning 
        ? `${this.countDown.count} ${this.$t('seconds')} ${this.$t('resend')}` 
        : this.$t('getVerificationCode')
    }
  },

  methods: {
    maskPhoneNumber(phone) {
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    },

    selectArea(item) {
      this.areaCode = item.code
      this.phone = ''
      this.showPicker = false
    },

    handlePhoneInput(e) {
      const value = e.detail.value.replace(/\D/g, '')
      this.phone = value.slice(0, this.currentMaxLength)
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
      
      try {
        if (step === 1) {
          await this.$api.sendVerifyCode({
            areaCode: this.oldAreaCode,
            phone: this.oldPhone
          })
        } else {
          if (!this.isPhoneValid) return
          await this.$api.sendVerifyCode({
            areaCode: this.areaCode,
            phone: this.phone
          })
        }
        
        uni.showToast({
          title: this.$t('codeSent'),
          icon: 'success'
        })
      } catch (error) {
        uni.showToast({
          title: error.message || this.$t('sendFailed'),
          icon: 'none'
        })
        this.isSending = false
      }
    },
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--
        } else {
          this.isSending = false
          clearInterval(this.timer)
        }
      }, 1000)
    },
    async handleSubmit() {
      if (!this.isFormValid) return
      
      try {
        uni.showLoading({
          title: this.$t('submitting')
        })
        
        await this.$service.post('/api/bindPhone', {
          phone: this.phone,
          code: this.code
        })
        
        uni.hideLoading()
        uni.showToast({
          title: this.$t('bindSuccess'),
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: error.message || this.$t('bindFailed'),
          icon: 'none'
        })
      }
    }
  },
  beforeDestroy() {
    this.stopCountDown()
  }
}
</script>

<style lang="scss" scoped>
.bind-phone {
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

  .form-item {
    margin-bottom: 24px;
  }

  .label {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 8px;
  }

  .phone-input-container {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    overflow: hidden;
  }

  .area-code {
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 48px;
    background-color: rgba(255, 255, 255, 0.08);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    min-width: 90px;
    
    text {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      margin-right: 4px;
    }
    
    .arrow-down {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .phone-input {
    flex: 1;
    height: 48px;
    padding: 0 15px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    background-color: transparent;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
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

  .picker-popup {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
  }

  .picker-mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .picker-content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #2a2a2a;
    border-radius: 16px 16px 0 0;
    max-height: 70vh;
    animation: slideUp 0.3s ease-out;
  }

  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .picker-title {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
  }

  .picker-close {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.6);
    padding: 4px;
  }

  .picker-body {
    max-height: calc(70vh - 60px);
  }

  .picker-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    
    &:active {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .picker-item-name {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.9);
  }

  .picker-item-code {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
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

  .phone-display {
    height: 48px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    
    text {
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
    }
  }
}
</style> 