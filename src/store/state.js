import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
Vue.use(Vuex)
const state = {
  // url跳转等待图标
  isLoading: false,
  // xheader状态 参考vux xheader
  xHeaderData: {
    leftOptions: {
      showBack: false,
      backText: '返回',
      preventGoBack: false
    },
    title: '找件儿',
    rightOptions: { showMore: false },
    menus: [{
      label: '刷新',
      type: 'Default',
      value: 'refresh'
    }]
  }
}
export default new Vuex.Store({
  state,
  mutations
})
