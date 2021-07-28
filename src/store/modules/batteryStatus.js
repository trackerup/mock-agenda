
export default {
  namespaced: true,
  // state
  state: {
    isTrusted: null,
    level: null,
    isPlugged: null
  },

  // getters
  getters: {
    isTrusted: state => state.isTrusted,
    level: state => state.level,
    isPlugged: state => state.isPlugged
  },

  // mutations
  mutations: {
    SET_BATTERY_STATUS (state, batteryStatus) {
      state.isTrusted = batteryStatus.isTrusted
      state.level = batteryStatus.level
      state.isPlugged = batteryStatus.isPlugged
    },

    CLEAR (state) {
      state.isTrusted = null
      state.level = null
      state.isPlugged = null
    }
  },

  // actions
  actions: {
    saveBatteryStatus ({ commit }, { batteryStatus }) {
      commit('SET_BATTERY_STATUS', batteryStatus)
      window.localStorage.setItem('batteryStatus.isTrusted', batteryStatus.isTrusted)
      window.localStorage.setItem('batteryStatus.level', batteryStatus.level)
      window.localStorage.setItem('batteryStatus.isPlugged', batteryStatus.isPlugged)
    },

    async clearNotificationId ({ commit }) {
      commit('CLEAR')
      window.localStorage.removeItem('batteryStatus.isTrusted')
      window.localStorage.removeItem('batteryStatus.level')
      window.localStorage.removeItem('batteryStatus.isPlugged')
    }
  }
}
