import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_URL,      // api的base_url
    // timeout: 15000,                  // 请求超时时间2
    // headers: {
    //     'Authorization':"Bearer "+'getToken()',
    // },
})


// request拦截器
service.interceptors.request.use(
    config => {
        config.headers.Authorization = "Bearer "+getToken()
        return config
    }, 
    error => {
        console.error(error)            // for debug
        Promise.reject(error)
    }
)

// respone拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.status && (res.status==500 || res.status==504 || res.status==403 || res.status==404)) {
            Message({
                message: `${res.message}`,
                type: 'error'
            })
        }
        // if (res.status && (res.status==401)) {      //token过期
        //     location.href="http://"+window.location.host  
        // }
        return res
    },
    error => {
        console.error('err' + error)    // for debug
        Message({
            message: error.message,
            type: 'error'
        })

        return Promise.reject(error)
    }
)
export default service