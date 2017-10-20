import {CHANGE_LOADING, X_HEADER_DATA} from './mutation-type'
export default {
  [CHANGE_LOADING](state, payload) {
    state.isLoading = payload.isLoading
  },
  [X_HEADER_DATA](state, payload) {
    state.xHeaderData = payload
  }
}
