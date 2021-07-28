
export default {
  namespaced: true,
  // state
  state: {
    lastSync: null,
    inSync: false
  },

  // getters
  getters: {
    lastSync: state => state.lastSync,
    inSync: state => state.inSync
  },

  // mutations
  mutations: {
    SET_LAST_SYNC (state, lastSync) {
      state.lastSync = lastSync
    },
    SET_IN_SYNC (state, inSync) {
      state.inSync = inSync
    },
    CLEAR (state) {
      state.lastSync = null
      state.inSync = false
    }
  },

  // actions
  actions: {
    saveLastSync ({ commit }, { lastSync }) {
      commit('SET_LAST_SYNC', lastSync)
      window.localStorage.setItem('lastSyncTasks', lastSync)
    },
    startSync ({ commit }) {
      commit('SET_IN_SYNC', new Date())
      console.log('[synchronizationTasks] -', 'startSync', this.state.synchronizationTasks.inSync)
    },
    finishSync ({ commit }) {
      commit('SET_IN_SYNC', false)
      console.log('[synchronizationTasks] -', 'finishSync', this.state.synchronizationTasks.inSync)
    },
    async clearNotificationId ({ commit }) {
      commit('CLEAR')
      window.localStorage.removeItem('lastSyncTasks')
    }
  }
}
