<template>
  <view class="container">
    <view class="nav-bar">
      <text class="iconfont icon-back" @click="goBack"></text>
      <text class="nav-title">{{ $t('login') }}</text>
    </view>

    <view class="content">
      <view class="logo-container">
        <image class="logo" src="/static/logo.png" mode="aspectFit" />
        <text class="app-name">{{ $t('webname') }}</text>
      </view>

      <view class="form-container">
        <view class="input-group">
          <input
            v-model="email"
            type="text"
            :placeholder="$t('email')"
            class="input"
          />
          <input
            v-model="password"
            type="password"
            :placeholder="$t('password')"
            class="input"
          />
        </view>

        <button @click="handleEmailLogin" class="btn btn-primary">
          {{ $t('login') }}
        </button>

        <view class="divider">
          <view class="line"></view>
          <text class="divider-text">{{ $t('or') }}</text>
          <view class="line"></view>
        </view>

        <button @click="handleWeb3Login" class="btn btn-wallet">
          {{ $t('loginWithWallet') }}
        </button>

        <view class="action-links">
          <text @click="navigateToForgotPassword" class="link">
            {{ $t('forgotPassword') }}
          </text>
          <text @click="navigateToRegister" class="link highlight">
            {{ $t('register') }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    // 验证邮箱格式
    validateEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      return emailRegex.test(email)
    },

    // 验证密码格式
    validatePassword(password) {
      return password.length >= 6 // 假设密码最少6位
    },

    // 表单验证
    validateForm() {
      if (!this.email.trim()) {
        uni.showToast({
          title: '请输入邮箱',
          icon: 'none'
        })
        return false
      }
      if (!this.validateEmail(this.email)) {
        uni.showToast({
          title: '邮箱格式不正确',
          icon: 'none'
        })
        return false
      }
      if (!this.password) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        })
        return false
      }
      if (!this.validatePassword(this.password)) {
        uni.showToast({
          title: '密码不能少于6位',
          icon: 'none'
        })
        return false
      }
      return true
    },

    handleEmailLogin() {
      // 表单验证
      if (!this.validateForm()) {
        return
      }

      // 请求登录接口
      let data = {
        user_mail: this.email.trim(),
        password: this.password
      }

      this.$service("/api/Login", "post", data).then((res) => {
        console.log(res)
          res = res.data;
          if (res.code === 0) {
            uni.showToast({
              title: '登录成功',
              icon: 'success'
            });
            uni.setStorageSync('token', 'bearer ' + res.data.access_token);
            // 跳转到首页
            uni.switchTab({
              url: '/pages/mine/mine'
            });



          } else if(res.code == 1) {
            uni.showToast({
              title: res.message,
              icon: 'none'
            });
          }
        })
        .catch((err) => {
          // 处理异常
          console.error('请求失败:', err);
          uni.showToast({
            title: '请求失败，请稍后再试',
            icon: 'none'
          });
        });
    },
    handleWeb3Login() {
      // Implement Web3 wallet login logic here
      console.log('Web3 wallet login')
    },
    navigateToForgotPassword() {
      // Navigate to forgot password page
      console.log('Navigate to forgot password')
	  uni.navigateTo({
	  	url:'/pages/forget/forget'
	  })
    },
    navigateToRegister() {
      // Navigate to register page
      console.log('Navigate to register')
	  uni.navigateTo({
	  	url:'/pages/register/register'
	  })
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #121212;
  position: relative;
  box-sizing: border-box;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 88rpx;
  padding: var(--status-bar-height) 32rpx 0;
  display: flex;
  align-items: center;
  background-color: #121212;
  z-index: 100;
}

.icon-back {
  font-size: 48rpx;
  color: #ffffff;
  padding: 16rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
  margin-right: 80rpx; /* 补偿返回按钮的宽度，保持标题居中 */
}

.content {
  padding: calc(88rpx + var(--status-bar-height)) 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
}

.logo-container {
  padding: 80rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.logo {
  width: 128rpx;
  height: 128rpx;
  margin-bottom: 32rpx;
}

.app-name {
  font-size: 48rpx;
  color: #ffffff;
  font-weight: 600;
}

.form-container {
  width: 100%;
  padding: 0 32rpx;
  box-sizing: border-box;
}

.input-group {
  margin-bottom: 48rpx;
  width: 100%;
}

.input {
  width: 100%;
  height: 88rpx;
  background: #1E1E1E;
  border: 2rpx solid #2A2A2A;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  padding: 0 32rpx;
  color: #ffffff;
  font-size: 30rpx;
  box-sizing: border-box;
}

.input:last-child {
  margin-bottom: 0;
}

.input::placeholder {
  color: #666666;
}

.btn {
  width: 100%;
  height: 88rpx;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 48rpx;
  box-sizing: border-box;
}

.btn-primary {
  background: #2C6EFF;
  color: #ffffff;
  border: none;
}

.btn-wallet {
  background: #1E1E1E;
  border: 2rpx solid #2A2A2A;
  color: #ffffff;
}

.divider {
  display: flex;
  align-items: center;
  margin: 48rpx 0;
  width: 100%;
}

.line {
  flex: 1;
  height: 2rpx;
  background-color: #2A2A2A;
}

.divider-text {
  padding: 0 32rpx;
  color: #666666;
  font-size: 28rpx;
}

.action-links {
  display: flex;
  justify-content: space-between;
  margin-top: 48rpx;
  padding: 0 16rpx;
  width: 100%;
}

.link {
  color: #666666;
  font-size: 28rpx;
}

.link.highlight {
  color: #2C6EFF;
}

/* 按钮点击效果 */
.btn:active {
  opacity: 0.8;
}

/* 输入框焦点效果 */
.input:focus {
  border-color: #2C6EFF;
  background: #1E1E1E;
}

/* 适配 iPhone X 及以上机型 */
@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
  .container {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* 适配小屏幕设备 */
@media screen and (max-height: 667px) {
  .logo-container {
    padding: 40rpx 0;
  }

  .logo {
    width: 100rpx;
    height: 100rpx;
  }

  .app-name {
    font-size: 40rpx;
  }
}
</style>
