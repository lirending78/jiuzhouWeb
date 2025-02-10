<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 获取系统语言
			const systemInfo = uni.getSystemInfoSync()
			const systemLanguage = systemInfo.language

			// 获取存储的语言设置
			const savedLanguage = uni.getStorageSync('language')

			// 如果没有存储的语言设置，则使用系统语言
			if (!savedLanguage) {
				const lang = systemLanguage.includes('zh') ? 'zh-Hans' : 'en'
				this.$i18n.locale = lang
				uni.setStorageSync('language', lang)
			} else {
				// 使用存储的语言设置
				this.$i18n.locale = savedLanguage
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	body {
		background-color: $bg-primary;
		//color: $text-primary;
	}
	.content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
		}
</style>
