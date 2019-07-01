import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'

import goods from '../components/goods/goods'
import ratings from '../components/ratings/ratings'
import seller from '../components/seller/seller'
// 注入
Vue.use(Router)
Vue.use(VueResource)

export default new Router({
  mode: 'history', // 去掉/#
  linkActiveClass: 'active', // 当激活时设置属性，导航栏切换
  routes: [
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    }
  ]
})
