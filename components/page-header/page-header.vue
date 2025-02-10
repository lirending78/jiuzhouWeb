<template>
  <view class="page-header">
    <view class="header-content">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">&lt;</text>
      </view>
      <text class="title">{{ title }}</text>
      <view class="right-area">
        <slot name="right"></slot>
      </view>
    </view>
    <view class="header-placeholder"></view>
  </view>
</template>

<script>
export default {
  name: 'page-header',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  .header-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 32rpx;
    background: #1c1c1c;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    z-index: 100;
    
    .back-btn {
      position: absolute;
      left: 32rpx;
      height: 88rpx;
      display: flex;
      align-items: center;
      z-index: 1;
      
      .back-icon {
        font-size: 56rpx;
        color: #fff;
        transform: scaleX(0.8);
        height: auto;
        line-height: 1;
      }
    }
    
    .title {
      flex: 1;
      text-align: center;
      font-size: 34rpx;
      font-weight: 500;
      color: #fff;
    }
    
    .right-area {
      position: absolute;
      right: 32rpx;
      height: 88rpx;
      display: flex;
      align-items: center;
    }
  }

  .header-placeholder {
    height: calc(88rpx + constant(safe-area-inset-top));
    height: calc(88rpx + env(safe-area-inset-top));
  }
}
</style> 