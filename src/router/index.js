import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '../page/login'
import QuoteList from '../page/quote-list'
import Quote from '../page/quote'
import UserCenter from '../page/user-center'
Vue.use(Router)

export default new Router({
	routes: [{
		path: '/login',
		name: 'login',
		component: Login
	}, {
		path: '/tabbar/quote/list',
		name: 'quoteList',
		component: QuoteList
	}, {
		path: '/quote/:insId',
		name: 'quote',
		component: Quote
	}, {
		path: '/tabbar/user/center',
		name: 'userCenter',
		component: UserCenter
	}]
})