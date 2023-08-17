const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://8.140.38.47:3001',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    })
  )
}
