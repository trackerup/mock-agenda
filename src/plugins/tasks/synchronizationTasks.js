import { post as sincronizarTodasAsTarefas } from '../../services/tasks'
import { mapGetters } from 'vuex'
import store from '@/store'
import { getVersaoTarefas, saveTarefasPosSync, syncTaskDownload, getTarefasOldForDelete } from '../persistence/entities/tarefa'
import user from '../persistence/entities/user'
import {getAllTarefasLogForSync, saveTarefasLogPosSync} from '../persistence/entities/tarefaLog'
import {atualizaPonto, getAllRegistroPontoForSync} from '@/plugins/persistence/entities/folhaPonto'
import moment from 'moment'

export default {
  data () {
    return {
      currentIntervalTasks: null,
      timeoutTasks: 20000,
      tarefas: []
    }
  },

  // Evitar de pegar dados do store no monted hook,
  // Pegar dados do store desta forma. Os dados ficam 'dinamicos' quando
  // mudam de estado. Se pegar os dados de store no mounted, a variavel
  // nunca sera atualizada, mantendo sempre o valor de quando o componente
  // foi montado.
  computed: {
    ...mapGetters({
      // tarefas: 'task/tasks',
      currentTask: 'task/currentTask',
      token: 'user/token',
      user: 'user/user'
    })
    /* tarefas: {
      async get () {
        return await store.getters['task/tasks'] || this.tarefas || { all: [] }
      },
      set () {}
    } */
  },

  async mounted () {
    this.deleteOldTasks()
    this.tarefas = store.getters['task/tasks']
    this.listenTarefas()

    if (this.token != null && this.token != '') {
      await this.makeTasksSync().catch(response => {
        console.log(response.msg)
      })
      this.initIntervalSyncTasks(this)
    }
  },
  methods: {
    deleteOldTasks () {
      this.$bus.$off('delete-old-tasks')
      this.$bus.$on('delete-old-tasks', () => {
        this.makeOldTasks().catch(response => { })
      })
    },
    listenTarefas () {
      let _self = this
      this.$bus.$off('tasks-sync')
      this.$bus.$on('tasks-sync', status => {
        if (this.currentIntervalTasks != null) {
          clearInterval(this.currentIntervalTasks)
          this.currentIntervalTasks = null
        }
        if (status == true) {
          this.makeTasksSync().finally(response => {
            if (_self.$el.querySelector('#tentar_novamente')) {
              _self.$el.querySelector('#tentar_novamente').innerHTML = 'Tentar novamente'
              _self.$el.querySelector('#tentar_novamente').disabled = false
            }
          })
          this.initIntervalSyncTasks(_self)
        }
      })
    },
    /**
     * Init tasks synchronization.
     *
     */
    initIntervalSyncTasks: function (_self) {
      this.currentIntervalTasks = setInterval(function () {
        _self.makeTasksSync()
      }, _self.timeoutTasks)
    },
    /**
     * Make tasks synchronization.
     *
     * @returns {Promise} Returns a promise according to the 'success' flag.
     */
    makeTasksSync: function (parent, showSnack = false, force = false) {
      let _self = parent || this
      const inSync = store.getters['synchronizationTasks/inSync']
      var now = new Date()
      var then = moment(now).subtract(5, 'minutes')
      if (inSync && moment(inSync).isAfter(then) && force == false) {
        return new Promise(async (resolve, reject) => {
          const mensagem = 'inSync'
          reject(mensagem)
        })
      }
      store.dispatch('synchronizationTasks/startSync')
      if (showSnack) {
        const snackbar = {
          message: _self.$t('Sincronizando dados'),
          duration: 10000
        }
        _self.$bus.$emit('showSnackBar', snackbar)
      }

      this.verifyDiskSpace()

      return new Promise((resolve, reject) => {
        return new Promise((resolve, reject) => {
          if (!_self.token) {
            const ret = {msg: _self.$t('Token não preenchido!')}
            console.log('Token não preenchido!')
            reject(ret)
          } else if (store.getters['user/user']) {
            getVersaoTarefas('tarefas').then((result) => {
              var relacaoTarefaVersao = JSON.stringify(result)
              // getTarefasHojeForSync('tarefas').then(async (result) => {
              getAllTarefasLogForSync().then((logs) => {
                // configuration to get tarefas
                let userId = store.getters['user/user'].id
                let data = store.getters['task/viewDate']
                if (_self.user && _self.user.id) {
                  userId = _self.user.id
                }
                const config = {
                  // tarefas: JSON.stringify(result),
                  tarefa_log: JSON.stringify(logs),
                  relacaoTarefaVersao: relacaoTarefaVersao,
                  pullTracker: {
                    id: userId,
                    act: 'sincronizarTarefas',
                    status: 'ok',
                    data: _self.$options.filters.formatDate(data)
                  },
                  user: _self.user.id,
                  bateria: store.getters['batteryStatus/level'] || '100'
                }
                getAllRegistroPontoForSync().then((pontos) => {
                  for (let index = 0; index < pontos.length; index++) {
                    atualizaPonto(pontos[index])
                  }
                })
                sincronizarTodasAsTarefas(config).then((data) => {
                  this.verifyDiskSpace()
                  if (data) {
                    // Atualizando as tarefas após a sincronização
                    user.synchronization(data, _self)
                    saveTarefasPosSync(data.tarefas, _self).then(function () {
                      //  saveTarefasSincronizadas(data.tarefasDeletadas).then(async function () {
                      //    saveTarefasSincronizadas(data.tarefasSincronizadas).then(async function () {
                      //      saveTarefasPosSync(data.tarefas).then(async function () {
                      saveTarefasLogPosSync(data.tarefas_log).then(function () {
                        try {
                          store.dispatch('task/getTasks', {})
                          syncTaskDownload(store.getters['task/tasks'].all)
                          resolve(data)
                        } catch (error) {
                          console.log(error)
                          reject(error)
                        }
                      }).catch(({ data }) => {
                        reject(data)
                      })
                      //    }).catch(({ data }) => {
                      //      reject(data)
                      //    })
                      //  }).catch(({ data }) => {
                      //    reject(data)
                      //  })
                    }).catch(({ data }) => {
                      reject(data)
                    })
                  }
                }).catch((json) => {
                  let data = json.data
                  console.log('sincronizarTodasAsTarefas', 'jwt_invalido')
                  if (!json.jwt_auth && json.jwt_auth_error) {
                    store.dispatch('user/logout')
                    _self.$geolocation.stopBackground()
                    _self.$router.push('/login')
                    if (_self.bgGeo) {
                      _self.bgGeo.stop()
                    }
                    const mensagem = json.jwt_auth_error
                    reject(mensagem)
                  } else {
                    const mensagem = data.mensagem || data.error
                    reject(mensagem)
                  }
                })
              })
              // })
            })
          } else {
            const mensagem = 'Nothing to do'
            reject(mensagem)
          }
        }).finally(function () {
          store.dispatch('synchronizationTasks/finishSync')
          _self.$bus.$emit('tasks-sync-finish', true)
          if (_self.$bus._events['tasks-syncAll-finish']) {
            _self.$bus.$emit('tasks-syncAll-finish', true)
          }
          resolve()
        })
      })
    },

    verifyDiskSpace: function () {
      if (window.cordova.exec) {
        window.cordova.exec(function (result) {
          // se menor que 138MB
          if ((result / 1024) < 138) {
            this.$bus.$emit('showSpaceMessageEmitted', {
              open: true
            })
          } else {
            this.$bus.$emit('showSpaceMessageEmitted', {
              open: false
            })
          }
        }.bind(this), function (error) {
          console.log('Error on verify disk size: ' + error)
        }, 'File', 'getFreeDiskSpace', [])
      }
    },
    makeOldTasks: function (parent) {
      let _self = parent || this

      return new Promise(async (resolve, reject) => {
        if (!_self.token) {
          const ret = {msg: _self.$t('Token não preenchido!')}
          console.log('Token não preenchido!')
          reject(ret)
        } else if (store.getters['user/user']) {
          getTarefasOldForDelete('tarefas').then(async (result) => {
            // result = tarefas
            console.log(result)
          })
        }
      })
    }
  }
}
