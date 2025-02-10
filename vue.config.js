module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://www.jiuzhou.com',  // 目标接口域名
        changeOrigin: true,  // 是否跨域
        secure: false,  // 是否支持 HTTPS
        pathRewrite: {
          '^/api': ''  // 去掉 `/api` 前缀
        }
      }
    }
  }
}
