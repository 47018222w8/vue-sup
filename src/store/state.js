import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
Vue.use(Vuex)
const state = {
  // url跳转等待图标
  isLoading: false,
  // 缓存列表
  quoteListKeepAlive: true,
  // 筛选已报价列表参数
  screen: {
    insNo: '',
    beginDate: '',
    endDate: '',
    state: [{ key: 0, value: '全部' }],
    carBrand: [{ key: 0, value: '全部' }]
  },
  // 报价数据
  quote: null,
  // 首页tabindex
  homeTabIndex: 0,
  // 注册数据
  registerData: null,
  // 账号信息
  member: null,
  orderTabIndex: 0,
  // 登录后跳转路由对象
  loginTo: {name: 'quoteList'}
}
export default new Vuex.Store({
  state,
  mutations
})
