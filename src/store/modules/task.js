import { getTarefasByDate, getTarefasHoje } from '@/plugins/persistence/entities/tarefa'
import { setters } from '@/plugins/persistence/services'
import { logTask, logRotaForTask } from '@/plugins/persistence/entities/tarefaLog'
import store from '@/store'

export default {
  namespaced: true,
  // state
  state: {
    tasks: {
      all: [],
      interrompida: [],
      pendente: [],
      travelStarted: [],
      travelDone: [],
      iniciada: [],
      concluida: [],
      malsucedida: []
    },
    currentTask: null,
    loading: false,
    defaultPreResp: null,
    viewDate: new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0]
  },

  // getters
  getters: {
    tasks: state => Object.assign(state.tasks),
    currentTask: state => state.currentTask,
    viewDate: state => state.viewDate,
    defaultPreResp: state => state.defaultPreResp
  },

  // mutations
  mutations: {
    UPDATE_TASKS (state, tasks) {
      state.tasks = tasks
    },
    CLEAR (state) {
      state.tasks = {
        all: [],
        interrompida: [],
        pendente: [],
        travelStarted: [],
        travelDone: [],
        iniciada: [],
        concluida: [],
        malsucedida: []
      }
    },
    MARK_CURRENT_TASK_TO_SINC (state) {
      state.currentTask.sinc = 0
    },
    SET_CURRENT_TASK (state, task) {
      state.currentTask = task
      if (state.currentTask) {
        if (!state.currentTask.responses) {
          state.currentTask.responses = []
          setters.setOne('tarefas', task)
        }
      }
    },
    ADD_RESPONSE_CURRENT_TASK (state, response) {
      state.currentTask.sinc = 0
      if (!state.currentTask.responses) {
        state.currentTask.responses = []
      }
      if (Object.values(state.currentTask.responses).length >= 1 && response.id) {
        for (let index = 0; index < Object.values(state.currentTask.responses).length; index++) {
          const element = state.currentTask.responses[index]
          if (element.id == response.id &&
              element.data == response.data &&
              element.idTarefa == response.idTarefa) {
            state.currentTask.responses[index] = response
            return
          }
        }
      }
      state.currentTask.responses.push(response)
    },
    SET_RESPONSE_CURRENT_TASK (state, data) {
      state.currentTask.sinc = 0
      if (!state.currentTask.responses) {
        state.currentTask.responses = []
      }

      let sincIdFormResponse = (response, currentResponses) => {
        if (currentResponses && currentResponses && currentResponses.id && response) {
          response.id = currentResponses.id

          Object.values(currentResponses.responses).forEach((element) => {
            if (response.responses[element.idPergunta] && element.id) {
              response.responses[element.idPergunta].id = element.id
              if (element.tipo == 'formulario') {
                Object.values(element.valor).forEach((subElement, index) => {
                  sincIdFormResponse(response.responses[element.idPergunta].valor[index], subElement)
                })
              }
            }
          })
        }
      }
      let currentTaskAll = state.tasks.all.filter(task => { return state.currentTask.id == task.id })[0]
      if (currentTaskAll.responses && currentTaskAll.responses[data.index]) {
        sincIdFormResponse(data.response, currentTaskAll.responses[data.index])
      }
      state.currentTask.responses[data.index] = data.response
    },
    REMOVE_RESPONSE_CURRENT_TASK (state, data) {
      state.currentTask.sinc = 0
      if (!state.currentTask.responses) {
        state.currentTask.responses = []
      }
      state.currentTask.responses.splice(data.index, 1)
    },
    SET_DEFAULT_PRE_RESP (state, data) {
      state.defaultPreResp = data.preResp
    },
    UPDATE_DEFAULT_PRE_RESP (state, data) {
      state.defaultPreResp[data.key] = data.value
    },
    UPDATE_VIEW_DATE (state, date) {
      let tzoffset = date.getTimezoneOffset() * 60000
      const dataPesquisa = new Date(date - tzoffset).toISOString().split('T')[0]
      state.viewDate = dataPesquisa
    },
    ADD_LOG_CURRENT_TASK (state, log) {
      if (!state.currentTask.tarefa_log) {
        state.currentTask.tarefa_log = []
      }
      state.currentTask.tarefa_log.push(log)
    },
    UPDATE_TASK_DATA (state, data) {
      let stTask = state.tasks.all.filter(ele => {
        return ele.id == data.task.id
      })
      if (stTask && stTask.length > 0) {
        for (let index in data.properties) {
          if (data.properties.hasOwnProperty(index)) {
            stTask[0][index] = data.properties[index]
          }
        }
      }
    },
    UPDATE_TASK_VERSION (state, data) {
      let stTask = state.tasks.all.find(ele => {
        return ele.id == data.task.id
      })
      if (stTask) {
        stTask.versao = data.version
        if (state.currentTask && state.currentTask.id == data.task.id) {
          state.currentTask.versao = data.version
        }
      } else {
        data.task.versao = data.version
      }
    },
    UPDATE_CURRENT_TASK_STATUS (state, status) {
      state.currentTask.status = status
    },
    START_TRAVEL (state) {
      state.currentTask.status = 'travelStarted'
      let coordenadasAtuais = store.getters['user/coords']
      if (typeof coordenadasAtuais != 'undefined' && coordenadasAtuais != null) {
        state.currentTask.travelLat = coordenadasAtuais.latitude
        state.currentTask.travelLng = coordenadasAtuais.longitude
      }
      state.currentTask.travelStart = new Date().getTime()
    },
    STOP_TASK (state, pTask) {
      let task = state.tasks.all.find(ele => {
        return ele.id == pTask.id
      })
      if (task) {
        let statusTask = ['all', 'bloqueada', 'interrompida', 'pendente', 'travelStarted', 'travelDone', 'iniciada', 'concluida', 'malsucedida']
        for (let i = 0; i < statusTask.length; i++) {
          if (typeof state.tasks[statusTask[i]] != 'undefined') {
            if (Object.values(state.tasks[statusTask[i]]).find(tasks => tasks.id == task.id)) {
              const idx = Object.values(state.tasks[statusTask[i]]).findIndex(tasks => tasks.id == task.id)
              state.tasks[statusTask[i]].splice(idx, 1)
            }
          }
        }
      }
      task.status = 'interrompida'
      state.tasks.all.push(task)
      if (typeof state.tasks[task.status] == 'undefined' || !Array.isArray(state.tasks[task.status])) {
        state.tasks[task.status] = []
        state.tasks[task.status].push(task)
      } else {
        state.tasks[task.status].push(task)
      }
      if (state.currentTask && state.currentTask.id == task.id) {
        state.currentTask = task
      }
    },
    TRAVEL_DONE (state) {
      state.currentTask.status = 'travelDone'
      state.currentTask.travelEnd = new Date().getTime()
    },
    START_TASK (state) {
      state.currentTask.status = 'iniciada'
      const timeNow = new Date().getTime()
      state.currentTask.inicio = timeNow
      state.currentTask.taskStart = timeNow
      // Generate __wizardResponse
      const metaDataWizard = state.currentTask.metaDados.find(meta => meta.meta_key == '__wizardResponse')
      if (metaDataWizard && metaDataWizard.meta_value) {
        setters.setOne('wizardResponse', {
          idTarefa: parseInt(state.currentTask.id),
          wizardState: JSON.parse(metaDataWizard.meta_value)
        })
      }
    },
    DONE_TASK (state) {
      state.currentTask.status = 'concluida'
      const timeNow = new Date().getTime()
      state.currentTask.termino = timeNow
      state.currentTask.taskEnd = timeNow
      setters.deleteOne('task_download', state.currentTask.id)
      setters.deleteOne('wizardResponse', state.currentTask.id)
    },
    FAIL_TASK (state, comment) {
      state.currentTask.status = 'malsucedida'
      state.currentTask.coment = comment
      const timeNow = new Date().getTime()
      if (state.currentTask.travelStart == null || state.currentTask.travelStart == '') {
        state.currentTask.travelStart = timeNow
      }

      if (state.currentTask.travelEnd == null || state.currentTask.travelEnd == '') {
        state.currentTask.travelEnd = timeNow
      }

      if (state.currentTask.inicio == null || state.currentTask.inicio == '') {
        state.currentTask.inicio = timeNow
        state.currentTask.taskStart = timeNow
      }

      if (state.currentTask.termino == null || state.currentTask.termino == '') {
        state.currentTask.termino = timeNow
        state.currentTask.taskEnd = timeNow
      }
      setters.deleteOne('task_download', state.currentTask.id)
    },
    UPDATE_CURRENT_TASK_VERSION (state, version) {
      state.currentTask.versao = version
    },
    UPDATE_CURRENT_TASK_PRE_RESP (state, preResp) {
      if (typeof Object.values(state.currentTask.metaDados).find(metaDado => metaDado.meta_key == '__pre_resp') != 'undefined') {
        Object.values(state.currentTask.metaDados).find(metaDado => metaDado.meta_key == '__pre_resp').meta_value = preResp
      } else {
        state.currentTask.metaDados.push({'meta_key': '__pre_resp', 'meta_value': preResp})
      }
    },
    UPDATE_THIS_TASK (state, pTask) {
      let task = state.tasks.all.find(ele => {
        return ele.id == pTask.id
      })
      if (task) {
        let statusTask = ['all', 'bloqueada', 'interrompida', 'pendente', 'travelStarted', 'travelDone', 'iniciada', 'concluida', 'malsucedida']
        for (let i = 0; i < statusTask.length; i++) {
          if (typeof state.tasks[statusTask[i]] != 'undefined') {
            if (Object.values(state.tasks[statusTask[i]]).find(tasks => tasks.id == task.id)) {
              const idx = Object.values(state.tasks[statusTask[i]]).findIndex(tasks => tasks.id == task.id)
              state.tasks[statusTask[i]].splice(idx, 1)
            }
          }
        }
      }
      task = pTask
      state.tasks.all.push(task)
      if (typeof state.tasks[task.status] == 'undefined' || !Array.isArray(state.tasks[task.status])) {
        state.tasks[task.status] = []
        state.tasks[task.status].push(task)
      } else {
        state.tasks[task.status].push(task)
      }
      if (state.currentTask && state.currentTask.id == task.id) {
        state.currentTask = task
      }
      setters.setOne('tarefas', task)
    },
    DELETE_THIS_TASK (state, task) {
      let _task = state.tasks.all.find(ele => {
        return ele.id == task.id
      })
      if (_task) {
        let statusTask = ['interrompida', 'pendente', 'travelStarted', 'travelDone', 'iniciada', 'concluida', 'malsucedida']
        for (let i = 0; i < statusTask.length; i++) {
          if (typeof state.tasks[statusTask[i]] != 'undefined') {
            if (Object.values(state.tasks[statusTask[i]]).find(tasks => tasks.id == task.id)) {
              const idx = Object.values(state.tasks[statusTask[i]]).findIndex(tasks => tasks.id == task.id)
              state.tasks[statusTask[i]].splice(idx, 1)
            }
          }
        }
      }
      setters.deleteOne('tarefas', task.id)
    }
  },
  // actions
  actions: {
    saveTasks ({commit}, {tasks}) {
      let dataTasks = {
        all: [],
        interrompida: [],
        pendente: [],
        travelStarted: [],
        travelDone: [],
        iniciada: [],
        concluida: [],
        malsucedida: []
      }
      if (!Array.isArray(tasks)) {
        return false
      }
      tasks.forEach(task => {
        if (parseInt(task.deletada) == '0') {
          if (typeof dataTasks[task.status] == 'undefined') {
            dataTasks[task.status] = []
          }
          dataTasks[task.status].push(task)
          dataTasks['all'].push(task)
        }
      })
      commit('UPDATE_TASKS', dataTasks)
    },
    updateViewDate ({commit}, {date}) {
      commit('UPDATE_VIEW_DATE', date)
    },
    setCurrentTask ({commit}, {task}) {
      commit('SET_CURRENT_TASK', task)
    },
    updateTask ({commit}, {task}) {
      commit('UPDATE_THIS_TASK', task)
    },
    deleteTask ({commit}, {task}) {
      commit('DELETE_THIS_TASK', task)
    },
    addResponseCurrentTask ({commit}, {response}) {
      commit('ADD_RESPONSE_CURRENT_TASK', response)
      this.dispatch('task/saveTarefa', {task: this.state.task.currentTask})
    },
    setResponseCurrentTask ({commit}, {response, index}) {
      commit('SET_RESPONSE_CURRENT_TASK', {response: response, index: index})
      this.dispatch('task/saveTarefa', {task: this.state.task.currentTask})
    },
    removeResponseCurrentTask ({commit}, {response, index}) {
      commit('REMOVE_RESPONSE_CURRENT_TASK', {index: index})
      this.dispatch('task/saveTarefa', {task: this.state.task.currentTask})
    },
    saveTarefa ({commit}, {task}) {
      const _version = Number.isInteger(parseInt(task.versao)) ? parseInt(task.versao) + 1 : task.versao
      console.log('task :' + task.id, task.versao, _version)
      commit('UPDATE_THIS_TASK', task)
      commit('UPDATE_TASK_VERSION', { task: task, version: _version })
    },
    startTravel ({commit}) {
      const _status = 'travelStarted'
      if (['pendente', 'interrompida'].indexOf(this.state.task.currentTask.status) >= 0) {
        commit('START_TRAVEL')
        this.dispatch('task/saveTarefa', {task: this.state.task.currentTask})
        logTask(this.state.task.currentTask.id, _status, _status)
        if (process.env.NODE_ENV === 'production') {
          logRotaForTask(this.state.task.currentTask)
        }
      }
    },
    stopTask ({commit}, {task}) {
      const _status = 'interrompida'
      commit('STOP_TASK', task)
      this.dispatch('task/saveTarefa', {task: task})
      logTask(task.id, _status, _status)
    },
    travelDone ({commit}) {
      const _status = 'travelDone'
      if (this.state.task.currentTask.status == 'travelStarted') {
        commit('TRAVEL_DONE')
        this.dispatch('task/saveTarefa', {task: this.state.task.currentTask})
        logTask(this.state.task.currentTask.id, _status, _status)
      }
    },
    startTask ({commit}) {
      const _status = 'iniciada'
      if (this.state.task.currentTask.status == 'travelDone') {
        commit('START_TASK')
        this.dispatch('task/saveTarefa', {task: this.state.task.currentTask})
        logTask(this.state.task.currentTask.id, _status, _status)
      }
    },
    doneTask ({commit}, {responses}) {
      const _status = 'concluida'
      if (this.state.task.currentTask.status == 'iniciada') {
        responses.forEach(response => {
          if (response) commit('ADD_RESPONSE_CURRENT_TASK', response)
        })
        commit('DONE_TASK')
        this.dispatch('task/saveTarefa', {task: this.state.task.currentTask})
        logTask(this.state.task.currentTask.id, _status, _status)
      }
    },
    failTask ({commit}, {coment}) {
      const _status = 'malsucedida'
      let task = Object.assign({}, this.state.task.currentTask)
      task.status = _status
      commit('FAIL_TASK', coment)
      this.dispatch('task/saveTarefa', { task })
      logTask(task.id, _status, _status)
    },
    setDefaultPreResp ({commit}, {preResp}) {
      commit('SET_DEFAULT_PRE_RESP', {preResp: preResp})
    },
    updateDefaultPreResp ({commit}, {key, value}) {
      if (value) {
        commit('UPDATE_DEFAULT_PRE_RESP', {key: key, value: value})
      }
    },
    addLogCurrentTask ({commit}, {log}) {
      commit('ADD_LOG_CURRENT_TASK', log)
    },
    setCurrentTaskStatus ({commit}, {status}) {
      commit('UPDATE_CURRENT_TASK_STATUS', status)
      this.dispatch('task/saveTarefa', {task: this.state.task.currentTask})
    },
    setCurrentTaskPreResp ({commit}, {preResp}) {
      commit('UPDATE_CURRENT_TASK_PRE_RESP', preResp)
    },
    updateTaskData ({commit}, {task, data}) {
      commit('UPDATE_TASK_DATA', {task: task, properties: data})
    },
    setTaskVersion ({commit}, {task, version}) {
      commit('UPDATE_TASK_VERSION', {task: task, version: version})
      commit('UPDATE_THIS_TASK', task)
    },
    async getTasks ({ commit }) {
      let _self = this
      await getTarefasByDate().then(async (result) => {
        if (typeof result != 'undefined') {
          await _self.dispatch('task/saveTasks', {tasks: result})
        }
      })
    },
    async getTasksToday ({ commit }) {
      let _self = this
      await getTarefasHoje().then(async (result) => {
        if (typeof result != 'undefined') {
          await _self.dispatch('task/saveTasks', {tasks: result})
        }
      })
    },
    async clearNotificationId ({ commit }) {
      commit('CLEAR')
    }
  }
}
