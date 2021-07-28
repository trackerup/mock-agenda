import { getAll } from '../../plugins/persistence/entities/message'

export default {
  namespaced: true,
  // state
  state: {
    messages: {},
    currentMessage: null,
    older: false,
    last: 0,
    loading: false
  },

  // getters
  getters: {
    messages: state => state.messages,
    last: state => state.last,
    older: state => state.older, // @TODO Var older não usada na API. Remover?
    currentMessage: state => state.currentMessage
  },

  // mutations
  mutations: {
    UPDATE_MESSAGES (state, messages) {
      state.messages = messages
    },
    SAVE_MESSAGE (state, message) {
      state.messages.push(message)
    },
    CLEAR (state) {
      state.messages = {}
      state.last = 0
      state.older = null
      state.currentMessage = ''
    },
    UPDATE_CURRENT_MESSAGE (state, message) {
      state.currentMessage = message
    },
    UPDATE_CURRENT_MESSAGE_STATUS (state, status) {
      state.currentMessage.status = status
    },
    UPDATE_MESSAGE_LAST (state, last) {
      state.last = last
    }
  },

  // actions
  actions: {
    saveMessages ({commit}, {messages}) {
      let dataMessages = {
        all: []
      }
      if (!Array.isArray(messages)) {
        return false
      }
      messages.forEach(message => {
        dataMessages['all'].push(message)
      })
      commit('UPDATE_MESSAGES', dataMessages)
    },
    saveMessage ({commit}, {message}) {
      commit('SAVE_MESSAGE', message)
    },
    setCurrentMessage ({commit}, {message}) {
      commit('UPDATE_CURRENT_MESSAGE', message)
    },
    setCurrentMessageStatus ({commit}, {status}) {
      commit('UPDATE_CURRENT_MESSAGE_STATUS', status)
    },
    setMessageLast ({commit}, {last}) {
      commit('UPDATE_MESSAGE_LAST', last)
    },
    getMessages ({ commit }) {
      let _self = this
      getAll('mensagens').then((result) => {
        if (typeof result != 'undefined') {
          _self.dispatch('message/saveMessages', {messages: result})
        }
      })
    },
    async clearNotificationId ({ commit }) {
      commit('CLEAR')
    }
  }
}
