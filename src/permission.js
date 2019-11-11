import router from './router'
import store from './store'
import NProgress from 'nprogress'           // Progress 进度条
import 'nprogress/nprogress.css'            // Progress 进度条样式
import { getToken,setToken } from '@/utils/auth'     // 验权
import { testUser } from '@/utils/testPermission'
const whiteList = ['/login', '/404']        //白名单,不需要登录的路由
router.beforeEach((to, from, next) => {
    console.log(process.env.NODE_ENV,"----------")
    if(process.env.NODE_ENV!="development"){
        testUser({
            prodId:process.env.NODE_ENV=="production"?process.env.V_CODE:"",
            testId:process.env.NODE_ENV=="testing"?process.env.V_CODE:""
        })
    }
    NProgress.start()
    if(process.env.NODE_ENV=="development"){
        setToken(process.env.AUTH_CODE)
    }
    if (getToken()) {
        //如果已经登录
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()                            // 结束Progress
        } else if (!store.getters.role) {
            store.dispatch('GetInfo').then(() => {
                next({...to })
            })
        } else {
            next()
        }
    } else if (whiteList.indexOf(to.path) !== -1) {      //如果前往的路径是白名单内的,就可以直接前往
        next()
    } else {                                             //如果路径不是白名单内的,而且又没有登录,就跳转登录页面
        console.log("跳转登录页----------")
        location.href="http://"+window.location.host
        NProgress.done()                                // 结束Progress
    }
})
router.afterEach(() => {
    NProgress.done()                                    // 结束Progress
})