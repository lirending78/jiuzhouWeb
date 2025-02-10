<template>
  <view class="container">
    <view class="chart-container">
      <klineChart :symbol="symbol" :interval="interval" ></klineChart> 
    </view>
    <view class="controls">
      <picker @change="onSymbolChange" :value="symbolIndex" :range="symbols">
        <view class="picker">
          当前交易对: {{ symbols[symbolIndex] }}
        </view>
      </picker>
      <picker @change="onIntervalChange" :value="intervalIndex" :range="intervals">
        <view class="picker">
          当前时间间隔: {{ intervals[intervalIndex] }}
        </view>
      </picker>
    </view>
  </view>
</template>

<script>
import KlineChart from '@/components/klineChart/klineChart.vue'
export default {
  components: {
    KlineChart
  },
  data() {
    return {
      symbol: 'btcusdt',
      interval: '1day',
      symbols: ['btcusdt', 'ethusdt', 'dogeusdt'],
      intervals: ['1min', '5min', '15min', '30min', '60min', '4hour', '1day', '1week', '1mon'],
      symbolIndex: 0,
      intervalIndex: 0
    }
  },
  methods: {
    onSymbolChange(e) {
      this.symbolIndex = e.detail.value
      this.symbol = this.symbols[this.symbolIndex]
    },
    onIntervalChange(e) {
      this.intervalIndex = e.detail.value
      this.interval = this.intervals[this.intervalIndex]
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
  background-color: #1f2329;
}
.chart-container {
  width: 100%;
  height: 400px;
}
.controls {
  margin-top: 20px;
}
.picker {
  background-color: #2c3e50;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  color: #e1e1e1;
}
</style>