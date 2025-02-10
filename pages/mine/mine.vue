<template>
  <view class="page-container">
    <!-- 顶部用户信息 -->
    <view class="header">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill" @click="changeAvatar"></image>
        <view class="user-details">
          <text class="nickname">{{ userInfo.user_name }}</text>
          <text class="user-id">UID: {{ userInfo.id }}</text>
        </view>
      </view>
      <view class="lang-switcher">
        <language-switcher @language-changed="onLanguageChanged"/>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="menu-section">
      <!-- 资产 -->
      <view class="menu-item" @click="goToAssets">
        <view class="menu-left">
          <image class="menu-icon" src="/static/iconfont/assets.svg" mode="aspectFit"/>
          <text class="menu-title">{{ $t('assets') }}</text>
        </view>
        <view class="menu-right">
          <text class="menu-value">{{ totalAssets }} USDT</text>
          <text class="iconfont icon-right">></text>
        </view>
      </view>

      <!-- 实名认证 -->
      <view class="menu-item" @click="userInfo.real_name_authority !== 1 && goToAuthentication()">
        <view class="menu-left">
          <image class="menu-icon" src="/static/iconfont/authentication.svg" mode="aspectFit"/>
          <text class="menu-title">{{ $t('authentication') }}</text>
        </view>
        <view class="menu-right">
          <text class="menu-value" :class="{
            'unverified': userInfo.real_name_authority == 0,
            'verified': userInfo.real_name_authority == 1
          }">
            {{ userInfo.real_name_authority == 1 ? $t('authenticated') : $t('notAuthenticated') }}
          </text>
          <text class="iconfont icon-right">></text>
        </view>
      </view>

      <!-- 手机号码 -->
      <view class="menu-item" @click="bindPhone">
        <view class="menu-left">
          <image class="menu-icon" src="/static/iconfont/phone.svg" mode="aspectFit"/>
          <text class="menu-title">{{ $t('phoneNumber') }}</text>
        </view>
        <view class="menu-right">
          <text class="menu-value" :class="{'unverified': !userInfo.user_mobile}">
            {{ userInfo.user_mobile || $t('notBound') }}
          </text>
          <text class="iconfont icon-right">></text>
        </view>
      </view>

      <!-- 邮箱 -->
      <view class="menu-item" @click="goToBindEmail">
        <view class="menu-left">
          <image class="menu-icon" src="/static/iconfont/email.svg" mode="aspectFit"/>
          <text class="menu-title">{{ $t('email') }}</text>
        </view>
        <view class="menu-right">
          <text class="menu-value" :class="{'unverified': !userInfo.user_mail}">
            {{ userInfo.user_mail || $t('notBound') }}
          </text>
          <text class="iconfont icon-right">></text>
        </view>
      </view>

      <!-- 帮助中心 -->
      <view class="menu-item" @click="goToHelpCenter">
        <view class="menu-left">
          <image class="menu-icon" src="/static/iconfont/help.svg" mode="aspectFit"/>
          <text class="menu-title">{{ $t('helpCenter') }}</text>
        </view>
        <view class="menu-right">
          <text class="iconfont icon-right">></text>
        </view>
      </view>


      <!-- 联系客服 -->
      <view class="menu-item" @click="contactCustomerService">
        <view class="menu-left">
          <image class="menu-icon" src="/static/iconfont/customer.svg" mode="aspectFit"/>
          <text class="menu-title">{{ $t('customerService') }}</text>
        </view>
        <view class="menu-right">
          <text class="iconfont icon-right">></text>
        </view>
      </view>
    </view>

       <!-- 退出登录 -->
       <view class="menu-item" @click="logout">
        <view class="menu-left">
          <image class="menu-icon" src="/static/iconfont/logout.svg" mode="aspectFit"/>
          <text class="menu-title">{{ $t('logout') }}</text>
        </view>
        <view class="menu-right">
          <text class="iconfont icon-right">></text>
        </view>
      </view>
  </view>
</template>

<script>
import LanguageSwitcher from '@/components/language-switcher/language-switcher.vue'
import { uploadFile } from '@/untils/request.js'

