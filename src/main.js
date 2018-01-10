// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store/state'
import FastClick from 'fastclick'
import router from './router/router'
import App from './App'
import { ToastPlugin, LoadingPlugin, AlertPlugin, ConfirmPlugin } from 'vux'
import axios from 'axios'
import { BASE_URL, JWT_HEADER } from './components/constant'
import { LOGIN_TO } from './store/mutation-type'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
FastClick.attach(document.body)
axios.defaults.baseURL = BASE_URL
axios.defaults.headers.common[JWT_HEADER] = localStorage.getItem(JWT_HEADER)
axios.defaults.timeout = 30000
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response) {
    let result = error.response
    if (result.status === 500 || result.status === 504) {
      router.push({
        name: 'error'
      })
      throw error
    } else if (result.status === 401 && result.data.code === 'AUTHORIZATION_EXPIRED') {
      localStorage.removeItem(JWT_HEADER)
      Vue.$vux.toast.text('登录超时,即将返回登录页', 'bottom')
      store.commit(LOGIN_TO, { obj: { name: router.app._route.name, params: router.app._route.params } })
      setTimeout(() => {
        router.push({
          name: 'login'
        })
      }, 1500)
      throw error
    } else {
      return Promise.reject(error)
    }
  } else {
    router.push({
      name: 'error'
    })
    throw error
  }
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
