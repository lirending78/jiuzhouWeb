<template>
  <view class="page-container">
    <!-- 自定义导航栏 -->
    <page-header title="充值">
      <template #left>
        <view class="header-left" @click="goBack">
          <text class="iconfont back-icon">&#xe679;</text>
        </view>
      </template>
    </page-header>

    <!-- 币种列表 -->
    <view class="currency-list">
      <view v-for="(currency, index) in currencyList"
            :key="index"
            class="currency-item"
            @click="goToDepositDetail(currency)">
        <view class="currency-left">
          <image class="currency-icon" :src="getCurrencyIcon(currency.currency)" mode="aspectFit"/>
          <text class="currency-name">{{ currency }}</text>
        </view>
        <text class="iconfont icon-right">></text>
      </view>
    </view>

    <!-- 合作伙伴列表 -->
<!--    <view class="partner-section">-->
<!--      <view class="partner-card" v-for="(partner, index) in partners" :key="index">-->
<!--        <image class="partner-logo" :src="partner.logo" mode="aspectFit"/>-->
<!--        <text class="partner-desc">{{ partner.desc }}</text>-->
<!--      </view>-->
<!--    </view>-->
  </view>
</template>

<script>
export default {
  data() {
    return {
      currencyList: [

      ],
    }
  },
  onShow() {
    if(uni.getStorageSync('token')) {
      this.getRechargeList();
   } else {
     uni.navigateTo({
       url: '/pages/login/login'
     });
   }
 },
  methods: {
   getRechargeList() {
     this.$service("/api/financial/RechargeList", "post")
       .then((res) => {
          res = res.data;
         if (res.code === 0) {
           this.currencyList = res.data || [];
         } else if (res.code == 1) {
           uni.showToast({
             title: res.message,
             icon: 'none'
           });
         }
       }).catch((err) => {
         console.error('请求失败:', err);
         uni.showToast({
           title: '请求失败，请稍后再试',
           icon: 'none'
         });
       });
   },
    getCurrencyIcon(currency) {
      // 根据币种返回对应的图标路径
      // const icons = {
      //   'USDT-ERC20': '/static/images/currencies/usdt.png',
      //   'USDT-TRC20': '/static/images/currencies/usdt.png',
      //   'BTC-Bitcoin': '/static/images/currencies/btc.png',
      //   'ETH-ERC20': '/static/images/currencies/eth.png',
      //   'USDC-ERC20': '/static/images/currencies/usdc.png',
      //   'USDC-TRC20': '/static/images/currencies/usdc.png'
      // }
      // return icons[currency] || '/static/images/currencies/default.png'
    },
    goToDepositDetail(currency) {
      uni.navigateTo({
        url: `/pages/deposit/deposit-detail?currency=${currency}`
      })
    },
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.header-left {
  padding: 20rpx;

  .back-icon {
    font-size: 36rpx;
    color: #ffffff;
  }
}

.page-container {
  min-height: 100vh;
  background-color: #1c1c1c;
  padding: 0 30rpx 30rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.currency-list {
  background: #2a2a2a;
  border-radius: 16rpx;
  overflow: hidden;
  margin-top: 24rpx;
  margin-bottom: 24rpx;
}

.currency-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 24rpx;

  &:not(:last-child) {
    border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
  }

  &:active {
    background: rgba(255, 255, 255, 0.05);
  }
}

.currency-left {
  display: flex;
  align-items: center;
  gap: 16rpx;

  .currency-icon {
    width: 48rpx;
    height: 48rpx;
    border-radius: 24rpx;
  }

  .currency-name {
    font-size: 28rpx;
    color: #ffffff;
  }
}

.icon-right {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.3);
}

.partner-section {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.partner-card {
  background: #2a2a2a;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;

  .partner-logo {
    height: 48rpx;
    width: 200rpx;
  }

  .partner-desc {
    font-size: 24rpx;
    color: #00c087;
  }
}

// 适配 iPhone X 及以上机型
@supports (padding-bottom: constant(safe-area-inset-bottom)) or (padding-bottom: env(safe-area-inset-bottom)) {
  .page-container {
    min-height: calc(100vh - constant(safe-area-inset-bottom));
    min-height: calc(100vh - env(safe-area-inset-bottom));
  }
}
</style>
