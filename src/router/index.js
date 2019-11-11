import Vue from 'vue'
import Router from 'vue-router'

/* layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)
export const constantRouterMap = [{
    path: '/login',
    component: _import('login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: _import('404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index')
    }]
  },
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
export const asyncRouterMap = [{
    path: '/zhutieManage', //主贴管理
    component: Layout,
    redirect: '/zhutieManage/xfhsChecked',
    meta: {
      title: '功能菜单',
      icon: 'iconfont icon-ic_temp'
    },
    children: [{
        path: 'xfhsChecked',
        name: '拍车任务',
        hidden: false,
        component: _import('zhutieManage/xfhsChecked'),
        meta: {
          title: '审核列表',
          icon: 'iconfont icon-liebiao'

        },

      }, {
        path: 'dataExport',
        name: '数据导出',
        hidden: false,
        component: _import('zhutieManage/dataExport'),
        meta: {
          title: '数据导出',
          icon: 'iconfont icon-liebiao'

        },
      },

    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
