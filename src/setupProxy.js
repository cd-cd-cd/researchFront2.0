const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://10.126.62.69:13001',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    })
  )
}
