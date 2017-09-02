import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const home = r => require.ensure([], () => r(require('../page/home')), 'home')
const login = r => require.ensure([], () => r(require('../page/login')), 'login')
const quote = r => require.ensure([], () => r(require('../page/quote')), 'quote')
const quoteList = r => require.ensure([], () => r(require('../page/quote-list')), 'quoteList')
const userCenter = r => require.ensure([], () => r(require('../page/user-center')), 'userCenter')
export default new Router({
	routes: [{
		path: '',
		redirect:'/home'
	},{
		path: '/home',
		name: 'home',
		component: home
	},{
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
	}]
})