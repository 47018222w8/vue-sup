// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store/state'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import Home from './components/HelloFromVux'
import { ToastPlugin } from 'vux'
import { LoadingPlugin } from 'vux'
import  { AlertPlugin } from 'vux'
import axios from 'axios'
import constant from './components/constant'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(router)

FastClick.attach(document.body)
axios.defaults.baseURL = constant.BASE_URL;
axios.defaults.headers.common[constant.JWT_HEADER] = localStorage.getItem(constant.JWT_HEADER);
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app-box')