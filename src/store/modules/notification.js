
export default {
  namespaced: true,
  // state
  state: {
    notificationId: null
  },

  // getters
  getters: {
    notificationId: state => state.notificationId
  },

  // mutations
  mutations: {
    SET_NOTIFICATION_ID (state, notificationId) {
      state.notificationId = notificationId
    },

    CLEAR (state) {
      state.notificationId = null
    }
  },

  // actions
  actions: {
    saveNotificationId ({ commit }, { notificationId }) {
      commit('SET_NOTIFICATION_ID', notificationId)
      window.localStorage.setItem('notificationId', notificationId)
    },

    async clearNotificationId ({ commit }) {
      commit('CLEAR')
      window.localStorage.removeItem('notificationId')
    }
  }
}
