<template>
  <view class="container">
    <view class="header">
      <text class="title">{{ $t('register') }}</text>
    </view>

    <view class="register-form">
      <view class="input-group">
        <input
          v-model="formData.email"
          type="email"
          :placeholder="$t('email')"
          class="input"
          @blur="validateEmail"
        />
        <text v-if="errors.email" class="error-text">{{ errors.email }}</text>
      </view>

      <view class="input-group verification-container">
        <input
          v-model="formData.emailVerificationCode"
          type="text"
          :placeholder="$t('emailVerificationCode')"
          class="input verification-input"
        />
        <button
          :disabled="!isEmailValid || isDisabled"
          @click="sendVerificationCode"
          class="btn btn-outline verification-btn"
        >
          {{ countDownText }}
        </button>
      </view>

      <view class="input-group">
        <input
          v-model="formData.password"
          type="password"
          :placeholder="$t('password')"
          class="input"
          @blur="validatePassword"
        />
        <text v-if="errors.password" class="error-text">{{ errors.password }}</text>
      </view>

      <view class="input-group">
        <input
          v-model="formData.confirmPassword"
          type="password"
          :placeholder="$t('confirmPassword')"
          class="input"
          @blur="validateConfirmPassword"
        />
        <text v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</text>
      </view>

      <view class="input-group">
        <input
          v-model="formData.phoneNumber"
          type="tel"
          :placeholder="$t('phoneNumber')"
          class="input"
          @blur="validatePhone"
        />
        <text v-if="errors.phoneNumber" class="error-text">{{ errors.phoneNumber }}</text>
      </view>

      <view class="input-group">
        <input
          v-model="formData.inviteCode"
          type="text"
          :placeholder="$t('inviteCode')"
          class="input"
          @blur="validateInviteCode"
          maxlength="8"
        />
        <text v-if="errors.inviteCode" class="error-text">{{ errors.inviteCode }}</text>
      </view>

      <button
        @click="handleRegister"
        :disabled="!isFormValid"
        class="submit-btn"
        :class="{'submit-btn-disabled': !isFormValid}"
      >
        {{ $t('register') }}
      </button>
    </view>
    <view class="footer">
      <text @click="navigateToLogin" class="link">{{ $t('haveAccount') }}</text>
      <button @click="handleDownloadApp" class="download-btn">
        {{ $t('downloadApp') }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        email: '',
        emailVerificationCode: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        inviteCode: '',
      },
      errors: {
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        inviteCode: '',
      },
      isDisabled: false,
      countdown: 60,
      timer: null
    }
  },
  computed: {
    isEmailValid() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(this.formData.email)
    },
    countDownText() {
      return this.isDisabled ? `${this.countdown}s` : '发送验证码'
    },
    isFormValid() {
      return this.isEmailValid &&
             this.formData.emailVerificationCode &&
             this.formData.password &&
             this.formData.confirmPassword &&
             this.formData.phoneNumber &&
             this.formData.inviteCode &&
             Object.values(this.errors).every(error => !error)
    }
  },
  methods: {
    validateEmail() {
      if (!this.formData.email) {
        this.errors.email = '请输入邮箱'
      } else if (!this.isEmailValid) {
        this.errors.email = '请输入有效的邮箱地址'
      } else {
        this.errors.email = ''
      }
    },
    validatePassword() {
      if (!this.formData.password) {
        this.errors.password = '请输入密码'
      } else if (this.formData.password.length < 6) {
        this.errors.password = '密码长度至少6位'
      } else {
        this.errors.password = ''
      }
    },
    validateConfirmPassword() {
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errors.confirmPassword = '两次输入的密码不一致'
      } else {
        this.errors.confirmPassword = ''
      }
    },
    validatePhone() {
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!this.formData.phoneNumber) {
        this.errors.phoneNumber = '请输入手机号码'
      } else if (!phoneRegex.test(this.formData.phoneNumber)) {
        this.errors.phoneNumber = '请输入有效的手机号码'
      } else {
        this.errors.phoneNumber = ''
      }
    },
    validateInviteCode() {
      if (this.formData.inviteCode) {
        const inviteCodeRegex = /^\d{8}$/
        if (!inviteCodeRegex.test(this.formData.inviteCode)) {
          this.errors.inviteCode = '邀请码必须是8位数字'
        } else {
          this.errors.inviteCode = ''
        }
      } else {
        this.errors.inviteCode = ''  // 因为是选填，所以为空时不显示错误
      }
    },
    async handleRegister() {
      try {
        uni.showLoading({ title: '注册中...' })
        const res = await this.$service("/api/register", "post", {
          user_mail: this.formData.email,
          password: this.formData.password,
          confirm_password: this.formData.confirmPassword,
          user_mobile: this.formData.phoneNumber,
          code: this.formData.emailVerificationCode,
          invite_code: this.formData.inviteCode || undefined  // 如果没有填写则不传该字段
        })

        if (res.data.code === 0) {
          uni.showToast({ title: '注册成功', icon: 'success' })
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/login/login' })
          }, 1500)
        } else {
          uni.showToast({ title: res.data.message, icon: 'none' })
        }
      } catch (err) {
        console.error('注册失败:', err)
        uni.showToast({ title: '注册失败，请稍后重试', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
    startCountdown() {
      this.isDisabled = true;  // 禁用按钮
      this.buttonText = `${this.countdown}秒后重新发送`;
      this.interval = setInterval(() => {
        this.countdown--;  // 每秒减少倒计时
        this.buttonText = `${this.countdown}秒后重新发送`;
        // 如果倒计时结束，启用按钮
        if (this.countdown <= 0) {
          clearInterval(this.interval);  // 清除定时器
          this.isDisabled = false;       // 启用按钮
          this.buttonText = '发送验证码'; // 重置按钮文本
          this.countdown = 60;            // 重置倒计时
        }
      }, 1000);
    },
    sendVerificationCode() {
      //禁用按钮
      this.isDisabled = true;
      // Implement send verification code logic here
      const data = {
        email: this.formData.email,
        message_type: 'signup'
      }
      this.$service("/api/common/get-email-code", "post", data)
          .then((res) => {
            res = res.data;
            if (res.code === 0) {
              uni.showToast({
                title: '验证码已发送，请注意查收',
                icon: 'none'
              });
              this.startCountdown();
            } else if (res.code == 1) {
              uni.showToast({
                title: res.message,
                icon: 'none'
              });
              this.isDisabled = false;
            }
          }).catch((err) => {
        // 处理异常
        console.error('请求失败:', err); // 打印错误信息
        uni.showToast({
          title: '请求失败，请稍后再试',
          icon: 'none'
        });
        this.isDisabled = false;
      });
      // console.log('Send verification code to:', this.email)
    }
  }
};
</script>

<style scoped>

button:disabled {
  background-color: #ccc; /* 禁用时的背景色 */
  color: #999;            /* 禁用时的文字颜色 */
  cursor: not-allowed;    /* 禁用时的鼠标样式 */
}

.container {
  min-height: 100vh;
  background-color: #121212;
  padding: 0;
  box-sizing: border-box;
}

.header {
  padding: 88rpx 30rpx 40rpx;
  position: relative;
}

.title {
  font-size: 56rpx;
  font-weight: 600;
  color: #ffffff;
}

.register-form {
  padding: 40rpx 30rpx;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group {
  margin-bottom: 40rpx;
  width: 100%;
  max-width: 690rpx;
}

.input {
  width: 100%;
  height: 96rpx;
  background-color: #1e1e1e;
  border: 2rpx solid #2a2a2a;
  border-radius: 16rpx;
  color: #ffffff;
  padding: 0 30rpx;
  font-size: 30rpx;
  box-sizing: border-box;
}

.input::placeholder {
  color: #666666;
}

.verification-container {
  display: flex;
  gap: 24rpx;
  width: 100%;
  max-width: 690rpx;
}

.verification-input {
  flex: 1;
}

.verification-btn {
  width: 220rpx;
  height: 96rpx;
  background-color: #1db954;
  border: none;
  border-radius: 16rpx;
  color: #ffffff;
  font-size: 28rpx;
  padding: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all 0.3s ease;
}

.verification-btn-active {
  opacity: 0.9;
}

.verification-btn:disabled {
  background-color: #2a2a2a;
  color: #666666;
  border: 1px solid #333333;
}

.submit-btn {
  width: 100%;
  max-width: 690rpx;
  height: 96rpx;
  background-color: #1db954;
  border-radius: 16rpx;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  margin-top: 60rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.footer {
  padding: 40rpx 30rpx;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40rpx;
}

.link {
  color: #1e88e5;
  font-size: 28rpx;
}

.download-btn {
  width: 100%;
  max-width: 690rpx;
  height: 96rpx;
  background-color: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 16rpx;
  color: rgba(255, 255, 255, 0.9);
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* 适配 iPhone X 及以上机型的底部安全区域 */
@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
  .container {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* 适配小屏幕设备 */
@media screen and (max-width: 320px) {
  .header {
    padding-top: 60rpx;
  }

  .title {
    font-size: 48rpx;
  }

  .input,
  .verification-btn,
  .submit-btn,
  .download-btn {
    height: 88rpx;
  }

  .input {
    font-size: 28rpx;
  }

  .verification-btn {
    font-size: 26rpx;
  }
}

.error-text {
  color: #ff4d4f;
  font-size: 24rpx;
  margin-top: 8rpx;
}

.submit-btn-disabled {
  background-color: #666666;
  opacity: 0.5;
}

.input-group {
  margin-bottom: 24rpx;
}

.input:focus {
  border-color: #1db954;
  outline: none;
}

/* 添加输入框动画效果 */
.input {
  transition: all 0.3s ease;
}

/* 添加按钮动画效果 */
.submit-btn {
  transition: all 0.3s ease;
}

.submit-btn:active {
  transform: scale(0.98);
}
</style>
