import api from './api'

const appKey = {
  app_key: 100115
}

export function postDataFun(arg) {
  console.log("参数------", arg.data)
  let params = Object.assign(arg.data ? arg.data : {})
  const headers = Object.assign({}, {
    "Content-Type": "application/json"
  }, arg.headers)
  return api({
    // url:`${arg.url}?app_key=${appKey.app_key}`,
    url: `${arg.url}`,
    method: 'POST',
    headers: headers,
    // data:arg.data
    data: params
  })
}

export function getDataFun(arg) {
  console.log("参数------", arg.data)
  let params = Object.assign(arg.data ? arg.data : {})
  // let  params=Object.assign({},arg.data)

  const headers = Object.assign({}, {
    "Content-Type": "application/json"
  }, arg.headers)
  return api({
    url: arg.url,
    method: 'GET',
    headers: headers,
    params: params
  })
}
