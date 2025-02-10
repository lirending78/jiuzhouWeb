export const API_BASE_URL = '/api'

export const API_ENDPOINTS = {
  TRADING_PAIRS: '/common/get-trading-pairs',
  TRADE_BUY: '/orders/get-trad-buy',
  SEND_BUY_ORDER: '/orders/send-buy-order',
  SEND_SELL_ORDER: '/orders/send-sell-order'
}

// 环境配置
export const ENV = {
  development: {
    // API_BASE_URL: 'http://www.jiuzhouapi.isexgn.com',
    API_BASE_URL: 'http://www.jiuzhou.com',

  },
  production: {
    API_BASE_URL: 'http://www.jiuzhouapi.isexgn.com', // 生产环境 URL
  }
}

// 获取当前环境的配置
export const getCurrentEnv = () => {
    console.log(process.env.NODE_ENV);
  // #ifdef H5
  return process.env.NODE_ENV === 'development' ? ENV.development : ENV.production
  // #endif

  // #ifndef H5
  return ENV.production
  // #endif
}

// 导出当前环境的配置
export const currentConfig = getCurrentEnv()
