
import { resetDB } from '@/plugins/persistence/config/index.js'

export default {
  namespaced: true,
  // state
  state: {
    user: window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : null,
    token: null,
    coords: null,
    startBackground: window.localStorage.getItem('startBackground') ? window.localStorage.getItem('startBackground') : 'false'
  },

  // getters
  getters: {
    user: state => state.user,
    token: state => state.token,
    coords: state => state.coords,
    check: state => state.user != null,
    startBackground: state => state.startBackground
  },

  // mutations
  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },
    SET_COORDS (state, coords) {
      state.coords = coords
    },

    SET_USER (state, user) {
      state.user = user
    },

    SET_CURRENT_ROUTE_STATUS (state, status) {
      state.user.route.status = status
    },

    LOGOUT (state) {
      resetDB().then(() => {
        window.localStorage.clear()
        window.location.reload()
      })
    },
    SET_START_BACKGROUND (state, startBackground) {
      state.startBackground = startBackground
    }
  },

  // actions
  actions: {
    saveToken ({ commit }, { token, remember }) {
      commit('SET_TOKEN', token)
      window.localStorage.setItem('token', token)
    },

    setCurrentCoords ({ commit }, { coords }) {
      commit('SET_COORDS', JSON.parse(JSON.stringify(coords)))
    },

    updateUser ({ commit }, { user, remember }) {
      commit('SET_USER', user)
      window.localStorage.setItem('user', JSON.stringify(user))
    },

    setCurrentRouteStatus ({ commit }, { status }) {
      commit('SET_CURRENT_ROUTE_STATUS', status)
    },
    setStartBackground ({ commit }, { status }) {
      commit('SET_START_BACKGROUND', status)
      window.localStorage.setItem('startBackground', status)
    },

    async logout ({ commit }) {
      commit('LOGOUT')
      window.localStorage.removeItem('token')
    }
  }
}
