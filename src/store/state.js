import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
Vue.use(Vuex)
const state = {
  insId: null, // 询价单id
  insInfoId: null, // 零件id
  scrollY: 0, // 滚动高度,
  isLoading: false, // url跳转等待图标
  carBrandHeights: [] // 品牌高度数组
}
export default new Vuex.Store({
  state,
  mutations
})
