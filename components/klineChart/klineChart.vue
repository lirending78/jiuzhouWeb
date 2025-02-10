<template>
	<view class="chart-container">
		<canvas ref="chart" type="2d" class="chart-canvas" @touchstart="touchStart" @touchmove="touchMove"
			@touchend="touchEnd"></canvas>
	</view>
</template>

<script>
	import * as echarts from 'echarts/core';
	import pako from 'pako';
	import {
		CanvasRenderer
	} from 'echarts/renderers';
	import {
		CandlestickChart
	} from 'echarts/charts';
	import {
		GridComponent,
		TooltipComponent,
		DataZoomComponent,
		TitleComponent
	} from 'echarts/components';
	import {
		UniversalTransition
	} from 'echarts/features';

	echarts.use([
		CanvasRenderer,
		CandlestickChart,
		GridComponent,
		TooltipComponent,
		DataZoomComponent,
		TitleComponent,
		UniversalTransition
	]);

	const formatTime = (timestamp) => {
		const date = new Date(timestamp);
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
	};

	export default {
		name: "KlineChart",
		props: {
			symbol: {
				type: String,
				default: 'btcusdt'
			},
			interval: {
				type: String,
				default: '1day'
			}
		},
		data() {
			return {
				klineData: [],
				chart: null,
				ws: null
			};
		},
		mounted() {
			this.$nextTick(() => {
				this.initCanvas();
			});
		},
		beforeDestroy() {
			if (this.ws) {
				this.ws.close();
			}
			if (this.chart) {
				this.chart.dispose();
			}
		},
		methods: {
			initCanvas() {
				// const canvas = this.$refs.chart;
				const uniCanvas = this.$refs.chart.$el;

				// 获取到 <uni-canvas> 内部的 <canvas> 元素
				const canvas = uniCanvas.querySelector('canvas');
				if (!canvas) {
					console.error('Canvas node is null or undefined');
					return;
				}
				console.log(canvas)
				const ctx = canvas.getContext('2d');
				if (!ctx) {
					console.error('Failed to get canvas context');
					return;
				}

				const dpr = uni.getSystemInfoSync().pixelRatio;
				canvas.width = canvas.offsetWidth * dpr;
				canvas.height = canvas.offsetHeight * dpr;
				ctx.scale(dpr, dpr);

				this.chart = echarts.init(canvas, null, {
					width: canvas.width,
					height: canvas.height,
					devicePixelRatio: dpr
				});

				this.updateChart();
				this.initWebSocket();
			},
			initWebSocket() {
				this.ws = uni.connectSocket({
					url: 'wss://api.huobi.pro/ws',
					complete: () => {}
				});

				this.ws.onOpen(() => {
					console.log('WebSocket connected');
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
						if (data.tick) {
							const newKline = {
								time: data.tick.id * 1000,
								open: data.tick.open,
								high: data.tick.high,
								low: data.tick.low,
								close: data.tick.close,
								volume: data.tick.vol
							};
							this.klineData.push(newKline);
							if (this.klineData.length > 100) {
								this.klineData.shift();
							}
							this.updateChart();
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
			updateChart() {
				if (!this.chart) return;

				const option = {
					backgroundColor: '#1f2329',
					title: {
						text: `${this.symbol.toUpperCase()} K线图`,
						left: 'center',
						textStyle: {
							color: '#e1e1e1'
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						},
						backgroundColor: 'rgba(255, 255, 255, 0.1)',
						borderColor: '#ccc',
						borderWidth: 1,
						textStyle: {
							color: '#e1e1e1'
						},
						formatter: (params) => {
							const data = params[0].data;
							return `
              时间: ${formatTime(data[0])}<br/>
              开盘: ${data[1]}<br/>
              收盘: ${data[2]}<br/>
              最低: ${data[3]}<br/>
              最高: ${data[4]}<br/>
              成交量: ${data[5]}
            `;
						}
					},
					xAxis: {
						type: 'category',
						data: this.klineData.map(item => item.time),
						axisLabel: {
							formatter: (value) => formatTime(value),
							color: '#e1e1e1'
						},
						axisLine: {
							lineStyle: {
								color: '#4c525e'
							}
						}
					},
					yAxis: {
						type: 'value',
						scale: true,
						axisLabel: {
							color: '#e1e1e1'
						},
						axisLine: {
							lineStyle: {
								color: '#4c525e'
							}
						},
						splitLine: {
							lineStyle: {
								color: '#2e3238'
							}
						}
					},
					series: [{
						type: 'candlestick',
						data: this.klineData.map(item => [item.time,item.open, item.close, item.low, item.high, item.volume]),
						itemStyle: {
							color: '#ef5350',
							color0: '#26a69a',
							borderColor: '#ef5350',
							borderColor0: '#26a69a'
						}
					}],
					dataZoom: [{
							type: 'inside',
							start: 50,
							end: 100
						},
						{
							show: true,
							type: 'slider',
							bottom: 10,
							start: 50,
							end: 100,
							textStyle: {
								color: '#e1e1e1'
							}
						}
					]
				};

				this.chart.setOption(option);
			},
			touchStart(e) {
				if (this.chart && e.changedTouches) {
					const touch = e.changedTouches[0];
					this.chart.getZr().handler.dispatch('mousedown', {
						zrX: touch.x,
						zrY: touch.y
					});
				}
			},
			touchMove(e) {
				if (this.chart && e.changedTouches) {
					const touch = e.changedTouches[0];
					this.chart.getZr().handler.dispatch('mousemove', {
						zrX: touch.x,
						zrY: touch.y
					});
				}
			},
			touchEnd(e) {
				if (this.chart) {
					this.chart.getZr().handler.dispatch('mouseup', {});
				}
			}
		},
		watch: {
			symbol() {
				this.klineData = [];
				if (this.ws) {
					this.ws.close();
				}
				this.initWebSocket();
			},
			interval() {
				this.klineData = [];
				if (this.ws) {
					this.ws.close();
				}
				this.initWebSocket();
			}
		}
	};
</script>

<style scoped>
	.chart-container {
		width: 100%;
		height: 400px;
	}

	.chart-canvas {
		width: 100%;
		height: 100%;
	}
</style>