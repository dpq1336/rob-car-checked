var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  EVN_CONFIG: '"dev"',
  // BASE_URL: '"http://172.20.33.99:8081"',
  BASE_URL: '"http://photo.op.bitauto.com"',
  // BASE_URL: '"http://photo.op.bitauto.com"', //测试服务器接口地址

  // BASE_URL: '"http://photoapi.yiche.com"', //本机接口地址

  selectCarBaseUrl: '"http://172.20.4.55:3002"',
  // excelUrl: '"/api"',
  // BASE_URL: '"http://backend-gw.yiche.com/"',       //开发测试服务器接口地址
  V_CODE: '', //系统标识码
  AUTH_CODE: '"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0cnVlTmFtZSI6IueOi-aZuuaFpyIsInN1YiI6Indhbmd6aCIsImlzcyI6Im9wLXVjLWp3dCIsIm5hbWUiOiJ3YW5nemgiLCJleHAiOjE1NjQ4MTMyNjcsImlhdCI6MTU2NDcyNjg2NywidXNlcklkIjo5Njl9.ev6gMHyE0wmqsrRZhom63q4cQGEJbKZLx4mRczSw134"'
})

// //created生命周期
// conmentDidMount(
//   //调用这个函数
//   this.handleProductCount()
//   //重新绘制图表
//   '图表名'.setOption(this.state.souce)
// )
// conmentDidMount(
//   // 重新定义默认选中的应用
//   this.state.yingyong='应用A'
//   //再调用这个函数
//   this.handleProductCount()
// )
