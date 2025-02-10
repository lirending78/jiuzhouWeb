<template>
	<view class="content">
		<!-- 头部轮播图 -->
		<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<image :src="item.image" mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<!-- 导航快捷键 -->
		<view class="nav-shortcuts">
			<view class="nav-item" v-for="(item, index) in navList" :key="index" @tap="navTo(item.url)">
				<image :src="item.icon" mode="aspectFit"></image>
				<text class="text-primary">{{item.name}}</text>
			</view>
		</view>

		<market-list  @item-click="onMarketSelect" />
	</view>
</template>

<script>
	import MarketList from '@/components/marketList/marketList.vue'
	export default {
		components: {
			MarketList
		},
		data() {
			return {
				markets: '', // 您的市场数据
				title: 'Hello',
				swiperList: [{
						image: '/static/b1.png'
					},
					{
						image: '/static/b2.jpg'
					},
					{
						image: '/static/b3.jpg'
					}
				],
				navList: [{
						name: '首页',
						icon: '/static/nav1.png',
						url: '/pages/index/index'
					},
					{
						name: '分类',
						icon: '/static/nav2.png',
						url: '/pages/category/category'
					},
					{
						name: '购物车',
						icon: '/static/nav3.png',
						url: '/pages/cart/cart'
					},
					{
						name: '我的',
						icon: '/static/nav4.png',
						url: '/pages/my/my'
					}
				]
			}
		},
		onLoad() {

		},
		methods: {
			navTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			onMarketSelect(market) {
				console.log('Selected market:', market)
				// 处理市场选择
			}
		}
	}
</script>

<style>
	

	.swiper {
		width: 100%;
		height: 300rpx;
	}

	.swiper image {
		width: 100%;
		height: 100%;
	}

	.nav-shortcuts {
		display: flex;
		justify-content: space-around;
		width: 100%;
		padding: 20rpx 0;
		/* background-color: #fff; */
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.nav-item image {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
	}

	.nav-item text {
		font-size: 24rpx;
		/* color: #333; */
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 50rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>