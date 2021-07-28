import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import lang from './modules/lang'
import notification from './modules/notification'
import batteryStatus from './modules/batteryStatus'
import synchronization from './modules/synchronization'
import synchronizationTasks from './modules/synchronizationTasks'
import synchronizationMessages from './modules/synchronizationMessages'
import form from './modules/form'
import task from './modules/task'
import locals from './modules/locals'
import message from './modules/message'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  strictMode: process.env.NODE_ENV != 'production',
  key: process.env.APP_NAME + '_vuex',
  storage: window.localStorage,
  modules: ['route', 'user', 'task'],
  reducer: (state) => ({
    task: {
      currentTask: state.task.currentTask
    },
    route: state.route,
    user: state.user
  })
})

const store = new Vuex.Store({
  strict: process.env.NODE_ENV != 'production',
  modules: {
    user,
    lang,
    notification,
    batteryStatus,
    synchronization,
    synchronizationTasks,
    synchronizationMessages,
    form,
    task,
    locals,
    message
  },
  mutations: {
    RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION // this mutation **MUST** be named "RESTORE_MUTATION"
  }
  // plugins: [vuexPersist.plugin]
})

export default store
