const CHANGE_PART = 'CHANGE_PART'
const SCROLL_Y = 'SCROLL_Y'

export default {
  [CHANGE_PART](state, payload) {
    state.insInfoId = payload.insInfoId
  },
  [SCROLL_Y](state, payload) {
    state.scrollY = payload.scrollY
  }
}
