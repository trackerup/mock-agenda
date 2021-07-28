import { getAll } from '../../plugins/persistence/entities/locals'

export default {
  namespaced: true,
  // state
  state: {
    locais: {}
  },

  // getters
  getters: {
    locais: state => state.locais
  },

  // mutations
  mutations: {
    UPDATE_LOCALS (state, locais) {
      state.locais = locais
    }
  },

  // actions
  actions: {
    getLocals ({ commit }) {
      if (!this.state.locais || Object.keys(this.state.locais).length === 0) {
        getAll().then((result) => {
          if (typeof result != 'undefined') {
            commit('UPDATE_LOCALS', result)
          }
        })
      }
      return this.state.locals
    }
  }
}
