<template>
	<view class="market-list">
		<!-- 表头 -->
		<view class="header">
			<text class="col trading-pair">交易对</text>
			<text class="col price">最新价格</text>
			<text class="col change">24h涨跌幅</text>
		</view>

		<!-- 交易对列表 -->
		<view class="list">
			<view class="list-item" v-for="(price, symbol) in prices" :key="symbol" @tap="handleItemClick(symbol)">
				<view class="col trading-pair">
					<image :src="getIconUrl(symbol)" class="coin-icon" mode="aspectFit"></image>
					<text class="pair-name">{{symbol}}</text>
				</view>
				<view class="col price">
					<text>{{price}}</text>
				</view>
				<view class="col change">
					<text :class="['change-text', priceChanges[symbol]  >= 0 ? 'positive' : 'negative']">
						{{priceChanges[symbol] >= 0 ? '+' : ''}}{{priceChanges[symbol]}}%
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		store
	} from '@/store/websocket/store.js'
	import huobiWebsocketManager from '@/untils/websocket/websocketManager.js'
	export default {
		name: 'MarketList',

		data() {
			return {
				symbols: ['btcusdt', 'suiusdt','bchusdt','bsvusdt', 'dogeusdt', 'linkusdt', 'eosusdt', 'adausdt', 'trxusdt'] // 添加您想要追踪的交易对
			}
		},
		computed: {
			prices() {
				return store.prices
			},
			priceChanges() {
				return store.priceChanges
			},
			isConnected() {
				return store.isConnected
			}
		},
		mounted() {
			this.subscribeToSymbols()
			if (!this.isConnected) {
				huobiWebsocketManager.connect()
			}

		},
		methods: {
			getIconUrl(symbol){
				const sym = (symbol.replace("/USDT","")).toLowerCase()
				return `https://huobicfg.s3.amazonaws.com/currency_icon/${sym}.png`
			},
			subscribeToSymbols() {
				this.symbols.forEach(symbol => {
					huobiWebsocketManager.subscribe(symbol);
				});
			},
			handleItemClick(item) {
				this.$emit('item-click', item)
			},
			handlePriceUpdate(data) {
				console.log(data)
				const symbol = data.ch.split('.')[1];
				const newPrice = data.tick.close;
				const oldPrice = data.tick.open;
				this.$set(this.prices, symbol.toUpperCase(), newPrice.toFixed(2));
				const priceChange = ((newPrice - oldPrice) / oldPrice) * 100;
				this.$set(this.priceChanges, symbol.toUpperCase(), priceChange.toFixed(2));
			}
		},
		beforeDestroy() {
			// this.symbols.forEach(symbol => {
			// 	huobiWebsocketManager.unsubscribe(symbol);
			// });
			// huobiWebsocketManager.close();
		}
	}
</script>

<style lang="scss" scoped>
	.market-list {
		background-color: #1C1C1E;
		padding: 0 30rpx;
		width: 98%;
		margin-left: 1%;
		margin-right: 1%;

		.header {
			display: flex;
			height: 80rpx;
			align-items: center;
			font-size: 24rpx;
			color: #8F8F8F;
		}

		.list-item {
			display: flex;
			height: 120rpx;
			align-items: center;
			border-top: 2rpx solid #2C2C2E;
		}

		.col {
			padding: 10px;
			flex: 1;

			&.trading-pair {
				flex: 1.5;
				display: flex;
				align-items: center;
			}

			&.price {
				text-align: left;
				padding-right: 40rpx;
			}

			&.change {
				text-align: right;
			}
		}

		.coin-icon {
			width: 50rpx;
			height: 50rpx;
			margin-right: 20rpx;
		}

		.pair-name {
			color: #FFFFFF;
			font-size: 28rpx;
		}

		.price {
			color: #FFFFFF;
			font-size: 28rpx;
		}

		.change-text {
			padding: 8rpx 20rpx;
			border-radius: 8rpx;
			font-size: 24rpx;

			&.positive {
				background-color: rgba(76, 175, 80, 0.1);
				color: #4CAF50;
			}

			&.negative {
				background-color: rgba(244, 67, 54, 0.1);
				color: #F44336;
			}
		}
	}
</style>