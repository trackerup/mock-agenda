export default {
  namespaced: true,
  // state
  state: {
    forms: {},
    currentForm: null,
    loading: false
  },

  // getters
  getters: {
    forms: state => state.forms,
    currentForm: state => state.currentForm,
    loading: state => state.loading
  },

  // mutations
  mutations: {
    SET_FORMS (state, forms) {
      state.forms = forms
    },
    PUT_FORM (state, form) {
      state.forms[form.id] = form
    },
    SET_FORM (state, form) {
      state.currentForm = form
    },
    SET_LOADING (state, loading) {
      state.loading = loading
    }
  },

  // actions
  actions: {
    setForms ({ commit }, { forms }) {
      commit('SET_FORMS', forms)
    },

    putForm ({ commit }, { form }) {
      commit('PUT_FORM', form)
    },

    setCurrentForm ({ commit }, { form }) {
      commit('SET_FORM', form)
    },

    loading ({ commit }, status) {
      commit('SET_LOADING', status)
    }

  }
}
