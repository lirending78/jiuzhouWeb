<template>
  <view class="contract">
    <!-- 交易对头部 -->
    <view class="pair-header">
      <view class="pair-info">
        <view class="pair-selector" @click="showPairSelector">
          <text class="pair-name">{{ currentPair }}</text>
          <text class="selector-arrow">▼</text>
          <!-- 币种选择下拉框 -->
          <view class="pair-dropdown" v-if="showSelector">
            <scroll-view scroll-y class="dropdown-scroll">
              <view 
                v-for="pair in tradingPairs" 
                :key="pair.symbol"
                class="pair-option"
                :class="{ active: currentPair === pair.symbol }"
                @click.stop="selectPair(pair)"
              >
                {{ pair.symbol }}
              </view>
            </scroll-view>
          </view>
        </view>
        <text class="price-change" :class="priceChangeClass">{{ priceChangeText }}</text>
      </view>
      <view class="pair-actions">
        <text class="action-icon">📈</text>
        <text class="action-icon">⚙️</text>
        <text class="action-icon">⋮</text>
      </view>
    </view>

    <!-- 交易信息 -->
    <view class="trading-info">
      <view class="info-row">
        <text class="label">{{ $t('fundingRate') }}</text>
        <text class="value">{{ currentPairInfo.fundingRate || '0.0000%' }}/{{ currentPairInfo.settlementTime || '--:--:--' }}</text>
      </view>
      <view class="info-row">
        <text class="label">{{ $t('positionAmount') }}</text>
        <text class="value">{{ formatAmount(currentPairInfo.positionAmount) }}</text>
      </view>
      <view class="leverage">
        <text>{{ currentPairInfo.marginType || $t('crossMargin') }}</text>
        <text>{{ currentPairInfo.leverage || '125' }}x</text>
        <text class="arrow">▼</text>
      </view>
    </view>

    <view class="main-content">
      <!-- 订单簿 -->
      <view class="order-book">
        <view class="book-header">
          <text>{{ $t('price') }}({{ quoteAsset }})</text>
          <text>{{ $t('amount') }}</text>
        </view>

        <!-- 卖单 -->
        <scroll-view 
          class="sell-orders" 
          scroll-y
          :scroll-top="sellOrdersScrollTop"
          :style="{ height: orderBookHeight + 'rpx' }"
          @scrolltolower="onScrollToLower"
          id="sellOrdersScroll"
        >
          <view class="sell-orders-content">
            <view 
              v-for="(order, index) in sellOrders" 
              :key="'sell' + index" 
              class="order-row"
            >
              <text class="price red">{{ parseFloat(order.unit_price).toFixed(4) }}</text>
              <text class="amount">{{ parseFloat(order.remaining_amount).toFixed(4) }}</text>
            </view>
          </view>
        </scroll-view>

        <!-- 当前价格 -->
        <view class="current-price">
          <text>{{ currentPrice }}</text>
          <text class="arrow">▼</text>
        </view>

        <!-- 买单 -->
        <scroll-view 
          class="buy-orders"
          scroll-y
          :style="{ height: orderBookHeight + 'rpx' }"
        >
          <view 
            v-for="(order, index) in buyOrders" 
            :key="'buy' + index" 
            class="order-row"
          >
            <text class="price green">{{ parseFloat(order.unit_price).toFixed(4) }}</text>
            <text class="amount">{{ parseFloat(order.remaining_amount).toFixed(4) }}</text>
          </view>
        </scroll-view>
      </view>

      <!-- 交易表单 -->
      <view class="trading-form">
        <view class="form-tabs">
          <view 
            :class="['tab', { active: orderType === 'buy' }]" 
            @click="setOrderType('buy')"
          >
            {{ $t('buy') }}
          </view>
          <view 
            :class="['tab', { active: orderType === 'sell' }]" 
            @click="setOrderType('sell')"
          >
            {{ $t('sell') }}
          </view>
        </view>

        <view class="input-group">
          <text class="label">{{ $t('limitOrder') }}</text>
          <view class="input-wrapper">
            <input 
              type="number" 
              v-model="orderPrice" 
              class="price-input" 
              :placeholder="$t('enterPrice')" 
            />
            <text class="unit">{{ quoteAsset }}</text>
          </view>
        </view>

        <view class="input-group">
          <text class="label">{{ $t('amount') }}</text>
          <view class="input-wrapper">
            <input 
              type="number" 
              v-model="orderAmount" 
              class="amount-input" 
              :placeholder="$t('enterAmount')" 
            />
            <!-- <text class="unit">{{ baseAsset }}</text> -->
          </view>
        </view>

        <view class="trading-actions">
          <text class="available">{{ availableText }}</text>
          <text class="margin">{{ marginText }}</text>
        </view>

        <button 
          class="confirm-btn" 
          :class="{ disabled: !isFormValid }"
          :disabled="!isFormValid"
          @click="placeOrder"
        >
          {{ $t('confirm') }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentPair: '',
      currentPairInfo: {}, // 当前交易对详细信息
      showSelector: false,
      tradingPairs: [],
      sellOrders: [],
      buyOrders: [],
      orderType: 'buy',
      orderPrice: '',
      orderAmount: '',
      orderBookHeight: 300,
      pagesize: 6,
      currentPrice: '0.00', // 当前价格
      availableBalance: '0.00', // 可用余额
      marginAmount: '0.00', // 保证金金额
      baseAsset: '',  // 基础资产（如 BTC）
      quoteAsset: '', // 计价资产（如 USDT）
      sellOrdersScrollTop: 0,
    }
  },

  computed: {
    // 计算表单是否有效
    isFormValid() {
      return this.orderPrice && this.orderAmount && 
             !isNaN(this.orderPrice) && !isNaN(this.orderAmount) &&
             parseFloat(this.orderPrice) > 0 && parseFloat(this.orderAmount) > 0
    },

    // 价格变化样式
    priceChangeClass() {
      const change = parseFloat(this.currentPairInfo.priceChange)
      return {
        'negative': change < 0,
        'positive': change > 0
      }
    },

    // 价格变化文本
    priceChangeText() {
      const change = this.currentPairInfo.priceChange || 0
      return `${change >= 0 ? '+' : ''}${change}%`
    },

    // 可用余额显示
    availableText() {
      return `${this.$t('available')} ${this.orderType === 'buy' ? this.$t('long') : this.$t('short')} 0 ${this.baseAsset}`
    },

    // 保证金显示
    marginText() {
      return `${this.$t('margin')} 0.00 ${this.baseAsset}`
    },
  },

  mounted() {
    this.getTradingPairs()
    this.startPolling()
  },

  beforeDestroy() {
    this.stopPolling()
  },

  methods: {
    // 设置订单类型
    setOrderType(type) {
      this.orderType = type
    },

    // 显示交易对选择器
    showPairSelector() {
      this.showSelector = !this.showSelector
    },

    // 选择交易对
    async selectPair(pair) {
      this.currentPair = pair.symbol
      this.currentPairInfo = pair
      this.parseTradingPair(pair.symbol)  // 解析交易对
      this.showSelector = false
      
      // 更新所有相关数据
      await Promise.all([
        this.getlist(), // 获取订单簿数据
        this.getCurrentPrice(), // 获取当前价格
        this.getAccountBalance(), // 获取账户余额
        this.calculateMargin() // 计算保证金
      ])
    },

    // 获取交易对列表
    getTradingPairs() {
      let data = {
        page: 1,
        page_size: 10
      }
      
      this.$service("/api/common/get-trading-pairs", "post", data)
        .then((res) => {
          if(res.data && res.data.data) {
            this.tradingPairs = res.data.data
            if(this.tradingPairs.length > 0) {
              // 选择第一个交易对作为默认值
              this.selectPair(this.tradingPairs[0])
            }
          }
        })
        .catch((err) => {
          console.error('获取交易对失败:', err)
          uni.showToast({
            title: this.$t('getTradingPairsFailed'),
            icon: 'none'
          })
        })
    },

    // 启动轮询
    startPolling() {
      this.pollInterval = setInterval(() => {
        if (this.currentPair) {
          Promise.all([
            this.getlist(),
            // this.getCurrentPrice()
          ])
        }
      }, 5000)
    },

    // 停止轮询
    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval)
      }
    },
    
    // 获取订单列表
    getlist() {
      let data = {
        page_size: this.pagesize,
        currency: this.currentPair,
      }
      
      this.$service("/api/orders/get-trad-buy", "post", data)
        .then((res) => {
          if(res.data && res.data.data) {
            // 卖单数据需要按价格降序排序
            this.sellOrders = Object.values(res.data.data.sell).sort((a, b) => 
              parseFloat(b.unit_price) - parseFloat(a.unit_price)
            )
            // 买单数据需要按价格降序排序
            this.buyOrders = Object.values(res.data.data.buy).sort((a, b) => 
              parseFloat(b.unit_price) - parseFloat(a.unit_price)
            )
            
            // 数据更新后，自动滚动到底部
            this.$nextTick(() => {
              this.scrollToBottom()
            })
          }
        })
        .catch((err) => {
          console.error('请求失败:', err)
          uni.showToast({
            title: this.$t('requestFailed'),
            icon: 'none'
          })
        })
    },

    // 下单
    placeOrder() {
      if (!this.isFormValid) {
        uni.showToast({
          title: this.$t('pleaseEnterPriceAndAmount'),
          icon: 'none'
        })
        return
      }

      const orderData = {
        currency: this.currentPair,
        amount: this.orderAmount,
        unit_price: this.orderPrice
      }
      const endpoint = this.orderType === 'buy' 
        ? '/api/orders/send-buy-order' 
        : '/api/orders/send-sell-order'

      this.$service(endpoint, "post", orderData)
        .then((res) => {
          uni.showToast({
            title: this.$t('orderSuccess'),
            icon: 'success'
          })
          this.orderPrice = ''
          this.orderAmount = ''
          this.getlist()
        })
        .catch((err) => {
          console.error('下单失败:', err)
          uni.showToast({
            title: this.$t('orderFailed'),
            icon: 'none'
          })
        })
    },

    // 格式化金额显示
    formatAmount(amount) {
      if (!amount) return '0.00'
      const num = parseFloat(amount)
      if (num >= 1e8) {
        return (num / 1e8).toFixed(2) + this.$t('billion')
      }
      return num.toFixed(2)
    },

    // 获取当前价格
    async getCurrentPrice() {
      try {
        const res = await this.$service('/api/market/get-current-price', 'post', {
          symbol: this.currentPair
        })
        if (res.data && res.data.price) {
          this.currentPrice = res.data.price
        }
      } catch (error) {
        console.error('获取当前价格失败:', error)
      }
    },

    // 获取账户余额
    async getAccountBalance() {
      try {
        const res = await this.$service('/api/account/get-balance', 'post', {
          symbol: this.currentPair,
          type: this.orderType
        })
        if (res.data && res.data.available) {
          this.availableBalance = res.data.available
        }
      } catch (error) {
        console.error('获取账户余额失败:', error)
      }
    },

    // 计算保证金
    calculateMargin() {
      if (this.orderPrice && this.orderAmount) {
        const leverage = parseFloat(this.currentPairInfo.leverage) || 125
        const total = parseFloat(this.orderPrice) * parseFloat(this.orderAmount)
        this.marginAmount = (total / leverage).toFixed(4)
      } else {
        this.marginAmount = '0.00'
      }
    },

    // 监听输入变化
    handleInputChange() {
      this.calculateMargin()
    },

    // 解析交易对
    parseTradingPair(symbol) {
      const [quote, base] = symbol.split('/')
      this.baseAsset = base
      this.quoteAsset = quote
    },

    // 滚动到底部
    scrollToBottom() {
      const query = uni.createSelectorQuery()
      query.select('#sellOrdersScroll').boundingClientRect(data => {
        if (data) {
          // 设置一个较大的值确保滚动到底部
          this.sellOrdersScrollTop = 10000
        }
      }).exec()
    },

    // 处理滚动到底部事件
    onScrollToLower() {
      // 如果需要加载更多数据，可以在这里处理
      console.log('滚动到底部')
    },

    // 移除不需要的方法
    handleScroll() {},
    handleResize() {}
  },

  watch: {
    // 监听订单类型变化
    orderType() {
      this.getAccountBalance()
    },

    // 监听输入变化
    orderPrice() {
      this.handleInputChange()
    },
    orderAmount() {
      this.handleInputChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.contract {
  min-height: 100vh;
  background-color: $bg-primary;
  color: $text-primary;
  padding: 30rpx;

  .pair-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30rpx;
    border-bottom: 2rpx solid $border-color;

    .pair-info {
      display: flex;
      align-items: center;
      gap: 20rpx;
    }

    .pair-name {
      font-size: 40rpx;
      font-weight: bold;
    }

    .price-change {
      font-size: 28rpx;
      &.negative { color: $chart-negative; }
      &.positive { color: $chart-positive; }
    }

    .pair-actions {
      display: flex;
      gap: 20rpx;
      .action-icon {
        font-size: 32rpx;
        padding: 10rpx;
      }
    }

    .pair-selector {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 12rpx 24rpx;
      background-color: rgba($color: #fff, $alpha: 0.05);
      border-radius: 8rpx;
      cursor: pointer;

      .pair-name {
        font-size: 32rpx;
        font-weight: 500;
      }

      .selector-arrow {
        font-size: 24rpx;
        color: $text-secondary;
        transition: transform 0.3s;
      }

      &:active {
        background-color: rgba($color: #fff, $alpha: 0.08);
      }

      .pair-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        width: 240rpx;
        max-height: 400rpx;
        background-color: $bg-secondary;
        border-radius: 8rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
        z-index: 100;
        margin-top: 8rpx;

        .dropdown-scroll {
          max-height: 400rpx;
        }

        .pair-option {
          padding: 20rpx 24rpx;
          font-size: 28rpx;
          color: $text-primary;
          transition: background-color 0.3s;

          &:active {
            background-color: rgba($color: #fff, $alpha: 0.05);
          }

          &.active {
            color: $accent-primary;
            background-color: rgba($accent-primary, 0.1);
          }
        }
      }
    }
  }

  .trading-info {
    padding: 30rpx 0;
    border-bottom: 2rpx solid $border-color;

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      font-size: 28rpx;

      .label { color: $text-secondary; }
      .value { color: $text-primary; }
    }

    .leverage {
      display: flex;
      gap: 20rpx;
      align-items: center;
      font-size: 28rpx;
    }
  }

  .main-content {
    display: flex;
    margin-top: 30rpx;
    gap: 30rpx;

    .order-book {
      flex: 1;
      background-color: $bg-secondary;
      border-radius: 20rpx;
      padding: 20rpx;

      .book-header {
        display: flex;
        justify-content: space-between;
        padding-bottom: 20rpx;
        font-size: 24rpx;
        color: $text-secondary;
      }

      .sell-orders {
        position: relative;
        
        .sell-orders-content {
          position: relative;
          width: 100%;
        }

        .order-row {
          display: flex;
          justify-content: space-between;
          padding: 10rpx 0;
          font-size: 26rpx;
        }
      }

      .buy-orders {
        .order-row {
          display: flex;
          justify-content: space-between;
          padding: 10rpx 0;
          font-size: 26rpx;
        }
      }

      .price {
        &.green { color: $chart-positive; }
        &.red { color: $chart-negative; }
      }

      .current-price {
        text-align: center;
        padding: 20rpx;
        background-color: rgba($color: #fff, $alpha: 0.05);
        margin: 20rpx 0;
        font-size: 28rpx;
      }
    }

    .trading-form {
      flex: 1;
      background-color: $bg-secondary;
      border-radius: 20rpx;
      padding: 20rpx;

      .form-tabs {
        display: flex;
        margin-bottom: 30rpx;
        border-radius: 10rpx;
        overflow: hidden;

        .tab {
          flex: 1;
          text-align: center;
          padding: 20rpx;
          font-size: 28rpx;
          background-color: rgba($color: #fff, $alpha: 0.05);
          
          &.active {
            background-color: $accent-primary;
            color: #fff;
          }
        }
      }

      .input-group {
        margin-bottom: 24rpx;

        .label {
          display: block;
          font-size: 26rpx;
          color: $text-secondary;
          margin-bottom: 12rpx;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background-color: $input-bg;
          border: 2rpx solid $input-border;
          border-radius: 8rpx;
          padding: 0 100rpx 0 20rpx;
          height: 80rpx;

          input {
            flex: 1;
            height: 100%;
            background: transparent;
            border: none;
            color: $text-primary;
            font-size: 28rpx;
            min-width: 0; // 防止input撑开容器
          }

          .unit {
            position: absolute;
            right: 20rpx;
            color: $text-secondary;
            font-size: 24rpx;
          }
        }
      }

      .trading-actions {
        margin-top: 30rpx;
        font-size: 24rpx;
        color: $text-secondary;

        .available {
          margin-bottom: 10rpx;
        }
      }

      .confirm-btn {
        width: 100%;
        height: 88rpx;
        background-color: $accent-primary;
        border: none;
        border-radius: 10rpx;
        color: #fff;
        font-size: 32rpx;
        margin-top: 30rpx;

        &.disabled {
          opacity: 0.5;
        }
      }
    }
  }
}

// 响应式适配
@media screen and (max-width: 375px) {
  .contract {
    padding: 20rpx;
    
    .pair-header {
      .pair-name {
        font-size: 32rpx;
      }
    }
    
    .main-content {
      flex-direction: column;
      
      .order-book,
      .trading-form {
        width: 100%;
      }
    }
  }
}
</style>