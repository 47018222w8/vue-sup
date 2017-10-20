import Vue from 'vue'
import Router from 'vue-router'
import { JWT_HEADER } from '../components/constant'
import store from '../store/state'
import { CHANGE_LOADING } from '../store/mutation-type'
Vue.use(Router)
const login = r => require.ensure([], () => r(require('../page/login')), 'login')
const quote = r => require.ensure([], () => r(require('../page/quote')), 'quote')
const quoteList = r => require.ensure([], () => r(require('../page/quote-list')), 'quoteList')
const userCenter = r => require.ensure([], () => r(require('../page/user-center')), 'userCenter')
const supplierList = r => require.ensure([], () => r(require('../page/supplier-list')), 'supplierList')
const error = r => require.ensure([], () => r(require('../page/error')), 'error')
const chat = r => require.ensure([], () => r(require('../page/chat')), 'chat')
const carBrandList = r => require.ensure([], () => r(require('../page/car-brand-list')), 'carBrandList')
const router = new Router({
  routes: [{
    path: '',
    redirect: '/quote/list'
  }, {
    path: '/login',
    name: 'login',
    component: login
  }, {
    path: '/quote/list',
    name: 'quoteList',
    component: quoteList,
    // 是否缓存页面
    meta: { keepAlive: true },
    beforeEnter: (to, from, next) => {
      let a = localStorage.getItem(JWT_HEADER)
      if (a) {
        next()
      } else {
        next('/login')
      }
    }
  }, {
    path: '/quote/:insId',
    name: 'quote',
    component: quote
  }, {
    path: '/user/center',
    name: 'userCenter',
    component: userCenter
  }, {
    path: '/supplier/list',
    name: 'supplierList',
    component: supplierList
  }, {
    path: '/carBrand/list/:type',
    name: 'carBrandList',
    component: carBrandList
  }, {
    path: '/error',
    name: 'error',
    component: error
  }, {
    path: '/chat',
    name: 'chat',
    component: chat
  }]
})
router.beforeEach(function (to, from, next) {
  store.commit(CHANGE_LOADING, { isLoading: true })
  next()
})
router.afterEach(function (to) {
  store.commit(CHANGE_LOADING, { isLoading: false })
})
export default router
