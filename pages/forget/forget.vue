<template>
  <view class="container">
    <view class="logo-container">
      <image class="logo" src="/placeholder.svg?height=80&width=80" mode="aspectFit" />
      <text class="app-name">CryptoTrader</text>
    </view>

    <view class="forgot-password-form">
      <text class="form-title">找回密码</text>
      <input
        v-model="formData.email"
        type="email"
        placeholder="请输入您的邮箱"
        class="input"
        @blur="validateEmail"
      />
      <text v-if="errors.email" class="error-text">{{ errors.email }}</text>

      <view class="code-input-group">
        <view class="code-input-wrapper">
          <input
            v-model="formData.emailVerificationCode"
            type="text"
            placeholder="邮箱验证码"
            class="code-input"
          />
        </view>
        <button
          :disabled="isDisabled || !formData.email"
          @click="sendVerificationCode"
          class="code-btn"
        >
          {{ buttonText }}
        </button>
      </view>
      <text v-if="errors.emailVerificationCode" class="error-text">{{ errors.emailVerificationCode }}</text>

      <input
        v-model="formData.newPassword"
        type="password"
        placeholder="新密码 (至少8位，包含字母和数字)"
        class="input"
        @blur="validatePassword"
      />
      <text v-if="errors.newPassword" class="error-text">{{ errors.newPassword }}</text>

      <input
        v-model="formData.confirmPassword"
        type="password"
        placeholder="确认新密码"
        class="input"
        @blur="validateConfirmPassword"
      />
      <text v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</text>

      <button
        @click="handleResetPassword"
        :disabled="!isFormValid"
        :class="['btn btn-primary', {'btn-disabled': !isFormValid}]"
      >
        重置密码
      </button>
    </view>

    <view class="links">
      <text @click="navigateToLogin" class="link">返回登录</text>
    </view>

    <button @click="handleDownloadApp" class="btn btn-outline download-btn">
      下载App
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        email: '',
        emailVerificationCode: '',
        newPassword: '',
        confirmPassword: ''
      },
      errors: {
        email: '',
        emailVerificationCode: '',
        newPassword: '',
        confirmPassword: ''
      },
      buttonText: '获取验证码',
      isDisabled: false,
      countdown: 60,
      interval: null,
    }
  },
  computed: {
    isFormValid() {
      return this.formData.email &&
             this.formData.emailVerificationCode &&
             this.formData.newPassword &&
             this.formData.confirmPassword &&
             !Object.values(this.errors).some(error => error !== '');
    }
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.formData.email) {
        this.errors.email = '邮箱不能为空';
      } else if (!emailRegex.test(this.formData.email)) {
        this.errors.email = '请输入有效的邮箱地址';
      } else {
        this.errors.email = '';
      }
    },

    validateVerificationCode() {
      if (!this.formData.emailVerificationCode) {
        this.errors.emailVerificationCode = '验证码不能为空';
      } else if (!/^\d{6}$/.test(this.formData.emailVerificationCode)) {
        this.errors.emailVerificationCode = '请输入6位数字验证码';
      } else {
        this.errors.emailVerificationCode = '';
      }
    },

    validatePassword() {
      if (!this.formData.newPassword) {
        this.errors.newPassword = '密码不能为空';
      } else if (this.formData.newPassword.length < 8) {
        this.errors.newPassword = '密码长度至少8位';
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(this.formData.newPassword)) {
        this.errors.newPassword = '密码必须包含字母和数字';
      } else {
        this.errors.newPassword = '';
      }
    },

    validateConfirmPassword() {
      if (!this.formData.confirmPassword) {
        this.errors.confirmPassword = '请确认密码';
      } else if (this.formData.confirmPassword !== this.formData.newPassword) {
        this.errors.confirmPassword = '两次输入的密码不一致';
      } else {
        this.errors.confirmPassword = '';
      }
    },

    async sendVerificationCode() {
      this.validateEmail();
      if (this.errors.email) return;

      try {
        const res = await this.$service("/api/common/get-email-code", "post", {
          email: this.formData.email,
          message_type: 'reset_password'
        });

        if (res.data.code === 0) {
          this.startCountdown();
          uni.showToast({
            title: '验证码已发送，请注意查收',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: res.data.message || '发送失败',
            icon: 'error'
          });
        }
      } catch (err) {
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'error'
        });
      }
    },

    async handleResetPassword() {
      // 验证所有字段
      this.validateEmail();
      this.validateVerificationCode();
      this.validatePassword();
      this.validateConfirmPassword();

      if (!this.isFormValid) return;

      try {
        const res = await this.$service("/api/ForgetPassword", "post", {
          user_mail: this.formData.email,
          code: this.formData.emailVerificationCode,
          password: this.formData.newPassword,
          confirm_password: this.formData.confirmPassword,
          type: 'user_mail'
        });

        if (res.data.code === 0) {
          uni.showToast({
            title: '密码重置成功',
            icon: 'success',
            duration: 2000
          });
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/login/login'
            });
          }, 2000);
        } else {
          uni.showToast({
            title: res.data.message || '重置失败',
            icon: 'error'
          });
        }
      } catch (err) {
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'error'
        });
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
    navigateToLogin() {
      // Navigate to login page
      console.log('Navigate to login')
	  uni.navigateTo({
	  	url:'/pages/login/login'
	  })
    },
    handleDownloadApp() {
      // Implement app download logic here
      console.log('Download app')
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #121212;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.app-name {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}

.forgot-password-form {
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
}

.form-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
  text-align: center;
}

.input {
  width: 100%;
  height: 40px;
  background-color: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  color: #ffffff;
  padding: 0 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.code-input-group {
  display: flex;
  width: 100%;
  gap: 10px;
  margin-bottom: 10px;
}

.code-input-wrapper {
  flex: 1;
  min-width: 0;
}

.code-input {
  width: 100%;
  height: 40px;
  background-color: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  color: #ffffff;
  padding: 0 10px;
  box-sizing: border-box;
}

.code-btn {
  width: 120px;
  height: 40px;
  background-color: transparent;
  color: #1e88e5;
  border: 1px solid #1e88e5;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  padding: 0 12px;
  flex-shrink: 0;
}

.code-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.btn-primary {
  background-color: #1e88e5;
  color: #ffffff;
  border: none;
}

.btn-outline {
  background-color: transparent;
  color: #1e88e5;
  border: 1px solid #1e88e5;
}

.links {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
}

.link {
  color: #1e88e5;
  text-decoration: underline;
  cursor: pointer;
}

.download-btn {
  width: 100%;
  max-width: 300px;
}

.error-text {
  color: #ff4d4f;
  font-size: 12px;
  margin-bottom: 8px;
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input {
  transition: all 0.3s ease;
}

.input:focus {
  border-color: #1e88e5;
  box-shadow: 0 0 0 2px rgba(30,136,229,0.2);
}

.btn {
  transition: all 0.3s ease;
}

.btn-primary:not(.btn-disabled):hover {
  background-color: #1976d2;
}

.btn-outline:not(.btn-disabled):hover {
  background-color: rgba(30,136,229,0.1);
}
</style>
