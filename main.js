import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App'
import messages from './locale/index'
import './uni.promisify.adaptor'

// kline相关配置
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { CandlestickChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, DataZoomComponent, TitleComponent } from 'echarts/components'
import { UniversalTransition } from 'echarts/features'
import { service } from './untils/request'
import { uploadFile } from './untils/request'
// 在 Vue 原型上挂载 service
Vue.prototype.$service = service
Vue.prototype.$uploadFile = uploadFile

// uView UI库配置（如果你使用了的话）
// #ifdef VUE3
import uView from 'uview-ui'
Vue.use(uView)
// #endif

// echarts配置
echarts.use([
  CanvasRenderer,
  CandlestickChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  TitleComponent,
  UniversalTransition
])
Vue.use(VueI18n)

// 从本地存储获取语言设置，如果没有则默认使用中文
const savedLanguage = uni.getStorageSync('language') || 'zh-Hans'

const i18n = new VueI18n({
  locale: savedLanguage,
  messages,
  silentTranslationWarn: true, // 关闭翻译警告
  fallbackLocale: 'zh-Hans' // 设置备用语言
})

Vue.config.productionTip = false

App.mpType = 'app'

// 开发环境使用相对路径，避免跨域问题

const app = new Vue({
  i18n,
  ...App
})

// #ifdef VUE3
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
app.$mount()