export default {
  components: {
    LanguageSwitcher
  },
  data() {
    return {
      userInfo: {
        avatar: '/static/logo.png',
        user_name: '用户昵称',
        id: '123456',
        user_mobile: '未绑定',
        user_mail: '未绑定',
        real_name_authority: 0
      },
      totalAssets: '0.00'
    };
  },
  onShow() {
    if(uni.getStorageSync('token')) {
      this.getUserInfo();
    }else{
      uni.navigateTo({
        url: '/pages/login/login'
      });
    }
  },
  methods: {
    async changeAvatar() {
      try {
        let res = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        })

        const filePath = res.tempFilePaths[0]

        // 显示上传中提示
        uni.showLoading({
          title: this.$t('uploading')
        })

        try {
          const uploadRes = await uploadFile(filePath, 'other')
          const api_url = uploadRes.api_url
            // 更新头像URL
            const data = {
              avatar: api_url
            }
            this.$service("/api/user/Avatar", "post",data)
                .then((res) => {
                  res = res.data;
                  if (res.code === 0) {
                    uni.showToast({
                      title: this.$t('SaveSuccess'),
                      icon:'success'
                    })
                    this.getUserInfo();
                  } else if (res.code == 1) {
                    uni.showToast({
                      title: res.message,
                      icon: 'none'
                    });
                  }
                }).catch((err) => {
              // 处理异常
              console.error('请求失败:', err); // 打印错误信息
              uni.showToast({
                title: '请求失败，请稍后再试',
                icon: 'none'
              });
            });

            uni.showToast({
              title: this.$t('uploadSuccess'),
              icon: 'success'
            })

        } catch (error) {
          uni.showToast({
            title: this.$t('uploadFailed'),
            icon: 'none'
          })
        } finally {
          uni.hideLoading()
        }
      } catch (error) {
        console.error('Choose image failed:', error)
      }

    },

    bindPhone() {
      uni.navigateTo({
        url: '/pages/bind-phone/bind-phone'
      });
    },
    goToBindEmail() {
      uni.navigateTo({
        url: '/pages/bind-email/bind-email'
      });
    },
    goToHelpCenter() {
      uni.navigateTo({
        url: '/pages/help-center/help-center'
      });
    },
    goToAuthentication() {
      uni.navigateTo({
        url: '/pages/authentication/authentication'
      });
    },
    contactCustomerService() {
      uni.showModal({
        title: '联系客服',
        content: '是否拨打客服热线？',
        success: (res) => {
          if (res.confirm) {
            uni.makePhoneCall({
              phoneNumber: '400-123-4567' // 替换为实际的客服电话
            });
          }
        }
      });
    },
    getUserInfo() {
      const token = uni.getStorageSync('token');
      this.$service("/api/user/GetUserInfo", "post")
          .then((res) => {
            res = res.data;
            if (res.code === 0) {
              this.userInfo = res.data;
            } else if (res.code == 1) {
              uni.showToast({
                title: res.message,
                icon: 'none'
              });
            }
          }).catch((err) => {
        // 处理异常
        console.error('请求失败:', err); // 打印错误信息
        uni.showToast({
          title: '请求失败，请稍后再试',
          icon: 'none'
        });
      });
    },
    logout() {
      // 退出登录 弹窗
      uni.showModal({
        title: this.$t('logout'),
        content: this.$t('confirmLogout'),
        confirmText: this.$t('confirm'),
        cancelText: this.$t('cancel'),
        confirmColor: '#ff4d4f',
        success: (res) => {
          if (res.confirm) {
            this.$service("/api/user/LoginOut", "post")
                .then((res) => {
                  res = res.data;
                  if (res.code === 0) {
                    uni.removeStorageSync('token');
                    uni.removeStorageSync('userInfo');
                    uni.navigateTo({
                      url: '/pages/login/login'
                    });
                  } else if (res.code == 1) {
                    uni.showToast({
                      title: res.message,
                      icon: 'none'
                    });
                  }
                }).catch((err) => {
              uni.showToast({
                title: '请求失败，请稍后再试',
                icon: 'none'
              });
            });
          }
        }
      });
    },
    goToAssets() {
      uni.navigateTo({
        url: '/pages/assets/assets'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #1c1c1c;
  padding: 30rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.header {
  background: #2a2a2a;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background: #1c1c1c;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;

  .nickname {
    font-size: 32rpx;
    color: #ffffff;
    font-weight: 500;
  }

  .user-id {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.5);
  }
}

.lang-switcher {
  padding: 8rpx;
}

.menu-section {
  background: #2a2a2a;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 24rpx;
  position: relative;
  background: #2a2a2a;
  border-radius: 16rpx;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 24rpx;
    right: 24rpx;
    bottom: 0;
    height: 2rpx;
    background: rgba(255, 255, 255, 0.1);
  }

  .menu-icon {
    width: 40rpx;
    height: 40rpx;
    filter: invert(1);
    opacity: 0.5;
  }

  &:active {
    background: rgba(255, 255, 255, 0.05);
  }

  &.menu-item-disabled {
    pointer-events: none;

    .menu-icon {
      opacity: 0.3;
    }

    .icon-right {
      display: none;
    }
  }
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.menu-icon {
  width: 40rpx;
  height: 40rpx;
  filter: invert(1);
}

.menu-title {
  font-size: 28rpx;
  color: #ffffff;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.menu-value {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);

  &.unverified {
    color: #ff4d4f;
  }

  &.verified {
    color: #1db954;  // 使用绿色
  }
}

.icon-right {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.3);
}

// 适配 iPhone X 及以上机型
@supports (padding-bottom: constant(safe-area-inset-bottom)) or (padding-bottom: env(safe-area-inset-bottom)) {
  .page-container {
    min-height: calc(100vh - constant(safe-area-inset-bottom));
    min-height: calc(100vh - env(safe-area-inset-bottom));
  }
}
</style>
