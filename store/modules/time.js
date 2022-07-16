import { SET_TIME } from '@/store/mutation-types'


const state = {
    lastTime: ''
}

const mutations = {
  [SET_TIME]: (state, value) => {
    state.lastTime = value
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
