// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store/state'
import FastClick from 'fastclick'
import router from './router/router'
import App from './App'
import { ToastPlugin, LoadingPlugin, AlertPlugin, ConfirmPlugin } from 'vux'
import axios from 'axios'
import constant from './components/constant'
import statusCode from './components/status-code'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
FastClick.attach(document.body)
axios.defaults.baseURL = constant.BASE_URL
axios.defaults.headers.common[constant.JWT_HEADER] = localStorage.getItem(constant.JWT_HEADER)
axios.defaults.timeout = 10000
axios.interceptors.response.use(function (response) {
  let result = response.data
  if (result.code === statusCode.LOGIN_EXPIRED) {
    Vue.$vux.toast.text('登录超时,即将返回登录页', 'middle')
    setTimeout((e) => {
      router.push({
        name: 'login'
      })
    }, 1900)
  } else {
    return response
  }
}, function (err) {
  router.push({
    name: 'error'
  })
  throw err
  // return Promise.reject(err)
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
