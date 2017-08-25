// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store/index'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import Home from './components/HelloFromVux'
import { ToastPlugin } from 'vux'
import { LoadingPlugin } from 'vux'

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(router)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app-box')