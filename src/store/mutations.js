import { CHANGE_LOADING, QUOTE_LIST_KEEP_ALIVE, SCREEN, REPORT_PRICE_LIST } from './mutation-type'
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
  }
}
