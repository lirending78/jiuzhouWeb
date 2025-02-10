<template>
	<view class="">
		<web-view ref="webview" src="/hybrid/html/local.html"></web-view>
	</view>
</template>

<script>
	import pako from 'pako';
	export default {
		data() {
			return {
				symbol: 'btcusdt',
				interval: '1min',
				klineData: [],
				_from: 0,
				_to: 0

			}
		},
		onLoad() {
			window.addEventListener('message', function(event) {
				console.log('接收到的消息:', event.data);
			});
			this.initWebSocket()

			this.getTimestampWithOffset("minute",100)
		},
		watch: {
			klineData(newVal, oldVal) {
				// 当 klineData 变化时执行此方法
				console.log('klineData changed:', newVal);
				// this.updateChart(newVal)
				this.sendMessage()


				// 在这里可以执行任何与 klineData 变化相关的操作
			}
		},
		methods: {
			getTimestampWithOffset(unit, offset) {
				const now = Date.now(); // 当前时间戳，单位为毫秒

				// 将单位转换为毫秒
				let offsetInMilliseconds;
				switch (unit) {
					case 'minute':
					case 'minutes':
						offsetInMilliseconds = offset * 60 * 1000; // 1 分钟 = 60,000 毫秒
						break;
					case 'hour':
					case 'hours':
						offsetInMilliseconds = offset * 60 * 60 * 1000; // 1 小时 = 3,600,000 毫秒
						break;
					case 'second':
					case 'seconds':
						offsetInMilliseconds = offset * 1000; // 1 秒 = 1,000 毫秒
						break;
					case 'day':
					case 'days':
						offsetInMilliseconds = offset * 1000; // 1 秒 = 1,000 毫秒
						break;
					default:
						throw new Error('Unsupported unit. Use "seconds", "minutes", or "hours".');
				}
				const newTimestamp = now - offsetInMilliseconds;
				this._to = now / 1000
				this._from = newTimestamp / 1000
				// return 
			},
			initWebSocket() {
				let that = this
				this.ws = uni.connectSocket({
					url: 'wss://api.huobi.pro/ws',
					complete: () => {}
				});

				this.ws.onOpen(() => {
					console.log('WebSocket connected');
					this.ws.send({
						data: JSON.stringify({
							req: `market.${this.symbol}.kline.${this.interval}`,
							id: this.symbol,
							from: this._from,
							to: this._to
						})
					});
					this.ws.send({
						data: JSON.stringify({
							sub: `market.${this.symbol}.kline.${this.interval}`,
							id: this.symbol
						})
					});
				});

				this.ws.onMessage((res) => {
					if (res.data instanceof ArrayBuffer) {
						const data1 = pako.inflate(new Uint8Array(res.data), {
							to: 'string'
						})
						const data = JSON.parse(data1)
						console.log(data)
						if(data.ping){
							this.ws.send({
								data: JSON.stringify({
									pong:Date.now()
								})
							});
						}
						
						if(data.rep){
							data.data.map(function(i){
								const tt = that.getTime(i.id * 1000)
								const newKline = [tt, i.open, i.high, i.low,
									i.close, i.vol
								]
								
								const existingIndex = that.klineData.findIndex(item => item[0] === tt);
								
								if (existingIndex !== -1) {
									// 如果找到相同时间戳的数据，更新对应项
									that.klineData[existingIndex] = newKline;
								} else {
									// 如果没有找到相同时间戳的数据，添加新数据
									that.klineData.push(newKline);
								}
								
								if (that.klineData.length > 900) {
									that.klineData.shift();
								}
							})
						}
						if (data.tick) {
							// const newKline = {
							// 	time: data.tick.id * 1000,
							// 	open: data.tick.open,
							// 	high: data.tick.high,
							// 	low: data.tick.low,
							// 	close: data.tick.close,
							// 	volume: data.tick.vol
							// };
							const tt = that.getTime(data.tick.id * 1000)
							const newKline = [tt, data.tick.open, data.tick.high, data.tick.low,
								data.tick.close, data.tick.vol
							]
							// 查找是否已有相同时间戳的数据
							const existingIndex = this.klineData.findIndex(item => item[0] === tt);

							if (existingIndex !== -1) {
								// 如果找到相同时间戳的数据，更新对应项
								this.klineData[existingIndex] = newKline;
							} else {
								// 如果没有找到相同时间戳的数据，添加新数据
								this.klineData.push(newKline);
							}

							if (this.klineData.length > 900) {
								this.klineData.shift();
							}

							console.log(this.klineData[0])
							this.sendMessage()
							// that.updateChart(this.klineData);
						}
					}
				});

				this.ws.onError((error) => {
					console.error('WebSocket error:', error);
				});

				this.ws.onClose(() => {
					console.log('WebSocket disconnected');
				});
			},
			getTime(ts) {
				// 假设时间戳为 1672531200000 (以毫秒为单位)
				const timestamp = ts;

				// 创建 Date 对象
				const date = new Date(timestamp);

				// 获取年、月、日、小时、分钟、秒
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				const seconds = String(date.getSeconds()).padStart(2, '0');

				// 拼接为可读格式
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;



			},
			sendMessage() {
				const webview = this.$refs.webview;
				console.log(webview)
				if (webview) {
					const iframe = webview.iframe; // 获取 iframe 元素
					if (iframe && iframe.contentWindow) {
						// 使用 postMessage 发送消息
						iframe.contentWindow.postMessage({
								type: 'update_kline',
								data: this.klineData,
							},
							'*'
						);
					} else {
						console.error('Webview 内部未找到 iframe');
					}
				} else {
					console.error('Webview 未找到');
				}
			},
			updateChart(data) {
				// 发送消息到 H5 页面
				console.log("99990000")
				console.log(uni.webView)
				uni.webView.postMessage({
					data: {
						key: 'value',
						action: 'sendMessage'
					}
				});
				// 获取 Webview 的 ID (这里假设是 'webviewId')
				// let webview = plus.webview.getWebviewById('kline_webview');
				// if (webview) {
				//   // 使用 evalJS 传递消息，调用 Webview 页面中的 JS 代码
				//   webview.evalJS('handleMessageFromH5("Hello from H5!")');
				// }


				// 假设当前 Webview 的 id 为 'webview_id'

				// window.parent.postMessage({
				//     action: 'update_kline',
				//     data: this.klineData
				// }, '*');
			},

		}
	}
</script>

<style>

</style>