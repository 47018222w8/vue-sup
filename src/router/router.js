import Vue from 'vue'
import Router from 'vue-router'
import constant from '../components/constant'
import store from '../store/state'
Vue.use(Router)
const home = r => require.ensure([], () => r(require('../page/home')), 'home')
const login = r => require.ensure([], () => r(require('../page/login')), 'login')
const quote = r => require.ensure([], () => r(require('../page/quote')), 'quote')
const quoteList = r => require.ensure([], () => r(require('../page/quote-list')), 'quoteList')
const userCenter = r => require.ensure([], () => r(require('../page/user-center')), 'userCenter')
const supplierList = r => require.ensure([], () => r(require('../page/supplier-list')), 'supplierList')
const error = r => require.ensure([], () => r(require('../page/error')), 'error')
const chat = r => require.ensure([], () => r(require('../page/chat')), 'chat')
const router = new Router({
  routes: [{
    path: '',
    redirect: '/home'
  }, {
    path: '/home',
    name: 'home',
    component: home,
    beforeEnter: (to, from, next) => {
      let a = localStorage.getItem(constant.JWT_HEADER)
      if (a) {
        next()
      } else {
        next('/login')
      }
    }
  }, {
    path: '/login',
    name: 'login',
    component: login
  }, {
    path: '/quote/list',
    name: 'quoteList',
    component: quoteList
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
  store.commit('CHANGE_LOADING', {isLoading: true})
  next()
})
router.afterEach(function (to) {
  store.commit('CHANGE_LOADING', {isLoading: false})
})
export default router
