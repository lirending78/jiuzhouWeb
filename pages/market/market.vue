<template>
	<view class="content">
		<market-list @item-click="onMarketSelect" />
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

			}
		},
		methods: {
			onMarketSelect(market) {
				console.log('Selected market:', market)
				// 处理市场选择
			}

		}
	}
</script>

<style>

</style>