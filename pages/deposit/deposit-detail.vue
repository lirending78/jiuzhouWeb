<template>
  <view class="page-container">
    <!-- 自定义导航栏 -->
    <page-header :title="currency + '充值'">
      <template #left>
        <view class="header-left" @click="goBack">
          <text class="iconfont back-icon">&#xe679;</text>
        </view>
      </template>
    </page-header>

    <view class="form-container">
      <!-- 充值金额 -->
      <view class="form-item">
        <text class="label">充值金额</text>
        <view class="input-container">
          <input
            type="number"
            v-model="amount"
            class="input"
            placeholder="请输入充值金额"
            placeholder-style="color: #666666;"
            maxlength="20"
          />
        </view>
      </view>

      <!-- 充值地址 -->
      <view class="form-item">
        <text class="label">充值地址</text>
        <view class="address-container">
          <text class="address">{{rechargeAddress}}</text>
          <button class="copy-btn" @click="copyAddress">复制</button>
        </view>
      </view>

      <!-- 充值凭证 -->
      <view class="form-item">
        <text class="label">充值凭证</text>
        <view class="upload-container">
          <view v-if="voucher" class="image-wrapper">
            <image
              :src="voucher"
              mode="aspectFit"
              class="preview-image"
              @click="previewImage"
            />
            <view class="delete-btn" @click.stop="deleteVoucher">
              <view class="delete-icon"></view>
            </view>
          </view>
          <view v-else class="upload-btn" @click="chooseImage">
            <text class="iconfont">&#xe6dd;</text>
            <text>上传凭证</text>
          </view>
        </view>
      </view>

      <!-- 备注 -->
      <view class="form-item">
        <text class="label">备注</text>
        <textarea
          v-model="remark"
          class="textarea"
          placeholder="请输入备注信息（选填）"
          placeholder-style="color: #666666;"
        />
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" @click="submitDeposit">提交充值申请</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currency: '',
      amount: '',
      rechargeAddress: '加载中...',  // 这里填写实际的充值地址
      voucher: '',
      remark: '',
      api_voucher: '',
    }
  },

  onLoad(options) {
    if (options.currency) {
      this.currency = options.currency;
      this.getRechargeAddress();
    }
  },

  methods: {
   async getRechargeAddress() {
      // 获取充值地址的API调用
        const data = {
          currency: this.currency
        };
        this.$service("/api/financial/GetRechargeAddress", "post", data).then(res => {
          if (res.data.code === 0) {
            this.rechargeAddress = res.data.data.address;
          }
        });

    },

    copyAddress() {
      uni.setClipboardData({
        data: this.rechargeAddress,
        success: () => {
          uni.showToast({
            title: '地址已复制',
            icon: 'none'
          });
        }
      });
    },

    chooseImage() {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          const filePath = res.tempFilePaths[0]

          uni.showLoading({
            title: '上传中'
          })
          try {
            const uploadRes = await this.$uploadFile(filePath, 'other')
            //对象转成数组
            const img_url = uploadRes.img_url
            const api_url = uploadRes.api_url
            if (img_url && api_url) {
              this.voucher = img_url
              this.api_voucher = api_url
              uni.showToast({
                title: '上传成功',
                icon: 'success'
              })
            } else {
              throw new Error('上传失败')
            }
          } catch (error) {
            uni.showToast({
              title: error.message || '上传失败',
              icon: 'none'
            })
          } finally {
            uni.hideLoading()
          }
        }
      });
    },

    deleteVoucher() {
      this.voucher = '';
      this.api_voucher = '';
      uni.showToast({
        title: '已删除',
        icon: 'none'
      });
    },

    submitDeposit() {
      if (!this.amount) {
        uni.showToast({
          title: '请输入充值金额',
          icon: 'none'
        });
        return;
      }
      if (!this.voucher) {
        uni.showToast({
          title: '请上传充值凭证',
          icon: 'none'
        });
        return;
      }

      this.$service("/api/financial/Recharge", "post", {
        currency: this.currency,
        amount: this.amount,
        recharge_credentials: this.api_voucher,
        remark: this.remark
      }).then(res => {
        if (res.data.code === 0) {
          uni.showToast({
            title: '充值申请已提交',
            icon: 'success'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      });
    },

    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #1c1c1c;
  padding: 0 30rpx 30rpx;
}

.form-container {
  margin-top: 24rpx;
}

.form-item {
  background: #2a2a2a;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;

  .label {
    font-size: 28rpx;
    color: #ffffff;
    margin-bottom: 16rpx;
    display: block;
  }

  .input-container {
    width: 100%;
    background: #363636;
    border-radius: 8rpx;
    overflow: hidden;
  }

  .input {
    width: 100%;
    min-height: 80rpx;
    padding: 0 20rpx;
    color: #ffffff;
    font-size: 28rpx;
    background: transparent;
  }

  .textarea {
    width: 100%;
    height: 160rpx;
    background: #363636;
    border-radius: 8rpx;
    padding: 20rpx;
    color: #ffffff;
    font-size: 28rpx;
  }
}

.address-container {
  display: flex;
  align-items: center;
  background: #363636;
  border-radius: 8rpx;
  padding: 20rpx;

  .address {
    flex: 1;
    color: #ffffff;
    font-size: 28rpx;
  }

  .copy-btn {
    margin-left: 20rpx;
    background: #00c087;
    color: #ffffff;
    font-size: 24rpx;
    padding: 10rpx 30rpx;
    border-radius: 8rpx;
  }
}

.upload-container {
  .image-wrapper {
    position: relative;
    display: inline-block;
  }

  .preview-image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 8rpx;
  }

  .delete-btn {
    position: absolute;
    top: -20rpx;
    right: -20rpx;
    width: 40rpx;
    height: 40rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .delete-icon {
      width: 20rpx;
      height: 20rpx;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E") no-repeat center;
      background-size: contain;
    }
  }

  .upload-btn {
    width: 200rpx;
    height: 200rpx;
    background: #363636;
    border-radius: 8rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #666666;
    font-size: 24rpx;

    .iconfont {
      font-size: 48rpx;
      margin-bottom: 8rpx;
    }
  }
}

.submit-btn {
  background: #00c087;
  color: #ffffff;
  font-size: 32rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  margin-top: 48rpx;
}
</style>
