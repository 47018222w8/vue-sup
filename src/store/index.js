import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
Vue.use(Vuex)
const state = {
	insId: null, //询价单id
	insInfoId: null //零件id
}
export default new Vuex.Store({
	state,
	mutations
})