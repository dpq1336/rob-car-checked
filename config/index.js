// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
module.exports = {
  build: {
    // Template for index.html
    // 添加test pre prod 三处环境的配制
    prodEnv: require('./prod.env'),
    testEnv: require('./test.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    //assetsSubDirectory: 'static',
    assetsSubDirectory: '',
    assetsPublicPath: './',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    host: '127.0.0.1',
    port: 9520,
    autoOpenBrowser: true,
    autoOpenPage: '/login',
    //assetsSubDirectory: 'static',
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://fpj-up.yiche.com',
        // target: 'http://172.20.4.11:9007',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }

    },


    cssSourceMap: false,
    devtool: 'cheap-module-eval-source-map'
  }
}
