import { CHANGE_LOADING, QUOTE_LIST_KEEP_ALIVE, SCREEN, REPORT_PRICE_LIST, HOME_TAB_INDEX, REGISTER_DATA, GET_MEMBER, CHANGE_ORDER_TAB_INDEX } from './mutation-type'
export default {
  [CHANGE_LOADING](state, payload) {
    state.isLoading = payload.isLoading
  },
  [QUOTE_LIST_KEEP_ALIVE](state, payload) {
    state.quoteListKeepAlive = payload.keepAlive
  },
  [SCREEN](state, payload) {
    state.screen = payload
  },
  [REPORT_PRICE_LIST](state, payload) {
    state.quote = payload
  },
  [HOME_TAB_INDEX](state, payload) {
    state.homeTabIndex = payload.index
  },
  [REGISTER_DATA](state, payload) {
    state.registerData = payload
  },
  [GET_MEMBER](state, payload) {
    state.member = payload.member
  },
  [CHANGE_ORDER_TAB_INDEX](state, payload) {
    state.orderTabIndex = payload.tabIndex
  }
}
