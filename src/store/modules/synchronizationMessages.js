
export default {
  namespaced: true,
  // state
  state: {
    lastSync: null
  },

  // getters
  getters: {
    lastSync: state => state.lastSync
  },

  // mutations
  mutations: {
    SET_LAST_SYNC (state, lastSync) {
      state.lastSync = lastSync
    },

    CLEAR (state) {
      state.lastSync = null
    }
  },

  // actions
  actions: {
    saveLastSync ({ commit }, { lastSync }) {
      commit('SET_LAST_SYNC', lastSync)
      window.localStorage.setItem('lastSyncMessages', lastSync)
    },

    async clearNotificationId ({ commit }) {
      commit('CLEAR')
      window.localStorage.removeItem('lastSyncMessages')
    }
  }
}
