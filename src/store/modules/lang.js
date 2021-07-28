
export default {
  namespaced: true,
  // state
  state: {
    locale: 'pt',
    locales: {
      en: 'English',
      pt: 'Portuguese',
      es: 'Spanish'
    }
  },

  // getters
  getters: {
    locale: state => state.locale,
    locales: state => state.locales
  },

  // mutations
  mutations: {
    SET_LOCALE (state, { locale }) {
      state.locale = locale
    }
  },

  // actions
  actions: {
    setLocale ({ commit }, { locale }) {
      commit('SET_LOCALE', { locale })

      window.localStorage.setItem('locale', locale)
    }
  }
}
