import Vue from 'vue'
import Router from 'vue-router'
import { JWT_HEADER } from '../components/constant'
import store from '../store/state'
import { QUOTE_LIST_KEEP_ALIVE, CHANGE_LOADING } from '../store/mutation-type'
Vue.use(Router)
const login = r => require.ensure([], () => r(require('@/page/login/login')), 'login')
const register = r => require.ensure([], () => r(require('@/page/login/register')), 'register')
const registerResult = r => require.ensure([], () => r(require('@/page/login/register-result')), 'registerResult')
const registerPhone = r => require.ensure([], () => r(require('@/page/login/register-phone')), 'registerPhone')
const pwdFind = r => require.ensure([], () => r(require('@/page/login/pwd-find')), 'pwdFind')
const quote = r => require.ensure([], () => r(require('@/page/quote/quote')), 'quote')
const quoteSuccess = r => require.ensure([], () => r(require('@/page/quote/quote-success')), 'quoteSuccess')
const quoteInfo = r => require.ensure([], () => r(require('@/page/quote/quote-info')), 'quoteInfo')
const quoteList = r => require.ensure([], () => r(require('@/page/quote/quote-list')), 'quoteList')
const quoteHistoryInfo = r => require.ensure([], () => r(require('@/page/quote/quote-history-info')), 'quoteHistoryInfo')
const supCarBrand = r => require.ensure([], () => r(require('@/page/shop/sup-car-brand')), 'supCarBrand')
const error = r => require.ensure([], () => r(require('@/page/error')), 'error')
const chat = r => require.ensure([], () => r(require('@/page/chat')), 'chat')
const carBrandList = r => require.ensure([], () => r(require('@/page/shop/car-brand-list')), 'carBrandList')
const carPartSorts = r => require.ensure([], () => r(require('@/page/shop/car-part-sorts')), 'carPartSorts')
// const home = r => require.ensure([], () => r(require('@/page/quote/home')), 'home')
// const newestQuote = r => require.ensure([], () => r(require('@/page/quote/quote-newest')), 'newestQuote')
// const screen = r => require.ensure([], () => r(require('@/page/quote/screen')), 'screen')
// const quoteHistory = r => require.ensure([], () => r(require('@/page/quote/quote-history')), 'quoteHistory')
const orders = r => require.ensure([], () => r(require('@/page/order/orders')), 'orders')
const order = r => require.ensure([], () => r(require('@/page/order/order')), 'order')
const send = r => require.ensure([], () => r(require('@/page/order/send')), 'send')
const shop = r => require.ensure([], () => r(require('@/page/shop/shop')), 'shop')
const supPartSort = r => require.ensure([], () => r(require('@/page/shop/sup-part-sort')), 'supPartSort')
const saleAnalysis = r => require.ensure([], () => r(require('@/page/shop/sale-analysis')), 'saleAnalysis')
const saleMan = r => require.ensure([], () => r(require('@/page/shop/sale-man')), 'saleMan')
const saleManAdd = r => require.ensure([], () => r(require('@/page/shop/sale-man-add')), 'saleManAdd')
const customer = r => require.ensure([], () => r(require('@/page/shop/customer')), 'customer')
const setting = r => require.ensure([], () => r(require('@/page/setting/setting')), 'setting')
const remind = r => require.ensure([], () => r(require('@/page/setting/remind')), 'remind')
const remindPhone = r => require.ensure([], () => r(require('@/page/setting/remind-phone')), 'remindPhone')
const pwdChange = r => require.ensure([], () => r(require('@/page/setting/pwd-change')), 'pwdChange')
const account = r => require.ensure([], () => r(require('@/page/setting/account')), 'account')
const businessScope = r => require.ensure([], () => r(require('@/page/setting/business-scope')), 'businessScope')
// 没有token的请求
// const noToken = ['login', 'register', 'registerPhone', 'registerResult', 'pwdFind']
const router = new Router({
  routes: [{
    path: '',
    redirect: '/quote/list'
  }, {
    path: '/login',
    name: 'login',
    component: login,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem(JWT_HEADER)) {
        next('/quote/list')
      } else {
        // 只要进入登录页就不再缓存
        store.commit(QUOTE_LIST_KEEP_ALIVE, { keepAlive: false })
        next()
      }
    }
  }, {
    path: '/register',
    name: 'register',
    component: register,
    beforeEnter: (to, from, next) => {
      // 直接跳页是不允许的
      let data = store.state.registerData
      if (data && data.code) {
        next()
      } else {
        next('/login')
      }
    }
  }, {
    path: '/registerPhone',
    name: 'registerPhone',
    component: registerPhone
  }, {
    path: '/registerResult',
    name: 'registerResult',
    component: registerResult
  }, {
    path: '/pwdFind',
    name: 'pwdFind',
    component: pwdFind
  }, {
    path: '/quote/list',
    name: 'quoteList',
    component: quoteList,
    // 是否缓存页面
    meta: { keepAlive: true, showTabbar: true }
  }, {
    path: '/quote/history/:insId',
    name: 'quoteHistoryInfo',
    component: quoteHistoryInfo
  }, {
    path: '/quote/:insId',
    name: 'quote',
    component: quote
  }, {
    path: '/quoteSuccess',
    name: 'quoteSuccess',
    component: quoteSuccess
  }, {
    path: '/quote/:insId/info',
    name: 'quoteInfo',
    component: quoteInfo
  }, {
    path: '/orders',
    name: 'orders',
    meta: { keepAlive: false, showTabbar: true },
    component: orders
  }, {
    path: '/orders/:insId',
    name: 'order',
    component: order
  }, {
    path: '/orders/:insId/send',
    name: 'send',
    component: send
  }, {
    path: '/shop',
    name: 'shop',
    meta: { showTabbar: true },
    component: shop
  }, {
    path: '/supCarBrand',
    name: 'supCarBrand',
    component: supCarBrand
  }, {
    path: '/supPartSort',
    name: 'supPartSort',
    component: supPartSort
  }, {
    path: '/customer',
    name: 'customer',
    component: customer
  }, {
    path: '/saleAnalysis',
    name: 'saleAnalysis',
    component: saleAnalysis
  }, {
    path: '/saleMan',
    name: 'saleMan',
    component: saleMan
  }, {
    path: '/saleManAdd',
    name: 'saleManAdd',
    component: saleManAdd
  }, {
    path: '/setting',
    name: 'setting',
    meta: { showTabbar: true },
    component: setting
  }, {
    path: '/pwdChange',
    name: 'pwdChange',
    component: pwdChange
  }, {
    path: '/account',
    name: 'account',
    component: account
  }, {
    path: '/businessScope/:memberId',
    name: 'businessScope',
    component: businessScope
  }, {
    path: '/remind',
    name: 'remind',
    component: remind
  }, {
    path: '/remindPhone',
    name: 'remindPhone',
    component: remindPhone
  }, {
    path: '/carBrand/list/:type',
    name: 'carBrandList',
    component: carBrandList
  }, {
    path: '/carPartSorts/:type',
    name: 'carPartSorts',
    component: carPartSorts
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
