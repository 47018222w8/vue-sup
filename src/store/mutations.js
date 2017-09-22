const CHANGE_PART = 'CHANGE_PART'
const SCROLL_Y = 'SCROLL_Y'
const CHANGE_LOADING = 'CHANGE_LOADING'
const CALCULATE_BRAND_HEIGHT = 'CALCULATE_BRAND_HEIGHT'
export default {
  [CHANGE_PART](state, payload) {
    state.insInfoId = payload.insInfoId
  },
  [SCROLL_Y](state, payload) {
    state.scrollY = payload.scrollY
  },
  [CHANGE_LOADING](state, payload) {
    state.isLoading = payload.isLoading
  },
  [CALCULATE_BRAND_HEIGHT](state, payload) {
    state.carBrandHeights = payload.carBrandHeights
  }
}
